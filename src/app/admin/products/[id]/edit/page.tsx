import { redirect, notFound } from 'next/navigation'
import { isAuthenticated } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/Card'
import ProductForm from '@/components/admin/ProductForm'

export const dynamic = 'force-dynamic'

interface EditProductPageProps {
  params: Promise<{ id: string }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    redirect('/admin/login')
  }

  const { id } = await params

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { order: 'asc' } }),
  ])

  if (!product) {
    notFound()
  }

  const productData = {
    id: product.id,
    name: product.name,
    description: product.description,
    shortDescription: product.shortDescription || '',
    price: product.price?.toString() || '',
    categoryId: product.categoryId || '',
    images: product.images,
    specifications: product.specifications as Record<string, string> || {},
    featured: product.featured,
    isActive: product.isActive,
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
        <p className="text-gray-600 mt-1">Update product information</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <ProductForm product={productData} categories={categories} />
        </CardContent>
      </Card>
    </div>
  )
}
