import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import Select, { components } from "react-select";
import "./Forms.css";
import FIRLTable from "../../SelfServiceTiles/TileFormsTables/FIRLTable";
import CompensationTable from "../../SelfServiceTiles/TileFormsTables/CompensationTable";
import { useLocation, useNavigate } from "react-router-dom";
import ReactDatePicker from "react-datepicker";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
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
}) {
  // const[apiTestStateComp,setapiTestStateComp] = useState({});
  //    const [firlTableRowsData, setFirlTableRowsData] = useState([]);
  //    const [compensationTableRowsData, setCompensationTableRowsData] = useState([]);
  const mastersSelector = useSelector((masters) => masters);
  console.log("Masters Selector: ", mastersSelector);

  const tabRef = useRef("HomeView");
  const gridDataRef = useRef({});
  const { getTableDetails } = useGetDBTables();
  let prop = useLocation();
  const authData = useSelector((state) => state.auth);
  const token = useSelector((state) => state.auth.token);

  const RenderDatePicker02 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Contract Effective Date" />
      <label htmlFor="datePicker">Contract Effective Date</label>
    </div>
  );
  const RenderDatePicker03 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Contract Effective Date" />
      <label htmlFor="datePicker">MOC Attestation Date</label>
    </div>
  );
  const RenderDatePicker04 = (props) => (
    <div className="form-floating">
      <input {...props} placeholder="Contract Effective Date" />
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
    riskAssignmentSelect = compMaster.hasOwnProperty("riskAssignment")
      ? compMaster["riskAssignment"]
      : [];
    stateSelect = compMaster.hasOwnProperty("states")
      ? compMaster["states"]
      : [];
    feeScheduleSelect = compMaster.hasOwnProperty("feeSchedule")
      ? compMaster["feeSchedule"]
      : [];
    criticalAccessHospitalSelect = compMaster.hasOwnProperty(
      "criticalAccessHospital",
    )
      ? compMaster["criticalAccessHospital"]
      : [];
    seqAppliesSelect = compMaster.hasOwnProperty("seqApplies")
      ? compMaster["seqApplies"]
      : [];
    contractTypeSelect = compMaster.hasOwnProperty("contractType")
      ? compMaster["contractType"]
      : [];
    scheduleSelect = compMaster.hasOwnProperty("schedule")
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
                {transactionType !== undefined &&
                (transactionType == "Provider Contracting" ||
                  transactionType ==
                    "Facility/Ancillary/Health Systems Contracting" ||
                  transactionType == "Add a Provider") ? (
                  <>
                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-headingTwo"
                      >
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseTwo"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseTwo"
                        >
                          Risk Identifier
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseTwo"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-headingTwo"
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
                                  name="riskState"
                                  isDisabled={false}
                                  className="basic-multi-select"
                                  options={stateSelect}
                                  id="riskStateDropdown"
                                  isMulti={false}
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
                                  name="riskAssignment"
                                  isDisabled={false}
                                  className="basic-multi-select"
                                  options={riskAssignmentSelect}
                                  id="riskAssignmentDropdown"
                                  isMulti={false}
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
                                  maxLength="12"
                                  type="text"
                                  className="form-control"
                                  name="taxId"
                                  placeholder="John"
                                  value={apiTestStateComp.taxId}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
                                  onBlur={(event) =>
                                    handleMedicalGrpNoShow(event)
                                  }
                                />
                                <label htmlFor="floatingInputGrid">
                                  Tax ID
                                </label>
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
                                  value={apiTestStateComp.groupRiskId}
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
                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-headingTwo"
                      >
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseTwo"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseTwo"
                        >
                          Provider Identifier
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseTwo"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-headingTwo"
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
                                  value={apiTestStateComp.medicalLicense}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
                                  onBlur={(event) => handlePcpIdShow(event)}
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
                                  value={apiTestStateComp.pcpId}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
                                  disabled
                                  required
                                />
                                <label htmlFor="floatingInputGrid">
                                  PCP ID
                                </label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-headingTwo"
                      >
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseTwo"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseTwo"
                        >
                          Network Affiliation
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseTwo"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-headingTwo"
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
                                  name="networkState"
                                  isDisabled={false}
                                  className="basic-multi-select"
                                  options={stateSelect}
                                  id="networkStateDropdown"
                                  isMulti={false}
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
                                  value={apiTestStateComp.planValue}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
                                  onBlur={(event) => handleNetworkIdShow(event)}
                                />
                                <label htmlFor="floatingInputGrid">
                                  Plan Value
                                </label>
                              </div>
                            </div>

                            <div className="col-xs-6 col-md-3">
                              <div className="form-floating">
                                <input
                                  maxLength="12"
                                  type="text"
                                  className="form-control"
                                  name="networkId"
                                  placeholder="John"
                                  value={apiTestStateComp.networkId}
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
                                  name="feeSchedule"
                                  isDisabled={false}
                                  className="basic-multi-select"
                                  options={feeScheduleSelect}
                                  id="feeScheduleDropdown"
                                  isMulti={false}
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
                  </>
                ) : (
                  <></>
                )}

                {transactionType !== undefined &&
                (transactionType == "Provider Contracting" ||
                  transactionType ==
                    "Facility/Ancillary/Health Systems Contracting") ? (
                  <>
                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-headingTwo"
                      >
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseTwo"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseTwo"
                        >
                          Type Of Contract
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseTwo"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-headingTwo"
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
                                    <th
                                      style={{ textAlign: "center" }}
                                      scope="col"
                                    >
                                      Please select
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  <tr>
                                    <td>1</td>
                                    <td>
                                      FFS No Quality(I) : Category 1
                                      (B-Payments)
                                    </td>
                                    <td>
                                      <Select
                                        name="qualityFlagI"
                                        isDisabled={false}
                                        options={[
                                          { label: "Yes", value: "Y" },
                                          { label: "No", value: "N" },
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
                                      />
                                    </td>
                                  </tr>

                                  <tr>
                                    <td>2</td>
                                    <td>
                                      FFS with Quality(J) : Category 2
                                      (C-Payments)
                                    </td>
                                    <td>
                                      <Select
                                        name="qualityFlagJ"
                                        isDisabled={false}
                                        options={[
                                          { label: "Yes", value: "Y" },
                                          { label: "No", value: "N" },
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
                                        name="qualityFlagK"
                                        isDisabled={false}
                                        options={[
                                          { label: "Yes", value: "Y" },
                                          { label: "No", value: "N" },
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
                                        name="qualityFlagM"
                                        isDisabled={false}
                                        options={[
                                          { label: "Yes", value: "Y" },
                                          { label: "No", value: "N" },
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
                                      Risk Based Payments NOT Linked to
                                      Quality(L) : APM 3N (E-Payments)
                                    </td>
                                    <td>
                                      <Select
                                        name="qualityFlagL"
                                        isDisabled={false}
                                        options={[
                                          { label: "Yes", value: "Y" },
                                          { label: "No", value: "N" },
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
                                    <td>5</td>
                                    <td>
                                      Capitated Payments NOT Linked to
                                      Quality(N) : APM 3N (G-Payments)
                                    </td>
                                    <td>
                                      <Select
                                        name="qualityFlagN"
                                        isDisabled={false}
                                        options={[
                                          { label: "Yes", value: "Y" },
                                          { label: "No", value: "N" },
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
                                  value={apiTestStateComp.starsIncentive}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
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
                                  value={apiTestStateComp.awvIncentive}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
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
                                  value={apiTestStateComp.medicalHome}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
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
                      <h2 className="accordion-header" id="panelsStayOpen-FIRL">
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseFIRL"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
                        >
                          Hospital Compensation
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseFIRL"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-FIRL"
                      >
                        <div className="accordion-body">
                          <div className="row my-2">
                            <div className="col-xs-6 col-md-3">
                              <div className="form-floating">
                                <Select
                                  styles={{
                                    control: (provided) => ({
                                      ...provided,
                                      height: "58px",
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
                                  isDisabled={false}
                                  className="basic-multi-select"
                                  options={criticalAccessHospitalSelect}
                                  id="criticalAccessDropdown"
                                  isMulti={false}
                                  onChange={(selectValue, event) =>
                                    handleLinearSelectChange(selectValue, event)
                                  }
                                  value={apiTestStateComp.criticalAccess}
                                  placeholder="Is this Critical Access Hospital ?"
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
                            <div className="col-xs-6 col-md-3">
                              <div className="form-floating">
                                <input
                                  maxLength="12"
                                  type="text"
                                  className="form-control"
                                  name="pricingAWP"
                                  placeholder="John"
                                  value={apiTestStateComp.pricingAWP}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
                                />
                                <label htmlFor="floatingInputGrid">
                                  AWP Pricing -Drugs
                                </label>
                              </div>
                            </div>

                            <div className="col-xs-6 col-md-3">
                              <div className="form-floating">
                                <input
                                  maxLength="12"
                                  type="text"
                                  className="form-control"
                                  name="pricingASP"
                                  placeholder="John"
                                  value={apiTestStateComp.pricingASP}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
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
                                /*handleGridDateChange={handleGridDateChange}*/
                                handleGridFieldChange={handleGridFieldChange}
                                gridRowsFinalSubmit={gridRowsFinalSubmit}
                                /*selectJson={selectValues}*/
                                lockStatus={
                                  prop.state !== null &&
                                  prop.state.lockStatus !== undefined
                                    ? prop.state.lockStatus
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
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseCompensation"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseOne"
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
                                /*handleGridDateChange={handleGridDateChange}*/
                                handleGridFieldChange={handleGridFieldChange}
                                gridRowsFinalSubmit={gridRowsFinalSubmit}
                                /*selectJson={selectValues}*/
                                lockStatus={
                                  prop.state !== null &&
                                  prop.state.lockStatus !== undefined
                                    ? prop.state.lockStatus
                                    : "N"
                                }
                              ></CompensationTable>
                            </div>
                          </div>

                          <div className="row my-2">
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
                                                    isDisabled={false}
                                                    className="basic-multi-select"
                                                    options={capitationTypeSelect}
                                                    id='capitationTypeDropdown'
                                                    isMulti={false}
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
                                  value={apiTestStateComp.annualEscl}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
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
                                  isDisabled={false}
                                  className="basic-multi-select"
                                  options={seqAppliesSelect}
                                  id="sequesAppliesDropdown"
                                  isMulti={false}
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
                                  value={apiTestStateComp.terminationClause}
                                  onChange={(event) =>
                                    handleLinearFieldChange(event)
                                  }
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
                                  isDisabled={false}
                                  className="basic-multi-select"
                                  options={contractTypeSelect}
                                  id="contractTypeCompDropdown"
                                  isMulti={false}
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

                    <div className="accordion-item">
                      <h2
                        className="accordion-header"
                        id="panelsStayOpen-headingTwo"
                      >
                        <button
                          className="accordion-button accordionButtonStyle"
                          type="button"
                          data-bs-toggle="collapse"
                          data-bs-target="#panelsStayOpen-collapseTwo"
                          aria-expanded="true"
                          aria-controls="panelsStayOpen-collapseTwo"
                        >
                          Model Of Care
                        </button>
                      </h2>
                      <div
                        id="panelsStayOpen-collapseTwo"
                        className="accordion-collapse collapse show"
                        aria-labelledby="panelsStayOpen-headingTwo"
                      >
                        <div className="accordion-body AddProviderLabel">
                          <div className="row my-2">
                            <div className="col-xs-6 col-md-3">
                              <div>
                                <ReactDatePicker
                                  id="datePicker"
                                  className="form-control example-custom-input-provider"
                                  selected={apiTestStateComp.mocAttestationDate}
                                  name="mocAttestationDate"
                                  onChange={(event) =>
                                    handleDateChange(
                                      event,
                                      "mocAttestationDate",
                                    )
                                  }
                                  dateFormat="MM/dd/yyyy"
                                  //   readOnly={(tabRef.current==='DashboardView'&&(prop.state.lockStatus!==undefined && prop.state.lockStatus==='Y')?true:false)}
                                  peekNextMonth
                                  onKeyDown={(e) => {
                                    e.preventDefault();
                                  }}
                                  showMonthDropdown
                                  showYearDropdown
                                  dropdownMode="select"
                                  customInput={<RenderDatePicker03 />}
                                />
                              </div>
                            </div>

                            <div className="col-xs-6 col-md-3">
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
                  </>
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
