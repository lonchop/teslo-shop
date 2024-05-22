import prisma from '../lib/prisma'
import { initialData } from './seed'
import { countries } from './seed-countries'

async function main() {
  // * 1.Borrar registros previos
  // await Promise.all([
  //   prisma.productImage.deleteMany(),
  //   prisma.product.deleteMany(),
  //   prisma.category.deleteMany(),
  // ])

  // * Borrar por orden de relación
  await prisma.orderAddress.deleteMany()
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()

  await prisma.userAddress.deleteMany()
  await prisma.user.deleteMany()
  await prisma.country.deleteMany()

  await prisma.productImage.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // * 2. Agregar datos
  // * Categories
  const { categories, products, users } = initialData

  await prisma.user.createMany({
    data: users,
  })

  await prisma.country.createMany({
    data: countries,
  })

  const categoriesData = categories.map((category) => ({
    name: category,
  }))

  await prisma.category.createMany({
    data: categoriesData,
  })

  const categoriesDB = await prisma.category.findMany()

  const categoriesMap = categoriesDB.reduce((map, category) => {
    map[category.name.toLowerCase()] = category.id
    return map
  }, {} as Record<string, string>) // <string=shirt, string=categoryID>

  console.log(categoriesMap)
  // await prisma.category.create({
  //   data: {
  //     name: 'Shirts',
  //   },
  // })

  // * Products
  products.forEach(async (product) => {
    const { type, images, ...rest } = product

    const productDB = await prisma.product.create({
      data: {
        ...rest,
        categoryId: categoriesMap[type],
      },
    })

    // * Images
    const imagesData = images.map((image) => ({
      url: image,
      productId: productDB.id,
    }))

    await prisma.productImage.createMany({
      data: imagesData,
    })
  })

  // const { images, type, ...product1 } = products[0]

  // await prisma.product.create({
  //   data: {
  //     ...product1,
  //     categoryId: categoriesMap['shirts'],
  //   },
  // })

  console.log('Seed ejecutado correctamente')
}

;(() => {
  if (process.env.NODE_ENV === 'production') return

  main()
})()
