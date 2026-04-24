import React from 'react';
import type { NodeType } from '../../types';

interface NodeDef {
  type: NodeType;
  label: string;
  color: string;
  icon: string;
  description: string;
}

const NODE_DEFS: NodeDef[] = [
  { type: 'start', label: 'Start', color: 'var(--node-start)', icon: '▶', description: 'Entry point' },
  { type: 'task', label: 'Task', color: 'var(--node-task)', icon: '📋', description: 'Human task' },
  { type: 'approval', label: 'Approval', color: 'var(--node-approval)', icon: '✓', description: 'Approval step' },
  { type: 'automated', label: 'Automated', color: 'var(--node-auto)', icon: '⚡', description: 'System action' },
  { type: 'end', label: 'End', color: 'var(--node-end)', icon: '⏹', description: 'Completion' },
];

export function Sidebar() {
  const onDragStart = (e: React.DragEvent, type: NodeType) => {
    e.dataTransfer.setData('nodeType', type);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{
      width: 200, background: 'var(--bg-card)', borderRight: '1px solid var(--border)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
    }}>
      <div style={{ padding: '16px 14px 10px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Node Palette
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', marginTop: 3 }}>Drag to canvas</div>
      </div>

      <div style={{ padding: '0 10px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
        {NODE_DEFS.map(def => (
          <div
            key={def.type}
            draggable
            onDragStart={e => onDragStart(e, def.type)}
            style={{
              padding: '9px 12px', borderRadius: 8,
              border: '1px solid var(--border)',
              background: 'var(--bg)', cursor: 'grab',
              display: 'flex', alignItems: 'center', gap: 10,
              transition: 'all 0.15s', userSelect: 'none',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLDivElement).style.background = 'var(--bg-hover)';
              (e.currentTarget as HTMLDivElement).style.borderColor = def.color;
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.background = 'var(--bg)';
              (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
            }}
          >
            <div style={{
              width: 30, height: 30, borderRadius: 8,
              background: 'var(--bg-hover)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 13, flexShrink: 0, color: def.color,
            }}>
              {def.icon}
            </div>
            <div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text)' }}>{def.label}</div>
              <div style={{ fontSize: 10.5, color: 'var(--text-muted)' }}>{def.description}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ padding: '10px 14px', borderTop: '1px solid var(--border)', marginTop: 'auto' }}>
        <div style={{ fontSize: 10, color: 'var(--text-dim)', lineHeight: 1.5 }}>
          <strong style={{ color: 'var(--text-muted)' }}>Tips</strong><br />
          • Drag nodes onto canvas<br />
          • Click node to edit<br />
          • Connect handles to link<br />
          • Delete key removes selected
        </div>
      </div>
    </div>
  );
}
