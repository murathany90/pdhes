import type { ReactNode } from 'react';

interface AppShellProps {
  topNav: ReactNode;
  tabs?: ReactNode;
  children: ReactNode;
}

export default function AppShell({ topNav, tabs, children }: AppShellProps) {
  return (
    <div className="app">
      {topNav}
      {tabs}
      <main>
        {children}
      </main>
    </div>
  );
}
