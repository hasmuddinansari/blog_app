import React, {useState} from 'react'
import {connect} from "react-redux"
import {fetch_response} from "../REDUX/Action"
import {Link} from "react-router-dom"
import Alert from "../Alert/Alert"
import { Button } from 'antd';
import 'antd/dist/antd.css'


function Login(props) {
    const [name, setName]= useState("")
    const [email, setEmail]=useState("")
    const [password, setPass] = useState("")
    const [disappear, setDisapper] = useState(false)
    const [loader, setLoader] = useState(false)

    const submit=()=> {
       const data = {
            "name":name,
            "email":email,
            "password":password
        }
        props.fetch_response(data, "signup")
        setLoader(true)
        setTimeout(()=>{
            setLoader(false)
            setDisapper(true)
        },2000)
        setTimeout(()=>{
            setDisapper(false)
        },3500)
        
    }
    return (
        <div className="container row justify-content-center p-5">
            <div className="p-5 bg-light border border-dark shadow-sm col-md-6 col-lg-6 col-12">
               {disappear?<Alert message={props.message} error={props.error} />:null}                
                <h3>Register</h3>
                <input placeholder="Name" className="form-control my-3" type="text" onChange={(e)=>setName(e.target.value)}/>
                <input placeholder="Email" className="form-control my-3" type="email" onChange={(e)=>setEmail(e.target.value)}/>
                <input placeholder="Passsword" className="form-control my-3" type="password" onChange={(e)=>setPass(e.target.value)}/>
               <span> <Button className="mr-2" type="primary" loading={loader} onClick={()=>{
                   submit()
                        }}>Register </Button><Link className="border border-dark p-2" to="/login">Already have an Account. Login</Link></span>
            
            </div>
        </div>
    )
}
const mapStateToProps=(state)=>{
    return{
        response:state.response,
        message:state.response.message,
        error:state.response.error
    }
}
const mapDispatchToProps = (dispatch)=>{
    return {
        fetch_response:(data, url)=>dispatch(fetch_response(data, url))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Login)