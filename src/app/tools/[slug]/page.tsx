import type {Metadata} from "next";
import Link from "next/link";
import {notFound} from "next/navigation";
import {Image as ImageIcon,FileUser,MessageCircle,ReceiptText,QrCode} from "lucide-react";
import {getTool,tools} from "@/lib/tools";
import {createClient} from "@supabase/supabase-js";
import defaultPromo from "@/config/ads.json";
import ToolWorkbench from "@/components/ToolWorkbench";
const iconMap={image:ImageIcon,"file-user":FileUser,"message-circle":MessageCircle,receipt:ReceiptText,"qr-code":QrCode} as const;
export function generateStaticParams(){return tools.map(tool=>({slug:tool.slug}));}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const {slug}=await params;const tool=getTool(slug);return tool?{title:tool.seoTitle,description:tool.description}:{};}
export default async function ToolPage({params}:{params:Promise<{slug:string}>}){const {slug}=await params;const tool=getTool(slug);if(!tool)notFound();const Icon=iconMap[tool.icon];let promo:typeof defaultPromo=defaultPromo;let toolEnabled=true;try{const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(url&&key){const db=createClient(url,key,{db:{schema:"usekit"},auth:{persistSession:false,autoRefreshToken:false}});const {data}=await db.from("site_settings").select("value").eq("key","promo").maybeSingle();if(data?.value)promo={...defaultPromo,...data.value};const {data:controls}=await db.from("site_settings").select("value").eq("key","tool_controls").maybeSingle();if(controls?.value&&typeof controls.value==="object"&&(controls.value as Record<string,boolean>)[slug]===false)toolEnabled=false;}}catch{}return toolEnabled?<ToolWorkbench slug={tool.slug}/>:<main className="tool-disabled"><h1>This tool is temporarily unavailable</h1><p>We are making an update. Please check back shortly or choose another tool from the sidebar.</p><Link href="/workspace">Back to workspace</Link></main>}