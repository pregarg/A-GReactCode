import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";

export const useMemberAltContactInfo = (renderType) => {
  
  const { convertToCase } = useGetDBTables();
  const [memberAltFields, setmemberAltFields] = useState([]);
  const [pd_MemberAltInfo, setpdMemberAltInfo] = useState({
    caseNumber: "",
  });
  const [memberAltValidationSchema, setMemberAltValidationSchema] =
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
      const commPref = masterPDCommPrefSelector?.[0] || [];
      setCommPrefValues(
        commPref.map((e) => e.Comm_Pref).map(kvMapper),
      );
    }, []);
  
    

  useEffect(() => {
    const fields = [
        {
          type: "input",
          name: "Issue_Number",
          placeholder: "Issue Number",
          maxLength: 50,
          renderTypes: [RenderType.PROVIDER_DISPUTE],
          validation: {
            [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
                "Issue Number is mandatory",
            ),
          },
        },
      
        {
          type: "input",
          name: "Address_Line_1",
          placeholder: "Address Line 1",
          maxLength: 50,
          renderTypes: [RenderType.PROVIDER_DISPUTE],
          validation: {
            [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
                "Address_Line_1 is mandatory",
            ),
          },
        },
        {
          type: "input",
          name: "Address_Line_2",
          placeholder: "Address Line 2",
          maxLength: 50,
          renderTypes: [RenderType.PROVIDER_DISPUTE],
        },
        {
          type: "input",
          name: "Zip_Code",
          placeholder: "Zip Code",
          maxLength: 30,
          renderTypes: [RenderType.PROVIDER_DISPUTE],
          validation: {
            [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
                "Zip Code is mandatory",
            ),
          },
        },
        {
          type: "input",
          name: "City",
          placeholder: "City",
          maxLength: 30,
          renderTypes: [ RenderType.PROVIDER_DISPUTE],
          validation: {
            [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
                "City is mandatory",
            ),
          },
        },
        {
          type: "input",
          name: "State_",
          placeholder: "State",
          maxLength: 30,
          renderTypes: [RenderType.PROVIDER_DISPUTE],
          validation: {
            [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
                "State is mandatory",
            ),
          },
        },
        {
            type: "input",
            name: "Alternate_Phone_Number",
            placeholder: "Alternate Phone Number",
            maxLength: 50,
            renderTypes: [RenderType.PROVIDER_DISPUTE],
          validation: {
            [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
                "Alternate Number is mandatory",
            ),
          },
          },
          {
            type: "input",
            name: "Fax_Number",
            placeholder: "Fax Number",
            maxLength: 30,
            renderTypes: [RenderType.PROVIDER_DISPUTE],
            validation: {
              [RenderType.PROVIDER_DISPUTE]: Yup.string().required(
                  "Fax Number is mandatory",
              ),
            },
          },
          {
            type: "input",
            name: "Alternate_Email_Address",
            placeholder: "Alternate Email Address",
            maxLength: 30,
            renderTypes: [ RenderType.PROVIDER_DISPUTE],
          },
          {
            type: "select",
            name: "Communication_Preference",
            placeholder: "Communication Preference",
            values: commPrefValues,
            renderTypes: [RenderType.PROVIDER_DISPUTE],
            validation:{}
          },
      ].filter((e) => e.renderTypes.includes(renderType));

    const memberAltObject = fields.reduce((acc, field) => {
      acc[field.name] = pd_MemberAltInfo[field.name] || field.defaultValue;
      return acc;
    }, { caseNumber: pd_MemberAltInfo.caseNumber });

    setmemberAltFields(fields);
    
    setpdMemberAltInfo(memberAltObject);
    setMemberAltValidationSchema(
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
    memberAltFields,
    pd_MemberAltInfo,
    memberAltValidationSchema,
    setpdMemberAltInfo,
  };
};
