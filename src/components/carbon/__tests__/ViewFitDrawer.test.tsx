import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ViewFitDrawer from '../ViewFitDrawer';

describe('ViewFitDrawer', () => {
  const mockOnClose = vi.fn();

  const mockMatchResult = {
    candidateId: 'user-1',
    candidateName: 'Alice Johnson',
    candidateEmail: 'alice@example.com',
    fitScore: 85,
    missing: ['Python', 'Docker'],
    levelShortfalls: [
      { skill: 'JavaScript', current: 'Intermediate', required: 'Advanced', gap: 1 },
      { skill: 'React', current: 'Beginner', required: 'Expert', gap: 3 },
    ],
    meetsMustHaves: false,
    suggestedLearning: [
      { skill: 'Python', reason: 'Required for backend development', targetLevel: 'Intermediate', estimatedWeeks: 4 },
      { skill: 'Docker', reason: 'Needed for containerization', targetLevel: 'Basic', estimatedWeeks: 2 },
    ],
    readyEtaWeeks: 6,
  };

  const perfectMatchResult = {
    candidateId: 'user-2',
    candidateName: 'Bob Smith',
    candidateEmail: 'bob@example.com',
    fitScore: 100,
    missing: [],
    levelShortfalls: [],
    meetsMustHaves: true,
    suggestedLearning: [],
    readyEtaWeeks: 0,
  };

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    candidateId: 'user-1',
    candidateName: 'Alice Johnson',
    candidateEmail: 'alice@example.com',
    projectId: 'project-123',
    projectName: 'AI Platform Development',
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('should render drawer when open', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Fit Analysis')).toBeInTheDocument();
      });
    });

    it('should not render when closed', () => {
      render(<ViewFitDrawer {...defaultProps} open={false} />);

      expect(screen.queryByText('Fit Analysis')).not.toBeInTheDocument();
    });

    it('should display candidate information', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Fit Analysis')).toBeInTheDocument();
        expect(screen.getByText(/Alice Johnson/i)).toBeInTheDocument();
        expect(screen.getByText(/alice@example.com/i)).toBeInTheDocument();
      });
    });

    it('should have close button', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        const closeButtons = screen.getAllByRole('button', { name: /Close/i });
        expect(closeButtons.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator while fetching', async () => {
      (global.fetch as any).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: async () => ({ matches: [mockMatchResult] }) }), 100))
      );

      render(<ViewFitDrawer {...defaultProps} />);

      expect(screen.getByText(/Analyzing fit/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/Analyzing fit/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Fit Score Display', () => {
    it('should display fit score', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Overall Fit Score')).toBeInTheDocument();
        expect(screen.getByText('85%')).toBeInTheDocument();
      });
    });

    it('should display project name when provided', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/For project:/i)).toBeInTheDocument();
        expect(screen.getByText('AI Platform Development')).toBeInTheDocument();
      });
    });
  });

  describe('Must-Haves Status', () => {
    it('should show missing requirements when not met', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Must-Have Requirements')).toBeInTheDocument();
        expect(screen.getByText(/Missing critical requirements/i)).toBeInTheDocument();
      });
    });

    it('should show met status when requirements are met', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [perfectMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/All must-have requirements met/i)).toBeInTheDocument();
      });
    });
  });

  describe('Missing Skills', () => {
    it('should display missing skills', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Missing Skills \(2\)/i)).toBeInTheDocument();
        expect(screen.getAllByText('Python').length).toBeGreaterThan(0);
        expect(screen.getAllByText('Docker').length).toBeGreaterThan(0);
      });
    });

    it('should not show missing skills section when none', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [perfectMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText(/Missing Skills/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Level Shortfalls', () => {
    it('should display level shortfalls', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Level Shortfalls \(2\)/i)).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
      });
    });

    it('should show current and required levels', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Current: Intermediate/i)).toBeInTheDocument();
        expect(screen.getByText(/Required: Advanced/i)).toBeInTheDocument();
      });
    });

    it('should show gap information', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/1 level gap/i)).toBeInTheDocument();
        expect(screen.getByText(/3 levels gap/i)).toBeInTheDocument();
      });
    });
  });

  describe('Suggested Learning', () => {
    it('should display suggested learning paths', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Suggested Learning Path')).toBeInTheDocument();
      });
    });

    it('should show estimated weeks for each skill', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('~4w')).toBeInTheDocument();
        expect(screen.getByText('~2w')).toBeInTheDocument();
      });
    });
  });

  describe('Ready ETA', () => {
    it('should display weeks when not ready', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Estimated Time to Ready')).toBeInTheDocument();
        expect(screen.getByText('6 weeks')).toBeInTheDocument();
      });
    });

    it('should show ready now when ETA is 0', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [perfectMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Ready now/i)).toBeInTheDocument();
      });
    });
  });

  describe('Perfect Match', () => {
    it('should show perfect match message when no gaps', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [perfectMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Perfect match! No skill gaps identified/i)).toBeInTheDocument();
      });
    });
  });

  describe('Custom Job Description', () => {
    it('should show JD textarea when no projectId', async () => {
      render(<ViewFitDrawer {...defaultProps} projectId={undefined} />);

      await waitFor(() => {
        expect(screen.getByLabelText('Job Description')).toBeInTheDocument();
      });
    });

    it('should allow entering custom JD text', async () => {
      const user = userEvent.setup();
      render(<ViewFitDrawer {...defaultProps} projectId={undefined} />);

      const textarea = screen.getByLabelText('Job Description');
      await user.type(textarea, 'Looking for a Python developer');

      expect(textarea).toHaveValue('Looking for a Python developer');
    });

    it('should have analyze button for custom JD', async () => {
      render(<ViewFitDrawer {...defaultProps} projectId={undefined} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Analyze Fit/i })).toBeInTheDocument();
      });
    });

    it('should fetch analysis when analyze button clicked', async () => {
      const user = userEvent.setup();
      const fetchSpy = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });
      global.fetch = fetchSpy;

      render(<ViewFitDrawer {...defaultProps} projectId={undefined} />);

      const textarea = screen.getByLabelText('Job Description');
      await user.type(textarea, 'Python developer needed');

      const analyzeButton = screen.getByRole('button', { name: /Analyze Fit/i });
      await user.click(analyzeButton);

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          '/api/match/role',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('Python developer needed'),
          })
        );
      });
    });

    it('should disable analyze button when JD text is empty', async () => {
      render(<ViewFitDrawer {...defaultProps} projectId={undefined} />);

      const analyzeButton = screen.getByRole('button', { name: /Analyze Fit/i });
      expect(analyzeButton).toBeDisabled();
    });
  });

  describe('Error Handling', () => {
    it('should display error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });

    it('should handle missing match result', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/No match result returned/i)).toBeInTheDocument();
      });
    });

    it('should allow dismissing error notifications', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockRejectedValueOnce(new Error('Test error'));

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Test error/i)).toBeInTheDocument();
      });

      const closeButton = screen.getByRole('button', { name: /close notification/i });
      await user.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByText(/Test error/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Drawer Controls', () => {
    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Fit Analysis')).toBeInTheDocument();
      });

      const closeButtons = screen.getAllByRole('button', { name: /Close/i });
      await user.click(closeButtons[0]);

      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should call onClose when overlay clicked', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      const { container } = render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Fit Analysis')).toBeInTheDocument();
      });

      // Click the overlay (first div with fixed position)
      const overlay = container.querySelector('div[style*="position: fixed"]');
      if (overlay) {
        await user.click(overlay);
        expect(mockOnClose).toHaveBeenCalled();
      }
    });

    it('should close on Escape key', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Fit Analysis')).toBeInTheDocument();
      });

      await user.keyboard('{Escape}');

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('API Integration', () => {
    it('should fetch with projectId when provided', async () => {
      const fetchSpy = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });
      global.fetch = fetchSpy;

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          '/api/match/role',
          expect.objectContaining({
            method: 'POST',
            body: expect.stringContaining('project-123'),
          })
        );
      });
    });

    it('should include candidateId in request', async () => {
      const fetchSpy = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });
      global.fetch = fetchSpy;

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          '/api/match/role',
          expect.objectContaining({
            body: expect.stringContaining('user-1'),
          })
        );
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle single level gap', async () => {
      const singleGapResult = {
        ...mockMatchResult,
        levelShortfalls: [
          { skill: 'JavaScript', current: 'Intermediate', required: 'Advanced', gap: 1 },
        ],
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [singleGapResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/1 level gap/i)).toBeInTheDocument();
      });
    });

    it('should handle single week ETA', async () => {
      const oneWeekResult = {
        ...mockMatchResult,
        readyEtaWeeks: 1,
      };

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [oneWeekResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('1 week')).toBeInTheDocument();
      });
    });

    it('should not fetch when drawer is closed', () => {
      const fetchSpy = vi.fn();
      global.fetch = fetchSpy;

      render(<ViewFitDrawer {...defaultProps} open={false} />);

      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should reset state when drawer closes', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      const { rerender } = render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('85%')).toBeInTheDocument();
      });

      rerender(<ViewFitDrawer {...defaultProps} open={false} />);

      expect(screen.queryByText('85%')).not.toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have accessible close button', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [mockMatchResult] }),
      });

      render(<ViewFitDrawer {...defaultProps} />);

      await waitFor(() => {
        const closeButtons = screen.getAllByRole('button', { name: /Close/i });
        expect(closeButtons.length).toBeGreaterThan(0);
      });
    });

    it('should have accessible textarea when shown', async () => {
      render(<ViewFitDrawer {...defaultProps} projectId={undefined} />);

      await waitFor(() => {
        const textarea = screen.getByLabelText('Job Description');
        expect(textarea).toBeInTheDocument();
      });
    });

    it('should have accessible analyze button', async () => {
      render(<ViewFitDrawer {...defaultProps} projectId={undefined} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Analyze Fit/i })).toBeInTheDocument();
      });
    });
  });
});

// Made with Bob
