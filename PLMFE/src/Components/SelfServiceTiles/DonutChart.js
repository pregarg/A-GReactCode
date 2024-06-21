import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

export default function DonutChart(prop) {
  const [chartState, setChartState] = useState({
    options: {
      series: [],
      labels: [],
      dataLabels: {
        enabled: true,
        enabledOnSeries: undefined,
        formatter: function (val, opts) {
          return opts.w.globals.seriesTotals[opts.seriesIndex];
        },
      },
      chart: {
        events: {
          dataPointSelection: function (event, chartContext, config) {
            //console.log("Inside donut chart gridData: ",prop.gridData);
            const selectedLabel = config.w.config.labels[config.dataPointIndex];
            prop.filterTableData(selectedLabel);
          },
        },
      },
      legend: {
        position: "right",
        offsetY: 50,
        height: 330,
      },
    },
  });

  let seriesData = [];
  let labelData = [];

  useEffect(() => {
    if (
      prop.isRender === true &&
      prop.gridData !== undefined &&
      prop.gridData.length > 0
    ) {
      prop.gridData.map((data) => {
        let indx = -1;
        let stat = data.CaseStatus;
        indx = labelData.indexOf(stat);
        if (indx > -1) {
          seriesData[indx] = seriesData[indx] + 1;
        }
        if (indx === -1) {
          labelData.push(stat);
          seriesData.push(1);
        }
      });
      labelData.push("All Cases");
      seriesData.push(prop.gridData.length);
      const updateOPtions = {
        options: {
          series: seriesData,
          labels: labelData,
        },
      };
      setChartState(updateOPtions);
    }
  }, [prop.gridData]);
  return (
    <>
      <div className="donut">
        <Chart
          options={chartState.options}
          series={chartState.options.series}
          type="donut"
          width="380"
        />
      </div>
    </>
  );
}
