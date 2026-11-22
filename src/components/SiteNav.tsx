"use client";
import Link from "next/link";
import {usePathname} from "next/navigation";
import {useState} from "react";
import {Send} from "lucide-react";
export default function SiteNav(){
 const[open,setOpen]=useState(false);
 const pathname=usePathname();
 const links=[{href:"/#toolkit",label:"Tools",active:pathname==="/"},{href:"/workspace",label:"Workspace",active:pathname.startsWith("/workspace")},{href:"/about",label:"About",active:pathname==="/about"},{href:"/contact",label:"Contact",active:pathname==="/contact"}];
 return <header className="site-header"><div className="nav-wrap"><Link href="/" aria-label="UseKit home" className="brand"><img src="/usekit-mark.svg" alt=""/><span className="brand-word">UseKit</span></Link><nav aria-label="Main navigation">{links.map(link=><Link key={link.href} className={link.active?"nav-tab is-active":"nav-tab"} aria-current={link.active?"page":undefined} href={link.href}>{link.label}</Link>)}</nav><Link className="nav-cta" href="/workspace">Open workspace <span><Send size={17} strokeWidth={2.2}/></span></Link><button type="button" className="mobile-menu-toggle" aria-label={open?"Close navigation":"Open navigation"} aria-expanded={open} aria-controls="mobile-site-menu" onClick={()=>setOpen(!open)}><span/><span/></button></div>{open&&<><button type="button" className="mobile-nav-backdrop" aria-label="Close navigation menu" onClick={()=>setOpen(false)}/><nav id="mobile-site-menu" className="mobile-nav-panel" aria-label="Mobile navigation">{links.map(link=><Link key={link.href} className={link.active?"is-active":""} onClick={()=>setOpen(false)} href={link.href}>{link.label==="Tools"?"Explore tools":link.label}</Link>)}</nav></>}</header>
}