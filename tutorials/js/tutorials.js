(function () {
	"use strict";

	var TUTORIALS = window.TUTORIALS || [];

	// ---- Index page: render the tile grid from the manifest, with search + tag filtering ----
	var grid = document.getElementById("tutorial-grid");
	if (grid) {
		if (!TUTORIALS.length) {
			grid.innerHTML = '<p class="tutorial-empty">No tutorials published yet — check back soon.</p>';
		} else {
			var cards = TUTORIALS.map(function (t) {
				var li = document.createElement("li");
				li.className = "tutorial-card";
				var tagsHtml = t.tags
					.map(function (tag) {
						return '<span class="tag">' + tag + "</span>";
					})
					.join("");
				li.innerHTML =
					'<a class="tutorial-card__link" href="' + t.slug + '.html">' +
						'<h2 class="tutorial-card__title">' + t.title + "</h2>" +
						'<p class="tutorial-card__summary">' + t.summary + "</p>" +
						'<span class="tutorial-card__meta">' +
							tagsHtml +
							'<span class="read-time">' + t.minutes + " min read</span>" +
						"</span>" +
					"</a>";
				grid.appendChild(li);
				return { el: li, tutorial: t };
			});

			var emptyState = document.createElement("li");
			emptyState.className = "tutorial-empty-state";
			emptyState.textContent = "No tutorials match your search.";
			emptyState.hidden = true;
			grid.appendChild(emptyState);

			var searchInput = document.getElementById("tutorial-search");
			var tagList = document.getElementById("tutorial-tags");
			var activeTags = {};

			function applyFilter() {
				var query = searchInput ? searchInput.value.trim().toLowerCase() : "";
				var hasActiveTags = Object.keys(activeTags).length > 0;
				var visibleCount = 0;
				cards.forEach(function (card) {
					var t = card.tutorial;
					var matchesTags =
						!hasActiveTags ||
						t.tags.some(function (tag) {
							return activeTags[tag];
						});
					var haystack = (t.title + " " + t.summary + " " + t.tags.join(" ")).toLowerCase();
					var matchesQuery = query === "" || haystack.indexOf(query) !== -1;
					var visible = matchesTags && matchesQuery;
					card.el.hidden = !visible;
					if (visible) {
						visibleCount++;
					}
				});
				emptyState.hidden = visibleCount !== 0;
			}

			if (tagList) {
				var allTags = [];
				TUTORIALS.forEach(function (t) {
					t.tags.forEach(function (tag) {
						if (allTags.indexOf(tag) === -1) {
							allTags.push(tag);
						}
					});
				});
				allTags.sort().forEach(function (tag) {
					var btn = document.createElement("button");
					btn.type = "button";
					btn.className = "tutorial-tag-filter";
					btn.textContent = tag;
					btn.setAttribute("aria-pressed", "false");
					btn.addEventListener("click", function () {
						if (activeTags[tag]) {
							delete activeTags[tag];
							btn.classList.remove("is-active");
							btn.setAttribute("aria-pressed", "false");
						} else {
							activeTags[tag] = true;
							btn.classList.add("is-active");
							btn.setAttribute("aria-pressed", "true");
						}
						applyFilter();
					});
					tagList.appendChild(btn);
				});
			}

			if (searchInput) {
				searchInput.addEventListener("input", applyFilter);
			}
		}
	}

	// ---- Tutorial page: prev / next pager from manifest order ----
	var pager = document.getElementById("tutorial-pager");
	if (pager) {
		var slug = document.body.getAttribute("data-tutorial-slug");
		var index = TUTORIALS.findIndex(function (t) {
			return t.slug === slug;
		});
		var prev = index > 0 ? TUTORIALS[index - 1] : null;
		var next = index >= 0 && index < TUTORIALS.length - 1 ? TUTORIALS[index + 1] : null;

		if (prev) {
			var prevLink = document.createElement("a");
			prevLink.className = "tutorial-pager__link tutorial-pager__link--prev";
			prevLink.href = prev.slug + ".html";
			prevLink.innerHTML =
				'<span class="tutorial-pager__label">&larr; Previous</span>' +
				'<span class="tutorial-pager__title">' + prev.title + "</span>";
			pager.appendChild(prevLink);
		}
		if (next) {
			var nextLink = document.createElement("a");
			nextLink.className = "tutorial-pager__link tutorial-pager__link--next";
			nextLink.href = next.slug + ".html";
			nextLink.innerHTML =
				'<span class="tutorial-pager__label">Next &rarr;</span>' +
				'<span class="tutorial-pager__title">' + next.title + "</span>";
			pager.appendChild(nextLink);
		}
		if (!prev && !next) {
			pager.remove();
		}
	}

	// ---- Copy-to-clipboard on code blocks ----
	document.querySelectorAll(".code-block__copy").forEach(function (btn) {
		btn.addEventListener("click", function () {
			var code = btn.closest(".code-block").querySelector("code");
			navigator.clipboard.writeText(code.textContent).then(function () {
				var original = btn.textContent;
				btn.textContent = "Copied";
				setTimeout(function () {
					btn.textContent = original;
				}, 1500);
			});
		});
	});

	// ---- Scroll-reveal (same pattern as the main site) ----
	var revealTargets = document.querySelectorAll(".step, .tutorial-card");
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

	// ---- Prism syntax highlighting ----
	if (window.Prism) {
		window.Prism.highlightAll();
	}
})();
