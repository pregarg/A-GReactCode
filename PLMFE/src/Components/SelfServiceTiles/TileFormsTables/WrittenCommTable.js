import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";
import { useAxios } from "../../../api/axios.hook";
import ReactDatePicker from "react-datepicker";
import DocumentViewer from "../../CommonComponents/DocumentViewer.js"
import useSwalWrapper from "../../../Components/SweetAlearts/hooks";
import axios from 'axios';

export default function WrittenCommTable({
  writtenCommGridData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridDateChange,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  selectJson,
  lockStatus,
  editTableRows,
  gridFieldTempState,
  validationSchema,
  providerInformationGrid,
  setGridFieldTempState,
  memberInformation,
  // saveAndExit,
  props
}) {
  console.log("writtenCommGridData", props)
  console.log("savenExit--->", props.saveAndExit)
  WrittenCommTable.displayName = "WrittenCommTable";
  const [dataIndex, setDataIndex] = useState();
  const { customAxios, fileUpDownAxios } = useAxios();

  const [validationErrors, setValidationErrors] = useState({});

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const [providerSelected, setProviderSelected] = useState(false);
  const [memberSelected, setMemberSelected] = useState(false);

  const [isTouched, setIsTouched] = useState({});
  const [disabledRows, setDisabledRows] = useState({});
  const { getGridJson,getTableDetails, convertToCase } = useGetDBTables();
 
 
  const [writtenCommTypeValues, setwrittenCommTypeValues] = useState([]);
  const [communicationTypeValues, setcommunicationTypeValues] = useState([]);
  const [nameDescriptionValues, setnameDescriptionValues] = useState([]);
  const [mailingMethodValues, setmailingMethodValues] = useState([]);
  const [communicationWithValues, setcommunicationWithValues] = useState([]);
  const [memberProviderListValues, setmemberProviderListValues] = useState([]);
  const [showLoader, setShowLoader] = useState(false);
  

  const token = useSelector((state) => state.auth.token);
  const { esignAxios } = useAxios();
  let prop = useLocation();
  console.log("prop value--> ", prop)
  const Swal = useSwalWrapper();
  const [docViewDialog, setDocViewDialog] = useState({
    open: false,
    url: "",
    fileName: "",
    fileType: "",
  });
  // console.log("8527504487-->",prop)
  // console.log("9910514170-->",props)
  // const [caseInformationData, setCaseInformationData] = useState(
  //   props.caseInformationData,
  // );

  // console.log("caseheder inside written comm--->", props.handleData.Case_Received_Date   );
  // console.log("caseInformationData inside written comm--->",  props.caseInformationData);
  // console.log("caseTimelinesData inside written comm--->", props.caseTimelinesData.Case_Received_Date );
  // console.log("claimInformationData inside written comm--->", props.handleClaimInformationGridData);
  // console.log("authinformation inside written comm--->", props.handleAuthorizationInformationGridData
  // );
  const authSelector = useSelector((state) => state.auth);
  console.log("authSelector123--->",authSelector)
  

  const masterAngWrittenCommTypeSelector = useSelector(
    (state) => state?.masterAngWrittenCommType,
  );
  const masterAngCommunicationTypeSelector = useSelector(
    (state) => state?.masterAngCommType,
  );
  const masterAngNameDescriptionSelector = useSelector(
    (state) => state?.masterAngNameDescription,
  );

  const masterAngMailingMethodSelector = useSelector(
    (state) => state?.masterAngMailingMethod,
  );
  const masterAngCommunicationWithSelector = useSelector(
    (state) => state?.masterAngCommWith,
  );
  const masterAngMemberProviderListSelector = useSelector(
    (state) => state?.masterAngMemberProviderList,
  );


  // useEffect(() => {
  //   if(memberSelected) {
  //     let tempInput = { ...gridFieldTempState };
    
  //     //providerInformationGrid
  //     tempInput['Member_Provider_List'] =  memberInformation.Member_First_Name + ' ' + memberInformation.Member_Last_Name;
  //     setGridFieldTempState(tempInput);
  //   } else {

  //     if(providerSelected) {
  //       let tempInput = { ...gridFieldTempState };
  //       console.log(providerInformationGrid)
      
  //       const provisingRow = providerInformationGrid.find(pg => pg.Provider_Type === 'PROVISIONING')
  //     let providerName = ''
  //       if(provisingRow) {
  //     providerName = provisingRow['Provider_Name']
      
  //       } else {
  //         if(providerInformationGrid?.length > 0) {
  //           providerName = providerInformationGrid?.[0]?.['Provider_Name']
      
  //         }
      
  //       }
      
  //       //providerInformationGrid
  //       tempInput['Member_Provider_List'] = providerName;
  //       setGridFieldTempState(tempInput);
  //     }  else {
      
  //     let tempInput = { ...gridFieldTempState };
    
    
  //     tempInput['Member_Provider_List'] = '';
  //     setGridFieldTempState(tempInput);
  //   }
  // }
  //     }, [memberSelected, providerSelected])
  
 
useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const writtenCommType = masterAngWrittenCommTypeSelector?.[0] || [];
    setwrittenCommTypeValues(
      writtenCommType.map((e) => e.Written_Comm_Type).map(kvMapper),
    );
    // const communicationType = masterAngCommunicationTypeSelector?.[0] || [];
    // setcommunicationTypeValues(
    //     communicationType.map((e) => e.Communication_Type).map(kvMapper),
    // );
    // const nameDescription =masterAngNameDescriptionSelector?.[0] || [];
    // setnameDescriptionValues(
    //     nameDescription.map((e) => e.Needed_By).map(kvMapper),
    // );

    const mailingMethod = masterAngMailingMethodSelector?.[0] || [];
    setmailingMethodValues(
        mailingMethod.map((e) => e.Mailing_Method).map(kvMapper),
    );
    // const communicationWith = masterAngCommunicationWithSelector?.[0] || [];
    // setcommunicationWithValues(
    //     communicationWith.map((e) => e.Communication_With).map(kvMapper),
    // );
    // const memberProviderList =masterAngMemberProviderListSelector?.[0] || [];
    // setnameDescriptionValues(
    //     memberProviderList.map((e) => e.Needed_By).map(kvMapper),
    // );
    
}, []);
const getLetterStatus = async () => {
  let getApiJson = {};
  getApiJson["tableNames"] = getTableDetails()["LetterStatusTable"];
  getApiJson["whereClause"] = { CaseNumber: prop.state.caseNumber };

  try {
    const res = await customAxios.post("/generic/get", getApiJson, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const apiState = res.data.data.docuSignData;
    console.log("letter data-->", apiState);

    if (!apiState || apiState.length === 0) {
      alert("No letter data found.");
      return null;
    }
    const sortedData = apiState.sort((a, b) => b.SNO - a.SNO);
    const lastLetterData = sortedData[0];
    // const lastLetterData = apiState[apiState.length - 1];
    console.log("Last letter data: ", lastLetterData);
    const caseNumber = lastLetterData.CaseNumber
    const documentName = lastLetterData.outputFileName;
    const docUploadPath = "C:/Harshit Sharma/WorkitemDocuments/" +prop.state.caseNumber + "/Draft Contract/" +documentName;
    const documentType = lastLetterData.outputFileName.split(".").pop()
    console.log("fileType--->",documentType);
    console.log("fileName--->",documentName);
    return { caseNumber,documentName, docUploadPath, documentType};

  } catch (error) {
    console.error("API request error:", error);
    alert("An error occurred while fetching case status.");
    return null;
  }
};

let restrictedFileTypes = ["xls", "eps", "sql", "xlsx", "docx"];
const downloadedfileBlob = (index, letterData) => {
  const { caseNumber, documentType, documentName, docUploadPath } = letterData;
  if (!caseNumber && !documentType && !documentName) {
    Swal.fire({
      icon: "error",
      title: "Please Upload The File First",
    });
    return;
  }
  const caseId = Number(prop.state.caseNumber) ?? 0; 
  const fileData = new FormData();
  if (docUploadPath !== undefined) {
    fileData.append("downloadFilePath", docUploadPath);
  }
  fileData.append("caseNumber", caseId);
  fileData.append("docType", documentType);
  fileData.append("docName", documentName);

  fileUpDownAxios
    .post("/downloadFile", fileData, { responseType: "blob" })
    .then((response) => {
      console.log("URL--->",response)
      const docName = documentName;
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const lastIndex = docName.lastIndexOf(".");
      const fileType = docName.slice(lastIndex + 1);
      if (restrictedFileTypes.includes(fileType)) {
        Swal.fire({
          icon: "error",
          title: "This FileType Is Not Visible In The Browser",
        });
        return;
      }

      setDocViewDialog({
        ...docViewDialog,
        open: true,
        fileName: documentName,
        fileType: fileType,
        url: url,
      });
    })
    .catch((err) => {
      console.log("Caught in download file: ", err);
      alert("Failed to download File");
    });
};

const callESignOperationApi = (esignOption,index) => {
  let condition4 = props.caseInformationData.Appellant_Type; 
  console.log("condition4--->", condition4)
  console.log("index value-->", index)
  if (props.caseInformationData.Product === 'MEDICAID') {
      condition4 = props.caseInformationData.Line_of_Business_LOB; 
  }
  let esignApiJson = {
    caseNumber: Number(prop.state.caseNumber),
    transType: prop.state.formNames,
    condition1: props.caseInformationData.Product,
    condition2: props.caseInformationData.Appeal_Type,
    condition3: prop.state.formNames,
    condition4: condition4,
    userId: Number(authSelector.userId),
    option: esignOption,
  };

  console.log("esign api json ", esignApiJson);
  setShowLoader(true);
    esignAxios.post("/esignOperations", esignApiJson).then((res) => {
      console.log("esign rep-->", res);
      setShowLoader(false);

      const result = res.data.split("~");
      console.log("result value from /esign api", result);
    

      if (result[0].includes("Letter Generated Successfully")) {
        setDisabledRows((prev) => ({ ...prev, [index]: true }));
        // const dateString = result[0]; // "Letter Generated Successfully 02/13/2025 13:39:03"
        // const time = dateString.split(" ")[dateString.split(" ").length - 1];
    
        // console.log("Extracted time:", time);
        if (props.memberInformation.Email_ID === ""){
          alert ("Member Email is not present")
          return;
        }
        //gridRowsFinalSubmit()
        generateTemplate(prop); 
        alert(result[0]);

      } else {
        alert("Error in generating letter");
      }
     // gridRowsFinalSubmit("WrittenCommTable",index,"Add")
    }).catch((error) => {
      // Catch any errors from the API request
      console.error("Error calling /esignOperations:", error);
      alert("An error occurred while processing the request");
      setShowLoader(false);
    });
 //}
};
 const generateTemplate = (prop) => {


  console.log("generateTemplate", prop);
  let procInput = {};
  procInput.option = "SENDMAIL";
  procInput.Type = prop.state.stageName;
  procInput.CaseNumber = prop.state.caseNumber;
  procInput.UserName = prop.state.userName;
  
 
  console.log("SEND MAIL Input", procInput);
  customAxios
    .post("/generic/callProcedure", procInput, {
      headers: { Authorization: `Bearer ${token}` },
    })
    .then((res) => {
      console.log("SEND MAIL Proc output: ", res);
      if (res.status === 200) {
        console.log("SEND MAIL Proc executed successully");
      }
    })
    .catch((err) => {
      console.log("Caught in update SEND MAIL api call: ", err.message);
      alert("Error occured in SEND MAIL proc");
    });
};

useEffect(() => {
  try {
    setValidationErrors([]);
    validationSchema.validateSync(gridFieldTempState, { abortEarly: false });
  } catch (errors) {
    const validationErrors = errors.inner?.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
    console.log(
      "errors were encountered in writtern communication table",
      validationErrors,
    );
    setValidationErrors(validationErrors);
  }
}, [gridFieldTempState]);
  

  const tableFields = [
    //"Letter_Trigger_Type",
    "Communication_Type",
    "Name_Description",
    "Mailing_Method",
    // "Mail_Tracking_Number",
    // "Communication_With",
    // "Member_Provider_List",
    "Communication_Request_Date",
    "Communication_Sent_Date_Time",
    "Communication_Logs",
    //"External_Source_ID",
    // "CCM_Status",
    "Generated_By",
    "View"
  ];


 
  const renderSimpleInputField = (name, label, maxLength, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleInputField
          name={name}
          label={label}
          maxLength={maxLength}
          data={gridFieldTempState}
          validationErrors={validationErrors}
          onChange={(event) =>
            handleGridFieldChange(
              index,
              event,
              WrittenCommTable.displayName,
            )
          }
        />
      </div>
    );
  };
 
  const renderSimpleSelectField = (name, label, options, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleSelectField
          name={name}
          label={label}
          options={options}
          data={gridFieldTempState}
          validationErrors={validationErrors}
          onChange={(selectValue, event) => {
            setProviderSelected(false)
            setMemberSelected(false)
            if(selectValue === 'PROVIDER' && event.name ==='Communication_With') {
              setProviderSelected(true)
            }
            if(selectValue === 'MEMBER' && event.name ==='Communication_With') {
              setMemberSelected(true)
            }
            handleGridSelectChange(
              index,
              selectValue,
              event,
              WrittenCommTable.displayName,
            )
          }
           
          }
        />
      </div>
    );
  };
  const renderSimpleDatePickerField = (name, label, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleDatePickerField
          name={name}
          label={label}
          data={gridFieldTempState}
          validationErrors={validationErrors}
          onChange={(selectValue) =>
            handleGridDateChange(
              index,
              selectValue,
              name,
              WrittenCommTable.displayName,
            )
          }  
        />
      </div>
    );
  };

    const isButtonDisabled = (index) => {
      // Check if required fields are empty
      console.log("index value inside button disable", index)
      const requiredFieldsMissing =
      !gridFieldTempState.Communication_Type ||
      !gridFieldTempState.Name_Description ||
      !gridFieldTempState.Communication_Sent_Date_Time;

    // Check if the row is already disabled after letter generation
    console.log("123450000",!!disabledRows[1])
    return requiredFieldsMissing || !!disabledRows[index];
    };
  const tdDataReplica = (index) => {

    return (
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            {/* {renderSimpleSelectField(
                "Letter_Trigger_Type",
                "Letter Trigger Type",
                letterTriggerTypeValues,
                index,
            )} */}
            {renderSimpleSelectField(
                "Communication_Type",
                "Communication Type",
                writtenCommTypeValues,
                index,
            )}
            {renderSimpleSelectField(
                "Name_Description",
                "Name & Description",
                [{
                  label: 'ACKNOWLEDGEMENT LETTER',
                  value: 'ACKNOWLEDGEMENT LETTER'
                }
                ],
                index,
            )}
            {renderSimpleSelectField(
                "Mailing_Method",
                "Mailing Method",
                mailingMethodValues,
                index,
            )}
            {/* {renderSimpleInputField("Generated_By", "Generated By", 4000, index)} */}
            <div className="col-xs-6 col-md-3">
            <label htmlFor="Generated_By">
            <strong>Generated By</strong>
            </label>
            <input
              type="text"
              data={gridFieldTempState}
              id="Generated_By"
              name="Generated_By"
              className="form-control"
              maxLength={4000}
              Value =  {props.handleData?.Case_Owner || ""}
              onChange={(event) =>
                handleGridFieldChange(
                  index,
                  event,
                  WrittenCommTable.displayName,
                )
              }
              disabled ={true}
            
            />
          </div>

          </div>
          {/* <div className="row mt-3">
            {renderSimpleInputField("Mail_Tracking_Number", "Mail Tracking Number", 50, index)}
            {renderSimpleSelectField(
                "Communication_With",
                "Communication With",
                communicationWithValues,
                index,
            )}
            {renderSimpleInputField(
                "Member_Provider_List",
                "Member/Provider List",
                4000,
                index,
            )}
            {renderSimpleInputField("External_Source_ID", "External Source ID", 4000, index)}
           
          </div> */}
          <div className="row mt-3">
            {renderSimpleDatePickerField(
                "Communication_Sent_Date_Time",
                "Communication Sent Date Time",
                index,
            )}
                {/* {renderSimpleDatePickerField(
                "Communication_Request_Date",
                "Communication Request Date Time",
                index,
            )} */}
            <div className="col-xs-6 col-md-3">
          <label htmlFor="Communication_Request_Date">
            <strong>Communication Request Date</strong>
          </label>
          <div className="form-floating">
            <ReactDatePicker
              className="form-control example-custom-input-modal"
              selected={
                props.handleData.Case_Received_Date
                  ? new Date
                  //(props.handleData.Case_Received_Date)
                  : null
              }
              name="Communication_Request_Date"
              onChange={(date) => console.log("Date selected:", date)}
              peekNextMonth
              showMonthDropdown
              onKeyDown={(e) => e.preventDefault()}
              showYearDropdown
              dropdownMode="select"
              dateFormat="MM/dd/yyyy h:mm"
              id="Communication_Request_Date"
              disabled = {false}
            />
          </div>
        </div>
        <div className="col-md-4">
        <div style={{ width: '270%' }}>
            {renderSimpleInputField("Communication_Logs", "Communication Logs", 4000, index , '')}
            </div>
            </div>
            </div>


          <div className="row mt-3" style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            className="btn btn-outline-primary btnStyle"
            onClick={async () => {
              console.log("Button clicked for row:", operationValue);
              
              let missingFields = [];
              
              if (props.caseInformationData.Appeal_Type === 'PRE-SERVICE') {
                if (!props.caseInformationData.Appellant_Type) missingFields.push("Appellant Type");
                if (!props.caseInformationData.Product) missingFields.push("Product");
                if (!props.claimInformationData.Service_Type) missingFields.push("Service Type");
                if (!props.caseInformationData.Issue_Description) missingFields.push("Issue Description");
                if (!props.memberInformation.Member_First_Name) missingFields.push("Member First Name");
                if (!props.memberInformation.Member_ID) missingFields.push("Member ID");
                if (!props.memberInformation.Address_Line_1) missingFields.push("Address Line 1");
                if (!props.memberInformation.Address_Line_2) missingFields.push("Address Line 2");
                if (!props.memberInformation.City) missingFields.push("City");
                if (!props.memberInformation.State_) missingFields.push("State");
                if (!props.memberInformation.Zip_Code) missingFields.push("Zip Code");
                if (!props.memberInformation.Plan_Name) missingFields.push("Plan Name");
                if (!props.handleAuthorizationInformationGridData[0]?.Service_Start_Date) missingFields.push("Auth Service Start Date");
                if (!props.handleAuthorizationInformationGridData[0]?.Auth_Expiration_Date) missingFields.push("Auth Expiration Date");
              } else if (props.caseInformationData.Appeal_Type === 'RETRO') {
                if (!props.caseInformationData.Appellant_Type) missingFields.push("Appellant Type");
                if (!props.caseInformationData.Product) missingFields.push("Product");
                if (!props.claimInformationData.Service_Type) missingFields.push("Service Type");
                if (!props.caseInformationData.Issue_Description) missingFields.push("Issue Description");
                if (!props.memberInformation.Member_First_Name) missingFields.push("Member First Name");
                if (!props.memberInformation.Member_ID) missingFields.push("Member ID");
                if (!props.memberInformation.Address_Line_1) missingFields.push("Address Line 1");
                if (!props.memberInformation.Address_Line_2) missingFields.push("Address Line 2");
                if (!props.memberInformation.City) missingFields.push("City");
                if (!props.memberInformation.State_) missingFields.push("State");
                if (!props.memberInformation.Zip_Code) missingFields.push("Zip Code");
                if (!props.memberInformation.Plan_Name) missingFields.push("Plan Name");
                if (!props.handleClaimInformationGridData[0]?.Service_Start_Date) missingFields.push("Claim Service Start Date");
                if (!props.handleClaimInformationGridData[0]?.Service_End_Date) missingFields.push("Claim Service End Date");
              
              }
            
              // **Check for missing fields before proceeding**
              if (missingFields.length > 0) {
                alert(`Please fill in the mandatory fields: ${missingFields.join(", ")}.`);
                return; // Stop execution if mandatory fields are missing
              }
            
              // **Proceed with saveAndExit only if there are no missing fields**
              gridRowsFinalSubmit("WrittenCommTable", index, operationValue);
            
              if (typeof props.saveAndExit === "function") {
                const event = { target: { name: "saveAndExit" } };
            
                try {
                  let res = await props.saveAndExit(event); // Ensure this completes before proceeding
                  console.log("Save and Exit completed, now calling eSign API...", res);
                } catch (error) {
                  console.error("Error in saveAndExit:", error);
                  return; // Stop execution if saveAndExit fails
                }
              } else {
                console.error("saveAndExit is not a function!");
                return;
              }
            
              callESignOperationApi("Generate Document",index);
            }}
            
            
            style={{
              width: '200px', 
              height: '40px', 
              textAlign: 'center', 
            }}
            disabled={isButtonDisabled(index)}
          >
            Generate Letter
          </button>
        </div>

            
          
          {/* <div className="row mt-3">
                 {renderSimpleInputField("Generated_By", "Generated By", 4000, index)}
                 </div> */}
               </div>
             );
           };



           const tdData = () => {
            if (!writtenCommGridData || writtenCommGridData.length === 0) return null;
          
            return writtenCommGridData.map((data, index) => (
              <tr
                key={index}
                className={data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""}
              >
                {/* Lock Status Check */}
                {lockStatus === "N" && (
                  <td>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <button
                        className="deleteBtn"
                        style={{ width: "48%" }}
                        onClick={() => {
                          deleteTableRows(index, WrittenCommTable.displayName, "Force Delete");
                          handleOperationValue("Force Delete");
                          decreaseDataIndex();
                        }}
                      >
                        <i className="fa fa-trash"></i>
                      </button>
                      <button
                        className="editBtn"
                        style={{ width: "48%" }}
                        type="button"
                        onClick={() => {
                          editTableRows(index, WrittenCommTable.displayName);
                          handleModalChange(true);
                          handleDataIndex(index);
                          handleOperationValue("Edit");
                        }}
                      >
                        <i className="fa fa-edit"></i>
                      </button>
                    </div>
                  </td>
                )}
          
                {lockStatus === "V" && (
                  <td>
                    <button
                      className="editBtn"
                      style={{ float: "right" }}
                      type="button"
                      onClick={() => {
                        handleModalChange(true);
                        handleDataIndex(index);
                        handleOperationValue("Edit");
                      }}
                    >
                      <i className="fa fa-eye"></i>
                    </button>
                  </td>
                )}
          

          {tableFields.map((e, fieldIndex) => (
              <td className="tableData" key={fieldIndex}>
                {e.endsWith("_Date")
                  ? data?.[e]?.value
                    ? formatDate(data[e].value)
                    : formatDate(data[e])
                  : data?.[e]?.value
                    ? convertToCase(data[e].value)
                    : convertToCase(data[e])}

                {e.endsWith("View") && (
                  <button
                    className="viewBtn"
                    type="button"
                    onClick={async () => {
                      const letterData = await getLetterStatus();
                      console.log("Letter data --->", letterData);
                      if (letterData) {
                        downloadedfileBlob(null, letterData);
                      } 
                        // else {
                        //   alert("Error fetching the document data.");
                        // }
                    }}
                  >
                    <i className="fa fa-eye"></i>
                  </button>
                )}
              </td>
            ))}
              </tr>
            ));
          };
          

  const formatDate = (dateObj) => {
    if (dateObj) {
      if (typeof dateObj === "string") {
        dateObj = new Date(Date.parse(dateObj));
      } else if (typeof dateObj === "number") {
        dateObj = new Date(dateObj);
      }
      let dd = dateObj.getDate();
      let mm = dateObj.getMonth() + 1;
      let yyyy = dateObj.getFullYear();

      if (dd < 10) {
        dd = "0" + dd;
      }
      if (mm < 10) {
        mm = "0" + mm;
      }
      return mm + "/" + dd + "/" + yyyy;
    }
    return null;
  };

  const decreaseDataIndex = () => {
    if (operationValue === "Add" || operationValue === "Force Delete") {
      const indx = dataIndex - 1;
      setDataIndex(indx);
    }
  };

  const handleOperationValue = (oprtnValue) => {
    setOperationValue(oprtnValue);
  };

  const handleModalChange = (flag) => {
    setModalShow(flag);
  };

  const handleDataIndex = (index) => {
    setDataIndex(index);
  };

  return (
    <>
      <div className="claimTable-container">
        <table
          className="table table-bordered tableLayout"
          id="ProviderInformationTable"
        >
          <thead>
            <tr className="tableRowStyle tableHeaderColor">
              {lockStatus === "N" && (
                <th style={{ width: "" }}>
                  <button
                    className="addBtn"
                    onClick={() => {
                      addTableRows(WrittenCommTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(writtenCommGridData?.length);
                      handleOperationValue("Add");
                    }}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </th>
              )}
              {lockStatus === "V" && <th style={{ width: "" }}></th>}
              {tableFields.map((e) => (
                <th scope="col">{e.replaceAll("_", " ")}</th>
              ))}
            </tr>
          </thead>
          <tbody>{tdData()}</tbody>
        </table>
      </div>
      <GridModal
        name="Written Communication"
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={WrittenCommTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
       
      ></GridModal>
       {docViewDialog.open && (
          <DocumentViewer
            open={docViewDialog.open}
            close={() =>
              setDocViewDialog({ ...docViewDialog, open: false, url: "" })
            }
            dialogViewData={docViewDialog}
          />
        )}
    </>
  );
}
