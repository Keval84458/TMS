import { useAuth } from "#/utils/auth";
import { PAGE_PATH_KEYS } from "#/utils/constant";
import { useGlobalSiteSettings } from "#/utils/site_settings";
import { Link } from "@tanstack/react-router";
import { TbLogout2 } from "react-icons/tb";
import InstallApp from "./InstallApp";

const Header = () => {
    const { logout } = useAuth();
    const { siteSettings } = useGlobalSiteSettings();
    const siteTitle = siteSettings?.site_title?.trim() || 'K';
    const siteSubtitle = siteSettings?.subtitle?.trim() || '';

    const displayTitle = siteTitle.length > 15
        ? `${siteTitle.slice(0, 15)}...`
        : siteTitle;

    return (
        <header className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-purple-500/20 shadow-[0_4px_20px_rgba(168,85,247,0.1)]">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between">
                <Link to={PAGE_PATH_KEYS.HOME} className="flex items-center gap-3">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-purple-600/40">
                            {siteTitle.charAt(0).toUpperCase()}
                        </div>
                        <span className="absolute animate-ping -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
                    </div>
                    <div>
                        <h1
                            className="text-base font-extrabold text-white uppercase tracking-wider"
                            title={siteTitle}
                        >
                            {displayTitle}
                        </h1>
                        {siteSubtitle && (
                            <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest block">
                                {siteSubtitle}
                            </span>
                        )}
                    </div>

                </Link>

                <div className="flex items-center gap-2">
                    <InstallApp />

                    <button
                        onClick={logout}
                        className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white transition-all duration-200"
                        title="Logout"
                    >
                        <TbLogout2 size={18} />
                    </button>
                </div>


            </div>
        </header>
    );
};

export default Header;