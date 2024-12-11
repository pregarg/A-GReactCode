import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import {FormikSelectField} from "../Common/FormikSelectField";

const CaseResolutionAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [caseResolutionData, setCaseResolutionData] = useState(props.caseResolutionData);
  const [invalidInputState, setInvalidInputState] = useState(false);

  const persistCaseResolutionInformationData = () => {
    props.setCaseResolutionData(caseResolutionData);
  };

  const handleCaseResolutionRequestData = (name, value, persist) => {
    const newData = {
      ...caseResolutionData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setCaseResolutionData({...newData});
    if (persist) {
      props.setCaseResolutionData({...newData});
    }
  };
  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseResolutionData}
        onChange={handleCaseResolutionRequestData}
        disabled={
            location.state.formView === "DashboardView" &&
            (
                location.state.stageName === "Case Completed" ||
                location.state.stageName === "Case Archived")


        }
        persist={persistCaseResolutionInformationData}
        schema={props.caseResolutionValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.caseResolutionErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
      <div className="col-xs-6 col-md-4">
        <FormikSelectField
            name={name}
            placeholder={placeholder}
            data={caseResolutionData}
            options={options}
            onChange={handleCaseResolutionRequestData}
            displayErrors={props.shouldShowSubmitError}
            disabled={
                location.state.formView === "DashboardView" &&
                (
                    location.state.stageName === "Case Completed" ||
                    location.state.stageName === "Case Archived")


            }
            schema={props.caseResolutionValidationSchema}
            errors={props.caseResolutionErrors}
        />
      </div>
  );


  return (
    <div>
      <div className="accordion-item" id="caseResolutionInformation">
        <h2 className="accordion-header" id="panelsStayOpen-caseResolutionInformation">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapsecaseResolutionInformation"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
            Case Resolution
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapsecaseResolutionInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-caseResolutionInformation"
        >
          <div className="accordion-body">
            <div className="row my-2">
              {renderSelectField(
                  "Letter_Clause",
                  "Letter Clause ",
              )}
              {renderInputField("Resolution_Communication_text_to_Complainant", "Resolution Communication text to Complainant", 4000)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseResolutionAccordion;
