import { ACTION_TYPES } from "../Actions/search.action";

const initialState = {
  participants: JSON.parse(localStorage.getItem("participants")) || {
    organizationId: "",
  },
};

export default (state = initialState, action) => {
  switch (action.type) {
    case ACTION_TYPES.SEARCH_PARTICIPANTS:
      return {
        participants: action.participants,
      };
    default:
      return state;
  }
};
