import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function WorkTable({
  workTableRowsData,
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
  WorkTable.displayName = "WorkTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  //const apiUrl = 'http://localhost:8081/api';

  const { getGridJson, convertToCase } = useGetDBTables();

  const currentEmpOptions = [
    { value: "Y", label: "Yes" },
    { value: "N", label: "No" },
  ];

  const tdDataReplica = (index) => {
    console.log("Inside tdDataReplica");
    //if (workTableRowsData!==undefined && workTableRowsData.length > 0) {
    //console.log("tdDataReplica index: ",index);

    const data = getGridJson(gridFieldTempState);
    console.log("Work Data: ", data);
    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Practice/Employer Name</label>
              <br />
              <input
                type="text"
                value={
                  "empName" in data && data.empName.value !== undefined
                    ? convertToCase(data.empName.value)
                    : convertToCase(data.empName)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(index, evnt, WorkTable.displayName)
                }
                name="empName"
                className="form-control"
                maxLength="100"
                title="Please Enter Valid Practice/Employer Name"
                disabled={lockStatus == "V"}
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">Start Date</label>
              <br />
              <div className="form-floating">
                <ReactDatePicker
                  className="example-custom-input-modal"
                  selected={
                    "startDate" in data && data.startDate.value !== undefined
                      ? data.startDate.value
                      : data.startDate
                  }
                  name="startDate"
                  onChange={(selectValue, event) =>
                    handleGridDateChange(
                      index,
                      selectValue,
                      "startDate",
                      WorkTable.displayName
                    )
                  }
                  peekNextMonth
                  showMonthDropdown
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="MM/dd/yyyy"
                  id="datePicker"
                  disabled={lockStatus == "V"}
                />
              </div>
            </div>
            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">End Date</label>
              <br />
              <div className="form-floating">
                <ReactDatePicker
                  className="example-custom-input-modal"
                  selected={
                    "endDate" in data && data.endDate.value !== undefined
                      ? data.endDate.value
                      : data.endDate
                  }
                  name="endDate"
                  onChange={(selectValue, event) =>
                    handleGridDateChange(
                      index,
                      selectValue,
                      "endDate",
                      WorkTable.displayName
                    )
                  }
                  peekNextMonth
                  showMonthDropdown
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="MM/dd/yyyy"
                  id="datePicker"
                  disabled={lockStatus == "V"}
                />
              </div>
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Current Employer</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.currentEmp}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    WorkTable.displayName
                  )
                }
                options={currentEmpOptions}
                name="currentEmp"
                id="currentEmpDropDown"
                isDisabled={lockStatus == "V"}
                isClearable
              />
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label>Reason for Departure</label>
              <br />
              <textarea
                type="text"
                value={
                  "depReason" in data && data.depReason.value !== undefined
                    ? convertToCase(data.depReason.value)
                    : convertToCase(data.depReason)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(index, evnt, WorkTable.displayName)
                }
                name="depReason"
                className="form-control"
                maxLength="255"
                title="Please Enter Valid Reason for Departure"
                disabled={lockStatus == "V"}
              />
            </div>
          </div>
        </div>
      </>
    );
    //}
  };

  const tdData = () => {
    console.log("Inside tdData");
    if (workTableRowsData !== undefined && workTableRowsData.length > 0) {
      return workTableRowsData.map((data, index) => {
        return (
          <tr
            key={index}
            className={
              data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""
            }
          >
            {lockStatus == "N" && (
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
                        WorkTable.displayName,
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
                      editTableRows(index, WorkTable.displayName);
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
            {lockStatus == "V" && (
              <td>
                <div>
                  <button
                    className="editBtn"
                    style={{ float: "right" }}
                    type="button"
                    onClick={() => {
                      handleModalChange(true);
                      handleDataIndex(index);
                      handleOperationValue("Edit");
                    }}
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                </div>
              </td>
            )}

            <td className="tableData">
              {"empName" in data && data.empName.value !== undefined
                ? convertToCase(data.empName.value)
                : convertToCase(data.empName)}
            </td>
            <td className="tableData">
              {"startDate" in data && data.startDate.value !== undefined
                ? formatDate(data.startDate.value)
                : formatDate(data.startDate)}
            </td>
            <td className="tableData">
              {"endDate" in data && data.endDate.value !== undefined
                ? formatDate(data.endDate.value)
                : formatDate(data.endDate)}
            </td>
            <td className="tableData">
              {"currentEmp" in data && data.currentEmp.value !== undefined
                ? convertToCase(data.currentEmp.label)
                : convertToCase(data.currentEmp)}
            </td>
            <td className="tableData">
              {"depReason" in data && data.depReason.value !== undefined
                ? convertToCase(data.depReason.value)
                : convertToCase(data.depReason)}
            </td>
          </tr>
        );
      });
    }
  };

  const formatDate = (dateObj) => {
    console.log("Inside formatDate ", typeof dateObj);

    if (dateObj) {
      if (typeof dateObj === "string") {
        const localDate = new Date(Date.parse(dateObj));

        console.log(
          "Inside formatDate typeof",
          Date.parse(dateObj),
          localDate.getDate()
        );
        dateObj = localDate;
      } else if (typeof dateObj === "number") {
        const localDate2 = new Date(dateObj);

        console.log("Inside formatDate typeof: ", localDate2.getDate());
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
      //console.log("formattedDate: ", formattedDate);
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
      <table className="table table-bordered tableLayout" id="WorkTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {lockStatus == "N" && (
              <th style={{ width: "7%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(WorkTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(workTableRowsData.length);
                    handleOperationValue("Add");
                  }}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </th>
            )}
            {lockStatus == "V" && <th style={{ width: "6%" }}></th>}
            <th scope="col">Practice/Employer Name</th>
            <th scope="col">Start Date</th>
            <th scope="col">End Date</th>
            <th scope="col">Current Employer</th>
            <th scope="col">Reason for Departure</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows WorkTableRowsData={WorkTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>

      <GridModal
        name={"Work History Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={WorkTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
      ></GridModal>
    </>
  );
}
