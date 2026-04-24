import React from 'react';
import type { NodeProps } from 'reactflow';
import type { WorkflowNodeData, StartNodeData, TaskNodeData, ApprovalNodeData, AutomatedNodeData, EndNodeData } from '../../types';
import { BaseNode } from './BaseNode';

const PlayIcon = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M4 3l9 5-9 5V3z"/></svg>;
const CheckIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>;
const ClipIcon = () => <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 012 2v14a2 2 0 01-2 2H6a2 2 0 01-2-2V6a2 2 0 012-2h2"/></svg>;
const ZapIcon = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><path d="M6 2l-4 8h5l-1 4 7-9H8l2-3H6z"/></svg>;
const StopIcon = () => <svg width="14" height="14" fill="currentColor" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7"/></svg>;

export function StartNode({ id, selected, data }: NodeProps<StartNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      color="var(--node-start)"
      icon={<PlayIcon />}
      label={data.title || 'Start'}
      subtitle={data.metadata?.length ? `${data.metadata.length} metadata` : undefined}
      showTarget={false}
    />
  );
}

export function TaskNode({ id, selected, data }: NodeProps<TaskNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      color="var(--node-task)"
      icon={<ClipIcon />}
      label={data.title || 'Task'}
      subtitle={data.assignee || (data.description ? data.description.slice(0, 24) : undefined)}
    />
  );
}

export function ApprovalNode({ id, selected, data }: NodeProps<ApprovalNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      color="var(--node-approval)"
      icon={<CheckIcon />}
      label={data.title || 'Approval'}
      subtitle={data.approverRole}
    />
  );
}

export function AutomatedNode({ id, selected, data }: NodeProps<AutomatedNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      color="var(--node-auto)"
      icon={<ZapIcon />}
      label={data.title || 'Automated'}
      subtitle={data.actionId ? data.actionId.replace(/_/g, ' ') : 'No action'}
    />
  );
}

export function EndNode({ id, selected, data }: NodeProps<EndNodeData>) {
  return (
    <BaseNode
      id={id} selected={selected}
      color="var(--node-end)"
      icon={<StopIcon />}
      label={data.endMessage ? data.endMessage.slice(0, 20) : 'End'}
      showSource={false}
    />
  );
}

export const nodeTypes = {
  start: StartNode,
  task: TaskNode,
  approval: ApprovalNode,
  automated: AutomatedNode,
  end: EndNode,
};
