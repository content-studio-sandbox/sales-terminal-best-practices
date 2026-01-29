import { useState, useEffect, useCallback } from "react";
import { ActionableNotification } from "@carbon/react";
import { Settings } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ApiKeyWarningBannerProps {
    onOpenSettings: () => void;
}

export default function ApiKeyWarningBanner({ onOpenSettings }: ApiKeyWarningBannerProps) {
    const { user } = useAuth();
    const [hasKeys, setHasKeys] = useState<boolean | null>(null);
    const [dismissed, setDismissed] = useState(false);

    const checkApiKeys = useCallback(async () => {
        if (!user) {
            setHasKeys(null);
            return;
        }

        try {
            const { data, error } = await supabase
            .from("user_api_keys" as any)
            .select("watsonx_api_key, orchestrate_api_key")
            .eq("user_id", user.id)
            .limit(1);

            if (error) {
                console.error("Error checking API keys:", error);
                setHasKeys(null);
                return;
            }

            const row = (data as any[])?.[0];
            const hasWatsonx = !!row?.watsonx_api_key?.length;
            const hasOrchestrate = !!row?.orchestrate_api_key?.length;
            setHasKeys(hasWatsonx || hasOrchestrate);

        } catch (err) {
            console.error("Error checking API keys:", err);
            setHasKeys(null);
        }
    }, [user]);

    useEffect(() => {
        checkApiKeys();
    }, [checkApiKeys]);

    // Don't show banner if:
    // - Still loading (hasKeys is null)
    // - User has keys configured
    // - User dismissed the banner
    if (hasKeys === null || hasKeys === true || dismissed) {
        return null;
    }

    return (
        <div style={{ marginBottom: "1rem" }}>
            <ActionableNotification
                kind="warning"
                title="API Keys Not Configured"
                subtitle="To use WatsonX.ai and Watson Orchestrate features, you need to configure your own API keys. IBM TechZone instances expire after 2 days, so we recommend using your own keys for uninterrupted access."
                actionButtonLabel="Configure API Keys"
                onActionButtonClick={onOpenSettings}
                onClose={() => setDismissed(true)}
                lowContrast
                inline
            />
        </div>
    );
}

// Made with Bob, fixed with blood sweat and tears
