import React, { useEffect, useState } from "react";
import GridModal from "./GridModal";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import * as Yup from "yup";

export default function CtmAuthorizationInformationTable({
  ctmAuthGridData = [],
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
  CtmAuthorizationInformationTable.displayName = "CtmAuthorizationInformationTable";

  const [dataIndex, setDataIndex] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [operationValue, setOperationValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
const { getGridJson, convertToCase } = useGetDBTables();
const [isTouched, setIsTouched] = useState({});
 const [authTypeValues, setAuthTypeValues] = useState([]);
 const masterPDAuthTypeSelector = useSelector(
          (state) => state?.masterPDAuthType,
      );
       const conditionalString = (field, value, message) => {
          return Yup.string().when(field, {
            is: (val) => val === value,
            then: Yup.string().required(message),
          });
        };
   const handleAuthorizationValidationSchema = (name, value) => {
       if (name === "Auth_Number") {
         return Yup.object().shape({
           Auth_Number: Yup.string(),
           Authorization_Type: conditionalString("Auth_Number", value, "Authorization Type is required"),
           Auth_Type_Description: conditionalString("Auth_Number", value, "Auth Type Description is required"),
           Provider_Name: conditionalString("Auth_Number", value, "Provider Name is required"),
           Auth_Status: conditionalString("Auth_Number", value, "Auth Status is required"),
           Auth_Request_Date: conditionalString("Auth_Number", value, "Auth Request Date is required"),
           Auth_Service_Start_Date: conditionalString("Auth_Number", value, "Auth Service Start Date is required"),
           Auth_Expiration_Date: conditionalString("Auth_Number", value, "Auth Expiration Date is required"),
           Denial_Code_and_Reason: conditionalString("Auth_Number", value, "Denial Code and Reason is required"),
           CPT_Description: conditionalString("Auth_Number", value, "CPT Description(s) is required"),
         });
       }
     };
//  useEffect(() => {
//    const authTypeOptions = [
//      { label: "Pre-Authorization", value: "Pre-Authorization" },
//      { label: "Concurrent Review", value: "Concurrent Review" },
//      { label: "Retro Authorization", value: "Retro Authorization" },
//    ];
//    setAuthTypeValues(authTypeOptions);
//
//  }, []);
 useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });

    const authType = masterPDAuthTypeSelector?.[0] || [];
    setAuthTypeValues(
        authType.map((e) => e.Auth_Type).map(kvMapper),
    );

  }, []);


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
    "Auth_Number",
    "Authorization_Type",
    "Auth_Type_Description",
    "Provider_Name",
    "Auth_Status",
    "Auth_Request_Date",
    "Auth_Service_Start_Date",
    "Auth_Expiration_Date",
    "Denial_Code_and_Reason",
    "CPT_Description",
  ];

  const columnWidthMap = {
       'Issue_Number': '150px',
        'Auth_Type_Description': '150px',
        'Auth_Number': '150px',
        'Authorization_Type': '150px',
        'Auth_Type_Description': '150px',
        'Provider_Name': '150px',
        'Auth_Status': '150px',
        'Auth_Request_Date': '150px',
        'Auth_Service_Start_Date': '150px',
        'Auth_Expiration_Date': '150px',
        'Denial_Code_and_Reason': '150px',
        'CPT_Description': '150px',
  }

  const renderSimpleInputField = (name, label, maxLength, index) => (
    <div className="col-xs-6 col-md-3">
      <SimpleInputField
        name={name}
        label={label}
        maxLength={maxLength}
        data={gridFieldTempState}
        validationErrors={validationErrors}
        onChange={(event) =>
          handleGridFieldChange(index, event, CtmAuthorizationInformationTable.displayName)
        }
      />
    </div>
  );

  const renderSimpleSelectField = (name, label, options, index) => (
    <div className="col-xs-6 col-md-3">
      <SimpleSelectField
        name={name}
        label={label}
        options={options}
        data={gridFieldTempState}
        validationErrors={validationErrors}
        onChange={(selectValue, event) =>
          handleGridSelectChange(index, selectValue, event, CtmAuthorizationInformationTable.displayName)
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
          handleGridDateChange(index, selectValue, name, CtmAuthorizationInformationTable.displayName)
        }
      />
    </div>
  );

  const tdDataReplica = (index) => (
    <div className="Container AddProviderLabel AddModalLabel">
      <div className="row">
        {renderSimpleInputField("Issue_Number", "Issue Number", 50, index)}
        {renderSimpleInputField("Auth_Number", "Auth Number", 50, index)}
        {renderSimpleSelectField("Authorization_Type", "Authorization Type", authTypeValues, index)}
        {renderSimpleInputField("Auth_Type_Description", "Auth Type Description", 250, index)}
      </div>
      <div className="row mt-3">
        {renderSimpleInputField("Provider_Name", "Provider Name", 100, index)}
        {renderSimpleInputField("Auth_Status", "Auth Status", 50, index)}
        {renderSimpleDatePickerField("Auth_Request_Date", "Auth Request Date", "Auth Request Date")}
        {renderSimpleDatePickerField("Auth_Service_Start_Date", "Auth Service Start Date", "Auth Request Date")}
      </div>
      <div className="row mt-3">
        {renderSimpleDatePickerField("Auth_Expiration_Date", "Auth Expiration Date","Auth Request Date")}
        {renderSimpleInputField("Denial_Code_and_Reason", "Denial Code and Reason", 500, index)}
        {renderSimpleInputField("CPT_Description", "CPT Description(s)", 500, index)}
      </div>
    </div>
  );

 const tdData = () => {

       if (
         ctmAuthGridData !== undefined &&
         ctmAuthGridData.length > 0
       ) {
         return ctmAuthGridData.map((data, index) => {
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
                             CtmAuthorizationInformationTable.displayName,
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
                                                    CtmAuthorizationInformationTable.displayName,
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
                id="Authorization Information Table"
              >
                <thead>
                  <tr className="tableRowStyle tableHeaderColor">
                    {lockStatus === "N" && (
                      <th style={{ width: "100px" }}>
                        <button
                          className="addBtn"
                          onClick={() => {
                            addTableRows(CtmAuthorizationInformationTable.displayName);
                            handleModalChange(true);
                            handleDataIndex(ctmAuthGridData.length);
                            handleOperationValue("Add");
                          }}
                        >
                          <i className="fa fa-plus"></i>
                        </button>
                      </th>
                    )}
                    {lockStatus === "V" && <th style={{ width: "120px" }}></th>}
                    {tableFields
                                                                                .filter((e) => e !== "rowNumber")
                                                                                .map((e) => (
                                                                                   <th scope="col" style={{'width': columnWidthMap[e]}}>{e.replaceAll("_", " ")}</th>
                                                                                ))}
                  </tr>
                </thead>
                <tbody>{tdData()}</tbody>
              </table>
            </div>

      <GridModal
              name="Authorization Information "
              validationObject={isTouched}
              modalShow={modalShow}
              handleModalChange={handleModalChange}
              dataIndex={dataIndex}
              tdDataReplica={tdDataReplica}
              deleteTableRows={deleteTableRows}
              gridName={CtmAuthorizationInformationTable.displayName}
              decreaseDataIndex={decreaseDataIndex}
              operationValue={operationValue}
              gridRowsFinalSubmit={gridRowsFinalSubmit}
              lockStatus={lockStatus}
              validationErrors={validationErrors}
            ></GridModal>
          </>
  );
}
