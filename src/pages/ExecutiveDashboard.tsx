import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  ProgressBar,
  OverflowMenu,
  OverflowMenuItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Loading,
} from '@carbon/react';
import {
  ArrowUp,
  ArrowDown,
  ChartLine,
  UserMultiple,
  Currency,
  Checkmark,
  Warning,
  Analytics,
  Dashboard,
  Report,
  Settings,
  Download,
} from '@carbon/icons-react';
import type { CarbonIconType } from '@carbon/icons-react';
import { useExecutiveMetrics } from '@/hooks/useExecutiveMetrics';
import ExecutiveSettingsModal from '@/components/carbon/ExecutiveSettingsModal';
import AnalyticsModal from '@/components/carbon/AnalyticsModal';
import { exportExecutiveReportCSV, exportExecutiveReportJSON } from '@/utils/reportGenerator';
import './ExecutiveDashboard.scss';

interface ExecutiveMetric {
  label: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: CarbonIconType;
  color: 'green' | 'red' | 'blue' | 'purple';
}

interface StrategicAlignment {
  initiative: string;
  projects: number;
  talent: number;
  completion: number;
  impact: 'high' | 'medium' | 'low';
}

interface TalentPipeline {
  stage: string;
  count: number;
  conversion: number;
}

interface BusinessImpact {
  category: string;
  value: string;
  trend: number;
  projects: number;
}

const ExecutiveDashboard: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const {
    metrics,
    strategicAlignments,
    talentPipeline,
    businessImpacts,
    loading,
    error,
    refetch,
  } = useExecutiveMetrics();

  // Handle export report
  const handleExportReport = (format: 'csv' | 'json') => {
    if (!metrics) return;
    
    const reportData = {
      metrics,
      strategicAlignments,
      talentPipeline,
      businessImpacts,
      generatedAt: new Date().toISOString(),
    };

    if (format === 'csv') {
      exportExecutiveReportCSV(reportData);
    } else {
      exportExecutiveReportJSON(reportData);
    }
  };

  // Executive KPIs - now using real data
  const executiveMetrics: ExecutiveMetric[] = metrics ? [
    {
      label: 'Program ROI',
      value: `${metrics.programROI}%`,
      change: 23,
      trend: 'up',
      icon: Currency,
      color: 'green',
    },
    {
      label: 'Business Value Delivered',
      value: `$${(metrics.businessValue / 1000000).toFixed(1)}M`,
      change: 18,
      trend: 'up',
      icon: ChartLine,
      color: 'blue',
    },
    {
      label: 'Talent Retention',
      value: `${metrics.talentRetention}%`,
      change: 5,
      trend: 'up',
      icon: UserMultiple,
      color: 'green',
    },
    {
      label: 'Strategic Alignment',
      value: `${metrics.strategicAlignment}%`,
      change: 12,
      trend: 'up',
      icon: Checkmark,
      color: 'purple',
    },
  ] : [];

  // Data is now loaded from the hook

  // Risk Indicators
  const riskIndicators = [
    { risk: 'Attrition Risk', level: 'low', count: 12, trend: 'down' },
    { risk: 'Skills Gap', level: 'medium', count: 34, trend: 'stable' },
    { risk: 'Budget Overrun', level: 'low', count: 3, trend: 'down' },
    { risk: 'Project Delays', level: 'medium', count: 8, trend: 'up' },
  ];

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'green';
      case 'medium':
        return 'blue';
      case 'low':
        return 'gray';
      default:
        return 'gray';
    }
  };

  const getRiskColor = (level: string): 'green' | 'red' | 'gray' | 'magenta' | 'purple' | 'blue' | 'cyan' | 'teal' | 'cool-gray' | 'warm-gray' | 'high-contrast' | 'outline' => {
    switch (level) {
      case 'low':
        return 'green';
      case 'medium':
        return 'cyan';
      case 'high':
        return 'red';
      default:
        return 'gray';
    }
  };

  if (loading) {
    return (
      <div className="executive-dashboard-loading">
        <Loading description="Loading executive insights..." withOverlay={false} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="executive-dashboard">
        <div className="executive-dashboard__header">
          <h1>Executive Dashboard</h1>
          <p className="executive-dashboard__subtitle" style={{ color: 'var(--cds-support-error)' }}>
            Error loading metrics: {error}
          </p>
        </div>
      </div>
    );
  }

  if (!metrics) {
    return (
      <div className="executive-dashboard-loading">
        <Loading description="Loading executive insights..." withOverlay={false} />
      </div>
    );
  }

  return (
    <div className="executive-dashboard">
      <div className="executive-dashboard__header">
        <div>
          <h1>Executive Dashboard</h1>
          <p className="executive-dashboard__subtitle">
            Strategic insights and business impact for IBM's talent development program
          </p>
        </div>
        <div className="executive-dashboard__actions">
          <OverflowMenu
            renderIcon={Download}
            iconDescription="Export options"
            flipped
            size="lg"
          >
            <OverflowMenuItem
              itemText="Export as CSV"
              onClick={() => handleExportReport('csv')}
            />
            <OverflowMenuItem
              itemText="Export as JSON"
              onClick={() => handleExportReport('json')}
            />
          </OverflowMenu>
          <Button
            kind="primary"
            renderIcon={Analytics}
            onClick={() => setShowAnalytics(true)}
          >
            View Analytics
          </Button>
        </div>
      </div>

      {/* Executive KPIs */}
      <section className="executive-dashboard__kpis">
        <h2 className="section-title">Executive Summary</h2>
        <Grid>
          {executiveMetrics.map((metric, index) => (
            <Column key={index} lg={4} md={4} sm={4}>
              <Tile className={`executive-metric executive-metric--${metric.color}`}>
                <div className="executive-metric__icon">
                  {React.createElement(metric.icon, { size: 32 })}
                </div>
                <div className="executive-metric__content">
                  <div>
                    <p className="executive-metric__label">{metric.label}</p>
                    <h3 className="executive-metric__value">{metric.value}</h3>
                  </div>
                  <div className="executive-metric__change">
                    {metric.trend === 'up' ? (
                      <ArrowUp size={16} />
                    ) : (
                      <ArrowDown size={16} />
                    )}
                    <span>{metric.change}% vs last quarter</span>
                  </div>
                </div>
              </Tile>
            </Column>
          ))}
        </Grid>
      </section>

      {/* Tabbed Content */}
      <section className="executive-dashboard__tabs">
        <Tabs selectedIndex={selectedTab} onChange={(e) => setSelectedTab(e.selectedIndex)}>
          <TabList aria-label="Executive dashboard tabs" contained>
            <Tab>Strategic Alignment</Tab>
            <Tab>Business Impact</Tab>
            <Tab>Talent Pipeline</Tab>
            <Tab>Risk & Compliance</Tab>
          </TabList>
          <TabPanels>
            {/* Strategic Alignment Tab */}
            <TabPanel>
              <Grid narrow>
                <Column lg={16}>
                  <h3 className="tab-title">Strategic Initiative Alignment</h3>
                  <p className="tab-description">
                    Track how talent and projects align with IBM's strategic priorities
                  </p>
                </Column>
                <Column lg={16}>
                  <DataTable
                    rows={strategicAlignments.map((item, index) => ({
                      id: `${index}`,
                      ...item,
                    }))}
                    headers={[
                      { key: 'initiative', header: 'Strategic Initiative' },
                      { key: 'projects', header: 'Active Projects' },
                      { key: 'talent', header: 'Talent Assigned' },
                      { key: 'completion', header: 'Completion Rate' },
                      { key: 'impact', header: 'Business Impact' },
                    ]}
                  >
                    {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                      <TableContainer>
                        <Table {...getTableProps()}>
                          <TableHead>
                            <TableRow>
                              {headers.map((header) => (
                                <TableHeader {...getHeaderProps({ header })} key={header.key}>
                                  {header.header}
                                </TableHeader>
                              ))}
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {rows.map((row) => (
                              <TableRow {...getRowProps({ row })} key={row.id}>
                                {row.cells.map((cell) => {
                                  if (cell.info.header === 'completion') {
                                    return (
                                      <TableCell key={cell.id}>
                                        <div className="completion-cell">
                                          <ProgressBar
                                            value={cell.value}
                                            max={100}
                                            label={`${cell.value}%`}
                                            size="small"
                                          />
                                        </div>
                                      </TableCell>
                                    );
                                  }
                                  if (cell.info.header === 'impact') {
                                    return (
                                      <TableCell key={cell.id}>
                                        <Tag type={getImpactColor(cell.value)}>
                                          {cell.value.toUpperCase()}
                                        </Tag>
                                      </TableCell>
                                    );
                                  }
                                  return <TableCell key={cell.id}>{cell.value}</TableCell>;
                                })}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    )}
                  </DataTable>
                </Column>
              </Grid>
            </TabPanel>

            {/* Business Impact Tab */}
            <TabPanel>
              <Grid narrow>
                <Column lg={16}>
                  <h3 className="tab-title">Business Value & ROI</h3>
                  <p className="tab-description">
                    Quantifiable business outcomes from the talent development program
                  </p>
                </Column>
                {businessImpacts.map((impact, index) => (
                  <Column key={index} lg={8} md={4} sm={4}>
                    <Tile className="business-impact-tile">
                      <div className="business-impact-tile__header">
                        <h4>{impact.category}</h4>
                        <div className="business-impact-tile__trend">
                          <ArrowUp size={20} />
                          <span>{impact.trend}%</span>
                        </div>
                      </div>
                      <div className="business-impact-tile__value">{impact.value}</div>
                      <div className="business-impact-tile__footer">
                        <span>{impact.projects} projects contributing</span>
                      </div>
                    </Tile>
                  </Column>
                ))}
                <Column lg={16}>
                  <Tile className="roi-summary">
                    <h4>Program ROI Analysis</h4>
                    <div className="roi-summary__content">
                      <div className="roi-summary__item">
                        <span className="label">Total Investment</span>
                        <span className="value">$3.6M</span>
                      </div>
                      <div className="roi-summary__item">
                        <span className="label">Total Returns</span>
                        <span className="value">$12.4M</span>
                      </div>
                      <div className="roi-summary__item roi-summary__item--highlight">
                        <span className="label">Net ROI</span>
                        <span className="value">342%</span>
                      </div>
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Talent Pipeline Tab */}
            <TabPanel>
              <Grid narrow>
                <Column lg={16}>
                  <h3 className="tab-title">Talent Pipeline & Succession Planning</h3>
                  <p className="tab-description">
                    Track talent progression from intern/co-op to full-time employee
                  </p>
                </Column>
                <Column lg={16}>
                  <div className="talent-pipeline">
                    {talentPipeline.map((stage, index) => (
                      <div key={index} className="talent-pipeline__stage">
                        <div className="talent-pipeline__stage-header">
                          <h4>{stage.stage}</h4>
                          <span className="count">{stage.count}</span>
                        </div>
                        {stage.conversion > 0 && (
                          <div className="talent-pipeline__metrics">
                            <div className="metric">
                              <span className="label">Conversion Rate</span>
                              <ProgressBar
                                value={stage.conversion}
                                max={100}
                                label={`${stage.conversion}%`}
                                size="small"
                              />
                            </div>
                          </div>
                        )}
                        {index < talentPipeline.length - 1 && (
                          <div className="talent-pipeline__arrow">↓</div>
                        )}
                      </div>
                    ))}
                  </div>
                </Column>
                <Column lg={8}>
                  <Tile className="pipeline-insight">
                    <h4>Key Insights</h4>
                    <ul>
                      <li>87% of high performers accept full-time offers</li>
                      <li>48% of active talent identified as high performers</li>
                      <li>Strong conversion rate from candidates to offers</li>
                    </ul>
                  </Tile>
                </Column>
                <Column lg={8}>
                  <Tile className="pipeline-recommendations">
                    <h4>Recommendations</h4>
                    <ul>
                      <li>Increase early identification of high performers</li>
                      <li>Streamline offer process to improve acceptance</li>
                      <li>Develop retention programs for converted talent</li>
                    </ul>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Risk & Compliance Tab */}
            <TabPanel>
              <Grid narrow>
                <Column lg={16}>
                  <h3 className="tab-title">Risk Indicators & Compliance</h3>
                  <p className="tab-description">
                    Monitor program risks and ensure compliance with IBM policies
                  </p>
                </Column>
                {riskIndicators.map((indicator, index) => (
                  <Column key={index} lg={8} md={4} sm={4}>
                    <Tile className="risk-indicator">
                      <div className="risk-indicator__header">
                        <h4>{indicator.risk}</h4>
                        <Tag type={getRiskColor(indicator.level)}>
                          {indicator.level.toUpperCase()}
                        </Tag>
                      </div>
                      <div className="risk-indicator__count">
                        <span className="value">{indicator.count}</span>
                        <span className="label">cases identified</span>
                      </div>
                      <div className="risk-indicator__trend">
                        {indicator.trend === 'down' && (
                          <>
                            <ArrowDown size={16} />
                            <span>Decreasing</span>
                          </>
                        )}
                        {indicator.trend === 'up' && (
                          <>
                            <ArrowUp size={16} />
                            <span>Increasing</span>
                          </>
                        )}
                        {indicator.trend === 'stable' && <span>Stable</span>}
                      </div>
                    </Tile>
                  </Column>
                ))}
                <Column lg={16}>
                  <Tile className="compliance-summary">
                    <h4>Compliance Status</h4>
                    <Grid narrow>
                      <Column lg={4}>
                        <div className="compliance-item">
                          <Checkmark size={24} className="icon-success" />
                          <span>Labor Laws</span>
                        </div>
                      </Column>
                      <Column lg={4}>
                        <div className="compliance-item">
                          <Checkmark size={24} className="icon-success" />
                          <span>Data Privacy</span>
                        </div>
                      </Column>
                      <Column lg={4}>
                        <div className="compliance-item">
                          <Checkmark size={24} className="icon-success" />
                          <span>Equal Opportunity</span>
                        </div>
                      </Column>
                      <Column lg={4}>
                        <div className="compliance-item">
                          <Checkmark size={24} className="icon-success" />
                          <span>Safety Standards</span>
                        </div>
                      </Column>
                    </Grid>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </section>

      {/* Analytics Modal */}
      <AnalyticsModal
        open={showAnalytics}
        onClose={() => setShowAnalytics(false)}
        metrics={metrics}
        strategicAlignments={strategicAlignments}
        talentPipeline={talentPipeline}
        businessImpacts={businessImpacts}
      />
    </div>
  );
};

export default ExecutiveDashboard;

// Made with Bob
