import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import Select, { components } from "react-select";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import CaseHeaderAccordion from "./CaseHeaderAccordion";
import CaseTimelinesAccordion from "./CaseTimelinesAccordion";
import CaseInformationAccordion from "./CaseInformationAccordion";
import CaseClaimInformation from "./CaseClaimInformation";
import { useSelector, useDispatch } from "react-redux";
import { useAxios } from "../../../api/axios.hook";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import DecisionTab from "../../../WorkItemDashboard/DecisionTab";

const CaseHeader = () => {
  const caseheaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const [tab, setTab] = useState("appealSearch");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [potentialDupData, setPotentialDupData] = useState([]);
  const [apiTestState, setApiTestState] = useState();
  const [caseHeader, setCaseHeader] = useState({
    CASE_ID: "",
    Acknowledgment_Timely: "",
    AOR_Received_Date: "",
    Case_Aging: "",
    Case_Filing_Method: "",
    Case_in_Compliance: "",
    Case_Received_Date: "",
    Compliance_Time_Left_to_Finish: "",
    Out_of_Compliance_Reason: "",
    Timeframe_Extended: "",
    WOL_Received_Date: "",
  });

  const [mainCaseDetails, setMainCaseDetails] = useState({
    flowId: 0,
    stageName: "",
    stageId: 0,
    transactionType: "",
    caseStatus: "",
  });
  CaseHeader.displayName = "Appeals";

  const getDashboardTableData = () => {
    let getApiJson = {};
    getApiJson["tableNames"] = getTableDetails()["mainTable"].concat(
      getTableDetails()["caseTimlinesTable"],
    );
    getApiJson["whereClause"] = { caseNumber: prop.state.caseNumber };
    customAxios
      .post("/generic/get", getApiJson, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("Get data Response: ", res);
        if (res.data.Status === 0) {
          const respData = [...res.data.data.mainTable];
          console.log("pratest: ", respData);

          // setBannerData(respData);
        }
      })
      .catch((err) => {
        console.log(err.message);
      });
    dispatch({
      type: "STORE_DATA",
      payload: {
        data: [],
        pageNumber: 0,
        searchString: "",
        caseSubmitted: false,
      },
    });
  };
  const callProcRef = useRef(null);

  useEffect(() => {
    if (
      prop.state.formView !== undefined &&
      prop.state.formView === "DashboardView"
    ) {
      tabRef.current = "DashboardView";
    }
    getDashboardTableData();
    {
      console.log("prav page load");
    }
    let caseheaderConfigData = JSON.parse(
      process.env.REACT_APP_CASEHEADER_DETAILS,
    );
    const stageDetails = {
      ...mainCaseDetails,
      flowId: caseheaderConfigData["FlowId"],
      stageId: caseheaderConfigData["StageId"],
      stageName: caseheaderConfigData["StageName"],
      transactionType: CaseHeader.displayName,
      caseStatus: "Open",
    };
    setMainCaseDetails(stageDetails);
  }, []);
  const handleActionSelectChange = (propertyName, propertyValue) => {
    const updatedData = potentialDupData.map((data) => ({
      ...data,
      [propertyName]: { label: propertyValue, value: propertyValue },
    }));

    setPotentialDupData(updatedData);
  };
  useEffect(() => {
    console.log("pra11", caseHeader);
  }, [caseHeader]);

  const dispatch = useDispatch();
  const { customAxios } = useAxios();

  const mastersSelector = useSelector((masters) => masters);
  const { getTableDetails, trimJsonValues } = useGetDBTables();
  const token = mastersSelector.hasOwnProperty("auth")
    ? mastersSelector.auth.hasOwnProperty("token")
      ? mastersSelector.auth.token
      : ""
    : "";

  const { convertToCase } = useGetDBTables();
  const { submitCase } = useUpdateDecision();

  const formikFieldsOnChange = (evnt, field) => {
    let value = evnt.target.value || "";
    value = value.toUpperCase();
  };
  const handleDateOnChange = (date, dateName, evnt) => {
    console.log("handleDateOnBlur evnt: ", evnt);
    console.log("handleDateOnBlur date: ", date);
    console.log("handleDateOnBlur dateName: ", dateName);
    const newDateChanges = { ...caseHeader, [dateName]: date };
    setCaseHeader(newDateChanges);
  };
  const submitData = async () => {
    console.log("prav1123onsubmit");
    let apiJson = {};
    let requestBody = { ...caseHeader };
    requestBody = trimJsonValues(requestBody);
    apiJson["ANG_Case_Timelines"] = requestBody;
    let mainCaseReqBody = {
      ...mainCaseDetails,
      caseStatus: "Open",
      lockStatus: "N",
    };

    const flowId = caseheaderConfigData["FlowId"];
    const stageId = caseheaderConfigData["StageId"];
    const stageName = caseheaderConfigData["StageName"];
    requestBody = trimJsonValues(mainCaseReqBody);
    apiJson["MainCaseTable"] = mainCaseReqBody;

    const response = await customAxios.post("/generic/create", apiJson, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Data saved successfully: ", response);

    // Handle the response from the create endpoint.
    const apiStat = response.data.CreateCase_Output.Status;

    if (apiStat === 0) {
      let procData = {};
      let procDataState = {};
      procDataState.stageName = stageName;
      procDataState.flowId = flowId;
      procDataState.caseNumber = response.data["CreateCase_Output"]["CaseNo"];
      procDataState.decision = "Submit";
      procDataState.userName = mastersSelector.hasOwnProperty("auth")
        ? mastersSelector.auth.hasOwnProperty("userName")
          ? mastersSelector.auth.userName
          : "system"
        : "system";
      procDataState.formNames = CaseHeader.displayName;
      procData.state = procDataState;
      alert(
        "Case created successfully: " +
          response.data["CreateCase_Output"]["CaseNo"],
      );
      submitCase(procData, navigateHome);
    }
  };

  const navigate = useNavigate();
  const tabRef = useRef("HomeView");
  const navigateHome = () => {
    navigate("/DashboardLogin/Home", { replace: true });
  };
  const { ValueContainer, Placeholder } = components;
  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, (child) =>
          child && child.type !== Placeholder ? child : null,
        )}
      </ValueContainer>
    );
  };
  let prop = useLocation();
  console.log("prop logger : ", prop);

  const FormComponent = () => (
    <div className="col-xs-12">
      <div
        className="accordion AddProviderLabel"
        id="accordionPanelsStayOpenExample"
      >
        <Formik>
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
                  Appeals
                </label>
                <button
                  type="button"
                  className="btn btn-outline-primary btnStyle"
                  name="submit"
                  onClick={(event) => submitData(event)}
                  style={{ float: "right", marginRight: "10px" }}
                >
                  Submit
                </button>
                <div className="container">
                  <div className="row">{populateFormBasisOnType()}</div>
                </div>
                <CaseTimelinesAccordion
                  formikFieldsOnChange={formikFieldsOnChange}
                  handleDateOnChange={handleDateOnChange}
                />
              </div>
            </div>
          </div>
        </Formik>
      </div>
    </div>
  );

  const handleTabSelect = (e) => {};

  const populateFormBasisOnType = () => {
    //console.log("Inside populateFormBasisOnType tabref= ", tabRef);
    if (tabRef.current === "DashboardView") {
      return (
        <>
          <Tabs
            defaultActiveKey="AddProvider"
            id="justify-tab-example"
            className="mb-3"
            justify
            onSelect={(key) => handleTabSelect(key)}
          >
            {/* Added by Nidhi to show CompensationTab on Cred Specialist, QA, Exit and Discard stage */}
            <Tab eventKey="AddProvider" title="Add a Provider">
              <FormComponent />
            </Tab>

            {/*Till Here */}
            <Tab eventKey="Decision" title="Decision">
              <DecisionTab
                lockStatus={
                  prop.state.lockStatus === undefined ||
                  prop.state.lockStatus === ""
                    ? "N"
                    : prop.state.lockStatus
                }
                potentialDupData={potentialDupData}
                handleActionSelectChange={handleActionSelectChange}
                delegatedVal={apiTestState?.delegated}
                buttonClicked={callProcRef.current}
              ></DecisionTab>
              {/* <DecisionTab selectJson={selectValues}></DecisionTab> */}
            </Tab>
            <Tab eventKey="Reference" title="References">
              <ReferenceTab />
            </Tab>
          </Tabs>
        </>
      );
    }
    if (tabRef.current === "HomeView") {
      return (
        <>
          {" "}
          <FormComponent />
        </>
      );
    }

    //populateForm();
  };

  return (
    <div className="col-xs-12">
      <div
        className="accordion AddProviderLabel"
        id="accordionPanelsStayOpenExample"
      ></div>
    </div>
  );
};

export default CaseHeader;
