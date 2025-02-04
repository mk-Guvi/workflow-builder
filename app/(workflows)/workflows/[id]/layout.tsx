"use client";
import React from "react";

import "@xyflow/react/dist/style.css";
import { toast } from "sonner";

import { useWorkflowStore } from "@/app/store";

import { useParams, useRouter } from "next/navigation";

function EditorPageLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { id } = useParams();
  const { update, workflowDetails } = useWorkflowStore();

  const onInit = async () => {
    try {
      update({
        loading: true,
        error: "",
        workflowDetails: null,
        mainState: {
          edges: [],
          nodes: [],
        },
        draftState: {
          edges: [],
          nodes: [],
        },
        nodesData: {},
      });
      const response = await fetch(`/api/workflows/${id}`);
      const data = await response.json();
      if (response?.status === 404) {
        toast.error(data.message);
        router.push("/workflows");
        return;
      } else if (response?.status === 200) {
        update({
          workflowDetails: data?.workflow,
          mainState: {
            edges: data?.edges || [],
            nodes: data?.nodes || [],
          },
          draftState: {
            edges: data?.edges || [],
            nodes: data?.nodes || [],
          },
          
        });
      } else {
        toast.error(data?.message || "Something went wrong");
      }
    } catch (e) {
      console.log(e);
      update({
        error: "Something went wrong",
      });
    } finally {
      update({ loading: false });
    }
  };

  React.useEffect(() => {
    if (id && workflowDetails?.id !== id) {
      onInit();
    } else {
      update({ loading: false ,nodesData:{}});
    }
  }, [id, workflowDetails?.name]);

  return <>{children}</>;
}

export default EditorPageLayout;
