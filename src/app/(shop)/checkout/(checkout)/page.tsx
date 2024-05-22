import Link from 'next/link'

import { Title } from '@/components'
import { initialData } from '@/seed/seed'
import Image from 'next/image'
import { ProductsInCart } from './ui/ProductsInCart'
import { PlaceOrder } from './ui/PlaceOrder'

const productsInCart = [
  initialData.products[0],
  initialData.products[1],
  initialData.products[2],
]

export default function CheckoutPage() {
  return (
    <div className="flex justify-center items-center mb-72 px-10 sm:px-0">
      <div className="flex flex-col w-[1000px]">
        <Title title="Verificar orden" />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {/* Carrito */}
          <div className="flex flex-col mt-5">
            <span className="text-xl">Ajustar elementos</span>
            <Link
              href="/cart"
              className="underline mb-5"
            >
              Editar carrito
            </Link>

            {/* Items */}
            <ProductsInCart />
            {/* {productsInCart.map((product) => (
              <div
                key={product.slug}
                className="flex mb-5"
              >
                <Image
                  src={`/products/${product.images[0]}`}
                  width={100}
                  height={100}
                  style={{
                    width: '100px',
                    height: '100px',
                  }}
                  alt={product.title}
                  className="mr-5 rounded"
                />

                <div>
                  <p>{product.title}</p>
                  <p>${product.price} x 3</p>
                  <p className="font-bold">Subtotal: ${product.price * 3}</p>
                </div>
              </div>
            ))} */}
          </div>

          {/* Checkout - Resumen de orden */}
          <PlaceOrder />
        </div>
      </div>
    </div>
  )
}
