import Api from "Helpers/Api";
import querystring from "querystring";
import { Link } from "react-router-dom";
import { URL_PROJECT } from "Helpers/urls";
import Squares from "Components/Common/Squares";
import CorrectSign from "Assets/img/correct-sign.png";
import React, { useEffect, useCallback } from "react";
import { Card, CardBody, CardFooter, Row, Col, Container } from "reactstrap";

const Accepted = (props) => {
  const appoveInvite = useCallback(async () => {
    try {
      const id = querystring.parse(props.location.search)["id"];
      await Api.acceptProjectOrgInvitation(id);
    } catch (error) {
      console.error(error);
    }
  }, [props.location.search]);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    document.body.classList.add("login-page");
    appoveInvite();
    return () => {
      document.body.classList.remove("login-page");
    };
  }, [appoveInvite]);

  return (
    <div className="wrapper">
      <div className="page-header">
        <Squares />
        <Container>
          <Row>
            <Col className="mx-auto" lg="8" md="12">
              <Card className="customCard">
                <img width={200} height={200} src={CorrectSign} alt="correct" />
                <CardBody>
                  <h3 className="text-center">
                    Organization has been successfully linked to project .
                  </h3>
                </CardBody>
                <CardFooter>
                  <div className="link footer-link">
                    <h5>
                      To View Projects &nbsp;
                      <Link to={URL_PROJECT}>Click here </Link>
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
export default Accepted;
