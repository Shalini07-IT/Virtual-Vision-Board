const columns = document.querySelectorAll(".column");
const modal = document.getElementById("modal");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

const quotes = [
  "Dream big, act bigger.",
  "Small steps every day.",
  "Discipline creates freedom.",
  "You are closer than you think.",
  "Consistency beats talent."
];

function save() {
  localStorage.setItem("goals", JSON.stringify(goals));
}

function render() {
  columns.forEach(c => c.innerHTML = `<h2>${c.dataset.status}</h2>`);

  goals.forEach(g => {
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.dataset.id = g.id;

    card.innerHTML = `
      <div>${g.emoji || "✨"} <b>${g.title}</b></div>
      <small>${g.desc}</small>
      <div class="progress-bar"><div style="width:${g.progress}%"></div></div>
      <small>${g.progress}%</small>
    `;

    card.addEventListener("dragstart", e => {
      e.dataTransfer.setData("id", g.id);
    });

    document.querySelector(`[data-status="${g.status}"]`).appendChild(card);
  });

  updateStats();
}

columns.forEach(col => {
  col.addEventListener("dragover", e => e.preventDefault());
  col.addEventListener("drop", e => {
    const id = e.dataTransfer.getData("id");
    const goal = goals.find(g => g.id == id);
    goal.status = col.dataset.status;

    if (goal.status === "done") triggerConfetti();
    save();
    render();
  });
});

document.getElementById("addBtn").onclick = () => modal.classList.remove("hidden");
document.getElementById("close").onclick = () => modal.classList.add("hidden");

document.getElementById("save").onclick = () => {
  const g = {
    id: Date.now(),
    title: title.value,
    desc: desc.value,
    category: category.value,
    date: date.value,
    priority: priority.value,
    emoji: emoji.value,
    image: image.value,
    progress: progress.value || 0,
    status: "dreams"
  };

  if (!g.title) return shake(title);

  goals.push(g);
  save();
  render();
  modal.classList.add("hidden");
};

function shake(el){
  el.style.animation = "shake 0.3s";
  setTimeout(()=>el.style.animation="",300);
}

function updateStats(){
  document.getElementById("totalGoals").innerText = goals.length;
  document.getElementById("completedGoals").innerText = goals.filter(g=>g.status==="done").length;

  let avg = goals.length ? Math.round(goals.reduce((a,b)=>a+Number(b.progress),0)/goals.length) : 0;
  document.getElementById("progressPercent").innerText = avg + "%";

  document.getElementById("quoteBox").innerText =
    quotes[Math.floor(Math.random()*quotes.length)];
}

function triggerConfetti(){
  const confetti = document.getElementById("confetti");
  for(let i=0;i<60;i++){
    const c = document.createElement("div");
    c.style.position="absolute";
    c.style.width="6px";
    c.style.height="6px";
    c.style.background=`hsl(${Math.random()*360},100%,60%)`;
    c.style.left=Math.random()*100+"%";
    c.style.top="-10px";
    confetti.appendChild(c);

    let fall = setInterval(()=>{
      c.style.top = c.offsetTop + 5 + "px";
      if(c.offsetTop > window.innerHeight) c.remove();
    },20);
  }
}

render();

/* PARTICLES */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let particles = Array.from({length:60}, () => ({
  x:Math.random()*canvas.width,
  y:Math.random()*canvas.height,
  r:Math.random()*3,
  dx:(Math.random()-0.5),
  dy:(Math.random()-0.5)
}));

function animate(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    p.x+=p.dx;
    p.y+=p.dy;

    if(p.x<0||p.x>canvas.width)p.dx*=-1;
    if(p.y<0||p.y>canvas.height)p.dy*=-1;

    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle="rgba(0,255,255,0.6)";
    ctx.fill();
  });
  requestAnimationFrame(animate);
}
animate();
