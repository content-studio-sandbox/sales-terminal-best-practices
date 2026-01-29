// src/components/leadership/LeadershipTab.tsx
import { useState, useEffect, useMemo } from "react";
import {
    Grid, Column,
    DataTable, TableContainer, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
    Button, TableToolbar, TableToolbarContent, TableToolbarSearch,
    Loading, ToastNotification, Dropdown, Tag,
    ComposedModal, ModalHeader, ModalBody, ModalFooter,   Toggle,
    FileUploaderDropContainer, FileUploaderItem, TextInput, TextArea, InlineLoading, Tile, ComboBox,
} from "@carbon/react";
import { View, Upload, DocumentPdf, ChartColumn } from "@carbon/icons-react";
import { supabase } from "@/integrations/supabase/client";
import KpiTile from "../carbon/KpiTile";
import ApplicantProfileModal from "./ApplicantProfileModal";
import { useAuth } from "@/hooks/useAuth";
import KpiMiniBar from "../mini/KpiMiniBar";
import ResumeLibraryModal from "./ResumeLibraryModal";
import MatchResumesModal from "./MatchResumesModal";
import ContentSkeleton from "../common/ContentSkeleton";
import { trackUserAction, trackBusinessMetric } from "@/hooks/useInstana";

/* ---------- configurable for your backend ---------- */
const RESUME_BUCKET = import.meta.env.VITE_RESUME_BUCKET ?? "resumes";
const RESUME_TABLE  = import.meta.env.VITE_RESUME_TABLE  ?? "candidate_resumes";
const FORCE_SIGNED  = String(import.meta.env.VITE_USE_SIGNED_UPLOAD ?? "0") === "1";
const WXP_BASE = (import.meta.env.VITE_WATSONX_PROXY_URL || "").replace(/\/$/, "");

/* --------------------------------------------------- */

interface LeadershipTabProps { user: any; }

type UserMetric = {
    id: string;
    display_name: string | null;
    email: string | null;
    access_role: string | null;
    created_at: string;
    managedProjects: number;
    contributedProjects: number;
    completedProjects: number;
    totalProjects: number;
    activeProjects: number;
    __demo__?: boolean;
};

type ResumeDraft = {
    file: File | null;
    candidateName: string;
    candidateRole: string;
    notes: string;
};
type AiMatch = {
    id: string;
    candidate_name: string | null;
    score: number;                 // 0..1
    why?: string;                  // optional explanation from AI
    matched_skills?: string[];     // optional (server may provide)
    missing_skills?: string[];     // optional (server may provide)
};

type ResumeRow = {
    id: string;
    user_id: string | null;
    candidate_name: string | null;
    role: string | null;
    notes: string | null;
    file_path: string;
    created_at: string;
    uploaded_by: string | null;
    users?: { id: string; email: string | null; display_name: string | null } | null;
};

export default function LeadershipTab({ user }: LeadershipTabProps) {
    const { useProxy } = useAuth(); // behind oauth2-proxy?

    const isAdmin = useMemo(
        () => ["leader", "manager"].includes(String(user?.access_role || "").toLowerCase()),
        [user?.access_role]
    );
    // KPI
    const [kpiData, setKpiData] = useState({ totalUsers: 0, totalProjects: 0, completedProjects: 0, activeProjects: 0 });
    const [extraKpis, setExtraKpis] = useState({
        highUtil: 0,
        resumesOnFile: 0,
        libraryCount: 0,
        invitesPending: 0,
        assignedUsers: 0,
        learningVerifiedPct: 0
    });

    // table + filters
    const [userMetrics, setUserMetrics] = useState<UserMetric[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState<string>("All roles");
    const [careerPathFilter, setCareerPathFilter] = useState<string>("All paths");
    const [learningStatusFilter, setLearningStatusFilter] = useState<string>("All");
    const [availabilityFilter, setAvailabilityFilter] = useState<string>("All");
    const [onlyHighUtil, setOnlyHighUtil] = useState(false);
    const [onlyWithResume, setOnlyWithResume] = useState(false);
    const [onlyBaselineLearning, setOnlyBaselineLearning] = useState(false);
    
    // Skill gaps toggle
    const [skillGapsScope, setSkillGapsScope] = useState<"open" | "all">("open");

    // details & projects
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [selectedProfile, setSelectedProfile] = useState<any>(null);
    const [notification, setNotification] = useState<any>(null);
    const [expandedUserId, setExpandedUserId] = useState<string | null>(null);
    const [userProjects, setUserProjects] = useState<Record<string, any[]>>({});

    // resumes state (per-user)
    const [resumesByUser, setResumesByUser] = useState<Record<string, ResumeRow[]>>({});
    const [resumePresence, setResumePresence] = useState<Record<string, boolean>>({});
    const [viewer, setViewer] = useState<{ open: boolean; url: string | null; name: string; }>({ open: false, url: null, name: "" });

    // upload modal (per-user)
    const [resumeUserId, setResumeUserId] = useState<string | null>(null);
    const [resumeOpen, setResumeOpen] = useState(false);
    const [resumeDraft, setResumeDraft] = useState<ResumeDraft>({ file: null, candidateName: "", candidateRole: "", notes: "" });

    // Resume Library modals
    const [importOpen, setImportOpen] = useState(false);
    const [importing, setImporting] = useState(false);
    const [importItems, setImportItems] = useState<{ file: File; name: string; status: "edit" | "uploading" | "complete" }[]>([]);
    const [matchOpen, setMatchOpen] = useState(false);
    const [jobText, setJobText] = useState("");
    const [matching, setMatching] = useState(false);
    const [matchResults, setMatchResults] = useState<AiMatch[]>([]);

    // Library: view + map
    const [libraryOpen, setLibraryOpen] = useState(false);
    const [libraryItems, setLibraryItems] = useState<ResumeRow[]>([]);
    const [libraryLoading, setLibraryLoading] = useState(false);
    const [librarySearch, setLibrarySearch] = useState("");
    const [libraryAssigned, setLibraryAssigned] = useState<"all" | "0" | "1">("all");
    const [useAi, setUseAi] = useState(false);

    const [mapOpen, setMapOpen] = useState(false);
    const [mapResumeId, setMapResumeId] = useState<string | null>(null);
    const [mapUsers, setMapUsers] = useState<Array<{ id: string; label: string; email: string }>>([]);
    const [mapSelected, setMapSelected] = useState<{ id: string; label: string; email: string } | null>(null);
    const [mapSaving, setMapSaving] = useState(false);
// If you already have a non-AI matcher, put its path here:
    const LEGACY_MATCH_ENDPOINT = "/api/match"; // <-- change if yours is different


    // Auto-demo on localhost
    const shouldAutoDemo = useMemo(
        () => typeof window !== "undefined" && window.location.hostname === "localhost",
        []
    );


    // ---------- Data ----------
    const fetchKpiData = async () => {
        try {
            const { count: totalUsers, error: usersError } = await supabase.from("users").select("*", { count: "exact", head: true });
            if (usersError) throw usersError;

            const { data: projects, error: projectsError } = await supabase.from("projects").select("status");
            if (projectsError) throw projectsError;

            const totalProjects = projects?.length || 0;
            const completedProjects = projects?.filter((p) => p.status === "complete").length || 0;
            const activeProjects = projects?.filter((p) => p.status === "in progress").length || 0;

            setKpiData({ totalUsers: totalUsers || 0, totalProjects, completedProjects, activeProjects });
        } catch (error: any) {
            setNotification({ kind: "error", title: "Error loading dashboard data", subtitle: error.message });
        }
    };

    const fetchLibraryCount = async () => {
        try {
            const r = await fetch("/api/resume-library?count=1", { credentials: "include" });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const j = await r.json();
            setExtraKpis((k) => ({ ...k, libraryCount: j.count || 0 }));
        } catch {
            /* ignore for local demo */
        }
    };

    const fetchNewKpis = async () => {
        try {
            // TODO: Once user_learning migration is applied, fetch real data:
            // SELECT COUNT(DISTINCT user_id) FROM user_learning WHERE verified_by IS NOT NULL
            // For now, use placeholder values
            setExtraKpis((k) => ({
                ...k,
                invitesPending: 5, // Placeholder - would need project_invitations table query
                assignedUsers: 12, // Placeholder - would need to count users with resumes
                learningVerifiedPct: 8 // Placeholder - would query user_learning table
            }));
        } catch (error) {
            console.error("Error fetching new KPIs:", error);
        }
    };

    const fetchResumePresenceForUsers = async (userIds: string[]) => {
        try {
            const { data, error } = await supabase.from(RESUME_TABLE).select("user_id").in("user_id", userIds);
            if (error) throw error;
            const present = new Set((data || []).map((r: any) => r.user_id));
            setResumePresence((prev) => {
                const next: Record<string, boolean> = { ...prev };
                userIds.forEach((id) => { next[id] = present.has(id); });
                return next;
            });
            setExtraKpis((k) => ({ ...k, resumesOnFile: present.size }));
        } catch {
            /* may be blocked by RLS */
        }
    };

    const fetchUserMetrics = async () => {
        try {
            const { data: users, error: usersError } = await supabase
                .from("users")
                .select(`id, display_name, email, access_role, created_at`);
            if (usersError) throw usersError;

            const userMetricsPromises =
                users?.map(async (u: any) => {
                    const { count: managedCount } = await supabase.from("projects").select("*", { count: "exact", head: true }).eq("pm_id", u.id);
                    const { count: contributedCount } = await supabase.from("project_staff").select("*", { count: "exact", head: true }).eq("user_id", u.id);
                    const { count: completedCount } = await supabase.from("projects").select("*", { count: "exact", head: true }).eq("pm_id", u.id).eq("status", "complete");

                    return {
                        ...u,
                        managedProjects: managedCount || 0,
                        contributedProjects: contributedCount || 0,
                        completedProjects: completedCount || 0,
                        totalProjects: (managedCount || 0) + (contributedCount || 0),
                        activeProjects: (managedCount || 0) + (contributedCount || 0) - (completedCount || 0),
                    } as UserMetric;
                }) || [];

            const resolved = await Promise.all(userMetricsPromises);

            if (shouldAutoDemo && resolved.length < 18) {
                const needed = 24 - resolved.length;
                const demoAdded = applyDemoRows(needed, resolved);
                setUserMetrics(demoAdded);
            } else {
                setUserMetrics(resolved);
            }

            setExtraKpis((k) => ({ ...k, highUtil: (resolved || []).filter((u) => calcUtil(u) >= 0.9).length }));
            fetchResumePresenceForUsers((resolved || []).map((u) => u.id));
            fetchLibraryCount();
        } catch (error: any) {
            setNotification({ kind: "error", title: "Error loading user metrics", subtitle: error.message });
        }
    };

    useEffect(() => {
        const run = async () => {
            setLoading(true);
            // Batch all data fetching in parallel for better performance
            await Promise.all([
                fetchKpiData(),
                fetchUserMetrics(),
                fetchNewKpis()
            ]);
            setLoading(false);
        };
        run();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function normalizeMatches(raw: any): AiMatch[] {
        if (!raw) return [];
        const list = Array.isArray(raw.matches) ? raw.matches : Array.isArray(raw) ? raw : [];
        return list
            .map((m: any) => ({
                id: String(m?.id || ""),
                candidate_name: m?.candidate_name ?? null,
                score: Math.max(0, Math.min(1, Number(m?.score ?? 0))),
                why: typeof m?.why === "string" ? m.why : undefined,
                matched_skills: Array.isArray(m?.matched_skills) ? m.matched_skills : undefined,
                missing_skills: Array.isArray(m?.missing_skills) ? m.missing_skills : undefined,
            }))
            .filter((m: AiMatch) => m.id);
    }

    async function runMatching(opts: {
        jobText: string;
        useAi: boolean;
        topK?: number;
        signal?: AbortSignal;
    }): Promise<AiMatch[]> {
        const { jobText, useAi, topK = 10, signal } = opts;
        const endpoint = useAi ? `${WXP_BASE}/api/match/watsonx` : `${WXP_BASE}/api/match`;

        const r = await fetch(endpoint, {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ jobText, topK }),
            signal,
        });

        if (!r.ok) {
            // Try to surface server error details (watsonx errors are useful)
            let detail = "";
            try { detail = (await r.json()).error || ""; } catch {}
            throw new Error(detail || `HTTP ${r.status}`);
        }

        const data = await r.json();
        return normalizeMatches(data);
    }

    /** Optional UI helper to pretty-print the “why” and skills (use in your render if desired) */
    function renderWhyLine(m: AiMatch): string {
        const parts: string[] = [];
        if (Array.isArray(m.matched_skills) && m.matched_skills.length) {
            parts.push(`matches: ${m.matched_skills.slice(0, 5).join(", ")}`);
        }
        if (Array.isArray(m.missing_skills) && m.missing_skills.length) {
            parts.push(`gaps: ${m.missing_skills.slice(0, 3).join(", ")}`);
        }
        if (m.why) parts.push(m.why);
        return parts.join(" • ");
    }

    // ---------- Demo helpers ----------
    function rand<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

    function applyDemoRows(count: number, existing: UserMetric[]) {
        const firstNames = ["Jordan","Taylor","Avery","Riley","Casey","Skyler","Morgan","Sam","Alex","Jamie","Cameron","Reese","Harper","Shawn","Micah","Peyton","Quinn","Rowan","Drew","Emerson","Noel","Kendall","Devin","Sage"];
        const lastNames  = ["Patel","Nguyen","Johnson","Garcia","Smith","Khan","Lee","Chen","Davis","Brown","Martinez","Wilson","Lopez","Anderson","Thomas","Hernandez","Moore","Martin","Jackson","Thompson","White","Lewis"];
        const roles = ["leader", "manager", "contributor", "intern", "user"];

        const demo: UserMetric[] = Array.from({ length: count }).map((_, i) => {
            const fn = rand(firstNames); const ln = rand(lastNames);
            const access_role = rand(roles);
            const managed = access_role === "leader" || access_role === "manager" ? Math.floor(Math.random() * 4) : 0;
            const contrib = Math.floor(Math.random() * (managed ? 5 : 8));
            const completed = Math.min(Math.floor(contrib / 2), contrib + managed);
            const total = managed + contrib;
            const active = Math.max(total - completed, 0);
            return {
                id: `demo-${Date.now()}-${i}`,
                display_name: `${fn} ${ln}`,
                email: `${fn}.${ln}@ibm.com`.toLowerCase(),
                access_role, created_at: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 90).toISOString(),
                managedProjects: managed, contributedProjects: contrib, completedProjects: completed,
                totalProjects: total, activeProjects: active, __demo__: true,
            };
        });

        const next = [...existing, ...demo];
        recalcTotals(next);
        return next;
    }

    function recalcTotals(list: UserMetric[]) {
        const totals = calcKpisFromUsers(list);
        setKpiData((k) => ({ ...k, ...totals }));
        setExtraKpis((k) => ({ ...k, highUtil: list.filter((u) => calcUtil(u) >= 0.9).length }));
    }

    function calcKpisFromUsers(list: UserMetric[]) {
        const totalUsers = list.length;
        const totalProjects = list.reduce((s, u) => s + (u.totalProjects || 0), 0);
        const completedProjects = list.reduce((s, u) => s + (u.completedProjects || 0), 0);
        const activeProjects = list.reduce((s, u) => s + (u.activeProjects || 0), 0);
        return { totalUsers, totalProjects, completedProjects, activeProjects };
    }

    // ---------- Resumes helpers ----------
    async function loadResumes(userId: string) {
        if (resumesByUser[userId]) return; // cached
        try {
            const r = await fetch(`/api/resumes?userId=${encodeURIComponent(userId)}`, { credentials: "include" });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const list: ResumeRow[] = await r.json();
            setResumesByUser((prev) => ({ ...prev, [userId]: list }));
            setResumePresence((prev) => ({ ...prev, [userId]: (list || []).length > 0 }));
            setExtraKpis((k) => {
                const had = resumePresence[userId] === true;
                const has = (list || []).length > 0;
                return had || !has ? k : { ...k, resumesOnFile: k.resumesOnFile + 1 };
            });
        } catch (e: any) {
            setNotification({ kind: "error", title: "Could not load resumes", subtitle: e.message });
        }
    }

    async function openResume(resumeId: string, name: string) {
        try {
            const r = await fetch(`/api/resumes/${encodeURIComponent(resumeId)}/url`, { credentials: "include" });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const { url } = await r.json();
            setViewer({ open: true, url, name });
        } catch (e: any) {
            setNotification({ kind: "error", title: "Could not open resume", subtitle: e.message });
        }
    }

    async function deleteResumeById(resumeId: string, after?: () => void) {
        try {
            const resp = await fetch(`/api/resumes/${encodeURIComponent(resumeId)}`, { method: "DELETE", credentials: "include" });
            if (!resp.ok) {
                const e = await resp.json().catch(() => ({}));
                throw new Error(e.error || `HTTP ${resp.status}`);
            }
            after?.();
            setNotification({ kind: "success", title: "Resume deleted", subtitle: "" });
        } catch (e: any) {
            setNotification({ kind: "error", title: "Delete failed", subtitle: e.message });
        } finally {
            // keep library KPI fresh
            fetchLibraryCount();
        }
    }

    // ---------- Library helpers ----------
    async function loadLibrary() {
        try {
            setLibraryLoading(true);
            const p = new URLSearchParams();
            if (libraryAssigned !== "all") p.set("assigned", libraryAssigned);
            if (librarySearch.trim()) p.set("q", librarySearch.trim());
            const r = await fetch(`/api/resume-library?${p.toString()}`, { credentials: "include" });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            const list: ResumeRow[] = await r.json();
            setLibraryItems(list);
        } catch (e: any) {
            setNotification({ kind: "error", title: "Could not load resume library", subtitle: e.message });
        } finally {
            setLibraryLoading(false);
        }
    }

    // Use row.id + this map to access the full ResumeRow inside Carbon's render cycle
    const safeLibraryItems: ResumeRow[] = Array.isArray(libraryItems)
        ? libraryItems.filter((x: any) => x && typeof x === "object" && x.id)
        : [];

    const libraryById = useMemo(() => {
        const m = new Map<string, ResumeRow>();
        for (const r of safeLibraryItems) m.set(r.id, r);
        return m;
    }, [safeLibraryItems]);

    async function openMap(resumeId: string, prefillEmail?: string | null) {
        setMapResumeId(resumeId);
        setMapSelected(null); // clear previous selection

        let items = mapUsers;
        if (items.length === 0) {
            const { data } = await supabase.from("users").select("id,display_name,email").limit(500);
            items = (data || []).map((u) => ({
                id: u.id,
                email: u.email || "",
                label: u.display_name ? `${u.display_name} <${u.email}>` : (u.email || ""),
            }));
            setMapUsers(items);
        }

        if (prefillEmail) {
            const found = items.find(
                (u) => (u.email || "").toLowerCase() === prefillEmail.toLowerCase()
            );
            if (found) setMapSelected(found);
        }

        setMapOpen(true);
    }

    async function assignResume() {
        if (!mapResumeId || !mapSelected) return;
        setMapSaving(true);
        try {
            const r = await fetch(`/api/resume-library/${encodeURIComponent(mapResumeId)}/assign`, {
                method: "PUT", credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userId: mapSelected.id }),
            });
            if (!r.ok) {
                const e = await r.json().catch(() => ({}));
                throw new Error(e.error || `HTTP ${r.status}`);
            }
            setMapOpen(false);
            await loadLibrary();
            fetchLibraryCount();
        } catch (e: any) {
            setNotification({ kind: "error", title: "Map failed", subtitle: e.message });
        } finally {
            setMapSaving(false);
        }
    }

    async function unassignResume(id: string) {
        try {
            const r = await fetch(`/api/resume-library/${encodeURIComponent(id)}/unassign`, {
                method: "PUT", credentials: "include",
            });
            if (!r.ok) throw new Error(`HTTP ${r.status}`);
            await loadLibrary();
            fetchLibraryCount();
        } catch (e: any) {
            setNotification({ kind: "error", title: "Unassign failed", subtitle: e.message });
        }
    }

    // ---------- Interactions ----------
    const handleViewUserDetails = async (userId: string) => {
        try {
            console.log('Opening profile modal for user:', userId);
            setSelectedProfile(null);
            setShowProfileModal(true);

            const demoRow = userMetrics.find((u) => u.id === userId && u.__demo__);
            if (demoRow) {
                console.log('Loading demo profile data');
                setSelectedProfile({
                    id: demoRow.id, display_name: demoRow.display_name, email: demoRow.email,
                    access_role: demoRow.access_role, interests: "Cloud, Data, AI",
                    experience: `${Math.floor(Math.random() * 6) + 1} years`,
                    skills: [{ skill: { name: "React" } }, { skill: { name: "Python" } }, { skill: { name: "SQL" } }],
                    products: [{ product: { name: "watsonx.ai" } }, { product: { name: "Cloud Pak for Data" } }],
                    created_at: demoRow.created_at,
                });
            } else {
                console.log('Loading real profile data from database');
                const { data, error } = await supabase
                    .from("users")
                    .select(`
            id, display_name, email, interests, experience, access_role, created_at,
            skills:user_skills!user_skills_user_id_fkey(skill:skills(name)),
            products:user_products(product:products(name))
          `)
                    .eq("id", userId).single();
                if (error) {
                    console.error('Error fetching user profile:', error);
                    throw error;
                }
                console.log('Profile data loaded:', data);
                setSelectedProfile(data);
            }

            await loadResumes(userId);
            console.log('Profile modal should now be visible');
        } catch (error: any) {
            console.error('Error in handleViewUserDetails:', error);
            setNotification({ kind: "error", title: "Error loading user details", subtitle: error.message });
            setShowProfileModal(false);
        }
    };

    const handleUserNameClick = async (userId: string) => {
        if (expandedUserId === userId) { setExpandedUserId(null); return; }
        try {
            setExpandedUserId(userId);

            if (!userProjects[userId]) {
                const demoRow = userMetrics.find((u) => u.id === userId && u.__demo__);
                if (demoRow) {
                    const pool = ["Migration to Cloud","Data Quality Initiative","AI Assistant POC","Ops Automation","Modernization Sprint","Security Hardening"];
                    const statuses = ["in progress","complete","on hold"];
                    const projects = Array.from({ length: Math.max(1, demoRow.totalProjects) }).map((_, i) => ({
                        id: `demo-proj-${userId}-${i}`,
                        name: `${pool[i % pool.length]} #${(i % 9) + 1}`,
                        status: statuses[i % statuses.length],
                        deadline: new Date(Date.now() + (i + 1) * 1000 * 60 * 60 * 24 * 21).toISOString(),
                        description: "Auto-generated demo project",
                        role: i < demoRow.managedProjects ? "Project Manager" : "Contributor",
                    }));
                    setUserProjects((prev) => ({ ...prev, [userId]: projects }));
                } else {
                    const [managedProjects, contributedProjects] = await Promise.all([
                        supabase.from("projects").select("id, name, status, deadline, description").eq("pm_id", userId),
                        supabase.from("project_staff").select(`
              id, project_role, projects:project_id ( id, name, status, deadline, description )
            `).eq("user_id", userId),
                    ]);
                    const projects = [
                        ...(managedProjects.data || []).map((p: any) => ({ ...p, role: "Project Manager" })),
                        ...(contributedProjects.data || []).map((item: any) => ({ ...item.projects, role: item.project_role })),
                    ];
                    setUserProjects((prev) => ({ ...prev, [userId]: projects }));
                }
            }

            await loadResumes(userId);
        } catch (error: any) {
            setNotification({ kind: "error", title: "Error loading project details", subtitle: error.message });
        }
    };

    // open upload modal for a specific user
    const openResumeModalFor = (userId: string, userName?: string | null) => {
        setResumeUserId(userId);
        setResumeDraft({ file: null, candidateName: userName || "", candidateRole: "", notes: "" });
        setResumeOpen(true);
    };

    // ---------- Filters ----------
    function calcUtil(u: UserMetric) {
        const t = Math.max(0, u.totalProjects || 0);
        if (t === 0) return 0;
        const v = Math.max(0, Math.min(1, (u.activeProjects || 0) / t));
        return v;
    }

    // Memoize filtered users to prevent unnecessary recalculations
    const filteredUsers = useMemo(() => {
        return userMetrics
            .filter((u) => {
                const matchesSearch =
                    !searchTerm ||
                    u.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    u.access_role?.toLowerCase().includes(searchTerm.toLowerCase());
                const matchesRole = roleFilter === "All roles" ? true : u.access_role === roleFilter;
                
                // Career path filter (placeholder - would need actual data)
                const matchesCareerPath = careerPathFilter === "All paths" ? true : true;
                
                // Learning status filter (placeholder - would need actual data)
                const matchesLearningStatus = learningStatusFilter === "All" ? true : true;
                
                // Availability filter (based on utilization)
                let matchesAvailability = true;
                if (availabilityFilter === "Available") {
                    matchesAvailability = calcUtil(u) < 0.9;
                } else if (availabilityFilter === "Busy") {
                    matchesAvailability = calcUtil(u) >= 0.9;
                }
                
                return matchesSearch && matchesRole && matchesCareerPath && matchesLearningStatus && matchesAvailability;
            })
            .filter((u) => (onlyHighUtil ? calcUtil(u) >= 0.9 : true))
            .filter((u) => (onlyWithResume ? resumePresence[u.id] === true : true))
            .filter((u) => (onlyBaselineLearning ? true : true)); // Placeholder for baseline learning check
    }, [userMetrics, searchTerm, roleFilter, careerPathFilter, learningStatusFilter, availabilityFilter, onlyHighUtil, onlyWithResume, onlyBaselineLearning, resumePresence]);

    // ---------- Table ----------
    const headers = [
        { key: "name", header: "Name" },
        { key: "email", header: "Email" },
        { key: "role", header: "Role" },
        { key: "totalProjects", header: "Total Projects" },
        { key: "completedProjects", header: "Completed" },
        { key: "activeProjects", header: "Active" },
        { key: "utilization", header: "Utilization" },
        { key: "performance", header: "Performance" },
        { key: "pipeline", header: "Pipeline Stage" },
        { key: "resume", header: "Resume" },
        { key: "actions", header: "Actions" },
    ];

    // Memoize table rows to prevent unnecessary re-renders
    const rows = useMemo(() => filteredUsers.map((u) => {
        // Check if user is a leader or manager (they shouldn't be rated)
        const isLeaderOrManager = ['leader', 'manager'].includes((u.access_role || '').toLowerCase());
        
        return {
            id: u.id,
            name: (
                <button
                    style={{ background: "none", border: "none", color: "var(--cds-link-primary)", cursor: "pointer", textDecoration: "underline", fontSize: "inherit", fontFamily: "inherit", padding: 0 }}
                    onClick={() => handleUserNameClick(u.id)}
                >
                    {u.display_name || "No name set"}
                </button>
            ),
            email: u.email,
            role: <Tag type="cool-gray" size="sm">{u.access_role || "user"}</Tag>,
            totalProjects: u.totalProjects,
            completedProjects: <span style={{ color: "var(--cds-support-success)" }}>{u.completedProjects}</span>,
            activeProjects: u.activeProjects,
            utilization: <UtilBar value={calcUtil(u)} />,
            performance: isLeaderOrManager ? (
                <span className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>N/A</span>
            ) : (
                <PerformanceRating userId={u.id} />
            ),
            pipeline: isLeaderOrManager ? (
                <span className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>N/A</span>
            ) : (
                <PipelineStage userId={u.id} />
            ),
            resume: resumePresence[u.id]
                ? <Tag size="sm" type="green" style={{ fontWeight: 500 }}>
                    <DocumentPdf style={{ marginRight: 4, verticalAlign: "middle" }} />
                    On file
                  </Tag>
                : <Tag size="sm" type="outline" style={{ color: "var(--cds-text-secondary)" }}>
                    None
                  </Tag>,
            actions: (
                <div style={{ display: "flex", gap: 6 }}>
                    <Button
                        kind="ghost" size="sm" renderIcon={View}
                        data-testid={`view-details-${u.id}`}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleViewUserDetails(u.id); }}
                        aria-label={`View details for ${u.display_name || u.email}`}
                    >
                        Details
                    </Button>
                    <Button
                        kind="ghost" size="sm" renderIcon={Upload}
                        onClick={(e) => { e.preventDefault(); e.stopPropagation(); openResumeModalFor(u.id, u.display_name); }}
                        aria-label={`Upload resume for ${u.display_name || u.email}`}
                    >
                        Upload
                    </Button>
                </div>
            ),
        };
    }), [filteredUsers, resumePresence]);

    // Enhanced loading state with fixed height to prevent layout shift
    if (loading) return (
        <Grid fullWidth style={{ padding: "2rem 0" }}>
            <Column lg={16} md={8} sm={4}>
                <ContentSkeleton type="dashboard" rows={8} height={700} />
            </Column>
        </Grid>
    );

    return (
        <>
            <Grid fullWidth style={{ padding: "2rem 0" }}>
                <Column lg={16} md={8} sm={4}>
                    {/* Enhanced Title Section */}
                    <div style={{
                        marginBottom: "3rem",
                        paddingBottom: "1.5rem",
                        borderBottom: "1px solid var(--cds-border-subtle-01)"
                    }}>
                        <h1 style={{
                            fontSize: "2.5rem",
                            fontWeight: 300,
                            color: "var(--cds-text-primary)",
                            marginBottom: "0.5rem",
                            letterSpacing: "-0.02em"
                        }}>
                            Leadership Dashboard
                        </h1>
                        <p style={{
                            fontSize: "1rem",
                            color: "var(--cds-text-secondary)",
                            maxWidth: "600px"
                        }}>
                            Monitor organizational performance, track team utilization, and manage talent across all projects.
                        </p>
                    </div>

                    {/* Primary KPI Section - Enhanced */}
                    <div style={{ marginBottom: "2.5rem" }}>
                        <h3 style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "var(--cds-text-secondary)",
                            marginBottom: "1rem"
                        }}>
                            Key Metrics
                        </h3>
                        <KpiTile data={kpiData} />
                    </div>

                    {/* Team Insights - Enhanced */}
                    <div style={{ marginBottom: "3rem" }}>
                        <h3 style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "var(--cds-text-secondary)",
                            marginBottom: "1.5rem"
                        }}>
                            Team Insights
                        </h3>
                        <div style={{
                            display: "grid",
                            gap: "1.5rem",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
                        }}>
                            <Tile style={{
                                padding: "1.5rem",
                                backgroundColor: "var(--cds-layer-01)",
                                border: "1px solid var(--cds-border-subtle-01)"
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <div className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>
                                        Invites Pending
                                    </div>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                                        <div style={{ fontSize: "2.5rem", fontWeight: 300, lineHeight: 1 }}>
                                            {extraKpis.invitesPending}
                                        </div>
                                        <div className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>
                                            awaiting response
                                        </div>
                                    </div>
                                </div>
                            </Tile>
                            <Tile style={{
                                padding: "1.5rem",
                                backgroundColor: "var(--cds-layer-01)",
                                border: "1px solid var(--cds-border-subtle-01)"
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <div className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>
                                        Assigned Users
                                    </div>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                                        <div style={{ fontSize: "2.5rem", fontWeight: 300, lineHeight: 1 }}>
                                            {extraKpis.assignedUsers}
                                        </div>
                                        <div className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>
                                            with resumes
                                        </div>
                                    </div>
                                </div>
                            </Tile>
                            <Tile style={{
                                padding: "1.5rem",
                                backgroundColor: "var(--cds-layer-01)",
                                border: "1px solid var(--cds-border-subtle-01)"
                            }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                                    <div className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>
                                        Learning Verified
                                    </div>
                                    <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                                        <div style={{ fontSize: "2.5rem", fontWeight: 300, lineHeight: 1 }}>
                                            {extraKpis.learningVerifiedPct}
                                        </div>
                                        <div className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>
                                            users verified
                                        </div>
                                    </div>
                                </div>
                            </Tile>
                        </div>
                    </div>

                    {/* Analytics Section - Enhanced */}
                    <div style={{ marginBottom: "3rem" }}>
                        <h3 style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "var(--cds-text-secondary)",
                            marginBottom: "1.5rem"
                        }}>
                            Project Analytics
                        </h3>
                        <div style={{
                            display: "grid",
                            gap: "1.5rem",
                            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))"
                        }}>
                            <KpiMiniBar title="Projects by Ambition" endpoint="/api/metrics/ambition-summary" />
                            <div style={{
                                padding: "1rem",
                                backgroundColor: "var(--cds-layer-01)",
                                border: "1px solid var(--cds-border-subtle-01)"
                            }}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                                    <h4 className="cds--label-01" style={{ color: "var(--cds-text-secondary)", margin: 0 }}>Top Skill Gaps</h4>
                                    <Toggle
                                        id="skill-gaps-toggle"
                                        size="sm"
                                        labelText=""
                                        labelA="All"
                                        labelB="Open"
                                        toggled={skillGapsScope === "open"}
                                        onToggle={(checked: boolean) => setSkillGapsScope(checked ? "open" : "all")}
                                    />
                                </div>
                                <KpiMiniBar
                                    title=""
                                    endpoint={`/api/metrics/top-skill-gaps?scope=${skillGapsScope}`}
                                    valueSuffix=" need"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Compliance & Resources - Combined and Enhanced */}
                    <div style={{ marginBottom: "3rem" }}>
                        <h3 style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "var(--cds-text-secondary)",
                            marginBottom: "1.5rem"
                        }}>
                            Compliance & Resources
                        </h3>
                        <div style={{
                            display: "grid",
                            gap: "1.5rem",
                            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
                        }}>
                            <ComplianceCard
                                label="Has Resume"
                                value={extraKpis.resumesOnFile}
                                total={kpiData.totalUsers}
                                onClick={() => setOnlyWithResume(true)}
                            />
                            <ComplianceCard
                                label="Has Verified Learning"
                                value={extraKpis.learningVerifiedPct}
                                total={kpiData.totalUsers}
                                onClick={() => setOnlyBaselineLearning(true)}
                            />
                            <ComplianceCard
                                label="High Utilization (≥90%)"
                                value={extraKpis.highUtil}
                                total={kpiData.totalUsers}
                                onClick={() => setOnlyHighUtil(true)}
                            />
                        </div>
                    </div>

                    {/* Table + toolbar */}
                    <div style={{ marginTop: "3rem" }}>
                        <h3 style={{
                            fontSize: "0.875rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                            letterSpacing: "0.05em",
                            color: "var(--cds-text-secondary)",
                            marginBottom: "1rem"
                        }}>
                            User Performance
                        </h3>

                        <DataTable rows={rows as any} headers={headers}>
                            {({
                                  rows: tableRows,
                                  headers: tableHeaders,
                                  getTableProps,
                                  getHeaderProps,
                                  getRowProps,
                                  getTableContainerProps,
                              }) => (
                                <TableContainer
                                    title="User Project Metrics"
                                    description="Track user engagement and project participation across the organization"
                                    {...getTableContainerProps()}
                                    style={{
                                        backgroundColor: "var(--cds-layer-01)",
                                        border: "1px solid var(--cds-border-subtle-01)"
                                    }}
                                >
                                    <TableToolbar>
                                        <TableToolbarContent style={{
                                            justifyContent: "flex-start",
                                            overflow: "visible"
                                        }}>
                                            <TableToolbarSearch
                                                placeholder="Search by name, email, or role"
                                                onChange={(e: any) => {
                                                    if (typeof e === "object" && e.target) setSearchTerm(e.target.value);
                                                }}
                                                value={searchTerm}
                                                style={{ maxWidth: "300px" }}
                                            />
                                            
                                            <Dropdown
                                                id="role-filter"
                                                titleText=""
                                                label="All roles"
                                                size="sm"
                                                items={["All roles", "leader", "manager", "contributor", "intern", "user"]}
                                                selectedItem={roleFilter}
                                                onChange={(e: any) => setRoleFilter(e.selectedItem)}
                                            />
                                            <Dropdown
                                                id="availability-filter"
                                                titleText=""
                                                label="All"
                                                size="sm"
                                                items={["All", "Available", "Busy"]}
                                                selectedItem={availabilityFilter}
                                                onChange={(e: any) => setAvailabilityFilter(e.selectedItem)}
                                            />
                                            
                                            <Button
                                                kind={onlyWithResume ? "primary" : "ghost"}
                                                size="sm"
                                                onClick={() => setOnlyWithResume((v) => !v)}
                                            >
                                                Has resume
                                            </Button>
                                            <Button
                                                kind={onlyHighUtil ? "primary" : "ghost"}
                                                size="sm"
                                                onClick={() => setOnlyHighUtil((v) => !v)}
                                            >
                                                High util
                                            </Button>
                                            
                                            {(searchTerm || roleFilter !== "All roles" || availabilityFilter !== "All" || onlyHighUtil || onlyWithResume) && (
                                                <Button
                                                    kind="ghost"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSearchTerm("");
                                                        setRoleFilter("All roles");
                                                        setCareerPathFilter("All paths");
                                                        setLearningStatusFilter("All");
                                                        setAvailabilityFilter("All");
                                                        setOnlyHighUtil(false);
                                                        setOnlyWithResume(false);
                                                        setOnlyBaselineLearning(false);
                                                    }}
                                                >
                                                    Clear
                                                </Button>
                                            )}

                                            {/* Library actions */}
                                            {isAdmin && (
                                                <>
                                                    <Button
                                                        kind="ghost"
                                                        size="sm"
                                                        onClick={async () => {
                                                            setLibraryOpen(true);
                                                            await loadLibrary();
                                                        }}
                                                    >
                                                        View library
                                                    </Button>
                                                    <Button
                                                        kind="primary"
                                                        size="sm"
                                                        onClick={() => setImportOpen(true)}
                                                        style={{ minHeight: "32px", maxHeight: "32px" }}
                                                    >
                                                        Import
                                                    </Button>
                                                    <Button
                                                        kind="tertiary"
                                                        size="sm"
                                                        onClick={() => setMatchOpen(true)}
                                                        style={{ minHeight: "32px", maxHeight: "32px" }}
                                                    >
                                                        Match
                                                    </Button>
                                                </>
                                            )}
                                        </TableToolbarContent>
                                    </TableToolbar>

                                    <Table {...getTableProps()}>
                                        <TableHead>
                                            <TableRow style={{
                                                height: "3rem",
                                                backgroundColor: "var(--cds-layer-02)",
                                                borderBottom: "2px solid var(--cds-border-strong-01)"
                                            }}>
                                                {tableHeaders.map((header) => {
                                                    const { key, ...headerProps } = getHeaderProps({ header });
                                                    return (
                                                        <TableHeader
                                                            key={header.key}
                                                            {...headerProps}
                                                            style={{
                                                                padding: "1rem",
                                                                fontWeight: 600,
                                                                fontSize: "0.75rem",
                                                                verticalAlign: "middle",
                                                                color: "var(--cds-text-primary)",
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.02em"
                                                            }}
                                                        >
                                                            {header.header}
                                                        </TableHeader>
                                                    );
                                                })}
                                            </TableRow>
                                        </TableHead>

                                        <TableBody>
                                            {tableRows.length === 0 ? (
                                                <TableRow>
                                                    <TableCell colSpan={tableHeaders.length} style={{ textAlign: "center", padding: "64px 0" }}>
                                                        <p className="cds--body-long-01" style={{ color: "var(--cds-text-secondary)" }}>
                                                            {searchTerm ? "No users found matching your search." : "No user data available."}
                                                        </p>
                                                    </TableCell>
                                                </TableRow>
                                            ) : (
                                                tableRows.map((row) => {
                                                    const { key, ...rowProps } = getRowProps({ row });
                                                    return (
                                                        <>
                                                            {/* main row */}
                                                            <TableRow
                                                                key={row.id}
                                                                {...rowProps}
                                                                style={{ height: "3.5rem" }}
                                                            >
                                                                {row.cells.map((cell) => (
                                                                    <TableCell
                                                                        key={cell.id}
                                                                        style={{
                                                                            padding: "1rem",
                                                                            verticalAlign: "middle"
                                                                        }}
                                                                    >
                                                                        {cell.value}
                                                                    </TableCell>
                                                                ))}
                                                            </TableRow>

                                                        {/* expanded row */}
                                                        {expandedUserId === row.id && (
                                                            <TableRow key={`${row.id}-expanded`}>
                                                                <TableCell
                                                                    colSpan={tableHeaders.length}
                                                                    style={{ padding: 24, backgroundColor: "var(--cds-layer-01)" }}
                                                                >
                                                                    {/* Projects */}
                                                                    <div style={{ marginBottom: 16 }}>
                                                                        <h4 className="cds--productive-heading-02" style={{ marginBottom: 16 }}>
                                                                            Project Details
                                                                        </h4>
                                                                        {userProjects[row.id] && userProjects[row.id].length > 0 ? (
                                                                            <div
                                                                                style={{
                                                                                    display: "grid",
                                                                                    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
                                                                                    gap: 16,
                                                                                }}
                                                                            >
                                                                                {userProjects[row.id].map((project) => (
                                                                                    <div
                                                                                        key={project.id}
                                                                                        style={{
                                                                                            padding: 16,
                                                                                            border: "1px solid var(--cds-border-subtle-01)",
                                                                                            borderRadius: 8,
                                                                                            backgroundColor: "var(--cds-background)",
                                                                                        }}
                                                                                    >
                                                                                        <div
                                                                                            style={{
                                                                                                display: "flex",
                                                                                                justifyContent: "space-between",
                                                                                                alignItems: "flex-start",
                                                                                                marginBottom: 8,
                                                                                            }}
                                                                                        >
                                                                                            <h5 className="cds--productive-heading-01" style={{ margin: 0 }}>
                                                                                                {project.name}
                                                                                            </h5>
                                                                                            <span
                                                                                                style={{
                                                                                                    padding: "4px 8px",
                                                                                                    borderRadius: 4,
                                                                                                    fontSize: 12,
                                                                                                    fontWeight: 500,
                                                                                                    backgroundColor: statusColorToken(project.status),
                                                                                                    color: "var(--cds-background)",
                                                                                                }}
                                                                                            >
                                                {formatStatus(project.status)}
                                              </span>
                                                                                        </div>
                                                                                        <p className="cds--label-01" style={{ color: "var(--cds-text-secondary)", margin: "8px 0" }}>
                                                                                            Role: {project.role}
                                                                                        </p>
                                                                                        {project.deadline && (
                                                                                            <p className="cds--label-01" style={{ color: "var(--cds-text-secondary)", margin: 0 }}>
                                                                                                Deadline: {new Date(project.deadline).toLocaleDateString()}
                                                                                            </p>
                                                                                        )}
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="cds--body-long-01" style={{ color: "var(--cds-text-secondary)", fontStyle: "italic" }}>
                                                                                No projects found for this user.
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    {/* Resumes */}
                                                                    <div style={{ marginTop: 24 }}>
                                                                        <h4 className="cds--productive-heading-02" style={{ marginBottom: 12 }}>
                                                                            Resumes
                                                                        </h4>
                                                                        {resumesByUser[row.id] && resumesByUser[row.id].length > 0 ? (
                                                                            <div
                                                                                style={{
                                                                                    display: "grid",
                                                                                    gridTemplateColumns: "1fr auto auto auto",
                                                                                    gap: 8,
                                                                                    alignItems: "center",
                                                                                }}
                                                                            >
                                                                                {resumesByUser[row.id].map((r) => (
                                                                                    <div key={r.id} style={{ display: "contents" }}>
                                                                                        <div>
                                                                                            <div className="cds--label-01" style={{ fontWeight: 600 }}>
                                                                                                {r.candidate_name || "Candidate"}
                                                                                                {r.role ? ` — ${r.role}` : ""}
                                                                                            </div>
                                                                                            <div className="cds--helper-text-01" style={{ color: "var(--cds-text-secondary)" }}>
                                                                                                {new Date(r.created_at).toLocaleString()}
                                                                                                {r.notes ? ` · ${r.notes}` : ""}
                                                                                            </div>
                                                                                        </div>
                                                                                        <Button kind="ghost" size="sm" onClick={() => openResume(r.id, r.candidate_name || "Resume")}>
                                                                                            View
                                                                                        </Button>
                                                                                        <Button
                                                                                            kind="ghost"
                                                                                            size="sm"
                                                                                            onClick={async () => {
                                                                                                const resp = await fetch(`/api/resumes/${encodeURIComponent(r.id)}/url`, { credentials: "include" });
                                                                                                if (!resp.ok) {
                                                                                                    setNotification({ kind: "error", title: "Could not open resume", subtitle: `HTTP ${resp.status}` });
                                                                                                    return;
                                                                                                }
                                                                                                const { url } = await resp.json();
                                                                                                window.open(url, "_blank", "noopener,noreferrer");
                                                                                            }}
                                                                                        >
                                                                                            Open in new tab
                                                                                        </Button>
                                                                                        <Button
                                                                                            kind="danger--ghost"
                                                                                            size="sm"
                                                                                            onClick={() => {
                                                                                                if (!window.confirm("Delete this resume? This cannot be undone.")) return;
                                                                                                deleteResumeById(r.id, async () => {
                                                                                                    // refresh this user's list & presence
                                                                                                    setResumesByUser((prev) => {
                                                                                                        const copy = { ...prev };
                                                                                                        copy[row.id] = (copy[row.id] || []).filter((x) => x.id !== r.id);
                                                                                                        return copy;
                                                                                                    });
                                                                                                    const left = (resumesByUser[row.id] || []).filter((x) => x.id !== r.id).length;
                                                                                                    setResumePresence((prev) => ({ ...prev, [row.id]: left > 0 }));
                                                                                                });
                                                                                            }}
                                                                                        >
                                                                                            Delete
                                                                                        </Button>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <p className="cds--body-long-01" style={{ color: "var(--cds-text-secondary)", fontStyle: "italic" }}>
                                                                                No resumes uploaded.
                                                                            </p>
                                                                        )}
                                                                    </div>

                                                                    <Button kind="secondary" size="sm" style={{ marginTop: 16 }} onClick={() => setExpandedUserId(null)}>
                                                                        Hide details
                                                                    </Button>
                                                                </TableCell>
                                                            </TableRow>
                                                        )}
                                                       </>
                                                   );
                                               })
                                            )}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </DataTable>
                    </div>
                </Column>
            </Grid>

            {/* Profile Modal */}
            <ApplicantProfileModal
                open={showProfileModal}
                onOpenChange={(open) => { setShowProfileModal(open); if (!open) setSelectedProfile(null); }}
                profileData={selectedProfile}
            />

            {/* Import Resumes (Library) */}
            <ComposedModal open={importOpen} onClose={() => setImportOpen(false)} size="lg">
                <ModalHeader title="Import resumes to library" />
                <ModalBody hasForm>
                    <p className="cds--helper-text-01" style={{ marginBottom: 8 }}>
                        Drop multiple .pdf / .docx files. They’ll be stored as <em>unassigned</em> candidates (not tied to a w3 user).
                    </p>
                    <FileUploaderDropContainer
                        accept={[".pdf", ".docx", ".txt"]} multiple
                        onAddFiles={(e: any) => {
                            const files: File[] = Array.from(e?.target?.files || e?.dataTransfer?.files || []);
                            if (!files.length) return;
                            const items = files.map((f) => ({ file: f, name: f.name, status: "edit" as const }));
                            setImportItems((prev) => [...prev, ...items]);
                        }}
                        labelText="Drag and drop resumes here or click to upload"
                    />
                    <div style={{ marginTop: 8 }}>
                        {importItems.map((it, idx) => (
                            <FileUploaderItem
                                key={`${it.name}-${idx}`}
                                name={it.name}
                                status={it.status}
                                onDelete={() => setImportItems((prev) => prev.filter((p, i) => i !== idx))}
                            />
                        ))}
                    </div>
                </ModalBody>
                <ModalFooter
                    primaryButtonText={importing ? "Importing…" : "Import"}
                    secondaryButtonText="Cancel"
                    primaryButtonDisabled={importing || importItems.length === 0}
                    onRequestClose={() => setImportOpen(false)}
                    onRequestSubmit={async () => {
                        if (!importItems.length) return;
                        setImporting(true);
                        try {
                            // ask server for signed uploads
                            const meta = importItems.map((it) => {
                                const ext = (it.file.name.split(".").pop() || "pdf").toLowerCase();
                                const guess = it.file.name.replace(/\.[^.]+$/, "").replace(/[_-]+/g, " ").trim();
                                return { name: it.file.name, fileExt: ext, candidateName: guess };
                            });
                            const r = await fetch("/api/resume-library/import", {
                                method: "POST", credentials: "include",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ files: meta }),
                            });
                            if (!r.ok) {
                                const e = await r.json().catch(() => ({}));
                                throw new Error(e.error || `HTTP ${r.status}`);
                            }
                            const { uploads } = await r.json(); // [{filePath, token, resumeId}]
                            // push each file to its signed URL
                            for (let i = 0; i < uploads.length; i++) {
                                const tokenEntry = uploads[i];
                                const file = importItems[i].file;
                                setImportItems((prev) => prev.map((p, idx) => idx === i ? { ...p, status: "uploading" } : p));
                                const { error } = await supabase.storage.from(RESUME_BUCKET).uploadToSignedUrl(tokenEntry.filePath, tokenEntry.token, file);
                                if (error) throw error;
                                setImportItems((prev) => prev.map((p, idx) => idx === i ? { ...p, status: "complete" } : p));
                            }
                            setNotification({ kind: "success", title: "Resumes imported", subtitle: `${uploads.length} files added to library.` });
                            setImportItems([]);
                            setImportOpen(false);
                            fetchLibraryCount();
                        } catch (e: any) {
                            setNotification({ kind: "error", title: "Import failed", subtitle: e.message });
                        } finally {
                            setImporting(false);
                        }
                    }}
                >
                    {importing && <InlineLoading description="Uploading…" />}
                </ModalFooter>
            </ComposedModal>

            {/* Match to Role (Library) - Redesigned */}
            <MatchResumesModal
                open={matchOpen}
                onClose={() => setMatchOpen(false)}
                jobText={jobText}
                setJobText={setJobText}
                useAi={useAi}
                setUseAi={setUseAi}
                matching={matching}
                matchResults={matchResults}
                onRunMatching={async () => {
                    setMatching(true);
                    const startTime = Date.now();
                    try {
                        const matches = await runMatching({ jobText, useAi, topK: 10 });
                        setMatchResults(matches);
                        
                        const duration = Date.now() - startTime;
                        
                        // Track resume matching event in Instana
                        trackUserAction('resume_matching_completed', {
                            use_ai: useAi,
                            job_text_length: jobText.length,
                            matches_found: matches.length,
                            duration_ms: duration,
                            top_k: 10,
                        });
                        
                        // Track business metric
                        trackBusinessMetric('resume_matches_performed', 1, 'count');
                        
                    } catch (e: any) {
                        setNotification({ kind: "error", title: "Matching failed", subtitle: e.message });
                        
                        // Track matching failure
                        trackUserAction('resume_matching_failed', {
                            use_ai: useAi,
                            error_message: e.message,
                            job_text_length: jobText.length,
                        });
                    } finally {
                        setMatching(false);
                    }
                }}
                onViewResume={openResume}
                onOpenApiSettings={() => {
                    setNotification({
                        kind: "info",
                        title: "Configure API Keys",
                        subtitle: "Please use the Settings menu in the header to configure your WatsonX.ai and Watson Orchestrate API keys."
                    });
                }}
            />

            {/* View Resumes (Library) - Redesigned */}
            <ResumeLibraryModal
                open={libraryOpen}
                onClose={() => setLibraryOpen(false)}
                libraryItems={libraryItems}
                libraryLoading={libraryLoading}
                librarySearch={librarySearch}
                setLibrarySearch={setLibrarySearch}
                libraryAssigned={libraryAssigned}
                setLibraryAssigned={setLibraryAssigned}
                loadLibrary={loadLibrary}
                openResume={openResume}
                openMap={openMap}
                unassignResume={unassignResume}
                deleteResumeById={deleteResumeById}
                fetchLibraryCount={fetchLibraryCount}
            />

            {/* Map resume -> user */}
            <ComposedModal open={mapOpen} onClose={() => setMapOpen(false)} size="sm">
                <ModalHeader title="Map resume to user" />
                <ModalBody hasForm>
                    <ComboBox
                        id="map-user"
                        titleText="Select user"
                        placeholder="Search users…"
                        items={mapUsers}
                        itemToString={(it: any) => it?.label || ""}
                        selectedItem={mapSelected as any}
                        onChange={(e: any) => setMapSelected(e.selectedItem || null)}
                    />
                </ModalBody>
                <ModalFooter
                    secondaryButtonText="Cancel"
                    primaryButtonText={mapSaving ? "Saving…" : "Save"}
                    primaryButtonDisabled={!mapSelected || mapSaving}
                    onRequestClose={() => setMapOpen(false)}
                    onRequestSubmit={assignResume}
                >
                    <></>
                </ModalFooter>
            </ComposedModal>

            {/* Upload Resume (per-user) */}
            <ResumeUploadModal
                open={resumeOpen}
                onClose={() => setResumeOpen(false)}
                draft={resumeDraft}
                setDraft={setResumeDraft}
                onSubmit={async () => {
                    if (!resumeUserId || !resumeDraft.file) {
                        setNotification({ kind: "error", title: "Missing information", subtitle: "Please attach a resume file." });
                        return;
                    }
                    try {
                        const ext = (resumeDraft.file.name.split(".").pop() || "pdf").toLowerCase();
                        const basePath = `${resumeUserId}/${Date.now()}_${slugify(resumeDraft.candidateName || "candidate")}`;
                        const fullPath = `${basePath}.${ext}`;

                        if (useProxy || FORCE_SIGNED) {
                            const r = await fetch("/api/resumes", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({
                                    userId: resumeUserId,
                                    candidateName: resumeDraft.candidateName,
                                    candidateRole: resumeDraft.candidateRole,
                                    notes: resumeDraft.notes,
                                    fileExt: ext,
                                }),
                            });
                            if (!r.ok) {
                                const e = await r.json().catch(() => ({}));
                                throw new Error(e.error || `Server sign failed (HTTP ${r.status})`);
                            }
                            const { filePath, token } = await r.json();
                            const { error: upErr } = await supabase.storage.from(RESUME_BUCKET).uploadToSignedUrl(filePath, token, resumeDraft.file);
                            if (upErr) throw upErr;
                        } else {
                            const { error: upErr } = await supabase.storage.from(RESUME_BUCKET).upload(fullPath, resumeDraft.file, {
                                cacheControl: "3600", upsert: false, contentType: resumeDraft.file.type || undefined,
                            });
                            if (upErr) throw upErr;

                            const { error: insErr } = await supabase.from(RESUME_TABLE).insert({
                                user_id: resumeUserId,
                                candidate_name: resumeDraft.candidateName || null,
                                role: resumeDraft.candidateRole || null,
                                notes: resumeDraft.notes || null,
                                file_path: fullPath,
                                uploaded_by: user?.id ?? null,
                            });
                            if (insErr) throw insErr;
                        }

                        // refresh list for that user
                        setResumesByUser((prev) => { const next = { ...prev }; delete next[resumeUserId]; return next; });
                        await loadResumes(resumeUserId);

                        setResumeOpen(false);
                        setNotification({ kind: "success", title: "Resume uploaded", subtitle: `${resumeDraft.candidateName || "Candidate"} resume saved.` });
                    } catch (e: any) {
                        setNotification({ kind: "error", title: "Upload failed", subtitle: e.message || "Could not upload resume." });
                    } finally {
                        fetchLibraryCount();
                    }
                }}
            />

            {/* Resume Viewer */}
            {viewer.open && (
                <ComposedModal open={viewer.open} onClose={() => setViewer({ open: false, url: null, name: "" })} size="lg">
                    <ModalHeader title={viewer.name} />
                    <ModalBody>
                        {viewer.url && viewer.url.toLowerCase().includes(".pdf") ? (
                            <iframe src={viewer.url} style={{ width: "100%", height: "70vh", border: 0 }} />
                        ) : viewer.url ? (
                            <div>
                                <p className="cds--body-long-01" style={{ marginBottom: 12 }}>
                                    Preview is available for PDFs. Use the button below to open or download this file.
                                </p>
                                <Button as="a" href={viewer.url} target="_blank" rel="noopener noreferrer">Open file</Button>
                            </div>
                        ) : (<p>Loading…</p>)}
                    </ModalBody>
                    <ModalFooter primaryButtonText="Close" onRequestSubmit={() => setViewer({ open: false, url: null, name: "" })}>
                        <></>
                    </ModalFooter>
                </ComposedModal>
            )}

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

/** ---- helpers ---- */
function statusColorToken(status?: string) {
    switch ((status || "").toLowerCase()) {
        case "active":
        case "in progress": return "var(--cds-support-info)";
        case "complete":    return "var(--cds-support-success)";
        case "on hold":     return "var(--cds-support-warning)";
        default:            return "var(--cds-text-secondary)";
    }
}

function formatStatus(status?: string) {
    if (!status) return "Not Started";
    return status.split(" ").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");
}

function UtilBar({ value }: { value: number }) {
    const pct = Math.max(0, Math.min(1, value));
    const pctStr = `${Math.round(pct * 100)}%`;
    const barColor = pct >= 0.9
        ? "var(--cds-support-error)"
        : pct >= 0.7
            ? "var(--cds-support-warning)"
            : "var(--cds-support-success)";
    
    return (
        <div style={{ width: 120, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <div style={{
                flex: 1,
                height: 6,
                background: "var(--cds-layer-accent-01)",
                borderRadius: 3,
                overflow: "hidden"
            }}>
                <div style={{
                    width: pctStr,
                    height: "100%",
                    background: barColor,
                    transition: "width 0.3s ease"
                }} />
            </div>
            <div
                className="cds--label-01"
                style={{
                    minWidth: "2.5rem",
                    textAlign: "right",
                    fontWeight: 500,
                    color: pct >= 0.9 ? "var(--cds-support-error)" : "var(--cds-text-primary)"
                }}
            >
                {pctStr}
            </div>
        </div>
    );
}

/* ====================== */
/* Inline Resume Modal UI */
/* ====================== */
function ResumeUploadModal({
                               open, onClose, draft, setDraft, onSubmit,
                           }: {
    open: boolean;
    onClose: () => void;
    draft: ResumeDraft;
    setDraft: (d: ResumeDraft) => void;
    onSubmit: () => Promise<void> | void;
}) {
    const [uploading, setUploading] = useState(false);
    const [items, setItems] = useState<{ name: string; status: "edit" | "uploading" | "complete" }[]>([]);

    const onFilesDropped = (e: any) => {
        const file = e?.target?.files?.[0] || e?.dataTransfer?.files?.[0];
        if (!file) return;
        setDraft({ ...draft, file });
        setItems([{ name: file.name, status: "edit" }]);
    };

    const handleSubmit = async () => {
        if (!draft.file) return;
        setUploading(true);
        try {
            await onSubmit();
            setItems((prev) => prev.map((it) => ({ ...it, status: "complete" })));
        } catch {
            setItems((prev) => prev.map((it) => ({ ...it, status: "complete" })));
        } finally {
            setUploading(false);
        }
    };

    return (
        <ComposedModal open={open} onClose={onClose} size="lg">
            <ModalHeader label="Resume Management" title="Upload candidate resume" />
            <ModalBody hasForm>
                <div style={{ display: "grid", gap: 16 }}>
                    <TextInput
                        id="candidate-name" labelText="Candidate name" placeholder="e.g., Jordan Patel"
                        value={draft.candidateName}
                        onChange={(e) => setDraft({ ...draft, candidateName: (e.target as HTMLInputElement).value })}
                    />
                    <TextInput
                        id="candidate-role" labelText="Role (optional)" placeholder="e.g., Backend Engineer"
                        value={draft.candidateRole}
                        onChange={(e) => setDraft({ ...draft, candidateRole: (e.target as HTMLInputElement).value })}
                    />
                    <TextArea
                        id="candidate-notes" labelText="Notes (optional)" placeholder="Add context, highlights, interview links…"
                        value={draft.notes}
                        onChange={(e) => setDraft({ ...draft, notes: (e.target as HTMLTextAreaElement).value })}
                    />

                    <div>
                        <p className="cds--label-01" style={{ marginBottom: 8 }}>Resume file (.pdf, .docx, .txt)</p>
                        <FileUploaderDropContainer accept={[".pdf", ".docx", ".txt"]} multiple={false} onAddFiles={onFilesDropped} labelText="Drag and drop file here or click to upload" />
                        <div style={{ marginTop: 8 }}>
                            {items.map((it) => (
                                <FileUploaderItem
                                    key={it.name} name={it.name} status={it.status}
                                    onDelete={() => { setDraft({ ...draft, file: null }); setItems([]); }}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </ModalBody>
            <ModalFooter
                primaryButtonText={uploading ? "Uploading…" : "Upload"}
                secondaryButtonText="Cancel"
                onRequestClose={onClose}
                onRequestSubmit={handleSubmit}
                primaryButtonDisabled={!draft.file || uploading}
            >
                {uploading && <InlineLoading description="Saving…" />}
            </ModalFooter>
        </ComposedModal>
    );
}

/* ---- Small local KPI tile ---- */
function ExtraKpi({ label, value, tooltip }: { label: string; value: number | string; tooltip?: string }) {
    return (
        <Tile style={{ padding: 16 }} title={tooltip}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ChartColumn />
                <div>
                    <div className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>{label}</div>
                    <div className="cds--productive-heading-03">{value}</div>
                </div>
            </div>
        </Tile>
    );
}

/* ---- Compliance Card - Redesigned ---- */
function ComplianceCard({
    label,
    value,
    total,
    onClick
}: {
    label: string;
    value: number;
    total: number;
    onClick: () => void;
}) {
    const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
    const isGood = percentage >= 75;
    
    return (
        <Tile
            style={{
                padding: "1.5rem",
                cursor: "pointer",
                backgroundColor: "var(--cds-layer-01)",
                border: "1px solid var(--cds-border-subtle-01)",
                borderLeft: `4px solid ${isGood ? "var(--cds-support-success)" : "var(--cds-support-warning)"}`,
                transition: "all 0.2s ease",
                position: "relative"
            }}
            onClick={onClick}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderLeftWidth = "6px";
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderLeftWidth = "4px";
            }}
        >
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div className="cds--label-01" style={{
                    color: "var(--cds-text-secondary)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: "0.75rem"
                }}>
                    {label}
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "0.5rem" }}>
                    <div style={{
                        fontSize: "2.5rem",
                        fontWeight: 300,
                        lineHeight: 1,
                        color: "var(--cds-text-primary)"
                    }}>
                        {value}
                    </div>
                    <div className="cds--label-01" style={{ color: "var(--cds-text-secondary)" }}>
                        / {total}
                    </div>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    paddingTop: "0.5rem",
                    borderTop: "1px solid var(--cds-border-subtle-01)"
                }}>
                    <div style={{
                        width: "100%",
                        height: "4px",
                        backgroundColor: "var(--cds-layer-accent-01)",
                        borderRadius: "2px",
                        overflow: "hidden"
                    }}>
                        <div style={{
                            width: `${percentage}%`,
                            height: "100%",
                            backgroundColor: isGood ? "var(--cds-support-success)" : "var(--cds-support-warning)",
                            transition: "width 0.3s ease"
                        }} />
                    </div>
                    <div
                        className="cds--label-01"
                        style={{
                            color: isGood ? "var(--cds-support-success)" : "var(--cds-support-warning)",
                            fontWeight: 600,
                            minWidth: "3rem",
                            textAlign: "right"
                        }}
                    >
                        {percentage}%
                    </div>
                </div>
            </div>
        </Tile>
    );
}

/* ---- Performance Rating Component ---- */
function PerformanceRating({ userId }: { userId: string }) {
    const [rating, setRating] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [isHighPerformer, setIsHighPerformer] = useState(false);

    useEffect(() => {
        const fetchPerformance = async () => {
            try {
                const { data, error } = await supabase
                    .from('user_performance' as any)
                    .select('*')
                    .eq('user_id', userId)
                    .maybeSingle();
                
                if (error) {
                    console.error('Error fetching performance data:', error);
                    throw error;
                }
                if (data) {
                    const perfData = data as any;
                    // Map text rating to number: high_performer=5, meets_expectations=3, needs_improvement=1
                    const ratingMap: Record<string, number> = {
                        'high_performer': 5,
                        'meets_expectations': 3,
                        'needs_improvement': 1
                    };
                    const numRating = ratingMap[perfData.performance_rating] || 3;
                    setRating(numRating);
                    setIsHighPerformer(perfData.performance_rating === 'high_performer');
                }
            } catch (error) {
                console.error('Error fetching performance:', error);
            }
        };
        fetchPerformance();
    }, [userId]);

    const updateRating = async (newRating: number) => {
        setLoading(true);
        try {
            // Map number to text rating
            const ratingTextMap: Record<number, string> = {
                5: 'high_performer',
                4: 'high_performer',
                3: 'meets_expectations',
                2: 'needs_improvement',
                1: 'needs_improvement'
            };
            
            // First, check if a record exists
            const { data: existing } = await supabase
                .from('user_performance' as any)
                .select('id')
                .eq('user_id', userId)
                .single();
            
            if (existing) {
                // Update existing record
                const { error } = await supabase
                    .from('user_performance' as any)
                    .update({
                        performance_rating: ratingTextMap[newRating],
                        rated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId);
                
                if (error) throw error;
            } else {
                // Insert new record (requires leader/manager role)
                const { error } = await supabase
                    .from('user_performance' as any)
                    .insert({
                        id: crypto.randomUUID(),
                        user_id: userId,
                        performance_rating: ratingTextMap[newRating],
                        rated_at: new Date().toISOString()
                    });
                
                if (error) throw error;
            }
            
            setRating(newRating);
            setIsHighPerformer(newRating >= 4);
        } catch (error) {
            console.error('Error updating performance:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <InlineLoading description="Updating..." />;
    }

    const ratingItems = [
        { id: '5', text: 'Exceptional' },
        { id: '4', text: 'Excellent' },
        { id: '3', text: 'Good' },
        { id: '2', text: 'Fair' },
        { id: '1', text: 'Needs Improvement' }
    ];

    const selectedRatingItem = rating ? ratingItems.find(item => item.id === String(rating)) : undefined;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Dropdown
                id={`performance-${userId}`}
                titleText=""
                label={rating ? ratingItems.find(item => item.id === String(rating))?.text || "Not rated" : "Not rated"}
                size="sm"
                items={ratingItems}
                selectedItem={selectedRatingItem}
                itemToString={(item: any) => item ? item.text : ''}
                onChange={(e: any) => {
                    if (e.selectedItem) {
                        const newRating = parseInt(e.selectedItem.id);
                        updateRating(newRating);
                    }
                }}
            />
            {isHighPerformer && (
                <Tag type="purple" size="sm">High Performer</Tag>
            )}
        </div>
    );
}

/* ---- Pipeline Stage Component ---- */
function PipelineStage({ userId }: { userId: string }) {
    const [stage, setStage] = useState<string>('active');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchStage = async () => {
            try {
                const { data, error } = await supabase
                    .from('user_performance' as any)
                    .select('*')
                    .eq('user_id', userId)
                    .maybeSingle();
                
                if (error) {
                    console.error('Error fetching stage data:', error);
                    throw error;
                }
                if (data) {
                    const stageData = data as any;
                    if (stageData.pipeline_stage) {
                        setStage(stageData.pipeline_stage);
                    }
                }
            } catch (error) {
                console.error('Error fetching pipeline stage:', error);
            }
        };
        fetchStage();
    }, [userId]);

    const updateStage = async (newStage: string) => {
        setLoading(true);
        try {
            // First, check if a record exists
            const { data: existing } = await supabase
                .from('user_performance' as any)
                .select('id')
                .eq('user_id', userId)
                .single();
            
            if (existing) {
                // Update existing record
                const { error } = await supabase
                    .from('user_performance' as any)
                    .update({
                        pipeline_stage: newStage,
                        rated_at: new Date().toISOString()
                    })
                    .eq('user_id', userId);
                
                if (error) throw error;
            } else {
                // Insert new record (requires leader/manager role)
                const { error } = await supabase
                    .from('user_performance' as any)
                    .insert({
                        id: crypto.randomUUID(),
                        user_id: userId,
                        pipeline_stage: newStage,
                        rated_at: new Date().toISOString()
                    });
                
                if (error) throw error;
            }
            
            setStage(newStage);
        } catch (error) {
            console.error('Error updating pipeline stage:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <InlineLoading description="Updating..." />;
    }

    const stageColors: Record<string, string> = {
        'active': 'blue',
        'high_performer': 'purple',
        'conversion_candidate': 'cyan',
        'offer_extended': 'teal',
        'offer_accepted': 'green'
    };

    const stageLabels: Record<string, string> = {
        'active': 'Active',
        'high_performer': 'High Performer',
        'conversion_candidate': 'Conversion Candidate',
        'offer_extended': 'Offer Extended',
        'offer_accepted': 'Offer Accepted'
    };

    const stageItems = [
        { id: 'active', text: 'Active' },
        { id: 'high_performer', text: 'High Performer' },
        { id: 'conversion_candidate', text: 'Conversion Candidate' },
        { id: 'offer_extended', text: 'Offer Extended' },
        { id: 'offer_accepted', text: 'Offer Accepted' }
    ];

    const selectedStageItem = stageItems.find(item => item.id === stage);

    return (
        <Dropdown
            id={`pipeline-${userId}`}
            titleText=""
            label={stageLabels[stage] || 'Active'}
            size="sm"
            items={stageItems}
            selectedItem={selectedStageItem}
            itemToString={(item: any) => item ? item.text : ''}
            onChange={(e: any) => {
                if (e.selectedItem) {
                    updateStage(e.selectedItem.id);
                }
            }}
        />
    );
}