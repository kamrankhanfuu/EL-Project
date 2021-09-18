import * as yup from "yup";
import moment from "moment";
import { genericRequired } from "Helpers/Validation";
import { GENERIC_REQUIRED } from "Helpers/Validation/messages";

const initialValues = ({
  endDate,
  startDate,
  name,
  description,
  location,
  minAttendees,
  maxAttendees,
}) => ({
  name: name || "",
  description: description || "",
  location: location || "",
  startTime: startDate ? moment(startDate) : "",
  endTime: endDate ? moment(endDate) : "",
  minAttendees: minAttendees || 0,
  maxAttendees: maxAttendees || 0,
});

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required(GENERIC_REQUIRED)
    .max(250, "Name can not be more than 250 characters."),
  description: yup
    .string()
    .required(GENERIC_REQUIRED)
    .max(500, "Description can not be more than 500 characters."),
  location: yup
    .string()
    .optional()
    .max(300, "Sitename can not be more than 300 characters."),
  startTime: genericRequired,
  endTime: genericRequired,
  minAttendees: yup
    .number()
    .typeError("Minimum Participants must be a number")
    .required(GENERIC_REQUIRED),
  maxAttendees: yup
    .number()
    .typeError("Maximum Participants must be a number")
    .when(
      "minAttendees",
      (minAttendees, schema) =>
        minAttendees &&
        schema.min(
          minAttendees,
          `Maximum number of Participants must be more than ${minAttendees}`
        )
    )
    .required(GENERIC_REQUIRED),
});

export { initialValues, validationSchema };
