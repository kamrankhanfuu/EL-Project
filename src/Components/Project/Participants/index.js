import React, { useEffect, useState } from "react";
import { withRouter, Link } from "react-router-dom";
import Api from "Helpers/Api";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Button,
  Row,
  Col,
  Spinner,
  Label,
  FormGroup,
} from "reactstrap";
import moment from "moment";

const ActivityDetailParticipant = (props) => {
  const { id, activityId } = props.match.params;
  const [logoUrl, setLogoUrl] = useState("");
  const [projectDetails, setProjectDetails] = useState(null);
  const [activityDetails, setActivityDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const getOrganizationLogo = async () => {
    if (projectDetails?.primaryOrganizationGuid) {
      setIsLoading(true);
      try {
        const result = await Api.getOrganizationLogo(
          projectDetails?.primaryOrganizationGuid
        );
        setLogoUrl(result);
      } catch (error) {
        console.error("Organization -> error", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    getOrganizationLogo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projectDetails?.primaryOrganizationGuid]);

  const getProjectActivityDetails = async () => {
    try {
      if (activityId) {
        const result = await Api.getActivityDetails(window.atob(activityId));
        setActivityDetails(result);
      }
    } catch (error) {
      console.error("getProjectDetails -> error", error);
    }
  };

  const getInitData = async () => {
    setIsLoading(true);
    await Promise.all([getProjectActivityDetails(), getProjectDetails()]);
    setIsLoading(false);
  };

  useEffect(() => {
    getInitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      <Card>
        <CardHeader>
          <CardTitle tag="h4" className="float-left">
            Project Detail
          </CardTitle>

          <Link to={`/project`}>
            <Button className="btn-link float-right mr-3" color="info">
              <i className="tim-icons icon-minimal-left" /> Go back
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          {isLoading ? (
            <div className="text-center">
              <Spinner />
            </div>
          ) : (
            <>
              <Row>
                <Col md={3}>
                  <div>
                    <img
                      src={`data:image/jpeg;base64,${logoUrl}`}
                      alt="logo"
                      height={200}
                      width="100%"
                    />
                  </div>
                </Col>
                <Col md={9} className="pl-5 d-flex align-items-center">
                  <h2 className="info-text float-middle">
                    {projectDetails?.projectOrganizations[0].organization.name}
                  </h2>
                </Col>
              </Row>
              <Row className="mt-5">
                <Col>
                  <h2>{projectDetails?.name}</h2>
                </Col>
              </Row>
              <Row>
                <Label sm="2">Start Date:</Label>
                <Col sm="10">
                  <FormGroup>
                    <p className="form-control-static">
                      {moment(
                        activityDetails?.activityDates[0].startDate
                      ).format("MMMM DD, YYYY")}
                    </p>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Label sm="2">Site Name:</Label>
                <Col sm="10">
                  <FormGroup>
                    <p className="form-control-static">
                      {activityDetails?.location}
                    </p>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Label sm="2">Site Address:</Label>
                <Col sm="10">
                  <FormGroup>
                    <p className="form-control-static">
                      {
                        projectDetails?.projectOrganizations[0].organization
                          .organizationDetails.webSiteURL
                      }
                    </p>
                  </FormGroup>
                </Col>
              </Row>
              <Label sm="2">For more info, Contact:</Label>
              <Row>
                <Label sm="2">Contact Name:</Label>
                <Col sm="10">
                  <FormGroup>
                    <p className="form-control-static">
                      {
                        projectDetails?.projectOrganizations[0].organization
                          .organizationDetails.contactName
                      }
                    </p>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Label sm="2">Contact Email:</Label>
                <Col sm="10">
                  <FormGroup>
                    <p className="form-control-static">
                      {
                        projectDetails?.projectOrganizations[0].organization
                          .organizationDetails.contactEmail
                      }
                    </p>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Label sm="2">Project Description:</Label>
                <Col sm="10">
                  <FormGroup>
                    <p className="form-control-static">
                      {projectDetails?.description}
                    </p>
                  </FormGroup>
                </Col>
              </Row>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default withRouter(ActivityDetailParticipant);
