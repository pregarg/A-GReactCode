import { useEffect, useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import { useSelector } from "react-redux";

export const useProviderRedirectTo = (renderType) => {
  const { convertToCase } = useGetDBTables();
  const masterPDMailToAddressSelector = useSelector(
    (state) => state?.masterPDMailToAddress,
  );

  const [providerRedirectToFields, setProviderRedirectToFields] = useState([]);
  const [mailToAddressValues, setMailToAddressValues] = useState([]);
  const [pd_ProviderRedirectTo, setpdProviderRedirectTo] = useState({
    caseNumber: ""
  });

  const [providerRedirectToValidationSchema, setProviderRedirectToValidationSchema] =
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
        name: "Department_Assigned_To",
        placeholder: "Department Assigned To",
        values: mailToAddressValues,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        // validation: {
        //   [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
        //       "Mail to Address is mandatory",
        //   ),
        // },
      },
      {
        type: "input",
        name: "Email_Id",
        placeholder: "Email Id",
        maxLength: 100,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        // validation: {
        //   [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
        //       "Address Line 1 is mandatory",
        //   ),
        // },
      },

    ].filter((e) => e.renderTypes.includes(renderType));

    const providerRedirectToObject = fields.reduce((acc, field) => {
      acc[field.name] = pd_ProviderRedirectTo[field.name];
      return acc;
    }, { caseNumber: pd_ProviderRedirectTo.caseNumber });

    setProviderRedirectToFields(fields);
    setpdProviderRedirectTo(providerRedirectToObject);
    setProviderRedirectToValidationSchema(
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
    providerRedirectToFields,
    pd_ProviderRedirectTo,
    providerRedirectToValidationSchema,
    setpdProviderRedirectTo,
  };
};