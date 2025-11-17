import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌲 Начинаем посев данных...')

  // Создаем админа
  const hashedPassword = await bcrypt.hash('admin123', 10)
  
  const admin = await prisma.user.upsert({
    where: { email: 'admin@elki.by' },
    update: {},
    create: {
      email: 'admin@elki.by',
      password: hashedPassword,
      name: 'Администратор',
      role: 'admin',
    },
  })

  console.log('✅ Админ создан:', admin.email, '| Пароль: admin123')

  // Создаем категории
  const category1 = await prisma.category.upsert({
    where: { slug: 'zhivye-elki' },
    update: {},
    create: {
      name: 'Живые ёлки',
      slug: 'zhivye-elki',
      description: 'Пихта Нордмана (срезанная)',
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800',
    },
  })

  const category2 = await prisma.category.upsert({
    where: { slug: 'podstavki-aksessuary' },
    update: {},
    create: {
      name: 'Подставки и аксессуары',
      slug: 'podstavki-aksessuary',
      description: 'Подставки и аксессуары для ёлок',
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d3655b?w=800',
    },
  })

  const categoryServices = await prisma.category.upsert({
    where: { slug: 'uslugi' },
    update: {},
    create: {
      name: 'Услуги',
      slug: 'uslugi',
      description: 'Услуги по установке и утилизации ёлок',
      image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
    },
  })

  // Подкатегории для живых ёлок
  const category3 = await prisma.category.upsert({
    where: { slug: 'elki-1-0-1-2' },
    update: {},
    create: {
      name: '1,0-1,2м',
      slug: 'elki-1-0-1-2',
      description: 'Ёлки высотой от 1 до 1.2 метра',
      parentId: category1.id,
    },
  })

  const category4 = await prisma.category.upsert({
    where: { slug: 'elki-1-2-1-5' },
    update: {},
    create: {
      name: '1,2-1,5м',
      slug: 'elki-1-2-1-5',
      description: 'Ёлки высотой от 1.2 до 1.5 метра',
      parentId: category1.id,
    },
  })

  const category5 = await prisma.category.upsert({
    where: { slug: 'elki-1-5-1-7' },
    update: {},
    create: {
      name: '1,5-1,7м',
      slug: 'elki-1-5-1-7',
      description: 'Ёлки высотой от 1.5 до 1.7 метра',
      parentId: category1.id,
    },
  })

  const category6 = await prisma.category.upsert({
    where: { slug: 'elki-1-7-2-0' },
    update: {},
    create: {
      name: '1,7-2,0м',
      slug: 'elki-1-7-2-0',
      description: 'Ёлки высотой от 1.7 до 2.0 метра',
      parentId: category1.id,
    },
  })

  const category7 = await prisma.category.upsert({
    where: { slug: 'elki-2-0-2-2' },
    update: {},
    create: {
      name: '2,0-2,2м',
      slug: 'elki-2-0-2-2',
      description: 'Ёлки высотой от 2.0 до 2.2 метра',
      parentId: category1.id,
    },
  })

  const category8 = await prisma.category.upsert({
    where: { slug: 'elki-2-2-2-5' },
    update: {},
    create: {
      name: '2,2-2,5м',
      slug: 'elki-2-2-2-5',
      description: 'Ёлки высотой от 2.2 до 2.5 метра',
      parentId: category1.id,
    },
  })

  const category9 = await prisma.category.upsert({
    where: { slug: 'elki-2-5-3-0' },
    update: {},
    create: {
      name: '2,5-3,0м',
      slug: 'elki-2-5-3-0',
      description: 'Ёлки высотой от 2.5 до 3.0 метра',
      parentId: category1.id,
    },
  })

  console.log('✅ Категории созданы')

  // Создаем товары - Живые ёлки
  const products = [
    {
      name: 'Живая датская ёлка (пихта Нордмана, срезанная) 1,0-1,2м',
      slug: 'zhivaya-datskaya-elka-1-0-1-2m',
      description: 'Живая датская ёлка пихта Нордмана, срезанная. Высота 1,0-1,2 метра. Идеальна для небольших помещений.',
      price: 187.00,
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800',
      categoryId: category3.id,
    },
    {
      name: 'Живая датская ёлка (пихта Нордмана, срезанная) 1,2-1,5м',
      slug: 'zhivaya-datskaya-elka-1-2-1-5m',
      description: 'Живая датская ёлка пихта Нордмана, срезанная. Высота 1,2-1,5 метра. Отличный выбор для дома.',
      price: 247.00,
      image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
      categoryId: category4.id,
    },
    {
      name: 'Живая датская ёлка (пихта Нордмана, срезанная) 1,5-1,7м',
      slug: 'zhivaya-datskaya-elka-1-5-1-7m',
      description: 'Живая датская ёлка пихта Нордмана, срезанная. Высота 1,5-1,7 метра. Великолепная для гостиной.',
      price: 315.00,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
      categoryId: category5.id,
    },
    {
      name: 'Живая датская ёлка (пихта Нордмана, срезанная) 1,7-2,0м',
      slug: 'zhivaya-datskaya-elka-1-7-2-0m',
      description: 'Живая датская ёлка пихта Нордмана, срезанная. Высота 1,7-2,0 метра. Впечатляющий размер.',
      price: 408.00,
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d3655b?w=800',
      categoryId: category6.id,
    },
    {
      name: 'Живая датская ёлка (пихта Нордмана, срезанная) 2,0-2,2м',
      slug: 'zhivaya-datskaya-elka-2-0-2-2m',
      description: 'Живая датская ёлка пихта Нордмана, срезанная. Высота 2,0-2,2 метра. Для просторных помещений.',
      price: 519.00,
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800',
      categoryId: category7.id,
    },
    {
      name: 'Живая датская ёлка (пихта Нордмана, срезанная) 2,2-2,5м',
      slug: 'zhivaya-datskaya-elka-2-2-2-5m',
      description: 'Живая датская ёлка пихта Нордмана, срезанная. Высота 2,2-2,5 метра. Величественная красота.',
      price: 638.00,
      image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
      categoryId: category8.id,
    },
    {
      name: 'Живая датская ёлка (пихта Нордмана, срезанная) 2,5-3,0м',
      slug: 'zhivaya-datskaya-elka-2-5-3-0m',
      description: 'Живая датская ёлка пихта Нордмана, срезанная. Высота 2,5-3,0 метра. Максимальный размер.',
      price: 774.00,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
      categoryId: category9.id,
    },
    // Подставки и аксессуары
    {
      name: 'Жидкость для срезанных елей/пихт Bona Forte 285мл',
      slug: 'zhidkost-dlya-srezannyh-eley-piht-bona-forte-285ml',
      description: 'Жидкость Bona Forte предназначена для продления жизни новогодних елок, пихт, туй. Средство содержит полный комплекс веществ, помогающих сохранить свежесть хвойных растений на долгое время.',
      price: 30.00,
      image: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800',
      categoryId: category2.id,
    },
    {
      name: 'Подставка для ели Вулкан-2, 12см',
      slug: 'podstavka-dlya-eli-vulkan-2-12sm',
      description: 'Надёжная подставка для ёлки Вулкан-2 диаметром 12 см. Обеспечивает устойчивость и безопасность.',
      price: 60.00,
      image: 'https://images.unsplash.com/photo-1576086213369-97a306d3655b?w=800',
      categoryId: category2.id,
    },
    {
      name: 'Подставка для ели Вулкан-XXL, 16см',
      slug: 'podstavka-dlya-eli-vulkan-xxl-16sm',
      description: 'Большая подставка для ёлки Вулкан-XXL диаметром 16 см. Для высоких и крупных ёлок.',
      price: 260.00,
      image: 'https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800',
      categoryId: category2.id,
    },
    {
      name: 'Ветки живой датской пихты (лапник Нордмана) 5 кг',
      slug: 'vetki-zhivoy-datskoy-pihty-lapnik-nordmana-5kg',
      description: 'Свежие ветки живой датской пихты Нордмана. Идеальны для декорации и создания атмосферы. Вес 5 кг.',
      price: 45.00,
      image: 'https://images.unsplash.com/photo-1482517967863-00e15c9b44be?w=800',
      categoryId: category2.id,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { slug: product.slug },
      update: {},
      create: product,
    })
  }

  console.log('✅ Товары созданы')
  console.log('🎉 Посев данных завершён!')
}

main()
  .catch((e) => {
    console.error('❌ Ошибка при посеве данных:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

