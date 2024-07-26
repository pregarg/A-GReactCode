import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {Field, ErrorMessage} from "formik";
import Select, {components} from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ReactDatePicker from "react-datepicker";
import {selectStyle} from "./SelectStyle";
import MemberSearch from "../TileForms/MemberSearch";
import TableComponent from "../../../../src/util/TableComponent";
import {useAxios} from "../../../api/axios.hook";

const MemberInformationAccordion = (props) => {
  const {
    convertToCase,
    extractDate,
    getDatePartOnly
  } = useGetDBTables();

  const [memberInformationData, setMemberInformationData] = useState(props.memberInformationData);

  const angDeceasedSelector = useSelector((state) => state?.masterAngDeceased);
  const angGenderSelector = useSelector((state) => state?.masterAngGender);
  const angDualSelector = useSelector((state) => state?.masterAngDualPlan);
  const mailToAddSelector = useSelector((state) => state?.masterAngMailToAddress);
  const angPrefSelector = useSelector((state) => state?.masterAngPreferredLanguage);
  const commAngPrefSelector = useSelector((state) => state?.masterAngCommPref);
  const token = useSelector((state) => state.auth.token);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [responseData, setResponseData] = useState([]);
  const [showMemberSearch, setShowMemberSearch] = useState(false);
  const {customAxios: axios} = useAxios();
  const [selectedAddress, setSelectedAddress] = useState([]);

  let location = useLocation();

  const [invalidInputState, setInvalidInputState] = useState(false);

  useEffect(() => {
    setInvalidInputState(location.state.formView === "DashboardView" &&
        (location.state.stageName === "Intake" ||
            location.state.stageName === "Acknowledge" ||
            location.state.stageName === "Redirect Review" ||
            location.state.stageName === "Documents Needed" ||
            location.state.stageName === "Research" ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            location.state.stageName === "Reopen" ||
            location.state.stageName === "CaseArchived"))
  }, [location]);

  const handleMemberInformationData = (name, value, persist) => {
    const newData = {...memberInformationData, [name]: typeof value === 'string' ? convertToCase(value) : value};
    setMemberInformationData(newData);
    if (persist) {
      props.setMemberInformationData(newData);
    }
  };
  const persistMemberInformationData = () => {
    props.setMemberInformationData(memberInformationData);
  }

  const wrapPlaceholder = (name, placeholder) => {
    const field = props.memberInformationValidationSchema?.fields?.[name];
    const required = (field?.type === 'date' && field?.internalTests?.optionality) ||
        (field?.tests?.some(test => test.OPTIONS?.name === 'required'));
    return `${placeholder}${required ? ' *' : ''}`;
  };
  const {ValueContainer, Placeholder} = components;
  const CustomValueContainer = ({children, ...props}) => {
    return (
        <ValueContainer {...props}>
          <Placeholder {...props} isFocused={props.isFocused}>
            {wrapPlaceholder(props.selectProps.name, props.selectProps.placeholder)}
          </Placeholder>
          {React.Children.map(children, (child) =>
              child && child.type !== Placeholder ? child : null
          )}
        </ValueContainer>
    );
  };
  const InputField = (name, placeholder, maxLength) => {
    return (
        <>
          <Field name={name}>
            {({
                field,
                meta,
              }) => (
                <div className="form-floating">
                  <input
                      maxLength={maxLength}
                      type="text"
                      id={name}
                      autoComplete="off"
                      className={`form-control ${meta.error
                          ? "is-invalid"
                          : field.value
                              ? "is-valid"
                              : ""
                      }`}
                      placeholder={wrapPlaceholder(name, placeholder)}
                      onChange={(event) => handleMemberInformationData(name, event.target.value)}
                      onBlur={persistMemberInformationData}
                      value={memberInformationData[name]}
                      disabled={invalidInputState}
                  />
                  <label htmlFor="floatingInputGrid">
                    {wrapPlaceholder(name, placeholder)}
                  </label>
                  {meta.error && (
                      <div
                          className="invalid-feedback"
                          style={{display: "block"}}
                      >
                        {meta.error}
                      </div>
                  )}
                </div>
            )}
          </Field>
        </>
    )
  }
  const SelectField = (name, placeholder, options) => <>
    <Field name={name}>
      {({
          meta,
        }) => (
          <div className="form-floating">
            <Select
                styles={{...selectStyle}}
                components={{
                  ValueContainer: CustomValueContainer,
                }}
                isClearable
                isDisabled={
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
                className="basic-multi-select"
                options={options}
                id={name}
                isMulti={false}
                onChange={(value) => handleMemberInformationData(name, value?.value, true)}
                value={memberInformationData[name] ? {
                  label: memberInformationData[name],
                  value: memberInformationData[name]
                } : undefined}
                placeholder={wrapPlaceholder(name, placeholder)}
                isSearchable={
                    document.documentElement.clientHeight <= document.documentElement.clientWidth
                }
            />
            {meta.touched && meta.error && (
                <div
                    className="invalid-feedback"
                    style={{display: "block"}}
                >
                  {meta.error}
                </div>
            )}
          </div>
      )}
    </Field>
    <ErrorMessage
        component="div"
        name={name}
        className="invalid-feedback"
    />
  </>
  const DatePicker = (name, label, placeholder) => {
    const CustomInput = (props) => {
      return (
          <div className="form-floating">
            <input {...props} autoComplete="off" placeholder={wrapPlaceholder(name, placeholder)}/>
            <label htmlFor={name}>{wrapPlaceholder(name, label)}</label>
          </div>
      )
    };
    const dateValue = !!memberInformationData[name + "#date"] ? new Date(memberInformationData[name + "#date"]) : memberInformationData[name];
  //  const dateString = memberInformationData[name + "#date"];
  //  const dateValue = !!dateString ? new Date(dateString) : null; 
   console.log("datevalue", dateValue); //datevalue 1980-01-01
    return (
        <div>
          <ReactDatePicker
              id={name}
              className="form-control example-custom-input-provider"
              selected={dateValue?.value != undefined  ? 
                new Date(dateValue.value)
                : dateValue !== undefined
                    ? new Date(dateValue)
                    : null}
              name={name}
              dateFormat="MM/dd/yyyy"
              onChange={(date) => handleMemberInformationData(name, date, true)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              isClearable
              onKeyDown={(e) => e.preventDefault()}
              dropdownMode="select"
              style={{
                position: "relative",
                zIndex: "999",
              }}
              customInput={<CustomInput/>}
              disabled={
                  location.state.formView === "DashboardView" &&
                  (location.state.stageName === "Redirect Review" ||
                      location.state.stageName === "Effectuate" ||
                      location.state.stageName === "Pending Effectuate" ||
                      location.state.stageName === "Resolve" ||
                      location.state.stageName === "Case Completed" ||
                      location.state.stageName === "Reopen" ||
                      location.state.stageName === "CaseArchived")
              }
          />
        </div>
    )
  };
  console.log("memberInformationData:", memberInformationData);
  const handleShowMemberSearch = () => {
    setShowMemberSearch(true);
  }
  const handleCloseSearch = () => {
    setShowMemberSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  }

  const handleClearMemberSearch = () => {
    setSelectSearchValues([]);
    setSelectedCriteria([]);
    setResponseData([]);
  }
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
    // let addressToPopulate ={...selectedAddress[0]};
    // setMemberInformationData({...memberInformationData,...addressToPopulate});
    setMemberInformationData({...selectedAddress[0]});
  //  setMemberInformationData(prevState => ({
  //   ...prevState,
  //   ...addressToPopulate
  // }));
    setShowMemberSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  }

  const showMembers = async () => {
    let MemberID = selectSearchValues?.memberID;
    let MedicareID = selectSearchValues?.medicareID;
    let MedicaidID = selectSearchValues?.medicaidID;
    let MemberFirstName = selectSearchValues?.memberFirstNameId;
    let MemberLastName = selectSearchValues?.memberLasstNameId;
    let DOB = selectSearchValues?.dateOfBirth;

    // Check if at least one search parameter has a value
    if (MemberID || MedicareID || MedicaidID || MemberFirstName || MemberLastName || DOB) {
      let getApiJson = {
        option: 'GETMEMBERSEARCHDATA',
        Member_ID: MemberID || '',
        Medicare_ID: MedicareID || '',
        Medicaid_ID: MedicaidID || '',
        Member_First_Name: MemberFirstName || '',
        Member_Last_Name: MemberLastName || '',
        Date_of_Birth: extractDate(DOB) || '',
      };

      try {
        let res = await axios.post("/generic/callProcedure", getApiJson, {
          headers: {Authorization: `Bearer ${token}`},
        });
        console.log("res", res)
        let resApiData = res.data.CallProcedure_Output?.data || [];
        resApiData = (resApiData?.length > 0) ? resApiData : [];
        console.log("procedure ka data", resApiData)
        if (resApiData.length > 0) {
          const respKeys = Object.keys(resApiData);
          respKeys.forEach(k => {

            let apiResponse = resApiData[k];
            console.log("apiResponse", apiResponse)
            if (apiResponse.hasOwnProperty("Date_of_Birth") && typeof apiResponse.Date_of_Birth === "string") {
              
              const mad = new Date(getDatePartOnly(apiResponse.Date_of_Birth));
              apiResponse.Date_of_Birth = extractDate(mad);

              console.log("dob-->",mad)
              console.log("dob2-->", extractDate(mad))


            }
            if (apiResponse.hasOwnProperty("Plan_Effective_Date") && typeof apiResponse.Plan_Effective_Date === "string") {
              const mad = new Date(getDatePartOnly(apiResponse.Plan_Effective_Date));
              apiResponse.Plan_Effective_Date = extractDate(mad);
             console.log("dob-->", apiResponse.Plan_Effective_Date)
            }

            if (apiResponse.hasOwnProperty("Plan_Expiration_Date") && typeof apiResponse.Plan_Expiration_Date === "string") {
              const mad = new Date(getDatePartOnly(apiResponse.Plan_Expiration_Date));
             apiResponse.Plan_Expiration_Date = extractDate(mad);
              console.log("dob-->", apiResponse.Plan_Expiration_Date)

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
    let columnNames = 'Action~Action,Member ID~Member_ID,Member First Name~Member_First_Name,Member Last Name~Member_Last_Name,Date of Birth~Date_of_Birth,Plan Code~Plan_Code,ContractPlan ID~ContractPlan_ID,Medicare ID HICN~Medicare_ID_HICN,Plan Name~Plan_Name,Plan Effective Date~Plan_Effective_Date,Plan Expiration Date~Plan_Expiration_Date,Email ID~Email_ID,Phone Number~Phone_Number,Dual Plan~Dual_Plan,Address Line 1~Address_Line_1,Address Line 2~Address_Line_2,Zip Code~Zip_Code,City~City,County~County,State~State_,Preferred Language~Preferred_Language'
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
      )

    } else {
      return (<></>);
    }
  }

  const [deceasedValues, setDeceasedValues] = useState([]);
  const [genderValues, setGenderValues] = useState([]);
  const [dualPlanValues, setDualPlanValues] = useState([]);
  const [mailToAddressValues, setMainToAddressValues] = useState([]);
  const [preferredLanguageValues, setPreferredLanguageValues] = useState([]);
  const [commPrefValues, setCommPrefValues] = useState([]);
  const [specialNeedsValues] = useState([{label: "Yes", value: "Yes"}, {label: "No", value: "No"}]);

  useEffect(() => {
    const kvMapper = e => ({label: convertToCase(e), value: convertToCase(e)});
    const angDeceased = angDeceasedSelector?.[0] || [];
    setDeceasedValues(angDeceased.map(e => e.Deceased).map(kvMapper));

    const angGender = angGenderSelector?.[0] || [];
    setGenderValues(angGender.map(e => e.Gender).map(kvMapper));

    const angDual = angDualSelector?.[0] || [];
    setDualPlanValues(angDual.map(e => e.Dual_Plan).map(kvMapper));

    const mailToAdd = mailToAddSelector?.[0] || [];
    setMainToAddressValues([...new Set(mailToAdd.map(e => convertToCase(e.Mail_to_Address)))].map(kvMapper));

    const angPref = angPrefSelector?.[0] || [];
    setPreferredLanguageValues(angPref.map(e => e.Preferred_Language).map(kvMapper));

    const commAngPref = commAngPrefSelector?.[0] || [];
    setCommPrefValues(commAngPref.map(e => e.Comm_Pref).map(kvMapper));
  },[]);

  return (
    <div>
      <div className="accordion-item" id="memberInformation">
        <h2
            className="accordion-header"
            id="panelsStayOpen-memberInformation"
        >
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
            <button type="button" className="btn btn-outline-primary"
                    onClick={event => handleShowMemberSearch(event)}>Member Search
            </button>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {InputField("Member_ID", "Member ID", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Member_First_Name", "Member FirstName", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Member_Last_Name", "Member Last Name", 60)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {DatePicker("Date_of_Birth", "Date of Birth", "Date of Birth")}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Members_Age", "Members Age", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField("Gender", "Gender", genderValues)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {SelectField("Deceased", "Deceased", deceasedValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField("Dual_Plan", "Dual Plan", dualPlanValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField("Preferred_Language", "Preferred Language", preferredLanguageValues)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {InputField("Member_IPA", "Member IPA", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Medicare_ID_HICN", "Medicare ID HICN", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Medicaid_ID", "Medicaid ID", 50)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {InputField("Primary_Care_Physician_PCP", "Primary Care Physician PCP", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("PCP_ID", "PCP ID", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("PCP_NPI_ID", "PCP NPI ID", 50)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {InputField("ContractPlan_ID", "Contract Plan ID", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Plan_Name", "Plan Name", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Plan_Description", "Plan Description", 240)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {InputField("Plan_Code", "Plan Code", 50)}
              </div>

              <div className="col-xs-6 col-md-4">
                {DatePicker("Plan_Effective_Date", "Plan Effective Date", "Plan Effective Date")}
              </div>
              <div className="col-xs-6 col-md-4">
                {DatePicker("Plan_Expiration_Date", "Plan Expiration Date", "Plan Expiration Date")}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {InputField("Email_ID", "Email ID", 100)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField("Mail_to_Address", "Mail to Address", mailToAddressValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField("Special_Need_Indicator", "Special Need Indicator", specialNeedsValues)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-6">
                {InputField("Address_Line_1", "Address Line 1", 100)}
              </div>
              <div className="col-xs-6 col-md-6">
                {InputField("Address_Line_2", "Address Line 2", 100)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {InputField("City", "City", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("County", "County", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("State_", "State", 240)}
              </div>
            </div>
            <div className="row ny-2">
              <div className="col-xs-6 col-md-4">
                {SelectField("Comm_Pref", "Communication Preference", commPrefValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Phone_Number", "Phone Number", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Fax_Number", "Fax Number", 50)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {InputField("Zip_Code", "Zip Code", 50)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Action", "Action", 50)}
              </div>
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
}
export default MemberInformationAccordion;

