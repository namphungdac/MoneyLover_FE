import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const colors = [
    '#335C5C', '#45D6AB', '#2CC6EA', '#EFF04A', '#E06D50', '#DFAF7F', '#FF2C2C', '#2F8D85', '#bd8452', '#2CC6D5', '#1A2728',
    '#335C5C', '#45D6AB', '#2CC6EA', '#EFF04A', '#E06D50', '#DFAF7F', '#FF2C2C', '#2F8D85', '#bd8452', '#2CC6D5', '#1A2728'
];

export default function DoughnutChartExpense({ data }) {

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5 + 51;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        const radius1 = innerRadius + (outerRadius - innerRadius) * 1 + 60;
        const x1 = cx + radius1 * Math.cos(-midAngle * RADIAN);
        const y1 = cy + radius1 * Math.sin(-midAngle * RADIAN);

        return (
            <>  
                <image
                    x={x - 14}
                    y={y - 14}
                    width={28}
                    height={28}
                    xlinkHref={data?.listExpense[index].icon}
                />
                <text x={x1-1} y={y1-6} dy={10} textAnchor="middle" fill={colors[index]} className="text-xs font-semibold">{(Math.abs(data?.listExpense[index].totalAmount / data?.totalExpense)* 100).toFixed(1)}%</text>
            </>
        );
    };

    return (
        <div style={{ pointerEvents: 'none' }}>
            <PieChart width={300} height={300} margin={{ top: 30, right: 30, bottom: 30, left: 30 }}>
                <Pie
                    data={data?.listExpense}
                    cx={125}
                    cy={125}
                    innerRadius={35}
                    outerRadius={70}
                    dataKey="totalAmount"
                    labelLine={true}
                    label={renderCustomizedLabel}
                >
                    {data?.listExpense && data.listExpense.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={colors[index]} stroke="none" />
                    ))}
                </Pie>
            </PieChart >
        </div>
    );
}