import { React, useEffect, useState } from "react";
import { Formik } from "formik";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import CaseHeaderAccordion from "./CaseHeaderAccordion";
import CaseTimelinesAccordion from "./CaseTimelinesAccordion";
import CaseInformationAccordion from "./ProviderDisputeCaseInformationAccordion";
import CaseClaimInformation from "./ProviderDisputeClaimInformation";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import MemberInformationAccordion from "./ProviderDisputeMemberInformationAccordion";
import AuthorizationInformationAccordion from "./ProviderDisputeAuthorizationInformationAccordion";
import ExpeditedRequestAccordion from "./ExpeditedRequestAccordion";
import NotesAccordion from "./ProviderDisputeNotesAccordion";
import { FaBars } from "react-icons/fa";

import RepresentativeInformationAccordion from "./ProviderDisputeRepresentativeInformationAccordion";
import { useHeader } from "./useHeader";
import DocumentSection from "../DocumentSection";
import { useLocation } from "react-router-dom";
import Member360 from "../TileForms/Member360";
import Provider360 from "../TileForms/Provider360";
import NotesHistory from "../TileForms/NotesHistory";
import MemberAddOfRecordsAccordion from "../TileForms/MemberAddOfRecordsAccordion";
import MemberAltContactInfoAccordion from "../TileForms/MemberAltContactInfoAccordion";

import { RenderType } from "./Constants";

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
    pd_MemberAltContactInfo,
    caseTimelinesValidationSchema,
    memberAltContactValidationSchema,
    setCaseTimelines,
    setpdMemberAddRecord,
    setpdMemberAltContactInfo,
    handleCaseHeaderChange,
    caseHeader,
    setCaseHeader,
    caseInformation,
    setCaseInformation,
    caseInformationValidationSchema,
    claimInformation,
    setClaimInformation,
    claimInformationValidationSchema,
    claimInformationGrid,
    setClaimInformationGrid,
    providerInformationGrid,
    setProviderInformationGrid,
    memberInformation,
    memberInformationValidationSchema,
    setMemberInformation,
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
    memberAltContactErrors,
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
    claimInformationErrors,
    memberInformationErrors,
    shouldShowSubmitError,
    claimInformationGridRowValidationSchema,
    providerInformationGridValidationSchema,
    authorizationInformationGridValidationSchema,
    representativeInformationGridValidationSchema,
    memberAddOfRecordsValidationSchema,
    memberAltContactInfoValidationSchema,
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
    memberAltContactFields,
    setRenderType,
    caseHeaderFields,
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
               <CaseInformationAccordion
                caseInformationData={caseInformation}
                setCaseInformationData={setCaseInformation}
                caseInformationValidationSchema={
                  caseInformationValidationSchema
                }
                caseInformationErrors={caseInformationErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                onExpeditedPriorityChange={handleExpeditedPriorityChange}
              />
              <CaseClaimInformation
                claimInformationData={claimInformation}
                setClaimInformationData={setClaimInformation}
                claimInformationValidationSchema={
                  claimInformationValidationSchema
                }
                claimInformationGridRowValidationSchema={
                  claimInformationGridRowValidationSchema
                }
                handleClaimInformationGridData={claimInformationGrid}
                claimInformationErrors={claimInformationErrors}
                shouldShowSubmitError={shouldShowSubmitError}
                updateClaimInformationGridData={setClaimInformationGrid}
                handleProviderInformationGridData={providerInformationGrid}
                updateProviderInformationGridData={setProviderInformationGrid}
                providerInformationGridValidationSchema={
                  providerInformationGridValidationSchema
                }
              />
              
              <MemberInformationAccordion
                memberInformationData={memberInformation}
                setMemberInformationData={setMemberInformation}
                memberInformationValidationSchema={
                  memberInformationValidationSchema
                }
                memberInformationErrors={memberInformationErrors}
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

              <MemberAltContactInfoAccordion />

              <RepresentativeInformationAccordion
                handleRepresentativeInformationGridData={
                  representativeInformationGrid
                }
                updateRepresentativeInformationGridData={
                  setRepresentativeInformationGrid
                }
                representativeInformationGridValidationSchema={
                  representativeInformationGridValidationSchema
                }
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
              />
              {/*<ExpeditedRequestAccordion*/}
              {/*  expeditedRequestData={expeditedRequest}*/}
              {/*  setExpeditedRequestData={setExpeditedRequest}*/}
              {/*  expeditedRequestValidationSchema={*/}
              {/*    expeditedRequestValidationSchema*/}
              {/*  }*/}
              {/*/>*/}
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
