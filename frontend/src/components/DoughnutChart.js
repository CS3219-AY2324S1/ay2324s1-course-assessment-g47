// Documentation: https://www.chartjs.org/docs/latest/charts/doughnut.html
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function DoughnutChart({ data }) {
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        const myChartRef = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(myChartRef, {
            type: 'doughnut',
            data: {
                labels: ['Easy', 'Medium', 'Hard'],
                datasets: [{
                    data: data, // use the data prop here
                    backgroundColor: [
                        'rgb(119, 221, 119)',
                        'rgb(255, 205, 86)',
                        'rgb(255, 99, 132)'
                    ],
                },]
            },options: {
                plugins: {
                    legend: {
                        position: 'bottom', // Position the legend at the bottom of the chart
                    }
                }
            }
        });
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        }
    }, [data])

    return (
        <div className="d-flex align-items-center" style={{ width: "100%", height:"100%"}}>
            <canvas ref={chartRef}/>
        </div>
    );
}
