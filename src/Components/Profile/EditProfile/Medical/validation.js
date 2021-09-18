import * as yup from "yup";
import { phoneRegExp } from "Helpers/Validation/regex";

const initialValues = (details, relationship, guardians) => ({
  healthIssue: details.healthIssue || "",
  emergencyContacts:
    details.emergencyContacts && details.emergencyContacts.length
      ? [
          {
            ...details.emergencyContacts[details.emergencyContacts.length - 1],
          },
        ].map((data) => {
          data.relation = relationship.filter(
            (option) => option.id === data.relationship
          )[0];
          data.guardians = guardians.filter(
            (option) => option.id === data.name
          )[0];
          return data;
        })
      : [
          {
            guardians: "",
            number: "",
            relation: 0,
          },
        ],
});

const validationSchema = yup.object().shape({
  emergencyContacts: yup.array().of(
    yup.object().shape({
      number: yup
        .string()
        .max(15, "Number must be less than or equal to 15 characters!")
        .matches(phoneRegExp, "Phone number is not valid")
        .optional(),
      healthIssue: yup
        .string()
        .max(500, "Health Issues can not be more than 500 characters."),
    })
  ),
});

export { initialValues, validationSchema };
