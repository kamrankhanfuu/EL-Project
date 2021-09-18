import * as yup from "yup";
import {GENERIC_REQUIRED} from "Helpers/Validation/messages";

const initialValues = (values) => ({
  deniedReason: values.denyReason || '',
});

const validationSchema = yup.object().shape({
  deniedReason: yup.string().required(GENERIC_REQUIRED),
});

export { initialValues, validationSchema};
