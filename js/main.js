(function () {
	"use strict";

	// Scroll-reveal for timeline and portfolio items
	var revealTargets = document.querySelectorAll(".job, .portfolio__item");
	if ("IntersectionObserver" in window && revealTargets.length) {
		revealTargets.forEach(function (el) {
			el.classList.add("will-reveal");
		});
		var observer = new IntersectionObserver(
			function (entries) {
				entries.forEach(function (entry) {
					if (entry.isIntersecting) {
						entry.target.classList.add("is-visible");
						observer.unobserve(entry.target);
					}
				});
			},
			{ threshold: 0.15 }
		);
		revealTargets.forEach(function (el) {
			observer.observe(el);
		});
	}

	// Lightbox
	var dialog = document.getElementById("lightbox");
	if (dialog) {
		var img = document.getElementById("lightbox-img");
		var caption = document.getElementById("lightbox-caption");
		var closeBtn = dialog.querySelector(".lightbox__close");

		document.querySelectorAll(".portfolio__trigger").forEach(function (btn) {
			btn.addEventListener("click", function () {
				img.src = btn.getAttribute("data-src");
				img.alt = btn.getAttribute("data-caption") || "";
				caption.textContent = btn.getAttribute("data-caption") || "";
				dialog.showModal();
			});
		});

		closeBtn.addEventListener("click", function () {
			dialog.close();
		});

		dialog.addEventListener("click", function (event) {
			if (event.target === dialog) {
				dialog.close();
			}
		});
	}
})();
