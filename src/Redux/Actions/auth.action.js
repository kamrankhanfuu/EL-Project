export const ACTION_TYPES = {
  LOGIN: "LOGIN",
  LOGOUT: "LOGOUT",
  UPDATE_TOPBAR_PROFILE: "UPDATE_TOPBAR_PROFILE",
};

export const login = (data) => {
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("userId", data.id);
  localStorage.setItem("isLoggedIn", true);
  localStorage.setItem("roles", data.roles.join());
  return {
    type: ACTION_TYPES.LOGIN,
    ...data,
  };
};

export const logout = () => {
  localStorage.clear();
  return {
    type: ACTION_TYPES.LOGOUT,
  };
};

export const updateTopbarProfile = () => {
  return {
    type: ACTION_TYPES.UPDATE_TOPBAR_PROFILE,
  };
};
