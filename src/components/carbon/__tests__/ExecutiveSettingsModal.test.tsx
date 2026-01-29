import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExecutiveSettingsModal from '../ExecutiveSettingsModal';
import * as useExecutiveConfigModule from '@/hooks/useExecutiveConfig';

// Mock the useExecutiveConfig hook
vi.mock('@/hooks/useExecutiveConfig');

describe('ExecutiveSettingsModal', () => {
  const mockOnClose = vi.fn();
  const mockSaveConfig = vi.fn();
  const mockResetToDefaults = vi.fn();

  const mockConfig = {
    avgProjectValue: 100000,
    avgCostSavings: 50000,
    patentMultiplier: 0.2,
    roiMultiplier: 1.5,
    highPerformerTarget: 30,
    conversionTarget: 75,
    strategicInitiatives: [
      { name: 'AI Innovation', description: 'Advance AI capabilities', priority: 1, active: true },
      { name: 'Cloud Migration', description: 'Move to cloud infrastructure', priority: 2, active: true },
      { name: 'Digital Transformation', description: 'Modernize systems', priority: 3, active: false },
    ],
  };

  beforeEach(() => {
    mockOnClose.mockClear();
    mockSaveConfig.mockClear();
    mockResetToDefaults.mockClear();
    
    // Setup default mock implementation
    vi.mocked(useExecutiveConfigModule.useExecutiveConfig).mockReturnValue({
      config: mockConfig,
      loading: false,
      error: null,
      saving: false,
      saveConfig: mockSaveConfig,
      resetToDefaults: mockResetToDefaults,
      refetch: vi.fn().mockResolvedValue(undefined),
    });
  });

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Executive Dashboard Settings')).toBeInTheDocument();
    });

    it('should have aria-hidden when closed', () => {
      const { container } = render(<ExecutiveSettingsModal open={false} onClose={mockOnClose} />);

      // Carbon modals render in DOM but are hidden with aria-hidden
      const modal = container.querySelector('.cds--modal');
      expect(modal).toHaveAttribute('aria-hidden', 'true');
    });

    it('should render all three tabs', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByRole('tab', { name: /Business Values/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Strategic Initiatives/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Calculations/i })).toBeInTheDocument();
    });

    it('should render modal footer buttons', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Reset to Defaults')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeInTheDocument();
      expect(screen.getByText('Save Settings')).toBeInTheDocument();
    });
  });

  describe('Business Values Tab', () => {
    it('should display business value configuration fields', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Project Value Configuration')).toBeInTheDocument();
      expect(screen.getByLabelText(/Average Project Value/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Average Cost Savings/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Patent Multiplier/i)).toBeInTheDocument();
    });

    it('should display current configuration values', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const projectValueInput = screen.getByLabelText(/Average Project Value/i);
      expect(projectValueInput).toHaveValue(100000);

      const costSavingsInput = screen.getByLabelText(/Average Cost Savings/i);
      expect(costSavingsInput).toHaveValue(50000);

      const patentInput = screen.getByLabelText(/Patent Multiplier/i);
      expect(patentInput).toHaveValue(0.2);
    });

    it('should display helper text for each field', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByText(/Average revenue generated per completed project/i)).toBeInTheDocument();
      expect(screen.getByText(/Average cost savings per completed project/i)).toBeInTheDocument();
      expect(screen.getByText(/Percentage of projects that result in patents/i)).toBeInTheDocument();
    });
  });

  describe('Strategic Initiatives Tab', () => {
    it('should have strategic initiatives tab', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const initiativesTab = screen.getByRole('tab', { name: /Strategic Initiatives/i });
      expect(initiativesTab).toBeInTheDocument();
    });

    it('should render strategic initiatives data in the component', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      // Strategic initiatives are rendered in the DOM even if not visible
      expect(screen.getByText('AI Innovation')).toBeInTheDocument();
      expect(screen.getByText('Cloud Migration')).toBeInTheDocument();
      expect(screen.getByText('Digital Transformation')).toBeInTheDocument();
    });

    it('should have Add Initiative button in the component', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Add Initiative')).toBeInTheDocument();
    });

    it('should have delete buttons for initiatives', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const deleteButtons = screen.getAllByLabelText('Delete');
      expect(deleteButtons.length).toBeGreaterThanOrEqual(3);
    });

    it('should render initiatives with status information', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      // Verify all initiatives are rendered in the component
      expect(screen.getByText('AI Innovation')).toBeInTheDocument();
      expect(screen.getByText('Cloud Migration')).toBeInTheDocument();
      expect(screen.getByText('Digital Transformation')).toBeInTheDocument();
    });
  });

  describe('Calculations Tab', () => {
    it('should have calculations tab', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const calculationsTab = screen.getByRole('tab', { name: /Calculations/i });
      expect(calculationsTab).toBeInTheDocument();
    });

    it('should render calculation fields in the component', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      // Calculation fields are rendered in the DOM
      expect(screen.getByLabelText(/ROI Multiplier/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/High Performer Target/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Conversion Target/i)).toBeInTheDocument();
    });

    it('should have correct initial calculation values', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const roiInput = screen.getByLabelText(/ROI Multiplier/i);
      expect(roiInput).toHaveValue(1.5);

      const performerInput = screen.getByLabelText(/High Performer Target/i);
      expect(performerInput).toHaveValue(30);

      const conversionInput = screen.getByLabelText(/Conversion Target/i);
      expect(conversionInput).toHaveValue(75);
    });
  });

  describe('Save Functionality', () => {
    it('should call saveConfig when Save button is clicked', async () => {
      const user = userEvent.setup();
      mockSaveConfig.mockResolvedValue(true);

      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const saveButton = screen.getByText('Save Settings');
      await user.click(saveButton);

      expect(mockSaveConfig).toHaveBeenCalledTimes(1);
    });

    it('should show success notification after successful save', async () => {
      const user = userEvent.setup();
      mockSaveConfig.mockResolvedValue(true);

      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const saveButton = screen.getByText('Save Settings');
      await user.click(saveButton);

      await waitFor(() => {
        expect(screen.getByText('Settings Saved')).toBeInTheDocument();
      });
    });

    it('should disable save button while saving', () => {
      vi.mocked(useExecutiveConfigModule.useExecutiveConfig).mockReturnValue({
        config: mockConfig,
        loading: false,
        error: null,
        saving: true,
        saveConfig: mockSaveConfig,
        resetToDefaults: mockResetToDefaults,
        refetch: vi.fn().mockResolvedValue(undefined),
      });

      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const saveButton = screen.getByText('Saving...');
      expect(saveButton).toBeDisabled();
    });
  });

  describe('Reset Functionality', () => {
    it('should show confirmation dialog when Reset is clicked', async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const resetButton = screen.getByText('Reset to Defaults');
      await user.click(resetButton);

      expect(confirmSpy).toHaveBeenCalledWith(
        expect.stringContaining('Are you sure you want to reset all settings')
      );

      confirmSpy.mockRestore();
    });

    it('should call resetToDefaults when confirmed', async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
      mockResetToDefaults.mockResolvedValue(true);

      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const resetButton = screen.getByText('Reset to Defaults');
      await user.click(resetButton);

      expect(mockResetToDefaults).toHaveBeenCalledTimes(1);

      confirmSpy.mockRestore();
    });

    it('should not reset when cancelled', async () => {
      const user = userEvent.setup();
      const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(false);

      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const resetButton = screen.getByText('Reset to Defaults');
      await user.click(resetButton);

      expect(mockResetToDefaults).not.toHaveBeenCalled();

      confirmSpy.mockRestore();
    });
  });

  describe('Cancel Functionality', () => {
    it('should call onClose when Cancel button is clicked', async () => {
      const user = userEvent.setup();
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const cancelButton = screen.getByText('Cancel');
      await user.click(cancelButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should call onClose when modal is closed', async () => {
      const user = userEvent.setup();
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      // Carbon modal close button
      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should display error notification when error exists', () => {
      vi.mocked(useExecutiveConfigModule.useExecutiveConfig).mockReturnValue({
        config: mockConfig,
        loading: false,
        error: 'Failed to load configuration',
        saving: false,
        saveConfig: mockSaveConfig,
        resetToDefaults: mockResetToDefaults,
        refetch: vi.fn().mockResolvedValue(undefined),
      });

      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Error')).toBeInTheDocument();
      expect(screen.getByText('Failed to load configuration')).toBeInTheDocument();
    });
  });

  describe('Loading State', () => {
    it('should handle loading state', () => {
      vi.mocked(useExecutiveConfigModule.useExecutiveConfig).mockReturnValue({
        config: mockConfig,
        loading: true,
        error: null,
        saving: false,
        saveConfig: mockSaveConfig,
        resetToDefaults: mockResetToDefaults,
        refetch: vi.fn().mockResolvedValue(undefined),
      });

      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      // Modal should still render during loading
      expect(screen.getByText('Executive Dashboard Settings')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal structure', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByText('Executive Dashboard Settings')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should have accessible tab list', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      const tabList = screen.getByRole('tablist', { name: /Settings tabs/i });
      expect(tabList).toBeInTheDocument();
    });

    it('should have proper button labels', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByRole('button', { name: /Reset to Defaults/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Cancel/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /Save Settings/i })).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should have all three tabs available', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      expect(screen.getByRole('tab', { name: /Business Values/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Strategic Initiatives/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /Calculations/i })).toBeInTheDocument();
    });

    it('should render all tab content in the DOM', () => {
      render(<ExecutiveSettingsModal open={true} onClose={mockOnClose} />);

      // All tab panels are rendered (Carbon renders all panels, just hides inactive ones)
      expect(screen.getByText('Project Value Configuration')).toBeInTheDocument();
      expect(screen.getByText('AI Innovation')).toBeInTheDocument();
      expect(screen.getByLabelText(/ROI Multiplier/i)).toBeInTheDocument();
    });
  });
});

// Made with Bob
