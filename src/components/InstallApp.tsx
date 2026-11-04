
import { useEffect, useState } from 'react'
import { FaDownload } from 'react-icons/fa'
import { useGlobalToast } from './CustomeToast'
import { SITE_MESSAGES } from '#/utils/constant'

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
            msg: SITE_MESSAGES.INSTALL_PROPMT_NOT_AVAILABLE,
        })
    }
    if (isInstalled) return null

    return (
        <button
            type="button"
            onClick={handleInstall}
            className="hidden md:inline-flex p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white transition-all duration-200"
        >
            <FaDownload />
        </button>
    )
}

export default InstallApp
