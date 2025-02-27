import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import CtmHeader from "./CtmHeader";
import CtmRepresentativeInformationTable from "../TileFormsTables/CtmRepresentativeInformationTable";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";

const CtmRepresentativeInformationAccordion = (props) => {
  const { checkGridJsonLength } = useGetDBTables();
  const { getRowNumberForGrid } = useUpdateDecision();

  const [ctmRepGridData, setCtmRepGridData] = useState(props.handleCtmRepGridData || []);
  const [gridFieldTempState, setGridFieldTempState] = useState({});

  const tabRef = useRef("HomeView");
  const fetchAutoPopulate = useRef(false);
  const gridDataRef = useRef({});
 const [responseData, setResponseData] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [whiteGloveIndicator, setWhiteGloveIndicator] = useState(props.handleData?.isChecked === '1');
  const [ctmRepresentativeInformationData, setCtmRepresentativeInformationData] =
    useState(props.handleData);

 let [selectedAddress, setSelectedAddress] = useState([]);
  const prop = useLocation();

  const addTableRows = (triggeredFormName) => {
    let rowsInput = {};
    if (triggeredFormName === "CtmRepresentativeInformationTable") {
      rowsInput.rowNumber = Array.isArray(ctmRepGridData) ? ctmRepGridData.length : 0;
    }
    setGridFieldTempState(rowsInput);
  };

const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
       const rows = [...ctmRepGridData];
      rows.splice(index, 1);
       setCtmRepGridData(rows);
      props.updateCtmRepGridData(rows);
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

      let updatedData = { ...ctmRepresentativeInformationData, isChecked: isChecked ? '1' : '' };

      // Clear White Glove Reason if unchecked
      if (!isChecked) {
        updatedData.WhiteGloveReason = "";
      }

      props.setRepresentativeInformationCtm(updatedData);
    };
    const handleRepresentativeInformationBlur = (e) => {
        const scrollPosition = window.scrollY; // Save current scroll position

        const { name, value } = e.target;
        const updatedData = {
          ...ctmRepresentativeInformationData,
          [name]: value.toUpperCase(),
        };

        props.setRepresentativeInformationCtm(updatedData); // Backend update
        window.scrollTo(0, scrollPosition); // Restore scroll position
      };

     const handleLocalStateUpdate = (name, value) => {
        setCtmRepresentativeInformationData((prevState) => ({
          ...prevState,
          [name]: value.toUpperCase(),
        }));
      };
  const editTableRows = (index) => {
    let rowInput = ctmRepGridData[index];
    setGridFieldTempState(rowInput);
  };

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    let clonedJson = { ...gridFieldTempState };

    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "CtmRepresentativeInformationTable") {
        let indexJson = ctmRepGridData[index];
        if (indexJson) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          ctmRepGridData[index] = clonedJson;
          setCtmRepGridData(ctmRepGridData);
        }
        //props.updateCtmRepGridData(ctmRepGridData.slice(0, -1));
        setTimeout(() => props.updateCtmRepGridData(ctmRepGridData), 500);
      }
    }
  };

  return (
    <div>
      <div className="accordion-item" id="ctmRepresentative">
        <h2 className="accordion-header" id="panelsStayOpen-ctmRepresentative">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapseCtmRepresentative"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapseCtmRepresentative"
          >
            Representative Information
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseCtmRepresentative"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-ctmRepresentative"
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
                                    </div>
                                     <div className="accordion-body">
                          <div className="form-floating">
                                        <input
                                          id="WhiteGloveReason"
                                          name="WhiteGloveReason"
                                          maxLength="4000"
                                          type="text"
                                          className="form-control"
                                          placeholder="White Glove Reason"
                                          // value={whiteGloveReason}
                                          value={ctmRepresentativeInformationData.WhiteGloveReason || ""}

                                          onBlur={(e) => handleRepresentativeInformationBlur(e)}
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
                                                            value={ctmRepresentativeInformationData.WhiteGloveCancelledReason || ""}
                                                            // onChange={(e) => setWhiteGloveCancelledReason(e.target.value)}

                                                            onBlur={(e) => handleRepresentativeInformationBlur(e)}
                                                            onChange={(e) => handleLocalStateUpdate(e.target.name, e.target.value)}
                                                            disabled={whiteGloveIndicator}
                                                          />
                                                          <label>White Glove Cancelled Reason</label>
                                                          <div
                                                            className="invalid-feedback"
                                                            style={{ display: "block" }}
                                                          ></div>
                                                        </div>
                                                        </div>
          <div className="accordion-body">
            <div className="row my-2">
              <div className="col-xs-6 col-md-12">
                <CtmRepresentativeInformationTable
                  ctmRepresentativeInformationGridData={ctmRepGridData}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
                  handleGridFieldChange={handleGridFieldChange}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  validationSchema={props.ctmRepGridValidationSchema}
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

export default CtmRepresentativeInformationAccordion;
