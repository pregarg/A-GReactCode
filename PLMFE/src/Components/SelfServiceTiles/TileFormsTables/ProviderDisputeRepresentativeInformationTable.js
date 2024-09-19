import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";

export default function RepresentativeInformationTable({
  representativeInformationGridData,
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
  RepresentativeInformationTable.displayName = "RepresentativeInformationTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  const { getGridJson, convertToCase } = useGetDBTables();

  const masterAngRelationshipSelector = useSelector(
    (state) => state?.masterAngRelationship,
  );
  const masterAngAORTypeSelector = useSelector(
    (state) => state?.masterAngAORType,
  );
  const masterAngCommPrefSelector = useSelector(
    (state) => state?.masterAngCommPref,
  );
  const masterAngMailToAddressSelector = useSelector(
    (state) => state?.masterAngMailToAddress,
  );

  let prop = useLocation();

  let relationshipValues = [];
  let aorTypeValues = [];
  let commPrefValues = [];
  let mailToAddressValues = [];

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
  //
  //   if (masterAngAORTypeSelector) {
  //     const aorTypeArray =
  //       masterAngAORTypeSelector.length === 0
  //         ? []
  //         : masterAngAORTypeSelector[0];
  //     const uniqueAORTypeValues = {};
  //
  //     for (let i = 0; i < aorTypeArray.length; i++) {
  //       const aorType = convertToCase(aorTypeArray[i].AOR_Type);
  //
  //       if (!uniqueAORTypeValues[aorType]) {
  //         uniqueAORTypeValues[aorType] = true;
  //         aorTypeValues.push({
  //           label: convertToCase(aorTypeArray[i].AOR_Type),
  //           value: convertToCase(aorTypeArray[i].AOR_Type),
  //         });
  //       }
  //     }
  //   }
  //
  //   if (masterAngCommPrefSelector) {
  //     const commPrefArray =
  //       masterAngCommPrefSelector.length === 0
  //         ? []
  //         : masterAngCommPrefSelector[0];
  //
  //     for (let i = 0; i < commPrefArray.length; i++) {
  //       commPrefValues.push({
  //         label: convertToCase(commPrefArray[i].Comm_Pref),
  //         value: convertToCase(commPrefArray[i].Comm_Pref),
  //       });
  //     }
  //   }
  //
  //   if (masterAngMailToAddressSelector) {
  //     const mailToAddressArray =
  //       masterAngMailToAddressSelector.length === 0
  //         ? []
  //         : masterAngMailToAddressSelector[0];
  //     const uniqueMailToAddressValues = {};
  //
  //     for (let i = 0; i < mailToAddressArray.length; i++) {
  //       const mailToAddress = convertToCase(
  //         mailToAddressArray[i].Mail_to_Address,
  //       );
  //
  //       if (!uniqueMailToAddressValues[mailToAddress]) {
  //         uniqueMailToAddressValues[mailToAddress] = true;
  //         mailToAddressValues.push({
  //           label: convertToCase(mailToAddressArray[i].Mail_to_Address),
  //           value: convertToCase(mailToAddressArray[i].Mail_to_Address),
  //         });
  //       }
  //     }
  //   }
  });

  const tableFields = [
    "White_Glove",
    "First_Name",
    "Last_Name",
    "Relationship",
    "Authorization_Approved_Date",
    "Authorization_Expiration_Date",
    "Authorization_Type",
    "Current_Alert",
    "Next_Alert",
    "Historical_Alert",
    "Acknowledge_Alert",
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
        "errors were encountered in representative information table",
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
              RepresentativeInformationTable.displayName,
            )
          }
          disabled={
            prop.state.formView === "DashboardView" &&
            (prop.state.stageName === "Redirect Review" ||
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
          validationErrors={validationErrors}
          onChange={(selectValue, event) =>
            handleGridSelectChange(
              index,
              selectValue,
              event,
              RepresentativeInformationTable.displayName,
            )
          }
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
              RepresentativeInformationTable.displayName,
            )
          }
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
      <div className="Container AddProviderLabel AddModalLabel">
        <div className="row">
          {renderSimpleInputField("White_Glove", "White_Glove", 50, index)}
          {renderSimpleInputField("First_Name", "First Name", 50, index)}
          {renderSimpleInputField("Last_Name", "Last Name", 50, index)}
          {renderSimpleSelectField(
            "Relationship",
            "Relationship",
            relationshipValues,
            index,
          )}
        </div>

        <div className="row">
          {renderSimpleInputField("Current_Alert", "Current Alert", 50, index)}
          {renderSimpleInputField("Next_Alert", "Next_Alert", 50, index)}
          {renderSimpleInputField("Historical_Alert", "Historical Alert", 50, index)}
          {renderSimpleInputField("Acknowledge_Alert", "Acknowledge Alert", 50, index)}
        </div>
        <div className="row">
          {renderSimpleDatePickerField(
            "Authorization_Approved_Date",
            "Authorization Approved Date",
            index,
          )}
          {renderSimpleDatePickerField(
            "Authorization_Expiration_Date",
            "Authorization Expiration Date",
            index,
          )}
          {renderSimpleInputField(
            "Authorization_Type",
            "Authorization Type",
            50,
            index,
          )}
        </div>
      </div>
    );
  };

  const tdData = () => {
    if (
      representativeInformationGridData !== undefined &&
      representativeInformationGridData.length > 0
    ) {
      return representativeInformationGridData.map((data, index) => {
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
                          RepresentativeInformationTable.displayName,
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
                          RepresentativeInformationTable.displayName,
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
                      addTableRows(RepresentativeInformationTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(representativeInformationGridData.length);
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
        name="Representative Information"
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={RepresentativeInformationTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
      ></GridModal>
    </>
  );
}
