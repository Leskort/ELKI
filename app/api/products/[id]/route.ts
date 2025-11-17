import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAdmin } from '@/lib/auth'
import { productSchema } from '@/lib/validations/product'
import { staticProducts } from '@/lib/data/static-data'

// Проверка доступности базы данных
async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch {
    return false
  }
}

// GET - получить товар по ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Проверяем доступность базы данных
    const dbAvailable = await isDatabaseAvailable()
    
    if (!dbAvailable) {
      // Используем статические данные
      const product = staticProducts.find(p => p.id === params.id || p.slug === params.id)
      if (!product) {
        return NextResponse.json(
          { error: 'Товар не найден' },
          { status: 404 }
        )
      }
      return NextResponse.json(product)
    }

    // Используем базу данных
    // Пытаемся найти по ID или slug
    const product = await prisma.product.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id }
        ]
      },
      include: {
        category: {
          include: {
            parent: true
          }
        }
      }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Преобразуем images из JSON строки в массив для фронтенда
    const productWithParsedImages = {
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }

    return NextResponse.json(productWithParsedImages)
  } catch (error) {
    console.error('Error fetching product:', error)
    // В случае ошибки пытаемся найти в статических данных
    const product = staticProducts.find(p => p.id === params.id || p.slug === params.id)
    if (product) {
      return NextResponse.json(product)
    }
    return NextResponse.json(
      { error: 'Ошибка при получении товара' },
      { status: 500 }
    )
  }
}

// PUT - обновить товар
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const body = await request.json()
    const data = productSchema.parse(body)

    // Проверка существования товара
    const existing = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!existing) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    // Проверка уникальности slug (если изменился)
    if (data.slug !== existing.slug) {
      const slugExists = await prisma.product.findUnique({
        where: { slug: data.slug }
      })

      if (slugExists) {
        return NextResponse.json(
          { error: 'Товар с таким slug уже существует' },
          { status: 400 }
        )
      }
    }

    // Проверка существования категории
    const category = await prisma.category.findUnique({
      where: { id: data.categoryId }
    })

    if (!category) {
      return NextResponse.json(
        { error: 'Категория не найдена' },
        { status: 400 }
      )
    }

    const product = await prisma.product.update({
      where: { id: params.id },
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        price: data.price,
        image: data.image || null,
        images: data.images && data.images.length > 0 ? JSON.stringify(data.images) : '[]',
        inStock: data.inStock,
        categoryId: data.categoryId,
      },
      include: {
        category: true
      }
    })

    // Преобразуем images из JSON строки в массив для фронтенда
    const productWithParsedImages = {
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }

    return NextResponse.json(productWithParsedImages)
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        { error: 'Неверные данные', details: error.errors },
        { status: 400 }
      )
    }

    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    console.error('Error updating product:', error)
    return NextResponse.json(
      { error: 'Ошибка при обновлении товара' },
      { status: 500 }
    )
  }
}

// DELETE - удалить товар
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAdmin()

    const product = await prisma.product.findUnique({
      where: { id: params.id }
    })

    if (!product) {
      return NextResponse.json(
        { error: 'Товар не найден' },
        { status: 404 }
      )
    }

    await prisma.product.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Товар удален' })
  } catch (error: any) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json(
        { error: 'Доступ запрещен' },
        { status: 403 }
      )
    }

    console.error('Error deleting product:', error)
    return NextResponse.json(
      { error: 'Ошибка при удалении товара' },
      { status: 500 }
    )
  }
}

