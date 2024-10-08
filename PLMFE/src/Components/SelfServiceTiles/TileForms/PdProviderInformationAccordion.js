import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { useAxios } from "../../../api/axios.hook";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";
import TableComponent from "../../../../src/util/TableComponent";
import ProviderSearch from "../TileForms/ProviderSearch";
import { FormikCheckBoxField } from "../Common/FormikCheckBoxField";
import CaseHeader from "./CaseHeader";

const PdProviderInformationAccordion = (props) => {
  const { convertToCase, extractDate, getDatePartOnly } = useGetDBTables();
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
      process.env.REACT_APP_CASEHEADER_DETAILS || "{}",
  );
  const [showProviderSearch, setShowProviderSearch] = useState(false);
  const [ProviderInformationInformationData, setProviderInformationInformationData] = useState(
      props.ProviderInformationInformationData,
  );
  const commAngPrefSelector = useSelector((state) => state?.masterAngCommPref);
  const token = useSelector((state) => state.auth.token);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [responseData, setResponseData] = useState([]);
  const { customAxios: axios } = useAxios();
  const [selectedAddress, setSelectedAddress] = useState([]);
  const stageName = caseHeaderConfigData["StageName"];
  const [isCheckedBox, setIscheckedBox] = useState(false);


  // const [providerInformationData, setProviderInformationData] = useState(props.providerInformationData || {});
  const [providerInformationData, setProviderInformationData] = useState({
    ...props.providerInformationData,
    isChecked: props.providerInformationData.isChecked ?? 0, // Initialize as 0 if unchecked or null
  });
  const handleProviderInformationData = (name, value, persist) => {
    const newData = {
      ...providerInformationData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setProviderInformationData(newData);
    if (persist) {
      props.setProviderInformationData(newData);
    }
  };
  const persistProviderInformationDataData = () => {
    props.setProviderInformationData(providerInformationData);
  };

  const handleShowProviderSearch = () => {
    setShowProviderSearch(true);
  };
  const handleCloseSearch = () => {
    setShowProviderSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
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
  const handleClearProviderInformationSearch = () => {
    setSelectSearchValues([]);
    setSelectedCriteria([]);
    setResponseData([]);
  };

  const handleSelectedProvider = () => {
    setShowProviderSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
    props.setProviderInformationData({ ...selectedAddress[0] });
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


  const handleCheckBoxChangeNew = (e) => {
    const isCheckedValue = e.target.checked ? 1 : 0;
    handleProviderInformationData("isChecked", isCheckedValue, true); // Set 1 if checked, 0 if unchecked
  };


  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4">
        <FormikInputField
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            data={providerInformationData}
            onChange={handleProviderInformationData}
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
            persist={persistProviderInformationDataData}
            schema={props.providerInformationValidationSchema}
            errors={props.providerInformationErrors}
        />
      </div>
  );
  const renderSelectField = (name, placeholder, options) => (
      <div className="col-xs-6 col-md-4">
        <FormikSelectField
            name={name}
            placeholder={placeholder}
            data={providerInformationData}
            options={options}
            onChange={handleProviderInformationData}
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
            schema={props.providerInformationValidationSchema}
            errors={props.providerInformationErrors}
        />
      </div>
  );

  const renderDatePicker = (name, placeholder, label) => (
      <div className="col-xs-6 col-md-4">
        <FormikDatePicker
            name={name}
            placeholder={placeholder}
            data={providerInformationData}
            label={label}
            onChange={handleProviderInformationData}
            disabled={
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
            displayErrors={props.shouldShowSubmitError}
            schema={props.providerInformationValidationSchema}
            errors={props.providerInformationErrors}
        />
      </div>
  );
  
  return (
      <Formik
          initialValues={props.providerInformationData}
          validationSchema={props.providerInformationValidationSchema}
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
                    Provider Information
                  </button>
                </h2>
                <div
                    id="panelsStayOpen-collapseTimelines"
                    className="accordion-collapse collapse show"
                    aria-labelledby="panelsStayOpen-Timelines"
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

                    <div className="row my-2">
                      <div className="col-md-3 text-start">
                        <label>
                          <input
                              type="checkbox"
                              checked={providerInformationData.isChecked == 1}  // 1 for checked, 0 for unchecked
                              onChange={handleCheckBoxChangeNew}  // Handle change
                          />
                          White Glove
                        </label>
                      </div>
                    </div>
                    {renderElements(
                        props.providerInformationFields,
                        renderSelectField,
                        renderInputField,
                        renderDatePicker,
                        "",
                    )}
                  </div>
                  {showProviderSearch && (
                      <ProviderSearch
                          handleCloseSearch={handleCloseSearch}
                          selectedCriteria={selectedCriteria}
                          setSelectedCriteria={setSelectedCriteria}
                          selectSearchValues={selectSearchValues}
                          setSelectSearchValues={setSelectSearchValues}
                          responseData={responseData}
                          setResponseData={setResponseData}
                          handleClearProviderInformationSearch={handleClearProviderInformationSearch}
                          showProviderSearch={showProviderSearch}
                          showProviders={showProviders}
                          ProviderSearchTableComponent={providerSearchTableComponent}
                          handleSelectedProviders={handleSelectedProvider}

                      />
                  )}
                </div>
              </div>
            </Form>
        )}
      </Formik>

  );
};

export default PdProviderInformationAccordion;
