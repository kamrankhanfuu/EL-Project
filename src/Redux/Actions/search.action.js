export const ACTION_TYPES = {
  SEARCH_PARTICIPANTS: "SEARCH_PARTICIPANTS",
};

export const searchParticipants = (data) => {
  localStorage.setItem("participants", JSON.stringify(data));
  return {
    type: ACTION_TYPES.SEARCH_PARTICIPANTS,
    participants: data,
  };
};
