'use client'

import { motion } from 'framer-motion'
import { TreePine, Phone, Mail, MapPin, Clock, MessageSquare, Instagram, MessageCircle, Music } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Navbar } from '@/components/layout/Navbar'

export default function ContactsPage() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Здесь будет обработка формы
    alert('Спасибо за ваше сообщение! Мы свяжемся с вами в ближайшее время.')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Navbar />

      <main className="container mx-auto px-4 py-20 pt-28 sm:pt-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-6xl mx-auto"
        >
          <h1 className="horror-text text-3xl sm:text-4xl md:text-5xl lg:text-7xl text-horror-glow mb-8 sm:mb-12 text-center px-4">
            КОНТАКТЫ
          </h1>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {/* Контактная информация */}
            <div className="space-y-6">
              <div className="horror-border p-4 sm:p-6">
                <h2 className="horror-text text-xl sm:text-2xl text-horror-glow mb-4 sm:mb-6">
                  Свяжитесь с нами
                </h2>
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <Phone className="w-6 h-6 text-horror-glow mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg text-horror-glow mb-1">Телефон</h3>
                      <a href="tel:+375291234567" className="text-gray-300 hover:text-horror-glow transition-colors">
                        +375 (29) 123-45-67
                      </a>
                      <br />
                      <a href="tel:+375331234567" className="text-gray-300 hover:text-horror-glow transition-colors">
                        +375 (33) 123-45-67
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Mail className="w-6 h-6 text-horror-glow mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg text-horror-glow mb-1">Email</h3>
                      <a href="mailto:info@elki-tmy.by" className="text-gray-300 hover:text-horror-glow transition-colors">
                        info@elki-tmy.by
                      </a>
                      <br />
                      <a href="mailto:orders@elki-tmy.by" className="text-gray-300 hover:text-horror-glow transition-colors">
                        orders@elki-tmy.by
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <MapPin className="w-6 h-6 text-horror-glow mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg text-horror-glow mb-1">Адрес</h3>
                      <p className="text-gray-300">
                        г. Минск<br />
                        ул. Сурганова, 50
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <Clock className="w-6 h-6 text-horror-glow mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg text-horror-glow mb-1">Режим работы</h3>
                      <p className="text-gray-300">
                        Пн-Пт: 10:00 - 20:00<br />
                        Сб-Вс: 11:00 - 18:00
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="horror-border p-6">
                <h3 className="text-xl text-horror-glow mb-4">Мы в социальных сетях</h3>
                <div className="flex gap-4 items-center">
                  <a 
                    href="https://instagram.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-horror-glow transition-colors flex items-center gap-2"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6" />
                    <span className="hidden sm:inline">Instagram</span>
                  </a>
                  <a 
                    href="https://t.me" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-horror-glow transition-colors flex items-center gap-2"
                    aria-label="Telegram"
                  >
                    <MessageCircle className="w-6 h-6" />
                    <span className="hidden sm:inline">Telegram</span>
                  </a>
                  <a 
                    href="https://tiktok.com" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-400 hover:text-horror-glow transition-colors flex items-center gap-2"
                    aria-label="TikTok"
                  >
                    <Music className="w-6 h-6" />
                    <span className="hidden sm:inline">TikTok</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Форма обратной связи */}
            <div className="horror-border p-4 sm:p-6">
              <h2 className="horror-text text-xl sm:text-2xl text-horror-glow mb-4 sm:mb-6 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6" />
                Напишите нам
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block mb-2 text-gray-300">Ваше имя *</label>
                  <Input
                    type="text"
                    required
                    placeholder="Иван Иванов"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">Email *</label>
                  <Input
                    type="email"
                    required
                    placeholder="ivan@example.com"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">Телефон</label>
                  <Input
                    type="tel"
                    placeholder="+375 (29) 123-45-67"
                  />
                </div>

                <div>
                  <label className="block mb-2 text-gray-300">Сообщение *</label>
                  <Textarea
                    required
                    placeholder="Ваше сообщение..."
                    rows={5}
                  />
                </div>

                <Button type="submit" variant="horror" className="w-full">
                  ОТПРАВИТЬ
                </Button>
              </form>
            </div>
          </div>

          {/* Карта */}
          <div className="mt-12 horror-border p-4 sm:p-8">
            <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-4 text-center">Как нас найти</h2>
            <div className="w-full h-64 sm:h-96 horror-border overflow-hidden">
              <iframe
                src="https://yandex.ru/map-widget/v1/?um=constructor%3A1&ll=27.5565%2C53.9045&z=16&pt=27.5565%2C53.9045&l=map&pt=27.5565%2C53.9045"
                width="100%"
                height="100%"
                frameBorder="0"
                allowFullScreen
                style={{ border: 0 }}
                title="Карта расположения - г. Минск, ул. Сурганова, 50"
                loading="lazy"
              />
            </div>
            <p className="text-center text-gray-400 mt-4 text-sm sm:text-base">
              г. Минск, ул. Сурганова, 50
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="horror-border-t mt-20 backdrop-blur-sm bg-horror-dark/30">
        <div className="container mx-auto px-4 py-8 text-center text-gray-400">
          <p className="mb-2">© 2024 Ёлки из Тьмы. Все права защищены.</p>
          <p className="text-sm">Цены в белорусских рублях (BYN)</p>
        </div>
      </footer>
    </div>
  )
}

