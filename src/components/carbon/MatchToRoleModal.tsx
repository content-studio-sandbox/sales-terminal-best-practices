// src/components/carbon/MatchToRoleModal.tsx
// TASK-14: "Match to role" modal UI
import { useState, useEffect } from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Loading,
  InlineNotification,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Checkbox,
  Tag,
  Toggle,
  TextArea,
  Accordion,
  AccordionItem,
  ProgressBar,
} from "@carbon/react";
import { Email, Checkmark, WarningAlt } from "@carbon/icons-react";

interface MatchToRoleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
  projectName: string;
  onInvitationsSent?: () => void;
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

export default function MatchToRoleModal({
  open,
  onOpenChange,
  projectId,
  projectName,
  onInvitationsSent,
}: MatchToRoleModalProps) {
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [useAiMatcher, setUseAiMatcher] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open && projectId) {
      fetchMatches();
    } else {
      setMatches([]);
      setSelectedCandidates(new Set());
      setError("");
      setSuccess("");
    }
  }, [open, projectId, useAiMatcher]);

  const fetchMatches = async () => {
    try {
      setLoading(true);
      setError("");

      const endpoint = useAiMatcher ? "/api/match/watsonx" : "/api/match/role";
      const body = useAiMatcher
        ? { projectId, topK: 20 }
        : { projectId };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}` }));
        throw new Error(errorData.error || "Failed to fetch matches");
      }

      const data = await response.json();
      setMatches(data.matches || []);
    } catch (err: any) {
      console.error("Error fetching matches:", err);
      setError(err.message || "Failed to load candidate matches");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCandidate = (candidateId: string, checked: boolean) => {
    const newSelected = new Set(selectedCandidates);
    if (checked) {
      newSelected.add(candidateId);
    } else {
      newSelected.delete(candidateId);
    }
    setSelectedCandidates(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(new Set(matches.map((m) => m.candidateId)));
    } else {
      setSelectedCandidates(new Set());
    }
  };

  const handleBulkInvite = async () => {
    if (selectedCandidates.size === 0) {
      setError("Please select at least one candidate");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      const invitations = Array.from(selectedCandidates).map((userId) => ({
        project_id: projectId,
        user_id: userId,
        status: "invited",
      }));

      const { error: insertError } = await (await import("@/integrations/supabase/client")).supabase
        .from("project_invitations")
        .insert(invitations);

      if (insertError) throw insertError;

      setSuccess(`Successfully sent ${invitations.length} invitation(s)!`);
      setSelectedCandidates(new Set());

      if (onInvitationsSent) {
        onInvitationsSent();
      }

      setTimeout(() => {
        onOpenChange(false);
      }, 2000);
    } catch (err: any) {
      console.error("Error sending invitations:", err);
      setError(err.message || "Failed to send invitations");
    } finally {
      setSending(false);
    }
  };

  const getFitScoreColor = (score: number) => {
    if (score >= 80) return "green";
    if (score >= 60) return "blue";
    if (score >= 40) return "cyan";
    return "red";
  };

  const headers = [
    { key: "select", header: "" },
    { key: "name", header: "Candidate" },
    { key: "fit_score", header: "Fit Score" },
    { key: "must_haves", header: "Must-Haves" },
    { key: "gaps", header: "Skill Gaps" },
    { key: "learning", header: "Suggested Learning" },
    { key: "eta", header: "Ready ETA" },
  ];

  const rows = matches.map((match) => ({
    id: match.candidateId,
    select: (
      <Checkbox
        id={`candidate-${match.candidateId}`}
        checked={selectedCandidates.has(match.candidateId)}
        onChange={(e: any) => handleSelectCandidate(match.candidateId, e.target.checked)}
        labelText=""
      />
    ),
    name: (
      <div>
        <div style={{ fontWeight: 500 }}>{match.candidateName}</div>
        <div style={{ fontSize: "12px", color: "var(--cds-text-secondary)" }}>
          {match.candidateEmail}
        </div>
      </div>
    ),
    fit_score: (
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        <ProgressBar
          value={match.fitScore}
          max={100}
          size="sm"
          helperText=""
          label=""
          style={{ width: "80px" }}
        />
        <Tag type={getFitScoreColor(match.fitScore)} size="sm">
          {match.fitScore}%
        </Tag>
      </div>
    ),
    must_haves: match.meetsMustHaves ? (
      <Tag type="green" size="sm" renderIcon={Checkmark}>
        Met
      </Tag>
    ) : (
      <Tag type="red" size="sm" renderIcon={WarningAlt}>
        Missing
      </Tag>
    ),
    gaps: (
      <div>
        {match.missing.length > 0 && (
          <div style={{ marginBottom: "4px" }}>
            <span style={{ fontSize: "12px", fontWeight: 500 }}>Missing: </span>
            <span style={{ fontSize: "12px", color: "var(--cds-text-secondary)" }}>
              {match.missing.slice(0, 2).join(", ")}
              {match.missing.length > 2 && ` +${match.missing.length - 2} more`}
            </span>
          </div>
        )}
        {match.levelShortfalls.length > 0 && (
          <div>
            <span style={{ fontSize: "12px", fontWeight: 500 }}>Level gaps: </span>
            <span style={{ fontSize: "12px", color: "var(--cds-text-secondary)" }}>
              {match.levelShortfalls.length} skill(s)
            </span>
          </div>
        )}
        {match.missing.length === 0 && match.levelShortfalls.length === 0 && (
          <Tag type="green" size="sm">
            None
          </Tag>
        )}
      </div>
    ),
    learning: (
      <div>
        {match.suggestedLearning.length > 0 ? (
          <Accordion size="sm">
            <AccordionItem title={`${match.suggestedLearning.length} suggestion(s)`}>
              <ul style={{ margin: 0, paddingLeft: "20px" }}>
                {match.suggestedLearning.map((item, idx) => (
                  <li key={idx} style={{ fontSize: "12px", marginBottom: "4px" }}>
                    <strong>{item.skill}</strong>: {item.reason} (~{item.estimatedWeeks}w)
                  </li>
                ))}
              </ul>
            </AccordionItem>
          </Accordion>
        ) : (
          <Tag type="green" size="sm">
            Ready
          </Tag>
        )}
      </div>
    ),
    eta: match.readyEtaWeeks > 0 ? (
      <Tag type="cyan" size="sm">
        {match.readyEtaWeeks}w
      </Tag>
    ) : (
      <Tag type="green" size="sm">
        Now
      </Tag>
    ),
  }));

  return (
    <ComposedModal open={open} onClose={() => onOpenChange(false)} size="lg">
      <ModalHeader>
        <h3>Match Candidates to {projectName}</h3>
      </ModalHeader>
      <ModalBody>
        {error && (
          <InlineNotification
            kind="error"
            title="Error"
            subtitle={error}
            onClose={() => setError("")}
            style={{ marginBottom: "16px" }}
          />
        )}
        {success && (
          <InlineNotification
            kind="success"
            title="Success"
            subtitle={success}
            onClose={() => setSuccess("")}
            style={{ marginBottom: "16px" }}
          />
        )}

        <div style={{ marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: "var(--cds-text-secondary)" }}>
            Candidates are ranked by skill match. Select candidates to invite.
          </p>
          <Toggle
            id="matcher-toggle"
            labelText="Use AI Matcher"
            labelA="Rule-based"
            labelB="AI-powered"
            toggled={useAiMatcher}
            onToggle={(checked) => setUseAiMatcher(checked)}
            size="sm"
          />
        </div>

        {loading ? (
          <Loading withOverlay={false} description="Analyzing candidates..." />
        ) : matches.length === 0 ? (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <p style={{ color: "var(--cds-text-secondary)" }}>
              No matching candidates found. Make sure the project has required skills defined.
            </p>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: "12px" }}>
              <Checkbox
                id="select-all"
                checked={matches.length > 0 && matches.every((m) => selectedCandidates.has(m.candidateId))}
                indeterminate={
                  selectedCandidates.size > 0 && selectedCandidates.size < matches.length
                }
                onChange={(e: any) => handleSelectAll(e.target.checked)}
                labelText={`Select all (${selectedCandidates.size} selected)`}
              />
            </div>

            <DataTable rows={rows} headers={headers}>
              {({ rows, headers, getTableProps, getHeaderProps, getRowProps }: any) => (
                <TableContainer>
                  <Table {...getTableProps()} size="md">
                    <TableHead>
                      <TableRow>
                        {headers.map((header: any) => (
                          <TableHeader key={header.key} {...getHeaderProps({ header })}>
                            {header.header}
                          </TableHeader>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row: any) => (
                        <TableRow key={row.id} {...getRowProps({ row })}>
                          {row.cells.map((cell: any) => (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </DataTable>
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={() => onOpenChange(false)} disabled={sending}>
          Cancel
        </Button>
        <Button
          kind="primary"
          renderIcon={Email}
          onClick={handleBulkInvite}
          disabled={loading || sending || selectedCandidates.size === 0}
        >
          {sending
            ? "Sending..."
            : `Invite ${selectedCandidates.size} Candidate${selectedCandidates.size !== 1 ? "s" : ""}`}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
}

// Made with Bob
