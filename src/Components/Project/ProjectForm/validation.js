import * as yup from "yup";
import moment from "moment";
import { GENERIC_REQUIRED } from "Helpers/Validation/messages";

const initialValues = ({
  name,
  description,
  primaryOrganizationGuid,
  startDate,
  endDate,
  isPublic,
}) => ({
  name: name || "",
  description: description || "",
  primaryOrganizationGuid: primaryOrganizationGuid || "",
  startDate: startDate ? moment(startDate) : "",
  endDate: endDate ? moment(endDate) : "",
  isPublic: isPublic || false,
});

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required(GENERIC_REQUIRED)
    .max(250, "Name can not be more than 250 characters."),
  description: yup
    .string()
    .trim()
    .required(GENERIC_REQUIRED)
    .max(500, "Description can not be more than 500 characters."),
  primaryOrganizationGuid: yup.string().required(GENERIC_REQUIRED),
  startDate: yup.date().required(GENERIC_REQUIRED),
  endDate: yup
    .date()
    .required(GENERIC_REQUIRED)
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
    ),
  isPublic: yup.string(),
});

export { initialValues, validationSchema };
