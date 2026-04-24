import { useState, useEffect } from 'react';
import type { AutomationAction } from '../types';
import { apiClient } from '../api/mockApi';

export function useAutomations() {
  const [automations, setAutomations] = useState<AutomationAction[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient.getAutomations().then(data => {
      setAutomations(data);
      setLoading(false);
    });
  }, []);

  return { automations, loading };
}
