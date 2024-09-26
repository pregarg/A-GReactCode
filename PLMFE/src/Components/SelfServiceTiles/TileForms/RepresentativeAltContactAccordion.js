import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";

const RepresentativeAltContactAccordion = (props) => {
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
      process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const { convertToCase } = useGetDBTables();

  const [representativeAltData, setRepresentativeAltData] = useState(props.representativeAltData || {});

  const handleRepresentativeAltData = (name, value, persist) => {
    const newData = {
      ...representativeAltData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setRepresentativeAltData(newData);
    if (persist) {
      props.setRepresentativeAltData(newData);
    }
  };
  const persistRepresentativeAltDataData = () => {
    props.setRepresentativeAltData(representativeAltData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4">
        <FormikInputField
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            data={representativeAltData}
            onChange={handleRepresentativeAltData}
            displayErrors={props.shouldShowSubmitError}
            disabled={
                props.renderType === RenderType.APPEALS &&
                (location.state.formView === "DashboardView" ||
                    location.state.formView === "DashboardHomeView") &&
                ((stageName === "Start" && name !== "Acknowledgment_Timely") ||
                    location.state.stageName === "Intake" ||
                    location.state.stageName === "Acknowledge" ||
                    location.state.stageName === "Redirect Review" ||
                    location.state.stageName === "Documents Needed" ||
                    location.state.stageName === "Research" ||
                    location.state.stageName === "Effectuate" ||
                    location.state.stageName === "Pending Effectuate" ||
                    location.state.stageName === "Resolve" ||
                    location.state.stageName === "Case Completed" ||
                    location.state.stageName === "Reopen" ||
                    location.state.stageName === "CaseArchived")
            }
            persist={persistRepresentativeAltDataData}
            schema={props.representativeAltContactValidationSchema}
            errors={props.representativeAltErrors}
        />
      </div>
  );



  return (
      <Formik
          initialValues={props.representativeAltData}
          validationSchema={props.representativeAltContactValidationSchema}
          onSubmit={() => {}}
          enableReinitialize
      >
        {() => (
            <Form>
              <div className="accordion-item" id="caseTimelines">
                <h2 className="accordion-header" id="panelsStayOpen-Timelines">
                  <button
                      className="accordion-button accordionButtonStyle"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseTimelines"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseOne"
                  >
                    Representative Alternative Contact Information
                  </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseTimelines"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-Timelines"
                >
                  <div className="accordion-body">

                    {renderElements(
                        props.representativeAltFields,
                        "",
                        renderInputField,
                        "",

                    )}
                  </div>
                </div>
              </div>
            </Form>
        )}
      </Formik>
  );
};

export default RepresentativeAltContactAccordion;
