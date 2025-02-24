
import { React, useEffect, useState } from "react";
import { Formik } from "formik";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import CaseHeaderAccordion from "./CaseHeaderAccordion";
import CaseTimelinesAccordion from "./CaseTimelinesAccordion";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import { RenderType } from "./Constants";
import CtmSummaryAccordion from "../TileForms/CtmSummaryAccordion";
import CtmCaseCategorizationAccordion from "../TileForms/CtmCaseCategorizationAccordion";
import CtmPreCloseQAAccordion from "../TileForms/CtmPreCloseQAAccordion";
import CtmPostCloseQCAccordion from "../TileForms/CtmPostCloseQCAccordion";
import CtmMemberInformationAccordion from "../TileForms/CtmMemberInformationAccordion";
import CtmCaseResolutionAccordion from "../TileForms/CtmCaseResolutionAccordion";
import CtmAcknowledgementAccordion from "../TileForms/CtmAcknowledgementAccordion";
import CtmAuthorizationInformationAccordion from "../TileForms/CtmAuthorizationInformationAccordion";
import CtmClaimInformationAccordion from "../TileForms/CtmClaimInformationAccordion";
import CtmRepresentativeInformationAccordion from "../TileForms/CtmRepresentativeInformationAccordion";
import CtmProviderInformationAccordion from "../TileForms/CtmProviderInformationAccordion";
import CtmMultipleIssueManagementAccordion from "../TileForms/CtmMultipleIssueManagementAccordion";

import './CTM.css'
import useHeader from "./useHeader";

const CtmHeader = () => {
  CtmHeader.displayName = "Ctm";
  const ctmConfigData = JSON.parse(process.env.REACT_APP_CTMHEADER_DETAILS);

  const {
    caseTimelines,
    ctmSummaryErrors,
    ctmSummaryData,
    setCtmSummaryData,
    caseTimelinesValidationSchema,
    setCaseTimelines,
    handleCaseHeaderChange,
    caseHeader,
    setCaseHeader,
    location,
    navigateHome,
    ctmSubmitData,
    potentialDupData,
    apiTestState,
    callProcRef,
    documentSectionDataRef,
    disableSaveAndExit,
    decisionTab,
    setDecisionTab,
    caseTimelinesErrors,
    shouldShowSubmitError,
    setIscheckedBox,
    caseTimelinesFields,
    setRenderType,
    caseHeaderFields,
    pdClaimInformationGrid,
    ctmSaveAndExit,
    scrollToTop,
    ctmSummaryFields,
    ctm_CaseCategorization,
    ctm_CtmSummary,
    ctmSummaryValidationSchema,
    setctmCtmSummary,
    setCtmRepGridData,
    setCtmMultiGridData,
    caseCategorizationFields,
    caseCategorizationData,
     setCtmCaseCategorization,
     setCaseCategorizationData,
    caseCategorizationValidationSchema,
    preCloseQAData,
    setPreCloseQAData,
    preCloseQAValidationSchema,
    preCloseQAErrors,
    postCloseQCData,
    setPostCloseQCData,
    postCloseQCValidationSchema,
    postCloseQCErrors,
    ctmMemberData,
    setCtmMemberData,
    ctmMemberValidationSchema,
    ctmMemberErrors,
//    caseResolutionCtm,
//    setCaseResolutionCtm,
//    caseResolutionValidationSchema,
//    caseResolutionErrors,
    acknowledgementData,
    setAcknowledgementData,
    acknowledgementValidationSchema,
    acknowledgementErrors,
    ctmAuthorizationGrid,
    setCtmAuthGridData,
    ctmAuthGridValidationSchema,
    ctmClaimInformationGridRowValidationSchema,
    ctmClaimInformationGrid,
    setCtmClaimInformationGrid,
    ctmRepresentativeGrid,
    setCtmRepresentativeGrid,
    ctmMultipleIssueGrid,
    setCtmMultipleIssueGrid,
    ctmRepresentativeGridValidationSchema,
    ctmMultiGridValidationSchema,
    ctm,
    ctmCaseResolution,
     setCtmCaseResolution,
     ctmCaseResolutionValidationSchema,
     ctmCaseResolutionErrors,
    ctmProviderInformationGrid,
    setCtmProviderInformationGrid,
    ctmProviderInformationGridValidationSchema,
    ctmRepGridData,
    ctmMultiGridData,
    auditLogs
  } = useHeader();

  useEffect(() => {
    setRenderType(RenderType.CTM);
  }, []);

  const stage = location.state.stageName;
  const stageName = ctmConfigData["StageName"];

  const FormComponent = () => (
    <div className="accordion AddProviderLabel" id="accordionPanelsStayOpenExample">
      <Formik initialValues={{}} onSubmit={() => {}}>
        <div className="container">
          <div className="row">
            <div className="col-xs-6" style={{ textAlign: "center" }}>
              <br />

              <CtmPreCloseQAAccordion
                preCloseQAData={preCloseQAData}
                setPreCloseQAData={setPreCloseQAData}
                preCloseQAValidationSchema={preCloseQAValidationSchema}
                shouldShowSubmitError={shouldShowSubmitError}
                preCloseQAErrors={{}}
              />
               <CtmPostCloseQCAccordion
               postCloseQCData={postCloseQCData}
               setPostCloseQCData={setPostCloseQCData}
               postCloseQCValidationSchema={postCloseQCValidationSchema}
               shouldShowSubmitError={shouldShowSubmitError}
               postCloseQCErrors={postCloseQCErrors}
               />
               <CtmMemberInformationAccordion
                 ctmMemberData={ctmMemberData}
                 setCtmMemberData={setCtmMemberData}
                 shouldShowSubmitError={shouldShowSubmitError}
                 ctmMemberValidationSchema={ctmMemberValidationSchema}
                 ctmMemberErrors={{}}
               />

              <CtmAcknowledgementAccordion
                acknowledgementData={acknowledgementData}
                setAcknowledgementData={setAcknowledgementData}
                acknowledgementValidationSchema={acknowledgementValidationSchema}
                shouldShowSubmitError={shouldShowSubmitError}
                acknowledgementErrors={acknowledgementErrors}
              />

              <CtmCaseResolutionAccordion
                ctmCaseResolutionData={ctmCaseResolution}
                setCtmCaseResolutionData={setCtmCaseResolution}
                ctmCaseResolutionValidationSchema={ctmCaseResolutionValidationSchema}
                shouldShowSubmitError={shouldShowSubmitError}
                ctmCaseResolutionErrors={ctmCaseResolutionErrors}
              />

            </div>
          </div>
        </div>
      </Formik>
    </div>
  );

   return (
      <div className="AddProvider backgroundColor" style={{ minHeight: "100vh" }}>
        {location.state.formView === "DashboardView" && <CaseInformation />}

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
                        onClick={scrollToTop}
                        className="btn btn-outline-primary btnStyle"
                        style={{
                          position: 'fixed',
                          bottom: '20px',
                          right: '20px',
                         // padding: '10px 20px',
                          cursor: 'pointer',
                        }}
                      >
                        ↑
              </button>
              <label id="tileFormLabel" className="HeadingStyle">
                CTM
              </label>

              {location.state.formView === "DashboardView" ? (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-primary btnStyle"
                    name="saveAndSubmit"
                    onClick={ctmSaveAndExit }
                    style={{ float: "right", marginRight: "10px" }}
                    disabled={disableSaveAndExit}
                  >
                    Save & Submit
                  </button>
                  <button
                    type="button"
                    className="btn btn-outline-primary btnStyle"
                    name="saveAndExit"
                    onClick={ctmSaveAndExit }
                    style={{ float: "right", marginRight: "10px" }}
                    disabled={disableSaveAndExit}
                  >
                    Save & Exit
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    className="btn btn-outline-primary btnStyle"
                    name="submit"
                    onClick={ctmSubmitData}
                    style={{ float: "right", marginRight: "10px" }}
                  >
                    Submit
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="col-xs-12">
          <div className="container">
            <div className="row">
              {location.state.formView === "DashboardView" ? (
                <Tabs
                  defaultActiveKey="Ctm"
                  id="justify-tab-example"
                  className="mb-3"
                  justify
                >
                  <Tab eventKey={"Ctm"} title=" Case Details">
                    <FormComponent />
                  </Tab>

                  <Tab eventKey={"Decision"} title="Decision">
                    <DecisionTab
                      lockStatus={
                        location.state.lockStatus === undefined ||
                          location.state.lockStatus === ""
                          ? "N"
                          : location.state.lockStatus
                      }
                      potentialDupData={potentialDupData}
                      decisionTabData={decisionTab}
                      updateDecisionTabData={setDecisionTab}
                      delegatedVal={apiTestState?.delegated}
                      buttonClicked={callProcRef.current}
                      auditLogs={auditLogs}
                    ></DecisionTab>
                  </Tab>
                </Tabs>
              ) : (
                <FormComponent />
              )}
            </div>
          </div>
        </div>
      </div>
    );
};

export default CtmHeader;
