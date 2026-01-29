import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ApplyProjectModal from '../ApplyProjectModal';

describe('ApplyProjectModal', () => {
  const mockProject = {
    id: '12345678-1234-1234-1234-123456789abc',
    name: 'Test Project',
  };

  const mockRoleOptions = [
    { id: 'role1', text: 'Frontend Developer' },
    { id: 'role2', text: 'Backend Developer' },
    { id: 'role3', text: 'Designer' },
  ];

  const mockOnOpenChange = vi.fn();
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render when open', () => {
    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    expect(screen.getByText('Test Project')).toBeInTheDocument();
    expect(screen.getByText('Apply to project')).toBeInTheDocument();
  });

  it('should not render when closed', () => {
    const { container } = render(
      <ApplyProjectModal
        open={false}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    // Carbon's ComposedModal renders but is hidden when closed
    // Check that the modal container has the closed state
    const modal = container.querySelector('.cds--modal');
    expect(modal).toBeInTheDocument();
    expect(modal).not.toHaveClass('is-visible');
  });

  it('should display role selection combobox', () => {
    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    expect(screen.getByText('Desired role (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select a role')).toBeInTheDocument();
  });

  it('should display message textarea', () => {
    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    expect(screen.getByText('Message to the project owner')).toBeInTheDocument();
    expect(screen.getByLabelText('Message to the project owner')).toBeInTheDocument();
  });

  it('should allow typing in message field', async () => {
    const user = userEvent.setup();
    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const textarea = screen.getByLabelText('Message to the project owner');
    await user.type(textarea, 'I am a great fit for this project');

    expect(textarea).toHaveValue('I am a great fit for this project');
  });

  it('should call onOpenChange when Cancel is clicked', async () => {
    const user = userEvent.setup();
    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should submit application with message only', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const textarea = screen.getByLabelText('Message to the project owner');
    await user.type(textarea, 'I have 5 years of experience');

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(mockProject.id, {
        role_id: null,
        message: 'I have 5 years of experience',
      });
    });

    expect(mockOnOpenChange).toHaveBeenCalledWith(false);
  });

  it('should trim whitespace from message', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const textarea = screen.getByLabelText('Message to the project owner');
    await user.type(textarea, '  Message with spaces  ');

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(mockProject.id, {
        role_id: null,
        message: 'Message with spaces',
      });
    });
  });

  it('should reset form after successful submission', async () => {
    const user = userEvent.setup();
    mockOnSubmit.mockResolvedValue(undefined);

    const { rerender } = render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const textarea = screen.getByLabelText('Message to the project owner');
    await user.type(textarea, 'Test message');

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });

    // Reopen modal to check if form is reset
    rerender(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const textareaAfterReset = screen.getByLabelText('Message to the project owner');
    expect(textareaAfterReset).toHaveValue('');
  });

  it('should disable buttons while submitting', async () => {
    const user = userEvent.setup();
    let resolveSubmit: () => void;
    const submitPromise = new Promise<void>((resolve) => {
      resolveSubmit = resolve;
    });
    mockOnSubmit.mockReturnValue(submitPromise);

    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    // Buttons should be disabled during submission
    expect(submitButton).toBeDisabled();
    expect(screen.getByRole('button', { name: /cancel/i })).toBeDisabled();
    expect(screen.getByText(/submitting/i)).toBeInTheDocument();

    // Resolve the promise
    resolveSubmit!();
    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it('should not submit if project is null', async () => {
    const user = userEvent.setup();
    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={null}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should not submit if project has no id', async () => {
    const user = userEvent.setup();
    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={{ name: 'Test' }}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const submitButton = screen.getByRole('button', { name: /submit application/i });
    await user.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should work without role options', () => {
    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
      />
    );

    expect(screen.getByText('Desired role (optional)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Select a role')).toBeInTheDocument();
  });

  it('should display project name as "Project" if not provided', () => {
    render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={{ id: '123' }}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    expect(screen.getByText('Project')).toBeInTheDocument();
  });

  it('should reset form when modal is closed via Cancel', async () => {
    const user = userEvent.setup();
    const { rerender } = render(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const textarea = screen.getByLabelText('Message to the project owner');
    await user.type(textarea, 'Test message');

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    await user.click(cancelButton);

    // Reopen modal
    rerender(
      <ApplyProjectModal
        open={true}
        onOpenChange={mockOnOpenChange}
        project={mockProject}
        onSubmit={mockOnSubmit}
        roleOptions={mockRoleOptions}
      />
    );

    const textareaAfterCancel = screen.getByLabelText('Message to the project owner');
    expect(textareaAfterCancel).toHaveValue('');
  });
});

// Made with Bob
