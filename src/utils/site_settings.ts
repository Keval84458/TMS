import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import { useAuth } from "./auth";

const listeners = new Set<() => void>();

export const refetchSiteSettings = () => {
    listeners.forEach((refetch) => refetch());
};

export const globalSiteSettings = () => {
    const { auth } = useAuth();
    const userId = auth.authData?.id;
    const [siteSettings, setSiteSettings] = useState<any>([]);
    const [isFetching, setIsFetching] = useState(true);

    const fetchSettingsData = useCallback(async () => {
        setIsFetching(true);

        try {
            let data = null;
            if (userId) {
                const { data: userData, error: userError } =
                    await supabase
                        .from("site_settings")
                        .select("*")
                        .eq("user_id", userId)
                        .maybeSingle();

                if (userError) throw userError;
                data = userData;
            }

            if (!data) {
                const { data: defaultData, error: defaultError } =
                    await supabase
                        .from("site_settings")
                        .select("*")
                        .is("user_id", null)
                        .maybeSingle();

                if (defaultError) throw defaultError;
                data = defaultData;
            }

            setSiteSettings(data);
        } catch (error) {
            toast.error("સેટિંગ્સ લોડ કરવામાં ભૂલ થઈ.");
        } finally {
            setIsFetching(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchSettingsData();
    }, [fetchSettingsData]);

    useEffect(() => {
        listeners.add(fetchSettingsData);
        return () => {
            listeners.delete(fetchSettingsData);
        };
    }, [fetchSettingsData]);

    return { siteSettings, isFetching, fetchSettingsData };
};