import { ThemeInput, ThemeTextarea } from "#/utils";
import { useState } from "react";
import { BsToggleOff, BsToggleOn } from "react-icons/bs";
import { FaChevronDown, FaCity, FaEnvelope, FaFemale, FaGlobe, FaHeading, FaMale, FaMapMarkerAlt, FaPhone, FaSortDown, FaSortUp, FaUser } from "react-icons/fa";

const GeneralSettings = ({
    formData,
    onChange,
    setIsMaleEnabled,
    setIsFemaleEnabled,
    isMaleEnabled,
    isFemaleEnabled,
}: any) => {
    const [isGeneralOpen, setIsGeneralOpen] = useState(false)

    return (
        <div className="bg-white rounded-2xl shadow-sm px-4  py-2 space-y-6">
            <button
                type="button"
                onClick={() => setIsGeneralOpen(!isGeneralOpen)}
                className="w-full flex items-center justify-between text-left focus:outline-none group py-1  mb-0"
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
                <FaSortDown
                    className={`text-purple-600 transition-transform duration-300 ${isGeneralOpen ? 'rotate-180' : 'rotate-0'
                        }`}
                    size={20}
                />
            </button>

            <div
                className={`grid transition-all duration-300 ease-in-out overflow-hidden ${isGeneralOpen ? 'grid-rows-[1fr] opacity-100 space-y-4' : 'grid-rows-[0fr] opacity-0 space-y-0'
                    }`}
            >
                <div className="overflow-hidden space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 border-t border-gray-200 pt-4">
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


                        <div className="bg-white flex items-center justify-between">
                            <div className="flex items-center justify-between gap-1 p-2 rounded-md hover:bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setIsMaleEnabled((prev: any) => !prev)}
                                    className="focus:outline-none text-2xl transition-colors duration-200"
                                    aria-label="Toggle Male Category"
                                >
                                    {isMaleEnabled ? (
                                        <BsToggleOn className="text-green-600" />
                                    ) : (
                                        <BsToggleOff className="text-gray-400" />
                                    )}
                                </button>
                                <label className="text-xs font-semibold text-gray-700 cursor-pointer">Male (પુરુષ)</label>
                            </div>

                            <div className="flex items-center justify-between gap-1 p-2 hover:bg-gray-50">
                                <button
                                    type="button"
                                    onClick={() => setIsFemaleEnabled((prev: any) => !prev)}
                                    className="focus:outline-none text-2xl transition-colors duration-200"
                                    aria-label="Toggle Female Category"
                                >
                                    {isFemaleEnabled ? (
                                        <BsToggleOn className="text-green-600" />
                                    ) : (
                                        <BsToggleOff className="text-gray-400" />
                                    )}
                                </button>
                                <label className="text-xs font-semibold text-gray-700 cursor-pointer">Female (સ્ત્રી)</label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default GeneralSettings;