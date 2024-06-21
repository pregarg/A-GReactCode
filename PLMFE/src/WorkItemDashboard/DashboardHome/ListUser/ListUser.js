import axios from "axios";
import React, { useEffect, useState } from "react";
import UserManagementTable from "../DashboardTable/UserManagementTable";
import Switch from "react-switch";
import { useSelector } from "react-redux";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

import { baseURL } from "../../../api/baseURL";
import { useNavigate } from "react-router-dom";
import { Box, Chip } from "@mui/material";

export default function ListUsers({ page, setPage }) {
  const [buttonState, setButtonState] = useState(false);
  const [shallUpdateListUser, setShallUpdateListUser] = useState(false);

  const [listUserTableRowsData, setListUserTableRowsData] = useState([]);

  const addTableRows = () => {};

  const userType = useSelector((store) => store.auth.userType);

  useEffect(() => {
    setButtonState(userType == "A");
  }, []);

  const deleteTableRows = (index, operationValue) => {};

  const token = useSelector((state) => state.auth.token);

  const handleGridSelectChange = (
    index,
    selectedValue,
    evnt,
    triggeredFormName
  ) => {
    console.log("Inside select change trigeredFormName: ", triggeredFormName);
    let rowsInput = "";
    const { name } = evnt;
    if (triggeredFormName === "SpecialityTable") {
      //console.log('Inside SpecialityTable');
      rowsInput = [...listUserTableRowsData];
    }
  };

  const getAllUsersData = () => {
    axios
      .get(`${baseURL}/allUserManagement`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("all User: ", res.data);
        const mapppedData = res.data.map((user) => {
          const personalNameArr = user.personalName.split(" ");
          const lastName = personalNameArr.pop();
          const firstName = personalNameArr.join(" ");
          delete user.personalName;
          return {
            ...user,
            firstName,
            lastName,
          };
        });
        setListUserTableRowsData(mapppedData);
        setShallUpdateListUser(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    if (page == "listUsers" || shallUpdateListUser) {
      // axios.get(`/test.json`).then((res) => {
      getAllUsersData();
    }
  }, [page, shallUpdateListUser]);

  const searchHandler = (field, searchText) => {
    axios
      .get(`${baseURL}/users/search?${field}=${searchText}&tableName=`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const mapppedData = res.data.map((user) => {
          const personalNameArr = user.personalName.split(" ");
          const lastName = personalNameArr.pop();
          const firstName = personalNameArr.join(" ");
          delete user.personalName;
          return {
            ...user,
            firstName,
            lastName,
          };
        });
        setListUserTableRowsData(mapppedData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const cancelHandler = () => {
    getAllUsersData();
  };

  return (
    <div
      style={{
        padding: 12,
        backgroundColor: "var(--white-shade)",
      }}
    >
      <Stack spacing={2} ml="5px">
        <Breadcrumbs aria-label="breadcrumb">
          <Typography
            onClick={() => setPage("cards")}
            sx={{ cursor: "pointer" }}
          >
            Home
          </Typography>

          <Typography color="text.primary" variant="h6">
            User Management
          </Typography>
        </Breadcrumbs>
      </Stack>

      <div className="col-xs-6 col-md-12">
        <UserManagementTable
          buttonState={buttonState}
          setButtonState={setButtonState}
          listUserTableRowsData={listUserTableRowsData}
          addTableRows={addTableRows}
          deleteTableRows={deleteTableRows}
          handleGridSelectChange={handleGridSelectChange}
          setShallUdateListUser={setShallUpdateListUser}
          searchHandler={searchHandler}
          cancelHandler={cancelHandler}
        />
      </div>
    </div>
  );
}
