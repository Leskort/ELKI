'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { formatPrice } from '@/lib/utils/format'
import { Button } from '@/components/ui/Button'
import { TreePine, ArrowLeft, ArrowRight, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import { Navbar } from '@/components/layout/Navbar'
import { useCart } from '@/contexts/CartContext'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  image?: string
  images?: string[]
  inStock: boolean
  category: {
    id: string
    name: string
    slug: string
    parent?: {
      id: string
      name: string
      slug: string
    }
  }
}

export default function ProductPage({ params }: { params: { slug: string } }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const { addToCart } = useCart()
  const router = useRouter()

  useEffect(() => {
    fetchProduct()
  }, [params.slug])

  const fetchProduct = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const products = await res.json()
        const foundProduct = products.find((p: Product) => p.slug === params.slug)
        setProduct(foundProduct || null)
      }
    } catch (error) {
      console.error('Error fetching product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.image,
      })
      // Можно добавить уведомление о добавлении в корзину
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <p className="text-gray-400 text-xl">Загрузка...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product || !product.inStock) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="horror-text text-3xl text-horror-glow mb-4">Товар не найден</h1>
            <Link href="/catalog">
              <Button variant="horror" size="lg" className="flex items-center gap-2 mx-auto">
                <ArrowLeft className="w-5 h-5" />
                Вернуться в каталог
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const categoryPath = product.category.parent
    ? `${product.category.parent.name} > ${product.category.name}`
    : product.category.name

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Главная', href: '/' },
      { label: 'Магазин ёлок', href: '/catalog' },
    ]

    if (product.category.parent) {
      breadcrumbs.push({
        label: product.category.parent.name,
        href: `/catalog/category/${product.category.parent.slug}`,
      })
    }

    breadcrumbs.push({
      label: product.category.name,
      href: `/catalog/category/${product.category.slug}`,
    })

    breadcrumbs.push({
      label: product.name,
      href: `/catalog/${product.slug}`,
    })

    return breadcrumbs
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="container mx-auto px-4 py-6 sm:py-8 pt-24 sm:pt-28">
        {/* Хлебные крошки */}
        <nav className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-400">
            {getBreadcrumbs().map((crumb, index, array) => (
              <li key={crumb.href} className="flex items-center gap-2">
                {index > 0 && <ArrowRight className="w-4 h-4" />}
                {index === array.length - 1 ? (
                  <span className="text-horror-glow">{crumb.label}</span>
                ) : (
                  <Link href={crumb.href} className="hover:text-horror-glow transition-colors">
                    {crumb.label}
                  </Link>
                )}
              </li>
            ))}
          </ol>
        </nav>

        <div className="grid md:grid-cols-2 gap-6 md:gap-12">
          {/* Изображение */}
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl shadow-black/50" />
            
            <div className="relative z-10 p-4">
              {product.image ? (
                <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square rounded-xl horror-border flex items-center justify-center bg-horror-dark">
                  <TreePine className="w-48 h-48 text-gray-600" />
                </div>
              )}
            </div>
          </div>

          {/* Информация */}
          <div>
            <h1 className="horror-text text-3xl sm:text-4xl md:text-5xl text-horror-glow mb-6">
              {product.name}
            </h1>

            <div className="mb-6">
              <p className="text-4xl sm:text-5xl text-horror-red font-bold mb-2">
                {formatPrice(product.price)}
              </p>
              <p className="text-sm text-gray-400">Цена в белорусских рублях</p>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-3 h-3 bg-horror-glow rounded-full animate-glow-pulse shadow-lg shadow-horror-glow/50"></span>
                <span className="text-horror-glow font-bold text-lg">В наличии</span>
              </div>
            </div>

            {product.description && (
              <div className="mb-8">
                <h2 className="text-xl text-horror-glow mb-3 border-b border-horror-glow/30 pb-2">
                  Описание
                </h2>
                <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}

            <div className="space-y-4 mb-8">
              <Button
                variant="horror"
                size="lg"
                className="w-full text-xl py-6 flex items-center justify-center gap-3"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="w-6 h-6" />
                В КОРЗИНУ
              </Button>
            </div>

            <div className="relative rounded-xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent backdrop-blur-xl border border-white/20 rounded-xl shadow-xl shadow-black/50" />
              
              <div className="relative z-10 p-6">
                <h3 className="text-lg text-horror-glow mb-4 border-b border-horror-glow/30 pb-2">
                  Характеристики
                </h3>
                <div className="space-y-3 text-sm text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Категория:</span>
                    <span className="text-horror-glow font-semibold">{categoryPath}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Наличие:</span>
                    <span className="text-horror-glow font-semibold">В наличии</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
