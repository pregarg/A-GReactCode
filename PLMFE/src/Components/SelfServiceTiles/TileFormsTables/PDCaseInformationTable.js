import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";

export default function PDCaseInformationTable({
  caseInformationGridData,
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
  validationSchema,
}) {
  PDCaseInformationTable.displayName = "PDCaseInformationTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  const { getGridJson, convertToCase } = useGetDBTables();

  const [issueTypeValues, setissueTypeValues] = useState([]);
  const [decisionValues, setdecisionValues] = useState([]);
  const [decisionReasonValues, setdecisionReasonValues] = useState([]);

  let prop = useLocation();
  const masterPDIssueTypeSelector = useSelector(
    (state) => state?.masterPDIssueType,
  );
  const masterPDDecisionSelector = useSelector(
    (state) => state?.masterPDDecision,
  );
  const masterPDDecisionReasonSelector = useSelector(
    (state) => state?.masterPDDecisionReason,
  );

useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const issueType = masterPDIssueTypeSelector?.[0] || [];
    setissueTypeValues(
        issueType.map((e) => e.Issue_Type).map(kvMapper),
    );
    const decision = masterPDDecisionSelector?.[0] || [];
    setdecisionValues(
        decision.map((e) => e.Decision).map(kvMapper),
    );
    const decisionReason =masterPDDecisionReasonSelector?.[0] || [];
    setdecisionReasonValues(
        decisionReason.map((e) => e.Decision_Reason).map(kvMapper),
    );
    
}, []);
  

  const tableFields = [
    "Issue_Number",
    "Claim_Number",
    "Issue_Description",
    "Issue_Type",
    "Decision",
    "Decision_Reason",
    "Decision_Time_Date",
    "Decision_Summary",
  ];

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
  //       "errors were encountered in doc needed table",
  //       validationErrors,
  //     );
  //     setValidationErrors(validationErrors);
  //   }
  // }, [gridFieldTempState]);


  const renderSimpleInputField = (name, label, maxLength, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleInputField
          name={name}
          label={label}
          maxLength={maxLength}
          data={gridFieldTempState}
          validationErrors={validationErrors}
          onChange={(event) =>
            handleGridFieldChange(
              index,
              event,
              PDCaseInformationTable.displayName,
            )
          }
          // disabled={
          //   (prop.state.formView === "DashboardView" &&
          //     (prop.state.stageName === "Redirect Review" ||
          //       prop.state.stageName === "Effectuate" ||
          //       prop.state.stageName === "Pending Effectuate" ||   
          //       prop.state.stageName === "Case Completed" ||
          //       prop.state.stageName === "CaseArchived"))   
          // }
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
          validationErrors={validationErrors}
          onChange={(selectValue, event) =>
            handleGridSelectChange(
              index,
              selectValue,
              event,
              PDCaseInformationTable.displayName,
            )
          }
          // disabled={
          //       prop.state.formView === "DashboardView" &&
          //     (prop.state.stageName === "Redirect Review" ||
          //       prop.state.stageName === "Effectuate" ||
          //       prop.state.stageName === "Pending Effectuate" ||   
          //       prop.state.stageName === "Case Completed" ||
          //       prop.state.stageName === "CaseArchived")  
          // }
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
          validationErrors={validationErrors}
          onChange={(selectValue) =>
            handleGridDateChange(
              index,
              selectValue,
              name,
              PDCaseInformationTable.displayName,
            )
          }
          // disabled={
          //   prop.state.formView === "DashboardView" &&
          //     (prop.state.stageName === "Redirect Review" ||
          //       prop.state.stageName === "Effectuate" ||
          //       prop.state.stageName === "Pending Effectuate" ||   
          //       prop.state.stageName === "Case Completed" ||
          //       prop.state.stageName === "CaseArchived")  
          // }
        />
      </div>
    );
  };

  const tdDataReplica = (index) => {
    return (
      <div className="Container AddProviderLabel AddModalLabel">
        <div className="row">
          {renderSimpleInputField("Issue_Number","Issue Number", 50, index)}
          {renderSimpleInputField("Claim_Number","Claim Number", 50, index)}
          {renderSimpleInputField("Issue_Description","Issue Description", 4000, index)}
          {renderSimpleSelectField(
            "Issue_Type",
            "Issue Type",
            issueTypeValues,
            index,
          )}
        </div>
        <div className="row">
        {renderSimpleSelectField(
            "Decision",
            "Decision",
            decisionValues,
            index,
          )}
            {renderSimpleSelectField(
            "Decision_Reason",
            "Decision Reason",
            decisionReasonValues,
            index,
          )}
          {renderSimpleDatePickerField(
            "Decision_Time_Date",
            "Decision Time Date",
            index,
          )}
         {renderSimpleInputField("Decision_Summary","Decision Summary", 4000, index)}
        </div>
       
      </div>
    );
  };

  const tdData = () => {
    console.log("caseInformationGridData",caseInformationGridData)
    if (
      caseInformationGridData !== undefined &&
      caseInformationGridData.length > 0
    ) {
      return caseInformationGridData.map((data, index) => {
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
                          PDCaseInformationTable.displayName,
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
                        editTableRows(
                          index,
                          PDCaseInformationTable.displayName,
                        );
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

            {tableFields.map((e) => (
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
          id="ProviderInformationTable"
        >
          <thead>
            <tr className="tableRowStyle tableHeaderColor">
              {lockStatus === "N" && (
                <th style={{ width: "" }}>
                  <button
                    className="addBtn"
                    onClick={() => {
                      addTableRows(PDCaseInformationTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(caseInformationGridData?.length);
                      handleOperationValue("Add");
                    }}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </th>
              )}
              {lockStatus === "V" && <th style={{ width: "" }}></th>}
              {tableFields.map((e) => (
                <th scope="col">{e.replaceAll("_", " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>{tdData()}</tbody>
        </table>
      </div>
      <GridModal
        name="Case Information"
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={PDCaseInformationTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
      ></GridModal>
    </>
  );
}
