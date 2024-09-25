import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";

export const useDecisionAddOfRecords = (renderType) => {
  debugger
  const [decisionAddRecordFields, setDecisionAddRecordFields] = useState([]);
  const [pd_DecisionAddRecord, setpdDecisionAddRecord] = useState({
    caseNumber: ""
  });

  const [decisionAddOfRecordsValidationSchema, setDecisionAddOfRecordsValidationSchema] =
    useState(Yup.object().shape({}));

  useEffect(() => {
    const fields = [
        {
            type: "input",
            name: "Intake_Decision",
            placeholder: "Intake Decision",
            maxLength: 250,
            renderTypes: [RenderType.PROVIDER_DISPUTE],
          },
          {
            type: "input",
            name: "Intake_Decision_Reason",
            placeholder: "Intake Decision Reason",
            maxLength: 250,
            renderTypes: [RenderType.PROVIDER_DISPUTE],
          },
          {
            type: "input",
            name: "Decision_Justification",
            placeholder: "Decision Justification",
            maxLength: 250,
            renderTypes: [RenderType.PROVIDER_DISPUTE],
          },
        
      ].filter((e) => e.renderTypes.includes(renderType));

    const decisionAddRecordObject = fields.reduce((acc, field) => {
        acc[field.name] = pd_DecisionAddRecord[field.name];
        return acc;
      }, { caseNumber: pd_DecisionAddRecord.caseNumber });
      
    setDecisionAddRecordFields(fields);
    setpdDecisionAddRecord(decisionAddRecordObject);
    setDecisionAddOfRecordsValidationSchema(
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
    decisionAddRecordFields,
    pd_DecisionAddRecord,
    decisionAddOfRecordsValidationSchema,
    setpdDecisionAddRecord,
  };
};