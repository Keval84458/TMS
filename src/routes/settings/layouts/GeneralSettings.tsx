import { ThemeInput, ThemeTextarea } from "#/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BsToggle2Off, BsToggle2On } from "react-icons/bs";
import { FaCity, FaEnvelope, FaGlobe, FaHeading, FaMapMarkerAlt, FaPhone, FaSortDown, FaUser } from "react-icons/fa";

const GeneralSettings = ({
    formData,
    onChange,
    setIsMaleEnabled,
    setIsFemaleEnabled,
    isMaleEnabled,
    isFemaleEnabled,
}: any) => {
    const [isGeneralOpen, setIsGeneralOpen] = useState(false)
    const { t } = useTranslation()

    return (
        <div className="bg-white rounded-2xl shadow-sm px-4 py-2 space-y-6">
            <button
                type="button"
                onClick={() => setIsGeneralOpen(!isGeneralOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none group py-1 mb-0"
            >
                <div>
                    <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-purple-600" />
                        {t("Settings.GeneralSettings.GeneralSettingsTitle")}
                    </h2>
                    <p className="text-xs text-gray-500 mt-1">
                        {t("Settings.GeneralSettings.GeneralSettingsSubTitle")}
                    </p>
                </div>
                <FaSortDown
                    className={`text-purple-600 transition-transform duration-300 ${isGeneralOpen ? 'rotate-180' : 'rotate-0'}`}
                    size={20}
                />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isGeneralOpen ? 'grid-rows-[1fr] opacity-100 space-y-4' : 'grid-rows-[0fr] opacity-0 space-y-0'}`}
            >
                <div className="overflow-hidden space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 border-t border-gray-200 pt-4">
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaGlobe className="text-purple-600" /> {t("Settings.GeneralSettings.SiteTitleLabel")} *
                            </label>
                            <ThemeInput
                                type="text"
                                placeholder={t("Settings.GeneralSettings.SiteTitlePlaceholder")}
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={formData.site_title}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('site_title', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaHeading className="text-purple-600" /> {t("Settings.GeneralSettings.SiteSubTitleLabel")}
                            </label>
                            <ThemeInput
                                type="text"
                                placeholder={t("Settings.GeneralSettings.SiteSubTitlePlaceholder")}
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={formData.subtitle}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('subtitle', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaUser className="text-purple-600" /> {t("Settings.GeneralSettings.OwnerNameLabel")} *
                            </label>
                            <ThemeInput
                                type="text"
                                placeholder={t("Settings.GeneralSettings.OwnerNamePlaceholder")}
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={formData.owner_name}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('owner_name', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaPhone className="text-purple-600" /> {t("Settings.GeneralSettings.MobileNumberLabel")} *
                            </label>
                            <ThemeInput
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder={t("Settings.GeneralSettings.MobileNumberPlaceholder")}
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={formData.owner_phone}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                    onChange('owner_phone', e.target.value.replace(/\D/g, '').slice(0, 10))
                                }
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaEnvelope className="text-purple-600" /> {t("Settings.GeneralSettings.EmailLabel")}
                            </label>
                            <ThemeInput
                                type="email"
                                placeholder={t("Settings.GeneralSettings.EmailPlaceholder")}
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={formData.owner_email}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('owner_email', e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaCity className="text-purple-600" /> {t("Settings.GeneralSettings.CityLabel")}
                            </label>
                            <ThemeInput
                                type="text"
                                placeholder={t("Settings.GeneralSettings.CityPlaceholder")}
                                className="w-full h-[44px] px-3.5 border-gray-200 focus:border-purple-600 rounded-xl"
                                value={formData.city}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange('city', e.target.value)}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-gray-700 mb-1.5 flex items-center gap-1.5">
                                <FaMapMarkerAlt className="text-purple-600" /> {t("Settings.GeneralSettings.AddressLabel")}
                            </label>
                            <ThemeTextarea
                                placeholder={t("Settings.GeneralSettings.AddressPlaceholder")}
                                className="w-full h-[80px] p-3 border-gray-200 focus:border-purple-600 rounded-xl text-sm resize-none"
                                value={formData.site_address}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange('site_address', e.target.value)}
                            />
                        </div>


                        <div className="bg-white flex items-center gap-4">
                            <div className="flex items-center justify-between gap-1 p-2 rounded-md hover:bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setIsMaleEnabled((prev: any) => !prev)}
                                    className="focus:outline-none text-2xl transition-colors duration-200"
                                    aria-label="Toggle Male Category"
                                >
                                    {isMaleEnabled ? (
                                        <BsToggle2On className="text-green-600" />
                                    ) : (
                                        <BsToggle2Off className="text-gray-400" />
                                    )}
                                </button>
                                <label className="text-xs font-semibold text-gray-700 cursor-pointer">{t("Settings.GeneralSettings.Male")}</label>
                            </div>

                            <div className="flex items-center justify-between gap-1 p-2 hover:bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setIsFemaleEnabled((prev: any) => !prev)}
                                    className="focus:outline-none text-2xl transition-colors duration-200"
                                    aria-label="Toggle Female Category"
                                >
                                    {isFemaleEnabled ? (
                                        <BsToggle2On className="text-green-600" />
                                    ) : (
                                        <BsToggle2Off className="text-gray-400" />
                                    )}
                                </button>
                                <label className="text-xs font-semibold text-gray-700 cursor-pointer">{t("Settings.GeneralSettings.Female")}</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GeneralSettings;