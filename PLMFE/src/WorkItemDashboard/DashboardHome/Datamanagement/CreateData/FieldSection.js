import axios from "axios";
import React, { useState, useRef } from "react";
import FieldForm from "./FieldForm";
import FieldListSection from "./FieldList";
import { getAuthToken } from "../../../../util/auth";
import { useSelector } from "react-redux";
import { baseURL } from "../../../../api/baseURL";
import { Modal } from "react-bootstrap";

export default function FieldSection() {
  const token = useSelector((state) => state.auth.token);
  const [alertState, setAlertState] = useState("");

  const [tableFields, setTableFields] = useState([]);
  const tableName = useRef();

  const [showModal, setShowModal] = useState(false);

  const [selectedData, setSelectedData] = useState(null);
  const [mode, setMode] = useState("Add");
  const [showError, setShowError] = useState({ show: false, msg: "" });

  const onFieldUpdate = (fieldData, index, mode) => {
    console.log(fieldData, index, mode, "fieldData, index, mode");
    if (mode != "Add") {
      const isPrimarySet = tableFields.find(
        (f, i) => f.isPrimary && fieldData.isPrimary && i != index
      );
      if (!!isPrimarySet) {
        setShowError({
          show: true,
          msg: "Primary key already exists for another field.",
        });
        return;
      }

      const isFieldNameExist = tableFields.find(
        (f, i) => f.fieldName == fieldData.fieldName && i != index
      );
      if (!!isFieldNameExist) {
        setShowError({ show: true, msg: "Field name already exist" });
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
        setShowError({
          show: true,
          msg: "Primary key already exists for another field.",
        });
        return;
      }

      const isFieldNameExist = tableFields.find(
        (f) => f.fieldName == fieldData.fieldName
      );
      if (!!isFieldNameExist) {
        setShowError({ show: true, msg: "Field name already exist" });
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

  const save = () => {
    const columns = tableFields.map((row) => {
      let constraints = [];
      if (row.isNull) {
        constraints = ["NOT_NULL"];
      }
      if (row.isPrimary) {
        constraints = [...constraints, "PK"];
      }
      return {
        name: row.fieldName,
        type: row.fieldType,
        precision: row.precision,
        size: row.size,
        constraints: constraints,
      };
    });

    const table = {
      ddlType: "CREATE",
      tableName: tableName.current.value,
      columns: columns,
    };

    console.log(table);
    axios
      .post(baseURL + "/table/ddl", table, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("api response: ", res.status);
        if (res.status === 200) {
          //alert("Data Saved Succesfully");
          setAlertState("success");
          tableName.current.value = "";
          setTableFields([]);
          setTimeout(() => {
            setAlertState("");
          }, 2500);
        }
      })
      .catch((err) => {
        console.log(err.message);
        //alert("Error in saving data");
        setAlertState("failed");
        setTimeout(() => {
          setAlertState("");
        }, 2500);
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
    <>
      <div className="row mt-4">
        {alertState == "failed" && (
          <div className="alert alert-danger">Error in updating table</div>
        )}
        {alertState == "success" && (
          <div className="alert alert-success">
            Table has been updated successfully
          </div>
        )}
      </div>
      
      <div className="row mb-2">
       
        <div className="col-6">
          <form>
            <div className="row mb-2">
              <div className="col-4">
                <label className="col-form-label">Table Name</label>
              </div>
              <div className="col-6">
                <input type="text" className="form-control" ref={tableName} />
              </div>
              <div className="col-2">
                <button
                  className="btn btn-primary"
                  onClick={(e) => {
                    save();
                    e.preventDefault();
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
      <hr />
      <br />
      <div className="mb-4 mt-4">
        <FieldListSection
          tableFields={tableFields}
          deleteFieldFromList={deleteField}
          addField={addField}
          editField={editField}
        />
        <FieldForm
          onFieldUpdate={onFieldUpdate}
          showModal={showModal}
          closeModal={closeModal}
          selectedData={selectedData}
          mode={mode}
        />
        <Modal
          show={showError.show}
          onHide={() => {
            setShowError({ show: false, msg: "" });
          }}
          backdrop="static"
          keyboard={false}
          dialogClassName="delete-modal-dialog"
          size="sm"
          aria-labelledby="example-custom-modal-styling-title"
          centered
        >
          <Modal.Body>
            <p>{showError.msg}</p>
          </Modal.Body>
          <Modal.Footer>
            <button
              className="btn btn-sm btn-primary"
              onClick={() => {
                setShowError({ show: false, msg: "" });
              }}
            >
              Close
            </button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}
