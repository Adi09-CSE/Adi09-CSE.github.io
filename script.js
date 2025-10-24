const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

const form = document.getElementById('contactForm');
const statusEl = document.getElementById('formStatus');

async function submitContact(e){
  e.preventDefault();
  statusEl.textContent = 'Sending...';
  const data = Object.fromEntries(new FormData(form).entries());
  try{
    const res = await fetch('http://localhost:4000/api/contact', {
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if(!res.ok){
      const err = await res.json().catch(()=>({error:'Unknown error'}));
      throw new Error(err.error || 'Failed to send');
    }
    statusEl.textContent = 'Thanks! Message received.';
    form.reset();
  }catch(err){
    statusEl.textContent = 'Error: ' + err.message;
  }
}
if(form) form.addEventListener('submit', submitContact);

// Smooth active link highlight on scroll
const links = document.querySelectorAll('.nav-link');
const sections = [...document.querySelectorAll('section')];

function updateActive(){
  const y = window.scrollY + 120;
  let current = sections[0].id;
  sections.forEach(sec=>{
    if (y >= sec.offsetTop) current = sec.id;
  });
  links.forEach(a=>{
    if(a.getAttribute('href') === '#'+current) a.classList.add('active');
    else a.classList.remove('active');
  });
}
window.addEventListener('scroll', updateActive);
updateActive();
