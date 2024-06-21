import React, { useState } from "react";
import { useAxios } from "../../../api/axios.hook";
import GridModal from "./GridModal";
import DeleteModal from "./DeleteModal";
import { baseURL } from "../../../api/baseURL";
import { useSelector } from "react-redux";
import { Box, Button, Grid, Typography } from "@mui/material";
import Switch from "react-switch";
import { AiFillDelete } from "react-icons/ai";
import { AiFillEdit } from "react-icons/ai";
import { AiOutlineUserAdd } from "react-icons/ai";
import MaterialUiGrid from "../../../Components/CommonComponents/MaterialUIGrid";
import useSwalWrapper from "../../../Components/SweetAlearts/hooks";

export default function UserManagementTable({
  listUserTableRowsData,
  setButtonState,
  buttonState,
  setShallUdateListUser,
}) {
  const Swal = useSwalWrapper();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const [selectedUser, setSelectedUser] = useState();

  const { customAxios: axios } = useAxios();

  const editTableDataHandler = (user, mode) => {
    handleSelectedUser(user);
    handleOperationValue(mode);
    handleModalChange(true);
  };

  const handleSelectedUser = (user) => {
    setSelectedUser(user);
  };
  const token = useSelector((state) => state.auth.token);
  const deleteTableDataHandler = (id) => {
    handleOperationValue("Force Delete");

    axios
      .delete(`${baseURL}/deleteUserManagement/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        setShallUdateListUser(true);
        setDeleteModal({ show: false, id: null });
        Swal.fire({
          icon: "success",
          title: "The User Has Been Successfully Deleted",
        });
      })
      .catch((err) => {
        console.log(err);
        setDeleteModal({ show: false, id: null });
        Swal.fire({
          icon: "error",
          title: "Error Occured While  Deleting User ",
        });
      });
  };

  const cancelDeleteHandler = () => {
    setDeleteModal({ show: false, id: null });
  };

  const confirmDeleteHandler = (id) => {
    setDeleteModal({ show: true, id: id });
  };
  const intialUser = {
    firstName: null,
    lastName: null,
    mailId: null,
    userName: null,
    password: null,
    userType: null,
    comment: null,
  };

  const handleOperationValue = (oprtnValue) => {
    setOperationValue(oprtnValue);
  };

  const handleModalChange = (flag) => {
    setModalShow(flag);
  };

  const saveListUser = (data) => {
    axios
      .put(`${baseURL}/updateUserManagement`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        setShallUdateListUser(true);
        Swal.fire({
          icon: "success",
          title: "The User Has Been Updated Successfully",
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: "error",
          title: "There is an Error While Updating User",
        });
        console.log(err);
      });
  };

  const addUser = (data) => {
    axios
      .post(baseURL + "/saveUserManagement", data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data == "duplicate") {
          Swal.fire({
            icon: "error",
            title: "The User Already Exists",
          });
        } else {
          Swal.fire({
            icon: "success",
            title: "The User Has Been Successfully Added",
          });
          setShallUdateListUser(true);
        }
      })
      .catch((err) => {
        console.log(JSON.stringify(err));
        Swal.fire({
          icon: "error",
          title: "Error While Adding User",
        });

        if (err.reponse.data == "User Name already exists") {
          Swal.fire({
            icon: "error",
            title: "User Name already exists",
          });
        }
      });
  };

  const columns = [
    {
      field: "Actions",
      headerName: "Actions",
      headerClassName: "super-app-theme--header",
      disableColumnMenu: true,
      renderHeader: () => <b>Actions</b>,
      flex: 1,
      sortable: false,
      minWidth: 75,
      hide: true,

      renderCell: (params) =>
        buttonState && (
          <>
            <AiFillDelete
              fontSize="16px"
              color="#990f02"
              cursor="pointer"
              onClick={() => {
                confirmDeleteHandler(params?.row?.userId);
              }}
            />
            <AiFillEdit
              fontSize="16px"
              color="black"
              cursor="pointer"
              onClick={() => {
                editTableDataHandler(params?.row, "Edit");
              }}
            />
          </>
        ),
    },
    {
      field: "firstName",
      disableColumnMenu: true,
      headerName: "First Name",
      headerClassName: "super-app-theme--header",
      minWidth: 155,
      flex: 1,
      renderHeader: () => <b>First Name</b>,
    },
    {
      field: "lastName",
      disableColumnMenu: true,
      headerName: "Last Name",
      headerClassName: "super-app-theme--header",
      flex: 1,
      minWidth: 155,
      renderHeader: () => <b>Last Name</b>,
    },
    {
      field: "userName",
      disableColumnMenu: true,
      headerClassName: "super-app-theme--header",
      headerName: "User Name",
      flex: 1,
      minWidth: 160,
      renderHeader: () => <b>User Name</b>,
    },
    {
      field: "userType",
      headerClassName: "super-app-theme--header",
      headerName: "User Type",
      renderHeader: () => <b>User Type</b>,
      disableColumnMenu: true,
      flex: 1,
      sortable: false,
      minWidth: 160,

      valueGetter: (params) =>
        params.row.userType === "A"
          ? "Admin User"
          : params.row.userType === "P"
          ? "Portal User"
          : "Normal User",
    },
    {
      field: "mailId",
      headerName: "Email",
      disableColumnMenu: true,
      headerClassName: "super-app-theme--header",
      flex: 1,
      minWidth: 200,
      renderHeader: () => <b>Email</b>,
      valueGetter: (params) => `${params.row.mailId}`,
    },
    {
      field: "comment",
      headerName: "Comment",
      headerClassName: "super-app-theme--header",
      disableColumnMenu: true,
      cellClassName: "super-app-comment",
      renderHeader: () => <b>Comment</b>,
      sortable: false,
      minWidth: 300,
      renderCell: (params) => (
        <Typography sx={{ flex: 1, wordBreak: "break-all" }}>
          {params.row.comment}
        </Typography>
      ),
    },
  ];
  const handleCellClick = (params) => {
    if (params.field !== "Actions") editTableDataHandler(params?.row, "Edit");
  };

  return (
    <Grid container>
      <Box
        sx={{
          display: "flex",
          mt: -4,
          ml: "auto",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div className="adminSwitch">
          <label htmlFor="medicaidSwitch" style={{ fontWeight: 500 }}>
            Admin User
          </label>

          <Switch
            id="medicaidSwitch"
            name="medicaid"
            onChange={(isChecked) => {
              setButtonState(isChecked);
            }}
            checked={buttonState}
            uncheckedIcon={false}
            checkedIcon={false}
            disabled={true}
          />
        </div>
        {buttonState && (
          <Button
            variant="contained"
            sx={{ height: "40px", ml: 2, mt: -1 }}
            startIcon={<AiOutlineUserAdd />}
            onClick={() => {
              editTableDataHandler(intialUser, "Add");
            }}
          >
            Add User
          </Button>
        )}
      </Box>
      <Grid item md={12}>
        <MaterialUiGrid
          data={listUserTableRowsData}
          uniqueCol={"userId"}
          density="compact"
          pageSize={10}
          columns={
            buttonState
              ? columns
              : columns?.filter((item) => item?.field !== "Actions")
          }
          handleCellClick={buttonState ? handleCellClick : () => {}}
          ExportName="Users"
        />
      </Grid>
      <GridModal
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        operationValue={operationValue}
        saveListUser={saveListUser}
        addNewUser={addUser}
        selectedUser={selectedUser}
        buttonState={buttonState}
        listUserTableRowsData={listUserTableRowsData}
      />
      <DeleteModal
        deleteModal={deleteModal}
        onDelete={deleteTableDataHandler}
        onCancel={cancelDeleteHandler}
      />
    </Grid>
  );
}
