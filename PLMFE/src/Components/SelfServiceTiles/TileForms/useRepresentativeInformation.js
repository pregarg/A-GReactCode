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
  const masterPDRelationshipSelector = useSelector(
      (state) => state?.masterPDRelationship,
  );
  const masterPDAuthTypeSelector = useSelector(
      (state) => state?.masterPDAuthType,
  );
  const [relationshipValues, setRelationshipValues] = useState([]);
  const [authTypeValues, setAuthTypeValues] = useState([]);

  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const relationship = masterPDRelationshipSelector?.[0] || [];
    setRelationshipValues(
        relationship.map((e) => e.Relationship).map(kvMapper),
    );
    const authType = masterPDAuthTypeSelector?.[0] || [];
    setAuthTypeValues(
        authType.map((e) => e.Auth_Type).map(kvMapper),
    );
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
        type: "select",
        name: "Relationship",
        placeholder: "Relationship",
        values: relationshipValues,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "select",
        name: "Authorization_Type",
        placeholder: "Authorization Type",
        values: authTypeValues,
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
      // {
      //   type: "input",
      //   name: "Current_Alert",
      //   placeholder: "Current Alert",
      //   maxLength: 50,
      //   renderTypes: [RenderType.PROVIDER_DISPUTE],
      //   validation:{}
      // },
      // {
      //   type: "input",
      //   name: "Next_Alert",
      //   placeholder: "Next Alert",
      //   maxLength: 50,
      //   renderTypes: [RenderType.PROVIDER_DISPUTE],
      //   validation:{}
      // },
      // {
      //   type: "input",
      //   name: "Historical_Alert",
      //   placeholder: "Historical Alert",
      //   maxLength: 50,
      //   renderTypes: [RenderType.PROVIDER_DISPUTE],
      //   validation:{}
      // },
      // {
      //   type: "input",
      //   name: "Acknowledge_Alert",
      //   placeholder: "Acknowledge Alert",
      //   maxLength: 50,
      //   renderTypes: [RenderType.PROVIDER_DISPUTE],
      //   validation:{}
      // },
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