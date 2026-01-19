import Link from 'next/link'

const navigation = {
  main: [
    { name: 'Products', href: '/products' },
    { name: 'Services', href: '/services' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ],
  categories: [
    { name: 'UPS Systems', href: '/products?category=ups-systems' },
    { name: 'Batteries', href: '/products?category=batteries' },
    { name: 'Solar Equipment', href: '/products?category=solar-equipment' },
    { name: 'Inverters', href: '/products?category=inverters' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-gray-900" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-bold text-primary-400">Master</span>
              <span className="text-2xl font-bold text-white">Electronics</span>
            </Link>
            <p className="mt-4 text-gray-400 text-sm max-w-md">
              Your trusted partner for power solutions. We provide quality UPS systems, batteries,
              solar equipment, and more to keep your business running.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-sm font-semibold text-white tracking-wider uppercase">Categories</h3>
            <ul className="mt-4 space-y-3">
              {navigation.categories.map((item) => (
                <li key={item.name}>
                  <Link href={item.href} className="text-gray-400 hover:text-white text-sm transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} MasterElectronics. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
