import React, {useState, useRef, useEffect} from 'react';
import {useAxios} from "../../../api/axios.hook";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {Field, ErrorMessage} from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ClaimInformationTable from "../TileFormsTables/ClaimInformationTable";
import ReactDatePicker from "react-datepicker";
import Select, {components} from "react-select";
import CaseHeader from './CaseHeader';
import ProviderInformationTable from '../TileFormsTables/ProviderInformationTable';
import TableComponent from "../../../../src/util/TableComponent";
import ClaimSearch from "../TileForms/ClaimSearch";
import ProviderSearch from "../TileForms/ProviderSearch";
import useUpdateDecision from '../../CustomHooks/useUpdateDecision';
import {selectStyle} from "./SelectStyle";
import caseClaimInformation from "./CaseClaimInformation";

const CaseClaimInformation = (props) => {
  const {
    convertToCase,
    checkGridJsonLength,
    trimJsonValues,
    extractDate,
    getDatePartOnly
  } = useGetDBTables();

  const {getRowNumberForGrid} = useUpdateDecision();

  const [selectedCriteria, setSelectedCriteria] = useState();

  const [selectSearchValues, setSelectSearchValues] = useState();

  const tabRef = useRef("HomeView");
  const location = useLocation();
  const fetchAutoPopulate = useRef(false);

  const {customAxios: axios} = useAxios();
  const token = useSelector((state) => state.auth.token);

  const [claimInformationGridData, setClaimInformationGridData] = useState(props.handleClaimInformationGridData);

  const [providerInformationGridData, setProviderInformationGridData] = useState(props.handleProviderInformationGridData);

  const [showClaimSearch, setShowClaimSearch] = useState(false);
  const [showProviderSearch, setShowProviderSearch] = useState(false);
  const [gridFieldTempState, setGridFieldTempState] = useState({});

  const [responseData, setResponseData] = useState([]);
  let [selectedAddress, setSelectedAddress] = useState([]);

  const mastersSelector = useSelector((masters) => masters);


  const handleShowClaimSearch = () => {
    setShowClaimSearch(true);
  }
  const handleShowProviderSearch = () => {
    setShowProviderSearch(true);
  }
  const handleCloseSearch = () => {
    setShowClaimSearch(false);
    setShowProviderSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  }
  const handleClearClaimSearch = () => {
    setSelectSearchValues([]);
    setSelectedCriteria([]);
    setResponseData([]);
  }
  const handleSelectedAddress = () => {
    let rowNumber = getRowNumberForGrid(claimInformationGridData)
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
      setClaimInformationGridData([...claimInformationGridData, ...addressToPopulate]);
      props.updateClaimInformationGridData([...claimInformationGridData, ...addressToPopulate])
    }

    setShowClaimSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  }
  const handleSelectedProviders = (flag) => {
    let rowNumber = getRowNumberForGrid(providerInformationGridData)
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
      setProviderInformationGridData([...providerInformationGridData, ...addressToPopulate])
      props.updateProviderInformationGridData([...providerInformationGridData, ...addressToPopulate])
    }

    setShowProviderSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
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

  const [claimTypeValues, setClaimTypeValues] = useState([]);
  const [decisionValues, setDecisionValues] = useState([]);
  const [decisionReasonValues, setDecisionReasonValues] = useState([]);
  const [serviceTypeValues, setServiceTypeValues] = useState([]);
  const [processingStatusValues, setProcessingStatusValues] = useState([]);

  useEffect(() => {
    const kvMapper = e => ({label: convertToCase(e), value: convertToCase(e)});
    const claimType = mastersSelector?.masterAngClaimType?.[0] || [];
    setClaimTypeValues([...new Set(claimType.map(e => convertToCase(e.Claim_Type)))].map(kvMapper));

    const angDecision = mastersSelector?.masterAngDecision?.[0] || [];
    console.log("prerna1234--->",angDecision);
    setDecisionValues([...new Set(angDecision.map(e => convertToCase(e.DECISION)))].map(kvMapper));
    setDecisionReasonValues([...new Set(angDecision.map(e => convertToCase(e.DECISION_REASON)))].map(kvMapper));

    const authServiceType = mastersSelector?.masterAngAuthServiceType?.[0] || [];
    setServiceTypeValues(authServiceType.map(e => e.SERVICE_TYPE_DESC).map(kvMapper));

    const procStatus = mastersSelector?.masterAngProcessingStatus?.[0] || [];
    setProcessingStatusValues([...new Set(procStatus.map(e => convertToCase(e.Processing_Status)))].map(kvMapper));
  }, []);
  const gridDataRef = useRef({});

  const addTableRows = (triggeredFormName) => {
    let rowsInput = {};

    if (triggeredFormName === "ClaimInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(claimInformationGridData);
    }
    if (triggeredFormName === "ProviderInformationTable") {
      rowsInput.rowNumber = getRowNumberForGrid(providerInformationGridData);
    }
    setGridFieldTempState(rowsInput);
  };

  const deleteTableRows = (index, triggeredFormName, operationValue) => {
    if (
        operationValue !== "Edit" &&
        (operationValue === "Add" || operationValue === "Force Delete")
    ) {
      gridRowsFinalSubmit(triggeredFormName, index, "Delete");
      if (triggeredFormName === "ClaimInformationTable") {
        const rows = [...claimInformationGridData];
        rows.splice(index, 1);
        setClaimInformationGridData(rows);
        props.updateClaimInformationGridData(rows);
      }
      if (triggeredFormName === "ProviderInformationTable") {
        const rows = [...providerInformationGridData];
        rows.splice(index, 1);
        setProviderInformationGridData(rows);
        props.updateProviderInformationGridData(rows);
      }
    }

    if (operationValue === "Edit") {
      setGridFieldTempState({});
    }
  };

  const showClaims = async () => {
    let ClaimNumber = selectSearchValues?.claimNumber;
    let SequentialMemberID = selectSearchValues?.sequentialMemberId;
    let ProviderID = selectSearchValues?.providerId;
    let ServiceStartDate = selectSearchValues?.Service_Start_Date || selectSearchValues?.Service_Start_Date2;
    let ServiceEndDate = selectSearchValues?.Service_End_Date || selectSearchValues?.Service_End_Date2;

    // Check if at least one search parameter has a value
    if (ClaimNumber || SequentialMemberID || ProviderID || ServiceStartDate || ServiceEndDate) {
      let getApiJson = {
        option: 'GETCLAIMSEARCHDATA',
        ClaimNumber: ClaimNumber || '',
        ServiceStartDate: extractDate(ServiceStartDate) || '',
        ServiceEndDate: extractDate(ServiceEndDate) || '',
        SequentialMemberID: SequentialMemberID || '',
        ProviderID: ProviderID || '',
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
            if (apiResponse.hasOwnProperty("Service_Start_Date") && typeof apiResponse.Service_Start_Date === "string") {
              const mad = new Date(getDatePartOnly(apiResponse.Service_Start_Date));
              apiResponse.Service_Start_Date = extractDate(mad);

            }
            if (apiResponse.hasOwnProperty("Service_End_Date") && typeof apiResponse.Service_End_Date === "string") {
              const rad = new Date(getDatePartOnly(apiResponse.Service_End_Date));
              apiResponse.Service_End_Date = extractDate(rad);

            }
            if (apiResponse.hasOwnProperty("DenialDate") && typeof apiResponse.DenialDate === "string") {
              const rad = new Date(getDatePartOnly(apiResponse.DenialDate));
              apiResponse.DenialDate = extractDate(rad);

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

  const claimSearchTableComponent = () => {
    let columnNames = 'Claim Number~Claim_Number,Claim Type~Claim_type,Authorization Number~Auth_Number,Service Start Date~Service_Start_Date,Service End Date~Service_End_Date,Service Span~ServiceSpan,Denial Date~DenialDate,Denial Code~DenialCode,Denial Description~DenialDescription,Member ID~MemberID,Member First Name~MemberFirstName,Member Last Name~MemberLastName,Provider ID~ProviderID,Provider Name~ProviderName';
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

  const showProviders = async () => {
    let ProviderID = selectSearchValues?.providerID;
    let NPI = selectSearchValues?.NPI;
    let Taxid = selectSearchValues?.TaxID;
    let ProviderFirstName = selectSearchValues?.providerFirstName || selectSearchValues?.providerFirstName2;
    let ProviderLastName = selectSearchValues?.providerLastName || selectSearchValues?.providerLastName2;
    let City = selectSearchValues?.city || selectSearchValues?.facilitycity;
    let State = selectSearchValues?.state || selectSearchValues?.state2 || selectSearchValues?.facilityState2;
    let facilityName = selectSearchValues?.facilityName;

    if (ProviderID || NPI || Taxid || ProviderFirstName || ProviderLastName ||
        City || State || facilityName
    ) {
      let getApiJson = {
        option: 'PROVIDERSEARCHDATA',
        ProviderID: ProviderID || '',
        NPI: NPI || '',
        Taxid: Taxid || '',
        ProviderFirstName: ProviderFirstName || '',
        ProviderLastName: ProviderLastName || '',
        City: City || '',
        State: State || '',
        facilityName: facilityName || '',
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
            if (apiResponse.hasOwnProperty("Provider_Par_Date") && typeof apiResponse.Provider_Par_Date === "string") {
              const mad = new Date(getDatePartOnly(apiResponse.Provider_Par_Date));
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
    let columnNames = 'Issue Number~Issue_Number,Provider ID~Provider_ID,Provider First Name~Provider_Name,Provider Last Name~Provider_Last_Name,TIN~Provider_TIN,Provider/Vendor Specialty~Provider_Vendor_Specialty,Provider Taxonomy~Provider_Taxonomy,NPI~NPI_ID,Phone~Phone_Number,Address Line 1~Address_Line_1,Address Line 2~Address_Line_2,Zip Code~Zip_Code,City~City,State~State,Participating Provider~Participating_Provider,Provider Par Date~Provider_Par_Date,Provider IPA~Provider_IPA,Vendor ID~Vendor_ID,Vendor Name~Vendor_Name,Provider Type~Provider_Type,Contact Name~Provider_Contact_Name,Contact Phone Number~Contact_Phone_Number,Contact Email Address~Contact_Email_Address';

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

  const handleGridSelectChange = (
      index,
      selectedValue,
      event
  ) => {
    let rowsInput = {...gridFieldTempState};

    const {name} = event;
    let val = selectedValue;
    if (event.action === "clear") {
      if (name.toLowerCase() === "languages") {
        val = [];
      } else {
        val = {label: "", value: ""};
      }
    } else {

      if (selectedValue && selectedValue.label && selectedValue.value) {
        val = {
          label: selectedValue.label.toUpperCase(),
          value: selectedValue.value.toUpperCase(),
        };
      }
    }

    rowsInput[name] = val;
    setGridFieldTempState(rowsInput);
  };

  const handleGridDateChange = (
      index,
      selectedValue,
      fieldName
  ) => {
    let tempInput = {...gridFieldTempState};
    tempInput[fieldName] = selectedValue;
    setGridFieldTempState(tempInput);
  };

  const handleGridFieldChange = (index, event) => {
    let tempInput = {...gridFieldTempState};
    let {name, value} = event.target;
    tempInput[name] = value.toUpperCase();
    setGridFieldTempState(tempInput);
  };

  const editTableRows = (index, triggeredFormName) => {
    let rowInput = {};

    if (triggeredFormName === "ClaimInformationTable") {
      rowInput = claimInformationGridData[index];
      setGridFieldTempState(rowInput);
    }
    if (triggeredFormName === "ProviderInformationTable") {
      rowInput = providerInformationGridData[index];
      setGridFieldTempState(rowInput);
    }
  };

  const gridRowsFinalSubmit = (triggeredFormName, index, operationType) => {
    let clonedJson = {...gridFieldTempState};
    if (Object.keys(gridFieldTempState).length !== 0) {
      if (triggeredFormName === "ClaimInformationTable") {
        let indexJson = claimInformationGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          claimInformationGridData[index] = clonedJson;
          setClaimInformationGridData([...claimInformationGridData]);
        }
      }
      if (triggeredFormName === "ProviderInformationTable") {
        let indexJson = providerInformationGridData[index];

        if (indexJson !== undefined && indexJson !== null) {
          clonedJson = Object.assign(indexJson, gridFieldTempState);
        }

        if (!checkGridJsonLength(clonedJson)) {
          providerInformationGridData[index] = clonedJson;
          setProviderInformationGridData([...providerInformationGridData]);
          props.updateProviderInformationGridData([...providerInformationGridData]);
        }
      }

      //Handling for data update/Delete/Insert inside grids.
      if (tabRef.current === "DashboardView") {
        let oprtn;
        let gridRowJson = {};
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

        if (triggeredFormName === "ClaimInformationTable") {
          gridRowArray = gridDataRef.current.hasOwnProperty("claimInformationTable")
              ? [...gridDataRef.current.claimInformationTable]
              : [];
          gridRowJson = {...claimInformationGridData[index]};

          if (Object.keys(gridRowJson).length !== 0) {
            gridRowJson["operation"] = oprtn;

            gridRowArray.push(trimJsonValues(gridRowJson));

            gridDataRef.current.claimInformationTable = getGridDataValues(gridRowArray);
          }
        }
        if (triggeredFormName === "ProviderInformationTable") {
          gridRowArray = gridDataRef.current.hasOwnProperty("providerInformationTable")
              ? [...gridDataRef.current.providerInformationTable]
              : [];
          gridRowJson = {...providerInformationGridData[index]};

          if (Object.keys(gridRowJson).length !== 0) {
            gridRowJson["operation"] = oprtn;

            gridRowArray.push(trimJsonValues(gridRowJson));

            gridDataRef.current.providerInformationTable = getGridDataValues(gridRowArray);
          }
        }
      }
    }
  }

  const getGridDataValues = (tableData) => {
    let returnArray = [];
    tableData.map((data) => {
      const dataObject = {};
      const dataKeys = Object.keys(data);
      dataKeys.forEach((dataValue) => {
        const dataKeyType = typeof data[dataValue];
        if (dataKeyType === "object") {
          if (!!data[dataValue]) {
            if (!!data[dataValue].value) {
              if (data[dataValue].value instanceof Date) {
                dataObject[dataValue] = extractDate(data[dataValue].value);
              } else {
                dataObject[dataValue] = data[dataValue].value;
              }
            } else if (data[dataValue].value === "") {
              dataObject[dataValue] = "";
            } else {
              if (data[dataValue] instanceof Date) {
                //dataObject[dataValue] = data[dataValue].toLocaleDateString();
                dataObject[dataValue] = extractDate(data[dataValue]);
              } else {
                dataObject[dataValue] = data[dataValue];
              }
            }
          } else {
            dataObject[dataValue] = "";
          }
        }
        if (dataKeyType !== "object") {
          dataObject[dataValue] = data[dataValue];
        }
      });
      returnArray.push(trimJsonValues(dataObject));
    });
    return returnArray;
  };

  const wrapPlaceholder = (name, placeholder) => {
    const field = props.claimInformationValidationSchema?.fields?.[name];
    const required = (field?.type === 'date' && field?.internalTests?.optionality) ||
        (field?.tests?.some(test => test.OPTIONS?.name === 'required'));
    return `${placeholder}${required ? ' *' : ''}`;
  };
  const [claimInformationData, setClaimInformationData] = useState(props.claimInformationData || {});
  const handleClaimInformationData = (name, value, persist) => {
    const newData = {...claimInformationData, [name]: typeof value === 'string' ? convertToCase(value) : value};
    setClaimInformationData(newData);
    if (persist) {
      props.setClaimInformationData(newData);
    }
  };
  const persistClaimInformationData = () => {
    props.setClaimInformationData(claimInformationData);
  }
  const [invalidInputState, setInvalidInputState] = useState(false);

  useEffect(() => {
    setInvalidInputState(location.state.formView === "DashboardView" &&
        (location.state.stageName === "Intake" ||
            location.state.stageName === "Acknowledge" ||
            location.state.stageName === "Redirect Review" ||
            location.state.stageName === "Documents Needed" ||
            location.state.stageName === "Research" ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            location.state.stageName === "Reopen" ||
            location.state.stageName === "CaseArchived"))
  }, [location]);

  const {ValueContainer, Placeholder} = components;
  const CustomValueContainer = ({children, ...props}) => {
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
  const InputField = (name, placeholder, maxLength) => {
    return (
        <>
          <Field name={name}>
            {({
                field,
                meta,
              }) => (
                <div className="form-floating">
                  <input
                      maxLength={maxLength}
                      type="text"
                      id={name}
                      autoComplete="off"
                      className={`form-control ${meta.error
                          ? "is-invalid"
                          : field.value
                              ? "is-valid"
                              : ""
                      }`}
                      placeholder={wrapPlaceholder(name, placeholder)}
                      onChange={(event) => handleClaimInformationData(name, event.target.value)}
                      onBlur={persistClaimInformationData}
                      value={claimInformationData[name]}
                      disabled={invalidInputState}
                  />
                  <label htmlFor="floatingInputGrid">
                    {wrapPlaceholder(name, placeholder)}
                  </label>
                  {meta.error && (
                      <div
                          className="invalid-feedback"
                          style={{display: "block"}}
                      >
                        {meta.error}
                      </div>
                  )}
                </div>
            )}
          </Field>
        </>
    )
  }
  const DatePicker = (name, label, placeholder) => {
    const CustomInput = (props) => {
      return (
          <div className="form-floating">
            <input {...props} autoComplete="off" placeholder={wrapPlaceholder(name, placeholder)}/>
            <label htmlFor={name}>{wrapPlaceholder(name, label)}</label>
          </div>
      )
    };
    const dateValue = !!claimInformationData[name + "#date"] ? new Date(claimInformationData[name + "#date"]): claimInformationData[name];
    return (
        <div>
          <ReactDatePicker
              id={name}
              className="form-control example-custom-input-provider"
              selected={dateValue}
              name={name}
              dateFormat="MM/dd/yyyy"
              onChange={(date) => handleClaimInformationData(name, date, true)}
              peekNextMonth
              showMonthDropdown
              showYearDropdown
              isClearable
              onKeyDown={(e) => e.preventDefault()}
              dropdownMode="select"
              style={{
                position: "relative",
                zIndex: "999",
              }}
              customInput={<CustomInput/>}
              disabled={
                  location.state.formView === "DashboardView" &&
                  (location.state.stageName === "Redirect Review" ||
                      location.state.stageName === "Effectuate" ||
                      location.state.stageName === "Pending Effectuate" ||
                      location.state.stageName === "Resolve" ||
                      location.state.stageName === "Case Completed" ||
                      location.state.stageName === "Reopen" ||
                      location.state.stageName === "CaseArchived")
              }
          />
        </div>
    )
  };
  const SelectField = (name, placeholder, options) => <>
    <Field name={name}>
      {({
          meta,
        }) => (
          <div className="form-floating">
            <Select
                styles={{...selectStyle}}
                components={{
                  ValueContainer: CustomValueContainer,
                }}
                isClearable
                isDisabled={
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
                className="basic-multi-select"
                options={options}
                id={name}
                isMulti={false}
                onChange={(value) => handleClaimInformationData(name, value?.value, true)}
                value={claimInformationData[name] ? {
                  label: claimInformationData[name],
                  value: claimInformationData[name]
                } : undefined}
                placeholder={wrapPlaceholder(name, placeholder)}
                isSearchable={
                    document.documentElement.clientHeight <= document.documentElement.clientWidth
                }
            />
            {meta.touched && meta.error && (
                <div
                    className="invalid-feedback"
                    style={{display: "block"}}
                >
                  {meta.error}
                </div>
            )}
          </div>
      )}
    </Field>
    <ErrorMessage
        component="div"
        name={name}
        className="invalid-feedback"
    />
  </>

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
              Claim Information
            </button>
          </h2>
          <div
              id="panelsStayOpen-collapseclaimInformation"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-claimInformation"
          >
            <div className="accordion-body">

              <button type="button"
                      className="btn btn-outline-primary"
                      onClick={event => handleShowClaimSearch(event)}
              >Claim Search
              </button>
              <div className="row my-2">
                <div className="col-xs-6 col-md-4">
                  {SelectField('Claim_type', 'Claim type', claimTypeValues)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {InputField("Claim_Number", "Claim Number", 16)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {DatePicker("Claim_Adjusted_Date", "Claim Adjusted Date", "Claim Adjusted Date")}
                </div>
              </div>
              <div className="row my-2">
                <div className="col-xs-6 col-md-4">
                  {SelectField('Claim_Decision', 'Claim Decision', decisionValues)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {SelectField('Decision_Reason', 'Decision Reason', decisionReasonValues)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {InputField("Reason_Text", "Reason Text", 4000)}
                </div>
              </div>
              <div className="row my-2">
                <div className="col-xs-6 col-md-4">
                  {SelectField('Service_Type', 'Service Type', serviceTypeValues)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {DatePicker("Service_Start_Date", "Service Start Date", "Service Start Date")}
                </div>
                <div className="col-xs-6 col-md-4">
                  {DatePicker("Service_End_Date", "Service End Date", "Service End Date")}
                </div>
              </div>
              <div className='row my-2'>
                <div className="col-xs-6 col-md-4">
                  {InputField("Authorization_Number", "Authorization Number", 9)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {SelectField('Processing_Status', 'Processing Status', processingStatusValues)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {DatePicker("Original_Denial_Date", "Original Denial Date", "Original Denial Date")}
                </div>
              </div>
              <div className='row my-2'>
                <div className="col-xs-6 col-md-4">
                  {InputField("Payment_Method", "Payment Method", 30)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {InputField("Payment_Number", "Payment Number", 50)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {DatePicker("Payment_Date", "Payment Date", "Payment Date")}
                </div>
              </div>
              <div className="row my-2">
                <div className="col-xs-6 col-md-4">
                  {DatePicker("Payment_Mail_Date_Postmark", "Payment Mail Date Postmark", "Payment Mail Date Postmark")}
                </div>
                <div className="col-xs-6 col-md-4">
                  {InputField("Effectuation_Notes", "Effectuation Notes", 4000)}
                </div>
              </div>
              <div className="row">
                <div className="col-xs-6 col-md-12">
                  <ClaimInformationTable
                      claimInformationGridData={claimInformationGridData}
                      updateGridData={setClaimInformationGridData}
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
                        location.state.lockStatus !== undefined &&
                        location.state.lockStatus !== ""
                            ? location.state.lockStatus
                            : "N"
                      }
                      fetchAutoPopulate={fetchAutoPopulate}
                      transactionType={CaseHeader.displayName}
                  ></ClaimInformationTable>
                </div>
              </div>
              {showClaimSearch && (
                  <ClaimSearch
                      handleCloseSearch={handleCloseSearch}
                      selectedCriteria={selectedCriteria}
                      setSelectedCriteria={setSelectedCriteria}
                      selectSearchValues={selectSearchValues}
                      setSelectSearchValues={setSelectSearchValues}
                      showClaims={showClaims}
                      claimSearchTableComponent={claimSearchTableComponent}
                      responseData={responseData}
                      setResponseData={setResponseData}
                      handleClearClaimSearch={handleClearClaimSearch}
                      showClaimSearch={showClaimSearch}
                      handleSelectedAddress={handleSelectedAddress}
                  />
              )}
            </div>
          </div>
        </div>
        <div className="accordion-item" id="providerInformation">
          <h2
              className="accordion-header"
              id="panelsStayOpen-providerInformation"
          >
            <button
                className="accordion-button accordionButtonStyle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseproviderInformation"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
            >
              Provider Information
            </button>
          </h2>
          <div
              id="panelsStayOpen-collapseproviderInformation"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-providerInformation"
          >
            <div className="accordion-body">
              <button type="button"
                      className="btn btn-outline-primary"
                      onClick={event => handleShowProviderSearch(event)}
              >Provider Search
              </button>
              <div className="row my-2">
                <div className="col-xs-6 col-md-12">
                  <ProviderInformationTable
                      providerInformationGridData={providerInformationGridData}
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
                        location.state.lockStatus !== undefined &&
                        location.state.lockStatus !== ""
                            ? location.state.lockStatus
                            : "N"
                      }
                      fetchAutoPopulate={fetchAutoPopulate}
                      transactionType={CaseHeader.displayName}
                  ></ProviderInformationTable>
                </div>
              </div>
              <div>
                {showProviderSearch && (
                    <ProviderSearch
                        handleCloseSearch={handleCloseSearch}
                        selectedCriteria={selectedCriteria}
                        setSelectedCriteria={setSelectedCriteria}
                        selectSearchValues={selectSearchValues}
                        setSelectSearchValues={setSelectSearchValues}
                        handleClearClaimSearch={handleClearClaimSearch}
                        showProviderSearch={showProviderSearch}
                        showProviders={showProviders}
                        providerSearchTableComponent={providerSearchTableComponent}
                        responseData={responseData}
                        setResponseData={setResponseData}
                        handleSelectedProviders={handleSelectedProviders}

                    />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CaseClaimInformation;