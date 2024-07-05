import React, { useState, useRef, useEffect } from 'react';
import { useAxios } from "../../../api/axios.hook";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ClaimInformationTable from "../TileFormsTables/ClaimInformationTable";
import ReactDatePicker from "react-datepicker";
import Select, { components } from "react-select";
import CaseHeader from './CaseHeader';
import ProviderInformationTable from '../TileFormsTables/ProviderInformationTable';
import TableComponent from "../../../../src/util/TableComponent";
import ClaimSearch from "../TileForms/ClaimSearch";
import ProviderSearch from "../TileForms/ProviderSearch";
import useUpdateDecision from '../../CustomHooks/useUpdateDecision';

const CaseClaimInformation = (props) => {
    const {
        convertToCase,
        checkGridJsonLength,
        trimJsonValues,
        extractDate,
        getDatePartOnly,
        acceptNumbersOnly
    } = useGetDBTables();

    const { getRowNumberForGrid } = useUpdateDecision();

    const [selectedCriteria, setSelectedCriteria] = useState();

    const [selectSearchValues, setSelectSearchValues] = useState();
    const [caseUnlockState, setCaseUnlockState] = useState(-1);

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

    const { customAxios: axios } = useAxios();
    const token = useSelector((state) => state.auth.token);
    const [claimInformationData, setClaimInformationData] = useState(props.handleData);

    const [claimInformationGridData, setclaimInformationGridData] = useState(props.handleClaimInformationGridData);

    const [providerInformationGridData, setProviderInformationGridData] = useState(props.handleProviderInformationGridData);

    const [formData, setFormData] = useState(props.handleFormData);

    const [showClaimSearch, setShowClaimSearch] = useState(false);
    const [showProviderSearch, setshowProviderSearch] = useState(false);
    const [gridFieldTempState, setGridFieldTempState] = useState({});

    const [responseData, setResponseData] = useState([]);
    let [selectedAddress, setSelectedAddress] = useState([]);

    // const [selectValues, setSelectValues] = useState({});
    // const [apiTestState, setApiTestState] = useState(initState);
    const mastersSelector = useSelector((masters) => masters);

    useEffect(() => {
        console.log("claim grid dataa", claimInformationGridData);
    }, [claimInformationGridData]);

    const RenderDatePickerOriginalDenialDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Original Denial Date" />
            <label htmlFor="datePicker">Original Denial Date</label>
        </div>
    );
    const RenderDatePickerServiceStartDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Service Start Date" />
            <label htmlFor="datePicker">Service Start Date</label>
        </div>
    );
    const RenderDatePickerServiceEndDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Service End Date" />
            <label htmlFor="datePicker">Service End Date</label>
        </div>
    );
    const RenderDatePickerClaimAdjustedDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Claim Adjusted Date" />
            <label htmlFor="datePicker">Claim Adjusted Date</label>
        </div>
    );
    const RenderDatePickerPaymentDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Payment Date" />
            <label htmlFor="datePicker">Payment Date</label>
        </div>
    );
    const RenderDatePickerPaymentMailDate = (props) => (
        <div className="form-floating">
            <input {...props} placeholder="Payment Mail Date" />
            <label htmlFor="datePicker">Payment Mail Date</label>
        </div>
    );

    const handleShowClaimSearch = () => {
        setShowClaimSearch(true);

    }
    const handleShowProviderSearch = () => {
        setshowProviderSearch(true);

    }



    const handleCloseSearch = () => {
        setShowClaimSearch(false);
        setshowProviderSearch(false);
        setSelectedCriteria([]);
        setSelectSearchValues([]);
        setResponseData([]);

    }
    const handleClearClaimSearch = () => {
        setSelectSearchValues([]);
        setSelectedCriteria([]);
        setResponseData([]);
    }
    const handleSelectedAddress = (flag) => {

        console.log("grid column names ---->", claimInformationGridData)
        // setClaimInformationData({...selectedAddress[0]});
        let rowNumber = getRowNumberForGrid(claimInformationGridData)

        console.log("rownum", rowNumber);
        let addressToPopulate = []
        console.log("selected Address values", selectedAddress);
        if (selectedAddress.length > 0) {
            selectedAddress.map((elem) => {
                if (elem?.isChecked) {
                    console.log("elem is ", elem);
                    elem.rowNumber = rowNumber;
                    elem.operation = 'I';
                    delete elem['isChecked'];
                    rowNumber++;
                    addressToPopulate.push(elem);
                }

            })
        }
        //gridFieldTempState(checkedRef.current);
        console.log("checkedRef.current value==== ", addressToPopulate);
        if (addressToPopulate.length > 0) {
            setclaimInformationGridData([...claimInformationGridData, ...addressToPopulate])
            // setClaimInformationData([...claimInformationData,...addressToPopulate])
            //console.log("INSIDE gridTableDataRef.locationTable1==== ",gridTableDataRef);
            //   let gridTableDataRefCopy = gridTableDataRef.hasOwnProperty("locationTable") ? gridTableDataRef?.locationTable: [];
            //   gridTableDataRef.locationTable = [...gridTableDataRefCopy,...addressToPopulate]
            //   console.log("INSIDE gridTableDataRef.locationTable==== ",gridTableDataRef);
            //   gridFieldTempState = {};
        }
        console.log("grid column names 222---->", claimInformationGridData, claimInformationData);
        //setFetchAddressModalShow(flag);
        //handleModalChange(false);
        setShowClaimSearch(false);
        // setGridFieldTempState({});
        setSelectedCriteria([]);
        setSelectSearchValues([]);
        setResponseData([]);
    }

    const handleSelectedProviders = (flag) => {
        // if (caseUnlockState !== -1) {
        //     alert("Please select atleast one case.");
        //   }
        //   else{
        //     alert("Data populated successfully")
        //   }

        //let rowNumber = locationTableRowsData.length+1;
        console.log("providerInformationGridData ---->", providerInformationGridData)
        // setClaimInformationData({...selectedAddress[0]});

        let rowNumber = getRowNumberForGrid(providerInformationGridData)
        console.log("rownum", rowNumber);
        let addressToPopulate = []
        console.log("selected Address values", selectedAddress);
        if (selectedAddress.length > 0) {
            selectedAddress.map((elem) => {
                if (elem?.isChecked) {
                    console.log("elem is ", elem);
                    elem.rowNumber = rowNumber;
                    elem.operation = 'I';
                    delete elem['isChecked'];
                    rowNumber++;
                    addressToPopulate.push(elem);
                }

            })
        }
        //gridFieldTempState(checkedRef.current);
        console.log("checkedRef.current value==== ", addressToPopulate);
        if (addressToPopulate.length > 0) {
            setProviderInformationGridData([...providerInformationGridData, ...addressToPopulate])
            // setClaimInformationData([...claimInformationData,...addressToPopulate])
            //console.log("INSIDE gridTableDataRef.locationTable1==== ",gridTableDataRef);
            //   let gridTableDataRefCopy = gridTableDataRef.hasOwnProperty("locationTable") ? gridTableDataRef?.locationTable: [];
            //   gridTableDataRef.locationTable = [...gridTableDataRefCopy,...addressToPopulate]
            //   console.log("INSIDE gridTableDataRef.locationTable==== ",gridTableDataRef);
            //   gridFieldTempState = {};
        }
        console.log("grid column names 222---->", providerInformationGridData, providerInformationGridData);
        //setFetchAddressModalShow(flag);
        //handleModalChange(false);
        setshowProviderSearch(false);
        // setGridFieldTempState({});
        setSelectedCriteria([]);
        setSelectSearchValues([]);
        setResponseData([]);
    }



    const handleCheckBoxChange = (evnt, ind) => {
        let jsn = responseData[ind];
        console.log("event of checkbox", evnt);
        jsn.isChecked = evnt.target.checked;
        setSelectedAddress([...selectedAddress, jsn]);

    };

    const handleCheckBoxHeaderChange = (evnt) => {
        console.log("tableData at select of header1", responseData);
        const updatedTableData = responseData.map((jsn) => {
            jsn.isChecked = evnt.target.checked;
            return jsn;
        });
        console.log("tableData at select of header", updatedTableData);
        setSelectedAddress(updatedTableData);
    };

    let claimTypeValues = [];
    let decisionValues = [];
    let decisionReasonValues = [];
    let serviceTypeValues = [];
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

            if (mastersSelector.hasOwnProperty("masterAngAuthServiceType")) {
                const serviceTypeArray =
                    mastersSelector["masterAngAuthServiceType"].length === 0
                        ? []
                        : mastersSelector["masterAngAuthServiceType"][0];

                for (let i = 0; i < serviceTypeArray.length; i++) {
                    serviceTypeValues.push({ label: convertToCase(serviceTypeArray[i].SERVICE_TYPE_DESC), value: convertToCase(serviceTypeArray[i].SERVICE_TYPE_DESC) });
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
    const gridDataRef = useRef({});

    const addTableRows = (triggeredFormName, index) => {
        let rowsInput = {};

        if (triggeredFormName === "ClaimInformationTable") {
            rowsInput.rowNumber = getRowNumberForGrid(claimInformationGridData);
        }
        if (triggeredFormName === "ProviderInformationTable") {
            rowsInput.rowNumber = getRowNumberForGrid(providerInformationGridData);
        }
        console.log("rows input", rowsInput);
        setGridFieldTempState(rowsInput);
    };

    const deleteTableRows = (index, triggeredFormName, operationValue) => {
        if (
            operationValue === "Edit" &&
            (operationValue === "Add" || operationValue === "Force Delete")
        ) {
            gridRowsFinalSubmit(triggeredFormName, index, "Delete");
            if (triggeredFormName === "ClaimInformationTable") {
                const rows = [...claimInformationGridData];
                rows.splice(index, 1);
                setclaimInformationGridData(rows);
                props.updateClaimInformationGridData(rows);
            }
            if (triggeredFormName === "ProviderInformationTable") {
                const rows = [...providerInformationGridData];
                rows.splice(index, 1);
                setProviderInformationGridData(rows);
                props.updateProviderInformationGridData(rows);
            }
        }

        if (operationValue === "Edit") {
            setGridFieldTempState({});
        }
    };

    const showClaims = async () => {
        console.log("selectSearchValues", selectSearchValues);
        let ClaimNumber = selectSearchValues?.claimNumber;
        let SequentialMemberID = selectSearchValues?.sequentialMemberId;
        let ProviderID = selectSearchValues?.providerId;
        let ServiceStartDate = selectSearchValues?.Service_Start_Date;
        let ServiceEndDate = selectSearchValues?.Service_End_Date;

        // Check if at least one search parameter has a value
        if (ClaimNumber || SequentialMemberID || ProviderID || ServiceStartDate || ServiceEndDate) {
            let getApiJson = {
                option: 'GETCLAIMSEARCHDATA',
                ClaimNumber: ClaimNumber || '',
                ServiceStartDate: extractDate(ServiceStartDate) || '',
                ServiceEndDate: extractDate(ServiceEndDate) || '',
                SequentialMemberID: SequentialMemberID || '',
                ProviderID: ProviderID || '',
            };

            console.log("API Request JSON:", getApiJson);

            try {
                let res = await axios.post("/generic/callProcedure", getApiJson, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("API Response:", res.data);

                let resApiData = res.data.CallProcedure_Output?.data || [];
                console.log("Response Data:", resApiData);
                resApiData = (resApiData?.length > 0) ? resApiData : [];

                if (resApiData.length > 0) {
                    const respKeys = Object.keys(resApiData);
                    console.log("respKeys--->", respKeys);
                    respKeys.forEach(k => {

                        let apiResponse = resApiData[k];
                        if (apiResponse.hasOwnProperty("Service_Start_Date") && typeof apiResponse.Service_Start_Date === "string") {
                            console.log("lll--->", apiResponse.Service_Start_Date) // 2024-05-08T00:00:00
                            const mad = new Date(getDatePartOnly(apiResponse.Service_Start_Date));

                            apiResponse.Service_Start_Date = extractDate(mad);
                            console.log("getDatePartOnly-->", mad);//Wed May 08 2024 00:00:00 GMT+0530 (India Standard Time)
                            console.log("extractDate-->", apiResponse.Service_Start_Date); //2024-05-18
                        }
                        if (apiResponse.hasOwnProperty("Service_End_Date") && typeof apiResponse.Service_End_Date === "string") {
                            const rad = new Date(getDatePartOnly(apiResponse.Service_End_Date));

                            apiResponse.Service_End_Date = extractDate(rad);
                            console.log("xyz-->", rad);
                        }
                    });

                    setResponseData(resApiData);
                }
                const apiStat = res.data.CallProcedure_Output.Status;
                if (apiStat === -1) {
                    alert("Error in fetching data");
                }
            } catch (error) {
                console.error("API Error:", error);
                alert("Error in fetching data. Please try again later.");
            }
        } else {
            alert("Please select at least one search value.");
        }
    };


    const claimSearchTableComponent = () => {
        let columnNames = 'Claim Number~Claim_Number,Claim Type~Claim_type,Authorization Number~Authorization_Number,Service Start Date~Service_Start_Date,Service End Date~Service_End_Date,Service Span~ServiceSpan,Denial Date~DenialDate,Denial Code~DenialCode,Denial Description~DenialDescription,Member ID~MemberID,Member First Name~MemberFirstName,Member Last Name~MemberLastName,Provider ID~ProviderID,Provider Name~ProviderName';
        console.log("APIDATA column data", responseData);
        if (responseData.length > 0) {
            return (
                <>
                    <TableComponent

                        columnName={columnNames}
                        rowValues={responseData}
                        showCheckBox={true}
                        handleCheckBoxChange={handleCheckBoxChange}
                        handleCheckBoxHeaderChange={handleCheckBoxHeaderChange}
                        CheckBoxInHeader={true}

                    />
                </>
            )

        }
        else {
            return (<></>);
        }
    }

    const showProviders = async () => {
        console.log("select provider Search Values", selectSearchValues);
        let ProviderID = selectSearchValues?.providerID;
        let NPI = selectSearchValues?.NPI;
        let Taxid = selectSearchValues?.TaxID;
        let ProviderFirstName = selectSearchValues?.providerFirstName || selectSearchValues?.providerFirstName2;
        let ProviderLastName = selectSearchValues?.providerLastName || selectSearchValues?.providerLastName2;
        let City = selectSearchValues?.city || selectSearchValues?.facilitycity;
        let State = selectSearchValues?.state || selectSearchValues?.state2 || selectSearchValues?.facilityState2;
        let facilityName = selectSearchValues?.facilityName;
        // let ProviderFirstName2 = selectSearchValues?.providerFirstName2;
        // let ProviderLastName2 = selectSearchValues?.providerLastName2;
        // let State2 = selectSearchValues?.state2;
        // let facilityName = selectSearchValues?.facilityName;
        // let facilitycity = selectSearchValues?.facilitycity;
        // let facilityState = selectSearchValues?.facilityState;
        // let FacilityName2 = selectSearchValues?.facilityName2;
        // let FacilityState2 = selectSearchValues?.facilityState2;

        // Check if at least one search parameter has a value
        if (ProviderID || NPI || Taxid || ProviderFirstName || ProviderLastName ||
            City || State || //ProviderFirstName2 || ProviderLastName2 || State2 ||
            facilityName //|| facilitycity || facilityState || FacilityName2 || FacilityState2
        ) {
            let getApiJson = {
                option: 'PROVIDERSEARCHDATA',
                ProviderID: ProviderID || '',
                NPI: NPI || '',
                Taxid: Taxid || '',
                ProviderFirstName: ProviderFirstName || '',
                ProviderLastName: ProviderLastName || '',
                City: City || '',
                State: State || '',
                // ProviderFirstName2: ProviderFirstName2 || '',
                // ProviderLastName2: ProviderLastName2 || '',
                // State2: State2 || '',
                facilityName: facilityName || '',
                // facilitycity: facilitycity || '',
                // facilityState: facilityState || '',
                // FacilityName2: FacilityName2 || '',
                // FacilityState2: FacilityState2 || ''

            };

            console.log("API Request JSON:", getApiJson);

            try {
                let res = await axios.post("/generic/callProcedure", getApiJson, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                console.log("API Response:", res.data);

                let resApiData = res.data.CallProcedure_Output?.data || [];
                console.log("Response Data:", resApiData);
                resApiData = (resApiData?.length > 0) ? resApiData : [];

                if (resApiData.length > 0) {
                    // const respKeys = Object.keys(resApiData);
                    // console.log("respKeys--->", respKeys);

                    setResponseData(resApiData);
                    console.log("setting provider search--->")
                }
                const apiStat = res.data.CallProcedure_Output.Status;
                if (apiStat === -1) {
                    alert("Error in fetching data");
                }
            } catch (error) {
                console.error("API Error:", error);
                alert("Error in fetching data. Please try again later.");
            }
        } else {
            alert("Please select at least one search value.");
        }
    };

    const providerSearchTableComponent = () => {
        let columnNames = 'Issue Number ~ Issue_Number, Provider ID ~ Provider_ID,Provider First Name ~ Provider_Name,Provider Last Name ~ Provider_Last_Name, TIN ~ Provider_TIN, Provider/Vendor Specialty ~ Provider_Vendor_Specialty,Provider Taxonomy ~ Provider_Taxonomy ,NPI ~ NPI_ID, Phone ~ Phone_Number, Address Line 1 ~ Address_Line_1, Address Line 2 ~ Address_Line_2, Zip Code ~ Zip_Code,City ~ City, State ~ State, Participating Provider ~ Participating_Provider,Provider Par Date ~ Provider_Par_Date ,Provider IPA ~ Provider_IPA,Vendor ID ~ Vendor_ID,Vendor Name ~ Vendor_Name, Provider Type ~ Provider_Type,Contact Name ~ Provider_Contact_Name,Contact Phone Number ~ Contact_Phone_Number ,Contact Email Address ~ Contact_Email_Address ';
        console.log("Provider search APIDATA column data", responseData);
        if (responseData.length > 0) {
            return (
                <>
                    <TableComponent

                        columnName={columnNames}
                        rowValues={responseData}
                        showCheckBox={true}
                        handleCheckBoxChange={handleCheckBoxChange}
                        handleCheckBoxHeaderChange={handleCheckBoxHeaderChange}
                        CheckBoxInHeader={true}
                    />
                </>
            )
        }
        else {
            return (<></>);
        }
    }

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
            console.log("rowInput----->", rowInput)
            setGridFieldTempState(rowInput);
        }
        if (triggeredFormName === "ProviderInformationTable") {
            rowInput = providerInformationGridData[index];
            setGridFieldTempState(rowInput);
        }
    };

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
                    setclaimInformationGridData([...claimInformationGridData]);
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
                    setProviderInformationGridData([...providerInformationGridData]);
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

                        <button type="button" class="btn btn-outline-primary" onClick={event => handleShowClaimSearch(event)}>Claim Search</button>
                        <div className="row my-2">
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
                                                        color: 'black'
                                                    }),
                                                    singleValue: (styles) => ({ ...styles, textAlign: 'left' }),
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
                                                    props.handleOnChange(selectValue ? selectValue.value : null, 'Claim_type')
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
                                <div style={{}}>
                                    <ReactDatePicker
                                        id="datePicker"
                                        className="form-control example-custom-input-provider"
                                        selected={claimInformationData.Claim_Adjusted_Date}
                                        name="claimadjusteddate"
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={(date, event) => {

                                            props.handleOnChange(date, "Claim_Adjusted_Date")
                                        }
                                        }
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerClaimAdjustedDate />}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row my-2">
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
                                                        color: 'black'
                                                    }),
                                                    singleValue: (styles) => ({ ...styles, textAlign: 'left' }),
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
                                                    props.handleOnChange(selectValue ? selectValue.value : null, 'Claim_Decision')
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
                                                        color: 'black'
                                                    }),
                                                    singleValue: (styles) => ({ ...styles, textAlign: 'left' }),
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
                                                    props.handleOnChange(selectValue ? selectValue.value : null, 'Decision_Reason')
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
                                                        color: 'black'
                                                    }),
                                                    singleValue: (styles) => ({
                                                        ...styles, textAlign: 'left', textOverflow: "ellipsis",
                                                        overflow: "hidden",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: 230,
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
                                                options={serviceTypeValues}
                                                id="servicetype"
                                                isMulti={false}
                                                onChange={(selectValue) =>
                                                    props.handleOnChange(selectValue ? selectValue.value : null, 'Service_Type')
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
                                        selected={claimInformationData.Service_Start_Date}
                                        name="servicestartdate"
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={(date, event) => {

                                            props.handleOnChange(date, "Service_Start_Date")
                                        }
                                        }
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerServiceStartDate />}
                                    />
                                </div>
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <div style={{}}>
                                    <ReactDatePicker
                                        id="datePicker"
                                        className="form-control example-custom-input-provider"
                                        selected={claimInformationData.Service_End_Date}
                                        name="serviceenddate"
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={(date, event) => {

                                            props.handleOnChange(date, "Service_End_Date")
                                        }
                                        }
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerServiceEndDate />}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='row my-2'>
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
                                                        color: 'black'
                                                    }),
                                                    singleValue: (styles) => ({ ...styles, textAlign: 'left' }),
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
                                                    props.handleOnChange(selectValue ? selectValue.value : null, 'Processing_Status')
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
                        </div>
                        <div className='row my-2'>
                            <div className="col-xs-6 col-md-4">
                                <Field name="paymentmethod">
                                    {({
                                        field,
                                        meta
                                    }) => (
                                        <div className="form-floating">
                                            <input
                                                maxLength="30"
                                                type="text"
                                                id="paymentmethod"
                                                className={`form-control ${meta.touched && meta.error
                                                    ? "is-invalid"
                                                    : field.value
                                                        ? "is-valid"
                                                        : ""
                                                    }`}
                                                placeholder="Payment Method"
                                                {...field}
                                                onChange={(event) => {
                                                    setClaimInformationData({ ...claimInformationData, 'Payment_Method': event.target['value'] })
                                                }}
                                                onBlur={(event) =>
                                                    props.handleOnChange(event.target['value'], 'Payment_Method')
                                                }
                                                value={convertToCase(claimInformationData['Payment_Method'])}
                                            />
                                            <label htmlFor="floatingInputGrid">
                                                Payment Method
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
                                    name="paymentmethod"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <Field name="paymentnumber">
                                    {({
                                        field,
                                        meta
                                    }) => (
                                        <div className="form-floating">
                                            <input
                                                maxLength="50"
                                                type="text"
                                                id="paymentnumber"
                                                className={`form-control ${meta.touched && meta.error
                                                    ? "is-invalid"
                                                    : field.value
                                                        ? "is-valid"
                                                        : ""
                                                    }`}
                                                placeholder="Payment Number"
                                                {...field}
                                                onChange={(event) => {
                                                    setClaimInformationData({ ...claimInformationData, 'Payment_Number': event.target['value'] })
                                                }}
                                                onBlur={(event) =>
                                                    props.handleOnChange(event.target['value'], 'Payment_Number')
                                                }
                                                value={convertToCase(claimInformationData['Payment_Number'])}
                                            />
                                            <label htmlFor="floatingInputGrid">
                                                Payment Number
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
                                    name="paymentnumber"
                                    className="invalid-feedback"
                                />
                            </div>
                            <div className="col-xs-6 col-md-4">
                                <div style={{}}>
                                    <ReactDatePicker
                                        id="datePicker"
                                        className="form-control example-custom-input-provider"
                                        selected={claimInformationData.Payment_Date}
                                        name="paymentdate"
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={(date, event) => {

                                            props.handleOnChange(date, "Payment_Date")
                                        }
                                        }
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerPaymentDate />}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-4">
                                <div style={{}}>
                                    <ReactDatePicker
                                        id="datePicker"
                                        className="form-control example-custom-input-provider"
                                        selected={claimInformationData.Payment_Mail_Date_Postmark}
                                        name="paymentmaildate"
                                        dateFormat="MM/dd/yyyy"
                                        peekNextMonth
                                        showMonthDropdown
                                        showYearDropdown
                                        isClearable
                                        onKeyDown={(e) => {
                                            e.preventDefault();
                                        }}
                                        onChange={(date, event) => {

                                            props.handleOnChange(date, "Payment_Mail_Date_Postmark")
                                        }
                                        }
                                        style={{
                                            position: "relative",
                                            zIndex: "999",
                                        }}
                                        customInput={<RenderDatePickerPaymentMailDate />}
                                    />
                                </div>
                            </div>
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
                                    updateGridData={setclaimInformationGridData}
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
                        {showClaimSearch && (
                            <ClaimSearch
                                handleCloseSearch={handleCloseSearch}
                                selectedCriteria={selectedCriteria}
                                setSelectedCriteria={setSelectedCriteria}
                                selectSearchValues={selectSearchValues}
                                setSelectSearchValues={setSelectSearchValues}
                                showClaims={showClaims}
                                claimSearchTableComponent={claimSearchTableComponent}
                                responseData={responseData}
                                setResponseData={setResponseData}
                                handleClearClaimSearch={handleClearClaimSearch}
                                showClaimSearch={showClaimSearch}
                                handleSelectedAddress={handleSelectedAddress}
                            />
                        )}
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
                        <button type="button" class="btn btn-outline-primary" onClick={event => handleShowProviderSearch(event)}>Provider Search</button>
                        <div className="row my-2">
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
                        <div>
                            {showProviderSearch && (
                                <ProviderSearch
                                    handleCloseSearch={handleCloseSearch}
                                    selectedCriteria={selectedCriteria}
                                    setSelectedCriteria={setSelectedCriteria}
                                    selectSearchValues={selectSearchValues}
                                    setSelectSearchValues={setSelectSearchValues}
                                    handleClearClaimSearch={handleClearClaimSearch}
                                    showProviderSearch={showProviderSearch}
                                    showProviders={showProviders}
                                    providerSearchTableComponent={providerSearchTableComponent}
                                    responseData={responseData}
                                    setResponseData={setResponseData}
                                    handleSelectedProviders={handleSelectedProviders}

                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default CaseClaimInformation;