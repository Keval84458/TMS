import React from 'react'
import { useTranslation } from 'react-i18next'
import { FaExclamationTriangle } from 'react-icons/fa'

export interface ConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: React.ReactNode
    message?: React.ReactNode
    confirmText?: string
    cancelText?: string
    icon?: React.ComponentType<{ size?: number }>
    variant?: 'D' | 'W' | 'I' | 'S'
    isLoading?: boolean
}

const variantStyles = {
    D: {
        iconBg: 'bg-red-100 text-red-600',
        confirmBtn: 'bg-red-600 hover:bg-red-700 shadow-red-600/30 text-white',
    },
    W: {
        iconBg: 'bg-amber-100 text-amber-600',
        confirmBtn: 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30 text-white',
    },
    I: {
        iconBg: 'bg-blue-100 text-blue-600',
        confirmBtn: 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30 text-white',
    },
    S: {
        iconBg: 'bg-emerald-100 text-emerald-600',
        confirmBtn: 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30 text-white',
    },
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'हा, ડિલીટ કરો',
    cancelText = 'ના (Cancel)',
    icon: Icon = FaExclamationTriangle,
    variant = 'D',
    isLoading = false,
}) => {
    const { t } = useTranslation()

    if (!isOpen) return null
    const styles = variantStyles[variant] || variantStyles.D

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl text-center space-y-4">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className="text-base font-bold text-gray-900">{title}</h3>
                    {/* {message && <p className="mt-1 text-xs text-gray-500">{message}</p>} */}
                </div>
                <div className="flex gap-3 pt-2">
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onClose}
                        className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>
                    <button
                        type="button"
                        disabled={isLoading}
                        onClick={onConfirm}
                        className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-colors shadow-md disabled:opacity-50 flex items-center justify-center gap-2 ${styles.confirmBtn}`}
                    >
                        {isLoading ? 'प्रक्रिया ચાલુ છે...' : confirmText}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmModal