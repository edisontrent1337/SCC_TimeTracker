let token = JSON.parse(localStorage.getItem("user"));
if (!token) {
	token = "";
}
else {
	token = token.token;
}

export const client = {
	get,
	post,
	put,
	del,
};


function post(url, body, component) {
	let headers = generateHeaders(token, body);
	headers.method = "POST";
	return fetch(PYTHON_TEST_SERVICE_BASE_API_URL + url, headers
	).catch((err) => handleError(err, component));
}

function del(url, component) {
	let headers = generateHeaders(token);
	headers.method = "DELETE";
	return fetch(PYTHON_TEST_SERVICE_BASE_API_URL + url, headers
	).catch((err) => handleError(err, component));
}

function put(url, body, component) {
	let headers = generateHeaders(token, body);
	headers.method = "PUT";
	return fetch(PYTHON_TEST_SERVICE_BASE_API_URL + url, headers).catch((err) => handleError(err, component));
}

function get(url, component) {
	let headers = generateHeaders(token);
	header.method = "GET";
	return fetch(PYTHON_TEST_SERVICE_BASE_API_URL + url, headers).catch((err) => handleError(err, component));
}


function handleError(err, component) {
	component.setState({
		connectionError: err.message,
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