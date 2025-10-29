"use client"

import Image from "next/image";
import { memo, type ReactNode } from 'react'
import { NodeStatus, NodeStatusIndicator } from "@/components/react-flow/node-status-indicator";
import { type LucideIcon } from "lucide-react"
import { type NodeProps, Position, useReactFlow } from "@xyflow/react"
import { BaseNode, BaseNodeContent } from '@/components/react-flow/base-node';
import { BaseHandle } from "@/components/react-flow/base-handle";
import { WorkflowNode } from "@/components/workflow-node";

interface BaseTriggerNodeProps extends NodeProps {
    Icon: LucideIcon | string;
    name: string;
    description?: string;
    children?: ReactNode;
    status?: NodeStatus;
    onSetting?: () => void;
    onDoubleClick?: () => void;
}

export const BaseTriggerNode = memo(({
    id,
    Icon,
    name,
    status = "initial",
    description,
    children,
    onSetting,
    onDoubleClick
}: BaseTriggerNodeProps) => {

    const { setNodes, setEdges } = useReactFlow();

    const handleDelete = () => {
        setNodes((currentNodes) => {
            const updatedNodes = currentNodes.filter(node => node.id !== id);
            return updatedNodes;
        })
        setEdges(currentEdges => {
            const updatedEdges = currentEdges.filter
                (edge => edge.source !== id && edge.target !== id);
            return updatedEdges;
        })
    }


    return (
        <WorkflowNode
            name={name}
            description={description}
            onDelete={handleDelete}
            onSettings={onSetting}
        >
            <NodeStatusIndicator
                status={status}
                variant="border"
                className="rounded-l-2xl"
            >
                <BaseNode status={status} onDoubleClick={onDoubleClick} className="rounded-l-2xl relative group">
                    <BaseNodeContent>
                        {typeof Icon === "string" ? (
                            <Image src={Icon} alt={name} width={16} height={16} />
                        ) : (
                            <Icon className="size-4 text-muted-foreground" />
                        )}
                        {children}
                        <BaseHandle
                            id="source-1"
                            type="source"
                            position={Position.Right}
                        />
                    </BaseNodeContent>
                </BaseNode>
            </NodeStatusIndicator>
        </WorkflowNode>
    )
})

BaseTriggerNode.displayName = "BaseTriggerNode";