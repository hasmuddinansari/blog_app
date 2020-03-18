const initialState={
    response:{},
    Auth:{},
    user:null,
    cat_blogs:{},
    curr_user:{},
    curr_blog:""
}
const Reducer = (state=initialState, action)=>{
    switch(action.type){
        case "FETCH_RES":
            return {
                ...state,
                response:action.payload
            }
        case "CURR_USER":
            return {
                ...state,
                curr_user:action.user
            }
        case "AUTH":
            return {
                ...state,
                Auth:{"isLogged":action.condition}
            }
        case "USER":
            return {
                ...state,
                user:action.user
            }
        case "BLOG":
            return {
                ...state,
                cat_blogs:action.blogs
            }
        default:return state
    }
}

export default Reducer