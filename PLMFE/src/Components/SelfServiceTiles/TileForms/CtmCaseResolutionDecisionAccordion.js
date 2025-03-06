import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";

const CtmCaseResolutionDecisionAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [ctmCaseResolutionDecisionData, setCtmCaseResolutionDecisionData] = useState(props.ctmCaseResolutionDecisionData);
  const [invalidInputState, setInvalidInputState] = useState(false);
  const persistCtmCaseResolutionDecisionInformationData = () => {
    props.setCtmCaseResolutionDecisionData(ctmCaseResolutionDecisionData);
  };
const masterCtmDaysAgoSelector = useSelector(
     (state) => state?.masterCtmDaysAgo,
   );
   const masterCtmDropDownSelector = useSelector(
           (state) => state?.masterCtmDropDown,
         );
  const handleCtmCaseResolutionDecisionRequestData = (name, value, persist) => {
    const newData = {
      ...ctmCaseResolutionDecisionData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setCtmCaseResolutionDecisionData({...newData});
    if (persist) {
      props.setCtmCaseResolutionDecisionData({...newData});
    }
  };


  const renderInputField = (name, placeholder, maxLength) => (
      <div className="col-xs-6 col-md-4">
        <FormikInputField
            name={name}
            placeholder={placeholder}
            maxLength={maxLength}
            data={ctmCaseResolutionDecisionData}
            onChange={handleCtmCaseResolutionDecisionRequestData}
            disabled={
                location.state.formView === "DashboardView" &&
                (
                    location.state.stageName === "Case Completed" ||
                    location.state.stageName === "Case Archived")


            }
            persist={persistCtmCaseResolutionDecisionInformationData}
            schema={props.ctmCaseResolutionDecisionValidationSchema}
            displayErrors={props.shouldShowSubmitError}
            errors={props.ctmCaseResolutionDecisionErrors}
        />
      </div>
  );
  const renderDatePicker = (name, placeholder, label) => (
      <div className="col-xs-6 col-md-4">
        <FormikDatePicker
          name={name}
          placeholder={placeholder}
          label={label}
          data={ctmCaseResolutionDecisionData || {}}
          onChange={handleCtmCaseResolutionDecisionRequestData}
          displayErrors={props.shouldShowSubmitError}
          schema={props.ctmCaseResolutionDecisionValidationSchema}
          errors={props.ctmCaseResolutionDecisionErrors}
        />
      </div>
    );
const renderSelectField = (name, placeholder, options) => (
    <div className="col-xs-6 col-md-4">
      <FormikSelectField
        name={name}
        placeholder={placeholder}
         data={ctmCaseResolutionDecisionData  || {}}
        options={options}
        onChange={handleCtmCaseResolutionDecisionRequestData}
        disabled={invalidInputState}
        persist={persistCtmCaseResolutionDecisionInformationData}
        schema={props.ctmCaseResolutionDecisionValidationSchema}
        displayErrors={props.shouldShowSubmitError}
         errors={props.ctmCaseResolutionDecisionErrors}
      />
    </div>
  );
    const [ctmDaysAgoValues, setCtmDaysAgoValues] = useState([]);
    const [ctmDropDownValues, setCtmDropDownValues] = useState([]);
  useEffect(() => {
      const kvMapper = (e) => ({
        label: convertToCase(e),
        value: convertToCase(e),
      });


      const DaysAgo = masterCtmDaysAgoSelector?.[0] || [];
      setCtmDaysAgoValues(
        [...new Set(DaysAgo .map((e) => convertToCase(e.Days_ago)))].map(
          kvMapper,
        ),
      );

   const ctmDropDown = masterCtmDropDownSelector?.[0] || [];
        setCtmDropDownValues(
              [...new Set(ctmDropDown.map((e) => convertToCase(e.Drop_Down)))].map(
                kvMapper,
              ),
            );



    }, []);
  return (
      <div>
        <div className="accordion-item" id="ctmCaseResolutionDecisionInformation">
          <h2 className="accordion-header" id="panelsStayOpen-ctmCaseResolutionDecisionInformation">
            <button
                className="accordion-button accordionButtonStyle"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#panelsStayOpen-collapseclaimInformation"
                aria-expanded="true"
                aria-controls="panelsStayOpen-collapseOne"
            >
              Case Resolution Decision
            </button>
          </h2>
          <div
              id="panelsStayOpen-collapsectmCaseResolutionDecisionInformation"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-ctmCaseResolutionDecisionInformation"
          >
            <div className="accordion-body">
            How many times did the member/provider contact the plan before filing CTM?
              <div className="row my-2">

                {renderSelectField("Thirty_Days_Ago", "0-30 Days Ago",ctmDaysAgoValues )}
                {renderSelectField("Sixty_Days_Ago", "31-60 Days Ago", ctmDaysAgoValues)}
                {renderSelectField("Ninety_Days_Ago", "61-90 Days ago",ctmDaysAgoValues )}
                </div>
                <div className="row my-2">
                {renderSelectField("System_Update", "System Update",ctmDropDownValues )}
                {renderSelectField("Complainant_Satisfied_With_Resolution ", "Complainant Satisfied With Resolution? ", )}
               {renderInputField("Resolution_Notes", "Resolution Notes", )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default CtmCaseResolutionDecisionAccordion;
