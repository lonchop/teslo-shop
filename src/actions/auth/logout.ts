'use server'

import { signOut } from '@/auth.config'
import { redirect } from 'next/navigation'

export const logout = async () => {
  console.log('Logging out...')
  try {
    await signOut({ redirect: false })
    console.log('Logged out successfully.')
    redirect('/')
  } catch (error) {
    console.error('Error al cerrar sesión:', error)
  }
}
