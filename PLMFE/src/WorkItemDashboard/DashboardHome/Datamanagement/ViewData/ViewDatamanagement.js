import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import EditTableDataModal from "./EditTableDataModal";
import "./ViewDatamanagement.css";
import ViewDeleteModal from "./ViewDeleteModal";
import { useSelector } from "react-redux";
import { baseURL } from "../../../../api/baseURL";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import MaterialUiGrid from "../../../../Components/CommonComponents/MaterialUIGrid";
import { AiFillDelete, AiFillEdit } from "react-icons/ai";
import useSwalWrapper from "../../../../Components/SweetAlearts/hooks";
import AddMasterTable from "./AddMasterTable";
import DeleteModal from "../CreateData/DeleteModal";

export default function ViewDatamanagement(props) {
  const [modalShow, setModalShow] = useState(false);
  const [selectedData, setSelectedData] = useState();
  const token = useSelector((state) => state.auth.token);
  const [tableList, setTableList] = useState([]);
  const [columns, setColumns] = useState([]);
  const [headerCols, setHeadercols] = useState([]);
  const [fieldCol, setFielCol] = React.useState([]);
  const [dataRows, setDataRows] = useState([]);
  const [pk, setPk] = useState([]);
  const [selectedTable, setSelecteTable] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [tableDeleteDialog, setTableDeleteDialog] = useState({
    open: false,
    id: null,
  });
  const [mode, setMode] = useState();
  const [showReport, setShowReport] = React.useState({
    show: false,
    rowData: {},
  });
  const [addTableDialog, setAddTableDialog] = React.useState(false);
  const Swal = useSwalWrapper();

  useEffect(() => {
    getAllTables();
  }, []);

  const closeDeleteDialog = () => {
    setTableDeleteDialog({ open: false, id: null });
  };

  const openDeleteDialog = (id) => {
    setTableDeleteDialog({ open: true, id: id });
  };

  const deleteMasterTable = (id) => {
    setTableDeleteDialog({ open: false, id: null });
    const table = {
      ddlType: "DROP",
      tableName: id,
    };
    axios
      .post(`${baseURL}/table/ddl`, table, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Table deleted Successfully",
          });
          getAllTables();
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "Error occured while  deleting Table ",
        });
        console.log(err.message);
      });
  };

  const editHandler = (row) => {
    setSelectedData((prev) => {
      return row;
    });
    setModalShow(true);
  };
  const deleteTableDataHandler = async (req) => {
    try {
      const res = await axios.post(`${baseURL}/table/dml`, req, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await getTableData(req.tableName);
      setSelectedData(null);
      Swal.fire({
        icon: "success",
        title: "Row deleted Successfully",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error occured while  deleting row ",
      });
      console.log(err);
      setSelectedData(null);
    }
  };

  const onSaveHandler = async (req) => {
    try {
      const res = await axios.post(`${baseURL}/table/dml`, req, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tblData = await getTableData(req.tableName);
      setSelectedData(null);
      Swal.fire({
        icon: "success",
        title: "Data added Successfully",
      });
    } catch (err) {
      console.log(err);
      setSelectedData(null);
      Swal.fire({
        icon: "error",
        title: "Error occured while  Adding Data ",
      });
    }
  };

  const cancelDeleteHandler = () => {
    //setDeleteModal({show: false, id: null});
  };
  const confirmDeleteHandler = (row) => {
    setSelectedData(row);
    setDeleteModal({ show: true, id: null });
  };
 
  let actionColumn = {
    field: "Actions",
    headerName: "Actions",
    headerClassName: "super-app-theme--header",
    disableColumnMenu: true,
    cellClassName: "super-app-comment",
    flex: 1,
    renderHeader: () => <b>Actions</b>,
    sortable: false,
    minWidth: 75,
    renderCell: (params) => (
      <>
        <AiFillDelete
          fontSize="18px"
          color="#990f02"
          cursor="pointer"
          onClick={() => {
            confirmDeleteHandler(params.row);
          }}
        />

        <AiFillEdit
          fontSize="18px"
          color="black"
          cursor="pointer"
          onClick={() => {
            editHandler(params.row);
            setMode("EDIT");
          }}
        />
      </>
    ),
  };
  const masterTableColumn = (columns) => {
    if (columns?.length > 0) {
      let cols = columns.map((item, index) => ({
        field: item.columnName,
        headerName: item.columnName,
        renderHeader: () => <b>{item.columnName}</b>,
        headerClassName: "super-app-theme--header",
        disableColumnMenu: true,
        cellClassName: "super-app-comment",
        sortable: false,
        flex: 1,
        minWidth: 160,
      }));
      return [actionColumn, ...cols];
    } else {
      return [];
    }
  };

  const createNew = () => {
    let data = {};
    fieldCol
      ?.filter((d) => !!d)
      ?.map((d) => {
        let value = d?.split("~")[0];
        data[value] = "";
      });
    setMode("ADD");
    setSelectedData(data);
  };

  const getAllTables = () => {
    axios
      .get(`${baseURL}/table/list`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          setTableList(res.data);
        }
      })
      .catch((err) => console.log(err));
  };
  const getTableData = async (tableName) => {
    try {
      const data = await axios.get(`${baseURL}/table/data/${tableName}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { columns, rows, pks } = data.data;
      setFielCol(columns);
      setPk(pks);
      let resultArray = columns.map((item) => {
        let values = item.split("~");
        return {
          columnName: values[0],
          datatype: values[1],
          constraint: values[2],
        };
      });
      setHeadercols(resultArray);
      const headers = masterTableColumn(resultArray);

      setColumns(headers);
      setDataRows(rows);
      setSelecteTable(tableName);
    } catch (err) {
      console.log(err);
      setPk([]);
      setColumns([]);
      setDataRows([]);
      setSelecteTable("");
      setHeadercols([]);
    }
  };

  const handleModalChange = () => {
    setModalShow(false);
  };

  const handleCellClick = (params) => {
    setShowReport({
      ...showReport,
      open: true,
      rowData: params?.row,
    });
    getTableData(params?.row?.tableName);
  };
  let leftTableCols = [
    {
      field: "tableName",
      headerName: "Master Tables",
      headerClassName: "super-app-theme--header",
      cellClassName: "super-app-comment",
      flex: 1,
      disableColumnMenu: true,
      renderHeader: () => <b>Master Tables</b>,
      sortable: false,
      width: 200,
    },
    {
      field: "Actions",
      headerName: "Actions",
      headerClassName: "super-app-theme--header",
      renderHeader: () => <b>Actions</b>,
      disableColumnMenu: true,
      cellClassName: "super-app-comment",
      sortable: false,
      width: 90,
      renderCell: (params) => (
        <>
          <AiFillDelete
            fontSize="20px"
            color="#990f02"
            cursor="pointer"
            onClick={() => {
              openDeleteDialog(params?.row?.tableName);
            }}
          />
        </>
      ),
    },
  ];
  return (
    <Grid container sx={{ p: 1, backgroundColor: "#F5FEFD" }} layout={"row"}>
      <Grid item xs={12} md={12} sm={12}>
        <Stack spacing={2} p={2} direction="row">
          <Grid item md={6}>
            <Breadcrumbs aria-label="breadcrumb">
              <Typography
                onClick={() => props.setPage("cards")}
                sx={{ cursor: "pointer" }}
              >
                Home
              </Typography>

              <Typography color="text.primary" variant="h6">
                View | Modify Table
              </Typography>
            </Breadcrumbs>
          </Grid>

          <Grid
            item
            md={6}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button variant="contained" onClick={() => setAddTableDialog(true)}>
              Create Master Data
            </Button>
          </Grid>
        </Stack>
      </Grid>
      <Grid item xs={3.5} sm={3.5} md={3.5} sx={{ minHeight: "100%" }}>
        <MaterialUiGrid
          data={tableList?.map((item, index) => ({
            tableName: item,
            id: index,
          }))}
          density="compact"
          uniqueCol={"id"}
          ExportName="Master Tables"
          pageSize={10}
          columns={leftTableCols}
          handleCellClick={handleCellClick}
        />
      </Grid>
      <Grid item xs={8.5} layout={"row"}>
        <Card
          variant="outlined"
          sx={{
            ml: 1,
            minHeight: " calc(100vh - 18vh)",
            maxWidth: "90vw",
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
                <Typography variant="subtitle2" fontSize="18px" p={"1px"}>
                  {showReport?.rowData?.tableName}
                </Typography>
                <Box>
                  {selectedTable && (
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => {
                        setModalShow(true);
                        createNew();
                      }}
                    >
                      Add Row
                    </Button>
                  )}
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
                  ExportName={showReport?.rowData?.tableName}
                  columns={columns}
                  data={dataRows}
                  pageSize={10}
                  uniqueCol={pk.length > 0 && pk[0]?.split("~")[0]}
                  density="compact"
                  handleCellClick={() => {}}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>
      

      <EditTableDataModal
        modalShow={modalShow}
        selectedData={selectedData}
        columns={columns}
        handleModalChange={handleModalChange}
        selectedTable={selectedTable}
        onSaveHandler={onSaveHandler}
        mode={mode}
        pk={pk}
        headerCols={headerCols}
        Swal={Swal}
      />
      <ViewDeleteModal
        deleteModal={deleteModal}
        onDelete={deleteTableDataHandler}
        onCancel={cancelDeleteHandler}
        selectedData={selectedData}
        selectedTable={selectedTable}
        setDeleteModal={setDeleteModal}
        pk={pk}
      />
      <AddMasterTable
        open={addTableDialog}
        close={() => setAddTableDialog(false)}
        getAllTables={getAllTables}
      />
      <DeleteModal
        openDialog={tableDeleteDialog.open}
        closeDialog={closeDeleteDialog}
        id={tableDeleteDialog.id}
        deleteFunc={deleteMasterTable}
        Content={"Do you want to delete this table?"}
      />
    </Grid>
  );
}
