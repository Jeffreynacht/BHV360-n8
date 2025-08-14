"use client"

import { useEffect, useRef } from "react"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function RapportageGrafiek({ data, type }) {
  const chartRef = useRef(null)
  const chartInstance = useRef(null)

  useEffect(() => {
    // Cleanup previous chart instance
    if (chartInstance.current) {
      chartInstance.current.destroy()
    }

    if (!chartRef.current) return

    const ctx = chartRef.current.getContext("2d")

    let chartData = {}
    let chartOptions = {}

    if (type === "incidenten") {
      // Count incidents by type
      const typeCount = data.reduce((acc, incident) => {
        acc[incident.type] = (acc[incident.type] || 0) + 1
        return acc
      }, {})

      chartData = {
        labels: Object.keys(typeCount),
        datasets: [
          {
            label: "Aantal incidenten",
            data: Object.values(typeCount),
            backgroundColor: [
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    } else if (type === "oefeningen") {
      // Count exercises by type
      const typeCount = data.reduce((acc, oefening) => {
        acc[oefening.type] = (acc[oefening.type] || 0) + 1
        return acc
      }, {})

      chartData = {
        labels: Object.keys(typeCount),
        datasets: [
          {
            label: "Aantal oefeningen",
            data: Object.values(typeCount),
            backgroundColor: [
              "rgba(54, 162, 235, 0.6)",
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(54, 162, 235, 1)",
              "rgba(75, 192, 192, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    } else if (type === "inspecties") {
      // Count inspections by equipment type
      const apparatuurCount = data.reduce((acc, inspectie) => {
        acc[inspectie.apparatuur] = (acc[inspectie.apparatuur] || 0) + 1
        return acc
      }, {})

      chartData = {
        labels: Object.keys(apparatuurCount),
        datasets: [
          {
            label: "Aantal inspecties",
            data: Object.values(apparatuurCount),
            backgroundColor: [
              "rgba(75, 192, 192, 0.6)",
              "rgba(255, 99, 132, 0.6)",
              "rgba(54, 162, 235, 0.6)",
              "rgba(255, 206, 86, 0.6)",
              "rgba(153, 102, 255, 0.6)",
            ],
            borderColor: [
              "rgba(75, 192, 192, 1)",
              "rgba(255, 99, 132, 1)",
              "rgba(54, 162, 235, 1)",
              "rgba(255, 206, 86, 1)",
              "rgba(153, 102, 255, 1)",
            ],
            borderWidth: 1,
          },
        ],
      }
    }

    chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    }

    chartInstance.current = new Chart(ctx, {
      type: "pie",
      data: chartData,
      options: chartOptions,
    })

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy()
      }
    }
  }, [data, type])

  return (
    <div className="h-[200px]">
      <canvas ref={chartRef} />
    </div>
  )
}
