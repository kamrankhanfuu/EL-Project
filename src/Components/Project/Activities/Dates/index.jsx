import React, { useEffect, useState } from 'react';
import Api from 'Helpers/Api';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Table from 'Components/Common/Table';
import { Card, CardBody, CardHeader, CardTitle, Button } from 'reactstrap';
import moment from 'moment';
import Swal from 'sweetalert2';

const ProjectActivityDates = (props) => {
  const { id, activityId, orgId } = props.match.params;
  const [activityDetails, setActivityDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  const getActivity = async () => {
    setLoading(true);
    try {
      const result = await Api.getActivityDates({
        activityId: window.atob(activityId),
      });
      setActivityDetails(result);
    } catch (error) {
      console.error('getProjects -> error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getActivity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = (activityDateId) =>
    props.history.push(
      `/project/${id}/activity/${activityId}/dates/${window.btoa(
        activityDateId
      )}/edit`
    );

  const handleAttendeesClick = (activityDateId) =>
    props.history.push(
      `/project/${id}/activity/${activityId}/organization/${orgId}/dates/${window.btoa(
        activityDateId
      )}/attendees`
    );

  const handleDeleteClick = async (activityDateId) => {
    try {
      await Api.deleteActivityDate({
        activityDateId,
      });
      getActivity();
    } catch (err) {
      console.log(err.message);
    }
  };

  const deleteConfirmMessage = (activityId) => {
    Swal.fire({
      title: 'Are you sure?',
      text: `Once deleted, you will not able to recover this Activity Date`,
      icon: 'warning',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `Yes, delete it!`,
      denyButtonText: `Cancel`,
      confirmButtonColor: '#ec250d',
      cancelButtonColor: '#1d8cf8',
    }).then((willDelete) => {
      if (willDelete.isConfirmed) handleDeleteClick(activityId);
    });
  };

  return (
    <div className='content'>
      <Card>
        <CardHeader>
          <CardTitle tag='h4' className='float-left'>
            Project Activity Dates for {activityDetails.name || ''}
          </CardTitle>
          <Link to={`/project/${id}/activity/${activityId}/assign-participant`}>
            <Button color='info' className='btn-round float-right mr-3'>
              Assign a participant
              <i className='tim-icons icon-minimal-right ml-1' />
            </Button>
          </Link>
          <Link to={`/project/${id}/activity`}>
            <Button className='btn-link float-right mr-3' color='info'>
              <i className='tim-icons icon-minimal-left' /> Go back
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              {
                Header: 'Start Date',
                accessor: 'startDate',
                Cell: ({ row: { startDate } }) =>
                  moment(startDate).format('MMMM DD, YYYY'),
              },
              {
                Header: 'End Date',
                accessor: 'endDate',
                Cell: ({ row: { endDate } }) =>
                  moment(endDate).format('MMMM DD, YYYY'),
              },
              {
                Header: 'Start Time',
                accessor: 'startDate',
                Cell: ({ row: { startDate } }) =>
                  moment(startDate).format('hh:mm A'),
              },
              {
                Header: 'End Time',
                accessor: 'endDate',
                Cell: ({ row: { endDate } }) =>
                  moment(endDate).format('hh:mm A'),
              },
              {
                Header: 'Total Attendees',
                accessor: 'totalAttendees',
              },
              {
                Header: 'Actions',
                accessor: 'actions',
                sortable: false,
              },
            ]}
            dataTable={activityDetails?.activityDates || []}
            loading={loading}
            handleEditClick={handleEditClick}
            handleDeleteClick={deleteConfirmMessage}
            isPastDateEditHidden={true}
            otherIcon={<i className='tim-icons icon-single-02' />}
            handleOtherClick={handleAttendeesClick}
            actionsVisibility={{
              isViewHidden: true,
              isEditHidden: true,
              isDeleteHidden: false,
              isDetailsHidden: false,
            }}
          />
        </CardBody>
      </Card>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  user: state.auth.user,
  userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(ProjectActivityDates));
