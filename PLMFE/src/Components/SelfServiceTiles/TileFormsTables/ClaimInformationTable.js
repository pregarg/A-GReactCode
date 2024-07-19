import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./ClaimInformationTable.css";
import { useLocation } from "react-router-dom";

export default function ClaimInformationTable({
    claimInformationGridData,
    updateGridData,
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

    ClaimInformationTable.displayName = "ClaimInformationTable";

    const [dataIndex, setDataIndex] = useState();

    const [operationValue, setOperationValue] = useState("");

    const [modalShow, setModalShow] = useState(false);

    const [isTouched, setIsTouched] = useState({});

    const { getGridJson, convertToCase } = useGetDBTables();

    const mastersSelector = useSelector((masters) => masters);

    let prop = useLocation();

    let lineNumberOptions = [];
    let filedTimelyValues = [];
    let grantGoodCauseValues = [];

    useEffect(() => {
        if (mastersSelector.hasOwnProperty("masterAngFiledTimely")) {
            const filedTimelyArray =
                mastersSelector["masterAngFiledTimely"].length === 0
                    ? []
                    : mastersSelector["masterAngFiledTimely"][0];

            for (let i = 0; i < filedTimelyArray.length; i++) {
                filedTimelyValues.push({ label: convertToCase(filedTimelyArray[i].Filed_Timely), value: convertToCase(filedTimelyArray[i].Filed_Timely) });
            }
        }

        if (mastersSelector.hasOwnProperty("masterAngGrantGoodCause")) {
            const grantGoodCauseArray =
                mastersSelector["masterAngGrantGoodCause"].length === 0
                    ? []
                    : mastersSelector["masterAngGrantGoodCause"][0];

            for (let i = 0; i < grantGoodCauseArray.length; i++) {
                grantGoodCauseValues.push({ label: convertToCase(grantGoodCauseArray[i].Grant_Good_Cause), value: convertToCase(grantGoodCauseArray[i].Grant_Good_Cause) });
            }
        }
    });

    const tdDataReplica = (index) => {
        console.log("Inside tdDataReplica");
        console.log("gridfieldtempstate", gridFieldTempState);
        const data = getGridJson(gridFieldTempState);
        console.log("data", data);

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
                                    "Issue_Number" in data && data.Issue_Number.value !== undefined
                                        ? convertToCase(data.Issue_Number.value)
                                        : convertToCase(data.Issue_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
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
                            <label>Line Number</label>
                            <br />
                            <Select
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                    }),
                                }}
                                value={data.Line_Number}
                                onChange={(selectValue, event) =>
                                    handleGridSelectChange(
                                        index,
                                        selectValue,
                                        event,
                                        ClaimInformationTable.displayName
                                    )
                                }
                                options={lineNumberOptions}
                                name="Line_Number"
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
                            <label>Allowed Amount</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Allowed_Amount" in data && data.Allowed_Amount.value !== undefined
                                        ? convertToCase(data.Allowed_Amount.value)
                                        : convertToCase(data.Allowed_Amount)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Allowed_Amount"
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
                            <label>Place of Service (POS)
                            </label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Place_of_Service_POS" in data && data.Place_of_Service_POS.value !== undefined
                                        ? convertToCase(data.Place_of_Service_POS.value)
                                        : convertToCase(data.Place_of_Service_POS)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Place_of_Service_POS"
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
                            <label>Procedure / Diagnosis Code 2</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Procedure_Diagnosis_Code_2" in data && data.Procedure_Diagnosis_Code_2.value !== undefined
                                        ? convertToCase(data.Procedure_Diagnosis_Code_2.value)
                                        : convertToCase(data.Procedure_Diagnosis_Code_2)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Procedure_Diagnosis_Code_2"
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
                            <label>Procedure / Diagnosis Code(s)</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Procedure_Diagnosis_Codes" in data && data.Procedure_Diagnosis_Codes.value !== undefined
                                        ? convertToCase(data.Procedure_Diagnosis_Codes.value)
                                        : convertToCase(data.Procedure_Diagnosis_Codes)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Procedure_Diagnosis_Codes"
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
                            <label htmlFor="datePicker">Payment Mail Date (Postmark)</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="form-control example-custom-input-modal"
                                    selected={
                                        "Payment_Mail_Date_Postmark" in data &&
                                            data.Payment_Mail_Date_Postmark.value !== undefined
                                            ? data.Payment_Mail_Date_Postmark.value
                                            : data.Payment_Mail_Date_Postmark
                                    }
                                    name="Payment_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Payment_Mail_Date_Postmark",
                                            ClaimInformationTable.displayName
                                        )
                                    }
                                    peekNextMonth
                                    showMonthDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    showYearDropdown
                                    dropdownMode="select"
                                    dateFormat="MM/dd/yyyy"
                                    id="datePicker"
                                    disabled={
                                        prop.state.formView === "DashboardView" &&
                                            (prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Patient Ref / Account Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Patient_Ref_Account_Number" in data && data.Patient_Ref_Account_Number.value !== undefined
                                        ? convertToCase(data.Patient_Ref_Account_Number.value)
                                        : convertToCase(data.Patient_Ref_Account_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Patient_Ref_Account_Number"
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
                            <label>Payment Method</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Payment_Method" in data && data.Payment_Method.value !== undefined
                                        ? convertToCase(data.Payment_Method.value)
                                        : convertToCase(data.Payment_Method)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Payment_Method"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={
                                    prop.state.formView === "DashboardView" &&
                                        (prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                        ? true
                                        : false
                                }
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Payment Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Payment_Number" in data && data.Payment_Number.value !== undefined
                                        ? convertToCase(data.Payment_Number.value)
                                        : convertToCase(data.Payment_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Payment_Number"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={
                                    prop.state.formView === "DashboardView" &&
                                        (prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                        ? true
                                        : false
                                }
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Filed Timely</label>
                            <br />
                            <Select
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                    }),
                                }}
                                value={data.Filed_Timely}
                                onChange={(selectValue, event) =>
                                    handleGridSelectChange(
                                        index,
                                        selectValue,
                                        event,
                                        ClaimInformationTable.displayName
                                    )
                                }
                                options={filedTimelyValues}
                                name="Filed_Timely"
                                id="lineNumberDropDown"
                                isDisabled={
                                    prop.state.formView === "DashboardView" &&
                                        (prop.state.stageName === "Intake" || prop.state.stageName === "Acknowledge" || prop.state.stageName === "Redirect Review" ||
                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                        ? true
                                        : false
                                }
                                isClearable
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Grant Good Cause</label>
                            <br />
                            <Select
                                styles={{
                                    control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                    }),
                                }}
                                value={data.Grant_Good_Cause}
                                onChange={(selectValue, event) =>
                                    handleGridSelectChange(
                                        index,
                                        selectValue,
                                        event,
                                        ClaimInformationTable.displayName
                                    )
                                }
                                options={grantGoodCauseValues}
                                name="Grant_Good_Cause"
                                id="lineNumberDropDown"
                                isDisabled={
                                    prop.state.formView === "DashboardView" &&
                                        (prop.state.stageName === "Intake" || prop.state.stageName === "Acknowledge" || prop.state.stageName === "Redirect Review" ||
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
                            <label>Good Cause Reason</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Good_Cause_Reason" in data && data.Good_Cause_Reason.value !== undefined
                                        ? convertToCase(data.Good_Cause_Reason.value)
                                        : convertToCase(data.Good_Cause_Reason)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Good_Cause_Reason"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={
                                    prop.state.formView === "DashboardView" &&
                                        (prop.state.stageName === "Intake" || prop.state.stageName === "Acknowledge" || prop.state.stageName === "Redirect Review" ||
                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                        ? true
                                        : false
                                }
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Authorization Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Auth_Number" in data && data.Auth_Number.value !== undefined
                                        ? convertToCase(data.Auth_Number.value)
                                        : convertToCase(data.Auth_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Auth_Number"
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
                            <label htmlFor="datePicker">Number of Days in Span</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="form-control example-custom-input-modal"
                                    selected={
                                        "Number_of_Days_in_Span" in data &&
                                            data.Number_of_Days_in_Span.value !== undefined
                                            ? data.Number_of_Days_in_Span.value
                                            : data.Number_of_Days_in_Span
                                    }
                                    name="Number_of_Days_in_Span"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Number_of_Days_in_Span",
                                            ClaimInformationTable.displayName
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
                            <label htmlFor="datePicker">Service Start Date</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="form-control example-custom-input-modal"
                                    selected={
                                        data?.Service_Start_Date?.value !== undefined
                                            ? new Date(data.Service_Start_Date.value)
                                            : data?.Service_Start_Date !== undefined
                                                ? new Date(data.Service_Start_Date)
                                                : null
                                    }
                                    name="Service_Start_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Service_Start_Date",
                                            ClaimInformationTable.displayName
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
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Service End Date</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="form-control example-custom-input-modal"
                                    selected={
                                        data?.Service_End_Date?.value !== undefined
                                            ? new Date(data.Service_End_Date.value)
                                            : data?.Service_End_Date !== undefined
                                                ? new Date(data.Service_End_Date)
                                                : null
                                    }

                                    name="Service_End_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Service_End_Date",
                                            ClaimInformationTable.displayName
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
                            <label htmlFor="datePicker">Claim Status</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="form-control example-custom-input-modal"
                                    selected={
                                        "Claim_Status" in data &&
                                            data.Claim_Status.value !== undefined
                                            ? data.Claim_Status.value
                                            : data.Claim_Status
                                    }
                                    name="Claim_Status"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Claim_Status",
                                            ClaimInformationTable.displayName
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
                            <label htmlFor="datePicker">Claim Adjusted Date</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="form-control example-custom-input-modal"
                                    selected={
                                        "Claim_Adjusted_Date" in data &&
                                            data.Claim_Adjusted_Date.value !== undefined
                                            ? data.Claim_Adjusted_Date.value
                                            : data.Claim_Adjusted_Date
                                    }
                                    name="Claim_Adjusted_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Claim_Adjusted_Date",
                                            ClaimInformationTable.displayName
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
                                            (prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Payment Date</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="form-control example-custom-input-modal"
                                    selected={
                                        "Payment_Date" in data &&
                                            data.Payment_Date.value !== undefined
                                            ? data.Payment_Date.value
                                            : data.Payment_Date
                                    }
                                    name="Payment_Date"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "Payment_Date",
                                            ClaimInformationTable.displayName
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
                                            (prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label>Billed Amount</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Billed_Amount" in data && data.Billed_Amount.value !== undefined
                                        ? convertToCase(data.Billed_Amount.value)
                                        : convertToCase(data.Billed_Amount)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Billed_Amount"
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
                            <label>Provider Account Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Provider_Account_Number" in data && data.Provider_Account_Number.value !== undefined
                                        ? convertToCase(data.Provider_Account_Number.value)
                                        : convertToCase(data.Provider_Account_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Provider_Account_Number"
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
                            <label>DRG Indicator</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "DRG_Indicator" in data && data.DRG_Indicator.value !== undefined
                                        ? convertToCase(data.DRG_Indicator.value)
                                        : convertToCase(data.DRG_Indicator)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="DRG_Indicator"
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
                            <label>Claim Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Claim_Number" in data && data.Claim_Number.value !== undefined
                                        ? convertToCase(data.Claim_Number.value)
                                        : convertToCase(data.Claim_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Claim_Number"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Claim Number"
                                disabled={lockStatus == "V"}
                            />
                        </div>

                        <div className="col-xs-6 col-md-3">
                            <label>Provider ID</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "ProviderID" in data && data.ProviderID.value !== undefined
                                        ? convertToCase(data.ProviderID.value)
                                        : convertToCase(data.ProviderID)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="ProviderID"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter ProviderID"
                                disabled={lockStatus == "V"}
                            />
                        </div>

                        <div className="col-xs-6 col-md-3">
                            <label>Service Span</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "ServiceSpan" in data && data.ServiceSpan.value !== undefined
                                        ? convertToCase(data.ServiceSpan.value)
                                        : convertToCase(data.ServiceSpan)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="ServiceSpan"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter ServiceSpan"
                                disabled={lockStatus == "V"}
                            />
                        </div>

                        <div className="col-xs-6 col-md-3">
                            <label>Member ID</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "MemberID" in data && data.MemberID.value !== undefined
                                        ? convertToCase(data.MemberID.value)
                                        : convertToCase(data.MemberID)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="MemberID"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter MemberID"
                                disabled={lockStatus == "V"}
                            />
                        </div>

                        <div className="col-xs-6 col-md-3">
                            <label>Provider Name</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "ProviderName" in data && data.ProviderName.value !== undefined
                                        ? convertToCase(data.ProviderName.value)
                                        : convertToCase(data.ProviderName)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="ProviderName"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter ProviderName"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Claim Type</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Claim_type" in data && data.Claim_type.value !== undefined
                                        ? convertToCase(data.Claim_type.value)
                                        : convertToCase(data.Claim_type)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="Claim_type"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Claim_type"
                                disabled={lockStatus == "V"}
                            />
                        </div>

                        <div className="col-xs-6 col-md-3">
                            <label>Denial Description</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "DenialDescription" in data && data.DenialDescription.value !== undefined
                                        ? convertToCase(data.DenialDescription.value)
                                        : convertToCase(data.DenialDescription)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="DenialDescription"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter DenialDescription"
                                disabled={lockStatus == "V"}
                            />
                        </div>

                        <div className="col-xs-6 col-md-3">
                            <label>Member First Name</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "MemberFirstName" in data && data.MemberFirstName.value !== undefined
                                        ? convertToCase(data.MemberFirstName.value)
                                        : convertToCase(data.MemberFirstName)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="MemberFirstName"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter MemberFirstName"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Member Last Name</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "MemberLastName" in data && data.MemberLastName.value !== undefined
                                        ? convertToCase(data.MemberLastName.value)
                                        : convertToCase(data.MemberLastName)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="MemberLastName"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter MemberLastName"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Denial Code</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "DenialCode" in data && data.DenialCode.value !== undefined
                                        ? convertToCase(data.DenialCode.value)
                                        : convertToCase(data.DenialCode)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ClaimInformationTable.displayName)
                                }
                                name="DenialCode"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter DenialCode"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label htmlFor="datePicker">Denial Date</label>
                            <br />
                            <div className="form-floating">
                                <ReactDatePicker
                                    className="form-control example-custom-input-modal"

                                    selected={
                                        data?.DenialDate?.value !== undefined
                                            ? new Date(data.DenialDate.value)
                                            : data?.DenialDate !== undefined
                                                ? new Date(data.DenialDate)
                                                : null
                                    }

                                    name="DenialDate"
                                    onChange={(selectValue, event) =>
                                        handleGridDateChange(
                                            index,
                                            selectValue,
                                            "DenialDate",
                                            ClaimInformationTable.displayName
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
                </div>
            </>
        );
        //}
    };

    const tdData = () => {
        console.log("Inside tdData");
        console.log("claimgrid", claimInformationGridData);
        updateGridData(claimInformationGridData);
        if (
            claimInformationGridData !== undefined &&
            claimInformationGridData.length > 0
        ) {
            updateGridData(claimInformationGridData);
            return claimInformationGridData.map((data, index) => {
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
                                                    ClaimInformationTable.displayName,
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
                                                editTableRows(index, ClaimInformationTable.displayName);
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
                                            editTableRows(index, ClaimInformationTable.displayName);
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
                            {
                                "Issue_Number" in data && data.Issue_Number.value !== undefined
                                    ? convertToCase(data.Issue_Number.value)
                                    : convertToCase(data.Issue_Number)
                            }
                        </td>
                        <td className="tableData">
                            {"Line_Number" in data &&
                                data.Line_Number.value !== undefined
                                ? convertToCase(data.Line_Number.value)
                                : convertToCase(data.Line_Number)
                            }
                        </td>
                        <td className="tableData">
                            {"Claim_Number" in data &&
                                data.Claim_Number.value !== undefined
                                ? convertToCase(data.Claim_Number.value)
                                : convertToCase(data.Claim_Number)}
                        </td>
                        <td className="tableData">
                            {"Auth_Number" in data &&
                                data.Auth_Number.value !== undefined
                                ? convertToCase(data.Auth_Number.value)
                                : convertToCase(data.Auth_Number)}
                        </td>
                        <td className="tableData">
                            {"Patient_Ref_Account_Number" in data &&
                                data.Patient_Ref_Account_Number.value !== undefined
                                ? convertToCase(data.Patient_Ref_Account_Number.value)
                                : convertToCase(data.Patient_Ref_Account_Number)}
                        </td>
                        <td className="tableData">
                            {"Place_of_Service_POS" in data &&
                                data.Place_of_Service_POS.value !== undefined
                                ? convertToCase(data.Place_of_Service_POS.value)
                                : convertToCase(data.Place_of_Service_POS)}
                        </td>
                        <td className="tableData">
                            {"Procedure_Diagnosis_Code_2" in data &&
                                data.Procedure_Diagnosis_Code_2.value !== undefined
                                ? formatDate(data.Procedure_Diagnosis_Code_2.value)
                                : formatDate(data.Procedure_Diagnosis_Code_2)}
                        </td>
                        <td className="tableData">
                            {"Procedure_Diagnosis_Codes" in data && data.Procedure_Diagnosis_Codes.value !== undefined
                                ? convertToCase(data.Procedure_Diagnosis_Codes.value)
                                : convertToCase(data.Procedure_Diagnosis_Codes)}
                        </td>
                        <td className="tableData">
                            {"ProviderID" in data &&
                                data.ProviderID.value !== undefined
                                ? convertToCase(data.ProviderID.value)
                                : convertToCase(data.ProviderID)}
                        </td>
                        <td className="tableData">
                            {"ProviderName" in data &&
                                data.ProviderName.value !== undefined
                                ? convertToCase(data.ProviderName.value)
                                : convertToCase(data.ProviderName)}
                        </td>
                        <td className="tableData">
                            {"Provider_Account_Number" in data &&
                                data.Provider_Account_Number.value !== undefined
                                ? convertToCase(data.Provider_Account_Number.value)
                                : convertToCase(data.Provider_Account_Number)}
                        </td>
                        <td className="tableData">
                            {"MemberID" in data &&
                                data.MemberID.value !== undefined
                                ? convertToCase(data.MemberID.value)
                                : convertToCase(data.MemberID)}
                        </td>
                        <td className="tableData">
                            {"MemberFirstName" in data &&
                                data.MemberFirstName.value !== undefined
                                ? convertToCase(data.MemberFirstName.value)
                                : convertToCase(data.MemberFirstName)}
                        </td>
                        <td className="tableData">
                            {"MemberLastName" in data &&
                                data.MemberLastName.value !== undefined
                                ? convertToCase(data.MemberLastName.value)
                                : convertToCase(data.MemberLastName)}
                        </td>
                        <td className="tableData">
                            {"DRG_Indicator" in data &&
                                data.DRG_Indicator.value !== undefined
                                ? convertToCase(data.DRG_Indicator.value)
                                : convertToCase(data.DRG_Indicator)}
                        </td>
                        <td className="tableData">
                            {"Filed_Timely" in data &&
                                data.Filed_Timely.value !== undefined
                                ? convertToCase(data.Filed_Timely.value)
                                : convertToCase(data.Filed_Timely)}
                        </td>
                        <td className="tableData">
                            {"Grant_Good_Cause" in data &&
                                data.Grant_Good_Cause.value !== undefined
                                ? convertToCase(data.Grant_Good_Cause.value)
                                : convertToCase(data.Grant_Good_Cause)}
                        </td>
                        <td className="tableData">
                            {"Good_Cause_Reason" in data &&
                                data.Good_Cause_Reason.value !== undefined
                                ? convertToCase(data.Good_Cause_Reason.value)
                                : convertToCase(data.Good_Cause_Reason)}
                        </td>

                        <td className="tableData">
                            {"Number_of_Days_in_Span" in data &&
                                data.Number_of_Days_in_Span.value !== undefined
                                ? formatDate(data.Number_of_Days_in_Span.value)
                                : formatDate(data.Number_of_Days_in_Span)}
                        </td>
                        <td className="tableData">
                            {"Service_Start_Date" in data &&
                                data.Service_Start_Date.value !== undefined
                                ? formatDate(data.Service_Start_Date.value)
                                : formatDate(data.Service_Start_Date)}
                        </td>
                        <td className="tableData">
                            {"Service_End_Date" in data &&
                                data.Service_End_Date.value !== undefined
                                ? formatDate(data.Service_End_Date.value)
                                : formatDate(data.Service_End_Date)}
                        </td>
                        <td className="tableData">
                            {"ServiceSpan" in data &&
                                data.ServiceSpan.value !== undefined
                                ? convertToCase(data.ServiceSpan.value)
                                : convertToCase(data.ServiceSpan)}
                        </td>
                        <td className="tableData">
                            {"Claim_type" in data &&
                                data.Claim_type.value !== undefined
                                ? convertToCase(data.Claim_type.value)
                                : convertToCase(data.Claim_type)}
                        </td>
                        <td className="tableData">
                            {"Claim_Status" in data &&
                                data.Claim_Status.value !== undefined
                                ? formatDate(data.Claim_Status.value)
                                : formatDate(data.Claim_Status)}
                        </td>
                        <td className="tableData">
                            {"Claim_Adjusted_Date" in data &&
                                data.Claim_Adjusted_Date.value !== undefined
                                ? formatDate(data.Claim_Adjusted_Date.value)
                                : formatDate(data.Claim_Adjusted_Date)}
                        </td>
                        <td className="tableData">
                            {"DenialCode" in data &&
                                data.DenialCode.value !== undefined
                                ? convertToCase(data.DenialCode.value)
                                : convertToCase(data.DenialCode)}
                        </td>
                        <td className="tableData">
                            {"DenialDate" in data &&
                                data.DenialDate.value !== undefined
                                ? formatDate(data.DenialDate.value)
                                : formatDate(data.DenialDate)}
                        </td>
                        <td className="tableData">
                            {"DenialDescription" in data &&
                                data.DenialDescription.value !== undefined
                                ? convertToCase(data.DenialDescription.value)
                                : convertToCase(data.DenialDescription)}
                        </td>
                        <td className="tableData">
                            {"Payment_Method" in data &&
                                data.Payment_Method.value !== undefined
                                ? convertToCase(data.Payment_Method.value)
                                : convertToCase(data.Payment_Method)}
                        </td>
                        <td className="tableData">
                            {"Payment_Number" in data &&
                                data.Payment_Number.value !== undefined
                                ? convertToCase(data.Payment_Number.value)
                                : convertToCase(data.Payment_Number)}
                        </td>
                        <td className="tableData">
                            {"Payment_Date" in data &&
                                data.Payment_Date.value !== undefined
                                ? formatDate(data.Payment_Date.value)
                                : formatDate(data.Payment_Date)}
                        </td>
                        <td className="tableData">
                            {"Payment_Mail_Date_Postmark" in data &&
                                data.Payment_Mail_Date_Postmark.value !== undefined
                                ? formatDate(data.Payment_Mail_Date_Postmark.value)
                                : formatDate(data.Payment_Mail_Date_Postmark)}
                        </td>
                        <td className="tableData">
                            {"Allowed_Amount" in data &&
                                data.Allowed_Amount.value !== undefined
                                ? convertToCase(data.Allowed_Amount.value)
                                : convertToCase(data.Allowed_Amount)}
                        </td>
                        <td className="tableData">
                            {"Billed_Amount" in data &&
                                data.Billed_Amount.value !== undefined
                                ? convertToCase(data.Billed_Amount.value)
                                : convertToCase(data.Billed_Amount)}
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
                <table className="table table-bordered tableLayout" id="ClaimInformationTable">

                    <thead>
                        <tr className="tableRowStyle tableHeaderColor">
                            {lockStatus == "N" && (
                                <th style={{ width: "" }}>
                                    <button
                                        className="addBtn"
                                        onClick={() => {
                                            addTableRows(ClaimInformationTable.displayName);
                                            handleModalChange(true);
                                            handleDataIndex(claimInformationGridData.length);
                                            handleOperationValue("Add");
                                        }}
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </th>
                            )}
                            {lockStatus == "V" && <th style={{ width: "" }}></th>}
                            <th scope="col">Issue Number</th>
                            <th scope="col">Line Number</th>
                            <th scope="col">Claim Number</th>
                            <th scope="col">Authorization Number</th>
                            <th scope="col">Patient Ref/Account Number</th>
                            <th scope="col">Place of Service</th>
                            <th scope="col">Procedure/ Diagnosis Code 2</th>
                            <th scope="col">Procedure/ Diagnosis Code(s)</th>
                            <th scope="col">Provider ID</th>
                            <th scope="col">Provider Name</th>
                            <th scope="col">Provider Account Number</th>
                            <th scope="col">Member ID</th>
                            <th scope="col">Member First Name</th>
                            <th scope="col">Member Last Name</th>
                            <th scope="col">DRG Indicator</th>
                            <th scope="col">Filed Timely</th>
                            <th scope="col">Grant Good Cause</th>
                            <th scope="col">Good Cause Reason</th>
                            <th scope="col">Number of Days in Span</th>
                            <th scope="col">Service Start Date</th>
                            <th scope="col">Service End Date</th>
                            <th scope="col">Service Span</th>
                            <th scope="col">Claim Type</th>
                            <th scope="col">Claim Status</th>
                            <th scope="col">Claim Adjusted Date</th>
                            <th scope="col">Denial Code</th>
                            <th scope="col">Denial Date</th>
                            <th scope="col">Denial Description</th>
                            <th scope="col">Payment Method</th>
                            <th scope="col">Payment Number</th>
                            <th scope="col">Payment Date</th>
                            <th scope="col">Payment Mail Date (PostMark)</th>
                            <th scope="col">Allowed Amount</th>
                            <th scope="col">Billed Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tdData()}
                    </tbody>
                </table>
            </div>
            <GridModal
                name={"Claim Information"}
                validationObject={isTouched}
                modalShow={modalShow}
                handleModalChange={handleModalChange}
                dataIndex={dataIndex}
                tdDataReplica={tdDataReplica}
                deleteTableRows={deleteTableRows}
                gridName={ClaimInformationTable.displayName}
                decreaseDataIndex={decreaseDataIndex}
                operationValue={operationValue}
                gridRowsFinalSubmit={gridRowsFinalSubmit}
                lockStatus={lockStatus}
            ></GridModal>
        </>
    );
}
