import React, { useState } from "react";
import axios from "axios";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function EducationTable({
  educationTableRowsData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridDateChange,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  selectJson,
  lockStatus,
  editTableRows,
  gridFieldTempState,
}) {
  EducationTable.displayName = "EducationTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  const { getGridJson, convertToCase } = useGetDBTables();

  let graduateTypeOptions = [];

  const tdDataReplica = (index) => {
    console.log("Inside tdDataReplica");

    const data = getGridJson(gridFieldTempState);

    selectJson["degreeOptions"].map((val) =>
      graduateTypeOptions.push({ value: val, label: val }),
    );

    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Degree</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.graduateType}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    EducationTable.displayName,
                  )
                }
                options={graduateTypeOptions}
                name="graduateType"
                id="graduateTypeDropDown"
                isDisabled={lockStatus == "V"}
                isClearable
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">Completion Date</label>
              <br />
              <div className="form-floating">
                <ReactDatePicker
                  className="example-custom-input-modal"
                  selected={
                    "graduationDate" in data &&
                    data.graduationDate.value !== undefined
                      ? data.graduationDate.value
                      : data.graduationDate
                  }
                  name="graduationDate"
                  onChange={(selectValue, event) =>
                    handleGridDateChange(
                      index,
                      selectValue,
                      "graduationDate",
                      EducationTable.displayName,
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
              <label>Type</label>
              <br />
              <input
                type="text"
                value={
                  "degree" in data && data.degree.value !== undefined
                    ? convertToCase(data.degree.value)
                    : convertToCase(data.degree)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(index, evnt, EducationTable.displayName)
                }
                name="degree"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
                disabled={lockStatus == "V"}
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Institue/Hospital Name</label>
              <br />
              <input
                type="text"
                value={
                  "professionalSchool" in data &&
                  data.professionalSchool.value !== undefined
                    ? convertToCase(data.professionalSchool.value)
                    : convertToCase(data.professionalSchool)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(index, evnt, EducationTable.displayName)
                }
                name="professionalSchool"
                className="form-control"
                maxLength="110"
                title="Please Enter Valid Institue/Hospital Name"
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
    if (
      educationTableRowsData !== undefined &&
      educationTableRowsData.length > 0
    ) {
      return educationTableRowsData.map((data, index) => {
        return (
          <tr
            key={index}
            className={
              data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""
            }
          >
            {lockStatus == "N" && (
              <>
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
                          EducationTable.displayName,
                          "Force Delete",
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
                        editTableRows(index, EducationTable.displayName);
                        handleModalChange(true);
                        handleDataIndex(index);
                        handleOperationValue("Edit");
                      }}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                  </span>
                </td>
              </>
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
              {"graduateType" in data && data.graduateType.value !== undefined
                ? convertToCase(data.graduateType.value)
                : convertToCase(data.graduateType)}
            </td>

            <td className="tableData">
              {"graduationDate" in data &&
              data.graduationDate.value !== undefined
                ? formatDate(data.graduationDate.value)
                : formatDate(data.graduationDate)}
            </td>
            <td className="tableData">
              {"degree" in data && data.degree.value !== undefined
                ? convertToCase(data.degree.value)
                : convertToCase(data.degree)}
            </td>
            <td className="tableData">
              {"professionalSchool" in data &&
              data.professionalSchool.value !== undefined
                ? convertToCase(data.professionalSchool.value)
                : convertToCase(data.professionalSchool)}
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
          localDate.getDate(),
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
      <table className="table table-bordered tableLayout" id="EducationTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {lockStatus == "N" && (
              <th style={{ width: "7.5%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(EducationTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(educationTableRowsData.length);
                    handleOperationValue("Add");
                  }}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </th>
            )}
            {lockStatus == "V" && <th style={{ width: "7.5%" }}></th>}
            <th scope="col">Degree</th>
            <th scope="col">Completion Date</th>
            <th scope="col">Type</th>
            <th scope="col">Institue/Hospital Name</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows EducationTableRowsData={EducationTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>

      <GridModal
        name={"Education & Training Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={EducationTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
      ></GridModal>
    </>
  );
}
