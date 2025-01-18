import { AllNodesDataI, AllNodesI, LinkI, Workflow } from "@/lib/types";
import { create } from "zustand";

type StoreState = {
  loading: boolean;
  error: string;
  selectedNode: string;
  workflowDetails: Workflow | null;
  draftState: {
    edges: LinkI[];
    nodes: AllNodesI[];
    nodesSettings:Record<string, AllNodesDataI>;
  };
  mainState: {
    edges: LinkI[];
    nodes: AllNodesI[];
    nodesSettings:Record<string, AllNodesDataI>;
  };
};

type Store = StoreState & {
  update: (partialState: Partial<StoreState>) => void;
  addNode: (node: AllNodesI) => void;
  deleteNode: (nodeId: string) => void;
  updateNodes: (nodes: AllNodesI[]) => void;
};

export const useWorkflowStore = create<Store>((set) => ({
  loading: false,
  error: "",
  selectedNode: "",
  workflowDetails: null,
  draftState: {
    edges: [],
    nodes: [],
    nodesSettings:{},
  },
  mainState: {
    edges: [],
    nodes: [],
    nodesSettings:{},
  },
  update: (partialState) => set((state) => ({ ...state, ...partialState })),
  updateNodes: (nodes: AllNodesI[]) =>
    set((state) => ({
      ...state,
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
}));
