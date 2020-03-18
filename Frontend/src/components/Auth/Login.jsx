import React, { useState } from 'react'
import { connect } from "react-redux"
import { fetch_response } from "../REDUX/Action"
import { Link } from "react-router-dom"
import Alert from "../Alert/Alert"
import { Button } from 'antd';
import 'antd/dist/antd.css'


function Login(props) {
    const [email, setEmail] = useState("")
    const [password, setPass] = useState("")
    const [disappear, setDisapper] = useState(false)
    const [loader, setLoader] = useState(false)
    function submit() {
        if (email == "" || password == "") {

        }
        else {
            const data = {
                "email": email,
                "password": password
            }
            props.fetch_response(data, "login")
            setLoader(true)
            setTimeout(() => {
                setDisapper(true)
                const token = localStorage.getItem("token")
                setLoader(false)
                if (token !== null) {
                    return props.history.push("/")
                }
            }, 1500)
            setTimeout(() => {
                setDisapper(false)
            }, 3000)
        }
    }
    return (
        <div className="container p-5 row justify-content-center">
            <div className="p-5 border border-dark shadow-sm bg-light col-lg-6 col-md-6 col-12">
                <div className="p-2"> {disappear ? <Alert message={props.message} error={props.error} /> : null}</div>
                <h3>LOGIN</h3>
                <input placeholder="Email" className="form-control my-3" type="email" onChange={(e) => setEmail(e.target.value)} />
                <input placeholder="Password" className="form-control my-3" type="password" onChange={(e) => setPass(e.target.value)} />
                <span><Button className="mr-2" type="primary" loading={loader} onClick={() => {
                    submit()
                }}>Login </Button>
                    <Link className="border p-2" to="/signup">Click here to Register</Link></span>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        response: state.response,
        message: state.response.message,
        error: state.response.error,
        token: state.response.token
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        fetch_response: (data, url) => dispatch(fetch_response(data, url)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)