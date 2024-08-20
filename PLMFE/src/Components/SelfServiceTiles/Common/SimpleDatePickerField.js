import React from "react";
import ReactDatePicker from "react-datepicker";

export const SimpleDatePickerField = ({
  name,
  label,
  data,
  disabled,
  onChange,
}) => {
  return (
    <>
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
      <div className="form-floating">
        <ReactDatePicker
          className="form-control example-custom-input-modal"
          selected={
            data?.[name]?.value
              ? new Date(data[name].value)
              : data?.[name]
                ? new Date(data[name])
                : null
          }
          name="Auth_Request_Date"
          onChange={onChange}
          peekNextMonth
          showMonthDropdown
          onKeyDown={(e) => e.preventDefault()}
          showYearDropdown
          dropdownMode="select"
          dateFormat="MM/dd/yyyy"
          id={name}
          disabled={disabled}
        />
      </div>
    </>
  );
};
