import React, { useEffect, useState } from 'react';
import { URL_NEW_PROJECT } from 'Helpers/urls';
import Swal from 'sweetalert2';
import { withRouter, Link } from 'react-router-dom';
import { Card, CardBody, CardHeader, CardTitle, Button } from 'reactstrap';
import Table from '../Common/Table';
import { connect } from 'react-redux';
import Api from 'Helpers/Api';
import { USER_ROLES } from 'Helpers/constants';
import { hasRoles } from 'Helpers/utils';

const ProjectList = (props) => {
  const { user, userId } = props;
  const [projects, setProjects] = useState([]);
  const [actionsVisibility, setActionsVisibility] = useState({});
  const [loading, setLoading] = useState(false);

  const handleDeleteClick = async (id) => {
    try {
      await Api.deleteProject({
        id,
        deletedBy: props.userId,
      });
      let data = [...projects];
      data.find((o, i) => {
        if (o.id === id) {
          data.splice(i, 1);
          return true;
        }
        return false;
      });
      setProjects(data);
    } catch (error) {
      console.error('handleDeleteClick -> error', error);
    }
  };

  const getProjects = async () => {
    setLoading(true);
    try {
      const result = await Api.getProjects();
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
      console.error('getProjects -> error', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setActionsVisibility({
      isViewHidden: false,
      isEditHidden: (project) =>
        !(
          project.createdBy === userId ||
          hasRoles(user, [
            USER_ROLES.ADMIN,
            USER_ROLES.MANAGER,
            USER_ROLES.DIRECTOR,
          ])
        ),
      isDetailsHidden: hasRoles(user, [USER_ROLES.ADMIN]),
      isDeleteHidden: !hasRoles(user, [USER_ROLES.ADMIN]),
      isNotesViewHidden: true,
    });
    getProjects();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleEditClick = (projectId) =>
    props.history.push('/project/' + window.btoa(projectId) + '/edit');

  const handleViewClick = (projectId) =>
    props.history.push('/project/' + window.btoa(projectId) + '/view');

  const handleParticipantsClick = async (projectId) => {
    // await props.searchParticipants({ projectId: projectId });
    props.history.push('/project/' + window.btoa(projectId) + '/participants');
  };

  const deleteConfirmMessage = (projectId) =>
    Swal.fire({
      title: 'Are you sure?',
      text: 'Once deleted, you will not be able to recover this Record',
      icon: 'warning',
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: `Yes, delete it!`,
      denyButtonText: `Cancel`,
      confirmButtonColor: '#ec250d',
      cancelButtonColor: '#1d8cf8',
    }).then((willDelete) => {
      if (willDelete.isConfirmed) handleDeleteClick(projectId);
    });

  const handleProjectOrgClick = (projectId) =>
    props.history.push('/project/' + window.btoa(projectId) + '/Organizations');

  const handleActivityClick = (projectId) =>
    props.history.push('/project/' + window.btoa(projectId) + '/activity');

  return (
    <div className='content'>
      <Card>
        <CardHeader>
          <CardTitle tag='h4' className='float-left'>
            Project List
          </CardTitle>
          <Link to={URL_NEW_PROJECT}>
            <Button color='info' className='btn-round float-right mr-3'>
              New Project
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
                Filter: ({ onChange }) => (
                  <input
                    style={{ width: '100%' }}
                    placeholder='Search name'
                    onChange={(event) => onChange(event.target.value)}
                  />
                ),
              },
              {
                Header: 'Description',
                accessor: 'description',
                filterable: false,
              },
              {
                Header: 'Primary Organization',
                accessor: 'primaryOrganizationGuid',
                filterable: false,
              },
              {
                Header: 'Actions',
                accessor: 'actions',
                sortable: false,
                filterable: false,
              },
            ]}
            filterable
            dataTable={projects}
            loading={loading}
            handleDeleteClick={deleteConfirmMessage}
            handleEditClick={handleEditClick}
            handleViewClick={handleViewClick}
            actionsVisibility={actionsVisibility}
            otherIcon={<i className='tim-icons icon-bank' />}
            otherTooltip='View Organizations'
            handleOtherClick={handleProjectOrgClick}
            activityIcon={<i className='tim-icons icon-single-copy-04' />}
            handleActivityClick={handleActivityClick}
            participantsIcon={<i className='tim-icons icon-single-02' />}
            participantsTooltip='Participants'
            handleParticipantsClick={handleParticipantsClick}
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

export default connect(mapReduxStateToProps)(withRouter(ProjectList));
