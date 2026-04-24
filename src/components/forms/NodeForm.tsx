import React from 'react';
import type { WorkflowNodeData, MetadataField } from '../../types';
import { useWorkflowStore } from '../../store/workflowStore';
import { useAutomations } from '../../hooks/useAutomations';

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '7px 10px', borderRadius: 6,
  border: '1px solid var(--border)', background: 'var(--bg)',
  color: 'var(--text)', fontSize: 13, outline: 'none',
  transition: 'border-color 0.15s',
};
const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: 11, fontWeight: 600,
  color: 'var(--text-muted)', textTransform: 'uppercase',
  letterSpacing: '0.05em', marginBottom: 5,
};
const fieldStyle: React.CSSProperties = { marginBottom: 14 };

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={fieldStyle}>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  );
}

function KVEditor({ pairs, onChange, addLabel = 'Add Field' }: {
  pairs: MetadataField[];
  onChange: (pairs: MetadataField[]) => void;
  addLabel?: string;
}) {
  const update = (idx: number, key: string, value: string) => {
    const updated = [...pairs];
    updated[idx] = { key, value };
    onChange(updated);
  };
  const remove = (idx: number) => onChange(pairs.filter((_, i) => i !== idx));
  const add = () => onChange([...pairs, { key: '', value: '' }]);

  return (
    <div>
      {pairs.map((p, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 6 }}>
          <input
            style={{ ...inputStyle, flex: 1 }} placeholder="Key"
            value={p.key} onChange={e => update(i, e.target.value, p.value)}
          />
          <input
            style={{ ...inputStyle, flex: 1 }} placeholder="Value"
            value={p.value} onChange={e => update(i, p.key, e.target.value)}
          />
          <button onClick={() => remove(i)} style={{
            padding: '0 8px', border: 'none', borderRadius: 6,
            background: 'var(--bg)', color: 'var(--red)', cursor: 'pointer', fontSize: 16,
          }}>×</button>
        </div>
      ))}
      <button onClick={add} style={{
        padding: '5px 10px', border: '1px dashed var(--border-light)',
        borderRadius: 6, background: 'transparent', color: 'var(--text-muted)',
        cursor: 'pointer', fontSize: 12, width: '100%',
      }}>+ {addLabel}</button>
    </div>
  );
}

function StartForm({ data, nodeId }: { data: Extract<WorkflowNodeData, { type: 'start' }>; nodeId: string }) {
  const { updateNodeData } = useWorkflowStore();
  const upd = (patch: Partial<typeof data>) => updateNodeData(nodeId, { ...data, ...patch });
  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title} onChange={e => upd({ title: e.target.value })} placeholder="Workflow start title" />
      </Field>
      <Field label="Metadata">
        <KVEditor pairs={data.metadata} onChange={metadata => upd({ metadata })} />
      </Field>
    </>
  );
}

function TaskForm({ data, nodeId }: { data: Extract<WorkflowNodeData, { type: 'task' }>; nodeId: string }) {
  const { updateNodeData } = useWorkflowStore();
  const upd = (patch: Partial<typeof data>) => updateNodeData(nodeId, { ...data, ...patch });
  return (
    <>
      <Field label="Title *">
        <input style={inputStyle} value={data.title} onChange={e => upd({ title: e.target.value })} placeholder="Task title (required)" />
      </Field>
      <Field label="Description">
        <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: 64, fontFamily: 'inherit' }}
          value={data.description} onChange={e => upd({ description: e.target.value })} placeholder="Task description" />
      </Field>
      <Field label="Assignee">
        <input style={inputStyle} value={data.assignee} onChange={e => upd({ assignee: e.target.value })} placeholder="e.g. john@company.com" />
      </Field>
      <Field label="Due Date">
        <input style={inputStyle} type="date" value={data.dueDate} onChange={e => upd({ dueDate: e.target.value })} />
      </Field>
      <Field label="Custom Fields">
        <KVEditor pairs={data.customFields} onChange={customFields => upd({ customFields })} />
      </Field>
    </>
  );
}

function ApprovalForm({ data, nodeId }: { data: Extract<WorkflowNodeData, { type: 'approval' }>; nodeId: string }) {
  const { updateNodeData } = useWorkflowStore();
  const upd = (patch: Partial<typeof data>) => updateNodeData(nodeId, { ...data, ...patch });
  const roles = ['Manager', 'HRBP', 'Director', 'VP', 'C-Suite'];
  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title} onChange={e => upd({ title: e.target.value })} placeholder="Approval step title" />
      </Field>
      <Field label="Approver Role">
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={data.approverRole} onChange={e => upd({ approverRole: e.target.value })}>
          {roles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </Field>
      <Field label="Auto-Approve Threshold (%)">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <input
            style={{ ...inputStyle, flex: 1 }} type="range" min={0} max={100}
            value={data.autoApproveThreshold}
            onChange={e => upd({ autoApproveThreshold: Number(e.target.value) })}
          />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--accent)', minWidth: 32 }}>
            {data.autoApproveThreshold}%
          </span>
        </div>
      </Field>
    </>
  );
}

function AutomatedForm({ data, nodeId }: { data: Extract<WorkflowNodeData, { type: 'automated' }>; nodeId: string }) {
  const { updateNodeData } = useWorkflowStore();
  const { automations, loading } = useAutomations();
  const upd = (patch: Partial<typeof data>) => updateNodeData(nodeId, { ...data, ...patch });
  const selectedAction = automations.find(a => a.id === data.actionId);

  return (
    <>
      <Field label="Title">
        <input style={inputStyle} value={data.title} onChange={e => upd({ title: e.target.value })} placeholder="Automated step title" />
      </Field>
      <Field label="Action">
        <select
          style={{ ...inputStyle, cursor: 'pointer' }}
          value={data.actionId}
          onChange={e => upd({ actionId: e.target.value, actionParams: {} })}
          disabled={loading}
        >
          <option value="">{loading ? 'Loading actions...' : '— Select action —'}</option>
          {automations.map(a => <option key={a.id} value={a.id}>{a.label}</option>)}
        </select>
      </Field>
      {selectedAction && selectedAction.params.length > 0 && (
        <Field label="Action Parameters">
          {selectedAction.params.map(param => (
            <div key={param} style={{ marginBottom: 8 }}>
              <label style={{ ...labelStyle, textTransform: 'none', letterSpacing: 0, fontWeight: 500 }}>{param}</label>
              <input
                style={inputStyle}
                placeholder={`Enter ${param}`}
                value={data.actionParams[param] || ''}
                onChange={e => upd({ actionParams: { ...data.actionParams, [param]: e.target.value } })}
              />
            </div>
          ))}
        </Field>
      )}
    </>
  );
}

function EndForm({ data, nodeId }: { data: Extract<WorkflowNodeData, { type: 'end' }>; nodeId: string }) {
  const { updateNodeData } = useWorkflowStore();
  const upd = (patch: Partial<typeof data>) => updateNodeData(nodeId, { ...data, ...patch });
  return (
    <>
      <Field label="End Message">
        <input style={inputStyle} value={data.endMessage} onChange={e => upd({ endMessage: e.target.value })} placeholder="Completion message" />
      </Field>
      <Field label="Generate Summary Report">
        <div
          onClick={() => upd({ summaryFlag: !data.summaryFlag })}
          style={{
            display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
            padding: '8px 10px', borderRadius: 6, border: '1px solid var(--border)',
            background: data.summaryFlag ? 'var(--accent-glow)' : 'var(--bg)',
            transition: 'all 0.15s',
          }}
        >
          <div style={{
            width: 36, height: 20, borderRadius: 10,
            background: data.summaryFlag ? 'var(--accent)' : 'var(--border-light)',
            position: 'relative', transition: 'background 0.2s',
          }}>
            <div style={{
              position: 'absolute', top: 2, left: data.summaryFlag ? 18 : 2,
              width: 16, height: 16, borderRadius: 8,
              background: '#fff', transition: 'left 0.2s',
              boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
            }} />
          </div>
          <span style={{ fontSize: 13, color: data.summaryFlag ? 'var(--accent)' : 'var(--text-muted)' }}>
            {data.summaryFlag ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </Field>
    </>
  );
}

export function NodeForm({ nodeId }: { nodeId: string }) {
  const { nodes, deleteNode } = useWorkflowStore();
  const node = nodes.find(n => n.id === nodeId);
  if (!node) return null;

  const data = node.data;
  const typeColors: Record<string, string> = {
    start: 'var(--node-start)', task: 'var(--node-task)',
    approval: 'var(--node-approval)', automated: 'var(--node-auto)', end: 'var(--node-end)',
  };
  const typeLabels: Record<string, string> = {
    start: 'Start Node', task: 'Task Node',
    approval: 'Approval Node', automated: 'Automated Step', end: 'End Node',
  };

  return (
    <div className="animate-slidein">
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 16, paddingBottom: 12, borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 8, height: 8, borderRadius: 4,
            background: typeColors[data.type],
          }} />
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>
            {typeLabels[data.type]}
          </span>
        </div>
        <button
          onClick={() => deleteNode(nodeId)}
          title="Delete node"
          style={{
            padding: '4px 8px', border: '1px solid var(--border)', borderRadius: 6,
            background: 'transparent', color: 'var(--red)', cursor: 'pointer', fontSize: 11,
            fontFamily: 'var(--font)',
          }}
        >
          Delete
        </button>
      </div>

      {data.type === 'start' && <StartForm data={data} nodeId={nodeId} />}
      {data.type === 'task' && <TaskForm data={data} nodeId={nodeId} />}
      {data.type === 'approval' && <ApprovalForm data={data} nodeId={nodeId} />}
      {data.type === 'automated' && <AutomatedForm data={data} nodeId={nodeId} />}
      {data.type === 'end' && <EndForm data={data} nodeId={nodeId} />}

      <div style={{
        marginTop: 4, padding: '8px 10px', borderRadius: 6,
        background: 'var(--bg)', border: '1px solid var(--border)',
        fontSize: 10.5, color: 'var(--text-dim)', fontFamily: 'var(--mono)',
      }}>
        ID: {nodeId}
      </div>
    </div>
  );
}
