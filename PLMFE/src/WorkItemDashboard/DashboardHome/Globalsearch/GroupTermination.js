import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import FooterComponent from "../../../Components/FooterComponent";
import { useSelector } from "react-redux";
import axios from "axios";
import TableComponent from "../../../util/TableComponent";
import { baseURL } from "../../../api/baseURL";
import viewDataLogo from "../../../Images/viewDataLogo.png";
import Globalsearch from "./Globalsearch";
import { CardHeader, Modal } from "react-bootstrap";
import { useAxios } from "../../../api/axios.hook";
import useGetDBTables from "../../../Components/CustomHooks/useGetDBTables";
import Select, { components } from "react-select";
import "./GlobalSearch.css";
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Dialog,
  DialogContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import MaterialUiGrid from "../../../Components/CommonComponents/MaterialUIGrid";

export default function GroupTermination({ openDrawer, setPage }) {
  const navigate = useNavigate();
  const { customAxios } = useAxios();
  const { getTableDetails, trimJsonValues, convertToCase } = useGetDBTables();
  const [expanded, setExpanded] = React.useState(true);

  const navigateHome = () => {
    navigate("/Home", { replace: true });
  };
  const navigateToForm = () => {};

  const stateRef = React.createRef();

  const initialState = {
    providerNPI: {
      value: "",
      isInvalid: false,
      required: true,
    },
    organizationName: {
      value: "",
      isInvalid: false,
      required: true,
    },
    firstName: {
      value: "",
      isInvalid: false,
      required: true,
    },
    lastName: {
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
    dbaName: {
      value: "",
      isInvalid: false,
      required: true,
    },
    termDate: {
      value: "",
      isInvalid: false,
      required: true,
    },
    taxId: {
      value: "",
      isInvalid: false,
      required: true,
    },
  };

  const [searchResults, setSearchResults] = useState([]);
  const [legalNames, setlegalNames] = useState();
  const [dropdownIsOpen, setDropdownIsOpen] = useState(false);

  const mastersSelector = useSelector((masters) => masters);
  console.log(mastersSelector);
  const [selectedType, setSelectedType] = useState();
  const [selectedState, setSelectedState] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [isFormValid, setIsFormValid] = useState(true);
  const [providerTableData, setProviderTableData] = useState([]);
  const [facilityAncillaryTableData, setFacilityAncillaryTableData] = useState(
    [],
  );
  const token = useSelector((state) => state.auth.token);
  const [visible, setVisible] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [caseUnlockState, setCaseUnlockState] = useState([]);

  const typeOptions = ["Provider", "Facility", "Ancillary"];
  const typeOptionsAut = [
    { label: "Provider", value: "Provider" },
    { label: "Facility", value: "Facility" },
    { label: "Ancillary", value: "Ancillary" },
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
    let jsn =
      selectedType == "Provider"
        ? providerTableData[ind]
        : facilityAncillaryTableData[ind];
    jsn.isChecked = evnt.target.checked;
    setCaseUnlockState([...caseUnlockState, jsn]);
  };

  //Added Newly by Nidhi Gupta on 08/16/2023
  const multiPlanProviderColumnNames =
    "Prof Areas of Expertise~Prof Areas of Expertise,Delegated Flag~Delegated Flag,Tax Id Number Type~Tax Id Number Type,Wednesday Office Hours~Wednesday Office Hours,Reimbursement Effective Date~Reimbursement Effective Date,Supervising Middle Name~Supervising Middle Name,Max Age Code~Max Age Code,Supervising Physician NPI Number~Supervising Physician NPI Number,DEA Effective Date~DEA Effective Date,Accepts VA~Accepts VA,Attested NPI/Medicaid Combinations~Attested NPI/Medicaid Combinations,Viant Product Id~Viant Product Id,Address Type~Address Type,Incomplete Reason~Incomplete Reason,Contract Entity Name~Contract Entity Name,W9 Name~W9 Name,Flex Field 14~Flex Field 14,Degree~Degree,Saturday Office Hours~Saturday Office Hours,Flex Field 15~Flex Field 15,Flex Field 16~Flex Field 16,Supervising Physician Last  Name~Supervising Physician Last  Name,Demographic SSN~Demographic SSN,Extract Date~Extract Date,Directory Corporate Name~Directory Corporate Name,Percent of Medicaid/Medicare~Percent of Medicaid/Medicare,Friday Office Hours~Friday Office Hours,Hospital Affiliations NPIs~Hospital Affiliations NPIs,Term reason~Term reason,Location Id~Location Id,Practice Email~Practice Email,Tax Id Number~Tax Id Number,Primary Address Indicator~Primary Address Indicator,Flex Field 10~Flex Field 10,Country~Country,Flex Field 11~Flex Field 11,Flex Field 12~Flex Field 12,Flex Field 13~Flex Field 13,Last Name~Last Name,Reimbursement Term Date~Reimbursement Term Date,DEA #~DEA #,License State~License State,MSA (**)~MSA (**),Initial Credential Date~Initial Credential Date,Flex Field 9~Flex Field 9,CE ID~CE ID,Panel Capacity~Panel Capacity,W9 City~W9 City,Thursday Office Hours~Thursday Office Hours,Flex Field 7~Flex Field 7,W9 Other Description~W9 Other Description,Flex Field 8~Flex Field 8,W9 Zip Code~W9 Zip Code,Suite/Apt~Suite/Apt,Prof Services~Prof Services,Billing NPI~Billing NPI,Zip Code~Zip Code,W9 DBA Name~W9 DBA Name,Monday Office Hours~Monday Office Hours,Accepts CHAMPVA~Accepts CHAMPVA,UID User Defined 2~UID User Defined 2,UID User Defined 3~UID User Defined 3,Supervising Physician First  Name~Supervising Physician First  Name,UID User Defined 1~UID User Defined 1,Reserves Indicator~Reserves Indicator,INSERT_CHANGE_DATE~INSERT_CHANGE_DATE,Provider Type~Provider Type,UID User Defined 6~UID User Defined 6,UID User Defined 7~UID User Defined 7,UID User Defined 4~UID User Defined 4,UID User Defined 5~UID User Defined 5,Specialty Code~Specialty Code,Max Age~Max Age,State License #~State License #,Min Age~Min Age,INSERTIONORDERID~INSERTIONORDERID,Directory Last Name~Directory Last Name,Market Description~Market Description,Update Type~Update Type,Telehealth~Telehealth,First Name~First Name,Patient Age Range~Patient Age Range,DEA Expiration Date~DEA Expiration Date,Primary Specialty Code~Primary Specialty Code,Taxonomy Code~Taxonomy Code,W9 Type~W9 Type,Longitude (**)~Longitude (**),Facility Services~Facility Services,Telemonitoring~Telemonitoring,Corporate Name~Corporate Name,Directory First Name~Directory First Name,Provider Board Certification Indicator~Provider Board Certification Indicator,Tuesday Office Hours~Tuesday Office Hours,W9 Address Line 1~W9 Address Line 1,Patient Gender Restriction~Patient Gender Restriction,Date Of Birth~Date Of Birth,Specialty Board Cert Effective Date~Specialty Board Cert Effective Date,Practice Web Address~Practice Web Address,ADA Handicap Accessible~ADA Handicap Accessible,Medicare #~Medicare #,Rate Sheet ID~Rate Sheet ID,City~City,Provider Gender~Provider Gender,Staff language Code~Staff language Code,State License Expiration Date~State License Expiration Date,Provider Termination Date~Provider Termination Date,Primary Facility Code~Primary Facility Code,CONTRACTID~CONTRACTID,Clinical Laboratory Improvement Amendment Cert #(CLIA)~Clinical Laboratory Improvement Amendment Cert #(CLIA),Supervising Physician Specialty~Supervising Physician Specialty,State~State,Directory Suppress~Directory Suppress,Directory Generational Suffix~Directory Generational Suffix,PCP~PCP,W9 Address Line 2~W9 Address Line 2,Min Age Code~Min Age Code,W9 State~W9 State,Record Type~Record Type,Office Phone Number~Office Phone Number,NPI~NPI,Fee Schedule Id~Fee Schedule Id,Contract Signature Authority~Contract Signature Authority,Email Address for Contract Notices~Email Address for Contract Notices,Middle Name~Middle Name,Health Home~Health Home,Language Code~Language Code,Medicaid #~Medicaid #,Electronic Claim Submission Source~Electronic Claim Submission Source,Generational Suffix~Generational Suffix,Outpatient Services~Outpatient Services,Facility Code~Facility Code,Telemedicine~Telemedicine,Latitude (**)~Latitude (**),State License Board Name~State License Board Name,State License Effective Date~State License Effective Date,Hospital Affiliation~Hospital Affiliation,Enhanced ACT Indicator~Enhanced ACT Indicator,Directory Middle Name~Directory Middle Name,TH Step Medicaid~TH Step Medicaid,W9 Suite/Apt~W9 Suite/Apt,Provider Effective Date~Provider Effective Date,County (**)~County (**),Office Fax Number~Office Fax Number,Specialty Board Name~Specialty Board Name,Ethnicity~Ethnicity,Provider ID~Provider ID,Patient Acceptance Indicator~Patient Acceptance Indicator,Sunday Office Hours~Sunday Office Hours,Contract Entity Type~Contract Entity Type,Hospital Based Provider Indicator~Hospital Based Provider Indicator,Address Line 1~Address Line 1,Specialty Board Cert Expiration Date~Specialty Board Cert Expiration Date,Address Line 2~Address Line 2,Last Re-Credential Date~Last Re-Credential Date";
  const multiPlanFacilityAncillaryColumnNames =
    "Legal Entity Name~LEGALENTITYNAME, DBA Name~DBANAME, NPI ID~NPIID, State~STATEVALUE, Pay To NPI~PAYTONPI, Status~PDMSTATUS, SOURCE~SOURCE";
  //Till Here

  const providerColumnNames =
    "First Name~FIRSTNAME, Last Name~LASTNAME, Legal Entity Name~ORGANIZATIONNAME, Suffix~SUFFIX, CAQH ID~CAQHID, NPI ID~NPIID, State~STATEVALUE, Pay To NPI~PAYTONPI, Status~PDMSTATUS, SOURCE~SOURCE,  View Data~VIEWDATA";
  const facilityAncillaryColumnNames =
    "Legal Entity Name~LEGALENTITYNAME, DBA Name~DBANAME, NPI ID~NPIID, State~STATEVALUE, Pay To NPI~PAYTONPI, Status~PDMSTATUS, SOURCE~SOURCE, View Data~VIEWDATA";

  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
  };

  const [modalData, setModalData] = useState(null);
  const [multiPlanData, setMultiPlanData] = useState([]);

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
              err.message,
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
          "Please select atleast one more field other than State to do Search.",
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
      }
    });
    if (validateInputCount < 1) {
      alert("Atleast one entry is required to do Search.");
      return false;
    }
    return true;
  };

  const handleOptionSelect = (option, field) => {
    console.log("handleoption", option);
    // setInputValue(option);
    updateFormData(option, field);
    // setSelectedOption(option);
    setDropdownIsOpen(false);
    setSearchResults([]);
  };

  const handleInputBlur = () => {
    console.log("InputBlur");
    setTimeout(() => {
      setDropdownIsOpen(false);
    }, 200);

    // setSearchResults([]);
  };

  // const ArrayOfOptions =['Harshit','Shivani','Prerna','Mohit','Ankit','Sahil','Harsh'];
  const searchFunction = (value) => {
    console.log("searchfunction", value);
    let ArrayOfOptions = [];
    if (selectedType === "Provider") {
      ArrayOfOptions = legalNames?.[0]?.Provider;
    } else if (selectedType === "Facility" || selectedType === "Ancillary") {
      ArrayOfOptions = legalNames?.[0]?.["Faci/Anci"];
    }
    console.log("ArrayOfOptions", ArrayOfOptions);
    let filteredResults = [];
    if (ArrayOfOptions !== undefined) {
      filteredResults = ArrayOfOptions.filter((elem) => {
        // console.log("element",elem.Name);
        return elem.Name.toLowerCase().includes(value.toLowerCase());
      });
    }
    console.log("filteredResults", filteredResults);
    return filteredResults;
  };

  const updateFormData = (value, field) => {
    console.log("field", field);
    if (field === "legalEntityName" || field === "organizationName") {
      setDropdownIsOpen(true);
      const results = searchFunction(value);
      console.log("result of LEN", results);
      setSearchResults(results);
    }
    setFormData((prevState) => {
      return {
        ...prevState,
        [field]: {
          ...prevState[field],
          value: value.toUpperCase(), //Changed by Nidhi Gupta on 10/16/2023,
          isInvalid: false,
        },
      };
    });
    validateForm();
  };

  const validateForm = () => {
    let isAnyFieldEmpty = true;
    Object.keys(formData).forEach((field) => {
      if (formData[field].required && formData[field].value !== "") {
        isAnyFieldEmpty = false;
      }
    });
    if (isAnyFieldEmpty) {
      setIsFormValid(false);
    } else {
      setIsFormValid(true);
    }
  };

  //   const updateFormData = (value, field) => {
  //     setFormData((prevState) => {
  //       return {
  //         ...prevState,
  //         [field]: {
  //           ...prevState[field],
  //           value: value.toUpperCase(), //Changed by Nidhi Gupta on 10/16/2023,
  //           isInvalid: false,
  //         },
  //       };
  //     });
  //     validateForm();
  //   };

  const [typeFieldError, setTypeFieldError] = useState(false);

  const { ValueContainer, Placeholder } = components;
  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, (child) =>
          child && child.type !== Placeholder ? child : null,
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
      setIsSearchClicked(true);
      setIsFormValid(true);
      setProviderTableData([]);
      setFacilityAncillaryTableData([]);
      validateForm();

      // console.log("isFormValid: ", isFormValid);
      if (validateState() && validateInput()) {
        let getApiJson = {};
        getApiJson["option"] = "GETPROVIDERSEARCHDATA";
        getApiJson["OrganizationName"] = formData.organizationName.value;
        getApiJson["firstName"] = formData.firstName.value;
        getApiJson["lastName"] = formData.lastName.value;
        getApiJson["ProviderNpiId"] = formData.providerNPI.value;
        getApiJson["State"] = formData.state.value;
        getApiJson["PayToNpi"] = formData.payToNPI.value;
        getApiJson["LegalEntityName"] = formData.legalEntityName.value;
        getApiJson["DBAName"] = formData.dbaName.value;
        getApiJson["TaxId"] = formData.taxId.value;
        getApiJson["Type"] = selectedType.toString();
        getApiJson["procOut"] = "yes";
        console.log(getApiJson);

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
          10: "PDMSTATUS",
          11: "SOURCE",
        };
        let facilityAncillaryMapping = {
          0: "PROVIDERID",
          1: "CONTRACTID",
          2: "LEGALENTITYNAME",
          3: "DBANAME",
          4: "NPIID",
          5: "STATEVALUE",
          6: "PAYTONPI",
          7: "PDMSTATUS",
          8: "SOURCE",
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

                    facAncDataArray.push(finalObj[0]);
                  });

              setFacilityAncillaryTableData(facAncDataArray);
            }
          })
          .catch((err) => {
            console.log(
              "Error in calling callProcedure option GETPROVIDERSEARCHDATA: ",
              err.message,
            );
          });
        setVisible(true);
      }

      if (selectedType == "Provider") {
        setIsProvider(true);
      }
    } catch (error) {
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
    getApiJson["option"] = "GETLEGALENTITYNAMES";
    getApiJson["Type"] = "SelfService";
    axios
      .post(baseURL + "/generic/callProcedure", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setlegalNames(res.data.CallProcedure_Output.data);
        console.log("List of Legal Entity Names", legalNames);
      });
  }, []);

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
        {selectedType == "Provider" && (
          <div className="row my-2">
            <div className="col-xs-6 col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className={
                    formData.firstName.isInvalid
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="firstName"
                  placeholder="firstName"
                  value={convertToCase(formData.firstName.value)}
                  name="firstName"
                  onChange={(e) => updateFormData(e.target.value, "firstName")}
                ></input>
                <label htmlFor="floatingInputGrid">First Name</label>
                {formData.firstName.isInvalid && (
                  <div className="small text-danger">
                    First Name is required
                  </div>
                )}
              </div>
            </div>

            <div className="col-xs-6 col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className={
                    formData.lastName.isInvalid
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="lastName"
                  placeholder="lastName"
                  value={convertToCase(formData.lastName.value)}
                  name="lastName"
                  onChange={(e) => updateFormData(e.target.value, "lastName")}
                ></input>
                <label htmlFor="floatingInputGrid">Last Name</label>
                {formData.lastName.isInvalid && (
                  <div className="small text-danger">Last Name is required</div>
                )}
              </div>
            </div>
          </div>
        )}

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
          {selectedType == "Provider" && (
            <div className="col-xs-6 col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className={
                    formData.providerNPI.isInvalid
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="providerNPI"
                  placeholder="providerNPI"
                  value={formData.providerNPI.value}
                  name="providerNPI"
                  maxLength="100"
                  onChange={(e) =>
                    updateFormData(e.target.value, "providerNPI")
                  }
                />
                <label htmlFor="floatingInputGrid">Provider NPI</label>
                {formData.providerNPI.isInvalid && (
                  <div className="small text-danger">
                    Provider NPI is required
                  </div>
                )}
              </div>
            </div>
          )}

          {(selectedType == "Facility" || selectedType == "Ancillary") && (
            <div className="col-xs-6 col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className={
                    formData.payToNPI.isInvalid
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="payToNPI"
                  placeholder="payToNPI"
                  value={formData.payToNPI.value}
                  name="payToNPI"
                  onChange={(e) => updateFormData(e.target.value, "payToNPI")}
                ></input>
                <label htmlFor="floatingInputGrid">Pay To NPI</label>
                {formData.payToNPI.isInvalid && (
                  <div className="small text-danger">
                    Pay To NPI is required
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="row my-2">
          {selectedType == "Provider" && (
            <>
              <div className="col-xs-6 col-md-6">
                <div className="form-floating">
                  {/* <input
                    type="text"
                    className={
                      formData.organizationName.isInvalid
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    id="organizationName"
                    placeholder="organizationName"
                    value={convertToCase(formData.organizationName.value)}
                    name="organizationName"
                    maxLength="100"
                    onChange={(e) =>
                      updateFormData(e.target.value, "organizationName")
                    }
                  /> */}
                  <input
                    type="text"
                    className={
                      formData.organizationName.isInvalid
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    id="organizationName"
                    placeholder="organizationName"
                    value={convertToCase(formData.organizationName.value)}
                    name="organizationName"
                    maxLength="100"
                    onBlur={(event) => handleInputBlur(event)}
                    onChange={(e) =>
                      updateFormData(e.target.value, "organizationName")
                    }
                  />
                  {formData?.organizationName?.value && dropdownIsOpen && (
                    <>
                      <ul
                        className="uldropdownLen"
                        style={{ listStyleType: "none" }}
                      >
                        {searchResults.map((result, index) => (
                          <li
                            className="dropdownListLen"
                            key={index}
                            onClick={(event) =>
                              handleOptionSelect(
                                result.Name,
                                "organizationName",
                                event,
                              )
                            }
                          >
                            {result.Name}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <label htmlFor="floatingInputGrid">Legal Entity Name</label>
                  {formData.organizationName.isInvalid && (
                    <div className="small text-danger">
                      Legal Entity Name is required
                    </div>
                  )}
                </div>
              </div>
              <div className="col-xs-6 col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    maxLength="10"
                    className={
                      formData.taxId.isInvalid
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    id="taxId"
                    placeholder="taxId"
                    name="taxId"
                    value={formData.taxId.value}
                    onChange={(e) => updateFormData(e.target.value, "taxId")}
                  />
                  <label htmlFor="floatingInputGrid">Tax ID</label>
                </div>
              </div>
            </>
          )}
          {(selectedType == "Facility" || selectedType == "Ancillary") && (
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
                  <input
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
                    maxLength="100"
                    onBlur={(event) => handleInputBlur(event)}
                    onChange={(e) =>
                      updateFormData(e.target.value, "legalEntityName")
                    }
                  />
                  {formData?.legalEntityName?.value && dropdownIsOpen && (
                    <>
                      <ul
                        className="uldropdownLen"
                        style={{ listStyleType: "none" }}
                      >
                        {searchResults.map((result, index) => (
                          <li
                            className="dropdownListLen"
                            key={index}
                            onClick={(event) =>
                              handleOptionSelect(
                                result.Name,
                                "legalEntityName",
                                event,
                              )
                            }
                          >
                            {result.Name}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <label htmlFor="floatingInputGrid">Legal Entity Name</label>
                  {formData.legalEntityName.isInvalid && (
                    <div className="small text-danger">
                      Legal Entity Name is required
                    </div>
                  )}
                </div>
              </div>

              <div className="col-xs-6 col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className={
                      formData.dbaName.isInvalid
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    id="dbaName"
                    placeholder="dbaName"
                    value={convertToCase(formData.dbaName.value)}
                    name="dbaName"
                    onChange={(e) => updateFormData(e.target.value, "dbaName")}
                  ></input>
                  <label htmlFor="floatingInputGrid">DBA Name</label>
                  {formData.dbaName.isInvalid && (
                    <div className="small text-danger">
                      DBA Name is required
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="row my-2">
          {(selectedType == "Facility" || selectedType == "Ancillary") && (
            <div className="col-xs-6 col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  maxLength="10"
                  className={
                    formData.taxId.isInvalid
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="taxId"
                  placeholder="taxId"
                  name="taxId"
                  value={formData.taxId.value}
                  onChange={(e) => updateFormData(e.target.value, "taxId")}
                />
                <label htmlFor="floatingInputGrid">Tax ID</label>
                {formData.taxId.isInvalid && (
                  <div className="small text-danger">Tax id is required</div>
                )}
              </div>
            </div>
          )}
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
              Global Search
            </Typography>
          </Breadcrumbs>
        </Stack>
        <Grid sx={{ p: 1 }}>
          <Grid sx={{ mb: 2 }}>
            <Card variant="elevation" elevation={4} sx={{ height: 270 }}>
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
                          zIndex: 999,
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
              selectedType == "Facility" ||
              selectedType == "Ancillary") && (
              <Card
                variant="elevation"
                elevation={4}
                sx={{
                  mb: 1,
                  minHeight: `${
                    selectedType == "Provider" ||
                    selectedType == "Facility" ||
                    selectedType == "Ancillary"
                      ? "100%"
                      : "100vh"
                  }`,
                }}
              >
                <CardHeader sx={{ p: 1 }}>
                  <Typography variant="button" sx={{ fontSize: "18px" }}>
                    {`Search ${selectedType}`}
                  </Typography>
                </CardHeader>
                <CardContent display="flex" justifyContent="center">
                  <Grid item md={12} sx={{ mt: 1 }}>
                    <div className="form-floating">
                      {renderForm(selectedType)}
                    </div>
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
              <Globalsearch
                providerId={modalData?.PROVIDERID}
                contractId={modalData?.CONTRACTID}
                caseNumber={modalData?.CASENUMBER}
                selectedType={selectedType}
                navigateHome={closeModal}
                formName={selectedType}
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
