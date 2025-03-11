import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import { FormikDatePicker } from "../Common/FormikDatePicker";

const CtmCaseResolutionAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [ctmCaseResolutionData, setCtmCaseResolutionData] = useState(props.ctmCaseResolutionData);
  const [invalidInputState, setInvalidInputState] = useState(false);
  const persistCtmCaseResolutionInformationData = () => {
    props.setCtmCaseResolutionData(ctmCaseResolutionData);
  };

  const handleCtmCaseResolutionRequestData = (name, value, persist) => {
    const newData = {
      ...ctmCaseResolutionData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setCtmCaseResolutionData({...newData});
    if (persist) {
      props.setCtmCaseResolutionData({...newData});
    }
  };
  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4">
        <FormikInputField
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            data={ctmCaseResolutionData}
            onChange={handleCtmCaseResolutionRequestData}
            disabled={
                location.state.formView === "DashboardView" &&
                (
                    location.state.stageName === "Intake" ||
                    location.state.stageName === "Acknowledge")


            }
            persist={persistCtmCaseResolutionInformationData}
            schema={props.ctmCaseResolutionValidationSchema}
            displayErrors={props.shouldShowSubmitError}
            errors={props.ctmCaseResolutionErrors}
        />
      </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
      <div className="col-xs-6 col-md-4">
        <FormikDatePicker
          name={name}
          placeholder={placeholder}
          label={label}
          data={ctmCaseResolutionData || {}}
          disabled={
                          location.state.formView === "DashboardView" &&
                          (
                              location.state.stageName === "Intake" ||
                              location.state.stageName === "Acknowledge")


                      }
          onChange={handleCtmCaseResolutionRequestData}
          displayErrors={props.shouldShowSubmitError}
          schema={props.ctmCaseResolutionValidationSchema}
          errors={props.ctmCaseResolutionErrors}
        />
      </div>
    );

  return (
      <div>
        <div className="accordion-item" id="ctmCaseResolutionInformation">
          <h2 className="accordion-header" id="panelsStayOpen-ctmCaseResolutionInformation">
            <button
                className="accordion-button accordionButtonStyle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseclaimInformation"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
            >
              Case Resolution
            </button>
          </h2>
          <div
              id="panelsStayOpen-collapsectmCaseResolutionInformation"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-ctmCaseResolutionInformation"
          >
            <div className="accordion-body">
              <div className="row my-2">
                {renderDatePicker("Resolution_Date", "Resolution Date", "Resolution Date")}
                {renderDatePicker("Resolution_Due_Date", "Resolution Due Date", "Resolution Due Date")}
                {renderInputField("Out_of_Compliance_Notes", "Out of Compliance Notes", 4000)}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CtmCaseResolutionAccordion;
