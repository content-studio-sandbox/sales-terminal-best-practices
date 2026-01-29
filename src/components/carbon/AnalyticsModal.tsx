import React from 'react';
import {
  Modal,
  Grid,
  Column,
  Tile,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
} from '@carbon/react';
import {
  ChartLine,
  UserMultiple,
  Currency,
  Checkmark,
} from '@carbon/icons-react';
import './AnalyticsModal.scss';

interface AnalyticsModalProps {
  open: boolean;
  onClose: () => void;
  metrics: any;
  strategicAlignments: any[];
  talentPipeline: any[];
  businessImpacts: any[];
}

const AnalyticsModal: React.FC<AnalyticsModalProps> = ({
  open,
  onClose,
  metrics,
  strategicAlignments,
  talentPipeline,
  businessImpacts,
}) => {
  if (!metrics) return null;

  const detailedMetrics = [
    {
      category: 'Program Performance',
      metrics: [
        { label: 'Program ROI', value: `${metrics.programROI}%`, icon: Currency, color: 'green' },
        { label: 'Business Value', value: `$${(metrics.businessValue / 1000000).toFixed(1)}M`, icon: ChartLine, color: 'blue' },
        { label: 'Strategic Alignment', value: `${metrics.strategicAlignment}%`, icon: Checkmark, color: 'purple' },
      ],
    },
    {
      category: 'Talent Metrics',
      metrics: [
        { label: 'Total Users', value: metrics.totalUsers, icon: UserMultiple, color: 'cyan' },
        { label: 'Assigned Users', value: metrics.assignedUsers, icon: UserMultiple, color: 'teal' },
        { label: 'Talent Retention', value: `${metrics.talentRetention}%`, icon: Checkmark, color: 'green' },
        { label: 'High Performers', value: metrics.highUtilization, icon: UserMultiple, color: 'magenta' },
      ],
    },
    {
      category: 'Project Metrics',
      metrics: [
        { label: 'Total Projects', value: metrics.totalProjects, icon: ChartLine, color: 'blue' },
        { label: 'Active Projects', value: metrics.activeProjects, icon: ChartLine, color: 'cyan' },
        { label: 'Completed Projects', value: metrics.completedProjects, icon: Checkmark, color: 'green' },
        { label: 'Completion Rate', value: `${metrics.totalProjects > 0 ? Math.round((metrics.completedProjects / metrics.totalProjects) * 100) : 0}%`, icon: ChartLine, color: 'purple' },
      ],
    },
  ];

  return (
    <Modal
      open={open}
      onRequestClose={onClose}
      modalHeading="Detailed Analytics"
      modalLabel="Executive Dashboard"
      passiveModal
      size="lg"
      className="analytics-modal"
    >
      <div className="analytics-modal__content">
        {/* Detailed Metrics Grid */}
        <section className="analytics-section">
          <h3>Performance Metrics</h3>
          <Grid narrow>
            {detailedMetrics.map((category, idx) => (
              <Column key={idx} lg={16} md={8} sm={4}>
                <Tile className="analytics-category-tile">
                  <h4 className="category-title">{category.category}</h4>
                  <Grid narrow>
                    {category.metrics.map((metric, midx) => (
                      <Column key={midx} lg={4} md={4} sm={2}>
                        <div className={`analytics-metric analytics-metric--${metric.color}`}>
                          <div className="analytics-metric__icon">
                            {React.createElement(metric.icon, { size: 24 })}
                          </div>
                          <div className="analytics-metric__content">
                            <p className="analytics-metric__label">{metric.label}</p>
                            <h4 className="analytics-metric__value">{metric.value}</h4>
                          </div>
                        </div>
                      </Column>
                    ))}
                  </Grid>
                </Tile>
              </Column>
            ))}
          </Grid>
        </section>

        {/* Strategic Alignment Details */}
        <section className="analytics-section">
          <h3>Strategic Alignment Breakdown</h3>
          <DataTable
            rows={strategicAlignments.map((item, index) => ({
              id: `${index}`,
              ...item,
            }))}
            headers={[
              { key: 'initiative', header: 'Initiative' },
              { key: 'projects', header: 'Projects' },
              { key: 'talent', header: 'Talent' },
              { key: 'completion', header: 'Completion' },
              { key: 'impact', header: 'Impact' },
            ]}
          >
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <TableContainer>
                <Table {...getTableProps()} size="md">
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
                                {cell.value}%
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'impact') {
                            const getColor = (impact: string) => {
                              switch (impact) {
                                case 'high': return 'green';
                                case 'medium': return 'blue';
                                case 'low': return 'gray';
                                default: return 'gray';
                              }
                            };
                            return (
                              <TableCell key={cell.id}>
                                <Tag type={getColor(cell.value)}>
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
        </section>

        {/* Talent Pipeline Details */}
        <section className="analytics-section">
          <h3>Talent Pipeline Analysis</h3>
          <DataTable
            rows={talentPipeline.map((item, index) => ({
              id: `${index}`,
              ...item,
            }))}
            headers={[
              { key: 'stage', header: 'Pipeline Stage' },
              { key: 'count', header: 'Count' },
              { key: 'conversion', header: 'Conversion Rate' },
            ]}
          >
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <TableContainer>
                <Table {...getTableProps()} size="md">
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
                          if (cell.info.header === 'conversion') {
                            return (
                              <TableCell key={cell.id}>
                                {cell.value > 0 ? `${cell.value}%` : 'N/A'}
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
        </section>

        {/* Business Impact Details */}
        <section className="analytics-section">
          <h3>Business Impact Summary</h3>
          <DataTable
            rows={businessImpacts.map((item, index) => ({
              id: `${index}`,
              ...item,
            }))}
            headers={[
              { key: 'category', header: 'Category' },
              { key: 'value', header: 'Value' },
              { key: 'trend', header: 'Trend' },
              { key: 'projects', header: 'Contributing Projects' },
            ]}
          >
            {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
              <TableContainer>
                <Table {...getTableProps()} size="md">
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
                          if (cell.info.header === 'trend') {
                            return (
                              <TableCell key={cell.id}>
                                <Tag type="green">+{cell.value}%</Tag>
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
        </section>
      </div>
    </Modal>
  );
};

export default AnalyticsModal;

// Made with Bob
