
import { useNavigate } from '@tanstack/react-router'
import { useCallback, useState } from 'react'

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

        return { id: parsed.id, token: parsed.token }
    } catch {
        return null
    }
}

export const useAuth = () => {
    const navigate = useNavigate()

    const [auth, setAuth] = useState<AuthState>(() => {
        const authData = getAuthData()

        return {
            authData,
            isLogin: Boolean(authData?.id && authData?.token),
        }
    })

    const setAuthCred = useCallback(
        (authData: AuthCredentials) => {
            document.cookie =
                `${COOKIE_NAME}=${encodeURIComponent(JSON.stringify(authData))}; Path=/; SameSite=Lax`

            setAuth({
                authData,
                isLogin: Boolean(authData.id && authData.token),
            })
        },
        [],
    )

    const logout = useCallback(() => {
        // Clear authentication first.
        document.cookie =
            `${COOKIE_NAME}=; Max-Age=0; Path=/; SameSite=Lax`

        // Update this hook's state immediately.
        setAuth({
            authData: null,
            isLogin: false,
        })

        // Navigate without reloading the whole website.
        void navigate({
            to: '/login',
            replace: true,
        })
    }, [navigate])

    return {
        auth,
        setAuthCred,
        logout,
    }
}
