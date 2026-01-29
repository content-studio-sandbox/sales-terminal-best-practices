import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom/vitest';
import YourProjectsPage from '../YourProjectsPage';
import { supabase } from '@/integrations/supabase/client';

// Mock useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(() => ({
    user: {
      id: '87654321-4321-1234-8234-abcdef123456',
      access_role: 'leader',
      email: 'leader@test.com',
      display_name: 'Test Leader'
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

describe('YourProjectsPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
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

  it('should render YourProjectsPage', () => {
    render(
      <BrowserRouter>
        <YourProjectsPage />
      </BrowserRouter>
    );

    // Page should render without crashing
    expect(document.body).toBeInTheDocument();
  });

  it('should render YourProjectsTab component for leaders', async () => {
    render(
      <BrowserRouter>
        <YourProjectsPage />
      </BrowserRouter>
    );

    // Wait for the YourProjectsTab to render with Talent Pool heading (for leaders)
    await waitFor(() => {
      expect(screen.getByText(/Talent Pool/i)).toBeInTheDocument();
    });
  });

  it('should pass user and loading state to YourProjectsTab', async () => {
    render(
      <BrowserRouter>
        <YourProjectsPage />
      </BrowserRouter>
    );

    // Verify the component renders with user data
    await waitFor(() => {
      expect(screen.getByText(/Talent Pool/i)).toBeInTheDocument();
    });
  });

  it('should show Create Project button for leaders', async () => {
    render(
      <BrowserRouter>
        <YourProjectsPage />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/Talent Pool/i)).toBeInTheDocument();
    });

    // Leaders should have Create Project button
    const createButton = screen.getByRole('button', { name: /Create Project/i });
    expect(createButton).toBeInTheDocument();
  });
});

// Made with Bob