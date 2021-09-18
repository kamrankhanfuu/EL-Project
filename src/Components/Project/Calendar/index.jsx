import React, { useEffect, useState } from "react";
// react component used to create a calendar with events on it
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
// dependency plugin for react-big-calendar
import moment from "moment";
// reactstrap components
import {
  Card,
  CardBody,
  Row,
  Col,
  CardTitle,
  CardHeader,
  Button,
} from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import Api from "Helpers/Api";
import { connect } from "react-redux";

const localizer = momentLocalizer(moment);

const Calendar = (props) => {
  const { id: projectId } = props.match.params;
  const [activities, setActivities] = useState([]);
  const [projectDetails, setProjectDetails] = useState({});

  const eventColors = (event, start, end, isSelected) => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      style: {backgroundColor: event.color, opacity: 1}
    };
  };

  const getAllActivityDates = async () => {
    try {
      const result = await Api.getActivitiesDatesByProjectId({
        projectId: window.atob(projectId),
      });

      const activities = [];
      for (let activity of result) {
        const transformedActivitiesDates = activity.activityDates.map((act) => {

          act.title = activity.name;
          act.allDay = true;
          act.start = act.startDate;
          act.end = act.endDate;

          return act;
        });
        activities.push(...transformedActivitiesDates);
      }

      setActivities(activities);
    } catch (error) {
      console.error("getAllActivityDates -> error", error);
    }
  };

  const getProjectDetails = async () => {
    try {
      const project = await Api.getProjectDetails(window.atob(projectId));

      setProjectDetails(project);

    } catch (error) {
      console.error("getProjectDetails -> error", error);
    }
  };

  const getInitValues = async () => {
    await Promise.all([getProjectDetails(), getAllActivityDates()]);
  };

  useEffect(() => {
    getInitValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      <Row>
        <Col className="ml-auto mr-auto" md="12">
          <Card className="card-calendar">
            <CardHeader>
              <CardTitle tag="h4" className="float-left">
                {projectDetails.name || ""} Activity Dates
              </CardTitle>
              <Link to={`/project/${projectId}/activity`}>
                <Button className="btn-link float-right mr-3" color="info">
                  <i className="tim-icons icon-minimal-left" /> Go back
                </Button>
              </Link>
            </CardHeader>
            <CardBody>
              <BigCalendar
                localizer={localizer}
                events={activities}
                defaultView="month"
                scrollToTime={new Date(1970, 1, 1, 6)}
                defaultDate={new Date()}
                eventPropGetter={eventColors}
                views={["month"]}
                />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  user: state.auth.user,
  userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(Calendar));
