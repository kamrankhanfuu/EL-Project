const USER_ROLES = {
  USER: "User",
  ADMIN: "Admin",
  DIRECTOR: "Director",
  MANAGER: "Manager",
  VOLUNTEER: "Volunteer",
};

const US_STATE_ID = "231"; // 231 id of United States
const PROJECT_TYPES = [
  {
    label: "Public",
    value: true,
  },
  {
    label: "Invite-only",
    value: false,
  },
];

const AUTHORIZED_PLACE = [
  "U.S. Citizen",
  "U.S. Permanent Citizen",
  "Alien/Refuge Lawfully Admitted to U.S.",
];

const RECURRENCE = ["One Time", "Recurring"];
const RECURRENCE_TYPES = [
  { label: "Daily", value: 1 },
  { label: "Weekly", value: 2 },
  { label: "Monthly", value: 3 },
];

const PER_PAGE = 10;

const NOTIFICATION_DISCRIMINATOR = {
  ORGANIZATION_NOTIFICATION: "OrganizationNotification",
  PROJECT_NOTIFICATION: "ProjectNotification",
  ACTIVITY_DATES_NOTIFICATION: "ActivityDatesNotification"
};

const  ACTIVITY_TYPES = [
  { label : "Invite Only", value: 1},
  { label : "Only Organization", value: 2},
  { label : "Project Only", value: 3},
  { label : "Public", value: 4},
]

const ACCEPTDENYACTION = {
  ACCEPT: 2,
  DENY: 3
}

export {
  US_STATE_ID,
  USER_ROLES,
  PROJECT_TYPES,
  AUTHORIZED_PLACE,
  RECURRENCE,
  RECURRENCE_TYPES,
  PER_PAGE,
  NOTIFICATION_DISCRIMINATOR,
  ACTIVITY_TYPES,
  ACCEPTDENYACTION
};
