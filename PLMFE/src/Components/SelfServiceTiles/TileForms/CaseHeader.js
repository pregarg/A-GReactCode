import {React,useState}  from "react";
import {Formik} from "formik";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CaseHeaderAccordion from "./CaseHeaderAccordion";
import CaseTimelinesAccordion from "./CaseTimelinesAccordion";
import CaseInformationAccordion from "./CaseInformationAccordion";
import CaseClaimInformation from "./CaseClaimInformation";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";
import CaseInformation from "../../../WorkItemDashboard/CaseInformation";
import MemberInformationAccordion from "./MemberInformationAccordion";
import AuthorizationInformationAccordion from "./AuthorizationInformationAccordion";
import ExpeditedRequestAccordion from "./ExpeditedRequestAccordion";
import RepresentativeInformationAccordion from "./RepresentativeInformationAccordion";
import {useCaseHeader} from "./useCaseHeader";
import DocumentSection from "../DocumentSection";
import {useLocation} from "react-router-dom";
import DocumentTab from "../../../WorkItemDashboard/DashboardHome/Globalsearch/DocumentTab";

const CaseHeader = () => {
  let prop = useLocation();
  let stageNameCheck = prop.state?.stageName?.props?.stageName;
  console.log("caseheader prop-->", prop, stageNameCheck)
  //let documentSectionDataRef = useRef([]);
  CaseHeader.displayName = "Appeals";
  let caseheaderConfigData = JSON.parse(
      process.env.REACT_APP_CASEHEADER_DETAILS);

  const {
    caseTimelines,
    caseTimelinesValidationSchema,
    setCaseTimelines,
    handleCaseHeaderChange,
    caseHeader,
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
    authorizationInformationGrid,
    setAuthorizationInformationGrid,
    expeditedRequest,
    setExpeditedRequest,
    expeditedRequestValidationSchema,
    location,
    navigateHome,
    saveAndExit,
    submitData,
    potentialDupData,
    handleActionSelectChange,
    apiTestState,
    callProcRef,
    hasSubmitError,
    documentSectionDataRef,
    disableSaveAndExit
  } = useCaseHeader();

  // const [memberInformation, setMemberInformation] = useState();

  const FormComponent = () => (
      <div
          className="accordion AddProviderLabel"
          id="accordionPanelsStayOpenExample"
      >
        <Formik initialValues={{}} onSubmit={() => {
        }}>
          <div className="container">
            <div className="row">
              <div className="col-xs-6" style={{textAlign: "center"}}>
                <br/>
                <CaseHeaderAccordion
                    handleOnChange={handleCaseHeaderChange}
                    handleData={caseHeader}
                />
                <CaseTimelinesAccordion
                    caseTimelinesData={caseTimelines}
                    setCaseTimelinesData={setCaseTimelines}
                    caseTimelinesValidationSchema={caseTimelinesValidationSchema}
                />
                <CaseInformationAccordion
                    caseInformationData={caseInformation}
                    setCaseInformationData={setCaseInformation}
                    caseInformationValidationSchema={caseInformationValidationSchema}
                />
                <CaseClaimInformation
                    claimInformationData={claimInformation}
                    setClaimInformationData={setClaimInformation}
                    claimInformationValidationSchema={claimInformationValidationSchema}
                    handleClaimInformationGridData={claimInformationGrid}
                    updateClaimInformationGridData={setClaimInformationGrid}
                    handleProviderInformationGridData={providerInformationGrid}
                    updateProviderInformationGridData={setProviderInformationGrid}
                />
                <MemberInformationAccordion
                    memberInformationData={memberInformation}
                    setMemberInformationData={setMemberInformation}
                    memberInformationValidationSchema={memberInformationValidationSchema}
                />
                <RepresentativeInformationAccordion
                    handleRepresentativeInformationGridData={representativeInformationGrid}
                    updateRepresentativeInformationGridData={setRepresentativeInformationGrid}
                />
                <AuthorizationInformationAccordion
                    handleOnChange={handleAuthorizationInformationChange}
                    handleData={authorizationInformation}
                    handleAuthorizationInformationGridData={authorizationInformationGrid}
                    updateAuthorizationInformationGridData={setAuthorizationInformationGrid}
                />
                <ExpeditedRequestAccordion
                    expeditedRequestData={expeditedRequest}
                    setExpeditedRequestData={setExpeditedRequest}
                    expeditedRequestValidationSchema={expeditedRequestValidationSchema}
                />
                {prop.state.formView === "DashboardHomeView" && (
                  <DocumentSection
                      fileDataRef={documentSectionDataRef.current}
                      displayName={CaseHeader.displayName}
                      stageName={caseheaderConfigData["StageName"]}
                  />
              )}
                 {/* {prop.state.formView === "DashboardHomeView" && (
                  <DocumentTab
                      fileDataRef={documentSectionDataRef.current}
                      displayName={CaseHeader.displayName}
                      stageName={caseheaderConfigData["StageName"]}
                  />
              )} */}
                   {/* {prop.state.formView === "DashboardHomeView" && (
                  <DecisionTab
                      fileDataRef={documentSectionDataRef.current}
                      displayName={CaseHeader.displayName}
                      stageName={caseheaderConfigData["StageName"]}
                  />
              )} */}
              </div>
            </div>
          </div>
        </Formik>
      </div>
  )

  return (
      <div
          className="AddProvider backgroundColor"
          style={{minHeight: "100vh"}}
      >
        {location.state.formView === "DashboardView" && <CaseInformation/>}

        <div className="container">
          <div className="row">
            <div className="col-xs-6" style={{textAlign: "center"}}>
              <br/>
              <button
                  type="button"
                  className="btn btn-outline-primary btnStyle"
                  onClick={(event) => navigateHome(event)}
                  style={{float: "left", marginLeft: "10px"}}
              >
                Go To Home
              </button>
              <label id="tileFormLabel" className="HeadingStyle">
                Appeals
              </label>

              {location.state.formView === "DashboardView" ? <>
                <button
                    type="button"
                    className="btn btn-outline-primary btnStyle"
                    name="saveAndSubmit"
                    onClick={saveAndExit}
                    style={{float: "right", marginRight: "10px"}}
                    disabled={disableSaveAndExit}
                >
                  Save & Submit
                </button>
                <button
                    type="button"
                    className="btn btn-outline-primary btnStyle"
                    name="saveAndExit"
                    onClick={saveAndExit}
                    style={{float: "right", marginRight: "10px"}}
                    disabled={disableSaveAndExit}
                >
                  Save & Exit
                </button>
              </> : <>
                <button
                    type="button"
                    className="btn btn-outline-primary btnStyle"
                    name="submit"
                    onClick={submitData}
                    disabled={hasSubmitError}
                    style={{float: "right", marginRight: "10px"}}
                >
                  Submit
                </button>
              </>}
            </div>

          </div>
        </div>
        <div className="col-xs-12">

          <div className="container">
            <div className="row">
              {location.state.formView === "DashboardView" ?
                  <Tabs
                      defaultActiveKey=" Case Header"
                      id="justify-tab-example"
                      className="mb-3"
                      justify

                  >
                    <Tab eventKey={' Case Header'} title=' Case Details'>
                      <FormComponent/>
                    </Tab>

                    <Tab eventKey={'Decision'} title='Decision'>
                      <DecisionTab
                          lockStatus={
                            location.state.lockStatus === undefined ||
                            location.state.lockStatus === ""
                                ? "N"
                                : location.state.lockStatus
                          }
                          potentialDupData={potentialDupData}
                          handleActionSelectChange={handleActionSelectChange}
                          delegatedVal={apiTestState?.delegated}
                          buttonClicked={callProcRef.current}
                      ></DecisionTab>


                    </Tab>
                  </Tabs> :
                  <FormComponent/>

              }
            </div>
          </div>
        </div>

      </div>
  );
};

export default CaseHeader;

