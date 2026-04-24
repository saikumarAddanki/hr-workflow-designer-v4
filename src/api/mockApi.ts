import type { AutomationAction, SimulationResult, SimulationStep } from '../types';
import type { Node, Edge } from 'reactflow';
import type { WorkflowNodeData } from '../types';

const AUTOMATIONS: AutomationAction[] = [
  { id: 'send_email', label: 'Send Email', params: ['to', 'subject', 'body'] },
  { id: 'generate_doc', label: 'Generate Document', params: ['template', 'recipient'] },
  { id: 'send_slack', label: 'Send Slack Message', params: ['channel', 'message'] },
  { id: 'create_ticket', label: 'Create JIRA Ticket', params: ['project', 'title', 'assignee'] },
  { id: 'update_hrms', label: 'Update HRMS Record', params: ['employeeId', 'field', 'value'] },
  { id: 'trigger_webhook', label: 'Trigger Webhook', params: ['url', 'method'] },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const apiClient = {
  async getAutomations(): Promise<AutomationAction[]> {
    await delay(300);
    return AUTOMATIONS;
  },

  async simulate(
    nodes: Node<WorkflowNodeData>[],
    edges: Edge[]
  ): Promise<SimulationResult> {
    await delay(800);

    const errors: string[] = [];
    const steps: SimulationStep[] = [];

    // Validate structure
    const startNodes = nodes.filter(n => n.data.type === 'start');
    const endNodes = nodes.filter(n => n.data.type === 'end');

    if (startNodes.length === 0) {
      errors.push('Workflow must have a Start node');
    }
    if (startNodes.length > 1) {
      errors.push('Workflow can only have one Start node');
    }
    if (endNodes.length === 0) {
      errors.push('Workflow must have an End node');
    }
    if (nodes.length < 2) {
      errors.push('Workflow must have at least 2 nodes');
    }

    // Check for disconnected nodes
    const connectedNodeIds = new Set<string>();
    edges.forEach(e => {
      connectedNodeIds.add(e.source);
      connectedNodeIds.add(e.target);
    });
    const disconnected = nodes.filter(n => !connectedNodeIds.has(n.id) && nodes.length > 1);
    if (disconnected.length > 0) {
      errors.push(`${disconnected.length} disconnected node(s) found`);
    }

    if (errors.length > 0) {
      return { success: false, steps: [], errors, summary: 'Validation failed. Fix errors and retry.' };
    }

    // Topological sort / BFS simulation
    const adj = new Map<string, string[]>();
    nodes.forEach(n => adj.set(n.id, []));
    edges.forEach(e => adj.get(e.source)?.push(e.target));

    const visited = new Set<string>();
    const queue = [startNodes[0].id];
    const now = new Date();

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);

      const node = nodes.find(n => n.id === nodeId)!;
      if (!node) continue;

      const data = node.data;
      let message = '';
      let status: SimulationStep['status'] = 'success';

      switch (data.type) {
        case 'start':
          message = `Workflow initiated: "${data.title || 'Untitled'}"`;
          break;
        case 'task':
          if (!data.title) { status = 'warning'; message = 'Task has no title'; }
          else message = `Task "${data.title}" assigned to ${data.assignee || 'Unassigned'}`;
          break;
        case 'approval':
          message = `Approval requested from ${data.approverRole || 'Manager'} (threshold: ${data.autoApproveThreshold || 0}%)`;
          break;
        case 'automated':
          if (!data.actionId) { status = 'warning'; message = 'No automation action selected'; }
          else {
            const action = AUTOMATIONS.find(a => a.id === data.actionId);
            message = `Executing: ${action?.label || data.actionId}`;
          }
          break;
        case 'end':
          message = data.endMessage || 'Workflow completed successfully';
          if (data.summaryFlag) message += ' • Summary report generated';
          break;
      }

      const stepTime = new Date(now.getTime() + steps.length * 1200);
      steps.push({
        nodeId,
        nodeType: data.type,
        nodeTitle: ('title' in data ? data.title : data.type) || data.type,
        status,
        message,
        timestamp: stepTime.toLocaleTimeString(),
      });

      (adj.get(nodeId) || []).forEach(next => {
        if (!visited.has(next)) queue.push(next);
      });
    }

    const hasWarnings = steps.some(s => s.status === 'warning');
    return {
      success: true,
      steps,
      errors: [],
      summary: hasWarnings
        ? `Workflow simulated with ${steps.length} steps (${steps.filter(s => s.status === 'warning').length} warnings)`
        : `Workflow simulated successfully — ${steps.length} steps executed`,
    };
  },
};
