import {registerApplication, start} from "single-spa";
import SystemJS from "./src/systemjs/dist/system.src.js";
import "./public/style/style.css";

// FIXME externalize the API BASE URL
const API_BASE_URL = "http://" + location.hostname + ":8762";
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
	() =>
		SystemJS.import(API_BASE_URL + "/user-service/dist/bundle.js").then(
			module => module.login
		),
	() => {
		return pathnameContains(["", "/", "/signup"]) & !localStorage.getItem("user")
	}
);

function pathnameContains(pathnames) {
	for (let i = 0; i < pathnames.length; i++) {
		if (location.pathname === pathnames[i] || location.pathname.includes(pathnames[i])) {
			console.log(location.pathname);
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
	"service-frame",
	() =>
		import("./src/serviceframe/serviceframe.app.js").then(
			module => module.serviceFrame
		),
	pathPrefix("/services")
);


registerApplication(
	"projectService",
	() =>
		SystemJS.import(API_BASE_URL + "/project-service/dist/bundle.js").then(module => module.projectService)
	,
	() => {
		return pathnameContains(["/projects", "/project"]) && localStorage.getItem("user")
	}
);

export default function fetchServices() {
	return fetch(API_BASE_URL + "/frontend-service/uiservices", {
		method: "GET",
		mode: "cors",
		headers: {
			Accept: "application/json"
		}
	}).then(response => response.json());
}
fetchServices().then(response => {
	response.services.forEach(service => {
		registerApplication(
			service.serviceId,
			() =>
				SystemJS.import(API_BASE_URL + service.serviceAddress).then(
					module => module.smartService
				),
			pathPrefix("/services/" + service.serviceId)
		);
	});
});
start();

function pathPrefix(prefix) {
	return function (location) {
		return location.pathname.startsWith(`${prefix}`);
	};
}
