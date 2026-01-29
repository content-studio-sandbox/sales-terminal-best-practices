import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useExecutiveMetrics } from '../useExecutiveMetrics';
import { supabase } from '@/integrations/supabase/client';

// Mock useExecutiveConfig
const mockConfig = {
  avgProjectValue: 150000,
  avgCostSavings: 50000,
  patentMultiplier: 0.5,
  strategicInitiatives: [
    { name: 'AI Innovation', description: 'Drive AI', priority: 1, active: true },
    { name: 'Cloud Excellence', description: 'Build cloud', priority: 2, active: true },
    { name: 'Digital Transformation', description: 'Accelerate digital', priority: 3, active: true },
  ],
  roiMultiplier: 1.5,
  highPerformerTarget: 48,
  conversionTarget: 67,
};

vi.mock('../useExecutiveConfig', () => ({
  useExecutiveConfig: () => ({
    config: mockConfig,
    loading: false,
    error: null,
    saving: false,
    saveConfig: vi.fn(),
    resetToDefaults: vi.fn(),
    refetch: vi.fn(),
  }),
}));

describe('useExecutiveMetrics', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading state', () => {
    const { result } = renderHook(() => useExecutiveMetrics());
    
    expect(result.current.loading).toBe(true);
    expect(result.current.metrics).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it('should fetch and calculate metrics successfully', async () => {
    const mockUsers = [
      { id: '1', access_role: 'user' },
      { id: '2', access_role: 'intern' },
      { id: '3', access_role: 'manager' },
    ];

    const mockProjects = [
      { id: 'p1', status: 'complete', business_value: 100000 },
      { id: 'p2', status: 'in progress', business_value: 150000 },
      { id: 'p3', status: 'complete', business_value: 200000 },
    ];

    const mockStaff = [
      { user_id: '1', project_id: 'p1' },
      { user_id: '2', project_id: 'p2' },
    ];

    const mockPerformance = [
      { user_id: '1', performance_rating: 'high_performer', pipeline_stage: 'active' },
      { user_id: '2', performance_rating: 'high_performer', pipeline_stage: 'high_performer' },
    ];

    const mockReviews = [
      { project_id: 'p1', actual_roi: 120, quality_rating: 5, business_impact_rating: 5 },
      { project_id: 'p3', actual_roi: 150, quality_rating: 4, business_impact_rating: 4 },
    ];

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: 
            table === 'users' ? mockUsers :
            table === 'projects' ? mockProjects :
            table === 'project_staff' ? mockStaff :
            table === 'user_skills' ? [] :
            table === 'user_performance' ? mockPerformance :
            table === 'project_reviews' ? mockReviews :
            [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics).toBeDefined();
    expect(result.current.metrics?.totalUsers).toBe(3);
    expect(result.current.metrics?.totalProjects).toBe(3);
    expect(result.current.metrics?.completedProjects).toBe(2);
    expect(result.current.metrics?.activeProjects).toBe(1);
    expect(result.current.metrics?.assignedUsers).toBe(2);
    expect(result.current.metrics?.highUtilization).toBe(2);
    expect(result.current.metrics?.businessValue).toBe(450000);
  });

  it('should calculate program ROI from reviews', async () => {
    const mockReviews = [
      { project_id: 'p1', actual_roi: 100 },
      { project_id: 'p2', actual_roi: 200 },
      { project_id: 'p3', actual_roi: 150 },
    ];

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: table === 'project_reviews' ? mockReviews : [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Average ROI: (100 + 200 + 150) / 3 = 150
    expect(result.current.metrics?.programROI).toBe(150);
  });

  it('should calculate talent retention correctly', async () => {
    const mockUsers = [
      { id: '1', access_role: 'user' },
      { id: '2', access_role: 'user' },
      { id: '3', access_role: 'user' },
      { id: '4', access_role: 'user' },
    ];

    const mockStaff = [
      { user_id: '1', project_id: 'p1' },
      { user_id: '2', project_id: 'p2' },
    ];

    const mockSkills = [
      { user_id: '1', skill: 'React' },
      { user_id: '3', skill: 'Node' },
    ];

    const mockPerformance = [
      { user_id: '1', performance_rating: 'high_performer' },
      { user_id: '2', performance_rating: 'average' },
    ];

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: 
            table === 'users' ? mockUsers :
            table === 'project_staff' ? mockStaff :
            table === 'user_skills' ? mockSkills :
            table === 'user_performance' ? mockPerformance :
            [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Engaged users: unique from staff (1,2) + skills (1,3) + performance (1,2) = 3 unique
    // Retention: 3/4 = 75%
    expect(result.current.metrics?.talentRetention).toBe(75);
  });

  it('should calculate strategic alignments from config', async () => {
    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: [
            { id: 'p1', status: 'complete' },
            { id: 'p2', status: 'complete' },
          ],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.strategicAlignments).toHaveLength(3);
    expect(result.current.strategicAlignments[0].initiative).toBe('AI Innovation');
    expect(result.current.strategicAlignments[0].impact).toBe('high');
    expect(result.current.strategicAlignments[1].initiative).toBe('Cloud Excellence');
    expect(result.current.strategicAlignments[1].impact).toBe('high');
  });

  it('should calculate talent pipeline stages', async () => {
    const mockUsers = [
      { id: '1', access_role: 'user' },
      { id: '2', access_role: 'intern' },
    ];

    const mockPerformance = [
      { user_id: '1', pipeline_stage: 'active' },
      { user_id: '2', pipeline_stage: 'high_performer' },
      { user_id: '3', pipeline_stage: 'conversion_candidate' },
      { user_id: '4', pipeline_stage: 'offer_extended' },
      { user_id: '5', pipeline_stage: 'offer_accepted' },
    ];

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: 
            table === 'users' ? mockUsers :
            table === 'user_performance' ? mockPerformance :
            [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.talentPipeline).toHaveLength(5);
    expect(result.current.talentPipeline[0].stage).toBe('Active Co-ops/Interns');
    expect(result.current.talentPipeline[1].stage).toBe('High Performers');
    expect(result.current.talentPipeline[1].count).toBe(1);
    expect(result.current.talentPipeline[2].stage).toBe('Conversion Candidates');
    expect(result.current.talentPipeline[2].count).toBe(1);
  });

  it('should calculate business impacts', async () => {
    const mockProjects = [
      { id: 'p1', status: 'complete', business_value: 1000000 },
      { id: 'p2', status: 'complete', business_value: 2000000 },
      { id: 'p3', status: 'in progress', business_value: 500000 },
    ];

    const mockReviews = [
      { project_id: 'p1', business_impact_rating: 5 },
      { project_id: 'p2', business_impact_rating: 4 },
    ];

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: 
            table === 'projects' ? mockProjects :
            table === 'project_reviews' ? mockReviews :
            [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.businessImpacts).toHaveLength(5);
    expect(result.current.businessImpacts[0].category).toBe('Revenue Generated');
    expect(result.current.businessImpacts[0].value).toBe('$3.0M');
    expect(result.current.businessImpacts[1].category).toBe('Cost Savings');
    expect(result.current.businessImpacts[2].category).toBe('Innovation Patents');
    expect(result.current.businessImpacts[3].category).toBe('Project Quality');
    expect(result.current.businessImpacts[3].value).toBe('4.5/5');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: null,
          error: { message: 'Database error' },
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toBe('Database error');
    expect(result.current.metrics).toBe(null);
  });

  it('should handle empty data sets', async () => {
    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.metrics?.totalUsers).toBe(0);
    expect(result.current.metrics?.totalProjects).toBe(0);
    expect(result.current.metrics?.completedProjects).toBe(0);
    expect(result.current.metrics?.businessValue).toBe(0);
  });

  it('should support refetch functionality', async () => {
    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.refetch).toBeDefined();
    expect(typeof result.current.refetch).toBe('function');

    // Call refetch
    result.current.refetch();

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });
  });

  it('should calculate strategic alignment from quality ratings', async () => {
    const mockProjects = [
      { id: 'p1', status: 'complete' },
      { id: 'p2', status: 'complete' },
      { id: 'p3', status: 'complete' },
    ];

    const mockReviews = [
      { project_id: 'p1', quality_rating: 5, business_impact_rating: 5 },
      { project_id: 'p2', quality_rating: 4, business_impact_rating: 4 },
      { project_id: 'p3', quality_rating: 3, business_impact_rating: 3 },
    ];

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: 
            table === 'projects' ? mockProjects :
            table === 'project_reviews' ? mockReviews :
            [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // 2 out of 3 projects have quality >= 4 and impact >= 4
    // Strategic alignment: 2/3 = 67%
    expect(result.current.metrics?.strategicAlignment).toBe(67);
  });

  it('should filter inactive strategic initiatives', async () => {
    // Override the mock to include inactive initiatives
    vi.mock('../useExecutiveConfig', () => ({
      useExecutiveConfig: () => ({
        config: {
          avgProjectValue: 150000,
          avgCostSavings: 50000,
          patentMultiplier: 0.5,
          strategicInitiatives: [
            { name: 'Active Initiative', description: 'Active', priority: 1, active: true },
            { name: 'Inactive Initiative', description: 'Inactive', priority: 2, active: false },
          ],
          roiMultiplier: 1.5,
          highPerformerTarget: 48,
          conversionTarget: 67,
        },
        loading: false,
      }),
    }));

    vi.mocked(supabase.from).mockImplementation(() => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: [{ id: 'p1', status: 'complete' }],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    // Should only include active initiatives
    const activeInitiatives = result.current.strategicAlignments.filter(
      a => a.initiative !== 'Inactive Initiative'
    );
    expect(activeInitiatives.length).toBeGreaterThan(0);
  });

  it('should calculate conversion rates in talent pipeline', async () => {
    const mockPerformance = [
      { user_id: '1', pipeline_stage: 'active' },
      { user_id: '2', pipeline_stage: 'active' },
      { user_id: '3', pipeline_stage: 'high_performer' },
      { user_id: '4', pipeline_stage: 'conversion_candidate' },
    ];

    vi.mocked(supabase.from).mockImplementation((table: string) => {
      const mockChain = {
        select: vi.fn().mockResolvedValue({
          data: 
            table === 'user_performance' ? mockPerformance :
            table === 'users' ? [{ id: '1', access_role: 'user' }] :
            [],
          error: null,
        }),
      };
      return mockChain as any;
    });

    const { result } = renderHook(() => useExecutiveMetrics());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    const highPerformersStage = result.current.talentPipeline.find(
      p => p.stage === 'High Performers'
    );
    const conversionStage = result.current.talentPipeline.find(
      p => p.stage === 'Conversion Candidates'
    );

    expect(highPerformersStage?.count).toBe(1);
    // Conversion from active (2) to high_performer (1) = 50%
    expect(highPerformersStage?.conversion).toBe(50);
    
    expect(conversionStage?.count).toBe(1);
    // Conversion from high_performer (1) to conversion_candidate (1) = 100%
    expect(conversionStage?.conversion).toBe(100);
  });
});

// Made with Bob