import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Multiselect from "multiselect-react-dropdown";
import FooterComponent from "../../../Components/FooterComponent";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import TableComponent from "../../../util/TableComponent";
import { baseURL } from "../../../api/baseURL";
import viewDataLogo from "../../../Images/viewDataLogo.png";
import ReactDatePicker from "react-datepicker";
import Select, { components } from "react-select";
import { useAxios } from "../../../api/axios.hook";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import ReferenceTab from "../../../WorkItemDashboard/ReferenceTab";
import { Formik, Field, ErrorMessage } from "formik";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import "../TileFormsCss/groupTermination.css";
import * as Yup from "yup";

export default function GroupTermination() {
  const navigate = useNavigate();
  const [buttonDisableFlag, setButtonDisableFlag] = useState(false);
  const caseData = useSelector((store) => store.dashboardNavigationState);
  const dispatch = useDispatch();
  const navigateHome = async () => {
    console.log("Inside navigate Home");
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

  const stateRef = React.createRef();
  const { customAxios } = useAxios();

  let prop = useLocation();
  console.log("PropData", prop);

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
    emailId: "",
  };

  const facAncInitState = {
    legalEntityName: "",
    dbaName: "",
    npiId: "",
    medicareId: "",
    medicaidId: "",
    emailId: "",
  };

  const [selectedType, setSelectedType] = useState();
  const [selectedState, setSelectedState] = useState([]);
  const [formData, setFormData] = useState(initialState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [providerTableData, setProviderTableData] = useState([]);
  const [facilityAncillaryTableData, setFacilityAncillaryTableData] = useState(
    [],
  );
  const token = useSelector((state) => state.auth.token);
  const [visible, setVisible] = useState(false);
  const [isProvider, setIsProvider] = useState(false);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  // const [caseUnlockState, setCaseUnlockState] = useState([]);
  const [caseUnlockState, setCaseUnlockState] = useState(-1);
  const [typeFieldError, setTypeFieldError] = useState(false);
  const [selectedReason, setSelectedReason] = useState({});
  const {
    getTableDetails,
    trimJsonValues,
    getDatePartOnly,
    convertToCase,
    extractDate,
  } = useGetDBTables();
  const {
    submitCase,
    updateLockStatus,
    validateGridData,
    printConsole,
    setContractIdDropDown,
    updateDecision,
    checkDecision,
  } = useUpdateDecision();
  const [apiTestState, setApiTestState] = useState({});
  const [selectValues, setSelectValues] = useState({});
  const [formikInitializeState, setFormikInitializeState] = useState(false);
  const [disabledsearch, setDisabledSearch] = useState(false);

  const mastersSelector = useSelector((masters) => masters);
  console.log("Master Data", mastersSelector);

  // const typeOptions = ["Provider", "Facility", "Ancillary"];
  const typeOptions = [
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

  // const showGridCheckbox = ((mastersSelector.hasOwnProperty('auth') && (mastersSelector.auth.hasOwnProperty('userType')) && mastersSelector.auth.userType === 'A')) ? true : false;
  const showGridCheckbox = true;

  const removeExtraChecked = () => {
    console.log("selectedType", selectedType);
    if (selectedType === "Provider") {
      let retJsn = providerTableData.filter((el) => delete el.isChecked);
      return retJsn;
    } else {
      let retJsn = facilityAncillaryTableData.filter(
        (el) => delete el.isChecked,
      );
      return retJsn;
    }
  };

  const handleCheckBoxChange = (evnt, ind) => {
    const isChecked = evnt.target.checked;
    console.log(
      "Inside handlecheckbox change with event: ",
      evnt.target.checked,
    );
    console.log(
      "Inside handlecheckbox change with index: ",
      ind,
      " and value: ",
      isChecked,
    );
    printConsole(
      "Inside handleCheckBox change caseUnlockState value: ",
      caseUnlockState,
    );
    if (isChecked) {
      if (caseUnlockState !== -1) {
        alert("Please select one case only.");
      } else {
        let updatedProvData = removeExtraChecked();
        printConsole(
          "Inside handleCheckBox change else with updated data: ",
          updatedProvData,
        );
        let jsn = updatedProvData[ind];
        printConsole("jsn", jsn);
        jsn.isChecked = evnt.target.checked;
        updatedProvData[ind] = jsn;
        //setProviderTableData(updatedProvData);
        setCaseUnlockState(ind);
      }
    }
    if (!isChecked) {
      let updatedProvData = [...providerTableData];
      let jsn = updatedProvData[ind];
      jsn.isChecked = evnt.target.checked;
      updatedProvData[ind] = jsn;
      //setProviderTableData(updatedProvData);
      setCaseUnlockState(-1);
    }
  };

  const handleRadioChange = (evnt, ind) => {
    const isChecked = evnt.target.checked;
    console.log("select inside Radio", selectedType);
    let changedState =
      selectedType === "Provider" ? initState : facAncInitState;
    setApiTestState(changedState);
    if (isChecked) {
      let updatedProvData = removeExtraChecked();
      let jsn = updatedProvData[ind];
      printConsole("jsn", jsn);
      jsn.isChecked = evnt.target.checked;
      setCaseUnlockState(ind);
    }
  };

  const providerColumnNames =
    "First Name~FIRSTNAME, Last Name~LASTNAME, Legal Entity Name~ORGANIZATIONNAME, Suffix~SUFFIX, CAQH ID~CAQHID, NPI ID~NPIID, State~STATEVALUE, Pay To NPI~PAYTONPI,Status~PDMSTATUS";
  const facilityAncillaryColumnNames =
    "Legal Entity Name~LEGALENTITYNAME, DBA Name~DBANAME, NPI~NPIID,Status~PDMSTATUS";

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
  let credentialingConfigData = JSON.parse(
    process.env.REACT_APP_CREDENTIALING_DETAILS,
  );

  const checkIfValueExistsInState = () => {
    let retVal = false;
    printConsole("Inside checkIfValueExistsInState: ", apiTestState);
    printConsole(
      "Inside checkIfValueExistsInState organizationName: ",
      apiTestState.hasOwnProperty("organizationName"),
    );
    printConsole(
      "Inside checkIfValueExistsInState legalEntityName: ",
      apiTestState.hasOwnProperty("legalEntityName"),
    );
    printConsole(
      "Inside checkIfValueExistsInState apiTestState: ",
      apiTestState,
    );
    if (
      (apiTestState.hasOwnProperty("organizationName") &&
        apiTestState["organizationName"] !== "") ||
      (apiTestState.hasOwnProperty("legalEntityName") &&
        apiTestState["legalEntityName"] !== "")
    ) {
      retVal = true;
    }

    return retVal;
  };

  const checkValueOfTermination = () => {
    let retValue = false;
    console.log(
      "Inside checkValueOfTermination terminationReason: ",
      selectedReason.hasOwnProperty("terminationReason"),
    );
    console.log(
      "Inside checkValueOfTermination terminationDate: ",
      selectedReason.hasOwnProperty("terminationDate"),
    );
    if (
      selectedReason.hasOwnProperty("terminationReason") &&
      selectedReason.terminationReason.value !== "" &&
      selectedReason.hasOwnProperty("terminationDate") &&
      selectedReason.terminationDate !== "" &&
      selectedReason.terminationDate !== null
    ) {
      retValue = true;
    }
    return retValue;
  };

  // Added for Termination Data
  const saveFormData = (values) => {
    try {
      console.log("Inside saveFormData()", values);
      console.log("facData", facilityAncillaryTableData);
      console.log("CaseData", caseUnlockState);
      console.log("SelectedReason Select Value===== ", selectedReason);

      if (checkIfValueExistsInState()) {
        if (checkValueOfTermination()) {
          setButtonDisableFlag(true);
          let requestBody = { ...values };
          let apiJsonData = {};

          requestBody.userName = mastersSelector.hasOwnProperty("auth")
            ? mastersSelector.auth.hasOwnProperty("userName")
              ? mastersSelector.auth.userName
              : "system"
            : "system";
          console.log("save Form Data apiTestState ", apiTestState);

          requestBody.placeInDirectory =
            apiTestState.placeInDirectory !== undefined
              ? apiTestState.placeInDirectory.value
              : "Yes";
          requestBody.delegated =
            apiTestState.delegated !== undefined
              ? apiTestState.delegated.value
              : null;
          requestBody.contractId =
            apiTestState.contractId !== undefined
              ? apiTestState.contractId.value
              : "";

          if (selectedType === "Provider") {
            requestBody.gender =
              apiTestState.gender !== undefined
                ? apiTestState.gender.value
                : "";
            requestBody.agesSeen =
              apiTestState.agesSeen !== undefined
                ? apiTestState.agesSeen.value
                : "";
            // values.states = ((apiTestState.states!==undefined)?apiTestState.states.map(el => el.value).toString():'');
            requestBody.states =
              apiTestState.states !== undefined
                ? typeof apiTestState.states !== "string"
                  ? apiTestState.states.map((el) => el.value).toString()
                  : apiTestState.states
                : "";
            requestBody.newPatients =
              apiTestState.newPatients !== undefined
                ? apiTestState.newPatients.value
                : "";
            // requestBody.dateOfBirth =  !!apiTestState.dateOfBirth ? apiTestState.dateOfBirth.toLocaleDateString(): null;
            requestBody.dateOfBirth = extractDate(apiTestState.dateOfBirth);
            requestBody = trimJsonValues(requestBody);
            apiJsonData["SelfServ_Prov_Details"] = requestBody;
          } else {
            requestBody = trimJsonValues(requestBody);
            apiJsonData["SelfServ_FaciAnci_Details"] = requestBody;
          }
          console.log("Save Form Data requestBody: ", requestBody);
          console.log("select", selectedType);

          const mainWIObject = {};
          mainWIObject.firstName = requestBody.firstName;
          mainWIObject.lastName = requestBody.lastName;
          mainWIObject.npiId = requestBody.caqhNpiId || requestBody.npiId;
          mainWIObject.transactionType = "Termination";
          mainWIObject.caseStatus = "Open";
          mainWIObject.Field1 = requestBody.contractId;
          mainWIObject.Field3 = selectedType;
          console.log("SS Ty", selectedType[0]);
          //Added on 2/9/23

          const flowId = credentialingConfigData["FlowId"];
          const stageId = credentialingConfigData["StageId"];
          const stageName = credentialingConfigData["StageName"];

          console.log(
            "Inside add provider create case master selector: ",
            mastersSelector,
          );
          console.log(
            "Inside add provider create case username: ",
            mastersSelector.hasOwnProperty("auth")
              ? mastersSelector.auth.hasOwnProperty("userName")
                ? mastersSelector.auth.userName
                : "system"
              : "system",
          );
          mainWIObject.createdByName = mastersSelector.hasOwnProperty("auth")
            ? mastersSelector.auth.hasOwnProperty("userName")
              ? mastersSelector.auth.userName
              : "system"
            : "system";
          mainWIObject.flowId = flowId;
          mainWIObject.stageName = stageName;
          mainWIObject.stageId = stageId;
          // mainWIObject.OrganizationName = requestBody.organizationName;
          mainWIObject.legalEntityName = requestBody.organizationName;
          mainWIObject.delegated = requestBody.delegated;
          mainWIObject.HoldCount = 0;
          mainWIObject.legalEntityName = requestBody.legalEntityName;

          //mainWIObject = trimJsonValues(mainWIObject);
          console.log("I am here");
          console.log("Main Workitem data: ", mainWIObject);

          const TermiData = { ...selectedReason };
          TermiData.terminationReason =
            selectedReason?.terminationReason?.value;
          // TermiData.terminationDate = selectedReason?.terminationDate?.toISOString();
          // TermiData.terminationDate = selectedReason?.terminationDate?.toLocaleDateString();
          TermiData.terminationDate = extractDate(
            selectedReason?.terminationDate,
          );

          apiJsonData["MainCaseTable"] = mainWIObject;
          apiJsonData["SelfServ_Termination_Data"] = TermiData;

          console.log("API JSOn ", apiJsonData);

          if (isSearchClicked) {
            customAxios
              .post("/generic/create", apiJsonData, {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => {
                console.log("Data saved successfully to Termination: ", res);
                const apiStat = res.data["CreateCase_Output"]["Status"];
                if (apiStat === -1) {
                  alert("Case is not created.");
                  setButtonDisableFlag(false);
                }

                if (apiStat === 0) {
                  let procData = {};
                  let procDataState = {};
                  procDataState.stageName = stageName;
                  procDataState.flowId = flowId;
                  procDataState.caseNumber =
                    res.data["CreateCase_Output"]["CaseNo"];
                  procDataState.decision = "Submit";
                  procDataState.userName = mastersSelector.hasOwnProperty(
                    "auth",
                  )
                    ? mastersSelector.auth.hasOwnProperty("userName")
                      ? mastersSelector.auth.userName
                      : "system"
                    : "system";
                  procDataState.formNames = "Termination";

                  procData.state = procDataState;

                  console.log("PocData State: ", procData);
                  alert(
                    "Case successfully created : " +
                      res.data["CreateCase_Output"]["CaseNo"],
                  );
                  submitCase(procData, navigateHome);
                }
              })
              .catch((err) => {
                console.log("Caught in generic create api call: ", err.message);
                alert("Error occured in generic create api call.");
                setButtonDisableFlag(false);
              });
          } else {
            alert(
              "Please choose desired case and click on Populate Data button, then only Submit the case.",
            );
            setButtonDisableFlag(false);
            return;
          }
        } else {
          alert(
            "Please fill Termination Date and Reason, then only Submit the case.",
          );
        }
      } else {
        alert(
          "Please select case and populate the data before submittig the case.",
        );
      }
    } catch (error) {
      printConsole("Caught in saveFormData error: ", error);
      // alert("Please fill Termination Date and Reason, then only Submit the case.");
      setButtonDisableFlag(false);
    }
  };

  const updateFormData = (value, field) => {
    setFormData((prevState) => {
      return {
        ...prevState,
        [field]: {
          ...prevState[field],
          value: value.toUpperCase(),
          isInvalid: false,
        },
      };
    });
    validateForm();
  };

  function filterData() {
    return caseData?.data?.filter(
      (item) => item?.CaseID !== Number(prop.state.caseNumber),
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

  const updateDashboardData = (values) => {
    try {
      console.log("Inside updateDashboardData ");
      let updatedData = filterData();

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
      console.log(
        "Inside updateDashboardData isDecisionDiscard 1: ",
        isDecisionDiscard,
      );
      let callUpdateApi = true;
      if (!isDecisionDiscard && callProcRef.current === "callProc") {
        console.log("Inside updateDashboardData isDecisionDiscard");
        callUpdateApi = checkValueOfTermination();
      }
      if (callUpdateApi) {
        console.log("Inside updateDashboardData checkValueOfTermination() ");
        let apiJsonData = {};
        const TermiData = { ...selectedReason };
        TermiData.terminationReason = selectedReason.terminationReason.value;
        // TermiData.terminationDate = selectedReason.terminationDate.toISOString();
        //TermiData.terminationDate = selectedReason.terminationDate.toLocaleDateString();
        TermiData.terminationDate = extractDate(
          selectedReason?.terminationDate,
        );
        TermiData.CaseNumber = prop.state.caseNumber;
        TermiData.Operation = "U";
        TermiData.whereClause = { CaseNumber: prop.state.caseNumber };
        let APIData = [];
        APIData.push(TermiData);
        apiJsonData["SelfServ_Termination_Data"] = APIData;
        console.log("APIDATA", apiJsonData);
        customAxios
          .post("/generic/update", apiJsonData, {
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

              updateDecision(prop, saveType, "Termination");
            }
          });

        // submitCase(prop,navigateHome);
        //  updateDecision(prop,saveType,"Termination");
      } else {
        // if(callProcRef.current === 'callProc'){
        alert(
          "Please fill Termination Date and Reason, then only Submit the case.",
        );
        //}
      }
      if (callUpdateApi) {
        if (callProcRef.current === "callProc") {
          dispatchUpdateData(updatedData);
          submitCase(prop, navigateHome);
        }
      }
      if (callProcRef.current !== "callProc") {
        navigateHome();
      }
    } catch (error) {
      printConsole("Caught in updateFormData error: ", error);
      alert("Error occured in updating data.");
      setButtonDisableFlag(false);
    }
  };

  const newSearchHandler = (e) => {
    try {
      console.log(" search APII", apiTestState);
      removeExtraChecked();
      e.preventDefault();
      if (!selectedType) {
        setTypeFieldError(true);
        return;
      }
      setTypeFieldError(false);
      // setIsSearchClicked(true);
      setIsFormValid(true);
      setProviderTableData([]);
      setFacilityAncillaryTableData([]);
      validateForm();

      if (validateState() && validateInput()) {
        setDisabledSearch(true);
        let getApiJson = {};
        getApiJson["option"] = "GETPROVIDERSEARCHDATA";
        getApiJson["OrganizationName"] = formData.organizationName.value;
        getApiJson["ProviderNpiId"] = formData.providerNPI.value;
        getApiJson["State"] = formData.state.value;
        getApiJson["PayToNpi"] = formData.payToNPI.value;
        getApiJson["LegalEntityName"] = formData.legalEntityName.value;
        getApiJson["DBAName"] = formData.dbaName.value;
        getApiJson["Type"] =
          selectedType == null ? "" : selectedType.toString();
        getApiJson["TaxId"] = "";
        getApiJson["procOut"] = "Yes";
        getApiJson["firstName"] = "";
        getApiJson["lastName"] = "";
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
        };
        let facilityAncillaryMapping = {
          0: "PROVIDERID",
          1: "CONTRACTID",
          2: "LEGALENTITYNAME",
          3: "DBANAME",
          4: "NPIID",
        };

        axios
          .post(baseURL + "/generic/callProcedure", getApiJson, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((res) => {
            const data = res.data.CallProcedure_Output.data;
            console.log("RES", res);
            console.log("APIDATA", data);

            if (selectedType == "Provider") {
              let providerDataArray = [];
              let provideridArray = [];
              let contractidArray = [];

              data.length === 0
                ? (providerDataArray = [])
                : data.map((arr) => {
                    if (arr["SOURCE"] === "PDM") {
                      providerDataArray.push(arr);

                      provideridArray.push(arr["PROVIDERID"]);
                      contractidArray.push(arr["CONTRACTID"]);
                      console.log(provideridArray);
                      console.log(contractidArray);
                    }
                  });
              console.log(providerDataArray);
              setProviderTableData(providerDataArray);
            } else {
              let facAncDataArray = [];
              let provideridArray = [];
              let contractidArray = [];
              console.log("DD", data);
              data.length === 0
                ? (facAncDataArray = [])
                : data.map((arr) => {
                    if (arr["SOURCE"] === "PDM") {
                      facAncDataArray.push(arr);

                      provideridArray.push(arr["PROVIDERID"]);
                      contractidArray.push(arr["CONTRACTID"]);
                      console.log(provideridArray);
                      console.log(contractidArray);
                    }
                  });
              console.log(facAncDataArray);
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
      alert("Error occured in searching data.");
      console.log("Caught in newSearchHandler error: ", error);
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
        console.log("Testing: ", formData[field], formData[field].value);
      }
    });
    if (validateInputCount < 1) {
      alert("Atleast one entry is required to do Search.");
      return false;
    }

    return true;
  };

  const clearFields = (e) => {
    e.preventDefault();
    setFormData(initialState);
    setVisible(false);
    //setIsSearchClicked(false);
    setSelectedType();
    setSelectedState();
    setIsFormValid(false);
    setApiTestState({});
    setCaseUnlockState(-1);
    setDisabledSearch(false);
  };

  const OnTypeChange = (option) => {
    let changedState =
      option.value === "Provider" ? initState : facAncInitState;
    setApiTestState(changedState);
    setFormikInitializeState(true);
    setDisabledSearch(false);
    setSelectedReason({});
    setTimeout(() => {
      //console.log("API1",apiTestState);
      setSelectedType(option.value);
      setTypeFieldError(false);
      setCaseUnlockState(-1);
    }, 500);
  };

  useEffect(() => {
    setVisible(false);
    terminationReason();
    if (prop.state.formView === "DashboardView") {
      getFormData();
    }
  }, []);

  useEffect(() => {
    setFormData(initialState);
    setSelectedState();
    setIsProvider(false);
    setVisible(false);
    setIsFormValid(false);
    // setIsSearchClicked(false);
  }, [selectedType]);

  const populateFormBasisOnType = () => {
    if (prop.state.formView === "DashboardView") {
      return (
        <>
          <Tabs
            defaultActiveKey="ProviderDemo"
            id="justify-tab-example"
            className="mb-3"
            justify
          >
            <Tab eventKey="ProviderDemo" title="Termination">
              {populateForm()}
            </Tab>
            <Tab eventKey="Decision" title="Decision">
              <DecisionTab
                lockStatus={
                  prop.state.lockStatus === undefined
                    ? "N"
                    : prop.state.lockStatus
                }
                buttonClicked={callProcRef.current}
              ></DecisionTab>
            </Tab>
            <Tab eventKey="Reference" title="References">
              <ReferenceTab />
            </Tab>
          </Tabs>
        </>
      );
    }
    if (
      prop.state.formView === "HomeView" ||
      prop.state.formView === "DashboardHomeView"
    ) {
      return <>{populateForm()}</>;
    }

    //populateForm();
  };

  const RenderDatePicker = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Termintion Date" />
      <label htmlFor="datePicker">{props.placeholder}</label>
    </div>
  );

  const getFormData = () => {
    let getApiJson = {};
    console.log("Field3", prop.state.Field3);
    if (prop.state.Field3 === "Provider") {
      getApiJson["tableNames"] = getTableDetails()["providerLinear"].concat(
        getTableDetails()["terminationData"],
      );
    } else {
      getApiJson["tableNames"] = getTableDetails()["facAncLinear"].concat(
        getTableDetails()["terminationData"],
      );
    }

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
          setSelectedType([prop.state.Field3]);
          console.log("Dashboarddata", prop.state.Field3);
          const respKeys = Object.keys(res.data["data"]);
          const respData = res.data["data"];
          respKeys.forEach((k) => {
            console.log("Response key: ", k);
            if (k === "linearTable") {
              let apiResponse = {};
              if (respData[k][0] !== undefined) {
                apiResponse = respData[k][0];
                console.log("apiResponse xx: ", apiResponse);
                if (apiResponse.hasOwnProperty("dateOfBirth")) {
                  console.log("apiResponse xx Date: ");
                  if (typeof apiResponse.dateOfBirth === "string") {
                    const dob = new Date(
                      getDatePartOnly(apiResponse.dateOfBirth),
                    );
                    apiResponse.dateOfBirth = dob;
                  }
                }
                if (apiResponse.hasOwnProperty("ecfmgIssueDate")) {
                  if (typeof apiResponse.ecfmgIssueDate === "string") {
                    const eid = new Date(
                      getDatePartOnly(apiResponse.ecfmgIssueDate),
                    );
                    apiResponse.ecfmgIssueDate = eid;
                  }
                }
                if (apiResponse.hasOwnProperty("ecfmgExpirationDate")) {
                  if (typeof apiResponse.ecfmgExpirationDate === "string") {
                    const eed = new Date(
                      getDatePartOnly(apiResponse.ecfmgExpirationDate),
                    );
                    apiResponse.ecfmgExpirationDate = eed;
                  }
                }
                if (apiResponse.hasOwnProperty("attestationDate")) {
                  if (typeof apiResponse.attestationDate === "string") {
                    const atd = new Date(
                      getDatePartOnly(apiResponse.attestationDate),
                    );
                    apiResponse.dateOfBirth = atd;
                  }
                }
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
                apiResponse.placeInDirectory = {
                  label: apiResponse.placeInDirectory,
                  value: apiResponse.placeInDirectory,
                };
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
                if (apiResponse.states !== undefined) {
                  apiResponse.states = apiResponse.states
                    .split(",")
                    .map((ele) => {
                      return { label: ele, value: ele };
                    });
                }

                apiResponse = convertToDateObj(apiResponse);
                setApiTestState(apiResponse);
                setFormikInitializeState(true);
              }
            }
            if (k === "linearTable02") {
              let apiResponse = {};
              if (respData[k][0] !== undefined) {
                apiResponse = respData[k][0];
                console.log("apiResponse xx: ", apiResponse);

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

            if (k === "terminationGridValue") {
              let dataJson = {
                terminationReason: {
                  label: respData.terminationGridValue[0].TerminationReason,
                  value: respData.terminationGridValue[0].TerminationReason,
                },
                terminationDate: new Date(
                  getDatePartOnly(
                    respData.terminationGridValue[0]["TerminationDate#date"],
                  ),
                ),
              };
              setSelectedReason(dataJson);
            }
          });
        }
      })
      .catch((err) => {
        console.log(err.message);
      });

    console.log("getApiJson: ", getApiJson);
  };

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

  //let selectJson ={};
  const [resonValue, setReasonValue] = useState([]);
  const terminationReason = () => {
    if (mastersSelector.hasOwnProperty("masterTermination")) {
      let orgreasonArray = [];
      let reasonArray = [];
      orgreasonArray =
        mastersSelector["masterTermination"].length === 0
          ? []
          : mastersSelector["masterTermination"][0];
      console.log("RR", mastersSelector["masterTermination"][0]);
      console.log("Reason", orgreasonArray);

      for (let i = 0; i < orgreasonArray.length; i++) {
        if (orgreasonArray[i].Termination_type.toLowerCase() === "individual") {
          reasonArray.push({
            label: orgreasonArray[i].Reason,
            value: orgreasonArray[i].Reason,
          });
        }
      }
      setReasonValue(reasonArray);
      // selectJson.termReason = reasonArray;
    }
  };

  const handleDateChange = (date, dateName) => {
    console.log("handleDateChange date: ", date);
    console.log("handleDateChange dateName: ", dateName);
    if (dateName === "terminationDate") {
      setSelectedReason({
        ...selectedReason,
        [dateName]: date,
      });
      console.log("handleDateChange termination date: date ", selectedReason);
    }
  };

  function hasOwnPropertyCaseInsensitive(obj, property) {
    var props = [];
    for (var i in obj) if (obj.hasOwnProperty(i)) props.push(i);
    var prop;
    while ((prop = props.pop()))
      if (prop.toLowerCase() === property.toLowerCase()) return true;
    return false;
  }

  const handleSelectChange = (selectValue, evnt) => {
    const { name } = evnt;
    console.log("name is handle", name);
    console.log("select value is", selectValue);
    let val = selectValue;
    if (evnt.action === "clear") {
      //printConsole('Inside selectvalue null before delete: ',rowsInput[index]);
      //delete rowsInput[index][name];
      val = { label: "", value: "" };
      //printConsole('Inside selectvalue null after delete: ',rowsInput[index]);
    } else {
      val = {
        label: selectValue.value.toUpperCase(),
        value: selectValue.value.toUpperCase(),
      };
    }

    console.log("Inside handleSelectChange Val: ", val);

    setSelectedReason({ ...selectedReason, [name]: val });
    console.log("selected reason", selectedReason);
  };

  const formikFieldsOnChange = (evnt, setFieldValue, field) => {
    let value = evnt.target.value || "";
    value = value.toUpperCase();
    // printConsole('Inside Legal Entity Name onCHange: ',value)
    setFieldValue(field.name, value);
  };

  const handleLinearSelectChange = (selectValue, evnt) => {
    if (formikInitializeState) {
      setFormikInitializeState(false);
    }
    const { name } = evnt;
    setApiTestState({ ...apiTestState, [name]: selectValue });
  };
  const fieldsOnBlur = (e) => {
    if (prop.state.formView === "DashboardHomeView") {
      if (e.target.name === "organizationName") {
        const orgValue = e.target.value;
        printConsole("Inside add provider fields on blur: ", orgValue);
        let arr1 = [];
        let arr2 = [];
        const provContLinkData = mastersSelector["masterProvContLinkData"];
        printConsole(
          "Inside getDashboardData provContLinkData Data: ",
          provContLinkData,
        );
        if (provContLinkData !== undefined && provContLinkData.length > 0) {
          const contractIdData = provContLinkData[0][0];
          printConsole(
            "Inside getDashboardData contractIdData Data: ",
            contractIdData,
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

              printConsole("Inside fieldsOnBlur useeffect arr2 after: ", arr2);

              printConsole("Inside fieldsOnBlur  arr2: ", arr2);
            }
          }
        }
        const contractArray = setContractIdDropDown(arr1, arr2);
        let selectJson = { ...selectValues };
        let apiTestStateReplica = { ...apiTestState };
        if (contractArray !== undefined && contractArray.length > 0) {
          selectJson.contractIdOptions = contractArray;

          if (contractArray.length === 1) {
            apiTestStateReplica.contractId = contractArray[0];
            setApiTestState(apiTestStateReplica);
          }
        } else {
          if (selectJson.hasOwnProperty("contractIdOptions")) {
            delete selectJson["contractIdOptions"];
          }
          if (apiTestStateReplica.hasOwnProperty("contractId")) {
            delete apiTestStateReplica["contractId"];
          }
        }

        setSelectValues(selectJson);
        setApiTestState(apiTestStateReplica);
      }
    }
  };

  const validationSchema = Yup.object().shape({});

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

  const renameKey = (obj, oldKey, newKey) => {
    if (obj.hasOwnProperty(oldKey)) {
      obj[newKey] = obj[oldKey];
      delete obj[oldKey];
    }
    return obj;
  };

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
    if (caseUnlockState !== -1) {
      let getApiJson = {};
      let numberOfChecks = {};
      if (selectedType === "Provider") {
        numberOfChecks = providerTableData[caseUnlockState];
        console.log("Inside generic get numberOfChecks: ", numberOfChecks);
        getApiJson["tableNames"] = getTableDetails()["pdmProviderLinear"];
      } else {
        numberOfChecks = facilityAncillaryTableData[caseUnlockState];
        console.log("Inside generic get numberOfChecks: ", numberOfChecks);
        getApiJson["tableNames"] = getTableDetails()["pdmAncFacLinear"];
      }

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
            const respKeys = Object.keys(res.data["data"]);
            const respData = res.data["data"];
            const ProviderStatus = respData["linearTable"][0]["PROVIDERSTATUS"];
            console.log("PS", ProviderStatus);
            const FaciAnciStatus = respData["linearTable"][0]["FACIANCISTATUS"];
            if (
              ProviderStatus !== "Terminated" &&
              FaciAnciStatus !== "Terminated"
            ) {
              alert("Data populated successfully.");
              setIsSearchClicked(true);
              //  const respKeys = Object.keys(res.data['data']);
              // const respData = res.data['data'];
              respKeys.forEach((k) => {
                console.log("Response key: ", k);
                if (k === "linearTable") {
                  let apiResponse = {};
                  let apiResponseNew = {};
                  if (respData[k][0] !== undefined) {
                    apiResponse = respData[k][0];
                    console.log("apiResponse xx: ", apiResponse);
                    //Newly Added on 7/17/23
                    let linearFieldArray = [];
                    if (selectedType === "Provider") {
                      linearFieldArray = [
                        "organizationName",
                        "firstName",
                        "middleName",
                        "lastName",
                        "suffix",
                        "caqhId",
                        "ssn",
                        "medicareId",
                        "medicaidId",
                        "emailId",
                      ];
                      if (hasOwnPropertyCaseInsensitive(apiResponse, "NPIID")) {
                        apiResponseNew.caqhNpiId =
                          apiResponse[getKeyCase(apiResponse, "NPIID")];
                      }
                    } else {
                      linearFieldArray = [
                        "medicareId",
                        "medicaidId",
                        "emailId",
                        "legalEntityName",
                        "dbaName",
                        "npiId",
                      ];
                    }

                    for (let field in linearFieldArray) {
                      //console.log("field Nidhi02: ",field);
                      if (
                        hasOwnPropertyCaseInsensitive(
                          apiResponse,
                          linearFieldArray[field],
                        )
                      ) {
                        console.log(
                          "field xx03: ",
                          apiResponse,
                          linearFieldArray[field],
                        );
                        apiResponseNew[linearFieldArray[field]] =
                          apiResponse[
                            getKeyCase(apiResponse, linearFieldArray[field])
                          ];
                      }
                    }

                    //Newly Added on 07/28/2023
                    let linearFieldSelectArray = [];
                    if (selectedType === "Provider") {
                      linearFieldSelectArray = [
                        "gender",
                        "newPatients",
                        "agesSeen",
                        "placeInDirectory",
                        "delegated",
                        "contractId",
                      ];
                    } else {
                      linearFieldSelectArray = [
                        "placeInDirectory",
                        "delegated",
                        "contractId",
                      ];
                    }

                    for (let field in linearFieldSelectArray) {
                      if (
                        hasOwnPropertyCaseInsensitive(
                          apiResponse,
                          linearFieldSelectArray[field],
                        )
                      ) {
                        console.log(
                          "field xx03: ",
                          apiResponse,
                          linearFieldSelectArray[field],
                        );
                        apiResponseNew[linearFieldSelectArray[field]] = {
                          label:
                            apiResponse[
                              getKeyCase(
                                apiResponse,
                                linearFieldSelectArray[field],
                              )
                            ],
                          value:
                            apiResponse[
                              getKeyCase(
                                apiResponse,
                                linearFieldSelectArray[field],
                              )
                            ],
                        };
                      }
                    }

                    if (
                      hasOwnPropertyCaseInsensitive(
                        apiResponse,
                        "DATE_OF_BIRTH#date",
                      )
                    ) {
                      if (
                        typeof apiResponse[
                          getKeyCase(apiResponse, "DATE_OF_BIRTH#date")
                        ] === "string"
                      ) {
                        const dob = new Date(
                          apiResponse[
                            getKeyCase(apiResponse, "DATE_OF_BIRTH#date")
                          ],
                        );
                        apiResponseNew.dateOfBirth = dob;
                      }
                    }

                    apiResponseNew = convertToDateObj(apiResponseNew);
                    setApiTestState(apiResponseNew);
                    setFormikInitializeState(true);
                  }
                }
              });
            } else {
              alert(
                "This case is already Terminated. Please select different case.",
              );
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      alert("Please select case first.");
    }
  };
  const callProcRef = useRef(null);
  const callFormSubmit = (evnt) => {
    if (evnt.target.name === "saveSubmit") {
      callProcRef.current = "callProc";
      console.log("Inside callFormSubmit");
    }

    if (evnt.target.name === "saveExit") {
      callProcRef.current = "notCallProc";
    }
    document.getElementById("mainFormSubmit").click();
  };

  const saveData = (values) => {
    console.log("Inside saveData");

    console.log("saveData Values: ", values);
    if (
      prop.state.formView === "HomeView" ||
      prop.state.formView === "DashboardHomeView"
    ) {
      saveFormData(values);
    }

    if (prop.state.formView === "DashboardView") {
      printConsole("Inside dashboard view before if : ", formikInitializeState);
      if (formikInitializeState) {
        printConsole("Inside dashboard view if : ", formikInitializeState);
        setFormikInitializeState(false);
      }
      setTimeout(() => {
        printConsole("Inside dashboard view timeout : ", formikInitializeState);
        //updateFormData(values);
        updateDashboardData(values);
      }, 1000);
    }
  };

  const populateForm = () => {
    return (
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
                      The below search screen is defined by Provider, Ancillary
                      and Facility. Please enter one field from the below
                      information and the data of provider(s) associated will
                      populate on the screen. Once the search is complete, you
                      may click on the provider to obtain the information.
                      Search example: St. Joseph – this will return multiple
                      records with St. Joseph. Type in St. Joseph’s Hospital
                      with NPI, the specified Facility will populate with this
                      data on the screen.
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {(prop.state.formView === "HomeView" ||
            prop.state.formView === "DashboardHomeView") && (
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

                        {/* <Multiselect
                                                    isObject={false}
                                                    options={typeOptions}
                                                    showCheckbox={false}
                                                    id="typeDropdown"
                                                    ref={stateRef}
                                                    showArrow={true}
                                                    singleSelect={true}
                                                    onSelect={(option) => {
                                                        OnTypeChange(option);
                                                    }}
                                                    selectedValues={selectedType}
                                                /> */}

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
                                state.hasValue || state.selectProps.inputValue
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
                          name="typedropdown"
                          className="basic-multi-select"
                          options={typeOptions}
                          ref={stateRef}
                          id="typeDropdown"
                          isMulti={false}
                          onChange={(option) => OnTypeChange(option)}
                          value={{ label: selectedType, value: selectedType }}
                          placeholder="SelectedType"
                          isSearchable={
                            document.documentElement.clientHeight >
                            document.documentElement.clientWidth
                              ? false
                              : true
                          }
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
          )}

          {(prop.state.formView === "HomeView" ||
            prop.state.formView === "DashboardHomeView") &&
            (selectedType == "Provider" ||
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
                          {prop.state.formView === "DashboardView"
                            ? populateTable()
                            : renderForm(selectedType)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          <Formik
            enableReinitialize={formikInitializeState}
            initialValues={apiTestState}
            onSubmit={async (values) => {
              await new Promise((resolve) => setTimeout(resolve, 500)).catch(
                (err) => {
                  console.error(err);
                },
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
              console.log("select in formik", selectedType);
              return (
                <form disabled={true} onSubmit={(e) => e.preventDefault()}>
                  <fieldset
                    disabled={
                      prop.state.formView === "DashboardView" &&
                      prop.state.lockStatus !== undefined &&
                      prop.state.lockStatus === "Y"
                        ? true
                        : false
                    }
                  >
                    {selectedType == "Provider" && (
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
                            {prop.state.formView === "DashboardView" ? (
                              <div></div>
                            ) : (
                              <div className="row"></div>
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
                                        disabled
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
                                            field,
                                          )
                                        }
                                        value={convertToCase(field.value)}
                                        disabled
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
                                        className={`form-control ${
                                          meta.touched && meta.error
                                            ? " is-invalid"
                                            : field.value ||
                                                field.value === null
                                              ? "is-valid"
                                              : ""
                                        }`}
                                        placeholder="John"
                                        {...field}
                                        value={convertToCase(field.value)}
                                        disabled
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
                                            field,
                                          )
                                        }
                                        value={convertToCase(field.value)}
                                        disabled
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
                                        disabled
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
                                    name="gender"
                                    //isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={[
                                      { label: "Male", value: "Male" },
                                      { label: "Female", value: "Female" },
                                    ]}
                                    id="genderDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestState.gender}
                                    placeholder="Gender"
                                    //styles={{...customStyles}}
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

                            <div className="row my-2">
                              <div className="col-xs-6 col-md-4">
                                {/* innerRef={caqhId} written inside feild*/}
                                <Field name="caqhId">
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
                                        //oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                        disabled
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
                                <Field name="caqhNpiId">
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
                                        //oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*)\./g, '$1');"
                                        {...field}
                                        // onBlur={e => {field.onBlur(e)

                                        //     console.log("evnt.target.value: ", e.target.value);
                                        //     checkLuhn(e.target.value);

                                        // }}
                                        //ref = {caqhNpiIdRef}
                                        disabled
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
                                <div>
                                  <ReactDatePicker
                                    id="datePicker"
                                    className="form-control example-custom-input-provider"
                                    selected={apiTestState.dateOfBirth}
                                    name="dateOfBirth"
                                    onChange={(event) =>
                                      handleDateChange(event, "dateOfBirth")
                                    }
                                    onKeyDown={(e) => {
                                      e.preventDefault();
                                    }}
                                    dateFormat="MM/dd/yyyy"
                                    peekNextMonth
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    //readOnly={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                    readOnly={true}
                                    placeholderText="Date Of Birth"
                                    customInput={<RenderDatePicker />}
                                  />
                                </div>
                              </div>
                            </div>

                            <div className="row my-2">
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
                                    name="agesSeen"
                                    //isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    // options={selectValues.agesSeenArray}
                                    options={[
                                      {
                                        label: selectValues.agesSeenArray,
                                        value: selectValues.agesSeenArray,
                                      },
                                    ]}
                                    id="agesSeenDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestState.agesSeen}
                                    placeholder="Ages Seen"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
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

                            <div className="row my-2"></div>

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
                                    //isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={[
                                      { label: "Yes", value: "Yes" },
                                      { label: "No", value: "No" },
                                    ]}
                                    id="newPatientsDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestState.newPatients}
                                    placeholder="Accepting New Patients"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
                              </div>

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
                                        disabled
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
                                    name="delegated"
                                    //isDisabled={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={[
                                      { label: "Yes", value: "Yes" },
                                      { label: "No", value: "No" },
                                    ]}
                                    id="delegatedDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestState.delegated}
                                    //   defaultValue={{ label: 'Yes', value: 'Yes' }}
                                    placeholder="Delegated"
                                    isSearchable={
                                      document.documentElement.clientHeight >
                                      document.documentElement.clientWidth
                                        ? false
                                        : true
                                    }
                                  />
                                </div>
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
                                    //isDisabled={(tabRef.current==='DashboardView'||(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                    isDisabled={true}
                                    className="basic-multi-select"
                                    options={selectValues.contractIdOptions}
                                    id="contractIdDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
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
                            {/* here */}
                          </div>
                        </div>
                      </div>
                    )}

                    {(selectedType == "Facility" ||
                      selectedType == "Ancillary") && (
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
                            Facility/Ancillary Information
                          </button>
                        </h2>
                        <div
                          id="panelsStayOpen-collapseProvider"
                          className="accordion-collapse collapse show"
                          aria-labelledby="panelsStayOpen-Provider"
                        >
                          <div className="accordion-body">
                            {prop.state.formView === "DashboardView" ? (
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
                                        onBlur={(event) => {
                                          fieldsOnBlur(event);
                                        }}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field,
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
                                        disabled={true}
                                        {...field}
                                        onChange={(e) =>
                                          formikFieldsOnChange(
                                            e,
                                            setFieldValue,
                                            field,
                                          )
                                        }
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
                                          valueContainer: (
                                            provided,
                                            state,
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
                                        //name="delegated"
                                        name={field.name}
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
                                        onChange={(selectValue, event) =>
                                          setFieldValue(field.name, selectValue)
                                        }
                                        //value={apiTestState.delegated}
                                        value={field.value}
                                        placeholder="Delegated"
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
                                  name="delegated"
                                  className="invalid-feedback"
                                />
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
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
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
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
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
                  </fieldset>
                </form>
              );
            }}
          </Formik>
          {(selectedType == "Provider" ||
            selectedType == "Facility" ||
            selectedType == "Ancillary") && (
            <div className="accordion-item">
              <h2 className="accordion-header" id="panelsStayOpen-headingThree">
                <button
                  className="accordion-button accordionButtonStyle"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#panelsStayOpen-collapseTermi"
                  aria-expanded="false"
                  aria-controls="panelsStayOpen-collapseTermi"
                >
                  Termination Details
                </button>
              </h2>
              <div
                id="panelsStayOpen-collapseTermi"
                className="accordion-collapse collapse show"
                aria-labelledby="panelsStayOpen-headingTermi"
              >
                <div className="accordion-body">
                  <div className="row g-2">
                    <div className="col-md mx-2">
                      <div className="form-floating">
                        <ReactDatePicker
                          onKeyDown={(e) => {
                            e.preventDefault();
                          }}
                          id="datePicker"
                          className="form-control example-custom-input-provider"
                          selected={selectedReason.terminationDate}
                          name="terminationDate"
                          onChange={(event) =>
                            handleDateChange(event, "terminationDate")
                          }
                          dateFormat="MM/dd/yyyy"
                          peekNextMonth
                          showMonthDropdown
                          showYearDropdown
                          dropdownMode="select"
                          readOnly={
                            (prop.state.formView === "DashboardView" &&
                              prop.state.stageName === "Exit") ||
                            (prop.state.lockStatus !== undefined &&
                              prop.state.lockStatus === "Y")
                              ? true
                              : false
                          }
                          placeholderText="Termination Date"
                          customInput={<RenderDatePicker />}
                        />
                      </div>
                    </div>
                    <div className="col-xs-6 col-md-6">
                      <div className="form-floating">
                        <Select
                          styles={{
                            menu: (provided) => ({ ...provided, zIndex: 9999 }),

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
                                state.hasValue || state.selectProps.inputValue
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
                          name="terminationReason"
                          isDisabled={
                            (prop.state.formView === "DashboardView" &&
                              prop.state.stageName === "Exit") ||
                            (prop.state.lockStatus !== undefined &&
                              prop.state.lockStatus === "Y")
                              ? true
                              : false
                          }
                          className="basic-multi-select"
                          options={resonValue}
                          // options={[{label:'Yes', value:'Yes'}]}

                          id="terminationReason"
                          isMulti={false}
                          onChange={(selectValue, event) =>
                            handleSelectChange(selectValue, event)
                          }
                          value={selectedReason.terminationReason}
                          menuPlacement="top"
                          placeholder=" Termination Reason"
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
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const populateTable = () => {
    console.log("populate", isProvider);
    console.log("Pop", visible);
    // if(prop.state.formView === 'DashboardView') {
    //     setVisible(true);
    // }
    return (
      <>
        {visible && isProvider && (
          <div div className="row my-2">
            <div className="row">
              <div className="col-xs-6">
                <TableComponent
                  columnName={providerColumnNames}
                  rowValues={providerTableData}
                  showCheckBox={showGridCheckbox}
                  handleCheckBoxChange={handleCheckBoxChange}
                  handleRadioChange={handleRadioChange}
                  radioFlag={true}
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
                  handleCheckBoxChange={handleCheckBoxChange}
                  handleRadioChange={handleRadioChange}
                  radioFlag={true}
                  makeLink={false}
                />
              </div>
            </div>
          </div>
        )}
        {visible && (
          <div
            className="col-xs-6 col-md-4"
            style={{ textAlign: "right", marginLeft: "270px" }}
          >
            <button
              type="button"
              className="btn btn-outline-primary btnStyle"
              onClick={() => callGenericGet()}
            >
              Populate Data
            </button>
          </div>
        )}
      </>
    );
  };
  const styles = {
    optionListContainer: {
      zIndex: 999,
    },
  };

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
                  disabled={disabledsearch}
                />
                <label htmlFor="floatingInputGrid">Provider NPI</label>
                {formData.providerNPI.isInvalid && (
                  <div className="small text-danger">
                    Provider NPI is required
                  </div>
                )}
              </div>
            </div>

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
                  disabled={disabledsearch}
                />

                <label htmlFor="floatingInputGrid">Legal Entity Name</label>
                {formData.organizationName.isInvalid && (
                  <div className="small text-danger">
                    Legal Entity Name is required
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="row my-2">
          <div className="col-xs-6 col-md-6">
            {/*  <Multiselect
                        isObject={false}
                        options={stateOptions}
                        showCheckbox={false}
                        id="state"
                        ref={stateRef}
                        showArrow={true}
                        singleSelect={true}
                        placeholder='State'
                        disable={disabledsearch}
                        onSelect={(option) => {
                            setSelectedState(option);
                            updateFormData(option.toString(), 'state');
                        }}
                        selectedValues={selectedState}
                        style={styles}
                    />*/}
            {/* {(!selectedState && isSearchClicked) && <div className="small text-danger">State is required</div>} */}

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
                menu: (provided) => ({ ...provided, zIndex: 9999 }),

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
                disabled={disabledsearch}
              ></input>
              <label htmlFor="floatingInputGrid">Pay To NPI</label>
              {formData.payToNPI.isInvalid && (
                <div className="small text-danger">Pay To NPI is required</div>
              )}
            </div>
          </div>
        </div>
        <div className="row my-2">
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
                    disabled={disabledsearch}
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
                    disabled={disabledsearch}
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
          <div className="col-xs-12 gap-2 col-md-12 d-flex justify-content-end">
            <button
              type="submit"
              className="btn btn-outline-primary btnStyle"
              onClick={newSearchHandler}
              disabled={disabledsearch}
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
        {populateTable()}
      </form>
    );
  };

  return (
    <>
      <div
        className="GroupTermination backgroundColor"
        style={{ minHeight: "110vh" }}
      >
        <div
          className="AddProvider backgroundColor"
          style={{ minHeight: "100vh" }}
        >
          {prop.state.formView === "DashboardView" && <CaseInformation />}
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
                  Individual Termination
                </label>
                {prop.state.formView === "DashboardView" && (
                  <button
                    type="button"
                    className="btn btn-outline-primary btnStyle"
                    name="saveExit"
                    onClick={(event) => callFormSubmit(event)}
                    style={{ float: "right", marginRight: "10px" }}
                    disabled={
                      buttonDisableFlag ||
                      (prop.state.formView === "DashboardView" &&
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
                  onClick={(event) => callFormSubmit(event)}
                  style={{ float: "right", marginRight: "10px" }}
                  disabled={
                    buttonDisableFlag ||
                    (prop.state.formView === "DashboardView" &&
                    prop.state.lockStatus !== undefined &&
                    prop.state.lockStatus === "Y"
                      ? true
                      : false)
                  }
                >
                  {prop.state.formView === "DashboardView"
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
        </div>

        <br />

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
    </>
  );
}
