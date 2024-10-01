import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./ClaimInformationTable.css";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";

export default function ProviderClaimInformationTable({
  ProviderclaimInformationGridData,
  setProviderClaimInformationGridData,
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
  ProviderClaimInformationTable.displayName = "ProviderClaimInformationTable";

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
  const ProviderclaimStageName = caseHeaderConfigData["StageName"];

  let prop = useLocation();

  const excludedStages = [
    "Start",
    "Intake",
    "Acknowledge",
    "Redirect Review",
    "Documents Needed",
  ];
  const shouldHideFields = !excludedStages.includes(
    prop.state.stageName || ProviderclaimStageName,
  );
   let lineNumberOptions = [];
  let filedTimelyValues = [];
  let grantGoodCauseValues = [];

  const [validationErrors, setValidationErrors] = useState({});
  
  // useEffect(() => {
  //   try {
  //     setValidationErrors([]);
  //     validationSchema.validateSync(gridFieldTempState, { abortEarly: false });
  //   } catch (errors) {
  //     const validationErrors = errors.inner.reduce((acc, error) => {
  //       acc[error.path] = error.message;
  //       return acc;
  //     }, {});
  //     console.log(
  //       "errors were encountered in Provider claim information table",
  //       validationErrors,
  //     );
  //     setValidationErrors(validationErrors);
  //   }
  // }, [gridFieldTempState]);
  useEffect(() => {
    try {
      // Clear validation errors initially
      setValidationErrors([]);
      
      // Attempt to validate
      validationSchema.validateSync(gridFieldTempState, { abortEarly: false });
    } catch (err) {
      // Ensure err.inner exists and is an array before reducing
      const validationErrors = err.inner && Array.isArray(err.inner)
        ? err.inner.reduce((acc, error) => {
            acc[error.path] = error.message;
            return acc;
          }, {})
        : {}; // Fallback to an empty object if no validation errors
  
      // Log validation errors for debugging
      console.log(
        "Errors were encountered in Provider claim information table",
        validationErrors,
      );
      
      // Set the validation errors state
      setValidationErrors(validationErrors);
    }
  }, [gridFieldTempState]);

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
              ProviderClaimInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}
          disabled={
            (prop.state.formView === "DashboardView" ||
              prop.state.formView === "DashboardHomeView") &&
            (((ProviderclaimStageName === "Start" ||
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
              ProviderClaimInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}
          disabled={
            (prop.state.formView === "DashboardView" ||
              prop.state.formView === "DashboardHomeView") &&
            (((ProviderclaimStageName === "Start" ||
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
              ProviderClaimInformationTable.displayName,
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
            
            {renderSimpleInputField("Issue_Number", "Issue Number", 50, index)}
            {renderSimpleInputField("Claim_Number", "Claim Number", 16,index)}
              {renderSimpleInputField(
                "Authorization_Number",
                "Authorization Number",
                9,
                  index
              )}
              </div>
              <div className="row">
               {renderSimpleDatePickerField(
                "Service_Start_Date",
                "Service Start Date",
                   index,

               )}
            {renderSimpleDatePickerField(
                "Service_End_Date",
                "Service End Date",
                "Service End Date",
              )}
                {/* {renderSimpleSelectField("Claim_type", "Claim type", ProviderclaimTypeValues)} */}
          </div>
          </div>
      </>
    );
  };
  

  const tdData = () => {
    updateGridData(ProviderclaimInformationGridData);
    if (ProviderclaimInformationGridData !== undefined && ProviderclaimInformationGridData.length > 0) {
      
      updateGridData(ProviderclaimInformationGridData);
      return ProviderclaimInformationGridData.map((data, index) => {
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
                      deleteTableRows(index, ProviderClaimInformationTable.displayName, "Force Delete");
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
                      editTableRows(index, ProviderClaimInformationTable.displayName);
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
                    editTableRows(index, ProviderClaimInformationTable.displayName);
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
              "Issue_Number",
              "Authorization Number",
              "Claim Type",
              "Service Start Date",
	            "Service End Date",
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
                <th style={{width: ""}}>
                  <button
                      className="addBtn"
                      onClick={() => {
                        addTableRows(ProviderClaimInformationTable.displayName);
                        handleModalChange(true);
                        handleDataIndex(ProviderclaimInformationGridData.length);
                        handleOperationValue("Add");
                      }}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </th>
            )}
            {lockStatus === "V" && <th style={{width: ""}}></th>}
            <th scope="col">Number of Days in Span</th>
            <th scope="col">Post Date</th>
            <th scope="col">Provider Name</th>
            <th scope="col">Billed Amount</th>
            <th scope="col">Allowed Amount</th>
            <th scope="col">CCT Policy Name</th>
            <th scope="col">Procedure Code or Diagnosis Code</th>
            <th scope="col">Patient Ref/Account#</th>
            <th scope="col">Provider Account #</th>
            <th scope="col">Issue Number</th>
            <th scope="col">Authorization Number</th>
            <th scope="col">Claim Type</th>
            <th scope="col">Service Start Date</th>
            <th scope="col">Service End Date</th>

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
        gridName={ProviderClaimInformationTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
      ></GridModal>
    </>
  );
}
