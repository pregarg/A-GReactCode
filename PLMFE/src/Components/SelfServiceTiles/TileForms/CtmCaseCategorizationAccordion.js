import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { Formik, Form } from "formik";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements } from './Constants';
import "./Appeals.css";
import { CTM_DATA } from "../../../data/ctmData";

const CtmCaseCategorizationAccordion = (props) => {

const ctmConfigData = JSON.parse(process.env.REACT_APP_CTMHEADER_DETAILS);
  const stageName = ctmConfigData["StageName"];

  const location = useLocation();
  const [caseCategorizationData, setCaseCategorizationData] = useState(props.caseCategorizationData || {});
  const kvMapper = (e) => ({
    label: e,
    value: e,
  });
  const handleCaseCategorizationData = (name, value, persist) => {
    if(name === "Category") {

      const subCategoryField = props.caseCategorizationFields.find(field => field.name === 'Sub_Category');
      const ctmData = CTM_DATA[value];
      if(ctmData) {
        subCategoryField['values'] = Object.keys(ctmData).map(kvMapper)
        props.setCaseCategorizationFields([...props.caseCategorizationFields])

      }
    const newData = {
      ...caseCategorizationData,
      Category: value,
      Sub_Category: '',
      Super_Category: ''
    };
    setCaseCategorizationData({...newData});
    props.setCaseCategorizationData(newData);
    }
    else if(name === "Sub_Category") {
      const subCategoryField = props.caseCategorizationFields.find(field => field.name === 'Super_Category');
      const ctmData = CTM_DATA[caseCategorizationData.Category][value];
      if(ctmData) {
        subCategoryField['values'] = Object.values(ctmData).map(kvMapper)
        props.setCaseCategorizationFields([...props.caseCategorizationFields])
      }
      const newData = {
        ...caseCategorizationData,
        Sub_Category: value,
        Super_Category: ''
      };
      setCaseCategorizationData({...newData});
      props.setCaseCategorizationData(newData);
    
    } else {
      const newData = {
        ...caseCategorizationData,
        [name]: value,
      };
      setCaseCategorizationData(newData);
      if (persist) {
        props.setCaseCategorizationData(newData);
      }
    }
   
  };

  const persistCaseCategorizationData = () => {
    props.setCaseCategorizationData(caseCategorizationData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseCategorizationData || {}}
        onChange={handleCaseCategorizationData}
        displayErrors={props.shouldShowSubmitError}
        persist={persistCaseCategorizationData}
        schema={props.caseCategorizationValidationSchema}
        errors={props.caseCategorizationErrors}
      />
    </div>
  );


 const renderSelectField = (name, placeholder, options) => (
   <div className="col-xs-6 col-md-4">
     <FormikSelectField
       name={name}
       placeholder={placeholder}
       data={caseCategorizationData || {}}
       options={options}
       onChange={handleCaseCategorizationData}
       displayErrors={props.shouldShowSubmitError}
       disabled={
           location.state.formView === "DashboardView" &&
           (
               location.state.stageName === "Case Completed" ||
               location.state.stageName === "Case Archived")


       }

       schema={props.caseCategorizationValidationSchema}
       errors={props.caseCategorizationErrors}
     />
   </div>
 );

  return (
    <Formik
      initialValues={props.caseCategorizationData}
      validationSchema={null}
      onSubmit={() => {}}
      enableReinitialize
    >
      {() => (
        <Form>
          <div className="accordion-item" id="caseCategorizationAccordion">
            <h2 className="accordion-header" id="panelsStayOpen-CategorizationAccordion">
              <button
                className="accordion-button accordionButtonStyle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseCategorizationAccordion"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseCategorizationAccordion"
              >
                Case Categorization
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseCategorizationAccordion"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-CategorizationAccordion"
            >
              <div className="accordion-body">
                {renderElements(
                  props.caseCategorizationFields,
                  renderSelectField,
                  renderInputField,
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

export default CtmCaseCategorizationAccordion;
