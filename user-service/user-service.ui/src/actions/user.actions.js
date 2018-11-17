import {userActionTypes} from "./user.actionTypes.js";
import {userService} from "../service/userservice.js";
import {history} from "../utils/history.js";

export const userActions = {
	login,
	logout,
	signup
};

function login(credentials) {
	return dispatch => {
		console.log(credentials);
		dispatch(action(userActionTypes.LOGIN_REQUEST, credentials));
		userService.post("/login", credentials).then(
			response => {
				if (response.token) {
					localStorage.setItem("user", JSON.stringify(response));
					dispatch(action(userActionTypes.LOGIN_SUCCESS, response.token));
				}
			},
			error => {
				let message;
				switch (error.status) {
					case 403:
						message = "Invalid username or password.";
						break;
					default:
						break;
				}
				dispatch(action(userActionTypes.LOGIN_FAILURE, message));
			}
		).then(() => {
            if(typeof localStorage.getItem("user") !== 'undefined') {
				history.push("/projects");
			}
		});
	};
}

function logout() {
	userService.logout();
	return {type: userActionTypes.LOGOUT};
}

function signup(credentials) {
	return dispatch => {
		dispatch(action(userActionTypes.SIGN_UP_REQUEST, credentials));
		userService.post("/signup", credentials)
			.then(response => {
				if (response === "USERNAME_ALREADY_TAKEN") {
					dispatch(action(userActionTypes.SIGN_UP_FAILURE, "Username is already taken."));
				}
				else if (response === "INVALID_PASSWORD") {
					dispatch(action(userActionTypes.SIGN_UP_FAILURE, "Invalid password."));
				}
				else {
					dispatch(action(userActionTypes.SIGN_UP_SUCCESS), null);
					history.push("/");
					location.reload();
				}
			});
	};
}

function action(type, data) {
	return {
		type: type,
		data: data
	};
}
