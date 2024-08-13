import React, {useState, useEffect} from "react";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {Field, ErrorMessage} from "formik";
import Select, {components} from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import ReactDatePicker from "react-datepicker";
import {selectStyle} from "./SelectStyle";

const ExpeditedRequestAccordion = (props) => {
  const {convertToCase} = useGetDBTables();

  const [expeditedRequestData, setExpeditedRequestData] = useState(props.expeditedRequestData);

  const expReqSelector = useSelector((state) => state?.masterAngExpeditedRequested);
  const expDenSelector = useSelector((state) => state?.masterAngExpeditedDenied);
  const angStSelector = useSelector((state) => state?.masterAngStUpExpedited);

  const location = useLocation();
  console.log("expedited1234567@@@",location)
  

  const [invalidInputState, setInvalidInputState] = useState(false);

  useEffect(() => {
    setInvalidInputState(location.state.formView === "DashboardView" &&
        (
           
            location.state.stageName === "Redirect Review" ||
            location.state.stageName === "Documents Needed" ||
            location.state.stageName === "Effectuate" ||
            location.state.stageName === "Pending Effectuate" ||
            location.state.stageName === "Resolve" ||
            location.state.stageName === "Case Completed" ||
            
            location.state.stageName === "CaseArchived"))
  }, [location]);

  const handleExpeditedRequestData = (name, value, persist) => {
    const newData = {...expeditedRequestData, [name]: typeof value === 'string' ? convertToCase(value) : value};
    setExpeditedRequestData(newData);
    if (persist) {
      props.setExpeditedRequestData(newData);
    }
  };
  const persistExpeditedRequestData = () => {
    props.setExpeditedRequestData(expeditedRequestData);
  }


  const wrapPlaceholder = (name, placeholder) => {
    const field = props.expeditedRequestValidationSchema?.fields?.[name];
    const required = (field?.type === 'date' && field?.internalTests?.optionality) ||
        (field?.tests?.some(test => test.OPTIONS?.name === 'required'));
    return `${placeholder}${required ? ' *' : ''}`;
  };
  const {ValueContainer, Placeholder} = components;
  const CustomValueContainer = ({children, ...props}) => {
    return (
        <ValueContainer {...props}>
          <Placeholder {...props} isFocused={props.isFocused}>
            {wrapPlaceholder(props.selectProps.name, props.selectProps.placeholder)}
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
                      onChange={(event) => handleExpeditedRequestData(name, event.target.value)}
                      onBlur={persistExpeditedRequestData}
                      value={expeditedRequestData[name]}
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
                        
                        location.state.stageName === "CaseArchived")
                }
                className="basic-multi-select"
                options={options}
                id={name}
                isMulti={false}
                onChange={(value) => handleExpeditedRequestData(name, value?.value, true)}
                value={expeditedRequestData[name] ? {
                  label: expeditedRequestData[name],
                  value: expeditedRequestData[name]
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
  const DatePicker = (name, label, placeholder) => {
    const CustomInput = (props) => {
      return (
          <div className="form-floating">
            <input {...props} autoComplete="off" placeholder={wrapPlaceholder(name, placeholder)}/>
            <label htmlFor={name}>{wrapPlaceholder(name, label)}</label>
          </div>
      )
    };
    const dateValue = expeditedRequestData[name + "#date"] ? new Date(expeditedRequestData[name + "#date"]) : expeditedRequestData[name];
    return (
        <div>
          <ReactDatePicker
              id={name}
              className="form-control example-custom-input-provider"
              selected={dateValue}
              name={name}
              dateFormat="MM/dd/yyyy"
              onChange={(date) => handleExpeditedRequestData(name, date, true)}
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
                    location.state.stageName === "Documents Needed" ||
                      location.state.stageName === "Effectuate" ||
                      location.state.stageName === "Pending Effectuate" ||
                      location.state.stageName === "Resolve" ||
                      location.state.stageName === "Case Completed" ||
                     
                      location.state.stageName === "CaseArchived")
              }
          />
        </div>
    )
  };


  const [expeditedRequestedValues, setExpeditedRequestedValues] = useState([]);
  const [expeditedDeniedValues, setExpeditedDeniedValues] = useState([]);
  const [stUpExpeditedValues, setStUpExpeditedValues] = useState([]);

  useEffect(() => {
    const kvMapper = e => ({label: convertToCase(e), value: convertToCase(e)});
    const expReq = expReqSelector?.[0] || [];
    setExpeditedRequestedValues(expReq.map(e => e.Expedited_Requested).map(kvMapper));

    const expDen = expDenSelector?.[0] || [];
    setExpeditedDeniedValues(expDen.map(e => e.Expedited_Denied).map(kvMapper));

    const angSt = angStSelector?.[0] || [];
    setStUpExpeditedValues(angSt.map(e => e.St_Up_Expedited).map(kvMapper));
  },[]);

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
              Expedited Request
            </button>
          </h2>
          <div
              id="panelsStayOpen-collapseclaimInformation"
              className="accordion-collapse collapse show"
              aria-labelledby="panelsStayOpen-claimInformation"
          >
            <div className="accordion-body">
              <div className="row my-2">
                <div className="col-xs-6 col-md-4">
                  {SelectField("Expedited_Requested", "Expedited Requested", expeditedRequestedValues)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {InputField("Expedited_Reason", "Expedited Reason", 30)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {SelectField("Standard_Upgraded_to_Expedited", "Standard Upgraded to Expedited", stUpExpeditedValues)}
                </div>
              </div>
              <div className="row my-2">
                <div className="col-xs-6 col-md-4">
                  {DatePicker("Expedited_Upgrade_Date_Time", "Expedited Upgrade Date Time", "Expedited Upgrade Date Time")}
                </div>
                <div className="col-xs-6 col-md-4">
                  {SelectField("Expedited_Denied", "Expedited Denied", expeditedDeniedValues)}
                </div>
                <div className="col-xs-6 col-md-4">
                  {DatePicker("Expedited_Denied_Date", "Expedited Denied Date", "Expedited Denied Date")}
                </div>
              </div>
              <div className="row my-2">
                <div className="col-xs-6 col-md-4">
                  {DatePicker("Decision_Letter_Date", "Decision Letter Date", "Decision Letter Date")}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}
export default ExpeditedRequestAccordion;