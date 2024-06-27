import React, { useState, useEffect } from "react";

import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function LicenseTable({
  licenseTableRowsData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridDateChange,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  selectJson,
  lockStatus,
  fetchAutoPopulate,
  editTableRows,
  gridFieldTempState,
  apiTestState,
  transactionType,
}) {
  LicenseTable.displayName = "LicenseTable";

  const [dataIndex, setDataIndex] = useState();

  const [isTouched, setIsTouched] = useState({});

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const { getGridJson, convertToCase } = useGetDBTables();

  // const apiUrl = 'http://localhost:8081/api';

  let licenseTypeOptions = [];

  let stateOptions = [];

  let typeOptions = [];

  useEffect(() => {
    const data = getGridJson(gridFieldTempState);

    if (
      apiTestState?.delegated?.value === "Yes" &&
      (transactionType === "Add a Facility" ||
        transactionType === "Add an Ancillary")
    ) {
      let validateAddressDataFields = {
        license:
          data?.hasOwnProperty("license") && data?.license.value !== ""
            ? false
            : true,
      };
      setIsTouched(validateAddressDataFields);
    } else {
      setIsTouched({
        ...isTouched,
        license: false,
        stateAbbreviation: false,
        type: false,
        licenseType: false,
      });
    }

    if (
      apiTestState?.delegated?.value === "Yes" &&
      transactionType === "Add a Provider"
    ) {
      let validateAddressDataFields = {
        license:
          data?.hasOwnProperty("license") && data?.license.value !== ""
            ? false
            : true,
        stateAbbreviation:
          data?.hasOwnProperty("stateAbbreviation") &&
            data?.stateAbbreviation?.value !== ""
            ? false
            : true,
        type:
          data.hasOwnProperty("type") && data?.type?.value !== ""
            ? false
            : true,
        licenseType:
          data?.hasOwnProperty("licenseType") && data?.licenseType?.value !== ""
            ? false
            : true,
      };
      setIsTouched(validateAddressDataFields);
    }
  }, [modalShow]);
  console.log("Inside License: ", lockStatus);

  // let endpoints = [
  //     apiUrl+'/master/gridLicenseType',
  //     apiUrl+'/master/stateSymbol'
  //   ];

  //   const onAddClick=()=>{
  //     //console.log(response);

  //     setTimeout(
  //         () => console.log("Nid :",mastersSelector)
  //         ,
  //         1000
  //     );

  // };

  // useEffect(() => {
  //     console.log("Inside useeffect");
  //     setSelectValues(selectJson);

  //     // setTimeout(
  //     //     () => setSelectValues(selectJson),
  //     //     1000
  //     // );
  //     console.log("select ref outside: ",selectValues);

  //     },[]);
  const handleFieldBlur = (fieldName, fieldValue) => {
    if (
      apiTestState?.delegated?.value === "Yes" &&
      (transactionType === "Add a Provider" ||
        transactionType === "Add a Facility" ||
        transactionType === "Add an Ancillary")
    ) {
      const touched = fieldValue?.trim("") === "" || fieldValue === undefined;
      setIsTouched({ ...isTouched, [fieldName]: touched });
    }
  };
  const tdDataReplica = (index) => {
    console.log("License before if: ", licenseTableRowsData);
    //if ( licenseTableRowsData!==undefined && licenseTableRowsData.length > 0) {
    console.log("License after if: ", licenseTableRowsData);
    const data = getGridJson(gridFieldTempState);
    console.log("License Data: ", data);

    console.log("License Values: ", selectJson);
    //console.log("License Data value: ",data.license.value);
    //console.log("tdDataReplica index: ",index);
    //console.log("tdDataReplica data: ",data);
    selectJson["licenseTypeOptions"].map((val) =>
      licenseTypeOptions.push({ value: val, label: val })
    );
    selectJson["stateOptions"].map((val) =>
      stateOptions.push({ value: val, label: val })
    );
    selectJson["typeOptions"].map((val) =>
      typeOptions.push({ value: val, label: val })
    );

    // axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
    //     if(res[0].status === 200){
    //         res[0].data.map(element => licenseTypeOptions.push({value : element, label: element}));
    //     }
    //     if(res[1].status === 200){
    //         res[1].data.map(element => stateOptions.push({value : element, label: element}));
    //     }
    //  })
    //  .catch((err) => {
    //     console.log(err.message);
    //     alert("Error in getting data");
    //  });

    //console.log('Inside tdData specialityArray',specialityArray);

    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>License #</label>
              <br />
              <input
                maxLength="20"
                type="text"
                value={
                  "license" in data && data.license.value !== undefined
                    ? data.license.value
                    : data.license
                }
                onChange={(evnt) => {
                  handleGridFieldChange(index, evnt, LicenseTable.displayName);
                  handleFieldBlur("license", evnt?.target?.value);
                }}
                name="license"
                className="form-control"
                disabled={lockStatus !== "N"}
              />
              {isTouched.license && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  License is Mandatory.
                </div>
              )}
            </div>
            <div className="col-xs-6 col-md-3">
              <label>State Abbreviation</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.stateAbbreviation}
                onChange={(selectValue, event) => {
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    LicenseTable.displayName
                  );
                  handleFieldBlur("stateAbbreviation", selectValue?.value);
                }}
                options={stateOptions}
                name="stateAbbreviation"
                id="stateAbbreviationDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
              {isTouched.stateAbbreviation && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  State Abbreviation is Mandatory.
                </div>
              )}
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Type</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.type}
                onChange={(selectValue, event) => {
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    LicenseTable.displayName
                  );
                  handleFieldBlur("type", selectValue?.value);
                }}
                options={licenseTypeOptions}
                name="type"
                id="typeDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
              {isTouched.type && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  Type is Mandatory.
                </div>
              )}
            </div>

            <div className="col-xs-6 col-md-3">
              <label>License Type</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.licenseType}
                onChange={(selectValue, event) => {
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    LicenseTable.displayName
                  );
                  handleFieldBlur("licenseType", selectValue?.value);
                }}
                options={typeOptions}
                name="licenseType"
                id="licenseTypeDropDown"
                isDisabled={lockStatus !== "N"}
                isClearable
              />
              {isTouched.licenseType && (
                <div style={{ color: "red", fontSize: "80%" }}>
                  LicenseType is Mandatory.
                </div>
              )}
            </div>
          </div>
          <br />
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">Expiration Date</label>
              <br />
              <div className="form-floating">
                <ReactDatePicker
                  className="example-custom-input-modal"
                  selected={
                    "expirationDate" in data &&
                      data.expirationDate.value !== undefined
                      ? data.expirationDate.value
                      : data.expirationDate
                  }
                  name="expirationDate"
                  onChange={(selectValue, event) =>
                    handleGridDateChange(
                      index,
                      selectValue,
                      "expirationDate",
                      LicenseTable.displayName
                    )
                  }
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  dropdownMode="select"
                  // isClearable
                  dateFormat="MM/dd/yyyy"
                  id="datePicker"
                  disabled={lockStatus !== "N"}
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
    // axios.all(endpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
    //     if(res[0].status === 200){
    //         res[0].data.map(element => licenseTypeOptions.push({value : element, label: element}));
    //     }
    //     if(res[1].status === 200){
    //         res[1].data.map(element => stateOptions.push({value : element, label: element}));
    //     }
    //  })
    //  .catch((err) => {
    //     console.log(err.message);
    //     alert("Error in getting data");
    //  });
    //console.log('Inside tdData specialityArray',specialityArray);
    if (licenseTableRowsData !== undefined && licenseTableRowsData.length > 0) {
      return licenseTableRowsData.map((data, index) => {
        //const {fullName, emailAddress, salary, specialityDefault}= data;

        return (
          <tr
            key={index}
            className={
              data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""
            }
          >
            {lockStatus == "N" ? (
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
                          LicenseTable.displayName,
                          "Force Delete"
                        );
                        handleOperationValue("Force Delete");
                        decreaseDataIndex();
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                    {fetchAutoPopulate.current === false ? (
                      <div>
                        <button
                          className="editBtn"
                          style={{ float: "right" }}
                          type="button"
                          onClick={() => {
                            editTableRows(index, LicenseTable.displayName);
                            handleModalChange(true);
                            handleDataIndex(index);
                            handleOperationValue("Edit");
                          }}
                        >
                          <i className="fa fa-edit"></i>
                        </button>
                      </div>
                    ) : (
                      <div />
                    )}
                  </span>
                </td>
              </>
            ) : (
              // }
              // {lockStatus == 'V'
              //     &&
              <td>
                <div>
                  <button
                    className="editBtn"
                    style={{ float: "right" }}
                    type="button"
                    onClick={() => {
                      editTableRows(index, LicenseTable.displayName);
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
              {"license" in data && data.license.value !== undefined
                ? convertToCase(data.license.value)
                : convertToCase(data.license)}
            </td>
            <td className="tableData">
              {"stateAbbreviation" in data &&
                data.stateAbbreviation.value !== undefined
                ? convertToCase(data.stateAbbreviation.value)
                : convertToCase(data.stateAbbreviation)}
            </td>
            <td className="tableData">
              {"type" in data && data.type.value !== undefined
                ? convertToCase(data.type.value)
                : convertToCase(data.type)}
            </td>

            <td className="tableData">
              {"licenseType" in data && data.licenseType.value !== undefined
                ? convertToCase(data.licenseType.value)
                : convertToCase(data.licenseType)}
            </td>
            <td className="tableData">
              {"expirationDate" in data &&
                data.expirationDate.value !== undefined
                ? formatDate(data.expirationDate.value)
                : formatDate(data.expirationDate)}
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
      <table className="table table-bordered tableLayout" id="LicenseTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {lockStatus == "N" ? (
              <th style={{ width: "7%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(LicenseTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(licenseTableRowsData.length);
                    handleOperationValue("Add");
                  }}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </th>
            ) : (
              // }
              // {lockStatus == 'V'
              //     &&
              <th style={{ width: "6%" }}></th>
            )}
            <th scope="col">License #</th>
            <th scope="col">State Abbreviation</th>
            <th scope="col">Type</th>
            <th scope="col">License Type</th>
            <th scope="col">Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows LicenseTableRowsData={LicenseTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>

      <GridModal
        name={"License Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={LicenseTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
      ></GridModal>
    </>
  );
}
