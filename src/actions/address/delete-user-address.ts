'use server'

import prisma from '@/lib/prisma'

export const deleteUserAddress = async (userId: string) => {
  try {
    const deleted = await prisma.userAddress.delete({
      where: { userId },
    })

    return {
      ok: true,
      message: 'Dirección borrada con éxito',
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo eliminar la dirección',
    }
  }
}
