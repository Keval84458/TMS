
import { useEffect, useState } from 'react'
import { FaDownload } from 'react-icons/fa'

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
                console.error('Installation failed:', error)
            }

            return
        }

        // No native install prompt available
        console.warn('The browser install prompt is not available.')
    }

    if (isInstalled) return null

    return (
        <button
            type="button"
            onClick={handleInstall}
            className="inline-flex items-center gap-2 rounded-xl bg-purple-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-purple-700 active:scale-95"
        >
            <FaDownload />
            Install App
        </button>
    )
}

export default InstallApp
