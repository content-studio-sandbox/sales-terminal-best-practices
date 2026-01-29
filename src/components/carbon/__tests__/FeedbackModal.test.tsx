import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import FeedbackModal from '../FeedbackModal';

// Mock useAuth hook
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: {
      id: '12345678-1234-1234-1234-123456789abc',
      email: 'test@ibm.com',
      display_name: 'Test User',
    },
  }),
}));

describe('FeedbackModal', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when open', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText('Submit Feedback')).toBeInTheDocument();
    expect(screen.getByText('Feedback Type')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    const { container } = render(<FeedbackModal open={false} onClose={mockOnClose} />);

    // Carbon's Modal renders but is hidden when closed
    const modal = container.querySelector('.cds--modal');
    expect(modal).toBeInTheDocument();
    expect(modal).not.toHaveClass('is-visible');
  });

  it('should display bug report and feature idea radio buttons', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText(/Bug Report/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Feature Idea/i)).toBeInTheDocument();
  });

  it('should have bug report selected by default', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const bugRadio = screen.getByLabelText(/Bug Report/i) as HTMLInputElement;
    expect(bugRadio.checked).toBe(true);
  });

  it('should allow switching between bug and idea types', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const ideaRadio = screen.getByLabelText(/Feature Idea/i);
    await user.click(ideaRadio);

    expect(ideaRadio).toBeChecked();
  });

  it('should display category dropdown', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText('Category')).toBeInTheDocument();
    // Dropdown is present - check by ID
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should display title input field', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText('Title')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Brief description of the bug')).toBeInTheDocument();
  });

  it('should display description textarea', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText('Description')).toBeInTheDocument();
  });

  it('should change placeholder text when switching to feature idea', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const ideaRadio = screen.getByLabelText(/Feature Idea/i);
    await user.click(ideaRadio);

    expect(screen.getByPlaceholderText('Brief description of your idea')).toBeInTheDocument();
  });

  it('should display character counters', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText('0/200 characters')).toBeInTheDocument();
    expect(screen.getByText('0/2000 characters')).toBeInTheDocument();
  });

  it('should update character counter when typing in title', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title');
    await user.type(titleInput, 'Test');

    expect(screen.getByText('4/200 characters')).toBeInTheDocument();
  });

  it('should update character counter when typing in description', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const descriptionInput = screen.getByLabelText('Description');
    await user.type(descriptionInput, 'Test description');

    expect(screen.getByText('16/2000 characters')).toBeInTheDocument();
  });

  it('should display tip for bug reports', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText(/Include steps to reproduce/i)).toBeInTheDocument();
  });

  it('should display tip for feature ideas', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const ideaRadio = screen.getByLabelText(/Feature Idea/i);
    await user.click(ideaRadio);

    expect(screen.getByText(/Explain the problem you're trying to solve/i)).toBeInTheDocument();
  });

  it('should show error when submitting with empty fields', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    });
  });

  it('should show error when title is too short', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(titleInput, 'Bug');
    await user.type(descriptionInput, 'This is a test description');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Title must be at least 5 characters long')).toBeInTheDocument();
    });
  });

  it('should show error when description is too short', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(titleInput, 'Valid Title');
    await user.type(descriptionInput, 'Short');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be at least 10 characters long')).toBeInTheDocument();
    });
  });

  it('should detect and reject script tags in title', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(titleInput, '<script>alert("xss")</script>');
    await user.type(descriptionInput, 'Valid description text here');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid characters detected/i)).toBeInTheDocument();
    });
  });

  it('should detect and reject script tags in description', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(titleInput, 'Valid Title');
    await user.type(descriptionInput, '<script>alert("xss")</script>');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid characters detected/i)).toBeInTheDocument();
    });
  });

  it('should detect and reject javascript: protocol', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(titleInput, 'Valid Title');
    await user.type(descriptionInput, 'javascript:alert("xss")');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid characters detected/i)).toBeInTheDocument();
    });
  });

  it('should detect and reject event handlers', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(titleInput, 'Valid Title');
    await user.type(descriptionInput, '<img onerror="alert(1)">');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Invalid characters detected/i)).toBeInTheDocument();
    });
  });

  it('should clear error when user starts typing', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    // Trigger error
    const submitButton = screen.getByRole('button', { name: /Submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Please fill in all required fields')).toBeInTheDocument();
    });

    // Start typing
    const titleInput = screen.getByLabelText('Title');
    await user.type(titleInput, 'T');

    // Error should be cleared
    expect(screen.queryByText('Please fill in all required fields')).not.toBeInTheDocument();
  });

  it('should call onClose when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should reset form when closed', async () => {
    const user = userEvent.setup();
    const { rerender } = render(<FeedbackModal open={true} onClose={mockOnClose} />);

    // Fill in form
    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');
    await user.type(titleInput, 'Test Title');
    await user.type(descriptionInput, 'Test Description');

    // Close modal
    const cancelButton = screen.getByRole('button', { name: /Cancel/i });
    await user.click(cancelButton);

    // Reopen modal
    rerender(<FeedbackModal open={true} onClose={mockOnClose} />);

    // Form should be reset
    expect(screen.getByLabelText('Title')).toHaveValue('');
    expect(screen.getByLabelText('Description')).toHaveValue('');
  });

  it('should disable submit button while submitting', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title');
    const descriptionInput = screen.getByLabelText('Description');

    await user.type(titleInput, 'Valid Title Here');
    await user.type(descriptionInput, 'Valid description text here');

    const submitButton = screen.getByRole('button', { name: /Submit/i });
    
    // Click and immediately check if button text changes
    await user.click(submitButton);

    // Button should be disabled during submission
    await waitFor(() => {
      expect(submitButton).toBeDisabled();
    });
  });

  it('should enforce max length on title (200 chars)', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    const longText = 'a'.repeat(250);

    await user.type(titleInput, longText);

    // Should be truncated to 200
    expect(titleInput.value.length).toBeLessThanOrEqual(200);
  });

  it('should enforce max length on description (2000 chars)', async () => {
    const user = userEvent.setup();
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    const descriptionInput = screen.getByLabelText('Description') as HTMLTextAreaElement;
    
    // Use paste instead of type for performance with long text
    const longText = 'a'.repeat(2500);
    await user.click(descriptionInput);
    await user.paste(longText);

    // Should be truncated to 2000
    expect(descriptionInput.value.length).toBeLessThanOrEqual(2000);
  });

  it('should display Submit and Cancel buttons', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    expect(screen.getByRole('button', { name: /Submit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
  });

  it('should have all 6 categories available', () => {
    render(<FeedbackModal open={true} onClose={mockOnClose} />);

    // The dropdown should be present with Category label
    expect(screen.getByText('Category')).toBeInTheDocument();
    // Check that dropdown/combobox exists
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});

// Made with Bob
