
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import {
    FaCalendarAlt,
    FaRupeeSign,
    FaSortAlphaDown,
} from 'react-icons/fa'

type SortType = 'newest' | 'oldest' | 'az'

interface AllSearchFiltersProps {
    pendingCustomersCount: number
    filteredCustomers: any[]
    formatRupee: (value: number) => string
    searchQuery: string
    sortType: SortType
    setSortType: (value: SortType) => void
    onlyPending: boolean
    setOnlyPending: (value: boolean) => void
}

const AllSearchFilters = ({
    pendingCustomersCount,
    filteredCustomers,
    formatRupee,
    searchQuery,
    sortType,
    setSortType,
    onlyPending,
    setOnlyPending,
}: AllSearchFiltersProps) => {
    const { t } = useTranslation()

    const totalPending = useMemo(
        () =>
            filteredCustomers.reduce(
                (sum, customer) =>
                    sum + (Number(customer.pending_amount) || 0),
                0
            ),
        [filteredCustomers]
    )

    const sortBtnClass = (active: boolean) =>
        `px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1 ${active
            ? 'bg-purple-600 text-white shadow-sm'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`

    return (
        <>
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto pb-1">
                <div className="flex items-center gap-1.5 text-xs">
                    <button
                        type="button"
                        onClick={() => setSortType('newest')}
                        className={sortBtnClass(sortType === 'newest')}
                    >
                        <FaCalendarAlt size={11} />
                        {t('CustomerListDashboard.NewestCustomers', 'New Customers')}
                    </button>

                    <button
                        type="button"
                        onClick={() => setSortType('oldest')}
                        className={sortBtnClass(sortType === 'oldest')}
                    >
                        <FaCalendarAlt size={11} />
                        {t('CustomerListDashboard.OldestCustomers', 'Old Customers')}
                    </button>

                    <button
                        type="button"
                        onClick={() => setSortType('az')}
                        className={sortBtnClass(sortType === 'az')}
                    >
                        <FaSortAlphaDown size={12} />
                        {t('CustomerListDashboard.AtoZCustomers', 'A to Z')}
                    </button>

                    <span className="w-px h-5 bg-gray-200 mx-0.5" />

                    <button
                        type="button"
                        onClick={() => setOnlyPending(!onlyPending)}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all whitespace-nowrap flex items-center gap-1 ${onlyPending
                            ? 'bg-red-600 text-white shadow-sm'
                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                            }`}
                    >
                        <FaRupeeSign size={11} />
                        {t('CustomerListDashboard.PendingPayments', 'Pending Payments')} ({pendingCustomersCount})
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto flex items-center justify-between text-xs text-gray-500 font-medium px-1 pt-1 border-t border-gray-50">
                <span>{t('CustomerListDashboard.TotalCustomers', 'Total Customers')}: {filteredCustomers.length}</span>

                <span className="flex items-center gap-3">
                    {searchQuery && (
                        <span className="text-purple-600 font-semibold">
                            {t('CustomerListDashboard.Results', 'Results')}: {filteredCustomers.length}
                        </span>
                    )}

                    <span
                        className={`font-bold ${totalPending > 0
                            ? 'text-red-600'
                            : 'text-green-600'
                            }`}
                    >
                        {t('CustomerListDashboard.TotalPendingPayments', 'Total Pending Payments')}: {formatRupee(totalPending)}
                    </span>
                </span>
            </div>
        </>
    )
}

export default AllSearchFilters
