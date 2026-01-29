import { Grid, Column, Tile } from '@carbon/react';
import { UserMultiple, Folder, CheckmarkOutline, Time } from '@carbon/icons-react';

interface KpiData {
  totalUsers: number;
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
}

interface KpiTileProps {
  data: KpiData;
}

export default function KpiTile({ data }: KpiTileProps) {
  const kpis = [
    {
      title: 'Total Users',
      value: data.totalUsers,
      icon: UserMultiple,
      color: '#0f62fe',
      bgColor: 'rgba(15, 98, 254, 0.1)'
    },
    {
      title: 'Total Projects',
      value: data.totalProjects,
      icon: Folder,
      color: '#f1c21b',
      bgColor: 'rgba(241, 194, 27, 0.1)'
    },
    {
      title: 'Completed Projects',
      value: data.completedProjects,
      icon: CheckmarkOutline,
      color: '#24a148',
      bgColor: 'rgba(36, 161, 72, 0.1)'
    },
    {
      title: 'Active Projects',
      value: data.activeProjects,
      icon: Time,
      color: '#da1e28',
      bgColor: 'rgba(218, 30, 40, 0.1)'
    }
  ];

  return (
    <Grid fullWidth>
      {kpis.map((kpi, index) => (
        <Column key={index} lg={4} md={2} sm={1}>
          <Tile style={{
            padding: '1.5rem',
            minHeight: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              width: '100%'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '8px',
                backgroundColor: kpi.bgColor,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <kpi.icon
                  size={28}
                  style={{ color: kpi.color }}
                  aria-hidden="true"
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '0.875rem',
                  color: 'var(--cds-text-secondary)',
                  marginBottom: '0.25rem',
                  fontWeight: 400
                }}>
                  {kpi.title}
                </div>
                <div style={{
                  fontSize: '2rem',
                  fontWeight: 300,
                  color: 'var(--cds-text-primary)',
                  lineHeight: 1
                }}>
                  {kpi.value}
                </div>
              </div>
            </div>
          </Tile>
        </Column>
      ))}
    </Grid>
  );
}