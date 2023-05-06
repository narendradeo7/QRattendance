

console.log("main js is working");

// array of all the present route pages 

var routpages =["/","/login"];

// Get the current URL path
const path = window.location.pathname;

// Match the path with the navbar links and add the active class to the matching link
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  if (link.pathname === path) {
    link.classList.add("active");
  } else {
    link.classList.remove("active");
  }
});