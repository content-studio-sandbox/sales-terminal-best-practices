import { useState, useEffect, useCallback, useRef } from "react";
import { ActionableNotification } from "@carbon/react";
import { CheckmarkFilled, WarningAlt, ErrorFilled } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";

interface HealthStatus {
    status: "healthy" | "degraded" | "error";
    message: string;
    details?: string;
}

export default function SupabaseHealthCheck() {
    const [health, setHealth] = useState<HealthStatus | null>(null);
    const [checking, setChecking] = useState(true);
    const isMountedRef = useRef(true);

    const checkHealth = useCallback(async () => {
        if (!isMountedRef.current) return;
        if (isMountedRef.current) setChecking(true);
        try {
            // Test 1: Check if we can connect to Supabase
            const { data: authData, error: authError } = await supabase.auth.getSession();
            
            if (authError) {
                if (isMountedRef.current) {
                    setHealth({
                    status: "error",
                    message: "Supabase Connection Failed",
                        details: `Authentication error: ${authError.message}`
                    });
                    setChecking(false);
                }
                return;
            }

            // Test 2: Try to query a simple table (users table should always exist)
            const { error: queryError } = await supabase
                .from("users")
                .select("id")
                .limit(1);

            if (queryError) {
                if (queryError.code === "42P01") {
                    if (isMountedRef.current) {
                        setHealth({
                        status: "degraded",
                        message: "Database Schema Incomplete",
                            details: "Some tables are missing. Please run migrations."
                        });
                    }
                } else {
                    if (isMountedRef.current) {
                        setHealth({
                        status: "degraded",
                        message: "Database Query Issues",
                            details: `Query error: ${queryError.message}`
                        });
                    }
                }
                if (isMountedRef.current) setChecking(false);
                return;
            }

            // Test 3: Check if new tables exist (feedback, user_api_keys)
            const { error: feedbackError } = await supabase
                .from("feedback" as any)
                .select("id")
                .limit(1);

            const { error: apiKeysError } = await supabase
                .from("user_api_keys" as any)
                .select("id")
                .limit(1);

            if (feedbackError || apiKeysError) {
                if (isMountedRef.current) {
                    setHealth({
                    status: "degraded",
                    message: "New Features Unavailable",
                        details: "Feedback system and BYOK tables are missing. Please run today's migrations."
                    });
                    setChecking(false);
                }
                return;
            }

            // All checks passed
            if (isMountedRef.current) {
                setHealth({
                status: "healthy",
                message: "Supabase Connected",
                    details: "All systems operational"
                });
            }
        } catch (err) {
            if (isMountedRef.current) {
                setHealth({
                status: "error",
                message: "Health Check Failed",
                    details: err instanceof Error ? err.message : "Unknown error"
                });
            }
        } finally {
            if (isMountedRef.current) setChecking(false);
        }
    }, []);

    useEffect(() => {
        isMountedRef.current = true;
        checkHealth();
        // Check health every 30 seconds
        const interval = setInterval(checkHealth, 30000);
        return () => {
            isMountedRef.current = false;
            clearInterval(interval);
        };
    }, [checkHealth]);

    if (checking && !health) {
        return null; // Don't show anything while initial check is running
    }

    if (!health || health.status === "healthy") {
        return null; // Don't show notification if everything is healthy
    }

    const getNotificationKind = () => {
        switch (health.status) {
            case "error":
                return "error";
            case "degraded":
                return "warning";
            default:
                return "info";
        }
    };

    const getIcon = () => {
        switch (health.status) {
            case "error":
                return <ErrorFilled size={20} />;
            case "degraded":
                return <WarningAlt size={20} />;
            default:
                return <CheckmarkFilled size={20} />;
        }
    };

    const subtitle = health.status === "degraded"
        ? `${health.details} Action Required: Run APPLY_ALL_TODAY_MIGRATIONS.sql in Supabase SQL Editor.`
        : health.details || "";

    return (
        <div style={{ marginBottom: "1rem" }}>
            <ActionableNotification
                kind={getNotificationKind()}
                title={health.message}
                subtitle={subtitle}
                actionButtonLabel={health.status === "degraded" ? "View Migrations" : undefined}
                onActionButtonClick={health.status === "degraded" ? () => {
                    window.open("https://supabase.com/dashboard/project/_/sql", "_blank");
                } : undefined}
                onClose={() => setHealth(null)}
                lowContrast
                inline
            />
        </div>
    );
}

// Made with Bob
