(function ($) {
	function setLoading(bool = true) {
		if (bool) {
			$("#sub-btn").text("Loading...");
			$("#sub-btn").prop("disabled", true);
			return;
		}

		$("#sub-btn").text("Sign Up");
		$("#sub-btn").prop("disabled", false);
	}

	//on submit handler
	$("#signupform").on("submit", (e) => {
		e.preventDefault();
		setLoading();

		const data = new FormData(e.currentTarget);
		const valObj = Object.fromEntries([...data.entries()]);

		console.log(valObj);

		if (valObj.pass !== valObj.cpass) {
			alert("Passwords do not match!!");
			setLoading(false);
			return;
		}

		$.post("/api/users", { ...valObj }, function (res) {
			localStorage.setItem("token", res.token);
			localStorage.setItem("name", res.name);
			window.location = "/event.html";
		})
			.fail(function (res) {
				if (res.responseJSON) {
					alert(res.responseJSON.message);
				}
			})
			.always(() => {
				setLoading(false);
			});
	});

	if (localStorage.getItem("token")) {
		window.location = "/";
	}
})(jQuery);
