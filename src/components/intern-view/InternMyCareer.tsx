// src/components/intern-view/InternMyCareer.tsx
import MyCareerGraph from "@/components/intern-view/MyCareerGraph";
import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Column,
  ClickableTile,
  Button,
  Tag,
  Loading,
  ToastNotification,
} from "@carbon/react";
import { Rocket, UserAvatar, Favorite, Email } from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";

// Shared modals/components (these existed in AmbitionsTab and are not leader-only)
import ApplicantProfileModal from "@/components/carbon/ApplicantProfileModal";
import ViewAmbitionModal from "@/components/carbon/ViewAmbitionModal";
import ViewProjectModal from "@/components/ViewProjectModal";

/**
 * Props intentionally mirror AmbitionsTab for easier swap-in from AmbitionsPage routing.
 */
interface InternMyCareerProps {
  user: any; // legacy prop pattern from AmbitionsTab; can be typed later
  selectedAmbition?: string | null;
  onClearFilter?: () => void;
}

type NotificationState = {
  kind: "success" | "error" | "warning" | "info";
  title: string;
  subtitle?: string;
} | null;

export default function InternMyCareer({
  user,
  selectedAmbition,
  onClearFilter,
}: InternMyCareerProps) {
  // ---------------------------------------------------------------------------
  // SECTION 1: Auth / Navigation
  // ---------------------------------------------------------------------------
  const { user: authUser, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Authoritative role check
  // This component is intended for interns, but we keep this guard for safety.
  const accessRole = (
    authUser?.access_role ||
    user?.access_role ||
    ""
  ).toLowerCase();
  const isLeaderOrManager = accessRole === "manager" || accessRole === "leader";

  const effectiveUserId = authUser?.id || user?.id;

  // ---------------------------------------------------------------------------
  // SECTION 2: Shared UI state carried over from AmbitionsTab
  // (profile modal, view ambition/project modal, notifications)
  // ---------------------------------------------------------------------------
  const [notification, setNotification] = useState<NotificationState>(null);

  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showViewAmbitionModal, setShowViewAmbitionModal] = useState(false);
  const [viewingAmbition, setViewingAmbition] = useState<any>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // ---------------------------------------------------------------------------
  // SECTION 3: Data state from prior intern implementation (kept for reuse)
  // ---------------------------------------------------------------------------

  // Ambitions list (used previously; likely still useful for displaying ambition nodes)
  const [ambitions, setAmbitions] = useState<any[]>([]);
  const [ambitionsLoading, setAmbitionsLoading] = useState(true);

  // Career paths + preferences (legacy intern tab; keep for preference mechanics reuse)
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [userPreferences, setUserPreferences] = useState<any[]>([]);
  const [careerPathsLoading, setCareerPathsLoading] = useState(true);

  // Invitations (legacy intern tab; may later become “assignment events” or “notifications”)
  const [invitations, setInvitations] = useState<any[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(true);

  // Projects (legacy intern browsing surface - DO NOT render as a browsing surface anymore)
  // Keep state because MyCareer/MyProjects will still need project entities.
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Skills list (useful for filters, and later for “skills practiced” display)
  const [skills, setSkills] = useState<string[]>([]);

  // ---------------------------------------------------------------------------
  // SECTION 4: Data fetching (ported as-is in spirit; can be replaced later)
  // IMPORTANT: We DO NOT render “browse projects” UI anymore.
  // ---------------------------------------------------------------------------

  const fetchAmbitions = async () => {
    try {
      setAmbitionsLoading(true);

      // Same RPC used in AmbitionsTab
      const { data: ambitionsData, error } = await supabase.rpc(
        "get_ambitions"
      );
      if (error) throw error;

      // Minimal transform – keep it flexible for MyCareer graph nodes later
      const transformed =
        ambitionsData?.map((amb: any) => ({
          id: amb.id,
          title: amb.name,
          description: amb.description,
          leader: amb.leader_name || "Unassigned",
          leaderId: amb.leader_id,
          createdBy: amb.created_by,
        })) ?? [];

      setAmbitions(transformed);
    } catch (err: any) {
      console.error("Error fetching ambitions:", err);
      setNotification({
        kind: "error",
        title: "Error loading ambitions",
        subtitle: err?.message ?? String(err),
      });
    } finally {
      setAmbitionsLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.from("skills").select("name");
      if (error) throw error;
      setSkills(data?.map((s: any) => s.name) ?? []);
    } catch (err: any) {
      console.error("Error fetching skills:", err);
      // Non-blocking; no toast required
    }
  };

  const fetchCareerPathsAndPreferences = async () => {
    try {
      setCareerPathsLoading(true);

      const { data: paths, error: pathsError } = await supabase
        .from("career_paths" as any)
        .select("*")
        .order("name");
      if (pathsError) throw pathsError;

      setCareerPaths(paths || []);

      if (effectiveUserId) {
        const { data: prefs, error: prefsError } = await supabase
          .from("user_path_preferences" as any)
          .select("*")
          .eq("user_id", effectiveUserId);
        if (prefsError) throw prefsError;

        setUserPreferences(prefs || []);
      } else {
        setUserPreferences([]);
      }
    } catch (err: any) {
      console.error("Error fetching career paths:", err);
      setNotification({
        kind: "error",
        title: "Error loading career preferences",
        subtitle: err?.message ?? String(err),
      });
    } finally {
      setCareerPathsLoading(false);
    }
  };

  const fetchInvitations = async () => {
    try {
      setInvitationsLoading(true);
      if (!effectiveUserId) return;

      const { data, error } = await supabase
        .from("project_invitations" as any)
        .select(
          `
          *,
          project:projects (
            id,
            name,
            description,
            deadline,
            hours_per_week,
            ambition:ambitions (name),
            pm:users!projects_pm_id_fkey (display_name)
          )
        `
        )
        .eq("user_id", effectiveUserId)
        .in("status", ["invited", "accepted", "declined"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (err: any) {
      console.error("Error fetching invitations:", err);
      setNotification({
        kind: "error",
        title: "Error loading invitations",
        subtitle: err?.message ?? String(err),
      });
    } finally {
      setInvitationsLoading(false);
    }
  };

  /**
   * NOTE: In the new rules, interns do NOT browse all projects.
   * This fetch is kept as a placeholder for future: “assigned projects only”.
   * Replace the RPC/query later with an assigned-projects view.
   */
  const fetchAssignedProjectsPlaceholder = async () => {
    try {
      setProjectsLoading(true);

      // PLACEHOLDER:
      // - Replace with a query/view like: get_assigned_projects(p_user_id)
      // - Or join through membership table
      // For now, keep it empty to avoid accidentally restoring browsing visibility.
      setProjects([]);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setNotification({
        kind: "error",
        title: "Error loading projects",
        subtitle: err?.message ?? String(err),
      });
    } finally {
      setProjectsLoading(false);
    }
  };

  // ---------------------------------------------------------------------------
  // SECTION 5: Effects (bootstrapping)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // Guard: if somehow this mounts for a leader, we don’t want to expose intern-only behavior.
    // (AmbitionsPage should route correctly anyway.)
    if (isLeaderOrManager) return;

    fetchAmbitions();
    fetchSkills();

    // Legacy (kept for reuse) — may evolve into “preference selection” inside MyCareer
    fetchCareerPathsAndPreferences();

    // Legacy (kept) — may evolve into “assignment events/notifications”
    fetchInvitations();

    // New rule: assigned-only projects (placeholder; safe no-browse)
    fetchAssignedProjectsPlaceholder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLeaderOrManager, effectiveUserId]);

  // ---------------------------------------------------------------------------
  // SECTION 6: Derived helpers (optional)
  // ---------------------------------------------------------------------------
  const isLoading =
    authLoading ||
    ambitionsLoading ||
    careerPathsLoading ||
    invitationsLoading ||
    projectsLoading;

  const preferenceCountLabel = useMemo(() => {
    // Keep this around for UI later (e.g., “3/3 preferences selected”)
    return `${userPreferences.length}/3`;
  }, [userPreferences.length]);

  // ---------------------------------------------------------------------------
  // SECTION 7: Render (minimal skeleton; MyCareer graph will replace this)
  // ---------------------------------------------------------------------------
  if (authLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 320,
        }}
      >
        <Loading withOverlay={false} />
      </div>
    );
  }

  // Safety: if routed incorrectly
  if (isLeaderOrManager) {
    return (
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <ToastNotification
            kind="warning"
            title="Routing mismatch"
            subtitle="InternMyCareer mounted for a leader/manager. Please route to LeaderAmbitionsPage instead."
            hideCloseButton
            timeout={0}
          />
        </Column>
      </Grid>
    );
  }

  return (
    <>
      {/* ------------------------------------------------------------------- */}
      {/* SECTION: Notifications */}
      {/* ------------------------------------------------------------------- */}
      {notification && (
        <div style={{ marginBottom: 16 }}>
          <ToastNotification
            kind={notification.kind}
            title={notification.title}
            subtitle={notification.subtitle}
            timeout={4000}
            onCloseButtonClick={() => setNotification(null)}
          />
        </div>
      )}

      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          {/* ------------------------------------------------------------------- */}
          {/* SECTION: Page Header */}
          {/* ------------------------------------------------------------------- */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 24,
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 32,
                  fontWeight: 600,
                  color: "var(--cds-text-primary)",
                  marginBottom: 8,
                }}
              >
                My Career
              </h2>
              <p
                style={{
                  color: "var(--cds-text-secondary)",
                  fontSize: 16,
                  maxWidth: 900,
                }}
              >
                Your career dashboard: track your profile, interests, and how
                your assigned projects shape your growth.
              </p>

              {/* Keep this to avoid breaking deep-link behavior from AmbitionsPage */}
              {selectedAmbition && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    marginTop: 8,
                  }}
                >
                  <Tag type="blue" size="sm">
                    Filtered by: {selectedAmbition}
                  </Tag>
                  {onClearFilter && (
                    <Button kind="ghost" size="sm" onClick={onClearFilter}>
                      Clear Filter
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Placeholder action(s) - adjust later */}
            <div style={{ display: "flex", gap: 12 }}>
              <Button
                kind="secondary"
                renderIcon={UserAvatar}
                onClick={() => navigate("/your-projects")}
              >
                Edit Profile
              </Button>
            </div>
          </div>

          {/* ------------------------------------------------------------------- */}
          {/* SECTION: Loading State */}
          {/* ------------------------------------------------------------------- */}
          {isLoading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 320,
              }}
            >
              <Loading withOverlay={false} />
            </div>
          ) : (
            <>
              {/* ------------------------------------------------------------------- */}
              {/* SECTION: MyCareer Graph Placeholder */}
              {/* ------------------------------------------------------------------- */}
              <div style={{ marginBottom: 16 }}>
                {effectiveUserId ? (
                  <MyCareerGraph userId={effectiveUserId} />
                ) : (
                  <ToastNotification
                    kind="warning"
                    title="Cannot load graph"
                    subtitle="No user id available."
                    timeout={0}
                    hideCloseButton
                  />
                )}
              </div>

              {/* ------------------------------------------------------------------- */}
              {/* SECTION: Quick Summary Tiles (safe, non-project-browsing) */}
              {/* ------------------------------------------------------------------- */}
              <Grid fullWidth>
                <Column lg={5} md={4} sm={4} style={{ marginBottom: 16 }}>
                  <ClickableTile
                    style={{ padding: 20 }}
                    onClick={() => {
                      setNotification({
                        kind: "info",
                        title: "Career Interests",
                        subtitle: `You have ${userPreferences.length} of 3 career path preferences saved. Update your preferences to help match you with relevant projects.`,
                      });
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px 0" }}>Interests</h4>
                    <p
                      style={{ margin: 0, color: "var(--cds-text-secondary)" }}
                    >
                      Preferences saved: <strong>{preferenceCountLabel}</strong>
                    </p>
                  </ClickableTile>
                </Column>

                <Column lg={5} md={4} sm={4} style={{ marginBottom: 16 }}>
                  <ClickableTile
                    style={{ padding: 20 }}
                    onClick={() => {
                      if (invitations.length > 0) {
                        setNotification({
                          kind: "info",
                          title: "Project Invitations",
                          subtitle: `You have ${invitations.length} invitation${invitations.length === 1 ? '' : 's'}. Review your invitations to accept or decline project assignments.`,
                        });
                      } else {
                        setNotification({
                          kind: "info",
                          title: "No Invitations",
                          subtitle: "You don't have any pending project invitations at this time.",
                        });
                      }
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px 0" }}>Invitations</h4>
                    <p
                      style={{ margin: 0, color: "var(--cds-text-secondary)" }}
                    >
                      Items loaded: <strong>{invitations.length}</strong>
                    </p>
                    <Button
                      kind="ghost"
                      size="sm"
                      renderIcon={Email}
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotification({
                          kind: "info",
                          title: "Invitations are being redesigned",
                          subtitle:
                            "This area will evolve into career events/assignments or be removed.",
                        });
                      }}
                      style={{ marginTop: 12 }}
                    >
                      View updates
                    </Button>
                  </ClickableTile>
                </Column>

                <Column lg={5} md={4} sm={4} style={{ marginBottom: 16 }}>
                  <ClickableTile
                    style={{ padding: 20 }}
                    onClick={() => {
                      setNotification({
                        kind: "info",
                        title: "Skills Catalog",
                        subtitle: `${skills.length} skills available. Explore skills to add to your profile and track your development across projects.`,
                      });
                    }}
                  >
                    <h4 style={{ margin: "0 0 8px 0" }}>Skills</h4>
                    <p
                      style={{ margin: 0, color: "var(--cds-text-secondary)" }}
                    >
                      Skills catalog loaded: <strong>{skills.length}</strong>
                    </p>
                    <Button
                      kind="ghost"
                      size="sm"
                      renderIcon={Favorite}
                      onClick={(e) => {
                        e.stopPropagation();
                        setNotification({
                          kind: "info",
                          title: "Skills view coming soon",
                          subtitle:
                            "This will show skills practiced per project node in the My Career graph.",
                        });
                      }}
                      style={{ marginTop: 12 }}
                    >
                      Explore
                    </Button>
                  </ClickableTile>
                </Column>
              </Grid>
            </>
          )}
        </Column>
      </Grid>
    </>
  );
}
