import React, { useState } from "react";
import ReactDatePicker from "react-datepicker";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function InsuranceTable({
  insuranceTableRowsData,
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
  InsuranceTable.displayName = "InsuranceTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  const { getGridJson, convertToCase } = useGetDBTables();

  function handleCoverageAmountChange(evnt) {
    const inputValue = evnt.target.value;
    // Regular expression to validate the format decimal(15,2) added by Nidhi Gupta
    const regex = /^-?\d{0,13}(\.\d{1,2})?$/;
    if (regex.test(inputValue)) {
      setIsTouched({ ...isTouched, covAmount: false });
    } else {
      alert(
        "Enter up to 13 digits before and up to 2 digits after the decimal point."
      );
      setIsTouched({ ...isTouched, covAmount: true });
    }
  }

  function handleCoverageAmountChangeAgg(evnt) {
    const inputValue = evnt.target.value;
    const regex = /^-?\d{0,13}(\.\d{1,2})?$/;
    if (regex.test(inputValue)) {
      setIsTouched({ ...isTouched, covAmountAgg: false });
    } else {
      alert(
        "Enter up to 13 digits before and up to 2 digits after the decimal point."
      );
      setIsTouched({ ...isTouched, covAmountAgg: true });
    }
  }

  const tdDataReplica = (index) => {
    const data = getGridJson(gridFieldTempState);

    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Policy Number</label>
              <br />
              <input
                type="text"
                value={
                  "policyNo" in data && data.policyNo.value !== undefined
                    ? convertToCase(data.policyNo.value)
                    : convertToCase(data.policyNo)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(index, evnt, InsuranceTable.displayName)
                }
                name="policyNo"
                className="form-control"
                maxLength="25"
                title="Please Enter Valid Policy Number"
                disabled={lockStatus == "V"}
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Carrier/Self Insured Name</label>
              <br />
              <input
                type="text"
                value={
                  "insuredName" in data && data.insuredName.value !== undefined
                    ? convertToCase(data.insuredName.value)
                    : convertToCase(data.insuredName)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(index, evnt, InsuranceTable.displayName)
                }
                name="insuredName"
                className="form-control"
                maxLength="250"
                title="Please Enter Valid Carrier/Self Insured Name"
                disabled={lockStatus == "V"}
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Coverage Amount</label>
              <br />
              <input
                type="number"
                name="covAmount"
                value={
                  "covAmount" in data && data.covAmount.value !== undefined
                    ? convertToCase(data.covAmount.value)
                    : convertToCase(data.covAmount)
                }
                onChange={(evnt) => {
                  if (evnt.target.value.length <= 16) {
                    handleGridFieldChange(
                      index,
                      evnt,
                      InsuranceTable.displayName
                    );
                  }
                }}
                onBlur={(evnt) => {
                  handleCoverageAmountChange(evnt);
                }}
                className="form-control"
                maxLength="16"
                title="Enter up to 13 digits and up to 2 digits before the decimal point"
                disabled={lockStatus === "V"}
              />

              <div className="character-counter">
                {data.covAmount &&
                typeof data.covAmount.value === "string" &&
                data.covAmount.value !== undefined
                  ? (() => {
                      const beforeDecimal =
                        data.covAmount.value.split(".")[0].length;
                      const afterDecimal = data.covAmount.value.split(".")[1]
                        ? data.covAmount.value.split(".")[1].length
                        : 0;
                      const exceeded = beforeDecimal > 13 || afterDecimal > 2;

                      if (exceeded) {
                        return <span style={{ color: "red" }}>Exceeded</span>;
                      } else {
                        return `${beforeDecimal} / ${afterDecimal}`;
                      }
                    })()
                  : "0 / 13"}
              </div>
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Coverage Amount Agg</label>
              <br />
              <input
                type="number"
                name="covAmountAgg"
                value={
                  "covAmountAgg" in data &&
                  data.covAmountAgg.value !== undefined
                    ? data.covAmountAgg.value
                    : data.covAmountAgg
                }
                //value={((data) && (data.covAmountAgg) && (data.covAmountAgg.value)) ? (data.covAmountAgg.value) : null}
                onChange={(evnt) => {
                  if (evnt.target.value.length <= 16) {
                    handleGridFieldChange(
                      index,
                      evnt,
                      InsuranceTable.displayName
                    );
                  }
                }}
                onBlur={(evnt) => {
                  handleCoverageAmountChangeAgg(evnt);
                }}
                className="form-control"
                maxLength="16"
                title="Enter up to 13 digits and up to 2 digits before the decimal point"
                disabled={lockStatus === "V"}
              />
              <div className="character-counter">
                {data.covAmountAgg &&
                typeof data.covAmountAgg.value === "string" &&
                data.covAmountAgg.value !== undefined
                  ? (() => {
                      const beforeDecimal =
                        data.covAmountAgg.value.split(".")[0].length;
                      const afterDecimal = data.covAmountAgg.value.split(".")[1]
                        ? data.covAmountAgg.value.split(".")[1].length
                        : 0;
                      const exceeded = beforeDecimal > 13 || afterDecimal > 2;

                      if (exceeded) {
                        return <span style={{ color: "red" }}>Exceeded</span>;
                      } else {
                        return `${beforeDecimal} / ${afterDecimal}`;
                      }
                    })()
                  : "0 / 13"}
              </div>
            </div>
          </div>
          <br />

          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">Current Effective Date</label>
              <br />
              <div className="form-floating">
                <ReactDatePicker
                  className="example-custom-input-modal"
                  selected={
                    "effectiveDate" in data &&
                    data.effectiveDate.value !== undefined
                      ? data.effectiveDate.value
                      : data.effectiveDate
                  }
                  name="effectiveDate"
                  onChange={(selectValue, event) =>
                    handleGridDateChange(
                      index,
                      selectValue,
                      "effectiveDate",
                      InsuranceTable.displayName
                    )
                  }
                  peekNextMonth
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showMonthDropdown
                  showYearDropdown
                  //isClearable
                  dropdownMode="select"
                  dateFormat="MM/dd/yyyy"
                  id="datePicker"
                  disabled={lockStatus == "V"}
                />
              </div>
            </div>

            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">Current Expiration Date</label>
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
                      InsuranceTable.displayName
                    )
                  }
                  peekNextMonth
                  showMonthDropdown
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showYearDropdown
                  //isClearable
                  dropdownMode="select"
                  dateFormat="MM/dd/yyyy"
                  id="datePicker"
                  disabled={lockStatus == "V"}
                />
              </div>
            </div>
          </div>
        </div>
      </>
    );
    // }
  };

  const tdData = () => {
    if (
      insuranceTableRowsData !== undefined &&
      insuranceTableRowsData.length > 0
    ) {
      return insuranceTableRowsData.map((data, index) => {
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
                        InsuranceTable.displayName,
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
                      editTableRows(index, InsuranceTable.displayName);
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
              {"policyNo" in data && data.policyNo.value !== undefined
                ? convertToCase(data.policyNo.value)
                : convertToCase(data.policyNo)}
            </td>
            <td className="tableData">
              {"insuredName" in data && data.insuredName.value !== undefined
                ? convertToCase(data.insuredName.value)
                : convertToCase(data.insuredName)}
            </td>
            <td className="tableData">
              {"covAmount" in data && data.covAmount.value !== undefined
                ? data.covAmount.value
                : data.covAmount}
            </td>
            <td className="tableData">
              {"covAmountAgg" in data && data.covAmountAgg.value !== undefined
                ? data.covAmountAgg.value
                : data.covAmountAgg}
              {/* {(data && data.covAmountAgg && data.covAmountAgg.value) ? (data.covAmountAgg.value) : null} */}
            </td>

            <td className="tableData">
              {"effectiveDate" in data && data.effectiveDate.value !== undefined
                ? formatDate(data.effectiveDate.value)
                : formatDate(data.effectiveDate)}
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
      <table className="table table-bordered tableLayout" id="InsuranceTable">
        <thead>
          <tr className="tableRowStyle tableHeaderColor">
            {lockStatus == "N" && (
              <th style={{ width: "7%" }}>
                <button
                  className="addBtn"
                  onClick={() => {
                    addTableRows(InsuranceTable.displayName);
                    handleModalChange(true);
                    handleDataIndex(insuranceTableRowsData.length);
                    handleOperationValue("Add");
                  }}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </th>
            )}
            {lockStatus == "V" && <th style={{ width: "6%" }}></th>}
            <th scope="col">Policy Number</th>
            <th scope="col">Carrier/Self Insured Name</th>
            <th scope="col">Coverage Amount</th>
            <th scope="col">Coverage Amount Aggregate</th>
            <th scope="col">Current Effective Date</th>
            <th scope="col">Current Expiration Date</th>
          </tr>
        </thead>
        <tbody>
          {/* <TableRows InsuranceTableRowsData={InsuranceTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
          {tdData()}
        </tbody>
      </table>

      <GridModal
        name={"Insurance Details"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={InsuranceTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
      ></GridModal>
    </>
  );
}
