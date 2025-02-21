import { useEffect, useState } from "react";
import * as Yup from "yup";
import { RenderType } from "./Constants";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useSelector } from "react-redux";

export const useCtmSummary = (renderType) => {
 const { convertToCase } = useGetDBTables();

 const [ctmSummaryFields, setCtmSummaryFields] = useState([]);
 const [ctm_CtmSummary, setctmCtmSummary] = useState({
   caseNumber: ""
 });

const [ctmSummaryValidationSchema, setCtmSummaryValidationSchema] =
   useState(Yup.object().shape({}));

 useEffect(() => {
   const fields = [
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
          options: ["Immediate Need", "Urgent", "Standard"],


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

         validation:{}
       },
       {
         type: "input",
         name: "Contract_ID",
         placeholder: "Contract ID",
         maxLength: 30,

         validation:{}
       },
       {
         type: "input",
         name: "Bene_Identifier",
         placeholder: "Bene Identifier",
         maxLength: 30,

         validation:{}
       },
       {
         type: "input",
         name: "Case_Worker",
         placeholder: "Case Worker",
         maxLength: 30,

         validation:{}
       },
       {
                type: "select",
                name: "Complaint_Category",
                placeholder: "Complaint Category",
                maxLength: 50,
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
                options: ["Yes", "No"],

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
                options: ["Yes", "No"],

                validation:{}
              },
              {
                type: "select",
                name: "Category_Lead",
                placeholder: "Category Lead",
                options: ["CMS", "Plan"],
                validation:{}
              },
              {
                type: "select",
                name: "Complaint_Type",
                placeholder: "Complaint Type",
                options: ["Beneficiary" ,"Provider"],
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

                   validation:{}
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
                       maxLength: 50,


                     },
                     {
                       type: "select",
                       name: "Agent_Broker",
                       placeholder: "Agent Broker",
                       options: ["Yes", "No"],

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
                       options: ["Yes", "No"],

                       validation:{}
                     },
                     {
                       type: "select",
                       name: "Contract_Change_Requests",
                       placeholder: "Contract Change Requests",
                       options: ["Blank","Pending", "Approved", "Rejected"],

                       validation:{}
                     },
                     {
                       type: "select",
                       name: "Issue_Level_Change_Requests",
                       placeholder: "Issue Level Change Requests",
                       options: ["Blank","Pending", "Approved", "Rejected"],

                       validation:{}
                     },
     {
                            type: "select",
                            name: "CMS_Issue_Change_Requests",
                            placeholder: "CMS Issue Change Requests",
                            options: ["Blank","Pending", "Approved", "Rejected"],

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
                            options: ["Yes","No", " Unknown/Unable to Reach"],

                            validation:{}
                          },
                          {
                            type: "select",
                            name: "HPI_Related",
                            placeholder: "HPI Related",
                            options: ["Yes","No", "Unknown/Unsure"],
                            validation:{}
                          },
       {
                                   type: "select",
                                   name: "Resolution_Notification",
                                   placeholder: "Resolution Notification",
                                   options: ["Unknown", "Telephone", "Written", "Telephone and Written", "None"],

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
         .filter((e) => e?.validation?.[renderType])
         .reduce((result, item) => {
           result[item.name] = item.validation[renderType];
           return result;
         }, {}),
     }),
   );
 }, [renderType]);
 return {
   ctmSummaryFields,
   ctm_CtmSummary,
   ctmSummaryValidationSchema,
   setctmCtmSummary,
 };
};
