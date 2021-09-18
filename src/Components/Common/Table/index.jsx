import React from 'react';
import ReactTable from 'react-table';
import { Button } from 'reactstrap';
import Switch from 'react-bootstrap-switch';
import moment from 'moment';
import { PER_PAGE, ACCEPTDENYACTION } from 'Helpers/constants';
import PropTypes from 'prop-types';
import TooltipElement from 'Components/Common/Tooltip';
import { hasRoles } from 'Helpers/utils';
import { USER_ROLES } from 'Helpers/constants';
import { EyeIcon } from './eye-icon';
import { Link } from 'react-router-dom';
import { URL_ORG_USER_REGISTRATION } from 'Helpers/urls';

// TODO: This component is use in many places,
// it must be refactored later on.
const Table = ({
  columns,
  dataTable,
  handleDeleteClick,
  handleOrgParticipantDeleteClick,
  actionsVisibility: {
    isEditHidden,
    isDeleteHidden,
    isDetailsHidden,
    isViewHidden,
    isDeleteOrgParticipantHidden,
    isParticipantOrganizationHidden,
    isNotesViewHidden,
    isAcceptInviteHidden,
    isRejectInviteHidden
  },
  handleEditClick,
  handleViewNotes,
  handleViewClick,
  handleOtherClick,
  handleDetailsClick,
  handleParticipantsClick,
  handleApproveDenyInviteClick,
  otherTooltip,
  viewTooltip,
  participantsTooltip,
  activityDetail,
  viewIcon,
  otherIcon,
  participantsIcon,
  loading,
  filterable = false,
  activityIcon = '',
  handleActivityClick,
  isPrimaryUserHidden = false,
  orgCreatedId = '',
  isPastDateHidden = false,
  isPastDateEditHidden = false,
  isToggleBtn = false,
  handleSwitchChange,
  applyIcon,
  handleApplyClick,
  isPrimaryOrgHidden = false,
  primaryOrganization = '',
  handleActivityDetailClick,
  isManual = false,
  fetchData,
  totalCount,
  isYesNoFlag = false,
  shouldReturnProps = false,
  tooltipMsg = '',
  deleteRole = [USER_ROLES.ADMIN],
  editRole = [USER_ROLES.ADMIN],
  detilsRole = [USER_ROLES.ADMIN],
  viewRole = [USER_ROLES.ADMIN],
  otherRole = [USER_ROLES.ADMIN],
  inviteAcceptRole = [USER_ROLES.ADMIN],
  inviteRejectRole = [USER_ROLES.ADMIN],
}) => {
  const mapResults = (data) =>
    data.map((prop) => {
      const activityTooltip = (
        <TooltipElement id={`tooltip-activity-${prop.id}`} position='top'>
          View Activities
        </TooltipElement>
      );
      return {
        ...prop,
        //NOTE: This must match the accessor prop we defined in the columns Array
        actions: (
          <div className='actions-right'>
            {activityDetail && (
              <>
                <Button
                  id={`tooltip-activity-${prop.id}`}
                  onClick={() => handleActivityDetailClick(prop.id)}
                  color='info'
                  size='sm'
                  className='btn-link like'
                  name='Activity details'
                >
                  {activityDetail}
                </Button>
                {activityTooltip}
              </>
            )}
            {activityIcon && (
              <>
                <Button
                  id={`tooltip-activity-${prop.id}`}
                  onClick={() => handleActivityClick(prop.id)}
                  color='info'
                  size='sm'
                  className='btn-link like'
                  name='Activity icon'
                >
                  {activityIcon}
                </Button>
                {activityTooltip}
              </>
            )}
            {/* use this button to view kind of action */}
            {otherIcon && (
              <>
                <Button
                  id={`tooltip-other-${prop.id}`}
                  onClick={() => handleOtherClick(prop.id)}
                  color='info'
                  size='sm'
                  className='btn-link like'
                  name='Other icon'
                >
                  {otherIcon}
                </Button>
                {otherTooltip && (
                  <TooltipElement
                    id={`tooltip-other-${prop.id}`}
                    placement='top'
                  >
                    {otherTooltip}
                  </TooltipElement>
                )}
              </>
            )}
            {participantsIcon && (
              <>
                <Button
                  id={`tooltip-participants-${prop.id}`}
                  onClick={() => handleParticipantsClick(prop.id)}
                  color='info'
                  size='sm'
                  className='btn-link like'
                  name='Participants icon'
                >
                  {participantsIcon}
                </Button>
                {participantsTooltip && (
                  <TooltipElement
                    id={`tooltip-participants-${prop.id}`}
                    placement='top'
                  >
                    {participantsTooltip}
                  </TooltipElement>
                )}
              </>
            )}
            {/* use this button to apply kind of action */}
            {applyIcon && (
              <Button
                onClick={() => handleApplyClick(prop.id)}
                color='info'
                size='sm'
                className='btn-link like'
                disabled={prop.status === 1}
                name='Apply icon'
              >
                {applyIcon}
              </Button>
            )}

            {/* use this button to view kind of action */}
            {isViewHidden === false &&
              hasRoles(
                { roles: [prop.roleId ? prop.roleId : USER_ROLES.ADMIN] },
                viewRole
              ) && (
                <>
                  <Button
                    id={`tooltip-view-${prop.id}`}
                    onClick={() =>
                      handleViewClick(
                        isYesNoFlag || shouldReturnProps ? prop : prop.id
                      )
                    }
                    color='info'
                    size='sm'
                    className='btn-link like'
                    name='View icon'
                  >
                    {isYesNoFlag
                      ? prop.isExisting
                        ? 'YES'
                        : 'No'
                      : viewIcon
                        ? viewIcon
                        : EyeIcon}
                  </Button>
                  <TooltipElement position='top' id={`tooltip-view-${prop.id}`}>
                    {!viewIcon && 'View Details'}
                    {viewIcon && (viewTooltip ? viewTooltip : 'View Users')}
                  </TooltipElement>
                </>
              )}
            {/* use this button to see participant notes */}
            {(isNotesViewHidden === false) && hasRoles(
              { roles: [prop.roleId ? prop.roleId : USER_ROLES.ADMIN] },
              deleteRole
            ) && (
                <Button
                  id={`NoteBtn-${prop.id}`}
                  onClick={() => handleViewNotes(prop.id)}
                  color='primary'
                  size='sm'
                  className='btn-icon btn-link like'
                  name='Note icon'
                >
                  <TooltipElement id={`NoteBtn-${prop.id}`} position='top'>
                    Notes
                  </TooltipElement>
                  <i className='tim-icons icon-notes' />
                </Button>
              )}
            {isDetailsHidden &&
              hasRoles(
                { roles: [prop.roleId ? prop.roleId : USER_ROLES.ADMIN] },
                detilsRole
              ) && (
                <Button
                  id={`DetailsBtn-${prop.id}`}
                  onClick={() =>
                    handleDetailsClick(shouldReturnProps ? prop : prop.id)
                  }
                  color='warning'
                  size='sm'
                  className='btn-icon btn-link like'
                  name='Detailsicon'
                >
                  <TooltipElement id={`DetailsBtn-${prop.id}`} position='top'>
                    {tooltipMsg ? tooltipMsg : 'Details'}
                  </TooltipElement>
                  {EyeIcon}
                </Button>
              )}
            {/* use this button to add a edit kind of action */}
            {((typeof isEditHidden === 'function' && !isEditHidden(prop)) ||
              isEditHidden === false) &&
              hasRoles(
                { roles: [prop.roleId ? prop.roleId : USER_ROLES.ADMIN] },
                editRole
              ) && (
                <Button
                  id={`EditBtn-${prop.id}`}
                  onClick={() =>
                    handleEditClick(shouldReturnProps ? prop : prop.id)
                  }
                  color='warning'
                  size='sm'
                  className='btn-icon btn-link like'
                  name='Edit icon'
                >
                  <TooltipElement id={`EditBtn-${prop.id}`} position='top'>
                    {tooltipMsg ? tooltipMsg : 'Edit'}
                  </TooltipElement>
                  <i className='tim-icons icon-pencil' />
                </Button>
              )}
            {/* use this button to Hide past date data row for Activity */}
            {isPastDateEditHidden && moment().diff(prop.date) <= 0 && (
              <Button
                onClick={() => handleEditClick(prop.id)}
                color='warning'
                size='sm'
                className='btn-icon btn-link like'
                name='Hide past date'
              >
                <i className='tim-icons icon-pencil' />
              </Button>
            )}
            {/* use this button to remove the data row */}
            {isDeleteHidden === false &&
              hasRoles(
                { roles: [prop.roleId ? prop.roleId : USER_ROLES.ADMIN] },
                deleteRole
              ) && (
                <Button
                  id={`RemoveBtn-${prop.id}`}
                  onClick={() => handleDeleteClick(prop.id)}
                  color='danger'
                  size='sm'
                  className='btn-icon btn-link like'
                  name='Remove icon'
                >
                  <TooltipElement id={`RemoveBtn-${prop.id}`} position='top'>
                    Remove
                  </TooltipElement>
                  <i className='tim-icons icon-trash-simple' />
                </Button>
              )}
            {/* use this button to remove the org participant data row */}
            {isDeleteHidden === true && isDeleteOrgParticipantHidden === false && (
              <Button
                id={`RemoveBtn-${(prop.organizationUser.id, prop.id)}`}
                onClick={() =>
                  handleOrgParticipantDeleteClick(
                    prop.organizationUser.id,
                    prop.id
                  )
                }
                color='danger'
                size='sm'
                className='btn-icon btn-link like'
                name='Remove icon'
              >
                <TooltipElement
                  id={`RemoveBtn-${(prop.organizationUser.id, prop.id)}`}
                  position='top'
                >
                  Remove
                </TooltipElement>
                <i className='tim-icons icon-trash-simple' />
              </Button>
            )}

            {/* use this button to Hide remove the data row  for Organization primary user */}
            {isPrimaryUserHidden && prop.user && orgCreatedId !== prop.user.id && (
              <Button
                id='RemoveBtnOrgPrimaryUser'
                onClick={() => handleDeleteClick(prop.id)}
                color='danger'
                size='sm'
                className='btn-icon btn-link like'
                name='Remove button'
              >
                <TooltipElement
                  id='RemoveBtnOrgPrimaryUser'
                  placement='top'
                  text='Remove'
                />
                <i className='tim-icons icon-trash-simple' />
              </Button>
            )}
            {/* use this button to Hide remove the data row for project primary organization */}
            {isPrimaryOrgHidden &&
              primaryOrganization &&
              prop.organizationId !== primaryOrganization && (
                <Button
                  id='RemoveBtnProjectPrimaryOrg'
                  onClick={() => handleDeleteClick(prop.id)}
                  color='danger'
                  size='sm'
                  className='btn-icon btn-link like'
                  name='Remove primary organization'
                >
                  <TooltipElement
                    id='RemoveBtnProjectPrimaryOrg'
                    placement='top'
                    text='Remove'
                  />
                  <i className='tim-icons icon-trash-simple' />
                </Button>
              )}
            {/* use this button to Hide past date data row for Activity */}
            {isPastDateHidden && moment().diff(prop.date) <= 0 && (
              <Button
                id='RemoveBtnActivity'
                onClick={() => handleDeleteClick(prop.id)}
                color='danger'
                size='sm'
                className='btn-icon btn-link like'
                name='Remove activity'
              >
                <TooltipElement
                  id='RemoveBtnActivity'
                  placement='top'
                  text='Remove'
                />
                <i className='tim-icons icon-trash-simple' />
              </Button>
            )}
            {/* use this button to add participant for an organization */}
            {isParticipantOrganizationHidden === false &&
              !prop.isExisting &&
              prop.isExisting === false && (
                <Link to={URL_ORG_USER_REGISTRATION + '?userId=' + prop.userId}>
                  <Button
                    id={`AddParticipantOrgBtn-${prop.id}`}
                    color='info'
                    size='sm'
                    className='btn-icon btn-link like'
                    name='Remove icon'
                  >
                    <TooltipElement
                      id={`AddParticipantOrgBtn-${prop.id}`}
                      position='top'
                    >
                      Register Participant
                    </TooltipElement>
                    <i className='tim-icons icon-simple-add' />
                  </Button>
                </Link>
              )}
            {isAcceptInviteHidden === false && hasRoles({ roles: [prop.roleId ? prop.roleId : USER_ROLES.ADMIN] }, inviteAcceptRole) && (
              <Button
                id={`AcceptBtn-${prop.id}`}
                onClick={() => handleApproveDenyInviteClick(prop.participantId, prop.projectOrganizationId, ACCEPTDENYACTION.ACCEPT)}
                color='primary'
                size='sm'
                className='btn-icon btn-link like'
                name='Remove icon'
              >
                <TooltipElement id={`AcceptBtn-${prop.id}`} position='top'>
                  Accept
                </TooltipElement>
                <i className='tim-icons icon-check-2' />
              </Button>
            )}
            {isRejectInviteHidden === false && hasRoles({ roles: [prop.roleId ? prop.roleId : USER_ROLES.ADMIN] }, inviteRejectRole) && (
              <Button
                id={`RejectBtn-${prop.id}`}
                onClick={() => handleApproveDenyInviteClick(prop.participantId, prop.projectOrganizationId, ACCEPTDENYACTION.DENY)}
                color='danger'
                size='sm'
                className='btn-icon btn-link like'
                name='Reject icon'
              >
                <TooltipElement id={`RejectBtn-${prop.id}`} position='top'>
                  Deny
                </TooltipElement>
                <i className='tim-icons icon-simple-remove' />
              </Button>
            )}
            {/* use this button to toggle button row for Activity */}
            {isToggleBtn && (
              <Switch
                offColor=''
                onColor=''
                defaultValue={prop.isAttended}
                onChange={(e, state) => handleSwitchChange(state, prop)}
              />
            )}
          </div>
        ),
      };
    });

  const NoDataComponent = () => {
    if (loading) return null;
    return <div className='rt-noData'>No rows found</div>;
  };

  const getTrProps = (state, rowInfo, instance) => {
    if (rowInfo)
      return {
        style: {
          background: rowInfo.original.isPrimary ? '#415171' : 'primary',
        },
      };
    return {};
  };

  const getArrayWithDivisor = (num, div) => {
    return Array(Math.floor(num / div))
      .fill(undefined)
      .map((el, i) => (i + 1) * div);
  };

  const sizeOptions = getArrayWithDivisor(dataTable.length, PER_PAGE);

  const filterCaseInsensitive = (filter, row) => {
    const id = filter.pivotId || filter.id;
    const content = row[id];
    if (typeof content !== 'undefined') {
      // filter by text in the table or if it's a object, filter by key
      if (typeof content === 'object' && content !== null && content.key) {
        return String(content.key)
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      } else {
        return String(content)
          .toLowerCase()
          .includes(filter.value.toLowerCase());
      }
    }
    return true;
  };

  return (
    <ReactTable
      data={loading ? [] : dataTable}
      resolveData={mapResults}
      getTrProps={getTrProps}
      resizable={false}
      columns={columns}
      minRows={PER_PAGE}
      showPaginationBottom={true}
      defaultPageSize={PER_PAGE}
      pageSizeOptions={sizeOptions.length ? sizeOptions : [PER_PAGE]}
      className='-striped -highlight'
      loading={loading}
      NoDataComponent={NoDataComponent}
      filterable={filterable}
      defaultFilterMethod={filterCaseInsensitive}
      manual={isManual}
      onFetchData={fetchData}
      // pages={Math.ceil(totalCount / PER_PAGE)}
    />
  );
};

Table.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.object), // Columns to be render (see react-table docs for more)
  dataTable: PropTypes.arrayOf(PropTypes.object), // Data to render in the table
  actionsVisibility: PropTypes.shape({
    isViewHidden: PropTypes.bool,
    isEditHidden: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    isDeleteHidden: PropTypes.bool,
    isDedailsHidden: PropTypes.bool,
    isDeleteOrgParticipantHidden: PropTypes.bool,
    isParticipantOrganizationHidden: PropTypes.bool,
    isAcceptInviteHidden: PropTypes.bool,
    isRejectInviteHidden: PropTypes.bool,
  }),
  orgCreatedId: PropTypes.string,
  primaryOrganization: PropTypes.string,
  totalCount: PropTypes.number,
  activityDetail: PropTypes.element,
  viewIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  otherIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  applyIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  activityIcon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  loading: PropTypes.bool,
  filterable: PropTypes.bool,
  isPastDateHidden: PropTypes.bool,
  isPastDateEditHidden: PropTypes.bool,
  isPrimaryUserHidden: PropTypes.bool,
  isToggleBtn: PropTypes.bool,
  isPrimaryOrgHidden: PropTypes.bool,
  isManual: PropTypes.bool,
  isYesNoFlag: PropTypes.bool,
  fetchData: PropTypes.func,
  handleDeleteClick: PropTypes.func,
  handleEditClick: PropTypes.func,
  handleDetailsClick: PropTypes.func,
  handleViewClick: PropTypes.func,
  handleOtherClick: PropTypes.func,
  handleApplyClick: PropTypes.func,
  handleSwitchChange: PropTypes.func,
  handleActivityClick: PropTypes.func,
  handleActivityDetailClick: PropTypes.func,
  handleOrgParticipantDeleteClick: PropTypes.func,
  deleteRole: PropTypes.array,
  editRole: PropTypes.array,
  viewRole: PropTypes.array,
  otherRole: PropTypes.array,
  handleViewNotes: PropTypes.func
};

export default Table;
