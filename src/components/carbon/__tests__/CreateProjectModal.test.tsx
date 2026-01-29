import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import CreateProjectModal from '../CreateProjectModal';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getUser: vi.fn(),
    },
  },
}));

describe('CreateProjectModal', () => {
  const mockAmbitions = [
    { id: 'amb-1', name: 'Innovation' },
    { id: 'amb-2', name: 'Growth' },
  ];

  const mockSkills = [
    { id: 'skill-1', name: 'JavaScript' },
    { id: 'skill-2', name: 'Python' },
  ];

  const mockRoles = [
    { id: 'role-1', name: 'Developer' },
    { id: 'role-2', name: 'Designer' },
  ];

  const mockProducts = [
    { id: 'prod-1', name: 'Watson' },
    { id: 'prod-2', name: 'Cloud Pak' },
  ];

  const mockCareerPaths = [
    { id: 'path-1', name: 'Software Engineering' },
    { id: 'path-2', name: 'Data Science' },
  ];

  const mockUser = {
    data: {
      user: { id: 'user-123' },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (supabase.auth.getUser as any).mockResolvedValue(mockUser);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupSuccessfulMocks = () => {
    (supabase.from as any).mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        single: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };

      if (table === 'ambitions') {
        chain.select.mockResolvedValue({ data: mockAmbitions, error: null });
      } else if (table === 'skills') {
        chain.select.mockResolvedValue({ data: mockSkills, error: null });
      } else if (table === 'roles') {
        chain.select.mockResolvedValue({ data: mockRoles, error: null });
      } else if (table === 'products') {
        chain.select.mockResolvedValue({ data: mockProducts, error: null });
      } else if (table === 'career_paths') {
        chain.order.mockResolvedValue({ data: mockCareerPaths, error: null });
      } else if (table === 'projects') {
        chain.single.mockResolvedValue({
          data: { id: 'project-123', name: 'Test Project' },
          error: null,
        });
      } else {
        chain.insert.mockResolvedValue({ data: null, error: null });
      }

      return chain;
    });
  };

  it('should render modal when open', () => {
    setupSuccessfulMocks();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    expect(screen.getByText('Create New Project')).toBeInTheDocument();
  });

  it('should fetch form options when modal opens', async () => {
    setupSuccessfulMocks();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    await waitFor(() => {
      expect(supabase.from).toHaveBeenCalledWith('ambitions');
      expect(supabase.from).toHaveBeenCalledWith('skills');
      expect(supabase.from).toHaveBeenCalledWith('roles');
      expect(supabase.from).toHaveBeenCalledWith('products');
      expect(supabase.from).toHaveBeenCalledWith('career_paths');
    });
  });

  it('should display required form fields', async () => {
    setupSuccessfulMocks();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Project Title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
    });
  });

  it('should handle title input change', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    const titleInput = screen.getByLabelText(/Project Title/i);
    await user.type(titleInput, 'My New Project');

    expect(titleInput).toHaveValue('My New Project');
  });

  it('should handle description input change', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    const descInput = screen.getByLabelText(/Description/i);
    await user.type(descInput, 'Project description');

    expect(descInput).toHaveValue('Project description');
  });

  it('should show error when submitting without required fields', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    const createButton = screen.getByText('Create Project');
    await user.click(createButton);

    await waitFor(() => {
      expect(screen.getByText(/Title and description are required/i)).toBeInTheDocument();
    });
  });

  it('should handle form submission successfully', async () => {
    setupSuccessfulMocks();
    const onProjectCreated = vi.fn();
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={onOpenChange}
        onProjectCreated={onProjectCreated}
      />
    );

    const titleInput = screen.getByLabelText(/Project Title/i);
    const descInput = screen.getByLabelText(/Description/i);

    await user.type(titleInput, 'Test Project');
    await user.type(descInput, 'Test Description');

    const createButton = screen.getByText('Create Project');
    await user.click(createButton);

    await waitFor(() => {
      expect(onProjectCreated).toHaveBeenCalled();
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should close modal when cancel button is clicked', async () => {
    setupSuccessfulMocks();
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={onOpenChange}
        onProjectCreated={() => {}}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should handle hours per week input', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    const hoursInput = screen.getByLabelText(/Time Commitment/i);
    await user.clear(hoursInput);
    await user.type(hoursInput, '20');

    expect(hoursInput).toHaveValue(20);
  });

  it('should handle objectives textarea input', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    const objectivesInput = screen.getByLabelText(/Project Objectives/i);
    await user.type(objectivesInput, 'Test objectives');

    expect(objectivesInput).toHaveValue('Test objectives');
  });

  it('should handle success metrics textarea input', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    const metricsInput = screen.getByLabelText(/Success Metrics/i);
    await user.type(metricsInput, 'Test metrics');

    expect(metricsInput).toHaveValue('Test metrics');
  });

  it('should handle fetch options error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    (supabase.from as any).mockImplementation(() => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };

      chain.select.mockRejectedValue(new Error('Network error'));
      chain.order.mockRejectedValue(new Error('Network error'));

      return chain;
    });

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Failed to load form options/i)).toBeInTheDocument();
    });

    consoleErrorSpy.mockRestore();
  });

  it('should handle missing career paths table gracefully', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    (supabase.from as any).mockImplementation((table: string) => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
      };

      if (table === 'career_paths') {
        chain.order.mockResolvedValue({
          data: null,
          error: { message: 'Table not found' },
        });
      } else if (table === 'ambitions') {
        chain.select.mockResolvedValue({ data: mockAmbitions, error: null });
      } else if (table === 'skills') {
        chain.select.mockResolvedValue({ data: mockSkills, error: null });
      } else if (table === 'roles') {
        chain.select.mockResolvedValue({ data: mockRoles, error: null });
      } else if (table === 'products') {
        chain.select.mockResolvedValue({ data: mockProducts, error: null });
      }

      return chain;
    });

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    await waitFor(() => {
      expect(consoleWarnSpy).toHaveBeenCalledWith(
        expect.stringContaining('Career paths table not found'),
        expect.anything()
      );
    });

    consoleWarnSpy.mockRestore();
  });

  it('should display section labels', async () => {
    setupSuccessfulMocks();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Required Skills/i)).toBeInTheDocument();
      expect(screen.getByText(/Project Roles/i)).toBeInTheDocument();
      expect(screen.getByText(/Suggested IBM Products/i)).toBeInTheDocument();
      expect(screen.getByText(/Relevant Career Paths/i)).toBeInTheDocument();
    });
  });

  it('should display helper text for career paths', async () => {
    setupSuccessfulMocks();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Select career paths that align with this project/i)
      ).toBeInTheDocument();
    });
  });

  it('should display helper text for project tags', async () => {
    setupSuccessfulMocks();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    await waitFor(() => {
      expect(
        screen.getByText(/Add tags to categorize and organize this project/i)
      ).toBeInTheDocument();
    });
  });

  it('should display business value and ROI fields', async () => {
    setupSuccessfulMocks();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/Business Value/i)).toBeInTheDocument();
      expect(screen.getByText(/Expected ROI/i)).toBeInTheDocument();
    });
  });

  it('should display due date picker', async () => {
    setupSuccessfulMocks();

    render(
      <CreateProjectModal
        open={true}
        onOpenChange={() => {}}
        onProjectCreated={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Due Date/i)).toBeInTheDocument();
    });
  });
});

// Made with Bob
