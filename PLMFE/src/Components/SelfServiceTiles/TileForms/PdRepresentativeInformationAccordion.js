import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form ,Field } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";

const PdRepresentativeInformationAccordion = (props) => {
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
      process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const { convertToCase } = useGetDBTables();

  const [representativeInformationData, setRepresentativeInformationData] = useState({
    ...props.representativeInformationData || {}, 
    isChecked: props.representativeInformationData.isChecked ?? 0, // Initialize as 0 if unchecked or null
    });

  const handleRepresentativeInformationData = (name, value, persist) => {
    const newData = {
      ...representativeInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setRepresentativeInformationData(newData);
    if (persist) {
      props.setRepresentativeInformationData(newData);
    }
  };
  const persistRepresentativeInformationDataData = () => {
    props.setRepresentativeInformationData(representativeInformationData);
  };

  const handleCheckBoxChangeNew = (e) => {
    const isCheckedValue = e.target.checked ? 1 : 0;
    handleRepresentativeInformationData("isChecked", isCheckedValue, true); // Set 1 if checked, 0 if unchecked
  };

  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4">
        <FormikInputField
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            data={representativeInformationData}
            onChange={handleRepresentativeInformationData}
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
            persist={persistRepresentativeInformationDataData}
            schema={props.representativeInformationValidationSchema}
            errors={props.representativeInformationErrors}
        />
      </div>
  );
  const renderSelectField = (name, placeholder, options) => (
      <div className="col-xs-6 col-md-4">
        <FormikSelectField
            name={name}
            placeholder={placeholder}
            data={representativeInformationData}
            options={options}
            onChange={handleRepresentativeInformationData}
            displayErrors={props.shouldShowSubmitError}
            disabled={
                props.renderType === RenderType.APPEALS &&
                location.state.formView === "DashboardView" &&
                (location.state.stageName === "Redirect Review" ||
                    location.state.stageName === "Documents Needed" ||
                    location.state.stageName === "Effectuate" ||
                    location.state.stageName === "Pending Effectuate" ||
                    location.state.stageName === "Resolve" ||
                    location.state.stageName === "Case Completed" ||
                    location.state.stageName === "Reopen" ||
                    location.state.stageName === "CaseArchived")
            }
            schema={props.representativeInformationValidationSchema}
            errors={props.representativeInformationErrors}
        />
      </div>
  );

  const renderDatePicker = (name, placeholder, label) => (
      <div className="col-xs-6 col-md-4">
        <FormikDatePicker
            name={name}
            placeholder={placeholder}
            data={representativeInformationData}
            label={label}
            onChange={handleRepresentativeInformationData}
            disabled={
                location.state.formView === "DashboardView" &&
                (location.state.stageName === "Redirect Review" ||
                    location.state.stageName === "Documents Needed" ||
                    location.state.stageName === "Effectuate" ||
                    location.state.stageName === "Pending Effectuate" ||
                    location.state.stageName === "Resolve" ||
                    location.state.stageName === "Case Completed" ||
                    location.state.stageName === "Reopen" ||
                    location.state.stageName === "CaseArchived")
            }
            displayErrors={props.shouldShowSubmitError}
            schema={props.representativeInformationValidationSchema}
            errors={props.representativeInformationErrors}
        />
      </div>
  );
  return (
      <Formik
          initialValues={props.representativeInformationData}
          validationSchema={props.representativeInformationValidationSchema}
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
                    Representative Information
                  </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseTimelines"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-Timelines"
                >
                  <div className="accordion-body">
                    {/*<div className="form-check">*/}
                    {/*  <Field*/}
                    {/*      type="checkbox"*/}
                    {/*      name="white_glove"*/}
                    {/*      className="form-check-input"*/}
                    {/*      checked={representativeInformationData.white_glove === 1}*/}
                    {/*      onChange={(e) =>*/}
                    {/*          handleRepresentativeInformationData("white_glove", e.target.checked ? 1 : 0, true)*/}
                    {/*      }*/}
                    {/*  />*/}
                    {/*  <label className="form-check-label" htmlFor="white_glove">*/}
                    {/*    White Glove*/}
                    {/*  </label>*/}
                    {/*</div>*/}

                    <div className="row my-2">
                      <div className="col-md-3 text-start">
                        <label>
                          <input
                              type="checkbox"
                              checked={representativeInformationData.isChecked == 1}  // 1 for checked, 0 for unchecked
                            onChange={handleCheckBoxChangeNew}  // Handle change
                          />  White Glove
                         
                        </label>
                      </div>
                    </div>
                    {renderElements(
                        props.representativeInformationFields,
                        renderSelectField,
                        renderInputField,
                        renderDatePicker,
                        ""
                    )}
                  </div>
                </div>
              </div>
            </Form>
        )}
      </Formik>
  );
};

export default PdRepresentativeInformationAccordion;
