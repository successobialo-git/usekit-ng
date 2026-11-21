"use client";
import {useEffect,useState} from "react";
import {Briefcase,FileImage,FileText,MessageCircle,Receipt,QrCode} from "lucide-react";
import ToolWorkbench from "@/components/ToolWorkbench";
import {tools} from "@/lib/tools";
type ToolSlug="qr-code-generator"|"image-compressor"|"invoice-generator"|"quotation-generator"|"cv-generator"|"whatsapp-link-generator";
const icons:Record<string,import("react").ComponentType<{size?:number;strokeWidth?:number}>>={
 "qr-code-generator":QrCode,"image-compressor":FileImage,"invoice-generator":Receipt,
 "quotation-generator":FileText,"cv-generator":Briefcase,"whatsapp-link-generator":MessageCircle
};
export default function WorkspaceShell({initialTool="qr-code-generator"}:{initialTool?:string}){
 const [active,setActive]=useState<ToolSlug>((initialTool as ToolSlug)||"qr-code-generator");
 useEffect(()=>{const requested=new URLSearchParams(window.location.search).get("tool");if(requested&&tools.some(t=>t.slug===requested))setActive(requested as ToolSlug);},[]);
 function choose(slug:ToolSlug){setActive(slug);window.history.replaceState(null,"","/workspace?tool="+slug);}
 return <main className="workspace-v2">
  <aside className="workspace-v2-sidebar" aria-label="All tools">
   <div className="workspace-v2-label">YOUR TOOLS</div>
   <nav>{tools.map((tool,index)=>{const Icon=icons[tool.slug]||FileText;return <button type="button" key={tool.slug} className={active===tool.slug?"active":""} onClick={()=>choose(tool.slug)} aria-current={active===tool.slug?"page":undefined} title={tool.name}><Icon size={18} strokeWidth={1.8}/><span>{tool.name}</span><small>{String(index+1).padStart(2,"0")}</small></button>;})}</nav>
  </aside>
  <section className="workspace-v2-main" aria-live="polite">
   <div className="workspace-v2-tool"><ToolWorkbench slug={active}/></div>
  </section>
 </main>;
}
