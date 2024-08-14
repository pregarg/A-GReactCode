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
import { Modal } from "react-bootstrap";
import { useAxios } from "../../../api/axios.hook";
import useGetDBTables from "../../../Components/CustomHooks/useGetDBTables";

export default function GroupTermination() {
  const navigate = useNavigate();
  const { customAxios } = useAxios();
  const { getTableDetails, trimJsonValues } = useGetDBTables();
  const navigateHome = () => {
    console.log("Inside navigate Home");
    navigate("/Home", { replace: true });
  };
  const navigateToForm = () => {
    console.log("hello");
  };
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
  };

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

  const mastersSelector = useSelector((masters) => masters);
  console.log(mastersSelector);

  const typeOptions = ["Provider", "Facility", "Ancillary"];
  const stateOptions =
    mastersSelector["masterStateSymbol"].length === 0
      ? []
      : mastersSelector["masterStateSymbol"][0].data;

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
    "Legal Entity Name~LEGALENTITYNAME, DBA Name~DBANAME, NPI ID~NPIID, State~STATEVALUE, Pay To NPI~PAYTONPI, SOURCE~SOURCE";
  //Till Here

  const providerColumnNames =
    "First Name~FIRSTNAME, Last Name~LASTNAME, Legal Entity Name~ORGANIZATIONNAME, Suffix~SUFFIX, CAQH ID~CAQHID, NPI ID~NPIID, State~STATEVALUE, Pay To NPI~PAYTONPI, SOURCE~SOURCE, View Data~VIEWDATA";
  const facilityAncillaryColumnNames =
    "Legal Entity Name~LEGALENTITYNAME, DBA Name~DBANAME, NPI ID~NPIID, State~STATEVALUE, Pay To NPI~PAYTONPI, SOURCE~SOURCE, View Data~VIEWDATA";

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
        //setModalData(null);
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
            //let multiPlanDataVar = res.data.CallProcedure_Output.data[0];

            // console.log("Response data: ",multiPlanDataVar[0]);

            // const Tcols   = Object.keys(multiPlanDataVar[0]);
            // console.log("Tcols: ",Tcols);

            //    const finalObj=[];
            // Tcols.forEach((value, index) => {
            //     const abc=value + '~' + value;
            // finalObj.push(abc);
            // });
            // console.log("finalObj: ",finalObj.toString());

            //setMultiPlanColumns(finalObj.toString());

            //setMultiPlanData(multiPlanDataVar);
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

  const validateForm = () => {
    let isAnyFieldEmpty = true;
    let test = false;
    Object.keys(formData).forEach((field) => {
      if (formData[field].required && formData[field].value !== "") {
        isAnyFieldEmpty = false;
      }
    });
    console.log("Nidhi isAnyFieldEmpty: ", isAnyFieldEmpty);
    if (isAnyFieldEmpty) {
      console.log("Nidhi is if me gaya");
      //setIsFormValid(false);
      test = false;
    } else {
      console.log("Nidhi is else me gaya");
      //setIsFormValid(true);
      test = true;
      alert("Else me gaya");
    }
    setIsFormValid(test);

    console.log("Nidhi isFormValid: ", isFormValid);
  };

  const updateFormData = (value, field) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [field]: {
          ...prevState[field],
          value: value,
          isInvalid: false,
        },
      };
    });
    console.log("update was run");
    validateForm();
    console.log("validate was run");
  };

  const [typeFieldError, setTypeFieldError] = useState(false);

  const newSearchHandler = async (e) => {
    try {
      e.preventDefault();
      if (!selectedType) {
        setTypeFieldError(true);
        return;
      }
      setTypeFieldError(false);
      setIsFormValid(true);

      setIsSearchClicked(true);
      setProviderTableData([]);
      setFacilityAncillaryTableData([]);
      //validateForm();
      //alert("Nidhi isFormValid validate se pehle: "+isFormValid);

      const promise = new Promise((resolve, reject) => {
        resolve(validateForm());
      });

      await promise.then(() => {
        setTimeout(() => {
          alert("Nidhi click isFormValid: " + isFormValid);
          if (validateState() && isFormValid) {
            console.log("yaha gaya");
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
                  // let provideridArray = [];
                  // let contractidArray = [];

                  data.length === 0 || data === undefined
                    ? (providerDataArray = [])
                    : data.map((arr) => {
                        let obj = {};
                        let finalObj = [];
                        arr.forEach((value, index) => {
                          console.log("Response value: ", value);
                          console.log("Response index: ", index);
                          obj[providerMapping] = value;

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
                        });
                        console.log("Response obj: ", obj);
                        console.log("Response finalObj: ", finalObj);

                        // obj['VIEWDATA'] = <div
                        //     onClick={(e) => { e.preventDefault(); showValues(obj, selectedType) }}
                        //     style={{ cursor: 'pointer' }}
                        // >
                        //     <img
                        //         id='viewDataLogo'
                        //         src={viewDataLogo}
                        //         className="img-fluid"
                        //         alt="..."
                        //         height={30}
                        //         width={30}
                        //     />
                        // </div>

                        providerDataArray.push(finalObj);
                        // provideridArray.push(obj['PROVIDERID']);
                        // contractidArray.push(obj['CONTRACTID']);
                        // console.log("Response provideridArray: ",provideridArray);
                        // console.log("Response contractidArray: ",contractidArray);
                      });
                  // if(providerDataArray = [])
                  // {
                  //     alert("No data found for this search criteria.");
                  // }

                  console.log(
                    "Response providerDataArray",
                    providerDataArray[0],
                  );
                  setProviderTableData(providerDataArray[0]);
                } else {
                  let facAncDataArray = [];
                  // let provideridArray = [];
                  // let contractidArray = [];

                  data.length === 0 || data === undefined
                    ? (facAncDataArray = [])
                    : data.map((arr) => {
                        let obj = {};
                        let finalObj = [];
                        arr.forEach((value, index) => {
                          //obj[facilityAncillaryMapping[index]] = value;
                          obj[facilityAncillaryMapping] = value;

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
                        });
                        console.log("Response obj: ", obj);
                        console.log("Response finalObj: ", finalObj);

                        // obj['VIEWDATA'] = <div
                        //     onClick={(e) => { e.preventDefault(); showValues(obj, selectedType) }}
                        //     style={{ cursor: 'pointer' }}
                        // >
                        //     <img
                        //         id='viewDataLogo'
                        //         src={viewDataLogo}
                        //         className="img-fluid"
                        //         alt="..."
                        //         height={30}
                        //         width={30}

                        //     />
                        // </div>

                        facAncDataArray.push(finalObj);

                        // provideridArray.push(obj['PROVIDERID']);
                        // contractidArray.push(obj['CONTRACTID']);
                        // console.log(provideridArray);
                        // console.log(contractidArray);
                      });
                  //if(facAncDataArray = [])
                  // {
                  //     alert("No data found for this search criteria.");
                  // }
                  console.log("Response facAncDataArray: ", facAncDataArray[0]);
                  setFacilityAncillaryTableData(facAncDataArray[0]);
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
        }, 1000);
      });
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
  }, []);

  useEffect(() => {
    setFormData(initialState);
    setSelectedState();
    setIsProvider(false);
    setVisible(false);
    setIsFormValid(false);
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
                  value={formData.firstName.value}
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
            {/* <div className="col-xs-6 col-md-6">
                            <div className="form-floating">
                                <input type="text" className={formData.providerNPI.isInvalid ? 'form-control is-invalid' : 'form-control'} id="providerNPI" placeholder="providerNPI" value={formData.providerNPI.value} name="providerNPI" maxLength="100" onChange={(e) => updateFormData(e.target.value, 'providerNPI')} />
                                <label htmlFor="floatingInputGrid">Provider NPI</label>
                                {formData.providerNPI.isInvalid && <div className="small text-danger">Provider NPI is required</div>}
                            </div>
                        </div> */}

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
                  value={formData.lastName.value}
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
            <Multiselect
              isObject={false}
              // onKeyPressFn={function noRefCheck(){}}
              // onRemove={function noRefCheck(){}}
              // onSearch={function noRefCheck(){}}
              // onSelect={function noRefCheck(){}}
              options={stateOptions}
              showCheckbox={false}
              id="state"
              ref={stateRef}
              showArrow={true}
              singleSelect={true}
              placeholder="State"
              onSelect={(option) => {
                setSelectedState(option);
                updateFormData(option.toString(), "state");
              }}
              selectedValues={selectedState}
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
            <div className="col-xs-6 col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className={
                    formData.organizationName.isInvalid
                      ? "form-control is-invalid"
                      : "form-control"
                  }
                  id="organizationName"
                  placeholder="organizationName"
                  value={formData.organizationName.value}
                  name="organizationName"
                  maxLength="100"
                  onChange={(e) =>
                    updateFormData(e.target.value, "organizationName")
                  }
                />
                <label htmlFor="floatingInputGrid">Legal Entity Name</label>
                {formData.organizationName.isInvalid && (
                  <div className="small text-danger">
                    Organization Name is required
                  </div>
                )}
              </div>
            </div>
          )}
          {(selectedType == "Facility" || selectedType == "Ancillary") && (
            <>
              <div className="col-xs-6 col-md-6">
                <div className="form-floating">
                  <input
                    type="text"
                    className={
                      formData.legalEntityName.isInvalid
                        ? "form-control is-invalid"
                        : "form-control"
                    }
                    id="legalEntityName"
                    placeholder="legalEntityName"
                    value={formData.legalEntityName.value}
                    name="legalEntityName"
                    onChange={(e) =>
                      updateFormData(e.target.value, "legalEntityName")
                    }
                  ></input>
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
                    value={formData.dbaName.value}
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

        {isSearchClicked && !isFormValid && (
          <div className="row my-2">
            <div className="col-xs-12">
              <div className="small text-danger">
                Atleast one entry is required
              </div>
            </div>
          </div>
        )}
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
                  showCheckBox={showGridCheckbox}
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
                  showCheckBox={showGridCheckbox}
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

  return (
    <>
      <div
        className="GroupTermination backgroundColor"
        style={{ minHeight: "100%" }}
      >
        <div className="container">
          <div className="row">
            <div className="col-xs-6" style={{ textAlign: "center" }}>
              <br />
              <label id="tileFormLabel" className="HeadingStyle">
                Search
              </label>
            </div>
          </div>
        </div>
        <br />
        <div
          className="container"
          style={{
            overflow: "auto",
            height: "auto",
            minHeight: "86vh",
            minWidth: "98%",
          }}
        >
          <div
            className="accordion AddProviderLabel"
            id="accordionPanelsStayOpenExample"
          >
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingOne">
                <button
                  className="accordion-button accordionButtonStyle"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseOne"
                  aria-expanded="true"
                  aria-controls="panelsStayOpen-collapseOne"
                >
                  Instructions
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseOne"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingOne"
              >
                <div className="accordion-body">
                  <div className="row my-2">
                    <div className="col-xs-12">
                      <label
                        id="instructionHeading"
                        className="instructionHeading"
                      >
                        The below search screen is defined by Provider,
                        Ancillary and Facility. Please enter one field from the
                        below information and the data of provider(s) associated
                        will populate on the screen. Once the search is
                        complete, you may click on the provider to obtain the
                        information. Search example: St. Joseph – this will
                        return multiple records with St. Joseph. Type in St.
                        Joseph’s Hospital with NPI, the specified Facility will
                        populate with this data on the screen.
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingTwo">
                <button
                  className="accordion-button accordionButtonStyle"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTwo"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseTwo"
                >
                  Type
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTwo"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingTwo"
              >
                <div className="accordion-body">
                  <div className="row g-2">
                    <div className="col-xs-6 col-md-6">
                      <div className="form-floating">
                        {/* <label htmlFor="state">Type</label> */}

                        <Multiselect
                          isObject={false}
                          // onKeyPressFn={function noRefCheck(){}}
                          // onRemove={function noRefCheck(){}}
                          // onSearch={function noRefCheck(){}}
                          // onSelect={function noRefCheck(){}}
                          options={typeOptions}
                          showCheckbox={false}
                          id="typeDropdown"
                          ref={stateRef}
                          showArrow={true}
                          singleSelect={true}
                          onSelect={(option) => {
                            setSelectedType(option);
                            setTypeFieldError(false);
                          }}
                          selectedValues={selectedType}
                        />
                      </div>
                      {typeFieldError && (
                        <div className="text-danger small">
                          This field is required
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row g-2 my-2"></div>
                </div>
              </div>
            </div>

            {(selectedType == "Provider" ||
              selectedType == "Facility" ||
              selectedType == "Ancillary") && (
              <div className="accordion-item">
                <h2
                  className="accordion-header"
                  id="panelsStayOpen-headingThree"
                >
                  <button
                    className="accordion-button accordionButtonStyle"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#panelsStayOpen-collapseThree"
                    aria-expanded="false"
                    aria-controls="panelsStayOpen-collapseThree"
                  >
                    Search {selectedType}
                  </button>
                </h2>
                <div
                  id="panelsStayOpen-collapseThree"
                  className="accordion-collapse collapse show"
                  aria-labelledby="panelsStayOpen-headingThree"
                >
                  <div className="accordion-body">
                    <div className="row g-2">
                      <div className="col-md mx-2">
                        <div className="form-floating">
                          {renderForm(selectedType)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        {/* <footer className='footerStyle'>
            <div className="content-wrapper">
                <div className='float-left'>
                    <h6></h6>
                </div>
            </div>
        </footer> */}
        <FooterComponent />
      </div>
      {/* <footer style={{textAlign: "left",boxShadow: "0 2px 4px 0 rgb(0 0 0 / 15%)",background:"white"}}>
      <button type="button" class="btn btn-outline-primary" onClick={event => navigateHome(event)}>Go To Home</button>
    </footer> */}

      {showModal && (
        <Modal
          onHide={closeModal}
          backdrop="static"
          keyboard={false}
          show={showModal}
          dialogClassName=""
          size="xl"
          aria-labelledby="example-custom-modal-styling-title"
          centered
          fullscreen={true}
        >
          {/* <Modal.Header closeButton>
                    <Modal.Title>
                        <h5>{caqhModal.header}</h5>
                    </Modal.Title>
                </Modal.Header> */}
          <Modal.Body>
            {modalData?.SOURCE == "PDM" ? (
              <Globalsearch
                providerId={modalData?.PROVIDERID}
                contractId={modalData?.CONTRACTID}
                caseNumber={
                  modalData.CaseNumber === null ? "" : modalData.CaseNumber
                }
                navigateHome={closeModal}
                formName={selectedType?.[0]}
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
                          <div
                            className="card-text my-2"
                            style={{
                              maxHeight: "830px",
                              overflow: "auto",
                            }}
                          >
                            <div className="col-xs-6" id="caseTable2">
                              <TableComponent
                                columnName={multiPlanProviderColumnNames}
                                rowValues={multiPlanData}
                                showCheckBox={showGridCheckbox}
                                navigateToForm={navigateToForm}
                                handleCheckBoxChange={handleCheckBoxChange}
                                makeLink={false}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <></>
            )}

            {/* {(!!selectedType && selectedType[0] !== 'Provider') && <GlobalsearchFacilityAncillary
                        providerId={modalData?.PROVIDERID}
                        contractId={modalData?.CONTRACTID}
                        navigateHome={closeModal}
                        formView='DashboardHomeView'
                        formNames={selectedType?.[0]}
                    />} */}
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
