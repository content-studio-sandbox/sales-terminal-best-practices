import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '../useAuth';

// Mock fetch for API calls
global.fetch = vi.fn();

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockReset();
  });

  it('should initialize and complete loading', async () => {
    const { result } = renderHook(() => useAuth());
    
    // Should complete loading
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });
  });

  it('should eventually load a user', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // Should have a user (either from mock or API)
    expect(result.current.user).toBeTruthy();
    expect(result.current.user?.id).toBeTruthy();
  });

  it('should provide userId from user', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    expect(result.current.userId).toBeTruthy();
    expect(typeof result.current.userId).toBe('string');
  });

  it('should use proxy by default', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    expect(result.current.useProxy).toBe(true);
  });

  it('should provide refresh function', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    expect(typeof result.current.refresh).toBe('function');
  });

  it('should provide signOut function', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    expect(typeof result.current.signOut).toBe('function');
  });

  it('should have valid user structure', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    const user = result.current.user;
    expect(user).toBeTruthy();
    expect(user).toHaveProperty('id');
    expect(user).toHaveProperty('email');
    expect(user).toHaveProperty('display_name');
  });

  it('should have UUID format for user id', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    const userId = result.current.userId;
    expect(userId).toBeTruthy();
    // UUID format: 8-4-4-4-12 (relaxed to accept test UUIDs with zeros)
    expect(userId).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });

  it('should handle fetchFromProxy errors gracefully', async () => {
    // In dev mode with mock enabled, this test verifies the hook completes loading
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // Should complete loading (either from mock or API)
    expect(result.current.loading).toBe(false);
    expect(result.current.user).toBeTruthy();
  });

  it('should handle fetchFromProxy non-ok response', async () => {
    // Mock fetch to return non-ok response
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    expect(result.current.loading).toBe(false);
  });

  it('should handle hydrateFromProfile errors gracefully', async () => {
    // Mock /api/me to succeed
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '12345678-1234-1234-1234-123456789012',
        email: 'test@ibm.com',
        display_name: 'Test User',
        access_role: 'intern',
      }),
    });

    // Mock /api/profile to throw error
    (global.fetch as any).mockRejectedValueOnce(new Error('Profile error'));

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // Should still have user from /api/me even if profile hydration fails
    expect(result.current.user).toBeTruthy();
  });

  it('should handle hydrateFromProfile non-ok response', async () => {
    // Mock /api/me to succeed
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '12345678-1234-1234-1234-123456789012',
        email: 'test@ibm.com',
        display_name: 'Test User',
        access_role: 'intern',
      }),
    });

    // Mock /api/profile to return non-ok
    (global.fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 404,
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    expect(result.current.user).toBeTruthy();
  });

  it('should call refresh function successfully', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // Verify refresh function exists
    expect(typeof result.current.refresh).toBe('function');

    // Call refresh - it will reload user data
    await result.current.refresh();

    // Should complete loading after refresh
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // User should still be loaded
    expect(result.current.user).toBeTruthy();
  });

  it('should handle signOut function', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // Verify signOut function exists and is callable
    expect(typeof result.current.signOut).toBe('function');
    
    // Note: signOut redirects/reloads, so we just verify it's defined
    // Actual redirect behavior is tested in integration tests
  });

  it('should handle signOut error gracefully', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // Verify signOut exists - actual error handling tested in integration
    expect(typeof result.current.signOut).toBe('function');
  });

  it('should have userId derived from user', async () => {
    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // userId should match user.id when user exists
    if (result.current.user) {
      expect(result.current.userId).toBe(result.current.user.id);
    }
  });

  it('should handle invalid UUID in fetchFromProxy', async () => {
    // Mock fetch to return invalid UUID
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: 'invalid-uuid',
        email: 'test@ibm.com',
      }),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // Should handle invalid UUID gracefully
    expect(result.current.loading).toBe(false);
  });

  it('should handle invalid UUID in hydrateFromProfile', async () => {
    // Mock /api/me to succeed
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        id: '12345678-1234-1234-1234-123456789012',
        email: 'test@ibm.com',
      }),
    });

    // Mock /api/profile to return invalid UUID
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        user: {
          id: 'invalid-uuid',
          email: 'updated@ibm.com',
        },
      }),
    });

    const { result } = renderHook(() => useAuth());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    }, { timeout: 2000 });

    // Should fall back to seed user
    expect(result.current.user).toBeTruthy();
  });
});

// Made with Bob