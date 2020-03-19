import React, { useState } from 'react'
import { Button } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux"

const Auth_Navbar = ({ Authenticate, name, img, history, Auth }) => {
    const [auth, setAuth] = useState(Auth.isLogged)


    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light border shadow-sm">
            <Link title="Home page" to="/" style={{ "fontSize": "1.4rem" }} className="navbar-brand p-3 shadow-sm">Blog.com</Link>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-end " id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    {auth ? <div className="nav-item row justify-content-end shadow-sm">
                        <Link to="/createBlog" className="btn btn-outline-dark resize ">Write a blog </Link>

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
                                console.log(history)
                                history.push('/login')
                            }}
                        >
                            Logout
                        </Button>
                    </div> : <div className="nav-item row justify-content-end ">
                            <Link to="/login" style={{ "textDecoration": "None" }} className="p-2 border bg-danger text-white h5 mx-3">Login/Register</Link>
                        </div>}

                </div>
            </div>
        </nav>
    )
}

const mapStateToProps = (state) => {
    return {
        Auth: state.Auth
    }
}
export default connect(mapStateToProps)(Auth_Navbar)



