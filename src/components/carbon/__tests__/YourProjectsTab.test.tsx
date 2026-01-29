import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import YourProjectsTab from '../YourProjectsTab';
import { supabase } from '@/integrations/supabase/client';

// Mock child components
vi.mock('../EditProjectModal', () => ({
  default: () => null
}));

vi.mock('../ViewProjectModal', () => ({
  default: () => null
}));

vi.mock('./ApplicantProfileModal', () => ({
  default: () => null
}));

vi.mock('./InternProjectBoard', () => ({
  default: () => null
}));

vi.mock('./CreateProjectModal', () => ({
  default: () => null
}));

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

describe('YourProjectsTab - Leader/Manager View (Talent Pool)', () => {
  const leaderUser = {
    id: '00000000-0000-0000-0000-000000000001',
    access_role: 'leader',
    email: 'leader@test.com',
    display_name: 'Test Leader'
  };

  const managerUser = {
    id: '00000000-0000-0000-0000-000000000002',
    access_role: 'manager',
    email: 'manager@test.com',
    display_name: 'Test Manager'
  };

  const mockCandidates = [
    {
      id: 'candidate-1',
      display_name: 'Alice Johnson',
      email: 'alice@test.com',
      interests: 'AI and machine learning projects',
      experience: '3 years',
      access_role: 'intern',
      user_skills: [
        { skill: { name: 'Python' } },
        { skill: { name: 'React' } },
        { skill: { name: 'TypeScript' } }
      ],
      user_path_preferences: [
        { rank: 1, path: { name: 'Data Science' } },
        { rank: 2, path: { name: 'Full Stack Development' } }
      ]
    },
    {
      id: 'candidate-2',
      display_name: 'Bob Smith',
      email: 'bob@test.com',
      interests: 'Cloud infrastructure and DevOps',
      experience: '2 years',
      access_role: 'intern',
      user_skills: [
        { skill: { name: 'AWS' } },
        { skill: { name: 'Docker' } }
      ],
      user_path_preferences: [
        { rank: 1, path: { name: 'Cloud Engineering' } }
      ]
    },
    {
      id: 'candidate-3',
      display_name: 'Carol Davis',
      email: 'carol@test.com',
      interests: 'Frontend development and UX design',
      experience: '1 year',
      access_role: 'intern',
      user_skills: [
        { skill: { name: 'React' } },
        { skill: { name: 'CSS' } },
        { skill: { name: 'Figma' } }
      ],
      user_path_preferences: [
        { rank: 1, path: { name: 'Full Stack Development' } }
      ]
    }
  ];

  const mockSkills = [
    { name: 'Python' },
    { name: 'React' },
    { name: 'TypeScript' },
    { name: 'AWS' },
    { name: 'Docker' },
    { name: 'CSS' },
    { name: 'Figma' }
  ];

  const mockCareerPaths = [
    { id: 'path-1', name: 'Data Science' },
    { id: 'path-2', name: 'Full Stack Development' },
    { id: 'path-3', name: 'Cloud Engineering' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    const createMockChain = (data: any = []) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      
      (chain as any).then = function(resolve: any) {
        return Promise.resolve({ data, error: null }).then(resolve);
      };
      
      return chain;
    };
    
    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'users') {
        return createMockChain(mockCandidates);
      }
      if (table === 'skills') {
        return createMockChain(mockSkills);
      }
      if (table === 'career_paths') {
        return createMockChain(mockCareerPaths);
      }
      return createMockChain();
    });
  });

  it('should render Talent Pool heading for leaders', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Talent Pool')).toBeInTheDocument();
    });
  });

  it('should render Talent Pool heading for managers', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={managerUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Talent Pool')).toBeInTheDocument();
    });
  });

  it('should have Create Project button for leaders', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Talent Pool')).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /create project/i });
    expect(createButton).toBeInTheDocument();
  });

  it('should display all candidates initially', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.getByText('Carol Davis')).toBeInTheDocument();
    });

    expect(screen.getByText('Showing 3 of 3 candidates')).toBeInTheDocument();
  });

  it('should filter candidates by search term (name)', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by name, email, or interests/i);
    await user.type(searchInput, 'Alice');

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
      expect(screen.queryByText('Carol Davis')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 3 candidates')).toBeInTheDocument();
    });
  });

  it('should filter candidates by search term (email)', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by name, email, or interests/i);
    await user.type(searchInput, 'bob@test.com');

    await waitFor(() => {
      expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
      expect(screen.getByText('Showing 1 of 3 candidates')).toBeInTheDocument();
    });
  });

  it('should filter candidates by search term (interests)', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Carol Davis')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by name, email, or interests/i);
    await user.type(searchInput, 'UX design');

    await waitFor(() => {
      expect(screen.getByText('Carol Davis')).toBeInTheDocument();
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
      expect(screen.queryByText('Bob Smith')).not.toBeInTheDocument();
    });
  });

  it('should show no results message when search has no matches', async () => {
    const user = userEvent.setup();
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/search by name, email, or interests/i);
    await user.type(searchInput, 'NonexistentName');

    await waitFor(() => {
      expect(screen.getByText(/no candidates match your filters/i)).toBeInTheDocument();
      expect(screen.queryByText('Alice Johnson')).not.toBeInTheDocument();
    });
  });

  it('should display candidate skills with tags', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Alice has Python, React, TypeScript (shows first 3)
    expect(screen.getByText('Python')).toBeInTheDocument();
    // React appears multiple times (Alice and Carol both have it), so use getAllByText
    const reactTags = screen.getAllByText('React');
    expect(reactTags.length).toBeGreaterThan(0);
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('should display candidate career paths with ranking', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    // Alice has Data Science (#1) and Full Stack Development (#2)
    expect(screen.getByText('#1 Data Science')).toBeInTheDocument();
    expect(screen.getByText('#2 Full Stack Development')).toBeInTheDocument();
  });

  it('should display candidate experience', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    });

    expect(screen.getByText('3 years')).toBeInTheDocument();
    expect(screen.getByText('2 years')).toBeInTheDocument();
    expect(screen.getByText('1 year')).toBeInTheDocument();
  });

  it('should truncate long interests text', async () => {
    const longInterestCandidate = {
      ...mockCandidates[0],
      interests: 'A'.repeat(150) // 150 characters
    };

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'users') {
        const createMockChain = (data: any = []) => {
          const chain = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            neq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
          };
          (chain as any).then = function(resolve: any) {
            return Promise.resolve({ data, error: null }).then(resolve);
          };
          return chain;
        };
        return createMockChain([longInterestCandidate]);
      }
      return vi.fn().mockReturnThis();
    });

    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const truncatedText = screen.getByText(/A{100}\.\.\./, { exact: false });
      expect(truncatedText).toBeInTheDocument();
    });
  });

  it('should show +N more tag when candidate has more than 3 skills', async () => {
    const manySkillsCandidate = {
      ...mockCandidates[0],
      user_skills: [
        { skill: { name: 'Skill1' } },
        { skill: { name: 'Skill2' } },
        { skill: { name: 'Skill3' } },
        { skill: { name: 'Skill4' } },
        { skill: { name: 'Skill5' } }
      ]
    };

    (supabase.from as any).mockImplementation((table: string) => {
      if (table === 'users') {
        const createMockChain = (data: any = []) => {
          const chain = {
            select: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            neq: vi.fn().mockReturnThis(),
            order: vi.fn().mockReturnThis(),
          };
          (chain as any).then = function(resolve: any) {
            return Promise.resolve({ data, error: null }).then(resolve);
          };
          return chain;
        };
        return createMockChain([manySkillsCandidate]);
      }
      return vi.fn().mockReturnThis();
    });

    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('+2 more')).toBeInTheDocument();
    });
  });

  it('should handle error when fetching talent pool fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (supabase.from as any).mockImplementation(() => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
      };
      (chain as any).then = function(resolve: any) {
        return Promise.resolve({ data: null, error: { message: 'Database error' } }).then(resolve);
      };
      return chain;
    });

    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading talent pool')).toBeInTheDocument();
      expect(screen.getByText('Database error')).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });
});

describe('YourProjectsTab - Intern View (My Projects)', () => {
  const internUser = {
    id: '00000000-0000-0000-0000-000000000003',
    access_role: 'intern',
    email: 'intern@test.com',
    display_name: 'Test Intern'
  };

  const mockContributingProjects = [
    {
      id: 'project-2',
      name: 'Cloud Migration',
      description: 'Migrate services to cloud',
      status: 'in progress',
      deadline: '2025-11-30',
      project_manager: { display_name: 'John Manager' }
    },
    {
      id: 'project-3',
      name: 'Mobile App',
      description: 'Develop mobile application',
      status: 'not started',
      deadline: '2026-01-15',
      project_manager: { display_name: 'Jane Lead' }
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    
    (supabase.from as any).mockImplementation((table: string) => {
      const createMockChain = (data: any = []) => {
        const chain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          neq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
          insert: vi.fn().mockReturnThis(),
          update: vi.fn().mockReturnThis(),
          delete: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null, error: null }),
          maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
        };
        
        (chain as any).then = function(resolve: any) {
          return Promise.resolve({ data, error: null }).then(resolve);
        };
        
        return chain;
      };

      if (table === 'projects') {
        return createMockChain([]);
      }
      if (table === 'project_staff') {
        return createMockChain(mockContributingProjects.map(p => ({ project: p })));
      }
      if (table === 'project_join_requests') {
        return createMockChain([]);
      }
      return createMockChain();
    });
  });

  it('should render My Projects heading for interns', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('My Projects')).toBeInTheDocument();
    });
  });

  it('should display contributing projects', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Cloud Migration')).toBeInTheDocument();
      expect(screen.getByText('Mobile App')).toBeInTheDocument();
    });
  });

  it('should show empty state when no projects assigned', async () => {
    (supabase.from as any).mockImplementation(() => {
      const createMockChain = () => {
        const chain = {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          order: vi.fn().mockReturnThis(),
        };
        (chain as any).then = function(resolve: any) {
          return Promise.resolve({ data: [], error: null }).then(resolve);
        };
        return chain;
      };
      return createMockChain();
    });

    render(
      <BrowserRouter>
        <YourProjectsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('No Projects Assigned Yet')).toBeInTheDocument();
      expect(screen.getByText(/once you're assigned to a project/i)).toBeInTheDocument();
    });
  });

  it('should display project status with correct color', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('In Progress')).toBeInTheDocument();
      expect(screen.getByText('Not Started')).toBeInTheDocument();
    });
  });

  it('should display project manager name', async () => {
    render(
      <BrowserRouter>
        <YourProjectsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('John Manager')).toBeInTheDocument();
      expect(screen.getByText('Jane Lead')).toBeInTheDocument();
    });
  });

  it('should handle error when fetching projects fails', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    
    (supabase.from as any).mockImplementation(() => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };
      (chain as any).then = function(resolve: any) {
        return Promise.resolve({ data: null, error: { message: 'Fetch error' } }).then(resolve);
      };
      return chain;
    });

    render(
      <BrowserRouter>
        <YourProjectsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading projects')).toBeInTheDocument();
      expect(screen.getByText('Fetch error')).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });
});

describe('YourProjectsTab - Utility Functions', () => {
  const leaderUser = {
    id: '00000000-0000-0000-0000-000000000001',
    access_role: 'leader',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    const createMockChain = () => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };
      (chain as any).then = function(resolve: any) {
        return Promise.resolve({ data: [], error: null }).then(resolve);
      };
      return chain;
    };
    
    (supabase.from as any).mockImplementation(() => createMockChain());
  });

  it('should close notification when close button is clicked', async () => {
    const user = userEvent.setup();
    
    (supabase.from as any).mockImplementation(() => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
      };
      (chain as any).then = function(resolve: any) {
        return Promise.resolve({ data: null, error: { message: 'Test error' } }).then(resolve);
      };
      return chain;
    });

    render(
      <BrowserRouter>
        <YourProjectsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Error loading talent pool')).toBeInTheDocument();
    });

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Error loading talent pool')).not.toBeInTheDocument();
    });
  });
});

// Made with Bob
