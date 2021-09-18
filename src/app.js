import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";

// core components
import AdminNavbar from "Components/Common/Navbar";
import Footer from "Components/Common/Footer";
import Sidebar from "Components/Common/Sidebar";

import routes from "Routes/routes";

// Redux
import { setActiveRoute } from "Redux/Actions/active-route.action";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";

import logo from "Assets/img/logo/eleveight_ladder_logo.png";
import { URL_DASHBOARD } from "Helpers/urls";

class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeColor: "blue",
      sidebarMini: true,
      opacity: 0,
      sidebarOpened: false,
    };
  }

  showNavbarButton = () => {
    if (
      document.documentElement.scrollTop > 50 ||
      document.scrollingElement.scrollTop > 50 ||
      this.refs.mainPanel.scrollTop > 50
    ) {
      this.setState({ opacity: 1 });
    } else if (
      document.documentElement.scrollTop <= 50 ||
      document.scrollingElement.scrollTop <= 50 ||
      this.refs.mainPanel.scrollTop <= 50
    ) {
      this.setState({ opacity: 0 });
    }
  };

  getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return this.getRoutes(prop.views);
      }
      return (
        <Route
          path={prop.path}
          exact={prop.exact}
          component={prop.component}
          key={key}
        />
      );
    });
  };

  getActiveRoute = (routes) => {
    let activeRoute = "Eleveight";
    let activeRouteArray = [];
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse) {
        let collapseActiveRoute = this.getActiveRoute(routes[i].views);
        if (collapseActiveRoute !== activeRoute) {
          return collapseActiveRoute;
        }
      } else {
        if (window.location.pathname.indexOf(routes[i].path) !== -1) {
          let obj = {
            index : window.location.pathname.indexOf(routes[i].path),
            path : routes[i].path,
            name : routes[i].name
          }
          activeRouteArray.push(obj);
        }
      }
    }
    if(activeRouteArray.length > 0){
      //check min index
      var index = Math.min.apply(null, activeRouteArray.map(item => item.index));
      var activeItem = activeRouteArray.find(item => item.index === index);
      this.props.setActiveRoute(activeItem.path);
      return activeItem.name;
    }else{
      this.props.setActiveRoute("");
    }
    return activeRoute;
  };

  handleActiveClick = (color) => {
    this.setState({ activeColor: color });
  };

  handleMiniClick = () => {
    document.body.classList.toggle("sidebar-mini");
  };

  toggleSidebar = () => {
    this.setState({
      sidebarOpened: !this.state.sidebarOpened,
    });
    document.documentElement.classList.toggle("nav-open");
  };

  closeSidebar = () => {
    this.setState({
      sidebarOpened: false,
    });
    document.documentElement.classList.remove("nav-open");
  };

  render() {
    return (
      <div className="wrapper">
        <div className="rna-container">
          <NotificationAlert ref="notificationAlert" />
        </div>
        <div
          className="navbar-minimize-fixed"
          style={{ opacity: this.state.opacity }}
        >
          <button
            className="minimize-sidebar btn btn-link btn-just-icon"
            onClick={this.handleMiniClick}
          >
            <i className="tim-icons icon-align-center visible-on-sidebar-regular text-muted" />
            <i className="tim-icons icon-bullet-list-67 visible-on-sidebar-mini text-muted" />
          </button>
        </div>
        <Sidebar
          {...this.props}
          routes={routes}
          activeColor={this.state.activeColor}
          logo={{
            outterLink: URL_DASHBOARD,
            text: "Eleveight",
            imgSrc: logo,
          }}
          closeSidebar={this.closeSidebar}
        />
        <div
          className="main-panel"
          ref="mainPanel"
          data={this.state.activeColor}
        >
          <AdminNavbar
            {...this.props}
            handleMiniClick={this.handleMiniClick}
            brandText={this.getActiveRoute(routes)}
            sidebarOpened={this.state.sidebarOpened}
            toggleSidebar={this.toggleSidebar}
          />
          <Switch>
            {this.getRoutes(routes)}
            <Redirect from="*" to="/dashboard" />
          </Switch>
          <Footer fluid />
        </div>
      </div>
    );
  }
}

const mapReduxStateToProps = (state) => ({
  activeRouteName: state.activeRoute.activeRouteName
});

export default connect(mapReduxStateToProps,{setActiveRoute})(
  withRouter(Admin)
);