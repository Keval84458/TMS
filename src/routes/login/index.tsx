import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '#/lib/supabaseClient'
import { PAGE_PATH_KEYS } from '#/utils/constant'
import { FaCut, FaRuler } from 'react-icons/fa'
import { IoShirtSharp } from "react-icons/io5";
import { GiSewingMachine } from "react-icons/gi";
import { useGlobalToast } from '#/components/CustomeToast'
import LoginForm from './layouts/login-form'
import { useTranslation } from 'react-i18next'
import { useAuth } from '#/utils/auth'

export const Route = createFileRoute('/login/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const { t } = useTranslation()
    const { setAuthCred } = useAuth()

    const initialData = {
        email: '',
        password: '',
    }

    const [formData, setFormData] = useState(initialData)
    const [isLoading, setIsLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [, setToastState] = useGlobalToast()

    const onChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const HandleSubmit = async (e?: React.FormEvent) => {
        e?.preventDefault()
        if (isLoading) return

        const email = formData.email.trim()

        if (!email) {
            setToastState({
                show: true,
                type: 'W',
                msg: t('SiteMessageWithLanguages.FILL_EMAIL')
            })
            return
        } else if (!formData.password.trim()) {
            setToastState({
                show: true,
                type: 'W',
                msg: t('SiteMessageWithLanguages.FILL_PASSWORD')
            })
            return
        }
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password: formData.password,
            })

            if (error) {
                // Wrong credentials -> translated message; anything else (network, rate limit...) -> generic retry message.
                const isCredentialError =
                    error.code === 'invalid_credentials' ||
                    error.status === 400 ||
                    error.status === 401

                setToastState({
                    show: true,
                    type: 'E',
                    msg: isCredentialError
                        ? t('SiteMessageWithLanguages.INVALID_CREDENTIALS')
                        : t('SiteMessageWithLanguages.TRY_AGAIN')
                })
                return
            }

            if (!data.session) {
                // e.g. email confirmation required: no session was created
                setToastState({
                    show: true,
                    type: 'E',
                    msg: t('SiteMessageWithLanguages.TRY_AGAIN')
                })
                return
            }

            setAuthCred({
                id: data.user.id,
                token: data.session.access_token,
            })

            setToastState({
                show: true,
                type: 'S',
                msg: t('SiteMessageWithLanguages.LOGIN_SUCCESSFULLY')
            })

            setFormData(initialData)

            navigate({ to: PAGE_PATH_KEYS.HOME })
        } catch (err) {
            console.error('Login failed:', err)
            setToastState({
                show: true,
                type: 'E',
                msg: t('SiteMessageWithLanguages.TRY_AGAIN')
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="relative min-h-dvh w-full bg-slate-100 flex items-center justify-center p-4 overflow-x-hidden">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none select-none" />

            <div className="absolute top-10 left-[3rem] text-purple-600/30 text-5xl animate-[spin_10s_linear_infinite] pointer-events-none select-none">
                <IoShirtSharp />
            </div>
            <div className="absolute top-16 right-[3rem] text-purple-600/30 text-5xl animate-[spin_10s_linear_infinite] pointer-events-none select-none">
                <FaCut />
            </div>
            <div className="absolute bottom-20 right-1/4 text-indigo-600/30 text-5xl animate-[bounce_4s_infinite] pointer-events-none select-none">
                <FaRuler />
            </div>
            <div className="absolute bottom-30 left-[3rem] text-indigo-600/30 text-5xl animate-[bounce_4s_infinite] pointer-events-none select-none">
                <GiSewingMachine />
            </div>

            <div className="w-full mt-[-4rem] md:mt-[0] max-w-lg bg-white rounded-3xl shadow-md overflow-hidden border border-purple-100 relative z-10 transition-all duration-300">
                <div className="h-3 bg-amber-300 w-full flex items-center justify-between px-1 overflow-hidden border-b border-amber-400 select-none">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className={`w-[1px] bg-amber-800 ${i % 5 === 0 ? 'h-full' : 'h-1.5'}`} />
                    ))}
                </div>

                <div className="p-8 sm:p-12">
                    <div className="text-center mb-8 select-none">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold mb-3">
                            <FaCut className="animate-pulse" />
                            <span>Tailor System by Keval Makvana</span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            {t('Login.LoginTitle', 'LOGIN')}
                        </h2>
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                            {t('Login.SubTitle', "Enter Email and Password to Logged In")}
                        </p>
                    </div>

                    <LoginForm
                        formData={formData}
                        onChange={onChange}
                        showPassword={showPassword}
                        setShowPassword={setShowPassword}
                        isLoading={isLoading}
                        HandleSubmit={HandleSubmit}
                    />
                </div>
            </div>
        </div>
    )
}
