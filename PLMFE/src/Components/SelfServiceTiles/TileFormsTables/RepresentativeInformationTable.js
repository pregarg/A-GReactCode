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

    if (masterAngCommPrefSelector) {
      const commPrefArray =
        masterAngCommPrefSelector.length === 0
          ? []
          : masterAngCommPrefSelector[0];

      for (let i = 0; i < commPrefArray.length; i++) {
        commPrefValues.push({
          label: convertToCase(commPrefArray[i].Comm_Pref),
          value: convertToCase(commPrefArray[i].Comm_Pref),
        });
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

  const renderSimpleInputField = (name, label, maxLength, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleInputField
          name={name}
          label={label}
          maxLength={maxLength}
          data={getGridJson(gridFieldTempState)}
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
          data={getGridJson(gridFieldTempState)}
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
          data={getGridJson(gridFieldTempState)}
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
          {renderSimpleInputField("Issue_Number", "Issue Number", 50, index)}
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
          {renderSimpleSelectField(
            "AOR_Type",
            "AOR Type",
            aorTypeValues,
            index,
          )}
          {renderSimpleDatePickerField(
            "AOR_Approved_Date",
            "AOR Approved Date",
            index,
          )}
          {renderSimpleDatePickerField(
            "AOR_Expiration_Date",
            "AOR Expiration Date",
            index,
          )}
          {renderSimpleSelectField(
            "Communication_Preference",
            "Communication Preference",
            commPrefValues,
            index,
          )}
        </div>
        <div className="row">
          {renderSimpleSelectField(
            "Mail_to_Address",
            "Mail To Address",
            mailToAddressValues,
            index,
          )}
          {renderSimpleInputField("Email_Address", "Email Address", 50, index)}
          {renderSimpleInputField("Phone_Number", "Phone Number", 50, index)}
          {renderSimpleInputField("Fax_Number", "Fax Number", 50, index)}
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
          {renderSimpleInputField("Notes", "Notes", 50, index)}
        </div>
        <div className="row">
          {renderSimpleInputField(
            "Address_Line_1",
            "Address Line 1",
            50,
            index,
          )}
          {renderSimpleInputField(
            "Address_Line_2",
            "Address Line 2",
            50,
            index,
          )}
        </div>
        <div className="row">
          {renderSimpleInputField("City", "City", 50, index)}
          {renderSimpleInputField("State_", "State", 50, index)}
          {renderSimpleInputField("Zip_Code", "Zip Code", 50, index)}
          {renderSimpleInputField("County", "County", 50, index)}
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

            {Object.keys((e) => (
              <td className="tableData">
                {e.endsWith("_Date")
                  ? data?.[e].value !== undefined
                    ? formatDate(data[e].value)
                    : formatDate(data[e])
                  : data?.[e].value !== undefined
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
              {Object.keys(gridFieldTempState).map((e) => (
                <th scope="col">{e.replaceAll("_", "")}</th>
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
      ></GridModal>
    </>
  );
}
