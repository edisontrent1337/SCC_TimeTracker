let token = JSON.parse(localStorage.getItem("user"));
if (!token) {
	token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0ZXN0X3VzZXIiLCJleHAiOjE1Njc2NzkxOTh9.40B8lMip9pAFF6vnb1AibnZbSeR2hDR4zCXQeD1fmdbagtW5KEuj3M112us_9Aw-UyDJ8WUDsqPrJ-_wTZa3lw"
}
else {
	token = token.token;
}
export const client = {
	get,
	post,
	put,
	getUserNames,
	getUserUuid
};


function post(url, body) {
	return fetch(BASE_API_URL + url, {
		method: "POST",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Bearer " + token
		},
		body: body

	});
}

function put(url, body) {
	return fetch(BASE_API_URL + url, {
		method: "PUT",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Bearer " + token
		},
		body: body

	});
}

function get(url) {
	console.log(token);
	return fetch(TIMING_SERVICE_BASE_API_URL + url, {
		method: "GET",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Bearer " + token
		}
	});
}

function getUserUuid(name) {
	return fetch(USER_SERVICE_BASE_API_URL + "/users/" + name + "/uuid", {
		method: "GET",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Bearer " + token
		}
	});
}

function getUserNames(body) {
	return fetch(USER_SERVICE_BASE_API_URL + "/users/info", {
		method: "POST",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Bearer " + token
		},
		body: body
	});
}