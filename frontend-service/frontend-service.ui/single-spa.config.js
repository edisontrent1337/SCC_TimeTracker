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
	"python-test",
	() => SystemJS.import(PYTHON_TEST_SERVICE_BASE_API_URL + "/dist/bundle.js").then(
		module => module.pythonTest
	),
	() => {
		return pathNameEquals(["", "/", "/test", "/config"])
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


start();

