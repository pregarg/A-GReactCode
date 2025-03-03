import React from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export const FormikDatePicker = ({
  name,
  placeholder,
  label,
  disabled,
  data,
  onChange,
  schema,
  errors,
  displayErrors,
}) => {
  const wrapPlaceholder = (name, placeholder) => {
    return (
      <>
        {placeholder}
        {errors?.[name] ? <span className="required"> *</span> : ""}
      </>
    );
  };

  const CustomInput = (props) => (
    <div className="form-floating">
      <input
        {...props}
        autoComplete="off"
        placeholder={wrapPlaceholder(name, placeholder)}
        className={`form-control ${errors[name] && displayErrors ? "is-invalid" : data[name] ? "is-valid" : ""}`}
      />
      <label htmlFor={name}>{wrapPlaceholder(name, label)}</label>
    </div>
  );

  const dateValue = data[name + "#date"]
    ? new Date(data[name + "#date"])
    : data[name]
    ? new Date(data[name])
    : undefined;

  // const handleDateChange = (selectedDate) => {
  //   if (selectedDate) {
  //     // Retain the selected date but update time to current time
  //     const currentTime = new Date();
  //     selectedDate.setHours(currentTime.getHours(), currentTime.getMinutes(), currentTime.getSeconds());
      
  //     onChange(name, selectedDate, true);
  //     console.log("name--->",name)
  //     console.log("selected date-->",selectedDate)
    
  //   }
  // };
//  const handleDateChange = (selectedDate) => {
//    if (selectedDate) {
//      try {
//        // Retain the selected date but update time to current time in local timezone
//        const now = new Date();
//        selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());
//
//        onChange(name, selectedDate, true);
//        console.log("name--->", name);
//        console.log("selected date-->", selectedDate);
//      } catch (error) {
//        console.error("Error in handleDateChange:", error);
//      }
//    }
//  };
const handleDateChange = (selectedDate) => {
  try {
    if (selectedDate) {
      // Retain the selected date but update time to current time in local timezone
      const now = new Date();
      selectedDate.setHours(now.getHours(), now.getMinutes(), now.getSeconds());

      onChange(name, selectedDate, true);
      console.log("name--->", name);
      console.log("selected date-->", selectedDate);
    } else {
      // Handle clearing the date
      onChange(name, null, true);
      console.log("Cleared date for:", name);
    }
  } catch (error) {
    console.error("Error in handleDateChange:", error);
  }
};


  return (
    <div>
      <ReactDatePicker
        id={name}
        className="form-control example-custom-input-provider"
        selected={dateValue}
        name={name}
        dateFormat="MM/dd/yyyy h:mm aa"
        timeFormat="h:mm aa"
        // onSelect={(date) => onChange(name, date, true)}
        // onChange={(date) => onChange(name, date, true)}
         onChange={handleDateChange}
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
        customInput={<CustomInput />}
        disabled={disabled}
      />
      {errors[name] && displayErrors && (
        <div className="invalid-feedback" style={{ display: "block", fontSize: "12px" }}>
          {errors[name]}
        </div>
      )}
    </div>
  );
};
