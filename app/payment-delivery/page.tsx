'use client'

import { motion } from 'framer-motion'
import { TreePine, CreditCard, Truck, RefreshCw, Shield } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'

export default function PaymentDeliveryPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="container mx-auto px-4 py-8 sm:py-12 pt-24 sm:pt-28">
        {/* Хлебные крошки */}
        <nav className="mb-4 sm:mb-6">
          <ol className="flex items-center gap-2 text-sm text-gray-400">
            <li><a href="/" className="hover:text-horror-glow transition-colors">Главная</a></li>
            <li>/</li>
            <li className="text-gray-300">Оплата и доставка</li>
          </ol>
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="horror-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-horror-glow mb-8 sm:mb-12 text-center flex items-center justify-center gap-2 sm:gap-3">
            <TreePine className="w-8 h-8 sm:w-12 sm:h-12" />
            <span>ОПЛАТА И ДОСТАВКА</span>
          </h1>

          <div className="space-y-8 sm:space-y-12">
            {/* Оплата */}
            <section className="horror-border p-4 sm:p-8">
              <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-6 flex items-center gap-3">
                <CreditCard className="w-6 h-6 sm:w-8 sm:h-8" />
                Способы оплаты
              </h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-lg sm:text-xl text-horror-glow mb-2">Наличными при получении</h3>
                  <p className="text-sm sm:text-base">
                    Вы можете оплатить заказ наличными курьеру при доставке. Принимаются только белорусские рубли (BYN).
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-horror-glow mb-2">Банковской картой</h3>
                  <p className="text-sm sm:text-base">
                    Оплата банковской картой через терминал курьера или онлайн на сайте. Принимаются карты Visa, MasterCard, МИР.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-horror-glow mb-2">Банковским переводом</h3>
                  <p className="text-sm sm:text-base">
                    Для юридических лиц доступна оплата по безналичному расчёту. Счёт выставляется после подтверждения заказа.
                  </p>
                </div>
              </div>
            </section>

            {/* Доставка */}
            <section className="horror-border p-4 sm:p-8">
              <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-6 flex items-center gap-3">
                <Truck className="w-6 h-6 sm:w-8 sm:h-8" />
                Доставка
              </h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-lg sm:text-xl text-horror-glow mb-2">Доставка по Минску</h3>
                  <p className="text-sm sm:text-base mb-2">
                    Доставка осуществляется в течение 1-3 рабочих дней после подтверждения заказа.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-400 ml-4">
                    <li>Стоимость доставки: от 15 BYN</li>
                    <li>Бесплатная доставка при заказе от 200 BYN</li>
                    <li>Доставка в день заказа: +20 BYN (при заказе до 12:00)</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-horror-glow mb-2">Доставка по Беларуси</h3>
                  <p className="text-sm sm:text-base mb-2">
                    Доставка в другие города Беларуси осуществляется через транспортные компании.
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-400 ml-4">
                    <li>Стоимость рассчитывается индивидуально</li>
                    <li>Срок доставки: 3-7 рабочих дней</li>
                    <li>Оплата при получении или предоплата</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-horror-glow mb-2">Самовывоз</h3>
                  <p className="text-sm sm:text-base">
                    Вы можете забрать заказ самостоятельно по адресу: г. Минск, ул. Сурганова, 50. 
                    Предварительно согласуйте время визита с нашим менеджером.
                  </p>
                </div>
              </div>
            </section>

            {/* Возврат и замена */}
            <section className="horror-border p-4 sm:p-8">
              <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-6 flex items-center gap-3">
                <RefreshCw className="w-6 h-6 sm:w-8 sm:h-8" />
                Возврат и замена товара
              </h2>
              <div className="space-y-4 text-gray-300">
                <div>
                  <h3 className="text-lg sm:text-xl text-horror-glow mb-2">Условия возврата</h3>
                  <p className="text-sm sm:text-base mb-2">
                    Вы можете вернуть товар в течение 14 дней с момента покупки при соблюдении следующих условий:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-gray-400 ml-4">
                    <li>Товар не был в употреблении</li>
                    <li>Сохранён товарный вид и упаковка</li>
                    <li>Имеются документы, подтверждающие покупку</li>
                    <li>Товар не относится к категории скоропортящихся</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl text-horror-glow mb-2">Замена товара</h3>
                  <p className="text-sm sm:text-base mb-2">
                    В случае обнаружения брака или несоответствия товара описанию, мы произведём замену или возврат средств.
                  </p>
                  <p className="text-sm sm:text-base text-gray-400">
                    Для оформления возврата или замены свяжитесь с нами по телефону или через форму обратной связи на странице контактов.
                  </p>
                </div>
              </div>
            </section>

            {/* Гарантии */}
            <section className="horror-border p-4 sm:p-8">
              <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-6 flex items-center gap-3">
                <Shield className="w-6 h-6 sm:w-8 sm:h-8" />
                Гарантии
              </h2>
              <div className="space-y-4 text-gray-300">
                <p className="text-sm sm:text-base">
                  Мы гарантируем качество всех наших товаров. Каждая ёлка проходит тщательный отбор перед отправкой.
                </p>
                <p className="text-sm sm:text-base">
                  В случае если товар не соответствует заявленному качеству, мы вернём полную стоимость или заменим товар.
                </p>
                <p className="text-sm sm:text-base text-horror-glow">
                  Ваша удовлетворённость — наш приоритет!
                </p>
              </div>
            </section>

            {/* Контакты для вопросов */}
            <section className="horror-border p-4 sm:p-8 text-center">
              <h2 className="horror-text text-2xl sm:text-3xl text-horror-glow mb-4">
                Остались вопросы?
              </h2>
              <p className="text-gray-300 mb-6 text-sm sm:text-base">
                Свяжитесь с нами, и мы с радостью ответим на все ваши вопросы
              </p>
              <a
                href="/contacts"
                className="inline-block px-6 sm:px-8 py-3 sm:py-4 bg-horror-red hover:bg-horror-blood horror-text text-lg sm:text-xl horror-glow transition-all"
              >
                СВЯЗАТЬСЯ С НАМИ
              </a>
            </section>
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

