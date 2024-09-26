import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";

export const useRepresentativeAltContact = (renderType) => {

  const [representativeAltFields, setRepresentativeAltFields] = useState([]);
  const [pd_RepresentativeAltRecord, setpdRepresentativeAltRecord] = useState({
    caseNumber: ""
  });

  const [representativeAltContactValidationSchema, setRepresentativeAltContactValidationSchema] =
      useState(Yup.object().shape({}));

  useEffect(() => {
    const fields = [
      {
        type: "input",
        name: "First_Name",
        placeholder: "First Name",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Last_Name",
        placeholder: "Last Name",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },

      {
        type: "input",
        name: "Relationship",
        placeholder: "Relationship",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Authorization_Type",
        placeholder: "Authorization Type",
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
        name: "Fax_Number",
        placeholder: "Fax Number",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Alternate_Email_Address",
        placeholder: "Alternate Email Address",
        maxLength: 50,
        renderTypes: [ RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Communication_Preference",
        placeholder: "Communication Preference",
        maxLength: 50,
        renderTypes: [ RenderType.PROVIDER_DISPUTE],
      },
    ].filter((e) => e.renderTypes.includes(renderType));

    const representativeAltObject = fields.reduce((acc, field) => {
      acc[field.name] = pd_RepresentativeAltRecord[field.name];
      return acc;
    }, { caseNumber: pd_RepresentativeAltRecord.caseNumber });

    setRepresentativeAltFields(fields);
    setpdRepresentativeAltRecord(representativeAltObject);
    setRepresentativeAltContactValidationSchema(
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
    representativeAltFields,
    pd_RepresentativeAltRecord,
    representativeAltContactValidationSchema,
    setpdRepresentativeAltRecord,

  };
};