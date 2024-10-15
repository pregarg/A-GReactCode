import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";

const ProviderNotesAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [providerNotesData, setProviderNotesData] = useState(props.providerNotesData);
  const [invalidInputState, setInvalidInputState] = useState(false);

  const persistProviderNotesInformationData = () => {
    props.setProviderNotesData(providerNotesData);
  };

  const handleProviderNotesRequestData = (name, value, persist) => {
    const newData = {
      ...providerNotesData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setProviderNotesData({...newData});
    if (persist) {
      props.setProviderNotesData({...newData});
    }
  };
  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4">
        <FormikInputField
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            data={providerNotesData}
            onChange={handleProviderNotesRequestData}
            disabled={location.state.stageName === "CaseArchived"}
            persist={persistProviderNotesInformationData}
            schema={props.providerNotesValidationSchema}
            displayErrors={props.shouldShowSubmitError}
            errors={props.providerNotesErrors}
        />
      </div>
  );

  return (
      <div>
        <div className="accordion-item" id="providerNotesInformation">
          <h2 className="accordion-header" id="panelsStayOpen-providerNotesInformation">
            <button
                className="accordion-button accordionButtonStyle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseclaimInformation"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
            >
              Notes
            </button>
          </h2>
          <div
              id="panelsStayOpen-collapsenotesInformation"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-providerNotesInformation"
          >
            <div className="accordion-body">
              <div className="row my-2">
                {renderInputField("Provider_Case_Notes", "Case Notes", 4000)}
                {renderInputField("Provider_Internal_Notes", "Internal Notes", 4000)}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default ProviderNotesAccordion;
