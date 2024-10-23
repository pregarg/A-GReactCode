import React, { useState, useRef, useEffect} from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";
import PDCaseInformationTable from "../TileFormsTables/PDCaseInformationTable";
import CaseHeader from "./CaseHeader";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";

const PdCaseInformationAccordion = (props) => {

  const location = useLocation();
  const providerDisputesConfigData = JSON.parse(
    process.env.REACT_APP_PROVIDERDISPUTES_DETAILS || "{}",
  );
  const stageName = providerDisputesConfigData["StageName"];

  const {
    convertToCase,
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly,
    acceptNumbersOnly,
  } = useGetDBTables();

  const { getRowNumberForGrid } = useUpdateDecision();
  const [caseInformationGridData,setcaseInformationGridData,] = useState(props.handlecaseInformationGridData);
  const [gridFieldTempState, setGridFieldTempState] = useState({});
  const tabRef = useRef("HomeView");
  let prop = useLocation();
  const fetchAutoPopulate = useRef(false);
  const gridDataRef = useRef({});

  useEffect(() => {
console.log("props.caseInformationFields", props.caseInformationFields, props.caseInformationData)
  }, [props.caseInformationFields, props.caseInformationData])


  const addTableRows = (triggeredFormName, index) => {
    let rowsInput = {};
    console.log("triggeredFormName PDCaseInformation",triggeredFormName)
    if (triggeredFormName === "PDCaseInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(
        caseInformationGridData,
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
      if (triggeredFormName === "PDCaseInformationTable") {
        console.log("PDCaseInformationTable delete");
        const rows = [...caseInformationGridData];
        rows.splice(index, 1);
        setcaseInformationGridData(rows);
        props.updatecaseInformationGridData(rows);
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
    console.log("Inside handleGridFieldChange: ", triggeredFormName);
    //let rowsInput = "";

    let tempInput = { ...gridFieldTempState };
    let { name, value } = evnt.target;
    console.log("Inside handleGridFieldChange: ", value, tempInput);

    tempInput[name] = value.toUpperCase();
    setGridFieldTempState(tempInput);
    console.log("gridFieldTempState", gridFieldTempState);
  };

  const editTableRows = (index, triggeredFormName) => {
    console.log("Inside Representative editTableRows: ", triggeredFormName);
    let rowInput = {};

    if (triggeredFormName === "PDCaseInformationTable") {
      rowInput = caseInformationGridData[index];
      setGridFieldTempState(rowInput);
    }
  };

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

    let clonedJson = { ...gridFieldTempState };

    console.log("Inside gridRowsFinalSubmit clonedJson value1: ", clonedJson);

    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "PDCaseInformationTable") {
        console.log("abc",caseInformationGridData[index])
        let indexJson = caseInformationGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
          console.log("Inside gridRowsFinalSubmit clonedJson value: ",clonedJson,);
        }

        if (!checkGridJsonLength(clonedJson)) {
          console.log("Inside gridRowsFinalSubmit clonedJson if value: ", clonedJson,
          );
          caseInformationGridData[index] = clonedJson;
          setcaseInformationGridData(caseInformationGridData);
        }
        props.updatecaseInformationGridData (
          caseInformationGridData.slice(0, -1),
        );
        setTimeout(
          () =>
            props.updatecaseInformationGridData(
              caseInformationGridData,
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

        if (triggeredFormName === "PDCaseInformationTable") {
          console.log("PDCaseInformationTable---->");
          gridRowArray = gridDataRef.current.hasOwnProperty(
            "pdCaseInformationTable",
          )
            ? [...gridDataRef.current.pdCaseInformationTable]
            : [];
          gridRowJson = { ...caseInformationGridData[index] };

          if (Object.keys(gridRowJson).length !== 0) {
            gridRowJson["operation"] = oprtn;

            gridRowArray.push(trimJsonValues(gridRowJson));

            gridDataRef.current.pdCaseInformationTable =
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


  

  const [caseInformationData, setcaseInformationData] = useState(props.caseInformationData || {});

  const handlecaseInformationData = (name, value, persist) => {
    const newData = {
      ...caseInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setcaseInformationData(newData);
    if (persist) {
      props.setcaseInformationData(newData);
    }
  };
  const persistcaseInformationDataData = () => {
    props.setcaseInformationData(caseInformationData);
  };

  const renderInputField = (name, placeholder, maxLength) => (
    <div className="col-xs-6 col-md-4">
      {!Array.isArray(caseInformationData) && 
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        data={caseInformationData}
        onChange={handlecaseInformationData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          props.renderType === RenderType.APPEALS &&
          (location.state.formView === "DashboardView" ||
            location.state.formView === "DashboardHomeView") &&
          ((stageName === "Start" && name !== "Acknowledgment_Timely") ||
            location.state.stageName === "Intake" ||
            location.state.stageName === "Acknowledge" ||
            location.state.stageName === "Redirect Review" ||
            location.state.stageName === "Documents Needed" ||
            location.state.stageName === "Research" ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            location.state.stageName === "Reopen" ||
            location.state.stageName === "CaseArchived")
        }
        persist={persistcaseInformationDataData}
        schema={props.pdCaseInformationValidationSchema}
        errors={props.pdCaseInformationErrors}
      />
      }
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
       {!Array.isArray(caseInformationData) && 
      <FormikSelectField
        name={name}
        placeholder={placeholder}
        data={caseInformationData}
        options={options}
        onChange={handlecaseInformationData}
        displayErrors={props.shouldShowSubmitError}
        disabled={
          props.renderType === RenderType.APPEALS &&
          location.state.formView === "DashboardView" &&
          (location.state.stageName === "Redirect Review" ||
            location.state.stageName === "Documents Needed" ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            location.state.stageName === "Reopen" ||
            location.state.stageName === "CaseArchived")
        }
        schema={props.pdCaseInformationValidationSchema}
        errors={props.pdCaseInformationErrors}
      />}
    </div>
  );


  return (
    <Formik
      initialValues={props.caseInformationData}
      validationSchema={props.pdCaseInformationValidationSchema}
      onSubmit={() => {}}
      enableReinitialize
    >
      {() => (
        <Form>
          <div className="accordion-item" id="caseTimelines">
            <h2 className="accordion-header" id="panelsStayOpen-Timelines">
              <button
                className="accordion-button accordionButtonStyle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseTimelines"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
              >
                Case Information
              </button>
            </h2>
            <div
              id="panelsStayOpen-collapseTimelines"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-Timelines"
            >
              <div className="accordion-body">
              
              {renderElements(
                  props.caseInformationFields,
                  renderSelectField,
                  renderInputField,
                  "",   
                )}

              <div className="row my-2">
              <div className="col-xs-6 col-md-12">
                <PDCaseInformationTable
                  caseInformationGridData={caseInformationGridData}
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
                  handleGridFieldChange={handleGridFieldChange}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
                  // validationSchema={
                  //   props.docNeededGridValidationSchema
                  // }
                  validationSchema={
                    props.authorizationInformationGridValidationSchema
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
                ></PDCaseInformationTable>
              </div>
            </div>
              </div>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PdCaseInformationAccordion;
