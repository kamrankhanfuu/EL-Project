import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Table from '../../Common/Table';

const ParticipantListByProject = (props) => {
    const { participants, loading, isAccepted, handleApproveDenyInvite } = props;
    const [tableColumns, setTableColumns] = useState([
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
            Header: 'Actions',
            accessor: 'actions',
            sortable: false,
            filterable: false,
        },
    ])

    return (
        <Table
            filterable
            columns={tableColumns}
            dataTable={participants}
            loading={loading}
            actionsVisibility={{
                isAcceptInviteHidden: isAccepted,
                isRejectInviteHidden: isAccepted
              }}
            shouldReturnProps={true}
            handleApproveDenyInviteClick={handleApproveDenyInvite}
        />
    );
};

export default withRouter(ParticipantListByProject);
