import React, { useEffect, useState } from "react";
import ChartComponent from "./ChartComponent";
import { useAxios } from "../../../../api/axios.hook";
import { useSelector } from "react-redux";
import "../ViewReport/ViewReport.css";
import ViewReportForm from "./ViewReportForm";
import MaterialUiGrid from "../../../../Components/CommonComponents/MaterialUIGrid";
import PropTypes from "prop-types";
import { Tabs } from "@mui/material";
import offlineImage from "../../../../Images/offlineDownload.jpg.jpg";

import {
  Backdrop,
  Box,
  Tab,
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
import FullWidthReportsDialog from "./FullWidthReportsDialog";
import useSwalWrapper from "../../../../Components/SweetAlearts/hooks";

export default function ViewReport(props) {
  const { customAxios } = useAxios();
  const [showForm, setShowForm] = useState(false);
  const [openGridDialog, setOpenGridDialog] = useState(false);
  const [formData, setFormData] = useState({});
  const [tableData, setTableData] = useState([{}]);
  const [tableHeader, setTableHeader] = React.useState([]);
  const [value, setValue] = React.useState(0);
  const [showLayout, setShowLayout] = React.useState(false);
  const [showLoader, setShowLoader] = React.useState(false);
  const [currentReport, setCurrentReport] = useState({});

  const token = useSelector((state) => state.auth.token);
  const viewReportsData = useSelector((state) => state?.viewReportsTable);
  const Swal = useSwalWrapper();

  const updateFormData = (value, field) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [field]: {
          ...prevState[field],
          value: value[0],
          isInvalid: false,
        },
      };
    });
  };
  const filteredData = viewReportsData?.filter(
    (item) => item?.ReportType?.toLowerCase() !== "offline",
  );

  function caseDetailsHandler(formOutPut, reportName, reportFields) {
    let getApiJson = {};

    let procJsonInput = {};
    if (formOutPut?.length > 0) {
      procJsonInput = formOutPut?.reduce((result, obj) => {
        result[obj?.name] = obj?.value?.toString();
        return result;
      }, {});
    }
    //validation as per Table data
    if (reportFields.length > 0) {
      for (let i = 0; i < reportFields.length; i++) {
        const obj = reportFields[i];
        if (
          obj.Mandatory === "Y" &&
          (!procJsonInput.hasOwnProperty(obj.Name) || !procJsonInput[obj.Name])
        ) {
          Swal.fire({
            icon: "error",
            title: `${obj.Name} is mandatory`,
          });
          return;
        }
      }
    }

    setShowLoader(true);
    getApiJson["JsonInput"] = procJsonInput;
    getApiJson["ReportName"] = reportName;
    getApiJson["option"] = "GENERIC_REPORT";

    customAxios
      .post("/generic/callResultSetProcedure", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.CallProcedure_Output.Status === 0) {
          const respData = [...res.data.CallProcedure_Output.data];
          const keyArray = respData[0];
          setTableHeader(keyArray);

          // const keyItems = getKeyItems(respData);
          let data = respData
            .slice(1)
            .map((arr) =>
              Object.fromEntries(keyArray.map((key, i) => [key, arr[i]])),
            );

          setTableData(data);

          // setShowReport(true);
          // chartData(initialTableData);
        }
        setShowLoader(false);
      })
      .catch((err) => {
        console.log(err.message);
        setShowLoader(false);
      });
  }

  const handleCellClick = (params) => {
    setShowLayout(true);

    if (params?.row?.IsParametrized === "Y") {
      setShowForm(true);
      setTableData([{}]);
      setTableHeader([]);
    } else {
      setShowLoader(true);
      setTableData([{}]);
      setShowForm(false);
      setTableHeader([]);
      caseDetailsHandler(params.row, params.row.ReportName, []);
    }

    setCurrentReport(params.row);
  };

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 1 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const tableKeys = tableHeader?.length > 0 ? tableHeader : [];

  const onlineTableColumns = tableKeys
    ? tableKeys?.map((item) => ({
        field: item,
        headerName: item,
        headerClassName: "super-app-theme--header",
        disableColumnMenu: true,
        cellClassName: "super-app-comment",
        sortable: false,
        flex: 1,
        minWidth: 160,
      }))
    : [];

  return (
    <Grid
      container
      sx={{
        p: 1,
        backgroundColor: "#F5FEFD",
      }}
      layout={"row"}
    >
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
              Online Reports
            </Typography>
          </Breadcrumbs>
        </Stack>
      </Grid>

      <Grid
        item
        xs={3.5}
        sm={3.5}
        md={3.5}
        layout={"row"}
        sx={{ minHeight: "calc(100vh - 110px)" }}
      >
        <MaterialUiGrid
          data={filteredData}
          density="compact"
          uniqueCol="id"
          ExportName="Online Reports"
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
              maxWidth: "200px !important",
            },
          ]}
          handleCellClick={handleCellClick}
        />
      </Grid>

      <Grid
        item
        xs={8.5}
        layout={"row"}
        sx={{ minHeight: "calc(100vh - 110px)" }}
      >
        {showLayout ? (
          <>
            {showForm && (
              <Card
                variant="outlined"
                sx={{
                  ml: 1,
                }}
              >
                <CardContent display="flex" justifyContent="center">
                  <ViewReportForm
                    ReportDef={
                      currentReport?.ReportDefinition?.length > 0 &&
                      JSON?.parse(currentReport?.ReportDefinition)
                    }
                    submitForm={caseDetailsHandler}
                    title={currentReport.ReportName}
                    currentSelection={formData}
                    setSelection={(value, field) => {
                      updateFormData(value, field);
                    }}
                    reporName={currentReport?.ReportName}
                  />
                </CardContent>
              </Card>
            )}

            <Card
              variant="outlined"
              sx={{
                ml: 1,
                mt: 1,
                minHeight: "calc(100vh - 110px)",
                maxWidth: "90vw",
              }}
            >
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="basic tabs example"
                >
                  <Tab label="Tabuler Data" {...a11yProps(0)} />
                  <Tab label="graphical Data" {...a11yProps(1)} />

                  <Typography
                    variant="body2"
                    fontSize="16px"
                    padding="10px"
                    marginLeft="auto"
                  >
                    {currentReport.ReportName}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ ml: "auto", height: "32px", mt: 1, mr: 1 }}
                    onClick={() => setOpenGridDialog(true)}
                  >
                    Expand All
                  </Button>
                </Tabs>
              </Box>

              <CustomTabPanel value={value} index={0}>
                {tableHeader?.length > 0 && (
                  <Box
                    sx={{
                      overflowY: "scroll",
                      maxHeight: "100vh",
                      msOverflowStyle: "none",
                      "&::-webkit-scrollbar": {
                        width: "8px",
                        height: "8px",
                      },
                      "&::-webkit-scrollbar-track": {
                        background: "#f1f1f1",
                      },
                      "&::-webkit-scrollbar-thumb": {
                        background: "#888",
                        borderRadius: "10px",
                      },
                    }}
                  >
                    <MaterialUiGrid
                      ExportName={currentReport?.ReportName}
                      columns={onlineTableColumns}
                      handleCellClick={() => {}}
                      data={tableData?.map((obj, index) => ({
                        ...obj,
                        repId: index + 1,
                      }))}
                      uniqueCol={"repId"}
                      density="compact"
                    />
                  </Box>
                )}
              </CustomTabPanel>
              <CustomTabPanel value={value} index={1}>
                {tableData?.length > 0 && (
                  <>
                    <ChartComponent
                      data={tableData}
                      title={currentReport.reportName}
                      chartDetails={
                        currentReport?.ReportDefinition?.length > 0 &&
                        JSON?.parse(currentReport?.ReportDefinition)
                      }
                    />
                  </>
                )}
              </CustomTabPanel>
            </Card>
          </>
        ) : (
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
              title="Click on  Report Row to View  Report Detials"
              align="center"
            />
            <CardContent display="flex" justifyContent="center"></CardContent>
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
      {tableData?.length > 0 && (
        <FullWidthReportsDialog
          tableData={tableData}
          ExportName={currentReport?.ReportName}
          onlineTableColumns={onlineTableColumns}
          open={openGridDialog}
          handleClose={() => setOpenGridDialog(false)}
        />
      )}
    </Grid>
  );
}
