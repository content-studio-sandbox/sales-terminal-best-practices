// src/components/carbon/InviteCandidatesModal.tsx
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
  Search,
} from "@carbon/react";
import { supabase } from "@/integrations/supabase/client";

interface InviteCandidatesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onInvitationsSent: () => void;
}

interface Candidate {
  id: string;
  display_name: string;
  email: string;
  career_paths: string[];
  match_score: number;
  rank: number;
}

export default function InviteCandidatesModal({
  open,
  onOpenChange,
  project,
  onInvitationsSent,
}: InviteCandidatesModalProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidates, setSelectedCandidates] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open && project?.id) {
      fetchMatchingCandidates();
    } else {
      // Reset state when modal closes
      setCandidates([]);
      setSelectedCandidates(new Set());
      setSearchTerm("");
      setError("");
      setSuccess("");
    }
  }, [open, project?.id]);

  const fetchMatchingCandidates = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch project's career paths
      const { data: projectPaths, error: pathsError } = await supabase
        .from("project_paths" as any)
        .select("path_id, career_paths(name)")
        .eq("project_id", project.id);

      if (pathsError) throw pathsError;

      const projectCareerPathIds = projectPaths?.map((pp: any) => pp.path_id) || [];

      if (projectCareerPathIds.length === 0) {
        setCandidates([]);
        setError("This project has no career paths assigned. Please assign career paths first.");
        return;
      }

      // Fetch users who are interns/contributors with matching career path preferences
      const { data: userPreferences, error: prefsError } = await supabase
        .from("user_path_preferences" as any)
        .select("user_id, path_id, rank, users(id, display_name, email, access_role)")
        .in("path_id", projectCareerPathIds)
        .order("rank", { ascending: true });

      if (prefsError) throw prefsError;

      // Filter for interns/contributors only and group by user
      const userMap = new Map<string, Candidate>();
      
      for (const pref of userPreferences || []) {
        const user = (pref as any).users;
        if (!user || !["intern", "contributor"].includes(user.access_role?.toLowerCase())) {
          continue;
        }

        if (!userMap.has(user.id)) {
          userMap.set(user.id, {
            id: user.id,
            display_name: user.display_name || user.email,
            email: user.email,
            career_paths: [],
            match_score: 0,
            rank: (pref as any).rank,
          });
        }

        const candidate = userMap.get(user.id)!;
        
        // Fetch career path name
        const { data: pathData } = await supabase
          .from("career_paths" as any)
          .select("name")
          .eq("id", (pref as any).path_id)
          .single();

        if (pathData) {
          candidate.career_paths.push((pathData as any).name);
        }

        // Calculate match score based on rank (1 = highest preference)
        const rankScore = (4 - (pref as any).rank) / 3; // Rank 1 = 1.0, Rank 2 = 0.67, Rank 3 = 0.33
        candidate.match_score = Math.max(candidate.match_score, rankScore);
        candidate.rank = Math.min(candidate.rank, (pref as any).rank);
      }

      // Check for existing invitations to filter out already invited users
      const { data: existingInvitations } = await supabase
        .from("project_invitations" as any)
        .select("user_id")
        .eq("project_id", project.id)
        .in("status", ["invited", "accepted"]);

      const invitedUserIds = new Set(existingInvitations?.map((inv: any) => inv.user_id) || []);

      // Filter out already invited users and sort by match score
      const filteredCandidates = Array.from(userMap.values())
        .filter((c) => !invitedUserIds.has(c.id))
        .sort((a, b) => {
          if (b.match_score !== a.match_score) {
            return b.match_score - a.match_score;
          }
          return a.rank - b.rank;
        });

      setCandidates(filteredCandidates);
    } catch (err: any) {
      console.error("Error fetching candidates:", err);
      setError(err.message || "Failed to load matching candidates");
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
      const filtered = getFilteredCandidates();
      setSelectedCandidates(new Set(filtered.map((c) => c.id)));
    } else {
      setSelectedCandidates(new Set());
    }
  };

  const handleSendInvitations = async () => {
    if (selectedCandidates.size === 0) {
      setError("Please select at least one candidate");
      return;
    }

    try {
      setSending(true);
      setError("");
      setSuccess("");

      const invitations = Array.from(selectedCandidates).map((userId) => ({
        project_id: project.id,
        user_id: userId,
        status: "invited",
      }));

      const { error: insertError } = await supabase
        .from("project_invitations" as any)
        .insert(invitations);

      if (insertError) throw insertError;

      setSuccess(`Successfully sent ${invitations.length} invitation(s)!`);
      setSelectedCandidates(new Set());
      
      // Refresh candidates list to remove newly invited users
      await fetchMatchingCandidates();
      
      // Notify parent component
      onInvitationsSent();

      // Close modal after a short delay
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

  const getFilteredCandidates = () => {
    if (!searchTerm.trim()) return candidates;
    
    const term = searchTerm.toLowerCase();
    return candidates.filter(
      (c) =>
        c.display_name.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.career_paths.some((cp) => cp.toLowerCase().includes(term))
    );
  };

  const filteredCandidates = getFilteredCandidates();

  const headers = [
    { key: "select", header: "" },
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "career_paths", header: "Career Path Interests" },
    { key: "match", header: "Match Score" },
  ];

  const rows = filteredCandidates.map((candidate) => ({
    id: candidate.id,
    select: (
      <Checkbox
        id={`candidate-${candidate.id}`}
        checked={selectedCandidates.has(candidate.id)}
        onChange={(e: any) => handleSelectCandidate(candidate.id, e.target.checked)}
        labelText=""
      />
    ),
    name: candidate.display_name,
    email: candidate.email,
    career_paths: (
      <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
        {candidate.career_paths.map((path, idx) => (
          <Tag key={idx} type="purple" size="sm">
            {path}
          </Tag>
        ))}
      </div>
    ),
    match: (
      <Tag
        type={
          candidate.match_score >= 0.8
            ? "green"
            : candidate.match_score >= 0.5
            ? "blue"
            : "gray"
        }
        size="sm"
      >
        {Math.round(candidate.match_score * 100)}%
      </Tag>
    ),
  }));

  return (
    <ComposedModal open={open} onClose={() => onOpenChange(false)} size="lg">
      <ModalHeader>
        <h3>Invite Candidates to {project?.name}</h3>
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

        {loading ? (
          <Loading withOverlay={false} description="Loading matching candidates..." />
        ) : (
          <>
            <div style={{ marginBottom: "16px" }}>
              <p style={{ color: "var(--cds-text-secondary)", marginBottom: "12px" }}>
                Candidates are matched based on their career path preferences. Select candidates to invite to this project.
              </p>
              <Search
                labelText="Search candidates"
                placeholder="Search by name, email, or career path..."
                value={searchTerm}
                onChange={(e: any) => setSearchTerm(e.target.value)}
                size="md"
              />
            </div>

            {filteredCandidates.length === 0 ? (
              <div style={{ textAlign: "center", padding: "32px 0" }}>
                <p style={{ color: "var(--cds-text-secondary)" }}>
                  {candidates.length === 0
                    ? "No matching candidates found. Make sure the project has career paths assigned."
                    : "No candidates match your search criteria."}
                </p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "12px", display: "flex", alignItems: "center", gap: "12px" }}>
                  <Checkbox
                    id="select-all"
                    checked={
                      filteredCandidates.length > 0 &&
                      filteredCandidates.every((c) => selectedCandidates.has(c.id))
                    }
                    indeterminate={
                      selectedCandidates.size > 0 &&
                      selectedCandidates.size < filteredCandidates.length
                    }
                    onChange={(e: any) => handleSelectAll(e.target.checked)}
                    labelText={`Select all (${selectedCandidates.size} selected)`}
                  />
                </div>

                <DataTable rows={rows} headers={headers}>
                  {({ rows, headers, getTableProps, getHeaderProps, getRowProps }: any) => (
                    <TableContainer>
                      <Table {...getTableProps()}>
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
          </>
        )}
      </ModalBody>
      <ModalFooter>
        <Button kind="secondary" onClick={() => onOpenChange(false)} disabled={sending}>
          Cancel
        </Button>
        <Button
          kind="primary"
          onClick={handleSendInvitations}
          disabled={loading || sending || selectedCandidates.size === 0}
        >
          {sending
            ? "Sending..."
            : `Send ${selectedCandidates.size} Invitation${selectedCandidates.size !== 1 ? "s" : ""}`}
        </Button>
      </ModalFooter>
    </ComposedModal>
  );
}

// Made with Bob
