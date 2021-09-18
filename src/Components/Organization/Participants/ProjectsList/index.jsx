import React, { useState, useEffect } from "react";
import { withRouter, Link } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
} from "reactstrap";
import Table from "../../../Common/Table";
import Api from "Helpers/Api";
import { connect } from "react-redux";

const ParticipantProjectsList = (props) => {
  const { id } = props.match.params;
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [participantUser, setParticipantUser] = useState([]);

  const getParticipantDetails = async () => {
    try {
      const res = await Api.getProfileDetails(id);
      setParticipantUser(res.model);
    } catch (error) {
      console.error("getParticipantDetails -> error", error);
    }
  };

  const getProjects = async () => {
    try {
      const result = await Api.getProjectsByUserId(
        props.participants.participantId
      );
      result.map((project) => {
        // Adding primary organization name field
        project.projectOrganizations.map((org) => {
          if (org.organizationId === project.primaryOrganizationGuid)
            project.primaryOrganizationGuid = org.organization.name;
          return project;
        });
        return project;
      });
      setProjects(result);
    } catch (error) {
      console.error("getProjectsByUserId -> error", error);
    }
  };

  const getInitData = async () => {
    setLoading(true);
    await Promise.all([getParticipantDetails(), getProjects()]);
    setLoading(false);
  };

  useEffect(() => {
    getInitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      <Row>
        <Col xs={12} md={12}>
          <Card>
            <CardHeader>
              <CardTitle tag="h4" className="float-left">
                List Projects for{" "}
                {`${participantUser.firstName} ${participantUser.lastName}` ||
                  ""}
              </CardTitle>
              <Link
                to={`/organization/${window.btoa(
                  props.participants.organizationId
                )}/participants`}
              >
                <Button className="btn-link float-right mr-3" color="info">
                  <i className="tim-icons icon-minimal-left" /> Go back
                </Button>
              </Link>
            </CardHeader>
            <CardBody>
              <Table
                columns={[
                  {
                    Header: "Name",
                    accessor: "name",
                    Filter: ({ onChange }) => (
                      <input
                        style={{ width: "100%" }}
                        placeholder="Search name"
                        onChange={(event) => onChange(event.target.value)}
                      />
                    ),
                  },
                  {
                    Header: "Description",
                    accessor: "description",
                    filterable: false,
                  },
                  {
                    Header: "Primary Organization",
                    accessor: "primaryOrganizationGuid",
                    filterable: false,
                  },
                  {
                    Header: "",
                    accessor: "actions",
                    sortable: false,
                    filterable: false,
                  },
                ]}
                dataTable={projects}
                loading={loading}
                actionsVisibility={{
                  isViewHidden: true,
                  isEditHidden: true,
                  isDeleteHidden: true,
                }}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  participants: state.search.participants,
});

export default connect(mapReduxStateToProps)(
  withRouter(ParticipantProjectsList)
);
