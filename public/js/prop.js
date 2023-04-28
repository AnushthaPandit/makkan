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
			$("#prop-search-btn").text("Loading...");
			$("#prop-search-btn").prop("disabled", true);
			return;
		}

		$("#prop-search-btn").text("Search");
		$("#prop-search-btn").prop("disabled", false);
	}

	//on submit handler
	$("#propform").on("submit", (e) => {
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

		console.log(valObj);

		fetch("/api/properties?token=" + getToken(), {
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

				alert("Property is successfully added!!");
				setLoading(false);
			})
			.catch((e) => {
				alert("Something went wrong");
				setLoading(false);
			});
	});

	$("#prop-search-form").on("submit", (e) => {
		e.preventDefault();

		fetchProps();
	});

	const fetchProps = () => {
		setSearchLoading();
		const zipcode = $("#search-zipcode").val();

		$.get("/api/properties?zipcode=" + zipcode, function (data, status) {
			if (status === "success") {
				let htmlString = "";

				if (!data.length) {
					htmlString = "<center><h1>No Data Found!!</h1></center>";
				} else {
					data.forEach((obj) => {
						htmlString += `<div
									class="col-lg-4 col-md-6 wow fadeInUp"
									data-wow-delay="0.1s"
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
											<div
												class="bg-primary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3"
											>
												For Rent
											</div>
											<div
												class="bg-white rounded-top text-primary position-absolute start-0 bottom-0 mx-4 pt-1 px-3"
											>
												${obj.property_type}
											</div>
										</div>
										<div class="p-4 pb-0">
											<h5 class="text-primary mb-3">$${obj.prop_price}</h5>
											<a class="d-block h5 mb-2" href=""
												>${obj.prop_title}</a
											>
											<p>
												<i class="fa fa-map-marker-alt text-primary me-2"></i
												>${obj.address}, ${obj.zipcode}
											</p>
										</div>
										<div class="d-flex border-top">
											<small class="flex-fill text-center border-end py-2"
												><i class="fa fa-ruler-combined text-primary me-2"></i
												>${obj.prop_size_ft} Sqft</small
											>
											<small class="flex-fill text-center border-end py-2"
												><i class="fa fa-bed text-primary me-2"></i>3 Bed</small
											>
											<small class="flex-fill text-center py-2"
												><i class="fa fa-bath text-primary me-2"></i>2
												Bath</small
											>
										</div>
									</div>
								</div>`;
					});
				}

				$("#prop-rows").html(htmlString);
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

	fetchProps();
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
