import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import PageHeader from '#/components/PageHeader'
import { supabase } from '#/lib/supabaseClient'
import { defaultSiteData, ThemeInput, ThemeTextarea } from '#/utils'
import { PAGE_PATH_KEYS } from '#/utils/constant'
import {
    FaGlobe,
    FaHeading,
    FaUser,
    FaPhone,
    FaEnvelope,
    FaMapMarkerAlt,
    FaCity,
    FaSave,
    FaSpinner,
    FaVenusMars,
    FaPlus,
    FaTrash,
    FaRulerCombined,
    FaChevronDown,
} from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useAuth } from '#/utils/auth'
import { refetchSiteSettings, useGlobalSiteSettings } from '#/utils/site_settings'

export const Route = createFileRoute('/settings/')({
    component: RouteComponent,
})

function RouteComponent() {
    const navigate = useNavigate()
    const { auth } = useAuth()
    const { fetchSettingsData } = useGlobalSiteSettings()

    const [isFetching, setIsFetching] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [existingSettingId, setExistingSettingId] = useState<number | null>(null)

    const [isGeneralOpen, setIsGeneralOpen] = useState(false)
    const [isMeasurementOpen, setIsMeasurementOpen] = useState(false)
    const [activeGenderTab, setActiveGenderTab] = useState<'male' | 'female'>('male')

    const [maleProductsInput, setMaleProductsInput] = useState('')
    const [femaleProductsInput, setFemaleProductsInput] = useState('')

    const [maleProducts, setMaleProducts] = useState<string[]>(['Shirt', 'Pant'])
    const [femaleProducts, setFemaleProducts] = useState<string[]>(['Blouse', 'Dress', 'Kurti'])

    const [formData, setFormData] = useState({
        ...defaultSiteData,
        male_measurements: 'Shirt, Pant',
        female_measurements: 'Blouse, Dress, Kurti',
    })

    const [initialData, setInitialData] = useState({
        site_title: '',
        subtitle: '',
        owner_name: '',
        owner_phone: '',
        owner_email: '',
        site_address: '',
        city: '',
        male_measurements: 'Shirt, Pant',
        female_measurements: 'Blouse, Dress, Kurti',
    })

    useEffect(() => {
        const fetchSettings = async () => {
            const currentUserId = auth.authData?.id
            if (!currentUserId) {
                setIsFetching(false)
                return
            }

            try {
                const { data, error } = await supabase
                    .from('site_settings')
                    .select('*')
                    .eq('user_id', currentUserId)
                    .maybeSingle()

                if (error) {
                    toast.error('સેટિંગ્સ લોડ કરવામાં ભૂલ થઈ.')
                } else if (data) {
                    setExistingSettingId(data.id)
                    const mList = data.male_measurements || 'Shirt, Pant'
                    const fList = data.female_measurements || 'Blouse, Dress, Kurti'

                    const loadedData = {
                        site_title: data.site_title || '',
                        subtitle: data.subtitle || '',
                        owner_name: data.owner_name || '',
                        owner_phone: data.owner_phone || '',
                        owner_email: data.owner_email || '',
                        site_address: data.site_address || '',
                        city: data.city || '',
                        male_measurements: mList,
                        female_measurements: fList,
                    }

                    setFormData(loadedData)
                    setInitialData(loadedData)

                    setMaleProducts(mList.split(',').map((s: string) => s.trim()).filter(Boolean))
                    setFemaleProducts(fList.split(',').map((s: string) => s.trim()).filter(Boolean))
                }
            } catch (err) {
                toast.error('અણધારી ભૂલ આવી.')
            } finally {
                setIsFetching(false)
            }
        }

        fetchSettings()
    }, [auth.authData?.id])

    const onChange = (key: string, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }))
    }

    const handleAddProduct = () => {
        if (activeGenderTab === 'male') {
            if (!maleProductsInput.trim()) return
            const newKey = maleProductsInput.trim()
            if (!maleProducts.includes(newKey)) {
                const updated = [...maleProducts, newKey]
                setMaleProducts(updated)
                setFormData((prev) => ({ ...prev, male_measurements: updated.join(', ') }))
            }
            setMaleProductsInput('')
        } else {
            if (!femaleProductsInput.trim()) return
            const newKey = femaleProductsInput.trim()
            if (!femaleProducts.includes(newKey)) {
                const updated = [...femaleProducts, newKey]
                setFemaleProducts(updated)
                setFormData((prev) => ({ ...prev, female_measurements: updated.join(', ') }))
            }
            setFemaleProductsInput('')
        }
    }

    const handleRemoveProduct = (itemToRemove: string) => {
        if (activeGenderTab === 'male') {
            const updated = maleProducts.filter((item) => item !== itemToRemove)
            setMaleProducts(updated)
            setFormData((prev) => ({ ...prev, male_measurements: updated.join(', ') }))
        } else {
            const updated = femaleProducts.filter((item) => item !== itemToRemove)
            setFemaleProducts(updated)
            setFormData((prev) => ({ ...prev, female_measurements: updated.join(', ') }))
        }
    }

    const hasChanges =
        formData.site_title !== initialData.site_title ||
        formData.subtitle !== initialData.subtitle ||
        formData.owner_name !== initialData.owner_name ||
        formData.owner_phone !== initialData.owner_phone ||
        formData.owner_email !== initialData.owner_email ||
        formData.site_address !== initialData.site_address ||
        formData.city !== initialData.city ||
        formData.male_measurements !== initialData.male_measurements ||
        formData.female_measurements !== initialData.female_measurements

    const HandleSubmit = async () => {
        if (!formData.site_title.trim()) {
            toast.warn("કૃપા કરીને સાઈટનું નામ ભરો.")
            return
        } else if (!formData.owner_name.trim()) {
            toast.warn("કૃપા કરીને માલિકનું નામ ભરો.")
            return
        } else if (!formData.owner_phone.trim()) {
            toast.warn("કૃપા કરીને ફોન નંબર ભરો.")
            return
        }

        setIsLoading(true)
        try {
            const currentUserId = auth.authData?.id

            const payload = {
                site_title: formData.site_title.trim(),
                subtitle: formData.subtitle.trim(),
                owner_name: formData.owner_name.trim(),
                owner_phone: formData.owner_phone.trim(),
                owner_email: formData.owner_email.trim(),
                site_address: formData.site_address.trim(),
                city: formData.city.trim(),
                male_measurements: maleProducts.join(', '),
                female_measurements: femaleProducts.join(', '),
                user_id: currentUserId,
                updated_at: new Date().toISOString(),
            }

            let error = null

            if (existingSettingId) {
                const response = await supabase
                    .from('site_settings')
                    .update(payload)
                    .eq('id', existingSettingId)
                error = response.error
            } else {
                const response = await supabase
                    .from('site_settings')
                    .insert([payload])
                    .select()
                    .single()

                if (response.data) {
                    setExistingSettingId(response.data.id)
                }
                error = response.error
            }

            if (error) {
                toast.error(error.message)
                return
            }
            refetchSiteSettings()
            await fetchSettingsData()

            setInitialData(formData)

            toast.success("સેટિંગ્સ સફળતાપૂર્વક સેવ થઈ ગઈ છે.")
            navigate({ to: PAGE_PATH_KEYS.HOME })

        } catch {
            toast.error("કંઈક ખોટું થયું. ફરીથી પ્રયાસ કરો.")
        } finally {
            setIsLoading(false)
        }
    }

    if (isFetching) {
        return (
            <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <p className="text-gray-500 text-sm font-medium">સેટિંગ્સ લોડ થઈ રહી છે...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-12 mt-[3.4rem]">
            <PageHeader
                title="Settings"
                onBack={PAGE_PATH_KEYS.HOME}
            />
            <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-6">


                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">
                    <button
                        type="button"
                        onClick={() => setIsGeneralOpen(!isGeneralOpen)}
                        className="w-full flex items-center justify-between text-left focus:outline-none group py-1 border-b border-gray-100 pb-4"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-600" />
                                General Settings
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                તમારી દુકાન અને સાઈટની સામાન્ય વિગતો અહીં અપડેટ કરો
                            </p>
                        </div>
                        <FaChevronDown
                            className={`text-purple-600 transition-transform duration-300 ${isGeneralOpen ? 'rotate-180' : ''}`}
                            size={16}
                        />
                    </button>

                    <div
                        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isGeneralOpen ? 'grid-rows-[1fr] opacity-100 space-y-4' : 'grid-rows-[0fr] opacity-0 space-y-0'
                            }`}
                    >
                        <div className="overflow-hidden space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <FaGlobe className="text-purple-600" /> સાઈટનું શીર્ષક (Site Title) *
                                    </label>
                                    <ThemeInput
                                        type="text"
                                        placeholder="દા.ત. TailorHub2211"
                                        className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                        value={formData.site_title}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('site_title', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <FaHeading className="text-purple-600" /> સબટાઈટલ (Subtitle)
                                    </label>
                                    <ThemeInput
                                        type="text"
                                        placeholder="દા.ત. Tailoring Management System"
                                        className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                        value={formData.subtitle}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('subtitle', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <FaUser className="text-purple-600" /> માલિકનું નામ (Owner Name) *
                                    </label>
                                    <ThemeInput
                                        type="text"
                                        placeholder="દા.ત. કેવલ મકવાણા"
                                        className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                        value={formData.owner_name}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('owner_name', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <FaPhone className="text-purple-600" /> ફોન નંબર (Phone) *
                                    </label>
                                    <ThemeInput
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder="દા.ત. 1234567890"
                                        className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                        value={formData.owner_phone}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            onChange('owner_phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                                        }
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <FaEnvelope className="text-purple-600" /> ઈમેઈલ સરનામું (Email)
                                    </label>
                                    <ThemeInput
                                        type="email"
                                        placeholder="દા.ત. abc123@gmail.com"
                                        className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                        value={formData.owner_email}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('owner_email', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <FaCity className="text-purple-600" /> શહેર (City)
                                    </label>
                                    <ThemeInput
                                        type="text"
                                        placeholder="દા.ત. Wembley"
                                        className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                        value={formData.city}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('city', e.target.value)}
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                        <FaMapMarkerAlt className="text-purple-600" /> સાઈટ સરનામું (Address)
                                    </label>
                                    <ThemeTextarea
                                        placeholder="દુકાન અથવા સાઈટનું પૂરૂ સરનામું લખો..."
                                        className="w-full h-[80px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                        value={formData.site_address}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('site_address', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 sm:p-7 space-y-6">
                    <button
                        type="button"
                        onClick={() => setIsMeasurementOpen(!isMeasurementOpen)}
                        className="w-full flex items-center justify-between text-left focus:outline-none group py-1 border-b border-gray-100 pb-4"
                    >
                        <div>
                            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-purple-600" />
                                Measurement Categories
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                પુરુષ અને સ્ત્રી વિભાગ માટે માપના વિકલ્પો મેનેજ કરો
                            </p>
                        </div>
                        <FaChevronDown
                            className={`text-purple-600 transition-transform duration-300 ${isMeasurementOpen ? 'rotate-180' : ''}`}
                            size={16}
                        />
                    </button>

                    <div
                        className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isMeasurementOpen ? 'grid-rows-[1fr] opacity-100 space-y-4' : 'grid-rows-[0fr] opacity-0 space-y-0'
                            }`}
                    >
                        <div className="overflow-hidden space-y-4 pt-1">
                            <div>
                                <label className="block text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
                                    <FaVenusMars className="text-purple-600" /> કેટેગરી પસંદ કરો (Gender Category) *
                                </label>
                                <div className="flex gap-4 h-[44px] items-center px-3 border border-gray-200 rounded-xl bg-slate-50 w-fit">
                                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                        <input
                                            type="radio"
                                            name="measurementGender"
                                            value="male"
                                            checked={activeGenderTab === 'male'}
                                            onChange={() => setActiveGenderTab('male')}
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        પુરુષ (Male Products)
                                    </label>
                                    <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                                        <input
                                            type="radio"
                                            name="measurementGender"
                                            value="female"
                                            checked={activeGenderTab === 'female'}
                                            onChange={() => setActiveGenderTab('female')}
                                            className="text-purple-600 focus:ring-purple-500"
                                        />
                                        સ્ત્રી (Female Products)
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4 pt-2">
                                <div className="flex gap-2">
                                    <ThemeInput
                                        type="text"
                                        placeholder={`નવું પ્રોડક્ટ કી ઉમેરો (દા.ત. ${activeGenderTab === 'male' ? 'Kurta, Suit' : 'Suit, Lehenga'})`}
                                        className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl text-sm"
                                        value={activeGenderTab === 'male' ? maleProductsInput : femaleProductsInput}
                                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                            activeGenderTab === 'male'
                                                ? setMaleProductsInput(e.target.value)
                                                : setFemaleProductsInput(e.target.value)
                                        }
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault()
                                                handleAddProduct()
                                            }
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddProduct}
                                        className="px-4 h-[44px] bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all shadow-sm"
                                    >
                                        <FaPlus size={12} /> ઉમેરો
                                    </button>
                                </div>
                                <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 space-y-2">
                                    <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5 uppercase tracking-wider">
                                        <FaRulerCombined className="text-purple-600" />
                                        {activeGenderTab === 'male' ? 'પુરુષ માપ કીઝ (Male Keys):' : 'સ્ત્રી માપ કીઝ (Female Keys):'}
                                    </span>
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {(activeGenderTab === 'male' ? maleProducts : femaleProducts).map((productKey) => (
                                            <div
                                                key={productKey}
                                                className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-purple-200 text-purple-900 rounded-lg text-xs font-semibold shadow-xs"
                                            >
                                                <span>{productKey}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveProduct(productKey)}
                                                    className="text-red-500 hover:text-red-700 transition-colors p-0.5"
                                                    title="કાઢી નાખો"
                                                >
                                                    <FaTrash size={10} />
                                                </button>
                                            </div>
                                        ))}
                                        {(activeGenderTab === 'male' ? maleProducts : femaleProducts).length === 0 && (
                                            <p className="text-xs text-gray-400 italic">કોઈ પ્રોડક્ટ કી ઉમેરેલ નથી.</p>
                                        )}
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-[11px] text-gray-500">
                                    <div>
                                        <span className="font-semibold text-gray-700">Male DB Value:</span> {formData.male_measurements}
                                    </div>
                                    <div>
                                        <span className="font-semibold text-gray-700">Female DB Value:</span> {formData.female_measurements}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {hasChanges && (
                    <div className="pt-2 animate-fadeIn">
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={HandleSubmit}
                            className="w-full h-[46px] bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold rounded-xl transition-all duration-200 shadow-md shadow-purple-600/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2 text-sm"
                        >
                            {isLoading ? (
                                <>
                                    <FaSpinner className="animate-spin text-lg" />
                                    <span>સેવ થઈ રહ્યું છે...</span>
                                </>
                            ) : (
                                <>
                                    <FaSave className="text-base" />
                                    <span>સેટિંગ્સ સેવ કરો (Save Settings)</span>
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}