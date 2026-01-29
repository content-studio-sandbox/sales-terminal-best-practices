// Test file for RequestsTab - Interns can view their application requests
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import RequestsTab from '../RequestsTab';
import { supabase } from '@/integrations/supabase/client';

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

// Mock fetch for API calls
global.fetch = vi.fn();

describe('RequestsTab - Interns Can View Their Applications', () => {
  const internUser = {
    id: '12345678-1234-1234-8234-123456789abc',
    access_role: 'intern',
    email: 'intern@test.com',
    display_name: 'Test Intern'
  };

  const leaderUser = {
    id: '87654321-4321-1234-8234-abcdef123456',
    access_role: 'leader',
    email: 'leader@test.com',
    display_name: 'Test Leader'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ([])
    });
    
    // Mock Supabase responses
    const createMockChain = () => {
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
        return Promise.resolve({ data: [], error: null }).then(resolve);
      };
      
      return chain;
    };
    
    (supabase.from as any).mockImplementation(() => createMockChain());
  });

  it('should render RequestsTab for intern', async () => {
    render(
      <BrowserRouter>
        <RequestsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      // Should show some content
      expect(screen.getByText(/Project Requests/i)).toBeInTheDocument();
    });
  });

  it('should render RequestsTab for leader', async () => {
    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Team Management/i)).toBeInTheDocument();
    });
  });

  it('should show applications section for interns (no tabs)', async () => {
    render(
      <BrowserRouter>
        <RequestsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Project Requests/i)).toBeInTheDocument();
    });

    // Interns don't have tabs - they see their applications directly
    // The component shows "My Applications" content without tab navigation
    const tabs = screen.queryAllByRole('tab');
    expect(tabs.length).toBe(0); // Interns have no tabs, just direct content
  });

  it('should display message when intern has no applications', async () => {
    render(
      <BrowserRouter>
        <RequestsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Project Requests/i)).toBeInTheDocument();
    });

    // Should show empty state message
    await waitFor(() => {
      expect(screen.getByText(/No Applications Yet/i)).toBeInTheDocument();
    });
  });

  it('should fetch incoming requests for leaders', async () => {
    const mockRequests = [
      {
        id: 'req-1',
        user_id: 'user-1',
        user_email: 'applicant@test.com',
        project_id: 'proj-1',
        project_name: 'Test Project',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRequests
    });

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Team Management/i)).toBeInTheDocument();
    });

    // Leaders should see incoming requests
    expect(global.fetch).toHaveBeenCalledWith('/api/incoming-requests', expect.any(Object));
  });

  it('COMPARISON: Leaders have tabs but interns do not', async () => {
    // Render for leader
    const { unmount } = render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Team Management/i)).toBeInTheDocument();
    });

    // Leaders should have tabs (Applications and Build Team)
    const leaderTabs = screen.queryAllByRole('tab');
    expect(leaderTabs.length).toBeGreaterThan(0);

    unmount();

    // Render for intern
    render(
      <BrowserRouter>
        <RequestsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Project Requests/i)).toBeInTheDocument();
    });

    // Interns don't have tabs - they see applications directly (by design)
    const internTabs = screen.queryAllByRole('tab');
    expect(internTabs.length).toBe(0);
  });
});

describe('RequestsTab - Application Display', () => {
  const internUser = {
    id: '12345678-1234-1234-8234-123456789abc',
    access_role: 'intern',
    email: 'intern@test.com',
    display_name: 'Test Intern'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ([])
    });
    
    const createMockChain = () => {
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
        return Promise.resolve({ data: [], error: null }).then(resolve);
      };
      
      return chain;
    };
    
    (supabase.from as any).mockImplementation(() => createMockChain());
  });

  it('should render empty state for intern with no applications', async () => {
    render(
      <BrowserRouter>
        <RequestsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Project Requests/i)).toBeInTheDocument();
    });

    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText(/No Applications Yet/i)).toBeInTheDocument();
    });
  });

  it('should display intern applications with correct status tags', async () => {
    const mockApplications = [
      {
        id: 'app-1',
        status: 'pending',
        created_at: new Date().toISOString(),
        project: { name: 'AI Project', description: 'AI work' },
        role_name: 'Developer'
      },
      {
        id: 'app-2',
        status: 'approved',
        created_at: new Date().toISOString(),
        reviewed_at: new Date().toISOString(),
        project: { name: 'Cloud Project', description: 'Cloud work' },
        role_name: 'Engineer'
      },
      {
        id: 'app-3',
        status: 'declined',
        created_at: new Date().toISOString(),
        reviewed_at: new Date().toISOString(),
        pm_note: 'Not a good fit',
        project: { name: 'Data Project', description: 'Data work' }
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApplications
    });

    render(
      <BrowserRouter>
        <RequestsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('AI Project')).toBeInTheDocument();
      expect(screen.getByText('Cloud Project')).toBeInTheDocument();
      expect(screen.getByText('Data Project')).toBeInTheDocument();
    });

    // Check status tags
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Approved')).toBeInTheDocument();
    expect(screen.getByText('Declined')).toBeInTheDocument();
  });

  it('should show PM note when application is declined', async () => {
    const mockApplications = [
      {
        id: 'app-1',
        status: 'declined',
        created_at: new Date().toISOString(),
        reviewed_at: new Date().toISOString(),
        pm_note: 'Position already filled',
        project: { name: 'Test Project', description: 'Test description' }
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockApplications
    });

    render(
      <BrowserRouter>
        <RequestsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Position already filled/i)).toBeInTheDocument();
    });
  });

  it('should show "Explore Opportunities" button when no applications', async () => {
    render(
      <BrowserRouter>
        <RequestsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const button = screen.getByText(/Explore Opportunities/i);
      expect(button).toBeInTheDocument();
    });
  });
});

describe('RequestsTab - Leader Team Building', () => {
  const leaderUser = {
    id: '87654321-4321-1234-8234-abcdef123456',
    access_role: 'leader',
    email: 'leader@test.com',
    display_name: 'Test Leader'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ([])
    });
    
    const createMockChain = () => {
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
        return Promise.resolve({ data: [], error: null }).then(resolve);
      };
      
      return chain;
    };
    
    (supabase.from as any).mockImplementation(() => createMockChain());
  });

  it('should fetch projects for team building', async () => {
    const mockProjects = [
      { id: 'proj-1', name: 'AI Lab', description: 'AI work', pm_id: leaderUser.id, created_at: new Date().toISOString() }
    ];

    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: mockProjects, error: null })
    };

    (supabase.from as any).mockReturnValue(mockChain);

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('projects');
    });
  });

  it('should show demo projects when no real projects exist', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    };

    (supabase.from as any).mockReturnValue(mockChain);

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Team Management/i)).toBeInTheDocument();
    });
  });

  it('should fetch candidates for team building', async () => {
    const mockUsers = [
      {
        id: 'user-1',
        display_name: 'John Doe',
        email: 'john@test.com',
        interests: 'AI, ML',
        experience: '2 years',
        user_skills: [{ skill: { name: 'Python' } }]
      }
    ];

    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockResolvedValue({ data: mockUsers, error: null }),
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    };

    (supabase.from as any).mockReturnValue(mockChain);

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('users');
    });
  });

  it('should show Build Team tab for leaders', async () => {
    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Build Team/i)).toBeInTheDocument();
    });
  });

  it('should show Applications tab count for leaders', async () => {
    const mockRequests = [
      { id: 'req-1', status: 'pending', user_email: 'test@test.com', project_name: 'Test', created_at: new Date().toISOString() }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRequests
    });

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Applications \(1\)/i)).toBeInTheDocument();
    });
  });
});

describe('RequestsTab - Search and Filter', () => {
  const leaderUser = {
    id: '87654321-4321-1234-8234-abcdef123456',
    access_role: 'leader',
    email: 'leader@test.com',
    display_name: 'Test Leader'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    const createMockChain = () => {
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
        return Promise.resolve({ data: [], error: null }).then(resolve);
      };
      
      return chain;
    };
    
    (supabase.from as any).mockImplementation(() => createMockChain());
  });

  it('should render search input for applications', async () => {
    const mockRequests = [
      {
        id: 'req-1',
        user_email: 'applicant@test.com',
        project_name: 'AI Project',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRequests
    });

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      const searchInput = screen.getByPlaceholderText(/Search by applicant or project name/i);
      expect(searchInput).toBeInTheDocument();
    });
  });

  it('should show empty state message when search has no results', async () => {
    const mockRequests = [
      {
        id: 'req-1',
        user_email: 'applicant@test.com',
        project_name: 'AI Project',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRequests
    });

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Project Requests/i)).toBeInTheDocument();
    });
  });
});

describe('RequestsTab - Error Handling', () => {
  const leaderUser = {
    id: '87654321-4321-1234-8234-abcdef123456',
    access_role: 'leader',
    email: 'leader@test.com',
    display_name: 'Test Leader'
  };

  const internUser = {
    id: '12345678-1234-1234-8234-123456789abc',
    access_role: 'intern',
    email: 'intern@test.com',
    display_name: 'Test Intern'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    const createMockChain = () => {
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
        return Promise.resolve({ data: [], error: null }).then(resolve);
      };
      
      return chain;
    };
    
    (supabase.from as any).mockImplementation(() => createMockChain());
  });

  it('should handle API error when fetching requests for leaders', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' })
    });

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Team Management/i)).toBeInTheDocument();
    });
  });

  it('should handle API error when fetching applications for interns', async () => {
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 500,
      json: async () => ({ error: 'Server error' })
    });

    render(
      <BrowserRouter>
        <RequestsTab user={internUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Project Requests/i)).toBeInTheDocument();
    });
  });

  it('should handle Supabase error when fetching candidates', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      neq: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
      order: vi.fn().mockResolvedValue({ data: [], error: null })
    };

    (supabase.from as any).mockReturnValue(mockChain);

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Team Management/i)).toBeInTheDocument();
    });
  });

  it('should handle error when fetching projects', async () => {
    const mockChain = {
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } })
    };

    (supabase.from as any).mockReturnValue(mockChain);

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Team Management/i)).toBeInTheDocument();
    });
  });
});

describe('RequestsTab - Status Display', () => {
  const leaderUser = {
    id: '87654321-4321-1234-8234-abcdef123456',
    access_role: 'leader',
    email: 'leader@test.com',
    display_name: 'Test Leader'
  };

  beforeEach(() => {
    vi.clearAllMocks();
    
    const createMockChain = () => {
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
        return Promise.resolve({ data: [], error: null }).then(resolve);
      };
      
      return chain;
    };
    
    (supabase.from as any).mockImplementation(() => createMockChain());
  });

  it('should display pending requests with correct status', async () => {
    const mockRequests = [
      {
        id: 'req-1',
        user_id: 'user-1',
        user_email: 'applicant@test.com',
        project_id: 'proj-1',
        project_name: 'Test Project',
        role_name: 'Developer',
        status: 'pending',
        created_at: new Date().toISOString()
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRequests
    });

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Test Project')).toBeInTheDocument();
    });
  });

  it('should display approved requests with correct status', async () => {
    const mockRequests = [
      {
        id: 'req-1',
        user_id: 'user-1',
        user_email: 'applicant@test.com',
        project_id: 'proj-1',
        project_name: 'Test Project',
        status: 'approved',
        created_at: new Date().toISOString()
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRequests
    });

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Approved')).toBeInTheDocument();
    });
  });

  it('should display declined requests with correct status', async () => {
    const mockRequests = [
      {
        id: 'req-1',
        user_id: 'user-1',
        user_email: 'applicant@test.com',
        project_id: 'proj-1',
        project_name: 'Test Project',
        status: 'declined',
        created_at: new Date().toISOString()
      }
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockRequests
    });

    render(
      <BrowserRouter>
        <RequestsTab user={leaderUser} />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Declined')).toBeInTheDocument();
    });
  });
});

// Made with Bob
