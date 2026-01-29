import { useState, useEffect } from "react";
import {
    Modal,
    TextInput,
    TextArea,
    InlineNotification,
    Button,
    Accordion,
    AccordionItem,
    Link,
    InlineLoading,
    Checkbox
} from "@carbon/react";
import { Save, View, ViewOff, CheckmarkFilled } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface ApiKeysSettingsModalProps {
    open: boolean;
    onClose: () => void;
    onSave?: () => void;
}

interface ApiKeys {
    watsonx_api_key: string;
    watsonx_project_id: string;
    watsonx_url: string;
    orchestrate_api_key: string;
    orchestrate_url: string;
    orchestrate_embed_config: string;
}

export default function ApiKeysSettingsModal({
    open,
    onClose,
    onSave
}: ApiKeysSettingsModalProps) {
    const { user: authUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    
    const [showWatsonxKey, setShowWatsonxKey] = useState(false);
    const [showOrchestrateKey, setShowOrchestrateKey] = useState(false);
    
    const [testingConnection, setTestingConnection] = useState(false);
    const [connectionTestResult, setConnectionTestResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    
    const [testingOrchestrateConnection, setTestingOrchestrateConnection] = useState(false);
    const [orchestrateConnectionTestResult, setOrchestrateConnectionTestResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    
    const [autoConfigureOrchestrate, setAutoConfigureOrchestrate] = useState(true);
    const [configuringOrchestrate, setConfiguringOrchestrate] = useState(false);
    const [orchestrateConfigResult, setOrchestrateConfigResult] = useState<{
        success: boolean;
        message: string;
    } | null>(null);
    
    const [apiKeys, setApiKeys] = useState<ApiKeys>({
        watsonx_api_key: "",
        watsonx_project_id: "",
        watsonx_url: "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-06-01",
        orchestrate_api_key: "",
        orchestrate_url: "",
        orchestrate_embed_config: ""
    });

    useEffect(() => {
        if (open) {
            loadApiKeys();
        }
    }, [open]);

    const loadApiKeys = async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Use SSO user from useAuth hook
            if (!authUser?.id) {
                console.warn("No authenticated user found");
                setLoading(false);
                return;
            }

            const { data, error: fetchError } = await supabase
                .from("user_api_keys" as any)
                .select("*")
                .eq("user_id", authUser.id)
                .limit(1);


            // PGRST116 means no rows returned, which is fine (user hasn't saved keys yet)
            if (fetchError && fetchError.code !== "PGRST116") {
                console.error("Error fetching API keys:", fetchError);
                // Don't show error to user, just log it
                setLoading(false);
                return;
            }

            if (data && data.length > 0) {
                const apiData = data[0] as any;
                console.log("✅ [ApiKeysSettingsModal] Loaded API keys from database:", {
                    has_watsonx: !!apiData.watsonx_api_key,
                    has_orchestrate: !!apiData.orchestrate_api_key,
                    orchestrate_url: apiData.orchestrate_url
                });
                setApiKeys({
                    watsonx_api_key: apiData.watsonx_api_key || "",
                    watsonx_project_id: apiData.watsonx_project_id || "",
                    watsonx_url: apiData.watsonx_url || "https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-06-01",
                    orchestrate_api_key: apiData.orchestrate_api_key || "",
                    orchestrate_url: apiData.orchestrate_url || "",
                    orchestrate_embed_config: apiData.orchestrate_embed_config || ""
                });
            } else {
                console.log("ℹ️  [ApiKeysSettingsModal] No saved API keys found for user");
            }
        } catch (err) {
            console.error("Error loading API keys:", err);
            // Don't show error to user for loading issues, just log them
            // The form will still be usable with empty fields
        } finally {
            setLoading(false);
        }
    };

    const validateInputs = (): string | null => {
        // Validate WatsonX API key format (IBM Cloud API keys start with specific patterns)
        if (apiKeys.watsonx_api_key && apiKeys.watsonx_api_key.length < 20) {
            return "WatsonX API key appears to be too short. Please check your key.";
        }

        // Validate WatsonX URL format
        if (apiKeys.watsonx_url && !apiKeys.watsonx_url.startsWith("https://")) {
            return "WatsonX URL must start with https://";
        }

        // Validate Orchestrate URL format if provided
        if (apiKeys.orchestrate_url && apiKeys.orchestrate_url.trim() && !apiKeys.orchestrate_url.startsWith("https://")) {
            return "Watson Orchestrate URL must start with https://";
        }

        // Validate at least one API key is provided
        if (!apiKeys.watsonx_api_key && !apiKeys.orchestrate_api_key) {
            return "Please provide at least one API key";
        }

        return null;
    };

    const handleSave = async () => {
        // Validate inputs before saving
        const validationError = validateInputs();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(false);
        setOrchestrateConfigResult(null);

        try {
            console.log("🔑 [ApiKeysSettingsModal] Starting save operation...");
            
            // Use SSO user from useAuth hook (no session check needed)
            if (!authUser?.id) {
                console.error("❌ [ApiKeysSettingsModal] No authenticated user");
                throw new Error("Not authenticated. Please refresh the page.");
            }
            
            console.log("✅ [ApiKeysSettingsModal] User authenticated:", authUser.email);

            // Prepare data for upsert
            const dataToSave = {
                user_id: authUser.id,
                watsonx_api_key: apiKeys.watsonx_api_key || null,
                watsonx_project_id: apiKeys.watsonx_project_id || null,
                watsonx_url: apiKeys.watsonx_url || null,
                orchestrate_api_key: apiKeys.orchestrate_api_key || null,
                orchestrate_url: apiKeys.orchestrate_url || null,
                orchestrate_embed_config: apiKeys.orchestrate_embed_config || null
            };
            
            console.log("📝 [ApiKeysSettingsModal] Attempting upsert with data:", {
                user_id: dataToSave.user_id,
                has_watsonx_key: !!dataToSave.watsonx_api_key,
                has_orchestrate_key: !!dataToSave.orchestrate_api_key
            });

            const { data: upsertData, error: upsertError } = await supabase
                .from("user_api_keys" as any)
                .upsert(dataToSave, {
                    onConflict: "user_id"
                })
                .select();

            if (upsertError) {
                console.error("❌ [ApiKeysSettingsModal] Upsert error:", {
                    code: upsertError.code,
                    message: upsertError.message,
                    details: upsertError.details,
                    hint: upsertError.hint
                });
                
                // Provide more specific error messages based on error code
                if (upsertError.code === "42501") {
                    throw new Error("Permission denied. The database migration may not have been applied yet. Please contact support.");
                } else if (upsertError.code === "23505") {
                    throw new Error("Duplicate entry detected. Please try again.");
                } else {
                    throw new Error(`Failed to save API keys: ${upsertError.message}`);
                }
            }
            
            console.log("✅ [ApiKeysSettingsModal] API keys saved successfully:", upsertData);

            // Auto-configure Watson Orchestrate security if enabled and credentials provided
            if (autoConfigureOrchestrate && apiKeys.orchestrate_api_key && apiKeys.orchestrate_url) {
                console.log("🔧 [ApiKeysSettingsModal] Auto-configuring Watson Orchestrate security...");
                setConfiguringOrchestrate(true);
                
                try {
                    const configResponse = await fetch("/api/configure-orchestrate-security", {
                        method: "POST",
                        credentials: "include",
                        headers: {
                            "Content-Type": "application/json"
                        }
                    });

                    const configData = await configResponse.json();

                    if (configData.success) {
                        console.log("✅ [ApiKeysSettingsModal] Watson Orchestrate security configured successfully");
                        setOrchestrateConfigResult({
                            success: true,
                            message: configData.message || "Watson Orchestrate is now ready to use!"
                        });
                    } else {
                        console.warn("⚠️ [ApiKeysSettingsModal] Watson Orchestrate security configuration failed:", configData.error);
                        setOrchestrateConfigResult({
                            success: false,
                            message: configData.error || "Failed to configure Watson Orchestrate. You may need to disable security manually."
                        });
                    }
                } catch (configErr) {
                    console.error("❌ [ApiKeysSettingsModal] Error configuring Watson Orchestrate:", configErr);
                    setOrchestrateConfigResult({
                        success: false,
                        message: "Failed to auto-configure Watson Orchestrate. You may need to disable embed security manually."
                    });
                } finally {
                    setConfiguringOrchestrate(false);
                }
            }

            setSuccess(true);
            
            // Delay closing to show configuration result
            const closeDelay = orchestrateConfigResult ? 3000 : 1500;
            setTimeout(() => {
                onSave?.();
                onClose();
            }, closeDelay);
        } catch (err) {
            console.error("❌ [ApiKeysSettingsModal] Error saving API keys:", err);
            setError(err instanceof Error ? err.message : "Failed to save API keys");
        } finally {
            setSaving(false);
        }
    };

    const handleChange = (field: keyof ApiKeys, value: string) => {
        setApiKeys(prev => ({ ...prev, [field]: value }));
        setSuccess(false);
        setError(null); // Clear error when user starts typing
        setConnectionTestResult(null); // Clear test result when user changes values
        setOrchestrateConnectionTestResult(null); // Clear orchestrate test result when user changes values
    };

    const handleTestConnection = async () => {
        setTestingConnection(true);
        setConnectionTestResult(null);
        setError(null);

        try {
            // Validate required fields
            if (!apiKeys.watsonx_api_key || !apiKeys.watsonx_project_id || !apiKeys.watsonx_url) {
                setConnectionTestResult({
                    success: false,
                    message: "Please fill in all WatsonX.ai fields before testing"
                });
                return;
            }

            // Use SSO authentication (no session token needed)
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            };

            const response = await fetch("/api/test-watsonx", {
                method: "POST",
                headers,
                credentials: "include", // Include cookies for SSO auth
                body: JSON.stringify({
                    apiKey: apiKeys.watsonx_api_key,
                    projectId: apiKeys.watsonx_project_id,
                    url: apiKeys.watsonx_url
                })
            });

            const data = await response.json();

            if (data.success) {
                setConnectionTestResult({
                    success: true,
                    message: data.message || "Connection successful!"
                });
            } else {
                setConnectionTestResult({
                    success: false,
                    message: data.error || "Connection test failed"
                });
            }
        } catch (err) {
            console.error("Error testing connection:", err);
            setConnectionTestResult({
                success: false,
                message: err instanceof Error ? err.message : "Failed to test connection"
            });
        } finally {
            setTestingConnection(false);
        }
    };

    const handleTestOrchestrateConnection = async () => {
        setTestingOrchestrateConnection(true);
        setOrchestrateConnectionTestResult(null);
        setError(null);

        try {
            // Validate required fields
            if (!apiKeys.orchestrate_api_key || !apiKeys.orchestrate_url) {
                setOrchestrateConnectionTestResult({
                    success: false,
                    message: "Please fill in both Watson Orchestrate API Key and URL before testing"
                });
                return;
            }

            // Use SSO authentication (no session token needed)
            const headers: Record<string, string> = {
                "Content-Type": "application/json"
            };

            const response = await fetch("/api/test-orchestrate", {
                method: "POST",
                headers,
                credentials: "include", // Include cookies for SSO auth
                body: JSON.stringify({
                    apiKey: apiKeys.orchestrate_api_key,
                    url: apiKeys.orchestrate_url
                })
            });

            const data = await response.json();

            if (data.success) {
                setOrchestrateConnectionTestResult({
                    success: true,
                    message: data.message || "Connection successful!"
                });
            } else {
                setOrchestrateConnectionTestResult({
                    success: false,
                    message: data.error || "Connection test failed"
                });
            }
        } catch (err) {
            console.error("Error testing Orchestrate connection:", err);
            setOrchestrateConnectionTestResult({
                success: false,
                message: err instanceof Error ? err.message : "Failed to test connection"
            });
        } finally {
            setTestingOrchestrateConnection(false);
        }
    };

    return (
        <Modal
            open={open}
            onRequestClose={onClose}
            modalHeading="API Keys Settings"
            modalLabel="Bring Your Own Key (BYOK)"
            primaryButtonText="Save Keys"
            secondaryButtonText="Cancel"
            onRequestSubmit={handleSave}
            primaryButtonDisabled={saving || loading}
            size="lg"
        >
            <div style={{ marginBottom: "1.5rem" }}>
                <InlineNotification
                    kind="info"
                    title="About BYOK (Bring Your Own Key)"
                    subtitle="Configure your own IBM API keys to use WatsonX.ai and Watson Orchestrate features. Your keys are encrypted and stored securely."
                    lowContrast
                    hideCloseButton
                />
            </div>

            {error && (
                <InlineNotification
                    kind="error"
                    title="Error"
                    subtitle={error}
                    onClose={() => setError(null)}
                    style={{ marginBottom: "1rem" }}
                />
            )}

            {success && (
                <InlineNotification
                    kind="success"
                    title="Success"
                    subtitle="API keys saved successfully!"
                    onClose={() => setSuccess(false)}
                    style={{ marginBottom: "1rem" }}
                />
            )}

            <Accordion>
                <AccordionItem title="WatsonX.ai Configuration" open>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <TextInput
                                id="watsonx-api-key"
                                labelText="WatsonX.ai API Key"
                                placeholder="Enter your WatsonX.ai API key"
                                type={showWatsonxKey ? "text" : "password"}
                                value={apiKeys.watsonx_api_key}
                                onChange={(e) => handleChange("watsonx_api_key", e.target.value)}
                                disabled={loading}
                            />
                            <Button
                                kind="ghost"
                                size="sm"
                                renderIcon={showWatsonxKey ? ViewOff : View}
                                onClick={() => setShowWatsonxKey(!showWatsonxKey)}
                                style={{ marginTop: "0.5rem" }}
                                disabled={loading}
                            >
                                {showWatsonxKey ? "Hide" : "Show"} API Key
                            </Button>
                        </div>

                        <TextInput
                            id="watsonx-project-id"
                            labelText="WatsonX.ai Project ID"
                            placeholder="Enter your WatsonX.ai project ID"
                            value={apiKeys.watsonx_project_id}
                            onChange={(e) => handleChange("watsonx_project_id", e.target.value)}
                            disabled={loading}
                        />

                        <TextInput
                            id="watsonx-url"
                            labelText="WatsonX.ai URL"
                            placeholder="https://us-south.ml.cloud.ibm.com/ml/v1/text/chat?version=2023-06-01"
                            value={apiKeys.watsonx_url}
                            onChange={(e) => handleChange("watsonx_url", e.target.value)}
                            disabled={loading}
                        />

                        <div style={{ marginTop: "1rem" }}>
                            <Button
                                kind="tertiary"
                                size="md"
                                onClick={handleTestConnection}
                                disabled={loading || testingConnection || !apiKeys.watsonx_api_key || !apiKeys.watsonx_project_id}
                                renderIcon={testingConnection ? undefined : CheckmarkFilled}
                            >
                                {testingConnection ? (
                                    <>
                                        <InlineLoading description="Testing connection..." />
                                    </>
                                ) : (
                                    "Test Connection"
                                )}
                            </Button>
                        </div>

                        {connectionTestResult && (
                            <InlineNotification
                                kind={connectionTestResult.success ? "success" : "error"}
                                title={connectionTestResult.success ? "Connection Successful" : "Connection Failed"}
                                subtitle={connectionTestResult.message}
                                onClose={() => setConnectionTestResult(null)}
                                style={{ marginTop: "1rem" }}
                                lowContrast
                            />
                        )}

                        <div style={{
                            padding: "1rem",
                            backgroundColor: "var(--cds-layer-01)",
                            borderLeft: "3px solid var(--cds-support-info)",
                            marginTop: "1rem"
                        }}>
                            <h5 style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                marginBottom: "0.5rem",
                                color: "var(--cds-text-primary)"
                            }}>
                                How to get WatsonX.ai API keys
                            </h5>
                            <ol style={{
                                paddingLeft: "1.5rem",
                                margin: 0,
                                color: "var(--cds-text-secondary)",
                                fontSize: "0.875rem",
                                lineHeight: 1.6
                            }}>
                                <li style={{ marginBottom: "0.5rem" }}>
                                    Go to{" "}
                                    <Link
                                        href="https://techzone.ibm.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        IBM TechZone
                                    </Link>
                                </li>
                                <li style={{ marginBottom: "0.5rem" }}>
                                    Reserve a WatsonX.ai instance (note: expires after 2 days)
                                </li>
                                <li style={{ marginBottom: "0.5rem" }}>
                                    Copy your API key and Project ID from the instance details
                                </li>
                                <li>
                                    Paste them here to use WatsonX.ai features in  app
                                </li>
                            </ol>
                        </div>
                    </div>
                </AccordionItem>

                <AccordionItem title="Watson Orchestrate Configuration" open>
                    <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                        <div>
                            <TextInput
                                id="orchestrate-api-key"
                                labelText="Watson Orchestrate API Key"
                                placeholder="Enter your Watson Orchestrate API key"
                                type={showOrchestrateKey ? "text" : "password"}
                                value={apiKeys.orchestrate_api_key}
                                onChange={(e) => handleChange("orchestrate_api_key", e.target.value)}
                                disabled={loading}
                            />
                            <Button
                                kind="ghost"
                                size="sm"
                                renderIcon={showOrchestrateKey ? ViewOff : View}
                                onClick={() => setShowOrchestrateKey(!showOrchestrateKey)}
                                style={{ marginTop: "0.5rem" }}
                                disabled={loading}
                            >
                                {showOrchestrateKey ? "Hide" : "Show"} API Key
                            </Button>
                        </div>

                        <TextInput
                            id="orchestrate-url"
                            labelText="Watson Orchestrate URL"
                            placeholder="Enter your Watson Orchestrate URL"
                            value={apiKeys.orchestrate_url}
                            onChange={(e) => handleChange("orchestrate_url", e.target.value)}
                            disabled={loading}
                        />

                        <div style={{ marginTop: "1rem", marginBottom: "1rem" }}>
                            <Checkbox
                                id="auto-configure-orchestrate"
                                labelText="Automatically configure Watson Orchestrate for embedded chat"
                                checked={autoConfigureOrchestrate}
                                onChange={(e) => setAutoConfigureOrchestrate(e.target.checked)}
                                disabled={loading || saving}
                            />
                            <p style={{
                                fontSize: "0.75rem",
                                color: "var(--cds-text-secondary)",
                                marginTop: "0.25rem",
                                marginLeft: "1.5rem"
                            }}>
                                When enabled, embed security will be automatically disabled after saving your API keys, allowing the chatbot to work immediately.
                            </p>
                        </div>

                        <TextArea
                            id="orchestrate-embed-config"
                            labelText="Watson Orchestrate Embed Code (Optional - for full BYOK)"
                            placeholder="Paste your complete embed code from Watson Orchestrate here..."
                            value={apiKeys.orchestrate_embed_config}
                            onChange={(e) => handleChange("orchestrate_embed_config", e.target.value)}
                            disabled={loading}
                            rows={8}
                            helperText="Paste the entire <script> block from your Watson Orchestrate instance's embed code. This includes the wxOConfiguration object with chatOptions."
                        />

                        <div style={{ marginTop: "1rem" }}>
                            <Button
                                kind="tertiary"
                                size="md"
                                onClick={handleTestOrchestrateConnection}
                                disabled={loading || testingOrchestrateConnection || !apiKeys.orchestrate_api_key || !apiKeys.orchestrate_url}
                                renderIcon={testingOrchestrateConnection ? undefined : CheckmarkFilled}
                            >
                                {testingOrchestrateConnection ? (
                                    <>
                                        <InlineLoading description="Testing connection..." />
                                    </>
                                ) : (
                                    "Test Connection"
                                )}
                            </Button>
                        </div>

                        {orchestrateConnectionTestResult && (
                            <InlineNotification
                                kind={orchestrateConnectionTestResult.success ? "success" : "error"}
                                title={orchestrateConnectionTestResult.success ? "Connection Successful" : "Connection Failed"}
                                subtitle={orchestrateConnectionTestResult.message}
                                onClose={() => setOrchestrateConnectionTestResult(null)}
                                style={{ marginTop: "1rem" }}
                                lowContrast
                            />
                        )}

                        {configuringOrchestrate && (
                            <InlineNotification
                                kind="info"
                                title="Configuring Watson Orchestrate"
                                subtitle="Automatically disabling embed security..."
                                style={{ marginTop: "1rem" }}
                                lowContrast
                                hideCloseButton
                            />
                        )}

                        {orchestrateConfigResult && (
                            <InlineNotification
                                kind={orchestrateConfigResult.success ? "success" : "warning"}
                                title={orchestrateConfigResult.success ? "Configuration Successful" : "Configuration Warning"}
                                subtitle={orchestrateConfigResult.message}
                                onClose={() => setOrchestrateConfigResult(null)}
                                style={{ marginTop: "1rem" }}
                                lowContrast
                            />
                        )}

                        <div style={{
                            padding: "1rem",
                            backgroundColor: "var(--cds-layer-01)",
                            borderLeft: "3px solid var(--cds-support-info)",
                            marginTop: "1rem"
                        }}>
                            <h5 style={{
                                fontSize: "0.875rem",
                                fontWeight: 600,
                                marginBottom: "0.5rem",
                                color: "var(--cds-text-primary)"
                            }}>
                                How to get Watson Orchestrate API keys
                            </h5>
                            <ol style={{
                                paddingLeft: "1.5rem",
                                margin: 0,
                                color: "var(--cds-text-secondary)",
                                fontSize: "0.875rem",
                                lineHeight: 1.6
                            }}>
                                <li style={{ marginBottom: "0.5rem" }}>
                                    Go to{" "}
                                    <Link
                                        href="https://techzone.ibm.com"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        IBM TechZone
                                    </Link>
                                </li>
                                <li style={{ marginBottom: "0.5rem" }}>
                                    Reserve a Watson Orchestrate instance (note: expires after 2 days)
                                </li>
                                <li style={{ marginBottom: "0.5rem" }}>
                                    Copy your API key and URL from the instance details
                                </li>
                                <li style={{ marginBottom: "0.5rem" }}>
                                    <strong>For full chatbot integration:</strong> Go to your Orchestrate instance → Skills → Get embed code
                                </li>
                                <li>
                                    Paste the complete embed code in the "Embed Code" field above
                                </li>
                            </ol>
                        </div>
                    </div>
                </AccordionItem>
            </Accordion>

            <div style={{ marginTop: "1.5rem" }}>
                <InlineNotification
                    kind="warning"
                    title="Security Note"
                    subtitle="Your API keys are encrypted and stored securely in the database. They are only accessible to you and are never shared with other users."
                    lowContrast
                    hideCloseButton
                />
            </div>
        </Modal>
    );
}

// Made with Bob, fixed with blood sweat and tears 