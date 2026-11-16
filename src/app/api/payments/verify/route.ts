import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
type Purpose="invoice_watermark"|"cv_watermark";
export async function POST(request:NextRequest){
 try{
  const body=await request.json() as {reference?:string;purpose?:string};
  if(!body.reference||!(body.purpose==="invoice_watermark"||body.purpose==="cv_watermark"))return NextResponse.json({verified:false,error:"Invalid payment reference or purpose."},{status:400});
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return NextResponse.json({verified:false,error:"Payment service is not configured."},{status:503});
  const response=await fetch(url+"/functions/v1/usekit-payments",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({action:"verify",reference:body.reference,purpose:body.purpose}),cache:"no-store"});
  const data=await response.json();
  if(!response.ok||!data.verified||typeof data.grantToken!=="string")return NextResponse.json({verified:false,error:data.error||"Payment could not be verified."},{status:response.status||402});
  const result=NextResponse.json({verified:true,purpose:body.purpose as Purpose,reference:data.reference});
  result.cookies.set("usekit_paid_"+body.purpose,data.grantToken,{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"lax",path:"/",maxAge:30*24*60*60});
  return result;
 }catch{return NextResponse.json({verified:false,error:"Payment verification failed. Please try again."},{status:500});}
}