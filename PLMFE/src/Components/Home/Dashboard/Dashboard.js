import React, { useEffect, useRef } from "react";
import { useState } from "react";
import DonutChart from "../../SelfServiceTiles/DonutChart";
import { useSelector } from "react-redux";
// import customAxios from "../../../api/axios";
import { useAxios } from "../../../api/axios.hook";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation, useNavigate } from "react-router-dom";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import { Card, CardContent, Grid, Typography } from "@mui/material";
import MaterialUiGrid from "../../CommonComponents/MaterialUIGrid";

export default function Dashboard() {
  const navigate = useNavigate();
  const { customAxios } = useAxios();
  const { printConsole } = useUpdateDecision();
  // const [donutRender,setDonutRender] = useState(true);
  const mastersSelector = useSelector((masters) => masters);
  const userName = mastersSelector.hasOwnProperty("auth")
    ? mastersSelector.auth.hasOwnProperty("userName")
      ? mastersSelector.auth.userName
      : "system"
    : "system";
  //const userName = 'system';
  const [tableData, setTableData] = useState([]);
  const token = mastersSelector.hasOwnProperty("auth")
    ? mastersSelector.auth.hasOwnProperty("token")
      ? mastersSelector.auth.token
      : ""
    : "";
  const { getTableDetails } = useGetDBTables();
  const initialTableData = useRef({});
  useEffect(() => {
    printConsole("Inside Portal Dashboad useEffect Master: ", mastersSelector);
    getDashboardData();
    //console.log("Dashboard Table Data: ",tableData);
  }, [mastersSelector["masterProvContLinkData"]]);

  const getDashboardData = () => {
    printConsole(
      "Inside getDashboardData masterProvContLinkData: ",
      mastersSelector["masterProvContLinkData"],
    );
    const contractIdData = mastersSelector["masterProvContLinkData"][0];
    printConsole("Inside getDashboardData contractIdData: ", contractIdData);
    if (contractIdData !== undefined && contractIdData.length > 0) {
      const tableJson = contractIdData[0];
      printConsole(
        "Inside getDashboardData Main Table Data: ",
        tableJson.MainTable,
      );
      setTableData(tableJson.MainTable);
      initialTableData.current = tableJson.MainTable;
      //return contractIdData.MainTable;
      /*const orgName = contractIdData[0].Legal_Entity_Name;
      printConsole('Inside getDashboardData orgName: ',orgName);
      let getApiJson = {};
      getApiJson['tableNames'] = getTableDetails()['mainTable'];
      getApiJson['whereClause'] = {'OrganizationName':'&&~=~'+orgName,'LegalEntityName':'||~=~'+orgName,};
      getApiJson['constraints'] = {"order~By":"caseNumber"};
      printConsole("Final APi JSON INput: ",getApiJson);
      customAxios.post('/generic/get',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
        printConsole('Get data Response: ',res)
        if(res.data.Status === 0){
            const respData = [...res.data.data.mainTable];
            console.log("respData: ",respData);
            initialTableData = [...respData];
            setTableData(respData);
        }
        }).catch((err) => {
          printConsole(err.message);
        });*/
    }
  };

  const filterTableData = (caseStat) => {
    printConsole("Inside filterTable: ", caseStat);
    let initialTableArr = initialTableData.current;
    printConsole("Inside  filterTable initialTableArr: ", initialTableArr);
    if (caseStat === "All Cases") {
      //console.log("Inside filterTable not allCases before: ",initialTableData);
      setTableData(initialTableArr);
    }
    if (caseStat !== "All Cases") {
      //const tmpTableData = [...gridData];
      //printConsole("Inside if filterTable tmpTableData: ",initialTableArr);
      let filteredArray = initialTableArr.filter(
        (data) => data.CaseStatus === caseStat,
      );
      //printConsole("Inside filterTable not allCases after: ",filteredArray);
      setTableData(filteredArray);
      //printConsole("Inside filterTable state: ",tableData);
    }
  };

  const navigateToForm = (obj) => {
    // const obj = tableData[index];
    let navigateUrl = "";
    if (obj.CaseNumber !== undefined) {
      let stage = obj.StageName.toLowerCase();
      stage = stage.replaceAll(" ", "");
      console.log("Inside Dashboard navigate To form: ", stage);
      if (stage === "pendingprovider") {
        navigateUrl = "/Home/UserDocuments";
        navigate(navigateUrl, {
          replace: true,
          state: {
            caseNumber: obj.CaseNumber,
            formNames: obj.TransactionType,
            userName: userName,
            // decisionNotes : '',Das
            // stageName : 'Open',
            // transactionType : 'Add Provider',
            stageName: obj.StageName,
            flowId: obj.FlowId,
          },
        });
      }
      //<AddProvider caseNumber={obj.caseNumber}></AddProvider>
    }
  };
  const columns = [
    {
      field: "CaseNumber",
      disableColumnMenu: true,
      headerName: "Case#",
      headerClassName: "super-app-theme--header",
      minWidth: 155,
      flex: 1,
      renderHeader: () => <b>Case#</b>,
      renderCell: (params) => (
        <a
          onClick={() => {
            navigateToForm(params.row);
          }}
          style={
            params?.row?.StageName === "Pending Provider"
              ? { textDecoration: "underline", cursor: "pointer" }
              : {}
          }
        >
          {params?.row?.CaseNumber ? params.row.CaseNumber : ""}
        </a>
      ),
    },
    {
      field: "NpiId",
      disableColumnMenu: true,
      headerName: "NPI",
      headerClassName: "super-app-theme--header",
      flex: 1,
      minWidth: 155,
      renderHeader: () => <b>NPI</b>,
      valueGetter: (params) => (params?.row?.NpiId ? params.row.NpiId : ""),
    },
    {
      field: "FirstName",
      disableColumnMenu: true,
      headerClassName: "super-app-theme--header",
      headerName: "Name",
      flex: 1,
      minWidth: 160,
      renderHeader: () => <b>Name</b>,
      valueGetter: (params) =>
        "FirstName" in params?.row
          ? params?.row.FirstName
          : "LegalEntityName" in params?.row
            ? params?.row?.LegalEntityName
            : "",
    },
    {
      field: "StageName",
      headerClassName: "super-app-theme--header",
      headerName: "Load Type",
      renderHeader: () => <b>Load Type</b>,
      disableColumnMenu: true,
      flex: 1,
      sortable: false,
      minWidth: 160,

      valueGetter: (params) =>
        "StageName" in params?.row ? params.row.StageName : "",
    },
    {
      field: "CaseStatus",
      headerName: "Status",
      disableColumnMenu: true,
      headerClassName: "super-app-theme--header",
      flex: 1,
      minWidth: 200,
      renderHeader: () => <b>Status</b>,
      valueGetter: (params) =>
        "CaseStatus" in params.row ? params.row.CaseStatus : "",
    },
  ];

  return (
    <Grid
      container
      spacing={2}
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Grid container item xs={12} md={12}>
        <Grid item md={6}>
          <Card
            variant="elevation"
            sx={{
              height: 240,
              boxShadow: 3,
              borderRadius: "12px",
              m: 1,
              display: "flex",
              justifyContent: "center",
            }}
          >
            <DonutChart
              gridData={tableData}
              filterTableData={filterTableData}
              isRender={true}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card
            variant="elevation"
            sx={{ height: 240, boxShadow: 3, borderRadius: "12px", m: 1 }}
          >
            <CardContent>
              <Typography variant="button" fontWeight={700}>
                Welcome to Provider Online Portal, a new way to serve Providers.
                The portal allows you to view application statuses, submit new
                requests, view and download documents, and maintain existing
                data relating to providers, facilities, and ancillaries. All
                Provider changes and creations can be completed in Self Service.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid item xs={12} md={12}>
        <Card variant="elevation" sx={{ boxShadow: 3, borderRadius: "12px" }}>
          <MaterialUiGrid
            data={tableData}
            uniqueCol={"id"}
            density="compact"
            pageSize={10}
            columns={columns}
            handleCellClick={() => {}}
            ExportName="Portal Cases"
          />
        </Card>
      </Grid>
    </Grid>
  );
}
