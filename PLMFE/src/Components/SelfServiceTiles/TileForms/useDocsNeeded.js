import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";

export const useDocsNeeded = (renderType) => {
  const { convertToCase } = useGetDBTables();
  
  const [docsNeededValues, setDocsNeededValues] = useState([]);
  const [requestedFromValues, setRequestedFromValues] = useState([]);
  const [neededByValues, setNeededByValues] = useState([]);

  const masterAngDocNeededSelector = useSelector(
    (state) => state?.masterAngDocNeeded,
  );
  const masterAngRequestedFromSelector = useSelector(
    (state) => state?.masterAngRequestedFrom,
  );
  const masterAngNeededBySelector = useSelector(
    (state) => state?.masterAngNeededBy,
  );
  const [docsNeededFields, setdocsNeededFields] = useState([]);
  const [docsNeeded, setdocsNeeded] = useState({
    caseNumber: "",
  });
  const [docsNeededValidationSchema, setdocsNeededValidationSchema] =
    useState(Yup.object().shape({}));

    useEffect(() => {
        const kvMapper = (e) => ({
          label: convertToCase(e),
          value: convertToCase(e),
        });
        const docsNeeded = masterAngDocNeededSelector?.[0] || [];
        setDocsNeededValues(
            docsNeeded.map((e) => e.Doc_Needed).map(kvMapper),
        );
        const requestedFrom = masterAngRequestedFromSelector?.[0] || [];
        setRequestedFromValues(
            requestedFrom.map((e) => e.Requested_From).map(kvMapper),
        );
        const neededBy =masterAngNeededBySelector?.[0] || [];
        setNeededByValues(
            neededBy.map((e) => e.Needed_By).map(kvMapper),
        );
        
    }, []);
    



  useEffect(() => {
    const fields = [
      {
        type: "select",
        name: "Doc_Needed",
        placeholder: "Doc Needed",
        values: docsNeededValues,
        renderTypes: [RenderType.APPEALS]

      },
      {
        type: "input",
        name: "Doc_Number",
        placeholder: "Doc Number",
        maxLength: 50,
        renderTypes: [RenderType.APPEALS],
      },
      {
        type: "select",
        name: "Requested_From",
        placeholder: "Requested From",
        values: requestedFromValues,
        renderTypes: [RenderType.APPEALS]

      },
      {
        type: "select",
        name: "Needed_By",
        placeholder: "Needed By",
        values: neededByValues,
        renderTypes: [RenderType.APPEALS]

      },
      {
        type: "input",
        name: "Requested_By",
        placeholder: "Requested By",
        maxLength: 50,
        renderTypes: [RenderType.APPEALS]

      },
      {
        type: "date",
        name: "Request_Date",
        placeholder: "Request Date",
        label: "Request Date",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Follow_Up_Date1",
        placeholder: "Follow-Up Date1",
        label: "Follow-Up Date1",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Follow_Up_Date2",
        placeholder: "Follow-Up Date2",
        label: "Follow-Up Date2",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Due_Date",
        placeholder: "Due Date",
        label: "Due Date",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    {
        type: "date",
        name: "Received_Date",
        placeholder: "Received Date",
        label: "Received Date",
        //defaultValue: new Date(),
        renderTypes: [RenderType.APPEALS],
       
    },
    ].filter((e) => e.renderTypes.includes(renderType));

    const docsNeededObject = fields.reduce((acc, field) => {
      acc[field.name] = docsNeeded[field.name] || field.defaultValue;
      return acc;
    }, { caseNumber: docsNeeded.caseNumber });

    setdocsNeededFields(fields);
    
    setdocsNeeded(docsNeededObject);
    setdocsNeededValidationSchema(
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
    docsNeededFields,
    docsNeeded,
    docsNeededValidationSchema,
    setdocsNeeded,
  };
};
