import * as handler from "./handler";
import {
  PATH_LOGIN,
  PATH_REGISTER,
  PATH_CONFIRM_EMAIL,
  PATH_PROFILE_DETAILS,
  PATH_EDIT_CONTACT,
  PATH_ETHNICITY,
  PATH_RELATIONSHIP,
  PATH_EDIT_BACKGROUND,
  PATH_EDIT_EDUCATION,
  PATH_EDIT_EMPLOYMENT,
  PATH_EDIT_HEALTH,
  PATH_ORG_USER_REGISTER,
  PATH_RESET_PASSWORD,
  PATH_FORGOT_PASSWORD,
  PATH_GET_USER_DETAILS
} from "./path";

const login = (payload) => {
  return handler.post(PATH_LOGIN, payload).then((res) => {
    return res;
  });
};

const register = (payload) => {
  return handler.post(PATH_REGISTER, payload).then((res) => {
    return res;
  });
};
const ConfirmEmail = (payload) => {
  return handler.get(PATH_CONFIRM_EMAIL, payload).then((res) => {
    return res;
  });
};

const getProfileDetails = (userId) =>
  handler.get(PATH_PROFILE_DETAILS + userId).then((res) => {
    return res;
  });

const editContactProfile = (payload) =>
  handler.put(PATH_EDIT_CONTACT, payload).then((res) => {
    return res;
  });

const getEthnicity = () =>
  handler.get(PATH_ETHNICITY).then((res) => {
    return res.model;
  });

const getRelationship = () =>
  handler.get(PATH_RELATIONSHIP).then((res) => {
    return res.model;
  });

const editBackgroundProfile = (payload) =>
  handler.put(PATH_EDIT_BACKGROUND, payload).then((res) => {
    return res.model;
  });

const editEducationProfile = (payload) =>
  handler.put(PATH_EDIT_EDUCATION, payload).then((res) => {
    return res.model;
  });

const editEmploymentProfile = (payload) =>
  handler.put(PATH_EDIT_EMPLOYMENT, payload).then((res) => {
    return res.model;
  });

const editHealthProfile = (payload) =>
  handler.put(PATH_EDIT_HEALTH, payload).then((res) => {
    return res.model;
  });

const orgUserRegister = (payload) => {
  return handler.post(PATH_ORG_USER_REGISTER, payload).then((res) => {
    return res;
  });
};
const forgotPassword = (payload) => {
  return handler.post(PATH_FORGOT_PASSWORD, payload).then((res) => {
    return res;
  });
};
const resetPassword = (payload) => {
  return handler.get(PATH_RESET_PASSWORD, payload).then((res) => {
    return res;
  });
};

const getUserDetails = (userId) => {  
  return handler.get(PATH_GET_USER_DETAILS +'?id='+ userId).then((res) => {
    return res;
  });
};

export default {
  login,
  register,
  ConfirmEmail,
  getProfileDetails,
  editContactProfile,
  getEthnicity,
  getRelationship,
  editBackgroundProfile,
  editEducationProfile,
  editEmploymentProfile,
  editHealthProfile,
  orgUserRegister,
  forgotPassword,
  resetPassword,
  getUserDetails
};
