import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ClaimInformationTable from "../TileFormsTables/ClaimInformationTable";
import ReactDatePicker from "react-datepicker";
import Select, { components } from "react-select";
import CaseHeader from './CaseHeader';
import ProviderInformationTable from '../TileFormsTables/ProviderInformationTable';

const CaseClaimInformation = (props) => {
    const {
        convertToCase,
        checkGridJsonLength,
        trimJsonValues,
        extractDate,
        acceptNumbersOnly
    } = useGetDBTables();

    const formikFieldsOnChange = (evnt, setFieldValue, field) => {
        let value = evnt.target.value || "";
        //value = value.toUpperCase().trim();
        value = value.toUpperCase();
        // printConsole("pravallika ", value);
        setFieldValue(field.name, value);
    };
    const { ValueContainer, Placeholder } = components;
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

    const initState = {
    };

    const [claimInformationData, setClaimInformationData] = useState(props.handleData);

    const [claimInformationGridData, setclaimInformationGridData] = useState(props.handleClaimInformationGridData);

    const [providerInformationGridData, setProviderInformationGridData] = useState(props.handleProviderInformationGridData);

    const [gridFieldTempState, setGridFieldTempState] = useState({});
    // const [selectValues, setSelectValues] = useState({});
    // const [apiTestState, setApiTestState] = useState(initState);
    const mastersSelector = useSelector((masters) => masters);

    const RenderDatePickerOriginalDenialDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Original Denial Date" />
            <label htmlFor="datePicker">Original Denial Date</label>
        </div>
    );

    let claimTypeValues = [];
    let decisionValues = [];
    let decisionReasonValues = [];
    let processingStatusValues = [];
    useEffect(() => {
        try {
            if (mastersSelector.hasOwnProperty("masterAngClaimType")) {
                const claimTypeArray =
                    mastersSelector["masterAngClaimType"].length === 0
                        ? []
                        : mastersSelector["masterAngClaimType"][0];
                const uniqueClaimTypeValues = {};

                for (let i = 0; i < claimTypeArray.length; i++) {
                    const claimType = convertToCase(claimTypeArray[i].Claim_Type);
                    if (!uniqueClaimTypeValues[claimType]) {
                        uniqueClaimTypeValues[claimType] = true;
                        claimTypeValues.push({ label: convertToCase(claimTypeArray[i].Claim_Type), value: convertToCase(claimTypeArray[i].Claim_Type) });
                    }
                }
            }

            if (mastersSelector.hasOwnProperty("masterAngDecision")) {
                const decisionArray =
                    mastersSelector["masterAngDecision"].length === 0
                        ? []
                        : mastersSelector["masterAngDecision"][0];
                const decisionReasonArray =
                    mastersSelector["masterAngDecision"].length === 0
                        ? []
                        : mastersSelector["masterAngDecision"][0];
                const uniqueDecisionValues = {};
                const uniqueDecisionReasonValues = {};

                for (let i = 0; i < decisionArray.length; i++) {
                    const decision = convertToCase(decisionArray[i].DECISION);

                    if (!uniqueDecisionValues[decision]) {
                        uniqueDecisionValues[decision] = true;
                        decisionValues.push({ label: convertToCase(decisionArray[i].DECISION), value: convertToCase(decisionArray[i].DECISION) });
                    }
                }
                for (let i = 0; i < decisionReasonArray.length; i++) {
                    const decisionReason = convertToCase(decisionReasonArray[i].DECISION_REASON);

                    if (!uniqueDecisionReasonValues[decisionReason]) {
                        uniqueDecisionReasonValues[decisionReason] = true;
                        decisionReasonValues.push({ label: convertToCase(decisionReasonArray[i].DECISION_REASON), value: convertToCase(decisionReasonArray[i].DECISION_REASON) });
                    }
                }
            }

            if (mastersSelector.hasOwnProperty("masterAngProcessingStatus")) {
                const processingStatusArray =
                    mastersSelector["masterAngProcessingStatus"].length === 0
                        ? []
                        : mastersSelector["masterAngProcessingStatus"][0];
                const uniqueProcessingStatusValues = {};

                for (let i = 0; i < processingStatusArray.length; i++) {
                    const processingStatus = convertToCase(processingStatusArray[i].Processing_Status);

                    if (!uniqueProcessingStatusValues[processingStatus]) {
                        uniqueProcessingStatusValues[processingStatus] = true;
                        processingStatusValues.push({ label: convertToCase(processingStatusArray[i].Processing_Status), value: convertToCase(processingStatusArray[i].Processing_Status) });
                    }
                }


            }
            console.log("props", props);
        } catch (error) {
            console.error("An error occurred in useEffect:", error);
        }
    }, []);

    useEffect(() => {
        console.log("formdataclaiminformation", claimInformationData);
    }, [claimInformationData]);

    const addTableRows = (triggeredFormName, index) => {
        let rowsInput = {};

        if (triggeredFormName === "ClaimInformationTable") {
            rowsInput.rowNumber = claimInformationGridData.length + 1;
        }
        if (triggeredFormName === "ProviderInformationTable") {
            rowsInput.rowNumber = providerInformationGridData.length + 1;
        }
        setGridFieldTempState(rowsInput);
    };

    const deleteTableRows = (index, triggeredFormName, operationValue) => {
        if (
            operationValue !== "Edit" &&
            (operationValue === "Add" || operationValue === "Force Delete")
        ) {
            gridRowsFinalSubmit(triggeredFormName, index, "Delete");
            if (triggeredFormName === "ClaimInformationTable") {
                const rows = [...claimInformationGridData];
                rows.splice(index, 1);
                setclaimInformationGridData(rows);
            }
            if (triggeredFormName === "ProviderInformationTable") {
                const rows = [...providerInformationGridData];
                rows.splice(index, 1);
                setProviderInformationGridData(rows);
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

        if (triggeredFormName === "ClaimInformationTable") {
            rowInput = claimInformationGridData[index];
            setGridFieldTempState(rowInput);
        }
        if (triggeredFormName === "ProviderInformationTable") {
            rowInput = providerInformationGridData[index];
            setGridFieldTempState(rowInput);
        }
    };

    const gridDataRef = useRef({});

    const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
        console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

        let clonedJson = { ...gridFieldTempState };

        console.log("Inside gridRowsFinalSubmit clonedJson value1: ", clonedJson);

        if (Object.keys(gridFieldTempState).length !== 0) {
            if (triggeredFormName === "ClaimInformationTable") {
                let indexJson = claimInformationGridData[index];

                if (indexJson !== undefined && indexJson !== null) {
                    clonedJson = Object.assign(indexJson, gridFieldTempState);
                }

                if (!checkGridJsonLength(clonedJson)) {
                    console.log(
                        "Inside gridRowsFinalSubmit clonedJson if value: ",
                        clonedJson
                    );
                    claimInformationGridData[index] = clonedJson;
                    setclaimInformationGridData(claimInformationGridData);
                }
            }
            if (triggeredFormName === "ProviderInformationTable") {
                let indexJson = providerInformationGridData[index];

                if (indexJson !== undefined && indexJson !== null) {
                    clonedJson = Object.assign(indexJson, gridFieldTempState);
                }

                if (!checkGridJsonLength(clonedJson)) {
                    console.log(
                        "Inside gridRowsFinalSubmit clonedJson if value: ",
                        clonedJson
                    );
                    providerInformationGridData[index] = clonedJson;
                    setProviderInformationGridData(providerInformationGridData);
                }
            }

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

                if (triggeredFormName === "ClaimInformationTable") {
                    gridRowArray = gridDataRef.current.hasOwnProperty("claimInformationTable")
                        ? [...gridDataRef.current.claimInformationTable]
                        : [];
                    gridRowJson = { ...claimInformationGridData[index] };

                    if (Object.keys(gridRowJson).length !== 0) {
                        gridRowJson["operation"] = oprtn;

                        gridRowArray.push(trimJsonValues(gridRowJson));

                        gridDataRef.current.claimInformationTable = getGridDataValues(gridRowArray);
                    }
                }
                if (triggeredFormName === "ProviderInformationTable") {
                    gridRowArray = gridDataRef.current.hasOwnProperty("providerInformationTable")
                        ? [...gridDataRef.current.providerInformationTable]
                        : [];
                    gridRowJson = { ...providerInformationGridData[index] };

                    if (Object.keys(gridRowJson).length !== 0) {
                        gridRowJson["operation"] = oprtn;

                        gridRowArray.push(trimJsonValues(gridRowJson));

                        gridDataRef.current.providerInformationTable = getGridDataValues(gridRowArray);
                    }
                }
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
                        Claim Information
                    </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseclaimInformation"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-claimInformation"
                >
                    <div className="accordion-body">
                        <div class="inputContainer">
                            {/* <label style={{ fontWeight: "bold" }}>Search:</label> */}
                            <label>Claim Search:</label>
                            <div>
                                <input
                                    className="form-control"
                                //   value={globalFilter || ""}
                                //   onChange={(e) => {
                                //     setValue(e.target.value);
                                //     onChange(e.target.value);
                                //   }}
                                //   placeholder={`${count} records...`}
                                />
                            </div>
                        </div>
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                                <Field name="claimnumber">
                                    {({
                                        field,
                                        meta
                                    }) => (
                                        <div className="form-floating">
                                            <input
                                                maxLength="16"
                                                type="numeric"
                                                id="claimnumber"
                                                className={`form-control ${meta.touched && meta.error
                                                    ? "is-invalid"
                                                    : field.value
                                                        ? "is-valid"
                                                        : ""
                                                    }`}
                                                placeholder="Claim Number"
                                                {...field}
                                                onChange={(event) => {
                                                    setClaimInformationData({ ...claimInformationData, 'Claim_Number': event.target['value'] })
                                                }}
                                                onBlur={(event) =>
                                                    props.handleOnChange(event.target['value'], 'Claim_Number')
                                                }
                                                value={convertToCase(claimInformationData['Claim_Number'])}
                                            />
                                            <label htmlFor="floatingInputGrid">
                                                Claim Number
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
                                    name="claimnumber"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="authorizationnumber">
                                    {({
                                        field,
                                        meta
                                    }) => (
                                        <div className="form-floating">
                                            <input
                                                maxLength="9"
                                                type="text"
                                                id="authorizationnumber"
                                                className={`form-control ${meta.touched && meta.error
                                                    ? "is-invalid"
                                                    : field.value
                                                        ? "is-valid"
                                                        : ""
                                                    }`}
                                                placeholder="Authorization Number"
                                                {...field}
                                                onChange={(event) => {
                                                    setClaimInformationData({ ...claimInformationData, 'Authorization_Number': event.target['value'] })
                                                }}
                                                onBlur={(event) =>
                                                    props.handleOnChange(event.target['value'], 'Authorization_Number')
                                                }
                                                value={convertToCase(claimInformationData['Authorization_Number'])}
                                            />
                                            <label htmlFor="floatingInputGrid">
                                                Authorization Number
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
                                    name="authorizationnumber"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="claimtype">
                                    {({
                                        field, // { name, value, onChange, onBlur }
                                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                        meta,
                                    }) => (
                                        <div className="form-floating">
                                            <Select
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        height: "58px",
                                                        fontWeight: "lighter",
                                                    }),
                                                    menuList: (provided) => ({
                                                        ...provided,
                                                        maxHeight: 200,
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        zIndex: 9999,
                                                    }),

                                                    container: (provided, state) => ({
                                                        ...provided,
                                                        marginTop: 0,
                                                    }),
                                                    valueContainer: (provided, state) => ({
                                                        ...provided,
                                                        overflow: "visible",
                                                    }),
                                                    placeholder: (provided, state) => ({
                                                        ...provided,
                                                        position: "absolute",
                                                        top:
                                                            state.hasValue ||
                                                                state.selectProps.inputValue
                                                                ? -15
                                                                : "50%",
                                                        transition:
                                                            "top 0.1s, font-size 0.1s",
                                                        fontSize:
                                                            (state.hasValue ||
                                                                state.selectProps.inputValue) &&
                                                            13,
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        textAlign: "left",
                                                    }),
                                                }}
                                                components={{
                                                    ValueContainer: CustomValueContainer,
                                                }}
                                                isClearable
                                                name={field.name}
                                                isDisabled={
                                                    tabRef.current === "DashboardView" &&
                                                        prop.state.lockStatus !== undefined &&
                                                        prop.state.lockStatus === "Y"
                                                        ? true
                                                        : false
                                                }
                                                className="basic-multi-select"
                                                options={claimTypeValues}
                                                id="claimtype"
                                                isMulti={false}
                                                onChange={(selectValue) =>
                                                    props.handleOnChange(selectValue['value'], 'Claim_type')
                                                }
                                                value={
                                                    {
                                                        label: claimInformationData['Claim_type'],
                                                        value: claimInformationData['Claim_type']
                                                    }
                                                }
                                                placeholder="Claim Type"
                                                //styles={{...customStyles}}
                                                isSearchable={
                                                    document.documentElement.clientHeight >
                                                        document.documentElement.clientWidth
                                                        ? false
                                                        : true
                                                }
                                            />
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
                                    name="claimtype"
                                    className="invalid-feedback"
                                />
                            </div>
                        </div>
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                                <Field name="servicetype">
                                    {({
                                        field, // { name, value, onChange, onBlur }
                                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                        meta,
                                    }) => (
                                        <div className="form-floating">
                                            <Select
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        height: "58px",
                                                        fontWeight: "lighter",
                                                    }),
                                                    menuList: (provided) => ({
                                                        ...provided,
                                                        maxHeight: 200,
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        zIndex: 9999,
                                                    }),

                                                    container: (provided, state) => ({
                                                        ...provided,
                                                        marginTop: 0,
                                                    }),
                                                    valueContainer: (provided, state) => ({
                                                        ...provided,
                                                        overflow: "visible",
                                                    }),
                                                    placeholder: (provided, state) => ({
                                                        ...provided,
                                                        position: "absolute",
                                                        top:
                                                            state.hasValue ||
                                                                state.selectProps.inputValue
                                                                ? -15
                                                                : "50%",
                                                        transition:
                                                            "top 0.1s, font-size 0.1s",
                                                        fontSize:
                                                            (state.hasValue ||
                                                                state.selectProps.inputValue) &&
                                                            13,
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        textAlign: "left",
                                                    }),
                                                }}
                                                components={{
                                                    ValueContainer: CustomValueContainer,
                                                }}
                                                isClearable
                                                name={field.name}
                                                isDisabled={
                                                    tabRef.current === "DashboardView" &&
                                                        prop.state.lockStatus !== undefined &&
                                                        prop.state.lockStatus === "Y"
                                                        ? true
                                                        : false
                                                }
                                                className="basic-multi-select"
                                                options={[
                                                    { label: "CORESYTEM", value: "CORESYSTEM" },
                                                    { label: "MDM", value: "MDM" },
                                                    { label: "USER", value: "USER" }
                                                ]}
                                                id="servicetype"
                                                isMulti={false}
                                                onChange={(selectValue) =>
                                                    props.handleOnChange(selectValue['value'], 'Service_Type')
                                                }
                                                value={
                                                    {
                                                        label: claimInformationData['Service_Type'],
                                                        value: claimInformationData['Service_Type']
                                                    }
                                                }
                                                placeholder="Service Type"
                                                //styles={{...customStyles}}
                                                isSearchable={
                                                    document.documentElement.clientHeight >
                                                        document.documentElement.clientWidth
                                                        ? false
                                                        : true
                                                }
                                            />
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
                                    name="servicetype"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <div style={{}}>
                                    <ReactDatePicker
                                        id="datePicker"
                                        className="form-control example-custom-input-provider"
                                        selected={claimInformationData.Original_Denial_Date}
                                        name="originaldenialdate"
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={(date, event) => {

                                            props.handleOnChange(date, "Original_Denial_Date")
                                        }
                                        }
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerOriginalDenialDate />}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="claimdecision">
                                    {({
                                        field, // { name, value, onChange, onBlur }
                                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                        meta,
                                    }) => (
                                        <div className="form-floating">
                                            <Select
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        height: "58px",
                                                        fontWeight: "lighter",
                                                    }),
                                                    menuList: (provided) => ({
                                                        ...provided,
                                                        maxHeight: 200,
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        zIndex: 9999,
                                                    }),

                                                    container: (provided, state) => ({
                                                        ...provided,
                                                        marginTop: 0,
                                                    }),
                                                    valueContainer: (provided, state) => ({
                                                        ...provided,
                                                        overflow: "visible",
                                                    }),
                                                    placeholder: (provided, state) => ({
                                                        ...provided,
                                                        position: "absolute",
                                                        top:
                                                            state.hasValue ||
                                                                state.selectProps.inputValue
                                                                ? -15
                                                                : "50%",
                                                        transition:
                                                            "top 0.1s, font-size 0.1s",
                                                        fontSize:
                                                            (state.hasValue ||
                                                                state.selectProps.inputValue) &&
                                                            13,
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        textAlign: "left",
                                                    }),
                                                }}
                                                components={{
                                                    ValueContainer: CustomValueContainer,
                                                }}
                                                isClearable
                                                name={field.name}
                                                isDisabled={
                                                    tabRef.current === "DashboardView" &&
                                                        prop.state.lockStatus !== undefined &&
                                                        prop.state.lockStatus === "Y"
                                                        ? true
                                                        : false
                                                }
                                                className="basic-multi-select"
                                                options={decisionValues}
                                                id="claimdecision"
                                                isMulti={false}
                                                onChange={(selectValue) =>
                                                    props.handleOnChange(selectValue['value'], 'Claim_Decision')
                                                }
                                                value={
                                                    {
                                                        label: claimInformationData['Claim_Decision'],
                                                        value: claimInformationData['Claim_Decision']
                                                    }
                                                }
                                                placeholder="Claim Decision"
                                                //styles={{...customStyles}}
                                                isSearchable={
                                                    document.documentElement.clientHeight >
                                                        document.documentElement.clientWidth
                                                        ? false
                                                        : true
                                                }
                                            />
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
                                    name="claimdecision"
                                    className="invalid-feedback"
                                />
                            </div>
                        </div>
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                                <Field name="decisionreason">
                                    {({
                                        field, // { name, value, onChange, onBlur }
                                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                        meta,
                                    }) => (
                                        <div className="form-floating">
                                            <Select
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        height: "58px",
                                                        fontWeight: "lighter",
                                                    }),
                                                    menuList: (provided) => ({
                                                        ...provided,
                                                        maxHeight: 200,
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        zIndex: 9999,
                                                    }),

                                                    container: (provided, state) => ({
                                                        ...provided,
                                                        marginTop: 0,
                                                    }),
                                                    valueContainer: (provided, state) => ({
                                                        ...provided,
                                                        overflow: "visible",
                                                    }),
                                                    placeholder: (provided, state) => ({
                                                        ...provided,
                                                        position: "absolute",
                                                        top:
                                                            state.hasValue ||
                                                                state.selectProps.inputValue
                                                                ? -15
                                                                : "50%",
                                                        transition:
                                                            "top 0.1s, font-size 0.1s",
                                                        fontSize:
                                                            (state.hasValue ||
                                                                state.selectProps.inputValue) &&
                                                            13,
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        textAlign: "left",
                                                    }),
                                                }}
                                                components={{
                                                    ValueContainer: CustomValueContainer,
                                                }}
                                                isClearable
                                                name={field.name}
                                                isDisabled={
                                                    tabRef.current === "DashboardView" &&
                                                        prop.state.lockStatus !== undefined &&
                                                        prop.state.lockStatus === "Y"
                                                        ? true
                                                        : false
                                                }
                                                className="basic-multi-select"
                                                options={decisionReasonValues}
                                                id="decisionreason"
                                                isMulti={false}
                                                onChange={(selectValue) =>
                                                    props.handleOnChange(selectValue['value'], 'Decision_Reason')
                                                }
                                                value={
                                                    {
                                                        label: claimInformationData['Decision_Reason'],
                                                        value: claimInformationData['Decision_Reason']
                                                    }
                                                }
                                                placeholder="Decision Reason"
                                                //styles={{...customStyles}}
                                                isSearchable={
                                                    document.documentElement.clientHeight >
                                                        document.documentElement.clientWidth
                                                        ? false
                                                        : true
                                                }
                                            />
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
                                    name="decisionreason"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="processingstaus">
                                    {({
                                        field, // { name, value, onChange, onBlur }
                                        form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
                                        meta,
                                    }) => (
                                        <div className="form-floating">
                                            <Select
                                                styles={{
                                                    control: (provided) => ({
                                                        ...provided,
                                                        height: "58px",
                                                        fontWeight: "lighter",
                                                    }),
                                                    menuList: (provided) => ({
                                                        ...provided,
                                                        maxHeight: 200,
                                                    }),
                                                    menu: (provided) => ({
                                                        ...provided,
                                                        zIndex: 9999,
                                                    }),

                                                    container: (provided, state) => ({
                                                        ...provided,
                                                        marginTop: 0,
                                                    }),
                                                    valueContainer: (provided, state) => ({
                                                        ...provided,
                                                        overflow: "visible",
                                                    }),
                                                    placeholder: (provided, state) => ({
                                                        ...provided,
                                                        position: "absolute",
                                                        top:
                                                            state.hasValue ||
                                                                state.selectProps.inputValue
                                                                ? -15
                                                                : "50%",
                                                        transition:
                                                            "top 0.1s, font-size 0.1s",
                                                        fontSize:
                                                            (state.hasValue ||
                                                                state.selectProps.inputValue) &&
                                                            13,
                                                    }),
                                                    option: (provided, state) => ({
                                                        ...provided,
                                                        textAlign: "left",
                                                    }),
                                                }}
                                                components={{
                                                    ValueContainer: CustomValueContainer,
                                                }}
                                                isClearable
                                                name={field.name}
                                                isDisabled={
                                                    tabRef.current === "DashboardView" &&
                                                        prop.state.lockStatus !== undefined &&
                                                        prop.state.lockStatus === "Y"
                                                        ? true
                                                        : false
                                                }
                                                className="basic-multi-select"
                                                options={processingStatusValues}
                                                id="processingstatus"
                                                isMulti={false}
                                                onChange={(selectValue) =>
                                                    props.handleOnChange(selectValue['value'], 'Processing_Status')
                                                }
                                                value={
                                                    {
                                                        label: claimInformationData['Processing_Status'],
                                                        value: claimInformationData['Processing_Status']
                                                    }
                                                }
                                                placeholder="Processing Status"
                                                //styles={{...customStyles}}
                                                isSearchable={
                                                    document.documentElement.clientHeight >
                                                        document.documentElement.clientWidth
                                                        ? false
                                                        : true
                                                }
                                            />
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
                                    name="processingStatus"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="reasonText">
                                    {({
                                        field,
                                        meta
                                    }) => (
                                        <div className="form-floating">
                                            <input
                                                maxLength="4000"
                                                type="text"
                                                id="reasontextr"
                                                className={`form-control ${meta.touched && meta.error
                                                    ? "is-invalid"
                                                    : field.value
                                                        ? "is-valid"
                                                        : ""
                                                    }`}
                                                placeholder="Reason Text"
                                                {...field}
                                                onChange={(event) => {
                                                    setClaimInformationData({ ...claimInformationData, 'Reason_Text': event.target['value'] })
                                                }}
                                                onBlur={(event) =>
                                                    props.handleOnChange(event.target['value'], 'Reason_Text')
                                                }
                                                value={convertToCase(claimInformationData['Reason_Text'])}
                                            />
                                            <label htmlFor="floatingInputGrid">
                                                Reason Text
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
                                    name="reasonText"
                                    className="invalid-feedback"
                                />
                            </div>
                        </div>
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                                <Field name="effectuationNotes">
                                    {({
                                        field,
                                        meta
                                    }) => (
                                        <div className="form-floating">
                                            <input
                                                maxLength="4000"
                                                type="text"
                                                id="effectuationNotes"
                                                className={`form-control ${meta.touched && meta.error
                                                    ? "is-invalid"
                                                    : field.value
                                                        ? "is-valid"
                                                        : ""
                                                    }`}
                                                placeholder="EffectuationNotes"
                                                {...field}
                                                onChange={(event) => {
                                                    setClaimInformationData({ ...claimInformationData, 'Effectuation_Notes': event.target['value'] })
                                                }}
                                                onBlur={(event) =>
                                                    props.handleOnChange(event.target['value'], 'Effectuation_Notes')
                                                }
                                                value={convertToCase(claimInformationData['Effectuation_Notes'])}
                                            />
                                            <label htmlFor="floatingInputGrid">
                                                Effectuation Notes
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
                                    name="effectuationNotes"
                                    className="invalid-feedback"
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-xs-6 col-md-12">
                                <ClaimInformationTable
                                    claimInformationGridData={claimInformationGridData}
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
                                ></ClaimInformationTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="accordion-item" id="providerInformation">
                <h2
                    className="accordion-header"
                    id="panelsStayOpen-providerInformation"
                >
                    <button
                        className="accordion-button accordionButtonStyle"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseproviderInformation"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                    >
                        Provider Information
                    </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseproviderInformation"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-providerInformation"
                >
                    <div className="accordion-body">
                        <div className="row">
                            <div className="col-xs-6 col-md-12">
                                <ProviderInformationTable
                                    providerInformationGridData={providerInformationGridData}
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
                                ></ProviderInformationTable>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default CaseClaimInformation;