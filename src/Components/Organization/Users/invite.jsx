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
import { Input } from "Components/Common/Form/elements";
import { errorMessage } from "Helpers/Validation";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Api from "Helpers/Api";
// import { URL_ORGANIZATION } from "Helpers/urls";
import { URL_REGISTRATION } from "Helpers/urls";

const Invite = (props) => {
  const { orgDetails } = props;
  const { id } = props.match.params;
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values, { resetForm }) => {
    setLoading(true);
    try {
      const { userId } = props;
      await Api.addOrganizationUser({
        searchUser: values.email,
        organizationId: window.atob(id),
        createdBy: userId,
        invitedBy: userId,
        invitationLink: window.location.origin + URL_REGISTRATION,
      });
      props.handleAddUser();
      Swal.fire({
        icon: "success",
        title: "Invitation has been sent successfully!",
      });
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleGoBack = () => {
    props.history.goBack();
  }

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
                  Invite Users for {orgDetails.name || ""}
                </CardTitle>
                <Button className="btn-link float-right mr-3" color="info" onClick={handleGoBack}>
                  <i className="tim-icons icon-minimal-left" /> Go back
                </Button>
              </CardHeader>
              <CardBody>
                <FormGroup className={labelCasses("email")}>
                  <label>Username / Email</label>
                  <Field
                    component={Input}
                    name="email"
                    maxLength={80} 
                  />
                  {errorMessage("email")}
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
