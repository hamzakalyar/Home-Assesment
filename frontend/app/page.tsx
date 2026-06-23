import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold text-slate-900">Catalog</h1>
      <p className="text-slate-600">
        A small customer and product catalog. Use the links below to manage records.
      </p>
      <div className="flex gap-4">
        <Link
          href="/customers"
          className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          Manage customers →
        </Link>
        <Link
          href="/products"
          className="rounded-md border border-slate-300 bg-white px-4 py-3 text-sm font-medium text-slate-900 hover:bg-slate-50"
        >
          Manage products →
        </Link>
      </div>
    </div>
  );
}
