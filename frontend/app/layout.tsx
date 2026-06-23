import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'DiscreteLogix Assessment',
  description: 'Customer and product catalog',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="border-b border-slate-200 bg-white">
          <nav className="mx-auto flex max-w-4xl items-center gap-6 px-6 py-4">
            <Link href="/" className="font-semibold text-slate-900">
              DiscreteLogix
            </Link>
            <Link href="/customers" className="text-sm text-slate-600 hover:text-slate-900">
              Customers
            </Link>
            <Link href="/products" className="text-sm text-slate-600 hover:text-slate-900">
              Products
            </Link>
          </nav>
        </header>
        <main className="mx-auto max-w-4xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
