
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";

export const useCtmCaseCategorization = (renderType) => {
  const { convertToCase } = useGetDBTables();

  const [caseCategorizationFields, setCaseCategorizationFields] = useState([]);
  const [ctm_CaseCategorization, setCtmCaseCategorization] = useState({ category: "" });

  const [caseCategorizationValidationSchema, setCaseCategorizationValidationSchema] =
    useState(Yup.object().shape({}));

  useEffect(() => {
    const fields = [
      { type: "select", name: "Category", placeholder: "Category", maxLength: 50 },
      { type: "select", name: "Sub_Category", placeholder: "SubCategory", maxLength: 50 },
      { type: "select", name: "Super_Category", placeholder: "Super Category", maxLength: 50 },
      { type: "select", name: "High_Level_Cause", placeholder: "High Level Cause", maxLength: 100 },
      { type: "input", name: "Remediation_People", placeholder: "Remediation People", maxLength: 4000 },
      { type: "input", name: "Remediation_Process", placeholder: "Remediation Process", maxLength: 4000 },
      { type: "input", name: "Remediation_System", placeholder: "Remediation System", maxLength: 4000 }
    ];

    const caseCategorizationObject = fields.reduce((acc, field) => {
      acc[field.name] = ctm_CaseCategorization[field.name];
      return acc;
    }, { category: ctm_CaseCategorization.category });

    setCaseCategorizationFields(fields);
    setCtmCaseCategorization(caseCategorizationObject);
    setCaseCategorizationValidationSchema(
      Yup.object().shape(
        fields
          .filter((e) => e?.validation?.[renderType])
          .reduce((result, item) => {
            result[item.name] = item.validation[renderType];
            return result;
          }, {})
      )
    );
  }, [renderType]);

  return {
    caseCategorizationFields,
    ctm_CaseCategorization,
    caseCategorizationValidationSchema,
    setCtmCaseCategorization,
  };
};
