import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Tag,
  Loading,
  Tile,
  ProgressBar,
  Grid,
  Column,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Section,
  Heading
} from "@carbon/react";
import {
  User,
  Calendar,
  UserMultiple,
  Time,
  Task,
  Events,
  Product,
  Checkmark,
  WarningAlt,
  ChartLine,
  Education,
  Information,
  Rocket,
  CheckmarkFilled,
  Edit
} from "@carbon/icons-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import EditProjectModal from "./carbon/EditProjectModal";

interface ViewProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: any;
  onUpdate?: () => void;
}

export default function ViewProjectModal({ open, onOpenChange, project, onUpdate }: ViewProjectModalProps) {
  const [projectDetails, setProjectDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userSkills, setUserSkills] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [savedProjectData, setSavedProjectData] = useState<any>(null);

  const fetchProjectDetails = async () => {
    if (!project?.id) return;
    
    try {
      setLoading(true);
      
      // Get enhanced project details
      const { data: projectData, error: projectError } = await supabase
        .rpc('get_projects_enhanced')
        .eq('id', project.id)
        .single();
      
      if (projectError) throw projectError;

      // Get objectives
      const { data: objectives, error: objectivesError } = await supabase
        .from('objectives')
        .select('description')
        .eq('project_id', project.id);
      
      if (objectivesError) throw objectivesError;

      // Get user's skills for skill gap analysis
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: skills } = await supabase
          .from('user_skills')
          .select('skill:skills(name)')
          .eq('user_id', user.id);
        
        setUserSkills(skills?.map((s: any) => s.skill?.name).filter(Boolean) || []);
      }

      setProjectDetails({
        ...projectData,
        objectives: objectives || []
      });
    } catch (error) {
      console.error('Error fetching project details:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && project?.id) {
      fetchProjectDetails();
      setActiveTab(0);
    }
  }, [open, project?.id]);

  const handleClose = () => {
    setProjectDetails(null);
    setUserSkills([]);
    setActiveTab(0);
    setSavedProjectData(null);
    onOpenChange(false);
  };

  const handleEditClick = () => {
    // Save the current data before closing view modal
    setSavedProjectData(projectDetails);
    // Close view modal
    onOpenChange(false);
    // Open edit modal
    setEditModalOpen(true);
  };

  const handleEditUpdate = () => {
    // Close edit modal and clear saved data
    setEditModalOpen(false);
    setSavedProjectData(null);
    setProjectDetails(null);
    setUserSkills([]);
    setActiveTab(0);
    if (onUpdate) {
      onUpdate();
    }
  };

  const handleEditClose = () => {
    // Close edit modal and clear saved data
    setEditModalOpen(false);
    setSavedProjectData(null);
  };

  // Calculate skill match percentage
  const calculateSkillMatch = () => {
    if (!projectDetails?.skills || projectDetails.skills.length === 0) return 100;
    const matchedSkills = projectDetails.skills.filter((skill: string) =>
      userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    );
    return Math.round((matchedSkills.length / projectDetails.skills.length) * 100);
  };

  const getMissingSkills = () => {
    if (!projectDetails?.skills) return [];
    return projectDetails.skills.filter((skill: string) =>
      !userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    );
  };

  const getMatchedSkills = () => {
    if (!projectDetails?.skills) return [];
    return projectDetails.skills.filter((skill: string) =>
      userSkills.some(userSkill => userSkill.toLowerCase() === skill.toLowerCase())
    );
  };

  const skillMatchPercentage = calculateSkillMatch();
  const isGoodMatch = skillMatchPercentage >= 70;

  return (
    <>
      <ComposedModal
      open={open}
      onClose={handleClose}
      size="lg"
      preventCloseOnClickOutside
    >
      <ModalHeader>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <Heading style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
              {project?.name || project?.title || 'Project Details'}
            </Heading>
            {projectDetails?.applications_status && (
              <Tag 
                type={projectDetails.applications_status === 'open' ? 'green' : 'red'} 
                size="md"
              >
                {projectDetails.applications_status === 'open' ? 'Applications Open' : 'Applications Closed'}
              </Tag>
            )}
          </div>
          {projectDetails?.ambition_name && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Rocket size={16} style={{ color: 'var(--cds-interactive)' }} />
              <Tag type="blue" size="md">
                {projectDetails.ambition_name}
              </Tag>
            </div>
          )}
        </div>
      </ModalHeader>
      
      <ModalBody hasScrollingContent aria-label="View Project Modal">
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
            <Loading withOverlay={false} description="Loading project details..." />
          </div>
        ) : projectDetails ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            <Tabs selectedIndex={activeTab} onChange={(evt: any) => setActiveTab(evt.selectedIndex)}>
              <TabList aria-label="Project details tabs" contained>
                <Tab>Overview</Tab>
                <Tab>Requirements</Tab>
                <Tab>Team & Timeline</Tab>
              </TabList>
              
              <TabPanels>
                {/* Tab 0: Overview */}
                <TabPanel>
                  <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Project Description */}
                    <Section level={3}>
                      <Heading style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Information size={20} style={{ color: 'var(--cds-interactive)' }} />
                        About This Project
                      </Heading>
                      <p style={{ 
                        color: 'var(--cds-text-primary)', 
                        lineHeight: '1.7',
                        fontSize: '15px',
                        margin: 0
                      }}>
                        {projectDetails.description}
                      </p>
                    </Section>

                    {/* Skill Match Card */}
                    {projectDetails.skills && projectDetails.skills.length > 0 && (
                      <Tile style={{ 
                        padding: '24px', 
                        backgroundColor: isGoodMatch ? 'var(--cds-layer-accent-01)' : 'var(--cds-layer-01)',
                        borderLeft: `4px solid ${isGoodMatch ? 'var(--cds-support-success)' : 'var(--cds-support-warning)'}`,
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '50%',
                            backgroundColor: isGoodMatch ? 'var(--cds-support-success)' : 'var(--cds-support-warning)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {isGoodMatch ? (
                              <CheckmarkFilled size={28} style={{ color: 'white' }} />
                            ) : (
                              <WarningAlt size={28} style={{ color: 'white' }} />
                            )}
                          </div>
                          <div style={{ flex: 1 }}>
                            <h4 style={{ 
                              fontSize: '20px', 
                              fontWeight: 600, 
                              color: 'var(--cds-text-primary)',
                              margin: '0 0 8px 0'
                            }}>
                              Your Skill Match: {skillMatchPercentage}%
                            </h4>
                            <p style={{ 
                              fontSize: '14px', 
                              color: 'var(--cds-text-secondary)',
                              margin: 0,
                              lineHeight: '1.5'
                            }}>
                              {isGoodMatch 
                                ? 'Excellent match! You have most of the required skills for this project.'
                                : 'You may need to develop some skills. Consider learning the missing skills to strengthen your application.'}
                            </p>
                          </div>
                        </div>
                        
                        <div style={{ marginBottom: '24px' }}>
                          <ProgressBar
                            value={skillMatchPercentage}
                            max={100}
                            label="Skill match percentage"
                            hideLabel
                            size="big"
                            status={isGoodMatch ? 'finished' : 'active'}
                          />
                        </div>
                        
                        {/* Skills Grid */}
                        <Grid narrow fullWidth>
                          {getMatchedSkills().length > 0 && (
                            <Column lg={8} md={4} sm={4}>
                              <div style={{ 
                                padding: '16px', 
                                backgroundColor: 'var(--cds-layer-02)', 
                                borderRadius: '4px',
                                height: '100%'
                              }}>
                                <p style={{ 
                                  fontSize: '12px', 
                                  fontWeight: 600, 
                                  color: 'var(--cds-support-success)',
                                  marginBottom: '12px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  <Checkmark size={16} />
                                  You Have ({getMatchedSkills().length})
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {getMatchedSkills().map((skill: string, index: number) => (
                                    <Tag key={index} type="green" size="md">
                                      {skill}
                                    </Tag>
                                  ))}
                                </div>
                              </div>
                            </Column>
                          )}
                          
                          {getMissingSkills().length > 0 && (
                            <Column lg={8} md={4} sm={4}>
                              <div style={{ 
                                padding: '16px', 
                                backgroundColor: 'var(--cds-layer-02)', 
                                borderRadius: '4px',
                                height: '100%'
                              }}>
                                <p style={{ 
                                  fontSize: '12px', 
                                  fontWeight: 600, 
                                  color: 'var(--cds-support-error)',
                                  marginBottom: '12px',
                                  textTransform: 'uppercase',
                                  letterSpacing: '0.5px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '6px'
                                }}>
                                  <WarningAlt size={16} />
                                  Missing ({getMissingSkills().length})
                                </p>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                  {getMissingSkills().map((skill: string, index: number) => (
                                    <Tag key={index} type="red" size="md">
                                      {skill}
                                    </Tag>
                                  ))}
                                </div>
                              </div>
                            </Column>
                          )}
                        </Grid>
                      </Tile>
                    )}

                    {/* Learning Recommendation */}
                    {getMissingSkills().length > 0 && (
                      <Tile style={{ 
                        padding: '20px', 
                        backgroundColor: 'var(--cds-layer-accent-01)',
                        borderLeft: '4px solid var(--cds-interactive)'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
                          <Education size={32} style={{ color: 'var(--cds-interactive)', flexShrink: 0 }} />
                          <div style={{ flex: 1 }}>
                            <h5 style={{ 
                              fontSize: '16px', 
                              fontWeight: 600, 
                              color: 'var(--cds-text-primary)',
                              margin: '0 0 8px 0'
                            }}>
                              Strengthen Your Application
                            </h5>
                            <p style={{ 
                              color: 'var(--cds-text-secondary)', 
                              margin: '0 0 16px 0',
                              fontSize: '14px',
                              lineHeight: '1.5'
                            }}>
                              You're missing {getMissingSkills().length} required skill{getMissingSkills().length > 1 ? 's' : ''} for this project. 
                              Consider completing relevant IBM training courses to improve your chances.
                            </p>
                            <Button 
                              kind="tertiary" 
                              size="sm"
                              renderIcon={Education}
                              onClick={() => window.open('https://www.ibm.com/training', '_blank')}
                            >
                              Explore IBM Learning
                            </Button>
                          </div>
                        </div>
                      </Tile>
                    )}

                    {/* Project Objectives */}
                    {projectDetails.objectives && projectDetails.objectives.length > 0 && (
                      <Section level={3}>
                        <Heading style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Task size={20} style={{ color: 'var(--cds-interactive)' }} />
                          Project Objectives ({projectDetails.objectives.length})
                        </Heading>
                        <Tile style={{ padding: '20px' }}>
                          <ul style={{ 
                            margin: 0, 
                            paddingLeft: '24px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}>
                            {projectDetails.objectives.map((objective: any, index: number) => (
                              <li key={index} style={{ 
                                color: 'var(--cds-text-primary)',
                                fontSize: '15px',
                                lineHeight: '1.6'
                              }}>
                                {objective.description}
                              </li>
                            ))}
                          </ul>
                        </Tile>
                      </Section>
                    )}
                  </div>
                </TabPanel>

                {/* Tab 1: Requirements */}
                <TabPanel>
                  <div style={{ padding: '24px 0', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {/* Required Skills */}
                    {projectDetails.skills && projectDetails.skills.length > 0 && (
                      <Section level={3}>
                        <Heading style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <ChartLine size={20} style={{ color: 'var(--cds-interactive)' }} />
                          Required Skills
                        </Heading>
                        <Tile style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {projectDetails.skills.map((skill: string, index: number) => (
                              <Tag key={index} type="blue" size="md">
                                {skill}
                              </Tag>
                            ))}
                          </div>
                        </Tile>
                      </Section>
                    )}

                    {/* Open Positions */}
                    {projectDetails.roles && projectDetails.roles.length > 0 && (
                      <Section level={3}>
                        <Heading style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <UserMultiple size={20} style={{ color: 'var(--cds-interactive)' }} />
                          Open Positions
                        </Heading>
                        <Tile style={{ padding: '20px' }}>
                          <StructuredListWrapper>
                            <StructuredListHead>
                              <StructuredListRow head>
                                <StructuredListCell head>Role</StructuredListCell>
                                <StructuredListCell head>Positions Available</StructuredListCell>
                              </StructuredListRow>
                            </StructuredListHead>
                            <StructuredListBody>
                              {projectDetails.roles.map((roleObj: any, index: number) => (
                                <StructuredListRow key={index}>
                                  <StructuredListCell>
                                    <strong>{roleObj.role}</strong>
                                  </StructuredListCell>
                                  <StructuredListCell>
                                    <Tag type="outline" size="md">{roleObj.count} needed</Tag>
                                  </StructuredListCell>
                                </StructuredListRow>
                              ))}
                            </StructuredListBody>
                          </StructuredListWrapper>
                        </Tile>
                      </Section>
                    )}

                    {/* IBM Products */}
                    {projectDetails.products && projectDetails.products.length > 0 && (
                      <Section level={3}>
                        <Heading style={{ fontSize: '18px', fontWeight: 600, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Product size={20} style={{ color: 'var(--cds-interactive)' }} />
                          IBM Products Used
                        </Heading>
                        <Tile style={{ padding: '20px' }}>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {projectDetails.products.map((product: string, index: number) => (
                              <Tag key={index} type="blue" size="md">
                                {product}
                              </Tag>
                            ))}
                          </div>
                        </Tile>
                      </Section>
                    )}
                  </div>
                </TabPanel>

                {/* Tab 2: Team & Timeline */}
                <TabPanel>
                  <div style={{ padding: '24px 0' }}>
                    <Grid narrow fullWidth>
                      {/* Project Manager */}
                      {projectDetails.pm_name && (
                        <Column lg={8} md={4} sm={4} style={{ marginBottom: '24px' }}>
                          <Tile style={{ padding: '20px', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <User size={24} style={{ color: 'var(--cds-interactive)' }} />
                              <p style={{ 
                                fontSize: '12px', 
                                fontWeight: 600, 
                                color: 'var(--cds-text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                margin: 0
                              }}>
                                Project Manager
                              </p>
                            </div>
                            <p style={{ 
                              fontSize: '18px',
                              fontWeight: 600,
                              color: 'var(--cds-text-primary)', 
                              margin: '0 0 8px 0' 
                            }}>
                              {projectDetails.pm_name}
                            </p>
                            {projectDetails.pm_email && (
                              <p style={{ 
                                fontSize: '14px',
                                color: 'var(--cds-text-secondary)', 
                                margin: 0,
                                wordBreak: 'break-word'
                              }}>
                                {projectDetails.pm_email}
                              </p>
                            )}
                          </Tile>
                        </Column>
                      )}

                      {/* Deadline */}
                      {projectDetails.deadline && (
                        <Column lg={8} md={4} sm={4} style={{ marginBottom: '24px' }}>
                          <Tile style={{ padding: '20px', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <Calendar size={24} style={{ color: 'var(--cds-interactive)' }} />
                              <p style={{ 
                                fontSize: '12px', 
                                fontWeight: 600, 
                                color: 'var(--cds-text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                margin: 0
                              }}>
                                Deadline
                              </p>
                            </div>
                            <p style={{ 
                              fontSize: '18px',
                              fontWeight: 600,
                              color: 'var(--cds-text-primary)', 
                              margin: 0 
                            }}>
                              {new Date(projectDetails.deadline).toLocaleDateString('en-US', { 
                                month: 'long', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </Tile>
                        </Column>
                      )}

                      {/* Time Commitment */}
                      {projectDetails.hours_per_week && (
                        <Column lg={8} md={4} sm={4} style={{ marginBottom: '24px' }}>
                          <Tile style={{ padding: '20px', height: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                              <Time size={24} style={{ color: 'var(--cds-interactive)' }} />
                              <p style={{ 
                                fontSize: '12px', 
                                fontWeight: 600, 
                                color: 'var(--cds-text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                margin: 0
                              }}>
                                Time Commitment
                              </p>
                            </div>
                            <p style={{ 
                              fontSize: '18px',
                              fontWeight: 600,
                              color: 'var(--cds-text-primary)', 
                              margin: 0 
                            }}>
                              {projectDetails.hours_per_week} hours/week
                            </p>
                          </Tile>
                        </Column>
                      )}

                      {/* Team Size */}
                      <Column lg={8} md={4} sm={4} style={{ marginBottom: '24px' }}>
                        <Tile style={{ padding: '20px', height: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <UserMultiple size={24} style={{ color: 'var(--cds-interactive)' }} />
                            <p style={{ 
                              fontSize: '12px', 
                              fontWeight: 600, 
                              color: 'var(--cds-text-secondary)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              margin: 0
                            }}>
                              Current Team Size
                            </p>
                          </div>
                          <p style={{ 
                            fontSize: '18px',
                            fontWeight: 600,
                            color: 'var(--cds-text-primary)', 
                            margin: 0 
                          }}>
                            {projectDetails.working_count || 0} members
                          </p>
                        </Tile>
                      </Column>

                      {/* Application Status */}
                      <Column lg={8} md={4} sm={4} style={{ marginBottom: '24px' }}>
                        <Tile style={{ padding: '20px', height: '100%' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                            <Events size={24} style={{ color: 'var(--cds-interactive)' }} />
                            <p style={{ 
                              fontSize: '12px', 
                              fontWeight: 600, 
                              color: 'var(--cds-text-secondary)',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              margin: 0
                            }}>
                              Application Status
                            </p>
                          </div>
                          <Tag 
                            type={projectDetails.applications_status === 'open' ? 'green' : 'red'} 
                            size="md"
                          >
                            {projectDetails.applications_status === 'open' ? 'Accepting Applications' : 'Applications Closed'}
                          </Tag>
                        </Tile>
                      </Column>
                    </Grid>
                  </div>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </div>
        ) : project ? (
          <div style={{ padding: '24px 0' }}>
            <h4 style={{ marginBottom: '12px', fontSize: '20px', fontWeight: 600 }}>
              {project.name || project.title}
            </h4>
            <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '16px', lineHeight: '1.6' }}>
              {project.description}
            </p>
          </div>
        ) : null}
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
        <Button
          kind="primary"
          onClick={handleClose}
          disabled={projectDetails?.applications_status !== 'open'}
        >
          Apply to Join
        </Button>
      </ModalFooter>
      </ComposedModal>

      {/* Edit Modal - Render outside view modal */}
      {editModalOpen && (
        <EditProjectModal
          open={editModalOpen}
          onOpenChange={handleEditClose}
          project={savedProjectData}
          onUpdate={handleEditUpdate}
        />
      )}
    </>
  );
}

// Made with Bob
