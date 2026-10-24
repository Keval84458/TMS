import React, { useState, useMemo, useEffect } from 'react'
import PageHeader from '#/components/PageHeader'
import { ThemeInput } from '#/utils'
import { PAGE_PATH_KEYS } from '#/utils/constant'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import {
    FaPhone,
    FaRulerCombined,
    FaUserPlus,
    FaEdit,
    FaTrash,
    FaSortAlphaDown,
    FaCalendarAlt,
    FaRupeeSign,
    FaCheckCircle,
    FaExclamationTriangle
} from 'react-icons/fa'
import { supabase } from '#/lib/supabaseClient'
import MeasurementModal from '#/components/AppModal'
import { toast } from 'react-toastify'

export const Route = createFileRoute('/cutomer-list/')({
    component: RouteComponent,
})

interface Customer {
    id: string | number
    customer_name: string
    phone: string
    city?: string
    gender?: string
    measurements?: Record<string, string> | string // JSONB અથવા String હોઈ શકે
    created_at?: string
    total_amount?: number | null
    advance_amount?: number | null
    pending_amount?: number | null
}

type SortType = 'newest' | 'oldest' | 'az'

const formatRupee = (value: number) => `₹${value.toLocaleString('en-IN')}`

function RouteComponent() {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [sortType, setSortType] = useState<SortType>('newest')
    const [onlyPending, setOnlyPending] = useState(false)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | number | null>(null)
    const [updateKey, setUpdateKey] = useState<number>(1)

    // Delete Confirmation Modal State
    const [deleteModalConfig, setDeleteModalConfig] = useState<{
        isOpen: boolean
        id: string | number | null
        name: string
    }>({
        isOpen: false,
        id: null,
        name: '',
    })

    const fetchCustomers = async () => {
        setIsLoading(true)
        try {
            let queryBuilder = supabase.from('customers').select('*')

            if (sortType === 'az') {
                queryBuilder = queryBuilder.order('customer_name', { ascending: true })
            } else if (sortType === 'oldest') {
                queryBuilder = queryBuilder.order('created_at', { ascending: true })
            } else {
                queryBuilder = queryBuilder.order('created_at', { ascending: false })
            }

            const { data, error } = await queryBuilder
            if (error) {
                toast.error('Error fetching customers:')
            } else if (data) {
                setCustomers(data as Customer[])
            }
        } catch (error) {
            toast.error('Error fetching customers')
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        fetchCustomers()
    }, [sortType])

    const filteredCustomers = useMemo(() => {
        let list = customers

        if (onlyPending) {
            list = list.filter((c) => Number(c.pending_amount) > 0)
        }

        if (!searchQuery.trim()) return list
        const query = searchQuery.toLowerCase()
        return list.filter(
            (c) =>
                c.customer_name?.toLowerCase().includes(query) ||
                c.phone?.includes(query) ||
                (c.city && c.city.toLowerCase().includes(query))
        )
    }, [searchQuery, customers, onlyPending])

    const totalPending = useMemo(
        () => filteredCustomers.reduce((sum, c) => sum + (Number(c.pending_amount) || 0), 0),
        [filteredCustomers]
    )

    const pendingCustomersCount = useMemo(
        () => customers.filter((c) => Number(c.pending_amount) > 0).length,
        [customers]
    )

    const confirmDelete = (id: string | number, name: string) => {
        setDeleteModalConfig({
            isOpen: true,
            id,
            name,
        })
    }

    const handleDelete = async () => {
        const { id } = deleteModalConfig
        if (!id) return

        const { error } = await supabase.from('customers').delete().eq('id', id)

        if (error) {
            toast.error(error.message)
            setDeleteModalConfig({ isOpen: false, id: null, name: '' })
            return
        }

        setCustomers((prev) => prev.filter((c) => c.id !== id))
        toast.success("ગ્રાહકની માહિતી સફળતાપૂર્વક દૂર કરવામાં આવી છે.")
        setDeleteModalConfig({ isOpen: false, id: null, name: '' })
    }

    const activeCustomer = customers.find((c) => c.id === selectedCustomerId)

    const getFormattedMeasurementString = (meas: Customer['measurements']) => {
        if (!meas) return 'માપ ઉપલબ્ધ નથી'
        if (typeof meas === 'string') return meas

        return Object.entries(meas)
            .map(([key, val]) => `${key.toUpperCase()}: ${val}`)
            .join(' | ')
    }

    const sortBtnClass = (active: boolean) =>
        `px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1 ${active
            ? 'bg-purple-600 text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`

    return (
        <div className="min-h-screen bg-slate-50 pb-20 mt-[3.4rem]">
            <PageHeader
                title="ગ્રાહકોની યાદી"
                onBack={PAGE_PATH_KEYS.HOME}
            />

            <div className="p-4 bg-white border-b border-gray-100 sticky top-0 shadow-sm space-y-3 z-10">
                <div className="max-w-7xl mx-auto">
                    <ThemeInput
                        className="h-[44px] w-full border-gray-200 focus:border-purple-600 focus:ring-purple-200 rounded-xl px-3"
                        placeholder="ગ્રાહક શોધો (નામ અથવા ફોન નંબર)..."
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchQuery(e.target.value)
                        }
                    />
                </div>

                <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto pb-1">
                    <div className="flex items-center gap-1.5 text-xs">
                        <button
                            onClick={() => setSortType('newest')}
                            className={sortBtnClass(sortType === 'newest')}
                        >
                            <FaCalendarAlt size={11} />
                            નવા ગ્રાહકો
                        </button>

                        <button
                            onClick={() => setSortType('oldest')}
                            className={sortBtnClass(sortType === 'oldest')}
                        >
                            <FaCalendarAlt size={11} />
                            જૂના ગ્રાહકો
                        </button>

                        <button
                            onClick={() => setSortType('az')}
                            className={sortBtnClass(sortType === 'az')}
                        >
                            <FaSortAlphaDown size={12} />
                            નામ (A-Z)
                        </button>

                        <span className="w-px h-5 bg-gray-200 mx-0.5" />

                        <button
                            onClick={() => setOnlyPending((prev) => !prev)}
                            className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1 ${onlyPending
                                ? 'bg-red-600 text-white shadow-sm'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                        >
                            <FaRupeeSign size={11} />
                            બાકી ચુકવણી ({pendingCustomersCount})
                        </button>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-500 font-medium px-1 pt-1 border-t border-gray-50">
                    <span>કુલ ગ્રાહકો: {filteredCustomers.length}</span>
                    <span className="flex items-center gap-3">
                        {searchQuery && (
                            <span className="text-purple-600 font-semibold">
                                પરિણામો: {filteredCustomers.length}
                            </span>
                        )}
                        <span className={`font-bold ${totalPending > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            કુલ બાકી: {formatRupee(totalPending)}
                        </span>
                    </span>
                </div>
            </div>

            <div className="p-4 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-400 text-sm font-medium">
                        ડેટા લોડ થઈ રહ્યો છે...
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <p className="text-gray-400 text-sm font-medium">કોઈ ગ્રાહક મળ્યા નથી</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredCustomers.map((customer: any) => {
                            const total = Number(customer.total_amount) || 0
                            const advance = Number(customer.advance_amount) || 0
                            const pending = Number(customer.pending_amount) || 0
                            const hasPayment = total > 0

                            return (
                                <div
                                    key={customer.id}
                                    className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group"
                                >
                                    <div>
                                        <div className="flex items-start justify-between gap-2 mb-2">
                                            <div>
                                                <h3 className="font-bold text-gray-900 text-base leading-tight flex items-center gap-2">
                                                    {customer.customer_name}
                                                    {customer.gender && (
                                                        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full uppercase border border-purple-100">
                                                            {customer.gender}
                                                        </span>
                                                    )}
                                                </h3>
                                            </div>

                                            <div className="flex items-center gap-1">
                                                <Link
                                                    to={PAGE_PATH_KEYS.CUSTOMER}
                                                    search={{ id: Number(customer.id), updateKey: updateKey }}
                                                    className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="એડિટ કરો (Edit)"
                                                >
                                                    <FaEdit size={18} />
                                                </Link>
                                                <button
                                                    onClick={() => confirmDelete(customer.id, customer.customer_name)}
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="ડિલીટ કરો (Delete)"
                                                >
                                                    <FaTrash size={16} />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="text-xs text-gray-500 space-y-1.5 mb-4">
                                            <p className="flex items-center gap-1.5 font-medium text-gray-700">
                                                <FaPhone className="text-purple-500 text-xs" />
                                                {customer.phone}
                                            </p>
                                            {customer.city && <p className="text-gray-600">📍 {customer.city}</p>}
                                            <p className="text-[11px] text-gray-400">
                                                Date:{' '}
                                                {customer.created_at
                                                    ? new Date(customer.created_at).toLocaleDateString('en-IN', {
                                                        day: '2-digit',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })
                                                    : 'તારીખ ઉપલબ્ધ નથી'}
                                            </p>
                                        </div>

                                        {hasPayment && (
                                            <div className="mb-4">
                                                <div className="grid grid-cols-3 gap-2">
                                                    <div className="rounded-xl bg-slate-50 border border-gray-100 px-2 py-2 text-center">
                                                        <p className="text-[10px] text-gray-500 font-medium">કુલ</p>
                                                        <p className="text-sm font-bold text-gray-800">{formatRupee(total)}</p>
                                                    </div>
                                                    <div className="rounded-xl bg-slate-50 border border-gray-100 px-2 py-2 text-center">
                                                        <p className="text-[10px] text-gray-500 font-medium">અગાઉથી</p>
                                                        <p className="text-sm font-bold text-gray-800">{formatRupee(advance)}</p>
                                                    </div>
                                                    <div
                                                        className={`rounded-xl border px-2 py-2 text-center ${pending > 0
                                                            ? 'bg-red-50 border-red-200'
                                                            : 'bg-green-50 border-green-200'
                                                            }`}
                                                    >
                                                        <p className={`text-[10px] font-medium ${pending > 0 ? 'text-red-500' : 'text-green-600'}`}>
                                                            બાકી
                                                        </p>
                                                        <p className={`text-sm font-black ${pending > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                            {formatRupee(pending)}
                                                        </p>
                                                    </div>
                                                </div>

                                                {pending <= 0 && (
                                                    <p className="mt-2 flex items-center justify-center gap-1 text-[11px] font-semibold text-green-600">
                                                        <FaCheckCircle size={11} /> ચુકવણી પૂર્ણ
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                                        <a
                                            href={`tel:${customer.phone?.replace(/\s+/g, '')}`}
                                            className="flex-1 py-2 px-3 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <FaPhone size={12} />
                                            કોલ કરો
                                        </a>

                                        <button
                                            onClick={() => setSelectedCustomerId(customer.id)}
                                            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                                        >
                                            <FaRulerCombined size={12} />
                                            માપ જુઓ
                                        </button>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {activeCustomer && (
                <MeasurementModal
                    isOpen={Boolean(selectedCustomerId)}
                    onClose={() => setSelectedCustomerId(null)}
                    customerName={activeCustomer.customer_name}
                    measurement={getFormattedMeasurementString(activeCustomer.measurements)}
                />
            )}

            {/* Custom Confirm Delete Modal */}
            {deleteModalConfig.isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fadeIn">
                    <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl text-center space-y-4">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                            <FaExclamationTriangle size={20} />
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-gray-900">
                                શું તમે "{deleteModalConfig.name}" ને ડિલીટ કરવા માંગો છો?
                            </h3>
                            <p className="mt-1 text-xs text-gray-500">
                                આ ક્રિયા પાછી ખેંચી શકાતી નથી!
                            </p>
                        </div>
                        <div className="flex gap-3 pt-2">
                            <button
                                onClick={() => setDeleteModalConfig({ isOpen: false, id: null, name: '' })}
                                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                            >
                                ના (Cancel)
                            </button>
                            <button
                                onClick={handleDelete}
                                className="flex-1 rounded-xl bg-red-600 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 shadow-md shadow-red-600/30"
                            >
                                હા, ડિલીટ કરો
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => navigate({ to: PAGE_PATH_KEYS.CUSTOMER })}
                className="fixed bottom-5 right-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-semibold text-sm z-20"
            >
                <FaUserPlus size={18} />
                <span className="hidden sm:inline">નવો ગ્રાહક ઉમેરો</span>
            </button>
        </div>
    )
}

export default RouteComponent