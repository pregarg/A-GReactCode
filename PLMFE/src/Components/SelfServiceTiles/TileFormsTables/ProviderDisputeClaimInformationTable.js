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
  const masterAngLineNumberSelector = useSelector(
    (state) => state?.masterAngLineNumber,
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

    if (masterAngLineNumberSelector) {
      const lineNumberArray =
      masterAngLineNumberSelector.length === 0
          ? []
          : masterAngLineNumberSelector[0];

      for (let i = 0; i < lineNumberArray.length; i++) {
        lineNumberOptions.push({
          label: convertToCase(lineNumberArray[i].Line_Number),
          value: convertToCase(lineNumberArray[i].Line_Number),
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
          {renderSimpleInputField("Number_Of_Days_In_Span", "Number Of Days In Span", 50, index)}
            {renderSimpleSelectField("Post_Date", "Post Date", lineNumberOptions, index)}
            {renderSimpleInputField("Provider_Name", "Provider Name", 50, index)}
            {renderSimpleInputField("Billed_Amount", "Billed AmountS)", 50, index)}
          </div>
          <div className="row">
            {renderSimpleInputField("Allowed_Amount", "Allowed Amount", 50, index)}
            {renderSimpleInputField("CCT_Policy_Name", "CCT Policy Name", 50, index)}
            {renderSimpleDatePickerField("Procedure_Code", "Procedure Code or Diagnosis code", index)}
            {renderSimpleInputField("Patient_Ref", "Patient Ref/Account",0, index)}
          </div>
          <div className="row">
            {renderSimpleSelectField("Provider_Account", "Provider Account", filedTimelyValues, index)}
            {renderSimpleSelectField("High_Dollar_Dispute", "High Dollar Dispute", grantGoodCauseValues, index)}
            {renderSimpleInputField("Issue_Number", "Issue Number", 50, index)}
            
          </div>
        </div>
      </>
    );
  };
  

  const tdData = () => {
    updateGridData(claimInformationGridData);
    if (claimInformationGridData !== undefined && claimInformationGridData.length > 0) {
      updateGridData(claimInformationGridData);
      return claimInformationGridData.map((data, index) => {
        return (
          <tr
            key={index}
            className={data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""}
          >
            {lockStatus === "N" && (
              <td>
                <span style={{ display: "flex" }}>
                  <button
                    className="deleteBtn"
                    style={{ width: "75%", float: "left" }}
                    onClick={() => {
                      deleteTableRows(index, ClaimInformationTable.displayName, "Force Delete");
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
            )}
            {lockStatus === "V" && (
              <td>
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
              </td>
            )}
            {[
              "Number_Of_Days_In_Span",
              "Post_Date",
              "Provider_Name",
              "Billed_Amount",
              "Allowed_Amount",
              "CCT_Policy_Name",
              "Procedure_Code",
              "Patient_ref_Account",
              "Provider_Account",
              "High_Dollar_Dispute",
              "Issue_Number"
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
             <th scope="col">Number of Days in Span</th>
            <th scope="col">Post Date</th>
            <th scope="col">Provider Name</th>
            <th scope="col">Billed Amount</th>
            <th scope="col">Allowed Amount</th>
            <th scope="col">CCT Policy Name</th>
            <th scope="col">Procedure Code or Diagnosis Code</th>
            <th scope="col">Patient Ref/Account#</th>
            <th scope="col">Provider Account #</th>
            <th scope="col">High Dollar Dispute</th>
            <th scope="col">Issue Number</th>

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