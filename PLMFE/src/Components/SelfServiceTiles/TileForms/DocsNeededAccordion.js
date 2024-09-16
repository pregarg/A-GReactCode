import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";

const DocsNeededAccordion = (props) => {
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const { convertToCase } = useGetDBTables();
  const [docsNeededData, setdocsNeededData] = useState(
    props.docsNeededData || {},
  );

  const handledocsNeededData = (name, value, persist) => {
    const newData = {
      ...docsNeededData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setdocsNeededData(newData);
    if (persist) {
      props.setdocsNeededData(newData);
    }
  };
  const persistdocsNeededData = () => {
    props.setdocsNeededData(docsNeededData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={docsNeededData}
        onChange={handledocsNeededData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
            (props.renderType === RenderType.APPEALS &&
              location.state.formView === "DashboardView" &&
              (location.state.stageName === "Redirect Review" ||
                location.state.stageName === "Effectuate" ||
                location.state.stageName === "Pending Effectuate" ||   
                location.state.stageName === "Case Completed" ||
                location.state.stageName === "CaseArchived"))   
          }
        persist={persistdocsNeededData}
        schema={props.docsNeededValidationSchema}
        errors={props.docsNeededErrors}
      />
    </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        data={docsNeededData}
        label={label}
        onChange={handledocsNeededData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          (props.renderType === RenderType.APPEALS &&
            location.state.formView === "DashboardView" &&
            (location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Effectuate" ||
              location.state.stageName === "Pending Effectuate" ||   
              location.state.stageName === "Case Completed" ||
              location.state.stageName === "CaseArchived"))   
        }
        schema={props.docsNeededValidationSchema}
        errors={props.docsNeededErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={docsNeededData}
        options={options}
        onChange={handledocsNeededData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
            (props.renderType === RenderType.APPEALS &&
              location.state.formView === "DashboardView" &&
              (location.state.stageName === "Redirect Review" ||
                location.state.stageName === "Effectuate" ||
                location.state.stageName === "Pending Effectuate" ||   
                location.state.stageName === "Case Completed" ||
                location.state.stageName === "CaseArchived"))   
          }
        schema={props.docsNeededValidationSchema}
        errors={props.docsNeededErrors}
      />
    </div>
  );

  return (
    <Formik
      initialValues={props.docsNeededData}
      validationSchema={props.docsNeededValidationSchema}
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
                Docments Needed
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTimelines"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-Timelines"
            >
              <div className="accordion-body">
                {renderElements(
                  props.docsNeededFields,
                  renderSelectField,
                  renderInputField,
                  renderDatePicker,
                )}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default DocsNeededAccordion;
