import * as React from "react"
import { Link, useLocation } from "wouter"
import { Menu, X, ArrowRight, Disc3 } from "lucide-react"
import { Button } from "./ui/button"

export function Layout({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const [location] = useLocation()

  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location])

  return (
    <div className="min-h-screen flex flex-col selection:bg-primary/30">
      {/* Sticky Nav */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center group-hover:scale-105 transition-transform">
              <Disc3 className="w-5 h-5 text-black" />
            </div>
            <span className="font-serif font-bold text-xl tracking-tight text-white">TosConnect</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Home
            </Link>
            <div className="relative group">
              <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors cursor-pointer py-2">
                Services
              </span>
              <div className="absolute top-full mt-2 w-48 bg-card border border-white/10 rounded-md shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all -translate-y-2 group-hover:translate-y-0">
                <div className="p-2 flex flex-col gap-1">
                  <Link href="/services/mixing-mastering" className="px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-sm transition-colors">
                    Mixing & Mastering
                  </Link>
                  <Link href="/services/consultation" className="px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded-sm transition-colors">
                    1-on-1 Consultation
                  </Link>
                </div>
              </div>
            </div>
            <Link href="/track-order" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Track Order
            </Link>
            <Link href="/services/mixing-mastering" className="ml-4">
              <Button className="font-serif tracking-wide gap-2 group">
                Book a Service
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-white/70 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 top-20 z-40 bg-background/95 backdrop-blur-lg border-b border-white/5 md:hidden">
          <nav className="flex flex-col p-6 gap-6">
            <Link href="/" className="text-lg font-medium text-white/80 hover:text-white">Home</Link>
            <div className="h-px w-full bg-white/5" />
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Services</span>
            <Link href="/services/mixing-mastering" className="text-lg pl-4 text-white/80 hover:text-white">Mixing & Mastering</Link>
            <Link href="/services/consultation" className="text-lg pl-4 text-white/80 hover:text-white">1-on-1 Consultation</Link>
            <div className="h-px w-full bg-white/5" />
            <Link href="/track-order" className="text-lg font-medium text-white/80 hover:text-white">Track Order</Link>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 bg-card py-12 md:py-16 mt-auto">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            <div className="md:col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <Disc3 className="w-5 h-5 text-black" />
                </div>
                <span className="font-serif font-bold text-2xl tracking-tight text-white">TosConnect</span>
              </Link>
              <p className="text-white/60 mb-6 max-w-sm">
                Where Music Meets Soul. Professional audio services for the Cambodian creator economy.
              </p>
              <div className="space-y-2 text-sm text-white/50">
                <p>Phnom Penh, Cambodia</p>
                <p>support@tosconnect.com</p>
              </div>
            </div>

            <div>
              <h3 className="font-serif font-bold text-white mb-4 tracking-wide uppercase text-sm">Services</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/services/mixing-mastering" className="hover:text-primary transition-colors">Mixing & Mastering</Link></li>
                <li><Link href="/services/consultation" className="hover:text-primary transition-colors">Virtual Consultation</Link></li>
                <li><Link href="/track-order" className="hover:text-primary transition-colors">Track Order</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-serif font-bold text-white mb-4 tracking-wide uppercase text-sm">Legal</h3>
              <ul className="space-y-3 text-sm text-white/60">
                <li><Link href="/terms-and-conditions" className="hover:text-white transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link href="/refund-policy" className="hover:text-white transition-colors">Refund Policy</Link></li>
                <li><Link href="/delivery-policy" className="hover:text-white transition-colors">Delivery Policy</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/40">
            <p>&copy; {new Date().getFullYear()} TosConnect. All rights reserved.</p>
            <div className="flex items-center gap-2">
              <span>Secure payments via</span>
              <span className="font-bold text-white/60">ABA PayWay KHQR</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
