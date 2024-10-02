import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ProviderInformationSearch from "../TileForms/ProviderInformationSearch";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { useAxios } from "../../../api/axios.hook";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";
import TableComponent from "../../../../src/util/TableComponent";

const PdProviderInformationAccordion = (props) => {
  const { convertToCase, extractDate, getDatePartOnly } = useGetDBTables();
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
      process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const [showProviderInformationSearch, setShowProviderInformationSearch] = useState(false);
  
  const [ProviderInformationInformationData, setProviderInformationInformationData] = useState(
    props.ProviderInformationInformationData,
  );
  const commAngPrefSelector = useSelector((state) => state?.masterAngCommPref);
  const token = useSelector((state) => state.auth.token);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [responseData, setResponseData] = useState([]);
  const [showProviderMemberSearch, setShowProviderMemberSearch] = useState(false);
  const { customAxios: axios } = useAxios();
  const [selectedAddress, setSelectedAddress] = useState([]);
  const stageName = caseHeaderConfigData["StageName"];


  const [providerInformationData, setProviderInformationData] = useState(props.providerInformationData || {});

  const handleProviderInformationData = (name, value, persist) => {
    const newData = {
      ...providerInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setProviderInformationData(newData);
    if (persist) {
      props.setProviderInformationData(newData);
    }
  };
  const persistProviderInformationDataData = () => {
    props.setProviderInformationData(providerInformationData);
  };

  const handleShowProviderInformationSearch = () => {
    setShowProviderInformationSearch(true);
  };
  const handleCloseSearch = () => {
    setShowProviderInformationSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };

  const handleClearProviderInformationSearch = () => {
    setSelectSearchValues([]);
    setSelectedCriteria([]);
    setResponseData([]);
  };

  const handleSelectedProviderInformations = () => {
    setShowProviderInformationSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
    props.setProviderInformationInformationData({ ...selectedAddress[0] });
  };

  const handleProviderInformationInformationData = (name, value, persist) => {
    const newData = {
      ...ProviderInformationInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setProviderInformationInformationData(newData);
    if (persist) {
      props.setProviderInformationInformationData(newData);
    }
  };

  const persistProviderInformationInformationData = () => {
    props.setProviderInformationInformationData(ProviderInformationInformationData);
  };
  const handleCheckBoxChange = (event, ind) => {
    let jsn = responseData[ind];
    jsn.isChecked = event.target.checked;
    setSelectedAddress([...selectedAddress, jsn]);
  };

  const handleCheckBoxHeaderChange = (event) => {
    const updatedTableData = responseData.map((jsn) => {
      jsn.isChecked = event.target.checked;
      return jsn;
    });
    setSelectedAddress(updatedTableData);
  };

  const showProviderInformations = async () => {
    let ProviderMemberID = selectSearchValues?.ProvidermemberID;
    let MedicareID = selectSearchValues?.medicareID;
    let MedicaidID = selectSearchValues?.medicaidID;
    let ProviderMemberFirstName = selectSearchValues?.ProvidermemberFirstNameId;
    let ProviderMemberLastName = selectSearchValues?.ProvidermemberLasstNameId;
    let DOB = selectSearchValues?.dateOfBirth;
  
    // Check if at least one search parameter has a value
    if (
      ProviderMemberID ||
      MedicareID ||
      MedicaidID ||
      ProviderMemberFirstName ||
      ProviderMemberLastName ||
      DOB
    ) {
      let getApiJson = {
        option: "GETPROVIDERINFORMATIONSEARCHDATA",
        ProviderMember_ID: ProviderMemberID || "",
        Medicare_ID: MedicareID || "",
        Medicaid_ID: MedicaidID || "",
        ProviderMember_First_Name: ProviderMemberFirstName || "",
        ProviderMember_Last_Name: ProviderMemberLastName || "",
        Date_of_Birth: extractDate(DOB) || "",
      };
  
      try {
        let res = await axios.post("/generic/callProcedure", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("Full API Response:", res.data); // Debugging the API response
  
        // Access the first element of resApiData
        let resApiData = res.data.CallProcedure_Output?.data || [];
        console.log("procedure ka data", resApiData); // Check if data exists
  
      if(resApiData[0].length === 0 )  {
       console.log("No data found for the member ID");
          alert("No data found");
          return; 
        }
  
        const respKeys = Object.keys(resApiData[0]); 
        respKeys.forEach((k) => {
          let apiResponse = resApiData[0][k]; 
          console.log("apiResponse", apiResponse);
          
          if (
            apiResponse?.hasOwnProperty("Date_of_Birth") &&
            typeof apiResponse.Date_of_Birth === "string"
          ) {
            const mad = new Date(getDatePartOnly(apiResponse.Date_of_Birth));
            apiResponse.Date_of_Birth = extractDate(mad);
  
            console.log("dob-->", mad);
            console.log("dob2-->", extractDate(mad));
          }
  
          if (
            apiResponse?.hasOwnProperty("Plan_Effective_Date") &&
            typeof apiResponse.Plan_Effective_Date === "string"
          ) {
            const mad = new Date(
              getDatePartOnly(apiResponse.Plan_Effective_Date)
            );
            apiResponse.Plan_Effective_Date = extractDate(mad);
            console.log("Plan Effective Date -->", apiResponse.Plan_Effective_Date);
          }
  
          if (
            apiResponse?.hasOwnProperty("Plan_Expiration_Date") &&
            typeof apiResponse.Plan_Expiration_Date === "string"
          ) {
            const mad = new Date(
              getDatePartOnly(apiResponse.Plan_Expiration_Date)
            );
            apiResponse.Plan_Expiration_Date = extractDate(mad);
            console.log("Plan Expiration Date -->", apiResponse.Plan_Expiration_Date);
          }
        });
  
        setResponseData(resApiData);
  
        const apiStat = res.data.CallProcedure_Output.Status;
        if (apiStat === -1) {
          alert("Error in fetching data");
        }
      } catch (error) {
        console.error("API Error:", error);
        alert("Error in fetching data. Please try again later.");
      }
    } else {
      alert("Please select at least one search value.");
    }
  };

  const ProviderInformationSearchTableComponent = () => {
    let columnNames =
      "Action~Action,Information ID~Information_ID,Information First Name~Information_First_Name,Information Last Name~Information_Last_Name,Date of Birth~Date_of_Birth,Plan Code~Plan_Code,ContractPlan ID~ContractPlan_ID,Medicare ID HICN~Medicare_ID_HICN,Plan Name~Plan_Name,Plan Effective Date~Plan_Effective_Date,Plan Expiration Date~Plan_Expiration_Date,Email ID~Email_ID,Phone Number~Phone_Number,Dual Plan~Dual_Plan,Address Line 1~Address_Line_1,Address Line 2~Address_Line_2,Zip Code~Zip_Code,City~City,County~County,State~State_,Preferred Language~Preferred_Language";
    if (responseData.length > 0) {
      return (
        <>
          <TableComponent
            columnName={columnNames}
            rowValues={responseData}
            showCheckBox={true}
            handleCheckBoxChange={handleCheckBoxChange}
            handleCheckBoxHeaderChange={handleCheckBoxHeaderChange}
            CheckBoxInHeader={true}
          />
        </>
      );
    } else {
      return <></>;
    }
  };

  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4">
        <FormikInputField
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            data={providerInformationData}
            onChange={handleProviderInformationData}
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
            persist={persistProviderInformationDataData}
            schema={props.providerInformationValidationSchema}
            errors={props.providerInformationErrors}
        />
      </div>
  );
  const renderSelectField = (name, placeholder, options) => (
      <div className="col-xs-6 col-md-4">
        <FormikSelectField
            name={name}
            placeholder={placeholder}
            data={providerInformationData}
            options={options}
            onChange={handleProviderInformationData}
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
            schema={props.providerInformationValidationSchema}
            errors={props.providerInformationErrors}
        />
      </div>
  );

  const renderDatePicker = (name, placeholder, label) => (
      <div className="col-xs-6 col-md-4">
        <FormikDatePicker
            name={name}
            placeholder={placeholder}
            data={providerInformationData}
            label={label}
            onChange={handleProviderInformationData}
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
            schema={props.providerInformationValidationSchema}
            errors={props.providerInformationErrors}
        />
      </div>
  );
  return (
      <Formik
          initialValues={props.providerInformationData}
          validationSchema={props.providerInformationValidationSchema}
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
                    Provider Information
                  </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseTimelines"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-Timelines"
                >
                  <div className="accordion-body">
                  <button
              type="button"
              className="btn btn-outline-primary"
              onClick={(event) => handleShowProviderInformationSearch(event)}
              disabled={
                location.state.stageName === "Redirect Review" ||
                location.state.stageName === "Documents Needed" ||
                location.state.stageName === "CaseArchived"
              }
            >
              Provider Information Search
            </button>
                    {renderElements(
                        props.providerInformationFields,
                        renderSelectField,
                        renderInputField,
                        renderDatePicker ,
                        "",

                    )}
                  </div>
                  {showProviderInformationSearch && (
                    <ProviderInformationSearch
                      handleCloseSearch={handleCloseSearch}
                      selectedCriteria={selectedCriteria}
                      setSelectedCriteria={setSelectedCriteria}
                      selectSearchValues={selectSearchValues}
                      setSelectSearchValues={setSelectSearchValues}
                      responseData={responseData}
                      setResponseData={setResponseData}
                      handleClearProviderInformationSearch={handleClearProviderInformationSearch}
                      showProviderInformationSearch={showProviderInformationSearch}
                      showProviderInformations={showProviderInformations}
                      ProviderInformationSearchTableComponent={ProviderInformationSearchTableComponent}
                      handleSelectedProviderInformations={handleSelectedProviderInformations}
                    />
                  )}
                </div>
              </div>
            </Form>
        )}
      </Formik>
      
  );
};

export default PdProviderInformationAccordion;
