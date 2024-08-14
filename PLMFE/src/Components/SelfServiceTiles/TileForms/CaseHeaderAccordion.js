import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";

const CaseHeaderAccordion = (props) => {
  const { convertToCase } = useGetDBTables();

  const [caseHeaderData, _] = useState(props.handleData);

  const headerFields = [
    [
      { key: "Case ID", value: "caseNumber" },
      //{key: 'Sub Case ID', value: 'Subcase_ID'},
      { key: "Case Owner", value: "Case_Owner" },
      { key: "Case Status", value: "Case_Status" },
    ],
    [
      { key: "Case Received Date", value: "Case_Received_Date#date" },
      { key: "Case Due Date", value: "Case_Due_Date" },
      { key: "Internal Due Date", value: "Internal_Due_Date" },
    ],
    [
      { key: "Case Validation", value: "Case_Validation" },
      { key: "Extended Case Due Date", value: "Extended_Case_Due_Date" },
      { key: "White Glove Indicator", value: "White_Glove_Indicator" },
    ],
    [{ key: "Environmental Description", value: "Environmental_Description" }],
  ];

  return (
    <div className="accordion-item" id="caseHeader">
      <h2 className="accordion-header" id="panelsStayOpen-Header">
        <button
          className="accordion-button accordionButtonStyle no-arrow"
          type="button"
        >
          Case Header
        </button>
      </h2>
      <div
        className="accordion-collapse show"
        aria-labelledby="panelsStayOpen-Header"
      >
        <div className="accordion-body">
          {headerFields.map((arr) => (
            <div className="row">
              {arr.map((el) => (
                <div className="col-xs-6 col-md-4 case-field-wrapper">
                  <span>{el.key}: </span>
                  <span>{convertToCase(caseHeaderData?.[el?.value])}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseHeaderAccordion;
