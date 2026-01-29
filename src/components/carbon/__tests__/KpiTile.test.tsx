import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import KpiTile from '../KpiTile';

describe('KpiTile', () => {
  const mockData = {
    totalUsers: 150,
    totalProjects: 45,
    completedProjects: 30,
    activeProjects: 15
  };

  it('should render all KPI tiles', () => {
    render(<KpiTile data={mockData} />);
    
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Completed Projects')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
  });

  it('should display correct values for each KPI', () => {
    render(<KpiTile data={mockData} />);
    
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  it('should handle zero values', () => {
    const zeroData = {
      totalUsers: 0,
      totalProjects: 0,
      completedProjects: 0,
      activeProjects: 0
    };
    
    render(<KpiTile data={zeroData} />);
    
    const zeroValues = screen.getAllByText('0');
    expect(zeroValues).toHaveLength(4);
  });

  it('should handle large numbers', () => {
    const largeData = {
      totalUsers: 10000,
      totalProjects: 5000,
      completedProjects: 3000,
      activeProjects: 2000
    };
    
    render(<KpiTile data={largeData} />);
    
    expect(screen.getByText('10000')).toBeInTheDocument();
    expect(screen.getByText('5000')).toBeInTheDocument();
    expect(screen.getByText('3000')).toBeInTheDocument();
    expect(screen.getByText('2000')).toBeInTheDocument();
  });

  it('should render icons with aria-hidden attribute', () => {
    const { container } = render(<KpiTile data={mockData} />);
    
    const icons = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(icons).toHaveLength(4);
  });

  it('should render tiles in a grid layout', () => {
    render(<KpiTile data={mockData} />);
    
    // Check that all tiles are rendered (one for each KPI)
    expect(screen.getByText('Total Users')).toBeInTheDocument();
    expect(screen.getByText('Total Projects')).toBeInTheDocument();
    expect(screen.getByText('Completed Projects')).toBeInTheDocument();
    expect(screen.getByText('Active Projects')).toBeInTheDocument();
  });

  it('should render correct number of tiles', () => {
    render(<KpiTile data={mockData} />);
    
    // Check that all 4 KPI values are rendered
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
    expect(screen.getByText('30')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
  });
});

// Made with Bob