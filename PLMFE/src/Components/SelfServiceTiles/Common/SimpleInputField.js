import React from "react";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export const SimpleInputField = ({
  name,
  label,
  maxLength,
  data,
  disabled,
  onChange,
  validationErrors,
}) => {
  const { convertToCase } = useGetDBTables();
  return (
    <>
      <label htmlFor={name}>
        <strong>{label}</strong>
      </label>
      <input
        id={name}
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
