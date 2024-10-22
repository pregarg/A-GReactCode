import React, { useEffect, useRef, useState } from "react";
import { useAxios } from "../../../api/axios.hook";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseHeader from "./CaseHeader";
import ProviderDisputeClaimInformationTable from "../TileFormsTables/ProviderDisputeClaimInformationTable";
import TableComponent from "../../../../src/util/TableComponent";
import ClaimSearch from "../TileForms/ClaimSearch";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";



const ProviderDisputeClaimInformation = (props) => {
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

  const [showClaimSearch, setShowClaimSearch] = useState(false);
  const [gridFieldTempState, setGridFieldTempState] = useState({});
  const [responseData, setResponseData] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState([]);



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

  const handleShowClaimSearch = () => {
    setShowClaimSearch(true);
  };

  const handleCloseSearch = () => {
    setShowClaimSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };
  const handleClearClaimSearch = () => {
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

    setShowClaimSearch(false);
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

 
  const [isCheckedBox, setIscheckedBox] = useState(props.ProviderclaimInformation?.isChecked === '1');

  const gridDataRef = useRef({});

  const addTableRows = (triggeredFormName) => {
    console.log("abcdert",triggeredFormName)
    let rowsInput = {};

    if (triggeredFormName === "ProviderClaimInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(ProviderclaimInformationGridData);
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
    }

    if (operationValue === "Edit") {
      setGridFieldTempState({});
    }
  };
  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    let clonedJson = { ...gridFieldTempState };
    console.log("Cloned Json is : ", clonedJson)
    console.log("Triggered Name : ", triggeredFormName)
    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "ProviderClaimInformationTable") {
        console.log("abc",ProviderclaimInformationGridData[index])
        let indexJson = ProviderclaimInformationGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          ProviderclaimInformationGridData[index] = clonedJson;
          setProviderClaimInformationGridData([...ProviderclaimInformationGridData]);
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

      }
    }
  };

  const showClaims = async () => {
    let ClaimNumber = selectSearchValues?.claimNumber;
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
        ClaimNumber ||
        SequentialMemberID ||
        ProviderID ||
        ServiceStartDate ||
        ServiceEndDate
    ) {
      let getApiJson = {
        option: "GETCLAIMSEARCHDATA",
        ClaimNumber: ClaimNumber || "",
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
        console.log("abcsdd",res)
        console.log("abcsddssssssss",resApiData)
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
                apiResponse.hasOwnProperty("Denial_Date") &&
                typeof apiResponse.Denial_Date === "string"
            ) {
              const rad = new Date(getDatePartOnly(apiResponse.Denial_Date));
              apiResponse.Denial_Date = extractDate(rad);
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
    let columnNames =
        "Claim Number~Claim_Number,Claim Type~Claim_type,Authorization Number~Auth_Number,Service Start Date~Service_Start_Date,Service End Date~Service_End_Date,Service Span~ServiceSpan,Denial Date~Denial_Date,Denial Code~DenialCode,Denial Description~DenialDescription,Member ID~MemberID,Member First Name~MemberFirstName,Member Last Name~MemberLastName,Provider ID~ProviderID,Provider Name~ProviderName";
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
    // if (
    //   fieldName === "Service_Start_Date" ||
    //   fieldName === "Service_End_Date"
    // ) {
    //   const startDate = tempInput["Service_Start_Date"];
    //   const endDate = tempInput["Service_End_Date"];
    //   tempInput["Number_of_Days_In_Span"] = calculateDaysDifference(
    //     startDate,
    //     endDate,
    //   );
    //   setGridFieldTempState(tempInput);
    // }
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
    // if (triggeredFormName === "ProviderInformationTable") {
    //   rowInput = providerInformationGridData[index];
    //   setGridFieldTempState(rowInput);
    // }
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

  const handleCheckBoxChangeNew = () => {
    let temp = localStorage.getItem('checkBox');
    if(temp){
      temp = temp == 'true' ? 'false' : 'true';
      localStorage.setItem('checkBox', temp);
    }else{
      localStorage.setItem('checkBox','true');
    }
   
    setIscheckedBox(!isCheckedBox);
    props.setIscheckedBox(isCheckedBox);
    
  }


  


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
              onClick={(event) => handleShowClaimSearch(event)}
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
               {/* {renderInputField("High_Dollar_Dispute", "High Dollar Dispute", 16, false, "High Dollar Dispute")} */}
               
               <label>
                <input type="checkbox" checked={isCheckedBox} onChange={handleCheckBoxChangeNew}/>High Dollar Dispute
               </label>
             </div>
              <div className="col-xs-6 col-md-12">
                <ProviderDisputeClaimInformationTable
                  ProviderclaimInformationGridData={ProviderclaimInformationGridData}
                  validationSchema={
                    props.authorizationInformationGridValidationSchema
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
      </div>
    </div>
  );
};

export default ProviderDisputeClaimInformation;
