import type {Metadata} from "next";
import AccountClient from "@/components/AccountClient";
export const metadata:Metadata={title:"Your account",description:"Optional UseKit account for saving and editing documents."};
export default function AccountPage(){return <AccountClient/>}
