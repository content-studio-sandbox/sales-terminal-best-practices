import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tag,
  Loading,
  Grid,
  Column,
  ProgressBar
} from "@carbon/react";
import {
  Rocket,
  User,
  Task,
  ChartLine,
  View,
  Checkmark,
  InProgress,
  Edit
} from "@carbon/icons-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import EditAmbitionModal from "./EditAmbitionModal";

interface ViewAmbitionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  ambition: any;
  onViewProjects?: (ambitionTitle: string) => void;
  onUpdate?: () => void;
}

export default function ViewAmbitionModal({
  open,
  onOpenChange,
  ambition,
  onViewProjects,
  onUpdate
}: ViewAmbitionModalProps) {
  const [ambitionDetails, setAmbitionDetails] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savedAmbitionData, setSavedAmbitionData] = useState<any>(null);

  const fetchAmbitionDetails = async () => {
    if (!ambition?.id) return;

    try {
      setLoading(true);

      // Get ambition details
      const { data: ambitionData, error: ambitionError } = await supabase
        .from("ambitions")
        .select("*")
        .eq("id", ambition.id)
        .single();

      if (ambitionError) throw ambitionError;

      // Get leader details if available
      let leaderData = null;
      if (ambitionData.leader_id) {
        const { data: leader } = await supabase
          .from("users")
          .select("id, display_name, email")
          .eq("id", ambitionData.leader_id)
          .single();
        leaderData = leader;
      }

      // Get projects for this ambition
      const { data: projectsData, error: projectsError } = await supabase
        .rpc("get_projects_enhanced");

      if (projectsError) throw projectsError;

      const ambitionProjects = projectsData?.filter(
        (p: any) => p.ambition_name === ambition.title
      ) || [];

      setProjects(ambitionProjects);
      setAmbitionDetails({
        ...ambitionData,
        leader: leaderData,
        projectCount: ambitionProjects.length
      });
    } catch (error) {
      console.error("Error fetching ambition details:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && ambition?.id) {
      fetchAmbitionDetails();
    }
  }, [open, ambition?.id]);

  const handleClose = () => {
    setAmbitionDetails(null);
    setProjects([]);
    setSavedAmbitionData(null);
    onOpenChange(false);
  };

  const handleViewProjects = () => {
    handleClose();
    if (onViewProjects) {
      onViewProjects(ambition.title);
    }
  };

  const handleEditClick = () => {
    // Save the current data before closing view modal
    setSavedAmbitionData(ambitionDetails);
    // Close view modal
    onOpenChange(false);
    // Open edit modal
    setEditModalOpen(true);
  };

  const handleEditUpdate = async () => {
    // Refetch the ambition details to get updated data
    await fetchAmbitionDetails();
    
    // Close edit modal and clear saved data
    setEditModalOpen(false);
    setSavedAmbitionData(null);
    
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleEditClose = () => {
    // Close edit modal and clear saved data
    setEditModalOpen(false);
    setSavedAmbitionData(null);
  };

  // Calculate project statistics
  const completedProjects = projects.filter(p => p.status === "completed").length;
  const activeProjects = projects.filter(p => p.status === "active").length;
  const completionRate = projects.length > 0 
    ? Math.round((completedProjects / projects.length) * 100) 
    : 0;

  return (
    <>
      <ComposedModal
      open={open}
      onClose={handleClose}
      size="lg"
      preventCloseOnClickOutside
    >
      <ModalHeader>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #0f62fe 0%, #0043ce 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            boxShadow: "0 4px 12px rgba(15, 98, 254, 0.3)"
          }}>
            <Rocket size={28} style={{ color: "white" }} />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ 
              margin: "0 0 8px 0", 
              fontSize: "28px", 
              fontWeight: 600,
              color: "var(--cds-text-primary)",
              lineHeight: "1.2"
            }}>
              {ambition?.title || "Strategic Initiative"}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Tag type="blue" size="md">Strategic Initiative</Tag>
              {projects.length > 0 && (
                <Tag type="outline" size="md">{projects.length} Projects</Tag>
              )}
            </div>
          </div>
        </div>
      </ModalHeader>

      <ModalBody hasScrollingContent aria-label="View Ambition modal">
        {loading ? (
          <div style={{ 
            display: "flex", 
            justifyContent: "center", 
            alignItems: "center", 
            minHeight: "300px",
            flexDirection: "column",
            gap: "16px"
          }}>
            <Loading withOverlay={false} />
            <p style={{ color: "var(--cds-text-secondary)" }}>Loading initiative details...</p>
          </div>
        ) : ambitionDetails ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
            {/* Description */}
            <div>
              <h3 style={{ 
                fontSize: "18px", 
                fontWeight: 600, 
                marginBottom: "12px",
                color: "var(--cds-text-primary)"
              }}>
                About This Initiative
              </h3>
              <p style={{
                color: "var(--cds-text-primary)",
                lineHeight: "1.6",
                fontSize: "16px",
                margin: 0,
                padding: "20px",
                backgroundColor: "var(--cds-layer-01)",
                borderRadius: "8px",
                border: "1px solid var(--cds-border-subtle)"
              }}>
                {ambitionDetails.description}
              </p>
            </div>

            {/* Progress Overview */}
            <div style={{
              padding: "24px",
              backgroundColor: "var(--cds-layer-01)",
              borderRadius: "12px",
              border: "1px solid var(--cds-border-subtle)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                <ChartLine size={24} style={{ color: "var(--cds-interactive)" }} />
                <h3 style={{ 
                  fontSize: "20px", 
                  fontWeight: 600, 
                  margin: 0,
                  color: "var(--cds-text-primary)"
                }}>
                  Progress Overview
                </h3>
              </div>

              <Grid narrow fullWidth style={{ marginBottom: "24px" }}>
                <Column lg={5} md={4} sm={4}>
                  <div style={{
                    padding: "24px",
                    backgroundColor: "var(--cds-layer-02)",
                    borderRadius: "8px",
                    textAlign: "center",
                    border: "1px solid var(--cds-border-subtle-01)"
                  }}>
                    <div style={{
                      fontSize: "48px",
                      fontWeight: 700,
                      color: "var(--cds-interactive)",
                      margin: "0 0 8px 0",
                      lineHeight: "1"
                    }}>
                      {projects.length}
                    </div>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--cds-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Total Projects
                    </div>
                  </div>
                </Column>

                <Column lg={5} md={4} sm={4}>
                  <div style={{
                    padding: "24px",
                    backgroundColor: "var(--cds-layer-02)",
                    borderRadius: "8px",
                    textAlign: "center",
                    border: "1px solid var(--cds-border-subtle-01)"
                  }}>
                    <div style={{
                      fontSize: "48px",
                      fontWeight: 700,
                      color: "var(--cds-support-success)",
                      margin: "0 0 8px 0",
                      lineHeight: "1"
                    }}>
                      {activeProjects}
                    </div>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--cds-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Active Projects
                    </div>
                  </div>
                </Column>

                <Column lg={6} md={4} sm={4}>
                  <div style={{
                    padding: "24px",
                    backgroundColor: "var(--cds-layer-02)",
                    borderRadius: "8px",
                    textAlign: "center",
                    border: "1px solid var(--cds-border-subtle-01)"
                  }}>
                    <div style={{
                      fontSize: "48px",
                      fontWeight: 700,
                      color: "var(--cds-text-primary)",
                      margin: "0 0 8px 0",
                      lineHeight: "1"
                    }}>
                      {completedProjects}
                    </div>
                    <div style={{
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--cds-text-secondary)",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px"
                    }}>
                      Completed
                    </div>
                  </div>
                </Column>
              </Grid>

              {projects.length > 0 && (
                <div>
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center", 
                    marginBottom: "16px" 
                  }}>
                    <span style={{
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "var(--cds-text-primary)"
                    }}>
                      Completion Rate
                    </span>
                    <span style={{
                      fontSize: "24px",
                      fontWeight: 700,
                      color: completionRate >= 70 ? "var(--cds-support-success)" : "var(--cds-interactive)"
                    }}>
                      {completionRate}%
                    </span>
                  </div>
                  <ProgressBar
                    value={completionRate}
                    max={100}
                    label="Completion rate"
                    hideLabel
                    size="big"
                    status={completionRate >= 70 ? "finished" : "active"}
                  />
                </div>
              )}
            </div>

            {/* Leader Information */}
            {ambitionDetails.leader && (
              <div style={{
                padding: "24px",
                backgroundColor: "var(--cds-layer-01)",
                borderRadius: "12px",
                border: "1px solid var(--cds-border-subtle)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <User size={24} style={{ color: "var(--cds-interactive)" }} />
                  <h3 style={{ 
                    fontSize: "20px", 
                    fontWeight: 600, 
                    margin: 0,
                    color: "var(--cds-text-primary)"
                  }}>
                    Initiative Leader
                  </h3>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #0f62fe 0%, #0043ce 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    boxShadow: "0 4px 12px rgba(15, 98, 254, 0.2)"
                  }}>
                    <User size={32} style={{ color: "white" }} />
                  </div>
                  <div>
                    <h4 style={{
                      fontSize: "20px",
                      fontWeight: 600,
                      color: "var(--cds-text-primary)",
                      margin: "0 0 4px 0"
                    }}>
                      {ambitionDetails.leader.display_name}
                    </h4>
                    <p style={{
                      fontSize: "14px",
                      color: "var(--cds-text-secondary)",
                      margin: 0
                    }}>
                      {ambitionDetails.leader.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Projects */}
            {projects.length > 0 ? (
              <div style={{
                padding: "24px",
                backgroundColor: "var(--cds-layer-01)",
                borderRadius: "12px",
                border: "1px solid var(--cds-border-subtle)"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                  <Task size={24} style={{ color: "var(--cds-interactive)" }} />
                  <h3 style={{ 
                    fontSize: "20px", 
                    fontWeight: 600, 
                    margin: 0,
                    color: "var(--cds-text-primary)"
                  }}>
                    Recent Projects ({projects.length})
                  </h3>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {projects.slice(0, 3).map((project: any, index: number) => (
                    <div
                      key={project.id}
                      style={{
                        padding: "20px",
                        backgroundColor: "var(--cds-layer-02)",
                        borderRadius: "8px",
                        borderLeft: "4px solid var(--cds-interactive)",
                        transition: "all 0.2s ease"
                      }}
                    >
                      <div style={{ 
                        display: "flex", 
                        justifyContent: "space-between", 
                        alignItems: "flex-start", 
                        marginBottom: "12px" 
                      }}>
                        <h4 style={{
                          fontSize: "18px",
                          fontWeight: 600,
                          color: "var(--cds-text-primary)",
                          margin: 0
                        }}>
                          {project.name}
                        </h4>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {project.status === "completed" ? (
                            <Checkmark size={16} style={{ color: "var(--cds-support-success)" }} />
                          ) : (
                            <InProgress size={16} style={{ color: "var(--cds-interactive)" }} />
                          )}
                          <Tag
                            type={project.status === "completed" ? "green" : 
                                 project.status === "active" ? "blue" : "gray"}
                            size="sm"
                          >
                            {project.status || "Not Started"}
                          </Tag>
                        </div>
                      </div>
                      <p style={{
                        fontSize: "14px",
                        color: "var(--cds-text-secondary)",
                        margin: 0,
                        lineHeight: "1.5"
                      }}>
                        {project.description}
                      </p>
                    </div>
                  ))}
                  {projects.length > 3 && (
                    <div style={{
                      textAlign: "center",
                      padding: "16px",
                      color: "var(--cds-text-secondary)",
                      fontSize: "14px",
                      fontStyle: "italic"
                    }}>
                      +{projects.length - 3} more projects available
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div style={{
                padding: "48px 24px",
                textAlign: "center",
                backgroundColor: "var(--cds-layer-01)",
                borderRadius: "12px",
                border: "2px dashed var(--cds-border-subtle)"
              }}>
                <Task size={48} style={{ color: "var(--cds-icon-secondary)", marginBottom: "16px" }} />
                <h4 style={{
                  fontSize: "18px",
                  fontWeight: 600,
                  color: "var(--cds-text-primary)",
                  margin: "0 0 8px 0"
                }}>
                  No Projects Yet
                </h4>
                <p style={{
                  fontSize: "14px",
                  color: "var(--cds-text-secondary)",
                  margin: 0
                }}>
                  This initiative is ready for projects. Create one to get started.
                </p>
              </div>
            )}
          </div>
        ) : (
          <div style={{ 
            padding: "48px 24px", 
            textAlign: "center",
            color: "var(--cds-text-secondary)"
          }}>
            <p>No details available for this initiative.</p>
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <Button kind="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button
          kind="secondary"
          renderIcon={Edit}
          onClick={handleEditClick}
        >
          Edit
        </Button>
        {projects.length > 0 && (
          <Button
            kind="primary"
            renderIcon={View}
            onClick={handleViewProjects}
          >
            View All Projects
          </Button>
        )}
      </ModalFooter>
      </ComposedModal>

      {/* Edit Modal - Render outside view modal */}
      {editModalOpen && (
        <EditAmbitionModal
          open={editModalOpen}
          onOpenChange={handleEditClose}
          ambition={savedAmbitionData}
          onUpdate={handleEditUpdate}
        />
      )}
    </>
  );
}

// Made with Bob, fixed with blood sweat and tears
