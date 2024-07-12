import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { components } from "react-select";
import ReactDatePicker from "react-datepicker";

const CaseHeaderAccordion = (props) => {
    const {
        convertToCase
    } = useGetDBTables();

    const { ValueContainer, Placeholder } = components;
    const [caseHeaderData, setCaseHeaderData] = useState(props.handleData);

    const mastersSelector = useSelector((masters) => masters);
    const masterUserName = mastersSelector.hasOwnProperty("auth")
        ? mastersSelector.auth.hasOwnProperty("userName")
            ? mastersSelector.auth.userName
            : "system"
        : "system";

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

    const RenderDatePickerCaseDueDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Case Due Date" />
            <label htmlFor="datePicker">Case Due Date</label>

        </div>
    );
    const RenderDatePickerExtendedCaseDueDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Extended Case Due Date" />
            <label htmlFor="datePicker">Extended Case Due Date</label>
        </div>
    );
    const RenderDatePickerInternalDueDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Internal Due Date" />
            <label htmlFor="datePicker">Internal Due Date</label>
        </div>
    );
    const RenderDatePickerCaseReceivedDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Case Recieved Date" />
            <label htmlFor="datePicker">Case Received Date</label>
        </div>
    );

    useEffect(() => {
        console.log("formdatacaseheader", caseHeaderData);
    }, [caseHeaderData]);

    return (
        <div className="accordion-item" id="caseHeader">
            <h2 className="accordion-header" id="panelsStayOpen-Header">
                <button
                    className="accordion-button accordionButtonStyle no-arrow"
                    type="button"
                >
                    Case Header
                </button>
            </h2>
            <div className="accordion-collapse show" aria-labelledby="panelsStayOpen-Header">
                <div className="accordion-body">
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Case ID- {convertToCase(caseHeaderData['caseNumber'])}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Sub Case ID- {convertToCase(caseHeaderData['Subcase_ID'])}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Case Owner- {convertToCase(caseHeaderData['Case_Owner'])}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Case Status- {convertToCase(caseHeaderData['Case_Status'])}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Case Due Date- {convertToCase(caseHeaderData['Case_Due_Date'])}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Extended Case Due Date- {convertToCase(caseHeaderData['Extended_Case_Due_Date'])}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Case Validation- {convertToCase(caseHeaderData['Case_Validation'])}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Internal Due Date- {convertToCase(caseHeaderData['Internal_Due_Date'])}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>White Glove Indicator- {convertToCase(caseHeaderData['White_Glove_Indicator'])}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Case Received Date- {convertToCase(caseHeaderData['Case_Received_Date'])}</span>
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{ display: 'flex', flexDirection: 'row' }}>
                                <div style={{ width: '300px', textAlign: 'left' }}>
                                    <span>Environmental Description- {convertToCase(caseHeaderData['Environmental_Description'])}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="caseid">
                                {({ field, meta }) => (
                                    <div className="form-floating">
                                        <label
                                            // className={`form-control ${meta.touched && meta.error ? "is-invalid" : "is-valid"}`}
                                            className="form-control"
                                            htmlFor="floatingInputGrid"
                                        >
                                            Case ID- {convertToCase(caseHeaderData['caseNumber'])}
                                        </label>
                                        {meta.touched && meta.error && (
                                            <div className="invalid-feedback" style={{ display: "block" }}>
                                                {meta.error}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage component="div" name="organizationName" className="invalid-feedback" />
                        </div>

                        <div className="col-xs-6 col-md-4">
                            <Field name="subcaseId">
                                {({ field, meta }) => (
                                    <div className="form-floating">
                                        <label
                                            // className={`form-control ${meta.touched && meta.error ? "is-invalid" : "is-valid"}`}
                                            className="form-control"
                                            htmlFor="floatingInputGrid"
                                        >
                                            Sub Case ID- {convertToCase(caseHeaderData['Subcase_ID'])}
                                        </label>
                                        {meta.touched && meta.error && (
                                            <div className="invalid-feedback" style={{ display: "block" }}>
                                                {meta.error}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage component="div" name="subcaseid" className="invalid-feedback" />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="caseowner">
                                {({ field, meta }) => (
                                    <div className="form-floating">
                                        <input
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? "is-invalid"
                                                : field.value || field.value === null
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Case Owner"
                                            {...field}
                                            onChange={(event) => {
                                                setCaseHeaderData({ ...caseHeaderData, 'Case_Owner': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Case_Owner')
                                            }
                                            value={convertToCase(caseHeaderData['Case_Owner'])}
                                            readOnly
                                        />
                                        <label htmlFor="floatingInputGrid">Case Owner</label>
                                        {meta.touched && meta.error && (
                                            <div className="invalid-feedback" style={{ display: "block" }}>
                                                {meta.error}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage component="div" name="caseowner" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="caseStatus">
                                {({ field, meta }) => (
                                    <div className="form-floating">
                                        <label
                                            // className={`form-control ${meta.touched && meta.error ? "is-invalid" : "is-valid"}`}
                                            className="form-control"
                                            htmlFor="floatingInputGrid"
                                        >
                                            Case Status- {convertToCase(caseHeaderData['Case_Status'])}
                                        </label>
                                        {meta.touched && meta.error && (
                                            <div className="invalid-feedback" style={{ display: "block" }}>
                                                {meta.error}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage component="div" name="casestatus" className="invalid-feedback" />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{}}>
                                <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={caseHeaderData.Case_Due_Date}
                                    readOnly
                                    name="caseduedate"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Case_Due_Date")
                                    }
                                    }
                                    dropdownMode="select"
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerCaseDueDate />}
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{}}>
                                <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={caseHeaderData.Extended_Case_Due_Date}
                                    readOnly
                                    name="extendedcaseduedate"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Extended_Case_Due_Date")
                                    }
                                    }
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerExtendedCaseDueDate />}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="caseValidation">
                                {({ field, meta }) => (
                                    <div className="form-floating">
                                        <input
                                            id="caseValidation"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? "is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Case Validation"
                                            {...field}
                                            onChange={(event) => {
                                                setCaseHeaderData({ ...caseHeaderData, 'Case_Validation': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Case_Validation')
                                            }
                                            value={convertToCase(caseHeaderData['Case_Validation'])}
                                            readOnly
                                        />
                                        <label htmlFor="floatingInputGrid">Case Validation</label>
                                        {meta.touched && meta.error && (
                                            <div className="invalid-feedback" style={{ display: "block" }}>
                                                {meta.error}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage component="div" name="casevalidation" className="invalid-feedback" />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{}}>
                                <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={caseHeaderData.Internal_Due_Date}
                                    readOnly
                                    name="internalduedate"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Internal_Due_Date")
                                    }
                                    }
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerInternalDueDate />}
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="whitegloveindicator">
                                {({ field, meta }) => (
                                    <div className="form-floating">
                                        <input
                                            id="whiteGloveIndicator"
                                            maxLength="30"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? "is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="White Glove Indicator"
                                            {...field}
                                            onChange={(event) => {
                                                setCaseHeaderData({ ...caseHeaderData, 'White_Glove_Indicator': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'White_Glove_Indicator')
                                            }
                                            value={convertToCase(caseHeaderData['White_Glove_Indicator'])}
                                            readOnly
                                        />
                                        <label htmlFor="floatingInputGrid">White Glove Indicator</label>
                                        {meta.touched && meta.error && (
                                            <div className="invalid-feedback" style={{ display: "block" }}>
                                                {meta.error}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage component="div" name="whiteGloveIndicator" className="invalid-feedback" />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <div style={{}}>
                                <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={caseHeaderData.Case_Received_Date}
                                    readOnly
                                    name="caserecieveddate"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Case_Received_Date")
                                    }
                                    }
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerCaseReceivedDate />}
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="environmentaldescription">
                                {({ field, meta }) => (
                                    <div className="form-floating">
                                        <input
                                            id="environmentalDescription"
                                            maxLength="30"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? "is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Environmental Description"
                                            {...field}
                                            onChange={(event) => {
                                                setCaseHeaderData({ ...caseHeaderData, 'Environmental_Description': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Environmental_Description')
                                            }
                                            value={convertToCase(caseHeaderData['Environmental_Description'])}
                                            readOnly
                                        />
                                        <label htmlFor="floatingInputGrid">Environmental Description</label>
                                        {meta.touched && meta.error && (
                                            <div className="invalid-feedback" style={{ display: "block" }}>
                                                {meta.error}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </Field>
                            <ErrorMessage component="div" name="enivironmentalDescription" className="invalid-feedback" />
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
}
export default CaseHeaderAccordion;

