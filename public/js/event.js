(function ($) {
	function setLoading(bool = true) {
		if (bool) {
			$("#sub-btn").text("Loading...");
			$("#sub-btn").prop("disabled", true);
			return;
		}

		$("#sub-btn").text("Save changes");
		$("#sub-btn").prop("disabled", false);
	}

	function setSearchLoading(bool = true) {
		if (bool) {
			$("#event-search-btn").text("Loading...");
			$("#event-search-btn").prop("disabled", true);
			return;
		}

		$("#event-search-btn").text("Search");
		$("#event-search-btn").prop("disabled", false);
	}

	//on submit handler
	$("#eventform").on("submit", (e) => {
		e.preventDefault();

		if (!isLoggedin()) {
			alert("you are not logged in!");
			return;
		}

		setLoading();

		const data = new FormData(e.currentTarget);
		const valObj = Object.fromEntries([...data.entries()]);

		if (!valObj.imagefile.name) {
			alert("Image is required!!");
			return;
		}

		fetch("/api/events?token=" + getToken(), {
			method: "post",
			body: data,
		})
			.then(async (res) => {
				const body = await res.json();

				console.log(res);

				if (!res.ok) {
					alert(body.message || "Something went wrong!");
					setLoading(false);
					return;
				}

				alert("Event is successfully added!!");
				setLoading(false);
			})
			.catch((e) => {
				alert("Something went wrong");
				setLoading(false);
			});
	});

	$("#event-search-form").on("submit", (e) => {
		e.preventDefault();

		fetchEvents();
	});

	const fetchEvents = () => {
		setSearchLoading();
		const zipcode = $("#search-zipcode").val();

		$.get("/api/events?zipcode=" + zipcode, function (data, status) {
			if (status === "success") {
				let htmlString = "";

				if (!data.length) {
					htmlString = "<center><h1>No Data Found!!</h1></center>";
				} else {
					data.forEach((obj) => {
						htmlString += `<div
									class="col-lg-4 col-md-6 wow fadeInUp"
									data-wow-delay="0.3s"
								>
									<div class="property-item rounded overflow-hidden">
										<div class="position-relative overflow-hidden">
											<a href=""
												><img
													class="img-fluid"
													src="${obj.image_path}"
													alt=""
													style="width: 100%; height: 280px; object-fit: cover"
													height="300"
											/></a>
											
										</div>
										<div class="p-4 pb-0">
											<h6 class="text-primary mb-3">By ${obj.name}</h6>
											<a class="d-block h5 mb-2" href=""
												>${obj.event_title}</a
											>
											<p>
												<i class="fa fa-map-marker-alt text-primary me-2"></i
												>${obj.address}, ${obj.zipcode}
											</p>
										</div>
										
									</div>
								</div>`;
					});
				}

				$("#event-rows").html(htmlString);
			}
			setSearchLoading(false);
		});
	};

	//set minimum value as today to date input
	var today = new Date();
	var dd = String(today.getDate()).padStart(2, "0");
	var mm = String(today.getMonth() + 1).padStart(2, "0");
	var yyyy = today.getFullYear();

	today = yyyy + "-" + mm + "-" + dd;
	$("#eventdate").attr("min", today);

	fetchEvents();
})(jQuery);

const imageInput = document.getElementById("customFile1");

//handle preview of selected image
imageInput.onchange = function name(event) {
	const imageFiles = event.target.files;
	const imageFilesLength = imageFiles.length;
	if (imageFilesLength > 0) {
		const imageSrc = URL.createObjectURL(imageFiles[0]);

		const imagePreviewElement = document.querySelector(
			"#preview-selected-image"
		);

		imagePreviewElement.src = imageSrc;
	}
};
