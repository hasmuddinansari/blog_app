import React, { useEffect, useState } from "react";
import "./blog.css";
import { Modal, Button } from "antd";
import { Input, Icon, notification } from "antd";
import { connect } from "react-redux";
import { fetch_blogs } from "../REDUX/Action";
import { Collapse } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
const { confirm } = Modal;

function SingleBlog({
  match,
  location,
  history,
  get_cur_blog,
  blogs,
  users,
  fetch_blogs,
  curr_user
}) {
  const [comment, setComment] = useState("");
  const [blog] = useState(location.state);
  const [curr_user_id, setId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, showModel] = useState(false);
  console.log(comment);
  const [c_user, setUser] = useState("");
  const [comments, setComments] = useState("");
  const [newtitle, setTitle] = useState(blog.title);
  const [newcontent, setContent] = useState(blog.content);
  const openNotification = (type, msg) => {
    notification[type]({
      message: msg
    });
  };
  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      makeChange(
        "PUT",
        "/blog/update",
        {
          blog_id: blog.id,
          title: newtitle,
          content: newcontent
        },
        "Update Successfull"
      );
      showModel(false);
    }, 2000);
  };
  const handleCancel = () => {
    showModel(false);
  };
  const commented = e => {
    e.preventDefault()
    if (comments !== "") {
      const datas = e.target.className;
      const ar = datas.split("=");
      ar.shift();
      console.log("user", curr_user);
      const ids = ar.map(Number);
      const [blog, cat] = ids;
      const config = {
        method: "POST",
        baseURL: "http://127.0.0.1:5000",
        url: "/blog/comments",
        headers: { "Content-Type": "application/json" },
        data: {
          comment: comments,
          user_id: curr_user_id,
          category_id: cat,
          blog_id: blog
        }
      };
      axios(config)
        .then(res => {
          console.log(res.data.comment);
          openNotification("success", "Comment is Added");
          getComment();
          setComments("")
        })
        .catch(er => console.error(er));
    }
  };
  const getComment = () => {
    const config = {
      method: "POST",
      baseURL: "http://127.0.0.1:5000",
      url: "/blog/getcomments",
      headers: { "Content-Type": "application/json" },
      data: {
        category_id: blog.Category_id,
        blog_id: blog.id
      }
    };
    axios(config).then(res => {
      console.error(res.data);
      setComment(res.data.comments);
      console.log(res.data);
    });
  };
  //
  const makeChange = (method, url, data, msg) => {
    const config = {
      method: method,
      baseURL: "http://127.0.0.1:5000",
      url: url,
      headers: { "Content-Type": "application/json" },
      data: data
    };
    axios(config).then(res => {
      console.log(res.data.message);
      openNotification("success", msg);
      setTimeout(() => history.push("/"), 1000);
    });
  };
  const deleteBlog = () => {
    confirm({
      title: `Do you want to delete this blog? press 'ok' to confirm.`,
      onOk() {
        return new Promise((resolve, reject) => {
          const data = {
            blog_id: blog.id
          };
          setTimeout(
            makeChange("DELETE", "/blog/delete", data, "Delete successfull")
              ? resolve
              : reject,
            1000
          );
        }).catch(() => console.log("Oops errors!"));
      },
      onCancel() { }
    });
  };

  useEffect(() => {
    getComment();
    fetch_blogs();
    const curr_user_id = localStorage.getItem("id");
    console.log("wolkinggg", curr_user_id);
    setId(curr_user_id);
  }, []);

  const getImg = (user_id) => {
    const user = users.find(e => {
      return e.id == user_id
    })
    return "/" + user.img
  }
  return (
    <>
      <Button icon="left-circle">
        <Link style={{ padding: "5px", marginTop: "5px" }} to="/">
          Go Back
        </Link>
      </Button>
      <Modal
        visible={visible}
        title={blog.title}
        bodyStyle={{ padding: "20px", height: "30rem", fontSize: "16px" }}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Return
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleOk}
          >
            Submit
          </Button>
        ]}
      >
        <input
          style={{ fontSize: "20px", height: "auto" }}
          value={newtitle}
          className="form-control"
          onChange={e => setTitle(e.target.value)}
        />
        <textarea
          style={{
            width: "30rem",
            fontSize: "20px",
            height: "20rem",
            marginTop: "2rem"
          }}
          value={newcontent}
          onChange={e => setContent(e.target.value)}
        />
      </Modal>
      <div className="container singleFlex">
        {blog.user_id == curr_user_id ? (
          <div className="col-12 p-2 row justify-content-end">
            <span className="extra bg-light shadow-sm">
              <Icon
                onClick={deleteBlog}
                title="Delete"
                className="icon text-danger mx-4"
                type="delete"
                theme="filled"
              />
              <Icon
                title="Edit"
                type="edit"
                onClick={showModel}
                className="icon mx-4 text-success"
              />
            </span>
          </div>
        ) : null}
        <div className="singleCard">
          {blog && (
            <>
              <h3 className="text-success">{blog.title}</h3>
              <h5 className="blog_content">{blog.content}</h5>

              <form className={`=${blog.id}=${blog.Category_id}`} onSubmit={commented}>
                <textarea value={comments}
                  onChange={e => setComments(e.target.value)}
                  placeholder="Comment........"
                  className="p-3 comment_font"
                  name="" id="" cols="70" rows="3">
                </textarea>
                <input type="submit" className="px-3  btn btn-outline-info" value="Comment" />
              </form>
              <p className="scroll">
                <ul className="list-group">
                  {comment &&
                    comment.map((li, i) => {
                      return (
                        <>
                          <li className="list-group-item p-1 my-2 border d-flex justify-content-between">
                            <div className="d-flex p-2 col-9 ">
                              <img src={getImg(comment[comment.length - 1 - i].user_id)} className="border m-3 comment-pic rounded-circle img-fluid" alt="img" />
                              <p className="p-4 m-3 d-flex flex-wrap">{comment[comment.length - 1 - i].comment}</p>
                            </div>
                            <div className="d-flex p-2 col-3 flex-column justify-content-end">
                              <div>
                                <p className="text-muted"> {comment[comment.length - 1 - i].name.name}</p>
                                <p> {comment[comment.length - 1 - i].created_at}</p>
                              </div>
                            </div>
                          </li>
                        </>
                      );
                    })}
                </ul>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
const mapStateToProps = state => {
  return {
    blogs: state.cat_blogs,
    users: state.cat_blogs.users,
    curr_user: state.curr_user
  };
};
const mapDispatchToProps = dispatch => {
  return {
    fetch_blogs: () => dispatch(fetch_blogs())
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(SingleBlog);
