export const isEmpty = (obj) => {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) return false;
  }
  return true;
};

export const orgPrimaryCompare = (a, b) => {
  const orgA = a.isPrimary;
  const orgB = b.isPrimary;
  return orgA === orgB ? 0 : orgA ? -1 : 1;
};

export const hasRoles = (user, roles) => {
  var found = false;
  user.roles.forEach((role) => {
    if (roles.indexOf(role) !== -1) {
      found = true;
    }
  });
  return found;
};

// decodeId :: string -> string
export const decodeId = (id) => window.atob(id);

// encodeId :: string -> string
export const encodeId = (id) => window.btoa(id);
