// src/components/carbon/__tests__/AmbitionsTab.test.tsx
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import AmbitionsTab from "../AmbitionsTab";
import * as useAuthModule from "@/hooks/useAuth";

// Increase timeout for all tests in this file
const TEST_TIMEOUT = 10000;

// Mock dependencies
vi.mock("@/integrations/supabase/client", () => ({
  supabase: {
    rpc: vi.fn(),
    from: vi.fn(),
  },
}));

vi.mock("@/hooks/useAuth");
vi.mock("../CreateAmbitionModal", () => ({
  default: ({ open, onAmbitionCreated }: any) =>
    open ? (
      <div data-testid="create-ambition-modal">
        <button onClick={onAmbitionCreated}>Create Ambition</button>
      </div>
    ) : null,
}));
vi.mock("../ApplicantProfileModal", () => ({
  default: ({ open }: any) =>
    open ? <div data-testid="applicant-profile-modal">Profile Modal</div> : null,
}));
vi.mock("../CreateProjectModal", () => ({
  default: ({ open, onProjectCreated }: any) =>
    open ? (
      <div data-testid="create-project-modal">
        <button onClick={onProjectCreated}>Create Project</button>
      </div>
    ) : null,
}));
vi.mock("../ApplyProjectModal", () => ({
  default: ({ open, onSubmit, project }: any) =>
    open ? (
      <div data-testid="apply-project-modal">
        <button onClick={() => onSubmit(project?.id, { message: "Test" })}>
          Apply
        </button>
      </div>
    ) : null,
}));
vi.mock("../../ViewProjectModal", () => ({
  default: ({ open, onUpdate }: any) =>
    open ? (
      <div data-testid="view-project-modal">
        <button onClick={onUpdate}>Update</button>
      </div>
    ) : null,
}));
vi.mock("../AssignTeamMembersModal", () => ({
  default: ({ open, onTeamMembersAssigned }: any) =>
    open ? (
      <div data-testid="assign-team-modal">
        <button onClick={onTeamMembersAssigned}>Assign</button>
      </div>
    ) : null,
}));
vi.mock("../ViewAmbitionModal", () => ({
  default: ({ open, onUpdate, onViewProjects }: any) =>
    open ? (
      <div data-testid="view-ambition-modal">
        <button onClick={onUpdate}>Update</button>
        <button onClick={() => onViewProjects("Test Ambition")}>
          View Projects
        </button>
      </div>
    ) : null,
}));

const { supabase } = await import("@/integrations/supabase/client");

describe("AmbitionsTab", () => {
  const mockUser = {
    id: "user-1",
    email: "test@example.com",
    display_name: "Test User",
    access_role: "manager",
  };

  const mockAmbitions = [
    {
      id: "amb-1",
      name: "Digital Transformation",
      description: "Transform our digital capabilities",
      leader_name: "John Doe",
      leader_id: "leader-1",
      created_by: "user-1",
    },
    {
      id: "amb-2",
      name: "Cloud Migration",
      description: "Migrate to cloud infrastructure",
      leader_name: "Jane Smith",
      leader_id: "leader-2",
      created_by: "leader-2",
    },
  ];

  const mockProjects = [
    {
      id: "proj-1",
      name: "API Gateway",
      description: "Build API gateway",
      ambition_name: "Digital Transformation",
      pm_name: "Alice Johnson",
      deadline: "2025-12-31",
      hours_per_week: 20,
      skills: ["Node.js", "AWS", "Docker"],
      created_at: "2025-01-01",
    },
    {
      id: "proj-2",
      name: "Database Migration",
      description: "Migrate databases to cloud",
      ambition_name: "Cloud Migration",
      pm_name: "Bob Wilson",
      deadline: "2025-06-30",
      hours_per_week: 15,
      skills: ["PostgreSQL", "AWS RDS"],
      created_at: "2025-01-15",
    },
  ];

  const mockSkills = [
    { name: "Node.js" },
    { name: "AWS" },
    { name: "Docker" },
    { name: "PostgreSQL" },
  ];

  const mockCareerPaths = [
    {
      id: "path-1",
      name: "Full Stack Developer",
      description: "Build end-to-end applications",
    },
    {
      id: "path-2",
      name: "Cloud Architect",
      description: "Design cloud solutions",
    },
  ];

  const mockInvitations = [
    {
      id: "inv-1",
      status: "invited",
      created_at: "2025-01-01",
      expires_at: "2025-02-01",
      project: {
        id: "proj-1",
        name: "API Gateway",
        description: "Build API gateway",
        deadline: "2025-12-31",
        hours_per_week: 20,
        ambition: { name: "Digital Transformation" },
        pm: { display_name: "Alice Johnson" },
      },
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock useAuth
    vi.mocked(useAuthModule.default).mockReturnValue({
      user: mockUser as any,
      userId: mockUser.id,
      loading: false,
      useProxy: false,
      refresh: vi.fn(),
      signOut: vi.fn(),
    });

    // Mock Supabase RPC calls
    vi.mocked(supabase.rpc).mockImplementation((fnName: string) => {
      if (fnName === "get_ambitions") {
        return Promise.resolve({ data: mockAmbitions, error: null }) as any;
      }
      if (fnName === "get_projects_enhanced") {
        return Promise.resolve({ data: mockProjects, error: null }) as any;
      }
      return Promise.resolve({ data: [], error: null }) as any;
    });

    // Mock Supabase from() calls
    vi.mocked(supabase.from).mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
      };

      if (table === "skills") {
        mockChain.select.mockResolvedValue({ data: mockSkills, error: null });
      } else if (table === "career_paths") {
        mockChain.order.mockResolvedValue({
          data: mockCareerPaths,
          error: null,
        });
      } else if (table === "user_path_preferences") {
        mockChain.eq.mockResolvedValue({ data: [], error: null });
        mockChain.delete.mockResolvedValue({ data: null, error: null });
        mockChain.insert.mockResolvedValue({ data: null, error: null });
      } else if (table === "project_invitations") {
        mockChain.order.mockResolvedValue({
          data: mockInvitations,
          error: null,
        });
        mockChain.update.mockResolvedValue({ data: null, error: null });
      } else if (table === "ambitions") {
        mockChain.delete.mockResolvedValue({ data: null, error: null });
      } else if (table === "users") {
        mockChain.single.mockResolvedValue({
          data: {
            id: "leader-1",
            display_name: "John Doe",
            email: "john@example.com",
            interests: "AI, Cloud",
            experience: "10 years",
            skills: [],
            products: [],
          },
          error: null,
        });
      }

      return mockChain as any;
    });

    // Mock fetch for join requests
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true }),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const renderComponent = (props = {}) => {
    return render(
      <BrowserRouter>
        <AmbitionsTab user={mockUser} {...props} />
      </BrowserRouter>
    );
  };

  describe("Initial Rendering", () => {
    it("should render loading state initially", { timeout: TEST_TIMEOUT }, () => {
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: mockUser as any,
        userId: mockUser.id,
        loading: true,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      renderComponent();
      expect(screen.getByRole("progressbar")).toBeInTheDocument();
    });

    it("should render page title and description for managers", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText("Ambitions & Projects")
        ).toBeInTheDocument();
      });
      expect(
        screen.getByText(/Explore strategic initiatives/i)
      ).toBeInTheDocument();
    });

    it("should render page title and description for interns", { timeout: TEST_TIMEOUT }, async () => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      renderComponent({ user: internUser });

      await waitFor(() => {
        expect(screen.getByText("Opportunities")).toBeInTheDocument();
      });
      expect(
        screen.getByText(/Browse available projects/i)
      ).toBeInTheDocument();
    });

    it("should fetch ambitions, projects, and skills on mount", async () => {
      renderComponent();

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith("get_ambitions");
        expect(supabase.rpc).toHaveBeenCalledWith("get_projects_enhanced");
        expect(supabase.from).toHaveBeenCalledWith("skills");
      });
    });

    it("should fetch career paths and invitations for interns", async () => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      renderComponent({ user: internUser });

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith("career_paths");
        expect(supabase.from).toHaveBeenCalledWith("project_invitations");
      });
    });
  });

  describe("Manager/Leader View - Ambitions Tab", () => {
    it("should display ambitions list", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Digital Transformation")).toBeInTheDocument();
        expect(screen.getByText("Cloud Migration")).toBeInTheDocument();
      });
    });

    it("should show ambition details", async () => {
      renderComponent();

      await waitFor(() => {
        expect(
          screen.getByText("Transform our digital capabilities")
        ).toBeInTheDocument();
        expect(
          screen.getByText("Migrate to cloud infrastructure")
        ).toBeInTheDocument();
      });
    });

    it("should display leader names", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("John Doe")).toBeInTheDocument();
        expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      });
    });

    it("should display project counts", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("1 project")).toBeInTheDocument();
      });
    });

    it("should show Create Ambition button for managers", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Create Ambition")).toBeInTheDocument();
      });
    });

    it("should show Create Project button for managers", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Create Project")).toBeInTheDocument();
      });
    });

    it("should not show create buttons for interns", async () => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      renderComponent({ user: internUser });

      await waitFor(() => {
        expect(screen.queryByText("Create Ambition")).not.toBeInTheDocument();
        expect(screen.queryByText("Create Project")).not.toBeInTheDocument();
      });
    });

    it("should open CreateAmbitionModal when Create Ambition clicked", async () => {
      renderComponent();

      await waitFor(() => {
        const createButton = screen.getByText("Create Ambition");
        fireEvent.click(createButton);
      });

      expect(screen.getByTestId("create-ambition-modal")).toBeInTheDocument();
    });

    it("should open CreateProjectModal when Create Project clicked", async () => {
      renderComponent();

      await waitFor(() => {
        const createButton = screen.getByText("Create Project");
        fireEvent.click(createButton);
      });

      expect(screen.getByTestId("create-project-modal")).toBeInTheDocument();
    });

    it("should show delete button for own ambitions", async () => {
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText("Delete ambition");
        expect(deleteButtons.length).toBeGreaterThan(0);
      });
    });

    it("should open delete confirmation modal", async () => {
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText("Delete ambition");
        fireEvent.click(deleteButtons[0]);
      });

      expect(screen.getByText("Delete Ambition")).toBeInTheDocument();
      expect(
        screen.getByText(/Are you sure you want to delete/i)
      ).toBeInTheDocument();
    });

    it("should delete ambition when confirmed", async () => {
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText("Delete ambition");
        fireEvent.click(deleteButtons[0]);
      });

      const confirmButton = screen.getByText("Delete");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith("ambitions");
      });
    });

    it("should open ViewAmbitionModal when ambition clicked", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();

      await waitFor(() => {
        const ambitionTile = screen.getByText("Digital Transformation");
        fireEvent.click(ambitionTile);
      });

      expect(screen.getByTestId("view-ambition-modal")).toBeInTheDocument();
    });

    it("should navigate to projects tab when View Projects clicked", async () => {
      renderComponent();

      await waitFor(() => {
        const viewButtons = screen.getAllByText("View Projects");
        fireEvent.click(viewButtons[0]);
      });

      // Should switch to All Projects tab
      await waitFor(() => {
        expect(screen.getByText("All Projects")).toBeInTheDocument();
      });
    });

    it("should open leader profile when leader tag clicked", async () => {
      renderComponent();

      await waitFor(() => {
        const leaderTag = screen.getByText("John Doe");
        fireEvent.click(leaderTag);
      });

      await waitFor(() => {
        expect(screen.getByTestId("applicant-profile-modal")).toBeInTheDocument();
      });
    });
  });

  describe("Manager/Leader View - Projects Tab", () => {
    it("should display projects list", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("API Gateway")).toBeInTheDocument();
        expect(screen.getByText("Database Migration")).toBeInTheDocument();
      });
    });

    it("should show project details", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("Build API gateway")).toBeInTheDocument();
        expect(
          screen.getByText("Migrate databases to cloud")
        ).toBeInTheDocument();
      });
    });

    it("should display project skills", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("Node.js")).toBeInTheDocument();
        expect(screen.getByText("AWS")).toBeInTheDocument();
        expect(screen.getByText("Docker")).toBeInTheDocument();
      });
    });

    it("should show +N more tag for additional skills", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        // API Gateway has 3 skills shown, no +more tag
        expect(screen.queryByText("+0 more")).not.toBeInTheDocument();
      });
    });

    it("should display PM names", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
        expect(screen.getByText("Bob Wilson")).toBeInTheDocument();
      });
    });

    it("should display deadlines", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("12/31/2025")).toBeInTheDocument();
        expect(screen.getByText("6/30/2025")).toBeInTheDocument();
      });
    });

    it("should display hours per week", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("20h/week")).toBeInTheDocument();
        expect(screen.getByText("15h/week")).toBeInTheDocument();
      });
    });

    it("should show search input", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search projects...")).toBeInTheDocument();
      });
    });

    it("should filter projects by search term", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      const searchInput = await screen.findByPlaceholderText("Search projects...");
      fireEvent.change(searchInput, { target: { value: "API" } });

      await waitFor(() => {
        // Projects are filtered on the backend via useEffect
        expect(supabase.rpc).toHaveBeenCalledWith("get_projects_enhanced");
      });
    });

    it("should show ambition filter dropdown", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("Filter by ambition")).toBeInTheDocument();
      });
    });

    it("should show skills filter multiselect", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        const skillsFilters = screen.getAllByText("Filter by skills");
        expect(skillsFilters.length).toBeGreaterThan(0);
      });
    });

    it("should show sort dropdown", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        const sortByLabels = screen.getAllByText("Sort by");
        expect(sortByLabels.length).toBeGreaterThan(0);
      });
    });

    it("should open ViewProjectModal when project clicked", async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        const projectTile = screen.getByText("API Gateway");
        fireEvent.click(projectTile);
      });

      expect(screen.getByTestId("view-project-modal")).toBeInTheDocument();
    });

    it("should show Invite Candidates button for managers", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("Invite Candidates")).toBeInTheDocument();
      });
    });

    it("should open AssignTeamMembersModal when Invite Candidates clicked", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        const inviteButton = screen.getByText("Invite Candidates");
        fireEvent.click(inviteButton);
      });

      expect(screen.getByTestId("assign-team-modal")).toBeInTheDocument();
    });

    it("should show I'm Interested button", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("I'm Interested")).toBeInTheDocument();
      });
    });

    it("should open ApplyProjectModal when I'm Interested clicked", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();
      
      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        const applyButton = screen.getByText("I'm Interested");
        fireEvent.click(applyButton);
      });

      expect(screen.getByTestId("apply-project-modal")).toBeInTheDocument();
    });
  });

  describe("Intern View - Opportunities Tab", () => {
    beforeEach(() => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });
    });

    it("should display projects for interns", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        expect(screen.getByText("API Gateway")).toBeInTheDocument();
        expect(screen.getByText("Database Migration")).toBeInTheDocument();
      });
    });

    it("should show project filters for interns", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        expect(screen.getByPlaceholderText("Search projects...")).toBeInTheDocument();
      });
    });

    it("should not show Invite Candidates button for interns", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        expect(screen.queryByText("Invite Candidates")).not.toBeInTheDocument();
      });
    });

    it("should show I'm Interested button for interns", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        expect(screen.getByText("I'm Interested")).toBeInTheDocument();
      });
    });
  });

  describe("Intern View - Career Paths Tab", () => {
    beforeEach(() => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });
    });

    it("should display Career Paths tab for interns", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        expect(screen.getByText("Career Paths")).toBeInTheDocument();
      });
    });

    it("should switch to Career Paths tab", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const careerPathsTab = screen.getByText("Career Paths");
        fireEvent.click(careerPathsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("Full Stack Developer")).toBeInTheDocument();
        expect(screen.getByText("Cloud Architect")).toBeInTheDocument();
      });
    });

    it("should display career path descriptions", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const careerPathsTab = screen.getByText("Career Paths");
        fireEvent.click(careerPathsTab);
      });

      await waitFor(() => {
        expect(
          screen.getByText("Build end-to-end applications")
        ).toBeInTheDocument();
        expect(screen.getByText("Design cloud solutions")).toBeInTheDocument();
      });
    });

    it("should show I'm Interested button for career paths", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const careerPathsTab = screen.getByText("Career Paths");
        fireEvent.click(careerPathsTab);
      });

      await waitFor(() => {
        const interestedButtons = screen.getAllByText("I'm Interested");
        expect(interestedButtons.length).toBeGreaterThan(0);
      });
    });

    it("should add career path preference when I'm Interested clicked", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const careerPathsTab = screen.getByText("Career Paths");
        fireEvent.click(careerPathsTab);
      });

      await waitFor(() => {
        const interestedButtons = screen.getAllByText("I'm Interested");
        fireEvent.click(interestedButtons[0]);
      });

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith("user_path_preferences");
      });
    });

    it("should show maximum 3 preferences warning", async () => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      // Mock 3 existing preferences
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        const mockChain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
        };

        if (table === "user_path_preferences") {
          mockChain.eq.mockResolvedValue({
            data: [
              { id: "1", path_id: "path-1", rank: 1 },
              { id: "2", path_id: "path-2", rank: 2 },
              { id: "3", path_id: "path-3", rank: 3 },
            ],
            error: null,
          });
        } else if (table === "career_paths") {
          mockChain.order.mockResolvedValue({
            data: mockCareerPaths,
            error: null,
          });
        }

        return mockChain as any;
      });

      renderComponent({ user: internUser });

      await waitFor(() => {
        const careerPathsTab = screen.getByText("Career Paths");
        fireEvent.click(careerPathsTab);
      });

      // Wait for preferences to load
      await waitFor(() => {
        expect(screen.getByText(/Your Selected Career Paths/i)).toBeInTheDocument();
      });
    });

    it("should show empty state when no career paths", async () => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        const mockChain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
        };

        if (table === "career_paths") {
          mockChain.order.mockResolvedValue({ data: [], error: null });
        } else if (table === "user_path_preferences") {
          mockChain.eq.mockResolvedValue({ data: [], error: null });
        }

        return mockChain as any;
      });

      renderComponent({ user: internUser });

      await waitFor(() => {
        const careerPathsTab = screen.getByText("Career Paths");
        fireEvent.click(careerPathsTab);
      });

      await waitFor(() => {
        expect(
          screen.getByText("Get Started with Your IBM Journey")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Intern View - Invitations Tab", () => {
    beforeEach(() => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });
    });

    it("should display My Invitations tab for interns", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        expect(screen.getByText(/My Invitations/i)).toBeInTheDocument();
      });
    });

    it("should show invitation count badge", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        expect(screen.getByText(/My Invitations \(1\)/i)).toBeInTheDocument();
      });
    });

    it("should switch to Invitations tab", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const invitationsTab = screen.getByText(/My Invitations/i);
        fireEvent.click(invitationsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("API Gateway")).toBeInTheDocument();
      });
    });

    it("should display invitation details", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const invitationsTab = screen.getByText(/My Invitations/i);
        fireEvent.click(invitationsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("Build API gateway")).toBeInTheDocument();
        expect(screen.getByText("Pending")).toBeInTheDocument();
      });
    });

    it("should show Accept and Decline buttons for pending invitations", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const invitationsTab = screen.getByText(/My Invitations/i);
        fireEvent.click(invitationsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("Accept")).toBeInTheDocument();
        expect(screen.getByText("Decline")).toBeInTheDocument();
      });
    });

    it("should accept invitation when Accept clicked", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const invitationsTab = screen.getByText(/My Invitations/i);
        fireEvent.click(invitationsTab);
      });

      await waitFor(() => {
        const acceptButton = screen.getByText("Accept");
        fireEvent.click(acceptButton);
      });

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith("project_invitations");
      });
    });

    it("should decline invitation when Decline clicked", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const invitationsTab = screen.getByText(/My Invitations/i);
        fireEvent.click(invitationsTab);
      });

      await waitFor(() => {
        const declineButton = screen.getByText("Decline");
        fireEvent.click(declineButton);
      });

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith("project_invitations");
      });
    });

    it("should show empty state when no invitations", async () => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        const mockChain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
        };

        if (table === "project_invitations") {
          mockChain.order.mockResolvedValue({ data: [], error: null });
        }

        return mockChain as any;
      });

      renderComponent({ user: internUser });

      await waitFor(() => {
        const invitationsTab = screen.getByText(/My Invitations/i);
        fireEvent.click(invitationsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("No Invitations Yet")).toBeInTheDocument();
      });
    });

    it("should display invitation dates", async () => {
      renderComponent({ user: { ...mockUser, access_role: "intern" } });

      await waitFor(() => {
        const invitationsTab = screen.getByText(/My Invitations/i);
        fireEvent.click(invitationsTab);
      });

      await waitFor(() => {
        expect(screen.getByText(/Invited:/i)).toBeInTheDocument();
        expect(screen.getByText(/Expires:/i)).toBeInTheDocument();
      });
    });
  });

  describe("Selected Ambition Filter", () => {
    it("should display selected ambition filter tag", async () => {
      renderComponent({ selectedAmbition: "Digital Transformation" });

      await waitFor(() => {
        expect(
          screen.getByText("Filtered by: Digital Transformation")
        ).toBeInTheDocument();
      });
    });

    it("should show Clear Filter button when ambition selected", async () => {
      const onClearFilter = vi.fn();
      renderComponent({
        selectedAmbition: "Digital Transformation",
        onClearFilter,
      });

      await waitFor(() => {
        expect(screen.getByText("Clear Filter")).toBeInTheDocument();
      });
    });

    it("should call onClearFilter when Clear Filter clicked", async () => {
      const onClearFilter = vi.fn();
      renderComponent({
        selectedAmbition: "Digital Transformation",
        onClearFilter,
      });

      await waitFor(() => {
        const clearButton = screen.getByText("Clear Filter");
        fireEvent.click(clearButton);
      });

      expect(onClearFilter).toHaveBeenCalled();
    });
  });

  describe("Error Handling", () => {
    it("should display error notification when ambitions fetch fails", async () => {
      vi.mocked(supabase.rpc).mockImplementation((fnName: string) => {
        if (fnName === "get_ambitions") {
          return Promise.resolve({
            data: null,
            error: { message: "Failed to fetch ambitions" },
          }) as any;
        }
        return Promise.resolve({ data: [], error: null }) as any;
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Error loading ambitions")).toBeInTheDocument();
      });
    });

    it("should display error notification when projects fetch fails", async () => {
      vi.mocked(supabase.rpc).mockImplementation((fnName: string) => {
        if (fnName === "get_projects_enhanced") {
          return Promise.resolve({
            data: null,
            error: { message: "Failed to fetch projects" },
          }) as any;
        }
        if (fnName === "get_ambitions") {
          return Promise.resolve({ data: mockAmbitions, error: null }) as any;
        }
        return Promise.resolve({ data: [], error: null }) as any;
      });

      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Error loading projects")).toBeInTheDocument();
      });
    });

    it("should display error notification when career paths fetch fails", async () => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        const mockChain = {
          select: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
        };

        if (table === "career_paths") {
          mockChain.order.mockResolvedValue({
            data: null,
            error: { message: "Failed to fetch career paths" },
          });
        }

        return mockChain as any;
      });

      renderComponent({ user: internUser });

      await waitFor(() => {
        expect(
          screen.getByText("Error loading career paths")
        ).toBeInTheDocument();
      });
    });

    it("should display error notification when invitations fetch fails", async () => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      vi.mocked(supabase.from).mockImplementation((table: string) => {
        const mockChain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          in: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
        };

        if (table === "project_invitations") {
          mockChain.order.mockResolvedValue({
            data: null,
            error: { message: "Failed to fetch invitations" },
          });
        }

        return mockChain as any;
      });

      renderComponent({ user: internUser });

      await waitFor(() => {
        expect(
          screen.getByText("Error loading invitations")
        ).toBeInTheDocument();
      });
    });

    it("should handle delete ambition error", async () => {
      vi.mocked(supabase.from).mockImplementation((table: string) => {
        const mockChain = {
          select: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
        };

        if (table === "ambitions") {
          mockChain.eq.mockResolvedValue({
            data: null,
            error: { message: "Failed to delete" },
          });
        }

        return mockChain as any;
      });

      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText("Delete ambition");
        fireEvent.click(deleteButtons[0]);
      });

      const confirmButton = screen.getByText("Delete");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText("Error deleting ambition")
        ).toBeInTheDocument();
      });
    });

    it("should handle apply to project error", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: "Application failed" }),
      });

      renderComponent();

      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        const applyButton = screen.getByText("I'm Interested");
        fireEvent.click(applyButton);
      });

      await waitFor(() => {
        const applyModalButton = screen.getByTestId("apply-project-modal").querySelector("button");
        if (applyModalButton) fireEvent.click(applyModalButton);
      });

      await waitFor(() => {
        expect(
          screen.getByText("Error submitting application")
        ).toBeInTheDocument();
      });
    });
  });

  describe("Modal Callbacks", () => {
    it("should refresh data when ambition created", async () => {
      renderComponent();

      await waitFor(() => {
        const createButton = screen.getByText("Create Ambition");
        fireEvent.click(createButton);
      });

      const modalButton = screen
        .getByTestId("create-ambition-modal")
        .querySelector("button");
      if (modalButton) fireEvent.click(modalButton);

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith("get_ambitions");
      });
    });

    it("should refresh data when project created", async () => {
      renderComponent();

      await waitFor(() => {
        const createButton = screen.getByText("Create Project");
        fireEvent.click(createButton);
      });

      const modalButton = screen
        .getByTestId("create-project-modal")
        .querySelector("button");
      if (modalButton) fireEvent.click(modalButton);

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith("get_projects_enhanced");
      });
    });

    it("should refresh data when team members assigned", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();

      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        const inviteButton = screen.getByText("Invite Candidates");
        fireEvent.click(inviteButton);
      });

      const modalButton = screen
        .getByTestId("assign-team-modal")
        .querySelector("button");
      if (modalButton) fireEvent.click(modalButton);

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith("get_projects_enhanced");
      });
    });

    it("should refresh data when ambition updated", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();

      await waitFor(() => {
        const ambitionTile = screen.getByText("Digital Transformation");
        fireEvent.click(ambitionTile);
      });

      const updateButton = screen
        .getByTestId("view-ambition-modal")
        .querySelector("button");
      if (updateButton) fireEvent.click(updateButton);

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith("get_ambitions");
      });
    });

    it("should refresh data when project updated", async () => {
      renderComponent();

      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        const projectTile = screen.getByText("API Gateway");
        fireEvent.click(projectTile);
      });

      const updateButton = screen
        .getByTestId("view-project-modal")
        .querySelector("button");
      if (updateButton) fireEvent.click(updateButton);

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith("get_projects_enhanced");
      });
    });
  });

  describe("Tab Navigation", () => {
    it("should switch between tabs", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.getByText("Strategic Ambitions")).toBeInTheDocument();
      });

      const allProjectsTab = screen.getByText("All Projects");
      fireEvent.click(allProjectsTab);

      await waitFor(() => {
        expect(screen.getByText("API Gateway")).toBeInTheDocument();
      });
    });

    it("should maintain active tab state", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();

      await waitFor(() => {
        const allProjectsTab = screen.getByText("All Projects");
        fireEvent.click(allProjectsTab);
      });

      await waitFor(() => {
        expect(screen.getByText("API Gateway")).toBeInTheDocument();
      });

      // Tab should remain active
      const strategicTab = screen.getByText("Strategic Ambitions");
      fireEvent.click(strategicTab);

      await waitFor(() => {
        expect(screen.getByText("Digital Transformation")).toBeInTheDocument();
      });
    });

    it("should show correct tabs for interns", { timeout: TEST_TIMEOUT }, async () => {
      const internUser = { ...mockUser, access_role: "intern" };
      vi.mocked(useAuthModule.default).mockReturnValue({
        user: internUser as any,
        userId: internUser.id,
        loading: false,
        useProxy: false,
        refresh: vi.fn(),
        signOut: vi.fn(),
      });

      renderComponent({ user: internUser });

      await waitFor(() => {
        expect(screen.getByText("Opportunities")).toBeInTheDocument();
        expect(screen.getByText("Career Paths")).toBeInTheDocument();
        expect(screen.getByText(/My Invitations/i)).toBeInTheDocument();
      });
    });

    it("should not show Invitations tab for managers", async () => {
      renderComponent();

      await waitFor(() => {
        expect(screen.queryByText(/My Invitations/i)).not.toBeInTheDocument();
      });
    });
  });

  describe("Notification Display", () => {
    it("should show success notification", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText("Delete ambition");
        fireEvent.click(deleteButtons[0]);
      });

      const confirmButton = screen.getByText("Delete");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText("Ambition deleted successfully")
        ).toBeInTheDocument();
      });
    });

    it("should auto-dismiss notification after timeout", { timeout: TEST_TIMEOUT }, async () => {
      vi.useFakeTimers();

      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText("Delete ambition");
        fireEvent.click(deleteButtons[0]);
      });

      const confirmButton = screen.getByText("Delete");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText("Ambition deleted successfully")
        ).toBeInTheDocument();
      });

      // Fast-forward time
      vi.advanceTimersByTime(5000);

      vi.useRealTimers();
    });

    it("should allow manual notification dismissal", { timeout: TEST_TIMEOUT }, async () => {
      renderComponent();

      await waitFor(() => {
        const deleteButtons = screen.getAllByLabelText("Delete ambition");
        fireEvent.click(deleteButtons[0]);
      });

      const confirmButton = screen.getByText("Delete");
      fireEvent.click(confirmButton);

      await waitFor(() => {
        expect(
          screen.getByText("Ambition deleted successfully")
        ).toBeInTheDocument();
      });

      // Close button should be present
      const closeButtons = screen.getAllByRole("button", { name: /close/i });
      expect(closeButtons.length).toBeGreaterThan(0);
    });
  });
});

// Made with Bob
