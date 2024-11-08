import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseHeader from "./CaseHeader";
import DocNeededTable from "../TileFormsTables/DocNeededTable";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import { useAxios } from "../../../api/axios.hook";


const DocsNeededAccordion = (props) => {
  const {
    convertToCase,
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly,
    acceptNumbersOnly,
  } = useGetDBTables();

  const { getRowNumberForGrid } = useUpdateDecision();

  const [docNeededGridData,setdocNeededGridData,] = useState(props.handleDocNeededGridData);

  const [gridFieldTempState, setGridFieldTempState] = useState({});


  const tabRef = useRef("HomeView");
  let prop = useLocation();
  const fetchAutoPopulate = useRef(false);

  const gridDataRef = useRef({});

  const addTableRows = (triggeredFormName, index) => {
    let rowsInput = {};
    console.log("triggeredFormName DOC NEEDED",triggeredFormName)
    if (triggeredFormName === "DocNeededTable") {
      rowsInput.rowNumber = getRowNumberForGrid(
        docNeededGridData,
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
      if (triggeredFormName === "DocNeededTable") {
        console.log("auth delete");
        const rows = [...docNeededGridData];
        rows.splice(index, 1);
        setdocNeededGridData(rows);
        props.updatedocNeededGridData(rows);
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
    if(fieldName ===  'Received_Date' && gridFieldTempState['Request_Date'] && selectedValue) {
      const requestDate = new Date(gridFieldTempState['Request_Date']);
      const receivedDate = new Date(selectedValue);
      if(receivedDate<requestDate) {
        alert('Request Date can not be greater than Received Date');
        return;
      }
    }
    if(fieldName === 'Request_Date' && gridFieldTempState['Received_Date'] && selectedValue) {
      const requestDate = new Date(selectedValue);
      const receivedDate = new Date(gridFieldTempState['Received_Date']);
      if(receivedDate<requestDate) {
        alert('Request Date can not be greater than Received Date');
        return;
      }
    }
    if(fieldName ===  'Due_Date' && gridFieldTempState['Request_Date'] && selectedValue) {
      const requestDate = new Date(gridFieldTempState['Request_Date']);
      const dueDate = new Date(selectedValue);
      if(dueDate<requestDate) {
        alert('Request Date can not be greater than Due Date');
        return;
      }
    }
    if(fieldName === 'Request_Date' && gridFieldTempState['Due_Date'] && selectedValue) {
      const requestDate = new Date(selectedValue);
      const dueDate = new Date(gridFieldTempState['Due_Date']);
      if(dueDate<requestDate) {
        alert('Request Date can not be greater than Due Date');
        return;
      }
    }
    if(fieldName ===  'Follow_Up2_Date' && gridFieldTempState['Follow_Up1_Date'] && selectedValue) {
      const followup1Date = new Date(gridFieldTempState['Follow_Up1_Date']);
      const followup2Date = new Date(selectedValue);
      if(followup2Date<followup1Date) {
        alert('First Follow up date can not be greater than second follow up date');
        return;
      }
    }
    if(fieldName === 'Follow_Up1_Date' && gridFieldTempState['Follow_Up2_Date'] && selectedValue) {
      const followup1Date = new Date(selectedValue);
      const followup2Date = new Date(gridFieldTempState['Follow_Up2_Date']);
      if(followup2Date<followup1Date) {
        alert('First Follow up date can not be greater than second follow up date');
        return;
      }
    }
    if (fieldName === 'Follow_Up1_Date' && gridFieldTempState['Request_Date'] && gridFieldTempState['Received_Date'] && selectedValue) {
      const requestDate = new Date(gridFieldTempState['Request_Date']);
      const receivedDate = new Date(gridFieldTempState['Received_Date']);
      const followup1Date = new Date(selectedValue);

      if (followup1Date < requestDate || followup1Date > receivedDate) {
        alert('First Followup Date must be between Request Date and Received Date');
        return;
      }
    }

    // New validation to ensure Follow_Up2_Date is between Request_Date and Received_Date
    if (fieldName === 'Follow_Up2_Date' && gridFieldTempState['Request_Date'] && gridFieldTempState['Received_Date'] && selectedValue) {
      const requestDate = new Date(gridFieldTempState['Request_Date']);
      const receivedDate = new Date(gridFieldTempState['Received_Date']);
      const followup2Date = new Date(selectedValue);

      if (followup2Date < requestDate || followup2Date > receivedDate) {
        alert('Second Followup date must be between Request Date and Received Date');
        return;
      }
    }


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

    if (triggeredFormName === "DocNeededTable") {
      rowInput = docNeededGridData[index];
      setGridFieldTempState(rowInput);
    }
  };

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

    let clonedJson = { ...gridFieldTempState };

    console.log("Inside gridRowsFinalSubmit clonedJson value1: ", clonedJson);

    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "DocNeededTable") {
        console.log("abc",docNeededGridData[index])
        let indexJson = docNeededGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
          console.log("Inside gridRowsFinalSubmit clonedJson value: ",clonedJson,);
        }

        if (!checkGridJsonLength(clonedJson)) {
          console.log("Inside gridRowsFinalSubmit clonedJson if value: ", clonedJson,
          );
          docNeededGridData[index] = clonedJson;
          setdocNeededGridData(docNeededGridData);
        }
        props.updatedocNeededGridData (
          docNeededGridData.slice(0, -1),
        );
        setTimeout(
          () =>
            props.updatedocNeededGridData(
              docNeededGridData,
            ),
          500,
        );
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

        if (triggeredFormName === "DocNeededTable") {
          console.log("DocNeededTable---->");
          gridRowArray = gridDataRef.current.hasOwnProperty(
            "docNeededTable",
          )
            ? [...gridDataRef.current.docNeededTable]
            : [];
          gridRowJson = { ...docNeededGridData[index] };

          if (Object.keys(gridRowJson).length !== 0) {
            gridRowJson["operation"] = oprtn;

            gridRowArray.push(trimJsonValues(gridRowJson));

            gridDataRef.current.docNeededTable =
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
            Documents Needed
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
                <DocNeededTable
                  docNeededGridData={docNeededGridData}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
                  handleGridFieldChange={handleGridFieldChange}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  validationSchema={
                    props.docNeededGridValidationSchema
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
                ></DocNeededTable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DocsNeededAccordion;
