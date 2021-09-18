import React, { Component } from "react";
// reactstrap components
import { Row, Col } from "reactstrap";
import Swal from "sweetalert2";
import moment from "moment";
import Table from "Components/Common/Table";
import Api from "Helpers/Api";

class Step3 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recurrenceDates: [],
    };
  }

  handleDeleteClick = async (recId) => {
    try {
      let data = [...this.state.recurrenceDates];
      data.find((o, i) => {
        if (o.id === recId) {
          data.splice(i, 1);
          return true;
        }
        return false;
      });
      this.setState({ recurrenceDates: data });
    } catch (error) {
      console.error("handleDeleteClick -> error", error);
    }
  };

  deleteConfirmMessage = (activityId) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this Record",
      icon: "warning",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `Yes, delete it!`,
      denyButtonText: `Cancel`,
      confirmButtonColor: "#ec250d",
      cancelButtonColor: "#1d8cf8",
    }).then((willDelete) => {
      if (willDelete.isConfirmed) this.handleDeleteClick(activityId);
    });
  };

  getRecurrenceDates = async () => {
    try {
      let {
        recurrenceType,
        // startTime,
        startDate,
        // endTime,
        endDate,
        allWeekDays,
        toggleWeekChanged,
        recurrence,
      } = this.props;

      if (!recurrenceType || recurrence === "One Time") {
        //  startTime = moment(startTime).format("HH:mm");
        //  endTime =  moment(endTime).format("HH:mm");
        return this.setState({
          recurrenceDates: [
            {
              id: 1,
              date: moment(startDate).format("MMMM DD, YYYY"),
              endDates: moment(endDate).format("MMMM DD, YYYY"),
              startTime: moment(startDate).format("hh:mm A"),
              endTime: moment(endDate).format("hh:mm A"),
              startDate: moment(startDate).format("YYYY-MM-DD hh:mm A"),
              endDate: moment(endDate).format("YYYY-MM-DD hh:mm A"),
            },
          ],
        });
      }

      // Combined start date + start time
      // startTime = moment(startTime).format("HH:mm");
      // let startDateTime =
      //   moment(startDate).format("YYYY-MM-DD") + " " + startTime;

      // Combined end date + end time
      // endTime = moment(endTime).format("HH:mm");
      // let endDateTime = endDate
      //   ? moment(endDate).format("YYYY-MM-DD") + " " + endTime
      //   : startDate + " " + endTime;

      const selectedeDays = allWeekDays.filter((w) => w.isChecked);
      const recurrenceDays = selectedeDays.map((d) => d.value);

      if (
        moment(startDate).isValid() &&
        moment(endDate).isValid() &&
        (new Date(startDate) < new Date(endDate) ||
          +new Date(startDate) === +new Date(endDate))
      ) {
        const response = await Api.getRecurrenceDates({
          recurrenceType: recurrenceType ? recurrenceType.value : 0,
          startDate: moment(startDate).format("YYYY-MM-DDTHH:mm:ss"),
          endDate: moment(endDate).format("YYYY-MM-DDTHH:mm:ss"),
          recurrenceDays,
        });
        response.map((res, i) => {
          res.id = i;
          res.date = moment(res.startDate).format("MMMM DD, YYYY");
          res.startTime = moment(res.startDate).format("hh:mm A");
          res.endTime = moment(res.endDate).format("hh:mm A");
          res.endDates = moment(res.endDate).format("MMMM DD, YYYY");
          return res;
        });
        await toggleWeekChanged();
        this.setState({ recurrenceDates: response });
      }
    } catch (error) {
      console.error(error);
    }
  };

  componentDidUpdate(prevProps) {
    const {
      recurrence,
      recurrenceType,
      startTime,
      endDate,
      startDate,
      endTime,
      isWeekDayChanged,
    } = this.props;

    //if prevProps.recurrence have a value then check next condition. 
    if(prevProps.recurrence !== ""){
        if (
            prevProps.recurrence !== recurrence ||
            prevProps.recurrenceType !== recurrenceType ||
            prevProps.startTime !== startTime ||
            prevProps.endDate !== endDate ||
            prevProps.endTime !== endTime ||
            prevProps.startDate !== startDate ||
            isWeekDayChanged
          ) 
          this.getRecurrenceDates();
    }
    
  }

  componentDidMount() {
    const { activityDates } = this.props.activityDetails;

    if (activityDates) {
      activityDates.map((res, i) => {
        res.id = i;
        res.date = moment(res.startDate).format("MMMM DD, YYYY");
        res.startTime = moment(res.startDate).format("hh:mm A");
        res.endTime = moment(res.endDate).format("hh:mm A");
        return res;
      });
      this.setState({ recurrenceDates: activityDates });
    }
  }

  render() {
    const { recurrenceDates } = this.state;

    return (
      <div className="content">
        <Row>
          <Col md="12">
            <Table
              columns={[
                {
                  Header: "Date",
                  accessor: "date",
                },
                {
                  Header: "Start Time",
                  accessor: "startTime",
                },
                {
                  Header: "End Date",
                  accessor: "endDates",
                },
                {
                  Header: "End Time",
                  accessor: "endTime",
                },
                {
                  Header: "Actions",
                  accessor: "actions",
                  sortable: false,
                },
              ]}
              totalCount={recurrenceDates.length}
              dataTable={recurrenceDates}
              handleDeleteClick={this.deleteConfirmMessage}
              actionsVisibility={{
                isViewHidden: true,
                isEditHidden: true,
                isDeleteHidden: true,
              }}
              isPastDateHidden={true}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export default Step3;
