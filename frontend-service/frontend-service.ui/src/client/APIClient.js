let token = JSON.parse(localStorage.getItem("user"));
if (!token) {
	token = "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiI1N2M3Y2RhOC1kYWJjLTQ2MzUtYmFlYi04Y2EwNGNjZWRjZTkiLCJ1c2VybmFtZSI6ImRlbW9fdXNlciIsImV4cCI6MTU0ODc2ODU0OH0.SV1qzfBJDMxq5QwLONsa6c_sNrz94IXUDhnj98zDCilA0UVwOL6y-9Mz3DH18B7MJ2c_KIzd-aGMiBuPA6Rb7w";
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

function put(url, body, component) {
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

	}).catch((err) => handleError(err, component));

}

function get(url, component) {
	let headers = generateHeaders(token);
	header.method = "GET";
	return fetch(TIMING_SERVICE_BASE_API_URL + url, headers).catch((err) => handleError(err, component));
}

function getUserUuid(name, component) {
	return fetch(USER_SERVICE_BASE_API_URL + "/users/" + name + "/uuid", {
		method: "GET",
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Bearer " + token
		}
	}).catch((err) => handleError(err, component));
	;
}

function getUserNames(body) {
	let headers = generateHeaders(token, body);
	header.method = "GET";
	return fetch(USER_SERVICE_BASE_API_URL + "/users/info", headers);
}

function handleError(err, component) {
	component.setState({
		connectionError: err.message
	})
}

function generateHeaders(token, body) {
	const headers = {
		mode: "cors",
		cache: "no-cache",
		credentials: "same-origin",
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Authorization": "Bearer " + token
		}
	};
	if (body) {
		headers.body = body;
	}
	return headers;
}