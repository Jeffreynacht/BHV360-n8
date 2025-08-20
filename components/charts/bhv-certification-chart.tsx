"use client"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
} from "chart.js"
import { Bar, Doughnut, Line } from "react-chartjs-2"

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, LineElement, PointElement)

interface BHVCertificationChartProps {
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      backgroundColor: string[]
      borderColor?: string[]
    }[]
  }
  type: "bar" | "doughnut" | "line"
  title: string
}

export function BHVCertificationChart({ data, type, title }: BHVCertificationChartProps) {
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales:
      type !== "doughnut"
        ? {
            y: {
              beginAtZero: true,
            },
          }
        : undefined,
  }

  const renderChart = () => {
    switch (type) {
      case "bar":
        return <Bar data={data} options={options} />
      case "doughnut":
        return <Doughnut data={data} options={options} />
      case "line":
        return <Line data={data} options={options} />
      default:
        return <Bar data={data} options={options} />
    }
  }

  return <div className="w-full h-64">{renderChart()}</div>
}
