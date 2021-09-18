import * as yup from "yup";
import {
  ORG_NAME_REQUIRED,
  STREET_REQUIRED,
  CITY_REQUIRED,
  POSTALCODE_REQUIRED,
  STATE_REQUIRED,
  CONTACT_NAME_REQUIRED,
  CONTACT_EMAIL_REQUIRED,
  EMAIL_INVALID,
  GENERIC_REQUIRED,
  ORGANIZATION_NAME_MAXLENGTH,
} from "Helpers/Validation/messages";
import { phoneRegExp } from "Helpers/Validation/regex";

const initialValues = (details) => {
  const orgDetails = details.organizationDetails;
  return {
    name: details.name || "",
    address1: details.address1 || "",
    address2: details.address2 || "",
    city: details.city || "",
    zipcode: details.zipcode || "",
    state: details.state || "",
    DeterminationLetter: details.DeterminationLetter || "",
    ProofOfLocation: details.ProofOfLocation || "",
    logo: details.logo || "",
    organizationtype: details.organizationtype || "",
    isTermsMarked: details.name ? true : false,
    ein: orgDetails?.ein || "",
    municipality: orgDetails?.municipality || "",
    websiteUrl: orgDetails?.webSiteURL || "",
    siteName: orgDetails?.siteName || "",
    contactEmail: orgDetails?.contactEmail || "",
    contactName: orgDetails?.contactName || "",
    phoneNumber: orgDetails?.phoneNumber || "",
    determinationDate: orgDetails?.determinationDate || "",
    budgetRange: orgDetails?.budgetRange || "",
  };
};

const validationSchema = yup.object().shape({
  name: yup
    .string()
    .required(ORG_NAME_REQUIRED)
    .max(80, ORGANIZATION_NAME_MAXLENGTH),
  address1: yup
    .string()
    .required(STREET_REQUIRED)
    .max(250, "Street Address can not be more than 250 characters."),
  address2: yup
    .string()
    .max(100, "Ste, Room, Bldg can not be more than 100 characters."),
  city: yup
    .string()
    .required(CITY_REQUIRED)
    .max(150, "City can not be more than 150 characters."),
  zipcode: yup
    .string()
    .required(POSTALCODE_REQUIRED)
    .max(15, "Zipcode can not be more than 15 characters."),
  state: yup.string().required(STATE_REQUIRED),
  siteName: yup
    .string()
    .max(150, "Sitename can not be more than 150 characters."),
  phoneNumber: yup
    .string()
    .max(25, "Phone number can not be more than 150 characters.")
    .matches(phoneRegExp, "Phone number is not valid"),
  contactName: yup
    .string()
    .required(CONTACT_NAME_REQUIRED)
    .max(150, "Contact name can not be more than 150 characters."),
  contactEmail: yup
    .string()
    .email(EMAIL_INVALID)
    .required(CONTACT_EMAIL_REQUIRED)
    .max(150, "Contact email can not be more than 150 characters."),
  websiteUrl: yup
    .string()
    .max(500, "Website url can not be more than 500 characters."),
  DeterminationLetter: yup.string().required(GENERIC_REQUIRED),
  logo: yup.string().required(GENERIC_REQUIRED),
  ein: yup
    .string()
    .matches(/^[0-9.-]*$/, "Should be a number or dashes or periods")
    .required(GENERIC_REQUIRED),
  organizationtype: yup.string().required(GENERIC_REQUIRED),
  isTermsMarked: yup.boolean().required(GENERIC_REQUIRED),
  irsTaxEntity: yup.string(),
  ProofOfLocation: yup.string().required(GENERIC_REQUIRED),
});

export { initialValues, validationSchema };
