"use client"
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { EntityContainer, EntityHeader } from "@/components/entity-components";

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();

    return (
        <div className="flex flex-1 justify-center items-center">
            <p>
                {JSON.stringify(workflows.data, null, 2)}
            </p>
        </div>
    )
}

export const WorkflowsHeader = ({ disabled }: { disabled?: boolean }) => {
    const router = useRouter();
    const createWorkflow = useCreateWorkflow();
    const handleCreate = () => {
        createWorkflow.mutate(undefined, {
            onSuccess: (data) => {
                router.push(`/workflows/${data.id}`)
            },
            onError: (error) => {
                // TODO: Open upgrade model
                console.error(error);
            }
        });
    }
    return (
        <EntityHeader
            title="Workflows"
            description="Create and manage your workflows"
            onNew={handleCreate}
            newButtonLabel="New workflows"
            disabled={disabled}
            isCreating={createWorkflow.isPending}
        />
    )
}

export const WorkflowsContainer = ({ children }: { children: ReactNode }) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<></>}
            pagination={<></>}
        >
            {children}
        </EntityContainer>
    )
}