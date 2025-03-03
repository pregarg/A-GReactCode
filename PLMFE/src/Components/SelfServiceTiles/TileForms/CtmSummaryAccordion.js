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
import { CTM_DATA } from "../../../data/ctmData";

const CtmSummaryAccordion = (props) => {
 const location = useLocation();

 const ctmConfigData = JSON.parse(process.env.REACT_APP_CTMHEADER_DETAILS);
  const stageName = ctmConfigData["StageName"];


 const { convertToCase } = useGetDBTables();

 const [ctmSummaryData, setCtmSummaryData] = useState(props.ctmSummaryData || {});

const kvMapper = (e) => ({
    label: e,
    value: e,
  });

  const handleCtmSummaryData = (name, value, persist) => {
    if(name === "Complaint_Category") {

      const subCategoryField = props.ctmSummaryFields.find(field => field.name === 'Complaint_SubCategory');
      const ctmData = CTM_DATA[value];
      if(ctmData) {
        subCategoryField['values'] = Object.keys(ctmData).map(kvMapper)
        props.setCtmSummaryFields([...props.ctmSummaryFields])

      }
    const newData = {
      ...ctmSummaryData,
      Category: value,
      Complaint_SubCategory: ''

    };
    setCtmSummaryData({...newData});
     props.setCtmSummaryData(newData);
    }
     else {
          const newData = {
            ...ctmSummaryData,
            [name]: value,
          };
          setCtmSummaryData(newData);
          if (persist) {
            props.setCtmSummaryData(newData);
          }
        }

  };
 const persistCtmSummaryDataData = () => {
   props.setCtmSummaryData(ctmSummaryData);
 };

 const renderInputField = (name, placeholder, maxLength) => (
   <div className="col-xs-6 col-md-4">
     <FormikInputField
       name={name}
       placeholder={placeholder}
       maxLength={maxLength}
       data={ctmSummaryData || {}}
       onChange={handleCtmSummaryData}
       displayErrors={props.shouldShowSubmitError}

       persist={persistCtmSummaryDataData}
       schema={props.ctmSummaryValidationSchema}
       errors={props.ctmSummaryErrors}
     />
   </div>
 );

 const renderSelectField = (name, placeholder, options) => (
   <div className="col-xs-6 col-md-4">
     <FormikSelectField
       name={name}
       placeholder={placeholder}
       data={ctmSummaryData || {}}
       options={options}
       onChange={handleCtmSummaryData}
       displayErrors={props.shouldShowSubmitError}
//       disabled={
//           location.state.formView === "DashboardView" &&
//           (
//               location.state.stageName === "Case Completed" ||
//               location.state.stageName === "Case Archived")
//
//
//       }

       schema={props.ctmSummaryValidationSchema}
       errors={props.ctmSummaryErrors}
     />
   </div>
 );
const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        data={ctmSummaryData || {}}
        label={label}
        onChange={handleCtmSummaryData}
        displayErrors={props.shouldShowSubmitError}
        schema={props.ctmSummaryValidationSchema}
        errors={props.ctmSummaryErrors}
      />
    </div>
  );

 return (
   <Formik
     initialValues={props.ctmSummaryData}
     validationSchema={null}
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
              CTM Summary
             </button>
           </h2>
           <div
             id="panelsStayOpen-collapseTimelines"
             className="accordion-collapse collapse show"
             aria-labelledby="panelsStayOpen-Timelines"
           >
             <div className="accordion-body">

             {renderElements(
                 props.ctmSummaryFields,
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

export default CtmSummaryAccordion;
