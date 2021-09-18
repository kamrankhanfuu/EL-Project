import * as yup from "yup";

const initialValues = (details, relationship, allEthnicity) => ({
  genderAtBirth: details.genderAtBirth || 0,
  genderIdentified: details.genderIdentified || 0,
  selectiveService: details.selectiveService || "0",
  citizenshipType: details.citizenshipType || "",
  ethnicity: allEthnicity.filter((option) => {
    if (option.id === details.ethnicityId) {
      option.label = option.displayName;
      option.value = option.id;
      return option;
    }
    return "";
  })[0],
  isVeteran: details.isVeteran || false,
  familySize: details.familySize || "",
  annualFamilyIncome: details.annualFamilyIncome || "",
  visaRegistrationNumber: details.visaRegistrationNumber || "",
  ssn: details.ssn || "",
  expirationDate: details.expirationDate
    ? new Date(details.expirationDate)
    : "",
  guardians:
    details.guardians && details.guardians.length
      ? details.guardians.slice(-2).map((data) => {
          data.relation = relationship.filter(
            (option) => option.id === data.relationship
          )[0];
          return data;
        })
      : [
          {
            firstName: "",
            lastName: "",
            occupation: "",
            educationLevel: "",
            isEmergencyContact: false,
            relation: 0,
          },
          {
            firstName: "",
            lastName: "",
            occupation: "",
            educationLevel: "",
            isEmergencyContact: false,
            relation: 0,
          },
        ],
});

const validationSchema = yup.object().shape({
  visaRegistrationNumber: yup.string(),
  ssn: yup
    .string()
    .max(20, "Social Security can not be more than 20 characters."),
  guardians: yup.array().of(
    yup.object().shape({
      firstName: yup
        .string()
        .max(80, "First name can not be more than 80 characters."),
      lastName: yup
        .string()
        .max(80, "Last name can not be more than 80 characters."),
      occupation: yup
        .string()
        .max(100, "Occupation can not be more than 100 characters."),
      educationLevel: yup
        .string()
        .max(50, "Education Level can not be more than 50 characters."),
    })
  ),
  annualFamilyIncome: yup
    .number("Should be a number")
    .optional()
    .typeError("Annual Family Income must be a number")
    .test(
      "len",
      "Annual Family Income can not be more than 150 characters.",
      (val) => (val ? val.toString().length < 150 : true)
    ),
  familySize: yup
    .number("Should be a number")
    .typeError("Family Size must be a number")
    .test("len", "Family Size can not be more than 15 characters.", (val) =>
      val ? val.toString().length < 15 : true
    ),
});

export { initialValues, validationSchema };
