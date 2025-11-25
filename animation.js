// animations.js - slide-in and fade-in for elements
document.addEventListener('DOMContentLoaded', () => {
  // section dividers
  const divs = document.querySelectorAll('[data-animate]');
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add('show');
    });
  },{threshold:0.25});
  divs.forEach(d=>obs.observe(d));

  // product cards fade
  const cards = document.querySelectorAll('[data-fade]');
  const obsCard = new IntersectionObserver((entries)=>{
    entries.forEach(en=>{
      if(en.isIntersecting) en.target.classList.add('show');
    });
  },{threshold:0.2});
  cards.forEach(c=>obsCard.observe(c));
});
