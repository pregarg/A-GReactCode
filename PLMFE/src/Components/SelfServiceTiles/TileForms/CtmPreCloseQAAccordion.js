import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CtmPreCloseQAAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [preCloseQAData, setPreCloseQAData] = useState(props.preCloseQAData || {});
const [modalContent, setModalContent] = useState("");
  const [showModal, setShowModal] = useState(false);

  const persistPreCloseQAData = () => {
    try {
      if (typeof props.setPreCloseQAData === "function") {
        props.setPreCloseQAData(preCloseQAData);
      } else {
        console.warn("setPreCloseQAData is not a function.");
      }
    } catch (error) {
      console.error("Error in persistPreCloseQAData:", error);
    }
  };


  const handlePreCloseQAData = (name, value, persist) => {
    const newData = {
      ...preCloseQAData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setPreCloseQAData({ ...newData });
    if (persist) {
      props.setPreCloseQAData({ ...newData });
    }
  };
const handlePreview = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={preCloseQAData}
        onChange={handlePreCloseQAData}
        persist={persistPreCloseQAData}
        schema={props.preCloseQAValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.preCloseQAErrors}
      />
      {name.includes("Comments") || name === "QC_Rebuttal_Notes" ? (
              <Button
                variant="link"
                onClick={() => handlePreview(preCloseQAData[name])}
                disabled={!preCloseQAData[name]}
              >
                Preview
              </Button>
            ) : null}
    </div>
  );
const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        data={preCloseQAData}
        label={label}
        onChange={handlePreCloseQAData}
        persist={persistPreCloseQAData}
         schema={props.preCloseQAValidationSchema}
         displayErrors={props.shouldShowSubmitError}
         errors={props.preCloseQAErrors}

      />
    </div>
  );


  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4 mb-3">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        options={Array.isArray(options)
          ? options.map(opt => (typeof opt === "string" ? { value: opt, label: opt } : opt))
          : []}
        data={preCloseQAData}
        onChange={handlePreCloseQAData}
        persist={persistPreCloseQAData}
        schema={props.preCloseQAValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.preCloseQAErrors}
      />
    </div>
  );


  return (
    <div>
      <div className="accordion-item" id="preCloseQA">
        <h2 className="accordion-header" id="panelsStayOpen-preCloseQA">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapsePreCloseQA"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapsePreCloseQA"
          >
            Pre-Close QA
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapsePreCloseQA"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-preCloseQA"
        >
          <div className="accordion-body">
            <div className="sub-title">Integrated Pre-Close Quality Assurance - The Path to Better</div>
            <div className="row my-2">
              {renderInputField("Auditor_Name", "Auditor Name", 50)}
              {renderInputField("Coordinator_Name", "Coordinator Name", 50)}
              {renderSelectField("Review_Level", "Review Level", [
                { value: "1st", label: "1st" },
                { value: "2nd", label: "2nd" }
              ])}

            </div>
            <div className="row my-2">
              {renderInputField("Coordinator_Supervisor_Name", "Coordinator Supervisor Name", 50)}
              {renderDatePicker("QA_Due_Date", "QA Due Date","QA Due Date")}
              {renderSelectField("QA_Decision", "QA Decision", [
                { value: "Accept", label: "Accept" },
                { value: "Reject", label: "Reject" }
              ])}
            </div>
            <div className="row my-2">
              {renderDatePicker("QA_Decision_Date", "QA Decision Date","QA Decision Date")}
              {renderInputField("QA_Notes", "QA Notes", 4000)}
              {renderInputField("QA_Score", "QA Score", 5)}
            </div>
            <div className="row my-2">
              {renderDatePicker("First_Review_Date", "First Review Date","First Review Date")}

              {renderDatePicker("Second_Review_Date", "Secound Review Date","Secound Review Date")}
              {renderDatePicker("QC_Rebuttal_Date", "QC Rebuttal Date", "QC Rebuttal Date")}
            </div>

            <div className="sub-title">QA Review Notes</div>
            <div className="row my-2">
              {renderInputField("First_Review_Comments", "1st Review Comments", 4000)}
              {renderInputField("Second_Review_Comments", "2nd Review Comments", 4000)}
              {renderInputField("QC_Rebuttal_Notes", "QC Rebuttal Notes", 4000)}
            </div>

          </div>
        </div>
      </div>
       <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
              <Modal.Header closeButton>
                <Modal.Title>Preview Note</Modal.Title>
              </Modal.Header>
              <Modal.Body>{modalContent}</Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
              </Modal.Footer>
            </Modal>
    </div>

  );
};

export default CtmPreCloseQAAccordion;
