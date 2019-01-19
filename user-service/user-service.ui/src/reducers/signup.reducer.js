import {userActionTypes} from "../actions/user.actionTypes.js";

let user = JSON.parse(localStorage.getItem("user"));
const initialState = user ? {loggedIn: true, user} : {};
export default function signUpReducer(state = initialState, action) {
    switch (action.type) {
        case userActionTypes.SIGN_UP_REQUEST:
            return {
                signingUp: true,
                user: action.credentials
            };
        case userActionTypes.SIGN_UP_SUCCESS:
            return {
                signedUp: true,
                token: action.token
            };
        case userActionTypes.SIGN_UP_FAILURE:
            return {
                error: action.data
            };
        default:
            return state;
    }
}
