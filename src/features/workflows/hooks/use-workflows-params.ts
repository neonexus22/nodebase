import { useQueryStates } from "nuqs";
import { workflowsParams } from "../components/params";

export const useWokflowsParams = () => {
  return useQueryStates(workflowsParams);
};
