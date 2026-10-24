
import {
  Outlet,
  createRootRoute,
  redirect,
  useRouterState,
} from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import '../styles.css'

import Header from '#/components/Header'
import { PAGE_PATH_KEYS } from '#/utils/constant'
import { ToastContainer } from 'react-toastify'

type AuthCredentials = {
  id: string
  token: string
}

function getAuthToken(): AuthCredentials | null {
  if (typeof document === 'undefined') return null

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith('authData='))

  if (!cookie) return null

  const value = cookie.substring('authData='.length)

  try {
    let parsed: AuthCredentials

    try {
      parsed = JSON.parse(decodeURIComponent(value))
    } catch {
      parsed = JSON.parse(value)
    }

    if (
      typeof parsed.id !== 'string' ||
      typeof parsed.token !== 'string' ||
      !parsed.id ||
      !parsed.token
    ) {
      return null
    }

    return parsed
  } catch {
    return null
  }
}

function RootComponent() {
  const pathname = useRouterState({
    select: (state) => state.location.pathname,
  })

  const isLoginPage = pathname === PAGE_PATH_KEYS.LOGIN

  return (
    <>
      {!isLoginPage && <Header />}

      <Outlet />

      <ToastContainer />

      <TanStackDevtools
        config={{ position: 'bottom-right' }}
        plugins={[
          {
            name: 'TanStack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
        ]}
      />
    </>
  )
}

export const Route = createRootRoute({
  beforeLoad: ({ location }) => {
    const authData = getAuthToken()
    const isAuthenticated = Boolean(authData?.id && authData?.token)
    const isLoginPage =
      location.pathname === PAGE_PATH_KEYS.LOGIN

    if (!isAuthenticated && !isLoginPage) {
      throw redirect({
        to: PAGE_PATH_KEYS.LOGIN,
        replace: true,
      })
    }

    if (isAuthenticated && isLoginPage) {
      throw redirect({
        to: PAGE_PATH_KEYS.HOME,
        replace: true,
      })
    }
  },

  component: RootComponent,
})
