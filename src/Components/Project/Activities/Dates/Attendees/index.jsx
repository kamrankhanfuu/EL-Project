import React, { useEffect, useState } from 'react';
import Api from 'Helpers/Api';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Table from 'Components/Common/Table';
import { Card, CardBody, CardHeader, CardTitle, Button } from 'reactstrap';
import moment from 'moment';
import AttendeeModal from './dialog';
import { decodeId } from 'Helpers/utils';

const ProjectActivityAttendees = (props) => {
  console.log("Props in attendees page: ", props);
  const { user } = props;
  const { id, activityId, activityDateId, orgId } = props.match.params;
  const [loading, setLoading] = useState(false);
  const [activityDateDetails, setActivityDateDetails] = useState({});
  const [activityAttendees, setActivityAttendees] = useState([]);
  const [modal, setModal] = useState({});

  const getActivityAttendees = async () => {
    setLoading(true);
    try {
      const result = await Api.getActivityAttendees({
        activityDateId: window.atob(activityDateId),
      });
      setActivityAttendees(result);
    } catch (error) {
      console.error('getProjects -> error', error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityDateDetails = async () => {
    try {
      const result = await Api.getActivityDateDetails({
        activityDateId: window.atob(activityDateId),
      });
      setActivityDateDetails(result);
    } catch (error) {
      console.error('getActivityDateDetails -> error', error);
    }
  };

  const getInitValues = async () => {
    getActivityAttendees();
    getActivityDateDetails();
  };

  useEffect(() => {
    getInitValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleMarkAttendee = async (attendeeData) => {
    if (!attendeeData.participantNotesId) {
      const result = await Api.getActivityAttendees({
        activityDateId: window.atob(activityDateId),
      });
      attendeeData.participantNotesId =
        result.length > 0 ? result[0].participantNotesId : null;
    }
    setModal({
      isOpen: true,
      name: `${attendeeData?.participant.firstName} ${attendeeData?.participant.lastName}`,
      participantNotesId: attendeeData.participantNotesId,
      participantId: attendeeData.participantId,
      activityDatesId: attendeeData.activityDatesId,
      projectId : decodeId(props.match.params.id),
      organizationId: orgId
    });
  };

  const toggleModal = () => setModal({ isOpen: false });

  return (
    <div className='content'>
      <AttendeeModal isOpen={modal?.isOpen} toggle={toggleModal} data={modal} />
      <Card>
        <CardHeader>
          <CardTitle tag='h4' className='float-left'>
            Activity Attendees for{' '}
            {activityDateDetails.startDate
              ? moment(activityDateDetails.startDate).format('MMMM DD, YYYY')
              : ''}
          </CardTitle>
          <Link to={`/project/${id}/activity/${activityId}/organization/${orgId}/dates`}>
            <Button className='btn-link float-right mr-3' color='info'>
              <i className='tim-icons icon-minimal-left' /> Go back
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              {
                Header: 'First Name',
                id: 'firstName',
                accessor: (row) => `${row?.participant.firstName || ''}`,
              },
              {
                Header: 'Last Name',
                id: 'lastName',
                accessor: (row) => `${row?.participant.lastName || ''}`,
              },
              {
                Header: 'email',
                id: 'email',
                accessor: (row) => `${row?.participant.email || ''}`,
              },
              {
                Header: 'Actions',
                accessor: 'actions',
                sortable: false,
              },
            ]}
            dataTable={activityAttendees}
            loading={loading}
            actionsVisibility={{
              isViewHidden: true,
              isEditHidden: false,
              isDeleteHidden: true,
              isDetailsHidden: false,
            }}
            handleEditClick={handleMarkAttendee}
            shouldReturnProps={true}
            tooltipMsg='Update Attendance'
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

export default connect(mapReduxStateToProps)(
  withRouter(ProjectActivityAttendees)
);
