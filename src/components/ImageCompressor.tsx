/* eslint-disable @next/next/no-img-element -- Local object URLs are used for previews. */
"use client";

import {useEffect,useRef,useState} from "react";
import Link from "next/link";
import {PDFDocument} from "pdf-lib";
import AdSenseUnit from "@/components/AdSenseUnit";
import {logToolUse} from "@/lib/supabase";
import {tools} from "@/lib/tools";

type Mode="image"|"pdf";
type PdfCompressionMode="preserve"|"maximum";
type Unit="KB"|"MB";
type ImageFormat="image/jpeg"|"image/webp"|"image/png";
type ImageOutput={name:string,url:string,size:number,original:number,targetMet:boolean};
const bytes=(value:number,unit:Unit)=>value*(unit==="MB"?1024*1024:1024);
const pretty=(size:number)=>size>=1024*1024?(size/1024/1024).toFixed(2)+" MB":(size/1024).toFixed(1)+" KB";
const percent=(before:number,after:number)=>before>0?Math.max(0,(1-after/before)*100):0;

export default function ImageCompressor(){
 const [mode,setMode]=useState<Mode>("image"),[imageFiles,setImageFiles]=useState<File[]>([]),[pdfFile,setPdfFile]=useState<File|null>(null),[pdfCompressionMode,setPdfCompressionMode]=useState<PdfCompressionMode>("preserve");
 const [target,setTarget]=useState("200"),[unit,setUnit]=useState<Unit>("KB"),[format,setFormat]=useState<ImageFormat>("image/jpeg");
 const [quality,setQuality]=useState(.84),[width,setWidth]=useState(""),[height,setHeight]=useState("");
 const [imageOutputs,setImageOutputs]=useState<ImageOutput[]>([]),[pdfUrl,setPdfUrl]=useState(""),[pdfSize,setPdfSize]=useState(0);
 const [originalPreview,setOriginalPreview]=useState(""),[notice,setNotice]=useState(""),[busy,setBusy]=useState(false),[dragging,setDragging]=useState(false);
 const imageInput=useRef<HTMLInputElement>(null),pdfInput=useRef<HTMLInputElement>(null),ownedUrls=useRef<string[]>([]);
 const targetBytes=bytes(Number(target),unit);
 useEffect(()=>()=>{ownedUrls.current.forEach(url=>URL.revokeObjectURL(url));},[]);
 function makeObjectUrl(blob:Blob){const url=URL.createObjectURL(blob);ownedUrls.current.push(url);return url;}

 function clearOutputs(){imageOutputs.forEach(x=>URL.revokeObjectURL(x.url));setImageOutputs([]);if(pdfUrl)URL.revokeObjectURL(pdfUrl);setPdfUrl("");setPdfSize(0);setNotice("");}
 function selectImages(files:FileList|File[]|null){if(!files)return;const selected=Array.from(files).filter(f=>f.type.startsWith("image/"));if(!selected.length){setNotice("Choose a supported image file.");return;}clearOutputs();setImageFiles(selected);if(originalPreview)URL.revokeObjectURL(originalPreview);setOriginalPreview(makeObjectUrl(selected[0]));}
 function selectPdf(file:File|null){if(!file)return;if(file.type!=="application/pdf"&&!file.name.toLowerCase().endsWith(".pdf")){setNotice("Choose a PDF file.");return;}clearOutputs();setPdfFile(file);}

 async function encodeCanvas(canvas:HTMLCanvasElement,mime:ImageFormat,q:number){return new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error("This browser could not encode the image.")),mime,q));}
 async function compressOne(source:File):Promise<ImageOutput>{
  const bitmap=await createImageBitmap(source);const maxW=Number(width)>0?Number(width):bitmap.width,maxH=Number(height)>0?Number(height):bitmap.height;
  const initialScale=Math.min(1,maxW/bitmap.width,maxH/bitmap.height);let best:Blob|null=null;
  const canvas=document.createElement("canvas"),ctx=canvas.getContext("2d");if(!ctx)throw new Error("Image processing is unavailable in this browser.");
  const qualities=format==="image/png"?[1]:Array.from(new Set([quality,.76,.66,.56,.46,.36,.26,.18,.12].filter(q=>q<=quality))).sort((a,b)=>b-a);
  const scales=[1,.92,.84,.76,.68,.60,.52,.44,.36,.30,.24,.18,.14,.10].map(x=>x*initialScale);
  outer:for(const s of scales){canvas.width=Math.max(1,Math.round(bitmap.width*s));canvas.height=Math.max(1,Math.round(bitmap.height*s));ctx.clearRect(0,0,canvas.width,canvas.height);ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);
   for(const q of qualities){const blob=await encodeCanvas(canvas,format,q);if(!best||Math.abs(blob.size-targetBytes)<Math.abs(best.size-targetBytes))best=blob;if(blob.size<=targetBytes){best=blob;break outer;}}
  }
  bitmap.close();if(!best)throw new Error("Could not compress "+source.name);
  const url=makeObjectUrl(best),ext=format==="image/jpeg"?"jpg":format==="image/webp"?"webp":"png";
  return {name:source.name.replace(/\.[^.]+$/,"")+"."+ext,url,size:best.size,original:source.size,targetMet:best.size<=targetBytes};
 }
 async function compressImages(){if(!imageFiles.length||!Number.isFinite(targetBytes)||targetBytes<=0){setNotice("Enter a valid target size greater than zero.");return;}clearOutputs();setBusy(true);setNotice("Compressing "+imageFiles.length+" image"+(imageFiles.length===1?"":"s")+" in your browser…");
  const results:ImageOutput[]=[];try{for(const f of imageFiles)results.push(await compressOne(f));setImageOutputs(results);const missed=results.filter(x=>!x.targetMet).length;setNotice(results.length+" image"+(results.length===1?"":"s")+" processed. "+(missed?missed+" could not reach the requested size; the closest result is ready.":"All images reached the requested size."));void logToolUse("image_compressor");}
  catch(e){results.forEach(x=>URL.revokeObjectURL(x.url));setNotice(e instanceof Error?e.message:"Image compression failed.");}finally{setBusy(false);}
 }

 async function renderPdf(scale:number,qualityValue:number,fileData:Uint8Array):Promise<Uint8Array>{
  const pdfjs=await import("pdfjs-dist/legacy/build/pdf.mjs");
  pdfjs.GlobalWorkerOptions.workerSrc=new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs",import.meta.url).toString();
  const source=await pdfjs.getDocument({data:fileData.slice(),isEvalSupported:false}).promise;
  const out=await PDFDocument.create();out.setTitle("");out.setAuthor("");out.setSubject("");out.setKeywords([]);out.setCreator("UseKit PDF Compressor");out.setProducer("UseKit PDF Compressor");
  try{for(let i=1;i<=source.numPages;i++){const page=await source.getPage(i),viewport=page.getViewport({scale});const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.floor(viewport.width));canvas.height=Math.max(1,Math.floor(viewport.height));const context=canvas.getContext("2d",{alpha:false});if(!context)throw new Error("PDF canvas is unavailable.");context.fillStyle="#ffffff";context.fillRect(0,0,canvas.width,canvas.height);await page.render({canvasContext:context,viewport,canvas} as Parameters<typeof page.render>[0]).promise;
    const blob=await encodeCanvas(canvas,"image/jpeg",qualityValue),jpg=await out.embedJpg(await blob.arrayBuffer());const p=out.addPage([viewport.width,viewport.height]);p.drawImage(jpg,{x:0,y:0,width:viewport.width,height:viewport.height});canvas.width=0;canvas.height=0;page.cleanup();}
   return await out.save({useObjectStreams:true,addDefaultPage:false});
  }finally{await source.destroy();}
 }
 async function compressPdf(){if(!pdfFile||!Number.isFinite(targetBytes)||targetBytes<=0){setNotice("Enter a valid target size greater than zero.");return;}clearOutputs();setBusy(true);setNotice("Reading PDF locally and preparing compressed versions…");
  try{const data=new Uint8Array(await pdfFile.arrayBuffer());let best:Uint8Array;let resultMessage="";
   if(pdfCompressionMode==="preserve"){
    setNotice("Optimising PDF structure while preserving selectable text, links and vector content…");
    const originalDoc=await PDFDocument.load(data.slice(),{updateMetadata:false});
    const originalPageCount=originalDoc.getPageCount();
    const optimized=await originalDoc.save({useObjectStreams:true,addDefaultPage:false});
    const candidate=optimized.byteLength<data.byteLength?optimized:data;
    const pdfjs=await import("pdfjs-dist/legacy/build/pdf.mjs");
    pdfjs.GlobalWorkerOptions.workerSrc=new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs",import.meta.url).toString();
    const readPdfText=async(fileData:Uint8Array)=>{
     const document=await pdfjs.getDocument({data:fileData.slice(),isEvalSupported:false}).promise;
     const pageTexts:string[]=[];
     try{for(let i=1;i<=document.numPages;i++){const page=await document.getPage(i);const content=await page.getTextContent();pageTexts.push(content.items.filter((item)=>"str" in item).map((item)=>item.str).join(""));page.cleanup();}}
     finally{await document.destroy();}
     return {pageCount:pageTexts.length,pageTexts};
    };
    const [originalCheck,outputCheck]=await Promise.all([readPdfText(data),readPdfText(candidate)]);
    if(outputCheck.pageCount!==originalPageCount||outputCheck.pageCount!==originalCheck.pageCount)throw new Error("PDF validation failed: the page count changed. No compressed file was produced; your original remains untouched.");
    const textIsUnchanged=originalCheck.pageTexts.every((pageText,index)=>pageText===outputCheck.pageTexts[index]);
    if(!textIsUnchanged&&candidate!==data)throw new Error("PDF validation found a text-content change. The optimised copy was rejected to protect your document; please keep using your original PDF.");
    best=candidate;
    const extractedText=originalCheck.pageTexts.some(pageText=>pageText.trim().length>0);
    const reduction=percent(data.byteLength,best.byteLength);
    resultMessage=candidate===data
     ?"No smaller text-preserving version was produced, so your original PDF is returned unchanged. Text-only PDFs often contain very little removable data."
     :"Safe structural optimisation completed. Selectable text was checked against the original; page count is unchanged. Some advanced PDF features (such as interactive forms, signatures or annotations) may not be fully preserved by browser-based re-saving, so keep your original.";
    if(best.byteLength>targetBytes)resultMessage+=" Your requested target ("+pretty(targetBytes)+") is below what this safe mode could achieve. The tool will not damage or flatten your document just to force that size.";
    else if(candidate!==data)resultMessage+=" File size reduced by "+reduction.toFixed(1)+"%.";
    if(!extractedText)resultMessage+=" No selectable text layer was detected; this may be a scanned/image-only PDF.";
   }else{
    let smallest:Uint8Array|null=null,bestDiff=Infinity,finished=false;const qualities=[.84,.72,.60,.48,.36,.26,.18,.12];const scales=[1,.9,.8,.7,.6,.5,.42,.35,.28,.22,.16,.12];
    for(const scale of scales){for(const q of qualities){setNotice("Maximum compression… testing "+Math.round(scale*100)+"% page scale and "+Math.round(q*100)+"% image quality. Text will be flattened.");const candidate=await renderPdf(scale,q,data);const diff=Math.abs(candidate.byteLength-targetBytes);if(diff<bestDiff){smallest=candidate;bestDiff=diff;}if(candidate.byteLength<=targetBytes){smallest=candidate;finished=true;break;}if(scale<=.12&&q<=.12)break;}if(finished)break;}
    if(!smallest)throw new Error("Could not compress this PDF.");best=smallest;resultMessage=best.byteLength<=targetBytes?"PDF compressed to the requested size.":"The closest maximum-compression result is ready; the target could not be reached.";
   }
   const blob=new Blob([best as BlobPart],{type:"application/pdf"}),url=URL.createObjectURL(blob);setPdfUrl(url);setPdfSize(blob.size);setNotice(resultMessage);void logToolUse("pdf_compressor");
  }catch(e){setNotice(e instanceof Error?e.message:"PDF compression failed. Try a smaller PDF or a modern browser.");}finally{setBusy(false);}
 }

 function handleDrop(e:React.DragEvent<HTMLDivElement>){e.preventDefault();setDragging(false);const file=e.dataTransfer.files?.[0];if(file)selectPdf(file);}
 const saved=pdfFile&&pdfSize>0?percent(pdfFile.size,pdfSize):0;
 return <section className="tool-app-frame image-pdf-frame">
  <div className="tool-app-sidebar"><div className="tool-app-brand"><img src="/usekit-mark.svg" alt=""/>UseKit</div><span>WORKSPACE</span><span>ALL TOOLS</span>{tools.map(tool=><Link key={tool.slug} className={tool.slug==="image-compressor"?"selected":""} href={"/tools/"+tool.slug}>{tool.name}</Link>)}<div className="tool-sidebar-note">Compress images and PDFs to the size your form or portal requires. Processing stays on your device.</div></div>
  <div className="tool-app-main">
   <div className="tool-app-top"><div><span className="document-eyebrow">USEKIT / FILE TOOLS</span><h2>Compress Image &amp; PDF</h2><p>Choose your file type and enter any target size. Your files stay on this device.</p></div></div>
   <div className="compress-tabs" role="tablist" aria-label="Choose file type"><button type="button" role="tab" aria-selected={mode==="image"} className={mode==="image"?"active":""} onClick={()=>{setMode("image");setNotice("");}}>Image</button><button type="button" role="tab" aria-selected={mode==="pdf"} className={mode==="pdf"?"active":""} onClick={()=>{setMode("pdf");setNotice("");}}>PDF</button></div>
   {mode==="image"?<div className="image-studio-grid">
    <div className="document-card"><span className="document-eyebrow">01 / UPLOAD</span><h3>Choose your image</h3><div className="field"><label>Image file or batch selection</label><input ref={imageInput} type="file" accept="image/*" multiple onChange={e=>selectImages(e.target.files)}/></div>{imageFiles.length>0&&<p className="document-hint">{imageFiles.length} image{imageFiles.length===1?"":"s"} selected · {pretty(imageFiles.reduce((sum,x)=>sum+x.size,0))}</p>}
     <span className="document-eyebrow">02 / TARGET SIZE</span><div className="document-grid target-size-row"><div className="field"><label>Target size</label><input type="number" min="0.01" step="any" value={target} onChange={e=>setTarget(e.target.value)} placeholder="e.g. 43 or 1.2"/></div><div className="field"><label>Unit</label><select value={unit} onChange={e=>setUnit(e.target.value as Unit)}><option>KB</option><option>MB</option></select></div></div>
     <div className="document-grid"><div className="field"><label>Output format</label><select value={format} onChange={e=>setFormat(e.target.value as ImageFormat)}><option value="image/jpeg">JPEG · smaller files</option><option value="image/webp">WebP · modern web</option><option value="image/png">PNG · lossless</option></select></div><div className="field"><label>Starting quality · {Math.round(quality*100)}%</label><input type="range" min=".2" max=".95" step=".05" value={quality} onChange={e=>setQuality(Number(e.target.value))}/></div><div className="field"><label>Max width (px)</label><input type="number" min="1" value={width} onChange={e=>setWidth(e.target.value)} placeholder="Original"/></div><div className="field"><label>Max height (px)</label><input type="number" min="1" value={height} onChange={e=>setHeight(e.target.value)} placeholder="Original"/></div></div>
     <button className="document-next" disabled={!imageFiles.length||busy} onClick={compressImages}>{busy?"Compressing…":imageFiles.length>1?"Compress "+imageFiles.length+" images":"Compress image"}</button>
     {imageOutputs.length>0&&<div className="result-panel"><strong>Compression results</strong>{imageOutputs.map((x,i)=><p key={x.name+i}><a href={x.url} download={x.name}>{x.name} · {pretty(x.size)}</a><small> from {pretty(x.original)} · {x.targetMet?"Target reached":"Closest possible result"}</small></p>)}</div>}
     {notice&&<p className="document-notice" aria-live="polite">{notice}</p>}
     {imageOutputs[0]&&<a className="quick-download" href={imageOutputs[0].url} download={imageOutputs[0].name}>Download compressed image</a>}
    </div><aside className="qr-live-preview"><span className="document-eyebrow">PREVIEW</span>{imageOutputs[0]?<div className="image-compare"><div><span>ORIGINAL</span>{originalPreview&&<img src={originalPreview} alt="Original image preview"/>}</div><div><span>COMPRESSED</span><img src={imageOutputs[0].url} alt="Compressed image preview"/></div></div>:<div className="quick-empty"><strong>Your result appears here</strong><span>Upload an image and set your target size.</span></div>}<p>Image compression runs locally. The tool adjusts quality and dimensions to reach your requested size or the closest possible result.</p></aside>
   </div>:<div className="image-studio-grid">
    <div className="document-card"><span className="document-eyebrow">01 / UPLOAD PDF</span><h3>Choose your PDF</h3><div className={"pdf-dropzone "+(dragging?"dragging":"")} onDragOver={e=>{e.preventDefault();setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={handleDrop} onClick={()=>pdfInput.current?.click()} role="button" tabIndex={0} onKeyDown={e=>{if(e.key==="Enter"||e.key===" "){e.preventDefault();pdfInput.current?.click();}}}><input ref={pdfInput} type="file" accept="application/pdf,.pdf" hidden onChange={e=>selectPdf(e.target.files?.[0]||null)}/><span className="pdf-drop-icon">PDF</span><strong>Drag &amp; drop your PDF here</strong><span>or click to browse files</span></div>
     {pdfFile&&<div className="pdf-file-info"><strong>{pdfFile.name}</strong><span>Original size: {pretty(pdfFile.size)}</span></div>}
     <span className="document-eyebrow">02 / COMPRESSION MODE</span><div className="field"><label>Choose how to compress</label><select value={pdfCompressionMode} onChange={e=>{setPdfCompressionMode(e.target.value as PdfCompressionMode);clearOutputs();}}><option value="preserve">Recommended · Keep text selectable</option><option value="maximum">Maximum · Smallest file (flattens pages)</option></select></div>
     <p className="document-hint">{pdfCompressionMode==="preserve"?"Does not rasterise pages and checks that extracted text and page count match the original. Text-only PDFs may have very little removable data, so size reduction can be small. Keep the original for signatures, forms and other advanced PDF features.":"Rebuilds each page as an image for stronger size reduction. Text, links, forms and accessibility structure will not remain interactive or searchable."}</p>
     <span className="document-eyebrow">03 / TARGET SIZE</span><div className="document-grid target-size-row"><div className="field"><label>Target size</label><input type="number" min="0.01" step="any" value={target} onChange={e=>setTarget(e.target.value)} placeholder="e.g. 200"/></div><div className="field"><label>Unit</label><select value={unit} onChange={e=>setUnit(e.target.value as Unit)}><option>KB</option><option>MB</option></select></div></div>
     <button className="document-next" disabled={!pdfFile||busy} onClick={compressPdf}>{busy?"Compressing PDF…":pdfCompressionMode==="preserve"?"Optimise PDF · Keep text":"Compress PDF · Maximum"}</button>
     {notice&&<p className="document-notice" aria-live="polite">{notice}</p>}
     {pdfUrl&&pdfFile&&<div className="pdf-result-panel"><div><span>ORIGINAL</span><strong>{pretty(pdfFile.size)}</strong></div><div><span>COMPRESSED</span><strong>{pretty(pdfSize)}</strong></div><div><span>SIZE SAVED</span><strong>{saved.toFixed(1)}%</strong></div><a className="document-next" href={pdfUrl} download={pdfFile.name.replace(/\.pdf$/i,"")+"_compressed.pdf"}>Download compressed PDF</a></div>}
     <p className="document-hint">Recommended mode prioritises readable content over a forced target size. Text-only PDFs may barely shrink. Maximum mode rasterises pages and removes selectable text and interactive features. Always keep your original PDF.</p>
    </div><aside className="qr-live-preview"><span className="document-eyebrow">PDF COMPRESSION</span><div className="quick-empty"><strong>{pdfFile?pdfFile.name:"Your PDF result appears here"}</strong><span>{pdfFile?"Original: "+pretty(pdfFile.size):"Drop a PDF or browse to choose one."}</span>{pdfUrl&&<span>Compressed: {pretty(pdfSize)} · {saved.toFixed(1)}% saved</span>}</div><p>PDF processing is performed in your browser. No file is sent to a server.</p></aside>
   </div>}
   <AdSenseUnit placement="tool"/><AdSenseUnit placement="tool"/><AdSenseUnit placement="tool"/>
   <div className="tool-promo"><div><span>USEKIT / EVERYDAY TOOLS</span><h2>More useful tools, less everyday friction.</h2><p>Explore free tools built for Nigerian businesses and everyday tasks.</p></div><Link href="/workspace">Explore all tools</Link></div>
   <section className="faq"><h2>Image &amp; PDF compression FAQs</h2>
    <details className="faq-item"><summary>How do I compress an image to a specific KB size?</summary><p>Select Image, upload your file, enter your exact target number and choose KB or MB. UseKit adjusts image quality and dimensions to get as close as possible.</p></details>
    <details className="faq-item"><summary>Can I compress images for JAMB or NYSC portals?</summary><p>Yes. Enter the file-size requirement shown by the portal. Always check the portal&apos;s image dimensions and format requirements too.</p></details>
    <details className="faq-item"><summary>How to compress PDF to 200KB?</summary><p>Select PDF, upload your file, enter 200 and choose KB, then select Compress PDF. The tool tests page scale and image quality and returns a file at or below 200KB when possible, or the closest result it can produce.</p></details>
    <details className="faq-item"><summary>Can I compress PDF to any size?</summary><p>You can enter a target size in KB or MB, but that does not mean every PDF can safely reach it. Text-only PDFs may contain very little removable data. Recommended mode keeps the original unchanged when it cannot make a smaller safe copy, and clearly explains when your target is not achievable without flattening or damaging content.</p></details>
    <details className="faq-item"><summary>Are my images and PDFs uploaded?</summary><p>No. Processing happens locally in your browser. Your files are not uploaded to UseKit&apos;s servers.</p></details>
   </section>
  </div>
 </section>;
}
