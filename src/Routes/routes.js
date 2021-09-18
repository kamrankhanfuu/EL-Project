import {
  URL_PROJECT,
  URL_DASHBOARD,
  URL_NEW_PROJECT,
  URL_ORGANIZATION,
  URL_NEW_ORGANIZATION,
  URL_Edit_ORGANIZATION,
  URL_ORGANIZATION_DETAILS,
  URL_EDIT_PROJECT,
  URL_VIEW_PROJECT,
  URL_ORGANIZATION_USERS,
  URL_ORGANIZATION_PARTICIPANTS,
  URL_ORGANIZATION_PARTICIPANTS_PROJECTS,
  URL_PROJECT_ORGANIZATIONS,
  URL_USER_PROFILE,
  URL_PROJECT_ACTIVITIES,
  URL_NEW_PROJECT_ACTIVITY,
  URL_PROJECT_ACTIVITY_CALENDAR,
  URL_EDIT_ROJECT_ACTIVITY,
  URL_PROJECT_ACTIVITY_DATES,
  URL_PROJECT_ACTIVITY_EDIT_DATE,
  URL_PROJECT_ACTIVITY_ATTENDEES,
  URL_ACTIVITY_ASSIGN_PARTICIPANT,
  URL_ACTIVITY_DETAIL_PARTICIPANT,
  URL_PARTICIPANT_ASSOCIATED,
  URL_ORG_USER_REGISTRATION,
  URL_ORG_USER_PROFILE,
  URL_PROJECT_CALENDAR,
  URL_ORGANIZATION_PARTICIPANTS_SEARCH,
  URL_PARTICIPANT_PROJECT_NOTES,
  URL_ORGANIZATION_PARTICIPANT_PROJECT_NOTES,
  URL_PROJECT_PARTICIPANTS
} from 'Helpers/urls';
import Dashboard from 'Components/Dashboard';
import OrganizationForm from 'Components/Organization/organization-form';
import Project from 'Components/Project';
import ProjectForm from 'Components/Project/ProjectForm';
import Organization from 'Components/Organization';
import ViewProject from 'Components/Project/view-project';
import OrganizationUsers from 'Components/Organization/Users';
import OrganizationParticipants from 'Components/Organization/Participants';
import ParticipantListByOrganization from 'Components/Organization/Participants/Organization';
import ProjectOrganizations from 'Components/Project/Organizations';
import UserProfile from 'Components/Profile';
import ProjectActivites from 'Components/Project/Activities';
import ProjectActivityForm from 'Components/Project/Activities/ActivityForm';
import ProjectActivityCalendar from 'Components/Project/Activities/Calendar';
import ProjectActivityDates from 'Components/Project/Activities/Dates';
import ProjectActivityEditDate from 'Components/Project/Activities/Dates/edit-date';
import ProjectActivityAttendees from 'Components/Project/Activities/Dates/Attendees';
import ActivityAssignParticipant from 'Components/Project/Activities/Dates/AssignParticipant';
import ActivityDetailParticipant from 'Components/Project/Participants';
import AssociatedOrganizations from 'Components/Organization/Participants/Associated';
import RegisterParticipant from 'Components/Organization/Participants/Register';

import ParticipantProjectsList from 'Components/Organization/Participants/ProjectsList';

import ProjectCalendar from 'Components/Project/Calendar';
import organizationDetails from 'Components/Organization/Participants/Organization/details';
import organizationProjects from 'Components/Notes';
import ParticipantTabForProject from 'Components/Project/Participants/participant-tab';

export default [
  {
    path: URL_DASHBOARD,
    name: 'Dashboard',
    icon: 'tim-icons icon-chart-pie-36',
    component: Dashboard,
    exact: true,
  },
  {
    path: URL_ORGANIZATION,
    name: 'Organization',
    icon: 'tim-icons icon-bank',
    component: Organization,
    exact: true,
  },
  {
    path: URL_NEW_ORGANIZATION,
    component: OrganizationForm,
    exact: true,
    redirect: true,
  },

  {
    path: URL_Edit_ORGANIZATION,
    component: OrganizationForm,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ORGANIZATION_DETAILS,
    component: organizationDetails,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PROJECT,
    name: 'Project',
    icon: 'tim-icons icon-coins',
    component: Project,
    exact: true,
  },
  {
    path: URL_NEW_PROJECT,
    component: ProjectForm,
    exact: true,
    redirect: true,
  },
  {
    path: URL_EDIT_PROJECT,
    component: ProjectForm,
    exact: true,
    redirect: true,
  },
  {
    path: URL_VIEW_PROJECT,
    component: ViewProject,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ORGANIZATION_USERS,
    component: OrganizationUsers,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ORGANIZATION_PARTICIPANTS_SEARCH,
    component: OrganizationParticipants,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ORGANIZATION_PARTICIPANTS,
    component: ParticipantListByOrganization,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ORGANIZATION_PARTICIPANTS_PROJECTS,
    component: ParticipantProjectsList,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PROJECT_ORGANIZATIONS,
    component: ProjectOrganizations,
    exact: true,
    redirect: true,
  },
  {
    path: URL_USER_PROFILE,
    name: 'User Profile',
    icon: 'tim-icons icon-world',
    component: UserProfile,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PROJECT_ACTIVITIES,
    component: ProjectActivites,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PROJECT_CALENDAR,
    component: ProjectCalendar,
    exact: true,
  },
  {
    path: URL_NEW_PROJECT_ACTIVITY,
    component: ProjectActivityForm,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PROJECT_ACTIVITY_CALENDAR,
    component: ProjectActivityCalendar,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PROJECT_ACTIVITY_DATES,
    component: ProjectActivityDates,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PROJECT_ACTIVITY_EDIT_DATE,
    component: ProjectActivityEditDate,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PROJECT_ACTIVITY_ATTENDEES,
    component: ProjectActivityAttendees,
    exact: true,
    redirect: true,
  },
  {
    path: URL_EDIT_ROJECT_ACTIVITY,
    component: ProjectActivityForm,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ACTIVITY_ASSIGN_PARTICIPANT,
    component: ActivityAssignParticipant,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ACTIVITY_DETAIL_PARTICIPANT,
    component: ActivityDetailParticipant,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PARTICIPANT_ASSOCIATED,
    component: AssociatedOrganizations,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ORG_USER_REGISTRATION,
    component: RegisterParticipant,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ORG_USER_PROFILE,
    component: UserProfile,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PARTICIPANT_PROJECT_NOTES,
    component: organizationProjects,
    exact: true,
    redirect: true,
  },
  {
    path: URL_ORGANIZATION_PARTICIPANT_PROJECT_NOTES,
    component: organizationProjects,
    exact: true,
    redirect: true,
  },
  {
    path: URL_PROJECT_PARTICIPANTS,
    component: ParticipantTabForProject,
    exact: true,
    redirect: true,
  },
];
