import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
export async function GET(request:NextRequest){
 const purpose=request.nextUrl.searchParams.get("purpose");
 if(purpose!=="invoice_watermark"&&purpose!=="cv_watermark")return NextResponse.json({verified:false},{status:400});
 const token=request.cookies.get("usekit_paid_"+purpose)?.value||"";
 if(!token)return NextResponse.json({verified:false});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
 if(!url||!key)return NextResponse.json({verified:false},{status:503});
 try{
  const response=await fetch(url+"/functions/v1/usekit-payments",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({action:"validate-grant",purpose,token}),cache:"no-store"});
  const data=await response.json();
  return NextResponse.json({verified:response.ok&&data.verified===true,purpose:data.verified?purpose:undefined});
 }catch{return NextResponse.json({verified:false},{status:503});}
}