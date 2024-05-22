'use client'

import { QuantitySelector, SizeSelector } from '@/components'
import { CartProduct, Product, Size } from '@/interfaces'
import { useCartStore } from '@/store'
import { use, useState } from 'react'

interface Props {
  product: Product
}

export const AddToCart = ({ product }: Props) => {
  const addProductToCart = useCartStore((state) => state.addProductToCart)

  const [size, setSize] = useState<Size | undefined>()

  const [quantity, setQuantity] = useState<number>(1)

  const [posted, setPosted] = useState(false)

  const addToCart = () => {
    setPosted(true)
    if (!size) return

    // todo: Agregar al carrito
    const cartProduct: CartProduct = {
      id: product.id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      quantity: quantity,
      size: size,
      images: product.images[0],
    }

    addProductToCart(cartProduct)
    setPosted(false)
    setQuantity(1)
    setSize(undefined)
  }

  return (
    <>
      {posted && !size && (
        <span className="mt-2 text-red-500 fade-in">
          Debe de seleccionar un talla*
        </span>
      )}

      {/* Selector de Tallas */}
      <SizeSelector
        selectedSize={size}
        availableSizes={product.sizes}
        onSizeChanged={setSize}
        // Es lo mismo que hacer esto:
        // onSizeChanged={size => setSize(size)}
      />
      {/* Selector de Cantidad */}
      <QuantitySelector
        quantity={quantity}
        onQuantityChanged={setQuantity}
      />
      {/* Button */}
      <button
        className="btn-primary my-5"
        onClick={addToCart}
      >
        Agregar al carrito
      </button>
    </>
  )
}
