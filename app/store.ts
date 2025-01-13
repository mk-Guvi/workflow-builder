import { AllNodesI, LinkI, Workflow } from "@/lib/types";
import { create } from "zustand";

type StoreState = {
  loading: boolean;
  error: string;
  selectedNode: string;
  workflowDetails: Workflow | null;
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
  },
  mainState: {
    edges: [],
    nodes: [],
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
  addNode: (node: AllNodesI) =>
    set((state) => ({
      ...state,
      draftState: {
        ...state.draftState,
        nodes: [...state.draftState.nodes, node],
      },
    })),
}));
