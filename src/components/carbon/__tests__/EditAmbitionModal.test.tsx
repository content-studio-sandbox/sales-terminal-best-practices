import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditAmbitionModal from '../EditAmbitionModal';
import { supabase } from '@/integrations/supabase/client';

describe('EditAmbitionModal', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnUpdate = vi.fn();
  
  const mockAmbition = {
    id: 'ambition-123',
    name: 'Digital Transformation',
    title: 'Digital Transformation',
    description: 'Transform our digital infrastructure',
    business_value: 'Increase efficiency by 50%',
    expected_roi: 25,
    strategic_priority: 'high',
    target_completion: '2025-12-31',
    budget_allocated: 500000,
    leader_id: 'leader-456',
    leader: {
      display_name: 'John Leader',
      email: 'john@example.com'
    }
  };

  const mockLeaders = [
    { id: 'leader-456', display_name: 'John Leader', email: 'john@example.com', access_role: 'leadership' },
    { id: 'leader-789', display_name: 'Jane Manager', email: 'jane@example.com', access_role: 'leader' }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Rendering', () => {
    it('should not render when open is false', () => {
      const { container } = render(
        <EditAmbitionModal
          open={false}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      const modal = container.querySelector('.cds--modal');
      expect(modal).not.toHaveClass('is-visible');
    });

    it('should render modal when open is true', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();
      });
    });

    it('should display modal header with icon and description', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();
        expect(screen.getByText('Update the details of this strategic initiative')).toBeInTheDocument();
      });
    });
  });

  describe('Form Population', () => {
    it('should populate form with ambition data when modal opens', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        const nameInput = screen.getByLabelText('Ambition Name') as HTMLInputElement;
        expect(nameInput.value).toBe('Digital Transformation');
      });

      const descriptionInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      expect(descriptionInput.value).toBe('Transform our digital infrastructure');

      const businessValueInput = screen.getByLabelText('Business Value') as HTMLTextAreaElement;
      expect(businessValueInput.value).toBe('Increase efficiency by 50%');
    });

    it('should handle ambition with title instead of name', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      const ambitionWithTitle = { ...mockAmbition, name: undefined };

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={ambitionWithTitle}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        const nameInput = screen.getByLabelText('Ambition Name') as HTMLInputElement;
        expect(nameInput.value).toBe('Digital Transformation');
      });
    });

    it('should handle ambition with missing optional fields', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      const minimalAmbition = {
        id: 'ambition-123',
        name: 'Test Ambition',
        description: 'Test Description'
      };

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={minimalAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        const nameInput = screen.getByLabelText('Ambition Name') as HTMLInputElement;
        expect(nameInput.value).toBe('Test Ambition');
      });

      const businessValueInput = screen.getByLabelText('Business Value') as HTMLTextAreaElement;
      expect(businessValueInput.value).toBe('');
    });
  });

  describe('Leader Loading', () => {
    it('should load leaders when modal opens', async () => {
      const mockSelect = vi.fn().mockReturnValue({
        in: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
        }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('users');
        expect(mockSelect).toHaveBeenCalledWith('id, display_name, email, access_role');
      });
    });

    it('should handle leader loading error gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: null, error: { message: 'Database error' } }),
          }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith('load leaders failed:', expect.any(Object));
      });

      // Modal should still render
      expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();

      consoleErrorSpy.mockRestore();
    });

    it('should not load leaders when modal is closed', () => {
      render(
        <EditAmbitionModal
          open={false}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should disable update button when name is empty', async () => {
      const user = userEvent.setup();

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText('Ambition Name');
      await user.clear(nameInput);

      const updateButton = screen.getByText('Update Ambition');
      expect(updateButton).toBeDisabled();
    });
  });

  describe('Form Submission', () => {
    it('should successfully update ambition with all fields', async () => {
      const user = userEvent.setup();

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();
      });

      const updateButton = screen.getByText('Update Ambition');
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockOnUpdate).toHaveBeenCalled();
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should trim whitespace from name and description', async () => {
      const user = userEvent.setup();

      const mockUpdate = vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ data: {}, error: null }),
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
        update: mockUpdate,
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText('Ambition Name');
      await user.clear(nameInput);
      await user.type(nameInput, '  Test Name  ');

      const updateButton = screen.getByText('Update Ambition');
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            name: 'Test Name',
          })
        );
      });
    });

    it('should handle update error', async () => {
      const user = userEvent.setup();

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ data: null, error: { message: 'Update failed' } }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();
      });

      const updateButton = screen.getByText('Update Ambition');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Update failed')).toBeInTheDocument();
      });

      expect(mockOnUpdate).not.toHaveBeenCalled();
      expect(mockOnOpenChange).not.toHaveBeenCalled();
    });

    it('should show loading state during update', async () => {
      const user = userEvent.setup();

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
        update: vi.fn().mockReturnValue({
          eq: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();
      });

      const updateButton = screen.getByText('Update Ambition');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Updating…')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();
      });

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should update form fields when user types', async () => {
      const user = userEvent.setup();

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Edit Strategic Ambition')).toBeInTheDocument();
      });

      const nameInput = screen.getByLabelText('Ambition Name') as HTMLInputElement;
      await user.clear(nameInput);
      await user.type(nameInput, 'New Ambition Name');

      expect(nameInput.value).toBe('New Ambition Name');
    });
  });

  describe('Section Rendering', () => {
    it('should render all three sections', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Basic Information')).toBeInTheDocument();
        expect(screen.getByText('Leadership')).toBeInTheDocument();
        expect(screen.getByText('Executive Dashboard Metrics')).toBeInTheDocument();
      });
    });

    it('should render all form fields', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          in: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockLeaders, error: null }),
          }),
        }),
      } as any);

      render(
        <EditAmbitionModal
          open={true}
          onOpenChange={mockOnOpenChange}
          ambition={mockAmbition}
          onUpdate={mockOnUpdate}
        />
      );

      await waitFor(() => {
        expect(screen.getByLabelText('Ambition Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
        expect(screen.getByText('Assign Initiative Leader')).toBeInTheDocument();
        expect(screen.getByLabelText('Business Value')).toBeInTheDocument();
        expect(screen.getByText('Strategic Priority')).toBeInTheDocument();
        expect(screen.getByLabelText('Expected ROI (%)')).toBeInTheDocument();
        expect(screen.getByLabelText('Budget Allocated ($)')).toBeInTheDocument();
      });
    });
  });
});

// Made with Bob
