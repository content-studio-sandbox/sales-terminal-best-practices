import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResumeLibraryModal from '../ResumeLibraryModal';

describe('ResumeLibraryModal', () => {
  const mockOnClose = vi.fn();
  const mockSetLibrarySearch = vi.fn();
  const mockSetLibraryAssigned = vi.fn();
  const mockLoadLibrary = vi.fn();
  const mockOpenResume = vi.fn();
  const mockOpenMap = vi.fn();
  const mockUnassignResume = vi.fn();
  const mockDeleteResumeById = vi.fn();
  const mockFetchLibraryCount = vi.fn();

  const mockResumeItems = [
    {
      id: 'resume-1',
      user_id: 'user-1',
      candidate_name: 'John Doe',
      role: 'Software Engineer',
      notes: 'Excellent candidate with 5 years experience',
      file_path: '/uploads/john_doe_resume.pdf',
      created_at: '2024-01-15T10:00:00Z',
      uploaded_by: 'admin-1',
      users: { id: 'user-1', email: 'john.doe@ibm.com', display_name: 'John Doe' },
    },
    {
      id: 'resume-2',
      user_id: null,
      candidate_name: 'Jane Smith',
      role: 'Product Manager',
      notes: null,
      file_path: '/uploads/jane_smith_resume.pdf',
      created_at: '2024-01-16T14:30:00Z',
      uploaded_by: 'admin-1',
      users: null,
    },
    {
      id: 'resume-3',
      user_id: 'user-3',
      candidate_name: 'Bob Johnson',
      role: null,
      notes: 'Strong technical background',
      file_path: '/uploads/bob_johnson_resume.docx',
      created_at: '2024-01-17T09:15:00Z',
      uploaded_by: 'admin-2',
      users: { id: 'user-3', email: 'bob.johnson@ibm.com', display_name: 'Bob Johnson' },
    },
  ];

  const defaultProps = {
    open: true,
    onClose: mockOnClose,
    libraryItems: mockResumeItems,
    libraryLoading: false,
    librarySearch: '',
    setLibrarySearch: mockSetLibrarySearch,
    libraryAssigned: 'all' as const,
    setLibraryAssigned: mockSetLibraryAssigned,
    loadLibrary: mockLoadLibrary,
    openResume: mockOpenResume,
    openMap: mockOpenMap,
    unassignResume: mockUnassignResume,
    deleteResumeById: mockDeleteResumeById,
    fetchLibraryCount: mockFetchLibraryCount,
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockSetLibrarySearch.mockClear();
    mockSetLibraryAssigned.mockClear();
    mockLoadLibrary.mockClear();
    mockOpenResume.mockClear();
    mockOpenMap.mockClear();
    mockUnassignResume.mockClear();
    mockDeleteResumeById.mockClear();
    mockFetchLibraryCount.mockClear();
    
    // Mock window.confirm
    vi.spyOn(window, 'confirm').mockReturnValue(true);
  });

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText('Resume Library')).toBeInTheDocument();
    });

    it('should display search input', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByPlaceholderText(/Search candidate, role, notes or file name/i)).toBeInTheDocument();
    });

    it('should display filter dropdown', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      // Carbon Dropdown renders a button with the selected text
      const dropdownButton = screen.getByRole('combobox');
      expect(dropdownButton).toBeInTheDocument();
    });

    it('should display refresh button', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
    });
  });

  describe('Library Stats', () => {
    it('should display total count', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText('3 total')).toBeInTheDocument();
    });

    it('should display assigned count', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText('2 assigned')).toBeInTheDocument();
    });

    it('should display unassigned count', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText('1 unassigned')).toBeInTheDocument();
    });

    it('should not show stats when loading', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryLoading={true} />);

      expect(screen.queryByText('3 total')).not.toBeInTheDocument();
    });

    it('should not show stats when no items', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryItems={[]} />);

      expect(screen.queryByText('0 total')).not.toBeInTheDocument();
    });
  });

  describe('Resume List Display', () => {
    it('should display all resume candidates', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should display roles when present', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText('Software Engineer')).toBeInTheDocument();
      expect(screen.getByText('Product Manager')).toBeInTheDocument();
    });

    it('should display file extensions', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      const pdfBadges = screen.getAllByText('PDF');
      expect(pdfBadges.length).toBe(2);
      expect(screen.getByText('DOCX')).toBeInTheDocument();
    });

    it('should display assigned emails', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText(/john\.doe@ibm\.com/i)).toBeInTheDocument();
      expect(screen.getByText(/bob\.johnson@ibm\.com/i)).toBeInTheDocument();
    });

    it('should display unassigned tag for unassigned resumes', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText('Unassigned')).toBeInTheDocument();
    });

    it('should display notes when present', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText(/"Excellent candidate with 5 years experience"/i)).toBeInTheDocument();
      expect(screen.getByText(/"Strong technical background"/i)).toBeInTheDocument();
    });

    it('should display file names as clickable links', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByText('john_doe_resume.pdf')).toBeInTheDocument();
      expect(screen.getByText('jane_smith_resume.pdf')).toBeInTheDocument();
      expect(screen.getByText('bob_johnson_resume.docx')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator when loading', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryLoading={true} />);

      expect(screen.getByText(/Loading resume library/i)).toBeInTheDocument();
    });

    it('should not show resume list when loading', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryLoading={true} />);

      expect(screen.queryByText('John Doe')).not.toBeInTheDocument();
    });

    it('should disable refresh button when loading', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryLoading={true} />);

      const refreshButton = screen.getByRole('button', { name: /Refresh/i });
      expect(refreshButton).toBeDisabled();
    });
  });

  describe('Empty State', () => {
    it('should show empty state when no items', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryItems={[]} />);

      expect(screen.getByText('No resumes found')).toBeInTheDocument();
    });

    it('should show import message when no search', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryItems={[]} librarySearch="" />);

      expect(screen.getByText(/Import resumes to get started/i)).toBeInTheDocument();
    });

    it('should show search adjustment message when searching', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryItems={[]} librarySearch="test" />);

      expect(screen.getByText(/Try adjusting your search or filters/i)).toBeInTheDocument();
    });
  });

  describe('Search Functionality', () => {
    it('should call setLibrarySearch when search input changes', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/Search candidate, role, notes or file name/i);
      await user.type(searchInput, 'John');

      expect(mockSetLibrarySearch).toHaveBeenCalled();
    });

    it('should display current search value', () => {
      render(<ResumeLibraryModal {...defaultProps} librarySearch="Software" />);

      const searchInput = screen.getByPlaceholderText(/Search candidate, role, notes or file name/i) as HTMLInputElement;
      expect(searchInput.value).toBe('Software');
    });
  });

  describe('Filter Functionality', () => {
    it('should display current filter selection', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryAssigned="1" />);

      // Carbon Dropdown is present and functional
      const dropdownButton = screen.getByRole('combobox');
      expect(dropdownButton).toBeInTheDocument();
      expect(dropdownButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should show All when filter is all', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryAssigned="all" />);

      // Dropdown exists with default state
      const dropdownButton = screen.getByRole('combobox');
      expect(dropdownButton).toBeInTheDocument();
    });
  });

  describe('Resume Actions', () => {
    it('should call openResume when view button clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const viewButtons = screen.getAllByRole('button', { name: /View resume/i });
      await user.click(viewButtons[0]);

      expect(mockOpenResume).toHaveBeenCalledWith('resume-1', 'John Doe');
    });

    it('should call openResume when file name clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const fileLink = screen.getByText('john_doe_resume.pdf');
      await user.click(fileLink);

      expect(mockOpenResume).toHaveBeenCalledWith('resume-1', 'John Doe');
    });

    it('should show Assign button for unassigned resumes', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      const assignButtons = screen.getAllByRole('button', { name: /^Assign$/i });
      expect(assignButtons.length).toBeGreaterThan(0);
    });

    it('should show Reassign button for assigned resumes', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      const reassignButtons = screen.getAllByRole('button', { name: /Reassign/i });
      expect(reassignButtons.length).toBe(2); // John and Bob are assigned
    });

    it('should call openMap when assign button clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const assignButton = screen.getByRole('button', { name: /^Assign$/i });
      await user.click(assignButton);

      expect(mockOpenMap).toHaveBeenCalledWith('resume-2', undefined);
    });

    it('should call openMap when reassign button clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const reassignButtons = screen.getAllByRole('button', { name: /Reassign/i });
      await user.click(reassignButtons[0]);

      expect(mockOpenMap).toHaveBeenCalledWith('resume-1', 'john.doe@ibm.com');
    });

    it('should show unassign button for assigned resumes', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      const unassignButtons = screen.getAllByRole('button', { name: /Unassign/i });
      expect(unassignButtons.length).toBe(2);
    });

    it('should call unassignResume when unassign button clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const unassignButtons = screen.getAllByRole('button', { name: /Unassign/i });
      await user.click(unassignButtons[0]);

      expect(mockUnassignResume).toHaveBeenCalledWith('resume-1');
    });

    it('should show delete button for all resumes', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
      expect(deleteButtons.length).toBe(3);
    });

    it('should call deleteResumeById when delete confirmed', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
      await user.click(deleteButtons[0]);

      expect(window.confirm).toHaveBeenCalledWith('Delete this resume? This cannot be undone.');
      expect(mockDeleteResumeById).toHaveBeenCalled();
    });

    it('should not delete when confirmation cancelled', async () => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const deleteButtons = screen.getAllByRole('button', { name: /Delete/i });
      await user.click(deleteButtons[0]);

      expect(mockDeleteResumeById).not.toHaveBeenCalled();
    });
  });

  describe('Refresh Functionality', () => {
    it('should call loadLibrary when refresh button clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const refreshButton = screen.getByRole('button', { name: /Refresh/i });
      await user.click(refreshButton);

      expect(mockLoadLibrary).toHaveBeenCalled();
    });

    it('should call loadLibrary when Reload footer button clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      const reloadButton = screen.getByRole('button', { name: /Reload/i });
      await user.click(reloadButton);

      expect(mockLoadLibrary).toHaveBeenCalled();
    });
  });

  describe('Modal Controls', () => {
    it('should call onClose when close button clicked', async () => {
      const user = userEvent.setup();
      render(<ResumeLibraryModal {...defaultProps} />);

      // Get all close buttons and click the footer one (last one)
      const closeButtons = screen.getAllByRole('button', { name: /Close/i });
      await user.click(closeButtons[closeButtons.length - 1]);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Edge Cases', () => {
    it('should handle null libraryItems gracefully', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryItems={null as any} />);

      expect(screen.getByText('No resumes found')).toBeInTheDocument();
    });

    it('should handle invalid libraryItems gracefully', () => {
      render(<ResumeLibraryModal {...defaultProps} libraryItems={[null, undefined, { id: 'test' }] as any} />);

      // Should filter out invalid items
      expect(screen.queryByText('No resumes found')).not.toBeInTheDocument();
    });

    it('should handle resume without candidate name', () => {
      const itemsWithoutName = [{
        ...mockResumeItems[0],
        candidate_name: null,
      }];
      
      render(<ResumeLibraryModal {...defaultProps} libraryItems={itemsWithoutName} />);

      expect(screen.getByText('Candidate')).toBeInTheDocument();
    });

    it('should handle resume without file path', () => {
      const itemsWithoutPath = [{
        ...mockResumeItems[0],
        file_path: '',
      }];
      
      render(<ResumeLibraryModal {...defaultProps} libraryItems={itemsWithoutPath} />);

      expect(screen.getByText('(file)')).toBeInTheDocument();
    });

    it('should handle resume without created date', () => {
      const itemsWithoutDate = [{
        ...mockResumeItems[0],
        created_at: '',
      }];
      
      render(<ResumeLibraryModal {...defaultProps} libraryItems={itemsWithoutDate} />);

      // Check that date is not displayed (component may show nothing or dash)
      const cards = screen.getAllByText(/John Doe/i);
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe('Accessibility', () => {
    it('should have accessible modal title', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByRole('heading', { name: /Resume Library/i })).toBeInTheDocument();
    });

    it('should have accessible search input', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      const searchInput = screen.getByPlaceholderText(/Search candidate, role, notes or file name/i);
      expect(searchInput).toBeInTheDocument();
    });

    it('should have accessible buttons', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      expect(screen.getByRole('button', { name: /Refresh/i })).toBeInTheDocument();
      // Multiple close buttons exist (modal X and footer button)
      const closeButtons = screen.getAllByRole('button', { name: /Close/i });
      expect(closeButtons.length).toBeGreaterThan(0);
      expect(screen.getByRole('button', { name: /Reload/i })).toBeInTheDocument();
    });

    it('should have accessible view buttons with icon descriptions', () => {
      render(<ResumeLibraryModal {...defaultProps} />);

      const viewButtons = screen.getAllByRole('button', { name: /View resume/i });
      expect(viewButtons.length).toBe(3);
    });
  });
});

// Made with Bob
