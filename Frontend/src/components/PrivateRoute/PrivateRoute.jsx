import { Route, Redirect } from "react-router-dom";
import React from "react";
import { connect } from "react-redux";


const PrivateRoute = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        const token = localStorage.getItem("token")
        console.log(token)
        if (props.isLogged || token !==null) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/login",
                state: {
                  from: props.location
                }
              }}
            />
          );
        }
      }}
    />
  );
};
const mapStateToProps = state=>{
    return {
        Auth:state.Auth,
        isLogged:state.Auth.isLogged
    }
}

export default connect(mapStateToProps)(PrivateRoute)