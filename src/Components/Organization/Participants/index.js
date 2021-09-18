import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Row,
  Col,
  Button,
} from 'reactstrap';
import Table from '../../Common/Table';
import Api from 'Helpers/Api';
import { connect } from 'react-redux';
import moment from 'moment';
import { USER_ROLES, US_STATE_ID } from 'Helpers/constants';
import { hasRoles } from 'Helpers/utils';
import { URL_ORG_USER_REGISTRATION } from 'Helpers/urls';
import { searchParticipants } from 'Redux/Actions/search.action';
import Search from './Search';
import { getStates } from 'Helpers/address';
import participant from 'Helpers/Api/participant';

const ROLES = [USER_ROLES.ADMIN, USER_ROLES.DIRECTOR, USER_ROLES.MANAGER];

const formatDate = (format = 'MMMM DD, YYYY', value) =>
  moment(value).format(format);

const SearchResultsTable = ({ participants, totalCount }) => {
  return (
    <Table
      columns={[
        {
          Header: 'First Name',
          accessor: 'firstName',
        },
        {
          Header: 'Last Name',
          accessor: 'lastName',
        },
        {
          Header: 'Username',
          accessor: 'username',
        },
        {
          Header: 'Actions',
          accessor: 'actions',
          sortable: false,
          filterable: false,
        },
      ]}
      dataTable={participants}
      actionsVisibility={{
        isViewHidden: true,
        isEditHidden: true,
        isDeleteHidden: true,
        isParticipantOrganizationHidden: false,
      }}
      totalCount={participant.length}
    />
  );
};

const ParticipantList = (props) => {
  const { id } = props.match.params;
  const [participants, setParticipants] = useState([]);
  const [orgDetails, setOrgDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [usStates, setUsStates] = useState([]);
  const [isDisplayingSearchResults, setIsDisplayingSearchResults] =
    useState(false);
  const { user, userId } = props;

  const getOrganizationParticipants = async () => {
    try {
      const result = await Api.getOrganizationParticipants(window.atob(id));
      let orgParticipants = result
        .filter(
          (orgPart) =>
            hasRoles(user, ROLES) || orgPart.organizationUser.userId === userId
        )
        .map((orgPart) => {
          return {
            ...orgPart.participant,
            ...orgPart,
            dateOfBirth: formatDate(
              'MMMM DD, YYYY',
              orgPart.participant.userProfile.dateOfBirth
            ),
          };
        });
      setParticipants(orgParticipants);
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

  const getAllUsStates = async () => {
    try {
      const states = await getStates(US_STATE_ID);
      setUsStates(states);
    } catch (error) {
      console.error('Organization -> error', error);
    }
  };

  const getInitValues = async () => {
    setLoading(true);
    await Promise.all([
      getOrganizationParticipants(),
      getOrganizationDetails(),
      getAllUsStates(),
    ]);
    setLoading(false);
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
    const partDetails = participants.filter(
      (part) => part.id === participantId
    )[0];
    if (partDetails) props.history.push('/p/' + partDetails.username);
  };

  const handleListClick = async (participantId) => {
    await props.searchParticipants({
      ...props.participants,
      participantId,
    });
    props.history.push(
      '/organization/' +
        window.btoa(orgDetails.id) +
        '/participants/' +
        participantId +
        '/Projects'
    );
  };

  const handleCancelClick = () => props.history.goBack();

  return (
    <div className='content'>
      <Row>
        <Col xs={12} md={12}>
          <Card>
            <CardHeader>
              <CardTitle tag='h4' className='float-left'>
                Manage Participants for {orgDetails.name || ''}
              </CardTitle>
              {isDisplayingSearchResults && (
                <Link to={URL_ORG_USER_REGISTRATION}>
                  <Button color='info' className='btn-round float-right mr-3'>
                    Register Participant
                    <i className='tim-icons icon-minimal-right ml-1' />
                  </Button>
                </Link>
              )}
              <Button
                className='btn-link float-right mr-3'
                color='info'
                onClick={handleCancelClick}
              >
                <i className='tim-icons icon-minimal-left' /> Go back
              </Button>
            </CardHeader>
            <Search
              usStates={usStates}
              setParticipants={setParticipants}
              isDisplayingSearchResults={setIsDisplayingSearchResults}
            />
            <CardBody>
              {isDisplayingSearchResults ? (
                <SearchResultsTable participants={participants} />
              ) : (
                <Table
                  columns={[
                    {
                      Header: 'Name',
                      accessor: 'name',
                    },
                    {
                      Header: 'Email Id',
                      accessor: 'email',
                    },
                    {
                      Header: 'Date of Birth',
                      accessor: 'dateOfBirth',
                    },
                    {
                      Header: 'Actions',
                      accessor: 'actions',
                      sortable: false,
                    },
                  ]}
                  dataTable={participants}
                  loading={loading}
                  actionsVisibility={{
                    isViewHidden: true,
                    isEditHidden: (orgPart) =>
                      !(
                        (orgPart?.organizationUser?.manager &&
                          orgPart?.organizationUser?.manager?.userId ===
                            user?.userId) ||
                        hasRoles(user, [USER_ROLES.ADMIN, USER_ROLES.DIRECTOR])
                      ),

                    isDeleteHidden: true,
                  }}
                  handleEditClick={handleEditClick}
                  otherIcon='Projects'
                  handleOtherClick={handleListClick}
                  otherTooltip='View assigned projects'
                />
              )}
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
  withRouter(ParticipantList)
);
