import React, { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import { FormikDatePicker } from "../Common/FormikDatePicker";

export const useProviderInformation = (renderType) => {
  const { convertToCase } = useGetDBTables();
  const masterPDMailToAddressSelector = useSelector(
      (state) => state?.masterPDMailToAddress,
  );
  const [providerInformationFields, setProviderInformationFields] = useState([]);
  const [providerInformationObject, setProviderInformationObject] = useState([]);
  const [pd_ProviderInformation, setpdProviderInformation] = useState({
    caseNumber: ""
  });

  const [providerInformationValidationSchema, setProviderInformationValidationSchema] =
      useState(Yup.object().shape({}));
      const masterPDCommPrefSelector = useSelector(
        (state) => state?.masterPDCommPref,
      );
      const [commPrefValues, setCommPrefValues] = useState([]);

  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const mailToAddress = masterPDMailToAddressSelector?.[0] || [];
    // setMailToAddressValues(
    //     mailToAddress.map((e) => e.Mail_to_Address).map(kvMapper),
    // );
    const commPref = masterPDCommPrefSelector?.[0] || [];
      setCommPrefValues(
        commPref.map((e) => e.Comm_Pref).map(kvMapper),
      );
  }, []);



  useEffect(() => {
    const fields = [
      {
        type: "input",
        name: "Provider_ID",
        placeholder: "Provider ID",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "Provider_Name",
        placeholder: "Provider Name",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        // validation: {
        //   [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
        //       "Provider Name is mandatory",
        //   ),
        // },
      },
      {
        type: "input",
        name: "Provider_TIN",
        placeholder: "Provider TIN",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
      },
      {
        type: "input",
        name: "NPI_ID",
        placeholder: "NPI #",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "PR_Representative",
        placeholder: "PR Representative",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Provider_Vendor_Specialty",
        placeholder: "Provider/Vendor Specialty",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Provider_Vendor_Specialty_Description",
        placeholder: "Specialty Description",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "date",
        name: "Provider_Par_Date",
        placeholder: "Provider Par Date ",
        label: "Provider Par Date ",
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },

      {
        type: "input",
        name: "Participating_Provider",
        placeholder: "Participating Provider",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Vendor_ID",
        placeholder: "Vendor ID",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Vendor_Name",
        placeholder: "Vendor Name",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "select",
        name: "Communication_Preference",
        placeholder: "Communication Preference",
        values: commPrefValues,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Portal_Enrolled",
        placeholder: "Portal Enrolled ",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Provider_IPA",
        placeholder: "Provider IPA",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Phone_Number",
        placeholder: "Phone Number",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Email_Address",
        placeholder: "Email Address",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Fax_Number",
        placeholder: "Fax Number ",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Provider_Type",
        placeholder: "Provider Type",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "Sequential_Provider_ID",
        placeholder: "Seq Provider ID",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      {
        type: "input",
        name: "ACHHS_Provider_ID",
        placeholder: "ACHHS Provider ID ",
        maxLength: 50,
        renderTypes: [RenderType.PROVIDER_DISPUTE],
        validation:{}
      },
      // {
      //   type: "input",
      //   name: "Provider_Alert",
      //   placeholder: "Provider Alert",
      //   maxLength: 50,
      //   renderTypes: [RenderType.PROVIDER_DISPUTE],
      //   validation:{}
      // },
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

    const providerInformationObject = fields.reduce((acc, field) => {
      acc[field.name] = pd_ProviderInformation[field.name];
      return acc;
    }, { caseNumber: pd_ProviderInformation.caseNumber });

    setProviderInformationFields(fields);
    setpdProviderInformation(providerInformationObject);
    setProviderInformationValidationSchema(
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
    providerInformationFields,
    pd_ProviderInformation,
    providerInformationValidationSchema,
    setpdProviderInformation,
  };
};