/* eslint-disable @typescript-eslint/no-explicit-any */

import { NextResponse } from "next/server";

// Helper function to validate node connections
export function getValidConnectedNodes(
    webhookNodeId: string,
    edges: { source: string; target: string }[]
  ): Set<string> {
    const validNodes = new Set<string>();
    const nodesWithIncoming = new Set<string>();
    const nodesWithOutgoing = new Set<string>();
  
    // First, collect all nodes with incoming and outgoing connections
    edges.forEach(edge => {
      nodesWithOutgoing.add(edge.source);
      nodesWithIncoming.add(edge.target);
    });
  
    // Add webhook node as it's valid by default (only needs outgoing)
    validNodes.add(webhookNodeId);
  
    // Function to check if a node is properly connected
    function isValidNode(nodeId: string): boolean {
      // Webhook node only needs outgoing connections
      if (nodeId === webhookNodeId) {
        return nodesWithOutgoing.has(nodeId);
      }
      // Terminal nodes only need incoming connections
      if (!nodesWithOutgoing.has(nodeId)) {
        return nodesWithIncoming.has(nodeId);
      }
      // All other nodes need both incoming and outgoing connections
      return nodesWithIncoming.has(nodeId) && nodesWithOutgoing.has(nodeId);
    }
  
    // Helper function for depth-first traversal
    function traverse(currentNodeId: string) {
      // Get all outgoing edges for current node
      const outgoingEdges = edges.filter(edge => edge.source === currentNodeId);
      
      for (const edge of outgoingEdges) {
        if (isValidNode(edge.target) && !validNodes.has(edge.target)) {
          validNodes.add(edge.target);
          traverse(edge.target);
        }
      }
    }
    
    // Start traversal from webhook node
    traverse(webhookNodeId);
    
    return validNodes;
  }


  interface ResponseParams {
    error: boolean;
    message?: string;
    data?: any;
    errorData?: any;
    status?: number;
    headers?: Record<string, string>;
  }
  
 export function createResponse({ 
    error, 
    message, 
    data, 
    errorData, 
    status = 200, 
    headers = {}
  }: ResponseParams) {
    const response: {
      error: boolean;
      message?: string;
      data?: string;
      errorData?: string;
    } = {
      error
    };
  
    if (message) response.message = message;
    if (data) response.data = data
    if (errorData) response.errorData = JSON.stringify(errorData);
  
    return NextResponse.json(response, { status,headers });
  }