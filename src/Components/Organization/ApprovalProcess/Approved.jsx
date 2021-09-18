import React, { useEffect, useCallback } from "react";
import { Link, withRouter } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Row,
  Col,
  Container,
} from "reactstrap";
import querystring from "querystring";
import Api from "Helpers/Api";
import Squares from "Components/Common/Squares";
import CorrectSign from "Assets/img/correct-sign.png";
import { URL_ORGANIZATION } from "Helpers/urls";

const Approved = (props) => {
  const Submit = useCallback(async () => {
    try {
      const id = window.atob(querystring.parse(props.location.search)["?id"]);
      await Api.approveDenyOrganization({ id, isApproved: 1 });
      props.history.push(URL_ORGANIZATION);
    } catch (error) {
      console.error(error);
    }
  }, [props.location.search, props.history]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    document.body.classList.add("login-page");
    Submit();
    return () => {
      document.body.classList.remove("login-page");
    };
    // eslint-disable-line react-hooks/exhaustive-deps
  }, [Submit]);

  return (
    <div className="wrapper">
      <div className="page-header">
        <Squares />
        <Container>
          <Row>
            <Col className="mx-auto" lg="8" md="12">
              <Card className="customCard">
                <CardHeader style={{ paddingBottom: "10px" }}>
                  <img
                    width={200}
                    height={200}
                    src={CorrectSign}
                    alt="correct"
                  />
                </CardHeader>
                <CardBody>
                  <h3 className="text-center">
                    Organization is approved and Email sent to organization
                    creator.
                  </h3>
                </CardBody>
                <CardFooter>
                  <div className="link footer-link">
                    <h5>
                      To View Organizations &nbsp;
                      <Link to={URL_ORGANIZATION}>Click here </Link>
                    </h5>
                  </div>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default withRouter(Approved);
