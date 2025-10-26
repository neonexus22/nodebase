"use client"
import { ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useCreateWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows"
import { EntityContainer, EntityHeader, EntityPagination, EntitySearch } from "@/components/entity-components";
import { useWokflowsParams } from "../hooks/use-workflows-params";
import { useEntitySearch } from "@/hooks/use-entity-search";

export const WorkflowsSearch = () => {
    const [params, setParams] = useWokflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({ params, setParams });
    return (
        <EntitySearch
            value={searchValue}
            onChange={onSearchChange}
            placeholder="Search workflows"
        />
    )
}

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

export const WorkflowPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWokflowsParams();

    return (
        <EntityPagination
            disabled={workflows.isFetching}
            totalPages={workflows.data.totalPages}
            page={workflows.data.page}
            onPageChange={page => setParams({ ...params, page })}
        />
    )
}

export const WorkflowsContainer = ({ children }: { children: ReactNode }) => {
    return (
        <EntityContainer
            header={<WorkflowsHeader />}
            search={<WorkflowsSearch />}
            pagination={<WorkflowPagination />}
        >
            {children}
        </EntityContainer>
    )
}