"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
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
 useEffect(()=>{let active=true;void(async()=>{try{const {data}=await getBrowserSupabase().from("site_settings").select("value").eq("key","tool_controls").maybeSingle();if(active&&data?.value)setToolControls(data.value as Record<string,boolean>);}catch{/* Public tools remain available when settings cannot load. */}})();return()=>{active=false;}},[]);
 useEffect(()=>{const phrase=phrases[word];const delay=!deleting&&typed===phrase?1450:deleting?42:92;const timer=window.setTimeout(()=>{if(!deleting&&typed===phrase){setDeleting(true);return;}if(deleting&&typed===""){setDeleting(false);setWord(v=>(v+1)%phrases.length);return;}setTyped(deleting?phrase.slice(0,Math.max(0,typed.length-1)):phrase.slice(0,typed.length+1));},delay);return()=>window.clearTimeout(timer);},[typed,deleting,word]);
 const ordered=order.map(s=>tools.find(t=>t.slug===s)).filter(Boolean);
 const filtered=ordered.filter(t=>toolControls[t!.slug]!==false&&(t!.name+" "+t!.short+" "+t!.category).toLowerCase().includes(query.toLowerCase()));
 return <main className="site-shell home-redesign">
  <section className="center-hero">
   <span className="hero-eyebrow"><i/> FREE EVERYDAY DIGITAL TOOLS FOR NIGERIANS</span>
   <h1>Make everyday work<br/>feel <em className="hero-changing">{typed}<span className="type-cursor">|</span></em>.</h1>
   <p>Create professional invoices and quotations, build a stronger CV, compress images, make custom QR codes and share WhatsApp links. Free to use, no signup needed.</p>
   <div className="center-actions"><a className="button-blue" href="#toolkit">Try free tools</a><a className="quiet-link" href="#toolkit">Explore everything</a></div>
   <div className="hero-proof"><span>FREE TO USE</span><span>NO SIGNUP</span><span>MADE FOR NIGERIA</span></div>
  </section>
  <section className="toolkit-section home-toolkit" id="toolkit">
   <div className="toolkit-heading"><div><span className="section-kicker">THE USEKIT COLLECTION</span><h2>ONE WORKSPACE.<br/><em>SIX PRACTICAL TOOLS.</em></h2></div><div className="toolkit-intro"><p>Practical tools for business, work and everyday life. Choose what you need and get moving.</p><label className="search-control"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search all tools" aria-label="Search tools"/></label></div></div>
   <div className="photo-tool-grid">{filtered.map((tool,index)=><Link href={"/tools/"+tool!.slug} className="photo-tool-card" key={tool!.slug}><img src={photos[tool!.slug]} alt="" loading={index>2?"lazy":"eager"}/><span className="photo-tool-shade"/><div className="photo-tool-meta"><span>0{index+1}</span><span>{tool!.tag}</span></div><div className="photo-tool-copy"><h3>{tool!.name}</h3><p>{tool!.short}</p><span className="photo-tool-action">Open tool</span></div></Link>)}</div>
   {filtered.length===0&&<p className="no-tools">No tools match that search. Try another word.</p>}
   <p className="toolkit-footer">NO ACCOUNT REQUIRED TO GET STARTED <span>{filtered.length} PRACTICAL TOOLS</span></p>
  </section>
  <section className="feature-split home-story" id="why-usekit">
   <article className="feature-dark"><span className="mini-label">ONE WORKSPACE. SIX PRACTICAL TOOLS.</span><h2>Less busywork.<br/><em>More good work.</em></h2><p>From business owners and independent professionals to people building their next career move, UseKit keeps useful tools close and easy to use.</p><div className="feature-tabs"><Link href="/#toolkit">Business owners</Link><Link href="/#toolkit">Professionals</Link><Link href="/#toolkit">Job seekers</Link></div><div className="dark-feature-bottom"><span>THE USEKIT PROMISE</span><strong>Useful by design.<br/>Simple to finish.</strong><Link href="/about">About UseKit</Link></div></article>
   <article className="feature-portrait"><div className="lady-image"/><div className="portrait-wash"/><div className="portrait-copy"><span>USEKIT / EVERYDAY, MADE EASIER</span><h3>Good work deserves<br/>good tools.</h3></div><div className="portrait-pills"><span>Free to use</span><span>Works on mobile</span></div></article>
  </section>
  <section className="closing-stage home-closing"><div className="closing-art"/><div className="closing-content"><span className="section-kicker">MAKE SPACE FOR THE WORK THAT MATTERS</span><h2>Make your next task<br/><em>a little easier.</em></h2><p>Pick a tool and get straight to work. No account needed.</p><Link className="button-blue" href="/workspace">Open your workspace</Link></div></section>
 </main>;
}