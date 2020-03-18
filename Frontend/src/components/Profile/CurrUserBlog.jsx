import { Modal, Button } from "antd";
import { Link } from "react-router-dom";
import React from "react";
class CurrUserBlog extends React.Component {
  constructor(props) {
    super(props);
  }
  state = { visible: false, blogs: this.props.blogs, count: 0 };
  componentDidMount() {
    const blog = this.props.blogs.filter(e => {
      return e.user_id == localStorage.getItem("id");
    });
    this.setState({
      ...this.state,
      blogs: blog,
      count: blog.length
    });

    console.log("component did mout", this.props.blogs);
    console.log("component did mout2", localStorage.getItem("id"));

    localStorage.getItem("id");
  }
  showModal = () => {
    this.setState({
      ...this.state,
      visible: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      ...this.state,
      visible: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      ...this.state,
      visible: false
    });
  };

  render() {
    const { blogs } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          Your Blogs
        </Button>
        <Modal
          title="Blog List"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <ul className="list-group modals">
            {this.state.count !== 0
              ? blogs.map(blog => {
                  return (
                    <li className="list-group-item border my-1">
                      <Link
                        to={{
                          pathname: `/blog/${blog.id}`,
                          state: {
                            ...blog
                          }
                        }}
                      >
                        {blog.title}
                      </Link>
                    </li>
                  );
                })
              : null}
          </ul>
        </Modal>
      </div>
    );
  }
}

export default CurrUserBlog;
