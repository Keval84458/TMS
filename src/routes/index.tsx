import { createFileRoute, Link } from '@tanstack/react-router'
import { PAGE_PATH_KEYS } from '@/utils/constant'
import {
  FaUserPlus,
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaCog,
  FaPhoneAlt,
  FaClipboardList,
  FaCode,
  FaHeart,
} from 'react-icons/fa'
import { FaSprayCanSparkles } from 'react-icons/fa6'
import { useGlobalSiteSettings } from '#/utils/site_settings'
import { IoSettings } from 'react-icons/io5'
import { HiMiniUserGroup } from 'react-icons/hi2'


export const Route = createFileRoute('/')({ component: Home })

interface GridMenuItem {
  title: string
  subtitle?: string
  img?: string
  icon?: React.ReactNode
  link: string
  gradient: string
  badge?: string
}

function Home() {
  const { siteSettings } = useGlobalSiteSettings()

  const currentDate = new Date().toLocaleDateString('gu-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

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
    <div className="h-screen bg-slate-50/50 pb-24 pt-4 md:pt-8 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10 border border-purple-500/20">
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-start gap-1.5 w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-purple-300 text-xs font-medium mb-1">
              <FaSprayCanSparkles size={12} /> Tailoring Management System
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

        <div>
          <div className="flex items-center justify-between mb-4 px-1">
            <h2 className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse" />
              ઝડપી સેવાઓ (Quick Actions)
            </h2>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridItems.map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className="group relative bg-white border border-gray-100 rounded-3xl p-4 shadow-sm hover:shadow-2xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98]"
              >
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-100 rounded-full blur-2xl group-hover:bg-purple-200 transition-all duration-500 opacity-50" />

                <div className="relative z-10 flex items-center justify-between mb-3 mx-auto">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg shadow-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {item.icon}
                  </div>
                </div>

                <div className="relative z-10 w-full ">
                  <h3
                    className="text-lg font-bold text-black text-center group-hover:text-purple-300 transition-colors tracking-tight"
                    title={item.title}
                  >
                    {item.title && item.title.length > 15
                      ? `${item.title.slice(0, 15)}...`
                      : item.title}
                  </h3>

                  {item.subtitle && (
                    <p className="text-xs text-slate-400 text-center font-medium group-hover:text-slate-300 transition-colors">
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

        <footer className="mt-14 border-t border-slate-200/80">
          <div className="flex flex-col items-center justify-center text-center gap-5 p-4">

            {/* Status Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <FaShieldAlt className="text-purple-600" size={13} />
                <span>ડેટા સુરક્ષિત અને ક્લાઉડ બેક્ડ છે</span>
              </div>
              <span className="text-slate-300">•</span>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
                <FaChartLine className="text-indigo-600" size={13} />
                <span>સ્માર્ટ ટેલરિંગ ડેશબોર્ડ v2.0</span>
              </div>
            </div>

            {/* Developer Credit */}
            <div className="flex flex-col items-center gap-1 text-slate-600">
              <p className="text-xs font-medium">
                Designed & Developed with <FaHeart size={11} className="inline text-rose-500 mx-0.5 animate-pulse" /> by <strong className="text-slate-900 font-bold">Keval Makvana</strong>
              </p>
              <a href="mailto:kevalmakvana@gmail.com" className="text-xs font-semibold text-purple-600 hover:underline">
                kevalmakvana@gmail.com
              </a>
            </div>

          </div>
        </footer>

      </div>
    </div>
  )
}

export default Home