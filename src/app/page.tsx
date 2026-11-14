"use client";
import Link from "next/link";
import { useState } from "react";
import { tools } from "@/lib/tools";

const useCases = [
  { n: "01", title: "For your business", copy: "Create invoices, share your WhatsApp contact and make everyday customer interactions feel more professional.", tone: "blue" },
  { n: "02", title: "For work & career", copy: "Build a clear CV, prepare application documents and make your next opportunity easier to pursue.", tone: "cream" },
  { n: "03", title: "For everyday tasks", copy: "Resize images, create QR codes and handle small digital jobs without installing another app.", tone: "dark" }
];

export default function Home() {
  const [q, setQ] = useState("");
  const order = ["image-compressor", "cv-generator", "whatsapp-link-generator", "invoice-generator", "qr-code-generator"];
  const list = order.map((slug) => tools.find((tool) => tool.slug === slug)!).filter(Boolean);
  const filtered = list.filter((tool) => (tool.name + " " + tool.short + " " + tool.category).toLowerCase().includes(q.toLowerCase()));

  return (
    <main>
      <section className="hero">
        <div className="hero-photo" />
        <div className="hero-shade" />
        <div className="hero-content">
          <span className="eyebrow"><i /> YOUR EVERYDAY DIGITAL TOOLKIT</span>
          <h1>Make room for<br /><em>what matters.</em></h1>
          <p className="hero-copy">Thoughtful digital tools for work, business and everyday life. Less busywork, fewer steps, and more time for the things that move you forward.</p>
          <div className="hero-actions">
            <a className="hero-button" href="#tools">Explore the toolkit <span>↗</span></a>
            <span className="hero-note">Free to use <b>·</b> No signup <b>·</b> Made for Nigeria</span>
          </div>
        </div>
        <div className="hero-side-note"><span>01 / 05</span><span>TOOLS FOR REAL LIFE</span></div>
        <div className="hero-bottom-glass"><span className="hero-pulse" /> A little less friction. A lot more flow.</div>
      </section>

      <section className="intro-strip">
        <div><span className="section-kicker">A BETTER WAY TO GET THINGS DONE</span><h2>Useful by design.<br /><em>Easy by nature.</em></h2></div>
        <p>Not another app to figure out. Just a calm, capable collection of tools that helps you get in, get it done and get on with your day.</p>
        <div className="intro-stats"><div><strong>05</strong><span>Practical tools</span></div><div><strong>₦0</strong><span>To get started</span></div><div><strong>24/7</strong><span>Ready when you are</span></div></div>
      </section>

      <section className="tool-discovery" id="tools">
        <div className="section-topline"><span className="section-kicker">THE USEKIT COLLECTION</span><span className="section-aside">SMALL TASKS. SMOOTHER DAYS.</span></div>
        <div className="discovery-heading"><div><h2>Your everyday<br /><em>toolkit.</em></h2><p>Everything you need, right where you need it.</p></div><label className="search-box"><span className="search-symbol">⌕</span><input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Find a tool…" aria-label="Search tools" /><span className="search-hint">SEARCH</span></label></div>
        {filtered.length ? <div className="tool-grid">{filtered.map((tool, index) => <Link className={"tool-card tool-card-" + (index % 5)} href={"/tools/" + tool.slug} key={tool.slug}><div className="tool-card-top"><span className="tool-index">0{index + 1} / TOOL</span><span className="tool-tag">{tool.tag}</span></div><h3>{tool.name}</h3><p>{tool.short}</p><div className="tool-card-bottom"><span>Open tool</span><span className="card-arrow">↗</span></div></Link>)}</div> : <div className="empty-state">No tools match that search. Try another word.</div>}
        <div className="tool-footnote"><span>NO ACCOUNT. NO INSTALLATION. NO FUSS.</span><span>JUST GET IT DONE <b>↗</b></span></div>
      </section>

      <section className="feature-band">
        <div className="feature-copy"><span className="section-kicker">MADE AROUND YOUR DAY</span><h2>Good tools should<br />feel <em>effortless.</em></h2><p>We believe useful technology should make life simpler, not add another layer of complexity. UseKit keeps the experience clear, quick and comfortable — whether you’re on a phone, tablet or laptop.</p><a href="#why-usekit" className="text-link">A little more about us <span>↗</span></a></div>
        <div className="feature-visual"><div className="feature-image" /><div className="feature-note"><span>THE EVERYDAY ADVANTAGE</span><strong>Less time figuring it out.<br />More time moving forward.</strong></div><div className="feature-orbit">U<span>.</span></div></div>
      </section>

      <section className="usecase-section" id="why-usekit"><div className="section-topline"><span className="section-kicker">ONE TOOLKIT, MANY MOMENTS</span><span className="section-aside">BUILT FOR THE WAY YOU WORK</span></div><h2>Made for your kind<br />of <em>everyday.</em></h2><div className="usecase-grid">{useCases.map((item) => <article className={"usecase-card usecase-" + item.tone} key={item.n}><span>{item.n} — USEKIT FOR</span><h3>{item.title}</h3><p>{item.copy}</p><a href="#tools">Find your tool <b>↗</b></a></article>)}</div></section>

      <section className="closing-cta"><div className="closing-glow" /><span className="section-kicker">READY WHEN YOU ARE</span><h2>Make today a little<br /><em>easier.</em></h2><p>Pick a tool. Get it done. Get back to what matters.</p><a className="hero-button" href="#tools">Explore UseKit <span>↗</span></a><span className="closing-mark">usekit.ng</span></section>
    </main>
  );
}