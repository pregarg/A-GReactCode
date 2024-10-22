import { useEffect, useState } from "react";
import { RenderType } from "./Constants";

export const useCaseHeader = (renderType) => {
  const [caseHeaderFields, setCaseHeaderFields] = useState([]);
  const [caseHeader, setCaseHeader] = useState({
    caseNumber: "",
  });
  useEffect(() => {
    const fields = [
      {
        type: "none",
        name: "caseNumber",
        placeholder: "Case ID",
        renderTypes: [RenderType.APPEALS,RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "none",
        name: "Case_Owner",
        placeholder: "Case Owner",
        renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
      },
      
      {
        type: "none",
        name: "Case_Status",
        placeholder: "Case Status",
        renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
      },
        
      {
        type: "none",
        name: "Case_Validation",
        placeholder: "Case Validation",
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "none",
        name: "White_Glove_Indicator",
        placeholder: "White Glove Indicator",
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "none",
        name: "Environmental_Description",
        placeholder: "Environmental Description",
        defaultValue: "Dev",
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "none",
        name: "Case_Due_Date",
        placeholder: "Case Due Date",
        renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
      },
      
      {
        type: "none",
        name: "Extended_Case_Due_Date",
        placeholder: "Extended Case Due Date",
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "none",
        name: "Internal_Due_Date",
        placeholder: "Internal Due Date",
        renderTypes: [RenderType.APPEALS],
      },
    
      {
        type: "none",
        name: "Case_Received_Date",
        placeholder: "Case Received Date",
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "none",
        name: "Subcase_ID",
        placeholder: "Subcase ID",
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "none",
        name: "Alert_Indicator",
        placeholder: "Alert Indicator",
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "none",
        name: "Goal_Deadline",
        placeholder: "Goal Deadline",
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "none",
        name: "Original_Case_Received_Date",
        placeholder: "Original Case Received Date",
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "none",
        name: "White_Glove_Indicator",
        placeholder: "White Glove Indicator",
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
    ].filter((e) => e.renderTypes.includes(renderType));

    const caseHeaderObject = fields.reduce((acc, field) => {
      acc[field.name] = caseHeader[field.name] || field.defaultValue;
      return acc;
    }, { caseNumber: caseHeader.caseNumber });

    setCaseHeaderFields(fields);
    // setCaseHeader({
    //   caseNumber: caseHeader.caseNumber,
    //   ...fields.map((e) => ({
    //     [e.name]: caseHeader[e.name] || e.defaultValue,
    //   })),
    // });
    setCaseHeader(caseHeaderObject);
  }, [renderType]);
  return {
    caseHeader,
    setCaseHeader,
    caseHeaderFields,
  };
};
