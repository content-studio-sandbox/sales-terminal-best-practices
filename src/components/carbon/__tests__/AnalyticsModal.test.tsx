import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalyticsModal from '../AnalyticsModal';

describe('AnalyticsModal', () => {
  const mockOnClose = vi.fn();

  const mockMetrics = {
    programROI: 125,
    businessValue: 5000000,
    strategicAlignment: 85,
    totalUsers: 150,
    assignedUsers: 120,
    talentRetention: 92,
    highUtilization: 45,
    totalProjects: 50,
    activeProjects: 30,
    completedProjects: 20,
  };

  const mockStrategicAlignments = [
    { initiative: 'Digital Transformation', projects: 15, talent: 45, completion: 75, impact: 'high' },
    { initiative: 'Cloud Migration', projects: 10, talent: 30, completion: 60, impact: 'medium' },
    { initiative: 'AI Integration', projects: 8, talent: 25, completion: 50, impact: 'high' },
  ];

  const mockTalentPipeline = [
    { stage: 'Identified', count: 100, conversion: 80 },
    { stage: 'Engaged', count: 80, conversion: 75 },
    { stage: 'Assigned', count: 60, conversion: 90 },
  ];

  const mockBusinessImpacts = [
    { category: 'Revenue Growth', value: '$2.5M', trend: 15, projects: 12 },
    { category: 'Cost Savings', value: '$1.8M', trend: 20, projects: 8 },
    { category: 'Efficiency Gains', value: '35%', trend: 10, projects: 15 },
  ];

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  describe('Rendering', () => {
    it('should render modal when open', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      expect(screen.getByText('Detailed Analytics')).toBeInTheDocument();
      expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
    });

    it('should not render when closed', () => {
      const { container } = render(
        <AnalyticsModal
          open={false}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      // Modal should not be visible when closed
      expect(container.querySelector('.cds--modal.is-visible')).not.toBeInTheDocument();
    });

    it('should not render when metrics is null', () => {
      const { container } = render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={null}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      expect(container.firstChild).toBeNull();
    });
  });

  describe('Performance Metrics Section', () => {
    beforeEach(() => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );
    });

    it('should display performance metrics section', () => {
      expect(screen.getByText('Performance Metrics')).toBeInTheDocument();
    });

    it('should display program performance category', () => {
      expect(screen.getByText('Program Performance')).toBeInTheDocument();
      expect(screen.getByText('Program ROI')).toBeInTheDocument();
      expect(screen.getByText('Business Value')).toBeInTheDocument();
      expect(screen.getByText('Strategic Alignment')).toBeInTheDocument();
    });

    it('should display talent metrics category', () => {
      expect(screen.getByText('Talent Metrics')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Assigned Users')).toBeInTheDocument();
      expect(screen.getByText('Talent Retention')).toBeInTheDocument();
      expect(screen.getByText('High Performers')).toBeInTheDocument();
    });

    it('should display project metrics category', () => {
      expect(screen.getByText('Project Metrics')).toBeInTheDocument();
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
      expect(screen.getByText('Completed Projects')).toBeInTheDocument();
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    });

    it('should format ROI percentage correctly', () => {
      expect(screen.getByText('125%')).toBeInTheDocument();
    });

    it('should format business value in millions', () => {
      expect(screen.getByText('$5.0M')).toBeInTheDocument();
    });
  });

  describe('Strategic Alignment Table', () => {
    beforeEach(() => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );
    });

    it('should display strategic alignment section', () => {
      expect(screen.getByText('Strategic Alignment Breakdown')).toBeInTheDocument();
    });

    it('should display initiative names', () => {
      expect(screen.getByText('Digital Transformation')).toBeInTheDocument();
      expect(screen.getByText('Cloud Migration')).toBeInTheDocument();
      expect(screen.getByText('AI Integration')).toBeInTheDocument();
    });

    it('should display impact tags', () => {
      const highTags = screen.getAllByText('HIGH');
      expect(highTags.length).toBeGreaterThan(0);
      expect(screen.getByText('MEDIUM')).toBeInTheDocument();
    });

    it('should have table headers', () => {
      expect(screen.getByText('Initiative')).toBeInTheDocument();
      expect(screen.getByText('Projects')).toBeInTheDocument();
      expect(screen.getByText('Talent')).toBeInTheDocument();
      expect(screen.getByText('Completion')).toBeInTheDocument();
      expect(screen.getByText('Impact')).toBeInTheDocument();
    });
  });

  describe('Talent Pipeline Table', () => {
    beforeEach(() => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );
    });

    it('should display talent pipeline section', () => {
      expect(screen.getByText('Talent Pipeline Analysis')).toBeInTheDocument();
    });

    it('should display pipeline stages', () => {
      expect(screen.getByText('Identified')).toBeInTheDocument();
      expect(screen.getByText('Engaged')).toBeInTheDocument();
      expect(screen.getByText('Assigned')).toBeInTheDocument();
    });

    it('should have table headers', () => {
      expect(screen.getByText('Pipeline Stage')).toBeInTheDocument();
      expect(screen.getByText('Count')).toBeInTheDocument();
      expect(screen.getByText('Conversion Rate')).toBeInTheDocument();
    });
  });

  describe('Business Impact Table', () => {
    beforeEach(() => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );
    });

    it('should display business impact section', () => {
      expect(screen.getByText('Business Impact Summary')).toBeInTheDocument();
    });

    it('should display impact categories', () => {
      expect(screen.getByText('Revenue Growth')).toBeInTheDocument();
      expect(screen.getByText('Cost Savings')).toBeInTheDocument();
      expect(screen.getByText('Efficiency Gains')).toBeInTheDocument();
    });

    it('should display trend tags', () => {
      expect(screen.getByText('+15%')).toBeInTheDocument();
      expect(screen.getByText('+20%')).toBeInTheDocument();
      expect(screen.getByText('+10%')).toBeInTheDocument();
    });

    it('should have table headers', () => {
      expect(screen.getByText('Category')).toBeInTheDocument();
      expect(screen.getByText('Value')).toBeInTheDocument();
      expect(screen.getByText('Trend')).toBeInTheDocument();
      expect(screen.getByText('Contributing Projects')).toBeInTheDocument();
    });
  });

  describe('Modal Interaction', () => {
    it('should call onClose when close button is clicked', async () => {
      const user = userEvent.setup();
      
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      const closeButton = screen.getByRole('button', { name: /close/i });
      await user.click(closeButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('should be a passive modal without action buttons', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      // Passive modals don't have submit/save buttons
      expect(screen.queryByRole('button', { name: /submit|save|confirm/i })).not.toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty strategic alignments array', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={[]}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      expect(screen.getByText('Strategic Alignment Breakdown')).toBeInTheDocument();
    });

    it('should handle empty talent pipeline array', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={[]}
          businessImpacts={mockBusinessImpacts}
        />
      );

      expect(screen.getByText('Talent Pipeline Analysis')).toBeInTheDocument();
    });

    it('should handle empty business impacts array', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={[]}
        />
      );

      expect(screen.getByText('Business Impact Summary')).toBeInTheDocument();
    });

    it('should calculate completion rate as 0% when no projects', () => {
      const zeroMetrics = {
        ...mockMetrics,
        totalProjects: 0,
        completedProjects: 0,
      };

      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={zeroMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      // Should show 0% completion rate
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('should have proper modal structure', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      expect(screen.getByText('Detailed Analytics')).toBeInTheDocument();
      expect(screen.getByText('Executive Dashboard')).toBeInTheDocument();
    });

    it('should have three data tables', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      const tables = screen.getAllByRole('table');
      expect(tables.length).toBe(3);
    });

    it('should have close button', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });
  });

  describe('Data Formatting', () => {
    it('should format currency in millions', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      expect(screen.getByText('$5.0M')).toBeInTheDocument();
    });

    it('should display all metric labels', () => {
      render(
        <AnalyticsModal
          open={true}
          onClose={mockOnClose}
          metrics={mockMetrics}
          strategicAlignments={mockStrategicAlignments}
          talentPipeline={mockTalentPipeline}
          businessImpacts={mockBusinessImpacts}
        />
      );

      // Check that all metric labels are present
      expect(screen.getByText('Program ROI')).toBeInTheDocument();
      expect(screen.getByText('Business Value')).toBeInTheDocument();
      expect(screen.getByText('Strategic Alignment')).toBeInTheDocument();
      expect(screen.getByText('Total Users')).toBeInTheDocument();
      expect(screen.getByText('Assigned Users')).toBeInTheDocument();
      expect(screen.getByText('Talent Retention')).toBeInTheDocument();
      expect(screen.getByText('High Performers')).toBeInTheDocument();
      expect(screen.getByText('Total Projects')).toBeInTheDocument();
      expect(screen.getByText('Active Projects')).toBeInTheDocument();
      expect(screen.getByText('Completed Projects')).toBeInTheDocument();
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
    });
  });
});

// Made with Bob
