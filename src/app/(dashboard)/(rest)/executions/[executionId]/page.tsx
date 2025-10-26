import { requireAuth } from "@/lib/auth-utils";

interface PageProps {
    params: Promise<{ executionId: string }>
}

const ExecutionDetails = async ({ params }: PageProps) => {
    await requireAuth();
    const { executionId } = await params;
    return (
        <div>Execution Id: {executionId}</div>
    )
}

export default ExecutionDetails