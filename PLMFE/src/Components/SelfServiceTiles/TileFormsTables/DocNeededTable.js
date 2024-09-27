import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";

export default function DocNeededTable({
  docNeededGridData,
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
  DocNeededTable.displayName = "DocNeededTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  const { getGridJson, convertToCase } = useGetDBTables();

  const [docsNeededValues, setDocsNeededValues] = useState([]);
  const [requestedFromValues, setRequestedFromValues] = useState([]);
  const [neededByValues, setNeededByValues] = useState([]);

  let prop = useLocation();
  const masterAngDocNeededSelector = useSelector(
    (state) => state?.masterAngDocNeeded,
  );
  const masterAngRequestedFromSelector = useSelector(
    (state) => state?.masterAngRequestedFrom,
  );
  const masterAngNeededBySelector = useSelector(
    (state) => state?.masterAngNeededBy,
  );

//   const masterAngRelationshipSelector = useSelector(
//     (state) => state?.masterAngRelationship,
//   );
//   const masterAngAORTypeSelector = useSelector(
//     (state) => state?.masterAngAORType,
//   );
//   const masterAngCommPrefSelector = useSelector(
//     (state) => state?.masterAngCommPref,
//   );
//   const masterAngMailToAddressSelector = useSelector(
//     (state) => state?.masterAngMailToAddress,
//   );
useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const docsNeeded = masterAngDocNeededSelector?.[0] || [];
    setDocsNeededValues(
        docsNeeded.map((e) => e.Doc_Needed).map(kvMapper),
    );
    const requestedFrom = masterAngRequestedFromSelector?.[0] || [];
    setRequestedFromValues(
        requestedFrom.map((e) => e.Requested_From).map(kvMapper),
    );
    const neededBy =masterAngNeededBySelector?.[0] || [];
    setNeededByValues(
        neededBy.map((e) => e.Needed_By).map(kvMapper),
    );
    
}, []);
  

//   let relationshipValues = [];
//   let aorTypeValues = [];
//   let commPrefValues = [];
//   let mailToAddressValues = [];



//   useEffect(() => {
//     if (masterAngRelationshipSelector) {
//       const relationshipArray =
//         masterAngRelationshipSelector.length === 0
//           ? []
//           : masterAngRelationshipSelector[0];
//       const uniquerelationshipValues = {};

//       for (let i = 0; i < relationshipArray.length; i++) {
//         const relationship = convertToCase(relationshipArray[i].Relationship);

//         if (!uniquerelationshipValues[relationship]) {
//           uniquerelationshipValues[relationship] = true;
//           relationshipValues.push({
//             label: convertToCase(relationshipArray[i].Relationship),
//             value: convertToCase(relationshipArray[i].Relationship),
//           });
//         }
//       }
//     }

//     if (masterAngAORTypeSelector) {
//       const aorTypeArray =
//         masterAngAORTypeSelector.length === 0
//           ? []
//           : masterAngAORTypeSelector[0];
//       const uniqueAORTypeValues = {};

//       for (let i = 0; i < aorTypeArray.length; i++) {
//         const aorType = convertToCase(aorTypeArray[i].AOR_Type);

//         if (!uniqueAORTypeValues[aorType]) {
//           uniqueAORTypeValues[aorType] = true;
//           aorTypeValues.push({
//             label: convertToCase(aorTypeArray[i].AOR_Type),
//             value: convertToCase(aorTypeArray[i].AOR_Type),
//           });
//         }
//       }
//     }

//     if (masterAngCommPrefSelector) {
//       const commPrefArray =
//         masterAngCommPrefSelector.length === 0
//           ? []
//           : masterAngCommPrefSelector[0];

//       for (let i = 0; i < commPrefArray.length; i++) {
//         commPrefValues.push({
//           label: convertToCase(commPrefArray[i].Comm_Pref),
//           value: convertToCase(commPrefArray[i].Comm_Pref),
//         });
//       }
//     }

//     if (masterAngMailToAddressSelector) {
//       const mailToAddressArray =
//         masterAngMailToAddressSelector.length === 0
//           ? []
//           : masterAngMailToAddressSelector[0];
//       const uniqueMailToAddressValues = {};

//       for (let i = 0; i < mailToAddressArray.length; i++) {
//         const mailToAddress = convertToCase(
//           mailToAddressArray[i].Mail_to_Address,
//         );

//         if (!uniqueMailToAddressValues[mailToAddress]) {
//           uniqueMailToAddressValues[mailToAddress] = true;
//           mailToAddressValues.push({
//             label: convertToCase(mailToAddressArray[i].Mail_to_Address),
//             value: convertToCase(mailToAddressArray[i].Mail_to_Address),
//           });
//         }
//       }
//     }
//   });

  const tableFields = [
    "Doc_Needed",
    "Doc_Number",
    "Requested_From",
    "Needed_By",
    "Requested_By",
    "Request_Date",
    "Follow_Up1_Date",
    "Follow_Up2_Date",
    "Due_Date",
    "Received_Date",
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
              DocNeededTable.displayName,
            )
          }
          disabled={
            (prop.state.formView === "DashboardView" &&
              (prop.state.stageName === "Redirect Review" ||
                prop.state.stageName === "Effectuate" ||
                prop.state.stageName === "Pending Effectuate" ||   
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
          onChange={(selectValue, event) =>
            handleGridSelectChange(
              index,
              selectValue,
              event,
              DocNeededTable.displayName,
            )
          }
          disabled={
                prop.state.formView === "DashboardView" &&
              (prop.state.stageName === "Redirect Review" ||
                prop.state.stageName === "Effectuate" ||
                prop.state.stageName === "Pending Effectuate" ||   
                prop.state.stageName === "Case Completed" ||
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
          validationErrors={validationErrors}
          onChange={(selectValue) =>
            handleGridDateChange(
              index,
              selectValue,
              name,
              DocNeededTable.displayName,
            )
          }
          disabled={
            prop.state.formView === "DashboardView" &&
              (prop.state.stageName === "Redirect Review" ||
                prop.state.stageName === "Effectuate" ||
                prop.state.stageName === "Pending Effectuate" ||   
                prop.state.stageName === "Case Completed" ||
                prop.state.stageName === "CaseArchived")  
          }
        />
      </div>
    );
  };

  const tdDataReplica = (index) => {
    return (
      <div className="Container AddProviderLabel AddModalLabel">
        <div className="row">
        {renderSimpleSelectField(
            "Doc_Needed",
            "Doc Needed",
            docsNeededValues,
            index,
          )}
          {renderSimpleInputField("Doc_Number", "Doc Number", 50, index)}
          {renderSimpleSelectField(
            "Requested_From",
            "Requested From",
            requestedFromValues,
            index,
          )}
          {renderSimpleSelectField(
            "Needed_By",
            "Needed By",
            neededByValues,
            index,
          )}
         
        </div>
        <div className="row">
          {renderSimpleInputField("Requested_By", "Requested By", 50, index)}
          {renderSimpleDatePickerField(
            "Request_Date",
            "Request Date",
            index,
          )}
          {renderSimpleDatePickerField(
            "Follow_Up1_Date",
            "Follow-Up Date1",
            index,
          )}
          {renderSimpleDatePickerField(
            "Follow_Up2_Date",
            "Follow-Up Date2",
            index,
          )}
        </div>
        <div className="row">
          {renderSimpleDatePickerField(
            "Due_Date",
            "Due Date",
            index,
          )}
          {renderSimpleDatePickerField(
            "Received_Date",
            "Received Date",
            index,
          )}
          
        </div>
      </div>
    );
  };

  const tdData = () => {
    console.log("docNeededGridData",docNeededGridData)
    if (
      docNeededGridData !== undefined &&
      docNeededGridData.length > 0
    ) {
      return docNeededGridData.map((data, index) => {
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
                          DocNeededTable.displayName,
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
                          DocNeededTable.displayName,
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
                      addTableRows(DocNeededTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(docNeededGridData.length);
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
        name="Documents Needed"
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={DocNeededTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
      ></GridModal>
    </>
  );
}
