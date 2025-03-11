import { useEffect, useState } from "react";
import * as Yup from "yup";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";
import { CTM_DATA } from "../../../data/ctmData";

export const useCtmSummary = () => {
 const { convertToCase } = useGetDBTables();
const [ctmIssueLevelValues, setCtmIssueLevelValues] = useState([]);
const [ctmCategoryLeadValues, setCtmCategoryLeadValues] = useState([]);
const [ctmComplaintTypeValues, setCtmComplaintTypeValues] = useState([]);
const [ctmDropDownValues, setCtmDropDownValues] = useState([]);
const [ctmComplainantSatisfiedValues, setCtmComplainantSatisfiedValues] = useState([]);
const [ctmChangeRequestsValues, setCtmChangeRequestsValues] = useState([]);
const [ctmHPIRelatedValues, setCtmHPIRelatedValues] = useState([]);
const [ctmResolutionNotificationValues, setCtmResolutionNotificationValues] = useState([]);
 const [ctmSummaryFields, setCtmSummaryFields] = useState([]);
 const masterCtmIssueLevelSelector = useSelector(
     (state) => state?.masterCtmIssueLevel,
   );
   const [ctmSummaryValidationSchema, setCtmSummaryValidationSchema] =
     useState(Yup.object().shape({}));
   const masterCtmCategoryLeadSelector = useSelector(
        (state) => state?.masterCtmCategoryLead,
      );
    const masterCtmChangeRequestsSelector = useSelector(
           (state) => state?.masterCtmChangeRequests,
         );
const masterCtmComplainantSatisfiedSelector = useSelector(
           (state) => state?.masterCtmComplainantSatisfied,
         );
      const angPrefSelector = useSelector(
        (state) => state?.masterAngPreferredLanguage,
      );
const masterCtmHPIRelatedSelector = useSelector(
           (state) => state?.masterCtmHPIRelated,
         );
const masterCtmResolutionNotificationSelector = useSelector(
           (state) => state?.masterCtmResolutionNotification,
         );
    const masterCtmComplaintTypeSelector = useSelector(
           (state) => state?.masterCtmComplaintType,
         );
  const masterCtmDropDownSelector = useSelector(
       (state) => state?.masterCtmDropDown,
     );
 const [ctm_CtmSummary, setctmCtmSummary] = useState({
   caseNumber: ""
 });
const kvMapper = (e) => ({
      label: e,
      value: e,
    });

 useEffect(() => {
 const ctmData = CTM_DATA;

     const categoryValues = Object.keys(ctmData).map(kvMapper)

     const issueLevel = masterCtmIssueLevelSelector?.[0] || [];
      const issueLevelValues =issueLevel.map((e) => e.Issue_Level).map(kvMapper);

const categoryLead = masterCtmCategoryLeadSelector?.[0] || [];
      const categoryLeadValues =categoryLead.map((e) => e.Category_Lead).map(kvMapper);

   const ctmComplaintType = masterCtmComplaintTypeSelector?.[0] || [];
         const ctmComplaintTypeValues =ctmComplaintType.map((e) => e.Complaint_Type).map(kvMapper);

const ctmHPIRelated = masterCtmHPIRelatedSelector?.[0] || [];
         const ctmHPIRelatedValues =ctmHPIRelated.map((e) => e.HPI_Related).map(kvMapper);

 const ctmChangeRequests = masterCtmChangeRequestsSelector?.[0] || [];
  const ctmChangeRequestsValues =ctmChangeRequests.map((e) => e.Change_Requests).map(kvMapper);

const ctmComplainantSatisfied = masterCtmComplainantSatisfiedSelector?.[0] || [];
  const ctmComplainantSatisfiedValues =ctmComplainantSatisfied.map((e) => e.Complainant_Satisfied).map(kvMapper);

const ctmResolutionNotification = masterCtmResolutionNotificationSelector?.[0] || [];
  const ctmResolutionNotificationValues =ctmResolutionNotification.map((e) => e.Resolution_Notification).map(kvMapper);

        const angPref = angPrefSelector?.[0] || [];
                   const preferredLanguageValues =angPref.map((e) => e.Preferred_Language).map(kvMapper);


         const ctmDropDown = masterCtmDropDownSelector?.[0] || [];
       const ctmDropDownValues =ctmDropDown.map((e) => e.Drop_Down).map(kvMapper);

   const fields = [
//       {
//               type: "subtitle",
//               name: "CTM_File_Information",
//               placeholder: "CTM File Information",
//           },

       {
         type: "input",
         name: "Complaint_ID",
         placeholder: "Complaint ID",
         maxLength: 50,



       },
       {
          type: "select",
          name: "Issue_Level",
          placeholder: "Issue Level",
          values:issueLevelValues,



       },
       {
               type: "date",
               name: "Assignment_Date",
               placeholder: "Assignment Date",
               label: "Assignment Date",

             },
       {
         type: "input",
         name: "Contact_First_Name",
         placeholder: "Contact First Name",
         maxLength: 50,


       },
       {
         type: "input",
         name: "Contact_Last_Name",
         placeholder: "Contact Last Name",
         maxLength: 50,

       },
       {
         type: "input",
         name: "Contract_ID",
         placeholder: "Contract ID",
         maxLength: 30,

       },
       {
         type: "input",
         name: "Bene_Identifier",
         placeholder: "Bene Identifier",
         maxLength: 30,

       },
       {
         type: "input",
         name: "Case_Worker",
         placeholder: "Case Worker",
         maxLength: 30,

       },
       {
                type: "select",
                name: "Complaint_Category",
                placeholder: "Complaint Category",
                maxLength: 50,
                values: categoryValues,

              },
              {
                type: "select",
                name: "Complaint_SubCategory",
                placeholder: "Complaint SubCategory",
                maxLength: 50,


              },
              {
                type: "select",
                name: "Attachments",
                placeholder: "Attachments",
                values:ctmDropDownValues

              },
              {
                type: "date",
                name: "Resolution_Date",
                placeholder: "Resolution Date",
                label: "Resolution Date",
                defaultValue: new Date(),

              },
              {
                type: "select",
                name: "Congressional",
                placeholder: "Congressional",
                values:ctmDropDownValues,

                validation:{}
              },
              {
                type: "select",
                name: "Category_Lead",
                placeholder: "Category Lead",
                values:categoryLeadValues ,
                validation:{}
              },
              {
                type: "select",
                name: "Complaint_Type",
                placeholder: "Complaint Type",
                values:ctmComplaintTypeValues ,
                validation:{}
              },
    {
                   type: "input",
                   name: "Congressional_Information",
                   placeholder: "Congressional Information",
                   maxLength: 50,
                 },
                 {
                   type: "input",
                   name: "Complaint_Summary",
                   placeholder: "Complaint Summary",
                   maxLength: 50,


                 },
                 {
                   type: "input",
                   name: "CMS_Comments",
                   placeholder: "CMS Comments",
                   maxLength: 50,

                 },
                 {
                 type: "date",
                                 name: "Received_Date",
                                 placeholder: "Received Date",
                                 label: "Received Date",
                                 defaultValue: new Date(),


                 },
                 {
                   type: "input",
                   name: "Contact_Phone_Number",
                   placeholder: "Contact Phone Number",
                   maxLength: 30,

                   validation:{}
                 },
                 {
                   type: "input",
                   name: "Complaint_SubCategory_Other",
                   placeholder: "Complaint SubCategory Other",
                   maxLength: 30,

                   validation:{}
                 },
                 {
                   type: "input",
                   name: "Preferred_Call_Time",
                   placeholder: "Preferred Call Time",
                   maxLength: 30,

                   validation:{}

                },
    {
                       type: "input",
                       name: "Alternate_Phone_Number",
                       placeholder: "Alternate Phone Number",
                       maxLength: 50,
                     },
                     {
                       type: "select",
                       name: "Preferred_Language",
                       placeholder: "Preferred Language",
                        values: preferredLanguageValues,
                       maxLength: 50,


                     },
                     {
                       type: "select",
                       name: "Agent_Broker",
                       placeholder: "Agent Broker",
                       values:ctmDropDownValues

                     },
                     {
                       type: "input",
                       name: "Agent_Broker_Information",
                       placeholder: "Agent Broker Information",
                       maxLength: 50,

                       validation:{}
                     },
                     {
                       type: "select",
                       name: "Contact_Plan_Before_Complaint_Entered",
                       placeholder: "Contact Plan Before Complaint Entered",
                       values:ctmDropDownValues,

                       validation:{}
                     },
                     {
                       type: "select",
                       name: "Contract_Change_Requests",
                       placeholder: "Contract Change Requests",
                       values:ctmChangeRequestsValues,
                       validation:{}
                     },
                     {
                       type: "select",
                       name: "Issue_Level_Change_Requests",
                       placeholder: "Issue Level Change Requests",
                       values:ctmChangeRequestsValues,

                       validation:{}
                     },
     {
                            type: "select",
                            name: "CMS_Issue_Change_Requests",
                            placeholder: "CMS Issue Change Requests",
                            values:ctmChangeRequestsValues,

                          },
                          {
                            type: "input",
                            name: "CMS_Plan_Casework_Notes",
                            placeholder: "CMS Plan Casework Notes",
                            maxLength: 50,

                            validation:{}
                          },
                          {
                            type: "input",
                            name: "Resolution_Summary",
                            placeholder:"Resolution Summary",
                            maxLength: 30,

                            validation:{}
                          },
                          {
                            type: "select",
                            name: "Complainant_Satisfied",
                            placeholder: "Complainant Satisfied",
                           values:ctmComplainantSatisfiedValues,
                            validation:{}
                          },
                          {
                            type: "select",
                            name: "HPI_Related",
                            placeholder: "HPI Related",
                            values:ctmHPIRelatedValues,
                            validation:{}
                          },
       {
                                   type: "select",
                                   name: "Resolution_Notification",
                                   placeholder: "Resolution Notification",
                                    values:ctmResolutionNotificationValues,

                                   validation:{}
                                 },

     ];

   const ctmSummaryObject = fields.reduce((acc, field,) => {
       acc[field.name] = ctm_CtmSummary[field.name];
       return acc;
     }, { caseNumber: ctm_CtmSummary.caseNumber });

   setCtmSummaryFields(fields);
   setctmCtmSummary(ctmSummaryObject);
   setCtmSummaryValidationSchema(
     Yup.object().shape({
       ...fields
         .filter((e) => e?.validation)
         .reduce((result, item) => {
           result[item.name] = Object.values(item.validation)[0];
           return result;
         }, {}),
     })
   );


}, []);
 return {
   ctmSummaryFields,
   ctm_CtmSummary,
   ctmSummaryValidationSchema,
   setctmCtmSummary,
   setCtmSummaryFields
 };
};
