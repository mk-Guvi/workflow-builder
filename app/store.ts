import { AllNodesDataI, AllNodesI, LinkI, Workflow } from "@/lib/types";
import { create } from "zustand";

type StoreState = {
  showSave: boolean;
  loading: boolean;
  error: string;
  selectedNode: string;
  workflowDetails: Workflow | null;
  nodesData: Record<string, AllNodesDataI>;
  draftState: {
    edges: LinkI[];
    nodes: AllNodesI[];
  };
  mainState: {
    edges: LinkI[];
    nodes: AllNodesI[];
  };
};

type Store = StoreState & {
  update: (partialState: Partial<StoreState>) => void;
  addNode: (node: AllNodesI) => void;
  deleteNode: (nodeId: string) => void;
  updateNodes: (nodes: AllNodesI[]) => void;
  updateNodeData: (nodeId: string, data: AllNodesDataI) => void;
};

export const useWorkflowStore = create<Store>((set,) => {
  return {
  showSave: false,
  loading: true,
  error: "",
  selectedNode: "",
  workflowDetails: null,
  nodesData: {},
  draftState: {
    edges: [],
    nodes: [],
  },
  mainState: {
    edges: [],
    nodes: [],
  },
  update: (partialState) => set((state) => ({ ...state, ...partialState })),
  updateNodeData: (nodeId, data) =>
    set((state) => ({
      ...state,
      nodesData: {
        ...state.nodesData,
        [nodeId]: data,
      },
    })),
  updateNodes: (nodes: AllNodesI[]) =>
    set((state) => ({
      ...state,
      showSave:true,
      draftState: {
        ...state.draftState,
        nodes,
      },
    })),

  deleteNode: (nodeId: string) =>
    set((state) => ({
      ...state,
      draftState: {
        ...state.draftState,
        nodes: state.draftState.nodes.filter((d) => d.id !== nodeId),
      },
    })),
  addNode: (node: AllNodesI) =>
    set((state) => ({
      ...state,
      draftState: {
        ...state.draftState,
        nodes: [...state.draftState.nodes, node],
      },
    })),
}
});
