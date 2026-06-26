'use client';
import { useEffect, useState } from 'react';

// ---- Types ----
interface Agent { id: string; role: string; tier: string; status: string; class?: string; governed_by?: string; }
interface PhiState { phi: number; drift_delta: number; corridor_active: boolean; vertices: string[]; timestamp: string; }
interface HealthState { status: string; latency?: number; error?: string; }

const AOGA_BASE = 'https://aoga-dashboard.vercel.app';

// ---- Status badge ----
function Badge({ label, variant }: { label: string; variant: 'ok'|'warn'|'error'|'info'|'phi' }) {
  const colors: Record<string, string> = {
    ok:    'color:var(--color-success);background:color-mix(in oklab,var(--color-success) 12%,var(--color-surface))',
    warn:  'color:var(--color-warning);background:color-mix(in oklab,var(--color-warning) 12%,var(--color-surface))',
    error: 'color:var(--color-error);background:color-mix(in oklab,var(--color-error) 12%,var(--color-surface))',
    info:  'color:var(--color-text-muted);background:var(--color-surface-offset)',
    phi:   'color:var(--color-purple);background:color-mix(in oklab,var(--color-purple) 12%,var(--color-surface))',
  };
  return (
    <span style={{
      fontSize: 'var(--text-xs)', fontWeight: 600, padding: '2px 10px',
      borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap',
      ...(Object.fromEntries(colors[variant].split(';').map(s => {
        const [k,v]=s.split(':'); return [k.trim().replace(/-([a-z])/g,(_,c)=>c.toUpperCase()), v?.trim()];
      })) as React.CSSProperties)
    }}>{label}</span>
  );
}

// ---- Section card ----
function Card({ title, children, accent }: { title: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <section style={{
      background: 'var(--color-surface)',
      border: `1px solid ${accent ? 'var(--color-primary)' : 'var(--color-border)'}`,
      borderRadius: 'var(--radius-lg)',
      padding: 'var(--space-6)',
      boxShadow: 'var(--shadow-sm)',
    }}>
      <h2 style={{
        fontSize: 'var(--text-sm)', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '0.06em', color: 'var(--color-text-muted)',
        marginBottom: 'var(--space-4)',
      }}>{title}</h2>
      {children}
    </section>
  );
}

// ---- Phi Corridor Visualization ----
function PhiCorridor({ state }: { state: PhiState | null }) {
  const PHI = 1.6180339887;
  const drift = state?.drift_delta ?? 0;
  const active = state?.corridor_active ?? false;
  const vertices = state?.vertices ?? ['sentinel-phi', 'prof-prodigy', 'demijoul'];
  const radius = 80;
  const cx = 120, cy = 120;
  const points = vertices.map((_, i) => {
    const angle = (i / vertices.length) * 2 * Math.PI - Math.PI / 2;
    return { x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
  });
  const polygon = points.map(p => `${p.x},${p.y}`).join(' ');

  return (
    <div style={{ display: 'flex', gap: 'var(--space-8)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
      <svg width="240" height="240" viewBox="0 0 240 240" style={{ flexShrink: 0 }}>
        {/* Outer hexagon */}
        <polygon points="120,20 210,67 210,173 120,220 30,173 30,67"
          stroke="var(--color-border)" strokeWidth="1" fill="none" />
        {/* Corridor polygon */}
        <polygon points={polygon}
          stroke={active ? 'var(--color-primary)' : 'var(--color-error)'}
          strokeWidth="1.5" fill={active ? 'color-mix(in oklab,var(--color-primary) 8%,transparent)' : 'color-mix(in oklab,var(--color-error) 8%,transparent)'}
          style={{ transition: 'all 0.6s ease' }} />
        {/* Vertex nodes */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="8" fill="var(--color-surface-2)"
              stroke="var(--color-primary)" strokeWidth="1.5" />
            <text x={p.x} y={p.y + 4} textAnchor="middle" fontSize="7"
              fill="var(--color-text-muted)" fontFamily="monospace">
              {vertices[i].split('-')[0].slice(0,3).toUpperCase()}
            </text>
          </g>
        ))}
        {/* Centre phi symbol */}
        <text x={cx} y={cy+6} textAnchor="middle" fontSize="22" fontWeight="700"
          fill="var(--color-primary)" fontFamily="Georgia,serif" opacity="0.7">φ</text>
        {/* Drift indicator */}
        <text x={cx} y="228" textAnchor="middle" fontSize="9" fill="var(--color-text-faint)" fontFamily="monospace">
          drift {drift > 0 ? '+' : ''}{drift.toFixed(4)}
        </text>
      </svg>
      <div style={{ flex: 1, minWidth: '200px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Corridor</span>
            <Badge label={active ? 'ACTIVE' : 'INACTIVE'} variant={active ? 'ok' : 'error'} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Phi constant</span>
            <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-primary)' }}>{PHI}</code>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Drift delta</span>
            <code style={{ fontSize: 'var(--text-xs)', color: Math.abs(drift) > 0.01 ? 'var(--color-warning)' : 'var(--color-success)' }}>
              {drift > 0 ? '+' : ''}{drift.toFixed(6)}
            </code>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-muted)' }}>Vertices</span>
            <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{vertices.length} nodes</span>
          </div>
          {vertices.map(v => (
            <div key={v} style={{
              fontSize: 'var(--text-xs)', padding: 'var(--space-2) var(--space-3)',
              background: 'var(--color-surface-offset)', borderRadius: 'var(--radius-md)',
              display: 'flex', alignItems: 'center', gap: 'var(--space-2)', color: 'var(--color-text-muted)',
            }}>
              <span style={{ color: 'var(--color-purple)', fontSize: '10px' }}>&#x25C6;</span>
              <code>{v}</code>
            </div>
          ))}
          {state?.timestamp && (
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginTop: 'var(--space-2)' }}>
              Last sync: {new Date(state.timestamp).toLocaleTimeString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// ---- Main Dashboard ----
export default function Dashboard() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [phi, setPhi] = useState<PhiState | null>(null);
  const [orchestratorHealth, setOrchestratorHealth] = useState<HealthState>({ status: 'checking' });
  const [sentinelMode] = useState<'observe'|'repair'>('observe'); // read from env at build time ideally
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch(`${AOGA_BASE}/api/agents`)
        .then(r => r.json())
        .then(d => setAgents(d.agents || []))
        .catch(() => {}),
      fetch(`${AOGA_BASE}/api/phi/state`)
        .then(r => r.json())
        .then(d => setPhi(d))
        .catch(() => {}),
      (async () => {
        const start = Date.now();
        try {
          const r = await fetch(`${AOGA_BASE}/health`);
          const latency = Date.now() - start;
          setOrchestratorHealth({ status: r.ok ? 'ok' : 'degraded', latency });
        } catch {
          setOrchestratorHealth({ status: 'unreachable', error: 'Network error' });
        }
      })(),
    ]).finally(() => setLoading(false));
  }, []);

  const phiKnights = agents.filter(a => a.class === 'phi-knight' || ['sentinel-phi','prof-prodigy','demijoul'].includes(a.id));
  const coreAgents = agents.filter(a => !phiKnights.find(pk => pk.id === a.id));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-8)' }}>

      {/* Page title */}
      <div>
        <h1 style={{ fontSize: 'var(--text-xl)', fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 'var(--space-2)' }}>
          Sentinel Governance
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', maxWidth: '60ch' }}>
          Live status for the Sentinel operator, orchestrator, AOGA agent registry, and the φ-defense corridor.
        </p>
      </div>

      {/* Status row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-4)' }}>
        {[
          { label: 'Sentinel Mode', value: sentinelMode.toUpperCase(), variant: sentinelMode === 'repair' ? 'warn' : 'info' as const },
          { label: 'AOGA Version', value: 'v1.1.0', variant: 'ok' as const },
          { label: 'Orchestrator', value: orchestratorHealth.status.toUpperCase(), variant: orchestratorHealth.status === 'ok' ? 'ok' : 'error' as const },
          { label: 'Phi-Knights', value: `${phiKnights.length} active`, variant: 'phi' as const },
        ].map(item => (
          <div key={item.label} style={{
            background: 'var(--color-surface)', border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-5)',
            boxShadow: 'var(--shadow-sm)',
          }}>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{item.label}</p>
            <Badge label={item.value} variant={item.variant} />
          </div>
        ))}
      </div>

      {/* Phi Knight Corridor */}
      <Card title="φ Phi Knight Corridor" accent>
        {loading ? (
          <div style={{ color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}>Loading corridor state…</div>
        ) : (
          <PhiCorridor state={phi} />
        )}
      </Card>

      {/* Agent Registry */}
      <Card title="Agent Registry">
        <div style={{ overflowX: 'auto' }}>
          <table>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-divider)' }}>
                {['Agent', 'Role', 'Tier', 'Class', 'Status'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: 'var(--space-6)', color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}>Loading agents…</td></tr>
              ) : agents.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: 'var(--space-6)', color: 'var(--color-text-faint)', fontSize: 'var(--text-sm)' }}>No agents returned from registry.</td></tr>
              ) : (
                [...phiKnights, ...coreAgents].map(agent => {
                  const isPK = phiKnights.some(pk => pk.id === agent.id);
                  return (
                    <tr key={agent.id} style={{
                      borderBottom: '1px solid var(--color-divider)',
                      background: isPK ? 'color-mix(in oklab,var(--color-purple) 5%,transparent)' : 'transparent',
                    }}>
                      <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                        <code style={{ fontSize: 'var(--text-xs)', color: isPK ? 'var(--color-purple)' : 'var(--color-primary)' }}>{agent.id}</code>
                      </td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{agent.role}</td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                        <Badge label={agent.tier} variant="info" />
                      </td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                        {isPK ? <Badge label="φ Phi-Knight" variant="phi" /> : <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>—</span>}
                      </td>
                      <td style={{ padding: 'var(--space-2) var(--space-3)' }}>
                        <Badge label={agent.status || 'active'} variant={agent.status === 'active' ? 'ok' : 'warn'} />
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Sentinel Architecture */}
      <Card title="Sentinel Architecture">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'var(--space-4)' }}>
          {[
            { name: 'Sentinel Operator', lang: 'Node.js / Express', desc: 'Webhook server. Listens for workflow_run events. Verifies HMAC-SHA256 signatures. Observe or Repair mode.', host: 'Railway / Fly.io (not Vercel)', color: 'var(--color-primary)' },
            { name: 'Orchestrator Stub', lang: 'Python / FastAPI', desc: 'Receives patch requests from the operator. Returns patched workflow YAML. Stub — insert LLM policy engine at /sentinel/repair.', host: 'Separate persistent host', color: 'var(--color-warning)' },
            { name: 'Phi Knight Dashboard', lang: 'Next.js 14', desc: 'This dashboard. Surfaces governance state, agent registry, corridor visualization. Deployed to Vercel.', host: 'Vercel — phiknightverticalcorridor', color: 'var(--color-purple)' },
          ].map(s => (
            <div key={s.name} style={{
              background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)', border: '1px solid var(--color-border)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: s.color, flexShrink: 0 }} />
                <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)' }}>{s.name}</span>
              </div>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginBottom: 'var(--space-2)' }}>{s.desc}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                <code style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)' }}>{s.lang}</code>
                <code style={{ fontSize: 'var(--text-xs)', color: s.color, opacity: 0.8 }}>{s.host}</code>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* DGAF Config */}
      <Card title="DGAF Governance Config">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'var(--space-3)' }}>
          {[
            { key: 'Framework', value: 'DGAF-Framework' },
            { key: 'Formalism', value: 'Hensel Formalism v1.0' },
            { key: 'Lattice', value: 'Amethyst-Lattice-v3.1' },
            { key: 'Attestation', value: 'P-30 (Apogee Gate)' },
            { key: 'Sweep Pattern', value: 'P-33 (SWEEP_LOG)' },
            { key: 'Flywheel', value: 'P-34 (Entrepreneur Hub)' },
          ].map(item => (
            <div key={item.key} style={{
              padding: 'var(--space-3)', background: 'var(--color-surface-offset)',
              borderRadius: 'var(--radius-md)',
            }}>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', marginBottom: 'var(--space-1)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{item.key}</p>
              <p style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{item.value}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Footer */}
      <footer style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-faint)', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-divider)', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
        <span>Phi Knight Dashboard · sentinel-governance</span>
        <span>Orchestrator: Amethyst · Memory: COLLEEN · Gate: Phi-Knight</span>
      </footer>
    </div>
  );
}
