"use client";
import Link from "next/link";
import {useState} from "react";
import {QRCodeSVG} from "qrcode.react";
import {tools} from "@/lib/tools";
const orderedSlugs=["image-compressor","cv-generator","whatsapp-link-generator","invoice-generator","qr-code-generator"];
const benefits=[["01","No setup","Open a tool and get straight to work."],["02","Made to be useful","Practical features for everyday Nigerian life."],["03","Ready anywhere","A smooth experience on phone, tablet and desktop."]];
const slides=[
 {eyebrow:"MAKE EVERYDAY WORK EASIER",title:"A little more flow.",text:"Thoughtful tools for the things you do every day.",image:"https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=1000"},
 {eyebrow:"BUILT FOR YOUR NEXT MOVE",title:"Make room to grow.",text:"Create, organise and share with less friction.",image:"https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1000"},
 {eyebrow:"SIMPLE TOOLS. BETTER DAYS.",title:"Get things moving.",text:"From business admin to everyday digital tasks.",image:"https://images.pexels.com/photos/3184436/pexels-photo-3184436.jpeg?auto=compress&cs=tinysrgb&w=1000"}
];
export default function Home(){
 const [query,setQuery]=useState("");
 const ordered=orderedSlugs.map(s=>tools.find(t=>t.slug===s)!).filter(Boolean);
 const filtered=ordered.filter(t=>(t.name+" "+t.short+" "+t.category).toLowerCase().includes(query.toLowerCase()));
 return <main className="site-shell">
  <section className="center-hero">
   <span className="hero-eyebrow"><i/> WELCOME TO USEKI</span>
   <h1>Make your next<br/>everyday task <em>easier.</em></h1>
   <p>Free, thoughtful digital tools for business, work and life. Get the little things done beautifully — then get on with what matters.</p>
   <div className="center-actions"><a className="button-blue" href="#toolkit">Explore free tools <span>↗</span></a><a className="quiet-link" href="#why-usekit">Discover Useki</a></div>
  </section>
  <section className="feature-split">
   <article className="feature-dark">
    <span className="mini-label">✳ A BETTER WAY TO GET THINGS DONE</span>
    <h2>Less busywork.<br/><em>More momentum.</em></h2>
    <p>One calm place for the digital tasks that keep your day moving. No complicated setup, no unnecessary noise.</p>
    <div className="feature-tabs"><Link href="/#toolkit">For business <b>↗</b></Link><Link href="/#toolkit">For your career <b>↗</b></Link><Link href="/#toolkit">For everyday life <b>↗</b></Link></div>
    <div className="dark-feature-bottom"><span>THE USEKI APPROACH</span><strong>Thoughtful by design.<br/>Easy by nature.</strong><Link href="/about">A little about us ↗</Link></div>
   </article>
   <article className="feature-portrait">
    <div className="lady-image"/>
    <div className="portrait-wash"/>
    <div className="portrait-copy"><span>MADE FOR YOUR EVERYDAY</span><h3>Good tools.<br/>Good energy.</h3></div>
    <div className="portrait-pills"><span>Free to use</span><span>No signup</span></div>
   </article>
  </section>
  <section className="benefit-row" id="why-usekit">{benefits.map(([n,t,d])=><article key={n}><span>{n} / THE DETAILS</span><h3>{t}</h3><p>{d}</p></article>)}</section>
  <section className="visual-showcase">
   <div className="showcase-intro"><span className="section-kicker">A TOOLKIT THAT FITS YOUR DAY</span><h2>Small tasks.<br/><em>Handled beautifully.</em></h2></div>
   <div className="showcase-carousel" aria-label="Useki workspace inspiration">
    <div className="carousel-track">
     {[...slides,...slides].map((s,i)=><article className="carousel-slide" key={i}><img src={s.image} alt="Professional creative workspace"/><div><small>{s.eyebrow}</small><h3>{s.title}</h3><p>{s.text}</p></div></article>)}
    </div>
   </div>
  </section>
  <section className="qr-feature">
   <div className="qr-feature-copy"><span className="section-kicker">A LITTLE MORE THAN THE BASICS</span><h2>Your link.<br/><em>One quick scan.</em></h2><p>Create a QR code for your website, menu, business page or contact details. Customise the look, then download it ready to share or print.</p><Link className="button-blue" href="/tools/qr-code-generator">Explore QR studio <span>↗</span></Link></div>
   <div className="qr-showcase-card"><div className="qr-showcase-head"><span>YOUR DIGITAL HELLO</span><span className="live-dot">LIVE PREVIEW</span></div><div className="qr-white-paper"><QRCodeSVG value="https://usekit.ng" size={190} level="H" fgColor="#202020" bgColor="#ffffff"/><strong>Scan. Connect. Done.</strong><small>POWERED BY USEKI</small></div><div className="qr-showcase-foot"><span>WEBSITE</span><span>CONTACT</span><span>MENU</span><span>PAYMENT</span></div></div>
  </section>
  <section className="toolkit-section" id="toolkit">
   <div className="toolkit-heading"><div><span className="section-kicker">THE USEKI COLLECTION</span><h2>Find your tool.<br/><em>Find your flow.</em></h2></div><div className="toolkit-intro"><p>Practical little helpers for business, work and everyday life. Choose what you need and get moving.</p><label className="search-control"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="What do you need to do?" aria-label="Search tools"/><small>SEARCH</small></label></div></div>
   <div className="tool-list">{filtered.map((tool,index)=><Link href={"/tools/"+tool.slug} className={"tool-row tool-row-"+index} key={tool.slug}><span className="tool-row-index">0{index+1}</span><div className="tool-row-main"><h3>{tool.name}</h3><p>{tool.short}</p></div><span className="tool-row-tag">{tool.tag}</span><span className="tool-row-arrow">↗</span></Link>)}</div>
   <div className="toolkit-footer"><span>NO ACCOUNT. NO INSTALLATION. NO FUSS.</span><span>{filtered.length} TOOLS AVAILABLE</span></div>
  </section>
  <section className="closing-stage"><div className="closing-art"/><div className="closing-content"><span className="section-kicker">A BETTER KIND OF EVERYDAY</span><h2>Start with one<br/><em>small win.</em></h2><p>Choose a tool, make it happen, and get back to what matters.</p><a className="button-blue" href="#toolkit">Find your tool <span>↗</span></a></div></section>
 </main>
}