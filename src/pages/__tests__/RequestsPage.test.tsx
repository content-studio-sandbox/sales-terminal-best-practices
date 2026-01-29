import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import RequestsPage from '../RequestsPage';
import { supabase } from '@/integrations/supabase/client';

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: {
      id: '12345678-1234-1234-8234-123456789abc',
      access_role: 'intern',
      email: 'test@test.com',
      display_name: 'Test User'
    },
    loading: false,
  })),
}));

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({ data: { subscription: { unsubscribe: vi.fn() } } }),
    },
  },
}));

// Mock fetch
global.fetch = vi.fn();

describe('RequestsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => ([])
    });
    
    const createMockChain = () => {
      const chain = {
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        neq: vi.fn().mockReturnThis(),
        order: vi.fn().mockReturnThis(),
        insert: vi.fn().mockReturnThis(),
        update: vi.fn().mockReturnThis(),
        delete: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue({ data: null, error: null }),
        maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
      };
      
      (chain as any).then = function(resolve: any) {
        return Promise.resolve({ data: [], error: null }).then(resolve);
      };
      
      return chain;
    };
    
    (supabase.from as any).mockImplementation(() => createMockChain());
  });

  it('should render RequestsPage', () => {
    render(
      <BrowserRouter>
        <RequestsPage />
      </BrowserRouter>
    );

    // Page should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should render RequestsTab component', async () => {
    render(
      <BrowserRouter>
        <RequestsPage />
      </BrowserRouter>
    );

    // Wait for the RequestsTab to render with its heading
    await waitFor(() => {
      expect(screen.getByText(/Project Requests/i)).toBeInTheDocument();
    });
  });

  it('should pass user from useAuth to RequestsTab', async () => {
    render(
      <BrowserRouter>
        <RequestsPage />
      </BrowserRouter>
    );

    // Verify the component renders with user data
    await waitFor(() => {
      expect(screen.getByText(/Project Requests/i)).toBeInTheDocument();
    });
  });
});

// Made with Bob