import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import Select, { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseHeader from './CaseHeader';
import AuthorizationInformationTable from "../TileFormsTables/AuthorizationInformationTable";
import useUpdateDecision from '../../CustomHooks/useUpdateDecision';

const AuthorizationInformationAccordion = (props) => {
    const {
        convertToCase,
        checkGridJsonLength,
        trimJsonValues,
        extractDate,
        getDatePartOnly,
        acceptNumbersOnly
    } = useGetDBTables();

    const { getRowNumberForGrid } = useUpdateDecision();

    const { ValueContainer, Placeholder } = components;

    const [authorizationInformationData, setAuthorizationInformationData] =
        useState(props.handleData);

    const [authorizationInformationGridData, setAuthorizationInformationGridData] = useState(props.handleAuthorizationInformationGridData);

    const [gridFieldTempState, setGridFieldTempState] = useState({});

    const mastersSelector = useSelector((masters) => masters);

    const CustomValueContainer = ({ children, ...props }) => {
        return (
            <ValueContainer {...props}>
                <Placeholder {...props} isFocused={props.isFocused}>
                    {props.selectProps.placeholder}
                </Placeholder>
                {React.Children.map(children, (child) =>
                    child && child.type !== Placeholder ? child : null
                )}
            </ValueContainer>
        );
    };

    const tabRef = useRef("HomeView");
    let prop = useLocation();
    const fetchAutoPopulate = useRef(false);

    const gridDataRef = useRef({});

    useEffect(() => {
        console.log("formdataauthorizationinformation", authorizationInformationData);
    }, [authorizationInformationData]);

    const addTableRows = (triggeredFormName, index) => {
        let rowsInput = {};

        if (triggeredFormName === "AuthorizationInformationTable") {
            rowsInput.rowNumber = getRowNumberForGrid(authorizationInformationGridData);
        }
        setGridFieldTempState(rowsInput);
    };

    const deleteTableRows = (index, triggeredFormName, operationValue) => {
        if (
            operationValue !== "Edit" &&
            (operationValue === "Add" || operationValue === "Force Delete")
        ) {
            gridRowsFinalSubmit(triggeredFormName, index, "Delete");
            if (triggeredFormName === "AuthorizationInformationTable") {
                console.log("auth delete");
                const rows = [...authorizationInformationGridData];
                rows.splice(index, 1);
                setAuthorizationInformationGridData(rows);
                props.updateAuthorizationInformationGridData(rows);
            }
        }

        if (operationValue === "Edit") {
            setGridFieldTempState({});
        }
    };

    const handleGridSelectChange = (
        index,
        selectedValue,
        evnt,
        triggeredFormName
    ) => {
        // console.log("Inside select change index: ", index);
        console.log("Inside select change selectedValue: ", evnt, selectedValue);
        // console.log("Inside select change evnt: ", evnt);
        // console.log("Inside select change trigeredFormName: ", triggeredFormName);
        let rowsInput = { ...gridFieldTempState };

        const { name } = evnt;
        let val = selectedValue;
        if (evnt.action === "clear") {
            if (name.toLowerCase() === "languages") {
                val = [];
            }
            else {
                val = { label: "", value: "" };
            }
        } else {

            if (selectedValue && selectedValue.label && selectedValue.value) {
                val = {
                    label: selectedValue.label.toUpperCase(),
                    value: selectedValue.value.toUpperCase(),
                };
            } else {
                // Handle the case where selectedValue or its properties are undefined
                console.log("selectedValue or its properties are undefined");
            }
        }

        console.log("Inside handleSelectChange Val: ", val);
        rowsInput[name] = val;

        setGridFieldTempState(rowsInput);
    };

    const handleGridDateChange = (
        index,
        selectedValue,
        fieldName,
        triggeredFormName
    ) => {
        let tempInput = { ...gridFieldTempState };
        tempInput[fieldName] = selectedValue;
        //console.log("Inside handleGridDateChange tempInput: ",tempInput);
        setGridFieldTempState(tempInput);
    };

    const handleGridFieldChange = (index, evnt, triggeredFormName) => {
        console.log("Inside handleGridFieldChange: ", triggeredFormName);
        //let rowsInput = "";

        let tempInput = { ...gridFieldTempState };
        let { name, value } = evnt.target;
        console.log("Inside handleGridFieldChange: ", value, tempInput);

        tempInput[name] = value.toUpperCase();
        setGridFieldTempState(tempInput);
        console.log("gridFieldTempState", gridFieldTempState);
    };

    const editTableRows = (index, triggeredFormName) => {
        console.log("Inside editTableRows: ", triggeredFormName);
        let rowInput = {};

        if (triggeredFormName === "AuthorizationInformationTable") {
            rowInput = authorizationInformationGridData[index];
            setGridFieldTempState(rowInput);
        }
        // if (triggeredFormName === "ProviderInformationTable") {
        //     rowInput = providerInformationGridData[index];
        //     setGridFieldTempState(rowInput);
        // }
    };

    const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
        console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

        let clonedJson = { ...gridFieldTempState };

        console.log("Inside gridRowsFinalSubmit clonedJson value1: ", clonedJson);

        if (Object.keys(gridFieldTempState).length !== 0) {
            if (triggeredFormName === "AuthorizationInformationTable") {
                let indexJson = authorizationInformationGridData[index];

                if (indexJson !== undefined && indexJson !== null) {
                    clonedJson = Object.assign(indexJson, gridFieldTempState);
                }

                if (!checkGridJsonLength(clonedJson)) {
                    console.log(
                        "Inside gridRowsFinalSubmit clonedJson if value: ",
                        clonedJson
                    );
                    authorizationInformationGridData[index] = clonedJson;
                    setAuthorizationInformationGridData(authorizationInformationGridData);
                }
            }
            // if (triggeredFormName === "ProviderInformationTable") {
            //     let indexJson = providerInformationGridData[index];

            //     if (indexJson !== undefined && indexJson !== null) {
            //         clonedJson = Object.assign(indexJson, gridFieldTempState);
            //     }

            //     if (!checkGridJsonLength(clonedJson)) {
            //         console.log(
            //             "Inside gridRowsFinalSubmit clonedJson if value: ",
            //             clonedJson
            //         );
            //         providerInformationGridData[index] = clonedJson;
            //         setProviderInformationGridData(providerInformationGridData);
            //     }
            // }

            //Handling for data update/Delete/Insert inside grids.
            if (tabRef.current === "DashboardView") {
                //let gridRow = getGridDataArray(triggeredFormName);
                //console.log('gridRowsFinalSubmit gridRow: ',gridRow);
                let oprtn;
                let gridRowJson = {};
                //alert('Operation type: ',operationType);
                console.log("Operation type: ", operationType);
                if (operationType === "Add") {
                    oprtn = "I";
                }

                if (operationType === "Edit") {
                    oprtn = "U";
                }

                if (operationType === "Delete") {
                    oprtn = "D";
                }
                let gridRowArray = [];

                if (triggeredFormName === "AuthorizationInformationTable") {
                    gridRowArray = gridDataRef.current.hasOwnProperty("authorizationInformationTable")
                        ? [...gridDataRef.current.authorizationInformationTable]
                        : [];
                    gridRowJson = { ...authorizationInformationGridData[index] };

                    if (Object.keys(gridRowJson).length !== 0) {
                        gridRowJson["operation"] = oprtn;

                        gridRowArray.push(trimJsonValues(gridRowJson));

                        gridDataRef.current.authorizationInformationTable = getGridDataValues(gridRowArray);
                    }
                }
                // if (triggeredFormName === "ProviderInformationTable") {
                //     gridRowArray = gridDataRef.current.hasOwnProperty("providerInformationTable")
                //         ? [...gridDataRef.current.providerInformationTable]
                //         : [];
                //     gridRowJson = { ...providerInformationGridData[index] };

                //     if (Object.keys(gridRowJson).length !== 0) {
                //         gridRowJson["operation"] = oprtn;

                //         gridRowArray.push(trimJsonValues(gridRowJson));

                //         gridDataRef.current.providerInformationTable = getGridDataValues(gridRowArray);
                //     }
                // }
            }
        };
    }

    const getGridDataValues = (tableData) => {
        //var headers = document.getElementById(tableId).headers;
        let returnArray = [];
        tableData.map((data) => {
            const dataObject = {};
            const dataKeys = Object.keys(data);
            dataKeys.forEach((dataValue) => {
                const dataKeyType = typeof data[dataValue];
                console.log("data key : ", dataValue, " type: ", dataKeyType);
                if (dataKeys.includes("license") && dataValue === "expirationDate") {
                    //console.log('----------------------dataKeyType----------------------', dataKeyType, dataValue, data[dataValue], data[dataValue].value);
                }

                if (dataKeyType === "object") {
                    console.log("Inside Data Object if: ", dataObject);
                    if (!!data[dataValue]) {
                        if (!!data[dataValue].value) {
                            if (data[dataValue].value instanceof Date) {
                                // dataObject[dataValue] =
                                //   data[dataValue].value.toLocaleDateString();
                                dataObject[dataValue] = extractDate(data[dataValue].value);
                            } else {
                                dataObject[dataValue] = data[dataValue].value;
                            }
                        }

                        //Added by Nidhi Gupta on 6/12/2023
                        else if (data[dataValue].value == "") {
                            dataObject[dataValue] = "";
                        } else {
                            if (data[dataValue] instanceof Date) {
                                //dataObject[dataValue] = data[dataValue].toLocaleDateString();
                                dataObject[dataValue] = extractDate(data[dataValue]);
                            } else {
                                dataObject[dataValue] = data[dataValue];
                            }
                        }
                        // else {
                        //      dataObject[dataValue] = '';
                        //  }
                        //till here
                    } else {
                        dataObject[dataValue] = "";
                    }
                    //dataObject[dataValue] = (data[dataValue].value!==undefined)?data[dataValue].value:'');
                }
                if (dataKeyType !== "object") {
                    dataObject[dataValue] = data[dataValue];
                }
            });
            //dataObject.caseNumber = caseNumber;
            returnArray.push(trimJsonValues(dataObject));
        });
        return returnArray;
    };

    return (
        <div>
            <div className="accordion-item" id="claimInformation">
                <h2
                    className="accordion-header"
                    id="panelsStayOpen-claimInformation"
                >
                    <button
                        className="accordion-button accordionButtonStyle"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseclaimInformation"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                    >
                        Authorization Information
                    </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseclaimInformation"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-claimInformation"
                >
                    <div className="accordion-body">
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                                <Field name="authdecision">
                                    {({
                                        field,
                                        meta
                                    }) => (
                                        <div className="form-floating">
                                            <input
                                                maxLength="30"
                                                type="text"
                                                id="authdecision"
                                                className={`form-control ${meta.touched && meta.error
                                                    ? "is-invalid"
                                                    : field.value
                                                        ? "is-valid"
                                                        : ""
                                                    }`}
                                                placeholder="Authorization Decision"
                                                {...field}
                                                onChange={(event) => {
                                                    setAuthorizationInformationData({ ...authorizationInformationData, 'Authorization_Decision': event.target['value'] })
                                                }}
                                                onBlur={(event) =>
                                                    props.handleOnChange(event.target['value'], 'Authorization_Decision')
                                                }
                                                value={convertToCase(authorizationInformationData['Authorization_Decision'])}
                                            />
                                            <label htmlFor="floatingInputGrid">
                                                Authorization Decision
                                            </label>
                                            {meta.touched && meta.error && (
                                                <div
                                                    className="invalid-feedback"
                                                    style={{ display: "block" }}
                                                >
                                                    {meta.error}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage
                                    component="div"
                                    name="authdecision"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="authdecisionreason">
                                    {({
                                        field,
                                        meta
                                    }) => (
                                        <div className="form-floating">
                                            <input
                                                maxLength="30"
                                                type="text"
                                                id="authdecisionreason"
                                                className={`form-control ${meta.touched && meta.error
                                                    ? "is-invalid"
                                                    : field.value
                                                        ? "is-valid"
                                                        : ""
                                                    }`}
                                                placeholder="Authorization Decision Reason"
                                                {...field}
                                                onChange={(event) => {
                                                    setAuthorizationInformationData({ ...authorizationInformationData, 'Authorization_Decision_Reason': event.target['value'] })
                                                }}
                                                onBlur={(event) =>
                                                    props.handleOnChange(event.target['value'], 'Authorization_Decision_Reason')
                                                }
                                                value={convertToCase(authorizationInformationData['Authorization_Decision_Reason'])}
                                            />
                                            <label htmlFor="floatingInputGrid">
                                                Authorization Decision Reason
                                            </label>
                                            {meta.touched && meta.error && (
                                                <div
                                                    className="invalid-feedback"
                                                    style={{ display: "block" }}
                                                >
                                                    {meta.error}
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </Field>
                                <ErrorMessage
                                    component="div"
                                    name="authdecisionreason"
                                    className="invalid-feedback"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6 col-md-12">
                                <AuthorizationInformationTable
                                    authorizationInformationGridData={authorizationInformationGridData}
                                    addTableRows={addTableRows}
                                    deleteTableRows={deleteTableRows}
                                    handleGridSelectChange={handleGridSelectChange}
                                    handleGridDateChange={handleGridDateChange}
                                    handleGridFieldChange={handleGridFieldChange}
                                    gridFieldTempState={gridFieldTempState}
                                    editTableRows={editTableRows}
                                    gridRowsFinalSubmit={gridRowsFinalSubmit}
                                    //selectJson={selectValues}
                                    lockStatus={
                                        prop.state !== null &&
                                            prop.state.lockStatus !== undefined &&
                                            prop.state.lockStatus !== ""
                                            ? prop.state.lockStatus
                                            : "N"
                                    }
                                    fetchAutoPopulate={fetchAutoPopulate}
                                    transactionType={CaseHeader.displayName}
                                ></AuthorizationInformationTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default AuthorizationInformationAccordion;