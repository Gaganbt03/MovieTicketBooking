// ========= DOM ELEMENTS =========
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
const slider = document.getElementById("slider");
const dotsContainer = document.getElementById("dots");
const prev = document.getElementById("prev");
const next = document.getElementById("next");

const movieList = document.getElementById("movieList");
const selectedMovieBanner = document.getElementById("selectedMovieBanner");
const seats = document.getElementById("seats");
const seatGrid = document.getElementById("seatGrid");
const summary = document.getElementById("summary");

const checkoutBtn = document.getElementById("checkoutBtn");
const checkout = document.getElementById("checkout");
const step1 = document.getElementById("step1");
const step2 = document.getElementById("step2");
const nextStep = document.getElementById("nextStep");
const payBtn = document.getElementById("payBtn");

const successModal = document.getElementById("success-modal");
const ticketText = document.getElementById("ticketText");
const downloadBtn = document.getElementById("downloadBtn");
const homeBtn = document.getElementById("homeBtn");

const inputName = document.getElementById("name");
const inputEmail = document.getElementById("email");
const inputCard = document.getElementById("card");
const bankSelect = document.getElementById("bank");

const dot1 = document.getElementById("dot1");
const dot2 = document.getElementById("dot2");


// ========= MOVIES =========
const movies = [
  { id:1,title:"Avengers Endgame",poster:"https://image.tmdb.org/t/p/original/ulzhLuWrPK07P1YkdWQLZnQh1JL.jpg",genre:["Action"],rating:4.8,times:["10AM","1PM","4PM"],price:250},
  { id:2,title:"Interstellar",poster:"https://image.tmdb.org/t/p/original/rAiYTfKGqDCRIIqo664sY9XZIvQ.jpg",genre:["Sci-Fi"],rating:4.7,times:["11AM","2PM","5PM"],price:260},
  { id:3,title:"Inception",poster:"https://image.tmdb.org/t/p/original/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg",genre:["Thriller"],rating:4.9,times:["9AM","1PM","7PM"],price:240},
  { id:4,title:"Joker",poster:"https://image.tmdb.org/t/p/original/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",genre:["Drama"],rating:4.6,times:["11AM","3PM","6PM"],price:220},
  { id:5,title:"The Dark Knight",poster:"https://image.tmdb.org/t/p/original/qJ2tW6WMUDux911r6m7haRef0WH.jpg",genre:["Action"],rating:4.9,times:["10AM","4PM","8PM"],price:270},
  { id:6,title:"Spider-Man No Way Home",poster:"https://image.tmdb.org/t/p/original/5weKu49pzJCt06OPpjvT80efnQj.jpg",genre:["Action"],rating:4.4,times:["2PM","6PM","9PM"],price:260}
];


// ========= NAV MENU =========
menuBtn.onclick = () => navLinks.classList.toggle('show');


// ========= SLIDER =========
let current = 0;
const heroImgs = movies.slice(0,5).map(m => m.poster);

heroImgs.forEach((img, i) => {
  const div = document.createElement('div');
  div.className = `slide${i===0?" active":""}`;
  div.style.backgroundImage = `url(${img})`;
  slider.appendChild(div);

  const dot = document.createElement('div');
  dot.className = `dot${i===0?" active":""}`;
  dot.onclick = () => go(i);
  dotsContainer.appendChild(dot);
});

const slides = [...document.querySelectorAll('.slide')];
const dots = [...document.querySelectorAll('.dot')];

function go(n){
  slides[current].classList.remove('active');
  dots[current].classList.remove('active');
  current = (n + slides.length) % slides.length;
  slides[current].classList.add('active');
  dots[current].classList.add('active');
}
setInterval(() => go(current + 1), 4000);
prev.onclick = () => go(current - 1);
next.onclick = () => go(current + 1);


// ========= MOVIE LIST =========
let selectedMovie = null, selectedTime = null;
movies.forEach(m=>{
  const card = document.createElement('div');
  card.className = 'movie-card';
  card.innerHTML = `
    <img src="${m.poster}">
    <div class="movie-info">
      <h3>${m.title}</h3>
      <span>${m.genre} • ⭐${m.rating}</span>
      <div class="times">
        ${m.times.map(t=>`<button data-id="${m.id}" data-time="${t}">${t}</button>`).join("")}
      </div>
    </div>`;
  movieList.appendChild(card);
});

movieList.onclick = e=>{
  if(e.target.tagName==="BUTTON"){
    selectedMovie = movies.find(m=>m.id==e.target.dataset.id);
    selectedTime = e.target.dataset.time;
    selectedMovieBanner.innerHTML = `Selected: <b>${selectedMovie.title}</b> • ${selectedTime}`;
    selectedMovieBanner.style.display = 'block';
    seats.style.display = 'block';
    window.scrollTo({top: seats.offsetTop - 60, behavior:'smooth'});
    buildSeats();
  }
};


// ========= SEATS =========
let selectedSeats = [];
const rows = 5, cols = 10;

function buildSeats(){
  seatGrid.innerHTML = "";
  selectedSeats = [];
  for(let r=0;r<rows;r++){
    for(let c=0;c<cols;c++){
      const seat = document.createElement('div');
      seat.className = "seat";
      seat.onclick = ()=>toggleSeat(seat,r,c);
      seatGrid.appendChild(seat);
    }
  }
  updateSummary();
}

function toggleSeat(seat,r,c){
  seat.classList.toggle('selected');
  const key = `${r}-${c}`;
  seat.classList.contains('selected')
    ? selectedSeats.push(key)
    : selectedSeats=selectedSeats.filter(s=>s!==key);
  updateSummary();
}

function updateSummary(){
  if(!selectedMovie) return;
  summary.innerHTML =
    `Seats: <b>${selectedSeats.length}</b> • Total: <b>₹${selectedSeats.length * selectedMovie.price}</b>`;
}


// ========= CHECKOUT =========
checkoutBtn.onclick = ()=>{
  if(!selectedSeats.length) return alert("Please select at least 1 seat 😄");
  seats.style.display="none";
  checkout.style.display="block";
  step1.style.display="block";
  window.scrollTo({top: checkout.offsetTop -60, behavior:"smooth"});
};

nextStep.onclick = ()=>{
  if(!inputName.value.trim() || !inputEmail.value.trim()){
    if(!inputName.value) inputName.classList.add('error');
    if(!inputEmail.value) inputEmail.classList.add('error');
    return;
  }
  dot1.classList.remove('active');
  dot2.classList.add('active');
  step1.style.display="none";
  step2.style.display="block";
};


// ========= PAYMENT =========
payBtn.onclick = ()=>{
  if(!bankSelect.value.trim()) return bankSelect.classList.add('error');
  if(!inputCard.value.trim()) return inputCard.classList.add('error');
  showSuccess();
};


// ========= SUCCESS =========
function showSuccess(){
  checkout.style.display="none";
  successModal.style.display="flex";
  ticketText.innerText=
    `${selectedMovie.title} • ${selectedTime}
Seats: ${selectedSeats.length}
Paid using: ${bankSelect.value}`;
}


// ========= DOWNLOAD =========
downloadBtn.onclick = ()=>{
  alert("🎟 Ticket Downloaded Successfully!");
  reset();
};


// ========= HOME BUTTON =========
homeBtn.onclick = ()=> reset();


// ========= RESET =========
function reset(){
  successModal.style.display="none";
  selectedSeats=[];
  selectedMovie=null;
  selectedTime=null;
  selectedMovieBanner.style.display="none";
  seats.style.display="none";
  checkout.style.display="none";
  seatGrid.innerHTML="";
  summary.innerHTML="";
  inputName.value="";
  inputEmail.value="";
  inputCard.value="";
  bankSelect.value="";
  dot1.classList.add('active');
  dot2.classList.remove('active');
  window.scrollTo({top:0,behavior:"smooth"});
}

