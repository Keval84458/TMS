import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import PageHeader from '#/components/PageHeader'
import { supabase } from '#/lib/supabaseClient'
import { defaultSiteData } from '#/utils'
import { PAGE_PATH_KEYS } from '#/utils/constant'
import { FaSave, FaSpinner } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { useAuth } from '#/utils/auth'
import { refetchSiteSettings, useGlobalSiteSettings } from '#/utils/site_settings'
import GeneralSettings from './_layouts/GeneralSettings'
import MeasurementSettings from './_layouts/MeasurementSettings'

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
                                    <span>સેટિંગ્સ સેવ કરો</span>
                                </>
                            )}
                        </button>
                    </div>
                )}

                <GeneralSettings
                    formData={formData}
                    onChange={onChange}
                />
                <MeasurementSettings
                    activeGenderTab={activeGenderTab}
                    setActiveGenderTab={setActiveGenderTab}
                    setMaleProductsInput={setMaleProductsInput}
                    setFemaleProductsInput={setFemaleProductsInput}
                    handleAddProduct={handleAddProduct}
                    maleProductsInput={maleProductsInput}
                    femaleProductsInput={femaleProductsInput}
                    maleProducts={maleProducts}
                    handleRemoveProduct={handleRemoveProduct}
                    femaleProducts={femaleProducts}
                    formData
                />
            </div>
        </div>
    )
}