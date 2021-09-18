// User's
const PATH_LOGIN = "Auth/Login";
const PATH_REGISTER = "Auth/Register";
const PATH_CONFIRM_EMAIL = "Auth/ConfirmEmail";
const PATH_PROFILE_DETAILS = "User/";
const PATH_EDIT_CONTACT = "User/UpdateContact";
const PATH_ETHNICITY = "User/Ethnicity";
const PATH_RELATIONSHIP = "User/Relationships";
const PATH_EDIT_BACKGROUND = "User/UpdateBackground";
const PATH_EDIT_EDUCATION = "User/UpdateEducation";
const PATH_EDIT_EMPLOYMENT = "User/UpdateEmployment";
const PATH_EDIT_HEALTH = "User/UpdateHealth";
const PATH_FORGOT_PASSWORD = "Auth/ForgotPassword";
const PATH_RESET_PASSWORD = "Auth/ResetPassword";
const PATH_GET_USER_DETAILS = "Auth/GetUser";

// Projects
const PATH_PROJECTS = "Project/";
const PATH_DELETE_PROJECT = "Project/Delete";
const PATH_PROJECT_ORGS = "Project/ProjectOrganizationInvitationList";
const PATH_DELETE_PROJECT_ORG = "Project/DeleteProjectOrganization";
const PATH_INVITE_PROJECT_ORGS = "Project/InviteOrganization";
const PATH_ACCEPT_PROJECT_ORG_INVITE = "Project/AcceptOrganizationInvitation/";
const PATH_DOCUMENT = "Project/GetProjectDocument";
const PATH_DOCUMENT_DELETE = "Project/DeleteProjectDocument";
const PATH_DOCUMENT_UPLOAD = "Project/AddProjectDocument";
const PATH_DOWNLOAD_DOCUMENT = "Project/DownloadProjectDocuments";
const PATH_PARTICIPATED_PROJECTS =
  "Project/project-participants-by-participant-id";
const PATH_APPLY_PARTICIPATION = "Project/save-project-participants";
const PATH_APPROVEDENY_INVITATION = "Project/approve-deny-invitation";

// Organizations
const PATH_ORGANIZATIONS = "Organization/";
const PATH_ORGANIZATION_LIST = "Organization/GetByUserId/";
const PATH_ORGANIZATION_CURRENT = "Organization/GetByCurrentUser/";
const PATH_DELETE_ORGANIZATION = "Organization/Delete";
const PATH_ORGANIZATION_USERS_LIST = "Organization/GetUsers/";
const PATH_DELETE_ORGANIZATION_USER = "Organization/DeleteUser";
const PATH_ADD_ORGANIZATION_USER = "Organization/AddUser";
const PATH_ACCEPT_ORG_INVITATION = "Organization/AcceptInvitation/";
const PATH_APPROVE_DENY_ORGANIZATION = "Organization/ApproveDeny";
const PATH_SEARCH_ORGANIZATION = "Organization/Search/";
const PATH_ADD_ORGANIZATION = "Organization/AddOrganization";
const PATH_ORG_USER_REGISTER = "Organization/RegisterUser";
const PATH_ADD_ORGANIZATION_LOGO = "Organization/AddLogo";
const PATH_GET_ORGANIZATION_TYPE = "Organization/get-organization-type";

// Activities
const PATH_ACTIVITY_USERS = "Activities/get-users";
const PATH_ACTIVITIES = "Activities/get-all";
const PATH_ADD_ACTIVITY = "Activities/add";
const PATH_DELETE_ACTIVITY = "Activities/delete?activityId=";
const PATH_ACTIVITY_DETAILS = "Activities/";
const PATH_UPDATE_ACTIVITY = "Activities/update";
const PATH_ACTIVITY_DATES = "Activities/activity-dates-by-activityid";
const PATH_RECURRENCE_DATES = "Activities/get-activity-recurrence-date";
const PATH_ATTEND_ACTIVITY = "Activities/assign-participant";
const PATH_ACTIVITY_DATE_DETAILS = "ActivitiesDates/by-id";
const PATH_EDIT_ACTIVITY_DATE_DETAILS = "ActivitiesDates/save";
const PATH_ACTIVITY_DATE_DELETE = "ActivitiesDates/delete";
const PATH_ACTIVITY_ATTENDEES = "Activities/activity-participant";
const PATH_CHANGE_PART_ATTEND = "Activities/participant-attendance";
const PATH_ASSIGN_ACTIVITY_PART = "Activities/assign-activities-participants";
const PATH_ACTIVITIES_DATES_BY_PROJECT_ID = "Activities/get-activity-dates";
const PATH_ATTENDEE_NOTES = "Activities/get-participant-note";
const PATH_SAVE_ATTENDEE_NOTES = "Activities/save-participant-note";
const PATH_ACTIVITY_BY_ACTIVITYDATES = 'Activities/GetActivityByActivityDatesId';

// Organization users
const PATH_ORG_USER_PROFILE_DETAILS =
  "OrganizationUserParticipant/ParticipantProfile";
const PATH_ORG_USER_EDIT_CONTACT = "OrganizationUserParticipant/UpdateContact";
const PATH_EDIT_ORG_USER_BACKGROUND =
  "OrganizationUserParticipant/UpdateBackground";
const PATH_EDIT_ORG_USER_EDUCATION =
  "OrganizationUserParticipant/UpdateEducation";
const PATH_EDIT_ORG_USER_EMPLOYMENT =
  "OrganizationUserParticipant/UpdateEmployment";
const PATH_EDIT_ORG_USER_HEALTH = "OrganizationUserParticipant/UpdateHealth";
const PATH_ATTACH_PARTICIPANTS =
  "OrganizationUserParticipant/AttachParticipant";

// Participants
const PATH_GET_PARTICIPANTS_BY_ORG_ID = "Participant/GetByOrganizationId";
const PATH_GET_SEARCH_PARTICIPANTS = "Search/participants";
const PATH_REGISTER_PARTICIPANTS = "Organization/RegisterParticipants";
const PATH_REMOVE_PARTICIPANT = "Participant/Delete";
const PATH_ORGANIZATION_USER = "OrganizationUser/get-by-project-id";

// Notifications
const PATH_GET_NOTIFICATIONS = 'Notification/GetNotifications';
const PATH_EDIT_NOTIFICATION = 'Notification/ReadNotification';

// Notes
const PATH_GET_ORGANIZATION_PROJECTS = 'Project/GetByOrganizationId';
const PATH_GET_ORGANIZATION_PROJECT_PARTICIPANT = 'Project/get-participants';
const PATH_GET_PROJECT_BY_PARTICIPANT = 'Project/get-projects-by-participantId';
const PATH_NOTES_BY_PROJECT_ORGANIZATION_ID = 'activities/notes-by-project-organizationid';

export {
  PATH_LOGIN,
  PATH_REGISTER,
  PATH_ORGANIZATIONS,
  PATH_ORGANIZATION_LIST,
  PATH_CONFIRM_EMAIL,
  PATH_PROJECTS,
  PATH_DELETE_PROJECT,
  PATH_DELETE_ORGANIZATION,
  PATH_ORGANIZATION_USERS_LIST,
  PATH_DELETE_ORGANIZATION_USER,
  PATH_ADD_ORGANIZATION_USER,
  PATH_ADD_ORGANIZATION,
  PATH_ACCEPT_ORG_INVITATION,
  PATH_APPROVE_DENY_ORGANIZATION,
  PATH_ACCEPT_PROJECT_ORG_INVITE,
  PATH_SEARCH_ORGANIZATION,
  PATH_INVITE_PROJECT_ORGS,
  PATH_DELETE_PROJECT_ORG,
  PATH_PROJECT_ORGS,
  PATH_PROFILE_DETAILS,
  PATH_EDIT_CONTACT,
  PATH_ETHNICITY,
  PATH_RELATIONSHIP,
  PATH_EDIT_BACKGROUND,
  PATH_EDIT_EDUCATION,
  PATH_EDIT_EMPLOYMENT,
  PATH_EDIT_HEALTH,
  PATH_ACTIVITY_USERS,
  PATH_ACTIVITIES,
  PATH_ADD_ACTIVITY,
  PATH_DELETE_ACTIVITY,
  PATH_ACTIVITY_DETAILS,
  PATH_UPDATE_ACTIVITY,
  PATH_ACTIVITY_DATES,
  PATH_DOCUMENT,
  PATH_DOCUMENT_DELETE,
  PATH_DOCUMENT_UPLOAD,
  PATH_DOWNLOAD_DOCUMENT,
  PATH_RECURRENCE_DATES,
  PATH_PARTICIPATED_PROJECTS,
  PATH_APPLY_PARTICIPATION,
  PATH_ATTEND_ACTIVITY,
  PATH_ACTIVITY_DATE_DETAILS,
  PATH_EDIT_ACTIVITY_DATE_DETAILS,
  PATH_ACTIVITY_ATTENDEES,
  PATH_CHANGE_PART_ATTEND,
  PATH_GET_PARTICIPANTS_BY_ORG_ID,
  PATH_ASSIGN_ACTIVITY_PART,
  PATH_ORG_USER_PROFILE_DETAILS,
  PATH_ORG_USER_EDIT_CONTACT,
  PATH_EDIT_ORG_USER_BACKGROUND,
  PATH_EDIT_ORG_USER_EDUCATION,
  PATH_EDIT_ORG_USER_EMPLOYMENT,
  PATH_EDIT_ORG_USER_HEALTH,
  PATH_ORG_USER_REGISTER,
  PATH_ADD_ORGANIZATION_LOGO,
  PATH_GET_ORGANIZATION_TYPE,
  PATH_GET_SEARCH_PARTICIPANTS,
  PATH_REGISTER_PARTICIPANTS,
  PATH_FORGOT_PASSWORD,
  PATH_RESET_PASSWORD,
  PATH_ATTACH_PARTICIPANTS,
  PATH_ACTIVITIES_DATES_BY_PROJECT_ID,
  PATH_ATTENDEE_NOTES,
  PATH_SAVE_ATTENDEE_NOTES,
  PATH_REMOVE_PARTICIPANT,
  PATH_ACTIVITY_DATE_DELETE,
  PATH_ORGANIZATION_CURRENT,
  PATH_ORGANIZATION_USER, 
  PATH_GET_NOTIFICATIONS,
  PATH_EDIT_NOTIFICATION,
  PATH_GET_USER_DETAILS,
  PATH_ACTIVITY_BY_ACTIVITYDATES,
  PATH_GET_ORGANIZATION_PROJECTS,
  PATH_GET_ORGANIZATION_PROJECT_PARTICIPANT,
  PATH_GET_PROJECT_BY_PARTICIPANT,
  PATH_NOTES_BY_PROJECT_ORGANIZATION_ID,
  PATH_APPROVEDENY_INVITATION,
};
