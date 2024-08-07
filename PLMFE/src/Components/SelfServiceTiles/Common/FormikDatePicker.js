import React from "react";
import ReactDatePicker from "react-datepicker";

export const FormikDatePicker = ({name, placeholder, label, disabled, data, onChange, schema, errors}) => {
  const wrapPlaceholder = (name, placeholder) => {
    const field = schema?.fields?.[name];
    const required = (field?.type === 'date' && field?.internalTests?.optionality) ||
        (field?.tests?.some(test => test.OPTIONS?.name === 'required'));
    return `${placeholder}${required ? ' *' : ''}`;
  };
  const CustomInput = (props) => (
      <div className="form-floating">
        <input {...props} autoComplete="off" placeholder={wrapPlaceholder(name, placeholder)}
               className={`form-control ${errors[name] ? "is-invalid" : data[name] ? "is-valid" : ""}`} />
        <label htmlFor={name}>{wrapPlaceholder(name, label)}</label>
      </div>
  );
  const dateValue = data[name + "#date"] ? new Date(data[name + "#date"]) : data[name];
  return (
      <div>
        <ReactDatePicker
            id={name}
            className="form-control example-custom-input-provider"
            selected={dateValue}
            name={name}
            dateFormat="MM/dd/yyyy"
            onChange={(date, event) => onChange(name, date, true)}
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
            disabled={disabled}
        />
        {errors[name] && (
            <div
                className="invalid-feedback"
                style={{display: "block", fontSize: "12px"}}
            >
              {errors[name]}
            </div>
        )}
      </div>
  )
};