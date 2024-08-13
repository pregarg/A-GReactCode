import { Field } from "formik";
import Select, { components } from "react-select";
import React from "react";

const selectStyle = {
  control: (provided) => ({
    ...provided,
    height: "58px",
    fontWeight: 300,
    color: "hsl(0, 0%, 50%)",
  }),
  menuList: (provided) => ({
    ...provided,
    maxHeight: 200,
  }),
  menu: (provided) => ({
    ...provided,
    zIndex: 9999,
  }),
  container: (provided, state) => ({
    ...provided,
    marginTop: 0,
    borderRadius: "0.25rem",
  }),
  valueContainer: (provided, state) => {
    if (
      state.getValue()?.length &&
      state.getValue()[0].label &&
      state.getValue()[0].value
    ) {
      return {
        ...provided,
        position: "relative",
        top: 8,
        overflow: "visible",
        fontWeight: 300,
        color: "hsl(0deg 0% 57.65%)",
      };
    }
    return {
      ...provided,
      overflow: "visible",
    };
  },
  placeholder: (provided, state) => {
    if (
      state.getValue()?.length &&
      state.getValue()[0].label &&
      state.getValue()[0].value
    ) {
      return {
        ...provided,
        position: "absolute",
        top: -14,
        fontSize: 12,
        color: "hsl(0deg 0% 57.65%)",
        fontWeight: 300,
        fontFamily: "Open Sans, sans-serif",
      };
    }
    return {
      ...provided,
      position: "absolute",
      left: 0,
    };
  },
  singleValue: (styles) => ({ ...styles, textAlign: "left" }),
  option: (provided, state) => ({
    ...provided,
    textAlign: "left",
  }),
};

export const FormikSelectField = ({
  name,
  placeholder,
  options,
  disabled,
  data,
  onChange,
  schema,
  errors,
  displayErrors,
}) => {
  const wrapPlaceholder = (name, placeholder) => {
    const field = schema?.fields?.[name];
    const required =
      (field?.type === "date" && field?.internalTests?.optionality) ||
      field?.tests?.some((test) => test.OPTIONS?.name === "required");
    return `${placeholder}${required ? " *" : ""}`;
  };
  const { ValueContainer, Placeholder } = components;
  const CustomValueContainer = ({ children, ...props }) => {
    return (
      <ValueContainer {...props}>
        <Placeholder {...props} isFocused={props.isFocused}>
          {props.selectProps.placeholder}
        </Placeholder>
        {React.Children.map(children, (child) =>
          child && child.type !== Placeholder ? child : null,
        )}
      </ValueContainer>
    );
  };
  return (
    <>
      <Field name={name}>
        {() => (
          <div className="form-floating">
            <Select
              styles={{ ...selectStyle }}
              components={{
                ValueContainer: CustomValueContainer,
              }}
              isClearable
              isDisabled={disabled}
              className={`${errors[name] && displayErrors ? "is-invalid" : data[name] ? "is-valid" : ""}`}
              options={options}
              id={name}
              isMulti={false}
              onChange={(value) => onChange(name, value?.value, true)}
              value={
                data[name]
                  ? {
                      label: data[name],
                      value: data[name],
                    }
                  : undefined
              }
              placeholder={wrapPlaceholder(name, placeholder)}
              isSearchable={
                document.documentElement.clientHeight <=
                document.documentElement.clientWidth
              }
            />
            {errors[name] && displayErrors && (
              <div
                className="invalid-feedback"
                style={{ display: "block", fontSize: "12px" }}
              >
                {errors[name]}
              </div>
            )}
          </div>
        )}
      </Field>
    </>
  );
};
