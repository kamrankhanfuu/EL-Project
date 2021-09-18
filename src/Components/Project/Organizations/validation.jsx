import * as yup from "yup";
import { GENERIC_REQUIRED } from "Helpers/Validation/messages";

const initialValues = {
  organization: "",
};

const validationSchema = yup.object().shape({
  organization: yup.string().nullable().required(GENERIC_REQUIRED),
});

export { initialValues, validationSchema };
