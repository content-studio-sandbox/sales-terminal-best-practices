import {
    Header,
    HeaderContainer,
    HeaderName,
    HeaderGlobalBar,
    HeaderGlobalAction,
    SkipToContent,
    Theme,
    HeaderNavigation,
    HeaderMenuItem,
    Tag,
} from "@carbon/react";
import { Moon, Sun, Chat, Locked } from "@carbon/icons-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAppTheme } from "@/theme/ThemeProvider";

interface AppHeaderProps {
    onFeedbackClick?: () => void;
}

// Define which routes are currently available vs upcoming sessions
// Order: Available sessions first, then upcoming sessions
const routes = [
    // Available Sessions (left side)
    { id: "terminal-basics", label: "Terminal", path: "/terminal-basics", available: true },
    { id: "git-workflows", label: "Git", path: "/git-workflows", available: true },
    { id: "training-resources", label: "Training", path: "/training-resources", available: true },
    { id: "interactive-terminal", label: "Terminal Simulator", path: "/interactive-terminal", available: true },
    { id: "survey-results", label: "Survey", path: "/survey-results", available: true },
    
    // Upcoming Sessions (right side)
    { id: "ssh-best-practices", label: "SSH", path: "/ssh-best-practices", available: false, upcoming: true },
    { id: "vim-best-practices", label: "Vim", path: "/vim-best-practices", available: false, upcoming: true },
    { id: "openshift-best-practices", label: "OpenShift", path: "/openshift-best-practices", available: false, upcoming: true },
    { id: "cpd-cli", label: "CPD CLI", path: "/cpd-cli", available: false, upcoming: true },
    { id: "api-authentication", label: "API Auth", path: "/api-authentication", available: false, upcoming: true },
    { id: "agentic-tools", label: "AI Agents", path: "/agentic-tools", available: false, upcoming: true },
];

const APP_VERSION = "v2.5.0";
const RELEASE_DATE = "December 2025";

const releaseNotes = [
    {
        version: "v2.5.0",
        date: "December 2025",
        features: [
            "Added user role badge in header for immediate role visibility",
            "Implemented complete BYOK (Bring Your Own Key) for Watson Orchestrate",
            "Added test connection button for Watson Orchestrate configuration",
            "Integrated user's Orchestrate credentials with chatbot",
            "Fixed Projects Tab UI with improved spacing and alignment",
            "Resolved leadership assignment bugs in project management",
            "Removed deprecated Supabase authentication code",
            "Fixed SSO authentication for custom API keys",
            "Improved task deletion UI and user experience",
            "Resolved authentication race condition issues",
            "Added Executive Dashboard analytics export feature",
            "Updated Supabase foreign key syntax to modern conventions",
            "Reorganized repository structure for better maintainability",
            "Implemented comprehensive intern project tracking system (KAN-48)",
            "Added Monday board-like interface for project management",
            "Enhanced project creation modal with better validation",
            "Added automation tests for project tracking features"
        ]
    },
    {
        version: "v2.4.0",
        date: "November 2025",
        features: [
            "Enhanced Leadership Dashboard with improved KPI tiles and better visual hierarchy",
            "Redesigned table headers with better spacing and alignment",
            "Added colored icon backgrounds for key metrics (UserMultiple, Folder, CheckmarkOutline, Time)",
            "Improved header navigation with better user info grouping",
            "Added release notes modal for leaders and managers",
            "Fixed tab panel rendering - only show selected tab content",
            "Restructured intern navigation - Opportunities shows projects, not career paths",
            "Fixed font sizes to use proper Carbon Design System tokens",
            "Enhanced landing page with IBM Carbon Design improvements",
            "Complete redesign of Your Projects empty states",
            "Applied Carbon Design System to all empty states",
            "Fixed empty states for intern first-time experience",
            "Improved navigation clarity for IBM co-op/intern context"
        ]
    },
    {
        version: "v2.3.0",
        date: "October 2025",
        features: [
            "Implemented comprehensive documentation for TASK-26 through TASK-30",
            "Added Leadership Dashboard enhancements (TASK-21 through TASK-25)",
            "Implemented dashboard analytics and filtering features",
            "Added KPI tiles for organizational metrics",
            "Enhanced user performance tracking",
            "Improved project status visualization"
        ]
    },
    {
        version: "v2.2.0",
        date: "September 2025",
        features: [
            "Implemented comprehensive skills management and matching system (TASK-10 through TASK-15)",
            "Added learning catalog and tracking system (TASK-16 through TASK-20)",
            "Enforced invitation acceptance to project membership (TASK-9)",
            "Implemented 'Invite Candidates' feature for leaders (TASK-7)",
            "Added 'My Invitations' tab for interns (TASK-6)",
            "Integrated Career Paths assignment to project creation (TASK-5)"
        ]
    },
    {
        version: "v2.1.0",
        date: "August 2025",
        features: [
            "Implemented Career Path cards with 'I'm Interested' button for interns (TASK-3)",
            "Added foundational RBAC and database migrations (TASK-1, TASK-4, TASK-8)",
            "Renamed 'Ambitions & Projects' to 'Career Paths' for intern view (TASK-2)",
            "Enhanced role-based access control system",
            "Improved database schema for career paths and invitations"
        ]
    },
    {
        version: "v2.0.0",
        date: "July 2025",
        features: [
            "Complete UI/UX redesign following IBM Carbon Design System",
            "Improved documentation in README.md",
            "Added hours per week to project tracking",
            "Updated database retrieval and UI components",
            "Fixed filter dropdown functionality",
            "Enhanced project management interface"
        ]
    }
];

export default function AppHeader({ onFeedbackClick }: AppHeaderProps) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { theme, toggle } = useAppTheme();

    return (
        // Keep the header bar in g100 for contrast; page content theme is managed by the provider.
        <Theme theme="g100">
            <div style={{ borderBottom: "1px solid var(--cds-border-subtle-00)" }}>
                <HeaderContainer
                    render={() => (
                        <Header aria-label="Sales Terminal Best Practices">
                            <SkipToContent />
                            <HeaderName
                                href="/"
                                prefix=""
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate("/");
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                                    <span style={{ color: "white" }}>FSM Technical Best Practices</span>
                                </div>
                            </HeaderName>

                            <HeaderNavigation aria-label="Main navigation">
                                {routes.map((route) => (
                                    <HeaderMenuItem
                                        key={route.id}
                                        href={route.available ? route.path : '#'}
                                        isActive={pathname === route.path}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            if (route.available) {
                                                navigate(route.path);
                                            }
                                        }}
                                        style={{
                                            opacity: route.available ? 1 : 0.5,
                                            cursor: route.available ? 'pointer' : 'not-allowed',
                                            position: 'relative',
                                        }}
                                    >
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                        }}>
                                            {route.label}
                                            {route.upcoming && (
                                                <Tag
                                                    size="sm"
                                                    type="cool-gray"
                                                    style={{
                                                        marginLeft: '4px',
                                                        fontSize: '10px',
                                                        padding: '0 4px',
                                                        height: '16px',
                                                        minHeight: '16px',
                                                    }}
                                                >
                                                    Upcoming
                                                </Tag>
                                            )}
                                        </div>
                                    </HeaderMenuItem>
                                ))}
                            </HeaderNavigation>

                            <HeaderGlobalBar>
                                {onFeedbackClick && (
                                    <HeaderGlobalAction
                                        aria-label="Submit Feedback"
                                        tooltipAlignment="end"
                                        onClick={onFeedbackClick}
                                    >
                                        <Chat size={20} style={{ color: "white" }} />
                                    </HeaderGlobalAction>
                                )}

                                <HeaderGlobalAction
                                    aria-label="Toggle theme"
                                    tooltipAlignment="end"
                                    onClick={toggle}
                                >
                                    {theme === "g10" ? (
                                        <Moon size={20} style={{ color: "white" }} />
                                    ) : (
                                        <Sun size={20} style={{ color: "white" }} />
                                    )}
                                </HeaderGlobalAction>
                            </HeaderGlobalBar>
                        </Header>
                    )}
                />
            </div>
        </Theme>
    );
}
