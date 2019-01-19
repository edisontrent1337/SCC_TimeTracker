import {userActionTypes} from "../actions/user.actionTypes.js";

let user = JSON.parse(localStorage.getItem("user"));
const initialState = user ? {loggedIn: true, user} : {};

export default function authReducer(state = initialState, action) {
    let data = action.data;
    switch (action.type) {
        case userActionTypes.LOGIN_REQUEST:
            return {
                loggingIn: true,
                user: data
            };
        case userActionTypes.LOGIN_SUCCESS:
            return {
                loggedIn: true,
                token: data
            };
        case userActionTypes.LOGIN_FAILURE:
            return {
                error: data
            };
        case userActionTypes.LOGOUT:
            return {};
        default:
            return state;
    }
}
