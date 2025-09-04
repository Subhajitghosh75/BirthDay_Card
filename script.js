/* script.js - All interactive behavior for the Birthday Card
   Make sure assets exist at the specified paths:
   - assets/music.mp3
   - assets/voice-note.mp3
   - assets/photos/p1.jpg ... p10.jpg
*/

/* -------------------------
   Configurable values
   ------------------------- */
const girlfriendName = "Payel Ghosh"; // change name here (if needed)
const birthDateISO = "2006-09-15";    // YYYY-MM-DD (Payel's DOB)
const slideInterval = 3500;           // slideshow speed (ms)
const musicElement = document.getElementById("bg-music");
const voiceElement = document.getElementById("voice-note");

/* -------------------------
   Utility: next birthday date
   ------------------------- */
function nextBirthdayFromDOB(dobIso) {
  const dob = new Date(dobIso);
  const now = new Date();
  // birthday this year:
  let candidate = new Date(now.getFullYear(), dob.getMonth(), dob.getDate());
  if (candidate <= now) candidate = new Date(now.getFullYear() + 1, dob.getMonth(), dob.getDate());
  return candidate;
}

/* -------------------------
   Typewriter / typed name
   ------------------------- */
function typeWriter(element, text, speed = 70, cb) {
  element.textContent = "";
  let i = 0;
  const t = setInterval(() => {
    element.textContent += text[i++];
    if (i >= text.length) { clearInterval(t); if (cb) cb(); }
  }, speed);
}

/* -------------------------
   Slideshow logic
   ------------------------- */
(function slideshowInit(){
  const slidesContainer = document.querySelector(".slides");
  const slides = Array.from(slidesContainer.querySelectorAll("img"));
  const caption = document.getElementById("slide-caption");
  const prevBtn = document.getElementById("prev");
  const nextBtn = document.getElementById("next");

  let index = 0;
  function show(i){
    index = (i + slides.length) % slides.length;
    // create small carousel transform to keep center images visible
    const slideWidth = slides[0].getBoundingClientRect().width + 10;
    const viewportWidth = slidesContainer.parentElement.offsetWidth;
    // transform to keep current in a visible position:
    const offset = Math.max(0, index * slideWidth - (viewportWidth - slideWidth));
    slidesContainer.style.transform = `translateX(-${offset}px)`;

    caption.textContent = slides[index].dataset.caption || "";
    // highlight current image
    slides.forEach((s, idx) => s.style.opacity = idx === index ? "1" : "0.7");
  }

  show(0);
  let auto = setInterval(()=> show(index+1), slideInterval);
  prevBtn.addEventListener("click", ()=> { show(index-1); resetAuto(); });
  nextBtn.addEventListener("click", ()=> { show(index+1); resetAuto(); });
  slides.forEach((img, i) => img.addEventListener("click", ()=> { show(i); resetAuto(); }));

  function resetAuto(){ clearInterval(auto); auto = setInterval(()=> show(index+1), slideInterval); }
})();

/* -------------------------
   Floating hearts background
   ------------------------- */
(function createFloatingHearts(){
  const container = document.getElementById("floating-hearts");
  const count = 10;
  for(let i=0;i<count;i++){
    const el = document.createElement("div");
    el.className = "float-heart";
    el.innerHTML = "💚";
    // random positions & animation
    const left = Math.random() * 100;
    const delay = Math.random() * 4;
    const dur = 8 + Math.random()*6;
    el.style.left = left + "%";
    el.style.top = (10 + Math.random()*70) + "%";
    el.style.fontSize = (12 + Math.random()*28) + "px";
    el.style.opacity = 0.7 + Math.random()*0.3;
   el.style.transition = `transform ${dur}s linear ${delay}s, opacity ${dur / 2}s ease-in`;

    container.appendChild(el);
    // animate upward slowly
    setTimeout(()=> {
      el.style.transform = `translateY(-${60 + Math.random() * 60}px) rotate(${Math.random() * 60 - 30}deg)`;

      el.style.opacity = 0.2;
    }, 200 + delay*600);
    // loop
    setInterval(()=> {
      el.style.transition = none;
      el.style.transform = "translateY(0px)";

      el.style.opacity = 0.9;
      setTimeout(()=> {
       el.style.transition = `transform ${8 + Math.random() * 6}s linear, opacity ${4 + Math.random() * 2}s ease-in`;
el.style.transform = `translateY(-${60 + Math.random() * 60}px) rotate(${Math.random() * 60 - 30}deg)`;

        el.style.opacity = 0.2;
      }, 200);
    }, (9000 + Math.random()*8000));
  }
})();

/* -------------------------
   Greeting typed and glow
   ------------------------- */
(function greetInit(){
  const typed = document.getElementById("typed-name");
  const name = girlfriendName;
  typeWriter(typed, `To ${name} —`, 80, () => {

    // sparkle glow after typed
    typed.classList.add("typed-done");
    const subtitle = document.getElementById("her-name");
    subtitle.textContent = name;
    // small glowing animation
    typed.animate([
      { textShadow: "0 0 0 rgba(255,209,102,0)" },
      { textShadow: "0 0 30px rgba(255,209,102,0.45)" }
    ], { duration:1200, iterations:1, easing:"ease-out" });
  });
})();

/* -------------------------
   Countdown timer
   ------------------------- */
(function countdownInit(){
  const target = nextBirthdayFromDOB(birthDateISO);
  const dEl = document.getElementById("days");
  const hEl = document.getElementById("hours");
  const mEl = document.getElementById("mins");
  const sEl = document.getElementById("secs");

  function tick(){
    const now = new Date();
    const diff = target - now;
    if (diff <= 0) {
      dEl.textContent = 0; hEl.textContent = 0; mEl.textContent = 0; sEl.textContent = 0;
      return;
    }
    const days = Math.floor(diff / (1000*60*60*24));
    const hours = Math.floor((diff/(1000*60*60)) % 24);
    const mins = Math.floor((diff/(1000*60)) % 60);
    const secs = Math.floor((diff/1000) % 60);
    dEl.textContent = days;
    hEl.textContent = hours;
    mEl.textContent = mins;
    sEl.textContent = secs;
  }
  tick(); setInterval(tick, 1000);
})();

/* -------------------------
   Heart click reveal & audio control
   ------------------------- */
(function interactionInit(){
  const heartBtn = document.getElementById("heart-btn");
  const finalMessage = document.getElementById("final-message");
  const voice = voiceElement;
  const music = musicElement;
  const playBtn = document.getElementById("play-music");
  const muteBtn = document.getElementById("mute-btn");
  const openGift = document.getElementById("open-gift");
  const fireworksCanvas = document.getElementById("fireworks-canvas");

  // reveal the final message and play voice note
  heartBtn.addEventListener("click", () => {
    finalMessage.style.display = "block";
    finalMessage.setAttribute("aria-hidden", "false");
    // play subtle sound
    try { voice.currentTime = 0; voice.play(); } catch(e){}
    // gently scale heart for effect
    heartBtn.animate([{ transform: "scale(1)" }, { transform: "scale(1.14)" }, { transform: "scale(1)" }], { duration:500 });
  });

  // play/pause music
  playBtn.addEventListener("click", () => {
    if (music.paused) { music.play(); playBtn.textContent = "⏸"; }
    else { music.pause(); playBtn.textContent = "🎵"; }
  });

  // mute/unmute
  muteBtn.addEventListener("click", () => {
    music.muted = !music.muted;
    voice.muted = music.muted;
    muteBtn.textContent = music.muted ? "🔇" : "🔊";
  });

  // open gift -> fireworks + final text
  openGift.addEventListener("click", async () => {
    // fireworks animation show
    runFireworks(fireworksCanvas);
    // final full-screen message (can be styled or animated)
    const detail = document.createElement("div");
    detail.style.position = "fixed";
    detail.style.left = 0;
    detail.style.top = 0;
    detail.style.width = "100%";
    detail.style.height = "100%";
    detail.style.display = "flex";
    detail.style.alignItems = "center";
    detail.style.justifyContent = "center";
    detail.style.zIndex = 9999;
    detail.style.pointerEvents = "none";
    detail.innerHTML = `<h1 style="font-size:clamp(20px,6vw,46px); color:#fff; text-align:center; text-shadow:0 6px 30px rgba(0,0,0,0.6);">
      I’m lucky to have you, ${girlfriendName}. Happy Birthday! 💖
    </h1>`;
    document.body.appendChild(detail);
    setTimeout(()=> { detail.remove(); stopFireworks(fireworksCanvas); }, 7000);
  });

})();

/* -------------------------
   Love letter: letter-by-letter reveal
   ------------------------- */
(function loveLetterInit(){
  const openBtn = document.getElementById("open-letter");
  const loveText = document.getElementById("love-text");
  const letter = `My dearest ${girlfriendName},

তোমার সাথে কাটানো প্রতিটি মুহূর্ত যেন এক মৃদু গানের মতো — উষ্ণ, উজ্জ্বল এবং অর্থপূর্ণ। তোমার হাসি, তোমার হাসি এবং তুমি আমার পাশে আছো জেনে আরামের জন্য আমি কৃতজ্ঞ। আজ আমি তোমাকে উদযাপন করছি — তোমার দয়া, তোমার সৌন্দর্য এবং তুমি যে আলো এনেছো।

Forever yours,
[Subhajit Ghosh] 💚`;

  openBtn.addEventListener("click", () => {
    loveText.textContent = "";
    let i = 0;
    openBtn.disabled = true;
    const t = setInterval(() => {
      loveText.textContent += letter[i++];
      loveText.scrollTop = loveText.scrollHeight;
      if (i >= letter.length) { clearInterval(t); openBtn.disabled = false; }
    }, 28);
  });
})();

/* -------------------------
   Balloon mini-game
   ------------------------- */
(function balloonGameInit(){
  const area = document.getElementById("balloon-area");
  const wishes = [
    "You are my sunshine ☀",
    "Stay smiling always 😊",
    "More adventures together 🚗",
    "I love you to the moon and back 🌙",
    "Cake time soon! 🎂"
  ];
  // create 6 balloons
  for(let i=0;i<6;i++){
    const b = document.createElement("div");
    b.className = "balloon";
   b.style.background = `linear-gradient(180deg, hsl(${120 + i * 18}deg 70% 60%), hsl(${120 + i * 18}deg 60% 40%))`;
b.style.transform = `translateY(${Math.random() * 10}px)`;

    b.title = "Pop me!";
    b.dataset.wish = wishes[i % wishes.length];
    b.addEventListener("click", function pop(){
      // pop animation
      this.style.transform = "scale(0.04) translateY(-20px)";
      this.style.opacity = 0;
      // show wish toast
      showToast(this.dataset.wish);
      // remove after animation
      setTimeout(()=> this.remove(), 450);
    });
    area.appendChild(b);
  }

  function showToast(msg){
    const t = document.createElement("div");
    t.textContent = msg;
    t.style.position = "fixed";
    t.style.left = "50%";
    t.style.transform = "translateX(-50%)";
    t.style.bottom = "12%";
    t.style.padding = "10px 16px";
    t.style.borderRadius = "12px";
    t.style.background = "rgba(0,0,0,0.7)";
    t.style.color = "#fff";
    t.style.zIndex = 9000;
    document.body.appendChild(t);
    setTimeout(()=> t.style.opacity = "0", 2800);
    setTimeout(()=> t.remove(), 3200);
  }
})();

/* -------------------------
   Simple fireworks (canvas) implementation
   ------------------------- */
let fwInterval = null;
function runFireworks(canvas) {
  if (!canvas) return;
  canvas.style.display = "block";
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d");
  const particles = [];
  function createExplosion(x,y){
    const hue = Math.floor(Math.random()*360);
    const count = 36 + Math.floor(Math.random()*36);
    for(let i=0;i<count;i++){
      const a = Math.random()*Math.PI*2;
      const s = 1 + Math.random()*5;
      particles.push({
        x, y,
        vx: Math.cos(a)*s,
        vy: Math.sin(a)*s,
        life: 60 + Math.floor(Math.random()*40),
        hue,
        alpha:1
      });
    }
  }
  // create random bursts
  fwInterval = setInterval(()=>{
    // random bursts around center area
    const x = Math.random()*canvas.width;
    const y = Math.random()*canvas.height*0.6;
    createExplosion(x,y);
  }, 450);

  // animate particles
  function frame(){
    ctx.fillStyle = "rgba(0,0,0,0.16)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    for(let i=particles.length-1;i>=0;i--){
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // gravity
      p.life--;
      p.alpha = Math.max(0, p.life/100);
      ctx.beginPath();
      ctx.fillStyle = `hsla(${p.hue}, 90%, 60%, ${p.alpha})`;
      ctx.arc(p.x, p.y, 2.2, 0, Math.PI*2);
      ctx.fill();
      if (p.life <= 0) particles.splice(i,1);
    }
    requestAnimationFrame(frame);
  }
  frame();

  // stop after timeout
  setTimeout(()=> stopFireworks(canvas), 7000);
}
function stopFireworks(canvas){
  if (fwInterval) clearInterval(fwInterval);
  if (canvas){
    canvas.style.display = "none";
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0,0,canvas.width,canvas.height);
  }
}