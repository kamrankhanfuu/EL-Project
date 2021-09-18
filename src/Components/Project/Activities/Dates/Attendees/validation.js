import * as yup from "yup";
import { GENERIC_REQUIRED } from "Helpers/Validation/messages";

const initialValues = () => ({
  notes: "",
  isAttendee: true,
});

const validationSchema = yup.object().shape({
  notes: yup
    .string()
    .required(GENERIC_REQUIRED)
    .max(1000, "Notes can not be more than 1000 characters."),
});

export { initialValues, validationSchema };
