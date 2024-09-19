import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";

const CaseDecisionAccordion = (props) => {
  const location = useLocation();

  const { convertToCase } = useGetDBTables();
  const [caseDecisionData, setcaseDecisionData] = useState(
    props.caseDecisionData || {},
  );

  const handlecaseDecisionData = (name, value, persist) => {
    const newData = {
      ...caseDecisionData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setcaseDecisionData(newData);
    if (persist) {
      props.setcaseDecisionData(newData);
    }
  };
  const persistcaseDecisionData = () => {
    props.setcaseDecisionData(caseDecisionData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseDecisionData}
        onChange={handlecaseDecisionData}
        displayErrors={props.shouldShowSubmitError}
        persist={persistcaseDecisionData}
        schema={props.caseDecisionValidationSchema}
        errors={props.caseDecisionErrors}
      />
    </div>
  );

  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={caseDecisionData}
        options={options}
        onChange={handlecaseDecisionData}
        displayErrors={props.shouldShowSubmitError}
        schema={props.caseDecisionValidationSchema}
        errors={props.caseDecisionErrors}
        
      />
    </div>
  );

  return (
    <Formik
      initialValues={props.caseDecisionData}
      validationSchema={props.caseDecisionValidationSchema}
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
                Case Decision 
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTimelines"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-Timelines"
            >
              <div className="accordion-body">

                {renderElements(
                  props.caseDecisionFields,
                  renderSelectField,
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

export default CaseDecisionAccordion;
