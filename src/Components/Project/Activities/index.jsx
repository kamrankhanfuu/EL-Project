import React, { useEffect, useState } from 'react';
import Api from 'Helpers/Api';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import Table from 'Components/Common/Table';
import { encodeId, decodeId } from 'Helpers/utils';
import { Card, CardBody, CardHeader, CardTitle, Button } from 'reactstrap';
import Swal from 'sweetalert2';
import { useParams, useHistory } from 'react-router-dom';

const ProjectActivity = (props) => {
  const { id } = useParams();
  const history = useHistory();
  const [projectData, setProjectData] = useState({
    project: null,
    activities: [],
  });

  const [projectOrg, setOrg] = useState({})
  const [isLoading, setIsLoading] = useState(true);

  const getInitValues = (id) => {
    const projectId = decodeId(id);
    Promise.all([
      Api.getProjectDetails(projectId),
      Api.getActivities({
        projectId,
      }),
    ])
      .then(([projectDetailsResponse, projectActivitiesResponse]) => {
        setProjectData((prev) => ({
          ...prev,
          project: projectDetailsResponse,
          activities: projectActivitiesResponse,
        }));
        setOrg(projectDetailsResponse.primaryOrganizationGuid);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    getInitValues(id);
  }, [id]);

  const handleDateTimeClick = (activityId) =>
    history.push(`/project/${id}/activity/${encodeId(activityId)}/organization/${encodeId(projectOrg)}/dates`);

  const handleEditClick = (projectId) =>
    history.push(`/project/${id}/activity/${encodeId(projectId)}/edit`);

  const handleDeleteClick = async (activityId) => {
    try {
      await Api.deleteActivity(activityId);
      let activities = [...projectData.activities];
      activities.find((o, i) => {
        if (o.id === activityId) {
          activities.splice(i, 1);
          return true;
        }
        return false;
      });
      setProjectData((prev) => ({
        ...prev,
        activities,
      }));
    } catch (error) {
      console.error('handleDeleteClick -> error', error);
    }
  };

  const deleteConfirmMessage = (activityId) => {
    const activity = projectData.activities.filter(
      (o, i) => o.id === activityId
    )[0];
    Swal.fire({
      title: 'Are you sure?',
      text: `Once deleted, you will not able to recover ${activity.name || ''}`,
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
        <CardHeader className='d-flex'>
          <div className='d-flex flex-row flex-fill'>
            <CardTitle tag='h4'>
              Project Activities for {projectData?.project?.name || ''}
              <div className='d-flex align-items-center'>
                <Link to={`/project/${id}/calendar/`}>
                  <Button
                    className='btn-link p-0 d-flex align-items-center'
                    color='info'
                  >
                    <i className='tim-icons icon-calendar-60 mr-1' /> View
                    Calendar
                  </Button>
                </Link>
              </div>
            </CardTitle>
          </div>
          <div className='d-flex align-items-center'>
            <Link to={`/project`}>
              <Button className='btn-link float-right mr-3' color='info'>
                <i className='tim-icons icon-minimal-left' /> Go back
              </Button>
            </Link>
            <Link to={`/project/${id}/activity/new`}>
              <Button color='info' className='btn-round float-right mr-3'>
                New Project Activity
                <i className='tim-icons icon-minimal-right ml-1' />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              {
                Header: 'Name',
                accessor: 'name',
              },
              {
                Header: 'Description',
                accessor: 'description',
              },
              {
                Header: 'Site Name',
                accessor: 'location',
              },
              {
                Header: 'Actions',
                accessor: 'actions',
                sortable: false,
              },
            ]}
            dataTable={projectData.activities}
            loading={isLoading}
            // viewIcon={<i className='tim-icons icon-watch-time' />}
            handleViewClick={handleDateTimeClick}
            handleDeleteClick={deleteConfirmMessage}
            handleEditClick={handleEditClick}
            actionsVisibility={{
              isViewHidden: false,
              isEditHidden: false,
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

export default connect(mapReduxStateToProps)(withRouter(ProjectActivity));
