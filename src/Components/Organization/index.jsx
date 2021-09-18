import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { withRouter, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, Button } from 'reactstrap';
import Table from '../Common/Table';
import { connect } from 'react-redux';
import { URL_NEW_ORGANIZATION } from 'Helpers/urls';
import Api from 'Helpers/Api';
import querystring from 'querystring';
import { searchParticipants } from 'Redux/Actions/search.action';
import { USER_ROLES } from 'Helpers/constants';

const OrganizationList = (props) => {
  const { user } = props;
  const id = querystring.parse(props.location.search)['id'];
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleEditClick = (orgId) =>
    props.history.push('/organization/' + window.btoa(orgId) + '/edit');

  const handleViewClick = (orgId) =>
    props.history.push('/organization/' + window.btoa(orgId) + '/user');

  const handleDeleteClick = (orgId) => {
    let org = organizations.find((organization) => organization.id === orgId);
    Swal.fire({
      title: 'Are you sure?',
      text: `Once deleted, you will not be able to recover ${org.name}`,
      icon: 'warning',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `Yes, delete it!`,
      denyButtonText: `Cancel`,
      confirmButtonColor: '#ec250d',
      cancelButtonColor: '#1d8cf8',
    }).then((willDelete) => {
      if (willDelete.isConfirmed) {
        deleteOrganization(orgId);
        getOrganizations();
      }
    });
  };

  const deleteOrganization = async (orgId) => {
    try {
      const response = await Api.deleteOrganization({
        id: orgId,
        deletedBy: props.userId,
      });
      if (response.message !== 'Ok') {
        return Swal.fire({
          icon: 'error',
          title: response.message,
        });
      }
      let data = [...organizations];
      data.find((o, i) => {
        if (o.id === orgId) {
          data.splice(i, 1);
          return true;
        }
        return false;
      });
      setOrganizations(data);
    } catch (error) {
      console.error('deleteOrganization -> error', error);
    }
  };

  const getOrganizations = async () => {
    setLoading(true);
    try {
      const result = await Api.getCurrentOrganizations();
      setOrganizations(result);
    } catch (error) {
      console.error('getOrganizations -> error', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptInvitation = async () => {
    try {
      await Api.acceptInvitation(id);
    } catch (error) {
      console.error(error);
    }
  }; 
  
  useEffect(() => {
    if (id) acceptInvitation();
    getOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, id]);

  const handleParticipantsClick = async (orgId) => {
    await props.searchParticipants({ organizationId: orgId });
    props.history.push('/organization/' + window.btoa(orgId) + '/participants');
  };

  const handleDetailsClick = async (orgId) => {
    props.history.push({
      pathname: '/organization/' + window.btoa(orgId) + '/details',
      state: {
        idx: orgId
      }
    });
  };
      
  return (
    <div className='content'>
      <Card>
        <CardHeader>
          <CardTitle tag='h4' className='float-left'>
            Organization List
          </CardTitle>
          <Link to={URL_NEW_ORGANIZATION}>
            <Button color='info' className='btn-round float-right mr-3'>
              New Organization
              <i className='tim-icons icon-minimal-right ml-1' />
            </Button>
          </Link>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              {
                Header: 'Name',
                accessor: 'name',
              },
              {
                Header: 'City',
                accessor: 'city',
              },
              {
                Header: 'State',
                accessor: 'state',
              },

              {
                Header: 'Actions',
                accessor: 'actions',
                sortable: false,
              },
            ]}
            dataTable={organizations}
            loading={loading}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick} 
            actionsVisibility={{
              isViewHidden: false,
              isEditHidden: false,
              isDeleteHidden: false,  
            }}
            
            handleViewClick={handleDetailsClick}
            otherIcon={<i className='tim-icons icon-single-02' />}
            otherTooltip='View Users'
            handleOtherClick={handleViewClick}
            participantsIcon={<i className='tim-icons icon-badge' />}
            participantsTooltip='Participants'
            handleParticipantsClick={handleParticipantsClick}
          
            deleteRole={[USER_ROLES.ADMIN]}
            editRole={[USER_ROLES.ADMIN, USER_ROLES.DIRECTOR]}
            viewRole={[
              USER_ROLES.ADMIN,
              USER_ROLES.DIRECTOR,
              USER_ROLES.MANAGER,
            ]}
            otherRole={[
              USER_ROLES.ADMIN,
              USER_ROLES.DIRECTOR,
              USER_ROLES.USER,
              USER_ROLES.MANAGER,
            ]}
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

export default connect(mapReduxStateToProps, { searchParticipants })(
  withRouter(OrganizationList)
);
