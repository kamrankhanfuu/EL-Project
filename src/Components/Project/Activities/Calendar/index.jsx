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
import Swal from "sweetalert2";
import { connect } from "react-redux";

const localizer = momentLocalizer(moment);

const Calendar = (props) => {
  const { id, activityId } = props.match.params;
  const [activities, setActivities] = useState([]);
  const [activityDetails, setActivityDetails] = useState({});

  const eventColors = (event, start, end, isSelected) => {
    var backgroundColor = "event-";
    event.color
      ? (backgroundColor = backgroundColor + event.color)
      : (backgroundColor = backgroundColor + "default");
    return {
      style: { backgroundColor: event.color, opacity: 1 },
    };
  };

  const getActivityDates = async () => {
    try {
      const result = await Api.getActivityDates({
        activityId: window.atob(activityId),
      });

      const color = result.color;

      result.activityDates.map((act) => {
        act.title = result.name;
        act.allDay = true;
        act.color = color;
        act.start = act.startDate;
        act.end = act.endDate;
        return act;
      });
      setActivities(result.activityDates);
    } catch (error) {
      console.error("getProjectDetails -> error", error);
    }
  };

  const getActivityDetails = async () => {
    try {
      const result = await Api.getActivityDetails(window.atob(activityId));
      setActivityDetails(result);
      return result;
    } catch (error) {
      console.error("ProjectForm -> error", error);
    }
  };

  const getInitValues = async () => {
    await Promise.all([getActivityDetails(), getActivityDates()]);
  };

  useEffect(() => {
    getInitValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAttend = async (activityDatesId) => {
    try {
      await Api.attendActivity({
        activityDatesId,
        participantId: props.userId,
      });
      Swal.fire("Activity has been attended successfully!", "", "success");
    } catch (error) {
      console.error(error);
    }
  };

  const selectedEvent = (event) => {
    Swal.fire({
      title: event.title,
      html: `${event.description} <br/> Date: ${moment(event.startDate).format(
        "MMMM DD, YYYY"
      )} <br/> Location: ${event.location} <br/> Min Attendees: ${
        event.minAttendees
      } <br/> Max Attendees: ${event.maxAttendees} <br/> Start Time: ${moment(
        event.startDate
      ).format("hh:mm A")}<br/>End Time: ${moment(event.endDate).format(
        "hh:mm A"
      )}<br/>`,
      showDenyButton: true,
      showCancelButton: false,
      confirmButtonText: `Edit`,
      denyButtonText: "Attend",
    }).then((result) => {
      if (result.isConfirmed)
        props.history.push(
          `/project/${id}/activity/${activityId}/dates/${window.btoa(
            event.id
          )}/edit`
        );
      else if (result.isDenied) handleAttend(event.id);
    });
  };

  return (
    <div className="content">
      <Row>
        <Col className="ml-auto mr-auto" md="12">
          <Card className="card-calendar">
            <CardHeader>
              <CardTitle tag="h4" className="float-left">
                {activityDetails.name || ""} Activities
              </CardTitle>
              <Link to={`/project/${id}/activity`}>
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
                onSelectEvent={selectedEvent}
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
