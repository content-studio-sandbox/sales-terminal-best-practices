// src/components/carbon/AmbitionsTab.tsx
import { useState, useEffect } from "react";
import {
  Grid,
  Column,
  ClickableTile,
  Button,
  Tag,
  Modal,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
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
  Favorite,
  FavoriteFilled,
  Checkmark,
  Close,
  Email,
  Rocket,
  UserAvatar,
  CheckmarkOutline
} from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import CreateAmbitionModal from "./CreateAmbitionModal";
import ApplicantProfileModal from "./ApplicantProfileModal";
import CreateProjectModal from "./CreateProjectModal";
import ApplyProjectModal from "./ApplyProjectModal";
import ViewProjectModal from "../ViewProjectModal";
import AssignTeamMembersModal from "./AssignTeamMembersModal";
import ViewAmbitionModal from "./ViewAmbitionModal";
import useAuth from "@/hooks/useAuth";

interface AmbitionsTabProps {
  user: any; // legacy prop; may be minimal (id/email) in some pages
  selectedAmbition?: string | null;
  onClearFilter?: () => void;
}

export default function AmbitionsTab({ user, selectedAmbition, onClearFilter }: AmbitionsTabProps) {
  const { user: authUser, loading: authLoading } = useAuth(); // <-- full users row in proxy mode
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showViewAmbitionModal, setShowViewAmbitionModal] = useState(false);
  const [viewingAmbition, setViewingAmbition] = useState<any>(null);
  const [ambitions, setAmbitions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [ambitionToDelete, setAmbitionToDelete] = useState<any>(null);
  const [notification, setNotification] = useState<{
    kind: "success" | "error" | "warning" | "info";
    title: string;
    subtitle?: string;
  } | null>(null);

  // TASK-3: Career Paths state for interns
  const [careerPaths, setCareerPaths] = useState<any[]>([]);
  const [userPreferences, setUserPreferences] = useState<any[]>([]);
  const [careerPathsLoading, setCareerPathsLoading] = useState(true);

  // TASK-6: Invitations state for interns
  const [invitations, setInvitations] = useState<any[]>([]);
  const [invitationsLoading, setInvitationsLoading] = useState(true);

  // Projects state
  const [projects, setProjects] = useState<any[]>([]);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ambitionFilter, setAmbitionFilter] = useState("");
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("newest");
  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [skills, setSkills] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);

  // ---- role gate (works now because authUser has access_role)
  const accessRole = (authUser?.access_role || user?.access_role || "").toLowerCase();
  const isLeaderOrManager = accessRole === "manager" || accessRole === "leader";
  const canCreate = isLeaderOrManager;
  const canDeleteAmbition = (amb: any) =>
      canCreate && (amb?.createdBy === user?.id || amb?.leaderId === user?.id);

  const fetchAmbitions = async () => {
    try {
      setLoading(true);

      const { data: ambitionsData, error } = await supabase.rpc("get_ambitions");
      if (error) throw error;

      const { data: projectsData, error: projectsError } = await supabase.rpc("get_projects_enhanced");
      if (projectsError) throw projectsError;

      const transformed =
          ambitionsData?.map((ambition: any) => {
            const projectCount = projectsData?.filter((project: any) => project.ambition_name === ambition.name).length || 0;
            return {
              id: ambition.id,
              title: ambition.name,
              description: ambition.description,
              leader: ambition.leader_name || "Unassigned",
              leaderId: ambition.leader_id,
              projectCount,
              createdBy: ambition.created_by,
            };
          }) ?? [];

      setAmbitions(transformed);
    } catch (err: any) {
      console.error("Error fetching ambitions:", err);
      setNotification({ kind: "error", title: "Error loading ambitions", subtitle: err.message ?? String(err) });
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      setProjectsLoading(true);
      console.log("🔄 [AmbitionsTab] Fetching projects...");
      const { data, error } = await supabase.rpc("get_projects_enhanced");
      if (error) throw error;

      console.log("📊 [AmbitionsTab] Projects fetched from API:", data?.length || 0, "projects");
      console.log("🔍 [AmbitionsTab] Filters applied:", { selectedAmbition, searchTerm, ambitionFilter, skillsFilter });

      const filtered =
          data?.filter((project: any) => {
            if (selectedAmbition && project.ambition_name !== selectedAmbition) return false;
            if (searchTerm) {
              const s = searchTerm.toLowerCase();
              if (!project.name.toLowerCase().includes(s) && !project.description.toLowerCase().includes(s)) return false;
            }
            if (ambitionFilter && project.ambition_name !== ambitionFilter) return false;
            if (skillsFilter.length > 0) {
              const ps: string[] = project.skills || [];
              const has = skillsFilter.some((sk) => ps.some((p) => String(p).toLowerCase().includes(sk.toLowerCase())));
              if (!has) return false;
            }
            return true;
          }) ?? [];

      console.log("✅ [AmbitionsTab] Projects after filtering:", filtered.length, "projects");

      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "newest":
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          case "oldest":
            return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          case "deadline":
            if (!a.deadline && !b.deadline) return 0;
            if (!a.deadline) return 1;
            if (!b.deadline) return -1;
            return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
          default:
            return 0;
        }
      });

      console.log("🎯 [AmbitionsTab] Final projects to display:", sorted.length);
      setProjects(sorted);
    } catch (err: any) {
      console.error("Error fetching projects:", err);
      setNotification({ kind: "error", title: "Error loading projects", subtitle: err.message ?? String(err) });
    } finally {
      setProjectsLoading(false);
    }
  };

  const fetchSkills = async () => {
    try {
      const { data, error } = await supabase.from("skills").select("name");
      if (error) throw error;
      setSkills(data?.map((s: any) => s.name) ?? []);
    } catch (err) {
      console.error("Error fetching skills:", err);
    }
  };

  // TASK-3: Fetch career paths and user preferences
  const fetchCareerPaths = async () => {
    try {
      setCareerPathsLoading(true);
      const { data: paths, error: pathsError} = await supabase
        .from("career_paths" as any)
        .select("*")
        .order("name");
      if (pathsError) throw pathsError;

      setCareerPaths(paths || []);

      // Only fetch preferences if user is authenticated
      const userId = authUser?.id || user?.id;
      if (userId) {
        const { data: prefs, error: prefsError } = await supabase
          .from("user_path_preferences" as any)
          .select("*")
          .eq("user_id", userId);
        if (prefsError) throw prefsError;
        setUserPreferences(prefs || []);
      } else {
        setUserPreferences([]);
      }
    } catch (err: any) {
      console.error("Error fetching career paths:", err);
      setNotification({ kind: "error", title: "Error loading career paths", subtitle: err.message ?? String(err) });
    } finally {
      setCareerPathsLoading(false);
    }
  };

  // TASK-3: Handle "I'm Interested" button click
  const handleCareerPathInterest = async (pathId: string) => {
    try {
      const userId = authUser?.id || user?.id;
      if (!userId) throw new Error("User not authenticated");

      // Check if already selected
      const existing = userPreferences.find(p => p.path_id === pathId);
      
      if (existing) {
        // Remove preference
        const { error } = await supabase
          .from("user_path_preferences" as any)
          .delete()
          .eq("user_id", userId)
          .eq("path_id", pathId);
        if (error) throw error;
        
        setNotification({ kind: "success", title: "Career path removed from your interests" });
      } else {
        // Check if user already has 3 preferences
        if (userPreferences.length >= 3) {
          setNotification({
            kind: "warning",
            title: "Maximum reached",
            subtitle: "You can only select up to 3 career paths. Remove one to add another."
          });
          return;
        }

        // Add preference with next available rank
        const nextRank = userPreferences.length + 1;
        const { error } = await supabase
          .from("user_path_preferences" as any)
          .insert({
            user_id: userId,
            path_id: pathId,
            rank: nextRank
          });
        if (error) throw error;
        
        setNotification({ kind: "success", title: "Career path added to your interests" });
      }

      // Refresh preferences
      await fetchCareerPaths();
    } catch (err: any) {
      setNotification({ kind: "error", title: "Error updating preferences", subtitle: err.message ?? String(err) });
    }
  };

  // TASK-6: Fetch invitations for interns
  const fetchInvitations = async () => {
    try {
      setInvitationsLoading(true);
      const userId = authUser?.id || user?.id;
      if (!userId) return;

      const { data, error } = await supabase
        .from("project_invitations" as any)
        .select(`
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
        `)
        .eq("user_id", userId)
        .in("status", ["invited", "accepted", "declined"])
        .order("created_at", { ascending: false });

      if (error) throw error;
      setInvitations(data || []);
    } catch (err: any) {
      console.error("Error fetching invitations:", err);
      setNotification({ kind: "error", title: "Error loading invitations", subtitle: err.message ?? String(err) });
    } finally {
      setInvitationsLoading(false);
    }
  };

  // TASK-6: Handle invitation response
  const handleInvitationResponse = async (invitationId: string, status: "accepted" | "declined") => {
    try {
      const { error } = await supabase
        .from("project_invitations" as any)
        .update({ status, responded_at: new Date().toISOString() })
        .eq("id", invitationId);

      if (error) throw error;

      setNotification({
        kind: "success",
        title: status === "accepted" ? "Invitation accepted!" : "Invitation declined",
        subtitle: status === "accepted" ? "You've been added to the project team." : undefined
      });

      await fetchInvitations();
    } catch (err: any) {
      setNotification({ kind: "error", title: "Error responding to invitation", subtitle: err.message ?? String(err) });
    }
  };

  useEffect(() => {
    fetchAmbitions();
    fetchProjects();
    fetchSkills();
    if (!isLeaderOrManager) {
      fetchCareerPaths();
      fetchInvitations();
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [selectedAmbition, searchTerm, ambitionFilter, skillsFilter, sortBy]);

  const handleDeleteAmbition = async (ambitionId: string) => {
    try {
      const { error } = await supabase.from("ambitions").delete().eq("id", ambitionId);
      if (error) throw error;
      setNotification({ kind: "success", title: "Ambition deleted successfully" });
      await fetchAmbitions();
    } catch (err: any) {
      setNotification({ kind: "error", title: "Error deleting ambition", subtitle: err.message ?? String(err) });
    } finally {
      setDeleteModalOpen(false);
      setAmbitionToDelete(null);
    }
  };

  const handleAmbitionCreated = () => {
    fetchAmbitions();
    fetchProjects();
    setShowCreateModal(false);
  };

  const handleApplyToProject = async (projectId: string, applicationData: any) => {
    try {
      const res = await fetch("/api/join-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          project_id: projectId,
          role_id: applicationData?.role_id ?? null,
          applicant_comment: applicationData?.message ?? null,
        }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(error);
      }
      setNotification({
        kind: "success",
        title: "Application submitted successfully",
        subtitle: "You will be notified when the project manager reviews your application.",
      });
      setShowApplyModal(false);
    } catch (err: any) {
      setNotification({ kind: "error", title: "Error submitting application", subtitle: err.message ?? String(err) });
    }
  };

  const handleProjectCreated = () => {
    fetchProjects();
    setShowCreateProjectModal(false);
    setNotification({ kind: "success", title: "Project created successfully" });
  };

  const handleTeamMembersAssigned = () => {
    setNotification({
      kind: "success",
      title: "Team members assigned successfully",
      subtitle: "Selected team members have been assigned to the project.",
    });
    fetchProjects(); // Refresh projects to show updated team
  };

  const handleViewProjects = (ambitionTitle: string) => {
    setAmbitionFilter(ambitionTitle);
    setActiveTab(1);
  };

  const handleViewLeaderProfile = async (leaderId: string) => {
    if (!leaderId) return;
    try {
      const { data, error } = await supabase
          .from("users")
          .select(
              "id, display_name, email, interests, experience, skills:user_skills ( skill:skills(name) ), products:user_products ( product:products(name) )"
          )
          .eq("id", leaderId)
          .single();
      if (error) throw error;
      setSelectedProfile(data);
      setShowProfileModal(true);
    } catch (err: any) {
      setNotification({ kind: "error", title: "Error loading profile", subtitle: err.message ?? String(err) });
    }
  };

  if ((loading && projectsLoading) || authLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
        <Loading withOverlay={false} />
      </div>
    );
  }

  const ambitionOptions = ambitions.map((amb) => ({ id: amb.title, label: amb.title }));
  const skillOptions = skills.map((s) => ({ id: s, label: s }));
  const sortOptions = [
   { id: 'newest', label: 'Newest First' },
    { id: 'oldest', label: 'Oldest First' },
    { id: 'deadline', label: 'By Deadline' }
  ];

  // TASK-1: Role-based visibility
  const pageTitle = isLeaderOrManager ? "Ambitions & Projects" : "Opportunities";
  const pageDescription = isLeaderOrManager
    ? "Explore strategic initiatives and find projects that align with IBM's goals."
    : "Browse available projects and apply to opportunities that match your skills and interests.";

  return (
      <>
        <Grid fullWidth>
          <Column lg={16} md={8} sm={4}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
              <div>
                <h2 style={{ fontSize: "32px", fontWeight: 600, color: "var(--cds-text-primary)", marginBottom: "8px" }}>
                  {pageTitle}
                </h2>
                <p style={{ color: "var(--cds-text-secondary)", fontSize: "16px" }}>
                  {pageDescription}
                </p>
                {selectedAmbition && (
                    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px" }}>
                      <Tag type="blue" size="sm">Filtered by: {selectedAmbition}</Tag>
                      <Button kind="ghost" size="sm" onClick={onClearFilter}>Clear Filter</Button>
                    </div>
                )}
              </div>

              <div style={{ display: "flex", gap: "12px" }}>
                {canCreate && (
                    <>
                      <Button kind="secondary" renderIcon={Add} onClick={() => setShowCreateModal(true)}>
                        Create Ambition
                      </Button>
                      <Button kind="primary" renderIcon={Add} onClick={() => setShowCreateProjectModal(true)}>
                        Create Project
                      </Button>
                    </>
                )}
              </div>
            </div>

            <Tabs selectedIndex={activeTab} onChange={(evt: any) => {
              console.log("🔄 [AmbitionsTab] Tab changed to:", evt.selectedIndex);
              setActiveTab(evt.selectedIndex);
            }}>
              <TabList aria-label="Ambitions and Projects">
                <Tab>{isLeaderOrManager ? "Strategic Ambitions" : "Opportunities"}</Tab>
                <Tab>{isLeaderOrManager ? "All Projects" : "Career Paths"}</Tab>
                {!isLeaderOrManager && <Tab>My Invitations {invitations.filter(i => i.status === "invited").length > 0 && `(${invitations.filter(i => i.status === "invited").length})`}</Tab>}
              </TabList>
              <TabPanels>
                <TabPanel>
                  {isLeaderOrManager ? (
                    <>
                      {/* Strategic Ambitions view for leaders/managers */}
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
                            <Column key={ambition.id} lg={5} md={4} sm={4} style={{ marginBottom: "24px" }}>
                              <ClickableTile
                                onClick={() => {
                                  setViewingAmbition(ambition);
                                  setShowViewAmbitionModal(true);
                                }}
                                style={{ height: "100%", display: "flex", flexDirection: "column", borderLeft: "4px solid var(--cds-interactive)" }}
                              >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                                  <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--cds-interactive)", marginBottom: "8px" }}>
                                      {ambition.title}
                                    </h3>
                                    <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)", lineHeight: "1.4" }}>
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
                                    <p style={{ fontSize: "14px", fontWeight: 500, color: "var(--cds-text-primary)", marginBottom: "8px" }}>
                                      Leader
                                    </p>
                                    <Tag
                                        size="sm"
                                        type="blue"
                                        style={{ cursor: ambition.leaderId ? "pointer" : "default" }}
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

                                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                {ambition.projectCount} project{ambition.projectCount !== 1 ? "s" : ""}
                              </span>
                                    <Button kind="primary" size="sm" renderIcon={View} onClick={(e) => { e.stopPropagation(); handleViewProjects(ambition.title); }}>
                                      View Projects
                                    </Button>
                                  </div>
                                </div>
                              </ClickableTile>
                            </Column>
                          ))}
                        </Grid>
                      )}
                    </>
                  ) : (
                    <>
                      {/* Projects view for interns */}
                     <div style={{ marginBottom: "24px" }}>
                       <p style={{ fontSize: "16px", color: "var(--cds-text-secondary)" }}>
                         Browse all projects across different ambitions. Use filters to find specific projects.
                       </p>
                     </div>
                     {/* Filters */}
                     <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", marginBottom: "32px" }}>
                       <div style={{ minWidth: "250px" }}>
                         <Search labelText="Search projects" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="md" />
                       </div>
                       <div style={{ minWidth: "200px" }}>
                         <ComboBox
                             id="ambition-filter"
                             items={ambitionOptions}
                             itemToString={(item) => item?.label || ''}
                             titleText="Filter by ambition"
                             placeholder="Filter by ambition"
                             selectedItem={ambitionOptions.find((o) => o.id === ambitionFilter)}
                             onChange={({ selectedItem }) => setAmbitionFilter(selectedItem?.id || "")}
                         />
                       </div>
                       <div style={{ minWidth: "200px" }}>
                         <MultiSelect
                             id="skills-filter"
                         items={skillOptions}
                         itemToString={(item) => item?.label || ''}
                         titleText="Filter by skills"
                         label="Filter by skills"
                         selectedItems={skillOptions.filter(opt => skillsFilter.includes(opt.id))}
                         onChange={({ selectedItems }) => setSkillsFilter(selectedItems.map(item => item.id))}
                         />
                       </div>
                       <div style={{ minWidth: "180px" }}>
                         <ComboBox
                             id="sort-filter"
                             items={sortOptions}
                             itemToString={(item) => item?.label || ''}
                             titleText="Sort by"
                             placeholder="Sort by"
                             selectedItem={sortOptions.find(opt => opt.id === sortBy)}
                             onChange={({ selectedItem }) => setSortBy(selectedItem?.id || 'newest')}
                         />
                       </div>
                     </div>

                     {projectsLoading ? (
                         <div style={{ height: "200px", backgroundColor: "#f1f1f1" }} />
                     ) : projects.length === 0 ? (
                         <div style={{ textAlign: "center", padding: "64px 0" }}>
                           <p style={{ color: "var(--cds-text-secondary)" }}>No projects found matching your criteria.</p>
                         </div>
                     ) : (
                         <Grid fullWidth>
 
                         {projects.map((project: any) => (
                             <Column key={project.id} lg={5} md={4} sm={4} style={{ marginBottom: "32px" }}>
                               <ClickableTile
                                   onClick={() => {
                                     setSelectedProject(project);
                                     setShowViewModal(true);
                                   }}
                                   style={{ height: "100%", display: "flex", flexDirection: "column", borderLeft: "4px solid var(--cds-interactive)" }}
                               >
                                 <div style={{ marginBottom: "16px" }}>
                                   <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--cds-interactive)", marginBottom: "8px" }}>{project.name}</h3>
                                   <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)", lineHeight: "1.4", marginBottom: "12px" }}>{project.description}</p>
                                   <div style={{ marginBottom: "12px" }}>
                                     <Tag type="blue" size="sm">{project.ambition_name || "No Ambition"}</Tag>
                                   </div>
                                 </div>

                                 {project.skills && project.skills.length > 0 && (
                                     <div style={{ marginBottom: "16px" }}>
                                       <p style={{ fontSize: "12px", fontWeight: 500, marginBottom: "8px", color: "var(--cds-text-primary)" }}>Required Skills:</p>
                                       <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                         {project.skills.slice(0, 3).map((skill: string, i: number) => (
                                             <Tag key={i} type="outline" size="sm">{skill}</Tag>
                                         ))}
                                         {project.skills.length > 3 && <Tag type="outline" size="sm">+{project.skills.length - 3} more</Tag>}
                                       </div>
                                     </div>
                                 )}

                                 <div style={{ marginTop: "auto" }}>
                                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                                     <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                       <User size={16} />
                                       <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>{project.pm_name || "No PM"}</span>
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
                                     {canCreate && (
                                         <Button
                                             kind="secondary"
                                             size="md"
                                             renderIcon={Email}
                                             onClick={(e) => {
                                               e.stopPropagation();
                                               setSelectedProject(project);
                                               setShowAssignModal(true);
                                             }}
                                             style={{ flex: 1, minHeight: "40px", fontWeight: 500 }}
                                         >
                                           Invite Candidates
                                         </Button>
                                     )}
                                     <Button
                                         kind="primary"
                                         size="md"
                                         renderIcon={UserFollow}
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           setSelectedProject(project);
                                           setShowApplyModal(true);
                                         }}
                                         style={{ flex: 1, minHeight: "40px", fontWeight: 500 }}
                                     >
                                       I'm Interested
                                     </Button>
                                   </div>
                                 </div>
                               </ClickableTile>
                             </Column>
                         ))}
                         </Grid>
                     )}
                    </>
                  )}
                </TabPanel>

                <TabPanel>
                  {isLeaderOrManager ? (
                    <>
                      {/* All Projects tab for leaders/managers */}
                     <div style={{ marginBottom: "24px" }}>
                       <p style={{ fontSize: "16px", color: "var(--cds-text-secondary)" }}>
                         Browse available projects and apply to opportunities that match your skills and interests.
                       </p>
                     </div>

                     {/* Filters */}
                     <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", marginBottom: "32px" }}>
                       <div style={{ minWidth: "250px" }}>
                         <Search labelText="Search projects" placeholder="Search projects..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} size="md" />
                       </div>
                       <div style={{ minWidth: "200px" }}>
                         <ComboBox
                             id="ambition-filter-intern"
                             items={ambitionOptions}
                             itemToString={(item) => item?.label || ''}
                             titleText="Filter by career path"
                             placeholder="Filter by career path"
                             selectedItem={ambitionOptions.find((o) => o.id === ambitionFilter)}
                             onChange={({ selectedItem }) => setAmbitionFilter(selectedItem?.id || "")}
                         />
                       </div>
                       <div style={{ minWidth: "200px" }}>
                         <MultiSelect
                             id="skills-filter-intern"
                         items={skillOptions}
                         itemToString={(item) => item?.label || ''}
                         titleText="Filter by skills"
                         label="Filter by skills"
                         selectedItems={skillOptions.filter(opt => skillsFilter.includes(opt.id))}
                         onChange={({ selectedItems }) => setSkillsFilter(selectedItems.map(item => item.id))}
                         />
                       </div>
                       <div style={{ minWidth: "180px" }}>
                         <ComboBox
                             id="sort-filter-intern"
                             items={sortOptions}
                             itemToString={(item) => item?.label || ''}
                             titleText="Sort by"
                             placeholder="Sort by"
                             selectedItem={sortOptions.find(opt => opt.id === sortBy)}
                             onChange={({ selectedItem }) => setSortBy(selectedItem?.id || 'newest')}
                         />
                       </div>
                     </div>

                     {projectsLoading ? (
                       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                         <Loading withOverlay={false} />
                       </div>
                     ) : projects.length === 0 ? (
                         <div style={{ textAlign: "center", padding: "64px 0" }}>
                           <p style={{ color: "var(--cds-text-secondary)" }}>No projects found matching your criteria.</p>
                         </div>
                     ) : (
                         <Grid fullWidth>
                         {projects.map((project: any) => (
                             <Column key={project.id} lg={5} md={4} sm={4} style={{ marginBottom: "32px" }}>
                               <ClickableTile
                                   onClick={() => {
                                     setSelectedProject(project);
                                     setShowViewModal(true);
                                   }}
                                   style={{ height: "100%", display: "flex", flexDirection: "column", borderLeft: "4px solid var(--cds-interactive)" }}
                               >
                                 <div style={{ marginBottom: "16px" }}>
                                   <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--cds-interactive)", marginBottom: "8px" }}>{project.name}</h3>
                                   <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)", lineHeight: "1.4", marginBottom: "12px" }}>{project.description}</p>
                                   <div style={{ marginBottom: "12px" }}>
                                     <Tag type="blue" size="sm">{project.ambition_name || "No Career Path"}</Tag>
                                   </div>
                                 </div>

                                 {project.skills && project.skills.length > 0 && (
                                     <div style={{ marginBottom: "16px" }}>
                                       <p style={{ fontSize: "12px", fontWeight: 500, marginBottom: "8px", color: "var(--cds-text-primary)" }}>Required Skills:</p>
                                       <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                         {project.skills.slice(0, 3).map((skill: string, i: number) => (
                                             <Tag key={i} type="outline" size="sm">{skill}</Tag>
                                         ))}
                                         {project.skills.length > 3 && <Tag type="outline" size="sm">+{project.skills.length - 3} more</Tag>}
                                       </div>
                                     </div>
                                 )}

                                 <div style={{ marginTop: "auto" }}>
                                   <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "8px" }}>
                                     <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                       <User size={16} />
                                       <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>{project.pm_name || "No PM"}</span>
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

                                   <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", paddingTop: "12px", borderTop: "1px solid var(--cds-border-subtle)" }}>
                                     <Button
                                         kind="ghost"
                                         size="sm"
                                         renderIcon={UserFollow}
                                         onClick={(e) => {
                                           e.stopPropagation();
                                           setSelectedProject(project);
                                           setShowAssignModal(true);
                                         }}
                                     >
                                       Assign Team
                                     </Button>
                                   </div>
                                 </div>
                               </ClickableTile>
                             </Column>
                         ))}
                         </Grid>
                     )}
                   </>
                 ) : (
                   <>
                     {/* Career Paths view for interns */}
                     {careerPathsLoading ? (
                       <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                         <Loading withOverlay={false} />
                       </div>
                     ) : careerPaths.length === 0 ? (
                       <Grid fullWidth>
                         <Column lg={{ span: 12, offset: 2 }} md={8} sm={4}>
                           <div style={{ textAlign: "center", padding: "48px 0" }}>
                             <Rocket size={48} style={{ marginBottom: "24px", color: "var(--cds-icon-primary)" }} />
                             <h3 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "16px" }}>
                               Get Started with Your IBM Journey
                             </h3>
                             <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "32px" }}>
                               Career paths help match you with exciting projects. While we're setting up career paths, here's how to begin:
                             </p>
                           </div>

                           <Grid fullWidth style={{ marginBottom: "32px" }}>
                             <Column lg={4} md={8} sm={4}>
                               <ClickableTile style={{ height: "100%", minHeight: "180px" }}>
                                 <UserAvatar size={32} style={{ marginBottom: "16px", color: "var(--cds-icon-primary)" }} />
                                 <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                                   1. Complete Your Profile
                                 </h4>
                                 <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                   Add your skills, interests, and availability to help leaders find you
                                 </p>
                               </ClickableTile>
                             </Column>

                             <Column lg={4} md={8} sm={4}>
                               <ClickableTile style={{ height: "100%", minHeight: "180px" }}>
                                 <Email size={32} style={{ marginBottom: "16px", color: "var(--cds-icon-primary)" }} />
                                 <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                                   2. Check Invitations
                                 </h4>
                                 <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                   Leaders will send you invitations for projects that match your profile
                                 </p>
                               </ClickableTile>
                             </Column>

                             <Column lg={4} md={8} sm={4}>
                               <ClickableTile style={{ height: "100%", minHeight: "180px" }}>
                                 <CheckmarkOutline size={32} style={{ marginBottom: "16px", color: "var(--cds-icon-primary)" }} />
                                 <h4 style={{ fontSize: "18px", fontWeight: 600, marginBottom: "8px" }}>
                                   3. Join Projects
                                 </h4>
                                 <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                   Accept invitations and start contributing to meaningful work
                                 </p>
                               </ClickableTile>
                             </Column>
                           </Grid>

                           <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                             <Button
                               kind="primary"
                               size="lg"
                               renderIcon={UserAvatar}
                               onClick={() => navigate("/your-projects")}
                             >
                               Complete Your Profile
                             </Button>
                             <Button
                               kind="secondary"
                               size="lg"
                               renderIcon={Email}
                               onClick={() => setActiveTab(2)}
                             >
                               View My Invitations
                             </Button>
                           </div>
                         </Column>
                       </Grid>
                     ) : (
                       <>
                         <div style={{ marginBottom: "24px" }}>
                           <p style={{ fontSize: "16px", color: "var(--cds-text-secondary)" }}>
                             Select up to 3 career paths that interest you. This helps us match you with relevant projects.
                           </p>
                         </div>
                         {userPreferences.length > 0 && (
                           <div style={{ marginBottom: "24px", padding: "16px", backgroundColor: "var(--cds-layer-01)", borderRadius: "4px" }}>
                             <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)", marginBottom: "8px" }}>
                               <strong>Your Selected Career Paths ({userPreferences.length}/3):</strong>
                             </p>
                             <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                               {userPreferences
                                 .sort((a, b) => a.rank - b.rank)
                                 .map((pref) => {
                                   const path = careerPaths.find(p => p.id === pref.path_id);
                                   return path ? (
                                     <Tag key={pref.id} type="blue" size="md">
                                       #{pref.rank} {path.name}
                                     </Tag>
                                   ) : null;
                                 })}
                             </div>
                           </div>
                         )}
                         <Grid fullWidth>
                           {careerPaths.map((path: any) => {
                             const isSelected = userPreferences.some(p => p.path_id === path.id);
                             const userPref = userPreferences.find(p => p.path_id === path.id);
                             return (
                               <Column key={path.id} lg={5} md={4} sm={4} style={{ marginBottom: "24px" }}>
                                 <ClickableTile
                                   style={{
                                     height: "100%",
                                     display: "flex",
                                     flexDirection: "column",
                                     borderLeft: isSelected ? "4px solid var(--cds-support-success)" : "4px solid var(--cds-interactive)",
                                     backgroundColor: isSelected ? "var(--cds-layer-accent-01)" : "var(--cds-layer-01)"
                                   }}
                                 >
                                   <div style={{ marginBottom: "16px" }}>
                                     <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                       <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--cds-text-primary)" }}>
                                         {path.name}
                                       </h3>
                                       {isSelected && userPref && (
                                         <Tag type="green" size="sm">Rank #{userPref.rank}</Tag>
                                       )}
                                     </div>
                                     <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)", lineHeight: "1.4" }}>
                                       {path.description}
                                     </p>
                                   </div>

                                   <div style={{ marginTop: "auto" }}>
                                     <Button
                                       kind={isSelected ? "secondary" : "primary"}
                                       size="md"
                                       renderIcon={isSelected ? FavoriteFilled : Favorite}
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         handleCareerPathInterest(path.id);
                                       }}
                                       style={{ width: "100%", minHeight: "40px", fontWeight: 500 }}
                                     >
                                       {isSelected ? "Remove Interest" : "I'm Interested"}
                                     </Button>
                                   </div>
                                 </ClickableTile>
                               </Column>
                             );
                           })}
                         </Grid>
                       </>
                     )}
                    </>
                  )}
                </TabPanel>

                {/* Tab 2 - Only for interns (My Invitations) */}
                {!isLeaderOrManager && (
                  <TabPanel>
                  {invitationsLoading ? (
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                      <Loading withOverlay={false} />
                    </div>
                  ) : invitations.length === 0 ? (
                    <Grid fullWidth>
                      <Column lg={{ span: 12, offset: 2 }} md={8} sm={4}>
                        <div style={{ textAlign: "center", padding: "48px 0" }}>
                          <Email size={48} style={{ marginBottom: "24px", color: "var(--cds-icon-primary)" }} />
                          <h3 style={{ fontSize: "28px", fontWeight: 600, marginBottom: "16px" }}>
                            No Invitations Yet
                          </h3>
                          <p style={{ fontSize: "16px", lineHeight: "1.6", marginBottom: "32px" }}>
                            Project leaders will invite you to opportunities that match your skills and interests.
                          </p>
                        </div>

                        <Grid fullWidth style={{ marginBottom: "32px" }}>
                          <Column lg={4} md={8} sm={4}>
                            <ClickableTile
                              onClick={() => navigate("/your-projects")}
                              style={{ height: "100%", minHeight: "160px" }}
                            >
                              <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "var(--cds-layer-accent-01)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "16px"
                              }}>
                                <span style={{ fontSize: "18px", fontWeight: 600 }}>1</span>
                              </div>
                              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                                Complete your profile
                              </h4>
                              <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                Add skills and interests
                              </p>
                            </ClickableTile>
                          </Column>

                          <Column lg={4} md={8} sm={4}>
                            <ClickableTile
                              onClick={() => setActiveTab(0)}
                              style={{ height: "100%", minHeight: "160px" }}
                            >
                              <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "var(--cds-layer-accent-01)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "16px"
                              }}>
                                <span style={{ fontSize: "18px", fontWeight: 600 }}>2</span>
                              </div>
                              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                                Select career paths
                              </h4>
                              <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                Express your interests
                              </p>
                            </ClickableTile>
                          </Column>

                          <Column lg={4} md={8} sm={4}>
                            <ClickableTile style={{ height: "100%", minHeight: "160px" }}>
                              <div style={{
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                backgroundColor: "var(--cds-layer-accent-01)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginBottom: "16px"
                              }}>
                                <span style={{ fontSize: "18px", fontWeight: 600 }}>3</span>
                              </div>
                              <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                                Get invited
                              </h4>
                              <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                Leaders will find you
                              </p>
                            </ClickableTile>
                          </Column>
                        </Grid>

                        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                          <Button
                            kind="primary"
                            size="lg"
                            renderIcon={UserAvatar}
                            onClick={() => navigate("/your-projects")}
                          >
                            Set Up Your Profile
                          </Button>
                          <Button
                            kind="secondary"
                            size="lg"
                            renderIcon={Favorite}
                            onClick={() => setActiveTab(0)}
                          >
                            Explore Career Paths
                          </Button>
                        </div>
                      </Column>
                    </Grid>
                  ) : (
                    <Grid fullWidth>
                      {invitations.map((invitation: any) => {
                        const project = invitation.project;
                        const isPending = invitation.status === "invited";
                        const isAccepted = invitation.status === "accepted";
                        const isDeclined = invitation.status === "declined";
                        
                        return (
                          <Column key={invitation.id} lg={5} md={4} sm={4} style={{ marginBottom: "24px" }}>
                            <ClickableTile
                              style={{
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                borderLeft: isPending ? "4px solid var(--cds-support-warning)" :
                                           isAccepted ? "4px solid var(--cds-support-success)" :
                                           "4px solid var(--cds-text-secondary)",
                                opacity: isDeclined ? 0.6 : 1
                              }}
                            >
                              <div style={{ marginBottom: "16px" }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                  <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--cds-text-primary)" }}>
                                    {project?.name || "Unknown Project"}
                                  </h3>
                                  <Tag
                                    type={isPending ? "warm-gray" : isAccepted ? "green" : "gray"}
                                    size="sm"
                                  >
                                    {isPending ? "Pending" : isAccepted ? "Accepted" : "Declined"}
                                  </Tag>
                                </div>
                                <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)", lineHeight: "1.4", marginBottom: "12px" }}>
                                  {project?.description || "No description available"}
                                </p>
                                
                                {project?.ambition && (
                                  <div style={{ marginBottom: "8px" }}>
                                    <Tag type="blue" size="sm">{project.ambition.name}</Tag>
                                  </div>
                                )}

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "12px", color: "var(--cds-text-secondary)", marginTop: "12px" }}>
                                  {project?.pm && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                      <User size={16} />
                                      <span>{project.pm.display_name}</span>
                                    </div>
                                  )}
                                  {project?.deadline && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                      <Calendar size={16} />
                                      <span>{new Date(project.deadline).toLocaleDateString()}</span>
                                    </div>
                                  )}
                                  {project?.hours_per_week && (
                                    <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                                      <Time size={16} />
                                      <span>{project.hours_per_week}h/week</span>
                                    </div>
                                  )}
                                </div>

                                <div style={{ marginTop: "12px", fontSize: "12px", color: "var(--cds-text-secondary)" }}>
                                  <p>Invited: {new Date(invitation.created_at).toLocaleDateString()}</p>
                                  {invitation.expires_at && isPending && (
                                    <p style={{ color: "var(--cds-support-warning)" }}>
                                      Expires: {new Date(invitation.expires_at).toLocaleDateString()}
                                    </p>
                                  )}
                                  {invitation.responded_at && (
                                    <p>Responded: {new Date(invitation.responded_at).toLocaleDateString()}</p>
                                  )}
                                </div>
                              </div>

                              {isPending && (
                                <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
                                  <Button
                                    kind="primary"
                                    size="md"
                                    renderIcon={Checkmark}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInvitationResponse(invitation.id, "accepted");
                                    }}
                                    style={{ flex: 1, minHeight: "40px", fontWeight: 500 }}
                                  >
                                    Accept
                                  </Button>
                                  <Button
                                    kind="secondary"
                                    size="md"
                                    renderIcon={Close}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleInvitationResponse(invitation.id, "declined");
                                    }}
                                    style={{ flex: 1, minHeight: "40px", fontWeight: 500 }}
                                  >
                                    Decline
                                  </Button>
                                </div>
                              )}
                            </ClickableTile>
                          </Column>
                        );
                      })}
                    </Grid>
                    )}
                  </TabPanel>
                )}
              </TabPanels>
            </Tabs>
          </Column>
        </Grid>

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
          <p>Are you sure you want to delete the ambition "{ambitionToDelete?.title}"? This action cannot be undone.</p>
        </Modal>

        {/* Notification */}
        {notification && (
            <ToastNotification
                kind={notification.kind}
                title={notification.title}
                subtitle={notification.subtitle}
                onClose={() => setNotification(null)}
                timeout={5000}
            />
        )}

        <CreateAmbitionModal open={showCreateModal} onOpenChange={setShowCreateModal} onAmbitionCreated={handleAmbitionCreated} />
        <CreateProjectModal open={showCreateProjectModal} onOpenChange={setShowCreateProjectModal} onProjectCreated={handleProjectCreated} />
        <ApplyProjectModal open={showApplyModal} onOpenChange={setShowApplyModal} project={selectedProject} onSubmit={handleApplyToProject} />
        <ViewProjectModal
          open={showViewModal}
          onOpenChange={setShowViewModal}
          project={selectedProject}
          onUpdate={() => {
            fetchProjects();
          }}
        />
        <AssignTeamMembersModal open={showAssignModal} onOpenChange={setShowAssignModal} project={selectedProject} onTeamMembersAssigned={handleTeamMembersAssigned} />
        <ApplicantProfileModal open={showProfileModal} onOpenChange={setShowProfileModal} profileData={selectedProfile} />
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
