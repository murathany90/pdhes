import type { ReactNode } from 'react';

interface AppShellProps {
  topNav: ReactNode;
  tabs?: ReactNode;
  children: ReactNode;
}

export default function AppShell({ topNav, tabs, children }: AppShellProps) {
  return (
    <div className="app">
      <a className="skip-link" href="#main-content">
        Ana içeriğe geç
      </a>
      {topNav}
      {tabs}
      <main id="main-content" tabIndex={-1}>
        {children}
      </main>
    </div>
  );
}
