
import {
  Outlet,
  createRootRoute,
  redirect,
  useRouterState,
} from '@tanstack/react-router'

import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'

import '../styles.css'

import Header from '#/components/Header'
import { PAGE_PATH_KEYS } from '#/utils/constant'
import { TanStackDevtools } from '@tanstack/react-devtools'
import CustomToast from '#/components/CustomeToast'
import NotFoundComponent from '#/components/not-found'

type AuthCredentials = {
  id: string
  token: string
}

const COOKIE_NAME = 'authData'

function getAuthToken(): AuthCredentials | null {
  if (typeof document === 'undefined') return null

  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${COOKIE_NAME}=`))

  if (!cookie) return null

  try {
    const value = decodeURIComponent(
      cookie.substring(COOKIE_NAME.length + 1),
    )

    const parsed = JSON.parse(value)

    if (
      typeof parsed?.id !== 'string' ||
      typeof parsed?.token !== 'string' ||
      !parsed.id ||
      !parsed.token
    ) {
      return null
    }

    return {
      id: parsed.id,
      token: parsed.token,
    }
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
      <CustomToast autoCloseTime={4000} />

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

    const isAuthenticated = Boolean(
      authData?.id && authData?.token,
    )

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

  notFoundComponent: NotFoundComponent,
})
