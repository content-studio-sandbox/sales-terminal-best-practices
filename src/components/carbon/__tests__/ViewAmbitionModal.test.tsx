import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewAmbitionModal from '../ViewAmbitionModal';
import { supabase } from '@/integrations/supabase/client';

// Mock EditAmbitionModal
vi.mock('../EditAmbitionModal', () => ({
  default: ({ open, onOpenChange }: any) => 
    open ? <div data-testid="edit-ambition-modal">Edit Ambition Modal</div> : null
}));

describe('ViewAmbitionModal', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnViewProjects = vi.fn();
  const mockOnUpdate = vi.fn();

  const mockAmbition = {
    id: 'ambition-123',
    title: 'Digital Transformation Initiative',
    description: 'Transform our digital infrastructure'
  };

  const mockAmbitionDetails = {
    id: 'ambition-123',
    name: 'Digital Transformation Initiative',
    description: 'Transform our digital infrastructure',
    leader_id: 'leader-456',
    business_value: 'Increase efficiency',
    expected_roi: 25,
    strategic_priority: 'high'
  };

  const mockLeader = {
    id: 'leader-456',
    display_name: 'John Leader',
    email: 'john@example.com'
  };

  const mockProjects = [
    {
      id: 'project-1',
      name: 'Project Alpha',
      description: 'First project',
      status: 'active',
      ambition_name: 'Digital Transformation Initiative'
    },
    {
      id: 'project-2',
      name: 'Project Beta',
      description: 'Second project',
      status: 'completed',
      ambition_name: 'Digital Transformation Initiative'
    },
    {
      id: 'project-3',
      name: 'Project Gamma',
      description: 'Third project',
      status: 'active',
      ambition_name: 'Digital Transformation Initiative'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Rendering', () => {
    it('should not render when open is false', () => {
      const { container } = render(
        <ViewAmbitionModal
          open={false}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      const modal = container.querySelector('.cds--modal');
      expect(modal).not.toHaveClass('is-visible');
    });

    it('should render modal when open is true', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
        rpc: vi.fn().mockResolvedValue({ data: mockProjects, error: null }),
      } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Digital Transformation Initiative')).toBeInTheDocument();
      });
    });

    it('should display loading state while fetching data', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
          }),
        }),
      } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      expect(screen.getByText('Loading initiative details...')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch ambition details when modal opens', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
        rpc: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('ambitions');
        expect(mockSelect).toHaveBeenCalledWith('*');
      });
    });

    it('should fetch leader details if leader_id exists', async () => {
      const mockFrom = vi.fn().mockImplementation((table: string) => {
        if (table === 'ambitions') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
              }),
            }),
          };
        } else if (table === 'users') {
          return {
            select: vi.fn().mockReturnValue({
              eq: vi.fn().mockReturnValue({
                single: vi.fn().mockResolvedValue({ data: mockLeader, error: null }),
              }),
            }),
          };
        }
        return { rpc: vi.fn().mockResolvedValue({ data: [], error: null }) };
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);
      vi.mocked(supabase.rpc).mockResolvedValue({ data: [], error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Initiative Leader')).toBeInTheDocument();
        expect(screen.getByText('John Leader')).toBeInTheDocument();
      });
    });

    it('should fetch projects for the ambition', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockProjects, error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(supabase.rpc).toHaveBeenCalledWith('get_projects_enhanced');
      });
    });

    it('should handle fetch error gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
          }),
        }),
      } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching ambition details:', expect.any(Object));
      });

      consoleErrorSpy.mockRestore();
    });

    it('should not fetch data when ambition has no id', () => {
      const ambitionWithoutId = { title: 'Test' };

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={ambitionWithoutId}
        />
      );

      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('Content Display', () => {
    it('should display ambition description', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: [], error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Transform our digital infrastructure')).toBeInTheDocument();
      });
    });

    it('should display project statistics', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockProjects, error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Total Projects')).toBeInTheDocument();
        expect(screen.getByText('Active Projects')).toBeInTheDocument();
        expect(screen.getByText('Completed')).toBeInTheDocument();
      });
    });

    it('should calculate completion rate correctly', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockProjects, error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        // 1 completed out of 3 projects = 33%
        expect(screen.getByText('33%')).toBeInTheDocument();
      });
    });

    it('should display recent projects', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockProjects, error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Project Alpha')).toBeInTheDocument();
        expect(screen.getByText('Project Beta')).toBeInTheDocument();
        expect(screen.getByText('Project Gamma')).toBeInTheDocument();
      });
    });

    it('should show "No Projects Yet" message when no projects exist', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: [], error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('No Projects Yet')).toBeInTheDocument();
      });
    });

    it('should limit displayed projects to 3', async () => {
      const manyProjects = [
        ...mockProjects,
        { id: 'project-4', name: 'Project Delta', description: 'Fourth', status: 'active', ambition_name: 'Digital Transformation Initiative' },
        { id: 'project-5', name: 'Project Epsilon', description: 'Fifth', status: 'active', ambition_name: 'Digital Transformation Initiative' }
      ];

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: manyProjects, error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('+2 more projects available')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should open edit modal when edit button is clicked', async () => {
      const user = userEvent.setup();

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: [], error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit')).toBeInTheDocument();
      });

      const editButton = screen.getByText('Edit');
      await user.click(editButton);

      await waitFor(() => {
        expect(screen.getByTestId('edit-ambition-modal')).toBeInTheDocument();
      });
    });

    it('should show "View All Projects" button when projects exist', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockProjects, error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onViewProjects={mockOnViewProjects}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('View All Projects')).toBeInTheDocument();
      });
    });

    it('should not show "View All Projects" button when no projects exist', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: [], error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onViewProjects={mockOnViewProjects}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('No Projects Yet')).toBeInTheDocument();
      });

      expect(screen.queryByText('View All Projects')).not.toBeInTheDocument();
    });

    it('should call onViewProjects when "View All Projects" is clicked', async () => {
      const user = userEvent.setup();

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockProjects, error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onViewProjects={mockOnViewProjects}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('View All Projects')).toBeInTheDocument();
      });

      const viewProjectsButton = screen.getByText('View All Projects');
      await user.click(viewProjectsButton);

      expect(mockOnViewProjects).toHaveBeenCalledWith('Digital Transformation Initiative');
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Tags and Status', () => {
    it('should display "Strategic Initiative" tag', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: [], error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Strategic Initiative')).toBeInTheDocument();
      });
    });

    it('should display project count tag when projects exist', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockAmbitionDetails, error: null }),
          }),
        }),
      } as any);

      vi.mocked(supabase.rpc).mockResolvedValue({ data: mockProjects, error: null } as any);

      render(
        <ViewAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('3 Projects')).toBeInTheDocument();
      });
    });
  });
});

// Made with Bob
