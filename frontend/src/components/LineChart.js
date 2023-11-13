// Documentation: https://www.chartjs.org/docs/latest/charts/doughnut.html
import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function LineChart({ data }) {
    console.log("data", data);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }
        const myChartRef = chartRef.current.getContext("2d");
        chartInstance.current = new Chart(myChartRef, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Daily completed question count',
                    data: data,
                    fill: false,
                    borderColor: 'rgb(75, 192, 192)',
                    tension: 0.1
                }]
            }
        });
        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        }
    }, [data])

    return (
        <div style={{ width: "250px", height: "250px" }}>
            <canvas ref={chartRef} />
        </div>
    );
}
