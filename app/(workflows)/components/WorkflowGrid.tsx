import { Button } from "@/components/ui/button";
import WorkflowCard from './WorkflowCard';
import { onGetWorkflows } from "../_actions/workflow-connections";
import { redirect } from "next/navigation";

export default async function WorkflowGrid() {
  const { error, workflows } = await onGetWorkflows();

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={() =>redirect("/workflows")}>Retry</Button>
      </div>
    );
  }

  if (!workflows || workflows.length === 0) {
    return <p className="text-center p-4">No workflows found.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {workflows.map((workflow) => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}

