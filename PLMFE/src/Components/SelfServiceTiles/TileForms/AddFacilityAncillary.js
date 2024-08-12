import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "react-datepicker/dist/react-datepicker.css";
//import customAxios from "../../../api/axios";
import "../TileFormsCss/AddProvider.css";
import Select, { components } from "react-select";
import Switch from "react-switch";
import SpecialityTable from "../TileFormsTables/SpecialityTable";
import LicenseTable from "../TileFormsTables/LicenseTable";
import LocationTable from "../TileFormsTables/LocationTable";
import PayToTable from "../TileFormsTables/PayToTable";
import InsuranceTable from "../TileFormsTables/InsuranceTable";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import { RxCross2 } from "react-icons/rx";
import useFormikValidation from "../../CustomHooks/useFormikValidation";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import CredentialTable from "../TileFormsTables/CredentialTable";
import ReferenceTab from "../../../WorkItemDashboard/ReferenceTab";
import DocumentSection from "../DocumentSection";
import { useAxios } from "../../../api/axios.hook";
import { BallTriangle } from "react-loader-spinner";
import Loader from "react-loader-advanced";
import FooterComponent from "../../FooterComponent";
import useCallApi from "../../CustomHooks/useCallApi";
import CompensationTab from "../../ContractingHome/ContractingTileForms/CompensationTab";
import { isValidDateValue } from "@testing-library/user-event/dist/utils";

export default function AddFacilityAncillary() {
  const {
    submitCase,
    updateLockStatus,
    validateGridData,
    printConsole,
    getNPIFromMaster,
    setContractIdDropDown,
    validatePotentialDup,
    validatePotentialDupDec,
    updateDecision,
    checkDecision,
    CompareJSON,
    areAllLocationNameSame,
  } = useUpdateDecision();

  const { getLinkingData } = useCallApi();
  const linearFieldsRef = useRef({});
  AddFacilityAncillary.validate = "shouldValidate";
  //AddFacilityAncillary.displayName = "Add a Facility";

  const initState = {
    legalEntityName: "",
    dbaName: "",
    npiId: "",
    medicareId: "",
    medicaidId: "",
    // placeInDirectory:"",
    emailId: "",
    delegated: "",
    contractId: "",
    states: "",
  };

  //console.log("Use Selector: ",useSelector((state) => console.log("State: ",state)));
  const mastersSelector = useSelector((masters) => masters);
  const caseData = useSelector((store) => store.dashboardNavigationState);

  console.log("Masters Selector: ", mastersSelector);
  const masterUserName = mastersSelector.hasOwnProperty("auth")
    ? mastersSelector.auth.hasOwnProperty("userName")
      ? mastersSelector.auth.userName
      : "system"
    : "system";
  const authData = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  //const formName = useRef(null);
  const formName = useRef(null);
  const npiIdRef = React.useRef();

  //const [loaderState,setLoaderState] = useState(false);

  const [loaderState, setLoaderState] = useState(false);
  const [buttonDisableFlag, setButtonDisableFlag] = useState(false);
  const [formikInitializeState, setFormikInitializeState] = useState(false);

  let credentialingConfigData = JSON.parse(
    process.env.REACT_APP_CREDENTIALING_DETAILS
  );

  const { customAxios, fileUpDownAxios } = useAxios();

  const { checkErrorsAndFocusOnFields, checkYupValidation, testYupFieldValue } =
    useFormikValidation();

  const validationSchema = Yup.object().shape({
    legalEntityName: Yup.string()
      .required("Please enter Legal Entity Name")
      .max(100, "Legal Entity Name max length exceeded"),
    dbaName: Yup.string()
      .when("delegated", {
        is: (del) => {
          return checkYupValidation(del);
        },
        then: (schema) => schema.required("Please enter DBA Name"),
        otherwise: (schema) => schema.notRequired(),
      })
      //          .required('Please enter DBA Name')
      .max(100, "DBA Name max length exceeded"),

    npiId: Yup.string()
      //        .typeError('NPI ID must be a number')
      .required("Please enter NPI ID")
      .max(10, "NPI ID max length exceeded")
      .matches(
        /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
        "Only numbers are accepted"
      ),
    medicareId: Yup.string()
      //        .typeError('Medicare ID must be a number')
      .required("Please enter Medicare ID")
      .max(10, "Medicare ID max length exceeded"),
    medicaidId: Yup.string()
      // //       .typeError('Medicaid ID must be a number')
      //          .required("Please enter Medicaid ID")
      .max(10, "Medicaid ID max length exceeded"),
    //New Nidhi
    emailId: Yup.string()
      .email("Please enter valid Email Id")
      .required("Please enter Email Id")
      .max(50, "Email Id max length exceeded"),
    //Till here
    delegated: Yup.object()
      .nullable()
      .required("Please select Delegated")
      .test("prohibitedValuesTest", "Please Select Delegated", (value) =>
        testYupFieldValue(value)
      ),

    // Medicare: Yup.boolean().when('delegated',{
    //   is: (del) => {
    //     return checkYupValidation(del);
    //   },
    //   then: (schema) => schema.oneOf([true], 'Medicare is required').required('Medicare is required'),
    //   otherwise: (schema) => schema.notRequired()
    //   }),

    contractId: Yup.object()
      .when("delegated", {
        is: (del) => {
          return checkYupValidation(del);
        },
        then: (schema) =>
          schema
            .required("Please select Contract Id")
            .test(
              "prohibitedValuesTest",
              "Please Select Contract Id",
              (value) => testYupFieldValue(value)
            ),
        otherwise: (schema) => schema.notRequired(),
      })
      .nullable(),

    states: Yup.array().when("delegated", {
      is: (del) => {
        return checkYupValidation(del);
      },
      then: (schema) =>
        schema
          .min(1, "Select at least one option")
          .required("Please select states"),
      //.test('prohibitedValuesTest', 'Please Select States', value => testYupFieldValue(value))

      otherwise: (schema) => schema.notRequired(),
    }),
  });

  const documentSectionDataRef = useRef([]);

  printConsole("INitial api test state getting called: ", "");
  const [apiTestState, setApiTestState] = useState(initState);
  const [gridFieldTempState, setGridFieldTempState] = useState({});
  const {
    getTableDetails,
    trimJsonValues,
    getDatePartOnly,
    convertToCase,
    checkGridJsonLength,
    extractDate,
    acceptNumbersOnly,
    getJsonFromFormikState,
  } = useGetDBTables();

  let prop = useLocation();
  printConsole("Inside Add Facility use location prop: ", prop);
  //Nidhi
  let quesAnsList = [];
  //here 00
  const navigate = useNavigate();
  const tabRef = useRef("HomeView");
  const formOpenedFromRef = useRef(null);
  const hideandShow = useRef(null);
  const fetchAutoPopulate = useRef(false);

  //Added by Nidhi Gupta on 10/10/2023
  const [apiTestStateComp, setApiTestStateComp] = useState({
    pcpId: "",
    taxId: "",
    medicalLicense: "",
    groupRiskId: "",
    networkId: "",
    planValue: "",
    networkState: "",
    feeSchedule: "",
    riskState: "",
    riskAssignment: "",
    //Added by Nidhi Gupta on 10/06/2023
    starsIncentive: "",
    awvIncentive: "",
    medicalHome: "",
    criticalAccess: "",
    pricingAWP: "",
    pricingASP: "",
    annualEscl: "",
    sequesApplies: "",
    terminationClause: "",
    contractTypeComp: "",
    qualityFlagI: "",
    qualityFlagJ: "",
    qualityFlagK: "",
    qualityFlagL: "",
    qualityFlagM: "",
    qualityFlagN: "",
    //Till Here
  });

  /////
  const [firlTableRowsData, setFirlTableRowsData] = useState([]);
  const [compensationTableRowsData, setCompensationTableRowsData] = useState(
    []
  );
  /////

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

  const handleLinearFieldChange = (evt) => {
    let value = evt.target.value || "";
    value = value.toUpperCase();
    setApiTestStateComp({
      ...apiTestStateComp,
      [evt.target.name]: value, //changed by Nidhi Gupta on 10/16/2023
    });
    //console.log(" handleLinearFieldChange apiTestStateComp: ",apiTestStateComp);
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

  const handleLinearSelectChangeComp = (selectValue, evnt) => {
    console.log(" handleLinearSelectChange evnt.name: ", evnt.name);

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
  //Till Here

  const navigateHome = async () => {
    setButtonDisableFlag(false);
    console.log(
      "Inside AddFacilityAncillary navigateHome: ",
      prop.state.formView
    );
    if (prop.state.formView === "DashboardView") {
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

    if (prop.state.formView === "DashboardHomeView") {
      navigate("/DashboardLogin/Home", { replace: true });
    }

    if (prop.state.formView === "HomeView") {
      navigate("/Home", { replace: true });
    }
  };

  const onErr = (response, typeOfRequest = "") => {
    console.log(response, typeOfRequest);
    if ((typeOfRequest = "masterStateSymbol")) {
      //do something on failed request
    }
  };

  const [selectValues, setSelectValues] = useState({});
  const [subSpecialityOptions, setSubSpecialityOptions] = useState([]);
  const [potentialDupData, setPotentialDupData] = useState([]);

  const onSuccess = (response, typeOfRequest) => {};

  const [specialityTableRowsData, setspecialityTableRowsData] = useState([]);
  const [licenseTableRowsData, setLicenseTableRowsData] = useState([]);
  const [locationTableRowsData, setLocationTableRowsData] = useState([]);
  const [payToTableRowsData, setPayToTableRowsData] = useState([]);
  const [insuranceTableRowsData, setInsuranceTableRowsData] = useState([]);
  const [credentialTableRowsData, setCredentialTableRowsData] = useState([]);
  //const [additionalQuesRowsData, setAdditionalQuesRowsData] = useState([]);
  //Nidhi
  const [quesAnsListJson, setQuesAnsListJson] = useState([]);
  const [apiCallOnce, setApiCallOnce] = useState(false);
  //here

  //Added By SY on 06/03/2024
  const checkLuhn = (npiId) => {
    console.log("Inside onBlur event of NPI ID");
    if (npiId !== undefined && npiId.length > 0) {
      var tmp;
      var sum;
      var i;
      var j;
      i = npiId.length;
      if (i === 15 && npiId.indexOf("80840", 0, 5) === 0) sum = 0;
      else if (i === 10) sum = 24;
      else return "This is not a valid NPI ID";
      // caqhNpiIdRef.current.focus();

      j = 0;
      while (i !== 0) {
        tmp = npiId.charCodeAt(i - 1) - "0".charCodeAt(0);
        if (j++ % 2 !== 0) {
          if ((tmp <<= 1) > 9) {
            tmp -= 10;
            tmp++;
          }
        }
        sum += tmp;
        i--;
      }
      if (sum % 10 === 0) {
      }
      // alert("This is a valid NPI ID");
      else return "This is not a valid NPI ID";
      //caqhNpiIdRef.current.focus();
    }
  };


  //Added By NG on 11/20/2023

  const npiOnSave = async (values) => {
    try {
      const getApiJson = {
        option: "FindDuplicateNpiId",
        Type: "SelfService",
        //NpiId: values.npiId !== undefined ? values.npiId.trim() : '',
        NpiId:
          values.npiId !== undefined
            ? typeof values.npiId === "string"
              ? values.npiId.trim()
              : values.npiId
            : "",
        FlowId: credentialingConfigData["FlowId"],
        TransactionType: AddFacilityAncillary.displayName,
        ContractId: apiTestState.contractId?.value || "",
        LegalEntityName:
          values.legalEntityName !== undefined
            ? values.legalEntityName.trim()
            : "",
      };

      console.log("Input params for FindDuplicateNpiId: ", getApiJson);

      const res = await customAxios.post("/generic/callProcedure", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("Get data Response for FindDuplicateNpiId: ", res);
      let respData = res.data.CallProcedure_Output.data;

      const isDuplicate = respData && respData[0] !== 0;
      if (isDuplicate) {
        alert("This is a duplicate NPI ID. Please provide a unique NPI ID.");
        setButtonDisableFlag(false); // Re-enable the button
        return false; // Duplicate found
      } else {
        // No duplicate found, proceed with further actions
        return true;
      }
    } catch (error) {
      console.error(
        "Caught in catch of FindDuplicateNpiId proc calling: ",
        error.message
      );
      setButtonDisableFlag(false); // Re-enable the button in case of error
      // Handle the error (perhaps set an error state, display a message, etc.)
      // for now, we'll just return false
      return false;
    }
  };

  //Till Here
  const handleTabSelect = (key) => {
    try {
      // Perform actions when the tab is selected
      console.log("Tab selected with key:", key);
      if (key == "Compensation" && !apiCallOnce) {
        setApiCallOnce(true);
        let getApiJson = {};
        getApiJson["tableNames"] = getTableDetails()["networkLinear"].concat(
          getTableDetails()["networkGridTables"]
        );
        getApiJson["whereClause"] = { caseNumber: prop.state.caseNumber };

        customAxios
          .post("/generic/get", getApiJson, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            //console.log("Generic get api response compensation Nidhi01: ",res);
            const apiStat = res.data.Status;
            if (apiStat === -1) {
              alert("Error in fetching data");
            }
            if (apiStat === 0) {
              const respKeys = Object.keys(res.data["data"]);
              const respData = res.data["data"];
              respKeys.forEach((k) => {
                //console.log("Response key Nidhi: ",k);
                if (k === "networkLinearTable") {
                  let apiResponse = {};
                  if (respData[k][0] !== undefined) {
                    apiResponse = respData[k][0];

                    //Added by Nidhi Gupta on 10/06/23
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
                    //Till Here
                    console.log("NetworkTab apiResponse", apiResponse);
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
                    //  apiResponse.sequesApplies = {'label':apiResponse.sequesApplies,'value':apiResponse.sequesApplies};

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

                    //console.log("NetworkTab apiResponse: ", apiResponse)
                    apiResponse = convertToDateObj(apiResponse);

                    //Till Here

                    setApiTestStateComp(apiResponse);
                    //setFormikInitializeState(true);
                  }
                }

                //Added by Nidhi Gupta on 10/06/2023
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

                //Till Here
              });
            }
          })
          .catch((err) => {
            console.log("Network Tab get api catch: ", err);
          });
        //console.log("getApiJson Network Tab: ",getApiJson);
      }
    } catch (error) {
      console.error("Network Tab handleTabSelect catch: ", error);
    }
  };

  //
  useEffect(() => {
    setFormikInitializeState(true);

    if (
      prop.state.formView !== undefined &&
      (prop.state.formView === "HomeView" ||
        prop.state.formView === "DashboardHomeView")
    ) {
      tabRef.current = "HomeView";
      if (prop.state.formNames === "AddFacility") {
        AddFacilityAncillary.displayName = "Add a Facility";
      }
      if (prop.state.formNames === "AddAncillary") {
        AddFacilityAncillary.displayName = "Add an Ancillary";
      }
      if (prop.state.formNames === "AncFacDemoMod") {
        AddFacilityAncillary.displayName = "Ancillary/Facility  Modification";
      }
      setFormikInitializeState(false);
      if (prop.state.formNames === "CaseHeader") {
        AddFacilityAncillary.displayName = "CaseHeader";
      }
      setFormikInitializeState(false);
    }
    printConsole("Auth Data: ", authData);
    /*TO DO: Need to uncomment this*/
    // if(!authData.isSignedIn){
    //     navigate('/', { replace: true });
    // }

    // let apiArray = [];
    // let selectJson = {};
    //console.log("Received Props: ",prop);

    //till here 01

    //selectValues.additionalQues
    if (
      prop.state.formView !== undefined &&
      prop.state.formView === "DashboardView"
    ) {
      //console.log("Inside prop.state useeffect()");
      tabRef.current = "DashboardView";

      // setTimeout(
      //     () => setSelectValues(selectJson),
      //     1000
      // );
      AddFacilityAncillary.displayName = prop.state.formNames;
      //if(tabRef.current === "DashboardView" && ((formOpenedFromRef.current === null || formOpenedFromRef === null || formOpenedFromRef.current !== 'Dashboard'))){
      hideandShow.show = true;
      let getApiJson = {};
      getApiJson["tableNames"] = getTableDetails()["facAncLinear"].concat(
        getTableDetails()["gridTables"]
      );
      getApiJson["whereClause"] = { caseNumber: prop.state.caseNumber };

      //console.log("Get Api JSON: ",getApiJson);

      /*const formData = new FormData();

              setTimeout(
                    () => formData.append('getData', getApiJson),
                    1000
                );*/
      if (
        tabRef.current == "DashboardView" &&
        AddFacilityAncillary.displayName ==
          "Ancillary/Facility Demographic Modification"
      ) {
        console.log("Hiiii fetchAutoPopulate");
        fetchAutoPopulate.current = true;
      }

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
            const respKeys = Object.keys(res.data["data"]);
            const respData = res.data["data"];
            //console.log("respData: ",respData);
            prop.state.dbaName = respData.linearTable02[0].dbaName;

            respKeys.forEach((k) => {
              console.log("Response key: ", k);
              if (k === "linearTable02") {
                let apiResponse = {};
                if (respData[k][0] !== undefined) {
                  apiResponse = respData[k][0];

                  //apiResponse.languagesDefault = apiResponse.languages.split(",");
                  // apiResponse.placeInDirectoryDefault = apiResponse.placeInDirectory.split(",");

                  apiResponse.delegated = {
                    label: apiResponse.delegated,
                    value: apiResponse.delegated,
                  };
                  apiResponse.placeInDirectory = {
                    label: apiResponse.placeInDirectory,
                    value: apiResponse.placeInDirectory,
                  };
                  apiResponse.contractId = {
                    label: apiResponse.contractId,
                    value: apiResponse.contractId,
                  };

                  //apiResponse.states = apiResponse.states.split(",").map(ele => {return {label: ele, value: ele}});

                  if (
                    apiResponse.states !== undefined &&
                    apiResponse.states !== ""
                  ) {
                    apiResponse.states = apiResponse.states
                      .split(",")
                      .map((ele) => {
                        return { label: ele, value: ele };
                      });
                  }

                  /*
                  //From here
                  apiResponse = convertToDateObj(apiResponse);
                  apiTestState.legalEntityName=apiResponse.legalEntityName;
                  apiTestState.dbaName=apiResponse.dbaName;
                  apiTestState.npiId=apiResponse.npiId;
                  apiTestState.medicareId=apiResponse.medicareId;
                  apiTestState.medicaidId=apiResponse.medicaidId;
                  apiTestState.emailId=apiResponse.emailId;

                  //Till Here Added by Nidhi Gupta, this is only temporary solution as linear states for texboxes not getting set in setApiTestState on 6/2/2023
                  */
                  //  Added by SHivani to get contract Id at onload
                  linearFieldsRef.current = { linearFields: apiResponse };
                  if (prop.state.formView === "DashboardView") {
                    console.log("inside populate in dashboardview of FaciAnci");
                    if (
                      (apiResponse.contractId.value === "" ||
                        apiResponse.contractId.value === undefined) &&
                      apiResponse.legalEntityName !== "" &&
                      !checkStageName.includes(prop.state.stageName)
                    ) {
                      populateContractIdDropdown(
                        "legalEntityName",
                        apiResponse.legalEntityName,
                        apiResponse,
                        selectJson
                      );
                    }
                    //To load master and linear fields if above condition fails
                    else {
                      setTimeout(() => setSelectValues(selectJson), 1000);
                      setApiTestState(apiResponse);
                    }
                  }

                  //setApiTestState(apiResponse);
                  setFormikInitializeState(true);
                }
              }

              if (k === "licenseTable") {
                let apiResponseArray = [];
                respData[k].forEach((js) => {
                  const newJson = convertToDateObj(js);
                  console.log("Add a facility licenseTable newJson;", newJson);
                  apiResponseArray.push(newJson);
                  // setLicenseTableRowsData([...licenseTableRowsData,newJson]);
                });
                setLicenseTableRowsData(apiResponseArray);
              }

              if (k === "locationTable") {
                // respData[k].forEach((js) => {
                //     const newJson = convertToDateObj(js);
                //     setLocationTableRowsData([...locationTableRowsData,newJson]);
                // });
                // //setLocationTableRowsData(...locationTableRowsData,respData[k]);
                let apiResponseArray = [];
                respData[k].forEach((js) => {
                  const apiResponse = js;
                  if (apiResponse.hasOwnProperty("electronicHealthRecord")) {
                    if (apiResponse.electronicHealthRecord === "Y") {
                      apiResponse.electronicHealthRecord = {
                        label: "Yes",
                        value: apiResponse.electronicHealthRecord,
                      };
                    } else if (apiResponse.electronicHealthRecord === "N") {
                      apiResponse.electronicHealthRecord = {
                        label: "No",
                        value: apiResponse.electronicHealthRecord,
                      };
                    }
                  }
                  if (apiResponse.hasOwnProperty("publicTransportation")) {
                    if (apiResponse.publicTransportation === "Y") {
                      apiResponse.publicTransportation = {
                        label: "Yes",
                        value: apiResponse.publicTransportation,
                      };
                    } else if (apiResponse.publicTransportation === "N") {
                      apiResponse.publicTransportation = {
                        label: "No",
                        value: apiResponse.publicTransportation,
                      };
                    }
                  }
                  if (apiResponse.hasOwnProperty("handicapAccess")) {
                    if (apiResponse.handicapAccess === "Y") {
                      apiResponse.handicapAccess = {
                        label: "Yes",
                        value: apiResponse.handicapAccess,
                      };
                    } else if (apiResponse.handicapAccess === "N") {
                      apiResponse.handicapAccess = {
                        label: "No",
                        value: apiResponse.handicapAccess,
                      };
                    }
                  }
                  if (apiResponse.hasOwnProperty("tddHearing")) {
                    if (apiResponse.tddHearing === "Y") {
                      apiResponse.tddHearing = {
                        label: "Yes",
                        value: apiResponse.tddHearing,
                      };
                    } else if (apiResponse.tddHearing === "N") {
                      apiResponse.tddHearing = {
                        label: "No",
                        value: apiResponse.tddHearing,
                      };
                    }
                  }
                  if (apiResponse.hasOwnProperty("telemedicine")) {
                    if (apiResponse.telemedicine === "Y") {
                      apiResponse.telemedicine = {
                        label: "Yes",
                        value: apiResponse.telemedicine,
                      };
                    } else if (apiResponse.telemedicine === "N") {
                      apiResponse.telemedicine = {
                        label: "No",
                        value: apiResponse.telemedicine,
                      };
                    }
                  }

                  //Added by Nidhi Gupta on 11/10/2023
                  if (apiResponse.hasOwnProperty("languages")) {
                    if(apiResponse.languages !== ''){
                    apiResponse.languages = apiResponse.languages
                      .split(",")
                      .map((ele) => {
                        return { label: ele, value: ele };
                      });
                    }
                    else{
                      apiResponse.languages = [];
                    }
                  }
                  //Till here
                  apiResponseArray.push(apiResponse);
                  console.log(
                    "locationTableRowsData apiResponse: ",
                    apiResponse
                  );
                });
                setLocationTableRowsData(apiResponseArray);
              }

              if (k === "payToTable") {
                let apiResponseArray = [];
                respData[k].forEach((js) => {
                  const newJson = convertToDateObj(js);
                  console.log("Add a facility payToTable newJson;", newJson);
                  apiResponseArray.push(newJson);
                  // setPayToTableRowsData([...payToTableRowsData,newJson]);
                });
                setPayToTableRowsData(apiResponseArray);
              }

              if (k === "specialityTable") {
                // respData[k].forEach((js) => {
                //     const newJson = convertToDateObj(js);
                //     setspecialityTableRowsData([...specialityTableRowsData,newJson]);
                // });
                let apiResponseArray = [];
                respData[k].forEach((js) => {
                  const apiResponse = js;
                  if (apiResponse.hasOwnProperty("boardCerti")) {
                    if (apiResponse.boardCerti === "Y") {
                      apiResponse.boardCerti = {
                        label: "Yes",
                        value: apiResponse.boardCerti,
                      };
                    } else if (apiResponse.boardCerti === "N") {
                      apiResponse.boardCerti = {
                        label: "No",
                        value: apiResponse.boardCerti,
                      };
                    }
                  }
                  if (apiResponse.hasOwnProperty("specPrimary")) {
                    if (apiResponse.specPrimary === "Y") {
                      apiResponse.specPrimary = {
                        label: "Yes",
                        value: apiResponse.specPrimary,
                      };
                    } else if (apiResponse.specPrimary === "N") {
                      apiResponse.specPrimary = {
                        label: "No",
                        value: apiResponse.specPrimary,
                      };
                    }
                  }
                  if (apiResponse.hasOwnProperty("pcp")) {
                    if (apiResponse.pcp === "Y") {
                      apiResponse.pcp = {
                        label: "Yes",
                        value: apiResponse.pcp,
                      };
                    } else if (apiResponse.pcp === "N") {
                      apiResponse.pcp = { label: "No", value: apiResponse.pcp };
                    }
                  }
                  apiResponseArray.push(apiResponse);
                  console.log(
                    "specialityTableRowsData apiResponse: ",
                    apiResponse
                  );
                });
                setspecialityTableRowsData(apiResponseArray);
              }

              if (k === "insuranceTable") {
                let apiResponseArray = [];
                respData[k].forEach((js) => {
                  const newJson = convertToDateObj(js);
                  console.log(
                    "Add a facility insuranceTable newJson;",
                    newJson
                  );
                  apiResponseArray.push(newJson);
                  // setInsuranceTableRowsData([...insuranceTableRowsData,newJson]);
                });
                setInsuranceTableRowsData(apiResponseArray);
              }
              if (k === "credentialTable") {
                // respData[k].forEach((js) => {
                //     const newJson = convertToDateObj(js);
                //     setCredentialTableRowsData([...credentialTableRowsData,newJson]);
                // });
                let apiResponseArray = [];
                respData[k].forEach((js) => {
                  const apiResponse = js;
                  if (apiResponse.hasOwnProperty("status")) {
                    if (apiResponse.status === "Y") {
                      apiResponse.status = {
                        label: "Yes",
                        value: apiResponse.status,
                      };
                    } else if (apiResponse.status === "N") {
                      apiResponse.status = {
                        label: "No",
                        value: apiResponse.status,
                      };
                    }
                  }
                  apiResponseArray.push(apiResponse);
                  console.log(
                    "credentialTableRowsData apiResponse: ",
                    apiResponse
                  );
                });
                setCredentialTableRowsData(apiResponseArray);
              }

              //Added by Nidhi on 3/27/2023
              if (k === "additionalQuesGrid") {
                console.log("additionalQuesValues k: ", additionalQuesValues);
                const masterMap = new Map(
                  additionalQuesValues.map((obj) => [obj.questionId, obj.label])
                );

                console.log("masterMap newJson:", masterMap);
                let caseID = 0;

                respData[k].forEach((js) => {
                  const newJson = convertToDateObj(js);
                  newJson.label = masterMap.get(Number(newJson.questionId)); //if we will give key it will give value , key-quesid, value-desc, label=desc
                  //Added by Nidhi Gupta on 05/16/2023
                  newJson.response = {
                    label: newJson.response,
                    value: newJson.response,
                  };
                  //Till here
                  console.log("additionalQuesGrid newJson:", newJson);
                  quesAnsList.push(newJson);
                  caseID = newJson.caseNumber;

                  // quesJson.push(newJson);
                  // setQuesJson(quesJson)
                  // console.log("additionalQuesGrid quesJson :", quesJson);

                  //setAdditionalQuesRowsData([...additionalQuesRowsData,newJson]);
                  //console.log("additionalQuesRowsData:", additionalQuesRowsData);
                });

                const quesAnsMap = new Map(
                  quesAnsList.map((obj) => [obj.questionId, obj])
                );
                console.log("quesAnsMap: ", quesAnsMap);

                for (const [key, value] of masterMap) {
                  //we need this all the time
                  if (quesAnsMap.get(key.toString()) !== undefined) {
                    console.log("alreadyAdded quesJson :", value);
                  } else {
                    var newJson = {};
                    newJson.questionId = key.toString();
                    newJson.label = value;
                    newJson.response = ""; //Changed by Nidhi Gupta on 5/16/2023
                    newJson.caseNumber = caseID;
                    newJson.rowNumber = key.toString();
                    //Added by NG on 01/23/2024
                    newJson.operation = "I";
                    //Till Here
                    quesAnsList.push(newJson);
                  }
                }

                //quesAnsListJson.push(quesAnsList);
                if (quesAnsList !== undefined && quesAnsList.length > 0) {
                  setQuesAnsListJson(quesAnsList);
                }
              }

              //till here 02
            });

            //Added Newly by Nidhi Gupta on 08/22/2023
            if (prop.state.stageName == "Cred Specialist") {
              let resJson = {};
              customAxios
                .get(
                  `/fetchPotentialDuplicate?legalEntityName=${prop.state.dbaName}&strRouteTo=${prop.state.stageName}&caseNumber=${prop.state.caseNumber}&transactionType=${AddFacilityAncillary.displayName}`,
                  { headers: { Authorization: `Bearer ${token}` } }
                )
                .then((res) => {
                  resJson = { ...res };
                  console.log("resJson: ", resJson);
                  if (res.status === 200) {
                    console.log("FindDuplicateProc executed successully");
                    let getApiJson = {};
                    console.log(
                      "prop.state.caseNumber 571: ",
                      prop.state.caseNumber
                    );
                    getApiJson["tableNames"] =
                      getTableDetails()["provPotentialDuplicate"];
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
                })
                .catch((err) => {
                  console.log(
                    "Caught in fetch potential duplicate api call: ",
                    err.message
                  );
                  alert("Error occured in finding potenial duplicate.");
                  setButtonDisableFlag(false);
                });
            }
            console.log("potentialDupData 1205: ", potentialDupData);
            //Till Here

            // if(true)
            // {handleTabSelect("Compensation")}
          }
        })
        .catch((err) => {
          console.log(err.message);
        });

      console.log("getApiJson: ", getApiJson);

      //}
    }

    formName.current = AddFacilityAncillary.displayName;

    let selectJson = {};
    let additionalQuesValues = [];
    let newArr = [];
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

    if (mastersSelector.hasOwnProperty("masterGridLicenseType")) {
      let licenseTypeOptions =
        mastersSelector["masterGridLicenseType"].length === 0
          ? []
          : mastersSelector["masterGridLicenseType"][0];

          for (const item of licenseTypeOptions) {
            newArr.push(convertToCase(item.licenseType));
          }

          selectJson.licenseTypeOptions = newArr;
          newArr = [];
    }

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

    if (mastersSelector.hasOwnProperty("masterLicenseType")) {
      selectJson.typeOptions =
        mastersSelector["masterLicenseType"].length === 0
          ? []
          : mastersSelector["masterLicenseType"][0].data;
    }

    if (mastersSelector.hasOwnProperty("masterSpeciality")) {
      selectJson.specialtyOptions =
        mastersSelector["masterSpeciality"].length === 0
          ? []
          : mastersSelector["masterSpeciality"][0];
    }

    if (mastersSelector.hasOwnProperty("masterGraduateType")) {
      selectJson.degreeOptions =
        mastersSelector["masterGraduateType"].length === 0
          ? []
          : mastersSelector["masterGraduateType"][0];
    }

    if (mastersSelector.hasOwnProperty("masterDocumentList")) {
      let documentOptions =
        mastersSelector["masterDocumentList"].length === 0
          ? []
          : mastersSelector["masterDocumentList"][0];

          for (const item of documentOptions) {
            newArr.push(convertToCase(item.docList));
          }

          selectJson.documentOptions = newArr;
          newArr = [];
    }
    if (mastersSelector.hasOwnProperty("masterAdditionalQues")) {
      selectJson.additionalQues =
        mastersSelector["masterAdditionalQues"].length === 0
          ? []
          : mastersSelector["masterAdditionalQues"][0];
    }
    if (mastersSelector.hasOwnProperty("masterTaxonomyCode")) {
      selectJson.taxonomyOptions =
        mastersSelector["masterTaxonomyCode"].length === 0
          ? []
          : mastersSelector["masterTaxonomyCode"][0];
    }

    if (prop.state.formView === "HomeView") {
      //const contractArray = mastersSelector['masterProvContLinkData'][0];
      let arr1 = [];
      let arr2 = [];
      const provContLinkData = mastersSelector["masterProvContLinkData"];
      //printConsole("Inside getDashboardData provContLinkData Data: ",provContLinkData);
      if (provContLinkData.length > 0) {
        const contractIdData = provContLinkData[0][0];
        //printConsole("Inside getDashboardData contractIdData Data: ",contractIdData);
        if (contractIdData !== undefined) {
          if (contractIdData.hasOwnProperty("MainTable")) {
            arr1 = contractIdData["MainTable"];
            arr1 = arr1.filter((elem) => elem.StageName !== "Network");
            printConsole("Inside add provider useeffect arr1: ", arr1);
          }

          if (contractIdData.hasOwnProperty("FacAncDetails")) {
            arr2 = contractIdData["FacAncDetails"];
          }
        }
      }
      const contractArray = setContractIdDropDown(arr1, arr2);
      if (contractArray.length > 0) {
        selectJson.contractIdOptions = contractArray;
        printConsole("Contrcat ID Select JSOn: ", selectJson);
        if (contractArray.length === 1) {
          setApiTestState({ ...apiTestState, contractId: contractArray[0] });
        }
      }
    }

    //  if(mastersSelector.hasOwnProperty('masterDecision')){
    //     selectJson.decisionOptions = ((mastersSelector['masterDecision'].length===0) ? [] : (mastersSelector['masterDecision'][0].data));
    //  }

    if (prop.state.formView !== "DashboardView") {
      // setApiTestState(initState);
      // setFormikInitializeState(true);
      setTimeout(() => setSelectValues(selectJson), 1000);
    }

    // setTimeout( () => {console.log('selectLicenseJson: ', selectLicenseJson);setSelectLicenseGridValues(selectLicenseJson)}, 1000);

    // console.log("select grid vaLue: " , selectLicenseGridValues )
    //console.log("select ref outside: ",selectValues);

    //Added by Nidhi
    selectJson["additionalQues"]
      .filter(
        (data) =>
          data?.TransactionType?.toLowerCase() ==
          formName?.current?.toLowerCase()
      )
      .map((val) =>
        additionalQuesValues.push({
          questionId: val.QuestionId,
          label: val.QuesDescription,
        })
      );
    printConsole("additionalQuesValues here: ", additionalQuesValues);
    //console.log("selectValues.additionalQues: ", selectValues.additionalQues)

    setTimeout(() => {
      //setAddQuesValues(additionalQuesValues);
      if (quesAnsList === undefined || quesAnsList.length <= 0) {
        setQuesAnsListJson(additionalQuesValues);
        console.log("setTimeout setQuesAnsListJson: ", additionalQuesValues);
      }

      //console.log('setTimeout setAddQuesValues: ', additionalQuesValues)
    }, 1000);

    return () => {
      //setApiTestState(initState);
      console.log("UNMOUNT");
    };
  }, []);

  const convertToDateObj = (jsonObj) => {
    const jsonKeys = Object.keys(jsonObj);
    jsonKeys.forEach((elem) => {
      if (elem.includes("#date")) {
        const date = new Date(getDatePartOnly(jsonObj[elem]));
        const oldKey = elem;
        const newKey = elem.split("#")[0];
        jsonObj = renameKey(jsonObj, oldKey, newKey);
        jsonObj[newKey] = date;
      }
    });
    //console.log("Converted JSON: ",jsonObj);
    return jsonObj;
  };

  const gridDataRef = useRef({});

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

    console.log(
      "Inside gridRowsFinalSubmit gridFieldTempState Value ====  ",
      gridFieldTempState
    );
    let clonedJson = { ...gridFieldTempState };
    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "LicenseTable") {
        let indexJson = licenseTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          licenseTableRowsData[index] = clonedJson;
          setLicenseTableRowsData(licenseTableRowsData);
        }
      }

      if (triggeredFormName === "SpecialityTable") {
        let indexJson = specialityTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          specialityTableRowsData[index] = clonedJson;
          setspecialityTableRowsData(specialityTableRowsData);
        }
      }

      if (triggeredFormName === "LocationTable") {
        let indexJson = locationTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
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
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          locationTableRowsData[index] = clonedJson;
          setLocationTableRowsData(locationTableRowsData);
        }
      }

      if (triggeredFormName === "PayToTable") {
        let indexJson = payToTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          payToTableRowsData[index] = clonedJson;
          setPayToTableRowsData(payToTableRowsData);
        }
      }

      if (triggeredFormName === "InsuranceTable") {
        let indexJson = insuranceTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          insuranceTableRowsData[index] = clonedJson;
          setInsuranceTableRowsData(insuranceTableRowsData);
        }
      }

      if (triggeredFormName === "CredentialTable") {
        let indexJson = credentialTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          credentialTableRowsData[index] = clonedJson;
          setCredentialTableRowsData(credentialTableRowsData);
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
      if (triggeredFormName === "LicenseTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("licenseTable")
          ? [...gridDataRef.current.licenseTable]
          : [];
        gridRowJson = { ...licenseTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.licenseTable = getGridDataValues(gridRowArray);
        }

        console.log("gridDataRef.current: ", gridDataRef.current);
      }

      if (triggeredFormName === "LocationTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("locationTable")
          ? [...gridDataRef.current.locationTable]
          : [];
        gridRowJson = { ...locationTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.locationTable = getGridDataValues(gridRowArray);
        }
        console.log("gridDataRef.current: ", gridDataRef.current);
      }

      if (triggeredFormName === "PayToTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("payToTable")
          ? [...gridDataRef.current.payToTable]
          : [];
        gridRowJson = { ...payToTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.payToTable = getGridDataValues(gridRowArray);
        }
        console.log("gridDataRef.current: ", gridDataRef.current);
      }

      if (triggeredFormName === "SpecialityTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("specialityTable")
          ? [...gridDataRef.current.specialityTable]
          : [];
        gridRowJson = { ...specialityTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.specialityTable = getGridDataValues(gridRowArray);
        }
        console.log("gridDataRef.current: ", gridDataRef.current);
      }

      if (triggeredFormName === "InsuranceTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("insuranceTable")
          ? [...gridDataRef.current.insuranceTable]
          : [];
        gridRowJson = { ...insuranceTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.insuranceTable = getGridDataValues(gridRowArray);
        }
        console.log("gridDataRef.current: ", gridDataRef.current);
      }

      if (triggeredFormName === "CredentialTable") {
        console.log(
          "Grid data ref current for credential===== ",
          gridDataRef.current.credentialTable
        );
        gridRowArray = gridDataRef.current.hasOwnProperty("credentialTable")
          ? [...gridDataRef.current.credentialTable]
          : [];
        gridRowJson = { ...credentialTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.credentialTable = getGridDataValues(gridRowArray);
        }
        console.log(
          "gridDataRef.current for credential: ",
          gridDataRef.current
        );
      }

      /////
      if (triggeredFormName === "FIRLTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty(
          "SelfServ_HospitalComp_Grid"
        )
          ? [...gridDataRef.current.SelfServ_HospitalComp_Grid]
          : [];
        gridRowJson = { ...firlTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.SelfServ_HospitalComp_Grid =
            getGridDataValues(gridRowArray);
        }
        console.log(
          "Inside gridRowsFinalSubmit gridDataRef.current FIRLTable: ",
          gridDataRef.current
        );
      }
      if (triggeredFormName === "CompensationTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty(
          "SelfServ_ProviderComp_Grid"
        )
          ? [...gridDataRef.current.SelfServ_ProviderComp_Grid]
          : [];
        gridRowJson = { ...compensationTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.SelfServ_ProviderComp_Grid =
            getGridDataValues(gridRowArray);
        }
        console.log(
          "Inside gridRowsFinalSubmit gridDataRef.current CompensationTable: ",
          gridDataRef.current
        );
      }
    }
    //Handling For Portal and DashboardHomeView Side grids Save&Close
    /*if (triggeredFormName === "CredentialTable") {
        finalGridSaveDataRef.current[triggeredFormName] = [...credentialTableRowsData];
      }*/
  };

  //Commented By Harshit
  // const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
  //   console.log("Inside gridRowsFinalSubmit with view: ", tabRef);
  //   if (tabRef.current === "DashboardView") {
  //     //let gridRow = getGridDataArray(triggeredFormName);
  //     //console.log('gridRowsFinalSubmit gridRow: ',gridRow);
  //     let oprtn;
  //     let gridRowJson = {};
  //     //alert('Operation type: ',operationType);
  //     console.log("Operation type: ", operationType);
  //     if (operationType === "Add") {
  //       oprtn = "I";
  //     }

  //     if (operationType === "Edit") {
  //       oprtn = "U";
  //     }

  //     if (operationType === "Delete") {
  //       oprtn = "D";
  //     }
  //     let gridRowArray = [];
  //     if (triggeredFormName === "LicenseTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("licenseTable")
  //         ? [...gridDataRef.current.licenseTable]
  //         : [];
  //       gridRowJson = { ...licenseTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.licenseTable = getGridDataValues(gridRowArray);

  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }

  //     if (triggeredFormName === "LocationTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("locationTable")
  //         ? [...gridDataRef.current.locationTable]
  //         : [];
  //       gridRowJson = { ...locationTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.locationTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }

  //     if (triggeredFormName === "PayToTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("payToTable")
  //         ? [...gridDataRef.current.payToTable]
  //         : [];
  //       gridRowJson = { ...payToTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.payToTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }

  //     if (triggeredFormName === "SpecialityTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("specialityTable")
  //         ? [...gridDataRef.current.specialityTable]
  //         : [];
  //       gridRowJson = { ...specialityTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.specialityTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }
  //     if (triggeredFormName === "InsuranceTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("insuranceTable")
  //         ? [...gridDataRef.current.insuranceTable]
  //         : [];
  //       gridRowJson = { ...insuranceTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.insuranceTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }
  //     if (triggeredFormName === "CredentialTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("credentialTable")
  //         ? [...gridDataRef.current.credentialTable]
  //         : [];
  //       gridRowJson = { ...credentialTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.credentialTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }

  //       ////Added by Nidhi Gupta on 10/10/2023
  //       if(triggeredFormName === 'FIRLTable'){
  //         gridRowArray = (gridDataRef.current.hasOwnProperty('SelfServ_HospitalComp_Grid'))
  //          ? [...gridDataRef.current.SelfServ_HospitalComp_Grid]
  //          : [];
  //         gridRowJson = {...firlTableRowsData[index]};
  //         gridRowJson['operation'] = oprtn;
  //         gridRowArray.push(gridRowJson);
  //         gridDataRef.current.SelfServ_HospitalComp_Grid = getGridDataValues(gridRowArray);
  //         console.log("Inside gridRowsFinalSubmit gridDataRef.current FIRLTable: ",gridDataRef.current);
  //     }
  //     if(triggeredFormName === 'CompensationTable'){
  //         gridRowArray = (gridDataRef.current.hasOwnProperty('SelfServ_ProviderComp_Grid'))
  //          ? [...gridDataRef.current.SelfServ_ProviderComp_Grid]
  //          : [];
  //         gridRowJson = {...compensationTableRowsData[index]};
  //         gridRowJson['operation'] = oprtn;
  //         gridRowArray.push(gridRowJson);
  //         gridDataRef.current.SelfServ_ProviderComp_Grid = getGridDataValues(gridRowArray);
  //         console.log("Inside gridRowsFinalSubmit gridDataRef.current CompensationTable: ",gridDataRef.current);
  //     }

  //       ////Till Here
  //   }
  // };

  const editTableRows = (index, triggeredFormName) => {
    console.log("Inside editTableRows: ", triggeredFormName);
    let rowInput = {};
    if (triggeredFormName === "LicenseTable") {
      rowInput = licenseTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "SpecialityTable") {
      rowInput = specialityTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "LocationTable") {
      rowInput = locationTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "PayToTable") {
      rowInput = payToTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "InsuranceTable") {
      rowInput = insuranceTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "CredentialTable") {
      rowInput = credentialTableRowsData[index];
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

  const addTableRows = (triggeredFormName, index) => {
    // fetchAutoPopulate.current=false;
    // console.log("rowData: ",specialityTableRowsData);
    let rowsInput = {};
    if (triggeredFormName === "SpecialityTable") {
      rowsInput.rowNumber = specialityTableRowsData.length + 1;
      //setspecialityTableRowsData([...specialityTableRowsData, rowsInput]);
      // console.log("SpecialityTable Last added row: ",specialityTableRowsData[specialityTableRowsData.length-1]);
    }

    if (triggeredFormName === "LicenseTable") {
      rowsInput.rowNumber = licenseTableRowsData.length + 1;
      //setLicenseTableRowsData([...licenseTableRowsData, rowsInput]);
    }

    if (triggeredFormName === "LocationTable") {
      rowsInput.rowNumber = locationTableRowsData.length + 1;
      //setLocationTableRowsData([...locationTableRowsData, rowsInput]);
    }

    if (triggeredFormName === "PayToTable") {
      rowsInput.rowNumber = payToTableRowsData.length + 1;
      //setPayToTableRowsData([...payToTableRowsData, rowsInput]);
    }

    if (triggeredFormName === "InsuranceTable") {
      rowsInput.rowNumber = insuranceTableRowsData.length + 1;
      //setInsuranceTableRowsData([...insuranceTableRowsData, rowsInput]);
    }
    if (triggeredFormName === "CredentialTable") {
      rowsInput.rowNumber = credentialTableRowsData.length + 1;
      //setCredentialTableRowsData([...credentialTableRowsData, rowsInput]);
    }
    ////Added by Nidhi Gupta on 10/10/2023
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
    ////Till Here
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
      gridRowsFinalSubmit(triggeredFormName, index, "Delete");
      if (triggeredFormName === "SpecialityTable") {
        const rows = [...specialityTableRowsData];
        rows.splice(index, 1);
        setspecialityTableRowsData(rows);
      }

      if (triggeredFormName === "LicenseTable") {
        const rows = [...licenseTableRowsData];
        rows.splice(index, 1);
        setLicenseTableRowsData(rows);
      }

      if (triggeredFormName === "LocationTable") {
        const rows = [...locationTableRowsData];
        rows.splice(index, 1);
        setLocationTableRowsData(rows);
      }

      if (triggeredFormName === "PayToTable") {
        const rows = [...payToTableRowsData];
        rows.splice(index, 1);
        setPayToTableRowsData(rows);
      }

      if (triggeredFormName === "InsuranceTable") {
        const rows = [...insuranceTableRowsData];
        rows.splice(index, 1);
        setInsuranceTableRowsData(rows);
      }
      if (triggeredFormName === "CredentialTable") {
        const rows = [...credentialTableRowsData];
        rows.splice(index, 1);
        setCredentialTableRowsData(rows);
      }
      ////Added by Nidhi Gupta on 10/10/2023
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
      ////Till Here
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
    console.log("Inside handleGridFieldChange: ", value);
    if(triggeredFormName === 'PayToTable')
    {
      if(name === 'payToNpi'|| name === 'zipCode'){
       value = acceptNumbersOnly(value);
       console.log("inside condition",value);
      }
     }
     if(triggeredFormName === 'LocationTable')
    {
      if(name === 'npi'|| name === 'zipCode'){
       value = acceptNumbersOnly(value);
       console.log("inside condition",value);
      }
     }
    tempInput[name] = value.toUpperCase();
    setGridFieldTempState(tempInput);
  };

  //commented by Harshit
  // const handleGridFieldChange = (index, evnt, triggeredFormName) => {
  //   console.log("Inside handleGridFieldChange: ", triggeredFormName);
  //   let rowsInput = "";
  //   let { name, value } = evnt.target;
  //   if (triggeredFormName === "LicenseTable") {
  //     //console.log('Inside LicenseTable');
  //     rowsInput = [...licenseTableRowsData];
  //   }
  //   if (triggeredFormName === "SpecialityTable") {
  //     //console.log('Inside SpecialityTable');
  //     rowsInput = [...specialityTableRowsData];
  //   }

  //   if (triggeredFormName === "LocationTable") {
  //     //console.log('Inside LicenseTable');
  //     rowsInput = [...locationTableRowsData];
  //   }

  //   if (triggeredFormName === "PayToTable") {
  //     //console.log('Inside LicenseTable');
  //     rowsInput = [...payToTableRowsData];
  //   }

  //   if (triggeredFormName === "InsuranceTable") {
  //     //console.log('Inside InsuranceTable');
  //     rowsInput = [...insuranceTableRowsData];
  //   }
  //   if (triggeredFormName === "CredentialTable") {
  //     //console.log('Inside CredentialTable');
  //     rowsInput = [...credentialTableRowsData];
  //   }
  //     ////Added by Nidhi Gupta on 10/10/2023
  //     if(triggeredFormName === 'FIRLTable'){
  //       //console.log('Inside FIRLTable');
  //       rowsInput = [...firlTableRowsData];
  //     }
  //      if(triggeredFormName === 'CompensationTable'){
  //       //console.log('Inside FIRLTable');
  //       rowsInput = [...compensationTableRowsData];
  //       }
  //     ////Till Here

  //   //console.log('Inside handleGridFieldChange: ',rowsInput);
  //   value = value.toUpperCase();
  //   rowsInput[index][name] = value;
  //   if (triggeredFormName === "LicenseTable") {
  //     setLicenseTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "SpecialityTable") {
  //     setspecialityTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "LocationTable") {
  //     setLocationTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "PayToTable") {
  //     setPayToTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "InsuranceTable") {
  //     const regex = /^[0-9\b.]+$/;
  //     //rowsInput = [...insuranceTableRowsData];
  //     if (name === "covAmount" || name === "covAmountAgg") {
  //       let newVal = value;
  //       // console.log("Inside InsuranceTable if: ",name);
  //       // console.log("Inside InsuranceTable if value entered: ",value);
  //       // console.log("Inside InsuranceTable if rowsinput  value: ",rowsInput[index][name]);
  //       if (value === "" || regex.test(value)) {
  //         console.log("Inside InsuranceTable second if: ", value);
  //         let containsDot = newVal.substring(0, newVal.length - 1);
  //         if (containsDot === "." && !rowsInput[index][name].includes(".")) {
  //           rowsInput[index][name] = value;
  //         } else {
  //           rowsInput[index][name] = value;
  //         }
  //       } else {
  //         // console.log("Inside InsuranceTable else value entered: ",newVal);
  //         // console.log("Inside InsuranceTable else rowsinput  value: ",rowsInput[index][name]);
  //         newVal = newVal.substring(0, newVal.length - 1);
  //         rowsInput[index][name] = newVal;
  //         //console.log("Inside regex not match else: ",rowsInput);
  //       }
  //     }
  //     setInsuranceTableRowsData(rowsInput);
  //   }

  //   /*if(triggeredFormName === 'InsuranceTable'){
  //           setInsuranceTableRowsData(rowsInput);
  //       }*/

  //   ////Added by Nidhi Gupta on 10/10/2023
  //   rowsInput[index][name] = value;
  //   if(triggeredFormName === 'FIRLTable'){
  //       setFirlTableRowsData(rowsInput);
  //   }
  //   if(triggeredFormName === 'CompensationTable'){
  //       setCompensationTableRowsData(rowsInput);
  //   }

  //   ////Till Here
  // };

  const handleGridOnBlur = (index, evnt, triggeredFormName) => {
    //console.log("Inside handleGridOnBlur: ", triggeredFormName);
    let rowsInput = {};
    const { name, value } = evnt.target;

    if (triggeredFormName === "SpecialityTable") {
      //rowsInput = [...specialityTableRowsData];
      if (value !== "" && value !== undefined) {
        // console.log("Inside handleOnBlur value: ", value);
        // console.log(
        //   "Inside handleOnBlur taxonomyOptions: ",
        //   selectValues.taxonomyOptions
        // );
        if (selectValues.taxonomyOptions.length > 0) {
          const foundOption = selectValues.taxonomyOptions.find(
            (option) => option.TAXONOMYCODE === value
          );
          //console.log("Inside handleOnBlur foundOption: ", foundOption);
          if (
            foundOption !== undefined &&
            "TAXONOMYDESC" in foundOption &&
            foundOption.TAXONOMYDESC !== "" &&
            foundOption.TAXONOMYDESC !== undefined
          ) {
            // console.log(
            //   "Inside handleOnBlur foundOption if: ",
            //   rowsInput[index]["taxonomyDesc"]
            // );
            //console.log("gridFieldTempState Nidhi: ", gridFieldTempState);
            rowsInput = { ...gridFieldTempState };
            rowsInput["taxonomyDesc"] = foundOption.TAXONOMYDESC;
          } else {
            alert("Please enter valid Taxonomy Code");
            rowsInput["taxonomyDesc"] = "";
            rowsInput["taxonomyCode"] = "";
            //rowsInput[index]['taxonomyDesc'] = undefined;
          }
          if (
            foundOption !== undefined &&
            "TAXONOMYGRP" in foundOption &&
            foundOption.TAXONOMYGRP !== undefined
          ) {
            rowsInput["taxonomyGrp"] = foundOption.TAXONOMYGRP;
          } else {
            //alert("Please enter valid Taxonomy Code");
            rowsInput["taxonomyCode"] = "";
            rowsInput["taxonomyGrp"] = "";
          }
          //console.log("rowsInput Nidhi: ", rowsInput);
          //  setGridFieldTempState(rowsInput);
        }
      } else {
        alert(
          "Please fill Taxonomy Code to populate Taxonomy Description and Taxonomy Group"
        );
        rowsInput["taxonomyDesc"] = "";
        rowsInput["taxonomyGrp"] = "";
        //setGridFieldTempState(rowsInput);
      }
      setGridFieldTempState({ ...gridFieldTempState, ...rowsInput });
    }
  };
  //08/22/2023
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
  //Till here

  const handleLinearSelectChange = (selectValue, evnt, setFieldValue) => {
    console.log("SS handleLinear", selectValue, apiTestState, setFieldValue);
    const { name } = evnt;
    if (formikInitializeState) {
      setFormikInitializeState(false);
    }

    //apiTestState = {...values};
    let val = selectValue;
    if (evnt.action === "clear") {
      //printConsole('Inside selectvalue null before delete: ',rowsInput[index]);
      //delete rowsInput[index][name];
      if (name.toLowerCase() === "states") {
        val = [];
      } else {
        val = { label: "", value: "" };
      }
    }

    if (setFieldValue !== undefined) {
      setFieldValue(name, val);
    }

    setApiTestState({ ...apiTestState, [name]: val });
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
      //Changed by NG on 11/29/2023
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

    if (triggeredFormName === "SpecialityTable") {
      //Added Newly by Nidhi Gupta on 11/14/2023
      //Making subSpeciality dropdown reset whenever speciality changing
      if (evnt.name == "speciality") {
        rowsInput["subSpeciality"] = { label: "", value: "" };
      }
      if (evnt.action === "clear" && evnt.name == "speciality") {
        printConsole("Inside selectvalue null before deleteeeee: ", evnt);
        rowsInput["hsdCode"] = "";
        setSubSpecialityOptions([{ label: "", value: "" }]);
      }
      if (
        evnt.name == "speciality" &&
        selectValues.specialtyOptions &&
        selectValues.specialtyOptions.length > 0 &&
        selectedValue
      ) {
        console.log("Inside select change heloooooo");
        const foundOption = selectValues.specialtyOptions.find(
          (option) => option.speciality === selectedValue.value
        );
        console.log("Inside select change foundOption: ", foundOption);
        if (
          foundOption !== undefined &&
          "hsdCodeValue" in foundOption &&
          foundOption.hsdCodeValue !== null &&
          foundOption.hsdCodeValue !== undefined
        ) {
          console.log(
            "Inside select change foundOption if: ",
            rowsInput["hsdCode"]
          );
          console.log(
            "Inside select change foundOption.hsdCodeValue: ",
            foundOption.hsdCodeValue
          );
          rowsInput["hsdCode"] = foundOption.hsdCodeValue;
        } else {
          // alert("Corresponding HSD Code not found.");
          // delete rowsInput[index]['hsdCode'] ;
          rowsInput["hsdCode"] = "";
        }
        const subSpecialityValues = selectValues.specialtyOptions
          .filter((el) => el.speciality === selectedValue.value)
          .map((elem) => {
            return { label: elem.subSpeciality, value: elem.subSpeciality };
          });
        console.log(
          "Inside select change subSpecialityValues",
          subSpecialityValues
        );
        setSubSpecialityOptions(subSpecialityValues);
      }
      //Till here
    }
    setGridFieldTempState(rowsInput);
  };

  //Commented By Harshit
  // const handleGridSelectChange = (
  //   index,
  //   selectedValue,
  //   evnt,
  //   triggeredFormName
  // ) => {
  //   console.log("Inside select change trigeredFormName: ", triggeredFormName);
  //   let rowsInput = "";
  //   const { name } = evnt;
  //   if (triggeredFormName === "SpecialityTable") {
  //     //console.log('Inside SpecialityTable');
  //     rowsInput = [...specialityTableRowsData];
  //   }
  //   if (triggeredFormName === "LicenseTable") {
  //     //console.log('Inside LicenseTable');
  //     rowsInput = [...licenseTableRowsData];
  //   }
  //   if (triggeredFormName === "LocationTable") {
  //     //console.log('Inside LocationTable');
  //     rowsInput = [...locationTableRowsData];
  //   }
  //   if (triggeredFormName === "PayToTable") {
  //     //console.log('Inside PayToTable');
  //     rowsInput = [...payToTableRowsData];
  //   }
  //   if (triggeredFormName === "InsuranceTable") {
  //     //console.log('Inside InsuranceTable');
  //     rowsInput = [...insuranceTableRowsData];
  //   }
  //   if (triggeredFormName === "CredentialTable") {
  //     //console.log('Inside CredentialTable');
  //     rowsInput = [...credentialTableRowsData];
  //   }

  //    ////Added by Nidhi Gupta on 10/10/2023
  //    if(triggeredFormName === 'FIRLTable'){
  //     //console.log('Inside FIRLTable');
  //     rowsInput = [...firlTableRowsData];
  // }
  // if(triggeredFormName === 'CompensationTable'){
  //     //console.log('Inside CompensationTable');
  //     rowsInput = [...compensationTableRowsData];
  // }

  //   ////Till Here

  //   //console.log("Inside select change event: ",rowsInput);
  //     //rowsInput[index][name] = selectedValue;
  //     let val = selectedValue;
  //   if(evnt.action==='clear'){
  //     //printConsole('Inside selectvalue null before delete: ',rowsInput[index]);
  //     //delete rowsInput[index][name];
  //     val = {label:'',value:''};
  //     //printConsole('Inside selectvalue null after delete: ',rowsInput[index]);
  //   }
  //   else{
  //     val = {label:selectedValue.value.toUpperCase(),value:selectedValue.value.toUpperCase()}
  //   }

  //   console.log("Inside handleSelectChange Val: ",val);

  //   rowsInput[index][name] = val

  //   //console.log("rowsInput: ",rowsInput);
  //   if (triggeredFormName === "SpecialityTable") {
  //        //Added Newly by Nidhi Gupta on 05/22/2023

  //       //  console.log('Inside select change specialtyOptions: ',selectValues.specialtyOptions);
  //       //  console.log("Inside select change evnt.name: ",evnt.name);
  //        if(evnt.name=='speciality' &&
  //        selectValues.specialtyOptions &&
  //        selectedValue!==null &&
  //        selectValues.specialtyOptions.length>0){

  //            const foundOption = selectValues.specialtyOptions.find(option => option.speciality === selectedValue.value);
  //            console.log('Inside select change foundOption: ',foundOption);
  //            if((foundOption!==undefined) && ('hsdCodeValue' in foundOption) && (foundOption.hsdCodeValue!==null) && (foundOption.hsdCodeValue!==undefined)) {
  //                console.log('Inside select change foundOption if: ',rowsInput[index]['hsdCode']);
  //                console.log('Inside select change foundOption.hsdCodeValue: ',foundOption.hsdCodeValue);
  //                rowsInput[index]['hsdCode'] = foundOption.hsdCodeValue;
  //            }
  //            else{
  //                // alert("Corresponding HSD Code not found.");
  //                // delete rowsInput[index]['hsdCode'] ;
  //                rowsInput[index]['hsdCode'] = '';
  //            }
  //            const subSpecialityValues = selectValues.specialtyOptions
  //            .filter((el) =>el.speciality === selectedValue.value)
  //            .map(elem =>{return {label: elem.subSpeciality,value: elem.subSpeciality};
  //           });
  //              console.log("Inside select change subSpecialityValues" , subSpecialityValues);
  //              setSubSpecialityOptions(subSpecialityValues);
  //            setspecialityTableRowsData(rowsInput);
  //        }
  //        //Till here
  //     setspecialityTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "LicenseTable") {
  //     setLicenseTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "LocationTable") {
  //     setLocationTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "PayToTable") {
  //     setPayToTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "InsuranceTable") {
  //     setInsuranceTableRowsData(rowsInput);
  //   }
  //    ////Added by Nidhi Gupta on 10/10/2023
  //    if(triggeredFormName === 'FIRLTable'){
  //     setFirlTableRowsData(rowsInput);
  // }
  // if(triggeredFormName === 'CompensationTable'){
  //     setCompensationTableRowsData(rowsInput);
  // }
  //   ////Till Here
  // };

  const modifyValidatedAddressRow = (index, data) => {
    // setLocationTableRowsData((prev) => {
    //   prev[index] = data;
    //   return prev;
    // });
    setGridFieldTempState(data);
  };

  //Added by Nidhi Gupta
  const modifyValidatedAddressPayToRow = (index, data) => {
    // setPayToTableRowsData((prev) => {
    //   prev[index] = data;
    //   return prev;
    // });
    setGridFieldTempState(data);
  };
  //Till here

  const handleGridDateChange = (
    index,
    selectedValue,
    fieldName,
    triggeredFormName
  ) => {
    // console.log("index: ",index);
    console.log("Inside handleGridDateChange selectValue: ", selectedValue);
    // console.log("fieldName: ",fieldName);
    //const { name } = fieldName;
    console.log("Inside handleGridDateChange name: ", fieldName);
    let tempInput = { ...gridFieldTempState };
    tempInput[fieldName] = selectedValue;
    //console.log("Inside handleGridDateChange tempInput: ",tempInput);
    setGridFieldTempState(tempInput);
  };

  //Commented By Harshit
  // const handleGridDateChange = (
  //   index,
  //   selectedValue,
  //   fieldName,
  //   triggeredFormName
  // ) => {
  //   // console.log("index: ",index);
  //   // console.log("selectValue: ",selectedValue);
  //   // console.log("fieldName: ",fieldName);
  //   const { name } = fieldName;
  //   console.log("name: ", name);
  //   let rowsInput = "";
  //   if (triggeredFormName === "LicenseTable") {
  //     rowsInput = [...licenseTableRowsData];
  //     rowsInput[index][fieldName] = selectedValue;
  //     setLicenseTableRowsData(rowsInput);
  //   }

  //   if (triggeredFormName === "InsuranceTable") {
  //     console.log("Inside if triggeredFormName: ", triggeredFormName);
  //     rowsInput = [...insuranceTableRowsData];
  //     rowsInput[index][fieldName] = selectedValue;
  //     console.log("rowsInput: ", rowsInput);
  //     setInsuranceTableRowsData(rowsInput);
  //   }
  // };

  /* const fieldsOnBlur = (e) => {
    //alert('Inside organization Name handle Blur: ',e);

    if(prop.state.formView === "DashboardHomeView"){
        if(e.target.name === 'legalEntityName'){
            const orgValue = e.target.value;
            printConsole('Inside add provider fields on blur: ',orgValue);
            let arr1 = [];
            let arr2 = [];
            //const provContLinkData = mastersSelector['masterProvContLinkData'];
            const apiOut = getLinkingData(token,'HealthPlan',masterUserName,orgValue.trim());
            printConsole("Inside getDashboardData provContLinkData Data before promise resolve: ",apiOut);
            apiOut.then(function(provContLinkData) {
              printConsole("Inside getDashboardData provContLinkData Data after promise resolve: ",provContLinkData);

              //printConsole("Inside getDashboardData provContLinkData Data: ",provContLinkData);
              if(provContLinkData.length>0){
              const contractIdData = provContLinkData[0];
              //printConsole("Inside getDashboardData contractIdData Data: ",contractIdData);
              if(contractIdData !== undefined){
                  if(contractIdData.hasOwnProperty('MainTable')){
                      arr1 = contractIdData['MainTable'];
                      arr1 = arr1.filter(elem => {
                        if(elem.LegalEntityName !== null && elem.LegalEntityName !== undefined){
                            if((elem.LegalEntityName.localeCompare(orgValue, undefined, { sensitivity: 'accent' })) === 0){
                                return elem.LegalEntityName;
                            }
                        }
                    });
                      //arr1 = arr1.filter(elem => (elem.LegalEntityName === orgValue));
                      printConsole('Inside fieldsOnBlur useeffect arr1: ',arr1);
                  }

                  if(contractIdData.hasOwnProperty('FacAncDetails')){

                      arr2 = contractIdData['FacAncDetails'];
                      arr2 = arr2.filter(elem => {
                        if(elem.name !== null && elem.name !== undefined){
                            if((elem.name.localeCompare(orgValue, undefined, { sensitivity: 'accent' })) === 0){
                                return elem.name;
                            }
                        }
                    });
                      //arr2 = arr2.filter(elem => elem.name === orgValue)
                      printConsole('Inside fieldsOnBlur useeffect arr2: ',arr2);
                  }
              }

              }
              const contractArray = setContractIdDropDown(arr1,arr2);
              let selectJson = {...selectValues};
              let apiTestStateReplica = {...apiTestState};
              if(contractArray.length>0){

                  selectJson.contractIdOptions = contractArray;

                  if(contractArray.length === 1){
                      apiTestStateReplica.contractId = contractArray[0];
                      setApiTestState(apiTestStateReplica);
                  }

              }
              else{
                  if(selectJson.hasOwnProperty('contractIdOptions')){
                      delete selectJson['contractIdOptions'];
                  }
                  if(apiTestStateReplica.hasOwnProperty('contractId')){
                      delete apiTestStateReplica['contractId'];
                  }
              }

              setSelectValues(selectJson);
              setApiTestState(apiTestStateReplica);
          })
            /*const orgVal = e.target.value.trim();
            if(orgVal !== '' && orgVal !== undefined){
                let getApiJson= {};
                getApiJson['tableNames'] = getTableDetails()['provContLinkTable'];
                getApiJson['whereClause'] = {'Legal_Entity_Name':'=~'+orgVal};
                customAxios.post('/generic/get',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
              printConsole('Get data Response for getProvContLinkData: ',res)
              if(res.data.Status === 0){
                  let selectJson = {...selectValues};
                  let apiTestStateReplica = {...apiTestState};
                  const respData = [...res.data.data.provContLinkData];

                  //printConsole('Inside fields on blur contract respData[0]: ',respData[0]);
                  const contractArray = setContractIdDropDown(respData);

                    if(contractArray.length>0){

                        selectJson.contractIdOptions = contractArray;

                        if(contractArray.length === 1){
                            apiTestStateReplica.contractId = contractArray[0];
                            setApiTestState(apiTestStateReplica);
                        }

                    }
                    else{
                        if(selectJson.hasOwnProperty('contractIdOptions')){
                            delete selectJson['contractIdOptions'];
                        }
                        if(apiTestStateReplica.hasOwnProperty('contractId')){
                            delete apiTestStateReplica['contractId'];
                        }
                    }

                    setSelectValues(selectJson);
                    setApiTestState(apiTestStateReplica);


                }
                }).catch((err) => {
                    printConsole('',err.message);
                });
            }
        }

    }

}*/

  let checkStageName = JSON.parse(process.env.REACT_APP_STAGENAME);

  const fieldsOnBlur = (e, values, setFieldValue) => {
    console.log("Inside handle Blur: ", e);
    if (
      prop.state.formView === "DashboardHomeView" ||
      prop.state.formView === "DashboardView"
    ) {
      if (e.target.name === "legalEntityName") {
        const orgValue = e.target.value;
        printConsole("Inside add provider fields on blur: ", orgValue);
        // apiTestState[e.target.name] = orgValue;
        // let formState = Object.assign(apiTestState,values);

        let formState = { ...apiTestState };
        let formikState = { ...values };

        //formState = Object.assign(formState,formikState);
        let finalFormikJson = getJsonFromFormikState(initState, formikState);
        console.log(
          "Inside fields on blur finalFormikJson===== ",
          finalFormikJson
        );
        if (Object.keys(finalFormikJson).length > 0) {
          formState = Object.assign(formState, finalFormikJson);
        }

        // let formState = {...apiTestState};
        console.log("INside fieldsOnBlur===== ", formState);
        populateContractIdDropdown(
          e.target.name,
          e.target.value,
          formState,
          selectValues,
          setFieldValue
        );
      }
    }
  };

  const populateContractIdDropdown = (
    name,
    value,
    inputState,
    selectJson,
    setFieldValue
  ) => {
    console.log("Inside organization Name handle Blur: ", name, value);

    if (
      prop.state.formView === "DashboardHomeView" ||
      !checkStageName.includes(prop.state.stageName)
    ) {
      if (name === "legalEntityName") {
        const orgValue = value;
        printConsole("Inside add provider fields on blur: ", orgValue);
        let arr1 = [];
        let arr2 = [];
        //const provContLinkData = mastersSelector['masterProvContLinkData'];
        const apiOut = getLinkingData(
          token,
          "HealthPlan",
          masterUserName,
          orgValue.trim()
        );
        printConsole(
          "Inside getDashboardData provContLinkData Data before promise resolve: ",
          apiOut
        );
        apiOut.then(function (provContLinkData) {
          printConsole(
            "Inside getDashboardData provContLinkData Data after promise resolve: ",
            provContLinkData
          );

          //printConsole("Inside getDashboardData provContLinkData Data: ",provContLinkData);
          if (provContLinkData.length > 0) {
            const contractIdData = provContLinkData[0];
            //printConsole("Inside getDashboardData contractIdData Data: ",contractIdData);
            if (contractIdData !== undefined) {
              if (contractIdData.hasOwnProperty("MainTable")) {
                arr1 = contractIdData["MainTable"];
                arr1 = arr1.filter((elem) => {
                  if (
                    elem.LegalEntityName !== null &&
                    elem.LegalEntityName !== undefined
                  ) {
                    if (
                      elem.LegalEntityName.localeCompare(orgValue, undefined, {
                        sensitivity: "accent",
                      }) === 0
                    ) {
                      return elem.LegalEntityName;
                    }
                  }
                });
                //arr1 = arr1.filter(elem => (elem.LegalEntityName === orgValue));
                printConsole("Inside fieldsOnBlur useeffect arr1: ", arr1);
              }

              if (contractIdData.hasOwnProperty("FacAncDetails")) {
                arr2 = contractIdData["FacAncDetails"];
                arr2 = arr2.filter((elem) => {
                  if (elem.name !== null && elem.name !== undefined) {
                    if (
                      elem.name.localeCompare(orgValue, undefined, {
                        sensitivity: "accent",
                      }) === 0
                    ) {
                      return elem.name;
                    }
                  }
                });
                //arr2 = arr2.filter(elem => elem.name === orgValue)
                printConsole("Inside fieldsOnBlur useeffect arr2: ", arr2);
              }
            }
          }
          const contractArray = setContractIdDropDown(arr1, arr2);
          // let selectJson = {...selectValues};
          let apiTestStateReplica = { ...inputState };
          if (contractArray.length > 0) {
            selectJson.contractIdOptions = contractArray;

            if (contractArray.length === 1) {
              apiTestStateReplica.contractId = contractArray[0];
              setApiTestState(apiTestStateReplica);
            } else {
              if (apiTestStateReplica.hasOwnProperty("contractId")) {
                apiTestStateReplica["contractId"] = { label: "", value: "" };
              }
            }
          } else {
            if (selectJson.hasOwnProperty("contractIdOptions")) {
              delete selectJson["contractIdOptions"];
            }
            if (apiTestStateReplica.hasOwnProperty("contractId")) {
              // delete apiTestStateReplica['contractId'];
              apiTestStateReplica["contractId"] = { label: "", value: "" };
            }
          }
          apiTestStateReplica[name] = value;
          setSelectValues(selectJson);
          setApiTestState(apiTestStateReplica);

          if (setFieldValue !== undefined) {
            //console.log("Inside fieldsOnBlur name=== ",name+" value==== ",value)
            const contVal = value;
            setFieldValue("contractId", apiTestStateReplica.contractId);
          }
          // setFormikInitializeState(true);
        });
        /*const orgVal = e.target.value.trim();
          if(orgVal !== '' && orgVal !== undefined){
              let getApiJson= {};
              getApiJson['tableNames'] = getTableDetails()['provContLinkTable'];
              getApiJson['whereClause'] = {'Legal_Entity_Name':'=~'+orgVal};
              customAxios.post('/generic/get',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
            printConsole('Get data Response for getProvContLinkData: ',res)
            if(res.data.Status === 0){
                let selectJson = {...selectValues};
                let apiTestStateReplica = {...apiTestState};
                const respData = [...res.data.data.provContLinkData];

                //printConsole('Inside fields on blur contract respData[0]: ',respData[0]);
                const contractArray = setContractIdDropDown(respData);

                  if(contractArray.length>0){

                      selectJson.contractIdOptions = contractArray;

                      if(contractArray.length === 1){
                          apiTestStateReplica.contractId = contractArray[0];
                          setApiTestState(apiTestStateReplica);
                      }

                  }
                  else{
                      if(selectJson.hasOwnProperty('contractIdOptions')){
                          delete selectJson['contractIdOptions'];
                      }
                      if(apiTestStateReplica.hasOwnProperty('contractId')){
                          delete apiTestStateReplica['contractId'];
                      }
                  }

                  setSelectValues(selectJson);
                  setApiTestState(apiTestStateReplica);


              }
              }).catch((err) => {
                  printConsole('',err.message);
              });
          }*/
      }
    }
  };

  const saveFormData = async (values) => {
    console.log("Inside saveFormData()");
    try {
      //if(handleSubmit()){
      if (true) {
        setButtonDisableFlag(true);
        // setTimeout(
        //     () => setApiTestState(...apiTestState,values),
        //     1000
        // );
        // const valueKeys = Object.keys(values);
        // console.log('Inside saveFormData values: ',values);
        // valueKeys.forEach((k) => {
        //     apiTestState[k] = values[k];
        // });
        if (
          values?.delegated?.value === "Yes" &&
          callProcRef.current === "callProc"
        ) {
          const result = checkLengths();
          if (result !== null) {
            alert(result);
            setButtonDisableFlag(false);
            return;
          }
        }

        let apiJson = {};
        let requestBody = { ...values };

        requestBody.delegated =
          values.delegated.value !== undefined ? values.delegated.value : null;
        requestBody.placeInDirectory =
          apiTestState.placeInDirectory !== undefined
            ? apiTestState.placeInDirectory.value
            : "";
        // values.states = ((apiTestState.states!==undefined)?apiTestState.states.map(el => el.value).toString():"");
        //requestBody.states = (apiTestState.states!==undefined ? ((typeof apiTestState.states !== 'string')?apiTestState.states.map(el => el.value).toString():apiTestState.states):"");
        console.log("STATES", apiTestState.states);
        requestBody.states =
          apiTestState.states !== undefined
            ? Array.isArray(apiTestState.states)
              ? apiTestState.states.map((el) => el.value.toString()).toString()
              : ""
            : "";
        requestBody.contractId =
          apiTestState.contractId !== undefined &&
          apiTestState.contractId !== null
            ? apiTestState.contractId.value
            : "";
        //console.log("apiTestState.placeInDirectory.value:",apiTestState.placeInDirectory.value);

        requestBody.Medicaid = apiTestState.Medicaid;
        requestBody.Medicare =
          apiTestState.Medicare !== undefined ? apiTestState.Medicare : true;

        //requestBody.languages = languageRef.current.getSelectedItems().toString();

        // requestBody.delegated = ((apiTestState.delegated!==undefined)?apiTestState.delegated.value:"");
        // console.log("Nidhi here");
        // requestBody.placeInDirectory = ((apiTestState.placeInDirectory!==undefined)?apiTestState.placeInDirectory.value:"");

        // console.log("apiTestState.placeInDirectory.value ", apiTestState.placeInDirectory);
        //requestBody.userName = 'system';
        requestBody.userName = mastersSelector.hasOwnProperty("auth")
          ? mastersSelector.auth.hasOwnProperty("userName")
            ? mastersSelector.auth.userName
            : "system"
          : "system";

        requestBody = trimJsonValues(requestBody);
        console.log("Add Facility apiTestState: ", requestBody);
        //requestBody.placeInDirectory = placeInDirectoryRef.current.getSelectedItems().toString();

        //console.log("caseNumber after: ",caseNumber);
        //requestBody.caseNumber = caseNumber;

        //delete requestBody.languagesDefault;
        //delete requestBody.placeInDirectoryDefault;

        //console.log("requestBody: ",requestBody);

        let mainWIObject = {};
        //mainWIObject.caseNumber = caseNumber;
        mainWIObject.legalEntityName = requestBody.legalEntityName;
        mainWIObject.npiId = requestBody.npiId;
        mainWIObject.transactionType = formName.current;
        mainWIObject.caseStatus = "Open";
        mainWIObject.Field1 = requestBody.contractId;
        mainWIObject.Field2 = requestBody.states;
        mainWIObject.lockStatus = "N";

        //Added on 2/9/23
        //mainWIObject.caseID = caseNumber;
        const flowId = credentialingConfigData["FlowId"];
        const stageId = credentialingConfigData["StageId"];
        const stageName = credentialingConfigData["StageName"];

        mainWIObject.createdByName = mastersSelector.hasOwnProperty("auth")
          ? mastersSelector.auth.hasOwnProperty("userName")
            ? mastersSelector.auth.userName
            : "system"
          : "system";
        mainWIObject.flowId = flowId;
        mainWIObject.stageName = stageName;
        mainWIObject.stageId = stageId;
        mainWIObject.delegated = requestBody.delegated;

        mainWIObject = trimJsonValues(mainWIObject);
        console.log("Main Workitem data: ", mainWIObject);

        apiJson["MainCaseTable"] = mainWIObject;
        apiJson["SelfServ_FaciAnci_Details"] = requestBody;

        /* //Newly Added by 09/26/2023
       let networkBody = {};
       networkBody.caseNumber = prop.state.caseNumber;
       //console.log("networkTabBody.caseNumber: ",networkBody.caseNumber);
       apiJson["SelfServ_Network_Details"] = networkBody;
       //Till Here*/

        apiJson = saveGridData(apiJson);

        //Added by Nidhi Gupta on 11/10/2023
        if (apiJson["SelfServ_Location_Grid"] !== undefined) {
          apiJson["SelfServ_Location_Grid"].map((data) => {
            data.languages =
              data.languages !== undefined
                ? typeof data.languages !== "string"
                  ? data.languages.map((el) => el.value).toString()
                  : data.languages
                : "";
          });
        }
        console.log("Wallet apiJson after: ", apiJson);

        //Till Here

        //Added by Nidhi on 3/27/2023 insert
        console.log("quesAnsListJson: ", quesAnsListJson);
        if (quesAnsListJson.length > 0) {
          let quesResponse = [];
          //    quesAnsListJson.map(data =>{
          //     //quesResponse.push({questionId:data['questionId'], response:data['response']== undefined ? false : data['response'],rowNumber:data['questionId'] })});  // [{questionId,response}]
          //     //Changed by Nidhi Gupta on 05/16/2023
          //     quesResponse.push({questionId:data['questionId'],
          //     response:data['response'].value,
          //     rowNumber:data['questionId'] })});  // [{questionId,response}]

          //Newly added by Harshit Sharma on 05/18/2023

          quesAnsListJson.map((data) => {
            let quesResponseData = {};
            quesResponseData.questionId = data["questionId"];
            quesResponseData.rowNumber = data["questionId"];
            if (data["response"] !== undefined) {
              if (data["response"].value !== undefined) {
                quesResponseData.response = data["response"].value;
              }
            }
            quesResponse.push(quesResponseData);
          });
          //till here

          // Making my array here in order to insert values in table columns
          apiJson["SelfServ_AdditionalQues_Grid"] = quesResponse;
          //console.log("quesResponse: ", quesResponse);
        }
        //till here 03

        //Newly Added by Nidhi Gupta 01/30/2024

        if (
          callProcRef.current === "callProc" &&
          apiJson["SelfServ_Location_Grid"] !== undefined &&
          apiJson["SelfServ_Location_Grid"].length > 0
        ) {
          //console.log("Hi apiJson[SelfServ_Location_Grid]: ",apiJson["SelfServ_Location_Grid"]);
          if (
            !areAllLocationNameSame(
              apiJson["SelfServ_Location_Grid"],
              apiJson["SelfServ_FaciAnci_Details"].dbaName
            )
          ) {
            alert(
              "Medical Group Name under Address Grid should be same as DBA Name."
            );
            setButtonDisableFlag(false);
            return;
          }
        }
        //Till Here

        //Newly Added by Nidhi Gupta on 08/04/2023
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
        // if((callProcRef.current === 'callProc') && (apiJson["SelfServ_FaciAnci_Details"].delegated === undefined || apiJson["SelfServ_FaciAnci_Details"].delegated === ''))
        // {

        //     alert("Please select Delegated.");
        //     setButtonDisableFlag(false);
        //     return;
        // }
        //Till Here

        //Newly Added by Nidhi Gupta on 11/21/2023
        // First, check for duplicate NPI ID
        const isDuplicateNpi = await npiOnSave(values, setButtonDisableFlag);

        // If a duplicate NPI ID was found, abort the save operation
        if (!isDuplicateNpi) {
          console.error("Duplicate NPI ID detected. Aborting save operation.");
          return; // Early return if duplicate NPI ID is found
        }

        console.log(
          "No duplicate NPI ID detected. Proceeding with saving form data."
        );
        //Added by NG on 12/7/2023 for making amounts null if they are coming blank in Insert statement
        if (Array.isArray(apiJson.SelfServ_Insurance_Grid)) {
          apiJson.SelfServ_Insurance_Grid.map((data) => {
            data.covAmount = data.covAmount === "" ? null : data.covAmount;
            data.covAmountAgg =
              data.covAmountAgg === "" ? null : data.covAmountAgg;
          });
        }
        //Till here
        console.log("Final api json before create: ", apiJson);
        // Make the API call to save form data.
        const response = await customAxios.post("/generic/create", apiJson, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("Data saved successfully: ", response);

        // Handle the response from the create endpoint.
        const apiStat = response.data.CreateCase_Output.Status;
        //Till Here

        //console.log("Case JSON: ", apiJson);
        // customAxios
        //   .post("/generic/create", apiJson, {
        //     headers: { Authorization: `Bearer ${token}` },
        //   })
        //   .then((res) => {
        //console.log("Data saved successfully: ", res);
        //const apiStat = res.data["CreateCase_Output"]["Status"];
        if (apiStat === -1) {
          alert("Case is not created.");
          setButtonDisableFlag(false); //Added newly on 5/18/2023
        }

        if (apiStat === 0) {
          // alert(
          //   "Case created with case number: " +
          //     res.data["CreateCase_Output"]["CaseNo"]
          // );

          /*Added by Harshit Sharma wrt load checklist documents on cred specialist stage */
          let procData = {};
          let procDataState = {};
          procDataState.stageName = stageName;
          procDataState.flowId = flowId;
          procDataState.caseNumber =
            response.data["CreateCase_Output"]["CaseNo"];
          procDataState.decision = "Submit";
          procDataState.userName = mastersSelector.hasOwnProperty("auth")
            ? mastersSelector.auth.hasOwnProperty("userName")
              ? mastersSelector.auth.userName
              : "system"
            : "system";
          procDataState.formNames = formName.current;

          procData.state = procDataState;

          console.log("PocData State: ", procData);
          console.log(
            "Inside Add Provider File UPLOAD DATA: ",
            documentSectionDataRef.current
          );
          if (documentSectionDataRef.current.length > 0) {
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
                response.data["CreateCase_Output"]["CaseNo"]
              );
              fileUploadData.append("docType", e.documentType);
              console.log(
                "Inside Add Provider File Upload Data: ",
                fileUploadData
              );
              fileUpDownAxios
                .post("/uploadFile", fileUploadData)
                .then((response) => {
                  console.log("File Upload api response: ", response.data);
                  if (response.status===200) {
                    // alert(
                    //   "Case created successfully: " +
                    //     res.data["CreateCase_Output"]["CaseNo"]
                    // );
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
                    // alert(
                    //   "Case created successfully: " +
                    //     res.data["CreateCase_Output"]["CaseNo"] +
                    //     " but error in uploading document"
                    // );
                  }
                  //submitCase(procData, navigateHome);
                });
            });
          }
          // else {
          //   submitCase(procData, navigateHome);
          // }
          alert(
            "Case created successfully: " +
              response.data["CreateCase_Output"]["CaseNo"]
          );
          submitCase(procData, navigateHome);
        }
        //navigateHome();  //uncomment after testing
        //   })
        //   .catch((err) => {
        //     console.log("Caught in generic create api call: " ,err.message);
        //         alert("Error occured in generic create api call.");
        //         setButtonDisableFlag(false);
        // });
      }
      /*if(!handleSubmit()){
            const errorMsg = errors[Object.keys(errors)[0]];
            alert(errorMsg);
        }*/
    } catch (error) {
      console.error("Error occurred in saveFormData: ", error);
      alert("An error occurred while saving the form data.");
      setButtonDisableFlag(false); // Re-enable the button
    }
  };

  //Till Here
  // Added by Shivani
  const saveData = (values) => {
    //e.preventDefault();
    if (!getNPIFromMaster(values.npiId,prop.state.decision,callProcRef.current)) {
      console.log("saveData Values: ", values);
      if (tabRef.current === "HomeView") {
        saveFormData(values);
      }
      if (tabRef.current === "DashboardView") {
        updateFormData(values);
      }
    } else {
      alert(
        "NPI ID " +
          values.npiId +
          " is in exclusion list.Please contact your provider and enter correct NPI ID"
      );
    }
  };
  //validation to check lengths of tables
  function checkLengths() {
    if (licenseTableRowsData.length === 0) {
      return "At least 1 profession row is important";
    }
    if (specialityTableRowsData.length === 0) {
      return "At least 1 speciality row is important";
    }

    if (locationTableRowsData.length === 0) {
      return "At least 1 Address row is important";
    }
    if (payToTableRowsData.length === 0) {
      return "At least 1 PaytoTable row is important";
    }
    setButtonDisableFlag(false);
    return null;
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

  function filterData() {
    return caseData.data.filter(
      (item) => item?.CaseID !== Number(prop.state.caseNumber)
    );
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
  const updateFormData = async (values) => {
    try {
      let updatedData = await filterData();

      if (
        values?.delegated?.value === "Yes" &&
        callProcRef.current === "callProc" &&
        !checkDecision(
          prop?.state?.decision?.toUpperCase()?.trim(),
          callProcRef.current
        )
      ) {
        const result = checkLengths();
        if (result !== null) {
          alert(result);
          setButtonDisableFlag(false);
          return;
        }
      }
      let validateDec = true;
      setButtonDisableFlag(true);
      delete values.caseNumber;

      console.log("potentialDupData updateFormData: ", potentialDupData);
      //values = {...dashbrdApiTestState};
      //setApiTestState({...apiTestState,values});
      let requestBody = { ...values };
      requestBody.delegated =
        values.delegated.value !== undefined ? values.delegated.value : null;

      requestBody.placeInDirectory =
        apiTestState.placeInDirectory !== undefined
          ? apiTestState.placeInDirectory.value
          : "";
      //values.states = ((apiTestState.states!==undefined)?apiTestState.states.map(el => el.value).toString():"");
      //requestBody.states = (apiTestState.states!==undefined ? ((typeof apiTestState.states !== 'string')?apiTestState.states.map(el => el.value).toString():apiTestState.states):"");
      requestBody.states =
        apiTestState.states !== undefined
          ? Array.isArray(apiTestState.states)
            ? apiTestState.states.map((el) => el.value.toString()).toString()
            : ""
          : "";
      requestBody.states = requestBody.states
        .replaceAll("[", "")
        .replaceAll("]", "");
      //console.log("apiTestState.placeInDirectory.value:",apiTestState.placeInDirectory.value);

      requestBody.Medicaid = apiTestState.Medicaid;
      requestBody.Medicare =
        apiTestState.Medicare !== undefined ? apiTestState.Medicare : true;
      requestBody.contractId =
        apiTestState.contractId !== undefined &&
        apiTestState.contractId !== null
          ? apiTestState.contractId.value
          : "";

      let apiTestStateCopy = { ...linearFieldsRef.current.linearFields };
      let updatedLinearJson = CompareJSON(requestBody, apiTestStateCopy);

      console.log("Update with Linear: before ", updatedLinearJson);
      gridDataRef.current.linearTable02 = trimJsonValues(updatedLinearJson);
      //gridDataRef.current.linearTable02 = trimJsonValues(requestBody);;

      if (quesAnsListJson.length > 0) {
        //Changed by Nidhi Gupta on 05/16/2023
        let quesResponse = [];
        //let quesResponse02 = [];
        quesAnsListJson.map((data) => {
          //  data['response']=data['response']==true?1:0
          //  data['response']=data['response']==false?0:1
          //  //quesResponse02.push(data)});

          quesResponse.push({
            // id:data['id'],caseNumber:data['caseNumber'],
            questionId: data["questionId"],
            response: data["response"].value,
            rowNumber: data["questionId"],
            //Added by NG on 1/23/2024
            operation: !!data.operation && data.operation == "I" ? "I" : "U",
            //Till Here
          });
        }); // [{questionId,response}]
        // Making my array here in order to insert values in table columns
        gridDataRef.current.SelfServ_AdditionalQues_Grid = quesResponse;
        // console.log("quesResponse02: ", quesResponse02);
      }
      // console.log(
      //   "gridDataRef.current.SelfServ_AdditionalQues_Grid: ",
      //   gridDataRef.current.SelfServ_AdditionalQues_Grid
      // );

      //till here 05

      //Newly Added by Nidhi Gupta on 10/10/2023
      let networkBody = {};
      networkBody.pcpId =
        apiTestStateComp.pcpId !== undefined ? apiTestStateComp.pcpId : "";
      networkBody.taxId =
        apiTestStateComp.taxId !== undefined ? apiTestStateComp.taxId : "";
      networkBody.medicalLicense =
        apiTestStateComp.medicalLicense !== undefined
          ? apiTestStateComp.medicalLicense
          : "";
      networkBody.groupRiskId =
        apiTestStateComp.groupRiskId !== undefined
          ? apiTestStateComp.groupRiskId
          : "";
      networkBody.networkId =
        apiTestStateComp.networkId !== undefined
          ? apiTestStateComp.networkId
          : "";
      networkBody.planValue =
        apiTestStateComp.planValue !== undefined
          ? apiTestStateComp.planValue
          : "";
      networkBody.networkState =
        apiTestStateComp.networkState && apiTestStateComp.networkState.value
          ? apiTestStateComp.networkState.value
          : "";
      networkBody.feeSchedule =
        apiTestStateComp.feeSchedule && apiTestStateComp.feeSchedule.value
          ? apiTestStateComp.feeSchedule.value
          : "";
      networkBody.riskState =
        apiTestStateComp.riskState && apiTestStateComp.riskState.value
          ? apiTestStateComp.riskState.value
          : "";
      networkBody.riskAssignment =
        apiTestStateComp.riskAssignment && apiTestStateComp.riskAssignment.value
          ? apiTestStateComp.riskAssignment.value
          : "";
      networkBody.terminationClause =
        apiTestStateComp.terminationClause !== undefined
          ? apiTestStateComp.terminationClause
          : "";
      networkBody.annualEscl =
        apiTestStateComp.annualEscl !== undefined
          ? apiTestStateComp.annualEscl
          : "";
      networkBody.starsIncentive =
        apiTestStateComp.starsIncentive !== undefined
          ? apiTestStateComp.starsIncentive
          : "";
      networkBody.awvIncentive =
        apiTestStateComp.awvIncentive !== undefined
          ? apiTestStateComp.awvIncentive
          : "";
      networkBody.medicalHome =
        apiTestStateComp.medicalHome !== undefined
          ? apiTestStateComp.medicalHome
          : "";
      networkBody.pricingAWP =
        apiTestStateComp.pricingAWP !== undefined
          ? apiTestStateComp.pricingAWP
          : "";
      networkBody.pricingASP =
        apiTestStateComp.pricingASP !== undefined
          ? apiTestStateComp.pricingASP
          : "";
      networkBody.contractTypeComp =
        apiTestStateComp.contractTypeComp &&
        apiTestStateComp.contractTypeComp.value
          ? apiTestStateComp.contractTypeComp.value
          : "";
      networkBody.sequesApplies =
        apiTestStateComp.sequesApplies && apiTestStateComp.sequesApplies.value
          ? apiTestStateComp.sequesApplies.value
          : "";
      networkBody.criticalAccess =
        apiTestStateComp.criticalAccess && apiTestStateComp.criticalAccess.value
          ? apiTestStateComp.criticalAccess.value
          : "";
      networkBody.qualityFlagI =
        apiTestStateComp.qualityFlagI && apiTestStateComp.qualityFlagI.value
          ? apiTestStateComp.qualityFlagI.value
          : "";
      networkBody.qualityFlagJ =
        apiTestStateComp.qualityFlagJ && apiTestStateComp.qualityFlagJ.value
          ? apiTestStateComp.qualityFlagJ.value
          : "";
      networkBody.qualityFlagK =
        apiTestStateComp.qualityFlagK && apiTestStateComp.qualityFlagK.value
          ? apiTestStateComp.qualityFlagK.value
          : "";
      networkBody.qualityFlagL =
        apiTestStateComp.qualityFlagL && apiTestStateComp.qualityFlagL.value
          ? apiTestStateComp.qualityFlagL.value
          : "";
      networkBody.qualityFlagM =
        apiTestStateComp.qualityFlagM && apiTestStateComp.qualityFlagM.value
          ? apiTestStateComp.qualityFlagM.value
          : "";
      networkBody.qualityFlagN =
        apiTestStateComp.qualityFlagN && apiTestStateComp.qualityFlagN.value
          ? apiTestStateComp.qualityFlagN.value
          : "";
      networkBody.conEffectiveDate = extractDate(apiTestStateComp.conEffectiveDate)

      networkBody.mocAttestationDate = extractDate(apiTestStateComp.mocAttestationDate)

      networkBody.mocRenewalAttDate = extractDate(apiTestStateComp.mocRenewalAttDate)

      console.log("networkBody Update: ", networkBody);
      if (
        (prop.state.stageName === "Cred Specialist" ||
          prop.state.stageName === "QA") &&
        apiCallOnce &&
        Object.keys(apiTestStateComp).length > 0 &&
        Object.values(apiTestStateComp).some(
          (value) => value !== "" && value !== null
        )
      ) {
        gridDataRef.current.SelfServ_Network_Details =
          trimJsonValues(networkBody);
      }
      //Till Here

      //Added by Nidhi Gupta on 08/22/2023
      if (potentialDupData.length > 0) {
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
        gridDataRef.current.SelfServ_PotentialDuplicate = updateArray;
        console.log(
          "gridDataRef.current.SelfServ_PotentialDuplicate: ",
          gridDataRef.current.SelfServ_PotentialDuplicate
        );
      }
      //Till Here
      console.log(" Update gridDataRef.current.linearTable02: ", values);

      // const gridKeys = getTableDetails()["facAncLinear"].concat(
      //   getTableDetails()["gridTables"]
      // );
      // gridKeys.forEach((k) => {
      //   const newKey = k.split("~")[0];
      //   const oldKey = k.split("~")[1];
      //   gridDataRef.current = renameKey(gridDataRef.current, oldKey, newKey);
      // });

      gridDataRef.current.caseNumber = prop.state.caseNumber;
      console.log("Update getDataRef: ", gridDataRef.current);

      // if (
      //   callProcRef.current === "callProc" &&
      //   (prop.state.decision === undefined || prop.state.decision === "")
      // ) {
      //   alert("Please select Decisionnnnn");
      //   setButtonDisableFlag(false); //Added on 05/17/2023
      //   return;
      // }
      let validated = true;
      // if (
      //   callProcRef.current === "callProc" &&
      //   (prop.state.decision !== undefined && prop.state.decision !== "")
      // ) {
      //   const dec = prop.state.decision.toUpperCase().trim();
      //   if (dec === "APPROVE") {
      //     validated = validateGridData(credentialTableRowsData);
      //   }
      // }
      // console.log("Is data validated: ", validated);

      if (validated || callProcRef.current !== "callProc") {
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
          //Added by Nidhi Gupta

          // if((callProcRef.current === 'callProc') && (gridDataRef.current.SelfServ_FaciAnci_Details.delegated === undefined || gridDataRef.current.SelfServ_FaciAnci_Details.delegated === ''))
          //       {

          //           alert("Please select Delegated");
          //           setButtonDisableFlag(false);
          //           return;
          //       }

          //Added by Nidhi Gupta on 08/22/2023
          // UnCommented for deployment
          /*if(((callProcRef.current === 'callProc' && !(validatePotentialDup(potentialDupData))))){
        setButtonDisableFlag(false);
                 alert("Please select Action dropdown for all cases");
                 setButtonDisableFlag(false);
                 return;
    }*/

          //Newly Added by Nidhi Gupta on 10/13/2023
          console.log("contractId xxxxxx: ", requestBody.contractId);

          if (
            callProcRef.current === "callProc" &&
            prop.state.stageName === "Config" &&
            (requestBody.contractId === undefined ||
              requestBody.contractId === "")
          ) {
            alert("Contract Id is mandatory.");
            setButtonDisableFlag(false);
            return;
          }

          //Till Here

          if (callProcRef.current === "callProc" && dec === "") {
            alert("Please select Decision.");
            setButtonDisableFlag(false); //Added on 05/17/2023
            return;
          }

          //08/22/2023
          if (callProcRef.current === "callProc" && dec !== "") {
            if (dec !== "DISCARD") {
              validateDec = validatePotentialDupDec(potentialDupData);
              if (!validateDec) {
                setButtonDisableFlag(false);
                alert(
                  "Please choose Decision Discard as it is a Potential Duplicate Case."
                );
                return;
              }
            }
          }
          //till here

          if (callProcRef.current === "callProc" && dec !== "") {
            if (
              dec === "APPROVE" &&
              apiTestState.delegated?.value &&
              apiTestState.delegated.value.toLowerCase() === "no"
            ) {
              validated = validateGridData(credentialTableRowsData);
            }
          }
          //console.log("Is data validated: ", validated);

          //Newly Added by Nidhi Gupta 01/30/2024
          if (
            callProcRef.current === "callProc" &&
            locationTableRowsData !== undefined &&
            locationTableRowsData.length > 0
          ) {
            //console.log("Hi locationTableRowsData: ",locationTableRowsData);
            if (
              !areAllLocationNameSame(locationTableRowsData, values.dbaName)
            ) {
              alert(
                "Medical Group Name under Address Grid should be same as DBA Name."
              );
              setButtonDisableFlag(false);
              return;
            }
          }
          //Till Here
        }
        if (validated) {
          //console.log("Nidhi Executing else part");
          //console.log("Nidhi gridDataRef.current: ", gridDataRef.current);

          //till here
          const gridKeys = getTableDetails()["facAncLinear"].concat(
            getTableDetails()["gridTables"]
          );
          gridKeys.forEach((k) => {
            const newKey = k.split("~")[0];
            const oldKey = k.split("~")[1];
            gridDataRef.current = renameKey(
              gridDataRef.current,
              oldKey,
              newKey
            );
          });

          //Added by Nidhi Gupta on 11/10/2023

          if (Array.isArray(gridDataRef.current.SelfServ_Location_Grid)) {
            gridDataRef.current.SelfServ_Location_Grid.map((data) => {
              data.languages = Array.isArray(data.languages)
                ? typeof data.languages !== "string"
                  ? data.languages.map((el) => el.value).toString()
                  : data.languages
                : "";
            });
          }

          //Till here

          if (Array.isArray(gridDataRef.current.SelfServ_Insurance_Grid)) {
            gridDataRef.current.SelfServ_Insurance_Grid.map((data) => {
              //data.DataSource=data.DataSource===""? null: data.DataSource
              data.covAmount = data.covAmount === "" ? null : data.covAmount;
              data.covAmountAgg =
                data.covAmountAgg === "" ? "" : data.covAmountAgg;
            });
          }

          //console.log(" hi before update griddataref.current: ",gridDataRef.current);
          await customAxios
            .post("/generic/update", gridDataRef.current, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              console.log("Data Update result: ", res);
              const apiStat = res.data["UpdateCase_Output"]["Status"];
              if (apiStat === -1) {
                alert("Data not updated.");
                setButtonDisableFlag(false); //Added on 05/17/2023
              }

              if (apiStat === 0) {
                alert("Case data updated successfully");
                updateDecision(
                  prop,
                  saveType,
                  AddFacilityAncillary.displayName
                );

                //Commented by Harshit as the belo api call is moved to updateDecision.
                /*let procInput = {};
              procInput.input1 = "testing";
              procInput.input2 = AddFacilityAncillary.displayName;
              procInput.input3 = prop.state.caseNumber;
              customAxios
                .post("/updateQueueVariableProcedure", procInput, {
                  headers: { Authorization: `Bearer ${token}` },
                })
                .then((res) => {
                  console.log("Update Queue Variable Proc output: ", res);
                  if (res.status === 200) {
                    console.log(
                      "Update Queue Variable Proc executed successully"
                    );
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
                  //console.log("Executing after await");
                }
                if (callProcRef.current !== "callProc") {
                  setTimeout(() => {
                    getCaseByCaseNumber();
                  }, 500);
                  navigateHome();
                }
              }
            })
            .catch((err) => {
              console.log("Caught in generic update api call: ", err.message);
              alert("Error occured in generic update api call.");
              setButtonDisableFlag(false);
            });
        } else {
          alert("Please enter details in Credential Checklist Grid.");
          setButtonDisableFlag(false);
          return;
        }
      }
    } catch (error) {
      alert("Error occured in updating data");
      printConsole("caught in updateFormData error: ", error);
      setButtonDisableFlag(false);
    }
  };

  const renameKey = (obj, oldKey, newKey) => {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
    return obj;
  };

  const manageLinearState = (requestBody) => {
    //requestBody.languages = languageRef.current.getSelectedItems().toString();

    requestBody.userName = "system";
    //console.log("caseNumber after: ",caseNumber);
    //requestBody.caseNumber = caseNumber;

    delete requestBody.languagesDefault;

    delete requestBody.licenseTypeDefault;

    if (tabRef.current === "DashboardView") {
      delete requestBody.caseNumber;
    }
    return requestBody;
  };

  const saveGridData = (apiJson) => {
    let apiUrlArray = [];
    //let apiStr = apiUrl;
    let apiUrlObject = {};
    const specialityResponse = getGridDataValues(specialityTableRowsData);
    const licenseResponse = getGridDataValues(licenseTableRowsData);
    const locationResponse = getGridDataValues(locationTableRowsData);
    const payToResponse = getGridDataValues(payToTableRowsData);
    const insuranceResponse = getGridDataValues(insuranceTableRowsData);
    const credentialResponse = getGridDataValues(credentialTableRowsData);

    //console.log("specialityResponse: ",licenseResponse);
    if (specialityResponse.length > 0) {
      //apiUrlObject["name"] = 'Speciality Table';
      //apiStr = apiStr + 'addSpeciality/speciality';
      //apiUrlObject["apiKey"] = apiStr;
      apiJson["SelfServ_Speciality_Grid"] = specialityResponse;
      //apiUrlArray.push(apiUrlObject);
      //apiStr = apiUrl;
      //apiUrlObject = {};
    }
    if (licenseResponse.length > 0) {
      //apiUrlObject["name"] = 'Speciality Table';
      //apiStr = apiStr + 'addSpeciality/speciality';
      //apiUrlObject["apiKey"] = apiStr;
      apiJson["SelfServ_License_Grid"] = licenseResponse;
      //apiUrlArray.push(apiUrlObject);
      //apiStr = apiUrl;
      //apiUrlObject = {};
    }
    if (locationResponse.length > 0) {
      //apiUrlObject["name"] = 'Speciality Table';
      //apiStr = apiStr + 'addSpeciality/speciality';
      //apiUrlObject["apiKey"] = apiStr;
      apiJson["SelfServ_Location_Grid"] = locationResponse;
      //apiUrlArray.push(apiUrlObject);
      //apiStr = apiUrl;
      //apiUrlObject = {};
    }
    if (payToResponse.length > 0) {
      //apiUrlObject["name"] = 'Speciality Table';
      //apiStr = apiStr + 'addSpeciality/speciality';
      //apiUrlObject["apiKey"] = apiStr;
      apiJson["SelfServ_PayTo_Grid"] = payToResponse;
      //apiUrlArray.push(apiUrlObject);
      //apiStr = apiUrl;
      //apiUrlObject = {};
    }
    if (insuranceResponse.length > 0) {
      //apiUrlObject["name"] = 'Insurance Table';
      //apiStr = apiStr + 'addSpeciality/speciality';
      //apiUrlObject["apiKey"] = apiStr;
      apiJson["SelfServ_Insurance_Grid"] = insuranceResponse;
      //apiUrlArray.push(apiUrlObject);
      //apiStr = apiUrl;
      //apiUrlObject = {};
    }
    if (credentialResponse.length > 0) {
      //apiUrlObject["name"] = 'Speciality Table';
      //apiStr = apiStr + 'addSpeciality/speciality';
      //apiUrlObject["apiKey"] = apiStr;
      apiJson["SelfServ_Credential_Grid"] = credentialResponse;
      //apiUrlArray.push(apiUrlObject);
      //apiStr = apiUrl;
      //apiUrlObject = {};
    }

    /*if(apiUrlArray.length>0){
            console.log("apiUrlArray: ",apiUrlArray);
            axios.all(apiUrlArray.map((endpoint) => axios.post(endpoint["apiKey"],endpoint["apiValue"]))).then((res) => {
                for(let i=0;i<apiUrlArray.length;i++){
                    if(res[i].status === 200){
                       //alert(apiUrlArray[i]["name"] + " data saved successfuly");
                    }
                    else{
                        //alert("Error in saving "+apiUrlArray[i]["name"] + " data");
                    }
                }
            })
            .catch((err) => {
                console.log(err.message);
                //alert("Error in saving data");
            });
        }*/
    return apiJson;
  };

  const getGridDataValues = (tableData) => {
    //var headers = document.getElementById(tableId).headers;
    let returnArray = [];
    tableData.map((data) => {
      const dataObject = {};
      const dataKeys = Object.keys(data);
      dataKeys.forEach((dataValue) => {
        console.log("dataKey: ", dataValue, " DataValue: ", data[dataValue]);
        const dataKeyType = typeof data[dataValue];
        /*if (dataKeyType === "object") {
          if (data[dataValue] instanceof Date) {
            dataObject[dataValue] = data[dataValue].toLocaleDateString();
          }
          else{
            dataObject[dataValue] =
            data[dataValue].value !== undefined ? data[dataValue].value : "";
          }

        }
        if (dataKeyType !== "object") {
          dataObject[dataValue] = data[dataValue];
        }*/

        if (data[dataValue]) {
          if (data[dataValue].value) {
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
        }
      });
      //dataObject.caseNumber = caseNumber;
      returnArray.push(trimJsonValues(dataObject));
    });
    return returnArray;
  };

  const formikFieldsOnChange = (evnt, setFieldValue, field) => {
    let value = evnt.target.value || "";
    //value = value.toUpperCase().trim();
    value = value.toUpperCase();
    printConsole("Inside organization Name onCHange: ", value);
    setFieldValue(field.name, value);
  };
  const ClearIndicator = (statesProps) => {
    return (
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "-20px",
          transform: "translateY(-50%)",
          display: `${prop?.state?.lockStatus === "Y" ? "none" : "block"}`,
        }}
      >
        <RxCross2
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          onClick={() =>
            handleLinearSelectChange(
              "",
              {
                action: "clear",
                name: "states",
              },
              statesProps.formikSetFieldValue
            )
          }
        />
      </div>
    );
  };

  const populateFormBasisOnType = () => {
    console.log("Inside populateFormBasisOnType tabref= ", tabRef);
    if (tabRef.current === "DashboardView") {
      return (
        <>
          <Tabs
            defaultActiveKey={formName.current}
            id="justify-tab-example"
            className="mb-3"
            justify
            onSelect={(key) => handleTabSelect(key)}
          >
            <Tab eventKey={formName.current} title={formName.current}>
              {populateForm()}
            </Tab>

            {/* Added by Nidhi to show CompensationTab on Cred Specialist, QA, Exit and Discard stage */}
            {((prop.state.formView === "DashboardView" &&
              (prop.state.stageName === "Cred Specialist" ||
                prop.state.stageName === "QA" ||
                prop.state.stageName === "Exit" ||
                prop.state.stageName === "Discard")) ||
              prop.state.formView === "DashboardHomeView") && (
              <Tab eventKey="Compensation" title="Network">
                <CompensationTab
                  apiTestStateComp={apiTestStateComp}
                  firlTableRowsData={firlTableRowsData}
                  compensationTableRowsData={compensationTableRowsData}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  /*handleGridDateChange={handleGridDateChange}*/
                  handleGridFieldChange={handleGridFieldChange}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  handleLinearSelectChange={handleLinearSelectChangeComp}
                  handleLinearFieldChange={handleLinearFieldChange}
                  handleMedicalGrpNoShow={handleMedicalGrpNoShow}
                  handleNetworkIdShow={handleNetworkIdShow}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  handlePcpIdShow={handlePcpIdShow}
                  handleDateChange={handleDateChange}
                  transactionType={AddFacilityAncillary.displayName}
                  //type={'Editable'}
                  //stageName={prop.state.StageName}
                  /*selectJson={selectValues}*/
                  //</Tab>lockStatus={(prop.state!==null && prop.state.lockStatus!==undefined)?prop.state.lockStatus:'N'}>
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
            )}

            {/*Till Here */}
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
                delegatedVal={apiTestState?.delegated}
                buttonClicked={callProcRef.current}
              ></DecisionTab>
              {/* <DecisionTab selectJson={selectValues}></DecisionTab> */}
            </Tab>
            <Tab eventKey="Reference" title="References">
              <ReferenceTab />
            </Tab>
          </Tabs>
        </>
      );
    }
    if (tabRef.current === "HomeView") {
      return <>{populateForm()}</>;
    }

    //populateForm();
  };

  //Added by Nidhi on 3/27/2023

  //Added by Nidhi Gupta on 5/16/2023
  const handleSelectChange = (evnt, index, data) => {
    console.log("quesAns Dropdown selectedValue: ", evnt);

    if (!evnt) {
      data.response = { label: "", value: "" };
    } else {
      data.response = { label: evnt.value, value: evnt.value };
    }
    quesAnsListJson[index] = data;
    setQuesAnsListJson([...quesAnsListJson]);
  };
  //Till here

  const checkHandler = (event, index, data) => {
    data.response = event.target.checked;
    quesAnsListJson[index] = data;
    setQuesAnsListJson([...quesAnsListJson]);
  };

  const questionData = () => {
    console.log("questionData() quesAnsListJson", quesAnsListJson);
    if (quesAnsListJson.length > 0) {
      return quesAnsListJson.map((data, index) => {
        //console.log("quesJson[data.value]: ", quesJson[data.value]);
        // console.log("quesJson: ", quesJson);
        // const isChecked = quesJson[data.value] == 'Yes' ? true : false;
        return (
          <>
            <tr key={index}>
              <td style={{ textAlign: "center" }}>{index + 1}</td>
              <td className="tableData">
                {/* {(('questionId' in data)) ? (data.label) : (data.label)} */}
                {data.label}
              </td>
              <td>
                <div style={{ "text-align": "center" }}>
                  {/* <input
                                    type="checkbox"
                                    id={data.questionId}

                                    checked={data.response==1?true:false}
                                    //checked={isChecked}
                                    onChange={(event) => checkHandler(event, index, data)}

                                //defaultChecked={data.value == "Yes" ? true : false}
                                //onBlur={(event) => updateMyData(parseInt(row.row.id), row.column.id, event.target.checked ? "Yes" : "No")}
                                //onChange={()=>(handleGridSelectChange(index, 'AdditionalQuesGridTable'))}
                                /> */}

                  {/* Added by Nidhi Gupta on 5/16/2023 */}
                  <Select
                    styles={{
                      control: (provided) => ({
                        ...provided,
                        fontWeight: "lighter",
                      }),
                    }}
                    onChange={(event) => handleSelectChange(event, index, data)}
                    options={[
                      { label: "YES", value: "Y" },
                      { label: "NO", value: "N" },
                    ]}
                    isClearable
                    // value={data.response}

                    value={
                      data.response !== undefined && data.response !== ""
                        ? data.response?.value?.toLowerCase() === "y" ||
                          data.response?.value?.toLowerCase() === "yes"
                          ? {
                              label: convertToCase("YES"),
                              value: convertToCase(data.response.value),
                            }
                          : data.response?.value?.toLowerCase() === "n" ||
                            data.response?.value?.toLowerCase() === "no"
                          ? {
                              label: convertToCase("NO"),
                              value: convertToCase(data.response.value),
                            }
                          : data.response
                        : data.response
                    }
                  />
                  {/* till here */}
                </div>
              </td>
            </tr>
          </>
        );
      });
    }
  };

  //till here 04

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

  const fetchNpiData = (evnt, npiId) => {
    printConsole("Inside fetchNpiData");
    fetchAutoPopulate.current = true;
  };
  //Call this function on submit button click when form is opened from dashboard

  const getNpiData = (evnt, values) => {
    const linearFieldsRemoveArray = [
      "placeInDirectory",
      "Medicaid",
      "Medicare",
      "delegated",
    ];
    let npiId = values.npiId;
    printConsole("Inside getNpiData Npi Id: ", npiId);
    printConsole("Inside getNpiData apiTestSTate: ", apiTestState);
    if (npiId !== "" && npiId !== undefined) {
      setFormikInitializeState(true);
      setLoaderState(true);
      evnt.preventDefault();
      linearFieldsRemoveArray.forEach((e) => {
        printConsole(
          "Inside getNpiData linearFieldsRemoveArray forEach key: ",
          e
        );
        if (apiTestState.hasOwnProperty(e)) {
          printConsole(
            "Inside getNpiData linearFieldsRemoveArray forEach hasOwnProperty: ",
            e
          );
          delete apiTestState[e];
        }
      });
      setApiTestState(initState);
      //setLocationTableRowsData([]);
      setspecialityTableRowsData([]);
      customAxios
        .get(`npi/validate?npiId=${npiId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("get Npi data result: ", res);
          console.log("Before setting npi data: ", {
            ...apiTestState,
            ...res.data.linear,
          });
          if (res.status === 200) {
            if (JSON.stringify(res.data) === JSON.stringify({})) {
              setLoaderState(false);
              alert("No data found for this NPI id");
            }
            if (JSON.stringify(res.data) !== JSON.stringify({})) {
              setLoaderState(false);
              //Added by Nidhi Gupta on 06/23/2023 for activating Formik Required Validations
              if (res.data.linear.legalEntityName == undefined) {
                res.data.linear.legalEntityName = "";
              }
              if (res.data.linear.medicareId == undefined) {
                res.data.linear.medicareId = "";
              }
              if (res.data.linear.emailId == undefined) {
                res.data.linear.emailId = "";
              }
              //Added by Nidhi gupta on 8/20/2023
              if (res.data.linear.delegated == undefined) {
                res.data.linear.delegated = "";
              }
              for (let i = 0; i < res.data.taxonomy.length; i++) {
                if (res.data.taxonomy[i].specPrimary !== undefined) {
                  res.data.taxonomy[i].specPrimary === "Y"
                    ? (res.data.taxonomy[i].specPrimary = {
                        label: "YES",
                        value: "Y",
                      })
                    : res.data.taxonomy[i].specPrimary === "N"
                    ? (res.data.taxonomy[i].specPrimary = {
                        label: "NO",
                        value: "N",
                      })
                    : (res.data.taxonomy[i].specPrimary = "");
                }
                if (res.data.taxonomy[i].pcp !== undefined) {
                  res.data.taxonomy[i].pcp === "Y"
                    ? (res.data.taxonomy[i].pcp = { label: "YES", value: "Y" })
                    : res.data.taxonomy[i].pcp === "N"
                    ? (res.data.taxonomy[i].pcp = { label: "NO", value: "N" })
                    : (res.data.taxonomy[i].pcp = "");
                }
                if (res.data.taxonomy[i].boardCerti !== undefined) {
                  res.data.taxonomy[i].boardCerti === "Y"
                    ? (res.data.taxonomy[i].boardCerti = {
                        label: "YES",
                        value: "Y",
                      })
                    : res.data.taxonomy[i].boardCerti === "N"
                    ? (res.data.taxonomy[i].boardCerti = {
                        label: "NO",
                        value: "N",
                      })
                    : (res.data.taxonomy[i].boardCerti = "");
                }
              }
              //Till here
              //Till Here
              setApiTestState({ ...apiTestState, ...res.data.linear });
              //setLocationTableRowsData(res.data.address);
              if (res.data.taxonomy.length > 0) {
                setspecialityTableRowsData(res.data.taxonomy);
              }
            }
          }
        })
        .catch((err) => {
          setLoaderState(false);
          // setCaqhGenericModal({header: 'Error!', body: 'Error in fetching data from server.Please try again.', state:true})
          //         setLoading(false);
          //         setLoadForm(false);
          //         setTimeout(()=>{setLoadForm(true);},50)
          // setCaqhGenericModal({header: 'Error---->' + err.response.status, body: err.response.data, state: true});
        });
    } else {
      alert("Please provide NPI ID first to retrieve data from NPPES");
      //npiIdRef.current.focus();
    }
  };

  const handleFormikChange = (e) => {
    //alert("Name changed: "+e);
    printConsole("inside add facility handleFormikChange: ", e);
    const { name, value } = e.target;
    setApiTestState({ ...apiTestState, [name]: value });
  };
  const populateForm = () => {
    //console.log("Inside populateForm")

    return (
      <div className="col-xs-12">
        <div
          className="accordion AddProviderLabel"
          id="accordionPanelsStayOpenExample"
        >
          <Formik
            //initialValues={(tabRef.current === "DashboardView")?apiTestState:{legalEntityName:''}}
            enableReinitialize={formikInitializeState}
            initialValues={apiTestState}
            // onSubmit={(values) => {
            //     alert(JSON.stringify(values, null, 2));
            //     setTimeout(() => {
            //       //alert(JSON.stringify(values, null, 2));
            //       saveData(values);
            //     }, 400);
            // }}
            onChange={() => {
              alert("changing: ");
            }}
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
                setFieldTouched,
                submitForm,
                validateForm,
              } = props;
              console.log("Form Values: ", values);
              console.log("Form props: ", props);
              return (
                <form disabled={true} onSubmit={(e) => e.preventDefault()}>
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
                        id="panelsStayOpen-Instructions"
                      >
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseInstructions"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          Instructions
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseInstructions"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-Instructions"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            {formName.current !==
                            "Ancillary/Facility Demographic Modification" ? (
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
                                <label
                                  id="instructionPointOne"
                                  style={{
                                    fontSize: "12px",
                                    fontFamily: "'Open Sans', sans-serif",
                                  }}
                                >
                                  For Providers wanting to pull their
                                  information from NPPES, please provide your
                                  NPI and click the “NPPES Data Retrieval”
                                  Button.
                                </label>
                              </div>
                            ) : (
                              <div className="col-xs-12">
                                <label
                                  id="instructionHeading"
                                  className="instructionHeading"
                                >
                                  To modify Facility/Ancillary Demographic,
                                  please fill 10-digit NPI ID corresponding to
                                  that Facility/Ancillary and click on Fetch
                                  Button. Review all information to confirm the
                                  accuracy.
                                </label>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                    {formName.current ===
                    "Ancillary/Facility Demographic Modification" ? (
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-Npi"
                        >
                          <button
                            className="accordion-button accordionButtonStyle"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseNpi"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseOne"
                          >
                            NPI ID
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseNpi"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Npi"
                        >
                          <div className="accordion-body">
                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                <Field name="npiId" onKeyUp={handleChange}>
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
                                        onInput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                        {...field}
                                        //ref = {npiIdRef}
                                      />
                                      <label htmlFor="floatingInputGrid">
                                        NPI ID
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
                                  name="npiId"
                                  className="invalid-feedback"
                                />
                              </div>
                              <div className="col-xs-6 col-md-4">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btnStyle"
                                  onClick={(event) =>
                                    fetchNpiData(event, values.npiId)
                                  }
                                >
                                  Fetch
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}

                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-Provider"
                      >
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseProvider"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          {/* Provider Information */}
                          {prop.state.formView === "DashboardView"
                            ? prop.state.formNames === "Add a Facility"
                              ? "Facility"
                              : "Ancillary"
                            : prop.state.formNames === "AddFacility"
                            ? "Facility"
                            : "Ancillary"}{" "}
                          Information
                          {/* //  {prop.state.formNames === 'AddFacility' ? 'Facility' : 'Ancillary'} Information */}
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseProvider"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-Provider"
                      >
                        <div className="accordion-body">
                          {formName.current !==
                            "Ancillary/Facility Demographic Modification" &&
                            tabRef.current === "HomeView" && (
                              <div className="row">
                                <div className="col-xs-6 col-md-4">
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btnStyle"
                                    onClick={(event) =>
                                      getNpiData(event, values)
                                    }
                                  >
                                    NPPES Data Retrieval
                                  </button>
                                </div>
                                <div className="col-xs-6 col-md-4">
                                  {/* <button
                                    type="button"
                                    className="btn btn-outline-primary btnStyle"
                                  >
                                    State Roster Data Retrieval
                                  </button> */}
                                </div>
                              </div>
                            )}

                          <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                              <Field name="legalEntityName">
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
                                      //  {formName.current==="Ancillary/Facility Demographic Modification"?disabled:''}
                                      disabled={
                                        formName.current ===
                                        "Ancillary/Facility Demographic Modification"
                                          ? true
                                          : false
                                      }
                                      {...field}
                                      value={convertToCase(field.value)}
                                      onBlur={(event) => {
                                        fieldsOnBlur(
                                          event,
                                          values,
                                          setFieldValue
                                        );
                                      }}
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
                              <ErrorMessage
                                component="div"
                                name="legalEntityName"
                                className="invalid-feedback"
                              />
                            </div>

                            <div className="col-xs-6 col-md-4">
                              <Field name="dbaName">
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
                                      disabled={
                                        formName.current ===
                                        "Ancillary/Facility Demographic Modification"
                                          ? true
                                          : false
                                      }
                                      {...field}
                                      value={convertToCase(field.value)}
                                      onChange={(e) => {
                                        console.log("Hi onChange call hora h");
                                        formikFieldsOnChange(
                                          e,
                                          setFieldValue,
                                          field
                                        );
                                      }}
                                      // onBlur={()=>{
                                      //   prop.state.dbaName = values.dbaName !== undefined ? values.dbaName:''

                                      // } }
                                      onBlur={() => {
                                        console.log("Hi onBlur call hora h");
                                        setFieldValue(
                                          "dbaName",
                                          field.value !== undefined
                                            ? field.value
                                            : ""
                                        );
                                      }}
                                    />
                                    <label htmlFor="floatingInputGrid">
                                      DBA Name
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
                                name="dbaName"
                                className="invalid-feedback"
                              />
                            </div>

                            <div className="col-xs-6 col-md-4">
                              <Field name="npiId" validate={checkLuhn}>
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
                                      // oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"

                                      disabled={
                                        formName.current ===
                                        "Ancillary/Facility Demographic Modification"
                                          ? true
                                          : false
                                      }
                                      {...field}
                                    />
                                    <label htmlFor="floatingInputGrid">
                                      NPI ID
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
                                name="npiId"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>

                          <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                              <Field name="medicareId">
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
                                      disabled={
                                        formName.current ===
                                        "Ancillary/Facility Demographic Modification"
                                          ? true
                                          : false
                                      }
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
                                      Medicare Id
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
                                name="medicareId"
                                className="invalid-feedback"
                              />
                            </div>

                            <div className="col-xs-6 col-md-4">
                              <Field name="medicaidId">
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
                                      disabled={
                                        formName.current ===
                                        "Ancillary/Facility Demographic Modification"
                                          ? true
                                          : false
                                      }
                                      {...field}
                                      //Added by Nidhi Gupta on 1/19/2024
                                      value={convertToCase(field.value)}
                                      onChange={(e) =>
                                        formikFieldsOnChange(
                                          e,
                                          setFieldValue,
                                          field
                                        )
                                      }
                                      //Till Here
                                    />
                                    <label htmlFor="floatingInputGrid">
                                      Medicaid Id
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

                            {/* <div className="col-xs-6 col-md-4">
                              <div className="form-floating">
                                <Select
                                  styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      height: "58px",
                                      fontWeight:'lighter'
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
                                        state.hasValue ||
                                        state.selectProps.inputValue
                                          ? -15
                                          : "50%",
                                      transition: "top 0.1s, font-size 0.1s",
                                      fontSize:
                                        (state.hasValue ||
                                          state.selectProps.inputValue) &&
                                        13,
                                    }),
                                  }}
                                  components={{
                                    ValueContainer: CustomValueContainer,
                                  }}
                                  name="placeInDirectory"
                                  isDisabled={
                                    (tabRef.current === "DashboardView" &&
                                    prop.state.lockStatus !== undefined &&
                                    prop.state.lockStatus === "Y" )
                                    || formName.current==="Ancillary/Facility Demographic Modification"
                                      ? true
                                      : false
                                  }
                                  isClearable
                                  className="basic-multi-select"
                                  options={[
                                    { label: "Yes", value: "Yes" },
                                    { label: "No", value: "No" },
                                  ]}
                                  id="placeInDirectoryDropdown"
                                  isMulti={false}
                                  onChange={(selectValue, event) =>
                                    handleLinearSelectChange(selectValue, event, values)
                                  }
                                  value={apiTestState.placeInDirectory}
                                  placeholder="Place In Directory"
                                  isSearchable={
                                    document.documentElement.clientHeight >
                                    document.documentElement.clientWidth
                                      ? false
                                      : true
                                  }
                                />
                              </div>
                            </div> */}
                            <div className="col-xs-6 col-md-4">
                              <Field name="emailId">
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
                                      onChange={(e) =>
                                        formikFieldsOnChange(
                                          e,
                                          setFieldValue,
                                          field
                                        )
                                      }
                                      value={convertToCase(field.value)}
                                    />
                                    <label htmlFor="floatingInputGrid">
                                      Email Id
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
                                name="emailId"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>
                          <div className="row my-2">
                            {/* {formName.current != 'Add an Ancillary' ? (  */}
                            <div className="col-xs-6 col-md-4">
                              <Field name="delegated">
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
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
                                        valueContainer: (provided, state) => ({
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
                                      //name="delegated"
                                      name={field.name}
                                      isClearable
                                      isDisabled={
                                        tabRef.current === "DashboardView" &&
                                        prop.state.lockStatus !== undefined &&
                                        prop.state.lockStatus === "Y"
                                          ? true
                                          : false
                                      }
                                      className="basic-multi-select"
                                      options={[
                                        { label: "YES", value: "Yes" },
                                        { label: "NO", value: "No" },
                                      ]}
                                      id="delegatedDropdown"
                                      isMulti={false}
                                      onChange={(selectValue, event) =>
                                        handleLinearSelectChange(
                                          selectValue,
                                          event,
                                          setFieldValue
                                        )
                                      }
                                      /*onChange={(selectValue, event) => {
                                        setFieldValue(field.name, selectValue);

                                        setApiTestState({
                                          ...apiTestState,
                                          [event?.name]: selectValue,
                                        });
                                      }}*/
                                      //value={apiTestState.delegated}
                                      value={field.value}
                                      placeholder="Delegated"
                                      isSearchable={
                                        document.documentElement.clientHeight >
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
                                name="delegated"
                                className="invalid-feedback"
                              />
                            </div>

                            {/* ): (<div/>)} */}

                            <div className="col-xs-6 col-md-4">
                              <Field name="contractId">
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
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
                                        valueContainer: (provided, state) => ({
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
                                      name={field.name}
                                      isDisabled={
                                        tabRef.current === "DashboardView" &&
                                        prop.state.lockStatus !== undefined &&
                                        prop.state.lockStatus === "Y"
                                          ? true
                                          : false
                                      }
                                      className="basic-multi-select"
                                      options={selectValues.contractIdOptions}
                                      id="contractIdDropdown"
                                      isMulti={false}
                                      onChange={(selectValue, event) =>
                                        handleLinearSelectChange(
                                          selectValue,
                                          event,
                                          setFieldValue
                                        )
                                      }
                                      value={apiTestState.contractId}
                                      //   defaultValue={{ label: 'Yes', value: 'Yes' }}
                                      placeholder="Contract Id"
                                      isClearable={
                                        prop.state.stageName === "Config"
                                          ? false
                                          : true
                                      }
                                      isSearchable={
                                        document.documentElement.clientHeight >
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
                                name="contractId"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {formName.current !==
                    "Ancillary/Facility Demographic Modification" ? (
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-Products"
                        >
                          <button
                            className="accordion-button accordionButtonStyle"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseProducts"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseOne"
                          >
                            Products
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseProducts"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Products"
                        >
                          <div className="accordion-body">
                            <div className="row">
                              {/* <div className="col-xs-6 col-md-3">
                              <label htmlFor="medicaidSwitch">Medicaid</label>
                              <br />
                              <Switch
                                id="medicaidSwitch"
                                name="medicaid"
                                onChange={(isChecked) => {
                                  setApiTestState({
                                    ...apiTestState,
                                    Medicaid: isChecked,
                                  });
                                }}
                                checked={
                                  apiTestState.Medicaid !== undefined
                                    ? apiTestState.Medicaid
                                    : false
                                }
                                uncheckedIcon={false}
                                checkedIcon={false}
                                disabled={
                                  tabRef.current === "DashboardView" &&
                                  prop.state.lockStatus !== undefined &&
                                  prop.state.lockStatus === "Y"
                                    ? true
                                    : false
                                }
                              />
                            </div> */}
                              <div className="col-xs-6 col-md-3">
                                <label htmlFor="medicaidSwitch">Medicare</label>
                                <br />
                                <Switch
                                  id="medicareSwitch"
                                  name="medicare"
                                  onChange={(isChecked) => {
                                    if (formikInitializeState) {
                                      setFormikInitializeState(false);
                                    }
                                    setApiTestState({
                                      ...apiTestState,
                                      Medicare: isChecked,
                                    });
                                  }}
                                  checked={
                                    apiTestState.Medicare !== undefined
                                      ? apiTestState.Medicare
                                      : true
                                  }
                                  uncheckedIcon={false}
                                  checkedIcon={false}
                                  disabled={
                                    tabRef.current === "DashboardView" &&
                                    prop.state.lockStatus !== undefined &&
                                    prop.state.lockStatus === "Y"
                                      ? true
                                      : false
                                  }
                                />
                              </div>
                              {/* <div className="col-xs-6 col-md-3">
                                            <label htmlFor="medicaidSwitch">Exchange</label>
                                            <br/>
                                            <Switch id="exchangeSwitch" name="exchange" onChange={isChecked => {
                                                setApiTestState({
                                                    ...apiTestState,
                                                    Exchange: isChecked
                                                });
                                            }} checked={apiTestState.Exchange}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            /> */}
                              {/* <div className="form-floating">
                                            <div className="form-check form-switch">

                                                <input className="form-check-input" type="checkbox" id="exchangeSwitch" name="exchange" onChange={event => handleSwitchChange(event)} value={apiTestState.exchange}/>
                                            </div>
                                            </div> */}
                              {/* </div> */}
                              {/* <div className="col-xs-6 col-md-3">
                                            <label htmlFor="medicaidSwitch">Commercial</label>
                                            <br/>
                                            <Switch id="commercialSwitch" name="commercial" onChange={isChecked => {
                                                setApiTestState({
                                                    ...apiTestState,
                                                    Commercial: isChecked
                                                });
                                            }} checked={apiTestState.Commercial}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            /> */}
                              {/* <div className="form-floating">
                                            <div className="form-check form-switch">

                                                <input className="form-check-input" type="checkbox" id="commercialSwitch" name="commercial" onChange={event => handleSwitchChange(event)} value={apiTestState.commercial}/>
                                            </div>
                                            </div> */}
                              {/* </div> */}

                              <div className="col-xs-6 col-md-4">
                                <Field name="states">
                                  {({
                                    field, // { name, value, onChange, onBlur }
                                    form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                    meta,
                                  }) => (
                                    <div className="form-floating">
                                      <Select
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
                                        name={field.name}
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
                                        id="statesDropdown"
                                        isMulti={true}
                                        onChange={(selectValue, event) =>
                                          handleLinearSelectChange(
                                            selectValue,
                                            event,
                                            setFieldValue
                                          )
                                        }
                                        isClearable={false}
                                        value={apiTestState.states}
                                        placeholder="States"
                                        //isClearable
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

                                      {apiTestState?.states?.length > 0 && (
                                        <ClearIndicator
                                          formikSetFieldValue={setFieldValue}
                                        />
                                      )}
                                    </div>
                                  )}
                                </Field>
                                <ErrorMessage
                                  component="div"
                                  name="states"
                                  className="invalid-feedback"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}

                    {/* Added by Shivani to view Crendential Information at Credspecialist and QA Stage */}
                    {((prop.state.formView === "DashboardView" &&
                      (prop.state.stageName === "Cred Specialist" ||
                        prop.state.stageName === "QA")) ||
                      prop.state.formView === "HomeView" ||
                      prop.state.formView === "DashboardHomeView") &&
                    formName.current !==
                      "Ancillary/Facility Demographic Modification" ? (
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-Credential"
                        >
                          <button
                            className="accordion-button accordionButtonStyle"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseCredential"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseOne"
                          >
                            Credential Information
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseCredential"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Credential"
                        >
                          <div className="accordion-body">
                            <div className="row">
                              <div className="col-xs-6 col-md-12">
                                <table
                                  className="table table-bordered tableLayout"
                                  id="QuestionTable"
                                >
                                  <thead>
                                    <tr className="tableRowStyle tableHeaderColor">
                                      <th style={{ width: "9%" }} scope="col">
                                        Question#
                                      </th>
                                      <th style={{ width: "76%" }} scope="col">
                                        Questions
                                      </th>
                                      <th
                                        style={{ textAlign: "center" }}
                                        scope="col"
                                      >
                                        Yes/No
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>{questionData()}</tbody>
                                </table>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div />
                    )}
                  </fieldset>
                  <div className="accordion-item">
                    <h2
                      className="accordion-header"
                      id="panelsStayOpen-License"
                    >
                      <button
                        className="accordion-button accordionButtonStyle"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseLicense"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                      >
                        Profession
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseLicense"
                      className="accordion-collapse collapse show"
                      aria-labelledby="panelsStayOpen-License"
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-xs-6 col-md-12">
                            <LicenseTable
                              licenseTableRowsData={licenseTableRowsData}
                              addTableRows={addTableRows}
                              deleteTableRows={deleteTableRows}
                              handleGridSelectChange={handleGridSelectChange}
                              handleGridDateChange={handleGridDateChange}
                              handleGridFieldChange={handleGridFieldChange}
                              gridRowsFinalSubmit={gridRowsFinalSubmit}
                              gridFieldTempState={gridFieldTempState}
                              editTableRows={editTableRows}
                              selectJson={selectValues}
                              lockStatus={
                                prop.state !== null &&
                                prop.state.lockStatus !== undefined &&
                                prop.state.lockStatus !== ""
                                  ? prop.state.lockStatus
                                  : "N"
                              }
                              fetchAutoPopulate={fetchAutoPopulate}
                              transactionType={AddFacilityAncillary.displayName}
                              apiTestState={apiTestState}
                            ></LicenseTable>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2
                      className="accordion-header"
                      id="panelsStayOpen-Speciality"
                    >
                      <button
                        className="accordion-button accordionButtonStyle"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseSpeciality"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                      >
                        Specialty
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapseSpeciality"
                      className="accordion-collapse collapse show"
                      aria-labelledby="panelsStayOpen-Speciality"
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-xs-6 col-md-12">
                            <SpecialityTable
                              specialityTableRowsData={specialityTableRowsData}
                              addTableRows={addTableRows}
                              deleteTableRows={deleteTableRows}
                              handleGridSelectChange={handleGridSelectChange}
                              handleGridFieldChange={handleGridFieldChange}
                              gridRowsFinalSubmit={gridRowsFinalSubmit}
                              gridFieldTempState={gridFieldTempState}
                              editTableRows={editTableRows}
                              selectJson={selectValues}
                              lockStatus={
                                prop.state !== null &&
                                prop.state.lockStatus !== undefined &&
                                prop.state.lockStatus !== ""
                                  ? prop.state.lockStatus
                                  : "N"
                              }
                              handleGridOnBlur={handleGridOnBlur}
                              fetchAutoPopulate={fetchAutoPopulate}
                              subSpecialityOptions={subSpecialityOptions}
                              transactionType={AddFacilityAncillary.displayName}
                              apiTestState={apiTestState}
                            ></SpecialityTable>
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
                        {/* Provider Address */}
                        {prop.state.formView === "DashboardView"
                          ? prop.state.formNames === "Add a Facility"
                            ? "Facility"
                            : "Ancillary"
                          : prop.state.formNames === "AddFacility"
                          ? "Facility"
                          : "Ancillary"}{" "}
                        Address
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
                              deleteTableRows={deleteTableRows}
                              handleGridSelectChange={handleGridSelectChange}
                              handleGridFieldChange={handleGridFieldChange}
                              gridRowsFinalSubmit={gridRowsFinalSubmit}
                              gridFieldTempState={gridFieldTempState}
                              editTableRows={editTableRows}
                              selectJson={selectValues}
                              calledFormName={AddFacilityAncillary.validate}
                              modifyValidatedAddressRow={
                                modifyValidatedAddressRow
                              }
                              lockStatus={
                                prop.state !== null &&
                                prop.state.lockStatus !== undefined &&
                                prop.state.lockStatus !== ""
                                  ? prop.state.lockStatus
                                  : "N"
                              }
                              fetchAutoPopulate={fetchAutoPopulate}
                              dbaNameFacAnci={values.dbaName}
                              transactionType={AddFacilityAncillary.displayName}
                              apiTestState={apiTestState}
                            ></LocationTable>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="accordion-item">
                    <h2 className="accordion-header" id="panelsStayOpen-Pay">
                      <button
                        className="accordion-button accordionButtonStyle"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapsePay"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                      >
                        Pay To
                      </button>
                    </h2>
                    <div
                      id="panelsStayOpen-collapsePay"
                      className="accordion-collapse collapse show"
                      aria-labelledby="panelsStayOpen-Pay"
                    >
                      <div className="accordion-body">
                        <div className="row">
                          <div className="col-xs-6 col-md-12">
                            <PayToTable
                              payToTableRowsData={payToTableRowsData}
                              addTableRows={addTableRows}
                              deleteTableRows={deleteTableRows}
                              calledFormName={AddFacilityAncillary.validate}
                              handleGridSelectChange={handleGridSelectChange}
                              handleGridFieldChange={handleGridFieldChange}
                              gridRowsFinalSubmit={gridRowsFinalSubmit}
                              gridFieldTempState={gridFieldTempState}
                              editTableRows={editTableRows}
                              selectJson={selectValues}
                              modifyValidatedAddressPayToRow={
                                modifyValidatedAddressPayToRow
                              }
                              lockStatus={
                                prop.state !== null &&
                                prop.state.lockStatus !== undefined &&
                                prop.state.lockStatus !== ""
                                  ? prop.state.lockStatus
                                  : "N"
                              }
                              fetchAutoPopulate={fetchAutoPopulate}
                              transactionType={AddFacilityAncillary.displayName}
                              apiTestState={apiTestState}
                            ></PayToTable>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* Added by Shivani to view Insurance Details at Credspecialist and QA Stage */}
                  {((prop.state.formView === "DashboardView" &&
                    (prop.state.stageName === "Cred Specialist" ||
                      prop.state.stageName === "QA")) ||
                    prop.state.formView === "HomeView" ||
                    prop.state.formView === "DashboardHomeView") &&
                  formName.current !==
                    "Ancillary/Facility Demographic Modification" ? (
                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-Insurance"
                      >
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseInsurance"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseInsurance"
                        >
                          Insurance Details
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseInsurance"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-Insurance"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-xs-6 col-md-12">
                              <InsuranceTable
                                insuranceTableRowsData={insuranceTableRowsData}
                                addTableRows={addTableRows}
                                deleteTableRows={deleteTableRows}
                                handleGridSelectChange={handleGridSelectChange}
                                handleGridDateChange={handleGridDateChange}
                                handleGridFieldChange={handleGridFieldChange}
                                gridRowsFinalSubmit={gridRowsFinalSubmit}
                                gridFieldTempState={gridFieldTempState}
                                editTableRows={editTableRows}
                                lockStatus={
                                  prop.state !== null &&
                                  prop.state.lockStatus !== undefined &&
                                  prop.state.lockStatus !== ""
                                    ? prop.state.lockStatus
                                    : "N"
                                }
                              ></InsuranceTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div />
                  )}

                  {tabRef.current === "HomeView" && (
                    <DocumentSection
                      fileDataRef={documentSectionDataRef.current}
                      displayName={formName}
                      flowId={credentialingConfigData["FlowId"]}
                    />
                  )}
                  {/* Added by Shivani to view Crendential Checklist at Credspecialist and QA Stage */}
                  {/* Modified by NG to not show CC for delegated Yes cases. */}
                  {hideandShow.show === true &&
                  apiTestState.delegated?.value &&
                  apiTestState.delegated.value.toLowerCase() === "no" &&
                  (prop.state.stageName === "Cred Specialist" ||
                    prop.state.stageName === "QA") ? (
                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-Credential"
                      >
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseCredential"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseCredential"
                        >
                          Credential Checklist
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseCredential"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-Credential"
                      >
                        <div className="accordion-body">
                          <div className="row">
                            <div className="col-xs-6 col-md-12">
                              <CredentialTable
                                credentialTableRowsData={
                                  credentialTableRowsData
                                }
                                addTableRows={addTableRows}
                                deleteTableRows={deleteTableRows}
                                handleGridSelectChange={handleGridSelectChange}
                                handleGridFieldChange={handleGridFieldChange}
                                gridRowsFinalSubmit={gridRowsFinalSubmit}
                                gridFieldTempState={gridFieldTempState}
                                editTableRows={editTableRows}
                                selectJson={selectValues}
                                lockStatus={
                                  prop.state !== null &&
                                  prop.state.lockStatus !== undefined &&
                                  prop.state.lockStatus !== ""
                                    ? prop.state.lockStatus
                                    : "N"
                                }
                              ></CredentialTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 30,
                      marginBottom: 20,
                    }}
                  >
                    <button
                      id="mainFormSubmit"
                      type="button"
                      className="providerPageButton button"
                      onClick={(event) => {

                        if (callProcRef.current === "notCallProc" || prop?.state?.decision?.toLowerCase() === 'discard') {

                          saveData(values);
                        } else {
                          validateForm().then((errors) => {
                            checkErrorsAndFocusOnFields(
                              errors,
                              setFieldTouched,
                              handleSubmit,
                              event
                            );
                          });
                        }
                      }}
                      style={{ display: "none" }}
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
    );
  };

  const callProcRef = useRef(null);
  const callFormSubmit = (evnt) => {
    // document.getElementById('mainFormSubmit').click();
    //const x = document.getElementById('mainFormSubmit').getAttribute("onclick");
    //console.log("onclick function: ",evnt.target)
    if (evnt.target.name == "saveSubmit") {
      callProcRef.current = "callProc";
    }

    if (evnt.target.name == "saveExit") {
      callProcRef.current = "notCallProc";
    }
    document.getElementById("mainFormSubmit").click();
  };

  const spinner = (
    <BallTriangle
      height={100}
      width={100}
      radius={5}
      color="black"
      ariaLabel="ball-triangle-loading"
      wrapperClass={{}}
      wrapperStyle=""
      visible={true}
    />
  );

  return (
    <>
      <div
        className="AddFacilityAncillary backgroundColor"
        style={{ minHeight: "100vh" }}
      >
        <Loader show={loaderState} message={spinner}>
          {tabRef.current === "DashboardView" && <CaseInformation />}
          <div className="container">
            <div className="row">
              <div className="col-xs-6" style={{ textAlign: "center" }}>
                <br />
                <button
                  type="button"
                  className="btn btn-outline-primary btnStyle"
                  onClick={(event) => navigateHome(event)}
                  style={{ float: "left", marginLeft: "10px" }}
                >
                  Go To Home
                </button>
                {/* <button type="submit" className="providerPageButton button" onClick={event => {handleSubmit()}}>{isSubmitting?"Saving":"Save"}</button> */}
                <label id="tileFormLabel" className="HeadingStyle">
                  {formName.current}
                </label>
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
              </div>
            </div>
          </div>
          <br />
          <div className="container">
            <div className="row">{populateFormBasisOnType()}</div>
          </div>
        </Loader>
        {/* <footer className="footerStyle">
          <div className="content-wrapper">
            <div className="float-left">
              <h6></h6>
            </div>
          </div>
        </footer> */}
        <FooterComponent />
      </div>

      {/* <footer style={{boxShadow: "0 2px 4px 0 rgb(0 0 0 / 15%)",background:"white",margin:"20px"}}>

            </footer> */}
    </>
  );
}
