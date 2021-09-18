import * as yup from "yup";
import {
  BIRTHDAY_AGE_RESTRICTION,
  EMAIL_INVALID,
  EMAIL_MAXLENGTH,
  GENERIC_REQUIRED,
  FIRSTNAME_MAXLENGTH,
  LASTNAME_MINLENGTH,
  LASTNAME_MAXLENGTH,
  USERNAME_MAXLENGTH,
  USERNAME_MINLENGTH,
  USERNAME_REQUIRED,
} from "Helpers/Validation/messages";
import { phoneRegExp } from "Helpers/Validation/regex";
import moment from "moment";

const initialValues = {
  firstName: "",
  lastName: "",
  userName: "",
  dateOfBirth: "",
  email: "",
  phoneNumber: "",
  organizationUser: "",
};

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .max(80, FIRSTNAME_MAXLENGTH)
    .required(GENERIC_REQUIRED),
  lastName: yup
    .string()
    .min(2, LASTNAME_MINLENGTH)
    .max(80, LASTNAME_MAXLENGTH)
    .required(GENERIC_REQUIRED),
  userName: yup
    .string()
    .min(2, USERNAME_MINLENGTH)
    .max(80, USERNAME_MAXLENGTH)
    .required(USERNAME_REQUIRED),
  email: yup
    .string()
    .email(EMAIL_INVALID)
    .required(GENERIC_REQUIRED)
    .max(100, EMAIL_MAXLENGTH),
  phoneNumber: yup
    .string()
    .max(25, "Phone number can not be more than 150 characters.")
    .matches(phoneRegExp, "Phone number is not valid"),
  dateOfBirth: yup
    .date()
    .test("Age Restriction", BIRTHDAY_AGE_RESTRICTION, (value) =>
      value ? moment().diff(moment(value), "years") >= 13 : true
    )
    .required(GENERIC_REQUIRED),
  organizationUser: yup.string().required(GENERIC_REQUIRED),
});

export { validationSchema, initialValues };
