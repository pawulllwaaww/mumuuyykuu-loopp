const $ = (id) => document.getElementById(id);

// Mini game pembuka: cocokkan empat pasangan sebelum melihat ucapan.
const gameSymbols = ["👻", "👺", "🤔", "🤨", "👻", "👺", "🤔", "🤨"];
const gameGrid = $("memoryGame");
const gameStatus = $("gameStatus");
const continueButton = $("gameContinue");
let firstCard = null;
let lockBoard = false;
let matchedPairs = 0;
let moves = 0;
const shuffledSymbols = [...gameSymbols].sort(() => Math.random() - 0.5);
shuffledSymbols.forEach((symbol, index) => {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "game-card";
  card.textContent = "?";
  card.setAttribute("aria-label", `Kartu ${index + 1}, tertutup`);
  card.dataset.symbol = symbol;
  card.addEventListener("click", () => {
    if (lockBoard || card.classList.contains("revealed") || card.classList.contains("matched")) return;
    card.textContent = symbol;
    card.classList.add("revealed");
    card.setAttribute("aria-label", `Kartu ${index + 1}, ${symbol}`);
    if (!firstCard) { firstCard = card; return; }
    moves += 1;
    if (firstCard.dataset.symbol === card.dataset.symbol) {
      firstCard.classList.remove("revealed"); firstCard.classList.add("matched");
      card.classList.remove("revealed"); card.classList.add("matched");
      firstCard.disabled = true; card.disabled = true; firstCard = null; matchedPairs += 1;
      if (matchedPairs === 4) {
        gameStatus.textContent = `Yeay! Semua pasangan ketemu dalam ${moves} langkah 💜`;
        continueButton.hidden = false;
      } else { gameStatus.textContent = `Benar! ${matchedPairs} dari 4 pasangan ditemukan.`; }
    } else {
      lockBoard = true; const previous = firstCard; firstCard = null;
      gameStatus.textContent = "Belum cocok, coba ingat simbolnya ya!";
      window.setTimeout(() => {
        previous.textContent = "?"; card.textContent = "?";
        previous.classList.remove("revealed"); card.classList.remove("revealed");
        previous.setAttribute("aria-label", "Kartu tertutup"); card.setAttribute("aria-label", "Kartu tertutup");
        lockBoard = false;
      }, 750);
    }
  });
  gameGrid.appendChild(card);
});
// Playlist lokal: audio saja, berurutan, lalu kembali ke lagu pertama.
const playlist = [
  { title: "Overnight — Kita Lewati Berdua", src: "01-overnight.mp3" },
  { title: "Virgoun — Bukti", src: "02-bukti.mp3" },
  { title: "Andmesh — Cinta Luar Biasa", src: "03-cinta-luar-biasa.mp3" }
];
const backgroundMusic = $("backgroundMusic");
const songTitle = $("songTitle");
let currentSong = 0;

function playSong(index) {
  currentSong = index;
  backgroundMusic.src = playlist[currentSong].src;
  songTitle.textContent = playlist[currentSong].title;
  backgroundMusic.play().catch(() => {
    $("songStatus").textContent = "Tekan tombol play untuk memulai musik 💜";
  });
}

backgroundMusic.addEventListener("ended", () => {
  playSong((currentSong + 1) % playlist.length);
});

continueButton.addEventListener("click", () => {
  // Klik pengunjung memulai audio setelah mini game selesai.
  $("musicPlayer").hidden = false;
  document.getElementById("gameGate").remove();
  document.body.classList.remove("locked");
  document.getElementById("home").scrollIntoView({ behavior: "smooth" });
  playSong(0);
});

const birthday = new Date("2026-12-04T00:00:00+07:00").getTime();

function updateCountdown() {
  const now = Date.now();
  const distance = birthday - now;
  if (distance <= 0) {
    $("days").textContent = "00";
    $("hours").textContent = "00";
    $("minutes").textContent = "00";
    $("seconds").textContent = "00";
    $("countdown-message").textContent = "HARI INI HARI KAMU! Selamat ulang tahun ke-15! 🎂💜";
    return;
  }
  $("days").textContent = String(Math.floor(distance / 86400000)).padStart(2, "0");
  $("hours").textContent = String(Math.floor((distance % 86400000) / 3600000)).padStart(2, "0");
  $("minutes").textContent = String(Math.floor((distance % 3600000) / 60000)).padStart(2, "0");
  $("seconds").textContent = String(Math.floor((distance % 60000) / 1000)).padStart(2, "0");
}
updateCountdown();
setInterval(updateCountdown, 1000);

const confettiBtn = $("confettiBtn");
confettiBtn.addEventListener("click", () => {
  const layer = $("confetti-layer");
  const decorations = ["💜", "♡", "✦", "✨", "🎀", "🌷", "💗", "✧"];
  for (let i = 0; i < 42; i++) {
    const bit = document.createElement("span");
    bit.className = "confetti";
    bit.textContent = decorations[Math.floor(Math.random() * decorations.length)];
    bit.style.left = Math.random() * 100 + "vw";
    bit.style.fontSize = (12 + Math.random() * 18) + "px";
    bit.style.animationDuration = (2.5 + Math.random() * 3.5) + "s";
    bit.style.animationDelay = (Math.random() * 0.8) + "s";
    layer.appendChild(bit);
    bit.addEventListener("animationend", () => bit.remove());
  }
});
