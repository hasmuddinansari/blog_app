import React, { useState } from "react";
import "./dash.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";

function BlogCard({ blogs, users, curr_user, category }) {
  const [curr_user_id] = useState(localStorage.getItem("id"));
  const getName = user_id => {
    const user = users.find(user => {
      return user.id == user_id;
    });
    return user.name;
  };
  const getCat = cat_id => {
    const cur = category.find(e => {
      return e.id == cat_id;
    });
    return cur.Category;
  };
  const getImg = id => {
    const imgs = users.find(user => {
      return user.id == id;
    });
    return imgs.img;
  };
  return (
    <div className="container">
      <div className="row">
        {blogs &&
          blogs.map((blog, i) => {
            return (
              <div className="mycard col-12 col-lg-12 p-1" key={blogs[blogs.length - 1 - i].id}>
                <Link
                  to={{
                    pathname: `/blog/${blogs[blogs.length - 1 - i].id}`,
                    state: {
                      ...blogs[blogs.length - 1 - i]
                    }
                  }}
                >
                  <h2 className="text-left p-3 text-success text-center my-1">
                    {blogs[blogs.length - 1 - i].title}
                  </h2>
                  <h5 className="border p-5">

                    {(blogs[blogs.length - 1 - i].content.length > 120) ? blogs[blogs.length - 1 - i].content.slice(0, 120) : blogs[blogs.length - 1 - i].content}
                    {(blogs[blogs.length - 1 - i].content.length > 120) && < span className="text-primary text-right justify-self-end">
                      ...Read More
                    </span>}

                  </h5>
                  <p className="row justify-content-between px-4">
                    <div>
                      <Link to="/profile" title="profile">
                        <img
                          src={getImg(blogs[blogs.length - 1 - i].user_id)}
                          alt=""
                          className="pfphoto border border-dark bg-light"
                        />
                      </Link>
                      <span className="newText">{getName(blogs[blogs.length - 1 - i].user_id)}</span>
                    </div>
                    <div>
                      <span className="text-muted d-flex flex-column">
                        <span className="my-3 px-5 bg-light border">
                          {getCat(blogs[blogs.length - 1 - i].Category_id)}
                        </span>{" "}
                        <span>{blogs[blogs.length - 1 - i].created_at}</span>
                      </span>
                    </div>
                  </p>
                </Link>
              </div>
            );
          })}
      </div>
    </div >
  );
}
const mapState = state => {
  return {
    users: state.cat_blogs.users,
    category: state.cat_blogs.category,
    curr_user: state.curr_user
  };
};
export default connect(mapState)(BlogCard);
