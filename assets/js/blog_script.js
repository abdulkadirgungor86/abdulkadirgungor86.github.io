const menuToggle=document.querySelector(".menu-toggle"),navMenu=document.querySelector(".nav-menu");menuToggle.addEventListener("click",()=>{navMenu.classList.toggle("active")}),document.addEventListener("click",e=>{let n=navMenu.contains(e.target),a=menuToggle.contains(e.target);!n&&!a&&navMenu.classList.contains("active")&&navMenu.classList.remove("active")});const navLinks=document.querySelectorAll(".nav-menu a");navLinks.forEach(e=>{e.addEventListener("click",()=>{navMenu.classList.contains("active")&&navMenu.classList.remove("active")})});
