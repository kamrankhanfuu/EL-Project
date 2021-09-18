import * as yup from "yup";
import {
  USERNAME_REQUIRED,
  PASSWORD_REQUIRED,
  GENERIC_MAXLENGTH,
} from "Helpers/Validation/messages";

const initialValues = {
  userName: "",
  password: "",
};

const validationSchema = yup.object().shape({
  userName: yup.string().required(USERNAME_REQUIRED).max(80, GENERIC_MAXLENGTH),
  password: yup.string().required(PASSWORD_REQUIRED),
});

export { initialValues, validationSchema };
