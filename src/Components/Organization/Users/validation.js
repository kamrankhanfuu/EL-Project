import * as yup from "yup";
import {
  USERNAME_REQUIRED,
  GENERIC_MAXLENGTH

} from "Helpers/Validation/messages";

const initialValues = {
  email: "",
};

const validationSchema = yup.object().shape({
  email: yup
    .string()
    .required(USERNAME_REQUIRED)
    .matches("^[A-Za-z_][\\w_]{1,20}$|^[\\w\\.]+@([\\w]+\.)+[\\w]{2,4}$", "Username must start with alphabatic character. Only alphanumeric characters and underscores are allowed for username.")
    .max(80, GENERIC_MAXLENGTH),
});

export { initialValues, validationSchema };
