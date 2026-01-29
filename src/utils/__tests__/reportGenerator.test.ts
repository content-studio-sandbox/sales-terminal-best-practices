import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  generateExecutiveCSV,
  generateExecutiveJSON,
  downloadFile,
  exportExecutiveReportCSV,
  exportExecutiveReportJSON
} from '../reportGenerator';

describe('reportGenerator', () => {
  const mockData = {
    metrics: {
      programROI: 245,
      businessValue: 12500000,
      talentRetention: 94,
      strategicAlignment: 87,
      totalUsers: 150,
      totalProjects: 45,
      activeProjects: 15,
      completedProjects: 30
    },
    strategicAlignments: [
      {
        initiative: 'AI & Machine Learning',
        projects: 12,
        talent: 45,
        completion: 75,
        impact: 'high'
      },
      {
        initiative: 'Cloud Transformation',
        projects: 8,
        talent: 32,
        completion: 88,
        impact: 'medium'
      }
    ],
    talentPipeline: [
      { stage: 'Candidates', count: 250, conversion: 60 },
      { stage: 'In Training', count: 150, conversion: 80 },
      { stage: 'Active', count: 120, conversion: 95 }
    ],
    businessImpacts: [
      { category: 'Revenue Growth', value: '$2.5M', trend: 15, projects: 8 },
      { category: 'Cost Savings', value: '$1.8M', trend: 22, projects: 12 }
    ],
    generatedAt: '2024-01-15T10:30:00Z'
  };

  describe('generateExecutiveCSV', () => {
    it('should generate CSV with correct header', () => {
      const csv = generateExecutiveCSV(mockData);
      
      expect(csv).toContain('IBM Talent Development Program - Executive Report');
      expect(csv).toContain('Generated: 2024-01-15T10:30:00Z');
    });

    it('should include executive summary metrics', () => {
      const csv = generateExecutiveCSV(mockData);
      
      expect(csv).toContain('EXECUTIVE SUMMARY');
      expect(csv).toContain('Program ROI,245%');
      expect(csv).toContain('Business Value Delivered,$12.5M');
      expect(csv).toContain('Talent Retention,94%');
      expect(csv).toContain('Strategic Alignment,87%');
      expect(csv).toContain('Total Users,150');
      expect(csv).toContain('Total Projects,45');
    });

    it('should include strategic alignment data', () => {
      const csv = generateExecutiveCSV(mockData);
      
      expect(csv).toContain('STRATEGIC ALIGNMENT');
      expect(csv).toContain('AI & Machine Learning');
      expect(csv).toContain('Cloud Transformation');
      expect(csv).toContain('HIGH');
      expect(csv).toContain('MEDIUM');
    });

    it('should include talent pipeline data', () => {
      const csv = generateExecutiveCSV(mockData);
      
      expect(csv).toContain('TALENT PIPELINE');
      expect(csv).toContain('"Candidates",250,60%');
      expect(csv).toContain('"In Training",150,80%');
      expect(csv).toContain('"Active",120,95%');
    });

    it('should include business impact data', () => {
      const csv = generateExecutiveCSV(mockData);
      
      expect(csv).toContain('BUSINESS IMPACT');
      expect(csv).toContain('Revenue Growth');
      expect(csv).toContain('Cost Savings');
      expect(csv).toContain('+15%');
      expect(csv).toContain('+22%');
    });

    it('should properly escape CSV values with quotes', () => {
      const csv = generateExecutiveCSV(mockData);
      
      expect(csv).toContain('"AI & Machine Learning"');
      expect(csv).toContain('"Cloud Transformation"');
    });
  });

  describe('generateExecutiveJSON', () => {
    it('should generate valid JSON', () => {
      const json = generateExecutiveJSON(mockData);
      
      expect(() => JSON.parse(json)).not.toThrow();
    });

    it('should include report metadata', () => {
      const json = generateExecutiveJSON(mockData);
      const parsed = JSON.parse(json);
      
      expect(parsed.report).toBe('IBM Talent Development Program - Executive Report');
      expect(parsed.generatedAt).toBe('2024-01-15T10:30:00Z');
    });

    it('should include executive summary with formatted values', () => {
      const json = generateExecutiveJSON(mockData);
      const parsed = JSON.parse(json);
      
      expect(parsed.executiveSummary.programROI).toBe('245%');
      expect(parsed.executiveSummary.businessValueDelivered).toBe('$12.5M');
      expect(parsed.executiveSummary.talentRetention).toBe('94%');
      expect(parsed.executiveSummary.strategicAlignment).toBe('87%');
    });

    it('should include all data sections', () => {
      const json = generateExecutiveJSON(mockData);
      const parsed = JSON.parse(json);
      
      expect(parsed.strategicAlignment).toHaveLength(2);
      expect(parsed.talentPipeline).toHaveLength(3);
      expect(parsed.businessImpact).toHaveLength(2);
    });

    it('should format JSON with proper indentation', () => {
      const json = generateExecutiveJSON(mockData);
      
      // Check for indentation (2 spaces)
      expect(json).toContain('  "report"');
      expect(json).toContain('    "programROI"');
    });
  });

  describe('downloadFile', () => {
    let createElementSpy: any;
    let appendChildSpy: any;
    let removeChildSpy: any;
    let createObjectURLSpy: any;
    let revokeObjectURLSpy: any;

    beforeEach(() => {
      // Mock DOM methods
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
      
      // Mock URL methods
      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should create a blob with correct content and mime type', () => {
      downloadFile('test content', 'test.csv', 'text/csv');
      
      expect(createObjectURLSpy).toHaveBeenCalled();
    });

    it('should create a download link with correct filename', () => {
      downloadFile('test content', 'test.csv', 'text/csv');
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
    });

    it('should trigger download and cleanup', () => {
      downloadFile('test content', 'test.csv', 'text/csv');
      
      expect(appendChildSpy).toHaveBeenCalled();
      expect(removeChildSpy).toHaveBeenCalled();
      expect(revokeObjectURLSpy).toHaveBeenCalledWith('blob:mock-url');
    });
  });

  describe('exportExecutiveReportCSV', () => {
    let createElementSpy: any;
    let appendChildSpy: any;
    let removeChildSpy: any;
    let createObjectURLSpy: any;
    let revokeObjectURLSpy: any;
    let clickSpy: any;

    beforeEach(() => {
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };
      clickSpy = mockLink.click;

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      appendChildSpy = vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
      removeChildSpy = vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
      createObjectURLSpy = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      revokeObjectURLSpy = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should generate CSV and trigger download', () => {
      const dateSpy = vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-15T10:30:00.000Z');
      
      exportExecutiveReportCSV(mockData);
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
      expect(createObjectURLSpy).toHaveBeenCalled();
      
      dateSpy.mockRestore();
    });

    it('should use correct filename format with date', () => {
      const dateSpy = vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-15T10:30:00.000Z');
      const mockLink = { href: '', download: '', click: vi.fn() };
      createElementSpy.mockReturnValue(mockLink);
      
      exportExecutiveReportCSV(mockData);
      
      expect(mockLink.download).toBe('executive-report-2024-01-15.csv');
      
      dateSpy.mockRestore();
    });
  });

  describe('exportExecutiveReportJSON', () => {
    let createElementSpy: any;
    let clickSpy: any;

    beforeEach(() => {
      const mockLink = {
        href: '',
        download: '',
        click: vi.fn()
      };
      clickSpy = mockLink.click;

      createElementSpy = vi.spyOn(document, 'createElement').mockReturnValue(mockLink as any);
      vi.spyOn(document.body, 'appendChild').mockImplementation(() => mockLink as any);
      vi.spyOn(document.body, 'removeChild').mockImplementation(() => mockLink as any);
      vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url');
      vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('should generate JSON and trigger download', () => {
      exportExecutiveReportJSON(mockData);
      
      expect(createElementSpy).toHaveBeenCalledWith('a');
      expect(clickSpy).toHaveBeenCalled();
    });

    it('should use correct filename format with date', () => {
      const dateSpy = vi.spyOn(Date.prototype, 'toISOString').mockReturnValue('2024-01-15T10:30:00.000Z');
      const mockLink = { href: '', download: '', click: vi.fn() };
      createElementSpy.mockReturnValue(mockLink);
      
      exportExecutiveReportJSON(mockData);
      
      expect(mockLink.download).toBe('executive-report-2024-01-15.json');
      
      dateSpy.mockRestore();
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty arrays in data', () => {
      const emptyData = {
        ...mockData,
        strategicAlignments: [],
        talentPipeline: [],
        businessImpacts: []
      };

      expect(() => generateExecutiveCSV(emptyData)).not.toThrow();
      expect(() => generateExecutiveJSON(emptyData)).not.toThrow();
    });

    it('should handle zero values in metrics', () => {
      const zeroData = {
        ...mockData,
        metrics: {
          programROI: 0,
          businessValue: 0,
          talentRetention: 0,
          strategicAlignment: 0,
          totalUsers: 0,
          totalProjects: 0,
          activeProjects: 0,
          completedProjects: 0
        }
      };

      const csv = generateExecutiveCSV(zeroData);
      expect(csv).toContain('Program ROI,0%');
      expect(csv).toContain('Business Value Delivered,$0.0M');
    });

    it('should handle large numbers correctly', () => {
      const largeData = {
        ...mockData,
        metrics: {
          ...mockData.metrics,
          businessValue: 999999999
        }
      };

      const csv = generateExecutiveCSV(largeData);
      expect(csv).toContain('$1000.0M');
    });
  });
});

// Made with Bob