import { useAuth } from "#/utils/auth";
import { PAGE_PATH_KEYS } from "#/utils/constant";
import { useGlobalSiteSettings } from "#/utils/site_settings";
import { Link } from "@tanstack/react-router";
import { TbLogout2 } from "react-icons/tb";
import InstallApp from "./InstallApp";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";
import { MdLanguage } from "react-icons/md";
import { HiDotsVertical } from "react-icons/hi";
import LanguageModal from "#/locales/components/LanguageModal";

const Header = () => {
    const { logout } = useAuth();
    const { siteSettings } = useGlobalSiteSettings();
    const siteTitle = siteSettings?.site_title?.trim() || 'K';
    const siteSubtitle = siteSettings?.subtitle?.trim() || '';
    const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false)

    const displayTitle = siteTitle.length > 15
        ? `${siteTitle.slice(0, 15)}...`
        : siteTitle;


    const { t, i18n } = useTranslation()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
    }

    // Close dropdown menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    return (
        <>
            <LanguageModal
                isOpen={isLanguageModalOpen}
                onClose={() => setIsLanguageModalOpen(false)}
            />
            <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-purple-500/20 shadow-[0_4px_20px_rgba(168,85,247,0.1)]">
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
                        <div className="relative" ref={menuRef}>
                            <button
                                type="button"
                                onClick={() => setIsMenuOpen((prev) => !prev)}
                                className="p-2.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white transition-all duration-200 flex items-center justify-center shadow-lg shadow-purple-950/50 hover:shadow-purple-600/30"
                                title="Menu"
                            >
                                <HiDotsVertical size={18} />
                            </button>
                            <div
                                className={`absolute right-0 mt-2.5 w-52 rounded-2xl bg-slate-900/95 backdrop-blur-xl border border-purple-500/30 shadow-[0_10px_30px_rgba(0,0,0,0.5)] p-2 z-50 space-y-1 transition-all duration-200 origin-top-right ${isMenuOpen
                                    ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
                                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        setIsLanguageModalOpen(true)
                                    }}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-purple-200 hover:bg-purple-600/20 hover:text-white rounded-xl transition-all text-left border border-transparent hover:border-purple-500/30 group"
                                >
                                    <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400 group-hover:text-purple-300 transition-colors">
                                        <MdLanguage size={16} />
                                    </div>
                                    <span>{t('MenuItems.Language')}</span>
                                </button>

                                <div className="px-1 py-0.5">
                                    <InstallApp />
                                </div>

                                <div className="h-px bg-slate-800/80 my-1 mx-1" />

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsMenuOpen(false)
                                        logout()
                                    }}
                                    className="w-full flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold text-red-400 hover:bg-red-500/15 hover:text-red-300 rounded-xl transition-all text-left border border-transparent hover:border-red-500/30 group"
                                >
                                    <div className="p-1.5 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 group-hover:text-red-300 transition-colors">
                                        <TbLogout2 size={16} />
                                    </div>
                                    <span>{t('MenuItems.Logout')}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </header >
        </>
    );
};

export default Header;