import { useState, useEffect, useCallback } from "react";
import {
    ComposedModal, ModalHeader, ModalBody, ModalFooter,
    Button, TextArea, Toggle, InlineLoading, Tag, ActionableNotification
} from "@carbon/react";
import { View, Checkmark, WarningAlt } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface AiMatch {
    id: string;
    candidate_name: string | null;
    score: number;
    why?: string;
    matched_skills?: string[];
    missing_skills?: string[];
}

interface MatchResumesModalProps {
    open: boolean;
    onClose: () => void;
    jobText: string;
    setJobText: (value: string) => void;
    useAi: boolean;
    setUseAi: (value: boolean) => void;
    matching: boolean;
    matchResults: AiMatch[];
    onRunMatching: () => Promise<void>;
    onViewResume: (id: string, name: string) => void;
    onOpenApiSettings: () => void;
}

export default function MatchResumesModal({
    open,
    onClose,
    jobText,
    setJobText,
    useAi,
    setUseAi,
    matching,
    matchResults,
    onRunMatching,
    onViewResume,
    onOpenApiSettings
}: MatchResumesModalProps) {
    const { user } = useAuth();
    const [hasKeys, setHasKeys] = useState<boolean | null>(null);

    const checkApiKeys = useCallback(async () => {
        if (!user) {
            setHasKeys(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from("user_api_keys" as any)
                .select("watsonx_api_key, orchestrate_api_key")
                .eq("user_id", user.id)
                .single();

            // If no row exists (PGRST116), user has no keys configured
            if (error && error.code === "PGRST116") {
                setHasKeys(false);
                return;
            }

            if (error) {
                console.error("Error checking API keys:", error);
                setHasKeys(false);
                return;
            }

            const apiData = data as any;
            const hasWatsonx = apiData?.watsonx_api_key && apiData.watsonx_api_key.length > 0;
            const hasOrchestrate = apiData?.orchestrate_api_key && apiData.orchestrate_api_key.length > 0;
            
            setHasKeys(hasWatsonx || hasOrchestrate);
        } catch (err) {
            console.error("Error checking API keys:", err);
            setHasKeys(false);
        }
    }, [user]);

    useEffect(() => {
        if (open) {
            checkApiKeys();
        }
    }, [open, checkApiKeys]);
    
    const getScoreColor = (score: number) => {
        if (score >= 0.8) return "var(--cds-support-success)";
        if (score >= 0.6) return "var(--cds-support-info)";
        if (score >= 0.4) return "var(--cds-support-warning)";
        return "var(--cds-support-error)";
    };

    const getScoreLabel = (score: number) => {
        if (score >= 0.8) return "Excellent Match";
        if (score >= 0.6) return "Good Match";
        if (score >= 0.4) return "Fair Match";
        return "Poor Match";
    };

    return (
        <ComposedModal open={open} onClose={onClose} size="lg">
            <ModalHeader title="Match Resumes to Role" />
            
            <ModalBody hasForm>
                {/* API Key Warning Banner - Always show when keys are missing */}
                {hasKeys === false && (
                    <div style={{ marginBottom: "1rem" }}>
                        <ActionableNotification
                            kind="warning"
                            title="API Keys Not Configured"
                            subtitle="To use WatsonX.ai and Watson Orchestrate features, you need to configure your own API keys. IBM TechZone instances expire after 2 days, so we recommend using your own keys for uninterrupted access."
                            actionButtonLabel="Configure API Keys"
                            onActionButtonClick={onOpenApiSettings}
                            hideCloseButton
                            lowContrast
                            inline
                        />
                    </div>
                )}

                {/* Job Description Input */}
                <div style={{ marginBottom: "1.5rem" }}>
                    <TextArea
                        id="job-text"
                        labelText="Target Role / Job Description"
                        placeholder="Paste the job description, required skills, responsibilities, and keywords here..."
                        value={jobText}
                        onChange={(e) => setJobText((e.target as HTMLTextAreaElement).value)}
                        rows={6}
                        helperText="Provide detailed information for better matching results"
                    />
                </div>

                {/* AI Toggle with Enhanced Styling */}
                <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    padding: "1rem",
                    backgroundColor: "var(--cds-layer-01)",
                    borderRadius: "4px",
                    marginBottom: "1.5rem",
                    border: "1px solid var(--cds-border-subtle-01)"
                }}>
                    <div>
                        <div className="cds--label-01" style={{ marginBottom: "0.25rem", fontWeight: 600 }}>
                            AI-Powered Matching
                        </div>
                        <div className="cds--helper-text-01" style={{ color: "var(--cds-text-secondary)" }}>
                            {useAi ? "Using WatsonX AI for intelligent semantic matching" : "Using keyword-based matching"}
                        </div>
                    </div>
                    <Toggle
                        id="ai-matcher-toggle"
                        size="sm"
                        labelText=""
                        toggled={useAi}
                        onToggle={(checked: boolean) => setUseAi(checked)}
                    />
                </div>

                {/* Results Section */}
                {matchResults.length > 0 && (
                    <div>
                        <div style={{ 
                            display: "flex", 
                            justifyContent: "space-between", 
                            alignItems: "center",
                            marginBottom: "1rem"
                        }}>
                            <h4 className="cds--productive-heading-02">
                                Top Matches ({matchResults.length})
                            </h4>
                            <Tag type="blue" size="sm">
                                {useAi ? "AI Powered" : "Keyword Based"}
                            </Tag>
                        </div>

                        <div style={{ 
                            display: "grid", 
                            gap: "1rem",
                            maxHeight: "50vh",
                            overflowY: "auto",
                            padding: "0.25rem"
                        }}>
                            {matchResults.map((m, index) => {
                                const scorePercent = Math.round(m.score * 100);
                                const scoreColor = getScoreColor(m.score);
                                const scoreLabel = getScoreLabel(m.score);

                                return (
                                    <div
                                        key={m.id}
                                        style={{
                                            padding: "1.25rem",
                                            backgroundColor: "var(--cds-layer-01)",
                                            border: "1px solid var(--cds-border-subtle-01)",
                                            borderLeft: `4px solid ${scoreColor}`,
                                            borderRadius: "4px",
                                            transition: "all 0.2s ease"
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = "translateY(-2px)";
                                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.1)";
                                            e.currentTarget.style.borderLeftWidth = "6px";
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = "translateY(0)";
                                            e.currentTarget.style.boxShadow = "none";
                                            e.currentTarget.style.borderLeftWidth = "4px";
                                        }}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
                                            {/* Left: Candidate Info */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                {/* Rank Badge and Name */}
                                                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                                                    <div style={{
                                                        width: "32px",
                                                        height: "32px",
                                                        backgroundColor: scoreColor,
                                                        borderRadius: "50%",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        fontWeight: 600,
                                                        fontSize: "0.875rem",
                                                        color: "white",
                                                        flexShrink: 0
                                                    }}>
                                                        #{index + 1}
                                                    </div>
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div className="cds--productive-heading-01" style={{ 
                                                            marginBottom: "0.25rem",
                                                            overflow: "hidden",
                                                            textOverflow: "ellipsis",
                                                            whiteSpace: "nowrap"
                                                        }}>
                                                            {m.candidate_name || "Candidate"}
                                                        </div>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                                                            <Tag type={scorePercent >= 80 ? "green" : scorePercent >= 60 ? "blue" : scorePercent >= 40 ? "warm-gray" : "red"} size="sm">
                                                                {scoreLabel}
                                                            </Tag>
                                                            <span className="cds--label-01" style={{ color: scoreColor, fontWeight: 600 }}>
                                                                {scorePercent}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Score Progress Bar */}
                                                <div style={{ marginBottom: "0.75rem" }}>
                                                    <div style={{
                                                        width: "100%",
                                                        height: "8px",
                                                        backgroundColor: "var(--cds-layer-accent-01)",
                                                        borderRadius: "4px",
                                                        overflow: "hidden"
                                                    }}>
                                                        <div style={{
                                                            width: `${scorePercent}%`,
                                                            height: "100%",
                                                            backgroundColor: scoreColor,
                                                            transition: "width 0.5s ease"
                                                        }} />
                                                    </div>
                                                </div>

                                                {/* Matched Skills */}
                                                {m.matched_skills && m.matched_skills.length > 0 && (
                                                    <div style={{ marginBottom: "0.5rem" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                                            <Checkmark size={16} style={{ color: "var(--cds-support-success)" }} />
                                                            <span className="cds--label-01" style={{ color: "var(--cds-text-secondary)", fontSize: "0.75rem" }}>
                                                                Matched Skills ({m.matched_skills.length})
                                                            </span>
                                                        </div>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                                                            {m.matched_skills.slice(0, 5).map((skill, idx) => (
                                                                <Tag key={idx} type="green" size="sm">{skill}</Tag>
                                                            ))}
                                                            {m.matched_skills.length > 5 && (
                                                                <Tag type="outline" size="sm">+{m.matched_skills.length - 5} more</Tag>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* Missing Skills */}
                                                {m.missing_skills && m.missing_skills.length > 0 && (
                                                    <div style={{ marginBottom: "0.5rem" }}>
                                                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                                                            <WarningAlt size={16} style={{ color: "var(--cds-support-warning)" }} />
                                                            <span className="cds--label-01" style={{ color: "var(--cds-text-secondary)", fontSize: "0.75rem" }}>
                                                                Skill Gaps ({m.missing_skills.length})
                                                            </span>
                                                        </div>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                                                            {m.missing_skills.slice(0, 3).map((skill, idx) => (
                                                                <Tag key={idx} type="warm-gray" size="sm">{skill}</Tag>
                                                            ))}
                                                            {m.missing_skills.length > 3 && (
                                                                <Tag type="outline" size="sm">+{m.missing_skills.length - 3} more</Tag>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}

                                                {/* AI Explanation */}
                                                {m.why && (
                                                    <div className="cds--helper-text-01" style={{ 
                                                        color: "var(--cds-text-secondary)",
                                                        fontStyle: "italic",
                                                        marginTop: "0.5rem",
                                                        paddingTop: "0.5rem",
                                                        borderTop: "1px solid var(--cds-border-subtle-01)"
                                                    }}>
                                                        {m.why}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Right: Action Button */}
                                            <Button 
                                                size="sm" 
                                                kind="ghost" 
                                                renderIcon={View}
                                                onClick={() => onViewResume(m.id, m.candidate_name || "Resume")}
                                            >
                                                View
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!matching && matchResults.length === 0 && jobText.trim() && (
                    <div style={{
                        padding: "3rem 2rem",
                        textAlign: "center",
                        backgroundColor: "var(--cds-layer-01)",
                        borderRadius: "4px",
                        border: "1px dashed var(--cds-border-subtle-01)"
                    }}>
                        <h4 className="cds--productive-heading-02" style={{ marginBottom: "0.5rem" }}>
                            Ready to Find Matches
                        </h4>
                        <p className="cds--body-long-01" style={{ color: "var(--cds-text-secondary)" }}>
                            Click "Run Matching" to find the best candidates for this role
                        </p>
                    </div>
                )}
            </ModalBody>

            <ModalFooter
                primaryButtonText={matching ? "Matching…" : "Run Matching"}
                secondaryButtonText="Close"
                primaryButtonDisabled={matching || !jobText.trim()}
                onRequestSubmit={onRunMatching}
                onRequestClose={onClose}
            >
                {matching && <InlineLoading description="Analyzing resumes and calculating match scores…" />}
            </ModalFooter>
        </ComposedModal>
    );
}

// Made with Bob
