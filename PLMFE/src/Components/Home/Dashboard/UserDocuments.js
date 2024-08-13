import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import SessionTimeoutModal from "../../Navbar/SessionTimeoutModal";

export default function UserDocuments() {
  const navigate = useNavigate();
  let prop = useLocation();
  console.log("Inside User Documents prop: ", prop);

  const { submitCase } = useUpdateDecision();

  const navigateHome = () => {
    navigate("/Home", { replace: true });
  };

  const saveFormData = () => {
    console.log("Inside User Documents save Form Data: ", prop);
    submitCase(prop, navigateHome);
  };

  return (
    <>
      <div className="UserDocuments">
        <div className="container">
          <div className="row">
            <div className="col-xs-6" style={{ textAlign: "center" }}>
              <br />
              <button
                type="button"
                className="btn btn-outline-primary btnStyle"
                onClick={(event) => navigateHome(event)}
                style={{ float: "left", marginLeft: "10px" }}
              >
                Go To Home
              </button>
              <button
                type="button"
                className="btn btn-outline-primary btnStyle"
                name="saveSubmit"
                onClick={(event) => {
                  saveFormData();
                }}
                style={{ float: "right", marginRight: "10px" }}
              >
                Submit
              </button>
            </div>
          </div>
        </div>

        <div className="container">
          <div className="row">
            <div className="col-xs-6">
              <br />
              <DecisionTab />
            </div>
          </div>
        </div>
      </div>
      <SessionTimeoutModal navTo={"/"}></SessionTimeoutModal>
    </>
  );
}
