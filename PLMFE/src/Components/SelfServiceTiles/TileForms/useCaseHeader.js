import {useEffect, useRef, useState} from "react";
import * as Yup from "yup";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {useAxios} from "../../../api/axios.hook";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import _ from "lodash";

export const useCaseHeader = () => {
  const [hasSubmitError, setHasSubmitError] = useState(true);
  const [caseTimelines, setCaseTimelines] = useState({
    caseNumber: "",
    Acknowledgment_Timely: "",
    AOR_Received_Date: undefined,
    Case_Aging: "",
    Case_Filing_Method: "",
    Case_in_Compliance: "",
    Case_Received_Date: undefined,
    Compliance_Time_Left_to_Finish: "",
    Out_of_Compliance_Reason: "",
    Timeframe_Extended: "",
    WOL_Received_Date: undefined,
  });
  const [caseInformation, setCaseInformation] = useState({
    caseNumber: "",
    Appeal_Type: "",
    Appellant_Description: "",
    Appellant_Type: "",
    Case_Level_Priority: "",
    Claim_Number: "",
    Denial_Type: "",
    DuplicateRelated_Cases: "",
    Inbound_Email_ID: "",
    Issue_Description: "",
    Issue_Level: "",
    Line_of_Business_LOB: "",
    LOB_Description: "",
    Product: "",
    Product_State: "",
    Product_Type: "",
    RedirectCaseS: "",
    Research_Type: "",
    Review_Type: ""
  });

  const caseTimelinesValidationSchema = Yup.object().shape({
    Case_Filing_Method: Yup.string().required(),
    Acknowledgment_Timely: Yup.string().required(),
    Case_in_Compliance: Yup.string().required(),
    Out_of_Compliance_Reason: Yup.string().required(),
  });
  const caseInformationValidationSchema = Yup.object().shape({
    Line_of_Business_LOB: Yup.string().required(),
    LOB_Description: Yup.string().required(),
    Product_State: Yup.string().required(),
    Product: Yup.string().required(),
    Product_Type: Yup.string().required(),
    Appeal_Type: Yup.string().required(),
    Appellant_Type: Yup.string().required(),
    Review_Type: Yup.string().required(),
  });

  useEffect(() => {
    Promise.all([
      caseTimelinesValidationSchema.validate(caseTimelines),
      caseInformationValidationSchema.validate(caseInformation)
    ]).then(() => setHasSubmitError(false))
        .catch(err => setHasSubmitError(true));
  }, [caseTimelines, caseInformation]);

  const submitData = async () => {

    if (hasSubmitError) {
      return;
    }

    let apiJson = {};

    const angClaimInformationGrid = getGridDataValues(claimInformationGrid);
    const angProviderInformationGrid = getGridDataValues(providerInformationGrid);
    const angRepresentativeInformationGrid = getGridDataValues(representativeInformationGrid);
    const angAuthorizationInformationGrid = getGridDataValues(authorizationInformationGrid);

    const angCaseHeader = trimJsonValues({...caseHeader});
    const angCaseTimelines = trimJsonValues({...caseTimelines});
    const angCaseInformation = trimJsonValues({...caseInformation});
    const angClaimInformation = trimJsonValues({...claimInformation});
    const angMemberInformation = trimJsonValues({...memberInformation});
    const angAuthorizationInformation = trimJsonValues({...authorizationInformation});
    const angExpeditedRequest = trimJsonValues({...expeditedRequest});

    apiJson["ANG_Case_Header"] = angCaseHeader;
    apiJson["ANG_Case_Timelines"] = angCaseTimelines;
    apiJson["ANG_Case_Information"] = angCaseInformation;
    apiJson["ANG_Claim_Information"] = angClaimInformation;
    apiJson["ANG_Claim_Information_Grid"] = angClaimInformationGrid;
    apiJson["ANG_Provider_Information_Grid"] = angProviderInformationGrid;
    apiJson["ANG_Member_Information"] = angMemberInformation;
    apiJson["ANG_Representative_Information_Grid"] = angRepresentativeInformationGrid;
    apiJson["ANG_Authorization_Information"] = angAuthorizationInformation;
    apiJson["ANG_Authorization_Information_Grid"] = angAuthorizationInformationGrid;
    apiJson["ANG_Expedited_Request"] = angExpeditedRequest;

    let mainCaseReqBody = {
      ...mainCaseDetails,
      caseStatus: "Open",
      lockStatus: "N",
    }

    const flowId = caseheaderConfigData["FlowId"];
    const stageName = caseheaderConfigData["StageName"];

    apiJson["MainCaseTable"] = mainCaseReqBody;

    const response = await customAxios.post("/generic/create", apiJson, {
      headers: {Authorization: `Bearer ${token}`},
    });

    // Handle the response from the create endpoint.
    const apiStat = response.data.CreateCase_Output.Status;

    if (apiStat === -1) {
      alert("Case is not created.");
    }

    if (apiStat === 0) {
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
      procDataState.formNames = 'Appeals';
      procData.state = procDataState;
      alert(
          "Case created successfully: " +
          response.data["CreateCase_Output"]["CaseNo"]
      );
      submitCase(procData, navigateHome);
    }
  }

  const navigate = useNavigate();
  const navigateHome = async () => {
    navigate("/DashboardLogin/Home", {replace: true});
    if (location.state.formView === "DashboardView") {
      const promise = new Promise((resolve, reject) => {
        resolve(updateLockStatus("N", location.state.caseNumber, 0, ""));
      });

      await promise
          .then(() => {
            setTimeout(() => {
              navigate("/DashboardLogin/Home", {replace: true});
            }, 1000);
          })
          .catch((err) => {
            console.error(err);
          });
    }
  };
  let location = useLocation();

  const caseData = useSelector((store) => store.dashboardNavigationState);
  const caseheaderConfigData = JSON.parse(process.env.REACT_APP_CASEHEADER_DETAILS || "{}");
  const [potentialDupData, setPotentialDupData] = useState([]);
  const [apiTestState, setApiTestState] = useState({
    delegated: "",
  });

  const [formData, setFormData] = useState({});

  const [caseHeader, setCaseHeader] = useState({
    caseNumber: "",
    Case_Due_Date: "",
    Case_Owner: "",
    Case_Received_Date: "",
    Case_Status: "",
    Case_Validation: "",
    Environmental_Description: "",
    Extended_Case_Due_Date: "",
    Internal_Due_Date: "",
    Subcase_ID: "",
    White_Glove_Indicator: "",
  });

  const [claimInformation, setClaimInformation] = useState({
    caseNumber: "",
    Authorization_Number: "",
    Claim_Decision: "",
    Claim_Number: "",
    Claim_type: "",
    Claim_Adjusted_Date: "",
    Decision_Reason: "",
    Denied_As_Of_Date: "",
    Effectuation_Notes: "",
    Original_Denial_Date: "",
    Processing_Status: "",
    Payment_Method: "",
    Payment_Number: "",
    Payment_Date: "",
    Payment_Mail_Date_Postmark: "",
    Reason_Text: "",
    Service_Type: "",
    Service_Start_Date: "",
    Service_End_Date: "",
  });

  const [claimInformationGrid, setClaimInformationGrid] = useState([]);

  const [providerInformationGrid, setProviderInformationGrid] = useState([]);

  const [memberInformation, setMemberInformation] = useState({
    caseNumber: "",
    Address_Line_1: "",
    Address_Line_2: "",
    City: "",
    Communication_Preference: "",
    ContractPlan_ID: "",
    County: "",
    Date_of_Birth: "",
    Deceased: "",
    Dual_Plan: "",
    Email_Address: "",
    Email_ID: "",
    Fax_Number: "",
    Gender: "",
    Mail_to_Address: "",
    Medicaid_ID: "",
    Medicare_ID_HICN: "",
    Members_Age: "",
    Member_First_Name: "",
    Member_ID: "",
    Member_IPA: "",
    Member_Last_Name: "",
    PBP: "",
    PCP_ID: "",
    PCP_NPI_ID: "",
    Phone_Number: "",
    Plan_Code: "",
    Plan_Description: "",
    Plan_Effective_Date: "",
    Plan_Expiration_Date: "",
    Plan_Name: "",
    Preferred_Language: "",
    Primary_Care_Physician_PCP: "",
    Special_Need_Indicator: "",
    State_: "",
    Zip_Code: "",
  });

  const [representativeInformationGrid, setRepresentativeInformationGrid] = useState([]);

  const [authorizationInformation, setAuthorizationInformation] = useState({
    Authorization_Decision: "",
    Authorization_Decision_Reason: "",
  });

  const [authorizationInformationGrid, setAuthorizationInformationGrid] = useState([]);

  const [expeditedRequest, setExpeditedRequest] = useState({
    Expedited_Requested: "",
    Expedited_Reason: "",
    Standard_Upgraded_to_Expedited: "",
    Expedited_Denied: "",
    Expedited_Upgrade_Date_Time: "",
    Expedited_Denied_Date: "",
    Decision_Letter_Date: ""
  });

  const [mainCaseDetails, setMainCaseDetails] = useState({
    flowId: 0,
    stageName: "",
    stageId: 0,
    transactionType: "",
    caseStatus: ""
  })

  const callProcRef = useRef(null);

  useEffect(() => {
    let caseheaderConfigData = JSON.parse(
        process.env.REACT_APP_CASEHEADER_DETAILS
    );
    const stageDetails = {
      ...mainCaseDetails,
      flowId: caseheaderConfigData["FlowId"],
      stageId: caseheaderConfigData["StageId"],
      stageName: caseheaderConfigData["StageName"],
      transactionType: "Appeals",
      caseStatus: "Open",

    };
    setMainCaseDetails(stageDetails);
  }, [])

  useEffect(() => {
    if (
        location.state.formView !== undefined &&
        location.state.formView === "DashboardView"
    ) {
      getCaseByCaseNumber();
    }
  }, []);

  const handleActionSelectChange = (propertyName, propertyValue) => {
    const updatedData = potentialDupData.map((data) => ({
      ...data,
      [propertyName]: {label: propertyValue, value: propertyValue},
    }));

    setPotentialDupData(updatedData);
  };

  const dispatch = useDispatch();
  const {customAxios} = useAxios();

  const mastersSelector = useSelector((masters) => masters);
  const {
    trimJsonValues,
    extractDate, getTableDetails, getDatePartOnly
  } = useGetDBTables();
  const {
    submitCase,
    updateLockStatus,
    updateDecision,
    CompareJSON
  } = useUpdateDecision();

  const token = mastersSelector.hasOwnProperty("auth")
      ? mastersSelector.auth.hasOwnProperty("token")
          ? mastersSelector.auth.token
          : ""
      : "";

  const handleCaseHeaderChange = (value, name) => {
    setCaseHeader({...caseHeader, [name]: value});
  };
  const handleCaseInformationChange = (value, name) => {
    setCaseInformation({...caseInformation, [name]: value});
  }
  const handleClaimInformationChange = (value, name) => {
    setClaimInformation({...claimInformation, [name]: value});
  };
  const handleMemberInformationChange = (value, name) => {
    setMemberInformation({...memberInformation, [name]: value});
  };
  const handleAuthorizationInformationChange = (value, name) => {
    setAuthorizationInformation({...authorizationInformation, [name]: value});
  };
  const handleExpeditedRequestChange = (value, name) => {
    setExpeditedRequest({...expeditedRequest, [name]: value});
  };

  const getGridDataValues = (tableData) => {
    //var headers = document.getElementById(tableId).headers;
    let returnArray = [];
    tableData?.map((data) => {
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
            } else if (data[dataValue].value === "") {
              dataObject[dataValue] = "";
            } else {
              if (data[dataValue] instanceof Date) {
                //dataObject[dataValue] = data[dataValue].toLocaleDateString();
                dataObject[dataValue] = extractDate(data[dataValue]);
              } else {
                dataObject[dataValue] = data[dataValue];
              }
            }
          } else {
            dataObject[dataValue] = "";
          }
        }
        if (dataKeyType !== "object") {
          dataObject[dataValue] = data[dataValue];
        }
      });
      returnArray.push(trimJsonValues(dataObject));
    });
    return returnArray;
  };

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
      return jsonObj;
    } catch (error) {
      // Handle the error here
      console.error("An error occurred convertToDateObj:", error);
    }
  };

  const renameKey = (obj, oldKey, newKey) => {
    try {
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

  function getCaseByCaseNumber() {
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["angTables"];
    getApiJson["whereClause"] = {caseNumber: location.state.caseNumber};

    customAxios
        .post("/generic/get", getApiJson, {
          headers: {Authorization: `Bearer ${token}`},
        })
        .then((res) => {

          const apiStat = res.data.Status;

          if (apiStat === -1) {
            alert("Error in fetching data.");
          }

          if (apiStat === 0) {
            let data = res.data.data;
            setCaseHeader(data["angCaseHeader"][0]);
            setCaseTimelines(data["angCaseTimelines"][0]);
            setCaseInformation(data["angCaseInformation"][0]);
            setClaimInformation(data["angClaimInformation"][0]);
            setClaimInformationGrid(data["angClaimInformationGrid"]);
            setProviderInformationGrid(data["angProviderInformationGrid"]);
            setMemberInformation(data["angMemberInformation"][0]);
            setRepresentativeInformationGrid(data["angRepresentativeInformationGrid"]);
            setAuthorizationInformation(data["angAuthorizationInformation"][0]);
            setAuthorizationInformationGrid(data["angAuthorizationInformationGrid"]);
            setExpeditedRequest(data["angExpeditedRequest"][0]);

            setFormData(_.cloneDeep(data));

            const caseIDToUpdate = res?.data?.data?.mainTable[0]?.CaseID;
            const indexToUpdate = caseData.data.findIndex(
                (item) => item?.CaseID === caseIDToUpdate
            );

            if (indexToUpdate !== -1) {
              caseData.data[indexToUpdate] = res?.data?.data?.mainTable[0];
            }

            const caseInfo = res?.data?.data?.angCaseInformation[0];
            caseInformation["Product"] = caseInfo.Product;

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

  //save and exit button
  const saveAndExit = async () => {

    callProcRef.current = "callProc";

    //const saveType = event.target.name === "saveAndSubmit" ? "SS" : "SE";
    const saveType = "SS";

    let apiJson = {};

    const angCaseHeader = trimJsonValues({...caseHeader});
    const angCaseTimelines = trimJsonValues({...caseTimelines});
    const angCaseInformation = trimJsonValues({...caseInformation});
    const angClaimInformation = trimJsonValues({...claimInformation});
    const angMemberInformation = trimJsonValues({...memberInformation});
    const angAuthorizationInformation = trimJsonValues({...authorizationInformation});
    const angExpeditedRequest = trimJsonValues({...expeditedRequest});

    const angClaimInformationGrid = getGridDataValues(claimInformationGrid);
    const originalClaimInformationGrid = getGridDataValues(formData["angClaimInformationGrid"]);

    const angProviderInformtionGrid = getGridDataValues(providerInformationGrid);
    const originalProviderInformationGrid = getGridDataValues(formData["angProviderInformationGrid"]);

    const angRepresentativeInformationGrid = getGridDataValues(representativeInformationGrid);
    const originalRepresentativeInformationGrid = getGridDataValues(formData["angRepresentativeInformationGrid"]);

    const angAuthorizationInformtionGrid = getGridDataValues(authorizationInformationGrid);
    const originalAuthorizationInformationGrid = getGridDataValues(formData["angAuthorizationInformationGrid"]);

    apiJson["ANG_Case_Header"] = CompareJSON(angCaseHeader, formData["angCaseHeader"][0]);
    apiJson["ANG_Case_Timelines"] = CompareJSON(angCaseTimelines, formData["angCaseTimelines"][0]);
    apiJson["ANG_Case_Information"] = CompareJSON(angCaseInformation, formData["angCaseInformation"][0]);
    apiJson["ANG_Claim_Information"] = CompareJSON(angClaimInformation, formData["angClaimInformation"][0]);
    apiJson["ANG_Member_Information"] = CompareJSON(angMemberInformation, formData["angMemberInformation"][0]);
    apiJson["ANG_Authorization_Information"] = CompareJSON(angAuthorizationInformation, formData["angAuthorizationInformation"][0]);
    apiJson["ANG_Expedited_Request"] = CompareJSON(angExpeditedRequest, formData["angExpeditedRequest"][0]);

    let updateClaimArray = [];
    if (angClaimInformationGrid.length > 0 || originalClaimInformationGrid.length > 0) {
      const maxLength = Math.min(angClaimInformationGrid.length, originalClaimInformationGrid.length);

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = angClaimInformationGrid[i];

        for (let j = 0; j < originalClaimInformationGrid.length; j++) {
          const originalElement = originalClaimInformationGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateClaimArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement)
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < angClaimInformationGrid.length; i++) {
        const angelement = angClaimInformationGrid[i];
        const index = originalClaimInformationGrid.findIndex(element => angelement.rowNumber === element.rowNumber);

        if (index === -1) {
          if (!angelement.hasOwnProperty('caseNumber')) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateClaimArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalClaimInformationGrid.length; i++) {
        const originalElement = originalClaimInformationGrid[i];
        const index = angClaimInformationGrid.findIndex(element => originalElement.rowNumber === element.rowNumber);
        if (index === -1) {
          updateClaimArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"]
          });
        }
      }
    }

    let updateProviderArray = [];
    if (angProviderInformtionGrid.length > 0 || originalProviderInformationGrid.length > 0) {
      const maxLength = Math.min(angProviderInformtionGrid.length, originalProviderInformationGrid.length);

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = angProviderInformtionGrid[i];

        for (let j = 0; j < originalProviderInformationGrid.length; j++) {
          const originalElement = originalProviderInformationGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateProviderArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement)
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < angProviderInformtionGrid.length; i++) {
        const angelement = angProviderInformtionGrid[i];
        const index = originalProviderInformationGrid.findIndex(element => angelement.rowNumber === element.rowNumber);

        if (index === -1) {
          if (!angelement.hasOwnProperty('caseNumber')) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateProviderArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalProviderInformationGrid.length; i++) {
        const originalElement = originalProviderInformationGrid[i];
        const index = angProviderInformtionGrid.findIndex(element => originalElement.rowNumber === element.rowNumber);
        if (index === -1) {
          updateProviderArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"]
          });
        }
      }
    }

    let updateRepresentativeArray = [];
    if (angRepresentativeInformationGrid.length > 0 || originalRepresentativeInformationGrid.length > 0) {
      const maxLength = Math.min(angRepresentativeInformationGrid.length, originalRepresentativeInformationGrid.length);

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = angRepresentativeInformationGrid[i];

        for (let j = 0; j < originalRepresentativeInformationGrid.length; j++) {
          const originalElement = originalRepresentativeInformationGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateRepresentativeArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement)
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < angRepresentativeInformationGrid.length; i++) {
        const angelement = angRepresentativeInformationGrid[i];
        const index = originalRepresentativeInformationGrid.findIndex(element => angelement.rowNumber === element.rowNumber);

        if (index === -1) {
          if (!angelement.hasOwnProperty('caseNumber')) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateRepresentativeArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalRepresentativeInformationGrid.length; i++) {
        const originalElement = originalRepresentativeInformationGrid[i];
        const index = angRepresentativeInformationGrid.findIndex(element => originalElement.rowNumber === element.rowNumber);
        if (index === -1) {
          updateRepresentativeArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"]
          });
        }
      }
    }

    let updateAuthorizationArray = [];
    if (angAuthorizationInformtionGrid.length > 0 || originalAuthorizationInformationGrid.length > 0) {
      const maxLength = Math.min(angAuthorizationInformtionGrid.length, originalAuthorizationInformationGrid.length);

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = angAuthorizationInformtionGrid[i];

        for (let j = 0; j < originalAuthorizationInformationGrid.length; j++) {
          const originalElement = originalAuthorizationInformationGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateAuthorizationArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement)
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < angAuthorizationInformtionGrid.length; i++) {
        const angelement = angAuthorizationInformtionGrid[i];
        const index = originalAuthorizationInformationGrid.findIndex(element => angelement.rowNumber === element.rowNumber);

        if (index === -1) {
          if (!angelement.hasOwnProperty('caseNumber')) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateAuthorizationArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalAuthorizationInformationGrid.length; i++) {
        const originalElement = originalAuthorizationInformationGrid[i];
        const index = angAuthorizationInformtionGrid.findIndex(element => originalElement.rowNumber === element.rowNumber);
        if (index === -1) {
          updateAuthorizationArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"]
          });
        }
      }
    }

    apiJson["ANG_Claim_Information_Grid"] = updateClaimArray;
    apiJson["ANG_Provider_Information_Grid"] = updateProviderArray;
    apiJson["ANG_Representative_Information_Grid"] = updateRepresentativeArray;
    apiJson["ANG_Authorization_Information_Grid"] = updateAuthorizationArray;

    apiJson["caseNumber"] = location.state.caseNumber;

    customAxios.post("/generic/update", apiJson, {
      headers: {Authorization: `Bearer ${token}`},
    }).then((res) => {

      const apiStat = res.data.UpdateCase_Output.Status;

      if (apiStat === -1) {
        alert("Error in updating data");
      }

      if (apiStat === 0) {
        updateDecision(location, saveType, "Appeals");
        let procData = {};
        let procDataState = {};
        procDataState.stageName = location.state.stageName;
        procDataState.flowId = location.state.flowId;
        procDataState.decisionNotes = location.state.decisionNotes;
        procDataState.caseNumber = location.state.caseNumber;
        procDataState.decision = location.state.decision;

        procDataState.decisionReason = location.state.decisionReason;
        procDataState.userName = mastersSelector.hasOwnProperty("auth")
            ? mastersSelector.auth.hasOwnProperty("userName")
                ? mastersSelector.auth.userName
                : "system"
            : "system";
        procDataState.formNames = 'Appeals';
        procData.state = procDataState;

        alert(
            "Case updated successfully: " +
            location.state.caseNumber
        );
        submitCase(procData, navigateHome);
        navigateHome();
      }
    });
  }

  return {
    caseTimelines,
    caseTimelinesValidationSchema,
    setCaseTimelines,
    handleCaseHeaderChange,
    caseHeader,
    handleCaseInformationChange,
    caseInformation,
    setCaseInformation,
    caseInformationValidationSchema,
    handleClaimInformationChange,
    claimInformation,
    claimInformationGrid,
    setClaimInformationGrid,
    providerInformationGrid,
    setProviderInformationGrid,
    handleMemberInformationChange,
    memberInformation,
    representativeInformationGrid,
    setRepresentativeInformationGrid,
    handleAuthorizationInformationChange,
    authorizationInformation,
    authorizationInformationGrid,
    setAuthorizationInformationGrid,
    handleExpeditedRequestChange,
    expeditedRequest,
    location,
    navigateHome,
    saveAndExit,
    submitData,
    potentialDupData,
    handleActionSelectChange,
    apiTestState,
    callProcRef,
    hasSubmitError
  }
}