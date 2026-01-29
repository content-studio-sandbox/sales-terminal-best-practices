// src/components/intern-view/MyCareerGraph.tsx
import { useEffect, useMemo, useRef, useState } from "react";
import { 
  InlineNotification, 
  Loading, 
  Tag, 
  Modal,
  SkeletonPlaceholder,
  Button
} from "@carbon/react";
import { ChevronDown, ChevronUp } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";

type UUID = string;

type Profile = {
  id: UUID;
  display_name: string | null;
  name: string | null;
  email: string | null;
  access_role: string | null;
  role_id: UUID | null;
  role_name?: string | null;
  interests: string[] | null;
  experience: string | null;
  weekly_availability: number | null;
  skills: string[];
  products: string[];
  totalProjectsInvolved: number;
};

type AmbitionNode = {
  id: string;
  name: string;
  projectIds: UUID[];
};

type ProjectNode = {
  id: UUID;
  name: string;
  description: string | null;
  deadline: string | null;
  created_at: string;
  status: string | null;
  ambition_id: UUID | null;
  ambition_name: string | null;
};

type GraphData = {
  profile: Profile;
  ambitions: AmbitionNode[];
  projects: ProjectNode[];
};

type Props = {
  userId: string;
  height?: number;
};

// IBM Carbon spacing scale (8px base)
const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

function safeInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "U";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  return (a + b).toUpperCase();
}

function hexPoints(cx: number, cy: number, r: number) {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 180) * (60 * i);
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    pts.push([x, y]);
  }
  return pts.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function MyCareerGraph({ userId, height = 640 }: Props) {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [data, setData] = useState<GraphData | null>(null);

  // Interaction states
  const [profileOpen, setProfileOpen] = useState(false);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [selectedAmbition, setSelectedAmbition] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  
  // Modal states for ambitions and projects
  const [ambitionModalOpen, setAmbitionModalOpen] = useState(false);
  const [viewingAmbition, setViewingAmbition] = useState<AmbitionNode | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [viewingProject, setViewingProject] = useState<ProjectNode | null>(null);
  
  // Cluster expansion state - tracks which ambitions have expanded clusters
  const [expandedClusters, setExpandedClusters] = useState<Set<string>>(new Set());

  const containerRef = useRef<HTMLDivElement | null>(null);
  const [width, setWidth] = useState(1200);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const ro = new ResizeObserver(() => {
      const w = el.getBoundingClientRect().width;
      setWidth(clamp(w, 800, 1600));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      if (!userId) {
        setErr("Missing user id");
        setLoading(false);
        return;
      }

      setLoading(true);
      setErr(null);

      try {
        const { data: userRow, error: userErr } = await supabase
          .from("users")
          .select("id, email, access_role, role_id, interests, name, display_name, experience, weekly_availability, roles(name)")
          .eq("id", userId)
          .single();

        if (userErr) throw userErr;

        const [{ data: skillRows, error: skillErr }, { data: productRows, error: productErr }] =
          await Promise.all([
            supabase
              .from("user_skills")
              .select("skill_id, skills(name)")
              .eq("user_id", userId),
            supabase
              .from("user_products")
              .select("product_id, products(name)")
              .eq("user_id", userId),
          ]);

        if (skillErr) throw skillErr;
        if (productErr) throw productErr;

        const skillNames =
          (skillRows ?? [])
            .map((r: any) => r?.skills?.name)
            .filter(Boolean)
            .map(String);

        const productNames =
          (productRows ?? [])
            .map((r: any) => r?.products?.name)
            .filter(Boolean)
            .map(String);

        const { data: staffRows, error: staffErr } = await supabase
          .from("project_staff")
          .select(
            `
            id,
            project_id,
            projects:project_id (
              id,
              name,
              description,
              deadline,
              created_at,
              status,
              ambition_id,
              ambition:ambitions ( id, name )
            )
          `
          )
          .eq("user_id", userId);

        if (staffErr) throw staffErr;

        const projects: ProjectNode[] =
          (staffRows ?? [])
            .map((r: any) => r?.projects)
            .filter(Boolean)
            .map((p: any) => ({
              id: String(p.id),
              name: String(p.name),
              description: p.description ?? null,
              deadline: p.deadline ?? null,
              created_at: p.created_at,
              status: p.status ?? null,
              ambition_id: p.ambition_id ?? null,
              ambition_name: p.ambition?.name ?? null,
            }));

        const uniqById = new Map<string, ProjectNode>();
        for (const p of projects) uniqById.set(p.id, p);
        const uniqProjects = Array.from(uniqById.values());

        const byAmbition = new Map<string, AmbitionNode>();
        for (const p of uniqProjects) {
          const key = p.ambition_id ?? "other";
          const name = p.ambition_name ?? "Other";
          const existing = byAmbition.get(key);
          if (!existing) {
            byAmbition.set(key, { id: key, name, projectIds: [p.id] });
          } else {
            existing.projectIds.push(p.id);
          }
        }

        const ambitions = Array.from(byAmbition.values()).sort((a, b) => {
          const d = b.projectIds.length - a.projectIds.length;
          if (d !== 0) return d;
          return a.name.localeCompare(b.name);
        });

        const profile: Profile = {
          id: String(userRow.id),
          display_name: userRow.display_name ?? null,
          name: userRow.name ?? null,
          email: userRow.email ?? null,
          access_role: userRow.access_role ?? null,
          role_id: userRow.role_id ?? null,
          role_name: (userRow as any)?.roles?.name ?? null,
          interests: (userRow.interests as any) ?? null,
          experience: userRow.experience ?? null,
          weekly_availability: userRow.weekly_availability ?? null,
          skills: skillNames,
          products: productNames,
          totalProjectsInvolved: uniqProjects.length,
        };

        if (!cancelled) {
          setData({ profile, ambitions, projects: uniqProjects });
        }
      } catch (e: any) {
        console.error("[MyCareerGraph] load error:", e);
        if (!cancelled) setErr(e?.message ?? String(e));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  const toggleCluster = (ambitionId: string) => {
    setExpandedClusters(prev => {
      const next = new Set(prev);
      if (next.has(ambitionId)) {
        next.delete(ambitionId);
      } else {
        next.add(ambitionId);
      }
      return next;
    });
  };

  const layout = useMemo(() => {
    if (!data) return null;

    const W = width;
    const H = height;
    const cx = W / 2;
    const cy = H / 2;

    // Carbon-compliant sizing (multiples of 8)
    const queenR = 88;
    const ambitionR = 64;
    const projectR = 48;
    const clusterHeadR = 52;

    const ambitions = data.ambitions || [];
    const A = ambitions.length;

    const ringR = clamp(240 + A * 8, 240, 360);

    const ambitionPos = ambitions.map((a, i) => {
      const angleDeg = -90 + (i * 360) / Math.max(1, A);
      const ang = (Math.PI / 180) * angleDeg;
      return {
        ambitionId: a.id,
        x: cx + ringR * Math.cos(ang),
        y: cy + ringR * Math.sin(ang),
      };
    });

    const posByAmbition = new Map<string, { x: number; y: number }>();
    ambitionPos.forEach((p) => posByAmbition.set(p.ambitionId, { x: p.x, y: p.y }));

    const projectsByAmb = new Map<string, ProjectNode[]>();
    for (const p of data.projects) {
      const key = p.ambition_id ?? "other";
      const arr = projectsByAmb.get(key) ?? [];
      arr.push(p);
      projectsByAmb.set(key, arr);
    }

    function deadlineKey(d: string | null) {
      if (!d) return -Infinity;
      const t = Date.parse(d);
      return Number.isFinite(t) ? t : -Infinity;
    }

    for (const [k, arr] of projectsByAmb.entries()) {
      arr.sort((p1, p2) => {
        const d = deadlineKey(p2.deadline) - deadlineKey(p1.deadline);
        if (d !== 0) return d;
        const c = Date.parse(p2.created_at) - Date.parse(p1.created_at);
        if (c !== 0) return c;
        return p1.name.localeCompare(p2.name);
      });
      projectsByAmb.set(k, arr);
    }

    const projectPos: Array<{ 
      projectId: string; 
      x: number; 
      y: number; 
      ambitionId: string;
      isClusterHead: boolean;
      clusterSize: number;
    }> = [];

    for (const a of ambitions) {
      const base = posByAmbition.get(a.id);
      if (!base) continue;

      const list = projectsByAmb.get(a.id) ?? [];
      const isExpanded = expandedClusters.has(a.id);
      
      const visibleProjects = isExpanded ? list : list.slice(0, 1);
      
      if (visibleProjects.length === 0) continue;

      const clusterHeadY = base.y + ambitionR + 90;
      
      if (visibleProjects.length === 1 && !isExpanded) {
        projectPos.push({
          projectId: visibleProjects[0].id,
          ambitionId: a.id,
          x: base.x,
          y: clusterHeadY,
          isClusterHead: true,
          clusterSize: list.length,
        });
      } else {
        const colCount = 3;
        const dx = projectR * 2.6;
        const dy = projectR * 2.4;
        const startX = base.x - dx * (colCount - 1) * 0.5;
        const startY = clusterHeadY;

        visibleProjects.forEach((p, idx) => {
          const col = idx % colCount;
          const row = Math.floor(idx / colCount);
          projectPos.push({
            projectId: p.id,
            ambitionId: a.id,
            x: startX + col * dx,
            y: startY + row * dy,
            isClusterHead: idx === 0,
            clusterSize: list.length,
          });
        });
      }
    }

    return {
      W,
      H,
      cx,
      cy,
      queenR,
      ambitionR,
      projectR,
      clusterHeadR,
      ambitionPos,
      projectPos,
      posByAmbition,
      projectsByAmb,
    };
  }, [data, width, height, expandedClusters]);

  if (loading) {
    return (
      <div style={{ 
        minHeight: height, 
        padding: SPACING.xl,
        background: "var(--cds-layer-01)",
        borderRadius: SPACING.sm,
        border: "1px solid var(--cds-border-subtle-01)"
      }}>
        <div style={{ height: height - 64 }}>
          <SkeletonPlaceholder />
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <InlineNotification
        kind="error"
        title="Failed to load career path"
        subtitle={err}
        lowContrast
        hideCloseButton={false}
      />
    );
  }

  if (!data || !layout) {
    return (
      <InlineNotification
        kind="warning"
        title="No career data available"
        subtitle="Your career path will appear here once you're assigned to projects."
        lowContrast
        hideCloseButton
      />
    );
  }

  const profileName = data.profile.display_name || data.profile.name || "User";
  const initials = safeInitials(profileName);
  const ambitionById = new Map((data.ambitions || []).map((a) => [a.id, a]));
  const projectById = new Map((data.projects || []).map((p) => [p.id, p]));

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      {/* Ambition Details Modal */}
      <Modal
        open={ambitionModalOpen}
        onRequestClose={() => {
          setAmbitionModalOpen(false);
          setViewingAmbition(null);
        }}
        modalHeading={viewingAmbition?.name || "Ambition Details"}
        modalLabel="Career Ambition"
        primaryButtonText="Close"
        onRequestSubmit={() => {
          setAmbitionModalOpen(false);
          setViewingAmbition(null);
        }}
        size="md"
      >
        {viewingAmbition && (
          <div style={{ padding: `${SPACING.md}px 0` }}>
            <div style={{
              padding: SPACING.md,
              background: "var(--cds-layer-02)",
              borderRadius: SPACING.sm,
              marginBottom: SPACING.md
            }}>
              <div style={{ 
                fontSize: "var(--cds-label-01-font-size)",
                color: "var(--cds-text-secondary)",
                marginBottom: SPACING.xs
              }}>
                Projects in this ambition
              </div>
              <div style={{ 
                fontSize: "var(--cds-productive-heading-04-font-size)",
                fontWeight: "var(--cds-productive-heading-04-font-weight)",
                color: "var(--cds-text-primary)"
              }}>
                {viewingAmbition.projectIds.length}
              </div>
            </div>
            
            <div style={{
              padding: SPACING.md,
              background: "var(--cds-layer-01)",
              border: "1px solid var(--cds-border-subtle-01)",
              borderRadius: SPACING.sm,
            }}>
              <div style={{ 
                fontSize: "var(--cds-label-01-font-size)",
                color: "var(--cds-text-secondary)",
                marginBottom: SPACING.sm,
                fontWeight: 600
              }}>
                Associated Projects
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: SPACING.sm }}>
                {viewingAmbition.projectIds.map(pid => {
                  const proj = projectById.get(pid);
                  return proj ? (
                    <div key={pid} style={{
                      padding: SPACING.sm,
                      background: "var(--cds-layer-02)",
                      borderRadius: SPACING.xs,
                      border: "1px solid var(--cds-border-subtle-01)"
                    }}>
                      <div style={{ 
                        fontSize: "var(--cds-body-short-01-font-size)",
                        fontWeight: 600,
                        color: "var(--cds-text-primary)",
                        marginBottom: SPACING.xs
                      }}>
                        {proj.name}
                      </div>
                      {proj.description && (
                        <div style={{ 
                          fontSize: "var(--cds-label-01-font-size)",
                          color: "var(--cds-text-secondary)"
                        }}>
                          {proj.description}
                        </div>
                      )}
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Project Details Modal */}
      <Modal
        open={projectModalOpen}
        onRequestClose={() => {
          setProjectModalOpen(false);
          setViewingProject(null);
        }}
        modalHeading={viewingProject?.name || "Project Details"}
        modalLabel="Project Information"
        primaryButtonText="Close"
        onRequestSubmit={() => {
          setProjectModalOpen(false);
          setViewingProject(null);
        }}
        size="md"
      >
        {viewingProject && (
          <div style={{ padding: `${SPACING.md}px 0` }}>
            <div style={{
              padding: SPACING.md,
              background: "var(--cds-layer-02)",
              borderRadius: SPACING.sm,
              marginBottom: SPACING.md
            }}>
              {viewingProject.description && (
                <p style={{ 
                  margin: `0 0 ${SPACING.md}px 0`,
                  fontSize: "var(--cds-body-short-01-font-size)",
                  color: "var(--cds-text-primary)"
                }}>
                  {viewingProject.description}
                </p>
              )}
              
              <div style={{ 
                display: "grid", 
                gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
                gap: SPACING.md 
              }}>
                {viewingProject.ambition_name && (
                  <div>
                    <div style={{ 
                      fontSize: "var(--cds-label-01-font-size)",
                      color: "var(--cds-text-secondary)",
                      marginBottom: SPACING.xs
                    }}>
                      Ambition
                    </div>
                    <Tag type="blue">{viewingProject.ambition_name}</Tag>
                  </div>
                )}
                
                {viewingProject.status && (
                  <div>
                    <div style={{ 
                      fontSize: "var(--cds-label-01-font-size)",
                      color: "var(--cds-text-secondary)",
                      marginBottom: SPACING.xs
                    }}>
                      Status
                    </div>
                    <Tag type="green">{viewingProject.status}</Tag>
                  </div>
                )}
                
                {viewingProject.deadline && (
                  <div>
                    <div style={{ 
                      fontSize: "var(--cds-label-01-font-size)",
                      color: "var(--cds-text-secondary)",
                      marginBottom: SPACING.xs
                    }}>
                      Deadline
                    </div>
                    <div style={{ 
                      fontSize: "var(--cds-body-short-01-font-size)",
                      color: "var(--cds-text-primary)"
                    }}>
                      {new Date(viewingProject.deadline).toLocaleDateString()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Profile Modal */}
      <Modal
        open={profileOpen}
        onRequestClose={() => setProfileOpen(false)}
        modalHeading={profileName}
        modalLabel="Career Profile"
        primaryButtonText="Close"
        onRequestSubmit={() => setProfileOpen(false)}
        size="lg"
      >
        <div style={{ 
          display: "grid", 
          gap: SPACING.lg,
          padding: `${SPACING.md}px 0`
        }}>
          <div style={{
            padding: SPACING.md,
            background: "var(--cds-layer-02)",
            borderRadius: SPACING.sm,
          }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: SPACING.md,
              marginBottom: SPACING.md
            }}>
              <div style={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "var(--cds-interactive)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 24,
                fontWeight: 600,
                color: "white"
              }}>
                {initials}
              </div>
              <div>
                <h4 style={{ 
                  margin: 0, 
                  fontSize: "var(--cds-productive-heading-03-font-size)",
                  fontWeight: "var(--cds-productive-heading-03-font-weight)",
                  color: "var(--cds-text-primary)"
                }}>
                  {profileName}
                </h4>
                <p style={{ 
                  margin: `${SPACING.xs}px 0 0 0`, 
                  fontSize: "var(--cds-body-short-01-font-size)",
                  color: "var(--cds-text-secondary)" 
                }}>
                  {data.profile.role_name || data.profile.access_role || "Role not set"}
                </p>
              </div>
            </div>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: SPACING.md 
            }}>
              <div>
                <div style={{ 
                  fontSize: "var(--cds-label-01-font-size)",
                  color: "var(--cds-text-secondary)",
                  marginBottom: SPACING.xs
                }}>
                  Projects Involved
                </div>
                <div style={{ 
                  fontSize: "var(--cds-productive-heading-04-font-size)",
                  fontWeight: "var(--cds-productive-heading-04-font-weight)",
                  color: "var(--cds-text-primary)"
                }}>
                  {data.profile.totalProjectsInvolved}
                </div>
              </div>
              
              {data.profile.weekly_availability && (
                <div>
                  <div style={{ 
                    fontSize: "var(--cds-label-01-font-size)",
                    color: "var(--cds-text-secondary)",
                    marginBottom: SPACING.xs
                  }}>
                    Weekly Availability
                  </div>
                  <div style={{ 
                    fontSize: "var(--cds-productive-heading-04-font-size)",
                    fontWeight: "var(--cds-productive-heading-04-font-weight)",
                    color: "var(--cds-text-primary)"
                  }}>
                    {data.profile.weekly_availability}h
                  </div>
                </div>
              )}
            </div>
          </div>

          <div style={{
            padding: SPACING.md,
            background: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle-01)",
            borderRadius: SPACING.sm,
          }}>
            <div style={{ 
              fontSize: "var(--cds-label-01-font-size)",
              color: "var(--cds-text-secondary)",
              marginBottom: SPACING.sm,
              fontWeight: 600
            }}>
              Skills
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: SPACING.sm }}>
              {data.profile.skills.length ? (
                data.profile.skills.map((s) => (
                  <Tag key={s} type="blue" size="md">{s}</Tag>
                ))
              ) : (
                <span style={{ 
                  fontSize: "var(--cds-body-short-01-font-size)",
                  color: "var(--cds-text-secondary)" 
                }}>
                  No skills listed
                </span>
              )}
            </div>
          </div>

          <div style={{
            padding: SPACING.md,
            background: "var(--cds-layer-01)",
            border: "1px solid var(--cds-border-subtle-01)",
            borderRadius: SPACING.sm,
          }}>
            <div style={{ 
              fontSize: "var(--cds-label-01-font-size)",
              color: "var(--cds-text-secondary)",
              marginBottom: SPACING.sm,
              fontWeight: 600
            }}>
              IBM Product Expertise
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: SPACING.sm }}>
              {data.profile.products.length ? (
                data.profile.products.map((p) => (
                  <Tag key={p} type="green" size="md">{p}</Tag>
                ))
              ) : (
                <span style={{ 
                  fontSize: "var(--cds-body-short-01-font-size)",
                  color: "var(--cds-text-secondary)" 
                }}>
                  No products listed
                </span>
              )}
            </div>
          </div>

          {data.profile.interests && data.profile.interests.length > 0 && (
            <div style={{
              padding: SPACING.md,
              background: "var(--cds-layer-01)",
              border: "1px solid var(--cds-border-subtle-01)",
              borderRadius: SPACING.sm,
            }}>
              <div style={{ 
                fontSize: "var(--cds-label-01-font-size)",
                color: "var(--cds-text-secondary)",
                marginBottom: SPACING.sm,
                fontWeight: 600
              }}>
                Career Interests
              </div>
              <p style={{ 
                margin: 0,
                fontSize: "var(--cds-body-short-01-font-size)",
                color: "var(--cds-text-primary)"
              }}>
                {data.profile.interests.join(" • ")}
              </p>
            </div>
          )}
        </div>
      </Modal>

      {/* Graph SVG */}
      <svg
        width="100%"
        height={layout.H}
        viewBox={`0 0 ${layout.W} ${layout.H}`}
        style={{
          display: "block",
          borderRadius: SPACING.sm,
          border: "1px solid var(--cds-border-subtle-01)",
          background: "#f4f4f4",
        }}
        role="img"
        aria-label="Career path visualization showing profile, ambitions, and project clusters"
      >
        <defs>
          <linearGradient id="profileGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: "#0f62fe", stopOpacity: 0.2 }} />
            <stop offset="100%" style={{ stopColor: "#0043ce", stopOpacity: 0.1 }} />
          </linearGradient>
          
          <filter id="dropShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3"/>
            <feOffset dx="0" dy="2" result="offsetblur"/>
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.2"/>
            </feComponentTransfer>
            <feMerge>
              <feMergeNode/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Edges: root -> ambitions */}
        {layout.ambitionPos.map((a) => (
          <line
            key={`edge-root-${a.ambitionId}`}
            x1={layout.cx}
            y1={layout.cy}
            x2={a.x}
            y2={a.y}
            stroke="var(--cds-border-strong-01)"
            strokeWidth={2}
            opacity={0.4}
          />
        ))}

        {/* Edges: ambitions -> projects */}
        {layout.projectPos.map((p) => {
          const ap = layout.posByAmbition.get(p.ambitionId);
          if (!ap) return null;
          const isHighlighted = selectedAmbition === p.ambitionId;
          return (
            <line
              key={`edge-${p.ambitionId}-${p.projectId}`}
              x1={ap.x}
              y1={ap.y}
              x2={p.x}
              y2={p.y}
              stroke="var(--cds-border-subtle-01)"
              strokeWidth={isHighlighted ? 2 : 1.5}
              opacity={isHighlighted ? 0.6 : 0.3}
            />
          );
        })}

        {/* Root (Profile) */}
        <g
          role="button"
          tabIndex={0}
          onClick={() => setProfileOpen(true)}
          onMouseEnter={() => setHoveredNode('profile')}
          onMouseLeave={() => setHoveredNode(null)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setProfileOpen(true);
            }
          }}
          style={{ cursor: "pointer" }}
          filter={hoveredNode === 'profile' ? "url(#dropShadow)" : undefined}
        >
          <polygon
            points={hexPoints(layout.cx, layout.cy, layout.queenR)}
            fill="url(#profileGradient)"
            stroke="#0f62fe"
            strokeWidth={hoveredNode === 'profile' ? 4 : 3}
          />
          
          <circle 
            cx={layout.cx} 
            cy={layout.cy - 16} 
            r={36} 
            fill="white"
            stroke="#0f62fe"
            strokeWidth={2}
          />
          <circle 
            cx={layout.cx} 
            cy={layout.cy - 16} 
            r={34} 
            fill="#0f62fe"
          />
          <text
            x={layout.cx}
            y={layout.cy - 8}
            textAnchor="middle"
            fontSize={20}
            fontWeight={600}
            fill="white"
            style={{ userSelect: "none" }}
          >
            {initials}
          </text>
          
          <text
            x={layout.cx}
            y={layout.cy + 40}
            textAnchor="middle"
            fontSize={13}
            fontWeight={600}
            fill="var(--cds-text-primary)"
            style={{ userSelect: "none" }}
          >
            {profileName.length > 16 ? `${profileName.slice(0, 16)}…` : profileName}
          </text>
          
          <title>Click to view {profileName}'s profile</title>
        </g>

        {/* Ambition nodes */}
        {layout.ambitionPos.map((p) => {
          const a = ambitionById.get(p.ambitionId);
          if (!a) return null;
          const label = a.name;
          const isHovered = hoveredNode === `amb-${p.ambitionId}`;
          const isSelected = selectedAmbition === p.ambitionId;
          
          return (
            <g 
              key={`amb-${p.ambitionId}`}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setHoveredNode(`amb-${p.ambitionId}`)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => {
                const ambition = ambitionById.get(p.ambitionId);
                if (ambition) {
                  setViewingAmbition(ambition);
                  setAmbitionModalOpen(true);
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  const ambition = ambitionById.get(p.ambitionId);
                  if (ambition) {
                    setViewingAmbition(ambition);
                    setAmbitionModalOpen(true);
                  }
                }
              }}
              style={{ cursor: "pointer" }}
              filter={isHovered ? "url(#dropShadow)" : undefined}
            >
              <defs>
                <linearGradient id={`ambGrad-${p.ambitionId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#0f62fe", stopOpacity: 0.15 }} />
                  <stop offset="100%" style={{ stopColor: "#0043ce", stopOpacity: 0.08 }} />
                </linearGradient>
              </defs>
              
              <polygon
                points={hexPoints(p.x, p.y, layout.ambitionR)}
                fill={isSelected ? "var(--cds-layer-accent-01)" : `url(#ambGrad-${p.ambitionId})`}
                stroke={isSelected ? "#0f62fe" : "#0f62fe"}
                strokeWidth={isSelected || isHovered ? 3 : 2}
              />
              
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fontSize="var(--cds-body-short-01-font-size)"
                fontWeight={600}
                fill="var(--cds-text-primary)"
                style={{ userSelect: "none" }}
              >
                {label.split(' ').reduce((lines: string[], word: string) => {
                  const lastLine = lines[lines.length - 1] || '';
                  const testLine = lastLine ? `${lastLine} ${word}` : word;
                  if (testLine.length > 12) {
                    lines.push(word);
                  } else {
                    lines[lines.length - 1] = testLine;
                  }
                  return lines;
                }, ['']).map((line: string, i: number) => (
                  <tspan key={i} x={p.x} dy={i === 0 ? 0 : 14}>
                    {line}
                  </tspan>
                ))}
              </text>
              
              <text
                x={p.x}
                y={p.y + 16}
                textAnchor="middle"
                fontSize="var(--cds-label-01-font-size)"
                fill="var(--cds-text-secondary)"
                style={{ userSelect: "none" }}
              >
                {a.projectIds.length} {a.projectIds.length === 1 ? "project" : "projects"}
              </text>
              
              <title>{label} - Click to view details</title>
            </g>
          );
        })}

        {/* Project nodes with cluster logic */}
        {layout.projectPos.map((p) => {
          const proj = projectById.get(p.projectId);
          if (!proj) return null;
          
          const isHovered = hoveredNode === `proj-${p.projectId}`;
          const isSelected = selectedProject === p.projectId;
          const isAmbitionSelected = selectedAmbition === p.ambitionId;
          const shouldHighlight = isSelected || isAmbitionSelected;
          const shouldDim = selectedAmbition && !isAmbitionSelected;
          const isExpanded = expandedClusters.has(p.ambitionId);
          const hasMoreProjects = p.clusterSize > 1;

          const nodeRadius = p.isClusterHead && !isExpanded ? layout.clusterHeadR : layout.projectR;

          return (
            <g 
              key={`proj-${p.projectId}`}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setHoveredNode(`proj-${p.projectId}`)}
              onMouseLeave={() => setHoveredNode(null)}
              onClick={() => {
                if (p.isClusterHead && hasMoreProjects) {
                  toggleCluster(p.ambitionId);
                } else {
                  const project = projectById.get(p.projectId);
                  if (project) {
                    setViewingProject(project);
                    setProjectModalOpen(true);
                  }
                }
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  if (p.isClusterHead && hasMoreProjects) {
                    toggleCluster(p.ambitionId);
                  } else {
                    const project = projectById.get(p.projectId);
                    if (project) {
                      setViewingProject(project);
                      setProjectModalOpen(true);
                    }
                  }
                }
              }}
              style={{ cursor: "pointer" }}
              opacity={shouldDim ? 0.3 : 1}
              filter={isHovered && !shouldDim ? "url(#dropShadow)" : undefined}
            >
              <defs>
                <linearGradient id={`projGrad-${p.projectId}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style={{ stopColor: "#24a148", stopOpacity: 0.12 }} />
                  <stop offset="100%" style={{ stopColor: "#198038", stopOpacity: 0.06 }} />
                </linearGradient>
              </defs>
              
              <polygon
                points={hexPoints(p.x, p.y, nodeRadius)}
                fill={shouldHighlight ? "var(--cds-layer-accent-01)" : `url(#projGrad-${p.projectId})`}
                stroke={shouldHighlight ? "#24a148" : "#24a148"}
                strokeWidth={shouldHighlight || isHovered ? 2.5 : 2}
              />
              
              <text
                x={p.x}
                y={p.y + (p.isClusterHead && hasMoreProjects && !isExpanded ? -16 : -4)}
                textAnchor="middle"
                fontSize={11}
                fontWeight={600}
                fill="var(--cds-text-primary)"
                style={{ userSelect: "none" }}
              >
                {proj.name.split(' ').reduce((lines: string[], word: string) => {
                  const lastLine = lines[lines.length - 1] || '';
                  const testLine = lastLine ? `${lastLine} ${word}` : word;
                  if (testLine.length > 10) {
                    lines.push(word);
                  } else {
                    lines[lines.length - 1] = testLine;
                  }
                  return lines;
                }, ['']).map((line: string, i: number) => (
                  <tspan key={i} x={p.x} dy={i === 0 ? 0 : 12}>
                    {line}
                  </tspan>
                ))}
              </text>
              
              {/* Cluster badge */}
              {p.isClusterHead && hasMoreProjects && !isExpanded && (
                <>
                  <circle
                    cx={p.x}
                    cy={p.y + 18}
                    r={14}
                    fill="#0f62fe"
                  />
                  <text
                    x={p.x}
                    y={p.y + 23}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight={600}
                    fill="white"
                    style={{ userSelect: "none" }}
                  >
                    +{p.clusterSize - 1}
                  </text>
                </>
              )}
              
              <title>
                {proj.name}
                {p.isClusterHead && hasMoreProjects && !isExpanded ? `\nClick to expand ${p.clusterSize} projects` : "\nClick to view details"}
                {proj.ambition_name ? `\nAmbition: ${proj.ambition_name}` : ""}
                {proj.deadline ? `\nDeadline: ${new Date(proj.deadline).toLocaleDateString()}` : ""}
                {proj.status ? `\nStatus: ${proj.status}` : ""}
              </title>
            </g>
          );
        })}
      </svg>

      {/* Legend */}
      <div style={{ 
        marginTop: SPACING.md,
        padding: SPACING.md,
        background: "var(--cds-layer-01)",
        border: "1px solid var(--cds-border-subtle-01)",
        borderRadius: SPACING.sm,
        display: "flex",
        gap: SPACING.lg,
        flexWrap: "wrap",
        alignItems: "center"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: SPACING.sm }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon 
              points={hexPoints(12, 12, 10)} 
              fill="#0f62fe" 
              fillOpacity={0.2}
              stroke="#0f62fe" 
              strokeWidth={2}
            />
          </svg>
          <span style={{ 
            fontSize: "var(--cds-label-01-font-size)",
            color: "var(--cds-text-secondary)" 
          }}>
            <strong style={{ color: "var(--cds-text-primary)" }}>Profile</strong> - Root node
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: SPACING.sm }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon 
              points={hexPoints(12, 12, 10)} 
              fill="#0f62fe"
              fillOpacity={0.1}
              stroke="#0f62fe" 
              strokeWidth={2}
            />
          </svg>
          <span style={{ 
            fontSize: "var(--cds-label-01-font-size)",
            color: "var(--cds-text-secondary)" 
          }}>
            <strong style={{ color: "var(--cds-text-primary)" }}>Ambitions</strong> - Click to view
          </span>
        </div>
        
        <div style={{ display: "flex", alignItems: "center", gap: SPACING.sm }}>
          <svg width="24" height="24" viewBox="0 0 24 24">
            <polygon 
              points={hexPoints(12, 12, 10)} 
              fill="#24a148"
              fillOpacity={0.1}
              stroke="#24a148" 
              strokeWidth={2}
            />
            <circle cx="12" cy="16" r="4" fill="#0f62fe" />
            <text x="12" y="18" textAnchor="middle" fontSize="7" fontWeight="600" fill="white">+3</text>
          </svg>
          <span style={{ 
            fontSize: "var(--cds-label-01-font-size)",
            color: "var(--cds-text-secondary)" 
          }}>
            <strong style={{ color: "var(--cds-text-primary)" }}>Project Clusters</strong> - Click to expand/view
          </span>
        </div>
        
        <div style={{ 
          marginLeft: "auto", 
          fontSize: "var(--cds-helper-text-01-font-size)",
          color: "var(--cds-text-secondary)",
          fontStyle: "italic" 
        }}>
          Click nodes for details • Hover for info
        </div>
      </div>
    </div>
  );
}

// Made with Bob
