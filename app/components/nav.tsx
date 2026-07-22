'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/recipes', label: 'Recipes' },
  { href: '/about', label: 'About' },
];

const TAB_ITEMS = [
  { href: '/recipes', label: 'Recipes', icon: '📖', fab: false },
  { href: '/recipes/new', label: 'Add', icon: '＋', fab: true },
  { href: '/about', label: 'About', icon: 'ℹ️', fab: false },
];

function isActive(pathname: string, href: string): boolean {
  if (href === '/recipes') {
    return pathname === '/recipes';
  }
  return pathname === href || pathname.startsWith(href + '/');
}

/** Desktop top navigation bar. */
export function TopNav() {
  const pathname = usePathname() || '/';
  return (
    <header className="topbar">
      <Link href="/recipes" className="brand" data-testid="brand-link">
        <span className="brand-mark" aria-hidden="true">
          🍲
        </span>
        Recipe Box
      </Link>
      <nav className="nav-links" aria-label="Primary">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link${isActive(pathname, item.href) ? ' active' : ''}`}
            data-testid={`nav-${item.label.toLowerCase()}`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}

/** Mobile bottom tab bar (shown at <= 768px via CSS). */
export function TabBar() {
  const pathname = usePathname() || '/';
  return (
    <nav className="tabbar" aria-label="Primary mobile">
      {TAB_ITEMS.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`tab${item.fab ? ' tab-fab' : ''}${
            isActive(pathname, item.href) ? ' active' : ''
          }`}
          data-testid={`tab-${item.label.toLowerCase()}`}
        >
          <span className="tab-icon" aria-hidden="true">
            {item.icon}
          </span>
          <span>{item.label}</span>
        </Link>
      ))}
    </nav>
  );
}
