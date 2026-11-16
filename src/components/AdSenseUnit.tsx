"use client";
import {useEffect,useState} from "react";
import {getBrowserSupabase} from "@/lib/supabase-browser";
type Config={enabled?:boolean,publisherId?:string,homeSlot?:string,toolSlot?:string};
let scriptPublisher="";
export default function AdSenseUnit({placement="home"}:{placement?:"home"|"tool"}){
 const [config,setConfig]=useState<Config|null>(null);
 const slotKey=placement==="home"?"homeSlot":"toolSlot";
 useEffect(()=>{let active=true;void getBrowserSupabase().from("site_settings").select("value").eq("key","adsense_config").maybeSingle().then(({data})=>{if(active&&data?.value)setConfig(data.value as Config);}).catch(()=>{});return()=>{active=false;};},[]);
 const publisher=String(config?.publisherId||"");const slot=String(config?.[slotKey]||"");
 useEffect(()=>{if(!config?.enabled||!/^ca-pub-\d+$/.test(publisher)||!/^\d+$/.test(slot))return;const id="usekit-adsense-script";let script=document.getElementById(id) as HTMLScriptElement|null;if(script&&scriptPublisher!==publisher)return;if(!script){script=document.createElement("script");script.id=id;script.async=true;script.crossOrigin="anonymous";script.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client="+encodeURIComponent(publisher);script.dataset.publisher=publisher;script.onload=()=>{scriptPublisher=publisher;try{(window as unknown as {adsbygoogle:unknown[]}).adsbygoogle=(window as unknown as {adsbygoogle?:unknown[]}).adsbygoogle||[];(window as unknown as {adsbygoogle:unknown[]}).adsbygoogle.push({});}catch{}};document.head.appendChild(script);}else if(script.dataset.publisher===publisher&&script.dataset.loaded==="true"){try{(window as unknown as {adsbygoogle:unknown[]}).adsbygoogle=(window as unknown as {adsbygoogle?:unknown[]}).adsbygoogle||[];(window as unknown as {adsbygoogle:unknown[]}).adsbygoogle.push({});}catch{}}},[config?.enabled,publisher,slot]);
 if(!config?.enabled||!/^ca-pub-\d+$/.test(publisher)||!/^\d+$/.test(slot))return null;
 return <aside className="usekit-ad-slot" aria-label="Advertisement"><span>ADVERTISEMENT</span><ins className="adsbygoogle" style={{display:"block",minHeight:90}} data-ad-client={publisher} data-ad-slot={slot} data-ad-format="auto" data-full-width-responsive="true"/></aside>;
}
