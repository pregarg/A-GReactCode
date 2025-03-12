import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import * as Yup from "yup";

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
    if(name === 'Complainant_Type') {
      props.setCtmProviderInformationGridValidationSchema(Yup.object().shape({
       Issue_Number: Yup.string().required("Issue Number is mandatory"),}))
      if( value === 'PROVIDER') {
        props.setCtmProviderInformationGridValidationSchema(Yup.object().shape({
          Issue_Number: Yup.string().required("Issue Number is mandatory"),
          Provider_ID: Yup.string().required("Provider ID is mandatory"),
          Provider_Name: Yup.string().required("Provider Name is mandatory"),
          Provider_TIN: Yup.string().required("Provider TIN is mandatory"),
          Provider_Vendor_Specialty: Yup.string().required("Provider/Vendor Specialty  is mandatory"),
          Provider_NPI: Yup.string().required("Provider NPI is mandatory"),
          Provider_IPA: Yup.string().required("Provider IPA is mandatory"),
          CRM_Ticket: Yup.string().required("CRM Ticket # is mandatory"),
          Participating_Provider: Yup.string().required("Participating Provider? is mandatory"),
          Provider_Contract_Effective_Date: Yup.string().required("Provider Contract Effective Date  is mandatory"),
          Provider_Contract_Termination_Date: Yup.string().required("Provider Contract Termination Date is mandatory"),
          Provider_Contract_Type: Yup.string().required("Provider Contract Type is mandatory"),
          Provider_Contract_LOB: Yup.string().required("Provider Contract LOB is mandatory"),
          Provider_Contract_IPA: Yup.string().required("Provider Contract IPA is mandatory"),
          PCP_Flag: Yup.string().required("PCP Flag  is mandatory"),
          Accept_New_Patients: Yup.string().required("Accept New Patients is mandatory"),
          Vendor_ID: Yup.string().required("Vendor ID is mandatory"),
          Vendor_Full_Name: Yup.string().required("Vendor Full Name is mandatory"),
          Vendor_Short_Name: Yup.string().required("Vendor Short Name is mandatory"),
          Vendor_Address: Yup.string().required("Vendor Address is mandatory"),
          Associate_Provider_with_Issue: Yup.string().required("Associate Provider with Issue is mandatory"),

          }))
      } else if( value === 'THIRD PARTY') {
        props.setCtmRepresentativeGridValidationSchema(Yup.object().shape({
          Issue_Number: Yup.string().required("Issue Number is mandatory"),
          First_Name: Yup.string().required("First Name is mandatory"),
          Last_Name: Yup.string().required("Last Name is mandatory"),
          Member_Name_ID: Yup.string().required("Member Name/ID is mandatory"),
          Authorization_Type: Yup.string().required("Authorization Type is mandatory"),
          Authorization_Approved_Date: Yup.string().required("Authorization Approved Date is mandatory"),
          Authorization_Expiration_Date: Yup.string().required("Authorization Expiration Date is mandatory"),
          
          }))
      } 
    }
    
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
                 {renderSelectField("Contract_State", "Contract State ",productStateValues )}
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
