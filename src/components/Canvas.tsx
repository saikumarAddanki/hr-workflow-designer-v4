import React, { useCallback, useRef } from 'react';
import ReactFlow, {
  Background, Controls, MiniMap,
  BackgroundVariant, type NodeMouseHandler,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useWorkflowStore } from '../store/workflowStore';
import { nodeTypes } from './nodes/NodeTypes';
import type { NodeType } from '../types';

export function Canvas() {
  const {
    nodes, edges, onNodesChange, onEdgesChange, onConnect,
    addNode, selectNode,
  } = useWorkflowStore();

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [rfInstance, setRfInstance] = React.useState<any>(null);

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const type = e.dataTransfer.getData('nodeType') as NodeType;
    if (!type || !rfInstance || !reactFlowWrapper.current) return;

    const bounds = reactFlowWrapper.current.getBoundingClientRect();
    const position = rfInstance.project({
      x: e.clientX - bounds.left,
      y: e.clientY - bounds.top,
    });
    addNode(type, position);
  }, [rfInstance, addNode]);

  const onNodeClick: NodeMouseHandler = useCallback((_, node) => {
    selectNode(node.id);
  }, [selectNode]);

  const onPaneClick = useCallback(() => {
    selectNode(null);
  }, [selectNode]);

  return (
    <div ref={reactFlowWrapper} style={{ flex: 1, position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setRfInstance}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={nodeTypes}
        fitView
        deleteKeyCode="Delete"
        defaultEdgeOptions={{ animated: true, style: { stroke: '#2563eb', strokeWidth: 2 } }}
        connectionLineStyle={{ stroke: '#2563eb', strokeWidth: 2 }}
        snapToGrid
        snapGrid={[12, 12]}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="#252d3d" />
        <Controls />
        <MiniMap
          nodeColor={(n) => {
            const colors: Record<string, string> = {
              start: '#2563eb', task: '#0ea5e9',
              approval: '#6b4fa8', automated: '#c96a2a', end: '#b83232',
            };
            return colors[n.type || 'task'] || '#2563eb';
          }}
          maskColor="rgba(15,17,23,0.8)"
        />
      </ReactFlow>

      {nodes.length === 0 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          pointerEvents: 'none',
        }}>
          <div style={{ textAlign: 'center', color: 'var(--text-dim)' }}>
            <div style={{ fontSize: 40, marginBottom: 12, opacity: 0.4 }}>⚡</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 6 }}>
              Design your workflow
            </div>
            <div style={{ fontSize: 12.5, lineHeight: 1.7 }}>
              Drag nodes from the left panel<br />to start building your workflow
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
