import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
} from 'reactstrap';
import Table from '../../../Common/Table';
import Api from 'Helpers/Api';
import { connect } from 'react-redux';
import moment from 'moment';
import { USER_ROLES } from 'Helpers/constants';
import { hasRoles } from 'Helpers/utils';
import { searchParticipants } from 'Redux/Actions/search.action';
import { encodeId } from 'Helpers/utils';
let tableColumns = [];

const ParticipantListByOrganization = (props) => {
  const { id } = props.match.params;
  const [participants, setParticipants] = useState([]);
  const [orgDetails, setOrgDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [canModify, setCanModify] = useState(false);
  const { user, userId } = props;

  const getOrganizationParticipants = async () => {
    try {
      const result = await Api.getOrganizationParticipants(window.atob(id));
      let orgParticipants = [];
      result
        .filter(
          (orgPart) =>
            hasRoles(user, [
              USER_ROLES.ADMIN,
              USER_ROLES.DIRECTOR,
              USER_ROLES.MANAGER,
            ]) || orgPart.organizationUser.userId === userId
        )
        .forEach((orgPart) => {
          orgParticipants.push({
            ...orgPart.participant,
            ...orgPart,
            dateOfBirth: moment(
              orgPart.participant.userProfile.dateOfBirth
            ).format('MMMM DD, YYYY'),
            city: orgPart.participant.userProfile?.userContact?.city,
            state: orgPart.participant.userProfile?.userContact?.state,
            assignedTo: orgPart.organizationUser?.user?.name,
          });
        });
      setParticipants(orgParticipants);
      
      const modify = orgParticipants
        .map((item) => item.organizationUser.canModify)
        .find((subItem) => subItem === true);
        setCanModify(modify);
    } catch (error) {
      console.error('getOrganizationParticipants -> error', error);
    }
  };

  const getOrganizationDetails = async () => {
    try {
      const result = await Api.getOrganizationById(window.atob(id));
      setOrgDetails(result);
    } catch (error) {
      console.error('getOrganizationDetails -> error', error);
    }
  };

  const getInitValues = async () => {
    setLoading(true);
    setTableColumns();
    if (
      hasRoles(user, [
        USER_ROLES.ADMIN,
        USER_ROLES.MANAGER,
        USER_ROLES.DIRECTOR,
      ])
    ) {
      tableColumns.push({
        Header: 'Actions',
        accessor: 'actions',
        sortable: false,
        filterable: false,
      });
    }

    await Promise.all([
      getOrganizationParticipants(),
      getOrganizationDetails(),
    ]);
    setLoading(false);
  };

  const setTableColumns = () => {
    tableColumns = [
      {
        Header: 'Name',
        accessor: 'name',
        Filter: ({ onChange }) => (
          <input
            style={{ width: '100%' }}
            placeholder='Search name'
            onChange={(event) => onChange(event.target.value)}
          />
        ),
      },
      {
        Header: 'City',
        accessor: 'city',
        filterable: false,
      },
      {
        Header: 'State',
        accessor: 'state',
        filterable: false,
      },
      {
        Header: 'Date of Birth',
        accessor: 'dateOfBirth',
        filterable: false,
      },
      {
        Header: 'Assigned to',
        accessor: 'assignedTo',
        filterable: false,
      },
      {
        Header: 'Actions',
        accessor: 'actions',
        sortable: false,
        filterable: false,
      },
    ];
  };

  useEffect(() => {
    getInitValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEditClick = async (participantId) => {
    await props.searchParticipants({
      ...props.participants,
      participantId,
    });
    const partDetails = participants.find(
      (part) => part.id === participantId.id
    );
    window.open('/p/' + partDetails.username, "_blank");
  };
 
  const handleOrgParticipantDeleteClick = (organizationUserId, participantId) => {
    let participant = participants.find((item) => item.id === participantId);
    Swal.fire({
      title: 'Are you sure?',
      text: `Once deleted, you will not be able to recover ${participant.name}`,
      icon: 'warning',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `Yes, delete it!`,
      denyButtonText: `Cancel`,
      confirmButtonColor: '#ec250d',
      cancelButtonColor: '#1d8cf8',
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        removeOrganizationParticipant(organizationUserId, participantId)
        // getInitValues();
      }
    });
  };

  const removeOrganizationParticipant = async (organizationUserId, participantId) => {
    try {
      const response = await Api.removeParticipant(organizationUserId, participantId);
      if (response.statusCode !== 200) {
        return Swal.fire({
          icon: 'error',
          title: response.message,
        });
      }
      let data = [...participants];
      data.find((o, i) => {
        if (o.id === participantId) {
          data.splice(i, 1);
          return true;
        }
        return false;
      });
      setParticipants(data);
    } catch (error) {
      console.error('deleteParticipant -> error', error);
    }
  }

  const handleViewNotes = (id) => {
    props.history.push('/participant/' + encodeId(id) + '/notes'); 
  };

  // const canModify = participants
  //   .map((item) => item.organizationUser.canModify)
  //   .find((subItem) => subItem === true);

  return (
    <div className='content'>
      <Row>
        <Col xs={12} md={12}>
          <Card>
            <CardHeader>
              <CardTitle tag='h4' className='float-left'>
                Manage Participants for {orgDetails.name || ''}
              </CardTitle>
              <Link
                to={`/organization/${window.btoa(
                  orgDetails.id
                )}/participants-search`}
              >
                <Button color='info' className='btn-round float-right mr-3'>
                  New Participant
                  <i className='tim-icons icon-minimal-right ml-1' />
                </Button>
              </Link>
              <Link to={`/organization`}>
                <Button className='btn-link float-right mr-3' color='info'>
                  <i className='tim-icons icon-minimal-left' /> Go back
                </Button>
              </Link>
            </CardHeader>
            <CardBody>
              <Table
                filterable
                columns={tableColumns}
                dataTable={participants}
                loading={loading}
                actionsVisibility={{
                  isViewHidden: true,
                  isEditHidden: !canModify,
                  isDeleteHidden: canModify, 
                  isDeleteOrgParticipantHidden: !canModify,
                  isNotesViewHidden: !canModify
                }}
                handleEditClick={handleEditClick} 
                handleOrgParticipantDeleteClick={handleOrgParticipantDeleteClick}
                handleViewNotes={handleViewNotes}
                shouldReturnProps={true}
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
  participants: state.search.participants,
});

export default connect(mapReduxStateToProps, { searchParticipants })(
  withRouter(ParticipantListByOrganization)
);
