import React from 'react';
import { Handle, Position } from 'reactflow';

interface BaseNodeProps {
  id: string;
  selected: boolean;
  color: string;
  icon: React.ReactNode;
  label: string;
  subtitle?: string;
  showSource?: boolean;
  showTarget?: boolean;
}

export function BaseNode({
  id, selected, color, icon, label, subtitle,
  showSource = true, showTarget = true,
}: BaseNodeProps) {
  return (
    <div style={{
      background: '#fff',
      border: `1.5px solid ${selected ? color : '#e8e8e2'}`,
      borderRadius: 12,
      minWidth: 180, maxWidth: 220,
      boxShadow: selected
        ? `0 0 0 3px ${color}22, 0 4px 16px rgba(0,0,0,0.10)`
        : '0 2px 8px rgba(0,0,0,0.07)',
      transition: 'all 0.15s ease',
      cursor: 'pointer', overflow: 'hidden',
    }}>
      <div style={{ height: 3, background: color }} />

      {showTarget && (
        <Handle type="target" position={Position.Top}
          style={{ background: color, borderColor: '#fff' }} />
      )}

      <div style={{ padding: '10px 14px 12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: subtitle ? 4 : 0 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: `${color}15`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color, flexShrink: 0,
          }}>
            {icon}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontSize: 12.5, fontWeight: 600, color: '#1a1a18',
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {label}
            </div>
          </div>
        </div>
        {subtitle && (
          <div style={{
            fontSize: 11, color: '#6b6b60', marginLeft: 36,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {subtitle}
          </div>
        )}
      </div>

      {showSource && (
        <Handle type="source" position={Position.Bottom}
          style={{ background: color, borderColor: '#fff' }} />
      )}
    </div>
  );
}
