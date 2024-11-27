import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";

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
}) {
  WrittenCommTable.displayName = "WrittenCommTable";

  const [dataIndex, setDataIndex] = useState();
  const [validationErrors, setValidationErrors] = useState({});

  const [operationValue, setOperationValue] = useState("");

  const [modalShow, setModalShow] = useState(false);

  const [isTouched, setIsTouched] = useState({});

  const { getGridJson, convertToCase } = useGetDBTables();

  const [letterTriggerTypeValues, setletterTriggerTypeValues] = useState([]);
  const [communicationTypeValues, setcommunicationTypeValues] = useState([]);
  const [nameDescriptionValues, setnameDescriptionValues] = useState([]);
  const [mailingMethodValues, setmailingMethodValues] = useState([]);
  const [communicationWithValues, setcommunicationWithValues] = useState([]);
  const [memberProviderListValues, setmemberProviderListValues] = useState([]);

  let prop = useLocation();
  const masterAngLetterTriggerSelector = useSelector(
    (state) => state?.masterAngLetterTrigger,
  );
  const masterAngCommunicationTypeSelector = useSelector(
    (state) => state?.masterAngCommunicationType,
  );
  const masterAngNameDescriptionSelector = useSelector(
    (state) => state?.masterAngNameDescription,
  );

  const masterAngMailingMethodSelector = useSelector(
    (state) => state?.masterAngMailingMethod,
  );
  const masterAngCommunicationWithSelector = useSelector(
    (state) => state?.masterAngCommunicationWith,
  );
  const masterAngMemberProviderListSelector = useSelector(
    (state) => state?.masterAngMemberProviderList,
  );
 
useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const letterTrigger = masterAngLetterTriggerSelector?.[0] || [];
    setletterTriggerTypeValues(
        letterTrigger.map((e) => e.Doc_Needed).map(kvMapper),
    );
    const communicationType = masterAngCommunicationTypeSelector?.[0] || [];
    setcommunicationTypeValues(
        communicationType.map((e) => e.Requested_From).map(kvMapper),
    );
    const nameDescription =masterAngNameDescriptionSelector?.[0] || [];
    setnameDescriptionValues(
        nameDescription.map((e) => e.Needed_By).map(kvMapper),
    );

    const mailingMethod = masterAngMailingMethodSelector?.[0] || [];
    setletterTriggerTypeValues(
        mailingMethod.map((e) => e.Doc_Needed).map(kvMapper),
    );
    const communicationWith = masterAngCommunicationWithSelector?.[0] || [];
    setcommunicationTypeValues(
        communicationWith.map((e) => e.Requested_From).map(kvMapper),
    );
    const memberProviderList =masterAngMemberProviderListSelector?.[0] || [];
    setnameDescriptionValues(
        memberProviderList.map((e) => e.Needed_By).map(kvMapper),
    );
    
}, []);
  

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
    "CCM_Status",
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
          onChange={(selectValue, event) =>
            handleGridSelectChange(
              index,
              selectValue,
              event,
              WrittenCommTable.displayName,
            )
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
            nameDescriptionValues,
            index,
          )}
           {renderSimpleSelectField(
            "Mailing_Method",
            "Mailing_Method",
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
           {renderSimpleSelectField(
            "Member_Provider_List",
            "Member/Provider List",
            memberProviderListValues,
            index,
          )}
          {renderSimpleDatePickerField(
            "Communication_Request_Date",
            "Communication Request Date",
            index,
          )}
        </div>
        <div className="row mt-3">
          {renderSimpleDatePickerField(
            "Communication_Sent_Date_Time",
            "Communication Sent Date Time",
            index,
          )}
          {renderSimpleInputField("Communication_Logs", "Communication Logs", 4000, index)}
          {renderSimpleInputField("External_Source_ID", "External Source ID", 4000, index)}
          {renderSimpleInputField("CCM_Status", "CCMStatus", 4000, index)}
          
        </div>
        <div className="row mt-3">
        {renderSimpleInputField("Generated_By", "Generated By", 4000, index)}
        </div>
      </div>
    );
  };

  const tdData = () => {
    console.log("writtenCommGridData",writtenCommGridData)
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
        name="Documents Needed"
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
