import React, { useState } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import "./Appeals.css";
import { chunkArray, RenderType } from "./Constants";

const CaseHeaderAccordion = (props) => {
  const { convertToCase } = useGetDBTables();

  const [caseHeaderData, _] = useState(props.handleData);

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
          {chunkArray(props.caseHeaderFields, 3).map((chunk) => (
            <div className="row">
              {chunk.map((el) => (
                <div className="col-xs-6 col-md-4 case-field-wrapper">
                  <span>{el.placeholder}: </span>
                  <span>{convertToCase(caseHeaderData?.[el?.name])}</span>
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
