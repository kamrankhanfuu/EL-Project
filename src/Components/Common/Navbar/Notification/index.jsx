import React, { useState, useEffect } from "react";
import Api from "Helpers/Api";
import { NOTIFICATION_DISCRIMINATOR } from "Helpers/constants";
import { URL_ORGANIZATION, URL_PROJECT, URL_PROJECT_ACTIVITIES } from "Helpers/urls";
import "./Notification.scss";
import { encodeId, decodeId } from "Helpers/utils";

// reactstrap components
import {
    DropdownToggle,
    DropdownMenu,
    DropdownItem,
    UncontrolledDropdown,
    NavLink,
} from "reactstrap";

// Redux
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

const NotificationList = props => {
    const { user, userId } = props;
    const [notifications, setNotifications] = useState([])

    useEffect(() => {
        getNotifications();
    }, []);

    const getNotifications = async () => {
        try {
            const res = await Api.getNotifications();
            setNotifications(res.model);
        } catch (error) {
            console.error("getNotifications -> error", error);
        }
    };

    const handleNotification = async (notification) => {
        if (notification.discriminator === NOTIFICATION_DISCRIMINATOR.ORGANIZATION_NOTIFICATION) {
            props.history.push(URL_ORGANIZATION);
        }
        else if (notification.discriminator === NOTIFICATION_DISCRIMINATOR.PROJECT_NOTIFICATION) {
            props.history.push(URL_PROJECT);
        }
        else if (notification.discriminator === NOTIFICATION_DISCRIMINATOR.ACTIVITY_DATES_NOTIFICATION) {
            const res = await Api.getActivityByActivityDates(notification.entityId);
            if(res){
                props.history.push("/project/" + encodeId(res.model.projectId)+ '/activity/' + encodeId(res.model.id) + '/dates');
            }
        }
        const result = await Api.readNotification(notification.id);
        if (result) {
            getNotifications();
        }

    };

    return (
        <UncontrolledDropdown nav>
            <DropdownToggle
                caret
                color="default"
                data-toggle="dropdown"
                nav

            >
                {
                    notifications.length > 0 &&
                    <div className="notification d-none d-lg-block d-xl-block" />
                }
                <i className="tim-icons icon-sound-wave" />
                <p className="d-lg-none">Notifications</p>
            </DropdownToggle>
            {
                notifications.length > 0 &&
                <DropdownMenu className="dropdown-navbar" right tag="ul">
                    {
                        notifications.map((notification, i) => {
                            return (
                                <NavLink tag="li" key={i}>
                                    <DropdownItem className="nav-item">
                                        {
                                            <a className="notification-link" href="javascript:void(0)" onClick={() => handleNotification(notification)}> {notification.text} </a>
                                        }
                                    </DropdownItem>
                                </NavLink>
                            )
                        })
                    }
                </DropdownMenu>
            }
        </UncontrolledDropdown>
    );
};

const mapReduxStateToProps = (state) => ({
    user: state.auth.user,
    userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(NotificationList));