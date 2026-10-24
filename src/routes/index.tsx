import { createFileRoute, Link } from '@tanstack/react-router'
import { PAGE_PATH_KEYS } from '@/utils/constant'
import {
  FaUserPlus,
  FaUsers,
  FaShieldAlt,
  FaChartLine,
  FaCog,
  FaPhoneAlt,
} from 'react-icons/fa'
import { FaSprayCanSparkles } from 'react-icons/fa6'
import { globalSiteSettings } from '#/utils/site_settings'

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
  const { siteSettings } = globalSiteSettings()
  console.log("siteSettings", siteSettings);

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
      icon: <FaUserPlus size={26} className="text-white" />,
      link: PAGE_PATH_KEYS.CUSTOMER,
      gradient: 'from-purple-600 to-indigo-600',
      badge: 'શરૂ કરો'
    },
    {
      title: 'ગ્રાહકોની યાદી',
      subtitle: 'List & Records',
      img: 'list.png',
      icon: <FaUsers size={26} className="text-white" />,
      link: PAGE_PATH_KEYS.LIST,
      gradient: 'from-blue-600 to-cyan-600',
      badge: 'બધા જુઓ'
    },
    {
      title: 'સેટિંગ્સ',
      subtitle: 'Settings',
      icon: <FaCog size={26} className="text-white" />,
      link: PAGE_PATH_KEYS.SETTINGS,
      gradient: 'from-slate-700 to-slate-900',
      badge: 'પસંદગી'
    },
  ]
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24 pt-4 md:pt-8 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-20 right-10 w-80 h-80 bg-indigo-300/20 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-5xl mx-auto space-y-8 relative z-10">
        <div className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-purple-950 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-purple-950/10 border border-purple-500/20">
          <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 w-64 h-64 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-col items-start gap-1.5 w-full">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-purple-300 text-xs font-medium mb-1">
              <FaSprayCanSparkles size={12} /> Tailoring Management System
            </div>
            <span className="text-xs font-semibold text-purple-300/80 tracking-wide uppercase">
              Dev: Keval Makvana
            </span>

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
                className="group relative bg-white border border-gray-100 rounded-3xl p-6 shadow-sm hover:shadow-2xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer active:scale-[0.98]"
              >
                <div className="absolute -right-12 -top-12 w-32 h-32 bg-purple-100 rounded-full blur-2xl group-hover:bg-purple-200 transition-all duration-500 opacity-50" />

                <div className="relative z-10 flex items-start justify-between mb-6">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} shadow-lg shadow-purple-600/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    {item.img ? (
                      <img
                        src={`/logos/${item.img}`}
                        alt={item.title}
                        className="w-8 h-8 object-contain filter brightness-0 invert"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none'
                        }}
                      />
                    ) : (
                      item.icon
                    )}
                  </div>
                </div>

                <div className="relative z-10 flex items-end justify-between">
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
                      {item.title}
                    </h3>
                    {item.subtitle && (
                      <p className="text-xs text-gray-400 font-medium mt-0.5">
                        {item.subtitle}
                      </p>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        <div className="pt-6 border-t border-gray-200/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <FaShieldAlt className="text-purple-600" /> ડેટા સુરક્ષિત અને ક્લાઉડ બેક્ડ છે
          </div>
          <div className="flex items-center gap-1.5 font-medium">
            <FaChartLine className="text-indigo-600" /> સ્માર્ટ ટેલરિંગ ડેશબોર્ડ v2.0
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home