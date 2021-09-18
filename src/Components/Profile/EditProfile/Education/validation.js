import * as yup from "yup";

const initialValues = (details) => ({
  schoolStatus: details.schoolStatus || "",
  isCompulsoryEducationDone: details.isCompulsoryEducationDone || false,
  lastSchoolAttended: details.lastSchoolAttended
    ? new Date(details.lastSchoolAttended)
    : "",
  highestSchoolGrades: details.highestSchoolGrade
    ? { label: details.highestSchoolGrade, value: details.highestSchoolGrade }
    : "",
  isEnrolledInDiploma: details.isEnrolledInDiploma || false,
  isDiplomaEquivalent: details.isDiplomaEquivalent || false,
});

const validationSchema = yup.object().shape({
  schoolStatus: yup
    .string()
    .max(50, "School Status can not be more than 50 characters."),
});

export { initialValues, validationSchema };
