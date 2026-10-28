import { Link } from '@tanstack/react-router'
import { FaHome } from 'react-icons/fa'
import { PAGE_PATH_KEYS } from '#/utils/constant'

const NotFoundComponent = () => {
    return (
        <div className="h-[90dvh] md:h-screen w-screen text-slate-900 flex items-center justify-center p-4 overflow-hidden relative select-none">
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="max-w-md w-full bg-white/90 backdrop-blur-2xl border border-slate-200/80 rounded-3xl p-6 sm:p-8 text-center space-y-6 shadow-2xl shadow-slate-300/50 relative z-10">
                <div className="space-y-4">
                    <img
                        src="/NotFound.jpg"
                        alt="Not Found"
                        className=" mx-auto object-contain "
                    />
                    <div className="space-y-1">
                        <h2 className="text-base font-bold text-slate-800">
                            <span className="text-purple-600 font-extrabold text-3xl tracking-tight">Page Not Found</span>
                        </h2>
                        <p className="text-xs text-slate-500">
                            The page you are looking for doesn't exist or has been moved.
                        </p>
                    </div>
                </div>

                <div className="pt-1">
                    <Link
                        to={PAGE_PATH_KEYS.HOME}
                        type="button"
                        className="w-full h-11 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 bg-[length:200%_auto] hover:bg-[position:right_center] text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-purple-600/25 hover:shadow-purple-600/40 active:scale-[0.98] flex items-center justify-center gap-2 text-sm group cursor-pointer"
                    >
                        <FaHome className="text-base transition-transform duration-200 group-hover:-translate-y-0.5" />
                        <span>Back to Home</span>
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default NotFoundComponent