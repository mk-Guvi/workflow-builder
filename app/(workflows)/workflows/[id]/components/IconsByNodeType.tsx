"use client";
import React from "react";
import { CircuitBoard, GitBranch, Mail, Zap } from "lucide-react";
import { TNodeTypes } from "@/lib/types";

type Props = { type: TNodeTypes,size?:number };

const NodeIconByType = ({ type,size=20 }: Props) => {
  switch (type) {
    case "WEBHOOK_NODE":
      return <Mail className="flex-shrink-0" size={size} />;
    case "CODE_NODE":
      return <GitBranch className="flex-shrink-0" size={size} />;
    case "WEBHOOK_RESPONSE_NODE":
      return <CircuitBoard className="flex-shrink-0" size={size} />;
    default:
      return <Zap className="flex-shrink-0" size={size} />;
  }
};

export default NodeIconByType;
