import csc from "country-state-city";

export const getStates = async (stateId) => {
  const usStates = await csc.getStatesOfCountry(stateId);
  usStates.map((state) => {
    state.value = state.name;
    state.label = state.name;
    return state;
  });
  return usStates;
};
