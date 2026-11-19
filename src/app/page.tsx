"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import {tools} from "@/lib/tools";
import {getBrowserSupabase} from "@/lib/supabase-browser";

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
 const [query,setQuery]=useState(""),[toolControls,setToolControls]=useState<Record<string,boolean>>({});
 useEffect(()=>{let active=true;void(async()=>{try{const {data}=await getBrowserSupabase().from("site_settings").select("value").eq("key","tool_controls").maybeSingle();if(active&&data?.value)setToolControls(data.value as Record<string,boolean>);}catch{/* Public tools remain available when settings cannot load. */}})();return()=>{active=false;}},[]);
 const ordered=order.map(s=>tools.find(t=>t.slug===s)).filter(Boolean);
 const filtered=ordered.filter(t=>toolControls[t!.slug]!==false&&(t!.name+" "+t!.short+" "+t!.category).toLowerCase().includes(query.toLowerCase()));
 return <main className="site-shell home-redesign">
  <section className="reference-hero">
   <div className="reference-hero-inner">
    <div className="reference-hero-copy"><span className="hero-eyebrow"><i/> YOUR EVERYDAY DIGITAL TOOLKIT</span><h1>Make everyday work <em>a little easier.</em></h1><p>Practical tools for business, work and everyday life. Create invoices, build your CV, compress images, make QR codes and share WhatsApp links — all in one simple place.</p><div className="center-actions"><Link className="button-blue" href="#toolkit">Explore free tools <span aria-hidden="true">↗</span></Link><Link className="quiet-link" href="/about">Get to know UseKit</Link></div><div className="hero-proof"><span>FREE TO USE</span><span>NO SIGNUP NEEDED</span><span>MADE FOR NIGERIA</span></div></div>
    <div className="reference-hero-visual"><div className="hero-orbit hero-orbit-one"/><div className="hero-orbit hero-orbit-two"/><img src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Professional working confidently at a desk"/><div className="hero-photo-caption"><span>USEKIT / EVERYDAY, MADE EASIER</span><strong>Good work deserves good tools.</strong></div></div>
   </div>
  </section>
  <section className="benefit-band"><div><span className="benefit-mark">✳</span><strong>Useful by design</strong><small>Tools that keep things simple</small></div><div><span className="benefit-mark">↗</span><strong>Ready when you are</strong><small>No account needed to get started</small></div><div><span className="benefit-mark">⌁</span><strong>Made for everyday work</strong><small>Business, career and personal tasks</small></div></section>
  <section className="toolkit-section home-toolkit" id="toolkit">
   <div className="toolkit-heading"><div><span className="section-kicker">THE USEKIT COLLECTION</span><h2>One workspace.<br/><em>Six practical tools.</em></h2></div><div className="toolkit-intro"><p>Pick the task in front of you and get straight to it. Every tool is designed to feel clear, useful and easy to finish.</p><label className="search-control"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Find a tool" aria-label="Search tools"/></label></div></div>
   <div className="photo-tool-grid">{filtered.map((tool,index)=><Link href={"/tools/"+tool!.slug} className="photo-tool-card" key={tool!.slug}><div className="photo-tool-image"><img src={photos[tool!.slug]} alt="" loading={index>2?"lazy":"eager"}/><span className="photo-tool-shade"/></div><div className="photo-tool-meta"><span className="tool-number">0{index+1}</span><span className="tool-category">{tool!.tag}</span></div><div className="photo-tool-copy"><h3>{tool!.name}</h3><p>{tool!.short}</p><span className="photo-tool-action">Open tool <span aria-hidden="true">↗</span></span></div></Link>)}</div>
   {filtered.length===0&&<p className="no-tools">No tools match that search. Try another word.</p>}
   <p className="toolkit-footer">NO ACCOUNT REQUIRED TO GET STARTED <span>{filtered.length} PRACTICAL TOOLS</span></p>
  </section>
  <section className="home-story" id="why-usekit"><div className="story-copy"><span className="section-kicker">ONE WORKSPACE. SIX PRACTICAL TOOLS.</span><h2>Less busywork.<br/><em>More good work.</em></h2><p>From business owners and independent professionals to people building their next career move, UseKit keeps useful tools close and easy to use.</p><div className="audience-pills"><span>Business owners</span><span>Professionals</span><span>Job seekers</span></div><div className="promise-block"><span>THE USEKIT PROMISE</span><strong>Useful by design.<br/>Simple to finish.</strong><Link href="/about">More about UseKit ↗</Link></div></div><div className="story-visual"><img src="https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Professional using a laptop in a bright workspace"/><div className="story-image-caption"><span>USEKIT / EVERYDAY, MADE EASIER</span><strong>Good work deserves<br/>good tools.</strong></div></div></section>
  <section className="closing-stage home-closing"><div className="closing-content"><span className="section-kicker">MAKE SPACE FOR THE WORK THAT MATTERS</span><h2>Make your next task<br/><em>a little easier.</em></h2><p>Choose a tool and get straight to work. No account needed.</p><Link className="button-blue" href="/workspace">Open your workspace <span aria-hidden="true">↗</span></Link></div><div className="closing-art"><img src="https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="Team collaborating around a workspace"/></div></section>
 </main>;
}
