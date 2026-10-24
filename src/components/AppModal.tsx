import React, { useEffect } from 'react'
import { FaTimes, FaUser, FaRulerCombined } from 'react-icons/fa'

interface MeasurementModalProps {
    isOpen: boolean
    onClose: () => void
    customerName: string
    measurement?: string
}

const MeasurementModal: React.FC<MeasurementModalProps> = ({
    isOpen,
    onClose,
    customerName,
    measurement,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const measurements = measurement
        ? measurement
            .split('|')
            .map((item) => {
                const separatorIndex = item.indexOf(':')

                if (separatorIndex === -1) {
                    return { key: item.trim(), value: '' }
                }

                const rawValue = item.slice(separatorIndex + 1).trim()
                const formattedValues = rawValue
                    .split(/[\s,]+/)
                    .map((val) => val.trim())
                    .filter(Boolean)
                    .join(' | ')

                return {
                    key: item.slice(0, separatorIndex).trim(),
                    value: formattedValues,
                }
            })
            .filter((item) => item.key)
        : []

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fadeIn"
            onClick={onClose}
        >
            <div
                className="relative flex max-h-[90vh] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 pb-3">
                    <div className="flex items-center gap-2 text-base font-bold text-purple-700">
                        <FaRulerCombined />
                        <span>માપની વિગતો</span>
                    </div>

                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>
                <div className="my-4 space-y-4 overflow-y-auto pr-1">
                    <div className="flex items-center gap-3 rounded-2xl border border-purple-100 bg-purple-50/70 p-3.5">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-600 font-bold text-white shadow-md shadow-purple-600/20">
                            <FaUser size={16} />
                        </div>

                        <div>
                            <span className="block text-[11px] font-semibold uppercase tracking-wider text-purple-600">
                                ગ્રાહકનું નામ:
                            </span>
                            <h3 className="text-base font-bold leading-tight text-gray-900">
                                {customerName || 'ગ્રાહક'}
                            </h3>
                        </div>
                    </div>
                    <div>
                        <label className="mb-3 block text-xs font-semibold uppercase tracking-wider text-gray-500">
                            માપ (Measurement Details):
                        </label>

                        {measurements.length > 0 ? (
                            <div className="grid grid-cols-1 gap-3">
                                {measurements.map((item, index) => (
                                    <div
                                        key={`${item.key}-${index}`}
                                        className="rounded-xl border border-purple-100 bg-purple-50 p-3"
                                    >
                                        <p className="mb-1 break-words text-xs font-semibold text-purple-600">
                                            {item.key}
                                        </p>

                                        <p className="break-words text-base font-bold text-gray-900">
                                            {item.value || '-'}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-gray-200 bg-slate-50 px-4 py-6 text-center text-sm text-gray-500">
                                કોઈ માપ ઉપલબ્ધ નથી
                                <p className="mt-1 text-xs">
                                    No measurements recorded
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MeasurementModal