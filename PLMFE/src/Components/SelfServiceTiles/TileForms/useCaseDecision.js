import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";

export const useCaseDecision = (renderType) => {
  const { convertToCase } = useGetDBTables();
  
  const [caseDecisionValues, setcaseDecisionValues] = useState([]);

  const masterAngCaseDecisionSelector = useSelector(
    (state) => state?.masterAngDecision,
  );

  const [caseDecisionFields, setcaseDecisionFields] = useState([]);
  const [caseDecision, setcaseDecision] = useState({
    caseNumber: "",
  });
  const [caseDecisionValidationSchema, setcaseDecisionValidationSchema] =
    useState(Yup.object().shape({}));

    useEffect(() => {
        const kvMapper = (e) => ({
          label: convertToCase(e),
          value: convertToCase(e),
        });
        
        const caseDecision =masterAngCaseDecisionSelector?.[0] || [];
        setcaseDecisionValues(
            caseDecision.map((e) => e.DECISION).map(kvMapper),
            console.log("caseDecision value", caseDecision)
        );
        
    }, []);
    



  useEffect(() => {
    const fields = [ 
      {
        type: "select",
        name: "Case_Decision",
        placeholder: "Case Decision",
        values: caseDecisionValues,
        renderTypes: [RenderType.APPEALS],
        validation: {
            [RenderType.APPEALS]: Yup.string().required(
              "Case Decision Method is mandatory",
            ),
          },
      },
      {
        type: "input",
        name: "Case_Decision_Reason",
        placeholder: "Case Decision Reason",
        maxLength: 4000,
        renderTypes: [RenderType.APPEALS],
        validation: {
            [RenderType.APPEALS]: Yup.string().required(
              "Case Decision Reason Method is mandatory",
            ),
          },
      },
    ].filter((e) => e.renderTypes.includes(renderType));

    const caseDecisionObject = fields.reduce((acc, field) => {
      acc[field.name] = caseDecision[field.name] || field.defaultValue;
      return acc;
    }, { caseNumber: caseDecision.caseNumber });

    setcaseDecisionFields(fields);
    
    setcaseDecision(caseDecisionObject);
    setcaseDecisionValidationSchema(
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
    caseDecisionFields,
    caseDecision,
    caseDecisionValidationSchema,
    setcaseDecision,
  };
};
