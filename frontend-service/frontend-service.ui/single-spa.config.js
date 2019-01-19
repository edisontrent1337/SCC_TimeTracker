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

function pathnameContains(pathNames) {
    for (let i = 0; i < pathNames.length; i++) {
        if (location.pathname === pathNames[i] || location.pathname.includes(pathNames[i])) {
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
    "dashboard",
    () => import("./src/dashboard/DashBoard.app.js").then(module => module.dashboard),
    () => {
        return pathnameContains(["/dashboard", "/dashboard"])
        //&& localStorage.getItem("user")
    }
);


start();

function pathPrefix(prefix) {
    return function (location) {
        return location.pathname.startsWith(`${prefix}`);
    };
}
