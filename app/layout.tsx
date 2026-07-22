import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Colossus App',
  description: 'Scaffolded by Colossus (template-nextjs-fullstack)',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Keep data-testid="app-ready" on the shell root — the mockup/render gate waits for it.
  return (
    <html lang="en">
      <body>
        <div data-testid="app-ready">{children}</div>
      </body>
    </html>
  );
}
