import React from 'react';
import { useWorkflowStore } from '../../store/workflowStore';
import { NodeForm } from '../forms/NodeForm';

export function PropertiesPanel() {
  const { selectedNodeId, selectNode } = useWorkflowStore();

  return (
    <div style={{
      width: 272, background: 'var(--bg-card)', borderLeft: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      transition: 'width 0.2s ease',
    }}>
      <div style={{
        padding: '12px 14px 10px', borderBottom: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Properties
        </span>
        {selectedNodeId && (
          <button
            onClick={() => selectNode(null)}
            style={{
              background: 'none', border: 'none', color: 'var(--text-muted)',
              cursor: 'pointer', fontSize: 14, padding: '0 2px',
            }}
          >×</button>
        )}
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 14 }}>
        {selectedNodeId ? (
          <NodeForm nodeId={selectedNodeId} />
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 8px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: 28, marginBottom: 10 }}>←</div>
            <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
              Select a node
            </div>
            <div style={{ fontSize: 11.5, lineHeight: 1.6 }}>
              Click any node on the canvas to view and edit its properties here.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
