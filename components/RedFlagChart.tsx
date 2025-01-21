import React from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, ScatterController, LinearScale, PointElement, Tooltip, Legend, Title, ChartOptions } from 'chart.js';

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
  riskLevel: string;
};

type RedFlagChartProps = {
  data: RedFlagClause[];
};

const RedFlagChart: React.FC<RedFlagChartProps> = ({ data }) => {
  const highRiskData = data.filter(clause => clause.riskLevel === 'High');
  const mediumRiskData = data.filter(clause => clause.riskLevel === 'Medium');
  const lowRiskData = data.filter(clause => clause.riskLevel === 'Low');
  const chartData = {
    datasets: [
      {
        label: 'High Flag Clauses',
        data: highRiskData.map(clause => ({ x: clause.x, y: clause.y })),
        backgroundColor: 'rgba(255, 0, 0, 1)',
        borderColor: 'rgba(255, 0, 0, 1)',
        borderWidth: 1,
        pointRadius: 3,
      },
      {
        label: 'Medium Flag Clauses',
        data: mediumRiskData.map(clause => ({ x: clause.x, y: clause.y })),
        backgroundColor: 'rgba(255, 255, 0, 1)',
        borderColor: 'rgba(255, 255, 0, 1)',
        borderWidth: 1,
        pointRadius: 3,
      },
      {
        label: 'Low Flag Clauses',
        data: lowRiskData.map(clause => ({ x: clause.x, y: clause.y })),
        backgroundColor: 'rgba(0, 255, 0, 1)',
        borderColor: 'rgba(0, 255, 0, 1)',
        borderWidth: 1,
        pointRadius: 3,
      },
    ],
  };

  const options : ChartOptions<'scatter'> = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Risk Analysis Scatter Plot',
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const datasetIndex = context.datasetIndex;
            let clause;
            switch(datasetIndex) {
              case 0:
                clause = highRiskData[context.dataIndex];
                break;
              case 1:
                clause = mediumRiskData[context.dataIndex];
                break;
              case 2:
                clause = lowRiskData[context.dataIndex];
                break;
              default:
                return [];
            }
            return [
              `Risk Level: ${clause.riskLevel}`,
              `Clause: ${clause.clause}`,
              `Final Text: ${clause.finalText}`,
              `Risk Score: ${clause.riskScore.toFixed(2)}%`,
            ];
          },
        },
      },
      legend: {
        display: true,
      },
    },
    scales: {
      x: {

        title: {
          display: true,
          text: 'Probability',
        },
        border: {
          dash: [4, 4],
          display: true,
        },
        grid: {
          color: '#aaa',
          tickColor: '#000', // for the tick mark
          tickBorderDash: [2, 3], // also for the tick, if long enough
          tickLength: 10, // just to see the dotted line
          tickWidth: 2,
          offset: true,
          drawTicks: true, // true is default 
          drawOnChartArea: true // true is default 
          // color: 'rgba(255, 255, 255, 0.1)',
                       // lighter grid lines
        },
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
        position: 'bottom',
        min: 0,
        suggestedMax: 10,
      },
      y: {
        title: {
          display: true,
          text: 'Financial Impact',
        },
        border:{
          dash: [5, 5],
          display: true,
        },
        grid: {
          // color: 'rgba(255, 255, 255, 0.1)', // lighter grid lines
          color: '#aaa',
          tickColor: '#000', // for the tick mark
          tickBorderDash: [2, 3], // also for the tick, if long enough
          tickLength: 10, // just to see the dotted line
          tickWidth: 2,
          offset: true,
          drawTicks: true, // true is default 
          drawOnChartArea: true
        },
        backgroundColor: 'rgba(128, 128, 128, 0.2)',
        position: 'left',
        min: 0,
        suggestedMax: 10,
      },
    },
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
  };

  return <Scatter data={chartData} options={options} />;
};

export default RedFlagChart; 