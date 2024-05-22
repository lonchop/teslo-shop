'use server'

import { auth } from '@/auth.config'
import type { Address } from '@/interfaces'
import prisma from '@/lib/prisma'
import { Size } from '@prisma/client'
import { ok } from 'assert'

interface ProductToOrder {
  productId: string
  quantity: number
  size: Size
}

export const placeOrder = async (
  productIds: ProductToOrder[],
  address: Address
) => {
  const session = await auth()

  const userId = session?.user.id

  // * Verificar si hay una sesión de usuario
  if (!userId) {
    return {
      ok: false,
      message: 'No hay sesión de usuario',
    }
  }

  // * Obtener la información de los productos
  // * Nota: Recuerden que podemos llevar 2+ productos en el carrito con el mismo id pero con tallas diferentes con el mismo ID

  const products = await prisma.product.findMany({
    where: {
      id: {
        in: productIds.map((product) => product.productId),
      },
    },
  })

  // console.log(products)

  // * Calcular los montos // Encabezado
  const itemsInOrder = productIds.reduce(
    (count: any, product: any) => count + product.quantity,
    0
  )

  // console.log({ itemsInOrder })

  // * Los totales de tax, subtotal y total
  const { subTotal, tax, total } = productIds.reduce(
    (totals: any, item: any) => {
      const productQuantity = item.quantity

      const product = products.find((product) => product.id === item.productId)

      if (!product) throw new Error(`${item.productId} no existe - 500`)

      const subTotal = product.price * productQuantity

      totals.subTotal += subTotal
      totals.tax += subTotal * 0.15
      totals.total += subTotal * 1.15

      return totals
    },
    { subTotal: 0, tax: 0, total: 0 }
  )

  console.log({ subTotal, tax, total })

  // * Crear la transacción de base de datos

  try {
    const prismaTx = await prisma.$transaction(async (tx) => {
      // * 1. Actualizar el stock de los productos
      const updatedProductsPromises = products.map((product) => {
        // * Acumular los valores
        const productQuantity = productIds
          .filter((p) => p.productId === product.id)
          .reduce((acc, item) => acc + item.quantity, 0)

        if (productQuantity === 0) {
          throw new Error(`${product.id} no tiene cantidad definida`)
        }

        return tx.product.update({
          where: { id: product.id },
          data: {
            // inStock: product.inStock - productQuantity // no hacer
            inStock: {
              decrement: productQuantity,
            },
          },
        })
      })

      const updatedProducts = await Promise.all(updatedProductsPromises)

      // * Verificar valores negativos en las existencias = no hay stock
      updatedProducts.forEach((product) => {
        if (product.inStock < 0) {
          throw new Error(`${product.title} no tiene inventario suficiente`)
        }
      })

      // * 2. Crear la orden - Encabezado - Detalle
      if (itemsInOrder === 0) {
        throw new Error('No hay productos en la orden')
      }
      const order = await tx.order.create({
        data: {
          userId: userId,
          itemsInOrder: itemsInOrder,
          subTotal: subTotal,
          tax: tax,
          total: total,

          OrderItem: {
            createMany: {
              data: productIds.map((p) => ({
                productId: p.productId,
                quantity: p.quantity,
                size: p.size,
                price:
                  products.find((product) => product.id === p.productId)
                    ?.price ?? 0,
              })),
            },
          },
        },
      })

      // * Validar, si el price es cero, entonces, lanzar un error

      // * 3. Crear la dirección de la orden
      // * Address
      const { country, ...restAddress } = address
      const orderAddress = await tx.orderAddress.create({
        data: {
          firstName: address.firstName,
          lastName: address.lastName,
          address: address.address,
          address2: address.address2,
          postalCode: address.postalCode,
          city: address.city,
          phone: address.phone,
          countryId: country,
          orderId: order.id,
        },
      })

      return {
        updatedProducts: updatedProducts,
        order: order,
        orderAddress: orderAddress,
      }
    })

    return {
      ok: true,
      order: prismaTx.order,
      prismaTx: prismaTx,
    }
  } catch (error: any) {
    return {
      ok: false,
      message: error?.message,
    }
  }

  // console.log({ productIds, address, userId })
}
