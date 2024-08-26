import { Field } from "formik";
import React from "react";

export const FormikInputField = ({
  name,
  placeholder,
  maxLength,
  disabled,
  data,
  persist,
  onChange,
  schema,
  errors,
  displayErrors,
}) => {
  const wrapPlaceholder = (name, placeholder) => {
    return `${placeholder}${errors?.[name] ? ' *' : ''}`;
  };
  return (
    <>
      <Field name={name}>
        {() => (
          <div className="form-floating">
            <input
              maxLength={maxLength}
              type="text"
              id={name}
              autoComplete="off"
              className={`form-control ${errors[name] && displayErrors ? "is-invalid" : data[name] ? "is-valid" : ""}`}
              placeholder={wrapPlaceholder(name, placeholder)}
              onChange={(event) => onChange(name, event.target.value)}
              onBlur={persist}
              value={data[name]}
              disabled={disabled}
            />
            <label htmlFor="floatingInputGrid">
              {wrapPlaceholder(name, placeholder)}
            </label>
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
