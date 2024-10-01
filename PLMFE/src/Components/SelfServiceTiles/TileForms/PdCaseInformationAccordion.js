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

const PdCaseInformationAccordion = (props) => {
  const location = useLocation();
  const providerDisputesConfigData = JSON.parse(
    process.env.REACT_APP_PROVIDERDISPUTES_DETAILS || "{}",
  );
  const stageName = providerDisputesConfigData["StageName"];

  const { convertToCase } = useGetDBTables();

  const [caseInformationData, setcaseInformationData] = useState(props.caseInformationData || {});

  const handlecaseInformationData = (name, value, persist) => {
    const newData = {
      ...caseInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setcaseInformationData(newData);
    if (persist) {
      props.setcaseInformationData(newData);
    }
  };
  const persistcaseInformationDataData = () => {
    props.setcaseInformationData(caseInformationData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseInformationData}
        onChange={handlecaseInformationData}
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
        persist={persistcaseInformationDataData}
        schema={props.pdCaseInformationValidationSchema}
        errors={props.pdCaseInformationErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={caseInformationData}
        options={options}
        onChange={handlecaseInformationData}
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
        schema={props.pdCaseInformationValidationSchema}
        errors={props.pdCaseInformationErrors}
      />
    </div>
  );



  return (
    <Formik
      initialValues={props.caseInformationData}
      validationSchema={props.pdCaseInformationValidationSchema}
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
                Case Information
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTimelines"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-Timelines"
            >
              <div className="accordion-body">
              
              {renderElements(
                  props.caseInformationFields,
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

export default PdCaseInformationAccordion;
