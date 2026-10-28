import { FaChartLine, FaHeart, FaShieldAlt } from "react-icons/fa"

const Footer = () => {
    return (
        <footer className="mt-14 border-t border-purple-600">
            <div className="flex flex-col items-center justify-center text-center gap-5 p-4">
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                        <FaShieldAlt className="text-purple-600" size={13} />
                        <span>ડેટા સુરક્ષિત અને ક્લાઉડ બેક્ડ છે</span>
                    </div>

                    <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                        <FaChartLine className="text-indigo-600" size={13} />
                        <span>સ્માર્ટ ટેલરિંગ ડેશબોર્ડ v2.0</span>
                    </div>
                </div>
                <div className="flex flex-col items-center gap-1 text-slate-600">
                    <p className="text-xs font-medium">
                        Designed & Developed By <FaHeart size={11} className="inline text-rose-500 mx-0.5 animate-ping" /> <strong className="text-slate-900 font-bold">Keval Makvana</strong>
                    </p>
                    <a href="mailto:kevalmakvana@gmail.com" className="text-xs font-semibold text-purple-600 hover:underline">
                        <span className="text-slate-800">• </span>techwithkevalquery2211@gmail.com <span className="text-slate-800"> •</span>
                    </a>
                </div>

            </div>
        </footer>
    )
}

export default Footer