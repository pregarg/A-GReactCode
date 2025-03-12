import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./CaseHeader.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikSelectField } from "../Common/FormikSelectField";

const CaseInformationAccordion = (props) => {

  const { convertToCase } = useGetDBTables();
  const [caseInformationData, setCaseInformationData] = useState(
    props.caseInformationData,

  );
  console.log("props.renderType",caseInformationData)
  const masterAngLOBMappingSelector = useSelector(
    (state) => state?.masterAngLOBMapping,
  );
  const appellantDescSelector = useSelector(
    (state) => state?.masterAngAppellantDesc,
  );
  const appellantTypeSelector = useSelector(
    (state) => state?.masterAngAppellantType,
  );
  const appealTypeSelector = useSelector((state) => state?.masterAngAppealType);
  console.log("appealTypeSelector master",appealTypeSelector )
  const caseLevelSelector = useSelector(
    (state) => state?.masterAngCaseLevelPriority,
  );
  const issueLevelSelector = useSelector((state) => state?.masterAngIssueLevel);
  const masterAngSelector = useSelector((state) => state?.masterAngReviewType);

  const productTypeSelector = useSelector((state) => state?.masterAngProductType);
  console.log("productTypeSelector master",productTypeSelector )
  const denialTypeSelector = useSelector((state) => state?.masterAngDenialType);

  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const [lobValues, setLobValues] = useState([]);
  const [appellantDescValues, setAppellantDescValues] = useState([]);
  const [appellantTypeValues, setAppellantTypeValues] = useState([]);
  const [appealTypeValues, setAppealTypeValues] = useState([]);
  const [caseLevelPriorityValues, setCaseLevelPriorityValues] = useState([]);
  const [issueLevelValues, setIssueLevelValues] = useState([]);
  const [reviewTypeValues, setReviewTypeValues] = useState([]);
  const [productValues, setProductValues] = useState([]);
  const [productStateValues, setProductStateValues] = useState([]);
  const [lobDescriptionValues, setLobDescriptionValues] = useState([]);
  const [productTypeValues, setProductTypeValues] = useState([]);
  const [denialTypeValues, setDenialTypeValues] = useState([]);

 
  useEffect(() => {
    // Define kvMapper function inside useEffect to map data
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
  
    const productTable = masterAngLOBMappingSelector?.[0] || [];
    const medicareData = productTable.filter((e) => e.Product === "MEDICARE");
    const medicaidData = productTable.filter((e) => e.Product === "MEDICAID");
  
    // Set Product dropdown based on Medicare/Medicaid
    setProductValues([
      ...medicareData,
      ...medicaidData,
    ].map((e) => e.Product).map(kvMapper));
  
    // Populate LOB and Product State dropdowns based on selected Product
    if (caseInformationData.Product === "MEDICARE") {
      setLobValues(medicareData.map((e) => e.LOB).map(kvMapper));
      setProductStateValues(medicareData.map((e) => e.State).map(kvMapper));
    } else if (caseInformationData.Product === "MEDICAID") {
      setLobValues(medicaidData.map((e) => e.LOB).map(kvMapper));
      setProductStateValues(medicaidData.map((e) => e.State).map(kvMapper));
    }
    if (
      caseInformationData.Product &&
      caseInformationData.Product_State &&
      caseInformationData.Line_of_Business_LOB
    ) {
      setLobDescriptionValues(
        getLOBDescription(
          caseInformationData.Product,
          caseInformationData.Product_State,
          caseInformationData.Line_of_Business_LOB
        )
      );
    }
  
    const appellantDesc = appellantDescSelector?.[0] || [];
    setAppellantDescValues(
      [
        ...new Set(appellantDesc.map((e) => convertToCase(e.APPELLANT_DESC))),
      ].map(kvMapper),
    );

    const appellantType = appellantTypeSelector?.[0] || [];
    setAppellantTypeValues(
      appellantType.map((e) => e.Appellant_Type).map(kvMapper),
    );

    const appealType = appealTypeSelector?.[0] || [];
    setAppealTypeValues(appealType.map((e) => e.Appeal_Type).map(kvMapper));

    const caseLevel = caseLevelSelector?.[0] || [];
    setCaseLevelPriorityValues(
      caseLevel.map((e) => e.Case_Level_Priority).map(kvMapper),
    );

    const issueLevel = issueLevelSelector?.[0] || [];
    console.log("issueLevel",issueLevel)
    setIssueLevelValues(issueLevel.map((e) => e.Issue_Level).map(kvMapper));

    const masterAng = masterAngSelector?.[0] || [];
    setReviewTypeValues(masterAng.map((e) => e.Review_Type).map(kvMapper));

    const productType = productTypeSelector?.[0] || [];
    setProductTypeValues(productType.map((e) => e.Product_Type).map(kvMapper));

    const denialType = denialTypeSelector?.[0] || [];
    setDenialTypeValues(denialType.map((e) => e.Denial_Type).map(kvMapper));
  }, []);


  
  const handleCaseInformationData = (name, value, persist) => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
  
    const newData = {
      ...caseInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
  
    if (name === "Product") {
      setLobValues([]);
      setProductStateValues([]);
      setLobDescriptionValues('');
      const productData = masterAngLOBMappingSelector?.[0]?.filter((e) => e.Product === value);
      setLobValues(productData.map((e) => e.LOB).map(kvMapper));
      setProductStateValues(productData.map((e) => e.State).map(kvMapper));

      setLobDescriptionValues('');
      newData.Product_State = '';
      newData.Line_of_Business_LOB = '';
    }
  
    // Only update LOB Description when Product, Product State, and LOB are all selected
    if (
      newData.Product &&
      newData.Product_State &&
      newData.Line_of_Business_LOB
    ) {
      newData.LOB_Description = getLOBDescription(
        newData.Product,
        newData.Product_State,
        newData.Line_of_Business_LOB
      );
    } else {
      // If any of the values is missing, clear the LOB Description
      newData.LOB_Description = '';
    }
  
    setCaseInformationData(newData);
  
    // Handle Expedited Priority
    if (name === "Case_Level_Priority" && value === "EXPEDITED") {
      props.onExpeditedPriorityChange(new Date());
    }
  
    if (persist) {
      props.setCaseInformationData(newData);
    }
  };
  
  const getLOBDescription = (product, state, lob) => {
    const productTable = masterAngLOBMappingSelector?.[0] || [];
    const selectedProduct = productTable.find(
      (e) => e.Product === product && e.State === state && e.LOB === lob
    );
    return selectedProduct ? selectedProduct.LOB_Description : '';
  };
  

  
  const persistCaseInformationData = () => {
    props.setCaseInformationData(caseInformationData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseInformationData}
        onChange={handleCaseInformationData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          (location.state.formView === "DashboardView" ||
            location.state.formView === "DashboardHomeView") &&
          (((stageName === "Start" ||
            location.state.stageName === "Intake" ||
            location.state.stageName === "Acknowledge") &&
            (name === "Claim_Number" || name === "LOB_Description")) ||
            location.state.stageName === "Redirect Review" ||
            (location.state.stageName === "Documents Needed" &&
              name === "Inbound_Email_ID") ||
            (location.state.stageName === "Research" &&
              name === "Inbound_Email_ID") ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            location.state.stageName === "Reopen" ||
            location.state.stageName === "CaseArchived")
        }
        persist={persistCaseInformationData}
        schema={props.caseInformationValidationSchema}
        errors={props.caseInformationErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={caseInformationData}
        options={options}
        onChange={handleCaseInformationData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          location.state.formView === "DashboardView" &&
          (location.state.stageName === "Redirect Review" ||
            (location.state.stageName === "Research" &&
              (name === "Line_of_Business_LOB" ||
                name === "Product_State" ||
                name === "Product")) ||
            location.state.stageName === "Documents Needed" ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            location.state.stageName === "Reopen" ||
            location.state.stageName === "CaseArchived")
        }
        schema={props.caseInformationValidationSchema}
        errors={props.caseInformationErrors}
      />
    </div>
  );
  const linksEnabled = false; 
  return (
    <div className="accordion-item" id="caseInformationData">
      <h2 className="accordion-Information" id="panelsStayOpen-Information">
        <button
          className="accordion-button accordionButtonStyle"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#panelsStayOpen-collapseInformation"
          aria-expanded="true"
          aria-controls="panelsStayOpen-collapseOne"
        >
          Case Information
        </button>
      </h2>
      <div
        id="panelsStayOpen-collapseInformation"
        className="accordion-collapse collapse show"
        aria-labelledby="panelsStayOpen-Information"
      >
        <div className="accordion-body">
          <div className="row my-2">
            {renderSelectField("Product", "Product", productValues)}
             {renderSelectField(
              "Product_State",
              "Product State",
              productStateValues,
            )}
            {renderSelectField(
              "Line_of_Business_LOB",
              "Line of Business",
              lobValues,
            )}
            
           
          </div>
          <div className="row my-2">
            {renderInputField("LOB_Description", "LOB Description", 300)}
            {renderSelectField("Product_Type", "Product Type", productTypeValues
            //  [{ label: "USER", value: "USER" },]
              )}
            {renderInputField("Claim_Number", "Claim Number", 16)}
           
          </div>
          <div className="row my-2">
          {renderSelectField(
              "Appellant_Type",
              "Appellant Type",
              appellantTypeValues,
            )}
            {renderSelectField(
              "Appellant_Description",
              "Appellant Description",
              appellantDescValues,
            )} 
            {renderSelectField("Appeal_Type", "Appeal Type", appealTypeValues)}
          </div>
          <div className="row my-2">
          {renderInputField("Research_Type", "Research Type", 4000)}
                {renderSelectField(
              "Case_Level_Priority",
              "Case Level Priority",
              caseLevelPriorityValues,
            )}
            {renderSelectField("Issue_Level", "Issue Level", issueLevelValues)}
           
        
          </div>
          <div className="row my-2">
            {renderSelectField("Review_Type", "Review Type", reviewTypeValues)}
            {renderSelectField("Denial_Type", "Denial Type", denialTypeValues
            //  [{ label: "USER", value: "USER" },]
            )}
             {renderInputField("Issue_Description", "Issue Description", 4000)}
            
          </div>
          <div className="row">
            {renderInputField("Inbound_Email_ID", "Inbound Email ID", 4000)}
          </div>
          
          <div className="row my-2"></div>
          {/* <div className="case Collobaration">
            <p className="collobarationheader">Case Collaboration</p>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                <p className="prevcase">Previous Case</p>
              </div>
              <div className="col-xs-6 col-md-4">
                <a className="refTag" href="https://www.google.com" tabIndex="-1" aria-disabled="true">
                  Duplicate/Related case(s)
                </a>
              </div>
              <div className="col-xs-6 col-md-4">
                <a className="refTag" href="https://www.google.com">
                  Redirect/ Case(S)
                </a>
              </div>
            </div>
          </div> */}

          
          {/*commented for now as all links are disabled at every WS
           <div className="case Collobaration">
            <p className="collobarationheader">Case Collaboration</p>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                <p className="prevcase">Previous Case</p>
              </div>
              <div className="col-xs-6 col-md-4">
                {linksEnabled ? (
                  <a className="refTag" href="https://www.google.com">
                    Duplicate/Related case(s)
                  </a>
                ) : (
                  <span className="disabled-link">Duplicate/Related case(s)</span>
                )}
              </div>
              <div className="col-xs-6 col-md-4">
                {linksEnabled ? (
                  <a className="refTag" href="https://www.google.com">
                    Redirect/Case(s)
                  </a>
                ) : (
                  <span className="disabled-link">Redirect/Case(s)</span>
                )}
              </div>
            </div>
          </div> */}

        </div>
      </div>
    </div>
  );
};

export default CaseInformationAccordion;
