// home.js

// ELEMENTOS
let mainInput = document.getElementById("mainSearchInput");
let mainBtn = document.getElementById("mainSearchBtn");
let navInput = document.getElementById("navSearchInput");

// FUNÇÃO DE BUSCA
let search = () => {
    let text = mainInput.value.trim() || navInput.value.trim();

    if (!text) {
        alert("Digite algo para pesquisar.");
        return;
    }

    // Redireciona para results.html com a query
    window.location.href = `results.html?q=${encodeURIComponent(text)}`;
};

// EVENTOS DO INPUT PRINCIPAL
mainBtn.addEventListener("click", search);

mainInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") search();
});

// EVENTOS DO INPUT DA NAVBAR
navInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") search();
});


// =============================================
// CARROSSEL
// =============================================
let images = [
    "https://images7.alphacoders.com/119/1194801.jpg",
    "https://images5.alphacoders.com/123/1238044.jpg",
    "https://images5.alphacoders.com/121/1211337.jpg",
    "https://images3.alphacoders.com/120/1203684.png"
];

let currentIndex = 0;
let carouselDiv = document.getElementById("carouselImages");

let loadImages = () => {
    carouselDiv.innerHTML = `
        <img src="${images[currentIndex]}" class="carousel-image">
    `;
};

document.getElementById("nextImg").onclick = () => {
    currentIndex = (currentIndex + 1) % images.length;
    loadImages();
};

document.getElementById("prevImg").onclick = () => {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    loadImages();
};

loadImages();


// =============================================
// ATALHOS RÁPIDOS (QUICK LINKS)
// =============================================
let quickCards = document.querySelectorAll(".quick-card");

quickCards.forEach(card => {
    card.addEventListener("click", () => {
        let type = card.getAttribute("data-type");

        // Ex: results.html?category=armors
        window.location.href = `results.html?category=${type}`;
    });
});
