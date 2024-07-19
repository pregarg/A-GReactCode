import React, {useState, useEffect, useRef} from "react";
import {useLocation} from "react-router-dom";
import {useSelector} from "react-redux";
import {Field, ErrorMessage} from "formik";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import Select, {components} from "react-select";
import "./CaseHeader.css";
import {selectStyle} from "./SelectStyle";

const CaseInformationAccordion = (props) => {
  const {
    convertToCase,
  } = useGetDBTables();
  const [caseInformationData, setCaseInformationData] = useState(props.caseInformationData);
  const mastersSelector = useSelector((masters) => masters);

  let location = useLocation();

  const [lobValues, setLobValues] = useState([]);
  const [appellantDescValues, setAppellantDescValues] = useState([]);
  const [appellantTypeValues, setAppellantTypeValues] = useState([]);
  const [appealTypeValues, setAppealTypeValues] = useState([]);
  const [caseLevelPriorityValues, setCaseLevelPriorityValues] = useState([]);
  const [issueLevelValues, setIssueLevelValues] = useState([]);
  const [reviewTypeValues, setReviewTypeValues] = useState([]);
  const [productValues, setProductValues] = useState([]);
  const [productStateValues, setProductStateValues] = useState([]);

  useEffect(() => {
    const kvMapper = e => ({label: convertToCase(e), value: convertToCase(e)})
    const arr = mastersSelector?.masterAngLOBMapping?.[0] || [];
    setLobValues(arr.map(e => e.LOB).map(kvMapper));
    setProductValues(arr.map(e => e.Product).map(kvMapper));
    setProductStateValues(arr.map(e => e.State).map(kvMapper));

    const appellantDesc = mastersSelector?.masterAngAppellantDesc?.[0] || [];
    setAppellantDescValues([...new Set(appellantDesc.map(e => convertToCase(e.APPELLANT_DESC)))].map(kvMapper));

    const appellantType = mastersSelector?.masterAngAppellantType?.[0] || [];
    setAppellantTypeValues(appellantType.map(e => e.Appellant_Type).map(kvMapper));

    const appealType = mastersSelector?.masterAngAppealType?.[0] || [];
    setAppealTypeValues(appealType.map(e => e.Appeal_Type).map(kvMapper));

    const caseLevel = mastersSelector?.masterAngCaseLevelPriority?.[0] || [];
    setCaseLevelPriorityValues(caseLevel.map(e => e.Case_Level_Priority).map(kvMapper));

    const issueLevel = mastersSelector?.masterAngIssueLevel?.[0] || [];
    setIssueLevelValues(issueLevel.map(e => e.Issue_Level).map(kvMapper));

    const masterAng = mastersSelector?.masterAngReviewType?.[0] || [];
    setReviewTypeValues(masterAng.map(e => e.Review_Type).map(kvMapper));
  }, []);

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

  const handleCaseInformationData = (name, value, persist) => {
    const newData = {...caseInformationData, [name]: typeof value === 'string' ? convertToCase(value) : value};
    setCaseInformationData(newData);
    if (persist) {
      props.setCaseInformationData(newData);
    }
  };
  const persistCaseInformationData = () => {
    props.setCaseInformationData(caseInformationData);
  }

  const wrapPlaceholder = (name, placeholder) => {
    const field = props.caseInformationValidationSchema?.fields?.[name];
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
                      onChange={(event) => handleCaseInformationData(name, event.target.value)}
                      onBlur={persistCaseInformationData}
                      value={caseInformationData[name]}
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
                        location.state.stageName === "Reopen" ||
                        location.state.stageName === "CaseArchived")
                }
                className="basic-multi-select"
                options={options}
                id={name}
                isMulti={false}
                onChange={(value) => handleCaseInformationData(name, value?.value, true)}
                value={caseInformationData[name] ? {
                  label: caseInformationData[name],
                  value: caseInformationData[name]
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
      <div className="accordion-item" id="caseInformationData">
        <h2
            className="accordion-Information"
            id="panelsStayOpen-Information"
        >
          <button
              className="accordion-button accordionButtonStyle"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#panelsStayOpen-collapseInformation"
              aria-expanded="true"
              aria-controls="panelsStayOpen-collapseOne"
          >
            Case Information
          </button>
        </h2>
        <div
            id="panelsStayOpen-collapseInformation"
            className="accordion-collapse collapse show"
            aria-labelledby="panelsStayOpen-Information"
        >
          <div className="accordion-body">
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {SelectField('Line_of_Business_LOB', 'Line of Business', lobValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("LOB_Description", "LOB Description", 300)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Claim_Number", "Claim Number", 16)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {SelectField('Product', 'Product', productValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField('Product_Type', 'Product Type', [
                  {label: "USER", value: "USER"}
                ])}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField('Product_State', 'Product State', productStateValues)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {SelectField('Appellant_Description', 'Appellant Description', appellantDescValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField('Appellant_Type', 'Appellant Type', appellantTypeValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField('Appeal_Type', 'Appeal Type', appealTypeValues)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {SelectField('Issue_Level', 'Issue Level', issueLevelValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {InputField("Issue_Description", "Issue Description", 4000)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField('Case_Level_Priority', 'Case Level Priority', caseLevelPriorityValues)}
              </div>
            </div>
            <div className="row my-2">
              <div className="col-xs-6 col-md-4">
                {SelectField('Review_Type', 'Review Type', reviewTypeValues)}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField('Denial_Type', 'Denial Type', [
                  {label: "USER", value: "USER"}
                ])}
              </div>
              <div className="col-xs-6 col-md-4">
                {SelectField('Research_Type', 'Research Type', [
                  {label: "USER", value: "USER"}
                ])}
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6 col-md-4">
                {InputField("Inbound_Email_ID", "Inbound Email ID", 4000)}
              </div>
            </div>
            <div className="row my-2"></div>
            <div className="case Collobaration">
              <p className="collobarationheader">Case Collabaration</p>
              <div className="row my-2">
                <div className="col-xs-6 col-md-4">
                  <p className="prevcase">Previous Case</p>
                </div>
                <div className="col-xs-6 col-md-4">
                  <a className="refTag" href="https://www.google.com">Duplicate/Related case(s)</a>
                </div>
                <div className="col-xs-6 col-md-4">
                  <a className="refTag" href="https://www.google.com">Redirect/ Case(S)</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
  )
}

export default CaseInformationAccordion;
