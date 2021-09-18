import * as yup from "yup";
import {
  EMAIL_REQUIRED,
  STRONG_PASSWORD,
  PASSWORD_REQUIRED,
  USERNAME_MINLENGTH,
  USERNAME_MAXLENGTH,
  USERNAME_REQUIRED,
  FIRSTNAME_MINLENGTH,
  FIRSTNAME_MAXLENGTH,
  FIRSTNAME_REQUIRED,
  LASTNAME_MINLENGTH,
  LASTNAME_MAXLENGTH,
  LASTNAME_REQUIRED,
  PASSWORD_MINLENGTH,
  PASSWORD_MAXLENGTH,
  PASSWORD_NOMATCH,
  PASSWORD_CONFIRM,
  BIRTHDAY_AGE_RESTRICTION,
  EMAIL_INVALID,
  EMAIL_MAXLENGTH,
} from "Helpers/Validation/messages";
import { strongPwd } from "Helpers/Validation/regex";
import moment from "moment";

const initialValues = {
  userName: "",
  firstName: "",
  lastName: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
  birthdate: "",
  email: "",
};

const validationSchema = yup.object().shape({
  userName: yup
    .string()
    .min(2, USERNAME_MINLENGTH)
    .max(80, USERNAME_MAXLENGTH)
    .required(USERNAME_REQUIRED),
  firstName: yup
    .string()
    .min(2, FIRSTNAME_MINLENGTH)
    .max(80, FIRSTNAME_MAXLENGTH)
    .required(FIRSTNAME_REQUIRED),
  lastName: yup
    .string()
    .min(2, LASTNAME_MINLENGTH)
    .max(80, LASTNAME_MAXLENGTH)
    .required(LASTNAME_REQUIRED),
  password: yup
    .string()
    .min(8, PASSWORD_MINLENGTH)
    .max(32, PASSWORD_MAXLENGTH)
    .matches(strongPwd, STRONG_PASSWORD)
    .required(PASSWORD_REQUIRED),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], PASSWORD_NOMATCH)
    .required(PASSWORD_CONFIRM),
  agreeTerms: yup.bool(),
  email: yup
    .string()
    .email(EMAIL_INVALID)
    .required(EMAIL_REQUIRED)
    .max(100, EMAIL_MAXLENGTH),
  dateOfBirth: yup
    .date()
    .test("Age Restriction", BIRTHDAY_AGE_RESTRICTION, (value) =>
      value ? moment().diff(moment(value), "years") >= 13 : true
    ),
});

export { validationSchema, initialValues };
