import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Field, ErrorMessage } from "formik";
import Select, { components } from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import CaseHeader from "./CaseHeader";
import AuthorizationInformationTable from "../TileFormsTables/ProviderDisputeAuthorizationInformationTable";
import useUpdateDecision from "../../CustomHooks/useUpdateDecision";
import AuthSearch from "../TileForms/AuthSearch";
import { useAxios } from "../../../api/axios.hook";
import TableComponent from "../../../../src/util/TableComponent";
import { selectStyle } from "./SelectStyle";

const AuthorizationInformationAccordion = (props) => {
  const {
    convertToCase,
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly,
    acceptNumbersOnly,
  } = useGetDBTables();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const stageName = caseHeaderConfigData["StageName"];

  const { customAxios: axios } = useAxios();
  const token = useSelector((state) => state.auth.token);
  const { getRowNumberForGrid } = useUpdateDecision();

  const { ValueContainer, Placeholder } = components;

  const [authorizationInformationData, setAuthorizationInformationData] =
    useState(props.handleData);

  const [
    authorizationInformationGridData,
    setAuthorizationInformationGridData,
  ] = useState(props.handleAuthorizationInformationGridData);

  const [gridFieldTempState, setGridFieldTempState] = useState({});

  const [showAuthSearch, setShowAuthSearch] = useState(false);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [responseData, setResponseData] = useState([]);
  let [selectedAddress, setSelectedAddress] = useState([]);

  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, (child) =>
          child && child.type !== Placeholder ? child : null,
        )}
      </ValueContainer>
    );
  };

  const handleShowAuthSearch = () => {
    setShowAuthSearch(true);
  };

  const handleCloseSearch = () => {
    setShowAuthSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };
  const handleClearAuthSearch = () => {
    setSelectSearchValues([]);
    setSelectedCriteria([]);
    setResponseData([]);
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

  const handleSelectedAuth = (flag) => {
    let rowNumber = getRowNumberForGrid(authorizationInformationGridData);
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
      setAuthorizationInformationGridData([
        ...authorizationInformationGridData,
        ...addressToPopulate,
      ]);
      props.updateAuthorizationInformationGridData([
        ...authorizationInformationGridData,
        ...addressToPopulate,
      ]);
    }

    setShowAuthSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };

  const tabRef = useRef("HomeView");
  let prop = useLocation();
  const fetchAutoPopulate = useRef(false);

  const gridDataRef = useRef({});

  const addTableRows = (triggeredFormName, index) => {
    let rowsInput = {};

    if (triggeredFormName === "AuthorizationInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(
        authorizationInformationGridData,
      );
    }
    setGridFieldTempState(rowsInput);
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    console.log("operation value--", operationValue);
    if (
      operationValue !== "Edit" &&
      (operationValue === "Add" || operationValue === "Force Delete")
    ) {
      console.log("operation value1--", operationValue);
      gridRowsFinalSubmit(triggeredFormName, index, "Delete");
      if (triggeredFormName === "AuthorizationInformationTable") {
        const rows = [...authorizationInformationGridData];
        rows.splice(index, 1);
        setAuthorizationInformationGridData(rows);
        props.updateAuthorizationInformationGridData(rows);
      }
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

  const editTableRows = (index, triggeredFormName) => {
    console.log("Inside editTableRows: ", triggeredFormName);
    let rowInput = {};

    if (triggeredFormName === "AuthorizationInformationTable") {
      rowInput = authorizationInformationGridData[index];
      setGridFieldTempState(rowInput);
    }
  };

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    console.log("Inside gridRowsFinalSubmit with view: ", tabRef);

    let clonedJson = { ...gridFieldTempState };

    console.log("Inside gridRowsFinalSubmit clonedJson value1: ", clonedJson);

    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "AuthorizationInformationTable") {
        let indexJson = authorizationInformationGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          console.log(
            "Inside gridRowsFinalSubmit clonedJson if value: ",
            clonedJson,
          );
          authorizationInformationGridData[index] = clonedJson;
          setAuthorizationInformationGridData(authorizationInformationGridData);
        }
        props.updateAuthorizationInformationGridData(
          authorizationInformationGridData.slice(0, -1),
        );
        setTimeout(
          () =>
            props.updateAuthorizationInformationGridData(
              authorizationInformationGridData,
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

        if (triggeredFormName === "AuthorizationInformationTable") {
          gridRowArray = gridDataRef.current.hasOwnProperty(
            "authorizationInformationTable",
          )
            ? [...gridDataRef.current.authorizationInformationTable]
            : [];
          gridRowJson = { ...authorizationInformationGridData[index] };

          if (Object.keys(gridRowJson).length !== 0) {
            gridRowJson["operation"] = oprtn;

            gridRowArray.push(trimJsonValues(gridRowJson));

            gridDataRef.current.authorizationInformationTable =
              getGridDataValues(gridRowArray);
          }
        }
      }
    }
  };
  const authorizationDecisionValues = [
    { value: "APPROVED", label: "APPROVED" },
    { value: "DENIED", label: "DENIED" },
  ];

  const authorizationDecisionReasonValues = [
    { label: "INSUFFICIENT INFORMATION", value: "INSUFFICIENT INFORMATION" },
    { label: "DOCUMENTATION INCOMPLETE", value: "DOCUMENTATION INCOMPLETE" },
    { label: "PENDING APPROVAL", value: "PENDING APPROVAL" },
    { label: "OTHER", value: "OTHER" },
  ];

  const showAuths = async () => {
    let FromDate =
      selectSearchValues?.fromDate || selectSearchValues?.fromDate2;
    let ToDate = selectSearchValues?.toDate || selectSearchValues?.toDate2;
    let ProviderID =
      selectSearchValues?.providerId || selectSearchValues?.providerId2;
    let AdmitPrimaryFromDate =
      selectSearchValues?.admitPrimaryFromDate ||
      selectSearchValues?.admitPrimaryFromDate2;
    let AdmitPrimaryToDate =
      selectSearchValues?.admitPrimaryToDate ||
      selectSearchValues?.admitPrimaryToDate2;
    let SequentialID =
      selectSearchValues?.sequentialIDId || selectSearchValues?.sequentialID2;
    let AuthorizationNumber = selectSearchValues?.authorizationNumber;
    // Check if at least one search parameter has a value
    if (
      FromDate ||
      ToDate ||
      ProviderID ||
      AdmitPrimaryFromDate ||
      AdmitPrimaryToDate ||
      SequentialID ||
      AuthorizationNumber
    ) {
      let getApiJson = {
        option: "GETAUTHSEARCHDATA",
        From_Date: extractDate(FromDate) || "",
        To_Date: extractDate(ToDate) || "",
        Admit_Primary_From_Date: extractDate(AdmitPrimaryFromDate) || "",
        Admit_Primary_To_Date: extractDate(AdmitPrimaryToDate) || "",
        Provider_ID: ProviderID || "",
        Sequential_ID: SequentialID || "",
        Authorization_Number: AuthorizationNumber || "",
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
              apiResponse.hasOwnProperty("Service_Start_Date") &&
              typeof apiResponse.Service_Start_Date === "string"
            ) {
              const mad = new Date(
                getDatePartOnly(apiResponse.Service_Start_Date),
              );
              apiResponse.Service_Start_Date = extractDate(mad);
            }
            if (
              apiResponse.hasOwnProperty("Auth_Expiration_Date") &&
              typeof apiResponse.Auth_Expiration_Date === "string"
            ) {
              const rad = new Date(
                getDatePartOnly(apiResponse.Auth_Expiration_Date),
              );
              apiResponse.Auth_Expiration_Date = extractDate(rad);
            }
            if (
              apiResponse.hasOwnProperty("Auth_Request_Date") &&
              typeof apiResponse.Auth_Request_Date === "string"
            ) {
              const rad = new Date(
                getDatePartOnly(apiResponse.Auth_Request_Date),
              );
              apiResponse.Auth_Request_Date = extractDate(rad);
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

  const authSearchTableComponent = () => {
    let columnNames =
      "Authorization Number~Authorization_Number,Authorization Type~Authorization_Type,Auth Type Description~Auth_Type_Description,Provider Name~Provider_Name,Auth Request Date~Auth_Request_Date,Auth Service Start Date~Service_Start_Date,Auth Expiration Date~Auth_Expiration_Date,Auth Status~Auth_Status,Denial Code~Denial_Code,Denial Reason~Denial_Reason";
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
  const wrapPlaceholder = (name, placeholder) => {
    const field = props.caseInformationValidationSchema?.fields?.[name];
    const required =
      (field?.type === "date" && field?.internalTests?.optionality) ||
      field?.tests?.some((test) => test.OPTIONS?.name === "required");
    return `${placeholder}${required ? " *" : ""}`;
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
  console.log("auth@@@123-->", prop.state.stageName);
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
            Authorization Information
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseclaimInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-claimInformation"
        >
          <div className="accordion-body">
            <button
              type="button"
              className="btn btn-outline-primary"
              onClick={(event) => handleShowAuthSearch(event)}
              disabled={
                prop.state.stageName === "Redirect Review" ||
                prop.state.stageName === "Documents Needed" ||
                prop.state.stageName === "CaseArchived"
              }
            >
              Auth Search
            </button>

            <div className="row my-2">
              {(prop.state.stageName === "Effectuate" ||
                prop.state.stageName === "Pending Effectuate" ||
                prop.state.stageName === "Resolve" ||
                prop.state.stageName === "Case Completed" ||
                prop.state.stageName === "Reopen" ||
                prop.state.stageName === "Research" ||
                prop.state.stageName === "CaseArchived") && (
                <div className="col-xs-6 col-md-4">
                  <Field name="authdecision">
                    {({ field, meta }) => (
                      <div className="form-floating">
                        <Select
                          styles={{ ...selectStyle }}
                          components={{
                            ValueContainer: CustomValueContainer,
                          }}
                          value={
                            authorizationDecisionValues.find(
                              (option) =>
                                option.value ===
                                authorizationInformationData[
                                  "Authorization_Decision"
                                ],
                            ) || null
                          }
                          //value={authorizationInformationData['Authorization_Decision']}
                          // onChange={(selectValue, event) => {
                          //     setAuthorizationInformationData({ ...authorizationInformationData, 'Authorization_Decision': selectValue });
                          //     props.handleOnChange(selectValue, 'Authorization_Decision');
                          // }}
                          onChange={(selectValue, event) => {
                            const value = selectValue
                              ? selectValue.value
                              : null;
                            console.log("Selected value1111:", value);
                            // setAuthorizationInformationData({ ...authorizationInformationData, 'Authorization_Decision': value });
                            props.handleOnChange(
                              value,
                              "Authorization_Decision",
                            );
                          }}
                          options={authorizationDecisionValues}
                          name="authdecision"
                          id="authdecision"
                          isDisabled={
                            prop.state.formView === "DashboardView" &&
                            (prop.state.stageName === "Effectuate" ||
                              prop.state.stageName === "Pending Effectuate" ||
                              prop.state.stageName === "Resolve" ||
                              prop.state.stageName === "Case Completed" ||
                              prop.state.stageName === "CaseArchived")
                              ? true
                              : false
                          }
                          className="basic-multi-select"
                          isClearable
                          placeholder={wrapPlaceholder(
                            "authdecision",
                            "Authorization Decision",
                          )}
                        />
                        {meta.touched && meta.error && (
                          <div
                            className="invalid-feedback"
                            style={{ display: "block" }}
                          >
                            {meta.error}
                          </div>
                        )}
                      </div>
                    )}
                  </Field>
                  <ErrorMessage
                    component="div"
                    name="authdecision"
                    className="invalid-feedback"
                  />
                </div>
              )}

              {(prop.state.stageName === "Effectuate" ||
                prop.state.stageName === "Pending Effectuate" ||
                prop.state.stageName === "Resolve" ||
                prop.state.stageName === "Case Completed" ||
                prop.state.stageName === "Reopen" ||
                prop.state.stageName === "Research" ||
                prop.state.stageName === "CaseArchived") && (
                <div className="col-xs-6 col-md-4">
                  <Field name="authdecisionreason">
                    {({ field, meta }) => (
                      <div className="form-floating">
                        <Select
                          styles={{ ...selectStyle }}
                          components={{
                            ValueContainer: CustomValueContainer,
                          }}
                          value={
                            authorizationDecisionReasonValues.find(
                              (option) =>
                                option.value ===
                                authorizationInformationData[
                                  "Authorization_Decision_Reason"
                                ],
                            ) || null
                          }
                          //value={authorizationInformationData['Authorization_Decision_Reason']}
                          onChange={(selectValue) => {
                            const value = selectValue
                              ? selectValue.value
                              : null;
                            console.log("Selected value:", value);
                            // setAuthorizationInformationData({ ...authorizationInformationData, 'Authorization_Decision_Reason': value})
                            props.handleOnChange(
                              value,
                              "Authorization_Decision_Reason",
                            );
                          }}
                          options={authorizationDecisionReasonValues}
                          name="authdecisionreason"
                          id="authdecisionreason"
                          isDisabled={
                            prop.state.formView === "DashboardView" &&
                            (prop.state.stageName === "Effectuate" ||
                              prop.state.stageName === "Pending Effectuate" ||
                              prop.state.stageName === "Resolve" ||
                              prop.state.stageName === "Case Completed" ||
                              prop.state.stageName === "Reopen")
                              ? true
                              : false
                          }
                          className="basic-multi-select"
                          isClearable
                          placeholder={wrapPlaceholder(
                            "authdecisionreason",
                            "Authorization Decision Reason",
                          )}
                        />
                        {meta.touched && meta.error && (
                          <div
                            className="invalid-feedback"
                            style={{ display: "block" }}
                          >
                            {meta.error}
                          </div>
                        )}
                      </div>
                    )}
                  </Field>

                  <ErrorMessage
                    component="div"
                    name="authdecisionreason"
                    className="invalid-feedback"
                  />
                </div>
              )}
            </div>

            <div className="row">
              <div className="col-xs-6 col-md-12">
                <AuthorizationInformationTable
                  authorizationInformationGridData={
                    authorizationInformationGridData
                  }
                  addTableRows={addTableRows}
                  deleteTableRows={deleteTableRows}
                  handleGridSelectChange={handleGridSelectChange}
                  handleGridDateChange={handleGridDateChange}
                  handleGridFieldChange={handleGridFieldChange}
                  gridFieldTempState={gridFieldTempState}
                  editTableRows={editTableRows}
                  gridRowsFinalSubmit={gridRowsFinalSubmit}
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
                ></AuthorizationInformationTable>
              </div>
            </div>
            {showAuthSearch && (
              <AuthSearch
                handleCloseSearch={handleCloseSearch}
                selectedCriteria={selectedCriteria}
                setSelectedCriteria={setSelectedCriteria}
                selectSearchValues={selectSearchValues}
                setSelectSearchValues={setSelectSearchValues}
                showAuths={showAuths}
                authSearchTableComponent={authSearchTableComponent}
                responseData={responseData}
                setResponseData={setResponseData}
                handleClearAuthSearch={handleClearAuthSearch}
                showAuthSearch={showAuthSearch}
                handleSelectedAuth={handleSelectedAuth}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthorizationInformationAccordion;
