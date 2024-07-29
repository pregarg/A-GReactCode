import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseHeader from './CaseHeader';
import RepresentativeInformationTable from "../TileFormsTables/RepresentativeInformationTable";
import useUpdateDecision from '../../CustomHooks/useUpdateDecision';
import TableComponent from "../../../../src/util/TableComponent";
import {useAxios} from "../../../api/axios.hook";
import RepresentativeSearch from "./RepresentativeSearch.js";

const RepresentativeInformationAccordion = (props) => {
    const {
        convertToCase,
        checkGridJsonLength,
        trimJsonValues,
        extractDate,
        getDatePartOnly,
        acceptNumbersOnly
    } = useGetDBTables();

    const { getRowNumberForGrid } = useUpdateDecision();

    const { ValueContainer, Placeholder } = components;

    const [representativeInformationGridData, setRepresentativeInformationGridData] = useState(props.handleRepresentativeInformationGridData);

    const [gridFieldTempState, setGridFieldTempState] = useState({});
    const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [responseData, setResponseData] = useState([]);
  const [showRepresentativeSearch, setshowRepresentativeSearch] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const {customAxios: axios} = useAxios();
  const [selectedAddress, setSelectedAddress] = useState([]);

    const CustomValueContainer = ({ children, ...props }) => {
        return (
            <ValueContainer {...props}>
                <Placeholder {...props} isFocused={props.isFocused}>
                    {props.selectProps.placeholder}
                </Placeholder>
                {React.Children.map(children, (child) =>
                    child && child.type !== Placeholder ? child : null
                )}
            </ValueContainer>
        );
    };
    const handleshowRepresentativeSearch = () => {
        setshowRepresentativeSearch(true);
      }
      const handleCloseSearch = () => {
        setshowRepresentativeSearch(false);
        setSelectedCriteria([]);
        setSelectSearchValues([]);
        setResponseData([]);
      }

      const handleClearRepresentativeSearch = () => {
        setSelectSearchValues([]);
        setSelectedCriteria([]);
        setResponseData([]);
      }
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

      const handleSelectedRepresentatives = () => {
        let rowNumber = getRowNumberForGrid(representativeInformationGridData)
        let addressToPopulate = []
        if (selectedAddress.length > 0) {
          selectedAddress.map((elem) => {
            if (elem?.isChecked) {
              elem.rowNumber = rowNumber;
              elem.operation = 'I';
              delete elem['isChecked'];
              rowNumber++;
              addressToPopulate.push(elem);
            }
          })
        }

        if (addressToPopulate.length > 0) {
         setRepresentativeInformationGridData([...representativeInformationGridData, ...addressToPopulate])
         props.updateRepresentativeInformationGridData([...representativeInformationGridData, ...addressToPopulate]);
        }


        setshowRepresentativeSearch(false);
        setSelectedCriteria([]);
        setSelectSearchValues([]);
        setResponseData([]);
      }


    const tabRef = useRef("HomeView");
    let prop = useLocation();
    const fetchAutoPopulate = useRef(false);

    const gridDataRef = useRef({});

    const addTableRows = (triggeredFormName, index) => {
        let rowsInput = {};

        if (triggeredFormName === "RepresentativeInformationTable") {
            rowsInput.rowNumber = getRowNumberForGrid(representativeInformationGridData);
        }
        setGridFieldTempState(rowsInput);
    };

    const deleteTableRows = (index, triggeredFormName, operationValue) => {
        console.log("deleteTableRows data ",index , triggeredFormName, operationValue)
        if (
            operationValue !== "Edit" &&
            (operationValue === "Add" || operationValue === "Force Delete")
        ) {
            console.log("operation value1--",operationValue)
            gridRowsFinalSubmit(triggeredFormName, index, "Delete");
            if (triggeredFormName === "RepresentativeInformationTable") {
                console.log("auth delete");
                const rows = [...representativeInformationGridData];
                rows.splice(index, 1);
                setRepresentativeInformationGridData(rows);
                props.updateRepresentativeInformationGridData(rows);
            }
        }

        if (operationValue === "Edit") {
            setGridFieldTempState({});
        }
    };

    const handleGridSelectChange = (
        index,
        selectedValue,
        evnt,
        triggeredFormName
    ) => {
        // console.log("Inside select change index: ", index);
        console.log("Inside select change selectedValue: ", evnt, selectedValue);
        // console.log("Inside select change evnt: ", evnt);
        // console.log("Inside select change trigeredFormName: ", triggeredFormName);
        let rowsInput = { ...gridFieldTempState };

        const { name } = evnt;
        let val = selectedValue;
        if (evnt.action === "clear") {
            if (name.toLowerCase() === "languages") {
                val = [];
            }
            else {
                val = { label: "", value: "" };
            }
        } else {

            if (selectedValue && selectedValue.label && selectedValue.value) {
                val = {
                    label: selectedValue.label.toUpperCase(),
                    value: selectedValue.value.toUpperCase(),
                };
            } else {
                // Handle the case where selectedValue or its properties are undefined
                console.log("selectedValue or its properties are undefined");
            }
        }

        console.log("Inside handleSelectChange Val: ", val);
        rowsInput[name] = val;

        setGridFieldTempState(rowsInput);
    };

    const handleGridDateChange = (
        index,
        selectedValue,
        fieldName,
        triggeredFormName
    ) => {
        let tempInput = { ...gridFieldTempState };
        tempInput[fieldName] = selectedValue;
        //console.log("Inside handleGridDateChange tempInput: ",tempInput);
        setGridFieldTempState(tempInput);
    };

    const handleGridFieldChange = (index, evnt, triggeredFormName) => {
        console.log("Inside handleGridFieldChange: ", triggeredFormName);
        //let rowsInput = "";

        let tempInput = { ...gridFieldTempState };
        let { name, value } = evnt.target;
        console.log("Inside handleGridFieldChange: ", value, tempInput);

        tempInput[name] = value.toUpperCase();
        setGridFieldTempState(tempInput);
        console.log("gridFieldTempState", gridFieldTempState);
    };



    const showRepresentatives = async () => {
        let SequentialMember     = selectSearchValues?.SequentialMemberID
        let searchType =  selectSearchValues?.searchTypeID
        let fordate = selectSearchValues?.fordateID
        let AddressType  = selectSearchValues?.AddressTypeID
        // Check if at least one search parameter has a value
        if (SequentialMember || searchType || fordate || AddressType) {
          let getApiJson = {
            option: 'GETREPRESENTATIVESEARCHDATA',

            Seq_Member_ID: SequentialMember || '',
            Search_Type: searchType ||'',
            For_Date: extractDate(fordate) || '',
            Address_Type: AddressType || ''
          };

          try {
            let res = await axios.post("/generic/callProcedure", getApiJson, {
              headers: {Authorization: `Bearer ${token}`},
            });
            let resApiData = res.data.CallProcedure_Output?.data || [];
            resApiData = (resApiData?.length > 0) ? resApiData : [];

            if (resApiData.length > 0) {
              const respKeys = Object.keys(resApiData);
              respKeys.forEach(k => {

                let apiResponse = resApiData[k];
                if (apiResponse.hasOwnProperty("Authorization_Approved_Date") && typeof apiResponse.Authorization_Approved_Date === "string") {
                  const mad = new Date(getDatePartOnly(apiResponse.Authorization_Approved_Date));
                  apiResponse.Authorization_Approved_Date = extractDate(mad);

                }
                if (apiResponse.hasOwnProperty("Authorization_Expiration_Date") && typeof apiResponse.Authorization_Expiration_Date === "string") {
                    const mad = new Date(getDatePartOnly(apiResponse.Authorization_Expiration_Date));
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
        let columnNames = 'First Name~First_Name,Last Name~Last_Name,Authorization Approved Date~Authorization_Approved_Date,Authorization Expiration Date~Authorization_Expiration_Date,Authorization Type~Authorization_Type,Phone Number~Phone_Number,Notes~Notes,Address (line 1)~Address_Line_1,Address (line 2)~Address_Line_2,City~City,State~State_,Zip Code~Zip_Code,County~County'
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
          )

        } else {
          return (<></>);
        }
      }


    const editTableRows = (index, triggeredFormName) => {
        console.log("Inside Representative editTableRows: ", triggeredFormName);
        let rowInput = {};

        if (triggeredFormName === "RepresentativeInformationTable") {
            rowInput = representativeInformationGridData[index];
            setGridFieldTempState(rowInput);
        }
    };

    const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
        console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

        let clonedJson = { ...gridFieldTempState };

        console.log("Inside gridRowsFinalSubmit clonedJson value1: ", clonedJson);

        if (Object.keys(gridFieldTempState).length !== 0) {
            if (triggeredFormName === "RepresentativeInformationTable") {
                let indexJson = representativeInformationGridData[index];

                if (indexJson !== undefined && indexJson !== null) {
                    clonedJson = Object.assign(indexJson, gridFieldTempState);
                    console.log("Inside gridRowsFinalSubmit clonedJson value: ",clonedJson);
                }

                if (!checkGridJsonLength(clonedJson)) {
                    console.log(
                        "Inside gridRowsFinalSubmit clonedJson if value: ",
                        clonedJson
                    );
                    representativeInformationGridData[index] = clonedJson;
                    setRepresentativeInformationGridData([...representativeInformationGridData]);
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

                if (triggeredFormName === "RepresentativeInformationTable") {
                    console.log("representativeInformationTable---->")
                    gridRowArray = gridDataRef.current.hasOwnProperty("representativeInformationTable")
                        ? [...gridDataRef.current.representativeInformationTable]
                        : [];
                    gridRowJson = { ...representativeInformationGridData[index] };

                    if (Object.keys(gridRowJson).length !== 0) {
                        gridRowJson["operation"] = oprtn;

                        gridRowArray.push(trimJsonValues(gridRowJson));

                        gridDataRef.current.representativeInformationTable = getGridDataValues(gridRowArray);
                    }
                }
            }
        };
    }

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
                    if (!!data[dataValue]) {
                        if (!!data[dataValue].value) {
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
                <h2
                    className="accordion-header"
                    id="panelsStayOpen-claimInformation"
                >
                    <button
                        className="accordion-button accordionButtonStyle"
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target="#panelsStayOpen-collapseclaimInformation"
                        aria-expanded="true"
                        aria-controls="panelsStayOpen-collapseOne"
                    >
                        Representative Information
                    </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseclaimInformation"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-claimInformation"
                >

                    <div className="accordion-body">
                    <button type="button" className="btn btn-outline-primary"
                          onClick={event => handleshowRepresentativeSearch(event)}>Representative Search
                  </button>
                        <div className="row my-2">
                            <div className="col-xs-6 col-md-12">
                                <RepresentativeInformationTable
                                    representativeInformationGridData={representativeInformationGridData}
                                    addTableRows={addTableRows}
                                    deleteTableRows={deleteTableRows}
                                    handleGridSelectChange={handleGridSelectChange}
                                    handleGridDateChange={handleGridDateChange}
                                    handleGridFieldChange={handleGridFieldChange}
                                    gridFieldTempState={gridFieldTempState}
                                    editTableRows={editTableRows}
                                    gridRowsFinalSubmit={gridRowsFinalSubmit}
                                    //selectJson={selectValues}
                                    lockStatus={
                                        prop.state !== null &&
                                            prop.state.lockStatus !== undefined &&
                                            prop.state.lockStatus !== ""
                                            ? prop.state.lockStatus
                                            : "N"
                                    }
                                    fetchAutoPopulate={fetchAutoPopulate}
                                    transactionType={CaseHeader.displayName}
                                ></RepresentativeInformationTable>
                            </div>

                        </div>
                    </div>
                    {showRepresentativeSearch && (
                            <RepresentativeSearch
                            handleCloseSearch={handleCloseSearch}
                            selectedCriteria={selectedCriteria}
                            setSelectedCriteria={setSelectedCriteria}
                            selectSearchValues={selectSearchValues}
                            setSelectSearchValues={setSelectSearchValues}
                            showRepresentatives = {showRepresentatives}
                            representativeSearchTableComponent={representativeSearchTableComponent}
                            responseData={responseData}
                            setResponseData={setResponseData}
                            handleClearRepresentativeSearch={handleClearRepresentativeSearch}
                            showRepresentativeSearch={showRepresentativeSearch}
                            handleSelectedRepresentatives = {handleSelectedRepresentatives}

                            />
                        )
                        }


                </div>
            </div>
        </div>
    )
}
export default RepresentativeInformationAccordion;