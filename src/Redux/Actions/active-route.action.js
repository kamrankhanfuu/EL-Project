export const ACTION_TYPES = {
    SET_ACTIVE_ROUTE: "SET_ACTIVE_ROUTE",
  };
  
  export const setActiveRoute = (data) => {
    localStorage.setItem("activeRouteName", data);
    return {
      type: ACTION_TYPES.SET_ACTIVE_ROUTE,
      activeRouteName: data,
    };
  };
  