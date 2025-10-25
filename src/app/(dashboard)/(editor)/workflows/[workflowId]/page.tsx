import { requireUnauth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{ workflowId: string }>
}

const WorkflowDetails = async ({ params }: PageProps) => {
    await requireUnauth();
    const { workflowId } = await params;
    return (
        <div>Workflow Id: {workflowId}</div>
    )
}

export default WorkflowDetails