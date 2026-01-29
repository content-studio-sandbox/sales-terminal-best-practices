import { useState, useEffect } from "react";
import {
  ComposedModal,
  ModalHeader,
  ModalBody,
  Grid,
  Column,
  Tag,
  Loading,
  ProgressBar,
  Tile
} from "@carbon/react";
import {
  User,
  Email,
  Time,
  CheckmarkFilled,
  WarningAlt,
  TrophyFilled,
  ChartLine
} from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";

interface ApplicantProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileData: any;
}

export default function ApplicantProfileModal({ 
  open, 
  onOpenChange, 
  profileData 
}: ApplicantProfileModalProps) {
  if (!profileData) {
    return (
      <ComposedModal
        open={open}
        onClose={() => onOpenChange(false)}
        size="md"
      >
        <ModalHeader>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <User size={24} />
            User Profile
          </h3>
        </ModalHeader>
        <ModalBody>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: '64px 0' 
          }}>
            <Loading />
          </div>
        </ModalBody>
      </ComposedModal>
    );
  }

  // Fetch performance data
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [projectStats, setProjectStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profileData?.id) {
      fetchEnhancedData();
    }
  }, [profileData?.id]);

  const fetchEnhancedData = async () => {
    try {
      setLoading(true);
      
      // Fetch performance rating
      const { data: perfData, error: perfError } = await supabase
        .from('user_performance' as any)
        .select('*')
        .eq('user_id', profileData.id)
        .maybeSingle();
      
      if (perfError) {
        console.error('Error fetching performance data:', perfError);
      }
      setPerformanceData(perfData);

      // Fetch project statistics
      const [managed, contributed] = await Promise.all([
        supabase.from('projects').select('id, status').eq('pm_id', profileData.id),
        supabase.from('project_staff').select('id, projects:project_id(status)').eq('user_id', profileData.id)
      ]);

      const managedProjects = managed.data || [];
      const contributedProjects = contributed.data || [];
      const allProjects = [...managedProjects, ...contributedProjects.map((c: any) => c.projects)].filter(Boolean);
      
      const completed = allProjects.filter((p: any) => p.status === 'complete').length;
      const active = allProjects.filter((p: any) => p.status === 'in progress').length;
      const total = allProjects.length;

      setProjectStats({
        total,
        completed,
        active,
        completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
      });
    } catch (error) {
      console.error('Error fetching enhanced data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceLabel = (rating: string) => {
    const labels: Record<string, string> = {
      'high_performer': 'High Performer',
      'meets_expectations': 'Meets Expectations',
      'needs_improvement': 'Needs Improvement'
    };
    return labels[rating] || 'Not Rated';
  };

  const getPerformanceColor = (rating: string) => {
    const colors: Record<string, string> = {
      'high_performer': 'var(--cds-support-success)',
      'meets_expectations': 'var(--cds-support-info)',
      'needs_improvement': 'var(--cds-support-warning)'
    };
    return colors[rating] || 'var(--cds-text-secondary)';
  };

  const getPipelineLabel = (stage: string) => {
    const labels: Record<string, string> = {
      'active': 'Active',
      'high_performer': 'High Performer',
      'conversion_candidate': 'Conversion Candidate',
      'offer_extended': 'Offer Extended',
      'offer_accepted': 'Offer Accepted'
    };
    return labels[stage] || 'Active';
  };

  return (
    <ComposedModal
      open={open}
      onClose={() => onOpenChange(false)}
      size="lg"
    >
      <ModalHeader>
        <h3 style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: 'var(--cds-text-primary)',
          fontSize: '1.5rem',
          fontWeight: 400
        }}>
          <User size={24} />
          {profileData.fullName || profileData.display_name}
        </h3>
      </ModalHeader>
      
      <ModalBody>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            {/* Header Section with Key Metrics */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              gap: '24px',
              marginBottom: '32px',
              padding: '24px',
              backgroundColor: 'var(--cds-layer-01)',
              borderRadius: '8px',
              border: '1px solid var(--cds-border-subtle-01)'
            }}>
              <div style={{
                width: '96px',
                height: '96px',
                borderRadius: '50%',
                backgroundColor: 'var(--cds-interactive)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '32px',
                fontWeight: '600',
                flexShrink: 0
              }}>
                {(profileData.fullName || profileData.display_name || 'U').charAt(0).toUpperCase()}
              </div>
              
              <div>
                <h2 style={{
                  fontSize: '1.75rem',
                  fontWeight: 400,
                  color: 'var(--cds-text-primary)',
                  marginBottom: '8px'
                }}>
                  {profileData.fullName || profileData.display_name}
                </h2>
                <p style={{
                  fontSize: '1rem',
                  color: 'var(--cds-text-secondary)',
                  fontWeight: 500,
                  marginBottom: '12px',
                  textTransform: 'capitalize'
                }}>
                  {profileData.access_role || 'Employee'}
                </p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  color: 'var(--cds-text-secondary)',
                  marginBottom: '16px'
                }}>
                  <Email size={16} />
                  <span style={{ fontSize: '0.875rem' }}>
                    {profileData.email}
                  </span>
                </div>

                {/* Quick Stats */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '12px',
                  marginTop: '16px'
                }}>
                  {performanceData && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'var(--cds-layer-02)',
                      borderRadius: '4px',
                      borderLeft: `4px solid ${getPerformanceColor(performanceData.performance_rating)}`
                    }}>
                      <div className="cds--label-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '4px' }}>
                        Performance
                      </div>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        color: getPerformanceColor(performanceData.performance_rating)
                      }}>
                        {getPerformanceLabel(performanceData.performance_rating)}
                      </div>
                    </div>
                  )}
                  
                  {projectStats && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'var(--cds-layer-02)',
                      borderRadius: '4px',
                      borderLeft: '4px solid var(--cds-support-info)'
                    }}>
                      <div className="cds--label-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '4px' }}>
                        Project Success
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cds-text-primary)' }}>
                        {projectStats.completionRate}% ({projectStats.completed}/{projectStats.total})
                      </div>
                    </div>
                  )}

                  {performanceData?.pipeline_stage && (
                    <div style={{
                      padding: '12px',
                      backgroundColor: 'var(--cds-layer-02)',
                      borderRadius: '4px',
                      borderLeft: '4px solid var(--cds-support-success)'
                    }}>
                      <div className="cds--label-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '4px' }}>
                        Pipeline Stage
                      </div>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--cds-text-primary)' }}>
                        {getPipelineLabel(performanceData.pipeline_stage)}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Skills Analysis */}
            <Grid style={{ marginBottom: '24px' }}>
              <Column lg={8} md={4} sm={2}>
                <Tile style={{ height: '100%', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <CheckmarkFilled size={20} style={{ color: 'var(--cds-support-success)' }} />
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--cds-text-primary)',
                      margin: 0
                    }}>
                      Technical Strengths
                    </h3>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {profileData.skills && profileData.skills.length > 0 ? (
                      profileData.skills.map((skillObj: any, index: number) => (
                        <Tag key={`${skillObj.skill?.name || skillObj}-${index}`} size="md" type="blue">
                          {skillObj.skill?.name || skillObj}
                        </Tag>
                      ))
                    ) : (
                      <p style={{
                        color: 'var(--cds-text-secondary)',
                        fontSize: '0.875rem',
                        fontStyle: 'italic'
                      }}>
                        No skills listed - recommend skill assessment
                      </p>
                    )}
                  </div>
                </Tile>
              </Column>

              <Column lg={8} md={4} sm={2}>
                <Tile style={{ height: '100%', padding: '20px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                    <TrophyFilled size={20} style={{ color: 'var(--cds-support-success)' }} />
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--cds-text-primary)',
                      margin: 0
                    }}>
                      IBM Product Expertise
                    </h3>
                  </div>
                  <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px'
                  }}>
                    {profileData.products && profileData.products.length > 0 ? (
                      profileData.products.map((productObj: any, index: number) => (
                        <Tag key={`${productObj.product?.name || productObj}-${index}`} size="md" type="green">
                          {productObj.product?.name || productObj}
                        </Tag>
                      ))
                    ) : (
                      <p style={{
                        color: 'var(--cds-text-secondary)',
                        fontSize: '0.875rem',
                        fontStyle: 'italic'
                      }}>
                        No product expertise listed - training opportunity
                      </p>
                    )}
                  </div>
                </Tile>
              </Column>
            </Grid>

            {/* Experience & Interests */}
            <Grid style={{ marginBottom: '24px' }}>
              {profileData.experience && (
                <Column lg={8} md={4} sm={2}>
                  <Tile style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--cds-text-primary)',
                      marginBottom: '12px'
                    }}>
                      Professional Experience
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--cds-text-primary)',
                      lineHeight: '1.5'
                    }}>
                      {profileData.experience}
                    </p>
                  </Tile>
                </Column>
              )}

              {profileData.interests && (
                <Column lg={8} md={4} sm={2}>
                  <Tile style={{ padding: '20px' }}>
                    <h3 style={{
                      fontSize: '0.875rem',
                      fontWeight: 600,
                      color: 'var(--cds-text-primary)',
                      marginBottom: '12px'
                    }}>
                      Career Interests
                    </h3>
                    <p style={{
                      fontSize: '0.875rem',
                      color: 'var(--cds-text-primary)',
                      lineHeight: '1.5'
                    }}>
                      {profileData.interests}
                    </p>
                  </Tile>
                </Column>
              )}
            </Grid>

            {/* Project Activity */}
            {projectStats && projectStats.total > 0 && (
              <Tile style={{ padding: '20px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <ChartLine size={20} style={{ color: 'var(--cds-support-info)' }} />
                  <h3 style={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    color: 'var(--cds-text-primary)',
                    margin: 0
                  }}>
                    Project Activity
                  </h3>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '16px' }}>
                  <div>
                    <div className="cds--label-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '4px' }}>
                      Total Projects
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--cds-text-primary)' }}>
                      {projectStats.total}
                    </div>
                  </div>
                  <div>
                    <div className="cds--label-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '4px' }}>
                      Completed
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--cds-support-success)' }}>
                      {projectStats.completed}
                    </div>
                  </div>
                  <div>
                    <div className="cds--label-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '4px' }}>
                      Active
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 300, color: 'var(--cds-support-info)' }}>
                      {projectStats.active}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="cds--label-01" style={{ color: 'var(--cds-text-secondary)', marginBottom: '8px' }}>
                    Completion Rate
                  </div>
                  <ProgressBar
                    value={projectStats.completionRate}
                    max={100}
                    label={`${projectStats.completionRate}%`}
                    helperText={`${projectStats.completed} of ${projectStats.total} projects completed`}
                  />
                </div>
              </Tile>
            )}

            {/* Recommendations */}
            <Tile style={{
              padding: '20px',
              backgroundColor: 'var(--cds-layer-accent-01)',
              border: '1px solid var(--cds-border-subtle-01)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                <WarningAlt size={20} style={{ color: 'var(--cds-support-warning)' }} />
                <h3 style={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: 'var(--cds-text-primary)',
                  margin: 0
                }}>
                  Leadership Recommendations
                </h3>
              </div>
              <ul style={{
                margin: 0,
                paddingLeft: '20px',
                fontSize: '0.875rem',
                color: 'var(--cds-text-primary)',
                lineHeight: '1.6'
              }}>
                {(!profileData.skills || profileData.skills.length === 0) && (
                  <li>Schedule skill assessment to identify technical capabilities</li>
                )}
                {(!profileData.products || profileData.products.length === 0) && (
                  <li>Assign IBM product training to build expertise</li>
                )}
                {projectStats && projectStats.completionRate < 70 && (
                  <li>Review project completion challenges and provide support</li>
                )}
                {performanceData?.performance_rating === 'high_performer' && (
                  <li>Consider for leadership opportunities or mentorship roles</li>
                )}
                {performanceData?.performance_rating === 'needs_improvement' && (
                  <li>Schedule 1:1 to discuss performance improvement plan</li>
                )}
                {!performanceData && (
                  <li>Complete performance review to establish baseline metrics</li>
                )}
              </ul>
            </Tile>
          </Column>
        </Grid>
      </ModalBody>
    </ComposedModal>
  );
}