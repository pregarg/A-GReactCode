import React, {useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";

const CaseTimelinesAccordion = (props) => {
  console.log("props.renderType",props.renderType)
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const providerDisputeConfigData = JSON.parse(
    process.env.REACT_APP_PROVIDERDISPUTES_DETAILS || "{}",
  );
  const appealsStageName = caseHeaderConfigData["StageName"];
  const PDStageName = providerDisputeConfigData["StageName"];

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
    console.log("newdata in caetimelines-->", newData)
    if (persist) {
      props.setCaseTimelinesData(newData);
    }
  };
  const persistCaseTimelinesData = () => {
    props.setCaseTimelinesData(caseTimelinesData);
  };
 
  const renderInputField = (name, placeholder, maxLength) => {
    const isDashboardView = 
      location.state.formView === "DashboardView" || 
      location.state.formView === "DashboardHomeView";
  
    const isAppealsDisabled = 
      props.renderType === RenderType.APPEALS && 
      isDashboardView && 
      (
        (appealsStageName === "Start" && name !== "Acknowledgment_Timely") ||
        [
          "Intake",
          "Acknowledge",
          "Redirect Review",
          "Documents Needed",
          "Research",
          "Effectuate",
          "Pending Effectuate",
          "Resolve",
          "Case Completed",
          "Reopen",
          "CaseArchived"
        ].includes(location.state.stageName)
      );
  
    const isProviderDisputeDisabled = 
      props.renderType === RenderType.PROVIDER_DISPUTE && 
      isDashboardView && 
      (
        (PDStageName === "Start") ||
        [
          "Intake",
          "Acknowledge",
          "Documents Needed",
          "Research",
          "Effectuate",
          "Resolve",
          "Case Completed",
          "Reopen",
          "CaseArchived"
        ].includes(location.state.stageName)
      );
  
    const disabled = isAppealsDisabled || isProviderDisputeDisabled;
  
    return (
      <div className="col-xs-6 col-md-4">
        <FormikInputField
          name={name}
          placeholder={placeholder}
          maxLength={maxLength}
          data={caseTimelinesData}
          onChange={handleCaseTimelinesData}
          displayErrors={props.shouldShowSubmitError}
          disabled={disabled}
          persist={persistCaseTimelinesData}
          schema={props.caseTimelinesValidationSchema}
          errors={props.caseTimelinesErrors}
        />
      </div>
    );
  };

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
          (props.renderType === RenderType.APPEALS && RenderType.PROVIDER_DISPUTE&&
            location.state.formView === "DashboardView" &&
            (location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Effectuate" ||
              location.state.stageName === "Pending Effectuate" ||
              location.state.stageName === "Resolve" ||
              location.state.stageName === "Case Completed" ||
              location.state.stageName === "Reopen" ||
              location.state.stageName === "CaseArchived") ||
          (name === "Case_Received_Date#date" && location.state.stageName === "Documents Needed"))
        }
        schema={props.caseTimelinesValidationSchema}
        errors={props.caseTimelinesErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => {
    const isDashboardView = 
      location.state.formView === "DashboardView" || 
      location.state.formView === "DashboardHomeView";
  
    const isAppealsDisabled = 
      props.renderType === RenderType.APPEALS &&
      isDashboardView &&
      (
        location.state.stageName === "Redirect Review" ||
        location.state.stageName === "Documents Needed" ||
        location.state.stageName === "Effectuate" ||
        location.state.stageName === "Pending Effectuate" ||
        location.state.stageName === "Resolve" ||
        location.state.stageName === "Case Completed" ||
        location.state.stageName === "Reopen" ||
        location.state.stageName === "CaseArchived"
      );
  
    const isProviderDisputeDisabled = 
      props.renderType === RenderType.PROVIDER_DISPUTE &&
      isDashboardView &&
      (
        (name === "Timeframe_Extended" || name === "Case_in_Compliance") && 
        (
          PDStageName === "Start" || 
          location.state.stageName === "Intake" ||
          location.state.stageName === "Acknowledge" ||
          location.state.stageName === "Effectuate" ||
          location.state.stageName === "Bulk Effectuate" ||
          location.state.stageName === "Documents Needed" ||
          location.state.stageName === "Resolve" ||
          location.state.stageName === "Case Completed" ||
          location.state.stageName === "Reopen" ||
          location.state.stageName === "CaseArchived"
        )
      );
  
    const disabled = isAppealsDisabled || isProviderDisputeDisabled;
  
    return (
      <div className="col-xs-6 col-md-4">
        <FormikSelectField
          name={name}
          placeholder={placeholder}
          data={caseTimelinesData}
          options={options}
          onChange={handleCaseTimelinesData}
          displayErrors={props.shouldShowSubmitError}
          disabled={disabled}
          schema={props.caseTimelinesValidationSchema}
          errors={props.caseTimelinesErrors}
        />
      </div>
    );
  };
  

  
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
