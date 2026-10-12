
"use strict";

document.addEventListener("DOMContentLoaded", () => {

  // ==========================================
  // 1. Active Navigation Link
  // ==========================================
  const page = document.body.dataset.page || "home";

  document.querySelectorAll("[data-nav-key]").forEach((link) => {
    const isCurrent = link.dataset.navKey === page;
    link.classList.toggle("active", isCurrent);
    if (isCurrent) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });


  // ==========================================
  // 2. Mobile Navigation Toggle
  // ==========================================
  const toggle = document.querySelector(".mobile-toggle");
  const menu = document.querySelector(".nav-menu");

  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");

      toggle.setAttribute("aria-expanded", String(isOpen));
      toggle.setAttribute("aria-label", isOpen ? "मुख्य मेनु बन्द गर्नुहोस्" : "मुख्य मेनु खोल्नुहोस्");
    });
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.setAttribute("aria-label", "मुख्य मेनु खोल्नुहोस्");
      });
    });
  }


  // ==========================================
  // 3. Dropdown Menus
  // ==========================================
  document.querySelectorAll(".nav-trigger").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();

      const currentDropdown = button.closest(".nav-dropdown");

      if (!currentDropdown) return;

      const isAlreadyOpen =
        currentDropdown.classList.contains("open");

      document.querySelectorAll(".nav-dropdown.open").forEach(
        (dropdown) => {
          dropdown.classList.remove("open");

          const btn = dropdown.querySelector(".nav-trigger");

          if (btn) {
            btn.setAttribute("aria-expanded", "false");
          }
        }
      );

      if (!isAlreadyOpen) {
        currentDropdown.classList.add("open");

        button.setAttribute("aria-expanded", "true");
      }
    });
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-dropdown")) {
      document.querySelectorAll(".nav-dropdown.open").forEach(
        (dropdown) => {
          dropdown.classList.remove("open");

          const btn = dropdown.querySelector(".nav-trigger");

          if (btn) {
            btn.setAttribute("aria-expanded", "false");
          }
        }
      );
    }
  });


  // Close open navigation layers with Escape for keyboard users.
  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    document.querySelectorAll(".nav-dropdown.open").forEach((dropdown) => {
      dropdown.classList.remove("open");
      dropdown.querySelector(".nav-trigger")?.setAttribute("aria-expanded", "false");
    });
    const menu = document.querySelector(".nav-menu");
    const toggle = document.querySelector(".mobile-toggle");
    if (menu?.classList.contains("open")) {
      menu.classList.remove("open");
      toggle?.setAttribute("aria-expanded", "false");
      toggle?.setAttribute("aria-label", "मुख्य मेनु खोल्नुहोस्");
      toggle?.focus();
    }
  });

  // ==========================================
  // 4. Automatically Update Footer Year
  // ==========================================
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }


  // ==========================================
  // 5. Hero Image Auto Slider
  // ==========================================
  const slides = document.querySelectorAll(".slide");

  if (slides.length > 1 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    let currentSlide = 0;
    const totalSlides = slides.length;

    setInterval(() => {
      slides[currentSlide].classList.remove("active");

      currentSlide = (currentSlide + 1) % totalSlides;

      slides[currentSlide].classList.add("active");
    }, 4000);
  }


  // ==========================================
  // 6. Auto Header Date Display
  // ==========================================
  function updateHeaderDate() {
    const options = {
      month: "short",
      day: "numeric",
      year: "numeric"
    };

    const today = new Date();

    const formattedDate = today
      .toLocaleDateString("en-US", options)
      .replace(",", ".");

    const dateElement = document.getElementById(
      "currentDateDisplay"
    );

    if (dateElement) {
      dateElement.textContent = formattedDate;
    }
  }

  updateHeaderDate();


  // ==========================================
  // 7. Gallery Filter + GLightbox
  // ==========================================
  const grid = document.querySelector(".gallery-grid");

  if (grid) {
    const galleryItems = Array.from(
      grid.querySelectorAll(".gallery-item")
    );

    const filterButtons = document.querySelectorAll(
      ".gallery-filter"
    );

    let lightbox = null;

    // Create or refresh the lightbox
    function initLightbox() {
      if (lightbox) {
        lightbox.destroy();
        lightbox = null;
      }

      if (typeof GLightbox !== "function") {
        console.error(
          "GLightbox load भएन। HTML मा library script जाँच गर्नुहोस्।"
        );
        return;
      }

      const visibleItems = galleryItems.filter(
        (item) => !item.hidden
      );

      const elements = visibleItems.map((item) => ({
        href: item.getAttribute("href"),
        type: "image",
        title:
          item.dataset.title ||
          item.querySelector("img")?.alt ||
          ""
      }));

      if (elements.length > 0) {
        lightbox = GLightbox({
          elements: elements,
          loop: true,
          touchNavigation: true,
          keyboardNavigation: true,
          closeButton: true,
          zoomable: true,
          draggable: true
        });
      }
    }

    // Open the clicked image at the correct position
    galleryItems.forEach((item) => {
      item.addEventListener("click", (event) => {
        event.preventDefault();

        if (item.hidden || !lightbox) return;

        const visibleItems = galleryItems.filter(
          (image) => !image.hidden
        );

        const index = visibleItems.indexOf(item);

        if (index !== -1) {
          lightbox.openAt(index);
        }
      });
    });

    // Apply category filters
    filterButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const category = button.dataset.filter;

        galleryItems.forEach((item) => {
          const matches =
            category === "all" ||
            item.dataset.category === category;

          item.hidden = !matches;
        });

        filterButtons.forEach((filter) => {
          const isActive = filter === button;

          filter.classList.toggle("active", isActive);

          filter.setAttribute(
            "aria-pressed",
            String(isActive)
          );
        });

        // Rebuild lightbox using visible images only
        initLightbox();
      });
    });

    // Initialize gallery on page load
    initLightbox();
  }

});


// ==========================================
// 8. Google Translate Global Function
// ==========================================
function triggerGoogleTranslate(event) {
  if (event) {
    event.preventDefault();
  }

  const btn = document.getElementById("langSwitchBtn");
  const selectField = document.querySelector(".goog-te-combo");

  if (!btn || !selectField) {
    console.warn(
      "Google Translate अझै load भएको छैन।"
    );
    return;
  }

  const currentText = btn.textContent.trim();

  if (currentText === "EN") {
    selectField.value = "en";

    selectField.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    btn.textContent = "ने";
  } else {
    selectField.value = "ne";

    selectField.dispatchEvent(
      new Event("change", { bubbles: true })
    );

    btn.textContent = "EN";
  }
}