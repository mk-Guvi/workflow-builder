import { AllNodesDataI } from "@/lib/types";
import React from "react";

type Props = {
  data: AllNodesDataI;
};

function WebhookNodeParameter({ data }: Props) {
  return <div>{`${data}`}</div>;
}

export default WebhookNodeParameter;
