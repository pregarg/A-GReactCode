import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Slide from "@mui/material/Slide";
import axios from "axios";
import { Box, Grid, TextField } from "@mui/material";
import MasterFieldsTable from "./MasterFieldsTable";
import { RxCross1 } from "react-icons/rx";
import { baseURL } from "../../../../api/baseURL";

import useSwalWrapper from "../../../../Components/SweetAlearts/hooks";
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function AddMasterTable({ open, close, getAllTables }) {
  const token = useSelector((state) => state.auth.token);

  const Swal = useSwalWrapper();
  const [tableFields, setTableFields] = React.useState([]);
  const [tableName, setTableName] = React.useState(null);
  const checkVal = () => tableFields.some((item) => item.isPrimary);

  const save = () => {
    if (tableName === null || tableName === "" || tableFields.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Table name and Table fields are Necessary",
        target: document.getElementById("model"),
      });
      return;
    }
    if (!checkVal()) {
      Swal.fire({
        icon: "error",
        title: "There is not Any Primary key Please Add Primary Key first",
        target: document.getElementById("model"),
      });
      return;
    }

    const columns = tableFields.map((row) => {
      let constraints = [];
      if (row.isNull) {
        constraints = ["NULL"];
      } else {
        constraints = ["NOT_NULL"];
      }

      if (row.isPrimary) {
        constraints = [...constraints, "PK"];
      }
      return {
        name: row.fieldName,
        type: row.fieldType,
        size: row.size,
        isAutoIdentity: row.isAutoIdentity,
        constraints: constraints,
      };
    });

    const table = {
      ddlType: "CREATE",
      tableName: tableName,
      columns: columns,
    };

    axios
      .post(baseURL + "/table/ddl", table, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "Data added successfully",
          });
          setTableName(null);
          setTableFields([]);
          getAllTables();
          close();
        }
      })
      .catch((err) => {
        console.log(err.message);
        Swal.fire({
          icon: "error",
          title: "Error while adding data",
          target: document.getElementById("model"),
        });
      });
  };
  const checkSpecialChar = (e) => {
    if (!/[0-9a-zA-Z_]/.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <React.Fragment>
      <Dialog
        fullScreen
        open={open}
        onClose={close}
        TransitionComponent={Transition}
      >
        <AppBar sx={{ position: "relative" }} id="model">
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => {
                setTableFields([]);
                close();
              }}
              aria-label="close"
            >
              <RxCross1 />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Create Master Data{" "}
            </Typography>
            <Button autoFocus color="inherit" variant="outlined" onClick={save}>
              Submit
            </Button>
          </Toolbar>
        </AppBar>
        <Box sx={{ mt: 2, p: 2 }}>
          <Grid container spacing={2}>
            <Grid
              item
              xs={12}
              sm={12}
              md={12}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <TextField
                name="tableName"
                size="small"
                sx={{ width: 350 }}
                variant="outlined"
                label="Table Name"
                onChange={(e) => setTableName(e.target.value)}
                onKeyDown={checkSpecialChar}
              />
            </Grid>
          </Grid>
          <Grid>
            <MasterFieldsTable
              setTableFields={setTableFields}
              tableFields={tableFields}
              Swal={Swal}
            />
          </Grid>
        </Box>
      </Dialog>
    </React.Fragment>
  );
}
