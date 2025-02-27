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
  const fetchAutoPopulate = useRef(false);
  const [responseData, setResponseData] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [whiteGloveIndicator, setWhiteGloveIndicator] = useState(props.handleData?.isChecked === '1');
  const [ctmProviderInformationData, setCtmProviderInformationData] =
    useState(props.handleData);

  let [selectedAddress, setSelectedAddress] = useState([]);
  let prop = useLocation();

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
  const handleGridDateChange = (index, selectedValue, fieldName) => {
    let tempInput = { ...gridFieldTempState };
    tempInput[fieldName] = selectedValue;
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

  //    const handleWhiteGloveChange = (e) => {
  //      const isChecked = e.target.checked;
  //      setWhiteGloveIndicator(isChecked);
  //      ctmProviderInformationData.isChecked = isChecked ? '1': '';
  //      props.setProviderInformationCtm({...ctmProviderInformationData});
  //      // if (isChecked) {
  //      //   setWhiteGloveCancelledReason("");
  //      // } else {
  //      //   setWhiteGloveReason("");
  //      // }
  //    };
  const handleWhiteGloveChange = (e) => {
    const isChecked = e.target.checked;
    setWhiteGloveIndicator(isChecked);

    let updatedData = { ...ctmProviderInformationData, isChecked: isChecked ? '1' : '' };

    // Clear White Glove Reason if unchecked
    if (!isChecked) {
      updatedData.WhiteGloveReason = "";
    }

    props.setProviderInformationCtm(updatedData);
  };

  const handleProviderInformationBlur = (e) => {
    const scrollPosition = window.scrollY; // Save current scroll position

    const { name, value } = e.target;
    const updatedData = {
      ...ctmProviderInformationData,
      [name]: value.toUpperCase(),
    };

    props.setProviderInformationCtm(updatedData); // Backend update
    window.scrollTo(0, scrollPosition); // Restore scroll position
  };

  const handleLocalStateUpdate = (name, value) => {
    setCtmProviderInformationData((prevState) => ({
      ...prevState,
      [name]: value.toUpperCase(),
    }));
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
              <div
                className="col-xs-6 col-md-3"
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                  alignItems: "center",
                }}
              >

                <label className="d-flex align-items-center" style={{ gap: "1px" }}>
                  <input
                    type="checkbox"
                    checked={whiteGloveIndicator}
                    onChange={handleWhiteGloveChange}
                    disabled={""}
                    style={{ marginRight: "8px" }}
                  />
                  White Glove Indicator?
                </label>
              </div>
            </div>
            <div className="form-floating">
              <input
                id="WhiteGloveReason"
                name="WhiteGloveReason"
                maxLength="4000"
                type="text"
                className="form-control"
                placeholder="White Glove Reason"
                // value={whiteGloveReason}
                value={ctmProviderInformationData.WhiteGloveReason || ""}

                onBlur={(e) => handleProviderInformationBlur(e)}
                onChange={(e) => handleLocalStateUpdate(e.target.name, e.target.value)}
                disabled={!whiteGloveIndicator}
              />
              <label>White Glove Reason</label>
              <div
                className="invalid-feedback"
                style={{ display: "block" }}
              ></div>
            </div><div className="form-floating">
              <input
                id="WhiteGloveCancelledReason"
                name="WhiteGloveCancelledReason"
                maxLength="4000"
                type="text"
                className="form-control"
                placeholder="White Glove Cancelled Reason"
                value={ctmProviderInformationData.WhiteGloveCancelledReason || ""}
                // onChange={(e) => setWhiteGloveCancelledReason(e.target.value)}

                onBlur={(e) => handleProviderInformationBlur(e)}
                onChange={(e) => handleLocalStateUpdate(e.target.name, e.target.value)}
                disabled={whiteGloveIndicator}
              />
              <label>White Glove Cancelled Reason</label>
              <div
                className="invalid-feedback"
                style={{ display: "block" }}
              ></div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-12">
                <CtmProviderInformationTable
                  ctmProviderInformationGridData={providerGridData || []}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridFieldChange={handleGridFieldChange}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
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
