import {NextRequest,NextResponse} from "next/server";
export const runtime="nodejs";
export async function POST(request:NextRequest){
 try{
  const body=await request.json() as {email?:string;purpose?:string};
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if(!url||!key)return NextResponse.json({error:"Payment service is not configured."},{status:503});
  const response=await fetch(url+"/functions/v1/usekit-payments",{method:"POST",headers:{apikey:key,Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({action:"initialize",email:body.email,purpose:body.purpose}),cache:"no-store"});
  const data=await response.json();
  return NextResponse.json(data,{status:response.status});
 }catch{return NextResponse.json({error:"Could not start payment. Please try again."},{status:500});}
}