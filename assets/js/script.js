const navSlide = () => {
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav-links');
    const navLinks = document.querySelectorAll('.nav-links li');

    burger.addEventListener('click', () => {
        nav.classList.toggle('nav-active');
        burger.classList.toggle('toggle');

        navLinks.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                nav.classList.remove('nav-active');
                burger.classList.remove('toggle');
                 navLinks.forEach(l => l.style.animation = '');
            }
        });
    });
}

navSlide();

const header = document.querySelector('.header');
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  if (scrollTop > lastScrollTop && scrollTop > header.offsetHeight) {
    header.style.top = `-${header.offsetHeight}px`;
  } else {
    header.style.top = "0";
  }
  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});