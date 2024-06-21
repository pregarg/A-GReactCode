import { Chart, ArcElement, Legend, Tooltip } from "chart.js";
import "chart.js/auto";

import "./ViewReport.css";
import React from "react";

import { Card, Typography } from "@mui/material";
import DonutChart from "./DonutChart";
import MixedChart from "./MixedChart";

function ChartComponent({ data, chartDetails }) {
  const [chartData, setChartData] = React.useState([]);
  let fieldName = chartDetails?.Report["ChartProperties"]?.KeyField;
  console.log(fieldName, data);
  if (Object.keys(data[0]).includes(fieldName)) {
    console.log("true");
  } else {
    console.log("false");
  }

  function chartDataSorted() {
    const countData = data.reduce((acc, item) => {
      const fieldValue = item[fieldName];
      acc[fieldValue] = (acc[fieldValue] || 0) + 1;
      return acc;
    }, {});
    const dataArray = Object.keys(countData).map((type) => ({
      type,
      count: countData[type],
    }));

    dataArray.sort((a, b) => b.count - a.count);
    setChartData(dataArray);
  }
  console.log(chartData);
  React.useEffect(() => {
    chartDataSorted();
  }, []);
  return (
    <Card
      variant="outlined"
      sx={{
        ml: 1,
        mt: 1,
      }}
    >
      {Object?.keys(data[0])?.includes(fieldName) ? (
        <>
          <Typography padding="10px" variant="subtitle1">
            {chartDetails?.Report["ChartProperties"]?.ChartTitle}
          </Typography>
          {chartDetails?.Report["ChartType"]?.toLowerCase() === "donut" ? (
            <DonutChart chartData={chartData} />
          ) : chartDetails?.Report["ChartType"].toLowerCase() === "bar" ? (
            <MixedChart chartData={chartData} />
          ) : (
            "chart type not set"
          )}
        </>
      ) : (
        <Typography>Please Add Chart Configuration</Typography>
      )}
    </Card>
  );
}

export default ChartComponent;
