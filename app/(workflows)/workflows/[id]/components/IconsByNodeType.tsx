"use client";
import React from "react";
import { CircuitBoard, GitBranch, Mail, Zap } from "lucide-react";
import { TNodeTypes } from "@/lib/types";

type Props = { type: TNodeTypes };

const NodeIconByType = ({ type }: Props) => {
  switch (type) {
    case "WEBHOOK_NODE":
      return <Mail className="flex-shrink-0" size={10} />;
    case "CODE_NODE":
      return <GitBranch className="flex-shrink-0" size={10} />;
    case "WEBHOOK_RESPONSE_NODE":
      return <CircuitBoard className="flex-shrink-0" size={10} />;
    default:
      return <Zap className="flex-shrink-0" size={10} />;
  }
};

export default NodeIconByType;
