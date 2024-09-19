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

const memberAltContactFields = [

  { name: "Provider_Issue_Number", placeholder: "Issue Number", maxLength: 50 },

  { name: "Provider_Address_Line1", placeholder: "Address Line 1", maxLength: 250 },

  { name: "Provider_Address_Line2", placeholder: "Address Line 2", maxLength: 250 },

  { name: "Provider_Zip_Code", placeholder: "Zip Code", maxLength: 10 },

  { name: "Provider_City", placeholder: "City", maxLength: 100 },

  { name: "Provider_State", placeholder: "State", maxLength: 100 },

  { name: "Provider_Alternate_Phone_Number", placeholder: "Alternate Phone Number", maxLength: 15 },

  { name: "Provider_Fax_Number", placeholder: "Fax Number", maxLength: 15 },

  { name: "Provider_Alternate_Email_Address", placeholder: "Alternate Email Address", maxLength: 100 },

  { name: "Provider_Communication_Preference", placeholder: "Communication Preference", maxLength: 100 },

];

// The component that uses Formik context

const MemberAltContactInfoAccordion = () => {

  const formik = useFormikContext();

  if (!formik) {

    return <div>Error: Formik context is not available</div>;

  }

  const { values, errors, setFieldValue } = formik;

  const handleFieldChange = (name, value) => {

    setFieldValue(name, value);

  };

  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4">
        <FormikInputField

            name={name}

            placeholder={placeholder}

            maxLength={maxLength}

            disabled={false}

            data={values} // Pass Formik values as data

            persist={() => {
            }} // Add persist logic if needed

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

            Member Alternative Contact Information
          </button>
        </h2>
        <div

            id="panelsStayOpen-collapseMemberAltContactInfo"

            className="accordion-collapse collapse show"

            aria-labelledby="panelsStayOpen-memberAltContactInfo"
        >
          <div className="accordion-body">

            <div className="row my-2">

              {memberAltContactFields.map((field) =>

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

    Provider_Issue_Number: "",

    Provider_Address_Line1: "",

    Provider_Address_Line2: "",

    Provider_Zip_Code: "",

    Provider_City: "",

    Provider_State: "",

    Provider_Alternate_Phone_Number: "",

    Provider_Fax_Number: "",

    Provider_Alternate_Email_Address: "",

    Provider_Communication_Preference: "",

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

              {/* Ensure that MemberAltContactInfoAccordion is used here */}
              <MemberAltContactInfoAccordion />
              <button type="submit">Submit</button>
            </Form>

        )}
      </Formik>

  );

};

export default MemberAltContactInfoAccordion;
