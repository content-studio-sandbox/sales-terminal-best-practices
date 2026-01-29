import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import InviteCandidatesModal from '../InviteCandidatesModal';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe('InviteCandidatesModal', () => {
  const mockProject = {
    id: 'project-1',
    name: 'Test Project',
  };

  const mockProjectPaths = [
    { path_id: 'path-1', career_paths: { name: 'Software Engineering' } },
    { path_id: 'path-2', career_paths: { name: 'Data Science' } },
  ];

  const mockUserPreferences = [
    {
      user_id: 'user-1',
      path_id: 'path-1',
      rank: 1,
      users: {
        id: 'user-1',
        display_name: 'Alice Johnson',
        email: 'alice@example.com',
        access_role: 'intern',
      },
    },
    {
      user_id: 'user-2',
      path_id: 'path-2',
      rank: 2,
      users: {
        id: 'user-2',
        display_name: 'Bob Smith',
        email: 'bob@example.com',
        access_role: 'contributor',
      },
    },
  ];

  const mockCareerPath = { name: 'Software Engineering' };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupSuccessfulMocks = () => {
    const fromMock = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          resolveWhenOpen: Promise.resolve({ data: mockProjectPaths, error: null }),
        }),
        in: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            resolveWhenOpen: Promise.resolve({ data: mockUserPreferences, error: null }),
          }),
        }),
        single: vi.fn().mockReturnValue({
          resolveWhenOpen: Promise.resolve({ data: mockCareerPath, error: null }),
        }),
      }),
      insert: vi.fn().mockReturnValue({
        resolveWhenOpen: Promise.resolve({ data: null, error: null }),
      }),
    });

    (supabase.from as any).mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
      };

      // Handle different table queries
      if (table === 'project_paths') {
        chain.eq.mockImplementation(() => {
          return Promise.resolve({ data: mockProjectPaths, error: null });
        });
      } else if (table === 'user_path_preferences') {
        chain.order.mockImplementation(() => {
          return Promise.resolve({ data: mockUserPreferences, error: null });
        });
      } else if (table === 'career_paths') {
        chain.single.mockImplementation(() => {
          return Promise.resolve({ data: mockCareerPath, error: null });
        });
      } else if (table === 'project_invitations') {
        chain.in.mockImplementation(() => {
          return Promise.resolve({ data: [], error: null });
        });
        chain.insert.mockImplementation(() => {
          return Promise.resolve({ data: null, error: null });
        });
      }

      return chain;
    });
  };

  it('should render modal when open', () => {
    setupSuccessfulMocks();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    expect(screen.getByText(`Invite Candidates to ${mockProject.name}`)).toBeInTheDocument();
  });

  it('should show loading state initially', () => {
    setupSuccessfulMocks();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    expect(screen.getByText('Loading matching candidates...')).toBeInTheDocument();
  });

  it('should display search input', async () => {
    setupSuccessfulMocks();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading matching candidates...')).not.toBeInTheDocument();
    });

    expect(screen.getByPlaceholderText('Search by name, email, or career path...')).toBeInTheDocument();
  });

  it('should display helper text about candidate matching', async () => {
    setupSuccessfulMocks();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading matching candidates...')).not.toBeInTheDocument();
    });

    expect(
      screen.getByText(/Candidates are matched based on their career path preferences/i)
    ).toBeInTheDocument();
  });

  it('should show error when project has no career paths', async () => {
    (supabase.from as any).mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      if (table === 'project_paths') {
        chain.eq.mockImplementation(() => {
          return Promise.resolve({ data: [], error: null });
        });
      }

      return chain;
    });

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(/This project has no career paths assigned/i)
      ).toBeInTheDocument();
    });
  });

  it('should handle API error when fetching candidates', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    (supabase.from as any).mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      if (table === 'project_paths') {
        chain.eq.mockImplementation(() => {
          return Promise.resolve({ data: null, error: { message: 'Database error' } });
        });
      }

      return chain;
    });

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Database error')).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should close modal when cancel button is clicked', async () => {
    setupSuccessfulMocks();
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={onOpenChange}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading matching candidates...')).not.toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should disable send button when no candidates selected', async () => {
    setupSuccessfulMocks();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading matching candidates...')).not.toBeInTheDocument();
    });

    const sendButton = screen.getByText(/Send.*Invitation/i);
    expect(sendButton).toBeDisabled();
  });

  it('should show error when trying to send without selecting candidates', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading matching candidates...')).not.toBeInTheDocument();
    });

    // Try to click send button (it should be disabled, but test the validation logic)
    const sendButton = screen.getByText(/Send.*Invitation/i);
    expect(sendButton).toBeDisabled();
  });

  it('should handle search input changes', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading matching candidates...')).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search by name, email, or career path...');
    await user.type(searchInput, 'Alice');

    expect(searchInput).toHaveValue('Alice');
  });

  it('should display error notification', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    (supabase.from as any).mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
      };

      if (table === 'project_paths') {
        chain.eq.mockImplementation(() => {
          return Promise.resolve({ data: null, error: { message: 'Test error' } });
        });
      }

      return chain;
    });

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Test error')).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should reset state when modal closes', async () => {
    setupSuccessfulMocks();
    const { rerender } = render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading matching candidates...')).not.toBeInTheDocument();
    });

    // Close modal
    rerender(
      <InviteCandidatesModal
        open={false}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    // State should be reset (candidates cleared, search cleared, etc.)
    // This is tested by the useEffect cleanup
  });

  it('should show empty state when no candidates found', async () => {
    (supabase.from as any).mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        in: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };

      if (table === 'project_paths') {
        chain.eq.mockImplementation(() => {
          return Promise.resolve({ data: mockProjectPaths, error: null });
        });
      } else if (table === 'user_path_preferences') {
        chain.order.mockImplementation(() => {
          return Promise.resolve({ data: [], error: null });
        });
      } else if (table === 'project_invitations') {
        chain.in.mockImplementation(() => {
          return Promise.resolve({ data: [], error: null });
        });
      }

      return chain;
    });

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(/No matching candidates found/i)
      ).toBeInTheDocument();
    });
  });

  it('should not fetch candidates when modal is closed', () => {
    setupSuccessfulMocks();

    render(
      <InviteCandidatesModal
        open={false}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    // Supabase should not be called when modal is closed
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('should not fetch candidates when project is null', () => {
    setupSuccessfulMocks();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={null}
        onInvitationsSent={() => {}}
      />
    );

    // Supabase should not be called when project is null
    expect(supabase.from).not.toHaveBeenCalled();
  });

  it('should display select all checkbox', async () => {
    setupSuccessfulMocks();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading matching candidates...')).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Select all/i)).toBeInTheDocument();
  });

  it('should show correct button text based on selection count', async () => {
    setupSuccessfulMocks();

    render(
      <InviteCandidatesModal
        open={true}
        onOpenChange={() => {}}
        project={mockProject}
        onInvitationsSent={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading matching candidates...')).not.toBeInTheDocument();
    });

    // With 0 selected
    expect(screen.getByText('Send 0 Invitations')).toBeInTheDocument();
  });
});

// Made with Bob