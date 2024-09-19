import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";

const NotesAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [notesData, setNotesData] = useState(props.notesData);
  const [invalidInputState, setInvalidInputState] = useState(false);

  const persistNotesInformationData = () => {
    props.setNotesData(notesData);
  };

  const handleNotesRequestData = (name, value, persist) => {
    const newData = {
      ...notesData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setNotesData(newData);
    if (persist) {
      props.setNotesData(newData);
    }
  };
  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={notesData}
        onChange={handleNotesRequestData}
        disabled={location.state.stageName === "CaseArchived"}
        persist={persistNotesInformationData}
        schema={props.notesValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.notesErrors}
      />
    </div>
  );

  return (
    <div>
      <div className="accordion-item" id="notesInformation">
        <h2 className="accordion-header" id="panelsStayOpen-notesInformation">
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
          aria-labelledby="panelsStayOpen-notesInformation"
        >
          <div className="accordion-body">
            <div className="row my-2">
              {renderInputField("Provider_Case_Notes", "Case Notes", 4000)}
              {renderInputField("Internal_Notes", "Internal Notes", 4000)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesAccordion;
