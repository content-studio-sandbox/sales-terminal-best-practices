// src/components/carbon/ViewFitDrawer.tsx
// TASK-15: Resume Library "View Fit" drawer
import { useState, useEffect } from "react";
import {
  Button,
  Loading,
  InlineNotification,
  Tag,
  ProgressBar,
  Accordion,
  AccordionItem,
  TextInput,
  TextArea,
} from "@carbon/react";
import { Close, Checkmark, WarningAlt, Education } from "@carbon/icons-react";

interface ViewFitDrawerProps {
  open: boolean;
  onClose: () => void;
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  projectId?: string;
  projectName?: string;
  jdText?: string;
}

interface MatchResult {
  candidateId: string;
  candidateName: string;
  candidateEmail: string;
  fitScore: number;
  missing: string[];
  levelShortfalls: Array<{
    skill: string;
    current: string;
    required: string;
    gap: number;
  }>;
  meetsMustHaves: boolean;
  suggestedLearning: Array<{
    skill: string;
    reason: string;
    targetLevel: string;
    estimatedWeeks: number;
  }>;
  readyEtaWeeks: number;
}

export default function ViewFitDrawer({
  open,
  onClose,
  candidateId,
  candidateName,
  candidateEmail,
  projectId,
  projectName,
  jdText,
}: ViewFitDrawerProps) {
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [customJdText, setCustomJdText] = useState(jdText || "");

  useEffect(() => {
    if (open && candidateId) {
      if (projectId || customJdText) {
        fetchFitAnalysis();
      }
    } else {
      setMatchResult(null);
      setError("");
    }
  }, [open, candidateId, projectId]);

  useEffect(() => {
    // Handle Escape key to close drawer
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        onClose();
      }
    };

    if (open) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [open, onClose]);

  const fetchFitAnalysis = async () => {
    try {
      setLoading(true);
      setError("");

      const body: any = {
        candidateIds: [candidateId],
      };

      if (projectId) {
        body.projectId = projectId;
      } else if (customJdText) {
        body.jdText = customJdText;
      } else {
        throw new Error("Either projectId or jdText must be provided");
      }

      const response = await fetch("/api/match/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || "Failed to fetch fit analysis");
      }

      const data = await response.json();
      if (data.matches && data.matches.length > 0) {
        setMatchResult(data.matches[0]);
      } else {
        throw new Error("No match result returned");
      }
    } catch (err: any) {
      console.error("Error fetching fit analysis:", err);
      setError(err.message || "Failed to load fit analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeCustomJd = () => {
    if (!customJdText.trim()) {
      setError("Please enter a job description");
      return;
    }
    fetchFitAnalysis();
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "blue";
    if (score >= 40) return "cyan";
    return "red";
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "expert":
        return "green";
      case "advanced":
        return "blue";
      case "intermediate":
        return "cyan";
      case "beginner":
        return "gray";
      default:
        return "gray";
    }
  };

  if (!open) return null;

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 9998,
        }}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: "600px",
          maxWidth: "90vw",
          backgroundColor: "var(--cds-background)",
          boxShadow: "-4px 0 16px rgba(0, 0, 0, 0.2)",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "16px 24px",
            borderBottom: "1px solid var(--cds-border-subtle)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h3 style={{ margin: 0, fontSize: "20px", fontWeight: 600 }}>
              Fit Analysis
            </h3>
            <p style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--cds-text-secondary)" }}>
              {candidateName} • {candidateEmail}
            </p>
          </div>
          <Button
            kind="ghost"
            size="sm"
            renderIcon={Close}
            iconDescription="Close"
            hasIconOnly
            onClick={onClose}
          />
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {error && (
            <InlineNotification
              kind="error"
              title="Error"
              subtitle={error}
              onClose={() => setError("")}
              style={{ marginBottom: "16px" }}
            />
          )}

          {!projectId && !matchResult && (
            <div style={{ marginBottom: "24px" }}>
              <TextArea
                id="custom-jd"
                labelText="Job Description"
                placeholder="Paste job description text here to analyze fit..."
                value={customJdText}
                onChange={(e: any) => setCustomJdText(e.target.value)}
                rows={8}
                style={{ marginBottom: "12px" }}
              />
              <Button onClick={handleAnalyzeCustomJd} disabled={loading || !customJdText.trim()}>
                Analyze Fit
              </Button>
            </div>
          )}

          {loading ? (
            <Loading withOverlay={false} description="Analyzing fit..." />
          ) : matchResult ? (
            <>
              {/* Fit Score Section */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
                  Overall Fit Score
                </h4>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <ProgressBar
                    value={matchResult.fitScore}
                    max={100}
                    size="md"
                    helperText=""
                    label=""
                    style={{ flex: 1 }}
                  />
                  <Tag type={getFitScoreColor(matchResult.fitScore)} size="lg">
                    {matchResult.fitScore}%
                  </Tag>
                </div>
                {projectName && (
                  <p style={{ marginTop: "8px", fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                    For project: <strong>{projectName}</strong>
                  </p>
                )}
              </div>

              {/* Must-Haves Status */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
                  Must-Have Requirements
                </h4>
                {matchResult.meetsMustHaves ? (
                  <Tag type="green" size="md" renderIcon={Checkmark}>
                    All must-have requirements met
                  </Tag>
                ) : (
                  <Tag type="red" size="md" renderIcon={WarningAlt}>
                    Missing critical requirements
                  </Tag>
                )}
              </div>

              {/* Missing Skills */}
              {matchResult.missing.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
                    Missing Skills ({matchResult.missing.length})
                  </h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                    {matchResult.missing.map((skill, idx) => (
                      <Tag key={idx} type="red" size="md">
                        {skill}
                      </Tag>
                    ))}
                  </div>
                </div>
              )}

              {/* Level Shortfalls */}
              {matchResult.levelShortfalls.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
                    Level Shortfalls ({matchResult.levelShortfalls.length})
                  </h4>
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {matchResult.levelShortfalls.map((shortfall, idx) => (
                      <div
                        key={idx}
                        style={{
                          padding: "12px",
                          backgroundColor: "var(--cds-layer-01)",
                          borderRadius: "4px",
                        }}
                      >
                        <div style={{ fontWeight: 500, marginBottom: "4px" }}>
                          {shortfall.skill}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px" }}>
                          <Tag type={getLevelColor(shortfall.current)} size="sm">
                            Current: {shortfall.current}
                          </Tag>
                          <span>→</span>
                          <Tag type={getLevelColor(shortfall.required)} size="sm">
                            Required: {shortfall.required}
                          </Tag>
                          <span style={{ color: "var(--cds-text-secondary)" }}>
                            ({shortfall.gap} level{shortfall.gap !== 1 ? "s" : ""} gap)
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Learning */}
              {matchResult.suggestedLearning.length > 0 && (
                <div style={{ marginBottom: "32px" }}>
                  <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
                    Suggested Learning Path
                  </h4>
                  <Accordion>
                    {matchResult.suggestedLearning.map((item, idx) => (
                      <AccordionItem
                        key={idx}
                        title={
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Education size={16} />
                            <span>{item.skill}</span>
                            <Tag type="cyan" size="sm">
                              ~{item.estimatedWeeks}w
                            </Tag>
                          </div>
                        }
                      >
                        <div style={{ padding: "8px 0" }}>
                          <p style={{ marginBottom: "8px" }}>
                            <strong>Reason:</strong> {item.reason}
                          </p>
                          <p>
                            <strong>Target Level:</strong>{" "}
                            <Tag type={getLevelColor(item.targetLevel)} size="sm">
                              {item.targetLevel}
                            </Tag>
                          </p>
                        </div>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              )}

              {/* Ready ETA */}
              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "12px" }}>
                  Estimated Time to Ready
                </h4>
                {matchResult.readyEtaWeeks > 0 ? (
                  <div>
                    <Tag type="cyan" size="lg">
                      {matchResult.readyEtaWeeks} week{matchResult.readyEtaWeeks !== 1 ? "s" : ""}
                    </Tag>
                    <p style={{ marginTop: "8px", fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                      With focused learning on the suggested skills above
                    </p>
                  </div>
                ) : (
                  <Tag type="green" size="lg" renderIcon={Checkmark}>
                    Ready now
                  </Tag>
                )}
              </div>

              {/* No Gaps Message */}
              {matchResult.missing.length === 0 &&
                matchResult.levelShortfalls.length === 0 &&
                matchResult.suggestedLearning.length === 0 && (
                  <div
                    style={{
                      padding: "24px",
                      backgroundColor: "var(--cds-layer-01)",
                      borderRadius: "4px",
                      textAlign: "center",
                    }}
                  >
                    <Checkmark size={32} style={{ color: "var(--cds-support-success)" }} />
                    <p style={{ marginTop: "12px", fontWeight: 500 }}>
                      Perfect match! No skill gaps identified.
                    </p>
                  </div>
                )}
            </>
          ) : (
            <div style={{ textAlign: "center", padding: "32px 0" }}>
              <p style={{ color: "var(--cds-text-secondary)" }}>
                {projectId
                  ? "Loading fit analysis..."
                  : "Enter a job description above to analyze fit"}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--cds-border-subtle)",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button kind="secondary" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </>
  );
}

// Made with Bob
