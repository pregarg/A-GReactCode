import React, { useEffect, useRef, useState } from "react";
import { useAxios } from "../../../api/axios.hook";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ProviderClaimInformationTable from "../TileFormsTables/ProviderDisputeClaimInformationTable";
import CaseHeader from "./CaseHeader";
import ProviderDisputeClaimInformationTable from "../TileFormsTables/DisputeProviderInformationTable";
import TableComponent from "../../../../src/util/TableComponent";
import ProviderClaimSearch from "../TileForms/ProviderClaimSearch";
import ProviderDisputeClaimSearchNew from "../TileForms/ProviderSearch";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { FormikCheckBoxField } from "../Common/FormikCheckBoxField";


const CaseProviderClaimInformation = (props) => {
  const {
    convertToCase,
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly,
  } = useGetDBTables();

  const { getRowNumberForGrid } = useUpdateDecision();

  const [selectedCriteria, setSelectedCriteria] = useState();

  const [selectSearchValues, setSelectSearchValues] = useState();

  const tabRef = useRef("HomeView");
  const location = useLocation();
  const fetchAutoPopulate = useRef(false);

  const { customAxios: axios } = useAxios();
  const token = useSelector((state) => state.auth.token);

  const [ProviderclaimInformationGridData, setProviderClaimInformationGridData] = useState(
    props.handleProviderClaimInformationGridData,
  );

  const [providerInformationGridData, setProviderInformationGridData] =
    useState(props.handleProviderInformationGridData);

  const [showProviderClaimSearch, setShowProviderClaimSearch] = useState(false);
  const [showProviderSearch, setShowProviderSearch] = useState(false);
  const [gridFieldTempState, setGridFieldTempState] = useState({});

  const [responseData, setResponseData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);

  // const masterAngProviderClaimTypeSelector = useSelector(
  //   (state) => state?.masterAngProviderClaimType,
  // );
 
  // const masterAngDecisionSelector = useSelector(
  //   (state) => state?.masterAngDecision,
  // );

  // const masterAngAuthServiceTypeSelector = useSelector(
  //   (state) => state?.masterAngAuthServiceType,
  // );
  // const masterAngProcessingStatusSelector = useSelector(
  //   (state) => state?.masterAngProcessingStatus,
  // );

  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const excludedStages = [
    "Start",
    "Intake",
    "Acknowledge",
    "Redirect Review",
    "Documents Needed",
  ];
  const shouldHideFields = !excludedStages.includes(
    location.state.stageName || stageName,
  );

  const handleShowProviderClaimSearch = () => {
    setShowProviderClaimSearch(true);
  };
  const handleShowProviderSearch = () => {
    setShowProviderSearch(true);
  };
  const handleCloseSearch = () => {
    setShowProviderClaimSearch(false);
    setShowProviderSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };
  const handleClearProviderClaimSearch = () => {
    setSelectSearchValues([]);
    setSelectedCriteria([]);
    setResponseData([]);
  };
  const handleSelectedAddress = () => {
    let rowNumber = getRowNumberForGrid(ProviderclaimInformationGridData);
    let addressToPopulate = [];
    if (selectedAddress.length > 0) {
      selectedAddress.map((elem) => {
        if (elem?.isChecked) {
          elem.rowNumber = rowNumber;
          elem.operation = "I";
          delete elem["isChecked"];
          rowNumber++;
          addressToPopulate.push(elem);
        }
      });
    }

    if (addressToPopulate.length > 0) {
      setProviderClaimInformationGridData([
        ...ProviderclaimInformationGridData,
        ...addressToPopulate,
      ]);
      props.updateProviderClaimInformationGridData([
        ...ProviderclaimInformationGridData,
        ...addressToPopulate,
      ]);
    }

    setShowProviderClaimSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };
  const handleSelectedProviders = (flag) => {
    let rowNumber = getRowNumberForGrid(providerInformationGridData);
    let addressToPopulate = [];
    if (selectedAddress.length > 0) {
      selectedAddress.map((elem) => {
        if (elem?.isChecked) {
          elem.rowNumber = rowNumber;
          elem.operation = "I";
          delete elem["isChecked"];
          rowNumber++;
          addressToPopulate.push(elem);
        }
      });
    }

    if (addressToPopulate.length > 0) {
      setProviderInformationGridData([
        ...providerInformationGridData,
        ...addressToPopulate,
      ]);
      props.updateProviderInformationGridData([
        ...providerInformationGridData,
        ...addressToPopulate,
      ]);
    }

    setShowProviderSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };
  const handleCheckBoxChange = (event, ind) => {
    let jsn = responseData[ind];
    jsn.isChecked = event.target.checked;
    setSelectedAddress([...selectedAddress, jsn]);
  };
  const handleCheckBoxHeaderChange = (event) => {
    const updatedTableData = responseData.map((jsn) => {
      jsn.isChecked = event.target.checked;
      return jsn;
    });
    setSelectedAddress(updatedTableData);
  };

  const [ProviderclaimTypeValues, setProviderClaimTypeValues] = useState([]);

  const [decisionValues, setDecisionValues] = useState([]);
  const [decisionReasonValues, setDecisionReasonValues] = useState([]);
  const [serviceTypeValues, setServiceTypeValues] = useState([]);
  const [processingStatusValues, setProcessingStatusValues] = useState([]);

  useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });
    // const ProviderclaimType = masterAngProviderClaimTypeSelector?.[0] || [];
    // setProviderClaimTypeValues(
    //   [...new Set(ProviderclaimType.map((e) => convertToCase(e.ProviderClaim_Type)))].map(
    //     kvMapper,
    //   ),
    // );
   
    // const angDecision = masterAngDecisionSelector?.[0] || [];
    // setDecisionValues(
    //   [...new Set(angDecision.map((e) => convertToCase(e.DECISION)))].map(
    //     kvMapper,
    //   ),
    // );
    // setDecisionReasonValues(
    //   [
    //     ...new Set(angDecision.map((e) => convertToCase(e.DECISION_REASON))),
    //   ].map(kvMapper),
    // );

    // const authServiceType = masterAngAuthServiceTypeSelector?.[0] || [];
    // setServiceTypeValues(
    //   authServiceType.map((e) => e.SERVICE_TYPE_DESC).map(kvMapper),
    // );

    // const procStatus = masterAngProcessingStatusSelector?.[0] || [];
    // setProcessingStatusValues(
    //   [
    //     ...new Set(procStatus.map((e) => convertToCase(e.Processing_Status))),
    //   ].map(kvMapper),
    // );
  }, []);
  const gridDataRef = useRef({});

  const addTableRows = (triggeredFormName) => {
    let rowsInput = {};

    if (triggeredFormName === "ProviderClaimInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(ProviderclaimInformationGridData);
    }
    if (triggeredFormName === "ProviderInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(providerInformationGridData);
    }
    setGridFieldTempState(rowsInput);
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
      gridRowsFinalSubmit(triggeredFormName, index, "Delete");
      if (triggeredFormName === "ProviderClaimInformationTable") {
        const rows = [...ProviderclaimInformationGridData];
        rows.splice(index, 1);
        setProviderClaimInformationGridData(rows);
        props.updateProviderClaimInformationGridData(rows);
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

  const showProviderClaims = async () => {
    let ProviderClaimNumber = selectSearchValues?.ProviderclaimNumber;
    let SequentialMemberID = selectSearchValues?.sequentialMemberId;
    let ProviderID = selectSearchValues?.providerId;
    let ServiceStartDate =
      selectSearchValues?.Service_Start_Date ||
      selectSearchValues?.Service_Start_Date2;
    let ServiceEndDate =
      selectSearchValues?.Service_End_Date ||
      selectSearchValues?.Service_End_Date2;

    // Check if at least one search parameter has a value
    if (
      ProviderClaimNumber ||
      SequentialMemberID ||
      ProviderID ||
      ServiceStartDate ||
      ServiceEndDate
    ) {
      let getApiJson = {
        option: "GETProviderCLAIMSEARCHDATA",
        ProviderClaimNumber: ProviderClaimNumber || "",
        ServiceStartDate: extractDate(ServiceStartDate) || "",
        ServiceEndDate: extractDate(ServiceEndDate) || "",
        SequentialMemberID: SequentialMemberID || "",
        ProviderID: ProviderID || "",
      };

      try {
        let res = await axios.post("/generic/callProcedure", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let resApiData = res.data.CallProcedure_Output?.data || [];
        resApiData = resApiData?.length > 0 ? resApiData : [];

        if(resApiData[0].length === 0 )  {
          console.log("No data found for the member ID");
             alert("No data found");
             return; 
           }

        if (resApiData.length > 0) {
          const respKeys = Object.keys(resApiData);
          respKeys.forEach((k) => {
            let apiResponse = resApiData[k];
            if (
              apiResponse.hasOwnProperty("Service_Start_Date") &&
              typeof apiResponse.Service_Start_Date === "string"
            ) {
              const mad = new Date(
                getDatePartOnly(apiResponse.Service_Start_Date),
              );
              apiResponse.Service_Start_Date = extractDate(mad);
            }
            if (
              apiResponse.hasOwnProperty("Service_End_Date") &&
              typeof apiResponse.Service_End_Date === "string"
            ) {
              const rad = new Date(
                getDatePartOnly(apiResponse.Service_End_Date),
              );
              apiResponse.Service_End_Date = extractDate(rad);
            }
            if (
              apiResponse.hasOwnProperty("DenialDate") &&
              typeof apiResponse.DenialDate === "string"
            ) {
              const rad = new Date(getDatePartOnly(apiResponse.DenialDate));
              apiResponse.DenialDate = extractDate(rad);
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

  const ProviderclaimSearchTableComponent = () => {
    let columnNames =
      "Claim Number~Claim_Number,Claim Type~Claim_type,Authorization Number~Auth_Number,Service Start Date~Service_Start_Date,Service End Date~Service_End_Date,Service Span~ServiceSpan,Denial Date~DenialDate,Denial Code~DenialCode,Denial Description~DenialDescription,Member ID~MemberID,Member First Name~MemberFirstName,Member Last Name~MemberLastName,Provider ID~ProviderID,Provider Name~ProviderName";
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
      );
    } else {
      return <></>;
    }
  };

  const showProviders = async () => {
    let ProviderID = selectSearchValues?.providerID;
    let NPI = selectSearchValues?.NPI;
    let Taxid = selectSearchValues?.TaxID;
    let ProviderFirstName =
      selectSearchValues?.providerFirstName ||
      selectSearchValues?.providerFirstName2;
    let ProviderLastName =
      selectSearchValues?.providerLastName ||
      selectSearchValues?.providerLastName2;
    let City = selectSearchValues?.city || selectSearchValues?.facilitycity;
    let State =
      selectSearchValues?.state ||
      selectSearchValues?.state2 ||
      selectSearchValues?.facilityState2;
    let facilityName = selectSearchValues?.facilityName;

    if (
      ProviderID ||
      NPI ||
      Taxid ||
      ProviderFirstName ||
      ProviderLastName ||
      City ||
      State ||
      facilityName
    ) {
      let getApiJson = {
        option: "PROVIDERSEARCHDATA",
        ProviderID: ProviderID || "",
        NPI: NPI || "",
        Taxid: Taxid || "",
        ProviderFirstName: ProviderFirstName || "",
        ProviderLastName: ProviderLastName || "",
        City: City || "",
        State: State || "",
        facilityName: facilityName || "",
      };

      try {
        let res = await axios.post("/generic/callProcedure", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        });

        let resApiData = res.data.CallProcedure_Output?.data || [];
        resApiData = resApiData?.length > 0 ? resApiData : [];
        if(resApiData[0].length === 0 )  {
          console.log("No data found for the member ID");
             alert("No data found");
             return; 
           }
        if (resApiData.length > 0) {
          const respKeys = Object.keys(resApiData);
          respKeys.forEach((k) => {
            let apiResponse = resApiData[k];
            if (
              apiResponse.hasOwnProperty("Provider_Par_Date") &&
              typeof apiResponse.Provider_Par_Date === "string"
            ) {
              const mad = new Date(
                getDatePartOnly(apiResponse.Provider_Par_Date),
              );
              apiResponse.Provider_Par_Date = extractDate(mad);
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

  const providerSearchTableComponent = () => {
    let columnNames =
      "Issue Number~Issue_Number,Provider ID~Provider_ID,Provider First Name~Provider_Name,Provider Last Name~Provider_Last_Name,TIN~Provider_TIN,Provider/Vendor Specialty~Provider_Vendor_Specialty,Provider Taxonomy~Provider_Taxonomy,NPI~NPI_ID,Phone~Phone_Number,Address Line 1~Address_Line_1,Address Line 2~Address_Line_2,Zip Code~Zip_Code,City~City,State~State,Participating Provider~Participating_Provider,Provider Par Date~Provider_Par_Date,Provider IPA~Provider_IPA,Vendor ID~Vendor_ID,Vendor Name~Vendor_Name,Provider Type~Provider_Type,Contact Name~Provider_Contact_Name,Contact Phone Number~Contact_Phone_Number,Contact Email Address~Contact_Email_Address";

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
      );
    } else {
      return <></>;
    }
  };

  const handleGridSelectChange = (index, selectedValue, event) => {
    const { name } = event;
    setGridFieldTempState({
      ...gridFieldTempState,
      [name]: (selectedValue?.value || selectedValue)?.toUpperCase(),
    });
  };

  const handleGridDateChange = (index, selectedValue, fieldName) => {
    let tempInput = { ...gridFieldTempState };
    tempInput[fieldName] = selectedValue;
    setGridFieldTempState(tempInput);
    if (
      fieldName === "Service_Start_Date" ||
      fieldName === "Service_End_Date"
    ) {
      const startDate = tempInput["Service_Start_Date"];
      const endDate = tempInput["Service_End_Date"];
      tempInput["Number_of_Days_in_Span"] = calculateDaysDifference(
        startDate,
        endDate,
      );
      setGridFieldTempState(tempInput);
    }
  };
  const calculateDaysDifference = (startDate, endDate) => {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleGridFieldChange = (index, event) => {
    let tempInput = { ...gridFieldTempState };
    let { name, value } = event.target;
    tempInput[name] = value.toUpperCase();
    setGridFieldTempState(tempInput);
  };

  const editTableRows = (index, triggeredFormName) => {
    let rowInput = {};

    if (triggeredFormName === "ProviderClaimInformationTable") {
      rowInput = ProviderclaimInformationGridData[index];
      setGridFieldTempState(rowInput);
    }
    if (triggeredFormName === "ProviderInformationTable") {
      rowInput = providerInformationGridData[index];
      setGridFieldTempState(rowInput);
    }
  };

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    let clonedJson = { ...gridFieldTempState };
    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "ProviderClaimInformationTable") {
        let indexJson = ProviderclaimInformationGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          ProviderclaimInformationGridData[index] = clonedJson;
          setProviderClaimInformationGridData([...ProviderclaimInformationGridData]);
        }
      }
      if (triggeredFormName === "ProviderInformationTable") {
        let indexJson = providerInformationGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          providerInformationGridData[index] = clonedJson;
          setProviderInformationGridData([...providerInformationGridData]);
          //  props.updateProviderInformationGridData([...providerInformationGridData]);
        }
      }

      //Handling for data update/Delete/Insert inside grids.
      if (tabRef.current === "DashboardView") {
        let oprtn;
        let gridRowJson = {};
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

        if (triggeredFormName === "ProviderClaimInformationTable") {
          gridRowArray = gridDataRef.current.hasOwnProperty(
            "ProviderclaimInformationTable",
          )
            ? [...gridDataRef.current.ProviderclaimInformationTable]
            : [];
          gridRowJson = { ...ProviderclaimInformationGridData[index] };

          if (Object.keys(gridRowJson).length !== 0) {
            gridRowJson["operation"] = oprtn;

            gridRowArray.push(trimJsonValues(gridRowJson));

            gridDataRef.current.ProviderclaimInformationTable =
              getGridDataValues(gridRowArray);
          }
        }
        if (triggeredFormName === "ProviderInformationTable") {
          gridRowArray = gridDataRef.current.hasOwnProperty(
            "providerInformationTable",
          )
            ? [...gridDataRef.current.providerInformationTable]
            : [];
          gridRowJson = { ...providerInformationGridData[index] };

          if (Object.keys(gridRowJson).length !== 0) {
            gridRowJson["operation"] = oprtn;

            gridRowArray.push(trimJsonValues(gridRowJson));

            gridDataRef.current.providerInformationTable =
              getGridDataValues(gridRowArray);
          }
        }
      }
    }
  };

  const getGridDataValues = (tableData) => {
    let returnArray = [];
    tableData.map((data) => {
      const dataObject = {};
      const dataKeys = Object.keys(data);
      dataKeys.forEach((dataValue) => {
        const dataKeyType = typeof data[dataValue];
        if (dataKeyType === "object") {
          if (data[dataValue]) {
            if (data[dataValue].value) {
              if (data[dataValue].value instanceof Date) {
                dataObject[dataValue] = extractDate(data[dataValue].value);
              } else {
                dataObject[dataValue] = data[dataValue].value;
              }
            } else if (data[dataValue].value === "") {
              dataObject[dataValue] = "";
            } else {
              if (data[dataValue] instanceof Date) {
                //dataObject[dataValue] = data[dataValue].toLocaleDateString();
                dataObject[dataValue] = extractDate(data[dataValue]);
              } else {
                dataObject[dataValue] = data[dataValue];
              }
            }
          } else {
            dataObject[dataValue] = "";
          }
        }
        if (dataKeyType !== "object") {
          dataObject[dataValue] = data[dataValue];
        }
      });
      returnArray.push(trimJsonValues(dataObject));
    });
    return returnArray;
  };

  const [ProviderclaimInformationData, setProviderClaimInformationData] = useState(
    props.ProviderclaimInformationData || {},
  );
  const handleProviderClaimInformationData = (name, value, persist) => {
    const newData = {
      ...ProviderclaimInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setProviderClaimInformationData(newData);
    if (persist) {
      props.setProviderClaimInformationData(newData);
    }
  };
  const persistProviderClaimInformationData = () => {
    props.setProviderClaimInformationData(ProviderclaimInformationData);
  };


  const renderInputField = (name, placeholder, maxLength, isCheckbox = false, label = "") => (
    <div className="col-xs-6 col-md-4">
      {isCheckbox ? (
        <FormikCheckBoxField
          name={name}
          label={label} // Label for checkbox
          data={ProviderclaimInformationData}
          onChange={handleProviderClaimInformationData}
          displayErrors={props.shouldShowSubmitError}
          disabled={
            location.state.formView === "DashboardView" &&
            (((location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Documents Needed" ||
              location.state.stageName === "Effectuate" ||
              location.state.stageName === "Pending Effectuate") &&
              (name === "Claim_Number" || name === "Authorization_Number")) ||
              (location.state.stageName === "Research" &&
                (name === "Payment_Method" ||
                  name === "Payment_Number" ||
                  name === "Effectuation_Notes" ||
                  name === "Reason_Text")) ||
              location.state.stageName === "Resolve" ||
              location.state.stageName === "Case Completed" ||
              location.state.stageName === "Reopen" ||
              location.state.stageName === "CaseArchived")
          }
          errors={props.ProviderclaimInformationErrors}
        />
      ) : (
        <FormikInputField
          name={name}
          placeholder={placeholder}
          maxLength={maxLength}
          data={ProviderclaimInformationData}
          onChange={handleProviderClaimInformationData}
          displayErrors={props.shouldShowSubmitError}
          disabled={
            location.state.formView === "DashboardView" &&
            (((location.state.stageName === "Redirect Review" ||
              location.state.stageName === "Documents Needed" ||
              location.state.stageName === "Effectuate" ||
              location.state.stageName === "Pending Effectuate") &&
              (name === "Claim_Number" || name === "Authorization_Number")) ||
              (location.state.stageName === "Research" &&
                (name === "Payment_Method" ||
                  name === "Payment_Number" ||
                  name === "Effectuation_Notes" ||
                  name === "Reason_Text")) ||
              location.state.stageName === "Resolve" ||
              location.state.stageName === "Case Completed" ||
              location.state.stageName === "Reopen" ||
              location.state.stageName === "CaseArchived")
          }
          persist={persistProviderClaimInformationData}
          schema={props.ProviderclaimInformationValidationSchema}
          errors={props.ProviderclaimInformationErrors}
        />
      )}
    </div>
  );
  


  return (
    <div>
      
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
            Claim Information
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseproviderInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-providerInformation"
        >
          <div className="accordion-body">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={(event) => handleShowProviderSearch(event)}
              disabled={
                location.state.stageName === "Redirect Review" ||
                location.state.stageName === "Documents Needed" ||
                location.state.stageName === "CaseArchived"
              }
            >
              Claim Search
            </button>
            <div className="row my-2">
            <div className="row my-2">
               {/*{renderInputField("High_Dollar_Dispute", "High Dollar Dispute", 0, true, "High Dollar Dispute")}*/}
               
             </div>
              <div className="col-xs-6 col-md-12">
                <ProviderDisputeClaimInformationTable
                  providerInformationGridData={providerInformationGridData}
                  validationSchema={
                    props.providerInformationGridValidationSchema
                  }
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
                    location.state.lockStatus !== undefined &&
                    location.state.lockStatus !== ""
                      ? location.state.lockStatus
                      : "N"
                  }
                  fetchAutoPopulate={fetchAutoPopulate}
                  transactionType={CaseHeader.displayName}
                ></ProviderDisputeClaimInformationTable>
              </div>
            </div>
            <div>
              {showProviderSearch && (
                <ProviderDisputeClaimSearchNew
                  handleCloseSearch={handleCloseSearch}
                  selectedCriteria={selectedCriteria}
                  setSelectedCriteria={setSelectedCriteria}
                  selectSearchValues={selectSearchValues}
                  setSelectSearchValues={setSelectSearchValues}
                  handleClearProviderClaimSearch={handleClearProviderClaimSearch}
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
  );
};

export default CaseProviderClaimInformation;
