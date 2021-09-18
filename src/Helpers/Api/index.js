import user from "./user";
import organization from "./organization";
import project from "./project";
import activity from "./activity";
import participant from "./participant";
import notification from "./notification";

export default {
  ...user,
  ...organization,
  ...project,
  ...activity,
  ...participant,
  ...notification
};
