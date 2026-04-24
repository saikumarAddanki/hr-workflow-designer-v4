import { useState } from 'react';
import type { SimulationResult } from '../types';
import { apiClient } from '../api/mockApi';
import { useWorkflowStore } from '../store/workflowStore';

export function useSimulation() {
  const [result, setResult] = useState<SimulationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { nodes, edges } = useWorkflowStore();

  const run = async () => {
    setLoading(true);
    setResult(null);
    const res = await apiClient.simulate(nodes, edges);
    setResult(res);
    setLoading(false);
  };

  const reset = () => setResult(null);

  return { run, reset, result, loading };
}
