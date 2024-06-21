import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function TrainingTable({
  trainingTableRowsData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridDateChange,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  lockStatus,
  editTableRows,
  gridFieldTempState,
}) {
  TrainingTable.displayName = "TrainingTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  //const apiUrl = 'http://localhost:8081/api';

  const { getGridJson, convertToCase } = useGetDBTables();

  const programAttenededOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];

  const tdDataReplica = (index) => {
    //console.log("Inside tdDataReplica");
    //if(trainingTableRowsData!==undefined && trainingTableRowsData.length>0){
    const data = getGridJson(gridFieldTempState);
    //console.log("Training Data: ", data);
    //console.log("tdDataReplica index: ",index);

    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label>Did you participate in any Residency Program?</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.programAtteneded}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    TrainingTable.displayName
                  )
                }
                options={programAttenededOptions}
                name="programAtteneded"
                id="programAttenededDropDown"
                isClearable
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Type</label>
              <br />
              <input
                type="text"
                value={
                  "type" in data && data.type.value !== undefined
                    ? convertToCase(data.type.value)
                    : convertToCase(data.type)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(index, evnt, TrainingTable.displayName)
                }
                name="type"
                className="form-control"
                maxLength="20"
                title="Please Enter Valid Type"
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Institue/Hospital Name</label>
              <br />
              <input
                type="text"
                value={
                  "instituteName" in data &&
                  data.instituteName.value !== undefined
                    ? convertToCase(data.instituteName.value)
                    : convertToCase(data.instituteName)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(index, evnt, TrainingTable.displayName)
                }
                name="instituteName"
                className="form-control"
                maxLength="255"
                title="Please Enter Valid Institue/Hospital Name"
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">Completion Date</label>
              <br />
              <div className="form-floating">
                <ReactDatePicker
                  className="example-custom-input-modal"
                  selected={
                    "completionDate" in data &&
                    data.completionDate.value !== undefined
                      ? data.completionDate.value
                      : data.completionDate
                  }
                  name="completionDate"
                  onChange={(selectValue, event) =>
                    handleGridDateChange(
                      index,
                      selectValue,
                      "completionDate",
                      TrainingTable.displayName
                    )
                  }
                  peekNextMonth
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="MM/dd/yyyy"
                  id="datePicker"
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
    //}
  };

  const tdData = () => {
    if (
      trainingTableRowsData !== undefined &&
      trainingTableRowsData.length > 0
    ) {
      return trainingTableRowsData.map((data, index) => {
        return (
          <tr key={index} >
            {lockStatus !== "Y" && (
              <td>
                <span
                  style={{
                    display: "flex",
                  }}
                >
                  <button
                    className="deleteBtn"
                    style={{ float: "left" }}
                    onClick={() => {
                      deleteTableRows(
                        index,
                        TrainingTable.displayName,
                        "Force Delete"
                      );
                      handleOperationValue("Force Delete");
                      decreaseDataIndex();
                    }}
                  >
                    <i className="fa fa-trash"></i>
                  </button>
                  <button
                    className="editBtn"
                    style={{ float: "right" }}
                    type="button"
                    onClick={() => {
                      editTableRows(index, TrainingTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(index);
                      handleOperationValue("Edit");
                    }}
                  >
                    <i className="fa fa-edit"></i>
                  </button>
                </span>
              </td>
            )}
            <td className="tableData">
              {"programAtteneded" in data &&
              data.programAtteneded.value !== undefined
                ? convertToCase(data.programAtteneded.label)
                : convertToCase(data.programAtteneded)}
            </td>
            <td className="tableData">
              {"type" in data && data.type.value !== undefined
                ? convertToCase(data.type.value)
                : convertToCase(data.type)}
            </td>
            <td className="tableData">
              {"instituteName" in data && data.instituteName.value !== undefined
                ? convertToCase(data.instituteName.value)
                : convertToCase(data.instituteName)}
            </td>
            {/* <td className='tableData'>
                    {(('department' in data) && (data.department.value !== undefined)) ? (data.department.value) : (data.department)}
                </td>
                <td className='tableData'>
                    {(('speciality' in data) && (data.speciality.value !== undefined)) ? (data.speciality.value) : (data.speciality)}
                </td> */}

            <td className="tableData">
              {"completionDate" in data &&
              data.completionDate.value !== undefined
                ? formatDate(data.completionDate.value)
                : formatDate(data.completionDate)}
            </td>
          </tr>
        );
      });
    }
  };

  const formatDate = (dateObj) => {
    //console.log("Inside formatDate ", typeof dateObj);

    if (dateObj) {
      if (typeof dateObj === "string") {
        const localDate = new Date(Date.parse(dateObj));

        //console.log("Inside formatDate typeof", Date.parse(dateObj) , localDate.getDate());
        dateObj = localDate;
      } else if (typeof dateObj === "number") {
        const localDate2 = new Date(dateObj);

        //console.log("Inside formatDate typeof: ", localDate2.getDate());
        dateObj = localDate2;
      }
      let dd = dateObj.getDate();
      let mm = dateObj.getMonth() + 1;
      let yyyy = dateObj.getFullYear();
      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      let formattedDate = mm + "/" + dd + "/" + yyyy;
      //console.log("formattedDate: ",formattedDate);
      return formattedDate;
    }
    return null;
  };

  const decreaseDataIndex = () => {
    if (operationValue === "Add" || operationValue === "Force Delete") {
      const indx = dataIndex - 1;
      setDataIndex(indx);
    }
  };

  const handleOperationValue = (oprtnValue) => {
    setOperationValue(oprtnValue);
  };

  const handleModalChange = (flag) => {
    // setDataIndex({
    //     ...dataIndex,
    //     ...opertnData
    // });
    //console.log("Handle Modal Change Data Index After: ",dataIndex);
    setModalShow(flag);
  };

  const handleDataIndex = (index) => {
    //console.log("Inside setDataIndex: ",index);
    setDataIndex(index);
  };

  return (
    <>
      <table className="table table-bordered tableLayout" id="TrainingTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {lockStatus !== "Y" && (
              <th style={{ width: "7.5%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(TrainingTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(trainingTableRowsData.length);
                    handleOperationValue("Add");
                  }}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </th>
            )}
            <th style={{ width: "20%" }} scope="col">
              Did you participate in any Residency Program?
            </th>
            <th scope="col">Type</th>
            <th scope="col">Institue/Hospital Name</th>
            {/* <th scope="col">Department</th>
                    <th scope="col">Specialty</th> */}
            <th scope="col">Completion Date</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows TrainingTableRowsData={TrainingTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>

      <GridModal
        name={"Training Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={TrainingTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
      ></GridModal>
    </>
  );
}
