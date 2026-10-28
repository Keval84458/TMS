import { useEffect, useState } from 'react'
import { FaCheckCircle } from 'react-icons/fa'
import { IoCloseCircle, IoInformationCircle } from 'react-icons/io5'
import { MdWarning } from 'react-icons/md'
import { createGlobalState } from 'react-use'


type ToastType = 'S' | 'E' | 'W' | 'info'

interface ToastState {
    show: boolean
    type: ToastType
    msg: string
}

interface CustomToastProps {
    autoCloseTime?: number
}

export const useGlobalToast = createGlobalState<ToastState>({
    show: false,
    type: 'info',
    msg: '',
})

const CustomToast = ({ autoCloseTime = 3000 }: CustomToastProps) => {
    const [toastState, setToastState] = useGlobalToast()
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const hideToast = () => {
        setToastState({ show: false, type: 'info', msg: '' })
    }

    useEffect(() => {
        if (!toastState.show || isHovered) return
        let remainingTime = autoCloseTime

        const timer = setTimeout(hideToast, remainingTime)

        return () => clearTimeout(timer)
    }, [toastState.show, isHovered, autoCloseTime])

    const getThemeStyles = () => {
        switch (toastState.type) {
            case 'S':
                return {
                    bg: 'bg-emerald-950/90 border-emerald-500/40 text-emerald-100',
                    badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                    bar: 'bg-emerald-500',
                    icon: <FaCheckCircle />,
                    title: 'Success',
                }
            case 'E':
                return {
                    bg: 'bg-rose-950/90 border-rose-500/40 text-rose-100',
                    badge: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
                    bar: 'bg-rose-500',
                    icon: <IoCloseCircle />,
                    title: 'Error',
                }
            case 'W':
                return {
                    bg: 'bg-amber-950/90 border-amber-500/40 text-amber-100',
                    badge: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
                    bar: 'bg-amber-500',
                    icon: <MdWarning />,
                    title: 'Warning',
                }
            default:
                return {
                    bg: 'bg-slate-900/90 border-slate-700/50 text-slate-100',
                    badge: 'bg-slate-700/30 text-slate-400 border-slate-700/50',
                    bar: 'bg-slate-400',
                    icon: <IoInformationCircle />,
                    title: 'Info',
                }
        }
    }

    const theme = getThemeStyles()

    if (!toastState.show) return null

    return (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-[1000] w-full max-w-md px-4 pointer-events-none">
            <div
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className={`pointer-events-auto relative overflow-hidden backdrop-blur-md border rounded-2xl p-4 shadow-2xl transition-all duration-300 ease-out transform ${toastState.show ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-4 opacity-0 scale-95'
                    } ${theme.bg}`}
            >
                <div className="flex items-center gap-3">

                    <div className={`p-1.5 rounded-md text-md font-semibold uppercase tracking-wide border ${theme.badge}`}>
                        {theme.icon}
                    </div>

                    <div className="flex-1 text-sm font-medium leading-relaxed pt-0.5">
                        {toastState.msg}
                    </div>

                    <button
                        onClick={hideToast}
                        className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                        aria-label="Close toast"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 overflow-hidden">
                    <div
                        className={`h-full ${theme.bar} ${!isHovered ? 'transition-all ease-linear' : ''}`}
                        style={{
                            transitionDuration: !isHovered ? `${autoCloseTime}ms` : '0ms',
                            width: isHovered ? '100%' : '0%'
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default CustomToast