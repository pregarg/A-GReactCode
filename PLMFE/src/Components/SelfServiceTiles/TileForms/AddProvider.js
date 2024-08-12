import React, { useState, useEffect, useRef } from "react";
import ReactDatePicker from "react-datepicker";
import { useLocation, useNavigate } from "react-router-dom";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import "react-datepicker/dist/react-datepicker.css";
// import axios from 'axios';
// import customAxios from "../../../api/axios";
import "../TileFormsCss/AddProvider.css";
import Multiselect from "multiselect-react-dropdown";
import Select, { components } from "react-select";
import Switch from "react-switch";
import SpecialityTable from "../TileFormsTables/SpecialityTable";
import LicenseTable from "../TileFormsTables/LicenseTable";
import LocationTable from "../TileFormsTables/LocationTable";
import PayToTable from "../TileFormsTables/PayToTable";
import EducationTable from "../TileFormsTables/EducationTable";
import TrainingTable from "../TileFormsTables/TrainingTable";
import WorkTable from "../TileFormsTables/WorkTable";
import CredentialTable from "../TileFormsTables/CredentialTable";
import InsuranceTable from "../TileFormsTables/InsuranceTable";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import useFormikValidation from "../../CustomHooks/useFormikValidation";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector, useStore } from "react-redux";
import { RxCross2 } from "react-icons/rx";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import FooterComponent from "../../FooterComponent";
import { Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import ReferenceTab from "../../../WorkItemDashboard/ReferenceTab";
import DocumentSection from "../DocumentSection";
import { useAxios } from "../../../api/axios.hook";
import { data, event } from "jquery";
import AlertModal from "../TileFormModals/AlertModal";
import useCallApi from "../../CustomHooks/useCallApi";
import CompensationTab from "../../ContractingHome/ContractingTileForms/CompensationTab";
//import MuiDatePicker from "../../CommonComponents/MuiDatePicker";

const override = {
  display: "block",
  position: "fixed",
  top: "40%",
  left: "40%",
  zIndex: "10",
  margin: "0 auto",
};

const checkDataAvailable = (data) => {
  if (data == undefined || data == null) {
    return "";
  } else {
    return data;
  }
};

const getTransformed = (dataObj) => {
  const transformedObj = {};
  Object.keys(dataObj).forEach((key) => {
    if (dataObj[key]) {
      transformedObj[key] = dataObj[key];
    }
  });
  return transformedObj;
};

const populateAccessibility = (node, staticValue) => {
  return checkDataAvailable(node.Accessibility)
    ? Array.isArray(node.Accessibility)
      ? node.Accessibility.map((data1) =>
        !!checkDataAvailable(data1.Accessibility) &&
          checkDataAvailable(data1.Accessibility.AccessibilityDescription) ==
          staticValue &&
          checkDataAvailable(data1.AccessibilityFlag) == "1"
          ? "Yes"
          : "No"
      ).indexOf("Yes") > -1
        ? { label: "Yes", value: "Y" }
        : { label: "No", value: "N" }
      : !!checkDataAvailable(node.Accessibility.Accessibility) &&
        checkDataAvailable(
          node.Accessibility.Accessibility.AccessibilityDescription
        ) == staticValue &&
        checkDataAvailable(node.Accessibility.AccessibilityFlag) == "1"
        ? { label: "Yes", value: "Y" }
        : { label: "No", value: "N" }
    : { label: "No", value: "N" };
};

const initState = {
  organizationName: "",
  firstName: "",
  middleName: "",
  lastName: "",
  suffix: "",
  caqhId: "",
  caqhNpiId: "",
  ssn: "",
  medicareId: "",
  medicaidId: "",
  ecfmgNumber: "",
  attestationId: "",
  emailId: "",
  gender: "",
  delegated: "",
  contractId: "",
  agesSeen: "",
  states: "",
};

export default function AddProvider() {
  let prop = useLocation();
  AddProvider.validate = "shouldValidate";
  AddProvider.displayName = "Add a Provider";
  //AddProvider.displayName = "Address Modification";
  //console.log("Use Selector: ",useSelector((state) => console.log("State: ",state)));

  const { customAxios } = useAxios();
  const userType = useSelector((store) => store.auth.userType);

  const [gridFieldTempState, setGridFieldTempState] = useState({});

  console.log("Custom Axios Add Provider: ", customAxios);
  const mastersSelector = useSelector((masters) => masters);
  console.log("Masters Selector: ", mastersSelector);
  const authData = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);
  const masterUserName = mastersSelector.hasOwnProperty("auth")
    ? mastersSelector.auth.hasOwnProperty("userName")
      ? mastersSelector.auth.userName
      : "system"
    : "system";
  const { fileUpDownAxios } = useAxios();
  const [buttonDisableFlag, setButtonDisableFlag] = useState(false);
  //const [dupNpiIdFlag, setDupNpiIdFlag] = useState(true);

  let documentSectionDataRef = useRef([]);

  let credentialingConfigData = JSON.parse(
    process.env.REACT_APP_CREDENTIALING_DETAILS
  );
  const dispatch = useDispatch();
  const [loadForm, setLoadForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [caqhModal, setCaqhModal] = useState({
    id: null,
    header: null,
    body: null,
    show: false,
  });
  const [caqhGenericModal, setCaqhGenericModal] = useState({
    header: null,
    body: null,
    state: false,
  });

  //Added by Nidhi Gupta on 09/26/2023
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
  const caseData = useSelector((store) => store.dashboardNavigationState);

  const linearFieldsRef = useRef({});

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

  console.log(
    apiTestStateComp,
    "apiTestStateCompapiTestStateCompapiTestStateComp"
  );
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
    //console.log(" handleLinearSelectChangeComp evnt.name: ", evnt.name);
    //console.log(" handleLinearSelectChangeComp selectValue: ", selectValue);


    const { name } = evnt;
    let groupRiskIdValue = apiTestStateComp.groupRiskId;

    let networkIdValue = apiTestStateComp.networkId;

    if (name === "riskState" || name === "riskAssignment") {
      let riskStateValue = "";
      let riskValue = "";
      let taxValue = "";

      ///

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
      //console.log('Inside handleMedicalGrpNoShow riskStateValue: ',riskStateValue);
      //console.log('Inside handleMedicalGrpNoShow riskValue: ',riskValue);
      //console.log('Inside handleMedicalGrpNoShow taxValue: ',taxValue);
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
      networkIdValue = planValue + networkStateValue;
      //console.log('Inside handleNetworkIdShow networkStateValue: ',networkStateValue);
      //console.log('Inside handleNetworkIdShow planValue: ',planValue);
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
  //Till Here
  const [alertModalShow, setAlertModalShow] = useState({ show: false });

  const [formikInitializeState, setFormikInitializeState] = useState(false);
  console.log("decision value11", prop.state.stageName);
  const validationSchema = (prop) => {
    return Yup.object().shape({
      organizationName: Yup.string()
        .required("Please enter Legal Entity Name")
        .max(100, "Legal Entity Name max length exceeded"),
      firstName: Yup.string()
        .required("Please enter First Name")
        .max(100, "First Name max length exceeded"),
      middleName: Yup.string()
        //  .required('Please enter Middle Name')
        .max(100, "Middle Name max length exceeded"),
      lastName: Yup.string()
        .required("Please enter Last Name")
        .max(100, "Last Name max length exceeded"),
      suffix: Yup.string()
        //  .required('Please enter Suffix')
        .max(10, "Suffix max length exceeded"),
      delegated: Yup.object()
        .nullable()
        .required("Please select Delegated")
        .test("prohibitedValuesTest", "Please Select Delegated", (value) =>
          testYupFieldValue(value)
        ),

      caqhId: Yup.string()
        .when("delegated", {
          is: (del) => {
            return checkYupValidation(del, prop.state.decision);
          },
          then: (schema) => schema.notRequired(),
          otherwise: (schema) => schema.required("Please enter CAQH ID"),
        })
        //     .typeError('CAQH ID must be a number')
        .max(10, "CAQH ID max length exceeded")
        .matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
          "Only numbers are accepted"
        ),
      caqhNpiId: Yup.string()
        //        .typeError('NPI ID must be a number')
        .required("Please enter NPI ID")
        .max(10, "NPI ID max length exceeded")
        .matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
          "Only numbers are accepted"
        ),
      ssn: Yup.string()
        .when("delegated", {
          is: (del) => {
            return checkYupValidation(del, prop.state.decision);
          },
          then: (schema) => schema.notRequired(),
          otherwise: (schema) => schema.required("Please enter SSN Number"),
        })
        //        .typeError('SSN must be a number')
        .min(9, "SSN length should be 9 digits")
        .max(9, "SSN max length exceeded")
        .matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
          "Only numbers are accepted"
        ),
      medicareId: Yup.string()
        //        .typeError('Medicare ID must be a number')
        .required("Please enter Medicare ID")
        .max(10, "Medicare ID max length exceeded"),
      //       .matches(/(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,'Only numbers are accepted'),
      medicaidId: Yup.string()
        //       .typeError('Medicaid ID must be a number')
        //  .required("Please enter Medicaid ID")
        .max(15, "Medicaid ID max length exceeded")
        .matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
          "Only numbers are accepted"
        ),
      ecfmgNumber: Yup.string()
        //       .typeError('ECFMG Number must be a number')
        // .required('Please enter ECFMG Number')
        .max(13, "ECFMG Number max length exceeded")
        .matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
          "Only numbers are accepted"
        ),
      attestationId: Yup.string()
        .when("delegated", {
          is: (del) => {
            return checkYupValidation(del, prop.state.decision);
          },
          then: (schema) => schema.notRequired(),
          otherwise: (schema) => schema.required("Please enter Attestation ID"),
        })
        .max(10, "Attestation ID max length exceeded")
        .matches(
          /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
          "Only numbers are accepted"
        ),
      //New Nidhi
      emailId: Yup.string()
        .email("Please enter valid Email Id")
        .required("Please enter Email Id")
        .max(50, "Email Id max length exceeded"),
      //Till here
      gender: Yup.object()
        .when("delegated", {
          is: (del) => {
            return checkYupValidation(del, prop.state.decision);
          },
          then: (schema) =>
            schema
              .required("Please select Gender")
              .test("prohibitedValuesTest", "Please Select Gender", (value) =>
                testYupFieldValue(value)
              ),
          otherwise: (schema) => schema.notRequired(),
        })
        //.notOneOf([{label:'',value:''},{label:undefined,value:undefined}], 'Please Select Gender')
        .nullable(),

      agesSeen: Yup.object()
        .when("delegated", {
          is: (del) => {
            return checkYupValidation(del, prop.state.decision);
          },
          then: (schema) =>
            schema
              .required("Please select Ages Seen")
              .test("prohibitedValuesTest", "Please Select Ages Seen", (value) =>
                testYupFieldValue(value)
              ),
          otherwise: (schema) => schema.notRequired(),
        })
        .nullable(),

      contractId: Yup.object()
        .when("delegated", {
          is: (del) => {
            console.log("validated Prop", prop.state.decision);
            return checkYupValidation(del, prop.state.decision);
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

      // Medicare: Yup.boolean().when("delegated", {
      //   is: (del) => {
      //     return checkYupValidation(del);
      //   },
      //   then: (schema) =>
      //     schema
      //       .oneOf([true], "Medicare is required")
      //       .required("Medicare is required"),
      //   otherwise: (schema) => schema.notRequired(),
      // }),
    });
  }

  const checktaxdec = (data) => {
    console.log("y------------------->" + data);
    const taxDescValues =
      mastersSelector["masterTaxonomyCode"].length === 0
        ? []
        : mastersSelector["masterTaxonomyCode"][0].data;
    console.log(taxDescValues);
    if (taxDescValues && taxDescValues.length) {
      const desc = taxDescValues.find((val) => {
        return val.taxonomycode.trim() == data.trim();
      });
      if (desc && desc.taxonomydesc) {
        return desc.taxonomydesc;
      } else {
        return "";
      }
    } else {
      return "";
    }
  };

  const checkSubSpeciality = (inpJson) => {
    console.log("checkSubSpeciality------------------->", inpJson);
    let retValue = "";
    const specialityValues =
      mastersSelector["masterSpeciality"].length === 0
        ? []
        : mastersSelector["masterSpeciality"][0].data;
    console.log(specialityValues);
    if (specialityValues && specialityValues.length) {
      const desc = specialityValues.find((val) => {
        //console.log("checkSubSpeciality find val------------------->" ,val);
        return val.speciality.trim() == inpJson.speciality.trim();
      });
      printConsole("Inside checkSubSpeciality function found json: ", desc);
      if (desc) {
        inpJson.subSpeciality = desc.subSpeciality;
        inpJson.hsdCode = desc.hsdCodeValue;
      }
    }
    return inpJson;
  };

  //const {validate,errors,handleSubmit} = useValidateForm();

  const {
    submitCase,
    updateLockStatus,
    validateGridData,
    printConsole,
    getNPIFromMaster,
    validatePotentialDup,
    validatePotentialDupDec,
    setContractIdDropDown,
    updateDecision,
    getCountyFromMaster,
    CompareJSON,
    checkDecision,
  } = useUpdateDecision();

  const { checkErrorsAndFocusOnFields, checkYupValidation, testYupFieldValue } =
    useFormikValidation();

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
  const { getLinkingData } = useCallApi();
  const caqhId = useRef();
  const caqhNpiIdRef = React.useRef();
  //let apiUrl = 'http://localhost:8081/api/';
  // const languageArray=[];
  // const ethnicityArray=[];
  // const salutationArray=[];
  // const agesSeenArray=[];
  // const licenseTypeArray=[];


  //Nidhi
  let quesAnsList = [];
  //here 00
  const navigate = useNavigate();
  const tabRef = useRef("HomeView");
  const hideandShow = useRef(null);
  const fetchAutoPopulate = useRef(false);

  const navigateHome = async () => {
    setButtonDisableFlag(false);
    if (prop.state.formView === "DashboardView") {
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

    if (prop.state.formView === "DashboardHomeView") {
      navigate("/DashboardLogin/Home", { replace: true });
    }

    if (prop.state.formView === "HomeView") {
      navigate("/Home", { replace: true });
    }
  };

  //const languageRef = React.createRef();
  //const genderRef = React.createRef();
  //const agesSeeneRef = React.createRef();
  //const salutationRef = React.createRef();
  //const newPatientsRef = React.createRef();
  //const licenseTypeRef = React.createRef();
  //const ethnicityRef = React.createRef();
  //const placeInDirectoryRef = React.createRef();
  //const ecfmgQuesRef = React.createRef();

  /*let getEndpoints = [
        apiUrl+'master/languages',
        apiUrl+'master/agesSeen',
        apiUrl+'master/salutation',
        apiUrl+'master/licenseType',
        apiUrl+'master/ethnicity'
      ];*/

  const onErr = (response, typeOfRequest = "") => {
    console.log(response, typeOfRequest);
    if ((typeOfRequest = "masterStateSymbol")) {
      //do something on failed request
    }
  };

  const [selectValues, setSelectValues] = useState({});
  const [subSpecialityOptions, setSubSpecialityOptions] = useState([]);
  const [potentialDupData, setPotentialDupData] = useState([]);

  //Nidhi commented this
  //const [addQuesValues, setAddQuesValues] = useState([]);
  //here
  //const [selectLicenseGridValues, setSelectLicenseGridValues] = useState({});

  const onSuccess = (response, typeOfRequest) => { };
  //     languageArray:[],
  //     agesSeenArray:[],
  //     salutationArray:[],
  //     licenseTypeArray:[],
  //     ethnicityArray:[]
  // });
  const abc = "auto";
  //const [selectValues,setSelectValues] = useState({});

  printConsole("Add Provider INitial state getting called");
  const [apiTestState, setApiTestState] = useState(initState);

  // const demoData = [{
  //     specialityDefault:{},
  //     primaryDefault:{ value: 'No', label: 'No' },
  //     pcpDefault:{ value: 'Yes', label: 'Yes' }
  // },
  // {
  //     specialityDefault:{},
  //     primaryDefault:{ value: 'Yes', label: 'Yes' },
  //     pcpDefault:{ value: 'No', label: 'No' }
  // }];

  const [specialityTableRowsData, setspecialityTableRowsData] = useState([]);

  //const specialityTableRowsData = useRef([]);

  const [licenseTableRowsData, setLicenseTableRowsData] = useState([]);

  const [locationTableRowsData, setLocationTableRowsData] = useState([]);

  const [payToTableRowsData, setPayToTableRowsData] = useState([]);

  const [educationTableRowsData, setEducationTableRowsData] = useState([]);

  const [trainingTableRowsData, setTrainingTableRowsData] = useState([]);

  const [workTableRowsData, setWorkTableRowsData] = useState([]);

  const [insuranceTableRowsData, setInsuranceTableRowsData] = useState([]);

  const [credentialTableRowsData, setCredentialTableRowsData] = useState([]);

  //const [additionalQuesRowsData, setAdditionalQuesRowsData] = useState([]);
  //Nidhi
  const [quesAnsListJson, setQuesAnsListJson] = useState([]);

  const [apiCallOnce, setApiCallOnce] = useState(false);
  //here

  //Added Newly by Nidhi Gupta on 6/2/2023
  //Program to implement Luhn algorithm
  // Returns true if given
  // NPI ID is valid
  const checkLuhn = (caqhNpiId) => {
    console.log("Inside onBlur event of NPI ID");
    if (caqhNpiId !== undefined && caqhNpiId.length > 0) {
      var tmp;
      var sum;
      var i;
      var j;
      i = caqhNpiId.length;
      if (i == 15 && caqhNpiId.indexOf("80840", 0, 5) == 0) sum = 0;
      else if (i == 10) sum = 24;
      else return "This is not a valid NPI ID";
      // caqhNpiIdRef.current.focus();

      j = 0;
      while (i != 0) {
        tmp = caqhNpiId.charCodeAt(i - 1) - "0".charCodeAt(0);
        if (j++ % 2 != 0) {
          if ((tmp <<= 1) > 9) {
            tmp -= 10;
            tmp++;
          }
        }
        sum += tmp;
        i--;
      }
      if (sum % 10 == 0) {
      }
      // alert("This is a valid NPI ID");
      else return "This is not a valid NPI ID";
      //caqhNpiIdRef.current.focus();
    }

    //Checking NPI duplicate here
    /*if (caqhNpiId!==undefined && caqhNpiId.length ==10) {

        let getApiJson= {};
        getApiJson['option'] = 'FindDuplicateNpiId';
        getApiJson['Type'] = 'SelfService';
          getApiJson['NpiId'] = caqhNpiId;
          getApiJson['FlowId'] =credentialingConfigData["FlowId"];
          console.log("Input params for FindDuplicateNpiId: ",getApiJson);
          customAxios.post('/generic/callProcedure',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
            console.log('Get data Response for FindDuplicateNpiId: ',res)
            if(res.data.CallProcedure_Output.Status === 0){
                let respData = [...res.data.CallProcedure_Output.data];
                //respData = JSON.parse(respData)
                console.log('Get data Response for FindDuplicateNpiId 2: ',respData[0])
               if(respData[0]==0){
                console.log("FindDuplicateNpiId This a not a duplicate NPI ID");

               }

               else
               {
                console.log("FindDuplicateNpiId This is a duplicate NPI");
                  //alert("This is a duplicate NPI");
                  //return ;
                return "This is a duplicate NPI";


              }

              }
          }).catch((err) => {
              console.log("Caught in catch of FindDuplicateNpiId proc calling: ",err.message);
          });

    }*/
  };

  /*const npiOnBlur = (e, values) => {
    console.log("Inside npiOnBlur()");
    if (e.target.name === "caqhNpiId") {
      const caqhNpiId = e.target.value;
      printConsole("Inside add provider fields on blur: ", caqhNpiId);
       if (caqhNpiId!==undefined && caqhNpiId.length ==10) {

        let getApiJson= {};
        getApiJson['option'] = 'FindDuplicateNpiId';
        getApiJson['Type'] = 'SelfService';
          getApiJson['NpiId'] = caqhNpiId;
          getApiJson['FlowId'] =credentialingConfigData["FlowId"];
          getApiJson['TransactionType'] = AddProvider.displayName;
          getApiJson['ContractId'] = (apiTestState.contractId !== undefined && apiTestState.contractId !== null)
          ? apiTestState.contractId.value
          : "";
          getApiJson['LegalEntityName'] = values.organizationName!==undefined?values.organizationName.trim():'';
          console.log("Input params for FindDuplicateNpiId: ",getApiJson);
          customAxios.post('/generic/callProcedure',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
            console.log('Get data Response for FindDuplicateNpiId: ',res)
            if(res.data.CallProcedure_Output.Status === 0){
                let respData = [...res.data.CallProcedure_Output.data];
                //respData = JSON.parse(respData)
                console.log('Get data Response for FindDuplicateNpiId 2: ',respData[0])
                if(respData && respData[0]==0){
                setDupNpiIdFlag(true);
                console.log("FindDuplicateNpiId This a not a duplicate NPI ID");

               }

               else if(respData && respData[0]!=0)
               {
                setDupNpiIdFlag(false);
                console.log("FindDuplicateNpiId This is a duplicate NPI");
                  alert("This is a duplicate NPI ID. Please provide unique NPI ID.");
                  //caqhNpiIdRef.current.focus();
                  //caqhNpiId.focus();


                  //return ;
                //return "This is a duplicate NPI";


              }

              }
          }).catch((err) => {
              console.log("Caught in catch of FindDuplicateNpiId proc calling: ",err.message);
          });

    }

            }

        }*/
  //Till Here

  //Newly Added by NG on 11/21/2023
  const npiOnSave = async (values) => {
    try {
      const getApiJson = {
        option: "FindDuplicateNpiId",
        Type: "SelfService",
        NpiId:
          values.caqhNpiId !== undefined
            ? typeof values.caqhNpiId === "string"
              ? values.caqhNpiId.trim()
              : values.caqhNpiId
            : "",
        FlowId: credentialingConfigData["FlowId"],
        TransactionType: AddProvider.displayName,
        ContractId: apiTestState.contractId?.value || "",
        LegalEntityName:
          values.organizationName !== undefined
            ? values.organizationName.trim()
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
                  console.log("Tab selected with key networkLinearTable:", k);
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

  useEffect(() => {
    try {
      console.log("nidhi prop.state: ", prop);
      // console.log("Auth Data: ", authData);

      /*TO DO: Need to uncomment this*/
      // if(!authData.isSignedIn){
      //     navigate('/', { replace: true });
      // }

      // let apiArray = [];
      // let selectJson = {};

      /*axios.all(getEndpoints.map((endpoint) => axios.get(endpoint))).then((res) => {
            if(res[0].status === 200){
               //apiTestState.languagesArray = [];
               res[0].data.map(element => apiArray.push(element));
               selectJson.languageArray = apiArray;
               //setSelectValues({...selectValues,languageArray:apiArray});
            }
            apiArray = [];
            if(res[1].status === 200){
                res[1].data.map(element => apiArray.push(element));
                //setSelectValues({...selectValues,agesSeenArray:apiArray});
                selectJson.agesSeenArray = apiArray;
                //console.log("apiTestState.languageArray: ",agesSeenArray);
             }
             apiArray = [];
             if(res[2].status === 200){
                res[2].data.map(element => apiArray.push(element));
                selectJson.salutationArray = apiArray;
                //setSelectValues({...selectValues,salutationArray:apiArray});
                console.log("apiTestState.salutationArray: ",apiArray);
             }
             if(res[3].status === 200){
                res[3].data.map(element => apiArray.push(element));
                //setSelectValues({...selectValues,licenseTypeArray:apiArray});
                selectJson.licenseTypeArray = apiArray;
                //console.log("apiTestState.languageArray: ",licenseTypeArray);
             }
             apiArray = [];
             if(res[4].status === 200){
                res[4].data.map(element => apiArray.push(element));
                setSelectValues({...selectValues,ethnicityArray:apiArray});
                //console.log("selectValues json: ",selectValues);
                selectJson.ethnicityArray = apiArray;
                //console.log("apiTestState.languageArray: ",ethnicityArray);
             }
             setSelectValues(selectJson);

         })
         .catch((err) => {
            console.log(err.message);
            //alert("Error in getting data");
         });*/
      //console.log("Received Props: ",prop);
      console.log("Call");
      // dispatch(getMasterAgesSeen(token, false, onErr, onSuccess));
      // dispatch(getMasterLanguages(token, false, onErr, onSuccess));
      // dispatch(getMasterSalutation(token, false, onErr, onSuccess));
      // dispatch(getMasterLicenseType(token, false, onErr, onSuccess));
      // dispatch(getMasterEthnicity(token, false, onErr, onSuccess));
      let selectJson = {};
      let additionalQuesValues = [];
      // console.log("master ages seen exists: ",mastersSelector['masterAgesSeen']);
      // console.log("master ages seen exists 22: ",mastersSelector['masterAgesSeen'].length);
      setFormikInitializeState(true);
      let newArr = [];
      if (mastersSelector.hasOwnProperty("masterAgesSeen")) {
        let newAgesSeenArray = [];
        let orgAgesSeenArray =
          mastersSelector["masterAgesSeen"].length === 0
            ? []
            : mastersSelector["masterAgesSeen"][0];
        for (let i = 0; i < orgAgesSeenArray.length; i++) {
          newAgesSeenArray.push({
            label: convertToCase(orgAgesSeenArray[i].agesSeen),
            value: convertToCase(orgAgesSeenArray[i].agesSeen),
          });
        }
        newAgesSeenArray.sort((a, b) => {
          const nameA = a.value.toLowerCase();
          const nameB = b.value.toLowerCase();
          if (nameA < nameB) return -1;
          if (nameA > nameB) return 1;
          return 0;
        });
        console.log("Sorted array ages seen ==== ", newAgesSeenArray);
        selectJson.agesSeenArray = newAgesSeenArray;
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
      //  if(mastersSelector.hasOwnProperty('masterStateSymbol')){
      //     selectJson.stateOptions = ((mastersSelector['masterStateSymbol'].length===0) ? [] : (mastersSelector['masterStateSymbol'][0].data));
      //  }

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
        let degreeOptions =
          mastersSelector["masterGraduateType"].length === 0
            ? []
            : mastersSelector["masterGraduateType"][0];

        for (const item of degreeOptions) {
          newArr.push(convertToCase(item.graduateType));
        }

        selectJson.degreeOptions = newArr;
        newArr = [];
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
        printConsole(
          "Inside getDashboardData provContLinkData Data: ",
          provContLinkData
        );
        if (provContLinkData.length > 0) {
          const contractIdData = provContLinkData[0][0];
          printConsole(
            "Inside getDashboardData contractIdData Data: ",
            contractIdData
          );
          if (contractIdData !== undefined) {
            if (contractIdData.hasOwnProperty("MainTable")) {
              arr1 = contractIdData["MainTable"];
              arr1 = arr1.filter((elem) => elem.StageName !== "Network");
              printConsole("Inside add provider useeffect arr1: ", arr1);
            }

            if (contractIdData.hasOwnProperty("ProvDetails")) {
              arr2 = contractIdData["ProvDetails"];
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

      //if(prop.state.formView !== "DashboardView"){
      setTimeout(() => setSelectValues(selectJson), 1000);
      //}

      // setTimeout( () => {console.log('selectLicenseJson: ', selectLicenseJson);setSelectLicenseGridValues(selectLicenseJson)}, 1000);

      // console.log("select grid vaLue: " , selectLicenseGridValues )
      //console.log("select ref outside: ",selectValues);

      //Added by Nidhi
      selectJson["additionalQues"]
        .filter(
          (data) =>
            data.TransactionType.toLowerCase() ==
            AddProvider.displayName.toLowerCase()
        )
        .map((val) =>
          additionalQuesValues.push({
            questionId: val.QuestionId,
            label: val.QuesDescription,
          })
        );

      console.log("additionalQuesValues here: ", additionalQuesValues);
      //console.log("selectValues.additionalQues: ", selectValues.additionalQues)

      setTimeout(() => {
        //setAddQuesValues(additionalQuesValues);
        if (quesAnsList === undefined || quesAnsList.length <= 0) {
          setQuesAnsListJson(additionalQuesValues);
          console.log("setTimeout setQuesAnsListJson: ", additionalQuesValues);
        }

        //console.log('setTimeout setAddQuesValues: ', additionalQuesValues)
      }, 1000);
      //till here 01

      //selectValues.additionalQues
      if (
        prop.state.formView !== undefined &&
        prop.state.formView === "DashboardView"
      ) {
        //console.log("Inside prop.state useeffect()");
        tabRef.current = "DashboardView";
        hideandShow.show = true;
        console.log("tabRef.current= ", tabRef.current);

        console.log("Here= ", prop.state.formNames);
        // setTimeout(
        //     () => setSelectValues(selectJson),
        //     1000
        // );

        // let gridApiArray = [];
        // let getCaseNumberEndpoints = [
        //     '/provider/getCase/'+prop.state.caseNumber,
        //     '/license/getCase/'+prop.state.caseNumber,
        //     '/location/getCase/'+prop.state.caseNumber,
        //     '/speciality/getCase/'+prop.state.caseNumber,
        //     '/payTo/getCase/'+prop.state.caseNumber,
        //     '/educationDetails/getCase/'+prop.state.caseNumber,
        //     '/trainingDetails/getCase/'+prop.state.caseNumber,
        //     '/workHistoryDetails/getCase/'+prop.state.caseNumber,
        //     '/insuranceDetails/getCase/'+prop.state.caseNumber,
        //     '/credentialDetails/getCase/'+prop.state.caseNumber,
        //   ];

        let getApiJson = {};
        getApiJson["tableNames"] = getTableDetails()["providerLinear"].concat(
          getTableDetails()["gridTables"]
        );
        getApiJson["whereClause"] = { caseNumber: prop.state.caseNumber };

        //console.log("Get Api JSON: ",getApiJson);

        /*const formData = new FormData();

              setTimeout(
                    () => formData.append('getData', getApiJson),
                    1000
                );*/

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

              //console.log("respKeys: ", respKeys);
              //console.log("respData: ", respData);
              prop.state.organizationName =
                respData.linearTable[0].organizationName;
              //console.log('Nidhi prop.state.organizationName: ',prop.state.organizationName);

              respKeys.forEach((k) => {
                console.log("Response key: ", k);
                if (k === "linearTable") {
                  let apiResponse = {};
                  if (respData[k][0] !== undefined) {
                    apiResponse = respData[k][0];
                    console.log("apiResponse Nidhi: ", apiResponse);
                    if (apiResponse.hasOwnProperty("dateOfBirth")) {
                      console.log("apiResponse Nidhi Date: ");
                      if (typeof apiResponse.dateOfBirth === "string") {
                        const dob = new Date(
                          getDatePartOnly(apiResponse.dateOfBirth)
                        );
                        apiResponse.dateOfBirth = dob;
                      }
                    }
                    if (apiResponse.hasOwnProperty("ecfmgIssueDate")) {
                      if (typeof apiResponse.ecfmgIssueDate === "string") {
                        const eid = new Date(
                          getDatePartOnly(apiResponse.ecfmgIssueDate)
                        );
                        apiResponse.ecfmgIssueDate = eid;
                      }
                    }
                    if (apiResponse.hasOwnProperty("ecfmgExpirationDate")) {
                      if (typeof apiResponse.ecfmgExpirationDate === "string") {
                        const eed = new Date(
                          getDatePartOnly(apiResponse.ecfmgExpirationDate)
                        );
                        apiResponse.ecfmgExpirationDate = eed;
                      }
                    }
                    if (apiResponse.hasOwnProperty("attestationDate")) {
                      if (typeof apiResponse.attestationDate === "string") {
                        const atd = new Date(
                          getDatePartOnly(apiResponse.attestationDate)
                        );
                        apiResponse.dateOfBirth = atd;
                      }
                    }
                    //apiResponse.languagesDefault = apiResponse.languages.split(",");
                    //apiResponse.genderDefault = apiResponse.gender.split(",");
                    //apiResponse.salutationDefault = apiResponse.salutation.split(",");
                    //apiResponse.licenseTypeDefault = apiResponse.licenseType.split(",");
                    //apiResponse.ethnicityDefault = apiResponse.ethnicity.split(",");
                    // apiResponse.newPatientsDefault = apiResponse.newPatients.split(",");
                    // apiResponse.agesSeenDefault = apiResponse.agesSeen.split(",");
                    // apiResponse.placeInDirectoryDefault = apiResponse.placeInDirectory.split(",");
                    // apiResponse.ecfmgQuesDefault = apiResponse.ecfmgQues.split(",");
                    apiResponse.gender = {
                      label: apiResponse.gender,
                      value: apiResponse.gender,
                    };
                    apiResponse.newPatients = {
                      label: apiResponse.newPatients,
                      value: apiResponse.newPatients,
                    };
                    apiResponse.agesSeen = {
                      label: apiResponse.agesSeen,
                      value: apiResponse.agesSeen,
                    };
                    // apiResponse.placeInDirectory = {
                    //   label: apiResponse.placeInDirectory,
                    //   value: apiResponse.placeInDirectory,
                    // };
                    apiResponse.delegated = {
                      label: apiResponse.delegated,
                      value: apiResponse.delegated,
                    };
                    apiResponse.ecfmgQues = {
                      label: apiResponse.ecfmgQues,
                      value: apiResponse.ecfmgQues,
                    };
                    apiResponse.contractId = {
                      label: apiResponse.contractId,
                      value: apiResponse.contractId,
                    };
                    // apiResponse.states = {'label':apiResponse.states,'value':apiResponse.states};
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

                    apiResponse = convertToDateObj(apiResponse);
                    linearFieldsRef.current = { linearFields: apiResponse };
                    setApiTestState(apiResponse);
                    if (prop.state.formView === "DashboardView") {
                      console.log("inside populate in dashboardview");
                      if (
                        (apiResponse.contractId.value === "" ||
                          apiResponse.contractId.value === undefined) &&
                        apiResponse.organizationName !== "" &&
                        !checkStageName.includes(prop.state.stageName)
                      ) {
                        populateContractIdDropdown(
                          "organizationName",
                          apiResponse.organizationName,
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

                    /*if((prop.state.formView === 'DashboardView') &&
                  ((apiResponse.contractId.value === '' || apiResponse.contractId.value === undefined) &&
                  (apiResponse.organizationName !== ''))){
                    //if(((apiResponse.contractId.value === '' || apiResponse.contractId.value === undefined) && (apiResponse.organizationName !== ''))
                    setTimeout(() => {
                      //printConsole("Inside Dashboard view settimeout")
                      document.getElementById('providerLegalEntityName').focus()
                      document.getElementById('providerLegalEntityName').blur();
                    }, 2000);
                  }*/
                  }
                }

                if (k === "licenseTable") {
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const newJson = convertToDateObj(js);
                    console.log(
                      "Add a provider licenseTable newJson: ",
                      newJson
                    );
                    apiResponseArray.push(newJson);
                    //setLicenseTableRowsData([...licenseTableRowsData,newJson]);
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
                      if (apiResponse.languages !== '') {
                        apiResponse.languages = apiResponse.languages
                          .split(",")
                          .map((ele) => {

                            return { label: ele, value: ele };

                          });
                      }
                      else {
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
                    console.log("Add a provider payToTable newJson;", newJson);
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
                    let apiResponse = js;
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
                        apiResponse.pcp = {
                          label: "No",
                          value: apiResponse.pcp,
                        };
                      }
                    }

                    //if (apiResponse.hasOwnProperty("DataSource")) {
                    //printConsole("Inside useEffect speciality if datasource value ",apiResponse.DataSource);
                    //printConsole("Inside useEffect speciality if taxonomyCode value ",apiResponse.taxonomyCode);
                    //if(apiResponse.DataSource === 'CredentialingApi'){

                    //Changed by NG as it is changing taxonomyDesc value which is already filled
                    if (
                      apiResponse.taxonomyCode !== null &&
                      apiResponse.taxonomyCode !== undefined &&
                      apiResponse.taxonomyCode !== "" &&
                      (!apiResponse.taxonomyDesc ||
                        apiResponse.taxonomyDesc === "")
                    ) {
                      const taxDesc = checktaxdec(apiResponse.taxonomyCode);
                      printConsole(
                        "Inside useEffect speciality if taxDesc value ",
                        taxDesc
                      );
                      apiResponse.taxonomyDesc = taxDesc;
                    }
                    //Changed by NG on 12/15/2023 as it was manipulating subSpeciality even though it was filled
                    if (
                      apiResponse.speciality !== null &&
                      apiResponse.speciality !== undefined &&
                      apiResponse.speciality !== "" &&
                      (!apiResponse.subSpeciality ||
                        apiResponse.subSpeciality === "")
                    ) {
                      apiResponse = checkSubSpeciality(apiResponse);
                      printConsole(
                        "Speciality response after inserting subSpeciality============= ",
                        apiResponse
                      );
                    }

                    //}
                    printConsole(
                      "Inside useEffect speciality if final specialty value ",
                      apiResponse
                    );
                    //}

                    apiResponseArray.push(apiResponse);
                    console.log(
                      "specialityTableRowsData apiResponse: ",
                      apiResponse
                    );
                  });
                  setspecialityTableRowsData(apiResponseArray);
                }

                if (k === "educationTable") {
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const newJson = convertToDateObj(js);
                    console.log(
                      "Add a provider insuranceTable newJson;",
                      newJson
                    );
                    apiResponseArray.push(newJson);
                    // setEducationTableRowsData([...educationTableRowsData,newJson]);
                  });
                  setEducationTableRowsData(apiResponseArray);
                }

                if (k === "trainingTable") {
                  // respData[k].forEach((js) => {
                  //     const newJson = convertToDateObj(js);
                  //     setTrainingTableRowsData([...trainingTableRowsData,newJson]);
                  // });
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const apiResponse = convertToDateObj(js);
                    if (apiResponse.hasOwnProperty("programAtteneded")) {
                      if (apiResponse.programAtteneded === "Y") {
                        apiResponse.programAtteneded = {
                          label: "Yes",
                          value: apiResponse.programAtteneded,
                        };
                      } else if (apiResponse.programAtteneded === "N") {
                        apiResponse.programAtteneded = {
                          label: "No",
                          value: apiResponse.programAtteneded,
                        };
                      }
                    }
                    apiResponseArray.push(apiResponse);
                    console.log(
                      "trainingTableRowsData apiResponse: ",
                      apiResponse
                    );
                  });
                  setTrainingTableRowsData(apiResponseArray);
                }
                if (k === "workTable") {
                  // respData[k].forEach((js) => {
                  //     const newJson = convertToDateObj(js);
                  //     setWorkTableRowsData([...workTableRowsData,newJson]);
                  // });
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const apiResponse = convertToDateObj(js);
                    if (apiResponse.hasOwnProperty("currentEmp")) {
                      if (apiResponse.currentEmp === "Y") {
                        apiResponse.currentEmp = {
                          label: "Yes",
                          value: apiResponse.currentEmp,
                        };
                      } else if (apiResponse.currentEmp === "N") {
                        apiResponse.currentEmp = {
                          label: "No",
                          value: apiResponse.currentEmp,
                        };
                      }
                    }
                    apiResponseArray.push(apiResponse);
                    console.log("workTableRowsData apiResponse: ", apiResponse);
                  });
                  setWorkTableRowsData(apiResponseArray);
                }
                if (k === "insuranceTable") {
                  let apiResponseArray = [];
                  respData[k].forEach((js) => {
                    const newJson = convertToDateObj(js);
                    console.log(
                      "Add a provider insuranceTable newJson;",
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
                    additionalQuesValues.map((obj) => [
                      obj.questionId,
                      obj.label,
                    ])
                  );

                  console.log("masterMap newJson:", masterMap);
                  let caseID = prop.state.caseNumber;

                  respData[k].forEach((js) => {
                    const newJson = convertToDateObj(js);
                    newJson.label = masterMap.get(Number(newJson.questionId)); //if we will give key it will give value , key-quesid, value-desc, label=desc
                    newJson.response = {
                      label: newJson.response,
                      value: newJson.response,
                    };
                    console.log("additionalQuesGrid newJson:", newJson);
                    quesAnsList.push(newJson);
                    caseID = newJson.caseNumber;

                    // quesJson.push(newJson);
                    // setQuesJson(quesJson)
                    // console.log("additionalQuesGrid quesJson :", quesJson);

                    //setAdditionalQuesRowsData([...additionalQuesRowsData,newJson]);
                    //console.log("additionalQuesRowsData:", additionalQuesRowsData);
                  });

                  console.log("quesAnsList: ", quesAnsList);
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
                      newJson.response = "";
                      newJson.caseNumber = caseID;
                      newJson.rowNumber = key.toString();
                      //Added by NG on 01/23/2024
                      newJson.operation = "I";
                      //Till Here
                      quesAnsList.push(newJson);
                    }
                  }

                  console.log("Harshit for no data :", newJson);

                  //quesAnsListJson.push(quesAnsList);
                  if (quesAnsList !== undefined && quesAnsList.length > 0) {
                    // quesAnsList[0].response = {'label':quesAnsList.response,'value':quesAnsList.response};

                    setQuesAnsListJson(quesAnsList);
                    // setQuesAnsListJson([
                    //     ...quesAnsListJson,
                    //     quesAnsList])
                  }
                  console.log(
                    "additionalQuesGrid quesAnsListJson :",
                    quesAnsListJson
                  );
                }

                //till here 02
              });

              //Added Newly by Nidhi Gupta on 08/22/2023
              if (prop.state.stageName == "Cred Specialist") {
                console.log(
                  "prop.state.organizationName 1152: ",
                  prop.state.organizationName
                );
                let resJson = {};
                customAxios
                  .get(
                    `/fetchPotentialDuplicate?legalEntityName=${prop.state.organizationName}&strRouteTo=${prop.state.stageName}&caseNumber=${prop.state.caseNumber}&transactionType=${AddProvider.displayName}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                  )
                  .then((res) => {
                    resJson = { ...res };
                    console.log("resJson: ", resJson);
                    if (res.status === 200) {
                      console.log("FindDuplicateProc executed successully");
                      let getApiJson = {};
                      console.log(
                        "prop.state.caseNumber 1162: ",
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
                              console.log(
                                "Potential Duplicate Json: ",
                                newJson
                              );
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
              // if(true)
              // {handleTabSelect("Compensation")}
              //Till Here
            }
          })
          .catch((err) => {
            console.log("Provider Get Api catch: ", err);
          });

        console.log("getApiJson: ", getApiJson);

        /*axios.all(getCaseNumberEndpoints.map((endpoint) => customAxios.get(endpoint))).then((res) => {
                if(res[0].status === 200){
                    const apiResponse = res[0].data;
                    //console.log(typeof apiResponse.dateOfBirth);
                    if(typeof apiResponse.dateOfBirth === 'string'){
                        const dob = new Date(apiResponse.dateOfBirth);
                        apiResponse.dateOfBirth = dob;
                    }
                    apiResponse.languagesDefault = apiResponse.languages.split(",");
                    apiResponse.genderDefault = apiResponse.gender.split(",");
                    apiResponse.salutationDefault = apiResponse.salutation.split(",");
                    apiResponse.licenseTypeDefault = apiResponse.licenseType.split(",");
                    apiResponse.ethnicityDefault = apiResponse.ethnicity.split(",");
                    apiResponse.newPatientsDefault = apiResponse.newPatients.split(",");
                    apiResponse.agesSeenDefault = apiResponse.agesSeen.split(",");

                    //console.log("ApiTestState: ",apiResponse);
                    setApiTestState(apiResponse);
                }
                if(res[1].status === 200){
                    //apiArray = [...res[1].data];
                    console.log("License api response: ",res[1].data);
                    res[1].data.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setLicenseTableRowsData(...licenseTableRowsData,gridApiArray);
                 }
                 gridApiArray = [];
                 if(res[2].status === 200){
                    //apiArray = [...res[2].data];
                    res[2].data.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setLocationTableRowsData(...locationTableRowsData,gridApiArray);
                 }
                 gridApiArray = [];
                 if(res[3].status === 200){
                    //apiArray = [...res[3].data];
                    res[3].data.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setspecialityTableRowsData(...specialityTableRowsData,gridApiArray);
                 }
                 gridApiArray = [];
                 if(res[4].status === 200){
                    //apiArray = [...res[4].data];
                    res[4].data.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setPayToTableRowsData(...payToTableRowsData,gridApiArray);
                 }
                  gridApiArray = [];
                 if(res[5].status === 200){
                    //apiArray = [...res[4].data];
                    res[5].data.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setEducationTableRowsData(...educationTableRowsData,gridApiArray);
                 }

                 gridApiArray = [];
                 if(res[6].status === 200){
                    //apiArray = [...res[4].data];
                    res[6].data.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setTrainingTableRowsData(...trainingTableRowsData,gridApiArray);
                 }

                 gridApiArray = [];
                 if(res[7].status === 200){
                    //apiArray = [...res[4].data];
                    res[7].data.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setWorkTableRowsData(...workTableRowsData,gridApiArray);
                 }

                 gridApiArray = [];
                 if(res[8].status === 200){
                    //apiArray = [...res[4].data];
                    res[8].data.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setInsuranceTableRowsData(...insuranceTableRowsData,gridApiArray);
                 }

                 gridApiArray = [];
                 if(res[9].status === 200){
                    //apiArray = [...res[4].data];
                    res[9].data.map((apiKey) => {
                        gridApiArray.push(getGridData(apiKey));
                    })
                    setCredentialTableRowsData(...credentialTableRowsData,gridApiArray);
                 }

             })
             .catch((err) => {
                console.log(err.message);
             });
             console.log("Api Array: ",gridApiArray);
             console.log("LicenseTable Values: ",licenseTableRowsData);
             console.log("specialityTableRowsData Values: ",specialityTableRowsData);
             console.log("locationTableRowsData Values: ",locationTableRowsData);
             console.log("payToTableRowsData Values: ",payToTableRowsData);
             console.log("educationTableRowsData Values: ",educationTableRowsData);
             console.log("trainingTableRowsData Values: ",trainingTableRowsData);
             console.log("workTableRowsData Values: ",workTableRowsData);
             console.log("insuranceTableRowsData Values: ",insuranceTableRowsData);
             console.log("credentialTableRowsData Values: ",credentialTableRowsData);*/
        //console.log("Received case number: ",prop.state);
        // const apiDataUrl = apiUrl + 'provider/getCase/'+prop.state.caseNumber;
        // axios.get((apiDataUrl)).then((res) => {
        //     console.log("all workItems: ",res.data);
        //     if(res.status === 200){
        //         const apiResponse = res.data;
        //         //console.log(typeof apiResponse.dateOfBirth);
        //         if(typeof apiResponse.dateOfBirth === 'string'){
        //             const dob = new Date(apiResponse.dateOfBirth);
        //             apiResponse.dateOfBirth = dob;
        //         }
        //         setApiTestState(apiResponse);
        //     }
        // });
      }
      //setspecialityTableRowsData(...specialityTableRowsData,demoData);
      //setLicenseTableRowsData(...licenseTableRowsData,demoData);
      //setLocationTableRowsData(...locationTableRowsData,demoData);
      //setPayToTableRowsData(...payToTableRowsData,demoData);
      return () => {
        console.log("UNMOUNT");
        // setApiTestState(initState);
        // setFormikInitializeState(true);
      };
    } catch (error) {
      // Handle the error here
      console.error("An error occurred in useEffect:", error);
    }
  }, []);

  const convertToDateObj = (jsonObj) => {
    try {
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
    } catch (error) {
      // Handle the error here
      console.error("An error occurred convertToDateObj:", error);
    }
  };

  // const handleApiTestChange = (evt) => {
  //     const value = evt.target.value;
  //     //validate(evt);
  //     //console.log("Erros: ",errors);
  //     setApiTestState({
  //         ...apiTestState,
  //         [evt.target.name]: evt.target.value
  //     })
  // }

  const gridDataRef = useRef({});

  const finalGridSaveDataRef = useRef({});

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

    // console.log("Inside gridRowsFinalSubmit gridFieldTempState Value ====  ",gridFieldTempState);
    // console.log("Inside gridRowsFinalSubmit gridFieldTempState keys ====  ",Object.keys(gridFieldTempState).length);
    let clonedJson = { ...gridFieldTempState };
    console.log("Inside gridRowsFinalSubmit clonedJson value1: ", clonedJson);
    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "LicenseTable") {
        let indexJson = licenseTableRowsData[index];
        //console.log("Inside gridRowsFinalSubmit indexJson value: ",indexJson);
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        //console.log("Inside gridRowsFinalSubmit clonedJson value: ",clonedJson);
        //console.log("Inside gridRowsFinalSubmit clonedJson licenseTableRowsData value: ",licenseTableRowsData[index]);
        if (!checkGridJsonLength(clonedJson)) {
          console.log(
            "Inside gridRowsFinalSubmit clonedJson if value: ",
            clonedJson
          );
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
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
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
        // if(clonedJson.placeInDirectory === undefined)
        //   {
        //     clonedJson.placeInDirectory = "Y";
        //   }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson after value: ",
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

      if (triggeredFormName === "EducationTable") {
        let indexJson = educationTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          educationTableRowsData[index] = clonedJson;
          setEducationTableRowsData(educationTableRowsData);
        }
      }

      if (triggeredFormName === "TrainingTable") {
        let indexJson = trainingTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          trainingTableRowsData[index] = clonedJson;
          setTrainingTableRowsData(trainingTableRowsData);
        }
      }

      if (triggeredFormName === "WorkTable") {
        let indexJson = workTableRowsData[index];
        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }
        console.log(
          "Inside gridRowsFinalSubmit clonedJson value: ",
          clonedJson
        );
        if (!checkGridJsonLength(clonedJson)) {
          workTableRowsData[index] = clonedJson;
          setWorkTableRowsData(workTableRowsData);
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
        //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
        //gridRowJson["operation"] = oprtn;
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
        //gridRowJson["operation"] = oprtn;
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
        //gridRowJson["operation"] = oprtn;
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
      if (triggeredFormName === "EducationTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("educationTable")
          ? [...gridDataRef.current.educationTable]
          : [];
        gridRowJson = { ...educationTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.educationTable = getGridDataValues(gridRowArray);
        }

        console.log("gridDataRef.current: ", gridDataRef.current);
      }
      if (triggeredFormName === "TrainingTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("trainingTable")
          ? [...gridDataRef.current.trainingTable]
          : [];
        gridRowJson = { ...trainingTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.trainingTable = getGridDataValues(gridRowArray);
        }

        console.log("gridDataRef.current: ", gridDataRef.current);
      }
      if (triggeredFormName === "WorkTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("workTable")
          ? [...gridDataRef.current.workTable]
          : [];
        gridRowJson = { ...workTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowJson==== ",gridRowJson);
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("INside gridRowsFinalSubmit Dashboard gridRowArray after==== ",gridRowArray);
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.workTable = getGridDataValues(gridRowArray);
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

  //   //Handling for data update/Delete/Insert inside grids.
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
  //       //gridRowJson = trimJsonValues(gridRowJson);
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
  //       //gridRowJson = trimJsonValues(gridRowJson);
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
  //       //gridRowJson = trimJsonValues(gridRowJson);
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
  //       //gridRowJson = trimJsonValues(gridRowJson);
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.specialityTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }
  //     if (triggeredFormName === "EducationTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("educationTable")
  //         ? [...gridDataRef.current.educationTable]
  //         : [];
  //       gridRowJson = { ...educationTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       //gridRowJson = trimJsonValues(gridRowJson);
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.educationTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }
  //     if (triggeredFormName === "TrainingTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("trainingTable")
  //         ? [...gridDataRef.current.trainingTable]
  //         : [];
  //       gridRowJson = { ...trainingTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       //gridRowJson = trimJsonValues(gridRowJson);
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.trainingTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }
  //     if (triggeredFormName === "WorkTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("workTable")
  //         ? [...gridDataRef.current.workTable]
  //         : [];
  //       gridRowJson = { ...workTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       //gridRowJson = trimJsonValues(gridRowJson);
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.workTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }

  //     if (triggeredFormName === "InsuranceTable") {
  //       gridRowArray = gridDataRef.current.hasOwnProperty("insuranceTable")
  //         ? [...gridDataRef.current.insuranceTable]
  //         : [];
  //       gridRowJson = { ...insuranceTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       //gridRowJson = trimJsonValues(gridRowJson);
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       //console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.insuranceTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current: ", gridDataRef.current);
  //     }

  //     if (triggeredFormName === "CredentialTable") {
  //       console.log("Grid data ref current for credential===== ",gridDataRef.current.credentialTable);
  //       gridRowArray = gridDataRef.current.hasOwnProperty("credentialTable")
  //         ? [...gridDataRef.current.credentialTable]
  //         : [];
  //       gridRowJson = { ...credentialTableRowsData[index] };
  //       gridRowJson["operation"] = oprtn;
  //       //gridRowJson = trimJsonValues(gridRowJson);
  //       gridRowArray.push(trimJsonValues(gridRowJson));
  //       console.log("Final array: ",getGridDataValues(gridRowArray));
  //       // //licenseTableRowsData[index].operation = oprtn;
  //       gridDataRef.current.credentialTable = getGridDataValues(gridRowArray);
  //       console.log("gridDataRef.current for credential: ", gridDataRef.current);
  //     }

  //     /////
  //     if(triggeredFormName === 'FIRLTable'){
  //       gridRowArray = (gridDataRef.current.hasOwnProperty('SelfServ_HospitalComp_Grid'))
  //        ? [...gridDataRef.current.SelfServ_HospitalComp_Grid]
  //        : [];
  //       gridRowJson = {...firlTableRowsData[index]};
  //       gridRowJson['operation'] = oprtn;
  //       gridRowArray.push(gridRowJson);
  //       gridDataRef.current.SelfServ_HospitalComp_Grid = getGridDataValues(gridRowArray);
  //       console.log("Inside gridRowsFinalSubmit gridDataRef.current FIRLTable: ",gridDataRef.current);
  //   }
  //   if(triggeredFormName === 'CompensationTable'){
  //       gridRowArray = (gridDataRef.current.hasOwnProperty('SelfServ_ProviderComp_Grid'))
  //        ? [...gridDataRef.current.SelfServ_ProviderComp_Grid]
  //        : [];
  //       gridRowJson = {...compensationTableRowsData[index]};
  //       gridRowJson['operation'] = oprtn;
  //       gridRowArray.push(gridRowJson);
  //       gridDataRef.current.SelfServ_ProviderComp_Grid = getGridDataValues(gridRowArray);
  //       console.log("Inside gridRowsFinalSubmit gridDataRef.current CompensationTable: ",gridDataRef.current);
  //   }

  //     /////
  //   }

  //   //Handling For Portal and DashboardHomeView Side grids Save&Close
  //     /*if (triggeredFormName === "CredentialTable") {
  //       finalGridSaveDataRef.current[triggeredFormName] = [...credentialTableRowsData];
  //     }*/
  // };

  // let tableRowsDataTempRef = useRef({});

  /*const editTableRows = (triggeredFormName,index,initialTableRows) => {
    console.log("Inside editTableRows")
    if(triggeredFormName === 'CredentialTable'){
      console.log("Inside editTableRows credential grid data==== ",initialTableRows[index]);
      tableRowsDataTempRef.current = initialTableRows[index];
    }
  }*/

  //Added by Harshit
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

    if (triggeredFormName === "EducationTable") {
      rowInput = educationTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "TrainingTable") {
      rowInput = trainingTableRowsData[index];
      setGridFieldTempState(rowInput);
    }

    if (triggeredFormName === "WorkTable") {
      rowInput = workTableRowsData[index];
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
    if (triggeredFormName === "EducationTable") {
      rowsInput.rowNumber = educationTableRowsData.length + 1;
      //setEducationTableRowsData([...educationTableRowsData, rowsInput]);
    }

    if (triggeredFormName === "TrainingTable") {
      rowsInput.rowNumber = trainingTableRowsData.length + 1;
      //setTrainingTableRowsData([...trainingTableRowsData, rowsInput]);
    }

    if (triggeredFormName === "WorkTable") {
      rowsInput.rowNumber = workTableRowsData.length + 1;
      //setWorkTableRowsData([...workTableRowsData, rowsInput]);
    }

    if (triggeredFormName === "InsuranceTable") {
      rowsInput.rowNumber = insuranceTableRowsData.length + 1;
      //setInsuranceTableRowsData([...insuranceTableRowsData, rowsInput]);
    }

    if (triggeredFormName === "CredentialTable") {
      rowsInput.rowNumber = credentialTableRowsData.length + 1;
      //setCredentialTableRowsData([...credentialTableRowsData, rowsInput]);
    }

    /////
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
    /////
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    console.log(
      "Inside deleteTableRows with all values==== ",
      index,
      " & ",
      triggeredFormName,
      " & ",
      operationValue
    );
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
      if (triggeredFormName === "EducationTable") {
        const rows = [...educationTableRowsData];
        rows.splice(index, 1);
        setEducationTableRowsData(rows);
      }

      if (triggeredFormName === "TrainingTable") {
        const rows = [...trainingTableRowsData];
        rows.splice(index, 1);
        setTrainingTableRowsData(rows);
      }

      if (triggeredFormName === "WorkTable") {
        const rows = [...workTableRowsData];
        rows.splice(index, 1);
        setWorkTableRowsData(rows);
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

    if (triggeredFormName === 'PayToTable') {
      if (name === 'payToNpi' || name === 'zipCode') {
        value = acceptNumbersOnly(value);
        console.log("inside condition", value);
      }
    }
    if (triggeredFormName === 'LocationTable') {
      if (name === 'npi' || name === 'zipCode') {
        value = acceptNumbersOnly(value);
        console.log("inside condition", value);
      }
    }

    tempInput[name] = value.toUpperCase();
    console.log("updated paytoNPi value ", value, tempInput);
    setGridFieldTempState(tempInput);
    console.log(gridFieldTempState, "gridFieldTempState");
  };

  //Commented By Harshit and modified this method wrt to "save data only on grid save and close"
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
  //   if (triggeredFormName === "EducationTable") {
  //     //console.log('Inside EducationTable');
  //     rowsInput = [...educationTableRowsData];
  //   }

  //   if (triggeredFormName === "TrainingTable") {
  //     //console.log('Inside TrainingTable');
  //     rowsInput = [...trainingTableRowsData];
  //   }

  //   if (triggeredFormName === "WorkTable") {
  //     //console.log('Inside WorkTable');
  //     rowsInput = [...workTableRowsData];
  //   }

  //   if (triggeredFormName === "InsuranceTable") {
  //     //console.log('Inside InsuranceTable');
  //     rowsInput = [...insuranceTableRowsData];
  //   }

  //   if (triggeredFormName === "CredentialTable") {
  //     //console.log('Inside CredentialTable');
  //     rowsInput = [...credentialTableRowsData];
  //   }
  //   ////
  //   if(triggeredFormName === 'FIRLTable'){
  //     //console.log('Inside FIRLTable');
  //     rowsInput = [...firlTableRowsData];
  //   }
  //    if(triggeredFormName === 'CompensationTable'){
  //     //console.log('Inside FIRLTable');
  //     rowsInput = [...compensationTableRowsData];
  //     }
  //   /////
  //   //console.log('Inside handleGridFieldChange: ',rowsInput);
  //   value = value.toUpperCase();
  //   rowsInput[index][name] = value;
  //   if (triggeredFormName === "LicenseTable") {
  //     setLicenseTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "SpecialityTable") {
  //     //rowsInput = [...specialityTableRowsData];

  //     setspecialityTableRowsData(rowsInput);

  //     //Fixed by Nidhi Gupta
  //   }
  //   if (triggeredFormName === "LocationTable") {
  //     setLocationTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "PayToTable") {
  //     setPayToTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "EducationTable") {
  //     setEducationTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "TrainingTable") {
  //     setTrainingTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "WorkTable") {
  //     setWorkTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "InsuranceTable") {
  //     const regex = /^[0-9\b.]+$/;
  //     //rowsInput = [...insuranceTableRowsData];
  //     if (name === "covAmount" || name === "covAmountAgg") {
  //       // console.log("Inside InsuranceTable if: ",name);
  //       // console.log("Inside InsuranceTable if value entered: ",value);
  //       // console.log("Inside InsuranceTable if rowsinput  value: ",rowsInput[index][name]);
  //       if (value === "" || regex.test(value)) {
  //         console.log("Inside InsuranceTable second if: ", value);
  //         rowsInput[index][name] = value;
  //       } else {
  //         let newVal = value;
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

  //   if (triggeredFormName === "CredentialTable") {
  //     setCredentialTableRowsData(rowsInput);
  //   }

  //   /////
  //   rowsInput[index][name] = value;
  //   if(triggeredFormName === 'FIRLTable'){
  //       setFirlTableRowsData(rowsInput);
  //   }
  //   if(triggeredFormName === 'CompensationTable'){
  //       setCompensationTableRowsData(rowsInput);
  //   }

  //   /////
  // };

  const handleGridOnBlur = (index, evnt, triggeredFormName) => {
    console.log("Inside handleGridOnBlur: ", triggeredFormName);
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
            console.log("gridFieldTempState Nidhi: ", gridFieldTempState);
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
          console.log("rowsInput Nidhi: ", rowsInput);
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

  //Added Newly by Nidhi Gupta on 05/22/2023
  const handleSelectSpecialityOnBlur = (
    index,
    selectedValue,
    evnt,
    triggeredFormName
  ) => {
    console.log("Inside handleSelectSpecialityOnBlur index: ", index);
    console.log(
      "Inside handleSelectSpecialityOnBlur selectedValue: ",
      selectedValue
    );
    console.log("Inside handleSelectSpecialityOnBlur evnt: ", evnt);
    console.log(
      "Inside handleSelectSpecialityOnBlur trigeredFormName: ",
      triggeredFormName
    );
  };
  //till here

  //08/22/2023

  const handleActionSelectChange = (propertyName, propertyValue) => {
    const updatedData = potentialDupData.map((data) => ({
      ...data,
      [propertyName]: { label: propertyValue, value: propertyValue },
    }));

    setPotentialDupData(updatedData);
  };
  // const handleActionSelectChange = (evnt, index, data) => {
  //   console.log(evnt, index, "hhhhfjgkjdfhkgkjdh");
  //   data.action = { label: evnt.value, value: evnt.value };

  //   potentialDupData[index] = data;
  //   setPotentialDupData([...potentialDupData]);
  // };

  //Till here

  const handleLinearSelectChange = (selectValue, evnt, setFieldValue) => {
    console.log("SS handleLinear", selectValue, apiTestState, setFieldValue);
    if (formikInitializeState) {
      setFormikInitializeState(false);
    }
    const { name } = evnt;
    let val = selectValue;
    if (evnt.action === "clear") {
      //printConsole('Inside selectvalue null before delete: ',rowsInput[index]);
      //delete rowsInput[index][name];
      if (name.toLowerCase() === "<states>") {
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
  console.log(
    "SS handleLinearhandleLinearhandleLinearhandleLinear",
    apiTestState
  );

  const handleGridSelectChange = (
    index,
    selectedValue,
    evnt,
    triggeredFormName
  ) => {
    // console.log("Inside select change index: ", index);
    console.log("Inside select change selectedValue: ", evnt, selectedValue);
    // console.log("Inside select change evnt: ", evnt);
    // console.log("Inside select change trigeredFormName: ", triggeredFormName);
    let rowsInput = { ...gridFieldTempState };

    const { name } = evnt;
    let val = selectedValue;
    if (evnt.action === "clear") {
      if (name.toLowerCase() === "languages") {
        val = [];
      }
      else {
        val = { label: "", value: "" };
      }
    } else {
      //Changed by Nidhi Gupta on 11/30/2023 to handle undefined scenerios

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

      //  console.log('Inside select change specialtyOptions: ',selectValues.specialtyOptions);
      //  console.log("Inside select change evnt.name: ",evnt.name);
      if (
        evnt.name == "speciality" &&
        selectValues.specialtyOptions &&
        selectValues.specialtyOptions.length > 0 &&
        selectedValue
      ) {
        //console.log("Inside select change heloooooo");
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

  //Commented by Harshit
  // const handleGridSelectChange = (
  //   index,
  //   selectedValue,
  //   evnt,
  //   triggeredFormName
  // ) => {
  //   // console.log("Inside select change index: ", index);
  //   // console.log("Inside select change selectedValue: ", selectedValue);
  //   // console.log("Inside select change evnt: ", evnt);
  //   // console.log("Inside select change trigeredFormName: ", triggeredFormName);
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
  //   if (triggeredFormName === "EducationTable") {
  //     //console.log('Inside EducationTable');
  //     rowsInput = [...educationTableRowsData];
  //   }
  //   if (triggeredFormName === "TrainingTable") {
  //     //console.log('Inside TrainingTable');
  //     rowsInput = [...trainingTableRowsData];
  //   }
  //   if (triggeredFormName === "WorkTable") {
  //     //console.log('Inside WorkTable');
  //     rowsInput = [...workTableRowsData];
  //   }
  //   if (triggeredFormName === "InsuranceTable") {
  //     //console.log('Inside InsuranceTable');
  //     rowsInput = [...insuranceTableRowsData];
  //   }
  //   if (triggeredFormName === "CredentialTable") {
  //     //console.log('Inside CredentialTable');
  //     rowsInput = [...credentialTableRowsData];
  //   }

  //   /////
  //   if(triggeredFormName === 'FIRLTable'){
  //     //console.log('Inside FIRLTable');
  //     rowsInput = [...firlTableRowsData];
  // }
  // if(triggeredFormName === 'CompensationTable'){
  //     //console.log('Inside CompensationTable');
  //     rowsInput = [...compensationTableRowsData];
  // }

  //   /////
  //   //console.log("Inside select change event: ",rowsInput);
  //   //rowsInput[index][name] = selectedValue;
  //   let val = selectedValue;
  //   if(evnt.action==='clear'){
  //     //printConsole('Inside selectvalue null before delete: ',rowsInput[index]);
  //     //delete rowsInput[index][name];
  //     val = {label:'',value:''};
  //     //printConsole('Inside selectvalue null after delete: ',rowsInput[index]);
  //   }
  //   else{
  //     //val = {label:selectedValue.value.toUpperCase(),value:selectedValue.value.toUpperCase()}
  //     val = {label:selectedValue.value,value:selectedValue.value}
  //   }

  //   console.log("Inside handleSelectChange Val: ",val);

  //   rowsInput[index][name] = val

  //   //console.log("rowsInput: ",rowsInput);
  //   if (triggeredFormName === "SpecialityTable") {
  //     //Added Newly by Nidhi Gupta on 05/22/2023

  //     console.log(
  //       "Inside select change specialtyOptions: ",
  //       selectValues.specialtyOptions
  //     );
  //     console.log("Inside select change evnt.name: ", evnt.name);
  //     if (
  //       evnt.name == "speciality" &&
  //       selectValues.specialtyOptions &&
  //       selectedValue!==null &&
  //       selectValues.specialtyOptions.length > 0
  //     ) {
  //       console.log("Inside select change heloooooo");
  //       const foundOption = selectValues.specialtyOptions.find(
  //         (option) => option.speciality === selectedValue.value
  //       );
  //       console.log("Inside select change foundOption: ", foundOption);
  //       if (
  //         foundOption !== undefined &&
  //         "hsdCodeValue" in foundOption &&
  //         foundOption.hsdCodeValue !== null &&
  //         foundOption.hsdCodeValue !== undefined
  //       ) {
  //         console.log(
  //           "Inside select change foundOption if: ",
  //           rowsInput[index]["hsdCode"]
  //         );
  //         console.log(
  //           "Inside select change foundOption.hsdCodeValue: ",
  //           foundOption.hsdCodeValue
  //         );
  //         rowsInput[index]["hsdCode"] = foundOption.hsdCodeValue;
  //       } else {
  //         // alert("Corresponding HSD Code not found.");
  //         // delete rowsInput[index]['hsdCode'] ;
  //         rowsInput[index]["hsdCode"] = "";
  //       }
  //       const subSpecialityValues = selectValues.specialtyOptions
  //         .filter((el) => el.speciality === selectedValue.value)
  //         .map((elem) => {
  //           return { label: elem.subSpeciality, value: elem.subSpeciality };
  //         });
  //       console.log(
  //         "Inside select change subSpecialityValues",
  //         subSpecialityValues
  //       );
  //       setSubSpecialityOptions(subSpecialityValues);
  //       setspecialityTableRowsData(rowsInput);
  //     }
  //     //Till here
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
  //   if (triggeredFormName === "EducationTable") {
  //     setEducationTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "TrainingTable") {
  //     setTrainingTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "WorkTable") {
  //     setWorkTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "InsuranceTable") {
  //     setInsuranceTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "CredentialTable") {
  //     setCredentialTableRowsData(rowsInput);
  //   }

  //   /////
  //   if(triggeredFormName === 'FIRLTable'){
  //     setFirlTableRowsData(rowsInput);
  // }
  // if(triggeredFormName === 'CompensationTable'){
  //     setCompensationTableRowsData(rowsInput);
  // }
  //   /////

  // };

  const modifyValidatedAddressRow = (index, data) => {
    // setLocationTableRowsData((prev) => {
    //   prev[index] = data;
    //   return prev;
    // });
    setGridFieldTempState(data);
  };

  const modifyValidatedAddressPayToRow = (index, data) => {
    // setPayToTableRowsData((prev) => {
    //   prev[index] = data;
    //   return prev;
    // });
    setGridFieldTempState(data);
  };

  const handleGridDateChange = (
    index,
    selectedValue,
    fieldName,
    triggeredFormName
  ) => {
    // console.log("index: ",index);
    //console.log("Inside handleGridDateChange selectValue: ",selectedValue);
    // console.log("fieldName: ",fieldName);
    //const { name } = fieldName;
    //console.log("Inside handleGridDateChange name: ",fieldName);
    let tempInput = { ...gridFieldTempState };
    tempInput[fieldName] = selectedValue;
    //console.log("Inside handleGridDateChange tempInput: ",tempInput);
    setGridFieldTempState(tempInput);
  };

  //Commented by Harshit
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
  //   if (triggeredFormName === "EducationTable") {
  //     console.log("Inside if triggeredFormName: ", triggeredFormName);
  //     rowsInput = [...educationTableRowsData];
  //     rowsInput[index][fieldName] = selectedValue;
  //     console.log("rowsInput: ", rowsInput);
  //     setEducationTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "TrainingTable") {
  //     console.log("Inside if triggeredFormName: ", triggeredFormName);
  //     rowsInput = [...trainingTableRowsData];
  //     rowsInput[index][fieldName] = selectedValue;
  //     console.log("rowsInput: ", rowsInput);
  //     setTrainingTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "WorkTable") {
  //     console.log("Inside if triggeredFormName: ", triggeredFormName);
  //     rowsInput = [...workTableRowsData];
  //     rowsInput[index][fieldName] = selectedValue;
  //     console.log("rowsInput: ", rowsInput);
  //     setWorkTableRowsData(rowsInput);
  //   }
  //   if (triggeredFormName === "InsuranceTable") {
  //     console.log("Inside if triggeredFormName: ", triggeredFormName);
  //     rowsInput = [...insuranceTableRowsData];
  //     rowsInput[index][fieldName] = selectedValue;
  //     console.log("rowsInput: ", rowsInput);
  //     setInsuranceTableRowsData(rowsInput);
  //   }
  // };

  const handleDateOnBlur = (date, dateName, evnt) => {
    console.log("handleDateOnBlur evnt: ", evnt);
    console.log("handleDateOnBlur date: ", date);
    console.log("handleDateOnBlur dateName: ", dateName);
  };

  const handleDateChange = (date, dateName, evnt, values) => {
    console.log("handleDateChange evnt: ", evnt);
    console.log("handleDateChange date: ", date);
    console.log("handleDateChange dateName: ", dateName);
    if (date === null) {
      date = "";
    }
    if (formikInitializeState) {
      setFormikInitializeState(false);
    }
    if (dateName === "dateOfBirth") {
      // let formikState = {...values};
      // let formStates = {...apiTestState};
      // let formState = getJsonFromFormikState(initState,formikState);
      // formState = Object.assign(formStates,formState);
      // setApiTestState({
      //   ...formState,
      //   dateOfBirth: date,
      // });

      //old one below
      setApiTestState({
        ...apiTestState,
        dateOfBirth: date,
      });
      console.log("handleDateChange dateOfBirth: date ", apiTestState);
    }
    if (dateName === "ecfmgIssueDate") {
      setApiTestState({
        ...apiTestState,
        ecfmgIssueDate: date,
      });
    }

    if (dateName === "ecfmgExpirationDate") {
      setApiTestState({
        ...apiTestState,
        ecfmgExpirationDate: date,
      });
    }

    if (dateName === "attestationDate") {
      setApiTestState({
        ...apiTestState,
        attestationDate: date,
      });
      console.log("apiTestState attestationDate: date", apiTestState);
    }

    //Added by Nidhi Gupta on 10/09/2023
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
    //Till Here
  };

  // const handleDateChange = (date) => {
  //     // let formattedDate = `${
  //     //     date.getMonth() + 1
  //     //   }/${date.getDate()}/${date.getFullYear()}`;
  //     // console.log("Date DOB: ",date);
  //     // console.log("TYpe of dob: ",typeof date);
  //     setApiTestState({
  //         ...apiTestState,
  //         dateOfBirth: date
  //       });
  // }

  /*const getNextSequence = async(path) => {
        let caseNumber;
        try{
            const response = await axios.get(path);
            if(response.status === 200){
                caseNumber = response.data;
            }
            console.log("Casenumber inside await: ",caseNumber);
            return caseNumber;
        }
        catch (error) {
            console.log(error);
        }
    }*/

  const saveFormData = async (values) => {
    try {
      console.log("Inside saveFormData()");
      //if(handleSubmit()){

      setButtonDisableFlag(true);

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
      // setTimeout(
      //     () => setApiTestState(...apiTestState,values),
      //     1000
      // );
      // const valueKeys = Object.keys(values);
      // console.log('Inside saveFormData values: ',values);
      // valueKeys.forEach((k) => {
      //     apiTestState[k] = values[k];
      // });

      //values.gender = ((apiTestState.gender!==undefined)?apiTestState.gender.value:'');

      let apiJson = {};
      let requestBody = { ...values };

      requestBody.gender =
        values.gender.value !== undefined ? values.gender.value : "";
      requestBody.agesSeen =
        apiTestState.agesSeen !== undefined ? apiTestState.agesSeen.value : "";
      // values.states = ((apiTestState.states!==undefined)?apiTestState.states.map(el => el.value).toString():'');
      console.log("Inside save form data: ", apiTestState.states);
      // console.log("Inside save form data state type: ",Array.isArray(apiTestState.states));
      // requestBody.states =apiTestState.states !== undefined? typeof apiTestState.states !== "string"
      //     ? apiTestState.states.map((el) => el.value).toString()
      //     : apiTestState.states
      //   : "";8
      requestBody.states =
        apiTestState.states !== undefined
          ? Array.isArray(apiTestState.states)
            ? apiTestState.states.map((el) => el.value.toString()).toString()
            : ""
          : "";
      //apiTestState.states.map((el) => {if(el.value !== ''){return el.value.toString()}})
      console.log("Inside save form data11: ", requestBody.states);
      requestBody.newPatients =
        apiTestState.newPatients !== undefined
          ? apiTestState.newPatients.value
          : "";
      //   requestBody.placeInDirectory =
      // apiTestState.placeInDirectory !== undefined
      //   ? apiTestState.placeInDirectory.value
      //   : "Yes";
      //requestBody.delegated =
      // apiTestState.delegated !== undefined
      //   ? apiTestState.delegated.value
      //   : "";
      requestBody.delegated =
        values.delegated.value !== undefined ? values.delegated.value : null;
      requestBody.contractId =
        apiTestState.contractId !== undefined &&
          apiTestState.contractId !== null
          ? apiTestState.contractId.value
          : "";
      requestBody.ecfmgQues =
        apiTestState.ecfmgQues !== undefined
          ? apiTestState.ecfmgQues.value
          : "";
      //console.log("Updated apiTestState.attestationDate", apiTestState.attestationDate);
      // requestBody.dateOfBirth = !!apiTestState.dateOfBirth
      //   ? apiTestState.dateOfBirth.toLocaleDateString()
      //   : null;

      requestBody.dateOfBirth = extractDate(apiTestState.dateOfBirth);
      requestBody.ecfmgIssueDate = extractDate(apiTestState.ecfmgIssueDate);
      requestBody.ecfmgExpirationDate = extractDate(
        apiTestState.ecfmgExpirationDate
      );
      requestBody.attestationDate = extractDate(apiTestState.attestationDate);
      /*requestBody.dateOfBirth = !!apiTestState.dateOfBirth
        ? apiTestState.dateOfBirth.toLocaleDateString()
        : null;
        requestBody.ecfmgIssueDate = !!apiTestState.ecfmgIssueDate
        ? apiTestState.ecfmgIssueDate.toLocaleDateString()
        : null;
        requestBody.ecfmgExpirationDate = !!apiTestState.ecfmgExpirationDate
        ? apiTestState.ecfmgExpirationDate.toLocaleDateString()
        : null;
        requestBody.attestationDate = !!apiTestState.attestationDate
        ? apiTestState.attestationDate.toLocaleDateString()
        : null;*/
      requestBody.Medicaid = apiTestState.Medicaid;
      requestBody.Medicare =
        apiTestState.Medicare !== undefined ? apiTestState.Medicare : true;

      //requestBody.languages = languageRef.current.getSelectedItems().toString();
      //requestBody.gender = genderRef.current.getSelectedItems().toString();
      //requestBody.salutation = salutationRef.current.getSelectedItems().toString();
      //requestBody.ethnicity = ethnicityRef.current.getSelectedItems().toString();
      //requestBody.gender = ((apiTestState.gender!==undefined)?apiTestState.gender.value:'');
      //console.log("apiTestState.gender.value: ", apiTestState.gender.value);
      //requestBody.placeInDirectory = ((apiTestState.placeInDirectory!==undefined)?apiTestState.placeInDirectory.value:'Yes');
      //console.log("apiTestState.placeInDirectory.value ", apiTestState.placeInDirectory.value);

      // requestBody.delegated = ((apiTestState.delegated!==undefined)?apiTestState.delegated.value:'');
      // requestBody.ecfmgQues = ((apiTestState.ecfmgQues!==undefined)?apiTestState.ecfmgQues.value:'');
      //console.log("apiTestState.ecfmgQues.value ", apiTestState.ecfmgQues.value);
      //requestBody.newPatients = ((apiTestState.newPatients!==undefined)?apiTestState.newPatients.value:'');
      //console.log("apiTestState.newPatients.value ", apiTestState.newPatients.value);

      //requestBody.agesSeen = ((apiTestState.agesSeen!==undefined)?apiTestState.agesSeen.value:'');
      //console.log("apiTestState.agesSeen.value ", apiTestState.agesSeen.value);

      // values.Medicaid = apiTestState.Medicaid;
      // values.Medicare = apiTestState.Medicare;

      requestBody.userName = mastersSelector.hasOwnProperty("auth")
        ? mastersSelector.auth.hasOwnProperty("userName")
          ? mastersSelector.auth.userName
          : "system"
        : "system";

      //requestBody.agesSeen = agesSeeneRef.current.getSelectedItems().toString();
      //requestBody.newPatients = newPatientsRef.current.getSelectedItems().toString();
      //requestBody.placeInDirectory = placeInDirectoryRef.current.getSelectedItems().toString();
      //requestBody.licenseType = licenseTypeRef.current.getSelectedItems().toString();
      //requestBody.ecfmgQues = ecfmgQuesRef.current.getSelectedItems().toString();

      //console.log("caseNumber after: ",caseNumber);
      //requestBody.caseNumber = caseNumber;

      //delete requestBody.languagesDefault;
      //delete requestBody.agesSeenDefault;
      //delete requestBody.ethnicityDefault;
      //delete requestBody.genderDefault;
      //delete requestBody.licenseTypeDefault;
      //delete requestBody.newPatientsDefault;
      //delete requestBody.salutationDefault;
      //delete requestBody.placeInDirectoryDefault;
      //delete requestBody.ecfmgQuesDefault;

      requestBody = trimJsonValues(requestBody);
      console.log("Save Form Data requestBody: ", requestBody);

      let mainWIObject = {};
      //mainWIObject.caseNumber = caseNumber;
      mainWIObject.firstName = requestBody.firstName;
      mainWIObject.lastName = requestBody.lastName;
      mainWIObject.npiId = requestBody.caqhNpiId;
      mainWIObject.transactionType = AddProvider.displayName;
      mainWIObject.caseStatus = "Open";
      mainWIObject.Field1 = requestBody.contractId;
      mainWIObject.Field2 = requestBody.states;

      //Added on 2/9/23
      //mainWIObject.caseID = caseNumber;
      const flowId = credentialingConfigData["FlowId"];
      const stageId = credentialingConfigData["StageId"];
      const stageName = credentialingConfigData["StageName"];

      //console.log('Inside add provider config file variables: ',flowId + ' stageId: ',stageId+' stageName: ',stageName);

      mainWIObject.createdByName = mastersSelector.hasOwnProperty("auth")
        ? mastersSelector.auth.hasOwnProperty("userName")
          ? mastersSelector.auth.userName
          : "system"
        : "system";
      mainWIObject.flowId = flowId;
      mainWIObject.stageName = stageName;
      mainWIObject.stageId = stageId;
      mainWIObject.LegalEntityName = requestBody.organizationName;
      mainWIObject.delegated = requestBody.delegated;
      mainWIObject.lockStatus = "N";

      mainWIObject = trimJsonValues(mainWIObject);
      console.log("Main Workitem data: ", mainWIObject);

      apiJson["MainCaseTable"] = mainWIObject;
      apiJson["SelfServ_Prov_Details"] = requestBody;

      //Newly Added by 09/26/2023
      /*let networkBody = {};
        networkBody.caseNumber = prop.state.caseNumber;
        //console.log("networkTabBody.caseNumber: ",networkBody.caseNumber);
        apiJson["SelfServ_Network_Details"] = networkBody;*/
      //Till Here

      //     axios
      // .post(apiUrl+'saveMainWorkitem', mainWIObject)
      // .then((res) => {
      //     console.log("api response: ",res.status);
      //     if(res.status === 200){
      //         //alert("Data Saved Succesfully");
      //     }
      // })
      // .catch((err) => {
      //     console.log(err.message);
      //     //alert("Error in saving data");
      // });

      //     axios
      // .post(apiUrl+'addProvider/provider', requestBody)
      // .then((res) => {
      //     console.log("api response: ",res.status);
      //     if(res.status === 200){
      //         //alert("Data Saved Succesfully");
      //     }
      // })
      // .catch((err) => {
      //     console.log(err.message);
      //     //alert("Error in saving data");
      // });

      apiJson = saveGridData(apiJson);
      console.log("apijson", apiJson);
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
      //console.log("quesAnsListJson: ", quesAnsListJson);
      if (quesAnsListJson.length > 0) {
        let quesResponse = [];

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
          //quesResponse.push({questionId:data['questionId'], response:(data['response']!==undefined?data['response'].value:null),rowNumber:data['questionId'] })
        }); // [{questionId,response}]
        // Making my array here in order to insert values in table columns
        //console.log("quesResponse: ", quesResponse);
        apiJson["SelfServ_AdditionalQues_Grid"] = quesResponse;
      }
      //till here 03

      console.log("Case JSON: ", apiJson);

      //Added by Nidhi Gupta
      if (
        callProcRef.current === "callProc" &&
        apiJson["SelfServ_Prov_Details"].ecfmgQues === "Y"
      ) {
        if (
          apiJson["SelfServ_Prov_Details"].ecfmgNumber === "" ||
          apiJson["SelfServ_Prov_Details"].ecfmgNumber === undefined ||
          apiJson["SelfServ_Prov_Details"].ecfmgNumber === null ||
          apiJson["SelfServ_Prov_Details"].ecfmgIssueDate === "" ||
          apiJson["SelfServ_Prov_Details"].ecfmgIssueDate === undefined ||
          apiJson["SelfServ_Prov_Details"].ecfmgIssueDate === null
        ) {
          // || ((apiJson["SelfServ_Prov_Details"].ecfmgExpirationDate === '') || (apiJson["SelfServ_Prov_Details"].ecfmgExpirationDate === undefined)))
          alert(
            "ECFMG Number and ECFMG Issue Date are required if ECFMG is Yes"
          );
          setButtonDisableFlag(false); //Added on 5/17/2023
          return;
        }
      }
      // Till here

      //Newly added by Nidhi Gupta on 08/04/2023

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
      // if (
      //   callProcRef.current === "callProc" &&
      //   (apiJson["SelfServ_Prov_Details"].delegated === undefined ||
      //     apiJson["SelfServ_Prov_Details"].delegated === "")
      // ) {
      //   alert("Please select Delegated.");
      //   setButtonDisableFlag(false);
      //   return;
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

      /*customAxios
          .post("/generic/create", apiJson, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            console.log("Data saved successfully: ", res);
            const apiStat = res.data["CreateCase_Output"]["Status"];*/
      if (apiStat === -1) {
        alert("Case is not created.");
        setButtonDisableFlag(false); //Added on 5/17/2023
      }

      if (apiStat === 0) {
        //alert("Case created with case number: "+res.data['CreateCase_Output']['CaseNo']);

        /*Added by Harshit Sharma wrt load checklist documents on cred specialist stage */
        let procData = {};
        let procDataState = {};
        procDataState.stageName = stageName;
        procDataState.flowId = flowId;
        procDataState.caseNumber = response.data["CreateCase_Output"]["CaseNo"];
        procDataState.decision = "Submit";
        procDataState.userName = mastersSelector.hasOwnProperty("auth")
          ? mastersSelector.auth.hasOwnProperty("userName")
            ? mastersSelector.auth.userName
            : "system"
          : "system";
        procDataState.formNames = AddProvider.displayName;

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
                if (response.status === 200) {
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
                if (response.status === "") {
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
        //else {
        alert(
          "Case created successfully: " +
          response.data["CreateCase_Output"]["CaseNo"]
        );
        //submitCase(procData, navigateHome);
        //}
        submitCase(procData, navigateHome);
      }
      //navigateHome();  //uncomment after testing
    } catch (error) {
      /*if(!handleSubmit()){
            const errorMsg = errors[Object.keys(errors)[0]];
            alert(errorMsg);
        }*/
      console.error("Error occurred in saveFormData: ", error);
      alert("An error occurred while saving the form data.");
      setButtonDisableFlag(false); // Re-enable the button
    }
  };

  // Updated by SHivani for CAQH and NPI validation
  const saveData = (values) => {
    if (!getNPIFromMaster(values.caqhNpiId, prop.state.decision, callProcRef.current)) {
      if (tabRef.current === "HomeView") {
        saveFormData(values);
      }

      if (tabRef.current === "DashboardView") {
        printConsole(
          "Inside dashboard view before if : ",
          formikInitializeState
        );
        if (formikInitializeState) {
          printConsole("Inside dashboard view if : ", formikInitializeState);
          setFormikInitializeState(false);
        }
        setTimeout(() => {
          printConsole(
            "Inside dashboard view timeout : ",
            formikInitializeState
          );
          updateFormData(values);
        }, 1000);
      }
      /* if(!!values.caqhId)
     {
      const organizationId = process.env.REACT_APP_ORG_ID;
      customAxios.get(`caqh/validate?caqhId=${values.caqhId}&orgId=${organizationId}`,
      {headers:{'Authorization':`Bearer ${token}`}})
    .then((res) => {
    if(res.status === 200){
      if(!!res.data){
              if(res.data.roosterStatus == 'ACTIVE' &&
              res.data.providerFoundFlag =='Y' &&
              res.data.authorizationFlag=='Y' &&
              (res.data.providerStatus == 'Re-Attestation' || res.data.providerStatus == 'Initial Profile Complete'))
              {
              console.log("saveData Values: ",values);
              if(tabRef.current === "HomeView"){
                  saveFormData(values);
              }

              if(tabRef.current === "DashboardView"){
                  printConsole("Inside dashboard view before if : ",formikInitializeState);
                  if(formikInitializeState){
                      printConsole("Inside dashboard view if : ",formikInitializeState);
                      setFormikInitializeState(false);
                  }
                  setTimeout(() => {
                      printConsole("Inside dashboard view timeout : ",formikInitializeState);
                      updateFormData(values);
                  }, 1000);
              }}
              else{
                  alert("CAQH ID is not valid");
              }
          }
      }})
      .catch((err)=>{alert("CAQH ID is not correct");})
     }*/
    } else {
      alert(
        "NPI ID " +
        values.caqhNpiId +
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
    return null;
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

  const updateFormData = async (values) => {
    try {
      let validateDec = true;
      let updatedData = filterData();
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

      printConsole("Inside updateFormData", values);
      console.log("APitest inside update form data", apiTestState);
      setButtonDisableFlag(true);
      delete values.caseNumber;

      //console.log("potentialDupData updateFormData: ",potentialDupData);
      //values = {...dashbrdApiTestState};
      //setApiTestState({...apiTestState,values});
      printConsole(
        "Inside updateFormData states values: ",
        apiTestState.states
      );
      let requestBody = { ...values };
      //values.gender = ((apiTestState.gender!==undefined)?apiTestState.gender.value:'');
      requestBody.gender =
        values.gender.value !== undefined ? values.gender.value : "";
      requestBody.agesSeen =
        apiTestState.agesSeen !== undefined ? apiTestState.agesSeen.value : "";
      //values.states = ((apiTestState.states!==undefined || apiTestState.states!=='')?apiTestState.states.map(el => el.value).toString():apiTestState.states);
      requestBody.states =
        apiTestState.states !== undefined
          ? Array.isArray(apiTestState.states)
            ? apiTestState.states.map((el) => el.value.toString()).toString()
            : ""
          : "";
      requestBody.newPatients =
        apiTestState.newPatients !== undefined
          ? apiTestState.newPatients.value
          : "";
      //   requestBody.placeInDirectory =
      // apiTestState.placeInDirectory !== undefined
      //   ? apiTestState.placeInDirectory.value
      //   : "Yes";
      requestBody.delegated =
        values.delegated.value !== undefined ? values.delegated.value : null;
      requestBody.ecfmgQues =
        apiTestState.ecfmgQues !== undefined
          ? apiTestState.ecfmgQues.value
          : "";

      requestBody.contractId =
        apiTestState.contractId !== undefined &&
          apiTestState.contractId !== null
          ? apiTestState.contractId.value
          : "";
      //console.log("Updated apiTestState.attestationDate", apiTestState.dateOfBirth);
      // requestBody.dateOfBirth = (apiTestState?.dateOfBirth !== undefined)?apiTestState?.dateOfBirth.toLocaleDateString():apiTestState?.dateOfBirth;

      requestBody.dateOfBirth = extractDate(apiTestState.dateOfBirth);
      requestBody.ecfmgIssueDate = extractDate(apiTestState.ecfmgIssueDate);
      requestBody.ecfmgExpirationDate = extractDate(
        apiTestState.ecfmgExpirationDate
      );
      requestBody.attestationDate = extractDate(apiTestState.attestationDate);
      /*requestBody.dateOfBirth = getDatePart(apiTestState.dateOfBirth);
      requestBody.ecfmgIssueDate = (apiTestState?.ecfmgIssueDate !== undefined)?apiTestState?.ecfmgIssueDate.toLocaleDateString():apiTestState?.ecfmgIssueDate;
      requestBody.ecfmgExpirationDate = (apiTestState?.ecfmgExpirationDate !== undefined)?apiTestState?.ecfmgExpirationDate.toLocaleDateString():apiTestState?.ecfmgExpirationDate;
      requestBody.attestationDate = (apiTestState?.attestationDate !== undefined)?apiTestState?.attestationDate.toLocaleDateString():apiTestState?.attestationDate;
      */
      requestBody.Medicaid = apiTestState.Medicaid;
      requestBody.Medicare =
        apiTestState.Medicare !== undefined ? apiTestState.Medicare : true;
      //let newApiTest = {...apiTestState};
      // let updatedLinearJson = CompareJSON(requestBody,newApiTest);
      let apiTestStateCopy = { ...linearFieldsRef.current.linearFields };
      let updatedLinearJson = CompareJSON(requestBody, apiTestStateCopy);

      console.log("Update with Linear: before ", updatedLinearJson);
      gridDataRef.current.linearTable = trimJsonValues(updatedLinearJson);
      //gridDataRef.current.linearTable = trimJsonValues(requestBody);

      console.log("gridDatRef update with Linear: after ", gridDataRef.current);
      if (quesAnsListJson.length > 0) {
        let quesResponse = [];
        quesAnsListJson.map((data) => {
          quesResponse.push({
            questionId: data["questionId"],
            response: data["response"].value,
            rowNumber: data["questionId"],
            //Added by NG on 1/23/2024
            operation: !!data.operation && data.operation == "I" ? "I" : "U",
            //Till Here
          });
        });

        gridDataRef.current.SelfServ_AdditionalQues_Grid = quesResponse;
        // console.log(
        //   " gridDataRef.current.SelfServ_AdditionalQues_Grid: ",
        //   gridDataRef.current.SelfServ_AdditionalQues_Grid
        // );
        // console.log("quesResponse02: ", quesResponse02);
      }

      //Newly Added by Nidhi Gupta on 09/26/2023
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
      //Added by Nidhi Gupta on 10/06/2023
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
      // networkBody.conEffectiveDate = !!apiTestStateComp.conEffectiveDate
      //   ? apiTestStateComp.conEffectiveDate.toLocaleDateString()
      //   : null;
      networkBody.conEffectiveDate = extractDate(apiTestStateComp.conEffectiveDate)

      networkBody.mocAttestationDate = extractDate(apiTestStateComp.mocAttestationDate)

      networkBody.mocRenewalAttDate = extractDate(apiTestStateComp.mocRenewalAttDate)

      //Till Here
      console.log("networkBody Update: ", requestBody);

      if (
        (prop.state.stageName === "Cred Specialist" ||
          prop.state.stageName === "QA") &&
        apiCallOnce &&
        Object.keys(apiTestStateComp).length > 0 &&
        Object.values(apiTestStateComp).some(
          (value) => value !== "" && value !== null
        )
      ) {
        //const isAnyValueNotEmpty = Object.values(apiTestStateComp).some(value => value !== '' && value !== null);
        //console.log("if checkNtwkHasData2: ",Object.keys(apiTestStateComp).length);
        //console.log("else checkNtwkHasData3 isAnyValueNotEmpty: ",isAnyValueNotEmpty);
        gridDataRef.current.SelfServ_Network_Details =
          trimJsonValues(networkBody);
      }

      //console.log("gridDataRef.current.compensationTable: ", gridDataRef.current.compensationTable);
      //console.log("gridDataRef.current.firlTable: ", gridDataRef.current.firlTable);
      //gridDataRef.current.SelfServ_ProviderComp_Grid= gridDataRef.current.compensationTable;
      //gridDataRef.current.SelfServ_HospitalComp_Grid= gridDataRef.current.firlTable;
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

      console.log(" Update gridDataRef.current.linearTable: ", values);
      // const gridKeys = getTableDetails()["providerLinear"].concat(
      //   getTableDetails()["gridTables"]
      // );
      // console.log("gridKeys: ", gridKeys);
      //  console.log("Inside updateFormData gridDataRef.current before==== ",gridDataRef.current);
      //   gridKeys.forEach((k) => {
      //     const newKey = k.split("~")[0];
      //     const oldKey = k.split("~")[1];
      //     gridDataRef.current = renameKey(gridDataRef.current, oldKey, newKey);
      //   });

      //   console.log("Inside updateFormData gridDataRef.current after==== ",gridDataRef.current);

      gridDataRef.current.caseNumber = prop.state.caseNumber;

      let validated = true;
      // if (
      //   callProcRef.current === "callProc" &&
      //   prop.state.decision !== undefined &&
      //   prop.state.decision !== ""
      // ) {
      //   const dec =
      //     prop.state.decision !== undefined
      //       ? prop.state.decision.toUpperCase().trim()
      //       : "";
      //   if (dec === "APPROVE") {
      //     validated = validateGridData(credentialTableRowsData);
      //   }
      // }

      if (validated || callProcRef.current !== "callProc") {
        //if(validated){
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
          if (
            callProcRef.current === "callProc" &&
            requestBody.ecfmgQues === "Y"
          ) {
            if (
              requestBody.ecfmgNumber === "" ||
              requestBody.ecfmgNumber === undefined ||
              requestBody.ecfmgNumber === null ||
              requestBody.ecfmgIssueDate === "" ||
              requestBody.ecfmgIssueDate === undefined ||
              requestBody.ecfmgIssueDate === null
            ) {
              // || ((gridDataRef.current.SelfServ_Prov_Details.ecfmgExpirationDate === '') || (gridDataRef.current.SelfServ_Prov_Details.ecfmgExpirationDate === undefined)))
              alert(
                "ECFMG Number and ECFMG Issue Date are required if ECFMG is Yes"
              );
              setButtonDisableFlag(false); //Added on 5/17/2023
              return;
            }
          }
          // if (
          //   callProcRef.current === "callProc" &&
          //   (gridDataRef.current.SelfServ_Prov_Details.delegated === undefined ||
          //     gridDataRef.current.SelfServ_Prov_Details.delegated === "")
          // ) {
          //   alert("Please select Delegated");
          //   setButtonDisableFlag(false);
          //   return;
          // }
          //Newly Added by Nidhi Gupta on 8/7/2023
          console.log("contractId xx: ", requestBody.contractId);
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

          //Added by Nidhi Gupta on 08/22/2023
          // Commented for testing
          //  if(((callProcRef.current === 'callProc' && !(validatePotentialDup(potentialDupData))))){
          //     setButtonDisableFlag(false);
          //              alert("Please select Action dropdown for all cases.");
          //              setButtonDisableFlag(false);
          //              return;
          // }

          //Till Here
          if (callProcRef.current === "callProc" && dec === "") {
            alert("Please select Decision.");
            setButtonDisableFlag(false); //Added on 5/17/2023
            return;
          }

          //08/22/2023
          if (callProcRef.current === "callProc" && dec !== "") {
            //const dec = (prop.state.decision !== undefined)?prop.state.decision.toUpperCase().trim():'';

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

          //let dec = '';

          if (callProcRef.current === "callProc" && dec !== "") {
            //saveType = 'SS';
            console.log(
              "Inside validate credchecklist grid decision value ====== ",
              dec
            );
            if (
              dec !== "DISCARD" &&
              dec !== "EXIT" &&
              apiTestState.delegated?.value &&
              apiTestState.delegated.value.toLowerCase() === "no"
            ) {
              validated = validateGridData(credentialTableRowsData);
              console.log(
                "Inside validate credchecklist grid validated ====== ",
                validated
              );
              if (validated) {
                gridDataRef.current.SelfServ_Credential_Grid =
                  credentialTableRowsData;
              }
            }
          }
        }

        //till here
        if (validated) {
          console.log(
            "Inside updateFormData gridDataRef.current before==== ",
            gridDataRef.current
          );
          const gridKeys = getTableDetails()["providerLinear"].concat(
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
          //console.log(" Before Hurrayyyyy gridDataRef.current: ", gridDataRef.current);
          if (Array.isArray(gridDataRef.current.SelfServ_Location_Grid)) {
            gridDataRef.current.SelfServ_Location_Grid.map((data) => {
              //console.log("After Hurrayyyyyyyyyyy data: ", data);
              data.languages = Array.isArray(data.languages)
                ? typeof data.languages !== "string"
                  ? data.languages.map((el) => el.value).toString()
                  : data.languages
                : "";
            });
          }
          // console.log("After Hurrayyyyy gridDataRef.current: ", gridDataRef.current);
          //Till here

          if (Array.isArray(gridDataRef.current.SelfServ_Insurance_Grid)) {
            gridDataRef.current.SelfServ_Insurance_Grid.map((data) => {
              data.covAmount = data.covAmount === "" ? null : data.covAmount;
              data.covAmountAgg =
                data.covAmountAgg === "" ? null : data.covAmountAgg;
            });
          }

          // console.log("Gaurav gridDataRef.current: ",gridDataRef.current);
          await customAxios
            .post("/generic/update", gridDataRef.current, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              console.log("Data Update result: ", res);
              const apiStat = res.data["UpdateCase_Output"]["Status"];
              if (apiStat === -1) {
                alert("Data not updated.");
                setButtonDisableFlag(false); //Added on 5/17/2023
              }

              if (apiStat === 0) {
                alert("Case data updated successfully");
                updateDecision(prop, saveType, AddProvider.displayName);

                //Commented by Harshit as the belo api call is moved to updateDecision.
                /*let procInput = {};
                procInput.input1 = "testing";
                procInput.input2 = AddProvider.displayName;
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
                  })
                  .catch((err) => {
                    console.log(
                      "Caught in update queue variable api call: ",
                      err.message
                    );
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
    try {
      console.log(
        "Inside rename key old key = ",
        oldKey,
        " new key = ",
        newKey
      );
      console.log(
        "Inside rename key hasOwnProperty = ",
        obj.hasOwnProperty(oldKey)
      );
      console.log("Inside rename key obj[oldKey] = ", obj[oldKey]);
      console.log("Inside rename key obj[newKey] = ", obj[newKey]);
      if (obj.hasOwnProperty(oldKey)) {
        obj[newKey] = obj[oldKey];
        delete obj[oldKey];
      }
      return obj;
    } catch (error) {
      // Handle the error here
      console.error("An error occurred renameKey:", error);
    }
  };

  const manageLinearState = (requestBody) => {
    //requestBody.languages = languageRef.current.getSelectedItems().toString();
    //requestBody.gender = genderRef.current.getSelectedItems().toString();
    //requestBody.salutation = salutationRef.current.getSelectedItems().toString();
    // requestBody.ethnicity = ethnicityRef.current.getSelectedItems().toString();
    //requestBody.agesSeen = agesSeeneRef.current.getSelectedItems().toString();
    //requestBody.newPatients = newPatientsRef.current.getSelectedItems().toString();
    //requestBody.licenseType = licenseTypeRef.current.getSelectedItems().toString();
    //requestBody.ecfmgQues = ecfmgQuesRef.current.getSelectedItems().toString();
    requestBody.userName = "system";
    //console.log("caseNumber after: ",caseNumber);
    //requestBody.caseNumber = caseNumber;

    delete requestBody.languagesDefault;
    //delete requestBody.agesSeenDefault;
    //delete requestBody.ethnicityDefault;
    //delete requestBody.genderDefault;
    delete requestBody.licenseTypeDefault;
    //delete requestBody.newPatientsDefault;
    //delete requestBody.salutationDefault;
    //delete requestBody.ecfmgQuesDefault;

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
    const educationResponse = getGridDataValues(educationTableRowsData);
    const trainingResponse = getGridDataValues(trainingTableRowsData);
    const workResponse = getGridDataValues(workTableRowsData);
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
    if (educationResponse.length > 0) {
      //apiUrlObject["name"] = 'Education Table';
      //apiStr = apiStr + 'addSpeciality/speciality';
      //apiUrlObject["apiKey"] = apiStr;
      apiJson["SelfServ_Education_Grid"] = educationResponse;
      //apiUrlArray.push(apiUrlObject);
      //apiStr = apiUrl;
      //apiUrlObject = {};
    }
    if (trainingResponse.length > 0) {
      //apiUrlObject["name"] = 'Training Table';
      //apiStr = apiStr + 'addSpeciality/speciality';
      //apiUrlObject["apiKey"] = apiStr;
      apiJson["SelfServ_Training_Grid"] = trainingResponse;
      //apiUrlArray.push(apiUrlObject);
      //apiStr = apiUrl;
      //apiUrlObject = {};
    }
    if (workResponse.length > 0) {
      //apiUrlObject["name"] = 'Speciality Table';
      //apiStr = apiStr + 'addSpeciality/speciality';
      //apiUrlObject["apiKey"] = apiStr;
      apiJson["SelfServ_WorkHistory_Grid"] = workResponse;
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

  // const getGridDataValues = (tableData) => {
  //    //var headers = document.getElementById(tableId).headers;
  //    let returnArray = [];
  //    tableData.map((data) => {
  //     const dataObject = {};
  //     const dataKeys = Object.keys(data);
  //     dataKeys.forEach((dataValue) => {
  //         const dataKeyType = typeof(data[dataValue]);
  //         //console.log("data key : ",dataValue, " type: ", dataKeyType);
  //         if(dataKeyType === 'object'){
  //             console.log("Inside Data Object if: ",dataObject);
  //             dataObject[dataValue] = (data[dataValue].value!==undefined)?data[dataValue].value:'';
  //         }
  //         if(dataKeyType !== 'object'){
  //             console.log("Inside Not Data Object if: ",dataObject);
  //             dataObject[dataValue] = data[dataValue];
  //         }
  //     })
  //         //dataObject.caseNumber = caseNumber;
  //         console.log("Data Object: ",dataObject);
  //         returnArray.push(dataObject);
  //    })
  //     return returnArray;
  // }
  const getGridDataValues = (tableData) => {
    //var headers = document.getElementById(tableId).headers;
    let returnArray = [];
    tableData.map((data) => {
      const dataObject = {};
      const dataKeys = Object.keys(data);
      dataKeys.forEach((dataValue) => {
        const dataKeyType = typeof data[dataValue];
        console.log("data key : ", dataValue, " type: ", dataKeyType);
        if (dataKeys.includes("license") && dataValue === "expirationDate") {
          //console.log('----------------------dataKeyType----------------------', dataKeyType, dataValue, data[dataValue], data[dataValue].value);
        }

        if (dataKeyType === "object") {
          console.log("Inside Data Object if: ", dataObject);
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
      //dataObject.caseNumber = caseNumber;
      returnArray.push(trimJsonValues(dataObject));
    });
    return returnArray;
  };

  const transformDate = (date) => {
    const indexOfT = date.indexOf("T");
    if (indexOfT != -1) {
      return date.substring(0, indexOfT);
    } else {
      return date;
    }
  };

  // Added by Shivani to integrate CountyName

  /*  const getCountyFromMaster =(DataState,Zip) => {
    console.log("County data table", mastersSelector.masterCounty);
    let responseCounty = '';
    if(mastersSelector.masterCounty[0] !== undefined && mastersSelector.masterCounty[0] !== null)
    {
        mastersSelector.masterCounty[0].forEach((elem) =>{

                if(elem.StateId === DataState && elem.ZipCodes.includes(Zip)){
                    responseCounty = elem.CountyName;
                    return;
                }
    })
    }
    return responseCounty.trim();
}*/

  const getEmailfromAssociate = (Associate) => {
    if (Array.isArray(Associate)) {
      let receivedEmail = "";

      Associate.forEach((ele) => {
        if (ele.AssociateType.IsPrimaryCredentialingContact === 1) {
          receivedEmail = ele.EmailAddress;
          return;
        }
      });
      // console.log("receivedEmail",receivedEmail);
      return receivedEmail;
    } else {
      if (typeof Associate === "object") {
        return Associate.EmailAddress;
      }
    }
  };

  const getData = (e, caqhId, ssn, orgName, contractNo) => {
    try {
      console.log("CAQHId:", caqhId, "Hi");
      //console.log("Inside getData orgName: ", orgName);
      //console.log("Inside getData contractNo: ", contractNo);
      if (caqhId) {
        if (userType == "P" && !ssn) {
          setCaqhGenericModal({
            header: "Field Required!",
            body: "Please enter last 4 digits of SSN to retrieve data.",
            state: true,
          });
          return;
        }
        setLoading(true);
        e.preventDefault();
        setApiTestState(() => {
          return {
            ...initState,
            caqhId: caqhId,
            organizationName: orgName,
            contractId: contractNo,
          };
        });
        setLocationTableRowsData([]);
        setspecialityTableRowsData([]);
        setLicenseTableRowsData([]);
        setPayToTableRowsData([]);
        setEducationTableRowsData([]);
        setTrainingTableRowsData([]);
        setWorkTableRowsData([]);
        setInsuranceTableRowsData([]);
        setCredentialTableRowsData([]);
        //setAdditionalQuesRowsData([]);

        //const caqhId = apiTestState.caqhId;
        // const caqhId = caqhId;
        // alert(JSON.stringify(caqhId));
        //console.log("Languages: "+languageRef.current.getSelectedItems().toString());
        console.log("requestBody: ", apiTestState);
        const organizationId = process.env.REACT_APP_ORG_ID;
        //alert(organizationId);
        customAxios
          .get(`caqh/validate?caqhId=${caqhId}&orgId=${organizationId}`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            // Promise.resolve({
            //     status: 200,
            //     data:{roster_status:"ACTiiIVE"}
            // }).then((res) => {
            // console.log("api response: ",res.data);
            if (res.status === 200) {
              if (res.data) {
                if (
                  res.data.roosterStatus == "ACTIVE" &&
                  res.data.providerFoundFlag == "Y" &&
                  res.data.authorizationFlag == "Y" &&
                  (res.data.providerStatus == "Re-Attestation" ||
                    res.data.providerStatus == "Initial Profile Complete")
                ) {
                  // if(res.data.roosterStatus == 'ACTIVE'){
                  const organizationId = process.env.REACT_APP_ORG_ID;

                  customAxios
                    .get(
                      `caqh/credentialing?caqhProviderId=${caqhId}&organizationId=${organizationId}&attestationDate=${res.data.providerStatusDate}`,
                      { headers: { Authorization: `Bearer ${token}` } }
                    )
                    // Promise.resolve({
                    //     status: 200,
                    //     data: caqhRes
                    // })
                    .then((caqhRes) => {
                      if (
                        !!caqhRes &&
                        caqhRes.status == 200 &&
                        !!caqhRes.data &&
                        Object.keys(caqhRes.data).length > 0
                      ) {
                        console.log(
                          "CAQH Res --------------------->",
                          caqhRes.data
                        );
                        const apiResponse = caqhRes.data.Provider;
                        const respssn = String(
                          checkDataAvailable(apiResponse.SSN)
                        );
                        const respSubStr = respssn.substring(
                          respssn.length,
                          respssn.length - 4
                        );
                        if (
                          !!respSubStr &&
                          userType == "P" &&
                          // respssn.toString().substr(-4) !== ssn
                          respSubStr !== ssn
                        ) {
                          setLoading(false);
                          setLoadForm(false);
                          setTimeout(() => {
                            setLoadForm(true);
                          }, 50);
                          setCaqhGenericModal({
                            header: "SSN Mismatch",
                            body: "Last 4 digits of SSN do not match.",
                            state: true,
                          });
                          return;
                        }

                        setLoadForm(false);
                        let gridDataArray = [];

                        // alert("Data Get Succesfully");
                        console.log("CAQH DATA REtRIEVAL GET ", apiResponse);
                        setApiTestState((prevState) => {
                          return {
                            //...apiTestState,
                            //...prevState,
                            //organizationName:apiResponse.organizationName,
                            // firstName:apiResponse.FirstName,
                            // organizationName: "",
                            organizationName:
                              orgName !== undefined && orgName.length > 0
                                ? orgName
                                : "",
                            firstName: checkDataAvailable(
                              apiResponse.FirstName
                            ),
                            // middleName: checkDataAvailable(apiResponse.MiddleName),
                            middleName: checkDataAvailable(
                              apiResponse.MiddleName
                            )
                              ? checkDataAvailable(apiResponse.MiddleName)
                              : "", //Changed by Nidhi Gupta on 5/17/2023
                            lastName: checkDataAvailable(apiResponse.LastName),
                            gender:
                              !!checkDataAvailable(apiResponse.Gender) &&
                                !!checkDataAvailable(
                                  apiResponse.Gender.GenderDescription
                                )
                                ? {
                                  label: convertToCase(
                                    apiResponse.Gender.GenderDescription
                                  ),
                                  value: convertToCase(
                                    apiResponse.Gender.GenderDescription
                                  ),
                                }
                                : null,
                            suffix: checkDataAvailable(apiResponse.suffix)
                              ? checkDataAvailable(apiResponse.suffix)
                              : "", //Changed by Nidhi Gupta on 5/17/2023
                            caqhId: caqhId,
                            caqhNpiId: checkDataAvailable(apiResponse.NPI),
                            ssn: checkDataAvailable(apiResponse.SSN),

                            //Added by Nidhi Gupta on 08/20/2023
                            delegated:
                              !!checkDataAvailable(apiResponse.DelegatedFlag) &&
                                apiResponse.DelegatedFlag == 1
                                ? { label: "Yes", value: "Yes" }
                                : { label: "No", value: "No" },
                            //Till Here
                            ecfmgQues:
                              !!checkDataAvailable(apiResponse.ECFMGFlag) &&
                                apiResponse.ECFMGFlag == 1
                                ? { label: "Yes", value: "Yes" }
                                : { label: "No", value: "No" },
                            dateOfBirth: checkDataAvailable(
                              apiResponse.BirthDate
                            )
                              ? new Date(apiResponse.BirthDate)
                              : null,
                            //dateOfBirth: !!checkDataAvailable(apiResponse.BirthDate) ? new Date(transformDate(apiResponse.BirthDate)) : null,
                            //Commented by SHivani for caqh
                            // emailId: checkDataAvailable(
                            //   apiResponse.EmailAddress
                            // ),
                            emailId: checkDataAvailable(
                              getEmailfromAssociate(apiResponse.Associate)
                            ),

                            // caqhNpiId:apiResponse.caqhNpiId,
                            // ssn:apiResponse.ssn,

                            //medicaidId:(!!apiResponse.ProviderMedicaid.MedicaidNumber) ? apiResponse.ProviderMedicaid.MedicaidNumber : null,
                            // medicaidId:apiResponse.medicaidId,
                            //newPatients:apiResponse.newPatients,

                            //Commented by Nidhi Gupta on 08/01/2023 as we do not want to populate Medicare switch on the basis of CAQH
                            // Medicaid:!!apiResponse.MedicaidProviderFlag,
                            // Medicare:!!apiResponse.MedicareProviderFlag,
                            //Till Here

                            //exchange:apiResponse.exchange,
                            //commercial:apiResponse.commercial,
                            // ecfmgNumber: checkDataAvailable(apiResponse.ECFMGNumber),
                            ecfmgNumber: checkDataAvailable(
                              apiResponse.ECFMGNumber
                            )
                              ? checkDataAvailable(apiResponse.ECFMGNumber)
                              : "", //Changed by Nidhi Gupta on 5/17/2023
                            ecfmgIssueDate: checkDataAvailable(
                              apiResponse.ECFMGIssueDate
                            )
                              ? new Date(apiResponse.ECFMGIssueDate)
                              : null,
                            ecfmgExpirationDate: checkDataAvailable(
                              apiResponse.ECFMGExpirationDate
                            )
                              ? new Date(apiResponse.ECFMGExpirationDate)
                              : null,
                            attestationId: checkDataAvailable(
                              apiResponse.ProviderAttestID
                            ),
                            attestationDate: apiResponse.AttestDate
                              ? new Date(apiResponse.AttestDate)
                              : "",
                            medicaidId:
                              !!checkDataAvailable(
                                apiResponse.MedicaidProviderFlag
                              ) && apiResponse.MedicaidProviderFlag == 1
                                ? Array.isArray(apiResponse.ProviderMedicaid)
                                  ? apiResponse.ProviderMedicaid[0]
                                    .MedicaidNumber
                                  : apiResponse.ProviderMedicaid.MedicaidNumber
                                : "",
                            medicareId:
                              !!checkDataAvailable(
                                apiResponse.MedicareProviderFlag
                              ) && apiResponse.MedicareProviderFlag == 1
                                ? Array.isArray(apiResponse.ProviderMedicare)
                                  ? apiResponse.ProviderMedicare[0]
                                    .MedicareNumber
                                  : apiResponse.ProviderMedicare.MedicareNumber
                                : "",
                            contractId:
                              contractNo !== undefined && contractNo.length > 0
                                ? contractNo
                                : "",
                          };
                        });
                        setFormikInitializeState(true);

                        // alert('ashish12123213');
                        let licenseArray = [];
                        if (apiResponse.ProviderLicense) {
                          if (Array.isArray(apiResponse.ProviderLicense)) {
                            let row = 1;
                            licenseArray = apiResponse.ProviderLicense.map(
                              (data) => {
                                const dataObj = {
                                  operation: "I",
                                  rowNumber: row++,
                                  license: checkDataAvailable(
                                    data.LicenseNumber
                                  ),
                                  stateAbbreviation: checkDataAvailable(
                                    data.State
                                  ),
                                  type: "",
                                  licenseType: checkDataAvailable(
                                    data.LicenseType
                                  ),
                                  // stateAbbreviation: checkDataAvailable(
                                  //   data.State
                                  // ),
                                  expirationDate: checkDataAvailable(
                                    data.ExpirationDate
                                  )
                                    ? new Date(data.ExpirationDate)
                                    : "",
                                };

                                return getTransformed(dataObj);
                              }
                            );
                          } else {
                            const dataObj = {
                              operation: "I",
                              rowNumber: licenseArray.length + 1,
                              license: checkDataAvailable(
                                apiResponse.ProviderLicense.LicenseNumber
                              ),
                              stateAbbreviation: checkDataAvailable(
                                apiResponse.ProviderLicense.State
                              ),
                              type: "",
                              licenseType: checkDataAvailable(
                                apiResponse.ProviderLicense.LicenseType
                              ),
                              stateAbbreviation: checkDataAvailable(
                                apiResponse.ProviderLicense.State
                              ),
                              expirationDate: checkDataAvailable(
                                apiResponse.ProviderLicense.ExpirationDate
                              )
                                ? new Date(
                                  apiResponse.ProviderLicense.ExpirationDate
                                )
                                : "",
                            };
                            licenseArray.push(getTransformed(dataObj));
                          }
                        }

                        //  Added by Shivani for License Table to add DEA Number
                        if (apiResponse.hasOwnProperty("ProviderDEA")) {
                          const DataObject1 = {
                            operation: "I",
                            rowNumber: licenseArray.length + 1,
                            license: checkDataAvailable(
                              apiResponse.ProviderDEA.DEANumber
                            ),
                            stateAbbreviation: checkDataAvailable(
                              apiResponse.ProviderDEA.State
                            ),
                            type: "DEA Number",
                            expirationDate: checkDataAvailable(
                              apiResponse.ProviderDEA.ExpirationDate
                            )
                              ? new Date(apiResponse.ProviderDEA.ExpirationDate)
                              : "",
                          };
                          licenseArray.push(getTransformed(DataObject1));
                        }
                        setLicenseTableRowsData(licenseArray);

                        let specialityArray = [];
                        if (apiResponse.Specialty) {
                          if (Array.isArray(apiResponse.Specialty)) {
                            let row = 1;
                            specialityArray = apiResponse.Specialty.map(
                              (data) => {
                                const dataObj = {
                                  operation: "I",
                                  rowNumber: row++,
                                  taxonomyCode: checkDataAvailable(
                                    data.NUCCTaxonomyCode
                                  ),
                                  //   taxonomyDesc: "",

                                  taxonomyDesc: checkDataAvailable(
                                    data.NUCCTaxonomyCode
                                  )
                                    ? checktaxdec(data.NUCCTaxonomyCode)
                                    : "",
                                  boardCerti:
                                    !!checkDataAvailable(data.Specialty) &&
                                      !!checkDataAvailable(
                                        data.Specialty.BoardCertifiedFlag
                                      ) &&
                                      data.Specialty.BoardCertifiedFlag == "1"
                                      ? { label: "Yes", value: "Y" }
                                      : { label: "No", value: "N" },
                                  // boardCerti: {label: data.SpecialtyBoardName,value: data.SpecialtyBoardName},
                                  // taxonomyGrp: '',
                                  speciality: checkDataAvailable(
                                    data.Specialty
                                  )
                                    ? checkDataAvailable(
                                      data.Specialty.SpecialtyName
                                    )
                                    : null,
                                  specPrimary:
                                    !!checkDataAvailable(data.SpecialtyType) &&
                                      checkDataAvailable(
                                        data.SpecialtyType
                                          .SpecialtyTypeDescription
                                      ) == "Primary"
                                      ? { label: "Yes", value: "Y" }
                                      : { label: "No", value: "N" },
                                };
                                return getTransformed(dataObj);
                              }
                            );
                          } else {
                            //alert('ashish1'+ apiResponse.Specialty.SpecialtyType.SpecialtyTypeDescription);
                            // alert(apiResponse.Specialty.SpecialtyType.SpecialtyTypeDescription == 'Primary');
                            const dataObj = {
                              operation: "I",
                              rowNumber: specialityArray.length + 1,
                              taxonomyCode: checkDataAvailable(
                                apiResponse.Specialty.NUCCTaxonomyCode
                              ),
                              //  taxonomyDesc: "",
                              taxonomyDesc: checkDataAvailable(
                                apiResponse.Specialty.NUCCTaxonomyCode
                              )
                                ? checktaxdec(
                                  apiResponse.Specialty.NUCCTaxonomyCode
                                )
                                : "",
                              boardCerti:
                                !!checkDataAvailable(apiResponse.Specialty) &&
                                  !!checkDataAvailable(
                                    apiResponse.Specialty.BoardCertifiedFlag
                                  ) &&
                                  apiResponse.Specialty.BoardCertifiedFlag == "1"
                                  ? { label: "Yes", value: "Y" }
                                  : { label: "No", value: "N" },
                              taxonomyGrp: "",
                              speciality: checkDataAvailable(
                                apiResponse.Specialty.Specialty
                              )
                                ? checkDataAvailable(
                                  apiResponse.Specialty.Specialty
                                    .SpecialtyName
                                )
                                : null,
                              specPrimary:
                                !!checkDataAvailable(
                                  apiResponse.Specialty.SpecialtyType
                                ) &&
                                  checkDataAvailable(
                                    apiResponse.Specialty.SpecialtyType
                                      .SpecialtyTypeDescription
                                  ) == "Primary"
                                  ? { label: "Yes", value: "Y" }
                                  : { label: "No", value: "N" },
                            };
                            specialityArray.push(getTransformed(dataObj));
                          }
                        }
                        setspecialityTableRowsData(specialityArray);

                        let locationArray = [];
                        if (apiResponse.Practice) {
                          if (Array.isArray(apiResponse.Practice)) {
                            let row = 1;
                            apiResponse.Practice.map((data) => {
                              if (
                                data.hasOwnProperty("CurrentlyPracticingFlag")
                              ) {
                                if (data.CurrentlyPracticingFlag === 1) {
                                  const dataObj = {
                                    operation: "I",
                                    rowNumber: row++,
                                    locationName: checkDataAvailable(
                                      data.PracticeName
                                    ),
                                    address1: checkDataAvailable(data.Address),
                                    address2:
                                      checkDataAvailable(data.Address2) !== null
                                        ? checkDataAvailable(data.Address2)
                                        : "",
                                    city: checkDataAvailable(data.City),
                                    stateValue: checkDataAvailable(data.State),
                                    zipCode: checkDataAvailable(data.Zip),
                                    county:
                                      checkDataAvailable(data.County) === null
                                        ? getCountyFromMaster(
                                          data.State,
                                          data.Zip
                                        )
                                        : checkDataAvailable(data.County),
                                    //county: checkDataAvailable(data.County),
                                    officePhoneNumber: checkDataAvailable(
                                      data.PatientAppointmentPhoneNumber
                                    ),
                                    officeFaxNumber: checkDataAvailable(
                                      data.FaxNumber
                                    ),
                                    npi: checkDataAvailable(data.NPI),
                                    /*tddPhone1:(    (data.Accessibility.map(data1 =>
                                              ((data1.Accessibility.AccessibilityDescription=='TDD Service') && (data1.AccessibilityFlag=='1'))?  (tddPhone:'yes'):'No'
                                                )))*/
                                    // tddPhone:!!checkDataAvailable(data.Accessibility) ?
                                    // (Array.isArray(data.Accessibility) ?
                                    //     (data.Accessibility.map(data1 =>
                                    //         (!!checkDataAvailable(data1.Accessibility) && checkDataAvailable(data1.Accessibility.AccessibilityDescription)=='TDD Service'
                                    //         && checkDataAvailable(data1.AccessibilityFlag)=='1') ?  'Yes':'No'
                                    //         ).indexOf("Yes")> -1 ? {label:'Yes',value: 'Y'} : {label: 'No',value: 'N'})
                                    //     : ((!!checkDataAvailable(data.Accessibility.Accessibility) && checkDataAvailable(data.Accessibility.Accessibility.AccessibilityDescription)=='TDD Service'
                                    //     && checkDataAvailable(data.Accessibility.AccessibilityFlag)=='1') ? {label:'Yes',value: 'Y'} : {label: 'No',value: 'N'}))
                                    // : {label: 'No',value: 'N'},

                                    //Commented by NG on 1/19/2024
                                    // tddPhone: populateAccessibility(
                                    //   data,
                                    //   "TDD Service"
                                    // ),
                                    //Till Here
                                    publicTransportation: populateAccessibility(
                                      data,
                                      "Public Transportation"
                                    ),
                                    // publicTransportation:!!data.Accessibility?(   (data.Accessibility.map(data1 =>
                                    //     (((data1.Accessibility.AccessibilityDescription=='Public Transportation') && (data1.AccessibilityFlag=='1'))?   'Yes':'No'
                                    //     )))).indexOf("Yes")>-1?{label:'Yes',value: 'Y'}:{label: 'No',value: 'N'}:{label: 'No',value: 'N'},
                                    handicapAccess: populateAccessibility(
                                      data,
                                      "Handicapped Access"
                                    ),
                                    // handicapAccess:!!data.Accessibility?(   (data.Accessibility.map(data1 =>
                                    //     (((data1.Accessibility.AccessibilityDescription=='Handicapped Access') && (data1.AccessibilityFlag=='1'))?  'Yes':'No'
                                    //     )))).indexOf("Yes")>-1?{label:'Yes',value: 'Y'}:{label: 'No',value: 'N'}:{label: 'No',value: 'N'},
                                    tddHearing: populateAccessibility(
                                      data,
                                      "TDD Service"
                                    ),
                                    // tddHearing:!!data.Accessibility?(   (data.Accessibility.map(data1 =>
                                    //     (((data1.Accessibility.AccessibilityDescription=='TDD Service') && (data1.AccessibilityFlag=='1'))?  'Yes':'No'
                                    //     )))).indexOf("Yes")>-1?{label:'Yes',value: 'Y'}:{label: 'No',value: 'N'}:{label: 'No',value: 'N'}
                                  };
                                  locationArray.push(dataObj);
                                  //return getTransformed(dataObj);
                                }
                              }
                            });
                          } else {
                            if (
                              data.hasOwnProperty("CurrentlyPracticingFlag")
                            ) {
                              if (data.CurrentlyPracticingFlag === 1) {
                                const dataObj = {
                                  operation: "I",
                                  rowNumber: locationArray.length + 1,
                                  locationName: checkDataAvailable(
                                    apiResponse.Practice.PracticeName
                                  ),
                                  address1: checkDataAvailable(
                                    apiResponse.Practice.Address
                                  ),
                                  address2:
                                    checkDataAvailable(
                                      apiResponse.Practice.Address2
                                    ) !== null
                                      ? checkDataAvailable(
                                        apiResponse.Practice.Address2
                                      )
                                      : "",
                                  city: checkDataAvailable(
                                    apiResponse.Practice.City
                                  ),
                                  stateValue: checkDataAvailable(
                                    apiResponse.Practice.State
                                  ),
                                  zipCode: checkDataAvailable(
                                    apiResponse.Practice.Zip
                                  ),
                                  county:
                                    checkDataAvailable(data.County) === null
                                      ? getCountyFromMaster(
                                        data.State,
                                        data.Zip
                                      )
                                      : checkDataAvailable(data.County),
                                  officePhoneNumber: checkDataAvailable(
                                    apiResponse.Practice
                                      .PatientAppointmentPhoneNumber
                                  ),
                                  officeFaxNumber: checkDataAvailable(
                                    apiResponse.Practice.FaxNumber
                                  ),
                                  npi: checkDataAvailable(
                                    apiResponse.Practice.NPI
                                  ),

                                  //Comment by NG on 1/19/2024
                                  // tddPhone: populateAccessibility(
                                  //   apiResponse.Practice,
                                  //   "TDD Service"
                                  // ),

                                  //Till Here

                                  // tddPhone:!!apiResponse.Practice.Accessibility?(   (apiResponse.Practice.Accessibility.map(data1 =>
                                  //     (((data1.Accessibility.AccessibilityDescription=='TDD Service') && (data1.AccessibilityFlag=='1'))?  'Yes':'No'
                                  //     )))).indexOf("Yes")>-1?{label:'Yes',value: 'Y'}:{label: 'No',value: 'N'}:{label: 'No',value: 'N'},
                                  publicTransportation: populateAccessibility(
                                    apiResponse.Practice,
                                    "Public Transportation"
                                  ),
                                  // publicTransportation:!!apiResponse.Practice.Accessibility?(   (apiResponse.Practice.Accessibility.map(data1 =>
                                  //     (((data1.Accessibility.AccessibilityDescription=='Public Transportation') && (data1.AccessibilityFlag=='1'))? 'Yes':'No'
                                  //     )))).indexOf("Yes")>-1?{label:'Yes',value: 'Y'}:{label: 'No',value: 'N'}:{label: 'No',value: 'N'},
                                  handicapAccess: populateAccessibility(
                                    apiResponse.Practice,
                                    "Handicapped Access"
                                  ),
                                  // handicapAccess:!!apiResponse.Practice.Accessibility?(   (apiResponse.Practice.Accessibility.map(data1 =>
                                  //     (((data1.Accessibility.AccessibilityDescription=='Handicapped Access') && (data1.AccessibilityFlag=='1'))? 'Yes':'No'
                                  //     )))).indexOf("Yes")>-1?{label:'Yes',value: 'Y'}:{label: 'No',value: 'N'}:{label: 'No',value: 'N'},
                                  tddHearing: populateAccessibility(
                                    apiResponse.Practice,
                                    "TDD Service"
                                  ),
                                  // tddHearing:!!apiResponse.Practice.Accessibility?(   (apiResponse.Practice.Accessibility.map(data1 =>
                                  //     (((data1.Accessibility.AccessibilityDescription=='TDD Service') && (data1.AccessibilityFlag=='1'))?  'Yes':'No'
                                  //     )))).indexOf("Yes")>-1?{label:'Yes',value: 'Y'}:{label: 'No',value: 'N'}:{label: 'No',value: 'N'}
                                  /* locationName: apiResponse.Practice.PracticeName,
                                        languages: '',
                                        npi: apiResponse.ProviderAddress.ID,
                                        addressType: apiResponse.ProviderAddress.AddressType.AddressTypeDescription,
                                        address1: apiResponse.ProviderAddress.Address,
                                        address2: '',
                                        city: apiResponse.ProviderAddress.City,
                                        stateValue: apiResponse.ProviderAddress.State,
                                        zipCode: apiResponse.ProviderAddress.PostalCode,
                                        electronicHealthRecord:'',
                                        officePhoneNumber:'',
                                        officeFaxNumber:'',
                                        publicTransportation:'',
                                        handicapAccess:'',
                                        tddHearing:'',*/
                                  // tddPhone:''
                                };
                                locationArray.push(getTransformed(dataObj));
                                // const locationArray = [
                                //     {
                                //         locationName: '',
                                //         languages: '',
                                //         npi: apiResponse.ProviderAddress.ID,
                                //         addressType: apiResponse.ProviderAddress.AddressType.AddressTypeDescription,
                                //         address1: apiResponse.ProviderAddress.Address,
                                //         address2: '',
                                //         city: apiResponse.ProviderAddress.City,
                                //         stateValue: apiResponse.ProviderAddress.State,
                                //         zipCode: apiResponse.ProviderAddress.PostalCode,
                                //         electronicHealthRecord:'',
                                //         officePhoneNumber:'',
                                //         officeFaxNumber:'',
                                //         publicTransportation:'',
                                //         handicapAccess:'',
                                //         tddHearing:'',
                                //         tddPhone:''
                                //     }
                                // ]
                              }
                            }
                          }
                        }
                        setLocationTableRowsData(locationArray);

                        let paytoArray = [];
                        if (apiResponse.Practice) {
                          if (Array.isArray(apiResponse.Practice)) {
                            let row = 1;
                            paytoArray = apiResponse.Practice.map((data) => {
                              const dataObj = {
                                operation: "I",
                                rowNumber: row++,
                                taxId:
                                  !!checkDataAvailable(data.Tax) &&
                                    !!checkDataAvailable(data.Tax.GroupNumber)
                                    ? data.Tax.TaxID
                                    : null,
                                locationName: checkDataAvailable(
                                  data.W9PracticeName
                                ),
                                address1: checkDataAvailable(data.Address),
                                address2: checkDataAvailable(data.Address2),
                                city: checkDataAvailable(data.City),
                                county:
                                  checkDataAvailable(data.County) === null
                                    ? getCountyFromMaster(data.State, data.Zip)
                                    : checkDataAvailable(data.County),
                                stateValue: checkDataAvailable(data.State),
                                zipCode: checkDataAvailable(data.Zip),
                                payToNpi:
                                  !!checkDataAvailable(data.Tax) &&
                                    !!checkDataAvailable(data.Tax.GroupNumber)
                                    ? data.Tax.GroupNumber
                                    : null,
                              };
                              return getTransformed(dataObj);
                            });
                          } else {
                            const dataObj = {
                              operation: "I",
                              rowNumber: paytoArray.length + 1,
                              taxId:
                                !!checkDataAvailable(
                                  apiResponse.Practice.Tax
                                ) &&
                                  !!checkDataAvailable(
                                    apiResponse.Practice.Tax.TaxID
                                  )
                                  ? apiResponse.Practice.Tax.TaxID
                                  : null,
                              locationName: checkDataAvailable(
                                apiResponse.Practice.W9PracticeName
                              ),
                              address1: checkDataAvailable(
                                apiResponse.Practice.Address
                              ),
                              address2: checkDataAvailable(
                                apiResponse.Practice.Address2
                              ),
                              city: checkDataAvailable(
                                apiResponse.Practice.City
                              ),
                              county:
                                checkDataAvailable(data.County) === null
                                  ? getCountyFromMaster(data.State, data.Zip)
                                  : checkDataAvailable(data.County),
                              stateValue: checkDataAvailable(
                                apiResponse.Practice.State
                              ),
                              zipCode: checkDataAvailable(
                                apiResponse.Practice.Zip
                              ),
                              payToNpi:
                                !!checkDataAvailable(
                                  apiResponse.Practice.Tax
                                ) &&
                                  !!checkDataAvailable(
                                    apiResponse.Practice.Tax.GroupNumber
                                  )
                                  ? apiResponse.Practice.Tax.GroupNumber
                                  : null,
                            };
                            paytoArray.push(getTransformed(dataObj));
                          }
                        }
                        setPayToTableRowsData(paytoArray);

                        let educationDetails = [];
                        if (apiResponse.Education) {
                          if (Array.isArray(apiResponse.Education)) {
                            let row = 1;
                            educationDetails = apiResponse.Education.map(
                              (data) => {
                                const dataObj = {
                                  operation: "I",
                                  rowNumber: row++,
                                  //gradeute type and degree label interchanged thats why it mapped it here in this way
                                  professionalSchool: checkDataAvailable(
                                    data.InstitutionName
                                  ),
                                  graduateType: checkDataAvailable(
                                    data.Degree
                                  )
                                    ? checkDataAvailable(
                                      data.Degree.DegreeAbbreviation
                                    )
                                    : null,
                                  degree: checkDataAvailable(
                                    data.EducationTypeName
                                  ),
                                  graduationDate: checkDataAvailable(
                                    data.EndDate
                                  )
                                    ? new Date(data.EndDate)
                                    : null,
                                };
                                return getTransformed(dataObj);
                              }
                            );
                          } else {
                            const dataObj = {
                              operation: "I",
                              rowNumber: educationDetails.length + 1,
                              professionalSchool: checkDataAvailable(
                                apiResponse.Education.InstitutionName
                              ),
                              graduateType: checkDataAvailable(
                                apiResponse.Education.Degree
                              )
                                ? checkDataAvailable(
                                  apiResponse.Education.Degree
                                    .DegreeAbbreviation
                                )
                                : null,
                              degree: checkDataAvailable(
                                apiResponse.Education.EducationTypeName
                              ),
                              graduationDate: checkDataAvailable(
                                apiResponse.Education.EndDate
                              )
                                ? new Date(apiResponse.Education.EndDate)
                                : null,
                            };
                            educationDetails.push(getTransformed(dataObj));
                          }
                        }
                        setEducationTableRowsData(educationDetails);

                        let workTableDataArray = [];
                        if (apiResponse.WorkHistory) {
                          if (Array.isArray(apiResponse.WorkHistory)) {
                            workTableDataArray = apiResponse.WorkHistory.map(
                              (data) => {
                                let row = 1;
                                const dataObj = {
                                  operation: "I",
                                  rowNumber: row++,
                                  empName: checkDataAvailable(
                                    data.EmployerName
                                  ),
                                  startDate: checkDataAvailable(
                                    data.StartDate
                                  )
                                    ? new Date(data.StartDate)
                                    : null,
                                  endDate: checkDataAvailable(data.EndDate)
                                    ? new Date(data.EndDate)
                                    : "",
                                  currentEmp:
                                    checkDataAvailable(
                                      data.CurrentEmployerFlag
                                    ) == "1"
                                      ? { label: "Yes", value: "Y" }
                                      : { label: "No", value: "N" },
                                  depReason: checkDataAvailable(
                                    data.ExitExplanation
                                  ),
                                };
                                return getTransformed(dataObj);
                              }
                            );
                          } else {
                            const dataObj = {
                              operation: "I",
                              rowNumber: workTableDataArray.length + 1,
                              empName: checkDataAvailable(
                                apiResponse.WorkHistory.EmployerName
                              ),
                              startDate: checkDataAvailable(
                                apiResponse.WorkHistory.StartDate
                              )
                                ? new Date(apiResponse.WorkHistory.StartDate)
                                : null,
                              endDate: checkDataAvailable(
                                apiResponse.WorkHistory.EndDate
                              )
                                ? new Date(!!apiResponse.WorkHistory.EndDate)
                                : null,
                              currentEmp:
                                checkDataAvailable(
                                  apiResponse.WorkHistory.CurrentEmployerFlag
                                ) == "1"
                                  ? { label: "Yes", value: "Y" }
                                  : { label: "No", value: "N" },
                              depReason: checkDataAvailable(
                                apiResponse.WorkHistory.ExitExplanation
                              ),
                            };
                            workTableDataArray.push(getTransformed(dataObj));
                          }
                        }
                        setWorkTableRowsData(workTableDataArray);

                        let insuranceTableDataArray = [];
                        if (apiResponse.Insurance) {
                          if (Array.isArray(apiResponse.Insurance)) {
                            let row = 1;
                            insuranceTableDataArray = apiResponse.Insurance.map(
                              (data) => {
                                const dataObj = {
                                  operation: "I",
                                  rowNumber: row++,
                                  policyNo: checkDataAvailable(
                                    data.PolicyNumber
                                  ),
                                  insuredName: checkDataAvailable(
                                    data.InsuranceCarrierName
                                  ),
                                  covAmount: checkDataAvailable(
                                    data.CoverageAmountOccurrence
                                  ),
                                  covAmountAgg: checkDataAvailable(
                                    data.CoverageAmountAggregate
                                  ),
                                  effectiveDate: checkDataAvailable(
                                    data.StartDate
                                  )
                                    ? new Date(data.StartDate)
                                    : null,
                                  expirationDate: checkDataAvailable(
                                    data.EndDate
                                  )
                                    ? new Date(data.EndDate)
                                    : null,
                                };
                                return getTransformed(dataObj);
                              }
                            );
                          } else {
                            const dataObj = {
                              operation: "I",
                              rowNumber: insuranceTableDataArray.length + 1,
                              policyNo: checkDataAvailable(
                                apiResponse.Insurance.PolicyNumber
                              ),
                              insuredName: checkDataAvailable(
                                apiResponse.Insurance.InsuranceCarrierName
                              ),
                              covAmount: checkDataAvailable(
                                apiResponse.Insurance.CoverageAmountOccurrence
                              ),
                              covAmountAgg: checkDataAvailable(
                                apiResponse.Insurance.CoverageAmountAggregate
                              ),
                              effectiveDate: checkDataAvailable(
                                apiResponse.Insurance.StartDate
                              )
                                ? new Date(apiResponse.Insurance.StartDate)
                                : null,
                              expirationDate: checkDataAvailable(
                                apiResponse.Insurance.EndDate
                              )
                                ? new Date(apiResponse.Insurance.EndDate)
                                : null,
                            };
                            insuranceTableDataArray.push(
                              getTransformed(dataObj)
                            );
                          }
                        }
                        setInsuranceTableRowsData(insuranceTableDataArray);
                        //alert('new');
                        setTimeout(() => {
                          setLoadForm(true);
                          setLoading(false);
                        }, 50);
                      } else {
                        setLoading(false);
                        setLoadForm(false);
                        setTimeout(() => {
                          setLoadForm(true);
                        }, 50);
                        setCaqhGenericModal({
                          header: "Data Not Retrieved" + caqhRes.data,
                          body: "Response Code : " + caqhRes.status,
                          state: true,
                        });
                      }
                    })
                    .catch((err) => {
                      // setCaqhGenericModal({header: 'Error!', body: 'Error in fetching data from server.Please try again.', state:true})
                      setLoading(false);
                      setLoadForm(false);
                      setTimeout(() => {
                        setLoadForm(true);
                      }, 50);
                      setCaqhGenericModal({
                        header: "Error In Retrieving Data" + err.response.data,
                        body: "Response Code : " + err.response.status,
                        state: true,
                      });
                    });
                } else {
                  setLoading(false);
                  setLoadForm(false);
                  setTimeout(() => {
                    setLoadForm(true);
                  }, 50);
                  if (res.data.providerFoundFlag == "N") {
                    setCaqhGenericModal({
                      header: "Provider Roster Status",
                      body: "Provider does not exist in CAQH",
                      state: true,
                    });
                  } else if (res.data.roosterStatus == "INACTIVE") {
                    setCaqhGenericModal({
                      header: "Inactive",
                      body: "Provider is inactive in CAQH.",
                      state: true,
                    });
                  } else if (res.data.roosterStatus == "NOT ON ROSTER") {
                    //setCaqhGenericModal({header: 'Provider not found', body: res.data.roosterStatus, state: true})
                    setCaqhModal({
                      id: caqhId,
                      header: "Add To Roster",
                      body: "Provider is not on roster, do you want to add on roster?",
                      show: true,
                    });
                  } else if (res.data.authorizationFlag == "N") {
                    setCaqhGenericModal({
                      header: "Authorization",
                      body: "Provider has not authorized organization to pull the data",
                      state: true,
                    });
                  } else if (
                    res.data.providerStatus != "Re-Attestation" &&
                    res.data.providerStatus != "Initial Profile Complete"
                  ) {
                    setCaqhGenericModal({
                      header: "Provider Status",
                      body:
                        "Provider Status : " +
                        res.data.providerStatus +
                        " data cannot be pulled",
                      state: true,
                    });
                  } else {
                    setCaqhGenericModal({
                      header: "Provider Validation Failed",
                      body:
                        "Please contact administrater for CAQH ID -" + caqhId,
                      state: true,
                    });
                  }

                  //setCaqhModal({id: caqhId, show: true});
                }
              } else {
                setLoading(false);
                setLoadForm(false);
                setTimeout(() => {
                  setLoadForm(true);
                }, 50);
                setCaqhGenericModal({
                  header: "No Data Found",
                  body: "No Data Found for Provider",
                  state: true,
                });
              }
            } else {
              if (!!res && res.hasOwnProperty("status")) {
                setCaqhGenericModal({
                  header: "Data Not Fetched" + res.data,
                  body: "Response Code : " + res.status,
                  state: true,
                });
              } else {
                setCaqhGenericModal({
                  header: "Error",
                  body: res,
                  state: true,
                });
              }
              setLoading(false);
              setLoadForm(false);
              setTimeout(() => {
                setLoadForm(true);
              }, 50);
            }
          })
          .catch((err) => {
            // if(err.response.status === 400){
            setCaqhGenericModal({
              header: "Error In Fetching Data" + err.response.data,
              body: "Response Code : " + err.response.status,
              state: true,
            });
            setLoadForm(false);
            setTimeout(() => {
              setLoadForm(true);
            }, 50);
            //setLoadForm(true);
            setLoading(false);
            // }
            // }else if(err.response.status === 401){
            //     alert("User Session has expired.")
            //     setLoadForm(true);
            //     setLoading(false);
            //     navigateHome();
            // }
            console.log("Inside add provider get data catch: ", err);
            console.log(err.message);
            //alert("Error in saving data");
          });
      } else {
        if (userType == "P") {
          setCaqhGenericModal({
            header: "Field Required!",
            body: "Please enter CAQH ID and last 4 digits of SSN to retrieve data.",
            state: true,
          });
        } else {
          setCaqhGenericModal({
            header: "Field Required!",
            body: "Please enter CAQH ID to retrieve data.",
            state: true,
          });
        }
        setLoading(false);
        setLoadForm(false);
        setTimeout(() => {
          setLoadForm(true);
        }, 50);
      }
    } catch (err) {
      alert(err);
      setLoading(false);
      setLoadForm(false);
      setTimeout(() => {
        setLoadForm(true);
      }, 50);
    }
  };
  console.log("lockStatussssssss prop.state.stageName: ", prop.state.stageName);
  /*if(prop.state.StageName!==undefined && (
    prop.state.stageName === "Exit" ||
    prop.state.stageName === "Discard"))
      {
        prop.state.lockStatus==='V'};*/

  const getGridData = (jsonObj) => {
    let gridObj = {};
    //console.log("GetGridData: ",jsonObj);
    Object.keys(jsonObj).map((key) => {
      gridObj[key] = { value: jsonObj[key], label: jsonObj[key] };
    });
    return gridObj;
  };

  const populateFormBasisOnType = () => {
    //console.log("Inside populateFormBasisOnType tabref= ", tabRef);
    if (tabRef.current === "DashboardView") {
      return (
        <>
          <Tabs
            defaultActiveKey="AddProvider"
            id="justify-tab-example"
            className="mb-3"
            justify
            onSelect={(key) => handleTabSelect(key)}
          >
            <Tab eventKey="AddProvider" title="Add a Provider">
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
                    transactionType={AddProvider.displayName}
                    //stageName={prop.state.StageName}
                    /*selectJson={selectValues}*/
                    //type={'Editable'}
                    //lockStatus={(prop.state!==null && prop.state.lockStatus!==undefined)?prop.state.lockStatus:'N'}
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
  const RenderDatePicker = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Date of Birth" />
      <label htmlFor="datePicker">Date Of Birth</label>
    </div>
  );
  const RenderDatePicker02 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="ECFMG Issue Date" />
      <label htmlFor="datePicker">ECFMG Issue Date</label>
    </div>
  );
  const RenderDatePicker03 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="ECFMG Expiration Date" />
      <label htmlFor="datePicker">ECFMG Expiration Date</label>
    </div>
  );

  const RenderDatePicker04 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Attestation Date" />
      <label htmlFor="datePicker">Attestation Date</label>
    </div>
  );

  //Added by Nidhi on 3/27/2023
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
  // const handleLinearSelectChange = (selectValue, evnt) => {
  //     console.log("Select value: ",selectValue);
  //     const { name } = evnt;
  //         setApiTestState({...apiTestState,[name] : selectValue});
  // }

  const checkHandler = (event, index, data) => {
    data.response = event.target.checked;
    quesAnsListJson[index] = data;
    setQuesAnsListJson([...quesAnsListJson]);
    //Console.log("Inside checkHandler quesAnsListJson: ",quesAnsListJson);
  };

  // const fieldsOnBlur = (e) => {
  //   //alert('Inside organization Name handle Blur: ',e);

  //   if (prop.state.formView === "DashboardHomeView") {
  //     if (e.target.name === "organizationName") {
  //       const orgValue = e.target.value;
  //       printConsole("Inside add provider fields on blur: ", orgValue);
  //       let arr1 = [];
  //       let arr2 = [];
  //       const apiOut = getLinkingData(
  //         token,
  //         "HealthPlan",
  //         masterUserName,
  //         orgValue.trim()
  //       );
  //       printConsole(
  //         "Inside getDashboardData provContLinkData Data before promise resolve: ",
  //         apiOut
  //       );
  //       apiOut.then(function (provContLinkData) {
  //         printConsole(
  //           "Inside getDashboardData provContLinkData Data after promise resolve: ",
  //           provContLinkData
  //         );

  //         if (provContLinkData.length > 0) {
  //           const contractIdData = provContLinkData[0];
  //           printConsole(
  //             "Inside getDashboardData contractIdData Data: ",
  //             contractIdData
  //           );
  //           if (
  //             contractIdData !== undefined &&
  //             orgValue !== "" &&
  //             orgValue !== undefined
  //           ) {
  //             if (contractIdData.hasOwnProperty("MainTable")) {
  //               arr1 = contractIdData["MainTable"];
  //               arr1 = arr1.filter((elem) => {
  //                 if (
  //                   elem.OrganizationName !== null &&
  //                   elem.OrganizationName !== undefined
  //                 ) {
  //                   if (
  //                     elem.OrganizationName.localeCompare(orgValue, undefined, {
  //                       sensitivity: "accent",
  //                     }) === 0
  //                   ) {
  //                     return elem.OrganizationName;
  //                   }
  //                 }
  //                 //Added by Nidhi Gupta on 9/12/23 for populating ContractID after creating case from Provider Contracting

  //                 if (
  //                   elem.LegalEntityName !== null &&
  //                     elem.LegalEntityName !== undefined
  //                     ) {

  //                   if (
  //                     elem.LegalEntityName.localeCompare(orgValue, undefined, {
  //                       sensitivity: "accent",
  //                     }) === 0
  //                   ) {
  //                     return elem.LegalEntityName;
  //                   }
  //                 }
  //               });
  //               //arr1 = arr1.filter(elem => (elem.OrganizationName === orgValue));
  //               printConsole("Inside fieldsOnBlur useeffect arr1: ", arr1);
  //             }

  //             if (contractIdData.hasOwnProperty("ProvDetails")) {
  //               arr2 = contractIdData["ProvDetails"];
  //               printConsole("Inside fieldsOnBlur useeffect arr2: ", arr2);

  //               arr2 = arr2.filter((elem) => {
  //                 if (elem.name !== null && elem.name !== undefined) {
  //                   if (
  //                     elem.name.localeCompare(orgValue, undefined, {
  //                       sensitivity: "accent",
  //                     }) === 0
  //                   ) {
  //                     return elem.name;
  //                   }
  //                 }
  //               });

  //               printConsole(
  //                 "Inside fieldsOnBlur useeffect arr2 after: ",
  //                 arr2
  //               );

  //               //arr2 = arr2.filter(elem => elem.name === orgValue)

  //               printConsole("Inside fieldsOnBlur  arr2: ", arr2);
  //             }
  //           }
  //         }

  //          //printConsole("Nidhi arr1: ", arr1);
  //         //printConsole("Nidhi arr1: ", arr2);
  //         const contractArray = setContractIdDropDown(arr1, arr2);
  //         let selectJson = { ...selectValues };
  //         let apiTestStateReplica = { ...apiTestState };
  //         if (contractArray.length > 0) {
  //           selectJson.contractIdOptions = contractArray;

  //           if (contractArray.length === 1) {
  //             apiTestStateReplica.contractId = contractArray[0];
  //             setApiTestState(apiTestStateReplica);
  //           }
  //         } else {
  //           if (selectJson.hasOwnProperty("contractIdOptions")) {
  //             delete selectJson["contractIdOptions"];
  //           }
  //           if (apiTestStateReplica.hasOwnProperty("contractId")) {
  //             delete apiTestStateReplica["contractId"];
  //           }
  //         }

  //         setSelectValues(selectJson);
  //         setApiTestState(apiTestStateReplica);
  //       });
  //       /*const orgVal = e.target.value.trim();
  //           if(orgVal !== '' && orgVal !== undefined){
  //               let getApiJson= {};
  //               getApiJson['tableNames'] = getTableDetails()['provContLinkTable'];
  //               getApiJson['whereClause'] = {'Legal_Entity_Name':'=~'+orgVal};
  //               customAxios.post('/generic/get',getApiJson,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
  //             printConsole('Get data Response for getProvContLinkData: ',res)
  //             if(res.data.Status === 0){
  //                 let selectJson = {...selectValues};
  //                 let apiTestStateReplica = {...apiTestState};
  //                 const respData = [...res.data.data.provContLinkData];

  //                 //printConsole('Inside fields on blur contract respData[0]: ',respData[0]);
  //                 const contractArray = setContractIdDropDown(respData);

  //                   if(contractArray.length>0){

  //                       selectJson.contractIdOptions = contractArray;

  //                       if(contractArray.length === 1){
  //                           apiTestStateReplica.contractId = contractArray[0];
  //                           setApiTestState(apiTestStateReplica);
  //                       }

  //                   }
  //                   else{
  //                       if(selectJson.hasOwnProperty('contractIdOptions')){
  //                           delete selectJson['contractIdOptions'];
  //                       }
  //                       if(apiTestStateReplica.hasOwnProperty('contractId')){
  //                           delete apiTestStateReplica['contractId'];
  //                       }
  //                   }

  //                   setSelectValues(selectJson);
  //                   setApiTestState(apiTestStateReplica);

  //               }
  //               }).catch((err) => {
  //                   printConsole('',err.message);
  //               });
  //           }*/
  //     }
  //   }
  // };

  let checkStageName = JSON.parse(process.env.REACT_APP_STAGENAME);

  const fieldsOnBlur = (e, values, setFieldValue) => {
    //e.preventDefault();
    //alert('Inside organization Name handle Blur: ',e);
    printConsole("Inside add provider fields on blur: ");
    if (
      prop.state.formView === "DashboardHomeView" ||
      prop.state.formView === "DashboardView"
    ) {
      if (e.target.name === "organizationName") {
        const orgValue = e.target.value;
        printConsole("Inside add provider fields on blur: ", orgValue);
        //apiTestState[e.target.name] = orgValue;

        // if (apiTestState.hasOwnProperty("contractId")) {
        //   delete apiTestState["organizationName"];
        // }
        // let formState = Object.assign(apiTestState,values);
        //let formState = {...apiTestState};

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
        // if(values !== undefined){
        //   formState = {...values};
        // }
        //printConsole("Inside fieldsOnBlur formState: ",formState);
        populateContractIdDropdown(
          e.target.name,
          e.target.value,
          formState,
          selectValues,
          setFieldValue
        );
        // setApiTestState(returnState);
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
    // alert('Inside populateContractIdDropdown inputSTate : ');
    console.log(
      "Inside populateContractIdDropdown inputSTate : ",
      prop.state.stageName
    );
    if (
      prop.state.formView === "DashboardHomeView" ||
      !checkStageName.includes(prop.state.stageName)
    ) {
      let apiTestStateReplica = {};
      if (name === "organizationName") {
        const orgValue = value;
        printConsole("Inside add provider fields on blur: ", orgValue);
        let arr1 = [];
        let arr2 = [];
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

          if (provContLinkData.length > 0) {
            const contractIdData = provContLinkData[0];
            printConsole(
              "Inside getDashboardData contractIdData Data: ",
              contractIdData
            );
            if (
              contractIdData !== undefined &&
              orgValue !== "" &&
              orgValue !== undefined
            ) {
              if (contractIdData.hasOwnProperty("MainTable")) {
                arr1 = contractIdData["MainTable"];
                arr1 = arr1.filter((elem) => {
                  if (
                    elem.OrganizationName !== null &&
                    elem.OrganizationName !== undefined
                  ) {
                    if (
                      elem.OrganizationName.localeCompare(orgValue, undefined, {
                        sensitivity: "accent",
                      }) === 0
                    ) {
                      return elem.OrganizationName;
                    }
                  }
                  //Added by Nidhi Gupta on 9/12/23 for populating ContractID after creating case from Provider Contracting

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
                //arr1 = arr1.filter(elem => (elem.OrganizationName === orgValue));
                printConsole("Inside fieldsOnBlur useeffect arr1: ", arr1);
              }

              if (contractIdData.hasOwnProperty("ProvDetails")) {
                arr2 = contractIdData["ProvDetails"];
                printConsole("Inside fieldsOnBlur useeffect arr2: ", arr2);

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

                printConsole(
                  "Inside fieldsOnBlur useeffect arr2 after: ",
                  arr2
                );

                //arr2 = arr2.filter(elem => elem.name === orgValue)

                printConsole("Inside fieldsOnBlur  arr2: ", arr2);
              }
            }
          }

          //printConsole("Nidhi arr1: ", arr1);
          //printConsole("Nidhi arr1: ", arr2);
          const contractArray = setContractIdDropDown(arr1, arr2);
          //let selectJson = { ...selectValues };

          apiTestStateReplica = { ...inputState };
          //apiTestStateReplica = { ...apiTestState};
          //const apiDemo = {...inputState};
          console.log("Contrct Array", contractArray);
          if (contractArray.length > 0) {
            console.log("insidecontract Array.length1", selectValues);

            selectJson.contractIdOptions = contractArray;

            // if (apiTestStateReplica.hasOwnProperty("contractId")) {
            //   apiTestStateReplica["contractId"] = '';
            // }

            if (contractArray.length === 1) {
              console.log("insidecontract Array.length2", contractArray[0]);
              apiTestStateReplica.contractId = contractArray[0];
              //setApiTestState(apiTestStateReplica);
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
              //delete apiTestStateReplica["contractId"];
              apiTestStateReplica["contractId"] = { label: "", value: "" };
            }
          }
          console.log("APITest", apiTestStateReplica, selectValues, selectJson);

          apiTestStateReplica[name] = value;
          setSelectValues(selectJson);
          setApiTestState(apiTestStateReplica);
          if (setFieldValue !== undefined) {
            //console.log("Inside fieldsOnBlur name=== ",name+" value==== ",value)
            const contVal = value;
            setFieldValue("contractId", apiTestStateReplica.contractId);
          }
          // setFormikInitializeState(true);
          //  setTimeout(() => {
          //   setSelectValues(selectJson);
          //       }, 1000);
        });
      }
    }
  };

  const questionData = () => {
    console.log("questionData() quesAnsListJson", quesAnsListJson);
    if (quesAnsListJson.length > 0) {
      return quesAnsListJson.map((data, index) => {
        console.log("questionData() quesAnsListJson data: ", data);
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
                                    onChange={(event) => checkHandler(event, index, data)}
                                /> */}
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

                  // value={}
                  // name = "quesans"
                  //id={data.questionId}
                  />
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

  //Call this function on submit button click when form is opened from dashboard

  const formikFieldsOnChange = (evnt, setFieldValue, field) => {
    let value = evnt.target.value || "";
    //value = value.toUpperCase().trim();
    value = value.toUpperCase();
    printConsole("Inside organization Name onChange: ", value);
    setFieldValue(field.name, value);
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
            // initialValues={(tabRef.current === "DashboardView")?apiTestState:{organizationName:''}}
            enableReinitialize={formikInitializeState}
            initialValues={apiTestState}
            // onSubmit={(values) => {
            //     alert(JSON.stringify(values, null, 2));
            //     setTimeout(() => {
            //       //alert(JSON.stringify(values, null, 2));
            //       saveData(values);
            //     }, 400);
            // }}
            onSubmit={async (values) => {
              await new Promise((resolve) => setTimeout(resolve, 500)).catch(
                (err) => {
                  console.error(err);
                }
              );
              //alert(JSON.stringify(values, null, 2));
              saveData(values);
            }}
            validationSchema={validationSchema(prop)}
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
                            <div className="col-xs-12">
                              <label
                                id="instructionHeading"
                                className="instructionHeading"
                              >
                                Please provide the following information below
                                and to review all information to confirm the
                                accuracy to proceed with network acceptance and
                                contracting.
                              </label>
                              <label
                                id="instructionPointOne"
                                style={{
                                  fontSize: "12px",
                                  fontFamily: "'Open Sans', sans-serif",
                                }}
                              >
                                For Providers want to use CAQH retrieval, please
                                provide your CAQH ID and last 4 digits of SSN
                                then, click the “CAQH Data Retrieval” button.
                              </label>
                              {/* <label id="instructionPointTwo" style={{fontSize:"12px",fontFamily:"'Open Sans', sans-serif"}}>2) For Providers want to pull their information from NPPES, please provide your NPI and click the “NPPES Data Retrieval” button.</label> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item" id="providerInformation">
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
                          Provider Information
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseProvider"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-Provider"
                      >
                        <div className="accordion-body">
                          {tabRef.current === "DashboardView" ? (
                            <div></div>
                          ) : (
                            <div className="row">
                              <div className="col-xs-6 col-md-4">
                                <button
                                  type="button"
                                  className="btn btn-outline-primary btnStyle"
                                  onClick={(event) =>
                                    getData(
                                      event,
                                      values.caqhId.trim(),
                                      values.ssn,
                                      values.organizationName !== undefined
                                        ? values.organizationName.trim()
                                        : "",
                                      apiTestState.contractId
                                    )
                                  }
                                >
                                  CAQH Data Retrieval
                                </button>
                              </div>
                              {/* <div className="col-xs-6 col-md-4">
                                            <button type="button" className="btn btn-outline-primary btnStyle">NPPES Data Retrieval</button>
                                            </div> */}
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
                              <Field name="organizationName">
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
                                      id="providerLegalEntityName"
                                      className={`form-control ${meta.touched && meta.error
                                        ? " is-invalid"
                                        : field.value
                                          ? "is-valid"
                                          : ""
                                        }`}
                                      placeholder="John"
                                      {...field}
                                      value={convertToCase(field.value)}
                                      onBlur={(event) => {
                                        fieldsOnBlur(
                                          event,
                                          values,
                                          setFieldValue
                                        );
                                      }}
                                    // onChange={(e) =>
                                    //   formikFieldsOnChange(
                                    //     e,
                                    //     setFieldValue,
                                    //     field
                                    //   )
                                    // }
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
                                name="organizationName"
                                className="invalid-feedback"
                              />
                            </div>

                            <div className="col-xs-6 col-md-4">
                              <Field name="firstName">
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
                                    <input
                                      id="firstName"
                                      maxLength="100"
                                      type="text"
                                      className={`form-control ${meta.touched && meta.error
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
                                      First Name
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
                                name="firstName"
                                className="invalid-feedback"
                              />
                            </div>

                            <div className="col-xs-6 col-md-4">
                              <Field name="middleName">
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
                                    <input
                                      maxLength="100"
                                      type="text"
                                      className={`form-control ${meta.touched && meta.error
                                        ? " is-invalid"
                                        : field.value || field.value === null
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
                                      Middle Name
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
                                name="middleName"
                                className="invalid-feedback"
                              />
                            </div>
                          </div>
                          <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                              <Field name="lastName">
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
                                    <input
                                      maxLength="100"
                                      type="text"
                                      className={`form-control ${meta.touched && meta.error
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
                                      Last Name
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
                                name="lastName"
                                className="invalid-feedback"
                              />
                            </div>

                            <div className="col-xs-6 col-md-4">
                              <Field name="suffix">
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
                                    <input
                                      maxLength="10"
                                      type="text"
                                      className={`form-control ${meta.touched && meta.error
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
                                      Suffix
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
                                name="suffix"
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
                                    {/* <label htmlFor="floatingSelect">Gender</label> */}
                                    {/* <label htmlFor="state">Gender</label> */}
                                    <Select
                                      // classNames={{
                                      //     control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectOne&&!selectData.selectOne.value)?"is-invalid":""}`
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
                                      isClearable
                                      name={field.name}
                                      isDisabled={
                                        tabRef.current === "DashboardView" &&
                                          prop.state.lockStatus !== undefined &&
                                          prop.state.lockStatus === "Y"
                                          ? true
                                          : false
                                      }
                                      className="basic-multi-select"
                                      options={[
                                        { label: "MALE", value: "MALE" },
                                        { label: "FEMALE", value: "FEMALE" },
                                      ]}
                                      id="genderDropdown"
                                      isMulti={false}
                                      onChange={(selectValue, event) =>
                                        handleLinearSelectChange(
                                          selectValue,
                                          event,
                                          setFieldValue
                                        )
                                      }
                                      /*onChange={(selectValue, event) => {
                                        console.log(
                                          "Gender selected value: ",
                                          selectValue
                                        );
                                        if (event.action === "clear") {
                                          selectValue = {
                                            label: "",
                                            value: "",
                                          };
                                        }
                                        setFieldValue(field.name, selectValue);
                                      }}*/
                                      //value={apiTestState.gender}

                                      value={
                                        field.value.value !== undefined
                                          ? field.value.value?.toLowerCase() ===
                                            "male" ||
                                            field.value.value?.toLowerCase() ===
                                            "m"
                                            ? {
                                              label: convertToCase("MALE"),
                                              value: convertToCase(
                                                field.value.value
                                              ),
                                            }
                                            : field.value.value?.toLowerCase() ===
                                              "female" ||
                                              field.value.value?.toLowerCase() ===
                                              "f"
                                              ? {
                                                label: convertToCase("FEMALE"),
                                                value: convertToCase(
                                                  field.value.value
                                                ),
                                              }
                                              : field.value
                                          : field.value
                                      }
                                      placeholder="Gender"
                                      //styles={{...customStyles}}
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
                                name="gender"
                                className="invalid-feedback"
                              />
                            </div>
                            {/* <Multiselect
                                                name="gender"
                                                isObject={false}
                                                //onKeyPressFn={function noRefCheck(){}}
                                                //onRemove={function noRefCheck(){}}
                                                //onSearch={function noRefCheck(){}}
                                                //onSelect={function noRefCheck(){}}
                                                options={['Male','Female']}
                                                id="genderDropdown"
                                                showArrow={true}
                                                singleSelect={true}
                                                ref={genderRef}
                                                selectedValues = {apiTestState.genderDefault}
                                                placeholder=""
                                            /> */}

                            {/* <Select
                                                value={apiTestState.gender}
                                                onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                                                options={[{label:'Male', value:'Male'}, {label:'Female', value:'Female'}]}
                                                name = "gender"
                                                id = "genderDropdown"
                                            /> */}

                            {/* <div className="form-floating">
                                                <select class="form-select" id="floatingSelect" aria-label="Floating label select example" name="gender" onChange={event => handleApiTestChange(event)} value={apiTestState.gender}>
												<option selected>Select</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>

                                                </select>
                                                <label htmlFor="floatingSelect">Gender</label>
                                            </div> */}

                            {/* <div className="col-xs-6 col-md-4">

                                             <div className="form-floating">

                                            <Multiselect

                                            id="floatingSelect"
                                            name="salutation"
                                            onChange={event => handleApiTestChange(event)}

                                                //onKeyPressFn={function noRefCheck(){}}
                                                //onRemove={function noRefCheck(){}}
                                                //onSearch={function noRefCheck(){}}
                                                //onSelect={function noRefCheck(){}}
                                                isObject={false}
                                                options={selectValues.salutationArray}
                                                singleSelect={true}
                                                ref={salutationRef}
                                                selectedValues = {apiTestState.salutationDefault}
                                                placeholder=""
                                            />

                                            <label for="floatingSelect">Salutation</label>
                                          </div>
                                         </div> */}
                          </div>

                          <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                              <Field name="caqhId" innerRef={caqhId}>
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
                                    <input
                                      maxLength="10"
                                      type="text"
                                      className={`form-control ${meta.touched && meta.error
                                        ? " is-invalid"
                                        : field.value
                                          ? "is-valid"
                                          : ""
                                        }`}
                                      placeholder="John"
                                      {...field}
                                    //oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                    />
                                    <label htmlFor="floatingInputGrid">
                                      CAQH ID
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
                                name="caqhId"
                                className="invalid-feedback"
                              />
                            </div>

                            <div className="col-xs-6 col-md-4">
                              <Field name="caqhNpiId" validate={checkLuhn}>
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
                                    <input
                                      maxLength="10"
                                      type="text"
                                      className={`form-control ${meta.touched && meta.error
                                        ? " is-invalid"
                                        : field.value
                                          ? "is-valid"
                                          : ""
                                        }`}
                                      placeholder="John"
                                      //oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                      {...field}

                                    //Added newly by Nidhi Gupta on 11/1/2023
                                    // onBlur={(event) => {
                                    //   npiOnBlur(event, values);
                                    // }}
                                    //Till Here
                                    // onBlur={e => {field.onBlur(e)

                                    //     console.log("evnt.target.value: ", e.target.value);
                                    //     checkLuhn(e.target.value);

                                    // }}
                                    //ref = {caqhNpiIdRef}
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
                                name="caqhNpiId"
                                className="invalid-feedback"
                              />
                            </div>

                            <div className="col-xs-6 col-md-4">
                              {/* <MuiDatePicker name="dateOfBirth" label="Date Of Birth" dateState={apiTestState} setdateState={setApiTestState}
                              formikInitializeState={formikInitializeState} setFormikInitializeState={setFormikInitializeState}/> */}
                              <div style={{}}>
                                <ReactDatePicker
                                  id="datePicker"
                                  className="form-control example-custom-input-provider"
                                  selected={apiTestState.dateOfBirth}
                                  name="dateOfBirth"
                                  onChange={(date, event) =>
                                    handleDateChange(
                                      date,
                                      "dateOfBirth",
                                      event,
                                      values
                                    )
                                  }
                                  dateFormat="MM/dd/yyyy"
                                  peekNextMonth
                                  showMonthDropdown
                                  showYearDropdown
                                  isClearable
                                  onKeyDown={(e) => {
                                    e.preventDefault();
                                  }}
                                  onBlur={(date, event) =>
                                    handleDateOnBlur(date, "dateOfBirth", event)
                                  }
                                  dropdownMode="select"
                                  readOnly={
                                    tabRef.current === "DashboardView" &&
                                      prop.state.lockStatus !== undefined &&
                                      prop.state.lockStatus === "Y"
                                      ? true
                                      : false
                                  }
                                  style={{
                                    position: "relative",
                                    zIndex: "999",
                                  }}
                                  //placeholder="Date Of Birth"
                                  customInput={<RenderDatePicker />}
                                />
                              </div>

                            </div>
                          </div>

                          <div className="row my-2">
                            {/* <div className="col-xs-6 col-md-4">

                                            <div className="form-floating">
                                            <Multiselect

                                            id="floatingSelect"
                                            name="licenseType"

                                                // onKeyPressFn={function noRefCheck(){}}
                                                // onRemove={function noRefCheck(){}}
                                                // onSearch={function noRefCheck(){}}
                                                // onSelect={function noRefCheck(){}}
                                                //id="licenseTypeDropdown"
                                                //showArrow={true}
                                                isObject={false}
                                                options={selectValues.licenseTypeArray}
                                                singleSelect={true}
                                                ref={licenseTypeRef}
                                                selectedValues = {apiTestState.licenseTypeDefault}
                                                placeholder={""}

                                            />
                                            <label htmlFor="licenseType">License Type</label>
                                            </div>
                                            </div> */}

                            <div className="col-xs-6 col-md-4">
                              <Field name="ssn">
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
                                    <input
                                      maxLength="9"
                                      type="text"
                                      className={`form-control ${meta.touched && meta.error
                                        ? " is-invalid"
                                        : field.value
                                          ? "is-valid"
                                          : ""
                                        }`}
                                      placeholder="John"
                                      {...field}
                                    />
                                    <label htmlFor="floatingInputGrid">
                                      SSN
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
                                name="ssn"
                                className="invalid-feedback"
                              />
                            </div>
                            <div className="col-xs-6 col-md-4">
                              <Field name="agesSeen">
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
                                      options={selectValues.agesSeenArray}
                                      //options={[{label:selectValues.agesSeenArray, value:selectValues.agesSeenArray}]}

                                      id="agesSeenDropdown"
                                      isMulti={false}
                                      onChange={(selectValue, event) =>
                                        handleLinearSelectChange(
                                          selectValue,
                                          event,
                                          setFieldValue
                                        )
                                      }
                                      value={apiTestState.agesSeen}
                                      placeholder="Ages Seen"
                                      isClearable
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
                                name="agesSeen"
                                className="invalid-feedback"
                              />
                            </div>

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
                                      className={`form-control ${meta.touched && meta.error
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
                          </div>

                          <div className="row my-2">
                            {/* <div className="col-xs-6 col-md-4">
                                            <div className="form-floating">
                                             <Multiselect
                                                id="ethnicityDropdown"
                                                name="ethnicity"
                                                //onKeyPressFn={function noRefCheck(){}}
                                                //onRemove={function noRefCheck(){}}
                                                //onSearch={function noRefCheck(){}}
                                                //onSelect={function noRefCheck(){}}
                                                //showArrow={true}
                                                isObject={false}
                                                options={selectValues.ethnicityArray}
                                                singleSelect={true}
                                                ref={ethnicityRef}
                                                selectedValues = {apiTestState.ethnicityDefault}
                                                placeholder={""}
                                            />

                                            <label htmlFor="ethnicity">Ethnicity</label>
                                            </div>
                                            </div> */}
                          </div>

                          <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                              <Field name="medicaidId">
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div className="form-floating">
                                    <input
                                      maxLength="15"
                                      type="text"
                                      className={`form-control ${meta.touched && meta.error
                                        ? " is-invalid"
                                        : field.value
                                          ? "is-valid"
                                          : ""
                                        }`}
                                      placeholder="John"
                                      {...field}
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

                            <div className="col-xs-6 col-md-4">
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
                                  name="newPatients"
                                  isDisabled={
                                    tabRef.current === "DashboardView" &&
                                      prop.state.lockStatus !== undefined &&
                                      prop.state.lockStatus === "Y"
                                      ? true
                                      : false
                                  }
                                  className="basic-multi-select"
                                  options={[
                                    { label: "YES", value: "Y" },
                                    { label: "NO", value: "N" },
                                  ]}
                                  id="newPatientsDropdown"
                                  isMulti={false}
                                  onChange={(selectValue, event) =>
                                    handleLinearSelectChange(selectValue, event)
                                  }
                                  // value={apiTestState.newPatients}
                                  value={
                                    apiTestState.newPatients !== undefined
                                      ? apiTestState.newPatients.value?.toLowerCase() ===
                                        "y" ||
                                        apiTestState.newPatients.value?.toLowerCase() ===
                                        "yes"
                                        ? {
                                          label: convertToCase("YES"),
                                          value: convertToCase(
                                            apiTestState.newPatients.value
                                          ),
                                        }
                                        : apiTestState.newPatients.value?.toLowerCase() ===
                                          "n" ||
                                          apiTestState.newPatients.value?.toLowerCase() ===
                                          "yes"
                                          ? {
                                            label: convertToCase("NO"),
                                            value: convertToCase(
                                              apiTestState.newPatients.value
                                            ),
                                          }
                                          : apiTestState.newPatients
                                      : apiTestState.newPatients
                                  }
                                  placeholder="Accepting New Patients"
                                  isClearable
                                  isSearchable={
                                    document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                      ? false
                                      : true
                                  }
                                />
                              </div>
                            </div>

                            {/* <Multiselect
                                                isObject={false}
                                                //onKeyPressFn={function noRefCheck(){}}
                                                //onRemove={function noRefCheck(){}}
                                                //onSearch={function noRefCheck(){}}
                                                //onSelect={function noRefCheck(){}}
                                                options={['Yes','No']}
                                                id="newPatientDropdown"
                                                //showArrow={true}
                                                singleSelect={true}
                                                ref={newPatientsRef}
                                                selectedValues = {apiTestState.newPatientsDefault}
                                                name="newPatient"
                                                placeholder=''
                                            /> */}
                            {/* <select class="form-select" id="floatingSelect" aria-label="Floating label select example" name="newPatient" onChange={event => handleApiTestChange(event)} value={apiTestState.newPatientsRef}>
												<option selected>Select</option>
                                                <option value="Yes">Yes</option>
                                                <option value="no">No</option>
                                            </select> */}
                            {/* <label htmlFor="newPatient">Accepting New Patients</label> */}

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
                                    { label: "Yes", value: "Yes" },
                                    { label: "No", value: "No" },
                                  ]}
                                  id="placeInDirectoryDropdown"
                                  isMulti={false}
                                  onChange={(selectValue, event) =>
                                    handleLinearSelectChange(selectValue, event)
                                  }
                                  value={apiTestState.placeInDirectory}
                                  defaultValue={{ label: "Yes", value: "Yes" }}
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

                            {/* <Multiselect
                                                isObject={false}
                                                options={['Yes','No']}
                                                id="placeInDirectoryDropdown"
                                                //showArrow={true}
                                                singleSelect={true}
                                                ref={placeInDirectoryRef}
                                                selectedValues = {apiTestState.placeInDirectoryDefault}
                                                name="placeInDirectory"
                                                placeholder=''
                                            />

                                             <label htmlFor="placeInDirectory">Place In Directory</label> */}

                            {/*
                                            <div className="col-xs-6 col-md-4">
                                            <div className="form-floating">
                                            <Multiselect
                                            id="languageDropdown"
                                            name="language"
                                                // onKeyPressFn={function noRefCheck(){}}
                                                // onRemove={function noRefCheck(){}}
                                                // onSearch={function noRefCheck(){}}
                                                // onSelect={function noRefCheck(){}}
                                                options={selectValues.languageArray}
                                                showCheckbox={true}
                                                isObject={false}
                                                ref={languageRef}
                                                selectedValues = {apiTestState.languagesDefault}
                                                showArrow={true}
                                                placeholder={""}
                                            />
                                             <label htmlFor="language">Languages</label>
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
                                      className={`form-control ${meta.touched && meta.error
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

                          {/* New Nidhi */}
                          <div className="row my-2">
                            {/* <div className="col-xs-6 col-md-4">
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
                            </div> */}
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
                                      //value={field.value}
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
                          {/* here */}
                        </div>
                      </div>
                    </div>

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
                                            <br/>
                                            <Switch id="medicaidSwitch" name="medicaid" onChange={isChecked => {
                                                setApiTestState({
                                                    ...apiTestState,
                                                    Medicaid: isChecked
                                                });
                                            }} checked={(apiTestState.Medicaid!==undefined)?apiTestState.Medicaid:false}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            disabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                            />*/}
                            {/* <div className="form-floating">
                                            <div className="form-check form-switch">
                                                <input className="form-check-input" type="checkbox" id="medicaidSwitch" name="medicaid" onChange={event => handleApiTestChange(event)} value={apiTestState.medicaid}/>
                                            </div>
                                            </div> */}
                            {/*</div> */}
                            <div className="col-xs-6 col-md-3">
                              <label htmlFor="medicaidSwitch">Medicare</label>
                              <br />
                              <Field name="Medicare">
                                {({
                                  field, // { name, value, onChange, onBlur }
                                  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                  meta,
                                }) => (
                                  <div>
                                    <Switch
                                      id="medicareSwitch"
                                      name={field.name}
                                      onChange={(isChecked) => {
                                        if (formikInitializeState) {
                                          setFormikInitializeState(false);
                                        }
                                        setFieldValue(field.name, isChecked);
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
                                      /*disabled={
                                        tabRef.current === "DashboardView" &&
                                        prop.state.lockStatus !== undefined &&
                                        prop.state.lockStatus === "Y"
                                          ? true
                                          : false
                                      }*/
                                      disabled={true}
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
                                name="Medicare"
                                className="invalid-feedback"
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
                                      options={selectValues.stateOptionsLinear}
                                      id="statesDropdown"
                                      isMulti={true}
                                      onChange={(selectValue, event) =>
                                        handleLinearSelectChange(
                                          selectValue,
                                          event,
                                          setFieldValue
                                        )
                                      }
                                      value={apiTestState.states}
                                      placeholder="States"
                                      isClearable={false}
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
                    {/* Added by Shivani to show Credential Information on Cred Specialist and QA stage */}
                    {((prop.state.formView === "DashboardView" &&
                      (prop.state.stageName === "Cred Specialist" ||
                        prop.state.stageName === "QA")) ||
                      prop.state.formView === "HomeView" ||
                      prop.state.formView === "DashboardHomeView") && (
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
                                          Please select
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>{questionData()}</tbody>
                                  </table>
                                </div>
                              </div>
                              <div className="row">
                                <div className="col-xs-6 col-md-8">
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
                                        menu: (provided) => ({
                                          ...provided,
                                          zIndex: 9999,
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
                                      name="ecfmgQues"
                                      isDisabled={
                                        tabRef.current === "DashboardView" &&
                                          prop.state.lockStatus !== undefined &&
                                          prop.state.lockStatus === "Y"
                                          ? true
                                          : false
                                      }
                                      className="basic-multi-select"
                                      options={[
                                        { label: "YES", value: "Y" },
                                        { label: "NO", value: "N" },
                                      ]}
                                      id="ecfmgQuesDropdown"
                                      isMulti={false}
                                      onChange={(selectValue, event) =>
                                        handleLinearSelectChange(
                                          selectValue,
                                          event
                                        )
                                      }
                                      //value={apiTestState.ecfmgQues}
                                      value={
                                        apiTestState.ecfmgQues !== undefined
                                          ? apiTestState.ecfmgQues?.value?.toLowerCase() ===
                                            "y" ||
                                            apiTestState.ecfmgQues?.value?.toLowerCase() ===
                                            "yes"
                                            ? {
                                              label: convertToCase("YES"),
                                              value: convertToCase(
                                                apiTestState.ecfmgQues.value
                                              ),
                                            }
                                            : apiTestState.ecfmgQues?.value?.toLowerCase() ===
                                              "n" ||
                                              apiTestState.ecfmgQues?.value?.toLowerCase() ===
                                              "no"
                                              ? {
                                                label: convertToCase("NO"),
                                                value: convertToCase(
                                                  apiTestState?.ecfmgQues?.value
                                                ),
                                              }
                                              : apiTestState.ecfmgQues
                                          : apiTestState.ecfmgQues
                                      }
                                      isClearable
                                      placeholder="Do you have a Educational Commission for Foreign Medical Graduates (ECFMG) Number?"
                                      isSearchable={
                                        document.documentElement.clientHeight >
                                          document.documentElement.clientWidth
                                          ? false
                                          : true
                                      }
                                    />
                                  </div>
                                </div>
                                {/* <Multiselect
                                                   isObject={false}
                                                   options={['Yes','No']}
                                                   id="ecfmgQuesDropdown"
                                                   singleSelect={true}
                                                   ref={ecfmgQuesRef}
                                                   selectedValues = {apiTestState.ecfmgQuesDefault}
                                                   name="ecfmgQues"
                                                   placeholder=''
                                               /> */}

                                {/* <label htmlFor="ecfmgQues">Do you have a Educational Commission for Foreign Medical Graduates (ECFMG) Number?</label> */}
                              </div>

                              <div className="row my-2">
                                <div className="col-xs-6 col-md-4">
                                  <Field name="ecfmgNumber">
                                    {({
                                      field, // { name, value, onChange, onBlur }
                                      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                      meta,
                                    }) => (
                                      <div className="form-floating">
                                        <input
                                          maxLength="10"
                                          type="text"
                                          className={`form-control ${meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value ||
                                              field.value === null
                                              ? "is-valid"
                                              : ""
                                            }`}
                                          placeholder="123"
                                          {...field}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                          ECFMG Number
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
                                  {/* <MuiDatePicker name="ecfmgIssueDate" label="ECFMG Issue Date" dateState={apiTestState} setdateState={setApiTestState}
                              formikInitializeState={formikInitializeState} setFormikInitializeState={setFormikInitializeState}/> */}
                                  <div>
                                    <ReactDatePicker
                                      id="datePicker"
                                      className="form-control example-custom-input-provider"
                                      selected={apiTestState.ecfmgIssueDate}
                                      name="ecfmgIssueDate"
                                      onChange={(event) =>
                                        handleDateChange(event, "ecfmgIssueDate")
                                      }
                                      dateFormat="MM/dd/yyyy"
                                      readOnly={
                                        tabRef.current === "DashboardView" &&
                                          prop.state.lockStatus !== undefined &&
                                          prop.state.lockStatus === "Y"
                                          ? true
                                          : false
                                      }
                                      onKeyDown={(e) => {
                                        e.preventDefault();
                                      }}
                                      isClearable
                                      peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      customInput={<RenderDatePicker02 />}
                                    />
                                  </div>
                                </div>

                                <div className="col-xs-6 col-md-4">
                                  {/* <MuiDatePicker name="ecfmgExpirationDate" label="ECFMG Expiration Date" dateState={apiTestState} setdateState={setApiTestState}
                              formikInitializeState={formikInitializeState} setFormikInitializeState={setFormikInitializeState}/> */}
                                  <div>
                                    <ReactDatePicker
                                      id="datePicker"
                                      className="form-control example-custom-input-provider"
                                      selected={apiTestState.ecfmgExpirationDate}
                                      name="ecfmgExpirationDate"
                                      onChange={(event) =>
                                        handleDateChange(
                                          event,
                                          "ecfmgExpirationDate"
                                        )
                                      }
                                      onKeyDown={(e) => {
                                        e.preventDefault();
                                      }}
                                      dateFormat="MM/dd/yyyy"
                                      readOnly={
                                        tabRef.current === "DashboardView" &&
                                          prop.state.lockStatus !== undefined &&
                                          prop.state.lockStatus === "Y"
                                          ? true
                                          : false
                                      }
                                      isClearable
                                      peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      customInput={<RenderDatePicker03 />}
                                    />
                                  </div>
                                </div>
                              </div>

                              <div className="row my-2">
                                <div className="col-xs-6 col-md-4">
                                  {/* <MuiDatePicker name="attestationDate" label="Attestation Date" dateState={apiTestState} setdateState={setApiTestState}
                              formikInitializeState={formikInitializeState} setFormikInitializeState={setFormikInitializeState}/> */}
                                  <div>
                                    <ReactDatePicker
                                      id="datePicker"
                                      className="form-control example-custom-input-provider"
                                      selected={apiTestState.attestationDate}
                                      name="attestationDate"
                                      onChange={(event) =>
                                        handleDateChange(event, "attestationDate")
                                      }
                                      onKeyDown={(e) => {
                                        e.preventDefault();
                                      }}
                                      isClearable
                                      dateFormat="MM/dd/yyyy"
                                      readOnly={
                                        tabRef.current === "DashboardView" &&
                                          prop.state.lockStatus !== undefined &&
                                          prop.state.lockStatus === "Y"
                                          ? true
                                          : false
                                      }
                                      peekNextMonth
                                      showMonthDropdown
                                      showYearDropdown
                                      dropdownMode="select"
                                      customInput={<RenderDatePicker04 />}
                                    />
                                  </div>
                                </div>
                                <div className="col-xs-6 col-md-4">
                                  <Field name="attestationId">
                                    {({
                                      field, // { name, value, onChange, onBlur }
                                      form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                      meta,
                                    }) => (
                                      <div className="form-floating">
                                        <input
                                          maxLength="10"
                                          type="text"
                                          className={`form-control ${meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value
                                              ? "is-valid"
                                              : ""
                                            }`}
                                          placeholder="123"
                                          {...field}
                                        />
                                        <label htmlFor="floatingInputGrid">
                                          Attestation Id
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
                              apiTestState={apiTestState}
                              transactionType={AddProvider.displayName}
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
                              handleSelectSpecialityOnBlur={
                                handleSelectSpecialityOnBlur
                              }
                              fetchAutoPopulate={fetchAutoPopulate}
                              subSpecialityOptions={subSpecialityOptions}
                              apiTestState={apiTestState}
                              transactionType={AddProvider.displayName}
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
                        Provider Address
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
                              calledFormName={AddProvider.validate}
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
                              apiTestState={apiTestState}
                              transactionType={AddProvider.displayName}
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
                              handleGridSelectChange={handleGridSelectChange}
                              handleGridFieldChange={handleGridFieldChange}
                              gridRowsFinalSubmit={gridRowsFinalSubmit}
                              gridFieldTempState={gridFieldTempState}
                              editTableRows={editTableRows}
                              selectJson={selectValues}
                              calledFormName={AddProvider.validate}
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
                              apiTestState={apiTestState}
                              transactionType={AddProvider.displayName}
                            ></PayToTable>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Added by Shivani to show Education on Cred Specialist and QA stage */}
                  {((prop.state.formView === "DashboardView" &&
                    (prop.state.stageName === "Cred Specialist" ||
                      prop.state.stageName === "QA")) ||
                    prop.state.formView === "HomeView" ||
                    prop.state.formView === "DashboardHomeView") && (
                      <div className="accordion-item">
                        <h2
                          className="accordion-header"
                          id="panelsStayOpen-Education"
                        >
                          <button
                            className="accordion-button accordionButtonStyle"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseEducation"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseEducation"
                          >
                            Education & Training Details
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseEducation"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Education"
                        >
                          <div className="accordion-body">
                            <div className="row">
                              <div className="col-xs-6 col-md-12">
                                <EducationTable
                                  educationTableRowsData={educationTableRowsData}
                                  addTableRows={addTableRows}
                                  deleteTableRows={deleteTableRows}
                                  handleGridSelectChange={handleGridSelectChange}
                                  handleGridDateChange={handleGridDateChange}
                                  handleGridFieldChange={handleGridFieldChange}
                                  gridFieldTempState={gridFieldTempState}
                                  editTableRows={editTableRows}
                                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                                  selectJson={selectValues}
                                  lockStatus={
                                    prop.state !== null &&
                                      prop.state.lockStatus !== undefined &&
                                      prop.state.lockStatus !== ""
                                      ? prop.state.lockStatus
                                      : "N"
                                  }
                                ></EducationTable>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* <div className="accordion-item">
                                <h2 className="accordion-header" id="panelsStayOpen-Training">
                                <button className="accordion-button accordionButtonStyle" type="button" data-bs-toggle="collapse" data-bs-target="#panelsStayOpen-collapseTraining" aria-expanded="true" aria-controls="panelsStayOpen-collapseTraining">
                                Training Details
                                </button>
                                </h2>
                                <div id="panelsStayOpen-collapseTraining" className="accordion-collapse collapse show" aria-labelledby="panelsStayOpen-Training">
                                    <div className="accordion-body">
                                        <div className="row">
                                            <div className="col-xs-6 col-md-12">
                                                <TrainingTable trainingTableRowsData={trainingTableRowsData} addTableRows={addTableRows}
                                                deleteTableRows={deleteTableRows} handleGridSelectChange={handleGridSelectChange}
                                                handleGridDateChange={handleGridDateChange} handleGridFieldChange={handleGridFieldChange} gridRowsFinalSubmit={gridRowsFinalSubmit}
                                                lockStatus={(prop.state!==null && prop.state.lockStatus!==undefined)?prop.state.lockStatus:'N'}></TrainingTable>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div> */}

                  {/* Added by Shivani to show Work History on Cred Specialist and QA stage */}
                  {((prop.state.formView === "DashboardView" &&
                    (prop.state.stageName === "Cred Specialist" ||
                      prop.state.stageName === "QA")) ||
                    prop.state.formView === "HomeView" ||
                    prop.state.formView === "DashboardHomeView") && (
                      <div className="accordion-item">
                        <h2 className="accordion-header" id="panelsStayOpen-Work">
                          <button
                            className="accordion-button accordionButtonStyle"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#panelsStayOpen-collapseWork"
                            aria-expanded="true"
                            aria-controls="panelsStayOpen-collapseWork"
                          >
                            Work History Details
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseWork"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Work"
                        >
                          <div className="accordion-body">
                            <div className="row">
                              <div className="col-xs-6 col-md-12">
                                <WorkTable
                                  workTableRowsData={workTableRowsData}
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
                                ></WorkTable>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Added by Shivani to show Insurance Details on Cred Specialist and QA stage */}
                  {((prop.state.formView === "DashboardView" &&
                    (prop.state.stageName === "Cred Specialist" ||
                      prop.state.stageName === "QA")) ||
                    prop.state.formView === "HomeView" ||
                    prop.state.formView === "DashboardHomeView") && (
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
                    )}

                  {tabRef.current === "HomeView" && (
                    <DocumentSection
                      fileDataRef={documentSectionDataRef.current}
                      displayName={AddProvider.displayName}
                      flowId={credentialingConfigData["FlowId"]}
                    />
                  )}

                  {/* Added by Shivani to show Credential Checklist on Cred Specialist and QA stage */}
                  {/* Modified by NG to not show CC for delegated Yes cases. */}
                  {hideandShow.show == true &&
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
                                //editTableRows={editTableRows}
                                //finalRowsAfterSave={finalGridSaveDataRef.current["CredentialTable"]}
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
                          // submitForm().then(() => {
                          //   checkErrorsAndFocusOnFields(errors);
                          // });
                          validateForm().then((errors) => {
                            checkErrorsAndFocusOnFields(
                              errors,
                              setFieldTouched,
                              handleSubmit,
                              event
                            );
                          });
                          //handleSubmit(event);
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

  const alertShowHide = (nj) => {
    setAlertModalShow(nj);
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

  const addRoster = (caqhId) => {
    const organizationId = process.env.REACT_APP_ORG_ID;
    const payload = {
      organizationId,
      cahqProviderId: caqhId,
    };
    setLoading(true);
    customAxios
      .post("caqh/addToRoster", payload, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("jiji" + JSON.stringify(res));
        setLoading(false);
        if (res.data === "Batch id already exists") {
          setCaqhGenericModal({
            header: "Confirmation of Request",
            body: "Your request is in process.",
            state: true,
          });
          return;
        }
        setCaqhGenericModal({
          header: "Confirmation of Request",
          body: "The request to add CAQH ID has been sent. Please check after 10 minutes.",
          state: true,
        });
      })
      .catch((err) => {
        setLoading(false);
        setCaqhGenericModal({
          header: "Confirmation of Request",
          body: "The request to add CAQH ID has been sent. Please check after 10 minutes.",
          state: true,
        });
      });
  };

  return (
    loadForm && (
      <>
        <BeatLoader loading={loading} size={50} cssOverride={override} />
        <AlertModal
          variant={alertModalShow.variant}
          message={alertModalShow.message}
          show={alertModalShow.show}
          alertShowHide={alertShowHide}
        />
        <div
          className="AddProvider backgroundColor"
          style={{ minHeight: "100vh" }}
        >
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
                  Add a Provider
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
          <FooterComponent />
          <Modal
            onHide={() => {
              setCaqhModal({ id: null, header: null, body: null, show: false });
            }}
            backdrop="static"
            keyboard={false}
            show={caqhModal.show}
            dialogClassName="delete-modal-dialog"
            size="sm"
            aria-labelledby="example-custom-modal-styling-title"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h5>{caqhModal.header}</h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row">
                  <div className="col-md">
                    <p>{caqhModal.body}</p>
                    {/* <p>The CAQH ID is not available in roster. Do you want to add data in roster.</p> */}
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  addRoster(caqhModal.id);
                  setCaqhModal({
                    id: null,
                    header: null,
                    body: null,
                    show: false,
                  });
                }}
              >
                Yes
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setCaqhModal({
                    id: null,
                    header: null,
                    body: null,
                    show: false,
                  });
                }}
              >
                No
              </button>
            </Modal.Footer>
          </Modal>

          {/* confirmation Modal after CAQH request submission */}
          <Modal
            onHide={() => {
              setCaqhGenericModal({ body: null, header: null, state: false });
            }}
            backdrop="static"
            keyboard={false}
            show={caqhGenericModal.state}
            dialogClassName="delete-modal-dialog"
            size="sm"
            aria-labelledby="example-custom-modal-styling-title"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>
                <h5>{caqhGenericModal.header}</h5>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="container">
                <div className="row">
                  <div className="col-md">
                    <p>{caqhGenericModal.body}</p>
                  </div>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-success"
                onClick={() => {
                  setCaqhGenericModal({
                    body: null,
                    header: null,
                    state: false,
                  });
                }}
              >
                Close
              </button>
            </Modal.Footer>
          </Modal>
        </div>

        {/* <footer style={{boxShadow: "0 2px 4px 0 rgb(0 0 0 / 15%)",background:"white",margin:"20px"}}>

            </footer> */}
      </>
    )
  );
}
