import React, { useEffect, useState } from "react";
import { Input } from "Components/Common/Form/elements";
import { errorMessage } from "Helpers/Validation";
import { validationSchema, initialValues } from "./validation";
import { URL_LOGIN } from "Helpers/urls";
import { Link } from "react-router-dom";
import { Formik, Form as FormikForm, Field } from "formik";
import Swal from "sweetalert2";
import querystring from "querystring";
import '../../Common/Squares/styles.css'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Container,
  FormGroup,
  Col
} from "reactstrap";
import Api from "Helpers/Api";
import classnames from "classnames";
import Squares from "Components/Common/Squares";

const Denied = (props) => {
  const [disabled, setDisabled] = useState(false);
  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };

  }, []);
  const handleSubmit = async (values) => {
    try {
      const id = window.atob(querystring.parse(props.location.search)["?id"]);
      const payload = { id, isApproved: 0, denyReason: values.deniedReason }
      await Api.approveDenyOrganization(payload);
      Swal.fire({
        icon: "success",
        title: "Organization approval denied!",
      });
      setDisabled(true)
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="page-header">
      <Squares />
      <Container>
        <Col className="mx-auto" md="12">
          <Card className="card-login">
            <Formik
              enableReinitialize={true}
              initialValues={initialValues("")}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ handleSubmit, errors, touched }) => {
                const labelClasses = (name) =>
                  classnames("denyReason-label", {
                    "has-danger": errors[name] && touched[name],
                  });
                return (
                  <FormikForm
                    onSubmit={handleSubmit}
                    id="DenyValidation"
                  >
                    <CardBody>
                      <FormGroup className={labelClasses("deniedReason")}>
                        <h4>Please specify the denial reason :</h4>
                        <Field component={Input} name="deniedReason" className="custm-textArea" type="textarea" />
                        {errorMessage("deniedReason")}
                      </FormGroup>
                      <CardFooter>
                        <Button
                          type="submit"
                          className="btn-round"
                          color="info"
                          size="lg"
                          disabled={disabled}
                        >
                          Submit
                              </Button>
                        <br />
                        <div className="link footer-link">
                          <br />
                          <h5 className="labels">Sign In &nbsp;<Link to={URL_LOGIN}>here</Link></h5>
                        </div>
                      </CardFooter>
                    </CardBody>
                  </FormikForm>
                );
              }}

            </Formik>
          </Card>
        </Col>
      </Container>
    </div>
  );

}
export default Denied;