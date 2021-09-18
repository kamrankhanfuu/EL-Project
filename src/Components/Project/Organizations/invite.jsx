import React, { useState } from "react";
import Swal from "sweetalert2";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  FormGroup,
  CardFooter,
  Button,
  Spinner,
} from "reactstrap";
import classnames from "classnames";
import { Formik, Form as FormikForm, Field } from "formik";
import { initialValues, validationSchema } from "./validation";
import { AsyncSelect } from "Components/Common/Form/elements";
import { URL_PROJECT_ORG_ACCEPT } from "Helpers/urls";
import { errorMessage } from "Helpers/Validation";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Api from "Helpers/Api";
import moment from "moment";

const SEARCH_LIMIT = 20;

const Invite = (props) => {
  const { id } = props.match.params;
  const [loading, setLoading] = useState(false);
  const { projectDetails } = props;

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      let invitedOrgs = [];
      values.organization.forEach((org) => {
        invitedOrgs.push({
          id: org.id,
          email: org.organizationDetails?.contactEmail,
          organizationId: org.id,
          projectId: window.atob(id),
          invitedBy: props.userId,
          invitedDate: moment().format("YYYY-MM-DD"),
          invitationLink: window.location.origin + URL_PROJECT_ORG_ACCEPT,
        });
      });
      await Api.inviteProjectOrganization(invitedOrgs);
      Swal.fire({
        icon: "success",
        title: "Invitation has been sent successfully!",
      });
      resetForm();
      props.handleInvited();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getSearchOrganizations = async (inputValue) => {
    try {
      const result = await Api.getSearchOrganizations(
        inputValue,
        window.atob(id),
        SEARCH_LIMIT
      );
      // Adding required field
      const searchedOrgs = [];
      result.forEach((org) => {
        if (org.id !== projectDetails.primaryOrganizationGuid) {
          org.label = org.name;
          org.value = org.organizationId;
          searchedOrgs.push(org);
        }
      });
      return searchedOrgs;
    } catch (error) {
      console.error("getOrganizations -> error", error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ handleSubmit, errors, touched }) => {
        const labelCasses = (name) =>
          classnames("has-label", {
            "has-danger": errors[name] && touched[name],
          });
        return (
          <FormikForm onSubmit={handleSubmit}>
            <Card>
              <CardHeader>
                <CardTitle tag="h4" className="float-left">
                  Invite Organization to {projectDetails.name}
                </CardTitle>
                <Link to={`/project`}>
                  <Button className="btn-link float-right mr-3" color="info">
                    <i className="tim-icons icon-minimal-left" /> Go back
                  </Button>
                </Link>
              </CardHeader>
              <CardBody>
                <FormGroup className={labelCasses("organization")}>
                  <label>Organization Name</label>
                  <Field
                    name="organization"
                    component={AsyncSelect}
                    placeholder="Search..."
                    filterOrganizations={getSearchOrganizations}
                    isMulti
                  />
                  {errorMessage("organization")}
                </FormGroup>
              </CardBody>
              <CardFooter className="text-right">
                <Button color="primary" type="submit">
                  Send Invitation
                  {loading && <Spinner size="sm" className="ml-2" />}
                </Button>
              </CardFooter>
            </Card>
          </FormikForm>
        );
      }}
    </Formik>
  );
};

const mapReduxStateToProps = (state) => ({
  userId: state.auth.userId,
});

export default connect(mapReduxStateToProps)(withRouter(Invite));
