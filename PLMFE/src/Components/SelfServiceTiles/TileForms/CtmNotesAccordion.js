import React, { useState, useEffect } from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";
import { FormikInputField } from "../Common/FormikInputField";
import { useLocation } from "react-router-dom";
import { FormikDatePicker } from "../Common/FormikDatePicker";
import { FormikSelectField } from "../Common/FormikSelectField";
import { useSelector } from "react-redux";

const CtmNotesAccordion = (props) => {
  const { convertToCase } = useGetDBTables();
  const location = useLocation();
  const [ctmNotesData, setCtmNotesData] = useState(props.ctmNotesData);
  const ctmSendToHPMSSelector = useSelector(
    (state) => state?.masterCtmSendToHPMS,
  );
  const persistCtmNotesData = () => {
    props.setCtmNotesData(ctmNotesData);
  };

  const handleCtmNotesChange = (name, value, persist) => {
    const newData = {
      ...ctmNotesData,
      [name]: typeof value === "string" ? convertToCase(value) : value,
    };
    setCtmNotesData({ ...newData });
    if (persist) {
      props.setCtmNotesData({ ...newData });
    }
  };

  const renderInputField = (name, placeholder, maxLength, type = "text") => (
    <div className="col-xs-6 col-md-4">
      <FormikInputField
        name={name}
        placeholder={placeholder}
        maxLength={maxLength}
        type={type}
        data={ctmNotesData}
        onChange={handleCtmNotesChange}
//        disabled={location.state.stageName === "CaseArchived"}
        persist={persistCtmNotesData}
        schema={props.ctmNotesValidationSchema}
        displayErrors={props.shouldShowSubmitError}
        errors={props.ctmNotesErrors}
      />
    </div>
  );
  const renderSelectField = (name, placeholder, options) => (
      <div className="col-xs-6 col-md-4">
        <FormikSelectField
          name={name}
          placeholder={placeholder}
//          options={Array.isArray(options)
//            ? options.map(opt => (typeof opt === "string" ? { value: opt, label: opt } : opt))
//            : []}
          options={options}
          data={ctmNotesData}
          onChange={handleCtmNotesChange}
          persist={persistCtmNotesData}
          schema={props.ctmNotesValidationSchema}
          displayErrors={props.shouldShowSubmitError}
          errors={props.ctmNotesErrors}
        />
      </div>
    );

const [sendToHPMSValues, setSendToHPMSValues] = useState([]);
useEffect(() => {
    const kvMapper = (e) => ({
      label: convertToCase(e),
      value: convertToCase(e),
    });


    const ctmSendToHPMS = ctmSendToHPMSSelector?.[0] || [];
    setSendToHPMSValues(ctmSendToHPMS.map((e) => e.Send_to_HPMS).map(kvMapper));

  }, []);
  return (
    <div>
      <div className="accordion-item" id="ctmNotesInformation">
        <h2 className="accordion-header" id="panelsStayOpen-ctmNotesInformation">
          <button
            className="accordion-button accordionButtonStyle"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#panelsStayOpen-collapsectmNotesInformation"
            aria-expanded="true"
            aria-controls="panelsStayOpen-collapsectmNotesInformation"
          >
            Notes
          </button>
        </h2>
        <div
          id="panelsStayOpen-collapseacknowledgementInformation"
          className="accordion-collapse collapse show"
          aria-labelledby="panelsStayOpen-acknowledgementInformation"
        >
          <div className="accordion-body">
            <div className="row my-2">
              {renderInputField("Plan_Case_Notes", "Plan Case Notes",50)}
              {renderInputField("Case_Notes", "Case Notes",50)}

               {renderSelectField( "Send_to_HPMS",
                               "Send to HPMS",
                               sendToHPMSValues,
                             )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CtmNotesAccordion;
