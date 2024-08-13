import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";

export default function EditTableModal(show) {
  const [selectedData, setSelectedData] = useState([]);
  useEffect(() => {
    setSelectedData({ ...show.selectedData });
  }, [show.selectedData]);
  let [pk, isIdvalue] = (show.pk[0]?.split("~") || [])?.slice(0, 2);

  const closeHandler = () => {
    show.handleModalChange(false);
    setSelectedData({ ...show.selectedData });
  };
  const saveAndCloseHandler = () => {
    const hasNotNullErrors = Object.keys(selectedData)?.reduce((acc, key) => {
      if (!(key === pk && isIdvalue === "AutoIdentity")) {
        acc = acc || hasNotNullError(key);
      }
      return acc;
    }, false);
    if (hasNotNullErrors) {
      show?.Swal.fire({
        icon: "error",
        title: "Please fill in all required Fields.",
      });
    } else {
      const columns = Object.keys(selectedData)
        .filter((key) => !(key === pk && isIdvalue === "AutoIdentity"))
        .map((key) => {
          return {
            name: key,
            value: selectedData[key],
          };
        });
      let req = {};

      if (show.mode == "ADD") {
        req = {
          columns,
          dmlType: "INSERT",
          tableName: show.selectedTable,
        };
      } else {
        req = {
          columns,
          dmlType: "UPDATE",
          tableName: show.selectedTable,
          pk: pk,
          pkValue: show.selectedData[pk],
        };
      }

      show.onSaveHandler(req);

      show.handleModalChange(false);

      // show.saveListUser(selectedUser);
    }
  };
  const updateFormData = (value, field) => {
    setSelectedData((prevState) => {
      return {
        ...prevState,
        [field]: value,
      };
    });
  };

  const hasNotNullError = (columnName) => {
    return show?.headerCols?.some(
      (item) =>
        item.columnName === columnName &&
        item.constraint === "NotNull" &&
        (selectedData[columnName] === null ||
          selectedData[columnName] === undefined ||
          selectedData[columnName] === ""),
    );
  };
  function isInt(dataType) {
    return dataType.toLowerCase() === "int";
  }
  const handleCheckDataType = (key) => {
    for (const column of show.headerCols) {
      const columnName = column.columnName;
      const dataType = column?.datatype;
      if (isInt(dataType) && columnName === key) {
        return "number";
      } else {
        return "text";
      }
    }
  };
  const tdDataReplica = () => {
    if (selectedData) {
      return (
        <>
          <div className="container AddProviderLabel AddModalLabel">
            <div className="row">
              {Object.keys(selectedData)
                .filter((key) => !(key === pk && isIdvalue === "AutoIdentity"))
                .map((key) => {
                  return (
                    <div className="col-xs-6 col-md-4" key={key}>
                      <TextField
                        fullWidth
                        sx={{
                          m: 1,
                        }}
                        type={handleCheckDataType(key)}
                        defaultValue=""
                        label={key}
                        value={selectedData[key]}
                        size="normal"
                        onChange={(e) => {
                          updateFormData(e.target.value, key);
                        }}
                        error={hasNotNullError(key)}
                        helperText={
                          hasNotNullError(key) === true &&
                          `${key.toLocaleLowerCase()} is required`
                        }
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </>
      );
    }
  };

  return (
    <>
      <Modal
        show={show.modalShow}
        onHide={closeHandler}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-dialog"
        size="lg"
        aria-labelledby="example-custom-modal-styling-title"
        centered
      >
        <Modal.Header>
          <Modal.Title></Modal.Title>
          <Button
            className="btn btn-outline-primary btnStyle"
            onClick={closeHandler}
            style={{ marginLeft: "auto", marginRight: 3 }}
          >
            Close
          </Button>
          <Button
            className="btn btn-outline-primary btnStyle"
            onClick={saveAndCloseHandler}
          >
            Save & Close
          </Button>
        </Modal.Header>
        <Modal.Body>{tdDataReplica()}</Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
}
