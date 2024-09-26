import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";

export const useRepresentativeAddOfRecords = (renderType) => {

  const [representativeAddRecordFields, setRepresentativeAddRecordFields] = useState([]);
  const [pd_RepresentativeAddRecord, setpdRepresentativeAddRecord] = useState({
    caseNumber: ""
  });

  const [representativeAddOfRecordsValidationSchema, setRepresentativeAddOfRecordsValidationSchema] =
      useState(Yup.object().shape({}));

  useEffect(() => {
    const fields = [

      {
        type: "input",
        name: "Mail_to_Address",
        placeholder: "Mail to Address",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Address_Line_1",
        placeholder: "Address Line 1",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Address_Line_2",
        placeholder: "Address Line 2",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Zip_Code",
        placeholder: "Zip Code",
        maxLength: 30,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "City",
        placeholder: "City",
        maxLength: 30,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "State_",
        placeholder: "State",
        maxLength: 30,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
    ].filter((e) => e.renderTypes.includes(renderType));

    const representativeAddRecordObject = fields.reduce((acc, field) => {
      acc[field.name] = pd_RepresentativeAddRecord[field.name];
      return acc;
    }, { caseNumber: pd_RepresentativeAddRecord.caseNumber });

    setRepresentativeAddRecordFields(fields);
    setpdRepresentativeAddRecord(representativeAddRecordObject);
    setRepresentativeAddOfRecordsValidationSchema(
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
    representativeAddRecordFields,
    pd_RepresentativeAddRecord,
    representativeAddOfRecordsValidationSchema,
    setpdRepresentativeAddRecord,
  };
};