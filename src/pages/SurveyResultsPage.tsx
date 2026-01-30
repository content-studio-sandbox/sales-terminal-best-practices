import React from "react";
import { Grid, Column, Heading, Section } from "@carbon/react";
import { ChartBar, Analytics, UserMultiple } from "@carbon/icons-react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
} from 'chart.js';
import { Bar, Doughnut, Radar } from 'react-chartjs-2';
import { calculateInterestLevels, surveyResponses, topics } from '../data/surveyData';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler
);

export default function SurveyResultsPage() {
  const interestData = calculateInterestLevels();

  // Prepare data for stacked bar chart
  const stackedBarData = {
    labels: interestData.map(item => item.topic),
    datasets: [
      {
        label: 'Most Interested',
        data: interestData.map(item => item.counts["Most interested"]),
        backgroundColor: '#0f62fe',
      },
      {
        label: 'Interested',
        data: interestData.map(item => item.counts.interested),
        backgroundColor: '#4589ff',
      },
      {
        label: 'Some Interest',
        data: interestData.map(item => item.counts["some interest"]),
        backgroundColor: '#8ab4ff',
      },
      {
        label: 'Not Interested',
        data: interestData.map(item => item.counts["not interested"]),
        backgroundColor: '#d0e2ff',
      },
      {
        label: 'No Response',
        data: interestData.map(item => item.counts["no response"]),
        backgroundColor: '#e0e0e0',
      }
    ]
  };

  const stackedBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Interest Level Distribution by Topic',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          footer: (tooltipItems: any) => {
            const total = tooltipItems.reduce((sum: number, item: any) => sum + item.parsed.y, 0);
            return `Total: ${total} responses`;
          }
        }
      }
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: 'Number of Responses'
        }
      }
    }
  };

  // Average interest score bar chart
  const averageScoreData = {
    labels: interestData.map(item => item.topic),
    datasets: [
      {
        label: 'Average Interest Score',
        data: interestData.map(item => parseFloat(item.averageScore)),
        backgroundColor: interestData.map(item => {
          const score = parseFloat(item.averageScore);
          if (score >= 2.5) return '#24a148';
          if (score >= 2.0) return '#0f62fe';
          if (score >= 1.5) return '#ff832b';
          return '#da1e28';
        }),
      }
    ]
  };

  const averageScoreOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Average Interest Score by Topic (0-3 scale)',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            return `Score: ${context.parsed.y.toFixed(2)} / 3.00`;
          }
        }
      }
    },
    scales: {
      x: {
        ticks: {
          font: {
            size: 11
          }
        }
      },
      y: {
        beginAtZero: true,
        max: 3,
        title: {
          display: true,
          text: 'Average Score'
        },
        ticks: {
          callback: (value: any) => value.toFixed(1)
        }
      }
    }
  };

  // Top 3 most interested topics
  const sortedByMostInterested = [...interestData].sort(
    (a, b) => b.counts["Most interested"] - a.counts["Most interested"]
  ).slice(0, 3);

  const topTopicsData = {
    labels: sortedByMostInterested.map(item => item.topic),
    datasets: [{
      data: sortedByMostInterested.map(item => item.counts["Most interested"]),
      backgroundColor: ['#0f62fe', '#4589ff', '#8ab4ff'],
      borderWidth: 2,
      borderColor: '#ffffff'
    }]
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
      },
      title: {
        display: true,
        text: 'Top 3 Topics - "Most Interested" Responses',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    }
  };

  // Radar chart for overall interest comparison
  const radarData = {
    labels: interestData.map(item => item.topic),
    datasets: [
      {
        label: 'Average Interest Level',
        data: interestData.map(item => parseFloat(item.averageScore)),
        backgroundColor: 'rgba(15, 98, 254, 0.2)',
        borderColor: '#0f62fe',
        borderWidth: 2,
        pointBackgroundColor: '#0f62fe',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: '#0f62fe'
      }
    ]
  };

  const radarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Interest Level Comparison Across Topics',
        font: {
          size: 16,
          weight: 'bold' as const
        }
      }
    },
    scales: {
      r: {
        beginAtZero: true,
        max: 3,
        ticks: {
          stepSize: 0.5
        }
      }
    }
  };

  return (
    <Grid fullWidth className="page-container">
      <Column lg={16} md={8} sm={4}>
        {/* Header */}
        <Section level={2} style={{ marginBottom: "2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
            <Analytics size={32} style={{ color: "#0f62fe" }} />
            <Heading style={{ margin: 0 }}>FSM Technical Training Survey Results</Heading>
          </div>
          <p style={{ fontSize: "1.125rem", color: "#525252", maxWidth: "900px", lineHeight: 1.6 }}>
            Analysis of {surveyResponses.length} survey responses collected to understand interest levels 
            in various technical training topics for the FSM team.
          </p>
        </Section>

        {/* Key Metrics */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "1rem",
            marginBottom: "2rem"
          }}>
            <div style={{
              backgroundColor: "#e8f4ff",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #0f62fe"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <UserMultiple size={24} style={{ color: "#0f62fe" }} />
                <h3 style={{ margin: 0, fontSize: "0.875rem", color: "#525252" }}>Total Responses</h3>
              </div>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: 600, color: "#0f62fe" }}>
                {surveyResponses.length}
              </p>
            </div>

            <div style={{
              backgroundColor: "#e8f4ff",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #0f62fe"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <ChartBar size={24} style={{ color: "#0f62fe" }} />
                <h3 style={{ margin: 0, fontSize: "0.875rem", color: "#525252" }}>Topics Surveyed</h3>
              </div>
              <p style={{ margin: 0, fontSize: "2rem", fontWeight: 600, color: "#0f62fe" }}>
                {topics.length}
              </p>
            </div>

            <div style={{
              backgroundColor: "#defbe6",
              padding: "1.5rem",
              borderRadius: "8px",
              border: "1px solid #24a148"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <ChartBar size={24} style={{ color: "#24a148" }} />
                <h3 style={{ margin: 0, fontSize: "0.875rem", color: "#525252" }}>Top Interest Topic</h3>
              </div>
              <p style={{ margin: 0, fontSize: "1.25rem", fontWeight: 600, color: "#24a148" }}>
                {sortedByMostInterested[0].topic}
              </p>
              <p style={{ margin: 0, fontSize: "0.875rem", color: "#525252" }}>
                {sortedByMostInterested[0].counts["Most interested"]} "Most Interested"
              </p>
            </div>
          </div>
        </Section>

        {/* Stacked Bar Chart */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
          }}>
            <div style={{ height: "500px" }}>
              <Bar data={stackedBarData} options={stackedBarOptions} />
            </div>
          </div>
        </Section>

        {/* Two Column Layout for Average Score and Top Topics */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
            gap: "2rem"
          }}>
            {/* Average Score Chart */}
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}>
              <div style={{ height: "400px" }}>
                <Bar data={averageScoreData} options={averageScoreOptions} />
              </div>
            </div>

            {/* Top 3 Topics Doughnut */}
            <div style={{
              backgroundColor: "#ffffff",
              padding: "2rem",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
            }}>
              <div style={{ height: "400px" }}>
                <Doughnut data={topTopicsData} options={doughnutOptions} />
              </div>
            </div>
          </div>
        </Section>

        {/* Radar Chart */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
          }}>
            <div style={{ height: "500px", maxWidth: "700px", margin: "0 auto" }}>
              <Radar data={radarData} options={radarOptions} />
            </div>
          </div>
        </Section>

        {/* Detailed Statistics Table */}
        <Section level={3} style={{ marginBottom: "3rem" }}>
          <div style={{
            backgroundColor: "#ffffff",
            padding: "2rem",
            borderRadius: "8px",
            border: "1px solid #e0e0e0",
            boxShadow: "0 2px 6px rgba(0,0,0,0.05)"
          }}>
            <h3 style={{ marginTop: 0, marginBottom: "1.5rem", fontSize: "1.25rem", fontWeight: 600 }}>
              Detailed Statistics by Topic
            </h3>
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "0.875rem"
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#f4f4f4", borderBottom: "2px solid #e0e0e0" }}>
                    <th style={{ padding: "1rem", textAlign: "left", fontWeight: 600 }}>Topic</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600 }}>Most Interested</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600 }}>Interested</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600 }}>Some Interest</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600 }}>Not Interested</th>
                    <th style={{ padding: "1rem", textAlign: "center", fontWeight: 600 }}>Avg Score</th>
                  </tr>
                </thead>
                <tbody>
                  {interestData.map((item, index) => (
                    <tr key={index} style={{ borderBottom: "1px solid #e0e0e0" }}>
                      <td style={{ padding: "1rem", fontWeight: 500 }}>{item.topic}</td>
                      <td style={{ padding: "1rem", textAlign: "center", color: "#0f62fe", fontWeight: 600 }}>
                        {item.counts["Most interested"]}
                      </td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>{item.counts.interested}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>{item.counts["some interest"]}</td>
                      <td style={{ padding: "1rem", textAlign: "center" }}>{item.counts["not interested"]}</td>
                      <td style={{
                        padding: "1rem",
                        textAlign: "center",
                        fontWeight: 600,
                        color: parseFloat(item.averageScore) >= 2.5 ? "#24a148" :
                               parseFloat(item.averageScore) >= 2.0 ? "#0f62fe" :
                               parseFloat(item.averageScore) >= 1.5 ? "#ff832b" : "#da1e28"
                      }}>
                        {item.averageScore}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </Section>

        {/* Key Insights */}
        <Section level={3} style={{
          backgroundColor: "#e8f4ff",
          padding: "2rem",
          borderRadius: "8px",
          marginBottom: "2rem"
        }}>
          <h3 style={{ marginTop: 0, color: "#0f62fe", marginBottom: "1rem" }}>📊 Key Insights</h3>
          <ul style={{ color: "#161616", lineHeight: 1.8, margin: 0 }}>
            <li>
              <strong>{sortedByMostInterested[0].topic}</strong> received the highest number of "Most Interested" 
              responses ({sortedByMostInterested[0].counts["Most interested"]} responses)
            </li>
            <li>
              Average interest scores range from {Math.min(...interestData.map(i => parseFloat(i.averageScore))).toFixed(2)} 
              to {Math.max(...interestData.map(i => parseFloat(i.averageScore))).toFixed(2)} out of 3.00
            </li>
            <li>
              {interestData.filter(i => parseFloat(i.averageScore) >= 2.0).length} out of {topics.length} topics 
              have an average score of 2.0 or higher (indicating strong interest)
            </li>
            <li>
              Response rate was high with {surveyResponses.length} participants providing feedback across all topics
            </li>
          </ul>
        </Section>
      </Column>
    </Grid>
  );
}

// Made with Bob
