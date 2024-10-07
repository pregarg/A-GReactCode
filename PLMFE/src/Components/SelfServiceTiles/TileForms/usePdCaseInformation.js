import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";

export const usePdCaseInformation = (renderType) => {
    const { convertToCase } = useGetDBTables();
  const masterPDLineOfBusinessSelector = useSelector(
    (state) => state?.masterPDLineOfBusiness,
  );

//   const masterPDProductStateSelector = useSelector(
//     (state) => state?.masterPDProductState,
//   );

  const masterPDProductSelector = useSelector(
    (state) => state?.masterPDProduct,
  );

  const masterPDIssueLevelPrioritySelector = useSelector(
    (state) => state?.masterPDIssueLevelPriority,
  );
  const masterPDIssueLevelNumSelector = useSelector(
    (state) => state?.masterPDIssueLevelNum,
  );
  const masterPDComplainantTypeSelector = useSelector(
    (state) => state?.masterPDComplainantType,
  );

  const masterPDCaseFillingMethodSelector = useSelector(
    (state) => state?.masterPDCaseFillingMethod,
  );

  const masterPDComplaintTypeSelector = useSelector(
    (state) => state?.masterPDComplaintType,
  );
  const masterPDSubIsuueLevelSelector = useSelector(
    (state) => state?.masterPDSubIssueLevel,
  );

  const [lineOfBusinessValues, setLineOfBusinessValues] = useState([]);
  const [productStateValues, setProductStateValues] = useState([]);
  const [productValues, setProductValues] = useState([]);
  const [issueLevelNumValues, setIssueLevelNumValues] = useState([]);
  const [issueLevelPriorityValues, setIssueLevelPriorityValues] = useState([]);
  const [complainantTypeValues, setComplainantTypeValues] = useState([]);
  const [caseFillingMethodValues, setCaseFillingMethodValues] = useState([]);
  const [complaintTypeValues, setComplaintTypeValues] = useState([]);
  const [subIsuueLevelValues, setSubIsuueLevelValues] = useState([]);
  
  const [caseInformationFields, setcaseInformationFields] = useState([]);
  const [pd_CaseInformation, setpdCaseInformation] = useState({
    caseNumber: ""
  });

  const [pdCaseInformationValidationSchema, setPdcaseInformationValidationSchema] =
    useState(Yup.object().shape({}));
    useEffect(() => {
        const kvMapper = (e) => ({
          label: convertToCase(e),
          value: convertToCase(e),
        });
        const arr = masterPDLineOfBusinessSelector?.[0] || [];
        setLineOfBusinessValues(arr.map((e) => e.LOB).map(kvMapper));
        setProductStateValues(arr.map((e) => e.State_).map(kvMapper));
    
        const product = masterPDProductSelector?.[0] || [];
        setProductValues(
            product.map((e) => e.Product).map(kvMapper),
        );
    
        const issueLevelPriority =masterPDIssueLevelPrioritySelector?.[0] || [];
        setIssueLevelPriorityValues(
            issueLevelPriority.map((e) => e.Issue_Level).map(kvMapper),
        );
    
        const issueLevelNumValues = masterPDIssueLevelNumSelector?.[0] || [];
        setIssueLevelNumValues(issueLevelNumValues.map((e) => e.Level_Number).map(kvMapper));
    
        const complainantType = masterPDComplainantTypeSelector?.[0] || [];
        setComplainantTypeValues(complainantType.map((e) => e.Complainant_Type).map(kvMapper),
        );
        const caseFilling = masterPDCaseFillingMethodSelector?.[0] || [];
        setCaseFillingMethodValues(caseFilling.map((e) => e.Case_Filing_Method).map(kvMapper),
        );
        const complaintType = masterPDComplaintTypeSelector?.[0] || [];
        setComplaintTypeValues(complaintType.map((e) => e.Complaint_Type).map(kvMapper),
        );

        const arr1 = masterPDSubIsuueLevelSelector?.[0] || [];
        // setLineOfBusinessValues(arr.map((e) => e.LOB).map(kvMapper));
        // const subIsuueLevel = masterPDSubIsuueLevelSelector?.[0] || [];
        setSubIsuueLevelValues(arr1.map((e) => e.Review_Type).map(kvMapper),);
        }, []);


  useEffect(() => {
    const fields = [
        {
            type: "select",
            name: "Line_Of_Business",
            placeholder: "Line Of Business",
            values: lineOfBusinessValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],        
          },
        {
          type: "input",
          name: "LOB_Description",
          placeholder: "LOB Description",
          maxLength: 255,
          renderTypes: [RenderType.PROVIDER_DISPUTE],
        },
        {
            type: "select",
            name: "Product_State",
            placeholder: "Product State",
            values: productStateValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],        
          },
          {
            type: "select",
            name: "Product",
            placeholder: "Product",
            values: productValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],        
          },
          {
            type: "select",
            name: "Issue_Level_Priority",
            placeholder: "Issue Level Priority",
            values: issueLevelPriorityValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],        
          },
          {
            type: "select",
            name: "Issue_Level_Number",
            placeholder: "Issue Level Number",
            values: issueLevelNumValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],        
          },
          {
            type: "select",
            name: "Complainant_Type",
            placeholder: "Complainant Type",
            values: complainantTypeValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],        
          },
          {
            type: "select",
            name: "Case_Filing_Method",
            placeholder: "Case Filing Method",
            values: caseFillingMethodValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],        
          },
        {
          type: "input",
          name: "Inbound_Email_ID",
          placeholder: "Inbound Email ID",
          maxLength: 4000,
          renderTypes: [RenderType.PROVIDER_DISPUTE],
        },
        {
            type: "select",
            name: "Complaint_Type",
            placeholder: "Complaint Type",
            values: complaintTypeValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],        
          },
          {
            type: "select",
            name: "Sub_Issue_Level",
            placeholder: "Sub Issue Level",
            values: subIsuueLevelValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],        
          },
      ].filter((e) => e.renderTypes.includes(renderType));

    const caseInformationObject = fields.reduce((acc, field) => {
        acc[field.name] = pd_CaseInformation[field.name];
        return acc;
      }, { caseNumber: pd_CaseInformation.caseNumber });
   
    setcaseInformationFields(fields);
    setpdCaseInformation(caseInformationObject);
    setPdcaseInformationValidationSchema(
      Yup.object().shape({
        ...fields
          .filter((e) => e?.validation?.[renderType])
          .reduce((result, item) => {
            result[item.name] = item.validation[renderType];
            return result;
          }, {}),
      }),
    );
  }, [renderType]);
  return {
    caseInformationFields,
    pd_CaseInformation,
    pdCaseInformationValidationSchema,
    setpdCaseInformation,
  };
};