import { ThemeInput } from "#/utils"
import { FaEnvelope, FaEye, FaEyeSlash, FaLock, FaSignInAlt, FaSpinner } from "react-icons/fa"

interface LoginFormProps {
    formData: {
        email: string
        password: string
    }
    onChange: (key: string, value: string) => void
    showPassword: boolean
    setShowPassword: React.Dispatch<React.SetStateAction<boolean>>
    HandleSubmit: () => void
    isLoading?: boolean
}

const LoginForm = ({
    formData,
    onChange,
    showPassword,
    setShowPassword,
    HandleSubmit,
    isLoading,
}: LoginFormProps) => {
    return (
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
                        onClick={() => setShowPassword((prev: any) => !prev)}
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
    )
}

export default LoginForm