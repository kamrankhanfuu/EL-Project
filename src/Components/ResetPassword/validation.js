import * as Yup from "yup";
import {
  STRONG_PASSWORD,
  PASSWORD_NOMATCH,
  PASSWORD_CONFIRM,
  PASSWORD_MINLENGTH,
  PASSWORD_REQUIRED,
  PASSWORD_MAXLENGTH,
} from "Helpers/Validation/messages";
import { strongPwd } from "Helpers/Validation/regex";

const initialValues = (userName) => ({
  userName: userName || "",
  password: "",
  confirmPassword: "",
});

const validationSchema = Yup.object().shape({
  userName: Yup.string().required("Required"),
  password: Yup.string()
    .min(8, PASSWORD_MINLENGTH)
    .max(32, PASSWORD_MAXLENGTH)
    .matches(strongPwd, STRONG_PASSWORD)
    .required(PASSWORD_REQUIRED),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], PASSWORD_NOMATCH)
    .required(PASSWORD_CONFIRM),
});

export { validationSchema, initialValues };
