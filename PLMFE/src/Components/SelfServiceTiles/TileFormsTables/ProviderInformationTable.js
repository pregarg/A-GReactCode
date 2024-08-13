import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";

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
}) {
  ProviderInformationTable.displayName = "ProviderInformationTable";

  const [dataIndex, setDataIndex] = useState();

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  const { getGridJson, convertToCase } = useGetDBTables();

  const masterAngProviderRoleSelector = useSelector(
    (state) => state?.masterAngProviderRole,
  );
  const masterAngParProviderSelector = useSelector(
    (state) => state?.masterAngParProvider,
  );
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

  let prop = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];
  console.log("providerstagename@-->", stageName);

  let lineNumberOptions = [];
  let providerRoleValues = [];
  let participatingProviderValues = [];
  let providerTypeValues = [];
  let commPrefValues = [];
  let portalEnrolledValues = [];
  let mailToAddressValues = [];

  useEffect(() => {
    if (masterAngProviderRoleSelector) {
      const providerRoleArray =
        masterAngProviderRoleSelector.length === 0
          ? []
          : masterAngProviderRoleSelector[0];

      for (let i = 0; i < providerRoleArray.length; i++) {
        providerRoleValues.push({
          label: convertToCase(providerRoleArray[i].Provider_Role),
          value: convertToCase(providerRoleArray[i].Provider_Role),
        });
      }
    }

    if (masterAngParProviderSelector) {
      const parProviderArray =
        masterAngParProviderSelector.length === 0
          ? []
          : masterAngParProviderSelector[0];

      for (let i = 0; i < parProviderArray.length; i++) {
        participatingProviderValues.push({
          label: convertToCase(parProviderArray[i].Par_Provider),
          value: convertToCase(parProviderArray[i].Par_Provider),
        });
      }
    }

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

  const tdDataReplica = (index) => {
    console.log("Inside tdDataReplica");

    const data = getGridJson(gridFieldTempState);

    // selectJson["lineNumberOptions"].map((val) =>
    //     lineNumberOptions.push({ value: val, label: val })
    // );

    return (
      <>
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Issue Number</label>
              <br />
              <input
                type="text"
                value={
                  "Issue_Number" in data &&
                  data.Issue_Number.value !== undefined
                    ? convertToCase(data.Issue_Number.value)
                    : convertToCase(data.Issue_Number)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Issue_Number"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
                disabled={
                  prop.state.formView === "DashboardView" &&
                  (prop.state.stageName === "Redirect Review" ||
                    prop.state.stageName === "Documents Needed" ||
                    prop.state.stageName === "CaseArchived")
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Sequential Provider ID</label>
              <br />
              <input
                type="text"
                value={
                  "Sequential_Provider_ID" in data &&
                  data.Sequential_Provider_ID.value !== undefined
                    ? convertToCase(data.Sequential_Provider_ID.value)
                    : convertToCase(data.Sequential_Provider_ID)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Sequential_Provider_ID"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Provider Name</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_Name" in data &&
                  data.Provider_Name.value !== undefined
                    ? convertToCase(data.Provider_Name.value)
                    : convertToCase(data.Provider_Name)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_Name"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Provider Last Name</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_Last_Name" in data &&
                  data.Provider_Last_Name.value !== undefined
                    ? convertToCase(data.Provider_Last_Name.value)
                    : convertToCase(data.Provider_Last_Name)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_Last_Name"
                className="form-control"
                maxLength="50"
                title="Please Enter Provider Last Name"
                disabled={lockStatus == "V"}
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Provider TIN</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_TIN" in data &&
                  data.Provider_TIN.value !== undefined
                    ? convertToCase(data.Provider_TIN.value)
                    : convertToCase(data.Provider_TIN)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_TIN"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>State Provider ID</label>
              <br />
              <input
                type="text"
                value={
                  "State_Provider_ID" in data &&
                  data.State_Provider_ID.value !== undefined
                    ? convertToCase(data.State_Provider_ID.value)
                    : convertToCase(data.State_Provider_ID)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="State_Provider_ID"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Medicare ID</label>
              <br />
              <input
                type="text"
                value={
                  "Medicare_ID" in data && data.Medicare_ID.value !== undefined
                    ? convertToCase(data.Medicare_ID.value)
                    : convertToCase(data.Medicare_ID)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Medicare_ID"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Medicaid ID</label>
              <br />
              <input
                type="text"
                value={
                  "Medicaid_ID" in data && data.Medicaid_ID.value !== undefined
                    ? convertToCase(data.Medicaid_ID.value)
                    : convertToCase(data.Medicaid_ID)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Medicaid_ID"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>PR Representative</label>
              <br />
              <input
                type="text"
                value={
                  "PR_Representative" in data &&
                  data.PR_Representative.value !== undefined
                    ? convertToCase(data.PR_Representative.value)
                    : convertToCase(data.PR_Representative)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="PR_Representative"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Participating Provider</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.Participating_Provider}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    ProviderInformationTable.displayName,
                  )
                }
                options={participatingProviderValues}
                name="Participating_Provider"
                id="lineNumberDropDown"
                isDisabled={
                  prop.state.formView === "DashboardView" &&
                  (prop.state.stageName === "Redirect Review" ||
                    prop.state.stageName === "Documents Needed" ||
                    prop.state.stageName === "Effectuate" ||
                    prop.state.stageName === "Pending Effectuate" ||
                    prop.state.stageName === "Resolve" ||
                    prop.state.stageName === "Case Completed" ||
                    prop.state.stageName === "Reopen" ||
                    prop.state.stageName === "CaseArchived")
                    ? true
                    : false
                }
                isClearable
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Provider Type</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.Provider_Type}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    ProviderInformationTable.displayName,
                  )
                }
                options={providerTypeValues}
                name="Provider_Type"
                id="lineNumberDropDown"
                isDisabled={
                  prop.state.formView === "DashboardView" &&
                  (prop.state.stageName === "Redirect Review" ||
                    prop.state.stageName === "Documents Needed" ||
                    prop.state.stageName === "Effectuate" ||
                    prop.state.stageName === "Pending Effectuate" ||
                    prop.state.stageName === "Resolve" ||
                    prop.state.stageName === "Case Completed" ||
                    prop.state.stageName === "Reopen" ||
                    prop.state.stageName === "CaseArchived")
                    ? true
                    : false
                }
                isClearable
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Provider Contact Name</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_Contact_Name" in data &&
                  data.Provider_Contact_Name.value !== undefined
                    ? convertToCase(data.Provider_Contact_Name.value)
                    : convertToCase(data.Provider_Contact_Name)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_Contact_Name"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Contact Phone Number</label>
              <br />
              <input
                type="text"
                value={
                  "Contact_Phone_Number" in data &&
                  data.Contact_Phone_Number.value !== undefined
                    ? convertToCase(data.Contact_Phone_Number.value)
                    : convertToCase(data.Contact_Phone_Number)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Contact_Phone_Number"
                className="form-control"
                maxLength="50"
                title="Please Enter Contact Phone Number"
                disabled={lockStatus == "V"}
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Provider Taxonomy</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_Taxonomy" in data &&
                  data.Provider_Taxonomy.value !== undefined
                    ? convertToCase(data.Provider_Taxonomy.value)
                    : convertToCase(data.Provider_Taxonomy)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_Taxonomy"
                className="form-control"
                maxLength="50"
                title="Please Enter Provider Taxonomy"
                disabled={lockStatus == "V"}
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Contact Email Address</label>
              <br />
              <input
                type="text"
                value={
                  "Contact_Email_Address" in data &&
                  data.Contact_Email_Address.value !== undefined
                    ? convertToCase(data.Contact_Email_Address.value)
                    : convertToCase(data.Contact_Email_Address)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Contact_Email_Address"
                className="form-control"
                maxLength="50"
                title="Please Enter Contact Email Address"
                disabled={lockStatus == "V"}
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Provider IPA</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_IPA" in data &&
                  data.Provider_IPA.value !== undefined
                    ? convertToCase(data.Provider_IPA.value)
                    : convertToCase(data.Provider_IPA)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_IPA"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Provider Vendor Specialty</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_Vendor_Specialty" in data &&
                  data.Provider_Vendor_Specialty.value !== undefined
                    ? convertToCase(data.Provider_Vendor_Specialty.value)
                    : convertToCase(data.Provider_Vendor_Specialty)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_Vendor_Specialty"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Specialty Description</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_Vendor_Specialty_Description" in data &&
                  data.Provider_Vendor_Specialty_Description.value !== undefined
                    ? convertToCase(
                        data.Provider_Vendor_Specialty_Description.value,
                      )
                    : convertToCase(data.Provider_Vendor_Specialty_Description)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_Vendor_Specialty_Description"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Point of Contact *</label>
              <br />
              <input
                type="text"
                value={
                  "Point_of_Contact" in data &&
                  data.Point_of_Contact.value !== undefined
                    ? convertToCase(data.Point_of_Contact.value)
                    : convertToCase(data.Point_of_Contact)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Point_of_Contact"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Provider Role</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.Provider_Role}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    ProviderInformationTable.displayName,
                  )
                }
                options={providerRoleValues}
                name="Provider_Role"
                id="lineNumberDropDown"
                isDisabled={
                  prop.state.formView === "DashboardView" &&
                  (prop.state.stageName === "Redirect Review" ||
                    prop.state.stageName === "Documents Needed" ||
                    prop.state.stageName === "Effectuate" ||
                    prop.state.stageName === "Pending Effectuate" ||
                    prop.state.stageName === "Resolve" ||
                    prop.state.stageName === "Case Completed" ||
                    prop.state.stageName === "Reopen" ||
                    prop.state.stageName === "CaseArchived")
                    ? true
                    : false
                }
                isClearable
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Email Address</label>
              <br />
              <input
                type="text"
                value={
                  "Email_Address" in data &&
                  data.Email_Address.value !== undefined
                    ? convertToCase(data.Email_Address.value)
                    : convertToCase(data.Email_Address)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Email_Address"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Portal Enrolled</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.Portal_Enrolled}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    ProviderInformationTable.displayName,
                  )
                }
                options={portalEnrolledValues}
                name="Portal_Enrolled"
                id="lineNumberDropDown"
                isDisabled={
                  prop.state.formView === "DashboardView" &&
                  (prop.state.stageName === "Redirect Review" ||
                    prop.state.stageName === "Documents Needed" ||
                    prop.state.stageName === "Effectuate" ||
                    prop.state.stageName === "Pending Effectuate" ||
                    prop.state.stageName === "Resolve" ||
                    prop.state.stageName === "Case Completed" ||
                    prop.state.stageName === "Reopen" ||
                    prop.state.stageName === "CaseArchived")
                    ? true
                    : false
                }
                isClearable
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Provider Alert</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_Alert" in data &&
                  data.Provider_Alert.value !== undefined
                    ? convertToCase(data.Provider_Alert.value)
                    : convertToCase(data.Provider_Alert)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_Alert"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
                disabled={
                  (prop.state.formView === "DashboardView" ||
                    prop.state.formView === "DashboardHomeView") &&
                  (stageName === "Start" ||
                    prop.state.stageName === "Intake" ||
                    prop.state.stageName === "Acknowledge" ||
                    prop.state.stageName === "Redirect Review" ||
                    prop.state.stageName === "Documents Needed" ||
                    prop.state.stageName === "Research" ||
                    prop.state.stageName === "Effectuate" ||
                    prop.state.stageName === "Pending Effectuate" ||
                    prop.state.stageName === "Resolve" ||
                    prop.state.stageName === "Case Completed" ||
                    prop.state.stageName === "Reopen" ||
                    prop.state.stageName === "CaseArchived")
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Provider ID</label>
              <br />
              <input
                type="text"
                value={
                  "Provider_ID" in data && data.Provider_ID.value !== undefined
                    ? convertToCase(data.Provider_ID.value)
                    : convertToCase(data.Provider_ID)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Provider_ID"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>NPI ID</label>
              <br />
              <input
                type="text"
                value={
                  "NPI_ID" in data && data.NPI_ID.value !== undefined
                    ? convertToCase(data.NPI_ID.value)
                    : convertToCase(data.NPI_ID)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="NPI_ID"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Vendor ID</label>
              <br />
              <input
                type="text"
                value={
                  "Vendor_ID" in data && data.Vendor_ID.value !== undefined
                    ? convertToCase(data.Vendor_ID.value)
                    : convertToCase(data.Vendor_ID)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Vendor_ID"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Vendor Name</label>
              <br />
              <input
                type="text"
                value={
                  "Vendor_Name" in data && data.Vendor_Name.value !== undefined
                    ? convertToCase(data.Vendor_Name.value)
                    : convertToCase(data.Vendor_Name)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Vendor_Name"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Phone Number</label>
              <br />
              <input
                type="text"
                value={
                  "Phone_Number" in data &&
                  data.Phone_Number.value !== undefined
                    ? convertToCase(data.Phone_Number.value)
                    : convertToCase(data.Phone_Number)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Phone_Number"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>Fax Number</label>
              <br />
              <input
                type="text"
                value={
                  "Fax_Number" in data && data.Fax_Number.value !== undefined
                    ? convertToCase(data.Fax_Number.value)
                    : convertToCase(data.Fax_Number)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Fax_Number"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">Par Provider Start Date</label>
              <br />
              <div className="form-floating">
                <ReactDatePicker
                  className="form-control example-custom-input-modal"
                  selected={
                    data?.Par_Provider_Start_Date?.value !== undefined
                      ? new Date(data.Par_Provider_Start_Date.value)
                      : data?.Par_Provider_Start_Date !== undefined
                        ? new Date(data.Par_Provider_Start_Date)
                        : null
                  }
                  name="Par_Provider_Start_Date"
                  onChange={(selectValue, event) =>
                    handleGridDateChange(
                      index,
                      selectValue,
                      "Par_Provider_Start_Date",
                      ProviderInformationTable.displayName,
                    )
                  }
                  peekNextMonth
                  showMonthDropdown
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="MM/dd/yyyy"
                  id="datePicker"
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
                      ? true
                      : false
                  }
                />
              </div>
            </div>

            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">Par Provider End Date</label>
              <br />
              <div className="form-floating">
                <ReactDatePicker
                  className="form-control example-custom-input-modal"
                  selected={
                    data?.Par_Provider_End_Date?.value !== undefined
                      ? new Date(data.Par_Provider_End_Date.value)
                      : data?.Par_Provider_End_Date !== undefined
                        ? new Date(data.Par_Provider_End_Date)
                        : null
                  }
                  name="Par_Provider_End_Date"
                  onChange={(selectValue, event) =>
                    handleGridDateChange(
                      index,
                      selectValue,
                      "Par_Provider_End_Date",
                      ProviderInformationTable.displayName,
                    )
                  }
                  peekNextMonth
                  showMonthDropdown
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="MM/dd/yyyy"
                  id="datePicker"
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
                      ? true
                      : false
                  }
                />
              </div>
            </div>
            <div className="col-xs-6 col-md-3">
              <label htmlFor="datePicker">Provider Par Date</label>
              <br />
              <div className="form-floating">
                <ReactDatePicker
                  className="example-custom-input-modal"
                  selected={
                    data?.Provider_Par_Date?.value !== undefined
                      ? new Date(data.Provider_Par_Date.value)
                      : data?.Provider_Par_Date !== undefined
                        ? new Date(data.Provider_Par_Date)
                        : null
                  }
                  name="Provider_Par_Date"
                  onChange={(selectValue, event) =>
                    handleGridDateChange(
                      index,
                      selectValue,
                      "Provider_Par_Date",
                      ProviderInformationTable.displayName,
                    )
                  }
                  peekNextMonth
                  showMonthDropdown
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="MM/dd/yyyy"
                  id="datePicker"
                  disabled={lockStatus == "V"}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-6">
              <label>Address Line 1</label>
              <br />
              <input
                type="text"
                value={
                  "Address_Line_1" in data &&
                  data.Address_Line_1.value !== undefined
                    ? convertToCase(data.Address_Line_1.value)
                    : convertToCase(data.Address_Line_1)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Address_Line_1"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-6">
              <label>Address Line 2</label>
              <br />
              <input
                type="text"
                value={
                  "Address_Line_2" in data &&
                  data.Address_Line_2.value !== undefined
                    ? convertToCase(data.Address_Line_2.value)
                    : convertToCase(data.Address_Line_2)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Address_Line_2"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-3">
              <label>City</label>
              <br />
              <input
                type="text"
                value={
                  "City" in data && data.City.value !== undefined
                    ? convertToCase(data.City.value)
                    : convertToCase(data.City)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="City"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>State</label>
              <br />
              <input
                type="text"
                value={
                  "State" in data && data.State.value !== undefined
                    ? convertToCase(data.State.value)
                    : convertToCase(data.State)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="State"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Zip Code</label>
              <br />
              <input
                type="text"
                value={
                  "Zip_Code" in data && data.Zip_Code.value !== undefined
                    ? convertToCase(data.Zip_Code.value)
                    : convertToCase(data.Zip_Code)
                }
                onChange={(evnt) =>
                  handleGridFieldChange(
                    index,
                    evnt,
                    ProviderInformationTable.displayName,
                  )
                }
                name="Zip_Code"
                className="form-control"
                maxLength="50"
                title="Please Enter Valid Type"
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
                    ? true
                    : false
                }
              />
            </div>
            <div className="col-xs-6 col-md-3">
              <label>Mail to Address</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.Mail_to_Address}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    ProviderInformationTable.displayName,
                  )
                }
                options={mailToAddressValues}
                name="Mail_to_Address"
                id="lineNumberDropDown"
                isDisabled={
                  prop.state.formView === "DashboardView" &&
                  (prop.state.stageName === "Redirect Review" ||
                    prop.state.stageName === "Documents Needed" ||
                    prop.state.stageName === "Effectuate" ||
                    prop.state.stageName === "Pending Effectuate" ||
                    prop.state.stageName === "Resolve" ||
                    prop.state.stageName === "Case Completed" ||
                    prop.state.stageName === "Reopen" ||
                    prop.state.stageName === "CaseArchived")
                    ? true
                    : false
                }
                isClearable
              />
            </div>

            <div className="col-xs-6 col-md-3">
              <label>Communication Preference</label>
              <br />
              <Select
                styles={{
                  control: (provided) => ({
                    ...provided,
                    fontWeight: "lighter",
                  }),
                }}
                value={data.Communication_Preference}
                onChange={(selectValue, event) =>
                  handleGridSelectChange(
                    index,
                    selectValue,
                    event,
                    ProviderInformationTable.displayName,
                  )
                }
                options={commPrefValues}
                name="Communication_Preference"
                id="lineNumberDropDown"
                isDisabled={
                  prop.state.formView === "DashboardView" &&
                  (prop.state.stageName === "Redirect Review" ||
                    prop.state.stageName === "Documents Needed" ||
                    prop.state.stageName === "Effectuate" ||
                    prop.state.stageName === "Pending Effectuate" ||
                    prop.state.stageName === "Resolve" ||
                    prop.state.stageName === "Case Completed" ||
                    prop.state.stageName === "Reopen" ||
                    prop.state.stageName === "CaseArchived")
                    ? true
                    : false
                }
                isClearable
              />
            </div>
          </div>
        </div>
      </>
    );
    //}
  };

  const tdData = () => {
    console.log("Inside tdData");

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
            {lockStatus == "N" && (
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
            {lockStatus == "V" && (
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

            <td className="tableData">
              {"Issue_Number" in data && data.Issue_Number.value !== undefined
                ? convertToCase(data.Issue_Number.value)
                : convertToCase(data.Issue_Number)}
            </td>
            <td className="tableData">
              {"Sequential_Provider_ID" in data &&
              data.Sequential_Provider_ID.value !== undefined
                ? convertToCase(data.Sequential_Provider_ID.value)
                : convertToCase(data.Sequential_Provider_ID)}
            </td>
            <td className="tableData">
              {"Provider_Name" in data && data.Provider_Name.value !== undefined
                ? convertToCase(data.Provider_Name.value)
                : convertToCase(data.Provider_Name)}
            </td>

            <td className="tableData">
              {"Provider_Last_Name" in data &&
              data.Provider_Last_Name.value !== undefined
                ? convertToCase(data.Provider_Last_Name.value)
                : convertToCase(data.Provider_Last_Name)}
            </td>

            <td className="tableData">
              {"Contact_Phone_Number" in data &&
              data.Contact_Phone_Number.value !== undefined
                ? convertToCase(data.Contact_Phone_Number.value)
                : convertToCase(data.Contact_Phone_Number)}
            </td>
            <td className="tableData">
              {"Contact_Email_Address" in data &&
              data.Contact_Email_Address.value !== undefined
                ? convertToCase(data.Contact_Email_Address.value)
                : convertToCase(data.Contact_Email_Address)}
            </td>
            <td className="tableData">
              {"Provider_Par_Date" in data &&
              data.Provider_Par_Date.value !== undefined
                ? formatDate(data.Provider_Par_Date.value)
                : formatDate(data.Provider_Par_Date)}
            </td>

            <td className="tableData">
              {"Provider_Taxonomy" in data &&
              data.Provider_Taxonomy.value !== undefined
                ? convertToCase(data.Provider_Taxonomy.value)
                : convertToCase(data.Provider_Taxonomy)}
            </td>

            <td className="tableData">
              {"Provider_TIN" in data && data.Provider_TIN.value !== undefined
                ? convertToCase(data.Provider_TIN.value)
                : convertToCase(data.Provider_TIN)}
            </td>
            <td className="tableData">
              {"State_Provider_ID" in data &&
              data.State_Provider_ID.value !== undefined
                ? convertToCase(data.State_Provider_ID.value)
                : convertToCase(data.State_Provider_ID)}
            </td>
            <td className="tableData">
              {"Medicare_ID" in data && data.Medicare_ID.value !== undefined
                ? convertToCase(data.Medicare_ID.value)
                : convertToCase(data.Medicare_ID)}
            </td>
            <td className="tableData">
              {"Medicaid_ID" in data && data.Medicaid_ID.value !== undefined
                ? convertToCase(data.Medicaid_ID.value)
                : convertToCase(data.Medicaid_ID)}
            </td>
            <td className="tableData">
              {"PR_Representative" in data &&
              data.PR_Representative.value !== undefined
                ? convertToCase(data.PR_Representative.value)
                : convertToCase(data.PR_Representative)}
            </td>
            <td className="tableData">
              {"Participating_Provider" in data &&
              data.Participating_Provider.value !== undefined
                ? convertToCase(data.Participating_Provider.value)
                : convertToCase(data.Participating_Provider)}
            </td>
            <td className="tableData">
              {"Provider_Type" in data && data.Provider_Type.value !== undefined
                ? convertToCase(data.Provider_Type.value)
                : convertToCase(data.Provider_Type)}
            </td>
            <td className="tableData">
              {"Provider_Contact_Name" in data &&
              data.Provider_Contact_Name.value !== undefined
                ? convertToCase(data.Provider_Contact_Name.value)
                : convertToCase(data.Provider_Contact_Name)}
            </td>
            <td className="tableData">
              {"Provider_IPA" in data && data.Provider_IPA.value !== undefined
                ? convertToCase(data.Provider_IPA.value)
                : convertToCase(data.Provider_IPA)}
            </td>

            <td className="tableData">
              {"Provider_Vendor_Specialty" in data &&
              data.Provider_Vendor_Specialty.value !== undefined
                ? convertToCase(data.Provider_Vendor_Specialty.value)
                : convertToCase(data.Provider_Vendor_Specialty)}
            </td>
            <td className="tableData">
              {"Provider_Vendor_Specialty_Description" in data &&
              data.Provider_Vendor_Specialty_Description.value !== undefined
                ? convertToCase(
                    data.Provider_Vendor_Specialty_Description.value,
                  )
                : convertToCase(data.Provider_Vendor_Specialty_Description)}
            </td>
            <td className="tableData">
              {"Point_of_Contact" in data &&
              data.Point_of_Contact.value !== undefined
                ? convertToCase(data.Point_of_Contact.value)
                : convertToCase(data.Point_of_Contact)}
            </td>
            <td className="tableData">
              {"Provider_Role" in data && data.Provider_Role.value !== undefined
                ? convertToCase(data.Provider_Role.value)
                : convertToCase(data.Provider_Role)}
            </td>

            <td className="tableData">
              {"Email_Address" in data && data.Email_Address.value !== undefined
                ? convertToCase(data.Email_Address.value)
                : convertToCase(data.Email_Address)}
            </td>
            <td className="tableData">
              {"Portal_Enrolled" in data &&
              data.Portal_Enrolled.value !== undefined
                ? convertToCase(data.Portal_Enrolled.value)
                : convertToCase(data.Portal_Enrolled)}
            </td>
            <td className="tableData">
              {"Provider_Alert" in data &&
              data.Provider_Alert.value !== undefined
                ? convertToCase(data.Provider_Alert.value)
                : convertToCase(data.Provider_Alert)}
            </td>
            <td className="tableData">
              {"Provider_ID" in data && data.Provider_ID.value !== undefined
                ? convertToCase(data.Provider_ID.value)
                : convertToCase(data.Provider_ID)}
            </td>
            <td className="tableData">
              {"NPI_ID" in data && data.NPI_ID.value !== undefined
                ? convertToCase(data.NPI_ID.value)
                : convertToCase(data.NPI_ID)}
            </td>
            <td className="tableData">
              {"Vendor_ID" in data && data.Vendor_ID.value !== undefined
                ? convertToCase(data.Vendor_ID.value)
                : convertToCase(data.Vendor_ID)}
            </td>
            <td className="tableData">
              {"Vendor_Name" in data && data.Vendor_Name.value !== undefined
                ? convertToCase(data.Vendor_Name.value)
                : convertToCase(data.Vendor_Name)}
            </td>
            <td className="tableData">
              {"Phone_Number" in data && data.Phone_Number.value !== undefined
                ? convertToCase(data.Phone_Number.value)
                : convertToCase(data.Phone_Number)}
            </td>
            <td className="tableData">
              {"Fax_Number" in data && data.Fax_Number.value !== undefined
                ? convertToCase(data.Fax_Number.value)
                : convertToCase(data.Fax_Number)}
            </td>

            <td className="tableData">
              {"Par_Provider_Start_Date" in data &&
              data.Par_Provider_Start_Date.value !== undefined
                ? formatDate(data.Par_Provider_Start_Date.value)
                : formatDate(data.Par_Provider_Start_Date)}
            </td>
            <td className="tableData">
              {"Par_Provider_End_Date" in data &&
              data.Par_Provider_End_Date.value !== undefined
                ? formatDate(data.Par_Provider_End_Date.value)
                : formatDate(data.Par_Provider_End_Date)}
            </td>

            <td className="tableData">
              {"Address_Line_1" in data &&
              data.Address_Line_1.value !== undefined
                ? convertToCase(data.Address_Line_1.value)
                : convertToCase(data.Address_Line_1)}
            </td>
            <td className="tableData">
              {"Address_Line_2" in data &&
              data.Address_Line_2.value !== undefined
                ? convertToCase(data.Address_Line_2.value)
                : convertToCase(data.Address_Line_2)}
            </td>
            <td className="tableData">
              {"City" in data && data.City.value !== undefined
                ? convertToCase(data.City.value)
                : convertToCase(data.City)}
            </td>
            <td className="tableData">
              {"State" in data && data.State.value !== undefined
                ? convertToCase(data.State.value)
                : convertToCase(data.State)}
            </td>
            <td className="tableData">
              {"Zip_Code" in data && data.Zip_Code.value !== undefined
                ? convertToCase(data.Zip_Code.value)
                : convertToCase(data.Zip_Code)}
            </td>

            <td className="tableData">
              {"Mail_to_Address" in data &&
              data.Mail_to_Address.value !== undefined
                ? convertToCase(data.Mail_to_Address.value)
                : convertToCase(data.Mail_to_Address)}
            </td>
            <td className="tableData">
              {"Communication_Preference" in data &&
              data.Communication_Preference.value !== undefined
                ? convertToCase(data.Communication_Preference.value)
                : convertToCase(data.Communication_Preference)}
            </td>
          </tr>
        );
      });
    }
  };

  const formatDate = (dateObj) => {
    console.log("Inside formatDate ", typeof dateObj);

    if (dateObj) {
      if (typeof dateObj === "string") {
        const localDate = new Date(Date.parse(dateObj));

        console.log(
          "Inside formatDate typeof",
          Date.parse(dateObj),
          localDate.getDate(),
        );
        dateObj = localDate;
      } else if (typeof dateObj === "number") {
        const localDate2 = new Date(dateObj);

        console.log("Inside formatDate typeof: ", localDate2.getDate());
        dateObj = localDate2;
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
      let formattedDate = mm + "/" + dd + "/" + yyyy;
      //console.log("formattedDate: ", formattedDate);
      return formattedDate;
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
    // setDataIndex({
    //     ...dataIndex,
    //     ...opertnData
    // });
    //console.log("Handle Modal Change Data Index After: ",dataIndex);
    setModalShow(flag);
  };

  const handleDataIndex = (index) => {
    //console.log("Inside setDataIndex: ",index);
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
              {lockStatus == "N" && (
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
              {lockStatus == "V" && <th style={{ width: "" }}></th>}
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
              <th scope="col">Zip Code</th>
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
      ></GridModal>
    </>
  );
}
