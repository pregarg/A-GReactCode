import React from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export const SimpleInputField = ({name, label, maxLength, data, disabled, onChange}) => {
  const { convertToCase } = useGetDBTables();
  return <>
    <label>{label}</label>
    <br/>
    <input
        type="text"
        value={
          data?.[name]?.value
              ? convertToCase(data[name].value)
              : convertToCase(data?.[name])
        }
        onChange={onChange}
        name={name}
        className="form-control"
        maxLength={maxLength}
        disabled={disabled}
    />
  </>
}