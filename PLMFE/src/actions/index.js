/* eslint-disable no-unused-vars */
import { isNull } from "lodash";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
// import customAxios from "../../api/axios";
import { CLEAR_SIGN_IN, CLEAR_ALL_STATE, SIGN_IN, SIGN_OUT } from "./types";
import { baseURL } from "../api/baseURL";

// Auth API Output
// {
//   "Login_Output": {
//     "Option": "Login",
// 	"Status": 0
//     "Participant": {
//       "Token": -447651043,
//       "UserID": 1,
//       "LastLoginTime": "",
//       "UserType": "",
//       "Privileges": ""
//     },
//   }
// }
// -------------------------------------------------------------
// Provider Output when user will click on save
// {
//   "CreateCase_Output": {
//     "Option": "CreateCase",
//     "Status": 0
//     "CaseNo": "Case-01",
//     "CreationDateTime": "2017-12-\n06 15:38:29.81",
//   }
// }
// let clearTokenTimer;

// export const autoClearToken = ()=>{
//  return dispatch => {
//    if(clearTokenTimer){
//      clearTimeout(clearTokenTimer);
//    }
//    clearTokenTimer = setTimeout(()=>{
//      dispatch({type: CLEAR_SIGN_IN, payload: null});
//    }, 10000)
//  }
// }

export const signOut = (token, onSuccess, onError) => {
  return async (dispatch) => {
    axios
      .post(
        "/auth/logout",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        dispatch({ type: SIGN_OUT, payload: null });
        onSuccess();
      })
      .catch((err) => {
        onError();
      });
  };
};

export const signIn = (
  userName,
  password,
  clearFlag = false,
  onError,
  onSuccess,
  Page
) => {
  return async (dispatch) => {
    if (!clearFlag) {
      axios
        .post("/auth/login", {
          userName: userName.toLowerCase(),
          password: password,
          loginPortal: Page,
        })
        .then((response) => {
          console.log(response);
          dispatch({ type: SIGN_IN, payload: response });
          if (onSuccess) {
            onSuccess(response);
          }
        })
        .catch((error) => {
          console.log("contracting Error", error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: CLEAR_SIGN_IN, payload: "" });
    }
  };
};

export const getMasterStateSymbol = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_States~masterStates");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterStates];
            //console.log(response);
            dispatch({ type: "GET_STATE_SYMBOL", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_STATE_SYMBOL", payload: "" });
    }
  };
};

export const getMasterAngCaseFilingMethod = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_CASE_FILING_METHOD~masterAngCaseFilingMethod");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngCaseFilingMethod];
            //console.log(response);
            dispatch({ type: "GET_CASE_FILING_METHOD", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_CASE_FILING_METHOD", payload: "" });
    }
  };
};

export const getMasterAngLOBMapping = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_LOBMAPPING~masterAngLOBMapping");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngLOBMapping];
            //console.log(response);
            dispatch({ type: "GET_LOB_MAPPING", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_LOB_MAPPING", payload: "" });
    }
  };
};

export const getMasterAngAppellantDesc = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_APPELLANT_DESC~masterAngAppellantDesc");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngAppellantDesc];
            //console.log(response);
            dispatch({ type: "GET_APPELLANT_DESC", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_APPELLANT_DESC", payload: "" });
    }
  };
};

export const getMasterAngAppellantType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_APPELLANT_TYPE~masterAngAppellantType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngAppellantType];
            //console.log(response);
            dispatch({ type: "GET_APPELLANT_TYPE", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_APPELLANT_TYPE", payload: "" });
    }
  };
};

export const getMasterAngAppealType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_APPEAL_TYPE~masterAngAppealType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngAppealType];
            //console.log(response);
            dispatch({ type: "GET_APPEAL_TYPE", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_APPEAL_TYPE", payload: "" });
    }
  };
};

export const getMasterAngCaseLevelPriority = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_CASE_LEVEL_PRIORITY~masterAngCaseLevelPriority");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngCaseLevelPriority];
            //console.log(response);
            dispatch({ type: "GET_CASE_LEVEL_PRIORITY", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_CASE_LEVEL_PRIORITY", payload: "" });
    }
  };
};

export const getMasterAngIssueLevel = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_ISSUE_LEVEL~masterAngIssueLevel");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngIssueLevel];
            //console.log(response);
            dispatch({ type: "GET_ISSUE_LEVEL", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_ISSUE_LEVEL", payload: "" });
    }
  };
};

export const getMasterAngReviewType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_REVIEW_TYPE~masterAngReviewType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngReviewType];
            //console.log(response);
            dispatch({ type: "GET_REVIEW_TYPE", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_REVIEW_TYPE", payload: "" });
    }
  };
};

export const getMasterAngClaimType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_CLAIM_TYPE~masterAngClaimType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngClaimType];
            //console.log(response);
            dispatch({ type: "GET_CLAIM_TYPE", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_CLAIM_TYPE", payload: "" });
    }
  };
};

export const getMasterAngDecision = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_DECISION~masterAngDecision");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngDecision];
            //console.log(response);
            dispatch({ type: "GET_DECISION", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_DECISION", payload: "" });
    }
  };
};

export const getMasterAngProcessingStatus = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_PROCESSING_STATUS~masterAngProcessingStatus");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngProcessingStatus];
            //console.log(response);
            dispatch({ type: "GET_PROCESSING_STATUS", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_PROCESSING_STATUS", payload: "" });
    }
  };
};

export const getMasterAddressType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_AddressType~addressTypeMaster");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.addressTypeMaster];
            //console.log(res);
            dispatch({ type: "GET_ADDRESS_TYPE", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_ADDRESS_TYPE", payload: "" });
    }
  };
};

export const getMasterAgesSeen = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_AgesSeen~agesSeenMaster");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })

        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.agesSeenMaster];
            //console.log(res);
            dispatch({ type: "GET_AGES_SEEN", payload: respData });
            if (onSuccess) {
              onSuccess(res, "masterAgesSeen");
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_AGES_SEEN", payload: "" });
    }
  };
};

export const getMasterLanguages = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_Languages~languageMaster");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.languageMaster];
            //console.log(res);
            dispatch({ type: "GET_LANGUAGES", payload: respData });
            if (onSuccess) {
              onSuccess(res, "masterLanguages");
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_LANGUAGES", payload: "" });
    }
  };
};

export const getMasterSalutation = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_Salutation~salutationMaster");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.salutationMaster];
            //console.log(res);
            dispatch({ type: "GET_SALUTATION", payload: respData });
            if (onSuccess) {
              onSuccess(res, "masterSalutation");
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_SALUTATION", payload: "" });
    }
  };
};

export const getMasterLicenseType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      axios
        .get("/master/licenseType", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response);
          dispatch({ type: "GET_LICENSE_TYPE", payload: response });
          if (onSuccess) {
            onSuccess(response, "masterLicenseType");
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_LICENSE_TYPE", payload: "" });
    }
  };
};

export const getMasterEthnicity = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_Ethnicity~ethinicityMaster");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.ethinicityMaster];
            //console.log(res);
            dispatch({ type: "GET_ETHNICITY", payload: respData });
            if (onSuccess) {
              onSuccess(res, "masterEthnicity");
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_ETHNICITY", payload: "" });
    }
  };
};

export const getMasterSpeciality = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_Speciality~specialityMaster");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.specialityMaster];
            //console.log(res);
            dispatch({ type: "GET_SPECIALITY", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_SPECIALITY", payload: "" });
    }
  };
};

export const getMasterGridLicenseType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_GridLicenseType~gridLicenseType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.gridLicenseType];
            //console.log(response);
            dispatch({ type: "GET_GRID_LICENSE_TYPE", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_GRID_LICENSE_TYPE", payload: "" });
    }
  };
};

export const getMasterGridHours = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      axios
        .get("/master/gridHours", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response);
          dispatch({ type: "GET_GRIDHOURS", payload: response });
          if (onSuccess) {
            onSuccess(response);
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_GRIDHOURS", payload: "" });
    }
  };
};

export const getMasterGraduateType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_GraduateType~graduateType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.graduateType];
            //console.log(response);
            dispatch({ type: "GET_GRADUATE_TYPE", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_GRADUATE_TYPE", payload: "" });
    }
  };
};

export const getMasterDocumentList = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  // alert("docli"+token) //Commented by Nidhi
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "Master_DocumentList~docList");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            //console.log("Document List Response: ", response);
            const respData = [...res.data.data.docList];
            dispatch({ type: "GET_DOCUMENT_LIST", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_DOCUMENT_LIST", payload: "" });
    }
  };
};

export const getMasterDecision = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      // axios.get("/master/decision?flowId="+flowId+"&stageName="+stageName, {
      axios
        .get("/master/decision", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response);
          dispatch({ type: "GET_DECISION", payload: response });
          if (onSuccess) {
            onSuccess(response);
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_DECISION", payload: "" });
    }
  };
};

export const getMasterDecisionReason = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {

    if (!clearFlag) {
      axios
        .get("/master/decision/reason", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          console.log(response);
          dispatch({ type: "GET_DECISION_REASON", payload: response.data });
          if (onSuccess) {
            onSuccess(response);
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_DECISION_REASON", payload: "" });
    }
  };
};

export const getMasterDocumentName = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "DocumentTable~docTable");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            //console.log(response);
            const respData = [...res.data.data.docTable];
            dispatch({ type: "GET_DEC_DOCUMENT", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }
        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_DEC_DOCUMENT", payload: "" });
    }
  };
};

export const getMasterAdditionalQues = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "AdditionalQuesTable~addQuesTable");
      console.log("")
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log(res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.addQuesTable];
            dispatch({ type: "GET_ADDITIONAL_QUES", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }

        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_ADDITIONAL_QUES", payload: "" });
    }
  };
};

export const getStageRights = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      let getApiJson = {};
      getApiJson["tableNames"] = ["STAGERIGHTS~stageRights"];
      // const apiData = new FormData();
      // apiData.append("tableName","STAGERIGHTS~stageRights");
      axios
        .post("/generic/get", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.stageRights];
            console.log("STAGERIGHTS respData: ", respData);
            dispatch({ type: "GET_STAGERIGHTS", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_STAGERIGHTS", payload: "" });
    }
  };
};

export const getMasterContractType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      //Master_ContractType~contractTypeMaster
      const apiData = new FormData();
      apiData.append("tableName", "Master_ContractType~contractTypeMaster");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            //console.log(response);
            const respData = [...res.data.data.contractTypeMaster];
            dispatch({ type: "GET_CONTRACTTYPE", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }

        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_CONTRACTTYPE", payload: "" });
    }
  };
};

export const getMasterTaxonomyCode = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {

      const apiData = new FormData();
      apiData.append("tableName", "Master_TaxonomyCode~taxonomyCode");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            //console.log(res);
            const respData = [...res.data.data.taxonomyCode];
            dispatch({ type: "GET_TAXONOMYCODE", payload: respData });
            if (onSuccess) {
              onSuccess(res);
            }
          }

        })
        .catch((error) => {
          console.log(error);
          if (onError) {
            onError(error);
          }
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_TAXONOMYCODE", payload: "" });
    }
  };
};

export const getMasterProviderType = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      // let getApiJson = {};
      // getApiJson["tableNames"] = ["Master_ProviderType~providerType"];
      const apiData = new FormData();
      apiData.append("tableName", "Master_ProviderType~providerType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          //console.log("Get data Response for Master_ProviderType: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.providerType];
            //console.log("Master_ProviderType respData: ", respData);
            dispatch({ type: "GET_PROVIDERTYPE", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_PROVIDERTYPE", payload: "" });
    }
  };
};

export const getCompositionMaster = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      let getApiJson = {};
      getApiJson["tableNames"] = [
        "Master_CompCompensation~compensation",
        "Master_CompSeqApplies~seqApplies",
        "Master_CompCapitationType~capitationType",
        "Master_CritAccHospital~criticalAccessHospital",
        "Master_CompContractType~contractType",
        "Master_CompMedicalLicense~medicalLicense",
        "Master_CompRiskAssignment~riskAssignment",
        "Master_CompSchedule~schedule",
        "Master_CompStates~states",
        "Master_CompFeeSchedule~feeSchedule",
      ];
      axios
        .post("/generic/get", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          //console.log('Get CompositionMaster data Response: ',res)
          if (res.data.Status === 0) {
            const respData = { ...res.data.data };
            // console.log("STAGERIGHTS respData: ", respData);
            dispatch({ type: "GET_COMPOSITIONMASTER", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_COMPOSITIONMASTER", payload: "" });
    }
  };
};

//Added by Nidhi Gupta on 05/30/2023
export const getMasterReference = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      // let getApiJson = {};
      // getApiJson["tableNames"] = ["Master_Reference~reference"];
      const apiData = new FormData();
      apiData.append("tableName", "Master_Reference~reference");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          //console.log("Get data Response for Master_Reference: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.reference];
            //console.log("Master_Reference respData: ", respData);
            dispatch({ type: "GET_REFERENCE", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_REFERENCE", payload: "" });
    }
  };
};

//Till here
//Added by Nidhi Gupta on 05/31/2023
export const getMasterHeaderFooter = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      // let getApiJson = {};
      // getApiJson["tableNames"] = ["Master_HeaderFooter~headerFooter"];
      const apiData = new FormData();
      apiData.append("tableName", "Master_HeaderFooter~headerFooter");

      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response for Master_HeaderFooter: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.headerFooter];
            console.log("Master_HeaderFooter respData: ", respData);
            dispatch({ type: "GET_HEADERFOOTER", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_HEADERFOOTER", payload: "" });
    }
  };
};

export const getProvContLinkData = (
  userName,
  token,
  clearFlag = false,
  onError,
  onSuccess,
  type
) => {
  return (dispatch) => {
    if (!clearFlag) {
      let getApiJson = {};
      getApiJson["option"] = "GETLINKINGDATA";
      getApiJson["Type"] = type;
      getApiJson["UserName"] = userName;
      getApiJson["CName"] = "dummy";
      //getApiJson['whereClause'] = {'PLM_USER_ID':'=~'+userName};
      console.log("getProvContLinkData api input: ", getApiJson);
      axios
        .post("/generic/callProcedure", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response for getProvContLinkData: ", res);
          if (res.data.CallProcedure_Output.Status === 0) {
            let respData = [...res.data.CallProcedure_Output.data];
            //respData = JSON.parse(respData)
            console.log(
              "Get data Response for getProvContLinkData 2: ",
              respData[0]
            );
            dispatch({ type: "GET_PROVCONTLINKDATA", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_PROVCONTLINKDATA", payload: "" });
    }
  };
};

export const getModuleRights = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
  userId
) => {
  return (dispatch) => {
    if (!clearFlag) {
      let getApiJson = {};
      getApiJson["tableNames"] = ["MODULERIGHTS~moduleRights"];
      getApiJson["whereClause"] = { userId: userId };
      console.log("Get data Response modulerights api input: ", getApiJson);
      axios
        .post("/generic/get", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response modulerights: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.moduleRights];
            console.log("moduleRights respData: ", respData);
            dispatch({ type: "GET_MODULERIGHTS", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_MODULERIGHTS", payload: "" });
    }
  };
};

//Till here

// Added by Shivani to integrate CountyName
export const getCounty = (token, clearFlag = false, onError, onSuccess) => {
  return (dispatch) => {
    if (!clearFlag) {
      // let getApiJson = {};
      // getApiJson["tableNames"] = ["Master_County~MasterCounty"];
      const apiData = new FormData();
      apiData.append("tableName", "Master_County~MasterCounty");
      //console.log("Get data Response MasterCounty api input: ", getApiJson);
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response MasterCounty: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.MasterCounty];
            console.log("MasterCounty respData: ", respData);
            dispatch({ type: "GET_MasterCounty", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_MasterCounty", payload: "" });
    }
  };
};

// Added by Shivani to get NPI Id master table data
// MASTER_EXCLUSIONLIST Data
export const getNPI = (token, clearFlag = false, onError, onSuccess) => {
  return (dispatch) => {
    if (!clearFlag) {
      // let getApiJson = {};
      // getApiJson["tableNames"] = ["MASTER_EXCLUSIONLIST~MasterExclusionList"];
      const apiData = new FormData();
      apiData.append("tableName", "MASTER_EXCLUSIONLIST~MasterExclusionList");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response MasterExclusionList: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.MasterExclusionList];
            console.log("MasterExclusionList respData: ", respData);
            dispatch({ type: "GET_MasterExclusionList", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_MasterExclusionList", payload: "" });
    }
  };
};

//Added by Nidhi Gupta on 9/1/2023
export const getDistinctValues = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      let getApiJson = {};
      getApiJson["option"] = "GetDistinctValues";
      getApiJson["Type"] = "HealthPlan";

      console.log("getDistinctValues api input: ", getApiJson);
      axios
        .post("/generic/callProcedure", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response for getDistinctValues: ", res);
          if (res.data.CallProcedure_Output.Status === 0) {
            let respData = [...res.data.CallProcedure_Output.data];
            //respData = JSON.parse(respData)
            console.log(
              "Get data Response for getDistinctValues 2: ",
              respData[0]
            );
            dispatch({ type: "GET_DISTINCTVALUES", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_DISTINCTVALUES", payload: "" });
    }
  };
};

// Added by SHivani for Group Termination dropdown data
export const getTerminationReason = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      // let getApiJson = {};
      // getApiJson["tableNames"] = ["MASTER_Termination~MasterTermination"];
      const apiData = new FormData();
      apiData.append("tableName", "MASTER_Termination~MasterTermination");

      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response MasterTermination: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.MasterTermination];
            console.log("MasterTermination respData: ", respData);
            dispatch({ type: "GET_MasterTermination", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_MasterTermination", payload: "" });
    }
  };
};

//Till Here

export const getMasterCommon = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      //let getApiJson = {};
      //getApiJson["tableNames"] = ["Master_Common~masterCommon"];
      const apiData = new FormData();
      apiData.append("tableName", "Master_Common~masterCommon");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response for Master_Common: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterCommon];
            console.log("Master_Common respData: ", respData);
            dispatch({ type: "GET_MASTERCOMMON", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_MASTERCOMMON", payload: "" });
    }
  };
};

export const getStageName = (token, clearFlag = false, onError, onSuccess) => {
  return (dispatch) => {
    if (!clearFlag) {
      //let getApiJson = {};
      //console.log("inside stage name");
      const apiData = new FormData();
      apiData.append("tableName", "StageTable~stagetable");
      //getApiJson["tableNames"] = ["StageTable~stagetable"];
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Get data Response for stagetable: ", res);
          if (res.data.Status === 0) {
            const respData = [...res.data.data.stagetable];
            console.log("stagetable respData: ", respData);
            dispatch({ type: "GET_stagetable", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_stagetable", payload: "" });
    }
  };
};
export const getViewReportsData = (
  token,
  clearFlag = false,
  onError,
  onSuccess
) => {
  return (dispatch) => {
    if (!clearFlag) {
      let getApiJson = {};
      getApiJson["tableNames"] = ["ViewReports~viewreports"];
      axios
        .post("/generic/get", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.viewreports];
            dispatch({ type: "Get_ViewReports_table", payload: respData });
            if (onSuccess) {
              onSuccess(respData);
            }
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_report", payload: [] });
    }
  };
};
export const getAllUsers = (token, clearFlag = false, onError, onSuccess) => {
  return (dispatch) => {
    if (!clearFlag) {
      axios
        .get(`${baseURL}/allUserManagement`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const mapppedData = res.data.map((user) => {
            const personalNameArr = user.personalName.split(" ");
            const lastName = personalNameArr.pop();
            const firstName = personalNameArr.join(" ");
            delete user.personalName;
            return {
              ...user,
              firstName,
              lastName,
            };
          });
          const respData = [...mapppedData];
          dispatch({ type: "GET_ALL_USERS", payload: respData });
          if (onSuccess) {
            onSuccess(respData);
          }
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else if (clearFlag) {
      dispatch({ type: "CLEAR_ALL_USERS", payload: [] });
    }
  };
};
