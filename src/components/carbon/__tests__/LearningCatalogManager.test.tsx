// src/components/carbon/__tests__/LearningCatalogManager.test.tsx
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import LearningCatalogManager from '../LearningCatalogManager';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(),
  },
}));

// Mock data
const mockLearningItems = [
  {
    id: '1',
    title: 'Python for Beginners',
    description: 'Learn Python programming from scratch',
    issuer: 'IBM',
    type: 'course',
    duration_hours: 20,
    url: 'https://example.com/python',
    tags: ['python', 'programming', 'beginner'],
    difficulty_level: 'beginner',
    is_preset: true,
  },
  {
    id: '2',
    title: 'Advanced JavaScript',
    description: 'Master advanced JavaScript concepts',
    issuer: 'Coursera',
    type: 'certification',
    duration_hours: 40,
    url: 'https://example.com/javascript',
    tags: ['javascript', 'web', 'advanced'],
    difficulty_level: 'advanced',
    is_preset: false,
  },
  {
    id: '3',
    title: 'React Workshop',
    description: 'Hands-on React development workshop',
    issuer: 'LinkedIn Learning',
    type: 'workshop',
    duration_hours: 8,
    url: 'https://example.com/react',
    tags: ['react', 'frontend'],
    difficulty_level: 'intermediate',
    is_preset: false,
  },
];

describe('LearningCatalogManager', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Default mock implementation
    const mockFrom = vi.fn(() => ({
      select: vi.fn(() => ({
        order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
      })),
      insert: vi.fn(() => Promise.resolve({ error: null })),
      update: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
      delete: vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      })),
    }));
    
    (supabase.from as any).mockImplementation(mockFrom);
  });

  describe('Basic Rendering', () => {
    it('should render loading state initially', () => {
      render(<LearningCatalogManager isAdmin={true} />);
      expect(screen.getByText(/loading learning catalog/i)).toBeInTheDocument();
    });

    it('should render learning catalog table after loading', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('Advanced JavaScript')).toBeInTheDocument();
      expect(screen.getByText('React Workshop')).toBeInTheDocument();
    });

    it('should display table headers correctly', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const titleHeaders = screen.getAllByText('Title');
      expect(titleHeaders.length).toBeGreaterThan(0);
      expect(screen.getByText('Issuer')).toBeInTheDocument();
      const typeHeaders = screen.getAllByText('Type');
      expect(typeHeaders.length).toBeGreaterThan(0);
      expect(screen.getByText('Duration')).toBeInTheDocument();
      expect(screen.getByText('Difficulty')).toBeInTheDocument();
      const tagsHeaders = screen.getAllByText('Tags');
      expect(tagsHeaders.length).toBeGreaterThan(0);
      expect(screen.getByText('Preset')).toBeInTheDocument();
      expect(screen.getByText('Actions')).toBeInTheDocument();
    });
  });

  describe('Learning Items Display', () => {
    it('should display learning item details correctly', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('IBM')).toBeInTheDocument();
      expect(screen.getByText('Coursera')).toBeInTheDocument();
      expect(screen.getByText('LinkedIn Learning')).toBeInTheDocument();
    });

    it('should display duration in hours format', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('20h')).toBeInTheDocument();
      expect(screen.getByText('40h')).toBeInTheDocument();
      expect(screen.getByText('8h')).toBeInTheDocument();
    });

    it('should display tags with proper styling', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByText('python')).toBeInTheDocument();
      expect(screen.getByText('javascript')).toBeInTheDocument();
      expect(screen.getByText('react')).toBeInTheDocument();
    });

    it('should display difficulty levels with color coding', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const beginnerTags = screen.getAllByText('beginner');
      expect(beginnerTags.length).toBeGreaterThan(0);
      const advancedTags = screen.getAllByText('advanced');
      expect(advancedTags.length).toBeGreaterThan(0);
      expect(screen.getByText('intermediate')).toBeInTheDocument();
    });

    it('should display preset status correctly', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const yesElements = screen.getAllByText('Yes');
      const noElements = screen.getAllByText('No');
      
      expect(yesElements.length).toBeGreaterThan(0);
      expect(noElements.length).toBeGreaterThan(0);
    });

    it('should truncate long descriptions', async () => {
      const longDescriptionItem = {
        ...mockLearningItems[0],
        description: 'A'.repeat(150),
      };
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [longDescriptionItem], error: null })),
        })),
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const description = screen.getByText(/A{100}\.\.\./, { exact: false });
      expect(description).toBeInTheDocument();
    });
  });

  describe('Admin Permissions', () => {
    it('should show admin buttons when isAdmin is true', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByRole('button', { name: /add item/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /import csv/i })).toBeInTheDocument();
    });

    it('should hide admin buttons when isAdmin is false', async () => {
      render(<LearningCatalogManager isAdmin={false} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.queryByRole('button', { name: /add item/i })).not.toBeInTheDocument();
      expect(screen.queryByRole('button', { name: /import csv/i })).not.toBeInTheDocument();
    });

    it('should show export button for all users', async () => {
      render(<LearningCatalogManager isAdmin={false} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
    });

    it('should show action menu for admin users', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      expect(overflowMenus.length).toBeGreaterThan(0);
    });

    it('should not show action menu for non-admin users', async () => {
      render(<LearningCatalogManager isAdmin={false} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.queryAllByRole('button', { name: /options/i });
      expect(overflowMenus.length).toBe(0);
    });
  });

  describe('Add Learning Item Modal', () => {
    it('should open add modal when Add Item button is clicked', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByText('Add Learning Item')).toBeInTheDocument();
      });
    });

    it('should display all form fields in add modal', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/issuer\/provider/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^type$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/duration \(hours\)/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/difficulty level/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/^url$/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
    });

    it('should have correct type options in select', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/^type$/i)).toBeInTheDocument();
      });
      
      const typeSelect = screen.getByLabelText(/^type$/i);
      expect(typeSelect).toHaveValue('course');
    });

    it('should have correct difficulty options in select', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/difficulty level/i)).toBeInTheDocument();
      });
      
      const difficultySelect = screen.getByLabelText(/difficulty level/i);
      expect(difficultySelect).toHaveValue('beginner');
    });
  });

  describe('Add Learning Item Functionality', () => {
    it('should add a new learning item successfully', async () => {
      const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
        })),
        insert: mockInsert,
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      const titleInput = screen.getByLabelText(/title \*/i);
      fireEvent.change(titleInput, { target: { value: 'New Course' } });
      
      const saveButtons = screen.getAllByRole('button', { name: /save/i });
      fireEvent.click(saveButtons[0]);
      
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });
    });

    it('should show error when title is missing', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      const saveButtons = screen.getAllByRole('button', { name: /save/i });
      fireEvent.click(saveButtons[0]);
      
      await waitFor(() => {
        const errorMessages = screen.getAllByText(/title is required/i);
        expect(errorMessages.length).toBeGreaterThan(0);
      });
    });

    it('should add tags to learning item', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      });
      
      const tagInput = screen.getByLabelText(/tags/i);
      fireEvent.change(tagInput, { target: { value: 'newtag' } });
      
      const addTagButton = screen.getByRole('button', { name: /add tag/i });
      fireEvent.click(addTagButton);
      
      await waitFor(() => {
        expect(screen.getByText('newtag')).toBeInTheDocument();
      });
    });

    it('should remove tags from learning item', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      });
      
      const tagInput = screen.getByLabelText(/tags/i);
      fireEvent.change(tagInput, { target: { value: 'testtag' } });
      
      const addTagButton = screen.getByRole('button', { name: /add tag/i });
      fireEvent.click(addTagButton);
      
      await waitFor(() => {
        expect(screen.getByText('testtag')).toBeInTheDocument();
      });
      
      // Find the tag close button - Carbon uses a specific structure for dismissible tags
      const tags = screen.getAllByText('testtag');
      const tagElement = tags[0].closest('.cds--tag');
      const closeButton = tagElement?.querySelector('button');
      
      if (closeButton) {
        fireEvent.click(closeButton);
        
        await waitFor(() => {
          const remainingTags = screen.queryAllByText('testtag');
          expect(remainingTags.length).toBe(0);
        });
      }
    });

    it('should not add duplicate tags', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/tags/i)).toBeInTheDocument();
      });
      
      const tagInput = screen.getByLabelText(/tags/i);
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

  describe('Edit Learning Item Functionality', () => {
    it('should open edit modal with pre-filled data', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Learning Item')).toBeInTheDocument();
      });
      
      const titleInput = screen.getByLabelText(/title \*/i) as HTMLInputElement;
      expect(titleInput.value).toBe('Python for Beginners');
    });

    it('should update learning item successfully', async () => {
      const mockUpdate = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      }));
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
        })),
        update: mockUpdate,
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText('Edit Learning Item')).toBeInTheDocument();
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

  describe('Delete Learning Item Functionality', () => {
    it('should delete learning item after confirmation', async () => {
      const mockConfirm = vi.fn(() => true);
      global.confirm = mockConfirm;
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      }));
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
        })),
        delete: mockDelete,
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
      });
      
      await waitFor(() => {
        expect(mockConfirm).toHaveBeenCalled();
        expect(mockDelete).toHaveBeenCalled();
      });
    });

    it('should not delete learning item if confirmation is cancelled', async () => {
      const mockConfirm = vi.fn(() => false);
      global.confirm = mockConfirm;
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      }));
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
        })),
        delete: mockDelete,
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
      });
      
      expect(mockConfirm).toHaveBeenCalled();
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  describe('CSV Export Functionality', () => {
    it('should export learning items to CSV', async () => {
      const createElementSpy = vi.spyOn(document, 'createElement');
      const createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      const revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL');
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const exportButton = screen.getByRole('button', { name: /export csv/i });
      fireEvent.click(exportButton);
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalled();
      
      createElementSpy.mockRestore();
      createObjectURLSpy.mockRestore();
      revokeObjectURLSpy.mockRestore();
    });
  });

  describe('CSV Import Functionality', () => {
    it('should open CSV import modal', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const importButton = screen.getByRole('button', { name: /import csv/i });
      fireEvent.click(importButton);
      
      await waitFor(() => {
        expect(screen.getByText('Import Learning Items from CSV')).toBeInTheDocument();
      });
    });

    it('should display CSV format instructions', async () => {
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const importButton = screen.getByRole('button', { name: /import csv/i });
      fireEvent.click(importButton);
      
      await waitFor(() => {
        expect(screen.getByText(/upload a csv file with the following columns/i)).toBeInTheDocument();
      });
      
      expect(screen.getByText(/tags should be semicolon-separated/i)).toBeInTheDocument();
      expect(screen.getByText(/only title is required/i)).toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should display error when fetching learning items fails', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: null, error: { message: 'Database error' } })),
        })),
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText(/database error/i)).toBeInTheDocument();
      });
    });

    it('should display error when adding learning item fails', async () => {
      const mockInsert = vi.fn(() => Promise.resolve({ error: { message: 'Insert failed' } }));
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
        })),
        insert: mockInsert,
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      const titleInput = screen.getByLabelText(/title \*/i);
      fireEvent.change(titleInput, { target: { value: 'New Course' } });
      
      const saveButtons = screen.getAllByRole('button', { name: /save/i });
      fireEvent.click(saveButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/insert failed/i)).toBeInTheDocument();
      });
    });

    it('should display error when deleting learning item fails', async () => {
      const mockConfirm = vi.fn(() => true);
      global.confirm = mockConfirm;
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: { message: 'Delete failed' } })),
      }));
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
        })),
        delete: mockDelete,
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/delete failed/i)).toBeInTheDocument();
      });
    });
  });

  describe('Empty State', () => {
    it('should display empty state when no learning items exist', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText(/no learning items yet/i)).toBeInTheDocument();
      });
      
      expect(screen.getByText(/click 'add item' to get started/i)).toBeInTheDocument();
    });

    it('should display empty state without admin message for non-admin', async () => {
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: [], error: null })),
        })),
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={false} />);
      
      await waitFor(() => {
        expect(screen.getByText(/no learning items yet/i)).toBeInTheDocument();
      });
      
      expect(screen.queryByText(/click 'add item' to get started/i)).not.toBeInTheDocument();
    });
  });

  describe('Success Messages', () => {
    it('should display success message after adding learning item', async () => {
      const mockInsert = vi.fn(() => Promise.resolve({ error: null }));
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
        })),
        insert: mockInsert,
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const addButton = screen.getByRole('button', { name: /add item/i });
      fireEvent.click(addButton);
      
      await waitFor(() => {
        expect(screen.getByLabelText(/title \*/i)).toBeInTheDocument();
      });
      
      const titleInput = screen.getByLabelText(/title \*/i);
      fireEvent.change(titleInput, { target: { value: 'New Course' } });
      
      const saveButtons = screen.getAllByRole('button', { name: /save/i });
      fireEvent.click(saveButtons[0]);
      
      await waitFor(() => {
        expect(screen.getByText(/learning item added successfully/i)).toBeInTheDocument();
      });
    });

    it('should display success message after deleting learning item', async () => {
      const mockConfirm = vi.fn(() => true);
      global.confirm = mockConfirm;
      
      const mockDelete = vi.fn(() => ({
        eq: vi.fn(() => Promise.resolve({ error: null })),
      }));
      
      const mockFrom = vi.fn(() => ({
        select: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ data: mockLearningItems, error: null })),
        })),
        delete: mockDelete,
      }));
      
      (supabase.from as any).mockImplementation(mockFrom);
      
      render(<LearningCatalogManager isAdmin={true} />);
      
      await waitFor(() => {
        expect(screen.getByText('Python for Beginners')).toBeInTheDocument();
      });
      
      const overflowMenus = screen.getAllByRole('button', { name: /options/i });
      fireEvent.click(overflowMenus[0]);
      
      await waitFor(() => {
        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);
      });
      
      await waitFor(() => {
        expect(screen.getByText(/learning item deleted successfully/i)).toBeInTheDocument();
      });
    });
  });
});

// Made with Bob
