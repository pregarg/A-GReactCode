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
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];
  const location = useLocation();

  const [portalEnrolledValues, setPortalEnrolledValues] = useState([]);
  const [commPrefValues, setCommPrefValuesValues] = useState([]);
  const [mailToAddressValues, setMailToAddressValues] = useState([]);
  const [providerTypeValues, setProviderTypeValues] = useState([]);
  const [providerRoleValues, setProviderRoleValues] = useState([]);
  const [participatingProviderValues, setParticipatingProviderValues] = useState([]);
  
  const masterAngProviderTypeSelector = useSelector(
    (state) => state?.masterAngProviderType,
  );
  const masterAngCommPrefSelector = useSelector(
    (state) => state?.masterAngCommPref,
  );
  
  const masterAngPortalEnrolledSelector = useSelector(
    (state) => state?.masterAngPortalEnrolled,
  );
  console.log("masterAngPortalEnrolledSelector",masterAngPortalEnrolledSelector)
  const masterAngMailToAddressSelector = useSelector(
    (state) => state?.masterAngMailToAddress,
  );

  const masterAngParProviderSelector = useSelector(
    (state) => state?.masterAngParProvider,
  );

  const masterAngProviderRoleSelector = useSelector(
    (state) => state?.masterAngProviderRole,
  );
 
  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const portalEnrolled = masterAngPortalEnrolledSelector?.[0] || [];
    setPortalEnrolledValues(
      portalEnrolled.map((e) => e.Portal_Enrolled).map(kvMapper),
    );

    const providerType = masterAngProviderTypeSelector?.[0] || [];
    setProviderTypeValues(
      providerType.map((e) => e.Provider_Type).map(kvMapper),
    );

    const commPref = masterAngCommPrefSelector?.[0] || [];
    setCommPrefValuesValues(
      commPref.map((e) => e.Comm_Pref).map(kvMapper),
    );

    const ParProvider = masterAngParProviderSelector?.[0] || [];
    setParticipatingProviderValues(
      ParProvider.map((e) => e.Par_Provider).map(kvMapper),
    );

    const mailToAdd = masterAngMailToAddressSelector?.[0] || [];
    setMailToAddressValues(
      mailToAdd.map((e) => e.Mail_to_Address).map(kvMapper),
    );
    const providerRole = masterAngProviderRoleSelector?.[0] || [];
    setProviderRoleValues(
      providerRole.map((e) => e.Provider_Role).map(kvMapper),
    );
    
}, []);

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
           
            (location.state.formView === "DashboardView" ||
              location.state.formView === "DashboardHomeView") &&
            (stageName === "Start" && name === "Provider_Alert")||
            ((location.state.stageName === "Intake") && (name === "Provider_Alert")||
              location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Documents Needed" ||
              ((location.state.stageName === "Effectuate" ||
                location.state.stageName === "Pending Effectuate" || location.state.stageName === "Resolve" ||
                location.state.stageName === "Case Completed" || location.state.stageName === "Reopen") &&(name !== "Issue_Number"))||
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
            {renderSimpleInputField("Issue_Number", "Issue Number", 50, index)}
            {renderSimpleInputField(
              "Sequential_Provider_ID",
              "Sequential Provider ID",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Provider_Name",
              "Provider Name",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Provider_Last_Name",
              "Provider Last Name",
              50,
              index,
            )}
          </div>
          <div className="row">
            {renderSimpleInputField("Provider_TIN", "Provider TIN", 50, index)}
            {renderSimpleInputField(
              "State_Provider_ID",
              "State Provider ID",
              50,
              index,
            )}
            {renderSimpleInputField("Medicare_ID", "Medicare ID", 50, index)}
            {renderSimpleInputField("Medicaid_ID", "Medicaid ID", 50, index)}
          </div>
          <div className="row">
            {renderSimpleInputField(
              "PR_Representative",
              "PR Representative",
              50,
              index,
            )}
            {renderSimpleSelectField(
              "Participating_Provider",
              "Participating Provider",
              participatingProviderValues,
              index,
            )}
            {renderSimpleSelectField(
              "Provider_Type",
              "Provider Type",
              providerTypeValues,
              index,
            )}
            {renderSimpleInputField(
              "Provider_Contact_Name",
              "Provider Contact Name",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Contact_Phone_Number",
              "Contact Phone Number",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Provider_Taxonomy",
              "Provider Taxonomy",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Contact_Email_Address",
              "Contact Email Address",
              50,
              index,
            )}
            {renderSimpleInputField("Provider_IPA", "Provider IPA", 50, index)}
          </div>
          <div className="row">
            {renderSimpleInputField(
              "Provider_Vendor_Specialty",
              "Provider Vendor Specialty",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Provider_Vendor_Specialty_Description",
              "Specialty Description",
              50,
              index,
            )}
            {renderSimpleInputField(
              "Point_of_Contact",
              "Point of Contact",
              50,
              index,
            )}
            {renderSimpleSelectField(
              "Provider_Role",
              "Provider Role",
              providerRoleValues,
              index,
            )}
          </div>
          <div className="row">
            {renderSimpleInputField(
              "Email_Address",
              "Email Address",
              50,
              index,
            )}
            {renderSimpleSelectField(
              "Portal_Enrolled",
              "Portal Enrolled",
              portalEnrolledValues,
              index,
            )}
            {renderSimpleInputField(
              "Provider_Alert",
              "Provider Alert",
              50,
              index,
            )}
            {renderSimpleInputField("Provider_ID", "Provider ID", 50, index)}
          </div>
          <div className="row">
            {renderSimpleInputField("NPI_ID", "NPI ID", 50, index)}
            {renderSimpleInputField("Vendor_ID", "Vendor ID", 50, index)}
            {renderSimpleInputField("Vendor_Name", "Vendor Name", 50, index)}
            {renderSimpleInputField("Phone_Number", "Phone Number", 50, index)}
          </div>
          <div className="row">
            {renderSimpleInputField("Fax_Number", "Fax Number", 50, index)}
            {renderSimpleDatePickerField(
              "Par_Provider_Start_Date",
              "Par Provider Start Date",
              index,
            )}
            {renderSimpleDatePickerField(
              "Par_Provider_End_Date",
              "Par Provider End Date",
              index,
            )}
            {renderSimpleDatePickerField(
              "Provider_Par_Date",
              "Provider Par Date",
              index,
            )}
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
            {renderSimpleInputField("City", "City", 50, index)}
            {renderSimpleInputField("State", "State", 50, index)}
          </div>
          <div className="row"> 
            {renderSimpleInputField("Zip_Code", "Zip Code", 50, index)}
            {renderSimpleSelectField(
              "Mail_to_Address",
              "Mail to Address",
              mailToAddressValues,
              index,
            )}
            {renderSimpleSelectField(
              "Communication_Preference",
              "Communication Preference",
              commPrefValues,
              index,
            )}
          </div>
        </div>
      </>
    );
    //}
  };

  const tdData = () => {
    if (
      providerInformationGridData !== undefined &&
      providerInformationGridData.length > 0
    ) {
      return providerInformationGridData.map((data, index) => {
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
                          ProviderInformationTable.displayName,
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
                          ProviderInformationTable.displayName,
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

            {[
              "Issue_Number",
              "Sequential_Provider_ID",
              "Provider_Name",
              "Provider_Last_Name",
              "Contact_Phone_Number",
              "Contact_Email_Address",
              "Provider_Par_Date",
              "Provider_Taxonomy",
              "Provider_TIN",
              "State_Provider_ID",
              "Medicare_ID",
              "Medicaid_ID",
              "PR_Representative",
              "Participating_Provider",
              "Provider_Type",
              "Provider_Contact_Name",
              "Provider_IPA",
              "Provider_Vendor_Specialty",
              "Provider_Vendor_Specialty_Description",
              "Point_of_Contact",
              "Provider_Role",
              "Email_Address",
              "Portal_Enrolled",
              "Provider_Alert",
              "Provider_ID",
              "NPI_ID",
              "Vendor_ID",
              "Vendor_Name",
              "Phone_Number",
              "Fax_Number",
              "Par_Provider_Start_Date",
              "Par_Provider_End_Date",
              "Address_Line_1",
              "Address_Line_2",
              "City",
              "State",
              "Zip_Code",
              "Mail_to_Address",
              "Communication_Preference",
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
              <th scope="col">Sequential Provider ID</th>
              <th scope="col">Provider Name</th>
              <th scope="col">Provider Last Name</th>
              <th scope="col">Contact Phone Number</th>
              <th scope="col">Contact Email Address</th>
              <th scope="col">Provider Par Date</th>
              <th scope="col">Provider Taxonomy</th>
              <th scope="col">Provider TIN</th>
              <th scope="col">State Provider ID</th>
              <th scope="col">Provider ID</th>
              <th scope="col">Medicare ID</th>              
              <th scope="col">Medicaid ID</th>
              <th scope="col">PR Reprsentative</th>
              <th scope="col">Participating Provider</th>
              <th scope="col">Provider Type</th>
              <th scope="col">Provider Contact Name</th>
              <th scope="col">Provider IPA</th>
              <th scope="col">Provider / Vendor Speciality</th>
              <th scope="col">Provider / Vendor Speciality Description</th>
              <th scope="col">Point of Contact</th>
              <th scope="col">Provider Role</th>
              <th scope="col">Email Address</th>
              <th scope="col">Portal Enrolled</th>
              <th scope="col">Provider Alert</th>
              <th scope="col">NPI ID</th>
              <th scope="col">Vendor ID</th>
              <th scope="col">Vendor Name</th>
              <th scope="col">Phone Number</th>
              <th scope="col">Fax Number</th>
              <th scope="col">Par Provider Start Date</th>
              <th scope="col">Par Provider End Date</th>
              <th scope="col">Address Line 1</th>
              <th scope="col">Address Line 2</th>
              <th scope="col">City</th>
              <th scope="col">State</th>
              <th scope="col">Zip Code</th>43
              <th scope="col">Mail to Address</th>
              <th scope="col">Communication Preference</th>
            </tr>
          </thead>
          <tbody>
            {/* <TableRows specialityTableRowsData={specialityTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
            {tdData()}
          </tbody>
        </table>
      </div>
      <GridModal
        name="Provider Information"
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
