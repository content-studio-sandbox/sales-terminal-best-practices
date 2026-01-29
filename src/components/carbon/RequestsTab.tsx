import { useEffect, useMemo, useState } from "react";
import {
  Grid,
  Column,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Button,
  Tag,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TextArea,
  ToastNotification,
  Loading,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ComboBox,
  ClickableTile,
  MultiSelect,
} from "@carbon/react";
import {
  CheckmarkFilled,
  CloseFilled,
  View,
  Email,
  UserAvatar,
  Add,
  UserFollow,
} from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";
import ApplicantProfileModal from "./ApplicantProfileModal";
import InviteCandidatesModal from "./InviteCandidatesModal";

interface RequestsTabProps {
  user: { id?: string; access_role?: string } | null;
}

const isUUID = (s?: string) =>
    !!s &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        s
    );

export default function RequestsTab({ user }: RequestsTabProps) {
  // Role detection
  const accessRole = (user?.access_role || "").toLowerCase();
  const isLeaderOrManager = accessRole === "manager" || accessRole === "leader";
  
  // Requests state
  const [requests, setRequests] = useState<any[]>([]);
  const [myApplications, setMyApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | "">("");
  const [actionNote, setActionNote] = useState("");
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [notification, setNotification] = useState<any>(null);
  
  // Team Building state
  const [activeTab, setActiveTab] = useState(0);
  const [myProjects, setMyProjects] = useState<any[]>([]);
  const [candidates, setCandidates] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any>(null);
  const [candidateSearch, setCandidateSearch] = useState("");
  const [skillsFilter, setSkillsFilter] = useState<string[]>([]);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [teamBuildingLoading, setTeamBuildingLoading] = useState(false);

  const userId = useMemo(() => (isUUID(user?.id) ? (user!.id as string) : null), [user?.id]);

  // Fetch my projects for team building
  const fetchMyProjects = async () => {
    try {
      setTeamBuildingLoading(true);
      console.log("🔍 [TeamBuilding] Fetching projects for user:", userId);
      
      // Try to fetch real projects if userId exists
      let data = null;
      if (userId) {
        const result = await supabase
          .from("projects")
          .select("*")
          .eq("pm_id", userId)
          .order("created_at", { ascending: false });
        
        if (!result.error) {
          data = result.data;
        }
      }
      
      console.log("✅ [TeamBuilding] Fetched projects:", data?.length || 0);
      
      // DEMO MODE: If no projects found, show sample projects for demonstration
      if (!data || data.length === 0) {
        console.log("📊 [DEMO] No projects found, showing sample data");
        const sampleProjects = [
          {
            id: "demo-1",
            name: "AI Innovation Lab",
            description: "Building next-generation AI solutions for enterprise clients",
            pm_id: userId || "demo-user",
            created_at: new Date().toISOString(),
          },
          {
            id: "demo-2",
            name: "Cloud Migration Initiative",
            description: "Migrating legacy systems to cloud infrastructure",
            pm_id: userId || "demo-user",
            created_at: new Date().toISOString(),
          },
          {
            id: "demo-3",
            name: "Digital Transformation",
            description: "Modernizing business processes with digital tools",
            pm_id: userId || "demo-user",
            created_at: new Date().toISOString(),
          },
        ];
        setMyProjects(sampleProjects);
      } else {
        setMyProjects(data);
      }
    } catch (err: any) {
      console.error("❌ [TeamBuilding] Error fetching projects:", err);
      // Even on error, show sample projects for demo
      console.log("📊 [DEMO] Error occurred, showing sample data");
      const sampleProjects = [
        {
          id: "demo-1",
          name: "AI Innovation Lab",
          description: "Building next-generation AI solutions for enterprise clients",
          pm_id: "demo-user",
          created_at: new Date().toISOString(),
        },
        {
          id: "demo-2",
          name: "Cloud Migration Initiative",
          description: "Migrating legacy systems to cloud infrastructure",
          pm_id: "demo-user",
          created_at: new Date().toISOString(),
        },
        {
          id: "demo-3",
          name: "Digital Transformation",
          description: "Modernizing business processes with digital tools",
          pm_id: "demo-user",
          created_at: new Date().toISOString(),
        },
      ];
      setMyProjects(sampleProjects);
    } finally {
      setTeamBuildingLoading(false);
    }
  };

  // Fetch candidates for team building
  const fetchCandidates = async () => {
    if (!userId) return;
    
    try {
      const { data: users, error } = await supabase
        .from("users")
        .select(`
          id,
          display_name,
          email,
          interests,
          experience,
          user_skills!user_skills_user_id_fkey (
            skill:skills (name)
          )
        `)
        .neq("id", userId);
      
      if (error) throw error;
      
      const transformed = (users || []).map((u: any) => ({
        ...u,
        skills: u.user_skills?.map((us: any) => us.skill?.name).filter(Boolean) || [],
      }));
      
      setCandidates(transformed);
      
      // Fetch skills for filter
      const { data: skillsData } = await supabase.from("skills").select("name");
      setAllSkills(skillsData?.map((s: any) => s.name) || []);
    } catch (err: any) {
      console.error("Error fetching candidates:", err);
    }
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchRequests() {
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        
        if (isLeaderOrManager) {
          // Leaders: fetch incoming requests to projects they manage
          const r = await fetch("/api/incoming-requests", { credentials: "include" });
          if (!r.ok) {
            const e = await r.json().catch(() => ({}));
            throw new Error(e.error || `HTTP ${r.status}`);
          }
          const data = await r.json();
          if (!cancelled) setRequests(data || []);
        } else {
          // Interns: fetch their own submitted applications
          const r = await fetch("/api/my-applications", { credentials: "include" });
          if (!r.ok) {
            const e = await r.json().catch(() => ({}));
            throw new Error(e.error || `HTTP ${r.status}`);
          }
          const data = await r.json();
          if (!cancelled) setMyApplications(data || []);
        }
      } catch (err: any) {
        console.error("Error fetching requests:", err);
        if (!cancelled) {
          setNotification({
            kind: "error",
            title: isLeaderOrManager ? "Error loading requests" : "Error loading applications",
            subtitle: err.message ?? String(err),
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchRequests();
    
    // Fetch team building data for leaders
    if (isLeaderOrManager) {
      fetchMyProjects();
      fetchCandidates();
    }
    
    return () => {
      cancelled = true;
    };
  }, [userId, isLeaderOrManager]);

  const callAction = async (id: string, action: "approve" | "decline") => {
    const url =
        action === "approve"
            ? `/api/requests/${id}/approve`
            : `/api/requests/${id}/decline`;
    const res = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ note: actionNote || null }),
    });
    if (!res.ok) {
      const e = await res.json().catch(() => ({}));
      throw new Error(e.error || `HTTP ${res.status}`);
    }
    return res.json();
  };

  const handleRequestAction = async () => {
    if (!selectedRequest || !actionType) return;
    try {
      await callAction(selectedRequest.id, actionType === "approve" ? "approve" : "decline");
      setNotification({
        kind: "success",
        title: `Request ${actionType === "approve" ? "approved" : "declined"} successfully`,
      });
      setShowActionModal(false);
      setActionNote("");
      setRequests((prev) =>
          prev.map((r) =>
              r.id === selectedRequest.id
                  ? { ...r, status: actionType === "approve" ? "approved" : "declined" }
                  : r
          )
      );
    } catch (err: any) {
      setNotification({
        kind: "error",
        title: "Error updating request",
        subtitle: err.message ?? String(err),
      });
    }
  };

  const handleViewProfile = async (userIdToView: string) => {
    try {
      const { data, error } = await supabase
          .from("users")
          .select(
              `
          id,
          display_name,
          email,
          interests,
          experience,
          skills:user_skills ( skill:skills(name) ),
          products:user_products ( product:products(name) )
        `
          )
          .eq("id", userIdToView)
          .single();
      if (error) throw error;
      setSelectedProfile(data);
      setShowProfileModal(true);
    } catch (err: any) {
      setNotification({
        kind: "error",
        title: "Error loading profile",
        subtitle: err.message ?? String(err),
      });
    }
  };

  const getStatusColor = (status?: string) => {
    switch ((status || "").toLowerCase()) {
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

  const formatStatus = (status?: string) =>
      status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown";

  // Make this robust to either server or SQL join shapes
  const normalized = requests.map((r: any) => ({
    id: r.id,
    user_id: r.user_id ?? r.users?.id,
    user_email: r.user_email ?? r.users?.email,
    project_id: r.project_id ?? r.projects?.id,
    project_name: r.project_name ?? r.projects?.name,
    role_name: r.role_name ?? r.roles?.name ?? "General",
    status: r.status,
    created_at: r.created_at,
  }));

  const filteredRequests = normalized.filter((r: any) => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return r.user_email?.toLowerCase().includes(s) || r.project_name?.toLowerCase().includes(s);
  });

  const headers = [
    { key: "applicant", header: "Applicant" },
    { key: "project", header: "Project" },
    { key: "role", header: "Role" },
    { key: "date", header: "Date Applied" },
    { key: "status", header: "Status" },
    { key: "actions", header: "Actions" },
  ];

  const rows = filteredRequests.map((request: any) => ({
    id: request.id,
    applicant: request.user_email || "Unknown",
    project: request.project_name || "Unknown Project",
    role: request.role_name || "General",
    date: new Date(request.created_at).toLocaleDateString(),
    status: (
        <Tag type={getStatusColor(request.status) as any} size="sm">
          {formatStatus(request.status)}
        </Tag>
    ),
    actions: (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
              kind="ghost"
              size="sm"
              renderIcon={View}
              iconDescription="View Profile"
              hasIconOnly
              onClick={() => handleViewProfile(request.user_id)}
              aria-label="View applicant profile"
          />
          {request.status === "pending" && (
              <>
                <Button
                    kind="primary"
                    size="sm"
                    renderIcon={CheckmarkFilled}
                    iconDescription="Approve"
                    hasIconOnly
                    onClick={() => {
                      setSelectedRequest(request);
                      setActionType("approve");
                      setShowActionModal(true);
                    }}
                    aria-label="Approve request"
                />
                <Button
                    kind="danger"
                    size="sm"
                    renderIcon={CloseFilled}
                    iconDescription="Reject"
                    hasIconOnly
                    onClick={() => {
                      setSelectedRequest(request);
                      setActionType("reject");
                      setShowActionModal(true);
                    }}
                    aria-label="Reject request"
                />
              </>
          )}
        </div>
    ),
    _request: request,
  }));

  // Filter candidates for team building
  const filteredCandidates = candidates.filter((candidate) => {
    if (candidateSearch) {
      const search = candidateSearch.toLowerCase();
      const matchesName = candidate.display_name?.toLowerCase().includes(search);
      const matchesEmail = candidate.email?.toLowerCase().includes(search);
      if (!matchesName && !matchesEmail) return false;
    }
    
    if (skillsFilter.length > 0) {
      const hasSkill = skillsFilter.some(skill =>
        candidate.skills.some((s: string) => s.toLowerCase().includes(skill.toLowerCase()))
      );
      if (!hasSkill) return false;
    }
    
    return true;
  });

  if (loading) return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "400px" }}>
      <Loading withOverlay={false} />
    </div>
  );

  const skillOptions = allSkills.map(s => ({ id: s, label: s }));
  const projectOptions = myProjects.map(p => ({ id: p.id, label: p.name }));

  return (
      <>
        <Grid fullWidth>
          <Column lg={16} md={8} sm={4}>
            <div style={{ marginBottom: 32 }}>
              <h2
                  style={{
                    fontSize: 32,
                    fontWeight: 600,
                    color: "var(--cds-text-primary)",
                    marginBottom: 8,
                  }}
              >
                {isLeaderOrManager ? "Team Management" : "Project Requests"}
              </h2>
              <p style={{ color: "var(--cds-text-secondary)", fontSize: 16 }}>
                {isLeaderOrManager
                  ? "Review applications and build your project teams by inviting talented candidates."
                  : "Review and manage project applications."}
              </p>
            </div>

            {isLeaderOrManager ? (
              <Tabs selectedIndex={activeTab} onChange={(evt: any) => setActiveTab(evt.selectedIndex)}>
                <TabList aria-label="Team management tabs">
                  <Tab>Applications ({requests.length})</Tab>
                  <Tab>Build Team</Tab>
                </TabList>
                <TabPanels>
                  {/* Tab 0: Applications */}
                  <TabPanel>
                    <DataTable rows={rows} headers={headers}>
              {({
                  rows,
                  headers,
                  getTableProps,
                  getHeaderProps,
                  getRowProps,
                  getTableContainerProps,
                }) => (
                  <TableContainer
                      title="Project Requests"
                      description="Manage applications to join your projects"
                      {...getTableContainerProps()}
                  >
                    <TableToolbar>
                      <TableToolbarContent>
                        <TableToolbarSearch
                            placeholder="Search by applicant or project name"
                            onChange={(e: any) => setSearchTerm(e.target.value)}
                            value={searchTerm}
                        />
                      </TableToolbarContent>
                    </TableToolbar>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {headers.map((header) => {
                              const headerProps = getHeaderProps({ header });
                              const { key, ...restHeaderProps } = headerProps;
                              return (
                                <TableHeader key={header.key} {...restHeaderProps}>
                                  {header.header}
                                </TableHeader>
                              );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.length === 0 ? (
                            <TableRow>
                              <TableCell colSpan={headers.length} style={{ textAlign: "center", padding: "64px 0" }}>
                                <p style={{ color: "var(--cds-text-secondary)" }}>
                                  {searchTerm ? "No requests found matching your search." : "No requests to review at this time."}
                                </p>
                              </TableCell>
                            </TableRow>
                        ) : (
                            rows.map((row) => (
                                <TableRow key={row.id} {...getRowProps({ row })}>
                                  {row.cells.map((cell) => (
                                      <TableCell key={cell.id}>{cell.value}</TableCell>
                                  ))}
                                </TableRow>
                            ))
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
              )}
                    </DataTable>
                  </TabPanel>

                  {/* Tab 1: Build Team */}
                  <TabPanel>
                    <div style={{ marginBottom: "24px" }}>
                      <p style={{ fontSize: "16px", color: "var(--cds-text-secondary)", marginBottom: "24px" }}>
                        Select a project and invite candidates to join your team. Search and filter to find the right talent.
                      </p>
                      
                      {/* Project Selection */}
                      <div style={{ marginBottom: "24px" }}>
                        <ComboBox
                          id="project-select"
                          items={projectOptions}
                          itemToString={(item) => item?.label || ''}
                          titleText="Select Project"
                          placeholder="Choose a project to build a team for..."
                          selectedItem={projectOptions.find(p => p.id === selectedProject?.id)}
                          onChange={({ selectedItem }) => {
                            const project = myProjects.find(p => p.id === selectedItem?.id);
                            setSelectedProject(project || null);
                          }}
                        />
                      </div>

                      {selectedProject && (
                        <div style={{
                          padding: "16px",
                          backgroundColor: "var(--cds-layer-01)",
                          borderRadius: "4px",
                          marginBottom: "24px",
                          borderLeft: "4px solid var(--cds-interactive)"
                        }}>
                          <h4 style={{ fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
                            {selectedProject.name}
                          </h4>
                          <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)" }}>
                            {selectedProject.description}
                          </p>
                        </div>
                      )}

                      {/* Candidate Filters */}
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginBottom: "24px" }}>
                        <div style={{ minWidth: "250px", flex: 1 }}>
                          <TableToolbarSearch
                            placeholder="Search candidates by name or email..."
                            onChange={(e: any) => setCandidateSearch(e.target.value)}
                            value={candidateSearch}
                          />
                        </div>
                        <div style={{ minWidth: "200px" }}>
                          <MultiSelect
                            id="candidate-skills-filter"
                            items={skillOptions}
                            itemToString={(item) => item?.label || ''}
                            titleText="Filter by skills"
                            label="Filter by skills"
                            selectedItems={skillOptions.filter(opt => skillsFilter.includes(opt.id))}
                            onChange={({ selectedItems }) => setSkillsFilter(selectedItems.map(item => item.id))}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Candidates Grid */}
                    {teamBuildingLoading ? (
                      <div style={{ display: "flex", justifyContent: "center", padding: "64px 0" }}>
                        <Loading withOverlay={false} />
                      </div>
                    ) : !selectedProject ? (
                      <div style={{ textAlign: "center", padding: "64px 0" }}>
                        <Add size={48} style={{ marginBottom: "16px", color: "var(--cds-icon-secondary)" }} />
                        <p style={{ color: "var(--cds-text-secondary)", fontSize: "16px" }}>
                          Select a project above to start building your team
                        </p>
                      </div>
                    ) : filteredCandidates.length === 0 ? (
                      <div style={{ textAlign: "center", padding: "64px 0" }}>
                        <UserAvatar size={48} style={{ marginBottom: "16px", color: "var(--cds-icon-secondary)" }} />
                        <p style={{ color: "var(--cds-text-secondary)", fontSize: "16px" }}>
                          No candidates match your filters
                        </p>
                      </div>
                    ) : (
                      <Grid fullWidth>
                        {filteredCandidates.map((candidate: any) => (
                          <Column key={candidate.id} lg={5} md={4} sm={4} style={{ marginBottom: "24px" }}>
                            <ClickableTile
                              onClick={() => handleViewProfile(candidate.id)}
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
                                    <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--cds-text-primary)", marginBottom: "4px" }}>
                                      {candidate.display_name || "Unknown"}
                                    </h3>
                                    <p style={{ fontSize: "12px", color: "var(--cds-text-secondary)" }}>
                                      {candidate.email}
                                    </p>
                                  </div>
                                </div>
                                
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
                              </div>
                              
                              <div style={{ marginTop: "auto", display: "flex", gap: "8px" }}>
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  renderIcon={View}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleViewProfile(candidate.id);
                                  }}
                                  style={{ flex: 1 }}
                                >
                                  View
                                </Button>
                                <Button
                                  kind="primary"
                                  size="sm"
                                  renderIcon={Email}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSelectedProfile(candidate);
                                    setShowInviteModal(true);
                                  }}
                                  style={{ flex: 1 }}
                                >
                                  Invite
                                </Button>
                              </div>
                            </ClickableTile>
                          </Column>
                        ))}
                      </Grid>
                    )}
                  </TabPanel>
                </TabPanels>
              </Tabs>
            ) : (
              <>
                {/* Intern View: My Applications */}
                <div style={{ marginBottom: "24px" }}>
                  <p style={{ fontSize: "16px", color: "var(--cds-text-secondary)" }}>
                    Track the status of your project applications. You'll be notified when project managers review your submissions.
                  </p>
                </div>

                {myApplications.length === 0 ? (
                  <div style={{ textAlign: "center", padding: "64px 0" }}>
                    <Email size={48} style={{ marginBottom: "16px", color: "var(--cds-icon-secondary)" }} />
                    <h3 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "8px" }}>
                      No Applications Yet
                    </h3>
                    <p style={{ color: "var(--cds-text-secondary)", fontSize: "16px", marginBottom: "24px" }}>
                      Browse available projects and click "I'm Interested" to apply.
                    </p>
                    <Button
                      kind="primary"
                      renderIcon={UserFollow}
                      onClick={() => window.location.href = "/ambitions"}
                    >
                      Explore Opportunities
                    </Button>
                  </div>
                ) : (
                  <Grid fullWidth>
                    {myApplications.map((app: any) => {
                      const project = app.project;
                      const isPending = app.status === "pending";
                      const isApproved = app.status === "approved";
                      const isDeclined = app.status === "declined";
                      
                      return (
                        <Column key={app.id} lg={5} md={4} sm={4} style={{ marginBottom: "24px" }}>
                          <ClickableTile
                            style={{
                              height: "100%",
                              display: "flex",
                              flexDirection: "column",
                              borderLeft: isPending ? "4px solid var(--cds-support-warning)" :
                                         isApproved ? "4px solid var(--cds-support-success)" :
                                         "4px solid var(--cds-support-error)",
                              opacity: isDeclined ? 0.7 : 1
                            }}
                          >
                            <div style={{ marginBottom: "16px" }}>
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                                <h3 style={{ fontSize: "18px", fontWeight: 600, color: "var(--cds-text-primary)" }}>
                                  {project?.name || "Unknown Project"}
                                </h3>
                                <Tag
                                  type={isPending ? "blue" : isApproved ? "green" : "red"}
                                  size="sm"
                                >
                                  {isPending ? "Pending" : isApproved ? "Approved" : "Declined"}
                                </Tag>
                              </div>
                              
                              <p style={{ fontSize: "14px", color: "var(--cds-text-secondary)", lineHeight: "1.4", marginBottom: "12px" }}>
                                {project?.description || "No description available"}
                              </p>
                              
                              {app.role_name && (
                                <div style={{ marginBottom: "8px" }}>
                                  <Tag type="outline" size="sm">Role: {app.role_name}</Tag>
                                </div>
                              )}
                              
                              <div style={{ fontSize: "12px", color: "var(--cds-text-secondary)", marginTop: "12px" }}>
                                <p>Applied: {new Date(app.created_at).toLocaleDateString()}</p>
                                {app.reviewed_at && (
                                  <p>Reviewed: {new Date(app.reviewed_at).toLocaleDateString()}</p>
                                )}
                                {app.pm_note && (
                                  <p style={{ marginTop: "8px", fontStyle: "italic", color: "var(--cds-text-primary)" }}>
                                    Note: {app.pm_note}
                                  </p>
                                )}
                              </div>
                            </div>
                            
                            {isApproved && (
                              <div style={{ marginTop: "auto" }}>
                                <Tag type="green" size="md" style={{ width: "100%" }}>
                                  ✓ You've been added to this project!
                                </Tag>
                              </div>
                            )}
                          </ClickableTile>
                        </Column>
                      );
                    })}
                  </Grid>
                )}
              </>
            )}
          </Column>
        </Grid>

        {/* Invite Modal */}
        {selectedProject && (
          <InviteCandidatesModal
            open={showInviteModal}
            onOpenChange={setShowInviteModal}
            project={selectedProject}
            onInvitationsSent={() => {
              setNotification({
                kind: "success",
                title: "Invitation sent successfully",
              });
              setShowInviteModal(false);
            }}
          />
        )}

        {/* Action Modal */}
        <ComposedModal open={showActionModal} onClose={() => setShowActionModal(false)} size="md">
          <ModalHeader>
            <h3>{actionType === "approve" ? "Approve" : "Reject"} Request</h3>
          </ModalHeader>
          <ModalBody>
            <p style={{ marginBottom: 16 }}>
              {actionType === "approve"
                  ? `Approve ${selectedRequest?.user_email}'s request to join "${selectedRequest?.project_name}"?`
                  : `Reject ${selectedRequest?.user_email}'s request to join "${selectedRequest?.project_name}"?`}
            </p>
            <TextArea
                id="action-note"
                labelText="Note (optional)"
                placeholder="Add a note for the applicant..."
                value={actionNote}
                onChange={(e: any) => setActionNote(e.target.value)}
                rows={3}
            />
          </ModalBody>
          <ModalFooter>
            <Button kind="secondary" onClick={() => setShowActionModal(false)}>
              Cancel
            </Button>
            <Button kind={actionType === "approve" ? "primary" : "danger"} onClick={handleRequestAction}>
              {actionType === "approve" ? "Approve" : "Reject"}
            </Button>
          </ModalFooter>
        </ComposedModal>

        {/* Profile Modal */}
        <ApplicantProfileModal
            open={showProfileModal}
            onOpenChange={setShowProfileModal}
            profileData={selectedProfile}
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
