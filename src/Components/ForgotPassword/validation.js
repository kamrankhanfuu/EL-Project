import * as Yup from "yup";
import { GENERIC_REQUIRED } from "Helpers/Validation/messages";

const initialValues = {
  userName: "",
};

const validationSchema = Yup.object().shape({
  userName: Yup.string().required(GENERIC_REQUIRED),
});

export { validationSchema, initialValues };
