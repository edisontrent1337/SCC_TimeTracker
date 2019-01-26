import {registerApplication, start} from "single-spa";
import SystemJS from "./src/systemjs/dist/system.src.js";
import "./public/style/style.css";

const token =
	localStorage.getItem("user") === null
		? ""
		: JSON.parse(localStorage.getItem("user")).token;

SystemJS.config({
	meta: {
		"*": {authorization: "Bearer " + token}
	}
});

registerApplication(
	"login",
	() => import("./src/user-service/src/index.js").then(
		module => module.login
	),
	() => {
		return pathNameEquals(["", "/", "/signup"]) & !localStorage.getItem("user")
	}
);

function pathNameEquals(pathNames) {
	for (let i = 0; i < pathNames.length; i++) {
		if (location.pathname === pathNames[i]) {
			return true;
		}
	}
	return false;
}

function pathnameContains(pathNames) {
	for (let i = 0; i < pathNames.length; i++) {
		if (location.pathname === pathNames[i] || location.pathname.includes(pathNames[i])) {
			return true;
		}
	}
	return false;
}

registerApplication(
	"header",
	() => import("./src/header/header.app.js").then(module => module.header),
	() => true
);


registerApplication(
	"dashboard",
	() => import("./src/dashboard/DashBoard.app.js").then(module => module.dashboard),
	() => {
		console.log(window.location.pathname &&! (localStorage.getItem("user") === null));
		return pathnameContains(["/dashboard", "/dashboard"])
		|| (window.location.pathname &&! (localStorage.getItem("user") === null))
	}
);


start();

