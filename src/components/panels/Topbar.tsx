import React, { useRef, useState, useEffect } from 'react';
import { useWorkflowStore } from '../../store/workflowStore';

export function Topbar() {
  const { toggleSimPanel, clearCanvas, exportWorkflow, importWorkflow, nodes, edges } = useWorkflowStore();
  const fileRef = useRef<HTMLInputElement>(null);
  const [isDark, setIsDark] = useState(() => document.documentElement.getAttribute('data-theme') === 'dark');

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
  };

  const handleExport = () => {
    const json = exportWorkflow();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'workflow.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      if (ev.target?.result) importWorkflow(ev.target.result as string);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const btnStyle = (primary = false): React.CSSProperties => ({
    padding: '6px 13px', borderRadius: 7, fontSize: 12.5, fontWeight: 500,
    cursor: 'pointer', fontFamily: 'var(--font)', transition: 'all 0.15s',
    border: primary ? 'none' : '1px solid var(--border)',
    background: primary ? 'var(--accent)' : 'var(--bg-hover)',
    color: primary ? '#fff' : 'var(--text-muted)',
  });

  return (
    <div style={{
      height: 52, background: 'var(--bg-card)', borderBottom: '1px solid var(--border)',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 16px', flexShrink: 0,
      boxShadow: '0 1px 0 var(--border)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 30, height: 30, borderRadius: 8,
          background: 'var(--accent)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 15, color: '#fff',
        }}>⚙</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', lineHeight: 1.2 }}>
            HR Workflow Designer
          </div>
          <div style={{ fontSize: 10.5, color: 'var(--text-dim)' }}>Tredence Studio</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 20, color: 'var(--text-muted)', fontSize: 12 }}>
        <span><strong style={{ color: 'var(--text)' }}>{nodes.length}</strong> nodes</span>
        <span><strong style={{ color: 'var(--text)' }}>{edges.length}</strong> edges</span>
      </div>

      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
        <input ref={fileRef} type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
        <button onClick={() => fileRef.current?.click()} style={btnStyle()}>Import</button>
        <button onClick={handleExport} style={btnStyle()}>Export</button>
        <button onClick={() => { if (confirm('Clear all nodes?')) clearCanvas(); }} style={btnStyle()}>Clear</button>
        <button
          onClick={toggleTheme}
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
          style={{
            ...btnStyle(),
            padding: '6px 10px',
            fontSize: 15,
            lineHeight: 1,
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        <button onClick={toggleSimPanel} style={btnStyle(true)}>▶ Simulate</button>
      </div>
    </div>
  );
}
