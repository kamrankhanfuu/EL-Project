const URL_HOME = '/';
const URL_LOGIN = '/login';
const URL_REGISTRATION = '/register';
const URL_DASHBOARD = '/dashboard';
const URL_FORGOT_PASSWORD = '/forgotPassword';
const URL_RESET_PASSWORD = '/resetPassword';

// Projects
const URL_PROJECT = '/project';
const URL_NEW_PROJECT = '/project/new';
const URL_EDIT_PROJECT = '/project/:id/edit';
const URL_VIEW_PROJECT = '/project/:id/view';
const URL_PROJECT_ORG_ACCEPT = '/project/organization/accepted-invitation';
const URL_PROJECT_ORGANIZATIONS = '/project/:id/Organizations';
const URL_PROJECT_CALENDAR = '/project/:id/Calendar';

// Activities
const URL_PROJECT_ACTIVITIES = '/project/:id/activity';
const URL_NEW_PROJECT_ACTIVITY = '/project/:id/activity/new';
const URL_EDIT_ROJECT_ACTIVITY = '/project/:id/activity/:activityId/edit';
const URL_PROJECT_ACTIVITY_CALENDAR =
  '/project/:id/activity/:activityId/calendar';
const URL_PROJECT_ACTIVITY_DATES = '/project/:id/activity/:activityId/organization/:orgId/dates';
const URL_PROJECT_ACTIVITY_EDIT_DATE =
  '/project/:id/activity/:activityId/dates/:activityDateId/edit';
const URL_PROJECT_ACTIVITY_ATTENDEES =
  '/project/:id/activity/:activityId/organization/:orgId/dates/:activityDateId/attendees';
const URL_ACTIVITY_ASSIGN_PARTICIPANT =
  '/project/:id/activity/:activityId/assign-participant';
const URL_ACTIVITY_DETAIL_PARTICIPANT =
  '/project/:id/activity/:activityId/activity-detail';

// Organizations
const URL_ORGANIZATION = '/organization';
const URL_NEW_ORGANIZATION = '/organization/new';
const URL_ORGANIZATION_USERS = '/organization/:id/user';
const URL_ORGANIZATION_PARTICIPANTS = '/organization/:id/participants';
const URL_ORGANIZATION_PARTICIPANTS_SEARCH =
  '/organization/:id/participants-search';
const URL_ORGANIZATION_PARTICIPANTS_PROJECTS =
  '/organization/:id/participants/:id/Projects';
const URL_Edit_ORGANIZATION = '/organization/:id/edit';
const URL_ORGANIZATION_DETAILS = '/organization/:id/details';
const URL_ORGANIZATIONS_APPROVED = '/organization/approved';
const URL_ORGANIZATIONS_DENIED = '/organization/denied';

// Organizations participants
const URL_ORG_USER_REGISTRATION = '/participant/register';
const URL_PARTICIPANT_ASSOCIATED = '/participant/organization';

// Users
const URL_USER_PROFILE_NoParam = '/user-profile/';
const URL_USER_PROFILE = '/user-profile/:id';
const URL_ORG_USER_PROFILE = '/p/:username';

const URL_ORGANIZATION_PARTICIPANT_PROJECT_NOTES = '/participant/:participantId/notes';
const URL_PARTICIPANT_PROJECT_NOTES = '/project/:projectId/participant/:participantId/notes';
const URL_PROJECT_PARTICIPANTS = '/project/:id/participants';

export {
  URL_LOGIN,
  URL_REGISTRATION,
  URL_HOME,
  URL_NEW_ORGANIZATION,
  URL_ORGANIZATION_USERS,
  URL_ORGANIZATION_PARTICIPANTS,
  URL_ORGANIZATION_PARTICIPANTS_PROJECTS,
  URL_DASHBOARD,
  URL_PROJECT,
  URL_NEW_PROJECT,
  URL_ORGANIZATION,
  URL_Edit_ORGANIZATION,
  URL_ORGANIZATION_DETAILS,
  URL_EDIT_PROJECT,
  URL_VIEW_PROJECT,
  URL_PROJECT_ORGANIZATIONS,
  URL_USER_PROFILE,
  URL_ORGANIZATIONS_APPROVED,
  URL_ORGANIZATIONS_DENIED,
  URL_PROJECT_ORG_ACCEPT,
  URL_PROJECT_ACTIVITIES,
  URL_NEW_PROJECT_ACTIVITY,
  URL_PROJECT_ACTIVITY_CALENDAR,
  URL_EDIT_ROJECT_ACTIVITY,
  URL_PROJECT_ACTIVITY_DATES,
  URL_PROJECT_ACTIVITY_EDIT_DATE,
  URL_PROJECT_ACTIVITY_ATTENDEES,
  URL_ACTIVITY_ASSIGN_PARTICIPANT,
  URL_ORG_USER_REGISTRATION,
  URL_ACTIVITY_DETAIL_PARTICIPANT,
  URL_PARTICIPANT_ASSOCIATED,
  URL_ORG_USER_PROFILE,
  URL_FORGOT_PASSWORD,
  URL_RESET_PASSWORD,
  URL_PROJECT_CALENDAR,
  URL_ORGANIZATION_PARTICIPANTS_SEARCH,
  URL_PARTICIPANT_PROJECT_NOTES,
  URL_ORGANIZATION_PARTICIPANT_PROJECT_NOTES,
  URL_USER_PROFILE_NoParam,
  URL_PROJECT_PARTICIPANTS
};
