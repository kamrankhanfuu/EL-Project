import React, { useState, useEffect, useMemo } from 'react';
import Api from 'Helpers/Api';
import Swal from 'sweetalert2';
import moment from 'moment';
import { connect } from 'react-redux';
import Table from '../../Common/Table';
import { withRouter } from 'react-router-dom';
import { orgPrimaryCompare } from 'Helpers/utils';

const ProjectOrganization = (props) => {
  const { id } = props.match.params;
  const { hasInvited, projectDetails } = props;
  const [loading, setLoading] = useState(false);
  const [organizations, setOrganizations] = useState([]);

  const getOrganizations = async () => {
    setLoading(true);
    try {
      const result = await Api.getProjectOrganizations({
        projectId: window.atob(id),
      });
      // Adding required field
      result.map((org) => {
        org.id = org.organizationId;
        org.name = org.organization.name;
        org.state = org.organization.state;
        org.city = org.organization.city;
        // Adding primary organization name field
        if (org.invitationStatus === 'PRIMARY') org.isPrimary = true;
        else org.isPrimary = false;
        return org;
      });
      setOrganizations(result);
    } catch (error) {
      console.error('getOrganizations -> error', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (id) => {
    let data = [...organizations];
    const orgData = data.find((org) => {
      if (org.id === id) return org;
      return false;
    });

    if (orgData.invitationStatus === 'PRIMARY')
      return Swal.fire({
        title: 'Warning!',
        text: 'Primary organization cannot be deleted',
        icon: 'warning',
      });

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
      if (willDelete.isConfirmed) deleteOrganization(id);
    });
  };

  const deleteOrganization = async (orgId) => {
    try {
      await Api.deleteProjectOrganization({
        projectId: window.atob(id),
        organizationId: orgId,
        deletedBy: props.userId,
        deletedDate: moment(),
      });
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

  const handleViewClick = (id) => {
    props.history.push(
      '/organization/' + window.btoa(id.organizationId) + '/user'
    );
  };

  useEffect(() => {
    getOrganizations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasInvited]);

  const tableData = useMemo(() => {
    const data = organizations.sort((a, b) => {
      return orgPrimaryCompare(a, b);
    });
    return data;
  }, [organizations]);

  return (
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
          Header: 'Status',
          accessor: 'invitationStatus',
        },
        {
          Header: 'Actions',
          accessor: 'actions',
          sortable: false,
        },
      ]}
      dataTable={tableData}
      handleDeleteClick={handleDeleteClick}
      viewIcon={<i className='tim-icons icon-single-02' />}
      viewTooltip={'View Users'}
      handleViewClick={handleViewClick}
      shouldReturnProps={true}
      loading={loading}
      actionsVisibility={{
        isViewHidden: false,
        isEditHidden: true,
        isDeleteHidden: true,
        isDeltailsHidden: false,
      }}
      isPrimaryOrgHidden={true}
      primaryOrganization={projectDetails.primaryOrganizationGuid || ''}
    />
  );
};

const mapReduxStateToProps = (state) => ({
  userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(ProjectOrganization));
