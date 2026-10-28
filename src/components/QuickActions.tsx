import { PAGE_PATH_KEYS } from "#/utils/constant"
import { Link } from "@tanstack/react-router"
import { FaClipboardList } from "react-icons/fa"
import { GrServices } from "react-icons/gr"
import { HiMiniUserGroup } from "react-icons/hi2"
import { IoSettings } from "react-icons/io5"

interface GridMenuItem {
    title: string
    subtitle?: string
    img?: string
    icon?: React.ReactNode
    link: string
    gradient: string
    badge?: string
}

const QuickActions = () => {

    const gridItems: GridMenuItem[] = [
        {
            title: 'નવા ગ્રાહક',
            subtitle: 'Add New Customer',
            img: 'cutomer.png',
            icon: <HiMiniUserGroup size={26} className="text-white" />,
            link: PAGE_PATH_KEYS.CUSTOMER,
            gradient: 'from-purple-600 to-indigo-600',
            badge: 'શરૂ કરો'
        },
        {
            title: 'ગ્રાહકોની યાદી',
            subtitle: 'List & Records',
            img: 'list.png',
            icon: <FaClipboardList size={26} className="text-white" />,
            link: PAGE_PATH_KEYS.LIST,
            gradient: 'from-blue-600 to-cyan-600',
            badge: 'બધા જુઓ'
        },
        {
            title: 'સેટિંગ્સ',
            subtitle: 'Settings',
            icon: <IoSettings size={26} className="text-white" />,
            link: PAGE_PATH_KEYS.SETTINGS,
            gradient: 'from-slate-700 to-slate-900',
            badge: 'પસંદગી'
        },
    ]
    return (
        <div>
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xs font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
                    <span className="animate-spin text-sm"><GrServices /></span>
                    ઝડપી સેવાઓ (Quick Actions)
                </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {gridItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.link}
                        className="group relative bg-white border border-purple-300 rounded-3xl p-4 shadow-sm hover:shadow-2xl hover:border-purple-900 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98]"
                    >
                        <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-100 rounded-full blur-2xl group-hover:bg-purple-200 transition-all duration-500 opacity-50" />

                        <div className="relative z-10 flex items-center justify-between mb-3 mx-auto">
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg shadow-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                                {item.icon}
                            </div>
                        </div>

                        <div className="relative z-10 w-full ">
                            <h3
                                className="text-lg font-bold text-black text-center "
                                title={item.title}
                            >
                                {item.title && item.title.length > 15
                                    ? `${item.title.slice(0, 15)}...`
                                    : item.title}
                            </h3>

                            {item.subtitle && (
                                <p className="text-xs text-slate-400 text-center font-medium group-hover:text-slate-900 transition-colors">
                                    {item.subtitle.length > 25
                                        ? `${item.subtitle.slice(0, 25)}...`
                                        : item.subtitle}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default QuickActions