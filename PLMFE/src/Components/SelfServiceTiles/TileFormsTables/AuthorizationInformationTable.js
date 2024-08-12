import React, {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import GridModal from "./GridModal";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import {useLocation} from "react-router-dom";
import {SimpleInputField} from "../Common/SimpleInputField";
import {SimpleSelectField} from "../Common/SimpleSelectField";
import {SimpleDatePickerField} from "../Common/SimpleDatePickerField";

export default function AuthorizationInformationTable({
    authorizationInformationGridData,
    deleteTableRows,
    handleGridSelectChange,
    addTableRows,
    handleGridDateChange,
    handleGridFieldChange,
    gridRowsFinalSubmit,
    lockStatus,
    editTableRows,
    gridFieldTempState,
}) {
    AuthorizationInformationTable.displayName = "AuthorizationInformationTable";

    const [dataIndex, setDataIndex] = useState();

    const [operationValue, setOperationValue] = useState("");

    const [modalShow, setModalShow] = useState(false);

    const [isTouched, setIsTouched] = useState({});

    const { getGridJson, convertToCase } = useGetDBTables();

    const masterAngAuthServiceTypeSelector = useSelector((state) => state?.masterAngAuthServiceType);

    let prop = useLocation();

    let authTypeDescriptionValues = [];

    useEffect(() => {
        if (masterAngAuthServiceTypeSelector) {
            const authTypeDescriptionArray =
                masterAngAuthServiceTypeSelector.length === 0
                    ? []
                    : masterAngAuthServiceTypeSelector[0];

            for (let i = 0; i < authTypeDescriptionArray.length; i++) {
                authTypeDescriptionValues.push({ label: convertToCase(authTypeDescriptionArray[i].SERVICE_TYPE_DESC), value: convertToCase(authTypeDescriptionArray[i].SERVICE_TYPE_DESC) });
            }
        }
    });

    const renderSimpleInputField = (name, label, maxLength, index) => {
        return <div className="col-xs-6 col-md-3">
            <SimpleInputField name={name}
                              label={label}
                              maxLength={maxLength}
                              data={getGridJson(gridFieldTempState)}
                              onChange={(event) => handleGridFieldChange(index, event, AuthorizationInformationTable.displayName)}
                              disabled={prop.state.formView === "DashboardView" &&
                                  (prop.state.stageName === "Redirect Review" ||
                                      prop.state.stageName === "Documents Needed" ||
                                      prop.state.stageName === "Effectuate" ||
                                      prop.state.stageName === "Pending Effectuate" ||
                                      prop.state.stageName === "Resolve" ||
                                      prop.state.stageName === "Case Completed" ||
                                      prop.state.stageName === "Reopen" ||
                                      prop.state.stageName === "CaseArchived")}/>
          </div>
        }
    const renderSimpleSelectField = (name, label, options, index) => {
        return <div className="col-xs-6 col-md-3">
            <SimpleSelectField name={name}
                              label={label}
                              options={options}
                              data={getGridJson(gridFieldTempState)}
                              onChange={(selectValue, event) =>
                                  handleGridSelectChange(
                                      index,
                                      selectValue,
                                      event,
                                      AuthorizationInformationTable.displayName
                                  )}
                              disabled={prop.state.formView === "DashboardView" &&
                                  (prop.state.stageName === "Redirect Review" ||
                                      prop.state.stageName === "Documents Needed" ||
                                      prop.state.stageName === "Effectuate" ||
                                      prop.state.stageName === "Pending Effectuate" ||
                                      prop.state.stageName === "Resolve" ||
                                      prop.state.stageName === "Case Completed" ||
                                      prop.state.stageName === "Reopen" ||
                                      prop.state.stageName === "CaseArchived")}/>
          </div>
        }
    const renderSimpleDatePickerField = (name, label, index) => {
        return <div className="col-xs-6 col-md-3">
            <SimpleDatePickerField name={name}
                              label={label}
                              data={getGridJson(gridFieldTempState)}
                              onChange={(selectValue) =>
                                  handleGridDateChange(
                                      index,
                                      selectValue,
                                      name,
                                      AuthorizationInformationTable.displayName
                                  )}
                              disabled={prop.state.formView === "DashboardView" &&
                                  (prop.state.stageName === "Redirect Review" ||
                                      prop.state.stageName === "Documents Needed" ||
                                      prop.state.stageName === "Effectuate" ||
                                      prop.state.stageName === "Pending Effectuate" ||
                                      prop.state.stageName === "Resolve" ||
                                      prop.state.stageName === "Case Completed" ||
                                      prop.state.stageName === "Reopen" ||
                                      prop.state.stageName === "CaseArchived")}/>
          </div>
        }
    const tdDataReplica = (index) => {
        return (
            <div className="Container AddProviderLabel AddModalLabel">
                <div className="row">
                  {renderSimpleInputField("Issue_Number", "Issue Number *", 50, index)}
                  {renderSimpleInputField("Authorization_Number", "Authorization Number", 50, index)}
                  {renderSimpleInputField("Auth_Status", "Auth Status", 50, index)}
                  {renderSimpleInputField("Provider_Name", "Provider Name", 50, index)}
                </div>
                <div className="row">
                  {renderSimpleInputField("Authorization_Type", "Authorization Type", 50, index)}
                  {renderSimpleSelectField("Auth_Type_Description", "Auth Type Description", authTypeDescriptionValues, index)}
                  {renderSimpleDatePickerField("Auth_Request_Date", "Auth Request Date", index)}
                  {renderSimpleDatePickerField("Auth_Expiration_Date", "Auth Expiration Date", index)}
                </div>
                <div className="row">
                    {renderSimpleInputField("CPT_Descriptions", "CPT Descriptions", 50, index)}
                    {renderSimpleDatePickerField("Service_Start_Date", "Service Start Date", index)}
                    {renderSimpleInputField("Denial_Code", "Denial Code", 50, index)}
                    {renderSimpleInputField("Denial_Reason", "Denial Reason", 50, index)}
                </div>
            </div>
        );
    };

    const tdData = () => {
        if (
            authorizationInformationGridData !== undefined &&
            authorizationInformationGridData.length > 0
        ) {
            return authorizationInformationGridData.map((data, index) => {
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
                                                    AuthorizationInformationTable.displayName,
                                                    "Force Delete"
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
                                                editTableRows(index, AuthorizationInformationTable.displayName);
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

                        {Object.keys(gridFieldTempState)
                            .filter(e => e !== 'rowNumber')
                            .map(e => (
                                <td className="tableData">
                                    {e.endsWith("_Date") ?
                                        data?.[e]?.value
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
    }

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
                <table className="table table-bordered tableLayout" id="ProviderInformationTable">
                    <thead>
                        <tr className="tableRowStyle tableHeaderColor">
                            {lockStatus === "N" && (
                                <th style={{ width: "" }}>
                                    <button
                                        className="addBtn"
                                        onClick={() => {
                                            addTableRows(AuthorizationInformationTable.displayName);
                                            handleModalChange(true);
                                            handleDataIndex(authorizationInformationGridData.length);
                                            handleOperationValue("Add");
                                        }}
                                    >
                                        <i className="fa fa-plus"></i>
                                    </button>
                                </th>
                            )}
                            {lockStatus === "V" && <th style={{ width: "" }}></th>}
                            {Object.keys(gridFieldTempState).filter(e => e !== 'rowNumber').map(e => <th key={e} scope="col">{e.replaceAll('_', ' ')}</th>)}
                        </tr>
                    </thead>
                    <tbody>
                        {tdData()}
                    </tbody>
                </table>
            </div>
            <GridModal
                name="Authorization Information"
                validationObject={isTouched}
                modalShow={modalShow}
                handleModalChange={handleModalChange}
                dataIndex={dataIndex}
                tdDataReplica={tdDataReplica}
                deleteTableRows={deleteTableRows}
                gridName={AuthorizationInformationTable.displayName}
                decreaseDataIndex={decreaseDataIndex}
                operationValue={operationValue}
                gridRowsFinalSubmit={gridRowsFinalSubmit}
                lockStatus={lockStatus}
            ></GridModal>
        </>
    );
}