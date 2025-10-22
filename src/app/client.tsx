
"use client"

import { useSuspenseQuery } from "@tanstack/react-query"
import { useTRPC } from "@/trpc/client"

const Client = () => {
    const trpc = useTRPC();
    const { data: users } = useSuspenseQuery(trpc.getUsers.queryOptions())
    return (
        <div>Client {JSON.stringify(users)}</div>
    )
}

export default Client