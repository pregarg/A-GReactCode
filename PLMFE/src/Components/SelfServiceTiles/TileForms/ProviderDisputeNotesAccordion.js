import React, {useEffect, useState} from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import {useAxios} from "../../../api/axios.hook";
import {useSelector} from "react-redux";


const NotesAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  let location = useLocation();
  const { customAxios: axios } = useAxios();
  const token = useSelector((state) => state.auth.token);
  const [notesData, setNotesData] = useState(props.notesData);
  const [invalidInputState, setInvalidInputState] = useState(false);
  useEffect(() => {
    setInvalidInputState(
        location.state.formView === "DashboardView" &&
        (location.state.stageName === "Redirect Review" ||
            location.state.stageName === "Documents Needed" ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            location.state.stageName === "Reopen" ||
            location.state.stageName === "CaseArchived"),
    );
  }, [location]);

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
            disabled={invalidInputState}
            persist={persistNotesInformationData}
            schema={props.notesValidationSchema}
            displayErrors={props.shouldShowSubmitError}
            errors={props.notesErrors}
        />
      </div>
  );
  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });


  }, []);
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
              {renderInputField("Provider_Internal_Notes", "Internal Notes", 4000)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesAccordion;
