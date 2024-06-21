import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  getMasterStateSymbol,
  getMasterSpeciality,
  getMasterContractType,
  signIn,
} from "../../../actions";
import "react-datepicker/dist/react-datepicker.css";
import "./Forms.css";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
// import axios from 'axios';
import { useAxios } from "../../../api/axios.hook";
import { baseURL } from "../../../api/baseURL";
import Select, { components } from "react-select";
import Switch from "react-switch";
import TypeTable from "../../SelfServiceTiles/TileFormsTables/TypeTable";
import PaymentTable from "../../SelfServiceTiles/TileFormsTables/PaymentTable";
import LocationTable from "../../SelfServiceTiles/TileFormsTables/LocationTable";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import useValidateForm from "../../CustomHooks/useValidateForm";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision.js";
import { useDispatch, useSelector } from "react-redux";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import customAxios from "../../../api/axios";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CompensationTab from "./CompensationTab";
import ReferenceTab from "../../../WorkItemDashboard/ReferenceTab";
import FooterComponent from "../../FooterComponent";
import DocumentSection from "../../SelfServiceTiles/DocumentSection";

export default function ProvAnciFac() {
  const mastersSelector = useSelector((masters) => masters);
  console.log("Masters Selector: ", mastersSelector);
  const authData = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const [buttonDisableFlag, setButtonDisableFlag] = useState(false);
  const { customAxios } = useAxios();
  const dispatch = useDispatch();
  const [loadForm, setLoadForm] = useState(false);

  const [formikInitializeState, setFormikInitializeState] = useState(false);
  const caseData = useSelector((store) => store.dashboardNavigationState);

  const validationSchema = Yup.object().shape({
    mgrEmail: Yup.string()
      .email("Please enter valid Email Id")
      .required("Please enter Email Id")
      .max(50, "Email Id max length exceeded"),
    mgrPhone: Yup.string()
      .required("Please enter Phone Number")
      .max(14, "Phone Number max length exceeded")
      .matches(/^[0-9\ \(\-\)]+$/, "Only numbers are accepted"),
    // .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,'Only numbers are accepted'),
    // .matches(/^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,"Please enter valid phone number"),
    provZipCode: Yup.string()
      // .typeError('Amount must be a number')
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
      //         .required('Please enter Fax Number')
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
      //.required("Please enter Credentialing Email Id")
      .max(50, "Credentialing Email Id max length exceeded"),
    credPhone: Yup.string()
      //.required("Please enter Credentialing Phone#")
      .max(14, "Credentialing Phone# max length exceeded")
      .matches(/^[0-9\ \(\-\)]+$/, "Only numbers are accepted"),
    // .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,'Only numbers are accepted'),
    credFax: Yup.string()
      //.required('Please enter Credentialing Fax#')
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
    getDatePartOnly,
    acceptNumbersOnly
  } = useGetDBTables();
  const [selectData, setSelectData] = useState({});
  const { printConsole, checkDecision, handlePhoneNumber, CompareJSON } =
    useUpdateDecision();

  const linearFieldsRef = useRef({});
  // const { validate, errors, handleSubmit } = useValidateForm();
  const {
    submitCase,
    updateLockStatus,
    validatePotentialDup,
    validatePotentialDupDec,
    updateDecision,
  } = useUpdateDecision(); //Changed by Nidhi
  ProvAnciFac.validate = "shouldValidate";

  const formName = useRef(null);

  //Newly Added by Nidhi Gupta on 08/04/2023
  let documentSectionDataRef = useRef([]);
  let contractingConfigData = JSON.parse(
    process.env.REACT_APP_CONTRACTING_DETAILS
  );
  const { fileUpDownAxios } = useAxios();
  //Till Here

  let prop = useLocation();
  const navigate = useNavigate();

  const navigateContractingHome = async () => {
    try {
      setButtonDisableFlag(false);
      if (prop.state.caseNumber !== undefined) {
        const promise = new Promise((resolve, reject) => {
          resolve(updateLockStatus("N", prop.state.caseNumber, 0, ""));
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

      if (prop.state.caseNumber === undefined) {
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
    //contractNo 		:'',
    //medicareNo 	:'',
    //capitationAmount:'',
    //awpFee 		:'',
    //medicalHomeFee :'',
    //careMgmtFee 	:'',
    //qualityBonus 	:'',
    //qualityFee 	:'',
    //contract 		:'',
    //capitationType :'',
    //capitationTerm :'',

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
    console.log("Hello convertToDateObj JSON: ", jsonObj);
    return jsonObj;
  };

  const handleFormikBlur=(event,setFieldValue,fieldName)=>{
    let value = event.target.value || "";
    printConsole("Inside organization Name onChange: ", value);
    setFieldValue(fieldName, value);
  }

  const handleMedicalGrpNoShow = (evt) => {
    console.log("handleMedicalGrpNoShow evt: ", evt);

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

    //console.log('Inside handleMedicalGrpNoShow riskStateValue: ',riskStateValue);
    //console.log('Inside handleMedicalGrpNoShow riskValue: ',riskValue);
    //console.log('Inside handleMedicalGrpNoShow taxValue: ',taxValue);
    groupRiskIdValue = riskStateValue + riskValue + taxValue;
    //console.log('Inside handleMedicalGrpNoShow groupRiskIdValue: ',groupRiskIdValue);

    setApiTestStateComp({
      ...apiTestStateComp,
      groupRiskId: groupRiskIdValue,
    });
  };

  const handleNetworkIdShow = (evt) => {
    console.log("handleNetworkIdShow evt: ", evt);

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

    //console.log('Inside handleNetworkIdShow networkStateValue: ',networkStateValue);
    //console.log('Inside handleNetworkIdShow planValue: ',planValue);
    networkIdValue = planValue + networkStateValue;
    //console.log('Inside handleNetworkIdShow groupRiskIdValue: ',networkIdValue);

    setApiTestStateComp({
      ...apiTestStateComp,
      networkId: networkIdValue,
    });
  };

  const handlePcpIdShow = (evt) => {
    console.log("handlePcpIdShow evt: ", evt);

    let pcpIdValue = apiTestStateComp.pcpId;
    let medicalLicenseValue = "";
    let constant = "GK";

    medicalLicenseValue =
      apiTestStateComp.medicalLicense !== undefined &&
      apiTestStateComp.medicalLicense !== ""
        ? apiTestStateComp.medicalLicense
        : "";
    pcpIdValue = constant + medicalLicenseValue;
    //console.log('Inside handlePcpIdShow pcpIdValue: ',pcpIdValue);

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

  let contractOptions = [];
  const [typeTableRowsData, setTypeTableRowsData] = useState([]);
  const [paymentTableRowsData, setPaymentTableRowsData] = useState([]);
  const [locationTableRowsData, setLocationTableRowsData] = useState([]);

  const [apiCallOnce, setApiCallOnce] = useState(false);
  const tabRef = useRef("HomeView");

  // const onErr=(response, typeOfRequest="")=>{
  //     //console.log(response, typeOfRequest);
  //     if(typeOfRequest="masterStateSymbol"){
  //         //do something on failed request
  //     }
  // }

  // const onSuccess=(response, typeOfRequest="")=>{
  //     //console.log(response, typeOfRequest);
  //     //if(typeOfRequest="masterStateSymbol"){
  //         let apiArray = [];
  //         let selectJson = {};
  //         if (response.status === 200) {
  //             //apiTestState.stateArray = [];
  //             //response.data.map(element => apiArray.push(element));
  //             //selectJson.stateArray = apiArray;
  //             selectJson.stateArray = response.data.map(ele => { return {label: ele, value: ele}})
  //             //setSelectValues({...selectValues,stateArray:apiArray});
  //         }
  //         setSelectValues(selectJson);
  //     //}
  // }
  //Added by Nidhi on 04/06/2023

  const fetchAutoPopulate = useRef(false);

  const navigateHome = async () => {
    if (prop.state !== null) {
      //const userId = ((mastersSelector.hasOwnProperty('auth')?(mastersSelector.auth.hasOwnProperty('userId')?mastersSelector.auth.userId:0):0));
      const promise = new Promise((resolve, reject) => {
        resolve(updateLockStatus("N", prop.state.caseNumber, 0, ""));
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

    if (prop.state === null) {
      navigate("/Home", { replace: true });
    }
  };
  //till here

  const handleTabSelect = (key) => {
    try {
      // Perform actions when the tab is selected
      console.log("Tab selected with key:", key);
      if (key == "Compensation" && !apiCallOnce) {
        setApiCallOnce(true);
        let getApiJson = {};
        getApiJson["tableNames"] = getTableDetails()[
          "compensationLinear"
        ].concat(getTableDetails()["compGridTables"]);
        getApiJson["whereClause"] = { caseNumber: prop.state.caseNumber };

        customAxios
          .post("/generic/get", getApiJson, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log("Generic get api response compensation Nidhi01: ", res);
            const apiStat = res.data.Status;
            if (apiStat === -1) {
              alert("Error in fetching data");
            }
            if (apiStat === 0) {
              const respKeys = Object.keys(res.data["data"]);
              const respData = res.data["data"];
              respKeys.forEach((k) => {
                console.log("Response key Nidhi: ", k);
                if (k === "compLinearTable") {
                  let apiResponse = {};
                  if (respData[k][0] !== undefined) {
                    apiResponse = respData[k][0];
                    console.log(
                      "Hello apiResponse compensation Nidhi: ",
                      apiResponse
                    );
                    if (apiResponse.hasOwnProperty("conEffectiveDate")) {
                      if (typeof apiResponse.conEffectiveDate === "string") {
                        const cfd = new Date(getDatePartOnly(apiResponse.conEffectiveDate));
                        apiResponse.conEffectiveDate = cfd;
                      }
                    }
                    if (apiResponse.hasOwnProperty("mocAttestationDate")) {
                      if (typeof apiResponse.mocAttestationDate === "string") {
                        const mad = new Date(getDatePartOnly(apiResponse.mocAttestationDate));
                        apiResponse.mocAttestationDate = mad;
                      }
                    }
                    if (apiResponse.hasOwnProperty("mocRenewalAttDate")) {
                      if (typeof apiResponse.mocRenewalAttDate === "string") {
                        const rad = new Date(getDatePartOnly(apiResponse.mocRenewalAttDate));
                        apiResponse.mocRenewalAttDate = rad;
                      }
                    }

                    apiResponse.contractTypeComp = {
                      label: apiResponse.contractTypeComp,
                      value: apiResponse.contractTypeComp,
                    };
                    apiResponse.networkState = {
                      label: apiResponse.networkState,
                      value: apiResponse.networkState,
                    };
                    //apiResponse.contract = {'label':apiResponse.contract,'value':apiResponse.contract};
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
                    //apiResponse.capitationType = {'label':apiResponse.capitationType,'value':apiResponse.capitationType};
                    //apiResponse.capitationTerm = {'label':apiResponse.capitationTerm,'value':apiResponse.capitationTerm};
                    //apiResponse.sequesApplies = {'label':apiResponse.sequesApplies,'value':apiResponse.sequesApplies};

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
                    //apiResponse.criticalAccess = {'label':apiResponse.criticalAccess,'value':apiResponse.criticalAccess};
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
                    console.log(
                      "locationTableRowsData apiResponse: ",
                      apiResponse
                    );
                    apiResponse = convertToDateObj(apiResponse);
                    setApiTestStateComp(apiResponse);

                    //setFormikInitializeState(true);
                  }
                }

                if (k === "firlGrid") {
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const newJson = convertToDateObj(js);
                    console.log("Compensation Tab firlGrid newJson: ", newJson);
                    apiResponseArray.push(newJson);
                  });
                  setFirlTableRowsData(apiResponseArray);
                }

                if (k === "compensationGrid") {
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const apiResponse = js;
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
                    console.log(
                      "Compensation Tab compensationGrid newJson: ",
                      apiResponse
                    );
                  });
                  setCompensationTableRowsData(apiResponseArray);
                }

                // if(k === 'compensationGrid'){
                //     let apiResponseArray = [];
                //     respData[k].forEach((js) => {
                //         const newJson = convertToDateObj(js);
                //         console.log("Compensation Tab compensationGrid newJson: ", newJson);
                //         apiResponseArray.push(newJson);
                //     });
                //     setCompensationTableRowsData(apiResponseArray);
                // }
              });
            }
          })
          .catch((err) => {
            console.log("Network Tab catch: ", err);
          });

        console.log("getApiJson compensation: ", getApiJson);
      }
    } catch (error) {
      console.error("Network Tab handleTabSelect catch: ", error);
    }
  };

  useEffect(() => {
    /*TO DO: Need to uncomment this*/
    // if(!authData.isSignedIn){
    //     navigate('/', { replace: true });
    // }

    //console.log("Inside useeffect()");
    if (prop.state.caseNumber !== undefined) {
      //console.log("Prop: ", prop);
      // console.log("prop.state: ",prop.state);
      //console.log("prop.state.caseNumber: ", prop.state.caseNumber);

      //prop.state.formNames= "Provider";
      //console.log("formName.current= ",formName.current);
      //console.log("Here= ",prop.state.formNames);
      ProvAnciFac.displayName = prop.state.formNames;
      tabRef.current = "DashboardView";
      //console.log("tabRef.current= ",tabRef.current);
    }

    if (prop.state.caseNumber === undefined) {
      //console.log("Prop: ", prop);
      // console.log(prop.state.caseNumber);
      // console.log("formName.current= ", formName.current)
      // console.log("Here= ", prop.state.formNames.trim());

      if (prop.state.formNames.includes("Provider")) {
        ProvAnciFac.displayName = "Provider Contracting";
      }
      if (prop.state.formNames.includes("FacAncHealthSystem")) {
        ProvAnciFac.displayName =
          "Facility/Ancillary/Health Systems Contracting";
      }
      tabRef.current = "HomeView";

      setLoadForm(true);
      // setFormikInitializeState(false);
    }
    //console.log(ProvAnciFac.displayName)
    formName.current = ProvAnciFac.displayName;

    //Added by Nidhi on 4/12/2023
    let selectJson = {};
    const transType = String(formName.current);
    //console.log("transType:", transType);
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

    //till here

    // if(mastersSelector.hasOwnProperty('masterStateSymbol')){
    //     const stateArray = ((mastersSelector['masterStateSymbol'].length===0) ? [] : (mastersSelector['masterStateSymbol'][0].data.map(ele => { return {label: ele, value: ele}})));
    //     setSelectValues({stateArray})}

    // axios.all(getEndpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
    //     if (res[0].status === 200) {
    //         //apiTestState.stateArray = [];
    //         res[0].data.map(element => apiArray.push(element));
    //         selectJson.stateArray = apiArray;
    //         //setSelectValues({...selectValues,stateArray:apiArray});
    //     }
    //     setSelectValues(selectJson);

    // })
    //     .catch((err) => {
    //         console.log(err.message);
    //         //alert("Error in getting data");
    //     });
    //console.log("Call")

    //dispatch(getMasterStateSymbol(token, false, onErr, onSuccess));
    //dispatch(getMasterContractType(token, false, onErr, onSuccess));
    //dispatch(getMasterContractType(token, false, ()=>{}, ()=>{}))

    //dispatch(getMasterSpeciality(token, false, ()=>{}, ()=>{}));

    if (prop.state.caseNumber !== undefined) {
      let gridApiArray = [];

      let getApiJson = {};
      getApiJson["tableNames"] = getTableDetails()["provAnciFac"];
      getApiJson["whereClause"] = { caseNumber: prop.state.caseNumber };
      customAxios
        .post("/generic/get", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status == 0) {
            const apiResponse = res.data.data.contProvFaciAnci[0];

            printConsole("get Data response------> ", apiResponse);
            //console.log("ApiTestState: ", apiResponse);
            //Nidhi 04-24-2023
            prop.state.contractType = apiResponse.contractType;
            prop.state.legalEntityName = apiResponse.entityName;
            console.log(
              "prop.state.legalEntityName 454: ",
              prop.state.legalEntityName
            );

            //till here
            //    if(apiResponse.provState !== undefined && apiResponse.provState !== ""){
            //     apiResponse.stateDefault = apiResponse.provState.split(",").map(ele => {return {label: ele, value: ele}});
            //     }

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
            linearFieldsRef.current = { linearFields: apiResponse };
            setApiTestState(apiResponse);
            //setFormikInitializeState(true);
            setLoadForm(true);
            console.log(
              "------" + JSON.stringify(res.data.data.contTypeGrid[0])
            );
            gridApiArray = [];
            res.data.data.contTypeGrid.map((apiKey) => {
              gridApiArray.push(getGridData(apiKey));
            });
            setTypeTableRowsData(...typeTableRowsData, gridApiArray);
            gridApiArray = [];
            res.data.data.contPaymentGrid.map((apiKey) => {
              gridApiArray.push(getGridData(apiKey));
            });
            setPaymentTableRowsData(...paymentTableRowsData, gridApiArray);
            gridApiArray = [];

            if (res.data.data.contLocationGrid !== undefined) {
              console.log(
                "apiJson Location get:",
                res.data.data.contLocationGrid
              );
            }

            res.data.data.contLocationGrid.map((apiKey) => {
              gridApiArray.push(getGridData(apiKey));
            });
            setLocationTableRowsData(...locationTableRowsData, gridApiArray);

            // if(res.data.data.contLocationGrid!==undefined){
            // console.log("apiJson Location get:",res.data.data.contLocationGrid.length);
            // }

            if (prop.state.stageName == "Network") {
              console.log(
                "prop.state.legalEntityName 487: ",
                prop.state.legalEntityName
              );
              let resJson = {};
              customAxios
                .get(
                  `/fetchPotentialDuplicate?legalEntityName=${prop.state.legalEntityName}&strRouteTo=${prop.state.stageName}&caseNumber=${prop.state.caseNumber}&transactionType=${ProvAnciFac.displayName}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                  resJson = { ...res };
                  console.log("resJson: ", resJson);
                  if (res.status === 200) {
                    console.log("FindDuplicateProc executed successully");
                    let getApiJson = {};
                    console.log(
                      "prop.state.caseNumber 501: ",
                      prop.state.caseNumber
                    );
                    getApiJson["tableNames"] =
                      getTableDetails()["contPotentialDuplicate"];
                    getApiJson["whereClause"] = {
                      caseNumber: prop.state.caseNumber,
                      StageName: "<>~Exit&&Discard",
                    };

                    customAxios
                      .post("/generic/get", getApiJson, {
                        headers: { Authorization: `Bearer ${token}` },
                      })
                      .then((res) => {
                        console.log(
                          "Generic get api response compensation Nidhi: ",
                          res
                        );
                        const apiStat = res.data.Status;
                        if (apiStat === -1) {
                          alert("Error in fetching data");
                        }
                        if (apiStat === 0) {
                          const respData = [...res.data.data.potentialDup];
                          console.log("respData: ", respData);
                          let newArr = [];
                          respData.forEach((js) => {
                            const newJson = convertToDateObj(js);
                            newJson.action = {
                              label: newJson.action,
                              value: newJson.action,
                            };
                            newArr.push(newJson);
                            console.log("Potential Duplicate Json: ", newJson);
                          });
                          console.log("Potential Duplicate Array: ", newArr);
                          setPotentialDupData(newArr);
                        }
                      })
                      .catch((err) => {
                        console.log(err.message);
                      });
                  }
                });
            }

            console.log("potentialDupData 533: ", potentialDupData);
          }
        })
        .catch((err) => {
          console.log(err);
        });

      // axios.all(getCaseNumberEndpoints.map((endpoint) => axios.get(endpoint,{headers:{'Authorization':`Bearer ${token}`}}))).then((res) => {
      //     if (res[0].status === 200) {
      //         // const apiResponse = res[0].data;
      //         // //console.log(typeof apiResponse.dateOfBirth);
      //         // // if(typeof apiResponse.dateOfBirth === 'string'){
      //         // //     const dob = new Date(apiResponse.dateOfBirth);
      //         // //     apiResponse.dateOfBirth = dob;
      //         // // }

      //         // //console.log("ApiTestState: ", apiResponse);
      //         // apiResponse.stateDefault = apiResponse.provState.split(",").map(ele => {return {label: ele, value: ele}});
      //         // apiResponse.prodStatesDefault = apiResponse.prodStates.split(",").map(ele => {return {label: ele, value: ele}});

      //         // setApiTestState(apiResponse);
      //         // setLoadForm(true);
      //     }
      //     if (res[1].status === 200) {
      //         //apiArray = [...res[1].data];
      //         // console.log("License api 00000: ", res[1].data);
      //         // res[1].data.map((apiKey) => {
      //         //     gridApiArray.push(getGridData(apiKey));
      //         // })
      //         // setTypeTableRowsData(...typeTableRowsData, gridApiArray);
      //     }
      //     gridApiArray = [];
      //     if (res[2].status === 200) {
      //         //apiArray = [...res[2].data];
      //         // res[2].data.map((apiKey) => {
      //         //     gridApiArray.push(getGridData(apiKey));
      //         // })
      //         // setPaymentTableRowsData(...paymentTableRowsData, gridApiArray);
      //     }
      // })
      //     .catch((err) => {
      //         //console.log(err.message);
      //     });

      // console.log("Api Array: ", gridApiArray);
      // console.log("TypeTable Values: ", typeTableRowsData);
      // console.log("PaymentTable Values: ", paymentTableRowsData);
    }
    //console.log("Inside useEffect, just before compensation get");

    return () => {
      //console.log("UNMOUNT")
    };
  }, []);

  // useEffect(()=>{
  //     //console.log(formName);
  //     setSelectValues({});
  // },[formName]);

  const handleApiTestChange = (evt) => {
    const value = evt.target.value;
    // validate(evt);
    // console.log("Erros: ", errors);
    setApiTestState({
      ...apiTestState,
      [evt.target.name]: evt.target.value,
    });
  };
  const gridDataRef = useRef({});

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

    console.log(
      "Inside gridRowsFinalSubmit gridFieldTempState Value ====  ",
      gridFieldTempState
    );
    console.log(
      "Inside gridRowsFinalSubmit gridFieldTempState keys ====  ",
      Object.keys(gridFieldTempState).length
    );

    let clonedJson = { ...gridFieldTempState };
    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "LocationTable") {
        let indexJson = locationTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );

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

          console.log(
            "Inside gridRowsFinalSubmit clonedJson after value: ",
            clonedJson
          );
          locationTableRowsData[index] = clonedJson;
          setLocationTableRowsData(locationTableRowsData);
        }
      }
      if (triggeredFormName === "TypeTable") {
        let indexJson = typeTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
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
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
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
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
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
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          compensationTableRowsData[index] = clonedJson;
          setCompensationTableRowsData(compensationTableRowsData);
        }
      }
      setGridFieldTempState({});
    }

    //Handling for data update/Delete/Insert inside grids.
    if (tabRef.current === "DashboardView") {
      //let gridRow = getGridDataArray(triggeredFormName);
      //console.log('gridRowsFinalSubmit gridRow: ',gridRow);
      let oprtn;
      let gridRowJson = {};
      //alert('Operation type: ',operationType);
      console.log("Operation type: ", operationType);
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
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.locationTable = getGridDataValues(gridRowArray);
        }
        console.log("gridDataRef.current: ", gridDataRef.current);
      }
      if (triggeredFormName === "TypeTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("typeTable")
          ? [...gridDataRef.current.typeTable]
          : [];
        gridRowJson = { ...typeTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          gridRowArray.push(gridRowJson);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.typeTable = getGridDataValues(gridRowArray);
        }

        console.log("gridDataRef.current: ", gridDataRef.current);
      }

      if (triggeredFormName === "PaymentTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("paymentTable")
          ? [...gridDataRef.current.paymentTable]
          : [];
        gridRowJson = { ...paymentTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          gridRowArray.push(gridRowJson);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.paymentTable = getGridDataValues(gridRowArray);
        }
        console.log("gridDataRef.current: ", gridDataRef.current);
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
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //firlTableRowsData[index].operation = oprtn;
          gridDataRef.current.firlTable = getGridDataValues(gridRowArray);
        }

        console.log("gridDataRef.current: ", gridDataRef.current);
      }
      if (triggeredFormName === "CompensationTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("compensationTable")
          ? [...gridDataRef.current.compensationTable]
          : [];
        gridRowJson = { ...compensationTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          gridRowArray.push(gridRowJson);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //compensationTableRowsData[index].operation = oprtn;
          gridDataRef.current.compensationTable =
            getGridDataValues(gridRowArray);
        }

        console.log("gridDataRef.current: ", gridDataRef.current);
      }
    }
    //Handling For Portal and DashboardHomeView Side grids Save&Close
    /*if (triggeredFormName === "CredentialTable") {
            finalGridSaveDataRef.current[triggeredFormName] = [...credentialTableRowsData];
          }*/
  };

  /* const gridRowsFinalSubmit = (triggeredFormName,index,operationType) => {
        //console.log('Inside gridRowsFinalSubmit with view: ',tabRef);
        if(tabRef.current === 'DashboardView'){
            //let gridRow = getGridDataArray(triggeredFormName);
            //console.log('gridRowsFinalSubmit gridRow: ',gridRow);
            let oprtn;
            let gridRowJson = {};
            //alert('Operation type: ',operationType);
            console.log('Operation type: ',operationType);
            if(operationType === 'Add'){
                oprtn =  'I';
        }

            if(operationType === 'Edit'){
                oprtn =  'U';
            }

            if(operationType === 'Delete'){
                oprtn =  'D';
            }
            let gridRowArray = [];
            if(triggeredFormName === 'TypeTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('typeTable'))?[...gridDataRef.current.typeTable]:[];
                gridRowJson = {...typeTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                gridRowArray.push(gridRowJson);
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //licenseTableRowsData[index].operation = oprtn;
                gridDataRef.current.typeTable = getGridDataValues(gridRowArray);

                console.log("gridDataRef.current: ",gridDataRef.current);
            }

            if(triggeredFormName === 'PaymentTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('paymentTable'))?[...gridDataRef.current.paymentTable]:[];
                gridRowJson = {...paymentTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                gridRowArray.push(gridRowJson);
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //licenseTableRowsData[index].operation = oprtn;
                gridDataRef.current.paymentTable = getGridDataValues(gridRowArray);
                console.log("gridDataRef.current: ",gridDataRef.current);
            }
            if(triggeredFormName === 'LocationTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('locationTable'))?[...gridDataRef.current.locationTable]:[];
                gridRowJson = {...locationTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                gridRowArray.push(gridRowJson);
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //licenseTableRowsData[index].operation = oprtn;
                gridDataRef.current.locationTable = getGridDataValues(gridRowArray);
                console.log("gridDataRef.current: ",gridDataRef.current);
            }
            //Newly Added by Nidhi on 5/4/23
            if(triggeredFormName === 'FIRLTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('firlTable'))?[...gridDataRef.current.firlTable]:[];
                gridRowJson = {...firlTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                gridRowArray.push(gridRowJson);
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //firlTableRowsData[index].operation = oprtn;
                gridDataRef.current.firlTable = getGridDataValues(gridRowArray);

                console.log("gridDataRef.current: ",gridDataRef.current);
            }
            if(triggeredFormName === 'CompensationTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('compensationTable'))?[...gridDataRef.current.compensationTable]:[];
                gridRowJson = {...compensationTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                gridRowArray.push(gridRowJson);
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //compensationTableRowsData[index].operation = oprtn;
                gridDataRef.current.compensationTable = getGridDataValues(gridRowArray);

                console.log("gridDataRef.current: ",gridDataRef.current);
            }
            //till here

        }
    }*/

  const addTableRows = (triggeredFormName, index) => {
    console.log("rowData: ", triggeredFormName);
    let rowsInput = {};
    if (triggeredFormName === "TypeTable" && typeTableRowsData !== undefined) {
      console.log("insideaddtablerows");
      rowsInput.rowNumber = typeTableRowsData.length + 1;
      //setTypeTableRowsData([...typeTableRowsData, rowsInput]);
    }

    // if(triggeredFormName === 'TypeTable' && typeTableRowsData!==undefined && typeTableRowsData.length>0){
    //     rowsInput.rowNumber = typeTableRowsData.length+1;
    //     setTypeTableRowsData([...typeTableRowsData, rowsInput]);
    // }

    if (
      triggeredFormName === "PaymentTable" &&
      paymentTableRowsData !== undefined
    ) {
      rowsInput.rowNumber = paymentTableRowsData.length + 1;
      //setPaymentTableRowsData([...paymentTableRowsData, rowsInput]);
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
    console.log("Inside handleGridFieldChange: ", triggeredFormName);
    //let rowsInput = "";
    let tempInput = { ...gridFieldTempState };
    let { name, value } = evnt.target;
    console.log("Inside handleGridFieldChange: ", value, tempInput);
     if(triggeredFormName === 'LocationTable' || triggeredFormName === 'PaymentTable')
    {
      if(name === 'npi'|| name === 'zipCode'){
       value = acceptNumbersOnly(value);
       console.log("inside condition",value);
      }
     }
    tempInput[name] = value.toUpperCase();
    setGridFieldTempState(tempInput);
  };
  //Commented By Shivani and modified this method wrt to "save data only on grid save and close"

  /*const handleGridFieldChange = (index, evnt, triggeredFormName) => {
        //console.log('Inside handleGridFieldChange: ', triggeredFormName);
        let rowsInput = '';
        let { name, value } = evnt.target;
        if (triggeredFormName === 'TypeTable') {
            //console.log('Inside TypeTable');
            rowsInput = [...typeTableRowsData];
        }
        if (triggeredFormName === 'PaymentTable') {
            //console.log('Inside PaymentTable');
            rowsInput = [...paymentTableRowsData];
        }
        if(triggeredFormName === 'LocationTable'){
            //console.log('Inside LocationTable');
            rowsInput = [...locationTableRowsData];
        }
         //Newly Added by Nidhi on 5/4/23
         if(triggeredFormName === 'FIRLTable'){
            //console.log('Inside FIRLTable');
            rowsInput = [...firlTableRowsData];
        }
        if(triggeredFormName === 'CompensationTable'){
            //console.log('Inside FIRLTable');
            rowsInput = [...compensationTableRowsData];
        }
         //till here

        //console.log('Inside handleGridFieldChange: ',rowsInput);
        //Added by Nidhi Gupta on 10/16/2023
        //value = value.toUpperCase();
        //
        value = value.toUpperCase();
        rowsInput[index][name] = value;
        if (triggeredFormName === 'TypeTable') {
            setTypeTableRowsData(rowsInput);
        }
        if (triggeredFormName === 'PaymentTable') {
            setPaymentTableRowsData(rowsInput);
        }
        if(triggeredFormName === 'LocationTable'){
            setLocationTableRowsData(rowsInput);
        }
         //Newly Added by Nidhi on 5/4/23
         rowsInput[index][name] = value;
         if(triggeredFormName === 'FIRLTable'){
             setFirlTableRowsData(rowsInput);
         }
         if(triggeredFormName === 'CompensationTable'){
             setCompensationTableRowsData(rowsInput);
         }
         //till here

    }*/

  //Newly Added by Nidhi on 5/4/23
  const handleLinearSelectChange = (selectValue, evnt) => {
    console.log(" handleLinearSelectChange evnt.name: ", evnt.name);
    const { name } = evnt;
    // setApiTestStateComp({...apiTestStateComp,
    //     [name] : selectValue});
    console.log(" handleLinearSelectChange name: ", name);
    // console.log("handleLinearSelectChange apiTestStateComp: ",apiTestStateComp);

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

      //console.log('Inside handleMedicalGrpNoShow riskStateValue: ',riskStateValue);
      //console.log('Inside handleMedicalGrpNoShow riskValue: ',riskValue);
      //console.log('Inside handleMedicalGrpNoShow taxValue: ',taxValue);
      groupRiskIdValue = riskStateValue + riskValue + taxValue;
      //console.log('Inside handleMedicalGrpNoShow groupRiskIdValue: ',groupRiskIdValue);
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
      //console.log('Inside handleNetworkIdShow networkStateValue: ',networkStateValue);
      //console.log('Inside handleNetworkIdShow planValue: ',planValue);
      networkIdValue = planValue + networkStateValue;
      //console.log('Inside handleNetworkIdShow networkIdValue: ',networkIdValue);
    }
    let val = selectValue;
    if (selectValue && selectValue.label && selectValue.value) {
      val = {
        label: selectValue.label.toUpperCase(),
        value: selectValue.value.toUpperCase(),
      };
    }

    setApiTestStateComp({
      ...apiTestStateComp,
      groupRiskId: groupRiskIdValue,
      [name]: val,
      networkId: networkIdValue,
    });

    console.log(
      "handleLinearSelectChange apiTestStateComp: ",
      apiTestStateComp
    );
  };

  // const handleActionSelectChange = (selectedValue,evnt) => {
  //     const { name } = evnt;
  //     if(name === 'action')
  //     setPotentialDupData({...potentialDupData,[name]:selectedValue});

  // }
  const handleActionSelectChange = (propertyName, propertyValue) => {
    const updatedData = potentialDupData?.map((data) => ({
      ...data,
      [propertyName]: { label: propertyValue, value: propertyValue },
    }));

    setPotentialDupData(updatedData);
  };
  // const handleActionSelectChange = (evnt, index, data) => {
  //   data.action = { label: evnt.value, value: evnt.value };
  //   potentialDupData[index] = data;
  //   setPotentialDupData([...potentialDupData]);
  // };

  const handleLinearFieldChange = (evt) => {
    let value = evt.target.value || "";
    value = value.toUpperCase();

    setApiTestStateComp({
      ...apiTestStateComp,
      [evt.target.name]: value, //changed by Nidhi Gupta on 10/16/2023
    });
    //console.log(" handleLinearFieldChange apiTestStateComp: ",apiTestStateComp);
  };
  //till here

  const editTableRows = (index, triggeredFormName) => {
    console.log("Inside editTableRows: ", triggeredFormName);
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
    console.log("handleDateChange date: ", date);
    console.log("handleDateChange dateName: ", dateName);
    if (dateName === "conEffectiveDate") {
      setApiTestStateComp({
        ...apiTestStateComp,
        conEffectiveDate: date,
      });
      console.log("handleDateChange conEffectiveDate: ", apiTestStateComp);
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
    // console.log("Inside select change index: ", index);
    console.log("Inside select change selectedValue: ", selectedValue);
    // console.log("Inside select change evnt: ", evnt);
    // console.log("Inside select change trigeredFormName: ", triggeredFormName);
    let rowsInput = { ...gridFieldTempState };

    const { name } = evnt;
    let val = selectedValue;
    if (evnt.action === "clear") {
      //printConsole('Inside selectvalue null before delete: ',rowsInput[index]);
      //delete rowsInput[index][name];
      val = { label: "", value: "" };
      //printConsole('Inside selectvalue null after delete: ',rowsInput[index]);
    } else {
      //Changed by Nidhi Gupta on 12/02/2023 to handle undefined scenerios

      //val = {label:selectedValue.label.toUpperCase(),value:selectedValue.value.toUpperCase()}
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

    console.log("Inside handleSelectChange Val: ", val);
    rowsInput[name] = val;
    setGridFieldTempState(rowsInput);
  };

  /*const handleGridSelectChange = (index, selectedValue, evnt, triggeredFormName) => {
        //console.log("Inside select change trigeredFormName: ", triggeredFormName);
        let rowsInput = '';
        const { name } = evnt;
        if (triggeredFormName === 'TypeTable') {
            //console.log('Inside SpecialityTable');
            rowsInput = [...typeTableRowsData];
        }
        if (triggeredFormName === 'PaymentTable') {
            //console.log('Inside SpecialityTable');
            rowsInput = [...paymentTableRowsData];
        }
        if(triggeredFormName === 'LocationTable'){
            //console.log('Inside LocationTable');
            rowsInput = [...locationTableRowsData];
        }
         //Newly Added by Nidhi on 5/4/23

    if(triggeredFormName === 'FIRLTable'){
        //console.log('Inside FIRLTable');
        rowsInput = [...firlTableRowsData];
    }
    if(triggeredFormName === 'CompensationTable'){
        //console.log('Inside CompensationTable');
        rowsInput = [...compensationTableRowsData];
    }
        //till here
        //console.log("Inside select change event: ",rowsInput);

         //rowsInput[index][name] = selectedValue;
         let val = selectedValue;
    if(evnt.action==='clear'){
      //printConsole('Inside selectvalue null before delete: ',rowsInput[index]);
      //delete rowsInput[index][name];
      val = {label:'',value:''};
      //printConsole('Inside selectvalue null after delete: ',rowsInput[index]);
    }
    else{
        val = {label:selectedValue.value.toUpperCase(),value:selectedValue.value.toUpperCase()}
      }

    console.log("Inside handleSelectChange Val: ",val);

    rowsInput[index][name] = val
        //console.log("rowsInput: ",rowsInput);
        if (triggeredFormName === 'TypeTable') {
            setTypeTableRowsData(rowsInput);
        }
        if (triggeredFormName === 'PaymentTable') {
            setPaymentTableRowsData(rowsInput);
        }
        if(triggeredFormName === 'LocationTable'){
            setLocationTableRowsData(rowsInput);
        }
         //Newly Added by Nidhi on 5/4/23
         if(triggeredFormName === 'FIRLTable'){
            setFirlTableRowsData(rowsInput);
        }
        if(triggeredFormName === 'CompensationTable'){
            setCompensationTableRowsData(rowsInput);
        }
         //till here

    }*/

  const modifyValidatedAddressRow = (index, data) => {
    // setLocationTableRowsData(prev => {
    //     prev[index] = data;
    //     return prev;
    // })
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
      console.log("getNextSequence sequenceNumber", sequenceNumber);
      return sequenceNumber;
    } catch (error) {
      console.log(error);
    }
  };

  // const getGridData = (jsonObj) => {
  //     let gridObj = {};
  //     //console.log("GetGridData: ",jsonObj);
  //     Object.keys(jsonObj).map((key) => {
  //         gridObj[key] = { value: jsonObj[key], label: jsonObj[key] };
  //     });
  //     return gridObj;
  // }

  const getGridData = (jsonObj) => {
    let gridObj = {};
    console.log("GetGridData jsonObj: ", jsonObj);

    Object.keys(jsonObj).map((key) => {
      console.log("GetGridData key : ", key,jsonObj[key]);
      if (key === "languages") {
     if(jsonObj[key]  !== '')
     {
        gridObj[key] = jsonObj[key].split(",").map((ele) => {
          return { label: ele, value: ele };
        });
      }
      else{
        gridObj[key]  = [];
      }
      } else {
        gridObj[key] = { value: jsonObj[key], label: jsonObj[key] };
      }
    });
    console.log("GetGridData gridObj: ", gridObj);
    return gridObj;
  };

  //Added by NG on 12/2/2023

  // if (apiResponse.hasOwnProperty("languages")) {
  //     apiResponse.languages =  apiResponse.languages
  //     .split(",")
  //     .map((ele) => {
  //       return { label: ele, value: ele };
  //     });

  // }
  //Till here

  const saveFormData = async (values) => {
    try {
      // if(handleSubmit()){
      if (true) {
        setButtonDisableFlag(true);

        // const path = baseURL + '/master/nextSeqValue';
        // let caseNumber;
        //let awaitOut = getNextSequence(path);
        //awaitOut.then((caseId) => {
        //caseNumber = caseId;
        //console.log("CaseNumber before: ", caseNumber);
        //let requestBody = apiTestState;
        //console.log(requestBody);
        //requestBody.provState = stateRef.current.getSelectedItems().toString();
        //requestBody.prodStates = prodstatesRef.current.getSelectedItems().toString();
        //requestBody.userName = 'gaurav';
        // requestBody.caseNumber = caseNumber;

        //delete requestBody.stateDefault;
        //delete requestBody.prodStatesDefault;
        let contractingConfigData = JSON.parse(
          process.env.REACT_APP_CONTRACTING_DETAILS
        );
        const flowId = contractingConfigData["FlowId"];
        const stageId = contractingConfigData["StageId"];
        const stageName = contractingConfigData["StageName"];
        prop.state.stageName = contractingConfigData["StageName"];

        /* //Newly Added by Nidhi 0n 05/04/23
                  let requestBody = {};
                  requestBody.caseNumber = prop.state.caseNumber;
                  console.log("requestBody.caseNumber: ",requestBody.caseNumber);
                  //till here*/

        const provObject = {};
        provObject.userName = prop.state.userName;
        provObject.mgrFirstName = values.mgrFirstName;
        provObject.mgrLastName = values.mgrLastName;
        provObject.mgrEmail = values.mgrEmail;
        // provObject.mgrPhone = values.mgrPhone;
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
        //provObject.contractId = values.contractId;
        //Till here
        //Changed by Nidhi Gupta
        //provObject.provState = selectData.selectOne.value.value;
        //provObject.provState = ((selectData.selectOne!==undefined)?selectData.selectOne.value.value:'');
        provObject.provState =
          values.provState.value !== undefined ? values.provState.value : null;

        // provObject.contractType = ((selectData.selectThree!==undefined)?selectData.selectThree.value.value:'');
        provObject.contractType =
          values.contractType.value !== undefined
            ? values.contractType.value
            : null;
        //provObject.prodStates = selectData.selectTwo.value.map(el => el.value).toString();
        provObject.prodStates =
          selectData.selectTwo !== undefined
            ? selectData.selectTwo.value.map((el) => el.value).toString()
            : "";
        //provObject.medicaid = values.medicaid;
        //provObject.medicare = values.medicare;
        provObject.medicare =
          values.medicare !== undefined ? values.medicare : true;
        //provObject.bhvrHealth = values.bhvrHealth;
        //provObject.commercial = values.commercial;
        //provObject.exchange = values.exchange;
        provObject.provCount = values.provCount;

        const mainWIObject = {};
        //mainWIObject.caseID = caseNumber;
        mainWIObject.caseStatus = "Open";
        mainWIObject.createdByName = prop.state.userName;
        mainWIObject.flowId = flowId;
        mainWIObject.stageName = stageName;
        mainWIObject.stageId = stageId;
        mainWIObject.transactionType = ProvAnciFac.displayName;
        //mainWIObject.caseNumber = caseNumber;
        //mainWIObject.createdBy = "1";
        mainWIObject.firstName = values.mgrFirstName;
        mainWIObject.lastName = values.mgrLastName;
        //mainWIObject.npiId = '';
        //Added by Nidhi Gupta on 06/21/2023
        mainWIObject.legalEntityName = values.entityName;
        //mainWIObject.Field1 = values.contractId;
        mainWIObject.Field2 = provObject.prodStates;
        mainWIObject.lockStatus = "N";
        //Till Here

        //    apiJson = saveGridData(apiJson);
        let apiJson = {};
        apiJson["MainCaseTable"] = mainWIObject;
        apiJson["Cont_ProvFaciAnci_Details"] = provObject;
        //Commented by NG on 1/22/2024
        //apiJson["Cont_Compensation_Details"] = requestBody;
        //Till Here
        console.log("Case JSON Insert Nidhi: ", apiJson);
        apiJson["Cont_Type_Grid"] = getGridDataValues(typeTableRowsData);
        // apiJson['Cont_Type_Grid'] = getGridDataValues(typeTableRowsData);
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

        console.log("Hiiiiii Case JSON2: ", apiJson);
        //Till Here
        //Newly Added by Nidhi Gupta 08/04/2023
        if (apiJson["Cont_Location_Grid"] !== undefined) {
          console.log(
            "apiJson Location length: ",
            apiJson["Cont_Location_Grid"].length
          );
          console.log("apiJson Location: ", apiJson["Cont_Location_Grid"]);
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
        //console.log("Document Mandatory01 : ",documentSectionDataRef.current);
        //console.log("Document Mandatory02 : ",documentSectionDataRef.current.length);
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

          //console.log("Document Mandatory03 : ",documentSectionDataRef.current);
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

              console.log("Hiiiiii Case JSON: ", apiJson);

              customAxios
                .post(baseURL + "/generic/create", apiJson, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                  console.log("Data saved successfully: ", res);
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
                    console.log("PocData State: ", procData);
                    //console.log("Inside Add Provider File UPLOAD DATA: ",documentSectionDataRef.current);

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
                        console.log(
                          "Inside Add Provider File Upload Data: ",
                          fileUploadData
                        );
                        fileUpDownAxios
                          .post("/uploadFile", fileUploadData)
                          .then((response) => {
                            console.log(
                              "File Upload api response: ",
                              response.data
                            );
                            if (response.status===200) {
                              //alert("Case created with case number: "+res.data['CreateCase_Output']['CaseNo']+" and Contract Id: "+values.contractId);
                              //alert('Case created successfully: '+res.data['CreateCase_Output']['CaseNo']);
                              // let alertMessage = 'Case created successfully: '+res.data['CreateCase_Output']['CaseNo'];
                              // let json = {show:true,
                              //     message:alertMessage,
                              //     variant:'success'
                              // }
                              // setAlertModalShow(json);
                            }
                            if (response.status==="") {
                              // let alertMessage = 'Case created successfully: '+res.data['CreateCase_Output']['CaseNo']+' but error in uploading document';
                              // let json = {show:true,
                              //     message:alertMessage,
                              //     variant:'success'
                              // }
                              // setAlertModalShow(json);
                              //alert("Case created with case number: "+res.data['CreateCase_Output']['CaseNo']+" and Contract Id: "+values.contractId+" but error in uploading document");
                              //alert('Case created successfully: '+res.data['CreateCase_Output']['CaseNo']+' but error in uploading document');
                            }
                            // submitCase(procData,navigateContractingHome);
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
                    //alert('Case created successfully: '+res.data['CreateCase_Output']['CaseNo']);
                    submitCase(procData, navigateContractingHome);
                    // }
                    //Till Here

                    //submitCase(procData, navigateContractingHome);
                    //navigateContractingHome();
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
        console.log("createContractId sequenceNumber:", sequenceNumber);
        var zerofilled = ("000000" + sequenceNumber).slice(-6);
        console.log("createContractId zerofilled: ", zerofilled);
        let calContractId;
        //let selectedStateVal=((selectData.selectOne!==undefined)?selectData.selectOne.value.value:'**');
        let selectedStateVal =
          values.provState.value !== undefined ? values.provState.value : "**";
        calContractId = "C" + selectedStateVal + zerofilled;
        console.log("createContractId calContractId:", calContractId);
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
    console.log("values: ", values);
    console.log(typeTableRowsData);
    console.log(paymentTableRowsData);
    // if(typeTableRowsData.length<=0 && !typeTableRowsData[0]){
    //     alert("Table data required");
    //     return;
    // }
    // if(paymentTableRowsData.length<=0 && !paymentTableRowsData[0]){
    //     alert("Table data required");
    //     return;
    // }
    // e.preventDefault();
    // console.log("handleSubmit: ", handleSubmit());

    //SET values to state and then follow the same flow
    //    setApiTestState(prevState => {
    //     return {...prevState,
    //             mgrFirstName: values.mgrFirstName,
    //             mgrLastName: values.mgrLastName,
    //             mgrEmail: values.mgrEmail,
    //             mgrPhone: values.mgrPhone,
    //             mgrFax: values.mgrFax,
    //             entityName: values.entityName,
    //             provAddress: values.provAddress,
    //             provAddress2: values.provAddress2,
    //             proCity: values.proCity,
    //             provZipCode: values.provZipCode,
    //             provState: (selectData&&selectData.selectOne&&selectData.selectOne.value)?selectData.selectOne.value.value:"",
    //             prodStates: (selectData&&selectData.selectTwo&&selectData.selectTwo.value&&selectData.selectTwo.value[0])?selectData.selectTwo.value.map((item)=>item.value):[],
    //             // provCount: ""
    //     }
    // });
    // // setApiTestState(prevState => {
    //     return {...prevState,
    //             mgrFirstName: values.mgrFirstName?values.mgrFirstName:"",
    //             mgrLastName: values.mgrLastName?values.mgrLastName:"",
    //             mgrEmail: values.mgrEmail?values.mgrEmail:"",
    //             mgrPhone: values.mgrPhone?values.mgrPhone:"",
    //             mgrFax: values.mgrFax?values.mgrFax:"",
    //             entityName: values.entityName?values.entityName:"",
    //             provAddress: values.provAddress?values.provAddress:"",
    //             provAddress2: values.provAddress2?values.provAddress2:"",
    //             proCity: values.proCity?values.proCity:"",
    //             provZipCode: values.provZipCode?values.provZipCode:"",
    //             provState: (selectData&&selectData.selectOne&&selectData.selectOne.value)?selectData.selectOne.value.value:"",
    //             prodStates: (selectData&&selectData.selectTwo&&selectData.selectTwo.value&&selectData.selectTwo.value[0])?selectData.selectTwo.value.map((item)=>item.value):[],
    //             // provCount: ""
    //     }
    // });
    console.log(apiTestState);

    // //Commented by Nidhi Gupta on 07/27/2023
    // if (tabRef.current === "HomeView") {

    //     const promise = new Promise((resolve, reject) =>{
    //         resolve(createContractId(values));
    //     });

    //     await promise
    //     .then(() => {
    //         setTimeout(() => {
    //             saveFormData(values);
    //         }, 1000);
    //         // saveFormData(values);

    //     })
    //     .catch((err) => {
    //         console.error(err);
    //     });

    //     // saveFormData(values);
    // }
    // //Till Here Temp

    //Instead this is added
    if (tabRef.current === "HomeView") {
      saveFormData(values);
    }

    if (tabRef.current === "DashboardView") {
      //submitCase(prop, apiUrl);
      updateFormData(values);
    }
  };
  function getCaseByCaseNumber() {
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["mainTable"];
    getApiJson["whereClause"] = { caseNumber: prop.state.caseNumber };

    customAxios
      .post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Generic get api response: ", res);
        const apiStat = res.data.Status;
        if (apiStat === -1) {
          alert("Error in fetching data.");
        }

        if (apiStat === 0) {
          const caseIDToUpdate = res?.data?.data?.mainTable[0]?.CaseID;
          const indexToUpdate = caseData.data.findIndex(
            (item) => item?.CaseID === caseIDToUpdate
          );

          if (indexToUpdate !== -1) {
            caseData.data[indexToUpdate] = res?.data?.data?.mainTable[0];
          }

          dispatch({
            type: "UPDATE_DATA",
            payload: {
              data: caseData.data,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }
  function filterData() {
    return caseData.data.filter(
      (item) => item?.CaseID !== Number(prop.state.caseNumber)
    );
  }
  function getCaseByCaseNumber() {
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["mainTable"];
    getApiJson["whereClause"] = { caseNumber: prop.state.caseNumber };

    customAxios
      .post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Generic get api response: ", res);
        const apiStat = res.data.Status;
        if (apiStat === -1) {
          alert("Error in fetching data.");
        }

        if (apiStat === 0) {
          const caseIDToUpdate = res?.data?.data?.mainTable[0]?.CaseID;
          const indexToUpdate = caseData.data.findIndex(
            (item) => item?.CaseID === caseIDToUpdate
          );

          if (indexToUpdate !== -1) {
            caseData.data[indexToUpdate] = res?.data?.data?.mainTable[0];
          }

          dispatch({
            type: "UPDATE_DATA",
            payload: {
              data: caseData.data,
            },
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
  }


  function dispatchUpdateData(updatedData) {
    dispatch({
      type: "UPDATE_DATA",
      payload: {
        data: updatedData,
      },
    });

    dispatch({
      type: "UPDATE_CASE_STATUS",
      payload: {
        caseSubmitted: true,
      },
    });
  }
  const updateFormData = (values) => {
    try {
      let updatedData = filterData();

      setButtonDisableFlag(true);
      //Added by Nidhi
      delete values.caseNumber;

      console.log("potentialDupData updateFormData: ", potentialDupData);

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
      /*//mainWIObject.caseID = prop.state.caseNumber;
        mainWIObject.caseStatus = "Open";
        mainWIObject.createdByName = prop.state.userName;
        mainWIObject.flowId = "1";
        mainWIObject.stageName = "Network";
        mainWIObject.transactionType = ProvAnciFac.displayName;
        //mainWIObject.caseNumber = prop.state.caseNumber;
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
      provObject.userName = prop.state.userName;
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
      // provObject.credPhone = values.credPhone;
      provObject.credFax = values.credFax;
      provObject.credContactName = values.credContactName;
      provObject.contractId = values.contractId;

      // provObject.contractId = values.contractId.replace(values.contractId.substring(1,2),updateProvState);
      // console.log("provObject.contractId: ",provObject.contractId);
      //Till here
      //Newly Added by Nidhi 0n 05/04/23
      console.log("Nidhi apiTestStateComp Update: ", apiTestStateComp);

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
      //requestBody.contractNo = ((apiTestStateComp.contractNo!==undefined)?apiTestStateComp.contractNo:'');
      //requestBody.medicareNo = ((apiTestStateComp.medicareNo!==undefined)?apiTestStateComp.medicareNo:'');
      //requestBody.capitationAmount = ((apiTestStateComp.capitationAmount!==undefined)?apiTestStateComp.capitationAmount:'');
      //requestBody.awpFee = ((apiTestStateComp.awpFee!==undefined)?apiTestStateComp.awpFee:'');
      //requestBody.medicalHomeFee = ((apiTestStateComp.medicalHomeFee!==undefined)?apiTestStateComp.medicalHomeFee:'');
      //requestBody.careMgmtFee = ((apiTestStateComp.careMgmtFee!==undefined)?apiTestStateComp.careMgmtFee:'');
      //requestBody.qualityBonus = ((apiTestStateComp.qualityBonus!==undefined)?apiTestStateComp.qualityBonus:'');
      //requestBody.qualityFee = ((apiTestStateComp.qualityFee!==undefined)?apiTestStateComp.qualityFee:'');
      //requestBody.contract = ((apiTestStateComp.contract!==undefined)?apiTestStateComp.contract.value:'');
      //requestBody.capitationType = ((apiTestStateComp.capitationType!==undefined)?apiTestStateComp.capitationType.value:'');
      //requestBody.capitationTerm = ((apiTestStateComp.capitationTerm!==undefined)?apiTestStateComp.capitationTerm.value:'');

      console.log("Nidhi requestBody Update: ", requestBody);
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
        console.log(
          "gridDataRef.current.potentialDuplicateTable: ",
          gridDataRef.current.potentialDuplicateTable
        );
      }

      let apiTestStateCopy = { ...linearFieldsRef.current.linearFields };
      let updatedLinearJson = CompareJSON(provObject, apiTestStateCopy);

      console.log("Update with Linear: contracting ", updatedLinearJson);
      // gridDataRef.current.linearTable02 = trimJsonValues(updatedLinearJson);

      //    apiJson = saveGridData(apiJson);
      let apiJson = {};
      apiJson["caseNumber"] = prop.state.caseNumber;
      apiJson["MainCaseTable"] = mainWIObject;
      //apiJson["Cont_ProvFaciAnci_Details"] = provObject;
      apiJson["Cont_ProvFaciAnci_Details"] = updatedLinearJson;
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
      console.log("Case JSON Update Nidhi: ", apiJson);
      apiJson["Cont_Type_Grid"] = gridDataRef.current.typeTable;
      // apiJson['Cont_Type_Grid'] = getGridDataValues(typeTableRowsData);
      apiJson["Cont_Payment_Grid"] = gridDataRef.current.paymentTable;
      if (!gridDataRef.current) {
        console.log("helooooooo gridDataRef.current: ", gridDataRef.current);
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

      console.log("Hiiiiii Case JSON2: ", apiJson);
      //Till Here
      apiJson["Cont_PotentialDuplicate"] =
        gridDataRef.current.potentialDuplicateTable;
      // if((callProcRef.current === 'callProc')){
      //if((prop.state.decision === undefined || prop.state.decision === ''))
      console.log("Nidhi apiJson: ", apiJson);
      var todaydate = new Date();
      //Newly Added by Nidhi Gupta on 08/04/2023
      //console.log("apiJson Location: ",apiJson["Cont_Location_Grid"]);
      //console.log("apiJson Location locationTableRowsData: ",locationTableRowsData);
      let saveType = callProcRef.current === "callProc" ? "SS" : "SE";
      let isDecisionDiscard = true;
      const dec =
        prop.state.decision !== undefined
          ? prop.state.decision.toUpperCase().trim()
          : "";

      if (callProcRef.current === "callProc" && dec === "") {
        alert("Please select Decision.");
        setButtonDisableFlag(false); //Added on 5/17/2023
        return;
      } else {
        isDecisionDiscard = checkDecision(dec, callProcRef.current);
      }

      if (!isDecisionDiscard) {
        if (locationTableRowsData !== undefined) {
          console.log(
            "apiJson Location locationTableRowsData length: ",
            locationTableRowsData.length
          );
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
          //const dec = (prop.state.decision !== undefined)?prop.state.decision.toUpperCase().trim():'';
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

      //Newly added on 5/8/2023
      /*else if((callProcRef.current === 'callProc') && ((requestBody.networkState === undefined || requestBody.networkState === '')
        ||(requestBody.contract === undefined || requestBody.contract === '')
        ||(requestBody.medicalLicense === undefined || requestBody.medicalLicense === '')
        ||(requestBody.pcpId === undefined || requestBody.pcpId === '')
        ||(requestBody.riskState === undefined || requestBody.riskState === '')
        ||(requestBody.riskAssignment === undefined || requestBody.riskAssignment === '')
        ||(requestBody.taxId === undefined || requestBody.taxId === '')
        ||(requestBody.groupRiskId === undefined || requestBody.groupRiskId === '')
         ))
        {
            alert("Please fill mandatory fields in Compensation Tab: States, Contract, Medical License, PCP ID, Risk Attribution, Tax ID, Medical Group No.");
        }*/
      //till here

      console.log(
        "helooooooo Just before update API to check input apiJson:",
        apiJson
      );

      customAxios
        .post("/generic/update", apiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res);
          //Added by Nidhi on 04/06/2023
          console.log("Data Update result: ", res);
          const apiStat = res.data["UpdateCase_Output"]["Status"];
          if (apiStat === -1) {
            alert("Data not updated.");
            setButtonDisableFlag(false);
          }

          if (apiStat === 0) {
            alert("Case data updated successfully");
            updateDecision(prop, saveType, ProvAnciFac.displayName);

            /*let procInput = {};
            procInput.input1 = 'testing';
            procInput.input2 = ProvAnciFac.displayName;
            procInput.input3 = prop.state.caseNumber;

            customAxios.post('/updateQueueVariableProcedure',procInput,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
                console.log("Update Queue Variable Proc output: ",res);
                if(res.status === 200){
                    console.log("Update Queue Variable Proc executed successully");
                }
            }).catch((err) => {

                console.log("Caught in update queue variable api call: " ,err.message);
                alert("Error occured in updating queue variables.");
                setButtonDisableFlag(false);
            });*/
            if (callProcRef.current === "callProc") {
              // submitCase(prop,function() {
              //     console.log('After submitcase finished');
              //     navigateHome();
              //   });
              //navigateHome();

              dispatchUpdateData(updatedData);
              submitCase(prop, navigateHome);
            }
            if (callProcRef.current !== "callProc") {
              getCaseByCaseNumber();
              navigateHome();
            }
          }
          //till here
        })
        .catch((err) => {
          console.log("Caught in generic update api call: ", err.message);
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
      //console.log("apiUrlArray: ", apiUrlArray);
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
    console.log("getGridDataValues :", tableData);
    //var headers = document.getElementById(tableId).headers;
    let returnArray = [];
    tableData.map((data) => {
      const dataObject = {};
      const dataKeys = Object.keys(data);
      dataKeys.forEach((dataValue) => {
        const dataKeyType = typeof data[dataValue];
        console.log("getGridDataValues data[dataValue] :", data[dataValue]);
        console.log("getGridDataValues dataKeyType :", dataKeyType);
        if (dataKeyType === "object") {
          console.log("Inside Data Object if: ", dataObject);
          if (!!data[dataValue]) {
            if (!!data[dataValue].value) {
              if (data[dataValue].value instanceof Date) {
                // dataObject[dataValue] =
                //   data[dataValue].value.toLocaleDateString();
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
    console.log("getGridDataValues returnArray :", returnArray);
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
    // console.log("Inside populateFormBasisOnType")
    // console.log("formName.current= ", formName.current)
    // console.log("tabRef.current= ", tabRef.current)
    if (tabRef.current === "DashboardView") {
      //console.log("Inside DashboardView")
      return (
        <>
          <Tabs
            defaultActiveKey={formName.current}
            id="justify-tab-example"
            className="mb-3"
            justify
            onSelect={(key) => handleTabSelect(key)}
          >
            {/* <Tab eventKey={prop.state.formNames} title={ProvAnciFac.displayName}>
                         {populateForm()}
                    </Tab> */}

            <Tab eventKey={formName.current} title={formName.current}>
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
                transactionType={ProvAnciFac.displayName}
                /*selectJson={selectValues}*/
                //type={'Editable'}
                //lockStatus={(prop.state!==null && prop.state.lockStatus!==undefined)?prop.state.lockStatus:'N'}>
                type={
                  prop.state !== null &&
                  prop.state.stageName !== undefined &&
                  (prop.state.stageName == "Exit" ||
                    prop.state.stageName == "Discard")
                    ? "NonEditable"
                    : "Editable"
                }
                lockStatus={
                  prop.state !== null &&
                  prop.state.stageName !== undefined &&
                  (prop.state.stageName == "Exit" ||
                    prop.state.stageName == "Discard")
                    ? "V"
                    : "N"
                }
              ></CompensationTab>
            </Tab>

            <Tab eventKey="Decision" title="Decision">
              <DecisionTab
                lockStatus={
                  prop.state.lockStatus === undefined ||
                  prop.state.lockStatus === ""
                    ? "N"
                    : prop.state.lockStatus
                }
                potentialDupData={potentialDupData}
                handleActionSelectChange={handleActionSelectChange}
                buttonClicked={callProcRef.current}
              ></DecisionTab>
              {/* <DecisionTab selectJson={selectValues}></DecisionTab> */}
            </Tab>
            <Tab eventKey="Reference" title="Reference">
              <ReferenceTab />
            </Tab>
          </Tabs>
        </>
      );
    }
    if (tabRef.current === "HomeView") {
      //console.log("Inside HomeView")
      return <>{populateForm()}</>;
    }

    //populateForm();
  };

  const populateForm = () => {
    //console.log(apiTestState)
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
                //console.log(values)
                return (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                    }}
                  >
                    <fieldset
                      disabled={
                        tabRef.current === "DashboardView" &&
                        prop.state.lockStatus !== undefined &&
                        prop.state.lockStatus === "Y"
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
                            className="accordion-button accordionButtonStyle"
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
                          className="accordion-collapse collapse show"
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
                                        //isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                        isDisabled={
                                          tabRef.current === "DashboardView" &&
                                          prop.state.lockStatus !== undefined &&
                                          prop.state.lockStatus === "Y"
                                            ? true
                                            : false
                                        }
                                        className="basic-multi-select"
                                        //isClearable
                                        options={masterValues}
                                        id="contractTypeDropdown"
                                        isMulti={false}
                                        //  onChange={value => {
                                        //         setSelectData({...selectData, selectThree: {value: value}});
                                        //         prop.state.contractType=value.value;

                                        // }}
                                        onChange={(selectValue, event) =>
                                          setFieldValue(field.name, selectValue)
                                        }
                                        //  onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                                        //  value={(selectData&&selectData.selectThree&&selectData.selectThree.value)?
                                        //     (selectData&&selectData.selectThree&&selectData.selectThree.value):
                                        //     {label:apiTestState.contractType, value:apiTestState.contractType}
                                        //     }
                                        value={field.value}
                                        onFocus={() => {}}
                                        // onBlur={event => {
                                        //     if(selectData&&(!selectData.selectThree||(selectData.selectThree&&!selectData.selectThree.value))){
                                        //         setSelectData({...selectData, selectThree: {value: ""}});
                                        //     }
                                        // }}
                                        //value={apiTestState.contractType}
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

                                {/* <Select
                                                              classNames={{
                                                                control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectThree&&!selectData.selectThree.value)?"is-invalid":""}`
                                                            }}
                                                                  styles={{
                                                                    control: (provided) => ({
                                                                        ...provided,
                                                                        height: '58px'
                                                                    }),
                                                                    menuList: (provided) => ({
                                                                        ...provided,
                                                                        maxHeight: 200,
                                                                    }),

                                                                    container: (provided, state) => ({
                                                                        ...provided,
                                                                        marginTop: 0
                                                                      }),
                                                                      valueContainer: (provided, state) => ({
                                                                        ...provided,
                                                                        overflow: "visible"
                                                                      }),
                                                                      placeholder: (provided, state) => ({
                                                                        ...provided,
                                                                        position: "absolute",
                                                                        top: state.hasValue || state.selectProps.inputValue ? -15 : "50%",
                                                                         transition: "top 0.1s, font-size 0.1s",
                                                                        fontSize: (state.hasValue || state.selectProps.inputValue) && 13
                                                                          })

                                                                        }}
                                                    components={{
                                                    ValueContainer: CustomValueContainer
                                                  }}
                                                name = "contractType"
                                                    //isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                                    isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                                     className="basic-multi-select"
                                                     //isClearable
                                                    options={masterValues}
                                                     id='contractTypeDropdown'
                                                     isMulti={false}
                                                     onChange={value => {
                                                        //console.log(value);
                                                        //if("value is selected"){
                                                            setSelectData({...selectData, selectThree: {value: value}});
                                                            //Nidhi 04-24-2023
                                                            prop.state.contractType=value.value;
                                                            //till here
                                                        //}
                                                    }}
                                                    //  onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                                                     value={(selectData&&selectData.selectThree&&selectData.selectThree.value)?
                                                        (selectData&&selectData.selectThree&&selectData.selectThree.value):
                                                        {label:apiTestState.contractType, value:apiTestState.contractType}
                                                        }
                                                    onFocus={()=>{
                                                    }}
                                                    onBlur={event => {
                                                        if(selectData&&(!selectData.selectThree||(selectData.selectThree&&!selectData.selectThree.value))){
                                                            setSelectData({...selectData, selectThree: {value: ""}});
                                                        }
                                                    }}
                                                     //value={apiTestState.contractType}
                                                     placeholder ="Contract Type"
                                                //styles={{...customStyles}}
                                                    isSearchable = {document.documentElement.clientHeight>document.documentElement.clientWidth?false:true}
                                            /> */}
                                {/* {(selectData&&selectData.selectThree&&!selectData.selectThree.value)?<div className="invalid-feedback" style={{display:'block'}}>Please select Contract Type</div>:null}
                                                             </div> */}
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <Field name="mgrFirstName">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    // console.log("----->"+JSON.stringify(apiTestState))
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
                                        autoComplete="off"
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
                                        onBlur={(evnt) => (handleFormikBlur(evnt,setFieldValue,field.name))}
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
                                    //console.log("OrgName Field: ",field);
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
                                        autoComplete="off"
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
                                        onBlur={(evnt) => (handleFormikBlur(evnt,setFieldValue,field.name))}
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

                            {/* <div className="row my-2">
                                                <div className="col-xs-6 col-md-4">

                                                        <label>How many Providers need to be contracted?</label>
                                                        <br/>

                                                        <input type="text" style={{width:'400px'}} name="provCount" onChange={event => handleApiTestChange(event)} value={apiTestState.provCount}/>

                                                </div>

                                            </div> */}
                          </div>
                        </div>
                      </div>
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
                            Please Provide Contract Address of Notice
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseThree"
                          className="accordion-collapse collapse show"
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
                              {/* <div className="col-xs-6 col-md-4">
                                                    <div className="form-floating" >
                                                        <select class="form-select" id="floatingSelect" aria-label="Floating label select example" name="State" onChange={event => handleApiTestChange(event)} value={apiTestState.State}>
                                                        <option selected>Select</option>
                                                        <option value="1">AL</option>
                                                        <option value="2">FL</option>
                                                        <option value="3">AU</option>
                                                        <option value="3">ZL</option>
                                                        </select>
                                                        <label for="floatingSelect">State</label>
                                                    </div>
                                                </div> */}

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
                                          prop.state.lockStatus !== undefined &&
                                          prop.state.lockStatus === "Y"
                                            ? true
                                            : false
                                        }
                                        className="basic-multi-select"
                                        options={
                                          selectValues.stateOptionsLinear
                                        }
                                        id="stateDropdown"
                                        isMulti={false}
                                        //     onChange={value => {

                                        //             setSelectData({...selectData, selectOne: {value: value}});

                                        //     }}

                                        //     value={(selectData&&selectData.selectOne&&selectData.selectOne.value)?
                                        //         (selectData&&selectData.selectOne&&selectData.selectOne.value):
                                        //         {label:apiTestState.provState, value:apiTestState.provState}
                                        //         }
                                        //     onFocus={()=>{

                                        //     }}
                                        //     ref={stateRef}
                                        //    onBlur={event => {
                                        //         if(selectData&&(!selectData.selectOne||(selectData.selectOne&&!selectData.selectOne.value))){
                                        //             setSelectData({...selectData, selectOne: {value: ""}});
                                        //         }
                                        //
                                        //     }}

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

                                        //  options={selectValues.stateArray?selectValues.stateArray:[{label:"option", value:"option"}]}
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

                              {/* <div className="col-xs-6 col-md-4">

                                                <div className="form-floating">
                                                    <ReactDatePicker
                                                    id = "datePicker"
                                                    className='example-custom-input-provider'
                                                    selected={apiTestState.startDate}
                                                    name="startDate"
                                                    onChange={event => handleDateChange(event)}
                                                        dateFormat="MM/dd/yyyy"
                                                    />
                                                <label htmlFor="datePicker">Date</label>
                                                </div>
                                            </div> */}
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
                            className="accordion-button accordionButtonStyle"
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
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-headingFour"
                        >
                          <div className="accordion-body">
                            <div className="row my-2">
                              {/* <div className="col-md mx-2">
                                                            <label htmlFor="medicaidSwitch">Medicaid</label>
                                                            <br />
                                                            <Switch id="medicaidSwitch" name="medicaid" onChange={isChecked => {
                                                                values.medicaid = isChecked;
                                                                setApiTestState(prevState =>{
                                                                    return{
                                                                        ...prevState,
                                                                        medicaid: isChecked
                                                                    }
                                                                });
                                                            }} checked={apiTestState.medicaid}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                offColor="#FFCCCB"
                                                                onColor="#90EE90"
                                                            />

                                                        </div> */}
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
                                {/* <div className="form-floating">
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="medicareSwitch" name="medicare" onChange={event => handleSwitchChange(event)} value={apiTestState.medicare}/>
                                                            </div>
                                                            </div> */}
                              </div>
                              {/* <div className="col-md mx-2">
                                                            <label htmlFor="medicaidSwitch">Exchange</label>
                                                            <br />
                                                            <Switch id="exchangeSwitch" name="exchange" onChange={isChecked => {
                                                                setApiTestState({
                                                                    ...apiTestState,
                                                                    exchange: isChecked
                                                                });
                                                            }} checked={apiTestState.exchange}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                offColor="#FFCCCB"
                                                                onColor="#90EE90"
                                                            />
                                                            {/* <div className="form-floating">
                                                            <div className="form-check form-switch">

                                                                <input className="form-check-input" type="checkbox" id="exchangeSwitch" name="exchange" onChange={event => handleSwitchChange(event)} value={apiTestState.exchange}/>
                                                            </div>
                                                            </div> }
                                                        </div> */}
                              {/* <div className="col-md mx-2">
                                                            <label htmlFor="medicaidSwitch">Commercial</label>
                                                            <br />
                                                            <Switch id="commercialSwitch" name="commercial" onChange={isChecked => {
                                                                setApiTestState({
                                                                    ...apiTestState,
                                                                    commercial: isChecked
                                                                });
                                                            }} checked={apiTestState.commercial}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                offColor="#FFCCCB"
                                                                onColor="#90EE90"
                                                            />
                                                            {/* <div className="form-floating">
                                                            <div className="form-check form-switch">

                                                                <input className="form-check-input" type="checkbox" id="commercialSwitch" name="commercial" onChange={event => handleSwitchChange(event)} value={apiTestState.commercial}/>
                                                            </div>
                                                            </div> s}
                                                        </div> */}
                              {/* <div className="col-md mx-2">
                                                            <label htmlFor="medicaidSwitch">Behavioral Health</label>
                                                            <br />
                                                            <Switch id="medicaidSwitch" name="bhvrHealth" onChange={isChecked => {
                                                                setApiTestState({
                                                                    ...apiTestState,
                                                                    bhvrHealth: isChecked
                                                                });
                                                            }} checked={apiTestState.bhvrHealth}
                                                                uncheckedIcon={false}
                                                                checkedIcon={false}
                                                                offColor="#FFCCCB"
                                                                onColor="#90EE90"
                                                            />
                                                            {/* <div className="form-floating">
                                                            <div className="form-check form-switch">
                                                                <input className="form-check-input" type="checkbox" id="medicaidSwitch" name="medicaid" onChange={event => handleApiTestChange(event)} value={apiTestState.medicaid}/>
                                                            </div>
                                                            </div> }
                                                        </div> */}
                              {/* </div>
                                                    <div className="row my-4"> */}
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
                                      prop.state.lockStatus !== undefined &&
                                      prop.state.lockStatus === "Y"
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
                                      //console.log(value);
                                      //if("value is selected"){
                                      setSelectData({
                                        ...selectData,
                                        selectTwo: { value: value },
                                      });
                                      //}
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
                          className="accordion-button accordionButtonStyle"
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
                                lockStatus={
                                  prop.state !== null &&
                                  prop.state.lockStatus !== undefined &&
                                  prop.state.lockStatus !== ""
                                    ? prop.state.lockStatus
                                    : "N"
                                }
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
                          className="accordion-button accordionButtonStyle"
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
                                lockStatus={
                                  prop.state !== null &&
                                  prop.state.lockStatus !== undefined &&
                                  prop.state.lockStatus !== ""
                                    ? prop.state.lockStatus
                                    : "N"
                                }
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
                          className="accordion-button accordionButtonStyle"
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
                                lockStatus={
                                  prop.state !== null &&
                                  prop.state.lockStatus !== undefined &&
                                  prop.state.lockStatus !== ""
                                    ? prop.state.lockStatus
                                    : "N"
                                }
                                selectJson={selectValues}
                                modifyValidatedAddressRow={
                                  modifyValidatedAddressRow
                                }
                                calledFormName={ProvAnciFac.validate}
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
                        displayName={ProvAnciFac.displayName}
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

                          if (callProcRef.current === "notCallProc" || prop?.state?.decision?.toLowerCase() === 'discard') {

                            saveData(values);
                          }
                          else{
                            handleSubmit(event);
                          }

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
    //console.log(evnt);
    if (evnt.target.name == "saveSubmit") {
      callProcRef.current = "callProc";
    }

    if (evnt.target.name == "saveExit") {
      callProcRef.current = "notCallProc";
    }
    document.getElementById("mainFormSubmit").click();
    console.log(
      "Inside callFormSubmit callProcRef.current",
      callProcRef.current
    );
  };
  return (
    loadForm && (
      <>
        <div
          className="ProvAnciFac backgroundColor"
          style={{ minHeight: "100vh" }}
        >
          {tabRef.current === "DashboardView" && <CaseInformation />}
          <div className="container">
            <div className="row mb-2">
              <div className="col-xs-6" style={{ textAlign: "center" }}>
                <br />
                <button
                  type="button"
                  className="providerPageButton button"
                  onClick={(event) => navigateContractingHome(event)}
                  style={{ float: "left" }}
                >
                  Go To Home
                </button>
                {formName && formName.current ? (
                  <label id="tileFormLabel" className="HeadingStyle">
                    {formName.current}
                  </label>
                ) : null}
                <button
                  type="button"
                  className="providerPageButton button"
                  onClick={(event) => navigateContractingHome(event)}
                  style={{
                    visibility: "hidden",
                    background: "transparent",
                    border: "unset",
                  }}
                ></button>
                {tabRef.current === "DashboardView" && (
                  <button
                    type="button"
                    className="btn btn-outline-primary btnStyle"
                    name="saveExit"
                    onClick={(event) => {
                      callFormSubmit(event);
                    }}
                    style={{ float: "right", marginRight: "10px" }}
                    disabled={
                      buttonDisableFlag ||
                      (tabRef.current === "DashboardView" &&
                      prop.state.lockStatus !== undefined &&
                      prop.state.lockStatus === "Y"
                        ? true
                        : false)
                    }
                  >
                    Save & Exit
                  </button>
                )}

                {/* Changed by Nidhi */}
                {/* <button type="button" className="btn btn-outline-primary btnStyle" name="saveSubmit" onClick={event => {callFormSubmit(event)}} style={{float:"right",marginRight:"10px"}}

                            >{(tabRef.current==='DashboardView')?'Save & Submit':'Submit'}</button> */}
                <button
                  type="button"
                  className="btn btn-outline-primary btnStyle"
                  name="saveSubmit"
                  onClick={(event) => {
                    callFormSubmit(event);
                  }}
                  style={{ float: "right", marginRight: "10px" }}
                  disabled={
                    buttonDisableFlag ||
                    (tabRef.current === "DashboardView" &&
                    prop.state.lockStatus !== undefined &&
                    prop.state.lockStatus === "Y"
                      ? true
                      : false)
                  }
                >
                  {tabRef.current === "DashboardView"
                    ? "Save & Submit"
                    : "Submit"}
                </button>
                {/* //Till here */}
                {/* <button type="button" className="btn btn-outline-primary btnStyle" name="saveSubmit" onClick={event => {callFormSubmit(event)}} style={{float:"right",marginRight:"10px"}}>Submit</button> */}
                {/* <label id="tileFormLabel" className='HeadingStyle'>Provider Contracting</label> */}
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
          {/* <footer className='footerStyle'>
                    <div className="content-wrapper">
                        <div className='float-left'>
                            <h6 style={{paddingTop: 5, borderTop: '1px solid lightgray'}}></h6>
                        </div>
                    </div>
                </footer> */}
          <FooterComponent />
        </div>
      </>
    )
  );
}
