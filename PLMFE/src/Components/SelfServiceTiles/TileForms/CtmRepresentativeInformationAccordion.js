import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import CtmHeader from "./CtmHeader";
import CtmRepresentativeInformationTable from "../TileFormsTables/CtmRepresentativeInformationTable";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import RepresentativeSearch from "./RepresentativeSearch.js";
import { useAxios } from "../../../api/axios.hook";
import TableComponent from "../../../util/TableComponent";
import { useSelector } from "react-redux";

const CtmRepresentativeInformationAccordion = (props) => {
const {
    convertToCase,
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly,
    acceptNumbersOnly,
  } = useGetDBTables();

  const { getRowNumberForGrid } = useUpdateDecision();

  const [ctmRepGridData, setCtmRepGridData] = useState(props.handleCtmRepGridData || []);
  const [gridFieldTempState, setGridFieldTempState] = useState({});
const [showRepresentativeSearch, setshowRepresentativeSearch] =
    useState(false);
  const token = useSelector((state) => state.auth.token);
  const { customAxios: axios } = useAxios();
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
const handleshowRepresentativeSearch = () => {
    setshowRepresentativeSearch(true);
  };
  const handleCloseSearch = () => {
    setshowRepresentativeSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };

  const handleClearRepresentativeSearch = () => {
    setSelectSearchValues([]);
    setSelectedCriteria([]);
    setResponseData([]);
    setSelectedAddress([]);
  };
  const showRepresentatives = async () => {
    let SequentialMember = selectSearchValues?.SequentialMemberID;
    let searchType = selectSearchValues?.searchTypeID;
    let fordate = selectSearchValues?.fordateID;
    let AddressType = selectSearchValues?.AddressTypeID;
    // Check if at least one search parameter has a value
    if (SequentialMember || searchType || fordate || AddressType) {
      let getApiJson = {
        option: "GETREPRESENTATIVESEARCHDATA",

        Seq_Member_ID: SequentialMember || "",
        Search_Type: searchType || "",
        For_Date: extractDate(fordate) || "",
        Address_Type: AddressType || "",
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
              apiResponse.hasOwnProperty("Authorization_Approved_Date") &&
              typeof apiResponse.Authorization_Approved_Date === "string"
            ) {
              const mad = new Date(
                getDatePartOnly(apiResponse.Authorization_Approved_Date),
              );
              apiResponse.Authorization_Approved_Date = extractDate(mad);
            }
            if (
              apiResponse.hasOwnProperty("Authorization_Expiration_Date") &&
              typeof apiResponse.Authorization_Expiration_Date === "string"
            ) {
              const mad = new Date(
                getDatePartOnly(apiResponse.Authorization_Expiration_Date),
              );
              apiResponse.Authorization_Expiration_Date = extractDate(mad);
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

  const representativeSearchTableComponent = () => {
    let columnNames =
      "First Name~First_Name,Last Name~Last_Name,Authorization Approved Date~Authorization_Approved_Date,Authorization Expiration Date~Authorization_Expiration_Date,Authorization Type~Authorization_Type,Phone Number~Phone_Number,Notes~Notes,Address (line 1)~Address_Line_1,Address (line 2)~Address_Line_2,City~City,State~State_,Zip Code~Zip_Code,County~County";
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
const addTableRows = (triggeredFormName, index) => {


    let rowsInput = {};

    if (triggeredFormName === "CtmRepresentativeInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(
        ctmRepGridData,
      );
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

//  const handleGridFieldChange = (index, event) => {
//    let tempInput = { ...gridFieldTempState };
//    let { name, value } = event.target;
//    tempInput[name] = value.toUpperCase();
//    setGridFieldTempState(tempInput);
//  };
const handleGridFieldChange = (index, event) => {
  let tempInput = { ...gridFieldTempState };
  let { name, value } = event.target;

  // Ensure Phone Number and Zip Code fields only accept numeric values
  if (name === "Phone_Number" || name.includes("Zip_Code") ||  name.includes("Fax_Number")||  name.includes("Alternate_Phone_Number")) {
    if (!/^[0-9]*$/.test(value)) {
      alert(`${name.replace("_", " ")} should contain only numeric values.`);
      return; // Prevents setting invalid value
    }
  }

  tempInput[name] = value.toUpperCase();
  setGridFieldTempState(tempInput);
};


  const handleSelectedRepresentatives = () => {
    let rowNumber = getRowNumberForGrid(ctmRepGridData);
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
      setCtmRepGridData([
        ...ctmRepGridData,
        ...addressToPopulate,
      ]);
      props.updateCtmRepGridData([
        ...ctmRepGridData,
        ...addressToPopulate,
      ]);
    }
    else {
      alert("Please select at least one row.");
      return;
    }

    setshowRepresentativeSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
    setSelectedAddress([]);
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

          let updatedData = {
              ...ctmRepresentativeInformationData,
              isChecked: isChecked ? '1' : '',
              WhiteGloveCancelledReason: isChecked ? "" : ctmRepresentativeInformationData.WhiteGloveCancelledReason,
              WhiteGloveReason: !isChecked ? "" : ctmRepresentativeInformationData.WhiteGloveReason
          };

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
        <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={(event) => handleshowRepresentativeSearch(event)}
                      disabled={
                        prop.state.stageName === "Case Completed" ||
                        prop.state.stageName === "Case Archived"
                      }
                    >Representative Search
                    </button>
                     <div className="row my-2">
                                  <div className="col-xs-6 col-md-12">

                                  </div>
                                </div>
                                 {showRepresentativeSearch && (
                                            <RepresentativeSearch
                                              handleCloseSearch={handleCloseSearch}
                                              selectedCriteria={selectedCriteria}
                                              setSelectedCriteria={setSelectedCriteria}
                                              selectSearchValues={selectSearchValues}
                                              setSelectSearchValues={setSelectSearchValues}
                                              showRepresentatives={showRepresentatives}
                                              representativeSearchTableComponent={
                                                representativeSearchTableComponent
                                              }
                                              responseData={responseData}
                                              setResponseData={setResponseData}
                                              handleClearRepresentativeSearch={handleClearRepresentativeSearch}
                                              showRepresentativeSearch={showRepresentativeSearch}
                                              handleSelectedRepresentatives={handleSelectedRepresentatives}
                                              setSelectedAddress={setSelectedAddress}
                                            />
                                          )}
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
