import { React, useEffect, useState } from "react";
import { Formik } from "formik";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import CaseHeaderAccordion from "./CaseHeaderAccordion";
import CaseTimelinesAccordion from "./CaseTimelinesAccordion";

import ProviderCaseClaimInformation from "./ProviderDisputeClaimInformation";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import ProviderMemberInformationAccordion from "./ProviderDisputeMemberInformationAccordion";
import ExpeditedRequestAccordion from "./ExpeditedRequestAccordion";
import NotesAccordion from "./ProviderDisputeNotesAccordion";
import { FaBars } from "react-icons/fa";
import AuthorizationInformationAccordion from "./ProviderDisputeAuthorizationInformationAccordion";
import RepresentativeInformationAccordion from "./ProviderDisputeRepresentativeInformationAccordion";
import { useHeader } from "./useHeader";
import DocumentSection from "../DocumentSection";
import { useLocation } from "react-router-dom";
import Member360 from "../TileForms/Member360";
import Provider360 from "../TileForms/Provider360";
import NotesHistory from "../TileForms/NotesHistory";
import MemberAddOfRecordsAccordion from "../TileForms/MemberAddOfRecordsAccordion";
import ProviderDecisionRecordsAccordion from "../TileForms/ProviderDecisionRecordsAccordion";
import MemberAltContactInfoAccordion from "../TileForms/MemberAltContactInfoAccordion";
import PdProviderAltContactAccordion from "../TileForms/PdProviderAltContactAccordion";
import PdCaseInformationAccordion from "../TileForms/PdCaseInformationAccordion";
import RepresentativeAddRecordsAccordion from "../TileForms/RepresentativeAddRecordsAccordion";
import PdRepresentativeInformationAccordion from "../TileForms/PdRepresentativeInformationAccordion";
import PdProviderInformationAccordion from "../TileForms/PdProviderInformationAccordion";
import RepresentativeAltContactAccordion from "../TileForms/RepresentativeAltContactAccordion";
import { RenderType } from "./Constants";
import ProviderAddOfRecordsAccordion from "./ProviderAddOfRecordsAccordion";



const ProviderDisputes = () => {
  // CaseHeader.displayName = "Appeals";
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS,
  );

  const handleExpeditedPriorityChange = (date) => {
    setExpeditedRequest((prevState) => ({
      ...prevState,
      Expedited_Upgrade_Date_Time: date,
    }));
  };
  const {
    caseTimelines,
    pd_MemberAddRecord,
    pd_DecisionAddRecord,
    pd_RepresentativeAddRecord,
    pd_RepresentativeInformation,
    pd_ProviderInformation,
    pd_RepresentativeAltRecord,
    pd_ProviderAddRecord,
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
    setpdDecisionAddRecord,
    setpdProviderAddRecord,
    setpdProviderAlt,
    setpdMemberAltInfo,
    handleCaseHeaderChange,
    caseHeader,
    setCaseHeader,
    caseInformation,
    setCaseInformation,
    caseInformationValidationSchema,
    ProviderclaimInformation,
    setProviderClaimInformation,
    ProviderclaimInformationValidationSchema,
    ProviderclaimInformationGrid,
    setProviderClaimInformationGrid,
    providerInformationGrid,
    setProviderInformationGrid,
    ProvidermemberInformation,
    ProvidermemberInformationValidationSchema,
    setProviderMemberInformation,
    representativeInformationGrid,
    setRepresentativeInformationGrid,
    handleAuthorizationInformationChange,
    authorizationInformation,
    setAuthorizationInformation,
    authorizationInformationGrid,
    setAuthorizationInformationGrid,
    expeditedRequest,
    setExpeditedRequest,
    notes,
    setNotes,
    notesErrors,
    memberAddErrors,
    representativeAddErrors,
    representativeInformationErrors,
    providerInformationErrors,
    representativeAltErrors,
    decisionAddErrors,
    providerAddErrors,
    providerAltErrors,
    memberAltErrors,
    notesValidationSchema,
    expeditedRequestValidationSchema,
    location,
    navigateHome,
    saveAndExit,
    submitData,
    pdsubmitData,
    potentialDupData,
    apiTestState,
    callProcRef,
    documentSectionDataRef,
    disableSaveAndExit,
    decisionTab,
    setDecisionTab,
    caseTimelinesErrors,
    caseInformationErrors,
    ProviderclaimInformationErrors,
    ProvidermemberInformationErrors,
    shouldShowSubmitError,
    ProviderclaimInformationGridRowValidationSchema,
    setIscheckedBox,
    providerInformationGridValidationSchema,
    authorizationInformationGridValidationSchema,
    representativeInformationGridValidationSchema,
    memberAddOfRecordsValidationSchema,
    representativeAddOfRecordsValidationSchema,
    representativeInformationValidationSchema,
    providerInformationValidationSchema,
    representativeAltContactValidationSchema,
    decisionAddOfRecordsValidationSchema,
    providerAddOfRecordsValidationSchema,
    providerAltValidationSchema,
    handleShowMember360,
    showMember360,
    handleCloseMember360,
    handleShowProvider360,
    showProvider360,
    handleCloseProvider360,
    showNotesHistory,
    handleShowNotesHistory,
    handleCloseNotesHistory,
    populateModalTable,
    modalTableComponent,
    caseTimelinesFields,
    memberAddRecordFields,
    representativeAddRecordFields,
    representativeInformationFields,
    providerInformationFields,
    representativeAltFields,
    decisionAddRecordFields,
    providerAddRecordFields,
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

  } = useHeader();

  useEffect(() => {
    setRenderType(RenderType.PROVIDER_DISPUTE);
  }, []);

  
  const FormComponent = () => (
    <div
      className="accordion AddProviderLabel"
      id="accordionPanelsStayOpenExample"
    >
      <Formik initialValues={{}} onSubmit={() => {}}>
        <div className="container">
          <div className="row">
            <div className="col-xs-6" style={{ textAlign: "center" }}>
              <br />
              <CaseHeaderAccordion
                handleOnChange={handleCaseHeaderChange}
                handleData={caseHeader}
                setCaseHeader={setCaseHeader}
                caseHeaderFields={caseHeaderFields}
              />
              <CaseTimelinesAccordion
                caseTimelinesData={caseTimelines}
                setCaseTimelinesData={setCaseTimelines}
                caseTimelinesValidationSchema={caseTimelinesValidationSchema}
                caseTimelinesErrors={caseTimelinesErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                renderType={RenderType.PROVIDER_DISPUTE}
                caseTimelinesFields={caseTimelinesFields}
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
              />

              <ProviderCaseClaimInformation
                ProviderclaimInformationData={ProviderclaimInformation}
                setProviderClaimInformationData={setProviderClaimInformation}
                ProviderclaimInformationValidationSchema={ProviderclaimInformationValidationSchema}
                ProviderclaimInformationGridRowValidationSchema={ProviderclaimInformationGridRowValidationSchema}
                handleProviderClaimInformationGridData={ProviderclaimInformationGrid}
                ProviderclaimInformationErrors={ProviderclaimInformationErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                updateClaimInformationGridData={setProviderClaimInformationGrid}
                handleProviderInformationGridData={providerInformationGrid}
                updateProviderInformationGridData={setProviderInformationGrid}
                providerInformationGridValidationSchema={
                  providerInformationGridValidationSchema
                }
                setIscheckedBox = {setIscheckedBox}
              />
              <PdProviderInformationAccordion
                  providerInformationData={pd_ProviderInformation}
                  setProviderInformationData={setpdProviderInformation}
                  providerInformationValidationSchema={providerInformationValidationSchema}
                  providerInformationFields={providerInformationFields}
                  providerInformationErrors={providerInformationErrors}
                  shouldShowSubmitError={shouldShowSubmitError}
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
              
              <ProviderMemberInformationAccordion
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

              {/*<RepresentativeInformationAccordion*/}
              {/*  handleRepresentativeInformationGridData={*/}
              {/*    representativeInformationGrid*/}
              {/*  }*/}
              {/*  updateRepresentativeInformationGridData={*/}
              {/*    setRepresentativeInformationGrid*/}
              {/*  }*/}
              {/*  representativeInformationGridValidationSchema={*/}
              {/*    representativeInformationGridValidationSchema*/}
              {/*  }*/}
              {/*/>*/}
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
              <AuthorizationInformationAccordion
                handleOnChange={handleAuthorizationInformationChange}
                handleData={authorizationInformation}
                handleAuthorizationInformationGridData={
                  authorizationInformationGrid
                }
                updateAuthorizationInformationGridData={
                  setAuthorizationInformationGrid
                }
                authorizationInformationGridValidationSchema={
                  authorizationInformationGridValidationSchema
                }
                renderType={RenderType.PROVIDER_DISPUTE}
                
              />
              <ProviderDecisionRecordsAccordion
                  decisionAddData={pd_DecisionAddRecord}
                  setDecisionAddData={setpdDecisionAddRecord}
                  decisionAddOfRecordsValidationSchema={decisionAddOfRecordsValidationSchema}
                  decisionAddRecordFields={decisionAddRecordFields}
                  decisionAddErrors={decisionAddErrors}
                  shouldShowSubmitError={shouldShowSubmitError}
                  renderType={RenderType.PROVIDER_DISPUTE}
              />
              <NotesAccordion
                notesData={notes}
                setNotesData={setNotes}
                notesErrors={notesErrors}
                notesValidationSchema={notesValidationSchema}
                shouldShowSubmitError={shouldShowSubmitError}
              />

              {/*{location.state.formView === "DashboardHomeView" && (*/}
              {/*  <DocumentSection*/}
              {/*    fileDataRef={documentSectionDataRef.current}*/}
              {/*    //  displayName={CaseHeader.displayName}*/}
              {/*    stageName={caseHeaderConfigData["StageName"]}*/}
              {/*  />*/}
              {/*)}*/}


             
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
            <label id="tileFormLabel" className="HeadingStyle">
              Provider Disputes
            </label>

            {location.state.formView === "DashboardView" ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-primary btnStyle"
                  name="saveAndSubmit"
                  onClick={saveAndExit}
                  style={{ float: "right", marginRight: "10px" }}
                  disabled={disableSaveAndExit}
                >
                  Save & Submit
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btnStyle"
                  name="saveAndExit"
                  onClick={saveAndExit}
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
        {
          // <DropdownButton
          //   id="dropdown-basic-button"
          //   title="Dropdown button"
          //   style={{
          //     display: "flex",
          //     justifyContent: "flex-end",
          //     marginRight: "10px",
          //   }}
          // >
          //   <Dropdown.Item
          //     onClick={(event) => {
          //       handleShowMember360(event);
          //     }}
          //   >
          //     Member 360
          //   </Dropdown.Item>
          //   <Dropdown.Item
          //     onClick={(event) => {
          //       handleShowProvider360(event);
          //     }}
          //   >
          //     Provider 360
          //   </Dropdown.Item>
          //   <Dropdown.Item
          //     onClick={(event) => {
          //       handleShowNotesHistory(event);
          //     }}
          //   >
          //     Notes History
          //   </Dropdown.Item>
          // </DropdownButton>
          <Dropdown>
            <Dropdown.Toggle
              id="dropdown-custom-components"
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginRight: "10px",
                border: "none",
                backgroundColor: "transparent",
              }}
            >
              <FaBars size={24} />
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <Dropdown.Item
                onClick={(event) => {
                  handleShowMember360(event);
                }}
              >
                Member 360
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  handleShowProvider360(event);
                }}
              >
                Provider 360
              </Dropdown.Item>
              <Dropdown.Item
                onClick={(event) => {
                  handleShowNotesHistory(event);
                }}
              >
                Notes History
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        }
        {showMember360 && (
          <Member360
            showMember360={showMember360}
            handleCloseMember360={handleCloseMember360}
            member360TableComponent={modalTableComponent}
          />
        )}
        {showProvider360 && (
          <Provider360
            showProvider360={showProvider360}
            handleCloseProvider360={handleCloseProvider360}
            provider360TableComponent={modalTableComponent}
          />
        )}
        {showNotesHistory && (
          <NotesHistory
            showNotesHistory={showNotesHistory}
            handleCloseNotesHistory={handleCloseNotesHistory}
            notesHistoryTableComponent={modalTableComponent}
          />
        )}
      </div>
      <div className="col-xs-12">
        <div className="container">
          <div className="row">
            {location.state.formView === "DashboardView" ? (
              <Tabs
                defaultActiveKey=" Case Header"
                id="justify-tab-example"
                className="mb-3"
                justify
              >
                <Tab eventKey={"Case Header"} title=" Case Details">
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
