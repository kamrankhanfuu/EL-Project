import * as handler from "./handler";
import {
PATH_GET_NOTIFICATIONS,
PATH_EDIT_NOTIFICATION,
PATH_ACTIVITY_BY_ACTIVITYDATES
}from "./path";

const getNotifications = () =>
  handler.get(PATH_GET_NOTIFICATIONS).then((res) => {
    return res;
  });

const readNotification = (notificationId) =>
  handler.post(`${PATH_EDIT_NOTIFICATION}?notificationId=${notificationId}`).then((res) => {
  return res;
});

const getActivityByActivityDates = (notificationId) =>
  handler.get(`${PATH_ACTIVITY_BY_ACTIVITYDATES}?activityDatesId=${notificationId}`).then((res) => {
  return res;
});

export default {
    getNotifications,
    readNotification,
    getActivityByActivityDates
}