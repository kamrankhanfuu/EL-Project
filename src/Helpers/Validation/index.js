import React from "react";
import * as yup from "yup";
import { ErrorMessage } from "formik";
import {
  GENERIC_REQUIRED,
  GENERIC_MAXLENGTH,
  POSTALCODE_REQUIRED,
  ZIPCODE_MAXLENGTH,
  TEXTAREA_MAXLENGTH,
} from "./messages";

const errorMessage = (name) => (
  <ErrorMessage name={name}>
    {(msg) => <label className="error">{msg}</label>}
  </ErrorMessage>
);

const genericRequired = yup
  .string()
  .required(GENERIC_REQUIRED)
  .max(80, GENERIC_MAXLENGTH);

const postalCodeRequired = yup
  .string()
  .required(POSTALCODE_REQUIRED)
  .max(6, ZIPCODE_MAXLENGTH);

const optionalField = yup.string();

const textAreaRequired = yup
  .string()
  .required(GENERIC_REQUIRED)
  .max(5000, TEXTAREA_MAXLENGTH);

export { errorMessage, genericRequired, optionalField, textAreaRequired, postalCodeRequired };
