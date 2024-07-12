import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import Select, { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseHeader from './CaseHeader';
import ReactDatePicker from "react-datepicker";
import {selectStyle} from "./SelectStyle";

const ExpeditedRequestAccordion = (props) => {
    const {
        convertToCase,
    } = useGetDBTables();

    const { ValueContainer, Placeholder } = components;

    const [expeditedRequestData, setExpeditedRequestData] =
        useState(props.handleData);

    const mastersSelector = useSelector((masters) => masters);

    const CustomValueContainer = ({ children, ...props }) => {
        return (
            <ValueContainer {...props}>
                <Placeholder {...props} isFocused={props.isFocused}>
                    {props.selectProps.placeholder}
                </Placeholder>
                {React.Children.map(children, (child) =>
                    child && child.type !== Placeholder ? child : null
                )}
            </ValueContainer>
        );
    };

    const tabRef = useRef("HomeView");
    let prop = useLocation();

    useEffect(() => {
        console.log("formdataexpeditedrequest", expeditedRequestData);
    }, [expeditedRequestData]);

    const RenderDatePickerExpeditedUpgradeDateTime = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Expedited Upgrade Date Time" />
            <label htmlFor="datePicker">Expedited Upgrade Date Time</label>

        </div>
    );
    const RenderDatePickerExpeditedDeniedDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Expedited Denied Date" />
            <label htmlFor="datePicker">Expedited Denied Date</label>
        </div>
    );
    const RenderDatePickerDecisionLetterDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Decision Letter Date" />
            <label htmlFor="datePicker">Decision Letter Date</label>
        </div>
    );

    let expeditedRequestedValues = [];
    let expeditedDeniedValues = [];
    let stUpExpeditedValues = [];

    useEffect(() => {
        if (mastersSelector.hasOwnProperty("masterAngExpeditedRequested")) {
            const expeditedrequestedArray =
                mastersSelector["masterAngExpeditedRequested"].length === 0
                    ? []
                    : mastersSelector["masterAngExpeditedRequested"][0];

            for (let i = 0; i < expeditedrequestedArray.length; i++) {
                expeditedRequestedValues.push({ label: convertToCase(expeditedrequestedArray[i].Expedited_Requested), value: convertToCase(expeditedrequestedArray[i].Expedited_Requested) });
            }
        }

        if (mastersSelector.hasOwnProperty("masterAngExpeditedDenied")) {
            const expeditedDeniedArray =
                mastersSelector["masterAngExpeditedDenied"].length === 0
                    ? []
                    : mastersSelector["masterAngExpeditedDenied"][0];

            for (let i = 0; i < expeditedDeniedArray.length; i++) {
                expeditedDeniedValues.push({ label: convertToCase(expeditedDeniedArray[i].Expedited_Denied), value: convertToCase(expeditedDeniedArray[i].Expedited_Denied) });
            }
        }

        if (mastersSelector.hasOwnProperty("masterAngStUpExpedited")) {
            const stUpExpeditedArray =
                mastersSelector["masterAngStUpExpedited"].length === 0
                    ? []
                    : mastersSelector["masterAngStUpExpedited"][0];

            for (let i = 0; i < stUpExpeditedArray.length; i++) {
                stUpExpeditedValues.push({ label: convertToCase(stUpExpeditedArray[i].St_Up_Expedited), value: convertToCase(stUpExpeditedArray[i].St_Up_Expedited) });
            }
        }
    });

    return (
        <div>
            <div className="accordion-item" id="claimInformation">
                <h2
                    className="accordion-header"
                    id="panelsStayOpen-claimInformation"
                >
                    <button
                        className="accordion-button accordionButtonStyle"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseclaimInformation"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                    >
                        Expedited Request
                    </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseclaimInformation"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-claimInformation"
                >
                    <div className="accordion-body">
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                                <Field name="expeditedrequested">
                                    {({
                                        field, // { name, value, onChange, onBlur }
                                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                        meta,
                                    }) => (
                                        <div className="form-floating">
                                            <Select
                                                styles={{...selectStyle}}
                                                components={{
                                                    ValueContainer: CustomValueContainer,
                                                }}
                                                isClearable
                                                name={field.name}
                                                isDisabled={

                                                    prop.state.formView === "DashboardView" &&
                                                        (prop.state.stageName === "Redirect Review" ||
                                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "CaseArchived")
                                                        ? true
                                                        : false

                                                

                                                }
                                                className="basic-multi-select"
                                                options={expeditedRequestedValues}
                                                id="expeditedrequested"
                                                isMulti={false}
                                                onChange={(selectValue) =>
                                                    props.handleOnChange(selectValue ? selectValue.value : null, 'Expedited_Requested')
                                                }
                                                value={
                                                    {
                                                        label: expeditedRequestData['Expedited_Requested'],
                                                        value: expeditedRequestData['Expedited_Requested']
                                                    }
                                                }
                                                placeholder="Expedited Requested"
                                                //styles={{...customStyles}}
                                                isSearchable={
                                                    document.documentElement.clientHeight >
                                                        document.documentElement.clientWidth
                                                        ? false
                                                        : true
                                                }
                                            />
                                            {meta.touched && meta.error && (
                                                <div
                                                    className="invalid-feedback"
                                                    style={{ display: "block" }}
                                                >
                                                    {meta.error}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage
                                    component="div"
                                    name="expeditedrequested"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="expeditedreason">
                                    {({
                                        field,
                                        meta
                                    }) => (
                                        <div className="form-floating">
                                            <input
                                                maxLength="30"
                                                type="text"
                                                id="expeditedreason"
                                                className={`form-control ${meta.touched && meta.error
                                                    ? "is-invalid"
                                                    : field.value
                                                        ? "is-valid"
                                                        : ""
                                                    }`}
                                                placeholder="Expedited Reason"
                                                {...field}
                                                onChange={(event) => {
                                                    setExpeditedRequestData({ ...expeditedRequestData, 'Expedited_Reason': event.target['value'] })
                                                }}
                                                onBlur={(event) =>
                                                    props.handleOnChange(event.target['value'], 'Expedited_Reason')
                                                }
                                                value={convertToCase(expeditedRequestData['Expedited_Reason'])}
                                                disabled={
                                                    prop.state.formView === "DashboardView" &&
                                                        (prop.state.stageName === "Redirect Review" ||
                                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "CaseArchived")
                                                        ? true
                                                        : false
                                                }
                                            />
                                            <label htmlFor="floatingInputGrid">
                                                Expedited Reason
                                            </label>
                                            {meta.touched && meta.error && (
                                                <div
                                                    className="invalid-feedback"
                                                    style={{ display: "block" }}
                                                >
                                                    {meta.error}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage
                                    component="div"
                                    name="expeditedreason"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="stupexpedited">
                                    {({
                                        field, // { name, value, onChange, onBlur }
                                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                        meta,
                                    }) => (
                                        <div className="form-floating">
                                            <Select
                                                styles={{...selectStyle}}
                                                components={{
                                                    ValueContainer: CustomValueContainer,
                                                }}
                                                isClearable
                                                name={field.name}
                                                isDisabled={

                                                    prop.state.formView === "DashboardView" &&
                                                        (prop.state.stageName === "Redirect Review" ||
                                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "CaseArchived")
                                                        ? true
                                                        : false

                                                }
                                                className="basic-multi-select"
                                                options={stUpExpeditedValues}
                                                id="stupexpedited"
                                                isMulti={false}
                                                onChange={(selectValue) =>
                                                    props.handleOnChange(selectValue ? selectValue.value : null, 'Standard_Upgraded_to_Expedited')
                                                }
                                                value={
                                                    {
                                                        label: expeditedRequestData['Standard_Upgraded_to_Expedited'],
                                                        value: expeditedRequestData['Standard_Upgraded_to_Expedited']
                                                    }
                                                }
                                                placeholder="Standard Upgraded to Expedited"
                                                //styles={{...customStyles}}
                                                isSearchable={
                                                    document.documentElement.clientHeight <= document.documentElement.clientWidth
                                                }
                                            />
                                            {meta.touched && meta.error && (
                                                <div
                                                    className="invalid-feedback"
                                                    style={{ display: "block" }}
                                                >
                                                    {meta.error}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage
                                    component="div"
                                    name="stupexpedited"
                                    className="invalid-feedback"
                                />
                            </div>
                        </div>
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                                <div style={{}}>
                                    <ReactDatePicker
                                        id="datePicker"
                                        className="form-control example-custom-input-provider"
                                        selected={expeditedRequestData.Expedited_Upgrade_Date_Time}
                                        name="expeditedupgradedatetime"
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={(date, event) => {

                                            props.handleOnChange(date, "Expedited_Upgrade_Date_Time")
                                        }
                                        }
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerExpeditedUpgradeDateTime />}
                                        disabled={
                                            prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "CaseArchived")
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="expediteddenied">
                                    {({
                                        field, // { name, value, onChange, onBlur }
                                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                        meta,
                                    }) => (
                                        <div className="form-floating">
                                            <Select
                                                styles={{...selectStyle}}
                                                components={{
                                                    ValueContainer: CustomValueContainer,
                                                }}
                                                isClearable
                                                name={field.name}
                                                isDisabled={

                                                    prop.state.formView === "DashboardView" &&
                                                        (prop.state.stageName === "Redirect Review" ||
                                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "CaseArchived")
                                                        ? true
                                                        : false

                                             

                                                }
                                                className="basic-multi-select"
                                                options={expeditedDeniedValues}
                                                id="stupexpedited"
                                                isMulti={false}
                                                onChange={(selectValue) =>
                                                    props.handleOnChange(selectValue ? selectValue.value : null, 'Expedited_Denied')
                                                }
                                                value={
                                                    {
                                                        label: expeditedRequestData['Expedited_Denied'],
                                                        value: expeditedRequestData['Expedited_Denied']
                                                    }
                                                }
                                                placeholder="Expedited Denied"
                                                //styles={{...customStyles}}
                                                isSearchable={
                                                    document.documentElement.clientHeight >
                                                        document.documentElement.clientWidth
                                                        ? false
                                                        : true
                                                }
                                            />
                                            {meta.touched && meta.error && (
                                                <div
                                                    className="invalid-feedback"
                                                    style={{ display: "block" }}
                                                >
                                                    {meta.error}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage
                                    component="div"
                                    name="expediteddenied"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <div style={{}}>
                                    <ReactDatePicker
                                        id="datePicker"
                                        className="form-control example-custom-input-provider"
                                        selected={expeditedRequestData.Expedited_Denied_Date}
                                        name="expediteddenieddate"
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={(date, event) => {

                                            props.handleOnChange(date, "Expedited_Denied_Date")
                                        }
                                        }
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerExpeditedDeniedDate />}
                                        disabled={
                                            prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "CaseArchived")
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                                <div style={{}}>
                                    <ReactDatePicker
                                        id="datePicker"
                                        className="form-control example-custom-input-provider"
                                        selected={expeditedRequestData.Decision_Letter_Date}
                                        name="decisionletterdate"
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={(date, event) => {

                                            props.handleOnChange(date, "Decision_Letter_Date")
                                        }
                                        }
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerDecisionLetterDate />}
                                        disabled={
                                            prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "CaseArchived")
                                                ? true
                                                : false
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default ExpeditedRequestAccordion;