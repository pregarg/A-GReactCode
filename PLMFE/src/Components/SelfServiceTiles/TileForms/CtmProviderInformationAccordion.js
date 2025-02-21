import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import CtmProviderInformationTable from "../TileFormsTables/CtmProviderInformationTable";

const CtmProviderInformationAccordion = (props) => {
  const {
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
  } = useGetDBTables();

  const { getRowNumberForGrid } = useUpdateDecision();

  const [providerGridData, setProviderGridData] = useState(props.handleProviderGridData || []);
  const [gridFieldTempState, setGridFieldTempState] = useState({});
  const tabRef = useRef("HomeView");
  let prop = useLocation();
  const fetchAutoPopulate = useRef(false);


 const addTableRows = (triggeredFormName) => {
    let rowsInput = {};
    if (triggeredFormName === "CtmProviderInformationTable") {
      rowsInput.rowNumber = Array.isArray(providerGridData) ? providerGridData.length : 0;
    }
    setGridFieldTempState(rowsInput);
  };
  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
      const rows = [...providerGridData];
      rows.splice(index, 1);
      setProviderGridData(rows);
      props.updateProviderGridData(rows);
    }
    if (operationValue === "Edit") {
      setGridFieldTempState({});
    }
  };

  const handleGridFieldChange = (index, evnt, triggeredFormName) => {
    let tempInput = { ...gridFieldTempState };
    let { name, value } = evnt.target;
    tempInput[name] = value.toUpperCase();
    setGridFieldTempState(tempInput);
  };

  const editTableRows = (index, triggeredFormName) => {
    if (triggeredFormName === "CtmProviderInformationTable") {
      setGridFieldTempState(providerGridData[index]);
    }
  };

const handleGridSelectChange = (index, selectedValue, event) => {
    const { name } = event;
    setGridFieldTempState({
      ...gridFieldTempState,
      [name]: (selectedValue?.value || selectedValue)?.toUpperCase(),
    });
  };
 const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    let clonedJson = { ...gridFieldTempState };

    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "CtmProviderInformationTable") {
        let indexJson = providerGridData[index];
        if (indexJson) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
                providerGridData[index] = clonedJson;
                setProviderGridData([...providerGridData]);

        }
        //props.updateCtmRepGridData(ctmRepGridData.slice(0, -1));
        setTimeout(() => props.updateProviderGridData(providerGridData), 500);
      }
    }
  };
  return (
    <div>
      <div className="accordion-item" id="providerInformation">
        <h2 className="accordion-header" id="panelsStayOpen-providerInformation">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseProviderInformation"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseProviderInformation"
          >
            Provider Information
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseProviderInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-providerInformation"
        >
          <div className="accordion-body">
            <div className="row my-2">
              <div className="col-xs-6 col-md-12">
                <CtmProviderInformationTable
                  ctmProviderInformationGridData={providerGridData || []}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridFieldChange={handleGridFieldChange}
                   handleGridSelectChange={handleGridSelectChange}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  validationSchema={props.providerGridValidationSchema}
                  lockStatus={
                    prop.state !== null &&
                    prop.state.lockStatus !== undefined &&
                    prop.state.lockStatus !== ""
                      ? prop.state.lockStatus
                      : "N"
                  }
                  fetchAutoPopulate={fetchAutoPopulate}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtmProviderInformationAccordion;
