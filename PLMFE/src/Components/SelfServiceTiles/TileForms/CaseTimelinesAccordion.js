import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Field, ErrorMessage, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ReactDatePicker from "react-datepicker";
import Select, { components } from "react-select";
import { selectStyle } from "./SelectStyle";
import './Appeals.css';

const CaseTimelinesAccordion = (props) => {
  let location = useLocation();
  const { convertToCase, getDatePartOnly } = useGetDBTables();
  const mastersSelector = useSelector((masters) => masters);
  const [caseTimelinesData, setCaseTimelinesData] = useState(props.caseTimelinesData || {});
  const [caseFilingMethodValues, setCaseFilingMethodValues] = useState([]);

  const handleCaseTimelinesData = (name, value, persist) => {
    const newData = { ...caseTimelinesData, [name]: typeof value === 'string' ? convertToCase(value): value };
    setCaseTimelinesData(newData);
    if (persist) {
      props.setCaseTimelinesData(newData);
    }
  };
  const persistCaseTimelinesData = () => {
    props.setCaseTimelinesData(caseTimelinesData);
  }

  const { ValueContainer, Placeholder } = components;
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
  const InputField = (name, placeholder, maxLength) => {
    return (
        <>
          <Field name={name}>
            {({
                field,
                meta,
              }) => (
                <div className="form-floating">
                  <input
                      maxLength={maxLength}
                      type="text"
                      id={name}
                      className={`form-control ${meta.error
                          ? "is-invalid"
                          : field.value
                              ? "is-valid"
                              : ""
                      }`}
                      placeholder={placeholder}
                      onChange={(event) => handleCaseTimelinesData(name, event.target.value)}
                      onBlur={persistCaseTimelinesData}
                      value={caseTimelinesData[name]}
                      disabled={invalidInputState}
                  />
                  <label htmlFor="floatingInputGrid">
                    {placeholder}
                  </label>
                  {meta.error && (
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
        </>
    )
  }
  const DatePicker = (name, label, placeholder) => {
    const CustomInput = (props) => (
        <div className="form-floating">
          <input {...props} placeholder={placeholder}/>
          <label htmlFor={name}>{label}</label>
        </div>
    );
    return (
        <div>
          <ReactDatePicker
              id={name}
              className="form-control example-custom-input-provider"
              selected={caseTimelinesData[name]}
              name={name}
              dateFormat="MM/dd/yyyy"
              onChange={(date, event) => handleCaseTimelinesData(name, date, true)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              isClearable
              onKeyDown={(e) => e.preventDefault()}
              dropdownMode="select"
              style={{
                position: "relative",
                zIndex: "999",
              }}
              customInput={<CustomInput/>}
              disabled={
                location.state.formView === "DashboardView" &&
                  (location.state.stageName === "Redirect Review" ||
                      location.state.stageName === "Effectuate" ||
                      location.state.stageName === "Pending Effectuate" ||
                      location.state.stageName === "Resolve" ||
                      location.state.stageName === "Case Completed" ||
                      location.state.stageName === "Reopen" ||
                      location.state.stageName === "CaseArchived")
              }
          />
        </div>
    )
  };
  const SelectField = (name, placeholder, options) => <>
    <Field name={name}>
      {({
          field,
          form: {touched, errors},
          meta,
        }) => (
          <div className="form-floating">
            <Select
                styles={{...selectStyle}}
                components={{
                  ValueContainer: CustomValueContainer,
                }}
                isClearable
                isDisabled={
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
                className="basic-multi-select"
                options={options}
                id={name}
                isMulti={false}
                onChange={(value) => handleCaseTimelinesData(name, value?.value, true)}
                onBlur={persistCaseTimelinesData}
                value={caseTimelinesData[name] ? {label: caseTimelinesData[name], value: caseTimelinesData[name]} : undefined}
                placeholder={placeholder}
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
        name={name}
        className="invalid-feedback"
    />
  </>

  useEffect(() => {
    if (mastersSelector?.masterAngCaseFilingMethod) {
      const caseFilingMethodArray =
          mastersSelector.masterAngCaseFilingMethod?.[0] || [];
      setCaseFilingMethodValues(caseFilingMethodArray.map(e => ({
        label: convertToCase(e.Case_Filing_Method),
        value: convertToCase(e.Case_Filing_Method)
      })));
    }
  }, []);

  const [invalidInputState, setInvalidInputState] = useState(false);

  useEffect(() => {
    setInvalidInputState(location.state.formView === "DashboardView" &&
        (location.state.stageName === "Intake" ||
            location.state.stageName === "Acknowledge" ||
            location.state.stageName === "Redirect Review" ||
            location.state.stageName === "Documents Needed" ||
            location.state.stageName === "Research" ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            location.state.stageName === "Reopen" ||
            location.state.stageName === "CaseArchived"))
  }, [location]);

  return  (
      <Formik initialValues={props.caseTimelinesData}
              validationSchema={props.caseTimelinesValidationSchema}
              onSubmit={() => {}}>
        {({errors, touched}) => (
            <Form>
              <div className="accordion-item" id="caseTimelines">
                <h2 className="accordion-header" id="panelsStayOpen-Timelines">
                  <button
                      className="accordion-button accordionButtonStyle"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseTimelines"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                  >
                    Case Timelines
                  </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseTimelines"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-Timelines"
            >
              <div className="accordion-body">
                <div className="row my-2">
                  <div className="col-xs-6 col-md-4">
                    {SelectField('Case_Filing_Method', 'Case Filing Method', caseFilingMethodValues)}
                  </div>
                  <div className="col-xs-6 col-md-4">
                    {InputField("Case_Aging", "Case Aging", 16)}
                  </div>
                  <div className="col-xs-6 col-md-4">
                    {InputField("Compliance_Time_Left_to_Finish", "Compliance Time Left to Finish", 16)}
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-xs-6 col-md-4">
                    {InputField("Acknowledgment_Timely", "Acknowledgement Timely", 16)}
                  </div>
                  <div className="col-xs-6 col-md-4">
                    {InputField("Timeframe_Extended", "Timeframe Extended", 30)}
                  </div>
                  <div className="col-xs-6 col-md-4">
                    {InputField("Case_in_Compliance", "Case in Compliance", 30)}
                  </div>
                </div>
                <div className="row my-2">
                  <div className="col-xs-6 col-md-4">
                    {InputField("Out_of_Compliance_Reason", "Out of Compliance Reason", 30)}
                  </div>
                  <div className="col-xs-6 col-md-4">
                    {DatePicker("Case_Received_Date", "Case Received Date", "Date of Birth")}
                  </div>
                  <div className="col-xs-6 col-md-4">
                    {DatePicker("AOR_Received_Date", "AOR Received Date", "AOR Received Date")}
                  </div>
                </div>
                <div className="row">
                  <div className="col-xs-6 col-md-4">
                    {DatePicker("WOL_Received_Date", "WOR Received Date", "WOR Received Date")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CaseTimelinesAccordion;
