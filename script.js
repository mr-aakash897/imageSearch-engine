
// === script.js ===
const accessKey = "write your own unsplash API";
const searchForm = document.getElementById("search-form");
const searchBox = document.getElementById("search-box");
const searchResult = document.getElementById("search-result");
const showMoreBtn = document.getElementById("show-more-btn");
const modeToggle = document.getElementById("mode-toggle");
const modeIcon = document.getElementById("mode-icon");

let keyword = "";
let page = 1;
let recentSearches = [];

async function searchImages() {
  keyword = searchBox.value.trim();
  if (!keyword) return;

  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${keyword}&client_id=${accessKey}&per_page=20`;
  const response = await fetch(url);
  const data = await response.json();

  if (page === 1) {
    searchResult.innerHTML = "";
    updateRecentSearches(keyword);
  }

  const results = data.results;
  results.forEach((result) => {
    const imageWrapper = document.createElement("a");
    imageWrapper.href = result.links.html;
    imageWrapper.target = "_blank";

    const image = document.createElement("img");
    image.src = result.urls.small;
    image.alt = result.alt_description || keyword;
    image.addEventListener("click", (e) => {
      e.preventDefault();
      openImagePreview(result.urls.full);
    });

    imageWrapper.appendChild(image);
    searchResult.appendChild(imageWrapper);
  });

  showMoreBtn.style.display = "block";
}

function openAuthModal(type) {
  document.getElementById("auth-modal").style.display = "block";
  document.getElementById("login-form").style.display = type === "login" ? "block" : "none";
  document.getElementById("register-form").style.display = type === "register" ? "block" : "none";
}

function closeAuthModal() {
  document.getElementById("auth-modal").style.display = "none";
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  modeIcon.textContent = document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
  modeToggle.classList.toggle("rotate");
}

function updateRecentSearches(term) {
  if (recentSearches.includes(term)) return;
  recentSearches.unshift(term);
  if (recentSearches.length > 5) recentSearches.pop();
  console.log("Recent searches:", recentSearches);
}

function openImagePreview(imageUrl) {
  const overlay = document.createElement("div");
  overlay.style.position = "fixed";
  overlay.style.top = 0;
  overlay.style.left = 0;
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.background = "rgba(0,0,0,0.9)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = 10000;

  const image = document.createElement("img");
  image.src = imageUrl;
  image.style.maxWidth = "90%";
  image.style.maxHeight = "90%";
  image.style.borderRadius = "10px";
  image.style.boxShadow = "0 0 20px rgba(0,0,0,0.5)";

  overlay.appendChild(image);
  overlay.addEventListener("click", () => overlay.remove());

  document.body.appendChild(overlay);
}

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  page = 1;
  searchImages();
});

showMoreBtn.addEventListener("click", () => {
  page++;
  searchImages();
});

modeToggle.addEventListener("click", toggleDarkMode);

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAuthModal();
});
