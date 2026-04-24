import React from 'react';
import { Topbar } from './components/panels/Topbar';
import { Sidebar } from './components/panels/Sidebar';
import { Canvas } from './components/Canvas';
import { PropertiesPanel } from './components/panels/PropertiesPanel';
import { SimulationPanel } from './components/panels/SimulationPanel';
import { useWorkflowStore } from './store/workflowStore';

export default function App() {
  const { showSimPanel } = useWorkflowStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <Topbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar />
        <Canvas />
        <PropertiesPanel />
      </div>
      {showSimPanel && <SimulationPanel />}
    </div>
  );
}
