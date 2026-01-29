/**
 * Report Generator Utilities
 * Handles CSV and JSON export for Executive Dashboard
 */

interface ExecutiveReportData {
  metrics: any;
  strategicAlignments: any[];
  talentPipeline: any[];
  businessImpacts: any[];
  generatedAt: string;
}

/**
 * Generate CSV content from executive data
 */
export function generateExecutiveCSV(data: ExecutiveReportData): string {
  const lines: string[] = [];
  
  // Header
  lines.push('IBM Talent Development Program - Executive Report');
  lines.push(`Generated: ${data.generatedAt}`);
  lines.push('');
  
  // Executive Summary
  lines.push('EXECUTIVE SUMMARY');
  lines.push('Metric,Value');
  lines.push(`Program ROI,${data.metrics.programROI}%`);
  lines.push(`Business Value Delivered,$${(data.metrics.businessValue / 1000000).toFixed(1)}M`);
  lines.push(`Talent Retention,${data.metrics.talentRetention}%`);
  lines.push(`Strategic Alignment,${data.metrics.strategicAlignment}%`);
  lines.push(`Total Users,${data.metrics.totalUsers}`);
  lines.push(`Total Projects,${data.metrics.totalProjects}`);
  lines.push(`Active Projects,${data.metrics.activeProjects}`);
  lines.push(`Completed Projects,${data.metrics.completedProjects}`);
  lines.push('');
  
  // Strategic Alignment
  lines.push('STRATEGIC ALIGNMENT');
  lines.push('Initiative,Active Projects,Talent Assigned,Completion Rate,Business Impact');
  data.strategicAlignments.forEach(item => {
    lines.push(`"${item.initiative}",${item.projects},${item.talent},${item.completion}%,${item.impact.toUpperCase()}`);
  });
  lines.push('');
  
  // Talent Pipeline
  lines.push('TALENT PIPELINE');
  lines.push('Stage,Count,Conversion Rate');
  data.talentPipeline.forEach(item => {
    lines.push(`"${item.stage}",${item.count},${item.conversion}%`);
  });
  lines.push('');
  
  // Business Impact
  lines.push('BUSINESS IMPACT');
  lines.push('Category,Value,Trend,Contributing Projects');
  data.businessImpacts.forEach(item => {
    lines.push(`"${item.category}","${item.value}",+${item.trend}%,${item.projects}`);
  });
  
  return lines.join('\n');
}

/**
 * Generate JSON report
 */
export function generateExecutiveJSON(data: ExecutiveReportData): string {
  return JSON.stringify({
    report: 'IBM Talent Development Program - Executive Report',
    generatedAt: data.generatedAt,
    executiveSummary: {
      programROI: `${data.metrics.programROI}%`,
      businessValueDelivered: `$${(data.metrics.businessValue / 1000000).toFixed(1)}M`,
      talentRetention: `${data.metrics.talentRetention}%`,
      strategicAlignment: `${data.metrics.strategicAlignment}%`,
      totalUsers: data.metrics.totalUsers,
      totalProjects: data.metrics.totalProjects,
      activeProjects: data.metrics.activeProjects,
      completedProjects: data.metrics.completedProjects,
    },
    strategicAlignment: data.strategicAlignments,
    talentPipeline: data.talentPipeline,
    businessImpact: data.businessImpacts,
  }, null, 2);
}

/**
 * Download file to user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export executive report as CSV
 */
export function exportExecutiveReportCSV(data: ExecutiveReportData) {
  const csv = generateExecutiveCSV(data);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(csv, `executive-report-${timestamp}.csv`, 'text/csv;charset=utf-8;');
}

/**
 * Export executive report as JSON
 */
export function exportExecutiveReportJSON(data: ExecutiveReportData) {
  const json = generateExecutiveJSON(data);
  const timestamp = new Date().toISOString().split('T')[0];
  downloadFile(json, `executive-report-${timestamp}.json`, 'application/json;charset=utf-8;');
}

// Made with Bob
