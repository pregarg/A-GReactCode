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
import LocationTable from "../TileFormsTables/LocationTable";
import PayToTable from "../TileFormsTables/PayToTable";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useDispatch, useSelector, useStore } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import FooterComponent from "../../FooterComponent";
import { Modal } from "react-bootstrap";
import { BeatLoader } from "react-spinners";
import ReferenceTab from "../../../WorkItemDashboard/ReferenceTab";
import DocumentSection from "../DocumentSection";
import { useAxios } from "../../../api/axios.hook";
import { data } from "jquery";
import AlertModal from "../TileFormModals/AlertModal";
import TableComponent from "../../../util/TableComponent";
import useCallApi from "../../CustomHooks/useCallApi";

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
    return null;
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
  // Medicaid:false,
  // Medicare:false,
  legalEntityName: "",
  //dbaName: "",
  npiId: "",
  medicareId: "",
  medicaidId: "",
  // placeInDirectory:"",
  emailId: "",
  //delegated:""
  //Exchange:false,
  //Commercial:false,
  //languagesDefault:[],
  //licenseTypeDefault:[],
  //placeInDirectoryDefault:[],
};

export default function AncFacDemo() {
  AncFacDemo.validate = "shouldValidate";
  AncFacDemo.displayName = "Ancillary/Facility Modification";

  const { customAxios } = useAxios();

  //Added by NG on 11/14/2023
  const [gridFieldTempState, setGridFieldTempState] = useState({});
  //till Here
  const userType = useSelector((store) => store.auth.userType);

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
  const caseData = useSelector((store) => store.dashboardNavigationState);

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
  const [alertModalShow, setAlertModalShow] = useState({ show: false });

  const [formikInitializeState, setFormikInitializeState] = useState(false);

  const validationSchema = Yup.object().shape({
    // legalEntityName: Yup.string()
    // .required("Please enter Legal Entity Name")
    // .max(100, "Legal Entity Name max length exceeded"),
    dbaName: Yup.string()
      .required("Please enter DBA Name")
      .max(100, "DBA Name max length exceeded"),
    // npiId: Yup.string()
    //   //        .typeError('NPI ID must be a number')
    //   .required("Please enter NPI ID")
    //   .max(10, "NPI ID max length exceeded")
    //   .matches(
    //     /(?=.*?\d)^\$?(([1-9]\d{0,2}(,\d{3})*)|\d+)?(\.\d{1,2})?$/,
    //     "Only numbers are accepted"
    //   ),
    // medicareId: Yup.string()
    //   //        .typeError('Medicare ID must be a number')
    //   .required("Please enter Medicare ID")
    //   .max(10, "Medicare ID max length exceeded"),
    // medicaidId: Yup.string()
    //   // //       .typeError('Medicaid ID must be a number')
    //   //          .required("Please enter Medicaid ID")
    //   .max(10, "Medicaid ID max length exceeded"),
    // //New Nidhi
    // emailId: Yup.string()
    //   .email("Please enter valid Email Id")
    //   .required("Please enter Email Id")
    //   .max(50, "Email Id max length exceeded"),
    // //Till here
    // delegated: Yup.object().nullable().required('Please select Delegated')
  });

  //Newly Added by Nidhi on 08/01/2023
  const providerColumnNames =
    "Legal Entity Name~name, Provider ID~PROVIDERID, Contract ID~CONTRACTID, DBA Name~DBANAME, Transaction Type~TRANSACTIONTYPE, NPI ID~NPIID, Ancillary/Facility Status~FACIANCISTATUS";
  const [providerTableData, setProviderTableData] = useState([]);
  const [distinctLegalEN, setDistinctLegalEN] = useState([]);

  //Added Newly by Nidhi Gupta on 08/23/2023
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  //Till Here

  /*const [caseUnlockState, setCaseUnlockState] = useState(
        providerTableData.map(item => ({...item, isChecked: false}))
    )*/

  //Added By Harshit
  const [caseUnlockState, setCaseUnlockState] = useState(-1);

  //const [callCount, setCallCount] = useState(0);

  const navigateToForm = () => {
    //setCallCount(prevCount => prevCount + 1);
    //console.log("Line 214 callCount: ",callCount);
    console.log("Helloo");
  };

  /* const handleCheckBoxChange = (evnt,ind) => {

        console.log("Inside handleCheckBoxChange event: ",evnt + " index: ",ind);
        let jsn = providerTableData[ind];
        //printConsole("Inside handleCheckBoxChange providerTableData: ",providerTableData);
        jsn.isChecked = evnt.target.checked;
        //printConsole("Inside handleCheckBoxChange jsn: ",jsn);
        //console.log("handleCheckBoxChange evnt.target :",evnt.target)
        //console.log("handleCheckBoxChange evnt.target.value :",evnt.target.value)
        setCaseUnlockState([...caseUnlockState,jsn]);

    }*/

  const settingProviderData = () => {
    let arr3 = [];
    //Commented by Harshit for testing
    const provContLinkData = mastersSelector["masterProvContLinkData"];

    printConsole("Inside provContLinkData data: ", provContLinkData);
    if (provContLinkData !== undefined && provContLinkData.length > 0) {
      const contractIdData = provContLinkData[0][0];
      printConsole(
        "Inside getDashboardData contractIdData Data: ",
        contractIdData
      );
      if (contractIdData !== undefined) {
        if (contractIdData.hasOwnProperty("FacAncModification")) {
          arr3 = contractIdData["FacAncModification"];
          printConsole("Inside provContLinkData arr3: ", arr3);
          setProviderTableData(arr3);
          //console.log("Line631  providerTableData: ",providerTableData);

          //Added Newly
          //Commented by Harshit
          //setCaseUnlockState(arr3?.map(item => ({...item, isChecked: false})));
        }
      }
    }

    // const contractArray = setContractIdDropDown(arr1,arr2);
    // if(contractArray.length>0){
    //     selectJson.contractIdOptions = contractArray;
    //     printConsole("Contrcat ID Select JSOn: ",selectJson);
    //     if(contractArray.length === 1){
    //         setApiTestState({...apiTestState,contractId:contractArray[0]});
    //     }
    // }
  };

  const removeExtraChecked = () => {
    let retJsn = providerTableData.filter((el) => delete el.isChecked);
    return retJsn;
  };

  const falseExtraChecked = () => {
    let retJsn = providerTableData.filter((el) => {
      el.isChecked = false;
    });
    return retJsn;
  };
  ///10/23/2023
  const clearDataOnCheckBoxChange = () => {
    setApiTestState({
      AddModification:
        apiTestState.AddModification !== undefined &&
        apiTestState.AddModification == true
          ? true
          : false,
      PayToModification:
        apiTestState.PayToModification !== undefined &&
        apiTestState.PayToModification == true
          ? true
          : false,
      SpecModification:
        apiTestState.SpecModification !== undefined &&
        apiTestState.SpecModification == true
          ? true
          : false,
      DemoModification:
        apiTestState.DemoModification !== undefined &&
        apiTestState.DemoModification == true
          ? true
          : false,
      legalEntityName: "",
      dbaName: "",
      npiId: "",
      medicareId: "",
      medicaidId: "",
      emailId: "",
      delegated: "",
      contractId: "",
      placeInDirectory: "",
    });
    setLocationTableRowsData([]);
    setPayToTableRowsData([]);
    setspecialityTableRowsData([]);
  };
  ///

  const handleCheckBoxChange = (evnt, ind) => {
    //Added by Nidhi 08/02/2023
    const isChecked = evnt.target.checked;
    console.log(
      "Inside handlecheckbox change with event: ",
      evnt.target.checked
    );
    console.log(
      "Inside handlecheckbox change with index: ",
      ind,
      " and value: ",
      isChecked
    );
    printConsole(
      "Inside handleCheckBox change caseUnlockState value: ",
      caseUnlockState
    );
    if (isChecked) {
      if (caseUnlockState !== -1) {
        alert("Please select one case only.");
      } else {
        clearDataOnCheckBoxChange();
        let updatedProvData = removeExtraChecked();
        printConsole(
          "Inside handleCheckBox change else with updated data: ",
          updatedProvData
        );
        let jsn = updatedProvData[ind];
        jsn.isChecked = evnt.target.checked;
        updatedProvData[ind] = jsn;
        setProviderTableData(updatedProvData);
        setCaseUnlockState(ind);
      }
    }
    if (!isChecked) {
      clearDataOnCheckBoxChange();
      let updatedProvData = [...providerTableData];
      let jsn = updatedProvData[ind];
      jsn.isChecked = evnt.target.checked;
      updatedProvData[ind] = jsn;
      setProviderTableData(updatedProvData);
      setCaseUnlockState(-1);
    }

    /*let jsn = providerTableData[ind];
        jsn.isChecked = evnt.target.checked;
        //let jsn = {...providerTableData[ind], isChecked: event.target.checked };
        console.log("handleCheckBoxChange jsn: ",jsn);
        console.log("handleCheckBoxChange caseUnlockState 236: ",caseUnlockState);

        let updatedCaseUnlockState = caseUnlockState.map((item, index) => {

            if (index == ind) {
                  console.log("handleCheckBoxChange If me gaya: ", index, ind);
                return jsn;
            } else {
                console.log("handleCheckBoxChange else me gaya: ", index, ind);
                return item;
            }
        });

        console.log("handleCheckBoxChange updatedCaseUnlockState: ",updatedCaseUnlockState);

        setCaseUnlockState(updatedCaseUnlockState);*/
  };

  //Added by Nidhi Gupta on 10/18/2023
  const handleRadioChange = (evnt, ind) => {
    const isChecked = evnt.target.checked;
    //console.log("select inside Radio",selectedType);

    clearDataOnCheckBoxChange();
    if (isChecked) {
      let updatedProvData = removeExtraChecked();
      let jsn = updatedProvData[ind];
      printConsole("jsn", jsn);
      jsn.isChecked = evnt.target.checked;
      //updatedProvData[ind] = jsn;
      setCaseUnlockState(ind);
    }
  };

  //Till Here

  const showGridCheckbox =
    mastersSelector.hasOwnProperty("auth") &&
    mastersSelector.auth.hasOwnProperty("userType") &&
    mastersSelector.auth.userType === "A"
      ? true
      : true;
  //Till Here

  //const {validate,errors,handleSubmit} = useValidateForm();

  const {
    submitCase,
    updateLockStatus,
    validateGridData,
    printConsole,
    setContractIdDropDown,
    updateDecision,
    checkDecision,
    areAllLocationNameSame,
  } = useUpdateDecision();
  const {
    getTableDetails,
    trimJsonValues,
    convertToCase,
    checkGridJsonLength,
    extractDate,
    acceptNumbersOnly
  } = useGetDBTables();
  //Added Newly by Nidhi Gupta on 09/05/2023
  const { getLinkingData } = useCallApi();
  //Till Here
  const caqhId = useRef();
  const caqhNpiIdRef = React.useRef();
  //let apiUrl = 'http://localhost:8081/api/';
  // const languageArray=[];
  // const ethnicityArray=[];
  // const salutationArray=[];
  // const agesSeenArray=[];
  // const licenseTypeArray=[];
  let prop = useLocation();

  //Nidhi
  let quesAnsList = [];
  //here 00
  const navigate = useNavigate();
  const tabRef = useRef("HomeView");
  const hideandShow = useRef(null);
  const fetchAutoPopulate = useRef(false);

  const navigateHome = async () => {
    console.log("Inside navigateHome");
    //Commented By Harshit
    //setCaseUnlockState([]);

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

  //Nidhi commented this
  //const [addQuesValues, setAddQuesValues] = useState([]);
  //here
  //const [selectLicenseGridValues, setSelectLicenseGridValues] = useState({});

  const onSuccess = (response, typeOfRequest) => {};
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

  //10/25/2023
  const [apiLegalENState, setApiLegalENState] = useState();
  ///

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

  const [locationTableRowsData, setLocationTableRowsData] = useState([]);

  const [payToTableRowsData, setPayToTableRowsData] = useState([]);

  //Nidhi
  const [quesAnsListJson, setQuesAnsListJson] = useState([]);
  //here

  //Added Newly by Nidhi Gupta on 6/2/2023
  //Program to implement Luhn algorithm
  // Returns true if given
  // NPI ID is valid
  const checkLuhn = (caqhNpiId) => {
    console.log("Inside onBlur event of NPI ID");
    if (caqhNpiId.length > 0) {
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
  };

  //Till Here

  useEffect(() => {
    console.log("Auth Data: ", authData);
    printConsole("Before caseUnlockState value: ", caseUnlockState);
    falseExtraChecked();
    setCaseUnlockState(-1);
    printConsole("After caseUnlockState value: ", caseUnlockState);

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

    let selectJson = {};
    let additionalQuesValues = [];
    // console.log("master ages seen exists: ",mastersSelector['masterAgesSeen']);
    // console.log("master ages seen exists 22: ",mastersSelector['masterAgesSeen'].length);
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
      settingProviderData();
    }

    //Added by Nidhi Gupta on 9/1/2023
    const output = mastersSelector["masterDistinctValues"];
    if (output.length > 0) {
      const facAncMod = output[0][0]["FacAncMod"];
      console.log("facAncMod: ", facAncMod);
      let newLegalEN = [];
      if (facAncMod.length > 0) {
        facAncMod.map((ele) => {
          const org = {
            label: ele.LEGALENTITYNAME,
            value: ele.LEGALENTITYNAME,
          };
          newLegalEN.push(org);
        });
        console.log("newLegalEN: ", newLegalEN);
        setDistinctLegalEN(newLegalEN);
      }
    }
    //Till Here

    setTimeout(() => setSelectValues(selectJson), 1000);

    //Added by Nidhi
    selectJson["additionalQues"]
      .filter(
        (data) =>
          data.TransactionType.toLowerCase() ==
          AncFacDemo.displayName.toLowerCase()
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
            respKeys.forEach((k) => {
              console.log("Response key: ", k);
              if (k === "linearTable02") {
                let apiResponse = {};
                if (respData[k][0] !== undefined) {
                  apiResponse = respData[k][0];
                  //console.log("Hi apiResponse xx: ",apiResponse);
                  //prop.state.dbaName=apiResponse.dbaName;
                  apiResponse.placeInDirectory = {
                    label: apiResponse.placeInDirectory,
                    value: apiResponse.placeInDirectory,
                  };
                  apiResponse.delegated = {
                    label: apiResponse.delegated,
                    value: apiResponse.delegated,
                  };

                  apiResponse.contractId = {
                    label: apiResponse.contractId,
                    value: apiResponse.contractId,
                  };

                  apiResponse = convertToDateObj(apiResponse);
                  setApiTestState(apiResponse);
                  setFormikInitializeState(true);
                }
              }

              if (k === "locationTable") {
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
                  /*if (apiResponse.hasOwnProperty("TELEMEDICINE")) {
                                  if (apiResponse.TELEMEDICINE === "Y") {
                                    apiResponse.telemedicine = {
                                      label: "Yes",
                                      value: apiResponse.TELEMEDICINE,
                                    };
                                  } else if (apiResponse.TELEMEDICINE === "N") {
                                    apiResponse.telemedicine = {
                                      label: "No",
                                      value: apiResponse.TELEMEDICINE,
                                    };
                                  }
                                }*/

                  if (apiResponse.hasOwnProperty("placeInDirectory")) {
                    if (apiResponse.placeInDirectory === "Y") {
                      apiResponse.placeInDirectory = {
                        label: "Yes",
                        value: apiResponse.placeInDirectory,
                      };
                    } else if (apiResponse.placeInDirectory === "N") {
                      apiResponse.placeInDirectory = {
                        label: "No",
                        value: apiResponse.placeInDirectory,
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
                  console.log(
                    "Ancillary/Facility Modification payToTable newJson;",
                    newJson
                  );
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
                      apiResponse.pcp = { label: "No", value: apiResponse.pcp };
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
                    "specialityTableRowsData apiResponse useEffect: ",
                    apiResponse
                  );
                });
                setspecialityTableRowsData(apiResponseArray);
              }
            });
          }
        })
        .catch((err) => {
          console.log(err.message);
        });

      console.log("getApiJson: ", getApiJson);
    }

    return () => {
      console.log("UNMOUNT");
      setProviderTableData([]);
      //Commented by Harshit
      //setCaseUnlockState([]);
    };
  }, []);

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
    //console.log("Converted JSON: ",jsonObj);
    return jsonObj;
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
  //Added  by NG on 11/14/2023
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
          console.log("gridDataRef.current: ", gridDataRef.current);
        }
      }

      if (triggeredFormName === "PayToTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("payToTable")
          ? [...gridDataRef.current.payToTable]
          : [];
        gridRowJson = { ...payToTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.payToTable = getGridDataValues(gridRowArray);
          console.log("gridDataRef.current: ", gridDataRef.current);
        }
      }

      if (triggeredFormName === "SpecialityTable") {
        gridRowArray = gridDataRef.current.hasOwnProperty("specialityTable")
          ? [...gridDataRef.current.specialityTable]
          : [];
        gridRowJson = { ...specialityTableRowsData[index] };
        if (Object.keys(gridRowJson).length !== 0) {
          gridRowJson["operation"] = oprtn;
          //gridRowJson = trimJsonValues(gridRowJson);
          gridRowArray.push(trimJsonValues(gridRowJson));
          //console.log("Final array: ",getGridDataValues(gridRowArray));
          // //licenseTableRowsData[index].operation = oprtn;
          gridDataRef.current.specialityTable = getGridDataValues(gridRowArray);
          console.log("gridDataRef.current: ", gridDataRef.current);
        }
      }
    }
  };

  //Commented by NG on 11/14/2023
  /* const gridRowsFinalSubmit = (triggeredFormName,index,operationType) => {
        console.log('Inside gridRowsFinalSubmit with view: ',tabRef);
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


            if(triggeredFormName === 'LocationTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('locationTable'))?[...gridDataRef.current.locationTable]:[];
                gridRowJson = {...locationTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                //gridRowJson = trimJsonValues(gridRowJson);
                gridRowArray.push(trimJsonValues(gridRowJson));
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //licenseTableRowsData[index].operation = oprtn;
                gridDataRef.current.locationTable = getGridDataValues(gridRowArray);
                console.log("gridDataRef.current: ",gridDataRef.current);
            }

            if(triggeredFormName === 'PayToTable'){
                gridRowArray = (gridDataRef.current.hasOwnProperty('payToTable'))?[...gridDataRef.current.payToTable]:[];
                gridRowJson = {...payToTableRowsData[index]};
                gridRowJson['operation'] = oprtn;
                //gridRowJson = trimJsonValues(gridRowJson);
                gridRowArray.push(trimJsonValues(gridRowJson));
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //licenseTableRowsData[index].operation = oprtn;
                gridDataRef.current.payToTable = getGridDataValues(gridRowArray);
                console.log("gridDataRef.current: ",gridDataRef.current);
            }

            if (triggeredFormName === "SpecialityTable") {
                gridRowArray = gridDataRef.current.hasOwnProperty("specialityTable")
                  ? [...gridDataRef.current.specialityTable]
                  : [];
                gridRowJson = { ...specialityTableRowsData[index] };
                gridRowJson["operation"] = oprtn;
                //gridRowJson = trimJsonValues(gridRowJson);
                gridRowArray.push(trimJsonValues(gridRowJson));
                //console.log("Final array: ",getGridDataValues(gridRowArray));
                // //licenseTableRowsData[index].operation = oprtn;
                gridDataRef.current.specialityTable = getGridDataValues(gridRowArray);
                console.log("gridDataRef.current: ", gridDataRef.current);
              }


        }
    }*/

  //Added by Harshit on 11/14/2023
  const editTableRows = (index, triggeredFormName) => {
    console.log("Inside editTableRows: ", triggeredFormName);
    let rowInput = {};

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
  };
  //Till here

  const addTableRows = (triggeredFormName, index) => {
    // fetchAutoPopulate.current=false;
    // console.log("rowData: ",specialityTableRowsData);
    let rowsInput = {};

    if (triggeredFormName === "LocationTable") {
      rowsInput.rowNumber = locationTableRowsData.length + 1;
      //setLocationTableRowsData([...locationTableRowsData, rowsInput]);
    }

    if (triggeredFormName === "PayToTable") {
      rowsInput.rowNumber = payToTableRowsData.length + 1;
      //setPayToTableRowsData([...payToTableRowsData, rowsInput]);
    }

    if (triggeredFormName === "SpecialityTable") {
      rowsInput.rowNumber = specialityTableRowsData.length + 1;
      //setspecialityTableRowsData([...specialityTableRowsData, rowsInput])
    }
    setGridFieldTempState(rowsInput);
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
      gridRowsFinalSubmit(triggeredFormName, index, "Delete");

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

      if (triggeredFormName === "SpecialityTable") {
        const rows = [...specialityTableRowsData];
        rows.splice(index, 1);
        setspecialityTableRowsData(rows);
      }
    }
    // const rows = [...specialityTableRowsData];
    // rows.splice(index, 1);
    // setspecialityTableRowsData(rows);
  };

  const handleGridFieldChange = (index, evnt, triggeredFormName) => {
    console.log("Inside handleGridFieldChange: ", triggeredFormName);
    //let rowsInput = "";
    let tempInput = { ...gridFieldTempState };
    let { name, value } = evnt.target;
    console.log("Inside handleGridFieldChange: ", value, tempInput);
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

  //Commented By Harshit and modified this method wrt to "save data only on grid save and close"
  /*const handleGridFieldChange = (index, evnt,triggeredFormName) => {
        console.log('Inside handleGridFieldChange: ',triggeredFormName);
        let rowsInput = '';
        let { name, value } = evnt.target;



        if(triggeredFormName === 'LocationTable'){
            //console.log('Inside LocationTable');
            rowsInput = [...locationTableRowsData];
        }

        if(triggeredFormName === 'PayToTable'){
            //console.log('Inside PayToTable');
            rowsInput = [...payToTableRowsData];
        }

        if (triggeredFormName === "SpecialityTable") {
            //console.log('Inside SpecialityTable');
            rowsInput = [...specialityTableRowsData];
          }


        //console.log('Inside handleGridFieldChange: ',rowsInput);
        rowsInput[index][name] = value;


        if(triggeredFormName === 'LocationTable'){
            setLocationTableRowsData(rowsInput);
        }

        if(triggeredFormName === 'PayToTable'){
            setPayToTableRowsData(rowsInput);
        }

        if (triggeredFormName === "SpecialityTable") {
            //rowsInput = [...specialityTableRowsData];

            setspecialityTableRowsData(rowsInput);

            //Fixed by Nidhi Gupta
          }


   }*/

  //Added Newly by Nidhi Gupta on 11/1/2023

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

  const handleGridOnBlur = (index, evnt, triggeredFormName) => {
    console.log("Inside handleGridOnBlur: ", triggeredFormName);
    let rowsInput = {};
    const { name, value } = evnt.target;

    if (triggeredFormName === "SpecialityTable") {
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
  //Till Here

  const handleLinearSelectChange = (selectValue, evnt) => {
    setIsSearchClicked(false);
    //10/23/2023
    if (formikInitializeState) {
      setFormikInitializeState(true);
    }

    const { name } = evnt;
    setApiLegalENState({ ...apiLegalENState, [name]: selectValue });

    ////
    //setApiTestState({...apiTestState,[name] : selectValue});

    //     if (name ==='pdmLegalEN')
    //     {
    falseExtraChecked();
    setCaseUnlockState(-1);
    setLocationTableRowsData([]);
    setPayToTableRowsData([]);
    setspecialityTableRowsData([]);
    setApiTestState({
      ...apiTestState,
      legalEntityName: "",
      npiId: "",
      medicareId: "",
      medicaidId: "",
      emailId: "",
      delegated: "",
      dbaName: "",
      contractId: "",
      placeInDirectory: "",
    });
    const orgValue = selectValue.value;
    printConsole("Inside add provider fields on blur: ", orgValue);
    // let arr1 = [];
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

      if (provContLinkData !== undefined && provContLinkData.length > 0) {
        const tableCompData = provContLinkData[0];
        printConsole(
          "Inside getDashboardData tableCompData Data: ",
          tableCompData
        );
        if (
          tableCompData !== undefined &&
          orgValue !== "" &&
          orgValue !== undefined
        ) {
          if (tableCompData.hasOwnProperty("FacAncDetails")) {
            arr2 = tableCompData["FacAncDetails"];
            printConsole("Inside fieldsOnBlur useeffect arr2: ", arr2);
            setProviderTableData(arr2);
          }
        }
      }
    });

    // }
  };

  //Added by NG on 11/14/2023
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
  //Commented by NG

  /*const handleGridSelectChange = (index,selectedValue,evnt,triggeredFormName) => {
        console.log("Inside select change index: ",index);
        console.log("Inside select change selectedValue: ",selectedValue);
        console.log("Inside select change evnt: ",evnt);
        console.log("Inside select change trigeredFormName: ",triggeredFormName);
        let rowsInput = '';
        const { name } = evnt;


        if(triggeredFormName === 'LocationTable'){
            //console.log('Inside LocationTable');
            rowsInput = [...locationTableRowsData];
        }
        if(triggeredFormName === 'PayToTable'){
            //console.log('Inside PayToTable');
            rowsInput = [...payToTableRowsData];
        }
        if (triggeredFormName === "SpecialityTable") {
            //console.log('Inside SpecialityTable');
            rowsInput = [...specialityTableRowsData];
          }

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

        if(triggeredFormName === 'LocationTable'){
            setLocationTableRowsData(rowsInput);
        }
        if(triggeredFormName === 'PayToTable'){
            setPayToTableRowsData(rowsInput);
        }
        if (triggeredFormName === "SpecialityTable") {
            //Making subSpeciality dropdown reset whenever speciality changing
            //setSubSpecialityOptions({});
            // if (evnt.name='speciality')
            // {
            // rowsInput[index]["subSpeciality"] = { label: '', value: '' };
            // }
            //delete rowsInput[index]["subSpeciality"];

            console.log(" Inside select change rowsInput[index]",rowsInput[index]["subSpeciality"]);

            console.log(
              "Inside select change setSubSpecialityOptions: ",
              subSpecialityOptions
            );
            console.log(
              "Inside select change specialtyOptions: ",
              selectValues.specialtyOptions
            );
            console.log("Inside select change evnt.name: ", evnt.name);
            if (
              evnt.name == "speciality" &&
              selectValues.specialtyOptions &&
              selectedValue &&
              selectValues.specialtyOptions.length > 0
            ) {
              const foundOption = selectValues.specialtyOptions.find(
                (option) => option.speciality === selectedValue.value
              );
              if(foundOption)
              {
              if (
                foundOption.hsdCodeValue !== undefined &&
                foundOption.hsdCodeValue !== null &&
                "hsdCodeValue" in foundOption
              ) {
                // console.log(
                //   "Inside select change foundOption if: ",
                //   rowsInput[index]["hsdCode"]
                // );
                // console.log(
                //   "Inside select change foundOption.hsdCodeValue: ",
                //   foundOption.hsdCodeValue
                // );
                rowsInput[index]["hsdCode"] = foundOption.hsdCodeValue;
              } else {
                // alert("Corresponding HSD Code not found.");
                // delete rowsInput[index]['hsdCode'] ;
                rowsInput[index]["hsdCode"] = "";
              }
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
      console.log("Inside select change rowsInput01: ",rowsInput);
              setspecialityTableRowsData(rowsInput);
            }
            //Till here
            console.log("Inside select change rowsInput02: ",rowsInput);
            setspecialityTableRowsData(rowsInput);
          }


    }*/

  const modifyValidatedAddressRow = (index, data) => {
    // setLocationTableRowsData(prev => {
    //     prev[index] = data;
    //     return prev;
    // })
    setGridFieldTempState(data);
  };

  const modifyValidatedAddressPayToRow = (index, data) => {
    // setPayToTableRowsData(prev => {
    //     prev[index] = data;
    //     return prev;
    // })
    setGridFieldTempState(data);
  };

  const handleDateChange = (date, dateName) => {
    console.log("handleDateChange date: ", date);
    console.log("handleDateChange dateName: ", dateName);
    if (dateName === "dateOfBirth") {
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
  };

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

  const checkIfValueExistsInState = () => {
    let retVal = false;
    printConsole(
      "Inside checkIfValueExistsInState apiTestState: ",
      apiTestState
    );
    if (
      apiTestState.hasOwnProperty("legalEntityName") &&
      apiTestState.legalEntityName !== undefined &&
      apiTestState.legalEntityName.length > 0
    ) {
      retVal = true;
    }

    return retVal;
  };

  const saveFormData = (values) => {
    try {
      console.log("Inside saveFormData()");

      if (checkIfValueExistsInState()) {
        setButtonDisableFlag(true);

        // values.placeInDirectory = ((apiTestState.placeInDirectory!==undefined)?apiTestState.placeInDirectory.value:'Yes');
        // values.delegated = ((apiTestState.delegated!==undefined)?apiTestState.delegated.value:'');
        // values.contractId = ((apiTestState.contractId!==undefined)?apiTestState.contractId.value:'');

        let apiJson = {};
        let requestBody = { ...values };
        requestBody.userName = mastersSelector.hasOwnProperty("auth")
          ? mastersSelector.auth.hasOwnProperty("userName")
            ? mastersSelector.auth.userName
            : "system"
          : "system";
        console.log("save Form Data apiTestState ", apiTestState);

        requestBody = trimJsonValues(requestBody);
        console.log("Save Form Data requestBody: ", requestBody);
        requestBody.placeInDirectory =
          apiTestState.placeInDirectory !== undefined
            ? apiTestState.placeInDirectory.value
            : "";
        requestBody.delegated =
          apiTestState.delegated !== undefined
            ? apiTestState.delegated.value
            : "";
        requestBody.contractId =
          apiTestState.contractId !== undefined
            ? apiTestState.contractId.value
            : "";

        const mainWIObject = {};
        mainWIObject.legalEntityName = requestBody.legalEntityName;
        mainWIObject.npiId = requestBody.npiId;
        mainWIObject.transactionType = AncFacDemo.displayName;
        mainWIObject.caseStatus = "Open";
        mainWIObject.Field1 = requestBody.contractId;

        //Added on 2/9/23

        const flowId = credentialingConfigData["FlowId"];
        const stageId = credentialingConfigData["StageId"];
        const stageName = credentialingConfigData["StageName"];

        console.log(
          "Inside add provider create case master selector: ",
          mastersSelector
        );
        console.log(
          "Inside add provider create case username: ",
          mastersSelector.hasOwnProperty("auth")
            ? mastersSelector.auth.hasOwnProperty("userName")
              ? mastersSelector.auth.userName
              : "system"
            : "system"
        );
        mainWIObject.createdByName = mastersSelector.hasOwnProperty("auth")
          ? mastersSelector.auth.hasOwnProperty("userName")
            ? mastersSelector.auth.userName
            : "system"
          : "system";
        mainWIObject.flowId = flowId;
        mainWIObject.stageName = stageName;
        mainWIObject.stageId = stageId;
        mainWIObject.delegated = requestBody.delegated;
        mainWIObject.lockStatus = "N";

        //mainWIObject = trimJsonValues(mainWIObject);
        console.log("I am here");
        console.log("Main Workitem data: ", mainWIObject);

        apiJson["MainCaseTable"] = mainWIObject;
        apiJson["SelfServ_FaciAnci_Details"] = requestBody;

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

        //Till Here

        console.log("Case JSON Modification: ", apiJson);

        if (isSearchClicked) {
          //Newly Added by Nidhi Gupta 11/06/2023

          if (
            apiJson["SelfServ_FaciAnci_Details"].AddModification === true &&
            apiJson["SelfServ_Location_Grid"] === undefined
          ) {
            alert(
              "Atleast one Address entry is needed in order to Submit case."
            );
            setButtonDisableFlag(false);
            return;
          }
          //Newly Added by Nidhi Gupta 01/30/2024

          if (
            apiJson["SelfServ_FaciAnci_Details"].AddModification === true &&
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

          if (
            apiJson["SelfServ_FaciAnci_Details"].PayToModification === true &&
            apiJson["SelfServ_PayTo_Grid"] === undefined
          ) {
            alert(
              "Atleast one Pay to entry is needed in order to Submit case."
            );
            setButtonDisableFlag(false);
            return;
          }
          if (
            apiJson["SelfServ_FaciAnci_Details"].SpecModification === true &&
            apiJson["SelfServ_Speciality_Grid"] === undefined
          ) {
            alert(
              "Atleast one Speciality entry is needed in order to Submit case."
            );
            setButtonDisableFlag(false);
            return;
          }

          //Till Here
          customAxios
            .post("/generic/create", apiJson, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              console.log("Data saved successfully: ", res);
              const apiStat = res.data["CreateCase_Output"]["Status"];
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
                procDataState.caseNumber =
                  res.data["CreateCase_Output"]["CaseNo"];
                procDataState.decision = "Submit";
                procDataState.userName = mastersSelector.hasOwnProperty("auth")
                  ? mastersSelector.auth.hasOwnProperty("userName")
                    ? mastersSelector.auth.userName
                    : "system"
                  : "system";
                procDataState.formNames = AncFacDemo.displayName;

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
                          alert(
                            "Case created successfully: " +
                              res.data["CreateCase_Output"]["CaseNo"]
                          );
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
                          alert(
                            "Case created successfully: " +
                              res.data["CreateCase_Output"]["CaseNo"] +
                              " but error in uploading document"
                          );
                        }
                        submitCase(procData, navigateHome);
                      });
                  });
                } else {
                  alert(
                    "Case created successfully: " +
                      res.data["CreateCase_Output"]["CaseNo"]
                  );
                  submitCase(procData, navigateHome);
                }
              }
              //navigateHome();  //uncomment after testing
            })
            .catch((err) => {
              console.log("Caught in generic create api call: ", err.message);
              alert("Error occured in generic create api call.");
              setButtonDisableFlag(false);
            });
        } else {
          alert(
            "Please select case and populate the data before submittig the case."
          );
          setButtonDisableFlag(false);
          return;
        }
      } else {
        alert(
          "Please select case and populate the data before submittig the case."
        );
      }
    } catch (error) {
      printConsole("Caught in saveFormData error: ", error);
      alert("Error occured in saveFormData data.");
      setButtonDisableFlag(false);
    }
  };
  //Till Here
  const saveData = (values) => {
    console.log("Inside saveData");

    console.log("saveData Values: ", values);
    if (tabRef.current === "HomeView") {
      saveFormData(values);
    }

    if (tabRef.current === "DashboardView") {
      printConsole("Inside dashboard view before if : ", formikInitializeState);
      if (formikInitializeState) {
        printConsole("Inside dashboard view if : ", formikInitializeState);
        setFormikInitializeState(false);
      }
      setTimeout(() => {
        printConsole("Inside dashboard view timeout : ", formikInitializeState);
        updateFormData(values);
      }, 1000);
    }
  };

  /*function checkLengths() {
    if (specialityTableRowsData.length === 0) {
      return "At least 1 speciality row is important";
    }

    if (payToTableRowsData.length === 0) {
      return "At least 1 PaytoTable row is important";
    }
    if (locationTableRowsData.length === 0) {
      return "At least 1 Address row is important";
    }
    return null;
  }*/
  function filterData() {
    return caseData.data.filter((item) => item?.CaseID !== Number(prop.state.caseNumber));
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
      /*if (
        values?.delegated?.value === "Yes" &&
        callProcRef.current === "callProc"
      ) {
        const result = checkLengths();
        if (result !== null) {
          alert(result);
          return;
        }
      }*/
      printConsole("Inside updateFormData");
      setButtonDisableFlag(true);
      delete values.caseNumber;
      let requestBody = { ...values };

      // values.placeInDirectory = ((apiTestState.placeInDirectory!==undefined)?apiTestState.placeInDirectory.value:'Yes');
      // values.delegated = ((apiTestState.delegated!==undefined)?apiTestState.delegated.value:'');
      //gridDataRef.current.linearTable02 = trimJsonValues(values);

      requestBody.delegated =
        values.delegated.value !== undefined ? values.delegated.value : "";

      //requestBody.placeInDirectory = apiTestState.placeInDirectory !== undefined ? apiTestState.placeInDirectory.value : "";
      gridDataRef.current.linearTable02 = trimJsonValues(requestBody);

      console.log(" Update gridDataRef.current.linearTable02: ", values);
      const gridKeys = getTableDetails()["facAncLinear"].concat(
        getTableDetails()["gridTables"]
      );
      gridKeys.forEach((k) => {
        const newKey = k.split("~")[0];
        const oldKey = k.split("~")[1];
        gridDataRef.current = renameKey(gridDataRef.current, oldKey, newKey);
      });

      gridDataRef.current.caseNumber = prop.state.caseNumber;

      let validated = true;
      let saveType = callProcRef.current === "callProc" ? "SS" : "SE";

      if (validated || callProcRef.current !== "callProc") {
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

        if (!isDecisionDiscard && callProcRef.current === "callProc") {
          //Newly Added by Nidhi Gupta 11/06/2023
          //  console.log("gridDataRef.current: ",gridDataRef.current);
          //  console.log("gridDataRef.current isDecisionDiscard: ",isDecisionDiscard);
          if (
            gridDataRef.current.SelfServ_FaciAnci_Details.AddModification ===
              true &&
            (locationTableRowsData === undefined || locationTableRowsData.length ===0)
          ) {
            alert(
              "Atleast one Address entry is needed in order to Submit case."
            );
            setButtonDisableFlag(false);
            return;
          }
          if (
            gridDataRef.current.SelfServ_FaciAnci_Details.PayToModification ===
              true &&
            (payToTableRowsData === undefined || payToTableRowsData.length ===0)
          ) {
            alert(
              "Atleast one Pay to entry is needed in order to Submit case."
            );
            setButtonDisableFlag(false);
            return;
          }
          if (
            gridDataRef.current.SelfServ_FaciAnci_Details.SpecModification ===
              true &&
            (specialityTableRowsData === undefined || specialityTableRowsData.length ===0)
          ) {
            alert(
              "Atleast one Speciality entry is needed in order to Submit case."
            );
            setButtonDisableFlag(false);
            return;
          }
          //Till Here

          //Newly Added by Nidhi Gupta 01/30/2024
          if (
            gridDataRef.current.SelfServ_FaciAnci_Details.AddModification ===
              true &&
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

        if (Array.isArray(gridDataRef.current.SelfServ_Location_Grid)) {
          gridDataRef.current.SelfServ_Location_Grid.map((data) => {
            //console.log("After Hi data: ", data);
            data.languages = Array.isArray(data.languages)
              ? typeof data.languages !== "string"
                ? data.languages.map((el) => el.value).toString()
                : data.languages
              : "";
          });
        }
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
              updateDecision(prop, saveType, AncFacDemo.displayName);

              // let procInput = {};
              // procInput.input1 = 'testing';
              // procInput.input2 = AncFacDemo.displayName;
              // procInput.input3=prop.state.caseNumber;

              // customAxios.post('/updateQueueVariableProcedure',procInput,{headers:{'Authorization':`Bearer ${token}`}}).then((res) => {
              //     console.log("Update Queue Variable Proc output: ",res);
              //     if(res.status === 200){
              //         console.log("Update Queue Variable Proc executed successully");
              //     }
              // }).catch((err) => {

              //     console.log("Caught in update queue variable api call: " ,err.message);
              //     alert("Error occured in updating queue variables.");
              //     setButtonDisableFlag(false);
              // });
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
                navigateHome();
              }
            }
          })
          .catch((err) => {
            console.log("Caught in generic update api call: ", err.message);
            alert("Error occured in generic update api call.");
            setButtonDisableFlag(false);
          });
      }
    } catch (error) {
      printConsole("Caught in updateFormData error: ", error);
      alert("Error occured in updating data.");
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

  const saveGridData = (apiJson) => {
    const locationResponse = getGridDataValues(locationTableRowsData);
    const payToResponse = getGridDataValues(payToTableRowsData);
    const specialityResponse = getGridDataValues(specialityTableRowsData);
    if (locationResponse.length > 0) {
      apiJson["SelfServ_Location_Grid"] = locationResponse;
    }
    if (payToResponse.length > 0) {
      apiJson["SelfServ_PayTo_Grid"] = payToResponse;
    }
    if (specialityResponse.length > 0) {
      apiJson["SelfServ_Speciality_Grid"] = specialityResponse;
    }

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
        //console.log("data key : ",dataValue, " type: ", dataKeyType);
        if (dataKeys.includes("license") && dataValue === "expirationDate") {
          //console.log('----------------------dataKeyType----------------------', dataKeyType, dataValue, data[dataValue], data[dataValue].value);
        }

        if (dataKeyType === "object") {
          console.log("Inside Data Object if: ", dataObject);
          if (data[dataValue]) {
            if (data[dataValue].value) {
              if (data[dataValue].value instanceof Date) {
                //dataObject[dataValue] = data[dataValue].value.toLocaleDateString()
                dataObject[dataValue] = extractDate(data[dataValue].value);
              } else {
                dataObject[dataValue] = data[dataValue].value;
              }
            }

            //Added by Nidhi Gupta on 6/12/2023
            else if (data[dataValue].value == "") {
              console.log("xx Inside here");
              console.log("xx Inside here Object else if: ", dataObject);
              dataObject[dataValue] = "";
            } else {
              if (data[dataValue] instanceof Date) {
                // dataObject[dataValue] = data[dataValue].toLocaleDateString();
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
          console.log("Inside Not Data Object if: ", dataObject);
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

  const getGridData = (jsonObj) => {
    let gridObj = {};
    //console.log("GetGridData: ",jsonObj);
    Object.keys(jsonObj).map((key) => {
      gridObj[key] = { value: jsonObj[key], label: jsonObj[key] };
    });
    return gridObj;
  };

  const populateFormBasisOnType = () => {
    console.log("Inside populateFormBasisOnType tabref= ", tabRef);
    if (tabRef.current === "DashboardView") {
      return (
        <>
          <Tabs
            defaultActiveKey="AncFacDemo"
            id="justify-tab-example"
            className="mb-3"
            justify
          >
            <Tab eventKey="AncFacDemo" title="Ancillary/Facility Modification">
              {populateForm()}
            </Tab>
            <Tab eventKey="Decision" title="Decision">
              <DecisionTab
                lockStatus={
                  prop.state.lockStatus === undefined ||
                  prop.state.lockStatus === ""
                    ? "N"
                    : prop.state.lockStatus
                }
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

  //Added by Nidhi on 3/27/2023
  const handleSelectChange = (evnt, index, data) => {
    console.log("quesAns Dropdown selectedValue: ", evnt.value);
    //data.response = evnt.value;
    data.response = { label: evnt.value, value: evnt.value };
    //console.log("xx data:",data);
    quesAnsListJson[index] = data;
    //console.log("xx quesAnsListJson:",quesAnsListJson[index]);
    setQuesAnsListJson([...quesAnsListJson]);
    console.log("Inside handleSelectChange quesAnsListJson: ", quesAnsListJson);
  };
  // const handleLinearSelectChange = (selectValue, evnt) => {
  //     console.log("Select value: ",selectValue);
  //     const { name } = evnt;
  //         setApiTestState({...apiTestState,[name] : selectValue});
  // }

  //07062023
  function hasOwnPropertyCaseInsensitive(obj, property) {
    var props = [];
    for (var i in obj) if (obj.hasOwnProperty(i)) props.push(i);
    var prop;
    while ((prop = props.pop()))
      if (prop.toLowerCase() === property.toLowerCase()) return true;
    return false;
  }

  function getKeyCase(obj, key) {
    const re = new RegExp(key, "i");
    return Object.keys(obj).reduce((result, key) => {
      if (!result) {
        return key.match(re) || undefined;
      } else {
        return result;
      }
    }, undefined);
  }

  const callGenericGet = () => {
    console.log("caseUnlockState: ", caseUnlockState);
    //const checkedCase=caseUnlockState.filter()

    //Commented by Harshit
    //const numberOfChecks = caseUnlockState?.filter(ele => ele.isChecked);

    //console.log("caseUnlockState.length: ", caseUnlockState.length);
    //console.log("caseUnlockState.CONTRACTID: ", caseUnlockState[0].CONTRACTID);
    //console.log("caseUnlockState.PROVIDERID: ", caseUnlockState[0].PROVIDERID);

    //Commented by Harshit
    /*if(numberOfChecks.length==0 || caseUnlockState==undefined)
    {
        alert("Please select case first for searching.")
        //settingProviderData();
    }*/
    if (caseUnlockState !== -1) {
      const numberOfChecks = providerTableData[caseUnlockState];
      //apiTestState.Modification=true;
      console.log("Inside generic get numberOfChecks: ", numberOfChecks);
      if (
        numberOfChecks &&
        numberOfChecks.FACIANCISTATUS &&
        numberOfChecks.FACIANCISTATUS.toLowerCase() == "terminated"
      ) {
        alert(
          "Data can't be populated as Ancillary/Facility Status is Terminated. Please choose Active cases."
        );
      } else {
        //console.log("apiTestState.contractId: ",apiTestState.contractId.value);
        let getApiJson = {};
        if (apiTestState.PayToModification == true) {
          getApiJson["tableNames"] = getTableDetails()[
            "pdmAncFacLinear"
          ].concat(getTableDetails()["pdmPayToTable"]);
        }
        if (apiTestState.AddModification == true) {
          getApiJson["tableNames"] = getTableDetails()[
            "pdmAncFacLinear"
          ].concat(getTableDetails()["pdmAddressTable"]);
        }

        if (apiTestState.SpecModification == true) {
          getApiJson["tableNames"] = getTableDetails()[
            "pdmAncFacLinear"
          ].concat(getTableDetails()["pdmSpecialityTable"]);
        }

        if (apiTestState.DemoModification == true) {
          getApiJson["tableNames"] = getTableDetails()["pdmAncFacLinear"];
        }
        //getApiJson['tableNames'] =  getTableDetails()['pdmAncFacLinear'].concat(getTableDetails()['pdmAddressTable']);
        // getTableDetails()['pdmAddressTable'];
        //getApiJson['whereClause'] = {'PROVIDERID':1487775797, 'CONTRACTID': 'CAZ001174'};

        //Commented by Harshit
        //getApiJson['whereClause'] = {'CONTRACTID':numberOfChecks[0].CONTRACTID, 'PROVIDERID': numberOfChecks[0].PROVIDERID};

        if (
          numberOfChecks.CONTRACTID != undefined &&
          numberOfChecks.PROVIDERID != undefined
        ) {
          getApiJson["whereClause"] = {
            CONTRACTID: numberOfChecks.CONTRACTID,
            PROVIDERID: numberOfChecks.PROVIDERID,
          };
          console.log("getApiJson: ", getApiJson);
          customAxios
            .post("/generic/get", getApiJson, {
              headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
              console.log("Generic get api response: ", res);

              const apiStat = res.data.Status;
              if (apiStat === -1) {
                alert("Error in fetching data.");
                //settingProviderData();
              }
              if (apiStat === 0) {
                alert("Data populated successfully.");
                setIsSearchClicked(true);
                //settingProviderData();

                //apiTestState.Modification=true;
                //if(apiTestState.Modification!==undefined?apiTestState.Modification:true);
                const respKeys = Object.keys(res.data["data"]);
                const respData = res.data["data"];
                respKeys.forEach((k) => {
                  console.log("Response key: ", k);
                  if (k === "linearTable") {
                    let apiResponse = {};
                    let apiResponseNew = {};
                    if (respData[k][0] !== undefined) {
                      apiResponse = respData[k][0];
                      //console.log("Hi apiResponse xx: ",apiResponse);
                      //prop.state.dbaName= apiResponse.DBANAME;
                      //Newly Added on 7/17/23
                      let linearFieldArray = [
                        "legalEntityName",
                        "dbaName",
                        "npiId",
                        "medicareId",
                        "medicaidId",
                        "emailId",
                      ];

                      for (let field in linearFieldArray) {
                        //console.log("field Nidhi02: ",field);
                        if (
                          hasOwnPropertyCaseInsensitive(
                            apiResponse,
                            linearFieldArray[field]
                          )
                        ) {
                          console.log(
                            "field xx03: ",
                            apiResponse,
                            linearFieldArray[field]
                          );
                          apiResponseNew[linearFieldArray[field]] =
                            apiResponse[
                              getKeyCase(apiResponse, linearFieldArray[field])
                            ];
                        }
                      }
                      // if ( hasOwnPropertyCaseInsensitive(apiResponse , 'NPIID')) {
                      //     apiResponseNew.caqhNpiId = apiResponse[getKeyCase(apiResponse,'NPIID')] ;
                      //   }

                      //Newly Added on 07/28/2023
                      let linearFieldSelectArray = [
                        "placeInDirectory",
                        "delegated",
                        "contractId",
                      ];
                      for (let field in linearFieldSelectArray) {
                        if (
                          hasOwnPropertyCaseInsensitive(
                            apiResponse,
                            linearFieldSelectArray[field]
                          )
                        ) {
                          console.log(
                            "field xx03: ",
                            apiResponse,
                            linearFieldSelectArray[field]
                          );
                          apiResponseNew[linearFieldSelectArray[field]] = {
                            label:
                              apiResponse[
                                getKeyCase(
                                  apiResponse,
                                  linearFieldSelectArray[field]
                                )
                              ],
                            value:
                              apiResponse[
                                getKeyCase(
                                  apiResponse,
                                  linearFieldSelectArray[field]
                                )
                              ],
                          };
                        }
                      }

                      if (apiTestState.PayToModification == true) {
                        apiResponseNew.PayToModification = true;
                      }
                      if (apiTestState.AddModification == true) {
                        apiResponseNew.AddModification = true;
                      }

                      if (apiTestState.SpecModification == true) {
                        apiResponseNew.SpecModification = true;
                      }

                      if (apiTestState.DemoModification == true) {
                        apiResponseNew.DemoModification = true;
                      }

                      apiResponseNew = convertToDateObj(apiResponseNew);
                      setApiTestState(apiResponseNew);
                      setFormikInitializeState(true);
                    }
                  }

                  if (k === "pdmAddress") {
                    //console.log("hi ",k)
                    let apiResponseArray = [];
                    respData[k].forEach((js) => {
                      const apiResponse = js;
                      let apiResponseNew = {};

                      let gridFieldArray = [
                        "locationName",
                        "stateValue",
                        "zipCode",
                        "officeFaxNumber",
                        "officePhoneNumber",
                        "languages",
                        "npi",
                        "addressType",
                        "address1",
                        "address2",
                        "city",
                        "county",
                        "tddPhone",
                        "telemedicine",
                      ];
                      for (let field in gridFieldArray) {
                        //console.log("field Nidhi02: ",field);
                        if (
                          hasOwnPropertyCaseInsensitive(
                            apiResponse,
                            gridFieldArray[field]
                          )
                        ) {
                          apiResponseNew[gridFieldArray[field]] =
                            apiResponse[
                              getKeyCase(apiResponse, gridFieldArray[field])
                            ];
                        }
                      }

                      //Newly Added on 07/28/2023
                      let gridFieldSelectArray = [
                        "electronicHealthRecord",
                        "publicTransportation",
                        "handicapAccess",
                        "tddHearing",
                        "telemedicine",
                        "placeInDirectory",
                      ];
                      for (let field in gridFieldSelectArray) {
                        if (
                          hasOwnPropertyCaseInsensitive(
                            apiResponse,
                            gridFieldSelectArray[field]
                          )
                        ) {
                          if (
                            apiResponse[
                              getKeyCase(
                                apiResponse,
                                gridFieldSelectArray[field]
                              )
                            ] === "Y"
                          ) {
                            apiResponseNew[gridFieldSelectArray[field]] = {
                              label: "Yes",
                              value:
                                apiResponse[
                                  getKeyCase(
                                    apiResponse,
                                    gridFieldSelectArray[field]
                                  )
                                ],
                            };
                          } else if (
                            apiResponse[
                              getKeyCase(
                                apiResponse,
                                gridFieldSelectArray[field]
                              )
                            ] === "N"
                          ) {
                            apiResponseNew[gridFieldSelectArray[field]] = {
                              label: "No",
                              value:
                                apiResponse[
                                  getKeyCase(
                                    apiResponse,
                                    gridFieldSelectArray[field]
                                  )
                                ],
                            };
                          }
                        }
                      }
                      apiResponseNew.rowNumber = apiResponseArray.length + 1;
                      apiResponseArray.push(apiResponseNew);
                      console.log(
                        "locationTableRowsData apiResponse: ",
                        apiResponseNew
                      );
                    });

                    setLocationTableRowsData(apiResponseArray);
                  }

                  if (k === "pdmPayTo") {
                    // console.log("hi ",k)
                    let apiResponseArray = [];
                    respData[k].forEach((js) => {
                      const apiResponse = js;
                      let apiResponseNew = {};

                      let gridFieldArray = [
                        "taxId",
                        "locationName",
                        "address1",
                        "address2",
                        "city",
                        "county",
                        "stateValue",
                        "zipCode",
                        "payToNpi",
                      ];
                      for (let field in gridFieldArray) {
                        console.log("field Nidhi02: ", field);
                        if (
                          hasOwnPropertyCaseInsensitive(
                            apiResponse,
                            gridFieldArray[field]
                          )
                        ) {
                          apiResponseNew[gridFieldArray[field]] =
                            apiResponse[
                              getKeyCase(apiResponse, gridFieldArray[field])
                            ];
                        }
                      }
                      apiResponseNew.rowNumber = apiResponseArray.length + 1;
                      apiResponseArray.push(apiResponseNew);
                      console.log(
                        "payToTableRowsData apiResponse: ",
                        apiResponseNew
                      );
                    });

                    setPayToTableRowsData(apiResponseArray);
                  }

                  if (k === "pdmSpeciality") {
                    console.log("pdmSpeciality ", k);
                    let apiResponseArray = [];
                    respData[k].forEach((js) => {
                      const apiResponse = js;
                      let apiResponseNew = {};

                      let gridFieldArray = [
                        "speciality",
                        "subSpeciality",
                        "hsdCode",
                        "taxonomyCode",
                      ];
                      for (let field in gridFieldArray) {
                        console.log("pdmSpeciality field Nidhi02: ", field);
                        if (
                          hasOwnPropertyCaseInsensitive(
                            apiResponse,
                            gridFieldArray[field]
                          )
                        ) {
                          apiResponseNew[gridFieldArray[field]] =
                            apiResponse[
                              getKeyCase(apiResponse, gridFieldArray[field])
                            ];
                        }
                      }

                      //
                      if (
                        hasOwnPropertyCaseInsensitive(
                          apiResponse,
                          "TAXONOMYDESCRIPTION"
                        )
                      ) {
                        apiResponseNew.taxonomyDesc =
                          apiResponse[
                            getKeyCase(apiResponse, "TAXONOMYDESCRIPTION")
                          ];
                      }
                      if (
                        hasOwnPropertyCaseInsensitive(
                          apiResponse,
                          "BOARDCERTIFICATE"
                        )
                      ) {
                        // apiResponseNew.boardCerti = apiResponse[getKeyCase(apiResponse,'BOARDCERTIFICATE')];
                        if (
                          apiResponse[
                            getKeyCase(apiResponse, "BOARDCERTIFICATE")
                          ] === "Y"
                        ) {
                          apiResponseNew.boardCerti = {
                            label: "Yes",
                            value:
                              apiResponse[
                                getKeyCase(apiResponse, "PRIMARYSPECIALITY")
                              ],
                          };
                        } else if (
                          apiResponse[
                            getKeyCase(apiResponse, "BOARDCERTIFICATE")
                          ] === "N"
                        ) {
                          apiResponseNew.boardCerti = {
                            label: "No",
                            value:
                              apiResponse[
                                getKeyCase(apiResponse, "PRIMARYSPECIALITY")
                              ],
                          };
                        }
                      }
                      if (
                        hasOwnPropertyCaseInsensitive(
                          apiResponse,
                          "TAXONOMYGROUP"
                        )
                      ) {
                        apiResponseNew.taxonomyGrp =
                          apiResponse[getKeyCase(apiResponse, "TAXONOMYGROUP")];
                      }
                      if (
                        hasOwnPropertyCaseInsensitive(
                          apiResponse,
                          "PRIMARYSPECIALITY"
                        )
                      ) {
                        //apiResponseNew.specPrimary = apiResponse[getKeyCase(apiResponse,'PRIMARYSPECIALITY')];
                        if (
                          apiResponse[
                            getKeyCase(apiResponse, "PRIMARYSPECIALITY")
                          ] === "Y"
                        ) {
                          apiResponseNew.specPrimary = {
                            label: "Yes",
                            value:
                              apiResponse[
                                getKeyCase(apiResponse, "PRIMARYSPECIALITY")
                              ],
                          };
                        } else if (
                          apiResponse[
                            getKeyCase(apiResponse, "PRIMARYSPECIALITY")
                          ] === "N"
                        ) {
                          apiResponseNew.specPrimary = {
                            label: "No",
                            value:
                              apiResponse[
                                getKeyCase(apiResponse, "PRIMARYSPECIALITY")
                              ],
                          };
                        }
                      }
                      //

                      let gridFieldSelectArray = ["specPrimary", "pcp"];
                      for (let field in gridFieldSelectArray) {
                        if (
                          hasOwnPropertyCaseInsensitive(
                            apiResponse,
                            gridFieldSelectArray[field]
                          )
                        ) {
                          if (
                            apiResponse[
                              getKeyCase(
                                apiResponse,
                                gridFieldSelectArray[field]
                              )
                            ] === "Y"
                          ) {
                            apiResponseNew[gridFieldSelectArray[field]] = {
                              label: "Yes",
                              value:
                                apiResponse[
                                  getKeyCase(
                                    apiResponse,
                                    gridFieldSelectArray[field]
                                  )
                                ],
                            };
                          } else if (
                            apiResponse[
                              getKeyCase(
                                apiResponse,
                                gridFieldSelectArray[field]
                              )
                            ] === "N"
                          ) {
                            apiResponseNew[gridFieldSelectArray[field]] = {
                              label: "No",
                              value:
                                apiResponse[
                                  getKeyCase(
                                    apiResponse,
                                    gridFieldSelectArray[field]
                                  )
                                ],
                            };
                          }
                        }
                      }
                      apiResponseNew.rowNumber = apiResponseArray.length + 1;
                      apiResponseArray.push(apiResponseNew);
                      console.log(
                        "specialityTableRowsData apiResponse gridFieldSelectArray: ",
                        apiResponseNew
                      );
                    });

                    setspecialityTableRowsData(apiResponseArray);
                  }
                });
              }
            })

            .catch((err) => {
              console.log("Caught in error: ", err.message);
            });
        }
      }
    } else {
      //Commented by Harshit
      /*console.log("else numberOfChecks ",numberOfChecks)
        console.log("else numberOfChecks.length ",numberOfChecks.length)
        alert("Please select one case only.")*/
      alert("Please select case first.");
      //settingProviderData();
    }
  };

  const checkHandler = (event, index, data) => {
    data.response = event.target.checked;
    quesAnsListJson[index] = data;
    setQuesAnsListJson([...quesAnsListJson]);
    //Console.log("Inside checkHandler quesAnsListJson: ",quesAnsListJson);
  };

  //till here 04

  //Added Newly by Nidhi Gupta on 08/31/2023
  const handleAddModificationChange = (isChecked) => {
    if (isChecked) {
      setIsSearchClicked(false);
      //initState
      setApiTestState([]);
      setApiTestState({
        AddModification: true,
        PayToModification: false,
        SpecModification: false,
        DemoModification: false,
        legalEntityName: "",
        npiId: "",
        medicareId: "",
        medicaidId: "",
        emailId: "",
        delegated: "",
        dbaName: "",
        contractId: "",
        placeInDirectory: "",
        //pdmLegalEN:""
      });
      setLocationTableRowsData([]);
      setPayToTableRowsData([]);
      setspecialityTableRowsData([]);
      setProviderTableData([]);
      falseExtraChecked();
      setCaseUnlockState(-1);

      //10/25/2023
      //console.log("setApiLegalENState address: ",apiLegalENState)

      setApiLegalENState({
        ...apiLegalENState,
        pdmLegalEN: "",
      });

      //till here
    } else {
      setApiTestState({
        AddModification: false,
        SpecModification: apiTestState.SpecModification,
        PayToModification: apiTestState.PayToModification,
        DemoModification: apiTestState.DemoModification,
      });
    }
  };

  const handleDemoModificationChange = (isChecked) => {
    if (isChecked) {
      setIsSearchClicked(false);
      //initState
      setApiTestState([]);
      setApiTestState({
        AddModification: false,
        PayToModification: false,
        SpecModification: false,
        DemoModification: true,
        legalEntityName: "",
        npiId: "",
        medicareId: "",
        medicaidId: "",
        emailId: "",
        delegated: "",
        dbaName: "",
        contractId: "",
        placeInDirectory: "",
        //pdmLegalEN:""
      });
      setLocationTableRowsData([]);
      setPayToTableRowsData([]);
      setspecialityTableRowsData([]);
      setProviderTableData([]);
      falseExtraChecked();
      setCaseUnlockState(-1);

      //10/25/2023
      //console.log("setApiLegalENState address: ",apiLegalENState)

      setApiLegalENState({
        ...apiLegalENState,
        pdmLegalEN: "",
      });

      //till here
    } else {
      setApiTestState({
        AddModification: apiTestState.AddModification,
        SpecModification: apiTestState.SpecModification,
        PayToModification: apiTestState.PayToModification,
        DemoModification: false,
      });
    }
  };

  const handlePayToModificationChange = (isChecked) => {
    if (isChecked) {
      setIsSearchClicked(false);

      setApiTestState({
        AddModification: false,
        PayToModification: true,
        SpecModification: false,
        DemoModification: false,
        legalEntityName: "",
        npiId: "",
        medicareId: "",
        medicaidId: "",
        emailId: "",
        delegated: "",
        dbaName: "",
        contractId: "",
        placeInDirectory: "",
        //pdmLegalEN:''
      });
      setLocationTableRowsData([]);
      setPayToTableRowsData([]);
      setspecialityTableRowsData([]);
      setProviderTableData([]);
      falseExtraChecked();
      setCaseUnlockState(-1);
      //10/25/2023
      //console.log("setApiLegalENState PayTo: ",apiLegalENState)

      setApiLegalENState({
        ...apiLegalENState,
        pdmLegalEN: "",
      });

      //till here
    } else {
      setApiTestState({
        AddModification: apiTestState.AddModification,
        PayToModification: false,
        SpecModification: apiTestState.SpecModification,
        DemoModification: apiTestState.DemoModification,
      });
    }
  };

  const handleSpecModificationChange = (isChecked) => {
    if (isChecked) {
      setIsSearchClicked(false);

      //initState
      //setApiTestState([]);

      setApiTestState({
        AddModification: false,
        PayToModification: false,
        SpecModification: true,
        DemoModification: false,
        legalEntityName: "",
        npiId: "",
        medicareId: "",
        medicaidId: "",
        emailId: "",
        delegated: "",
        dbaName: "",
        contractId: "",
        placeInDirectory: "",
        //pdmLegalEN:''
      });
      setLocationTableRowsData([]);
      setPayToTableRowsData([]);
      setspecialityTableRowsData([]);
      setProviderTableData([]);
      falseExtraChecked();
      setCaseUnlockState(-1);

      //console.log("setApiOrgState address: ",apiOrgState)

      setApiLegalENState({
        ...apiLegalENState,
        pdmLegalEN: "",
      });
    } else {
      //alert("Your populated data will be gone. Are you sure you want to change your request?");

      setApiTestState({
        PayToModification: apiTestState.PayToModification,
        AddModification: apiTestState.AddModification,
        DemoModification: apiTestState.DemoModification,
        SpecModification: false,
      });
    }
  };

  //Till here

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
  //Call this function on submit button click when form is opened from dashboard

  const formikFieldsOnChange = (evnt, setFieldValue, field) => {
    let value = evnt.target.value || "";
    //value = value.toUpperCase().trim();
    value = value.toUpperCase();
    printConsole("Inside organization Name onCHange: ", value);
    setFieldValue(field.name, value);
  };

  const populateForm = () => {
    //console.log("Inside populateForm")
    console.log("selectValues.agesSeenArray:", selectValues.agesSeenArray);
    console.log(
      "selectValues.stateOptionsLinear:",
      selectValues.stateOptionsLinear
    );
    return (
      <div className="col-xs-12">
        <div
          className="accordion AncFacDemoLabel"
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
                                To modify Ancillary/Facility Address, please
                                provide Legal Entity Name and select
                                Ancillary/Facility Address Modification Switch.
                                Review all information to confirm the accuracy.
                              </label>
                              {/* <label id="instructionPointOne" style={{fontSize:"12px",fontFamily:"'Open Sans', sans-serif"}}>For Providers want to use CAQH retrieval, please provide your CAQH ID and last 4 digits of SSN then, click the “CAQH Data Retrieval” button.</label> */}
                              {/* <label id="instructionPointTwo" style={{fontSize:"12px",fontFamily:"'Open Sans', sans-serif"}}>2) For Providers want to pull their information from NPPES, please provide your NPI and click the “NPPES Data Retrieval” button.</label> */}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {prop.state.formView === "HomeView" ||
                    prop.state.formView === "DashboardHomeView" ? (
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
                            Provider/ PayTo Address Modification
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseAddress"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Address"
                        >
                          <div className="accordion-body">
                            <div className="row">
                              <div className="col-xs-6 col-md-4">
                                <label htmlFor="medicaidSwitch">
                                  Ancillary/Facility Address Modification
                                </label>
                                <br />
                                <Switch
                                  id="addModificationSwitch"
                                  name="addModification"
                                  //  onChange={isChecked => {
                                  //     if(caseUnlockState !== -1){
                                  //         setCaseUnlockState(-1);
                                  //     }
                                  //     if(formikInitializeState){
                                  //         setFormikInitializeState(false);
                                  //     }
                                  //     setApiTestState({
                                  //         ...apiTestState,
                                  //         AddModification: isChecked
                                  //     });
                                  // }}

                                  onChange={handleAddModificationChange}
                                  checked={
                                    apiTestState.AddModification !== undefined
                                      ? apiTestState.AddModification
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
                              </div>

                              {/* Added Newly by Nidhi Gupta on 08/29/2023 */}
                              <div className="col-xs-6 col-md-4">
                                <label htmlFor="medicaidSwitch">
                                  Ancillary/Facility PayTo Modification
                                </label>
                                <br />
                                <Switch
                                  id="payToModificationSwitch"
                                  name="payToModification"
                                  onChange={handlePayToModificationChange}
                                  //  onChange={isChecked => {
                                  //     if(caseUnlockState !== -1){
                                  //         setCaseUnlockState(-1);
                                  //     }
                                  //     if(formikInitializeState){
                                  //         setFormikInitializeState(false);
                                  //     }

                                  //     setApiTestState({
                                  //         ...apiTestState,
                                  //         PayToModification: isChecked
                                  //     });
                                  // }}
                                  checked={
                                    apiTestState.PayToModification !== undefined
                                      ? apiTestState.PayToModification
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
                              </div>

                              {/* Till Here */}
                              {prop.state.formView === "DashboardHomeView" ? (
                                <div className="col-xs-6 col-md-4">
                                  <label htmlFor="medicaidSwitch">
                                    Ancillary/Facility Specialty Modification
                                  </label>
                                  <br />
                                  <Switch
                                    id="specModificationSwitch"
                                    name="specModification"
                                    onChange={handleSpecModificationChange}
                                    checked={
                                      apiTestState.SpecModification !==
                                      undefined
                                        ? apiTestState.SpecModification
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
                                </div>
                              ) : (
                                <div></div>
                              )}

                              {/* Newly added NG 11/30/2023 */}

                              {/* {(prop.state.formView === "DashboardHomeView") ?
                                          <div className="col-xs-6 col-md-4">
                                         <label htmlFor="medicaidSwitch">Demographic Modification</label>
                                        <br/>
                                             <Switch
                                             id="demoModificationSwitch"
                                             name="demoModification"
                                             onChange={handleDemoModificationChange}

                                            checked={(apiTestState.DemoModification!==undefined)?apiTestState.DemoModification:false}
                                            uncheckedIcon={false}
                                            checkedIcon={false}
                                            disabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                            />


                                          </div>:<div></div>} */}

                              {/* till here */}
                            </div>
                            <br />
                            <div className="row my-2">
                              {(apiTestState.AddModification == true ||
                                apiTestState.PayToModification == true ||
                                apiTestState.SpecModification == true ||
                                apiTestState.DemoModification == true) &&
                              prop.state.formView === "DashboardHomeView" ? (
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
                                      name="pdmLegalEN"
                                      isDisabled={
                                        tabRef.current === "DashboardView" &&
                                        prop.state.lockStatus !== undefined &&
                                        prop.state.lockStatus === "Y"
                                          ? true
                                          : false
                                      }
                                      className="basic-multi-select"
                                      options={distinctLegalEN}
                                      //options={[{label:selectValues.agesSeenArray, value:selectValues.agesSeenArray}]}

                                      id="pdmLegalENDropdown"
                                      isMulti={false}
                                      onChange={(selectValue, event) =>
                                        handleLinearSelectChange(
                                          selectValue,
                                          event
                                        )
                                      }
                                      value={apiLegalENState.pdmLegalEN}
                                      placeholder="Please choose Legal Entity Name"
                                      //   isClearable
                                      isSearchable={
                                        document.documentElement.clientHeight >
                                        document.documentElement.clientWidth
                                          ? false
                                          : true
                                      }
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div></div>
                              )}

                              {(apiTestState.AddModification == true ||
                                apiTestState.PayToModification == true ||
                                apiTestState.SpecModification == true ||
                                apiTestState.DemoModification == true) &&
                              (prop.state.formView === "HomeView" ||
                                prop.state.formView === "DashboardHomeView") ? (
                                <div className="col-xs-6">
                                  <TableComponent
                                    columnName={providerColumnNames}
                                    rowValues={providerTableData}
                                    showCheckBox={showGridCheckbox}
                                    navigateToForm={navigateToForm}
                                    handleCheckBoxChange={handleCheckBoxChange}
                                    makeLink={false}
                                    //Added by Nidhi Gupta on 10/18/2023
                                    radioFlag={true}
                                    handleRadioChange={handleRadioChange}

                                    //Till Here
                                  />
                                </div>
                              ) : (
                                <div></div>
                              )}

                              {apiTestState.AddModification == true ||
                              apiTestState.PayToModification == true ||
                              apiTestState.SpecModification == true ||
                              apiTestState.DemoModification == true ? (
                                <div
                                  className="col-xs-6 col-md-4"
                                  style={{
                                    textAlign: "right",
                                    marginLeft: "270px",
                                  }}
                                >
                                  <button
                                    type="button"
                                    className="btn btn-outline-primary btnStyle"
                                    onClick={() => callGenericGet()}
                                    //   style={{marginLeft:"10px"}}
                                  >
                                    Populate Data
                                  </button>
                                </div>
                              ) : (
                                <div></div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}

                    {apiTestState.AddModification == true ||
                    apiTestState.PayToModification == true ||
                    apiTestState.SpecModification == true ||
                    apiTestState.DemoModification == true ? (
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
                            Ancillary/Facility Information
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
                              <div className="row"></div>
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
                                        disabled={true}
                                        {...field}
                                        //   onBlur={(event)=>{fieldsOnBlur(event)}}
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
                                          apiTestState.AddModification == true
                                            ? false
                                            : true
                                        }
                                        {...field}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field
                                          )
                                        }
                                        // onBlur={()=>{
                                        //   //console.log("Hi OnBlur chalra h");
                                        //   prop.state.dbaName = values.dbaName !== undefined ? values.dbaName:''

                                        // } }
                                        onBlur={() => {
                                          setFieldValue(
                                            "dbaName",
                                            field.value !== undefined
                                              ? field.value
                                              : ""
                                          );
                                        }}
                                        value={convertToCase(field.value)}
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
                                <Field name="npiId">
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

                                        disabled={true}
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
                                        disabled={true}
                                        {...field}
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
                                        disabled={true}
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
                                  isDisabled={true}
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
                                        disabled={true}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        //onChange={(e) => formikFieldsOnChange(e,setFieldValue,field)}
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
                              <div className="col-xs-6 col-md-4">
                                {/* <Field name="delegated">
													{({
														field, // { name, value, onChange, onBlur }
														form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
														meta,
													}) => ( */}
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
                                    name="delegated"
                                    //name = {field.name}
                                    isClearable
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={[
                                      { label: "Yes", value: "Yes" },
                                      { label: "No", value: "No" },
                                    ]}
                                    id="delegatedDropdown"
                                    isMulti={false}
                                    //onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                                    //onChange={(selectValue,event)=>(setFieldValue(field.name, selectValue))}
                                    value={apiTestState.delegated}
                                    //value={field.value}
                                    placeholder="Delegated"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                  {/* {meta.touched && meta.error && (
                                                    <div className="invalid-feedback" style={{display:'block'}}>{meta.error}</div>
                                                )} */}
                                </div>
                                {/* )}
                                             </Field>
                                             <ErrorMessage
                                                        component="div"
                                                        name="delegated"
                                                        className="invalid-feedback"
                                                /> */}
                              </div>

                              {/* ): (<div/>)} */}

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
                                    name="contractId"
                                    isDisabled={true}
                                    isClearable
                                    className="basic-multi-select"
                                    options={selectValues.contractIdOptions}
                                    id="contractIdDropdown"
                                    isMulti={false}
                                    //onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                                    value={apiTestState.contractId}
                                    //   defaultValue={{ label: 'Yes', value: 'Yes' }}
                                    placeholder="Contract Id"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div></div>
                    )}
                  </fieldset>

                  {(apiTestState.AddModification == true && isSearchClicked) ||
                  (apiTestState.AddModification == true &&
                    prop.state.formView === "DashboardView") ? (
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
                          Ancillary/Facility Address
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
                                calledFormName={AncFacDemo.validate}
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
                                transactionType={AncFacDemo.displayName}
                              ></LocationTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {/* //Newly Added by Nidhi Gupta on 08/29/2023 */}
                  {(apiTestState.PayToModification == true &&
                    isSearchClicked) ||
                  (apiTestState.PayToModification == true &&
                    prop.state.formView === "DashboardView") ? (
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
                          PayTo Address
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
                                calledFormName={AncFacDemo.validate}
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
                              ></PayToTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {/* //Till Here */}

                  {/* //Newly Added by Nidhi Gupta on 08/29/2023 */}
                  {(apiTestState.SpecModification == true && isSearchClicked) ||
                  (apiTestState.SpecModification == true &&
                    prop.state.formView === "DashboardView") ? (
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
                          Speciality
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
                              <SpecialityTable
                                specialityTableRowsData={
                                  specialityTableRowsData
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
                                handleGridOnBlur={handleGridOnBlur}
                                handleSelectSpecialityOnBlur={
                                  handleSelectSpecialityOnBlur
                                }
                                fetchAutoPopulate={fetchAutoPopulate}
                                subSpecialityOptions={subSpecialityOptions}
                              ></SpecialityTable>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div></div>
                  )}

                  {/* //Till Here */}

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
                        handleSubmit(event);
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
      console.log("Inside callFormSubmit");
    }

    if (evnt.target.name == "saveExit") {
      callProcRef.current = "notCallProc";
    }
    document.getElementById("mainFormSubmit").click();
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
                  Ancillary/Facility Modification
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
                // onClick={()=>{
                //     addRoster(caqhModal.id);
                //     setCaqhModal({id:null, header:null, body:null, show:false});
                // }}
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
