import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import PageHeader from '#/components/PageHeader'
import { supabase } from '#/lib/supabaseClient'
import { ThemeInput, ThemeTextarea } from '#/utils'
import { PAGE_PATH_KEYS } from '#/utils/constant'
import {
    FaUser,
    FaPhone,
    FaMapMarkerAlt,
    FaRulerCombined,
    FaSave,
    FaSpinner,
    FaVenusMars,
    FaTshirt,
    FaRupeeSign,
    FaChevronDown
} from 'react-icons/fa'
import { GiArmoredPants, GiLargeDress, GiSleevelessTop } from 'react-icons/gi'
import { toast } from 'react-toastify'
import { useAuth } from '#/utils/auth'

export const Route = createFileRoute('/customer/')({
    validateSearch: (search: Record<string, unknown>) => ({
        id: Number(search.id) || 0,
        updateKey: Number(search.updateKey) || 0
    }),
    component: RouteComponent,
})

const sanitizeAmount = (value: string) =>
    value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')

function RouteComponent() {
    const navigate = useNavigate()
    const { id, updateKey } = Route.useSearch()
    const { auth } = useAuth()
    const isUpdateMode = updateKey === 1

    const [isMeasurementOpen, setIsMeasurementOpen] = useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [isFetching, setIsFetching] = useState(isUpdateMode)

    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        city: '',
        gender: 'male',
    })
    const [measurements, setMeasurements] = useState({
        shirt: '',
        pant: '',
        blouse: '',
        dress: '',
        kurti: '',
        ladiesPant: '',
        shalwar: '',
        other: ''
    })

    const [payment, setPayment] = useState({
        total: '',
        advance: '',
    })

    const [isLoading, setIsLoading] = useState(false)

    const totalNum = parseFloat(payment.total) || 0
    const advanceNum = parseFloat(payment.advance) || 0
    const pendingNum = Math.max(totalNum - advanceNum, 0)
    const advanceTooHigh = totalNum > 0 && advanceNum > totalNum

    // Fetch existing details if updateMode is active
    useEffect(() => {
        const fetchCustomerDetails = async () => {
            if (!isUpdateMode || !id) {
                setIsFetching(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('customers')
                    .select('*')
                    .eq('id', id)
                    .single()

                if (error) {
                    toast.error('ગ્રાહકની માહિતી મળી શકી નથી.')
                } else if (data) {
                    setFormData({
                        customer_name: data.customer_name || '',
                        phone: data.phone || '',
                        city: data.city || '',
                        gender: data.gender || 'male',
                    })

                    setPayment({
                        total: data.total_amount ? String(data.total_amount) : '',
                        advance: data.advance_amount ? String(data.advance_amount) : '',
                    })

                    if (data.measurements && typeof data.measurements === 'object') {
                        setMeasurements({
                            shirt: data.measurements.shirt || '',
                            pant: data.measurements.pant || '',
                            blouse: data.measurements.blouse || '',
                            dress: data.measurements.dress || '',
                            kurti: data.measurements.kurti || '',
                            ladiesPant: data.measurements.ladiesPant || '',
                            shalwar: data.measurements.shalwar || '',
                            other: data.measurements.other || '',
                        })
                    } else if (typeof data.measurement === 'string') {
                        setMeasurements((prev) => ({ ...prev, other: data.measurement }))
                    }
                }
            } catch (err) {
                toast.error('Unexpected error')
            } finally {
                setIsFetching(false)
            }
        }

        fetchCustomerDetails()
    }, [id, isUpdateMode])

    const onCustomerChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const onMeasurementChange = (key: string, value: string) => {
        setMeasurements((prev) => ({ ...prev, [key]: value }))
    }

    const onPaymentChange = (key: 'total' | 'advance', value: string) => {
        setPayment((prev) => ({ ...prev, [key]: sanitizeAmount(value) }))
    }

    const HandleSubmit = async () => {
        if (!formData.customer_name.trim()) {
            toast.warn("કૃપા કરીને ગ્રાહકનું નામ ભરો.")
            return
        } else if (!formData.phone.trim()) {
            toast.warn("કૃપા કરીને ફોન નંબર ભરો.")
            return
        } else if (!formData.city.trim()) {
            toast.warn("કૃપા કરીને ગામનું નામ ભરો.")
            return
        }
        else if (totalNum < 0 || advanceNum < 0) {
            toast.warn("રકમ 0 અથવા તેનાથી વધુ હોવી જોઈએ.")
            return
        } else if (advanceTooHigh) {
            toast.warn("અગાઉથી ચુકવણી કુલ રકમ કરતાં વધારે ન હોઈ શકે.")
            return
        }

        setIsLoading(true)
        try {
            const filteredMeasurements: Record<string, string> = {}
            Object.entries(measurements).forEach(([key, val]) => {
                if (val.trim() !== '') {
                    filteredMeasurements[key] = val.trim()
                }
            })

            const payload = {
                customer_name: formData.customer_name.trim(),
                phone: formData.phone.trim(),
                city: formData.city.trim(),
                gender: formData.gender,
                measurements: filteredMeasurements,
                total_amount: totalNum,
                advance_amount: advanceNum,
                pending_amount: pendingNum,
                ...(isUpdateMode ? {} : { user_id: auth.authData?.id })
            }

            if (isUpdateMode) {
                const { error } = await supabase
                    .from('customers')
                    .update(payload)
                    .eq('id', id)

                if (error) {
                    toast.error(error.message)
                    return
                }

                toast.success("ગ્રાહકની વિગતો સફળતાપૂર્વક અપડેટ થઈ ગઈ છે.")
            } else {
                const { error } = await supabase
                    .from('customers')
                    .insert([payload])

                if (error) {
                    console.error(error)
                    toast.error("ભૂલ!")
                    return
                }

                toast.success("ગ્રાહકની વિગતો સફળતાપૂર્વક સેવ થઈ ગઈ છે.")
            }

            navigate({ to: PAGE_PATH_KEYS.LIST || '/customer-list' })

        } catch {
            toast.error("કંઈક ખોટું થયું. ફરીથી પ્રયાસ કરો.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-gray-500 text-sm font-medium">માહિતી લોડ થઈ રહી છે...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12 mt-[3.4rem]">
            <PageHeader
                title={isUpdateMode ? "ગ્રાહક વિગતો અપડેટ કરો" : "નવું માપ અને ગ્રાહક"}
                onBack={PAGE_PATH_KEYS.LIST || PAGE_PATH_KEYS.HOME}
            />
            <div className="max-w-2xl mx-auto p-4 sm:p-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">

                    <div className="border-b border-gray-100 pb-4">
                        <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-purple-600" />
                            {isUpdateMode ? "ગ્રાહકની માહિતી સુધારો" : "ગ્રાહકની માહિતી અને માપ"}
                        </h2>
                        <p className="text-xs text-gray-500 mt-1">
                            {isUpdateMode ? "ગ્રાહકની વિગતો અને માપ બદલો" : "ગ્રાહકની વિગતો ભરો અને જરૂરિયાત મુજબ માપના બોક્સનો ઉપયોગ કરો"}
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaUser className="text-purple-600" /> ગ્રાહકનું નામ *
                            </label>
                            <ThemeInput
                                type="text"
                                placeholder="દા.ત. કેવલ મકવાણા"
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={formData.customer_name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCustomerChange('customer_name', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaPhone className="text-purple-600" /> ફોન નંબર *
                            </label>
                            <ThemeInput
                                type="tel"
                                placeholder="દા.ત. 1234567890"
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={formData.phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCustomerChange('phone', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-purple-600" /> ગામ / શહેર *
                            </label>
                            <ThemeInput
                                type="text"
                                placeholder="દા.ત. અમદાવાદ"
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={formData.city}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onCustomerChange('city', e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaVenusMars className="text-purple-600" /> ગ્રાહકનો પ્રકાર (Gender) *
                            </label>
                            <div className="flex gap-4 h-[44px] items-center px-2 border border-gray-200 rounded-xl bg-slate-50">
                                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="male"
                                        checked={formData.gender === 'male'}
                                        onChange={(e) => onCustomerChange('gender', e.target.value)}
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    પુરુષ (Male)
                                </label>
                                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                                    <input
                                        type="radio"
                                        name="gender"
                                        value="female"
                                        checked={formData.gender === 'female'}
                                        onChange={(e) => onCustomerChange('gender', e.target.value)}
                                        className="text-purple-600 focus:ring-purple-500"
                                    />
                                    સ્ત્રી (Female)
                                </label>
                            </div>
                        </div>
                    </div>
                    <div className="pt-4 border-t border-gray-100">
                        <button
                            type="button"
                            onClick={() => setIsMeasurementOpen(!isMeasurementOpen)}
                            className="w-full flex items-center justify-between text-left focus:outline-none group py-1"
                        >
                            <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                                <RulerIcon /> માપની વિગતો (Measurements Textareas)
                            </h3>
                            <FaChevronDown
                                className={`text-purple-600 transition-transform duration-300 ${isMeasurementOpen ? 'rotate-180' : ''}`}
                                size={14}
                            />
                        </button>

                        <div
                            className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isMeasurementOpen ? 'grid-rows-[1fr] opacity-100 mt-4 space-y-4' : 'grid-rows-[0fr] opacity-0 mt-0 space-y-0'
                                }`}
                        >
                            <div className="overflow-hidden space-y-4">
                                {formData.gender === 'male' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <FaTshirt className="text-purple-600" /> શર્ટ માપ (Shirt)
                                            </label>
                                            <ThemeTextarea
                                                placeholder="લંબાઈ, છાતી, શોલ્ડર, હાથ વગેરે..."
                                                className="w-full h-[90px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                                value={measurements.shirt}
                                                onChange={(e) => onMeasurementChange('shirt', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <GiArmoredPants className="text-purple-600" /> પેન્ટ માપ (Pant)
                                            </label>
                                            <ThemeTextarea
                                                placeholder="લંબાઈ, કમર, સીટ, મોરી વગેરે..."
                                                className="w-full h-[90px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                                value={measurements.pant}
                                                onChange={(e) => onMeasurementChange('pant', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                {formData.gender === 'female' && (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <FaTshirt className="text-purple-600" /> બ્લાઉઝ માપ (Blouse)
                                            </label>
                                            <ThemeTextarea
                                                placeholder="લંબાઈ, છાતી, ગળું, ટક્સ વગેરે..."
                                                className="w-full h-[90px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                                value={measurements.blouse}
                                                onChange={(e) => onMeasurementChange('blouse', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <GiLargeDress className="text-purple-600" /> ડ્રેસ માપ (Dress)
                                            </label>
                                            <ThemeTextarea
                                                placeholder="લંબાઈ, છાતી, કમર, ઘેરાવો વગેરે..."
                                                className="w-full h-[90px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                                value={measurements.dress}
                                                onChange={(e) => onMeasurementChange('dress', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <GiSleevelessTop className="text-purple-600" /> કુરતી માપ (Kurti)
                                            </label>
                                            <ThemeTextarea
                                                placeholder="લંબાઈ, છાતી, ચાક, સ્લીવ વગેરે..."
                                                className="w-full h-[90px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                                value={measurements.kurti}
                                                onChange={(e) => onMeasurementChange('kurti', e.target.value)}
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <GiArmoredPants className="text-purple-600" /> પેન્ટ માપ (Pant)
                                            </label>
                                            <ThemeTextarea
                                                placeholder="લંબાઈ, કમર, સીટ, મોરી વગેરે..."
                                                className="w-full h-[90px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                                value={measurements.ladiesPant}
                                                onChange={(e) => onMeasurementChange('ladiesPant', e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                                <GiArmoredPants className="text-purple-600" /> શલવાર (Shalwar)
                                            </label>
                                            <ThemeTextarea
                                                placeholder="લંબાઈ, કમર, સીટ, મોરી વગેરે..."
                                                className="w-full h-[90px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                                value={measurements.shalwar}
                                                onChange={(e) => onMeasurementChange('shalwar', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                )}

                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                        <FaRulerCombined className="text-purple-600" /> અન્ય માપ અથવા નોંધ (Other / Notes)
                                    </label>
                                    <ThemeTextarea
                                        placeholder="કોઈપણ વધારાની નોંધ અથવા અન્ય કપડાંનું માપ અહીં લખો..."
                                        className="w-full h-[80px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                        value={measurements.other}
                                        onChange={(e) => onMeasurementChange('other', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

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

                    <div className="pt-2">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={HandleSubmit}
                            className="w-full h-[46px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-purple-600/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin text-lg" />
                                    <span>{isUpdateMode ? "અપડેટ થઈ રહ્યું છે..." : "સેવ થઈ રહ્યું છે..."}</span>
                                </>
                            ) : (
                                <>
                                    <FaSave className="text-base" />
                                    <span>{isUpdateMode ? "ફેરફાર સેવ કરો" : "સેવ કરો (Save Customer)"}</span>
                                </>
                            )}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    )
}

function RulerIcon() {
    return <FaRulerCombined className="text-purple-600" />
}