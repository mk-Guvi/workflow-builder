import { AllNodesI, LinkI, Workflow } from "@/lib/types";
import { create } from "zustand";

type StoreState = {
  loading: boolean;
  error: string;
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
};

export const useWorkflowStore = create<Store>((set) => ({
  loading: false,
  error: "",
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
}));
