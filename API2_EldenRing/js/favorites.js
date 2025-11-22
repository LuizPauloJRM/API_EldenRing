// favorites.js
// Página de favoritos: lê o localStorage e exibe os itens salvos.

import { loadLocal, saveLocal, createElement, showError } from "./utils.js";

let container = document.getElementById("favorites-container");

loadFavorites();

/**
 * Carrega favoritos do localStorage
 */
function loadFavorites() {
    let favs = loadLocal("favorites");

    if (!favs || favs.length === 0) {
        showError(container, "Nenhum item favorito encontrado.");
        return;
    }

    renderFavorites(favs);
}

/**
 * Renderiza os cartões dos favoritos na tela
 */
function renderFavorites(favs) {
    container.innerHTML = "";

    for (let item of favs) {

        let card = createElement("div", { class: "card" });

        let img = createElement("img", {
            src: item.image || "./assets/no-image.png",
            alt: item.name
        });

        let name = createElement("h3", {
            class: "card-title",
            text: item.name
        });

        let category = createElement("p", {
            class: "card-category",
            text: item.category || "Sem categoria"
        });

        let removeBtn = createElement("button", {
            class: "remove-btn",
            text: "Remover"
        });

        removeBtn.addEventListener("click", () => removeFavorite(item.id));

        card.appendChild(img);
        card.appendChild(name);
        card.appendChild(category);
        card.appendChild(removeBtn);

        container.appendChild(card);
    }
}

/**
 * Remove item do localStorage e recarrega a tela
 */
function removeFavorite(id) {
    let favs = loadLocal("favorites") || [];

    let updated = favs.filter(item => item.id !== id);

    saveLocal("favorites", updated);

    loadFavorites();
}
