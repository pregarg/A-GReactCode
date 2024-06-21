import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import MaterialUiGrid from "../../../../Components/CommonComponents/MaterialUIGrid";
import {
  Backdrop,
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import offlineImage from "../../../../Images/offlineDownload.jpg.jpg";
import useGetDBTables from "../../../../Components/CustomHooks/useGetDBTables";
import axios from "../../../../api/axios";
import useSwalWrapper from "../../../../Components/SweetAlearts/hooks";
import { FiDownloadCloud } from "react-icons/fi";
import { IoRefreshCircle } from "react-icons/io5";
import useCallApi from "../../../../Components/CustomHooks/useCallApi";

export default function OfflineReports(props) {
  const [showReport, setShowReport] = React.useState({
    show: false,
    rowData: {},
  });
  const [disableButton, setDisableButton] = React.useState(false);
  const [generatedReportsData, setGeneratedReportsData] = React.useState([]);
  const [showLoader, setShowLoader] = React.useState(false);
  const { getTableDetails } = useGetDBTables();
  const { downloadFile } = useCallApi();

  const Swal = useSwalWrapper();
  const viewReportsData = useSelector((state) => state?.viewReportsTable);
  const authData = useSelector((state) => state.auth);

  const filteredData = viewReportsData?.filter(
    (item) => item?.ReportType?.toLowerCase() !== "online"
  );
  function convertDateFormat(inputDateStr) {
    const date = new Date(inputDateStr);
    if (isNaN(date)) {
      return "Invalid date";
    }
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const year = String(date.getFullYear());
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${month}:${day}:${year} ${hours}:${minutes}`;
  }
  const handleCellClick = (params) => {
    setShowLoader(true);
    setShowReport({
      ...showReport,
      open: true,
      rowData: params?.row,
    });
    getReportDetailById(params?.row);
  };
  const handleGenerateReport = () => {
    setDisableButton(true);
    let gridData = {};
    let gridKeys = getTableDetails()["reportPollingTable"][0];
    const tableName = gridKeys.substring(0, gridKeys.lastIndexOf("~"));
    let data = {
      REQUESTEDUSERNAME: authData?.userName,
      REQUESTEDUSERID: authData?.userId,
      //REPORTSTATUS: showReport.rowData.ReportType,

      //Changed By Harshit as we have to send the Report Status as Pending every time for new request
      REPORTSTATUS: 'Pending',
      REPORTNAME: showReport.rowData.ReportName,
      REPORTPROCNAME: showReport.rowData.ReportProcName,
      REQUESTEDDATETIME: new Date(),
      operation: "I",
    };
    gridData[tableName] = [data];
    axios
      .post("/generic/update", gridData, {
        headers: { Authorization: `Bearer ${authData?.token}` },
      })
      .then((res) => {
        if (res.data["UpdateCase_Output"]["Status"] === 0) {
          Swal.fire({
            icon: "success",
            title:
              "Your report generation request has been successfully submitted. Your reports will be available within the next 30 minutes",
          });
          if (Object.keys(showReport?.rowData).length > 0) {
            getReportDetailById(showReport?.rowData);
          }
        }
      })
      .catch((err) => {
        console.log(err.message);
        Swal.fire({
          icon: "error",
          title: "There is an Error while Generating the Reoprt ",
        });
      });
    setTimeout(() => {
      setDisableButton(false);
    }, 300);
  };

  const getReportDetailById = (reportData) => {
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["reportDocuments"];
    getApiJson["whereClause"] = {
      UserName: authData?.userName,
      ReportName: reportData.ReportName,
    };

    axios
      .post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${authData?.token}` },
      })
      .then((res) => {
        const apiStat = res.data.Status;

        if (apiStat === -1) {
          Swal.fire({
            icon: "error",
            title: "There is an Error while getting generated the Reoprt ",
          });
        }
        if (apiStat === 0) {
          const sortedResults = res?.data?.data?.ReportDocuments?.sort(
            function (a, b) {
              var dateA = new Date(a["uploadedDateTime#date"]).getTime();
              var dateB = new Date(b["uploadedDateTime#date"]).getTime();
              return dateA < dateB ? 1 : -1;
            }
          );
          setGeneratedReportsData(sortedResults);
        }
        setShowLoader(false);
      })
      .catch((err) => {
        console.log(err.message);
        setShowLoader(false);
      });
  };
  const offlineTableColumns = [
    {
      field: "Actions",
      headerName: "Actions",
      headerClassName: "super-app-theme--header",
      disableColumnMenu: true,
      cellClassName: "super-app-comment",
      flex: 1,
      renderHeader: () => <b>Actions</b>,
      sortable: false,
      maxWidth: 90,

      renderCell: (params) => (
        <FiDownloadCloud
          fontSize="16px"
          color="#990f02"
          cursor="pointer"
          onClick={() => {
            downloadFile(
              generatedReportsData?.indexOf(params?.row),
              generatedReportsData
            );
          }}
        />
      ),
    },
    {
      field: "ReportName",
      headerName: "Reports",
      headerClassName: "super-app-theme--header",
      disableColumnMenu: true,
      cellClassName: "super-app-comment",
      flex: 1,
      renderHeader: () => <b>Report Name</b>,
      sortable: false,
      width: "100%",
    },
    {
      field: "uploadedDateTime#date",
      headerName: "Generated Date Time",
      headerClassName: "super-app-theme--header",
      disableColumnMenu: true,
      cellClassName: "super-app-comment",
      flex: 1,
      renderHeader: () => <b>Generated Date Time</b>,
      sortable: false,
      width: "100%",
      valueGetter: (params) =>
        `${convertDateFormat(params?.row["uploadedDateTime#date"])}`,
    },
    {
      field: "fileName",
      headerName: "fileName",
      headerClassName: "super-app-theme--header",
      disableColumnMenu: true,
      cellClassName: "super-app-comment",
      flex: 1,
      renderHeader: () => <b>File Name</b>,
      sortable: false,
      width: "100%",
      valueGetter: (params) =>
        `${params?.row?.docUploadPath?.substring(
          params?.row?.docUploadPath?.lastIndexOf("/") + 1
        )}`,
    },
  ];
  const refreshResults = () => {
    if (Object.keys(showReport?.rowData).length > 0) {
      getReportDetailById(showReport?.rowData);
    } else {
      Swal.fire({
        icon: "error",
        title: "Select Row To Refresh Reports ",
      });
    }
  };

  return (
    <Grid container sx={{ p: 1, backgroundColor: "#F5FEFD" }} layout={"row"}>
      <Grid item xs={12} md={12} sm={12}>
        <Stack spacing={2} p={2} ml="5px">
          <Breadcrumbs aria-label="breadcrumb">
            <Typography
              onClick={() => props.setPage("cards")}
              sx={{ cursor: "pointer" }}
            >
              Home
            </Typography>

            <Typography color="text.primary" variant="h6">
              Offline Reports
            </Typography>
          </Breadcrumbs>
        </Stack>
      </Grid>

      <Grid item xs={3.5} sm={3.5} md={3.5} sx={{ minHeight: "100%" }}>
        <MaterialUiGrid
          data={filteredData}
          density="compact"
          uniqueCol='id'
          ExportName="Offline Reports"
          columns={[
            {
              field: "ReportName",
              headerName: "Reports",
              headerClassName: "super-app-theme--header",
              disableColumnMenu: true,
              cellClassName: "super-app-comment",
              flex: 1,
              renderHeader: () => <b>Reports</b>,
              sortable: false,
              width: "100%",
            },
          ]}
          handleCellClick={handleCellClick}
        />
      </Grid>
      <Grid item xs={8.5} layout={"row"}>
        {!showReport.open ? (
          <Card
            variant="outlined"
            sx={{
              ml: 1,
              minHeight: " calc(100vh - 18vh)",
              backgroundImage: `url(${offlineImage})`,
              backgroundRepeat: "no-repeat",
              backgroundSize: "100% 100%",
            }}
          >
            <CardHeader
              title="Click on  Report Row to Generate Offline Report"
              align="center"
            />
            <CardContent display="flex" justifyContent="center"></CardContent>
          </Card>
        ) : (
          <Card
            variant="outlined"
            sx={{
              ml: 1,
              minHeight: " calc(100vh - 18vh)",
            }}
          >
            <CardContent>
              <Grid container>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sm={12}
                  display="flex"
                  justifyContent="space-between"
                  marginBottom={1}
                >
                  <Typography variant="subtitle2" fontSize="18px" p={"5px"}>
                    {showReport?.rowData?.ReportName}
                  </Typography>
                  <Box>
                    <IoRefreshCircle
                      onClick={refreshResults}
                      color="#1976d2"
                      fontSize="31px"
                      cursor="pointer"
                    />

                    <Button
                      disabled={disableButton}
                      variant="contained"
                      size="small"
                      onClick={handleGenerateReport}
                    >
                      Generate Report
                    </Button>
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={12}
                  sm={12}
                  sx={{ minHeight: "calc(100vh - 32vh)" }}
                >
                  <MaterialUiGrid
                    ExportName={showReport?.rowData?.ReportName}
                    columns={offlineTableColumns}
                    data={generatedReportsData}
                    uniqueCol={"SNO"}
                    density="compact"
                    handleCellClick={() => {}}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}
      </Grid>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showLoader}
        close={showLoader}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Grid>
  );
}
