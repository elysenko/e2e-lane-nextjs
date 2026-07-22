import type { Metadata, Viewport } from 'next';
import React from 'react';
import './globals.css';
import { TopNav, TabBar } from './components/nav';

export const metadata: Metadata = {
  title: 'Recipe Box',
  description: 'Browse and add your favourite recipes.',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Keep data-testid="app-ready" on the shell root — the mockup/render gate waits for it.
  return (
    <html lang="en">
      <body>
        <div data-testid="app-ready" className="app-shell">
          <TopNav />
          <main className="main">{children}</main>
          <TabBar />
        </div>
      </body>
    </html>
  );
}
