import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";


const CtmCommunicationCareAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [ctmCommunicationCareData, setCtmCommunicationCareData] = useState(props.ctmCommunicationCareData);

  const persistCtmCommunicationCareData = () => {
    props.setCtmCommunicationCareData(ctmCommunicationCareData);
  };

  const handleCtmCommunicationCareChange = (name, value, persist) => {
    const newData = {
      ...ctmCommunicationCareData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setCtmCommunicationCareData({ ...newData });
    if (persist) {
      props.setCtmCommunicationCareData({ ...newData });
    }
  };

  const renderInputField = (name, placeholder, maxLength, type = "text") => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        type={type}
        data={ctmCommunicationCareData}
        onChange={handleCtmCommunicationCareChange}
//        disabled={location.state.stageName === "CaseArchived"}
        persist={persistCtmCommunicationCareData}
        schema={props.ctmCommunicationCareValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.ctmCommunicationCareErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
      <div className="col-xs-6 col-md-4">
        <FormikSelectField
          name={name}
          placeholder={placeholder}
          options={Array.isArray(options)
            ? options.map(opt => (typeof opt === "string" ? { value: opt, label: opt } : opt))
            : []}
          data={ctmCommunicationCareData}
          onChange={handleCtmCommunicationCareChange}
          persist={persistCtmCommunicationCareData}
          schema={props.ctmCommunicationCareValidationSchema}
          displayErrors={props.shouldShowSubmitError}
          errors={props.ctmCommunicationCareErrors}
        />
      </div>
    );

  return (
    <div>
      <div className="accordion-item" id="ctmNotesInformation">
        <h2 className="accordion-header" id="panelsStayOpen-ctmCommunicationCareInformation">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapsectmCommunicationCareInformation"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapsectmCommunicationCareInformation"
          >
            Communications that Care
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseCommunicationCareInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-CommunicationCareInformation"
        >
          <div className="accordion-body">
          <div className="sub-title">Letter Clause</div>
            <div className="row my-2">
              {renderInputField("Resolution_Letter_Preview", "Resolution Letter Preview",4000)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtmCommunicationCareAccordion;
