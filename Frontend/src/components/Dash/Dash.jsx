import React, { useEffect, useState } from "react";
import { connect } from "react-redux";
import { GetUser, curr_user } from "../REDUX/Action";
import Navbar from "./Navbar";
import { Authenticate, fetch_blogs } from "../REDUX/Action";
import axios from "axios";
import Loader from "../Common/Loader";
import BlogCard from "./BlogCard";

function Dash(props) {
  const [response, SetResponse] = useState({});
  const token = localStorage.getItem("token");
  console.log("response", response);
  useEffect(() => {
    document.title = "DashBoard";
    const config = {
      method: "POST",
      baseURL: "http://127.0.0.1:5000",
      url: "/auth/details",
      headers: {
        "Content-Type": "application/json",
        Authorization: `bearer ${token}`
      }
    };
    axios(config).then(res => {
      SetResponse(res.data);
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.email);
      props.curr_user(res.data);
      GetUser(res.data);
    });
    props.fetch_blogs();
  }, []);
  return (
    <>
      <Navbar
        Authenticate={props.Authenticate}
        name={response.name}
        userId={response.id}
        img={response.img}
      />
      <div className="p-3">
        {props.blog !== "" ? (
          <BlogCard blogs={props.blogs.blogs} />
        ) : (
          <Loader />
        )}
      </div>
    </>
  );
}

const mapStateToProps = state => {
  return {
    response: state.response,
    error: state.response.error,
    token: state.response.token,
    blogs: state.cat_blogs
  };
};
const mapDispatchToProps = dispatch => {
  return {
    GetUser: user => dispatch(GetUser(user)),
    fetch_blogs: () => dispatch(fetch_blogs()),
    curr_user: user => dispatch(curr_user(user)),
    Authenticate: condition => dispatch(Authenticate(condition))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dash);
