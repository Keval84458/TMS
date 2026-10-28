import { useGlobalSiteSettings } from "#/utils/site_settings"
import { FaPhoneAlt } from "react-icons/fa"
import { GiSewingMachine } from "react-icons/gi"

const OwnerDashboard = () => {
    const { siteSettings } = useGlobalSiteSettings()

    const currentDate = new Date().toLocaleDateString('gu-IN', {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })

    return (
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10 border border-purple-500/20">
            <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="relative z-10 flex flex-col items-start gap-1.5 w-full">
                <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-purple-300 text-xs font-medium mb-1">
                    <span><GiSewingMachine size={18} /></span> Tailoring Management System
                </div>

                <div className="flex flex-wrap items-center justify-between w-full gap-x-4 gap-y-1 mt-0.5">
                    <div className="text-2xl font-black tracking-tight text-white">
                        {siteSettings?.owner_name || ''}
                    </div>
                    <div className="text-xs text-slate-300 font-medium leading-relaxed flex items-center gap-1">
                        <FaPhoneAlt className="text-purple-300" size={11} />:
                        <span>{siteSettings?.owner_phone || ''}</span>
                    </div>
                </div>

                <p className="text-xs text-slate-300 mb-3 font-medium leading-relaxed max-w-2xl">
                    તમારા ગ્રાહકોના માપ અને હિસાબ સરળતાથી સંચાલિત કરો.
                </p>
            </div>
            <div className="flex justify-end w-full">
                <span className="text-xs sm:text-sm font-semibold text-purple-200/90 tracking-wide bg-white/5 backdrop-blur-sm border border-white/10 px-3 py-1 rounded-lg">
                    {currentDate}
                </span>
            </div>
        </div>
    )
}

export default OwnerDashboard