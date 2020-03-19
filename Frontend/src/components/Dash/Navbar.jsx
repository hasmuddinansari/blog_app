import React from "react";
import Auth_Navbar from "./Auth_Navbar"

export default function Navbar({ Authenticate, name, img, history }) {
  return (
    <Auth_Navbar Authenticate={Authenticate} name={name} img={img} history={history} />
  );
}
