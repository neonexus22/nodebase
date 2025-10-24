"use client"

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const Home = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data } = useQuery(trpc.getWorkflows.queryOptions());

  const create = useMutation(trpc.createWorkflow.mutationOptions({
    onSuccess: () => {
      toast.success("Job queued");
      queryClient.invalidateQueries(trpc.getWorkflows.queryOptions())
    }
  }));

  return (
    <div className="min-h-screen min-w-screen flex flex-col gap-y-6 items-center justify-center">
      Protected server component
      <div>{JSON.stringify(data)}</div>
      <Button disabled={create.isPending} onClick={() => create.mutate()}>Create workflow</Button>
    </div>
  );
}

export default Home;
