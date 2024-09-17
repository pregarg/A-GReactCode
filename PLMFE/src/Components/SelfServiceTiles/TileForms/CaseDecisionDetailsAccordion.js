import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";

const CaseDecisionDetailsAccordion = (props) => {
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];
  const excludedStages = [
    "Documents Needed",
  ];
  const shouldHideFields = !excludedStages.includes(
    location.state.stageName || stageName,
  );

  const { convertToCase } = useGetDBTables();
  const [caseDecisionDetailsData, setcaseDecisionDetailsData] = useState(
    props.caseDecisionDetailsData || {},
  );

  const handlecaseDecisionDetailsData = (name, value, persist) => {
    const newData = {
      ...caseDecisionDetailsData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setcaseDecisionDetailsData(newData);
    if (persist) {
      props.setcaseDecisionDetailsData(newData);
    }
  };
  const persistcaseDecisionDetailsData = () => {
    props.setcaseDecisionDetailsData(caseDecisionDetailsData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseDecisionDetailsData}
        onChange={handlecaseDecisionDetailsData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
            (props.renderType === RenderType.APPEALS &&
              location.state.formView === "DashboardView" &&
              ((location.state.stageName === "Research"&&(name !== "Check_Number")) ||
                location.state.stageName === "Redirect Review" ||
                ((location.state.stageName === "Effectuate" || location.state.stageName === "Pending Effectuate")
                  &&(name === "Check_Number")) ||
                location.state.stageName === "Resolve" || 
                location.state.stageName === "Case Completed" ||
                location.state.stageName === "Reopen" ||
                location.state.stageName === "CaseArchived"))   
          }
        persist={persistcaseDecisionDetailsData}
        schema={props.caseDecisionDetailsValidationSchema}
        errors={props.caseDecisionDetailsErrors}
      />
    </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        data={caseDecisionDetailsData}
        label={label}
        onChange={handlecaseDecisionDetailsData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          (props.renderType === RenderType.APPEALS &&
            location.state.formView === "DashboardView" &&
            ((location.state.stageName === "Research"&&(name !== "Claim_Adjustment_Date" &&
              name !== "Claim_Paid_Date" && name !== "Check_Date"
            )) ||
              location.state.stageName === "Redirect Review" ||
              ((location.state.stageName === "Effectuate"|| location.state.stageName === "Pending Effectuate")&&
              (name !== "Claim_Adjusted_Date" && name !== "Payment_Date" && name !== "Payment_Mail_Date_Postmark"
              )) ||
              location.state.stageName === "Resolve" ||
              location.state.stageName === "Case Completed" ||
              location.state.stageName === "Reopen" ||
              location.state.stageName === "CaseArchived"))   
        }
        schema={props.caseDecisionDetailsValidationSchema}
        errors={props.caseDecisionDetailsErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={caseDecisionDetailsData}
        options={options}
        onChange={handlecaseDecisionDetailsData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
            (props.renderType === RenderType.APPEALS &&
              location.state.formView === "DashboardView" &&
              (location.state.stageName === "Research"||
                location.state.stageName === "Redirect Review" ||  
                location.state.stageName === "Resolve" || 
                location.state.stageName === "Case Completed" ||
                location.state.stageName === "Reopen" ||
                location.state.stageName === "CaseArchived"))   

          }
        schema={props.caseDecisionDetailsValidationSchema}
        errors={props.caseDecisionDetailsErrors}
        
      />
    </div>
  );

  return (
    <Formik
      initialValues={props.caseDecisionDetailsData}
      validationSchema={props.caseDecisionDetailsValidationSchema}
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
                Case Decision Details
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTimelines"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-Timelines"
            >
              <div className="accordion-body">
              {/* {shouldHideFields &&(
                <> */}
                {renderElements(
                  props.caseDecisionDetailsFields,
                  renderSelectField,
                  renderInputField,
                  renderDatePicker,
                )}
                {/* </>
              )} */}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CaseDecisionDetailsAccordion;
