'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus, Edit, Trash2, Package, Image as ImageIcon, Search, Filter, Grid3x3, List, Eye } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select } from '@/components/ui/Select'
import { Card } from '@/components/ui/Card'
import { formatPrice } from '@/lib/utils/format'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number
  image?: string
  images?: string[] // Массив URL изображений
  inStock: boolean
  categoryId: string
  category: {
    id: string
    name: string
  }
}

interface Category {
  id: string
  name: string
  slug: string
  parentId?: string
  parent?: Category
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [stockFilter, setStockFilter] = useState<'all' | 'inStock' | 'outOfStock'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('table')
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    image: '',
    inStock: true,
    categoryId: '',
  })

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products')
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching products:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const url = editing ? `/api/products/${editing.id}` : '/api/products'
      const method = editing ? 'PUT' : 'POST'

      const price = parseFloat(formData.price)
      if (isNaN(price) || price <= 0) {
        alert('Введите корректную цену')
        setLoading(false)
        return
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price,
          image: formData.image || undefined,
        }),
      })

      if (res.ok) {
        fetchProducts()
        setShowForm(false)
        setEditing(null)
        setFormData({
          name: '',
          slug: '',
          description: '',
          price: '',
          image: '',
          inStock: true,
          categoryId: '',
        })
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка при сохранении')
      }
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Ошибка при сохранении товара')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Удалить товар? Это действие нельзя отменить.')) return

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' })
      if (res.ok) {
        fetchProducts()
      } else {
        const error = await res.json()
        alert(error.error || 'Ошибка при удалении')
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Ошибка при удалении товара')
    }
  }

  const handleEdit = (product: Product) => {
    setEditing(product)
    setFormData({
      name: product.name,
      slug: product.slug,
      description: product.description || '',
      price: product.price.toString(),
      image: product.image || '',
      inStock: product.inStock,
      categoryId: product.categoryId,
    })
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditing(null)
    setFormData({
      name: '',
      slug: '',
      description: '',
      price: '',
      image: '',
      inStock: true,
      categoryId: '',
    })
  }

  const getCategoryPath = (category: Category): string => {
    const parts = [category.name]
    if (category.parent) {
      parts.unshift(category.parent.name)
    }
    return parts.join(' > ')
  }

  // Фильтрация товаров
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      // Поиск по названию
      if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false
      }
      // Фильтр по категории
      if (selectedCategory && product.categoryId !== selectedCategory) {
        return false
      }
      // Фильтр по наличию
      if (stockFilter === 'inStock' && !product.inStock) {
        return false
      }
      if (stockFilter === 'outOfStock' && product.inStock) {
        return false
      }
      return true
    })
  }, [products, searchQuery, selectedCategory, stockFilter])

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="horror-text text-4xl text-horror-glow flex items-center gap-2">
          <Package className="w-8 h-8" />
          ТОВАРЫ
        </h1>
        <Button
          onClick={() => {
            setShowForm(true)
            setEditing(null)
            setFormData({
              name: '',
              slug: '',
              description: '',
              price: '',
              image: '',
              inStock: true,
              categoryId: '',
            })
          }}
          variant="default"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Добавить
        </Button>
      </div>

      {/* Поиск и фильтры */}
      <Card className="mb-6">
        <div className="space-y-4">
          {/* Поиск */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Поиск по названию товара..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Фильтры */}
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-2 text-sm text-gray-300">Категория</label>
              <Select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Все категории</option>
                {categories
                  .filter((cat) => !cat.parentId)
                  .map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <label className="block mb-2 text-sm text-gray-300">Наличие</label>
              <Select
                value={stockFilter}
                onChange={(e) => setStockFilter(e.target.value as 'all' | 'inStock' | 'outOfStock')}
              >
                <option value="all">Все товары</option>
                <option value="inStock">В наличии</option>
                <option value="outOfStock">Нет в наличии</option>
              </Select>
            </div>
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block mb-2 text-sm text-gray-300">Вид</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setViewMode('table')}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      viewMode === 'table'
                        ? 'bg-horror-glow/20 border-horror-glow text-horror-glow'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:border-horror-glow/50'
                    }`}
                    title="Таблица"
                  >
                    <List className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      viewMode === 'grid'
                        ? 'bg-horror-glow/20 border-horror-glow text-horror-glow'
                        : 'bg-white/5 border-white/20 text-gray-300 hover:border-horror-glow/50'
                    }`}
                    title="Сетка"
                  >
                    <Grid3x3 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Статистика */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm text-gray-400">
              Найдено товаров: <span className="text-horror-glow font-bold">{filteredProducts.length}</span> из {products.length}
            </p>
          </div>
        </div>
      </Card>

      {showForm && (
        <Card className="mb-8">
          <div className="mb-6">
            <h2 className="text-2xl mb-2 text-horror-glow">
              {editing ? 'Редактировать товар' : 'Добавить новый товар'}
            </h2>
            <p className="text-gray-400 text-sm">
              Заполните информацию о товаре. Поля со звездочкой (*) обязательны для заполнения.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Название товара *
              </label>
              <Input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Например: Живая датская ёлка 2-2.5 метра"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">Название, которое увидят покупатели</p>
            </div>
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                URL-адрес (Slug) *
              </label>
              <Input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                placeholder="zhivaya-elka-2-2-5-metra"
                required
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1">
                Адрес страницы товара. Используйте только латинские буквы, цифры и дефисы. 
                Будет создан автоматически из названия, если оставить пустым.
              </p>
            </div>
            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Описание товара
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Подробное описание товара: размеры, характеристики, особенности..."
                disabled={loading}
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Подробное описание поможет покупателям лучше понять товар
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Цена (BYN) *
                </label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="0.00"
                  required
                  disabled={loading}
                />
                <p className="text-xs text-gray-500 mt-1">Цена в белорусских рублях</p>
              </div>
              
              <div>
                <label className="block mb-2 text-gray-300 font-medium">
                  Категория *
                </label>
                <Select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  required
                  disabled={loading}
                >
                  <option value="">Выберите категорию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {getCategoryPath(cat)}
                    </option>
                  ))}
                </Select>
                <p className="text-xs text-gray-500 mt-1">
                  В какой раздел каталога добавить товар
                </p>
              </div>
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-medium">
                Фотография товара (URL)
              </label>
              <Input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://example.com/image.jpg"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1 mb-2">
                Вставьте ссылку на изображение товара. Можно использовать ссылки с Unsplash, Imgur и других сервисов.
              </p>
              {formData.image && (
                <div className="mt-2">
                  <p className="text-xs text-gray-400 mb-2">Предпросмотр:</p>
                  <img 
                    src={formData.image} 
                    alt="Preview" 
                    className="w-48 h-48 object-cover horror-border rounded-lg"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>

            <div className="horror-border p-4 rounded-lg bg-horror-dark/30">
              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  disabled={loading}
                  className="w-5 h-5 mt-0.5"
                />
                <div>
                  <label htmlFor="inStock" className="text-gray-300 font-medium cursor-pointer block">
                    Товар в наличии
                  </label>
                  <p className="text-xs text-gray-500 mt-1">
                    Если включено, товар будет отображаться на сайте и доступен для покупки. 
                    Если выключено, товар будет скрыт от покупателей.
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <Button type="submit" variant="horror" disabled={loading}>
                {loading ? 'Сохранение...' : 'Сохранить'}
              </Button>
              <Button type="button" variant="ghost" onClick={handleCancel} disabled={loading}>
                Отмена
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* Список товаров */}
      {filteredProducts.length === 0 ? (
        <Card className="col-span-full">
          <p className="text-center text-gray-400 py-8">
            {products.length === 0 
              ? 'Товары не найдены. Создайте первый товар.' 
              : 'Товары не найдены по заданным фильтрам.'}
          </p>
        </Card>
      ) : viewMode === 'table' ? (
        // Табличный вид
        <Card className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Фото</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Название</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Категория</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Цена</th>
                <th className="text-left p-4 text-sm text-gray-400 font-medium">Наличие</th>
                <th className="text-right p-4 text-sm text-gray-400 font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-horror-dark/30 transition-colors">
                  <td className="p-4">
                    <div className="w-16 h-16 rounded-lg overflow-hidden bg-horror-dark flex items-center justify-center">
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                          }}
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-600" />
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <div>
                      <h3 className="text-horror-glow font-medium mb-1 line-clamp-2">{product.name}</h3>
                      {product.description && (
                        <p className="text-xs text-gray-500 line-clamp-1">{product.description}</p>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-300">{product.category.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-lg text-horror-red font-bold">{formatPrice(product.price)}</span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? 'bg-horror-glow/20 text-horror-glow border border-horror-glow/50' 
                        : 'bg-horror-red/20 text-horror-red border border-horror-red/50'
                    }`}>
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/catalog/${product.slug}`} target="_blank">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-400 hover:text-horror-glow"
                          title="Посмотреть на сайте"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEdit(product)}
                        className="text-gray-400 hover:text-horror-glow"
                        title="Редактировать"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-horror-red hover:text-horror-blood"
                        title="Удалить"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      ) : (
        // Вид сеткой
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} hover className="flex flex-col">
              {product.image ? (
                <div className="relative w-full h-48 mb-4 overflow-hidden rounded-t-lg">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-48 mb-4 horror-border flex items-center justify-center bg-horror-dark rounded-t-lg">
                  <ImageIcon className="w-16 h-16 text-gray-600" />
                </div>
              )}
              <div className="flex-1 flex flex-col p-4">
                <h3 className="text-xl text-horror-glow mb-2 line-clamp-2">{product.name}</h3>
                {product.description && (
                  <p className="text-sm text-gray-400 mb-3 line-clamp-2">{product.description}</p>
                )}
                <div className="mt-auto space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl text-horror-red font-bold">{formatPrice(product.price)}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      product.inStock 
                        ? 'bg-horror-glow/20 text-horror-glow border border-horror-glow/50' 
                        : 'bg-horror-red/20 text-horror-red border border-horror-red/50'
                    }`}>
                      {product.inStock ? 'В наличии' : 'Нет в наличии'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">Категория: {product.category.name}</p>
                  <div className="flex gap-2 pt-2">
                    <Link href={`/catalog/${product.slug}`} target="_blank" className="flex-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full text-gray-400 hover:text-horror-glow"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Посмотреть
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(product)}
                      className="flex-1 text-gray-400 hover:text-horror-glow"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Редактировать
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      className="text-horror-red hover:text-horror-blood"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

