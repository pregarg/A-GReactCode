import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";

const CtmCaseInformationAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [ctmCaseInformationData, setCtmCaseInformationData] = useState(props.ctmCaseInformationData);
//const [ctmCaseInformationData, setCtmCaseInformationData] = useState({
//    ...props.ctmCaseInformationData,
//    Product: "MEDICARE", // Default to Medicare
//  });
  const [invalidInputState, setInvalidInputState] = useState(false);

  const persistCtmCaseInformationInformationData = () => {
    props.setCtmCaseInformationData(ctmCaseInformationData);
  };
const masterAngLOBMappingSelector = useSelector(
    (state) => state?.masterAngLOBMapping,
  );
 const masterCtmComplainantTypeSelector = useSelector(
     (state) => state?.masterCtmComplainantType,
   );
   const masterCtmCaseFilingMethodSelector = useSelector(
        (state) => state?.masterCtmCaseFilingMethod,
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

  const ctmConfigData = JSON.parse(
        process.env.REACT_APP_CTMHEADER_DETAILS || "{}",

      );
const stageName = ctmConfigData["StageName"];

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
  const [complainantTypeValues, setComplainantTypeValues] = useState([]);
   const [ctmCaseFilingMethodValues, setCtmCaseFilingMethodValues] = useState([]);
const [ctmIssueLevelValues, setCtmIssueLevelValues] = useState([]);

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
    if (ctmCaseInformationData.Product === "MEDICARE") {
      setLobValues(medicareData.map((e) => e.LOB).map(kvMapper));
      setProductStateValues(medicareData.map((e) => e.State).map(kvMapper));
    } else if (ctmCaseInformationData.Product === "MEDICAID") {
      setLobValues(medicaidData.map((e) => e.LOB).map(kvMapper));
      setProductStateValues(medicaidData.map((e) => e.State).map(kvMapper));
    }
    if (
      ctmCaseInformationData.Product &&
      ctmCaseInformationData.Contract_State &&
      ctmCaseInformationData.Line_of_Business
    ) {
      setLobDescriptionValues(
        getLOBDescription(
          ctmCaseInformationData.Product,
          ctmCaseInformationData.Contract_State,
          ctmCaseInformationData.Line_of_Business
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


    const complainantType = masterCtmComplainantTypeSelector?.[0] || [];
    setComplainantTypeValues(
      complainantType.map((e) => e.Complainant_Type).map(kvMapper),
    );


    const ctmCaseFilingMethod = masterCtmCaseFilingMethodSelector?.[0] || [];
    setCtmCaseFilingMethodValues(
      ctmCaseFilingMethod.map((e) => e.Case_Filing_Method).map(kvMapper),
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


  const handleCtmCaseInformationRequestData = (name, value, persist) => {
//  if (name === "Product") {
//        value = "MEDICARE"; // Force Product to be Medicare
//      }
  const kvMapper = (e) => ({
        label: convertToCase(e),
        value: convertToCase(e),
      });
    const newData = {
      ...ctmCaseInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };if (name === "Product") {
            setLobValues([]);
            setProductStateValues([]);
            setLobDescriptionValues('');
            const productData = masterAngLOBMappingSelector?.[0]?.filter((e) => e.Product === value);
            setLobValues(productData.map((e) => e.LOB).map(kvMapper));
            setProductStateValues(productData.map((e) => e.State).map(kvMapper));

            setLobDescriptionValues('');
            newData.Contract_State = '';
            newData.Line_of_Business = '';
          }

//          // Only update LOB Description when Product, Product State, and LOB are all selected
//          if (
//            newData.Product &&
//            newData.Product_State &&
//            newData.Line_of_Business_LOB
//          ) {
//            newData.LOB_Description = getLOBDescription(
//              newData.Product,
//              newData.Product_State,
//              newData.Line_of_Business_LOB
//            );
//          } else {
//            // If any of the values is missing, clear the LOB Description
//            newData.LOB_Description = '';
//          }

//          setCaseInformationData(newData);
//
//          // Handle Expedited Priority
//          if (name === "Case_Level_Priority" && value === "EXPEDITED") {
//            props.onExpeditedPriorityChange(new Date());
//          }
//
//          if (persist) {
//            props.setCaseInformationData(newData);
//          }
    setCtmCaseInformationData({...newData});
    if (persist) {
      props.setCtmCaseInformationData({...newData});
    }
  };
  const getLOBDescription = (product, state, lob) => {
      const productTable = masterAngLOBMappingSelector?.[0] || [];
      const selectedProduct = productTable.find(
        (e) => e.Product === product && e.State === state && e.LOB === lob
      );
      return selectedProduct ? selectedProduct.LOB_Description_CTM : '';
    };

  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4">
        <FormikInputField
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            data={ctmCaseInformationData}
            onChange={handleCtmCaseInformationRequestData}
            disabled={
                location.state.formView === "DashboardView" &&
                (
                    location.state.stageName === "Case Completed" ||
                    location.state.stageName === "Case Archived")


            }
            persist={persistCtmCaseInformationInformationData}
            schema={props.ctmCaseInformationValidationSchema}
            displayErrors={props.shouldShowSubmitError}
            errors={props.ctmCaseInformationErrors}
        />
      </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
      <div className="col-xs-6 col-md-4">
        <FormikDatePicker
          name={name}
          placeholder={placeholder}
          label={label}
          data={ctmCaseInformationData || {}}
          onChange={handleCtmCaseInformationRequestData}
          displayErrors={props.shouldShowSubmitError}
          schema={props.ctmCaseInformationValidationSchema}
          errors={props.ctmCaseInformationErrors}
        />
      </div>
    );
 const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
         data={ctmCaseInformationData || {}}
        options={options}
        onChange={handleCtmCaseInformationRequestData}
        disabled={invalidInputState}
        persist={persistCtmCaseInformationInformationData}
        schema={props.ctmCaseInformationValidationSchema}
        displayErrors={props.shouldShowSubmitError}
         errors={props.ctmCaseInformationErrors}
      />
    </div>
  );
  return (
      <div>
        <div className="accordion-item" id="ctmCaseInformationInformation">
          <h2 className="accordion-header" id="panelsStayOpen-ctmCaseInformationInformation">
            <button
                className="accordion-button accordionButtonStyle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseclaimInformation"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
            >
              Case Information
            </button>
          </h2>
          <div
              id="panelsStayOpen-collapsectmCaseInformationInformation"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-ctmCaseInformationInformation"
          >
            <div className="accordion-body">
              <div className="row my-2">
                 {renderInputField("LOB_Description_CTM", "LOB Description", 4000)}
                 {renderSelectField("Product", "Product",productValues)}
                 {renderSelectField("Line_of_Business", "Line of Business",lobValues )}
                 </div>
                 <div className="row my-2">
                 {renderSelectField("Contract_State ", "Contract State ",productStateValues )}
                 {renderSelectField("Complainant_Type", "Complainant Type",complainantTypeValues)}
                 {renderSelectField("Case_Filing_Method", "Case Filing Method",ctmCaseFilingMethodValues )}
               </div>
                 <div className="row my-2">
                               {renderInputField("Case_Collaboration", "Case Collaboration", 150)}
                              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CtmCaseInformationAccordion;
