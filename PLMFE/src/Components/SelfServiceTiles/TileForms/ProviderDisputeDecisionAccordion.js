import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import {Formik, Form, useFormikContext} from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";

const providerDisputeDecisionFields = [

  { name: "Provider_Intake_Decision", placeholder: "Intake Decision", maxLength: 50 },

  { name: "Provider_Intake_Decision_Reason", placeholder: "Intake Decision Reason", maxLength: 250 },

  { name: "Provider_Decision_Justification", placeholder: "Decision Justification", maxLength: 250 },

];

// The component that uses Formik context

const ProviderDisputeDecisionAccordion = () => {

  const formik = useFormikContext();

  if (!formik) {

    return <div>Error: Formik context is not available</div>;

  }

  const { values, errors, setFieldValue } = formik;

  const handleFieldChange = (name, value) => {

    setFieldValue(name, value);

  };

  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4" key={name}>
        <FormikInputField

            name={name}

            placeholder={placeholder}

            maxLength={maxLength}

            disabled={false}

            data={values} // Pass Formik values as data

            persist={() => {}} // Add persist logic if needed

            onChange={handleFieldChange} // Custom handler to update Formik state

            errors={errors} // Pass Formik errors

            displayErrors={true} // Enable error display

        />
      </div>

  );

  return (
      <div className="accordion-item" id="memberAltContactInfo">
        <h2 className="accordion-header">
          <button

              className="accordion-button"

              type="button"

              data-bs-toggle="collapse"

              data-bs-target="#panelsStayOpen-collapseMemberAltContactInfo"

              aria-expanded="true"

              aria-controls="panelsStayOpen-collapseMemberAltContactInfo"
          >

            DECISION
          </button>
        </h2>
        <div

            id="panelsStayOpen-collapseMemberAltContactInfo"

            className="accordion-collapse collapse show"

            aria-labelledby="panelsStayOpen-memberAltContactInfo"
        >
          <div className="accordion-body">
            <div className="row my-2">

              {providerDisputeDecisionFields.map((field) =>

                  renderInputField(field.name, field.placeholder, field.maxLength)

              )}
            </div>
          </div>
        </div>
      </div>

  );

};

// The parent component that wraps everything inside Formik

const MyFormComponent = () => {

  const initialValues = {
    Provider_Intake_Decision: "",
    Provider_Intake_Decision_Reason: "",
    Provider_Decision_Justification: "",
  };

  return (
      <Formik

          initialValues={initialValues}

          onSubmit={(values) => {

            console.log(values);

          }}
      >

        {() => (
            <Form>

            
              <ProviderDisputeDecisionAccordion  />
              <button type="submit">Submit</button>
            </Form>

        )}
      </Formik>

  );

};

export default ProviderDisputeDecisionAccordion;
