
import { useRouterState, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { PAGE_PATH_KEYS } from '@/utils/constant'

type AuthCredentials = {
    id: string
    token: string
}

type AuthState = {
    authData: AuthCredentials | null
    isLogin: boolean
}

const COOKIE_NAME = 'authData'

const getAuthData = (): AuthCredentials | null => {
    const cookie = document.cookie
        .split('; ')
        .find((item) => item.startsWith(`${COOKIE_NAME}=`))

    if (!cookie) return null

    try {
        const value = cookie.substring(COOKIE_NAME.length + 1)
        const parsed = JSON.parse(value)

        if (
            typeof parsed.id !== 'string' ||
            typeof parsed.token !== 'string' ||
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

export const useAuth = () => {
    const [auth, setAuth] = useState<AuthState>(() => {
        const authData = getAuthData()

        return {
            authData,
            isLogin: Boolean(authData?.id && authData?.token),
        }
    })

    const navigate = useNavigate()

    const pathname = useRouterState({
        select: (state) => state.location.pathname,
    })

    useEffect(() => {
        const isLoginPage =
            pathname === PAGE_PATH_KEYS.LOGIN

        if (!auth.isLogin && !isLoginPage) {
            void navigate({
                to: PAGE_PATH_KEYS.LOGIN,
                replace: true,
            })
        } else if (auth.isLogin && isLoginPage) {
            void navigate({
                to: PAGE_PATH_KEYS.HOME,
                replace: true,
            })
        }
    }, [pathname, auth.isLogin, navigate])

    const logout = () => {
        document.cookie =
            `${COOKIE_NAME}=; max-age=0; path=/; SameSite=Lax`

        setAuth({
            authData: null,
            isLogin: false,
        })

        void navigate({
            to: PAGE_PATH_KEYS.LOGIN,
            replace: true,
        })
    }

    return {
        auth,
        logout,
    }
}
