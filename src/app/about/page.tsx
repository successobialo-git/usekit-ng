import Link from "next/link";

const faqs=[
 {q:"What is UseKit?",a:"UseKit brings practical digital tools and smart assistance together to help you create, improve and complete everyday work."},
 {q:"Who is UseKit for?",a:"UseKit is designed for small business owners, freelancers, job seekers, students, creators and professionals who want straightforward ways to get everyday digital tasks done."},
 {q:"What can I do with UseKit?",a:"You can create QR codes, invoices, quotations and WhatsApp links, build or improve a CV, and compress images and PDFs for online applications and everyday sharing."},
 {q:"Can I use UseKit on my phone?",a:"Yes. UseKit is designed to work in modern mobile, tablet and desktop browsers."}
];

const aboutStructuredData={
 "@context":"https://schema.org",
 "@graph":[
  {"@type":"Organization","@id":"https://usekit.ng/#organization","name":"UseKit","url":"https://usekit.ng/","description":"Practical digital tools and smart assistance for business, careers and everyday work."},
  {"@type":"WebPage","@id":"https://usekit.ng/about#webpage","url":"https://usekit.ng/about","name":"About UseKit","description":"Learn about UseKit, a practical digital toolkit for business, careers and everyday work.","about":{"@id":"https://usekit.ng/#organization"}},
  {"@type":"FAQPage","mainEntity":faqs.map(item=>({"@type":"Question","name":item.q,"acceptedAnswer":{"@type":"Answer","text":item.a}}))}
 ]
};

export const metadata={
 title:"About UseKit | Practical Digital Tools for Everyday Work",
 description:"Meet UseKit: practical online tools and smart assistance for Nigerian businesses, freelancers, job seekers and everyday work.",
 keywords:["about UseKit","online productivity tools","free business tools Nigeria","CV builder Nigeria","invoice generator","image and PDF compressor","everyday digital tools"],
 alternates:{canonical:"/about"},
 openGraph:{title:"About UseKit | Practical Tools, Made Easier",description:"Practical digital tools and smart assistance for business, careers and everyday work.",url:"/about",type:"website"}
};

export default function About(){
 return <main className="content-page about-page">
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(aboutStructuredData)}}/>
  <div className="internal-page-banner">
   <span>USEKIT / ABOUT</span>
   <h1>Useful tools.<br/><em>Better everyday flow.</em></h1>
   <p>Practical digital tools and smart assistance to help you create, improve and get everyday work done with less effort.</p>
  </div>
  <div className="content-feature">
   <div>
    <span>OUR POINT OF VIEW</span>
    <h2>Technology should make the day feel lighter.</h2>
    <p>Everyday tasks should not require a dozen different websites. UseKit brings useful tools for business, careers and daily digital work into one straightforward place, so you can focus on the result instead of figuring out the process.</p>
    <p>Whether you are preparing a business document, improving your CV, creating a QR code or getting a file ready for an online application, the experience should feel simple and considered.</p>
    <Link href="/#toolkit" className="about-feature-link">Explore the tools <span aria-hidden="true">→</span></Link>
   </div>
   <img src="https://images.pexels.com/photos/10375968/pexels-photo-10375968.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Professional working at a laptop in a modern workspace"/>
  </div>
  <section className="about-quick-values">
   <span className="section-kicker">THE USEKIT APPROACH</span>
   <div className="about-quick-grid">
    <article><b>01 / PRACTICAL</b><h3>Tools for real tasks</h3><p>Useful features that help you finish everyday work without unnecessary steps.</p></article>
    <article><b>02 / APPROACHABLE</b><h3>Simple to use</h3><p>Clear experiences that work comfortably across phones, tablets and computers.</p></article>
    <article><b>03 / PROFESSIONAL</b><h3>Ready to share</h3><p>Polished documents, files and results you can confidently put to use.</p></article>
   </div>
  </section>
  <section className="about-faq">
   <span className="section-kicker">A LITTLE MORE ABOUT US</span>
   <h2>Common questions</h2>
   {faqs.map(item=><details key={item.q}><summary>{item.q}<span aria-hidden="true">+</span></summary><p>{item.a}</p></details>)}
  </section>
 </main>;
}
