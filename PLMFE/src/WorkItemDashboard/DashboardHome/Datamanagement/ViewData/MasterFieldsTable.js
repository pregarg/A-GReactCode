import * as React from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import Paper from "@mui/material/Paper";
import MasterFieldRow from "./MasterFieldRow";
import FieldForm from "../CreateData/FieldForm";
export default function MasterFieldsTable({
  setTableFields,
  tableFields,
  Swal,
}) {
  const ATTRIBUTE_LIST_HEADER = [
    "Actions",
    "Field Name",
    "Type",
    "Size",
    "Null",
    "Primary",
  ];

  const [showModal, setShowModal] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [mode, setMode] = useState("Add");

  const onFieldUpdate = (fieldData, index, mode) => {
    if (mode != "Add") {
      const isPrimarySet = tableFields.find(
        (f, i) => f.isPrimary && fieldData.isPrimary && i != index
      );
      if (!!isPrimarySet) {
        Swal.fire({
          icon: "error",
          title: "Primary key already exists for another field.",
          target: document.getElementById("model"),
        });

        return;
      }

      const isFieldNameExist = tableFields.find(
        (f, i) => f.fieldName == fieldData.fieldName && i != index
      );
      if (!!isFieldNameExist) {
        Swal.fire({
          icon: "error",
          title: "Field name already exist",
          target: document.getElementById("model"),
        });

        return;
      }

      setTableFields((prevData) => {
        prevData[index] = fieldData;
        return prevData;
      });
    } else {
      const isPrimarySet = tableFields.find(
        (f) => f.isPrimary && fieldData.isPrimary
      );
      if (!!isPrimarySet) {
        Swal.fire({
          icon: "error",
          title: "Primary key already exists for another field.",
          target: document.getElementById("model"),
        });

        return;
      }
      const isAutoIdentity = tableFields.find(
        (f) => f.isAutoIdentity && fieldData.isAutoIdentity
      );

      if (!!isAutoIdentity) {
        Swal.fire({
          icon: "error",
          title: "Identity Column already exists for another field.",
          target: document.getElementById("model"),
        });

        return;
      }

      const isFieldNameExist = tableFields.find(
        (f) => f.fieldName == fieldData.fieldName
      );
      if (!!isFieldNameExist) {
        Swal.fire({
          icon: "error",
          title: "Field name already exist",
          target: document.getElementById("model"),
        });
        return;
      }

      setTableFields((prevData) => {
        prevData.push(fieldData);
        return prevData;
      });
    }
    setSelectedData(null);
    setMode(null);
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const deleteField = (i) => {
    setTableFields((prevData) => {
      return prevData.filter((v, index) => index != i);
    });
  };

  const addField = () => {
    setMode("Add");
    setShowModal(true);
  };

  const editField = (i) => {
    setMode("Edit");
    setSelectedData({
      index: i,
      data: tableFields[i],
    });
    setShowModal(true);
  };

  return (
    <React.Fragment>
      <TableContainer component={Paper} id="model">
        <Button
          sx={{ float: "right", m: 1 }}
          onClick={addField}
          variant="contained"
        >
          add
        </Button>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#55CEFF" }}>
            <TableRow>
              {ATTRIBUTE_LIST_HEADER.map((item) => (
                <TableCell key={item.id} component="th" scope="row">
                  <Typography variant="subtitle2" sx={{ fontWeight: "bold" }}>
                    {item}
                  </Typography>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableFields?.map((row, index) => (
              <MasterFieldRow
                row={row}
                index={index}
                ATTRIBUTE_LIST_HEADER={ATTRIBUTE_LIST_HEADER}
                deleteField={deleteField}
                editField={editField}
              />
            ))}
          </TableBody>
        </Table>
        {showModal && (
          <FieldForm
            onFieldUpdate={onFieldUpdate}
            showModal={showModal}
            closeModal={closeModal}
            selectedData={selectedData}
            mode={mode}
            Swal={Swal}
          />
        )}
      </TableContainer>
    </React.Fragment>
  );
}
