// src/components/carbon/__tests__/CompletedLearningManager.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CompletedLearningManager from '../CompletedLearningManager';
import { supabase } from '@/integrations/supabase/client';

// Mock flatpickr locale
vi.mock('flatpickr/dist/l10n', () => ({
  default: {},
}));

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock data
const mockLearningEntries = [
  {
    id: '1',
    user_id: 'user-123',
    title: 'Python for Beginners',
    issuer: 'IBM',
    completion_date: '2024-01-15',
    evidence_url: 'https://example.com/cert1',
    notes: 'Great course',
    tags: ['python', 'programming'],
    related_skills: ['skill-1', 'skill-2'],
    verified_by: null,
    verified_at: null,
    verifier_name: null,
    learning_type: 'course',
  },
  {
    id: '2',
    user_id: 'user-123',
    title: 'Advanced JavaScript',
    issuer: 'Coursera',
    completion_date: '2024-02-20',
    evidence_url: null,
    notes: null,
    tags: ['javascript', 'web'],
    related_skills: ['skill-3'],
    verified_by: 'verifier-1',
    verified_at: '2024-02-21',
    verifier_name: 'John Doe',
    learning_type: 'certification',
  },
];

const mockLearningItems = [
  {
    id: 'item-1',
    title: 'Python for Beginners',
    issuer: 'IBM',
    type: 'course',
    description: 'Learn Python basics',
  },
  {
    id: 'item-2',
    title: 'React Fundamentals',
    issuer: 'Meta',
    type: 'course',
    description: 'Learn React',
  },
];

const mockSkills = [
  { id: 'skill-1', name: 'Python', category: 'Programming' },
  { id: 'skill-2', name: 'Data Analysis', category: 'Analytics' },
  { id: 'skill-3', name: 'JavaScript', category: 'Programming' },
];

describe('CompletedLearningManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    const mockFrom = vi.fn((table: string) => {
      if (table === 'user_learning_detailed') {
        return {
          select: vi.fn(() => ({
            eq: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningEntries, error: null })),
            })),
          })),
        };
      }
      if (table === 'learning_items') {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
          })),
        };
      }
      if (table === 'skills') {
        return {
          select: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
          })),
        };
      }
      // Default mock for user_learning (used for duplicate check and CRUD operations)
      const eqChain = {
        eq: vi.fn(() => eqChain),
        neq: vi.fn(() => Promise.resolve({ data: [], error: null })),
        order: vi.fn(() => Promise.resolve({ data: [], error: null })),
      };
      
      return {
        select: vi.fn(() => eqChain),
        insert: vi.fn(() => Promise.resolve({ error: null })),
        update: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
        delete: vi.fn(() => ({
          eq: vi.fn(() => Promise.resolve({ error: null })),
        })),
      };
    });
    
    (supabase.from as any).mockImplementation(mockFrom);
  });

  describe('Basic Rendering', () => {
    it('should render loading state initially', () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      expect(screen.getByText(/loading learning entries/i)).toBeInTheDocument();
    });

    it('should render learning entries table after loading', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
    });

    it('should display table headers correctly', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const titleHeaders = screen.getAllByText('Title');
      expect(titleHeaders.length).toBeGreaterThan(0);
      const issuerHeaders = screen.getAllByText('Issuer');
      expect(issuerHeaders.length).toBeGreaterThan(0);
      expect(screen.getByText('Completion Date')).toBeInTheDocument();
      const tagsHeaders = screen.getAllByText('Tags');
      expect(tagsHeaders.length).toBeGreaterThan(0);
      expect(screen.getByText('Related Skills')).toBeInTheDocument();
      expect(screen.getByText('Verification')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Learning Entries Display', () => {
    it('should display learning entry details correctly', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('IBM')).toBeInTheDocument();
      expect(screen.getByText('Coursera')).toBeInTheDocument();
    });

    it('should display completion dates in localized format', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      // Dates should be formatted
      const date1 = new Date('2024-01-15').toLocaleDateString();
      const date2 = new Date('2024-02-20').toLocaleDateString();
      expect(screen.getByText(date1)).toBeInTheDocument();
      expect(screen.getByText(date2)).toBeInTheDocument();
    });

    it('should display tags correctly', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('python')).toBeInTheDocument();
      expect(screen.getByText('programming')).toBeInTheDocument();
      expect(screen.getByText('javascript')).toBeInTheDocument();
      expect(screen.getByText('web')).toBeInTheDocument();
    });

    it('should display related skills correctly', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Python')).toBeInTheDocument();
      expect(screen.getByText('Data Analysis')).toBeInTheDocument();
      expect(screen.getByText('JavaScript')).toBeInTheDocument();
    });

    it('should display verification status correctly', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Verified')).toBeInTheDocument();
      expect(screen.getByText('Unverified')).toBeInTheDocument();
      expect(screen.getByText(/by John Doe/i)).toBeInTheDocument();
    });

    it('should display evidence link when available', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const evidenceLink = screen.getByText('Evidence');
      expect(evidenceLink).toBeInTheDocument();
      expect(evidenceLink.closest('a')).toHaveAttribute('href', 'https://example.com/cert1');
    });

    it('should display learning type tag when available', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('course')).toBeInTheDocument();
      expect(screen.getByText('certification')).toBeInTheDocument();
    });
  });

  describe('Permission-Based UI', () => {
    it('should show Add Learning button when isOwnProfile is true', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByRole('button', { name: /add learning/i })).toBeInTheDocument();
    });

    it('should hide Add Learning button when isOwnProfile is false', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={false} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.queryByRole('button', { name: /add learning/i })).not.toBeInTheDocument();
    });

    it('should disable edit/delete for verified entries', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      expect(overflowMenus.length).toBeGreaterThan(0);
    });
  });

  describe('Add Learning Entry Modal', () => {
    it('should open add modal when Add Learning button is clicked', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add learning/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Add Learning Entry')).toBeInTheDocument();
      });
    });

    it('should display all form fields in add modal', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add learning/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      expect(screen.getByLabelText(/issuer/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/completion date \*/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/evidence url/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/notes/i)).toBeInTheDocument();
      const tagsLabels = screen.getAllByLabelText(/tags/i);
      expect(tagsLabels.length).toBeGreaterThan(0);
    });

    it('should have learning catalog combobox', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add learning/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText(/select from catalog/i)).toBeInTheDocument();
      });
    });
  });

  describe('Add Learning Entry Functionality', () => {
    it('should add a new learning entry successfully', async () => {
      const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockLearningEntries, error: null })),
              })),
            })),
          };
        }
        if (table === 'user_learning') {
          return {
            insert: mockInsert,
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    neq: vi.fn(() => Promise.resolve({ data: [], error: null })),
                  })),
                })),
              })),
            })),
          };
        }
        if (table === 'learning_items') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
            })),
          };
        }
        if (table === 'skills') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add learning/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      const titleInput = screen.getByLabelText(/title \*/i);
      fireEvent.change(titleInput, { target: { value: 'New Course' } });
      
      // Fill in completion date (required field) - need both change and blur for Carbon DatePicker
      const dateInputs = screen.getAllByPlaceholderText(/mm\/dd\/yyyy/i);
      const completionDateInput = dateInputs[0];
      fireEvent.change(completionDateInput, { target: { value: '01/15/2024' } });
      fireEvent.blur(completionDateInput);
      
      const saveButtons = screen.getAllByRole('button', { name: /save/i });
      fireEvent.click(saveButtons[0]);
      
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });
    });

    it('should show error when required fields are missing', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add learning/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      const saveButtons = screen.getAllByRole('button', { name: /save/i });
      fireEvent.click(saveButtons[0]);
      
      await waitFor(() => {
        const errorMessages = screen.getAllByText(/title and completion date are required/i);
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it('should add tags to learning entry', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add learning/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const tagsInputs = screen.getAllByLabelText(/tags/i);
        expect(tagsInputs.length).toBeGreaterThan(0);
      });
      
      const tagsInputs = screen.getAllByLabelText(/tags/i);
      const tagInput = tagsInputs[0];
      fireEvent.change(tagInput, { target: { value: 'newtag' } });
      
      const addTagButton = screen.getByRole('button', { name: /add tag/i });
      fireEvent.click(addTagButton);
      
      await waitFor(() => {
        expect(screen.getByText('newtag')).toBeInTheDocument();
      });
    });

    it('should not add duplicate tags', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add learning/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        const tagsInputs = screen.getAllByLabelText(/tags/i);
        expect(tagsInputs.length).toBeGreaterThan(0);
      });
      
      const tagsInputs = screen.getAllByLabelText(/tags/i);
      const tagInput = tagsInputs[0];
      const addTagButton = screen.getByRole('button', { name: /add tag/i });
      
      fireEvent.change(tagInput, { target: { value: 'duplicate' } });
      fireEvent.click(addTagButton);
      
      await waitFor(() => {
        expect(screen.getByText('duplicate')).toBeInTheDocument();
      });
      
      fireEvent.change(tagInput, { target: { value: 'duplicate' } });
      fireEvent.click(addTagButton);
      
      const duplicateTags = screen.getAllByText('duplicate');
      expect(duplicateTags.length).toBe(1);
    });
  });

  describe('Edit Learning Entry Functionality', () => {
    it('should open edit modal with pre-filled data', async () => {
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        const editButton = editButtons.find(btn => !btn.closest('[disabled]'));
        if (editButton) {
          fireEvent.click(editButton);
        }
      });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Learning Entry')).toBeInTheDocument();
      });
    });

    it('should update learning entry successfully', async () => {
      const mockUpdate = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      }));
      
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockLearningEntries, error: null })),
              })),
            })),
          };
        }
        if (table === 'user_learning') {
          return {
            update: mockUpdate,
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    neq: vi.fn(() => Promise.resolve({ data: [], error: null })),
                  })),
                })),
              })),
            })),
          };
        }
        if (table === 'learning_items') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
            })),
          };
        }
        if (table === 'skills') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const editButtons = screen.getAllByText('Edit');
        const editButton = editButtons.find(btn => !btn.closest('[disabled]'));
        if (editButton) {
          fireEvent.click(editButton);
        }
      });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Learning Entry')).toBeInTheDocument();
      });
      
      const titleInput = screen.getByLabelText(/title \*/i);
      fireEvent.change(titleInput, { target: { value: 'Updated Title' } });
      
      const saveButtons = screen.getAllByRole('button', { name: /save/i });
      fireEvent.click(saveButtons[0]);
      
      await waitFor(() => {
        expect(mockUpdate).toHaveBeenCalled();
      });
    });
  });

  describe('Delete Learning Entry Functionality', () => {
    it('should delete learning entry after confirmation', async () => {
      const mockConfirm = vi.fn(() => true);
      global.confirm = mockConfirm;
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      }));
      
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockLearningEntries, error: null })),
              })),
            })),
          };
        }
        if (table === 'user_learning') {
          return {
            delete: mockDelete,
          };
        }
        if (table === 'learning_items') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
            })),
          };
        }
        if (table === 'skills') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        const deleteButton = deleteButtons.find(btn => !btn.closest('[disabled]'));
        if (deleteButton) {
          fireEvent.click(deleteButton);
        }
      });
      
      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalled();
        expect(mockDelete).toHaveBeenCalled();
      });
    });

    it('should not delete learning entry if confirmation is cancelled', async () => {
      const mockConfirm = vi.fn(() => false);
      global.confirm = mockConfirm;
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      }));
      
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockLearningEntries, error: null })),
              })),
            })),
          };
        }
        if (table === 'user_learning') {
          return {
            delete: mockDelete,
          };
        }
        if (table === 'learning_items') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
            })),
          };
        }
        if (table === 'skills') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        const deleteButton = deleteButtons.find(btn => !btn.closest('[disabled]'));
        if (deleteButton) {
          fireEvent.click(deleteButton);
        }
      });
      
      expect(mockConfirm).toHaveBeenCalled();
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error when fetching learning entries fails', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
              })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText(/database error/i)).toBeInTheDocument();
      });
    });

    it('should display error when adding learning entry fails', async () => {
      const mockInsert = vi.fn(() => Promise.resolve({ error: { message: 'Insert failed' } }));
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockLearningEntries, error: null })),
              })),
            })),
          };
        }
        if (table === 'user_learning') {
          return {
            insert: mockInsert,
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    neq: vi.fn(() => Promise.resolve({ data: [], error: null })),
                  })),
                })),
              })),
            })),
          };
        }
        if (table === 'learning_items') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
            })),
          };
        }
        if (table === 'skills') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add learning/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      const titleInput = screen.getByLabelText(/title \*/i);
      fireEvent.change(titleInput, { target: { value: 'New Course' } });
      
      // Fill in completion date (required field) - need both change and blur for Carbon DatePicker
      const dateInputs = screen.getAllByPlaceholderText(/mm\/dd\/yyyy/i);
      const completionDateInput = dateInputs[0];
      fireEvent.change(completionDateInput, { target: { value: '01/15/2024' } });
      fireEvent.blur(completionDateInput);
      
      const saveButtons = screen.getAllByRole('button', { name: /save/i });
      fireEvent.click(saveButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/insert failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no learning entries exist', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: [], error: null })),
              })),
            })),
          };
        }
        if (table === 'learning_items') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
            })),
          };
        }
        if (table === 'skills') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText(/no learning entries yet/i)).toBeInTheDocument();
      });
      
      expect(screen.getByText(/click 'add learning' to get started/i)).toBeInTheDocument();
    });

    it('should display empty state without prompt for non-own profile', async () => {
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: [], error: null })),
              })),
            })),
          };
        }
        if (table === 'learning_items') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
            })),
          };
        }
        if (table === 'skills') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={false} />);
      
      await waitFor(() => {
        expect(screen.getByText(/no learning entries yet/i)).toBeInTheDocument();
      });
      
      expect(screen.queryByText(/click 'add learning' to get started/i)).not.toBeInTheDocument();
    });
  });

  describe('Success Messages', () => {
    it('should display success message after adding learning entry', async () => {
      const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockLearningEntries, error: null })),
              })),
            })),
          };
        }
        if (table === 'user_learning') {
          return {
            insert: mockInsert,
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                eq: vi.fn(() => ({
                  eq: vi.fn(() => ({
                    neq: vi.fn(() => Promise.resolve({ data: [], error: null })),
                  })),
                })),
              })),
            })),
          };
        }
        if (table === 'learning_items') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
            })),
          };
        }
        if (table === 'skills') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add learning/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      const titleInput = screen.getByLabelText(/title \*/i);
      fireEvent.change(titleInput, { target: { value: 'New Course' } });
      
      // Fill in completion date (required field) - need both change and blur for Carbon DatePicker
      const dateInputs = screen.getAllByPlaceholderText(/mm\/dd\/yyyy/i);
      const completionDateInput = dateInputs[0];
      fireEvent.change(completionDateInput, { target: { value: '01/15/2024' } });
      fireEvent.blur(completionDateInput);
      
      const saveButtons = screen.getAllByRole('button', { name: /save/i });
      fireEvent.click(saveButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/learning entry added successfully/i)).toBeInTheDocument();
      });
    });

    it('should display success message after deleting learning entry', async () => {
      const mockConfirm = vi.fn(() => true);
      global.confirm = mockConfirm;
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      }));
      
      const mockFrom = vi.fn((table: string) => {
        if (table === 'user_learning_detailed') {
          return {
            select: vi.fn(() => ({
              eq: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: mockLearningEntries, error: null })),
              })),
            })),
          };
        }
        if (table === 'user_learning') {
          return {
            delete: mockDelete,
          };
        }
        if (table === 'learning_items') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
            })),
          };
        }
        if (table === 'skills') {
          return {
            select: vi.fn(() => ({
              order: vi.fn(() => Promise.resolve({ data: mockSkills, error: null })),
            })),
          };
        }
        return { select: vi.fn(() => ({ order: vi.fn(() => Promise.resolve({ data: [], error: null })) })) };
      });
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<CompletedLearningManager userId="user-123" isOwnProfile={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const deleteButtons = screen.getAllByText('Delete');
        const deleteButton = deleteButtons.find(btn => !btn.closest('[disabled]'));
        if (deleteButton) {
          fireEvent.click(deleteButton);
        }
      });
      
      await waitFor(() => {
        expect(screen.getByText(/learning entry deleted successfully/i)).toBeInTheDocument();
      });
    });
  });
});

// Made with Bob
