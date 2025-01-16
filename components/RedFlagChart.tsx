import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, ScatterController, LinearScale, PointElement, Tooltip, Legend, Title } from 'chart.js';

ChartJS.register(
  ScatterController,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title
);

type RedFlagClause = {
  clause: string;
  finalText: string;
  riskScore: number;
  x: number;
  y: number;
};

type RedFlagChartProps = {
  data: RedFlagClause[];
};

const RedFlagChart: React.FC<RedFlagChartProps> = ({ data }) => {
  const chartData = {
    datasets: [
      {
        label: 'Red Flag Clauses',
        data: data.map(clause => ({ x: clause.x, y: clause.y })),
        backgroundColor: 'rgba(255, 0, 0, 1)',
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1,
        pointRadius: 3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Red Flag Clauses Scatter Plot',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const clause = data[context.dataIndex];
            return [
              `Clause: ${clause.clause}`,
              `Final Text: ${clause.finalText}`,
              `Risk Score: ${clause.riskScore}`,
            ];
          },
        },
      },
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'X Coordinate',
        },
        grid: {
                      color: 'rgba(255, 255, 255, 0.1)', // lighter grid lines
        },
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
      },
      y: {
        title: {
          display: true,
          text: 'Y Coordinate',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)', // lighter grid lines
        },
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
      },
    },
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  };

  return <Scatter data={chartData} options={options} />;
};

export default RedFlagChart; 