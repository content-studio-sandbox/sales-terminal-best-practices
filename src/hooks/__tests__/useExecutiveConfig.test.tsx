import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor, act } from '@testing-library/react';
import { useExecutiveConfig } from '../useExecutiveConfig';
import { supabase } from '@/integrations/supabase/client';
import * as useAuthModule from '../useAuth';

// Mock useAuth
const mockUser = {
  id: 'test-user-id',
  email: 'test@example.com',
  display_name: 'Test User',
  access_role: 'manager' as const,
};

vi.mock('../useAuth');

describe('useExecutiveConfig', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset the mock implementation
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: mockUser,
      userId: mockUser.id,
      loading: false,
      useProxy: false,
      refresh: vi.fn(),
      signOut: vi.fn(),
    });
  });

  it('should initialize with default config', async () => {
    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.config).toBeDefined();
    expect(result.current.config.avgProjectValue).toBe(150000);
    expect(result.current.config.avgCostSavings).toBe(50000);
    expect(result.current.config.patentMultiplier).toBe(0.5);
    expect(result.current.config.roiMultiplier).toBe(1.5);
    expect(result.current.config.highPerformerTarget).toBe(48);
    expect(result.current.config.conversionTarget).toBe(67);
  });

  it('should load default strategic initiatives', async () => {
    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.config.strategicInitiatives).toHaveLength(3);
    expect(result.current.config.strategicInitiatives[0].name).toBe('AI Innovation');
    expect(result.current.config.strategicInitiatives[0].priority).toBe(1);
    expect(result.current.config.strategicInitiatives[0].active).toBe(true);
    expect(result.current.config.strategicInitiatives[1].name).toBe('Cloud Excellence');
    expect(result.current.config.strategicInitiatives[2].name).toBe('Digital Transformation');
  });

  it('should load config from database', async () => {
    const mockConfigData = [
      { config_key: 'avgProjectValue', config_value: 200000 },
      { config_key: 'avgCostSavings', config_value: 75000 },
      { config_key: 'patentMultiplier', config_value: 0.8 },
      { config_key: 'roiMultiplier', config_value: 2.0 },
    ];

    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: mockConfigData,
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.config.avgProjectValue).toBe(200000);
    expect(result.current.config.avgCostSavings).toBe(75000);
    expect(result.current.config.patentMultiplier).toBe(0.8);
    expect(result.current.config.roiMultiplier).toBe(2.0);
  });

  it('should merge loaded config with defaults', async () => {
    const mockConfigData = [
      { config_key: 'avgProjectValue', config_value: 200000 },
    ];

    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: mockConfigData,
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should have loaded value
    expect(result.current.config.avgProjectValue).toBe(200000);
    // Should have default values for unloaded keys
    expect(result.current.config.avgCostSavings).toBe(50000);
    expect(result.current.config.patentMultiplier).toBe(0.5);
  });

  it('should handle database errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database connection failed' },
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should fall back to default config
    expect(result.current.config.avgProjectValue).toBe(150000);
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should save config successfully', async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'executive_config') {
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          upsert: mockUpsert,
        } as any;
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let saveResult: boolean | undefined;
    await act(async () => {
      saveResult = await result.current.saveConfig({
        avgProjectValue: 250000,
        avgCostSavings: 100000,
      });
    });

    expect(saveResult).toBe(true);
    expect(mockUpsert).toHaveBeenCalledTimes(2);
    expect(result.current.config.avgProjectValue).toBe(250000);
    expect(result.current.config.avgCostSavings).toBe(100000);
  });

  it('should handle save errors', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const mockUpsert = vi.fn().mockResolvedValue({
      error: { message: 'Save failed' },
    });

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'executive_config') {
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          upsert: mockUpsert,
        } as any;
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let saveResult: boolean | undefined;
    await act(async () => {
      saveResult = await result.current.saveConfig({
        avgProjectValue: 250000,
      });
    });

    expect(saveResult).toBe(false);
    expect(result.current.error).toBe('Failed to save configuration');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should not save if user is not authenticated', async () => {
    // Override the mock for this test
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: null,
      userId: '',
      loading: false,
      useProxy: false,
      refresh: vi.fn(),
      signOut: vi.fn(),
    });

    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let saveResult: boolean | undefined;
    await act(async () => {
      saveResult = await result.current.saveConfig({
        avgProjectValue: 250000,
      });
    });

    expect(saveResult).toBe(false);
    expect(result.current.error).toBe('User not authenticated');
    
    // Restore the mock
    vi.mocked(useAuthModule.useAuth).mockReturnValue({
      user: mockUser,
      userId: mockUser.id,
      loading: false,
      useProxy: false,
      refresh: vi.fn(),
      signOut: vi.fn(),
    });
  });

  it('should reset to defaults', async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'executive_config') {
        return {
          select: vi.fn().mockResolvedValue({
            data: [{ config_key: 'avgProjectValue', config_value: 999999 }],
            error: null,
          }),
          upsert: mockUpsert,
        } as any;
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Config should have loaded custom value
    expect(result.current.config.avgProjectValue).toBe(999999);

    // Reset to defaults
    let resetResult: boolean | undefined;
    await act(async () => {
      resetResult = await result.current.resetToDefaults();
    });

    expect(resetResult).toBe(true);
    expect(result.current.config.avgProjectValue).toBe(150000);
    expect(result.current.config.avgCostSavings).toBe(50000);
  });

  it('should support refetch functionality', async () => {
    const mockSelect = vi.fn()
      .mockResolvedValueOnce({ data: [], error: null })
      .mockResolvedValueOnce({
        data: [{ config_key: 'avgProjectValue', config_value: 300000 }],
        error: null,
      });

    vi.mocked(supabase.from).mockImplementation(() => {
      return {
        select: mockSelect,
      } as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.config.avgProjectValue).toBe(150000);

    // Refetch
    await act(async () => {
      await result.current.refetch();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.config.avgProjectValue).toBe(300000);
  });

  it('should handle null and undefined config values', async () => {
    const mockConfigData = [
      { config_key: 'avgProjectValue', config_value: null },
      { config_key: 'avgCostSavings', config_value: undefined },
      { config_key: 'patentMultiplier', config_value: 0.7 },
    ];

    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: mockConfigData,
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should use defaults for null/undefined values
    expect(result.current.config.avgProjectValue).toBe(150000);
    expect(result.current.config.avgCostSavings).toBe(50000);
    // Should use loaded value
    expect(result.current.config.patentMultiplier).toBe(0.7);
  });

  it('should track saving state', async () => {
    const mockUpsert = vi.fn().mockImplementation(() => {
      return new Promise(resolve => {
        setTimeout(() => resolve({ error: null }), 100);
      });
    });

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'executive_config') {
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          upsert: mockUpsert,
        } as any;
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.saving).toBe(false);

    act(() => {
      result.current.saveConfig({ avgProjectValue: 250000 });
    });

    // Should be saving
    expect(result.current.saving).toBe(true);

    await waitFor(() => {
      expect(result.current.saving).toBe(false);
    });
  });

  it('should include updated_by and updated_at in upsert', async () => {
    const mockUpsert = vi.fn().mockResolvedValue({ error: null });

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'executive_config') {
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          upsert: mockUpsert,
        } as any;
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.saveConfig({ avgProjectValue: 250000 });
    });

    expect(mockUpsert).toHaveBeenCalledWith(
      expect.objectContaining({
        config_key: 'avgProjectValue',
        config_value: 250000,
        updated_by: 'test-user-id',
        updated_at: expect.any(String),
      }),
      { onConflict: 'config_key' }
    );
  });

  it('should handle exceptions during load', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockRejectedValue(new Error('Network error')),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Network error');
    expect(result.current.config.avgProjectValue).toBe(150000); // Should use defaults
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });

  it('should handle exceptions during save', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      if (table === 'executive_config') {
        return {
          select: vi.fn().mockResolvedValue({ data: [], error: null }),
          upsert: vi.fn().mockRejectedValue(new Error('Save exception')),
        } as any;
      }
      return {
        select: vi.fn().mockResolvedValue({ data: [], error: null }),
      } as any;
    });

    const { result } = renderHook(() => useExecutiveConfig());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    let saveResult: boolean | undefined;
    await act(async () => {
      saveResult = await result.current.saveConfig({ avgProjectValue: 250000 });
    });

    expect(saveResult).toBe(false);
    expect(result.current.error).toBe('Save exception');
    expect(consoleErrorSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
  });
});

// Made with Bob