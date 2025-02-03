import {
  AllNodesDataI,
  AllNodesI,
  LinkI,
  Workflow,
  workflowHistoryT,
} from "@/lib/types";
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
  executionState: {
    listLoading: boolean;
    detailLoading: boolean;
    listError: string;
    detailError: string;
    selectedExecution: Workflow | null;
    executions: workflowHistoryT[];
    executionsDetails: Record<
      string,
      {
        nodes: AllNodesDataI[];
        edges: LinkI[];
        nodesData: Record<string, AllNodesDataI>;
        workflow: Workflow;
      }
    >;
    current_page: number;
    total_pages: number;
    total_count: number;
    page_size: number;
  };
};

type Store = StoreState & {
  update: (partialState: Partial<StoreState>) => void;
  addNode: (node: AllNodesI) => void;
  deleteNode: (nodeId: string) => void;
  updateNodes: (nodes: AllNodesI[]) => void;
  updateNodeData: (nodeId: string, data: AllNodesDataI) => void;
  updateExecutionState: (
    partialState: Partial<StoreState["executionState"]>
  ) => void;
};

export const useWorkflowStore = create<Store>((set) => {
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
    executionState: {
      listLoading: false,
      detailLoading: false,
      listError: "",
      detailError: "",
      selectedExecution: null,
      executionsDetails: {},
      executions: [],
      current_page: 1,
      total_pages: 0,
      total_count: 0,
      page_size:25
    },
    updateExecutionState: (partialState) =>
      set((state) => ({
        ...state,
        executionState: { ...state.executionState, ...partialState },
      })),
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
        showSave: true,
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
  };
});
