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

const CaseTimelinesAccordion = (props) => {
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const { convertToCase } = useGetDBTables();
  const masterAngCaseFilingMethodSelector = useSelector(
    (state) => state?.masterAngCaseFilingMethod,
  );
  const [caseTimelinesData, setCaseTimelinesData] = useState(
    props.caseTimelinesData || {},
  );
  const [caseFilingMethodValues, setCaseFilingMethodValues] = useState([]);

  const handleCaseTimelinesData = (name, value, persist) => {
    const newData = {
      ...caseTimelinesData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setCaseTimelinesData(newData);
    if (persist) {
      props.setCaseTimelinesData(newData);
    }
  };
  const persistCaseTimelinesData = () => {
    props.setCaseTimelinesData(caseTimelinesData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseTimelinesData}
        onChange={handleCaseTimelinesData}
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
        persist={persistCaseTimelinesData}
        schema={props.caseTimelinesValidationSchema}
        errors={props.caseTimelinesErrors}
      />
    </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        data={caseTimelinesData}
        label={label}
        onChange={handleCaseTimelinesData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          (props.renderType === RenderType.APPEALS &&
            location.state.formView === "DashboardView" &&
            (location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Effectuate" ||
              location.state.stageName === "Pending Effectuate" ||
              location.state.stageName === "Resolve" ||
              location.state.stageName === "Case Completed" ||
              location.state.stageName === "Reopen" ||
              location.state.stageName === "CaseArchived")) ||
          (name === "Case_Received_Date" &&
            location.state.stageName === "Documents Needed")
        }
        schema={props.caseTimelinesValidationSchema}
        errors={props.caseTimelinesErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={caseTimelinesData}
        options={options}
        onChange={handleCaseTimelinesData}
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
        schema={props.caseTimelinesValidationSchema}
        errors={props.caseTimelinesErrors}
      />
    </div>
  );

  useEffect(() => {
    if (masterAngCaseFilingMethodSelector) {
      const caseFilingMethodArray =
        masterAngCaseFilingMethodSelector?.[0] || [];
      setCaseFilingMethodValues(
        caseFilingMethodArray.map((e) => ({
          label: convertToCase(e.Case_Filing_Method),
          value: convertToCase(e.Case_Filing_Method),
        })),
      );
    }
  }, []);

  const fields = [
    {
      type: "select",
      name: "Case_Filing_Method",
      placeholder: "Case Filing Method",
      values: caseFilingMethodValues,
      renderTypes: [RenderType.APPEALS],
    },
    {
      type: "input",
      name: "Case_Aging",
      placeholder: "Case Aging",
      maxLength: 16,
      renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "Compliance_Time_Left_to_Finish",
      placeholder: "Compliance Time Left to Finish",
      maxLength: 16,
      renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "Acknowledgment_Timely",
      placeholder: "Acknowledgement Timely",
      maxLength: 16,
      renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "Timeframe_Extended",
      placeholder: "Timeframe Extended",
      maxLength: 30,
      renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "Case_in_Compliance",
      placeholder: "Case in Compliance",
      maxLength: 30,
      renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "Out_of_Compliance_Reason",
      placeholder: "Out of Compliance Reason",
      maxLength: 30,
      renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "date",
      name: "Case_Received_Date",
      placeholder: "Case Received Date",
      label: "Case Received Date",
      renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "date",
      name: "AOR_Received_Date",
      placeholder: "AOR Received Date",
      label: "AOR Received Date",
      renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "date",
      name: "WOL_Received_Date",
      placeholder: "WOL Received Date",
      label: "WOL Received Date",
      renderTypes: [RenderType.APPEALS],
    },
    {
      type: "input",
      name: "Global_Case_ID",
      placeholder: "Global Case ID",
      maxLength: 30,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "Department",
      placeholder: "Department",
      maxLength: 30,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "CRM_Ticket_Number",
      placeholder: "CRM Ticket Number",
      maxLength: 30,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "RMS_Ticket_Number",
      placeholder: "RMS Ticket Number",
      maxLength: 30,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
    {
      type: "input",
      name: "Are_number_of_claims_more_than_10",
      placeholder: "Are number of claims more than 10",
      maxLength: 30,
      renderTypes: [RenderType.PROVIDER_DISPUTE],
    },
  ];

  return (
    <Formik
      initialValues={props.caseTimelinesData}
      validationSchema={props.caseTimelinesValidationSchema}
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
                Case Timelines
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
                        (item.type === "select" &&
                          renderSelectField(
                            item.name,
                            item.placeholder,
                            item.values,
                          )) ||
                        (item.type === "input" &&
                          renderInputField(
                            item.name,
                            item.placeholder,
                            item.maxLength,
                          )) ||
                        (item.type === "date" &&
                          renderDatePicker(
                            item.name,
                            item.placeholder,
                            item.label,
                          ))
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

export default CaseTimelinesAccordion;
