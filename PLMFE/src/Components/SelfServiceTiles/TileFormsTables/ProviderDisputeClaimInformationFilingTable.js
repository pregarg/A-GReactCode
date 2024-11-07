import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";

const fieldValues = [{
  label: 'YES',
  value: 'YES'
},{
  label: 'NO',
  value: 'NO'
}]

export default function ProviderDisputeClaimInformationFilingTable({

  ProviderclaimInformationFilingGridData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  lockStatus,
  editTableRows,
  gridFieldTempState,
  validationSchema,
}) {
  ProviderDisputeClaimInformationFilingTable.displayName = "ProviderDisputeClaimInformationFilingTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  const { convertToCase } = useGetDBTables();

  let prop = useLocation();
  console.log("ProviderDisputeClaimInformationFilingTable prop.state.stageName",prop.state.stageName) 
  console.log(" prop.state.formView", prop.state.formView) 

  useEffect(() => {
  }, []);


  const tableFields = [
    "Issue_Number",
    "Filed_Timely",
    "Grant_Good_Cause",
    "Good_Cause_Reason"
  ];

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
        "errors were encountered in doc needed table",
        validationErrors,
      );
      setValidationErrors(validationErrors);
    }
  }, [gridFieldTempState]);

  const providerDisputeConfigData = JSON.parse(
    process.env.REACT_APP_PROVIDERDISPUTES_DETAILS || "{}",
  );
  const PDStageName = providerDisputeConfigData["StageName"];
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
              ProviderDisputeClaimInformationFilingTable.displayName,
            )

          }
          disabled={
            (prop.state.formView === "DashboardView" &&
                (
                    prop.state.stageName === "Case Completed" ||
                    prop.state.stageName === "CaseArchived"))
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
          validationErrors={validationErrors}

          disabled={
            (prop.state.formView === "DashboardView" &&
                (((prop.state.stageName === "Intake" || prop.state.stageName === "Acknowledge" || prop.state.stageName === "Research"  || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen"
                            || prop.state.stageName === "Effectuate" || prop.state.stageName === "Resolve"
                            || prop.state.stageName === "Reopen")
                        && name === "Filed_Timely") ||
                    ((( prop.state.stageName === "Effectuate")
                            && name === "Grant_Good_Cause"|| name === "Good_Cause_Reason" ) ||
                    prop.state.stageName === "Case Completed" ||
                    prop.state.stageName === "CaseArchived")))
          }
          
          onChange={(selectValue, event) =>
            handleGridSelectChange(
              index,
              selectValue,
              event,
              ProviderDisputeClaimInformationFilingTable.displayName,
            )
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
            {renderSimpleSelectField("Filed_Timely", "Filed Timely", [...fieldValues], index)}
            {renderSimpleSelectField("Grant_Good_Cause", "Grant Good Cause", [...fieldValues], index)}
            {renderSimpleSelectField("Good_Cause_Reason", "Good_Cause_Reason", [...fieldValues], index)}
          </div>


        </div>
      </>
    );
  };

  const tdData = () => {
    console.log("ProviderclaimInformationFilingGridData", ProviderclaimInformationFilingGridData)
    if (
      ProviderclaimInformationFilingGridData !== undefined &&
      ProviderclaimInformationFilingGridData.length > 0
    ) {
      return ProviderclaimInformationFilingGridData.map((data, index) => {
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
                          ProviderDisputeClaimInformationFilingTable.displayName,
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
                          ProviderDisputeClaimInformationFilingTable.displayName,
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
                {data?.[e]?.value
                    ? convertToCase(data[e].value)
                    : convertToCase(data[e])}
              </td>
            ))}
          </tr>
        );
      });
    }
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
    <div className="claimTable-header">
      Untimely Filing: Justification Required

    </div>
      <div className="claimTable-container">
        <table
          className="table table-bordered tableLayout"
          id="ProviderDisputeClaimInformationFilingTable"
        >
          <thead>
            <tr className="tableRowStyle tableHeaderColor">
              {lockStatus === "N" && (
                <th style={{ width: "" }}>
                  <button
                    className="addBtn"
                    onClick={() => {
                      addTableRows(ProviderDisputeClaimInformationFilingTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(ProviderclaimInformationFilingGridData?.length);
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
        name="Claim Information Filing"
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={ProviderDisputeClaimInformationFilingTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
      ></GridModal>
    </>
  );
}
