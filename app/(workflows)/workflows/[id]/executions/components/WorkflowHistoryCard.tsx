import Link from "next/link";
import { cn, formatDateToDayMonthTime, getDateDifference } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { workflowHistoryT } from "@/lib/types";
import { useMemo } from "react";

interface WorkflowHistoryProps {
  item: workflowHistoryT;
  isActive?: boolean;
}
const statusData = {
  PENDING: {
    color: "!bg-yellow-500",
    label: "Pending",
  },
  COMPLETED: {
    color: "!bg-green-500",
    label: "Completed",
  },
  FAILED: {
    color: "!bg-red-500",
    label: "Failed",
  },
};

export function WorkflowHistoryCard({
  item,
  isActive = false,
}: WorkflowHistoryProps) {
  const statusLable = useMemo(() => {
    if(["COMPLETED", "FAILED"].includes(item.status)){
        const dateDiff = getDateDifference({
                toDate: item.completedAt!,
                fromDate: item.createdAt,
              })
            
              return `${statusData[item.status].label} ${dateDiff?.days || dateDiff?.hours || dateDiff?.minutes || dateDiff?.seconds ? "in " : ""}` +
              `${dateDiff?.days || ""} ${dateDiff?.days ? (dateDiff.days > 1 ? "days" : "day") : ""} ` +
              `${dateDiff?.hours || ""} ${dateDiff?.hours ? (dateDiff.hours > 1 ? "hours" : "hour") : ""} ` +
              `${dateDiff?.minutes || ""} ${dateDiff?.minutes ? (dateDiff.minutes > 1 ? "minutes" : "minute") : ""} ` +
              `${dateDiff?.seconds || ""} ${dateDiff?.seconds ? (dateDiff.seconds > 1 ? "seconds" : "second") : ""}`.trim();
            
    }
    return`${statusData[item.status].label} from ${
          item?.createdAt ? new Date(item.createdAt).toLocaleString() : ""
        }`;
  }, [item.status]);

  return (
    <Link
      href={`/workflows/${item.workflowId}/executions?e_id=${item.id}`}
      className="pt-1"
    >
      <div
        className={cn(
          "transition-colors duration-200 px-4 p-2 flex flex-col gap-2  rounded-lg shadow-none border-none",
          isActive ? "bg-secondary" : "bg-background",
          "hover:bg-secondary/80"
        )}
      >
        <h1 className="text-sm font-semibold flex items-center justify-between">
          {formatDateToDayMonthTime(item.createdAt)}
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              `${statusData[item.status].color}`
            )}
          >
            
          </span>
        </h1>
        <div>
          <div className="flex items-center text-xs font-medium text-muted-foreground">
            <CalendarIcon className="mr-2 h-4 w-4" />
            {statusLable}
          </div>
        </div>
      </div>
    </Link>
  );
}
