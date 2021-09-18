import { ACTION_TYPES } from "../Actions/active-route.action";

const initialState = {
    activeRouteName: localStorage.getItem("activeRouteName") || "",
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SET_ACTIVE_ROUTE:
      return {
        activeRouteName: action.activeRouteName,
      };
    default:
      return state;
  }
};
