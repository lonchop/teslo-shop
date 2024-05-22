export const revalidate = 60 // 60 segundos

import { getPaginatedProductsWithImages } from '@/actions'
import { Pagination, ProductGrid, Title } from '@/components'
// import { Category } from '@/interfaces'
import { initialData } from '@/seed/seed'
import { Gender } from '@prisma/client'
import { notFound, redirect } from 'next/navigation'

interface Props {
  params: {
    gender: string
  }
  searchParams: {
    page?: string
  }
}

// const seedProducts = initialData.products

export default async function CategoryPage({ params, searchParams }: Props) {
  const { gender } = params

  const page = searchParams.page ? parseInt(searchParams.page) : 1

  const { products, currentPage, totalPages } =
    await getPaginatedProductsWithImages({ page, gender: gender as Gender })

  if (products.length === 0) {
    redirect('/gender/${gender}')
  }

  // const products = seedProducts.filter((product) => product.gender === gender)

  const labels: Record<string, string> = {
    men: 'hombre',
    women: 'mujeres',
    kid: 'niños',
    unisex: 'todos',
  }

  // if (id === 'kids') {
  //   notFound()
  // }

  return (
    <div>
      <Title
        title={`Artículos para ${labels[gender]}`}
        subtitle="Todos los productos"
        className="mb-2"
      />
      <ProductGrid products={products} />

      <Pagination totalPages={totalPages} />
    </div>
  )
}
