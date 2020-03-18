import React from "react";
import { Button } from "antd";
import { Link } from "react-router-dom";

export default function Navbar({ Authenticate, name, img }) {
  return (
    <div className="navbar d-flex p-3 justify-content-between bg-dark">
      <div className="nav-item">
        <Link to="/createBlog" className=" btn btn-light ">
          Write a blog
        </Link>
      </div>
      <div className="nav-item row">
        <img src={img} alt="" className="pfphoto" />
        <Link to="/profile" className="btn btn-success resize">
          {name}
        </Link>
        <Button
          type="danger"
          className="resize"
          onClick={() => {
            Authenticate(false);
            localStorage.removeItem("token");
            localStorage.removeItem("id");
            localStorage.removeItem("email");
            localStorage.removeItem("name");
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
}
