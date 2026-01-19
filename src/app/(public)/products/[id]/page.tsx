import { notFound } from 'next/navigation'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatPrice } from '@/lib/utils'
import Button from '@/components/ui/Button'
import ProductCard from '@/components/public/ProductCard'

export const dynamic = 'force-dynamic'

interface ProductPageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params

  const product = await prisma.product.findFirst({
    where: {
      OR: [{ id }, { slug: id }],
      isActive: true,
    },
    include: { category: true },
  })

  if (!product) {
    notFound()
  }

  const relatedProducts = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      categoryId: product.categoryId,
    },
    include: { category: true },
    take: 4,
  })

  const specifications = product.specifications as Record<string, string> | null

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700">
                Products
              </Link>
            </li>
            {product.category && (
              <>
                <li className="text-gray-400">/</li>
                <li>
                  <Link
                    href={`/products?category=${product.category.slug}`}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    {product.category.name}
                  </Link>
                </li>
              </>
            )}
            <li className="text-gray-400">/</li>
            <li className="text-gray-900 font-medium">{product.name}</li>
          </ol>
        </nav>

        {/* Product Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Images */}
          <div>
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <svg className="w-24 h-24 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="mt-4 grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img src={image} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <Link
                href={`/products?category=${product.category.slug}`}
                className="text-sm text-primary-600 hover:underline"
              >
                {product.category.name}
              </Link>
            )}
            <h1 className="mt-2 text-3xl font-bold text-gray-900">{product.name}</h1>

            <p className="mt-4 text-3xl font-bold text-primary-600">
              {formatPrice(product.price?.toString())}
            </p>

            <div className="mt-6 prose prose-sm text-gray-600">
              <p>{product.description}</p>
            </div>

            {/* Specifications */}
            {specifications && Object.keys(specifications).length > 0 && (
              <div className="mt-8">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Specifications</h2>
                <dl className="border rounded-lg divide-y">
                  {Object.entries(specifications).map(([key, value]) => (
                    <div key={key} className="px-4 py-3 flex justify-between">
                      <dt className="text-gray-600">{key}</dt>
                      <dd className="text-gray-900 font-medium">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            {/* CTA */}
            <div className="mt-8 p-6 bg-gray-50 rounded-lg">
              <p className="text-gray-700 mb-4">
                Interested in this product? Contact us for more information or to place an order.
              </p>
              <Link href="/contact">
                <Button size="lg" className="w-full">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct.id}
                  product={{
                    ...relatedProduct,
                    price: relatedProduct.price?.toString(),
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
