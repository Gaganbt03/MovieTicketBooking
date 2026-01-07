// PAGE NAVIGATION
function goTo(pageId) {
    document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

let movies = [];
let selectedMovie = "";
let selectedTime = "";

// LOAD MOVIES FROM BACKEND
fetch("http://localhost:5000/movies")
    .then(res => res.json())
    .then(data => {
        movies = data;
        displayMovies();
    })
    .catch(err => console.error("Backend offline:", err));

// DISPLAY MOVIES
function displayMovies() {
    const movieList = document.getElementById("movie-list");
    movieList.innerHTML = "";

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
}

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

// SEAT PAGE
function goToSeatSelection(time) {
    selectedTime = time;
    goTo("seats");

    document.getElementById("chosenMovieSeat").textContent = selectedMovie;
    document.getElementById("chosenTimeSeat").textContent = selectedTime;
    loadSeats();
}

// BUILD SEATS
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

// BOOKING --> backend
function confirmBooking() {
    const selectedSeats = [...document.querySelectorAll(".seat.selected")].map((s, i) => `S${i+1}`);

    fetch("http://localhost:5000/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            movie: selectedMovie,
            time: selectedTime,
            seats: selectedSeats
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("Booking saved:", data);
            document.getElementById("summaryText").textContent =
                `${selectedMovie} at ${selectedTime} — ${selectedSeats.length} seats booked!`;
            goTo("summary");
        })
        .catch(err => alert("Backend not running 😢"));
}

