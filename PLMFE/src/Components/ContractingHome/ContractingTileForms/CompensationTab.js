import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";
import "./Forms.css";
import FIRLTable from "../../SelfServiceTiles/TileFormsTables/FIRLTable";
import CompensationTable from "../../SelfServiceTiles/TileFormsTables/CompensationTable";
import { useLocation, useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import useUpdateDecision from "../../../Components/CustomHooks/useUpdateDecision";

import customAxios from "../../../api/axios";
export default function CompensationTab({
  apiTestStateComp,
  firlTableRowsData,
  compensationTableRowsData,
  deleteTableRows,
  handleGridSelectChange,
  addTableRows,
  handleGridFieldChange,
  gridRowsFinalSubmit,
  handleLinearSelectChange,
  handleLinearFieldChange,
  handleMedicalGrpNoShow,
  lockStatus,
  handleDateChange,
  handleNetworkIdShow,
  handlePcpIdShow,
  transactionType,
  type,
  gridFieldTempState,
  editTableRows,
}) {
  // const[apiTestStateComp,setapiTestStateComp] = useState({});
  //    const [firlTableRowsData, setFirlTableRowsData] = useState([]);
  //    const [compensationTableRowsData, setCompensationTableRowsData] = useState([]);
  const mastersSelector = useSelector((masters) => masters);
  console.log("lockStatussssssss: ", lockStatus);
  console.log("Masters Selector: ", mastersSelector);

  const tabRef = useRef("HomeView");
  const gridDataRef = useRef({});
  const { getTableDetails, convertToCase } = useGetDBTables();
  let prop = useLocation();
  const authData = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);

  const { changeColorOfSelect } = useUpdateDecision();

  const RenderDatePicker02 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Contract Effective Date" />
      <label htmlFor="datePicker">Contract Effective Date</label>
    </div>
  );
  const RenderDatePicker03 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="MOC Attestation Date<" />
      <label htmlFor="datePicker">MOC Attestation Date</label>
    </div>
  );
  const RenderDatePicker04 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="MOC Renewal Attestation Date" />
      <label htmlFor="datePicker">MOC Renewal Attestation Date</label>
    </div>
  );

  const { ValueContainer, Placeholder } = components;
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

  let riskAssignmentSelect = [];
  let stateSelect = [];
  let feeScheduleSelect = [];
  let criticalAccessHospitalSelect = [];
  let seqAppliesSelect = [];
  let contractTypeSelect = [];
  let scheduleSelect = [];

  if (mastersSelector.hasOwnProperty("masterCompositionMaster")) {
    const compMaster = mastersSelector["masterCompositionMaster"][0];
    riskAssignmentSelect = compMaster?.hasOwnProperty("riskAssignment")
      ? compMaster["riskAssignment"]
      : [];
    stateSelect = compMaster?.hasOwnProperty("states")
      ? compMaster["states"]
      : [];
    feeScheduleSelect = compMaster?.hasOwnProperty("feeSchedule")
      ? compMaster["feeSchedule"]
      : [];
    criticalAccessHospitalSelect = compMaster?.hasOwnProperty(
      "criticalAccessHospital",
    )
      ? compMaster["criticalAccessHospital"]
      : [];
    seqAppliesSelect = compMaster?.hasOwnProperty("seqApplies")
      ? compMaster["seqApplies"]
      : [];
    contractTypeSelect = compMaster?.hasOwnProperty("contractType")
      ? compMaster["contractType"]
      : [];
    scheduleSelect = compMaster?.hasOwnProperty("schedule")
      ? compMaster["schedule"]
      : [];
  } else {
    const compMaster = "";
  }

  //console.log("transactionType: ", transactionType);
  //    const demoSelectValue = mastersSelector['masterCompositionMaster'][0]['contract'];
  return (
    <>
      <div className="CompensationTab">
        <div
          className="container"
          style={{
            overflow: "auto",
            height: "auto",
            minHeight: "100%",
            paddingBottom: 60,
          }}
        >
          <div className="row">
            <div className="col-xs-12">
              <div
                className="accordion CompensationTabLabel"
                id="accordionPanelsStayOpenExample"
              >
                {/* {(transactionType !== undefined &&
                        (transactionType == 'Provider Contracting' || transactionType == 'Facility/Ancillary/Health Systems Contracting' || transactionType == 'Add a Provider')) ? (
                    <> */}
                <div className="accordion-item disableElements">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingRisk"
                  >
                    <button
                      className="accordion-button accordionButtonStyle"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseRisk"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseRisk"
                    >
                      Risk Identifier
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseRisk"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayRisk-headingRisk"
                  >
                    <div className="accordion-body AddProviderLabel">
                      <div className="row my-2">
                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <Select
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  height: "58px",
                                  fontWeight: "lighter",
                                  backgroundColor: changeColorOfSelect(
                                    prop,
                                    "PDM",
                                  )
                                    ? "#F0F0F0"
                                    : "",
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  maxHeight: 200,
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),

                                container: (provided, state) => ({
                                  ...provided,
                                  marginTop: 0,
                                }),
                                valueContainer: (provided, state) => ({
                                  ...provided,
                                  overflow: "visible",
                                }),
                                placeholder: (provided, state) => ({
                                  ...provided,
                                  position: "absolute",
                                  top:
                                    state.hasValue ||
                                    state.selectProps.inputValue
                                      ? -15
                                      : "50%",
                                  transition: "top 0.1s, font-size 0.1s",
                                  fontSize:
                                    (state.hasValue ||
                                      state.selectProps.inputValue) &&
                                    13,
                                }),
                              }}
                              components={{
                                ValueContainer: CustomValueContainer,
                              }}
                              name="riskState"
                              /*isDisabled={
                                                        tabRef.current === "DashboardView" &&
                                                        prop.state.lockStatus !== undefined &&
                                                        prop.state.lockStatus === "Y"
                                                          ? true
                                                          : false
                                                      }*/

                              /*isDisabled={
                                                        tabRef.current === "DashboardView" &&
                                                        (prop.state.StageName === 'Exit' ||
                                                        prop.state.StageName === "Discard")
                                                          ? true
                                                          : false
                                                      }*/
                              // isDisabled={lockStatus == 'V'}

                              className="basic-multi-select"
                              options={stateSelect}
                              id="riskStateDropdown"
                              isMulti={false}
                              isClearable
                              onChange={(selectValue, event) =>
                                handleLinearSelectChange(selectValue, event)
                              }
                              value={apiTestStateComp.riskState}
                              placeholder="State"
                              //styles={{...customStyles}}
                              isSearchable={
                                document.documentElement.clientHeight >
                                document.documentElement.clientWidth
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <Select
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  height: "58px",
                                  fontWeight: "lighter",
                                  backgroundColor: changeColorOfSelect(
                                    prop,
                                    "PDM",
                                  )
                                    ? "#F0F0F0"
                                    : "",
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  maxHeight: 200,
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),

                                container: (provided, state) => ({
                                  ...provided,
                                  marginTop: 0,
                                }),
                                valueContainer: (provided, state) => ({
                                  ...provided,
                                  overflow: "visible",
                                }),
                                placeholder: (provided, state) => ({
                                  ...provided,
                                  position: "absolute",
                                  top:
                                    state.hasValue ||
                                    state.selectProps.inputValue
                                      ? -15
                                      : "50%",
                                  transition: "top 0.1s, font-size 0.1s",
                                  fontSize:
                                    (state.hasValue ||
                                      state.selectProps.inputValue) &&
                                    13,
                                }),
                              }}
                              components={{
                                ValueContainer: CustomValueContainer,
                              }}
                              name="riskAssignment"
                              // isDisabled={lockStatus == 'V'}
                              className="basic-multi-select"
                              options={riskAssignmentSelect}
                              id="riskAssignmentDropdown"
                              isMulti={false}
                              isClearable
                              onChange={(selectValue, event) =>
                                handleLinearSelectChange(selectValue, event)
                              }
                              value={apiTestStateComp.riskAssignment}
                              placeholder="Risk Assignment"
                              //styles={{...customStyles}}
                              isSearchable={
                                document.documentElement.clientHeight >
                                document.documentElement.clientWidth
                                  ? false
                                  : true
                              }
                              required={true}
                            />
                          </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="9"
                              type="text"
                              className="form-control"
                              name="taxId"
                              placeholder="John"
                              value={convertToCase(apiTestStateComp.taxId)}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              onBlur={(event) => handleMedicalGrpNoShow(event)}
                              // disabled={lockStatus == 'V'}
                            />
                            <label htmlFor="floatingInputGrid">Tax ID</label>
                          </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="10"
                              type="text"
                              className="form-control"
                              name="groupRiskId"
                              placeholder="John"
                              value={convertToCase(
                                apiTestStateComp.groupRiskId,
                              )}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              disabled
                              required
                            />
                            <label htmlFor="floatingInputGrid">
                              Group Risk ID
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item disableElements">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingProvider"
                  >
                    <button
                      className="accordion-button accordionButtonStyle"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseProviderN"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseProviderN"
                    >
                      Provider Identifier
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseProviderN"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-headingProviderN"
                  >
                    <div className="accordion-body AddProviderLabel">
                      <div className="row my-2">
                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="10"
                              type="text"
                              className="form-control"
                              name="medicalLicense"
                              placeholder="John"
                              value={convertToCase(
                                apiTestStateComp.medicalLicense,
                              )}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              onBlur={(event) => handlePcpIdShow(event)}
                              /* disabled={lockStatus == 'V'}*/
                            />
                            <label htmlFor="floatingInputGrid">
                              Medical License
                            </label>
                          </div>
                        </div>
                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="12"
                              type="text"
                              className="form-control"
                              name="pcpId"
                              placeholder="John"
                              value={convertToCase(apiTestStateComp.pcpId)}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              disabled
                              required
                            />
                            <label htmlFor="floatingInputGrid">PCP ID</label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="accordion-item disableElements">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingNetwork"
                  >
                    <button
                      className="accordion-button accordionButtonStyle"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseNetwork"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseNetwork"
                    >
                      Network Affiliation
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseNetwork"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-headingNetwork"
                  >
                    <div className="accordion-body AddProviderLabel">
                      <div className="row my-2">
                        <div className="col-xs-6 col-md-3 ">
                          <div className="form-floating">
                            <Select
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  height: "58px",
                                  fontWeight: "lighter",
                                  backgroundColor: changeColorOfSelect(
                                    prop,
                                    "PDM",
                                  )
                                    ? "#F0F0F0"
                                    : "",
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  maxHeight: 200,
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),
                                container: (provided, state) => ({
                                  ...provided,
                                  marginTop: 0,
                                }),
                                valueContainer: (provided, state) => ({
                                  ...provided,
                                  overflow: "visible",
                                }),
                                placeholder: (provided, state) => ({
                                  ...provided,
                                  position: "absolute",
                                  top:
                                    state.hasValue ||
                                    state.selectProps.inputValue
                                      ? -15
                                      : "50%",
                                  transition: "top 0.1s, font-size 0.1s",
                                  fontSize:
                                    (state.hasValue ||
                                      state.selectProps.inputValue) &&
                                    13,
                                }),
                              }}
                              components={{
                                ValueContainer: CustomValueContainer,
                              }}
                              name="networkState"
                              // isDisabled={lockStatus == 'V'}
                              className="basic-multi-select"
                              options={stateSelect}
                              id="networkStateDropdown"
                              isMulti={false}
                              isClearable
                              onChange={(selectValue, event) =>
                                handleLinearSelectChange(selectValue, event)
                              }
                              // onBlur={(selectValue,event)=>(handlePcpIdShowOnBlur(selectValue, event))}
                              value={apiTestStateComp.networkState}
                              placeholder="State"
                              //styles={{...customStyles}}
                              isSearchable={
                                document.documentElement.clientHeight >
                                document.documentElement.clientWidth
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </div>

                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="20"
                              type="text"
                              className="form-control"
                              name="planValue"
                              placeholder="John"
                              value={convertToCase(apiTestStateComp.planValue)}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              onBlur={(event) => handleNetworkIdShow(event)}
                              // disabled={lockStatus == 'V'}
                            />
                            <label htmlFor="floatingInputGrid">
                              Plan Value
                            </label>
                          </div>
                        </div>

                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="22"
                              type="text"
                              className="form-control"
                              name="networkId"
                              placeholder="John"
                              value={convertToCase(apiTestStateComp.networkId)}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              disabled
                              required
                            />
                            <label htmlFor="floatingInputGrid">
                              Network ID
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row my-2">
                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <Select
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  height: "58px",
                                  fontWeight: "lighter",
                                  backgroundColor: changeColorOfSelect(
                                    prop,
                                    "PDM",
                                  )
                                    ? "#F0F0F0"
                                    : "",
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  maxHeight: 200,
                                }),
                                menu: (provided) => ({
                                  ...provided,
                                  zIndex: 9999,
                                }),

                                container: (provided, state) => ({
                                  ...provided,
                                  marginTop: 0,
                                }),
                                valueContainer: (provided, state) => ({
                                  ...provided,
                                  overflow: "visible",
                                }),
                                placeholder: (provided, state) => ({
                                  ...provided,
                                  position: "absolute",
                                  top:
                                    state.hasValue ||
                                    state.selectProps.inputValue
                                      ? -15
                                      : "50%",
                                  transition: "top 0.1s, font-size 0.1s",
                                  fontSize:
                                    (state.hasValue ||
                                      state.selectProps.inputValue) &&
                                    13,
                                }),
                              }}
                              components={{
                                ValueContainer: CustomValueContainer,
                              }}
                              name="feeSchedule"
                              // isDisabled={lockStatus == 'V'}
                              className="basic-multi-select"
                              options={feeScheduleSelect}
                              id="feeScheduleDropdown"
                              isMulti={false}
                              isClearable
                              onChange={(selectValue, event) =>
                                handleLinearSelectChange(selectValue, event)
                              }
                              // onBlur={(selectValue,event)=>(handlePcpIdShowOnBlur(selectValue, event))}
                              value={apiTestStateComp.feeSchedule}
                              placeholder="Fee Schedule"
                              //styles={{...customStyles}}
                              isSearchable={
                                document.documentElement.clientHeight >
                                document.documentElement.clientWidth
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* </>):(<></>)} */}

                {/* {(transactionType !== undefined &&
                        (transactionType == 'Provider Contracting' || transactionType == 'Facility/Ancillary/Health Systems Contracting')) ? (
                    <> */}
                <div className="accordion-item disableElements">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingType"
                  >
                    <button
                      className="accordion-button accordionButtonStyle"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseType"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseType"
                    >
                      Type Of Contract
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseType"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-headingType"
                  >
                    <div className="accordion-body AddProviderLabel">
                      <div className="row my-2">
                        <div className="col-xs-6 col-md-3">
                          <div>
                            <ReactDatePicker
                              id="datePicker"
                              className="form-control example-custom-input-provider"
                              selected={apiTestStateComp.conEffectiveDate}
                              name="conEffectiveDate"
                              onChange={(event) =>
                                handleDateChange(event, "conEffectiveDate")
                              }
                              dateFormat="MM/dd/yyyy"
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              //  disabled={lockStatus == 'V'}
                              //   readOnly={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                              peekNextMonth
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              customInput={<RenderDatePicker02 />}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="row my-2">
                        <div className="col-xs-6 col-md-12">
                          <table
                            className="table table-bordered tableLayout"
                            id="QuestionTable"
                          >
                            <thead>
                              <tr className="tableRowStyle tableHeaderColor">
                                <th style={{ width: "10%" }} scope="col">
                                  S. No.
                                </th>
                                <th style={{ width: "70%" }} scope="col">
                                  CheckList
                                </th>
                                <th style={{ textAlign: "center" }} scope="col">
                                  Please select
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr>
                                <td>1</td>
                                <td>
                                  FFS No Quality(I) : Category 1 (B-Payments)
                                </td>
                                <td>
                                  <Select
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                        backgroundColor: changeColorOfSelect(
                                          prop,
                                          "PDM",
                                        )
                                          ? "#F0F0F0"
                                          : "",
                                      }),
                                    }}
                                    name="qualityFlagI"
                                    // isDisabled={lockStatus == 'V'}
                                    options={[
                                      { label: "YES", value: "Y" },
                                      { label: "NO", value: "N" },
                                    ]}
                                    id="qualityFlagIDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestStateComp.qualityFlagI}
                                    isClearable
                                  />
                                </td>
                              </tr>

                              <tr>
                                <td>2</td>
                                <td>
                                  FFS with Quality(J) : Category 2 (C-Payments)
                                </td>
                                <td>
                                  <Select
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                        backgroundColor: changeColorOfSelect(
                                          prop,
                                          "PDM",
                                        )
                                          ? "#F0F0F0"
                                          : "",
                                      }),
                                    }}
                                    name="qualityFlagJ"
                                    // isDisabled={lockStatus == 'V'}
                                    isClearable
                                    options={[
                                      { label: "YES", value: "Y" },
                                      { label: "NO", value: "N" },
                                    ]}
                                    id="qualityFlagJDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestStateComp.qualityFlagJ}
                                  />
                                </td>
                              </tr>

                              <tr>
                                <td>3</td>
                                <td>
                                  APM-FFS-Shared Risk(K) : Category 3
                                  (D-Payments)
                                </td>
                                <td>
                                  <Select
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                        backgroundColor: changeColorOfSelect(
                                          prop,
                                          "PDM",
                                        )
                                          ? "#F0F0F0"
                                          : "",
                                      }),
                                    }}
                                    name="qualityFlagK"
                                    //  isDisabled={lockStatus == 'V'}
                                    isClearable
                                    options={[
                                      { label: "YES", value: "Y" },
                                      { label: "NO", value: "N" },
                                    ]}
                                    id="qualityFlagKDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestStateComp.qualityFlagK}
                                  />
                                </td>
                              </tr>
                              <tr>
                                <td>4</td>
                                <td>
                                  FFS Based on Population(M) : Category 5
                                  (F-Payments)
                                </td>
                                <td>
                                  <Select
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                        backgroundColor: changeColorOfSelect(
                                          prop,
                                          "PDM",
                                        )
                                          ? "#F0F0F0"
                                          : "",
                                      }),
                                    }}
                                    name="qualityFlagM"
                                    //  isDisabled={lockStatus == 'V'}
                                    isClearable
                                    options={[
                                      { label: "YES", value: "Y" },
                                      { label: "NO", value: "N" },
                                    ]}
                                    id="qualityFlagMDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestStateComp.qualityFlagM}
                                  />
                                </td>
                              </tr>

                              <tr>
                                <td>5</td>
                                <td>
                                  Risk Based Payments NOT Linked to Quality(L) :
                                  APM 3N (E-Payments)
                                </td>
                                <td>
                                  <Select
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                        backgroundColor: changeColorOfSelect(
                                          prop,
                                          "PDM",
                                        )
                                          ? "#F0F0F0"
                                          : "",
                                      }),
                                    }}
                                    name="qualityFlagL"
                                    //  isDisabled={lockStatus == 'V'}
                                    isClearable
                                    options={[
                                      { label: "YES", value: "Y" },
                                      { label: "NO", value: "N" },
                                    ]}
                                    id="qualityFlagLDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestStateComp.qualityFlagL}
                                  />
                                </td>
                              </tr>

                              <tr>
                                <td>6</td>
                                <td>
                                  Capitated Payments NOT Linked to Quality(N) :
                                  APM 3N (G-Payments)
                                </td>
                                <td>
                                  <Select
                                    styles={{
                                      control: (provided) => ({
                                        ...provided,
                                        fontWeight: "lighter",
                                        backgroundColor: changeColorOfSelect(
                                          prop,
                                          "PDM",
                                        )
                                          ? "#F0F0F0"
                                          : "",
                                      }),
                                    }}
                                    name="qualityFlagN"
                                    //    isDisabled={lockStatus == 'V'}
                                    isClearable
                                    options={[
                                      { label: "YES", value: "Y" },
                                      { label: "NO", value: "N" },
                                    ]}
                                    id="qualityFlagNDropdown"
                                    isMulti={false}
                                    onChange={(selectValue, event) =>
                                      handleLinearSelectChange(
                                        selectValue,
                                        event,
                                      )
                                    }
                                    value={apiTestStateComp.qualityFlagN}
                                  />
                                </td>
                              </tr>
                              {/* {questionData()} */}
                            </tbody>
                          </table>
                        </div>
                        {/* <div className="col-xs-6 col-md-3">
                                        <div>
                                              <input type="checkbox" id="chk1" name="chk1" />
                                              <label for="horns">FFS No Quality(I)</label>
                                        </div>
                                        </div>
                                        <div className="col-xs-6 col-md-3">
                                        <div>
                                              <input type="checkbox" id="chk2" name="chk2" />
                                              <label for="horns">FFS with Quality(J)</label>
                                        </div>
                                        </div>
                                        <div className="col-xs-6 col-md-3">
                                        <div>
                                              <input type="checkbox" id="chk3" name="chk3" />
                                              <label for="horns">APM-FFS-Shared Risk(K)</label>
                                        </div>
                                        </div>
                                        <div className="col-xs-6 col-md-3">
                                        <div>
                                              <input type="checkbox" id="chk4" name="chk4" />
                                              <label for="horns">FFS Based on Population(M)</label>
                                        </div>
                                        </div>

                                        <div className="col-xs-6 col-md-5">
                                        <div>
                                              <input type="checkbox" id="chk5" name="chk5" />
                                              <label for="horns">Risk Based Payments NOT Linked to Quality(L)</label>
                                        </div>
                                        </div>

                                        <div className="col-xs-6 col-md-5">
                                        <div>
                                              <input type="checkbox" id="chk6" name="chk6" />
                                              <label for="horns">Capitated Payments NOT Linked to Quality(N)</label>
                                        </div>
                                        </div>*/}
                      </div>

                      <div className="row my-2">
                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="12"
                              type="text"
                              className="form-control"
                              name="starsIncentive"
                              placeholder="John"
                              value={convertToCase(
                                apiTestStateComp.starsIncentive,
                              )}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              /*   disabled={lockStatus == 'V'}*/
                            />
                            <label htmlFor="floatingInputGrid">
                              Stars Incentive
                            </label>
                          </div>
                        </div>

                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="12"
                              type="text"
                              className="form-control"
                              name="awvIncentive"
                              placeholder="John"
                              value={convertToCase(
                                apiTestStateComp.awvIncentive,
                              )}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              /* disabled={lockStatus == 'V'}*/
                            />
                            <label htmlFor="floatingInputGrid">
                              AWV Incentive
                            </label>
                          </div>
                        </div>

                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="20"
                              type="text"
                              className="form-control"
                              name="medicalHome"
                              placeholder="John"
                              value={convertToCase(
                                apiTestStateComp.medicalHome,
                              )}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              /* disabled={lockStatus == 'V'}*/
                            />
                            <label htmlFor="floatingInputGrid">
                              Medical Home
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2 className="accordion-header" id="panelsStayOpen-Hospital">
                    <button
                      className="accordion-button accordionButtonStyle disableElements"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseHospital"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseHospital"
                    >
                      Hospital Compensation
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseHospital"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-Hospital"
                  >
                    <div className="accordion-body">
                      <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                          <div className="form-floating">
                            <Select
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  height: "58px",
                                  fontWeight: "lighter",
                                  backgroundColor: changeColorOfSelect(
                                    prop,
                                    "PDM",
                                  )
                                    ? "#F0F0F0"
                                    : "",
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  maxHeight: 200,
                                }),

                                container: (provided, state) => ({
                                  ...provided,
                                  marginTop: 0,
                                }),
                                valueContainer: (provided, state) => ({
                                  ...provided,
                                  overflow: "visible",
                                }),
                                placeholder: (provided, state) => ({
                                  ...provided,
                                  position: "absolute",
                                  top:
                                    state.hasValue ||
                                    state.selectProps.inputValue
                                      ? -15
                                      : "50%",
                                  transition: "top 0.1s, font-size 0.1s",
                                  fontSize:
                                    (state.hasValue ||
                                      state.selectProps.inputValue) &&
                                    13,
                                }),
                              }}
                              components={{
                                ValueContainer: CustomValueContainer,
                              }}
                              name="criticalAccess"
                              // isDisabled={lockStatus == 'V'}
                              className="basic-multi-select disableElements"
                              options={criticalAccessHospitalSelect}
                              id="criticalAccessDropdown"
                              isMulti={false}
                              isClearable
                              onChange={(selectValue, event) =>
                                handleLinearSelectChange(selectValue, event)
                              }
                              value={apiTestStateComp.criticalAccess}
                              placeholder="Is this Critical Access Hospital?"
                              //styles={{...customStyles}}
                              isSearchable={
                                document.documentElement.clientHeight >
                                document.documentElement.clientWidth
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </div>
                        {/* <label htmlFor="floatingInputGrid">If yes, Obtain FIRL Letter</label> */}
                        <div className="col-xs-6 col-md-4">
                          <div className="form-floating">
                            <input
                              maxLength="12"
                              type="text"
                              className="form-control disableElements"
                              name="pricingAWP"
                              placeholder="John"
                              value={convertToCase(apiTestStateComp.pricingAWP)}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              /*disabled={lockStatus == 'V'}*/
                            />
                            <label htmlFor="floatingInputGrid">
                              AWP Pricing -Drugs
                            </label>
                          </div>
                        </div>

                        <div className="col-xs-6 col-md-4">
                          <div className="form-floating">
                            <input
                              maxLength="12"
                              type="text"
                              className="form-control disableElements"
                              name="pricingASP"
                              placeholder="John"
                              value={convertToCase(apiTestStateComp.pricingASP)}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              /*  disabled={lockStatus == 'V'}*/
                            />
                            <label htmlFor="floatingInputGrid">
                              ASP Pricing Drugs
                            </label>
                          </div>
                        </div>
                      </div>

                      <div className="row">
                        <div className="col-xs-6 col-md-12">
                          <FIRLTable
                            firlTableRowsData={firlTableRowsData}
                            addTableRows={addTableRows}
                            deleteTableRows={deleteTableRows}
                            handleGridSelectChange={handleGridSelectChange}
                            gridFieldTempState={gridFieldTempState}
                            editTableRows={editTableRows}
                            /*handleGridDateChange={handleGridDateChange}*/
                            handleGridFieldChange={handleGridFieldChange}
                            gridRowsFinalSubmit={gridRowsFinalSubmit}
                            /*selectJson={selectValues}*/
                            //</div>lockStatus={(type!==undefined && type!==null && type=='Editable')?'N':'V'}>
                            lockStatus={
                              type !== undefined &&
                              type !== null &&
                              type == "NonEditable"
                                ? "Y"
                                : type !== undefined &&
                                    type !== null &&
                                    type == "ShowEye"
                                  ? "V"
                                  : "N"
                            }
                          ></FIRLTable>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="accordion-item">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-Compensation"
                  >
                    <button
                      className="accordion-button accordionButtonStyle disableElements"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseCompensation"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseCompensation"
                    >
                      Provider Compensation
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseCompensation"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-Compensation"
                  >
                    <div className="accordion-body">
                      <div className="row">
                        <div className="col-xs-6 col-md-12">
                          <CompensationTable
                            compensationTableRowsData={
                              compensationTableRowsData
                            }
                            addTableRows={addTableRows}
                            deleteTableRows={deleteTableRows}
                            handleGridSelectChange={handleGridSelectChange}
                            gridFieldTempState={gridFieldTempState}
                            editTableRows={editTableRows}
                            /*handleGridDateChange={handleGridDateChange}*/
                            handleGridFieldChange={handleGridFieldChange}
                            gridRowsFinalSubmit={gridRowsFinalSubmit}
                            /*selectJson={selectValues}*/
                            //</div>lockStatus={(type!==undefined && type!==null && type=='Editable')?'N':'V'}
                            lockStatus={
                              type !== undefined &&
                              type !== null &&
                              type == "NonEditable"
                                ? "Y"
                                : type !== undefined &&
                                    type !== null &&
                                    type == "ShowEye"
                                  ? "V"
                                  : "N"
                            }
                          ></CompensationTable>
                        </div>
                      </div>

                      <div className="row my-2 disableElements">
                        {/*<div className="col-xs-6 col-md-3">
                                                <div className="form-floating">
                                                <Select
                                                    styles={{
                                                        control: (provided) => ({
                                                            ...provided,
                                                            height: '58px'
                                                        }),
                                                        menuList: (provided) => ({
                                                            ...provided,
                                                            maxHeight: 200,
                                                        }),

                                                        container: (provided, state) => ({
                                                            ...provided,
                                                            marginTop: 0
                                                        }),
                                                        valueContainer: (provided, state) => ({
                                                            ...provided,
                                                            overflow: "visible"
                                                        }),
                                                        placeholder: (provided, state) => ({
                                                            ...provided,
                                                            position: "absolute",
                                                            top: state.hasValue || state.selectProps.inputValue ? -15 : "50%",
                                                            transition: "top 0.1s, font-size 0.1s",
                                                            fontSize: (state.hasValue || state.selectProps.inputValue) && 13
                                                        })

                                                    }}
                                                    components={{
                                                        ValueContainer: CustomValueContainer
                                                      }}

                                                    name = "capitationType"
                                                    isDisabled={lockStatus == 'V'}
                                                    className="basic-multi-select"
                                                    options={capitationTypeSelect}
                                                    id='capitationTypeDropdown'
                                                    isMulti={false}
                                                    isClearable
                                                    onChange={(selectValue,event)=>(handleLinearSelectChange(selectValue, event))}
                                                    value={apiTestStateComp.capitationType}
                                                    placeholder ="Capitation Type"
                                                    //styles={{...customStyles}}
                                                    isSearchable = {document.documentElement.clientHeight>document.documentElement.clientWidth?false:true}
                                                    />
                                                </div>
                                        </div>*/}

                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="20"
                              type="text"
                              className="form-control"
                              name="annualEscl"
                              placeholder="John"
                              value={convertToCase(apiTestStateComp.annualEscl)}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              /* disabled={lockStatus == 'V'}*/
                            />
                            <label htmlFor="floatingInputGrid">
                              Annual Escalator
                            </label>
                          </div>
                        </div>

                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <Select
                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  height: "58px",
                                  fontWeight: "lighter",
                                  backgroundColor: changeColorOfSelect(
                                    prop,
                                    "PDM",
                                  )
                                    ? "#F0F0F0"
                                    : "",
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  maxHeight: 200,
                                }),

                                container: (provided, state) => ({
                                  ...provided,
                                  marginTop: 0,
                                }),
                                valueContainer: (provided, state) => ({
                                  ...provided,
                                  overflow: "visible",
                                }),
                                placeholder: (provided, state) => ({
                                  ...provided,
                                  position: "absolute",
                                  top:
                                    state.hasValue ||
                                    state.selectProps.inputValue
                                      ? -15
                                      : "50%",
                                  transition: "top 0.1s, font-size 0.1s",
                                  fontSize:
                                    (state.hasValue ||
                                      state.selectProps.inputValue) &&
                                    13,
                                }),
                              }}
                              components={{
                                ValueContainer: CustomValueContainer,
                              }}
                              name="sequesApplies"
                              // isDisabled={lockStatus == 'V'}
                              className="basic-multi-select"
                              options={seqAppliesSelect}
                              id="sequesAppliesDropdown"
                              isMulti={false}
                              isClearable
                              onChange={(selectValue, event) =>
                                handleLinearSelectChange(selectValue, event)
                              }
                              value={apiTestStateComp.sequesApplies}
                              placeholder="Sequestration Applies"
                              //styles={{...customStyles}}
                              isSearchable={
                                document.documentElement.clientHeight >
                                document.documentElement.clientWidth
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </div>

                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <input
                              maxLength="50"
                              type="text"
                              className="form-control"
                              name="terminationClause"
                              placeholder="John"
                              value={convertToCase(
                                apiTestStateComp.terminationClause,
                              )}
                              onChange={(event) =>
                                handleLinearFieldChange(event)
                              }
                              /* disabled={lockStatus == 'V'}*/
                            />
                            <label htmlFor="floatingInputGrid">
                              Termination Clause
                            </label>
                          </div>
                        </div>

                        <div className="col-xs-6 col-md-3">
                          <div className="form-floating">
                            <Select
                              // classNames={{
                              //     control: (state) => `select-control-selector-1 ${(selectData&&selectData.selectOne&&!selectData.selectOne.value)?"is-invalid":""}`
                              // }}

                              styles={{
                                control: (provided) => ({
                                  ...provided,
                                  height: "58px",
                                  fontWeight: "lighter",
                                  backgroundColor: changeColorOfSelect(
                                    prop,
                                    "PDM",
                                  )
                                    ? "#F0F0F0"
                                    : "",
                                }),
                                menuList: (provided) => ({
                                  ...provided,
                                  maxHeight: 200,
                                }),

                                container: (provided, state) => ({
                                  ...provided,
                                  marginTop: 0,
                                }),
                                valueContainer: (provided, state) => ({
                                  ...provided,
                                  overflow: "visible",
                                }),
                                placeholder: (provided, state) => ({
                                  ...provided,
                                  position: "absolute",

                                  top:
                                    state.hasValue ||
                                    state.selectProps.inputValue
                                      ? -15
                                      : "50%",
                                  transition: "top 0.1s, font-size 0.1s",
                                  fontSize:
                                    (state.hasValue ||
                                      state.selectProps.inputValue) &&
                                    13,
                                }),
                              }}
                              components={{
                                ValueContainer: CustomValueContainer,
                              }}
                              name="contractTypeComp"
                              //  isDisabled={lockStatus == 'V'}
                              className="basic-multi-select"
                              options={contractTypeSelect}
                              id="contractTypeCompDropdown"
                              isMulti={false}
                              isClearable
                              onChange={(selectValue, event) =>
                                handleLinearSelectChange(selectValue, event)
                              }
                              value={apiTestStateComp.contractTypeComp}
                              placeholder="Contract Type"
                              //styles={{...customStyles}}
                              isSearchable={
                                document.documentElement.clientHeight >
                                document.documentElement.clientWidth
                                  ? false
                                  : true
                              }
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="accordion-item disableElements">
                  <h2
                    className="accordion-header"
                    id="panelsStayOpen-headingModel"
                  >
                    <button
                      className="accordion-button accordionButtonStyle"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#panelsStayOpen-collapseModel"
                      aria-expanded="true"
                      aria-controls="panelsStayOpen-collapseModel"
                    >
                      Model Of Care
                    </button>
                  </h2>
                  <div
                    id="panelsStayOpen-collapseModel"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-headingModel"
                  >
                    <div className="accordion-body AddProviderLabel">
                      <div className="row my-2">
                        <div className="col-xs-6 col-md-4">
                          <div>
                            <ReactDatePicker
                              id="datePicker"
                              className="form-control example-custom-input-provider"
                              selected={apiTestStateComp.mocAttestationDate}
                              name="mocAttestationDate"
                              onChange={(event) =>
                                handleDateChange(event, "mocAttestationDate")
                              }
                              dateFormat="MM/dd/yyyy"
                              //  disabled={lockStatus == 'V'}
                              //   readOnly={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                              peekNextMonth
                              showMonthDropdown
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              showYearDropdown
                              dropdownMode="select"
                              customInput={<RenderDatePicker03 />}
                            />
                          </div>
                        </div>

                        <div className="col-xs-6 col-md-4">
                          <div>
                            <ReactDatePicker
                              id="datePicker"
                              className="form-control example-custom-input-provider"
                              selected={apiTestStateComp.mocRenewalAttDate}
                              name="mocRenewalAttDate"
                              onChange={(event) =>
                                handleDateChange(event, "mocRenewalAttDate")
                              }
                              dateFormat="MM/dd/yyyy"
                              //  disabled={lockStatus == 'V'}
                              //   readOnly={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                              peekNextMonth
                              onKeyDown={(e) => {
                                e.preventDefault();
                              }}
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              customInput={<RenderDatePicker04 />}
                            />
                          </div>
                        </div>
                      </div>
                      {/* <div className="row my-2"></div> */}
                    </div>
                  </div>
                </div>

                {/* </>):(<></>)} */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
