// src/components/leader-view/LeaderAmbitionsPage.tsx
import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Column,
  ClickableTile,
  Button,
  Tag,
  Modal,
  Loading,
  ToastNotification,
  Search,
  ComboBox,
  MultiSelect,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from "@carbon/react";
import {
  TrashCan,
  Add,
  View,
  UserFollow,
  Calendar,
  User,
  Time,
} from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";
import useAuth from "@/hooks/useAuth";

// NOTE: These imports assume leader-view is a sibling of carbon/ under src/components.
// Adjust paths if you move files later.
import CreateAmbitionModal from "../carbon/CreateAmbitionModal";
import CreateProjectModal from "../carbon/CreateProjectModal";
import AssignTeamMembersModal from "../carbon/AssignTeamMembersModal";
import ApplicantProfileModal from "../carbon/ApplicantProfileModal";
import ViewAmbitionModal from "../carbon/ViewAmbitionModal";
import ViewProjectModal from "../ViewProjectModal";

interface LeaderAmbitionsPageProps {
  user: any; // legacy prop; may be minimal (id/email) in some pages
  selectedAmbition?: string | null;
  onClearFilter?: () => void;
}

/**
 * LeaderAmbitionsPage
 * -------------------
 * Leader/Manager-only surface extracted from AmbitionsTab.tsx.
 *
 * Responsibilities:
 *  1) Manage Strategic Ambitions (create/view/delete)
 *  2) Manage Projects (browse/filter/sort, view/edit, assign team members)
 *
 * Explicitly NOT included (moved to Intern experience redesign):
 *  - Intern project browsing/apply
 *  - Career paths
 *  - Invitations
 */
export default function LeaderAmbitionsPage({
  user,
  selectedAmbition,
  onClearFilter,
}: LeaderAmbitionsPageProps) {
  // ==============================
  // SECTION: Auth / Role
  // ==============================
  const { user: authUser, loading: authLoading } = useAuth(); // proxy-mode full users row in original file
  const accessRole = (authUser?.access_role || user?.access_role || "").toLowerCase();
  const isLeaderOrManager = accessRole === "manager" || accessRole === "leader";
  const canCreate = isLeaderOrManager;

  // ==============================
  // SECTION: UI State (tabs/modals)
  // ==============================
  const [activeTab, setActiveTab] = useState(0);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  const [showViewAmbitionModal, setShowViewAmbitionModal] = useState(false);
  const [viewingAmbition, setViewingAmbition] = useState<any>(null);

  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const [showAssignModal, setShowAssignModal] = useState(false);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ambitionToDelete, setAmbitionToDelete] = useState<any>(null);

  const [notification, setNotification] = useState<{
    kind: "success" | "error" | "warning" | "info";
    title: string;
    subtitle?: string;
  } | null>(null);

  // ==============================
  // SECTION: Data State
  // ==============================
  const [ambitions, setAmbitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);

  // Filters + options (leader Projects tab)
  const [searchTerm, setSearchTerm] = useState("");
  const [ambitionFilter, setAmbitionFilter] = useState<string>(selectedAmbition || "");
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("newest");

  const [skills, setSkills] = useState<any[]>([]);
  const [ambitionOptions, setAmbitionOptions] = useState<any[]>([]);
  const [skillOptions, setSkillOptions] = useState<any[]>([]);

  // Keep dropdown filter in sync with URL param if it changes.
  useEffect(() => {
    setAmbitionFilter(selectedAmbition || "");
  }, [selectedAmbition]);

  const sortOptions = useMemo(
    () => [
      { id: "newest", label: "Newest" },
      { id: "oldest", label: "Oldest" },
      { id: "deadline_soon", label: "Deadline (Soonest)" },
      { id: "deadline_late", label: "Deadline (Latest)" },
    ],
    []
  );

  // ==============================
  // SECTION: Permissions Helpers
  // ==============================
  const canDeleteAmbition = (ambition: any) => {
    // Managers can delete anything; leaders can delete their own ambitions
    if (!isLeaderOrManager) return false;
    if (accessRole === "manager") return true;
    return ambition?.leaderId && ambition.leaderId === (authUser?.id || user?.id);
  };

  // ==============================
  // SECTION: Data Fetching
  // ==============================
const fetchAmbitions = async () => {
  setLoading(true);

  try {
    // 1) Fetch ambitions via RPC (matches AmbitionsTab.tsx)
    const { data: ambitionsData, error: ambitionsError } = await (supabase as any).rpc(
      "get_ambitions"
    );
    if (ambitionsError) throw ambitionsError;

    // 2) Fetch projects via RPC so we can derive projectCount per ambition (matches AmbitionsTab.tsx)
    const { data: projectsData, error: projectsError } = await (supabase as any).rpc(
      "get_projects_enhanced"
    );
    if (projectsError) throw projectsError;

    // 3) Normalize ambitions into the UI shape used by the page
    // IMPORTANT: DB/RPC uses `name`, UI expects `title`
    const mapped = (ambitionsData || []).map((ambition: any) => {
      const projectCount =
        (projectsData || []).filter((p: any) => p.ambition_name === ambition.name).length;

      return {
        ...ambition,
        // normalize names so the rest of the component can keep using `title`
        title: ambition.name,
        leaderId: ambition.leader_id,
        leader: ambition.leader_name || "No leader",
        projectCount,
      };
    });

    setAmbitions(mapped);

    // 4) Build ambitionOptions for filter dropdown (keep ids as string names like original)
    setAmbitionOptions(
      mapped.map((a: any) => ({
        id: a.title,
        label: a.title,
      }))
    );
  } catch (err: any) {
    setNotification({
      kind: "error",
      title: "Failed to load ambitions",
      subtitle: err?.message,
    });
  } finally {
    setLoading(false);
  }
};

  const fetchSkills = async () => {
    try {
      const { data, error } = await (supabase as any)
        .from("skills")
        .select("id, name")
        .order("name", { ascending: true });

      if (error) throw error;

      setSkills(data || []);
      setSkillOptions(
        (data || []).map((s: any) => ({
          id: s.name,
          label: s.name,
        }))
      );
    } catch (err: any) {
      // non-blocking
      console.warn("Failed to load skills:", err?.message);
    }
  };

 const fetchProjects = async () => {
  setProjectsLoading(true);

  try {
    // Fetch all projects via RPC (matches AmbitionsTab.tsx)
    const { data: rawProjects, error } = await (supabase as any).rpc("get_projects_enhanced");
    if (error) throw error;

    let results = (rawProjects || []).map((p: any) => ({
      ...p,
      // Normalize to fields used throughout the UI
      ambition_name: p.ambition_name ?? null,
      pm_name: p.pm_name ?? null,
    }));

    // ------------------------------
    // Apply Filters (client-side)
    // ------------------------------

    // Ambition filter (URL param OR dropdown)
    const ambitionTitle = (selectedAmbition || ambitionFilter || "").trim();
    if (ambitionTitle) {
      results = results.filter((p: any) => (p.ambition_name || "") === ambitionTitle);
    }

    // Search term
    if (searchTerm.trim()) {
      const t = searchTerm.trim().toLowerCase();
      results = results.filter((p: any) => {
        const name = (p.name || "").toLowerCase();
        const desc = (p.description || "").toLowerCase();
        return name.includes(t) || desc.includes(t);
      });
    }

    // Skills filter
    if (skillsFilter.length > 0) {
      results = results.filter((p: any) => {
        const projSkills: string[] = Array.isArray(p.skills) ? p.skills : [];
        return skillsFilter.every((s) => projSkills.includes(s));
      });
    }

    // ------------------------------
    // Sorting (client-side)
    // ------------------------------
    if (sortBy === "newest") {
      results.sort((a: any, b: any) => +new Date(b.created_at) - +new Date(a.created_at));
    } else if (sortBy === "oldest") {
      results.sort((a: any, b: any) => +new Date(a.created_at) - +new Date(b.created_at));
    } else if (sortBy === "deadline_soon") {
      results.sort((a: any, b: any) => {
        const da = a.deadline ? +new Date(a.deadline) : Number.POSITIVE_INFINITY;
        const db = b.deadline ? +new Date(b.deadline) : Number.POSITIVE_INFINITY;
        return da - db;
      });
    } else if (sortBy === "deadline_late") {
      results.sort((a: any, b: any) => {
        const da = a.deadline ? +new Date(a.deadline) : Number.NEGATIVE_INFINITY;
        const db = b.deadline ? +new Date(b.deadline) : Number.NEGATIVE_INFINITY;
        return db - da;
      });
    }

    setProjects(results);
  } catch (err: any) {
    setNotification({
      kind: "error",
      title: "Failed to load projects",
      subtitle: err?.message,
    });
  } finally {
    setProjectsLoading(false);
  }
};


  // ==============================
  // SECTION: Lifecycle
  // ==============================
  useEffect(() => {
    // Initial load (leader)
    fetchAmbitions();
    fetchSkills();
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // Re-fetch projects when leader changes filters
    fetchProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, ambitionFilter, skillsFilter, sortBy, selectedAmbition]);

  // ==============================
  // SECTION: Action Handlers
  // ==============================
  const handleAmbitionCreated = () => {
    setNotification({ kind: "success", title: "Ambition created" });
    fetchAmbitions();
  };

  const handleProjectCreated = () => {
    setNotification({ kind: "success", title: "Project created" });
    fetchProjects();
  };

  const handleTeamMembersAssigned = () => {
    setNotification({ kind: "success", title: "Team members assigned" });
    fetchProjects();
  };

  const handleViewProjects = (ambitionTitle: string) => {
    // Clicking "View Projects" from an ambition tile should:
    // 1) move to Projects tab
    // 2) apply ambition filter
    setActiveTab(1);
    setAmbitionFilter(ambitionTitle);

    // If URL filter is being used, parent can clear it or set it.
    // We leave URL responsibilities to AmbitionsPage; this component only updates state.
  };

  const handleViewLeaderProfile = async (leaderId: string) => {
    try {
      const { data, error } = await (supabase as any)
        .from("users")
        .select("*")
        .eq("id", leaderId)
        .single();

      if (error) throw error;

      setSelectedProfile(data);
      setShowProfileModal(true);
    } catch (err: any) {
      setNotification({
        kind: "error",
        title: "Failed to load profile",
        subtitle: err?.message,
      });
    }
  };

  const handleDeleteAmbition = async (ambitionId: string) => {
    try {
      const { error } = await (supabase as any)
        .from("ambitions")
        .delete()
        .eq("id", ambitionId);

      if (error) throw error;

      setNotification({ kind: "success", title: "Ambition deleted" });
      setDeleteModalOpen(false);
      setAmbitionToDelete(null);

      fetchAmbitions();
      fetchProjects();
    } catch (err: any) {
      setNotification({
        kind: "error",
        title: "Failed to delete ambition",
        subtitle: err?.message,
      });
    }
  };

  // ==============================
  // SECTION: Render Guards
  // ==============================
  if (authLoading || (loading && projectsLoading)) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
        <Loading withOverlay={false} />
      </div>
    );
  }

  // ==============================
  // SECTION: Render
  // ==============================
  return (
    <>
      <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          {/* ==============================
              HEADER
          ============================== */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "32px",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: "32px",
                  fontWeight: 600,
                  color: "var(--cds-text-primary)",
                  marginBottom: "8px",
                }}
              >
                Ambitions & Projects
              </h2>
              <p style={{ color: "var(--cds-text-secondary)", fontSize: "16px" }}>
                Explore strategic initiatives and manage projects that align with IBM goals.
              </p>

              {!!selectedAmbition && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginTop: "8px",
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

            {canCreate && (
              <div style={{ display: "flex", gap: "12px" }}>
                <Button
                  kind="secondary"
                  renderIcon={Add}
                  onClick={() => setShowCreateModal(true)}
                >
                  Create Ambition
                </Button>
                <Button
                  kind="primary"
                  renderIcon={Add}
                  onClick={() => setShowCreateProjectModal(true)}
                >
                  Create Project
                </Button>
              </div>
            )}
          </div>

          {/* ==============================
              TABS (Leader Only)
          ============================== */}
          <Tabs
            selectedIndex={activeTab}
            onChange={(evt: any) => {
              setActiveTab(evt.selectedIndex);
            }}
          >
            <TabList aria-label="Leader ambitions and projects">
              <Tab>Strategic Ambitions</Tab>
              <Tab>All Projects</Tab>
            </TabList>

            <TabPanels>
              {/* ==============================
                  TAB 0: Strategic Ambitions
              ============================== */}
              <TabPanel>
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "16px", color: "var(--cds-text-secondary)" }}>
                    Strategic ambitions represent high-level business goals. Each ambition can contain multiple projects.
                  </p>
                </div>

                {ambitions.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "64px 0" }}>
                    <p style={{ color: "var(--cds-text-secondary)" }}>
                      No ambitions found. Contact your administrator to create strategic ambitions.
                    </p>
                  </div>
                ) : (
                  <Grid fullWidth>
                    {ambitions.map((ambition: any) => (
                      <Column
                        key={ambition.id}
                        lg={5}
                        md={4}
                        sm={4}
                        style={{ marginBottom: "24px" }}
                      >
                        <ClickableTile
                          onClick={() => {
                            setViewingAmbition(ambition);
                            setShowViewAmbitionModal(true);
                          }}
                          style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderLeft: "4px solid var(--cds-interactive)",
                          }}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "flex-start",
                              marginBottom: "16px",
                            }}
                          >
                            <div style={{ flex: 1 }}>
                              <h3
                                style={{
                                  fontSize: "18px",
                                  fontWeight: 600,
                                  color: "var(--cds-interactive)",
                                  marginBottom: "8px",
                                }}
                              >
                                {ambition.title}
                              </h3>
                              <p
                                style={{
                                  fontSize: "14px",
                                  color: "var(--cds-text-secondary)",
                                  lineHeight: "1.4",
                                }}
                              >
                                {ambition.description}
                              </p>
                            </div>

                            {canDeleteAmbition(ambition) && (
                              <Button
                                kind="ghost"
                                size="sm"
                                renderIcon={TrashCan}
                                iconDescription="Delete ambition"
                                hasIconOnly
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setAmbitionToDelete(ambition);
                                  setDeleteModalOpen(true);
                                }}
                                style={{ color: "var(--cds-support-error)" }}
                              />
                            )}
                          </div>

                          <div style={{ marginTop: "auto" }}>
                            <div style={{ marginBottom: "16px" }}>
                              <p
                                style={{
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: "var(--cds-text-primary)",
                                  marginBottom: "8px",
                                }}
                              >
                                Leader
                              </p>
                              <Tag
                                size="sm"
                                type="blue"
                                style={{
                                  cursor: ambition.leaderId ? "pointer" : "default",
                                }}
                                onClick={
                                  ambition.leaderId
                                    ? (e) => {
                                        e.stopPropagation();
                                        handleViewLeaderProfile(ambition.leaderId);
                                      }
                                    : undefined
                                }
                              >
                                {ambition.leader}
                              </Tag>
                            </div>

                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                {ambition.projectCount} project
                                {ambition.projectCount !== 1 ? "s" : ""}
                              </span>
                              <Button
                                kind="primary"
                                size="sm"
                                renderIcon={View}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewProjects(ambition.title);
                                }}
                              >
                                View Projects
                              </Button>
                            </div>
                          </div>
                        </ClickableTile>
                      </Column>
                    ))}
                  </Grid>
                )}
              </TabPanel>

              {/* ==============================
                  TAB 1: All Projects (Leader)
              ============================== */}
              <TabPanel>
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "16px", color: "var(--cds-text-secondary)" }}>
                    Browse projects, filter by ambition/skills, and assign team members.
                  </p>
                </div>

                {/* Filters */}
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "16px",
                    alignItems: "flex-end",
                    marginBottom: "32px",
                  }}
                >
                  <div style={{ minWidth: "250px" }}>
                    <Search
                      labelText="Search projects"
                      placeholder="Search projects..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm((e.target as HTMLInputElement).value)}
                      size="md"
                    />
                  </div>

                  <div style={{ minWidth: "200px" }}>
                    <ComboBox
                      id="ambition-filter-leader"
                      items={ambitionOptions}
                      itemToString={(item) => item?.label || ""}
                      titleText="Filter by ambition"
                      placeholder="Filter by ambition"
                      selectedItem={ambitionOptions.find((o: any) => o.id === ambitionFilter)}
                      onChange={({ selectedItem }) => setAmbitionFilter(selectedItem?.id || "")}
                    />
                  </div>

                  <div style={{ minWidth: "200px" }}>
                    <MultiSelect
                      id="skills-filter-leader"
                      items={skillOptions}
                      itemToString={(item) => item?.label || ""}
                      titleText="Filter by skills"
                      label="Filter by skills"
                      selectedItems={skillOptions.filter((opt: any) => skillsFilter.includes(opt.id))}
                      onChange={({ selectedItems }) =>
                        setSkillsFilter((selectedItems || []).map((item: any) => item.id))
                      }
                    />
                  </div>

                  <div style={{ minWidth: "180px" }}>
                    <ComboBox
                      id="sort-filter-leader"
                      items={sortOptions}
                      itemToString={(item) => item?.label || ""}
                      titleText="Sort by"
                      placeholder="Sort by"
                      selectedItem={sortOptions.find((opt: any) => opt.id === sortBy)}
                      onChange={({ selectedItem }) => setSortBy(selectedItem?.id || "newest")}
                    />
                  </div>
                </div>

                {projectsLoading ? (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      minHeight: "400px",
                    }}
                  >
                    <Loading withOverlay={false} />
                  </div>
                ) : projects.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "64px 0" }}>
                    <p style={{ color: "var(--cds-text-secondary)" }}>
                      No projects found matching your criteria.
                    </p>
                  </div>
                ) : (
                  <Grid fullWidth>
                    {projects.map((project: any) => (
                      <Column
                        key={project.id}
                        lg={5}
                        md={4}
                        sm={4}
                        style={{ marginBottom: "32px" }}
                      >
                        <ClickableTile
                          onClick={() => {
                            setSelectedProject(project);
                            setShowViewModal(true);
                          }}
                          style={{
                            height: "100%",
                            display: "flex",
                            flexDirection: "column",
                            borderLeft: "4px solid var(--cds-interactive)",
                          }}
                        >
                          <div style={{ marginBottom: "16px" }}>
                            <h3
                              style={{
                                fontSize: "18px",
                                fontWeight: 600,
                                color: "var(--cds-interactive)",
                                marginBottom: "8px",
                              }}
                            >
                              {project.name}
                            </h3>
                            <p
                              style={{
                                fontSize: "14px",
                                color: "var(--cds-text-secondary)",
                                lineHeight: "1.4",
                                marginBottom: "12px",
                              }}
                            >
                              {project.description}
                            </p>

                            <div style={{ marginBottom: "12px" }}>
                              <Tag type="blue" size="sm">
                                {project.ambition_name || "No Ambition"}
                              </Tag>
                            </div>
                          </div>

                          {Array.isArray(project.skills) && project.skills.length > 0 && (
                            <div style={{ marginBottom: "16px" }}>
                              <p
                                style={{
                                  fontSize: "12px",
                                  fontWeight: 500,
                                  marginBottom: "8px",
                                  color: "var(--cds-text-primary)",
                                }}
                              >
                                Required Skills:
                              </p>
                              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                {project.skills.slice(0, 3).map((skill: string, i: number) => (
                                  <Tag key={i} type="outline" size="sm">
                                    {skill}
                                  </Tag>
                                ))}
                                {project.skills.length > 3 && (
                                  <Tag type="outline" size="sm">
                                    +{project.skills.length - 3} more
                                  </Tag>
                                )}
                              </div>
                            </div>
                          )}

                          <div style={{ marginTop: "auto" }}>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                marginBottom: "12px",
                                flexWrap: "wrap",
                                gap: "8px",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                <User size={16} />
                                <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                  {project.pm_name || "No PM"}
                                </span>
                              </div>

                              {project.deadline && (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <Calendar size={16} />
                                  <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                    {new Date(project.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                              )}

                              {project.hours_per_week && (
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  <Time size={16} />
                                  <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                    {project.hours_per_week}h/week
                                  </span>
                                </div>
                              )}
                            </div>

                            <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
                              <Button
                                kind="primary"
                                size="md"
                                renderIcon={UserFollow}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedProject(project);
                                  setShowAssignModal(true);
                                }}
                                style={{ flex: 1, minHeight: "40px", fontWeight: 500 }}
                              >
                                Assign Team Members
                              </Button>
                            </div>
                          </div>
                        </ClickableTile>
                      </Column>
                    ))}
                  </Grid>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Column>
      </Grid>

      {/* ==============================
          MODALS + NOTIFICATIONS
      ============================== */}

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        modalHeading="Delete Ambition"
        modalLabel="Confirmation"
        primaryButtonText="Delete"
        danger
        secondaryButtonText="Cancel"
        onRequestSubmit={() => ambitionToDelete && handleDeleteAmbition(ambitionToDelete.id)}
      >
        <p>
          Are you sure you want to delete the ambition "{ambitionToDelete?.title}"? This action
          cannot be undone.
        </p>
      </Modal>

      {/* Toast Notification */}
      {notification && (
        <ToastNotification
          kind={notification.kind}
          title={notification.title}
          subtitle={notification.subtitle}
          onClose={() => setNotification(null)}
          timeout={5000}
        />
      )}

      {/* Create / View / Assign Modals */}
      <CreateAmbitionModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
        onAmbitionCreated={handleAmbitionCreated}
      />
      <CreateProjectModal
        open={showCreateProjectModal}
        onOpenChange={setShowCreateProjectModal}
        onProjectCreated={handleProjectCreated}
      />
      <ViewProjectModal
        open={showViewModal}
        onOpenChange={setShowViewModal}
        project={selectedProject}
        onUpdate={() => {
          fetchProjects();
        }}
      />
      <AssignTeamMembersModal
        open={showAssignModal}
        onOpenChange={setShowAssignModal}
        project={selectedProject}
        onTeamMembersAssigned={handleTeamMembersAssigned}
      />
      <ApplicantProfileModal
        open={showProfileModal}
        onOpenChange={setShowProfileModal}
        profileData={selectedProfile}
      />
      <ViewAmbitionModal
        open={showViewAmbitionModal}
        onOpenChange={setShowViewAmbitionModal}
        ambition={viewingAmbition}
        onViewProjects={handleViewProjects}
        onUpdate={() => {
          fetchAmbitions();
          fetchProjects();
        }}
      />
    </>
  );
}
