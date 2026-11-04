import { OTHER_KEY } from ".";

type MeasurementMap = Record<string, unknown> | null | undefined
export const toItems = (value: MeasurementMap): { key: string; value: string }[] => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) return []

    const items = Object.entries(value)
        .map(([key, val]) => ({
            key: key.trim(),
            value: val == null ? '' : String(val).trim(),
        }))
        .filter((item) => item.key && item.value)

    return [
        ...items.filter((i) => i.key.toLowerCase() !== OTHER_KEY),
        ...items.filter((i) => i.key.toLowerCase() === OTHER_KEY),
    ]
}

export const objIsNotEmpty = (obj: any): boolean => {
    if (obj === null || typeof obj !== 'object') {
        return false
    }
    return Object.keys(obj).length !== 0
}

export const parseKeys = (value: unknown): string[] => {
    if (typeof value !== 'string') return []
    return [
        ...new Set(
            value
                .split(',')
                .map((k) => k.trim())
                .filter((k) => k && k.toLowerCase() !== OTHER_KEY)
        ),
    ]
}


export const sanitizeAmount = (value: string) =>
    value.replace(/[^\d.]/g, '').replace(/(\..*)\./g, '$1')

export const currentDate = new Date().toLocaleDateString('gu-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
})