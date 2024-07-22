import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";

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

    const mastersSelector = useSelector((masters) => masters);

    let prop = useLocation();

    let relationshipValues = [];
    let aorTypeValues = [];
    let commPrefValues = [];
    let mailToAddressValues = [];

    useEffect(() => {
        if (mastersSelector.hasOwnProperty("masterAngRelationship")) {
            const relationshipArray =
                mastersSelector["masterAngRelationship"].length === 0
                    ? []
                    : mastersSelector["masterAngRelationship"][0];
            const uniquerelationshipValues = {};

            for (let i = 0; i < relationshipArray.length; i++) {
                const relationship = convertToCase(relationshipArray[i].Relationship);

                if (!uniquerelationshipValues[relationship]) {
                    uniquerelationshipValues[relationship] = true;
                    relationshipValues.push({ label: convertToCase(relationshipArray[i].Relationship), value: convertToCase(relationshipArray[i].Relationship) });
                }
            }
        }

        if (mastersSelector.hasOwnProperty("masterAngAORType")) {
            const aorTypeArray =
                mastersSelector["masterAngAORType"].length === 0
                    ? []
                    : mastersSelector["masterAngAORType"][0];
            const uniqueAORTypeValues = {};

            for (let i = 0; i < aorTypeArray.length; i++) {
                const aorType = convertToCase(aorTypeArray[i].AOR_Type);

                if (!uniqueAORTypeValues[aorType]) {
                    uniqueAORTypeValues[aorType] = true;
                    aorTypeValues.push({ label: convertToCase(aorTypeArray[i].AOR_Type), value: convertToCase(aorTypeArray[i].AOR_Type) });
                }
            }
        }

        if (mastersSelector.hasOwnProperty("masterAngCommPref")) {
            const commPrefArray =
                mastersSelector["masterAngCommPref"].length === 0
                    ? []
                    : mastersSelector["masterAngCommPref"][0];

            for (let i = 0; i < commPrefArray.length; i++) {
                commPrefValues.push({ label: convertToCase(commPrefArray[i].Comm_Pref), value: convertToCase(commPrefArray[i].Comm_Pref) });
            }
        }

        if (mastersSelector.hasOwnProperty("masterAngMailToAddress")) {
            const mailToAddressArray =
                mastersSelector["masterAngMailToAddress"].length === 0
                    ? []
                    : mastersSelector["masterAngMailToAddress"][0];
            const uniqueMailToAddressValues = {};

            for (let i = 0; i < mailToAddressArray.length; i++) {
                const mailToAddress = convertToCase(mailToAddressArray[i].Mail_to_Address);

                if (!uniqueMailToAddressValues[mailToAddress]) {
                    uniqueMailToAddressValues[mailToAddress] = true;
                    mailToAddressValues.push({ label: convertToCase(mailToAddressArray[i].Mail_to_Address), value: convertToCase(mailToAddressArray[i].Mail_to_Address) });
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
            <div className="Container AddProviderLabel AddModalLabel">
                <div className="row">
                    <div className="col-xs-6 col-md-3">
                        <label>Issue Number</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Issue_Number" in data && data.Issue_Number.value !== undefined
                                    ? convertToCase(data.Issue_Number.value)
                                    : convertToCase(data.Issue_Number)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Issue_Number"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>First Name</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "First_Name" in data && data.First_Name.value !== undefined
                                    ? convertToCase(data.First_Name.value)
                                    : convertToCase(data.First_Name)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="First_Name"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>Last Name</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Last_Name" in data && data.Last_Name.value !== undefined
                                    ? convertToCase(data.Last_Name.value)
                                    : convertToCase(data.Last_Name)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Last_Name"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>Relationship</label>
                        <br />
                        <Select
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    fontWeight: "lighter",
                                }),
                            }}
                            value={data.Relationship}
                            onChange={(selectValue, event) =>
                                handleGridSelectChange(
                                    index,
                                    selectValue,
                                    event,
                                    RepresentativeInformationTable.displayName
                                )
                            }
                            options={relationshipValues}
                            name="Relationship"
                            id="lineNumberDropDown"
                            isDisabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                            isClearable
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-md-3">
                        <label>AOR Type</label>
                        <br />
                        <Select
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    fontWeight: "lighter",
                                }),
                            }}
                            value={data.AOR_Type}
                            onChange={(selectValue, event) =>
                                handleGridSelectChange(
                                    index,
                                    selectValue,
                                    event,
                                    RepresentativeInformationTable.displayName
                                )
                            }
                            options={aorTypeValues}
                            name="AOR_Type"
                            id="lineNumberDropDown"
                            isDisabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                            isClearable
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label htmlFor="datePicker">AOR Approved Date</label>
                        <br />
                        <div className="form-floating">
                            <ReactDatePicker
                                className="form-control example-custom-input-modal"
                                selected={
                                    "AOR_Approved_Date" in data &&
                                        data.AOR_Approved_Date.value !== undefined
                                        ? data.AOR_Approved_Date.value
                                        : data.AOR_Approved_Date
                                }
                                name="AOR_Approved_Date"
                                onChange={(selectValue, event) =>
                                    handleGridDateChange(
                                        index,
                                        selectValue,
                                        "AOR_Approved_Date",
                                        RepresentativeInformationTable.displayName
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
                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                        ? true
                                        : false
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label htmlFor="datePicker">AOR Expiration Date</label>
                        <br />
                        <div className="form-floating">
                            <ReactDatePicker
                                className="form-control example-custom-input-modal"
                                selected={
                                    "AOR_Expiration_Date" in data &&
                                        data.AOR_Expiration_Date.value !== undefined
                                        ? data.AOR_Expiration_Date.value
                                        : data.AOR_Expiration_Date
                                }
                                name="AOR_Expiration_Date"
                                onChange={(selectValue, event) =>
                                    handleGridDateChange(
                                        index,
                                        selectValue,
                                        "AOR_Expiration_Date",
                                        RepresentativeInformationTable.displayName
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
                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                        ? true
                                        : false
                                }
                            />
                        </div>
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
                                    RepresentativeInformationTable.displayName
                                )
                            }
                            options={commPrefValues}
                            name="Communication_Preference"
                            id="lineNumberDropDown"
                            isDisabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                            isClearable
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-md-3">
                        <label>Mail To Address</label>
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
                                    RepresentativeInformationTable.displayName
                                )
                            }
                            options={mailToAddressValues}
                            name="Mail_to_Address"
                            id="lineNumberDropDown"
                            isDisabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                            isClearable
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>Email Address</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Email_Address" in data && data.Email_Address.value !== undefined
                                    ? convertToCase(data.Email_Address.value)
                                    : convertToCase(data.Email_Address)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Email_Address"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
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
                                "Phone_Number" in data && data.Phone_Number.value !== undefined
                                    ? convertToCase(data.Phone_Number.value)
                                    : convertToCase(data.Phone_Number)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Phone_Number"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
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
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Fax_Number"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                      </div>
                      <div className="col-xs-6 col-md-3">
                        <label htmlFor="datePicker">Authorization Approved Date</label>
                        <br />
                        <div className="form-floating">
                            <ReactDatePicker
                                className="form-control example-custom-input-modal"
                                selected={
                                    data?.Authorization_Approved_Date?.value !== undefined
                                        ? new Date(data.Authorization_Approved_Date.value)
                                        : data?.Authorization_Approved_Date !== undefined
                                            ? new Date(data.Authorization_Approved_Date)
                                            : null
                                }
                                name="Authorization_Approved_Date"
                                onChange={(selectValue, event) =>
                                    handleGridDateChange(
                                        index,
                                        selectValue,
                                        "Authorization_Approved_Date",
                                        RepresentativeInformationTable.displayName
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
                             
                            />
                        </div>
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <label htmlFor="datePicker">Authorization Expiration Date</label>
                        <br />
                        <div className="form-floating">
                            <ReactDatePicker
                                className="form-control example-custom-input-modal"
                                selected={
                                        data?.Authorization_Expiration_Date?.value !== undefined
                                        ? new Date(data.Authorization_Expiration_Date.value)
                                        : data?.Authorization_Expiration_Date !== undefined
                                            ? new Date(data.Authorization_Expiration_Date)
                                            : null
      
                                }
                                name="Authorization_Expiration_Date"
                                onChange={(selectValue, event) =>
                                    handleGridDateChange(
                                        index,
                                        selectValue,
                                        "Authorization_Expiration_Date",
                                        RepresentativeInformationTable.displayName
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
                             
                            />
                        </div>
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>Authorization Type</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Authorization_Type" in data && data.Authorization_Type.value !== undefined
                                    ? convertToCase(data.Authorization_Type.value)
                                    : convertToCase(data.Authorization_Type)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Authorization_Type"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
             
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>Notes</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Notes" in data && data.Notes.value !== undefined
                                    ? convertToCase(data.Notes.value)
                                    : convertToCase(data.Notes)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Notes"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
             
                        />
                    </div>

                </div>
                <div className="row">
                    <div className="col-xs-6 col-md-6">
                        <label>Address Line 1</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Address_Line_1" in data && data.Address_Line_1.value !== undefined
                                    ? convertToCase(data.Address_Line_1.value)
                                    : convertToCase(data.Address_Line_1)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Address_Line_1"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
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
                                "Address_Line_2" in data && data.Address_Line_2.value !== undefined
                                    ? convertToCase(data.Address_Line_2.value)
                                    : convertToCase(data.Address_Line_2)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Address_Line_2"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
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
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="City"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
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
                                "State_" in data && data.State_.value !== undefined
                                    ? convertToCase(data.State_.value)
                                    : convertToCase(data.State_)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="State_"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
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
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="Zip_Code"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>County</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "County" in data && data.County.value !== undefined
                                    ? convertToCase(data.County.value)
                                    : convertToCase(data.County)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, RepresentativeInformationTable.displayName)
                            }
                            name="County"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
             
                        />
                    </div>
                </div>
            </div>
        );
    };

    const tdData = () => {
        console.log("Inside tdData");

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
                                                    RepresentativeInformationTable.displayName,
                                                    "Force Delete"
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
                                                editTableRows(index, RepresentativeInformationTable.displayName);
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
                            {"First_Name" in data && data.First_Name.value !== undefined
                                ? convertToCase(data.First_Name.value)
                                : convertToCase(data.First_Name)}
                        </td>
                        <td className="tableData">
                            {"Last_Name" in data && data.Last_Name.value !== undefined
                                ? convertToCase(data.Last_Name.value)
                                : convertToCase(data.Last_Name)}
                        </td>
                        <td className="tableData">
                            {"Relationship" in data && data.Relationship.value !== undefined
                                ? convertToCase(data.Relationship.value)
                                : convertToCase(data.Relationship)}
                        </td>
                        <td className="tableData">
                            {"AOR_Type" in data && data.AOR_Type.value !== undefined
                                ? convertToCase(data.AOR_Type.value)
                                : convertToCase(data.AOR_Type)}
                        </td>
                        <td className="tableData">
                            {"AOR_Approved_Date" in data && data.AOR_Approved_Date.value !== undefined
                                ? formatDate(data.AOR_Approved_Date.value)
                                : formatDate(data.AOR_Approved_Date)}
                        </td>
                        <td className="tableData">
                            {"AOR_Expiration_Date" in data && data.AOR_Expiration_Date.value !== undefined
                                ? formatDate(data.AOR_Expiration_Date.value)
                                : formatDate(data.AOR_Expiration_Date)}
                        </td>
                        <td className="tableData">
                            {"Communication_Preference" in data && data.Communication_Preference.value !== undefined
                                ? convertToCase(data.Communication_Preference.value)
                                : convertToCase(data.Communication_Preference)}
                        </td>
                        <td className="tableData">
                            {"Mail_to_Address" in data && data.Mail_to_Address.value !== undefined
                                ? convertToCase(data.Mail_to_Address.value)
                                : convertToCase(data.Mail_to_Address)}
                        </td>
                        <td className="tableData">
                            {"Email_Address" in data && data.Email_Address.value !== undefined
                                ? convertToCase(data.Email_Address.value)
                                : convertToCase(data.Email_Address)}
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
                            {"Authorization_Approved_Date" in data && data.Authorization_Approved_Date.value !== undefined
                                ? formatDate(data.Authorization_Approved_Date.value)
                                : formatDate(data.Authorization_Approved_Date)}
                        </td>
                        <td className="tableData">
                            {"Authorization_Expiration_Date" in data && data.Authorization_Expiration_Date.value !== undefined
                                ? formatDate(data.Authorization_Expiration_Date.value)
                                : formatDate(data.Authorization_Expiration_Date)}
                        </td>
                        <td className="tableData">
                            {"Authorization_Type" in data && data.Authorization_Type.value !== undefined
                                ? convertToCase(data.Authorization_Type.value)
                                : convertToCase(data.Authorization_Type)}
                        </td>
                        <td className="tableData">
                            {"Notes" in data && data.Notes.value !== undefined
                                ? convertToCase(data.Notes.value)
                                : convertToCase(data.Notes)}
                        </td>
                        <td className="tableData">
                            {"Address_Line_1" in data && data.Address_Line_1.value !== undefined
                                ? convertToCase(data.Address_Line_1.value)
                                : convertToCase(data.Address_Line_1)}
                        </td>
                        <td className="tableData">
                            {"Address_Line_2" in data && data.Address_Line_2.value !== undefined
                                ? convertToCase(data.Address_Line_2.value)
                                : convertToCase(data.Address_Line_2)}
                        </td>
                        <td className="tableData">
                            {"City" in data && data.City.value !== undefined
                                ? convertToCase(data.City.value)
                                : convertToCase(data.City)}
                        </td>
                        <td className="tableData">
                            {"State_" in data && data.State_.value !== undefined
                                ? convertToCase(data.State_.value)
                                : convertToCase(data.State_)}
                        </td>
                        <td className="tableData">
                            {"Zip_Code" in data && data.Zip_Code.value !== undefined
                                ? convertToCase(data.Zip_Code.value)
                                : convertToCase(data.Zip_Code)}
                        </td>
                        <td className="tableData">
                            {"County" in data && data.County.value !== undefined
                                ? convertToCase(data.County.value)
                                : convertToCase(data.County)}
                        </td>
                    </tr>
                );
            });
        }
    }

    const formatDate = (dateObj) => {
        console.log("Inside formatDate ", typeof dateObj);

        if (dateObj) {
            if (typeof dateObj === "string") {
                const localDate = new Date(Date.parse(dateObj));

                console.log(
                    "Inside formatDate typeof",
                    Date.parse(dateObj),
                    localDate.getDate()
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
                <table className="table table-bordered tableLayout" id="ProviderInformationTable">
                    <thead>
                        <tr className="tableRowStyle tableHeaderColor">
                            {lockStatus == "N" && (
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
                            {lockStatus == "V" && <th style={{ width: "" }}></th>}
                            <th scope="col">Issue Number</th>
                            <th scope="col">First Name</th>
                            <th scope="col">Last Name</th>
                            <th scope="col">Relationship</th>
                            <th scope="col">AOR Type</th>
                            <th scope="col">AOR Approved Date</th>
                            <th scope="col">AOR Expiration Date</th>
                            <th scope="col">Communication Preference</th>
                            <th scope="col">Mail To Address</th>
                            <th scope="col">Email Address</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Fax Number</th>
                            <th scope="col">Authorization Approved Date</th>
                            <th scope="col">Authorization Expiration Date</th>
                            <th scope="col">Authorization Type</th>
                            <th scope="col">Notes</th>
                            <th scope="col">Address Line 1</th>
                            <th scope="col">Address Line 2</th>
                            <th scope="col">City</th>
                            <th scope="col">State</th>
                            <th scope="col">Zip Code</th>
                            <th scope="col">County</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <TableRows specialityTableRowsData={specialityTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
                        {tdData()}
                    </tbody>
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