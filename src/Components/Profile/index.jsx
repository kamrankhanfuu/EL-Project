import Api from "Helpers/Api";
import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
// reactstrap components
import { Card, CardBody, CardText, Row, Col } from "reactstrap";
import EditProfile from "./EditProfile";

const User = (props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [profileDetails, setProfileDetails] = useState({});
  const [relationship, setRelationship] = useState([]);

  const getProfileDetails = async () => {
    try {
      let response; 
      const username= props.match.params;

      if ( username && props.match.params.username !== undefined)
      {
        const organizationId = props.participants.organizationId;
        const participantId = props.participants.participantId.id || props.participants.participantId;
        response = await Api.getOrgUserProfileDetails(participantId, organizationId);
      }
      else response = await Api.getProfileDetails(props.userId);

      // Adding guardians name as label and value for select
      if (response.model.userBackground)
        response.model.userBackground.guardians.map((data) => {
          let name = `${data.firstName || ""} ${data.lastName || ""}`;
          data.label = name;
          data.value = data.id;
          return data;
        });

      setProfileDetails(response.model);
    } catch (error) {
      console.error(error);
    }
  };

  const getRelationship = async () => {
    try {
      const response = await Api.getRelationship();
      setRelationship(response);
    } catch (error) {
      console.error(error);
    }
  };

  const getProfileData = async () => {
    setIsLoading(true);
    await Promise.all([getProfileDetails(), getRelationship()]);
    setIsLoading(false);
  };

  useEffect(() => {
    getProfileData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { firstName, lastName, profileDescription, avatar, city } =
    profileDetails;

  return (
    <div className="content">
      <Row>
        <Col md="9">
          <EditProfile
            profileDetails={profileDetails}
            relationship={relationship}
            isLoading={isLoading}
            getProfileDetails={getProfileDetails}
            {...props}
          />
        </Col>
        <Col md="3">
          <Card className="card-user">
            <CardBody>
              <CardText />
              <div className="author">
                <div className="block block-one" />
                <div className="block block-two" />
                <div className="block block-three" />
                <div className="block block-four" />
                <a href="#pablo" onClick={(e) => e.preventDefault()}>
                  <img
                    alt="..."
                    className="avatar"
                    src={avatar || require("Assets/img/generic-user-icon.jpg")}
                  />
                  <h5 className="title">
                    {`${firstName || ""}`} {`${lastName || ""}`}
                  </h5>
                </a>
                <p className="description">{city || ""}</p>
              </div>
              <div className="card-description">{profileDescription || ""}</div>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  userId: state.auth.userId,
  participants: state.search.participants,
});

export default connect(mapReduxStateToProps, null)(withRouter(User));
