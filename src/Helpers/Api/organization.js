import * as handler from './handler';
import {
  PATH_ORGANIZATION_LIST,
  PATH_ORGANIZATIONS,
  PATH_DELETE_ORGANIZATION,
  PATH_ORGANIZATION_USERS_LIST,
  PATH_DELETE_ORGANIZATION_USER,
  PATH_ADD_ORGANIZATION_USER,
  PATH_ACCEPT_ORG_INVITATION,
  PATH_APPROVE_DENY_ORGANIZATION,
  PATH_SEARCH_ORGANIZATION,
  PATH_ADD_ORGANIZATION,
  PATH_ADD_ORGANIZATION_LOGO,
  PATH_GET_ORGANIZATION_TYPE,
  PATH_REMOVE_PARTICIPANT,
  PATH_ORGANIZATION_CURRENT,
} from './path';

const getOrganizations = (params) =>
  handler.get(PATH_ORGANIZATION_LIST, params).then((res) => {
    return res.model;
  });

const getCurrentOrganizations = () =>
  handler.get(PATH_ORGANIZATION_CURRENT).then((res) => {
    return res.model;
  });

const deleteOrganization = (payload) =>
  handler.put(PATH_DELETE_ORGANIZATION, payload).then((res) => {
    return res;
  });

const getOrganizationById = (orgId) =>
  handler.get(PATH_ORGANIZATIONS + orgId).then((res) => {
    return res.model;
  });

const editOrganization = (params) =>
  handler.put(PATH_ORGANIZATIONS, params).then((res) => {
    return res;
  });

const addOrganization = (payload) =>
  handler.post(PATH_ADD_ORGANIZATION, payload).then((res) => {
    return res.model;
  });

const getOrganizationUsers = (orgId) =>
  handler.get(PATH_ORGANIZATION_USERS_LIST + orgId).then((res) => {
    return res;
  });

const deleteOrganizationUser = (payload) =>
  handler.put(PATH_DELETE_ORGANIZATION_USER, payload).then((res) => {
    return res;
  });

const addOrganizationUser = (payload) =>
  handler.post(PATH_ADD_ORGANIZATION_USER, payload).then((res) => {
    return res;
  });

const acceptInvitation = (orgId) =>
  handler.post(PATH_ACCEPT_ORG_INVITATION + orgId).then((res) => {
    return res;
  });

const approveDenyOrganization = (payload) =>
  handler.post(PATH_APPROVE_DENY_ORGANIZATION, payload).then((res) => {
    return res;
  });

const getSearchOrganizations = (text, projectId, limit) =>
  handler
    .get(PATH_SEARCH_ORGANIZATION + `${text}/${projectId}/${limit}`)
    .then((res) => {
      return res.model;
    });

const addOrganizationLogo = (payload) =>
  handler.post(PATH_ADD_ORGANIZATION_LOGO, payload).then((res) => {
    return res.model;
  });

const getOrganizationLogo = (id) =>
  handler.get(`${PATH_ORGANIZATIONS}${id}/Logo`).then((res) => {
    return res.model;
  });

const getOrganizationtype = () =>
  handler.post(PATH_GET_ORGANIZATION_TYPE, null).then((res) => {
    if (res.model != null) {
      res.model.map((el) => {
        el.value = el.id;
        el.label = el.name;
        return el;
      });
    }
    return res.model;
  });

const removeParticipant = (organizationUserId, participantId) =>
  handler.put(`${PATH_REMOVE_PARTICIPANT}?organizationUserId=${organizationUserId}&participantId=${participantId}`)
    .then((res) => { return res; });

export default {
  getOrganizations,
  deleteOrganization,
  getOrganizationById,
  editOrganization,
  addOrganization,
  getOrganizationUsers,
  deleteOrganizationUser,
  addOrganizationUser,
  acceptInvitation,
  approveDenyOrganization,
  getSearchOrganizations,
  addOrganizationLogo,
  getOrganizationLogo,
  getOrganizationtype,
  removeParticipant,
  getCurrentOrganizations,
};
