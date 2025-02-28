import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function CtmRepresentativeInformationTable({
  ctmRepresentativeInformationGridData = [],
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
  CtmRepresentativeInformationTable.displayName = "CtmRepresentativeInformationTable";

  const [dataIndex, setDataIndex] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [operationValue, setOperationValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [isTouched, setIsTouched] = useState({});

  const [relationshipValues, setRelationshipValues] = useState([]);
  const [authTypeValues, setAuthTypeValues] = useState([]);
  const prop = useLocation();
  const { getGridJson, convertToCase } = useGetDBTables();
  const masterAngRelationshipSelector = useSelector(
      (state) => state?.masterAngRelationship,
    );
  const masterAngAORTypeSelector = useSelector(
      (state) => state?.masterAngAORType,
    );
  const masterAngMailToAddressSelector = useSelector(
      (state) => state?.masterAngMailToAddress,
    );
  const masterPDAuthTypeSelector = useSelector(
          (state) => state?.masterPDAuthType,
      );
   const masterPDRelationshipSelector = useSelector(
        (state) => state?.masterPDRelationship,
    );
//  const [authTypeValues, setAuthTypeValues] = useState([])
//  let relationshipValues = [];
  let aorTypeValues = [];
  let mailToAddressValues = [];
;

  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const relationship = masterPDRelationshipSelector?.[0] || [];
    setRelationshipValues(
        relationship.map((e) => e.Relationship).map(kvMapper),
    );
    const authType = masterPDAuthTypeSelector?.[0] || [];
    setAuthTypeValues(
        authType.map((e) => e.Auth_Type).map(kvMapper),
    );

  }, []);

useEffect(() => {
    if (masterAngRelationshipSelector) {
      const relationshipArray =
        masterAngRelationshipSelector.length === 0
          ? []
          : masterAngRelationshipSelector[0];
      const uniquerelationshipValues = {};

      for (let i = 0; i < relationshipArray.length; i++) {
        const relationship = convertToCase(relationshipArray[i].Relationship);

        if (!uniquerelationshipValues[relationship]) {
          uniquerelationshipValues[relationship] = true;
          relationshipValues.push({
            label: convertToCase(relationshipArray[i].Relationship),
            value: convertToCase(relationshipArray[i].Relationship),
          });
        }
      }
    }

    if (masterAngAORTypeSelector) {
      const aorTypeArray =
        masterAngAORTypeSelector.length === 0
          ? []
          : masterAngAORTypeSelector[0];
      const uniqueAORTypeValues = {};

      for (let i = 0; i < aorTypeArray.length; i++) {
        const aorType = convertToCase(aorTypeArray[i].AOR_Type);

        if (!uniqueAORTypeValues[aorType]) {
          uniqueAORTypeValues[aorType] = true;
          aorTypeValues.push({
            label: convertToCase(aorTypeArray[i].AOR_Type),
            value: convertToCase(aorTypeArray[i].AOR_Type),
          });
        }
      }
    }


    if (masterAngMailToAddressSelector) {
      const mailToAddressArray =
        masterAngMailToAddressSelector.length === 0
          ? []
          : masterAngMailToAddressSelector[0];
      const uniqueMailToAddressValues = {};

      for (let i = 0; i < mailToAddressArray.length; i++) {
        const mailToAddress = convertToCase(
          mailToAddressArray[i].Mail_to_Address,
        );

        if (!uniqueMailToAddressValues[mailToAddress]) {
          uniqueMailToAddressValues[mailToAddress] = true;
          mailToAddressValues.push({
            label: convertToCase(mailToAddressArray[i].Mail_to_Address),
            value: convertToCase(mailToAddressArray[i].Mail_to_Address),
          });
        }
      }
    }
  });
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
    "First_Name",
    "Last_Name",
    "Phone_Number",
    "Member_Name_ID",
    "Relationship",
    "Authorization_Type",
    "Authorization_Approved_Date",
    "Authorization_Expiration_Date",
    "Representative_Address_of_Record",
    "Mail_to_Address",
    "Address_Line_1",
    "Address_Line_2",
    "Zip_Code",
    "City",
    "State",
    "Alternate_Rep_Contact_Info",
    "Alt_Address_Line_1",
    "Alt_Address_Line_2",
    "Alt_Zip_Code",
    "Alt_City",
    "Alt_State",
    "Alternate_Phone_Number",
    "Fax_Number",
    "Alternate_Email_ID",
    "Communication_Preference",
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
              CtmRepresentativeInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}
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
            options={Array.isArray(options) ? options : []}
          data={gridFieldTempState}
          onChange={(selectValue, event) =>
            handleGridSelectChange(
              index,
              selectValue,
              event,
              CtmRepresentativeInformationTable.displayName,
            )
          }
          validationErrors={validationErrors}

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
                CtmRepresentativeInformationTable.displayName,
              )
            }
            validationErrors={validationErrors}

          />
        </div>
      );
    };
const tdDataReplica = (index) => (
  <div className="Container AddProviderLabel AddModalLabel">
    <div className="row">
      {renderSimpleInputField("Issue_Number", "Issue Number",50, index)}
      {renderSimpleInputField("First_Name", "First Name", 50, index)}
      {renderSimpleInputField("Last_Name", "Last Name", 50, index)}
      {renderSimpleInputField("Phone_Number", "Phone Number", 50, index)}
    </div>
    <div className="row mt-3">
      {renderSimpleInputField("Member_Name_ID", "Member Name ID", 50, index)}
      {renderSimpleSelectField("Relationship", "Relationship", relationshipValues, index)}
       {renderSimpleSelectField("Authorization_Type", "Authorization Type", authTypeValues, index)}
      {renderSimpleDatePickerField("Authorization_Approved_Date", "Authorization Approved Date", "Authorization Approved Date")}
    </div>
    <div className="row mt-3">


    </div>
    <div className="row mt-3">
      {renderSimpleInputField("Representative_Address_of_Record", "Representative Address of Record", 50, index)}
      {renderSimpleSelectField("Mail_to_Address", "Mail to Address", mailToAddressValues, index)}
      {renderSimpleInputField("Address_Line_1", "Address Line 1", 50, index)}
      {renderSimpleInputField("Address_Line_2", "Address Line 2", 50, index)}
    </div>
    <div className="row mt-3">
      {renderSimpleInputField("Zip_Code", "Zip Code", 50, index)}
      {renderSimpleInputField("City", "City", 50, index)}
      {renderSimpleInputField("State", "State", 50, index)}
      {renderSimpleInputField("Alternate_Rep_Contact_Info", "Alternate Rep Contact Info", 50, index)}
    </div>
    <div className="row mt-3">
      {renderSimpleInputField("Alt_Address_Line_1", "Alt Address Line 1", 50, index)}
      {renderSimpleInputField("Alt_Address_Line_2", "Alt Address Line 2", 50, index)}
      {renderSimpleInputField("Alt_Zip_Code", "Alt Zip Code", 50, index)}
      {renderSimpleInputField("Alt_City", "Alt City", 50, index)}
    </div>
    <div className="row mt-3">
      {renderSimpleInputField("Alt_State", "Alt State", 50, index)}
      {renderSimpleInputField("Alternate_Phone_Number", "Alternate Phone Number",50, index)}
      {renderSimpleInputField("Fax_Number", "Fax Number", 50, index)}
      {renderSimpleInputField("Alternate_Email_ID", "Alternate Email ID", 50, index)}
    </div>
    <div className="row mt-3">
      {renderSimpleInputField("Communication_Preference", "Communication Preference", 50, index)}
      {renderSimpleInputField("Procedure_Code_Desc", "Procedure Code Desc", 50, index)}
      {renderSimpleInputField("Quantity", "Quantity", 50, index)}
      {renderSimpleInputField("Seq_AP_Trans", "Seq AP Trans", 50, index)}
    </div>
    <div className="row mt-3">
      {renderSimpleInputField("Sub_Line_Code", "Sub Line Code",50, index)}
      {renderSimpleInputField("Oc_Allowed_Amount", "OC Allowed Amount", 50, index)}
      {renderSimpleInputField("Oc_Paid_Amount", "OC Paid Amount", 50, index)}
      {renderSimpleInputField("Paid_Net_Amount", "Paid Net Amount", 50, index)}
    </div>
    <div className="row mt-3">
      {renderSimpleInputField("Deductible_Amount", "Deductible Amount", 50, index)}
      {renderSimpleInputField("Allowed_Reason_Cd", "Allowed Reason Code",50, index)}
      {renderSimpleDatePickerField("Authorization_Expiration_Date", "Authorization Expiration Date","Authorization Expiration Date")}
    </div>
  </div>
);

const tdData = () => {

       if (
         ctmRepresentativeInformationGridData !== undefined &&
         ctmRepresentativeInformationGridData.length > 0
       ) {
         return ctmRepresentativeInformationGridData.map((data, index) => {
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
                             CtmRepresentativeInformationTable.displayName,
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
                                                    CtmRepresentativeInformationTable.displayName,
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

            {tableFields
                          .filter((e) => e !== "rowNumber")
                          .map((e) => (
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
const handleOperationValue = (oprtnValue) => {
    setOperationValue(oprtnValue);
  };

const handleModalChange = (flag) => {
    setModalShow(flag);
  };

const handleDataIndex = (index) => {
    setDataIndex(index);
  };

const decreaseDataIndex = () => {
    if (operationValue === "Add" || operationValue === "Force Delete") {
      const indx = dataIndex - 1;
      setDataIndex(indx);
    }
  };

    return (
        <>
          <div className="claimTable-container">
                  <table
                    className="table table-bordered tableLayout"
                    id="Representative Information Table"
                  >
                    <thead>
                      <tr className="tableRowStyle tableHeaderColor">
                        {lockStatus === "N" && (
                          <th style={{ width: "100px" }}>
                            <button
                              className="addBtn"
                              onClick={() => {
                                addTableRows(ctmRepresentativeInformationGridData.displayName);
                                handleModalChange(true);
                                handleDataIndex(ctmRepresentativeInformationGridData.length);
                                handleOperationValue("Add");
                              }}
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </th>
                        )}
                        {lockStatus === "V" && <th style={{ width: "" }}></th>}
                        {tableFields.map((e) => (
                          <th scope="col" style={{ width: "100px" }}>{e.replaceAll("_", " ")}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>{tdData()}</tbody>
                  </table>
                </div>
          <GridModal
                  name="Representative Information "
                  validationObject={isTouched}
                  modalShow={modalShow}
                  handleModalChange={handleModalChange}
                  dataIndex={dataIndex}
                  tdDataReplica={tdDataReplica}
                  deleteTableRows={deleteTableRows}
                  gridName={CtmRepresentativeInformationTable.displayName}
                  decreaseDataIndex={decreaseDataIndex}
                  operationValue={operationValue}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  lockStatus={lockStatus}
                  validationErrors={validationErrors}
         ></GridModal>
              </>
      );
}
