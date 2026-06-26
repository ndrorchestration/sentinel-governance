import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Phi Knight — Sentinel Governance Dashboard',
  description: 'AOGA governance dashboard. Sentinel operator status, orchestrator health, agent registry, DGAF config, and Phi Knight corridor visualization.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700&display=swap"
          rel="stylesheet"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var d=document.documentElement;var m=localStorage.getItem('theme')||((window.matchMedia('(prefers-color-scheme:dark)').matches)?'dark':'light');d.setAttribute('data-theme',m);})();`,
          }}
        />
      </head>
      <body>
        <header style={{
          position: 'sticky', top: 0, zIndex: 100,
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: 'var(--space-3) var(--space-6)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: 'var(--shadow-sm)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            {/* Phi Knight SVG Logo */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-label="Phi Knight" style={{ color: 'var(--color-primary)' }}>
              <polygon points="14,2 26,8 26,20 14,26 2,20 2,8" stroke="currentColor" strokeWidth="1.5" fill="none"/>
              <text x="14" y="19" textAnchor="middle" fontSize="13" fontWeight="700"
                fill="currentColor" fontFamily="Georgia,serif">φ</text>
            </svg>
            <span style={{ fontWeight: 700, fontSize: 'var(--text-sm)', letterSpacing: '-0.01em' }}>
              Phi Knight
            </span>
            <span style={{
              fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)',
              background: 'var(--color-surface-offset)',
              padding: '2px 8px', borderRadius: 'var(--radius-full)',
            }}>sentinel-governance</span>
          </div>
          <button
            data-theme-toggle
            aria-label="Toggle dark mode"
            onClick={() => {
              // handled client-side
            }}
            style={{ padding: 'var(--space-2)', borderRadius: 'var(--radius-md)', color: 'var(--color-text-muted)' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
            </svg>
          </button>
        </header>
        <main style={{ maxWidth: '1200px', margin: '0 auto', padding: 'var(--space-8) var(--space-6)' }}>
          {children}
        </main>
        <script dangerouslySetInnerHTML={{ __html: `
          (function(){
            var t=document.querySelector('[data-theme-toggle]');
            var r=document.documentElement;
            if(!t) return;
            t.addEventListener('click',function(){
              var cur=r.getAttribute('data-theme')||'light';
              var next=cur==='dark'?'light':'dark';
              r.setAttribute('data-theme',next);
              try{localStorage.setItem('theme',next);}catch(e){}
            });
          })();
        `}} />
      </body>
    </html>
  );
}
