import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Field, ErrorMessage } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ReactDatePicker from "react-datepicker";
import Select, { components } from "react-select";

const CaseTimelinesAccordion = (props) => {
  const { convertToCase, getDatePartOnly } = useGetDBTables();
  const [caseTimelinesData, setCaseTimelinesData] = useState(props.handleData);
  const mastersSelector = useSelector((masters) => masters);

  const RenderDatePickerReceivedDate = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Date of Birth" />
      <label htmlFor="datePicker">Received Date</label>
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

  useEffect(() => {
    console.log("formdatacasetimelines", caseTimelinesData);
  }, [caseTimelinesData]);

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
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          height: "58px",
                          fontWeight: "lighter",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: 200,
                        }),
                        menu: (provided) => ({
                          ...provided,
                          zIndex: 9999,
                        }),

                        container: (provided, state) => ({
                          ...provided,
                          marginTop: 0,
                        }),
                        valueContainer: (provided, state) => ({
                          ...provided,
                          overflow: "visible",
                        }),
                        placeholder: (provided, state) => ({
                          ...provided,
                          position: "absolute",
                          top:
                            state.hasValue || state.selectProps.inputValue
                              ? -15
                              : "50%",
                          transition: "top 0.1s, font-size 0.1s",
                          fontSize:
                            (state.hasValue || state.selectProps.inputValue) &&
                            13,
                          color: 'black'
                        }),
                        singleValue: (styles) => ({ ...styles, textAlign: 'left' }),
                        option: (provided, state) => ({
                          ...provided,
                          textAlign: "left",
                        }),
                      }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={"Case_Filing_Method"}
                      isDisabled={
                        tabRef.current === "DashboardView" &&
                          prop.state.lockStatus !== undefined &&
                          prop.state.lockStatus === "Y"
                          ? true
                          : false
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
                name="casefilingmethod"
                className="invalid-feedback"
              />
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
                      ? true
                      : false
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
          <div className="row my-2">
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
