
import { useTranslation } from "react-i18next"
import { FaChartLine, FaHeart, FaShieldAlt } from "react-icons/fa"

const Footer = () => {
    const { t, i18n } = useTranslation()

    const locale = i18n.language === 'gu' ? 'gu-IN' : 'en-IN'

    const currentDate = new Date().toLocaleDateString(locale, {
        weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    })


    return (
        <footer className="mt-14 border-t border-purple-600">
            <div className="flex flex-col items-center justify-center text-center gap-5 p-4">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                        <FaShieldAlt className="text-purple-600" size={13} />
                        <span>{t('Footer.DataSecured', "Data is secure and cloud-backed")}</span>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                        <FaChartLine className="text-indigo-600" size={13} />
                        <span>{t('Footer.AppVersion', "Smart Tailoring Dashboard v2.0")}</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-600">
                    <p className="text-xs font-medium">
                        {t('Footer.DesignedBy', "Designed & Developed By")} <FaHeart size={11} className="inline text-rose-500 mx-0.5 animate-ping" /> <strong className="text-slate-900 font-bold">Keval Makvana</strong>
                    </p>
                    <a href="mailto:kevalmakvana@gmail.com" className="text-xs font-semibold text-purple-600 hover:underline">
                        <span className="text-slate-800">• </span>{t('Footer.Email', "techwithkevalquery2211@gmail.com")} <span className="text-slate-800"> •</span>
                    </a>
                </div>

                <div className="inline-flex items-center px-3.5 py-2 rounded-xl bg-purple-500 border border-purple-500/20 text-xs font-semibold text-white">
                    {currentDate}
                </div>
            </div>
        </footer>
    )
}

export default Footer