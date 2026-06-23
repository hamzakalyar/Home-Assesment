'use client';

import { useCallback, useEffect, useState } from 'react';
import { productsApi } from '@/api-client/products';
import type { Product } from '@/api-client/types';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { formatCurrency } from '@/lib/format';
import { AdjustStockModal } from './components/AdjustStockModal';
import { EditProductModal } from './components/EditProductModal';
import { ProductForm } from './components/ProductForm';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [editing, setEditing] = useState<Product | null>(null);
  const [adjustingStock, setAdjustingStock] = useState<Product | null>(null);
  // Bumping this key remounts (and so clears) the create form after a successful add.
  const [createFormKey, setCreateFormKey] = useState(0);

  const loadProducts = useCallback(async () => {
    setProducts(await productsApi.list(search));
  }, [search]);

  useEffect(() => {
    void loadProducts();
  }, [loadProducts]);

  function handleSearch(event: React.FormEvent) {
    event.preventDefault();
    setSearch(searchInput.trim());
  }

  function clearSearch() {
    setSearchInput('');
    setSearch('');
  }

  async function handleDelete(product: Product) {
    if (!window.confirm(`Delete "${product.name}"?`)) {
      return;
    }
    await productsApi.remove(product.id);
    await loadProducts();
  }

  return (
    <div className="flex flex-col gap-8">
      <section className="flex flex-col gap-4">
        <h1 className="text-2xl font-semibold text-slate-900">Products</h1>

        <div className="rounded-lg border border-slate-200 bg-white p-4">
          <h2 className="mb-3 text-lg font-semibold text-slate-900">Add a product</h2>
          <ProductForm
            key={createFormKey}
            submitLabel="Add product"
            onSubmit={(input) => productsApi.create(input)}
            onSuccess={() => {
              setCreateFormKey((key) => key + 1);
              void loadProducts();
            }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-semibold text-slate-900">Catalog</h2>
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <Input
              aria-label="Search products"
              placeholder="Search by name…"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              className="w-56"
            />
            <Button type="submit" variant="secondary">
              Search
            </Button>
            {search ? (
              <Button type="button" variant="secondary" onClick={clearSearch}>
                Clear
              </Button>
            ) : null}
          </form>
        </div>

        <ul className="divide-y divide-slate-200 rounded-lg border border-slate-200 bg-white">
          {products.map((product) => (
            <li key={product.id} className="flex items-center justify-between px-4 py-3">
              <div className="flex flex-col">
                <span className="font-medium text-slate-900">{product.name}</span>
                <span className="text-sm text-slate-600">
                  {formatCurrency(product.price)} · {product.stock} in stock
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setEditing(product)}>
                  Edit
                </Button>
                <Button variant="secondary" onClick={() => setAdjustingStock(product)}>
                  Adjust Stock
                </Button>
                <Button variant="danger" onClick={() => handleDelete(product)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
          {products.length === 0 ? (
            <li className="px-4 py-3 text-sm text-slate-500">No products found.</li>
          ) : null}
        </ul>
      </section>

      <EditProductModal
        product={editing}
        onClose={() => setEditing(null)}
        onSaved={() => void loadProducts()}
      />

      <AdjustStockModal product={adjustingStock} onClose={() => setAdjustingStock(null)} />
    </div>
  );
}
