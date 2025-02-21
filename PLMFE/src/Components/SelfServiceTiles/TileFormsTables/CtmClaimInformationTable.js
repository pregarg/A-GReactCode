import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function CtmClaimInformationTable({
ctmClaimInformationGridData = [],
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridDateChange,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  lockStatus,
  editTableRows,
  gridFieldTempState,
  validationSchema,
}) {
  CtmClaimInformationTable.displayName = "CtmClaimInformationTable";

  const [dataIndex, setDataIndex] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [operationValue, setOperationValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [isTouched, setIsTouched] = useState({});
  const prop = useLocation();
const { getGridJson, convertToCase } = useGetDBTables();

  useEffect(() => {
    try {
      setValidationErrors([]);
      validationSchema.validateSync(gridFieldTempState, { abortEarly: false });
    } catch (errors) {
      const validationErrors = errors.inner?.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setValidationErrors(validationErrors);
    }
  }, [gridFieldTempState]);

  const tableFields = [
    "Issue_Number",
    "Claim_Ref_Number",
    "Authorization_Number",
    "Provider_Name",
    "Service_Start_Date",
    "Service_End_Date",
    "Claim_Type",
    "Received_Date",
    "Claim_Status",
    "Claim_Lines",
    "Line_Number",
    "Seq_Claim_ID",
    "Accounts_Payable_Net_Amount",
    "Allowed_Reason",
    "Billed_Amount",
    "Allowed_Amount",
    "Net_Amount",
    "Date_Of_Service_Start",
    "Date_Of_Service_End",
    "Check_Amount",
    "Claim_Status_Desc",
    "Co_Payment_Amount1",
    "Co_Payment_Amount2",
    "Claim_Deny_Reason_Code",
    "Claim_Deny_Reason_Desc",
    "Not_Covered_Amount",
    "Place_Of_Service",
    "Procedure_Code",
    "Procedure_Code_Desc",
    "Quantity",
    "Seq_AP_Trans",
    "Sub_Line_Code",
    "Oc_Allowed_Amount",
    "Oc_Paid_Amount",
    "Paid_Net_Amount",
    "Deductible_Amount",
    "Allowed_Reason_Cd",
  ];

  const renderSimpleInputField = (name, label, index) => (
    <div className="col-xs-6 col-md-3">
      <SimpleInputField
        name={name}
        label={label}
        data={gridFieldTempState}
        validationErrors={validationErrors}
        onChange={(event) =>
          handleGridFieldChange(index, event, CtmClaimInformationTable.displayName)
        }
      />
    </div>
  );

  const renderSimpleDatePickerField = (name, label, index) => (
    <div className="col-xs-6 col-md-3">
      <SimpleDatePickerField
        name={name}
        label={label}
        data={gridFieldTempState}
        validationErrors={validationErrors}
        onChange={(selectValue) =>
          handleGridDateChange(index, selectValue, name, CtmClaimInformationTable.displayName)
        }
      />
    </div>
  );

  const tdDataReplica = (index) => (
    <div className="Container AddProviderLabel AddModalLabel">
      <div className="row">
        {renderSimpleInputField("Issue_Number", "Issue Number", index)}
        {renderSimpleInputField("Claim_Ref_Number", "Claim Ref Number", index)}
        {renderSimpleInputField("Authorization_Number", "Authorization Number", index)}
        {renderSimpleInputField("Provider_Name", "Provider Name", index)}
      </div>
      <div className="row">
        {renderSimpleDatePickerField("Service_Start_Date", "Service Start Date", index)}
        {renderSimpleDatePickerField("Service_End_Date", "Service End Date", index)}
        {renderSimpleInputField("Claim_Type", "Claim Type", index)}
        {renderSimpleDatePickerField("Received_Date", "Received Date", index)}
      </div>
      <div className="row mt-3">
        {renderSimpleInputField("Claim_Status", "Claim Status", index)}
        {renderSimpleInputField("Claim_Lines", "Claim Lines", index)}
        {renderSimpleInputField("Line_Number", "Line Number", index)}
        {renderSimpleInputField("Seq_Claim_ID", "Seq Claim ID", index)}
      </div>
      <div className="row mt-3">
        {renderSimpleInputField("Accounts_Payable_Net_Amount", "Accounts Payable Net Amount", index)}
        {renderSimpleInputField("Allowed_Reason", "Allowed Reason", index)}
        {renderSimpleInputField("Billed_Amount", "Billed Amount", index)}
        {renderSimpleInputField("Allowed_Amount", "Allowed Amount", index)}
      </div>
      <div className="row mt-3">
        {renderSimpleInputField("Net_Amount", "Net Amount", index)}
        {renderSimpleInputField("Date_Of_Service_Start", "Date Of Service Start", index)}
        {renderSimpleInputField("Date_Of_Service_End", "Date Of Service End", index)}
        {renderSimpleInputField("Check_Amount", "Check Amount", index)}
      </div>
      <div className="row mt-3">
        {renderSimpleInputField("Claim_Status_Desc", "Claim Status Desc", index)}
        {renderSimpleInputField("Co_Payment_Amount1", "Co-Payment Amount 1", index)}
        {renderSimpleInputField("Co_Payment_Amount2", "Co-Payment Amount 2", index)}
        {renderSimpleInputField("Claim_Deny_Reason_Code", "Claim Deny Reason Code", index)}
      </div>
      <div className="row mt-3">
        {renderSimpleInputField("Claim_Deny_Reason_Desc", "Claim Deny Reason Desc", index)}
        {renderSimpleInputField("Not_Covered_Amount", "Not Covered Amount", index)}
        {renderSimpleInputField("Place_Of_Service", "Place Of Service", index)}
        {renderSimpleInputField("Procedure_Code", "Procedure Code", index)}
      </div>
      <div className="row mt-3">
        {renderSimpleInputField("Procedure_Code_Desc", "Procedure Code Desc", index)}
        {renderSimpleInputField("Quantity", "Quantity", index)}
        {renderSimpleInputField("Seq_AP_Trans", "Seq AP Trans", index)}
        {renderSimpleInputField("Sub_Line_Code", "Sub Line Code", index)}
      </div>
      <div className="row mt-3">
        {renderSimpleInputField("Oc_Allowed_Amount", "Oc Allowed Amount", index)}
        {renderSimpleInputField("Oc_Paid_Amount", "Oc Paid Amount", index)}
        {renderSimpleInputField("Paid_Net_Amount", "Paid Net Amount", index)}
        {renderSimpleInputField("Deductible_Amount", "Deductible Amount", index)}
      </div>
      <div className="row mt-3">
        {renderSimpleInputField("Allowed_Reason_Cd", "Allowed Reason Cd", index)}
      </div>
    </div>
  );




     const tdData = () => {
       console.log("ctmClaimInformationGridData",ctmClaimInformationGridData)
       if (
         ctmClaimInformationGridData !== undefined &&
         ctmClaimInformationGridData.length > 0
       ) {
         return ctmClaimInformationGridData.map((data, index) => {
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
                             CtmClaimInformationTable.displayName,
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
                                                    CtmClaimInformationTable.displayName,
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
          id="ClaimInformationTable"
        >
          <thead>
            <tr className="tableRowStyle tableHeaderColor">
              {lockStatus === "N" && (
                <th style={{ width: "" }}>
                  <button
                    className="addBtn"
                    onClick={() => {
                      addTableRows(CtmClaimInformationTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(ctmClaimInformationGridData.length);
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
        name="Claim Information "
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={CtmClaimInformationTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
      ></GridModal>
    </>
  );
}
