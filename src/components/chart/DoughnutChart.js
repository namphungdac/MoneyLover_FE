// import React from 'react';
// import { Doughnut } from "react-chartjs-2";
// import Chart from 'chart.js/auto';

// import PieChartOutlabelsPlugin from '@energiency/chartjs-plugin-piechart-outlabels';
// Chart.register(PieChartOutlabelsPlugin);

// let dataChart = [
//     { value: 30, icon: 'https://static.moneylover.me/img/icon/ic_category_foodndrink.png' },
//     { value: 20, icon: 'https://static.moneylover.me/img/icon/ic_category_foodndrink.png' },
//     { value: 40, icon: 'https://static.moneylover.me/img/icon/ic_category_foodndrink.png' },
//     { value: 10, icon: 'https://static.moneylover.me/img/icon/ic_category_foodndrink.png' },
// ];

// const DoughnutChart = () => {
//     const backgroundColors = ['#335C5C', '#45D6AB', '#2CC6EA', '#1A2728', '#E06D50', '#EFF9F1', '#9AB89A', '#2F8D85', '#BD8452', '#2CC6D5'];
//     const data = {
//         labels: dataChart.map(item => item.label),
//         datasets: [
//             {
//                 // labels: dataChart.map(item => item.icon),
//                 data: dataChart.map(item => item.value),
//                 backgroundColor: backgroundColors,
//                 borderColor: backgroundColors,
//                 borderWidth: 0
//             },
//         ],
//     };




//     const options = {
//         layout: {
//             padding: 55
//         },
//         cutout: '50%',
//         responsive: true,
//         maintainAspectRatio: false,
//         plugins: {
//             legend: {
//                 display: false
//             },
//             tooltip: {
//                 enabled: false,
//             },
//             outlabels: {
//                 text: '%l ',
//                 display: true,
//                 color: 'black',
//                 stretch: 20,
//                 backgroundColor: (context) => backgroundColors[context.dataIndex]
//             },
//         },
//     };

//     return (
//         <>
//             <Doughnut data={data} options={options} />
//         </>
//     );
// };

// export default DoughnutChart;



import React from "react";
import { PieChart, Pie, Cell } from "recharts";



const colors = [
    '#335C5C', '#45D6AB', '#2CC6EA', '#EFF04A', '#E06D50', '#DFAF7F', '#FF2C2C', '#2F8D85', '#bd8452', '#2CC6D5', '#1A2728',
    '#335C5C', '#45D6AB', '#2CC6EA', '#EFF04A', '#E06D50', '#DFAF7F', '#FF2C2C', '#2F8D85', '#bd8452', '#2CC6D5', '#1A2728'
];
// let dataChart = [
//     { value: 30, icon: 'https://static.moneylover.me/img/icon/ic_category_foodndrink.png', color: '#335C5C' },
//     { value: 20, icon: 'https://static.moneylover.me/img/icon/ic_category_foodndrink.png', color: '#45D6AB' },
//     { value: 40, icon: 'https://static.moneylover.me/img/icon/ic_category_foodndrink.png', color: '#2CC6EA' },
//     { value: 10, icon: 'https://static.moneylover.me/img/icon/ic_category_foodndrink.png', color: '#1A2728' },
// ];

export default function DoughnutChart({ data }) {
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 35;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        return (
            <>
                <image
                    x={x - 10}
                    y={y - 10}
                    width={20}
                    height={20}
                    xlinkHref={data[index].icon}
                />
                {/* <text x={20} y={0} dy={16} textAnchor="middle" fill="#666">{value}</text> */}
            </>
        );
    };

    return (
        <div style={{ pointerEvents: 'none' }}>
            <PieChart width={170} height={170} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <Pie
                    data={data}
                    cx={60}
                    cy={60}
                    innerRadius={24}
                    outerRadius={44}
                    dataKey="totalAmount"
                    labelLine={true}
                    // label={(props) => <renderCustomizedLabel {...props} icon={dataChart[props.index].icon} />}
                    label={renderCustomizedLabel}
                // stroke="#1a2728"
                // strokeWidth={2}
                >
                    {data && data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} stroke="none" />
                    ))}
                </Pie>
            </PieChart >
        </div>
    );
}