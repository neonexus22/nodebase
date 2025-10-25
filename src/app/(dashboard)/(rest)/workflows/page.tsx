import { requireAuth } from "@/lib/auth-utils"


const WorkflowPage = async () => {
    await requireAuth();
    return (
        <div>WorkflowPage</div>
    )
}

export default WorkflowPage