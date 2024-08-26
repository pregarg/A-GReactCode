import React from "react";
import Select from "react-select";
import useGetDBTables from "../../CustomHooks/useGetDBTables";

export const SimpleSelectField = ({
  name,
  label,
  options,
  data,
  disabled,
  onChange,
  validationErrors,
}) => {
  return (
    <>
      <label>
        <strong>{label}{validationErrors?.[name] ? ' *' : ''}</strong>
      </label>
      <Select
        styles={{
          control: (provided) => ({
            ...provided,
            fontWeight: "lighter",
          }),
        }}
        value={
          data?.[name]?.label !== undefined
            ? data?.[name]
            : {
                label: data?.[name],
                value: data?.[name],
              }
        }
        onChange={(selectValue, event) => onChange(selectValue?.value, event)}
        options={options}
        name={name}
        id={name}
        isDisabled={disabled}
        isClearable
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
