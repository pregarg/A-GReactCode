import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";

const CaseTimelinesAccordion = (props) => {
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];
  
  const { convertToCase } = useGetDBTables();
  const masterAngCaseFilingMethodSelector = useSelector(
    (state) => state?.masterAngCaseFilingMethod,
  );
  const [caseTimelinesData, setCaseTimelinesData] = useState(
    props.caseTimelinesData || {},
  );
  const [caseFilingMethodValues, setCaseFilingMethodValues] = useState([]);

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
          (location.state.formView === "DashboardView" ||
            location.state.formView === "DashboardHomeView") &&
          ((stageName === "Start" && name !== "Acknowledgment_Timely") ||
            // && name !== "Case_in_Compliance" && name !== "Out_of_Compliance_Reason"
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
          (location.state.formView === "DashboardView" &&
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

  useEffect(() => {
    if (masterAngCaseFilingMethodSelector) {
      const caseFilingMethodArray =
        masterAngCaseFilingMethodSelector?.[0] || [];
      setCaseFilingMethodValues(
        caseFilingMethodArray.map((e) => ({
          label: convertToCase(e.Case_Filing_Method),
          value: convertToCase(e.Case_Filing_Method),
        })),
      );
    }
  }, []);

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
                <div className="row my-2">
                  {renderSelectField(
                    "Case_Filing_Method",
                    "Case Filing Method",
                    caseFilingMethodValues,
                  )}
                  {renderInputField("Case_Aging", "Case Aging", 16)}
                  {renderInputField(
                    "Compliance_Time_Left_to_Finish",
                    "Compliance Time Left to Finish",
                    16,
                  )}
                </div>
                <div className="row my-2">
                  {renderInputField(
                    "Acknowledgment_Timely",
                    "Acknowledgement Timely",
                    16,
                  )}
                  {renderInputField(
                    "Timeframe_Extended",
                    "Timeframe Extended",
                    30,
                  )}
                  {renderInputField(
                    "Case_in_Compliance",
                    "Case in Compliance",
                    30,
                  )}
                </div>
                <div className="row my-2">
                  {renderInputField(
                    "Out_of_Compliance_Reason",
                    "Out of Compliance Reason",
                    30,
                  )}
                  {renderDatePicker(
                    "Case_Received_Date",
                    "Case Received Date",
                    "Case Received Date",
                  )}
                  {renderDatePicker(
                    "AOR_Received_Date",
                    "AOR Received Date",
                    "AOR Received Date",
                  )}
                </div>
                <div className="row">
                  {renderDatePicker(
                    "WOL_Received_Date",
                    "WOL Received Date",
                    "WOL Received Date",
                  )}
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
