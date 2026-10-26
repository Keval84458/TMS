import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "react-toastify";
import { useAuth } from "./auth";
import { objIsNotEmpty } from ".";

const LS_PREFIX = "site_settings_v1:";

const memoryCache = new Map<string, any>();
const inflight = new Map<string, Promise<any>>();
const listeners = new Set<() => void>();

const readLocal = (key: string) => {
    try {
        const raw = localStorage.getItem(LS_PREFIX + key);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
};

const writeLocal = (key: string, value: any) => {
    try {
        localStorage.setItem(LS_PREFIX + key, JSON.stringify(value));
    } catch { }
};

const getCached = (key: string) =>
    memoryCache.get(key) ?? readLocal(key) ?? null;

// One network call, shared by every component that asks at the same time
const loadSettings = (userId?: string) => {
    const key = userId ?? "default";
    const existing = inflight.get(key);
    if (existing) return existing;

    const request = (async () => {
        // Single query: fetch user row + default row together
        let query = supabase.from("site_settings").select("*");
        query = userId
            ? query.or(`user_id.eq.${userId},user_id.is.null`)
            : query.is("user_id", null);

        const { data, error } = await query;
        if (error) throw error;

        const row =
            data?.find((r: any) => r.user_id === userId) ??
            data?.find((r: any) => r.user_id === null) ??
            null;

        memoryCache.set(key, row);
        writeLocal(key, row);
        return row;
    })().finally(() => inflight.delete(key));

    inflight.set(key, request);
    return request;
};

export const refetchSiteSettings = () => {
    listeners.forEach((refetch) => refetch());
};

export const useGlobalSiteSettings = () => {
    const { auth } = useAuth();
    const userId: string | undefined = auth.authData?.id;
    const key = userId ?? "default";

    // Start from cache so the UI doesn't wait on the network
    const [siteSettings, setSiteSettings] = useState<any>(() => getCached(key));
    const [isFetching, setIsFetching] = useState(() => getCached(key) === null);

    const fetchSettingsData = useCallback(async () => {
        try {
            const data = await loadSettings(userId);
            setSiteSettings(data);
        } catch (error) {
            toast.error("સેટિંગ્સ લોડ કરવામાં ભૂલ થઈ.");
        } finally {
            setIsFetching(false);
        }
    }, [userId]);

    useEffect(() => {
        // When the user changes, show that user's cached value immediately
        const cached = getCached(key);
        if (cached !== null) {
            setSiteSettings(cached);
            setIsFetching(false);
        } else {
            setIsFetching(true);
        }
        fetchSettingsData(); // refresh in the background
    }, [key, fetchSettingsData]);

    useEffect(() => {
        listeners.add(fetchSettingsData);
        return () => {
            listeners.delete(fetchSettingsData);
        };
    }, [fetchSettingsData]);

    const safeSettings = siteSettings ?? {};

    return {
        siteSettings: safeSettings,
        hasSettings: Object.keys(safeSettings).length > 0,
        isFetching,
        fetchSettingsData,
    };
};
