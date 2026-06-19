import React, { useState, useEffect } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  rating: number;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    // TODO: Fetch products from API
    setLoading(false);
  }, [category, search]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar - Filters */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Filters</h3>

              {/* Search */}
              <div className="mb-6">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="font-semibold mb-3">Category</h4>
                <ul className="space-y-2">
                  {['All', 'Electronics', 'Fashion', 'Home', 'Sports'].map((cat) => (
                    <li key={cat}>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="category"
                          value={cat.toLowerCase()}
                          checked={category === cat.toLowerCase()}
                          onChange={(e) => setCategory(e.target.value)}
                          className="text-indigo-600"
                        />
                        <span className="ml-2 text-gray-700">{cat}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="font-semibold mb-3">Price Range</h4>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Link key={product.id} href={`/products/${product.id}`}>
                    <div className="bg-white rounded-lg shadow hover:shadow-lg transition cursor-pointer">
                      <div className="h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                        <span className="text-gray-400">Product Image</span>
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-lg text-gray-900 truncate">
                          {product.name}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">{product.category}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-2xl font-bold text-indigo-600">
                            ${product.price}
                          </span>
                          <span className="text-yellow-500">★ {product.rating}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
