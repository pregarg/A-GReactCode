import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";

const NotesAccordion = (props) => {
  const { convertToCase } = useGetDBTables();

  const [notesData, setNotesData] = useState(props.notesData);

  const location = useLocation();
  console.log("casenotess12334", location);

  const [invalidInputState, setInvalidInputState] = useState(false);

  const persistNotesInformationData = () => {
    props.setNotesData(notesData);
  };

  const handleNotesRequestData = (name, value,persist) => {
    console.log("notesdataaaa", name, "+", value)
    const newData = {
      ...notesData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setNotesData(newData);
    if (persist) {
      props.setNotesData(newData);
    }
  };
  // const InputField = (name, placeholder, maxLength) => {
  //   return (
  //     <>
  //       <Field name={name}>
  //         {({ field, meta }) => (
  //           <div className="form-floating">
  //             <input
  //               maxLength={maxLength}
  //               type="text"
  //               id={name}
  //               autoComplete="off"
  //               className={`form-control ${
  //                 meta.error ? "is-invalid" : field.value ? "is-valid" : ""
  //               }`}
  //               placeholder={wrapPlaceholder(name, placeholder)}
  //               onChange={(event) =>
  //                 handleExpeditedRequestData(name, event.target.value)
  //               }
  //               onBlur={persistExpeditedRequestData}
  //               value={expeditedRequestData[name]}
  //               disabled={invalidInputState}
  //             />
  //             <label htmlFor="floatingInputGrid">
  //               {wrapPlaceholder(name, placeholder)}
  //             </label>
  //             {meta.error && (
  //               <div className="invalid-feedback" style={{ display: "block" }}>
  //                 {meta.error}
  //               </div>
  //             )}
  //           </div>
  //         )}
  //       </Field>
  //     </>
  //   );
  // };
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
        schema={""}
        displayErrors={""}
        errors={""}
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
              {renderInputField("Case_Notes", "Case Notes", 4000)}
              {renderInputField("Internal_Notes", "Internal Notes", 4000)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotesAccordion;
