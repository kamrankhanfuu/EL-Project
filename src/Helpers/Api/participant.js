import * as handler from './handler';
import {
  PATH_GET_PARTICIPANTS_BY_ORG_ID,
  PATH_GET_SEARCH_PARTICIPANTS,
  PATH_REGISTER_PARTICIPANTS,
  PATH_ORG_USER_PROFILE_DETAILS,
  PATH_ORG_USER_EDIT_CONTACT,
  PATH_EDIT_ORG_USER_BACKGROUND,
  PATH_EDIT_ORG_USER_EDUCATION,
  PATH_EDIT_ORG_USER_EMPLOYMENT,
  PATH_EDIT_ORG_USER_HEALTH,
  PATH_ATTACH_PARTICIPANTS,
} from './path';

const getOrganizationParticipants = (orgId) => {
  return handler
    .get(`${PATH_GET_PARTICIPANTS_BY_ORG_ID}?organizationId=${orgId}`)
    .then((res) => {
      return res.model;
    });
};

const getSearchParticipants = (payload) => {
  return handler.post(PATH_GET_SEARCH_PARTICIPANTS, payload).then((res) => {
    return res.model;
  });
};

const registerParticipants = (payload) => {
  return handler.post(PATH_REGISTER_PARTICIPANTS, payload).then((res) => {
    return res.model;
  });
};

const getOrgUserProfileDetails = (participantId, organizationId) =>
  handler.get(PATH_ORG_USER_PROFILE_DETAILS + `?participantId=${participantId}&organizationId=${organizationId}`).then((res) => {
    return res;
  });
const getUser = (payload) =>
  handler.get(`User/${payload}`).then((res) => {
    return res;
  });

const editOrgUserContactProfile = (payload) =>
  handler.put(PATH_ORG_USER_EDIT_CONTACT, payload).then((res) => {
    return res;
  });

const editOrgUserBackgroundProfile = (payload) =>
  handler.put(PATH_EDIT_ORG_USER_BACKGROUND, payload).then((res) => {
    return res.model;
  });

const editOrgUserEducationProfile = (payload) =>
  handler.put(PATH_EDIT_ORG_USER_EDUCATION, payload).then((res) => {
    return res.model;
  });

const editOrgUserEmploymentProfile = (payload) =>
  handler.put(PATH_EDIT_ORG_USER_EMPLOYMENT, payload).then((res) => {
    return res.model;
  });

const editOrgUserHealthProfile = (payload) =>
  handler.put(PATH_EDIT_ORG_USER_HEALTH, payload).then((res) => {
    return res.model;
  });
const attachParticipant = (payload) => {
  return handler
    .post(
      `${PATH_ATTACH_PARTICIPANTS}?organizationUserId=${payload.organizationUserId}&participantId=${payload.participantId}`,
      payload
    )
    .then((res) => {
      return res.model;
    });
};

export default {
  getOrganizationParticipants,
  getSearchParticipants,
  registerParticipants,
  getOrgUserProfileDetails,
  editOrgUserContactProfile,
  editOrgUserBackgroundProfile,
  editOrgUserEducationProfile,
  editOrgUserEmploymentProfile,
  editOrgUserHealthProfile,
  attachParticipant,
  getUser,
};
