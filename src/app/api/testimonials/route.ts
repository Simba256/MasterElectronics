import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const featured = searchParams.get('featured')
    const active = searchParams.get('active')

    const where: {
      featured?: boolean
      isActive?: boolean
    } = {}

    if (featured === 'true') {
      where.featured = true
    }
    if (active !== 'false') {
      where.isActive = true
    }

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: [
        { featured: 'desc' },
        { reviewDate: 'desc' },
      ],
    })

    return NextResponse.json(testimonials)
  } catch (error) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testimonials' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { customerName, rating, reviewText, source, reviewDate, featured, isActive } = body

    if (!customerName || !reviewText) {
      return NextResponse.json(
        { error: 'Customer name and review text are required' },
        { status: 400 }
      )
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        customerName,
        rating: rating || 5,
        reviewText,
        source: source || 'Google',
        reviewDate: reviewDate ? new Date(reviewDate) : new Date(),
        featured: featured || false,
        isActive: isActive ?? true,
      },
    })

    return NextResponse.json(testimonial, { status: 201 })
  } catch (error) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      { error: 'Failed to create testimonial' },
      { status: 500 }
    )
  }
}
