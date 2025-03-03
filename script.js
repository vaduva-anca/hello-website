"use strict";
const itemsFaq = document.querySelectorAll(".item");
const slides = document.querySelectorAll(".slide");
const maxSlide = slides.length;
console.log(maxSlide);

function fetchTestimonials() {
  fetch("http://localhost:3000/testimonials")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Fetched testimonials:", data);
      displayTestimonials(data); // Pass fetched testimonials to display function
    })
    .catch((error) => {
      console.error("Error fetching testimonials:", error);
      // Handle error, optionally retry fetch, or display error message
    });
}

function displayTestimonials(testimonials) {
  const slider = document.querySelector(".slider");

  const htmlString = testimonials
    .map(
      (testimonial) => `
        <div class="slide" style="transform: translateX(300%);">
          <div class="container">
            <div class="testimonials">
              <img src="img/stears.webp" alt="stars" class="stars-img section-transform-vertical"/>
              <p class="testimonial-description">"${testimonial.description}"</p>
              <div class="testimonial-logo">
                <img src="img/testimonial-logo.webp" alt="logo" class="testimonial-logo-img"/>
                <div>
                  <p>${testimonial.name}</p>
                  <span>${testimonial.company}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      `
    )
    .join("");

  slider.insertAdjacentHTML("beforeend", htmlString);
  updateSlider();
}

// Initial fetch of testimonials when the page loads

itemsFaq.forEach((item) => {
  const iconFaq = item.querySelector(".icon");
  const hiddenBoxFaq = item.querySelector(".hidden-box");

  item.addEventListener("click", function () {
    hiddenBoxFaq.classList.toggle("open-box");
    iconFaq.classList.toggle("icon-rotate-right");
    iconFaq.classList.toggle("icon-rotate-left");
  });
});

// Set current year
const yearEl = document.querySelector(".year");
const currentYear = new Date().getFullYear();
yearEl.textContent = currentYear;

// Sticky navigation

const sectionHeroEl = document.querySelector(".section-hero");

const obs = new IntersectionObserver(
  function (entries) {
    const ent = entries[0];
    console.log(ent);

    // Verificăm dacă ecranul este mai mare de 550px
    if (window.innerWidth > 550) {
      if (ent.isIntersecting === false) {
        document.body.classList.add("sticky");
      } else {
        document.body.classList.remove("sticky");
      }
    } else {
      // Eliminăm sticky dacă ecranul este mai mic de 550px
      document.body.classList.remove("sticky");
    }
  },
  {
    root: null,
    threshold: 0,
    rootMargin: "-80px",
  }
);

obs.observe(sectionHeroEl);

// Ascultăm evenimentul de redimensionare pentru a ne asigura că navigația rămâne corect setată
window.addEventListener("resize", function () {
  if (window.innerWidth <= 550) {
    document.body.classList.remove("sticky");
  }
});

// Modal window

const modal = document.querySelector(".modal");
const overlay = document.querySelector(".overlay");
const btnCloseModal = document.querySelector(".btn--close-modal");
const btnsOpenModal = document.querySelectorAll(".btn--show-modal");

const openModal = function () {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
};

const closeModal = function () {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
};

for (let i = 0; i < btnsOpenModal.length; i++)
  btnsOpenModal[i].addEventListener("click", openModal);

btnCloseModal.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape" && !modal.classList.contains("hidden")) {
    closeModal();
  }
});

// REVEAL SECTIONS
const allSectionsVertical = document.querySelectorAll(
  ".section-transform-vertical"
);

const revealSection = function (entries, observer) {
  const [entry] = entries;

  if (!entry.isIntersecting) return;

  entry.target.classList.remove("section--hidden");
  observer.unobserve(entry.target);
};

const sectionObserver = new IntersectionObserver(revealSection, {
  root: null,
  threshold: 0.15,
});

allSectionsVertical.forEach(function (section) {
  sectionObserver.observe(section);
  section.classList.add("section--hidden");
});

// Slider
const slider = function () {
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;

  // Functions
  const createDots = function () {
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };

  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();

    activateDot(0);
  };
  init();

  // Event handlers
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
};
slider();

document.addEventListener("DOMContentLoaded", function () {
  fetchTestimonials();

  const stars = document.querySelectorAll(".star");
  const starsInput = document.getElementById("stars");
  const form = document.getElementById("testimonial-form");

  stars.forEach((star) => {
    star.addEventListener("click", function () {
      const rating = this.getAttribute("data-value");
      starsInput.value = rating;
      updateStarRating(rating);
    });

    star.addEventListener("mouseover", function () {
      const rating = this.getAttribute("data-value");
      updateStarRating(rating, true);
    });

    star.addEventListener("mouseout", function () {
      const rating = starsInput.value;
      updateStarRating(rating);
    });
  });

  function updateStarRating(rating, hover = false) {
    stars.forEach((star) => {
      star.classList.remove("selected", "hover");
      if (star.getAttribute("data-value") <= rating) {
        if (hover) {
          star.classList.add("hover");
        } else {
          star.classList.add("selected");
        }
      }
    });
  }

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = document.getElementById("name").value;
    const company = document.getElementById("company").value;
    const stars = document.getElementById("stars").value;
    const description = document.getElementById("description").value;

    fetch("http://localhost:3000/submit_testimonial", {
      // Correct URL
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        company: company,
        stars: stars,
        description: description,
      }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data); // Show a success message
        form.reset(); // Reset the form fields
        updateStarRating(0); // Reset star rating display
      })
      .catch((error) => {
        console.error("Error:", error);
        alert(
          "An error occurred while submitting your testimonial. Please try again."
        );
      });
  });
});

// Function to initialize slider functionality
function updateSlider() {
  const slides = document.querySelectorAll(".slide");
  const btnLeft = document.querySelector(".slider__btn--left");
  const btnRight = document.querySelector(".slider__btn--right");
  const dotContainer = document.querySelector(".dots");

  let curSlide = 0;
  const maxSlide = slides.length; // Update maxSlide after adding new slides
  console.log(maxSlide + "aaa");

  // Functions
  const createDots = function () {
    dotContainer.innerHTML = ""; // Clear existing dots
    slides.forEach(function (_, i) {
      dotContainer.insertAdjacentHTML(
        "beforeend",
        `<button class="dots__dot" data-slide="${i}"></button>`
      );
    });
  };
  const activateDot = function (slide) {
    document
      .querySelectorAll(".dots__dot")
      .forEach((dot) => dot.classList.remove("dots__dot--active"));

    document
      .querySelector(`.dots__dot[data-slide="${slide}"]`)
      .classList.add("dots__dot--active");
  };

  const goToSlide = function (slide) {
    slides.forEach(
      (s, i) => (s.style.transform = `translateX(${100 * (i - slide)}%)`)
    );
  };

  // Next slide
  const nextSlide = function () {
    if (curSlide === maxSlide - 1) {
      curSlide = 0;
    } else {
      curSlide++;
    }

    goToSlide(curSlide);
    activateDot(curSlide);
  };

  // Previous slide
  const prevSlide = function () {
    if (curSlide === 0) {
      curSlide = maxSlide - 1;
    } else {
      curSlide--;
    }
    goToSlide(curSlide);
    activateDot(curSlide);
  };

  const init = function () {
    goToSlide(0);
    createDots();
    activateDot(0);
  };
  init();

  // Event listeners for slider controls
  btnRight.addEventListener("click", nextSlide);
  btnLeft.addEventListener("click", prevSlide);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") prevSlide();
    e.key === "ArrowRight" && nextSlide();
  });

  dotContainer.addEventListener("click", function (e) {
    if (e.target.classList.contains("dots__dot")) {
      const { slide } = e.target.dataset;
      goToSlide(slide);
      activateDot(slide);
    }
  });
}

// document.addEventListener('DOMContentLoaded', function() {
//   fetchTestimonials(); // Initial fetch of testimonials when the page loads
// });
