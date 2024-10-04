import { combineReducers } from "redux";
import authReducer from "./authReducer";
// import { reducer } from "redux-form";
import {
  STORE_DATA,
  CLEAR_DATA,
  UPDATE_PAGE_NUMBER,
  UPDATE_SEARCH_STRING,
  UPDATE_DATA,
  UPDATE_CASE_STATUS,
} from "../actions/types";

const exampleReducer = (state = [], action) => {
  if (action.type === "GET_DATA") {
    return [action.payload];
  } else if (action.type === "CLEAR_DATA") {
    state = [];
    return state;
  }
  return state;
};

const masterStateSymbolReducer = (state = [], action) => {
  if (action.type === "GET_STATE_SYMBOL") {
    return [action.payload];
  } else if (action.type === "CLEAR_STATE_SYMBOL") {
    state = [];
    return state;
  }
  return state;
};

const masterAddressTypeReducer = (state = [], action) => {
  if (action.type === "GET_ADDRESS_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_ADDRESS_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterLanguageReducer = (state = [], action) => {
  if (action.type === "GET_LANGUAGES") {
    return [action.payload];
  } else if (action.type === "CLEAR_LANGUAGES") {
    state = [];
    return state;
  }
  return state;
};

const masterAgesSeenReducer = (state = [], action) => {
  if (action.type === "GET_AGES_SEEN") {
    return [action.payload];
  } else if (action.type === "CLEAR_AGES_SEEN") {
    state = [];
    return state;
  }
  return state;
};

const masterSalutationReducer = (state = [], action) => {
  if (action.type === "GET_SALUTATION") {
    return [action.payload];
  } else if (action.type === "CLEAR_SALUTATION") {
    state = [];
    return state;
  }
  return state;
};

const masterLicenseTypeReducer = (state = [], action) => {
  if (action.type === "GET_LICENSE_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_LICENSE_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterEthnicityReducer = (state = [], action) => {
  if (action.type === "GET_ETHNICITY") {
    return [action.payload];
  } else if (action.type === "CLEAR_ETHNICITY") {
    state = [];
    return state;
  }
  return state;
};

const masterSpecialityReducer = (state = [], action) => {
  if (action.type === "GET_SPECIALITY") {
    return [action.payload];
  } else if (action.type === "CLEAR_SPECIALITY") {
    state = [];
    return state;
  }
  return state;
};

const masterGridLicenseTypeReducer = (state = [], action) => {
  if (action.type === "GET_GRID_LICENSE_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_GRID_LICENSE_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterGridHoursReducer = (state = [], action) => {
  if (action.type === "GET_GRIDHOURS") {
    return [action.payload];
  } else if (action.type === "CLEAR_GRIDHOURS") {
    state = [];
    return state;
  }
  return state;
};

const masterGraduateTypeReducer = (state = [], action) => {
  if (action.type === "GET_GRADUATE_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_GRADUATE_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterDocumentListReducer = (state = [], action) => {
  if (action.type === "GET_DOCUMENT_LIST") {
    return [action.payload];
  } else if (action.type === "CLEAR_DOCUMENT_LIST") {
    state = [];
    return state;
  }
  return state;
};

const masterDecisionReducer = (state = [], action) => {
  if (action.type === "GET_DECISION") {
    return [action.payload];
  } else if (action.type === "CLEAR_DECISION") {
    state = [];
    return state;
  }
  return state;
};

const masterDecisionReasonReducer = (state = [], action) => {
  if (action.type === "GET_DECISION_REASON") {
    return action.payload;
  } else if (action.type === "CLEAR_DECISION_REASON") {
    state = [];
    return state;
  }
  return state;
};

const masterDocumentNameReducer = (state = [], action) => {
  if (action.type === "GET_DEC_DOCUMENT") {
    return [action.payload];
  } else if (action.type === "CLEAR_DEC_DOCUMENT") {
    state = [];
    return state;
  }
  return state;
};

const masterAdditionalQuesReducer = (state = [], action) => {
  if (action.type === "GET_ADDITIONAL_QUES") {
    return [action.payload];
  } else if (action.type === "CLEAR_ADDITIONAL_QUES") {
    state = [];
    return state;
  }
  return state;
};

const masterStageRightsReducer = (state = [], action) => {
  if (action.type === "GET_STAGERIGHTS") {
    return [action.payload];
  } else if (action.type === "CLEAR_STAGERIGHTS") {
    state = [];
    return state;
  }
  return state;
};

const masterModuleRightsReducer = (state = [], action) => {
  if (action.type === "GET_MODULERIGHTS") {
    return [action.payload];
  } else if (action.type === "CLEAR_MODULERIGHTS") {
    state = [];
    return state;
  }
  return state;
};

const masterContractTypeReducer = (state = [], action) => {
  if (action.type === "GET_CONTRACTTYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_CONTRACTTYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterTaxonomyCodeReducer = (state = [], action) => {
  if (action.type === "GET_TAXONOMYCODE") {
    return [action.payload];
  } else if (action.type === "CLEAR_TAXONOMYCODE") {
    state = [];
    return state;
  }
  return state;
};

const masterProviderTypeReducer = (state = [], action) => {
  if (action.type === "GET_PROVIDERTYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_PROVIDERTYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterCompositionMaster = (state = {}, action) => {
  if (action.type === "GET_COMPOSITIONMASTER") {
    //console.log('Inside auth reducer masterCompositionMaster action payload: ',action.payload);
    return [action.payload];
  } else if (action.type === "CLEAR_COMPOSITIONMASTER") {
    state = [];
    return state;
  }
  return state;
};

//Added by Nidhi Gupta on 5/30/2023
const masterReferenceReducer = (state = [], action) => {
  if (action.type === "GET_REFERENCE") {
    return [action.payload];
  } else if (action.type === "CLEAR_REFERENCE") {
    state = [];
    return state;
  }
  return state;
};

//Till here
//Added by Nidhi Gupta on 5/31/2023
const masterHeaderFooterReducer = (state = [], action) => {
  if (action.type === "GET_HEADERFOOTER") {
    return [action.payload];
  } else if (action.type === "CLEAR_HEADERFOOTER") {
    state = [];
    return state;
  }
  return state;
};
//Till here

const masterProvContLinkDataReducer = (state = [], action) => {
  if (action.type === "GET_PROVCONTLINKDATA") {
    return [action.payload];
  } else if (action.type === "CLEAR_PROVCONTLINKDATA") {
    state = [];
    return state;
  }
  return state;
};

// Added by Shivani for CountyName
const masterCountyReducer = (state = [], action) => {
  if (action.type === "GET_MasterCounty") {
    return [action.payload];
  } else if (action.type === "CLEAR_MasterCounty") {
    state = [];
    return state;
  }
  return state;
};

// Added by Shivani for Master_ExclusionList
const masterExclusionListReducer = (state = [], action) => {
  if (action.type === "GET_MasterExclusionList") {
    return [action.payload];
  } else if (action.type === "CLEAR_MasterExclusionList") {
    state = [];
    return state;
  }
  return state;
};

//Added Newly by Nidhi Gupta on 09/01/2023
const masterDistinctValuesReducer = (state = [], action) => {
  if (action.type === "GET_DISTINCTVALUES") {
    return [action.payload];
  } else if (action.type === "CLEAR_DISTINCTVALUES") {
    state = [];
    return state;
  }
  return state;
};

// Added by Shivani for Master_Termination
const masterTerminationReducer = (state = [], action) => {
  if (action.type === "GET_MasterTermination") {
    return [action.payload];
  } else if (action.type === "CLEAR_MasterTermination") {
    state = [];
    return state;
  }
  return state;
};

//Till Here

const masterCommonReducer = (state = [], action) => {
  if (action.type === "GET_MASTERCOMMON") {
    return [action.payload][0];
  } else if (action.type === "CLEAR_MASTERCOMMON") {
    state = [];
    return state;
  }
  return state;
};

const masterStageReducer = (state = [], action) => {
  if (action.type === "GET_stagetable") {
    return [action.payload];
  } else if (action.type === "CLEAR_stagetable") {
    state = [];
    return state;
  }
  return state;
};
const viewReportsReducer = (state = [], action) => {
  if (action.type === "Get_ViewReports_table") {
    return [...action.payload];
  } else if (action.type === "CLEAR_ViewReports_table") {
    state = [];
    return state;
  }
  return state;
};

const masterAngCaseFilingMethodReducer = (state = [], action) => {
  if (action.type === "GET_CASE_FILING_METHOD") {
    return [action.payload];
  } else if (action.type === "CLEAR_CASE_FILING_METHOD") {
    state = [];
    return state;
  }
  return state;
};

const masterAngLOBMappingReducer = (state = [], action) => {
  if (action.type === "GET_LOB_MAPPING") {
    return [action.payload];
  } else if (action.type === "CLEAR_LOB_MAPPING") {
    state = [];
    return state;
  }
  return state;
};

const masterAngAppellantDescReducer = (state = [], action) => {
  if (action.type === "GET_APPELLANT_DESC") {
    return [action.payload];
  } else if (action.type === "CLEAR_APPELLANT_DESC") {
    state = [];
    return state;
  }
  return state;
};
const masterAngProductTypeReducer = (state = [], action) => {
  if (action.type === "GET_PRODUCT_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_PRODUCT_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngDenialTypeReducer = (state = [], action) => {
  if (action.type === "GET_DENIAL_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_DENIAL_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngAppellantTypeReducer = (state = [], action) => {
  if (action.type === "GET_APPELLANT_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_APPELLANT_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngAppealTypeReducer = (state = [], action) => {
  if (action.type === "GET_APPEAL_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_APPEAL_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngCaseLevelPriorityReducer = (state = [], action) => {
  if (action.type === "GET_CASE_LEVEL_PRIORITY") {
    return [action.payload];
  } else if (action.type === "CLEAR_CASE_LEVEL_PRIORITY") {
    state = [];
    return state;
  }
  return state;
};

const masterAngIssueLevelReducer = (state = [], action) => {
  if (action.type === "GET_ISSUE_LEVEL") {
    return [action.payload];
  } else if (action.type === "CLEAR_ISSUE_LEVEL") {
    state = [];
    return state;
  }
  return state;
};

const masterAngReviewTypeReducer = (state = [], action) => {
  if (action.type === "GET_REVIEW_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_REVIEW_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngClaimTypeReducer = (state = [], action) => {
  if (action.type === "GET_CLAIM_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_CLAIM_TYPE") {
    state = [];
    return state;
  }
  return state;
};
const masterAngLineNumberReducer = (state = [], action) => {
  if (action.type === "GET_LINE_NUMBER") {
    return [action.payload];
  } else if (action.type === "CLEAR_LINE_NUMBER") {
    state = [];
    return state;
  }
  return state;
};
const masterAngDecisionReducer = (state = [], action) => {
  if (action.type === "GET_DECISION") {
    return [action.payload];
  } else if (action.type === "CLEAR_DECISION") {
    state = [];
    return state;
  }
  return state;
};

const masterAngAuthServiceTypeReducer = (state = [], action) => {
  if (action.type === "GET_AUTH_SERVICE_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_AUTH_SERVICE_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngProcessingStatusReducer = (state = [], action) => {
  if (action.type === "GET_PROCESSING_STATUS") {
    return [action.payload];
  } else if (action.type === "CLEAR_PROCESSING_STATUS") {
    state = [];
    return state;
  }
  return state;
};

const masterAngFiledTimelyReducer = (state = [], action) => {
  if (action.type === "GET_FILED_TIMELY") {
    return [action.payload];
  } else if (action.type === "CLEAR_FILED_TIMELY") {
    state = [];
    return state;
  }
  return state;
};

const masterAngGrantGoodCauseReducer = (state = [], action) => {
  if (action.type === "GET_GRANT_GOOD_CAUSE") {
    return [action.payload];
  } else if (action.type === "CLEAR_GRANT_GOOD_CAUSE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngProviderRoleReducer = (state = [], action) => {
  if (action.type === "GET_PROVIDER_ROLE") {
    return [action.payload];
  } else if (action.type === "CLEAR_PROVIDER_ROLE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngProviderTypeReducer = (state = [], action) => {
  if (action.type === "GET_PROVIDER_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_PROVIDER_TYPE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngParProviderReducer = (state = [], action) => {
  if (action.type === "GET_PAR_PROVIDER") {
    return [action.payload];
  } else if (action.type === "CLEAR_PAR_PROVIDER") {
    state = [];
    return state;
  }
  return state;
};

const masterAngPortalEnrolledReducer = (state = [], action) => {
  if (action.type === "GET_PORTAL_ENROLLED") {
    return [action.payload];
  } else if (action.type === "CLEAR_PORTAL_ENROLLED") {
    state = [];
    return state;
  }
  return state;
};

const masterAngDeceasedReducer = (state = [], action) => {
  if (action.type === "GET_DECEASED") {
    return [action.payload];
  } else if (action.type === "CLEAR_DECEASED") {
    state = [];
    return state;
  }
  return state;
};

const masterAngGenderReducer = (state = [], action) => {
  if (action.type === "GET_GENDER") {
    return [action.payload];
  } else if (action.type === "CLEAR_GENDER") {
    state = [];
    return state;
  }
  return state;
};

const masterAngDualPlanReducer = (state = [], action) => {
  if (action.type === "GET_DUAL_PLAN") {
    return [action.payload];
  } else if (action.type === "CLEAR_DUAL_PLAN") {
    state = [];
    return state;
  }
  return state;
};

const masterAngMailToAddressReducer = (state = [], action) => {
  if (action.type === "GET_MAIL_TO_ADDRESS") {
    return [action.payload];
  } else if (action.type === "CLEAR_MAIL_TO_ADDRESS") {
    state = [];
    return state;
  }
  return state;
};

const masterAngPreferredLanguageReducer = (state = [], action) => {
  if (action.type === "GET_PREFERRED_LANGUAGE") {
    return [action.payload];
  } else if (action.type === "CLEAR_PREFERRED_LANGUAGE") {
    state = [];
    return state;
  }
  return state;
};

const masterAngCommPrefReducer = (state = [], action) => {
  if (action.type === "GET_COMM_PREF") {
    return [action.payload];
  } else if (action.type === "CLEAR_COMM_PREF") {
    state = [];
    return state;
  }
  return state;
};

const masterAngExpeditedRequestedReducer = (state = [], action) => {
  if (action.type === "GET_EXPEDITED_REQUESTED") {
    return [action.payload];
  } else if (action.type === "CLEAR_EXPEDITED_REQUESTED") {
    state = [];
    return state;
  }
  return state;
};
const masterAngExpeditedDeniedReducer = (state = [], action) => {
  if (action.type === "GET_EXPEDITED_DENIED") {
    return [action.payload];
  } else if (action.type === "CLEAR_EXPEDITED_DENIED") {
    state = [];
    return state;
  }
  return state;
};

const masterAngStUpExpeditedReducer = (state = [], action) => {
  if (action.type === "GET_ST_UP_EXPEDITED") {
    return [action.payload];
  } else if (action.type === "CLEAR_ST_UP_EXPEDITED") {
    state = [];
    return state;
  }
  return state;
};

const masterAngDocumentReducer = (state = [], action) => {
  if (action.type === "GET_DOCUMENT") {
    return [action.payload];
  } else if (action.type === "CLEAR_DOCUMENT") {
    state = [];
    return state;
  }
  return state;
};
const masterAngDocNeededReducer = (state = [], action) => {
  if (action.type === "GET_DOC_NEEDED") {
    return [action.payload];
  } else if (action.type === "CLEAR_DOC_NEEDED") {
    state = [];
    return state;
  }
  return state;
};

const masterAngRequestedFromReducer = (state = [], action) => {
  if (action.type === "GET_REQUESTED_FROM") {
    return [action.payload];
  } else if (action.type === "CLEAR_REQUESTED_FROM") {
    state = [];
    return state;
  }
  return state;
};

const masterAngNeededByReducer = (state = [], action) => {
  if (action.type === "GET_NEEDED_BY") {
    return [action.payload];
  } else if (action.type === "CLEAR_NEEDED_BY") {
    state = [];
    return state;
  }
  return state;
};

const masterAngRelationshipReducer = (state = [], action) => {
  if (action.type === "GET_RELATIONSHIP") {
    return [action.payload];
  } else if (action.type === "CLEAR_RELATIONSHIP") {
    state = [];
    return state;
  }
  return state;
};

const masterAngAORTypeReducer = (state = [], action) => {
  if (action.type === "GET_AOR_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_AOR_TYPE") {
    state = [];
    return state;
  }
  return state;
};
const masterAngAuthDecisionReducer = (state = [], action) => {
  if (action.type === "GET_AUTH_DECISION") {
    return [action.payload];
  } else if (action.type === "CLEAR_AUTH_DECISION") {
    state = [];
    return state;
  }
  return state;
};

const masterPDTimeFrameExtendedReducer = (state = [], action) => {
  if (action.type === "GET_TIMEFRAME_EXTENDED") {
    return [action.payload];
  } else if (action.type === "CLEAR_TIMEFRAME_EXTENDED") {
    state = [];
    return state;
  }
  return state;
};
const masterPDCaseInComplianceReducer = (state = [], action) => {
  if (action.type === "GET_CASE_IN_COMPLIANCE") {
    return [action.payload];
  } else if (action.type === "CLEAR_CASE_IN_COMPLIANCE") {
    state = [];
    return state;
  }
  return state;
};
const masterPDDepartmentReducer = (state = [], action) => {
  if (action.type === "GET_DEPARTMENT") {
    return [action.payload];
  } else if (action.type === "CLEAR_DEPARTMENT") {
    state = [];
    return state;
  }
  return state;
};
const masterPDNoOfClaimsReducer = (state = [], action) => {
  if (action.type === "GET_NUM_OF_CLAIMS") {
    return [action.payload];
  } else if (action.type === "CLEAR_NUM_OF_CLAIMS") {
    state = [];
    return state;
  }
  return state;
};
const masterPDMailToAddressReducer = (state = [], action) => {
  if (action.type === "GET_MAIL_TO_ADDRESS") {
    return [action.payload];
  } else if (action.type === "CLEAR_MAIL_TO_ADDRESS") {
    state = [];
    return state;
  }
  return state;
};
const masterPDIntakeDecisionReducer = (state = [], action) => {
  if (action.type === "GET_INTAKE_DECISION") {
    return [action.payload];
  } else if (action.type === "CLEAR_INTAKE_DECISION") {
    state = [];
    return state;
  }
  return state;
};
const masterPDIntakeDecisionReasonReducer = (state = [], action) => {
  if (action.type === "GET_INTAKE_DECISION_REASON") {
    return [action.payload];
  } else if (action.type === "CLEAR_INTAKE_DECISION_REASON") {
    state = [];
    return state;
  }
  return state;
};
const masterPDClaimTypeReducer = (state = [], action) => {
  if (action.type === "GET_CLAIM_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_CLAIM_TYPE") {
    state = [];
    return state;
  }
  return state;
};
const masterPDFilledTimelyReducer = (state = [], action) => {
  if (action.type === "GET_FILED_TIMELY") {
    return [action.payload];
  } else if (action.type === "CLEAR_FILED_TIMELY") {
    state = [];
    return state;
  }
  return state;
};
const masterPDGrantGoodCauseReducer = (state = [], action) => {
  if (action.type === "GET_GRANT_GOOD_CAUSE") {
    return [action.payload];
  } else if (action.type === "CLEAR_GRANT_GOOD_CAUSE") {
    state = [];
    return state;
  }
  return state;
};
const masterPDPortalEnrolledReducer = (state = [], action) => {
  if (action.type === "GET_PORTAL_ENROLLED") {
    return [action.payload];
  } else if (action.type === "CLEAR_PORTAL_ENROLLED") {
    state = [];
    return state;
  }
  return state;
};
const masterPDDenialCodeAndReasonReducer = (state = [], action) => {
  if (action.type === "GET_DENIAL_CODE_AND_REASON") {
    return [action.payload];
  } else if (action.type === "CLEAR_DENIAL_CODE_AND_REASON") {
    state = [];
    return state;
  }
  return state;
};
const masterPDComplainantTypeReducer = (state = [], action) => {
  if (action.type === "GET_COMPLAINANT_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_COMPLAINANT_TYPE") {
    state = [];
    return state;
  }
  return state;
};
const masterPDSubIssueLevelReducer = (state = [], action) => {
  if (action.type === "GET_SUB_ISSUE_LEVEL") {
    return [action.payload];
  } else if (action.type === "CLEAR_SUB_ISSUE_LEVEL") {
    state = [];
    return state;
  }
  return state;
};
const masterPDIssueTypeReducer = (state = [], action) => {
  if (action.type === "GET_ISSUE_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_ISSUE_TYPE") {
    state = [];
    return state;
  }
  return state;
};
const masterPDProductReducer = (state = [], action) => {
  if (action.type === "GET_PRODUCT") {
    return [action.payload];
  } else if (action.type === "CLEAR_PRODUCT") {
    state = [];
    return state;
  }
  return state;
};
const masterPDComplaintTypeReducer = (state = [], action) => {
  if (action.type === "GET_COMPLAINT_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_COMPLAINT_TYPE") {
    state = [];
    return state;
  }
  return state;
};
const masterPDIssueLevelNumReducer = (state = [], action) => {
  if (action.type === "GET_CASE_LEVEL_NUMBER") {
    return [action.payload];
  } else if (action.type === "CLEAR_CASE_LEVEL_NUMBER") {
    state = [];
    return state;
  }
  return state;
};
const masterPDIssueLevelPriorityReducer = (state = [], action) => {
  if (action.type === "GET_ISSUE_LEVEL") {
    return [action.payload];
  } else if (action.type === "CLEAR_ISSUE_LEVEL") {
    state = [];
    return state;
  }
  return state;
};

const masterPDLineOfBusinessReducer = (state = [], action) => {
  if (action.type === "GET_LOBMAPPING") {
    return [action.payload];
  } else if (action.type === "CLEAR_LOBMAPPING") {
    state = [];
    return state;
  }
  return state;
};

const masterPDDualPlanReducer = (state = [], action) => {
  if (action.type === "GET_DUAL_PLAN") {
    return [action.payload];
  } else if (action.type === "CLEAR_DUAL_PLAN") {
    state = [];
    return state;
  }
  return state;
};
const masterPDLisReducer = (state = [], action) => {
  if (action.type === "GET_LIS") {
    return [action.payload];
  } else if (action.type === "CLEAR_LIS") {
    state = [];
    return state;
  }
  return state;
};
const masterPDCommPrefReducer = (state = [], action) => {
  if (action.type === "GET_COMM_PREF") {
    return [action.payload];
  } else if (action.type === "CLEAR_COMM_PREF") {
    state = [];
    return state;
  }
  return state;
};
const masterPDCaseFillingMethodReducer = (state = [], action) => {
  if (action.type === "GET_CASE_FILING_METHOD") {
    return [action.payload];
  } else if (action.type === "CLEAR_CASE_FILING_METHOD") {
    state = [];
    return state;
  }
  return state;
};
const masterPDRelationshipReducer = (state = [], action) => {
  if (action.type === "GET_RELATIONSHIP") {
    return [action.payload];
  } else if (action.type === "CLEAR_RELATIONSHIP") {
    state = [];
    return state;
  }
  return state;
};
const masterPDAuthTypeReducer = (state = [], action) => {
  if (action.type === "GET_AUTH_TYPE") {
    return [action.payload];
  } else if (action.type === "CLEAR_AUTH_TYPE") {
    state = [];
    return state;
  }
  return state;
};
const masterPDGoodCauseReasonReducer = (state = [], action) => {
  if (action.type === "GET_GOOD_CAUSE_REASON") {
    return [action.payload];
  } else if (action.type === "CLEAR_GOOD_CAUSE_REASON") {
    state = [];
    return state;
  }
  return state;
};

const storeTableStateReducer = (
  state = {
    data: [],
    pageNumber: 0,
    searchString: "",
    stageName: "",
    caseSubmitted: false,
  },
  action,
) => {
  switch (action.type) {
    case STORE_DATA:
      console.log("pravsc1", action.payload.data);
      return {
        data: [...action.payload.data],
        pageNumber: action.payload.pageNumber,
        searchString: action.payload.searchString,
        caseSubmitted: action.payload.caseSubmitted,
      };
    case CLEAR_DATA:
      console.log("pravsc2");
      return {
        data: [],
        pageNumber: 0,
        searchString: "",
      };
    case UPDATE_PAGE_NUMBER:
      console.log("pravsc3");
      return {
        ...state,
        pageNumber: action.payload.pageNumber,
      };
    case UPDATE_SEARCH_STRING:
      console.log("pravsc4");
      return {
        ...state,
        searchString: action.payload.searchString,
      };
    case UPDATE_DATA:
      console.log("pravsc5", action.payload.data);
      return {
        ...state,
        data: [...action.payload.data],
      };
    case UPDATE_CASE_STATUS:
      console.log("pravsc6");
      return {
        ...state,
        caseSubmitted: action.payload.caseSubmitted,
      };

    default:
      return state;
  }
};
const usersReducer = (state = [], action) => {
  if (action.type === "GET_ALL_USERS") {
    return [...action.payload];
  } else if (action.type === "CLEAR_ALL_USERS") {
    state = [];
    return state;
  }
  return state;
};

export default combineReducers({
  auth: authReducer,
  masterStateSymbol: masterStateSymbolReducer,
  masterAddressType: masterAddressTypeReducer,
  masterLanguages: masterLanguageReducer,
  masterAgesSeen: masterAgesSeenReducer,
  masterSalutation: masterSalutationReducer,
  masterLicenseType: masterLicenseTypeReducer,
  masterEthnicity: masterEthnicityReducer,
  masterSpeciality: masterSpecialityReducer,
  masterGridLicenseType: masterGridLicenseTypeReducer,
  masterGridHours: masterGridHoursReducer,
  masterGraduateType: masterGraduateTypeReducer,
  masterDocumentList: masterDocumentListReducer,
  masterDecision: masterDecisionReducer,
  masterDecisionReason: masterDecisionReasonReducer,
  masterDocumentName: masterDocumentNameReducer,
  masterAdditionalQues: masterAdditionalQuesReducer,
  masterStageRights: masterStageRightsReducer,
  masterContractType: masterContractTypeReducer,
  masterTaxonomyCode: masterTaxonomyCodeReducer,
  masterProviderType: masterProviderTypeReducer,
  masterReference: masterReferenceReducer,
  masterHeaderFooter: masterHeaderFooterReducer,
  masterCompositionMaster: masterCompositionMaster,
  masterProvContLinkData: masterProvContLinkDataReducer,
  masterModuleRights: masterModuleRightsReducer,
  masterCounty: masterCountyReducer,
  masterExclusionList: masterExclusionListReducer,
  masterDistinctValues: masterDistinctValuesReducer,
  masterTermination: masterTerminationReducer,
  masterTypeCommon: masterCommonReducer,
  masterStageTable: masterStageReducer,
  viewReportsTable: viewReportsReducer,
  masterAngCaseFilingMethod: masterAngCaseFilingMethodReducer,
  masterAngLOBMapping: masterAngLOBMappingReducer,
  masterAngAppellantDesc: masterAngAppellantDescReducer,
  masterAngProductType:masterAngProductTypeReducer,
  masterAngDenialType:masterAngDenialTypeReducer,
  masterAngAppellantType: masterAngAppellantTypeReducer,
  masterAngAppealType: masterAngAppealTypeReducer,
  masterAngCaseLevelPriority: masterAngCaseLevelPriorityReducer,
  masterAngIssueLevel: masterAngIssueLevelReducer,
  masterAngReviewType: masterAngReviewTypeReducer,
  masterAngClaimType: masterAngClaimTypeReducer,
  masterAngLineNumber:masterAngLineNumberReducer,
  masterAngDecision: masterAngDecisionReducer,
  masterAngAuthServiceType: masterAngAuthServiceTypeReducer,
  masterAngProcessingStatus: masterAngProcessingStatusReducer,
  masterAngFiledTimely: masterAngFiledTimelyReducer,
  masterAngGrantGoodCause: masterAngGrantGoodCauseReducer,
  masterAngProviderRole: masterAngProviderRoleReducer,
  masterAngProviderType: masterAngProviderTypeReducer,
  masterAngParProvider: masterAngParProviderReducer,
  masterAngPortalEnrolled: masterAngPortalEnrolledReducer,
  masterAngDeceased: masterAngDeceasedReducer,
  masterAngGender: masterAngGenderReducer,
  masterAngDualPlan: masterAngDualPlanReducer,
  masterAngMailToAddress: masterAngMailToAddressReducer,
  masterAngPreferredLanguage: masterAngPreferredLanguageReducer,
  masterAngCommPref: masterAngCommPrefReducer,
  masterAngExpeditedRequested: masterAngExpeditedRequestedReducer,
  masterAngExpeditedDenied: masterAngExpeditedDeniedReducer,
  masterAngStUpExpedited: masterAngStUpExpeditedReducer,
  masterAngDocNeeded:masterAngDocNeededReducer,
  masterAngRequestedFrom:masterAngRequestedFromReducer,
  masterAngNeededBy:masterAngNeededByReducer,
  masterAngDocument: masterAngDocumentReducer,
  masterAngRelationship: masterAngRelationshipReducer,
  masterAngAORType: masterAngAORTypeReducer,
  masterAngAuthDecision:masterAngAuthDecisionReducer,

  masterPDTimeFrameExtended:masterPDTimeFrameExtendedReducer,
  masterPDCaseInCompliance:masterPDCaseInComplianceReducer,
  masterPDDepartment:masterPDDepartmentReducer,
  masterPDNoOfClaims:masterPDNoOfClaimsReducer,
  masterPDMailToAddress:masterPDMailToAddressReducer,
  masterPDIntakeDecision:masterPDIntakeDecisionReducer,
  masterPDIntakeDecisionReason:masterPDIntakeDecisionReasonReducer,
  masterPDClaimType:masterPDClaimTypeReducer,
  masterPDFilledTimely:masterPDFilledTimelyReducer,
  masterPDGrantGoodCause:masterPDGrantGoodCauseReducer,
  masterPDPortalEnrolled:masterPDPortalEnrolledReducer,
  masterPDDenialCodeAndReason:masterPDDenialCodeAndReasonReducer,
  masterPDComplainantType:masterPDComplainantTypeReducer,
  masterPDSubIssueLevel:masterPDSubIssueLevelReducer,
  masterPDIssueType:masterPDIssueTypeReducer,
  masterPDProduct:masterPDProductReducer,
  masterPDCaseFillingMethod:masterPDCaseFillingMethodReducer,
  masterPDComplaintType:masterPDComplaintTypeReducer,
  masterPDIssueLevelNum:masterPDIssueLevelNumReducer,
  masterPDIssueLevelPriority:masterPDIssueLevelPriorityReducer,
  masterPDLineOfBusiness:masterPDLineOfBusinessReducer,
  masterPDDualPlan:masterPDDualPlanReducer,
  masterPDLis:masterPDLisReducer,
  masterPDCommPref:masterPDCommPrefReducer,
  masterPDRelationship:masterPDRelationshipReducer,
  masterPDAuthType:masterPDAuthTypeReducer,
  masterPDGoodCauseReason:masterPDGoodCauseReasonReducer,
  dashboardNavigationState: storeTableStateReducer,
  usersTable: usersReducer,
});
