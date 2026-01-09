import { useCallback } from 'react';

export const useAnalytics = () => {
    const trackEvent = useCallback((eventName: string, params?: Record<string, any>) => {
        console.log(`[Analytics] ${eventName}`, params);
        // Implement actual analytics here (e.g. GA4)
    }, []);

    const trackExport = useCallback((status: 'start' | 'complete' | 'fail', format: string, scale: number) => {
        trackEvent('export_image', { status, format, scale });
    }, [trackEvent]);

    return { trackEvent, trackExport };
};
