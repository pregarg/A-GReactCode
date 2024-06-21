import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Dialog,
  DialogActions,
  DialogContent,
  Grid,
  InputLabel,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";

const FieldForm = ({
  onFieldUpdate,
  showModal,
  closeModal,
  mode,
  selectedData,
}) => {
  const AddFieldValues = {
    fieldName: "",
    fieldType: "",
    size: 0,
    isNull: true,
    isPrimary: false,
    isAutoIdentity: false,
  };
  const [primaryNoDisabled, setPrimaryNoDisabled] = React.useState(
    selectedData?.data.isAutoIdentity ? true : false
  );
  const initialValues = mode === "Add" ? AddFieldValues : selectedData?.data;

  const validationSchema = Yup.object().shape({
    fieldName: Yup.string().required("Field Name is required"),
    fieldType: Yup.string().required("Field Type is required"),
    size: Yup.number().min(0).integer(),
  });

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const index = mode === "Add" ? null : selectedData.index;
      onFieldUpdate(values, index, mode);
      resetForm();
    },
  });

  const precisionFieldState = (e) => {
    const disableField = e.target.value !== "int";
    formik.handleChange(e);
    formik.setFieldValue("size", disableField ? 255 : 0);
    formik.setFieldValue("autoId", false);
    setPrimaryNoDisabled(false);
    if (disableField) {
      formik.setFieldValue("isAutoIdentity", false);
      formik.setFieldValue("autoId", true);
    }
  };

  const resetForm = () => {
    formik.resetForm();
    closeModal();
  };

  const primaryKeyHandler = (e) => {
    const isPrimary = e.target.value === "true";
    formik.setFieldValue("isPrimary", isPrimary);
    formik.setFieldValue("isNull", !isPrimary);
  };

  const identHandler = (e) => {
    const isAutoIdentity = e.target.value === "true";
    formik.setFieldValue("isAutoIdentity", isAutoIdentity);
    formik.setFieldValue("isPrimary", isAutoIdentity);
    formik.setFieldValue("isNull", !isAutoIdentity);
    setPrimaryNoDisabled(isAutoIdentity);
  };

  return (
    <Dialog
      open={showModal}
      onClose={closeModal}
      id="addModel"
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <form onSubmit={formik.handleSubmit}>
        <DialogContent>
          <Grid
            container
            rowSpacing={2}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item md={6}>
              <TextField
                size="small"
                label="Field Name"
                name="fieldName"
                type="text"
                fullWidth
                onKeyDown={(e) => {
                  if (!/[0-9a-zA-Z_]/.test(e.key)) {
                    e.preventDefault();
                  }
                }}
                onChange={formik.handleChange}
                value={formik.values.fieldName}
                error={
                  formik.touched.fieldName && Boolean(formik.errors.fieldName)
                }
                helperText={formik.touched.fieldName && formik.errors.fieldName}
              />
            </Grid>
            <Grid item md={6}>
              <TextField
                size="small"
                select
                name="fieldType"
                sx={{ minWidth: 250 }}
                label="Field Type"
                fullWidth
                onChange={(e) => {
                  formik.handleChange(e);
                  precisionFieldState(e);
                }}
                value={formik.values.fieldType}
                error={
                  formik.touched.fieldType && Boolean(formik.errors.fieldType)
                }
                helperText={formik.touched.fieldType && formik.errors.fieldType}
              >
                <MenuItem value={"varchar"}>VARCHAR</MenuItem>
                <MenuItem value={"nvarchar"}>NVARCHAR</MenuItem>
                <MenuItem value={"int"}>INT</MenuItem>
              </TextField>
            </Grid>
            <Grid item md={6}>
              <TextField
                type="number"
                size="small"
                fullWidth
                name="size"
                autoFocus
                defaultValue={0}
                disabled={
                  formik.values.fieldType === "date" ||
                  formik.values.fieldType === "int"
                }
                label="Size"
                onInput={(e) => {
                  e.target.value = Math.min(
                    4000,
                    Math.max(0, parseInt(e.target.value))
                  )
                    .toString()
                    .slice(0, 4);
                }}
                onChange={formik.handleChange}
                value={formik.values.size}
                error={formik.touched.size && Boolean(formik.errors.size)}
                helperText={formik.touched.size && formik.errors.size}
              />
            </Grid>
            <Grid item md={6} display={"flex"}>
              <Grid>
                <InputLabel>IsNull</InputLabel>
                <input
                  type="radio"
                  name="isNull"
                  value="true"
                  className="me-2"
                  checked={formik.values.isNull === true}
                  onChange={() => formik.setFieldValue("isNull", true)}
                  disabled={formik.values.isPrimary}
                />
                Yes
                <input
                  type="radio"
                  name="isNull"
                  value="false"
                  className="ms-3 me-2"
                  checked={formik.values.isNull === false}
                  onChange={() => {
                    formik.setFieldValue("isNull", false);
                  }}
                  disabled={formik.values.isPrimary}
                />
                No
              </Grid>
              <Grid sx={{ ml: "auto" }}>
                <InputLabel>Is Primary</InputLabel>
                <input
                  type="radio"
                  name="isPrimary"
                  value="true"
                  className="me-2"
                  checked={formik.values.isPrimary === true}
                  onChange={(e) => {
                    formik.handleChange(e);
                    primaryKeyHandler(e);
                  }}
                  disabled={primaryNoDisabled}
                />
                Yes
                <input
                  type="radio"
                  name="isPrimary"
                  value="false"
                  className="ms-3 me-2"
                  checked={formik.values.isPrimary === false}
                  onChange={(e) => {
                    formik.handleChange(e);
                    primaryKeyHandler(e);
                  }}
                  disabled={primaryNoDisabled}
                />
                No
              </Grid>
            </Grid>
            <Grid item md={6} display={"flex"}>
              <Grid>
                <InputLabel>isAutoIdentity</InputLabel>
                <input
                  type="radio"
                  name="isAutoIdentity"
                  value={true}
                  className="me-2"
                  checked={formik.values.isAutoIdentity === true}
                  onChange={(e) => {
                    formik.handleChange(e);
                    identHandler(e);
                  }}
                  disabled={formik.values.autoId}
                />
                Yes
                <input
                  type="radio"
                  name="isAutoIdentity"
                  value={false}
                  disabled={formik.values.autoId}
                  className="ms-3 me-2"
                  checked={formik.values.isAutoIdentity === false}
                  onChange={(e) => {
                    formik.handleChange(e);
                    identHandler(e);
                  }}
                />
                No
              </Grid>
            </Grid>{" "}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={resetForm}>
            Cancel
          </Button>
          <Button variant="contained" type="submit" autoFocus>
            {mode === "Add" ? "Add Field" : "Update Field"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default FieldForm;
