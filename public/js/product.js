(function ($) {
	function setReqFormLoading(bool = true) {
		if (bool) {
			$("#req-sub-btn").text("Loading...");
			$("#req-sub-btn").prop("disabled", true);
			return;
		}

		$("#req-sub-btn").text("Save changes");
		$("#req-sub-btn").prop("disabled", false);
	}

	function setPostFormLoading(bool = true) {
		if (bool) {
			$("#post-sub-btn").text("Loading...");
			$("#post-sub-btn").prop("disabled", true);
			return;
		}

		$("#post-sub-btn").text("Save changes");
		$("#post-sub-btn").prop("disabled", false);
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

	//request on submit handler
	$("#request-pro-form").on("submit", (e) => {
		e.preventDefault();

		if (!isLoggedin()) {
			alert("you are not logged in!");
			return;
		}

		setReqFormLoading();

		const data = new FormData(e.currentTarget);
		data.append("type", "buyer");

		const valObj = Object.fromEntries([...data.entries()]);

		if (!valObj.imagefile.name) {
			alert("Image is required!!");
			return;
		}

		console.log(valObj);

		fetch("/api/products?token=" + getToken(), {
			method: "post",
			body: data,
		})
			.then(async (res) => {
				const body = await res.json();

				console.log(res);

				if (!res.ok) {
					alert(body.message || "Something went wrong!");
					setReqFormLoading(false);
					return;
				}

				alert("Product is successfully added!!");
				setReqFormLoading(false);
			})
			.catch((e) => {
				alert("Something went wrong");
				setReqFormLoading(false);
			});
	});

	//post product on submit handler
	$("#post-product-form").on("submit", (e) => {
		e.preventDefault();

		if (!isLoggedin()) {
			alert("you are not logged in!");
			return;
		}

		setPostFormLoading();

		const data = new FormData(e.currentTarget);
		data.append("type", "seller");

		const valObj = Object.fromEntries([...data.entries()]);

		if (!valObj.imagefile.name) {
			alert("Image is required!!");
			return;
		}

		console.log(valObj);

		fetch("/api/products?token=" + getToken(), {
			method: "post",
			body: data,
		})
			.then(async (res) => {
				const body = await res.json();

				console.log(res);

				if (!res.ok) {
					alert(body.message || "Something went wrong!");
					setPostFormLoading(false);
					return;
				}

				alert("Product is successfully added!!");
				setPostFormLoading(false);
			})
			.catch((e) => {
				alert("Something went wrong");
				setPostFormLoading(false);
			});
	});

	const fetchProducts = () => {
		$.get("/api/products", function (data, status) {
			if (status === "success") {
				let htmlString = "";

				if (!data.length) {
					htmlString = "<center><h1>No Data Found!!</h1></center>";
				} else {
					data.forEach((obj) => {
						htmlString += `<div class="fb-post">
								<div class="fb-post-header">
									<img
										src="/img/user-profile.png"
										alt="Profile Picture"
									/>
									<div class="fb-post-header-text">
										<h3>${obj.name}</h3>
										<p>Posted on ${window.moment(obj.pro_posted).format("DD MMM, YYYY hh:mm A")}</p>
									</div>
								</div>
								<div class="fb-post-content">
									<p>
										${obj.pro_desc}
									</p>
									<div class="fb-post-images">
										<img src="${obj.image_path}" />
									</div>
								</div>
								<div class="fb-post-footer">
									<!-- <button>Like</button> 
                      <button>Comment</button> 
                      <button>Share</button>  -->
									<a href="" class="btn btn-primary px-3 w-100">
										<i class="fa fa-envelope text-primary me-2"></i>Contact
										${obj.selling_type.charAt(0).toUpperCase() + obj.selling_type.slice(1)}
									</a>
								</div>
							</div>`;
					});
				}

				$("#post-collec").html(htmlString);
			}
		});
	};

	fetchProducts();
})(jQuery);

const imageReqInput = document.getElementById("customFile1-req");
const imagePostInput = document.getElementById("customFile1-post");

//handle preview of selected image
imageReqInput.onchange = function name(event) {
	const imageFiles = event.target.files;
	const imageFilesLength = imageFiles.length;
	if (imageFilesLength > 0) {
		const imageSrc = URL.createObjectURL(imageFiles[0]);

		const imagePreviewElement = document.querySelector("#preview-req-img");

		imagePreviewElement.src = imageSrc;
	}
};
//handle preview of selected image
imagePostInput.onchange = function name(event) {
	const imageFiles = event.target.files;
	const imageFilesLength = imageFiles.length;
	if (imageFilesLength > 0) {
		const imageSrc = URL.createObjectURL(imageFiles[0]);

		const imagePreviewElement = document.querySelector("#preview-post-img");

		imagePreviewElement.src = imageSrc;
	}
};
