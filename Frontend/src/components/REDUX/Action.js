import axios from "axios";

export const fetch_res = response => {
  return {
    type: "FETCH_RES",
    payload: response
  };
};
export const Authenticate = condition => {
  return {
    type: "AUTH",
    condition: condition
  };
};
export const GetUser = user => {
  return {
    type: "USER",
    user: user
  };
};
export const get_blogs = blogs => {
  return {
    type: "BLOG",
    blogs: blogs
  };
};

export const fetch_response = (data, url) => {
  return dispatch => {
    var config = {
      method: "POST",
      baseURL: "http://127.0.0.1:5000",
      url: "/auth/" + url,
      headers: { "Content-Type": "application/json" },
      data: data
    };
    if (url == "login") {
      const token = localStorage.getItem("token");
      if (token !== null || token !== undefined) {
        config = {
          ...config,
          headers: { ...config.headers, Authorization: `Bearer ${token}` }
        };
      }
    }
    axios(config)
      .then(res => {
        dispatch(fetch_res(res.data));
        if (res.data.token !== undefined) {
          localStorage.setItem("token", res.data.token);
          dispatch(Authenticate(true));
        }
      })
      .catch(er => console.log(er));
  };
};
export const curr_user = user => {
  return {
    type: "CURR_USER",
    user: user
  };
};

export const fetch_blogs = () => {
  return dispatch => {
    let config = {
      method: "GET",
      baseURL: "http://127.0.0.1:5000",
      url: "/blog/getData",
      headers: { "Content-Type": "application/json" }
    };
    axios(config)
      .then(res => {
        {
          dispatch(get_blogs(res.data));
        }
      })
      .catch(er => console.error(er));
  };
};
export const get_cur_user = () => {
  return dispatch => {
    const token = localStorage.getItem("token");
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
      localStorage.setItem("id", res.data.id);
      localStorage.setItem("email", res.data.email);
      localStorage.setItem("name", res.data.email);
      dispatch(curr_user(res.data));
    });
  };
};
