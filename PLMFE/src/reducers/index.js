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

const masterAngDecisionReducer = (state = [], action) => {
  if (action.type === "GET_DECISION") {
    return [action.payload];
  } else if (action.type === "CLEAR_DECISION") {
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

const storeTableStateReducer = (
  state = {
    data: [],
    pageNumber: 0,
    searchString: "",
    stageName: "",
    caseSubmitted: false,
  },
  action
) => {
  switch (action.type) {
    case STORE_DATA:
      console.log("pravsc1", action.payload.data)
      return {
        data: [...action.payload.data],
        pageNumber: action.payload.pageNumber,
        searchString: action.payload.searchString,
        caseSubmitted: action.payload.caseSubmitted,
      };
    case CLEAR_DATA:
      console.log("pravsc2")
      return {
        data: [],
        pageNumber: 0,
        searchString: "",
      };
    case UPDATE_PAGE_NUMBER:
      console.log("pravsc3")
      return {
        ...state,
        pageNumber: action.payload.pageNumber,
      };
    case UPDATE_SEARCH_STRING:
      console.log("pravsc4")
      return {
        ...state,
        searchString: action.payload.searchString,
      };
    case UPDATE_DATA:
      console.log("pravsc5", action.payload.data)
      return {
        ...state,
        data: [...action.payload.data],
      };
    case UPDATE_CASE_STATUS:
      console.log("pravsc6")
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
  masterAngAppellantType: masterAngAppellantTypeReducer,
  masterAngAppealType: masterAngAppealTypeReducer,
  masterAngCaseLevelPriority: masterAngCaseLevelPriorityReducer,
  masterAngIssueLevel: masterAngIssueLevelReducer,
  masterAngReviewType: masterAngReviewTypeReducer,
  masterAngClaimType: masterAngClaimTypeReducer,
  masterAngDecision: masterAngDecisionReducer,
  masterAngProcessingStatus: masterAngProcessingStatusReducer,
  dashboardNavigationState: storeTableStateReducer,
  usersTable: usersReducer,
});
