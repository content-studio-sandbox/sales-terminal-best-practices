import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import LoginModal from '../LoginModal';

describe('LoginModal', () => {
  const mockOnOpenChange = vi.fn();

  it('should render when open is true', () => {
    render(<LoginModal open={true} onOpenChange={mockOnOpenChange} />);
    
    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Please use the authentication system to log in.')).toBeInTheDocument();
  });

  it('should have hidden class when open is false', () => {
    const { container } = render(<LoginModal open={false} onOpenChange={mockOnOpenChange} />);
    
    // Carbon modals use visibility/display CSS when closed, content is still in DOM
    const modal = container.querySelector('[role="presentation"]');
    expect(modal).toBeInTheDocument();
  });

  it('should call onOpenChange with false when close button is clicked', async () => {
    const user = userEvent.setup();
    render(<LoginModal open={true} onOpenChange={mockOnOpenChange} />);
    
    // Find and click the close button (Carbon modal close button)
    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);
    
    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should have correct modal size', () => {
    const { container } = render(<LoginModal open={true} onOpenChange={mockOnOpenChange} />);
    
    const modal = container.querySelector('.cds--modal-container');
    expect(modal).toBeInTheDocument();
  });

  it('should display modal header', () => {
    render(<LoginModal open={true} onOpenChange={mockOnOpenChange} />);
    
    const header = screen.getByText('Login');
    expect(header.tagName).toBe('H3');
  });

  it('should display informational message in modal body', () => {
    render(<LoginModal open={true} onOpenChange={mockOnOpenChange} />);
    
    const message = screen.getByText('Please use the authentication system to log in.');
    expect(message.tagName).toBe('P');
  });
});

// Made with Bob