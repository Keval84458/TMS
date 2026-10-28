import { PAGE_PATH_KEYS } from "#/utils/constant"
import { Link } from "@tanstack/react-router"
import { FaCalendarAlt, FaCheckCircle, FaEdit, FaPhone, FaRulerCombined, FaTrash } from "react-icons/fa"
import { TiLocation } from "react-icons/ti";

const CustomerGrid = ({
    updateKey,
    filteredCustomers,
    confirmDelete,
    formatRupee,
    setSelectedCustomerId
}: any) => {
    return (
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
                                    <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                        <span className="capitalize text-[1rem]">{customer.customer_name}</span>
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

                            <div className="text-xs text-gray-500  mb-4 flex justify-between">
                                <p className="flex items-center gap-1.5 font-medium text-gray-700">
                                    <FaPhone className="text-purple-500 text-xs" />
                                    {customer.phone}
                                </p>
                                {customer.city && <p className="text-gray-600 flex items-center gap-1"><TiLocation color="red" /> {customer.city}</p>}
                                <p className="text-[11px] text-gray-900 flex items-center gap-1">
                                    <FaCalendarAlt color="black" />:{' '}
                                    {customer.created_at
                                        ? new Date(customer.created_at).toLocaleDateString('en-IN', {
                                            day: '2-digit',
                                            month: '2-digit',
                                            year: 'numeric',
                                        })
                                        : 'તારીખ ઉપલબ્ધ નથી'}
                                </p>
                            </div>

                            {hasPayment && (
                                <div className="mb-4">
                                    <div className="grid grid-cols-3 gap-2">
                                        <div className="rounded-xl bg-slate-50 border border-gray-100 px-2 py-[2px] text-center">
                                            <p className="text-[10px] text-gray-500 font-medium">કુલ</p>
                                            <p className="text-sm font-bold text-gray-800">{formatRupee(total)}</p>
                                        </div>
                                        <div className="rounded-xl bg-slate-50 border border-gray-100 px-2 py-[2px] text-center">
                                            <p className="text-[10px] text-gray-500 font-medium">અગાઉથી</p>
                                            <p className="text-sm font-bold text-gray-800">{formatRupee(advance)}</p>
                                        </div>
                                        <div
                                            className={`rounded-xl border px-2 py-[2px] text-center ${pending > 0
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
    )
}

export default CustomerGrid