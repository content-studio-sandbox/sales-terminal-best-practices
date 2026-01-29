// RouteTracking.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { reportInstanaEvent, setInstanaMeta } from './hooks/useInstana';
import { useAuth } from './hooks/useAuth';

declare global {
    interface Window { 
        ineum?: (...args: any[]) => void;
        performance?: Performance;
    }
}

export default function RouteTracking() {
    const { pathname, search } = useLocation();
    const { user } = useAuth();
    
    useEffect(() => {
        // Track page view in Instana
        if (window.ineum) {
            window.ineum('page', pathname);
        }
        
        // Set page-specific metadata
        const pageType = getPageType(pathname);
        if (pageType) {
            setInstanaMeta('pageType', pageType);
        }
        
        // Set user role metadata if available
        const userRole = (user as any)?.role;
        if (userRole) {
            setInstanaMeta('userRole', userRole);
        }
        
        // Track route change as custom event with additional context
        reportInstanaEvent('route_change', {
            path: pathname,
            search: search,
            fullUrl: pathname + search,
            pageType: pageType || 'unknown',
            userRole: userRole || 'anonymous',
            isAuthenticated: !!user,
        });
        
        // Track page load performance
        if (window.performance && window.performance.timing) {
            const timing = window.performance.timing;
            const loadTime = timing.loadEventEnd - timing.navigationStart;
            const domReadyTime = timing.domContentLoadedEventEnd - timing.navigationStart;
            
            if (loadTime > 0) {
                reportInstanaEvent('page_performance', {
                    path: pathname,
                    loadTime,
                    domReadyTime,
                    dnsTime: timing.domainLookupEnd - timing.domainLookupStart,
                    tcpTime: timing.connectEnd - timing.connectStart,
                    requestTime: timing.responseEnd - timing.requestStart,
                });
            }
        }
    }, [pathname, search, user]);
    
    return null;
}

/**
 * Determine page type from pathname for better categorization in Instana
 */
function getPageType(pathname: string): string | null {
    if (pathname === '/' || pathname === '/landing') return 'landing';
    if (pathname === '/auth') return 'auth';
    if (pathname.startsWith('/ambitions')) return 'ambitions';
    if (pathname.startsWith('/leadership')) return 'leadership';
    if (pathname.startsWith('/requests')) return 'requests';
    if (pathname.startsWith('/your-projects')) return 'your-projects';
    if (pathname.startsWith('/executive')) return 'executive-dashboard';
    return null;
}

// Made with Bob
