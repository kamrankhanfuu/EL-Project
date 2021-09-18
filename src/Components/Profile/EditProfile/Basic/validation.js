import * as yup from 'yup';
import {
  GENERIC_REQUIRED,
  EMAIL_INVALID,
  BIRTHDAY_AGE_RESTRICTION,
} from 'Helpers/Validation/messages';
import moment from 'moment';
import { phoneRegExp } from 'Helpers/Validation/regex';

const initialValues = (details) => ({
  firstName: details.firstName || '',
  lastName: details.lastName || '',
  userName: details.userName || '',
  age: moment().diff(moment(details.dateOfBirth), 'years'),
  dateOfBirth: details.dateOfBirth ? new Date(details.dateOfBirth) : '',
  phoneNumber: details.phoneNumber || '',
  personalEmail: details.personalEmail || '',
  workEmail: details.workEmail || '',
  profileDescription: details.profileDescription || '',
  avatar: details.avatar || '',
  fileName: details.fileName || '',
  userContact: details.userContact
    ? [
        {
          addressLine1: details.userContact.addressLine1,
          addressLine2: details.userContact.addressLine2,
          city: details.userContact.city,
          state: details.userContact.state,
          postalCode: details.userContact.postalCode,
        },
      ]
    : [
        {
          addressLine1: '',
          addressLine2: '',
          city: '',
          state: '',
          postalCode: '',
        },
      ],
});

const validationSchema = yup.object().shape({
  firstName: yup
    .string()
    .trim()
    .required(GENERIC_REQUIRED)
    .max(80, 'First Name can not be more than 250 characters.'),
  lastName: yup
    .string()
    .trim()
    .required(GENERIC_REQUIRED)
    .max(80, 'Last Name can not be more than 250 characters.'),
  personalEmail: yup
    .string()
    .email(EMAIL_INVALID)
    .required(GENERIC_REQUIRED)
    .max(150, 'Personal email can not be more than 150 characters.'),
  workEmail: yup
    .string()
    .email(EMAIL_INVALID)
    .optional()
    .max(150, 'Work email can not be more than 150 characters.'),
  dateOfBirth: yup
    .date()
    .test('Age Restriction', BIRTHDAY_AGE_RESTRICTION, (value) =>
      value ? moment().diff(moment(value), 'years') >= 13 : true
    )
    .required(GENERIC_REQUIRED),
  phoneNumber: yup
    .string()
    .max(15)
    .matches(phoneRegExp, 'Phone number is not valid')
    .optional(),
  profileDescription: yup
    .string()
    .trim()
    .max(150, 'Only 150 characters allowed!')
    .required(GENERIC_REQUIRED),
  userContact: yup.array().of(
    yup.object().shape({
      addressLine1: yup
        .string()
        .max(250, 'Address Line 1 can not be more than 250 characters.'),
      addressLine2: yup
        .string()
        .max(100, 'Address Line 2 can not be more than 100 characters.'),
      city: yup.string().max(150, 'City can not be more than 150 characters.'),
      postalCode: yup
        .string()
        .max(15, 'Postal code can not be more than 15 characters.')
        .optional(),
    })
  ),
});

export { initialValues, validationSchema };
