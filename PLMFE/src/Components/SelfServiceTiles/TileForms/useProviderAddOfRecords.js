import { useEffect, useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import { useSelector } from "react-redux";

export const useProviderAddOfRecords = (renderType) => {
  const { convertToCase } = useGetDBTables();
  const masterPDMailToAddressSelector = useSelector(
    (state) => state?.masterPDMailToAddress,
  );

  const [providerAddRecordFields, setProviderAddRecordFields] = useState([]);
  const [mailToAddressValues, setMailToAddressValues] = useState([]);
  const [pd_ProviderAddRecord, setpdProviderAddRecord] = useState({
    caseNumber: ""
  });

  const [providerAddOfRecordsValidationSchema, setProviderAddOfRecordsValidationSchema] =
      useState(Yup.object().shape({}));

      useEffect(() => {
        const kvMapper = (e) => ({
          label: convertToCase(e),
          value: convertToCase(e),
        });
        const mailToAddress = masterPDMailToAddressSelector?.[0] || [];
        setMailToAddressValues(
          mailToAddress.map((e) => e.Mail_to_Address).map(kvMapper),
        );
      }, []);

  useEffect(() => {
    const fields = [
      {
        type: "select",
        name: "Mail_to_Address",
        placeholder: "Mail to Address?",
        values: mailToAddressValues,
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
        name: "State",
        placeholder: "State",
        maxLength: 30,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
    ].filter((e) => e.renderTypes.includes(renderType));

    const providerAddRecordObject = fields.reduce((acc, field) => {
      acc[field.name] = pd_ProviderAddRecord[field.name];
      return acc;
    }, { caseNumber: pd_ProviderAddRecord.caseNumber });

    setProviderAddRecordFields(fields);
    setpdProviderAddRecord(providerAddRecordObject);
    setProviderAddOfRecordsValidationSchema(
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
    providerAddRecordFields,
    pd_ProviderAddRecord,
    providerAddOfRecordsValidationSchema,
    setpdProviderAddRecord,
  };
};