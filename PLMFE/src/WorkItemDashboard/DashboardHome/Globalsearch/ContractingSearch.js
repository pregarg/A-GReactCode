import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FooterComponent from "../../../Components/FooterComponent";
import { useSelector } from "react-redux";
import axios from "axios";
import TableComponent from "../../../util/TableComponent";
import { baseURL } from "../../../api/baseURL";
import viewDataLogo from "../../../Images/viewDataLogo.png";

import { useAxios } from "../../../api/axios.hook";
import useGetDBTables from "../../../Components/CustomHooks/useGetDBTables";
import Select, { components } from "react-select";
import MaterialUiGrid from "../../../Components/CommonComponents/MaterialUIGrid";
import ContractingPop from "./ContractingPop";
import { CardHeader } from "react-bootstrap";
import "./GlobalSearch.css";

import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

export default function ContractingSearch({ openDrawer, setPage }) {
  const navigate = useNavigate();
  const { customAxios } = useAxios();
  const { getTableDetails, trimJsonValues, convertToCase } = useGetDBTables();
  const navigateHome = () => {
    console.log("Inside navigate Home");
    navigate("/Home", { replace: true });
  };
  const navigateToForm = () => {
    // console.log("hello");
  };
  const stateRef = React.createRef();

  const initialState = {
    contractType: {
      value: "",
      isInvalid: false,
      required: true,
    },
    organizationName: {
      value: "",
      isInvalid: false,
      required: true,
    },
    adminfirstName: {
      value: "",
      isInvalid: false,
      required: true,
    },
    adminlastName: {
      value: "",
      isInvalid: false,
      required: true,
    },

    state: {
      value: "",
      isInvalid: false,
      required: true,
    },
    payToNPI: {
      value: "",
      isInvalid: false,
      required: true,
    },
    legalEntityName: {
      value: "",
      isInvalid: false,
      required: true,
    },

    contractId: {
      value: "",
      isInvalid: false,
      required: true,
    },
  };

  const [selectedType, setSelectedType] = useState();
  const [selectedState, setSelectedState] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [isFormValid, setIsFormValid] = useState(true);
  const [providerTableData, setProviderTableData] = useState([]);
  const [facilityAncillaryTableData, setFacilityAncillaryTableData] = useState(
    []
  );
  const token = useSelector((state) => state.auth.token);
  const [visible, setVisible] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [caseUnlockState, setCaseUnlockState] = useState([]);

  const [searchResults, setSearchResults] = useState([]);  
    const [legalNames,setlegalNames] = useState();
    const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const mastersSelector = useSelector((masters) => masters);
  console.log(mastersSelector);

  const typeOptions = ["Provider", "Facility", "Ancillary"];
  const typeOptionsAut = [
    { label: "Provider", value: "Provider" },
    {
      label: "Facility/Ancillary/Health Systems",
      value: "Facility/Ancillary/Health Systems",
    },
  ];
  const stateOptions =
    mastersSelector["masterStateSymbol"].length === 0
      ? []
      : mastersSelector["masterStateSymbol"][0];

  var stateOptionsValue = stateOptions.map((elem) => ({
    label: convertToCase(elem.stateSymbol),
    value: convertToCase(elem.stateSymbol),
  }));

  const showGridCheckbox =
    mastersSelector.hasOwnProperty("auth") &&
    mastersSelector.auth.hasOwnProperty("userType") &&
    mastersSelector.auth.userType === "A"
      ? true
      : false;

  const handleCheckBoxChange = (evnt, ind) => {
    console.log("Inside handleCheckBoxChange event: ", evnt + " index: ", ind);
    let jsn =
      selectedType == "Provider"
        ? providerTableData[ind]
        : facilityAncillaryTableData[ind];
    console.log("Inside handleCheckBoxChange value: ", jsn);
    jsn.isChecked = evnt.target.checked;
    setCaseUnlockState([...caseUnlockState, jsn]);
  };

  //Added Newly by Nidhi Gupta on 08/16/2023
  const multiPlanProviderColumnNames =
    "Prof Areas of Expertise~Prof Areas of Expertise,Delegated Flag~Delegated Flag,Tax Id Number Type~Tax Id Number Type,Wednesday Office Hours~Wednesday Office Hours,Reimbursement Effective Date~Reimbursement Effective Date,Supervising Middle Name~Supervising Middle Name,Max Age Code~Max Age Code,Supervising Physician NPI Number~Supervising Physician NPI Number,DEA Effective Date~DEA Effective Date,Accepts VA~Accepts VA,Attested NPI/Medicaid Combinations~Attested NPI/Medicaid Combinations,Viant Product Id~Viant Product Id,Address Type~Address Type,Incomplete Reason~Incomplete Reason,Contract Entity Name~Contract Entity Name,W9 Name~W9 Name,Flex Field 14~Flex Field 14,Degree~Degree,Saturday Office Hours~Saturday Office Hours,Flex Field 15~Flex Field 15,Flex Field 16~Flex Field 16,Supervising Physician Last  Name~Supervising Physician Last  Name,Demographic SSN~Demographic SSN,Extract Date~Extract Date,Directory Corporate Name~Directory Corporate Name,Percent of Medicaid/Medicare~Percent of Medicaid/Medicare,Friday Office Hours~Friday Office Hours,Hospital Affiliations NPIs~Hospital Affiliations NPIs,Term reason~Term reason,Location Id~Location Id,Practice Email~Practice Email,Tax Id Number~Tax Id Number,Primary Address Indicator~Primary Address Indicator,Flex Field 10~Flex Field 10,Country~Country,Flex Field 11~Flex Field 11,Flex Field 12~Flex Field 12,Flex Field 13~Flex Field 13,Last Name~Last Name,Reimbursement Term Date~Reimbursement Term Date,DEA #~DEA #,License State~License State,MSA (**)~MSA (**),Initial Credential Date~Initial Credential Date,Flex Field 9~Flex Field 9,CE ID~CE ID,Panel Capacity~Panel Capacity,W9 City~W9 City,Thursday Office Hours~Thursday Office Hours,Flex Field 7~Flex Field 7,W9 Other Description~W9 Other Description,Flex Field 8~Flex Field 8,W9 Zip Code~W9 Zip Code,Suite/Apt~Suite/Apt,Prof Services~Prof Services,Billing NPI~Billing NPI,Zip Code~Zip Code,W9 DBA Name~W9 DBA Name,Monday Office Hours~Monday Office Hours,Accepts CHAMPVA~Accepts CHAMPVA,UID User Defined 2~UID User Defined 2,UID User Defined 3~UID User Defined 3,Supervising Physician First  Name~Supervising Physician First  Name,UID User Defined 1~UID User Defined 1,Reserves Indicator~Reserves Indicator,INSERT_CHANGE_DATE~INSERT_CHANGE_DATE,Provider Type~Provider Type,UID User Defined 6~UID User Defined 6,UID User Defined 7~UID User Defined 7,UID User Defined 4~UID User Defined 4,UID User Defined 5~UID User Defined 5,Specialty Code~Specialty Code,Max Age~Max Age,State License #~State License #,Min Age~Min Age,INSERTIONORDERID~INSERTIONORDERID,Directory Last Name~Directory Last Name,Market Description~Market Description,Update Type~Update Type,Telehealth~Telehealth,First Name~First Name,Patient Age Range~Patient Age Range,DEA Expiration Date~DEA Expiration Date,Primary Specialty Code~Primary Specialty Code,Taxonomy Code~Taxonomy Code,W9 Type~W9 Type,Longitude (**)~Longitude (**),Facility Services~Facility Services,Telemonitoring~Telemonitoring,Corporate Name~Corporate Name,Directory First Name~Directory First Name,Provider Board Certification Indicator~Provider Board Certification Indicator,Tuesday Office Hours~Tuesday Office Hours,W9 Address Line 1~W9 Address Line 1,Patient Gender Restriction~Patient Gender Restriction,Date Of Birth~Date Of Birth,Specialty Board Cert Effective Date~Specialty Board Cert Effective Date,Practice Web Address~Practice Web Address,ADA Handicap Accessible~ADA Handicap Accessible,Medicare #~Medicare #,Rate Sheet ID~Rate Sheet ID,City~City,Provider Gender~Provider Gender,Staff language Code~Staff language Code,State License Expiration Date~State License Expiration Date,Provider Termination Date~Provider Termination Date,Primary Facility Code~Primary Facility Code,CONTRACTID~CONTRACTID,Clinical Laboratory Improvement Amendment Cert #(CLIA)~Clinical Laboratory Improvement Amendment Cert #(CLIA),Supervising Physician Specialty~Supervising Physician Specialty,State~State,Directory Suppress~Directory Suppress,Directory Generational Suffix~Directory Generational Suffix,PCP~PCP,W9 Address Line 2~W9 Address Line 2,Min Age Code~Min Age Code,W9 State~W9 State,Record Type~Record Type,Office Phone Number~Office Phone Number,NPI~NPI,Fee Schedule Id~Fee Schedule Id,Contract Signature Authority~Contract Signature Authority,Email Address for Contract Notices~Email Address for Contract Notices,Middle Name~Middle Name,Health Home~Health Home,Language Code~Language Code,Medicaid #~Medicaid #,Electronic Claim Submission Source~Electronic Claim Submission Source,Generational Suffix~Generational Suffix,Outpatient Services~Outpatient Services,Facility Code~Facility Code,Telemedicine~Telemedicine,Latitude (**)~Latitude (**),State License Board Name~State License Board Name,State License Effective Date~State License Effective Date,Hospital Affiliation~Hospital Affiliation,Enhanced ACT Indicator~Enhanced ACT Indicator,Directory Middle Name~Directory Middle Name,TH Step Medicaid~TH Step Medicaid,W9 Suite/Apt~W9 Suite/Apt,Provider Effective Date~Provider Effective Date,County (**)~County (**),Office Fax Number~Office Fax Number,Specialty Board Name~Specialty Board Name,Ethnicity~Ethnicity,Provider ID~Provider ID,Patient Acceptance Indicator~Patient Acceptance Indicator,Sunday Office Hours~Sunday Office Hours,Contract Entity Type~Contract Entity Type,Hospital Based Provider Indicator~Hospital Based Provider Indicator,Address Line 1~Address Line 1,Specialty Board Cert Expiration Date~Specialty Board Cert Expiration Date,Address Line 2~Address Line 2,Last Re-Credential Date~Last Re-Credential Date";
  const multiPlanFacilityAncillaryColumnNames =
    "Legal Entity Name~LEGALENTITYNAME, NPI ID~NPIID, State~STATEVALUE, Pay To NPI~PAYTONPI, SOURCE~SOURCE";
  //Till Here

  const providerColumnNames =
    "Administrator First Name~ADMINISTRATORFIRSTNAME, Administrator Last Name~ADMINISTRATORLASTNAME, Legal Entity Name~LEGALENTITYNAME, Contract Type~CONTRACTTYPE, Contract ID~CONTRACTID,State~STATEVALUE,SOURCE~SOURCE, View Data~VIEWDATA";
  const facilityAncillaryColumnNames =
    "Administrator First Name~ADMINISTRATORFIRSTNAME, Administrator Last Name~ADMINISTRATORLASTNAME, Legal Entity Name~LEGALENTITYNAME, Contract Type~CONTRACTTYPE, Contract ID~CONTRACTID,State~STATEVALUE,SOURCE~SOURCE, View Data~VIEWDATA";

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  // const handleChange = (evt) => {
  //     const value = evt.target.value;
  //     console.log("Inside handleChange ", evt);
  //     setChangeState({
  //         ...changeState,
  //         [evt.target.name]: value
  //     });
  // }

  // const handleDateChange = (date) => {
  //     setChangeState({
  //         ...changeState,
  //         startDate: date
  //     });
  // }
  const [modalData, setModalData] = useState(null);
  const [multiPlanData, setMultiPlanData] = useState([]);
  // const [multiPlanColumns, setMultiPlanColumns] = useState([]);

  const showValues = (data, type) => {
    try {
      if (data?.SOURCE == "MultiPlan") {
        setMultiPlanData([]);
        let getApiJson = {};
        getApiJson["tableNames"] = getTableDetails()["multiPlanTable"];
        getApiJson["whereClause"] = { "Provider ID": data.PROVIDERID };
        // getApiJson['option'] = 'GETMULTIPLANVIEWDATA';
        // getApiJson['ProviderId'] = data.PROVIDERID;
        // getApiJson['procOut'] ='yes';
        console.log("getApiJson: ", getApiJson);
        setModalData(data);

        //axios.post(baseURL + '/generic/callProcedure', getApiJson, { headers: { 'Authorization': `Bearer ${token}` } }).then((res) => {

        customAxios
          .post("/generic/get", getApiJson, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log("Generic get api response: ", res);
            const apiStat = res.data.Status;
            if (apiStat === -1) {
              alert("Error in fetching data");
            }
            if (apiStat === 0) {
              let multiPlanDataVar = res.data.data.multiPlan;

              setMultiPlanData(multiPlanDataVar);
            }
          })
          .catch((err) => {
            console.log(
              "Caught in generic get api for MultiPlan ViewData: ",
              err.message
            );
          });
      } else {
        setModalData(data);
      }
      setShowModal(true);
    } catch (err) {
      console.log("Caught in showValues: ", err.message);
    }
  };

  const validateState = () => {
    let validateStateFlag = 0;
    if (
      formData["state"].value != undefined &&
      formData["state"].value !== ""
    ) {
      Object.keys(formData).forEach((field) => {
        if (
          formData[field].value != undefined &&
          formData[field].value !== ""
        ) {
          validateStateFlag = validateStateFlag + 1;
          console.log("Testing: ", formData[field], formData[field].value);
        }
      });
      if (validateStateFlag < 2) {
        alert(
          "Please select atleast one more field other than State to do Search."
        );
        return false;
      }

      return true;
    }
    return true;
  };

  const validateInput = () => {
    let validateInputCount = 0;
    Object.keys(formData).forEach((field) => {
      if (formData[field].value != undefined && formData[field].value !== "") {
        validateInputCount = validateInputCount + 1;
        console.log("Testing: ", formData[field], formData[field].value);
      }
    });
    if (validateInputCount < 1) {
      alert("Atleast one entry is required to do Search.");
      return false;
    }

    return true;
  };

  const validateForm = () => {
    let isAnyFieldEmpty = true;
    Object.keys(formData).forEach((field) => {
      if (formData[field].required && formData[field].value !== "") {
        isAnyFieldEmpty = false;
      }
      console.log(isAnyFieldEmpty);
    });
    if (isAnyFieldEmpty) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
    console.log(isFormValid);
  };

  const handleOptionSelect =(option,field)=>{
    console.log("handleoption",option);
   // setInputValue(option);
    updateFormData(option,field);
   // setSelectedOption(option);
   setDropdownIsOpen(false);
    setSearchResults([]);
}

const handleInputBlur = () => {
    console.log("InputBlur");
    setTimeout(() => {
        setDropdownIsOpen(false);  
    }, 200);
   
   // setSearchResults([]);
  }; 


// const ArrayOfOptions =['Harshit','Shivani','Prerna','Mohit','Ankit','Sahil','Harsh'];
const searchFunction = (value) => {
    console.log("searchfunction",value);
    let ArrayOfOptions =[];
    // if(selectedType === 'Provider'){
    //   ArrayOfOptions = legalNames[0].Provider;
    // }
    // else if(selectedType === 'Facility' || selectedType === 'Ancillary'){
    //     ArrayOfOptions = legalNames[0]['Faci/Anci']; 
    // }
    ArrayOfOptions = legalNames?.[0]?.Contract;
    console.log("ArrayOfOptions",ArrayOfOptions);
    let filteredResults = [];
    if(ArrayOfOptions !== undefined){
      filteredResults = ArrayOfOptions.filter((elem) =>
      {
       // console.log("element",elem.Name);
        return elem.Name.toLowerCase().includes(value.toLowerCase());
      });
    }
    
    console.log("filteredResults",filteredResults)
    return filteredResults;
  };
  
  const updateFormData = (value, field) => {
    //  const value = e.target.value; 
    if(field === 'legalEntityName'){
      setDropdownIsOpen(true);
      const results = searchFunction(value);
      console.log("result of LEN",results);
       setSearchResults(results); 
    }
      setFormData((prevState) => {
          return {
              ...prevState,
              [field]: {
                  ...prevState[field],
                  value: value.toUpperCase(), //Changed by Nidhi Gupta on 10/16/2023,
                  isInvalid: false
              }
          }
      })
      validateForm();
      
  }



  // const updateFormData = (value, field) => {
  //   setFormData((prevState) => {
  //     return {
  //       ...prevState,
  //       [field]: {
  //         ...prevState[field],
  //         value: value.toUpperCase(), //Changed by Nidhi Gupta on 10/16/2023,
  //         isInvalid: false,
  //       },
  //     };
  //   });
  //   console.log("update was run");
  //   validateForm();
  //   console.log("validate was run");
  // };

  const [typeFieldError, setTypeFieldError] = useState(false);

  const { ValueContainer, Placeholder } = components;
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

  const newSearchHandler = (e) => {
    try {
      e.preventDefault();
      if (!selectedType) {
        setTypeFieldError(true);
        return;
      }
      setTypeFieldError(false);
      console.log("Inside Contracting search");
      setIsSearchClicked(true);
      setIsFormValid(true);
      setProviderTableData([]);
      setFacilityAncillaryTableData([]);
      validateForm();

      // console.log("isFormValid: ", isFormValid);
      if (validateState() && validateInput()) {
        let getApiJson = {};
        getApiJson["option"] = "GETCONTRACTINGSEARCHDATA";
        getApiJson["firstName"] = formData.adminfirstName.value;
        getApiJson["lastName"] = formData.adminlastName.value;
        getApiJson["State"] = formData.state.value;
        getApiJson["LegalEntityName"] = formData.legalEntityName.value;
        getApiJson["contractId"] = formData.contractId.value;
        getApiJson["Type"] = selectedType.toString();
        getApiJson["ContractType"] = formData.contractType.value;
        getApiJson["procOut"] = "yes";
        console.log("getapiJson input", getApiJson);

        let providerMapping = {
          0: "PROVIDERID",
          1: "CONTRACTID",
          2: "FIRSTNAME",
          3: "LASTNAME",
          4: "ORGANIZATIONNAME",
          5: "SUFFIX",
          6: "CAQHID",
          7: "NPIID",
          8: "STATEVALUE",
          9: "PAYTONPI",
          10: "SOURCE",
        };
        let facilityAncillaryMapping = {
          0: "PROVIDERID",
          1: "CONTRACTID",
          2: "LEGALENTITYNAME",
          3: "DBANAME",
          4: "NPIID",
          5: "STATEVALUE",
          6: "PAYTONPI",
          7: "SOURCE",
        };

        axios
          .post(baseURL + "/generic/callProcedure", getApiJson, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const data = res.data.CallProcedure_Output.data;

            console.log("Response data: ", data);

            if (selectedType == "Provider") {
              let providerDataArray = [];

              data?.length === 0 || data === undefined
                ? (providerDataArray = [])
                : data.map((value) => {
                    let obj = {};
                    let finalObj = [];

                    value["VIEWDATA"] = (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          showValues(value, selectedType);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          id="viewDataLogo"
                          src={viewDataLogo}
                          className="img-fluid"
                          alt="..."
                          height={30}
                          width={30}
                        />
                      </div>
                    );
                    finalObj.push(value);

                    providerDataArray.push(finalObj[0]);
                  });

              setProviderTableData(providerDataArray);
            } else {
              let facAncDataArray = [];

              data?.length === 0 || data === undefined
                ? (facAncDataArray = [])
                : data.map((value) => {
                    let obj = {};
                    let finalObj = [];

                    value["VIEWDATA"] = (
                      <div
                        onClick={(e) => {
                          e.preventDefault();
                          showValues(value, selectedType);
                        }}
                        style={{ cursor: "pointer" }}
                      >
                        <img
                          id="viewDataLogo"
                          src={viewDataLogo}
                          className="img-fluid"
                          alt="..."
                          height={30}
                          width={30}
                        />
                      </div>
                    );
                    finalObj.push(value);
                    // });
                    // console.log("Response obj: ",obj);
                    console.log("Response finalObj: ", finalObj);

                    facAncDataArray.push(finalObj[0]);
                  });

              console.log("Response facAncDataArray: ", facAncDataArray);
              setFacilityAncillaryTableData(facAncDataArray);
            }
          })
          .catch((err) => {
            console.log(
              "Error in calling callProcedure option GETCONTRACTINGSEARCHDATA :  ",
              err.message
            );
          });
        setVisible(true);
      }

      if (selectedType == "Provider") {
        setIsProvider(true);
      }
    } 
    catch (error) {
      alert("Error occured in searching data");
      console.log("Caught in newSearchHandler error: ", error);
    }
  };

  const clearFields = (e) => {
    e.preventDefault();
    setFormData(initialState);
    setVisible(false);
    setIsSearchClicked(false);
    //setSelectedType();
    setSelectedState();
    setIsFormValid(false);
  };

    useEffect(() => {
        setVisible(false);
        let getApiJson = {};
        getApiJson['option'] = 'GETLEGALENTITYNAMES';
        getApiJson['Type']='Contracting';
        axios.post(baseURL + '/generic/callProcedure', getApiJson, { headers: { 'Authorization': `Bearer ${token}` } }).then((res) => {
            setlegalNames(res.data.CallProcedure_Output.data);
            console.log("List of Legal Entity Names",legalNames);
        })
    }, [])

  useEffect(() => {
    setFormData(initialState);
    setSelectedState();
    setIsProvider(false);
    setVisible(false);
    setIsFormValid(true);
    setIsSearchClicked(false);
  }, [selectedType]);

  const renderForm = (selectedType) => {
    return (
      <form onSubmit={newSearchHandler} noValidate>
        {/* {(selectedType == "Provider") &&
                ( */}
        <div className="row my-2">
          <div className="col-xs-6 col-md-6">
            <div className="form-floating">
              <input
                type="text"
                className={
                  formData.adminfirstName.isInvalid
                    ? "form-control is-invalid"
                    : "form-control"
                }
                id="adminfirstName"
                placeholder="adminfirstName"
                value={convertToCase(formData.adminfirstName.value)}
                name="adminfirstName"
                onChange={(e) =>
                  updateFormData(e.target.value, "adminfirstName")
                }
              ></input>
              <label htmlFor="floatingInputGrid">
                Administrator First Name
              </label>
              {formData.adminfirstName.isInvalid && (
                <div className="small text-danger">First Name is required</div>
              )}
            </div>
          </div>
          <div className="col-xs-6 col-md-6">
            <div className="form-floating">
              <input
                type="text"
                className={
                  formData.adminlastName.isInvalid
                    ? "form-control is-invalid"
                    : "form-control"
                }
                id="adminlastName"
                placeholder="adminlastName"
                value={convertToCase(formData.adminlastName.value)}
                name="adminlastName"
                onChange={(e) =>
                  updateFormData(e.target.value, "adminlastName")
                }
              ></input>
              <label htmlFor="floatingInputGrid">Administrator Last Name</label>
              {formData.adminlastName.isInvalid && (
                <div className="small text-danger">Last Name is required</div>
              )}
            </div>
          </div>
        </div>
        {/* )
            } */}

        <div className="row my-2">
          <div className="col-xs-6 col-md-6">
            <Select
              styles={{
                control: (provided) => ({
                  ...provided,
                  height: "58px",
                  fontWeight: "lighter",
                }),
                menuList: (provided) => ({
                  ...provided,
                  maxHeight: 200,
                }),

                container: (provided, state) => ({
                  ...provided,
                  marginTop: 0,
                }),
                menu: (provided) => ({ ...provided, zIndex: 9999 }),
                valueContainer: (provided, state) => ({
                  ...provided,
                  overflow: "visible",
                }),
                placeholder: (provided, state) => ({
                  ...provided,
                  position: "absolute",
                  top:
                    state.hasValue || state.selectProps.inputValue
                      ? -15
                      : "50%",
                  transition: "top 0.1s, font-size 0.1s",
                  fontSize:
                    (state.hasValue || state.selectProps.inputValue) && 13,
                }),
              }}
              components={{
                ValueContainer: CustomValueContainer,
              }}
              name="state"
              className="basic-multi-select"
              options={stateOptionsValue}
              ref={stateRef}
              id="state"
              isMulti={false}
              onChange={(option) => {
                console.log("opt", option);
                const val = option !== null ? option.value : "";

                setSelectedState(val);
                updateFormData(val.toString(), "state");
                //  setSelectedState(option.value);
              }}
              selectedValues={selectedState}
              value={{ label: selectedState, value: selectedState }}
              isClearable
              placeholder="State"
              isSearchable={
                document.documentElement.clientHeight >
                document.documentElement.clientWidth
                  ? false
                  : true
              }
            />
          </div>

          {
            <>
              <div className="col-xs-6 col-md-6">
                <div className="form-floating">
                  {/* <input
                    type="text"
                    className={
                      formData.legalEntityName.isInvalid
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    id="legalEntityName"
                    placeholder="legalEntityName"
                    value={convertToCase(formData.legalEntityName.value)}
                    name="legalEntityName"
                    onChange={(e) =>
                      updateFormData(e.target.value, "legalEntityName")
                    }
                  ></input> */}

                    <input type="text" className={formData.legalEntityName.isInvalid ? 'form-control is-invalid' : 'form-control'} id="legalEntityName" placeholder="legalEntityName" 
                            value={convertToCase(formData.legalEntityName.value)} name="legalEntityName" maxLength="100" 
                            onBlur={(event)=> handleInputBlur(event)}
                            onChange={(e) => updateFormData(e.target.value, 'legalEntityName')}
                             />
                                  {formData?.legalEntityName?.value && dropdownIsOpen && ( 
                                     <><ul 
                                     className='uldropdownLen'
                                     style={{listStyleType:'none'}}>
                                        {searchResults.map((result, index) => (
                                        <li className='dropdownListLen' key={index} onClick={(event) => handleOptionSelect(result.Name,'legalEntityName',event)}>
                                            {result.Name}
                                        </li>
                                        ))}
                                    </ul> 
                                    </>)}

                  <label htmlFor="floatingInputGrid">Legal Entity Name</label>
                  {formData.legalEntityName.isInvalid && (
                    <div className="small text-danger">
                      Legal Entity Name is required
                    </div>
                  )}
                </div>
              </div>

              <div className="col-xs-6 col-md-6 my-2">
                <div className="form-floating">
                  <input
                    type="text"
                    className={
                      formData.contractId.isInvalid
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    id="contractId"
                    placeholder="contractId"
                    value={convertToCase(formData.contractId.value)}
                    name="contractId"
                    onChange={(e) =>
                      updateFormData(e.target.value, "contractId")
                    }
                  ></input>
                  <label htmlFor="floatingInputGrid">Contract ID</label>
                  {formData.adminlastName.isInvalid && (
                    <div className="small text-danger">
                      Contract ID is required
                    </div>
                  )}
                </div>
              </div>
            </>
          }
        </div>

        <div className="row my-2">
          <div className="col-xs-12 gap-2 col-md-12 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-outline-primary btnStyle"
              //onClick={newSearchHandler}
            >
              Search
            </button>
            <button
              onClick={clearFields}
              className="btn btn-outline-primary btnStyle"
            >
              Clear
            </button>
          </div>
        </div>

        {visible && isProvider && (
          <div div className="row my-2">
            <div className="row">
              <div className="col-xs-6">
                <TableComponent
                  columnName={providerColumnNames}
                  rowValues={providerTableData}
                  // showCheckBox={showGridCheckbox}
                  navigateToForm={navigateToForm}
                  handleCheckBoxChange={handleCheckBoxChange}
                  makeLink={false}
                />
              </div>
            </div>
          </div>
        )}
        {visible && !isProvider && (
          <div div className="row my-2">
            <div className="row">
              <div className="col-xs-6">
                <TableComponent
                  columnName={facilityAncillaryColumnNames}
                  rowValues={facilityAncillaryTableData}
                  // showCheckBox={showGridCheckbox}
                  navigateToForm={navigateToForm}
                  handleCheckBoxChange={handleCheckBoxChange}
                  makeLink={false}
                />
              </div>
            </div>
          </div>
        )}
      </form>
    );
  };
  const columns = multiPlanProviderColumnNames
    .split(",")
    .map((item, index) => ({ id: index, colName: item.split("~")[0] }));
  const multiPlanCols = columns.map((item) => ({
    field: item.colName,
    headerName: item.colName,
    renderHeader: () => <b>{item.colName}</b>,
    headerClassName: "super-app-theme--header",
    disableColumnMenu: true,
    cellClassName: "super-app-comment",
    sortable: false,
    flex: 1,
    minWidth: item.colName.length > 15 ? 220 : 150,
  }));
  const style1 = {
    margin: "0px 16px 0px 0px",
    fontFamily: "NoirPro, Arial",
    fontWeight: 550,
    lineHeight: 1.8,
    fontSize: "16px",
    color: "rgb(133, 149, 166)",
  };
  const Instructions = () => (
    <Box>
      <Typography sx={style1}>
        The below search screen is defined by Provider, Ancillary, and Facility.
        Please enter one field from the below information, and the data of
        provider(s) associated will populate on the screen. Once the search is
        complete, you may click on the provider to obtain the information.
        Search example: St. Joseph – this will return multiple records with St.
        Joseph. Type in St. Joseph’s Hospital with NPI, the specified Facility
        will populate with this data on the screen.
      </Typography>
    </Box>
  );
  return (
    <Grid
      container
      sx={{ p: 1, backgroundColor: "#F5FEFD", minHeight: "100vh !important" }}
    >
      <Grid>
        <Stack spacing={2} p={2} ml="5px">
          <Breadcrumbs aria-label="breadcrumb">
            <Typography
              onClick={() => setPage("cards")}
              sx={{ cursor: "pointer" }}
            >
              Home
            </Typography>

            <Typography color="text.primary" variant="h6">
              Contracting Search{" "}
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Grid sx={{ p: 1 }}>
          <Grid sx={{ mb: 2 }}>
            <Card
              variant="elevation"
              elevation={4}
              sx={{ height: 270, borderRadius: "12px" }}
            >
              <CardHeader>
                <Typography variant="button" sx={{ fontSize: "18px" }}>
                  INSTRUCTIONS
                </Typography>
              </CardHeader>
              <CardContent>
                <Grid
                  item
                  md={12}
                  spacing={2}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <Grid item md={4}>
                    <Select
                      styles={{
                        control: (provided) => ({
                          ...provided,
                          height: "58px",
                        }),
                        menuList: (provided) => ({
                          ...provided,
                          maxHeight: 200,
                        }),

                        container: (provided, state) => ({
                          ...provided,
                          marginTop: 0,
                        }),
                        valueContainer: (provided, state) => ({
                          ...provided,
                          overflow: "visible",
                        }),
                        placeholder: (provided, state) => ({
                          ...provided,
                          position: "absolute",
                          top:
                            state.hasValue || state.selectProps.inputValue
                              ? -15
                              : "50%",
                          transition: "top 0.1s, font-size 0.1s",
                          fontSize:
                            (state.hasValue || state.selectProps.inputValue) &&
                            13,
                        }),
                      }}
                      components={{
                        ValueContainer: CustomValueContainer,
                      }}
                      name="typeDropdown"
                      className="basic-multi-select"
                      options={typeOptionsAut}
                      id="typeDropdown"
                      isMulti={false}
                      isObject={false}
                      onChange={(option) => {
                        setSelectedType(option.value);
                        setTypeFieldError(false);
                      }}
                      value={{ label: selectedType, value: selectedType }}
                      placeholder="Type"
                    />
                  </Grid>
                  <Grid item md={7.5}>
                    <Instructions />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid>
            {(selectedType == "Provider" ||
              selectedType == "Facility/Ancillary/Health Systems") && (
              <Card
                variant="elevation"
                elevation={4}
                sx={{
                  mb: 1,
                  minHeight: `${
                    selectedType == "Provider" ||
                    selectedType == "Facility/Ancillary/Health Systems"
                      ? "100%"
                      : "100vh"
                  }`,
                  borderRadius: "12px",
                }}
              >
                <CardHeader sx={{ p: 1 }}>
                  <Typography variant="button" sx={{ fontSize: "18px" }}>
                    {`Search ${selectedType}`}
                  </Typography>
                </CardHeader>
                <CardContent display="flex" justifyContent="center">
                  <Grid item md={12} sx={{ mt: 1 }}>
                    {renderForm(selectedType)}
                  </Grid>
                </CardContent>
              </Card>
            )}
          </Grid>
        </Grid>
      </Grid>

      <FooterComponent />

      {showModal && (
        <Dialog
          open={showModal}
          onClose={closeModal}
          maxWidth={"lg"}
          scroll={"paper"}
          aria-describedby="alert-dialog-slide-description"
          sx={{ zIndex: 99, ml: openDrawer ? 30 : 5 }}
        >
          <DialogContent>
            {modalData?.SOURCE == "PDM" ? (
              <ContractingPop
                providerId={modalData?.PROVIDERID}
                contractId={modalData?.CONTRACTID}
                caseNumber={modalData?.CASENUMBER}
                selectedType={selectedType}
                navigateHome={closeModal}
                formNames={selectedType}
              />
            ) : (
              <></>
            )}

            {modalData?.SOURCE == "MultiPlan" ? (
              <>
                <div
                  className="GroupTermination backgroundColor"
                  style={{ minHeight: "100%" }}
                >
                  <div className="cardsContainer" style={{ width: "99%" }}>
                    <div
                      className="cardsContainerChild"
                      style={{ width: "99%" }}
                    >
                      <div
                        className="card"
                        style={{
                          border: "5px solid rgb(101, 101, 233)",
                          minHeight: 350,
                        }}
                      >
                        <div className="col-xs-6" id="caseTable1">
                          <p
                            style={{
                              textAlign: "center",
                              fontSize: "var(--font-size-large-1)",
                              fontWeight: "bold",
                            }}
                          >
                            MultiPlan Data
                            <button
                              className="btn"
                              onClick={(event) => closeModal()}
                              style={{ float: "right" }}
                            >
                              <i className="fa fa-close"></i>
                            </button>
                          </p>
                        </div>
                        <div className="card-body">
                          <Grid item xs={12} md={12} sm={12}>
                            <MaterialUiGrid
                              ExportName={"Multiplan Data"}
                              columns={multiPlanCols}
                              data={multiPlanData?.map((obj, index) => ({
                                ...obj,
                                id: index + 1,
                              }))}
                              pageSize={10}
                              uniqueCol={"id"}
                              density="compact"
                              handleCellClick={() => {}}
                            />
                          </Grid>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}
          </DialogContent>
        </Dialog>
      )}
    </Grid>
  );
}
