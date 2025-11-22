// classes.js
// Página responsável por listar as classes iniciais do jogo Elden Ring.

import { apiGet } from "./api.js";
import { createElement, showLoader, showError, saveLocal, loadLocal } from "./utils.js";

let container = document.getElementById("classes-list");
let favorites = loadLocal("favorites") || [];

/**
 * Inicializa a página carregando as classes
 */
let init = () => {
    loadClasses();
};

let loadClasses = async () => {
    showLoader(container);

    let url = "https://eldenring.fanapis.com/api/classes?limit=50";

    try {
        let response = await apiGet(url);

        if (!response || !response.data) {
            showError(container, "Nenhuma classe encontrada.");
            return;
        }

        renderClasses(response.data);

    } catch (error) {
        showError(container, "Erro ao carregar classes.");
        console.error(error);
    }
};

/**
 * Renderiza os cards de classes na tela
 */
let renderClasses = (classes) => {
    container.innerHTML = "";

    classes.forEach(item => {
        let card = createElement("div", { class: "class-card" });

        let img = createElement("img", {
            src: item.image || "img/no-image.png",
            alt: item.name
        });

        let title = createElement("h3", { text: item.name });

        let description = createElement("p", {
            text: item.description || "Sem descrição disponível."
        });

        let btnFav = createElement("button", {
            class: "btn-fav",
            text: checkFavorite(item.id) ? "Remover Favorito" : "Favoritar"
        });

        btnFav.addEventListener("click", () => toggleFavorite(item));

        card.appendChild(img);
        card.appendChild(title);
        card.appendChild(description);
        card.appendChild(btnFav);

        container.appendChild(card);
    });
};

/**
 * Verifica se um item está nos favoritos
 */
let checkFavorite = (id) => {
    return favorites.some(f => f.id === id);
};

/**
 * Adiciona ou remove um item dos favoritos
 */
let toggleFavorite = (item) => {
    if (checkFavorite(item.id)) {
        favorites = favorites.filter(f => f.id !== item.id);
    } else {
        favorites.push(item);
    }

    saveLocal("favorites", favorites);
    loadClasses();
};

init();
