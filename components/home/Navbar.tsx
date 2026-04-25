'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const NAV_LINKS = [
  { label: 'Marche', href: '/marche' },
  { label: 'Expert', href: '/expert' },
  { label: 'FAQ', href: '/faq' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <>
      <header className="fixed inset-x-4 top-4 z-50">
        <nav
          className={[
            'mx-auto max-w-7xl rounded-2xl border px-4 py-3 md:px-6',
            'transition-all duration-300',
            'premium-dark-glass border-white/20 shadow-[0_18px_60px_-28px_rgba(3,8,22,0.7)]',
          ].join(' ')}
          aria-label="Navigation principale"
        >
          <div className="flex items-center justify-between gap-4">
            <Link
              href="/"
              className="group flex min-h-11 items-center gap-3 no-underline"
              aria-label="Accueil ajaccio-estimation.fr"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C9A96E] shadow-[0_8px_20px_-8px_rgba(201,169,110,0.7)] transition-transform duration-300 group-hover:scale-105">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M4 12l8-8 8 8"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8 10v8h8v-8"
                    stroke="white"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              <span className="leading-none">
                <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.24em] text-white/60">
                  Estimation immobiliere
                </span>
                <span
                  className="block text-[1rem] font-extrabold tracking-tight text-white"
                  style={{ fontFamily: 'var(--font-cormorant)' }}
                >
                  AJACCIO<span className="text-[#C9A96E]">ESTIMATION</span>
                </span>
              </span>
            </Link>

            <ul className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/[0.03] px-2 py-1 lg:flex">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <NavLink href={link.href}>{link.label}</NavLink>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-2">
              <Link
                href="/estimer"
                className="hidden min-h-11 items-center rounded-[8px] bg-[#C9A96E] px-5 py-2 text-sm font-semibold text-white no-underline transition-colors duration-200 hover:bg-[#B8985E] lg:inline-flex"
              >
                Estimer mon bien
              </Link>

              <button
                type="button"
                className="flex min-h-11 min-w-11 items-center justify-center rounded-xl border border-white/20 bg-white/[0.06] text-white transition-colors duration-200 hover:bg-white/[0.12] lg:hidden"
                onClick={() => setMenuOpen((prev) => !prev)}
                aria-label={menuOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
                aria-expanded={menuOpen}
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 bg-[#08162A]/95 backdrop-blur-xl"
          >
            <nav className="flex h-full flex-col justify-center gap-3 px-8 pt-20">
              {NAV_LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: 28 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: 0.08 + i * 0.06, duration: 0.28 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-white/90 no-underline transition-colors duration-200 hover:bg-white/[0.08]"
                    style={{
                      fontFamily: 'var(--font-cormorant)',
                      fontWeight: 700,
                      fontSize: '1.8rem',
                      letterSpacing: '-0.02em',
                    }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ delay: 0.26, duration: 0.28 }}
                className="mt-6"
              >
                <Link
                  href="/estimer"
                  onClick={() => setMenuOpen(false)}
                  className="flex min-h-12 w-full items-center justify-center rounded-[8px] bg-[#C9A96E] px-7 py-3 text-base font-semibold text-white no-underline transition-colors duration-200 hover:bg-[#B8985E]"
                >
                  Estimer mon bien
                </Link>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="group relative inline-flex min-h-11 items-center rounded-full px-4 py-2 text-sm font-medium text-white/80 no-underline transition-colors duration-200 hover:text-white"
      style={{ fontFamily: 'var(--font-dm-sans)' }}
    >
      {children}
      <span
        className="absolute inset-x-3 bottom-1 h-px origin-left scale-x-0 bg-[#C9A96E] transition-transform duration-200 group-hover:scale-x-100"
        aria-hidden="true"
      />
    </Link>
  )
}
