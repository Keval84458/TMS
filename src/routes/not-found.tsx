import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { FaHome, FaExclamationTriangle } from 'react-icons/fa'
import { PAGE_PATH_KEYS } from '#/utils/constant'

export const Route = createFileRoute('/not-found')({
    component: NotFoundComponent,
})

export function NotFoundComponent() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-sm border border-gray-100 p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-purple-50 text-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-inner">
                    <FaExclamationTriangle size={36} />
                </div>
                <div className="space-y-2">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">404</h1>
                    <h2 className="text-lg font-bold text-gray-800">પેજ મળ્યું નથી (Page Not Found)</h2>
                    <p className="text-xs text-gray-500 leading-relaxed px-4">
                        તમે જે પેજ શોધી રહ્યા છો તે કદાચ દૂર કરવામાં આવ્યું છે, તેનું નામ બદલાવવામાં આવ્યું છે અથવા તે હાલ ઉપલબ્ધ નથી.
                    </p>
                </div>
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={() => navigate({ to: PAGE_PATH_KEYS.HOME })}
                        className="w-full h-[46px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-purple-600/20 active:scale-[0.98] flex items-center justify-center gap-2 text-sm"
                    >
                        <FaHome className="text-base" />
                        <span>હોમ પેજ પર જાઓ (Back to Home)</span>
                    </button>
                </div>

            </div>
        </div>
    )
}