import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import Select, { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ReactDatePicker from "react-datepicker";
import {selectStyle} from "./SelectStyle";
import MemberSearch from "../TileForms/MemberSearch";
import TableComponent from "../../../../src/util/TableComponent";
import {useAxios} from "../../../api/axios.hook";

const MemeberInformationAccordion = (props) => {
    const {
        convertToCase,
        extractDate,
        getDatePartOnly
    } = useGetDBTables();

    const { ValueContainer, Placeholder } = components;
    const [memberInformationData, setMemberInformationData] = useState(props.handleData);
    const mastersSelector = useSelector((masters) => masters);
    const token = useSelector((state) => state.auth.token);
    const [selectedCriteria, setSelectedCriteria] = useState();
    const [selectSearchValues, setSelectSearchValues] = useState();
    const [responseData, setResponseData] = useState([]);
    const [showMemberSearch, setShowMemberSearch] = useState(false);
    const {customAxios: axios} = useAxios();
    let [selectedAddress, setSelectedAddress] = useState([]);
    

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
        setMemberInformationData({...selectedAddress[0]});
        setShowMemberSearch(false);
        setSelectedCriteria([]);
        setSelectSearchValues([]);
        setResponseData([]);
      }
    const tabRef = useRef("HomeView");
    let prop = useLocation();

    const RenderDatePickerPlanEffectiveDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Plan Effective Date" />
            <label htmlFor="datePicker">Plan Effective Date</label>

        </div>
    );
    const RenderDatePickerPlanExpirationDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Plan Expiration Date" />
            <label htmlFor="datePicker">Plan Expiration Date</label>
        </div>
    );
    const RenderDatePickerDateOfBirth = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Date of Birth" />
            <label htmlFor="datePicker">Date of Birth</label>
        </div>
    );

    let deceasedValues = [];
    let genderValues = [];
    let dualPlanValues = [];
    let mailToAddressValues = [];
    let preferredLanguageValues = [];
    let commPrefValues = [];
    let specialNeedsValues = [{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }];

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
            Medicare_ID: MedicareID|| '',
            Medicaid_ID: MedicaidID || '',
            Member_First_Name: MemberFirstName || '',
            Member_Last_Name: MemberLastName || '',
            Date_of_Birth: extractDate(DOB) || '',
          };
    
          try {
            let res = await axios.post("/generic/callProcedure", getApiJson, {
              headers: {Authorization: `Bearer ${token}`},
            });
            console.log("res",res)
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
                  console.log("dob2-->",extractDate(mad))
    
                }
                if (apiResponse.hasOwnProperty("Plan_Effective_Date") && typeof apiResponse.Plan_Effective_Date === "string") {
                    const mad = new Date(getDatePartOnly(apiResponse.Plan_Effective_Date));
                    apiResponse.Plan_Effective_Date = extractDate(mad);
                    console.log("dob-->",apiResponse.Plan_Effective_Date)
                  }
                  
                 if (apiResponse.hasOwnProperty("Plan_Expiration_Date") && typeof apiResponse.Plan_Expiration_Date === "string") {
                        const mad = new Date(getDatePartOnly(apiResponse.Plan_Expiration_Date));
                        apiResponse.Plan_Expiration_Date = extractDate(mad);
                        console.log("dob-->",apiResponse.Plan_Expiration_Date)

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

    useEffect(() => {
        try {
            if (mastersSelector.hasOwnProperty("masterAngDeceased")) {
                const deceasedArray =
                    mastersSelector["masterAngDeceased"].length === 0
                        ? []
                        : mastersSelector["masterAngDeceased"][0];

                for (let i = 0; i < deceasedArray.length; i++) {
                    deceasedValues.push({ label: convertToCase(deceasedArray[i].Deceased), value: convertToCase(deceasedArray[i].Deceased) });
                }
            }

            if (mastersSelector.hasOwnProperty("masterAngGender")) {
                const genderArray =
                    mastersSelector["masterAngGender"].length === 0
                        ? []
                        : mastersSelector["masterAngGender"][0];

                for (let i = 0; i < genderArray.length; i++) {
                    genderValues.push({ label: convertToCase(genderArray[i].Gender), value: convertToCase(genderArray[i].Gender) });
                }
            }

            if (mastersSelector.hasOwnProperty("masterAngDualPlan")) {
                const dualPlanArray =
                    mastersSelector["masterAngDualPlan"].length === 0
                        ? []
                        : mastersSelector["masterAngDualPlan"][0];

                for (let i = 0; i < dualPlanArray.length; i++) {
                    dualPlanValues.push({ label: convertToCase(dualPlanArray[i].Dual_Plan), value: convertToCase(dualPlanArray[i].Dual_Plan) });
                }
            }

            if (mastersSelector.hasOwnProperty("masterAngMailToAddress")) {
                const mailToAddressArray =
                    mastersSelector["masterAngMailToAddress"].length === 0
                        ? []
                        : mastersSelector["masterAngMailToAddress"][0];

                const uniqueMailToAddressValues = {};

                for (let i = 0; i < mailToAddressArray.length; i++) {
                    const mailToAddress = convertToCase(mailToAddressArray[i].Mail_to_Address);
                    if (!uniqueMailToAddressValues[mailToAddress]) {
                        uniqueMailToAddressValues[mailToAddress] = true;
                        mailToAddressValues.push({ label: convertToCase(mailToAddressArray[i].Mail_to_Address), value: convertToCase(mailToAddressArray[i].Mail_to_Address) });
                    }
                }
            }

            if (mastersSelector.hasOwnProperty("masterAngPreferredLanguage")) {
                const preferredLanguageArray =
                    mastersSelector["masterAngPreferredLanguage"].length === 0
                        ? []
                        : mastersSelector["masterAngPreferredLanguage"][0];

                for (let i = 0; i < preferredLanguageArray.length; i++) {
                    preferredLanguageValues.push({ label: convertToCase(preferredLanguageArray[i].Preferred_Language), value: convertToCase(preferredLanguageArray[i].Preferred_Language) });
                }
            }

            if (mastersSelector.hasOwnProperty("masterAngCommPref")) {
                const commPrefArray =
                    mastersSelector["masterAngCommPref"].length === 0
                        ? []
                        : mastersSelector["masterAngCommPref"][0];

                for (let i = 0; i < commPrefArray.length; i++) {
                    commPrefValues.push({ label: convertToCase(commPrefArray[i].Comm_Pref), value: convertToCase(commPrefArray[i].Comm_Pref) });
                }
            }
        } catch (error) {
            console.error("An error occurred in useEffect:", error);
        }
    });

    useEffect(() => {
        console.log("formdatamemberinformation", memberInformationData);
    }, [memberInformationData]);

    return (
        <div className="accordion-item" id="caseHeader">
            <h2
                className="accordion-header"
                id="panelsStayOpen-Header"
            >
                <button
                    className="accordion-button accordionButtonStyle"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseHeader"
                    aria-expanded="true"
                    aria-controls="panelsStayOpen-collapseOne"
                >
                    Member Information
                </button>
            </h2>
            <div
                id="panelsStayOpen-collapseHeader"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-Header"
            >
                <div className="accordion-body">
                <button type="button" class="btn btn-outline-primary" onClick={event => handleShowMemberSearch(event)}>Member Search</button>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="memberid">
                                {({
                                    field,
                                    meta
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            maxLength="50"
                                            type="text"
                                            id="memberid"
                                            className={`form-control ${meta.touched && meta.error
                                                ? "is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Member Id"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Member_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Member_ID')
                                            }
                                            value={convertToCase(memberInformationData['Member_ID'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Member ID
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
                                name="organizationName"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="memberFirstName">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="memberFirstName"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Member First Name"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Member_First_Name': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Member_First_Name')
                                            }
                                            value={convertToCase(memberInformationData['Member_First_Name'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Member First Name
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
                                name="memberfirstname"
                                className="invalid-feedback"
                            />
                        </div>

                        <div className="col-xs-6 col-md-4">
                            <Field name="memberLastName">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            maxLength="60"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value || field.value === null
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Member Last Name"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Member_Last_Name': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Member_Last_Name')
                                            }
                                            value={convertToCase(memberInformationData['Member_Last_Name'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Member Last Name
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
                                name="memberlastname"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <div style={{}}>
                                <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={
                                        // memberInformationData?.Date_of_Birth?.value !== undefined
                                        //     ? new Date(memberInformationData.Date_of_Birth.value)
                                        //     : memberInformationData?.Date_of_Birth !== undefined
                                        //         ? new Date(memberInformationData.Date_of_Birth)
                                        //         : null
                                        
                                        memberInformationData.Date_of_Birth
                                       }
                                    name="dateofbirth"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Date_of_Birth")
                                    }
                                    }
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerDateOfBirth />}
                                    disabled={
                                        prop.state.formView === "DashboardView" &&
                                            (prop.state.stageName === "Redirect Review" ||
                                                prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="membersage">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value || field.value === null
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Member's Age"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Members_Age': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Members_Age')
                                            }
                                            value={convertToCase(memberInformationData['Members_Age'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Member's Age
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
                                name="membersage"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="gender">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <Select
                                            styles={{...selectStyle}}
                                            components={{
                                                ValueContainer: CustomValueContainer,
                                            }}
                                            isClearable
                                            name={field.name}
                                            isDisabled={
                                                prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" ||
                                                    prop.state.stageName === "Effectuate" ||
                                                    prop.state.stageName === "Pending Effectuate" ||
                                                    prop.state.stageName === "Resolve" ||
                                                    prop.state.stageName === "Case Completed" ||
                                                    prop.state.stageName === "Reopen" ||
                                                    prop.state.stageName === "CaseArchived")
                                            }
                                            className="basic-multi-select"
                                            options={genderValues}
                                            id="gender"
                                            isMulti={false}
                                            onChange={(value) => props.handleOnChange(value, 'Gender')}
                                            value={memberInformationData['Gender']}
                                            placeholder="Gender"
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
                                name="gender"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="deceased">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <Select
                                            styles={{...selectStyle}}
                                            components={{
                                                ValueContainer: CustomValueContainer,
                                            }}
                                            isClearable
                                            name={field.name}
                                            isDisabled={
                                                prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" ||
                                                    prop.state.stageName === "Effectuate" ||
                                                    prop.state.stageName === "Pending Effectuate" ||
                                                    prop.state.stageName === "Resolve" ||
                                                    prop.state.stageName === "Case Completed" ||
                                                    prop.state.stageName === "Reopen" ||
                                                    prop.state.stageName === "CaseArchived")
                                            }
                                            className="basic-multi-select"
                                            options={deceasedValues}
                                            id="deceased"
                                            isMulti={false}
                                            onChange={(value) => props.handleOnChange(value, 'Deceased')}
                                            value={memberInformationData['Deceased']}
                                            placeholder="Deceased"
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
                                name="gender"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="dualplan">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <Select
                                            styles={{...selectStyle}}
                                            components={{
                                                ValueContainer: CustomValueContainer,
                                            }}
                                            isClearable
                                            name={field.name}
                                            isDisabled={
                                                prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" ||
                                                    prop.state.stageName === "Effectuate" ||
                                                    prop.state.stageName === "Pending Effectuate" ||
                                                    prop.state.stageName === "Resolve" ||
                                                    prop.state.stageName === "Case Completed" ||
                                                    prop.state.stageName === "Reopen" ||
                                                    prop.state.stageName === "CaseArchived")
                                            }
                                            className="basic-multi-select"
                                            options={dualPlanValues}
                                            id="dualplan"
                                            isMulti={false}
                                            onChange={(value) => props.handleOnChange(value, 'Dual_Plan')}
                                            value={memberInformationData['Dual_Plan']}
                                            placeholder="Dual Plan"
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
                                name="dualplan"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="preferredlanguage">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <Select
                                            styles={{...selectStyle}}
                                            components={{
                                                ValueContainer: CustomValueContainer,
                                            }}
                                            isClearable
                                            name={field.name}
                                            isDisabled={
                                                prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" ||
                                                    prop.state.stageName === "Effectuate" ||
                                                    prop.state.stageName === "Pending Effectuate" ||
                                                    prop.state.stageName === "Resolve" ||
                                                    prop.state.stageName === "Case Completed" ||
                                                    prop.state.stageName === "Reopen" ||
                                                    prop.state.stageName === "CaseArchived")
                                            }
                                            className="basic-multi-select"
                                            options={preferredLanguageValues}
                                            id="preferredlanguage"
                                            isMulti={false}
                                            onChange={(value) => props.handleOnChange(value, 'Preferred_Language')}
                                            value={memberInformationData['Preferred_Language']}
                                            placeholder="Preferred Language"
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
                                name="preferredlanguage"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="memberIPA">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="memberipa"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Member IPA"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Member_IPA': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Member_IPA')
                                            }
                                            value={convertToCase(memberInformationData['Member_IPA'])}

                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Member IPA
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
                                name="Mmeber IPA"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="medicareId(HCIN)">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="meicareid(HCIN)"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Medicare Id(HCIN)"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Medicare_ID_HICN': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Medicare_ID_HICN')
                                            }
                                            value={convertToCase(memberInformationData['Medicare_ID_HICN'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Medicare ID(HICN)
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
                                name="medicareid(HCIN)"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="medicaicId">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="medicaidId(HCIN)"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Medicaid Id"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Medicaid_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Medicaid_ID')
                                            }
                                            value={convertToCase(memberInformationData['Medicaid_ID'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Medicaid ID
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
                                name="medicaidId"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="primarycarephysician(PCP)">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="primarycarephysician(PCP)"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Primary Care Physician(PCP)"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Primary_Care_Physician_PCP': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Primary_Care_Physician_PCP')
                                            }
                                            value={convertToCase(memberInformationData['Primary_Care_Physician_PCP'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Primary Care Physician(PCP)
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
                                name="medicaidId"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="pcpId">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="pcpId"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="PCP ID"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'PCP_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'PCP_ID')
                                            }
                                            value={convertToCase(memberInformationData['PCP_ID'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            PCP ID
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
                                name="pcpid"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="pcpnpiId">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="pcpnpiId"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="PCP NPI ID"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'PCP_NPI_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'PCP_NPI_ID')
                                            }
                                            value={convertToCase(memberInformationData['PCP_NPI_ID'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            PCP NPI ID
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
                                name="pcpnpiid"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="contract/PlanId">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="contract/PlanId"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Contract/ Plan Id"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'ContractPlan_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'ContractPlan_ID')
                                            }
                                            value={convertToCase(memberInformationData['ContractPlan_ID'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Contract / Plan Id
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
                                name="contract/planid"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="planName">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="planname"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Plan Name"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Plan_Name': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Plan_Name')
                                            }
                                            value={convertToCase(memberInformationData['Plan_Name'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Plan Name
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
                                name="Plan Name"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="planDescription">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="planDescription"
                                            maxLength="240"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Plan Description"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Plan_Description': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Plan_Description')
                                            }
                                            value={convertToCase(memberInformationData['Plan_Description'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Plan Description
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
                                name="planDescription"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="planCode">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="planCode"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Plan Code"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Plan_Code': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Plan_Code')
                                            }
                                            value={convertToCase(memberInformationData['Plan_Code'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Plan Code
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
                                name="plancode"
                                className="invalid-feedback"
                            />
                        </div>

                        <div className="col-xs-6 col-md-4">
                            <div style={{}}>
                                <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={
                                        // memberInformationData?.
                                        // Plan_Effective_Date?.value !== undefined
                                        //     ? new Date(memberInformationData.
                                        //         Plan_Effective_Date
                                        //         .value)
                                        //     : memberInformationData?.
                                        //     Plan_Effective_Date
                                        //      !== undefined
                                        //         ? new Date(memberInformationData.
                                        //             Plan_Effective_Date
                                        //             )
                                        //         : null
                                        
                                         memberInformationData.Plan_Effective_Date
                                        }
                                    name="planeffectivedate"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Plan_Effective_Date")
                                    }
                                    }
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerPlanEffectiveDate />}
                                    disabled={
                                        prop.state.formView === "DashboardView" &&
                                            (prop.state.stageName === "Redirect Review" ||
                                                prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                            ? true
                                            : false
                                    }
                                />
                            </div>

                        </div>
                        <div className="col-xs-6 col-md-4">
                            <div style={{}}>
                                <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={
                                        // memberInformationData?.Plan_Expiration_Date?.value !== undefined
                                        // ? new Date(memberInformationData.Plan_Expiration_Date.value)
                                        // : memberInformationData?.Plan_Expiration_Date !== undefined
                                        //     ? new Date(memberInformationData.Plan_Expiration_Date)
                                        //     : null
                                        memberInformationData.Plan_Expiration_Date
                                        }
                                    name="planexpirationdate"
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    isClearable
                                    onKeyDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onChange={(date, event) => {

                                        props.handleOnChange(date, "Plan_Expiration_Date")
                                    }
                                    }
                                    style={{
                                        position: "relative",
                                        zIndex: "999",
                                    }}
                                    customInput={<RenderDatePickerPlanExpirationDate />}
                                    disabled={
                                        prop.state.formView === "DashboardView" &&
                                            (prop.state.stageName === "Redirect Review" ||
                                                prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                            ? true
                                            : false
                                    }
                                />
                            </div>
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="emailid">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="emailid"
                                            maxLength="100"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Email ID"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Email_ID': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Email_ID')
                                            }
                                            value={convertToCase(memberInformationData['Email_ID'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Email ID
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
                                name="emailid"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="mailtoaddress">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <Select
                                            styles={{...selectStyle}}
                                            components={{
                                                ValueContainer: CustomValueContainer,
                                            }}
                                            isClearable
                                            name={field.name}
                                            isDisabled={
                                                prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" ||
                                                    prop.state.stageName === "Effectuate" ||
                                                    prop.state.stageName === "Pending Effectuate" ||
                                                    prop.state.stageName === "Resolve" ||
                                                    prop.state.stageName === "Case Completed" ||
                                                    prop.state.stageName === "Reopen" ||
                                                    prop.state.stageName === "CaseArchived")
                                            }
                                            className="basic-multi-select"
                                            options={mailToAddressValues}
                                            id="mailtoaddress"
                                            isMulti={false}
                                            onChange={(value) => props.handleOnChange(value, 'Mail_to_Address')}
                                            value={memberInformationData['Mail_to_Address']}
                                            placeholder="Mail To Address"
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
                                name="mailtoaddress"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="specialneeds">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <Select
                                            styles={{...selectStyle}}
                                            components={{
                                                ValueContainer: CustomValueContainer,
                                            }}
                                            isClearable
                                            name={field.name}
                                            isDisabled={
                                                prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" ||
                                                    prop.state.stageName === "Effectuate" ||
                                                    prop.state.stageName === "Pending Effectuate" ||
                                                    prop.state.stageName === "Resolve" ||
                                                    prop.state.stageName === "Case Completed" ||
                                                    prop.state.stageName === "Reopen" ||
                                                    prop.state.stageName === "CaseArchived")
                                            }
                                            className="basic-multi-select"
                                            options={specialNeedsValues}
                                            id="specialneeds"
                                            isMulti={false}
                                            onChange={(value) => props.handleOnChange(value, 'Special_Need_Indicator')}
                                            value={memberInformationData['Special_Need_Indicator']}
                                            placeholder="Special Need Indicator"
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
                                name="specialneeds"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-6">
                            <Field name="addressline1">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="addressline1"
                                            maxLength="100"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Address Line 1"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Address_Line_1': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Address_Line_1')
                                            }
                                            value={convertToCase(memberInformationData['Address_Line_1'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Address Line 1
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
                                name="addressline1"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-6">
                            <Field name="addressline2">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="addressline2"
                                            maxLength="100"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Address Line 2"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Address_Line_2': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Address_Line_2')
                                            }
                                            value={convertToCase(memberInformationData['Address_Line_2'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Address Line 2
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
                                name="addressline2"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="city">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="city"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="City"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'City': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'City')
                                            }
                                            value={convertToCase(memberInformationData['City'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            City
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
                                name="city"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="county">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="county"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="County"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'County': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'County')
                                            }
                                            value={convertToCase(memberInformationData['County'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            County
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
                                name="county"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="state">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="state_"
                                            maxLength="240"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="State"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'State_': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'State_')
                                            }
                                            value={convertToCase(memberInformationData['State_'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            State
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
                                name="state_"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row ny-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="commpref">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <Select
                                            styles={{...selectStyle}}
                                            components={{
                                                ValueContainer: CustomValueContainer,
                                            }}
                                            isClearable
                                            name={field.name}
                                            isDisabled={
                                                prop.state.formView === "DashboardView" &&
                                                (prop.state.stageName === "Redirect Review" ||
                                                    prop.state.stageName === "Documents Needed" ||
                                                    prop.state.stageName === "Effectuate" ||
                                                    prop.state.stageName === "Pending Effectuate" ||
                                                    prop.state.stageName === "Resolve" ||
                                                    prop.state.stageName === "Case Completed" ||
                                                    prop.state.stageName === "Reopen" ||
                                                    prop.state.stageName === "CaseArchived")
                                            }
                                            className="basic-multi-select"
                                            options={commPrefValues}
                                            id="commpref"
                                            isMulti={false}
                                            onChange={(value) => props.handleOnChange(value, 'Communication_Preference')}
                                            value={memberInformationData['Communication_Preference']}
                                            placeholder="Communication Preference"
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
                                name="commpref"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="phonenumber">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="phonenumber"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Phone Number"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Phone_Number': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Phone_Number')
                                            }
                                            value={convertToCase(memberInformationData['Phone_Number'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Phone Number
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
                                name="phonenumber"
                                className="invalid-feedback"
                            />
                        </div>
                        <div className="col-xs-6 col-md-4">
                            <Field name="faxnumber">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="faxnumber"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Fax Number"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Fax_Number': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Fax_Number')
                                            }
                                            value={convertToCase(memberInformationData['Fax_Number'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Fax Number
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
                                name="faxnumber"
                                className="invalid-feedback"
                            />
                        </div>
                    </div>
                    <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                            <Field name="zipcode">
                                {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                }) => (
                                    <div className="form-floating">
                                        <input
                                            id="zipcode"
                                            maxLength="50"
                                            type="text"
                                            className={`form-control ${meta.touched && meta.error
                                                ? " is-invalid"
                                                : field.value
                                                    ? "is-valid"
                                                    : ""
                                                }`}
                                            placeholder="Zip Code"
                                            {...field}
                                            onChange={(event) => {
                                                setMemberInformationData({ ...memberInformationData, 'Zip_Code': event.target['value'] })
                                            }}
                                            onBlur={(event) =>
                                                props.handleOnChange(event.target['value'], 'Zip_Code')
                                            }
                                            value={convertToCase(memberInformationData['Zip_Code'])}
                                            disabled={
                                                prop.state.formView === "DashboardView" &&
                                                    (prop.state.stageName === "Redirect Review" ||
                                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                                    ? true
                                                    : false
                                            }
                                        />
                                        <label htmlFor="floatingInputGrid">
                                            Zip Code
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
                                name="zipcode"
                                className="invalid-feedback"
                            />
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
            handleClearMemberSearch ={handleClearMemberSearch}
            showMemberSearch = {showMemberSearch}
            showMembers = {showMembers}
            memberSearchTableComponent={memberSearchTableComponent}
            handleSelectedMembers = {handleSelectedMembers}
            />
        )}
        </div>
      

    );
}
export default MemeberInformationAccordion;

