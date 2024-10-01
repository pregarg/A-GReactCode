import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import { FormikDatePicker } from "../Common/FormikDatePicker";

export const useRepresentativeInformation = (renderType) => {
  const { convertToCase } = useGetDBTables();
  const masterPDMailToAddressSelector = useSelector(
      (state) => state?.masterPDMailToAddress,
  );
  const [representativeInformationFields, setRepresentativeInformationFields] = useState([]);
  const [representativeInformationObject, setRepresentativeInformationObject] = useState([]);
  const [pd_RepresentativeInformation, setpdRepresentativeInformation] = useState({
    caseNumber: ""
  });

  const [representativeInformationValidationSchema, setRepresentativeInformationValidationSchema] =
      useState(Yup.object().shape({}));


  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const mailToAddress = masterPDMailToAddressSelector?.[0] || [];
    // setMailToAddressValues(
    //     mailToAddress.map((e) => e.Mail_to_Address).map(kvMapper),
    // );
  }, []);



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
        validation:{}
      },
      {
        type: "date",
        name: "Authorization_Approved_Date",
        placeholder: "Authorization Approved Date",
        label: "Authorization Approved Date",
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "date",
        name: "Authorization_Expiration_Date",
        placeholder: "Authorization Expiration Date",
        label: "Authorization Expiration Date",
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Current_Alert",
        placeholder: "Current Alert",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Next_Alert",
        placeholder: "Next Alert",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Historical_Alert",
        placeholder: "Historical Alert",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Acknowledge_Alert",
        placeholder: "Acknowledge Alert",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
    ].filter((e) => e.renderTypes.includes(renderType));

    const representativeInformationObject = fields.reduce((acc, field) => {
      acc[field.name] = pd_RepresentativeInformation[field.name];
      return acc;
    }, { caseNumber: pd_RepresentativeInformation.caseNumber });

    setRepresentativeInformationFields(fields);
    setpdRepresentativeInformation(representativeInformationObject);
    setRepresentativeInformationValidationSchema(
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
    representativeInformationFields,
    pd_RepresentativeInformation,
    representativeInformationValidationSchema,
    setpdRepresentativeInformation,
  };
};