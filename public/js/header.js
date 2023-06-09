const headerBtn = document.getElementById("header-login-btn");

function setHeaderButton() {
	if (isLoggedin()) {
		const username = getUserName();
		headerBtn.innerText = username;
		headerBtn.onclick = function (params) {
			//logging out
			localStorage.removeItem("token");
			localStorage.removeItem("name");
			window.location.reload();
		};
	} else {
		headerBtn.innerText = "Login / Sign Up";

		headerBtn.onclick = function (params) {
			window.location = "/login.html";
		};

		localStorage.removeItem("token");
		localStorage.removeItem("name");
	}
}

function isLoggedin() {
	if (localStorage.getItem("token")) {
		return true;
	}

	return false;
}

function getUserName(params) {
	return localStorage.getItem("name");
}

function getToken(params) {
	return localStorage.getItem("token");
}

setHeaderButton();
