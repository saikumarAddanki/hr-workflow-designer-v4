import React, { useState } from 'react';
import { useSimulation } from '../../hooks/useSimulation';
import { useWorkflowStore } from '../../store/workflowStore';

const typeColors: Record<string, string> = {
  start: 'var(--node-start)', task: 'var(--node-task)',
  approval: 'var(--node-approval)', automated: 'var(--node-auto)', end: 'var(--node-end)',
};
const statusColors = { success: 'var(--green)', warning: 'var(--yellow)', error: 'var(--red)' };
const statusIcons = { success: '✓', warning: '⚠', error: '✕' };

export function SimulationPanel() {
  const { toggleSimPanel } = useWorkflowStore();
  const { run, reset, result, loading } = useSimulation();

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, backdropFilter: 'blur(4px)',
    }}
      onClick={e => { if (e.target === e.currentTarget) { toggleSimPanel(); reset(); } }}
    >
      <div
        className="animate-fadein"
        style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 14, width: 540, maxHeight: '80vh',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Header */}
        <div style={{
          padding: '16px 20px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--text)' }}>
              Workflow Sandbox
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 1 }}>
              Simulate and validate your workflow
            </div>
          </div>
          <button
            onClick={() => { toggleSimPanel(); reset(); }}
            style={{
              width: 28, height: 28, borderRadius: 7, border: '1px solid var(--border)',
              background: 'var(--bg)', color: 'var(--text-muted)', cursor: 'pointer',
              fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >×</button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '16px 20px' }}>
          {!result && !loading && (
            <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-muted)' }}>
              <div style={{ fontSize: 36, marginBottom: 12 }}>🧪</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>
                Ready to simulate
              </div>
              <div style={{ fontSize: 12, lineHeight: 1.6 }}>
                Click "Run Simulation" to validate your workflow structure and see a step-by-step execution preview.
              </div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: '32px 16px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                border: '3px solid var(--border)',
                borderTopColor: 'var(--accent)',
                animation: 'spin 0.8s linear infinite',
                margin: '0 auto 12px',
              }} />
              <div style={{ color: 'var(--text-muted)', fontSize: 13 }}>Running simulation...</div>
            </div>
          )}

          {result && (
            <div className="animate-fadein">
              {/* Summary */}
              <div style={{
                padding: '12px 14px', borderRadius: 8, marginBottom: 14,
                background: result.success ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)',
                border: `1px solid ${result.success ? 'rgba(52,211,153,0.25)' : 'rgba(248,113,113,0.25)'}`,
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: result.success ? 'var(--green)' : 'var(--red)' }}>
                  {result.success ? '✓ Simulation Complete' : '✕ Validation Failed'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 3 }}>{result.summary}</div>
              </div>

              {/* Errors */}
              {result.errors.length > 0 && (
                <div style={{ marginBottom: 14 }}>
                  {result.errors.map((err, i) => (
                    <div key={i} style={{
                      padding: '8px 12px', borderRadius: 6, marginBottom: 6,
                      background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)',
                      fontSize: 12, color: 'var(--red)',
                    }}>⚠ {err}</div>
                  ))}
                </div>
              )}

              {/* Steps */}
              {result.steps.length > 0 && (
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 10 }}>
                    Execution Log
                  </div>
                  {result.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
                      {/* Timeline */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                        <div style={{
                          width: 24, height: 24, borderRadius: '50%',
                          background: statusColors[step.status] + '20',
                          border: `2px solid ${statusColors[step.status]}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 10, color: statusColors[step.status], fontWeight: 700,
                        }}>
                          {statusIcons[step.status]}
                        </div>
                        {i < result.steps.length - 1 && (
                          <div style={{ width: 1, flex: 1, minHeight: 10, background: 'var(--border)', margin: '4px 0' }} />
                        )}
                      </div>
                      {/* Content */}
                      <div style={{
                        flex: 1, padding: '6px 10px', borderRadius: 7,
                        background: 'var(--bg)', border: '1px solid var(--border)',
                        marginBottom: 2,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                          <div style={{
                            fontSize: 9, fontWeight: 700, padding: '1px 6px',
                            borderRadius: 4, background: typeColors[step.nodeType] + '20',
                            color: typeColors[step.nodeType], textTransform: 'uppercase',
                          }}>
                            {step.nodeType}
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text)' }}>
                            {step.nodeTitle}
                          </div>
                          <div style={{ marginLeft: 'auto', fontSize: 10, color: 'var(--text-dim)', fontFamily: 'var(--mono)' }}>
                            {step.timestamp}
                          </div>
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--text-muted)' }}>{step.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '12px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', gap: 8,
        }}>
          {result && (
            <button
              onClick={reset}
              style={{
                flex: 1, padding: '9px', borderRadius: 8,
                border: '1px solid var(--border)', background: 'transparent',
                color: 'var(--text-muted)', cursor: 'pointer', fontSize: 13,
                fontFamily: 'var(--font)',
              }}
            >
              Clear
            </button>
          )}
          <button
            onClick={run}
            disabled={loading}
            style={{
              flex: 2, padding: '9px', borderRadius: 8,
              border: 'none', background: loading ? 'var(--border)' : 'var(--accent)',
              color: loading ? 'var(--text-muted)' : '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: 13, fontWeight: 600, fontFamily: 'var(--font)',
              transition: 'all 0.15s',
            }}
          >
            {loading ? 'Running...' : result ? 'Run Again' : 'Run Simulation'}
          </button>
        </div>
      </div>
    </div>
  );
}
