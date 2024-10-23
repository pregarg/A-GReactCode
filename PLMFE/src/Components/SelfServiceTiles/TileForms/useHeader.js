import { useEffect, useRef, useState } from "react";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAxios } from "../../../api/axios.hook";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import _ from "lodash";

import TableComponent from "../../../../src/util/TableComponent";
import { useCaseTimelines } from "./useCaseTimelines";
import { useCaseDecision } from "./useCaseDecision.js"
import { useCaseDecisionDetail } from "./useCaseDecisionDetails.js"
import { useCaseHeader } from "./useCaseHeader";
import { useMemberAddOfRecords } from "./useMemberAddOfRecords.js";
import { useMemberAltContactInfo } from "./useMemberAltContactInfo.js";
import { useDecisionAddOfRecords } from "./useDecisionAddRecord.js";
import { useProviderAddOfRecords } from "./useProviderAddOfRecords";
import { useRepresentativeAddOfRecords } from "./useRepresentativeAddOfRecords";
import { usePdCaseInformation } from "./usePdCaseInformation.js";
import { useRepresentativeAltContact } from "./useRepresentativeAltContact";
import {usePdProviderAltContactInfo} from "./usePdProviderAltContactInfo";

import {useRepresentativeInformation} from "./useRepresentativeInformation";
import {useProviderInformation} from "./useProviderInformation";


export const useHeader = () => {
  const currentDate = new Date();
  const location = useLocation();
  const [hasSubmitError, setHasSubmitError] = useState(true);
  const [responseData, setResponseData] = useState([]);
  const [showMember360, setShowMember360] = useState(false);
  const [showProvider360, setShowProvider360] = useState(false);
  const [showNotesHistory, setShowNotesHistory] = useState(false);
  const [shouldShowSubmitError, setShowSubmitError] = useState(false);
  const [renderType, setRenderType] = useState();
  const [isCheckedBox,setIscheckedBox] = useState(false)
  const { fileUpDownAxios } = useAxios();
  let documentSectionDataRef = useRef([]);
  const authSelector = useSelector((state) => state.auth);

  const providerDisputesConfigData = JSON.parse(
    process.env.REACT_APP_PROVIDERDISPUTES_DETAILS || "{}",
   
  );

  const {caseHeader,
     setCaseHeader,
     caseHeaderFields } =
    useCaseHeader(renderType);

  const {
    caseTimelinesFields,
    caseTimelines,
    caseTimelinesValidationSchema,
    setCaseTimelines,
  } = useCaseTimelines(renderType);

  const {
    caseInformationFields,
    pd_CaseInformation,
    pdCaseInformationValidationSchema,
    setpdCaseInformation,
  } = usePdCaseInformation(renderType);

  const {
    memberAltFields,
    pd_MemberAltInfo,
    memberAltValidationSchema,
    setpdMemberAltInfo,
  } = useMemberAltContactInfo(renderType)

  const {
    memberAddRecordFields,
    pd_MemberAddRecord,
    memberAddOfRecordsValidationSchema,
    setpdMemberAddRecord,
  } = useMemberAddOfRecords(renderType);
  const {
    representativeInformationFields,
    pd_RepresentativeInformation,
    representativeInformationValidationSchema,
    setpdRepresentativeInformation,
  } = useRepresentativeInformation(renderType);
  const {
    providerInformationFields,
    pd_ProviderInformation,
    providerInformationValidationSchema,
    setpdProviderInformation,
  } = useProviderInformation(renderType);
  const {
    representativeAddRecordFields,
    pd_RepresentativeAddRecord,
    representativeAddOfRecordsValidationSchema,
    setpdRepresentativeAddRecord,
  } = useRepresentativeAddOfRecords(renderType);
  const {
    representativeAltFields,
    pd_RepresentativeAltRecord,
    representativeAltContactValidationSchema,
    setpdRepresentativeAltRecord,
  } = useRepresentativeAltContact(renderType);
  
  const {
    decisionAddRecordFields,
    pd_DecisionAddRecord,
    decisionAddOfRecordsValidationSchema,
    setpdDecisionAddRecord,
  } = useDecisionAddOfRecords(renderType);
  const {
    providerAddRecordFields,
    pd_ProviderAddRecord,
    providerAddOfRecordsValidationSchema,
    setpdProviderAddRecord,
  } = useProviderAddOfRecords(renderType);

  const {
    providerAltFields,
    pd_ProviderAlt,
    providerAltValidationSchema,
    setpdProviderAlt,
  } = usePdProviderAltContactInfo(renderType);

  const {
    caseDecision,
    caseDecisionValidationSchema,
    setcaseDecision,
	  caseDecisionFields,
  } = useCaseDecision(renderType);

  const {
    caseDecisionDetails,
    setcaseDecisionDetails,
    caseDecisionDetailsValidationSchema,
    caseDecisionDetailsFields,
  } = useCaseDecisionDetail(renderType);

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
    Denial_Date: undefined
  });
  const [ProviderclaimInformation, setProviderClaimInformation] = useState({
    isChecked : "",
  })
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
    WhiteGloveReason: "",
    WhiteGloveCancelledReason: "",
  });
  const [ProvidermemberInformation, setProviderMemberInformation] = useState({
    caseNumber: "",
    Provider_Issue_Number: "",
    Member_ID: "",
    Member_First_Name: "",
    Member_Last_Name: "",
    Medicare_ID_HICN: "",
    Provider_Medicaid_ID: "",
    ContractPlan_ID: "",
    Plan_Effective_Date: undefined,
    Plan_Name: "",
    Date_of_Birth: undefined,
    Email_ID: "",
    Phone_Number: "",
    Dual_Plan: "",
    Preferred_Language: "",
    Provider_LIS: "",
    Provider_Portal_Enrolled: "",
    Provider_Current_Alert: "",
    Provider_Next_Alert: "",
    Provider_Plan_Type:"",
    Plan_Code:"",
    
  });
  const [PdProviderInformation, setPdProviderInformation] = useState({
    Provider_ID:"",
    Provider_Name:"",
    Provider_TIN:"",
    NPI_ID:"",
  PR_Representative:"",
  Provider_Vendor_Specialty:"",
    Provider_Vendor_Specialty_Description:"",
    Provider_Par_Date:undefined,
  Participating_Provider:"",
  Vendor_ID:"",
  Vendor_Name:"",
  Communication_Preference:"",
  Portal_Enrolled:"",
  Provider_IPA:"",
  Phone_Number:"",
  Email_Address:"",
  Fax_Number:"",
  Provider_Type:"",
    Sequential_Provider_ID:"",
    ACHHS_Provider_ID:"",

  Provider_Alert:"",
  Current_Alert:"",
  Next_Alert:"",
  Historical_Alert:"",
  Acknowledge_Alert:"",

  });

  // const [providerDisputeAuthorizationInformation, setProviderDisputeAuthorizationInformation] = useState({
  //   Issue_Number: "",
  //   Auth_Number: "",
  //   Auth_Status: "",
  //   Provider_Name: "",
  //   Authorization_Type: "",
  //   Auth_Type_Description: "",
  //   Auth_Request_Date: undefined,
  //   Expiration_Date: undefined,
  //   CPT_Descriptions: "",
  //   Service_Start_Date: undefined,
  //   Denial_Code: "",
  //   Denial_Reason: "",
  //
  //
  // });
  const [expeditedRequest, setExpeditedRequest] = useState({
    Expedited_Requested: "",
    Expedited_Reason: "",
    Standard_Upgraded_to_Expedited: "",
    Expedited_Denied: "",
    Expedited_Upgrade_Date_Time: undefined,
    Expedited_Denied_Date: undefined,
    Decision_Letter_Date: undefined,
  });

  const [providerNotes, setProviderNotes] = useState({
    Provider_Case_Notes: "",
    Provider_Internal_Notes: "",
  });
  const [notes, setNotes] = useState({
    Case_Notes: "",
    Internal_Notes: "",
  });
  const [claimInformationGrid, setClaimInformationGrid] = useState([]);
  const [ProviderClaimInformationGrid, setProviderClaimInformationGrid] = useState([]);
  const [providerInformationGrid, setProviderInformationGrid] = useState([]);
  const [authorizationInformationGrid, setAuthorizationInformationGrid] =
    useState([]);
    const [ProviderauthorizationInformationGrid,setProviderAuthorizationInformationGrid] = useState([]);

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
  const providerclaimInformationValidationSchema = Yup.object().shape({ });
  const ProviderclaimInformationValidationGridSchema = Yup.object().shape({
    Issue_Number: Yup.string().required("Issue Number is mandatory"),
    Claim_Number:Yup.string().required("Claim_Number is mandatory"),
    Claim_type:Yup.string().required("Claim Type is mandatory"),
    Patient_Ref:Yup.string().required("Patient Ref is mandatory"),
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
    Decision_Reason: conditionalActivateOnStage(
      pair1,
      "Decision Reason is mandatory",
    ),
    Payment_Number: conditionalActivateOnStage(
      pair1,
      "Payment Number is mandatory",
    ),
    Effectuation_Notes: conditionalActivateOnStage(
      pair1,
      "Effectuation Notes is mandatory",
    ),
    Claim_Adjusted_Date: conditionalActivateOnStage(
      pair1,
      "Claim Adjusted Date is mandatory",
    ),
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
    // Dual_Plan: Yup.string().required("Dual Plan is mandatory"),
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
    "Plan_Effective_Date#date": Yup.string().required(
      "Plan Effective Date Address is mandatory",
    ),
    "Plan_Expiration_Date#date": Yup.string().required(
      "Plan Expiration Date Address is mandatory",
    ),
   "Date_of_Birth#date": Yup.string().required("Date of Birth Address is mandatory"),
    Special_Need_Indicator: Yup.string().required(
      "Special Need Indicator Address is mandatory",
    ),
  });
  const ProvidermemberInformationValidationSchema = Yup.object().shape({
    Member_First_Name: Yup.string().required("Member First Name is mandatory"),
    Member_Last_Name: Yup.string().required("Member Last Name is mandatory"),
    Member_ID: Yup.string().required("Member_ID is mandatory"),
    Provider_Issue_Number: Yup.string().required("Issue Number is mandatory"),
   
  });
  const PdProviderInformationValidationSchema = Yup.object().shape({

  });
  // const providerDisputeAuthorizationInformation = Yup.object().shape({});
  const memberAlternativeContactSchema = Yup.object().shape({});
  const expeditedRequestValidationSchema = Yup.object().shape({});
  const notesValidationSchema = Yup.object().shape({
    Case_Notes: Yup.string().required("Case Notes is mandatory"),
  });
  const providerNotesValidationSchema = Yup.object().shape({
    Provider_Case_Notes: Yup.string().required("Case Notes is mandatory"),
  });
  const claimInformationGridRowValidationSchema = Yup.object().shape({
    /*Filed_Timely: Yup.string().required(
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
    ),*/
  });
  const providerInformationGridValidationSchema = Yup.object().shape({
    // Point_of_Contact: Yup.string().required("Point of Contact is mandatory"),
    // Sequential_Provider_ID: Yup.string().required(
    //    "Sequential Provider ID is mandatory",
    // ),
    // Provider_Name: Yup.string().required("Provider Name is mandatory"),
    // Provider_TIN: Yup.string().required("Provider TIN is mandatory"),
    // Participating_Provider: Yup.string().required(
    //   "Participating Provider is mandatory",
    // ),
    // Provider_Type: Yup.string().required("Provider Type is mandatory"),
    // Provider_Vendor_Specialty: Yup.string().required(
    //    "Provider Vendor Specialty is mandatory",
    // ),
    // Mail_to_Address: Yup.string().required("Mail to Address is mandatory"),
    // Address_Line_1: Yup.string().required("Address Line 1 is mandatory"),
    // City: Yup.string().required("City is mandatory"),
    // State: Yup.string().required("State is mandatory"),
    // Zip_Code: Yup.string().required("Zip Code is mandatory"),
    // Provider_ID: Yup.string().required("Provider ID is mandatory"),
    // NPI_ID: Yup.string().required("NPI ID is mandatory"),
    // Par_Provider_Start_Date: Yup.string().required(
    //    "Par Provider Start Date is mandatory",
    // ),
    // Par_Provider_End_Date: Yup.string().required(
    //   "Par Provider End Date is mandatory",
    // ),
    // Vendor_ID: Yup.string().required("Vendor ID is mandatory"),
    // Vendor_Name: Yup.string().required("Vendor_Name is mandatory"),
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
  const authorizationInformationGridValidationSchema = Yup.object().shape({

  });
  const ProviderauthorizationInformationGridValidationSchema = Yup.object().shape({
    Issue_Number: Yup.string().required("Issue Number is mandatory"),
  });
  const docNeededGridValidationSchema = Yup.object().shape({});
  
  const representativeInformationGridValidationSchema = Yup.object().shape({
    // Communication_Preference: Yup.string().required("Communication Preference is mandatory"),
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

  const [pdCaseInformationErrors, setPdCaseInformationErrors] = useState([]);
  const [caseInformationErrors, setCaseInformationErrors] = useState([]);
  const [claimInformationErrors, setClaimInformationErrors] = useState([]);
  const [providerClaimInformationErrors, setProviderclaimInformationErrors] = useState([]);
  const [memberInformationErrors, setMemberInformationErrors] = useState([]);
  const [ProvidermemberInformationErrors, setProviderMemberInformationErrors] = useState([]);
  const [PdProviderInformationErrors, setPdProviderInformationErrors] = useState([]);
  //const [providerDisputeAuthorizationInformationGridErrors, setProviderDisputeAuthorizationInformationGridErrors] = useState([]);
  const [memberAltErrors, setMemberAltErrorsErrors] = useState([]);
  const [expeditedRequestErrors, setExpeditedRequestErrors] = useState([]);
  const [notesErrors, setNotesErrors] = useState([]);
  const [providerNotesErrors, setProviderNotesErrors] = useState([]);
  const [representativeAddErrors, setRepresentativeAddErrorsErrors] = useState([]);
  const [representativeInformationErrors, setRepresentativeInformationErrorsErrors] = useState([]);
  const [providerInformationErrors, setProviderInformationErrorsErrors] = useState([]);
  const [representativeAltErrors, setRepresentativeAltErrorsErrors] = useState([]);
  const [memberAddErrors, setMemberAddErrorsErrors] = useState([]);
  const [providerAddErrors, setProviderAddErrorsErrors] = useState([]);
  const [providerAltErrors, setProviderAltErrorsErrors] = useState([]);
  const [decisionAddErrors, setDecisionAddErrorsErrors] = useState([]);
  const [caseDecisionDetailsErrors, setcaseDecisionDetailsErrors] = useState([]);
  const [caseDecisionErrors, setcaseDecisionErrors] = useState([]);
  const validateSync = (schema, data, setErrors, noReset) => {
    try {
      if(!noReset) {
        setErrors([]);
      }
     // setErrors([]);
      schema.validateSync(data, { abortEarly: false });
    } catch (errors) {
      const validationErrors = (errors.inner || []).reduce((acc, error) => {
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
      providerclaimInformationValidationSchema,
      ProviderclaimInformation,
      setProviderclaimInformationErrors,
    );
    validateSync(
      memberInformationValidationSchema,
      memberInformation,
      setMemberInformationErrors,
    );
    validateSync(
      ProvidermemberInformationValidationSchema,
      ProvidermemberInformation,
      setProviderMemberInformationErrors,
    );
    validateSync(
        providerNotesValidationSchema,
        providerNotes,
        setProviderNotesErrors
    );
    validateSync(
        PdProviderInformationValidationSchema,
        PdProviderInformation,
        setPdProviderInformationErrors,
    );

    validateSync(
        memberAltValidationSchema,
        pd_MemberAltInfo,
        setMemberAltErrorsErrors,
    );
    validateSync(
      pdCaseInformationValidationSchema,
      pd_CaseInformation,
      setPdCaseInformationErrors
    );
    validateSync(
      expeditedRequestValidationSchema,
      expeditedRequest,
      setExpeditedRequestErrors,
    );
    validateSync(
      caseDecisionDetailsValidationSchema,
      caseDecisionDetails,
      setcaseDecisionDetailsErrors,
    );
    validateSync(
      caseDecision,
      caseDecisionValidationSchema,
      setcaseDecisionErrors
    );
    validateSync(notesValidationSchema, notes, setNotesErrors);
    validateSync(
      memberAddOfRecordsValidationSchema,
      pd_MemberAddRecord,
      setMemberAddErrorsErrors,
    );
    validateSync(
        representativeAddOfRecordsValidationSchema,
        pd_RepresentativeAddRecord,
        setRepresentativeAddErrorsErrors,
    );
    validateSync(
        representativeInformationValidationSchema,
        pd_RepresentativeInformation,
        setRepresentativeInformationErrorsErrors,
    );
    validateSync(
        providerInformationValidationSchema,
        pd_ProviderInformation,
        setProviderInformationErrorsErrors,
    );
    validateSync(
        representativeAltContactValidationSchema,
        pd_RepresentativeAltRecord,
        setRepresentativeAltErrorsErrors,
    );
    validateSync(
      decisionAddOfRecordsValidationSchema,
      pd_DecisionAddRecord,
      setDecisionAddErrorsErrors,
    );
    validateSync(
        providerAddOfRecordsValidationSchema,
        pd_ProviderAddRecord,
        setProviderAddErrorsErrors,
    );

    validateSync(
        providerAltValidationSchema,
        pd_ProviderAlt,
        setProviderAltErrorsErrors,
    );

  }, [
    caseTimelines,
    caseInformation,
    claimInformation,
    ProviderclaimInformation,
    memberInformation,
    ProvidermemberInformation,
    PdProviderInformation,
    expeditedRequest,
    providerInformationGrid,
    authorizationInformationGrid,
    // ProviderauthorizationInformationGrid,
    caseDecisionDetails,
    caseDecision,
    notes,
    providerNotes,
    pd_ProviderAddRecord,
    pd_MemberAddRecord,
    pd_ProviderInformation,
    pd_MemberAltInfo,
    pd_CaseInformation,
  ]);

  useEffect(() => {
    // debugger;
    setHasSubmitError(
      Object.keys({
        ...caseTimelinesErrors,
        ...caseInformationErrors,
        ...claimInformationErrors,
        ...providerClaimInformationErrors,
        ...memberInformationErrors,
        ...ProvidermemberInformationErrors,
        ...providerNotesErrors,
        ...PdProviderInformationErrors,
        ...providerAddErrors,
        ...memberAddErrors,
        ...expeditedRequestErrors,
        ...caseDecisionDetailsErrors,
        ...caseDecisionErrors,
        ...pdCaseInformationErrors,
        ...memberAltErrors,
      }).length > 0,
    );
  }, [
    caseTimelinesErrors,
    caseInformationErrors,
    claimInformationErrors,
    providerClaimInformationErrors,
    memberInformationErrors,
    providerNotesErrors,
    ProvidermemberInformationErrors,
    PdProviderInformationErrors,
    expeditedRequestErrors,
    caseDecisionDetailsErrors,
    caseDecisionErrors,
    pdCaseInformationErrors,
    providerAddErrors,
    memberAddErrors,
    memberAltErrors
  ]);
  //const [disableSaveAndExit, setDisableSaveAndExit] = useState(true);
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

  const checkForPDError = () => {
    return Object.keys({
      ...caseTimelinesErrors,
      ...providerClaimInformationErrors,
      ...ProvidermemberInformationErrors,
      ...providerNotesErrors,
      ...PdProviderInformationErrors,
      ...pdCaseInformationErrors,
      ...providerAddErrors,
      ...memberAddErrors
      })
  }
  const checkForAppealsError = () => {
    return Object.keys({
      ...caseTimelinesErrors,
      ...caseInformationErrors,
      ...claimInformationErrors,
      ...memberInformationErrors,
      ...expeditedRequestErrors,
      ...caseDecisionDetailsErrors,
      ...caseDecisionErrors,
    })
  }

  const pdsubmitData = async () => {

    if (checkForPDError()?.length > 0) {
      setShowSubmitError(true);
      return;
    }
   
    const flowID = providerDisputesConfigData["FlowId"];
    const stageNAME = providerDisputesConfigData["StageName"];
    
    let apiJson = {};
    let mainCaseReqBody = {
      transactionType: "Provider Disputes",
      stageId: "41",
      caseStatus: "Open",
      lockStatus: "N",
      flowId: flowID,
      stageName: stageNAME,
    };
    const temp = localStorage.getItem('checkBox') == 'true' ?1:0;
    localStorage.setItem('checkBox','false');
    console.log("type of temp is : ", temp)

    
    const checkBoxData = {isChecked : temp};
    const currentUser = authSelector.userName || "system";
    const receivedDate = extractDate(currentDate);
    const updatedCaseHeader = {
      ...caseHeader,
      Case_Owner: currentUser,
      Original_Case_Received_Date: receivedDate,
    };
    console.log("Original_Case_Received_Date",receivedDate)
    const pdCaseHeader = trimJsonValues({ ...updatedCaseHeader });
    apiJson["PD_CASE_HEADER"] = pdCaseHeader;
   
    const pdCaseTimelines = trimJsonValues({ ...caseTimelines });
    apiJson["PD_Case_Timelines"] = pdCaseTimelines;
    console.log("pd_CaseInformation11",pd_CaseInformation)
    const pdCaseInformation = trimJsonValues({ ...pd_CaseInformation });
    apiJson["PD_CASE_INFORMATION"] = pdCaseInformation;
    
    const pdCaseInfoGrid = getGridDataValues(pdCaseInformationGrid);
    apiJson["PD_CASE_INFORMATION_GRID"] = pdCaseInfoGrid;

    const pdClaimInformation = trimJsonValues({...checkBoxData});
    apiJson["PD_Claim_Information"] = pdClaimInformation;

    const pdClaimInfoGrid = getGridDataValues(pdClaimInformationGrid);
    apiJson["PD_Claim_Information_Grid"] = pdClaimInfoGrid;
   
    const pdProviderInformation = trimJsonValues({ ...pd_ProviderInformation });
    apiJson["PD_Provider_Information"] = pdProviderInformation;

    const pdProviderAddRecord = trimJsonValues({ ...pd_ProviderAddRecord });
    apiJson["PD_Provider_Add_of_Records"] = pdProviderAddRecord;

    const pdProviderAlt = trimJsonValues({ ...pd_ProviderAlt });
    apiJson["PD_Provider_Alternative_Contact_Info"] = pdProviderAlt;

    const pdMemberInformation = trimJsonValues({ ...ProvidermemberInformation });
    // console.log("Provider Member Information is : ", angProviderMemberInformation)
    apiJson["PD_Member_Information"] = pdMemberInformation;
    console.log("pd_MemberAddRecord",pd_MemberAddRecord)
    const pdMemberAddRecord = trimJsonValues({ ...pd_MemberAddRecord });
    apiJson["PD_MEMBER_ADD_OF_RECORDS"] = pdMemberAddRecord;

    
    const pdMemberAltInfo = trimJsonValues({ ...pd_MemberAltInfo });
    apiJson["PD_MEMBER_ALTERNATIVE_CONTACT_INFO"] = pdMemberAltInfo;

    const pdRepresentativeInformation = trimJsonValues({ ...pd_RepresentativeInformation });
    apiJson["PD_Representative_Information"] = pdRepresentativeInformation;

    const pdRepresentativeAddRecord = trimJsonValues({ ...pd_RepresentativeAddRecord });
    apiJson["PD_Representative_Add_of_Records"] = pdRepresentativeAddRecord;

    const pdRepresentativeAltRecord = trimJsonValues({ ...pd_RepresentativeAltRecord });
    apiJson["PD_Representative_Alternative_Contact_Info"] = pdRepresentativeAltRecord;

    const pdAuthorizationInformationGrid = getGridDataValues(ProviderauthorizationInformationGrid);
    console.log("Provider authorization information grid data  : ",ProviderauthorizationInformationGrid)
    apiJson["PD_Authorization_Information"] = pdAuthorizationInformationGrid;

    const pdDecisionAddRecord = trimJsonValues({ ...pd_DecisionAddRecord });
    apiJson["PD_Decision"] = pdDecisionAddRecord;

    const pNotes = trimJsonValues({ ...providerNotes });
    apiJson["PD_Notes"] = pNotes;

    apiJson["MainCaseTable"] = mainCaseReqBody;
    const cleanedApiJson = removeDateInKeys(apiJson);
    const response = await customAxios.post("/generic/create", cleanedApiJson, {
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
      procDataState.stageName = mainCaseReqBody.stageName;
      procDataState.flowId = mainCaseReqBody.flowId;
      procDataState.caseNumber = response.data["CreateCase_Output"]["CaseNo"];
      procDataState.decision = "Submit";
      procDataState.userName = authSelector.userName || "system";
      procDataState.formNames = "Provider Disputes";
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
      console.log("proc data pd", procData)
      submitCase(procData, navigateHome);
    }
  };
  
  

  const submitData = async () => {
    // debugger;
    if (checkForAppealsError()?.length > 0) {
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
    const angDocNeededGrid = getGridDataValues(docNeededGrid);

    const angCaseHeader = trimJsonValues({ ...updatedCaseHeader });
    const angCaseTimelines = trimJsonValues({ ...caseTimelines });
    const angCaseInformation = trimJsonValues({ ...caseInformation });
    const angClaimInformation = trimJsonValues({ ...claimInformation });
    const angMemberInformation = trimJsonValues({ ...memberInformation });

    console.log("angMemberInformation1", angMemberInformation);
    //  const angAuthorizationInformation = trimJsonValues({   ...authorizationInformation, });

    const angAuthorizationInformation = trimJsonValues({
      ...authorizationInformation,
    });

    const angExpeditedRequest = trimJsonValues({ ...expeditedRequest });
    const angNotes = trimJsonValues({ ...notes });
   
    const angCaseDecision= trimJsonValues({ ...caseDecision });
    const angCaseDecisionDetails= trimJsonValues({ ...caseDecisionDetails });

    apiJson["ANG_Case_Header"] = angCaseHeader;
    apiJson["ANG_Case_Timelines"] = angCaseTimelines;
    apiJson["ANG_Case_Information"] = angCaseInformation;
    apiJson["ANG_Claim_Information"] = angClaimInformation;
    apiJson["ANG_Claim_Information_Grid"] = angClaimInformationGrid;
    apiJson["ANG_Provider_Information_Grid"] = angProviderInformationGrid;
    apiJson["ANG_Member_Information"] = angMemberInformation;
    //apiJson["ANG_Member_Alternative_Contact_Information"] = angMemberAlternativeContact;
    apiJson["ANG_Representative_Information_Grid"] =
      angRepresentativeInformationGrid;
    apiJson["ANG_Authorization_Information"] = angAuthorizationInformation;
    apiJson["ANG_Authorization_Information_Grid"] =
        angAuthorizationInformationGrid;
    apiJson["ANG_DOCS_NEEDED"] = angDocNeededGrid;
    apiJson["ANG_Expedited_Request"] = angExpeditedRequest;
    apiJson["ANG_Notes"] = angNotes;
    apiJson["ANG_Case_Decision"] = angCaseDecision;
    apiJson["ANG_Case_Decision_Details"] = angCaseDecisionDetails;
    let mainCaseReqBody = {
      ...mainCaseDetails,
      caseStatus: "Open",
      lockStatus: "N",
    };

    const flowId = caseHeaderConfigData["FlowId"];
    const stageName = caseHeaderConfigData["StageName"];

    apiJson["MainCaseTable"] = mainCaseReqBody;
    const cleanedApiJson = removeDateInKeys(apiJson);
    const response = await customAxios.post("/generic/create", cleanedApiJson, {
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

    const [docNeededGrid, setDocNeededGrid] = useState([]);
    const [pdCaseInformationGrid, setPDCaseInformationGrid] = useState([]);
  const [mainCaseDetails, setMainCaseDetails] = useState({
    flowId: 0,
    stageName: "",
    stageId: 0,
    transactionType: "",
    caseStatus: "",
  });
  const [pdClaimInformationGrid, setPDClaimInformationGrid] = useState([]);

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
    console.log("abccc--->", location.state);
    if (location.state.formView !== undefined && location.state?.formView === "DashboardView") {
      location.state.formNames === "Appeals"
        ? getAngCaseByCaseNumber()
        : location.state.formNames === "Provider Disputes" && getPDCaseByCaseNumber();
    }
  }, []);
  

  const dispatch = useDispatch();
  const { customAxios } = useAxios();
  const { trimJsonValues, extractDate, getTableDetails, getDatePartOnly } = useGetDBTables();
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

  const handleShowNotesHistory = () => {
    setShowNotesHistory(true);
    if (
      notes.Case_Notes ||
      notes.Internal_Notes ||
      memberInformation.WhiteGloveReason ||
      memberInformation.WhiteGloveCancelledReason
    ) {
      populateModalTable("NOTESHISTORY", location.state.caseNumber);
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
      console.log("resApiData--->", resApiData);

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
            }
              else {
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
  const getAngCaseByCaseNumber = async () => {
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
        const respKeys = Object.keys(res.data.data);
        const data = res.data.data;
       
      
        // // Extract data
        console.log(" data.angCaseHeader[0]", data.angCaseHeader[0])
        const stageName = location.state.stageName;
        const caseStatus = await getCaseStatus(stageName);
        const caseReceivedDate = new Date(
          data.angCaseHeader[0]["Case_Received_Date#date"],
          // data.angCaseHeader[0]["Case_Received_Date"],

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

          const timeLeft = dueDate - currentDate;

          daysLeft = Math.max(Math.floor(timeLeft / (1000 * 60 * 60 * 24)), 0);
          hoursLeft = Math.max(
            Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            0,
          );
          minutesLeft = Math.max(
            Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)),
            0,
          );
          secondsLeft = Math.max(
            Math.floor((timeLeft % (1000 * 60)) / 1000),
            0,
          );

          respKeys.forEach((k) => {
            console.log("k value-->",k)
            if (k === "angClaimInformationGrid") {
                        let apiResponseArray = [];
                        data[k].forEach((js) => {
                          const newJson = convertToDateObj(js);
                          console.log(
                            "Add a pdCaseInfoGrid newJson: ",
                            newJson,
                          );

                          apiResponseArray.push(newJson);
                          //setLicenseTableRowsData([...licenseTableRowsData,newJson]);
                        });
                        setClaimInformationGrid(apiResponseArray);
            }
            if (k === "angProviderInformationGrid") {
             let apiResponseArray = [];
             data[k].forEach((js) => {
               const newJson = convertToDateObj(js);
               console.log(
                 "Add a pdCaseInfoGrid newJson: ",
                 newJson,
               );

               apiResponseArray.push(newJson);
               //setLicenseTableRowsData([...licenseTableRowsData,newJson]);
             });
             setProviderInformationGrid(apiResponseArray);
            }
            if (k === "angRepresentativeInformationGrid") {
               let apiResponseArray = [];
               data[k].forEach((js) => {
                 const newJson = convertToDateObj(js);
                 console.log(
                   "Add a pdCaseInfoGrid newJson: ",
                   newJson,
                 );

                 apiResponseArray.push(newJson);
                 
               });
               setRepresentativeInformationGrid(apiResponseArray);
            }
           if (k === "angAuthorizationInformationGrid") {
            let apiResponseArray = [];
            data[k].forEach((js) => {
              const newJson = convertToDateObj(js);
              console.log(
                "Add a pdCaseInfoGrid newJson: ",
                newJson,
              );
              console.log("abcdertfg",apiResponseArray)
              apiResponseArray.push(newJson);
              
            });
            setAuthorizationInformationGrid(apiResponseArray);
            }

            if (k === "angDocNeededGrid") {
              let apiResponseArray = [];
              data[k].forEach((js) => {
                const newJson = convertToDateObj(js);
                console.log(
                  "Add a DocNeededGrid newJson: ",
                  newJson,
                );
                apiResponseArray.push(newJson);
                
              });
              setDocNeededGrid(apiResponseArray);
              }
             })
             


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
          timeDifference / (1000 * 60 * 60 * 24),
        );
        const complianceTime = `${daysLeft}d ${hoursLeft}h ${minutesLeft}m ${secondsLeft}s`;
      
         setCaseTimelines(data?.["angCaseTimelines"]?.[0] || {});

        setCaseInformation(data?.["angCaseInformation"]?.[0] || {});
        setClaimInformation(data?.["angClaimInformation"]?.[0] || {});
        // setClaimInformationGrid(data?.["angClaimInformationGrid"] || []);
        // setProviderInformationGrid(data?.["angProviderInformationGrid"] || []);
        setMemberInformation(data?.["angMemberInformation"]?.[0] || {});
        setProviderMemberInformation(data?.["angProviderMemberInformation"]?.[0] || {});
        setPdProviderInformation(data?.["pdProviderInformation"]?.[0] || {});
        // setRepresentativeInformationGrid(
        //   data?.["angRepresentativeInformationGrid"] || [],
        // );
        setAuthorizationInformation(
          data?.["angAuthorizationInformation"]?.[0] || {},
        );
        // setAuthorizationInformationGrid(
        //   data?.["angAuthorizationInformationGrid"] || [],
        // );

        // setDocNeededGrid(data?.["angDocNeededGrid"] || [] );

        setDocNeededGrid(data?.["angDocNeededGrid"] || [] );

        setExpeditedRequest(data?.["angExpeditedRequest"]?.[0] || {});
        setNotes(data?.["angNotes"]?.[0] || {});


      
        setcaseDecision(data?.["angCaseDecision"]?.[0] || {});
        setcaseDecisionDetails(data?.["angCaseDecisionDetails"]?.[0] || {});
        
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
  const renameKey = (obj, oldKey, newKey) => {
    try {
      console.log(
        "Inside rename key old key = ",
        oldKey,
        " new key = ",
        newKey,
      );
      console.log(
        "Inside rename key hasOwnProperty = ",
        obj.hasOwnProperty(oldKey),
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
  const getPDCaseByCaseNumber = async () => {
   
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["pdTables"];
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
        const respKeys = Object.keys(res.data.data);
        const data = res.data.data;
        respKeys.forEach((k) => {
               if (k === "pdCaseInfoGrid") {
                           let apiResponseArray = [];
                           data[k].forEach((js) => {
                             const newJson = convertToDateObj(js);
                             console.log(
                               "Add a pdCaseInfoGrid newJson: ",
                               newJson,
                             );
                             console.log("abcdertfg",apiResponseArray)
                             apiResponseArray.push(newJson);
                             //setLicenseTableRowsData([...licenseTableRowsData,newJson]);
                           });
                           setPDCaseInformationGrid(apiResponseArray);
               }
               if (k === "pdClaimInfoGrid") {
                let apiResponseArray = [];
                data[k].forEach((js) => {
                  const newJson = convertToDateObj(js);
                  console.log(
                    "Add a pdCaseInfoGrid newJson: ",
                    newJson,
                  );
                  console.log("abcdertfg",apiResponseArray)
                  apiResponseArray.push(newJson);
                  //setLicenseTableRowsData([...licenseTableRowsData,newJson]);
                });
                setPDClaimInformationGrid(apiResponseArray);
              }
               if (k === "pdAuthorizationInformationGrid") {
                  let apiResponseArray = [];
                  data[k].forEach((js) => {
                    const newJson = convertToDateObj(js);
                    console.log(
                      "Add a pdCaseInfoGrid newJson: ",
                      newJson,
                    );
                    console.log("abcdertfg",apiResponseArray)
                    apiResponseArray.push(newJson);
                    
                  });
                  setProviderAuthorizationInformationGrid(apiResponseArray);
              }
                })
      
        setCaseHeader(data?.["pdCaseHeader"]?.[0] || {});

        setCaseTimelines(data?.["pdCaseTimelines"]?.[0] || {});

        setpdCaseInformation(data?.["pdCaseInformation"]?.[0] || {});
        // setPDCaseInformationGrid(data?.["pdCaseInfoGrid"] || []);
        
        setProviderClaimInformation(data?.["pdClaimInformation"]?.[0] || {});
        // setPDClaimInformationGrid(data?.["pdClaimInfoGrid"] || []);
        
        setpdProviderInformation(data?.["pdProviderInformation"]?.[0] || {});
        setpdProviderAddRecord(data?.["pdProviderAddRecord"]?.[0] || {});
       
        setpdProviderAlt(data?.["pdProviderAlt"]?.[0] || {});
        
        setProviderMemberInformation(data?.["pdMemberInformation"]?.[0] || {});
        setpdMemberAddRecord(data?.["pdMemberAddRecord"]?.[0] || {});
        setpdMemberAltInfo(data?.["pdMemberAltInfo"]?.[0] || {});
        
        setpdRepresentativeInformation(data?.["pdRepresentativeInformation"]?.[0] || {});
        setpdRepresentativeAltRecord(data?.["pdRepresentativeAltRecord"]?.[0] || {});
        setpdRepresentativeAddRecord(data?.["pdRepresentativeAddRecord"]?.[0] || {});
        console.log('altpdAuthorizationInformationGrid...', data?.["pdAuthorizationInformationGrid"]);
        // setProviderAuthorizationInformationGrid(data?.["pdAuthorizationInformationGrid"] || []);

        setpdDecisionAddRecord(data?.["pdDecisionAddRecord"]?.[0] || {});

        setProviderNotes(data?.["pNotes"]?.[0] || {});

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
    console.log("step0")
    if (checkForAppealsError()?.length > 0) {
   // if (hasSubmitError) {
      setShowSubmitError(true);
      return;
    }
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
    const angCaseDecision = trimJsonValues({ ...caseDecision});
    const angCaseDecisionDetails = trimJsonValues({ ...caseDecisionDetails });

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


    const angDocNeededGrid = getGridDataValues(
      docNeededGrid,
    );
    const originalDocNeededGrid = getGridDataValues(
      formData["angDocNeededGrid"], 
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
    apiJson["ANG_Case_Decision"] = CompareJSON(angCaseDecision, formData["angCaseDecision"][0]);
    apiJson["ANG_Case_Decision_Details"] = CompareJSON(angCaseDecisionDetails, formData["angCaseDecisionDetails"][0]);
    console.log("step1",apiJson["ANG_Notes"] )
    console.log("step3",angDocNeededGrid)
    
    

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

    let updateDocNeededArray = [];
    if (
      angDocNeededGrid.length > 0 ||
      originalDocNeededGrid.length > 0
    ) {
      const maxLength = Math.min(
        angDocNeededGrid.length,
        originalDocNeededGrid.length,
      );

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = angDocNeededGrid[i];

        for (let j = 0; j < originalDocNeededGrid.length; j++) {
          const originalElement = originalDocNeededGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateDocNeededArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement),
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < angDocNeededGrid.length; i++) {
        const angelement = angDocNeededGrid[i];
        const index = originalDocNeededGrid.findIndex(
          (element) => angelement.rowNumber === element.rowNumber,
        );

        if (index === -1) {
          if (!angelement.hasOwnProperty("caseNumber")) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateDocNeededArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement,
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalDocNeededGrid.length; i++) {
        const originalElement = originalDocNeededGrid[i];
        const index = angDocNeededGrid.findIndex(
          (element) => originalElement.rowNumber === element.rowNumber,
        );
        if (index === -1) {
          updateDocNeededArray.push({
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
    apiJson["ANG_DOCS_NEEDED"] = updateDocNeededArray;

  
    apiJson["caseNumber"] = location.state.caseNumber;
    // debugger;
    const cleanedApiJson = removeDateInKeys(apiJson);
    customAxios
      .post("/generic/update", cleanedApiJson, {
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

  const removeDateInKeys = (obj) => { 
    if (typeof obj !== 'object' || obj === null) return obj; 
    // Return if it's not an object 
    // Check if the object is a Date 
    if (obj instanceof Date) return obj; // Return date objects as-is
    if (Array.isArray(obj)) 
      { 
        return obj.map(removeDateInKeys); // Recursively handle arrays
       } 
       
       return Object.keys(obj).reduce((acc, key) => { // Create the new key by removing #date 
        const newKey = key.replace('#date', ''); // Recursively call the function for nested objects 
        acc[newKey] = removeDateInKeys(obj[key]); 
        return acc; }, {}); 
  }

  const pdsaveAndExit = async () => {
    callProcRef.current = "callProc";

    //const saveType = event.target.name === "saveAndSubmit" ? "SS" : "SE";
    const saveType = "SS";

    let apiJson = {};
    const temp = localStorage.getItem('checkBox') == 'true' ?1:0;
    const checkBoxData = {isChecked : temp};
   	const pdCaseHeader = trimJsonValues({ ...caseHeader });
	const pdCaseTimelines = trimJsonValues({ ...caseTimelines });
	const pdCaseInformation = trimJsonValues({ ...pd_CaseInformation });
	const pdClaimInformation = trimJsonValues({...checkBoxData});
	const pdProviderInformation = trimJsonValues({ ...pd_ProviderInformation });
	const pdProviderAddRecord = trimJsonValues({ ...pd_ProviderAddRecord });
	const pdProviderAlt = trimJsonValues({ ...pd_ProviderAlt });
	const pdMemberInformation = trimJsonValues({ ...ProvidermemberInformation });
	const pdMemberAddRecord = trimJsonValues({ ...pd_MemberAddRecord });
	const pdMemberAltInfo = trimJsonValues({ ...pd_MemberAltInfo });
	const pdRepresentativeInformation = trimJsonValues({ ...pd_RepresentativeInformation });
	const pdRepresentativeAddRecord = trimJsonValues({ ...pd_RepresentativeAddRecord });
	const pdRepresentativeAltRecord = trimJsonValues({ ...pd_RepresentativeAltRecord });

    const pNotes = trimJsonValues({ ...providerNotes });
	const pdDecisionAddRecord = trimJsonValues({ ...pd_DecisionAddRecord });
  console.log("pdCaseInformationGrid111",pdCaseInformationGrid)
	const pdCaseInfoGrid = getGridDataValues(pdCaseInformationGrid);
    const originalPdCaseInfoGrid = getGridDataValues(
      formData["pdCaseInfoGrid"],
    );
   
    const pdClaimInfoGrid = getGridDataValues(pdClaimInformationGrid);
    const originalPDClaimInfoGrid = getGridDataValues(
      formData["pdClaimInfoGrid"],
    );
    console.log("ProviderauthorizationInformationGrid111",ProviderauthorizationInformationGrid)
    const pdAuthorizationInformationGrid = getGridDataValues(ProviderauthorizationInformationGrid);
    const originalPDAuthorizationInformationGrid = getGridDataValues(
      formData["pdAuthorizationInformationGrid"],
    );


    apiJson["PD_CASE_HEADER"]= CompareJSON(
      pdCaseHeader,
      formData["pdCaseHeader"][0],
    );
    apiJson["PD_Case_Timelines"] = CompareJSON(
      pdCaseTimelines,
      formData["pdCaseTimelines"][0],
    );
    apiJson["PD_CASE_INFORMATION"] = CompareJSON(
      pdCaseInformation,
      formData["pdCaseInformation"][0],
    );
    apiJson["PD_Claim_Information"] = CompareJSON(
      pdClaimInformation,
      formData["pdClaimInformation"][0],
    );
   apiJson["PD_Provider_Information"] = CompareJSON(
      pdProviderInformation,
      formData["pdProviderInformation"][0],
    );
   apiJson["PD_Provider_Add_of_Records"] = CompareJSON(
      pdProviderAddRecord,
      formData["pdProviderAddRecord"][0],
    );
    apiJson["PD_Provider_Alternative_Contact_Info"] = CompareJSON(
      pdProviderAlt,
      formData["pdProviderAlt"][0],
    );
	    apiJson["PD_Member_Information"]= CompareJSON(
      pdMemberInformation,
      formData["pdMemberInformation"][0],
    );
    apiJson["PD_MEMBER_ADD_OF_RECORDS"] = CompareJSON(
      pdMemberAddRecord,
      formData["pdMemberAddRecord"][0],
    );
    apiJson["PD_MEMBER_ALTERNATIVE_CONTACT_INFO"] = CompareJSON(
      pdMemberAltInfo,
      formData["pdMemberAltInfo"][0],
    );
    apiJson["PD_Representative_Information"] = CompareJSON(
      pdRepresentativeInformation,
      formData["pdRepresentativeInformation"][0],
    );
   apiJson["PD_Representative_Add_of_Records"] = CompareJSON(
      pdRepresentativeAddRecord,
      formData["pdRepresentativeAddRecord"][0],
    );
   apiJson["PD_Representative_Alternative_Contact_Info"] = CompareJSON(
      pdRepresentativeAltRecord,
      formData["pdRepresentativeAltRecord"][0],
    );
    apiJson["PD_Decision"] = CompareJSON(
      pdDecisionAddRecord,
      formData["pdDecisionAddRecord"][0],
    );
    apiJson["PD_Notes"] = CompareJSON(
        pNotes,
        formData["pNotes"][0],
    );

    let updateCaseInfoArray = [];
    if (
      pdCaseInfoGrid.length > 0 ||
      originalPdCaseInfoGrid.length > 0
    ) {
      const maxLength = Math.min(
        pdCaseInfoGrid.length,
        originalPdCaseInfoGrid.length,
      );

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = pdCaseInfoGrid[i];

        for (let j = 0; j < originalPdCaseInfoGrid.length; j++) {
          const originalElement = originalPdCaseInfoGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateCaseInfoArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement),
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < pdCaseInfoGrid.length; i++) {
        const angelement = pdCaseInfoGrid[i];
        const index = originalPdCaseInfoGrid.findIndex(
          (element) => angelement.rowNumber === element.rowNumber,
        );

        if (index === -1) {
          if (!angelement.hasOwnProperty("caseNumber")) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateCaseInfoArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement,
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalPdCaseInfoGrid.length; i++) {
        const originalElement = originalPdCaseInfoGrid[i];
        const index = pdCaseInfoGrid.findIndex(
          (element) => originalElement.rowNumber === element.rowNumber,
        );
        if (index === -1) {
          updateCaseInfoArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"],
          });
        }
      }
    }

    let updateClaimArray = [];
    if (
      pdClaimInfoGrid.length > 0 ||
      originalPDClaimInfoGrid.length > 0
    ) {
      const maxLength = Math.min(
        pdClaimInfoGrid.length,
        originalPDClaimInfoGrid.length,
      );

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = pdClaimInfoGrid[i];

        for (let j = 0; j < originalPDClaimInfoGrid.length; j++) {
          const originalElement = originalPDClaimInfoGrid[j];
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
      for (let i = 0; i < pdClaimInfoGrid.length; i++) {
        const angelement = pdClaimInfoGrid[i];
        const index = originalPDClaimInfoGrid.findIndex(
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
      for (let i = 0; i < originalPDClaimInfoGrid.length; i++) {
        const originalElement = originalPDClaimInfoGrid[i];
        const index = pdClaimInfoGrid.findIndex(
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

    let updateAuthArray = [];
    if (
      pdAuthorizationInformationGrid.length > 0 ||
      originalPDAuthorizationInformationGrid.length > 0
    ) {
      const maxLength = Math.min(
        pdAuthorizationInformationGrid.length,
        originalPDAuthorizationInformationGrid.length,
      );

      // // Update existing rows
      for (let i = 0; i < maxLength; i++) {
        const element = pdAuthorizationInformationGrid[i];

        for (let j = 0; j < originalPDAuthorizationInformationGrid.length; j++) {
          const originalElement = originalPDAuthorizationInformationGrid[j];
          if (element.rowNumber === originalElement.rowNumber) {
            updateAuthArray.push({
              caseNumber: element["caseNumber"],
              rowNumber: element["rowNumber"],
              ...CompareJSON(element, originalElement),
            });
            break;
          }
        }
      }

      // Add rows
      for (let i = 0; i < pdAuthorizationInformationGrid.length; i++) {
        const angelement = pdAuthorizationInformationGrid[i];
        const index = originalPDAuthorizationInformationGrid.findIndex(
          (element) => angelement.rowNumber === element.rowNumber,
        );

        if (index === -1) {
          if (!angelement.hasOwnProperty("caseNumber")) {
            angelement.caseNumber = location.state.caseNumber;
          }
          updateAuthArray.push({
            operation: "I",
            rowNumber: angelement["rowNumber"],
            ...angelement,
          });
        }
      }

      // Delete rows
      for (let i = 0; i < originalPDAuthorizationInformationGrid.length; i++) {
        const originalElement = originalPDAuthorizationInformationGrid[i];
        const index = pdAuthorizationInformationGrid.findIndex(
          (element) => originalElement.rowNumber === element.rowNumber,
        );
        if (index === -1) {
          updateAuthArray.push({
            operation: "D",
            caseNumber: location.state.caseNumber,
            rowNumber: originalElement["rowNumber"],
          });
        }
      }
    }
    apiJson["PD_CASE_INFORMATION_GRID"] = updateCaseInfoArray;
    apiJson["PD_Claim_Information_Grid"] = updateClaimArray;
    apiJson["PD_Authorization_Information"] = updateAuthArray;
    console.log("location.state.caseNumberqqqqqqq", location.state.caseNumber)
    apiJson["caseNumber"] = location.state.caseNumber;
    const cleanedApiJson = removeDateInKeys(apiJson);
    customAxios
        .post("/generic/update", cleanedApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
      .then((res) => {
        const apiStat = res.data.UpdateCase_Output.Status;

        if (apiStat === -1) {
          alert("Error in updating data");
        }

        if (apiStat === 0) {
          updateDecision(location, saveType, "Provider Disputes");

          let procData = {};
          let procDataState = {};
          procDataState.stageName = location.state.stageName;
          procDataState.flowId = location.state.flowId;     
          procDataState.decisionNotes = location.state.decisionNotes;
          procDataState.caseNumber = location.state.caseNumber;
          procDataState.decision = location.state.decision;
          procDataState.decisionReason = location.state.decisionReason;
          procDataState.userName = authSelector.userName || "system";
          procDataState.formNames = "Provider Disputes";
          procData.state = procDataState;

          alert("Case updated successfully: " + location.state.caseNumber);
          submitCase(procData, navigateHome);
          navigateHome();
        }
      });
  };

  return {
    caseTimelines,
    pd_MemberAddRecord,
    pd_RepresentativeAddRecord,
    pd_RepresentativeInformation,
    pd_ProviderInformation,
    pd_RepresentativeAltRecord,
    pd_DecisionAddRecord,
    pd_ProviderAddRecord,
    pd_ProviderAlt,
    pd_MemberAltInfo,
    caseTimelinesValidationSchema,
    setCaseTimelines,
    setpdMemberAddRecord,
    setpdRepresentativeAddRecord,
    setpdRepresentativeInformation,
    setpdProviderInformation,
    setpdRepresentativeAltRecord,
    setpdDecisionAddRecord,
    setpdProviderAddRecord,
    setpdProviderAlt,
    setpdMemberAltInfo,
    handleCaseHeaderChange,
    caseHeader,
    setCaseHeader,
    caseInformation,
    setCaseInformation,
    caseInformationValidationSchema,
    memberAltValidationSchema,
    claimInformation,
    setClaimInformation,
    setProviderClaimInformation,
    claimInformationValidationSchema,
    providerclaimInformationValidationSchema,
    ProviderclaimInformationValidationGridSchema,
    claimInformationGrid,
    setClaimInformationGrid,
    providerInformationGrid,
    setProviderInformationGrid,
    memberInformation,
    memberInformationValidationSchema,
    setMemberInformation,
    ProvidermemberInformation,
    PdProviderInformation,
    ProvidermemberInformationValidationSchema,
    PdProviderInformationValidationSchema,
    setProviderMemberInformation,
    setPdProviderInformation,
    memberAlternativeContactSchema,
    representativeInformationGrid,
    setRepresentativeInformationGrid,
    handleAuthorizationInformationChange,
    authorizationInformation,
    setAuthorizationInformation,
    authorizationInformationGrid,
    setAuthorizationInformationGrid,
    ProviderauthorizationInformationGrid,
    setProviderAuthorizationInformationGrid,
    expeditedRequest,
    setExpeditedRequest,
    notes,
    setNotes,
    providerNotes,
    providerNotesValidationSchema,
    setProviderNotes,
    providerNotesErrors,
    expeditedRequestValidationSchema,
    location,
    navigateHome,
    saveAndExit,
    submitData,
    pdsubmitData,
    potentialDupData,
    apiTestState,
    callProcRef,
    hasSubmitError,
    documentSectionDataRef,
    caseTimelinesErrors,
    caseInformationErrors,
    claimInformationErrors,
    memberInformationErrors,
    ProvidermemberInformationErrors,
    PdProviderInformationErrors,
    memberAltErrors,
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
    memberAddErrors,
    representativeAddErrors,
    representativeInformationErrors,
    providerInformationErrors,
    representativeAltErrors,
    decisionAddErrors,
    providerAddErrors,
    providerAltErrors,
    notesValidationSchema,
    claimInformationGridRowValidationSchema,
    providerInformationGridValidationSchema,
    authorizationInformationGridValidationSchema,
    ProviderauthorizationInformationGridValidationSchema,
    representativeInformationGridValidationSchema,
    memberAddOfRecordsValidationSchema,
    representativeAltContactValidationSchema,
    representativeInformationValidationSchema,
    providerInformationValidationSchema,
    decisionAddOfRecordsValidationSchema,
    providerAddOfRecordsValidationSchema,
    providerAltValidationSchema,
    caseTimelinesFields,
    memberAddRecordFields,
    representativeAddRecordFields,
    representativeInformationFields,
    providerInformationFields,
    representativeAltFields,
    decisionAddRecordFields,
    providerAddRecordFields,
    providerAltFields,
    memberAltFields,
    setRenderType,
    caseHeaderFields,
    docNeededGrid,
    setDocNeededGrid,
    docNeededGridValidationSchema, 
    caseDecision,
    caseDecisionValidationSchema,
    setcaseDecision,
    caseDecisionErrors,
	  caseDecisionFields,
    caseDecisionDetails,
    setcaseDecisionDetails,
    caseDecisionDetailsValidationSchema,
    caseDecisionDetailsErrors,
	  caseDecisionDetailsFields,
    pd_CaseInformation,
    pdCaseInformationValidationSchema,
    setpdCaseInformation,
    caseInformationFields,
    pdCaseInformationErrors,
    pdCaseInformationGrid,
    setPDCaseInformationGrid,
    setIscheckedBox,
    pdClaimInformationGrid,
    ProviderClaimInformationGrid,
    setPDClaimInformationGrid,
    setNotesErrors,
    pdsaveAndExit,
    ProviderclaimInformation,
    
  };
};
