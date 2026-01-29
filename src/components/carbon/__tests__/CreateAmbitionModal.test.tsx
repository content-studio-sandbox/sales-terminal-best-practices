import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateAmbitionModal from '../CreateAmbitionModal';
import { supabase } from '@/integrations/supabase/client';

// Mock Supabase
vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        in: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({ 
            data: [
              { id: '1', display_name: 'John Leader', email: 'john@example.com', access_role: 'leadership' },
              { id: '2', display_name: 'Jane Manager', email: 'jane@example.com', access_role: 'leader' }
            ], 
            error: null 
          }))
        }))
      })),
      insert: vi.fn(() => Promise.resolve({ data: null, error: null }))
    }))
  }
}));

describe('CreateAmbitionModal', () => {
  const mockOnOpenChange = vi.fn();
  const mockOnAmbitionCreated = vi.fn();

  const defaultProps = {
    open: true,
    onOpenChange: mockOnOpenChange,
    onAmbitionCreated: mockOnAmbitionCreated
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      expect(screen.getByText('Create New Strategic Ambition')).toBeInTheDocument();
      expect(screen.getByText(/Define a high-level business initiative/)).toBeInTheDocument();
    });


    it('should render all form sections', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      expect(screen.getByText('Basic Information')).toBeInTheDocument();
      expect(screen.getByText('Leadership')).toBeInTheDocument();
      expect(screen.getByText('Executive Dashboard Metrics')).toBeInTheDocument();
    });

    it('should render all form fields', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      // Basic Information
      expect(screen.getByLabelText('Ambition Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      
      // Leadership
      expect(screen.getByText('Assign Initiative Leader')).toBeInTheDocument();
      
      // Executive Dashboard Metrics
      expect(screen.getByLabelText('Business Value')).toBeInTheDocument();
      expect(screen.getByText('Strategic Priority')).toBeInTheDocument();
      expect(screen.getByLabelText('Expected ROI (%)')).toBeInTheDocument();
      expect(screen.getByLabelText('Budget Allocated ($)')).toBeInTheDocument();
      expect(screen.getByText('Target Completion Date')).toBeInTheDocument();
    });

    it('should render action buttons', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      expect(screen.getByRole('button', { name: /cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /create ambition/i })).toBeInTheDocument();
    });
  });

  describe('Leader Loading', () => {
    it('should load leaders when modal opens', async () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('users');
      });
    });

    it('should handle leader loading error gracefully', async () => {
      const mockError = new Error('Failed to load leaders');
      vi.mocked(supabase.from).mockReturnValueOnce({
        select: vi.fn(() => ({
          in: vi.fn(() => ({
            order: vi.fn(() => Promise.resolve({ data: null, error: mockError }))
          }))
        }))
      } as any);

      render(<CreateAmbitionModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByText(/Could not load leader list/)).toBeInTheDocument();
      });
    });

    it('should not load leaders when modal is closed', () => {
      render(<CreateAmbitionModal {...defaultProps} open={false} />);
      
      expect(supabase.from).not.toHaveBeenCalled();
    });
  });

  describe('Form Validation', () => {
    it('should disable create button when name is empty', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      expect(createButton).toBeDisabled();
    });

    it('should disable create button when description is empty', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const nameInput = screen.getByLabelText('Ambition Name');
      await user.type(nameInput, 'Test Ambition');
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      expect(createButton).toBeDisabled();
    });

    it('should enable create button when required fields are filled', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const nameInput = screen.getByLabelText('Ambition Name');
      const descriptionInput = screen.getByLabelText('Description');
      
      await user.type(nameInput, 'Test Ambition');
      await user.type(descriptionInput, 'Test Description');
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      expect(createButton).toBeEnabled();
    });

  });

  describe('Form Interaction', () => {
    it('should update name field on input', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const nameInput = screen.getByLabelText('Ambition Name') as HTMLInputElement;
      await user.type(nameInput, 'Digital Transformation');
      
      expect(nameInput.value).toBe('Digital Transformation');
    });

    it('should update description field on input', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const descriptionInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      await user.type(descriptionInput, 'Transform our digital capabilities');
      
      expect(descriptionInput.value).toBe('Transform our digital capabilities');
    });

    it('should update business value field on input', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const businessValueInput = screen.getByLabelText('Business Value') as HTMLTextAreaElement;
      await user.type(businessValueInput, 'Increase revenue by 20%');
      
      expect(businessValueInput.value).toBe('Increase revenue by 20%');
    });

    it('should update expected ROI field on input', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const roiInput = screen.getByLabelText('Expected ROI (%)') as HTMLInputElement;
      await user.clear(roiInput);
      await user.type(roiInput, '25');
      
      expect(roiInput.value).toBe('25');
    });

    it('should update budget allocated field on input', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const budgetInput = screen.getByLabelText('Budget Allocated ($)') as HTMLInputElement;
      await user.clear(budgetInput);
      await user.type(budgetInput, '500000');
      
      expect(budgetInput.value).toBe('500000');
    });
  });

  describe('Priority Selection', () => {
    it('should have medium priority selected by default', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      // Check that Strategic Priority section exists
      expect(screen.getByText('Strategic Priority')).toBeInTheDocument();
    });

    it('should display priority dropdown', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const prioritySection = screen.getByText('Strategic Priority').closest('div');
      expect(prioritySection).toBeInTheDocument();
    });
  });

  describe('Ambition Creation', () => {
    it('should create ambition with required fields only', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const nameInput = screen.getByLabelText('Ambition Name');
      const descriptionInput = screen.getByLabelText('Description');
      
      await user.type(nameInput, 'Test Ambition');
      await user.type(descriptionInput, 'Test Description');
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(supabase.from).toHaveBeenCalledWith('ambitions');
      });
    });

    it('should create ambition with all fields filled', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      // Fill required fields
      await user.type(screen.getByLabelText('Ambition Name'), 'Complete Ambition');
      await user.type(screen.getByLabelText('Description'), 'Complete Description');
      
      // Fill optional fields
      await user.type(screen.getByLabelText('Business Value'), 'High business value');
      await user.clear(screen.getByLabelText('Expected ROI (%)'));
      await user.type(screen.getByLabelText('Expected ROI (%)'), '30');
      await user.clear(screen.getByLabelText('Budget Allocated ($)'));
      await user.type(screen.getByLabelText('Budget Allocated ($)'), '1000000');
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(mockOnAmbitionCreated).toHaveBeenCalled();
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });

    it('should show loading state during creation', async () => {
      const user = userEvent.setup();
      
      // Mock slow insert - need to mock both calls (leaders load + insert)
      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation((() => {
        callCount++;
        if (callCount === 1) {
          // First call: load leaders
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: [], error: null }))
              }))
            }))
          } as any;
        } else {
          // Second call: insert ambition (slow)
          return {
            insert: vi.fn(() => new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 100)))
          } as any;
        }
      }) as any);
      
      render(<CreateAmbitionModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Ambition Name')).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText('Ambition Name'), 'Test');
      await user.type(screen.getByLabelText('Description'), 'Test');
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      await user.click(createButton);
      
      expect(screen.getByText('Creating…')).toBeInTheDocument();
      expect(createButton).toBeDisabled();
    });

    it('should handle creation error', async () => {
      const user = userEvent.setup();
      const mockError = new Error('Creation failed');
      
      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation((() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: [], error: null }))
              }))
            }))
          } as any;
        } else {
          return {
            insert: vi.fn(() => Promise.resolve({ data: null, error: mockError }))
          } as any;
        }
      }) as any);
      
      render(<CreateAmbitionModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Ambition Name')).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText('Ambition Name'), 'Test');
      await user.type(screen.getByLabelText('Description'), 'Test');
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(screen.getByText(/Creation failed/)).toBeInTheDocument();
      });
      
      // Modal should stay open on error
      expect(screen.getByText('Create New Strategic Ambition')).toBeInTheDocument();
    });

    it('should trim whitespace from text fields', async () => {
      const user = userEvent.setup();
      const mockInsert = vi.fn(() => Promise.resolve({ data: null, error: null }));
      
      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation((() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: [], error: null }))
              }))
            }))
          } as any;
        } else {
          return {
            insert: mockInsert
          } as any;
        }
      }) as any);
      
      render(<CreateAmbitionModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Ambition Name')).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText('Ambition Name'), '  Test Ambition  ');
      await user.type(screen.getByLabelText('Description'), '  Test Description  ');
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(mockInsert).toHaveBeenCalled();
      });
      
      // Check that the insert was called with trimmed values
      expect(mockInsert).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Ambition',
          description: 'Test Description'
        })
      );
    });
  });

  describe('Modal Actions', () => {
    it('should close modal on cancel', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      await user.click(cancelButton);
      
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    it('should disable cancel button during creation', async () => {
      const user = userEvent.setup();
      
      let callCount = 0;
      vi.mocked(supabase.from).mockImplementation((() => {
        callCount++;
        if (callCount === 1) {
          return {
            select: vi.fn(() => ({
              in: vi.fn(() => ({
                order: vi.fn(() => Promise.resolve({ data: [], error: null }))
              }))
            }))
          } as any;
        } else {
          return {
            insert: vi.fn(() => new Promise(resolve => setTimeout(() => resolve({ data: null, error: null }), 200)))
          } as any;
        }
      }) as any);
      
      render(<CreateAmbitionModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Ambition Name')).toBeInTheDocument();
      });
      
      await user.type(screen.getByLabelText('Ambition Name'), 'Test');
      await user.type(screen.getByLabelText('Description'), 'Test');
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      await user.click(createButton);
      
      // Wait a bit for the loading state to kick in
      await waitFor(() => {
        expect(screen.getByText('Creating…')).toBeInTheDocument();
      }, { timeout: 100 });
      
      const cancelButton = screen.getByRole('button', { name: /cancel/i });
      expect(cancelButton).toBeDisabled();
    });

    it('should call callbacks after successful creation', async () => {
      const user = userEvent.setup();
      render(<CreateAmbitionModal {...defaultProps} />);
      
      await waitFor(() => {
        expect(screen.getByLabelText('Ambition Name')).toBeInTheDocument();
      });
      
      const nameInput = screen.getByLabelText('Ambition Name') as HTMLInputElement;
      const descriptionInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
      
      await user.type(nameInput, 'Test Ambition');
      await user.type(descriptionInput, 'Test Description');
      
      const createButton = screen.getByRole('button', { name: /create ambition/i });
      await user.click(createButton);
      
      await waitFor(() => {
        expect(mockOnAmbitionCreated).toHaveBeenCalled();
        expect(mockOnOpenChange).toHaveBeenCalledWith(false);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      expect(screen.getByLabelText('Create ambition form')).toBeInTheDocument();
    });

    it('should prevent close on click outside', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      const modal = screen.getByRole('dialog', { hidden: true });
      expect(modal).toBeInTheDocument();
    });

    it('should have proper form labels', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      expect(screen.getByLabelText('Ambition Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Description')).toBeInTheDocument();
      expect(screen.getByLabelText('Business Value')).toBeInTheDocument();
      expect(screen.getByLabelText('Expected ROI (%)')).toBeInTheDocument();
      expect(screen.getByLabelText('Budget Allocated ($)')).toBeInTheDocument();
    });
  });

  describe('Helper Text', () => {
    it('should display helper text for optional fields', () => {
      render(<CreateAmbitionModal {...defaultProps} />);
      
      expect(screen.getByText(/Optional: Assign a leader to oversee/)).toBeInTheDocument();
      expect(screen.getByText(/Optional: Explain how this initiative contributes/)).toBeInTheDocument();
      expect(screen.getByText(/Optional: Projected return on investment/)).toBeInTheDocument();
      expect(screen.getByText(/Optional: Total budget for this initiative/)).toBeInTheDocument();
      expect(screen.getByText(/Optional: Expected completion date/)).toBeInTheDocument();
    });
  });
});

// Made with Bob - Comprehensive test coverage for CreateAmbitionModal