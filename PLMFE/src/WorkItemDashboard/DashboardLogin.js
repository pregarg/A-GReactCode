import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn } from "../actions";
import dashboardLoginPageLogo from "../Images/DashboardLoginBackground.png";

import "./DashboardLogin.css";

import { useDispatch } from "react-redux";
import FooterComponent from "../../src/Components/FooterComponent";
import {
  getMasterAgesSeen,
  getMasterAngCaseFilingMethod,
  getMasterAngLOBMapping,
  getMasterAngAppellantDesc,
  getMasterAngProductType,
  getMasterAngDenialType,
  getMasterAngAppellantType,
  getMasterAngAppealType,
  getMasterAngCaseLevelPriority,
  getMasterAngIssueLevel,
  getMasterAngReviewType,
  getMasterAngClaimType,
  getMasterAngLineNumber,
  getMasterAngDecision,
  getMasterAngAuthServiceType,
  getMasterAngProcessingStatus,
  getMasterAngFiledTimely,
  getMasterAngGrantGoodCause,
  getMasterAngProviderRole,
  getMasterAngProviderType,
  getMasterAngParProvider,
  getMasterAngPortalEnrolled,
  getMasterAngDeceased,
  getMasterAngGender,
  getMasterAngDualPlan,
  getMasterAngMailToAddress,
  getMasterAngPreferredLanguage,
  getMasterAngCommPref,
  getMasterAngExpeditedRequested,
  getMasterAngExpeditedDenied,
  getMasterAngStUpExpedited,
  getMasterAngDocNeeded,
  getMasterAngRequestedFrom,
  getMasterAngNeededBy,
  getMasterAngAuthDecision,
  getMasterAngDocument,
  getMasterAngRelationship,
  getMasterAngAORType,
  getMasterPDCaseInCompliance,
  getMasterPDTimeFrameExtended,
  getMasterPDDepartment,
  getMasterPDNoOfClaims,
  getMasterPDMailToAddress,
  getMasterPDIntakeDecision,
  getMasterPDIntakeDecisionReason,
  getMasterPDClaimType,
  getMasterPDFilledTimely,
  getMasterPDGrantGoodCause,
  getMasterPDPortalEnrolled,
  getMasterPDDenialCodeAndReason,
  getMasterPDComplainantType,
  getMasterPDSubIssueLevel,
  getMasterPDIssueType,
  getMasterPDProduct,
  getMasterPDCaseFillingMethod,
  getMasterPDIssueLevelPriority,
  getMasterPDIssueLevelNumber,
  getMasterPDComplaintType,
  getMasterPDLOBMapping,
  getMasterPDCommPref,
  getMasterPDLIS,
  getMasterPDDualPlan,
  getMasterPDRelationship,
  getMasterPDAuthType,
  getMasterPDDecision,
  getMasterPDDocuments,
  getMasterPDGoodCauseReason,
  getMasterLanguages,
  getMasterLicenseType,
  getMasterStateSymbol,
  getMasterAddressType,
  getMasterGridLicenseType,
  getMasterSpeciality,
  getMasterGraduateType,
  //getMasterDecision,
  //getMasterDecisionReason,
  getMasterDocumentName,
  getMasterDocumentList,
  getMasterAdditionalQues,
  getStageRights,
  getMasterContractType,
  getMasterTaxonomyCode,
  getMasterProviderType,
  getCompositionMaster,
  getMasterReference,
  getMasterHeaderFooter,
  getProvContLinkData,
  getModuleRights,
  getCounty,
  getNPI,
  getDistinctValues,
  getTerminationReason,
  getMasterCommon,
  getStageName,
  getViewReportsData,
  getAllUsers,
} from "../actions/index";
import useUpdateDecision from "../Components/CustomHooks/useUpdateDecision";
import svgImage from "../Components/wave.svg";

import { Card, CardContent, CardMedia, Grid, TextField } from "@mui/material";
import { IconButton, InputAdornment } from "@mui/material";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import useSwalWrapper from "../Components/SweetAlearts/hooks";

const initialState = {
  userName: {
    value: "",
    required: true,
    isInvalid: false,
  },
  password: {
    value: "",
    required: true,
    isInvalid: false,
  },
};

export default function DashboardLogin() {
  const [loginState, setLoginState] = useState(initialState);
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();
  const { updateLockStatus } = useUpdateDecision();
  const Swal = useSwalWrapper();

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  //From here
  const onMasterLoadFail = (response, typeOfRequest) => {
    //Write code to handle master load errors
  };

  const onMasterLoadSuccess = (response, typeOfRequest) => {
    //Write code to execute after master load success
  };

  const onLoginFail = (response) => {
    Swal.fire({
      icon: "error",
      title: "Username or Password do not match",
    });
    /*Need to comment below code when the login issue is resolved on selfservice portal */
  };

  const onLoginSuccess = (resp) => {
    const loginToken = resp.data.loginOutput.participant.token;
    const tokenUserName = resp.data.loginOutput.participant.userName;
    const userId = resp.data.loginOutput.participant.userId;
    const updateWhereValue = { LockedBy: userId };
    updateLockStatus("N", "", 0, updateWhereValue, loginToken);
    dispatch(
      getStageRights(loginToken, false, onMasterLoadFail, onMasterLoadSuccess),
    );
    dispatch(
      getStageName(loginToken, false, onMasterLoadFail, onMasterLoadSuccess),
    );
    dispatch(
      getMasterAgesSeen(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterLanguages(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterCommon(loginToken, false, onMasterLoadFail, onMasterLoadSuccess),
    );
    dispatch(
      getMasterGridLicenseType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterStateSymbol(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAddressType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterContractType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterLicenseType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterSpeciality(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterGraduateType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterDocumentList(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAdditionalQues(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    // dispatch(
    //   getMasterDecision(
    //     loginToken,
    //     false,
    //     onMasterLoadFail,
    //     onMasterLoadSuccess
    //   )
    // );
    // dispatch(
    //   getMasterDecisionReason(
    //     loginToken,
    //     false,
    //     onMasterLoadFail,
    //     onMasterLoadSuccess
    //   )
    // );
    dispatch(
      getMasterDocumentName(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterTaxonomyCode(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterProviderType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getCompositionMaster(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterReference(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterHeaderFooter(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );

    dispatch(
      getCounty(loginToken, false, onMasterLoadFail, onMasterLoadSuccess),
    );
    dispatch(getNPI(loginToken, false, onMasterLoadFail, onMasterLoadSuccess));
    dispatch(
      getDistinctValues(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getTerminationReason(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getViewReportsData(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngCaseFilingMethod(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngLOBMapping(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngProductType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngDenialType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    
    dispatch(
      getMasterAngAppellantDesc(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngAppellantType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngAppealType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngCaseLevelPriority(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngIssueLevel(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngReviewType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngClaimType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngLineNumber(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngDecision(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngAuthServiceType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngProcessingStatus(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngFiledTimely(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngGrantGoodCause(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngProviderRole(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngProviderType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngParProvider(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngPortalEnrolled(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngGender(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngDeceased(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngDualPlan(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngMailToAddress(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngPreferredLanguage(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngCommPref(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngExpeditedRequested(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngExpeditedDenied(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngStUpExpedited(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngDocNeeded(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngRequestedFrom(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngNeededBy(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngAuthDecision(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngDocument(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngRelationship(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterAngAORType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDTimeFrameExtended(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDCaseInCompliance(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDDepartment(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDNoOfClaims(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDMailToAddress(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDIntakeDecision(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDIntakeDecisionReason(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDClaimType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDFilledTimely(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDGrantGoodCause(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDPortalEnrolled(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDDenialCodeAndReason(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDComplainantType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDSubIssueLevel(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDIssueType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDProduct(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDCaseFillingMethod(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDIssueLevelPriority(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDIssueLevelNumber(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDComplaintType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDLOBMapping(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDDualPlan(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDLIS(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDCommPref(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDRelationship(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDAuthType(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDGoodCauseReason(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDDecision(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getMasterPDDocuments(
        loginToken,
        false,
        onMasterLoadFail,
        onMasterLoadSuccess,
      ),
    );
    dispatch(
      getAllUsers(loginToken, false, onMasterLoadFail, onMasterLoadSuccess),
    );
    navigate("/DashboardLogin/Home", { replace: true });
  };
  // till here
  const navigateHome = () => {
    //if(isFormValid){
    dispatch(
      signIn(
        loginState.userName.value,
        loginState.password.value,
        false,
        onLoginFail,
        onLoginSuccess,
        "DashboardLogin",
      ),
    );
    //}
  };

  const dispatch = useDispatch();

  const updateFormHandler = (value, field) => {
    setLoginState((prevState) => {
      return {
        ...prevState,
        [field]: {
          ...prevState[field],
          value: value,
          isInvalid: false,
        },
      };
    });
  };

  const loginHandler = (e) => {
    e.preventDefault();
    let formValidState = true;
    const keys = Object.keys(loginState);
    for (let i = 0; i < keys.length; i++) {
      if (loginState[keys[i]].required) {
        if (
          !loginState[keys[i]].value ||
          loginState[keys[i]].value.trim().length == 0
        ) {
          formValidState = false;
          setLoginState((prevState) => {
            return {
              ...prevState,
              [keys[i]]: {
                ...prevState[keys[i]],
                isInvalid: true,
              },
            };
          });
        }
      }
    }
    if (formValidState) {
      navigateHome();
    }
  };

  const handleKeypress = (e) => {
    if (e.charCode === 13) {
      loginHandler(e);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <Grid
      container
      sx={{
        backgroundImage: `url(${svgImage})`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "bottom",
        backgroundSize: "contain",
        height: "100vh",
        overflow: "scroll",
      }}
    >
      <Grid
        sx={{
          display: "flex",
          justifyContent: "space-around",
          justifyItems: "center",
        }}
      >
        <Grid xs={6} md={6} sm={6}>
          <img
            id="dashboardLoginPageImage"
            src={dashboardLoginPageLogo}
            className="img-fluid"
            alt="..."
            style={{ marginTop: "5rem" }}
          />
        </Grid>

        <Grid xs={4} md={3.5} sm={4}>
          <Card sx={{ p: 3, mt: 3 }} variant="outlined">
            <CardMedia
              component="img"
              height="220"
              image={require("../Images/ibpsLogo.png")}
              sx={{
                padding: "1em 1em 0 1em",
                objectFit: "contain",
              }}
            />

            <CardContent>
              <div className="card-title" style={{ textAlign: "center" }}>
                <span className="LoginHeading">Login</span>
              </div>
              <div className="card-text">
                <form>
                  <TextField
                    fullWidth
                    size="small"
                    variant="outlined"
                    error={loginState.userName.isInvalid}
                    label={"Username"}
                    type="text"
                    id="loginText"
                    name="loginId"
                    placeholder="username"
                    onChange={(e) => {
                      updateFormHandler(e.target.value, "userName");
                    }}
                    helperText={
                      loginState.userName.isInvalid === true &&
                      "Username is required"
                    }
                  />
                  <TextField
                    variant="outlined"
                    error={loginState.password.isInvalid === true}
                    fullWidth
                    size="small"
                    margin="normal"
                    label="Password"
                    type={showPassword ? "text" : "password"}
                    name="passwordId"
                    onChange={(e) => {
                      updateFormHandler(e.target.value, "password");
                    }}
                    onKeyPress={(e) => handleKeypress(e)}
                    helperText={
                      loginState.password.isInvalid === true &&
                      "Password is required"
                    }
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={handleClickShowPassword}
                            onMouseDown={handleMouseDownPassword}
                            edge="end"
                          >
                            {showPassword ? (
                              <MdOutlineVisibilityOff />
                            ) : (
                              <MdVisibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />

                  <div className="d-flex" style={{ minHeight: "2rem" }}></div>
                  <button
                    id="dashboarLoginButton"
                    className="btn btn-primary"
                    type="button"
                    onClick={loginHandler}
                  >
                    Login
                  </button>
                </form>
              </div>
            </CardContent>
          </Card>
        </Grid>
        <FooterComponent />
      </Grid>
    </Grid>
  );
}
