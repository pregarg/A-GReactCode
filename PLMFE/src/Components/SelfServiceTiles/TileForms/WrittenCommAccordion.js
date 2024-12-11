import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseHeader from "./CaseHeader";
import WrittenCommTable from "../TileFormsTables/WrittenCommTable";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import { useAxios } from "../../../api/axios.hook";


const WrittenCommAccordion = (props) => {
  const {
    convertToCase,
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly,
    acceptNumbersOnly,
  } = useGetDBTables();

  const { getRowNumberForGrid } = useUpdateDecision();

  const [writtenCommGridData,setWrittenCommGridData,] = useState(props.handleWrittenCommGridData);

  const [gridFieldTempState, setGridFieldTempState] = useState({});


  const tabRef = useRef("HomeView");
  let prop = useLocation();
  const fetchAutoPopulate = useRef(false);

  const gridDataRef = useRef({});

  useEffect(()=> {
    if(props.memberInformation && writtenCommGridData?.length > 0) {
      writtenCommGridData.forEach(dt => {
        dt.Member_Provider_List = props.memberInformation.Member_First_Name + ' ' + props.memberInformation.Member_Last_Name
      })
      setWrittenCommGridData([...writtenCommGridData])
    }

  }, [props.handleWrittenCommGridData, writtenCommGridData])

  const addTableRows = (triggeredFormName, index) => {
    let rowsInput = {};
    console.log("triggeredFormName DOC NEEDED",triggeredFormName)
    if (triggeredFormName === "WrittenCommTable") {
      rowsInput.rowNumber = getRowNumberForGrid(
        writtenCommGridData,
      );
    }
    setGridFieldTempState(rowsInput);
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    console.log(
      "deleteTableRows data ",
      index,
      triggeredFormName,
      operationValue,
    );
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
      console.log("operation value1--", operationValue);
      gridRowsFinalSubmit(triggeredFormName, index, "Delete");
      if (triggeredFormName === "WrittenCommTable") {
        console.log("auth delete");
        const rows = [...writtenCommGridData];
        rows.splice(index, 1);
        setWrittenCommGridData(rows);
        props.updateWrittenCommGridData(rows);
      }
    }

    if (operationValue === "Edit") {
      setGridFieldTempState({});
    }
  };

  const handleGridSelectChange = (
    index,
    selectedValue,
    event,
    triggeredFormName,
  ) => {
    const { name } = event;
    setGridFieldTempState({
      ...gridFieldTempState,
      [name]: (selectedValue?.value || selectedValue)?.toUpperCase(),
    });
  };

  const handleGridDateChange = (
    index,
    selectedValue,
    fieldName,
    triggeredFormName,
  ) => {
    let tempInput = { ...gridFieldTempState };
    tempInput[fieldName] = selectedValue;
    console.log("tempInput:",tempInput);
    setGridFieldTempState(tempInput);

  };

  const handleGridFieldChange = (index, evnt, triggeredFormName) => {

    //let rowsInput = "";

    let tempInput = { ...gridFieldTempState };
    let { name, value } = evnt.target;


    tempInput[name] = value.toUpperCase();
    setGridFieldTempState(tempInput);

  };

  const editTableRows = (index, triggeredFormName) => {

    let rowInput = {};

    if (triggeredFormName === "WrittenCommTable") {
      rowInput = writtenCommGridData[index];
      setGridFieldTempState(rowInput);
    }
  };

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

    let clonedJson = { ...gridFieldTempState };

    console.log("Inside gridRowsFinalSubmit clonedJson value1: ", clonedJson);

    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "WrittenCommTable") {
        console.log("abc",writtenCommGridData[index])
        let indexJson = writtenCommGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
          console.log("Inside gridRowsFinalSubmit clonedJson value: ",clonedJson,);
        }

        if (!checkGridJsonLength(clonedJson)) {
          console.log("Inside gridRowsFinalSubmit clonedJson if value: ", clonedJson,
          );
          writtenCommGridData[index] = clonedJson;
          setWrittenCommGridData(writtenCommGridData);
        }
        // props.updateWrittenCommGridData (
        //   writtenCommGridData.slice(0, -1),
        // );
        // setTimeout(
        //   () =>
        //     props.updateWrittenCommGridData(
        //       writtenCommGridData,
        //     ),
        //   500,
        // );
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

        if (triggeredFormName === "WrittenCommTable") {
          console.log("WrittenCommTable---->");
          gridRowArray = gridDataRef.current.hasOwnProperty(
            "WrittenCommTable",
          )
            ? [...gridDataRef.current.WrittenCommTable]
            : [];
          gridRowJson = { ...writtenCommGridData[index] };

          if (Object.keys(gridRowJson).length !== 0) {
            gridRowJson["operation"] = oprtn;

            gridRowArray.push(trimJsonValues(gridRowJson));

            gridDataRef.current.WrittenCommTable =
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
            Written Communication
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseclaimInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-claimInformation"
        >
          <div className="accordion-body">
           
            <div className="row my-2">
              <div className="col-xs-6 col-md-12">
                <WrittenCommTable
                memberInformation={props.memberInformation}
                providerInformationGrid={props.providerInformationGrid}
                  writtenCommGridData={writtenCommGridData}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
                  handleGridFieldChange={handleGridFieldChange}
                  setGridFieldTempState={setGridFieldTempState}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  validationSchema={
                    props.writtenCommGridValidationSchema
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
                ></WrittenCommTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WrittenCommAccordion;
