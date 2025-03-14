
import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseHeader from "./CaseHeader";
import CtmAuthorizationInformationTable from "../TileFormsTables/CtmAuthorizationInformationTable";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import { useAxios } from "../../../api/axios.hook";
import AuthSearch from "../TileForms/AuthSearch";
import TableComponent from "../../../util/TableComponent";


const CtmAuthorizationInformationAccordion = (props) => {
  const {
    convertToCase,
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly,
    acceptNumbersOnly,
  } = useGetDBTables();

  const { getRowNumberForGrid } = useUpdateDecision();

 const [ctmAuthGridData, setCtmAuthGridData] = useState(props.handleCtmAuthGridData || []);
const [showAuthSearch, setShowAuthSearch] = useState(false);
  const [gridFieldTempState, setGridFieldTempState] = useState({});
 const [responseData, setResponseData] = useState([]);
   const [selectedCriteria, setSelectedCriteria] = useState();
   const [selectSearchValues, setSelectSearchValues] = useState();
    const { customAxios: axios } = useAxios();
     const token = useSelector((state) => state.auth.token);
const [whiteGloveIndicator, setWhiteGloveIndicator] = useState(props.handleData?.isChecked === '1');
const [ctmAuthorizationInformationData, setCtmAuthorizationInformationData] =
    useState(props.handleData);
let [selectedAddress, setSelectedAddress] = useState([]);
  const tabRef = useRef("HomeView");
  let prop = useLocation();
  const fetchAutoPopulate = useRef(false);

  const gridDataRef = useRef({});
const handleShowAuthSearch = () => {
    setShowAuthSearch(true);
  };

  const handleCloseSearch = () => {
    setShowAuthSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };
  const handleClearAuthSearch = () => {
    setSelectSearchValues([]);
    setSelectedCriteria([]);
    setResponseData([]);
    setSelectedAddress([]);
  };

const addTableRows = (triggeredFormName, index) => {


    let rowsInput = {};

    if (triggeredFormName === "CtmAuthorizationInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(
        ctmAuthGridData,
      );
    }
    setGridFieldTempState(rowsInput);
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
      if (
        operationValue !== "Edit" &&
        (operationValue === "Add" || operationValue === "Force Delete")
      ) {
         const rows = [...ctmAuthGridData];
        rows.splice(index, 1);
         setCtmAuthGridData(rows);
        props.updateCtmAuthGridData(rows);
      }
      if (operationValue === "Edit") {
        setGridFieldTempState({});
      }
    };

//  const handleGridSelectChange = (
//    index,
//    selectedValue,
//    event,
//    triggeredFormName,
//  ) => {
//    const { name } = event;
//    setGridFieldTempState({
//      ...gridFieldTempState,
//      [name]: (selectedValue?.value || selectedValue)?.toUpperCase(),
//    });
//  };
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
//  const handleGridDateChange = (
//    index,
//    selectedValue,
//    fieldName,
//    triggeredFormName,
//  ) => {
//    let tempInput = { ...gridFieldTempState };
//    tempInput[fieldName] = selectedValue;
//    console.log("tempInput:",tempInput);
//    setGridFieldTempState(tempInput);
//
//  };

//  const handleGridFieldChange = (index, evnt, triggeredFormName) => {
//
//    //let rowsInput = "";
//
//    let tempInput = { ...gridFieldTempState };
//    let { name, value } = evnt.target;
//
//
//    tempInput[name] = value.toUpperCase();
//    setGridFieldTempState(tempInput);
//
//  };
   const handleGridFieldChange = (index, event) => {
      let tempInput = { ...gridFieldTempState };
      let { name, value } = event.target;
      tempInput[name] = value.toUpperCase();
      setGridFieldTempState(tempInput);
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

  const handleWhiteGloveChange = (e) => {
    const isChecked = e.target.checked;
    setWhiteGloveIndicator(isChecked);
    ctmAuthorizationInformationData.isChecked = isChecked ? '1': '';
    props.setAuthorizationInformationCtm({...ctmAuthorizationInformationData});
    // if (isChecked) {
    //   setWhiteGloveCancelledReason("");
    // } else {
    //   setWhiteGloveReason("");
    // }
  };
  const handleAuthInformationBlur = (e) => {
      const scrollPosition = window.scrollY; // Save current scroll position

      const { name, value } = e.target;
      const updatedData = {
        ...ctmAuthorizationInformationData,
        [name]: value.toUpperCase(),
      };

      props.setAuthorizationInformationCtm(updatedData); // Backend update
      window.scrollTo(0, scrollPosition); // Restore scroll position
    };

   const handleLocalStateUpdate = (name, value) => {
      setCtmAuthorizationInformationData((prevState) => ({
        ...prevState,
        [name]: value.toUpperCase(),
      }));
    };

  const editTableRows = (index) => {
      let rowInput = ctmAuthGridData[index];
      setGridFieldTempState(rowInput);
    };
 const handleSelectedAuth = (flag) => {
    let rowNumber = getRowNumberForGrid(ctmAuthGridData);
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
      setCtmAuthGridData([
        ...ctmAuthGridData,
        ...addressToPopulate,
      ]);
      props.updateCtmAuthGridData([
        ...ctmAuthGridData,
        ...addressToPopulate,
      ]);
    }
    else {
      alert("Please select at least one row.");
      return;
    }

    setShowAuthSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };
    const showAuths = async () => {
      let FromDate =
        selectSearchValues?.fromDate || selectSearchValues?.fromDate2;
      let ToDate = selectSearchValues?.toDate || selectSearchValues?.toDate2;
      let ProviderID =
        selectSearchValues?.providerId || selectSearchValues?.providerId2;
      let AdmitPrimaryFromDate =
        selectSearchValues?.admitPrimaryFromDate ||
        selectSearchValues?.admitPrimaryFromDate2;
      let AdmitPrimaryToDate =
        selectSearchValues?.admitPrimaryToDate ||
        selectSearchValues?.admitPrimaryToDate2;
      let SequentialID =
        selectSearchValues?.sequentialIDId || selectSearchValues?.sequentialID2;
      let AuthorizationNumber = selectSearchValues?.authorizationNumber;
      // Check if at least one search parameter has a value
      if (
        FromDate ||
        ToDate ||
        ProviderID ||
        AdmitPrimaryFromDate ||
        AdmitPrimaryToDate ||
        SequentialID ||
        AuthorizationNumber
      ) {
        let getApiJson = {
          option: "GETAUTHSEARCHDATA",
          From_Date: extractDate(FromDate) || "",
          To_Date: extractDate(ToDate) || "",
          Admit_Primary_From_Date: extractDate(AdmitPrimaryFromDate) || "",
          Admit_Primary_To_Date: extractDate(AdmitPrimaryToDate) || "",
          Provider_ID: ProviderID || "",
          Sequential_ID: SequentialID || "",
          Authorization_Number: AuthorizationNumber || "",
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
                apiResponse.hasOwnProperty("Auth_Expiration_Date") &&
                typeof apiResponse.Auth_Expiration_Date === "string"
              ) {
                const rad = new Date(
                  getDatePartOnly(apiResponse.Auth_Expiration_Date),
                );
                apiResponse.Auth_Expiration_Date = extractDate(rad);
              }
              if (
                apiResponse.hasOwnProperty("Auth_Request_Date") &&
                typeof apiResponse.Auth_Request_Date === "string"
              ) {
                const rad = new Date(
                  getDatePartOnly(apiResponse.Auth_Request_Date),
                );
                apiResponse.Auth_Request_Date = extractDate(rad);
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

    const authSearchTableComponent = () => {
      let columnNames =
        "Authorization Number~Authorization_Number,Authorization Type~Authorization_Type,Auth Type Description~Auth_Type_Description,Provider Name~Provider_Name,Auth Request Date~Auth_Request_Date,Auth Service Start Date~Service_Start_Date,Auth Expiration Date~Auth_Expiration_Date,Auth Status~Auth_Status,Denial Code~Denial_Code,Denial Reason~Denial_Reason";
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
  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

    let clonedJson = { ...gridFieldTempState };

    console.log("Inside gridRowsFinalSubmit clonedJson value1: ", clonedJson);

    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "CtmAuthorizationInformationTable") {
        console.log("abc",ctmAuthGridData[index])
        let indexJson = ctmAuthGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
          console.log("Inside gridRowsFinalSubmit clonedJson value: ",clonedJson,);
        }


if (!checkGridJsonLength(clonedJson)) {
          console.log(
            "Inside gridRowsFinalSubmit clonedJson if value: ",
            clonedJson,
          );
          ctmAuthGridData[index] = clonedJson;
          setCtmAuthGridData([
            ...ctmAuthGridData,
          ]);
          props.updateCtmAuthGridData([
            ...ctmAuthGridData
          ]);
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

        if (triggeredFormName === "CtmAuthorizationInformationTable") {
          console.log("CtmAuthorizationInformationTable---->");
          gridRowArray = gridDataRef.current.hasOwnProperty(
            "CtmAuthorizationInformationTable",
          )
            ? [...gridDataRef.current.CtmAuthorizationInformationTable]
            : [];
          gridRowJson = { ...ctmAuthGridData[index] };

          if (Object.keys(gridRowJson).length !== 0) {
            gridRowJson["operation"] = oprtn;

            gridRowArray.push(trimJsonValues(gridRowJson));

            gridDataRef.current.CtmAuthorizationInformationTable =
              getGridDataValues(gridRowArray);
          }
        }
      }
    }
  };


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
          if (data[dataValue]) {
            if (data[dataValue].value) {
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
        <h2 className="accordion-header" id="panelsStayOpen-claimInformation">
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
           <button
                         type="button"
                         className="btn btn-outline-primary"
                         onClick={(event) => handleShowAuthSearch(event)}
                         disabled={
                           prop.state.stageName === "Redirect Review" ||
                           prop.state.stageName === "Documents Needed" ||
                           prop.state.stageName === "CaseArchived"
                         }
                       >
                         Auth Search
                       </button>
                       {showAuthSearch && (
                                     <AuthSearch
                                       handleCloseSearch={handleCloseSearch}
                                       selectedCriteria={selectedCriteria}
                                       setSelectedCriteria={setSelectedCriteria}
                                       selectSearchValues={selectSearchValues}
                                       setSelectSearchValues={setSelectSearchValues}
                                       showAuths={showAuths}
                                       authSearchTableComponent={authSearchTableComponent}
                                       responseData={responseData}
                                       setResponseData={setResponseData}
                                       handleClearAuthSearch={handleClearAuthSearch}
                                       showAuthSearch={showAuthSearch}
                                       handleSelectedAuth={handleSelectedAuth}
                                       setSelectedAddress={setSelectedAddress}
                                     />
                                   )}
            <div className="row my-2">
              <div className="col-xs-6 col-md-12">
                <CtmAuthorizationInformationTable
                  ctmAuthGridData={ctmAuthGridData}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
                  handleGridFieldChange={handleGridFieldChange}
//                   handleSelectedAuth={handleSelectedAuth}
                   setSelectedAddress={setSelectedAddress}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  validationSchema={
                    props.ctmAuthGridValidationSchema
                  }
                  lockStatus={
                    prop.state !== null &&
                    prop.state.lockStatus !== undefined &&
                    prop.state.lockStatus !== ""
                      ? prop.state.lockStatus
                      : "N"
                  }
                  fetchAutoPopulate={fetchAutoPopulate}
                  transactionType={CaseHeader.displayName}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

};
export default CtmAuthorizationInformationAccordion;
