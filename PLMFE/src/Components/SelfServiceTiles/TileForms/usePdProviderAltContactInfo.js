import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";

export const usePdProviderAltContactInfo = (renderType) => {

  const [providerAltFields, setProviderAltFields] = useState([]);
  const [pd_ProviderAlt, setpdProviderAlt] = useState({
    caseNumber: ""
  });

  const [providerAltValidationSchema, setProviderAltValidationSchema] =
      useState(Yup.object().shape({}));

  useEffect(() => {
    const fields = [
            {
        type: "input",
        name: "Provider_Contact_Name",
        placeholder: "Provider Contact Name",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },

      {
        type: "input",
        name: "Address_Line_1",
        placeholder: "Address Line 1",
        maxLength: 250,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Address_Line_2",
        placeholder: "Address Line 2",
        maxLength: 250,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Zip_Code",
        placeholder: "Zip Code",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "City",
        placeholder: "City",
        maxLength: 50,
        renderTypes: [ RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "State",
        placeholder: "State",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Alternate_Phone_Number",
        placeholder: "Alternate Phone Number",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Alternate_Fax_number",
        placeholder: "Alternate Fax Number",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Alternate_Email_Address",
        placeholder: "Alternate Email Address",
        maxLength: 30,
        renderTypes: [ RenderType.PROVIDER_DISPUTE],
      },
    ].filter((e) => e.renderTypes.includes(renderType));

    const providerAltObject = fields.reduce((acc, field) => {
      acc[field.name] = pd_ProviderAlt[field.name];
      return acc;
    }, { caseNumber: pd_ProviderAlt.caseNumber });

    setProviderAltFields(fields);
    setpdProviderAlt(providerAltObject);
    setProviderAltValidationSchema(
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
    providerAltFields,
    pd_ProviderAlt,
    providerAltValidationSchema,
    setpdProviderAlt,
  };
};