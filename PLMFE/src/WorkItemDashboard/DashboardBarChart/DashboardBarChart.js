import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

export default function DashboardBarChart(prop) {
  const colors = [
    "#F44336",
    "#E91E63",
    "#9C27B0",
    "#F75D59",
    "#EB5406",
    "#797979",
    "#488AC7",
    "#5E5A80",
    "#227442",
    "#045D5D",
  ];

  const [chartState, setChartState] = useState({
    series: [
      {
        name: "Case Count",
        data: [],
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        events: {
          dataPointSelection: function (chart, w, e) {
            const clickedIndex = e.dataPointIndex;
            console.log("Clicked on chart datapointindex: ", clickedIndex);
            console.log("pravgriddata",prop)
            if (clickedIndex !== -1) {
              const stageName = prop.gridData[clickedIndex]["STAGENAME"];
              const flowId = prop.gridData[clickedIndex]["FLOWID"];
              prop.dashboardTableData(stageName, flowId);
            }
          },
          xAxisLabelClick: function (event, chartContext, config) {
            const clickedIndex = config.labelIndex;
            if (clickedIndex !== -1) {
              const stageName = prop.gridData[clickedIndex]["STAGENAME"];
              const flowId = prop.gridData[clickedIndex]["FLOWID"];
              prop.dashboardTableData(stageName, flowId);
            }
          },
        },
      },
      colors: colors,
      plotOptions: {
        bar: {
          columnWidth: "45%",
          distributed: true,
          dataLabels: {
            position: "top",
          },
        },
      },
      dataLabels: {
        enabled: true,
        dropShadow: {
          enabled: true,
          opacity: 0.5,
          color: "#000000",
        },
      },
      legend: {
        show: false,
      },
      xaxis: {
        categories: [],
        labels: {
          style: {
            colors: colors,
            fontSize: "12px",
          },
        },
      },
    },
  });

  let seriesData = [];
  let labelData = [];

  useEffect(() => {
    populateChartOptions(prop.gridData);
  }, [JSON.stringify(prop.gridData)]);

  const populateChartOptions = (gridData) => {
    let chartCategories = [];
    let series = [];

    gridData.forEach((element) => {
      series.push(element.COUNT);
      let catgry = element.STAGENAME.split(" ");
      chartCategories.push(catgry);
    });

    let chartJson = {
      series: [
        {
          data: series,
        },
      ],
      options: {
        xaxis: {
          categories: chartCategories,
          labels: {
            style: {
              colors: colors,
              fontSize: "9.5px",
            },
          },
        },
      },
    };
    setChartState(chartJson);
  };

  return (
    <>
      <div className="donut">
        <Chart
          options={chartState.options}
          series={chartState.series}
          type="bar"
          width="100%"
          height={230}
        />
      </div>
    </>
  );
}
