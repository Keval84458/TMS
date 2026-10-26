import React, { useState, useMemo, useEffect } from 'react'
import PageHeader from '#/components/PageHeader'
import { ThemeInput } from '#/utils'
import { PAGE_PATH_KEYS } from '#/utils/constant'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { FaUserPlus } from 'react-icons/fa'
import { supabase } from '#/lib/supabaseClient'
import MeasurementModal from '#/components/AppModal'
import { toast } from 'react-toastify'
import CustomerGrid from './_layouts/CustomerGrid'
import ConfirmModal from './_layouts/ConfirmModal'
import AllSearchFilters from './_layouts/AllSearchFilters'

export const Route = createFileRoute('/cutomer-list/')({
    component: RouteComponent,
})

type MeasurementMap = Record<string, string>

interface Customer {
    id: string | number
    customer_name: string
    phone: string
    city?: string
    gender?: string
    male_measurements?: MeasurementMap | null
    female_measurements?: MeasurementMap | null
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
            let queryBuilder = supabase
                .from('customers')
                .select(
                    'id, customer_name, phone, city, gender, male_measurements, female_measurements, created_at, total_amount, advance_amount, pending_amount'
                )

            if (sortType === 'az') {
                queryBuilder = queryBuilder.order('customer_name', { ascending: true })
            } else if (sortType === 'oldest') {
                queryBuilder = queryBuilder.order('created_at', { ascending: true })
            } else {
                queryBuilder = queryBuilder.order('created_at', { ascending: false })
            }

            const { data, error } = await queryBuilder
            if (error) {
                toast.error('Error fetching customers')
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
        toast.success('ગ્રાહકની માહિતી સફળતાપૂર્વક દૂર કરવામાં આવી છે.')
        setDeleteModalConfig({ isOpen: false, id: null, name: '' })
    }

    const activeCustomer = customers.find((c) => c.id === selectedCustomerId)

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
                visible
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
                <AllSearchFilters
                    setSortType={setSortType}
                    sortBtnClass={sortBtnClass}
                    sortType={sortType}
                    setOnlyPending={setOnlyPending}
                    onlyPending={onlyPending}
                    pendingCustomersCount={pendingCustomersCount}
                    filteredCustomers={filteredCustomers}
                    searchQuery={searchQuery}
                    totalPending={totalPending}
                    formatRupee={formatRupee}
                />
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
                    <CustomerGrid
                        updateKey={updateKey}
                        filteredCustomers={filteredCustomers}
                        confirmDelete={confirmDelete}
                        formatRupee={formatRupee}
                        setSelectedCustomerId={setSelectedCustomerId}
                    />
                )}
            </div>

            {activeCustomer && (
                <MeasurementModal
                    isOpen={Boolean(selectedCustomerId)}
                    onClose={() => setSelectedCustomerId(null)}
                    customerName={activeCustomer.customer_name}
                    gender={activeCustomer.gender}
                    maleMeasurements={activeCustomer.male_measurements}
                    femaleMeasurements={activeCustomer.female_measurements}
                />
            )}

            {deleteModalConfig.isOpen && (
                <ConfirmModal
                    deleteModalConfig={deleteModalConfig}
                    setDeleteModalConfig={setDeleteModalConfig}
                    handleDelete={handleDelete}
                />
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