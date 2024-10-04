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
        { headers: { Authorization: `Bearer ${token}` } },
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
  Page,
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
  onSuccess,
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
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_CASE_FILING_METHOD~masterAngCaseFilingMethod",
      );
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
  onSuccess,
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
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_APPELLANT_DESC~masterAngAppellantDesc",
      );
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

export const getMasterAngProductType = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_PRODUCT_TYPE~masterAngProductType",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngProductType];
            //console.log(response);
            dispatch({ type: "GET_PRODUCT_TYPE", payload: respData });
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
      dispatch({ type: "CLEAR_PRODUCT_TYPE", payload: "" });
    }
  };
};

export const getMasterAngDenialType = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_DENIAL_TYPE~masterAngDenialType",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngDenialType];
            //console.log(response);
            dispatch({ type: "GET_DENIAL_TYPE", payload: respData });
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
      dispatch({ type: "CLEAR_DENIAL_TYPE", payload: "" });
    }
  };
};

export const getMasterAngAppellantType = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_APPELLANT_TYPE~masterAngAppellantType",
      );
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
  onSuccess,
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
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_CASE_LEVEL_PRIORITY~masterAngCaseLevelPriority",
      );
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
export const getMasterAngLineNumber = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_LINE_NUMBER~masterAngLineNumber");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngLineNumber];
            //console.log(response);
            dispatch({ type: "GET_LINE_NUMBER", payload: respData });
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
      dispatch({ type: "CLEAR_LINE_NUMBER", payload: "" });
    }
  };
};
export const getMasterAngDecision = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
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
export const getMasterAngAuthDecision = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_AUTH_DECISION~masterAngAuthDecision");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngAuthDecision];
            //console.log(response);
            dispatch({ type: "GET_AUTH_DECISION", payload: respData });
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
      dispatch({ type: "CLEAR_AUTH_DECISION", payload: "" });
    }
  };
};

export const getMasterAngAuthServiceType = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_AUTH_SERVICE_TYPE~masterAngAuthServiceType",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngAuthServiceType];
            //console.log(response);
            dispatch({ type: "GET_AUTH_SERVICE_TYPE", payload: respData });
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
      dispatch({ type: "CLEAR_AUTH_SERVICE_TYPE", payload: "" });
    }
  };
};

export const getMasterAngProcessingStatus = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_PROCESSING_STATUS~masterAngProcessingStatus",
      );
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

export const getMasterAngFiledTimely = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_FILED_TIMELY~masterAngFiledTimely",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngFiledTimely];
            //console.log(response);
            dispatch({ type: "GET_FILED_TIMELY", payload: respData });
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
      dispatch({ type: "CLEAR_FILED_TIMELY", payload: "" });
    }
  };
};

export const getMasterAngGrantGoodCause = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_GRANT_GOOD_CAUSE~masterAngGrantGoodCause",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngGrantGoodCause];
            //console.log(response);
            dispatch({ type: "GET_GRANT_GOOD_CAUSE", payload: respData });
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
      dispatch({ type: "CLEAR_GRANT_GOOD_CAUSE", payload: "" });
    }
  };
};

export const getMasterAngProviderRole = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_PROVIDER_ROLE~masterAngProviderRole",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngProviderRole];
            //console.log(response);
            dispatch({ type: "GET_PROVIDER_ROLE", payload: respData });
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
      dispatch({ type: "CLEAR_PROVIDER_ROLE", payload: "" });
    }
  };
};

export const getMasterAngProviderType = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_PROVIDER_TYPE~masterAngProviderType",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngProviderType];
            //console.log(response);
            dispatch({ type: "GET_PROVIDER_TYPE", payload: respData });
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
      dispatch({ type: "CLEAR_PROVIDER_TYPE", payload: "" });
    }
  };
};

export const getMasterAngParProvider = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_PAR_PROVIDER~masterAngParProvider",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngParProvider];
            //console.log(response);
            dispatch({ type: "GET_PAR_PROVIDER", payload: respData });
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
      dispatch({ type: "CLEAR_PAR_PROVIDER", payload: "" });
    }
  };
};

export const getMasterAngPortalEnrolled = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_PORTAL_ENROLLED~masterAngPortalEnrolled",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngPortalEnrolled];
            //console.log(response);
            dispatch({ type: "GET_PORTAL_ENROLLED", payload: respData });
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
      dispatch({ type: "CLEAR_PORTAL_ENROLLED", payload: "" });
    }
  };
};

export const getMasterAngDeceased = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_DECEASED~masterAngDeceased");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngDeceased];
            //console.log(response);
            dispatch({ type: "GET_DECEASED", payload: respData });
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
      dispatch({ type: "CLEAR_GET_DECEASED", payload: "" });
    }
  };
};

export const getMasterAngGender = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_GENDER~masterAngGender");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngGender];
            //console.log(response);
            dispatch({ type: "GET_GENDER", payload: respData });
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
      dispatch({ type: "CLEAR_GENDER", payload: "" });
    }
  };
};

export const getMasterAngDualPlan = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_DUAL_PLAN~masterAngDualPlan");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngDualPlan];
            //console.log(response);
            dispatch({ type: "GET_DUAL_PLAN", payload: respData });
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
      dispatch({ type: "CLEAR_DUAL_PLAN", payload: "" });
    }
  };
};

export const getMasterAngPreferredLanguage = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_PREFERRED_LANGUAGE~masterAngPreferredLanguage",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngPreferredLanguage];
            //console.log(response);
            dispatch({ type: "GET_PREFERRED_LANGUAGE", payload: respData });
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
      dispatch({ type: "CLEAR_PREFERRED_LANGUAGE", payload: "" });
    }
  };
};

export const getMasterAngMailToAddress = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_MAIL_TO_ADDRESS~masterAngMailToAdress",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngMailToAdress];
            //console.log(response);
            dispatch({ type: "GET_MAIL_TO_ADDRESS", payload: respData });
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
      dispatch({ type: "CLEAR_MAIL_TO_ADDRESS", payload: "" });
    }
  };
};

export const getMasterAngCommPref = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_COMM_PREF~masterAngCommPref");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngCommPref];
            //console.log(response);
            dispatch({ type: "GET_COMM_PREF", payload: respData });
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
      dispatch({ type: "CLEAR_COMM_PREF", payload: "" });
    }
  };
};

export const getMasterAngExpeditedRequested = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_EXPEDITED_REQUESTED~masterAngExpeditedRequested",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngExpeditedRequested];
            //console.log(response);
            dispatch({ type: "GET_EXPEDITED_REQUESTED", payload: respData });
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
      dispatch({ type: "CLEAR_EXPEDITED_REQUESTED", payload: "" });
    }
  };
};

export const getMasterAngExpeditedDenied = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_EXPEDITED_DENIED~masterAngExpeditedDenied",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngExpeditedDenied];
            //console.log(response);
            dispatch({ type: "GET_EXPEDITED_DENIED", payload: respData });
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
      dispatch({ type: "CLEAR_EXPEDITED_DENIED", payload: "" });
    }
  };
};
export const getMasterAngDocNeeded = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_DOC_NEEDED~masterAngDocNeeded",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngDocNeeded];
            //console.log(response);
            dispatch({ type: "GET_DOC_NEEDED", payload: respData });
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
      dispatch({ type: "CLEAR_DOC_NEEDED", payload: "" });
    }
  };
};
export const getMasterAngRequestedFrom = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_REQUESTED_FROM~masterAngRequestedFrom",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngRequestedFrom];
            //console.log(response);
            dispatch({ type: "GET_REQUESTED_FROM", payload: respData });
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
      dispatch({ type: "CLEAR_REQUESTED_FROM", payload: "" });
    }
  };
};
export const getMasterAngNeededBy= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_NEEDED_BY~masterAngNeededBy",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngNeededBy];
            //console.log(response);
            dispatch({ type: "GET_NEEDED_BY", payload: respData });
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
      dispatch({ type: "CLEAR_NEEDED_BY", payload: "" });
    }
  };
};

export const getMasterAngStUpExpedited = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_ST_UP_EXPEDITED~masterAngStUpExpedited",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngStUpExpedited];
            //console.log(response);
            dispatch({ type: "GET_ST_UP_EXPEDITED", payload: respData });
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
      dispatch({ type: "CLEAR_ST_UP_EXPEDITED", payload: "" });
    }
  };
};

export const getMasterAngDocument = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_DOCUMENT~masterAngDocument");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngDocument];
            //console.log(response);
            dispatch({ type: "GET_DOCUMENT", payload: respData });
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
      dispatch({ type: "CLEAR_DOCUMENT", payload: "" });
    }
  };
};

export const getMasterAngRelationship = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append(
        "tableName",
        "ANG_MASTER_RELATIONSHIP~masterAngRelationship",
      );
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngRelationship];
            //console.log(response);
            dispatch({ type: "GET_RELATIONSHIP", payload: respData });
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
      dispatch({ type: "CLEAR_RELATIONSHIP", payload: "" });
    }
  };
};

export const getMasterAngAORType = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "ANG_MASTER_AOR_TYPE~masterAngAORType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterAngAORType];
            //console.log(response);
            dispatch({ type: "GET_AOR_TYPE", payload: respData });
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
      dispatch({ type: "CLEAR_AOR_TYPE", payload: "" });
    }
  };
};

export const getMasterPDTimeFrameExtended = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_TIMEFRAME_EXTENDED~masterPDTimeFrameExtended");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDTimeFrameExtended];
            //console.log(response);
            dispatch({ type: "GET_TIMEFRAME_EXTENDED", payload: respData });
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
      dispatch({ type: "CLEAR_TIMEFRAME_EXTENDED", payload: "" });
    }
  };
};
export const getMasterPDCaseInCompliance = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_CASE_IN_COMPLIANCE~masterPDCaseInCompliance");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDCaseInCompliance];
            //console.log(response);
            dispatch({ type: "GET_CASE_IN_COMPLIANCE", payload: respData });
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
      dispatch({ type: "CLEAR_CASE_IN_COMPLIANCE", payload: "" });
    }
  };
};
export const getMasterPDDepartment = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_DEPARTMENT~masterPDDepartment");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDDepartment];
            //console.log(response);
            dispatch({ type: "GET_DEPARTMENT", payload: respData });
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
      dispatch({ type: "CLEAR_DEPARTMENT", payload: "" });
    }
  };
};
export const getMasterPDNoOfClaims = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_NUM_OF_CLAIMS~masterPDNoOfClaims");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDNoOfClaims];
            //console.log(response);
            dispatch({ type: "GET_NUM_OF_CLAIMS", payload: respData });
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
      dispatch({ type: "CLEAR_NUM_OF_CLAIMS", payload: "" });
    }
  };
};
export const getMasterPDMailToAddress = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_MAIL_TO_ADDRESS~masterPDMailToAddress");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDMailToAddress];
            //console.log(response);
            dispatch({ type: "GET_MAIL_TO_ADDRESS", payload: respData });
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
      dispatch({ type: "CLEAR_MAIL_TO_ADDRESS", payload: "" });
    }
  };
};
export const getMasterPDIntakeDecision= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_INTAKE_DECISION~masterPDIntakeDecision");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDIntakeDecision];
            //console.log(response);
            dispatch({ type: "GET_INTAKE_DECISION", payload: respData });
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
      dispatch({ type: "CLEAR_INTAKE_DECISION", payload: "" });
    }
  };
};
export const getMasterPDIntakeDecisionReason= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_INTAKE_DECISION_REASON~masterPDIntakeDecisionReason");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDIntakeDecisionReason];
            //console.log(response);
            dispatch({ type: "GET_INTAKE_DECISION_REASON", payload: respData });
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
      dispatch({ type: "CLEAR_INTAKE_DECISION_REASON", payload: "" });
    }
  };
};
export const getMasterPDClaimType= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_CLAIM_TYPE~masterPDClaimType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDClaimType];
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
export const getMasterPDFilledTimely= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_FILED_TIMELY~masterPDFilledTimely");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDFilledTimely];
            //console.log(response);
            dispatch({ type: "GET_FILED_TIMELY", payload: respData });
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
      dispatch({ type: "CLEAR_FILED_TIMELY", payload: "" });
    }
  };
};
export const getMasterPDGrantGoodCause= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_GRANT_GOOD_CAUSE~masterPDGrantGoodCause");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDGrantGoodCause];
            //console.log(response);
            dispatch({ type: "GET_GRANT_GOOD_CAUSE", payload: respData });
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
      dispatch({ type: "CLEAR_GRANT_GOOD_CAUSE", payload: "" });
    }
  };
};

export const getMasterPDGoodCauseReason= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_GOOD_CAUSE_REASON~masterPDGoodCauseReason");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDGoodCauseReason];
            //console.log(response);
            dispatch({ type: "GET_GOOD_CAUSE_REASON", payload: respData });
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
      dispatch({ type: "CLEAR_GOOD_CAUSE_REASON", payload: "" });
    }
  };
};


export const getMasterPDPortalEnrolled= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_PORTAL_ENROLLED~masterPDPortalEnrolled");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDPortalEnrolled];
            //console.log(response);
            dispatch({ type: "GET_PORTAL_ENROLLED", payload: respData });
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
      dispatch({ type: "CLEAR_PORTAL_ENROLLED", payload: "" });
    }
  };
};
export const getMasterPDDenialCodeAndReason= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_DENIAL_CODE_AND_REASON~masterPDDenialCodeAndReason");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDDenialCodeAndReason];
            //console.log(response);
            dispatch({ type: "GET_DENIAL_CODE_AND_REASON", payload: respData });
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
      dispatch({ type: "CLEAR_DENIAL_CODE_AND_REASON", payload: "" });
    }
  };
};
export const getMasterPDComplainantType= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_COMPLAINANT_TYPE~masterPDComplainantType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDComplainantType];
            //console.log(response);
            dispatch({ type: "GET_COMPLAINANT_TYPE", payload: respData });
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
      dispatch({ type: "CLEAR_COMPLAINANT_TYPE", payload: "" });
    }
  };
};
export const getMasterPDSubIssueLevel= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_SUB_ISSUE_LEVEL~masterPDSubIssueLevel");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDSubIssueLevel];
            //console.log(response);
            dispatch({ type: "GET_SUB_ISSUE_LEVEL", payload: respData });
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
      dispatch({ type: "CLEAR_SUB_ISSUE_LEVEL", payload: "" });
    }
  };
};
export const getMasterPDIssueType= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_ISSUE_TYPE~masterPDIssueType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDIssueType];
            //console.log(response);
            dispatch({ type: "GET_ISSUE_TYPE", payload: respData });
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
      dispatch({ type: "CLEAR_ISSUE_TYPE", payload: "" });
    }
  };
};
export const getMasterPDProduct= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_PRODUCT~masterPDProduct");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDProduct];
            //console.log(response);
            dispatch({ type: "GET_PRODUCT", payload: respData });
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
      dispatch({ type: "CLEAR_PRODUCT", payload: "" });
    }
  };
};
export const getMasterPDCaseFillingMethod= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_CASE_FILING_METHOD~masterPDCaseFillingMethod");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDCaseFillingMethod];
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

export const getMasterPDIssueLevelPriority= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_ISSUE_LEVEL~masterPDIssueLevelPriority");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDIssueLevelPriority];
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
export const getMasterPDIssueLevelNumber= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_LEVEL_NUMBER~masterPDIssueLevelNum");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDIssueLevelNum];
            //console.log(response);
            dispatch({ type: "GET_CASE_LEVEL_NUMBER", payload: respData });
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
      dispatch({ type: "CLEAR_CASE_LEVEL_NUMBER", payload: "" });
    }
  };
};
export const getMasterPDComplaintType= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_COMPLAINT_TYPE~masterPDComplaintType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDComplaintType];
            //console.log(response);
            dispatch({ type: "GET_COMPLAINT_TYPE", payload: respData });
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
      dispatch({ type: "CLEAR_COMPLAINT_TYPE", payload: "" });
    }
  };
};
export const getMasterPDLOBMapping= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_LOBMAPPING~masterPDLineOfBusiness");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDLineOfBusiness];
            //console.log(response);
            dispatch({ type: "GET_LOBMAPPING", payload: respData });
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
      dispatch({ type: "CLEAR_LOBMAPPING", payload: "" });
    }
  };
};

export const getMasterPDDualPlan= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_DUAL_PLAN~masterPDDualPlan");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDDualPlan];
            //console.log(response);
            dispatch({ type: "GET_DUAL_PLAN", payload: respData });
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
      dispatch({ type: "CLEAR_DUAL_PLAN", payload: "" });
    }
  };
};
export const getMasterPDLIS= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_LIS~masterPDLis");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDLis];
            //console.log(response);
            dispatch({ type: "GET_LIS", payload: respData });
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
      dispatch({ type: "CLEAR_LIS", payload: "" });
    }
  };
};

export const getMasterPDCommPref= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_COMM_PREF~masterPDCommPref");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDCommPref];
            //console.log(response);
            dispatch({ type: "GET_COMM_PREF", payload: respData });
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
      dispatch({ type: "CLEAR_COMM_PREF", payload: "" });
    }
  };
};

export const getMasterPDRelationship= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_RELATIONSHIP~masterPDRelationship");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDRelationship];
            //console.log(response);
            dispatch({ type: "GET_RELATIONSHIP", payload: respData });
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
      dispatch({ type: "CLEAR_RELATIONSHIP", payload: "" });
    }
  };
};

export const getMasterPDAuthType= (
  token,
  clearFlag = false,
  onError,
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "PD_MASTER_AUTH_TYPE~masterPDAuthType");
      axios
        .post("/generic/get/masterTableData", apiData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          if (res.data.Status === 0) {
            const respData = [...res.data.data.masterPDAuthType];
            //console.log(response);
            dispatch({ type: "GET_AUTH_TYPE", payload: respData });
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
      dispatch({ type: "CLEAR_AUTH_TYPE", payload: "" });
    }
  };
};
  

export const getMasterAddressType = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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

// export const getMasterDecision = (
//   token,
//   clearFlag = false,
//   onError,
//   onSuccess
// ) => {
//   return (dispatch) => {
//     if (!clearFlag) {
//       // axios.get("/master/decision?flowId="+flowId+"&stageName="+stageName, {
//       axios
//         .get("/master/decision", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           console.log(response);
//           dispatch({ type: "GET_DECISION", payload: response });
//           if (onSuccess) {
//             onSuccess(response);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           if (onError) {
//             onError(error);
//           }
//         });
//     } else if (clearFlag) {
//       dispatch({ type: "CLEAR_DECISION", payload: "" });
//     }
//   };
// };

// export const getMasterDecisionReason = (
//   token,
//   clearFlag = false,
//   onError,
//   onSuccess
// ) => {
//   return (dispatch) => {

//     if (!clearFlag) {
//       axios
//         .get("/master/decision/reason", {
//           headers: { Authorization: `Bearer ${token}` },
//         })
//         .then((response) => {
//           console.log(response);
//           dispatch({ type: "GET_DECISION_REASON", payload: response.data });
//           if (onSuccess) {
//             onSuccess(response);
//           }
//         })
//         .catch((error) => {
//           console.log(error);
//           if (onError) {
//             onError(error);
//           }
//         });
//     } else if (clearFlag) {
//       dispatch({ type: "CLEAR_DECISION_REASON", payload: "" });
//     }
//   };
// };

export const getMasterDocumentName = (
  token,
  clearFlag = false,
  onError,
  onSuccess,
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
  onSuccess,
) => {
  return (dispatch) => {
    if (!clearFlag) {
      const apiData = new FormData();
      apiData.append("tableName", "AdditionalQuesTable~addQuesTable");
      console.log("");
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
  type,
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
              respData[0],
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
  userId,
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
  onSuccess,
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
              respData[0],
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
  onSuccess,
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
  onSuccess,
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
  onSuccess,
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
