// PAGE NAVIGATION
function goTo(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

// SAMPLE MOVIES
const movies = [
    { title: "KGF 2", poster: "https://m.media-amazon.com/images/I/81ZbZp5Rt-L.jpg"},
    { title: "Pushpa 2", poster: "https://m.media-amazon.com/images/I/71tmfvkYVvL.jpg"},
    { title: "Avatar 2", poster: "https://m.media-amazon.com/images/I/71rXj1VdXWL.jpg"},
    { title: "Jawan", poster: "https://m.media-amazon.com/images/I/81iKk-FDJWL._SL1500_.jpg"},
    { title: "Vikram", poster: "https://m.media-amazon.com/images/I/71sSoZihiML.jpg"},
    { title: "Salar", poster: "https://m.media-amazon.com/images/I/81S0IwWNLkL.jpg"}
];

let selectedMovie = "";
let selectedTime = "";

// LOAD MOVIES
const movieList = document.getElementById("movie-list");
movies.forEach(m => {
    const div = document.createElement("div");
    div.className = "movie-card";
    div.innerHTML = `
      <img src="${m.poster}" alt="">
      <h3>${m.title}</h3>
      <button>View Showtimes</button>
    `;
    div.querySelector("button").onclick = () => pickShowtime(m.title);
    movieList.appendChild(div);
});

// SHOWTIMES
function pickShowtime(title) {
    selectedMovie = title;
    goTo("showtimes");

    document.getElementById("chosenMovie").textContent = title;
    const times = ["10:00 AM", "1:00 PM", "4:00 PM", "8:00 PM"];

    const btns = document.getElementById("timeButtons");
    btns.innerHTML = "";
    times.forEach(t => {
        const b = document.createElement("button");
        b.textContent = t;
        b.onclick = () => goToSeatSelection(t);
        btns.appendChild(b);
    });
}

// SEATS PAGE
function goToSeatSelection(time) {
    selectedTime = time;
    goTo("seats");

    document.getElementById("chosenMovieSeat").textContent = selectedMovie;
    document.getElementById("chosenTimeSeat").textContent = selectedTime;

    loadSeats();
}

// BUILD SEAT GRID
function loadSeats() {
    const seatContainer = document.getElementById("seat-container");
    seatContainer.innerHTML = "";
    for (let i = 1; i <= 60; i++) {
        const seat = document.createElement("div");
        seat.className = "seat";
        seat.onclick = () => {
            seat.classList.toggle("selected");
            updateSummary();
        };
        seatContainer.appendChild(seat);
    }
}

// UPDATE PRICE
function updateSummary() {
    const count = document.querySelectorAll(".seat.selected").length;
    document.getElementById("count").textContent = count;
    document.getElementById("total").textContent = count * 150;
}

// FINAL CONFIRM PAGE
function confirmBooking() {
    const seatCount = document.querySelectorAll(".seat.selected").length;
    document.getElementById("summaryText").textContent =
        `${selectedMovie} at ${selectedTime} — ${seatCount} seats booked!`;
    goTo("summary");
}
