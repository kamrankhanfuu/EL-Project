import * as yup from "yup";

const initialValues = (details) => ({
  employmentStatus: details.employmentStatus || "",
  occupation: details.occupation || "",
  hourlyRate: details.hourlyRate || "",
  isEmployed: details.isEmployed || false,
  uiEligilbilty: details.uiEligilbilty || "",
  isApprenticeshipProgram: details.isApprenticeshipProgram || false,
  weeksUnEmployed: details.weeksUnEmployed || "",
  isLongTermUnemployed: details.isLongTermUnemployed || false,
});

const validationSchema = yup.object().shape({
  occupation: yup
    .string()
    .max(100, "Occupation can not be more than 100 characters."),
  hourlyRate: yup
    .string()
    .max(50, "Hourly Rate can not be more than 50 characters."),
  uiEligilbilty: yup
    .string()
    .max(50, "U. I. Eligibility can not be more than 50 characters."),
  weeksUnEmployed: yup
    .string()
    .max(20, "# of Weeks Unemployed can not be more than 20 characters."),
});

export { initialValues, validationSchema };
