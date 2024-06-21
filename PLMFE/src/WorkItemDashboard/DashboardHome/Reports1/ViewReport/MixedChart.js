import { Legend, Tooltip } from "chart.js";
import "chart.js/auto";

import React from "react";
import {
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
  ComposedChart,
  Area,
  Line,
  LabelList,
} from "recharts";

function MixedChart({ chartData }) {
  const totalValue = chartData.reduce((sum, entry) => sum + entry.count, 0);

  function renderCustomizedLabel(props) {
    const { x, y, width, value } = props;

    // Calculate the percentage
    const percentage = `${((value / totalValue) * 100).toFixed(2)}%`;

    return (
      <text
        x={x + width / 2}
        y={y}
        dy={-4}
        fill="black"
        fontSize={12}
        textAnchor="middle"
      >
        {percentage}
      </text>
    );
  }
  return (
    <ComposedChart
      width={800}
      height={400}
      data={chartData}
      margin={{ bottom: 90, right: 120 }}
    >
      <XAxis
        dataKey="type"
        angle={25}
        textAnchor="start"
        tick={{ fontSize: 9 }}
      />
      <YAxis />
      <Tooltip />
      <Legend verticalAlign="top" height={36} />
      <CartesianGrid stroke="#f5f5f5" />
      <Area type="monotone" dataKey="count" fill="#8884d8" stroke="#8884d8" />
      <Bar dataKey="count" barSize={20} fill="#413ea0">
        <LabelList
          dataKey="count"
          position="top"
          content={renderCustomizedLabel}
        />
      </Bar>
      <Line type="monotone" dataKey="count" stroke="#ff7300" />
    </ComposedChart>
  );
}

export default MixedChart;
