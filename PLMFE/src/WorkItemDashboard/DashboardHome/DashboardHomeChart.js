import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

export default function DashboardHomeChart(prop) {
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
            //console.log("label: ",config.w.config.labels[config.dataPointIndex]);
            const selectedLabel = config.w.config.labels[config.dataPointIndex];
            prop.filterTableData(selectedLabel, prop.isRender, prop.gridName);
          },
        },
      },
    },
  });

  let seriesData = [];
  let labelData = [];

  useEffect(() => {
    if (prop.isRender === true && prop.gridData.length > 0) {
      prop.gridData.map((data) => {
        if (data.StageName !== "Exit" || data.StageName !== "Discard") {
          let indx = -1;
          let stat = data.StageName;
          indx = labelData.indexOf(stat);
          if (indx > -1) {
            seriesData[indx] = seriesData[indx] + 1;
          }
          if (indx === -1) {
            labelData.push(stat);
            seriesData.push(1);
          }
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
      // state.options.series = seriesData;
      // state.options.labels = labelData;
    }
  }, [JSON.stringify(prop.gridData)]);
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
