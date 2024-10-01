import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";

export default function ProviderInformationTable({
  providerInformationGridData,
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
  ProviderInformationTable.displayName = "ProviderInformationTable";

  const [dataIndex, setDataIndex] = useState();
  const [operationValue, setOperationValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
  const [isTouched, _] = useState({});
  const { getGridJson, convertToCase } = useGetDBTables();

  const masterAngProviderTypeSelector = useSelector(
    (state) => state?.masterAngProviderType,
  );
  const masterAngCommPrefSelector = useSelector(
    (state) => state?.masterAngCommPref,
  );
  const masterAngPortalEnrolledSelector = useSelector(
    (state) => state?.masterAngPortalEnrolled,
  );
  const masterAngMailToAddressSelector = useSelector(
    (state) => state?.masterAngMailToAddress,
  );

  const location = useLocation();
  const providerTypeValues = [];
  const commPrefValues = [];
  const portalEnrolledValues = [];
  const mailToAddressValues = [];

  useEffect(() => {
    if (masterAngProviderTypeSelector) {
      const providerTypeArray =
        masterAngProviderTypeSelector.length === 0
          ? []
          : masterAngProviderTypeSelector[0];

      for (let i = 0; i < providerTypeArray.length; i++) {
        providerTypeValues.push({
          label: convertToCase(providerTypeArray[i].Provider_Type),
          value: convertToCase(providerTypeArray[i].Provider_Type),
        });
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

    if (masterAngPortalEnrolledSelector) {
      const portalEnrolledArray =
        masterAngPortalEnrolledSelector.length === 0
          ? []
          : masterAngPortalEnrolledSelector[0];
      const uniquePortalEnrolledValues = {};

      for (let i = 0; i < portalEnrolledArray.length; i++) {
        const portalEnrolled = convertToCase(
          portalEnrolledArray[i].Portal_Enrolled,
        );

        if (!uniquePortalEnrolledValues[portalEnrolled]) {
          uniquePortalEnrolledValues[portalEnrolled] = true;
          portalEnrolledValues.push({
            label: convertToCase(portalEnrolledArray[i].Portal_Enrolled),
            value: convertToCase(portalEnrolledArray[i].Portal_Enrolled),
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
        "errors were encountered in provider information table",
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
              ProviderInformationTable.displayName,
            )
          }
          disabled={
            location.state.formView === "DashboardView" &&
            (location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Documents Needed" ||
              location.state.stageName === "CaseArchived")
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
              ProviderInformationTable.displayName,
            )
          }
          disabled={
            location.state.formView === "DashboardView" &&
            (location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Documents Needed" ||
              location.state.stageName === "Effectuate" ||
              location.state.stageName === "Pending Effectuate" ||
              location.state.stageName === "Resolve" ||
              location.state.stageName === "Case Completed" ||
              location.state.stageName === "Reopen" ||
              location.state.stageName === "CaseArchived")
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
              ProviderInformationTable.displayName,
            )
          }
          disabled={
            location.state.formView === "DashboardView" &&
            (location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Documents Needed" ||
              location.state.stageName === "Effectuate" ||
              location.state.stageName === "Pending Effectuate" ||
              location.state.stageName === "Resolve" ||
              location.state.stageName === "Case Completed" ||
              location.state.stageName === "Reopen" ||
              location.state.stageName === "CaseArchived")
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
            {renderSimpleDatePickerField("Post_Date", "Post Date",  index)}
            {renderSimpleInputField("Provider_Name", "Provider Name", 50, index)}
            {renderSimpleInputField("Billed_Amount", "Billed AmountS)", 50, index)}
          </div>
          <div className="row">
            {renderSimpleInputField("Allowed_Amount", "Allowed Amount", 50, index)}
            {renderSimpleInputField("CCT_Policy_Name", "CCT Policy Name", 50, index)}
            {renderSimpleDatePickerField("Procedure_Code", "Procedure Code or Diagnosis code", index)}
            {renderSimpleInputField("Patient_Ref", "Patient Ref/Account", 50, index)}
          </div>
          <div className="row">
            {renderSimpleInputField("Provider_Account", "Provider Account",50, index)}

            {renderSimpleInputField("Issue_Number", "Issue Number", 50, index)}
            {renderSimpleInputField("Claim_Number", "Claim Number", 16, index)}
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
            {renderSimpleInputField("Claim_Type", "Claim Type", 50, index)}
          </div>
        </div>
      </>
    );
  };

  const tdData = () => {
    if (providerInformationGridData !== undefined && providerInformationGridData.length > 0) {
      return providerInformationGridData.map((data, index) => {
        return (
          <tr key={index} className={data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""}>
            {lockStatus === "N" && (
              <>
                <td>
                  <span style={{ display: "flex" }}>
                    <button
                      className="deleteBtn"
                      style={{ width: "75%", float: "left" }}
                      onClick={() => {
                        deleteTableRows(index, ProviderInformationTable.displayName, "Force Delete");
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
                        editTableRows(index, ProviderInformationTable.displayName);
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
                {
                  e.endsWith("_Date")
                  ? data?.[e]?.value
                    ? formatDate(data[e].value)
                    : formatDate(data[e])
                  : data?.[e]?.value
                    ? convertToCase(data[e].value)
                    : convertToCase(data[e])
                }
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
                      addTableRows(ProviderInformationTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(providerInformationGridData.length);
                      handleOperationValue("Add");
                    }}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </th>
              )}
              {lockStatus === "V" && <th style={{ width: "" }}></th>}
              <th scope="col">Issue Number</th>
              <th scope="col">Claim Number</th>
              <th scope="col">Authorization Number</th>
              <th scope="col">Provider Name</th>
              <th scope="col">Claim Type</th>
              <th scope="col">Service Start Date</th>
              <th scope="col">Service End Date</th>
              <th scope="col">Number of Days in Span</th>
              <th scope="col">PostDate</th>
              <th scope="col">Billed Amount</th>
              <th scope="col">Allowed Amount</th>
              <th scope="col">CCT Policy Name</th>
              <th scope="col">Procedure Code or Diagnosis Code</th>
              <th scope="col">Patient Ref/Account#</th>
              <th scope="col">Provider Account #</th>
            </tr>
          </thead>
          <tbody>
            {/* <TableRows specialityTableRowsData={specialityTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
            {tdData()}
          </tbody>
        </table>
      </div>
      <GridModal
        name="Claim Information"
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={ProviderInformationTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
      ></GridModal>
    </>
  );
}
