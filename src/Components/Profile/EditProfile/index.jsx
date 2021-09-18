import React, { useState } from 'react';
import classNames from 'classnames';
// reactstrap components
import {
  Card,
  CardHeader,
  CardBody,
  NavItem,
  NavLink,
  Nav,
  TabContent,
  TabPane,
  CardTitle,
  Spinner,
} from 'reactstrap';
import BasicInfo from './Basic';
import BackgroundInfo from './Background';
import EducationInfo from './Education';
import EmploymentInfo from './Employment';
import MedicalInfo from './Medical';

const EditProfile = ({ isLoading, ...props }) => {
  const [activeTab, setActiveTab] = useState('Contact');

  const EDIT_PROFILE_TAB = [
    {
      label: 'Contact',
      component: <BasicInfo {...props} setActiveTab={setActiveTab} />,
    },
    {
      label: 'Background',
      component: <BackgroundInfo {...props} setActiveTab={setActiveTab} />,
    },
    {
      label: 'Education',
      component: <EducationInfo {...props} setActiveTab={setActiveTab} />,
    },
    {
      label: 'Employment',
      component: <EmploymentInfo {...props} setActiveTab={setActiveTab} />,
    },
    {
      label: 'Health',
      component: <MedicalInfo {...props} />,
    },
  ];

  const changeActiveTab = (e, tadName) => {
    e.preventDefault();
    setActiveTab(tadName);
  };

  const { firstName, lastName } = props.profileDetails;

  return (
    <Card>
      <div className='p-3'>
        <CardHeader>
          <h5 className='card-category'>
            {`${firstName || ''}`} {`${lastName || ''}`}
          </h5>
          <CardTitle tag='h3'>Edit Profile</CardTitle>
        </CardHeader>
        <CardBody>
          <Nav className='nav-pills-info' pills>
            {EDIT_PROFILE_TAB.map(({ label }) => (
              <NavItem key={label}>
                <NavLink
                  data-toggle='tab'
                  href='#'
                  className={classNames({
                    active: activeTab === label,
                  })}
                  onClick={(e) => changeActiveTab(e, label)}
                >
                  {label}
                </NavLink>
              </NavItem>
            ))}
          </Nav>
          <TabContent className='tab-space' activeTab={activeTab}>
            {EDIT_PROFILE_TAB.map(({ label, component }) => (
              <TabPane tabId={label} key={label}>
                {isLoading ? (
                  <div className='text-center'>
                    <Spinner />
                  </div>
                ) : (
                  component
                )}
              </TabPane>
            ))}
          </TabContent>
        </CardBody>
      </div>
    </Card>
  );
};

export default EditProfile;
