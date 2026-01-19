import Link from 'next/link'
import { formatPrice, truncate } from '@/lib/utils'

interface ProductCardProps {
  product: {
    id: string
    name: string
    slug: string
    shortDescription?: string | null
    description: string
    price?: string | number | null
    images: string[]
    featured?: boolean
    category?: {
      name: string
      slug: string
    } | null
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.slug}`} className="group">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.images[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-16 h-16 text-gray-300" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
          )}
          {product.featured && (
            <span className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-medium px-2 py-1 rounded">
              Featured
            </span>
          )}
        </div>
        <div className="p-4">
          {product.category && (
            <p className="text-xs text-primary-600 font-medium mb-1">{product.category.name}</p>
          )}
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
            {product.name}
          </h3>
          <p className="mt-1 text-sm text-gray-600 line-clamp-2">
            {product.shortDescription || truncate(product.description, 100)}
          </p>
          <p className="mt-3 text-lg font-bold text-primary-600">
            {formatPrice(product.price)}
          </p>
        </div>
      </div>
    </Link>
  )
}
