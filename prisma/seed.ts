import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database...')

  // Create admin user
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const passwordHash = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.admin.upsert({
    where: { username: process.env.ADMIN_USERNAME || 'admin' },
    update: {},
    create: {
      username: process.env.ADMIN_USERNAME || 'admin',
      passwordHash,
    },
  })
  console.log('Created admin user:', admin.username)

  // Create default categories
  const categories = [
    { name: 'UPS Systems', slug: 'ups-systems', description: 'Uninterruptible Power Supply systems for reliable power backup', order: 1 },
    { name: 'Batteries', slug: 'batteries', description: 'High-quality batteries for various applications', order: 2 },
    { name: 'Solar Equipment', slug: 'solar-equipment', description: 'Solar panels, controllers, and accessories', order: 3 },
    { name: 'Inverters', slug: 'inverters', description: 'Power inverters for AC/DC conversion', order: 4 },
    { name: 'Voltage Stabilizers', slug: 'voltage-stabilizers', description: 'Automatic voltage regulators and stabilizers', order: 5 },
    { name: 'Accessories', slug: 'accessories', description: 'Cables, connectors, and other accessories', order: 6 },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }
  console.log('Created default categories')

  // Create default settings
  const defaultSettings = [
    {
      key: 'contact',
      value: {
        phone: '+1 (555) 123-4567',
        email: 'info@masterelectronics.com',
        address: '123 Electronics Way, Tech City, TC 12345',
        businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM\nSaturday: 10:00 AM - 4:00 PM\nSunday: Closed',
      },
    },
    {
      key: 'company',
      value: {
        name: 'MasterElectronics',
        tagline: 'Your Trusted Partner for Power Solutions',
        description: 'MasterElectronics has been providing quality power solutions since 2005. We specialize in UPS systems, batteries, solar equipment, and more.',
        mission: 'To provide reliable, efficient, and affordable power solutions to businesses and homes.',
      },
    },
    {
      key: 'social',
      value: {
        facebook: '',
        twitter: '',
        linkedin: '',
        instagram: '',
      },
    },
  ]

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: {},
      create: setting,
    })
  }
  console.log('Created default settings')

  // Create sample products
  const upsCategory = await prisma.category.findUnique({ where: { slug: 'ups-systems' } })
  const batteryCategory = await prisma.category.findUnique({ where: { slug: 'batteries' } })
  const solarCategory = await prisma.category.findUnique({ where: { slug: 'solar-equipment' } })

  const sampleProducts = [
    {
      name: 'PowerGuard 1500VA UPS',
      slug: 'powerguard-1500va-ups',
      description: 'The PowerGuard 1500VA UPS provides reliable power protection for your home office or small business. Features pure sine wave output, automatic voltage regulation, and multiple outlets for comprehensive protection.',
      shortDescription: 'Reliable 1500VA UPS with pure sine wave output',
      price: 299.99,
      categoryId: upsCategory?.id,
      images: [],
      specifications: {
        'Capacity': '1500VA / 900W',
        'Input Voltage': '120V AC',
        'Output Voltage': '120V AC',
        'Battery Type': 'Sealed Lead Acid',
        'Backup Time': '10-15 minutes at full load',
        'Outlets': '6 battery backup + 4 surge only',
      },
      featured: true,
      isActive: true,
    },
    {
      name: 'PowerGuard 3000VA UPS',
      slug: 'powerguard-3000va-ups',
      description: 'Enterprise-grade UPS system with 3000VA capacity. Perfect for servers, networking equipment, and critical systems. Features online double-conversion technology for maximum protection.',
      shortDescription: 'Enterprise 3000VA online UPS',
      price: 799.99,
      categoryId: upsCategory?.id,
      images: [],
      specifications: {
        'Capacity': '3000VA / 2700W',
        'Input Voltage': '208/230V AC',
        'Output Voltage': '208/230V AC',
        'Battery Type': 'Sealed Lead Acid',
        'Backup Time': '8-12 minutes at full load',
        'Form Factor': 'Rack/Tower Convertible',
      },
      featured: true,
      isActive: true,
    },
    {
      name: 'DeepCycle 100Ah Battery',
      slug: 'deepcycle-100ah-battery',
      description: 'High-capacity deep cycle battery ideal for solar systems, RVs, and marine applications. Maintenance-free AGM technology ensures long life and reliable performance.',
      shortDescription: '100Ah AGM deep cycle battery',
      price: 249.99,
      categoryId: batteryCategory?.id,
      images: [],
      specifications: {
        'Capacity': '100Ah',
        'Voltage': '12V',
        'Type': 'AGM (Absorbed Glass Mat)',
        'Cycle Life': '500+ cycles at 50% DOD',
        'Weight': '66 lbs',
        'Dimensions': '13" x 6.8" x 8.7"',
      },
      featured: false,
      isActive: true,
    },
    {
      name: 'SolarMax 300W Panel',
      slug: 'solarmax-300w-panel',
      description: 'High-efficiency monocrystalline solar panel with 300W output. Perfect for residential and commercial solar installations. Includes 25-year power warranty.',
      shortDescription: '300W monocrystalline solar panel',
      price: 349.99,
      categoryId: solarCategory?.id,
      images: [],
      specifications: {
        'Power Output': '300W',
        'Cell Type': 'Monocrystalline',
        'Efficiency': '20.5%',
        'Dimensions': '65" x 39" x 1.4"',
        'Weight': '40 lbs',
        'Warranty': '25 years',
      },
      featured: true,
      isActive: true,
    },
  ]

  for (const product of sampleProducts) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }
  console.log('Created sample products')

  // Create sample testimonials
  const sampleTestimonials = [
    {
      customerName: 'Ahmed Hassan',
      rating: 5,
      reviewText: 'Excellent service and quality products! The UPS system I purchased has been running flawlessly for over a year. Their technical support team was incredibly helpful during installation.',
      source: 'Google',
      reviewDate: new Date('2024-11-15'),
      featured: true,
      isActive: true,
    },
    {
      customerName: 'Sarah Khan',
      rating: 5,
      reviewText: 'MasterElectronics provided us with a complete solar solution for our office. The team was professional, the installation was quick, and we have seen significant savings on our electricity bills.',
      source: 'Google',
      reviewDate: new Date('2024-10-28'),
      featured: true,
      isActive: true,
    },
    {
      customerName: 'Muhammad Ali',
      rating: 5,
      reviewText: 'Best place for power backup solutions in the city. They have a wide range of products and the staff is very knowledgeable. Highly recommended!',
      source: 'Google',
      reviewDate: new Date('2024-09-12'),
      featured: true,
      isActive: true,
    },
    {
      customerName: 'Fatima Zahra',
      rating: 4,
      reviewText: 'Good quality batteries at reasonable prices. The delivery was prompt and the product exactly as described. Will definitely buy again.',
      source: 'Google',
      reviewDate: new Date('2024-08-20'),
      featured: false,
      isActive: true,
    },
  ]

  for (const testimonial of sampleTestimonials) {
    const existing = await prisma.testimonial.findFirst({
      where: { customerName: testimonial.customerName },
    })
    if (!existing) {
      await prisma.testimonial.create({ data: testimonial })
    }
  }
  console.log('Created sample testimonials')

  console.log('Seeding completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
