import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CtmHeader from "./CtmHeader";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import CtmClaimInformationTable from "../TileFormsTables/CtmClaimInformationTable";
import { useAxios } from "../../../api/axios.hook";
import RepresentativeSearch from "./RepresentativeSearch.js";
import TableComponent from "../../../util/TableComponent";
import ClaimSearch from "../TileForms/ClaimSearch";


const CtmClaimInformationAccordion = (props) => {
  const {
    convertToCase,
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly,
    acceptNumbersOnly,
  } = useGetDBTables();

  const { getRowNumberForGrid } = useUpdateDecision();

  const [ctmClaimInformationGridData, setCtmClaimInformationGridData] = useState(props.handleClaimInformationGridData || []);
  const [gridFieldTempState, setGridFieldTempState] = useState({});
  const [showClaimSearch, setShowClaimSearch] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState();
   const [responseData, setResponseData] = useState([]);
   const [selectSearchValues, setSelectSearchValues] = useState();
  const tabRef = useRef("HomeView");
  let prop = useLocation();
  const fetchAutoPopulate = useRef(false);
    const location = useLocation();
     const token = useSelector((state) => state.auth.token);
      const { customAxios: axios } = useAxios();
  const gridDataRef = useRef({});
 let [selectedAddress, setSelectedAddress] = useState([]);

const handleShowClaimSearch = () => {
    setShowClaimSearch(true);
  };
  const handleCloseSearch = () => {
      setShowClaimSearch(false);
      setSelectedCriteria([]);
      setSelectSearchValues([]);
      setResponseData([]);
    };
    const handleClearSearch = () => {
      setSelectSearchValues([]);
      setSelectedCriteria([]);
      setResponseData([]);
      setSelectedAddress([]);
    };
    const handleSelectedAddress = () => {
        let rowNumber = getRowNumberForGrid(ctmClaimInformationGridData);
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
           setCtmClaimInformationGridData([
            ...ctmClaimInformationGridData,
            ...addressToPopulate,
          ]);
          props.updateCtmClaimInformationGridData([
            ...ctmClaimInformationGridData,
            ...addressToPopulate,
          ]);
        }
        else {
          alert("Please select at least one row.");
          return;
        }

        setShowClaimSearch(false);
        setSelectedCriteria([]);
        setSelectSearchValues([]);
        setResponseData([]);
      };
  const addTableRows = (triggeredFormName, index) => {


      let rowsInput = {};

      if (triggeredFormName === "CtmClaimInformationTable") {
        rowsInput.rowNumber = getRowNumberForGrid(
          ctmClaimInformationGridData,
        );
      }
      setGridFieldTempState(rowsInput);
    };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
      if (
        operationValue !== "Edit" &&
        (operationValue === "Add" || operationValue === "Force Delete")
      ) {
         const rows = [...ctmClaimInformationGridData];
        rows.splice(index, 1);
         setCtmClaimInformationGridData(rows);
        props.updateCtmClaimInformationGridData(rows);
      }
      if (operationValue === "Edit") {
        setGridFieldTempState({});
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
    };

  const handleGridFieldChange = (index, event) => {
      let tempInput = { ...gridFieldTempState };
      let { name, value } = event.target;
      tempInput[name] = value.toUpperCase();
      setGridFieldTempState(tempInput);
    };
const handleSelectedRep = (flag) => {
       let rowNumber = getRowNumberForGrid(ctmClaimInformationGridData);
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
         setCtmClaimInformationGridData([
           ...ctmClaimInformationGridData,
           ...addressToPopulate,
         ]);
         props.updateCtmClaimInformationGridData([
           ...ctmClaimInformationGridData,
           ...addressToPopulate,
         ]);
       }
       else {
         alert("Please select at least one row.");
         return;
       }

       showClaimSearch(false);
       setSelectedCriteria([]);
       setSelectSearchValues([]);
       setResponseData([]);
     };

  const editTableRows = (index) => {
      let rowInput = ctmClaimInformationGridData[index];
      setGridFieldTempState(rowInput);
    };

 const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
     let clonedJson = { ...gridFieldTempState };

     if (Object.keys(gridFieldTempState).length !== 0) {
       if (triggeredFormName === "CtmClaimInformationTable") {
         let indexJson = ctmClaimInformationGridData[index];
         if (indexJson) {
           clonedJson = Object.assign(indexJson, gridFieldTempState);
         }

         if (!checkGridJsonLength(clonedJson)) {
           ctmClaimInformationGridData[index] = clonedJson;
          setCtmClaimInformationGridData(ctmClaimInformationGridData);

         }

         setTimeout(() => props.updateCtmClaimInformationGridData(ctmClaimInformationGridData), 500);
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
        resApiData = resApiData?.length > 0 ? resApiData : [];

        if(resApiData[0].length === 0 )  {
          console.log("No data found for the member ID");
             alert("No data found");
             setResponseData([])
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
//            handleCheckBoxChange={handleCheckBoxChange}
//            handleCheckBoxHeaderChange={handleCheckBoxHeaderChange}
            CheckBoxInHeader={true}
          />
        </>
      );
    } else {
      return <></>;
    }
  };

//  const getGridDataValues = (tableData) => {
//    let returnArray = [];
//    tableData.forEach((data) => {
//      const dataObject = {};
//      Object.keys(data).forEach((key) => {
//        if (typeof data[key] === "object" && data[key]) {
//          if (data[key].value instanceof Date) {
//            dataObject[key] = extractDate(data[key].value);
//          } else {
//            dataObject[key] = data[key].value || "";
//          }
//        } else {
//          dataObject[key] = data[key];
//        }
//      });
//      returnArray.push(trimJsonValues(dataObject));
//    });
//    return returnArray;
//  };

  return (
    <div>
      <div className="accordion-item" id="claimInformation">
        <h2 className="accordion-header" id="panelsStayOpen-claimInformation">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseClaimInformation"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseClaimInformation"
          >
            Claim Information
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseClaimInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-claimInformation"
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
                            handleClearSearch={handleClearSearch}
                            showClaimSearch={showClaimSearch}
                            handleSelectedAddress={handleSelectedAddress}
                            setSelectedAddress={setSelectedAddress}
                          />
                        )}
            <div className="row my-2">
              <div className="col-xs-6 col-md-12">
                <CtmClaimInformationTable

                  ctmClaimInfoGridData={ctmClaimInformationGridData }
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
                  handleGridFieldChange={handleGridFieldChange}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  validationSchema={props.ctmClaimInformationGridValidationSchema}
                 lockStatus={
                                     prop.state !== null &&
                                     prop.state.lockStatus !== undefined &&
                                     prop.state.lockStatus !== ""
                                       ? prop.state.lockStatus
                                       : "N"
                                   }
                  fetchAutoPopulate={fetchAutoPopulate}
                  transactionType={CtmHeader.displayName}
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default CtmClaimInformationAccordion;