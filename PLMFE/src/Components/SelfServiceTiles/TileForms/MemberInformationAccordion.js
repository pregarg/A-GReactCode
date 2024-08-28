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

const MemberInformationAccordion = (props) => {
  const { convertToCase, extractDate, getDatePartOnly } = useGetDBTables();

  const [memberInformationData, setMemberInformationData] = useState(
    props.memberInformationData,
  );

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
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const { customAxios: axios } = useAxios();
  const [selectedAddress, setSelectedAddress] = useState([]);
  const [whiteGloveIndicator, setWhiteGloveIndicator] = useState(false);
  const [whiteGloveReason, setWhiteGloveReason] = useState("");
  const [whiteGloveCancelledReason, setWhiteGloveCancelledReason] =
    useState("");
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

  const handleMemberInformationData = (name, value, persist) => {
    const newData = {
      ...memberInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setMemberInformationData(newData);
    if (persist) {
      props.setMemberInformationData(newData);
    }
  };
  const persistMemberInformationData = () => {
    props.setMemberInformationData(memberInformationData);
  };

  const handleWhiteGloveChange = (e) => {
    console.log("shivani1111", e);
    const isChecked = e.target.checked;
    setWhiteGloveIndicator(isChecked);
    setWhiteGloveIndicatorInitialized(true);
    if (isChecked) {
      setWhiteGloveCancelledReason("");
    } else {
      setWhiteGloveReason("");
    }

    //handleMemberInformationData("White_Glove_Indicator", e.target.checked, true);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={memberInformationData}
        onChange={handleMemberInformationData}
        disabled={invalidInputState}
        persist={persistMemberInformationData}
        schema={props.memberInformationValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.memberInformationErrors}
      />
    </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        data={memberInformationData}
        label={label}
        onChange={handleMemberInformationData}
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
        schema={props.memberInformationValidationSchema}
        errors={props.memberInformationErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={memberInformationData}
        options={options}
        onChange={handleMemberInformationData}
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
        schema={props.memberInformationValidationSchema}
        errors={props.memberInformationErrors}
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
        console.log("res", res);
        let resApiData = res.data.CallProcedure_Output?.data || [];
        resApiData = resApiData?.length > 0 ? resApiData : [];
        console.log("procedure ka data", resApiData);
        if (resApiData.length > 0) {
          const respKeys = Object.keys(resApiData);
          respKeys.forEach((k) => {
            let apiResponse = resApiData[k];
            console.log("apiResponse", apiResponse);
            if (
              apiResponse.hasOwnProperty("Date_of_Birth") &&
              typeof apiResponse.Date_of_Birth === "string"
            ) {
              const mad = new Date(getDatePartOnly(apiResponse.Date_of_Birth));
              apiResponse.Date_of_Birth = extractDate(mad);

              console.log("dob-->", mad);
              console.log("dob2-->", extractDate(mad));
            }
            if (
              apiResponse.hasOwnProperty("Plan_Effective_Date") &&
              typeof apiResponse.Plan_Effective_Date === "string"
            ) {
              const mad = new Date(
                getDatePartOnly(apiResponse.Plan_Effective_Date),
              );
              apiResponse.Plan_Effective_Date = extractDate(mad);
              console.log("dob-->", apiResponse.Plan_Effective_Date);
            }

            if (
              apiResponse.hasOwnProperty("Plan_Expiration_Date") &&
              typeof apiResponse.Plan_Expiration_Date === "string"
            ) {
              const mad = new Date(
                getDatePartOnly(apiResponse.Plan_Expiration_Date),
              );
              apiResponse.Plan_Expiration_Date = extractDate(mad);
              console.log("dob-->", apiResponse.Plan_Expiration_Date);
            }
          });

          setResponseData(resApiData);
        }
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
              {renderInputField("Member_ID", "Member ID", 50)}
              {renderInputField("Member_First_Name", "Member First Name", 50)}
              {renderInputField("Member_Last_Name", "Member Last Name", 60)}
            </div>
            <div className="row my-2">
              {renderDatePicker(
                "Date_of_Birth",
                "Date of Birth",
                "Date of Birth",
              )}
              {renderInputField("Members_Age", "Members Age", 50)}
              {renderSelectField("Gender", "Gender", genderValues)}
            </div>
            <div className="row my-2">
              {renderSelectField("Deceased", "Deceased", deceasedValues)}
              {renderSelectField("Dual_Plan", "Dual Plan", dualPlanValues)}
              {renderSelectField(
                "Preferred_Language",
                "Preferred Language",
                preferredLanguageValues,
              )}
            </div>
            <div className="row my-2">
              {renderInputField("Member_IPA", "Member IPA", 50)}
              {renderInputField("Medicare_ID_HICN", "Medicare ID HICN", 50)}
              {renderInputField("Medicaid_ID", "Medicaid ID", 50)}
            </div>
            <div className="row my-2">
              {renderInputField(
                "Primary_Care_Physician_PCP",
                "Primary Care Physician PCP",
                50,
              )}
              {renderInputField("PCP_ID", "PCP ID", 50)}
              {renderInputField("PCP_NPI_ID", "PCP NPI ID", 50)}
            </div>
            <div className="row my-2">
              {renderInputField("ContractPlan_ID", "Contract Plan ID", 50)}
              {renderInputField("Plan_Name", "Plan Name", 50)}
              {renderInputField("Plan_Description", "Plan Description", 240)}
            </div>
            <div className="row my-2">
              {renderInputField("Plan_Code", "Plan Code", 50)}
              {renderDatePicker(
                "Plan_Effective_Date",
                "Plan Effective Date",
                "Plan Effective Date",
              )}
              {renderDatePicker(
                "Plan_Expiration_Date",
                "Plan Expiration Date",
                "Plan Expiration Date",
              )}
            </div>
            <div className="row my-2">
              {renderInputField("Email_ID", "Email ID", 100)}
              {renderSelectField(
                "Mail_to_Address",
                "Mail to Address",
                mailToAddressValues,
              )}
              {renderSelectField(
                "Special_Need_Indicator",
                "Special Need Indicator",
                specialNeedsValues,
              )}
            </div>
            <div className="row my-2">
              {renderInputField("Address_Line_1", "Address Line 1", 100)}
              {renderInputField("Address_Line_2", "Address Line 2", 100)}
              {renderInputField("Action", "Action", 50)}
            </div>
            <div className="row my-2">
              {renderInputField("City", "City", 50)}
              {renderInputField("County", "County", 50)}
              {renderInputField("State_", "State", 240)}
            </div>
            <div className="row ny-2">
              {renderSelectField(
                "Communication_Preference",
                "Communication Preference",
                commPrefValues,
              )}
              {renderInputField("Phone_Number", "Phone Number", 50)}
              {renderInputField("Fax_Number", "Fax Number", 50)}
            </div>
            <div className="row my-2">
              {renderInputField("Zip_Code", "Zip Code", 50)}
              <div
                className="col-xs-6 col-md-4"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <label style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="checkbox"
                    checked={whiteGloveIndicator}
                    onChange={handleWhiteGloveChange}
                    disabled={invalidInputState}
                    style={{ marginRight: "8px" }}
                  />
                  White Glove Indicator?
                </label>
              </div>
            </div>
            <div className="form-floating">
              <input
                id="WhiteGloveReason"
                maxLength="4000"
                type="text"
                className="form-control"
                placeholder="White Glove Reason"
                value={whiteGloveReason}
                onChange={(e) => setWhiteGloveReason(e.target.value)}
                disabled={!whiteGloveIndicator}
              />
              <label>White Glove Reason</label>
              <div
                className="invalid-feedback"
                style={{ display: "block" }}
              ></div>
            </div>

            <div className="form-floating">
              <input
                id="WhiteGloveCancelledReason"
                maxLength="4000"
                type="text"
                className="form-control"
                placeholder="White Glove Cancelled Reason"
                value={whiteGloveCancelledReason}
                onChange={(e) => setWhiteGloveCancelledReason(e.target.value)}
                disabled={
                  whiteGloveIndicator || !whiteGloveIndicatorInitialized
                }
              />
              <label>White Glove Cancelled Reason</label>
              <div
                className="invalid-feedback"
                style={{ display: "block" }}
              ></div>
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
export default MemberInformationAccordion;
