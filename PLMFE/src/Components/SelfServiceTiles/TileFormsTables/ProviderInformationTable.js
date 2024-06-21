import React, { useState } from "react";
import GridModal from "./GridModal";
import ReactDatePicker from "react-datepicker";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export default function ProviderInformationTable({
    providerInformationGridData,
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
    ProviderInformationTable.displayName = "ProviderInformationTable";

    const [dataIndex, setDataIndex] = useState();

    const [operationValue, setOperationValue] = useState("");

    const [modalShow, setModalShow] = useState(false);

    const [isTouched, setIsTouched] = useState({});

    const { getGridJson, convertToCase } = useGetDBTables();

    const tdDataReplica = (index) => {
        console.log("Inside tdDataReplica");

        const data = getGridJson(gridFieldTempState);

        // selectJson["lineNumberOptions"].map((val) =>
        //     lineNumberOptions.push({ value: val, label: val })
        // );

        return (
            <>
                <div className="Container AddProviderLabel AddModalLabel">
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label>Issue Number</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Issue_Number" in data && data.Issue_Number.value !== undefined
                                        ? convertToCase(data.Issue_Number.value)
                                        : convertToCase(data.Issue_Number)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ProviderInformationTable.displayName)
                                }
                                name="Issue_Number"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Provider Id</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Provider_ID" in data && data.Provider_ID.value !== undefined
                                        ? convertToCase(data.Provider_ID.value)
                                        : convertToCase(data.Provider_ID)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ProviderInformationTable.displayName)
                                }
                                name="Provider_ID"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Sequential Provider Id</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Sequential_Provider_ID" in data && data.Sequential_Provider_ID.value !== undefined
                                        ? convertToCase(data.Sequential_Provider_ID.value)
                                        : convertToCase(data.Sequential_Provider_ID)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ProviderInformationTable.displayName)
                                }
                                name="Sequential_Provider_ID"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
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
                                    handleGridFieldChange(index, evnt, ProviderInformationTable.displayName)
                                }
                                name="Provider_Name"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-6 col-md-3">
                            <label>Email Address</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Email_Address" in data && data.Email_Address.value !== undefined
                                        ? convertToCase(data.Email_Address.value)
                                        : convertToCase(data.Email_Address)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ProviderInformationTable.displayName)
                                }
                                name="Email_Address"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>Point of Contact</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "Point_of_Contact" in data && data.Point_of_Contact.value !== undefined
                                        ? convertToCase(data.Point_of_Contact.value)
                                        : convertToCase(data.Point_of_Contact)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ProviderInformationTable.displayName)
                                }
                                name="Point_of_Contact"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>City</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "City" in data && data.City.value !== undefined
                                        ? convertToCase(data.City.value)
                                        : convertToCase(data.City)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ProviderInformationTable.displayName)
                                }
                                name="City"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                        <div className="col-xs-6 col-md-3">
                            <label>State</label>
                            <br />
                            <input
                                type="text"
                                value={
                                    "State" in data && data.State.value !== undefined
                                        ? convertToCase(data.State.value)
                                        : convertToCase(data.State)
                                }
                                onChange={(evnt) =>
                                    handleGridFieldChange(index, evnt, ProviderInformationTable.displayName)
                                }
                                name="State"
                                className="form-control"
                                maxLength="50"
                                title="Please Enter Valid Type"
                                disabled={lockStatus == "V"}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
        //}
    };

    const tdData = () => {
        console.log("Inside tdData");
        if (
            providerInformationGridData !== undefined &&
            providerInformationGridData.length > 0
        ) {
            return providerInformationGridData.map((data, index) => {
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
                                            style={{ float: "left" }}
                                            onClick={() => {
                                                deleteTableRows(
                                                    index,
                                                    ProviderInformationTable.displayName,
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
                                            style={{ float: "right" }}
                                            type="button"
                                            onClick={() => {
                                                editTableRows(index, ProviderInformationTable.displayName);
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
                            {"Provider_ID" in data &&
                                data.Provider_ID.value !== undefined
                                ? formatDate(data.Provider_ID.value)
                                : formatDate(data.Provider_ID)}
                        </td>
                        <td className="tableData">
                            {"Sequential_Provider_ID" in data && data.Sequential_Provider_ID.value !== undefined
                                ? convertToCase(data.Sequential_Provider_ID.value)
                                : convertToCase(data.Sequential_Provider_ID)}
                        </td>
                        <td className="tableData">
                            {"Provider_Name" in data &&
                                data.Provider_Name.value !== undefined
                                ? convertToCase(data.Provider_Name.value)
                                : convertToCase(data.Provider_Name)}
                        </td>
                        <td className="tableData">
                            {"Email_Address" in data &&
                                data.Email_Address.value !== undefined
                                ? convertToCase(data.Email_Address.value)
                                : convertToCase(data.Email_Address)}
                        </td>
                        <td className="tableData">
                            {"Point_of_Contact" in data &&
                                data.Point_of_Contact.value !== undefined
                                ? convertToCase(data.Point_of_Contact.value)
                                : convertToCase(data.Point_of_Contact)}
                        </td>
                        <td className="tableData">
                            {"City" in data &&
                                data.City.value !== undefined
                                ? convertToCase(data.City.value)
                                : convertToCase(data.City)}
                        </td>
                        <td className="tableData">
                            {"State" in data &&
                                data.State.value !== undefined
                                ? convertToCase(data.State.value)
                                : convertToCase(data.State)}
                        </td>
                    </tr>
                );
            });
        }
    };

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
            <table className="table table-bordered tableLayout" id="ProviderInformationTable">
                <thead>
                    <tr className="tableRowStyle tableHeaderColor">
                        {lockStatus == "N" && (
                            <th style={{ width: "5%" }}>
                                <button
                                    className="addBtn"
                                    onClick={() => {
                                        addTableRows(ProviderInformationTable.displayName);
                                        handleModalChange(true);
                                        handleDataIndex(providerInformationGridData.length);
                                        handleOperationValue("Add");
                                    }}
                                >
                                    <i className="fa fa-plus"></i>
                                </button>
                            </th>
                        )}
                        {lockStatus == "V" && <th style={{ width: "15%" }}></th>}
                        <th scope="col">Issue Number</th>
                        <th scope="col">Provider Id</th>
                        <th scope="col">Sequential Provider Id</th>
                        <th scope="col">Provider Name</th>
                        <th scope="col">Email Address</th>
                        <th scope="col">Point of Contact</th>
                        <th scope="col">City</th>
                        <th scope="col">State</th>
                        {/* <th scope="col">Provider Role</th>
                        <th scope="col">Provider TIN</th>
                        <th scope="col">NPI ID</th>
                        <th scope="col">State Provider Id</th>
                        <th scope="col">Medicare Id</th>
                        <th scope="col">Medicaid Id</th>
                        <th scope="col">PR Reprsentative</th>
                        <th scope="col">Participating Provider</th>
                        <th scope="col">Provider Type</th>
                        <th scope="col">Provider IPA</th>
                        <th scope="col">Provider/Vendor Speciality</th>
                        <th scope="col">Provider/Vendor Speciality Description</th>
                        <th scope="col">Par Provider Start Date</th>
                        <th scope="col">Par Provider End Date</th>
                        <th scope="col">Vendor Id</th>
                        <th scope="col">Vendor Name</th>
                        <th scope="col">Point of Contact</th>
                        <th scope="col">Phone Number</th> */}
                    </tr>
                </thead>
                <tbody>
                    {/* <TableRows specialityTableRowsData={specialityTableRowsData} deleteTableRows={deleteTableRows} handleChange={handleChange} specialityArray={specialityArray}/> */}
                    {tdData()}
                </tbody>
            </table>
            <GridModal
                name="Provider Information"
                validationObject={isTouched}
                modalShow={modalShow}
                handleModalChange={handleModalChange}
                dataIndex={dataIndex}
                tdDataReplica={tdDataReplica}
                deleteTableRows={deleteTableRows}
                gridName={ProviderInformationTable.displayName}
                decreaseDataIndex={decreaseDataIndex}
                operationValue={operationValue}
                gridRowsFinalSubmit={gridRowsFinalSubmit}
                lockStatus={lockStatus}
            ></GridModal>
        </>
    );
}