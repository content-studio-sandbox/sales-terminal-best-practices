import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ProjectReviewModal from '../ProjectReviewModal';
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

describe('ProjectReviewModal', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnReviewSubmitted = vi.fn();

  const mockProject = {
    id: 'project-123',
    name: 'AI Innovation Project',
    roi_contribution: 150,
  };

  const mockUser = {
    data: {
      user: {
        id: 'user-123',
      },
    },
  };

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    mockOnReviewSubmitted.mockClear();
    vi.mocked(supabase.auth.getUser).mockResolvedValue(mockUser as any);
  });

  describe('Rendering', () => {
    it('should render modal when open', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getByText('Submit Project Review')).toBeInTheDocument();
      expect(screen.getByText('AI Innovation Project')).toBeInTheDocument();
    });

    it('should have aria-hidden when closed', () => {
      const { container } = render(
        <ProjectReviewModal
          open={false}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      // Carbon modals render in DOM but are hidden with aria-hidden
      const modal = container.querySelector('.cds--modal');
      expect(modal).toHaveAttribute('aria-hidden', 'true');
    });

    it('should display all rating sections', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getByText('Quality Rating *')).toBeInTheDocument();
      expect(screen.getByText('Business Impact Rating *')).toBeInTheDocument();
      expect(screen.getByText('Innovation Score *')).toBeInTheDocument();
    });

    it('should display ROI input field', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getByLabelText('Actual ROI (%)')).toBeInTheDocument();
      expect(screen.getByText('Expected ROI was 150%')).toBeInTheDocument();
    });

    it('should display lessons learned textarea', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getByLabelText('Lessons Learned')).toBeInTheDocument();
    });
  });

  describe('New Review Mode', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);
    });

    it('should show "Submit Project Review" for new review', () => {
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getByText('Submit Project Review')).toBeInTheDocument();
    });

    it('should have default rating values', () => {
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      // Default ratings should be 3 (Average)
      const qualityRadio = screen.getByLabelText('3 - Average', { selector: '#quality-3' });
      expect(qualityRadio).toBeChecked();
    });

    it('should show Submit Review button', () => {
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getByText('Submit Review')).toBeInTheDocument();
    });
  });

  describe('Update Review Mode', () => {
    const mockExistingReview = {
      id: 'review-123',
      project_id: 'project-123',
      quality_rating: 5,
      business_impact_rating: 4,
      innovation_score: 5,
      actual_roi: 175,
      lessons_learned: 'Great project with excellent outcomes',
    };

    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockExistingReview, error: null }),
          }),
        }),
      } as any);
    });

    it('should show "Update Project Review" for existing review', async () => {
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Update Project Review')).toBeInTheDocument();
      });
    });

    it('should show Update Review button', async () => {
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Update Review')).toBeInTheDocument();
      });
    });
  });

  describe('Rating Interactions', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);
    });

    it('should allow selecting quality rating', async () => {
      const user = userEvent.setup();
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      const excellentRating = screen.getByLabelText('5 - Excellent', { selector: '#quality-5' });
      await user.click(excellentRating);

      expect(excellentRating).toBeChecked();
    });

    it('should allow selecting business impact rating', async () => {
      const user = userEvent.setup();
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      const goodRating = screen.getByLabelText('4 - Good', { selector: '#impact-4' });
      await user.click(goodRating);

      expect(goodRating).toBeChecked();
    });

    it('should allow selecting innovation score', async () => {
      const user = userEvent.setup();
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      const poorRating = screen.getByLabelText('1 - Poor', { selector: '#innovation-1' });
      await user.click(poorRating);

      expect(poorRating).toBeChecked();
    });

    it('should display all rating labels', () => {
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getAllByText(/Poor/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Below Average/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Average/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Good/i).length).toBeGreaterThan(0);
      expect(screen.getAllByText(/Excellent/i).length).toBeGreaterThan(0);
    });
  });

  describe('Form Submission', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
        insert: vi.fn().mockResolvedValue({ data: null, error: null }),
      } as any);
    });

    it('should submit new review successfully', async () => {
      const user = userEvent.setup();
      const mockInsert = vi.fn().mockResolvedValue({ data: null, error: null });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
        insert: mockInsert,
      } as any);

      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      const submitButton = screen.getByText('Submit Review');
      await user.click(submitButton);

      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
        expect(mockOnReviewSubmitted).toHaveBeenCalled();
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should show loading state during submission', async () => {
      const user = userEvent.setup();
      const mockInsert = vi.fn().mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
        insert: mockInsert,
      } as any);

      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      const submitButton = screen.getByText('Submit Review');
      await user.click(submitButton);

      expect(screen.getByText('Submitting...')).toBeInTheDocument();
    });

    it('should handle submission error', async () => {
      const user = userEvent.setup();
      const mockInsert = vi.fn().mockResolvedValue({ 
        data: null, 
        error: { message: 'Database error' } 
      });
      
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
        insert: mockInsert,
      } as any);

      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      const submitButton = screen.getByText('Submit Review');
      await user.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText('Error')).toBeInTheDocument();
        expect(screen.getByText('Database error')).toBeInTheDocument();
      });
    });
  });

  describe('Cancel Functionality', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);
    });

    it('should call onOpenChange when Cancel is clicked', async () => {
      const user = userEvent.setup();
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should call onOpenChange when modal is closed', async () => {
      const user = userEvent.setup();
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);
    });

    it('should have proper form structure', () => {
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Submit Review/i })).toBeInTheDocument();
    });

    it('should have labeled form fields', () => {
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getByLabelText('Actual ROI (%)')).toBeInTheDocument();
      expect(screen.getByLabelText('Lessons Learned')).toBeInTheDocument();
    });

    it('should have helper text for fields', () => {
      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={mockProject}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.getByText(/Rate the overall quality of project execution/i)).toBeInTheDocument();
      expect(screen.getByText(/Rate the business value and impact/i)).toBeInTheDocument();
      expect(screen.getByText(/Rate the level of innovation/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle missing project gracefully', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={null}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      // Should still render the modal structure
      expect(screen.getByText('Submit Project Review')).toBeInTheDocument();
    });

    it('should handle project without ROI contribution', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      const projectWithoutROI = { id: 'project-456', name: 'Test Project' };

      render(
        <ProjectReviewModal
          open={true}
          onOpenChange={mockOnOpenChange}
          project={projectWithoutROI}
          onReviewSubmitted={mockOnReviewSubmitted}
        />
      );

      expect(screen.queryByText(/Expected ROI was/i)).not.toBeInTheDocument();
    });
  });
});

// Made with Bob
