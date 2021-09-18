import {
  ACTION_TYPES
} from "../Actions/auth.action";

const initialState = {
  isLoggedIn: localStorage.getItem("isLoggedIn") === "true",
  accessToken: localStorage.getItem("accessToken") || "",
  userId: localStorage.getItem("userId") || "",
  user: {
    roles: localStorage.getItem("roles") ? [...localStorage.getItem("roles").split(',')] : []
  },
  shouldUpdateTopbarProfile: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.LOGIN:
      return {
        isLoggedIn: true,
        accessToken: action.accessToken,
        userId: action.id,
        user: {
          roles: action.roles,
        },
      };
    case ACTION_TYPES.LOGOUT:
      return {
        isLoggedIn: false,
        accessToken: "",
        userId: "",
      };
    case ACTION_TYPES.UPDATE_TOPBAR_PROFILE:
      return {
        ...state,
        shouldUpdateTopbarProfile: true,
      };
    default:
      return state;
  }
};