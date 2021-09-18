import * as yup from "yup";
import { GENERIC_REQUIRED } from "Helpers/Validation/messages";

const initialValues = {
  participants: [],
  activityDates: [],
};

const validationSchema = yup.object().shape({
  participants: yup.array().required(GENERIC_REQUIRED).typeError("Required"),
  activityDates: yup.array().required(GENERIC_REQUIRED),
});

export { initialValues, validationSchema };
