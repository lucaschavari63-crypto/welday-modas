const header = document.querySelector(".site-header");

window.addEventListener("scroll", () => {
  if (window.scrollY > 32) {
    header.style.background = "rgba(17, 23, 25, 0.9)";
  } else {
    header.style.background = "rgba(17, 23, 25, 0.66)";
  }
});
