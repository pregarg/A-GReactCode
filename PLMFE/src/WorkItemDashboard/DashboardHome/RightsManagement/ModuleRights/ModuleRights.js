import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { baseURL } from "../../../../api/baseURL";
import { useSelector } from "react-redux";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Checkbox,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import useSwalWrapper from "../../../../Components/SweetAlearts/hooks";
import MaterialUiGrid from "../../../../Components/CommonComponents/MaterialUIGrid";

export default function ModuleRights(props) {
  const [columns, setColumns] = useState([]);
  const [dataRows, setDataRows] = useState([]);
  const rightsChangedIndexes = useRef([]);
  const [updatebtnshow, setupdatebtnshow] = useState("");
  const token = useSelector((state) => state.auth.token);
  let Swal = useSwalWrapper();

  const changeRights = (checked, row, module) => {
    let existingRightIndex = rightsChangedIndexes?.current?.findIndex(
      (right) =>
        (right.STAGEID === module?.id && right?.USERID === row?.userId) ||
        (right["whereClause"]?.MODULEID === module?.id &&
          right["whereClause"]?.MODULEID === row?.userId),
    );

    if (checked) {
      const updateRight = {
        MODULEID: module.id,
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
        whereClause: { MODULEID: module.id, USERID: row?.userId },
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
                    (right) => right.name === module.name,
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

  useEffect(() => {
    getTableData();
  }, []);
  const getTableData = async () => {
    try {
      const data = await axios.get(baseURL + `/rights/modules`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("data==== ", data);
      const { modules, userRights } = data.data;
      setDataRows(userRights);
      getColumns(userRights[0].rights);
      setupdatebtnshow(true);
    } catch (err) {
      console.log(err);
      setDataRows([]);
      setupdatebtnshow(false);
    }
  };

  const updateData = async () => {
    let rights = { MODULERIGHTS: rightsChangedIndexes.current };
    try {
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
          getTableData();
          Swal.fire({
            icon: "success",
            title: "Rights Has Been Updated Successfully",
          });
        }
      }
      rightsChangedIndexes.current = [];
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        title: "Error Occured Whlie  updating Rights",
      });
    }
  };

  return (
    <Grid container sx={{ p: 1, backgroundColor: "#F5FEFD" }} layout={"row"}>
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
              Module Rights Management
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
          <CardContent>
            <MaterialUiGrid
              columns={columns}
              data={dataRows}
              handleCellClick={() => {}}
              density="compact"
              uniqueCol="userId"
              ExportName="rightsTable"
            />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}
