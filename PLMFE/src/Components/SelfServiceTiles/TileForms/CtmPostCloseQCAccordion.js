
import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { useLocation } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const CtmPostCloseQC = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [postCloseQCData, setPostCloseQCData] = useState(props.postCloseQCData || {});
  const [modalContent, setModalContent] = useState("");
  const [showModal, setShowModal] = useState(false);

  const persistPostCloseQCData = () => {
    try {
      if (typeof props.setPostCloseQCData === "function") {
        props.setPostCloseQCData(postCloseQCData);
      } else {
        console.warn("setPostCloseQCData is not a function.");
      }
    } catch (error) {
      console.error("Error in persistPostCloseQCData:", error);
    }
  };

  const handlePostCloseQCData = (name, value, persist) => {
    const newData = {
      ...postCloseQCData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setPostCloseQCData({ ...newData });
    if (persist) {
      props.setPostCloseQCData({ ...newData });
    }
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={postCloseQCData}
        onChange={handlePostCloseQCData}
        persist={persistPostCloseQCData}
        schema={props.postCloseQCValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.postCloseQCErrors}
      />
      {name.includes("Comments") || name === "QC_Rebuttal_Notes" ? (
        <Button
          variant="link"
          onClick={() => handlePreview(postCloseQCData[name])}
          disabled={!postCloseQCData[name]}
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
        data={postCloseQCData}
        label={label}
        onChange={handlePostCloseQCData}
        persist={persistPostCloseQCData}
        schema={props.postCloseQCValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.postCloseQCErrors}
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
        data={postCloseQCData}
        onChange={handlePostCloseQCData}
        persist={persistPostCloseQCData}
        schema={props.postCloseQCValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.postCloseQCErrors}
      />
    </div>
  );

  const handlePreview = (content) => {
    setModalContent(content);
    setShowModal(true);
  };

  return (
    <div>
      <div className="accordion-item" id="postCloseQC">
        <h2 className="accordion-header" id="panelsStayOpen-postCloseQC">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapsePostCloseQC"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapsePostCloseQC"
          >
            Post-Close QC
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapsePostCloseQC"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-postCloseQC"
        >
          <div className="accordion-body">
            <div className="sub-title">Integrated Post-Close Quality Check - The Path to Better</div>
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
              {renderDatePicker("QC_Due_Date", "QC Due Date", "QC Due Date")}
              {renderSelectField("QC_Decision", "QC Decision", [
                { value: "Accept", label: "Accept" },
                { value: "Reject", label: "Reject" }
              ])}
            </div>
            <div className="row my-2">
                          {renderDatePicker("QC_Decision_Date", "QC Decision Date","QC Decision Date")}
                          {renderInputField("QC_Notes", "QC Notes", 4000)}
                          {renderInputField("QC_Score", "QC Score", 5)}
                        </div>
            <div className="sub-title">QC Review Notes</div>
            <div className="row my-2">
              {renderInputField("First_Review_Comments", "1st Review Comments", 4000)}
              {renderInputField("Second_Review_Comments", "2nd Review Comments", 4000)}
              {renderInputField("QC_Rebuttal_Notes", "QC Rebuttal Notes", 4000)}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for Preview */}
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

export default CtmPostCloseQC;
