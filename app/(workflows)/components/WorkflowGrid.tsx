import WorkflowCard from "./WorkflowCard";
import { onGetWorkflows } from "../_actions/workflowsActions";
import { ErrorView } from "./ErrorView";


export default async function WorkflowGrid() {
  const { error, workflows } = await onGetWorkflows();

  if (error) {
    return <ErrorView error={error} />;
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
