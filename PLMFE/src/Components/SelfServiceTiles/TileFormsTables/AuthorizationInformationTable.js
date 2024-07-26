import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import GridModal from "./GridModal";
import Select from "react-select";
import ReactDatePicker from "react-datepicker";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { useLocation } from "react-router-dom";

export default function AuthorizationInformationTable({
    authorizationInformationGridData,
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

    const tdDataReplica = (index) => {
        console.log("Inside tdDataReplica");

        const data = getGridJson(gridFieldTempState);

        // selectJson["lineNumberOptions"].map((val) =>
        //     lineNumberOptions.push({ value: val, label: val })
        // );

        return (
            <div className="Container AddProviderLabel AddModalLabel">
                <div className="row">
                    <div className="col-xs-6 col-md-3">
                        <label>Issue Number *</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Issue_Number" in data && data.Issue_Number.value !== undefined
                                    ? convertToCase(data.Issue_Number.value)
                                    : convertToCase(data.Issue_Number)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, AuthorizationInformationTable.displayName)
                            }
                            name="Issue_Number"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>Authorization Number</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Authorization_Number" in data && data.Authorization_Number.value !== undefined
                                    ? convertToCase(data.Authorization_Number.value)
                                    : convertToCase(data.Authorization_Number)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, AuthorizationInformationTable.displayName)
                            }
                            name="Authorization_Number"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>Auth Status</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Auth_Status" in data && data.Auth_Status.value !== undefined
                                    ? convertToCase(data.Auth_Status.value)
                                    : convertToCase(data.Auth_Status)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, AuthorizationInformationTable.displayName)
                            }
                            name="Auth_Status"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>Provider Name</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Provider_Name" in data && data.Provider_Name.value !== undefined
                                    ? convertToCase(data.Provider_Name.value)
                                    : convertToCase(data.Provider_Name)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, AuthorizationInformationTable.displayName)
                            }
                            name="Provider_Name"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-md-3">
                        <label>Authorization Type</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Authorization_Type" in data && data.Authorization_Type.value !== undefined
                                    ? convertToCase(data.Authorization_Type.value)
                                    : convertToCase(data.Authorization_Type)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, AuthorizationInformationTable.displayName)
                            }
                            name="Authorization_Type"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label>Auth Type Description</label>
                        <br />
                        <Select
                            styles={{
                                control: (provided) => ({
                                    ...provided,
                                    fontWeight: "lighter",
                                }),
                            }}
                            value={data.Auth_Type_Description}
                            onChange={(selectValue, event) =>
                                handleGridSelectChange(
                                    index,
                                    selectValue,
                                    event,
                                    AuthorizationInformationTable.displayName
                                )
                            }
                            options={authTypeDescriptionValues}
                            name="Auth_Type_Description"
                            id="lineNumberDropDown"
                            isDisabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                            isClearable
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label htmlFor="datePicker">Auth Request Date</label>
                        <br />
                        <div className="form-floating">
                            <ReactDatePicker
                                className="form-control example-custom-input-modal"
                                selected={                        
                                        data?.Auth_Request_Date?.value !== undefined
                                        ? new Date(data.Auth_Request_Date.value)
                                        : data?.Auth_Request_Date !== undefined
                                            ? new Date(data.Auth_Request_Date)
                                            : null
                                }
                                name="Auth_Request_Date"
                                onChange={(selectValue, event) =>
                                    handleGridDateChange(
                                        index,
                                        selectValue,
                                        "Auth_Request_Date",
                                        AuthorizationInformationTable.displayName
                                    )
                                }
                                peekNextMonth
                                showMonthDropdown
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                }}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="MM/dd/yyyy"
                                id="datePicker"
                                disabled={
                                    prop.state.formView === "DashboardView" &&
                                        (prop.state.stageName === "Redirect Review" ||
                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                        ? true
                                        : false
                                }
                            />
                        </div>
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label htmlFor="datePicker">Auth Expiration Date</label>
                        <br />
                        <div className="form-floating">
                            <ReactDatePicker
                                className="form-control example-custom-input-modal"
                                selected={

                                        data?.Auth_Expiration_Date?.value !== undefined
                                        ? new Date(data.Auth_Expiration_Date.value)
                                        : data?.Auth_Expiration_Date !== undefined
                                            ? new Date(data.Auth_Expiration_Date)
                                            : null
                                }
                                name="Auth_Expiration_Date"
                                onChange={(selectValue, event) =>
                                    handleGridDateChange(
                                        index,
                                        selectValue,
                                        "Auth_Expiration_Date",
                                        AuthorizationInformationTable.displayName
                                    )
                                }
                                peekNextMonth
                                showMonthDropdown
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                }}
                                showYearDropdown
                                dropdownMode="select"
                                dateFormat="MM/dd/yyyy"
                                id="datePicker"
                                disabled={
                                    prop.state.formView === "DashboardView" &&
                                        (prop.state.stageName === "Redirect Review" ||
                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                        ? true
                                        : false
                                }
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-6 col-md-3">
                        <label>CPT Descriptions</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "CPT_Descriptions" in data && data.CPT_Descriptions.value !== undefined
                                    ? convertToCase(data.CPT_Descriptions.value)
                                    : convertToCase(data.CPT_Descriptions)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, AuthorizationInformationTable.displayName)
                            }
                            name="CPT_Descriptions"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Valid Type"
                            disabled={
                                prop.state.formView === "DashboardView" &&
                                    (prop.state.stageName === "Redirect Review" ||
                                        prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                    ? true
                                    : false
                            }
                        />
                    </div>
                    <div className="col-xs-6 col-md-3">
                        <label htmlFor="datePicker">Service Start Date</label>
                        <br />
                        <div className="form-floating">
                            <ReactDatePicker
                                className="form-control example-custom-input-modal"
                                selected={
                                        data?.Service_Start_Date?.value !== undefined
                                        ? new Date(data.Service_Start_Date.value)
                                        : data?.Service_Start_Date !== undefined
                                            ? new Date(data.Service_Start_Date)
                                            : null
                                }
                                name="Service_Start_Date"
                                onChange={(selectValue, event) =>
                                    handleGridDateChange(
                                        index,
                                        selectValue,
                                        "Service_Start_Date",
                                        AuthorizationInformationTable.displayName
                                    )
                                }
                                peekNextMonth
                                showMonthDropdown
                                onKeyDown={(e) => {
                                    e.preventDefault();
                                }}
                                showYearDropdown
                                dropdownMode="select"
                              //  isClearable
                                dateFormat="MM/dd/yyyy"
                                id="datePicker"
                                disabled={
                                    prop.state.formView === "DashboardView" &&
                                        (prop.state.stageName === "Redirect Review" ||
                                            prop.state.stageName === "Documents Needed" || prop.state.stageName === "Effectuate" || prop.state.stageName === "Pending Effectuate" || prop.state.stageName === "Resolve" || prop.state.stageName === "Case Completed" || prop.state.stageName === "Reopen" || prop.state.stageName === "CaseArchived")
                                        ? true
                                        : false
                                }
                            />
                        </div>
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <label>Denial Code</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Denial_Code" in data && data.Denial_Code.value !== undefined
                                    ? convertToCase(data.Denial_Code.value)
                                    : convertToCase(data.Denial_Code)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, AuthorizationInformationTable.displayName)
                            }
                            name="Denial_Code"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Denial Code"
                          
                        />
                    </div>

                    <div className="col-xs-6 col-md-3">
                        <label>Denial Reason</label>
                        <br />
                        <input
                            type="text"
                            value={
                                "Denial_Reason" in data && data.Denial_Reason.value !== undefined
                                    ? convertToCase(data.Denial_Reason.value)
                                    : convertToCase(data.Denial_Reason)
                            }
                            onChange={(evnt) =>
                                handleGridFieldChange(index, evnt, AuthorizationInformationTable.displayName)
                            }
                            name="Denial_Reason"
                            className="form-control"
                            maxLength="50"
                            title="Please Enter Denial Reason"
                          
                        />
                    </div>


                </div>
            </div>
        );
    };

    const tdData = () => {
        console.log("Inside tdData");

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
                        {lockStatus == "N" && (
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
                        {lockStatus == "V" && (
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

                        <td className="tableData">
                            {"Issue_Number" in data && data.Issue_Number.value !== undefined
                                ? convertToCase(data.Issue_Number.value)
                                : convertToCase(data.Issue_Number)}
                        </td>
                        <td className="tableData">
                            {"Authorization_Number" in data && data.Authorization_Number.value !== undefined
                                ? convertToCase(data.Authorization_Number.value)
                                : convertToCase(data.Authorization_Number)}
                        </td>
                        <td className="tableData">
                            {"Auth_Status" in data &&
                                data.Auth_Status.value !== undefined
                                ? convertToCase(data.Auth_Status.value)
                                : convertToCase(data.Auth_Status)}
                        </td>
                        <td className="tableData">
                            {"Provider_Name" in data &&
                                data.Provider_Name.value !== undefined
                                ? convertToCase(data.Provider_Name.value)
                                : convertToCase(data.Provider_Name)}
                        </td>
                        <td className="tableData">
                            {"Authorization_Type" in data &&
                                data.Authorization_Type.value !== undefined
                                ? convertToCase(data.Authorization_Type.value)
                                : convertToCase(data.Authorization_Type)}
                        </td>
                        <td className="tableData">
                            {"Auth_Type_Description" in data &&
                                data.Auth_Type_Description.value !== undefined
                                ? convertToCase(data.Auth_Type_Description.value)
                                : convertToCase(data.Auth_Type_Description)}
                        </td>
                        <td className="tableData">
                            {"Auth_Request_Date" in data &&
                                data.Auth_Request_Date.value !== undefined
                                ? formatDate(data.Auth_Request_Date.value)
                                : formatDate(data.Auth_Request_Date)}
                        </td>
                        <td className="tableData">
                            {"Auth_Expiration_Date" in data &&
                                data.Auth_Expiration_Date.value !== undefined
                                ? formatDate(data.Auth_Expiration_Date.value)
                                : formatDate(data.Auth_Expiration_Date)}

                        </td>
                        <td className="tableData">
                            {"CPT_Descriptions" in data &&
                                data.CPT_Descriptions.value !== undefined
                                ? convertToCase(data.CPT_Descriptions.value)
                                : convertToCase(data.CPT_Descriptions)}
                        </td>
                        <td className="tableData">
                            {"Service_Start_Date" in data &&
                                data.Service_Start_Date.value !== undefined
                                ? formatDate(data.Service_Start_Date.value)
                                : formatDate(data.Service_Start_Date)}
                        </td>
                        <td className="tableData">
                            {"Denial_Code" in data && data.Denial_Code.value !== undefined
                                ? convertToCase(data.Denial_Code.value)
                                : convertToCase(data.Denial_Code)}
                        </td>
                        <td className="tableData">
                            {"Denial_Reason" in data && data.Denial_Reason.value !== undefined
                                ? convertToCase(data.Denial_Reason.value)
                                : convertToCase(data.Denial_Reason)}
                        </td>
                    </tr>
                );
            });
        }
    }

    const formatDate = (dateObj) => {
        console.log("Inside formatDate ", typeof dateObj);

        if (dateObj) {
            if (typeof dateObj === "string") {
                const localDate = new Date(Date.parse(dateObj));

                console.log(
                    "Inside formatDate typeof",
                    Date.parse(dateObj),
                    localDate.getDate()
                );
                dateObj = localDate;
            } else if (typeof dateObj === "number") {
                const localDate2 = new Date(dateObj);

                console.log("Inside formatDate typeof: ", localDate2.getDate());
                dateObj = localDate2;
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
            let formattedDate = mm + "/" + dd + "/" + yyyy;
            //console.log("formattedDate: ", formattedDate);
            return formattedDate;
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
        // setDataIndex({
        //     ...dataIndex,
        //     ...opertnData
        // });
        //console.log("Handle Modal Change Data Index After: ",dataIndex);
        setModalShow(flag);
    };

    const handleDataIndex = (index) => {
        //console.log("Inside setDataIndex: ",index);
        setDataIndex(index);
    };

    return (
        <>
            <div className="claimTable-container">
                <table className="table table-bordered tableLayout" id="ProviderInformationTable">
                    <thead>
                        <tr className="tableRowStyle tableHeaderColor">
                            {lockStatus == "N" && (
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
                            {lockStatus == "V" && <th style={{ width: "" }}></th>}
                            <th scope="col">Issue Number</th>
                            <th scope="col">Authorization Number</th>
                            <th scope="col">Auth Status</th>
                            <th scope="col">Provider Name</th>
                            <th scope="col">Authorization Type</th>
                            <th scope="col">Auth Type Description</th>
                            <th scope="col">Auth Request Date</th>
                            <th scope="col">Auth Expiration Date</th>
                            <th scope="col">CPT Descriptions</th>
                            <th scope="col">Service Start Date</th>
                            <th scope="col">Denial Code</th>
                            <th scope="col">Denial Reason</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* <TableRows specialityTableRowsData={specialityTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
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