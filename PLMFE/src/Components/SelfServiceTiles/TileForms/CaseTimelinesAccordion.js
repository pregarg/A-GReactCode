import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Field, ErrorMessage } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ReactDatePicker from "react-datepicker";
import Select, { components } from "react-select";
import {selectStyle} from "./SelectStyle";
import './Appeals.css';

const CaseTimelinesAccordion = (props) => {
  const { convertToCase, getDatePartOnly } = useGetDBTables();
  const [caseTimelinesData, setCaseTimelinesData] = useState(props.handleData);
  const mastersSelector = useSelector((masters) => masters);

  const RenderDatePickerReceivedDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Date of Birth" />
      <label htmlFor="datePicker">Case Received Date</label>
    </div>
  );
  const RenderDatePickerAORRecievedDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="AOR Recieved Date" />
      <label htmlFor="datePicker">AOR Recieved Date</label>
    </div>
  );
  const RenderDatePickerWOLRecievedDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="WOL RecievedDate" />
      <label htmlFor="datePicker">WOL Received Date</label>
    </div>
  );
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

  console.log("props", props);

  const tabRef = useRef("HomeView");
  let prop = useLocation();
  let caseFilingMethodValues = [];
  console.log("uselocation prop--->",prop);
  useEffect(() => {
    try {
      if (mastersSelector.hasOwnProperty("masterAngCaseFilingMethod")) {
        const caseFilingMethodArray =
          mastersSelector["masterAngCaseFilingMethod"].length === 0
            ? []
            : mastersSelector["masterAngCaseFilingMethod"][0];

        for (let i = 0; i < caseFilingMethodArray.length; i++) {
          caseFilingMethodValues.push({ label: convertToCase(caseFilingMethodArray[i].Case_Filing_Method), value: convertToCase(caseFilingMethodArray[i].Case_Filing_Method) });
        }
      }
    } catch (error) {
      console.error("An error occurred in useEffect:", error);
    }
  }, []);

  const styleConfig = {

  }

  return (
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
              <Field name="Case_Filing_Method">
                {({
                  meta,
                }) => (
                  <div className="form-floating" >
                    <Select
                      styles={selectStyle}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={"Case_Filing_Method"}
                      isDisabled={
                        tabRef.current === "DashboardView" &&
                          prop.state.lockStatus !== undefined &&
                          prop.state.lockStatus === "Y"
                      }
                      className="basic-multi-select"
                      options={caseFilingMethodValues}
                      id="casefilingmethodDropdown"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Case_Filing_Method')
                      }
                      value={
                        {
                          label: caseTimelinesData['Case_Filing_Method'],
                          value: caseTimelinesData['Case_Filing_Method']
                        }
                      }
                      placeholder="Case Filing Method"
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
                name="casefilingmethod"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="caseaging">
                {({
                  field,
                  meta,
                }) => (
                  <div className="form-floating">
                    <input
                      maxLength="16"
                      type="text"
                      id="caseaging"
                      className={`form-control ${meta.touched && meta.error
                        ? "is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="Case Aging"
                      {...field}
                      onChange={(event) => {
                        setCaseTimelinesData({ ...caseTimelinesData, 'Case_Aging': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'Case_Aging')
                      }
                      value={convertToCase(caseTimelinesData['Case_Aging'])}
                      disabled={prop.state.stageName=== 'Intake'}

                    />
                    <label htmlFor="floatingInputGrid">
                      Case Aging
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
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="compliancetimelefttofinish">
                {({
                  field,
                  meta
                }) => (
                  <div className="form-floating">
                    <input
                      maxLength="16"
                      type="text"
                      id="compliancetimelefttofinish"
                      className={`form-control ${meta.touched && meta.error
                        ? "is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="Compliance Time Left to Finish"
                      {...field}
                      onChange={(event) => {
                        setCaseTimelinesData({ ...caseTimelinesData, 'Compliance_Time_Left_to_Finish': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'Compliance_Time_Left_to_Finish')
                      }
                      value={convertToCase(caseTimelinesData['Compliance_Time_Left_to_Finish'])}
                    />
                    <label htmlFor="floatingInputGrid">
                      Compliance Time Left to Finish
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
            </div>
          </div>
          <div className="row my-2">
            <div className="col-xs-6 col-md-4">
              <Field name="acknowledgementtimely">
                {({
                  field,
                  meta
                }) => (
                  <div className="form-floating">
                    <input
                      maxLength="30"
                      type="text"
                      id="acknowledgementtimely"
                      className={`form-control ${meta.touched && meta.error
                        ? "is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="Acknowledgement Timely"
                      {...field}
                      onChange={(event) => {
                        setCaseTimelinesData({ ...caseTimelinesData, 'Acknowledgment_Timely': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'Acknowledgment_Timely')
                      }
                      value={convertToCase(caseTimelinesData['Acknowledgment_Timely'])}
                    />
                    <label htmlFor="floatingInputGrid">
                      Acknowledgement Timely
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
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="timeframeextended">
                {({
                  field,
                  meta
                }) => (
                  <div className="form-floating">
                    <input
                      maxLength="30"
                      type="text"
                      id="timeframeextended"
                      className={`form-control ${meta.touched && meta.error
                        ? "is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="Timeframe Extended"
                      {...field}
                      onChange={(event) => {
                        setCaseTimelinesData({ ...caseTimelinesData, 'Timeframe_Extended': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'Timeframe_Extended')
                      }
                      value={convertToCase(caseTimelinesData['Timeframe_Extended'])}
                    />
                    <label htmlFor="floatingInputGrid">
                      Timeframe Extended
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
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="caseincompliance">
                {({
                  field,
                  meta
                }) => (
                  <div className="form-floating">
                    <input
                      maxLength="30"
                      type="text"
                      id="caseincompliance"
                      className={`form-control ${meta.touched && meta.error
                        ? "is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="Case in Compliance"
                      {...field}
                      onChange={(event) => {
                        setCaseTimelinesData({ ...caseTimelinesData, 'Case_in_Compliance': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'Case_in_Compliance')
                      }
                      value={convertToCase(caseTimelinesData['Case_in_Compliance'])}
                    />
                    <label htmlFor="floatingInputGrid">
                      Case in Compliance
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
            </div>
          </div>
          <div className="row my-2">
            <div className="col-xs-6 col-md-4">
              <Field name="outofcompliancereason">
                {({
                  field,
                  meta
                }) => (
                  <div className="form-floating">
                    <input
                      maxLength="30"
                      type="text"
                      id="outofcompliancereason"
                      className={`form-control ${meta.touched && meta.error
                        ? "is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="Out of Compliance Reason"
                      {...field}
                      onChange={(event) => {
                        setCaseTimelinesData({ ...caseTimelinesData, 'Out_of_Compliance_Reason': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'Out_of_Compliance_Reason')
                      }
                      value={convertToCase(caseTimelinesData['Out_of_Compliance_Reason'])}
                    />
                    <label htmlFor="floatingInputGrid">
                      Out of Compliance Reason
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
            </div>
            <div className="col-xs-6 col-md-4">
              <div style={{}}>
                <ReactDatePicker
                  id="datePicker"
                  className="form-control example-custom-input-provider"
                  selected={caseTimelinesData.Case_Received_Date}
                  name="Case_Received_Date"
                  onChange={(date, event) => {

                    props.handleOnChange(date, "Case_Received_Date")
                  }
                  }
                  dateFormat="MM/dd/yyyy"
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  isClearable
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  dropdownMode="select"
                  readOnly={
                    tabRef.current === "DashboardView" &&
                      prop.state.lockStatus !== undefined &&
                      prop.state.lockStatus === "Y"
                  }
                  style={{
                    position: "relative",
                    zIndex: "999",
                  }}
                  customInput={<RenderDatePickerReceivedDate />}
                />
              </div>
            </div>
            <div className="col-xs-6 col-md-4">
              <div style={{}}>
                <ReactDatePicker
                  id="datePicker"
                  className="form-control example-custom-input-provider"
                  selected={caseTimelinesData.AOR_Received_Date}
                  name="AOR_Received_Date"
                  dateFormat="MM/dd/yyyy"
                  onChange={(date, event) => {
                    props.handleOnChange(date, "AOR_Received_Date");
                  }}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  isClearable
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  dropdownMode="select"
                  style={{
                    position: "relative",
                    zIndex: "999",
                  }}
                  customInput={<RenderDatePickerAORRecievedDate />}
                />
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-4">
              <div style={{}}>
                <ReactDatePicker
                  id="datePicker"
                  className="form-control example-custom-input-provider"
                  selected={caseTimelinesData.WOL_Received_Date}
                  name="WOL_Received_Date"
                  dateFormat="MM/dd/yyyy"
                  onChange={(date, event) => {
                    props.handleOnChange(date, "WOL_Received_Date");
                  }}
                  peekNextMonth
                  showMonthDropdown
                  showYearDropdown
                  isClearable
                  onKeyDown={(e) => {
                    e.preventDefault();
                  }}
                  dropdownMode="select"
                  style={{
                    position: "relative",
                    zIndex: "999",
                  }}
                  customInput={<RenderDatePickerWOLRecievedDate />}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseTimelinesAccordion;
