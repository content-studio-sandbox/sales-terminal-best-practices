import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/vitest';
import EditProfileModal from '../EditProfileModal';

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('EditProfileModal', () => {
  const mockRoles = [
    { id: '1', name: 'Software Engineer' },
    { id: '2', name: 'Data Scientist' }
  ];

  const mockSkills = [
    { id: '1', name: 'JavaScript' },
    { id: '2', name: 'Python' },
    { id: '3', name: 'React' }
  ];

  const mockProducts = [
    { id: '1', name: 'Watson' },
    { id: '2', name: 'Cloud Pak' }
  ];

  const mockProfile = {
    user: {
      display_name: 'John Doe',
      role_id: '1',
      interests: 'AI and Machine Learning',
      weekly_availability: 40
    },
    skills: [
      { id: '1', skill_id: '1', name: 'JavaScript' },
      { id: '2', skill_id: '2', name: 'Python' }
    ],
    products: [
      { id: '1', product_id: '1', name: 'Watson' }
    ]
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const setupSuccessfulMocks = () => {
    mockFetch.mockImplementation((url: string) => {
      if (url === '/api/refs/roles') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockRoles)
        });
      }
      if (url === '/api/refs/skills') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockSkills)
        });
      }
      if (url === '/api/refs/products') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProducts)
        });
      }
      if (url === '/api/profile') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile)
        });
      }
      return Promise.resolve({
        ok: false,
        status: 404,
        json: () => Promise.resolve({ error: 'Not found' })
      });
    });
  };

  it('should render modal when open', async () => {
    setupSuccessfulMocks();

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Edit Profile')).toBeInTheDocument();
    });
  });

  it('should show loading state initially', async () => {
    setupSuccessfulMocks();

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    expect(screen.getByText('Loading profile...')).toBeInTheDocument();
  });

  it('should load and display profile data', async () => {
    setupSuccessfulMocks();

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });

    // Check that form fields are populated
    const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement;
    expect(nameInput.value).toBe('John Doe');

    const interestsInput = screen.getByLabelText('Interests & Career Goals') as HTMLTextAreaElement;
    expect(interestsInput.value).toBe('AI and Machine Learning');
  });

  it('should load roles, skills, and products options', async () => {
    setupSuccessfulMocks();

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith('/api/refs/roles', { credentials: 'include' });
      expect(mockFetch).toHaveBeenCalledWith('/api/refs/skills', { credentials: 'include' });
      expect(mockFetch).toHaveBeenCalledWith('/api/refs/products', { credentials: 'include' });
      expect(mockFetch).toHaveBeenCalledWith('/api/profile', { credentials: 'include' });
    });
  });

  it('should handle display name input change', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement;
    await user.clear(nameInput);
    await user.type(nameInput, 'Jane Smith');

    expect(nameInput.value).toBe('Jane Smith');
  });

  it('should handle interests textarea change', async () => {
    setupSuccessfulMocks();
    const user = userEvent.setup();

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });

    const interestsInput = screen.getByLabelText('Interests & Career Goals') as HTMLTextAreaElement;
    await user.clear(interestsInput);
    await user.type(interestsInput, 'Cloud Computing');

    expect(interestsInput.value).toBe('Cloud Computing');
  });


  it('should handle profile load error', async () => {
    mockFetch.mockImplementation((url: string) => {
      if (url === '/api/profile') {
        return Promise.resolve({
          ok: false,
          status: 500,
          json: () => Promise.resolve({ error: 'Load failed' })
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load profile')).toBeInTheDocument();
      expect(screen.getByText('Load failed')).toBeInTheDocument();
    });
  });

  it('should handle roles load error gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    mockFetch.mockImplementation((url: string) => {
      if (url === '/api/refs/roles') {
        return Promise.reject(new Error('Network error'));
      }
      if (url === '/api/profile') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(mockProfile)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });

    // Should still render the form even if roles failed to load
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();

    consoleErrorSpy.mockRestore();
  });

  it('should close modal when cancel button is clicked', async () => {
    setupSuccessfulMocks();
    const onOpenChange = vi.fn();
    const user = userEvent.setup();

    render(
      <EditProfileModal
        open={true}
        onOpenChange={onOpenChange}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });

    const cancelButton = screen.getByText('Cancel');
    await user.click(cancelButton);

    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('should disable save button while loading', async () => {
    setupSuccessfulMocks();

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    const saveButton = screen.getByText('Save Changes');
    expect(saveButton).toBeDisabled();

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });

    expect(saveButton).not.toBeDisabled();
  });

  it('should handle profile with interests as array', async () => {
    const profileWithArrayInterests = {
      ...mockProfile,
      user: {
        ...mockProfile.user,
        interests: ['AI', 'Machine Learning', 'Cloud']
      }
    };

    mockFetch.mockImplementation((url: string) => {
      if (url === '/api/profile') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(profileWithArrayInterests)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });

    const interestsInput = screen.getByLabelText('Interests & Career Goals') as HTMLTextAreaElement;
    // Should take first element of array
    expect(interestsInput.value).toBe('AI');
  });

  it('should handle profile with null values', async () => {
    const profileWithNulls = {
      user: {
        display_name: null,
        role_id: null,
        interests: null,
        weekly_availability: null
      },
      skills: [],
      products: []
    };

    mockFetch.mockImplementation((url: string) => {
      if (url === '/api/profile') {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(profileWithNulls)
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([])
      });
    });

    render(
      <EditProfileModal
        open={true}
        onOpenChange={() => {}}
      />
    );

    await waitFor(() => {
      expect(screen.queryByText('Loading profile...')).not.toBeInTheDocument();
    });

    const nameInput = screen.getByLabelText('Full Name') as HTMLInputElement;
    expect(nameInput.value).toBe('');

    const interestsInput = screen.getByLabelText('Interests & Career Goals') as HTMLTextAreaElement;
    expect(interestsInput.value).toBe('');
  });

});

// Made with Bob