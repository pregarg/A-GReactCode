import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import "../../../Components/ContractingHome/ContractingTileForms/Forms.css";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import axios from 'axios';
import { useAxios } from "../../../api/axios.hook";
import { baseURL } from "../../../api/baseURL";
import Select, { components } from "react-select";
import Switch from "react-switch";
import TypeTable from "../../../Components/SelfServiceTiles/TileFormsTables/TypeTable.js";
import PaymentTable from "../../../Components/SelfServiceTiles/TileFormsTables/PaymentTable.js";
import LocationTable from "../../../Components/SelfServiceTiles/TileFormsTables/LocationTable.js";

import useUpdateDecision from "../../../Components/CustomHooks/useUpdateDecision.js";
import { useDispatch, useSelector } from "react-redux";

import useGetDBTables from "../../../Components/CustomHooks/useGetDBTables.js";
import CompensationTab from "../../../Components/ContractingHome/ContractingTileForms/CompensationTab.js";
import FooterComponent from "../../../Components/FooterComponent.js";
import DocumentSection from "../../../Components/SelfServiceTiles/DocumentSection.js";
import DocumentTab from "./DocumentTab.js";

export default function ContractingPop(prop) {
  const mastersSelector = useSelector((masters) => masters);
  const authData = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const [buttonDisableFlag, setButtonDisableFlag] = useState(false);
  const { customAxios } = useAxios();
  const dispatch = useDispatch();
  const [loadForm, setLoadForm] = useState(false);
  const [formikInitializeState, setFormikInitializeState] = useState(false);
  const validationSchema = Yup.object().shape({
    mgrEmail: Yup.string()
      .email("Please enter valid Email Id")
      .required("Please enter Email Id")
      .max(50, "Email Id max length exceeded"),
    mgrPhone: Yup.string()
      .required("Please enter Phone Number")
      .max(14, "Phone Number max length exceeded")
      .matches(/^[0-9\ \(\-\)]+$/, "Only numbers are accepted"),

    provZipCode: Yup.string()
      .required("Please enter Zip Code")
      .max(5, "Zip Code max length exceeded")
      .matches(
        /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
        "Only numbers are accepted"
      ),
    provState: Yup.object().nullable().required("Please select State"),
    entityName: Yup.string()
      .required("Please enter Legal Entity Name")
      .max(100, "Legal Entity Name max length exceeded"),
    mgrFax: Yup.string()
      .max(10, "Fax Number max length exceeded")
      .matches(
        /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
        "Only numbers are accepted"
      ),
    mgrFirstName: Yup.string()
      .required("Please enter First Name")
      .max(30, "First Name max length exceeded"),
    mgrLastName: Yup.string()
      .required("Please enter Last Name")
      .max(70, "Max length exceeded"),
    provAddress: Yup.string()
      .required("Please enter Address")
      .max(150, "Address max length exceeded"),
    provAddress2: Yup.string()
      //             .required('Please enter Address2')
      .max(100, "Address2 max length exceeded"),
    proCity: Yup.string()
      .required("Please enter City")
      .max(50, "City max length exceeded"),
    //Newest by Nidhi
    credContactName: Yup.string()
      //.required('Please enter Credentialing Contact Name')
      .max(100, "Credentialing Contact Name max length exceeded"),
    credEmail: Yup.string()
      .email("Please enter valid Credentialing Email Id")
      .max(50, "Credentialing Email Id max length exceeded"),
    credPhone: Yup.string()
      .max(14, "Credentialing Phone# max length exceeded")
      .matches(/^[0-9\ \(\-\)]+$/, "Only numbers are accepted"),
    credFax: Yup.string()
      .max(10, " Credentialing Fax# max length exceeded")
      .matches(
        /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
        "Only numbers are accepted"
      ),
    contractType: Yup.object()
      .nullable()
      .required("Please select Contract Type."),
    //Till here
  });
  const {
    getTableDetails,
    trimJsonValues,
    convertToCase,
    checkGridJsonLength,
    extractDate,
  } = useGetDBTables();
  const [selectData, setSelectData] = useState({});
  const { printConsole, checkDecision, handlePhoneNumber, disableAllElements } =
    useUpdateDecision();

  const {
    submitCase,
    updateLockStatus,
    validatePotentialDup,
    validatePotentialDupDec,
    updateDecision,
  } = useUpdateDecision(); //Changed by Nidhi
  ContractingPop.validate = "shouldValidate";

  const formName = useRef(null);

  //Newly Added by Nidhi Gupta on 08/04/2023
  let documentSectionDataRef = useRef([]);
  let contractingConfigData = JSON.parse(
    process.env.REACT_APP_CONTRACTING_DETAILS
  );
  const { fileUpDownAxios } = useAxios();
  //Till Here

  // let prop = useLocation();
  const navigate = useNavigate();
  const navigateContractingHome = async () => {
    try {
      setButtonDisableFlag(false);
      if (prop.caseNumber !== undefined) {
        const promise = new Promise((resolve, reject) => {
          resolve(updateLockStatus("N", prop.caseNumber, 0, ""));
        });

        await promise
          .then(() => {
            setTimeout(() => {
              navigate("/DashboardLogin/Home", { replace: true });
            }, 1000);
          })
          .catch((err) => {
            console.error(err);
          });
      }

      if (prop.caseNumber === undefined) {
        navigate("/ContractingHome", { replace: true });
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  // const navigateContractingHome = () => {
  //     navigate('/ContractingHome', {replace: true});
  // }

  const stateRef = React.createRef();
  const prodstatesRef = React.createRef();

  let getEndpoints = [baseURL + "/master/stateSymbol"];

  const [selectValues, setSelectValues] = useState({});
  const [masterValues, setMasterValues] = useState({});
  const [potentialDupData, setPotentialDupData] = useState([]);

  //Newly Added by Nidhi 5/4/23

  const [apiTestStateComp, setApiTestStateComp] = useState({
    terminationClause: "",
    pcpId: "",
    taxId: "",
    medicalLicense: "",
    groupRiskId: "",
    networkId: "",
    planValue: "",
    annualEscl: "",
    starsIncentive: "",
    awvIncentive: "",
    medicalHome: "",
    pricingAWP: "",
    pricingASP: "",
    contractTypeComp: "",
    networkState: "",
    feeSchedule: "",
    riskState: "",
    riskAssignment: "",
    sequesApplies: "",
    criticalAccess: "",
    qualityFlagI: "",
    qualityFlagJ: "",
    qualityFlagK: "",
    qualityFlagL: "",
    qualityFlagM: "",
    qualityFlagN: "",
  });

  const [firlTableRowsData, setFirlTableRowsData] = useState([]);
  const [compensationTableRowsData, setCompensationTableRowsData] = useState(
    []
  );
  const [gridFieldTempState, setGridFieldTempState] = useState({});

  const renameKey = (obj, oldKey, newKey) => {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
    return obj;
  };

  const convertToDateObj = (jsonObj) => {
    const jsonKeys = Object.keys(jsonObj);
    jsonKeys.forEach((elem) => {
      if (elem.includes("#date")) {
        const date = new Date(jsonObj[elem]);
        const oldKey = elem;
        const newKey = elem.split("#")[0];
        jsonObj = renameKey(jsonObj, oldKey, newKey);
        jsonObj[newKey] = date;
      }
    });
    return jsonObj;
  };

  const handleMedicalGrpNoShow = (evt) => {
    let groupRiskIdValue = apiTestStateComp.groupRiskId;
    let riskStateValue = "";
    let riskValue = "";
    let taxValue = "";

    riskStateValue =
      apiTestStateComp.riskState && apiTestStateComp.riskState.value
        ? apiTestStateComp.riskState.value
        : "--";
    riskValue =
      apiTestStateComp.riskAssignment && apiTestStateComp.riskAssignment.value
        ? apiTestStateComp.riskAssignment.value.substring(0, 2)
        : "--";
    taxValue =
      apiTestStateComp.taxId !== undefined && apiTestStateComp.taxId !== ""
        ? apiTestStateComp.taxId.substring(apiTestStateComp.taxId.length - 5)
        : "-----";

    groupRiskIdValue = riskStateValue + riskValue + taxValue;

    setApiTestStateComp({
      ...apiTestStateComp,
      groupRiskId: groupRiskIdValue,
    });
  };

  const handleNetworkIdShow = (evt) => {
    let networkIdValue = apiTestStateComp.networkId;
    let networkStateValue = "";
    let planValue = "";

    networkStateValue =
      apiTestStateComp.networkState && apiTestStateComp.networkState.value
        ? apiTestStateComp.networkState.value
        : "--";
    planValue =
      apiTestStateComp.planValue !== undefined &&
      apiTestStateComp.planValue !== ""
        ? apiTestStateComp.planValue
        : "";

    networkIdValue = planValue + networkStateValue;

    setApiTestStateComp({
      ...apiTestStateComp,
      networkId: networkIdValue,
    });
  };

  const handlePcpIdShow = (evt) => {
    let pcpIdValue = apiTestStateComp.pcpId;
    let medicalLicenseValue = "";
    let constant = "GK";

    medicalLicenseValue =
      apiTestStateComp.medicalLicense !== undefined &&
      apiTestStateComp.medicalLicense !== ""
        ? apiTestStateComp.medicalLicense
        : "";
    pcpIdValue = constant + medicalLicenseValue;

    setApiTestStateComp({
      ...apiTestStateComp,
      pcpId: pcpIdValue,
    });
  };

  // till here

  const [apiTestState, setApiTestState] = useState({
    contractType: "",
    mgrFirstName: "",
    mgrLastName: "",
    mgrEmail: "",
    mgrPhone: "",
    mgrFax: "",
    entityName: "",
    provCount: "",
    provAddress: "",
    provAddress2: "",
    proCity: "",
    provState: "",
    provZipCode: "",
    prodStates: "",
    //medicaid: false,
    //medicare: true,
    //exchange: false,
    //commercial: false,
    //bhvrHealth: false,
    stateDefault: [],
    prodStatesDefault: [],

    //Newest by Nidhi
    credEmail: "",
    credPhone: "",
    credFax: "",
    credContactName: "",
    contractId: "",
    //Till Here
  });
  const truncateUndefined = (transformed) => {
    let result = {};
    Object.keys(transformed).forEach((key) => {
      if (!!transformed[key]) {
        result = {
          ...result,
          [key]: transformed[key],
        };
      }
    });

    return result;
  };

  const mapPdmLinearTab = (res) => {
    const transformed = {
      contractType: res["CONTRACTTYPE"],
      mgrFirstName: res["MGRFIRSTNAME"],
      mgrLastName: res["MGRLASTNAME"],
      mgrEmail: res["MGREMAIL"],
      mgrPhone: res["MGRPHONE"],
      mgrFax: res["MGRFAX"],
      entityName: res["ENTITYNAME"],
      provCount: res["PROVCOUNT"],
      provAddress: res["PROVADDRESS"],
      provAddress2: res["PROVADDRESS2"],
      proCity: res["PROCITY"],
      provState: res["PROVSTATE"],
      provZipCode: res["PROVZIPCODE"],
      prodStates: res["PRODSTATES"],
      credEmail: res["CREDEMAIL"],
      credPhone: res["CREDPHONE"],
      credFax: res["CREDFAX"],
      credContactName: res["CREDCONTACTNAME"],
      contractId: res["CONTRACTID"],
    };
    return truncateUndefined(transformed);
  };

  const mapPdmAddressTable = (res) => {
    const transformed = {
      locationName: res["LOCATIONNAME"],
      languages: res["LANGUAGES"],
      npi: res["NPI"],
      addressType: res["ADDRESSTYPE"],
      officePhoneNumber: res["OFFICEPHONENUMBER"],
      officeFaxNumber: res["OFFICEFAXNUMBER"],
      tddPhone: res["TDDPHONE"],
      electronicHealthRecord:
        res["ELECTRONICHEALTHRECORD"] === "Y"
          ? "YES"
          : res["ELECTRONICHEALTHRECORD"] === "N"
          ? "NO"
          : "",
      publicTransportation:
        res["PUBLICTRANSPORTATION"] === "Y"
          ? "YES"
          : res["PUBLICTRANSPORTATION"] === "N"
          ? "NO"
          : "",
      handicapAccess:
        res["HANDICAPACCESS"] === "Y"
          ? "YES"
          : res["HANDICAPACCESS"] === "N"
          ? "NO"
          : "",
      tddHearing:
        res["TDDHEARING"] === "Y"
          ? "YES"
          : res["TDDHEARING"] === "N"
          ? "NO"
          : "",
      placeInDirectory: res["PLACEINDIRECTORY"],
      telemedicine:
        res["TELEMEDICINE"] === "Y"
          ? "YES"
          : res["TELEMEDICINE"] === "N"
          ? "NO"
          : "",
      address1: res["ADDRESS1"],
      address2: res["ADDRESS2"],
      city: res["CITY"],
      zipCode: res["ZIPCODE"],
      county: res["COUNTY"],
      stateValue: res["STATEVALUE"],
    };

    return truncateUndefined(transformed);
  };

  const mapPdmTypeTable = (res) => {
    const transformed = {
      providerType: res["PROVIDERTYPE"],
      provNpi: res["PROVNPI"],
      speciality: res["SPECIALITY"],
    };
    return truncateUndefined(transformed);
  };

  const mapPdmPaymentTable = (res) => {
    const transformed = {
      orgName: res["ORGNAME"],
      facilityName: res["FACILITYNAME"],
      tin: res["TIN"],
      groupNPI: res["GROUPNPI"],
      address1: res["ADDRESS1"],
      address2: res["ADDRESS2"],
      city: res["CITY"],
      stateValue: res["STATEVALUE"],
      zipCode: res["ZIPCODE"],
      phoneNo: res["PHONENO"],
      medicareNo: res["MEDICARENO"],
      npi: res["NPI"],
    };

    return truncateUndefined(transformed);
  };

  const mapPdmHospitalTable = (res) => {
    const transformed = {
      providerNo: res["PROVIDERNO"],
      component: res["COMPONENT"],
      currentRate: res["CURRENTRATE"],
      newRate: res["NEWRATE"],
      comment: res["COMMENT"],
    };

    return truncateUndefined(transformed);
  };

  const mapPdmProviderCompTable = (res) => {
    const transformed = {
      rate: res["RATE"],
      schedule: res["SCHEDULE"],
      speciality: res["SPECIALITY"],
    };

    return truncateUndefined(transformed);
  };

  const mapPdmLinearNetworkTab = (res) => {
    const transformed = {
      riskState: res["RISKSTATE"],
      riskAssignment: res["RISKASSIGNMENT"],
      taxId: res["TAXID"],
      groupRiskId: res["GROUPRISKID"],
      medicalLicense: res["MEDICALLICENSE"],
      pcpId: res["PCPID"],
      networkState: res["NETWORKSTATE"],
      planValue: res["PLANVALUE"],
      networkId: res["NETWORKID"],
      feeSchedule: res["FEESCHEDULE"],
      conEffectiveDate: res["CONEFFECTIVEDATE#date"]
        ? new Date(res["CONEFFECTIVEDATE#date"])
        : "",
      starsIncentive: res["STARSINCENTIVE"],
      awvIncentive: res["AWVINCENTIVE"],
      medicalHome: res["MEDICALHOME"],
      criticalAccess: res["CRITICALACCESS"],
      pricingAWP: res["PRICINGAWP"],
      pricingASP: res["PRICINGASP"],
      annualEscl: res["ANNUALESCL"],
      sequesApplies: res["SEQUESAPPLIES"],
      mocAttestationDate: res["MOCATTESTATIONDATE#date"]
        ? new Date(res["MOCATTESTATIONDATE#date"])
        : "",
      mocRenewalAttDate: res["MOCRENEWALATTDATE#date"]
        ? new Date(res["MOCRENEWALATTDATE#date"])
        : "",
      terminationClause: res["TERMINATIONCLAUSE"],
      contractTypeComp: res["CONTRACTTYPECOMP"],
      qualityFlagI: res["QUALITYFLAGI"],
      qualityFlagJ: res["QUALITYFLAGJ"],
      qualityFlagK: res["QUALITYFLAGK"],
      qualityFlagL: res["QUALITYFLAGL"],
      qualityFlagM: res["QUALITYFLAGM"],
      qualityFlagN: res["QUALITYFLAGN"],
      providerId: res["PROVIDERID"],
      contractId: res["CONTRACTID"],
    };

    return truncateUndefined(transformed);
  };

  let contractOptions = [];
  const [typeTableRowsData, setTypeTableRowsData] = useState([]);
  const [paymentTableRowsData, setPaymentTableRowsData] = useState([]);
  const [locationTableRowsData, setLocationTableRowsData] = useState([]);

  const [apiCallOnce, setApiCallOnce] = useState(false);
  const tabRef = useRef("HomeView");

  //Added by Nidhi on 04/06/2023

  const fetchAutoPopulate = useRef(false);

  const navigateHome = async () => {
    if (prop !== null) {
      const promise = new Promise((resolve, reject) => {
        resolve(updateLockStatus("N", prop.caseNumber, 0, ""));
      });

      await promise
        .then(() => {
          setTimeout(() => {
            navigate("/DashboardLogin/Home", { replace: true });
          }, 1000);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    if (prop === null) {
      navigate("/Home", { replace: true });
    }
  };
  //till here

  const handleTabSelect = (key) => {
    try {
      // Perform actions when the tab is selected
      if (key == "Compensation" && !apiCallOnce) {
        setApiCallOnce(true);
        let getApiJson = {};
        getApiJson["tableNames"] = getTableDetails()[
          "pdmContNetworkLinear"
        ].concat(getTableDetails()["pdmContCompGridTables"]);
        getApiJson["whereClause"] = { CONTRACTID: prop.contractId };

        //customAxios.post('/generic/get',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
        customAxios
          .post("/generic/get", getApiJson)
          .then((res) => {
            const apiStat = res.data.Status;
            if (apiStat === -1) {
              alert("Error in fetching data");
            }
            if (apiStat === 0) {
              const respKeys = Object.keys(res.data["data"]);
              const respData = res.data["data"];
              respKeys.forEach((k) => {
                if (k === "contPdmNetwork") {
                  let apiResponse = {};
                  if (respData[k][0] !== undefined) {
                    apiResponse = mapPdmLinearNetworkTab(respData[k][0]);

                    //Added by Nidhi Gupta on 10/06/23
                    if (apiResponse.hasOwnProperty("conEffectiveDate")) {
                      if (typeof apiResponse.conEffectiveDate === "string") {
                        const cfd = new Date(apiResponse.conEffectiveDate);
                        apiResponse.conEffectiveDate = cfd;
                      }
                    }
                    if (apiResponse.hasOwnProperty("mocAttestationDate")) {
                      if (typeof apiResponse.mocAttestationDate === "string") {
                        const mad = new Date(apiResponse.mocAttestationDate);
                        apiResponse.mocAttestationDate = mad;
                      }
                    }
                    if (apiResponse.hasOwnProperty("mocRenewalAttDate")) {
                      if (typeof apiResponse.mocRenewalAttDate === "string") {
                        const rad = new Date(apiResponse.mocRenewalAttDate);
                        apiResponse.mocRenewalAttDate = rad;
                      }
                    }
                    //Till Here
                    apiResponse.networkState = {
                      label: apiResponse.networkState,
                      value: apiResponse.networkState,
                    };
                    apiResponse.feeSchedule = {
                      label: apiResponse.feeSchedule,
                      value: apiResponse.feeSchedule,
                    };
                    apiResponse.riskState = {
                      label: apiResponse.riskState,
                      value: apiResponse.riskState,
                    };
                    apiResponse.riskAssignment = {
                      label: apiResponse.riskAssignment,
                      value: apiResponse.riskAssignment,
                    };

                    //Added by Nidhi Gupta on 10/06/23
                    // apiResponse.sequesApplies = {'label':apiResponse.sequesApplies,'value':apiResponse.sequesApplies};
                    if (
                      apiResponse.sequesApplies !== undefined &&
                      apiResponse.sequesApplies.length > 0
                    ) {
                      if (apiResponse.sequesApplies === "Y") {
                        apiResponse.sequesApplies = {
                          label: "YES",
                          value: apiResponse.sequesApplies,
                        };
                      } else if (apiResponse.sequesApplies === "N") {
                        apiResponse.sequesApplies = {
                          label: "NO",
                          value: apiResponse.sequesApplies,
                        };
                      }
                    }

                    apiResponse.contractTypeComp = {
                      label: apiResponse.contractTypeComp,
                      value: apiResponse.contractTypeComp,
                    };
                    if (
                      apiResponse.criticalAccess !== undefined &&
                      apiResponse.criticalAccess.length > 0
                    ) {
                      if (apiResponse.criticalAccess === "Y") {
                        apiResponse.criticalAccess = {
                          label: "YES",
                          value: apiResponse.criticalAccess,
                        };
                      } else if (apiResponse.criticalAccess === "N") {
                        apiResponse.criticalAccess = {
                          label: "NO",
                          value: apiResponse.criticalAccess,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagI !== undefined &&
                      apiResponse.qualityFlagI.length > 0
                    ) {
                      if (apiResponse.qualityFlagI === "Y") {
                        apiResponse.qualityFlagI = {
                          label: "YES",
                          value: apiResponse.qualityFlagI,
                        };
                      } else if (apiResponse.qualityFlagI === "N") {
                        apiResponse.qualityFlagI = {
                          label: "NO",
                          value: apiResponse.qualityFlagI,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagJ !== undefined &&
                      apiResponse.qualityFlagJ.length > 0
                    ) {
                      if (apiResponse.qualityFlagJ === "Y") {
                        apiResponse.qualityFlagJ = {
                          label: "YES",
                          value: apiResponse.qualityFlagJ,
                        };
                      } else if (apiResponse.qualityFlagJ === "N") {
                        apiResponse.qualityFlagJ = {
                          label: "NO",
                          value: apiResponse.qualityFlagJ,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagK !== undefined &&
                      apiResponse.qualityFlagK.length > 0
                    ) {
                      if (apiResponse.qualityFlagK === "Y") {
                        apiResponse.qualityFlagK = {
                          label: "YES",
                          value: apiResponse.qualityFlagK,
                        };
                      } else if (apiResponse.qualityFlagK === "N") {
                        apiResponse.qualityFlagK = {
                          label: "NO",
                          value: apiResponse.qualityFlagK,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagL !== undefined &&
                      apiResponse.qualityFlagL.length > 0
                    ) {
                      if (apiResponse.qualityFlagL === "Y") {
                        apiResponse.qualityFlagL = {
                          label: "YES",
                          value: apiResponse.qualityFlagL,
                        };
                      } else if (apiResponse.qualityFlagL === "N") {
                        apiResponse.qualityFlagL = {
                          label: "NO",
                          value: apiResponse.qualityFlagL,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagM !== undefined &&
                      apiResponse.qualityFlagM.length > 0
                    ) {
                      if (apiResponse.qualityFlagM === "Y") {
                        apiResponse.qualityFlagM = {
                          label: "YES",
                          value: apiResponse.qualityFlagM,
                        };
                      } else if (apiResponse.qualityFlagM === "N") {
                        apiResponse.qualityFlagM = {
                          label: "NO",
                          value: apiResponse.qualityFlagM,
                        };
                      }
                    }

                    if (
                      apiResponse.qualityFlagN !== undefined &&
                      apiResponse.qualityFlagN.length > 0
                    ) {
                      if (apiResponse.qualityFlagN === "Y") {
                        apiResponse.qualityFlagN = {
                          label: "YES",
                          value: apiResponse.qualityFlagN,
                        };
                      } else if (apiResponse.qualityFlagN === "N") {
                        apiResponse.qualityFlagN = {
                          label: "NO",
                          value: apiResponse.qualityFlagN,
                        };
                      }
                    }

                    apiResponse = convertToDateObj(apiResponse);

                    //Till Here

                    setApiTestStateComp(apiResponse);
                    //setFormikInitializeState(true);
                  }
                }

                //Added by Nidhi Gupta on 10/06/2023
                if (k === "contPdmHospital") {
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const newJson = mapPdmHospitalTable(convertToDateObj(js));
                    apiResponseArray.push(newJson);
                  });
                  setFirlTableRowsData(apiResponseArray);
                }

                if (k === "contPdmProviderComp") {
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const apiResponse = mapPdmProviderCompTable(js);
                    if (apiResponse.hasOwnProperty("schedule")) {
                      apiResponse.schedule = {
                        label: apiResponse.schedule,
                        value: apiResponse.schedule,
                      };
                    }
                    if (apiResponse.hasOwnProperty("speciality")) {
                      apiResponse.speciality = {
                        label: apiResponse.speciality,
                        value: apiResponse.speciality,
                      };
                    }
                    apiResponseArray.push(apiResponse);
                  });
                  setCompensationTableRowsData(apiResponseArray);
                }

                //Till Here
              });
            }
          })
          .catch((err) => {
            console.log("Network Tab catch: ", err);
          });
      }
    } catch (error) {
      console.error("Network Tab handleTabSelect catch: ", error);
    }
  };

  useEffect(() => {
    disableAllElements(prop, "PDM");
    if (prop.caseNumber !== undefined) {
      if (prop.formNames.includes("Provider")) {
        ContractingPop.displayName = "Provider Contracting";
      }
      if (prop.formNames.includes("Facility/Ancillary/Health Systems")) {
        ContractingPop.displayName =
          "Facility/Ancillary/Health Systems Contracting";
      }
      tabRef.current = "DashboardView";
    }
    formName.current = ContractingPop.displayName;

    //Added by Nidhi on 4/12/2023
    let selectJson = {};
    const transType = String(formName.current);

    let newArr = [];
    if (mastersSelector.hasOwnProperty("masterContractType")) {
      selectJson.contracts =
        mastersSelector["masterContractType"].length === 0
          ? []
          : mastersSelector["masterContractType"][0];
    }
    selectJson["contracts"]
      .filter(
        (data) => data.transactionType.toLowerCase() == transType.toLowerCase()
      )
      .map((val) =>
        contractOptions.push({ value: val.displayName, label: val.displayName })
      );

      if (mastersSelector.hasOwnProperty("masterAddressType")) {
        let addressTypeOptions =
          mastersSelector["masterAddressType"].length === 0
            ? []
            : mastersSelector["masterAddressType"][0];

            for (const item of addressTypeOptions) {
              newArr.push(convertToCase(item.addressType));
            }

            selectJson.addressTypeOptions = newArr;
            newArr = [];
      }

      if (mastersSelector.hasOwnProperty("masterLanguages")) {
        //selectJson.languageArray = mastersSelector['masterLanguages'][0].data;
        let languageArray =
          mastersSelector["masterLanguages"].length === 0
            ? []
            : mastersSelector["masterLanguages"][0];

            for (const item of languageArray) {
              newArr.push(convertToCase(item.displayName));
            }
          selectJson.languageArray = newArr;
          newArr = [];
      }

    if (mastersSelector.hasOwnProperty("masterStateSymbol")) {
        let newstateOptions = [];
        let orgstateOptions =
          mastersSelector["masterStateSymbol"].length === 0
            ? []
            : mastersSelector["masterStateSymbol"][0];
        // for (let i = 0; i < orgstateOptions.length; i++) {
        //   newstateOptions.push({
        //     label: convertToCase(orgstateOptions[i].stateSymbol),
        //     value: convertToCase(orgstateOptions[i].stateSymbol),
        //   });

        // }


        for (const item of orgstateOptions) {
          newstateOptions.push({
            label: convertToCase(item.stateSymbol),
            value: convertToCase(item.stateSymbol),
          });
          newArr.push(convertToCase(item.stateSymbol));
        }
        selectJson.stateOptionsLinear = newstateOptions;
        selectJson.stateOptions = newArr;
        newArr = [];
      }

    setTimeout(() => setMasterValues(contractOptions), 1000);
    setTimeout(() => setSelectValues(selectJson), 1000);

    if (prop.caseNumber !== undefined) {
      let gridApiArray = [];

      let getApiJson = {};
      getApiJson["tableNames"] = getTableDetails()["pdmProvFacAnc"];
      getApiJson["whereClause"] = { caseNumber: prop.caseNumber };
      customAxios
        .post("/generic/get", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status == 0) {
            const respData = res.data["data"].contPdmLinearTable[0];
            let apiResponse = {};
            apiResponse = mapPdmLinearTab(respData);

            apiResponse.contractType = {
              label: apiResponse.contractType,
              value: apiResponse.contractType,
            };

            apiResponse.provState = {
              label: apiResponse.provState,
              value: apiResponse.provState,
            };

            if (
              apiResponse.prodStates !== undefined &&
              apiResponse.prodStates !== ""
            ) {
              apiResponse.prodStatesDefault = apiResponse.prodStates
                .split(",")
                .map((ele) => {
                  return { label: ele, value: ele };
                });
            }

            setApiTestState(apiResponse);
            //setFormikInitializeState(true);
            setLoadForm(true);

            let apiResponseArray1 = [];
            let respData1 = res.data.data.contPdmType;
            respData1.forEach((js) => {
              const apiResponse = mapPdmTypeTable(js);
              apiResponseArray1.push(apiResponse);
            });
            setTypeTableRowsData(apiResponseArray1);

            let apiResponseArray2 = [];
            let respData2 = res.data.data.contPdmPayment;
            respData2.forEach((js) => {
              const apiResponse = mapPdmPaymentTable(js);
              apiResponseArray2.push(apiResponse);
            });
            setPaymentTableRowsData(apiResponseArray2);

            let apiResponseArray = [];
            let respData3 = res.data.data.contPdmLocation;
            respData3.forEach((js) => {
              const apiResponse = mapPdmAddressTable(js);
              if (apiResponse.hasOwnProperty("languages")) {
                apiResponse.languages = apiResponse.languages
                  .split(",")
                  .map((ele) => {
                    return { label: ele, value: ele };
                  });
              }
              apiResponseArray.push(apiResponse);
            });
            setLocationTableRowsData(apiResponseArray);

            if (prop.stageName == "Network") {
              let resJson = {};
              customAxios
                .get(
                  `/fetchPotentialDuplicate?legalEntityName=${prop.legalEntityName}&strRouteTo=${prop.stageName}&caseNumber=${prop.caseNumber}&transactionType=${ContractingPop.displayName}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                  resJson = { ...res };
                  if (res.status === 200) {
                    let getApiJson = {};
                    getApiJson["tableNames"] =
                      getTableDetails()["contPotentialDuplicate"];
                    getApiJson["whereClause"] = {
                      caseNumber: prop.caseNumber,
                      StageName: "<>~Exit&&Discard",
                    };

                    customAxios
                      .post("/generic/get", getApiJson, {
                        headers: { Authorization: `Bearer ${token}` },
                      })
                      .then((res) => {
                        const apiStat = res.data.Status;
                        if (apiStat === -1) {
                          alert("Error in fetching data");
                        }
                        if (apiStat === 0) {
                          const respData = [...res.data.data.potentialDup];
                          let newArr = [];
                          respData.forEach((js) => {
                            const newJson = convertToDateObj(js);
                            newJson.action = {
                              label: newJson.action,
                              value: newJson.action,
                            };
                            newArr.push(newJson);
                          });
                          setPotentialDupData(newArr);
                        }
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                  }
                });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }

    return () => {
      let NodeColor = document.getElementsByTagName("Input");
      for (var j = 0; j < NodeColor.length; j++) {
        NodeColor[j].style.background = "";
      }
    };
  }, []);

  const handleApiTestChange = (evt) => {
    const value = evt.target.value;

    setApiTestState({
      ...apiTestState,
      [evt.target.name]: evt.target.value,
    });
  };
  const gridDataRef = useRef({});

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    let clonedJson = { ...gridFieldTempState };
    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "LocationTable") {
        let indexJson = locationTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          if (clonedJson.hasOwnProperty("officeFaxNumber")) {
            clonedJson["officeFaxNumber"].value = clonedJson[
              "officeFaxNumber"
            ].value
              .toString()
              .replaceAll(/\D+/g, "");
          }
          if (clonedJson.hasOwnProperty("officePhoneNumber")) {
            clonedJson["officePhoneNumber"].value = clonedJson[
              "officePhoneNumber"
            ].value
              .toString()
              .replaceAll(/\D+/g, "");
          }
          if (clonedJson.hasOwnProperty("tddPhone")) {
            clonedJson["tddPhone"].value = clonedJson["tddPhone"].value
              .toString()
              .replaceAll(/\D+/g, "");
          }

          locationTableRowsData[index] = clonedJson;
          setLocationTableRowsData(locationTableRowsData);
        }
      }
      if (triggeredFormName === "TypeTable") {
        let indexJson = typeTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          typeTableRowsData[index] = clonedJson;
          setTypeTableRowsData(typeTableRowsData);
        }
      }

      if (triggeredFormName === "PaymentTable") {
        let indexJson = paymentTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        if (clonedJson.hasOwnProperty("phoneNo")) {
          clonedJson["phoneNo"].value = clonedJson["phoneNo"].value.replaceAll(
            /\D+/g,
            ""
          );
        }

        if (!checkGridJsonLength(clonedJson)) {
          paymentTableRowsData[index] = clonedJson;
          setPaymentTableRowsData(paymentTableRowsData);
        }
      }

      /////
      if (triggeredFormName === "FIRLTable") {
        let indexJson = firlTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          firlTableRowsData[index] = clonedJson;
          setFirlTableRowsData(firlTableRowsData);
        }
      }

      if (triggeredFormName === "CompensationTable") {
        let indexJson = compensationTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          compensationTableRowsData[index] = clonedJson;
          setCompensationTableRowsData(compensationTableRowsData);
        }
      }
      setGridFieldTempState({});
    }

    //Handling for data update/Delete/Insert inside grids.
    if (tabRef.current === "DashboardView") {
      let oprtn;
      let gridRowJson = {};
      if (operationType === "Add") {
        oprtn = "I";
      }

      if (operationType === "Edit") {
        oprtn = "U";
      }

      if (operationType === "Delete") {
        oprtn = "D";
      }
      let gridRowArray = [];

      if (triggeredFormName === "LocationTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("locationTable")
          ? [...gridDataRef.current.locationTable]
          : [];
        gridRowJson = { ...locationTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          gridRowArray.push(trimJsonValues(gridRowJson));

          gridDataRef.current.locationTable = getGridDataValues(gridRowArray);
        }
      }
      if (triggeredFormName === "TypeTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("typeTable")
          ? [...gridDataRef.current.typeTable]
          : [];
        gridRowJson = { ...typeTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          gridRowArray.push(gridRowJson);

          gridDataRef.current.typeTable = getGridDataValues(gridRowArray);
        }
      }

      if (triggeredFormName === "PaymentTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("paymentTable")
          ? [...gridDataRef.current.paymentTable]
          : [];
        gridRowJson = { ...paymentTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          gridRowArray.push(gridRowJson);

          gridDataRef.current.paymentTable = getGridDataValues(gridRowArray);
        }
      }

      /////
      if (triggeredFormName === "FIRLTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("firlTable")
          ? [...gridDataRef.current.firlTable]
          : [];
        gridRowJson = { ...firlTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          gridRowArray.push(gridRowJson);

          gridDataRef.current.firlTable = getGridDataValues(gridRowArray);
        }
      }
      if (triggeredFormName === "CompensationTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("compensationTable")
          ? [...gridDataRef.current.compensationTable]
          : [];
        gridRowJson = { ...compensationTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          gridRowArray.push(gridRowJson);

          gridDataRef.current.compensationTable =
            getGridDataValues(gridRowArray);
        }
      }
    }
  };

  const addTableRows = (triggeredFormName, index) => {
    let rowsInput = {};
    if (triggeredFormName === "TypeTable" && typeTableRowsData !== undefined) {
      rowsInput.rowNumber = typeTableRowsData.length + 1;
    }

    if (
      triggeredFormName === "PaymentTable" &&
      paymentTableRowsData !== undefined
    ) {
      rowsInput.rowNumber = paymentTableRowsData.length + 1;
    }

    if (
      triggeredFormName === "LocationTable" &&
      locationTableRowsData !== undefined
    ) {
      rowsInput.rowNumber = locationTableRowsData.length + 1;
      //setLocationTableRowsData([...locationTableRowsData, rowsInput]);
    }
    //Newly Added by Nidhi on 5/4/23
    if (triggeredFormName === "FIRLTable" && firlTableRowsData !== undefined) {
      rowsInput.rowNumber = firlTableRowsData.length + 1;
      //setFirlTableRowsData([...firlTableRowsData, rowsInput]);
    }
    if (
      triggeredFormName === "CompensationTable" &&
      compensationTableRowsData !== undefined
    ) {
      rowsInput.rowNumber = compensationTableRowsData.length + 1;
      //setCompensationTableRowsData([...compensationTableRowsData, rowsInput]);
    }

    setGridFieldTempState(rowsInput);
    //till here
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
      gridRowsFinalSubmit(triggeredFormName, index, "Delete");
      if (triggeredFormName === "TypeTable") {
        const rows = [...typeTableRowsData];
        rows.splice(index, 1);
        setTypeTableRowsData(rows);
      }
      if (triggeredFormName === "PaymentTable") {
        const rows = [...paymentTableRowsData];
        rows.splice(index, 1);
        setPaymentTableRowsData(rows);
      }
      if (triggeredFormName === "LocationTable") {
        const rows = [...locationTableRowsData];
        rows.splice(index, 1);
        setLocationTableRowsData(rows);
      }
      //Newly Added by Nidhi on 5/4/23
      if (triggeredFormName === "FIRLTable") {
        const rows = [...firlTableRowsData];
        rows.splice(index, 1);
        setFirlTableRowsData(rows);
      }
      if (triggeredFormName === "CompensationTable") {
        const rows = [...compensationTableRowsData];
        rows.splice(index, 1);
        setCompensationTableRowsData(rows);
      }
      //till here
    }
    if (operationValue === "Edit") {
      setGridFieldTempState({});
    }
  };

  const handleGridFieldChange = (index, evnt, triggeredFormName) => {
    //let rowsInput = "";
    let tempInput = { ...gridFieldTempState };
    let { name, value } = evnt.target;
    tempInput[name] = value.toUpperCase();
    setGridFieldTempState(tempInput);
  };

  //Newly Added by Nidhi on 5/4/23
  const handleLinearSelectChange = (selectValue, evnt) => {
    const { name } = evnt;

    let groupRiskIdValue = apiTestStateComp.groupRiskId;

    let networkIdValue = apiTestStateComp.networkId;

    if (name === "riskState" || name === "riskAssignment") {
      let riskStateValue = "";
      let riskValue = "";
      let taxValue = "";

      riskStateValue =
        name === "riskState"
          ? selectValue && selectValue.value
            ? selectValue.value
            : "--"
          : apiTestStateComp.riskState && apiTestStateComp.riskState.value
          ? apiTestStateComp.riskState.value
          : "--";
      riskValue =
        name === "riskAssignment"
          ? selectValue && selectValue.value
            ? selectValue.value.substring(0, 2)
            : "--"
          : apiTestStateComp.riskAssignment &&
            apiTestStateComp.riskAssignment.value
          ? apiTestStateComp.riskAssignment.value.substring(0, 2)
          : "--";
      taxValue =
        apiTestStateComp.taxId !== undefined && apiTestStateComp.taxId !== ""
          ? apiTestStateComp.taxId.substring(apiTestStateComp.taxId.length - 5)
          : "-----";

      groupRiskIdValue = riskStateValue + riskValue + taxValue;
    }

    if (name === "networkState") {
      let networkStateValue = "";
      let planValue = "";

      networkStateValue =
        name === "networkState"
          ? selectValue && selectValue.value
            ? selectValue.value
            : "--"
          : apiTestStateComp.networkState && apiTestStateComp.networkState.value
          ? apiTestStateComp.networkState.value
          : "--";
      planValue =
        apiTestStateComp.planValue !== undefined &&
        apiTestStateComp.planValue !== ""
          ? apiTestStateComp.planValue
          : "";

      networkIdValue = planValue + networkStateValue;
    }

    setApiTestStateComp({
      ...apiTestStateComp,
      groupRiskId: groupRiskIdValue,
      [name]: selectValue,
      networkId: networkIdValue,
    });
  };

  const handleActionSelectChange = (propertyName, propertyValue) => {
    const updatedData = potentialDupData?.map((data) => ({
      ...data,
      [propertyName]: { label: propertyValue, value: propertyValue },
    }));

    setPotentialDupData(updatedData);
  };

  const handleLinearFieldChange = (evt) => {
    let value = evt.target.value || "";
    value = value.toUpperCase();

    setApiTestStateComp({
      ...apiTestStateComp,
      [evt.target.name]: value, //changed by Nidhi Gupta on 10/16/2023
    });
  };

  const editTableRows = (index, triggeredFormName) => {
    let rowInput = {};

    if (triggeredFormName === "LocationTable") {
      rowInput = locationTableRowsData[index];
      setGridFieldTempState(rowInput);
    }
    if (triggeredFormName === "TypeTable") {
      rowInput = typeTableRowsData[index];
      setGridFieldTempState(rowInput);
    }
    if (triggeredFormName === "PaymentTable") {
      rowInput = paymentTableRowsData[index];
      setGridFieldTempState(rowInput);
    }
    /////
    if (triggeredFormName === "FIRLTable") {
      rowInput = firlTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "CompensationTable") {
      rowInput = compensationTableRowsData[index];
      setGridFieldTempState(rowInput);
    }
  };

  const handleDateChange = (date, dateName) => {
    if (dateName === "conEffectiveDate") {
      setApiTestStateComp({
        ...apiTestStateComp,
        conEffectiveDate: date,
      });
    }
    if (dateName === "mocAttestationDate") {
      setApiTestStateComp({
        ...apiTestStateComp,
        mocAttestationDate: date,
      });
    }
    if (dateName === "mocRenewalAttDate") {
      setApiTestStateComp({
        ...apiTestStateComp,
        mocRenewalAttDate: date,
      });
    }
  };

  const handleGridSelectChange = (
    index,
    selectedValue,
    evnt,
    triggeredFormName
  ) => {
    let rowsInput = { ...gridFieldTempState };

    const { name } = evnt;
    let val = selectedValue;
    if (evnt.action === "clear") {
      val = { label: "", value: "" };
    } else {
      //Changed by Nidhi Gupta on 12/02/2023 to handle undefined scenerios

      if (selectedValue && selectedValue.label && selectedValue.value) {
        val = {
          label: selectedValue.label.toUpperCase(),
          value: selectedValue.value.toUpperCase(),
        };
      } else {
        // Handle the case where selectedValue or its properties are undefined
        console.log("selectedValue or its properties are undefined");
      }
    }

    rowsInput[name] = val;
    setGridFieldTempState(rowsInput);
  };

  const modifyValidatedAddressRow = (index, data) => {
    setGridFieldTempState(data);
  };
  const getNextSequence = async (path) => {
    let sequenceNumber;
    try {
      const response = await customAxios.get(path, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        sequenceNumber = response.data;
      }
      return sequenceNumber;
    } catch (error) {
      console.log(error);
    }
  };

  const getGridData = (jsonObj) => {
    let gridObj = {};

    Object.keys(jsonObj).map((key) => {
      if (key === "languages") {
        gridObj[key] = jsonObj[key].split(",").map((ele) => {
          return { label: ele, value: ele };
        });
      } else {
        gridObj[key] = { value: jsonObj[key], label: jsonObj[key] };
      }
    });
    return gridObj;
  };

  const saveFormData = async (values) => {
    try {
      if (true) {
        setButtonDisableFlag(true);

        let contractingConfigData = JSON.parse(
          process.env.REACT_APP_CONTRACTING_DETAILS
        );
        const flowId = contractingConfigData["FlowId"];
        const stageId = contractingConfigData["StageId"];
        const stageName = contractingConfigData["StageName"];
        prop.stageName = contractingConfigData["StageName"];

        const provObject = {};
        provObject.userName = prop.userName;
        provObject.mgrFirstName = values.mgrFirstName;
        provObject.mgrLastName = values.mgrLastName;
        provObject.mgrEmail = values.mgrEmail;
        provObject.mgrPhone = values.mgrPhone.replaceAll(/\D+/g, "");
        provObject.mgrFax = values.mgrFax;
        provObject.mgrorg = values.mgrorg;
        provObject.entityName = values.entityName;
        provObject.provAddress = values.provAddress;
        provObject.provAddress2 = values.provAddress2;
        provObject.proCity = values.proCity;
        provObject.provZipCode = values.provZipCode;

        //Newest by Nidhi
        provObject.credEmail = values.credEmail;
        // provObject.credPhone = values.credPhone;
        provObject.credPhone = values.credPhone.replaceAll(/\D+/g, "");
        provObject.credFax = values.credFax;
        provObject.credContactName = values.credContactName;

        provObject.provState =
          values.provState.value !== undefined ? values.provState.value : null;

        provObject.contractType =
          values.contractType.value !== undefined
            ? values.contractType.value
            : null;
        provObject.prodStates =
          selectData.selectTwo !== undefined
            ? selectData.selectTwo.value.map((el) => el.value).toString()
            : "";

        provObject.medicare =
          values.medicare !== undefined ? values.medicare : true;

        provObject.provCount = values.provCount;

        const mainWIObject = {};
        mainWIObject.caseStatus = "Open";
        mainWIObject.createdByName = prop.userName;
        mainWIObject.flowId = flowId;
        mainWIObject.stageName = stageName;
        mainWIObject.stageId = stageId;
        mainWIObject.transactionType = ContractingPop.displayName;

        mainWIObject.firstName = values.mgrFirstName;
        mainWIObject.lastName = values.mgrLastName;

        mainWIObject.legalEntityName = values.entityName;
        mainWIObject.Field2 = provObject.prodStates;
        mainWIObject.lockStatus = "N";

        let apiJson = {};
        apiJson["MainCaseTable"] = mainWIObject;
        apiJson["Cont_ProvFaciAnci_Details"] = provObject;

        apiJson["Cont_Type_Grid"] = getGridDataValues(typeTableRowsData);
        apiJson["Cont_Payment_Grid"] = getGridDataValues(paymentTableRowsData);
        apiJson["Cont_Location_Grid"] = getGridDataValues(
          locationTableRowsData
        );

        //Added by Nidhi Gupta on 11/10/2023
        if (apiJson["Cont_Location_Grid"] !== undefined) {
          apiJson["Cont_Location_Grid"].map((data) => {
            data.languages =
              data.languages !== undefined
                ? typeof data.languages !== "string"
                  ? data.languages.map((el) => el.value).toString()
                  : data.languages
                : "";
          });
        }

        //Till Here
        //Newly Added by Nidhi Gupta 08/04/2023
        if (apiJson["Cont_Location_Grid"] !== undefined) {
        }
        if (
          callProcRef.current === "callProc" &&
          apiJson["Cont_Location_Grid"] !== undefined &&
          apiJson["Cont_Location_Grid"].length > 5
        ) {
          alert(
            "Maximum 5 addresses can be added under Provider Address Grid."
          );
          setButtonDisableFlag(false);
          return;
        }
        //From Here
        if (
          documentSectionDataRef.current == undefined ||
          documentSectionDataRef.current.length == 0
        ) {
          alert("W9 Document is mandatory to upload.");
          setButtonDisableFlag(false);
          return;
        }

        if (
          documentSectionDataRef.current !== undefined &&
          documentSectionDataRef.current.length > 0
        ) {
          let isW9Available = false;
          documentSectionDataRef.current.forEach((elem) => {
            if (elem.documentType === "W9 Document") {
              isW9Available = true;
              return;
            }
          });
          if (!isW9Available) {
            alert("W9 Document is mandatory to upload.");
            setButtonDisableFlag(false);
            return;
          }
        }
        //Till Here
        /* if((callProcRef.current === 'callProc') && (apiJson["Cont_ProvFaciAnci_Details"].contractType === undefined || apiJson["Cont_ProvFaciAnci_Details"].contractType === ''))
                {
                    setButtonDisableFlag(false);
                    alert("Please select Contract Type");
                    return;
                }*/
        //Added by Nidhi Gupta on 08/09/2023
        const promise = new Promise((resolve, reject) => {
          resolve(createContractId(values));
        });

        await promise
          .then(() => {
            setTimeout(() => {
              apiJson["Cont_ProvFaciAnci_Details"].contractId =
                values.contractId;
              apiJson["MainCaseTable"].Field1 = values.contractId;

              customAxios
                .post(baseURL + "/generic/create", apiJson, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                  const apiStat = res.data["CreateCase_Output"]["Status"];
                  if (apiStat === -1) {
                    alert("Case is not created.");
                    setButtonDisableFlag(false);
                  }

                  if (apiStat === 0) {
                    //alert("Case created with case number: "+res.data['CreateCase_Output']['CaseNo']+" and Contract Id: "+values.contractId);
                    // alert("Contract Id generated is ",apiTestState.contractId);
                    let procData = {};
                    let procDataState = {};
                    procDataState.stageName = stageName;
                    procDataState.flowId = flowId;
                    procDataState.caseNumber =
                      res.data["CreateCase_Output"]["CaseNo"];
                    procDataState.decision = "Submit";
                    procDataState.userName = mastersSelector.hasOwnProperty(
                      "auth"
                    )
                      ? mastersSelector.auth.hasOwnProperty("userName")
                        ? mastersSelector.auth.userName
                        : "system"
                      : "system";
                    procDataState.formNames = formName.current;

                    procData.state = procDataState;

                    //Newly Added by Nidhi Gupta on 08/04/2023

                    if (
                      documentSectionDataRef.current !== undefined &&
                      documentSectionDataRef.current.length > 0
                    ) {
                      let documentArray = [...documentSectionDataRef.current];
                      documentArray = documentArray.filter(
                        (x) => x.docStatus === "Uploaded"
                      );
                      documentArray.forEach((e) => {
                        const fileUploadData = new FormData();
                        fileUploadData.append("file", e.fileData);
                        fileUploadData.append("source", "Manual");
                        fileUploadData.append(
                          "caseNumber",
                          res.data["CreateCase_Output"]["CaseNo"]
                        );
                        fileUploadData.append("docType", e.documentType);

                        fileUpDownAxios
                          .post("/uploadFile", fileUploadData)
                          .then((response) => {
                            if (response.data.fileName !== "Failed") {
                            }
                            if (response.data.fileName === "Failed") {
                            }
                          });
                      });
                    }
                    //else{
                    alert(
                      "Case created with case number: " +
                        res.data["CreateCase_Output"]["CaseNo"] +
                        " and Contract Id: " +
                        values.contractId
                    );
                    submitCase(procData, navigateContractingHome);
                  }

                  // navigateContractingHome();   //uncomment after testing
                })
                .catch((err) => {
                  console.log(
                    "Caught in generic create api call: ",
                    err.message
                  );
                  alert("Error occured in generic create api call.");
                  setButtonDisableFlag(false);
                });

              //Then From here Added by Nidhi Gupta on 08/09/2023
            }, 1000);
          })
          .catch((err) => {
            console.error(err);
          });
        //till here to close
      }
    } catch (error) {
      alert("Error occured in saving form data");
      printConsole("Caught in saveFormData error: ", error);
      setButtonDisableFlag(false);
    }
  };
  const createContractId = (values) => {
    try {
      let sequenceNumber;
      const path = baseURL + "/generic/contractIdSeq";
      let awaitOut = getNextSequence(path);
      awaitOut.then((seqId) => {
        sequenceNumber = seqId;
        var zerofilled = ("000000" + sequenceNumber).slice(-6);
        let calContractId;
        let selectedStateVal =
          values.provState.value !== undefined ? values.provState.value : "**";
        calContractId = "C" + selectedStateVal + zerofilled;
        values.contractId = calContractId;
        setApiTestState({
          ...apiTestState,
          contractId: calContractId,
        });
      });
    } catch (error) {
      alert("Error occured in creating ContractId");
      printConsole("Caught in createContractId error: ", error);
      setButtonDisableFlag(false);
    }
  };

  const saveData = (values) => {
    //Instead this is added
    if (tabRef.current === "HomeView") {
      saveFormData(values);
    }

    if (tabRef.current === "DashboardView") {
      //submitCase(prop, apiUrl);
      updateFormData(values);
    }
  };

  const updateFormData = (values) => {
    try {
      setButtonDisableFlag(true);
      //Added by Nidhi
      delete values.caseNumber;

      //Till Here

      const updateProvState =
        !!selectData && !!selectData.selectOne && !!selectData.selectOne.value
          ? selectData.selectOne.value.value
          : apiTestState.provState;

      const updateContractType =
        !!selectData &&
        !!selectData.selectThree &&
        !!selectData.selectThree.value
          ? selectData.selectThree.value.value
          : apiTestState.contractType;

      const updateProvStates =
        !!selectData && !!selectData.selectTwo && !!selectData.selectTwo.value
          ? selectData.selectTwo.value.map((el) => el.value).toString()
          : apiTestState.prodStates;

      const mainWIObject = {};
      /*//mainWIObject.caseID = prop.caseNumber;
        mainWIObject.caseStatus = "Open";
        mainWIObject.createdByName = prop.userName;
        mainWIObject.flowId = "1";
        mainWIObject.stageName = "Network";
        mainWIObject.transactionType = ProvAnciFac.displayName;
        //mainWIObject.caseNumber = prop.caseNumber;
        //mainWIObject.createdBy = "1";
        mainWIObject.firstName = values.mgrFirstName;
        mainWIObject.lastName = values.mgrLastName;
        mainWIObject.npiId = '';*/
      //Added by Nidhi Gupta on 06/21/2023
      mainWIObject.legalEntityName = values.entityName;
      mainWIObject.firstName = values.mgrFirstName;
      mainWIObject.lastName = values.mgrLastName;
      mainWIObject.Field2 = updateProvStates;

      const provObject = {};
      provObject.userName = prop.userName;
      provObject.mgrFirstName = values.mgrFirstName;
      provObject.mgrLastName = values.mgrLastName;
      provObject.mgrEmail = values.mgrEmail;
      provObject.mgrPhone = values.mgrPhone.replaceAll(/\D+/g, "");
      // provObject.mgrPhone = values.mgrPhone;
      provObject.mgrFax = values.mgrFax;
      provObject.mgrorg = values.mgrorg;
      provObject.entityName = values.entityName;
      provObject.provAddress = values.provAddress;
      provObject.provAddress2 = values.provAddress2;
      provObject.proCity = values.proCity;
      provObject.provZipCode = values.provZipCode;
      //provObject.provState = updateProvState;
      provObject.provState =
        values.provState.value !== undefined ? values.provState.value : null;
      // provObject.contractType =updateContractType;
      provObject.contractType =
        values.contractType.value !== undefined
          ? values.contractType.value
          : null;

      provObject.prodStates = updateProvStates;
      //provObject.medicaid = values.medicaid;
      //provObject.medicare = values.medicare;
      provObject.medicare =
        values.medicare !== undefined ? values.medicare : true;
      //provObject.bhvrHealth = values.bhvrHealth;
      //provObject.commercial = values.commercial;
      //provObject.exchange = values.exchange;
      provObject.provCount = values.provCount;

      //Newest by Nidhi
      provObject.credEmail = values.credEmail;
      provObject.credPhone = values.credPhone.replaceAll(/\D+/g, "");
      provObject.credFax = values.credFax;
      provObject.credContactName = values.credContactName;
      provObject.contractId = values.contractId;

      //Newly Added by Nidhi 0n 05/04/23

      let requestBody = {};
      requestBody.terminationClause =
        apiTestStateComp.terminationClause !== undefined
          ? apiTestStateComp.terminationClause
          : "";
      requestBody.pcpId =
        apiTestStateComp.pcpId !== undefined ? apiTestStateComp.pcpId : "";
      requestBody.taxId =
        apiTestStateComp.taxId !== undefined ? apiTestStateComp.taxId : "";
      requestBody.medicalLicense =
        apiTestStateComp.medicalLicense !== undefined
          ? apiTestStateComp.medicalLicense
          : "";
      requestBody.groupRiskId =
        apiTestStateComp.groupRiskId !== undefined
          ? apiTestStateComp.groupRiskId
          : "";
      requestBody.networkId =
        apiTestStateComp.networkId !== undefined
          ? apiTestStateComp.networkId
          : "";
      requestBody.planValue =
        apiTestStateComp.planValue !== undefined
          ? apiTestStateComp.planValue
          : "";
      requestBody.annualEscl =
        apiTestStateComp.annualEscl !== undefined
          ? apiTestStateComp.annualEscl
          : "";
      requestBody.starsIncentive =
        apiTestStateComp.starsIncentive !== undefined
          ? apiTestStateComp.starsIncentive
          : "";
      requestBody.awvIncentive =
        apiTestStateComp.awvIncentive !== undefined
          ? apiTestStateComp.awvIncentive
          : "";
      requestBody.medicalHome =
        apiTestStateComp.medicalHome !== undefined
          ? apiTestStateComp.medicalHome
          : "";
      requestBody.pricingAWP =
        apiTestStateComp.pricingAWP !== undefined
          ? apiTestStateComp.pricingAWP
          : "";
      requestBody.pricingASP =
        apiTestStateComp.pricingASP !== undefined
          ? apiTestStateComp.pricingASP
          : "";
      requestBody.riskAssignment =
        apiTestStateComp.riskAssignment && apiTestStateComp.riskAssignment.value
          ? apiTestStateComp.riskAssignment.value
          : "";
      requestBody.networkState =
        apiTestStateComp.networkState && apiTestStateComp.networkState.value
          ? apiTestStateComp.networkState.value
          : "";
      requestBody.feeSchedule =
        apiTestStateComp.feeSchedule && apiTestStateComp.feeSchedule.value
          ? apiTestStateComp.feeSchedule.value
          : "";
      requestBody.riskState =
        apiTestStateComp.riskState && apiTestStateComp.riskState.value
          ? apiTestStateComp.riskState.value
          : "";
      requestBody.contractTypeComp =
        apiTestStateComp.contractTypeComp &&
        apiTestStateComp.contractTypeComp.value
          ? apiTestStateComp.contractTypeComp.value
          : "";
      requestBody.sequesApplies =
        apiTestStateComp.sequesApplies && apiTestStateComp.sequesApplies.value
          ? apiTestStateComp.sequesApplies.value
          : "";
      requestBody.criticalAccess =
        apiTestStateComp.criticalAccess && apiTestStateComp.criticalAccess.value
          ? apiTestStateComp.criticalAccess.value
          : "";
      requestBody.qualityFlagI =
        apiTestStateComp.qualityFlagI && apiTestStateComp.qualityFlagI.value
          ? apiTestStateComp.qualityFlagI.value
          : "";
      requestBody.qualityFlagJ =
        apiTestStateComp.qualityFlagJ && apiTestStateComp.qualityFlagJ.value
          ? apiTestStateComp.qualityFlagJ.value
          : "";
      requestBody.qualityFlagK =
        apiTestStateComp.qualityFlagK && apiTestStateComp.qualityFlagK.value
          ? apiTestStateComp.qualityFlagK.value
          : "";
      requestBody.qualityFlagL =
        apiTestStateComp.qualityFlagL && apiTestStateComp.qualityFlagL.value
          ? apiTestStateComp.qualityFlagL.value
          : "";
      requestBody.qualityFlagM =
        apiTestStateComp.qualityFlagM && apiTestStateComp.qualityFlagM.value
          ? apiTestStateComp.qualityFlagM.value
          : "";
      requestBody.qualityFlagN =
        apiTestStateComp.qualityFlagN && apiTestStateComp.qualityFlagN.value
          ? apiTestStateComp.qualityFlagN.value
          : "";
      /*requestBody.conEffectiveDate = !!apiTestStateComp.conEffectiveDate ? apiTestStateComp.conEffectiveDate.toLocaleDateString() : null;
          requestBody.mocAttestationDate = !!apiTestStateComp.mocAttestationDate ? apiTestStateComp.mocAttestationDate.toLocaleDateString() : null;
          requestBody.mocRenewalAttDate = !!apiTestStateComp.mocRenewalAttDate ? apiTestStateComp.mocRenewalAttDate.toLocaleDateString() : null;*/

      requestBody.conEffectiveDate = extractDate(
        apiTestStateComp.conEffectiveDate
      );
      requestBody.mocAttestationDate = extractDate(
        apiTestStateComp.mocAttestationDate
      );
      requestBody.mocRenewalAttDate = extractDate(
        apiTestStateComp.mocRenewalAttDate
      );

      //till here

      if (potentialDupData !== undefined && potentialDupData.length > 0) {
        let updateArray = [];
        potentialDupData.map((data) => {
          if (
            data["action"] !== undefined &&
            data["action"].value !== undefined
          ) {
            updateArray.push({
              caseNumber: data["caseNumber"],
              action: data["action"].value,
              dupCaseId: data["dupCaseId"],
              rowNumber: data["dupCaseId"],
            });
          }
        });
        gridDataRef.current.potentialDuplicateTable = updateArray;
      }

      //    apiJson = saveGridData(apiJson);
      let apiJson = {};
      apiJson["caseNumber"] = prop.caseNumber;
      apiJson["MainCaseTable"] = mainWIObject;
      apiJson["Cont_ProvFaciAnci_Details"] = provObject;
      //Changed by Nidhi on 01_22_2024
      if (
        apiCallOnce &&
        Object.keys(apiTestStateComp).length > 0 &&
        Object.values(apiTestStateComp).some(
          (value) => value !== "" && value !== null
        )
      ) {
        apiJson["Cont_Compensation_Details"] = requestBody;
      }
      apiJson["Cont_Compensation_Grid"] = gridDataRef.current.compensationTable;
      apiJson["Cont_Firl_Grid"] = gridDataRef.current.firlTable;
      //till here
      apiJson["Cont_Type_Grid"] = gridDataRef.current.typeTable;
      apiJson["Cont_Payment_Grid"] = gridDataRef.current.paymentTable;
      if (!gridDataRef.current) {
      }
      apiJson["Cont_Location_Grid"] = gridDataRef.current.locationTable;
      //Added by Nidhi Gupta on 11/10/2023
      if (apiJson["Cont_Location_Grid"] !== undefined) {
        apiJson["Cont_Location_Grid"].map((data) => {
          data.languages =
            data.languages !== undefined
              ? typeof data.languages !== "string"
                ? data.languages.map((el) => el.value).toString()
                : data.languages
              : "";
        });
      }

      //Till Here
      apiJson["Cont_PotentialDuplicate"] =
        gridDataRef.current.potentialDuplicateTable;

      var todaydate = new Date();

      let saveType = callProcRef.current === "callProc" ? "SS" : "SE";
      let isDecisionDiscard = true;
      const dec =
        prop.decision !== undefined ? prop.decision.toUpperCase().trim() : "";

      if (callProcRef.current === "callProc" && dec === "") {
        alert("Please select Decision.");
        setButtonDisableFlag(false); //Added on 5/17/2023
        return;
      } else {
        isDecisionDiscard = checkDecision(dec, callProcRef.current);
      }

      if (!isDecisionDiscard) {
        if (locationTableRowsData !== undefined) {
        }
        if (
          callProcRef.current === "callProc" &&
          locationTableRowsData !== undefined &&
          locationTableRowsData.length > 5
        ) {
          alert(
            "Maximum 5 addresses can be added under Provider Address Grid."
          );
          setButtonDisableFlag(false);
          return;
        }
        //Till Here
        //COmmented because validatd the contract using formik
        /* if(((callProcRef.current === 'callProc') && (apiTestState.contractType === undefined || apiTestState.contractType === '')))
        {
            setButtonDisableFlag(false);
            alert("Please select Contract Type");
            return;
        }*/

        /*if((apiTestStateComp.conEffectiveDate !== '') && (apiTestStateComp.conEffectiveDate !== undefined))
        {
            if(apiTestStateComp.conEffectiveDate.getTime()<todaydate.getTime() )
        {
            setButtonDisableFlag(false);
            alert("Contract Effective Date should be greater than today's date");
            return;
        }
         }*/
        if (
          callProcRef.current === "callProc" &&
          !validatePotentialDup(potentialDupData)
        ) {
          setButtonDisableFlag(false);
          alert("Please select Action dropdown for all cases");
          return;
        }

        //Newly Added by Nidhi Gupta on 07/20/2023
        let validateDec = true;

        if (callProcRef.current === "callProc" && dec !== "") {
          //const dec = (prop.decision !== undefined)?prop.decision.toUpperCase().trim():'';
          if (dec !== "DISCARD") {
            validateDec = validatePotentialDupDec(potentialDupData);
            if (!validateDec) {
              setButtonDisableFlag(false);
              alert(
                "Please choose Decision Discard as it is a Potential Duplicate Case"
              );
              return;
            }
          }
        }
      }

      customAxios
        .post("/generic/update", apiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          //Added by Nidhi on 04/06/2023
          const apiStat = res.data["UpdateCase_Output"]["Status"];
          if (apiStat === -1) {
            alert("Data not updated.");
            setButtonDisableFlag(false);
          }

          if (apiStat === 0) {
            alert("Case data updated successfully");
            updateDecision(prop, saveType, ContractingPop.displayName);

            if (callProcRef.current === "callProc") {
              submitCase(prop, navigateHome);
            }
            if (callProcRef.current !== "callProc") {
              navigateHome();
            }
          }
          //till here
        })
        .catch((err) => {
          alert("Error occured in generic update api call.");
          setButtonDisableFlag(false);
        });
    } catch (error) {
      printConsole("Caught in updateFormData error: ", error);
      alert("Error occured in updating data.");
      setButtonDisableFlag(false);
    }
  };

  const formikFieldsOnChange = (evnt, setFieldValue, field) => {
    let value = evnt.target.value || "";
    //value = value.toUpperCase().trim();
    value = value.toUpperCase();
    printConsole("Inside organization Name onChange: ", value);
    setFieldValue(field.name, value);
  };

  const saveGridData = (caseNumber) => {
    let apiUrlArray = [];
    let apiStr = baseURL;
    let apiUrlObject = {};
    const typeResponse = getGridDataValues(typeTableRowsData, caseNumber);
    const paymentResponse = getGridDataValues(paymentTableRowsData, caseNumber);
    const locationResponse = getGridDataValues(
      locationTableRowsData,
      caseNumber
    );

    if (typeResponse !== undefined && typeResponse.length > 0) {
      apiUrlObject["name"] = "Type Table";
      apiStr = apiStr + "addType/type";
      apiUrlObject["apiKey"] = apiStr;
      apiUrlObject["apiValue"] = typeResponse;
      apiUrlArray.push(apiUrlObject);
      apiStr = baseURL;
      apiUrlObject = {};
    }
    if (paymentResponse !== undefined && paymentResponse.length > 0) {
      apiUrlObject["name"] = "Payment Table";
      apiStr = apiStr + "addPayment/payment";
      apiUrlObject["apiKey"] = apiStr;
      apiUrlObject["apiValue"] = paymentResponse;
      apiUrlArray.push(apiUrlObject);
      apiStr = baseURL;
      apiUrlObject = {};
    }
    if (locationResponse !== undefined && locationResponse.length > 0) {
      apiUrlObject["name"] = "Location Table";
      apiStr = apiStr + "addLocation/location";
      apiUrlObject["apiKey"] = apiStr;
      apiUrlObject["apiValue"] = locationResponse;
      apiUrlArray.push(apiUrlObject);
      apiStr = baseURL;
      apiUrlObject = {};
    }

    if (apiUrlArray !== undefined && apiUrlArray.length > 0) {
      customAxios
        .all(
          apiUrlArray.map((endpoint) =>
            customAxios.post(endpoint["apiKey"], endpoint["apiValue"], {
              headers: { Authorization: `Bearer ${token}` },
            })
          )
        )
        .then((res) => {
          for (let i = 0; i < apiUrlArray.length; i++) {
            if (res[i].status === 200) {
              //alert(apiUrlArray[i]["name"] + " data saved successfuly");
            } else {
              //alert("Error in saving "+apiUrlArray[i]["name"] + " data");
            }
          }
        })
        .catch((err) => {
          //console.log(err.message);
          //alert("Error in saving data");
        });
    }
  };

  const getGridDataValues = (tableData, caseNumber) => {
    let returnArray = [];
    tableData.map((data) => {
      const dataObject = {};
      const dataKeys = Object.keys(data);
      dataKeys.forEach((dataValue) => {
        const dataKeyType = typeof data[dataValue];

        if (dataKeyType === "object") {
          if (!!data[dataValue]) {
            if (!!data[dataValue].value) {
              if (data[dataValue].value instanceof Date) {
                dataObject[dataValue] = extractDate(data[dataValue].value);
              } else {
                dataObject[dataValue] = data[dataValue].value;
              }
            }

            //Added by Nidhi Gupta on 6/12/2023
            else if (data[dataValue].value == "") {
              dataObject[dataValue] = "";
            } else {
              if (data[dataValue] instanceof Date) {
                //dataObject[dataValue] = data[dataValue].toLocaleDateString();
                dataObject[dataValue] = extractDate(data[dataValue]);
              } else {
                dataObject[dataValue] = data[dataValue];
              }
            }
            // else {
            //      dataObject[dataValue] = '';
            //  }
            //till here
          } else {
            dataObject[dataValue] = "";
          }
          //dataObject[dataValue] = (data[dataValue].value!==undefined)?data[dataValue].value:'');
        }
        if (dataKeyType !== "object") {
          dataObject[dataValue] = data[dataValue];
        }
      });
      dataObject.caseNumber = caseNumber;
      returnArray.push(dataObject);
    });
    return returnArray;
  };

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

  const populateFormBasisOnType = () => {
    if (tabRef.current === "DashboardView") {
      return (
        <>
          <Tabs
            defaultActiveKey="Provider Contracting"
            id="justify-tab-example"
            className="mb-3"
            justify
            onSelect={(key) => handleTabSelect(key)}
          >
            {/* <Tab eventKey={prop.formNames} title={ProvAnciFac.displayName}>
                         {populateForm()}
                    </Tab> */}

            <Tab eventKey="Provider Contracting" title="Provider Contracting">
              {populateForm()}
            </Tab>
            <Tab eventKey="Compensation" title="Network">
              <CompensationTab
                apiTestStateComp={apiTestStateComp}
                firlTableRowsData={firlTableRowsData}
                compensationTableRowsData={compensationTableRowsData}
                addTableRows={addTableRows}
                deleteTableRows={deleteTableRows}
                editTableRows={editTableRows}
                gridFieldTempState={gridFieldTempState}
                handleGridSelectChange={handleGridSelectChange}
                /*handleGridDateChange={handleGridDateChange}*/
                handleGridFieldChange={handleGridFieldChange}
                gridRowsFinalSubmit={gridRowsFinalSubmit}
                handleLinearSelectChange={handleLinearSelectChange}
                handleLinearFieldChange={handleLinearFieldChange}
                handleMedicalGrpNoShow={handleMedicalGrpNoShow}
                handleNetworkIdShow={handleNetworkIdShow}
                handlePcpIdShow={handlePcpIdShow}
                handleDateChange={handleDateChange}
                transactionType={ContractingPop.displayName}
                /*selectJson={selectValues}*/
                //type={'Editable'}
                //lockStatus={(prop!==null && prop.lockStatus!==undefined)?prop.lockStatus:'N'}>
                type={"ShowEye"}
                lockStatus={"V"}
              ></CompensationTab>
            </Tab>

            <Tab eventKey="Document" title="Document">
              <DocumentTab
                contractId={prop.contractId}
                providerId={''}
                caseNumber={prop.caseNumber}
                selectedType={prop.selectedType}
                searchType={'Contracting'}
              />
            </Tab>
          </Tabs>
        </>
      );
    }
    if (tabRef.current === "HomeView") {
      return <>{populateForm()}</>;
    }
  };

  const populateForm = () => {
    return (
      <>
        <div className="col-xs-12">
          <div
            className="accordion AddProviderLabel"
            id="accordionPanelsStayOpenExample"
          >
            <Formik
              //enableReinitialize = {formikInitializeState}
              initialValues={apiTestState}
              onSubmit={async (values) => {
                await new Promise((resolve) => setTimeout(resolve, 500)).catch(
                  (err) => {
                    console.error(err);
                  }
                );
                //alert(JSON.stringify(values, null, 2));
                saveData(values);
              }}
              validationSchema={validationSchema}
            >
              {(props) => {
                const {
                  values,
                  touched,
                  errors,
                  dirty,
                  isSubmitting,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  handleReset,
                  setFieldValue,
                } = props;
                return (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <fieldset
                      disabled={
                        tabRef.current === "DashboardView" &&
                        prop.lockStatus !== undefined &&
                        prop.lockStatus === "Y"
                          ? true
                          : false
                      }
                    >
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-headingOne"
                        >
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
                                  Please provide the following information below
                                  and to review all information to confirm the
                                  accuracy to proceed with network acceptance
                                  and contracting.
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-headingTwo"
                        >
                          <button
                            className="accordion-button accordionButtonStyle disableElements"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseTwo"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseTwo"
                          >
                            Administrative Information
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseTwo"
                          className="accordion-collapse collapse show disableElements"
                          aria-labelledby="panelsStayOpen-headingTwo"
                        >
                          <div className="accordion-body">
                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                {/* <div className="form-floating"> */}
                                <Field name="contractType">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <Select
                                        //   classNames={{
                                        //     control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectThree&&!selectData.selectThree.value)?"is-invalid":""}`
                                        // }}
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
                                          menu: (provided) => ({
                                            ...provided,
                                            zIndex: 9999,
                                          }),

                                          container: (provided, state) => ({
                                            ...provided,
                                            marginTop: 0,
                                          }),
                                          valueContainer: (
                                            provided,
                                            state
                                          ) => ({
                                            ...provided,
                                            overflow: "visible",
                                          }),
                                          placeholder: (provided, state) => ({
                                            ...provided,
                                            position: "absolute",
                                            top:
                                              state.hasValue ||
                                              state.selectProps.inputValue
                                                ? -15
                                                : "50%",
                                            transition:
                                              "top 0.1s, font-size 0.1s",
                                            fontSize:
                                              (state.hasValue ||
                                                state.selectProps.inputValue) &&
                                              13,
                                          }),
                                        }}
                                        components={{
                                          ValueContainer: CustomValueContainer,
                                        }}
                                        name="contractType"
                                        //isDisabled={(tabRef.current==='DashboardView'&&(prop.lockStatus!==undefined && prop.lockStatus==='Y')?true:false)}
                                        isDisabled={
                                          tabRef.current === "DashboardView" &&
                                          prop.lockStatus !== undefined &&
                                          prop.lockStatus === "Y"
                                            ? true
                                            : false
                                        }
                                        className="basic-multi-select"
                                        //isClearable
                                        options={masterValues}
                                        id="contractTypeDropdown"
                                        isMulti={false}
                                        onChange={(selectValue, event) =>
                                          setFieldValue(field.name, selectValue)
                                        }
                                        value={field.value}
                                        onFocus={() => {}}
                                        placeholder="Contract Type"
                                        //styles={{...customStyles}}
                                        isSearchable={
                                          document.documentElement
                                            .clientHeight >
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
                                  name="contractType"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="mgrFirstName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="30"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
                                        }
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Administrator First Name
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
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="mgrLastName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="70"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
                                        }
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Administrator Last Name
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
                              </div>
                            </div>

                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="mgrEmail">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="50"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
                                        }
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Administrator Email
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
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="mgrPhone">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="14"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={handlePhoneNumber(field.value)}
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Contact Phone#
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
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="mgrFax">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="10"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Contact Fax#
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                      {/* <p>Format: xxx-xxx-xxxx</p> */}
                                    </div>
                                  )}
                                </Field>
                              </div>
                            </div>
                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="entityName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
                                        }
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Legal Entity Name
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
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="credContactName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
                                        }
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Credentialing Contact Name
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
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="credEmail">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="50"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
                                        }
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Credentialing Email
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
                              </div>
                            </div>

                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="credPhone">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="14"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={handlePhoneNumber(field.value)}
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Credentialing Phone#
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
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="credFax">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="10"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Credentialing Fax#
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                      {/* <p>Format: xxx-xxx-xxxx</p> */}
                                    </div>
                                  )}
                                </Field>
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="contractId">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="9"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        disabled
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Contract Id
                                      </label>
                                      {meta.touched && meta.error && (
                                        <div
                                          className="invalid-feedback"
                                          style={{ display: "block" }}
                                        >
                                          {meta.error}
                                        </div>
                                      )}
                                      {/* <p>Format: xxx-xxx-xxxx</p> */}
                                    </div>
                                  )}
                                </Field>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-headingThree"
                        >
                          <button
                            className="accordion-button accordionButtonStyle disableElements"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseThree"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseThree"
                          >
                            Please Provide Contract Address of Notice
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseThree"
                          className="accordion-collapse collapse show disableElements"
                          aria-labelledby="panelsStayOpen-headingThree"
                        >
                          <div className="accordion-body">
                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="provAddress">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="150"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
                                        }
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Address
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
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="provAddress2">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="100"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
                                        }
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        Address 2
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
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <Field name="proCity">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="50"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
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
                              </div>
                            </div>

                            <div className="row my-2">
                              {/*Change from here */}

                              <div className="col-xs-6 col-md-4">
                                <Field name="provState">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <Select
                                        // classNames={{
                                        //     control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectOne&&!selectData.selectOne.value)?"is-invalid":""}`
                                        // }}

                                        styles={{
                                          control: (provided) => ({
                                            ...provided,
                                            height: "58px",
                                            fontWeight: "lighter",
                                            overflowY: "scroll",
                                          }),
                                          menuList: (provided) => ({
                                            ...provided,
                                            maxHeight: 200,
                                          }),

                                          container: (provided, state) => ({
                                            ...provided,
                                            marginTop: 0,
                                          }),
                                          valueContainer: (
                                            provided,
                                            state
                                          ) => ({
                                            ...provided,
                                            overflow: "visible",
                                          }),
                                          placeholder: (provided, state) => ({
                                            ...provided,
                                            position: "absolute",
                                            top:
                                              state.hasValue ||
                                              !!state.selectProps.inputValue
                                                ? -15
                                                : "50%",
                                            transition:
                                              "top 0.1s, font-size 0.1s",
                                            fontSize:
                                              (state.hasValue ||
                                                state.selectProps.inputValue) &&
                                              13,
                                          }),
                                        }}
                                        components={{
                                          ValueContainer: CustomValueContainer,
                                        }}
                                        name={field.name}
                                        // name = "state"
                                        //isClearable
                                        isDisabled={
                                          tabRef.current === "DashboardView" &&
                                          prop.lockStatus !== undefined &&
                                          prop.lockStatus === "Y"
                                            ? true
                                            : false
                                        }
                                        className="basic-multi-select"
                                        options={
                                          selectValues.stateOptionsLinear
                                        }
                                        id="stateDropdown"
                                        isMulti={false}
                                        onChange={(selectValue, event) =>
                                          setFieldValue(field.name, selectValue)
                                        }
                                        value={field.value}
                                        placeholder="State"
                                        isSearchable={
                                          document.documentElement
                                            .clientHeight >
                                          document.documentElement.clientWidth
                                            ? false
                                            : true
                                        }
                                      />
                                      {/* {(selectData&&selectData.selectOne&&!selectData.selectOne.value)?<div className="invalid-feedback" style={{display:'block'}}>Please select atleast one option</div>:null} */}

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
                                  name="provState"
                                  className="invalid-feedback"
                                />
                              </div>

                              {/* Till Here */}

                              <div className="col-xs-6 col-md-4">
                                <Field name="provZipCode">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <input
                                        maxLength="5"
                                        type="text"
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                            ? "is-valid"
                                            : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
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
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-headingFour"
                        >
                          <button
                            className="accordion-button accordionButtonStyle disableElements"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseFour"
                            aria-expanded="false"
                            aria-controls="panelsStayOpen-collapseFour"
                          >
                            Select a Product(s) & State(s)
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseFour"
                          className="accordion-collapse collapse show disableElements"
                          aria-labelledby="panelsStayOpen-headingFour"
                        >
                          <div className="accordion-body">
                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <label htmlFor="medicaidSwitch">Medicare</label>
                                <br />
                                <Switch
                                  id="medicareSwitch"
                                  name="medicare"
                                  onChange={(isChecked) => {
                                    values.medicare = isChecked;
                                    setApiTestState({
                                      ...apiTestState,
                                      medicare: isChecked,
                                    });
                                  }}
                                  //checked={apiTestState.medicare}
                                  checked={
                                    apiTestState.medicare !== undefined
                                      ? apiTestState.medicare
                                      : true
                                  }
                                  uncheckedIcon={false}
                                  checkedIcon={false}
                                  offColor="#FFCCCB"
                                  onColor="#90EE90"
                                  disabled={true}
                                />
                              </div>

                              <div className="col-xs-6 col-md-4">
                                <div className="">
                                  <label htmlFor="state">State</label>
                                  <Select
                                    classNames={{
                                      control: (state) =>
                                        `select-control-selector-1 ${
                                          selectData &&
                                          selectData.selectTwo &&
                                          !selectData.selectTwo.value
                                            ? "is-invalid"
                                            : ""
                                        }`,
                                    }}
                                    id="stateDropdown"
                                    placeholder="State"
                                    isDisabled={
                                      tabRef.current === "DashboardView" &&
                                      prop.lockStatus !== undefined &&
                                      prop.lockStatus === "Y"
                                        ? true
                                        : false
                                    }
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        height: "58px",
                                        fontWeight: "lighter",
                                        overflowY: "scroll",
                                      }),
                                      menuList: (provided) => ({
                                        ...provided,
                                        maxHeight: 200,
                                      }),
                                    }}
                                    isClearable
                                    className="basic-multi-select"
                                    isMulti={true}
                                    onChange={(value) => {
                                      setSelectData({
                                        ...selectData,
                                        selectTwo: { value: value },
                                      });
                                    }}
                                    value={
                                      !!selectData &&
                                      !!selectData.selectTwo &&
                                      !!selectData.selectTwo.value
                                        ? selectData.selectTwo.value
                                        : apiTestState.prodStatesDefault
                                    }
                                    onFocus={() => {}}
                                    onBlur={(event) => {
                                      if (
                                        selectData &&
                                        (!selectData.selectTwo ||
                                          (selectData.selectTwo &&
                                            !selectData.selectTwo.value))
                                      ) {
                                        setSelectData({
                                          ...selectData,
                                          selectTwo: { value: "" },
                                        });
                                      }
                                      // event.preventDefault()
                                    }}
                                    options={selectValues.stateOptionsLinear}
                                    //options={(!!selectValues.stateArray && selectValues.stateArray.length>0)?selectValues.stateArray:[{label:"option", value:"option"}]}

                                    // styles={{...customStyles}}

                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                  {selectData &&
                                  selectData.selectTwo &&
                                  !selectData.selectTwo.value ? (
                                    <div
                                      className="invalid-feedback"
                                      style={{ display: "block" }}
                                    >
                                      Please select atleast one option
                                    </div>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-headingFive"
                      >
                        <button
                          className="accordion-button accordionButtonStyle disableElements"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseFive"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseFive"
                        >
                          Type
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseFive"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-headingFive"
                      >
                        <div className="accordion-body">
                          <div className="row my-2">
                            <div className="col-xs-6 col-md-12">
                              <TypeTable
                                typeTableRowsData={typeTableRowsData}
                                addTableRows={addTableRows}
                                editTableRows={editTableRows}
                                deleteTableRows={deleteTableRows}
                                handleGridSelectChange={handleGridSelectChange}
                                gridFieldTempState={gridFieldTempState}
                                handleGridFieldChange={handleGridFieldChange}
                                gridRowsFinalSubmit={gridRowsFinalSubmit}
                                lockStatus={"V"}
                              ></TypeTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-headingSix"
                      >
                        <button
                          className="accordion-button accordionButtonStyle disableElements"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseSix"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseSix"
                        >
                          Payment Information
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseSix"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-headingSix"
                      >
                        <div className="accordion-body">
                          <div className="row my-2">
                            <div className="col-xs-6 col-md-12">
                              <PaymentTable
                                paymentTableRowsData={paymentTableRowsData}
                                addTableRows={addTableRows}
                                deleteTableRows={deleteTableRows}
                                handleGridSelectChange={handleGridSelectChange}
                                gridFieldTempState={gridFieldTempState}
                                editTableRows={editTableRows}
                                handleGridFieldChange={handleGridFieldChange}
                                gridRowsFinalSubmit={gridRowsFinalSubmit}
                                lockStatus={"V"}
                              ></PaymentTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-Address"
                      >
                        <button
                          className="accordion-button accordionButtonStyle disableElements"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseAddress"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          Address Information
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseAddress"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-Address"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-xs-6 col-md-12">
                              <LocationTable
                                locationTableRowsData={locationTableRowsData}
                                addTableRows={addTableRows}
                                editTableRows={editTableRows}
                                deleteTableRows={deleteTableRows}
                                handleGridSelectChange={handleGridSelectChange}
                                gridFieldTempState={gridFieldTempState}
                                handleGridFieldChange={handleGridFieldChange}
                                gridRowsFinalSubmit={gridRowsFinalSubmit}
                                lockStatus={"V"}
                                selectJson={selectValues}
                                modifyValidatedAddressRow={
                                  modifyValidatedAddressRow
                                }
                                calledFormName={ContractingPop.validate}
                                fetchAutoPopulate={fetchAutoPopulate}
                              ></LocationTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Added Newly */}
                    {tabRef.current === "HomeView" && (
                      <DocumentSection
                        fileDataRef={documentSectionDataRef.current}
                        displayName={ContractingPop.displayName}
                        flowId={contractingConfigData["FlowId"]}
                      />
                    )}
                    {/* Till Here */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: 30,
                        marginBottom: 20,
                      }}
                    >
                      {/* <button type="submit" id='mainFormSubmit' style={{'display':'none'}} className="providerPageButton button" onClick={event => {handleSubmit()}}>{isSubmitting?"Saving":"Save"}</button> */}
                      <button
                        type="submit"
                        id="mainFormSubmit"
                        style={{ display: "none" }}
                        className="providerPageButton button"
                        onClick={(event) => {
                          handleSubmit(event);
                        }}
                      >
                        {isSubmitting ? "Saving" : "Save"}
                      </button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        </div>
      </>
    );
  };

  const callProcRef = useRef(null);
  const callFormSubmit = (evnt) => {
    if (evnt.target.name == "saveSubmit") {
      callProcRef.current = "callProc";
    }

    if (evnt.target.name == "saveExit") {
      callProcRef.current = "notCallProc";
    }
    document.getElementById("mainFormSubmit").click();
  };
  return (
    loadForm && (
      <>
        <div
          className="ProvAnciFac backgroundColor"
          style={{ minHeight: "100vh" }}
        >
          <div className="container">
            <div className="row mb-2">
              <div className="col-xs-6" style={{ textAlign: "center" }}>
                <br />
                <button
                  type="button"
                  className="providerPageButton button"
                  onClick={(event) => prop.navigateHome()}
                  style={{ float: "left" }}
                >
                  Go To Home
                </button>
                {formName && formName.current ? (
                  <label id="tileFormLabel" className="HeadingStyle">
                    {formName.current}
                  </label>
                ) : null}
              </div>
            </div>
          </div>
          <br />
          <div
            className="container"
            style={{
              overflow: "auto",
              height: "auto",
              minHeight: "100%",
              paddingBottom: 60,
            }}
          >
            <div className="row">{populateFormBasisOnType()}</div>
          </div>

          <FooterComponent />
        </div>
      </>
    )
  );
}
