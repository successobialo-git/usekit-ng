"use client";
import Link from "next/link";
import { useState } from "react";
import { tools } from "@/lib/tools";

export default function Home() {
  const [q, setQ] = useState("");
  const order = ["image-compressor", "cv-generator", "whatsapp-link-generator", "invoice-generator", "qr-code-generator"];
  const list = order.map((slug) => tools.find((tool) => tool.slug === slug)!).filter(Boolean);
  const filtered = list.filter((tool) =>
    (tool.name + " " + tool.short + " " + tool.category).toLowerCase().includes(q.toLowerCase())
  );

  return (
    <main>
      <section className="hero">
        <div className="hero-content">
          <div className="eyebrow">YOUR EVERYDAY DIGITAL TOOLKIT</div>
          <h1>Get everyday things done <em>with less effort.</em></h1>
          <p className="hero-copy">
            Useful, easy-to-use tools for work and daily life. Create an invoice, prepare your CV,
            compress an image or share your WhatsApp link — all in one place.
          </p>
          <div className="hero-actions">
            <a className="hero-button" href="#tools">Explore the tools <span>↗</span></a>
            <span className="hero-note">Free to use · No signup · Works on your phone</span>
          </div>
        </div>
        <div className="hero-art" role="img" aria-label="People collaborating in a modern workspace">
          <div className="hero-image-caption">
            <span>MADE FOR EVERYDAY WORK</span>
            <strong>Less busywork.<br />More getting things done.</strong>
          </div>
        </div>
      </section>

      <section className="search-section" id="tools">
        <div className="search-intro">
          <span className="section-kicker">THE TOOLKIT</span>
          <h2>Find the right tool for the task.</h2>
          <p>Simple tools for the things you need to get done.</p>
        </div>
        <label className="search-box">
          <span className="search-symbol">⌕</span>
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search tools…" aria-label="Search tools" />
          <span className="search-hint">SEARCH</span>
        </label>
      </section>

      <section className="tools-section">
        <div className="section-heading">
          <div><h2>Tools that work as hard as you do.</h2><p>Choose a tool and get straight to it. No account needed.</p></div>
          <span className="tool-count">0{filtered.length} TOOLS</span>
        </div>
        {filtered.length ? (
          <div className="tool-grid">
            {filtered.map((tool, index) => (
              <Link className={"tool-card tool-card-" + (index % 5)} href={"/tools/" + tool.slug} key={tool.slug}>
                <div className="tool-card-top"><span className="tool-index">0{index + 1}</span><span className="tool-tag">{tool.tag}</span></div>
                <h3>{tool.name}</h3>
                <p>{tool.short}</p>
                <div className="tool-card-bottom"><span>Explore tool</span><span className="card-arrow">↗</span></div>
              </Link>
            ))}
          </div>
        ) : <div className="empty-state">No tools match that search. Try another word.</div>}
      </section>
    </main>
  );
}