"use client";
import Link from "next/link";
import { useState } from "react";
import { tools } from "@/lib/tools";

const toolOrder = ["image-compressor","cv-generator","whatsapp-link-generator","invoice-generator","qr-code-generator"];
const moments = [
  { number:"01", title:"Business, made smoother.", text:"Create clear invoices, share your WhatsApp contact and give your customers a simpler way to reach you.", tone:"moment-dark", tag:"FOR BUSINESS" },
  { number:"02", title:"Your next step, better prepared.", text:"Put together a professional CV and get your application documents ready without the usual friction.", tone:"moment-yellow", tag:"FOR YOUR CAREER" },
  { number:"03", title:"Little tasks, handled.", text:"Resize images, create QR codes and take care of everyday digital jobs in a few simple steps.", tone:"moment-blue", tag:"FOR EVERYDAY LIFE" }
];
export default function Home(){
 const [query,setQuery]=useState("");
 const ordered=toolOrder.map(s=>tools.find(t=>t.slug===s)!).filter(Boolean);
 const filtered=ordered.filter(t=>(t.name+" "+t.short+" "+t.category).toLowerCase().includes(query.toLowerCase()));
 return <main className="site-shell">
  <section className="hero-stage">
   <div className="hero-copy-block"><span className="eyebrow"><i/> YOUR EVERYDAY DIGITAL TOOLKIT</span><h1>Make your day<br/>work <em>better.</em></h1><p>Useful tools for business, work and everything in between. Get the little digital tasks out of the way — simply, beautifully, and without signing up.</p><div className="hero-ctas"><a className="button-yellow" href="#toolkit">Explore the toolkit <span>↗</span></a><a className="quiet-link" href="#why-usekit">Why UseKit? <span>↗</span></a></div><div className="hero-proof"><span>✳ Free to use</span><span>·</span><span>No account needed</span><span>·</span><span>Made for Nigeria</span></div></div>
   <div className="hero-portrait"><div className="portrait-image"/><div className="portrait-fade"/><div className="portrait-label"><span>THE EVERYDAY ADVANTAGE</span><strong>More flow.<br/>Less figuring it out.</strong></div><div className="portrait-stamp">U<span>.</span></div></div>
   <div className="hero-bottomline"><span>TOOLS FOR REAL LIFE</span><span>01 — 05 / THE COLLECTION</span></div>
  </section>

  <section className="value-row" id="why-usekit">
   <article><span className="value-number">01 / SIMPLE</span><h3>Easy from the start.</h3><p>No long setup, no unnecessary steps. Open a tool and get straight to what you came to do.</p></article>
   <article><span className="value-number">02 / USEFUL</span><h3>Made for real tasks.</h3><p>Practical features for everyday business, work and digital life in Nigeria.</p></article>
   <article><span className="value-number">03 / READY</span><h3>Wherever you are.</h3><p>UseKit works in your browser, on your phone, tablet or computer. Nothing to install.</p></article>
  </section>

  <section className="showcase-strip">
   <div className="showcase-dark"><span>YOUR DIGITAL SIDEKICK</span><strong>Small tasks.<br/>Big relief.</strong><a href="#toolkit">Find a tool ↗</a></div>
   <div className="showcase-photo photo-one" role="img" aria-label="Professional Black woman working at a laptop"/>
   <div className="showcase-photo photo-two" role="img" aria-label="Professional Black man working in a modern office"/>
   <div className="showcase-stat"><span>THE USEKIT DIFFERENCE</span><strong>Less busywork.<br/><em>More momentum.</em></strong><small>Useful tools, thoughtfully put together.</small></div>
   <div className="showcase-photo photo-three" role="img" aria-label="Professional team collaborating in a modern office"/>
  </section>

  <section className="toolkit-section" id="toolkit">
   <div className="toolkit-heading"><div><span className="section-kicker">THE USEKIT COLLECTION</span><h2>Get it done.<br/><em>Get on with life.</em></h2></div><div className="toolkit-intro"><p>Five practical tools. One easy place to find them. Pick what you need and get moving.</p><label className="search-control"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="What are you looking for?" aria-label="Search tools"/><small>SEARCH</small></label></div></div>
   <div className="tool-list">{filtered.map((tool,index)=><Link href={"/tools/"+tool.slug} className={"tool-row tool-row-"+index} key={tool.slug}><span className="tool-row-index">0{index+1}</span><div className="tool-row-main"><h3>{tool.name}</h3><p>{tool.short}</p></div><span className="tool-row-tag">{tool.tag}</span><span className="tool-row-arrow">↗</span></Link>)}</div>
   <div className="toolkit-footer"><span>NO ACCOUNT. NO INSTALLATION. NO FUSS.</span><span>{filtered.length} TOOLS AVAILABLE <b>↗</b></span></div>
  </section>

  <section className="philosophy-section">
   <div className="philosophy-heading"><span className="section-kicker">A LITTLE THOUGHT BEHIND EVERY DETAIL</span><h2>Technology should<br/><em>feel human.</em></h2><p>Not complicated. Not cluttered. Just thoughtful tools that respect your time and help you move forward.</p></div>
   <div className="philosophy-cards"><article className="philosophy-card"><span>01 — CLARITY</span><div className="abstract-symbol symbol-sun">✳</div><h3>Clear, not crowded.</h3><p>Every screen has a purpose. We keep the important things easy to find.</p></article><article className="philosophy-card"><span>02 — COMFORT</span><div className="abstract-symbol symbol-loop">↗</div><h3>Comfortable to use.</h3><p>Calm colours, considered type and a familiar flow from start to finish.</p></article><article className="philosophy-card"><span>03 — ACCESS</span><div className="abstract-symbol symbol-orbit"><i/><i/><i/></div><h3>Open to everyone.</h3><p>Useful everyday tools, available right in your browser without an account.</p></article></div>
  </section>

  <section className="moments-section"><div className="moments-heading"><span className="section-kicker">ONE TOOLKIT, MANY MOMENTS</span><h2>Made for your kind<br/>of <em>everyday.</em></h2></div><div className="moments-grid">{moments.map(m=><article className={"moment-card "+m.tone} key={m.number}><span>{m.number} — {m.tag}</span><h3>{m.title}</h3><p>{m.text}</p><a href="#toolkit">Explore tools <b>↗</b></a></article>)}</div></section>

  <section className="closing-stage"><div className="closing-art"/><div className="closing-content"><span className="section-kicker">A BETTER KIND OF EVERYDAY</span><h2>Start with one<br/><em>small win.</em></h2><p>Choose a tool, make it happen, and get back to what matters.</p><a className="button-yellow" href="#toolkit">Find your tool <span>↗</span></a></div><span className="closing-index">USEKIT.NG / MADE FOR EVERYDAY LIFE</span></section>
 </main>
}