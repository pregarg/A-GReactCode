import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";

export const useCaseDecisionDetail = (renderType) => {
  const { convertToCase } = useGetDBTables();
  
  const [processingStatusValues, setprocessingStatusValues] = useState([]);
//   const caseHeaderConfigData = JSON.parse(
//     process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
//   );
//   const stageName = caseHeaderConfigData["StageName"];

  

  const masterAngProcessingStatusSelector = useSelector(
    (state) => state?.masterAngProcessingStatus,
  );

  const [caseDecisionDetailsFields, setcaseDecisionDetailsFields] = useState([]);
  const [caseDecisionDetails, setcaseDecisionDetails] = useState({
    caseNumber: "",
  });
  const [caseDecisionDetailsValidationSchema, setcaseDecisionDetailsValidationSchema] =
    useState(Yup.object().shape({}));

    useEffect(() => {
        const kvMapper = (e) => ({
          label: convertToCase(e),
          value: convertToCase(e),
        });
        
        const processingStatus =masterAngProcessingStatusSelector?.[0] || [];
        setprocessingStatusValues(
            processingStatus.map((e) => e.Processing_Status).map(kvMapper),
        );
        
    }, []);
    



  useEffect(() => {
    const fields = [ 
     {
        type: "input",
        name: "Check_Number",
        placeholder: "Check Number",
        maxLength: 50,
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "select",
        name: "Processing_Status",
        placeholder: "Processing Status",
        values: processingStatusValues,
        renderTypes: [RenderType.APPEALS]

      },
      {
        type: "input",
        name: "Reason_Text",
        placeholder: "Reason Text",
        maxLength: 4000,
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "input",
        name: "Payment_Method",
        placeholder: "Payment Method",
        maxLength: 50,
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "input",
        name: "Payment_Number",
        placeholder: "Payment Number",
        maxLength: 50,
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "input",
        name: "Effectuation_Notes",
        placeholder: "Effectuation Notes",
        maxLength: 4000,
        renderTypes: [RenderType.APPEALS]

      },
      {
        type: "date",
        name: "Research_Decision_Date_Time",
        placeholder: "Research Decision Date Time",
        label: "Research Decision Date Time",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Claim_Adjustment_Date",
        placeholder: "Claim Adjustment Date",
        label: "Claim Adjustment Date",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Claim_Paid_Date",
        placeholder: "Claim Paid Date",
        label: "Claim Paid Date",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Check_Date",
        placeholder: "Check Date",
        label: "Check Date",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Claim_Adjusted_Date",
        placeholder: "Claim Adjusted Date",
        label: "Claim Adjusted Date",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Payment_Date",
        placeholder: "Payment Date",
        label: "Payment Date",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Payment_Mail_Date_Postmark",
        placeholder: "Payment Mail Date Postmark",
        label: "Payment Mail Date Postmark",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "input",
        name: "Decision_By_Title",
        placeholder: "Decision By Title",
        maxLength: 50,
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "input",
        name: "Decision_By__Name",
        placeholder: "Decision By Name",
        maxLength: 50,
        renderTypes: [RenderType.APPEALS],
      },
    ].filter((e) => e.renderTypes.includes(renderType));

    const caseDecisionDetailsObject = fields.reduce((acc, field) => {
      acc[field.name] = caseDecisionDetails[field.name] || field.defaultValue;
      return acc;
    }, { caseNumber: caseDecisionDetails.caseNumber });

    setcaseDecisionDetailsFields(fields);
    
    setcaseDecisionDetails(caseDecisionDetailsObject);
    setcaseDecisionDetailsValidationSchema(
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
    caseDecisionDetailsFields,
    caseDecisionDetails,
    caseDecisionDetailsValidationSchema,
    setcaseDecisionDetails,
  };
};
