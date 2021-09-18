import React, { useCallback, useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle, Button } from "reactstrap";
import Table from "Components/Common/Table";
import { connect } from "react-redux";
import Api from "Helpers/Api";
import Swal from "sweetalert2";
import { PER_PAGE } from "Helpers/constants";

const ParticipantList = (props) => {
  const [participants, setParticipants] = useState([]);
  const [orgUsers, setOrgUsers] = useState({});
  const [loading, setLoading] = useState(false);
  const [totalCount, setTotalCount] = useState([]);

  const getParticipants = async (page = 1) => {
    try {
      const result = await Api.getSearchParticipants({
        ...props.participants,
        skip: page * PER_PAGE,
        take: PER_PAGE,
      });
      setParticipants(result);
      if (result.length > 0) setTotalCount(result[0].overallCount);
    } catch (error) {
      console.error("getParticipants -> error", error);
    }
  };

  const getOrgUsers = useCallback(async () => {
    try {
      const result = await Api.getOrganizationUsers(
        props.participants.organizationId
      );
      let orgUsersSelect = {};
      result.forEach((details) => {
        orgUsersSelect[details.id] = details.user.name;
      });
      setOrgUsers(orgUsersSelect);
    } catch (error) {
      console.error("getParticipants -> error", error);
    }
  }, [props.participants.organizationId]);

  const getInitData = async () => {
    setLoading(true);
    await getOrgUsers();
    setLoading(false);
  };

  useEffect(() => {
    getInitData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAssociatedClick = (participant) => {
    if (!participant.isExisting) {
      Swal.fire({
        title: "Choose case manager",
        input: "select",
        inputValue: "Case Manager",
        inputOptions: orgUsers,
        inputAttributes: {
          autocapitalize: "off",
        },
        showCancelButton: true,
        confirmButtonText: "Add",
        showLoaderOnConfirm: true,
        preConfirm: async (userId) => {
          await Api.attachParticipant({
            organizationUserId: userId,
            participantId: participant.userId,
          });
        },
        allowOutsideClick: () => !Swal.isLoading(),
      }).then((result) => {
        if (result.isConfirmed) {
          handleCancelClick();
        }
      });
    }
  };

  const fetchData = async (state, instance) => {
    setLoading(true);
    getParticipants(state.page);
    setLoading(false);
  };

  const handleCancelClick = () => props.history.goBack();

  return (
    <div className="content">
      <Card>
        <CardHeader>
          <CardTitle tag="h4" className="float-left">
            Participant Associated organizations
          </CardTitle>
          <Button
            className="btn-link float-right mr-3"
            color="info"
            onClick={handleCancelClick}
          >
            <i className="tim-icons icon-minimal-left" /> Go back
          </Button>
        </CardHeader>
        <CardBody>
          <Table
            columns={[
              {
                Header: "First Name",
                accessor: "firstName",
              },
              {
                Header: "Last Name",
                accessor: "lastName",
              },
              {
                Header: "Username",
                accessor: "username",
              },
              {
                Header: "Associated",
                accessor: "actions",
                sortable: false,
              },
            ]}
            dataTable={participants}
            loading={loading}
            handleViewClick={handleAssociatedClick}
            actionsVisibility={{
              isViewHidden: false,
              isEditHidden: true,
              isDeleteHidden: true,
            }}
            isAssociatedLabel={true}
            isManual={true}
            fetchData={fetchData}
            totalCount={totalCount}
            isYesNoFlag={true}
          />
        </CardBody>
      </Card>
    </div>
  );
};

const mapReduxStateToProps = (state) => ({
  user: state.auth.user,
  userId: state.auth.userId,
  participants: state.search.participants,
});

export default connect(mapReduxStateToProps)(withRouter(ParticipantList));
