import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle, Row, Col } from "reactstrap";
import ProjectOrganizations from "./organization";
import Invite from "./invite";
import Api from "Helpers/Api";

const ProjectOrganizationList = (props) => {
  const { id } = props.match.params;
  const [hasInvited, setHasInvited] = useState(false);
  const [projectDetails, setProjectDetails] = useState({});

  const getProjectDetails = async () => {
    try {
      if (id) {
        const result = await Api.getProjectDetails(window.atob(id));
        setProjectDetails(result);
      }
    } catch (error) {
      console.error("getProjectDetails -> error", error);
    }
  };

  useEffect(() => {
    getProjectDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      <Row>
        <Col xs={12} md={12}>
          <Invite
            handleInvited={() => setHasInvited(true)}
            projectDetails={projectDetails}
          />
        </Col>
        <Col xs={12} md={12}>
          <Card>
            <CardHeader>
              <CardTitle tag="h4" className="float-left">
                List of Organizations
              </CardTitle>
            </CardHeader>
            <CardBody>
              <ProjectOrganizations
                hasInvited={hasInvited}
                projectDetails={projectDetails}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(ProjectOrganizationList);
