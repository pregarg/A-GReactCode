import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";

const CaseTimelinesAccordion = (props) => {
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const { convertToCase } = useGetDBTables();
  const [caseTimelinesData, setCaseTimelinesData] = useState(
    props.caseTimelinesData || {},
  );

  const handleCaseTimelinesData = (name, value, persist) => {
    const newData = {
      ...caseTimelinesData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setCaseTimelinesData(newData);
    if (persist) {
      props.setCaseTimelinesData(newData);
    }
  };
  const persistCaseTimelinesData = () => {
    props.setCaseTimelinesData(caseTimelinesData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseTimelinesData}
        onChange={handleCaseTimelinesData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          props.renderType === RenderType.APPEALS &&
          (location.state.formView === "DashboardView" ||
            location.state.formView === "DashboardHomeView") &&
          ((stageName === "Start" && name !== "Acknowledgment_Timely") ||
            location.state.stageName === "Intake" ||
            location.state.stageName === "Acknowledge" ||
            location.state.stageName === "Redirect Review" ||
            location.state.stageName === "Documents Needed" ||
            location.state.stageName === "Research" ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            location.state.stageName === "Reopen" ||
            location.state.stageName === "CaseArchived")
        }
        persist={persistCaseTimelinesData}
        schema={props.caseTimelinesValidationSchema}
        errors={props.caseTimelinesErrors}
      />
    </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        data={caseTimelinesData}
        label={label}
        onChange={handleCaseTimelinesData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          (props.renderType === RenderType.APPEALS &&
            location.state.formView === "DashboardView" &&
            (location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Effectuate" ||
              location.state.stageName === "Pending Effectuate" ||
              location.state.stageName === "Resolve" ||
              location.state.stageName === "Case Completed" ||
              location.state.stageName === "Reopen" ||
              location.state.stageName === "CaseArchived")) ||
          (name === "Case_Received_Date" &&
            location.state.stageName === "Documents Needed")
        }
        schema={props.caseTimelinesValidationSchema}
        errors={props.caseTimelinesErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={caseTimelinesData}
        options={options}
        onChange={handleCaseTimelinesData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          props.renderType === RenderType.APPEALS &&
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
        schema={props.caseTimelinesValidationSchema}
        errors={props.caseTimelinesErrors}
      />
    </div>
  );

  return (
    <Formik
      initialValues={props.caseTimelinesData}
      validationSchema={props.caseTimelinesValidationSchema}
      onSubmit={() => {}}
      enableReinitialize
    >
      {() => (
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
                {renderElements(
                  props.caseTimelinesFields,
                  renderSelectField,
                  renderInputField,
                  renderDatePicker,
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CaseTimelinesAccordion;
