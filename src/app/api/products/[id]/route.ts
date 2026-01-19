import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'
import { slugify } from '@/lib/utils'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Try to find by ID first, then by slug
    let product = await prisma.product.findUnique({
      where: { id },
      include: { category: true },
    })

    if (!product) {
      product = await prisma.product.findUnique({
        where: { slug: id },
        include: { category: true },
      })
    }

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error fetching product:', error)
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { name, description, shortDescription, price, categoryId, images, specifications, featured, isActive } = body

    const existingProduct = await prisma.product.findUnique({ where: { id } })
    if (!existingProduct) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      )
    }

    let slug = existingProduct.slug
    if (name && name !== existingProduct.name) {
      slug = slugify(name)
      const slugExists = await prisma.product.findFirst({
        where: { slug, id: { not: id } },
      })
      if (slugExists) {
        slug = `${slug}-${Date.now()}`
      }
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name: name || existingProduct.name,
        slug,
        description: description ?? existingProduct.description,
        shortDescription: shortDescription ?? existingProduct.shortDescription,
        price: price !== undefined ? (price ? parseFloat(price) : null) : existingProduct.price,
        categoryId: categoryId !== undefined ? (categoryId || null) : existingProduct.categoryId,
        images: images ?? existingProduct.images,
        specifications: specifications ?? existingProduct.specifications,
        featured: featured ?? existingProduct.featured,
        isActive: isActive ?? existingProduct.isActive,
      },
      include: {
        category: true,
      },
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id } = await params

    await prisma.product.delete({ where: { id } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    )
  }
}
