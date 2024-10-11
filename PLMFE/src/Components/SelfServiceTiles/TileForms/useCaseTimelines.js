import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";

export const useCaseTimelines = (renderType) => {
  const { convertToCase } = useGetDBTables();
  const masterAngCaseFilingMethodSelector = useSelector(
    (state) => state?.masterAngCaseFilingMethod,
  );

  const masterPDTimeFrameExtendedSelector = useSelector(
    (state) => state?.masterPDTimeFrameExtended,
  );

  const masterPDCaseInComplianceSelector = useSelector(
    (state) => state?.masterPDCaseInCompliance,
  );

  const masterPDDepartmentSelector = useSelector(
    (state) => state?.masterPDDepartment,
  );
  const masterPDNoOfClaimsSelector = useSelector(
    (state) => state?.masterPDNoOfClaims,
  );

  const [caseFilingMethodValues, setCaseFilingMethodValues] = useState([]);
  const [timeFrameExtendedValues, setTimeFrameExtendedValues] = useState([]);
  const [caseInComplianceValues, setCaseInComplianceValues] = useState([]);
  const [departmentValues, setDepartmentValues] = useState([]);
  const [noOfClaimsValues, setNoOfClaimsValues] = useState([]);
  const [caseTimelinesFields, setCaseTimelinesFields] = useState([]);
  const [caseTimelines, setCaseTimelines] = useState({
    caseNumber: "",
  });
  const [caseTimelinesValidationSchema, setCaseTimelinesValidationSchema] =
    useState(Yup.object().shape({}));

  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    
    

    const caseFilling = masterAngCaseFilingMethodSelector?.[0] || [];
    setCaseFilingMethodValues(
      caseFilling.map((e) => e.Case_Filing_Method).map(kvMapper),
    );

    const timeExtendedFrame = masterPDTimeFrameExtendedSelector?.[0] || [];
    setTimeFrameExtendedValues(
      timeExtendedFrame.map((e) => e.Timeframe_Extended).map(kvMapper),
    );

    const caseInCompliance = masterPDCaseInComplianceSelector?.[0] || [];
    setCaseInComplianceValues(caseInCompliance.map((e) => e.Case_in_Compliance).map(kvMapper));

    const arr = masterPDDepartmentSelector?.[0] || [];
    console.log("department values",arr)
    //const department = masterPDDepartmentSelector?.[0] || [];
    setDepartmentValues(arr.map((e) => e.Department).map(kvMapper),
    );

    const noOfClaims = masterPDNoOfClaimsSelector?.[0] || [];
    setNoOfClaimsValues(noOfClaims.map((e) => e.Number_of_Claims_More_Than_10).map(kvMapper));
  }, []);

  useEffect(() => {
    const fields = [
      {
        type: "date",
        name: "Case_Received_Date",
        placeholder: "Case Received Date",
        label: "Case Received Date",
        defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
        validation: {
          [RenderType.APPEALS]: Yup.date()
            .required("Case Received Date is mandatory")
            .max(new Date(), "Case Received  Date cannot be in future"),
        },
      },
      {
        type: "date",
        name: "AOR_Received_Date",
        placeholder: "AOR Received Date",
        label: "AOR Received Date",
        renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
        validation: {
          [RenderType.APPEALS]: Yup.date()
            .required("AOR Received Date is mandatory")
            .max(new Date(), "AOR Received Date cannot be in future"),
        },
      },
      {
        type: "input",
        name: "Case_Aging",
        placeholder: "Case Aging",
        maxLength: 16,
        renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Compliance_Time_Left_to_Finish",
        placeholder: "Compliance Time Left to Finish",
        maxLength: 50,
        renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
      },
      
      {
        type: "select",
        name: "Case_Filing_Method",
        placeholder: "Case Filing Method",
        values: caseFilingMethodValues,
        renderTypes: [RenderType.APPEALS],
        validation: {
          [RenderType.APPEALS]: Yup.string().required(
            "Case Filing Method is mandatory",
          ),
        },
      },
      
      
      {
        type: "input",
        name: "Acknowledgment_Timely",
        placeholder: "Acknowledgement Timely",
        maxLength: 16,
        renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
        validation: {
          [RenderType.APPEALS]: Yup.string().required(
            "Case Acknowledgment Timely is mandatory",
          ),
        },
      },
      {
        type: "input",
        name: "Timeframe_Extended",
        placeholder: "Timeframe Extended",
        maxLength: 30,
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "select",
        name: "Timeframe_Extended",
        placeholder: "Timeframe Extended",
        values: timeFrameExtendedValues,
        renderTypes: [RenderType.PROVIDER_DISPUTE],        
      },
      {
        type: "select",
        name: "Case_in_Compliance",
        placeholder: "Case in Compliance",
        values: caseInComplianceValues,
        renderTypes: [RenderType.PROVIDER_DISPUTE],        
      },
      {
        type: "input",
        name: "Case_in_Compliance",
        placeholder: "Case in Compliance",
        maxLength: 30,
        defaultValue: "No",
        renderTypes: [RenderType.APPEALS],
        validation: {
          [RenderType.APPEALS]: Yup.string().required(
            "Case in Compliance is mandatory",
          ),
        },
      },
      {
        type: "input",
        name: "Out_of_Compliance_Reason",
        placeholder: "Out of Compliance Reason",
        maxLength: 30,
        defaultValue: "Case still tf.",
        renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE],
        validation: {
          [RenderType.APPEALS]: Yup.string().required(
            "Out of Compliance Reason is mandatory",
          ),
        },
      },
      
     
      {
        type: "date",
        name: "WOL_Received_Date",
        placeholder: "WOL Received Date",
        label: "WOL Received Date",
        renderTypes: [RenderType.APPEALS],
        validation: {
          [RenderType.APPEALS]: Yup.date()
            .required("WOL Received Date is mandatory")
            .max(new Date(), "WOL Received Date cannot be in future"),
        },
      },
      {
        type: "input",
        name: "Global_Case_ID",
        placeholder: "Global Case ID",
        maxLength: 30,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      // {
      //   type: "input",
      //   name: "Department",
      //   placeholder: "Department",
      //   maxLength: 30,
      //   renderTypes: [RenderType.PROVIDER_DISPUTE],
      // },
      {
        type: "select",
        name: "Department",
        placeholder: "Department",
        values: departmentValues,
        renderTypes: [RenderType.PROVIDER_DISPUTE],        
      },
      {
        type: "input",
        name: "CRM_Ticket_Number",
        placeholder: "CRM Ticket Number",
        maxLength: 30,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "RMS_Ticket_Number",
        placeholder: "RMS Ticket Number",
        maxLength: 30,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      // {
      //   type: "input",
      //   name: "Number_of_Claims_More_Than_10",
      //   placeholder: "Are number of claims more than 10",
      //   maxLength: 30,
      //   renderTypes: [RenderType.PROVIDER_DISPUTE],
      // },

      {
        type: "select",
        name: "Number_of_Claims_More_Than_10",
        placeholder: "Are number of claims more than 10",
        values: noOfClaimsValues,
        renderTypes: [RenderType.PROVIDER_DISPUTE],        
      },
    ].filter((e) => e.renderTypes.includes(renderType));

    const caseTimelinesObject = fields.reduce((acc, field) => {
      acc[field.name] = caseTimelines[field.name] || field.defaultValue;
      return acc;
    }, { caseNumber: caseTimelines.caseNumber });

    setCaseTimelinesFields(fields);
    
    setCaseTimelines(caseTimelinesObject);
    setCaseTimelinesValidationSchema(
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
    caseTimelinesFields,
    caseTimelines,
    caseTimelinesValidationSchema,
    setCaseTimelines,
  };
};
