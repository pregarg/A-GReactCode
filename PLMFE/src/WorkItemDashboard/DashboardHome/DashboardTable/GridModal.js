import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import FormikMuiTextField from "../../../Components/CommonComponents/FormikMuiTextField";
import { Grid, MenuItem } from "@mui/material";
import { Form, Formik } from "formik";

import * as yup from "yup";
import useGetDBTables from "../../../Components/CustomHooks/useGetDBTables";

export default function GridModal(show) {
  const { convertToCase } = useGetDBTables();
  const usernameSchema = yup
    .string()
    .required("User Name is Required")
    .test({
      name: "username Exists",
      test: function (value) {
        if (
          show.listUserTableRowsData.find((item) => item.userName === value) &&
          show.operationValue === "Add"
        ) {
          return this.createError({ message: "User Name Already exists" });
        }

        return true;
      },
    });

  const validationSchema = yup.object({
    userName: usernameSchema,
    firstName: yup
      .string("Enter your firstName")
      .required("First Name is required"),
    lastName: yup
      .string("Enter your lastname")
      .required("Last Name is required"),

    mailId: yup
      .string()
      .required("Email is Required")
      .email("Invalid email")
      .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email"),

    password: yup
      .string("Enter your password")
      .required("Password is required"),
    userType: yup.string("Select User Type").required("User Type is required"),
  });
  const handleAddEditUser = (data) => {
    if (show.operationValue === "Add") {
      show.handleModalChange(false);
      show.addNewUser(data);
    } else {
      show.handleModalChange(false);
      show.saveListUser(data);
    }
  };

  const tdDataRep2 = () => {
    const { selectedUser } = show;

    return (
      <Formik
        validateOnChange={true}
        initialValues={{
          ...selectedUser,
        }}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={(data) => {
          const uppercaseData = {
            ...data,
            firstName: convertToCase(data.firstName),
            lastName: convertToCase(data.lastName),
            mailId: convertToCase(data.mailId),
            comment: convertToCase(data.comment),
            userType: convertToCase(data.userType),
          };
          handleAddEditUser(uppercaseData);
        }}
      >
        {({ values }) => (
          <Form style={{ textAlign: "left" }} noValidate autoComplete="off">
            <Modal.Header className="d-flex flex-row justify-content-end">
              <Button
                className="btn btn-outline-primary btnStyle mr-2"
                onClick={() => {
                  closeHandler();
                }}
              >
                Close
              </Button>
              {show?.buttonState && (
                <Button
                  disabled={!show.buttonState}
                  className="btn btn-outline-primary btnStyle"
                  type="submit"
                  autoFocus
                >
                  Save & Close
                </Button>
              )}
            </Modal.Header>
            <Modal.Body>
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={12} md={6} sm={6} sx={{ mb: 1, mt: 1 }}>
                  <FormikMuiTextField
                    fullWidth
                    name="firstName"
                    label="First Name"
                    size="small"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6} sx={{ mb: 1, mt: 1 }}>
                  <FormikMuiTextField
                    fullWidth
                    name="lastName"
                    label="Last Name"
                    size="small"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6} sx={{ mb: 1, mt: 1 }}>
                  <FormikMuiTextField
                    fullWidth
                    autoComplete="off"
                    name="userName"
                    label="Username*"
                    size="small"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                    value={show.operationValue === "Add" ? "" : values.userName}
                    disabled={show.operationValue === "Add" ? false : true}
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6} sx={{ mb: 1, mt: 1 }}>
                  <FormikMuiTextField
                    fullWidth
                    name="mailId"
                    label="Email*"
                    size="small"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </Grid>

                <Grid item xs={12} md={6} sm={6} sx={{ mb: 1, mt: 1 }}>
                  <FormikMuiTextField
                    fullWidth
                    name="password"
                    autoComplete="off"
                    value={show.operationValue === "Add" ? "" : values.password}
                    label="Password*"
                    size="small"
                    type="password"
                  />
                </Grid>
                <Grid item xs={12} md={6} sm={6} sx={{ mb: 1, mt: 1 }}>
                  <FormikMuiTextField
                    fullWidth
                    select
                    name="userType"
                    label="User Type"
                    size="small"
                  >
                    <MenuItem value="">Select</MenuItem>
                    <MenuItem value="A">Admin User</MenuItem>
                    <MenuItem value="N">Normal User</MenuItem>
                    <MenuItem value="P">Portal User</MenuItem>
                  </FormikMuiTextField>
                </Grid>
                <Grid item xs={12} md={12} sm={12} sx={{ mt: 1 }}>
                  <FormikMuiTextField
                    fullWidth
                    name="comment"
                    label="Comment"
                    size="small"
                    inputProps={{ style: { textTransform: "uppercase" } }}
                  />
                </Grid>
              </Grid>
            </Modal.Body>
          </Form>
        )}
      </Formik>
    );
  };

  const closeHandler = () => {
    show.handleModalChange(false);
  };

  return (
    <>
      <Modal
        show={show.modalShow}
        onHide={() => {
          show.handleModalChange(false, show.dataId.modalOperation);
          show.deleteTableRows(show.dataId, show.gridName, show.operationValue);
          show.decreaseDataIndex();
        }}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-dialog"
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        {(show.operationValue === "Add" || show.operationValue === "Edit") &&
          tdDataRep2()}
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
