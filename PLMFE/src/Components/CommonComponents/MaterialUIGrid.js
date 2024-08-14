import { DataGrid } from "@mui/x-data-grid/DataGrid";
import { Box, MenuItem } from "@mui/material";
import {
  GridCsvExportMenuItem,
  GridToolbarExportContainer,
  gridFilteredSortedRowIdsSelector,
  gridVisibleColumnFieldsSelector,
  useGridApiContext,
} from "@mui/x-data-grid";
import { styled } from "@mui/material/styles";
import {
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
} from "@mui/x-data-grid";
import useXLSXDownload from "../CustomHooks/useXLSXDownload";
import { useCallback, useRef } from "react";

export default function MaterialUiGrid({
  columns,
  uniqueCol,
  handleCellClick,
  data,
  density,
  pageSize,
  ExportName,
}) {
  const ref = useRef(null);

  const [downloadXLSX] = useXLSXDownload();

  const handleUniqueRow = useCallback(
    (row) =>
      uniqueCol
        ? row[uniqueCol]
        : Math.floor(Math.random() * Math.floor(Math.random() * Date.now())),
    [],
  );
  const getJson = useCallback((apiRef) => {
    const filteredSortedRowIds = gridFilteredSortedRowIdsSelector(apiRef);
    const visibleColumnsField = gridVisibleColumnFieldsSelector(apiRef);
    const data = filteredSortedRowIds.map((id) => {
      const row = {};
      visibleColumnsField.forEach((field) => {
        row[field] = apiRef.current.getCellParams(id, field).value;
      });
      return row;
    });
    return JSON.stringify(data, null, 2);
  }, []);

  const exportBlob = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();

    setTimeout(() => {
      URL.revokeObjectURL(url);
    });
  };

  function JsonExportMenuItem(props) {
    const apiRef = useGridApiContext();

    const { hideMenu } = props;

    return (
      <MenuItem
        onClick={() => {
          const jsonString = getJson(apiRef);
          const blob = new Blob([jsonString], {
            type: "text/json",
          });
          exportBlob(blob, `${ExportName}.json`);

          hideMenu?.();
        }}
      >
        Download as JSON
      </MenuItem>
    );
  }
  function ExcelExportOptionMenu(props) {
    const apiRef = useGridApiContext();

    const { hideMenu } = props;

    return (
      <MenuItem
        onClick={() => {
          const jsonString = JSON.parse(getJson(apiRef));
          downloadXLSX(jsonString, ExportName);

          hideMenu?.();
        }}
      >
        Download as XLSX
      </MenuItem>
    );
  }
  const csvOptions = { delimiter: ";", fileName: ExportName };

  function CustomExportButton(props) {
    return (
      <GridToolbarExportContainer {...props}>
        <GridCsvExportMenuItem options={csvOptions} />
        <JsonExportMenuItem />
        <ExcelExportOptionMenu />
      </GridToolbarExportContainer>
    );
  }
  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        {ExportName !== "Master Tables" && <GridToolbarDensitySelector />}

        <CustomExportButton />
      </GridToolbarContainer>
    );
  }

  const StyledGridOverlay = styled("div")(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    "& .ant-empty-img-1": {
      fill: theme.palette.mode === "light" ? "#aeb8c2" : "#262626",
    },
    "& .ant-empty-img-2": {
      fill: theme.palette.mode === "light" ? "#f5f5f7" : "#595959",
    },
    "& .ant-empty-img-3": {
      fill: theme.palette.mode === "light" ? "#dce0e6" : "#434343",
    },
    "& .ant-empty-img-4": {
      fill: theme.palette.mode === "light" ? "#fff" : "#1c1c1c",
    },
    "& .ant-empty-img-5": {
      fillOpacity: theme.palette.mode === "light" ? "0.8" : "0.08",
      fill: theme.palette.mode === "light" ? "#f5f5f5" : "#fff",
    },
  }));

  function CustomNoRowsOverlay() {
    return (
      <StyledGridOverlay>
        <svg
          width="120"
          height="100"
          viewBox="0 0 184 152"
          aria-hidden
          focusable="false"
        >
          <g fill="none" fillRule="evenodd">
            <g transform="translate(24 31.67)">
              <ellipse
                className="ant-empty-img-5"
                cx="67.797"
                cy="106.89"
                rx="67.797"
                ry="12.668"
              />
              <path
                className="ant-empty-img-1"
                d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
              />
              <path
                className="ant-empty-img-2"
                d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
              />
              <path
                className="ant-empty-img-3"
                d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
              />
            </g>
            <path
              className="ant-empty-img-3"
              d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
            />
            <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
              <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
              <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
            </g>
          </g>
        </svg>
        <Box sx={{ mt: 1 }}>No Rows</Box>
      </StyledGridOverlay>
    );
  }

  return (
    <Box
      ref={ref}
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <DataGrid
        slots={{
          toolbar: CustomToolbar,
          noRowsOverlay: CustomNoRowsOverlay,
        }}
        slotProps={{
          toolbar: {
            printOptions: { disableToolbarButton: true },
            csvOptions: { disableToolbarButton: false },
          },
        }}
        density={density ? density : "standard"}
        onCellClick={(params) => handleCellClick(params)}
        autoHeight={uniqueCol === "userId" ? true : false}
        sx={{
          boxShadow: 2,
          border: 6,
          "--DataGrid-overlayHeight": "300px",
          backgroundColor: "#fff",
          borderColor: "#eee",
          color: "black",

          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "break-spaces",
            lineHeight: 1,
            fontWeight: 550,
          },

          "& .Mui-selected": {
            backgroundColor: "#98AFC7 !important",
            color: "white",
          },

          "& .MuiDataGrid-cell": {
            outline: "none",
            fontSize: "1rem",
            fontWeight: 500,
          },

          ".MuiDataGrid-row.Mui-odd": {
            backgroundColor: "rgb(224,224,224)",
          },
          "& .MuiDataGrid-cell:hover": {
            outline: "none",
            color: "#21211f",
          },
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none",
          },
          "& svg": {
            color: "#3b78c9",
          },
          "& .css-9h4z0x-MuiButtonBase-root-MuiButton-root": {
            color: "black",
          },
          "& .super-app-theme--header": {
            backgroundColor: "#1976d2",
            color: "white",

            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },
            "& svg": {
              color: "white",
            },
          },
          "& .MuiDataGrid-footerContainer.MuiDataGrid-withBorderColor.css-wop1k0-MuiDataGrid-footerContainer > div.MuiTablePagination-root.css-rtrcn9-MuiTablePagination-root > div":
            {
              overflow: "hidden",
              ".MuiTablePagination-selectLabel": {
                ml: -2,
                mt: 2,
              },

              ".MuiTablePagination-displayedRows": {
                ml: -2,
                mt: 2,
              },
            },
          ".css-de9k3v-MuiDataGrid-selectedRowCount": {
            display: "none !important",
            visibility: "none !important",
          },
          ".css-wop1k0-MuiDataGrid-footerContainer": {
            display: "flex",
            justifyContent: "flex-end",
          },
          "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
            py: 1,
          },
          "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
            py: "15px",
          },
          "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
            py: "22px",
          },
        }}
        getEstimatedRowHeight={() => 70}
        getRowHeight={() => (ExportName === "Master Tables" ? "" : "auto")}
        rows={data}
        columns={columns}
        getRowId={(row) => handleUniqueRow(row)}
        getRowClassName={(params) =>
          params.indexRelativeToCurrentPage % 2 === 0 ? "Mui-even" : "Mui-odd"
        }
        initialState={{
          ...data.initialState,
          pagination: {
            paginationModel: {
              pageSize: pageSize ? pageSize : 5,
            },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </Box>
  );
}
