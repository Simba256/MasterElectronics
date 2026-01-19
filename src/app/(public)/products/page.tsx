import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/public/ProductCard'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export const dynamic = 'force-dynamic'

interface ProductsPageProps {
  searchParams: Promise<{ category?: string; search?: string }>
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const params = await searchParams
  const { category, search } = params

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        isActive: true,
        ...(category && { category: { slug: category } }),
        ...(search && {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        }),
      },
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
      include: {
        _count: {
          select: { products: { where: { isActive: true } } },
        },
      },
    }),
  ])

  const selectedCategory = categories.find((c) => c.slug === category)

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {selectedCategory ? selectedCategory.name : 'All Products'}
          </h1>
          {selectedCategory?.description && (
            <p className="mt-2 text-gray-600">{selectedCategory.description}</p>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg border border-gray-200 p-4 sticky top-24">
              <h2 className="font-semibold text-gray-900 mb-4">Categories</h2>
              <nav className="space-y-1">
                <Link
                  href="/products"
                  className={cn(
                    'block px-3 py-2 rounded-lg text-sm transition-colors',
                    !category
                      ? 'bg-primary-50 text-primary-700 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  )}
                >
                  All Products
                </Link>
                {categories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/products?category=${cat.slug}`}
                    className={cn(
                      'flex justify-between items-center px-3 py-2 rounded-lg text-sm transition-colors',
                      category === cat.slug
                        ? 'bg-primary-50 text-primary-700 font-medium'
                        : 'text-gray-700 hover:bg-gray-50'
                    )}
                  >
                    <span>{cat.name}</span>
                    <span className="text-gray-400 text-xs">{cat._count.products}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Search Results Info */}
            {search && (
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-600">
                  {products.length} result{products.length !== 1 ? 's' : ''} for "{search}"
                </p>
              </div>
            )}

            {products.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
                </svg>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No products found</h3>
                <p className="mt-2 text-gray-600">
                  {search
                    ? `No products match your search "${search}"`
                    : 'No products available in this category yet.'}
                </p>
                <Link href="/products" className="mt-4 inline-block text-primary-600 hover:underline">
                  View all products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      price: product.price?.toString(),
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
