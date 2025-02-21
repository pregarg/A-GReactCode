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
  const tabRef = useRef("HomeView");
  let prop = useLocation();
  const fetchAutoPopulate = useRef(false);
  const gridDataRef = useRef({});

  const addTableRows = (triggeredFormName) => {
    let rowsInput = {};
    if (triggeredFormName === "CtmClaimInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(ctmClaimInformationGridData);
    }
    setGridFieldTempState(rowsInput);
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
     gridRowsFinalSubmit(triggeredFormName, index, "Delete");
      if (triggeredFormName === "CtmClaimInformationTable") {
              const rows = [...ctmClaimInformationGridData];
              rows.splice(index, 1);
             setCtmClaimInformationGridData(rows);
               props.updateCtmClaimInformationGridData(rows);
            }
     };
  const handleGridSelectChange = (index, selectedValue, event, triggeredFormName) => {
    const { name } = event;
    setGridFieldTempState({
      ...gridFieldTempState,
      [name]: (selectedValue?.value || selectedValue)?.toUpperCase(),
    });
  };

  const handleGridDateChange = (index, selectedValue, fieldName, triggeredFormName) => {
    let tempInput = { ...gridFieldTempState };
    tempInput[fieldName] = selectedValue;
    setGridFieldTempState(tempInput);
  };

  const handleGridFieldChange = (index, evnt, triggeredFormName) => {
    let tempInput = { ...gridFieldTempState };
    let { name, value } = evnt.target;
    tempInput[name] = value.toUpperCase();
    setGridFieldTempState(tempInput);
  };

  const editTableRows = (index, triggeredFormName) => {
    if (triggeredFormName === "CtmClaimInformationTable") {
      setGridFieldTempState(ctmClaimInformationGridData[index]);
    }
  };

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    if (Object.keys(gridFieldTempState).length !== 0) {
      let clonedJson = { ...gridFieldTempState };
      let indexJson = ctmClaimInformationGridData[index];

      if (indexJson !== undefined && indexJson !== null) {
        clonedJson = Object.assign(indexJson, gridFieldTempState);
      }

      if (!checkGridJsonLength(clonedJson)) {
        ctmClaimInformationGridData[index] = clonedJson;
        setCtmClaimInformationGridData([...ctmClaimInformationGridData]);
        props.updateCtmClaimInformationGridData(ctmClaimInformationGridData);
      }
    }
  };
//  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
//    let clonedJson = { ...gridFieldTempState };
//    console.log("Cloned Json is : ", clonedJson)
//    console.log("Triggered Name : ", triggeredFormName)
//    if (Object.keys(gridFieldTempState).length !== 0) {
//      if (triggeredFormName === "CtmClaimInformationTable") {
//        console.log("abc",ClaimGridData[index])
//        let indexJson = ClaimGridData[index];
//
//        if (indexJson !== undefined && indexJson !== null) {
//          clonedJson = Object.assign(indexJson, gridFieldTempState);
//        }
//
//        if (!checkGridJsonLength(clonedJson)) {
//          ClaimGridData[index] = clonedJson;
//          setClaimGridData([...claimGridData]);
//
//        }
//      }
//
//      //Handling for data update/Delete/Insert inside grids.
//      if (tabRef.current === "DashboardView") {
//        let oprtn;
//        let gridRowJson = {};
//        if (operationType === "Add") {
//          oprtn = "I";
//        }
//
//        if (operationType === "Edit") {
//          oprtn = "U";
//        }
//
//        if (operationType === "Delete") {
//          oprtn = "D";
//        }
//        let gridRowArray = [];
//
//        if (triggeredFormName === "CtmClaimInformationTable") {
//          gridRowArray = gridDataRef.current.hasOwnProperty(
//            "CtmClaimInformationTable",
//          )
//            ? [...gridDataRef.current.CtmClaimInformationTable]
//            : [];
//          gridRowJson = { ...ClaimGridData[index] };
//
//          if (Object.keys(gridRowJson).length !== 0) {
//            gridRowJson["operation"] = oprtn;
//
//            gridRowArray.push(trimJsonValues(gridRowJson));
//
//            gridDataRef.current.CtmClaimInformationTable =
//              getGridDataValues(gridRowArray);
//          }
//        }
//
//      }
//      props.updateClaimGridData(claimGridData);([...ClaimGridData]);
//    }
//  };
  const getGridDataValues = (tableData) => {
    let returnArray = [];
    tableData.forEach((data) => {
      const dataObject = {};
      Object.keys(data).forEach((key) => {
        if (typeof data[key] === "object" && data[key]) {
          if (data[key].value instanceof Date) {
            dataObject[key] = extractDate(data[key].value);
          } else {
            dataObject[key] = data[key].value || "";
          }
        } else {
          dataObject[key] = data[key];
        }
      });
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

                  ctmClaimInformationGridData={ctmClaimInformationGridData || []}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
                  handleGridFieldChange={handleGridFieldChange}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  validationSchema={props.ctmClaimInformationGridRowValidationSchema}
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

}
export default CtmClaimInformationAccordion;