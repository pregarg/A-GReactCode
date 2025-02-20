import React from "react";
import ReactDatePicker from "react-datepicker";

export const SimpleDatePickerField = ({
  name,
  label,
  data,
  disabled,
  onChange,
  validationErrors,
}) => {
  const handleDateChange = (selectedDate) => {
    if (selectedDate) {
      const currentTime = new Date();
      selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
      onChange(selectedDate);
    }
  };

  return (
    <>
      <label htmlFor={name}>
        <strong>
          {label}
          {validationErrors?.[name] ? " *" : ""}
        </strong>
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
          name={name}
          onChange={handleDateChange}
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          timeFormat="h:mm"  
          dateFormat="MM/dd/yyyy h:mm" 
          dropdownMode="select"
          id={name}
          disabled={disabled}
        />
      </div>
      {validationErrors?.[name] && (
        <div
          className="invalid-feedback"
          style={{ display: "block", fontSize: "12px" }}
        >
          {validationErrors[name]}
        </div>
      )}
    </>
  );
};
