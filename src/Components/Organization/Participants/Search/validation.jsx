import * as yup from "yup";
import {
  USERNAME_MAXLENGTH,
  FIRSTNAME_MAXLENGTH,
  LASTNAME_MAXLENGTH,
  LASTNAME_MINLENGTH,
  LASTNAME_REQUIRED,
  BIRTHDAY_AGE_RESTRICTION,
  GENERIC_MAXLENGTH,
  USERNAME_REQUIRED,
  STATE_REQUIRED,
  SSN_REQUIRED,
} from "Helpers/Validation/messages";
import moment from "moment";

// NOTE: Took from https://ihateregex.io/expr/phone/
const PHONE_REGEX = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;

const initialValues = {
  username: "",
  firstName: "",
  lastName: "",
  birthDate: "",
  ssn: "",
  address: "",
  phone: "",
};

const validationSchema = yup.object().shape({
  firstName: yup.string().max(80, FIRSTNAME_MAXLENGTH),
  lastName: yup
    .string()
    .min(3, LASTNAME_MINLENGTH)
    .max(80, LASTNAME_MAXLENGTH)
    .test(
      'validate-lastname',
      LASTNAME_REQUIRED,
      function(value = '') {
        const { ssn = '', username = '' } = this.parent;
        return (
          ((ssn !== '' && username !== '') || value !== '') ||
          ((ssn !== '' || username !== '')) ||
          value !== ''
        );
      }
    ),
  ssn: yup
    .string()
    .max(100, GENERIC_MAXLENGTH)
    .when(['lastName', 'username'], {
      is: (lastName = '', username = '') => {
        return lastName === '' && username === '';
      },
      then: yup.string().required(SSN_REQUIRED),
    }),
  address: yup
    .string()
    .ensure()
    .when('lastName', {
      is: (lastName = '') => lastName !== '',
      then: yup.string().required(STATE_REQUIRED),
    }),
  username: yup
    .string()
    .max(80, USERNAME_MAXLENGTH)
    .test(
      'validate-username',
      USERNAME_REQUIRED,
      function(value = '') {
        const { lastName = '', ssn = '' } = this.parent;
        return (
          ((lastName !== '' && ssn !== '') || value !== '') ||
          ((lastName !== '' || ssn !== '')) ||
          value !== ''
        );
      }
    ),
  phone: yup.string().matches(PHONE_REGEX, {
    message: "You should enter a valid phone number",
  }),
  birthDate: yup
    .date()
    .test("Age Restriction", BIRTHDAY_AGE_RESTRICTION, (value) =>
      value ? moment().diff(moment(value), "years") >= 13 : true
    ),
});

export { validationSchema, initialValues };
