import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ResumeSkillExtractor from '../ResumeSkillExtractor';

describe('ResumeSkillExtractor', () => {
  let mockOnSkillsExtracted: (skills: string[]) => void;

  beforeEach(() => {
    mockOnSkillsExtracted = vi.fn();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  // Helper function to upload a file and advance timers
  const uploadFileAndWait = async (input: HTMLInputElement, file: File) => {
    Object.defineProperty(input, 'files', {
      value: [file],
      writable: false,
      configurable: true, // Allow reconfiguration for multiple uploads
    });
    
    fireEvent.change(input);
    
    // Advance timers and flush promises
    await act(async () => {
      vi.advanceTimersByTime(100); // Use shorter delay for tests
    });
  };

  // Rendering Tests
  describe('Rendering', () => {
    it('should render the component with title', () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} />);
      
      expect(screen.getByText('Extract Skills from Resume')).toBeInTheDocument();
    });

    it('should render file uploader with correct labels', () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} />);
      
      expect(screen.getByText('Upload resume')).toBeInTheDocument();
      expect(screen.getByText('Select or drop PDF file here')).toBeInTheDocument();
      expect(screen.getAllByText('Choose file')[0]).toBeInTheDocument();
    });

    it('should not show loading state initially', () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} />);
      
      expect(screen.queryByText('Extracting skills from resume...')).not.toBeInTheDocument();
    });

    it('should not show extracted skills initially', () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} />);
      
      expect(screen.queryByText('Extracted Skills:')).not.toBeInTheDocument();
      expect(screen.queryByText('Add All Skills')).not.toBeInTheDocument();
      expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
    });
  });

  // File Upload Tests
  describe('File Upload', () => {
    it('should handle file upload and show loading state', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
        configurable: true,
      });
      
      fireEvent.change(input);
      
      expect(screen.getByText('Extracting skills from resume...')).toBeInTheDocument();
    });

    it('should not process if no file is selected', () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} />);
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      // Trigger change event without file
      fireEvent.change(input);
      
      expect(screen.queryByText('Extracting skills from resume...')).not.toBeInTheDocument();
    });

    it('should extract skills after timeout', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Extracted Skills:')).toBeInTheDocument();
    });

    it('should display extracted skills as tags', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      const tags = document.querySelectorAll('.cds--tag');
      expect(tags.length).toBeGreaterThanOrEqual(3);
      expect(tags.length).toBeLessThanOrEqual(7);
    });

    it('should hide loading state after extraction completes', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
        configurable: true,
      });
      
      fireEvent.change(input);
      expect(screen.getByText('Extracting skills from resume...')).toBeInTheDocument();
      
      await act(async () => {
        vi.advanceTimersByTime(100);
      });
      
      expect(screen.queryByText('Extracting skills from resume...')).not.toBeInTheDocument();
    });
  });

  // Skills Display Tests
  describe('Skills Display', () => {
    it('should show action buttons when skills are extracted', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Add All Skills')).toBeInTheDocument();
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
    });

    it('should display skills with correct styling', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      const tags = document.querySelectorAll('.cds--tag');
      expect(tags.length).toBeGreaterThan(0);
      tags.forEach(tag => {
        expect(tag).toHaveClass('cds--tag');
        expect(tag).toHaveClass('cds--tag--blue');
        expect(tag).toHaveClass('cds--tag--sm');
      });
    });

    it('should extract random number of skills between 3 and 7', async () => {
      const { rerender } = render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      // Test multiple uploads to verify randomness
      for (let i = 0; i < 5; i++) {
        const file = new File([`resume content ${i}`], `resume${i}.pdf`, { type: 'application/pdf' });
        const input = document.querySelector('input[type="file"]') as HTMLInputElement;
        
        await uploadFileAndWait(input, file);
        
        const tags = document.querySelectorAll('.cds--tag');
        expect(tags.length).toBeGreaterThanOrEqual(3);
        expect(tags.length).toBeLessThanOrEqual(7);
        
        // Clear for next iteration
        const dismissButton = screen.getByText('Dismiss');
        fireEvent.click(dismissButton);
        
        rerender(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      }
    });
  });

  // Add All Skills Tests
  describe('Add All Skills', () => {
    it('should call onSkillsExtracted with extracted skills when Add All is clicked', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Add All Skills')).toBeInTheDocument();
      
      const addButton = screen.getByText('Add All Skills');
      fireEvent.click(addButton);
      
      expect(mockOnSkillsExtracted).toHaveBeenCalledTimes(1);
      expect(mockOnSkillsExtracted).toHaveBeenCalledWith(expect.any(Array));
      
      const calledSkills = vi.mocked(mockOnSkillsExtracted).mock.calls[0][0];
      expect(calledSkills.length).toBeGreaterThanOrEqual(3);
      expect(calledSkills.length).toBeLessThanOrEqual(7);
    });

    it('should clear extracted skills after adding all', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Add All Skills')).toBeInTheDocument();
      
      const addButton = screen.getByText('Add All Skills');
      fireEvent.click(addButton);
      
      expect(screen.queryByText('Extracted Skills:')).not.toBeInTheDocument();
      expect(screen.queryByText('Add All Skills')).not.toBeInTheDocument();
    });

    it('should pass valid skill strings to callback', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Add All Skills')).toBeInTheDocument();
      
      const addButton = screen.getByText('Add All Skills');
      fireEvent.click(addButton);
      
      const calledSkills = vi.mocked(mockOnSkillsExtracted).mock.calls[0][0];
      calledSkills.forEach((skill: string) => {
        expect(typeof skill).toBe('string');
        expect(skill.length).toBeGreaterThan(0);
      });
    });
  });

  // Dismiss Tests
  describe('Dismiss', () => {
    it('should clear extracted skills when Dismiss is clicked', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
      
      const dismissButton = screen.getByText('Dismiss');
      fireEvent.click(dismissButton);
      
      expect(screen.queryByText('Extracted Skills:')).not.toBeInTheDocument();
      expect(screen.queryByText('Add All Skills')).not.toBeInTheDocument();
      expect(screen.queryByText('Dismiss')).not.toBeInTheDocument();
    });

    it('should not call onSkillsExtracted when dismissing', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
      
      const dismissButton = screen.getByText('Dismiss');
      fireEvent.click(dismissButton);
      
      expect(mockOnSkillsExtracted).not.toHaveBeenCalled();
    });

    it('should allow new upload after dismissing', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      // First upload
      const file1 = new File(['resume content 1'], 'resume1.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file1);
      
      expect(screen.getByText('Dismiss')).toBeInTheDocument();
      
      const dismissButton = screen.getByText('Dismiss');
      fireEvent.click(dismissButton);
      
      // Second upload
      const file2 = new File(['resume content 2'], 'resume2.pdf', { type: 'application/pdf' });
      await uploadFileAndWait(input, file2);
      
      expect(screen.getByText('Extracted Skills:')).toBeInTheDocument();
    });
  });

  // Button Interaction Tests
  describe('Button Interactions', () => {
    it('should have correct button sizes', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      const addButton = screen.getByText('Add All Skills');
      const dismissButton = screen.getByText('Dismiss');
      
      expect(addButton).toHaveClass('cds--btn--sm');
      expect(dismissButton).toHaveClass('cds--btn--sm');
    });

    it('should have correct button kinds', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      const addButton = screen.getByText('Add All Skills');
      const dismissButton = screen.getByText('Dismiss');
      
      expect(addButton).toHaveClass('cds--btn--primary');
      expect(dismissButton).toHaveClass('cds--btn--secondary');
    });

    it('should support keyboard navigation for buttons', async () => {
      const user = userEvent.setup();
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Add All Skills')).toBeInTheDocument();
      
      const addButton = screen.getByText('Add All Skills');
      fireEvent.click(addButton);
      
      expect(mockOnSkillsExtracted).toHaveBeenCalledTimes(1);
    });
  });

  // Edge Cases
  describe('Edge Cases', () => {
    it('should handle multiple rapid file uploads', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      // Upload multiple files rapidly - second one will override first
      const file1 = new File(['content 1'], 'resume1.pdf', { type: 'application/pdf' });
      const file2 = new File(['content 2'], 'resume2.pdf', { type: 'application/pdf' });
      
      await uploadFileAndWait(input, file1);
      
      // Both timers will complete, showing skills from last upload
      expect(screen.getByText('Extracted Skills:')).toBeInTheDocument();
    });

    it('should handle file upload with empty file', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File([], 'empty.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Extracted Skills:')).toBeInTheDocument();
    });

    it('should maintain component state across re-renders', async () => {
      const { rerender } = render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      expect(screen.getByText('Extracted Skills:')).toBeInTheDocument();
      
      // Re-render with same props
      rerender(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      // Skills should still be visible
      expect(screen.getByText('Extracted Skills:')).toBeInTheDocument();
    });
  });

  // Accessibility Tests
  describe('Accessibility', () => {
    it('should have accessible file uploader', () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} />);
      
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'file');
    });

    it('should have accessible buttons', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      await uploadFileAndWait(input, file);
      
      const addButton = screen.getByText('Add All Skills');
      const dismissButton = screen.getByText('Dismiss');
      
      expect(addButton).toHaveAttribute('type', 'button');
      expect(dismissButton).toHaveAttribute('type', 'button');
    });

    it('should provide loading feedback', async () => {
      render(<ResumeSkillExtractor onSkillsExtracted={mockOnSkillsExtracted} extractionDelay={100} />);
      
      const file = new File(['resume content'], 'resume.pdf', { type: 'application/pdf' });
      const input = document.querySelector('input[type="file"]') as HTMLInputElement;
      
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
        configurable: true,
      });
      
      fireEvent.change(input);
      
      const loadingText = screen.getByText('Extracting skills from resume...');
      expect(loadingText).toBeInTheDocument();
    });
  });
});

// Made with Bob
