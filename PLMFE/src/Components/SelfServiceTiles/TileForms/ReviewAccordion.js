import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import {FormikDatePicker} from "../Common/FormikDatePicker";

const ReviewAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [reviewData, setReviewData] = useState(props.reviewData);
  const [invalidInputState, setInvalidInputState] = useState(false);

  const persistReviewInformationData = () => {
    props.setReviewData(reviewData);
  };

  const handleReviewRequestData = (name, value, persist) => {
    const newData = {
      ...reviewData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setReviewData({...newData});
    if (persist) {
      props.setReviewData({...newData});
    }
  };
  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={reviewData}
        onChange={handleReviewRequestData}
        disabled={   ( location.state.stageName === "Case Completed" ||
            location.state.stageName === "CaseArchived"|| location.state.stageName === "Documents Needed"
            && (name ==="Acknowledgement_Notes")) }
        persist={persistReviewInformationData}
        schema={props.reviewValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.reviewErrors}
      />
    </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
      <div className="col-xs-6 col-md-4">
        <FormikDatePicker
            name={name}
            placeholder={placeholder}
            data={reviewData}
            label={label}
            onChange={handleReviewRequestData}
            disabled={
                location.state.formView === "DashboardView" &&
                (location.state.stageName === "Redirect Review" ||
                    location.state.stageName === "Documents Needed" ||
                    location.state.stageName === "Effectuate" ||
                    location.state.stageName === "Pending Effectuate" ||
                    location.state.stageName === "Resolve" ||
                    ( location.state.stageName === "Research" ||location.state.stageName === "Pending Effectuate" ||location.state.stageName === "Effectuate" ||location.state.stageName === "Case Completed" ||
                        location.state.stageName === "Reopen" ||   location.state.stageName === "CaseArchived"|| location.state.stageName === "Documents Needed"
                && (name ==="Oral_Acknowledgement_Due_Date")) ||
                    ( location.state.stageName === "Pending Effectuate" ||location.state.stageName === "Effectuate" ||location.state.stageName === "Case Completed" ||
                        location.state.stageName === "Documents Needed" ||    location.state.stageName === "CaseArchived"
                        && (name ==="Oral_Acknowledgement_Date")) ||
                    ( location.state.stageName === "Research" ||location.state.stageName === "Pending Effectuate" ||location.state.stageName === "Effectuate" ||location.state.stageName === "Case Completed" ||
                        location.state.stageName === "Reopen" ||   location.state.stageName === "CaseArchived"|| location.state.stageName === "Documents Needed"||location.state.stageName === "Resolve"
                        && (name ==="Written_Acknowledgement_Due_Date")) ||
                    ( location.state.stageName === "Case Completed" ||
                         location.state.stageName === "CaseArchived"|| location.state.stageName === "Documents Needed"
                        && (name ==="Written_Acknowledgement_Date")) ||
                    location.state.stageName === "Case Completed" ||
                    location.state.stageName === "Reopen" ||
                    location.state.stageName === "CaseArchived")
            }
            displayErrors={props.shouldShowSubmitError}
            schema={props.reviewValidationSchema}
            errors={props.reviewErrors}
        />
      </div>
  );
  return (
    <div>
      <div className="accordion-item" id="reviewInformation">
        <h2 className="accordion-header" id="panelsStayOpen-reviewInformation">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseclaimInformation"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
            Review
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapsereviewInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-reviewInformation"
        >
          <div className="accordion-body">
            <div className="row my-2">
              {renderDatePicker(
                  "Oral_Acknowledgement_Due_Date#date",
                  "Oral Acknowledgement Due Date",
                  "Oral Acknowledgement Due Date",
              )}
              {renderDatePicker(
                  "Oral_Acknowledgement_Date#date",
                  "Oral Acknowledgement Date",
                  "Oral Acknowledgement Date",
              )}
              {renderDatePicker(
                  "Written_Acknowledgement_Due_Date#date",
                  "Written Acknowledgement Due Date",
                  "Written Acknowledgement Due Date",
              )}

            </div>
            <div className="row my-2">
              {renderDatePicker(
                  "Written_Acknowledgement_Date#date",
                  "Written Acknowledgement Date",
                  "Written Acknowledgement Date",
              )}

              {renderInputField("Acknowledgement_Notes", "Acknowledgement Notes", 2000)}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewAccordion;
