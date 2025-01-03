import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";
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
  memberInformation
}) {
  WrittenCommTable.displayName = "WrittenCommTable";

  const [dataIndex, setDataIndex] = useState();

  const [validationErrors, setValidationErrors] = useState({});

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);
  const [providerSelected, setProviderSelected] = useState(false);
  const [memberSelected, setMemberSelected] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  const { getGridJson, convertToCase } = useGetDBTables();

  const [letterTriggerTypeValues, setletterTriggerTypeValues] = useState([]);
  const [communicationTypeValues, setcommunicationTypeValues] = useState([]);
  const [nameDescriptionValues, setnameDescriptionValues] = useState([]);
  const [mailingMethodValues, setmailingMethodValues] = useState([]);
  const [communicationWithValues, setcommunicationWithValues] = useState([]);
  const [memberProviderListValues, setmemberProviderListValues] = useState([]);
//  const [uploadedFile, setUploadedFile] = useState(null);
//  const handleFileUpload = (event) => {
//    const file = event.target.files[0];
//    if (file) {
//      console.log("File uploaded:", file);
//      setUploadedFile(file);
//      saveFileLocally(file); // Save the file locally for persistence
//    }
//  };
//
//  const handleSubmit = async () => {
//    const formData = new FormData();
//
//    // Loop through form fields and append them
//    for (let key in gridFieldTempState) {
//      if (gridFieldTempState[key] instanceof File) {
//        formData.append(key, gridFieldTempState[key]); // Append file
//      } else {
//        formData.append(key, gridFieldTempState[key]); // Append other fields
//      }
//    }
//
//    try {
//      const response = await axios.post('/api/save-data', formData, {
//        headers: {
//          'Content-Type': 'multipart/form-data', // For file uploads
//        },
//      });
//      console.log("Success:", response.data);
//    } catch (error) {
//      console.error("Error uploading:", error);
//    }
//  };
//
//
//// Function to save the file in localStorage
//  const saveFileLocally = (file) => {
//    const reader = new FileReader();
//    reader.onload = () => {
//      const base64 = reader.result; // Convert file to Base64 string
//      localStorage.setItem('uploadedFile', base64); // Save Base64 string to localStorage
//      console.log("File saved locally.");
//    };
//    reader.readAsDataURL(file); // Read file as data URL
//  };
//
//// Function to fetch the file from localStorage
//  const fetchFileLocally = () => {
//    const base64 = localStorage.getItem('uploadedFile');
//    if (base64) {
//      console.log("File fetched successfully:", base64);
//      return base64;
//    } else {
//      console.log("No file found in storage.");
//      return null;
//    }
//  };

  let prop = useLocation();
  const masterAngLetterTriggerSelector = useSelector(
    (state) => state?.masterAngLetterTriggerType,
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


  useEffect(() => {
    if(memberSelected) {
      let tempInput = { ...gridFieldTempState };
    
      //providerInformationGrid
      tempInput['Member_Provider_List'] =  memberInformation.Member_First_Name + ' ' + memberInformation.Member_Last_Name;
      setGridFieldTempState(tempInput);
    } else {

      if(providerSelected) {
        let tempInput = { ...gridFieldTempState };
        console.log(providerInformationGrid)
      
        const provisingRow = providerInformationGrid.find(pg => pg.Provider_Type === 'PROVISIONING')
      let providerName = ''
        if(provisingRow) {
      providerName = provisingRow['Provider_Name']
      
        } else {
          if(providerInformationGrid?.length > 0) {
            providerName = providerInformationGrid?.[0]?.['Provider_Name']
      
          }
      
        }
      
        //providerInformationGrid
        tempInput['Member_Provider_List'] = providerName;
        setGridFieldTempState(tempInput);
      }  else {
      
      let tempInput = { ...gridFieldTempState };
    
    
      tempInput['Member_Provider_List'] = '';
      setGridFieldTempState(tempInput);
    }
  }
      }, [memberSelected, providerSelected])
  
 
useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const letterTrigger = masterAngLetterTriggerSelector?.[0] || [];
    setletterTriggerTypeValues(
        letterTrigger.map((e) => e.Letter_Trigger_Type).map(kvMapper),
    );
    const communicationType = masterAngCommunicationTypeSelector?.[0] || [];
    setcommunicationTypeValues(
        communicationType.map((e) => e.Communication_Type).map(kvMapper),
    );
    const nameDescription =masterAngNameDescriptionSelector?.[0] || [];
    setnameDescriptionValues(
        nameDescription.map((e) => e.Needed_By).map(kvMapper),
    );

    const mailingMethod = masterAngMailingMethodSelector?.[0] || [];
    setmailingMethodValues(
        mailingMethod.map((e) => e.Mailing_Method).map(kvMapper),
    );
    const communicationWith = masterAngCommunicationWithSelector?.[0] || [];
    setcommunicationWithValues(
        communicationWith.map((e) => e.Communication_With).map(kvMapper),
    );
    const memberProviderList =masterAngMemberProviderListSelector?.[0] || [];
    setnameDescriptionValues(
        memberProviderList.map((e) => e.Needed_By).map(kvMapper),
    );
    
}, []);

useEffect(() => {
  try {
    setValidationErrors([]);
    validationSchema.validateSync(gridFieldTempState, { abortEarly: false });
  } catch (errors) {
    const validationErrors = errors.inner.reduce((acc, error) => {
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
    "Letter_Trigger_Type",
    "Communication_Type",
    "Name_Description",
    "Mailing_Method",
    "Mail_Tracking_Number",
    "Communication_With",
    "Member_Provider_List",
    "Communication_Request_Date",
    "Communication_Sent_Date_Time",
    "Communication_Logs",
    "External_Source_ID",
    // "CCM_Status",
    "Generated_By",
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
        //   disabled={
        //     (prop.state.formView === "DashboardView" &&
        //       (prop.state.stageName === "Redirect Review" ||
        //         prop.state.stageName === "Effectuate" ||
        //         prop.state.stageName === "Pending Effectuate" ||   
        //         prop.state.stageName === "Case Completed" ||
        //         prop.state.stageName === "CaseArchived"))   
        //   }
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
        //   disabled={
        //         prop.state.formView === "DashboardView" &&
        //       (prop.state.stageName === "Redirect Review" ||
        //         prop.state.stageName === "Effectuate" ||
        //         prop.state.stageName === "Pending Effectuate" ||   
        //         prop.state.stageName === "Case Completed" ||
        //         prop.state.stageName === "CaseArchived")  
        //   }
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
        //   disabled={
        //     prop.state.formView === "DashboardView" &&
        //       (prop.state.stageName === "Redirect Review" ||
        //         prop.state.stageName === "Effectuate" ||
        //         prop.state.stageName === "Pending Effectuate" ||   
        //         prop.state.stageName === "Case Completed" ||
        //         prop.state.stageName === "CaseArchived")  
        //   }
        />
      </div>
    );
  };

  const tdDataReplica = (index) => {

    return (
        <div className="Container AddProviderLabel AddModalLabel">
          <div className="row">
            {renderSimpleSelectField(
                "Letter_Trigger_Type",
                "Letter Trigger Type",
                letterTriggerTypeValues,
                index,
            )}
            {renderSimpleSelectField(
                "Communication_Type",
                "CommunicationType",
                communicationTypeValues,
                index,
            )}
            {renderSimpleSelectField(
                "Name_Description",
                "Name & Description",
                [{
                  label: 'NOTICE OF IRE OVERTURN',
                  value: 'NOTICE OF IRE OVERTURN'
                }, {
                  label: 'APPEAL AUTOFORWARD LETTER',
                  value: 'APPEAL AUTOFORWARD LETTER'
                }, {
                  label: 'NON PAR DISMISSAL',
                  value: 'NON PAR DISMISSAL'
                },
                  {
                    label: 'NON PAR DENIAL LETTER',
                    value: 'NON PAR DENIAL LETTER'
                  }, {
                  label: 'NON PAR MEDICAL RECORDS REQUEST',
                  value: 'NON PAR MEDICAL RECORDS REQUEST'
                },
                  {
                    label: 'NON PAR WOL REQUEST',
                    value: 'NON PAR WOL REQUEST'
                  }, {
                  label: 'APPOINTMENT OF REPRESENTATIVE',
                  value: 'APPOINTMENT OF REPRESENTATIVE'
                }, {
                  label: 'APPEAL ACKNOWLEDGEMENT LETTER',
                  value: 'APPEAL ACKNOWLEDGEMENT LETTER'
                },
                  {
                    label: 'AOR REQUEST FORM_POA_EOE',
                    value: 'AOR REQUEST FORM_POA_EOE'
                  }, {
                  label: 'NON PAR AOR and WOL REQUEST LETTER',
                  value: 'NON PAR AOR and WOL REQUEST LETTER'
                },
                  {
                    label: 'APPEAL DISMISSAL LETTER',
                    value: 'APPEAL DISMISSAL LETTER'
                  },
                  {
                    label: 'APPEAL UPHOLD LETTER',
                    value: 'APPEAL UPHOLD LETTER'
                  }, {
                  label: 'APPEAL OVERTURN LETTER',
                  value: 'APPEAL OVERTURN LETTER'
                }, {
                  label: 'PAR PROVIDER APPROVAL',
                  value: 'PAR PROVIDER APPROVAL'
                },
                  {
                    label: 'PAR CORRESPONDENCE LETTER',
                    value: 'PAR CORRESPONDENCE LETTER'
                  },
                  {
                    label: 'NON PAR APPROVAL',
                    value: 'NON PAR APPROVAL'
                  },
                  {
                    label: 'NON PAR CORRESPONDENCE LETTER',
                    value: 'NON PAR CORRESPONDENCE LETTER'
                  },
                  {
                    label: 'CORRESPONDENCE',
                    value: 'CORRESPONDENCE'
                  },
                ],
                index,
            )}
            {renderSimpleSelectField(
                "Mailing_Method",
                "Mailing Method",
                mailingMethodValues,
                index,
            )}


          </div>
          <div className="row mt-3">
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
           
          </div>
          <div className="row mt-3">
            {renderSimpleDatePickerField(
                "Communication_Sent_Date_Time",
                "Communication Sent Date Time",
                index,
            )}
             {renderSimpleDatePickerField(
                "Communication_Request_Date",
                "Communication Request Date",
                index,
            )}
            {renderSimpleInputField("Communication_Logs", "Communication Logs", 4000, index)}
            {/* {renderSimpleInputField("CCM_Status", "CCMStatus", 4000, index)} */}
            {renderSimpleInputField("Generated_By", "Generated By", 4000, index)}

          </div>
          {/* <div className="row mt-3">
                 {renderSimpleInputField("Generated_By", "Generated By", 4000, index)}
                 </div> */}
               </div>
             );
           };

  const tdData = () => {
    console.log("writtenCommGridData", writtenCommGridData)
    if (
        writtenCommGridData !== undefined &&
        writtenCommGridData.length > 0
    ) {
      return writtenCommGridData.map((data, index) => {
        return (
            <tr
                key={index}
                className={
                  data.DataSource === "CredentialingApi" ? "CredentialingApi" : ""
            }
          >
            {lockStatus === "N" && (
              <>
                <td>
                  <span
                    style={{
                      display: "flex",
                    }}
                  >
                    <button
                      className="deleteBtn"
                      style={{ width: "75%", float: "left" }}
                      onClick={() => {
                        deleteTableRows(
                          index,
                          WrittenCommTable.displayName,
                          "Force Delete",
                        );
                        handleOperationValue("Force Delete");
                        decreaseDataIndex();
                      }}
                    >
                      <i className="fa fa-trash"></i>
                    </button>
                    <button
                      className="editBtn"
                      style={{ width: "75%", float: "right" }}
                      type="button"
                      onClick={() => {
                        editTableRows(
                          index,
                          WrittenCommTable.displayName,
                        );
                        handleModalChange(true);
                        handleDataIndex(index);
                        handleOperationValue("Edit");
                      }}
                    >
                      <i className="fa fa-edit"></i>
                    </button>
                  </span>
                </td>
              </>
            )}
            {lockStatus === "V" && (
              <td>
                <div>
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
                </div>
              </td>
            )}

            {tableFields.map((e) => (
              <td className="tableData">
                {e.endsWith("_Date")
                  ? data?.[e]?.value
                    ? formatDate(data[e].value)
                    : formatDate(data[e])
                  : data?.[e]?.value
                    ? convertToCase(data[e].value)
                    : convertToCase(data[e])}
              </td>
            ))}
          </tr>
        );
      });
    }
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
                      handleDataIndex(writtenCommGridData.length);
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
    </>
  );
}
