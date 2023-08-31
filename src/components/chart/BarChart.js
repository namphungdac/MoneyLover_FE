import React from 'react';
import { Bar } from "react-chartjs-2";
import Chart from 'chart.js/auto';
import { useSelector } from 'react-redux';

const StackedBarChart = ({label}) => {
    const dataBarChart = useSelector(state => state.report.dataBarChart);

    const data = {
        labels: label,
        datasets: [
            {
                data: dataBarChart?.dataInCome,
                backgroundColor: '#22A1D3',
                maxBarThickness: 50,
            },
            {
                data: dataBarChart?.dataExpense,
                backgroundColor: '#F25A5A',
                maxBarThickness: 50,
            },
        ],
    };

    const options = {
        responsive: true,
        scales: {
            x: {
                border: {
                    display: false
                },
                stacked: true,
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 0,
                    minRotation: 0
                }
            },
            y: {
                border: {
                    display: false
                },
                stacked: true,
                ticks: {
                    maxTicksLimit: 8,
                    callback: function (value, index, values) {
                        if (value >= 0) {
                            if (Math.abs(value) <= 100) {
                                return value.toString();
                            } else if (Math.abs(value) <= 1000) {
                                return (value / 10).toString() + '0';
                            } else if (Math.abs(value) <= 10000) {
                                return (value / 100).toString() + '00';
                            } else if (Math.abs(value) <= 500000) {
                                return (Math.abs(value) / 1000).toString() + ' K';
                            } else if (Math.abs(value) <= 500000000) {
                                return (Math.abs(value) / 1000000).toString() + ' M';
                            } else return (Math.abs(value) / 1000000000).toString() + ' B';
                        } else {
                            if (Math.abs(value) <= 100) {
                                return -value.toString();
                            } else if (Math.abs(value) <= 1000) {
                                return -(value / 10).toString() + '0';
                            } else if (Math.abs(value) <= 10000) {
                                return -(value / 100).toString() + '00';
                            } else if (Math.abs(value) <= 500000) {
                                return -(Math.abs(value) / 1000).toString() + ' K';
                            } else if (Math.abs(value) <= 500000000) {
                                return -(Math.abs(value) / 1000000).toString() + ' M';
                            } else return -(Math.abs(value) / 1000000000).toString() + ' B';
                        }
                    },
                },
            },

        },
        plugins: {
            legend: {
                display: false 
            },
            datalabels: {
                display: false
            }
        }
    };

    return (
        <Bar data={data} options={options} />
    );
};

export default StackedBarChart;
