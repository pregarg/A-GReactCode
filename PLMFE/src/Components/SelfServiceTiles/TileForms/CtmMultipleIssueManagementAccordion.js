import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import CtmHeader from "./CtmHeader";
import CtmMultipleIssueManagementTable from "../TileFormsTables/CtmMultipleIssueManagementTable";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";

const CtmMultipleIssueManagementAccordion = (props) => {
  const { checkGridJsonLength } = useGetDBTables();
  const { getRowNumberForGrid } = useUpdateDecision();

  const [ctmMultiGridData, setCtmMultiGridData] = useState(props.handleCtmMultiGridData || []);
  const [gridFieldTempState, setGridFieldTempState] = useState({});

  const tabRef = useRef("HomeView");
  const fetchAutoPopulate = useRef(false);
  const gridDataRef = useRef({});

  const prop = useLocation();

  const addTableRows = (triggeredFormName) => {
    let rowsInput = {};
    if (triggeredFormName === "CtmMultipleIssueManagementTable") {
      rowsInput.rowNumber = Array.isArray(ctmMultiGridData) ? ctmMultiGridData.length : 0;
    }
    setGridFieldTempState(rowsInput);
  };

const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
       const rows = [...ctmMultiGridData];
      rows.splice(index, 1);
       setCtmMultiGridData(rows);
      props.updateCtmMultiGridData(rows);
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

  const editTableRows = (index) => {
    let rowInput = ctmMultiGridData[index];
    setGridFieldTempState(rowInput);
  };

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    let clonedJson = { ...gridFieldTempState };

    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "CtmMultipleIssueManagementTable") {
        let indexJson = ctmMultiGridData[index];
        if (indexJson) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          ctmMultiGridData[index] = clonedJson;
          setCtmMultiGridData(ctmMultiGridData);
        }
        //props.updateCtmRepGridData(ctmRepGridData.slice(0, -1));
        setTimeout(() => props.updateCtmMultiGridData(ctmMultiGridData), 500);
      }
    }
  };

  return (
    <div>
      <div className="accordion-item" id="ctmRepresentative">
        <h2 className="accordion-header" id="panelsStayOpen-ctmMultipleIssueManagement">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseCtmMultipleIssueManagement"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseCtmMultipleIssueManagement"
          >
            Multiple Issue Management Accordion
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseCtmRepresentative"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-ctmMultipleIssueManagement"
        >
          <div className="accordion-body">
            <div className="row my-2">
              <div className="col-xs-6 col-md-12">
                <CtmMultipleIssueManagementTable
                  ctmMultipleIssueManagementGridData={ctmMultiGridData}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
                  handleGridFieldChange={handleGridFieldChange}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  validationSchema={props.ctmMultiGridValidationSchema}
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

export default CtmMultipleIssueManagementAccordion;
