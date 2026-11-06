import React, { useState, useMemo, useEffect, useCallback } from 'react'
import PageHeader from '#/components/PageHeader'
import { ThemeInput } from '#/utils'
import { PAGE_PATH_KEYS, API_KEY } from '#/utils/constant'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { FaUserPlus } from 'react-icons/fa'
import { supabase } from '#/lib/supabaseClient'
import CustomerGrid from './layouts/CustomerGrid'
import ConfirmModal from '../../components/ConfirmModal'
import AllSearchFilters from './layouts/AllSearchFilters'
import MeasurementModal from '#/components/MeasurementModal'
import { useGlobalToast } from '#/components/CustomeToast'
import { useAuth } from '#/utils/auth'
import { useTranslation } from 'react-i18next'

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
    const [isDeleting, setIsDeleting] = useState(false) // Added loading state for deletion
    const [sortType, setSortType] = useState<SortType>('newest')
    const [onlyPending, setOnlyPending] = useState(false)
    const [selectedCustomerId, setSelectedCustomerId] = useState<string | number | null>(null)
    const [updateKey, setUpdateKey] = useState<number>(1)
    const [, setToastState] = useGlobalToast()
    const { auth } = useAuth()
    const { t } = useTranslation()

    const [deleteModalConfig, setDeleteModalConfig] = useState<{
        isOpen: boolean
        id: string | number | null
        name: string
    }>({
        isOpen: false,
        id: null,
        name: '',
    })

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true)

        try {
            if (!auth) {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: t('SiteMessageWithLanguages.LOGIN_TO_VIEW_CUSTOMER')
                })
                return
            }

            const userId = auth?.authData?.id ?? null

            if (!userId || typeof userId !== 'string') {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: t('SiteMessageWithLanguages.USER_ID_NOT_FOUND')
                })
                return
            }

            let queryBuilder = supabase
                .from(API_KEY.CUSTOMERS)
                .select(
                    'id, user_id, customer_name, phone, city, gender, male_measurements, female_measurements, created_at, total_amount, advance_amount, pending_amount'
                )
                .eq('user_id', userId)

            if (sortType === 'az') {
                queryBuilder = queryBuilder.order('customer_name', {
                    ascending: true,
                })
            } else if (sortType === 'oldest') {
                queryBuilder = queryBuilder.order('created_at', {
                    ascending: true,
                })
            } else {
                queryBuilder = queryBuilder.order('created_at', {
                    ascending: false,
                })
            }

            const { data, error } = await queryBuilder

            if (error) {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: t('SiteMessageWithLanguages.ERROR_FETCHING_CUSTOMER')
                })
                return
            }

            setCustomers((data ?? []) as Customer[])
        } catch (error) {
            setCustomers([])
            setToastState({
                show: true,
                type: 'E',
                msg: t('SiteMessageWithLanguages.ERROR_FETCHING_CUSTOMER')
            })
        } finally {
            setIsLoading(false)
        }
    }, [auth, sortType, setToastState])

    useEffect(() => {
        fetchCustomers()
    }, [sortType])

    const filteredCustomers = useMemo(() => {
        let list = customers

        if (onlyPending) {
            list = list.filter(
                (customer) => Number(customer.pending_amount) > 0
            )
        }

        if (!searchQuery.trim()) return list

        const query = searchQuery.toLowerCase()

        return list.filter(
            (customer) =>
                customer.customer_name?.toLowerCase().includes(query) ||
                customer.phone?.includes(query) ||
                customer.city?.toLowerCase().includes(query)
        )
    }, [searchQuery, customers, onlyPending])

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

        try {
            setIsDeleting(true)
            const { error } = await supabase.from(API_KEY.CUSTOMERS).delete().eq('id', id)

            if (error) {
                setToastState({
                    show: true,
                    type: 'E',
                    msg: error.message,
                })
                return
            }

            setCustomers((prev) => prev.filter((c) => c.id !== id))
            setToastState({
                show: true,
                type: 'S',
                msg: t('SiteMessageWithLanguages.CUSTOMER_REMOVE_DETAILS_SUCCESS')
            })
            setDeleteModalConfig({ isOpen: false, id: null, name: '' })
        } catch (err) {
            setToastState({
                show: true,
                type: 'E',
                msg: err,
            })
        } finally {
            setIsDeleting(false)
        }
    }

    const activeCustomer = customers.find((c) => c.id === selectedCustomerId)

    return (
        <div className="min-h-screen bg-slate-50 pb-20 mt-[3.4rem]">
            <PageHeader
                title={t('CustomerListDashboard.PageTitle', 'Customer List')}
                onBack={PAGE_PATH_KEYS.HOME}
                visible
            />

            <div className="p-4 bg-white border-b border-gray-100 sticky top-0 shadow-sm space-y-3 z-10">
                <div className="max-w-7xl mx-auto">
                    <ThemeInput
                        className="h-[44px] w-full border-gray-200 focus:border-purple-600 focus:ring-purple-200 rounded-xl px-3"
                        placeholder={t('CustomerListDashboard.SearchPlaceholder', 'Search by name, phone or city')}
                        value={searchQuery}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setSearchQuery(e.target.value)
                        }
                    />
                </div>
                <AllSearchFilters
                    setSortType={setSortType}
                    sortType={sortType}
                    setOnlyPending={setOnlyPending}
                    onlyPending={onlyPending}
                    pendingCustomersCount={pendingCustomersCount}
                    filteredCustomers={filteredCustomers}
                    searchQuery={searchQuery}
                    formatRupee={formatRupee}
                />
            </div>

            <div className="p-4 max-w-7xl mx-auto">
                {isLoading ? (
                    <div className="text-center py-12 text-gray-400 text-sm font-medium">
                        {t('CustomerListDashboard.LoadingCustomers', 'Loading customers...')}
                    </div>
                ) : filteredCustomers.length === 0 ? (
                    <div className="text-center py-12 bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
                        <p className="text-gray-400 text-sm font-medium">
                            {t('CustomerListDashboard.NoCustomersFound', 'No customers found')}
                        </p>
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

            <ConfirmModal
                isOpen={deleteModalConfig.isOpen}
                onClose={() => setDeleteModalConfig({ isOpen: false, id: null, name: '' })}
                onConfirm={handleDelete}
                isLoading={isDeleting}
                title={t('DeleteModalDetails.DeleteMessage')}
                // message={t('DeleteModalDetails.DeleteMessageSbTitle')}
                confirmText={t('DeleteModalDetails.OkMessage')}
                cancelText={t('DeleteModalDetails.CancelMessage')}
                variant="D"
            />

            <button
                onClick={() => navigate({ to: PAGE_PATH_KEYS.CUSTOMER })}
                className="fixed bottom-5 right-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg shadow-purple-600/40 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 font-semibold text-sm z-20"
            >
                <FaUserPlus size={18} />
                <span className="hidden sm:inline">{t('NewCustomer.AddNewCustomerPageHeader', 'Add New Customer')}</span>
            </button>
        </div>
    )
}

export default RouteComponent