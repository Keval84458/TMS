import { useTranslation } from 'react-i18next'
import { MdLanguage } from 'react-icons/md'

interface LanguageModalProps {
    isOpen: boolean
    onClose: () => void
}

const LanguageModal = ({ isOpen, onClose }: LanguageModalProps) => {
    const { t, i18n } = useTranslation()
    const savedLanguage = localStorage.getItem('i18nextLng')

    if (!isOpen) return null

    const changeLanguage = (lang: string) => {
        i18n.changeLanguage(lang)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-fadeIn">
            <div className="relative w-full max-w-sm rounded-3xl border border-gray-100 bg-white p-6 shadow-2xl text-center space-y-4">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-50 text-purple-600 border border-purple-100">
                    <MdLanguage size={20} />
                </div>

                <div>
                    <h3 className="text-base font-bold text-gray-900">
                        {t('LanguageModal.selectLanguage', 'Select Language')}
                    </h3>
                </div>

                <div className="grid grid-cols-3 gap-3 pt-1">
                    <button
                        type="button"
                        onClick={() => changeLanguage('en')}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${i18n.language === 'en' || savedLanguage === "en-US"
                            ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                    >
                        <span className="text-xs font-bold">{t('LanguageModal.english', 'English')}</span>

                    </button>

                    <button
                        type="button"
                        onClick={() => changeLanguage('gu')}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${i18n.language === 'gu'
                            ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                    >
                        <span className="text-xs font-bold">{t('LanguageModal.gujarati', 'ગુજરાતી')}</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => changeLanguage('hi')}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border transition-all ${i18n.language === 'hi'
                            ? 'bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-200'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300'
                            }`}
                    >
                        <span className="text-xs font-bold">{t('LanguageModal.hindi', 'हिन्दी')}</span>
                    </button>
                </div>

                <div className="pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        className="w-full rounded-xl bg-gray-100 py-2.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-200"
                    >
                        {t('LanguageModal.cancel', 'Cancel')}
                    </button>
                </div>
            </div>
        </div >
    )
}

export default LanguageModal