
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { FormikInputField } from "../Common/FormikInputField";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";

const CtmMemberInformationAccordion = (props) => {
const { convertToCase, extractDate, getDatePartOnly } = useGetDBTables();
 const ctmConfigData = JSON.parse(process.env.REACT_APP_CTMHEADER_DETAILS);
  const stageName = ctmConfigData["StageName"];

  const [ctmMemberData, setCtmMemberData] = useState(props.ctmMemberData );
//  const [ctmMemberData, setCtmMemberData] = useState({
//      ...props.ctmMemberData,
//      Mail_to_Address: props.ctmMemberData?.Mail_to_Address || "DEFAULT"
//  });
  const location = useLocation();
 const [invalidInputState, setInvalidInputState] = useState(false);
const [residentialMandatory, setResidentialMandatory] = useState(false);
 const [responseData, setResponseData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);
const [temporaryMandatory, setTemporaryMandatory] = useState(false);


const primaryMemberSelector = useSelector(
    (state) => state?.masterCtmDropDown,
  );
const mailToAddSelector = useSelector(
    (state) => state?.masterAngMailToAddress,
  );
 const addressTypeSelector = useSelector(
     (state) => state?.masterCTMAddressType,
   );
  const masterCtmDropDownSelector = useSelector(
        (state) => state?.masterCtmDropDown,
      );

 const [whiteGloveIndicator, setWhiteGloveIndicator] = useState(props.ctmMemberData?.isChecked === '1');
 const [whiteGloveIndicatorInitialized, setWhiteGloveIndicatorInitialized] =
     useState(false);

  useEffect(() => {
    setInvalidInputState(
      location.state?.formView === "DashboardView" &&
      ["Redirect Review", "Documents Needed", "Effectuate", "Case Completed"].includes(location.state?.stageName)
    );
  }, [location]);

useEffect(() => {
    const mailingType = ctmMemberData.Mail_to_Address;
    if (mailingType === "Default") {
      setResidentialMandatory(true);
      setTemporaryMandatory(false);
    } else if (mailingType === "Alternate") {
      setResidentialMandatory(false);
      setTemporaryMandatory(true);
    } else {
      setResidentialMandatory(false);
      setTemporaryMandatory(false);
    }
  }, [ctmMemberData.Mail_to_Address]);

  const handleWhiteGloveChange = (e) => {
      const isChecked = e.target.checked;
      setWhiteGloveIndicator(isChecked);

      let updatedData = {
          ...ctmMemberData,
          isChecked: isChecked ? '1' : '',
          WhiteGloveCancelledReason: isChecked ? "" : ctmMemberData.WhiteGloveCancelledReason,
          WhiteGloveReason: !isChecked ? "" : ctmMemberData.WhiteGloveReason
      };

      props.setCtmMemberData(updatedData);
  };


 const handleCtmMemInformationBlur = (e) => {
    const scrollPosition = window.scrollY; // Save current scroll position

    const { name, value } = e.target;
    const updatedData = {
      ...ctmMemberData,
      [name]: value.toUpperCase(),
    };

    props.setCtmMemberData(updatedData); // Backend update
    window.scrollTo(0, scrollPosition); // Restore scroll position
  };
   const handleLocalStateUpdate = (name, value) => {
      setCtmMemberData((prevState) => ({
        ...prevState,
        [name]: value.toUpperCase(),
      }));
    };

  const persistCtmMemberData = () => {
    try {
      if (typeof props.setCtmMemberData === "function") {
        props.setCtmMemberData(ctmMemberData);
      } else {
        console.warn("setCtmMemberData is not a function.");
      }
    } catch (error) {
      console.error("Error in persistCtmMemberData:", error);
    }
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


//const handleFieldChange = (name, value, persist = false) => {
//  if (
//    (name === "Alternate_Phone_Number" ||
//     name.includes("Zip_Code") ||
//     name === "Fax_Number") && /\D/.test(value) // Checks if input contains non-numeric characters
//  ) {
//    alert(`${name.replace(/_/g, " ")} should contain only numbers.`);
//    return; // Prevents updating the state with invalid input
//  }
//
//  const newData = { ...ctmMemberData,
//   [name]: value || "",
//  };
//  setCtmMemberData({...newData});
//  if (persist) {
//    persistCtmMemberData();
//  }
//};
 const handleCtmMemberInformationData = (name, value, persist= false) => {
    const newData = {
      ...ctmMemberData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    if (
        (name === "Alternate_Phone_Number" ||
         name.includes("Zip_Code") ||
         name === "Fax_Number") && /\D/.test(value) // Checks if input contains non-numeric characters
      ) {
        alert(`${name.replace(/_/g, " ")} should contain only numbers.`);
        return; // Prevents updating the state with invalid input
      }


    setCtmMemberData(newData);
    if (persist) {
      props.setCtmMemberData(newData);
    }
  };

const renderInputField = (name, placeholder, maxLength) => (
  <div className="col-xs-6 col-md-4">
    <FormikInputField
      name={name}
      placeholder={placeholder}
      data={ctmMemberData}
      onChange={handleCtmMemberInformationData}
      onBlur={(e) => {
        if (
          (name === "Alternate_Phone_Number" || name.includes("Zip_Code")) &&
          /\D/.test(e.target.value) // Checks if input contains non-numeric characters
        ) {
          alert(`${placeholder} should contain only numbers.`);
        }
      }}
      disabled={invalidInputState}
      persist={persistCtmMemberData}
      schema={props.ctmMemberValidationSchema}
      displayErrors={props.shouldShowSubmitError}
      errors={props.ctmMemberErrors}
    />
  </div>
);

  const renderDatePicker = (name, placeholder, label) => (
    <div className="col-xs-6 col-md-4">
      <FormikDatePicker
        name={name}
        placeholder={placeholder}
        data={ctmMemberData}
        label={label}
        onChange={handleCtmMemberInformationData}
        disabled={invalidInputState}
        persist={persistCtmMemberData}
        schema={props.ctmMemberValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.ctmMemberErrors}
      />
    </div>
  );

  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={ctmMemberData}
        options={options}

        onChange={handleCtmMemberInformationData}
        disabled={invalidInputState}
        persist={persistCtmMemberData}
        schema={props.ctmMemberValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.ctmMemberErrors}
      />
    </div>
  );
 const [primaryMemberValues, setPrimaryMemberValues] = useState([]);
  const [mailToAddressValues, setMainToAddressValues] = useState([]);
  const [addressTypeValues, setAddressTypeValues] = useState([]);
  const [ctmDropDownValues, setCtmDropDownValues] = useState([]);
useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });


    const mailToAdd = mailToAddSelector?.[0] || [];
    setMainToAddressValues(
      [...new Set(mailToAdd.map((e) => convertToCase(e.Mail_to_Address)))].map(
        kvMapper,
      ),
    );

 const ctmDropDown = masterCtmDropDownSelector?.[0] || [];
      setCtmDropDownValues(
            [...new Set(ctmDropDown.map((e) => convertToCase(e.Drop_Down)))].map(
              kvMapper,
            ),
          );

const addressType= addressTypeSelector?.[0] || [];
    setAddressTypeValues(
      [...new Set(addressType.map((e) => convertToCase(e.Address_Type)))].map(
        kvMapper,
      ),
    );
 const primaryMember= primaryMemberSelector?.[0] || [];
     setPrimaryMemberValues(
       [...new Set(primaryMember.map((e) => convertToCase(e.Primary_Member)))].map(
         kvMapper,
       ),
     );

  }, []);

return (
  <div className="accordion-item" id="ctmMemberInformation">
    <h2 className="accordion-header" id="panelsStayOpen-ctmMemberInformation">
      <button
        className="accordion-button accordionButtonStyle"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#panelsStayOpen-collapseCtmMemberInformation"
        aria-expanded="true"
        aria-controls="panelsStayOpen-collapseCtmMemberInformation"
      >
        Member Information
      </button>
    </h2>
    <div
      id="panelsStayOpen-collapseCtmMemberInformation"
      className="accordion-collapse collapse show"
      aria-labelledby="panelsStayOpen-ctmMemberInformation"
    >

        <div className="accordion-body">
          <div className="row my-2">
            {renderInputField("Issue_Number", "Issue Number", 50)}
            {renderSelectField("Primary_Member", "Primary Member", ctmDropDownValues)}
            {renderInputField("Member_ID", "Member ID", 50)}
          </div>
          <div className="row my-2">
            {renderInputField("Member_First_Name", "Member First Name", 50)}
            {renderInputField("Member_Middle_Initial", "Member Middle Initial",50)}
            {renderInputField("Member_Last_Name", "Member Last Name", 50)}
          </div>
          <div className="row my-2">
            {renderInputField("Seq_Member_ID", "Seq Member ID", 50)}
            {renderInputField("Contract_ID", "Contract ID", 50)}
            {renderInputField("Plan_Code", "Plan Code", 50)}
          </div>
          <div className="row my-2">
            {renderInputField("MBI", "MBI", 50)}
            {renderInputField("HICN", "HICN", 50)}
            {renderInputField("Medicaid_Id", "Medicaid ID", 50)}
          </div>
          <div className="row my-2">
            {renderDatePicker("Plan_Effective_Date#date", "Plan Effective Date", "Plan Effective Date")}
            {renderDatePicker("Plan_Expiration_Date#date", "Plan Expiration Date", "Plan Expiration Date")}
            {renderInputField("CRM_Ticket", "CRM Ticket #", 50)}
          </div>
          <div className="row my-2">
            {renderInputField("Plan_Name", "Plan Name", 100)}
            {renderInputField("PCP_Name", "PCP Name", 50)}
            {renderInputField("PBP", "PBP", 50)}
          </div>
          <div className="row my-2">
            {renderDatePicker("Date_of_Birth#date", "Date of Birth", "Date of Birth")}
            {renderInputField("Gender", "Gender", 10)}
            {renderInputField("Email_Id", "Email ID", 100)}
          </div>
          <div className="row my-2">
            {renderInputField("Home_Phone", "Home Phone", 15)}
            {renderInputField("Mobile_Phone", "Mobile Phone", 15)}
            {renderInputField("Dual_Plan", "Dual Plan",  50)}
          </div>
          <div className="row my-2">
            {renderInputField("Preferred_Language", "Preferred Language", 50)}
            {renderSelectField("Mail_to_Address", "Mail to Address?", mailToAddressValues)}
            {renderInputField("Fax_Number", "Fax Number", 15)}
          </div>

          <div className="row my-2">

            {renderInputField("Communication_Preference", "Communication Preference", 50)}
          </div>

          {/** Moved White Glove Section **/}
          <div className="row my-2">
            <div
              className="col-xs-6 col-md-4"
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "center",
              }}
            >
              <label>
                <input
                  type="checkbox"
                  checked={whiteGloveIndicator}
                  onChange={handleWhiteGloveChange}
                  style={{ marginRight: "8px" }}
                />
                White Glove Indicator?
              </label>
            </div>
          </div>
          <div className="form-floating">
            <input
              id="WhiteGloveReason"
              name="WhiteGloveReason"
              maxLength="4000"
              type="text"
              className="form-control"
              placeholder="White Glove Reason"
              value={ctmMemberData.WhiteGloveReason || ""}
              onBlur={(e) => handleCtmMemInformationBlur(e)}
              onChange={(e) => handleLocalStateUpdate(e.target.name, e.target.value)}
              disabled={!whiteGloveIndicator}
            />
            <label>White Glove Reason</label>
            <div className="invalid-feedback" style={{ display: "block" }}></div>
          </div>
          <div className="form-floating">
            <input
              id="WhiteGloveCancelledReason"
              name="WhiteGloveCancelledReason"
              maxLength="4000"
              type="text"
              className="form-control"
              placeholder="White Glove Cancelled Reason"
              value={ctmMemberData.WhiteGloveCancelledReason || ""}
              onBlur={(e) => handleCtmMemInformationBlur(e)}
              onChange={(e) => handleLocalStateUpdate(e.target.name, e.target.value)}
              disabled={whiteGloveIndicator}
            />
            <label>White Glove Cancelled Reason</label>
            <div className="invalid-feedback" style={{ display: "block" }}></div>
          </div>

          {/** Member Residential Address Section **/}
          <div className="sub-title">Member Residential Address</div>
          <div className="row my-2">
            {renderSelectField("Residential_Address_Type", "Address Type", addressTypeValues)}
            {renderInputField("Residential_Address_Line_1", "Address Line 1", 100, )}
            {renderInputField("Residential_Address_Line_2", "Address Line 2", 100)}
          </div>
          <div className="row my-2">
            {renderInputField("Residential_Zip_Code", "Zip Code", 10)}
            {renderInputField("Residential_City", "City", 50)}
            {renderInputField("Residential_County", "County", 50)}
          </div>
          <div className="row my-2">
            {renderInputField("Residential_Region", "Region", 50)}
            {renderInputField("Residential_State", "State", 50)}
          </div>

          <div className="sub-title">Member Mailing Address</div>
          <div className="row my-2">
            {renderSelectField("Mailing_Address_Type", "Address Type", addressTypeValues)}
            {renderInputField("Mailing_Address_Line_1", "Address Line 1", 100)}
            {renderInputField("Mailing_Address_Line_2", "Address Line 2", 100)}
          </div>
          <div className="row my-2">
            {renderInputField("Mailing_Zip_Code", "Zip Code", 10)}
            {renderInputField("Mailing_City", "City", 50)}
            {renderInputField("Mailing_County", "County", 50)}
          </div>
          <div className="row my-2">
            {renderInputField("Mailing_Region", "Region", 50)}
            {renderInputField("Mailing_State", "State", 50)}
          </div>

          <div className="sub-title">Member Temporary Address</div>
          <div className="row my-2">
            {renderSelectField("Temporary_Address_Type", "Address Type", addressTypeValues)}
            {renderInputField("Temporary_Address_Line_1", "Address Line 1", 100)}
            {renderInputField("Temporary_Address_Line_2", "Address Line 2", 100)}
          </div>
          <div className="row my-2">
            {renderInputField("Temporary_Zip_Code", "Zip Code", 10)}
            {renderInputField("Temporary_City", "City", 50)}
            {renderInputField("Temporary_County", "County", 50)}
          </div>
          <div className="row my-2">
            {renderInputField("Temporary_Region", "Region", 50)}
            {renderInputField("Temporary_State", "State", 50)}
            {renderInputField("Alternate_Phone_Number", "Alternate Phone Number", 15)}
          </div>
        </div>

    </div>
  </div>
);

};

export default CtmMemberInformationAccordion;
