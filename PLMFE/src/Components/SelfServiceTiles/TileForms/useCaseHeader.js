import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "../../../api/axios.hook";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import _ from "lodash";

import TableComponent from "../../../../src/util/TableComponent";

export const useCaseHeader = () => {
  const currentDate = new Date();
  const location = useLocation();
  const [hasSubmitError, setHasSubmitError] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [showMember360, setShowMember360] = useState(false);
  const [showProvider360, setShowProvider360] = useState(false);
  const [showNotesHistory, setShowNotesHistory] = useState(false);
  const [shouldShowSubmitError, setShowSubmitError] = useState(false);
  const { fileUpDownAxios } = useAxios();
  let documentSectionDataRef = useRef([]);
  const authSelector = useSelector((state) => state.auth);

  const [caseHeader, setCaseHeader] = useState({
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
    caseNumber: "",
  });

  const [caseTimelines, setCaseTimelines] = useState({
    caseNumber: "",
    Acknowledgment_Timely: "",
    AOR_Received_Date: undefined,
    Case_Aging: "",
    Case_Filing_Method: "",
    Case_in_Compliance: "No",
    Case_Received_Date: currentDate,
    Compliance_Time_Left_to_Finish: "",
    Out_of_Compliance_Reason: "Case still tf.",
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
    Review_Type: "",
  });
  const [claimInformation, setClaimInformation] = useState({
    caseNumber: "",
    Authorization_Number: "",
    Claim_Decision: "",
    Claim_Number: "",
    Claim_type: "",
    Claim_Adjusted_Date: undefined,
    Decision_Reason: "",
    Denied_As_Of_Date: undefined,
    Effectuation_Notes: "",
    Original_Denial_Date: undefined,
    Processing_Status: "",
    Payment_Method: "",
    Payment_Number: "",
    Payment_Date: undefined,
    Payment_Mail_Date_Postmark: undefined,
    Reason_Text: "",
    Service_Type: "",
    Service_Start_Date: undefined,
    Service_End_Date: undefined,
  });
  const [memberInformation, setMemberInformation] = useState({
    caseNumber: "",
    Address_Line_1: "",
    Address_Line_2: "",
    City: "",
    Communication_Preference: "",
    ContractPlan_ID: "",
    County: "",
    Date_of_Birth: undefined,
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
    Plan_Effective_Date: undefined,
    Plan_Expiration_Date: undefined,
    Plan_Name: "",
    Preferred_Language: "",
    Primary_Care_Physician_PCP: "",
    Special_Need_Indicator: "",
    State_: "",
    Zip_Code: "",
    //WhiteGloveReason: "",
    //WhiteGloveCancelledReason: "",
  });
  const [expeditedRequest, setExpeditedRequest] = useState({
    Expedited_Requested: "",
    Expedited_Reason: "",
    Standard_Upgraded_to_Expedited: "",
    Expedited_Denied: "",
    Expedited_Upgrade_Date_Time: undefined,
    Expedited_Denied_Date: undefined,
    Decision_Letter_Date: undefined,
  });

  const [notes, setNotes] = useState({
    Case_Notes: "",
    Internal_Notes: "",
  });
  const [claimInformationGrid, setClaimInformationGrid] = useState([]);
  const [providerInformationGrid, setProviderInformationGrid] = useState([]);
  const [authorizationInformationGrid, setAuthorizationInformationGrid] =
    useState([]);

  const conditionalActivateOnStage = (stages, errorMessage) =>
    stages.includes(location.state?.stageName?.toLowerCase())
      ? Yup.string().notRequired()
      : Yup.string().required(errorMessage);
  const conditionalString = (dependsOn, valueEquals, validationMsg) =>
    Yup.string().when(dependsOn, {
      is: (value) => value === valueEquals,
      then: (schema) => schema.required(validationMsg),
      otherwise: (schema) => schema.notRequired(),
    });
  const conditionalLabelValue = (dependsOn, valueEquals, validationMsg) =>
    Yup.object({
      value: Yup.string().when(dependsOn, {
        is: (value) => value?.value === valueEquals,
        then: (schema) => schema.required(validationMsg),
        otherwise: (schema) => schema.notRequired(),
      }),
    });

  const pair1 = [
    "intake",
    "acknowledge",
    "re-direct review",
    "documents needed",
  ];
  const pair2 = [
    "intake",
    "acknowledge",
    "re-direct review",
    "documents needed",
    "research",
  ];

  const caseTimelinesValidationSchema = Yup.object().shape({
    Case_Filing_Method: Yup.string().required(
      "Case Filing Method is mandatory",
    ),
    Acknowledgment_Timely: Yup.string().required(
      "Case Acknowledgment Timely is mandatory",
    ),
    Case_in_Compliance: Yup.string().required(
      "Case in Compliance is mandatory",
    ),
    Out_of_Compliance_Reason: Yup.string().required(
      "Out of Compliance Reason is mandatory",
    ),
    Case_Received_Date: Yup.date()
      .required("Case Received Date is mandatory")
      .max(new Date(), "Case Received  Date cannot be in future"),
    AOR_Received_Date: Yup.date()
      .required("AOR Received Date is mandatory")
      .max(new Date(), "AOR Received Date cannot be in future"),
    WOL_Received_Date: Yup.date()
      .required("WOL Received Date is mandatory")
      .max(new Date(), "WOL Received Date cannot be in future"),
  });
  const caseInformationValidationSchema = Yup.object().shape({
    Line_of_Business_LOB: Yup.string().required(
      "Line of Business is mandatory",
    ),
    Case_Level_Priority: Yup.string().required(
      "Case Level Priority is mandatory",
    ),
    Appellant_Description: Yup.string().required(
      "Appellant Description is mandatory",
    ),
    Research_Type: Yup.string().required("Research Type is mandatory"),
    Denial_Type: Yup.string().required("Denial Type is mandatory"),
    // Denied_As_Of_Date: Yup.date().required(
    //     "Denied As Of Date is mandatory",
    // ),
    // Service_Type: Yup.string().required("Service Type is mandatory"),
    // Decision_Reason: Yup.string().required("Decision Reason is mandatory"),
    // Filed_Timely: Yup.string().required("Filed Timely is mandatory"),
    LOB_Description: Yup.string().required("LOB Description is mandatory"),
    Product_State: Yup.string().required("Product State is mandatory"),
    Product: Yup.string().required("Product is mandatory"),
    Product_Type: Yup.string().required("Product Type is mandatory"),
    Appeal_Type: Yup.string().required("Appeal Type is mandatory"),
    Appellant_Type: Yup.string().required("Appellant Type is mandatory"),
    Review_Type: Yup.string().required("Review Type is mandatory"),
  });
  const claimInformationValidationSchema = Yup.object().shape({
    // Payment_Method: conditionalActivateOnStage(
    //   pair1,
    //   "Payment Method is mandatory",
    // ),
    // Filed_Timely: Yup.string().required("Filed Timely is mandatory"),
    /*Claim_Decision: conditionalActivateOnStage(
      pair1,
      "Claim Decision is mandatory",
    ),
    Service_Type: conditionalActivateOnStage(
      pair2,
      "Service Type is mandatory",
    ),*/
    Reason_Text: conditionalString(
      "Processing_Status",
      "NOT ADJUSTED",
      "Reason Text is mandatory",
    ) /*
    // Decision_Reason: conditionalActivateOnStage(
    //   pair1,
    //   "Decision Reason is mandatory",
    // ),
    // Payment_Number: conditionalActivateOnStage(
    //   pair1,
    //   "Payment Number is mandatory",
    // ),
    // Effectuation_Notes: conditionalActivateOnStage(
    //   pair1,
    //   "Effectuation Notes is mandatory",
    // ),
    // Claim_Adjusted_Date: conditionalActivateOnStage(
    //   pair1,
    //   "Claim Adjusted Date is mandatory",
    // ),
    Payment_Mail_Date_Postmark: Yup.date().required(
      "Payment Mail Date Postmark is mandatory",
    ),*/,
  });
  const memberInformationValidationSchema = Yup.object().shape({
    Email_ID: conditionalString(
      "Communication_Preference",
      "EMAIL",
      "Email ID is mandatory",
    ),
    Fax_Number: conditionalString(
      "Communication_Preference",
      "FAX",
      "Fax Number is mandatory",
    ),
    Member_First_Name: Yup.string().required("Member First Name is mandatory"),
    Member_Last_Name: Yup.string().required("Member Last Name is mandatory"),
    ContractPlan_ID: Yup.string().required("Contract Plan ID is mandatory"),
    Plan_Code: Yup.string().required("Plan Code is mandatory"),
    Member_IPA: Yup.string().required("Member IPA is mandatory"),
    //PBP: Yup.string().required("PBP is mandatory"),
    Primary_Care_Physician_PCP: Yup.string().required(
      "Primary Care Physician PCP is mandatory",
    ),
    PCP_ID: Yup.string().required("PCP ID is mandatory"),
    Members_Age: Yup.string().required("Members Age is mandatory"),
    Deceased: Yup.string().required("Deceased is mandatory"),
    Gender: Yup.string().required("Gender is mandatory"),
    Dual_Plan: Yup.string().required("Dual Plan is mandatory"),
    Preferred_Language: Yup.string().required(
      "Preferred Language is mandatory",
    ),
    Mail_to_Address: Yup.string().required("Mail to Address is mandatory"),
    Address_Line_1: Yup.string().required("Address Line 1 is mandatory"),
    City: Yup.string().required("City is mandatory"),
    State_: Yup.string().required("State is mandatory"),
    // Email_Address: Yup.string().required("Email Address is mandatory"),
    Medicaid_ID: Yup.string().required("Medicaid ID is mandatory"),
    Zip_Code: Yup.string().required("Zip code Address is mandatory"),
    Plan_Effective_Date: Yup.string().required(
      "Plan Effective Date Address is mandatory",
    ),
    Plan_Expiration_Date: Yup.string().required(
      "Plan Expiration Date Address is mandatory",
    ),
    Date_of_Birth: Yup.string().required("Date of Birth Address is mandatory"),
    Special_Need_Indicator: Yup.string().required(
      "Special Need Indicator Address is mandatory",
    ),
  });
  const expeditedRequestValidationSchema = Yup.object().shape({});
  const notesValidationSchema = Yup.object().shape({
    Case_Notes: Yup.string().required("Case Notes is mandatory"),
  });
  const claimInformationGridRowValidationSchema = Yup.object().shape({
    Filed_Timely: Yup.string().required(
        "Filed Timely Address is mandatory",
    ),
    Grant_Good_Cause: conditionalString(
      "Filed_Timely",
      "NO",
      "Grant Good Cause is mandatory",
    ),
    Good_Cause_Reason: conditionalString(
      "Grant_Good_Cause",
      "YES",
      "Grant Good Reason is mandatory",
    ),
  });
  const providerInformationGridValidationSchema = Yup.object().shape({
    Point_of_Contact: Yup.string().required("Point of Contact is mandatory"),
    Sequential_Provider_ID: Yup.string().required(
       "Sequential Provider ID is mandatory",
    ),
    Provider_Name: Yup.string().required("Provider Name is mandatory"),
    Provider_TIN: Yup.string().required("Provider TIN is mandatory"),
    Participating_Provider: Yup.string().required(
      "Participating Provider is mandatory",
    ),
    Provider_Type: Yup.string().required("Provider Type is mandatory"),
    Provider_Vendor_Specialty: Yup.string().required(
       "Provider Vendor Specialty is mandatory",
    ),
    Mail_to_Address: Yup.string().required("Mail to Address is mandatory"),
    Address_Line_1: Yup.string().required("Address Line 1 is mandatory"),
    City: Yup.string().required("City is mandatory"),
    State: Yup.string().required("State is mandatory"),
    Zip_Code: Yup.string().required("Zip Code is mandatory"),
    Provider_ID: Yup.string().required("Provider ID is mandatory"),
    NPI_ID: Yup.string().required("NPI ID is mandatory"),
    Par_Provider_Start_Date: Yup.string().required(
       "Par Provider Start Date is mandatory",
    ),
    Par_Provider_End_Date: Yup.string().required(
      "Par Provider End Date is mandatory",
    ),
    Vendor_ID: Yup.string().required("Vendor ID is mandatory"),
    Vendor_Name: Yup.string().required("Vendor_Name is mandatory"),
    Email_Address: conditionalString(
      "Communication_Preference",
      "EMAIL",
      "Email Address is mandatory",
    ),
    Fax_Number: conditionalString(
      "Communication_Preference",
      "FAX",
      "Fax Number is mandatory",
    ),
    Provider_Contact_Name: conditionalString(
      "Mail_to_Address",
      "ALTERNATE",
      "Provider Contact Name is mandatory",
    ),
  });
  const authorizationInformationGridValidationSchema = Yup.object().shape({});
  const representativeInformationGridValidationSchema = Yup.object().shape({
    Communication_Preference: Yup.string().required("Communication Preference is mandatory"),
    Email_Address: conditionalString(
      "Communication_Preference",
      "EMAIL",
      "Email Address is mandatory",
    ),
    Fax_Number: conditionalString(
      "Communication_Preference",
      "FAX",
      "Fax Number is mandatory",
    ),
  });

  const [caseTimelinesErrors, setCaseTimelinesErrors] = useState([]);
  const [caseInformationErrors, setCaseInformationErrors] = useState([]);
  const [claimInformationErrors, setClaimInformationErrors] = useState([]);
  const [memberInformationErrors, setMemberInformationErrors] = useState([]);
  const [expeditedRequestErrors, setExpeditedRequestErrors] = useState([]);
  const [notesErrors, setNotesErrors] = useState([]);

  const validateSync = (schema, data, setErrors) => {
    try {
      setErrors([]);
      schema.validateSync(data, { abortEarly: false });
    } catch (errors) {
      const validationErrors = errors.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setErrors(validationErrors);
      console.log(
        "errors were encountered while processing schema",
        validationErrors,
      );
    }
  };

  useEffect(() => {
    validateSync(
      caseTimelinesValidationSchema,
      caseTimelines,
      setCaseTimelinesErrors,
    );
    validateSync(
      caseInformationValidationSchema,
      caseInformation,
      setCaseInformationErrors,
    );
    validateSync(
      claimInformationValidationSchema,
      claimInformation,
      setClaimInformationErrors,
    );
    validateSync(
      memberInformationValidationSchema,
      memberInformation,
      setMemberInformationErrors,
    );
    validateSync(
      expeditedRequestValidationSchema,
      expeditedRequest,
      setExpeditedRequestErrors,
    );
    validateSync(notesValidationSchema, notes, setNotesErrors);
  }, [
    caseTimelines,
    caseInformation,
    claimInformation,
    memberInformation,
    expeditedRequest,
    providerInformationGrid,
    authorizationInformationGrid,
  ]);

  useEffect(() => {
    setHasSubmitError(
      Object.keys({
        ...caseTimelinesErrors,
        ...caseInformationErrors,
        ...claimInformationErrors,
        ...memberInformationErrors,
        ...expeditedRequestErrors,
      }).length > 0,
    );
  }, [
    caseTimelinesErrors,
    caseInformationErrors,
    claimInformationErrors,
    memberInformationErrors,
    expeditedRequestErrors,
  ]);
  const [disableSaveAndExit, setDisableSaveAndExit] = useState(true);
  const [authorizationInformation, setAuthorizationInformation] = useState({
    Authorization_Decision: "",
    Authorization_Decision_Reason: "",
  });
  // const [decisionTab, setDecisionTab] = useState({
  //   Decision: "",
  //   Decision_Reason: "",
  //   Decision_Case_Notes: ""
  // });

  // useEffect(() => {
  //   setDisableSaveAndExit(!decisionTab?.Decision_Case_Notes?.trim())
  // }, [decisionTab]);

  const submitData = async () => {
    if (hasSubmitError) {
      setShowSubmitError(true);
      return;
    }
    const currentUser = authSelector.userName || "system";
    const receivedDate = extractDate(currentDate);
    const updatedCaseHeader = {
      ...caseHeader,
      Case_Owner: currentUser,
      Case_Received_Date: receivedDate,
      Case_Validation: "Valid",
    };
    let apiJson = {};

    const angClaimInformationGrid = getGridDataValues(claimInformationGrid);
    const angProviderInformationGrid = getGridDataValues(
      providerInformationGrid,
    );
    const angRepresentativeInformationGrid = getGridDataValues(
      representativeInformationGrid,
    );
    const angAuthorizationInformationGrid = getGridDataValues(
      authorizationInformationGrid,
    );

    const angCaseHeader = trimJsonValues({ ...updatedCaseHeader });
    const angCaseTimelines = trimJsonValues({ ...caseTimelines });
    const angCaseInformation = trimJsonValues({ ...caseInformation });
    const angClaimInformation = trimJsonValues({ ...claimInformation });
    const angMemberInformation = trimJsonValues({ ...memberInformation });
    const angAuthorizationInformation = trimJsonValues({
      ...authorizationInformation,
    });
    const angExpeditedRequest = trimJsonValues({ ...expeditedRequest });
    const angNotes = trimJsonValues({ ...notes });

    apiJson["ANG_Case_Header"] = angCaseHeader;
    apiJson["ANG_Case_Timelines"] = angCaseTimelines;
    apiJson["ANG_Case_Information"] = angCaseInformation;
    apiJson["ANG_Claim_Information"] = angClaimInformation;
    apiJson["ANG_Claim_Information_Grid"] = angClaimInformationGrid;
    apiJson["ANG_Provider_Information_Grid"] = angProviderInformationGrid;
    apiJson["ANG_Member_Information"] = angMemberInformation;
    apiJson["ANG_Representative_Information_Grid"] =
      angRepresentativeInformationGrid;
    apiJson["ANG_Authorization_Information"] = angAuthorizationInformation;
    apiJson["ANG_Authorization_Information_Grid"] =
      angAuthorizationInformationGrid;
    apiJson["ANG_Expedited_Request"] = angExpeditedRequest;
    apiJson["ANG_Notes"] = angNotes;
    let mainCaseReqBody = {
      ...mainCaseDetails,
      caseStatus: "Open",
      lockStatus: "N",
    };

    const flowId = caseHeaderConfigData["FlowId"];
    const stageName = caseHeaderConfigData["StageName"];

    apiJson["MainCaseTable"] = mainCaseReqBody;

    const response = await customAxios.post("/generic/create", apiJson, {
      headers: { Authorization: `Bearer ${token}` },
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
      procDataState.userName = authSelector.userName || "system";
      procDataState.formNames = "Appeals";
      procData.state = procDataState;
      if (documentSectionDataRef.current.length > 0) {
        const documentArray = [...documentSectionDataRef.current].filter(
          (x) => x.docStatus === "Uploaded",
        );
        documentArray.forEach((e) => {
          const fileUploadData = new FormData();
          fileUploadData.append("file", e.fileData);
          fileUploadData.append("source", "Manual");
          fileUploadData.append(
            "caseNumber",
            response.data["CreateCase_Output"]["CaseNo"],
          );
          fileUploadData.append("docType", e.documentType);
          fileUpDownAxios.post("/uploadFile", fileUploadData).then(() => {});
        });
      }
      alert(
        "Case created successfully: " +
          response.data["CreateCase_Output"]["CaseNo"],
      );
      submitCase(procData, navigateHome);
    }
  };

  const navigate = useNavigate();
  const navigateHome = async () => {
    navigate("/DashboardLogin/Home", { replace: true });
    if (location.state.formView === "DashboardView") {
      const promise = new Promise((resolve, reject) => {
        resolve(updateLockStatus("N", location.state.caseNumber, 0, ""));
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
  };

  const caseData = useSelector((store) => store.dashboardNavigationState);
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const [potentialDupData] = useState([]);
  const [apiTestState] = useState({
    delegated: "",
  });

  const [formData, setFormData] = useState({});

  const [representativeInformationGrid, setRepresentativeInformationGrid] =
    useState([]);

  const [mainCaseDetails, setMainCaseDetails] = useState({
    flowId: 0,
    stageName: "",
    stageId: 0,
    transactionType: "",
    caseStatus: "",
  });

  const callProcRef = useRef(null);

  useEffect(() => {
    let caseheaderConfigData = JSON.parse(
      process.env.REACT_APP_CASEHEADER_DETAILS,
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
  }, []);

  useEffect(() => {
    if (
      location.state.formView !== undefined &&
      location.state.formView === "DashboardView"
    ) {
      getCaseByCaseNumber();
    }
  }, []);

  const dispatch = useDispatch();
  const { customAxios } = useAxios();
  const { trimJsonValues, extractDate, getTableDetails } = useGetDBTables();
  const { submitCase, updateLockStatus, updateDecision, CompareJSON } =
    useUpdateDecision();

  const token = authSelector.token || "";

  const handleCaseHeaderChange = (value, name) => {
    setCaseHeader({ ...caseHeader, [name]: value });
  };
  const handleAuthorizationInformationChange = (value, name) => {
    setAuthorizationInformation({ ...authorizationInformation, [name]: value });
  };

  const handleShowMember360 = () => {
    setShowMember360(true);
    if (memberInformation.Member_ID) {
      populateModalTable("MEMBER360DATA", memberInformation.Member_ID);
    }
  };
  const handleCloseMember360 = () => {
    setShowMember360(false);
    setResponseData([]);
  };

  const handleShowProvider360 = () => {
    setShowProvider360(true);
    if (providerInformationGrid.length !== 0) {
      const providerIds = providerInformationGrid
        .map((item) => item["Provider_ID"])
        .filter((id) => id !== undefined)
        .map((item) => item["value"]);

      providerIds.forEach((providerId) => {
        populateModalTable("PROVIDER360DATA", providerId);
      });
    }
  };
  const handleCloseProvider360 = () => {
    setShowProvider360(false);
    setResponseData([]);
  };

  const handleShowNotesHistory= () => {
    setShowNotesHistory(true)
    if (notes.Case_Notes || notes.Internal_Notes || memberInformation.WhiteGloveReason || memberInformation.WhiteGloveCancelledReason) {
      populateModalTable("NOTESHISTORY",location.state.caseNumber);
    }
  };
  const handleCloseNotesHistory = () => {
    setShowNotesHistory(false);
    setResponseData([]);
  };

  const modalTableComponent = (isProvider) => {
    let columnNames = "";
    let caseNotesData = responseData[0]?.NotesHistory;
    let whiteGloveData = responseData[0]?.WhiteGloveHistory;
    let internalNotes = responseData[0]?.InternalNotesHistory;
    if (isProvider === "member360") {
      columnNames =
        "Process~Process, Case ID~CaseID, Creation Date~CreationDate, Member ID~MemberID, Complaint type~AppellantType, Status~Status, Assigned To~AssignedTo, Issue Level~IssueLevel, Case Received Date~CaseReceivedDate, Case Due Date~CaseDueDate, Case Decision~CaseDecision";

      return (
        <div>
          <TableComponent columnName={columnNames} rowValues={responseData} />
        </div>
      );
    } else if (isProvider === "provider360") {
      columnNames =
        "Case ID~CaseID, Level Number~LevelNumber, Previous Level Case Number~PreviousLevelCase, Previous Level Number~PreviousLevelNumber, Provider ID~ProviderID, Provider Name~ProviderName, Provider TIN~ProviderTIN, Provider NPI~ProviderNPI, Vendor ID~VendorID, Issue Level~IssueLevel, Case Received Date~CaseReceivedDate, Resolution Date~ResolutionDate, Claims Linked~ClaimsLinked, Case Status~CaseStatus";

      return (
        <div>
          <TableComponent columnName={columnNames} rowValues={responseData} />
        </div>
      );
    } else if (isProvider === "notesHistory") {
      return (
        <>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-Instructions">
              <button
                className="accordion-button accordionButtonStyle"
                type="button"
              >
                Case Notes
              </button>
            </h2>
            <div>
              <TableComponent
                columnName="Date Time~Date time, User Name~User Name, Notes~Notes, Workstep~Workstep"
                rowValues={caseNotesData}
              />
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-Instructions">
              <button
                className="accordion-button accordionButtonStyle"
                type="button"
              >
                Internal Case Notes
              </button>
            </h2>
            <div>
              <TableComponent
                columnName="Date Time~Date time, User Name~User Name, InternalNotes~InternalNotes, Workstep~Workstep"
                rowValues={internalNotes}
              />
            </div>
          </div>
          <div className="accordion-item">
            <h2 className="accordion-header" id="panelsStayOpen-Instructions">
              <button
                className="accordion-button accordionButtonStyle"
                type="button"
              >
                White Glove Reason
              </button>
            </h2>
            <div>
              <TableComponent
                columnName="Date Time~Date time, User Name~User Name, Entity ID~Entity ID, Entity Name~Entity Name, White Glove Reason~WhiteGloveReason, White Glove Cancelled Reason~WhiteGloveCancelledReason, Workstep~Workstep"
                rowValues={whiteGloveData}
              />
            </div>
          </div>
        </>
      );
    }

    return null;
  };

  const populateModalTable = async (option, id) => {
    let getApiJson = {};

    if (option === "MEMBER360DATA") {
      getApiJson = {
        option: option,
        CaseID: "",
        CreationDate: "",
        MemberID: memberInformation.Member_ID || "",
      };
    } else if (option === "PROVIDER360DATA") {
      getApiJson = {
        option: option,
        ProviderID: id || "",
      };
    } else if (option === "NOTESHISTORY") {
      getApiJson = {
        option: option,
        WhiteGloveReason: memberInformation.WhiteGloveReason,
        WhiteGloveCancelledReason: memberInformation.WhiteGloveCancelledReason,
        Notes: notes.Case_Notes,
        InternalNotes: notes.Internal_Notes,
        CaseID: id || "",
      };
    }

    try {
      let res = await customAxios.post("/generic/callProcedure", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let resApiData = res.data.CallProcedure_Output?.data || [];
      resApiData = resApiData?.length > 0 ? resApiData : [];

      if (resApiData.length > 0) {
        const respKeys = Object.keys(resApiData);
        setResponseData((responseData) => [resApiData[0], ...responseData]);
      }

      const apiStat = res.data.CallProcedure_Output.Status;
      if (apiStat === -1) {
        alert("Error in fetching data");
      }
    } catch (error) {
      console.error("API Error:", error);
      alert("Error in fetching data. Please try again later.");
    }
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
          if (data[dataValue]) {
            if (data[dataValue].value) {
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

  const getCaseStatus = async (stageName) => {
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["angCaseStatusTable"];
    getApiJson["whereClause"] = { WORKSTEP: stageName };

    try {
      const res = await customAxios.post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiStat = res.data.Status;

      if (apiStat === -1) {
        alert("Error in fetching case status.");
        return null;
      }

      if (apiStat === 0) {
        const caseStatusData = res.data.data.angCaseStatus;
        if (caseStatusData && caseStatusData.length > 0) {
          return caseStatusData[0].CASE_STATUS;
        } else {
          return null;
        }
      }
    } catch (error) {
      console.error("API request error:", error);
      alert("An error occurred while fetching case status.");
      return null;
    }
  };

  function hasAnyNonEmptyValue(obj, keys) {
    return keys.some((key) => obj[key]?.trim() !== "");
  }

  function calculateCaseDueDate(
    caseReceivedDate,
    caseLevelPriority,
    appealType,
    appellant_Type,
  ) {
    if (appellant_Type !== "MEMBER" && appellant_Type !== "PROVIDER") {
      return { dueDate: "", internalDate: "" };
    }

    if (!caseReceivedDate) return { dueDate: null, internalDate: null };

    const caseReceivedDateObj = new Date(caseReceivedDate);
    let dueDate;
    let internalDate;

    switch (caseLevelPriority) {
      case "EXPEDITED":
        dueDate = new Date(caseReceivedDateObj.getTime() + 72 * 60 * 60 * 1000);
        internalDate = dueDate;
        break;
      case "STANDARD":
        dueDate = new Date(
          caseReceivedDateObj.getTime() + 30 * 24 * 60 * 60 * 1000,
        );
        if (appealType === "PRE-SERVICE") {
          internalDate = new Date(
            caseReceivedDateObj.getTime() + 25 * 24 * 60 * 60 * 1000,
          );
        } else if (appealType === "RETRO") {
          internalDate = new Date(
            caseReceivedDateObj.getTime() + 30 * 24 * 60 * 60 * 1000,
          );
        }
        break;
      default:
        dueDate = caseReceivedDateObj;
        internalDate = caseReceivedDateObj;
        break;
    }

    return { dueDate, internalDate };
  }

  const getCaseByCaseNumber = async () => {
    let daysLeft, hoursLeft, minutesLeft, secondsLeft;
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["angTables"];
    getApiJson["whereClause"] = { caseNumber: location.state.caseNumber };
    try {
      // Make API request
      const res = await customAxios.post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const apiStat = res.data.Status;

      // Handle API status errors
      if (apiStat === -1) {
        alert("Error in fetching case data.");
        return;
      }

      if (apiStat === 0) {
        const data = res.data.data;
        // Extract data
        const stageName = location.state.stageName;
        const caseStatus = await getCaseStatus(stageName);
        const caseReceivedDate = new Date(
          data.angCaseHeader[0]["Case_Received_Date#date"],
        );

        const caseInfo = data?.["angCaseInformation"]?.[0];
        const keysToCheck = [
          "Product",
          "Product_State",
          "Line_of_Business_LOB",
        ];
        const hasAnyValue = hasAnyNonEmptyValue(caseInfo, keysToCheck);

        if (caseInfo && hasAnyValue) {
          const caseLevelPriority = caseInfo.Case_Level_Priority;
          const appealType = caseInfo.Appeal_Type;
          const appellant_Type = caseInfo.Appellant_Type;
          const { dueDate, internalDate } = calculateCaseDueDate(
            caseReceivedDate,
            caseLevelPriority,
            appealType,
            appellant_Type,
          );
          const currentDate = new Date();

          const caseDueDateString = extractDate(dueDate);
          const internalDueDateString = extractDate(internalDate);
          const finalcaseReceivedDate = extractDate(caseReceivedDate);

          const timeLeft = dueDate - currentDate

          daysLeft = Math.max(Math.floor(timeLeft / (1000 * 60 * 60 * 24)), 0);
          hoursLeft = Math.max(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)), 0);
          minutesLeft = Math.max(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)), 0);
          secondsLeft = Math.max(Math.floor((timeLeft % (1000 * 60)) / 1000), 0);

          setCaseHeader((prevState) => ({
            ...prevState,
            ...(data?.["angCaseHeader"]?.[0] || {}),
            Case_Received_Date: finalcaseReceivedDate,
            Case_Status: caseStatus || prevState.Case_Status,
            Case_Due_Date: caseDueDateString,
            Internal_Due_Date: internalDueDateString,
          }));
        } else {
          setCaseHeader((prevState) => ({
            ...prevState,
            ...(data?.["angCaseHeader"]?.[0] || {}),
            Case_Status: caseStatus || prevState.Case_Status,
          }));
        }
        // Calculate case aging
        const timeDifference = currentDate - caseReceivedDate;
        const caseAgingInDays = Math.floor(
          timeDifference / (1000 * 60 * 60 * 24)
        );
        const complianceTime = `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;

        setCaseTimelines((prevState) => ({
          ...prevState,
          ...(data?.["angCaseTimelines"]?.[0] || {}),
          Case_Aging: caseAgingInDays + " days",
         Compliance_Time_Left_to_Finish: complianceTime + " remaining",
        }));

        // Update other state values
       // setCaseTimelines(data?.["angCaseTimelines"]?.[0] || {});
        setCaseInformation(data?.["angCaseInformation"]?.[0] || {});
        setClaimInformation(data?.["angClaimInformation"]?.[0] || {});
        setClaimInformationGrid(data?.["angClaimInformationGrid"] || []);
        setProviderInformationGrid(data?.["angProviderInformationGrid"] || []);
        setMemberInformation(data?.["angMemberInformation"]?.[0] || {});
        setRepresentativeInformationGrid(
          data?.["angRepresentativeInformationGrid"] || [],
        );
        setAuthorizationInformation(
          data?.["angAuthorizationInformation"]?.[0] || {},
        );
        setAuthorizationInformationGrid(
          data?.["angAuthorizationInformationGrid"] || [],
        );
        setExpeditedRequest(data?.["angExpeditedRequest"]?.[0] || {});
        setNotes(data?.["angNotes"]?.[0] || {});
        setFormData(_.cloneDeep(data));

        // Update case data in caseData array
        const caseIDToUpdate = data?.mainTable?.[0]?.CaseID;
        const indexToUpdate = caseData.data.findIndex(
          (item) => item?.CaseID === caseIDToUpdate,
        );

        if (indexToUpdate !== -1) {
          caseData.data[indexToUpdate] = data?.mainTable?.[0];
        }

        // Update case information
        const caseInfoProduct = data?.angCaseInformation?.[0]?.Product;
        caseInformation["Product"] = caseInfoProduct;

        // Dispatch action to update data
        dispatch({
          type: "UPDATE_DATA",
          payload: {
            data: caseData.data,
          },
        });
      }
    } catch (error) {
      console.error("API request error:", error);
    }
  };

  //save and exit button
  const saveAndExit = async () => {
    callProcRef.current = "callProc";

    //const saveType = event.target.name === "saveAndSubmit" ? "SS" : "SE";
    const saveType = "SS";

    let apiJson = {};

    const angCaseHeader = trimJsonValues({ ...caseHeader });
    const angCaseTimelines = trimJsonValues({ ...caseTimelines });
    const angCaseInformation = trimJsonValues({ ...caseInformation });
    const angClaimInformation = trimJsonValues({ ...claimInformation });
    const angMemberInformation = trimJsonValues({ ...memberInformation });
    const angAuthorizationInformation = trimJsonValues({
      ...authorizationInformation,
    });
    const angExpeditedRequest = trimJsonValues({ ...expeditedRequest });
    const angNotes = trimJsonValues({ ...notes });

    const angClaimInformationGrid = getGridDataValues(claimInformationGrid);
    const originalClaimInformationGrid = getGridDataValues(
      formData["angClaimInformationGrid"],
    );

    const angProviderInformtionGrid = getGridDataValues(
      providerInformationGrid,
    );
    const originalProviderInformationGrid = getGridDataValues(
      formData["angProviderInformationGrid"],
    );

    const angRepresentativeInformationGrid = getGridDataValues(
      representativeInformationGrid,
    );
    const originalRepresentativeInformationGrid = getGridDataValues(
      formData["angRepresentativeInformationGrid"],
    );

    const angAuthorizationInformtionGrid = getGridDataValues(
      authorizationInformationGrid,
    );
    const originalAuthorizationInformationGrid = getGridDataValues(
      formData["angAuthorizationInformationGrid"],
    );

    apiJson["ANG_Case_Header"] = CompareJSON(
      angCaseHeader,
      formData["angCaseHeader"][0],
    );
    apiJson["ANG_Case_Timelines"] = CompareJSON(
      angCaseTimelines,
      formData["angCaseTimelines"][0],
    );
    apiJson["ANG_Case_Information"] = CompareJSON(
      angCaseInformation,
      formData["angCaseInformation"][0],
    );
    apiJson["ANG_Claim_Information"] = CompareJSON(
      angClaimInformation,
      formData["angClaimInformation"][0],
    );
    apiJson["ANG_Member_Information"] = CompareJSON(
      angMemberInformation,
      formData["angMemberInformation"][0],
    );
    apiJson["ANG_Authorization_Information"] = CompareJSON(
      angAuthorizationInformation,
      formData["angAuthorizationInformation"][0],
    );
    apiJson["ANG_Expedited_Request"] = CompareJSON(
      angExpeditedRequest,
      formData["angExpeditedRequest"][0],
    );
    apiJson["ANG_Notes"] = CompareJSON(angNotes, formData["angNotes"][0]);

    let updateClaimArray = [];
    if (
      angClaimInformationGrid.length > 0 ||
      originalClaimInformationGrid.length > 0
    ) {
      const maxLength = Math.min(
        angClaimInformationGrid.length,
        originalClaimInformationGrid.length,
      );

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = angClaimInformationGrid[i];

        for (let j = 0; j < originalClaimInformationGrid.length; j++) {
          const originalElement = originalClaimInformationGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateClaimArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement),
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < angClaimInformationGrid.length; i++) {
        const angelement = angClaimInformationGrid[i];
        const index = originalClaimInformationGrid.findIndex(
          (element) => angelement.rowNumber === element.rowNumber,
        );

        if (index === -1) {
          if (!angelement.hasOwnProperty("caseNumber")) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateClaimArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement,
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalClaimInformationGrid.length; i++) {
        const originalElement = originalClaimInformationGrid[i];
        const index = angClaimInformationGrid.findIndex(
          (element) => originalElement.rowNumber === element.rowNumber,
        );
        if (index === -1) {
          updateClaimArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"],
          });
        }
      }
    }

    let updateProviderArray = [];
    if (
      angProviderInformtionGrid.length > 0 ||
      originalProviderInformationGrid.length > 0
    ) {
      const maxLength = Math.min(
        angProviderInformtionGrid.length,
        originalProviderInformationGrid.length,
      );

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = angProviderInformtionGrid[i];

        for (let j = 0; j < originalProviderInformationGrid.length; j++) {
          const originalElement = originalProviderInformationGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateProviderArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement),
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < angProviderInformtionGrid.length; i++) {
        const angelement = angProviderInformtionGrid[i];
        const index = originalProviderInformationGrid.findIndex(
          (element) => angelement.rowNumber === element.rowNumber,
        );

        if (index === -1) {
          if (!angelement.hasOwnProperty("caseNumber")) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateProviderArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement,
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalProviderInformationGrid.length; i++) {
        const originalElement = originalProviderInformationGrid[i];
        const index = angProviderInformtionGrid.findIndex(
          (element) => originalElement.rowNumber === element.rowNumber,
        );
        if (index === -1) {
          updateProviderArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"],
          });
        }
      }
    }

    let updateRepresentativeArray = [];
    if (
      angRepresentativeInformationGrid.length > 0 ||
      originalRepresentativeInformationGrid.length > 0
    ) {
      const maxLength = Math.min(
        angRepresentativeInformationGrid.length,
        originalRepresentativeInformationGrid.length,
      );

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = angRepresentativeInformationGrid[i];

        for (let j = 0; j < originalRepresentativeInformationGrid.length; j++) {
          const originalElement = originalRepresentativeInformationGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateRepresentativeArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement),
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < angRepresentativeInformationGrid.length; i++) {
        const angelement = angRepresentativeInformationGrid[i];
        const index = originalRepresentativeInformationGrid.findIndex(
          (element) => angelement.rowNumber === element.rowNumber,
        );

        if (index === -1) {
          if (!angelement.hasOwnProperty("caseNumber")) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateRepresentativeArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement,
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalRepresentativeInformationGrid.length; i++) {
        const originalElement = originalRepresentativeInformationGrid[i];
        const index = angRepresentativeInformationGrid.findIndex(
          (element) => originalElement.rowNumber === element.rowNumber,
        );
        if (index === -1) {
          updateRepresentativeArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"],
          });
        }
      }
    }

    let updateAuthorizationArray = [];
    if (
      angAuthorizationInformtionGrid.length > 0 ||
      originalAuthorizationInformationGrid.length > 0
    ) {
      const maxLength = Math.min(
        angAuthorizationInformtionGrid.length,
        originalAuthorizationInformationGrid.length,
      );

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = angAuthorizationInformtionGrid[i];

        for (let j = 0; j < originalAuthorizationInformationGrid.length; j++) {
          const originalElement = originalAuthorizationInformationGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateAuthorizationArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement),
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < angAuthorizationInformtionGrid.length; i++) {
        const angelement = angAuthorizationInformtionGrid[i];
        const index = originalAuthorizationInformationGrid.findIndex(
          (element) => angelement.rowNumber === element.rowNumber,
        );

        if (index === -1) {
          if (!angelement.hasOwnProperty("caseNumber")) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateAuthorizationArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement,
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalAuthorizationInformationGrid.length; i++) {
        const originalElement = originalAuthorizationInformationGrid[i];
        const index = angAuthorizationInformtionGrid.findIndex(
          (element) => originalElement.rowNumber === element.rowNumber,
        );
        if (index === -1) {
          updateAuthorizationArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"],
          });
        }
      }
    }

    apiJson["ANG_Claim_Information_Grid"] = updateClaimArray;
    apiJson["ANG_Provider_Information_Grid"] = updateProviderArray;
    apiJson["ANG_Representative_Information_Grid"] = updateRepresentativeArray;
    apiJson["ANG_Authorization_Information_Grid"] = updateAuthorizationArray;

    apiJson["caseNumber"] = location.state.caseNumber;

    customAxios
      .post("/generic/update", apiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
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
          // procDataState.decisionNotes = decisionTab.Authorization_Case_Notes;
          procDataState.decisionNotes = location.state.decisionNotes;
          procDataState.caseNumber = location.state.caseNumber;
          // procDataState.decision = decisionTab.Authorization_Decision;
          // procDataState.decisionReason = decisionTab.Authorization_Decision_Reason;
          procDataState.decision = location.state.decision;
          procDataState.decisionReason = location.state.decisionReason;
          procDataState.userName = authSelector.userName || "system";
          procDataState.formNames = "Appeals";
          procData.state = procDataState;

          alert("Case updated successfully: " + location.state.caseNumber);
          submitCase(procData, navigateHome);
          navigateHome();
        }
      });
  };

  return {
    caseTimelines,
    caseTimelinesValidationSchema,
    setCaseTimelines,
    handleCaseHeaderChange,
    caseHeader,
    setCaseHeader,
    caseInformation,
    setCaseInformation,
    caseInformationValidationSchema,
    claimInformation,
    setClaimInformation,
    claimInformationValidationSchema,
    claimInformationGrid,
    setClaimInformationGrid,
    providerInformationGrid,
    setProviderInformationGrid,
    memberInformation,
    memberInformationValidationSchema,
    setMemberInformation,
    representativeInformationGrid,
    setRepresentativeInformationGrid,
    handleAuthorizationInformationChange,
    authorizationInformation,
    setAuthorizationInformation,
    authorizationInformationGrid,
    setAuthorizationInformationGrid,
    expeditedRequest,
    setExpeditedRequest,
    notes,
    setNotes,
    expeditedRequestValidationSchema,
    location,
    navigateHome,
    saveAndExit,
    submitData,
    potentialDupData,
    apiTestState,
    callProcRef,
    hasSubmitError,
    documentSectionDataRef,
    caseTimelinesErrors,
    caseInformationErrors,
    claimInformationErrors,
    memberInformationErrors,
    shouldShowSubmitError,
    handleShowMember360,
    showMember360,
    handleCloseMember360,
    handleShowProvider360,
    showProvider360,
    handleCloseProvider360,
    showNotesHistory,
    handleShowNotesHistory,
    handleCloseNotesHistory,
    populateModalTable,
    modalTableComponent,
    notesErrors,
    notesValidationSchema,
    claimInformationGridRowValidationSchema,
    providerInformationGridValidationSchema,
    authorizationInformationGridValidationSchema,
    representativeInformationGridValidationSchema,
  };
};
