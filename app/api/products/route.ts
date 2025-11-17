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

// GET - получить все товары
export async function GET(request: NextRequest) {
  try {
    // Проверяем доступность базы данных
    const dbAvailable = await isDatabaseAvailable()
    
    if (!dbAvailable) {
      // Используем статические данные
      const { searchParams } = new URL(request.url)
      const categoryId = searchParams.get('categoryId')
      
      let products = staticProducts
      
      if (categoryId) {
        products = products.filter(p => p.categoryId === categoryId)
      }
      
      return NextResponse.json(products)
    }

    // Используем базу данных
    const { searchParams } = new URL(request.url)
    const categoryId = searchParams.get('categoryId')

    let where: any = {}
    
    if (categoryId) {
      // Получаем все подкатегории выбранной категории
      const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: { children: true }
      })
      
      if (category) {
        // Если у категории есть подкатегории, ищем товары во всех подкатегориях
        if (category.children && category.children.length > 0) {
          const categoryIds = [categoryId, ...category.children.map(c => c.id)]
          where = { categoryId: { in: categoryIds } }
        } else {
          // Если подкатегорий нет, ищем товары только в этой категории
          where = { categoryId }
        }
      }
    }

    const products = await prisma.product.findMany({
      where,
      include: {
        category: {
          include: {
            parent: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    // Преобразуем images из JSON строки в массив для фронтенда
    const productsWithParsedImages = products.map(product => ({
      ...product,
      images: product.images ? JSON.parse(product.images) : []
    }))

    return NextResponse.json(productsWithParsedImages)
  } catch (error) {
    console.error('Error fetching products:', error)
    // В случае ошибки возвращаем статические данные
    return NextResponse.json(staticProducts)
  }
}

// POST - создать товар
export async function POST(request: NextRequest) {
  try {
    await requireAdmin()

    const body = await request.json()
    const data = productSchema.parse(body)

    // Проверка уникальности slug
    const existing = await prisma.product.findUnique({
      where: { slug: data.slug }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Товар с таким slug уже существует' },
        { status: 400 }
      )
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

    const product = await prisma.product.create({
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

    return NextResponse.json(productWithParsedImages, { status: 201 })
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

    console.error('Error creating product:', error)
    return NextResponse.json(
      { error: 'Ошибка при создании товара' },
      { status: 500 }
    )
  }
}

