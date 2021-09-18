import * as handler from "./handler";
import {
  PATH_ACTIVITY_USERS,
  PATH_ACTIVITIES,
  PATH_ADD_ACTIVITY,
  PATH_DELETE_ACTIVITY,
  PATH_ACTIVITY_DETAILS,
  PATH_UPDATE_ACTIVITY,
  PATH_ACTIVITY_DATES,
  PATH_RECURRENCE_DATES,
  PATH_ATTEND_ACTIVITY,
  PATH_ACTIVITY_DATE_DETAILS,
  PATH_EDIT_ACTIVITY_DATE_DETAILS,
  PATH_ACTIVITY_ATTENDEES,
  PATH_CHANGE_PART_ATTEND,
  PATH_ASSIGN_ACTIVITY_PART,
  PATH_ACTIVITIES_DATES_BY_PROJECT_ID,
  PATH_ATTENDEE_NOTES,
  PATH_SAVE_ATTENDEE_NOTES,
  PATH_ACTIVITY_DATE_DELETE,
  PATH_NOTES_BY_PROJECT_ORGANIZATION_ID,
} from "./path";

const getActivitytUsers = (pId) => {
  return handler.get(`${PATH_ACTIVITY_USERS}?projectId=${pId}`).then((res) => {
    return res.model;
  });
};

const getActivities = (payload) => {
  return handler.get(PATH_ACTIVITIES, payload).then((res) => {
    return res.model;
  });
};

const addActivity = (payload) => {
  return handler.post(PATH_ADD_ACTIVITY, payload).then((res) => {
    return res.model;
  });
};

const deleteActivity = (activityId) => {
  return handler.put(PATH_DELETE_ACTIVITY + activityId).then((res) => {
    return res.model;
  });
};

const deleteActivityDate = payload => {
  return handler.post(`${PATH_ACTIVITY_DATE_DELETE}?activityDateId=${payload.activityDateId}`).then(res => res.model);
}

const getActivityDetails = (activityId) => {
  return handler.get(PATH_ACTIVITY_DETAILS + activityId).then((res) => {
    return res.model;
  });
};

const editActivity = (payload) => {
  return handler.put(PATH_UPDATE_ACTIVITY, payload).then((res) => {
    return res.model;
  });
};

const getActivityDates = (payload) => {
  return handler.get(PATH_ACTIVITY_DATES, payload).then((res) => {
    return res.model;
  });
};

const getRecurrenceDates = (payload) => {
  return handler.post(PATH_RECURRENCE_DATES, payload).then((res) => {
    return res.model;
  });
};

const attendActivity = (payload) => {
  return handler.post(PATH_ATTEND_ACTIVITY, payload).then((res) => {
    return res.model;
  });
};

const getActivityDateDetails = (payload) => {
  return handler.get(PATH_ACTIVITY_DATE_DETAILS, payload).then((res) => {
    return res.model;
  });
};

const editActivityDateDetails = (payload) => {
  return handler.post(PATH_EDIT_ACTIVITY_DATE_DETAILS, payload).then((res) => {
    return res.model;
  });
};

const getActivityAttendees = (payload) => {
  return handler.get(PATH_ACTIVITY_ATTENDEES, payload).then((res) => {
    return res.model;
  });
};

const changeParticipantAttend = (payload) => {
  return handler.post(PATH_CHANGE_PART_ATTEND, payload).then((res) => {
    return res.model;
  });
};

const assignActivitiesParticipants = (payload) => {
  return handler.post(PATH_ASSIGN_ACTIVITY_PART, payload).then((res) => {
    return res.model;
  });
};

const getActivitiesDatesByProjectId = (payload) => {
  return handler.get(PATH_ACTIVITIES_DATES_BY_PROJECT_ID, payload).then((res) => {
    return res.model;
  })
}

const getAttendeeNotes = (payload) => {
  return handler.get(PATH_ATTENDEE_NOTES, payload).then((res) => {
    return res.model;
  });
};

const saveAttendeeNotes = (payload) => {
  return handler.post(PATH_SAVE_ATTENDEE_NOTES, payload).then((res) => {
    return res.model;
  });
};

const getNotesByProjectAndOrganizationId = (participantId, projectId, organizationId) => {
  return handler.get(PATH_NOTES_BY_PROJECT_ORGANIZATION_ID + `?participantId=${participantId}&projectId=${projectId}&organizationId=${organizationId}`).then((res) => {
    return res.model;
  });
}

const getNotesByDate = (participantId, projectId, organizationId, lastRecordDate) => {
  return handler.get(PATH_NOTES_BY_PROJECT_ORGANIZATION_ID + `?participantId=${participantId}&projectId=${projectId}&organizationId=${organizationId}&lastRecordDate=${lastRecordDate}`).then((res) => {
    return res.model;
  });
}
export default {
  getActivitytUsers,
  getActivities,
  addActivity,
  deleteActivity,
  getActivityDetails,
  editActivity,
  getActivityDates,
  getRecurrenceDates,
  attendActivity,
  getActivityDateDetails,
  editActivityDateDetails,
  getActivityAttendees,
  changeParticipantAttend,
  assignActivitiesParticipants,
  getActivitiesDatesByProjectId,
  getAttendeeNotes,
  saveAttendeeNotes,
  deleteActivityDate,
  getNotesByProjectAndOrganizationId,
  getNotesByDate
};
