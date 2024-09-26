import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";

const DecisionAddOfRecordsAccordion = (props) => {
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const { convertToCase } = useGetDBTables();

  const [decisionAddData, setDecisionAddData] = useState(props.decisionAddData || {});
  console.log("data",decisionAddData)

  const handleDecisionAddData = (name, value, persist) => {
    const newData = {
      ...decisionAddData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setDecisionAddData(newData);
    if (persist) {
      props.setDecisionAddData(newData);
    }
  };
  const persistDecisionAddDataData = () => {
    props.setDecisionAddData(decisionAddData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={decisionAddData}
        onChange={handleDecisionAddData}
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
        persist={persistDecisionAddDataData}
        schema={props.decisionAddOfRecordsValidationSchema}
        errors={props.decisionAddErrors}
      />
    </div>
  );

  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={decisionAddData}
        options={options}
        onChange={handleDecisionAddData}
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
        schema={props.decisionAddOfRecordsValidationSchema}
        errors={props.decisionAddErrors}
      />
    </div>
  );

  return (
    <Formik
      initialValues={props.decisionAddData}
      validationSchema={props.decisionAddOfRecordsValidationSchema}
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
               Intake Decision
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTimelines"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-Timelines"
            >
              <div className="accordion-body">
              
              {renderElements(
                  props.decisionAddRecordFields,
                  renderSelectField,
                  renderInputField,
                  "",
                  
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DecisionAddOfRecordsAccordion;
