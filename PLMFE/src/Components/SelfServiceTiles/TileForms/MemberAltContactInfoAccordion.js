import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { chunkArray, RenderType } from "./Constants";

const MemberAltContactInfoAccordion = (props) => {
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const { convertToCase } = useGetDBTables();
  
  const [memberAltContactData, setMemberAltContactData] = useState(
    props.memberAltContactData || {},
  );


  const handleMemberAltContactData = (name, value, persist) => {
    const newData = {
      ...memberAltContactData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setMemberAltContactData(newData);
    if (persist) {
      props.setMemberAltContactData(newData);
    }
  };
  const persistMemberAddDataData = () => {
    props.setMemberAltContactData(memberAltContactData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={memberAltContactData}
        onChange={handleMemberAltContactData}
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
        persist={persistMemberAddDataData}
        schema={props.memberAltContactInfoValidationSchema}
        errors={props.memberAltContactErrors}
      />
    </div>
  );
 
  const fields = [
    {
      type: "input",
      name: "Issue_Number",
      placeholder: "Issue Number",
      maxLength: 50,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
  
    {
      type: "input",
      name: "Address_Line_1",
      placeholder: "Address Line 1",
      maxLength: 50,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "Address_Line_2",
      placeholder: "Address Line 2",
      maxLength: 50,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "Zip_Code",
      placeholder: "Zip Code",
      maxLength: 30,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "City",
      placeholder: "City",
      maxLength: 30,
      renderTypes: [ RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "State_",
      placeholder: "State",
      maxLength: 30,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
    {
        type: "input",
        name: "Alternate_Phone_Number",
        placeholder: "Alternate Phone Number",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Fax_Number",
        placeholder: "Fax Number",
        maxLength: 30,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Alternate_Email_Address",
        placeholder: "Alternate Email Address",
        maxLength: 30,
        renderTypes: [ RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Communication_Preference",
        placeholder: "Communication Preference",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
  ];

  return (
    <Formik
      initialValues={props.memberAltContactData}
      validationSchema={props.memberAltContactInfoValidationSchema}
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
                Member Alternative Contact Information
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTimelines"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-Timelines"
            >
              <div className="accordion-body">
                {chunkArray(fields, 3, (e) =>
                  e.renderTypes.includes(props.renderType),
                ).map((chunk) => (
                  <div className="row my-2">
                    {chunk.map((item) => {
                      console.log("curtsk", chunk);
                      return (
                        // (item.type === "select" &&
                        //   renderSelectField(
                        //     item.name,
                        //     item.placeholder,
                        //     item.values,
                        //   )) ||
                        (item.type === "input" &&
                          renderInputField(
                            item.name,
                            item.placeholder,
                            item.maxLength,
                          )) 
                        //   ||
                        // (item.type === "date" &&
                        //   renderDatePicker(
                        //     item.name,
                        //     item.placeholder,
                        //     item.label,
                        //   ))
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default MemberAltContactInfoAccordion;
