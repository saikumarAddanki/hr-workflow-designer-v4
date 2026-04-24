import { create } from 'zustand';
import type { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';
import { applyNodeChanges, applyEdgeChanges, addEdge } from 'reactflow';
import type { WorkflowNodeData, NodeType } from '../types';

interface WorkflowState {
  nodes: Node<WorkflowNodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;
  showSimPanel: boolean;

  // Actions
  setNodes: (nodes: Node<WorkflowNodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (connection: Connection) => void;
  addNode: (type: NodeType, position: { x: number; y: number }) => void;
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  selectNode: (nodeId: string | null) => void;
  toggleSimPanel: () => void;
  clearCanvas: () => void;
  exportWorkflow: () => string;
  importWorkflow: (json: string) => void;
}

const defaultDataForType: Record<NodeType, WorkflowNodeData> = {
  start: { type: 'start', title: 'Start', metadata: [] },
  task: { type: 'task', title: 'New Task', description: '', assignee: '', dueDate: '', customFields: [] },
  approval: { type: 'approval', title: 'Approval', approverRole: 'Manager', autoApproveThreshold: 0 },
  automated: { type: 'automated', title: 'Automated Step', actionId: '', actionParams: {} },
  end: { type: 'end', endMessage: 'Workflow completed', summaryFlag: false },
};

let nodeIdCounter = 1;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  showSimPanel: false,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) =>
    set({ nodes: applyNodeChanges(changes, get().nodes) as Node<WorkflowNodeData>[] }),

  onEdgesChange: (changes) =>
    set({ edges: applyEdgeChanges(changes, get().edges) }),

  onConnect: (connection) =>
    set({ edges: addEdge({ ...connection, animated: true, style: { stroke: '#2563eb', strokeWidth: 2 } }, get().edges) }),

  addNode: (type, position) => {
    const id = `${type}-${nodeIdCounter++}`;
    const newNode: Node<WorkflowNodeData> = {
      id,
      type,
      position,
      data: { ...defaultDataForType[type] },
    };
    set({ nodes: [...get().nodes, newNode], selectedNodeId: id });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map(n =>
        n.id === nodeId ? { ...n, data: { ...n.data, ...data } as WorkflowNodeData } : n
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter(n => n.id !== nodeId),
      edges: get().edges.filter(e => e.source !== nodeId && e.target !== nodeId),
      selectedNodeId: get().selectedNodeId === nodeId ? null : get().selectedNodeId,
    });
  },

  selectNode: (nodeId) => set({ selectedNodeId: nodeId }),

  toggleSimPanel: () => set({ showSimPanel: !get().showSimPanel }),

  clearCanvas: () => set({ nodes: [], edges: [], selectedNodeId: null }),

  exportWorkflow: () => {
    const { nodes, edges } = get();
    return JSON.stringify({ nodes, edges }, null, 2);
  },

  importWorkflow: (json) => {
    try {
      const { nodes, edges } = JSON.parse(json);
      set({ nodes, edges, selectedNodeId: null });
    } catch {
      console.error('Invalid workflow JSON');
    }
  },
}));
