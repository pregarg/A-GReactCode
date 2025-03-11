
import React, { useState, useEffect } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikSelectField } from "../Common/FormikSelectField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { useLocation } from "react-router-dom";

const CaseResolutionAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();

  const defaultData = {
    Resolution_Date: "",
    Resolution_Due_Date: "",
    Out_of_Compliance_Notes: "",
    Letter_Clause: "",
    Resolution_Communication_text_to_Complainant: "",
  };

  const [caseResolutionData, setCaseResolutionData] = useState(props.caseResolutionData || defaultData);
  const processType = props.processType || "pd"; // Default to "pd" if undefined

  useEffect(() => {
    setCaseResolutionData({ ...defaultData, ...props.caseResolutionData });
  }, [props.caseResolutionData]);

  const persistCaseResolutionInformationData = () => {
    props.setCaseResolutionData(caseResolutionData);
  };

  const handleCaseResolutionRequestData = (name, value, persist) => {
    const newData = {
      ...caseResolutionData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setCaseResolutionData({ ...newData });
    if (persist) {
      props.setCaseResolutionData({ ...newData });
    }
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseResolutionData || {}}
        onChange={handleCaseResolutionRequestData}
        disabled={props.isDisabled}
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
        data={caseResolutionData || {}}
        options={options}
        onChange={handleCaseResolutionRequestData}
        disabled={props.isDisabled}
        persist={persistCaseResolutionInformationData}
        schema={props.caseResolutionValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.caseResolutionErrors}
      />
    </div>
  );

  const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        label={label}
        data={caseResolutionData || {}}
        onChange={handleCaseResolutionRequestData}
        displayErrors={props.shouldShowSubmitError}
        schema={props.caseResolutionValidationSchema}
        errors={props.caseResolutionErrors}
      />
    </div>
  );

  const renderCTMFields = () => (
    <>
      {renderDatePicker("Resolution_Date", "Resolution Date", "Resolution Date")}
      {renderDatePicker("Resolution_Due_Date", "Resolution Due Date", "Resolution Due Date")}
      {renderInputField("Out_of_Compliance_Notes", "Out of Compliance Notes", 4000)}
    </>
  );

  const renderPDFields = () => (
    <>
      {renderSelectField("Letter_Clause", "Letter Clause", [
        { label: "Denied for timely filing", value: "Denied for timely filing" },
        { label: "Incomplete information", value: "Incomplete information" },
        { label: "Incorrect code submitted", value: "Incorrect code submitted" },
        { label: "Billed with inappropriate place of service", value: "Billed with inappropriate place of service" },
        { label: "Claim already paid", value: "Claim already paid" },
        { label: "Claim appears to have been altered. Resubmit an original claim", value: "Claim appears to have been altered. Resubmit an original claim" },
      ])}
      {renderInputField("Resolution_Communication_text_to_Complainant", "Resolution Communication text to Complainant", 4000)}
    </>
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
              {processType === "ctm" && renderCTMFields()}
              {processType === "pd" && renderPDFields()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseResolutionAccordion;