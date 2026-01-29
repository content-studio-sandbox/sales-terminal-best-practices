import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchToRoleModal from '../MatchToRoleModal';

// Mock Supabase client
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => Promise.resolve({ error: null })),
    })),
  },
}));

describe('MatchToRoleModal', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnInvitationsSent = vi.fn();

  const mockMatches = [
    {
      candidateId: 'user-1',
      candidateName: 'Alice Johnson',
      candidateEmail: 'alice@example.com',
      fitScore: 85,
      missing: [],
      levelShortfalls: [],
      meetsMustHaves: true,
      suggestedLearning: [],
      readyEtaWeeks: 0,
    },
    {
      candidateId: 'user-2',
      candidateName: 'Bob Smith',
      candidateEmail: 'bob@example.com',
      fitScore: 65,
      missing: ['Python', 'Docker'],
      levelShortfalls: [
        { skill: 'JavaScript', current: 'Intermediate', required: 'Advanced', gap: 1 },
      ],
      meetsMustHaves: false,
      suggestedLearning: [
        { skill: 'Python', reason: 'Required for backend', targetLevel: 'Intermediate', estimatedWeeks: 4 },
      ],
      readyEtaWeeks: 6,
    },
  ];

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    projectId: 'project-123',
    projectName: 'AI Platform Development',
    onInvitationsSent: mockOnInvitationsSent,
  };

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    mockOnInvitationsSent.mockClear();
    global.fetch = vi.fn();
  });

  describe('Rendering', () => {
    it('should render modal when open', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Match Candidates to AI Platform Development/i)).toBeInTheDocument();
      });
    });

    it('should not fetch data when closed', () => {
      const fetchSpy = vi.fn();
      global.fetch = fetchSpy;

      render(<MatchToRoleModal {...defaultProps} open={false} />);

      // Should not fetch when modal is closed
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('should display AI matcher toggle', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Use AI Matcher')).toBeInTheDocument();
      });
    });

    it('should display instruction text', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Candidates are ranked by skill match/i)).toBeInTheDocument();
      });
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator while fetching', async () => {
      (global.fetch as any).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: async () => ({ matches: [] }) }), 100))
      );

      render(<MatchToRoleModal {...defaultProps} />);

      expect(screen.getByText(/Analyzing candidates/i)).toBeInTheDocument();

      await waitFor(() => {
        expect(screen.queryByText(/Analyzing candidates/i)).not.toBeInTheDocument();
      });
    });

    it('should disable buttons while loading', async () => {
      (global.fetch as any).mockImplementationOnce(
        () => new Promise((resolve) => setTimeout(() => resolve({ ok: true, json: async () => ({ matches: [] }) }), 100))
      );

      render(<MatchToRoleModal {...defaultProps} />);

      const inviteButton = screen.getByRole('button', { name: /Invite/i });
      expect(inviteButton).toBeDisabled();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no matches', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/No matching candidates found/i)).toBeInTheDocument();
      });
    });

    it('should show helpful message in empty state', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Make sure the project has required skills defined/i)).toBeInTheDocument();
      });
    });
  });

  describe('Candidate List Display', () => {
    it('should display all candidate names', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
        expect(screen.getByText('Bob Smith')).toBeInTheDocument();
      });
    });

    it('should display candidate emails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('alice@example.com')).toBeInTheDocument();
        expect(screen.getByText('bob@example.com')).toBeInTheDocument();
      });
    });

    it('should display fit scores', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('85%')).toBeInTheDocument();
        expect(screen.getByText('65%')).toBeInTheDocument();
      });
    });

    it('should display must-haves status', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        const metTags = screen.getAllByText('Met');
        expect(metTags.length).toBeGreaterThan(0);
        const missingTags = screen.getAllByText('Missing');
        expect(missingTags.length).toBeGreaterThan(0);
      });
    });

    it('should display missing skills', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Python, Docker/i)).toBeInTheDocument();
      });
    });

    it('should display ready ETA', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Now')).toBeInTheDocument();
        expect(screen.getByText('6w')).toBeInTheDocument();
      });
    });
  });

  describe('Candidate Selection', () => {
    it('should allow selecting individual candidates', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText('', { selector: '#candidate-user-1' });
      await user.click(checkbox);

      expect(checkbox).toBeChecked();
    });

    it('should update selection count', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/0 selected/i)).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText('', { selector: '#candidate-user-1' });
      await user.click(checkbox);

      await waitFor(() => {
        expect(screen.getByText(/1 selected/i)).toBeInTheDocument();
      });
    });

    it('should support select all functionality', async () => {
      const user = userEvent.setup();
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      });

      const selectAllCheckbox = screen.getByLabelText(/Select all/i);
      await user.click(selectAllCheckbox);

      await waitFor(() => {
        expect(screen.getByText(/2 selected/i)).toBeInTheDocument();
      });
    });
  });

  describe('AI Matcher Toggle', () => {
    it('should fetch with rule-based endpoint by default', async () => {
      const fetchSpy = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });
      global.fetch = fetchSpy;

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          '/api/match/role',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ projectId: 'project-123' }),
          })
        );
      });
    });

    it('should switch to AI endpoint when toggled', async () => {
      const user = userEvent.setup();
      const fetchSpy = vi.fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ matches: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ matches: [] }),
        });
      global.fetch = fetchSpy;

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Use AI Matcher')).toBeInTheDocument();
      });

      const toggle = screen.getByRole('switch', { name: /Use AI Matcher/i });
      await user.click(toggle);

      await waitFor(() => {
        expect(fetchSpy).toHaveBeenCalledWith(
          '/api/match/watsonx',
          expect.objectContaining({
            method: 'POST',
            body: JSON.stringify({ projectId: 'project-123', topK: 20 }),
          })
        );
      });
    });
  });

  describe('Bulk Invitation', () => {
    it('should send invitations for selected candidates', async () => {
      const user = userEvent.setup();
      const { supabase } = await import('@/integrations/supabase/client');
      const insertMock = vi.fn().mockResolvedValue({ error: null });
      (supabase.from as any).mockReturnValue({ insert: insertMock });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText('', { selector: '#candidate-user-1' });
      await user.click(checkbox);

      const inviteButton = screen.getByRole('button', { name: /Invite 1 Candidate/i });
      await user.click(inviteButton);

      await waitFor(() => {
        expect(insertMock).toHaveBeenCalledWith([
          {
            project_id: 'project-123',
            user_id: 'user-1',
            status: 'invited',
          },
        ]);
      });
    });

    it('should show success message after sending', async () => {
      const user = userEvent.setup();
      const { supabase } = await import('@/integrations/supabase/client');
      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText('', { selector: '#candidate-user-1' });
      await user.click(checkbox);

      const inviteButton = screen.getByRole('button', { name: /Invite 1 Candidate/i });
      await user.click(inviteButton);

      await waitFor(() => {
        expect(screen.getByText(/Successfully sent 1 invitation/i)).toBeInTheDocument();
      });
    });

    it('should call onInvitationsSent callback', async () => {
      const user = userEvent.setup();
      const { supabase } = await import('@/integrations/supabase/client');
      (supabase.from as any).mockReturnValue({
        insert: vi.fn().mockResolvedValue({ error: null }),
      });

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
      });

      const checkbox = screen.getByLabelText('', { selector: '#candidate-user-1' });
      await user.click(checkbox);

      const inviteButton = screen.getByRole('button', { name: /Invite 1 Candidate/i });
      await user.click(inviteButton);

      await waitFor(() => {
        expect(mockOnInvitationsSent).toHaveBeenCalled();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error when fetch fails', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Server error' }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Server error/i)).toBeInTheDocument();
      });
    });

    it('should handle network errors', async () => {
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/Network error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Modal Controls', () => {
    it('should have cancel button', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      });
    });

    it('should have invite button', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Invite/i })).toBeInTheDocument();
      });
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty matches array', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/No matching candidates found/i)).toBeInTheDocument();
      });
    });

    it('should handle missing matches in response', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({}),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText(/No matching candidates found/i)).toBeInTheDocument();
      });
    });

    it('should handle candidates with no missing skills', async () => {
      const perfectMatch = [{
        ...mockMatches[0],
        missing: [],
        levelShortfalls: [],
      }];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: perfectMatch }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('None')).toBeInTheDocument();
      });
    });

    it('should handle candidates with no suggested learning', async () => {
      const readyCandidate = [{
        ...mockMatches[0],
        suggestedLearning: [],
      }];

      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: readyCandidate }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('Ready')).toBeInTheDocument();
      });
    });
  });

  describe('Accessibility', () => {
    it('should have accessible modal title', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: /Match Candidates to AI Platform Development/i })).toBeInTheDocument();
      });
    });

    it('should have accessible checkboxes', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: mockMatches }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        const checkboxes = screen.getAllByRole('checkbox');
        expect(checkboxes.length).toBeGreaterThan(0);
      });
    });

    it('should have accessible buttons', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Invite/i })).toBeInTheDocument();
      });
    });

    it('should have accessible toggle', async () => {
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ matches: [] }),
      });

      render(<MatchToRoleModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('switch', { name: /Use AI Matcher/i })).toBeInTheDocument();
      });
    });
  });
});

// Made with Bob
