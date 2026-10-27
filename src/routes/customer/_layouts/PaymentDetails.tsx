import { ThemeInput } from "#/utils"
import { FaChevronDown, FaRupeeSign } from "react-icons/fa"

const PaymentDetails = ({
    isPaymentOpen,
    setIsPaymentOpen,
    payment,
    onPaymentChange,
    advanceTooHigh,
    pendingNum
}: any) => {

    return (
        <div className="pt-4 border-t border-gray-100">
            <button
                type="button"
                onClick={() => setIsPaymentOpen(!isPaymentOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none group py-1"
            >
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FaRupeeSign className="text-purple-600" /> ચુકવણીની વિગતો (Payment)
                </h3>
                <FaChevronDown
                    className={`text-purple-600 transition-transform duration-300 ${isPaymentOpen ? 'rotate-180' : ''}`}
                    size={14}
                />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isPaymentOpen ? 'grid-rows-[1fr] opacity-100 mt-4 space-y-4' : 'grid-rows-[0fr] opacity-0 mt-0 space-y-0'
                    }`}
            >
                <div className="overflow-hidden space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaRupeeSign className="text-purple-600" /> કુલ રકમ (Total) *
                            </label>
                            <ThemeInput
                                type="text"
                                inputMode="decimal"
                                placeholder="દા.ત. 1500"
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={payment.total}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPaymentChange('total', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaRupeeSign className="text-purple-600" /> અગાઉથી ચુકવણી (Advance)
                            </label>
                            <ThemeInput
                                type="text"
                                inputMode="decimal"
                                placeholder="દા.ત. 500"
                                className={`w-full h-[44px] px-3.5 rounded-xl ${advanceTooHigh ? 'border-red-400 focus:border-red-500' : 'border-gray-200 focus:border-purple-600'}`}
                                value={payment.advance}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onPaymentChange('advance', e.target.value)}
                            />
                            {advanceTooHigh && (
                                <p className="mt-1 text-[11px] text-red-500">
                                    અગાઉથી ચુકવણી કુલ રકમ કરતાં વધારે ન હોઈ શકે.
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-xl bg-purple-50 border border-purple-200 px-4 h-[48px]">
                        <span className="text-xs font-semibold text-purple-900">બાકી (Pending)</span>
                        <span className={`text-base font-black ${pendingNum > 0 ? 'text-red-600' : 'text-green-600'}`}>
                            ₹ {pendingNum.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PaymentDetails