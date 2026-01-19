import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import ProductCard from '@/components/public/ProductCard'
import Button from '@/components/ui/Button'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featuredProducts, categories, settings, testimonials] = await Promise.all([
    prisma.product.findMany({
      where: { featured: true, isActive: true },
      include: { category: true },
      take: 4,
    }),
    prisma.category.findMany({
      orderBy: { order: 'asc' },
      take: 6,
    }),
    prisma.setting.findMany(),
    prisma.testimonial.findMany({
      where: { isActive: true, featured: true },
      orderBy: { reviewDate: 'desc' },
      take: 3,
    }),
  ])

  const settingsMap: Record<string, Record<string, string>> = {}
  settings.forEach((s) => {
    settingsMap[s.key] = s.value as Record<string, string>
  })

  const company = settingsMap.company || {
    name: 'MasterElectronics',
    tagline: 'Your Trusted Partner for Power Solutions',
    description: '',
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              {company.tagline || 'Your Trusted Partner for Power Solutions'}
            </h1>
            <p className="mt-6 text-lg md:text-xl text-primary-100 max-w-2xl mx-auto">
              Quality UPS systems, batteries, solar equipment, and more to keep your business running smoothly.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" className="!bg-white !text-primary-600 hover:!bg-gray-100">
                  Browse Products
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="!bg-transparent !border-white !text-white hover:!bg-white/10">
                  Contact Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Product Categories</h2>
            <p className="mt-4 text-gray-600">Explore our wide range of power solutions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow border border-gray-200"
              >
                <div className="w-12 h-12 mx-auto mb-4 bg-primary-100 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-primary-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                </div>
                <h3 className="font-medium text-gray-900">{category.name}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                <p className="mt-2 text-gray-600">Check out our most popular items</p>
              </div>
              <Link href="/products">
                <Button variant="outline">View All Products</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={{
                    ...product,
                    price: product.price?.toString(),
                  }}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Services Preview */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Our Services</h2>
            <p className="mt-4 text-gray-400">Professional solutions for all your power needs</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Installation</h3>
              <p className="text-gray-400">Professional installation services for all our products</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Maintenance</h3>
              <p className="text-gray-400">Regular maintenance to keep your systems running efficiently</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary-600 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Consultation</h3>
              <p className="text-gray-400">Expert advice to help you choose the right solutions</p>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link href="/services">
              <Button variant="outline" className="!bg-transparent !border-white !text-white hover:!bg-white/10">
                Learn More About Our Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900">What Our Customers Say</h2>
              <p className="mt-4 text-gray-600">Trusted by businesses across the region</p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <svg className="w-6 h-6 text-yellow-400" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
                <span className="text-lg font-semibold text-gray-700">Google Reviews</span>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-5 h-5 ${star <= testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-gray-600 mb-4 italic">&ldquo;{testimonial.reviewText}&rdquo;</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gray-900">{testimonial.customerName}</p>
                      <p className="text-sm text-gray-500">
                        {new Date(testimonial.reviewDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-400">
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                      </svg>
                      {testimonial.source}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="bg-primary-50 rounded-2xl p-8 md:p-12 text-center">
            <h2 className="text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
              Contact us today for a free consultation and discover how we can help power your success.
            </p>
            <div className="mt-8">
              <Link href="/contact">
                <Button size="lg">Contact Us Today</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
