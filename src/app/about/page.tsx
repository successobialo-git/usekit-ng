import Link from "next/link";
export const metadata={
 title:"About UseKit | Everyday Digital Tools and AI Productivity Assistance",
 description:"Discover how UseKit helps people and businesses work smarter with practical online tools, AI writing assistance, CV creation and improvement, business documents, QR codes and file compression.",
 keywords:["about UseKit","online productivity tools","AI writing assistance","free business tools Nigeria","CV builder Nigeria","invoice generator","image and PDF compressor","everyday digital tools"],
 alternates:{canonical:"/about"},
 openGraph:{title:"About UseKit | Everyday Tools, Made Easier",description:"Meet UseKit: practical digital tools and smart assistance for business, careers and everyday work.",url:"/about",type:"website"}
};
const faqs=[
 {q:"What is UseKit?",a:"UseKit is an everyday productivity platform that brings practical digital tools and intelligent assistance together to help people create, improve, organise and complete common tasks."},
 {q:"Who can use UseKit?",a:"UseKit is designed for small business owners, freelancers, job seekers, students, creators, professionals and anyone who needs straightforward help with everyday digital work."},
 {q:"What can I do with UseKit?",a:"Depending on the tool, you can prepare invoices and quotations, create QR codes and WhatsApp links, build or improve a CV, get writing assistance, and compress images or PDFs for sharing and online applications."},
 {q:"Do I have to start my CV from scratch?",a:"UseKit's CV experience is designed to support people building a new CV as well as people who want to work from an existing CV where upload and import are supported. You can then refine the information and presentation with guided assistance."},
 {q:"Can I use UseKit on my phone?",a:"UseKit is designed for a responsive browser experience across mobile phones, tablets and desktop computers."}
];
export default function About(){return <main className="content-page about-page">
 <div className="internal-page-banner">
  <span>USEKIT / ABOUT</span>
  <h1>Useful tools.<br/><em>Better everyday flow.</em></h1>
  <p>Practical digital tools and smart assistance to help you create, improve and get everyday work done with less effort.</p>
 </div>
 <section className="about-story-section">
  <div><span className="section-kicker">WHY WE EXIST</span><h2>Technology should make the day feel lighter.</h2></div>
  <div><p>Everyday work is full of small tasks that can take more time and energy than they should. Preparing a business document, improving a CV, writing an important message, creating a QR code or getting a file ready for an online application can mean switching between different websites and figuring out unfamiliar tools.</p>
  <p>We believe useful technology should remove that friction, not add to it. That is why UseKit brings practical digital tools and intelligent assistance together in one accessible place.</p></div>
 </section>
 <section className="content-feature">
  <div><span>OUR APPROACH</span><h2>Start with what you need. Leave with something useful.</h2><p>From creating an invoice to preparing a CV, compressing an image or sharing a QR code, the experience should feel straightforward, considered and comfortable on every screen.</p></div>
  <img src="https://images.pexels.com/photos/10375968/pexels-photo-10375968.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Professional working at a laptop in a modern workspace"/>
 </section>
 <section className="about-value-section">
  <span className="section-kicker">WHAT USEKIT HELPS YOU DO</span>
  <h2>One platform for the work that moves you forward.</h2>
  <div className="about-value-grid">
   <article><span>01 / BUSINESS</span><h3>Run everyday business tasks</h3><p>Create professional invoices and quotations, prepare customer ready WhatsApp links and make useful QR codes for your business.</p><Link href="/tools/invoice-generator">Explore business tools →</Link></article>
   <article><span>02 / CAREER</span><h3>Build a stronger CV</h3><p>Create a CV with guided suggestions or improve an existing one where upload and import are supported. Organise your experience and present your skills clearly.</p><Link href="/tools/cv-generator">Explore the CV tool →</Link></article>
   <article><span>03 / AI ASSISTANCE</span><h3>Write and work smarter</h3><p>Use smart writing assistance to get past the blank page, shape ideas, refine drafts and communicate with greater clarity. AI should make useful work easier, while you stay in control.</p></article>
   <article><span>04 / FILES</span><h3>Get files ready to use</h3><p>Compress images and PDFs for online applications, forms, portals and everyday sharing, with less frustration around file size.</p><Link href="/tools/image-compressor">Explore file tools →</Link></article>
  </div>
 </section>
 <section className="about-audience-section">
  <div><span className="section-kicker">MADE FOR REAL EVERYDAY NEEDS</span><h2>Useful wherever work and life happen.</h2><p>UseKit is for small business owners managing customers, freelancers preparing client documents, job seekers improving their CVs, students submitting applications, creators preparing content and everyday users who simply want to get a digital task done.</p></div>
  <div className="about-audience-list"><p><b>Small businesses</b><span>Professional documents and easier customer connections.</span></p><p><b>Freelancers</b><span>Better client communication and a more polished presentation.</span></p><p><b>Job seekers and students</b><span>CV support and practical file preparation.</span></p><p><b>Creators and professionals</b><span>Writing support and tools that reduce repetitive work.</span></p></div>
 </section>
 <section className="about-principles">
  <span className="section-kicker">THE USEKIT PROMISE</span><h2>Useful by design. Simple to finish.</h2>
  <div className="about-principle-grid"><p><b>Practical first</b><br/>We focus on real tasks and clear outcomes, not features for their own sake.</p><p><b>Approachable assistance</b><br/>Smart suggestions should help people move forward without making the process complicated.</p><p><b>Professional results</b><br/>We want everyday users to feel confident about the work they create and share.</p></div>
 </section>
 <section className="about-faq">
  <span className="section-kicker">ABOUT USEKIT / FAQ</span><h2>Common questions about UseKit</h2>
  {faqs.map((item)=><details key={item.q}><summary>{item.q}</summary><p>{item.a}</p></details>)}
 </section>
 <section className="about-bottom-cta"><h2>Make your next task a little easier.</h2><p>Explore practical tools for business, careers and everyday digital work.</p><Link href="/#toolkit">Explore all tools →</Link></section>
 </main>}
