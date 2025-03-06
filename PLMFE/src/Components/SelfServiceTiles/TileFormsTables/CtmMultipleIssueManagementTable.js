import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import { SimpleInputField } from "../Common/SimpleInputField";
import { SimpleSelectField } from "../Common/SimpleSelectField";
import { SimpleDatePickerField } from "../Common/SimpleDatePickerField";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function CtmMultipleIssueManagementTable({
  ctmMultipleIssueManagementGridData = [],
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridDateChange,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  lockStatus,
  editTableRows,
  gridFieldTempState,
  validationSchema,
}) {
  CtmMultipleIssueManagementTable.displayName = "CtmMultipleIssueManagementTable";

  const [dataIndex, setDataIndex] = useState();
  const [validationErrors, setValidationErrors] = useState({});
  const [operationValue, setOperationValue] = useState("");
  const [modalShow, setModalShow] = useState(false);
   const [multiGridComplaintTypeValues, setMultiGridComplaintTypeValues] = useState([]);
   const [ctmPlanRequestTypeValues, setCtmPlanRequestTypeValues] = useState([]);
   const [ctmDropDownValues, setCtmDropDownValues] = useState([]);
  const [selectedIssue, setSelectedIssue] = useState(null);
  const handleShowIssueNotes = (issue) => {
    setSelectedIssue(issue);
    setModalShow(true);
  };
  const [isTouched, setIsTouched] = useState({});
  const prop = useLocation();
  const { getGridJson, convertToCase } = useGetDBTables();

  const [issueNotes, setIssueNotes] = useState(false);

 const masterCtmMultiGridComplaintTypeSelector = useSelector(
          (state) => state?.masterCtmMultiGridComplaintType,
      );
 const masterCtmPlanRequestTypeSelector = useSelector(
           (state) => state?.masterCtmPlanRequestType,
       );
 const masterCtmDropDownSelector = useSelector(
        (state) => state?.masterCtmDropDown,
      );
  useEffect(() => {
    try {
      setValidationErrors([]);
      validationSchema.validateSync(gridFieldTempState, { abortEarly: false });
    } catch (errors) {
      const validationErrors = errors.inner?.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setValidationErrors(validationErrors);
    }
  }, [gridFieldTempState]);

  const tableFields = [
    "Issue_Number",
    "Subcase_ID",
    "Complaint_Type",
    "Issue_Category",
    "Issue_Sub_Category",
    "Issue_Super_Category",
    "Complaint_Summary_Issue",
    "Proceed",
    "Work_Basket",
    "Requested_Action",
    "Plan_Request_Type",
    "Issue_Notes",

  ];
useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    const multiGridComplaintType= masterCtmMultiGridComplaintTypeSelector?.[0] || [];
    setMultiGridComplaintTypeValues(
        multiGridComplaintType.map((e) => e.Complaint_Type_CTM).map(kvMapper),
    );
    const ctmPlanRequestType= masterCtmPlanRequestTypeSelector?.[0] || [];
        setCtmPlanRequestTypeValues(
            ctmPlanRequestType.map((e) => e.Ctm_Plan_Request_Type).map(kvMapper),
        );
   const ctmDropDown = masterCtmDropDownSelector?.[0] || [];
   setCtmDropDownValues(
         ctmDropDown.map((e) => e.Drop_Down).map(kvMapper));


  }, []);
  const renderSimpleInputField = (name, label, maxLength, index) => {
    return (
      <div className="col-xs-6 col-md-3">
        <SimpleInputField
          name={name}
          label={label}
          maxLength={maxLength}
          data={gridFieldTempState}
          onChange={(event) =>
            handleGridFieldChange(
              index,
              event,
              CtmMultipleIssueManagementTable.displayName,
            )
          }
          validationErrors={validationErrors}
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
          options={Array.isArray(options) ? options : []}
          data={gridFieldTempState}
          onChange={(selectValue, event) =>
            handleGridSelectChange(
              index,
              selectValue,
              event,
              CtmMultipleIssueManagementTable.displayName,
            )
          }
          validationErrors={validationErrors}

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
          onChange={(selectValue) =>
            handleGridDateChange(
              index,
              selectValue,
              name,
              CtmMultipleIssueManagementTable.displayName,
            )
          }
          validationErrors={validationErrors}

        />
      </div>
    );
  };
  const tdDataReplica = (index) => (
    <div className="Container AddProviderLabel AddModalLabel">
      <div className="row">
        {renderSimpleInputField("Issue_Number", "Issue Number", 50, index)}
        {renderSimpleInputField("Subcase_ID", "Subcase ID", 50, index)}
        {renderSimpleSelectField("Complaint_Type", "Complaint Type", multiGridComplaintTypeValues, index)}
        {renderSimpleSelectField("Issue_Category", "Issue Category", 50, index)}
      </div>
      <div className="row mt-3">
        {renderSimpleSelectField("Issue_Sub_Category", "Issue Sub Category", 50, index)}
        {renderSimpleSelectField("Issue_Super_Category", "Issue Super Category", 50, index)}
        {renderSimpleInputField("Complaint_Summary_Issue", "Complaint Summary Issue", 50, index)}
        {renderSimpleSelectField("Proceed", "Proceed",ctmDropDownValues, index)}
      </div>
      <div className="row mt-3">
        {renderSimpleSelectField("Work_Basket", "Work Basket", 50, index)}
        {renderSimpleSelectField("Requested_Action", "Requested Action", 50, index)}
        {renderSimpleSelectField("Plan_Request_Type", "Plan Request Type",ctmPlanRequestTypeValues, index)}
        {renderSimpleInputField("Issue_Notes", "Issue Notes", 50, index)}

      </div>
      <div className="row mt-2 ml-auto">
        <button
          className="button issue-button"
          onClick={() => setIssueNotes(!issueNotes)}>{issueNotes ? 'Hide' : 'Show'} Issue Notes History</button>
      </div>
      {
        issueNotes && <div className="row  w-full p-3">
          <table
            className="table table-bordered tableLayout"
            id="Issue Notes Table"
          >
            <thead>
              <tr>
                <th>Created On</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Created On</td>
                <td>Created By </td>
              </tr>
            </tbody>
          </table>

        </div>
      }
    </div>
  );

  const tdData = () => {

    if (
      ctmMultipleIssueManagementGridData !== undefined &&
      ctmMultipleIssueManagementGridData.length > 0
    ) {
      return ctmMultipleIssueManagementGridData.map((data, index) => {
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
                          CtmMultipleIssueManagementTable.displayName,
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
                          CtmMultipleIssueManagementTable.displayName,
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

            {tableFields
                                                  .filter((e) => e !== "rowNumber")
                                                  .map((e) => (
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
  const handleOperationValue = (oprtnValue) => {
    setOperationValue(oprtnValue);
  };

  const handleModalChange = (flag) => {
    setModalShow(flag);
  };

  const handleDataIndex = (index) => {
    setDataIndex(index);
  };

  const decreaseDataIndex = () => {
    if (operationValue === "Add" || operationValue === "Force Delete") {
      const indx = dataIndex - 1;
      setDataIndex(indx);
    }
  };

  return (
    <>
      <div className="claimTable-container">
        <table
          className="table table-bordered tableLayout"
          id="MultipleIssue Management Table"
        >
          <thead>
            <tr className="tableRowStyle tableHeaderColor">
              {lockStatus === "N" && (
                <th style={{ width: "100px" }}>
                  <button
                    className="addBtn"
                    onClick={() => {
                      addTableRows(CtmMultipleIssueManagementTable.displayName);
                      handleModalChange(true);
                      handleDataIndex(ctmMultipleIssueManagementGridData.length);
                      handleOperationValue("Add");
                    }}
                  >
                    <i className="fa fa-plus"></i>
                  </button>
                </th>
              )}
              {lockStatus === "V" && <th style={{ width: "" }}></th>}

              {tableFields
                                                  .filter((e) => e !== "rowNumber")
                                                  .map((e) => (
                                                    <th scope="col" style={{ width: "150px" }}>
                                                      {e.replaceAll("_", " ")}
                                                    </th>
                                                  ))}
            </tr>
          </thead>
          <tbody>{tdData()}</tbody>
        </table>
      </div>

      <GridModal
        name="Multiple Issue Management"
        validationObject={isTouched}
        modalShow={modalShow}
        handleModalChange={handleModalChange}
        dataIndex={dataIndex}
        tdDataReplica={tdDataReplica}
        deleteTableRows={deleteTableRows}
        gridName={CtmMultipleIssueManagementTable.displayName}
        decreaseDataIndex={decreaseDataIndex}
        operationValue={operationValue}
        gridRowsFinalSubmit={gridRowsFinalSubmit}
        lockStatus={lockStatus}
        validationErrors={validationErrors}
      ></GridModal>
    </>
  );

}
