// RouteTracking.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { reportInstanaEvent, setInstanaMeta } from './hooks/useInstana';

declare global {
    interface Window { 
        ineum?: (...args: any[]) => void;
        performance?: Performance;
    }
}

export default function RouteTracking() {
    const { pathname, search } = useLocation();
    
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
        
        // Track route change as custom event with additional context
        reportInstanaEvent('route_change', {
            path: pathname,
            search: search,
            fullUrl: pathname + search,
            pageType: pageType || 'unknown',
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
    }, [pathname, search]);
    
    return null;
}

/**
 * Determine page type from pathname for better categorization in Instana
 */
function getPageType(pathname: string): string | null {
    if (pathname === '/' || pathname === '/landing') return 'landing';
    if (pathname === '/terminal-basics') return 'terminal-basics';
    if (pathname === '/git-workflows') return 'git-workflows';
    if (pathname === '/ssh-best-practices') return 'ssh-best-practices';
    if (pathname === '/vim-best-practices') return 'vim-best-practices';
    if (pathname === '/openshift-best-practices') return 'openshift-best-practices';
    if (pathname === '/interactive-terminal') return 'interactive-terminal';
    if (pathname === '/api-authentication') return 'api-authentication';
    if (pathname === '/cpd-cli') return 'cpd-cli';
    if (pathname === '/agentic-tools') return 'agentic-tools';
    return null;
}

// Made with Bob
