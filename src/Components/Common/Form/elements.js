import React from "react";
import classnames from "classnames";
import { Input as StrapInput, Label, FormGroup } from "reactstrap";
// react plugin used to create DropdownMenu for selecting items
import ReactSelect from "react-select";
import ReactAsyncSelect from "react-select/async";
// react plugin used to create datetimepicker
import ReactDatetime from "react-datetime";
import { errorMessage } from "Helpers/Validation";
import { Field } from "formik";
import moment from "moment";

const Input = ({ field, form, ...props }) => (
  <StrapInput {...field} {...props} />
);

const Select = ({ field, form, ...props }) => (
  <ReactSelect
    {...field}
    {...props}
    onChange={(option) => form.setFieldValue(field.name, option)}
    className="react-select react-select-primary"
    classNamePrefix="react-select"
    defaultValue={[]}
  />
);

const AsyncSelect = ({ field, form, ...props }) => {
  const loadOptions = (inputValue) =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(props.filterOrganizations(inputValue));
      }, 1000);
    });

  return (
    <ReactAsyncSelect
      {...field}
      {...props}
      cacheOptions
      loadOptions={loadOptions}
      onChange={(option) => {
        form.setFieldValue(field.name, option);
      }}
      className="react-select react-select-primary"
      classNamePrefix="react-select"
    />
  );
};

const DatePicker = ({ field, form, ...props }) => {
  return (
    <ReactDatetime
      // {...field}
      {...props}
      inputProps={{
        className: "form-control",
        placeholder: "Select...",
      }}
      value={field.value}
      name={field.name}
      timeFormat={false}
      closeOnSelect={true}
      selected={field.value ? new Date(field.value) : null}
      onChange={(val) => {
        if (moment(val).isValid()) form.setFieldValue(field.name, val);
        else form.setFieldValue(field.name, "");
      }}
    />
  );
};

const RadioGroup = ({ options, field, form, ...props }) => {
  return (
    <div className="d-flex">
      {options.map((option, index) => (
        <FormGroup
          check
          className={classnames("mr-3", {
            "form-check-radio": !props.checkbox,
            "form-check-checkbox": props.checkbox,
          })}
          key={index}
        >
          <Label check>
            {option.value === field.value ? (
              <StrapInput
                type={props.checkbox ? "checkbox" : "radio"}
                {...field}
                {...props}
                onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                value={option.value}
                defaultChecked
              />
            ) : (
              <StrapInput
                type={props.checkbox ? "checkbox" : "radio"}
                {...field}
                {...props}
                onChange={(e) => form.setFieldValue(field.name, e.target.value)}
                value={option.value}
              />
            )}
            <span className="form-check-sign" />
            {option.label}
          </Label>
        </FormGroup>
      ))}
    </div>
  );
};

const CustomInput = ({ label, value, hasError, ...props }) => (
  <FormGroup
    className={classnames("has-label", {
      "has-danger": hasError,
    })}
  >
    <label>{label}</label>
    <Field component={Input} name={value} maxLength={80} {...props} />
    {errorMessage(value)}
  </FormGroup>
);

const TimePicker = ({ field, form, ...props }) => {
  const ref = React.useRef();
  return (
    <ReactDatetime
      {...props}
      inputProps={{
        className: "form-control",
        placeholder: "Select...",
      }}
      value={field.value}
      name={field.name}
      dateFormat={false}
      closeOnSelect={true}
      inputRef={ref}
      locale="sv-sv"
      onChange={(val) => {
        if (moment(val).isValid()) form.setFieldValue(field.name, val);
        else form.setFieldValue(field.name, "");
      }}
    />
  );
};

export {
  Input,
  Select,
  RadioGroup,
  DatePicker,
  CustomInput,
  AsyncSelect,
  TimePicker,
};
