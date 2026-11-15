import {createBrowserClient} from "@supabase/ssr";
let client:ReturnType<typeof createBrowserClient>|null=null;
export function getBrowserSupabase(){const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;if(!url||!key)throw new Error("Supabase is not configured. Add the public project URL and publishable key.");if(!client)client=createBrowserClient(url,key,{db:{schema:"usekit"}});return client;}
