import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MatchResumesModal from '../MatchResumesModal';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: { id: 'test-user-123' },
  })),
}));

describe('MatchResumesModal', () => {
  const mockOnClose = vi.fn();
  const mockSetJobText = vi.fn();
  const mockSetUseAi = vi.fn();
  const mockOnRunMatching = vi.fn();
  const mockOnViewResume = vi.fn();
  const mockOnOpenApiSettings = vi.fn();

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    jobText: '',
    setJobText: mockSetJobText,
    useAi: false,
    setUseAi: mockSetUseAi,
    matching: false,
    matchResults: [],
    onRunMatching: mockOnRunMatching,
    onViewResume: mockOnViewResume,
    onOpenApiSettings: mockOnOpenApiSettings,
  };

  const mockMatchResults = [
    {
      id: 'resume-1',
      candidate_name: 'John Doe',
      score: 0.85,
      why: 'Strong match with excellent technical skills',
      matched_skills: ['React', 'TypeScript', 'Node.js', 'AWS', 'Docker'],
      missing_skills: ['Kubernetes'],
    },
    {
      id: 'resume-2',
      candidate_name: 'Jane Smith',
      score: 0.65,
      why: 'Good match with relevant experience',
      matched_skills: ['React', 'JavaScript'],
      missing_skills: ['TypeScript', 'AWS', 'Docker'],
    },
    {
      id: 'resume-3',
      candidate_name: 'Bob Johnson',
      score: 0.45,
      matched_skills: ['HTML', 'CSS'],
      missing_skills: ['React', 'TypeScript', 'Node.js'],
    },
  ];

  beforeEach(() => {
    mockOnClose.mockClear();
    mockSetJobText.mockClear();
    mockSetUseAi.mockClear();
    mockOnRunMatching.mockClear();
    mockOnViewResume.mockClear();
    mockOnOpenApiSettings.mockClear();
    vi.mocked(supabase.from).mockClear();
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

      render(<MatchResumesModal {...defaultProps} />);

      expect(screen.getByText('Match Resumes to Role')).toBeInTheDocument();
    });

    it('should display job description textarea', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} />);

      expect(screen.getByLabelText(/Target Role \/ Job Description/i)).toBeInTheDocument();
      expect(screen.getByPlaceholderText(/Paste the job description/i)).toBeInTheDocument();
    });

    it('should display AI toggle', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} />);

      expect(screen.getByText('AI-Powered Matching')).toBeInTheDocument();
    });
  });

  describe('API Key Checking', () => {
    it('should show warning when no API keys configured', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByText('API Keys Not Configured')).toBeInTheDocument();
      });
    });

    it('should show configure API keys button when keys missing', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Configure API Keys/i })).toBeInTheDocument();
      });
    });

    it('should call onOpenApiSettings when configure button clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /Configure API Keys/i })).toBeInTheDocument();
      });

      const configButton = screen.getByRole('button', { name: /Configure API Keys/i });
      await user.click(configButton);

      expect(mockOnOpenApiSettings).toHaveBeenCalled();
    });

    it('should not show warning when API keys are configured', async () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({
              data: { watsonx_api_key: 'test-key', orchestrate_api_key: 'test-key-2' },
              error: null,
            }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} />);

      await waitFor(() => {
        expect(screen.queryByText('API Keys Not Configured')).not.toBeInTheDocument();
      });
    });
  });

  describe('Job Text Input', () => {
    it('should call setJobText when textarea changes', async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} />);

      const textarea = screen.getByLabelText(/Target Role \/ Job Description/i);
      await user.type(textarea, 'Senior React Developer');

      expect(mockSetJobText).toHaveBeenCalled();
    });

    it('should display current job text value', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} jobText="Test job description" />);

      const textarea = screen.getByLabelText(/Target Role \/ Job Description/i) as HTMLTextAreaElement;
      expect(textarea.value).toBe('Test job description');
    });
  });

  describe('AI Toggle', () => {
    it('should call setUseAi when toggle is clicked', async () => {
      const user = userEvent.setup();
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} />);

      const toggle = screen.getByRole('switch');
      await user.click(toggle);

      expect(mockSetUseAi).toHaveBeenCalledWith(true);
    });

    it('should show AI description when AI is enabled', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} useAi={true} />);

      expect(screen.getByText(/Using WatsonX AI for intelligent semantic matching/i)).toBeInTheDocument();
    });

    it('should show keyword description when AI is disabled', () => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);

      render(<MatchResumesModal {...defaultProps} useAi={false} />);

      expect(screen.getByText(/Using keyword-based matching/i)).toBeInTheDocument();
    });
  });

  describe('Match Results Display', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);
    });

    it('should display match results when available', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should display match count', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      expect(screen.getByText(/Top Matches \(3\)/i)).toBeInTheDocument();
    });

    it('should display score percentages', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      expect(screen.getByText('85%')).toBeInTheDocument();
      expect(screen.getByText('65%')).toBeInTheDocument();
      expect(screen.getByText('45%')).toBeInTheDocument();
    });

    it('should display score labels', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      expect(screen.getByText('Excellent Match')).toBeInTheDocument();
      expect(screen.getByText('Good Match')).toBeInTheDocument();
      expect(screen.getByText('Fair Match')).toBeInTheDocument();
    });

    it('should display matched skills', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      // Skills appear multiple times across different candidates
      const reactSkills = screen.getAllByText('React');
      expect(reactSkills.length).toBeGreaterThan(0);
      
      const typescriptSkills = screen.getAllByText('TypeScript');
      expect(typescriptSkills.length).toBeGreaterThan(0);
      
      const nodejsSkills = screen.getAllByText('Node.js');
      expect(nodejsSkills.length).toBeGreaterThan(0);
    });

    it('should display missing skills', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      expect(screen.getByText('Kubernetes')).toBeInTheDocument();
    });

    it('should display AI explanation when available', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      expect(screen.getByText('Strong match with excellent technical skills')).toBeInTheDocument();
      expect(screen.getByText('Good match with relevant experience')).toBeInTheDocument();
    });

    it('should display rank badges', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      expect(screen.getByText('#1')).toBeInTheDocument();
      expect(screen.getByText('#2')).toBeInTheDocument();
      expect(screen.getByText('#3')).toBeInTheDocument();
    });

    it('should show AI Powered tag when using AI', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} useAi={true} />);

      expect(screen.getByText('AI Powered')).toBeInTheDocument();
    });

    it('should show Keyword Based tag when not using AI', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} useAi={false} />);

      expect(screen.getByText('Keyword Based')).toBeInTheDocument();
    });
  });

  describe('View Resume Action', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);
    });

    it('should call onViewResume when View button clicked', async () => {
      const user = userEvent.setup();
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      const viewButtons = screen.getAllByRole('button', { name: /View/i });
      await user.click(viewButtons[0]);

      expect(mockOnViewResume).toHaveBeenCalledWith('resume-1', 'John Doe');
    });

    it('should display View button for each result', () => {
      render(<MatchResumesModal {...defaultProps} matchResults={mockMatchResults} />);

      const viewButtons = screen.getAllByRole('button', { name: /View/i });
      expect(viewButtons).toHaveLength(3);
    });
  });

  describe('Empty State', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);
    });

    it('should show empty state when job text exists but no results', () => {
      render(<MatchResumesModal {...defaultProps} jobText="Senior Developer" matchResults={[]} />);

      expect(screen.getByText('Ready to Find Matches')).toBeInTheDocument();
      expect(screen.getByText(/Click "Run Matching" to find the best candidates/i)).toBeInTheDocument();
    });

    it('should not show empty state when no job text', () => {
      render(<MatchResumesModal {...defaultProps} jobText="" matchResults={[]} />);

      expect(screen.queryByText('Ready to Find Matches')).not.toBeInTheDocument();
    });

    it('should not show empty state when matching in progress', () => {
      render(<MatchResumesModal {...defaultProps} jobText="Senior Developer" matching={true} matchResults={[]} />);

      expect(screen.queryByText('Ready to Find Matches')).not.toBeInTheDocument();
    });
  });

  describe('Matching State', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);
    });

    it('should show loading indicator when matching', () => {
      render(<MatchResumesModal {...defaultProps} matching={true} />);

      expect(screen.getByText(/Analyzing resumes and calculating match scores/i)).toBeInTheDocument();
    });

    it('should change button text when matching', () => {
      render(<MatchResumesModal {...defaultProps} matching={true} />);

      expect(screen.getByRole('button', { name: /Matching/i })).toBeInTheDocument();
    });

    it('should disable button when matching', () => {
      render(<MatchResumesModal {...defaultProps} matching={true} />);

      const button = screen.getByRole('button', { name: /Matching/i });
      expect(button).toBeDisabled();
    });
  });

  describe('Modal Actions', () => {
    beforeEach(() => {
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: null, error: { code: 'PGRST116' } }),
          }),
        }),
      } as any);
    });

    it('should call onRunMatching when Run Matching clicked', async () => {
      const user = userEvent.setup();
      render(<MatchResumesModal {...defaultProps} jobText="Senior Developer" />);

      const runButton = screen.getByRole('button', { name: /Run Matching/i });
      await user.click(runButton);

      expect(mockOnRunMatching).toHaveBeenCalled();
    });

    it('should disable Run Matching when no job text', () => {
      render(<MatchResumesModal {...defaultProps} jobText="" />);

      const runButton = screen.getByRole('button', { name: /Run Matching/i });
      expect(runButton).toBeDisabled();
    });

    it('should call onClose when Close clicked', async () => {
      const user = userEvent.setup();
      render(<MatchResumesModal {...defaultProps} />);

      // Get the secondary button (footer close button)
      const closeButtons = screen.getAllByRole('button', { name: /Close/i });
      const footerCloseButton = closeButtons.find(btn => btn.classList.contains('cds--btn--secondary'));
      
      if (footerCloseButton) {
        await user.click(footerCloseButton);
        expect(mockOnClose).toHaveBeenCalled();
      }
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

    it('should have accessible modal title', () => {
      render(<MatchResumesModal {...defaultProps} />);

      expect(screen.getByRole('heading', { name: /Match Resumes to Role/i })).toBeInTheDocument();
    });

    it('should have accessible textarea label', () => {
      render(<MatchResumesModal {...defaultProps} />);

      const textarea = screen.getByLabelText(/Target Role \/ Job Description/i);
      expect(textarea).toBeInTheDocument();
    });

    it('should have accessible toggle', () => {
      render(<MatchResumesModal {...defaultProps} />);

      const toggle = screen.getByRole('switch');
      expect(toggle).toBeInTheDocument();
    });

    it('should have accessible buttons', () => {
      render(<MatchResumesModal {...defaultProps} jobText="Test" />);

      expect(screen.getByRole('button', { name: /Run Matching/i })).toBeInTheDocument();
      
      // Multiple Close buttons exist (modal close icon + footer button)
      const closeButtons = screen.getAllByRole('button', { name: /Close/i });
      expect(closeButtons.length).toBeGreaterThan(0);
    });
  });
});

// Made with Bob
