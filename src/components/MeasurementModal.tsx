import React, { useEffect, useMemo } from 'react'
import { FaTimes, FaUser, FaRulerCombined, FaMale, FaFemale } from 'react-icons/fa'

type MeasurementMap = Record<string, unknown> | null | undefined
type Gender = 'male' | 'female'

interface MeasurementModalProps {
    isOpen: boolean
    onClose: () => void
    customerName: string
    gender?: string
    maleMeasurements?: MeasurementMap
    femaleMeasurements?: MeasurementMap
}

const OTHER_KEY = 'other'
const toItems = (value: MeasurementMap): { key: string; value: string }[] => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return []

    const items = Object.entries(value)
        .map(([key, val]) => ({
            key: key.trim(),
            value: val == null ? '' : String(val).trim(),
        }))
        .filter((item) => item.key && item.value)

    return [
        ...items.filter((i) => i.key.toLowerCase() !== OTHER_KEY),
        ...items.filter((i) => i.key.toLowerCase() === OTHER_KEY),
    ]
}

const SECTION_META: Record<Gender, { title: string; subtitle: string; Icon: React.ElementType }> = {
    male: { title: 'પુરુષ માપ', subtitle: 'Male Measurements', Icon: FaMale },
    female: { title: 'સ્ત્રી માપ', subtitle: 'Female Measurements', Icon: FaFemale },
}

const MeasurementModal: React.FC<MeasurementModalProps> = ({
    isOpen,
    onClose,
    customerName,
    gender,
    maleMeasurements,
    femaleMeasurements,
}) => {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) onClose()
        }
        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [isOpen, onClose])

    const sections = useMemo(() => {
        const list: { gender: Gender; items: { key: string; value: string }[] }[] = [
            { gender: 'male', items: toItems(maleMeasurements) },
            { gender: 'female', items: toItems(femaleMeasurements) },
        ]
        if (gender === 'female') list.reverse()
        return list.filter((s) => s.items.length > 0)
    }, [maleMeasurements, femaleMeasurements, gender])

    if (!isOpen) return null

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
                        type="button"
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-700"
                        aria-label="Close"
                    >
                        <FaTimes size={16} />
                    </button>
                </div>

                <div className="my-4 space-y-5 overflow-y-auto pr-1">
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

                    {sections.length > 0 ? (
                        sections.map(({ gender: g, items }) => {
                            const { title, subtitle, Icon } = SECTION_META[g]
                            return (
                                <div key={g}>
                                    <div className="mb-3 flex items-center gap-2">
                                        <Icon className="text-purple-600" />
                                        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                                            {title} ({subtitle})
                                        </label>
                                    </div>

                                    <div className="grid grid-cols-1 gap-3">
                                        {items.map((item) => {
                                            const formattedValue = item.value
                                                .split(/\s+/)
                                                .filter(Boolean)
                                                .join(' | ')

                                            return (
                                                <div
                                                    key={`${g}-${item.key}`}
                                                    className="rounded-xl border border-purple-100 bg-purple-50 p-3"
                                                >
                                                    <p className="mb-1 break-words text-xs font-semibold text-purple-600">
                                                        {item.key.toLowerCase() === OTHER_KEY
                                                            ? 'અન્ય નોંધ (Other)'
                                                            : item.key}
                                                    </p>
                                                    <p className="whitespace-pre-wrap break-words text-base font-bold text-gray-900">
                                                        {formattedValue}
                                                    </p>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="rounded-2xl border border-gray-200 bg-slate-50 px-4 py-6 text-center text-sm text-gray-500">
                            કોઈ માપ ઉપલબ્ધ નથી
                            <p className="mt-1 text-xs">No measurements recorded</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MeasurementModal