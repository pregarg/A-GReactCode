
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import { CTM_DATA } from "../../../data/ctmData";

export const useCtmCaseCategorization = (renderType) => {
  const { convertToCase } = useGetDBTables();

  const [caseCategorizationFields, setCaseCategorizationFields] = useState([]);
   const [highLevelCauseValues, setHighLevelCauseValues] = useState([]);
  const [ctm_CaseCategorization, setCtmCaseCategorization] = useState({ Category: "" });

  const masterCtmHighLevelCauseSelector = useSelector(
    (state) => state?.masterCtmHighLevelCause,
  );

  const [caseCategorizationValidationSchema, setCaseCategorizationValidationSchema] =
    useState(Yup.object().shape({}));
    const kvMapper = (e) => ({
      label: e,
      value: e,
    });
  useEffect(() => {
    const ctmData = CTM_DATA;
    const categoryValues = Object.keys(ctmData).map(kvMapper)
   

    const highLevelCause = masterCtmHighLevelCauseSelector?.[0] || [];
    const highLevelValues = highLevelCause.map((e) => e.High_Level_Cause).map(kvMapper);
     const fields = [
        { type: "select", name: "Category", placeholder: "Category", maxLength: 50, values: categoryValues, validation: Yup.string().required("Category is required") },
        { type: "select", name: "Sub_Category", placeholder: "SubCategory", maxLength: 50, validation: Yup.string().required("SubCategory is required") },
        { type: "select", name: "Super_Category", placeholder: "Super Category", maxLength: 50, validation: Yup.string().required("Super Category is required") },
        { type: "select", name: "High_Level_Cause", placeholder: "High Level Cause", values: highLevelValues, validation: Yup.string().required("High Level Cause is required") },
        { type: "input", name: "Remediation_People", placeholder: "Remediation People", maxLength: 4000 },
        { type: "input", name: "Remediation_Process", placeholder: "Remediation Process", maxLength: 4000 },
        { type: "input", name: "Remediation_System", placeholder: "Remediation System", maxLength: 4000 }
      ];

    const caseCategorizationObject = fields.reduce((acc, field) => {
      acc[field.name] = ctm_CaseCategorization[field.name];
      return acc;
    }, { Category: ctm_CaseCategorization.Category });

    setCaseCategorizationFields(fields);
    setCtmCaseCategorization(caseCategorizationObject);
    setCaseCategorizationValidationSchema(
      Yup.object().shape(
        fields.reduce((result, item) => {
                result[item.name] = item.validation || Yup.string(); // Add validation to the fields
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
    setCaseCategorizationFields
  };
};
