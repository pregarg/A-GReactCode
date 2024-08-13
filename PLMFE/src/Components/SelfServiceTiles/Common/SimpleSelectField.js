import React from "react";
import Select from "react-select";

export const SimpleSelectField = ({
  name,
  label,
  options,
  data,
  disabled,
  onChange,
}) => {
  return (
    <>
      <label>Auth Type Description</label>
      <br />
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
    </>
  );
};
