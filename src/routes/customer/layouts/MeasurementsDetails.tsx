import { OTHER_KEY, ThemeTextarea } from '#/utils'
import { parseKeys } from '#/utils/reusableFunctions'
import { useGlobalSiteSettings } from '#/utils/site_settings'
import { useTranslation } from 'react-i18next'
import { FaChevronDown, FaRulerCombined, FaStickyNote } from 'react-icons/fa'

const MeasurementsDetails = ({
    formData,
    setIsMeasurementOpen,
    isMeasurementOpen,
    measurements,
    onMeasurementChange,
}: any) => {
    const { siteSettings } = useGlobalSiteSettings()
    const { t } = useTranslation()

    const keys = parseKeys(
        formData.gender === 'female'
            ? siteSettings.female_measurements
            : siteSettings.male_measurements
    )
    return (
        <div className="pt-4 border-t border-gray-100">
            <button
                type="button"
                onClick={() => setIsMeasurementOpen(!isMeasurementOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none group py-1"
            >
                <h3 className="text-xs font-bold text-gray-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FaRulerCombined className="text-purple-600" /> {t('NewCustomer.MeasurementsDetails', 'Measurements Details')}
                </h3>
                <FaChevronDown
                    className={`text-purple-600 transition-transform duration-300 ${isMeasurementOpen ? 'rotate-180' : ''
                        }`}
                    size={14}
                />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isMeasurementOpen
                    ? 'grid-rows-[1fr] opacity-100 mt-4'
                    : 'grid-rows-[0fr] opacity-0 mt-0'
                    }`}
            >
                <div className="overflow-hidden space-y-4">
                    {keys.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {keys.map((key) => (
                                <div key={key}>
                                    <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                                        <FaRulerCombined className="text-purple-600" /> {key}
                                    </label>
                                    <ThemeTextarea
                                        placeholder="Ex: 12 | 15 | 18"
                                        className="w-full h-[90px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                        value={measurements?.[key] ?? ''}
                                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                            onMeasurementChange(key, e.target.value)
                                        }
                                    />
                                </div>
                            ))}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-semibold text-gray-700 mb-1 flex items-center gap-1">
                            <FaStickyNote className="text-purple-600" /> {t('NewCustomer.OtherMeasurements', 'Other Measurements / Notes')}
                        </label>
                        <ThemeTextarea
                            placeholder={t('NewCustomer.OtherMeasurementsPlaceholder', 'અન્ય માપ / નોંધો અહીં લખો...')}
                            className="w-full h-[80px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                            value={measurements?.[OTHER_KEY] ?? ''}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                onMeasurementChange(OTHER_KEY, e.target.value)
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MeasurementsDetails