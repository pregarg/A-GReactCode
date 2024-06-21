import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ReactDatePicker from "react-datepicker";

const MemeberInformationAccordion = (props) => {
    const {
        convertToCase
    } = useGetDBTables();

    const { ValueContainer, Placeholder } = components;
    const [memberInformationData, setMemberInformationData] = useState(props.handleData);
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

    const RenderDatePickerPlanEffectiveDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Plan Effective Date" />
            <label htmlFor="datePicker">Plan Effective Date</label>

        </div>
    );
    const RenderDatePickerPlanExpirationDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Plan Expiration Date" />
            <label htmlFor="datePicker">Plan Expiration Date</label>
        </div>
    );
    const RenderDatePickerDateOfBirth = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Date of Birth" />
            <label htmlFor="datePicker">Date of Birth</label>
        </div>
    );

    useEffect(() => {
        console.log("formdatamemberinformation", memberInformationData);
    }, [memberInformationData]);

    return (
        <div className="accordion-item" id="caseHeader">
            <h2
                className="accordion-header"
                id="panelsStayOpen-Header"
            >
                <button
                    className="accordion-button accordionButtonStyle"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseHeader"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseOne"
                >
                    Member Information
                </button>
            </h2>
            <div
                id="panelsStayOpen-collapseHeader"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-Header"
            >
                <div className="accordion-body">
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="memberid">
                                {({
                                    field,
                                    meta
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            maxLength="50"
                                            type="text"
                                            id="memberid"
                                            className={`form-control ${meta.touched && meta.error
                                                ? "is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Member Id"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Member_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Member_ID')
                                            }
                                            value={convertToCase(memberInformationData['Member_ID'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Member ID
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
                                name="organizationName"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="memberFirstName">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="memberFirstName"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Member First Name"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Member_First_Name': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Member_First_Name')
                                            }
                                            value={convertToCase(memberInformationData['Member_First_Name'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Member First Name
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
                                name="memberfirstname"
                                className="invalid-feedback"
                            />
                        </div>

                        <div className="col-xs-6 col-md-4">
                            <Field name="memberLastName">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value || field.value === null
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Member Last Name"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Member_Last_Name': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Member_Last_Name')
                                            }
                                            value={convertToCase(memberInformationData['Member_Last_Name'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Member Last Name
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
                                name="memberlastname"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="memberIPA">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="memberipa"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Member IPA"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Member_IPA': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Member_IPA')
                                            }
                                            value={convertToCase(memberInformationData['Member_IPA'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Member IPA
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
                                name="Mmeber IPA"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="contract/PlanId">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="contract/PlanId"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Contract/ Plan Id"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'ContractPlan_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'ContractPlan_ID')
                                            }
                                            value={convertToCase(memberInformationData['ContractPlan_ID'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Contract / Plan Id
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
                                name="contract/planid"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="planName">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="planname"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Plan Name"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Plan_Name': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Plan_Name')
                                            }
                                            value={convertToCase(memberInformationData['Plan_Name'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Plan Name
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
                                name="Plan Name"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="planDescription">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="planDescription"
                                            maxLength="240"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Plan Description"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Plan_Description': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Plan_Description')
                                            }
                                            value={convertToCase(memberInformationData['Plan_Description'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Plan Description
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
                                name="planDescription"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="planCode">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="planCode"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Plan Code"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Plan_Code': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Plan_Code')
                                            }
                                            value={convertToCase(memberInformationData['Plan_Code'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Plan Code
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
                                name="plancode"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="medicareId(HCIN)">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="meicareid(HCIN)"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Medicare Id(HCIN)"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Medicare_ID_HICN': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Medicare_ID_HICN')
                                            }
                                            value={convertToCase(memberInformationData['Medicare_ID_HICN'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Medicare ID(HICN)
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
                                name="medicareid(HCIN)"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="medicaicId">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="medicaidId(HCIN)"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Medicaid Id"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Medicaid_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Medicaid_ID')
                                            }
                                            value={convertToCase(memberInformationData['Medicaid_ID'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Medicaid ID
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
                                name="medicaidId"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{}}>
                                <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={memberInformationData.Plan_Effective_Date}
                                    name="planeffectivedate"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Plan_Effective_Date")
                                    }
                                    }
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerPlanEffectiveDate />}
                                />
                            </div>

                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{}}>
                                <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={memberInformationData.Plan_Expiration_Date}
                                    name="planexpirationdate"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Plan_Expiration_Date")
                                    }
                                    }
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerPlanExpirationDate />}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="primarycarephysician(PCP)">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="primarycarephysician(PCP)"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Primary Care Physician(PCP)"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Primary_Care_Physician_PCP': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Primary_Care_Physician_PCP')
                                            }
                                            value={convertToCase(memberInformationData['Primary_Care_Physician_PCP'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Primary Care Physician(PCP)
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
                                name="medicaidId"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="pcpId">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="pcpId"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="PCP ID"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'PCP_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'PCP_ID')
                                            }
                                            value={convertToCase(memberInformationData['PCP_ID'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            PCP ID
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
                                name="pcpid"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="pcpnpiId">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="pcpnpiId"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="PCP NPI ID"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'PCP_NPI_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'PCP_NPI_ID')
                                            }
                                            value={convertToCase(memberInformationData['PCP_NPI_ID'])}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            PCP NPI ID
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
                                name="pcpnpiid"
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
                                    selected={memberInformationData.Date_of_Birth}
                                    name="dateofbirth"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Date_of_Birth")
                                    }
                                    }
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerDateOfBirth />}
                                />
                            </div>

                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}
export default MemeberInformationAccordion;

