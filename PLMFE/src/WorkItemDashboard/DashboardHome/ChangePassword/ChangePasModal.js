import { Modal, Button } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import "./ChangePassModal.css";
import passwordLogo from "../../../Images/dashboardPasswordLogo.png";
import loginIdUserLogo from "../../../Images/dashboardLoginUserLogo.png";
import React, { useEffect, useState } from "react";
import { useAxios } from "../../../api/axios.hook";
import { baseURL } from "../../../api/baseURL";
import { useNavigate } from "react-router-dom";

const initialState = {
  userName: {
    value: "",
    required: false,
    isInvalid: false,
  },
  oldpassword: {
    value: "",
    required: true,
    isInvalid: false,
  },
  newpassword: {
    value: "",
    required: true,
    isInvalid: false,
  },
  confirmPassword: {
    value: "",
    required: true,
    isInvalid: false,
  },
};

export default function ChangePasModal(show) {
  const [loginState, setLoginState] = useState(initialState);
  const [isFormValid, setIsFormValid] = useState(false);
  const [hasInvalidCredentials, setHasInvalidCredentials] = useState(false);
  const [hasInvalidOldPassCredentials, setHasInvalidOldPassCredentials] =
    useState(false);
  const token = useSelector((state) => state.auth.token);
  const userName = useSelector((store) => store.auth.userName);
  const [alertState, setAlertState] = useState("");
  const { customAxios: axios } = useAxios();

  const cancelHandler = () => {
    show.onCancel();
    setLoginState(initialState);
    setHasInvalidCredentials(false);
    setHasInvalidOldPassCredentials(false);
  };

  useEffect(() => {
    setLoginState((prevState) => {
      return {
        ...prevState,
        userName: {
          ...prevState.userName,
          value: userName,
        },
      };
    });
  }, []);

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
      setIsFormValid(true);
    }
  };

  useEffect(() => {
    if (isFormValid) {
      const loginData = {
        login: loginState.userName.value,
        oldPassword: loginState.oldpassword.value,
        newPassword: loginState.newpassword.value,
        confirmPassword: loginState.confirmPassword.value,
      };
      axios
        .post(baseURL + "/auth/change-password", loginData, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setAlertState("success");
          setTimeout(() => {
            setAlertState("");
          }, 2500);
          if (res.data == "Old password does not match") {
            setHasInvalidOldPassCredentials(true);
            setIsFormValid(false);
          }

          if (res.data == "userNameNotFound" || res.data == "passwordInvalid") {
            setHasInvalidCredentials(true);
            setIsFormValid(false);
          }

          setIsFormValid(false);
          setLoginState((prevState) => {
            return {
              userName: {
                value: loginState.userName.value,
                required: false,
                isInvalid: false,
              },
              oldpassword: {
                value: "",
                required: true,
                isInvalid: false,
              },
              newpassword: {
                value: "",
                required: true,
                isInvalid: false,
              },
              confirmPassword: {
                value: "",
                required: true,
                isInvalid: false,
              },
            };
          });
        })
        .catch((err) => {
          console.log(err);
          setHasInvalidCredentials(true);
          setIsFormValid(false);
        });
    }
  }, [isFormValid]);
  return (
    <Modal
      show={show.deleteModal.show}
      onHide={cancelHandler}
      backdrop="static"
      keyboard={false}
      dialogClassName="delete-modal-dialog"
      size="sm"
      aria-labelledby="example-custom-modal-styling-title"
      centered
    >
      <Modal.Header>
        <Modal.Title>
          <p>Change Password</p>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <form>
          <div className="input-group input-group-sm mb-3 justify-content-center">
            <div className="col-12 d-flex justify-content-center">
              {alertState == "failed" && (
                <div className="alert alert-danger">
                  Password changed unsuccessful
                </div>
              )}
              {alertState == "success" && (
                <div className="alert alert-success">
                  Password changed successfully
                </div>
              )}
            </div>

            <img
              id="loginIdUserLogoImage"
              src={loginIdUserLogo}
              className="img-fluid"
              alt="..."
            />
            <input
              className={
                loginState.userName.isInvalid
                  ? "is-invalid form-control"
                  : "form-control"
              }
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              type="text"
              id="loginText"
              name="loginId"
              value={userName}
              disabled="true"
              onChange={(e) => {
                updateFormHandler(e.target.value, "userName");
              }}
            />
          </div>

          <div className="input-group input-group-sm mb-3 justify-content-center">
            <div className="input-group-prepend">
              <img
                id="passwordLogoImage"
                src={passwordLogo}
                className="img-fluid"
                alt="..."
              />
            </div>
            <input
              className={
                loginState.oldpassword.isInvalid
                  ? "is-invalid form-control"
                  : "form-control"
              }
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              type="password"
              id="oldpasswordText"
              name="oldpasswordId"
              placeholder="Old Password"
              value={loginState.oldpassword.value}
              onChange={(e) => {
                updateFormHandler(e.target.value, "oldpassword");
              }}
            />
          </div>
          {loginState.oldpassword.isInvalid && (
            <div className="text-danger small" style={{ marginLeft: "2rem" }}>
              Old password is required
            </div>
          )}

          <div className="input-group input-group-sm mb-3 justify-content-center">
            <div className="input-group-prepend">
              <img
                id="passwordLogoImage"
                src={passwordLogo}
                className="img-fluid"
                alt="..."
              />
            </div>
            <input
              className={
                loginState.newpassword.isInvalid
                  ? "is-invalid form-control"
                  : "form-control"
              }
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              type="password"
              id="newpasswordText"
              name="newpasswordId"
              placeholder="New Password"
              value={loginState.newpassword.value}
              onChange={(e) => {
                updateFormHandler(e.target.value, "newpassword");
              }}
            />
          </div>
          {loginState.newpassword.isInvalid && (
            <div className="text-danger small" style={{ marginLeft: "2rem" }}>
              New password is required
            </div>
          )}
          <div className="input-group input-group-sm mb-3 justify-content-center">
            <div className="input-group-prepend">
              <img
                id="passwordLogoImage"
                src={passwordLogo}
                className="img-fluid"
                alt="..."
              />
            </div>
            <input
              className={
                loginState.confirmPassword.isInvalid
                  ? "is-invalid form-control"
                  : "form-control"
              }
              aria-label="Small"
              aria-describedby="inputGroup-sizing-sm"
              type="Password"
              id="confirmPasswordText"
              name="confirmPasswordId"
              placeholder="Confirm Password"
              value={loginState.confirmPassword.value}
              onChange={(e) => {
                updateFormHandler(e.target.value, "confirmPassword");
              }}
            />
          </div>
          {loginState.confirmPassword.isInvalid && (
            <div className="text-danger small" style={{ marginLeft: "2rem" }}>
              ConfirmPassword password is required
            </div>
          )}
          {hasInvalidCredentials && (
            <div className="d-flex" style={{ minHeight: "4.5rem" }}>
              <div className="mx-auto alert alert-danger small">
                Username or Password do not match
              </div>
            </div>
          )}
          {hasInvalidOldPassCredentials && (
            <div className="d-flex" style={{ minHeight: "4.5rem" }}>
              <div className="mx-auto alert alert-danger small">
                Incorrect old password
              </div>
            </div>
          )}
        </form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          className="btn btn-outline-danger btnStyle"
          onClick={loginHandler}
        >
          Change Password
        </Button>

        <Button
          className="btn btn-outline-primary btnStyle"
          onClick={cancelHandler}
        >
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
