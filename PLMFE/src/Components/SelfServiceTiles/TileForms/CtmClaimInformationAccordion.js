import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CtmHeader from "./CtmHeader";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import CtmClaimInformationTable from "../TileFormsTables/CtmClaimInformationTable";
import { useAxios } from "../../../api/axios.hook";


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
  const [showRepSearch, setShowRepSearch] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState();
   const [responseData, setResponseData] = useState([]);
   const [selectSearchValues, setSelectSearchValues] = useState();
  const tabRef = useRef("HomeView");
  let prop = useLocation();
  const fetchAutoPopulate = useRef(false);
  const gridDataRef = useRef({});
 let [selectedAddress, setSelectedAddress] = useState([]);

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

       setShowRepSearch(false);
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