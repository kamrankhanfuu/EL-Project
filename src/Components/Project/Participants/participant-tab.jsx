import React, { useState, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from "react-redux";
import Swal from 'sweetalert2';
import {
    Card,
    CardBody,
    CardHeader,
    CardTitle,
    Row,
    Col,
    Button,
} from 'reactstrap';
import { Tabs, Tab } from 'react-bootstrap-tabs';
import Api from 'Helpers/Api';
import ParticipantList from './participantList';
import { ACCEPTDENYACTION } from '../../../Helpers/constants'

const ParticipantTabForProject = (props) => {
    const { id } = props.match.params;
    const [projDetails, setProjDetails] = useState(null);
    const [participants, setParticipants] = useState([]);
    const [loading, setLoading] = useState(false);
    const { userId } = props;

    const getProjectDetails = async () => {
        try {
            const result = await Api.getProjectDetails(window.atob(id));
            setProjDetails(result);
        } catch (error) {
            console.error('getProjectDetails -> error', error);
        }
    };

    const getProjectParticipants = async () => {
        try {
            const result = await Api.getOrganizationProjectParticipants(window.atob(id), projDetails.primaryOrganizationGuid);
            let projParticipants = [];
            projParticipants = result.map(participant => ({
                participantId: participant.participantId,
                projectOrganizationId: participant.projectOrganizationId,
                acceptedBy: participant.acceptedBy,
                invitedBy: participant.invitedBy,
                declinedBy: participant.declinedBy,
                status: participant.status,
                name: `${participant.users?.firstName ?? ""} ${participant.users?.lastName ?? ""}`,
                city: participant.users?.city ?? "",
                state: participant.users?.state ?? "",
            }));
            setParticipants(projParticipants);
        } catch (error) {
            console.error('getProjectParticipants -> error', error);
        }
    };

    const getInitValues = async () => {
        setLoading(true);
        await Promise.all([
            getProjectParticipants()
        ]);
        setLoading(false);
    };

    const handleApproveDenyInvite = (participantId, projectOrganizationId, status) => {
        let participant = participants.find((item) => item.participantId === participantId);
        const acceptOrDenyText = status === ACCEPTDENYACTION.ACCEPT ? "accept" : "deny";
        let message = `You want to ${acceptOrDenyText} the invite`;
        if(participant.name){
            message = message +  ` from ${participant.name}?`;
        }
        else{
            message = message +  "?";
        }
        let confirmButtonColor = '#ec250d';
        let icon = "warning";
        if(status === ACCEPTDENYACTION.ACCEPT){
            confirmButtonColor = '#009100';
            icon = "success";
        }
        Swal.fire({
            title: 'Are you sure?',
            text: message,
            icon: icon,
            showDenyButton: false,
            showCancelButton: true,
            confirmButtonText: `Yes, ${acceptOrDenyText} invite!`,
            denyButtonText: `Cancel`,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: '#1d8cf8',
        }).then((willDelete) => {
            if (willDelete.isConfirmed) {
                approveOrDenyInvite(participantId, projectOrganizationId, status);
            }
        });
    };

    const approveOrDenyInvite = async (participantId, projectOrganizationId, status) => {
        try {
            const reqParam = {
                participantId: participantId,
                projectOrganizationId: projectOrganizationId,
                userId: userId,
                status: status
            };
            const response = await Api.approveDenyInvitation(reqParam);
            if (response.statusCode !== 200) {
                return Swal.fire({
                    icon: 'error',
                    title: response.message,
                });
            }
            let data = [...participants];
            let participant = participants.find((item) => item.participantId === participantId);
            if (participant && status === ACCEPTDENYACTION.ACCEPT) {
                participant.status = "accepted";
            }
            else {
                data.find((o, i) => {
                    if (o.participantId === participantId) {
                        data.splice(i, 1);
                        return true;
                    }
                    return false;
                });
            }

            setParticipants(data);
        } catch (error) {
            console.error('approveOrDenyInvite -> error', error);
        }
    }

    useEffect(() => {
        getProjectDetails();
    }, []);

    useEffect(() => {
        if (projDetails !== null) {
            getInitValues();
        }
    }, [projDetails]);

    return (
        <div className='content'>
            <Row>
                <Col xs={12} md={12}>
                    <Card>
                        <CardHeader>
                            <CardTitle tag='h4' className='float-left'>
                                Manage Participants for project
                            </CardTitle>

                            <Link to={`/project`}>
                                <Button className='btn-link float-right mr-3' color='info'>
                                    <i className='tim-icons icon-minimal-left' /> Go back
                                </Button>
                            </Link>
                        </CardHeader>
                        <CardBody>
                            <Tabs onSelect={(index, label) => console.log(label + ' selected')}>
                                <Tab label="Accepted Participants">
                                    <ParticipantList
                                        participants={participants.filter(x => x.status.toLowerCase() == "accepted")}
                                        isAccepted={true}
                                        loading={loading}
                                    />
                                </Tab>
                                <Tab label="Invited Participants">
                                    <ParticipantList
                                        participants={participants.filter(x => x.status.toLowerCase() == "applied" || x.status.toLowerCase() == "invited")}
                                        isAccepted={false}
                                        loading={loading}
                                        handleApproveDenyInvite={handleApproveDenyInvite}
                                    />
                                </Tab>
                            </Tabs>
                        </CardBody>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};

const mapReduxStateToProps = (state) => ({
    userId: state.auth.userId
  });

export default connect(mapReduxStateToProps, null)(withRouter(ParticipantTabForProject));