import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import Select, { components } from "react-select";
import "./CaseHeader.css";
import {selectStyle} from "./SelectStyle";

const CaseInformationAccordion = (props) => {
  const {
    convertToCase,
  } = useGetDBTables();
  const { ValueContainer, Placeholder } = components;
  const [caseInformationData, setcaseInformationData] = useState(props.handleData);
  const mastersSelector = useSelector((masters) => masters);

  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, (child) =>
          child && child.type !== Placeholder ? child : null
        )}
      </ValueContainer>
    );
  };

  const tabRef = useRef("HomeView");
  let prop = useLocation();

  let LOBValues = [];
  let appellantDescValues = [];
  let appellantTypeValues = [];
  let appealTypeValues = [];
  let caseLevelPriorityValues = [];
  let issueLevelValues = [];
  let reviewTypeValues = [];
  let productValues = [];
  let productStateValues = [];
  useEffect(() => {
    try {
      if (mastersSelector.hasOwnProperty("masterAngLOBMapping")) {
        const LOBArray =
          mastersSelector["masterAngLOBMapping"].length === 0
            ? []
            : mastersSelector["masterAngLOBMapping"][0];
        const productArray =
          mastersSelector["masterAngLOBMapping"].length === 0
            ? []
            : mastersSelector["masterAngLOBMapping"][0];
        const productStateArray =
          mastersSelector["masterAngLOBMapping"].length === 0
            ? []
            : mastersSelector["masterAngLOBMapping"][0];

        for (let i = 0; i < LOBArray.length; i++) {
          LOBValues.push({ label: convertToCase(LOBArray[i].LOB), value: convertToCase(LOBArray[i].LOB) });
        }
        for (let i = 0; i < productArray.length; i++) {
          productValues.push({ label: convertToCase(productArray[i].Product), value: convertToCase(productArray[i].Product) });
        }
        for (let i = 0; i < productStateArray.length; i++) {
          productStateValues.push({ label: convertToCase(productStateArray[i].State), value: convertToCase(productStateArray[i].State) });
        }
      }

      if (mastersSelector.hasOwnProperty("masterAngAppellantDesc")) {
        const appellantDescArray =
          mastersSelector["masterAngAppellantDesc"].length === 0
            ? []
            : mastersSelector["masterAngAppellantDesc"][0];
        const uniqueDescValues = {};

        for (let i = 0; i < appellantDescArray.length; i++) {
          const desc = convertToCase(appellantDescArray[i].APPELLANT_DESC);

          if (!uniqueDescValues[desc]) {
            uniqueDescValues[desc] = true;
            appellantDescValues.push({ label: convertToCase(appellantDescArray[i].APPELLANT_DESC), value: convertToCase(appellantDescArray[i].APPELLANT_DESC) });
          }
        }
      }

      if (mastersSelector.hasOwnProperty("masterAngAppellantType")) {
        const appellantTypeArray =
          mastersSelector["masterAngAppellantType"].length === 0
            ? []
            : mastersSelector["masterAngAppellantType"][0];

        for (let i = 0; i < appellantTypeArray.length; i++) {
          appellantTypeValues.push({ label: convertToCase(appellantTypeArray[i].Appellant_Type), value: convertToCase(appellantTypeArray[i].Appellant_Type) });
        }
      }

      if (mastersSelector.hasOwnProperty("masterAngAppealType")) {
        const appealArray =
          mastersSelector["masterAngAppealType"].length === 0
            ? []
            : mastersSelector["masterAngAppealType"][0];

        for (let i = 0; i < appealArray.length; i++) {
          appealTypeValues.push({ label: convertToCase(appealArray[i].Appeal_Type), value: convertToCase(appealArray[i].Appeal_Type) });
        }
      }

      if (mastersSelector.hasOwnProperty("masterAngCaseLevelPriority")) {
        const caseLevelPriorityArray =
          mastersSelector["masterAngCaseLevelPriority"].length === 0
            ? []
            : mastersSelector["masterAngCaseLevelPriority"][0];

        for (let i = 0; i < caseLevelPriorityArray.length; i++) {
          caseLevelPriorityValues.push({ label: convertToCase(caseLevelPriorityArray[i].Case_Level_Priority), value: convertToCase(caseLevelPriorityArray[i].Case_Level_Priority) });
        }
      }

      if (mastersSelector.hasOwnProperty("masterAngIssueLevel")) {
        const issueLevelArray =
          mastersSelector["masterAngIssueLevel"].length === 0
            ? []
            : mastersSelector["masterAngIssueLevel"][0];

        for (let i = 0; i < issueLevelArray.length; i++) {
          issueLevelValues.push({ label: convertToCase(issueLevelArray[i].Issue_Level), value: convertToCase(issueLevelArray[i].Issue_Level) });
        }
      }

      if (mastersSelector.hasOwnProperty("masterAngReviewType")) {
        const reviewTypeArray =
          mastersSelector["masterAngReviewType"].length === 0
            ? []
            : mastersSelector["masterAngReviewType"][0];

        for (let i = 0; i < reviewTypeArray.length; i++) {
          reviewTypeValues.push({ label: convertToCase(reviewTypeArray[i].Review_Type), value: convertToCase(reviewTypeArray[i].Review_Type) });
        }
      }
    } catch (error) {
      console.error("An error occurred in useEffect:", error);
    }
  }, []);

  useEffect(() => {
    console.log("formdatacaseinformation", caseInformationData);
  }, [caseInformationData]);

  return (
    <div className="accordion-item" id="caseInformationData">
      <h2
        className="accordion-Information"
        id="panelsStayOpen-Information"
      >
        <button
          className="accordion-button accordionButtonStyle"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#panelsStayOpen-collapseInformation"
          aria-expanded="true"
          aria-controls="panelsStayOpen-collapseOne"
        >
          Case Information
        </button>
      </h2>
      <div
        id="panelsStayOpen-collapseInformation"
        className="accordion-collapse collapse show"
        aria-labelledby="panelsStayOpen-Information"
      >
        <div className="accordion-body">
          <div className="row my-2">
            <div className="col-xs-6 col-md-4">
              <Field name="Line_of_Business_LOB">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{ ...selectStyle }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={'Line_of_Business_LOB'}
                      isDisabled={

                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false

                       

                      }
                      className="basic-multi-select"
                      options={LOBValues}
                      id="lineofBusinessDropdown"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Line_of_Business_LOB')
                      }
                      value={
                        {
                          label: caseInformationData['Line_of_Business_LOB'],
                          value: caseInformationData['Line_of_Business_LOB']
                        }
                      }
                      placeholder="Line of Business"

                      //styles={{ ...customStyles }}


                      isSearchable={
                        document.documentElement.clientHeight <= document.documentElement.clientWidth
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="lineofBusiness"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="lobdescription">
                {({
                  field,
                  meta
                }) => (
                  <div className="form-floating">
                    <input
                      maxLength="300"
                      type="text"
                      id="lobDescription"
                      className={`form-control ${meta.touched && meta.error
                        ? "is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="LOB Description"
                      onChange={(event) => {
                        setcaseInformationData({ ...caseInformationData, 'LOB_Description': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'LOB_Description')
                      }
                      value={convertToCase(caseInformationData['LOB_Description'])}
                      disabled={
                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Intake" || prop.state.stageName === "Acknowledge" || prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false
                      }
                    />
                    <label htmlFor="floatingInputGrid">
                      LOB Description
                    </label>
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="lobDescription"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="claimnumber">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <input
                      id="claimNumber"
                      maxLength="16"
                      type="text"
                      className={`form-control ${meta.touched && meta.error
                        ? " is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="Claim Number"
                      onChange={(event) => {
                        setcaseInformationData({ ...caseInformationData, 'Claim_Number': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'Claim_Number')
                      }
                      value={convertToCase(caseInformationData['Claim_Number'])}
                      disabled={
                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Intake" || prop.state.stageName === "Acknowledge" || prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false
                      }
                    />
                    <label htmlFor="floatingInputGrid">
                      Claim Number
                    </label>
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="claimNumber"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="row my-2">
            <div className="col-xs-6 col-md-4">
              <Field name="product">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{ ...selectStyle }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={
                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false
                      }
                      className="basic-multi-select"
                      options={productValues}
                      id="product"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Product')
                      }

                      value={
                        {
                          label: caseInformationData['Product'],
                          value: caseInformationData['Product']
                        }
                      }
                      placeholder="Product"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight >
                          document.documentElement.clientWidth
                          ? false
                          : true
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="product"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="productType">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{ ...selectStyle }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={

                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false

                      }
                      className="basic-multi-select"
                      options={[
                        { label: "CORESYTEM", value: "CORESYSTEM" },
                        { label: "MDM", value: "MDM" },
                        { label: "USER", value: "USER" }
                      ]}
                      id="producttype"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Product_Type')
                      }

                      value={
                        {
                          label: caseInformationData['Product_Type'],
                          value: caseInformationData['Product_Type']
                        }
                      }
                      placeholder="Product Type"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight >
                          document.documentElement.clientWidth
                          ? false
                          : true
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="producttype"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="productState">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{ ...selectStyle }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={

                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false

                      }
                      className="basic-multi-select"
                      options={productStateValues}
                      id="productstate"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Product_State')
                      }

                      value={
                        {
                          label: caseInformationData['Product_State'],
                          value: caseInformationData['Product_State']
                        }
                      }

                      placeholder="Product State"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight >
                          document.documentElement.clientWidth
                          ? false
                          : true
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="productstate"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="row my-2">

            <div className="col-xs-6 col-md-4">
              <Field name="appellantdescription">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{ ...selectStyle }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={

                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false

                      }
                      className="basic-multi-select"
                      options={appellantDescValues}
                      id="appellantdecsription"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Appellant_Description')
                      }

                      value={
                        {
                          label: caseInformationData['Appellant_Description'],
                          value: caseInformationData['Appellant_Description']
                        }
                      }
                      placeholder="Appellant Description"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight >
                          document.documentElement.clientWidth
                          ? false
                          : true
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="appellantdescription"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="appellanttype">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{ ...selectStyle }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={

                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false

                 

                      }
                      className="basic-multi-select"
                      options={appellantTypeValues}
                      id="appellanttype"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Appellant_Type')
                      }
                      value={
                        {
                          label: caseInformationData['Appellant_Type'],
                          value: caseInformationData['Appellant_Type']
                        }
                      }
                      placeholder="Appellant Type"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight <= document.documentElement.clientWidth
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="Appellant Type"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="appealtype">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{ ...selectStyle }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={

                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false

                      

                      }
                      className="basic-multi-select"
                      options={appealTypeValues}
                      id="appealtype"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Appeal_Type')
                      }

                      value={
                        {
                          label: caseInformationData['Appeal_Type'],
                          value: caseInformationData['Appeal_Type']
                        }
                      }
                      placeholder="Appeal Type"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight >
                          document.documentElement.clientWidth
                          ? false
                          : true
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="Appeal Type"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="row my-2">
            <div className="col-xs-6 col-md-4">
              <Field name="issuelevel">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{
                        ...selectStyle
                      }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={
                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false
                      }
                      className="basic-multi-select"
                      options={issueLevelValues}
                      id="issuelevel"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Issue_Level')
                      }

                      value={
                        {
                          label: caseInformationData['Issue_Level'],
                          value: caseInformationData['Issue_Level']
                        }
                      }
                      placeholder="Issue Level"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight >
                          document.documentElement.clientWidth
                          ? false
                          : true
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="issuelevel"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="issuedescription">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <input
                      id="issuedescription"
                      maxLength="4000"
                      type="text"
                      className={`form-control ${meta.touched && meta.error
                        ? " is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="Issue Description"
                      onChange={(event) => {
                        setcaseInformationData({ ...caseInformationData, 'Issue_Description': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'Issue_Description')
                      }
                      value={convertToCase(caseInformationData['Issue_Description'])}
                      disabled={
                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false
                      }
                    />
                    <label htmlFor="floatingInputGrid">
                      Issue Description
                    </label>
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="issueDescription"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="caselevelpriority">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{
                        ...selectStyle
                      }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={
                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false
                      }
                      className="basic-multi-select"
                      options={caseLevelPriorityValues}
                      id="caselevelpriority"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Case_Level_Priority')
                      }

                      value={
                        {
                          label: caseInformationData['Case_Level_Priority'],
                          value: caseInformationData['Case_Level_Priority']
                        }
                      }

                      placeholder="Case Level Priority"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight >
                          document.documentElement.clientWidth
                          ? false
                          : true
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="caselevelpriority"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="row my-2">
            <div className="col-xs-6 col-md-4">
              <Field name="reviewtype">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{ ...selectStyle }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={
                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false
                      }
                      className="basic-multi-select"
                      options={reviewTypeValues}
                      id="reviewtype"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Review_Type')
                      }

                      value={
                        {
                          label: caseInformationData['Review_Type'],
                          value: caseInformationData['Review_Type']
                        }
                      }

                      placeholder="Review Type"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight >
                          document.documentElement.clientWidth
                          ? false
                          : true
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="reviewType"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="denialype">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{

                        ...selectStyle
                      }}

                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={
                        tabRef.current === "DashboardView" &&
                          prop.state.lockStatus !== undefined &&
                          prop.state.lockStatus === "Y"
                          ? true
                          : false
                      }
                      className="basic-multi-select"
                      options={[
                        { label: "USER", value: "USER" }
                      ]}
                      id="denialtype"
                      isMulti={false}
                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Denial_Type')
                      }

                      value={
                        {
                          label: caseInformationData['Denial_Type'],
                          value: caseInformationData['Denial_Type']
                        }
                      }
                      placeholder="Denial Type"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight >
                          document.documentElement.clientWidth
                          ? false
                          : true
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="denialType"
                className="invalid-feedback"
              />
            </div>
            <div className="col-xs-6 col-md-4">
              <Field name="researchtype">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <Select
                      styles={{ ...selectStyle }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      isClearable
                      name={field.name}
                      isDisabled={
                        tabRef.current === "DashboardView" &&
                          prop.state.lockStatus !== undefined &&
                          prop.state.lockStatus === "Y"
                      }
                      className="basic-multi-select"
                      options={[
                        { label: "USER", value: "USER" }
                      ]}
                      id="researchtype"
                      isMulti={false}

                      onChange={(selectValue) =>
                        props.handleOnChange(selectValue ? selectValue.value : null, 'Research_Type')
                      }

                      value={
                        {
                          label: caseInformationData['Research_Type'],
                          value: caseInformationData['Research_Type']
                        }
                      }
                      placeholder="Research Type"
                      //styles={{...customStyles}}
                      isSearchable={
                        document.documentElement.clientHeight <= document.documentElement.clientWidth
                      }
                    />
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="researchType"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="row">
            <div className="col-xs-6 col-md-4">
              <Field name="inboundemailid">
                {({
                  field, // { name, value, onChange, onBlur }
                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                  meta,
                }) => (
                  <div className="form-floating">
                    <input
                      id="inboundemailid"
                      maxLength="100"
                      type="text"
                      className={`form-control ${meta.touched && meta.error
                        ? " is-invalid"
                        : field.value
                          ? "is-valid"
                          : ""
                        }`}
                      placeholder="Inbound Email Id"
                      onChange={(event) => {
                        setcaseInformationData({ ...caseInformationData, 'Inbound_Email_ID': event.target['value'] })
                      }}
                      onBlur={(event) =>
                        props.handleOnChange(event.target['value'], 'Inbound_Email_ID')
                      }
                      value={convertToCase(caseInformationData['Inbound_Email_ID'])}
                      disabled={
                        prop.state.formView === "DashboardView" &&
                          (prop.state.stageName === "Redirect Review" ||
                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Research" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                          ? true
                          : false
                      }

                    />
                    <label htmlFor="floatingInputGrid">
                      Inbound Email Id
                    </label>
                    {meta.touched && meta.error && (
                      <div
                        className="invalid-feedback"
                        style={{ display: "block" }}
                      >
                        {meta.error}
                      </div>
                    )}
                  </div>
                )}
              </Field>
              <ErrorMessage
                component="div"
                name="inboundEmailId"
                className="invalid-feedback"
              />
            </div>
          </div>
          <div className="row my-2"></div>
          <div className="case Collobaration">
            <p className="collobarationheader">Case Collabaration</p>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                <p className="prevcase">Previous Case</p>
              </div>
              <div className="col-xs-6 col-md-4">
                <a className="refTag" href="https://www.google.com">Duplicate/Related case(s)</a>
              </div>
              <div className="col-xs-6 col-md-4">
                <a className="refTag" href="https://www.google.com">Redirect/ Case(S)</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

  )
}

export default CaseInformationAccordion;
