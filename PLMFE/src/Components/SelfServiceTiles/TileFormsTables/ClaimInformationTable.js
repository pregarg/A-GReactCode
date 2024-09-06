import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./ClaimInformationTable.css";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";

export default function ClaimInformationTable({
  claimInformationGridData,
  setClaimInformationGridData,
  updateGridData,
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
  calculateDaysDifference,
  validationSchema,
}) {
  ClaimInformationTable.displayName = "ClaimInformationTable";

  const [dataIndex, setDataIndex] = useState();
  const [operationValue, setOperationValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [isTouched, setIsTouched] = useState({});

  const { convertToCase } = useGetDBTables();

  const masterAngFiledTimelySelector = useSelector(
    (state) => state?.masterAngFiledTimely,
  );
  const masterAngGrantGoodCauseSelector = useSelector(
    (state) => state?.masterAngGrantGoodCause,
  );
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const claimStageName = caseHeaderConfigData["StageName"];

  let prop = useLocation();

  const excludedStages = [
    "Start",
    "Intake",
    "Acknowledge",
    "Redirect Review",
    "Documents Needed",
  ];
  const shouldHideFields = !excludedStages.includes(
    prop.state.stageName || claimStageName,
  );
  let lineNumberOptions = [];
  let filedTimelyValues = [];
  let grantGoodCauseValues = [];

  const [validationErrors, setValidationErrors] = useState({});
  useEffect(() => {
    try {
      setValidationErrors([]);
      validationSchema.validateSync(gridFieldTempState, { abortEarly: false });
    } catch (errors) {
      const validationErrors = errors.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      console.log(
        "errors were encountered in claim information table",
        validationErrors,
      );
      setValidationErrors(validationErrors);
    }
  }, [gridFieldTempState]);

  useEffect(() => {
    if (masterAngFiledTimelySelector) {
      const filedTimelyArray =
        masterAngFiledTimelySelector.length === 0
          ? []
          : masterAngFiledTimelySelector[0];

      for (let i = 0; i < filedTimelyArray.length; i++) {
        filedTimelyValues.push({
          label: convertToCase(filedTimelyArray[i].Filed_Timely),
          value: convertToCase(filedTimelyArray[i].Filed_Timely),
        });
      }
    }

    if (masterAngGrantGoodCauseSelector) {
      const grantGoodCauseArray =
        masterAngGrantGoodCauseSelector.length === 0
          ? []
          : masterAngGrantGoodCauseSelector[0];

      for (let i = 0; i < grantGoodCauseArray.length; i++) {
        grantGoodCauseValues.push({
          label: convertToCase(grantGoodCauseArray[i].Grant_Good_Cause),
          value: convertToCase(grantGoodCauseArray[i].Grant_Good_Cause),
        });
      }
    }
  });

  const renderSimpleInputField = (name, label, maxLength, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleInputField
          name={name}
          label={label}
          maxLength={maxLength}
          data={gridFieldTempState}
          onChange={(event) =>
            handleGridFieldChange(
              index,
              event,
              ClaimInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}
          disabled={
            (prop.state.formView === "DashboardView" ||
              prop.state.formView === "DashboardHomeView") &&
            (((claimStageName === "Start" ||
              prop.state.stageName === "Intake") &&
              name === "Good_Cause_Reason") ||
              prop.state.stageName === "Redirect Review" ||
              prop.state.stageName === "Documents Needed" ||
              prop.state.stageName === "CaseArchived")
          }
        />
      </div>
    );
  };
  const renderSimpleSelectField = (name, label, options, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleSelectField
          name={name}
          label={label}
          options={options}
          data={gridFieldTempState}
          onChange={(selectValue, event) =>
            handleGridSelectChange(
              index,
              selectValue,
              event,
              ClaimInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}
          disabled={
            (prop.state.formView === "DashboardView" ||
              prop.state.formView === "DashboardHomeView") &&
            (((claimStageName === "Start" ||
              prop.state.stageName === "Intake") &&
              (name === "Filed_Timely" || name === "Grant_Good_Cause")) ||
              prop.state.stageName === "Redirect Review" ||
              prop.state.stageName === "Documents Needed" ||
              prop.state.stageName === "Effectuate" ||
              prop.state.stageName === "Pending Effectuate" ||
              prop.state.stageName === "Resolve" ||
              prop.state.stageName === "Case Completed" ||
              prop.state.stageName === "Reopen" ||
              prop.state.stageName === "CaseArchived")
          }
        />
      </div>
    );
  };
  const renderSimpleDatePickerField = (name, label, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleDatePickerField
          name={name}
          label={label}
          data={gridFieldTempState}
          onChange={(selectValue) =>
            handleGridDateChange(
              index,
              selectValue,
              name,
              ClaimInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}
          disabled={
            prop.state.formView === "DashboardView" &&
            (prop.state.stageName === "Redirect Review" ||
              prop.state.stageName === "Documents Needed" ||
              prop.state.stageName === "Effectuate" ||
              prop.state.stageName === "Pending Effectuate" ||
              prop.state.stageName === "Resolve" ||
              prop.state.stageName === "Case Completed" ||
              prop.state.stageName === "Reopen" ||
              prop.state.stageName === "CaseArchived")
          }
        />
      </div>
    );
  };

  const tdDataReplica = (index) => {
    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            {renderSimpleInputField("Issue_Number", "Issue Number", 50, index)}
            {renderSimpleSelectField(
              "Line_Number",
              "Line Number",
              lineNumberOptions,
              index,
            )}
            {renderSimpleInputField(
              "Allowed_Amount",
              "Allowed Amount",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Place_of_Service_POS",
              "Place of Service (POS)",
              50,
              index,
            )}
          </div>
          <div className="row">
            {renderSimpleInputField(
              "Procedure_Diagnosis_Code_2",
              "Procedure / Diagnosis Code 2",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Procedure_Diagnosis_Codes",
              "Procedure / Diagnosis Code(s)",
              50,
              index,
            )}
            {renderSimpleDatePickerField("Claim_Status", "Claim Status", index)}
            {renderSimpleInputField(
              "Patient_Ref_Account_Number",
              "Patient Ref / Account Number",
              50,
              index,
            )}
          </div>
          <div className="row">
            {renderSimpleSelectField(
              "Filed_Timely",
              "Filed Timely",
              filedTimelyValues,
              index,
            )}
            {renderSimpleSelectField(
              "Grant_Good_Cause",
              "Grant Good Cause",
              grantGoodCauseValues,
              index,
            )}
            {renderSimpleInputField("DenialCode", "Denial Code", 50, index)}
            {renderSimpleDatePickerField("DenialDate", "Denial Date", index)}
          </div>
          <div className="row">
            {renderSimpleInputField(
              "Good_Cause_Reason",
              "Good Cause Reason",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Auth_Number",
              "Authorization Number",
              50,
              index,
            )}
            {renderSimpleDatePickerField(
              "Number_of_Days_in_Span",
              "Number of Days in Span",
              index,
            )}
            {renderSimpleDatePickerField(
              "Service_Start_Date",
              "Service Start Date",
              index,
            )}
          </div>
          <div className="row">
            {renderSimpleDatePickerField(
              "Service_End_Date",
              "Service End Date",
              index,
            )}
            {renderSimpleInputField(
              "MemberFirstName",
              "Member First Name",
              50,
              index,
            )}
            {renderSimpleInputField(
              "MemberLastName",
              "Member Last Name",
              50,
              index,
            )}
            {renderSimpleInputField(
              "DenialDescription",
              "Denial Description",
              50,
              index,
            )}
          </div>
          <div className="row">
            {renderSimpleInputField(
              "Billed_Amount",
              "Billed Amount",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Provider_Account_Number",
              "Provider Account Number",
              50,
              index,
            )}
            {renderSimpleInputField(
              "DRG_Indicator",
              "DRG Indicator",
              50,
              index,
            )}
            {renderSimpleInputField("Claim_Number", "Claim Number", 50, index)}
          </div>
          <div className="row">
            {renderSimpleInputField("ProviderID", "Provider ID", 50, index)}
            {renderSimpleInputField("ServiceSpan", "Service Span", 50, index)}
            {renderSimpleInputField("MemberID", "Member ID", 50, index)}
            {renderSimpleInputField("ProviderName", "Provider Name", 50, index)}
            {renderSimpleInputField("Claim_type", "Claim Type", 50, index)}
          </div>
          <div className="row">
            {shouldHideFields &&
              renderSimpleInputField(
                "Payment_Number",
                "Payment Number",
                50,
                index,
              )}
            {shouldHideFields &&
              renderSimpleDatePickerField(
                "Claim_Adjusted_Date",
                "Claim Adjusted Date",
                index,
              )}
            {shouldHideFields &&
              renderSimpleDatePickerField(
                "Payment_Date",
                "Payment Date",
                index,
              )}
            {shouldHideFields &&
              renderSimpleInputField(
                "Payment_Method",
                "Payment Method",
                50,
                index,
              )}
            {shouldHideFields &&
              renderSimpleDatePickerField(
                "Payment_Mail_Date_Postmark",
                "Payment Mail Date (Postmark)",
                index,
              )}
          </div>
        </div>
      </>
    );
  };

  const tdData = () => {
    updateGridData(claimInformationGridData);
    if (
      claimInformationGridData !== undefined &&
      claimInformationGridData.length > 0
    ) {
      updateGridData(claimInformationGridData);
      return claimInformationGridData.map((data, index) => {
        return (
          <tr
            key={index}
            className={
              data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""
            }
          >
            {lockStatus === "N" && (
              <>
                <td>
                  <span
                    style={{
                      display: "flex",
                    }}
                  >
                    <button
                      className="deleteBtn"
                      style={{ width: "75%", float: "left" }}
                      onClick={() => {
                        deleteTableRows(
                          index,
                          ClaimInformationTable.displayName,
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
                      style={{ width: "75%", float: "right" }}
                      type="button"
                      onClick={() => {
                        editTableRows(index, ClaimInformationTable.displayName);
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
            {lockStatus === "V" && (
              <td>
                <div>
                  <button
                    className="editBtn"
                    style={{ float: "right" }}
                    type="button"
                    onClick={() => {
                      editTableRows(index, ClaimInformationTable.displayName);
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

            {[
              "Issue_Number",
              "Line_Number",
              "Claim_Number",
              "Auth_Number",
              "Patient_Ref_Account_Number",
              "Place_of_Service_POS",
              "Procedure_Diagnosis_Code_2",
              "Procedure_Diagnosis_Codes",
              "ProviderID",
              "ProviderName",
              "Provider_Account_Number",
              "MemberID",
              "MemberFirstName",
              "MemberLastName",
              "DRG_Indicator",
              "Filed_Timely",
              "Grant_Good_Cause",
              "Good_Cause_Reason",
              "Number_of_Days_in_Span",
              "Service_Start_Date",
              "Service_End_Date",
              "ServiceSpan",
              "Claim_type",
              "Claim_Status",
              "Claim_Adjusted_Date",
              "DenialCode",
              "DenialDate",
              "DenialDescription",
              "Payment_Method",
              "Payment_Number",
              "Payment_Date",
              "Payment_Mail_Date_Postmark",
              "Allowed_Amount",
              "Billed_Amount",
            ].map((e) => (
              <td className="tableData">
                {e.endsWith("_Date")
                  ? data?.[e]?.value
                    ? formatDate(data[e].value)
                    : formatDate(data[e])
                  : data?.[e]?.value
                    ? convertToCase(data[e].value)
                    : convertToCase(data[e])}
              </td>
            ))}
          </tr>
        );
      });
    }
  };

  const formatDate = (dateObj) => {
    if (dateObj) {
      if (typeof dateObj === "string") {
        dateObj = new Date(Date.parse(dateObj));
      } else if (typeof dateObj === "number") {
        dateObj = new Date(dateObj);
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
      return mm + "/" + dd + "/" + yyyy;
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
    setModalShow(flag);
  };

  const handleDataIndex = (index) => {
    setDataIndex(index);
  };

  return (
    <>
      <div className="claimTable-container">
        <table
          className="table table-bordered tableLayout"
          id="ClaimInformationTable"
        >
          <thead>
            <tr className="tableRowStyle tableHeaderColor">
              {lockStatus === "N" && (
                <th style={{ width: "" }}>
                  <button
                    className="addBtn"
                    onClick={() => {
                      addTableRows(ClaimInformationTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(claimInformationGridData.length);
                      handleOperationValue("Add");
                    }}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </th>
              )}
              {lockStatus === "V" && <th style={{ width: "" }}></th>}
              <th scope="col">Issue Number</th>
              <th scope="col">Line Number</th>
              <th scope="col">Claim Number</th>
              <th scope="col">Authorization Number</th>
              <th scope="col">Patient Ref/Account Number</th>
              <th scope="col">Place of Service</th>
              <th scope="col">Procedure/ Diagnosis Code 2</th>
              <th scope="col">Procedure/ Diagnosis Code(s)</th>
              <th scope="col">Provider ID</th>
              <th scope="col">Provider Name</th>
              <th scope="col">Provider Account Number</th>
              <th scope="col">Member ID</th>
              <th scope="col">Member First Name</th>
              <th scope="col">Member Last Name</th>
              <th scope="col">DRG Indicator</th>
              <th scope="col">Filed Timely</th>
              <th scope="col">Grant Good Cause</th>
              <th scope="col">Good Cause Reason</th>
              <th scope="col">Number of Days in Span</th>
              <th scope="col">Service Start Date</th>
              <th scope="col">Service End Date</th>
              <th scope="col">Service Span</th>
              <th scope="col">Claim Type</th>
              <th scope="col">Claim Status</th>
              <th scope="col">Claim Adjusted Date</th>
              <th scope="col">Denial Code</th>
              <th scope="col">Denial Date</th>
              <th scope="col">Denial Description</th>
              <th scope="col">Payment Method</th>
              <th scope="col">Payment Number</th>
              <th scope="col">Payment Date</th>
              <th scope="col">Payment Mail Date (PostMark)</th>
              <th scope="col">Allowed Amount</th>
              <th scope="col">Billed Amount</th>
            </tr>
          </thead>
          <tbody>{tdData()}</tbody>
        </table>
      </div>
      <GridModal
        name={"Claim Information"}
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={ClaimInformationTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
      ></GridModal>
    </>
  );
}
