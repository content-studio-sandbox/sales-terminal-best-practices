import { useState, useEffect } from "react";
import {
    Grid,
    Column,
    Button,
    ClickableTile,
    Tag,
    Modal,
    ToastNotification,
    Loading,
    Search,
    ComboBox,
    MultiSelect,
    Tile,
    ProgressBar,
    Accordion,
    AccordionItem,
} from "@carbon/react";
import {
    Edit,
    TrashCan,
    Calendar,
    User,
    Rocket,
    UserAvatar,
    Email,
    Checkmark,
    Star,
    StarFilled,
    View,
    UserFollow,
    ChevronDown,
    ChevronUp,
    Add,
} from "@carbon/icons-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import EditProjectModal from "./EditProjectModal";
import ViewProjectModal from "../ViewProjectModal";
import ApplicantProfileModal from "./ApplicantProfileModal";
import InternProjectBoard from "./InternProjectBoard";
import CreateProjectModal from "./CreateProjectModal";

interface YourProjectsTabProps {
    user: { id?: string; access_role?: string } | null;
    authLoading?: boolean;
}

const isUUID = (s?: string) =>
    !!s &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
        s
    );

/** 
 * NOTE: YourProjectsTab handles "Talent Pool" for leader view and "My Projects" for intern view.
**/
export default function YourProjectsTab({ user, authLoading = false }: YourProjectsTabProps) {
    const navigate = useNavigate();
    
    // Role detection
    const accessRole = (user?.access_role || "").toLowerCase();
    const isLeaderOrManager = accessRole === "manager" || accessRole === "leader";
    
    // Intern/Individual view state
    const [managedProjects, setManagedProjects] = useState<any[]>([]);
    const [contributingProjects, setContributingProjects] = useState<any[]>([]);
    const [myApplications, setMyApplications] = useState<any[]>([]);
    const [expandedProjects, setExpandedProjects] = useState<Set<string>>(new Set());
    
    // Auto-expand all projects for interns on first load
    useEffect(() => {
        if (contributingProjects.length > 0 && expandedProjects.size === 0) {
            const allProjectIds = new Set(contributingProjects.map(p => p.id));
            setExpandedProjects(allProjectIds);
        }
    }, [contributingProjects]);
    
    // Leadership Talent Pool state
    const [candidates, setCandidates] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
    const [careerPathFilter, setCareerPathFilter] = useState("");
    const [allSkills, setAllSkills] = useState<string[]>([]);
    const [careerPaths, setCareerPaths] = useState<any[]>([]);
    
    const [loading, setLoading] = useState(true);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<any>(null);
    const [notification, setNotification] = useState<any>(null);

    // Fetch Talent Pool for leaders
    const fetchTalentPool = async () => {
        try {
            setLoading(true);
            
            console.log("🔍 [TalentPool] Fetching all users...");
            
            // Fetch all users with their skills and career path preferences
            // Don't filter by access_role - show everyone except the current user
            const { data: users, error: usersError } = await supabase
                .from("users")
                .select(`
                    id,
                    display_name,
                    email,
                    interests,
                    experience,
                    access_role,
                    user_skills!user_skills_user_id_fkey (
                        skill:skills (name)
                    ),
                    user_path_preferences!user_path_preferences_user_id_fkey (
                        rank,
                        path:career_paths (name)
                    )
                `)
                .neq("id", user?.id || "");
            
            if (usersError) {
                console.error("❌ [TalentPool] Error fetching users:", usersError);
                throw usersError;
            }
            
            console.log("✅ [TalentPool] Fetched users:", users?.length || 0);
            
            // Transform data for display
            const transformed = (users || []).map((u: any) => ({
                ...u,
                skills: u.user_skills?.map((us: any) => us.skill?.name).filter(Boolean) || [],
                careerPaths: u.user_path_preferences
                    ?.sort((a: any, b: any) => a.rank - b.rank)
                    .map((p: any) => p.path?.name)
                    .filter(Boolean) || [],
            }));
            
            console.log("📊 [TalentPool] Transformed candidates:", transformed.length);
            console.log("📋 [TalentPool] Sample candidate:", transformed[0]);
            
            setCandidates(transformed);
            
            // Fetch all skills for filter
            const { data: skillsData } = await supabase.from("skills").select("name");
            setAllSkills(skillsData?.map((s: any) => s.name) || []);
            
            // Fetch career paths for filter
            const { data: pathsData } = await supabase.from("career_paths" as any).select("*");
            setCareerPaths(pathsData || []);
            
        } catch (error: any) {
            console.error("Error fetching talent pool:", error);
            setNotification({
                kind: "error",
                title: "Error loading talent pool",
                subtitle: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    // Fetch projects for interns/individuals
    const fetchProjects = async () => {
        console.log('🔍 [YourProjectsTab] fetchProjects called with user:', user);
        
        // If user is not loaded yet, don't set loading to false - wait for auth
        if (!isUUID(user?.id)) {
            console.log('❌ [YourProjectsTab] Invalid user ID:', user?.id);
            setManagedProjects([]);
            setContributingProjects([]);
            setMyApplications([]);
            // Don't set loading to false here - let authLoading control it
            return;
        }

        try {
            setLoading(true);
            console.log('✅ [YourProjectsTab] Valid user ID:', user!.id);

            // Projects you manage
            const { data: managed, error: managedError } = await supabase
                .from("projects")
                .select("*")
                .eq("pm_id", user!.id);
            if (managedError) throw managedError;
            console.log('📊 [YourProjectsTab] Managed projects:', managed?.length || 0);

            // Projects you contribute to (actual membership)
            const { data: contributing, error: contributingError } = await supabase
                .from("project_staff")
                .select(
                    `
          *,
          project:projects (
            id,
            name,
            description,
            status,
            deadline,
            ambition:ambitions(name),
            project_manager:users!pm_id(display_name)
          )
        `
                )
                .eq("user_id", user!.id);
            if (contributingError) {
                console.error('❌ [YourProjectsTab] Error fetching contributing projects:', contributingError);
                throw contributingError;
            }
            console.log('📊 [YourProjectsTab] Contributing projects raw:', contributing);

            // Applications you submitted (pending/approved/declined)
            const { data: apps, error: appsErr } = await supabase
                .from("project_join_requests")
                .select(
                    `
          id,
          status,
          created_at,
          role_id,
          roles(name),
          project:projects (
            id,
            name,
            description,
            status,
            deadline,
            ambition:ambitions(name),
            project_manager:users!pm_id(display_name)
          )
        `
                )
                .eq("user_id", user!.id)
                .order("created_at", { ascending: false });
            if (appsErr) throw appsErr;

            setManagedProjects(managed || []);
            setContributingProjects(
                (contributing || []).map((p: any) => p.project).filter(Boolean)
            );
            setMyApplications(apps || []);
        } catch (error: any) {
            console.error("Error fetching projects:", error);
            setNotification({
                kind: "error",
                title: "Error loading projects",
                subtitle: error.message,
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isLeaderOrManager) {
            fetchTalentPool();
        } else {
            fetchProjects();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.id, isLeaderOrManager]);

    const handleDeleteProject = async (projectId: string) => {
        try {
            const { error } = await supabase.from("projects").delete().eq("id", projectId);
            if (error) throw error;

            setNotification({
                kind: "success",
                title: "Project deleted successfully",
            });

            fetchProjects();
        } catch (error: any) {
            setNotification({
                kind: "error",
                title: "Error deleting project",
                subtitle: error.message,
            });
        } finally {
            setShowDeleteModal(false);
            setProjectToDelete(null);
        }
    };

    const handleProjectUpdated = () => {
        fetchProjects();
        setShowEditModal(false);
        setNotification({
            kind: "success",
            title: "Project updated successfully",
        });
    };

    const handleProjectCreated = () => {
        if (isLeaderOrManager) {
            fetchTalentPool();
        } else {
            fetchProjects();
        }
        setShowCreateProjectModal(false);
        setNotification({
            kind: "success",
            title: "Project created successfully",
        });
    };

    const getStatusColor = (status?: string) => {
        switch ((status || "").toLowerCase()) {
            case "complete":
                return "green";
            case "in progress":
                return "blue";
            case "not started":
                return "gray";
            default:
                return "gray";
        }
    };

    const formatStatus = (status?: string) => {
        switch ((status || "").toLowerCase()) {
            case "not started":
                return "Not Started";
            case "in progress":
                return "In Progress";
            case "complete":
                return "Complete";
            default:
                return status || "Unknown";
        }
    };

    const statusTagType = (s?: string) => {
        switch ((s || "").toLowerCase()) {
            case "approved":
                return "green";
            case "declined":
                return "red";
            case "pending":
                return "blue";
            default:
                return "gray";
        }
    };
    
    // Filter candidates for Talent Pool
    const filteredCandidates = candidates.filter((candidate) => {
        if (searchTerm) {
            const search = searchTerm.toLowerCase();
            const matchesName = candidate.display_name?.toLowerCase().includes(search);
            const matchesEmail = candidate.email?.toLowerCase().includes(search);
            const matchesInterests = candidate.interests?.toLowerCase().includes(search);
            if (!matchesName && !matchesEmail && !matchesInterests) return false;
        }
        
        if (skillsFilter.length > 0) {
            const hasSkill = skillsFilter.some(skill =>
                candidate.skills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
            );
            if (!hasSkill) return false;
        }
        
        
        
        if (careerPathFilter) {
            const hasPath = candidate.careerPaths.some((p: string) =>
                p.toLowerCase().includes(careerPathFilter.toLowerCase())
            );
            if (!hasPath) return false;
        }
        
        return true;
    });

    // Show loading state if auth is loading OR if we're fetching projects
    if (authLoading || loading) {
        return (
            <Grid fullWidth>
                <Column lg={16} md={8} sm={4}>
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
                        <Loading withOverlay={false} />
                    </div>
                </Column>
            </Grid>
        );
    }
    
    // Leadership Talent Pool View
    if (isLeaderOrManager) {
        const skillOptions = allSkills.map(s => ({ id: s, label: s }));
        const careerPathOptions = careerPaths.map(p => ({ id: p.name, label: p.name }));
        
        return (
            <>
                <Grid fullWidth>
                    <Column lg={16} md={8} sm={4}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
                            <div>
                                <h2 style={{ fontSize: "32px", fontWeight: "600", color: "var(--cds-text-primary)", marginBottom: "8px" }}>
                                    Talent Pool
                                </h2>
                                <p style={{ color: "var(--cds-text-secondary)", fontSize: "16px" }}>
                                    Discover and connect with talented individuals across IBM. View profiles, skills, and availability to build your project teams.
                                </p>
                            </div>
                            <Button
                                kind="primary"
                                renderIcon={Add}
                                onClick={() => setShowCreateProjectModal(true)}
                            >
                                Create Project
                            </Button>
                        </div>
                        
                        {/* Filters */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "flex-end", marginBottom: "32px" }}>
                            <div style={{ minWidth: "250px" }}>
                                <Search
                                    labelText="Search candidates"
                                    placeholder="Search by name, email, or interests..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    size="md"
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
                            
                            <div style={{ minWidth: "200px" }}>
                                <ComboBox
                                    id="career-path-filter"
                                    items={careerPathOptions}
                                    itemToString={(item) => item?.label || ''}
                                    titleText="Career path"
                                    placeholder="All paths"
                                    selectedItem={careerPathOptions.find(o => o.id === careerPathFilter)}
                                    onChange={({ selectedItem }) => setCareerPathFilter(selectedItem?.id || "")}
                                />
                            </div>
                        </div>
                        
                        {/* Results count */}
                        <div style={{ marginBottom: "24px" }}>
                            <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                Showing {filteredCandidates.length} of {candidates.length} candidates
                            </p>
                        </div>
                        
                        {/* Candidate Cards */}
                        {filteredCandidates.length === 0 ? (
                            <div style={{ textAlign: "center", padding: "64px 0" }}>
                                <UserAvatar size={48} style={{ marginBottom: "16px", color: "var(--cds-icon-primary)" }} />
                                <p style={{ color: "var(--cds-text-secondary)", fontSize: "16px" }}>
                                    No candidates match your filters. Try adjusting your search criteria.
                                </p>
                            </div>
                        ) : (
                            <Grid fullWidth>
                                {filteredCandidates.map((candidate: any) => (
                                    <Column key={candidate.id} lg={5} md={4} sm={4} style={{ marginBottom: "24px" }}>
                                        <ClickableTile
                                            onClick={() => {
                                                setSelectedCandidate(candidate);
                                                setShowProfileModal(true);
                                            }}
                                            style={{
                                                height: "100%",
                                                display: "flex",
                                                flexDirection: "column",
                                                borderLeft: "4px solid var(--cds-interactive)",
                                            }}
                                        >
                                            <div style={{ marginBottom: "16px" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                                                    <UserAvatar size={32} />
                                                    <div style={{ flex: 1 }}>
                                                        <h3 style={{ fontSize: "18px", fontWeight: "600", color: "var(--cds-text-primary)", marginBottom: "4px" }}>
                                                            {candidate.display_name || "Unknown"}
                                                        </h3>
                                                        <p style={{ fontSize: "12px", color: "var(--cds-text-secondary)" }}>
                                                            {candidate.email}
                                                        </p>
                                                    </div>
                                                </div>
                                                
                                                {candidate.interests && typeof candidate.interests === 'string' && (
                                                    <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)", lineHeight: "1.4", marginBottom: "12px" }}>
                                                        {candidate.interests.substring(0, 100)}{candidate.interests.length > 100 ? "..." : ""}
                                                    </p>
                                                )}
                                                
                                                {candidate.skills.length > 0 && (
                                                    <div style={{ marginBottom: "12px" }}>
                                                        <p style={{ fontSize: "12px", fontWeight: "500", marginBottom: "8px", color: "var(--cds-text-primary)" }}>
                                                            Skills:
                                                        </p>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                                            {candidate.skills.slice(0, 3).map((skill: string, i: number) => (
                                                                <Tag key={i} type="blue" size="sm">{skill}</Tag>
                                                            ))}
                                                            {candidate.skills.length > 3 && (
                                                                <Tag type="outline" size="sm">+{candidate.skills.length - 3} more</Tag>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                                
                                                {candidate.careerPaths.length > 0 && (
                                                    <div style={{ marginBottom: "12px" }}>
                                                        <p style={{ fontSize: "12px", fontWeight: "500", marginBottom: "8px", color: "var(--cds-text-primary)" }}>
                                                            Career Interests:
                                                        </p>
                                                        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                                            {candidate.careerPaths.slice(0, 2).map((path: string, i: number) => (
                                                                <Tag key={i} type="purple" size="sm">#{i + 1} {path}</Tag>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div style={{ marginTop: "auto" }}>
                                                {candidate.experience && (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                                                        <User size={16} />
                                                        <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                                                            {candidate.experience}
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                <Button
                                                    kind="primary"
                                                    size="md"
                                                    renderIcon={View}
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedCandidate(candidate);
                                                        setShowProfileModal(true);
                                                    }}
                                                    style={{ width: "100%", minHeight: "40px", fontWeight: 500 }}
                                                >
                                                    View Profile
                                                </Button>
                                            </div>
                                        </ClickableTile>
                                    </Column>
                                ))}
                            </Grid>
                        )}
                    </Column>
                </Grid>
                
                {/* Profile Modal */}
                <ApplicantProfileModal
                    open={showProfileModal}
                    onOpenChange={setShowProfileModal}
                    profileData={selectedCandidate}
                />
                
                {/* Create Project Modal */}
                <CreateProjectModal
                    open={showCreateProjectModal}
                    onOpenChange={setShowCreateProjectModal}
                    onProjectCreated={handleProjectCreated}
                />
                
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
            </>
        );
    }

    const toggleProjectExpansion = (projectId: string) => {
        setExpandedProjects(prev => {
            const newSet = new Set(prev);
            if (newSet.has(projectId)) {
                newSet.delete(projectId);
            } else {
                newSet.add(projectId);
            }
            return newSet;
        });
    };

    const ProjectCard = ({ project, isManaged = false, showBoard = false }: any) => {
        const isExpanded = expandedProjects.has(project.id);
        
        return (
            <div style={{ marginBottom: "24px" }}>
                <ClickableTile
                    onClick={() => {
                        if (showBoard) {
                            toggleProjectExpansion(project.id);
                        } else {
                            setSelectedProject(project);
                            setShowViewModal(true);
                        }
                    }}
                    style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        borderLeft: `4px solid var(--cds-support-${getStatusColor(project.status)})`,
                    }}
                >
            <div style={{ marginBottom: "16px" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        marginBottom: "8px",
                    }}
                >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
                        {showBoard && (
                            isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />
                        )}
                        <h3
                            style={{
                                fontSize: "18px",
                                fontWeight: "600",
                                color: "var(--cds-interactive)",
                                flex: 1,
                            }}
                        >
                            {project.name}
                        </h3>
                    </div>
                    <Tag type={getStatusColor(project.status) as any} size="sm">
                        {formatStatus(project.status)}
                    </Tag>
                </div>

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
            </div>

            <div style={{ marginTop: "auto" }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "12px",
                    }}
                >
                    {project.deadline && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <Calendar size={16} />
                            <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                Due: {new Date(project.deadline).toLocaleDateString()}
              </span>
                        </div>
                    )}

                    {!isManaged && project.project_manager && (
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <User size={16} />
                            <span style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                {project.project_manager.display_name}
              </span>
                        </div>
                    )}
                </div>

                {isManaged && (
                    <div style={{ display: "flex", gap: "8px" }}>
                        <Button
                            kind="tertiary"
                            size="sm"
                            renderIcon={Edit}
                            onClick={(e: any) => {
                                e.stopPropagation();
                                setSelectedProject(project);
                                setShowEditModal(true);
                            }}
                            aria-label={`Edit project ${project.name}`}
                            style={{ flex: 1 }}
                        >
                            Edit
                        </Button>
                        <Button
                            kind="danger"
                            size="sm"
                            renderIcon={TrashCan}
                            onClick={(e: any) => {
                                e.stopPropagation();
                                setProjectToDelete(project);
                                setShowDeleteModal(true);
                            }}
                            aria-label={`Delete project ${project.name}`}
                            style={{ flex: 1 }}
                        >
                            Delete
                        </Button>
                    </div>
                )}
            </div>
        </ClickableTile>
        
        {/* Expandable InternProjectBoard for contributing projects */}
        {showBoard && isExpanded && user?.id && (
            <div style={{
                marginTop: "16px",
                padding: "24px",
                backgroundColor: "var(--cds-layer-01)",
                borderRadius: "4px",
                border: "1px solid var(--cds-border-subtle-01)"
            }}>
                <InternProjectBoard projectId={project.id} userId={user.id} />
            </div>
        )}
    </div>
    );
    };

    const ApplicationCard = ({ app }: any) => {
        const project = app.project;
        return (
            <ClickableTile
                onClick={() => {
                    if (project) {
                        setSelectedProject(project);
                        setShowViewModal(true);
                    }
                }}
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    borderLeft: `4px solid var(--cds-support-${statusTagType(app.status)})`,
                }}
            >
                <div style={{ marginBottom: 12 }}>
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "flex-start",
                        }}
                    >
                        <h4 style={{ fontSize: 16, fontWeight: 600 }}>
                            {project?.name ?? "Project"}
                        </h4>
                        <Tag type={statusTagType(app.status) as any} size="sm">
                            {(app.status || "pending").toUpperCase()}
                        </Tag>
                    </div>
                    {project?.description && (
                        <p style={{ color: "var(--cds-text-secondary)", marginTop: 6 }}>
                            {project.description}
                        </p>
                    )}
                </div>
                {project?.deadline && (
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: "auto" }}>
                        <Calendar size={16} />
                        <span style={{ fontSize: 14, color: "var(--cds-text-secondary)" }}>
              {new Date(project.deadline).toLocaleDateString()}
            </span>
                    </div>
                )}
            </ClickableTile>
        );
    };

    return (
        <>
            <Grid fullWidth>
                <Column lg={16} md={8} sm={4}>
                    <div style={{ marginBottom: "32px" }}>
                        <h2
                            style={{
                                fontSize: "32px",
                                fontWeight: "600",
                                color: "var(--cds-text-primary)",
                                marginBottom: "8px",
                            }}
                        >
                            My Projects
                        </h2>
                        <p style={{ color: "var(--cds-text-secondary)", fontSize: "16px" }}>
                            Track your tasks and collaborate with your team.
                        </p>
                    </div>

                    {/* Empty state - Show Monday.com-style board skeleton */}
                    {managedProjects.length === 0 && contributingProjects.length === 0 && myApplications.length === 0 ? (
                        <div style={{ marginBottom: "48px" }}>
                            <div style={{
                                backgroundColor: "var(--cds-layer-01)",
                                border: "1px solid var(--cds-border-subtle-01)",
                                borderRadius: "4px",
                                overflow: "hidden"
                            }}>
                                {/* Table Header */}
                                <div style={{
                                    display: "grid",
                                    gridTemplateColumns: "40px 1fr 150px 150px 120px 120px 150px",
                                    backgroundColor: "var(--cds-layer-02)",
                                    borderBottom: "1px solid var(--cds-border-subtle-01)",
                                    padding: "12px 16px",
                                    fontWeight: 600,
                                    fontSize: "14px",
                                    color: "var(--cds-text-primary)"
                                }}>
                                    <div></div>
                                    <div>Task</div>
                                    <div>Person</div>
                                    <div>Status</div>
                                    <div>Due Date</div>
                                    <div>Files</div>
                                    <div>Notes/Links</div>
                                </div>
                                
                                {/* Empty State Message */}
                                <div style={{
                                    padding: "80px 32px",
                                    textAlign: "center"
                                }}>
                                    <Rocket size={48} style={{ marginBottom: "16px", color: "var(--cds-icon-secondary)" }} />
                                    <h3 style={{
                                        fontSize: "20px",
                                        fontWeight: 600,
                                        color: "var(--cds-text-primary)",
                                        marginBottom: "8px"
                                    }}>
                                        No Projects Assigned Yet
                                    </h3>
                                    <p style={{
                                        color: "var(--cds-text-secondary)",
                                        fontSize: "14px",
                                        maxWidth: "400px",
                                        margin: "0 auto"
                                    }}>
                                        Once you're assigned to a project, you'll see your tasks here. You can track progress, add updates, and collaborate with your team.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            {/* Only show "Projects You're Contributing To" for interns */}
                            {contributingProjects.length > 0 && (
                                <div style={{ marginBottom: "48px" }}>
                                    {/* No section header needed since it's the only section */}

                                    <Grid fullWidth>
                                        {contributingProjects.map((project) => (
                                            <Column key={project.id} lg={16} md={8} sm={4}>
                                                <ProjectCard project={project} showBoard={true} />
                                            </Column>
                                        ))}
                                    </Grid>
                                </div>
                            )}
                        </>
                    )}
                </Column>
            </Grid>

            {/* Delete Confirmation Modal */}
            <Modal
                open={showDeleteModal}
                onRequestClose={() => setShowDeleteModal(false)}
                modalHeading="Delete Project"
                modalLabel="Confirmation"
                primaryButtonText="Delete"
                danger
                secondaryButtonText="Cancel"
                onRequestSubmit={() => projectToDelete && handleDeleteProject(projectToDelete.id)}
            >
                <p>
                    Are you sure you want to delete the project "{projectToDelete?.name}"? This
                    action cannot be undone.
                </p>
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

            {/* Edit Project Modal */}
            <EditProjectModal
                open={showEditModal}
                onOpenChange={setShowEditModal}
                project={selectedProject}
                onUpdate={handleProjectUpdated}
            />

            {/* View Project Modal */}
            <ViewProjectModal
                open={showViewModal}
                onOpenChange={setShowViewModal}
                project={selectedProject}
            />
        </>
    );
}
