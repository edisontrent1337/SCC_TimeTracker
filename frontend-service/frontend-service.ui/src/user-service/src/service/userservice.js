export const userService = {
	get,
	post
};


function post(url, body) {
	return fetch(USER_SERVICE_BASE_API_URL + url, {
		method: "POST",
		body: JSON.stringify(body),
		mode: "cors",
		headers: {
			"Content-Type": "application/json"
		}
	})
		.then(handleResponse)
		.then(response => {
			return response;
		});
}

function handleResponse(response) {
	return response.text().then(text => {
		const data = text && JSON.parse(text);
		console.log(data);
		if (!response.ok) {
			if (response.status >= 500) {
				throw new Error(
					"Bad response from server. Status code is: " +
					response.status
				);
			}
			if (response.status === 401) {
				logout();
				location.reload(true);
			}

			return Promise.reject(response);
		}

		return data;
	});
}

function get(string) {
	return Promise.reject("Not implemented yet.");
}

function logout() {
	localStorage.removeItem("user");
}
