import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import MemberSearch from "../TileForms/MemberSearch";
import TableComponent from "../../../../src/util/TableComponent";
import { useAxios } from "../../../api/axios.hook";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";

const ProviderMemberInformationAccordion = (props) => {
  const { convertToCase, extractDate, getDatePartOnly } = useGetDBTables();

  const [ProvidermemberInformationData, setProviderMemberInformationData] = useState(
    props.ProvidermemberInformationData,
  );
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const angDeceasedSelector = useSelector((state) => state?.masterAngDeceased);
  const angGenderSelector = useSelector((state) => state?.masterAngGender);
  const angDualSelector = useSelector((state) => state?.masterAngDualPlan);
  const mailToAddSelector = useSelector(
    (state) => state?.masterAngMailToAddress,
  );
  const angPrefSelector = useSelector(
    (state) => state?.masterAngPreferredLanguage,
  );
  const commAngPrefSelector = useSelector((state) => state?.masterAngCommPref);
  const token = useSelector((state) => state.auth.token);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [responseData, setResponseData] = useState([]);
  const [showProviderMemberSearch, setShowProviderMemberSearch] = useState(false);
  const { customAxios: axios } = useAxios();
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [whiteGloveIndicator, setWhiteGloveIndicator] = useState(false);
  // const [whiteGloveReason, setWhiteGloveReason] = useState("");
  // const [whiteGloveCancelledReason, setWhiteGloveCancelledReason] = useState("");
  const [whiteGloveIndicatorInitialized, setWhiteGloveIndicatorInitialized] =
    useState(false);

  let location = useLocation();

  const [invalidInputState, setInvalidInputState] = useState(false);

  useEffect(() => {
    setInvalidInputState(
      location.state.formView === "DashboardView" &&
        (location.state.stageName === "Redirect Review" ||
          location.state.stageName === "Documents Needed" ||
          location.state.stageName === "Effectuate" ||
          location.state.stageName === "Pending Effectuate" ||
          location.state.stageName === "Resolve" ||
          location.state.stageName === "Case Completed" ||
          location.state.stageName === "Reopen" ||
          location.state.stageName === "CaseArchived"),
    );
  }, [location]);

  const handleProviderMemberInformationData = (name, value, persist) => {
    const newData = {
      ...ProvidermemberInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setProviderMemberInformationData(newData);
    if (persist) {
      props.setProviderMemberInformationData(newData);
    }
  };

  const persistProviderMemberInformationData = () => {
    props.setProviderMemberInformationData(ProvidermemberInformationData);
  };

  const handleWhiteGloveChange = (e) => {
    const isChecked = e.target.checked;
    setWhiteGloveIndicator(isChecked);
    setWhiteGloveIndicatorInitialized(true);
    // if (isChecked) {
    //   setWhiteGloveCancelledReason("");
    // } else {
    //   setWhiteGloveReason("");
    // }
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={ProvidermemberInformationData}
        onChange={handleProviderMemberInformationData}
        disabled={invalidInputState}
        persist={persistProviderMemberInformationData}
        // schema={props.ProvidermemberInformationValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.ProvidermemberInformationErrors}
      />
    </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        data={ProvidermemberInformationData}
        label={label}
        onChange={handleProviderMemberInformationData}
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
        // schema={props.ProvidermemberInformationValidationSchema}
        errors={props.ProvidermemberInformationErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={ProvidermemberInformationData}
        options={options}
        onChange={handleProviderMemberInformationData}
        displayErrors={props.shouldShowSubmitError}
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
        // schema={props.ProvidermemberInformationValidationSchema}
        errors={props.ProvidermemberInformationErrors}
      />
    </div>
  );

  const handleShowMemberSearch = () => {
    setShowMemberSearch(true);
  };

  const handleCloseSearch = () => {
    setShowMemberSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };

  const handleClearMemberSearch = () => {
    setSelectSearchValues([]);
    setSelectedCriteria([]);
    setResponseData([]);
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

  const handleSelectedMembers = () => {
    setShowMemberSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
    props.setMemberInformationData({ ...selectedAddress[0] });
  };

  
  
  const showMembers = async () => {
    let MemberID = selectSearchValues?.memberID;
    let MedicareID = selectSearchValues?.medicareID;
    let MedicaidID = selectSearchValues?.medicaidID;
    let MemberFirstName = selectSearchValues?.memberFirstNameId;
    let MemberLastName = selectSearchValues?.memberLasstNameId;
    let DOB = selectSearchValues?.dateOfBirth;
  
    // Check if at least one search parameter has a value
    if (
      MemberID ||
      MedicareID ||
      MedicaidID ||
      MemberFirstName ||
      MemberLastName ||
      DOB
    ) {
      let getApiJson = {
        option: "GETMEMBERSEARCHDATA",
        Member_ID: MemberID || "",
        Medicare_ID: MedicareID || "",
        Medicaid_ID: MedicaidID || "",
        Member_First_Name: MemberFirstName || "",
        Member_Last_Name: MemberLastName || "",
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


  const memberSearchTableComponent = () => {
    let columnNames =
        "Action~Action,Member ID~Member_ID,Member First Name~Member_First_Name,Member Last Name~Member_Last_Name,Date of Birth~Date_of_Birth,Plan Code~Plan_Code,ContractPlan ID~ContractPlan_ID,Medicare ID HICN~Medicare_ID_HICN,Plan Name~Plan_Name,Plan Effective Date~Plan_Effective_Date,Plan Expiration Date~Plan_Expiration_Date,Email ID~Email_ID,Phone Number~Phone_Number,Dual Plan~Dual_Plan,Address Line 1~Address_Line_1,Address Line 2~Address_Line_2,Zip Code~Zip_Code,City~City,County~County,State~State_,Preferred Language~Preferred_Language";
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

  const [deceasedValues, setDeceasedValues] = useState([]);
  const [genderValues, setGenderValues] = useState([]);
  const [dualPlanValues, setDualPlanValues] = useState([]);
  const [mailToAddressValues, setMainToAddressValues] = useState([]);
  const [preferredLanguageValues, setPreferredLanguageValues] = useState([]);
  const [commPrefValues, setCommPrefValues] = useState([]);
  const [specialNeedsValues] = useState([
    { label: "Yes", value: "Yes" },
    { label: "No", value: "No" },
  ]);

  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const angDeceased = angDeceasedSelector?.[0] || [];
    setDeceasedValues(angDeceased.map((e) => e.Deceased).map(kvMapper));

    const angGender = angGenderSelector?.[0] || [];
    setGenderValues(angGender.map((e) => e.Gender).map(kvMapper));

    const angDual = angDualSelector?.[0] || [];
    setDualPlanValues(angDual.map((e) => e.Dual_Plan).map(kvMapper));

    const mailToAdd = mailToAddSelector?.[0] || [];
    setMainToAddressValues(
      [...new Set(mailToAdd.map((e) => convertToCase(e.Mail_to_Address)))].map(
        kvMapper,
      ),
    );

    const angPref = angPrefSelector?.[0] || [];
    setPreferredLanguageValues(
      angPref.map((e) => e.Preferred_Language).map(kvMapper),
    );

    const commAngPref = commAngPrefSelector?.[0] || [];
    setCommPrefValues(commAngPref.map((e) => e.Comm_Pref).map(kvMapper));
  }, []);

  return (
    <div>
      <div className="accordion-item" id="memberInformation">
        <h2 className="accordion-header" id="panelsStayOpen-memberInformation">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapsememberInformation"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseOne"
          >
            Member Information
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapsememberInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-memberInformation"
        >
          <div className="accordion-body">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={(event) => handleShowMemberSearch(event)}
              disabled={
                location.state.stageName === "Redirect Review" ||
                location.state.stageName === "Documents Needed" ||
                location.state.stageName === "CaseArchived"
              }
            >
              Member Search
            </button>
            <div className="row my-2">
              {renderInputField("Provider_Issue_Number", "Issue Number", 50)}
              {renderInputField("Provider_Member_ID", "Member ID", 50)}
              {renderInputField("Provider_Member_First_Name", "Member First Name", 50)}
              
            </div>
            <div className="row my-2">
            {renderInputField("Provider_Member_Last_Name", "Member Last Name", 60)}
            {renderInputField("Provider_ContractPlan_ID", "Contract/ Plan ID", 50)}
            {renderInputField("Provider_Medicare_ID_HICN", "Medicare ID", 50)}
              
        
            </div>
            <div className="row my-2">
            {renderInputField("Provider_Medicaid_ID", "Medicaid ID", 50)}
            {renderDatePicker(
                "Provider_Plan_Effective_Date",
                "Plan Effective Date",
                "Plan Effective Date",
              )}
              {renderInputField("Provider_Plan_Name", "Plan Name", 50)}
            </div>
           
           
            <div className="row my-2">
            {renderDatePicker(
                "Provider_Date_of_Birth",
                "DOB",
                "Date of Birth",
              )}
              {renderInputField("Plan_Type", "Plan Type", 100)}
              {renderInputField("Plan_Code", "Plancode", 100)}
            </div>
           
            <div className="row my-2">
              {renderInputField("Provider_Email_ID", "Email ID", 100)}
              {renderInputField("Provider_Phone_Number", "Phone Number", 50)}
              {renderSelectField("Provider_Dual_Plan", "Dual Plan", dualPlanValues)}
              
            </div>
    
            <div className="row my-2">
            {renderInputField("Provider_LIS", "LIS?", 50)}
            {renderInputField(
                "Provider_Preferred_Language",
                "Preferred Language",
                4000,
              )}
              {/* {renderSelectField("Provider_Portal_Enrolled", "Portal Enrolled", 50)} */}

            </div>
            <div className="row my-2">
            {renderInputField("Provider_Current_Alert", "Current Alert", 50)}
            {renderInputField("Provider_Next_Alert", "Next Alert", 50)}

            </div>
          </div>
        </div>
        {showMemberSearch && (
          <MemberSearch
            handleCloseSearch={handleCloseSearch}
            selectedCriteria={selectedCriteria}
            setSelectedCriteria={setSelectedCriteria}
            selectSearchValues={selectSearchValues}
            setSelectSearchValues={setSelectSearchValues}
            responseData={responseData}
            setResponseData={setResponseData}
            handleClearMemberSearch={handleClearMemberSearch}
            showMemberSearch={showMemberSearch}
            showMembers={showMembers}
            memberSearchTableComponent={memberSearchTableComponent}
            handleSelectedMembers={handleSelectedMembers}
          />
        )}
      </div>
    </div>
  );
};
export default ProviderMemberInformationAccordion;
