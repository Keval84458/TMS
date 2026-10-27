import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import PageHeader from '#/components/PageHeader'
import { supabase } from '#/lib/supabaseClient'
import { PAGE_PATH_KEYS } from '#/utils/constant'
import { FaSave, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useAuth } from '#/utils/auth'
import MeasurementsDetails from './_layouts/MeasurementsDetails'
import PaymentDetails from './_layouts/PaymentDetails'
import CustomerDetails from './_layouts/CustomerDetails'

export const Route = createFileRoute('/customer/')({
    validateSearch: (search: Record<string, unknown>) => ({
        id: Number(search.id) || 0,
        updateKey: Number(search.updateKey) || 0
    }),
    component: RouteComponent,
})

type Gender = 'male' | 'female'
type MeasurementMap = Record<string, string>

const sanitizeAmount = (value: string) =>
    value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')

const toMeasurementMap = (value: unknown): MeasurementMap => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {}
    const result: MeasurementMap = {}
    Object.entries(value as Record<string, unknown>).forEach(([k, v]) => {
        result[k] = v == null ? '' : String(v)
    })
    return result
}

function RouteComponent() {
    const navigate = useNavigate()
    const { id, updateKey } = Route.useSearch()
    const { auth } = useAuth()
    const isUpdateMode = updateKey === 1

    const [isMeasurementOpen, setIsMeasurementOpen] = useState(false)
    const [isPaymentOpen, setIsPaymentOpen] = useState(false)
    const [isFetching, setIsFetching] = useState(isUpdateMode)
    const [isLoading, setIsLoading] = useState(false)

    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        city: '',
        gender: 'male',
    })

    const [measurements, setMeasurements] = useState<Record<Gender, MeasurementMap>>({
        male: {},
        female: {},
    })

    const [payment, setPayment] = useState({
        total: '',
        advance: '',
    })

    const currentGender: Gender = formData.gender === 'female' ? 'female' : 'male'

    const totalNum = parseFloat(payment.total) || 0
    const advanceNum = parseFloat(payment.advance) || 0
    const pendingNum = Math.max(totalNum - advanceNum, 0)
    const advanceTooHigh = totalNum > 0 && advanceNum > totalNum

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

                    setMeasurements({
                        male: toMeasurementMap(data.male_measurements),
                        female: toMeasurementMap(data.female_measurements),
                    })
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
        setMeasurements((prev) => ({
            ...prev,
            [currentGender]: { ...prev[currentGender], [key]: value },
        }))
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
        } else if (totalNum < 0 || advanceNum < 0) {
            toast.warn("રકમ 0 અથવા તેનાથી વધુ હોવી જોઈએ.")
            return
        } else if (advanceTooHigh) {
            toast.warn("અગાઉથી ચુકવણી કુલ રકમ કરતાં વધારે ન હોઈ શકે.")
            return
        }

        setIsLoading(true)
        try {
            const filteredMeasurements: MeasurementMap = {}
            Object.entries(measurements[currentGender]).forEach(([key, val]) => {
                if (val.trim() !== '') {
                    filteredMeasurements[key] = val.trim()
                }
            })

            const payload = {
                customer_name: formData.customer_name.trim(),
                phone: formData.phone.trim(),
                city: formData.city.trim(),
                gender: formData.gender,
                male_measurements: currentGender === 'male' ? filteredMeasurements : {},
                female_measurements: currentGender === 'female' ? filteredMeasurements : {},
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
                visible
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
                    <CustomerDetails
                        formData={formData}
                        onCustomerChange={onCustomerChange}
                    />
                    <MeasurementsDetails
                        formData={formData}
                        isMeasurementOpen={isMeasurementOpen}
                        setIsMeasurementOpen={setIsMeasurementOpen}
                        measurements={measurements[currentGender]}
                        onMeasurementChange={onMeasurementChange}
                    />
                    <PaymentDetails
                        isPaymentOpen={isPaymentOpen}
                        setIsPaymentOpen={setIsPaymentOpen}
                        payment={payment}
                        onPaymentChange={onPaymentChange}
                        advanceTooHigh={advanceTooHigh}
                        pendingNum={pendingNum}
                    />
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