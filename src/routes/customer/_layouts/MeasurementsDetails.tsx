import { ThemeTextarea } from "#/utils"
import { FaChevronDown, FaRulerCombined, FaTshirt } from "react-icons/fa"
import { GiArmoredPants, GiLargeDress, GiSleevelessTop } from "react-icons/gi"

function RulerIcon() {
    return <FaRulerCombined className="text-purple-600" />
}

const MeasurementsDetails = ({
    formData,
    setIsMeasurementOpen,
    isMeasurementOpen,
    measurements,
    onMeasurementChange
}: any) => {

    return (
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
    )
}

export default MeasurementsDetails