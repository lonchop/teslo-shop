'use server'

import { signIn } from '@/auth.config'
import { sleep } from '@/utils'
import { AuthError } from 'next-auth'

export async function authenticate(
  prevState: string | undefined,
  formData: FormData
) {
  try {
    // console.log({ formData: Object.fromEntries(formData) })

    // sleep(4)

    await signIn('credentials', {
      ...Object.fromEntries(formData),
      redirect: false,
    })

    return 'Success'
  } catch (error) {
    // if ((error as any).type === 'CredentialsSignin') {
    //   return 'CredentialsSignin'
    // }

    // console.log(error)

    // return 'Unknown error'

    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return 'CredentialsSignin'
        default:
          return 'Unknown error'
      }
    }
    // throw error
  }
}

export const login = async (email: string, password: string) => {
  try {
    await signIn('credentials', {email, password})

    return {
      ok: true,
      message: 'Usuario autenticado correctamente'
    }
  } catch (error) {
    console.log(error)
    return {
      ok: false,
      message: 'No se pudo iniciar sesión'
    }
  }
}