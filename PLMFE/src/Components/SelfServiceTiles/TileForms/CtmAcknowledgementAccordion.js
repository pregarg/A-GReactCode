import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import { FormikDatePicker } from "../Common/FormikDatePicker";


const CtmAcknowledgementAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [acknowledgementData, setAcknowledgementData] = useState(props.acknowledgementData);

  const persistAcknowledgementData = () => {
    props.setAcknowledgementData(acknowledgementData);
  };

  const handleAcknowledgementChange = (name, value, persist) => {
    const newData = {
      ...acknowledgementData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setAcknowledgementData({ ...newData });
    if (persist) {
      props.setAcknowledgementData({ ...newData });
    }
  };

  const renderInputField = (name, placeholder, maxLength, type = "text") => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        type={type}
        data={acknowledgementData}
        onChange={handleAcknowledgementChange}
        disabled={location.state.stageName === "CaseArchived"}
        persist={persistAcknowledgementData}
        schema={props.acknowledgementValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.acknowledgementErrors}
      />
    </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
      <div className="col-xs-6 col-md-4">
        <FormikDatePicker
          name={name}
          placeholder={placeholder}
          data={acknowledgementData}
          label={label}
          onChange={handleAcknowledgementChange}
          displayErrors={props.shouldShowSubmitError}
          schema={props.acknowledgementValidationSchema}
          errors={props.acknowledgementErrors}
        />
      </div>
    );

  return (
    <div>
      <div className="accordion-item" id="acknowledgementInformation">
        <h2 className="accordion-header" id="panelsStayOpen-acknowledgementInformation">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseacknowledgementInformation"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseacknowledgementInformation"
          >
            Acknowledgement
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseacknowledgementInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-acknowledgementInformation"
        >
          <div className="accordion-body">
            <div className="row my-2">
              {renderDatePicker("Acknowledgement_Due_Date", "Acknowledgement Due Date", "Acknowledgement Due Date")}
              {renderDatePicker("Acknowledgement_Date", "Acknowledgement Date", "Acknowledgement  Date")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtmAcknowledgementAccordion;
