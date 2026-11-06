import { useState, useEffect, useCallback } from 'react'
import { supabase } from '#/lib/supabaseClient'
import { useGlobalToast } from '#/components/CustomeToast'
import { API_KEY } from '#/utils/constant'
import { useAuth } from './auth'
import { useTranslation } from 'react-i18next'

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
    const { auth } = useAuth()
    const { t } = useTranslation()

    const fetchCustomers = useCallback(async () => {
        setIsLoading(true)

        try {
            if (!auth) {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: t('SiteMessageWithLanguages.LOGIN_TO_VIEW_CUSTOMER')
                })
                return
            }
            const userId = auth?.authData?.id ?? null

            if (!userId || typeof userId !== 'string') {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: t('SiteMessageWithLanguages.USER_ID_NOT_FOUND')
                })
                return
            }

            const { data, error } = await supabase
                .from(API_KEY.CUSTOMERS)
                .select(
                    'id, user_id, customer_name, phone, city, gender, male_measurements, female_measurements, created_at, total_amount, advance_amount, pending_amount'
                )
                .eq('user_id', userId)

            if (error) {
                setCustomers([])
                setToastState({
                    show: true,
                    type: 'E',
                    msg: t('SiteMessageWithLanguages.ERROR_FETCHING_CUSTOMER')
                })
                return
            }

            setCustomers((data ?? []) as Customer[])
        } catch (error) {
            setCustomers([])
            setToastState({
                show: true,
                type: 'E',
                msg: t('SiteMessageWithLanguages.ERROR_FETCHING_CUSTOMER')
            })
        } finally {
            setIsLoading(false)
        }
    }, [auth, setToastState])

    useEffect(() => {
        fetchCustomers()
    }, [fetchCustomers])

    return {
        customers,
        isLoading,
        refetch: fetchCustomers,
    }
}