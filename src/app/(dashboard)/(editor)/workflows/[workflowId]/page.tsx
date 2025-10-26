import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{ workflowId: string }>
}

const WorkflowDetails = async ({ params }: PageProps) => {
    await requireAuth();
    const { workflowId } = await params;
    return (
        <div>Workflow Id: {workflowId}</div>
    )
}

export default WorkflowDetails