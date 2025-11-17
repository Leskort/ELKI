'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { TreePine, ArrowRight, ArrowUp, ArrowDown } from 'lucide-react'
import { ProductCard } from '@/components/ui/ProductCard'
import { Navbar } from '@/components/layout/Navbar'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  image?: string
  inStock: boolean
  category: {
    id: string
    name: string
    slug: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  parent?: Category
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const [category, setCategory] = useState<Category | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'popular' | 'name' | 'price'>('popular')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  useEffect(() => {
    fetchCategory()
  }, [params.slug])

  useEffect(() => {
    if (category) {
      fetchProducts()
    }
  }, [category, params.slug])

  useEffect(() => {
    if (products.length > 0) {
      sortProducts()
    }
  }, [sortBy, sortOrder])

  const fetchCategory = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const categories = await res.json()
        const foundCategory = categories.find((cat: Category) => cat.slug === params.slug)
        setCategory(foundCategory || null)
      }
    } catch (error) {
      console.error('Error fetching category:', error)
    }
  }

  const fetchProducts = async () => {
    if (!category) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/products?categoryId=${category.id}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data.filter((p: Product) => p.inStock))
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const sortProducts = () => {
    setProducts((prevProducts) => {
      const sorted = [...prevProducts]
      
      switch (sortBy) {
        case 'name':
          sorted.sort((a, b) => {
            const result = a.name.localeCompare(b.name, 'ru')
            return sortOrder === 'asc' ? result : -result
          })
          break
        case 'price':
          sorted.sort((a, b) => {
            const result = a.price - b.price
            return sortOrder === 'asc' ? result : -result
          })
          break
        case 'popular':
        default:
          // По умолчанию оставляем как есть (по порядку загрузки)
          break
      }
      
      return sorted
    })
  }

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
  }

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      { label: 'Главная', href: '/' },
      { label: 'Магазин ёлок', href: '/catalog' },
    ]

    if (category) {
      if (category.parent) {
        breadcrumbs.push({ label: category.parent.name, href: `/catalog/category/${category.parent.slug}` })
      }
      breadcrumbs.push({ label: category.name, href: `/catalog/category/${category.slug}` })
    }

    return breadcrumbs
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

  if (!category) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="horror-text text-3xl text-horror-glow mb-4">Категория не найдена</h1>
            <Link href="/catalog">
              <button className="px-6 py-3 bg-horror-red hover:bg-horror-blood horror-text text-lg horror-glow transition-all">
                Вернуться в каталог
              </button>
            </Link>
          </div>
        </div>
      </div>
    )
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

        {/* Заголовок категории */}
        <h1 className="horror-text text-3xl sm:text-4xl md:text-5xl text-horror-glow mb-6">
          {category.name}
        </h1>

        {/* Сортировка */}
        <div className="mb-8 flex flex-wrap items-center gap-4">
          <span className="text-gray-400">Сортировка:</span>
          <div className="flex flex-wrap gap-2">
            {(['popular', 'name', 'price'] as const).map((sort) => (
              <button
                key={sort}
                onClick={() => {
                  if (sortBy === sort) {
                    toggleSortOrder()
                  } else {
                    setSortBy(sort)
                    setSortOrder('asc')
                  }
                }}
                className={`px-4 py-2 rounded-lg border transition-all ${
                  sortBy === sort
                    ? 'bg-horror-glow/20 border-horror-glow text-horror-glow'
                    : 'bg-white/5 border-white/20 text-gray-300 hover:border-horror-glow/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span>
                    {sort === 'popular' && 'По популярности'}
                    {sort === 'name' && 'По названию'}
                    {sort === 'price' && 'По цене'}
                  </span>
                  {sortBy === sort && (
                    sortOrder === 'asc' ? (
                      <ArrowUp className="w-4 h-4" />
                    ) : (
                      <ArrowDown className="w-4 h-4" />
                    )
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Товары */}
        {products.length === 0 ? (
          <div className="text-center py-20">
            <TreePine className="w-24 h-24 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-xl mb-4">Товары в этой категории пока отсутствуют</p>
            <Link href="/catalog">
              <button className="px-6 py-3 bg-horror-red hover:bg-horror-blood horror-text text-lg horror-glow transition-all">
                Вернуться в каталог
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

