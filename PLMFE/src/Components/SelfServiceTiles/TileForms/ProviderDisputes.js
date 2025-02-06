import { React, useEffect, useState } from "react";
import { Formik } from "formik";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";

import CaseHeaderAccordion from "./CaseHeaderAccordion";
import CaseTimelinesAccordion from "./CaseTimelinesAccordion";

import ProviderDisputeClaimInformation from "./ProviderDisputeClaimInformation";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import ProviderDisputeMemberInformationAccordion from "./ProviderDisputeMemberInformationAccordion";
import ProviderDisputeAuthorizationInformationAccordion from "./ProviderDisputeAuthorizationInformationAccordion";
import { useHeader } from "./useHeader";
import DocumentSection from "../DocumentSection";
import MemberAddOfRecordsAccordion from "../TileForms/MemberAddOfRecordsAccordion";
import MemberAltContactInfoAccordion from "../TileForms/MemberAltContactInfoAccordion";
import PdProviderAltContactAccordion from "../TileForms/PdProviderAltContactAccordion";
import PdCaseInformationAccordion from "../TileForms/PdCaseInformationAccordion";
import RepresentativeAddRecordsAccordion from "../TileForms/RepresentativeAddRecordsAccordion";
import PdRepresentativeInformationAccordion from "../TileForms/PdRepresentativeInformationAccordion";
import PdProviderInformationAccordion from "../TileForms/PdProviderInformationAccordion";
import RepresentativeAltContactAccordion from "../TileForms/RepresentativeAltContactAccordion";
import { RenderType } from "./Constants";
import ProviderAddOfRecordsAccordion from "./ProviderAddOfRecordsAccordion";
import ProviderRedirectToAccordion from "./ProviderRedirectToAccordion";
import ProviderNotesAccordion from "../TileForms/PdNotesAccordion";
import ReviewAccordion from "../TileForms/ReviewAccordion";
import CaseResolutionAccordion from "./CaseResolutionAccordion";



const ProviderDisputes = () => {

  ProviderDisputes.displayName = "Provider Disputes";
  const providerDisputeConfigData = JSON.parse(
    process.env.REACT_APP_PROVIDERDISPUTES_DETAILS,
  );

  const {
    caseTimelines,
    pd_MemberAddRecord,
    pd_RepresentativeAddRecord,
    pd_RepresentativeInformation,
    pd_ProviderInformation,
    pd_RepresentativeAltRecord,
    pd_ProviderAddRecord,
    pd_ProviderRedirectTo,
    pd_ProviderAlt,
    pd_MemberAltInfo,
    caseTimelinesValidationSchema,
    memberAltValidationSchema,
    setCaseTimelines,
    setpdMemberAddRecord,
    setpdRepresentativeAddRecord,
    setpdRepresentativeInformation,
    setpdProviderInformation,
    setpdRepresentativeAltRecord,
    setpdProviderAddRecord,
    setpdProviderRedirectTo,
    setpdProviderAlt,
    setpdMemberAltInfo,
    handleCaseHeaderChange,
    caseHeader,
    setCaseHeader,
    ProviderclaimInformation,
    setProviderClaimInformation,
    ProviderclaimInformationValidationSchema,
    ProviderclaimInformationValidationGridSchema,
    ProviderclaimInformationValidationFilingGridSchema,
    ProvidermemberInformation,
    ProvidermemberInformationValidationSchema,
    caseResolutionValidationSchema,
    caseResolutionErrors,
    caseResolution,
    setCaseResolution,
    setProviderMemberInformation,
    providerNotes,
    providerNotesValidationSchema,
    setProviderNotes,
    providerNotesErrors,
    providerReview,
    setProviderReview,
    reviewValidationSchema,
    reviewErrors,
    handleAuthorizationInformationChange,
    authorizationInformation,
    ProviderauthorizationInformationGrid,
    setProviderAuthorizationInformationGrid,
    memberAddErrors,
    representativeAddErrors,
    representativeInformationErrors,
    providerInformationErrors,
    representativeAltErrors,
    providerAddErrors,
    providerRedirectToErrors,
    providerAltErrors,
    memberAltErrors,
    location,
    navigateHome,
    pdsubmitData,
    potentialDupData,
    apiTestState,
    callProcRef,
    documentSectionDataRef,
    disableSaveAndExit,
    decisionTab,
    setDecisionTab,
    caseTimelinesErrors,
    ProviderclaimInformationErrors,
    ProvidermemberInformationErrors,
    shouldShowSubmitError,
    ProviderclaimInformationGridRowValidationSchema,
    setIscheckedBox,
    ProviderauthorizationInformationGridValidationSchema,
    ProviderCaseResolutionGridGridValidationSchema,
    memberAddOfRecordsValidationSchema,
    representativeAddOfRecordsValidationSchema,
    representativeInformationValidationSchema,
    providerInformationValidationSchema,
    representativeAltContactValidationSchema,
    providerAddOfRecordsValidationSchema,
    providerRedirectToValidationSchema,
    providerAltValidationSchema,
    caseTimelinesFields,
    memberAddRecordFields,
    representativeAddRecordFields,
    representativeInformationFields,
    providerInformationFields,
    representativeAltFields,
    providerAddRecordFields,
    providerRedirectToFields,
    providerAltFields,
    memberAltFields,
    setRenderType,
    caseHeaderFields,
    caseInformationFields,
    pd_CaseInformation,
    pdCaseInformationValidationSchema,
    setpdCaseInformation,
    pdCaseInformationErrors,
    pdCaseInformationGrid,
    setPDCaseInformationGrid,
    pdClaimInformationGrid,
    setPDClaimInformationGrid,
    pdClaimInformationFilingGrid,
    setPDClaimInformationFilingGrid,
    pdsaveAndExit,
    scrollToTop

  } = useHeader();
  const providerDisputesConfigData = JSON.parse(
    process.env.REACT_APP_PROVIDERDISPUTES_DETAILS || "{}",

  );
  console.log("PD_location", location)
 
  useEffect(() => {
    setRenderType(RenderType.PROVIDER_DISPUTE);
  }, []);

  const stage = location.state.stageName;
  const stageName = providerDisputesConfigData["StageName"];
  const FormComponent = () => (
    <div
      className="accordion AddProviderLabel"
      id="accordionPanelsStayOpenExample"
    >
      <Formik initialValues={{}} onSubmit={() => { }}>
        <div className="container">
          <div className="row">
            <div className="col-xs-6" style={{ textAlign: "center" }}>
              <br />
              {stageName !== "Start" || (stage === "Intake" || stage ==="Acknowledge"|| stage === "Research" ||stage === "Effectuate"
                 || stage === "Bulk Effectuate" || stage === "Resolve" || stage ==="Case Completed"|| stage === "Reopen" || stage === "Documents Needed" 
               || stage === "CaseArchived" || stage === "Resolution Letter Pending" || stage === "State Fair Hearing" 
              ) &&(
              <CaseHeaderAccordion
                handleOnChange={handleCaseHeaderChange}
                handleData={caseHeader}
                setCaseHeader={setCaseHeader}
                caseHeaderFields={caseHeaderFields}
                renderType={RenderType.PROVIDER_DISPUTE}
                pd_ProviderInformation={pd_ProviderInformation}
                ProvidermemberInformation={ProvidermemberInformation}
                pd_RepresentativeInformation={pd_RepresentativeInformation}
              />
              )}
              <CaseTimelinesAccordion
                caseTimelinesData={caseTimelines}
                setCaseTimelinesData={setCaseTimelines}
                caseTimelinesValidationSchema={caseTimelinesValidationSchema}
                caseTimelinesErrors={caseTimelinesErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
                caseTimelinesFields={caseTimelinesFields}
                ProviderclaimInformationGridData={pdClaimInformationGrid}
              />
              <PdCaseInformationAccordion
                caseInformationData={pd_CaseInformation}
                setcaseInformationData={setpdCaseInformation}
                pdCaseInformationValidationSchema={pdCaseInformationValidationSchema}
                pdCaseInformationErrors={pdCaseInformationErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                caseInformationFields={caseInformationFields}
                handlecaseInformationGridData={pdCaseInformationGrid}
                updatecaseInformationGridData={setPDCaseInformationGrid}
                renderType={RenderType.PROVIDER_DISPUTE}
                authorizationInformationGridValidationSchema={
                  ProviderauthorizationInformationGridValidationSchema
                }
              />

              <ProviderDisputeClaimInformation
                ProviderclaimInformation={ProviderclaimInformation}
                setProviderClaimInformationData={setProviderClaimInformation}
                ProviderclaimInformationValidationSchema={ProviderclaimInformationValidationSchema}
                ProviderclaimInformationGridRowValidationSchema={ProviderclaimInformationGridRowValidationSchema}
                handleProviderClaimInformationGridData={pdClaimInformationGrid}
                handleProviderClaimInformationFilingGridData={pdClaimInformationFilingGrid}
                ProviderclaimInformationErrors={ProviderclaimInformationErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                updateProviderClaimInformationGridData={setPDClaimInformationGrid}
                updateProviderClaimInformationFilingGridData={setPDClaimInformationFilingGrid}
                setIscheckedBox = {setIscheckedBox}
                authorizationInformationGridValidationSchema={ProviderclaimInformationValidationGridSchema}
                authorizationInformationFilingGridValidationSchema={ProviderclaimInformationValidationFilingGridSchema}

              />

              <PdProviderInformationAccordion
                providerInformationData={pd_ProviderInformation}
                setProviderInformationData={setpdProviderInformation}
                providerInformationValidationSchema={providerInformationValidationSchema}
                providerInformationFields={providerInformationFields}
                providerInformationErrors={providerInformationErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                setIscheckedBox={setIscheckedBox}
                renderType={RenderType.PROVIDER_DISPUTE}

              />
              <ProviderAddOfRecordsAccordion
                providerAddData={pd_ProviderAddRecord}
                setProviderAddData={setpdProviderAddRecord}
                providerAddOfRecordsValidationSchema={providerAddOfRecordsValidationSchema}
                providerAddRecordFields={providerAddRecordFields}
                providerAddErrors={providerAddErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
              />
              <PdProviderAltContactAccordion
                providerAltData={pd_ProviderAlt}
                setProviderAltData={setpdProviderAlt}
                providerAltValidationSchema={providerAltValidationSchema}
                providerAltFields={providerAltFields}
                providerAltErrors={providerAltErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
              />

              <ProviderDisputeMemberInformationAccordion
                ProvidermemberInformationData={ProvidermemberInformation}
                setProviderMemberInformationData={setProviderMemberInformation}
                ProvidermemberInformationValidationSchema={
                  ProvidermemberInformationValidationSchema
                }
                ProvidermemberInformationErrors={ProvidermemberInformationErrors}
                shouldShowSubmitError={shouldShowSubmitError}
              />
              <MemberAddOfRecordsAccordion
                memberAddData={pd_MemberAddRecord}
                setMemberAddData={setpdMemberAddRecord}
                memberAddOfRecordsValidationSchema={memberAddOfRecordsValidationSchema}
                memberAddRecordFields={memberAddRecordFields}
                memberAddErrors={memberAddErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
              />
              <MemberAltContactInfoAccordion
                memberAltData={pd_MemberAltInfo}
                setMemberAltData={setpdMemberAltInfo}
                memberAltValidationSchema={memberAltValidationSchema}
                memberAltFields={memberAltFields}
                memberAltErrors={memberAltErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
              />

              <PdRepresentativeInformationAccordion
                representativeInformationData={pd_RepresentativeInformation}
                setRepresentativeInformationData={setpdRepresentativeInformation}
                representativeInformationValidationSchema={representativeInformationValidationSchema}
                representativeInformationFields={representativeInformationFields}
                representativeInformationErrors={representativeInformationErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
              />
              <RepresentativeAddRecordsAccordion
                representativeAddData={pd_RepresentativeAddRecord}
                setRepresentativeAddData={setpdRepresentativeAddRecord}
                representativeAddOfRecordsValidationSchema={representativeAddOfRecordsValidationSchema}
                representativeAddRecordFields={representativeAddRecordFields}
                representativeAddErrors={representativeAddErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
              />
              <RepresentativeAltContactAccordion
                representativeAltData={pd_RepresentativeAltRecord}
                setRepresentativeAltData={setpdRepresentativeAltRecord}
                representativeAltContactValidationSchema={representativeAltContactValidationSchema}
                representativeAltFields={representativeAltFields}
                representativeAltErrors={representativeAltErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
              />

              <ProviderDisputeAuthorizationInformationAccordion
                handleOnChange={handleAuthorizationInformationChange}
                handleData={authorizationInformation}

                handleAuthorizationInformationGridData={
                  ProviderauthorizationInformationGrid
                }
                updateAuthorizationInformationGridData={
                  setProviderAuthorizationInformationGrid
                }
                authorizationInformationGridValidationSchema={
                  ProviderauthorizationInformationGridValidationSchema
                }
                renderType={RenderType.PROVIDER_DISPUTE}

              />
              {/* <ProviderDecisionRecordsAccordion
                  decisionAddData={pd_DecisionAddRecord}
                  setDecisionAddData={setpdDecisionAddRecord}
                  decisionAddOfRecordsValidationSchema={decisionAddOfRecordsValidationSchema}
                  decisionAddRecordFields={decisionAddRecordFields}
                  decisionAddErrors={decisionAddErrors}
                  shouldShowSubmitError={shouldShowSubmitError}
                  renderType={RenderType.PROVIDER_DISPUTE}
              /> */}
              <ProviderNotesAccordion
                providerNotesData={providerNotes}
                setProviderNotesData={setProviderNotes}
                providerNotesErrors={providerNotesErrors}
                providerNotesValidationSchema={providerNotesValidationSchema}
                shouldShowSubmitError={shouldShowSubmitError}
              />
              <ReviewAccordion
                reviewData={providerReview}
                setReviewData={setProviderReview}
                reviewErrors={reviewErrors}
                reviewValidationSchema={reviewValidationSchema}
                shouldShowSubmitError={shouldShowSubmitError}
              />
              <ProviderRedirectToAccordion
                providerRedirectToData={pd_ProviderRedirectTo}
                setProviderRedirectToData={setpdProviderRedirectTo}
                providerRedirectToValidationSchema={providerRedirectToValidationSchema}
                providerRedirectToFields={providerRedirectToFields}
                providerRedirectToErrors={providerRedirectToErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
              />
              <CaseResolutionAccordion
                  caseResolutionData={caseResolution}
                  setCaseResolutionData={setCaseResolution}
                  caseResolutionErrors={caseResolutionErrors}
                  caseResolutionValidationSchema={caseResolutionValidationSchema}
                  shouldShowSubmitError={shouldShowSubmitError}
              />
               {/* <CaseResolutionAccordion
              handleCaseResolutionGridData={{} }
              updateCaseResolutionnGridData={() =>{} }
              caseResolutionGridValidationSchema={
                ProviderCaseResolutionGridGridValidationSchema
              }
                providerCaseResolutionData={pd_ProviderRedirectTo}
                setProviderCaseResolutionData={setpdProviderRedirectTo}
                providerCaseResolutionValidationSchema={providerRedirectToValidationSchema}
                providerCaseResolutionFields={providerRedirectToFields}
                providerCaseResolutionErrors={providerRedirectToErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
              />  */}
              {location.state.formView === "DashboardHomeView" && (
                <DocumentSection
                  fileDataRef={documentSectionDataRef.current}
                  displayName={ProviderDisputes.displayName}
                  stageName={providerDisputeConfigData["StageName"]}
                />
              )}

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
              Provider Disputes
            </label>

            {location.state.formView === "DashboardView" ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-primary btnStyle"
                  name="saveAndSubmit"
                  onClick={pdsaveAndExit}
                  style={{ float: "right", marginRight: "10px" }}
                  disabled={disableSaveAndExit}
                >
                  Save & Submit
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btnStyle"
                  name="saveAndExit"
                  onClick={pdsaveAndExit}
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
                  onClick={pdsubmitData}
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
                defaultActiveKey="Provider Disputes"
                id="justify-tab-example"
                className="mb-3"
                justify
              >
                <Tab eventKey={"Provider Disputes"} title=" Case Details">
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

export default ProviderDisputes;
