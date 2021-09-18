import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
import { Card, CardBody, CardHeader, CardTitle, Row, Col } from "reactstrap";
import Table from "../../Common/Table";
import Invite from "./invite";
import Api from "Helpers/Api";
import { connect } from "react-redux";

const UserList = (props) => {
  const { id } = props.match.params;
  const [users, setUsers] = useState([]);
  const [orgDetails, setOrgDetails] = useState({});
  const [loading, setLoading] = useState(false);

  const deleteOrganizationUser = async (userId) => {
    try {
      await Api.deleteOrganizationUser({
        userId,
        organizationId: window.atob(id),
        deletedBy: props.userId,
      });
      let data = [...users];
      data.find((o, i) => {
        if (o.id === userId) {
          data.splice(i, 1);
          return true;
        }
        return false;
      });
      setUsers(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteClick = (id) =>
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
      if (willDelete.isConfirmed) deleteOrganizationUser(id);
    });

  const getOrganizationUsers = async () => {
    try {
      const result = await Api.getOrganizationUsers(window.atob(id));
      // Adding required field
      result.map((orgUser) => {
        orgUser.id = orgUser.userId;
        orgUser.username = orgUser.user.username;
        orgUser.name = orgUser.user.name;
        orgUser.email = orgUser.user.email;
        return orgUser;
      });
      setUsers(result);
    } catch (error) {
      console.error("getOrganizations -> error", error);
    }
  };

  const getOrganizationDetails = async () => {
    try {
      const result = await Api.getOrganizationById(window.atob(id));
      setOrgDetails(result);
    } catch (error) {
      console.error("getOrganizations -> error", error);
    }
  };

  const getInitValues = async () => {
    setLoading(true);
    await Promise.all([getOrganizationUsers(), getOrganizationDetails()]);
    setLoading(false);
  };

  useEffect(() => {
    getInitValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="content">
      <Row>
        <Col xs={12} md={12}>
          <Invite
            handleAddUser={getOrganizationUsers}
            orgDetails={orgDetails}
          />
        </Col>
        <Col xs={12} md={12}>
          <Card>
            <CardHeader>
              <CardTitle tag="h4" className="float-left">
                Manage Users for {orgDetails.name || ""}
              </CardTitle>
            </CardHeader>
            <CardBody>
              <Table
                columns={[
                  {
                    Header: "Name",
                    accessor: "name",
                  },
                  {
                    Header: "Email Id",
                    accessor: "email",
                  },
                  {
                    Header: "Username",
                    accessor: "username",
                  },
                  {
                    Header: "Actions",
                    accessor: "actions",
                    sortable: false,
                  },
                ]}
                dataTable={users}
                loading={loading}
                handleDeleteClick={handleDeleteClick}
                actionsVisibility={{
                  isViewHidden: true,
                  isEditHidden: true,
                  isDeleteHidden: true,
                }}
                orgCreatedId={orgDetails.createdBy || ""}
                isPrimaryUserHidden={true}
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
});

export default connect(mapReduxStateToProps)(withRouter(UserList));
