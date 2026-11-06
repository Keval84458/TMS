
import { useEffect, useState } from 'react'
import { FaDownload } from 'react-icons/fa'
import { useGlobalToast } from './CustomeToast'
import { useTranslation } from 'react-i18next'

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>
    userChoice: Promise<{
        outcome: 'accepted' | 'dismissed'
        platform: string
    }>
}

const InstallApp = () => {
    const [installPrompt, setInstallPrompt] =
        useState<BeforeInstallPromptEvent | null>(null)
    const { t } = useTranslation()

    const [isInstalled, setIsInstalled] = useState(false)
    const [, setToastState] = useGlobalToast()

    useEffect(() => {
        const standaloneQuery = window.matchMedia(
            '(display-mode: standalone)',
        )

        const checkInstalled = () => {
            const installed =
                standaloneQuery.matches ||
                (navigator as Navigator & { standalone?: boolean })
                    .standalone === true

            setIsInstalled(installed)
        }

        const handleBeforeInstall = (event: Event) => {
            event.preventDefault()
            setInstallPrompt(event as BeforeInstallPromptEvent)
        }

        const handleInstalled = () => {
            setIsInstalled(true)
            setInstallPrompt(null)
        }

        checkInstalled()

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstall,
        )
        window.addEventListener('appinstalled', handleInstalled)
        standaloneQuery.addEventListener('change', checkInstalled)

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstall,
            )
            window.removeEventListener('appinstalled', handleInstalled)
            standaloneQuery.removeEventListener('change', checkInstalled)
        }
    }, [])

    const handleInstall = async () => {
        if (installPrompt) {
            try {
                await installPrompt.prompt()

                const result = await installPrompt.userChoice

                if (result.outcome === 'accepted') {
                    setInstallPrompt(null)
                }
            } catch (error) {
                setToastState({
                    show: true,
                    type: 'E',
                    msg: 'Installation failed:',
                })
            }
            return
        }

        setToastState({
            show: true,
            type: 'E',
            msg: t('SiteMessageWithLanguages.INSTALL_PROPMT_NOT_AVAILABLE')
        })
    }
    if (isInstalled) return null

    return (
        <button
            type="button"
            onClick={handleInstall}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-purple-200 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition-all text-left"
        >
            <div className="p-1.5 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-400 group-hover:text-purple-300 transition-colors">
                <FaDownload size={16} />
            </div>
            <span>{t('MenuItems.InstallApp')}</span>
        </button>
    )
}

export default InstallApp
