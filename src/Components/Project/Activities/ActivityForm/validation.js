import * as yup from "yup";
import moment from "moment";
import { GENERIC_REQUIRED } from "Helpers/Validation/messages";
import { genericRequired } from "Helpers/Validation";

const initialValues = ({
  name,
  description,
  location,
  startDate,
  endDate,
  minAttendees,
  maxAttendees,
  isOnetime,
  assignedStaff,
  organizationIds,
  type,
}) => ({
  name: name || "",
  description: description || "",
  location: location || "",
  startDate: startDate ? moment(startDate) : "",
  endDate: !isOnetime && endDate ? moment(endDate) : "",
  minAttendees: minAttendees || "",
  maxAttendees: maxAttendees || "",
  recurrence: isOnetime ? "One Time" : "Recurring",
  assignedStaff: assignedStaff || "",
  organizationIds: organizationIds || "",
  startTime: endDate ? moment(startDate) : "",
  endTime: endDate ? moment(endDate) : "",
  recurrenceType: "",
  ends: "",
  type: type || "",
});

const validationSchema = yup.object().shape({
  name: yup.string().required(GENERIC_REQUIRED),
  // .max(250, "Name can not be more than 250 characters.")
  description: yup.string().required(GENERIC_REQUIRED),
  // .max(500, "Description can not be more than 500 characters.")
  location: yup.string().optional(),
  // .max(300, "Sitename can not be more than 300 characters.")
  startDate: yup.date().required(GENERIC_REQUIRED),
  recurrence: genericRequired,
  assignedStaff: genericRequired,
  organizationIds: genericRequired,
  endDate: yup
    .date()
    .when(
      "startDate",
      (startDate, schema) =>
        startDate &&
        schema.min(
          moment(startDate).format("YYYY-MM-DD"),
          `End Date field must be later than ${moment(startDate).format(
            "YYYY-MM-DD"
          )}`
        )
    )
    .when("recurrence", (recurrence, schema) => {
      return recurrence === "Recurring"
        ? schema.required(GENERIC_REQUIRED)
        : schema.optional();
    }),
  minAttendees: yup
    .number("Should be a number")
    // .min(0, "Minimum Participants must be greater than or equal to 0")
    // .max(99999, "Minimum Participants must be less than or equal to 99999")
    .typeError("Minimum Participants must be a number")
    .required(GENERIC_REQUIRED),
  maxAttendees: yup
    .number("Should be a number")
    // .min(0, "Maximum Participants must be greater than or equal to 0")
    // .max(99999, "Maximum Participants must be less than or equal to 99999")
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
  startTime: genericRequired,
  endTime: genericRequired,
  weekdays: genericRequired,
  recurrenceType: genericRequired,
  type: genericRequired,
});

export { initialValues, validationSchema };
