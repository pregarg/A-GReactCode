import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Formik, Form } from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ProviderInformationSearch from "../TileForms/ProviderInformationSearch";
import "./Appeals.css";
import { FormikInputField } from "../Common/FormikInputField";
import { useAxios } from "../../../api/axios.hook";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { renderElements, RenderType } from "./Constants";
import TableComponent from "../../../../src/util/TableComponent";

const PdProviderInformationAccordion = (props) => {
  const { convertToCase, extractDate, getDatePartOnly } = useGetDBTables();
  const location = useLocation();
  const caseHeaderConfigData = JSON.parse(
    process.env.REACT_APP_CASEHEADER_DETAILS || "{}"
  );
  const [showProviderInformationSearch, setShowProviderInformationSearch] =
    useState(false);

  const [ProviderInformationInformationData, setProviderInformationInformationData] = useState(
    props.ProviderInformationInformationData
  );
  const commAngPrefSelector = useSelector((state) => state?.masterAngCommPref);
  const token = useSelector((state) => state.auth.token);
  const [selectedCriteria, setSelectedCriteria] = useState();
  const [selectSearchValues, setSelectSearchValues] = useState();
  const [responseData, setResponseData] = useState([]);
  const [showProviderMemberSearch, setShowProviderMemberSearch] =
    useState(false);
  const { customAxios: axios } = useAxios();
  const [selectedAddress, setSelectedAddress] = useState([]);
  const stageName = caseHeaderConfigData["StageName"];

  // Ensure isChecked defaults to 0 if undefined or null
  const [providerInformationData, setProviderInformationData] = useState({
    ...props.providerInformationData,
    isChecked: props.providerInformationData.isChecked ?? 0, // Initialize as 0 if unchecked or null
  });

  const handleCheckBoxChangeNew = (e) => {
    const isCheckedValue = e.target.checked ? 1 : 0;
    handleProviderInformationData("isChecked", isCheckedValue, true); // Set 1 if checked, 0 if unchecked
  };

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

  const persistProviderInformationDataData = async () => {
    const payload = {
      ...providerInformationData,
      isChecked: providerInformationData.isChecked ? "1" : "0", // Ensure 1 or 0 is sent to the DB
    };

    try {
      const res = await axios.post("/saveEndpoint", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("Save successful:", res.data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
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
        displayErrors={props.shouldShowSubmitError}
        schema={props.providerInformationValidationSchema}
        errors={props.providerInformationErrors}
      />
    </div>
  );

  const handleShowProviderInformationSearch = () => {
    setShowProviderInformationSearch(true);
  };
  const handleCloseSearch = () => {
    setShowProviderInformationSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
  };

  const handleSelectedProviderInformations = () => {
    setShowProviderInformationSearch(false);
    setSelectedCriteria([]);
    setSelectSearchValues([]);
    setResponseData([]);
    props.setProviderInformationInformationData({ ...selectedAddress[0] });
  };

  const showProviderInformations = async () => {
    let ProviderMemberID = selectSearchValues?.ProvidermemberID;
    let MedicareID = selectSearchValues?.medicareID;
    let MedicaidID = selectSearchValues?.medicaidID;
    let ProviderMemberFirstName = selectSearchValues?.ProvidermemberFirstNameId;
    let ProviderMemberLastName = selectSearchValues?.ProvidermemberLasstNameId;
    let DOB = selectSearchValues?.dateOfBirth;

    if (
      ProviderMemberID ||
      MedicareID ||
      MedicaidID ||
      ProviderMemberFirstName ||
      ProviderMemberLastName ||
      DOB
    ) {
      let getApiJson = {
        option: "GETPROVIDERINFORMATIONSEARCHDATA",
        ProviderMember_ID: ProviderMemberID || "",
        Medicare_ID: MedicareID || "",
        Medicaid_ID: MedicaidID || "",
        ProviderMember_First_Name: ProviderMemberFirstName || "",
        ProviderMember_Last_Name: ProviderMemberLastName || "",
        Date_of_Birth: extractDate(DOB) || "",
      };

      try {
        let res = await axios.post("/generic/callProcedure", getApiJson, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let resApiData = res.data.CallProcedure_Output?.data || [];

        if (resApiData.length === 0) {
          alert("No data found");
          return;
        }

        resApiData.forEach((apiResponse) => {
          if (
            apiResponse?.hasOwnProperty("Date_of_Birth") &&
            typeof apiResponse.Date_of_Birth === "string"
          ) {
            const mad = new Date(getDatePartOnly(apiResponse.Date_of_Birth));
            apiResponse.Date_of_Birth = extractDate(mad);
          }

          if (
            apiResponse?.hasOwnProperty("Plan_Effective_Date") &&
            typeof apiResponse.Plan_Effective_Date === "string"
          ) {
            const mad = new Date(
              getDatePartOnly(apiResponse.Plan_Effective_Date)
            );
            apiResponse.Plan_Effective_Date = extractDate(mad);
          }

          if (
            apiResponse?.hasOwnProperty("Plan_Expiration_Date") &&
            typeof apiResponse.Plan_Expiration_Date === "string"
          ) {
            const mad = new Date(
              getDatePartOnly(apiResponse.Plan_Expiration_Date)
            );
            apiResponse.Plan_Expiration_Date = extractDate(mad);
          }
        });

        setResponseData(resApiData);
      } catch (error) {
        console.error("API Error:", error);
        alert("Error in fetching data. Please try again later.");
      }
    } else {
      alert("Please select at least one search value.");
    }
  };

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
                  onClick={handleShowProviderInformationSearch}
                >
                  Provider Information Search
                </button>

                <div className="row my-2">
                  <div className="col-md-3 text-start">
                    <label>
                      <input
                        type="checkbox"
                        checked={providerInformationData.isChecked === 1}  // 1 for checked, 0 for unchecked
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
                  renderDatePicker
                )}
              </div>

              {showProviderInformationSearch && (
                <ProviderInformationSearch
                  handleCloseSearch={handleCloseSearch}
                  selectedCriteria={selectedCriteria}
                  setSelectedCriteria={setSelectedCriteria}
                  selectSearchValues={selectSearchValues}
                  setSelectSearchValues={setSelectSearchValues}
                  responseData={responseData}
                  setResponseData={setResponseData}
                  showProviderInformations={showProviderInformations}
                  handleSelectedProviderInformations={
                    handleSelectedProviderInformations
                  }
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
