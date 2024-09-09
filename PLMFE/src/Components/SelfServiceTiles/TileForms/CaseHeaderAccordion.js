import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { chunkArray, RenderType } from "./Constants"

const CaseHeaderAccordion = (props) => {
  const { convertToCase } = useGetDBTables();

  const [caseHeaderData, _] = useState(props.handleData);

  const headerFields = [
    [
      { key: "Case ID", value: "caseNumber",renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE] },
      //{key: 'Sub Case ID', value: 'Subcase_ID'},
      { key: "Case Owner", value: "Case_Owner",renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE]},
      { key: "Case Status", value: "Case_Status",renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE] },
    ],
    [
      { key: "Case Received Date", value: "Case_Received_Date#date", renderTypes: [RenderType.APPEALS]},
      { key: "Case Due Date", value: "Case_Due_Date",renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE] },
      { key: "Internal Due Date", value: "Internal_Due_Date",renderTypes: [RenderType.APPEALL] },
    ],
    [
      { key: "Case Validation", value: "Case_Validation",renderTypes: [RenderType.APPEALL] },
      { key: "Extended Case Due Date", value: "Extended_Case_Due_Date",renderTypes: [RenderType.APPEALL] },
      { key: "White Glove Indicator", value: "White_Glove_Indicator",renderTypes: [RenderType.APPEALS, RenderType.PROVIDER_DISPUTE] },
    ],
    [
    { key: "Environmental Description", value: "Environmental_Description",renderTypes: [RenderType.APPEALL] },
    { key: "Alert Indicator", value: "Alert_Indicator",renderTypes: [RenderType.PROVIDER_DISPUTE] },
    { key: "Goal Deadline", value: "Goal_Deadline",renderTypes: [RenderType.PROVIDER_DISPUTE] },
  ],
  [
    { key: "Original Case Received Date", value: "Original_Case_Received_Date",renderTypes: [RenderType.APPEALL] },
  ]
    
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
        {/* <div className="accordion-body">
          {chunkArray(headerFields, 3 ,(e) =>
                  e.renderTypes.includes(props.renderType),
                   
          ).map((chunk) => (
            <div className="row my-2">
              {chunk.map((el) => (
                
                <div className="col-xs-6 col-md-4 case-field-wrapper">
                  <span>{el.key}: </span>
                  <span>{convertToCase(caseHeaderData?.[el?.value])}</span>
                </div>
              ))}
            </div>
          ))}
        </div> */}


      </div>
    </div>
  );
};

export default CaseHeaderAccordion;
