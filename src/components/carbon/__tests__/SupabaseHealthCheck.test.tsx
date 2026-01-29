import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import SupabaseHealthCheck from '../SupabaseHealthCheck';
import { supabase } from '@/integrations/supabase/client';

describe('SupabaseHealthCheck', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Healthy State', () => {
    it('should not render notification when all checks pass', async () => {
      // Mock successful health checks
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      } as any);

      const { container } = render(<SupabaseHealthCheck />);

      // Wait for health check to complete
      await waitFor(() => {
        expect(supabase.auth.getSession).toHaveBeenCalled();
      });

      // Should not render anything when healthy
      expect(container.firstChild).toBeNull();
    });

    it('should not render notification during initial check', () => {
      // Mock pending health check
      vi.mocked(supabase.auth.getSession).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { container } = render(<SupabaseHealthCheck />);

      // Should not render anything while checking
      expect(container.firstChild).toBeNull();
    });
  });

  describe('Error States', () => {
    it('should show error notification when auth fails', async () => {
      const authError = new Error('Authentication failed');
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: authError,
      } as any);

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('Supabase Connection Failed')).toBeInTheDocument();
      });

      expect(screen.getByText(/Authentication error: Authentication failed/)).toBeInTheDocument();
    });

    it('should show error notification when health check throws', async () => {
      vi.mocked(supabase.auth.getSession).mockRejectedValue(new Error('Network error'));

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('Health Check Failed')).toBeInTheDocument();
      });

      expect(screen.getByText(/Network error/)).toBeInTheDocument();
    });

    it('should handle unknown error types', async () => {
      vi.mocked(supabase.auth.getSession).mockRejectedValue('String error');

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('Health Check Failed')).toBeInTheDocument();
      });

      expect(screen.getByText(/Unknown error/)).toBeInTheDocument();
    });
  });

  describe('Degraded States', () => {
    it('should show degraded notification when users table is missing', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: null,
            error: { code: '42P01', message: 'relation "users" does not exist' },
          }),
        }),
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('Database Schema Incomplete')).toBeInTheDocument();
      });

      expect(screen.getByText(/Some tables are missing. Please run migrations./)).toBeInTheDocument();
    });

    it('should show degraded notification for other query errors', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({
            data: null,
            error: { code: 'PGRST116', message: 'Permission denied' },
          }),
        }),
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('Database Query Issues')).toBeInTheDocument();
      });

      expect(screen.getByText(/Query error: Permission denied/)).toBeInTheDocument();
    });

    it('should show degraded notification when feedback table is missing', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      let callCount = 0;
      const mockFrom = vi.fn().mockImplementation((table: string) => {
        callCount++;
        const hasError = table === 'feedback';
        return {
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: hasError ? null : [],
              error: hasError ? { message: 'Table not found' } : null,
            }),
          }),
        };
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('New Features Unavailable')).toBeInTheDocument();
      });

      expect(screen.getByText(/Feedback system and BYOK tables are missing/)).toBeInTheDocument();
      expect(screen.getByText(/Action Required: Run APPLY_ALL_TODAY_MIGRATIONS.sql/)).toBeInTheDocument();
    });

    it('should show degraded notification when user_api_keys table is missing', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockImplementation((table: string) => {
        const hasError = table === 'user_api_keys';
        return {
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: hasError ? null : [],
              error: hasError ? { message: 'Table not found' } : null,
            }),
          }),
        };
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('New Features Unavailable')).toBeInTheDocument();
      });
    });
  });

  describe('User Interactions', () => {
    it('should show "View Migrations" button for degraded state', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockImplementation((table: string) => {
        const hasError = table === 'feedback';
        return {
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: hasError ? null : [],
              error: hasError ? { message: 'Table not found' } : null,
            }),
          }),
        };
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('View Migrations')).toBeInTheDocument();
      });
    });

    it('should not show action button for error state', async () => {
      const authError = new Error('Authentication failed');
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: authError,
      } as any);

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('Supabase Connection Failed')).toBeInTheDocument();
      });

      expect(screen.queryByText('View Migrations')).not.toBeInTheDocument();
    });

    it('should open Supabase dashboard when "View Migrations" is clicked', async () => {
      const windowOpenSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockImplementation((table: string) => {
        const hasError = table === 'feedback';
        return {
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: hasError ? null : [],
              error: hasError ? { message: 'Table not found' } : null,
            }),
          }),
        };
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('View Migrations')).toBeInTheDocument();
      });

      const button = screen.getByText('View Migrations');
      button.click();

      expect(windowOpenSpy).toHaveBeenCalledWith(
        'https://supabase.com/dashboard/project/_/sql',
        '_blank'
      );

      windowOpenSpy.mockRestore();
    });

    it('should close notification when close button is clicked', async () => {
      const authError = new Error('Authentication failed');
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: authError,
      } as any);

      const { container } = render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('Supabase Connection Failed')).toBeInTheDocument();
      });

      // Find and click close button (Carbon uses a button with aria-label)
      const closeButton = container.querySelector('button[aria-label*="close"]');
      expect(closeButton).toBeInTheDocument();
      
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true }));

      await waitFor(() => {
        expect(screen.queryByText('Supabase Connection Failed')).not.toBeInTheDocument();
      });
    });
  });


  describe('Component Lifecycle', () => {
    it('should cleanup on unmount', () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      vi.mocked(supabase.from).mockReturnValue({
        select: vi.fn().mockReturnValue({
          limit: vi.fn().mockResolvedValue({ data: [], error: null }),
        }),
      } as any);

      const { unmount } = render(<SupabaseHealthCheck />);

      // Should not throw errors on unmount
      expect(() => unmount()).not.toThrow();
    });
  });

  describe('Notification Styling', () => {
    it('should use error kind for error status', async () => {
      const authError = new Error('Authentication failed');
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: authError,
      } as any);

      const { container } = render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('Supabase Connection Failed')).toBeInTheDocument();
      });

      const notification = container.querySelector('.cds--actionable-notification--error');
      expect(notification).toBeInTheDocument();
    });

    it('should use warning kind for degraded status', async () => {
      vi.mocked(supabase.auth.getSession).mockResolvedValue({
        data: { session: null },
        error: null,
      } as any);

      const mockFrom = vi.fn().mockImplementation((table: string) => {
        const hasError = table === 'feedback';
        return {
          select: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({
              data: hasError ? null : [],
              error: hasError ? { message: 'Table not found' } : null,
            }),
          }),
        };
      });

      vi.mocked(supabase.from).mockImplementation(mockFrom as any);

      const { container } = render(<SupabaseHealthCheck />);

      await waitFor(() => {
        expect(screen.getByText('New Features Unavailable')).toBeInTheDocument();
      });

      const notification = container.querySelector('.cds--actionable-notification--warning');
      expect(notification).toBeInTheDocument();
    });
  });
});

// Made with Bob
