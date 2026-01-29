import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApplicantProfileModal from '../ApplicantProfileModal';

// Mock Supabase - must be defined inline in vi.mock to avoid hoisting issues
vi.mock('@/integrations/supabase/client', () => {
  const mockSupabase: any = {
    from: vi.fn(() => mockSupabase),
    select: vi.fn(() => mockSupabase),
    eq: vi.fn(() => mockSupabase),
    single: vi.fn(),
  };
  return {
    supabase: mockSupabase,
  };
});

// Import the mocked supabase for test manipulation
const { supabase: mockSupabase } = await import('@/integrations/supabase/client');

describe('ApplicantProfileModal', () => {
  const mockOnOpenChange = vi.fn();

  const mockProfileData = {
    id: 'user-123',
    fullName: 'John Doe',
    display_name: 'John Doe',
    email: 'john.doe@example.com',
    access_role: 'intern',
    skills: [
      { skill: { name: 'JavaScript' } },
      { skill: { name: 'React' } },
      { skill: { name: 'TypeScript' } },
    ],
    products: [
      { product: { name: 'Watson' } },
      { product: { name: 'Cloud Pak' } },
    ],
    experience: '2 years of software development experience',
    interests: 'AI and machine learning projects',
  };

  const mockPerformanceData = {
    user_id: 'user-123',
    performance_rating: 'high_performer',
    pipeline_stage: 'high_performer',
  };

  const mockProjectData = {
    managed: {
      data: [
        { id: 'proj-1', status: 'complete' },
        { id: 'proj-2', status: 'in progress' },
      ],
    },
    contributed: {
      data: [
        { id: 'staff-1', projects: { id: 'proj-3', status: 'complete' } },
        { id: 'staff-2', projects: { id: 'proj-4', status: 'in progress' } },
      ],
    },
  };

  beforeEach(() => {
    mockOnOpenChange.mockClear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Loading State', () => {
    it('should show loading state when profileData is null', () => {
      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={null}
        />
      );

      expect(screen.getByText('User Profile')).toBeInTheDocument();
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show loading state while fetching enhanced data', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      mockSupabase.from.mockImplementation((table: string) => {
        if (table === 'projects') {
          return {
            ...mockSupabase,
            select: vi.fn(() => ({
              ...mockSupabase,
              eq: vi.fn(() => Promise.resolve(mockProjectData.managed)),
            })),
          };
        }
        return mockSupabase;
      });

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });
    });
  });

  describe('Profile Header', () => {
    it('should display user name and email', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('John Doe').length).toBeGreaterThan(0);
        expect(screen.getByText('john.doe@example.com')).toBeInTheDocument();
      });
    });

    it('should display user role', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('intern')).toBeInTheDocument();
      });
    });

    it('should display user initials in avatar', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('J')).toBeInTheDocument();
      });
    });
  });

  describe('Performance Metrics', () => {
    it('should display performance rating when available', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('High Performer')).toBeInTheDocument();
        expect(screen.getByText('Performance')).toBeInTheDocument();
      });
    });

    it('should display pipeline stage when available', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Pipeline Stage')).toBeInTheDocument();
      });
    });

    it('should handle meets_expectations performance rating', async () => {
      const meetsExpectationsData = {
        ...mockPerformanceData,
        performance_rating: 'meets_expectations',
      };
      mockSupabase.single.mockResolvedValueOnce({ data: meetsExpectationsData });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Meets Expectations')).toBeInTheDocument();
      });
    });

    it('should handle needs_improvement performance rating', async () => {
      const needsImprovementData = {
        ...mockPerformanceData,
        performance_rating: 'needs_improvement',
      };
      mockSupabase.single.mockResolvedValueOnce({ data: needsImprovementData });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Needs Improvement')).toBeInTheDocument();
      });
    });
  });

  describe('Project Statistics', () => {
    it('should display project completion rate', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      
      let callCount = 0;
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve(mockProjectData.managed);
            } else {
              return Promise.resolve(mockProjectData.contributed);
            }
          }),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Project Success')).toBeInTheDocument();
        expect(screen.getByText(/50%/)).toBeInTheDocument();
      });
    });

    it('should display total projects count', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      
      let callCount = 0;
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve(mockProjectData.managed);
            } else {
              return Promise.resolve(mockProjectData.contributed);
            }
          }),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Total Projects')).toBeInTheDocument();
        expect(screen.getByText('4')).toBeInTheDocument();
      });
    });

    it('should display completed and active projects', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      
      let callCount = 0;
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve(mockProjectData.managed);
            } else {
              return Promise.resolve(mockProjectData.contributed);
            }
          }),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Completed')).toBeInTheDocument();
        expect(screen.getByText('Active')).toBeInTheDocument();
        expect(screen.getByText('2')).toBeInTheDocument();
      });
    });

    it('should not display project stats when no projects', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('Project Activity')).not.toBeInTheDocument();
      });
    });
  });

  describe('Skills Display', () => {
    it('should display technical skills', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Technical Strengths')).toBeInTheDocument();
        expect(screen.getByText('JavaScript')).toBeInTheDocument();
        expect(screen.getByText('React')).toBeInTheDocument();
        expect(screen.getByText('TypeScript')).toBeInTheDocument();
      });
    });

    it('should display IBM product expertise', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('IBM Product Expertise')).toBeInTheDocument();
        expect(screen.getByText('Watson')).toBeInTheDocument();
        expect(screen.getByText('Cloud Pak')).toBeInTheDocument();
      });
    });

    it('should show message when no skills listed', async () => {
      const noSkillsProfile = { ...mockProfileData, skills: [] };
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={noSkillsProfile}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/No skills listed - recommend skill assessment/)).toBeInTheDocument();
      });
    });

    it('should show message when no products listed', async () => {
      const noProductsProfile = { ...mockProfileData, products: [] };
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={noProductsProfile}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/No product expertise listed - training opportunity/)).toBeInTheDocument();
      });
    });
  });

  describe('Experience and Interests', () => {
    it('should display professional experience', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Professional Experience')).toBeInTheDocument();
        expect(screen.getByText('2 years of software development experience')).toBeInTheDocument();
      });
    });

    it('should display career interests', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Career Interests')).toBeInTheDocument();
        expect(screen.getByText('AI and machine learning projects')).toBeInTheDocument();
      });
    });

    it('should not display experience section when not provided', async () => {
      const noExperienceProfile = { ...mockProfileData, experience: undefined };
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={noExperienceProfile}
        />
      );

      await waitFor(() => {
        expect(screen.queryByText('Professional Experience')).not.toBeInTheDocument();
      });
    });
  });

  describe('Recommendations', () => {
    it('should recommend skill assessment when no skills', async () => {
      const noSkillsProfile = { ...mockProfileData, skills: [] };
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={noSkillsProfile}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Leadership Recommendations')).toBeInTheDocument();
        expect(screen.getByText(/Schedule skill assessment to identify technical capabilities/)).toBeInTheDocument();
      });
    });

    it('should recommend product training when no products', async () => {
      const noProductsProfile = { ...mockProfileData, products: [] };
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={noProductsProfile}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Assign IBM product training to build expertise/)).toBeInTheDocument();
      });
    });

    it('should recommend leadership opportunities for high performers', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Consider for leadership opportunities or mentorship roles/)).toBeInTheDocument();
      });
    });

    it('should recommend performance improvement plan when needed', async () => {
      const needsImprovementData = {
        ...mockPerformanceData,
        performance_rating: 'needs_improvement',
      };
      mockSupabase.single.mockResolvedValueOnce({ data: needsImprovementData });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Schedule 1:1 to discuss performance improvement plan/)).toBeInTheDocument();
      });
    });

    it('should recommend performance review when no data', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Complete performance review to establish baseline metrics/)).toBeInTheDocument();
      });
    });

    it('should recommend project support for low completion rate', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      
      const lowCompletionData = {
        managed: {
          data: [
            { id: 'proj-1', status: 'in progress' },
            { id: 'proj-2', status: 'in progress' },
            { id: 'proj-3', status: 'complete' },
          ],
        },
        contributed: { data: [] },
      };

      let callCount = 0;
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve(lowCompletionData.managed);
            } else {
              return Promise.resolve(lowCompletionData.contributed);
            }
          }),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText(/Review project completion challenges and provide support/)).toBeInTheDocument();
      });
    });
  });

  describe('Modal Controls', () => {
    it('should call onOpenChange when modal is closed', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      const user = userEvent.setup();
      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('John Doe')).toBeInTheDocument();
      });

      const closeButton = screen.getAllByRole('button')[0];
      await user.click(closeButton);

      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should not render when open is false', () => {
      render(
        <ApplicantProfileModal
          open={false}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle fetch errors gracefully', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockSupabase.single.mockRejectedValueOnce(new Error('Database error'));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error fetching enhanced data:',
          expect.any(Error)
        );
      });

      consoleErrorSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle profile with display_name instead of fullName', async () => {
      const displayNameProfile = {
        ...mockProfileData,
        fullName: undefined,
        display_name: 'Jane Smith',
      };
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={displayNameProfile}
        />
      );

      await waitFor(() => {
        expect(screen.getAllByText('Jane Smith').length).toBeGreaterThan(0);
      });
    });

    it('should handle skills without nested skill object', async () => {
      const simpleSkillsProfile = {
        ...mockProfileData,
        skills: ['Python', 'Java'],
      };
      mockSupabase.single.mockResolvedValueOnce({ data: null });
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => Promise.resolve({ data: [] })),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={simpleSkillsProfile}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('Python')).toBeInTheDocument();
        expect(screen.getByText('Java')).toBeInTheDocument();
      });
    });

    it('should handle zero completion rate', async () => {
      mockSupabase.single.mockResolvedValueOnce({ data: mockPerformanceData });
      
      const zeroCompletionData = {
        managed: {
          data: [
            { id: 'proj-1', status: 'in progress' },
            { id: 'proj-2', status: 'in progress' },
          ],
        },
        contributed: { data: [] },
      };

      let callCount = 0;
      mockSupabase.from.mockImplementation(() => ({
        ...mockSupabase,
        select: vi.fn(() => ({
          ...mockSupabase,
          eq: vi.fn(() => {
            callCount++;
            if (callCount === 1) {
              return Promise.resolve(zeroCompletionData.managed);
            } else {
              return Promise.resolve(zeroCompletionData.contributed);
            }
          }),
        })),
      }));

      render(
        <ApplicantProfileModal
          open={true}
          onOpenChange={mockOnOpenChange}
          profileData={mockProfileData}
        />
      );

      await waitFor(() => {
        expect(screen.getByText('0%')).toBeInTheDocument();
      });
    });
  });
});

// Made with Bob
