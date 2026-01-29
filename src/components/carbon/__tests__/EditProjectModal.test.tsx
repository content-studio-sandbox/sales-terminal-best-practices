import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EditProjectModal from '../EditProjectModal';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }))
    }))
  }
}));

describe('EditProjectModal', () => {
  const mockProject = {
    id: 'project-123',
    name: 'Test Project',
    description: 'Test Description',
    status: 'in progress',
    objectives: 'Test objectives',
    hours_per_week: 40,
    business_value: 50000,
    roi_contribution: 25,
    tags: ['tag1', 'tag2'],
    success_metrics: 'Test metrics'
  };

  const mockOnOpenChange = vi.fn();
  const mockOnUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Modal Rendering', () => {
    it('should not render when open is false', () => {
      const { container } = render(
        <EditProjectModal
          open={false}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      // Carbon modals render in DOM but are hidden via CSS when closed
      const modal = container.querySelector('.cds--modal');
      expect(modal).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render when open is true', () => {
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('Edit Project')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByLabelText(/project title/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByText(/project status/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/project objectives/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/business value/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/expected roi/i)).toBeInTheDocument();
      expect(screen.getByText(/project tags/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/success metrics/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/time commitment/i)).toBeInTheDocument();
    });

    it('should populate form with project data', () => {
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByDisplayValue('Test Project')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test Description')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test objectives')).toBeInTheDocument();
      expect(screen.getByDisplayValue('40')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Test metrics')).toBeInTheDocument();
    });

    it('should display existing tags', () => {
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByText('tag1')).toBeInTheDocument();
      expect(screen.getByText('tag2')).toBeInTheDocument();
    });
  });

  describe('Form Validation', () => {
    it('should show error when title is empty', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={{ ...mockProject, name: '' }}
          onUpdate={mockOnUpdate}
        />
      );

      const updateButton = screen.getByText('Update Project');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText(/title and description are required/i)).toBeInTheDocument();
      });
    });

    it('should show error when description is empty', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={{ ...mockProject, description: '' }}
          onUpdate={mockOnUpdate}
        />
      );

      const updateButton = screen.getByText('Update Project');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText(/title and description are required/i)).toBeInTheDocument();
      });
    });
  });

  describe('Form Submission', () => {
    it('should successfully update project', async () => {
      const user = userEvent.setup();
      const mockUpdate = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }));
      
      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any);

      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const updateButton = screen.getByText('Update Project');
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith({
          name: 'Test Project',
          description: 'Test Description',
          status: 'in progress',
          objectives: 'Test objectives',
          hours_per_week: 40,
          business_value: 50000,
          roi_contribution: 25,
          tags: ['tag1', 'tag2'],
          success_metrics: 'Test metrics'
        });
        expect(mockOnUpdate).toHaveBeenCalled();
      });
    });

    it('should handle update error', async () => {
      const user = userEvent.setup();
      const mockUpdate = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ 
          data: null, 
          error: { message: 'Update failed' } 
        }))
      }));
      
      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any);

      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const updateButton = screen.getByText('Update Project');
      await user.click(updateButton);

      await waitFor(() => {
        expect(screen.getByText('Update failed')).toBeInTheDocument();
      });
    });

    it('should show loading state during update', async () => {
      const user = userEvent.setup();
      let resolveUpdate: any;
      const updatePromise = new Promise((resolve) => {
        resolveUpdate = resolve;
      });

      const mockUpdate = vi.fn(() => ({
        eq: vi.fn(() => updatePromise)
      }));
      
      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any);

      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const updateButton = screen.getByText('Update Project');
      await user.click(updateButton);

      expect(screen.getByText('Updating...')).toBeInTheDocument();

      resolveUpdate({ data: null, error: null });
    });
  });

  describe('Tags Management', () => {
    it('should add tag using Enter key', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={{ ...mockProject, tags: [] }}
          onUpdate={mockOnUpdate}
        />
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagInput, 'newtag{Enter}');

      await waitFor(() => {
        expect(screen.getByText('newtag')).toBeInTheDocument();
      });
    });

    it('should add tag using Add button', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={{ ...mockProject, tags: [] }}
          onUpdate={mockOnUpdate}
        />
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagInput, 'newtag');

      const addButton = screen.getByText('Add');
      await user.click(addButton);

      await waitFor(() => {
        expect(screen.getByText('newtag')).toBeInTheDocument();
      });
    });

    it('should not add duplicate tags', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={{ ...mockProject, tags: ['existing'] }}
          onUpdate={mockOnUpdate}
        />
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagInput, 'existing{Enter}');

      const tags = screen.getAllByText('existing');
      expect(tags).toHaveLength(1);
    });

    it('should remove tag when close button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const tag1 = screen.getByText('tag1');
      expect(tag1).toBeInTheDocument();

      // Find the close button for tag1 (it's a sibling SVG element)
      const closeButtons = screen.getAllByRole('button');
      const tag1CloseButton = closeButtons.find(btn => 
        btn.closest('.cds--tag')?.textContent?.includes('tag1')
      );

      if (tag1CloseButton) {
        await user.click(tag1CloseButton);
      }

      await waitFor(() => {
        expect(screen.queryByText('tag1')).not.toBeInTheDocument();
      });
    });

    it('should trim whitespace from tags', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={{ ...mockProject, tags: [] }}
          onUpdate={mockOnUpdate}
        />
      );

      const tagInput = screen.getByPlaceholderText(/add a tag/i);
      await user.type(tagInput, '  spaced tag  {Enter}');

      await waitFor(() => {
        expect(screen.getByText('spaced tag')).toBeInTheDocument();
      });
    });

    it('should disable Add button when tag input is empty', () => {
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const addButton = screen.getByText('Add');
      expect(addButton).toBeDisabled();
    });
  });

  describe('User Interactions', () => {
    it('should update title field', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const titleInput = screen.getByLabelText(/project title/i);
      await user.clear(titleInput);
      await user.type(titleInput, 'Updated Title');

      expect(screen.getByDisplayValue('Updated Title')).toBeInTheDocument();
    });

    it('should update description field', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const descInput = screen.getByLabelText(/description/i);
      await user.clear(descInput);
      await user.type(descInput, 'Updated Description');

      expect(screen.getByDisplayValue('Updated Description')).toBeInTheDocument();
    });

    it('should close modal when cancel button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Number Inputs', () => {
    it('should handle business value changes', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const businessValueInput = screen.getByLabelText(/business value/i);
      await user.clear(businessValueInput);
      await user.type(businessValueInput, '75000');

      expect(screen.getByDisplayValue('75000')).toBeInTheDocument();
    });

    it('should handle ROI changes', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const roiInput = screen.getByLabelText(/expected roi/i);
      await user.clear(roiInput);
      await user.type(roiInput, '50');

      expect(screen.getByDisplayValue('50')).toBeInTheDocument();
    });

    it('should handle hours per week changes', async () => {
      const user = userEvent.setup();
      
      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onUpdate={mockOnUpdate}
        />
      );

      const hoursInput = screen.getByLabelText(/time commitment/i);
      await user.clear(hoursInput);
      await user.type(hoursInput, '20');

      expect(screen.getByDisplayValue('20')).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle project with null values', () => {
      const projectWithNulls = {
        id: 'project-123',
        name: null,
        description: null,
        status: null,
        objectives: null,
        hours_per_week: null,
        business_value: null,
        roi_contribution: null,
        tags: null,
        success_metrics: null
      };

      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={projectWithNulls}
          onUpdate={mockOnUpdate}
        />
      );

      expect(screen.getByLabelText(/project title/i)).toHaveValue('');
      expect(screen.getByLabelText(/description/i)).toHaveValue('');
    });

    it('should handle empty tags array in submission', async () => {
      const user = userEvent.setup();
      const mockUpdate = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ data: null, error: null }))
      }));
      
      vi.mocked(supabase.from).mockReturnValue({
        update: mockUpdate
      } as any);

      render(
        <EditProjectModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={{ ...mockProject, tags: [] }}
          onUpdate={mockOnUpdate}
        />
      );

      const updateButton = screen.getByText('Update Project');
      await user.click(updateButton);

      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalledWith(
          expect.objectContaining({
            tags: null
          })
        );
      });
    });
  });
});

// Made with Bob
