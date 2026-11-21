"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import QuickToolsPanel from "@/components/QuickToolsPanel";
import AdSenseUnit from "@/components/AdSenseUnit";
import {tools} from "@/lib/tools";
import {getBrowserSupabase} from "@/lib/supabase-browser";

const phrases=["your next invoice","a polished CV","a shareable QR code","smaller images","a better business day"];
const order=["qr-code-generator","image-compressor","invoice-generator","quotation-generator","cv-generator","whatsapp-link-generator"];
const photos:Record<string,string>={
 "qr-code-generator":"https://images.pexels.com/photos/3943951/pexels-photo-3943951.jpeg?auto=compress&cs=tinysrgb&w=1200",
 "image-compressor":"https://images.pexels.com/photos/7014918/pexels-photo-7014918.jpeg?auto=compress&cs=tinysrgb&w=1200",
 "invoice-generator":"https://images.pexels.com/photos/8297220/pexels-photo-8297220.jpeg?auto=compress&cs=tinysrgb&w=1200",
 "quotation-generator":"https://images.pexels.com/photos/8962460/pexels-photo-8962460.jpeg?auto=compress&cs=tinysrgb&w=1200",
 "cv-generator":"https://images.pexels.com/photos/7610452/pexels-photo-7610452.jpeg?auto=compress&cs=tinysrgb&w=1200",
 "whatsapp-link-generator":"https://images.pexels.com/photos/40716171/pexels-photo-40716171.jpeg?auto=compress&cs=tinysrgb&w=1200"
};
export default function Home(){
 const [word,setWord]=useState(0),[typed,setTyped]=useState(""),[deleting,setDeleting]=useState(false),[query,setQuery]=useState(""),[toolControls,setToolControls]=useState<Record<string,boolean>>({});
 useEffect(()=>{let active=true;void(async()=>{try{const {data}=await getBrowserSupabase().from("site_settings").select("value").eq("key","tool_controls").maybeSingle();if(active&&data?.value)setToolControls(data.value as Record<string,boolean>);}catch{/* Public tool browsing remains available if settings cannot load. */}})();return()=>{active=false;}},[]);
 useEffect(()=>{const phrase=phrases[word];const delay=!deleting&&typed===phrase?1450:deleting?42:92;const timer=window.setTimeout(()=>{if(!deleting&&typed===phrase){setDeleting(true);return;}if(deleting&&typed===""){setDeleting(false);setWord(v=>(v+1)%phrases.length);return;}setTyped(deleting?phrase.slice(0,Math.max(0,typed.length-1)):phrase.slice(0,typed.length+1));},delay);return()=>window.clearTimeout(timer);},[typed,deleting,word]);
 const ordered=order.map(s=>tools.find(t=>t.slug===s)).filter(Boolean);
 const filtered=ordered.filter(t=>toolControls[t!.slug]!==false&&(t!.name+" "+t!.short+" "+t!.category).toLowerCase().includes(query.toLowerCase()));
 return <main className="site-shell">
  <section className="center-hero home-hero">
    <span className="hero-eyebrow"><i/> PRACTICAL TOOLS FOR EVERYDAY PROGRESS</span>
    <h1>Make everyday work<br/>feel <em className="hero-changing">{typed}<span className="type-cursor">|</span></em>.</h1>
    <p>Create invoices, shape a stronger CV, compress images and PDFs, make QR codes and more. Thoughtful tools that help you get the little things done well.</p>
    <div className="center-actions"><a className="button-blue" href="#quick-tools">Explore free tools <span>↗</span></a><a className="quiet-link" href="#toolkit">See everything</a></div>
    <div className="home-proof"><span>MADE FOR THE WAY YOU WORK</span><div><b>Small businesses</b><i/><b>Freelancers</b><i/><b>Job seekers</b><i/><b>Creators</b><i/><b>Students</b></div></div>
  </section>
  <QuickToolsPanel/>
  <section className="toolkit-section" id="toolkit"><div className="toolkit-heading"><div><span className="section-kicker">ALL TOOLS</span><h2>Find your tool.<br/><em>Find your flow.</em></h2></div><div className="toolkit-intro"><p>Practical tools for business, work and everyday life. Choose what you need and get moving.</p><label className="search-control"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search all tools" aria-label="Search tools"/></label></div></div>
   <div className="photo-tool-grid">{filtered.map((tool,index)=><article className="photo-tool-card" key={tool!.slug}><div className="photo-tool-image"><img src={photos[tool!.slug]} alt="" loading={index>2?"lazy":"eager"}/><span className="photo-tool-shade"/></div><div className="photo-tool-meta"><span className="tool-number">0{index+1}</span><span className="tool-category">{tool!.tag}</span></div><div className="photo-tool-copy"><h3>{tool!.name}</h3><p>{tool!.short}</p><Link className="photo-tool-action" href={"/tools/"+tool!.slug}>Open tool</Link></div></article>)}</div>
   {filtered.length===0&&<p className="no-tools">No tools match that search. Try another word.</p>}
   <p className="toolkit-footer"><span>{filtered.length} PRACTICAL TOOLS</span></p>
  </section>
  <AdSenseUnit placement="home"/>
  <section className="feature-split"><article className="feature-dark"><span className="mini-label">BUILT FOR REAL EVERYDAY WORK</span><h2>Business-ready.<br/><em>Life-friendly.</em></h2><p>For freelancers, growing businesses and job seekers, UseKit brings practical tools together in one simple workspace.</p><div className="feature-tabs"><Link href="/#toolkit">For business owners</Link><Link href="/#toolkit">For professionals</Link><Link href="/#toolkit">For job seekers</Link></div><div className="dark-feature-bottom"><span>THE USEKIT PROMISE</span><strong>Useful by design.<br/>Simple to finish.</strong><Link href="/about">About UseKit</Link></div></article><article className="feature-portrait"><div className="lady-image"/><div className="portrait-wash"/><div className="portrait-copy"><span>MADE FOR YOUR NEXT MOVE</span><h3>Good work<br/>deserves good tools.</h3></div><div className="portrait-pills"><span>Free to use</span><span>Works on mobile</span></div></article></section>
  <section className="closing-stage"><div className="closing-art"/><div className="closing-content"><span className="section-kicker">A BETTER KIND OF EVERYDAY</span><h2>Start with one<br/><em>small win.</em></h2><p>Choose a tool, make it happen, and get back to what matters.</p><a className="button-blue" href="#quick-tools">Get started free</a></div></section>
 </main>;
}