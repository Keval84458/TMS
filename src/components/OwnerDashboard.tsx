import { useGlobalSiteSettings } from "#/utils/site_settings"
import { FaPhoneAlt, FaUsers } from "react-icons/fa"
import { MdOutlineRefresh } from "react-icons/md"
import { useCustomers } from "#/utils/useCustomers"
import { useTranslation } from "react-i18next"

const OwnerDashboard = () => {
    const { siteSettings } = useGlobalSiteSettings()
    const { customers, isLoading, refetch } = useCustomers()
    const { t } = useTranslation()

    return (
        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border-t-4 border-t-purple-500 border-x border-b border-slate-800 p-6 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <div className="relative flex items-center justify-center">
                        <div className="absolute inset-0 rounded-xl bg-purple-500 blur-md animate-pulse pointer-events-none" />
                        <div className="relative w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shadow-lg">
                            <img src="/favicon.ico" className="w-6 h-6 rounded" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white tracking-wide">
                            {siteSettings?.owner_name || 'Owner'}
                        </h2>
                        <p className="text-xs text-purple-400 font-medium">
                            {t('OwnerDashboard.Subtitle', "Tailor Management System")}
                        </p>
                    </div>
                </div>

                <div className="flex items-center justify-between gap-3">
                    {siteSettings?.owner_phone && (
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/60 text-xs text-slate-300">
                            <FaPhoneAlt size={10} className="text-purple-400" />
                            <span>{siteSettings.owner_phone}</span>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-purple-950/60 border border-purple-800/50 text-xs font-bold text-purple-200">
                            <FaUsers size={12} className="text-purple-400" />
                            <span>{isLoading ? "..." : customers.length.toLocaleString('en-IN')} {t('OwnerDashboard.CustomerCountName', "Customers")}</span>
                        </div>

                        <button
                            onClick={refetch}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-purple-600 text-slate-400 hover:text-white transition-colors"
                        >
                            <MdOutlineRefresh size={18} className={isLoading ? "animate-spin" : ""} />
                        </button>
                    </div>


                </div>
            </div>
        </div>
    )
}

export default OwnerDashboard