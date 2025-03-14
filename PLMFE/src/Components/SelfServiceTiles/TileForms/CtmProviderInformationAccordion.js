import React, { useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import CtmProviderInformationTable from "../TileFormsTables/CtmProviderInformationTable";
import ProviderSearch from "../TileForms/ProviderSearch";
import { useAxios } from "../../../api/axios.hook";
import TableComponent from "../../../util/TableComponent";
import { useSelector } from "react-redux";

const CtmProviderInformationAccordion = (props) => {
  const {
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly,
  } = useGetDBTables();

  const { getRowNumberForGrid } = useUpdateDecision();

  const [providerGridData, setProviderGridData] = useState(props.handleProviderGridData || []);
  const [gridFieldTempState, setGridFieldTempState] = useState({});
  const [showRepSearch, setShowRepSearch] = useState(false);
  const tabRef = useRef("HomeView");
  const fetchAutoPopulate = useRef(false);
  const [responseData, setResponseData] = useState([]);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [whiteGloveIndicator, setWhiteGloveIndicator] = useState(props.handleData?.isChecked === '1');
  const [ctmProviderInformationData, setCtmProviderInformationData] =
    useState(props.handleData);
  const [showProviderSearch, setShowProviderSearch] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const { customAxios: axios } = useAxios();
  let [selectedAddress, setSelectedAddress] = useState([]);
  let prop = useLocation();
const location = useLocation();

const addTableRows = (triggeredFormName, index) => {


    let rowsInput = {};

    if (triggeredFormName === "CtmProviderInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(
        providerGridData,
      );
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
   const handleSelectedProviders = (flag) => {
     let rowNumber = getRowNumberForGrid(providerGridData);
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
       setProviderGridData([
         ...providerGridData,
         ...addressToPopulate,
       ]);
       props.updateProviderInformationGridData([
         ...providerGridData,
         ...addressToPopulate,
       ]);

     }
     else {
       alert("Please select at least one row.");
       return;
     }

     setShowProviderSearch(false);
     setSelectedCriteria([]);
     setSelectSearchValues([]);
     setResponseData([]);
   };
const handleShowProviderSearch = () => {
    setShowProviderSearch(true);
  };
  const handleCloseSearch = () => {
    setShowProviderSearch(false);
    setShowProviderSearch(false);
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
      let rowNumber = getRowNumberForGrid(providerGridData);
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
        setProviderGridData([
          ...providerGridData,
          ...addressToPopulate,
        ]);
        props.updateProviderGridData([
          ...providerGridData,
          ...addressToPopulate,
        ]);
      }
      else {
        alert("Please select at least one row.");
        return;
      }

      setShowProviderSearch(false);
      setSelectedCriteria([]);
      setSelectSearchValues([]);
      setResponseData([]);
    };
//  const handleGridFieldChange = (index, evnt, triggeredFormName) => {
//    let tempInput = { ...gridFieldTempState };
//    let { name, value } = evnt.target;
//    tempInput[name] = value.toUpperCase();
//    setGridFieldTempState(tempInput);
//  };
// Add this numeric validation function
const validateNumericInput = (value) => {
  const numericPattern = /^[0-9]*$/;
  if (!numericPattern.test(value)) {
    return "Please enter only numeric values.";
  }
  return null;
};

// Modify the handleGridFieldChange method
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

  const editTableRows = (index, triggeredFormName) => {
    if (triggeredFormName === "CtmProviderInformationTable") {
      setGridFieldTempState(providerGridData[index]);
    }
  };

const showProviders = async () => {
    let ProviderID = selectSearchValues?.providerID;
    let NPI = selectSearchValues?.NPI;
    let Taxid = selectSearchValues?.TaxID;
    let ProviderFirstName =
      selectSearchValues?.providerFirstName ||
      selectSearchValues?.providerFirstName2;
    let ProviderLastName =
      selectSearchValues?.providerLastName ||
      selectSearchValues?.providerLastName2;
    let City = selectSearchValues?.city || selectSearchValues?.facilitycity;
    let State =
      selectSearchValues?.state ||
      selectSearchValues?.state2 ||
      selectSearchValues?.facilityState2;
    let facilityName = selectSearchValues?.facilityName;

    if (
      ProviderID ||
      NPI ||
      Taxid ||
      ProviderFirstName ||
      ProviderLastName ||
      City ||
      State ||
      facilityName
    ) {
      let getApiJson = {
        option: "PROVIDERSEARCHDATA",
        ProviderID: ProviderID || "",
        NPI: NPI || "",
        Taxid: Taxid || "",
        ProviderFirstName: ProviderFirstName || "",
        ProviderLastName: ProviderLastName || "",
        City: City || "",
        State: State || "",
        facilityName: facilityName || "",
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
              apiResponse.hasOwnProperty("Provider_Par_Date") &&
              typeof apiResponse.Provider_Par_Date === "string"
            ) {
              const mad = new Date(
                getDatePartOnly(apiResponse.Provider_Par_Date),
              );
              apiResponse.Provider_Par_Date = extractDate(mad);
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

  const providerSearchTableComponent = () => {
    let columnNames =
      "Issue Number~Issue_Number,Provider ID~Provider_ID,Provider First Name~Provider_Name,Provider Last Name~Provider_Last_Name,TIN~Provider_TIN,Provider/Vendor Specialty~Provider_Vendor_Specialty,Provider Taxonomy~Provider_Taxonomy,NPI~NPI_ID,Phone~Phone_Number,Address Line 1~Address_Line_1,Address Line 2~Address_Line_2,Zip Code~Zip_Code,City~City,State~State,Participating Provider~Participating_Provider,Provider Par Date~Provider_Par_Date,Provider IPA~Provider_IPA,Vendor ID~Vendor_ID,Vendor Name~Vendor_Name,Provider Type~Provider_Type,Contact Name~Provider_Contact_Name,Contact Phone Number~Contact_Phone_Number,Contact Email Address~Contact_Email_Address";

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
                ...ctmProviderInformationData,
                isChecked: isChecked ? '1' : '',
                WhiteGloveCancelledReason: isChecked ? "" : ctmProviderInformationData.WhiteGloveCancelledReason,
                WhiteGloveReason: !isChecked ? "" : ctmProviderInformationData.WhiteGloveReason
            };

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
          <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={(event) => handleShowProviderSearch(event)}
                        disabled={
                          location.state.stageName === "Redirect Review" ||
                          location.state.stageName === "Documents Needed" ||
                          location.state.stageName === "CaseArchived"
                        }
                      >
                        Provider Search
                      </button>
                      {showProviderSearch && (
                                      <ProviderSearch
                                        handleCloseSearch={handleCloseSearch}
                                        selectedCriteria={selectedCriteria}
                                        setSelectedCriteria={setSelectedCriteria}
                                        selectSearchValues={selectSearchValues}
                                        setSelectSearchValues={setSelectSearchValues}
                                        handleClearSearch={handleClearSearch}
                                        showProviderSearch={showProviderSearch}
                                        showProviders={showProviders}
                                        providerSearchTableComponent={providerSearchTableComponent}
                                        responseData={responseData}
                                        setResponseData={setResponseData}
                                        handleSelectedProviders={handleSelectedProviders}
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
//                  validationSchema={props.providerGridValidationSchema}
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
