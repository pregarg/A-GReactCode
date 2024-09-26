import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
export const useDecisionAddOfRecords = (renderType) => {
 // debugger
 const { convertToCase } = useGetDBTables();
  const [decisionAddRecordFields, setDecisionAddRecordFields] = useState([]);
  const [pd_DecisionAddRecord, setpdDecisionAddRecord] = useState({
    caseNumber: ""
  });
  const masterPDIntakeDecisionSelector = useSelector(
    (state) => state?.masterPDIntakeDecision,
  );
  const masterPDIntakeDecisionReasonSelector = useSelector(
    (state) => state?.masterPDIntakeDecisionReason,
  );
  const [intakeDecisionValues, setIntakeDecisionValues] = useState([]);
  const [intakeDecisionReasonValues, setIntakeDecisionReasonValues] = useState([]);

  useEffect(() => {
        const kvMapper = (e) => ({
          label: convertToCase(e),
          value: convertToCase(e),
        });
        const intakeDecision = masterPDIntakeDecisionSelector?.[0] || [];
        setIntakeDecisionValues(
          intakeDecision.map((e) => e.Intake_Decision).map(kvMapper),
        );
        const intakeDecisionReason = masterPDIntakeDecisionReasonSelector?.[0] || [];
        setIntakeDecisionReasonValues(
          intakeDecisionReason.map((e) => e.Intake_Decision_Reason).map(kvMapper),
        );
      }, []);

  const [decisionAddOfRecordsValidationSchema, setDecisionAddOfRecordsValidationSchema] =
    useState(Yup.object().shape({}));

  useEffect(() => {
    const fields = [
        {
            type: "select",
            name: "Intake_Decision",
            placeholder: "Intake Decision",
            values: intakeDecisionValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],
          },
          {
            type: "select",
            name: "Intake_Decision_Reason",
            placeholder: "Intake Decision Reason",
            values: intakeDecisionReasonValues,
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