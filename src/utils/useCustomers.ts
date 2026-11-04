import { useState, useEffect, useCallback } from 'react'
import { supabase } from '#/lib/supabaseClient'
import { useGlobalToast } from '#/components/CustomeToast'
import { SITE_MESSAGES } from '#/utils/constant'

export interface Customer {
    id: string
    user_id: string
    customer_name: string
    phone: string
    city: string
    gender: string
    male_measurements: any
    female_measurements: any
    created_at: string
    total_amount: number
    advance_amount: number
    pending_amount: number
}

export const useCustomers = () => {
    const [customers, setCustomers] = useState<Customer[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [, setToastState] = useGlobalToast()

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true)

        try {
            const cookie = document.cookie
                .split('; ')
                .find((item) => item.startsWith('authData='))

            if (!cookie) {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: SITE_MESSAGES.LOGIN_TO_VIEW_CUSTOMER,
                })
                return
            }

            let authData: { id: string; token: string }

            try {
                const cookieValue = cookie.substring('authData='.length)
                try {
                    authData = JSON.parse(decodeURIComponent(cookieValue))
                } catch {
                    authData = JSON.parse(cookieValue)
                }
            } catch {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: SITE_MESSAGES.LOGIN_AGAIN,
                })
                return
            }

            const userId = authData?.id

            if (!userId || typeof userId !== 'string') {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: SITE_MESSAGES.USER_ID_NOT_FOUND,
                })
                return
            }

            const { data, error } = await supabase
                .from('customers')
                .select(
                    'id, user_id, customer_name, phone, city, gender, male_measurements, female_measurements, created_at, total_amount, advance_amount, pending_amount'
                )
                .eq('user_id', userId)

            if (error) {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: SITE_MESSAGES.ERROR_FETCHING_CUSTOMER,
                })
                return
            }

            setCustomers((data ?? []) as Customer[])
        } catch (error) {
            setCustomers([])
            setToastState({
                show: true,
                type: 'E',
                msg: SITE_MESSAGES.ERROR_FETCHING_CUSTOMER,
            })
        } finally {
            setIsLoading(false)
        }
    }, [setToastState])

    useEffect(() => {
        fetchCustomers()
    }, [fetchCustomers])

    return {
        customers,
        isLoading,
        refetch: fetchCustomers,
    }
}