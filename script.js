// ===== Settings (yahin edit karein) =====
const WHATSAPP = "";   // e.g. "919876543210" (country code + number, bina + ya space ke). Khali = email khulega
const EMAIL = "Amritlifecareayurveda@gmail.com";

const $ = id => document.getElementById(id);
const reduceMotion = matchMedia('(prefers-reduced-motion:reduce)').matches;

// ===== Header shadow on scroll =====
const hdr = $('hdr');
addEventListener('scroll', () => hdr && hdr.classList.toggle('on', scrollY > 10), { passive: true });

// ===== Scroll reveal =====
const rvEls = document.querySelectorAll('.rv');
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .15 });
  rvEls.forEach((el, i) => {
    el.style.transitionDelay = (i % 3) * 100 + 'ms';
    io.observe(el);
  });
} else {
  rvEls.forEach(el => el.classList.add('in'));   // fallback: purane browsers me content hidden na rahe
}

// ===== Cursor glow + card spotlight (desktop only) =====
const glow = document.querySelector('.glow');
if (glow && matchMedia('(hover:hover)').matches) {
  addEventListener('mousemove', e => {
    glow.style.transform = `translate(${e.clientX - 210}px, ${e.clientY - 210}px)`;
  }, { passive: true });
}
document.querySelectorAll('.spot').forEach(c => c.addEventListener('mousemove', e => {
  const r = c.getBoundingClientRect();
  c.style.setProperty('--mx', e.clientX - r.left + 'px');
  c.style.setProperty('--my', e.clientY - r.top + 'px');
}));

// ===== 3D tilt on hover (desktop) =====
if (matchMedia('(hover:hover)').matches && !reduceMotion) {
  document.querySelectorAll('.tilt').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `perspective(900px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    el.addEventListener('mouseleave', () => el.style.transform = '');
  });
}

// ===== Falling leaves in hero =====
const lv = $('leaves');
if (lv && !reduceMotion) {
  for (let i = 0; i < 14; i++) {
    const s = document.createElement('span');
    s.textContent = '🍃';
    s.style.left = Math.random() * 100 + '%';
    s.style.fontSize = 14 + Math.random() * 18 + 'px';
    s.style.animationDuration = 9 + Math.random() * 10 + 's';
    s.style.animationDelay = -Math.random() * 15 + 's';
    lv.appendChild(s);
  }
}

// ===== Countdown (har raat 12 baje reset) =====
const pad = n => String(n).padStart(2, '0');
function tick() {
  const now = new Date(), end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const d = end - now;
  $('h').textContent = pad(Math.floor(d / 36e5));
  $('m').textContent = pad(Math.floor(d % 36e5 / 6e4));
  $('s').textContent = pad(Math.floor(d % 6e4 / 1e3));
}
tick(); setInterval(tick, 1000);

// ===== Order form =====
const form = $('form'), msg = $('msg');
const digitsOnly = el => el.addEventListener('input', () => el.value = el.value.replace(/\D/g, ''));
digitsOnly($('phone')); digitsOnly($('pin'));

function show(text, isErr) {
  msg.classList.toggle('err', !!isErr);
  msg.textContent = text;
}

form.addEventListener('submit', e => {
  e.preventDefault();
  const n = $('name').value.trim(), p = $('phone').value.trim(),
        a = $('addr').value.trim(), pin = $('pin').value.trim();

  const okName = n.length >= 2, okPhone = /^[6-9]\d{9}$/.test(p),
        okAddr = a.length >= 10, okPin = /^[1-9]\d{5}$/.test(pin);

  $('name').classList.toggle('bad', !okName);
  $('phone').classList.toggle('bad', !okPhone);
  $('addr').classList.toggle('bad', !okAddr);
  $('pin').classList.toggle('bad', !okPin);

  if (!okName) return show('कृपया अपना पूरा नाम लिखें।', true);
  if (!okPhone) return show('कृपया सही 10 अंकों का मोबाइल नंबर डालें।', true);
  if (!okAddr) return show('कृपया अपना पूरा पता लिखें (मकान नं., एरिया, शहर, राज्य)।', true);
  if (!okPin) return show('कृपया सही 6 अंकों का पिनकोड डालें।', true);

  const text =
`नया ऑर्डर – AMRIT THOR POWER कॉम्बो किट (₹2500)
किट: कैप्सूल 30 + ऑयल 30ml + पाउडर 50g
नाम: ${n}
मोबाइल: ${p}
पता: ${a}
पिनकोड: ${pin}`;

  show('धन्यवाद! आपका ऑर्डर मैसेज खुल रहा है...', false);
  if (typeof gtag === 'function') gtag('event', 'conversion_lead'); // Google Ads hook

  location.href = WHATSAPP
    ? `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(text)}`
    : `mailto:${EMAIL}?subject=${encodeURIComponent('नया ऑर्डर – AMRIT THOR POWER कॉम्बो किट')}&body=${encodeURIComponent(text)}`;
});
