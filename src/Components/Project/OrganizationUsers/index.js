import React, { useEffect, useState } from 'react';
import Api from '../../../Helpers/Api';
import Table from '../../Common/Table';
import { Card, CardBody, CardHeader, CardTitle } from 'reactstrap';

const OrganizationUsers = ({ id }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getUsers = async () => {
      setLoading(true);
      try {
        const result = await Api.getOrganizationUserByProjectId({
          projectId: id,
        });
        if (result) {
          let data = [];
          result.forEach((val) => {
            data.push(val);
          });
          setUsers(data);
          setLoading(false);
        }
      } catch (e) {
        setLoading(false);
        setUsers([]);
      }
    };
    getUsers();
  }, [id]);

  return (
    <>
      {loading ? (
        <div></div>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle tag='h4'>Organization User Listing</CardTitle>
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
                    Header: 'Email',
                    accessor: 'email',
                    filterable: false,
                  },
                  {
                    Header: 'Actions',
                    accessor: 'actions',
                    filterable: false,
                    sortable: false,
                  },
                ]}
                actionsVisibility={{
                  isViewHidden: true,
                  isEditHidden: true,
                  isDeleteHidden: false,
                }}
                dataTable={users}
                filterable
                handleDeleteClick={() => {
                  console.log('Delete');
                }}
                handleEditClick={() => {
                  console.log('Edit');
                }}
                handleViewClick={() => {
                  console.log('View');
                }}
              ></Table>
            </CardBody>
          </Card>
        </>
      )}
    </>
  );
};

export default OrganizationUsers;
