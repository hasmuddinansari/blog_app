import { Upload, Icon, message, Button } from "antd";
import React, { Component } from "react";
import "./profile.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { fetch_blogs, get_cur_user } from "../REDUX/Action";
import CurrUserBlog from "./CurrUserBlog";
const { Dragger } = Upload;

export class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "file",
      multiple: true,
      action: `http://127.0.0.1:5000/uploader/${this.props.user.email}/${this.props.user.id}`,
      onChange(info) {
        const { status } = info.file;
        if (status !== "uploading") {
          console.log(info.file, info.fileList);
        }
        if (status === "done") {
          message.success(`${info.file.name} file uploaded successfully.`);
          this.props.get_cur_user();
        } else if (status === "error") {
          message.error(`${info.file.name} file upload failed.`);
        }
      }
    };
  }
  componentDidMount() {
    this.props.fetch_blogs();
    this.props.get_cur_user();
  }
  render() {
    const { id, name, email, img } = this.props.user;
    return (
      <>
        <Button icon="left-circle">
          <Link to="/">Go Back</Link>
        </Button>
        <div className="container row justify-content-center p-5">
          <div className="col-lg-6 col-12 p-5">
            <div className="border cardprofile">
              <h4 className="my-3 p-3">
                <span className="border bg-light px-5 my-3">Name</span>
                <br />
                <span className="newtext"> {name}</span>
              </h4>
              <h4 className="my-3 p-3">
                <span className="border bg-light px-5 my-3">Email</span>
                <br />
                <span className="newtext"> {email}</span>
              </h4>
              <h5>
                {this.props.blogs && (
                  <CurrUserBlog id={id} blogs={this.props.blogs} />
                )}
              </h5>
            </div>
          </div>
          <div className="col-lg-6 col-12 border row justify-content-center">
            <img
              src={this.props.user.img}
              alt=""
              className="img-fluid profile rounded-circle my-3"
            />

            <Dragger {...this.state}>
              <p className="ant-upload-text">
                Click or drag file to this area to change profile
              </p>
            </Dragger>
          </div>
        </div>
      </>
    );
  }
}
const mapStateToProps = state => {
  return {
    blogs: state.cat_blogs.blogs,
    user: state.curr_user
  };
};
const mapDispatch = dispatch => {
  return {
    fetch_blogs: () => dispatch(fetch_blogs()),
    get_cur_user: () => dispatch(get_cur_user())
  };
};
export default connect(mapStateToProps, mapDispatch)(Profile);
