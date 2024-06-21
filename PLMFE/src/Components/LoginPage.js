import React, { useState, useEffect } from "react";
import {
  getMasterAgesSeen,
  getMasterLanguages,
  getMasterLicenseType,
  signIn,
  getMasterStateSymbol,
  getMasterAddressType,
  getMasterGridLicenseType,
  getMasterSpeciality,
  getMasterGraduateType,
  getMasterDocumentList,
  getMasterAdditionalQues,
  getMasterContractType,
  getMasterDecision,
  getMasterDecisionReason,
  getMasterTaxonomyCode,
  getMasterProviderType,
  getMasterDocumentName,
  getMasterHeaderFooter,
  getProvContLinkData,
  getCounty,
  getNPI,
  getTerminationReason,
  getMasterAngCaseFilingMethod,
  getMasterAngLOBMapping,
  getMasterAngAppellantDesc,
  getMasterAngAppealType,
  getMasterAngCaseLevelPriority,
  getMasterAngReviewType,
  getMasterAngClaimType,
  getMasterAngDecision,
  getMasterAngProcessingStatus,
  getMasterAngIssueLevel
} from "../actions";
import headerLogo from "../Images/LoginPageLogo.png";
import loginPageLogo from "../Images/LoginPageFormImage.png";
import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { PASSWORD, USER } from "../config/config";
import FooterComponent from "./FooterComponent";
import svgImage from "../Components/wave.svg";
import { IconButton, InputAdornment, TextField } from "@mui/material";
import { MdOutlineVisibilityOff } from "react-icons/md";
import { MdVisibility } from "react-icons/md";
import useSwalWrapper from "./SweetAlearts/hooks";

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

export default function LoginPage() {
  const dispatch = useDispatch();

  const [changeState, setChangeState] = useState({
    loginField: "",
    passwordField: "",
  });
  const [loginState, setLoginState] = useState(initialState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasInvalidCredentials, setHasInvalidCredentials] = useState(false);
  const [showPassword, setShowPassword] = React.useState(false);

  const Swal = useSwalWrapper();

  // const dispatch = useDispatch()
  const authData = useSelector((state) => state.auth);
  // Example call signIn(email, password, clearFlag = false, onLoginFail, navigateHome);

  const navigate = useNavigate();

  useEffect(() => {
    if (!!authData.isSignedIn) {
      navigate("/Home", { replace: true });
    }

    //clear auth state
    dispatch(signIn("", "", true, null, null, null));
  }, []);
  const token = useSelector((state) => state.auth.token);
  const onLoginFail = (response) => {
    Swal.fire({
      icon: "error",
      title: "Username or Password do not match",
    });
    /*Need to comment below code when the login issue is resolved on selfservice portal */
  };

  const onMasterLoadFail = (response, typeOfRequest) => {
    //Write code to handle master load errors
  };

  const onMasterLoadSuccess = (response, typeOfRequest) => {
    //Write code to execute after master load success
  };
  ////Commenting this useEffect as all the master data load has been moved to onLoginSucces Function --Nidhi Gupta
  /*useEffect(()=>{
        if(!!token){
            dispatch(getMasterAgesSeen(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterLanguages(token, false, onMasterLoadFail, onMasterLoadSuccess));
            //dispatch(getMasterSalutation(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterGridLicenseType(token, false, onMasterLoadFail, onMasterLoadSuccess));
            //dispatch(getMasterEthnicity(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterStateSymbol(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterAddressType(token, false, onMasterLoadFail, onMasterLoadSuccess));
            //dispatch(getMasterContractType(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterLicenseType(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterSpeciality(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterGraduateType(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterDocumentList(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterAdditionalQues(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterDecision(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterTaxonomyCode(token, false, onMasterLoadFail, onMasterLoadSuccess));
            dispatch(getMasterProviderType(token, false, onMasterLoadFail, onMasterLoadSuccess));
        }
    }, [token])*/

  const onLoginSuccess = (response) => {
    console.log("onLoginSuccess response: ", response);
    const loginToken = response.data.loginOutput.participant.token;
    console.log("Inside onLoginSuccess token: ", loginToken);
    const tokenUserName = response.data.loginOutput.participant.userName;
    console.log("tokenUserName: ", tokenUserName);
    setHasInvalidCredentials(false);
    if (tokenUserName == loginState.userName.value) {
      dispatch(
        getMasterAgesSeen(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterLanguages(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      //dispatch(getMasterSalutation(loginToken, false, onMasterLoadFail, onMasterLoadSuccess));
      dispatch(
        getMasterGridLicenseType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      //dispatch(getMasterEthnicity(loginToken, false, onMasterLoadFail, onMasterLoadSuccess));
      dispatch(
        getMasterStateSymbol(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAddressType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      //dispatch(getMasterContractType(loginToken, false, onMasterLoadFail, onMasterLoadSuccess));
      dispatch(
        getMasterLicenseType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterSpeciality(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterGraduateType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterDocumentList(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAdditionalQues(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterDecision(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterDecisionReason(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterTaxonomyCode(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      //Added Newly by Nidhi Gupta on 05/19/2023
      dispatch(
        getMasterDocumentName(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      //Added Newly by Nidhi Gupta on 05/31/2023
      dispatch(
        getMasterHeaderFooter(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getProvContLinkData(
          tokenUserName,
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess,
          "Portal"
        )
      );
      dispatch(
        getCounty(loginToken, false, onMasterLoadFail, onMasterLoadSuccess)
      );
      dispatch(
        getNPI(loginToken, false, onMasterLoadFail, onMasterLoadSuccess)
      );
      dispatch(
        getTerminationReason(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngCaseFilingMethod(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngLOBMapping(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngAppellantDesc(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngAppealType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngCaseLevelPriority(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngIssueLevel(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngReviewType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngClaimType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngDecision(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngProcessingStatus(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      navigate("/Home", { replace: true });
    } else if (tokenUserName == USER) {
      dispatch(
        getCounty(loginToken, false, onMasterLoadFail, onMasterLoadSuccess)
      );
      dispatch(
        getMasterContractType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterSpeciality(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterStateSymbol(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterProviderType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAddressType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterLanguages(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterHeaderFooter(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterDocumentName(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngCaseFilingMethod(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngLOBMapping(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngAppellantDesc(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngAppealType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngCaseLevelPriority(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngIssueLevel(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngReviewType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngClaimType(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngDecision(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getMasterAngProcessingStatus(
          loginToken,
          false,
          onMasterLoadFail,
          onMasterLoadSuccess
        )
      );
      dispatch(
        getNPI(loginToken, false, onMasterLoadFail, onMasterLoadSuccess)
      );
      navigate("/ContractingHome", { replace: true });
    }
  };

  const navigateHome = () => {
    console.log("loginState.userName.value: ", loginState.userName.value);
    dispatch(
      signIn(
        loginState.userName.value,
        loginState.password.value,
        false,
        onLoginFail,
        onLoginSuccess,
        "PortalLogin"
      )
    );
  };

  const navigateContractingHome = () => {
    console.log("Inside navigateContractingHome");
    //dispatch(signIn(USER,PASSWORD, false, onLoginFail, ()=>{} ));
    //Commented above by Nidhi Gupta
    console.log("USER: ", USER);
    dispatch(
      signIn(USER, PASSWORD, false, onLoginFail, onLoginSuccess, "PortalLogin")
    );

    // navigate('/ContractingHome', { replace: true });
    // console.log("Inside ContractingHome");
  };

  const handleChange = (evt) => {
    const value = evt.target.value;
    console.log("Inside handleChange ", evt);
    setChangeState({
      ...changeState,
      [evt.target.name]: value,
    });
  };

  const updateFormHandler = (value, field) => {
    setHasInvalidCredentials(false);
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
      //setIsFormValid(true);
      navigateHome();
    }
  };

  const handleKeypress = (e) => {
    //console.log("Inside handleKeyPress ",e);
    //it triggers by pressing the enter key
    if (e.charCode === 13) {
      loginHandler(e);
    }
  };

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  return (
    <>
      <div
        style={{
          backgroundImage: `url(${svgImage})`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "bottom",
          backgroundSize: "contain",
          height: "100vh",
          overflowY: "scroll",
        }}
      >
        <div
          className="container"
          style={{
            width: "100%",
            display: "flex",
            marginTop: 10,
            justifyContent: "space-between",
          }}
        >
          <div style={{ width: "40%", display: "flex", alignItems: "center" }}>
            <div
              style={{
                display: "flex",
                maxWidth: "400px",
                flexDirection: "column",
                gap: "10px",
                padding: "10px",
                boxShadow: "rgb(0 0 0 / 8%) 0px 1px 3px 3px",
                borderRadius: "6px",
                background: "var(--white-shade)",
              }}
            >
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  id="headerImage"
                  src={headerLogo}
                  className="img-fluid"
                  alt="..."
                  style={{
                    width: "75%",
                  }}
                ></img>
                {/* <p className='homeTaglineText' style={{marginBottom: 0}}>Healthcare</p> */}
              </div>
              <label className="homeDescriptionText">
                <p
                  style={{
                    width: "100%",
                    fontWeight: 600,
                    fontSize: "var(--font-size-medium)",
                    color: "var(--text)",
                    lineHeight: 1.6,
                  }}
                >
                  Welcome to Provider Online Portal, a new way to serve
                  Providers. In this portal you can view current statuses,
                  submit new requests, view and download documents and maintain
                  existing data related to the Providers. All Provider change
                  can be done on the Self Service Page. If your organization
                  wants to network with us and has not done so already, please
                  click on “Register” button to fill a Network Request Form with
                  us. If you are currently in network with us, please login.
                </p>
              </label>
            </div>
          </div>
          <div style={{ display: "flex", width: "40%" }}>
            <div
              style={{
                backgroundColor: "var(--white-shade)",
                borderRadius: "6px",
                maxWidth: "400px",

                minHeight: "fit-content",
                boxShadow: "rgb(0 0 0 / 15%) 0px 1px 3px 3px",
                width: "100%",
                padding: "40px 40px",
                display: "flex",
                flexDirection: "column",
                alignSelf: "center",
              }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "400px",
                }}
              >
                <h2>Portal Login</h2>
                <p style={{ fontSize: "var(--font-size-medium)" }}>
                  New user? <a href="#"> Register </a>
                </p>
              </div>
              <div>
                <div style={{ marginBottom: 10 }}>
                  <TextField
                    fullWidth
                    variant="outlined"
                    error={loginState.userName.isInvalid}
                    label={"Username"}
                    name="loginId"
                    placeholder="username"
                    type="text"
                    onChange={(e) => {
                      updateFormHandler(e.target.value, "userName");
                    }}
                    helperText={
                      loginState.userName.isInvalid === true &&
                      "Username is required"
                    }
                  />
                </div>

                <div>
                  <TextField
                    variant="outlined"
                    error={loginState.password.isInvalid === true}
                    fullWidth
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
                </div>

                <div
                  style={{ display: "flex", justifyContent: "right", gap: 10 }}
                >
                  <button
                    className="newButton"
                    id="loginButton"
                    onClick={loginHandler}
                  >
                    Login
                  </button>
                  <button
                    className="newButton"
                    id="contractingButton"
                    onClick={navigateContractingHome}
                  >
                    Contracting
                  </button>
                </div>
              </div>
              <img
                src={loginPageLogo}
                className="img-fluid"
                alt="..."
                style={{
                  width: "80%",
                  alignSelf: "center",
                  marginTop: 20,
                  borderRadius: 5,
                }}
              ></img>
            </div>
          </div>
        </div>
      </div>
      <FooterComponent />
    </>
  );
}
