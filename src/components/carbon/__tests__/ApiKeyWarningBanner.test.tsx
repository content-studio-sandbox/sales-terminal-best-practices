import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import ApiKeyWarningBanner from '../ApiKeyWarningBanner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth');

describe('ApiKeyWarningBanner', () => {
  const mockOnOpenSettings = vi.fn();

  const createMockAuth = (user: any = null) => ({
    user,
    userId: user?.id || '',
    loading: false,
    useProxy: false,
    refresh: vi.fn(),
    signOut: vi.fn(),
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering Logic', () => {
    it('should not render when user is not authenticated', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth(null));

      const { container } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      expect(container.firstChild).toBeNull();
    });

    it('should not render while checking API keys (loading state)', () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      // Mock pending query
      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockImplementation(() => new Promise(() => {})), // Never resolves
          }),
        }),
      } as any);

      const { container } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      expect(container.firstChild).toBeNull();
    });

    it('should not render when user has WatsonX API key', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ watsonx_api_key: 'sk-test-key', orchestrate_api_key: null }],
              error: null,
            }),
          }),
        }),
      } as any);

      const { container } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('user_api_keys');
      });

      expect(container.firstChild).toBeNull();
    });

    it('should not render when user has Orchestrate API key', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ watsonx_api_key: null, orchestrate_api_key: 'orch-key-123' }],
              error: null,
            }),
          }),
        }),
      } as any);

      const { container } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('user_api_keys');
      });

      expect(container.firstChild).toBeNull();
    });

    it('should not render when user has both API keys', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ watsonx_api_key: 'sk-test-key', orchestrate_api_key: 'orch-key-123' }],
              error: null,
            }),
          }),
        }),
      } as any);

      const { container } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('user_api_keys');
      });

      expect(container.firstChild).toBeNull();
    });

    it('should render warning when user has no API keys', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ watsonx_api_key: null, orchestrate_api_key: null }],
              error: null,
            }),
          }),
        }),
      } as any);

      render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(screen.getByText('API Keys Not Configured')).toBeInTheDocument();
      });

      expect(screen.getByText(/To use WatsonX.ai and Watson Orchestrate features/)).toBeInTheDocument();
    });

    it('should render warning when user has empty string API keys', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ watsonx_api_key: '', orchestrate_api_key: '' }],
              error: null,
            }),
          }),
        }),
      } as any);

      render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(screen.getByText('API Keys Not Configured')).toBeInTheDocument();
      });
    });

    it('should render warning when no data is returned', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [],
              error: null,
            }),
          }),
        }),
      } as any);

      render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(screen.getByText('API Keys Not Configured')).toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should not render when API query returns an error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: null,
              error: { message: 'Database error', code: 'PGRST116' },
            }),
          }),
        }),
      } as any);

      const { container } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error checking API keys:',
          expect.objectContaining({ message: 'Database error' })
        );
      });

      expect(container.firstChild).toBeNull();

      consoleErrorSpy.mockRestore();
    });

    it('should not render when API query throws an exception', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockRejectedValue(new Error('Network error')),
          }),
        }),
      } as any);

      const { container } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(consoleErrorSpy).toHaveBeenCalledWith(
          'Error checking API keys:',
          expect.any(Error)
        );
      });

      expect(container.firstChild).toBeNull();

      consoleErrorSpy.mockRestore();
    });
  });

  describe('User Interactions', () => {
    it('should call onOpenSettings when "Configure API Keys" button is clicked', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ watsonx_api_key: null, orchestrate_api_key: null }],
              error: null,
            }),
          }),
        }),
      } as any);

      render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(screen.getByText('Configure API Keys')).toBeInTheDocument();
      });

      const button = screen.getByText('Configure API Keys');
      button.click();

      expect(mockOnOpenSettings).toHaveBeenCalledTimes(1);
    });

    it('should hide banner when close button is clicked', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ watsonx_api_key: null, orchestrate_api_key: null }],
              error: null,
            }),
          }),
        }),
      } as any);

      const { container } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(screen.getByText('API Keys Not Configured')).toBeInTheDocument();
      });

      // Find and click close button
      const closeButton = container.querySelector('button[aria-label*="close"]');
      expect(closeButton).toBeInTheDocument();
      
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.queryByText('API Keys Not Configured')).not.toBeInTheDocument();
      });
    });

    it('should remain dismissed after close button is clicked', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ watsonx_api_key: null, orchestrate_api_key: null }],
              error: null,
            }),
          }),
        }),
      } as any);

      const { container, rerender } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(screen.getByText('API Keys Not Configured')).toBeInTheDocument();
      });

      // Click close button
      const closeButton = container.querySelector('button[aria-label*="close"]');
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.queryByText('API Keys Not Configured')).not.toBeInTheDocument();
      });

      // Rerender component - should still be dismissed
      rerender(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      expect(screen.queryByText('API Keys Not Configured')).not.toBeInTheDocument();
    });
  });

  describe('API Query', () => {
    it('should query user_api_keys table with correct user_id', async () => {
      const userId = 'test-user-456';
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: userId, email: 'test@example.com' }));

      const mockEq = vi.fn().mockReturnValue({
        limit: vi.fn().mockResolvedValue({
          data: [{ watsonx_api_key: 'key', orchestrate_api_key: null }],
          error: null,
        }),
      });

      const mockSelect = vi.fn().mockReturnValue({
        eq: mockEq,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: mockSelect,
      } as any);

      render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('user_api_keys');
      });

      expect(mockSelect).toHaveBeenCalledWith('watsonx_api_key, orchestrate_api_key');
      expect(mockEq).toHaveBeenCalledWith('user_id', userId);
    });

    it('should limit query to 1 result', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      const mockLimit = vi.fn().mockResolvedValue({
        data: [{ watsonx_api_key: 'key', orchestrate_api_key: null }],
        error: null,
      });

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: mockLimit,
          }),
        }),
      } as any);

      render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(mockLimit).toHaveBeenCalledWith(1);
      });
    });
  });

  describe('Notification Styling', () => {
    it('should use warning kind for notification', async () => {
      vi.mocked(useAuth).mockReturnValue(createMockAuth({ id: 'user-123', email: 'test@example.com' }));

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: [{ watsonx_api_key: null, orchestrate_api_key: null }],
              error: null,
            }),
          }),
        }),
      } as any);

      const { container } = render(<ApiKeyWarningBanner onOpenSettings={mockOnOpenSettings} />);

      await waitFor(() => {
        expect(screen.getByText('API Keys Not Configured')).toBeInTheDocument();
      });

      const notification = container.querySelector('.cds--actionable-notification--warning');
      expect(notification).toBeInTheDocument();
    });
  });
});

// Made with Bob
