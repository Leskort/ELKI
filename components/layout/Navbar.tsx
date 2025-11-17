'use client'

import { useState } from 'react'
import Link from 'next/link'
import { TreePine, Menu, X, Instagram, MessageCircle, Music } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { CartIcon } from '@/components/cart/CartIcon'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const navLinks = [
    { href: '/about', label: 'О нас' },
    { href: '/catalog', label: 'Каталог' },
    { href: '/services', label: 'Услуги' },
    { href: '/payment-delivery', label: 'Оплата и доставка' },
    { href: '/contacts', label: 'Контакты' },
  ]

  const socialLinks = [
    { href: 'https://instagram.com', icon: Instagram, label: 'Instagram' },
    { href: 'https://t.me', icon: MessageCircle, label: 'Telegram' },
    { href: 'https://tiktok.com', icon: Music, label: 'TikTok' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-[9999] horror-border-b backdrop-blur-md bg-horror-dark/95 shadow-lg shadow-black/30 border-b-2 border-horror-glow/30">
      <nav className="container mx-auto px-4 py-4 md:py-6">
        <div className="flex justify-between items-center">
          {/* Логотип */}
          <Link 
            href="/" 
            className="horror-text text-2xl md:text-3xl text-horror-glow hover:scale-105 transition-transform flex items-center gap-2"
          >
            <TreePine className="w-6 h-6 md:w-8 md:h-8" />
            <span>ЁЛКИ</span>
          </Link>

          {/* Десктопное меню */}
          <div className="hidden md:flex gap-6 items-center">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-horror-glow transition-colors text-lg"
              >
                {link.label}
              </Link>
            ))}
                <div className="flex gap-3 items-center ml-4 pl-4 horror-border-l">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return (
                      <a
                        key={social.label}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-400 hover:text-horror-glow transition-colors"
                        aria-label={social.label}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    )
                  })}
                  <CartIcon />
                </div>
          </div>

          {/* Мобильное меню - корзина и бургер кнопка */}
          <div className="flex items-center gap-3 md:hidden">
            <CartIcon />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-horror-glow hover:text-horror-glow/80 transition-colors"
              aria-label="Меню"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Мобильное меню */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-4 space-y-4 horror-border-t mt-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block hover:text-horror-glow transition-colors text-lg py-2"
                  >
                    {link.label}
                  </Link>
                ))}
                    <div className="flex gap-4 items-center pt-4 horror-border-t">
                      {socialLinks.map((social) => {
                        const Icon = social.icon
                        return (
                          <a
                            key={social.label}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gray-400 hover:text-horror-glow transition-colors"
                            aria-label={social.label}
                          >
                            <Icon className="w-6 h-6" />
                          </a>
                        )
                      })}
                    </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

