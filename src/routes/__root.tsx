
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
import { supabase } from '#/lib/supabaseClient'
import { TanStackDevtools } from '@tanstack/react-devtools'
import CustomToast from '#/components/CustomeToast'
import NotFoundComponent from '#/components/not-found'

type AuthCredentials = {
  id: string
  token: string
}

const COOKIE_NAME = 'authData'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7

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

function writeAuthCookie(authData: AuthCredentials) {
  document.cookie = `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(authData))}; Path=/; Max-Age=${COOKIE_MAX_AGE}; SameSite=Lax`
}

function clearAuthCookie() {
  document.cookie = `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`
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
  beforeLoad: async ({ location }) => {
    let authData = getAuthToken()

    // The cookie alone can outlive the real Supabase session, so verify it.
    // getSession() reads local storage and refreshes an expired access token.
    if (authData) {
      try {
        const { data, error } = await supabase.auth.getSession()
        const session = data.session

        if (session) {
          // keep the cookie in sync with the (possibly refreshed) session
          if (
            session.access_token !== authData.token ||
            session.user.id !== authData.id
          ) {
            authData = { id: session.user.id, token: session.access_token }
            writeAuthCookie(authData)
          }
        } else if (!error) {
          // session is really gone -> treat as logged out
          clearAuthCookie()
          authData = null
        }
        // if there was an error (e.g. offline), keep the cookie and let the app load
      } catch {
        // ignore: keep the cookie-based state
      }
    }

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
