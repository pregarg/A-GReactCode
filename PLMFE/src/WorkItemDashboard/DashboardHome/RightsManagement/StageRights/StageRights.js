import React, { useState, useRef, useCallback } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { baseURL } from "../../../../api/baseURL";
import "./StageRights.css";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Checkbox,
  Grid,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import useSwalWrapper from "../../../../Components/SweetAlearts/hooks";
import MaterialUiGrid from "../../../../Components/CommonComponents/MaterialUIGrid";

export default function StageRights(props) {
  const [columns, setColumns] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const rightsChangedIndexes = useRef([]);
  const [flow, setFlow] = useState();
  const [updatebtnshow, setupdatebtnshow] = useState("");
  const token = useSelector((state) => state.auth.token);
  let Swal = useSwalWrapper();

  const changeRights = (checked, row, module) => {
    let existingRightIndex = rightsChangedIndexes?.current?.findIndex(
      (right) =>
        (right.STAGEID === module?.id && right?.USERID === row?.userId) ||
        (right["whereClause"]?.STAGEID === module?.id &&
          right["whereClause"]?.STAGEID === row?.userId)
    );

    if (checked) {
      const updateRight = {
        STAGEID: module.id,
        USERID: row?.userId,
        operation: "I",
      };
      if (existingRightIndex !== -1) {
        if (rightsChangedIndexes.current[existingRightIndex].whereClause) {
          delete rightsChangedIndexes.current[existingRightIndex].whereClause;
        }
        rightsChangedIndexes.current[existingRightIndex] = { ...updateRight };
      } else {
        rightsChangedIndexes.current.push(updateRight);
      }
    } else {
      const updateRight = {
        whereClause: { STAGEID: module.id, USERID: row?.userId },
        operation: "D",
      };
      if (existingRightIndex !== -1) {
        rightsChangedIndexes.current[existingRightIndex] = { ...updateRight };
      } else {
        rightsChangedIndexes.current.push(updateRight);
      }
    }
    setDataRows((prev) => {
      return prev.map((data) => {
        if (data.userId == row.userId) {
          const rights = data.rights.map((right) => {
            if (right.name === module.name) {
              return {
                ...right,
                hasRight: !right.hasRight,
              };
            }
            return right;
          });
          return {
            ...data,
            rights: rights,
          };
        }
        return data;
      });
    });
  };
  console.log(flow);

  const getColumns = (modules) => {
    const columns = [
      {
        headerClassName: "super-app-theme--header",
        flex: 1,
        field: "userName",
        headerName: "User Name",
        headerClassName: "super-app-theme--header",
        disableColumnMenu: true,
        sortable: false,
        minWidth: 120,
      },
      ...modules.map((module) => {
        return {
          field: module.name,
          headerName: module.name,
          headerClassName: "super-app-theme--header",
          disableColumnMenu: true,
          cellClassName: "super-app-comment",
          sortable: false,
          flex: 1,
          minWidth: 60,
          renderCell: (params) => (
            <Box>
              <Checkbox
                checked={
                  params.row?.rights?.find(
                    (right) => right.name === module.name
                  )?.hasRight
                }
                size="small"
                onChange={(e) => {
                  changeRights(e.target.checked, params.row, module);
                }}
              />
            </Box>
          ),
        };
      }),
    ];

    setColumns(columns);
  };

  const getTableData = async (flow) => {
    try {
      const data = await axios.get(baseURL + `/rights/stages/${flow}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { modules, userRights } = data.data;
      setDataRows(userRights);
      getColumns(userRights[0]?.rights);
      setupdatebtnshow(true);
    } catch (err) {
      console.log(err);
      setupdatebtnshow(false);
    }
  };

  const [resetPaginationToggle, setResetPaginationToggle] = useState(1);

  const onChangeFlowHandler = useCallback(
    (flow) => {
      setFlow(flow);
      setDataRows([]);
      setColumns([]);
      if (!!flow) {
        getTableData(flow);
        setResetPaginationToggle(0);
      }
    },
    [setFlow, setDataRows, setColumns, getTableData, setResetPaginationToggle]
  );

  const updateData = async () => {
    try {
      if (!!flow) {
        let rights = { STAGERIGHTS: rightsChangedIndexes.current };

        if (rightsChangedIndexes.current.length > 0) {
          const res = await axios.post(baseURL + `/generic/update`, rights, {
            headers: { Authorization: `Bearer ${token}` },
          });

          if (res.data.UpdateCase_Output.Status === -1) {
            Swal.fire({
              icon: "error",
              title: "Error Occured Whlie  updating Rights",
            });
          } else {
            getTableData(flow);
            Swal.fire({
              icon: "success",
              title: "Rights Has Been Updated Successfully",
            });
          }
        }
        rightsChangedIndexes.current = [];
      }
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error Occured Whlie  updating Rights",
      });
    }
  };
  return (
    <Grid
      container
      sx={{
        p: 1,
        backgroundColor: "#F5FEFD",
        maxWidth: "100vw",
      }}
    >
      <Grid item xs={12} md={12} sm={12}>
        <Stack
          spacing={2}
          p={2}
          direction="row"
          display="flex"
          justifyContent="space-between"
        >
          <Breadcrumbs aria-label="breadcrumb">
            <Typography
              onClick={() => props.setPage("cards")}
              sx={{ cursor: "pointer" }}
            >
              Home
            </Typography>

            <Typography color="text.primary" variant="h6">
              Stage Rights Management
            </Typography>
          </Breadcrumbs>
          {updatebtnshow && (
            <Button variant="contained" onClick={updateData}>
              Update Rights
            </Button>
          )}
        </Stack>
      </Grid>
      <Grid item md={12}>
        <Card variant="elevation" sx={{ boxShadow: 3, p: 1 }}>
          <TextField
            id="outlined-select-currency"
            select
            label="Select your flow"
            size="small"
            value={flow}
            sx={{ width: 300, mb: 1 }}
            onChange={(e) => {
              onChangeFlowHandler(e.target.value);
            }}
          >
            <MenuItem value="1">Provider Contracting </MenuItem>
            <MenuItem value="2">Self Service </MenuItem>
            <MenuItem value="3">Appeals </MenuItem>
          </TextField>
          <MaterialUiGrid
            columns={columns}
            data={dataRows}
            handleCellClick={() => {}}
            density="compact"
            uniqueCol="userId"
            ExportName="rightsTable"
          />
        </Card>
      </Grid>
    </Grid>
  );
}
