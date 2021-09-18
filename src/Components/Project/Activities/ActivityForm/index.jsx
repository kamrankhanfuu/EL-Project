import React, { useState, useEffect } from "react";
// reactstrap components
import { Spinner, Col } from "reactstrap";
import { isEmpty, decodeId } from "Helpers/utils";
import ActivityTabs from "./tabs";
import Api from "Helpers/Api";
import { useParams } from "react-router-dom";
import { ACTIVITY_TYPES } from "Helpers/constants";

const ActivityForm = (props) => {
  const { id: projectId, activityId } = useParams();
  const [projectDetails, setProjectDetails] = useState({});
  const [activityDetails, setActivityDetails] = useState({});
  const [activityUsers, setActivityUsers] = useState([]);
  const [projectOrgs, setProjectOrgs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getProjectDetails = (projectId) => {
    return Api.getProjectDetails(decodeId(projectId));
  };

  const getOrganizationUsers = (projectId) => {
    return Api.getActivitytUsers(decodeId(projectId));
  };

  const getActivityDetails = (activityId) => {
    if (activityId) {
      return Api.getActivityDetails(decodeId(activityId));
    } else {
      return Promise.resolve(null);
    }
  };

  const getProjectData = React.useCallback(async (projectId, activityId) => {
    setIsLoading(true);
    const [projectDetails, orgUsers, actDetails] = await Promise.all([
      getProjectDetails(projectId).catch((err) =>
        console.error(`getProjectDetails error: ${err.message}`)
      ),
      getOrganizationUsers(projectId).catch((err) =>
        console.error(`getOrganizationUsers error: ${err.message}`)
      ),
      getActivityDetails(activityId).catch((err) =>
        console.error(`getActivityDetails error: ${err.message}`)
      ),
    ]);

    const projectOrganizations = projectDetails.projectOrganizations.map(
      (org) => {
        org.value = org.organizationId;
        org.label = org.organization.name;
        return org;
      }
    );

    const orgUsersMap = new Map();
    const dedupedOrgUsers = orgUsers
      .map((orgUser) => {
        if (!orgUsersMap.has(orgUser.id)) {
          orgUsersMap.set(orgUser.id, orgUser);
          return {
            id: orgUser.id,
            email: orgUser.email,
          };
        }
        return null;
      })
      .filter(Boolean);

    setProjectOrgs(projectOrganizations);
    setActivityUsers(dedupedOrgUsers);
    setProjectDetails(projectDetails);

    if (actDetails) {
      // Adding label and value for default selection of organizations
      if (actDetails.organizationIds !== null)
        actDetails.organizationIds = actDetails.organizationIds.map((org) => {
          const [organization] = projectOrganizations.filter(
            (o) => o.organizationId === org
          );
          if (!isEmpty(organization))
            return {
              label: organization.organization
                ? organization.organization.name
                : "",
              value: organization.organizationId,
            };
          return org;
        });

      // Adding label and value for default selection of staff
      if (!isEmpty(actDetails) && actDetails.assignedStaff !== null) {
        const orgUsersMap = new Map();
        orgUsers.forEach((user) => orgUsersMap.set(user.id, user));
        const assignedStaffUniqueIds = new Set();
        actDetails.assignedStaff.forEach((assignedUser) =>
          assignedStaffUniqueIds.add(assignedUser.userId)
        );
        const newAssignedStaff = [];
        for (let assignedUserId of assignedStaffUniqueIds) {
          const user = orgUsersMap.get(assignedUserId);
          newAssignedStaff.push({
            id: user.id,
            email: user.email,
          });
        }
        actDetails.assignedStaff = newAssignedStaff;
      }

      // Adding label and value for default selection of activity type
      if(!isEmpty(actDetails) && actDetails.type !== 0)
      {
        const [type] = ACTIVITY_TYPES.filter((t) => t.value == actDetails.type);
        if (!isEmpty(type))
          actDetails.type = type;
      }
      setActivityDetails(actDetails);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    getProjectData(projectId, activityId);
  }, [projectId, activityId, getProjectData]);

  return (
    <div className="content">
      {isLoading ? (
        <div className="text-center">
          <Spinner />
        </div>
      ) : (
        <Col className="mr-auto ml-auto" md="12">
          <ActivityTabs
            title={`Project Activity Form for ${projectDetails.name || ""}`}
            activityDetails={activityDetails}
            activityUsers={activityUsers}
            projectOrgs={projectOrgs}
          />
        </Col>
      )}
    </div>
  );
};

export default ActivityForm;
