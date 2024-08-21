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
  const { convertToCase } = useGetDBTables();
  return (
    <>
      <label>
        <strong>{label}</strong>
      </label>
      <Select
        styles={{
          control: (provided) => ({
            ...provided,
            fontWeight: "lighter",
          }),
        }}
        value={data?.[name]}
        onChange={onChange}
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
