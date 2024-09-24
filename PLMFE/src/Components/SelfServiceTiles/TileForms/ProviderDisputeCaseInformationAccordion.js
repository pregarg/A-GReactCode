import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./CaseHeader.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikSelectField } from "../Common/FormikSelectField";
import * as Yup from "yup";


const CaseInformationAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const [caseInformationData, setCaseInformationData] = useState(
    props.caseInformationData,
  );
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

  const [productTypeValues, setProductTypeValues] = useState([]);
  const [denialTypeValues, setDenialTypeValues] = useState([]);
 
  const validationSchema = Yup.object({
    Line_of_Business_LOB : Yup.string().nullable(),
    Product_State : Yup.string()
  })

  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const arr = masterAngLOBMappingSelector?.[0] || [];
    setLobValues(arr.map((e) => e.LOB).map(kvMapper));
    setProductValues(arr.map((e) => e.Product).map(kvMapper));
    setProductStateValues(arr.map((e) => e.State).map(kvMapper));

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
    setIssueLevelValues(issueLevel.map((e) => e.Issue_Level).map(kvMapper));

    const masterAng = masterAngSelector?.[0] || [];
    setReviewTypeValues(masterAng.map((e) => e.Review_Type).map(kvMapper));

    const productType = productTypeSelector?.[0] || [];
    console.log("productType",productType)
    setProductTypeValues(productType.map((e) => e.Product_Type).map(kvMapper));

    const denialType = denialTypeSelector?.[0] || [];
    setDenialTypeValues(denialType.map((e) => e.Denial_Type).map(kvMapper));
  }, []);

  useEffect(() => {
    const { Product, Product_State, Line_of_Business_LOB } =
      caseInformationData;
    if (
      Product === "MEDICAID" &&
      Product_State === "NC" &&
      Line_of_Business_LOB === "NCD"
    ) {
      setCaseInformationData((prevData) => ({
        ...prevData,
        LOB_Description: "NORTH CAROLINA MEDICAID",
      }));
    }
  }, [
    caseInformationData.Product,
    caseInformationData.Product_State,
    caseInformationData.Line_of_Business_LOB,
  ]);

  const handleCaseInformationData = (name, value, persist) => {
    const newData = {
      ...caseInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setCaseInformationData(newData);

    if (name === "Case_Level_Priority" && value === "EXPEDITED") {
      props.onExpeditedPriorityChange(new Date());
    }

    if (persist) {
      props.setCaseInformationData(newData);
    }
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
        persist={persistCaseInformationData}
        isRequired = {false}
        errors={props.caseInformationErrors}
        schema={validationSchema}
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
        errors={props.caseInformationErrors}
        isRequired = {false}
        schema={validationSchema}
      />
    </div>
  );

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
            {renderSelectField(
              "Line_of_Business_LOB_Dispute",
              "Line of Business",
              lobValues,
            )}
             {renderSelectField(
              "Product_State_Dispute",
              "Product State",
              productStateValues,
            )}
            {renderInputField("LOB_Description_Dispute", "LOB Description", 1000)}
           
          </div>
          <div className="row my-2">
            {renderSelectField("Product_Dispute", "Product", productValues)}
            {renderInputField("Claim_Number", "Claim Number", 50)}
            {renderSelectField(
              "Appellant_Type_Dispute",
              "Appellant Type",
              appellantTypeValues,
            )}
          </div>
          <div className="row my-2">
          
            {renderSelectField(
              "Appellant_Description_Dispute",
              "Appellant Description",
              appellantDescValues,
            )} 
            {renderSelectField("Appeal_Type_Dispute", "Appeal Type", appealTypeValues)}
            {renderInputField("Research_Type_Dispute", "Research Type", 300)}
          </div>
          <div className="row my-2">
          
                {renderSelectField(
              "Case_Level_Priority_Dispute",
              "Case Level Priority",
              caseLevelPriorityValues,
            )}
            {renderInputField("Issue_Level_Number", "Issue Level Number")}
            {renderInputField("Issue_Level_Priority", "Issue Level Priority", 50)}
          </div>
          <div className="row my-2">
            {renderInputField("Complainant_Type", "Complainant Type")}
            {renderInputField("Case_Filing_Method", "Case Filing Method")}
            {renderSelectField("Sub_Issue_Level", "Sub Issue Level")}
          </div>
          <div className="row my-2">
            {renderInputField("Issue_Number", "Issue Number",30)}
            {renderSelectField("Issue_Type", "Issue Type")}
            {renderSelectField("Decision", "Decision")}
          </div>
          <div className="row my-2">
            {renderSelectField("Decision_Reason", "Decision Reason")}
            {renderSelectField("Decision_Date_Time", "Decision Date Time" )}
            {renderInputField("Decision_Summary", "Decision Summary",4000)}
          </div>
          <div className="row my-2">
            {renderSelectField("Review_Type_Dispute", "Review Type", reviewTypeValues)}
            {renderSelectField("Denial_Type_Dispute", "Denial Type", denialTypeValues
            //  [{ label: "USER", value: "USER" },]
            )}
             {renderInputField("Issue_Description", "Issue Description", 4000)}
            
          </div>
          <div className="row">
            {renderInputField("Inbound_Email_ID", "Inbound Email ID", 40)}
          </div>
          <div className="row my-2"></div>
          <div className="case Collobaration">
            <p className="collobarationheader">Case Collaboration</p>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                <p className="prevcase">Previous Case</p>
              </div>
              <div className="col-xs-6 col-md-4">
                <a className="refTag" href="https://www.google.com">
                  Duplicate/Related case(s)
                </a>
              </div>
              <div className="col-xs-6 col-md-4">
                <a className="refTag" href="https://www.google.com">
                  Redirect/ Case(S)
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaseInformationAccordion;
