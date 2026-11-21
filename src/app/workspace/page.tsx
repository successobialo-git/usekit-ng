import type {Metadata} from "next";
import WorkspaceShell from "@/components/WorkspaceShell";
export const metadata:Metadata={title:"Workspace",description:"Open a UseKit tool and start working."};
export default function WorkspacePage(){return <WorkspaceShell/>}
