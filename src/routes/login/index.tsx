import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { supabase } from '#/lib/supabaseClient'
import { ThemeInput } from '#/utils'
import { SITE_MESSAGES, PAGE_PATH_KEYS } from '#/utils/constant'
import { useNavigate } from '@tanstack/react-router'
import {
    FaEnvelope,
    FaLock,
    FaSignInAlt,
    FaSpinner,
    FaEye,
    FaEyeSlash,
    FaCut,
    FaRuler
} from 'react-icons/fa'
import { IoShirtSharp } from "react-icons/io5";
import { GiSewingMachine } from "react-icons/gi";
import { useGlobalToast } from '#/components/CustomeToast'

export const Route = createFileRoute('/login/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()

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

    const HandleSubmit = async () => {
        if (!formData.email.trim()) {
            setToastState({
                show: true,
                type: 'W',
                msg: SITE_MESSAGES.FILL_EMAIL,
            })
            return
        } else if (!formData.password.trim()) {
            setToastState({
                show: true,
                type: 'W',
                msg: SITE_MESSAGES.FILL_PASSWORD,
            })
            return
        }
        setIsLoading(true)

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            })

            if (error) {
                setToastState({
                    show: true,
                    type: 'E',
                    msg: error.message || SITE_MESSAGES.INVALID_CREDENTIALS,
                })
                return
            }

            if (data.session) {
                const authDetails = {
                    id: data.user.id,
                    token: data.session.access_token,
                }

                document.cookie = `authData=${JSON.stringify(authDetails)}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`

                setToastState({
                    show: true,
                    type: 'S',
                    msg: SITE_MESSAGES.LOGIN_SUCCESSFULLY,
                })
                setFormData(initialData)

                navigate({ to: PAGE_PATH_KEYS.HOME })
            }

        } catch {
            setToastState({
                show: true,
                type: 'E',
                msg: SITE_MESSAGES.TRY_AGAIN,
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="fixed inset-0 h-screen w-screen bg-slate-100 flex items-center justify-center p-4 overflow-hidden select-none">
            <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#9333ea_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

            <div className="absolute top-10 left-[3rem] text-purple-600/30 text-5xl animate-[spin_10s_linear_infinite] pointer-events-none">
                <IoShirtSharp />
            </div>
            <div className="absolute top-16 right-[3rem] text-purple-600/30 text-5xl animate-[spin_10s_linear_infinite] pointer-events-none">
                <FaCut />
            </div>
            <div className="absolute bottom-20 right-1/4 text-indigo-600/30 text-5xl animate-[bounce_4s_infinite] pointer-events-none">
                <FaRuler />
            </div>

            <div className="absolute bottom-30 left-[3rem] text-indigo-600/30 text-5xl animate-[bounce_4s_infinite] pointer-events-none">
                <GiSewingMachine />
            </div>

            <div className="w-full mt-[-4rem] md:mt-[0] max-w-lg bg-white rounded-3xl shadow-md overflow-hidden border border-purple-100 relative z-10 transition-all duration-300">
                <div className="h-3 bg-amber-300 w-full flex items-center justify-between px-1 overflow-hidden border-b border-amber-400">
                    {Array.from({ length: 40 }).map((_, i) => (
                        <div key={i} className={`w-[1px] bg-amber-800 ${i % 5 === 0 ? 'h-full' : 'h-1.5'}`} />
                    ))}
                </div>

                <div className="p-8 sm:p-12">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold mb-3">
                            <FaCut className="animate-pulse" />
                            <span>Tailor System by Keval Makvana</span>
                        </div>
                        <h2 className="text-3xl font-black text-gray-900 tracking-tight">
                            LOGIN
                        </h2>
                        <p className="text-xs text-gray-500 mt-2 font-medium">
                            લૉગ ઇન કરવા માટે તમારો ઇમેઇલ અને પાસવર્ડ દાખલ કરો
                        </p>
                    </div>

                    <div className="space-y-5">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaEnvelope className="text-purple-600" />
                                ઇમેઇલ (Email) <span className='text-error'>*</span>
                            </label>
                            <ThemeInput
                                type="email"
                                placeholder="દા.ત. Keval@gmail.com"
                                className="w-full h-[48px] px-4 bg-slate-50 border-gray-200 focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-100 rounded-xl transition-all text-sm"
                                value={formData.email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    onChange('email', e.target.value)
                                }
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaLock className="text-purple-600" />
                                પાસવર્ડ (Password) <span className='text-error'>*</span>
                            </label>
                            <div className="relative">
                                <ThemeInput
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="તમારો પાસવર્ડ દાખલ કરો"
                                    className="w-full h-[48px] pl-4 pr-11 bg-slate-50 border-gray-200 focus:bg-white focus:border-purple-600 focus:ring-4 focus:ring-purple-100 rounded-xl transition-all text-sm"
                                    value={formData.password}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        onChange('password', e.target.value)
                                    }
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword((prev) => !prev)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors p-1"
                                >
                                    {showPassword ? <FaEyeSlash className="text-[1.5rem]" /> : <FaEye className="text-[1.5rem]" />}
                                </button>
                            </div>
                        </div>

                        <div className="pt-3">
                            <button
                                type="button"
                                disabled={isLoading}
                                onClick={HandleSubmit}
                                className="w-full h-[50px] bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/25 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2.5 text-sm tracking-wide"
                            >
                                {isLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin text-lg" />
                                        <span>ચકાસણી થઈ રહી છે...</span>
                                    </>
                                ) : (
                                    <>
                                        <FaSignInAlt className="text-base" />
                                        <span>પ્રવેશ કરો (Login)</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}